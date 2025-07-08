import { Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useRef } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import { columns } from './config';
import SearchCom from './searchCom';

const Index = ({ dispatch, cashDayInOut }) => {
    const { list, currentHeight, currentPage, returnCount, limit, loading } = cashDayInOut;
    useEffect(() => {
        //获取管理单位
        dispatch({
            type: 'cashDayInOut/findLoginUserByIdAndRoleId',
        });
    }, []);

    useEffect(() => {
        // limit有值再请求接口
        limit && getList(1, limit);
    }, [limit]);

    //保存表单信息
    const formInfo = useRef({ ...cashDayInOut.formInfo });
    useEffect(() => {
        formInfo.current = { ...cashDayInOut.formInfo };
    }, [cashDayInOut.formInfo]);

    // 现金领用登记列表查询
    const getList = (newStart, newLimit) => {
        dispatch({
            type: 'cashDayInOut/updateStates',
            payload: { loading: true },
        });
        dispatch({
            type: 'cashDayInOut/getList',
            payload: { ...formInfo.current, start: newStart, limit: newLimit },
        });
    };
    const changePage = (nextPage, size) => {
        if (limit !== size) {
            dispatch({
                type: 'cashDayInOut/updateStates',
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
            <SearchCom getList={getList} />
            <ColumnDragTable
                listHead={'cashDayInOut_list_head'}
                rowKey={'accountNumber'}
                taskType="MONITOR"
                tableLayout="fixed"
                modulesName="cashDayInOut"
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
        </Spin>
    );
};

export default connect(({ cashDayInOut }) => ({
    cashDayInOut,
}))(Index);
