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
      },
    });
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
      console.log('wwwwww=');
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
  //左侧树状的选择
  const onCheck = (checkedKeys, { checked, node }) => {
    console.log('checkedKeys=', checkedKeys);
    console.log('selectedDatas=', selectedDatas);
    let list = JSON.parse(JSON.stringify(selectedDatas));
    let listIds = _.cloneDeep(selectedDataIds) || [];
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
          orgName: node.orgName,
        };
      } else if (node.nodeType == 'POST') {
        console.log('node=', node);
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
        console.log(list, 'list==');
        console.log(obj, 'obj==');
        list.push(obj);
        listIds.push(node.nodeId);
        console.log(list, 'list000');
      } else {
        list = [obj];
        listIds = [node.nodeId];
      }
    } else {
      list = list.filter((x) => x.nodeId != node.nodeId);
      listIds = listIds.filter((x) => x != node.nodeId);
    }
    console.log(list, 'list==');
    dispatch({
      type: `${nameSpace}/updateStates`,
      payload: {
        selectedDatas: _.cloneDeep(list),
        selectedDataIds: listIds,
      },
    });
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
        <div className={styles.content}>
          <ITree
            plst={plst}
            getData={getData}
            nodeType={nodeType}
            onEditTree={() => {}}
            onCheck={onCheck}
            checkable={checkable}
            checkedKeys={checkedKeys}
            checkStrictly={checkStrictly}
            style={{}}
            isDisableCheckbox={true}
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
};
Index.defaultProps = {
  selectButtonType: 'checkBox',
};
export default connect(({ role, layoutG }) => {
  return { role, layoutG };
})(Index);
