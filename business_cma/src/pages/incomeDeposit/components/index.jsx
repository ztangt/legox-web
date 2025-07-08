import { Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useRef, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import { getColumnsList } from './config';
import IncomeDepositModal from './incomeDepositModal';
import SearchCom from './searchCom';

const incomeDepositData = ({ dispatch, incomeDeposit }) => {
    // 弹窗显隐
    const [modalShow, setModalShow] = useState(false);
    const [columns, setColumns] = useState([]);
    const [chooseInfo, setChooseInfo] = useState({}); //选中的信息
    const { list, currentHeight, currentPage, returnCount, limit, isInit, loading } = incomeDeposit;

    //获取枚举
    useEffect(() => {
        dispatch({ type: 'incomeDeposit/getDictList' });
        dispatch({ type: 'incomeDeposit/findLoginUserByIdAndRoleId' }); //获取管理单位
    }, []);

    //获取列表
    useEffect(() => {
        if (isInit && limit > 0) {
            getList(1, limit);
        }
    }, [limit, isInit]);

    //初始化columns
    useEffect(() => {
        let colList = [
            {
                title: '操作',
                fixed: 'right',
                render: (text, record) => {
                    return (
                        <div className="primaryColor mr8" onClick={() => openModal(record)}>
                            收入送存登记
                        </div>
                    );
                },
            },
        ];
        isInit && setColumns(getColumnsList(incomeDeposit, colList));
    }, [isInit]);
    // 现金送存登记
    const openModal = (record) => {
        setChooseInfo({ ...record });
        setModalShow(true);
    };

    //保存表单信息
    const formInfo = useRef({ ...incomeDeposit.formInfo });
    useEffect(() => {
        formInfo.current = { ...incomeDeposit.formInfo };
    }, [incomeDeposit.formInfo]);

    const getList = (newStart, newLimit) => {
        dispatch({
            type: 'incomeDeposit/updateStates',
            payload: {
                loading: true,
            },
        });
        dispatch({
            type: 'incomeDeposit/getList',
            payload: { ...formInfo.current, start: newStart, limit: newLimit },
        });
    };
    const changePage = (nextPage, size) => {
        if (size !== limit) {
            dispatch({
                type: 'incomeDeposit/updateStates',
                payload: {
                    limit: size,
                },
            });
        } else {
            getList(nextPage, size);
        }
    };

    return (
        <Spin spinning={loading}>
            <SearchCom />
            <ColumnDragTable
                listHead={'incomeCollect_list_head'}
                rowKey={'ID'}
                taskType="MONITOR"
                tableLayout="fixed"
                modulesName="incomeDeposit"
                scroll={{ y: currentHeight }}
                dataSource={list}
                pagination={false}
                showSorterTooltip={false}
                columns={columns}
                bordered
            />
            <IPagination
                current={currentPage}
                total={returnCount}
                onChange={changePage}
                pageSize={limit}
                isRefresh={true}
                refreshDataFn={() => {
                    getList(currentPage, limit);
                }}
            />
            {modalShow && <IncomeDepositModal info={chooseInfo} changeVisible={(isShow) => setModalShow(isShow)} />}
        </Spin>
    );
};

export default connect(({ incomeDeposit, layoutG }) => ({
    incomeDeposit,
    layoutG,
}))(incomeDepositData);
