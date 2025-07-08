/**
 * @author gaoj
 * @description 个人云盘
 */

import { connect } from 'dva';
import styles from './signDisk.less';
import { Card, Breadcrumb } from 'antd';
import { useEffect } from 'react';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import Disk from './disk';
import MyFileList from './lists/myFileList';
import OtherShareList from './lists/otherShareList';
import MyShareList from './lists/myShareList';
import TrashList from './lists/trashList';
import PublicFileList from './lists/publicFileList';
import PersonList from './lists/personList';
import SearchInput from './header/search'

function signDisk({ dispatch, signDisk, location}) {
  const {
    selectedKeysValue,
    info,
    publicStart,
    publicLimit,
    publicSearch,
    myFileStart,
    myFileLimit,
    search,
    selectTreeUrl,
    publicList
  } = signDisk;
  useEffect(()=>{
    dispatch({
      type: 'getAuthorityList_CommonDisk_Tree',
      payload: {
        start: 1,
        limit: 200,
        id: 0,
        name: '',
        type: 'T',
      },
    });
    initDisk()
  },[])
  console.log(selectedKeysValue,"selectedKeysValue11",info,"selectTreeUrl",selectTreeUrl)
  useEffect(() => {
    if (info == 'public') {
      dispatch({
        type: 'signDisk/getAuthorityList_CommonDisk_List',
        payload: {
          start: publicStart,
          limit: publicLimit,
          id: selectedKeysValue,
          name: publicSearch,
          type: 'L',
        },
        callback: () => {},
      });
    } else if (info == 'person') {
      if (
        selectedKeysValue != 3 &&
        selectedKeysValue != 4 &&
        selectedKeysValue != 5
      ) {
        dispatch({
          type: 'signDisk/getPagingOrBinList_SignDisk_List',
          payload: {
            start: myFileStart,
            limit: myFileLimit,
            id: selectedKeysValue,
            name: search,
            delete: 'Y',
            type: 'L',
          },
        });
      }
    }
  }, [info, selectedKeysValue, publicStart, publicLimit, publicSearch]);
  const initDisk = ()=>{
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        resetName: false,
        dirName: '',
      },
    });
  }

  // 用来更新左侧树
  const changeSelectTreeId = (item, index) => {
    let newSelectTreeUrl = [];
    let newTypeName = [];
    selectTreeUrl.map((item, i) => {
      if (i <= index) {
        newSelectTreeUrl.push(item);
        newTypeName.push(item.title);
      }
    });
    dispatch({
      type: 'signDisk/updateStates',
      payload: {
        selectedKeysValue: item.key,
        selectTreeUrl: newSelectTreeUrl,
        typeName: newTypeName.join('/'),
      },
    });
  };
  const breadcrumbData = {
    selectTreeUrl,
    changeSelectTreeId,
  }
  return (
    <div className={styles.container} id="container_signDisk">
      <ReSizeLeftRight
        // height={'calc(100 % -46px)'}
        isShowRight={true}
        leftChildren={
          <div className={styles.left}>
            <Disk/>
          </div>
        }
        rightChildren={
          <>
            {selectedKeysValue == 2?<div className={styles.breadcrumb} style={{marginLeft:8,top:0}}>
              {/* <span>位置：</span> */}
              <Breadcrumb separator=">" style={{ display: 'inline-block' }}>
                {selectTreeUrl?.map((item, index) => {
                  return (
                    <Breadcrumb.Item 
                      onClick={changeSelectTreeId.bind(this, item, index)}
                      key={item.key}
                    >
                      {item.title}
                    </Breadcrumb.Item>
                  );
                })}
              </Breadcrumb>
            </div>:<div><SearchInput selectedKeysValue={selectedKeysValue} info={info}/></div>}
            <div className={styles.right}>
              {selectedKeysValue == 0 ? (
                <MyFileList location={location} {...breadcrumbData}></MyFileList>
              ) : selectedKeysValue == 3 ? (
                <OtherShareList {...breadcrumbData}></OtherShareList>
              ) : selectedKeysValue == 4 ? (
                <MyShareList {...breadcrumbData}></MyShareList>
              ) : selectedKeysValue == 5 ? (
                <TrashList {...breadcrumbData}></TrashList>
              ) : selectedKeysValue == 2 ? (
                <PersonList {...breadcrumbData}></PersonList>
              ) : selectedKeysValue != 0 &&
                selectedKeysValue != 2 &&
                selectedKeysValue != 3 &&
                selectedKeysValue != 4 &&
                selectedKeysValue != 5 &&
                info == 'person' ? (
                <MyFileList location={location} {...breadcrumbData}></MyFileList>
              ) : (
                <PublicFileList {...breadcrumbData}></PublicFileList>
              )}
            </div>
          </>
        }
      />
    </div>
  );
}

export default connect(({ signDisk }) => ({
  signDisk,
}))(signDisk);
