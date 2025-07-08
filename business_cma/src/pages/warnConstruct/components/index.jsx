import IPagination from '@/components/iPagination/iPagination';
import { Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useRef, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import { getColumnsList } from './config';
import SearchCom from './searchCom';

const Index = ({ dispatch, warnConstruct }) => {
    const { list, currentHeight, limit, currentPage, returnCount, loading, isInit } = warnConstruct;
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        //获取管理单位
        dispatch({ type: 'warnConstruct/getOrgList' });
        setColumns(getColumnsList(warnConstruct));
    }, []);

    useEffect(() => {
        isInit && limit > 0 && getList(1, limit, warnConstruct.formInfo);
    }, [limit, isInit]);

    useEffect(() => {
        isInit && dispatch({ type: 'warnConstruct/getPercent', payload: { ...warnConstruct.formInfo } });
    }, [isInit]);

    const formInfo = useRef({ ...warnConstruct.formInfo });
    useEffect(() => {
        formInfo.current = { ...warnConstruct.formInfo };
    }, [warnConstruct.formInfo, isInit]);

    const getList = (newStart, newLimit, firForm) => {
        let postForm = firForm ? firForm : formInfo.current;
        dispatch({ type: 'warnConstruct/updateStates', payload: { loading: true } });
        dispatch({ type: 'warnConstruct/getList', payload: { ...postForm, start: newStart, limit: newLimit } });
    };

    //切换分页
    const changePage = (nextPage, size) => {
        if (size !== limit) {
            dispatch({ type: 'warnConstruct/updateStates', payload: { limit: size } });
        } else {
            getList(nextPage, size);
        }
    };
    return (
        <div id="warnConstruct_warp">
            <Spin spinning={loading}>
                <SearchCom />
                <ColumnDragTable
                    listHead={'warnConstruct_list_head'}
                    rowKey={'cashierInfoId'}
                    taskType="MONITOR"
                    tableLayout="fixed"
                    modulesName="warnConstruct"
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

export default connect(({ warnConstruct }) => ({ warnConstruct }))(Index);
