import { getMenuId } from '@/util/util';
import { Button, message, Modal } from 'antd';
import { connect } from 'dva';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import ColumnDragTable from '../../../../components/columnDragTable';
import IPagination from '../../../../components/iPagination/iPagination';
import SetCol from '../../../../components/setCol';
import AuthorizationModal from '../authorizationModal';
import configs from '../configs';
import SearchCom from '../searchCom';

// 指标授权
const IndicatorAuthorization = ({ dispatch, indicatorNamespace }) => {
    let {
        currentHeight,
        indicatorList,
        start,
        limit,
        userGroupList,
        currentPage,
        returnCount,
        tabActive,
        selectedDataIds,
        selectedNodeId,
        originalData,
        selectedDatas,
        userGroupTargetKeys,
        partTargetKeys,
        allList,
        showAdvSearch,

        allColumns,
        columns,
        allColumnsYs,
        columnsYs,
    } = indicatorNamespace;
    const [selectRowKey, setSelectRowKey] = useState([]);
    const [records, setRecords] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const { location } = useModel('@@qiankunStateFromMaster');

    const [searchWord, setSearchWord] = useState(''); //搜索关键字
    const [postData, setPostData] = useState({});
    const urlObj = qs.parse(location.query?.url.split('?')[1]);

    // 状态1 报账卡、状态2预算指标
    const [getParams, setGetParams] = useState({ param: 'searchType', param1: urlObj.searchType });
    let storageKey = getParams.param1 == 1 ? 'IndicatorAuthorization_SetCol' : 'IndicatorAuthorizationYs_SetCol';

    useEffect(() => {
        let menuId = getMenuId();
        console.log(menuId, '------>预算指标授权新获取的menuId');

        dispatch({
            type: 'indicatorNamespace/updateStates',
            payload: { menuId },
        });
        dispatch({
            type: 'indicatorNamespace/getBudgetUnitList',
            payload: { menuId },
        });
    }, []);

    useEffect(() => {
        if (limit > 0 && !modalShow) {
            getAuthorizationList(1, limit);
        }
    }, [limit]);

    useEffect(() => {
        const { projectCode } = qs.parse(history.location.search);
        if (projectCode) {
            dispatch({
                type: 'indicatorNamespace/updateStates',
                payload: {
                    formData: {
                        usedYear: dayjs().year(),
                        projectCode: projectCode,
                    },
                    initProjectCode: projectCode,
                },
            });
        }
        // dispatch({ type: 'indicatorNamespace/getBizSolId' });
        dispatch({ type: 'indicatorNamespace/getGoverLogicCode' });
        dispatch({ type: 'indicatorNamespace/getPartLogicCode' });
        dispatch({ type: 'indicatorNamespace/getFundsLogicCode' });
        dispatch({ type: 'indicatorNamespace/getDictList' });
    }, []);
    // 高级查询参数
    const onSuperSearch = (postData) => {
        setPostData(postData);
    };
    // 获取高度
    const getHeight = () => {
        return document.querySelector('#list_head_cma').clientHeight || 52;
    };
    // 获取列表
    const getAuthorizationList = (start, limit, noSearchWord) => {
        dispatch({
            type: 'indicatorNamespace/getIndicatorList',
            payload: {
                ...postData,
                start,
                limit,
                searchType: getParams.param1 || '',
                searchWord: noSearchWord ? '' : searchWord,
            },
        });
    };

    // 批量清空授权
    const onDelete = () => {
        if (selectRowKey.length <= 0) {
            message.error('请选择清空项');
            return;
        }
        Modal.confirm({
            title: '提示',
            content: `确认删除？`,
            okText: '确定',
            getContainer: () => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            },
            maskClosable: false,
            mask: false,
            onOk: () => {
                const idsList = idListFn();
                dispatch({
                    type: 'indicatorNamespace/deleteAuthorization',
                    payload: {
                        id: idsList,
                        searchType: getParams.param1,
                        deleteType: 'ALL',
                    },
                    callback() {
                        getAuthorizationList(currentPage, limit);
                    },
                });
            },
        });
    };

    // 部门保存数据
    const partSaveData = () => {
        const departMentArr = [];
        const loop = allList;
        loop.forEach((element) => {
            if (partTargetKeys.includes(element.id)) {
                departMentArr.push({
                    orgId: element.id,
                    orgName: element.orgName,
                    orgCode: element.orgCode,
                    orgKind: element.orgKind,
                });
            }
        });
        return departMentArr;
    };
    const getSelectedUser = () => {
        return selectedDatas.map((item) => {
            return {
                userId: item.userId,
                userName: item.userName,
                identityId: item.identityId,
                userOrgId: item.orgId,
                userOrgName: item.orgName,
                userDeptId: item.deptId,
                userDeptName: item.deptName,
            };
        });
    };
    const getUserGroup = () => {
        return (
            userGroupList
                .filter((item, index) => {
                    // 查询对应的项
                    if (userGroupTargetKeys.includes(item.id)) {
                        return item;
                    }
                })
                .map((item) => {
                    return {
                        usergroupId: item.id,
                        usergroupName: item.ugName,
                    };
                }) || []
        );
    };
    const idListFn = () => {
        return selectRowKey
            .map((item) => {
                if (getParams.param1 == 1) {
                    return item.reimbCardNum;
                } else {
                    return item.normId;
                }
            })
            .join(',');
    };
    // 确定
    const confirm = (data, actives, budgetOrgId_) => {
        if (!getParams.param1) {
            message.error('缺少searchType类型');
            return;
        }
        if (isUnit) {
            isUnitConfirm(budgetOrgId_);
        } else {
            noIsUnitConfirm();
        }
    };

    //批量授权
    const noIsUnitConfirm = () => {
        const normInfo = selectRowKey.map((item) => {
            // 新增状态为1
            if (getParams.param1 == 1) {
                return {
                    reimbCardNum: item.reimbCardNum,
                    budgetOrgId: item.budgetOrgId,
                    budgetOrgName: item.budgetOrgName,
                    moneySourceTldt: item.moneySourceTldt,
                    projectId: item.projectId,
                    projectCode: item.projectCode,
                    projectName: item.projectName,
                    usedYear: item.usedYear,
                    userGroupList: getUserGroup() || [],
                    orgList: partSaveData() || [],
                    userList: getSelectedUser() || [],
                };
            } else if (getParams.param1 == 2) {
                return {
                    normId: item.normId,
                    normCode: item.normCode,
                    budgetOrgId: item.budgetOrgId,
                    budgetOrgName: item.budgetOrgName,
                    moneySourceTldt: item.moneySourceTldt,
                    projectId: item.projectId,
                    projectCode: item.projectCode,
                    projectName: item.projectName,
                    usedYear: item.usedYear,
                    userGroupList: getUserGroup() || [],
                    orgList: partSaveData() || [],
                    userList: getSelectedUser() || [],
                };
            }
        });

        dispatch({
            type: 'indicatorNamespace/confirmIndicatorList',
            payload: {
                insertJson: JSON.stringify(normInfo),
            },
            callback() {
                getAuthorizationList(currentPage, limit);
            },
        });
        onCancel();
    };

    //按照单位授权
    const isUnitConfirm = (budgetOrgId_) => {
        if (!budgetOrgId_) {
            return message.error('请选择预算单位');
        }
        dispatch({
            type: 'indicatorNamespace/empowerByUnit',
            payload: {
                insertJson: JSON.stringify({
                    searchType: getParams.param1 || '',
                    orgId: budgetOrgId_,
                    userGroupList: getUserGroup() || [],
                    orgList: partSaveData() || [],
                    userList: getSelectedUser() || [],
                }),
            },
            callback() {
                message.success('授权成功');
                getAuthorizationList(currentPage, limit);
                onCancel();
            },
        });
    };

    // 关闭
    const onCancel = () => {
        setModalShow(false);
        setIsDisabled(false);
        dispatch({
            type: 'indicatorNamespace/updateStates',
            payload: {
                selectedNodeId: '',
                expandedKeys: [],
                currentNode: {},
                allList: [],
                userGroupTargetKeys: [],
                partTargetKeys: [],
                rightSelectedData: [],
                newSelectedDatas: [],
                selectedDatas: [],
                selectedDataIds: [],
            },
        });
    };

    const [isUnit, setIsUnit] = useState(false); //是否按照单位授权
    // 批量授权
    const onAuthorization = () => {
        if (selectRowKey.length <= 0) {
            message.error('请选择授权项');
            return;
        }
        setIsUnit(false);
        setModalShow(true);
        setIsDisabled(false);
        dispatch({
            type: 'indicatorNamespace/updateStates',
            payload: {
                rightSelectedData: [],
            },
        });
    };

    //按单位授权
    const onAuthorizationByUnit = () => {
        setIsUnit(true);
        setModalShow(true);
        setIsDisabled(false);
        dispatch({
            type: 'indicatorNamespace/updateStates',
            payload: {
                rightSelectedData: [],
            },
        });
    };

    //
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectRowKey(selectedRows);
        },
    };
    // 查看
    const lookOver = (record) => {
        setModalShow(true);
        // 禁用
        setIsDisabled(true);

        dispatch({
            type: 'indicatorNamespace/getSelectedTransfer',
            payload: {
                normId: record.normId,
                reimbCardNum: record.reimbCardNum,
                searchType: getParams.param1,
                type: 3,
            },
        });
        setRecords(record);
    };
    const changePage = (nextPage, size) => {
        if (size != limit) {
            dispatch({
                type: 'indicatorNamespace/updateStates',
                payload: { limit: size },
            });
        } else {
            getAuthorizationList(nextPage, size);
        }
    };
    // columns配置所需函数
    const columnsConfig = {
        lookOver,
        searchType: getParams.param1,
    };

    const [colVisiblePop, setColVisiblePop] = useState(false); //设置列的设置弹框
    let allColumnsList = configs.columns(columnsConfig);
    let [selectColumnCode, setSelectColumnCode] = useState(allColumnsList.map((item) => item.key)); //选中的列

    //设置初始化的表格列表头
    useEffect(() => {
        let columnsList = [...allColumnsList];
        let selectArr = [...allColumnsList].map((item) => item.key);
        if (localStorage.getItem(storageKey)) {
            selectArr = localStorage.getItem(storageKey).split(',');
            //按照选中的顺序排序
            let newColumns = [];
            selectArr.forEach((item) => {
                let columnsItem = columnsList.find((columnsItem) => columnsItem.key == item);
                if (columnsItem) {
                    newColumns.push(columnsItem);
                }
            });
            columnsList = [...newColumns];
        }
        setSelectColumnCode(selectArr);
        dispatch({
            type: 'indicatorNamespace/updateStates',
            payload: {
                allColumns: [...allColumnsList],
                columns: [...columnsList],
            },
        });
    }, [getParams.param1]);

    const changeColVisiblePop = () => {
        if (!colVisiblePop) {
            let selectKeys = columns.map((item) => item.key);
            //选中的排在最前面
            const newAllColumns = allColumnsList.sort((a, b) => {
                // 检查 a 的 key 是否在 B 中
                const aKeyIndex = selectKeys.indexOf(a.key);
                // 检查 b 的 key 是否在 B 中
                const bKeyIndex = selectKeys.indexOf(b.key);
                // 如果 a 在 B 中，但 b 不在 B 中，则 a 排在前面
                if (aKeyIndex !== -1 && bKeyIndex === -1) {
                    return -1;
                }
                // 如果 a 不在 B 中，但 b 在 B 中，则 b 排在前面
                if (aKeyIndex === -1 && bKeyIndex !== -1) {
                    return 1;
                }
                // 否则，保持原始顺序
                return 0;
            });
            dispatch({
                type: 'indicatorNamespace/updateStates',
                payload: {
                    allColumns: [...newAllColumns],
                },
            });
        }
        setColVisiblePop(!colVisiblePop);
    };
    const saveCols = (colSelectKey, colSelect) => {
        dispatch({
            type: 'indicatorNamespace/updateStates',
            payload: {
                columns: [...colSelect],
            },
        });
        setSelectColumnCode(colSelectKey);
        localStorage.setItem(storageKey, colSelectKey);
        setColVisiblePop(false);
    };

    const config = {
        confirm,
        onCancel,
        isDisabled,
        getParams,
        record: records,
        parentId: `dom_container_cma_${getParams.param1}`,
    };

    const buttonRender = () => {
        return (
            <>
                <Button onClick={onAuthorizationByUnit} className="mr8">
                    按单位授权
                </Button>
                <Button onClick={onAuthorization}>批量授权</Button>
                <Button className="ml8" onClick={onDelete.bind(this)}>
                    批量清空授权
                </Button>
            </>
        );
    };
    return (
        <div id={`dom_container_cma_${getParams.param1}`}>
            <div id={`list_head_cma_${getParams.param1}`}>
                <SearchCom getParams={getParams} buttonEvents={buttonRender()} getSearchParams={onSuperSearch} />
            </div>
            <ColumnDragTable
                key={showAdvSearch}
                rowSelection={{ type: 'checkbox', ...rowSelection }}
                rowKey="id"
                dataSource={indicatorList && indicatorList.length ? indicatorList : []}
                pagination={false}
                bordered={true}
                showSorterTooltip={false}
                listHead={`list_head_cma_${getParams.param1}`}
                columns={[
                    {
                        title: '序号',
                        width: 60,
                        render: (text, record, index) => index + 1,
                        fixed: 'left',
                    },
                    ...columns,
                    {
                        title: (
                            <div className="flex flex_justify_between">
                                <div>当前授权</div>
                                {
                                    <SetCol
                                        allCols={allColumns}
                                        selectColumnCode={selectColumnCode}
                                        changeColVisiblePop={changeColVisiblePop}
                                        taskType=""
                                        colVisiblePop={colVisiblePop}
                                        saveCols={saveCols}
                                        id={`dom_container_cma_${getParams.param1}`}
                                    />
                                }
                            </div>
                        ),
                        width: 100,
                        fixed: 'right',
                        render(text, record) {
                            return (
                                <a>
                                    <span onClick={() => lookOver(record)}>查看</span>
                                </a>
                            );
                        },
                    },
                ]}
                modulesName="indicatorNamespace"
                scroll={{ y: indicatorList.length > 0 ? currentHeight : 0 }}
            />

            <IPagination
                current={currentPage}
                total={returnCount}
                onChange={changePage}
                pageSize={limit}
                isRefresh={true}
                refreshDataFn={() => {
                    // 第二个参数是树列表选中
                    getAuthorizationList(currentPage, limit);
                }}
            />
            {modalShow && <AuthorizationModal {...config} isUnit={isUnit} getParams={getParams}></AuthorizationModal>}
        </div>
    );
};

export default connect(({ indicatorNamespace }) => ({
    indicatorNamespace,
}))(IndicatorAuthorization);
