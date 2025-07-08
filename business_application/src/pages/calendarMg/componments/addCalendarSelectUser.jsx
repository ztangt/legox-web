/**
 * 废弃
 */
import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'dva';
import {
  Button,
  Modal,
  Row,
  Tree,
  Spin,
} from 'antd';

import {
  ApartmentOutlined,
  AppstoreOutlined,
  BankOutlined,
  UserOutlined,
} from '@ant-design/icons';

function AddCalendarSelectUser({
  location,
  dispatch,
  loading,
  layoutG,
  treeData,
  expandedKeys,
  checkedKeys,
  selectNodeUser,
}) {
  useEffect(() => {
    dispatch({
      type: 'calendarMg/getOrgChildren',
      payload: {
        nodeType: 'DEPT',
        nodeId: '',
        start: 1,
        limit: 200
      },
    });
    // dispatch({
    //   type: 'calendarMg/updateStates',
    //   payload: {
    //     expandedKeys: [],
    //     checkedKeys: [],
    //     selectNodeUser: [],
    //     selectNodeId: '',
    //     userList: [], //用户列表
    //   },
    // });
  }, []);

  const onCancel = () => {
    dispatch({
      type: 'calendarMg/updateStates',
      payload: {
        isShowRelationModal: false,
      },
    });
  };

  const onCheck = (checkedKey, { checked, node }) => {
    let list = JSON.parse(JSON.stringify(selectNodeUser));
    let listIds = JSON.parse(JSON.stringify(checkedKeys));
    if (checked) {
      if (node.nodeType == 'USER') {
        list.push(node);
        listIds.push(node.nodeId);
      }
    } else {
      if (node.nodeType == 'USER') {
        list.forEach(function (item, i) {
          if (item.nodeId == node.nodeId) {
            list.splice(i, 1);
          }
        });
        listIds.forEach(function (item, i) {
          if (item == node.nodeId) {
            listIds.splice(i, 1);
          }
        });
      }
    }
    dispatch({
      type: 'calendarMg/updateStates',
      payload: {
        selectNodeUser: list,
        checkedKeys: listIds,
      },
    });
    console.log('node', list, listIds);
  };

  //展开节点
  function onExpand(expandedKeys, { expanded, node }) {
    expandedKeys.push(node.key);
    if (expanded) {
      if (node.nodeType == 'ORG' || node.nodeType == 'DEPT') {
        let orgId = node.nodeType == 'ORG' ? node.nodeId : '';
        let deptId = node.nodeType == 'DEPT' ? node.nodeId : '';
        dispatch({
          type: 'calendarMg/updateStates',
          payload: {
            selectNodeId: node.nodeId,
            userList: [],
          },
        });
        dispatch({
          type: 'calendarMg/queryUser',
          payload: {
            start: 1,
            limit: 1000,
            orgId,
            deptId,
          },
        });
      }
      if (node.isParent == 1 && node.children[0].key == -1) {
        //如果子集未加载到数据时删除该key值
        let index = expandedKeys.findIndex((value) => {
          return value == node.key;
        });
        expandedKeys.splice(index, 1);
      }

      dispatch({
        type: 'calendarMg/updateStates',
        payload: {
          expandedKeys: Array.from(new Set(expandedKeys)),
        },
      });
      if (node.isParent == 1) {
        //当前点击节点为父节点  获取下一级数据
        dispatch({
          type: 'calendarMg/getOrgChildren',
          payload: {
            nodeId: node.key,
            nodeType: 'DEPT',
            onlySubDept: 1,
            start: 1,
            limit: 200
          },
        });
      }
    } else {
      let arr = [];
      arr.push(node);
      loop(arr, expandedKeys);
    }
  }

  function loop(arr, expandedKeys) {
    arr.forEach(function (item, i) {
      expandedKeys.forEach(function (policy, j) {
        if (policy == item.key) {
          expandedKeys.splice(j, 1);
        }
      });
      if (item.children && item.children.length != 0) {
        loop(item.children, expandedKeys);
      }
    });
    dispatch({
      type: 'calendarMg/updateStates',
      payload: {
        expandedKeys,
      },
    });
  }

  function userLists(list) {
    const listItems = list.map((item, i) => {
      return (
        <li key={i} style={{ height: '20px', lineHeight: '20px' }}>
          {item.nodeName}
        </li>
      );
    });
    return <ul>{listItems}</ul>;
  }

  function submitClick() {
    let list = JSON.parse(JSON.stringify(selectNodeUser));
    let names = [];
    let users = [];
    list.forEach(function (item, i) {
      names.push(item.nodeName);
      users.push(item.nodeId);
    });
    dispatch({
      type: 'calendarMg/updateStates',
      payload: {
        isShowRelationModal: false,
        relUser: users.join(','),
        relUserName: names.join(','),
      },
    });
  }

  return (
    <Modal
      visible={true}
      width={800}
      title="选择相关人"
      bodyStyle={{ height: '500px', padding: '10px' }}
      onCancel={onCancel}
      mask={false}
      maskClosable={false}
      getContainer={() => {
        return document.getElementById('calendarMgDiv')||false;
      }}
      footer={false}
    >
      <div
        style={{
          height: 'calc(100% - 52px)',
          display: 'flex',
          borderBottom: '1px solid #ccc',
        }}
      >
        <div
          style={{
            width: '50%',
            borderRight: '1px solid #ccc',
            overflow: 'auto',
          }}
        >
          <Spin spinning={loading.global}>
            <Tree
              titleRender={(node) => (
                <span key={node.key}>
                  {node.nodeType == 'DEPT' ? (
                    <ApartmentOutlined style={{ marginRight: 5 }} />
                  ) : node.nodeType == 'ORG' ? (
                    <BankOutlined style={{ marginRight: 5 }} />
                  ) : node.nodeType == 'POST' ? (
                    <AppstoreOutlined style={{ marginRight: 5 }} />
                  ) : node.nodeType == 'USER' ? (
                    <UserOutlined style={{ marginRight: 5 }} />
                  ) : (
                    ''
                  )}
                  {node.title}
                </span>
              )}
              checkable
              onCheck={onCheck}
              treeData={treeData}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              checkStrictly={true}
              checkedKeys={checkedKeys}
              // key={loading.global}
              showLine={{ showLeafIcon: true }}
              showIcon={true}
            />
          </Spin>
        </div>
        <div style={{ width: '50%', overflow: 'auto' }}>
          {userLists(selectNodeUser)}
        </div>
      </div>
      <Row style={{ width: '200px', margin: '10px auto' }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading.global}
          onClick={submitClick}
        >
          保存
        </Button>
        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
          取消
        </Button>
      </Row>
    </Modal>
  );
}
export default connect(({ calendarMg, layoutG, loading }) => ({
  ...calendarMg,
  ...layoutG,
  loading,
}))(AddCalendarSelectUser);
