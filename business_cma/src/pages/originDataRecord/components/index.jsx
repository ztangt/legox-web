import { Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import { getColumnsList } from './config';
import OriginModal from './originModal';
import SearchCom from './searchCom';

const Index = ({ dispatch, originDataRecord }) => {
    const [showOriginModal, setShowOriginModal] = useState(false);
    const [selectRows, setSelectRows] = useState([]);
    const [selectRowKeys, setSelectRowKeys] = useState([]);
    const [detailCode, setDetailCode] = useState({});
    const { loading, currentHeight, limit, currentPage, returnCount, list } = originDataRecord;
    //初始化columns
    const [columns, setColumns] = useState([]);
    useEffect(() => {
        let colList = [
            {
                title: '操作',
                fixed: 'right',
                render: (text, record) => {
                    return (
                        <div className="primaryColor mr8" onClick={() => openDetailModal(record)}>
                            详情
                        </div>
                    );
                },
            },
        ];
        setColumns(getColumnsList(originDataRecord, colList));
    }, []);

    // 详情弹窗
    const openDetailModal = (record) => {
        setDetailCode(record.data);
        setShowOriginModal(true);
    };
    // 关闭弹窗
    const onCancel = () => {
        setShowOriginModal(false);
    };

    useEffect(() => {
        limit > 0 && getList(1);
    }, [limit]);

    // 获取列表数据
    const getList = (start = 1) => {
        dispatch({
            type: 'originDataRecord/getState',
            callback: ({ formInfo, limit }) => {
                dispatch({
                    type: 'originDataRecord/updateStates',
                    payload: {
                        loading: true,
                    },
                });
                dispatch({
                    type: 'originDataRecord/getList',
                    payload: {
                        start,
                        limit,
                        ...formInfo,
                    },
                    callback: () => {
                        // 清空选中项
                        setSelectRows([]);
                        setSelectRowKeys([]);
                    },
                });
            },
        });
    };
    // 页面更改
    const changePage = (nextPage, size) => {
        if (size !== limit) {
            dispatch({
                type: 'originDataRecord/updateStates',
                payload: {
                    limit: size,
                },
            });
        } else {
            getList(nextPage);
        }
    };

    return (
        <Spin spinning={loading}>
            <SearchCom getList={getList.bind(this, 1)} selectRows={selectRows} selectRowKeys={selectRowKeys} />
            <ColumnDragTable
                rowKey={'id'}
                taskType="MONITOR"
                tableLayout="fixed"
                modulesName="originDataRecord"
                scroll={{ y: currentHeight }}
                dataSource={list}
                pagination={false}
                showSorterTooltip={false}
                bordered={true}
                listHead={'originDataRecord_head_id'}
                columns={columns}
                rowSelection={{
                    type: 'checkbox',
                    onChange: (rowKeys, rows) => {
                        setSelectRows(rows);
                        setSelectRowKeys(rowKeys);
                    },
                    selectedRowKeys: selectRowKeys,
                }}
            />
            <IPagination
                current={currentPage}
                total={returnCount}
                onChange={changePage}
                pageSize={limit}
                isRefresh={true}
                refreshDataFn={getList.bind(this, currentPage)}
            />
            {showOriginModal && <OriginModal detailCode={JSON.stringify(detailCode)} onCancel={onCancel}></OriginModal>}
        </Spin>
    );
};

export default connect(({ originDataRecord }) => ({ originDataRecord }))(Index);
