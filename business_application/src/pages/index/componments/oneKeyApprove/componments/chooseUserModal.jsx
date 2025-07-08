/**表单送交弹框页的办理人及阅办人的选择页面 */
import {connect} from 'dva';
import React, {useState, useRef, useEffect} from 'react';
import {Input, Button, Tabs, Tree} from 'antd';
import Modal from '../../../../../componments/public/modal/index';
import styles from '../../../../../componments/formPreview/submit.less';
import MiddleWaitData from '../../../../../componments/relevanceModal/middleWaitData';
import RightSelectData from '../../../../../componments/relevanceModal/rightSelectData';
import {renderCol} from '../../../../../componments/relevanceModal/columns';
import ReSizeLeftRightCss from '../../../../../componments/public/reSizeLeftRight';
import {
  ApartmentOutlined,
  AppstoreOutlined,
  BankOutlined,
  UserOutlined
} from '@ant-design/icons';

const TabPane = Tabs.TabPane;
//一级分组
const GROUPTYPE = [
  {
    nodeId: "ORG",
    nodeName: '从组织机构'
  },
  {
    nodeId: "ROLE",
    nodeName: '用户组/岗位/角色'
  },
  {
    nodeId: "CUSTOM",
    nodeName: '自定义组'
  },
]
const loopTree = (array) => {
  console.log('array=', array);
  for (var i = 0; i < array.length; i++) {
    array[i]['title'] = array[i]['nodeName'];
    array[i]['key'] = array[i]['key'];
    array[i]['value'] = array[i]['nodeId'];
    array[i]['isLeaf'] = array[i]['isHaveChild'] || array[i]['isParent'] == '1' ? false : true;//应为搜索和展开是两个不同的接口返回的数据不同
    if (array[i].children && typeof array[i].children != 'undefined' && array[i].children.length != 0) {
      loopTree(array[i].children)
    } else {
      array[i].children = [];
    }
  }
  return array
}

