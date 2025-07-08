import apis from 'api';
import { message } from 'antd';
import axios from 'axios';
import { setAllAppList, getFlatArr } from "../../util/util";
import addLogoSrc from './images/addItem.png';
import { REQUEST_SUCCESS } from '../../service/constant';
import iconData from '../../../public/icon_menuList/iconfont.json';

export default {
  namespace: 'fusionDesktop',
  state: {
    isSetModalVisible: false,
    allAppList: [],
    selectKey: [],
    selectAppList: [],
    defalutConfiguration: [
      {
        id: 'config1',
        name: '请添加应用',
        url: addLogoSrc,
        path: '',
      },
      {
        id: 'config2',
        name: '请添加应用',
        url: addLogoSrc,
        path: '',
      },
      {
        id: 'config3',
        name: '请添加应用',
        url: addLogoSrc,
        path: '',
      },
      {
        id: 'config4',
        name: '请添加应用',
        url: addLogoSrc,
        path: '',
      },
      {
        id: 'config5',
        name: '请添加应用',
        url: addLogoSrc,
        path: '',
      },
      {
        id: 'config6',
        name: '请添加应用',
        url: addLogoSrc,
        path: '',
      },
    ],
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen(location => {
        if (history.location.pathname === '/desktopLayout') {
          return
          dispatch({
            type: 'getUserMenus',
            payload: {
              sysPlatType: 'FRONT',
            },
            callback: data => {
              const type = '3';
              const ptType = '1';
              const fileName = 'deskTable';
              const jsonName = 'tablelayout.json';
              const minioUrl = localStorage.getItem('minioUrl');
              const tenantId = localStorage.getItem('tenantId');
              // 完整路径：minio地址/租户ID/deskTable/平台类型如1/类型如1/tablelayout.json
              let url = `${minioUrl}/${tenantId}/${fileName}/${ptType}/${type}/${jsonName}`;
              axios
                .get(url, {
                  // 防止走缓存 带个时间戳
                  params: {
                    t: Date.parse(new Date()) / 1000,
                  },
                })
                .then(function(res) {
                  if (res.status == REQUEST_SUCCESS) {
                    const allAppList = setAllAppList(
                      data,
                      res.data.selectAppList,
                      res.data.defalutConfiguration,
                    );
                    dispatch({
                      type: 'updateStates',
                      payload: {
                        allAppList,
                        selectAppList: res.data.selectAppList,
                        defalutConfiguration: res.data.defalutConfiguration,
                      },
                    });
                  }
                })
                .catch(function(error) {
                  // here ~~   no matter
                });
            },
          });
        }
      });
    },
  },
  effects: {
    *getUserMenus({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getUserMenus, payload);
      if (data.code == 200) {
        const tmp = data.data.menus
        tmp.forEach(element => {
          element['children'] = getFlatArr(element.children).filter(
            i => i.path !== '',
          );
        });
        const loop = array => {
          for (let index = 0; index < array.length; index++) {
            const element = array[index];
            var codeFlag = iconData.glyphs.findIndex((item)=>{return item.font_class == element.menuCode})
            var iconFlag = iconData.glyphs.findIndex((item)=>{return item.font_class == element.menuIcon})

            if (!element.path) {
            }else{
              array[index]['iconName'] = iconFlag!=-1?(
                element.menuIcon
              ):codeFlag!=-1?(
                element.menuCode
              ):'default';
            }

            if (element.children && element.children.length != 0) {
              array[index]['redirect'] = element.children[0].path;
              loop(element.children);
            }
          }
          return array;
        };
        let allAppList = loop(tmp);
        yield put({
          type: 'updateStates',
          payload: {
            allAppList,
          },
        });
        callback && callback(allAppList);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *updateTableLayout({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.updateTableLayout, payload);
      if (data.code == REQUEST_SUCCESS) {
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
  },
  reducers: {
    updateStates(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
