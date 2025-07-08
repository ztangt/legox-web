import { Button, Space, Table } from 'antd';
import { connect } from 'dva';
import { useEffect } from 'react';
import { history } from 'umi';
import IPagination from '../../../components/iPagination/iPagination';
import { dataFormat } from '../../../util/util';
import styles from './exportList.less';

function ExportList({ dispatch, exportList }) {
    const { start, limit, currentPage, returnCount, list } = exportList;
    // 0：处理中1：成功
    const STATUS = {
        0: '处理中',
        1: '成功',
    };

    useEffect(() => {
        getList(start, limit);
    }, []);

    const onRefresh = () => {
        getList(start, limit);
    };

    function getList(start, limit) {
        dispatch({
            type: 'exportList/getExportList',
            payload: {
                start,
                limit,
            },
        });
    }

    const onDownload = (record) => {
        window.open(record.filePath);
    };

    const tableProps = {
        rowKey: 'fileId',
        columns: [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                align: 'center',
                width: 44,
                render: (text, obj, index) => <div>{index + 1}</div>,
            },
            {
                title: '文件名',
                dataIndex: 'fileName',
                align: 'center',
                width: 300,
            },
            {
                title: '类型',
                dataIndex: 'fileTypeName',
                align: 'center',
                render: (text, obj, index) => <div>execl</div>,
            },
            {
                title: '状态',
                dataIndex: 'fileStatus',
                align: 'center',
                render: (text) => {
                    return STATUS[text];
                },
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                align: 'center',
                render: (text) => {
                    return dataFormat(text, 'YYYY-MM-DD HH:mm:ss');
                },
            },
            {
                title: '操作',
                dataIndex: 'code1',
                align: 'center',
                width: 100,
                render: (text, record) => (
                    <Space>
                        {/* TODO */}
                        {record.fileStatus == 1 ? (
                            <a
                                onClick={(e) => {
                                    onDownload(record);
                                }}
                            >
                                下载
                            </a>
                        ) : (
                            '---'
                        )}
                    </Space>
                ),
            },
        ],
        dataSource: list,
        pagination: false,
    };

    const changePage = (nextPage, size) => {
        console.log(nextPage, size);
        dispatch({
            type: 'exportList/updateStates',
            payload: {
                start: nextPage,
                limit: size,
            },
        });
        getList(nextPage, size);
    };

    return (
        <div className={styles.container} id="exportList_id">
            <div
                className={styles.control_wrapper}
                style={{ flexDirection: 'inherit', justifyContent: 'space-between' }}
            >
                <Button type="primary" onClick={() => history.back()}>
                    返回
                </Button>
                <Button
                    type="primary"
                    onClick={() => {
                        onRefresh();
                    }}
                >
                    刷新
                </Button>
            </div>
            <div className={styles.table_wrapper}>
                <Table {...tableProps} pagination={false} bordered scroll={{ y: 'calc(100vh - 335px)' }} />
                <IPagination
                    style={{ bottom: 20 }}
                    current={Number(currentPage)}
                    pageSize={limit}
                    onChange={changePage.bind(this)}
                    total={returnCount}
                    isRefresh={false}
                />
            </div>
        </div>
    );
}

export default connect(({ exportList }) => ({
    exportList,
}))(ExportList);
