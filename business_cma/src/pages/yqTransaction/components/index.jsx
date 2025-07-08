import { Button, Empty, Spin } from 'antd';
import { connect } from 'dva';
import { useEffect } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import styles from '../index.less';
import { baTableColumns, zbaTableColumns } from './config';
import SearchCom from './searchCom';

const Container = ({ dispatch, yqTransaction }) => {
    const {
        currentHeight,
        list, //表格列表
        isZero,
        loading,
    } = yqTransaction;

    //获取单位列表
    useEffect(() => {
        dispatch({
            type: 'yqTransaction/getUnitList',
        });
    }, []);

    const view = (info) => {
        window.open(info, '_blank');
    };

    let baColumns = [
        ...baTableColumns,
        {
            title: '电子回单',
            fixed: 'right',
            dataIndex: 'elecReceipt',
            render: (text) =>
                text ? (
                    <Button type="link" onClick={() => view(text)}>
                        查看
                    </Button>
                ) : (
                    '暂无'
                ),
            width: 100,
        },
    ];

    return (
        <Spin spinning={loading}>
            <div id="dom_container_cma">
                <SearchCom />
                {isZero == 0 ? (
                    <div>
                        <div className={styles.titleText}>普通账户交易明细表</div>
                        <ColumnDragTable
                            tableLayout="fixed"
                            taskType="MONITOR"
                            modulesName="yqTransaction"
                            rowKey={'id'}
                            dataSource={list}
                            pagination={false}
                            bordered={true}
                            showSorterTooltip={false}
                            columns={baColumns}
                            scroll={{ y: list.length > 0 ? currentHeight : 0 }}
                        />
                    </div>
                ) : isZero == 1 ? (
                    <div>
                        <div className={styles.titleText}>零余额账户交易明细表</div>
                        <ColumnDragTable
                            tableLayout="fixed"
                            modulesName="yqTransaction"
                            taskType="MONITOR"
                            rowKey={'id'}
                            dataSource={list}
                            pagination={false}
                            bordered={true}
                            showSorterTooltip={false}
                            columns={zbaTableColumns}
                            scroll={{ y: list.length > 0 ? currentHeight : 0 }}
                        />
                    </div>
                ) : (
                    <Empty className={'mt30'} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </div>
        </Spin>
    );
};

export default connect(({ yqTransaction }) => ({
    yqTransaction,
}))(Container);
