import { Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useRef, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import { getColumnsList } from './config';
import SearchCom from './searchCom';

const Container = ({ dispatch, yqPaySettlement }) => {
    const { list, currentHeight, limit, currentPage, returnCount, isInit, loading } = yqPaySettlement;

    //初始化columns
    useEffect(() => {
        dispatch({ type: 'yqPaySettlement/getOrgList' }); //获取管理单位
        dispatch({ type: 'yqPaySettlement/getDictList' }); //获取字典
    }, []);

    useEffect(() => {
        limit > 0 && getList(1, limit);
    }, [limit]);

    //初始化columns
    const [columns, setColumns] = useState([]);
    useEffect(() => {
        isInit && setColumns(getColumnsList(yqPaySettlement));
    }, [isInit]);

    //保存表单信息
    const formInfo = useRef({ ...yqPaySettlement.formInfo });
    useEffect(() => {
        formInfo.current = { ...yqPaySettlement.formInfo };
    }, [yqPaySettlement.formInfo]);
    const getList = (startNum, limitNum, newSort) => {
        dispatch({
            type: 'yqPaySettlement/getList',
            payload: { ...formInfo.current, start: startNum, limit: limitNum },
        });
        changeSelect([], []);
    };

    //切换分页
    const changePage = (nextPage, size) => {
        if (size !== limit) {
            dispatch({ type: 'yqPaySettlement/updateStates', payload: { limit: size } });
        } else {
            getList(nextPage, size);
        }
    };

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    // const changeSelect = (selectedRowKeys, selectedRows) => {
    //     let numberNoList = selectedRows.map((item) => item.numberNo);//筛选选中的单据编号
    //     let newList = list.filter((item) => numberNoList.includes(item.numberNo));//与选中的单据编号相同的数据也要选中
    //     let newSelectedRowKeys = newList.map((item) => item.id);//选中的数据的id
    //     console.log('选中的keys', newSelectedRowKeys);
    //     console.log('选中的数据', newList);
    //     setSelectedRowKeys(newSelectedRowKeys);
    //     setSelectedRows(newList);
    // };

    const changeSelect = (rowKeys = [], rows = []) => {
        setSelectedRowKeys(rowKeys);
        setSelectedRows(rows);
    };

    let rowSelection = {
        type: 'checkbox',
        // onChange: changeSelect,
        selectedRowKeys,

        //用户手动选择/取消选择某行的回调
        onSelect: (record, selected) => {
            if (selected) {
                //选中，相同单据编号一起选中
                let { numberNo } = record;
                let newRows = list.filter((item) => item.numberNo == numberNo);
                newRows = [...selectedRows, ...newRows];
                let newRowKeys = newRows.map((item) => item.id);
                changeSelect(newRowKeys, newRows);
            } else {
                //反选，相同单据编号的一起取消选中
                let { numberNo } = record;
                let newRows = selectedRows.filter((item) => item.numberNo !== numberNo);
                let newRowKeys = newRows.map((item) => item.id);
                changeSelect(newRowKeys, newRows);
            }
        },
        //用户手动选择/取消选择所有行的回调
        onSelectAll: (selected) => {
            if (selected) {
                let rowKeys = list.map((item) => item.id);
                changeSelect(rowKeys, [...list]);
            } else {
                changeSelect();
            }
        },
    };
    return (
        <div>
            <Spin spinning={loading}>
                <SearchCom
                    getList={getList}
                    selectedRows={selectedRows}
                    selectedRowKeys={selectedRowKeys}
                    changeSelect={changeSelect}
                />
                <ColumnDragTable
                    listHead={'yqPaySettlement_list_head'}
                    rowKey={'id'}
                    taskType="MONITOR"
                    rowSelection={rowSelection}
                    tableLayout="fixed"
                    modulesName="yqPaySettlement"
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
        </div>
    );
};

export default connect(({ yqPaySettlement }) => ({
    yqPaySettlement,
}))(Container);
