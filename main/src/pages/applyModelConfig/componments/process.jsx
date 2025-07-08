import { Tree } from 'antd';
import { useState } from 'react';

let findResult;
const findItem = (data, node, parentItem) => {
    data.find((item) => {
      if (item?.key === node?.key) {
        if (parentItem) {
          item.parent = parentItem;
          return (findResult = item);
        } else return (findResult = item);
      } else if (item?.children?.length) {
        return (findResult = findItem(item.children, node, item));
      }
    });
    return findResult;
  },
// dropPosition -1是移动到和他平级在他上面    1是移动到和他平级在他下面  0是移动到他下面作为他子集
 dealDrap = (dragNode, node, treeData, dropPosition) => {
  let dragNodeResult, nodeResult;
  findResult = '';
  dragNodeResult = findItem(treeData, dragNode);
  findResult = '';
  nodeResult = findItem(treeData, node);
  // 0是移动到他下面作为他子集
  if (dropPosition === 0) {
    if (dragNodeResult?.parent?.key === nodeResult?.key) return true;
    return false;
  }
  // -1是移动到和他平级在他上面    1是移动到和他平级在他下面
  if (dropPosition === 1 || dropPosition === -1) {
    // 都有父
    if (dragNodeResult?.parent && nodeResult?.parent) {
      // 父相等
      if (dragNodeResult?.parent?.key == nodeResult?.parent?.key) {
        return true;
      } else {
        return false;
      }
    }
    //有父无父
    if (dragNodeResult?.parent && !nodeResult?.parent) {
      return false;
    }
    // 无父有父
    if (!dragNodeResult?.parent && nodeResult?.parent) {
      return false;
    }
    if (!dragNodeResult?.parent && !nodeResult?.parent) {
      return true;
    }
  }
};

// canRandom true可以随意拖动  false只限平级拖动
const TreeTuo = ({ canRandom,treeList,changeTreeData }) => {
  const [treeData, setTreeData] = useState(treeList),
    onDrop = info => {
    // node         代表当前被drop 的对象
    // dragNode     代表当前需要drop 的对象
    //  代表drop后的dropPosition节点位置；不准确
    // dropToGap    代表移动到非最顶级组第一个位置
      const dropKey = info.node.key;
      const dragKey = info.dragNode.key;
      const dropPos = info.node.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
      // 实现平级拖动的限制
      if (!canRandom) {
        const dealData = JSON.parse(JSON.stringify(treeData));
        const result = dealDrap(info.dragNode, info.node, [...dealData], dropPosition);
        if (!result) return;
      }

      const loop = (data, key, callback) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].key === key) {
            return callback(data[i], i, data);
          }
          if (data[i].children) {
            loop(data[i].children, key, callback);
          }
        }
      };
      const data = [...treeData];

      // Find dragObject
      let dragObj;
      loop(data, dragKey, (item, index, arr) => {
        setTimeout(()=>{
          const arrParse = JSON.parse(JSON.stringify(arr))
          const aIndex = arrParse.findIndex(item=>item.key==dragKey)
          const nextItem =arr[aIndex+1];  
          const preItem = arr[aIndex-1];
          const dragData = arr[aIndex];
          changeTreeData(dragData,nextItem,preItem)
        },0)
        arr.splice(index, 1);
        dragObj = item;
      });

      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, item => {
          item.children = item.children || [];
          // where to insert 示例添加到头部，可以是随意位置
          item.children.unshift(dragObj);
        });
      } else if (
        (info.node.props.children || []).length > 0 && // Has children
        info.node.props.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, item => {
          item.children = item.children || [];
          // where to insert 示例添加到头部，可以是随意位置
          item.children.unshift(dragObj);
          // in previous version, we use item.children.push(dragObj) to insert the
          // item to the tail of the children
        });
      } else {
        let ar;
        let i;
        loop(data, dropKey, (item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
      }
      setTreeData(data);
      // console.log("data--tree",data,"dragObj",dragObj)
    };
  return <Tree defaultExpandAll={true} draggable={true} allowDrop={({dropNode, dropPosition})=>{
      console.log("dropNode",dropNode,dropPosition)
    //  if(dropNode.children&&dropNode.children.length>0&&dropNode.children[0].actType=="startEvent"){
    //   return false
    //  }
    //  if(dropNode.actType&&dropNode.actType=="endEvent"){
    //   return false
    //  }
    return true
  }} blockNode onDrop={onDrop}  treeData={treeData} showLine={true} showIcon={true}/>;
};

export default TreeTuo;

