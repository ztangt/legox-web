import { Empty, Spin } from 'antd';
import { connect } from 'dva';
import { useEffect } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import styles from '../index.less';
import { baTableColumns, zbaTableColumns } from './config';
import SearchCom from './searchCom';

const Container = ({ dispatch, yqBalance }) => {
    const { currentHeight, list, isZero, loading } = yqBalance;
    //获取单位列表
    useEffect(() => {
        dispatch({
            type: 'yqBalance/getUnitList',
        });
    }, []);

    return (
        <Spin spinning={loading}>
            <div id="dom_container_cma">
                <SearchCom />
                {isZero == 0 ? (
                    <div>
                        <div className={styles.titleText}>普通账户交易明细表</div>
                        <ColumnDragTable
                            tableLayout="fixed"
                            modulesName="yqBalance"
                            rowKey={'id'}
                            taskType="MONITOR"
                            dataSource={list}
                            pagination={false}
                            bordered={true}
                            showSorterTooltip={false}
                            columns={baTableColumns}
                            scroll={{ y: currentHeight }}
                        />
                    </div>
                ) : isZero == 1 ? (
                    <div>
                        <div className={styles.titleText}>零余额账户交易明细表</div>
                        <ColumnDragTable
                            tableLayout="fixed"
                            modulesName="yqBalance"
                            rowKey={'id'}
                            taskType="MONITOR"
                            dataSource={list}
                            pagination={false}
                            bordered={true}
                            showSorterTooltip={false}
                            columns={zbaTableColumns}
                            scroll={{ y: currentHeight }}
                        />
                    </div>
                ) : (
                    <Empty className={'mt30'} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </div>
        </Spin>
    );
};

export default connect(({ yqBalance }) => ({
    yqBalance,
}))(Container);
