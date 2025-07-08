import BasicDataTree from '@/components/BasicDataTree';
import calcFn from '@/util/calc';
import { useModel } from '@@/exports';
import { message, Spin, Table, Tabs } from 'antd';
import { connect } from 'dva';
import qs from 'qs';
import { useEffect, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import { curYear, getColumns } from './config';
import ImportModal from './importModal';
import SearchCom from './searchCom';

const Index = ({ dispatch, dataEntryIssued }) => {
    let { loading, currentHeight, limit, currentPage, returnCount, list, formInfo } = dataEntryIssued;
    const [rowKeys, setRowKeys] = useState([]);
    const [rows, setRows] = useState([]);

    const [tabKey, setTabKey] = useState(0);
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

    const [columns, setColumns] = useState(getColumns(pageId, curYear));
    const [sateType, setSateType] = useState(1);
    const sateTypes = {
        1: [
            { title: '待下发数据', key: 1 },
            { title: '待确认数据', key: 2 },
            { title: '已确认数据', key: 3 },
        ],
        2: [
            { title: '待分解数据', key: 1 },
            { title: '待上报数据', key: 2 },
            { title: '已上报数据', key: 3 },
        ],
    };
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
            type: 'dataEntryIssued/updateStates',
            payload: {
                pageId: pageId,
                listType: pageId >= 3 ? 3 : pageId,
            },
        });
    }, []);

    const [sum, setSum] = useState(0);
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
        let dataType = 1;
        if (pageId == 1) {
            const type1 = {
                1: 1,
                2: 4,
                3: 5,
            };
            dataType = type1[sateType];
        } else if (pageId == 2) {
            const type2 = {
                1: 2,
                2: 3,
                3: 4,
            };
            dataType = type2[sateType];
        }
        dispatch({
            type: 'dataEntryIssued/getState',
            callback: ({ formInfo, limit, listType }) => {
                // 没有选择项目时，不请求数据
                if (pageId > 2 && !formInfo?.budgetOrgCode) {
                    return;
                }
                if (pageId <= 2 && !formInfo?.projectCode) {
                    return;
                }
                dispatch({
                    type: 'dataEntryIssued/updateStates',
                    payload: { loading: true },
                });
                dispatch({
                    type: 'dataEntryIssued/getList',
                    payload:
                        pageId > 2
                            ? { start, limit, ...formInfo, listType }
                            : pageId == 1 && sateType == 1
                            ? { start, limit, dataType, ...formInfo, listType } //下发分解任务 下发页签 dataType 默认为1，从高级查询中获取查询条件
                            : { start, limit, ...formInfo, dataType, listType }, //待确认的dataType 3
                    callback: (list) => {
                        setColumns(getColumns(pageId, formInfo.reportYear, false));
                        // 清空选中项
                        setRowKeys([]);
                        setRows([]);
                        // 清空展开行
                        setExpandedRowKeys([]);
                        let newSum = list.reduce(
                            (total, item) => calcFn.add(total, item.sumCurrentBudgetControlAmount),
                            0,
                        );
                        setSum(newSum);
                        setTabKey((tabKey) => tabKey + 1);
                    },
                    sateType,
                });
            },
        });
    };

    // 分页更改
    const changePage = (nextPage, size) => {
        if (size !== limit) {
            dispatch({
                type: 'dataEntryIssued/updateStates',
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
            type: 'dataEntryIssued/getState',
            callback: ({ listType, formInfo }) => {
                dispatch({
                    type: 'dataEntryIssued/getChildList',
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
                            type: 'dataEntryIssued/updateStates',
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
                type: 'dataEntryIssued/getState',
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
        let { budgetOrgCode, ...others } = dataEntryIssued.formInfo;
        if (pageId <= 2) {
            dispatch({
                type: 'dataEntryIssued/updateStates',
                payload: {
                    formInfo: selectId ? { ...others, projectCode: selectInfo.OBJ_CODE } : others,
                },
            });
        } else {
            const { json } = selectInfo;
            let resJson = JSON.parse(json || '{}');
            dispatch({
                type: 'dataEntryIssued/updateStates',
                payload: {
                    formInfo: selectId ? { ...others, budgetOrgCode: resJson.OBJ_CODE } : others,
                },
            });
        }
        getList(1);
    };

    const { divId } = useModel('@@qiankunStateFromMaster');
    //按钮事件里面如果需要调用setIsTableModal(true)})方法，就得给页面加id={divId}
    //公司的前端定的。😒😒😒😒😒😒

    useEffect(() => {
        dispatch({
            type: 'dataEntryIssued/updateStates',
            payload: { divId: divId || 'dataEntryIssued_id' },
        });
    }, []);

    const { importData, importType, importLoading, isShowImportModal } = dataEntryIssued;

    //导入
    const onImportClick = (importType) => {
        dispatch({
            type: 'dataEntryIssued/updateStates',
            payload: {
                isShowImportModal: true,
                importType,
            },
        });
    };
    //导入取消
    const onImportCancel = () => {
        dispatch({
            type: 'dataEntryIssued/updateStates',
            payload: {
                isShowImportModal: false,
                importData: {},
            },
        });
    };
    function onChnageTab(key) {
        setSateType(key);
        dispatch({
            type: 'dataEntryIssued/updateStates',
            payload: {
                limit: 10,
            },
        });
    }
    return (
        <Spin spinning={loading}>
            <div id={`dataEntryIssued_${dataEntryIssued.pageId}`}>
                <div className={'flex pl8 pr8 pt8'} id={divId}>
                    <div className={'mr10'}>
                        <BasicDataTree
                            title={'单位名称'}
                            getSelectTree={getSelectBaseTree}
                            year={dataEntryIssued.formInfo.reportYear}
                            logicCode={'FT_CMA_900050'}
                            menuType={pageId}
                        />
                    </div>
                    <div className={'flex_1'} style={{ overflowX: 'auto' }}>
                        <div id="dataEntryIssued_head_id">
                            {pageId <= 2 ? (
                                <Tabs defaultActiveKey="" onChange={onChnageTab}>
                                    {sateTypes[pageId].map((item) => {
                                        return <Tabs.TabPane tab={item.title} key={item.key}></Tabs.TabPane>;
                                    })}
                                </Tabs>
                            ) : (
                                ''
                            )}
                            <SearchCom
                                getList={getList}
                                rowKeys={rowKeys}
                                rows={rows}
                                onImportClick={onImportClick}
                                pageId={pageId}
                                sateType={sateType}
                                tabButton={tabButton}
                            />
                        </div>
                        <ColumnDragTable
                            // key={tabKey}
                            listHead={'dataEntryIssued_head_id'}
                            columns={columns}
                            taskType="MONITOR"
                            tableLayout="fixed"
                            modulesName="dataEntryIssued"
                            scroll={{ y: currentHeight - 48 }} //两行的表头去掉多余表头的高度
                            dataSource={list}
                            pagination={false}
                            showSorterTooltip={false}
                            bordered
                            rowKey={(record) => `${record.id}`}
                            rowSelection={{
                                selectedRowKeys: rowKeys,
                                onSelect: onSelect,
                                onSelectAll: onSelectAll,
                                columnWidth: 80,
                            }}
                            expandable={
                                sateType > 1 || pageId == 3 || pageId == 4
                                    ? {
                                          onExpand: onExpand,
                                          defaultExpandedRowKeys: [],
                                          expandedRowKeys: expandedRowKeys,
                                          onExpandedRowsChange: (expandedRowKeys) => {
                                              setExpandedRowKeys(expandedRowKeys);
                                          },
                                          expandedRowRender: (record) => {
                                              return (
                                                  //     <ColumnDragTable
                                                  //     columns={getColumns(pageId, formInfo.reportYear, true)}
                                                  //     taskType="MONITOR"
                                                  //     tableLayout="fixed"
                                                  //     modulesName="dataEntryIssued"
                                                  //     dataSource={record.childrenList}
                                                  //     pagination={false}
                                                  //     showSorterTooltip={false}
                                                  //     bordered
                                                  //     rowKey={(record) => `${record.id}`}
                                                  //     scroll={{ x: 'auto' }} //两行的表头去掉多余表头的高度
                                                  // />
                                                  <div>
                                                      <Table
                                                          bordered
                                                          columns={getColumns(pageId, formInfo.reportYear, true)}
                                                          dataSource={record.childrenList}
                                                          pagination={false}
                                                          rowKey={(record) => `${record.id}`}
                                                          scroll={{ x: 'auto' }}
                                                      />
                                                  </div>
                                              );
                                          },
                                      }
                                    : false
                            }
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

                {isShowImportModal && (
                    <ImportModal
                        listType={dataEntryIssued.listType}
                        usedYear={dataEntryIssued.formInfo.reportYear}
                        importData={importData}
                        importType={importType}
                        importLoading={importLoading}
                        refreshList={() => getList(currentPage)}
                        onCancel={onImportCancel}
                        divId={`dataEntryIssued_${dataEntryIssued.pageId}`}
                    />
                )}
            </div>
        </Spin>
    );
};

export default connect(({ dataEntryIssued }) => ({ dataEntryIssued }))(Index);
