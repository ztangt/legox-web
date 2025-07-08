import IPagination from '@/components/iPagination/iPagination';
import { Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useRef, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import styles from '../index.less';
import { colorList, getColumnsList } from './config';
import SearchCom from './searchCom';

const Index = ({ dispatch, warnBudget }) => {
    const { list, currentHeight, limit, currentPage, returnCount, loading, numberInfo } = warnBudget;
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        //获取管理单位
        dispatch({ type: 'warnBudget/getOrgList' });
        setColumns(getColumnsList(warnBudget));
        dispatch({ type: 'warnBudget/getNumberInfo' });
    }, []);

    useEffect(() => {
        limit > 0 && getList(1, limit);
    }, [limit]);

    const formInfo = useRef({ ...warnBudget.formInfo });
    useEffect(() => {
        formInfo.current = { ...warnBudget.formInfo };
    }, [warnBudget.formInfo]);

    const getList = (newStart, newLimit) => {
        dispatch({ type: 'warnBudget/updateStates', payload: { loading: true } });
        dispatch({ type: 'warnBudget/getList', payload: { ...formInfo.current, start: newStart, limit: newLimit } });
    };

    //切换分页
    const changePage = (nextPage, size) => {
        if (size !== limit) {
            dispatch({ type: 'warnBudget/updateStates', payload: { limit: size } });
        } else {
            getList(nextPage, size);
        }
    };
    return (
        <div id="warnBudget_warp" className={styles.warnBudget_warp}>
            <Spin spinning={loading}>
                <SearchCom />
                <ColumnDragTable
                    listHead={'warnBudget_list_head'}
                    rowKey={'cashierInfoId'}
                    taskType="MONITOR"
                    tableLayout="fixed"
                    modulesName="warnBudget"
                    scroll={{ y: currentHeight - 30 }}
                    dataSource={list}
                    pagination={false}
                    showSorterTooltip={false}
                    columns={columns}
                    bordered
                />
                <div className={styles.warnMessage}>
                    <div className={'mr10'}>预警提示</div>
                    {colorList.map((item, index) => {
                        return (
                            <div key={index} className="flex flex_align_center mr5">
                                <div style={{ backgroundColor: item.color }} className={styles.numberItem}>
                                    {numberInfo[item.keyName]
                                        ? numberInfo[item.keyName] > 999
                                            ? '999+'
                                            : numberInfo[item.keyName]
                                        : 0}
                                </div>
                                <div>{item.label}</div>
                            </div>
                        );
                    })}
                </div>
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

export default connect(({ warnBudget }) => ({ warnBudget }))(Index);
