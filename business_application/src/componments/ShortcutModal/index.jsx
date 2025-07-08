/**
 * @author yangmd
 * @description 最近使用 快捷方式
 */
import React, { useEffect, useState, } from 'react'
import { Menu } from 'antd';
import {Button} from '@/componments/TLAntd';
import { connect } from 'dva'
import { history } from 'umi'
import _ from "lodash";
import AddShortcut from './addShortcut';
import SetModal from '../SetModal';
import styles from './index.less'
import { CloseOutlined } from '@ant-design/icons';
import closeApp from '../../../public/assets/closeApp.svg'
import { ReactComponent as AddApp } from '../../../public/assets/addApp.svg'
import IconFont from '../../Icon_manage';
const Index = ({ dispatch, shortCut,setVisible }) => {
    const { shortcutList, list, selectKeys, selectList, menuList } = shortCut
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [count, setCount] = useState(0);
    const [cacheKeys, setCacheKeys] = useState(null);
    const [cacheList, setCacheList] = useState(null);
    const [result, setRes] = useState([])
    const [recentlyUse, setRecentlyUse] = useState(JSON.parse(window.localStorage.getItem('sysMenuName')))
    const registerId=localStorage.getItem('registerId')
    const iconKeyValArr = JSON.parse(localStorage.getItem('iconKeyValArr'));
    useEffect(() => {
        // getShortCutList();
        dispatch({
            type: 'shortCut/getMenuList',
            payload:{
              registerId,
            }
        })
        if (localStorage.getItem('addShortCut') && JSON.parse(localStorage.getItem('addShortCut')).length > 0) {
            dispatch({
                type: 'shortCut/updateStates',
                payload: {
                    list: JSON.parse(localStorage.getItem('addShortCut')),
                    shortcutList: JSON.parse(localStorage.getItem('addShortCut'))
                }
            })
        }
    }, [])
    // const getShortCutList = () => {
    //     dispatch({
    //         type: 'shortCut/getMenuTree',
    //         payload: {
    //             sysPlatType: 'FRONT',
    //             type: 'ALL'
    //         }
    //     })
    // }
    const onShowModal = () => {
        setVisible(false);
        setIsModalVisible(true)
        if(window.localStorage.getItem('addShortCut')){
            dispatch({
                type: 'shortCut/updateStates',
                payload: {
                    shortcutList: JSON.parse(window.localStorage.getItem('addShortCut'))
                }
            })
        }
    }
    const onModalClick = () => {
        setIsModalVisible(false)
    }
    const showModal = (val) => {
        setIsModalVisible(val)
    }
    //删除单条最近使用
    const delRecently = (e,menuCode) => {
      e.stopPropagation();
        recentlyUse.forEach((item, index) => {
            if (item.menuCode == menuCode) {
                recentlyUse.splice(index, 1)
                setRecentlyUse([...recentlyUse])
                window.localStorage.setItem('sysMenuName', JSON.stringify(recentlyUse))
            }

        })
    }
    //清空最近使用
    const delMenuAll = () => {
        window.localStorage.removeItem('sysMenuName')
        recentlyUse.splice(0, 3)
        setRecentlyUse([...recentlyUse])
    }
    //清空快捷方式
    const delShortCut = () => {
        let menuIdArr = []
        list.forEach((item, index) => {
            menuIdArr.push(item.menuId)
        })
        dispatch({
            type: 'shortCut/delMenuItem',
            payload: {
                menuIds: menuIdArr.join(',')
            }
        })
    }
    //清空单条快捷方式
    const delShortcutItem = (e,menuId) => {
      e.stopPropagation();
        dispatch({
            type: 'shortCut/delMenuItem',
            payload: {
                menuIds: menuId,
                registerId
            }
        })
    }
   const convertToObject=(x)=> {
        const decodedX = decodeURIComponent(x);
        const params = new URLSearchParams(decodedX);
        const obj = {};
        for (const [key, value] of params) {
          obj[key] = value;
        }
        return obj;
      }
    const setDynamicPageLink=(item)=> {
        getDataRuleCode(item, (maxDataruleCode) => {
          if (item.path.includes('?')) {
          let arr = item.path?.split('?');
          let obj = convertToObject(arr?.[1])
            historyPush({
              pathname: item.path,
              query: {
                ...obj,
                maxDataruleCode,
                menuId: item.menuId,
              },
            });
          } else {
            if(item.path.includes('/main')){
              let arr = item.path?.split('/');
              arr = arr.filter((item) => item);
               // 支撑
              historyPush({
                pathname: `/microPage`,
                query: {
                  microAppName: arr[0],
                  maxDataruleCode,
                  url: arr[1], //url都放在最后一个，方便子项目的参数解析
                  menuId:item.menuId
                },
                title: item.menuName,
                key: item.path,
              });
            }else{
              historyPush({
                pathname: item.path || item.redirect,
                query: {
                  maxDataruleCode,
                  menuId: item.menuId,
                },
              });
            }
          }
        });
      }
    const getDataRuleCode=(item, callback)=> {
        dispatch({
          type: 'user/getIdentityDatarule',
          payload: {
            menuId: item.menuId,
          },
          callback: (maxDataruleCode) => {
            var maxDataruleCodes = JSON.parse(
              localStorage.getItem('maxDataruleCodes') || '{}',
            );
            maxDataruleCodes[item.path] = maxDataruleCode;
            window.localStorage.setItem(
              'maxDataruleCodes',
              JSON.stringify(maxDataruleCodes),
            );
            window.localStorage.setItem(
              'maxDataruleCode',
              JSON.stringify(maxDataruleCode),
            );
            window.localStorage.setItem('maxDataruleCode', maxDataruleCode);
            callback && callback(maxDataruleCode);
          },
        });
      }
      const setDynamicPage=(bizSolId, listId, formId, otherBizSolId, item) =>{
        getDataRuleCode(item, (maxDataruleCode) => {
          localStorage.setItem('dataRuleCode', item.dataRuleCode);
          if(item.name){
            localStorage.setItem('currentMenuName', item.name);
          }else if(item.menuName){
            localStorage.setItem('currentMenuName', item.menuName);
          }
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
                  arr = arr.filter((item) => item);
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
        });
      }

    const setControlsPage=(item)=> {
        getDataRuleCode(item, (maxDataruleCode) => {
          let arr = item.path?.split('/');
          arr = arr.filter((item) => item);
          const menuId = item.menuId;
          localStorage.setItem('menuId', menuId);
          if (arr[0] == 'business_cma') {
            if (arr[2]) {
              // 气象
              historyPush({
                pathname: `/meteorological`,
                query: {
                  microAppName: arr[0],
                  url: arr[1],
                  pageId: arr[2], // 配置动态路由增加页面复用区分页面路由
                  maxDataruleCode,
                  menuId: item.menuId,
                },
              });
              return;
            }
            // 气象
            historyPush({
              pathname: `/meteorological`,
              query: {
                microAppName: arr[0],
                url: arr[1],
                maxDataruleCode,
                menuId: item.menuId,
              },
            });
          }else if (arr[0] == 'business_cccf') {
              if (arr[2]) {
                  // 消防
                  historyPush({
                      pathname: `/cccf`,
                      query: {
                          microAppName: arr[0],
                          url: arr[1],
                          pageId: arr[2], // 配置动态路由增加页面复用区分页面路由
                          maxDataruleCode,
                      },
                  });
                  return;
              }
              // 消防
              historyPush({
                  pathname: `/cccf`,
                  query: {
                      microAppName: arr[0],
                      url: arr[1],
                      maxDataruleCode,
                  },
              });
            } else {
            historyPush({
              pathname: `/budgetPage`,
              query: {
                microAppName: arr[0],
                url: arr[1],
                maxDataruleCode,
                menuId: item.menuId,
              },
            });
          }
        });
      }
    const gotopath = (item) => {
        console.log(item.path,'item.path');
        if(item.path.includes('dynamicPage')){
            let bizSolId = 0,
                  listId = 0,
                  formId = 0,
                  otherBizSolId = '';
                const index = item.path.indexOf('?otherBizSolId');
                if (index > -1) {
                  otherBizSolId = item.path.slice(index + 15);
                  item.path = item.path.slice(0, index);
                }
                const arr = item.path.split('/');
                bizSolId = arr[2];
                listId = arr[3] || 0;
                formId = arr[4] || 0;
                setDynamicPage(bizSolId,listId,formId,otherBizSolId,item,)
            // historyPush({
            //     pathname:'/dynamicPage',
            //     query:{
            //         bizSolId:item.path.substring(item.path.lastIndexOf("/",item.path.lastIndexOf("/"))+1)
            //     }
            // })
        }else if( item.path?.includes('business_controls') ||item.path?.includes('business_cma')||item.path?.includes('business_cccf')){
            setControlsPage(item)
        }
        else{
            setDynamicPageLink(item)
        }
    }

    // TODO ymd
    function onBottomOkClick() {
        setCount(0);
        localStorage.setItem(`mdKeys`, JSON.stringify(selectKeys));
        localStorage.setItem(`mdList`, JSON.stringify(selectList));
        setIsModalVisible(false)
    }

    // TODO ymd
    function onBottomHideClick() {
        if (count) {
            setCount(0);
            dispatch({
                type: 'shortCut/updateStates',
                payload: {
                    selectKeys: cacheKeys,
                    selectList: cacheList,
                }
            })
        }
        setIsModalVisible(false)
    }

    // TODO ymd
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
            type: 'shortCut/updateStates',
            payload: {
                selectKeys: arr,
                selectList: list
            }
        })
    }

    return (

        <div className={styles.shortCut_container} id='shortCut_id'>
            {/* <Menu className={styles.shortCut_menu}>
                <Menu.Item key='0' className={styles.menu}>
                    <div className={styles.recently}>
                        <p>最近使用</p><Button size='small' onClick={() => { delMenuAll() }}>清 空</Button>
                    </div>
                    <div className={styles.recentlyList}>
                        {
                            (recentlyUse==null || recentlyUse.length == 0) && <div className={styles.content}>当前没有常用快捷方式</div>
                        }
                        {
                            recentlyUse && recentlyUse.map((item, index) => {
                                return <div className={styles.item} onClick={() => { gotopath(item) }}>
                                    <span > {item.name}</span>
                                    <span onClick={(e) => { delRecently(e,item.menuCode) }} style={{fontSize:12,color:'#999'}}><CloseOutlined /></span>
                                </div>
                            })
                        }
                    </div>
                </Menu.Item>
                <Menu.Item key='1' className={styles.menuList} >
                    <div className={styles.recently}>
                        <p>快捷方式</p><div><Button size='small' onClick={onShowModal} className={styles.addShortCutItem}>添加</Button><Button size='small' onClick={() => { delShortCut() }}>清空</Button></div>
                    </div>
                    <div className={styles.recentlyListbot}>
                        {
                            (list.length == 0) && <div className={styles.content}>当前没有快捷方式</div>
                        }
                        {list && list.map((item, index) => {
                            return <div className={styles.item} onClick={() => { gotopath(item) }}>
                                <span > {item.menuName}</span><span
                                    onClick={(e) => { delShortcutItem(e,item.menuId) }} style={{fontSize:12,color:'#999'}}
                                ><CloseOutlined /></span>
                            </div>
                        })}
                    </div>
                </Menu.Item>
            </Menu> */}
            <ul>
              {
                list.map((item,index)=>{
                  return  <li onClick={() => { gotopath(item) }} className={styles[`color_${index % 5}`]}>
                    <div>
                    <p>{  iconKeyValArr[item.menuId]?<IconFont  type={`icon-${iconKeyValArr[item.menuId]}`} style={{width:30,height:30}}/>:<IconFont  type='icon-default' style={{width:30,height:30}}/> }</p>
                    <p title={item.menuName}>{item.menuName}</p>
                    </div>
                    
                    <span className={styles.closeApp} onClick={(e) => { delShortcutItem(e,item.menuId) }}><img src={closeApp} /></span></li>
                })
              }
              <li className={styles.addMenu} onClick={onShowModal}> <AddApp /></li>
            </ul>
            {
                isModalVisible && <AddShortcut
                    handleOk={onModalClick}
                    handleCancel={onModalClick}
                    showModal={showModal}
                />
            }

            {/* <SetModal
              title="快捷方式" containerId="root"
              isFif={true}
              isSetModalVisible={isModalVisible}
              allAppList={menuList}
              selectKeys={selectKeys}
              onOkModal={onBottomOkClick}
              onHideModal={onBottomHideClick}
              onClickSingleApp={onBottomSingClick}
            /> */}
        </div>
    )
}
export default connect(({
    shortCut
}) => ({ shortCut }))(Index)
