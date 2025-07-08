import { message, Spin } from 'antd';
import { connect } from 'dva';
import { useEffect } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import { allColumns, noUnpaidColumns } from './config';
import SearchCom from './searchCom';

const Container = ({ dispatch, yqPayment }) => {
    const {
        currentHeight,
        list, //表格列表
        limit,
        currentPage,
        returnCount,
        formData,
        ids,
        loading,
    } = yqPayment;

    useEffect(() => {
        dispatch({
            type: 'yqPayment/getUnitList',
        });
    }, []);

    // 获取列表数据
    const getList = (curPage, curSize) => {
        dispatch({
            type: 'yqPayment/updateStates',
            payload: {
                loading: true,
            },
        });
        dispatch({
            type: 'yqPayment/getList',
            payload: { limit: curSize ? curSize : limit, start: curPage, ...formData },
        });
    };

    // 分页
    const changePage = (nextPage, size) => {
        if (!formData.startTime || !formData.endTime || !formData.coCode) {
            return message.error('请填写必填项');
        }
        getList(nextPage, size);
    };

    const onSelectChange = (record, selected) => {
        if (selected) {
            //选中，相同单据编号一起选中
            let { relateBillNo } = record;
            let newRows = list.filter((item) => item.relateBillNo == relateBillNo);
            let newIds = newRows.map((item) => item.id);
            let allIds = [...ids, ...newIds];
            console.log(allIds, '--->选中的Ids');
            dispatch({
                type: 'yqPayment/updateStates',
                payload: {
                    ids: allIds,
                },
            });
        } else {
            let delId = record.id;
            let newIds = ids.filter((item) => item !== delId);
            console.log(newIds, '--->选中的Ids');
            dispatch({
                type: 'yqPayment/updateStates',
                payload: {
                    ids: newIds,
                },
            });
        }
    };

    const onSelectAll = (selected) => {
        if (selected) {
            let newIds = list.map((item) => item.id);
            console.log(newIds, '--->选中的Ids');
            dispatch({
                type: 'yqPayment/updateStates',
                payload: {
                    ids: newIds,
                },
            });
        } else {
            console.log([], '--->选中的Ids');
            dispatch({
                type: 'yqPayment/updateStates',
                payload: {
                    ids: [],
                },
            });
        }
    };
    return (
        <Spin spinning={loading}>
            <div id="dom_container_cma">
                <SearchCom />
                <ColumnDragTable
                    tableLayout="fixed"
                    modulesName="yqPayment"
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: ids,
                        onSelect: onSelectChange,
                        onSelectAll: onSelectAll,
                    }}
                    taskType="MONITOR"
                    rowKey="id"
                    dataSource={list}
                    pagination={false}
                    bordered={true}
                    showSorterTooltip={false}
                    columns={formData.payStatus !== 'unpaid' ? allColumns : noUnpaidColumns}
                    scroll={{ y: currentHeight }}
                />
                <IPagination
                    current={currentPage}
                    total={returnCount}
                    onChange={changePage}
                    pageSize={limit}
                    isRefresh={true}
                    refreshDataFn={() => {
                        getList(currentPage);
                    }}
                />
            </div>
        </Spin>
    );
};

export default connect(({ yqPayment }) => ({
    yqPayment,
}))(Container);
