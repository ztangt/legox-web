import { Transfer, Tree } from 'antd';
import React, { useState,useEffect } from 'react';
import { connect } from 'dva';
import styles from './index.less'
// Customize Table Transfer
const isChecked = (selectedKeys, eventKey) => selectedKeys.includes(eventKey);
const generateTree = (treeNodes = [], checkedKeys = []) =>
  treeNodes.map(({ children, ...props }) => ({
    ...props,
    disabled: checkedKeys.includes(props.key),
    children: generateTree(children, checkedKeys),
  }));
const TreeTransfer = ({ dataSource, targetKeys,dispatch,callback, ...restProps }) => {
  const transferDataSource = [];
  function flatten(list = []) {
    list.forEach((item) => {
      transferDataSource.push(item);
      flatten(item.children);
    });
  }
  flatten(dataSource);

  return (
    <Transfer
      {...restProps}
      titles={['全部节点名称及排序','编排后节点名称及排序']}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      className="tree-transfer"
      render={(item) => item.title}
      showSelectAll={false}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          return (
            <Tree
              blockNode
              checkable
              checkStrictly
              defaultExpandAll
              checkedKeys={checkedKeys}
              treeData={generateTree(dataSource, targetKeys)}
              onCheck={(_, { node: { key } }) => {
                onItemSelect(key, !isChecked(checkedKeys, key));
              }}
              onSelect={(_, { node: { key } }) => {
                onItemSelect(key, !isChecked(checkedKeys, key));
              }}
            />
          );
        }
      }}
    </Transfer>
  );
};
let targetArr = []
const TransferComponent = ({dispatch,treeData,callback,rightTargetKeys}) => {
  const [targetKeys, setTargetKeys] = useState([]);
  // 右侧回显
  const getRightTargetList = ()=>{
    setTargetKeys(rightTargetKeys)
    targetArr = rightTargetKeys
    callback(rightTargetKeys)
  }
  useEffect(()=>{
    getRightTargetList()
  },[])

  const onChange = (keys,direction,moveKeys) => {
    if(direction=='right'){
      targetArr.push(...moveKeys)
    }
    if(direction == 'left'){
      if(keys.length ==0 ){
        targetArr = []
      }else{
        console.log("moveKeys",moveKeys)
        const now = targetArr.map(item=>{
          if(!moveKeys.includes(item)){
            return item
          }
        }).filter(cur=>cur!=undefined)
        targetArr = now
      }
    }
    setTargetKeys(targetArr)
    callback(targetArr)
    // setTargetKeys(keys)
    // callback(keys)
  };

  return (
    <div className={styles.transfer}>
        <TreeTransfer dispatch={dispatch} callback={callback} dataSource={treeData} targetKeys={targetKeys} onChange={onChange} />
    </div>
  )
};
export default connect(({subProcessArrangeSpace})=>({subProcessArrangeSpace}))(TransferComponent);