function ChooseUserModal({dispatch, oneKeyApprove, loading, save, bizInfo}) {
  const {
    checkList, // 默认选中用户id 数组
    userType,
    choreographyFlag,
    choreographyOrgId,
    treeData,
    expandedKeys, userList, selectNodeUser,
    groupActiveKey, searchUserList, searchTreeWord, selectedTreeKey,
    selectUserActId, selectDealStrategy, groupData
  } = oneKeyApprove;

  useEffect(() => {
    // 加载树数据
    getTreeData();

    //获取用户 信息
    if (checkList.length) {
      dispatch({
        type: 'oneKeyApprove/getUsersByIds',
        payload: {
          identityIds: checkList,
          userType: userType,
          start: 1,
          limit: 1000
        }
      })
    }

  }, [])


  function getTreeData() {
    dispatch({
      type: 'oneKeyApprove/getGroupList',
      payload: {
        bizInfoId: bizInfo.bizInfoId,
        bizSolId: bizInfo.bizSolId,
        procDefId: bizInfo.procDefId,
        formDeployId: bizInfo.formDeployId,
        choreographyFlag: choreographyFlag,      // 是否编排
        choreographyOrgId: choreographyOrgId,  // 编排归属单位ID
        actId: selectUserActId,
        userType: userType,
        nodeType: '',
        nodeId: '',
      }
    })
  }


  function tabCallback(key) {
    //通过key获取当前的组信息`
    let currentInfo = groupData?.[key] || [];
    console.log('currentInfo=', currentInfo);
    dispatch({
      type: 'oneKeyApprove/updateStates',
      payload: {
        groupActiveKey: key,
        treeData: _.cloneDeep(currentInfo),//更新treeData
        userList: [],
        expandedKeys: [],
        searchTreeWord: '',
        selectedTreeKey: '',
        searchUserList: [],
        searchUserWord: ''
      }
    })
  }

  function onExpand(expandedKeys, {expanded, node}) {
    expandedKeys.push(node.key)
    if (expanded) {
      dispatch({
        type: 'oneKeyApprove/updateStates',
        payload: {
          expandedKeys: Array.from(new Set(expandedKeys)),
        }
      })

      //获取子集
      dispatch({
        type: 'oneKeyApprove/getSubordinateSendTree',
        payload: {
          bizInfoId: bizInfo.bizInfoId,
          bizSolId: bizInfo.bizSolId,
          procDefId: bizInfo.procDefId,
          formDeployId: bizInfo.formDeployId,
          actId: selectUserActId,
          nodeId: node.nodeId,
          nodeType: node.nodeType,
          subordinate: node.subordinate,
          nodeName: node.nodeName,
          nodeKey: node.key,
          userType
        }
      })
    } else {
      let arr = [];
      arr.push(node)
      loop(arr, expandedKeys)
    }
  }

  console.log('treedata====', treeData);

  function loop(arr, expandedKeys) {
    arr.forEach(function (item, i) {
      expandedKeys.forEach(function (policy, j) {
        if (policy == item.key) {
          expandedKeys.splice(j, 1)
        }
      });
      if (item.children && item.children.length != 0) {
        loop(item.children, expandedKeys)
      }
    });
    console.log('expandedKeys==', expandedKeys);
    dispatch({
      type: 'oneKeyApprove/updateStates',
      payload: {
        expandedKeys
      }
    })
  }

  const onSelect = (selectedKeys, {selected, node}) => {
    if (selected) {
      dispatch({
        type: 'oneKeyApprove/updateStates',
        payload: {
          selectedTreeKey: node.nodeId
        }
      })
      if (node.nodeType == 'ORG' || node.nodeType == 'DEPT') {
        let orgId = node.nodeId;
        //let deptId = node.nodeType == 'DEPT' ? node.nodeId : '';
        dispatch({
          type: 'oneKeyApprove/queryUsers',
          payload: {
            start: 1,
            limit: 1000,
            orgId,
            //deptId
          }
        })
      } else if (node.nodeType == 'POST') {
        dispatch({
          type: "oneKeyApprove/getPostUserList",
          payload: {
            postId: node.nodeId,
            start: 1,
            limit: 10000
          }
        })
      } else if (node.nodeType == 'USER_GROUP') {
        dispatch({
          type: "oneKeyApprove/getGroupUserList",
          payload: {
            usergroupId: node.nodeId,
          }
        })
      } else if (node.nodeType == 'ROLE') {
        dispatch({
          type: "oneKeyApprove/getRoleUserList",
          payload: {
            roleId: node.nodeId,
          }
        })
      } else if (node.nodeType == 'CUSTOM') {
        dispatch({
          type: "oneKeyApprove/getCustomUserList",
          payload: {
            bizInfoId: bizInfo.bizInfoId,
            actId: bizInfo.actId,
            customEventId: node.eventId
          }
        })
      }
    }
  };

  function onCheckChange(newSelectIds, newSelectedUsers) {
    dispatch({
      type: 'oneKeyApprove/updateStates',
      payload: {
        selectNodeUser: newSelectedUsers,
        checkList: newSelectIds
      }
    })
  }

  function removeOnClick(idValue, idKey) {
    if (idValue) {
      checkList.splice(checkList.indexOf(idValue), 1);
      let newSelectedDatas = selectNodeUser.filter(item => item[idKey] != idValue);
      dispatch({
        type: 'oneKeyApprove/updateStates',
        payload: {
          selectNodeUser: newSelectedDatas,
          checkList: checkList
        }
      })
    } else {
      dispatch({
        type: 'oneKeyApprove/updateStates',
        payload: {
          selectNodeUser: [],
          checkList: []
        }
      })
    }
  }

  function onCancel() {
    dispatch({
      type: 'oneKeyApprove/updateStates',
      payload: {
        submitModal: false
      }
    })
  }

  //搜索用户列表
  function updateUserList(value) {
    let newList = [];
    userList.map((item) => {
      if (item.userName.includes(value)) {
        newList.push(item)
      }
    })
    dispatch({
      type: "oneKeyApprove/updateStates",
      payload: {
        searchUserList: newList
      }
    })
  }

  console.log('selectNodeUser=', selectNodeUser);
  // console.log('oldSelectNodeUser=',oldSelectNodeUser);
  //搜索单位树
  function searchOrgTree(value) {
    if (value) {
      if (groupActiveKey == 'ORG') {
        //获取nodeIds的集合
        const nodeIds = groupData['ORG'].map((item) => {
          return item.nodeId;
        })
        dispatch({
          type: "oneKeyApprove/getSearchSendTree",
          payload: {
            nodeIds: nodeIds.join(','),
            nodeType: '',
            searchWord: value
          }
        })
      } else {
        let searchTreeData = [];
        treeData.map((item) => {
          if (item.nodeName.includes(value)) {
            searchTreeData.push(item);
          }
        })
        dispatch({
          type: 'oneKeyApprove/updateStates',
          payload: {
            treeData: searchTreeData
          }
        })
      }
    } else {//清空
      let newTreeData = groupData[groupActiveKey];
      dispatch({
        type: 'oneKeyApprove/updateStates',
        payload: {
          treeData: newTreeData
        }
      })
    }
    dispatch({
      type: 'oneKeyApprove/updateStates',
      payload: {
        expandedKeys: [],
      }
    })
  }

  function changeSearchTreeWord(e) {
    dispatch({
      type: "oneKeyApprove/updateStates",
      payload: {
        searchTreeWord: e.target.value
      }
    })
  }

  function leftRender() {
    console.log('treeData=', treeData);
    return (
      <div className={styles.left_org_tree}>
        <Input.Search
          onSearch={searchOrgTree}
          allowClear
          value={searchTreeWord}
          onChange={changeSearchTreeWord}
          style={{marginBottom: '16px'}}
        />
        <div className={styles.tree_warp}>
          <Tree
            titleRender={(node) => <span key={node.key} className={styles.tree_node}>
                {
                  node.nodeType == 'DEPT' ?
                    <ApartmentOutlined style={{marginRight: 5}}/> :
                    node.nodeType == 'ORG' ?
                      <BankOutlined style={{marginRight: 5}}/> :
                      node.nodeType == 'POST' ?
                        <AppstoreOutlined style={{marginRight: 5}}/> :
                        node.nodeType == 'USER' ?
                          <UserOutlined style={{marginRight: 5}}/> : ''
                }
              {titleRender(node.title)}
                </span>}
            treeData={loopTree(treeData)}
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            checkStrictly={true}
            key={loading.global}
            showLine={{showLeafIcon: true}}
            showIcon={true}
            onSelect={onSelect}
            selectedKeys={[selectedTreeKey]}
          />
        </div>
      </div>
    )
  }

  //渲染tree标题
  function titleRender(title) {
    let index = -1;
    let beforeStr = '';
    let afterStr = '';
    if (searchTreeWord) {
      index = title.indexOf(searchTreeWord);
      beforeStr = title.substr(0, index);
      afterStr = title.substr(index + searchTreeWord.length);
    } else {
      index = -1;
    }
    const newTitle =
      index > -1 ? (
        <span>
            {beforeStr}
          <span style={{background: "#ffeb75"}}>{searchTreeWord}</span>
          {afterStr}
          </span>
      ) : (
        <span>
            {title}
          </span>
      );
    return newTitle;
  }

  return (
    <Modal
      visible={true}
      widthType={3}
      title='请选择'
      onCancel={onCancel}
      mask={false}
      maskClosable={false}
      getContainer={() => {
        return document.getElementById('dom_container')
      }}
      getElementById="dom_container"
      bodyStyle={{overflow: 'hidden'}}
      footer={[
        <Button key="cancel" onClick={onCancel}>取消</Button>,
        <Button key="submit" type="primary" onClick={save}>保存</Button>
      ]}
      className={styles.submit_warp}
    >
      <div className={styles.submitWrap}>
        <Tabs activeKey={groupActiveKey} onChange={tabCallback}>
          {GROUPTYPE.map((item, index) => {
            return (
              <TabPane tab={item.nodeName} key={item.nodeId} style={{margin: '0 10px'}}>
              </TabPane>
            )
          })}
        </Tabs>
        <ReSizeLeftRightCss
          height={'calc(100% - 46px)'}
          leftChildren={leftRender()}
          isShowRight={true}
          suffix={'send_submit'}
          rightChildren={
            <ReSizeLeftRightCss
              height={'100%'}
              isShowRight={true}
              level={2}
              suffix={'send_submit'}
              leftChildren={<MiddleWaitData
                originalData={searchUserList}
                selectIds={checkList}
                searchWordFn={updateUserList}
                updateSelectIdsFn={onCheckChange}
                selectedDatas={selectNodeUser}
                idKey="identityId"
                nameKey="userName"
                selectedNodeId={selectedTreeKey}
                searchWordHint="姓名/账号"
                selectButtonType={selectDealStrategy == '1' ? "radio" : 'checkBox'}
                isShowTitle={false}
                postName="postName"
              />}
              rightChildren={<RightSelectData
                selectedDatas={JSON.parse(JSON.stringify(selectNodeUser))}
                idKey="identityId"
                nameKey="userName"
                columns={renderCol('USER', removeOnClick)}
                closeTag={removeOnClick}
                isShowTitle={false}
              />
              }
            />
          }
        />
      </div>
    </Modal>
  )

}


export default connect(({oneKeyApprove, loading}) => {
  return {oneKeyApprove, loading}
})(ChooseUserModal);
