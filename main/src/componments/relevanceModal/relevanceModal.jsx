/**
 * 关联用户单位岗位
 * （注意，请在相关的model里面定义selectedNodeId,selectedDataIds,treeData,currentNode,expandedKeys,treeSearchWord,
 * selectedDatas,originalData,selectNodeType）
 * (selectedDataIds是上次保存的数据id)
 * selectedDatas为选中的数据信息，selectedDataIds为选中的数据id
 */
import React, { useEffect, useState, useRef } from 'react';
import ReSizeLeftRightCss from '../public/reSizeLeftRight';
import styles from './relevanceModal.less';
import { connect } from 'umi';
import ITree from './Tree';
import RightSelectData from './rightSelectData';
import MiddleWaitData from './middleWaitData';
import PropTypes from 'prop-types';
import { renderCol } from './columns';
import _ from 'lodash';
function Index({
  dispatch,
  nameSpace,
  spaceInfo,
  orgUserType,
  selectButtonType,
  setParentState,
  containerId,
  selectOrgId,
  unitAllRole
}) {
  const {
    selectedNodeId,
    selectedDataIds,
    currentNode,
    expandedKeys,
    treeSearchWord,
    selectedDatas,
    originalData,
    selectNodeType,
  } = spaceInfo;
  useEffect(() => {
    if(setParentState){
      setParentState({
        selectedNodeId: '',
        selectedDatas: [],
        currentNode: [],
        expandedKeys: [],
        treeSearchWord: '',
        originalData: [],
        oldOriginalData:[]
      })
    }else{
      //初始话
      dispatch({
        type: `${nameSpace}/updateStates`,
        payload: {
          selectedNodeId: '',
          selectedDatas: [],
          currentNode: [],
          expandedKeys: [],
          treeSearchWord: '',
          originalData: [],
          oldOriginalData:[]
        },
      });
    }
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
        callback:(list)=>{
          if(setParentState){
            setParentState({
              originalData: list,
              oldOriginalData:list
            })
          }else{
            dispatch({
              type: `${nameSpace}/updateStates`,
              payload: {
                originalData: list,
                oldOriginalData:list
              }
            })
          }
        }
      });
    }
    //通过selectedDataIds获取selectedDatas数据
    if (selectedDataIds.length&&nameSpace!=='role' && nameSpace !== 'platformCodeRules' && nameSpace !== 'formEngine' && nameSpace !== 'listMoudles'
        && nameSpace !== 'businessFormManage' && nameSpace !=='workflowEngine' && nameSpace !== 'applyModel'
    ) {
      dispatch({
        type: `userAccredit/getSelectedDatas`,
        payload: {
          namespace: nameSpace,
          orgUserType: orgUserType,
          selectedDataIds: selectedDataIds,
        },
        callback:(selectedDatas)=>{
          if(setParentState){
            setParentState({
              selectedDatas:selectedDatas
            })
          }else{
            dispatch({
              type: `${nameSpace}/updateStates`,
              payload:{
                selectedDatas:selectedDatas
              }
            })
          }
        }
      });
    }
    if(nameSpace=='role'){
      if(setParentState){
        setParentState({
          selectedDatas: selectedDatas,
        })
      }else{
        dispatch({
          type: `${nameSpace}/updateStates`,
          payload: {
            selectedDatas: selectedDatas,
          },
        });
      }
    }

    // 编码规则、表单设计器、列表建模、业务表单管理、流程引擎、业务应用建模
    if(nameSpace=='formEngine' || nameSpace=='platformCodeRules' || nameSpace=='listMoudles' || nameSpace=='businessFormManage' || nameSpace=='workflowEngine'
    ||nameSpace == 'applyModel'){
      if(setParentState){
        setParentState({
          selectedDatas: selectedDatas,
        })
      }else{
        dispatch({
          type: `${nameSpace}/updateStates`,
          payload: {
            selectedDatas: selectedDatas,
          },
        });
      }
    }



  }, []);
  //更新选择的用户ID
  const updateSelectIdsFn = (selectedDataIds, selectedDatas) => {
    if(setParentState){
      setParentState({
        selectedDataIds: selectedDataIds,
        selectedDatas: _.cloneDeep(selectedDatas),
      })
    }else{
      dispatch({
        type: `${nameSpace}/updateStates`,
        payload: {
          selectedDataIds: selectedDataIds,
          selectedDatas: _.cloneDeep(selectedDatas),
        },
      });
    }
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
      callback:(list)=>{
        if(setParentState){
          setParentState({
            originalData:list,
          })
        }else{
          dispatch({
            type: `${nameSpace}/updateStates`,
            payload:{
              originalData:list
            }
          })
        }
      }
    });
  };
  //搜索人名
  const searchWordFn = searchWord => {
    if (orgUserType == 'USER') {
      getQueryUser(searchWord, selectedNodeId, selectNodeType);
    } else if (orgUserType == 'RULE') {
      getUnitRole(searchWord, selectedNodeId);
    }else if(orgUserType == 'POST'){
      getPosts(searchWord,selectedNodeId);
    }else if(orgUserType == 'USERGROUP'){
      getUserGroup(searchWord);
    }
  };
  //获取用户组搜索
  const getUserGroup=(searchWord)=>{
    if(searchWord){
      let newInfos = spaceInfo.oldOriginalData.filter(i=>i.nodeName.includes(searchWord));
      if(setParentState){
        setParentState({
          originalData: newInfos,
        })
      }else{
        dispatch({
          type: `${nameSpace}/updateStates`,
          payload: {
            originalData: newInfos,
          },
        });
      }
    }else{
      if(setParentState){
        setParentState({
          originalData: spaceInfo.oldOriginalData,
        })
      }else{
        dispatch({
          type: `${nameSpace}/updateStates`,
          payload: {
            originalData: spaceInfo.oldOriginalData,
          },
        });
      }
    }
  }
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
      callback:(list)=>{
        if(setParentState){
          setParentState({
            originalData:list
          })
        }else{
          dispatch({
            type: `${nameSpace}/updateStates`,
            payload:{
              originalData:list
            }
          })
        }
      }
    });
  };
  //获取岗位
  const getPosts=(searchWord,selectedNodeId)=>{
    debugger;
    dispatch({
      type: 'userAccredit/getPosts',
      payload:{
        namespace: nameSpace,
        searchWord:searchWord,
        start:1,
        limit:200,
        deptId:selectedNodeId,
        orgId:selectedNodeId,
        requireOrgPost:'NO',
        isEnable: 1,
      },
      callback:(list)=>{
        if(setParentState){
          setParentState({
            originalData:list
          })
        }else{
          dispatch({
            type: `${nameSpace}/updateStates`,
            payload:{
              originalData:list
            }
          })
        }
      }
    })
  }
  //获取用户列表
  const getData = node => {
    if(setParentState){
      setParentState({
        selectedNodeId: node.key,
        selectNodeType: node.orgKind,
      })
    }else{
      dispatch({
        type: `${nameSpace}/updateStates`,
        payload: {
          selectedNodeId: node.key,
          selectNodeType: node.orgKind,
        },
      });
    }
    if (orgUserType == 'USER') {
      getQueryUser('', node.key, node.orgKind);
    } else if (orgUserType == 'RULE') {
      getUnitRole('', node.key);
    } else if(orgUserType == 'POST'){
      getPosts('',node.key);
    }
  };
  //关闭标签(关闭所以标签（清空）)
  const closeTag = (idValue, idKey, item) => {
    if (idValue === 'clearAll') {
      return updateSelectIdsFn([], []);
    }
    // 如果iDKey不存在，用identityId代替
    selectedDataIds.splice(selectedDataIds.indexOf(idValue), 1);
    let newSelectedDatas = selectedDatas.filter(item => {
      if (item[idKey]) {
        return item[idKey] != idValue;
      } else {
        return item.identityId != idValue;
      }
    });
    updateSelectIdsFn(selectedDataIds, newSelectedDatas);
  };
  //左侧树状的选择
  const onCheck = (checkedKeys, { checked, node }) => {
    let list = JSON.parse(JSON.stringify(selectedDatas));
    let listIds = _.cloneDeep(selectedDataIds) || [];
    if (checked) {
      let obj = {};
      if (node.orgKind == 'ORG') {
        obj = {
          nodeName: node.orgName,
          parentName: node.parentName,
          parentId: node.parentId,
          nodeId: node.id,
        };
      } else if (node.orgKind == 'DEPT') {
        obj = {
          nodeName: node.orgName,
          parentName:node.parentNumber!=node.belongOrgNumber?node.parentName : '',
          nodeId: node.id,
          orgName: node.belongOrgName,
        };
      }
      // else if (node.nodeType == 'POST') {
      //   console.log('node=', node);
      //   obj = {
      //     nodeName: node.nodeName,
      //     orgName: node.orgName,
      //     deptName: node.deptName,
      //     nodeId: node.nodeId,
      //   };
      // }
      if (selectButtonType == 'checkBox') {
        list.push(obj);
        listIds.push(node.id);
      } else {
        list = [obj];
        listIds = [node.id];
      }
    } else {
      list = list.filter(x => x.nodeId != node.id);
      listIds = listIds.filter(x => x != node.id);
    }
    if(setParentState){
      setParentState({
        selectedDatas: list,
        selectedDataIds: listIds,
      })
    }else{
      dispatch({
        type: `${nameSpace}/updateStates`,
        payload: {
          selectedDatas: list,
          selectedDataIds: listIds,
        },
      });
    }
  };
  //左侧
  const leftRender = (
    checkable,
    checkedKeys,
    nodeType,
    plst,
    checkStrictly,
  ) => {    
    // 根据nodeType来判断节点是否禁掉 checkbox
    return (
      <div className={styles.left_org_tree}>
        <span className={styles.title}>组织机构</span>
        <div className={styles.content} style={{ position: 'relative' }}>
          <ITree
            plst={plst}
            getData={getData}
            nodeType={nodeType=='DEPT'?'ORG_':nodeType}
            orgKind={nodeType}
            onEditTree={() => {}}
            onCheck={onCheck}
            checkable={checkable}
            checkedKeys={checkedKeys}
            checkStrictly={checkStrictly}
            style={{}}
            isDisableCheckbox={true}
            selectOrgId={selectOrgId}
            unitAllRole={unitAllRole}
          />
        </div>
      </div>
    );
  };
  console.log("orgUserType",orgUserType)
  const renderContainer = ()=>{
    if(orgUserType == 'USER'){
      return (
        <ReSizeLeftRightCss
          lineTop={23}
          suffix={containerId}
          leftChildren={leftRender(
            false,
            [],
            'ORG_',
            '请输入单位/部门名称、编码',
            false,
          )}
          level={1}
          height={'100%'}
          rightChildren={
            <ReSizeLeftRightCss
              lineTop={23}
              suffix={containerId}
              leftChildren={
                <MiddleWaitData
                  originalData={originalData}
                  selectIds={selectedDataIds}
                  searchWordFn={searchWordFn}
                  updateSelectIdsFn={updateSelectIdsFn}
                  selectedDatas={selectedDatas}
                  idKey="identityId"
                  nameKey="userName"
                  selectedNodeId={selectedNodeId}
                  searchWordHint="姓名/账号/手机号/邮箱"
                  selectButtonType={selectButtonType}
                />
              }
              rightChildren={
                <RightSelectData
                  selectedDatas={selectedDatas}
                  idKey="orgRefUserId"
                  nameKey="userName"
                  columns={renderCol(orgUserType, closeTag)}
                  closeTag={closeTag}
                />
              }
              level={2}
              vRigthNumLimit={100}
              height={'100%'}
            />
          }
        />
      )
    }else if(orgUserType == 'USERGROUP'){
      return (
        <ReSizeLeftRightCss
          level={1}
          height={'100%'}
          lineTop={23}
          suffix={containerId}
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
      )
    }else if(orgUserType == 'RULE'){
      return (
        <ReSizeLeftRightCss
          level={1}
          height={'100%'}
          lineTop={23}
          suffix={containerId}
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
      )
    }else if(orgUserType == 'POST'){
      return (
        <ReSizeLeftRightCss
          lineTop={23}
          suffix={containerId}
          leftChildren={leftRender(
            false,
            [],
            'ORG_',
            '请输入单位/部门名称',
            false,
          )}
          level={1}
          height={'100%'}
          rightChildren={
            <ReSizeLeftRightCss
              leftChildren={
                <MiddleWaitData
                  originalData={originalData}
                  selectIds={selectedDataIds}
                  searchWordFn={searchWordFn}
                  updateSelectIdsFn={updateSelectIdsFn}
                  selectedDatas={selectedDatas}
                  idKey="nodeId"
                  nameKey="nodeName"
                  selectedNodeId={selectedNodeId}
                  searchWordHint="岗位名称"
                  selectButtonType={selectButtonType}
                  orgUserType={orgUserType}
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
              level={2}
              // vRigthNumLimit={100}
              height={'100%'}
            />
          }
        />
      )
    }else{
      return (
        <ReSizeLeftRightCss
          lineTop={23}
          suffix={containerId}
          level={1}
          height={'100%'}
          leftChildren={leftRender(
            true,
            selectedDataIds,
            orgUserType,
            orgUserType=='DEPT'?'请输入单位/部门名称、编码':'请输入单位名称/编码',
            true,
          )}
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
      )
    }
  }
  return (
    <div className={styles.user_warp}>
      <span className={styles.split_line}></span>
      {renderContainer()}
      {/* {orgUserType == 'USER' ? (
        <ReSizeLeftRightCss
          lineTop={23}
          suffix={containerId}
          leftChildren={leftRender(
            false,
            [],
            'ORG_',
            '请输入单位/部门名称、编码',
            false,
          )}
          level={1}
          height={'100%'}
          rightChildren={
            <ReSizeLeftRightCss
              lineTop={23}
              suffix={containerId}
              leftChildren={
                <MiddleWaitData
                  originalData={originalData}
                  selectIds={selectedDataIds}
                  searchWordFn={searchWordFn}
                  updateSelectIdsFn={updateSelectIdsFn}
                  selectedDatas={selectedDatas}
                  idKey="identityId"
                  nameKey="userName"
                  selectedNodeId={selectedNodeId}
                  searchWordHint="姓名/账号/手机号/邮箱"
                  selectButtonType={selectButtonType}
                />
              }
              rightChildren={
                <RightSelectData
                  selectedDatas={selectedDatas}
                  idKey="orgRefUserId"
                  nameKey="userName"
                  columns={renderCol(orgUserType, closeTag)}
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
          lineTop={23}
          suffix={containerId}
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
          lineTop={23}
          suffix={containerId}
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
      ) : orgUserType == 'POST' ? (
        <ReSizeLeftRightCss
          lineTop={23}
          suffix={containerId}
          leftChildren={leftRender(
            false,
            [],
            'ORG_',
            '请输入单位/部门名称',
            false,
          )}
          level={1}
          height={'100%'}
          rightChildren={
            <ReSizeLeftRightCss
              leftChildren={
                <MiddleWaitData
                  originalData={originalData}
                  selectIds={selectedDataIds}
                  searchWordFn={searchWordFn}
                  updateSelectIdsFn={updateSelectIdsFn}
                  selectedDatas={selectedDatas}
                  idKey="nodeId"
                  nameKey="nodeName"
                  selectedNodeId={selectedNodeId}
                  searchWordHint="岗位名称"
                  selectButtonType={selectButtonType}
                  orgUserType={orgUserType}
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
              level={2}
              // vRigthNumLimit={100}
              height={'100%'}
            />
          }
        />
      )
      :(
        <ReSizeLeftRightCss
          lineTop={23}
          suffix={containerId}
          level={1}
          height={'100%'}
          leftChildren={leftRender(
            true,
            selectedDataIds,
            orgUserType,
            orgUserType=='DEPT'?'请输入单位/部门名称、编码':'请输入单位名称/编码',
            true,
          )}
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
      )} */}
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
  /**
   * 更新父节点的state
   */
  setParentState:PropTypes.func,
  /**
   * 唯一的id,不加的话左右拖拽会有问题
   */
  containerId:PropTypes.string
};
Index.defaultProps = {
  selectButtonType: 'checkBox',
};
export default connect(({ role, layoutG }) => {
  return { role, layoutG };
})(Index);
