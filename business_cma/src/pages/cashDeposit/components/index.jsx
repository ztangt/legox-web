import { Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useRef, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import CashDepositModal from './cashDepositModal';
import { getColumnsList } from './config';
import SearchCom from './searchCom';

const CashDepositData = ({ dispatch, cashDeposit }) => {
    // 弹窗显隐
    const [modalShow, setModalShow] = useState(false);
    const [columns, setColumns] = useState([]);
    const [chooseInfo, setChooseInfo] = useState({}); //选中的信息
    const { list, currentHeight, currentPage, returnCount, limit, isInit, loading } = cashDeposit;
    //获取枚举
    useEffect(() => {
        dispatch({ type: 'cashDeposit/getDictList' });
        dispatch({ type: 'cashDeposit/findLoginUserByIdAndRoleId' }); //获取管理单位
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
                            余额送存登记
                        </div>
                    );
                },
            },
        ];
        isInit && setColumns(getColumnsList(cashDeposit, colList));
    }, [isInit]);
    // 现金送存登记
    const openModal = (record) => {
        setChooseInfo({ ...record });
        setModalShow(true);
    };

    //保存表单信息
    const formInfo = useRef({ ...cashDeposit.formInfo });
    useEffect(() => {
        formInfo.current = { ...cashDeposit.formInfo };
    }, [cashDeposit.formInfo]);

    const getList = (newStart, newLimit) => {
        dispatch({
            type: 'cashDeposit/updateStates',
            payload: {
                loading: true,
            },
        });
        dispatch({
            type: 'cashDeposit/getList',
            payload: { ...formInfo.current, start: newStart, limit: newLimit },
        });
    };
    const changePage = (nextPage, size) => {
        if (size !== limit) {
            dispatch({
                type: 'cashDeposit/updateStates',
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
                listHead={'cashDeposit_list_head'}
                rowKey={'ID'}
                taskType="MONITOR"
                tableLayout="fixed"
                modulesName="cashDeposit"
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
            {modalShow && <CashDepositModal info={chooseInfo} changeVisible={(isShow) => setModalShow(isShow)} />}
        </Spin>
    );
};

export default connect(({ cashDeposit, layoutG }) => ({
    cashDeposit,
    layoutG,
}))(CashDepositData);
