import BasicDataTree from '@/components/BasicDataTree';

import Tree from '@/components/tree/index.jsx';
import calcFn from '@/util/calc';
import { useModel } from '@@/exports';
import { message, Spin, Table, Tabs } from 'antd';
import { connect } from 'dva';
import qs from 'qs';
import { use, useEffect, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import { curYear, getColumns } from './config';
import DownloadModal from './downloadModal';
import SearchCom from './searchCom';

const Index = ({ dispatch, pmAttachment }) => {
    let { loading, currentHeight, limit, currentPage, returnCount, list, formInfo } = pmAttachment;

    const { importLoading, showDownloadModal, treeData, currentNode, expandedKeys, summaryList } = pmAttachment;

    const [rowKeys, setRowKeys] = useState([]);
    const [rows, setRows] = useState([]);

    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const { location } = useModel('@@qiankunStateFromMaster');
    let newStr = location.query.url.split('?');

    let pageId = 1;
    let tabButton = '';
    if (newStr.length > 1) {
        let params = qs.parse(newStr[1]);
        pageId = params.pageId || 1;
        tabButton = params.tabButton;
    }

    const [sateType, setSateType] = useState(1);

    /** 初始化
     * @pageId 用来区分是哪个页面
     * 1、数据录入与下发
     * 2、职能司（分解单位）
     * 3、省
     * 4、市
     * 5、县
     * @listType 传给后端的字段，当params.listType大于3时，listType=3
     */
    useEffect(() => {
        dispatch({
            type: 'pmAttachment/updateStates',
            payload: {
                pageId: pageId,
                listType: pageId >= 3 ? 3 : pageId,
            },
        });
    }, []);

    useEffect(() => {
        // 保存后的重置
        if (location?.query?.reset && limit > 0) {
            return getList(currentPage);
        }
        //初始化
        if (limit > 0) {
            return getList(1);
        }
    }, [limit, location?.query?.reset, sateType]);

    // 获取列表数据
    const getList = (start) => {
        console.log('getList', currentNode);

        dispatch({
            type: 'pmAttachment/updateStates',
            payload: { loading: true },
        });
        dispatch({
            type: 'pmAttachment/getList',
            payload: { start, limit, deptId: currentNode?.nodeType == 'DEPT' ? currentNode.nodeId : '', ...formInfo },
            callback: (list) => {
                // 清空选中项
                setRowKeys([]);
                setRows([]);
                // 清空展开行
                setExpandedRowKeys([]);
            },
        });
    };

    // 分页更改
    const changePage = (nextPage, size) => {
        if (size !== limit) {
            dispatch({
                type: 'pmAttachment/updateStates',
                payload: { limit: size },
            });
        } else {
            getList(nextPage);
        }
    };

    const getTraverseList = (arr, id, pushChildren) => {
        arr.forEach((item) => {
            if (item.id == id) {
                item.childrenList = pushChildren;
            }
        });
        // arr.forEach((item) => {
        //     if (item.id == id) {
        //         item.children = pushChildren;
        //     } else if (item.children && item.children.length) {
        //         getTraverseList(item.children, id, pushChildren);
        //     }
        // });
        return list;
    };

    //点击展开
    const onExpand = (expanded, record) => {
        if (!expanded) return; //点击收起
        if (record.children?.length > 0) return; //已经加载过就不再次请求了
        dispatch({
            type: 'pmAttachment/getState',
            callback: ({ listType, formInfo }) => {
                dispatch({
                    type: 'pmAttachment/getChildList',
                    payload: {
                        projectCode: record.projectCode,
                        sourceOrgCode: record.targetBudgetOrgCode,
                        listType: listType,
                        reportYear: formInfo.reportYear,
                    },
                    callback: (childList) => {
                        if (!childList.length) {
                            return message.error('本项下暂无子项');
                        }
                        //获取到childList,遍历list，给id为record.id的数据添加children
                        let newList = getTraverseList(list, record.id, childList);
                        console.log(newList, 'newList');

                        dispatch({
                            type: 'pmAttachment/updateStates',
                            payload: { list: newList },
                        });
                    },
                });
            },
        });
    };

    //单选
    const onSelect = (record, selected, selectedRows) => {
        if (rowKeys.includes(record.id)) {
            //取消选中
            let newKeys = rowKeys.filter((item) => item !== record.id);
            let newRows = rows.filter((item) => item.id !== record.id);
            setRowKeys(newKeys);
            setRows(newRows);
        } else {
            //选中
            setRowKeys([...rowKeys, record.id]);
            setRows([...rows, record]);
        }
    };

    //递归获取所有列表的ID
    const getTraverseRows = (arr, resRows, rewRowKeys) => {
        arr.forEach((item) => {
            resRows.push(item);
            rewRowKeys.push(item.id);
            if (item.children && item.children.length) {
                getTraverseRows(item.children, resRows, rewRowKeys);
            }
        });
        return { resRows, rewRowKeys };
    };

    //全选
    const onSelectAll = (selected, selectedRows, changeRows) => {
        if (!selected) {
            setRowKeys([]);
            setRows([]);
        } else {
            dispatch({
                type: 'pmAttachment/getState',
                callback: ({ list }) => {
                    let { resRows, rewRowKeys } = getTraverseRows(list, [], []);
                    setRowKeys(rewRowKeys);
                    setRows(resRows);
                },
            });
        }
    };

    //选中左侧树
    const getSelectBaseTree = (selectId, selectInfo) => {
        let { budgetOrgCode, ...others } = pmAttachment.formInfo;
        if (pageId <= 2) {
            dispatch({
                type: 'pmAttachment/updateStates',
                payload: {
                    formInfo: selectId ? { ...others, projectCode: selectInfo.OBJ_CODE } : others,
                },
            });
        } else {
            const { json } = selectInfo;
            let resJson = JSON.parse(json || '{}');
            dispatch({
                type: 'pmAttachment/updateStates',
                payload: {
                    formInfo: selectId ? { ...others, budgetOrgCode: resJson.OBJ_CODE } : others,
                },
            });
        }
        getList(1);
    };

    const getTreeNode = (treeNode) => {
        getList(1);
    };

    const { divId } = useModel('@@qiankunStateFromMaster');
    //按钮事件里面如果需要调用setIsTableModal(true)})方法，就得给页面加id={divId}
    //公司的前端定的。😒😒😒😒😒😒

    useEffect(() => {
        dispatch({
            type: 'pmAttachment/updateStates',
            payload: { divId: divId || 'pmAttachment_id' },
        });
    }, []);

    // 显示下载弹窗
    const shwoDownloadhandle = (row = {}) => {
        dispatch({
            type: 'pmAttachment/getSummaryList',
            payload: {
                projectId: row.projectId,
                contractId: row.contractId,
            },
            callback: (resList) => {
                if (list.length > 0) {
                    dispatch({
                        type: 'pmAttachment/updateStates',
                        payload: {
                            summaryList: resList,
                            showDownloadModal: true,
                        },
                    });
                } else {
                    alert('无数据');
                }
            },
        });
    };

    // 下载、打包瞎子啊
    const downloadHandle = (record) => {
        let payload = {};
        if (record) {
            // 下载单独阶段
            payload.projectId = record.projectId;
            payload.contractId = record.contractId;
            payload.processStatus = record.processStatus;
        } else {
            // 打包下载
            payload.projectId = summaryList[0].projectId;
            payload.contractId = summaryList[0].contractId;
        }
        dispatch({
            type: 'pmAttachment/getPmAttachmentDownloadUrl',
            payload,
            callback: (downloadUrl) => {
                if (downloadUrl) {
                    const a = document.createElement('a');
                    a.href = downloadUrl;
                    a.click();
                }
            },
        });
    };

    // 批量下载
    const batchDownHandle = () => {
        if (rows?.length > 0) {
            let projectIdIds = rows.map((item) => {
                return item.projectId;
            });

            let payload = {
                projectIdIds: projectIdIds.join(','),
            };
            dispatch({
                type: 'pmAttachment/getPmAttachmentBatchDownloadUrl',
                payload,
                callback: (downloadUrl) => {
                    if (downloadUrl) {
                        const a = document.createElement('a');
                        a.href = downloadUrl;
                        a.click();
                    }
                },
            });
        } else {
            return message.error('请选择要下载的数据');
        }
    };

    //导入
    const onImportClick = (importType) => {
        dispatch({
            type: 'pmAttachment/updateStates',
            payload: {
                showDownloadModal: true,
                importType,
            },
        });
    };

    return (
        <Spin spinning={loading}>
            <div id={`pmAttachment_${pmAttachment.pageId}`} style={{ height: '100%' }}>
                <div className={'flex pl8 pr8 pt8'} style={{ height: '100%' }} id={divId}>
                    <div className={'mr10'} style={{ width: '242px' }}>
                        {/* <BasicDataTree
                            title={'单位名称'}
                            getSelectTree={getSelectBaseTree}
                            year={pmAttachment.formInfo.reportYear}
                            logicCode={'FT_CMA_900050'}
                            menuType={pageId}
                        /> */}
                        <Tree
                            modulesName="pmAttachment"
                            treeData={treeData}
                            currentNode={currentNode}
                            expandedKeys={expandedKeys}
                            getData={getTreeNode}
                            nodeType="DEPT"
                        ></Tree>
                    </div>
                    <div className={'flex_1'} style={{ overflowX: 'auto' }}>
                        <div id="pmAttachment_head_id">
                            <SearchCom
                                getList={getList}
                                rowKeys={rowKeys}
                                rows={rows}
                                batchDownHandle={batchDownHandle}
                                pageId={pageId}
                                sateType={sateType}
                                tabButton={tabButton}
                            />
                        </div>
                        <ColumnDragTable
                            // key={tabKey}
                            listHead={'pmAttachment_head_id'}
                            columns={getColumns(true, shwoDownloadhandle)}
                            taskType="MONITOR"
                            tableLayout="fixed"
                            modulesName="pmAttachment"
                            scroll={{ y: currentHeight - 48 }} //两行的表头去掉多余表头的高度
                            dataSource={list}
                            pagination={false}
                            showSorterTooltip={false}
                            rowKey={(record) => `${record.id}`}
                            rowSelection={{
                                selectedRowKeys: rowKeys,
                                onSelect: onSelect,
                                onSelectAll: onSelectAll,
                                columnWidth: 15,
                            }}
                            //childrenColumnName="contractAttachmentList"
                            expandable={{
                                columnWidth: 15,
                                // onExpand: onExpand,
                                defaultExpandedRowKeys: [],
                                expandedRowKeys: expandedRowKeys,
                                onExpandedRowsChange: (expandedRowKeys) => {
                                    setExpandedRowKeys(expandedRowKeys);
                                },
                                expandedRowRender: (record) => {
                                    return (
                                        <div>
                                            <Table
                                                columns={getColumns(false, shwoDownloadhandle)}
                                                dataSource={record.contractAttachmentList}
                                                pagination={false}
                                                rowKey={(record) => `${record.id}`}
                                                scroll={{ x: 'auto' }}
                                            />
                                        </div>
                                    );
                                },
                            }}
                        />
                        <IPagination
                            style={{ width: '-webkit-fill-available' }}
                            current={currentPage}
                            total={returnCount}
                            onChange={changePage}
                            pageSize={limit}
                            isRefresh={true}
                            refreshDataFn={() => getList(currentPage)}
                        />
                    </div>
                </div>

                {showDownloadModal ? (
                    <DownloadModal
                        summaryList={summaryList}
                        importLoading={importLoading}
                        refreshList={() => getList(currentPage)}
                        divId={`pmAttachment_${pmAttachment.pageId}`}
                        downloadHandle={downloadHandle}
                    />
                ) : null}
            </div>
        </Spin>
    );
};

export default connect(({ pmAttachment }) => ({ pmAttachment }))(Index);
