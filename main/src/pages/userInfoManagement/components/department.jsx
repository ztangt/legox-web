import React, { useState } from 'react';
import { connect } from 'dva';
import styles from './department.less';
import { history } from 'umi'
import { Space, Button, Input, Tree,Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import _ from "lodash";
const { Search } = Input;
function department({ dispatch, departmentClick, deptData, loading, currentUg, setValues, expandedDeptKeys, searchObj, treeData, currentNode, deptNames, deptSearchWord,departmentModal }) {
  const pathname = '/userInfoManagement';
  const { title, nodeType } = currentNode;
  const [deptList, setDeptList] = useState([])
  let deptName = []
  function getText(arr) {
    arr = JSON.parse(JSON.stringify(arr))
    if (arr && arr.length > 0) {
      arr.reverse()
      var str = '';
      for (var i = 0; i < arr.length; i++) {
        str += arr[i] + '-';
      }
      // arr.reverse()
      if (str.length > 0) {
        str = str.substr(0, str.length - 1);
      }
      return str;
    } else {
      return '';
    }
  }
  //展开节点
  function onExpand(expandedKeys, { expanded, node }) {
    if (expanded) {
      expandedDeptKeys.push(node.key)
      dispatch({
        type: 'tree/updateStates',
        payload: {
          // expandId: node.key,
          expandedDeptKeys: Array.from(new Set(expandedDeptKeys))
        }
      })
      if (node.isParent == 1) {
        // dispatch({
        //   type: 'tree/getOrgChildren',
        //   payload: {
        //     nodeId: node.key,
        //     nodeType: 'DEPT',
        //     onlySubDept: 1,
        //     start: 1,
        //     limit: 200

        //   },
        //   pathname: history.location.pathname,
        // })
        dispatch({
          type: 'tree/getOrgTree',
          payload: {
            parentId:node.key,
            orgKind:'DEPT',
            searchWord:'',
            onlySubDept: 1,

          },
          pathname: history.location.pathname,
        })
      }
    } else {
      const res = expandedDeptKeys.filter((value) => {
        return value !== node.key
      })

      dispatch({
        type: 'tree/updateStates',
        payload: {
          expandedDeptKeys: res,
        }
      })
    }
  }

  //获取选中节点的父节点
  function getParentKey(nodeKey, tree) {
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node['children']) {
        if (node['children'].some(item => item['key'] === nodeKey)) {
          if (node['orgKind'] == 'DEPT') {
            deptName.push(node['title'])
          }
          getParentKey(node['key'], deptData);
        } else if (getParentKey(nodeKey, node.children)) {
          getParentKey(nodeKey, node.children);
        }
      }
    }
  }

  /**
*
* @param {*} selectedKeys  选中节点key
* @param {*} info info.node 当前节点信息
*/
  function onSelect(selectedKeys, info) {
    deptName = [];
    let str = '';
    const { title, orgKind } = currentNode;
    let arr = JSON.parse(JSON.stringify(deptNames));
    if (info.selected) {
      currentUg.deptId = info.node.key
      currentUg.deptName = info.node.title;
      currentUg.deptCode = info.node.orgCode;
      getParentKey(info.node.key, deptData);
      if (orgKind == 'DEPT') {
        if (arr.length == 0 && deptName.length == 0) {
          str = info.node.title;
        } else if (deptName.length > 0) {
          str = getText(deptName) + '-' + info.node.title;
        } else if (arr.length > 0) {
          str = getText(arr) + '-' + info.node.title;
        }
      } else {
        str = deptName.length > 0 ? getText(deptName) + '-' + info.node.title : info.node.title;
      }
    } else {
      if (orgKind == 'DEPT') {
        if (arr.length == 0 && deptName.length == 0) {
          str = title;
        } else if (deptName.length > 0) {
          str = title + '-' + getText(deptName);
        } else if (arr.length > 0) {
          str = getText(arr) + '-' + title;
        }
      } else {
        str = deptName.length > 0 ? getText(deptName) + '-' + info.node.title : '';
      }
    }
    setDeptList([
      {
        name: ['deptName'],
        value: str,
      },
      {
        name: ['deptId'],
        value: info.node.key,
      },
    ])
    // setValues([
    //   {
    //     name: ['deptName'],
    //     value: str,
    //   },
    //   {
    //     name: ['deptId'],
    //     value: info.node.key,
    //   },
    // ])

    dispatch({
      type: 'userInfoManagement/updateStates',
      payload: {
        currentUg,
        posts: [],
      }
    })
  }

  function departmentFn() {
    departmentClick()
  }

  function onSave() {
    const { nodeType, parentId,key} = currentNode;
    console.log(currentNode, '163--------')
    if (deptList.length > 0) {
      dispatch({
        type: 'userInfoManagement/getPosts',
        payload: {
          orgId: currentUg.deptId,
          start: 1,
          limit: 1000,
          nodeType: 'DEPT',
          // requireOrgPost: nodeType == 'DEPT' ? 'YES':'NO',
          isEnable: 1,
          orgParentId: parentId=='0'?key:parentId
        },
        callback: () => {
        }
      })
      setValues(deptList)
      departmentClick();
    } else {
      departmentClick();
    }
  }



  function onSearch(value) {
    if (!value) {
      dispatch({
        type: 'tree/updateStates',
        payload: {
          deptData: []
        }
      })
    }
    dispatch({
      type: 'userInfoManagement/updateStates',
      payload: {
        deptSearchWord: value
      }
    })
    dispatch({
      type: 'tree/getDepts',
      payload: {
        searchWord: value,
        limit: 10000,
        start: 1,
        orgId: currentNode.nodeId
      }
    })
  };

  return (
    <Modal
      title="所属部门"
      visible={departmentModal}
      onCancel={departmentClick}
      width={800}
      mask={false}
      maskClosable={false}
      centered
      bodyStyle={{height:'calc(100vh - 290px)'}}
      footer={[
        <Button onClick={departmentFn}>
        取消
      </Button>,
        <Button type="primary" onClick={onSave}>
        保存
      </Button>

      ]}
      getContainer={() => {
        return document.getElementById('userInfo_container')||false
      }}
    >
      <div key={loading.global}>
        <div>
          <Search allowClear placeholder="请输入部门名称" onSearch={onSearch} style={{ width: 300 }} defaultValue={deptSearchWord} />
          <div >
            {deptData.length > 0 ? (<div className={styles.wrap}>
              <Tree treeData={deptData} onSelect={onSelect} onExpand={onExpand} expandedKeys={expandedDeptKeys} />
            </div>) : (<div style={{ textAlign: 'center', margin: '16px 0' }}>暂无数据</div>)}
          </div>
        </div>
        {/* <div className={styles.bt_group}>
          <Space>
            <Button type="primary" onClick={onSave}>
              保存
            </Button>
            <Button onClick={departmentFn}>
              取消
            </Button>
          </Space>
        </div> */}
      </div>
    </Modal>
  )
}
export default connect(({ userInfoManagement, tree, loading, layoutG }) => ({
  ...userInfoManagement,
  loading,
  ...tree,
  ...layoutG
}))(department);

