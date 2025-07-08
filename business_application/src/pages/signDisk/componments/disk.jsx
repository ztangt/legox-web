import { connect } from 'dva';
import { Tree } from 'antd';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import FilePng from '../../../../public/assets/filePng.png'
import { updateTreeData } from '../../../componments/public/treeChange';

function Disk({ dispatch, signDisk }) {
  const {
    myFileLimit,
    myFileStart,
    publicStart,
    publicLimit,
    publicSearch,
    search,
    ItreeData,
    selectedKeysValue,
    selectTreeUrl,
    List
  } = signDisk;
  useEffect(() => {
    if (selectedKeysValue == undefined) {
      dispatch({
        type: 'signDisk/updateStates',
        payload: {
          disabledAllButton: true,
        },
      });
    } else {
      dispatch({
        type: 'signDisk/updateStates',
        payload: {
          disabledAllButton: false,
        },
      });
    }
  }, [selectedKeysValue]);
  const onLoadData = ({ key, url, children, type }) =>
    new Promise((resolve) => {
      if (children&&type=='person') {
        resolve();
        return;
      }
      // 两个树表需要关键字段做区分，公共云盘为public，个人云盘为person
      switch (type) {
        case 'public':
          dispatch({
            type: 'signDisk/getAuthorityList_CommonDisk_Tree',
            payload: {
              start: 1,
              limit: 200,
              id: key,
              name: '',
              type: 'T',
            },
            callback: (data) => {
              data.map((item) => {
                let curUrl = [{ title: item.title, key: item.key }];
                item.url = url.concat(curUrl);
                item.type = 'public';
                item.icon = <img src={FilePng}/>
              });
              dispatch({
                type: 'signDisk/updateStates',
                payload: {
                  ItreeData: updateTreeData(ItreeData, key, data),
                },
              });
            },
          });
          break;

        case 'person':
          dispatch({
            type: 'signDisk/getPagingOrBinList_SignDisk_Tree',
            payload: {
              start: 1,
              limit: 200,
              id: key,
              name: '',
              delete: 'Y',
              type: 'T',
            },
            callback: (data) => {
              data.map((item) => {
                let curUrl = [{ title: item.title, key: item.key }];
                item.url = url.concat(curUrl);
                item.type = 'person';
                item.icon= <img src={FilePng}/>
              });
              dispatch({
                type: 'signDisk/updateStates',
                payload: {
                  ItreeData: updateTreeData(ItreeData, key, data),
                },
              });
            },
          });
          break;
      }
      resolve();
    });
  const onSelect = (selectedKeysValue, info) => {
    const { node } = info
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
        type: 'signDisk/updateStates',
        payload: {
          typeName: newArr.join('/'),
          selectedKeysValue: selectedKeysValue[0],
          treeId: selectedKeysValue[0],
          info: node.type,
          selectTreeUrl: node.url,
          myFileStart: 1,
        },
      });
    }
  };

  const onExpand = (expandedKeys, { expanded: bool, node }) => {
    // console.log(22222222222222,node,"node",expandedKeys,"ItreeData",ItreeData)
    const url = node.url.map(item=>item.title)
    if (node.title === '公共文件') {
      dispatch({
        type: 'signDisk/getAuthorityList_CommonDisk_Tree',
        payload: {
          start: publicStart,
          limit: publicLimit,
          id: 0,
          name: publicSearch,
          type: 'T',
        },
      });
    }
    if (url.includes('我的文件')) {
      dispatch({
        type: 'signDisk/getPagingOrBinList_SignDisk_Tree',
        payload: {
          start: myFileStart,
          limit: 200,
          id: node.key,
          name: search,
          delete: 'Y',
          type: 'T',
    },
        callback(data){
          const data1 =  data.map((item) => {
            let curUrl = [{ title: item.title, key: item.key }];
            item.url = node.url.concat(curUrl);
            item.type = 'person';
            item.icon=<img src={FilePng}/>;
            return item
          });
          dispatch({
            type: 'signDisk/updateStates',
            payload: {
              ItreeData: updateTreeData(ItreeData, node.key, data1),
            },
          });
          // dispatch({
          //   type: 'signDisk/getPagingOrBinList_SignDisk_List',
          //   payload: {
          //     start: myFileStart,
          //     limit: myFileLimit,
          //     id: node.key,
          //     name: search,
          //     delete: 'Y',
          //     type: 'L',
          //   },
          //   callback(aData){
          //     dispatch({
          //       type: 'signDisk/updateStates',
          //       payload: {
          //         myList: aData
          //       }
          //     })
          //   }
          // });

        }
      });
    }
  };

  return (
    <>
      <Tree
        selectedKeys={[selectedKeysValue]}
        defaultSelectedKeys={[1]}
        defaultExpandedKeys={[2,3,4]}
        loadData={onLoadData}
        treeData={_.cloneDeep(ItreeData)}
        onSelect={onSelect}
        onExpand={onExpand}
        showLine={{
          showLeafIcon: true
        }}
        showIcon={true}
        // showLine={{ showLeafIcon: false }}
      />
    </>
  );
}

export default connect(({ signDisk }) => ({
  signDisk,
}))(Disk);
