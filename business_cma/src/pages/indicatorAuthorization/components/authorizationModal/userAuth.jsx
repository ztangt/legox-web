/**
 * 关联用户单位岗位
 * （注意，请在相关的model里面定义selectedNodeId,selectedDataIds,treeData,currentNode,expandedKeys,treeSearchWord,
 * selectedDatas,originalData,selectNodeType）
 * (selectedDataIds是上次保存的数据id)
 * selectedDatas为选中的数据信息，selectedDataIds为选中的数据id
 */
import { message, Modal } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { connect } from 'umi';
import { renderCol } from '../../../../components/relevanceModal/columns';
import MiddleWaitData from '../../../../components/relevanceModal/middleWaitData';
import styles from '../../../../components/relevanceModal/relevanceModal.less';
import RightSelectData from '../../../../components/relevanceModal/rightSelectData';
import ReSizeLeftRightCss from '../../../../components/resizeLeftRight';
import ITree from '../treeUser';
function Index({
    dispatch,
    nameSpace,
    spaceInfo,
    orgUserType,
    selectButtonType,
    isDisabled,
    getParams,
    id,
    className,
    isUnit,
}) {
    const {
        selectedNodeId,
        selectedDataIds,
        currentNode,
        expandedKeys,
        treeSearchWord,
        selectedDatas,
        newSelectedDatas,
        originalData,
        selectNodeType,
        rightSelectedData,
    } = spaceInfo;
    useEffect(() => {
        //初始话
        // if(!isDisabled){
        dispatch({
            type: `${nameSpace}/updateStates`,
            payload: {
                selectedDatas: [],
                newSelectedDatas: newSelectedDatas,
                treeSearchWord: '',
                originalData: isDisabled ? originalData : [],
            },
        });
        // }

        if (orgUserType == 'USERGROUP') {
            //获取用户组列表为originalData数据
            dispatch({
                type: `userAccredit/getUgs`,
                payload: {
                    namespace: nameSpace,
                    searchWord: '',
                    start: 1,
                    limit: 10000,
                },
            });
        }
        //通过selectedDataIds获取selectedDatas数据
        if (selectedDataIds.length) {
            dispatch({
                type: `userAccredit/getSelectedDatas`,
                payload: {
                    namespace: nameSpace,
                    orgUserType: orgUserType,
                    selectedDataIds: selectedDataIds,
                },
            });
        }
    }, []);
    //更新选择的用户ID
    const updateSelectIdsFn = (selectedDataIds, selectedDatas) => {
        dispatch({
            type: `${nameSpace}/updateStates`,
            payload: {
                selectedDataIds: selectedDataIds,
                selectedDatas: _.cloneDeep(selectedDatas),
            },
        });
    };
    const getQueryUser = (searchWord, selectedNodeId, selectNodeType) => {
        dispatch({
            type: `userAccredit/queryUser`,
            payload: {
                namespace: nameSpace,
                searchWord: searchWord,
                orgId: selectedNodeId,
                deptId: selectedNodeId,
                start: 1,
                limit: 10000,
                type: '',
            },
        });
    };
    //搜索人名
    const searchWordFn = (searchWord) => {
        if (orgUserType == 'USER') {
            getQueryUser(searchWord, selectedNodeId, selectNodeType);
        } else if (orgUserType == 'RULE') {
            getUnitRole(searchWord, selectedNodeId);
        }
    };
    //获取单位角色
    const getUnitRole = (searchWord, orgId) => {
        dispatch({
            type: `userAccredit/getSysRoles`,
            payload: {
                namespace: nameSpace,
                searchWord: searchWord,
                orgId: orgId,
                roleType: 'ORGROLE',
                start: 1,
                limit: 10000,
            },
        });
    };
    //获取用户列表
    const getData = (node) => {
        dispatch({
            type: `${nameSpace}/updateStates`,
            payload: {
                selectedNodeId: node.key,
                selectNodeType: node.nodeType,
            },
        });
        if (orgUserType == 'USER') {
            getQueryUser('', node.key, node.nodeType);
        } else if (orgUserType == 'RULE') {
            getUnitRole('', node.key);
        }
    };
    //关闭标签(关闭所以标签（清空）)
    const closeTag = (idValue, idKey) => {
        //查看授权时添加删除按钮
        if (isDisabled) {
            if (idValue) {
                Modal.confirm({
                    title: '提示',
                    content: `确认删除此授权？`,
                    okText: '确定',
                    getContainer: () => {
                        return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                    },
                    maskClosable: false,
                    mask: false,
                    onOk: () => {
                        dispatch({
                            type: 'indicatorNamespace/deleteAuthorization',
                            payload: {
                                deleteId: idValue,
                                searchType: getParams.param1,
                                deleteType: 'ONE',
                                authType: 4, //用户的单个删除传4
                                id,
                            },
                            callback() {
                                dispatch({
                                    type: `${nameSpace}/updateStates`,
                                    payload: {
                                        newSelectedDatas: newSelectedDatas.filter((item) => item[idKey] != idValue),
                                    },
                                });
                                message.success('删除授权成功！');
                            },
                        });
                    },
                });
            }
        } else {
            if (idValue) {
                selectedDataIds.splice(selectedDataIds.indexOf(idValue), 1);
                let newSelectedDatas = selectedDatas.filter((item) => item[idKey] != idValue);
                updateSelectIdsFn(selectedDataIds, newSelectedDatas);
            } else {
                updateSelectIdsFn([], []);
            }
        }
    };
    //左侧树状的选择
    const onCheck = (checkedKeys, { checked, node }) => {
        let list = JSON.parse(JSON.stringify(selectedDatas));
        let listIds = _.cloneDeep(selectedDataIds) || [];
        if (checked) {
            let obj = {};
            if (node.nodeType == 'ORG_') {
                obj = {
                    nodeName: node.nodeName,
                    parentName: node.parentName,
                    nodeId: node.nodeId,
                };
            } else if (node.nodeType == 'DEPT') {
                obj = {
                    nodeName: node.nodeName,
                    parentName: node.parentType == 'DEPT' ? node.parentName : '',
                    nodeId: node.nodeId,
                    orgName: node.orgName,
                };
            } else if (node.nodeType == 'POST') {
                obj = {
                    nodeName: node.nodeName,
                    nodeId: node.nodeId,
                    orgId: node.orgId,
                    deptId: node.deptId,
                    orgName: node.orgName,
                    deptName: node.deptName,
                };
            }
            if (selectButtonType == 'checkBox') {
                list.push(obj);
                listIds.push(node.nodeId);
            } else {
                list = [obj];
                listIds = [node.nodeId];
            }
        } else {
            list = list.filter((x) => x.nodeId != node.nodeId);
            listIds = listIds.filter((x) => x != node.nodeId);
        }
        dispatch({
            type: `${nameSpace}/updateStates`,
            payload: {
                selectedDatas: _.cloneDeep(list),
                selectedDataIds: listIds,
            },
        });
    };
    //左侧
    const leftRender = (checkable, checkedKeys, nodeType, plst, checkStrictly) => {
        // 根据nodeType来判断节点是否禁掉 checkbox
        return (
            <div className={styles.left_org_tree}>
                <span className={styles.title}>组织机构</span>
                <div className={styles.content}>
                    <ITree
                        plst={plst}
                        getData={getData}
                        nodeType={nodeType}
                        onEditTree={() => {}}
                        onCheck={onCheck}
                        checkable={checkable}
                        currentNode={currentNode}
                        checkedKeys={checkedKeys}
                        checkStrictly={checkStrictly}
                        isDisabled={isDisabled}
                        style={{}}
                        isDisableCheckbox={true}
                    />
                </div>
            </div>
        );
    };

    return (
        <div
            className={`${styles.user_warp} ${className ? className : ''}`}
            style={{ height: `calc(100% - ${isUnit ? 90 : 48}px)` }}
        >
            <span className={styles.split_line}></span>
            {orgUserType == 'USER' ? (
                <ReSizeLeftRightCss
                    leftChildren={leftRender(false, [], 'DEPT', '请输入单位/部门名称', false)}
                    level={1}
                    height={'100%'}
                    rightChildren={
                        <ReSizeLeftRightCss
                            leftChildren={
                                !isDisabled ? (
                                    <MiddleWaitData
                                        originalData={originalData}
                                        selectIds={selectedDataIds}
                                        searchWordFn={searchWordFn}
                                        updateSelectIdsFn={updateSelectIdsFn}
                                        selectedDatas={selectedDatas}
                                        idKey="identityId"
                                        nameKey="userName"
                                        selectedNodeId={selectedNodeId}
                                        searchWordHint="姓名/账号"
                                        selectButtonType={selectButtonType}
                                    />
                                ) : (
                                    <div style={{ paddingTop: 40 }}>
                                        {newSelectedDatas &&
                                            newSelectedDatas.length > 0 &&
                                            newSelectedDatas.map((item) => (
                                                <div>
                                                    {item.userName}
                                                    {`(${item.deptName})`}
                                                </div>
                                            ))}
                                    </div>
                                )
                            }
                            rightChildren={
                                <RightSelectData
                                    selectedDatas={isDisabled ? newSelectedDatas : selectedDatas}
                                    idKey="identityId"
                                    nameKey="userName"
                                    columns={renderCol(orgUserType, closeTag, true)}
                                    closeTag={closeTag}
                                />
                            }
                            level={2}
                            vRigthNumLimit={100}
                            height={'100%'}
                        />
                    }
                />
            ) : orgUserType == 'USERGROUP' ? (
                <ReSizeLeftRightCss
                    level={1}
                    height={'100%'}
                    leftChildren={
                        <MiddleWaitData
                            originalData={originalData}
                            selectIds={selectedDataIds}
                            searchWordFn={searchWordFn}
                            updateSelectIdsFn={updateSelectIdsFn}
                            selectedDatas={selectedDatas}
                            idKey="nodeId"
                            nameKey="nodeName"
                            searchWordHint="请输入用户组名称"
                            selectedNodeId={selectedNodeId}
                            selectButtonType={selectButtonType}
                        />
                    }
                    rightChildren={
                        <RightSelectData
                            selectedDatas={selectedDatas}
                            idKey="nodeId"
                            nameKey="nodeName"
                            columns={renderCol(orgUserType, closeTag)}
                            closeTag={closeTag}
                        />
                    }
                />
            ) : orgUserType == 'RULE' ? (
                <ReSizeLeftRightCss
                    level={1}
                    height={'100%'}
                    leftChildren={leftRender(false, [], 'ORG', '请输入单位名称', false)}
                    rightChildren={
                        <ReSizeLeftRightCss
                            level={2}
                            vRigthNumLimit={100}
                            height={'100%'}
                            leftChildren={
                                <MiddleWaitData
                                    originalData={originalData}
                                    selectIds={selectedDataIds}
                                    searchWordFn={searchWordFn}
                                    updateSelectIdsFn={updateSelectIdsFn}
                                    selectedDatas={selectedDatas}
                                    idKey="id"
                                    nameKey="roleName"
                                    selectedNodeId={selectedNodeId}
                                    searchWordHint="请输入角色名称"
                                    selectButtonType={selectButtonType}
                                />
                            }
                            rightChildren={
                                <RightSelectData
                                    selectedDatas={selectedDatas}
                                    idKey="id"
                                    nameKey="roleName"
                                    columns={renderCol(orgUserType, closeTag)}
                                    closeTag={closeTag}
                                />
                            }
                        />
                    }
                />
            ) : (
                <ReSizeLeftRightCss
                    level={1}
                    height={'100%'}
                    leftChildren={leftRender(true, selectedDataIds, orgUserType, '请输入单位名称', true)}
                    rightChildren={
                        <RightSelectData
                            selectedDatas={selectedDatas}
                            idKey="nodeId"
                            nameKey="nodeName"
                            columns={renderCol(orgUserType, closeTag)}
                            closeTag={closeTag}
                        />
                    }
                />
            )}
        </div>
    );
}
Index.propTypes = {
    /**
     * nameSpace（model的命名）
     */
    nameSpace: PropTypes.string.isRequired,
    /**
     * model的state值
     */
    spaceInfo: PropTypes.object.isRequired,
    /**
     * 加载类型
     */
    orgUserType: PropTypes.string.isRequired,
    /**
     * 选择的按钮类型
     */
    selectButtonType: PropTypes.string,
};
Index.defaultProps = {
    selectButtonType: 'checkBox',
};
export default connect(({ indicatorNamespace, userAccredit }) => {
    return { indicatorNamespace, userAccredit };
})(Index);
