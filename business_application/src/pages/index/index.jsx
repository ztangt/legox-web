/**
 * @author zhangww
 * @description 个人首页
 */
import axios from 'axios';
import _ from 'lodash';
import { MessageOutlined } from '@ant-design/icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import { MyContext } from '../../layouts/index';
import { REQUEST_SUCCESS } from '../../service/constant';
import { defaultLayoutState, emptyLayoutState } from '../../util/constant';
import ColumnAll from './componments/columnAll';
import NewMessage from './componments/columnMessage';
import BacklogoModal from '../../componments/backlogoModal';
import { Spin } from 'antd';
import styles from './index.less';

function Index(identityId, registerId) {
  const dispatch = useDispatch();

  // const [isResized, setIsResized] = useState(false);

  const { menus, msgLength } = useSelector(({ user }) => ({
    ...user,
  }));
  const { isOver, refreshTag, singleTag, isResized, desktopHeight } = useSelector(
    ({ desktopLayout }) => ({
      ...desktopLayout,
    }),
  );
  const { isShowModal } = useSelector(
    ({ msgNotice }) => ({
      ...msgNotice,
    }),
  );
  const { isModalVisible ,currentType} = useSelector(
    ({ backlogo }) => ({
      ...backlogo,
    }),
  );
  const collapsed = useContext(MyContext);
  // ant-tabs-content-holder
  // useEffect(() => {
  //   const elements = document.querySelectorAll('.ant-tabs-content-holder');
  //   elements.style.over
  //   ;
  // }, []);
  useEffect(() => {
    dispatch({
      type: 'desktopLayout/getColumnList',
      payload: {
        // sectionType: 1,
        start: 1,
        limit: 100,
      },
    });
    dispatch({
      type: 'columnWorkList/getTodoWork',
      payload: {
        workRuleId:'',
        start: 1,
        limit: 20,
      },
    });
  }, []);

  useEffect(() => {
    if (isOver && window.localStorage.getItem('portalQuery')) {
      const item = JSON.parse(window.localStorage.getItem('portalQuery'));
      getDataRuleCode(item, (maxDataruleCode) => {
        if (item.menuLink?.includes('dynamicPage')) {
          let bizSolId = 0,
            listId = 0,
            formId = 0,
            otherBizSolId = '';
          const index = item.menuLink.indexOf('?otherBizSolId');
          if (index > -1) {
            otherBizSolId = item.menuLink.slice(index + 15);
            item.menuLink = item.menuLink.slice(0, index);
          }
          const arr = item.menuLink.split('/');
          bizSolId = arr[2];
          listId = arr[3] || 0;
          formId = arr[4] || 0;
          if (bizSolId == 0) {
            setTimeout(() => {
              historyPush({
                pathname: '/dynamicPage',
                query: {
                  bizSolId,
                  listId,
                  formId,
                  otherBizSolId,
                  maxDataruleCode,
                },
                title: item?.menuName,
                key: item.menuLink,
              });
            }, 200);
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
                    },
                    title: item?.menuName,
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
                    },
                    title: item?.menuName,
                    key: item.menuLink,
                  });
                }
              },
            });
          }
        } else if (
          item.menuLink?.includes('business_controls') ||
          item.menuLink?.includes('business_cma') ||
          item.menuLink?.includes('main')||
          item.menuLink?.includes('business_cccf')
        ) {
          let arr = item.menuLink?.split('/');
          arr = arr.filter((item) => item);
          const menuId = item.menuId;
          localStorage.setItem('menuId', menuId);
          if (arr[0] == 'business_cma') {
            if (arr[2]) {
              setTimeout(() => {
                // 气象
                historyPush({
                  pathname: `/meteorological`,
                  query: {
                    microAppName: arr[0],
                    pageId: arr[2], // 配置动态路由增加页面复用区分页面路由
                    url: arr[1], //url都放在最后一个，方便子项目的参数解析
                    maxDataruleCode,
                  },
                  title: item?.menuName,
                  key: item.menuLink,
                });
              }, 200);
            }
            setTimeout(() => {
              // 气象
              historyPush({
                pathname: `/meteorological`,
                query: {
                  microAppName: arr[0],
                  url: arr[1], //url都放在最后一个，方便子项目的参数解析
                  maxDataruleCode,
                },
                title: item?.menuName,
                key: item.menuLink,
              });
            }, 200);
          }else if(arr[0] == 'business_cccf'){
            if (arr[2]) {
              setTimeout(() => {
                // 消防
                historyPush({
                  pathname: `/cccf`,
                  query: {
                    microAppName: arr[0],
                    pageId: arr[2], // 配置动态路由增加页面复用区分页面路由
                    url: arr[1], //url都放在最后一个，方便子项目的参数解析
                    maxDataruleCode,
                  },
                  title: item?.menuName,
                  key: item.menuLink,
                });
              }, 200);
            }
            setTimeout(() => {
              // 消防
              historyPush({
                pathname: `/cccf`,
                query: {
                  microAppName: arr[0],
                  url: arr[1], //url都放在最后一个，方便子项目的参数解析
                  maxDataruleCode,
                },
                title: item?.menuName,
                key: item.menuLink,
              });
            }, 200);
          }else if (arr[0] == 'main') {
            setTimeout(() => {
              // 支撑
              historyPush({
                pathname: `/microPage`,
                query: {
                  microAppName: arr[0],
                  url: arr[1], //url都放在最后一个，方便子项目的参数解析
                  maxDataruleCode,
                },
                title: item?.menuName,
                key: item.menuLink,
              });
            }, 200);
          } else {
            setTimeout(() => {
              historyPush({
                pathname: `/budgetPage`,
                query: {
                  microAppName: arr[0],
                  menuId: item.menuId,
                  url: arr[1], //url都放在最后一个，方便子项目的参数解析
                  maxDataruleCode,
                },
                title: item?.menuName,
              });
            }, 200);
          }
        } else {
          if (item.menuLink.includes('?')) {
            let arr = item.menuLink?.split('?');
            let obj = convertToObject(arr?.[1]);
            setTimeout(() => {
              historyPush({
                pathname: item.menuLink,
                query: {
                  ...obj,
                  maxDataruleCode,
                },
                title: item?.menuName,
              });
            }, 200);
          } else {
            setTimeout(() => {
              historyPush({
                pathname: item.menuLink,
                query: {
                  maxDataruleCode,
                },
                title: item?.menuName,
              });
            }, 200);
          }
        }
        window.localStorage.setItem('portalQuery', '');
      });
    }
  }, [isOver]);

  useEffect(() => {
    if (refreshTag) {
      setTimeout(() => {
        getAxios();
      }, 0);
    }
  }, [refreshTag]);

  useEffect(() => {
    if (menus.length) {
      setTimeout(() => {
        getAxios();
      }, 0);
    }
  }, [collapsed, singleTag]);

  const getDataRuleCode = (item, callback) => {
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
        window.localStorage.setItem('maxDataruleCode', maxDataruleCode);
        callback && callback(maxDataruleCode);
      },
    });
  };

  function convertToObject(x) {
    const decodedX = decodeURIComponent(x);
    const params = new URLSearchParams(decodedX);
    const obj = {};
    for (const [key, value] of params) {
      obj[key] = value;
    }
    return obj;
  }
  const onNewMessage = () => {
      dispatch({
          type: 'msgNotice/getMessageList',
          payload: {
              searchWord: '',
              category: '',
              start: 1,
              limit: 10,
          },
          callback:()=>{
            dispatch({
              type:'msgNotice/updateStates',
              payload:{
                isShowModal:true
              }
            })
          }
      })
  };
  const getAxios = useCallback(() => {
    dispatch({
      type: 'desktopLayout/updateStates',
      payload: {
        isOver: false,
        layoutState: emptyLayoutState,
      },
    });
    const id = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')).id
      : '';
    const desktopType = localStorage.getItem(`desktopType${id}`) || 0;
    const tableConfig = JSON.parse(localStorage.getItem('tableConfig'));
    // console.log('123xxx:',desktopType,tableConfig);
    // 1-快捷桌面
    if (
      desktopType == 1 &&
      tableConfig &&
      tableConfig.TABLE_FAST.substr(0, 1) == 1
    ) {
      historyPush({ pathname: '/fastDesktop' });
      // UPDATETABS({
      //   tabMenus: [
      //     {
      //       key: '/fastDesktop',
      //       title: '快捷桌面',
      //       href: '/fastDesktop',
      //     },
      //   ],
      // });
      //2-融合桌面
    } else if (
      desktopType == 2 &&
      tableConfig &&
      tableConfig.TABLE_MIX.substr(0, 1) == 1
    ) {
      historyPush({ pathname: '/fusionDesktop' });
      // UPDATETABS({
      //   tabMenus: [
      //     {
      //       key: '/fusionDesktop',
      //       title: '融合桌面',
      //       href: '/fusionDesktop',
      //     },
      //   ],
      // });
      // 0- 个人桌面   2022.08.22  新用户初始下tableConfig为null  给个默认的吧？
    } else if (
      (desktopType == 0 &&
        tableConfig &&
        tableConfig.TABLE_PERSON.substr(0, 1) == 1) ||
      tableConfig === null
    ) {
      let newTabMenus = _.cloneDeep(GETTABS());
      if (newTabMenus && newTabMenus?.length === 1) {
        UPDATETABS({
          tabMenus: [
            {
              key: '/',
              title: '个人桌面',
              href: '/',
            },
          ],
        });
      }
      const type = '1';
      const ptType = '2';
      const fileName = 'deskTable';
      const jsonName = 'tablelayout.json';
      const minioUrl = localStorage.getItem('minioUrl');
      const tenantId = localStorage.getItem('tenantId');
      const identityId = localStorage.getItem('identityId');
      // 完整路径： minio地址/租户ID/deskTable/岗人ID/平台类型如1/类型如1/tablelayout.json
      let url = `${minioUrl}/${tenantId}/${fileName}/${identityId}/${ptType}/${type}/${jsonName}`;
      axios
        .get(url, {
          // 防止走缓存 带个时间戳
          params: {
            t: Date.parse(new Date()) / 1000,
          },
        })
        .then(function (res) {
          if (res.status == REQUEST_SUCCESS) {
            dispatch({
              type: 'desktopLayout/updateStates',
              payload: {
                layoutState: res.data || defaultLayoutState,
                desktopHeight: res.data?.height || 0,
                isOver: true,
              },
            });
          } else {
            dispatch({
              type: 'desktopLayout/updateStates',
              payload: {
                isOver: true,
              },
            });
          }
        })
        .catch(function (error) {
          console.log(error);

          // here ~~  没有数据  重新请求支撑的minioUrl
          const ptType = '1';
          const type = '1';
          const fileName = 'deskTable';
          const jsonName = 'tablelayout.json';
          const minioUrl = localStorage.getItem('minioUrl');
          const tenantId = localStorage.getItem('tenantId');
          // 完整路径： minio地址/租户ID/deskTable/平台类型如1/类型如1/tablelayout.json
          let url = `${minioUrl}/${tenantId}/${fileName}/${ptType}/${type}/${jsonName}`;
          axios
            .get(url, {
              // 防止走缓存 带个时间戳
              params: {
                t: Date.parse(new Date()) / 1000,
              },
            })
            .then(function (res) {
              if (res.status == REQUEST_SUCCESS) {
                // count++;
                dispatch({
                  type: 'desktopLayout/updateStates',
                  payload: {
                    layoutState: res.data || defaultLayoutState,
                    desktopHeight: res.data?.height || 0,
                    isOver: true,
                  },
                });
                // 无奈之举
                // if (count === 1 && res.data) {
                //   historyPush('/desktopLayout');
                //   historyPush('/');
                // }
              } else {
                dispatch({
                  type: 'desktopLayout/updateStates',
                  payload: {
                    isOver: true,
                  },
                });
              }
            })
            .catch(function (error) {
              // here ~~   no matter
              dispatch({
                type: 'desktopLayout/updateStates',
                payload: {
                  isOver: true,
                  layoutState: defaultLayoutState,
                },
              });
            });
        });
    } else {
    }
  }, [collapsed, menus]);

  const tableConfig = JSON.parse(localStorage.getItem('tableConfig'));
  const showMain =
    !tableConfig || (tableConfig && tableConfig.TABLE_PERSON.substr(0, 1))
      ? 1
      : 0;

  return (

    <Spin spinning={!isOver}>
      <div className={styles.container} id="container" style={{height: desktopHeight || '100%'}}>
        {showMain && isOver ? <ColumnAll type="main" /> : null}
        <div
          className={msgLength > 0 ? styles.twinkle : styles.message}
          onClick={() => {
            onNewMessage();
          }}
        >
          <MessageOutlined />
        </div>
        {isShowModal && <NewMessage/>}
        {
          isModalVisible&&currentType=='deskTop' && <BacklogoModal
              containerId='dom_container'
          />
        }
      </div>
    </Spin>
  );
}

export default Index;
