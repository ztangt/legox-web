import { Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useRef, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import CashExtractModal from './cashExtractModal';
import { getColumnsList } from './config';
import SearchCom from './searchCom';

const CashExtractData = ({ dispatch, cashExtract }) => {
    // 弹窗显隐
    const [modalShow, setModalShow] = useState(false);
    const [columns, setColumns] = useState([]);
    const [chooseInfo, setChooseInfo] = useState({}); //选中的信息

    const { list, currentHeight, currentPage, returnCount, limit, isInit, loading } = cashExtract;

    //获取枚举
    useEffect(() => {
        dispatch({ type: 'cashExtract/getDictList' });
        dispatch({ type: 'cashExtract/findLoginUserByIdAndRoleId' });
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
                        <div className="flex">
                            <div className="primaryColor mr8" onClick={() => openModal(record, 0)}>
                                登记
                            </div>
                            <div className="primaryColor" onClick={() => openModal(record, 1)}>
                                修改
                            </div>
                        </div>
                    );
                },
            },
        ];
        isInit && setColumns(getColumnsList(cashExtract, colList));
    }, [isInit]);

    //保存表单信息
    const formInfo = useRef({ ...cashExtract.formInfo });
    useEffect(() => {
        formInfo.current = { ...cashExtract.formInfo };
    }, [cashExtract.formInfo]);

    const getList = (newStart, newLimit) => {
        dispatch({
            type: 'cashExtract/updateStates',
            payload: {
                loading: true,
            },
        });
        dispatch({
            type: 'cashExtract/getList',
            payload: { ...formInfo.current, start: newStart, limit: newLimit },
        });
    };
    // 列表登记/修改
    const openModal = (record, queryType) => {
        setChooseInfo({ ...record, queryType });
        setModalShow(true);
    };

    //切换分页
    const changePage = (nextPage, size) => {
        if (size !== limit) {
            dispatch({
                type: 'cashExtract/updateStates',
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
                listHead={'cashExtract_list_head'}
                rowKey={'ID'}
                taskType="MONITOR"
                tableLayout="fixed"
                modulesName="cashExtract"
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

            {/* 弹窗显隐 */}
            {modalShow && <CashExtractModal info={chooseInfo} changeVisible={(isShow) => setModalShow(isShow)} />}
        </Spin>
    );
};

export default connect(({ cashExtract, layoutG }) => ({
    cashExtract,
    layoutG,
}))(CashExtractData);
