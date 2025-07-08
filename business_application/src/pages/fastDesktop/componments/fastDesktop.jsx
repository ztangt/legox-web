/**
 * @author zhangww
 * @description 快捷桌面
 */
import { connect } from 'dva';
import { history } from 'umi';
import _ from 'lodash';
import axios from 'axios';
import styles from './fastDesktop.less';
import IconFont from '../../../Icon_manage';
import { Modal, message, Button } from 'antd';
import pathMatch from 'path-match';
import { getFlatArr } from '../../../util/util';
import { useState, useEffect, useCallback } from 'react';
import {
  PlusOutlined,
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
  BoxPlotTwoTone,
  PlusSquareTwoTone,
  DownSquareTwoTone,
  UpSquareTwoTone,
} from '@ant-design/icons';
import SetModal from '../../../componments/SetModal';
import AddModal from './addModal';
import IconModal from './iconModal';

const { confirm } = Modal;
const singleCount = 20;

function FastDesktop({ dispatch, fastDesktop, columnApp }) {
  const { currentIndex, generalJson } = fastDesktop;
  const { selectList, selectKeys } = columnApp;

  const [showCut, setShowCut] = useState(false);

  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [prevJson, setPrevJson] = useState(null);
  const [cacheKeys, setCacheKeys] = useState(null);
  const [cacheList, setCacheList] = useState(null);
  const id = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')).id
    : '';
  const iconKeyValArr = JSON.parse(localStorage.getItem('iconKeyValArr'));
  const allmenusIdArr = JSON.parse(localStorage.getItem('allmenusIdArr'));
  const desktopType = localStorage.getItem(`desktopType${id}`) || 0;

  const { width, height } = { width: 1600, height: 900 };
  const screenScale = () => {
    let ww = window.innerWidth / width;
    let wh = window.innerHeight / height;
    return ww < wh ? ww : wh;
  };
  const getScale = screenScale();
  const [scale, setScale] = useState(getScale);

  const setScreenScale = useCallback(() => {
    setScale(screenScale());
  }, []);

  useEffect(() => {
    dispatch({
      type: 'fastDesktop/getUserMenus',
      payload: {
        sysPlatType: 'PLATFORM_BUSS',
      },
      callback: (allAppList) => {
        let tmp = allAppList.filter((i) => !i.hideInMenu);
        let moreArr = tmp.filter((i) => !i.children?.length && i.path);

        tmp = allAppList.filter((i) => i.children?.length);

        tmp.forEach((element) => {
          element['children'] = getFlatArr(element.children).filter(
            (i) => i.path,
          );
        });
        tmp.push({
          menuId: 'more',
          menuName: '更多',
          children: moreArr,
        });
        dispatch({
          type: 'fastDesktop/updateStates',
          payload: {
            allAppList: tmp,
          },
        });

        const id = localStorage.getItem('userInfo')
          ? JSON.parse(localStorage.getItem('userInfo')).id
          : '';
        const desktopType = localStorage.getItem(`desktopType${id}`) || 0;
        const tableConfig = JSON.parse(
          localStorage.getItem('tableConfig'),
        );
        if (
          !tableConfig ||
          (desktopType == 1 &&
            tableConfig &&
            tableConfig.TABLE_FAST.substr(0, 1) == 1)
        ) {
          const type = '2';
          const ptType = '2';
          const fileName = 'deskTable';
          const jsonName = 'tablelayout.json';
          const minioUrl = localStorage.getItem('minioUrl');
          const tenantId = localStorage.getItem('tenantId');
          const identityId = localStorage.getItem('identityId');
          // 完整路径：minio地址/租户ID/deskTable/岗人ID/平台类型如1/类型如1/tablelayout.json
          let url = `${minioUrl}/${tenantId}/${fileName}/${identityId}/${ptType}/${type}/${jsonName}`;
          axios
            .get(url, {
              // 防止走缓存 带个时间戳
              params: {
                t: Date.parse(new Date()) / 1000,
              },
            })
            .then(function (res) {
              if (res.status == 200) {
                dispatch({
                  type: 'fastDesktop/updateStates',
                  payload: {
                    generalJson: res.data,
                  },
                });
              }
            })
            .catch(function (error) {
              // here ~~   no matter
            });
        } else {
          historyPush('/');
        }
      },
    });
  }, []);

  useEffect(() => {
    for (let i = 0; i < generalJson.length; i++) {
      const element = generalJson[i];
      if (element.active) {
        dispatch({
          type: 'fastDesktop/updateStates',
          payload: {
            currentIndex: i,
          },
        });
        return;
      }
    }
  }, []);

  


  // Math.floor(Math.random()*5)
  const colorArr = [
    'rgba(255,185,0,0.1)', // 黄
    'rgba(0,186,238,0.1)', // 天蓝
    'rgba(181,123,254,0.1)', // 紫
    'rgba(0,150,255,0.1)', // 蓝
    'rgba(255,134,143,0.1)', // 红
  ];

  function generateRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  useEffect(() => {
    window.addEventListener('resize', setScreenScale);
    return () => {
      window.removeEventListener('resize', setScreenScale);
    };
  }, []);

  function setActive(i) {
    const tmp = generalJson;
    tmp.forEach((element, index) => {
      if (index === i) {
        element.active = true;
      } else {
        element.active = false;
      }
    });
    dispatch({
      type: 'fastDesktop/updateStates',
      payload: {
        generalJson: tmp,
        currentIndex: i,
      },
    });
    setCurrentPage(0)
    updateStates(tmp);
  }

  function onDelClick() {
    confirm({
      title: '',
      content: '删除当前页会导致定制的功能一并删除，是否确定删除？',
      onOk() {
        const tmp = generalJson;
        if (currentIndex > 0) {
          tmp.splice(currentIndex, 1);
          dispatch({
            type: 'fastDesktop/updateStates',
            payload: {
              generalJson: tmp,
              currentIndex: 0,
            },
          });
        } else {
          tmp[currentIndex].currentMenu = [];
          tmp[currentIndex].currentMenuKeys = [];
          // tmp[currentIndex].allMenus = _.cloneDeep(allAppList);
          dispatch({
            type: 'fastDesktop/updateStates',
            payload: {
              generalJson: tmp,
            },
          });
        }
        // if (tmp.length > 1) {
        //   tmp[tmp.length - 1].active = true;
        // } else {
          tmp[0].active = true;
        // }
        updateStates(tmp);
      },
      onCancel() {},
    });
  }

  function onShowSetModal() {
    dispatch({
      type: 'fastDesktop/updateStates',
      payload: {
        isSetModalVisible: true,
      },
    });
  }

  function onShowAddModal() {
    console.log(generalJson);
    if (generalJson.length > 10) {
      message.warning('添加页不得超过10页！')
      return
    }
    dispatch({
      type: 'fastDesktop/updateStates',
      payload: {
        isAddModalVisible: true,
      },
    });
  }

  function onShowBottomModal() {
    dispatch({
      type: 'columnApp/getUserMenus',
      payload: {
        sysPlatType: 'FRONT',
      },
    });

    dispatch({
      type: 'columnApp/updateStates',
      payload: {
        isSetModalVisible: true,
      },
    });
  }

  function linkToAny(url) {
    if (!url) {
      return;
    }
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
      console.log(bizSolId, listId, formId, otherBizSolId);
      if (bizSolId == 0) {
        historyPush({
          pathname: '/dynamicPage',
          query: {
            bizSolId,
            listId,
            formId,
            otherBizSolId,
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
              arr = arr.filter((item) => item);
              historyPush({
                pathname: `/dynamicPage`,
                query: {
                  bizSolId,
                  microAppName: arr[0],
                  url: arr[1],
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
                },
              });
            }
          },
        });
      }
    } else {
      historyPush({pathname: url});
    }
  }

  Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
      this.splice(index, 1);
    }
  };

  function onBottomOkClick() {
    setCount(0);
    localStorage.setItem(`useKeys${id}`, JSON.stringify(selectKeys));
    localStorage.setItem(`useList${id}`, JSON.stringify(selectList));
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
      setCacheKeys(selectKeys);
      setCacheList(selectList);
    }
    setCount(count + 1);
    const arr = _.clone(selectKeys);
    const list = _.clone(selectList);
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

  function updateStates(tableStyleJson) {
    // if (tableStyleJson[currentIndex].currentMenu.length < singleCount) {
    //   setCurrentPage(currentPage-1)
    // }
    // TODO tableType
    dispatch({
      type: 'fastDesktop/updateTableLayout',
      payload: {
        tableType: '2',
        styleType: '2',
        tableStyleJson: JSON.stringify(tableStyleJson),
      },
    });
  }

  function onTopSingClick(item) {
    if (!count) {
      setPrevJson(generalJson);
    }
    setCount(count + 1);
    const tmp = _.cloneDeep(generalJson);

    if (tmp[currentIndex]['currentMenuKeys'].includes(item.menuId)) {
      tmp[currentIndex]['currentMenuKeys'].remove(item.menuId);
      for (let i = 0; i < tmp[currentIndex]['currentMenu'].length; i++) {
        if (tmp[currentIndex]['currentMenu'][i].menuId === item.menuId) {
          tmp[currentIndex]['currentMenu'].splice(i, 1);
        }
      }
    } else {
      tmp[currentIndex]['currentMenuKeys'].push(item.menuId);
      tmp[currentIndex]['currentMenu'].push(item);
    }

    dispatch({
      type: 'fastDesktop/updateStates',
      payload: {
        generalJson: tmp,
      },
    });
  }

  function onTopHideClick() {
    if (count) {
      setCount(0);
      dispatch({
        type: 'fastDesktop/updateStates',
        payload: {
          generalJson: prevJson,
        },
      });
    }
    dispatch({
      type: 'fastDesktop/updateStates',
      payload: {
        isSetModalVisible: false,
      },
    });
  }

  function onTopOkClick() {
    dispatch({
      type: 'fastDesktop/updateStates',
      payload: {
        isSetModalVisible: false,
      },
    });
    updateStates(generalJson);
    setCount(0);
  }

  function setPage(type) {
    if (type === 'left' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
    if (
      type === 'right' &&
      currentPage <
        Math.floor(
          generalJson[currentIndex]?.currentMenu.length / singleCount,
        ) &&
      generalJson[currentIndex]?.currentMenu.length >= singleCount
    ) {
      setCurrentPage(currentPage + 1);
    }
  }

  function isShowAddBtn() {
    if (
      generalJson[currentIndex]?.currentMenu.length <
      (currentPage + 1) * singleCount
    ) {
      return true;
    } else {
      return false;
    }
  }

  const renderApp = (list) => {
    console.log('-----list', list);
    // list.length  currentPage 0
    // 1: 0, 19
    // 2: 20, 39
    // 3, 40, 59
    return list
      .filter((i) => allmenusIdArr.includes(i.menuId))
      .slice(currentPage * singleCount, (currentPage + 1) * singleCount)
      .map((item, index) => {
        return (
          <li
            key={index}
            onClick={() => linkToAny(item.path)}
            className={
              styles[`bg_color_${item.menuId?.replace(/[^\d]/g, '') % 5}`]
            }
          >
            <IconFont
              type={`icon-${iconKeyValArr[item.menuId]}`}
              className={
                styles[`color_${item.menuId?.replace(/[^\d]/g, '') % 5}`]
              }
            />
            <p>{item.menuName}</p>
          </li>
        );
      });
  };

  return (
    <div
      className={styles.fastDesktop}
      id="fastDesktop_id"
      style={{
        transform: `scale(${scale}) translate(-50%, -50%)`,
        WebkitTransform: `scale(${scale}) translate(-50%, -50%)`,
        width: 1228,
        height: 700,
      }}
    >
      <div className={styles.content}>
        <ul>
          {/* 0 < 应用数 < 20  一页
         20 <= 应用数 < 40  二页
         40 <= 应用数 < 60  三页 */}
          {/* <li className={styles.add_wrapper}>
            <PlusOutlined twoToneColor="#3F79FF" onClick={onShowSetModal} style={{fontSize: 56}}/>
          </li> */}
          {renderApp(generalJson[currentIndex]?.currentMenu)}
          {/* {generalJson[currentIndex]?.currentMenu.map((item, index)=> {
            return (
              <li key={index} onClick={()=>linkToAny(item.path)} style={{background: colorArr[Math.floor(Math.random()*5)]}}>
                {item.menuIcon ? <IconFont type={`icon-${item.menuIcon}`}/> : <IconFont type='icon-a-uniE623'/> }
                <p>{item.menuName}</p>
              </li>
            )
          })} */}
          {isShowAddBtn() ? (
            <li className={styles.add_wrapper}>
              <PlusOutlined
                twoToneColor="#3F79FF"
                onClick={onShowSetModal}
                style={{ fontSize: 56 }}
              />
            </li>
          ) : null}
        </ul>
      </div>
      {/* <div className={styles.upButton}>
        <UpSquareTwoTone
          onClick={()=>setShowCut(true)}
          style={{display: showCut ? 'none' : 'block',fontSize: 30}}
        />
      </div> */}
      <div className={styles.bottomLine}></div>
      <div className={styles.leftLine}>
        <LeftOutlined
          style={{ fontSize: 30 }}
          onClick={() => setPage('left')}
        />
      </div>
      <div className={styles.rightLine}>
        <RightOutlined
          style={{ fontSize: 30 }}
          onClick={() => setPage('right')}
        />
      </div>
      {/* <div className={styles.bottomLine}></div>
      <div className={styles.bottomLine}></div> */}
      <div
        className={styles.bottomControl}
        style={{ bottom: showCut ? 120 : 0 }}
      >
        <ul>
          {generalJson?.map((item, index) => {
            return (
              <li key={index} onClick={() => setActive(index)}>
                {/* <IconFont type={`icon-${item.pageIcon}`} className={item.active ? styles.active : ''}/> */}
                <Button className={item.active ? styles.active : ''}>
                  {item.pageName}
                </Button>
                {/* <p className={item.active ? styles.showTitle : ''}>{item.pageName}</p> */}
              </li>
            );
          })}
          <li>
            <Button onClick={onShowAddModal}>添加页</Button>
            {/* <PlusOutlined onClick={onShowAddModal} style={{fontSize: 12}}/> */}
          </li>
          <li>
            <Button onClick={onDelClick}>删除页</Button>
            {/* <CloseOutlined onClick={onDelClick} style={{fontSize: 12}}/> */}
          </li>
        </ul>
      </div>
      {/* <div className={styles.bottomShortcut} style={{display: showCut? 'block':'none'}}>
        <div className={styles.title_name}>
          <div>
            <BoxPlotTwoTone style={{marginRight: 5, fontSize: 20}}/>
            <span style={{fontSize: 16}}>常用功能</span>
          </div>
          <div>
            <PlusSquareTwoTone style={{marginRight: 5, fontSize: 20}} onClick={onShowBottomModal}/>
            <DownSquareTwoTone style={{fontSize: 20}} onClick={()=>setShowCut(false)}/>
          </div>
        </div>
        <div className={styles.app}>
          <ul >
            {
              columnApp.selectList.map((item,index)=>
                <li  key={index} onClick={()=>{linkToAny(item.path)}}>
                  {item.menuIcon ? <IconFont type={`icon-${item.menuIcon}`}/> : <IconFont type='icon-a-uniE693'/> }
                  <p style={{color:'#666666'}} title={item.menuName}>{item.menuName}</p>
                </li>
              )
            }
          </ul>
        </div>
      </div> */}
      <SetModal
        title="自定义常用菜单"
        containerId="root-master"
        isFast={true}
        isSetModalVisible={fastDesktop.isSetModalVisible}
        allAppList={fastDesktop.allAppList}
        currentIndex={currentIndex}
        generalJson={generalJson}
        desktopType={desktopType}
        onOkModal={onTopOkClick}
        onHideModal={onTopHideClick}
        onClickSingleApp={onTopSingClick}
      />
      <SetModal
        title="常用功能"
        containerId="root-master"
        isFif={true}
        isSetModalVisible={columnApp.isSetModalVisible}
        allAppList={columnApp.allAppList}
        selectKeys={selectKeys}
        selectList={selectList}
        desktopType={desktopType}
        onOkModal={onBottomOkClick}
        onHideModal={onBottomHideClick}
        onClickSingleApp={onBottomSingClick}
      />
      <AddModal />
      <IconModal />
    </div>
  );
}
export default connect(({ fastDesktop, columnApp }) => ({
  fastDesktop,
  columnApp,
}))(FastDesktop);
