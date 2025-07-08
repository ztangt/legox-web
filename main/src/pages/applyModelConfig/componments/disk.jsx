import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { Tree } from 'antd';
import { parse } from 'query-string';
function Disk({query,dispatch,setParentState,parentState}) {
  const {treeId} = parentState
  const [treeData,setTreeData] = useState([{
    title: '公共文件',
    key: '0',
    isLeaf: false,
    url:[{key:'0',title:"公共文件"}]
  }]);
  useEffect(() => {
    //初期为公共文件展开
    dispatch({
      type: 'publicDisk/getPagingList_CommonDisk_Tree',
      payload: {
        start: 1,
        limit: 10,
        id: '0',
        name: '',
        type: 'T'
      }
    });
  }, [])
  function updateTreeData(list, key, children) {
    return list.map((item) => {
      if (item.key === key) {
        return { ...item, children };
      }

      if (item.children) {
        return { ...item, children: updateTreeData(item.children, key, children) };
      }

      return item;
    });
  };

  const onLoadData = ({ key,url, children }) =>
    new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }

      dispatch({
        type: 'applyModelConfig/getPagingList_CommonDisk_Tree',
        payload: {
          start: 1,
          limit: 10,
          id: key,
          name: '',
          type: 'T'
        },
        callback: (data) => {
          setTreeData((origin) =>{
            //为children加上路径，为了右侧的面包屑显示
            data.map((item)=>{
              let curUrl = [{title:item.title,key:item.key}];
              item.url = url.concat(curUrl);
            })
            return updateTreeData(origin, key, data)
          }
          );
        }
      });
      resolve();
    });

  const onSelect = (selectedKeysValue,{node}) => {
    setParentState({
      treeId: selectedKeysValue[0],
      selectTreeUrl:node.url
    })
  };
  console.log('treeData=',treeData);
  return (
    <>
      <Tree
        selectedKeys={treeId?[treeId]:['0']}
        defaultCheckedKeys={['0']}
        defaultExpandedKeys={['0']}
        loadData={onLoadData}
        treeData={treeData}
        onSelect={onSelect}
      />
    </>
  )
};

export default connect(({
  applyModelConfig
}) => ({
  applyModelConfig
}))(Disk);
