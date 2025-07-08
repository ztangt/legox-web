/**
 * 关联用户单位岗位
 * （注意，请在相关的model里面定义selectedNodeId,selectedDataIds,treeData,currentNode,expandedKeys,treeSearchWord,
 * selectedDatas,originalData,selectNodeType）
 * (注意：‘请在包含他的父节点上加上高度，因为高度设置的是继承)
 * (selectedDataIds是上次保存的数据id)
 * selectedDatas为选中的数据信息，selectedDataIds为选中的数据id
 * orgUserType=='ORGANIZATION'是组织结构，需要获取初始的selectedDatas值，结构为[{nodeName:'',nodeId:''}]
 */
import React, { useEffect, useImperativeHandle } from 'react';
import ReSizeLeftRightCss from '../public/reSizeLeftRight';
import styles from './relevanceModal.less';
import { connect } from 'dva';
import ITree from './treeSelect';
import RightSelectData from './rightSelectData';
import MiddleWaitData from './middleWaitData';
import PropTypes from 'prop-types';
import { renderCol } from './columns';
import { Modal } from 'antd';
import _ from 'lodash';
function Index({
  dispatch,
  nameSpace,
  spaceInfo,
  orgUserType,
  selectButtonType,
  nodeIds,
  treeType,
  type,
  onRef,
  updateState
}) {
  const {
    selectedNodeId,
    selectedDataIds,
    treeData,
    currentNode,
    expandedKeys,
    treeSearchWord,
    selectedDatas,
    originalData,
    selectNodeType,
  } = spaceInfo;
  useEffect(() => {
    if (orgUserType == 'ORGANIZATION') {
      //初始话
      updateState({
        currentNode: [],
        expandedKeys: [],
        treeSearchWord: '',
        originalData: [],
      })
    } else {
      //初始话
      updateState({
        selectedNodeId: '',
        selectedDatas: [],
        currentNode: [],
        expandedKeys: [],
        treeSearchWord: '',
        originalData: [],
      })
    }
    if (orgUserType == 'USERGROUP') {
      //获取用户组列表为originalData数据
      dispatch({
        type: `userAccreditState/getUgs`,
        payload: {
          searchWord: '',
          start: 1,
          limit: 10000,
        },
        callback:(list)=>{
          updateState({
            originalData: list,
          })
        }
      });
    }
    //通过selectedDataIds获取selectedDatas数据
    if (
      selectedDataIds.length &&
      !selectedDataIds.includes(undefined) &&
      orgUserType != 'ORGANIZATION'
    ) {
      dispatch({
        type: `userAccreditState/getSelectedDatas`,
        payload: {
          orgUserType: orgUserType,
          selectedDataIds: selectedDataIds,
        },
        callback:(selectedDatas)=>{
          updateState({
            selectedDatas: selectedDatas,
          })
        }
      });
    }
  }, []);
  //更新选择的用户ID
  const updateSelectIdsFn = (selectedDataIds, selectedDatas) => {
    updateState({
      selectedDataIds: selectedDataIds,
      selectedDatas: _.cloneDeep(selectedDatas),
    })
  };
  const getQueryUser = (searchWord, selectedNodeId, selectNodeType) => {
    dispatch({
      type: `userAccreditState/queryUser`,
      payload: {
        searchWord: searchWord,
        orgId: selectedNodeId,
        // 2022.09.01 http://81.70.230.227:3222/project/9/interface/api/401 这个接口早就改了  但是前端没有改（因为后端没通知到位~）
        // deptId: selectNodeType == 'DEPT' ? selectedNodeId : '',
        start: 1,
        limit: 10000,
        type: '',
      },
      callback:(list)=>{
        updateState({
          originalData:list,
        })
      }
    });
  };
  //获取岗位
  const getPosts=(searchWord,selectedNodeId)=>{
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
        updateState({
          originalData:list,
        })
      }
    })
  }
  //搜索人名
  const searchWordFn = (searchWord) => {
    if (orgUserType == 'USER') {
      getQueryUser(searchWord, selectedNodeId, selectNodeType);
    } else if (orgUserType == 'RULE') {
      getUnitRole(searchWord, selectedNodeId);
    }else if(orgUserType == 'POST'){
      getPosts(searchWord,selectedNodeId);
    }
  };
  //获取单位角色
  const getUnitRole = (searchWord, orgId) => {
    dispatch({
      type: `userAccreditState/getSysRoles`,
      payload: {
        searchWord: searchWord,
        orgId: orgId,
        roleType: 'ORGROLE',
        start: 1,
        limit: 10000,
      },
      callback:(list)=>{
        updateState({
          originalData:list
        })
      }
    });
  };
  //获取用户列表
  const getData = (node) => {
    updateState({
      selectedNodeId: node.key,
      selectNodeType: node.nodeType,
    })
    if (orgUserType == 'USER') {
      getQueryUser('', node.key, node.nodeType);
    } else if (orgUserType == 'RULE') {
      getUnitRole('', node.key);
    }else if(orgUserType == 'POST'){
      getPosts('',node.key);
    }
  };
  //关闭标签(关闭所以标签（清空）)
  const closeTag = (idValue, idKey) => {
    if (idValue) {
      selectedDataIds.splice(selectedDataIds.indexOf(idValue), 1);
      let newSelectedDatas = selectedDatas.filter(
        (item) => item[idKey] != idValue,
      );
      updateSelectIdsFn(selectedDataIds, newSelectedDatas);
    } else {
      updateSelectIdsFn([], []);
    }
  };

  useImperativeHandle(onRef, () => {
    return {
      func: closeTag,
    };
  });

  //左侧树状的选择
  const onCheck = (checkedKeys, { checked, node }) => {
    console.log('checkedKeys=', checkedKeys);
    let list = JSON.parse(JSON.stringify(selectedDatas || []));
    let listIds = _.cloneDeep(selectedDataIds);
    if (checked) {
      let obj = {};
      if (node.nodeType == 'ORG') {
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
        };
      }
      // else if (node.nodeType == 'POST') {
      //   obj = {
      //     nodeName: node.nodeName,
      //     orgName: node.parentType == 'ORG' ? node.parentName : '',
      //     deptName: node.parentType == 'DEPT' ? node.parentName : '',
      //     nodeId: node.nodeId,
      //   };
      // }
      if (selectButtonType == 'checkBox') {
        list.push(obj);
        listIds.push(node.nodeId);
      } else {
        list = [obj];
        listIds = [node.nodeId];
      }
    } else {
      if (selectButtonType == 'checkBox') {
        list = list.filter((x) => x.nodeId != node.nodeId);
        listIds = listIds.filter((x) => x != node.nodeId);
      } else {
        list = [];
        listIds = [];
      }
    }
    updateState({
      selectedDatas: list,
      selectedDataIds: listIds,
    })
  };
  //根据nodeType来判断节点是否禁掉 checkbox
  const loopTree = (tree, nodeType) => {
    tree.map((data) => {
      if (nodeType == 'ORGANIZATION') {
        data['disableCheckbox'] = false;
      } else {
        if (data.nodeType == nodeType) {
          data['disableCheckbox'] = false;
        } else {
          data['disableCheckbox'] = false;
        }
      }
      if (data.children && data.children.length != 0) {
        loopTree(data.children, nodeType);
      }
    });
    return tree;
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
    //let newTreeData = loopTree(treeData, nodeType);

    return (
      <div className={styles.left_org_tree}>
        <span className={styles.title}>组织机构</span>
        <div className={styles.content}>
          <ITree
            isControl={false}
            nodeIds={nodeIds}
            treeType={treeType}
            type={type}
            parentLoopTree={loopTree}
            plst={plst}
            getData={getData}
            nodeType={
              nameSpace === 'workTrust' ||
              nameSpace === 'publicDisk' ||
              nameSpace === 'information'||
              nameSpace === 'signDisk'||
              nameSpace === 'calendarMg'
                ? 'POST'
                : nodeType
            }
            onEditTree={() => {}}
            onCheck={onCheck}
            checkable={checkable}
            checkedKeys={checkedKeys}
            checkStrictly={checkStrictly}
            style={{}}
          />
        </div>
      </div>
    );
  };
  return (
    <div className={styles.user_warp}>
      <span className={styles.split_line}></span>
      {orgUserType == 'USER' ? (
        <ReSizeLeftRightCss
          level={1}
          lineTop={31}
          leftChildren={leftRender(
            false,
            [],
            'DEPT',
            '请输入单位/部门名称',
            false,
          )}
          rightChildren={
            <ReSizeLeftRightCss
              level={2}
              lineTop={31}
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
                  searchWordHint="姓名/账号"
                  selectButtonType={selectButtonType}
                />
              }
              rightChildren={
                <RightSelectData
                  selectedDatas={selectedDatas}
                  idKey="identityId"
                  nameKey="userName"
                  columns={renderCol(orgUserType, closeTag)}
                  closeTag={closeTag}
                />
              }
            />
          }
        />
      ) : orgUserType == 'USERGROUP' ? (
        <ReSizeLeftRightCss
          lineTop={31}
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
          lineTop={31}
          level={1}
          leftChildren={leftRender(false, [], 'ORG', '请输入单位名称', false)}
          rightChildren={
            <ReSizeLeftRightCss
              lineTop={31}
              level={2}
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
      ) : orgUserType=='POST'?(
        <ReSizeLeftRightCss
          lineTop={31}
          leftChildren={leftRender(
            false,
            [],
            'DEPT',
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
              vRigthNumLimit={100}
              height={'100%'}
              lineTop={31}
            />
          }
        />
      )
      :(
        <ReSizeLeftRightCss
          lineTop={31}
          leftChildren={leftRender(
            true,
            selectedDataIds,
            orgUserType,
            '请输入单位名称',
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
  /**
   * 请求树的单位类型(ORG,DEPT,POST)
   */
  treeType: PropTypes.string,
  /**
   * 当前单位INCLUDESUB
   */
  type: PropTypes.string,
  /**
   * 想要获取的单位id树
   */
  nodeIds: PropTypes.string,
};
Index.defaultProps = {
  selectButtonType: 'checkBox',
};
export default connect(({ role, layoutG }) => {
  return { role, layoutG };
})(Index);
