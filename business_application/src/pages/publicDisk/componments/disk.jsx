/*
 * @Author: your name
 * @Date: 2022-04-28 17:41:06
 * @LastEditTime: 2022-06-30 14:19:55
 * @LastEditors: gaohy gaohy@suirui.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \WPX\business_application\src\pages\publicDisk\componments\disk.js
 */
import { connect } from 'dva';
import { useEffect, useState, useMemo } from 'react';
import { Tree } from 'antd';
import _ from 'lodash';
import { updateTreeData } from '../../../componments/public/treeChange';
import FileIconSvg from '../../../../public/assets/filePng.png'
function Disk({ dispatch, publicDisk }) {
  const { publicTreeData, selectedKeysValue, selectTreeUrl } = publicDisk;

  useEffect(() => {
    if (selectedKeysValue == undefined) {
      dispatch({
        type: 'publicDisk/updateStates',
        payload: {
          disabledAllButton: true,
        },
      });
    } else {
      dispatch({
        type: 'publicDisk/updateStates',
        payload: {
          disabledAllButton: false,
        },
      });
    }
  }, [selectedKeysValue]);

  const onSelect = (selectedKeysValue, info) => {
    const {node} = info 
    if (selectedKeysValue.length > 0) {
      let newArr = [];
      (node.url || []).forEach((item) => {
        newArr.push(item.title);
      });
      node&&node.url&&node.url.length>0&&node.url.forEach(item=>{
        if(node.key == item.key){
          item.title = node.title;
        }
      })
      dispatch({
        type: 'publicDisk/updateStates',
        payload: {
          typeName: newArr.join('/'),
          selectedKeysValue: selectedKeysValue[0],
          treeId: selectedKeysValue[0],
          selectTreeUrl: node.url,
          start: 1,
          rowSelectionKey:[]
        },
      });
    }
  };

  // const onExpand = (expandedKeys, { expanded: bool, node }) => {
  //   dispatch({
  //     type: 'publicDisk/getPagingList_CommonDisk_Tree',
  //     payload: {
  //       start: 1,
  //       limit: 200,
  //       id: node.key,
  //       name: '',
  //       type: 'T',
  //     },
  //   });
  // };

  // const treeData = useMemo(() => {
  //   console.log('publicTreeData', publicTreeData);
  //   return publicTreeData;
  // }, [publicTreeData]);

  const onLoadData = ({ key, url, children }) => {
    return new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }
      dispatch({
        type: 'publicDisk/getPagingList_CommonDisk_Tree',
        payload: {
          start: 1,
          limit: 200,
          id: key,
          name: '',
          type: 'T',
        },
        callback: (data) => {
          //为children加上路径，为了右侧的面包屑显示
          console.log('url', url);
          data.map((item) => {
            item.icon = <img src={FileIconSvg}/>
            let curUrl = [{ title: item.title, key: item.key}];
            if(url){
              item.url = url.concat(curUrl);
            }
            return item
          });
          dispatch({
            type: 'publicDisk/updateStates',
            payload: {
              publicTreeData: updateTreeData(publicTreeData, key, data),
              resetNameList: url?[url[0]]:[],
            },
          });
        },
      });
      resolve();
    });
  };
  return (
    <>
      <Tree
        selectedKeys={[selectedKeysValue]}
        showLine={true}
        showIcon={true}
        defaultSelectedKeys={[0]}
        // onExpand={onExpand} 
        treeData={_.cloneDeep(publicTreeData)}
        onSelect={onSelect}
        loadData={onLoadData}
        // key={treeKeys}
      />
    </>
  );
}

export default connect(({ publicDisk }) => ({
  publicDisk,
}))(Disk);
