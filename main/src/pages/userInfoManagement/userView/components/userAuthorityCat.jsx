import React, { useState } from 'react';
import { connect } from 'dva';
import styles from './userAuthorityCat.less';
import { Tree, Table, Button, Input, Space } from 'antd';

function UserAuthorityCat({dispatch,setParentState,parentState}) {
    const {
        authorityTree,
        userId
    } = parentState;

    const [checkedKeys, setCheckedKeys] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    console.log('authorityTree=',authorityTree);
    // 树数据处理
    const treeDataHandle = (data) => {
      console.log('data11=',data);
      return data && data.map(item => {
          if (item.children && item.children.length) {
              treeDataHandle(item.children);
          }
          item.key = item.nodeId;
          item.title = item.nodeName;
          return item;
      })
    }
    // 树勾选
    const checkHandle = (checkedKeys, { checked, checkedNodes, node, event, halfCheckedKeys }) => {
        setCheckedKeys(checkedKeys)
    }
    // 树点击
    const selectHandle = (selectedKeys, { selected, selectedNodes, node, event }) => {
        setSelectedKeys([node.key]);
    }

    return (
        <div className={styles.container}>
            <Tree
                showLine={true}
                showIcon={true}
                treeData={treeDataHandle(authorityTree)}
                checkedKeys={checkedKeys}
                selectedKeys={selectedKeys}
                onCheck={checkHandle}
                onSelect={selectHandle}
            />
        </div>
    )
}

export default connect(({ userView, loading }) => ({
    ...userView,
    loading
}))(UserAuthorityCat);
