/**
 * @author zhangww
 * @description 栏目-常用应用
 */

import React from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import styles from './index.less';
import pathMatch from 'path-match';
import { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { getFlatArr } from '../../../../util/util';
import SetModal from '../../../../componments/SetModal';
import IconFont from '../../../../Icon_manage';
import {Tooltip} from 'antd';

function Index({ dispatch, columnApp, user }) {
  const { selectList, allAppList } = columnApp;
  const { menus } = user
  const [count, setCount] = useState(0);
  const [cacheKeys, setCacheKeys] = useState(null);
  const [cacheList, setCacheList] = useState(null);
  const id = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')).id
    : '';
  console.log('allAppList', allAppList);
  const allmenusIdArr = JSON.parse(localStorage.getItem('allmenusIdArr'));

  useEffect(() => {
    let tmp = _.cloneDeep(menus)?.filter(
      (i) => !i.hideInMenu,
    );
    let moreArr = tmp?.filter((i) => !i.children?.length && i.path);

    tmp =
      _.cloneDeep(menus)?.filter(
        (i) => i.children?.length,
      ) || [];

    tmp.forEach((element) => {
      element['children'] = getFlatArr(element.children)?.filter((i) => i.path);
    });
    tmp.push({
      menuId: 'more',
      menuName: '更多',
      children: moreArr,
    });

    dispatch({
      type: 'columnApp/updateStates',
      payload: {
        allAppList: tmp,
      },
    });
  }, [menus]);

  function getDataRuleCode(item, callback) {
    dispatch({
      type: 'user/getIdentityDatarule',
      payload: {
        menuId: item.menuId,
      },
      callback: (maxDataruleCode) => {
        callback && callback(maxDataruleCode);
      },
    });
  }


  function linkToAny(item) {
    const { path } = item;
    let url = path;
    if (!url) {
      return;
    }
    getDataRuleCode(item, (maxDataruleCode) => {
      if (url.includes('dynamicPage')) {
        let bizSolId = 0,
          listId = 0,
          formId = 0,
          otherBizSolId = '';
        const index = url.indexOf('?otherBizSolId');
        if (index > -1) {
          otherBizSolId = url.slice(index + 15);
          url = url.slice(0, index);
        }
        const arr = url.split('/');
        bizSolId = arr[2];
        listId = arr[3] || 0;
        formId = arr[4] || 0;
        console.log(arr, bizSolId, listId, formId, otherBizSolId);
        if (bizSolId == 0) {
          historyPush({
            pathname: '/dynamicPage',
            query: {
              bizSolId,
              listId,
              formId,
              otherBizSolId,
              maxDataruleCode,
              menuId: item.menuId,
            },
          });
        } else {
          dispatch({
            type: 'user/getUrlByBSId',
            payload: {
              bizSolId,
            },
            callback: (url) => {
              if (url) {
                let arr = url.split('/');
                arr = arr?.filter((item) => item);
                historyPush({
                  pathname: `/dynamicPage`,
                  query: {
                    bizSolId,
                    microAppName: arr[0],
                    url: arr[1],
                    maxDataruleCode,
                    menuId: item.menuId,
                  },
                });
              } else {
                historyPush({
                  pathname: '/dynamicPage',
                  query: {
                    bizSolId,
                    listId,
                    formId,
                    otherBizSolId,
                    maxDataruleCode,
                    menuId: item.menuId,
                  },
                });
              }
            },
          });
        }
      } else {
        historyPush({
          pathname: url, query: {
            maxDataruleCode,
            menuId: item.menuId,
          },
        });
      }

    })

  }

  function onAddApp() {
    dispatch({
      type: 'columnApp/updateStates',
      payload: {
        isSetModalVisible: true,
      },
    });
  }

  Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
      this.splice(index, 1);
    }
  };

  function onBottomOkClick() {
    setCount(0);
    localStorage.setItem(`useKeys${id}`, JSON.stringify(columnApp.selectKeys));
    localStorage.setItem(`useList${id}`, JSON.stringify(columnApp.selectList));
    dispatch({
      type: 'columnApp/updateStates',
      payload: {
        isSetModalVisible: false,
      },
    });
  }

  function onBottomHideClick() {
    if (count) {
      setCount(0);
      dispatch({
        type: 'columnApp/updateStates',
        payload: {
          selectKeys: cacheKeys,
          selectList: cacheList,
        },
      });
    }
    dispatch({
      type: 'columnApp/updateStates',
      payload: {
        isSetModalVisible: false,
      },
    });
  }

  function onBottomSingClick(item) {
    if (!count) {
      setCacheKeys(columnApp.selectKeys);
      setCacheList(columnApp.selectList);
    }
    setCount(count + 1);
    const arr = _.clone(columnApp.selectKeys);
    const list = _.clone(columnApp.selectList);
    if (arr.includes(item.menuId)) {
      arr.remove(item.menuId);
      for (let i = 0; i < list.length; i++) {
        if (list[i].menuId === item.menuId) {
          list.splice(i, 1);
        }
      }
    } else {
      arr.push(item.menuId);
      list.push(item);
    }
    dispatch({
      type: 'columnApp/updateStates',
      payload: {
        selectKeys: arr,
        selectList: list,
      },
    });
  }

  return (
    <div className={styles.app_list} id="app_list">
      <div className={styles.nav}>
        <b>常用应用</b>
        <PlusOutlined
          style={{ cursor: 'pointer' }}
          onClick={() => {
            onAddApp();
          }}
        />
      </div>
      <div className={styles.app_infos}>
      <ul>
        {selectList
          .filter((i) => allmenusIdArr.includes(i.menuId))
          .map((item, index) => (
            <li
              className={styles.app}
              key={index}
              onClick={() => {
                linkToAny(item);
              }}
            >
              {item.iconName ? (
                <IconFont type={`icon-${item.iconName}`} className={
                  styles[`color_${item.menuId?.replace(/[^\d]/g, '') % 5}`]
                } />
              ) : (
                <IconFont type="icon-default" className={
                  styles[`color_${item.menuId?.replace(/[^\d]/g, '') % 5}`]
                } />
              )}
              <br />
              <Tooltip 
                title={item.menuName} 
                color={'#ffffff'} 
                overlayInnerStyle={{color:'#333333'}}
                overlayClassName={styles.name_tip}
                placement={"bottom"}
                getPopupContainer={()=>{
                  return document.getElementById('app_list');
                }}
              >
                <i style={{ color: '#666666' }}>{item.menuName}</i>
              </Tooltip>
            </li>
          ))}
      </ul>
      </div>
      <SetModal
        title="常用功能"
        containerId="root-master"
        isFif={true}
        isSetModalVisible={columnApp.isSetModalVisible}
        allAppList={columnApp.allAppList}
        selectKeys={columnApp.selectKeys}
        selectList={columnApp.selectList}
        onOkModal={onBottomOkClick}
        onHideModal={onBottomHideClick}
        onClickSingleApp={onBottomSingClick}
      />
    </div>
  );
}

export default connect(({ columnApp, user }) => ({
  columnApp,
  user,
}))(Index);
