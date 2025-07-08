import { Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useRef } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import { columns } from './config';
import SearchCom from './searchCom';
const Index = ({ dispatch, cashVaultDetail }) => {
    const { list, currentHeight, currentPage, returnCount, limit, loading } = cashVaultDetail;

    useEffect(() => {
        limit > 0 && getList(1, limit);
    }, [limit]);

    //保存表单信息
    const formInfo = useRef({ ...cashVaultDetail.formInfo });
    useEffect(() => {
        formInfo.current = { ...cashVaultDetail.formInfo };
    }, [cashVaultDetail.formInfo]);

    // 现金库存明细列表查询
    const getList = (newStart, newLimit) => {
        dispatch({
            type: 'cashVaultDetail/updateStates',
            payload: { loading: true },
        });
        dispatch({
            type: 'cashVaultDetail/getList',
            payload: { ...formInfo.current, start: newStart, limit: newLimit },
        });
    };
    const changePage = (nextPage, size) => {
        if (size !== limit) {
            dispatch({
                type: 'cashVaultDetail/updateStates',
                payload: { limit: size },
            });
        } else {
            getList(nextPage, size);
        }
    };

    return (
        <Spin spinning={loading}>
            <SearchCom />
            <ColumnDragTable
                listHead={'cashVaultDetail_list_head'}
                rowKey={'number'}
                taskType="MONITOR"
                tableLayout="fixed"
                modulesName="cashVaultDetail"
                columns={columns}
                scroll={{ y: currentHeight }}
                dataSource={list}
                pagination={false}
                showSorterTooltip={false}
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

export default connect(({ cashVaultDetail }) => ({
    cashVaultDetail,
}))(Index);
