import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';
import { parse } from 'query-string';
import { history } from 'umi'
const {
  getButtonGroups,
  addButtonGroups,
  updateButtonGroups,
  deleteButtonGroups,
  getButtons,
  getButtonIds,
  addButtonIds,
} = apis;
export default {
  namespace: 'buttonSolution', //按钮方案
  state: {
    loading: false,
    addModal: false,
    associatedModal: false,
    addObj: {},
    returnCount: 0,
    buttonGroupsList: [],
    parentIds: [],
    buttonList: [],
    selectedRowKeys: [],
    preSelectedRowKeys: [], // 上一个选中的内容
    limit: 0,
    searchWord: '',
    currentPage: 1,
    isShowDefault: false, //用于加载form的默认值
    newSelectButtonList:[],
    allButtonList:[],
    searchButtonValue:'',
    checkedButtonKeys:'',
    isView:false
  },
  subscriptions: {
    setup({ dispatch, history, getState }, { call, select }) {
      // history.listen(location => {
        // if (history.location.pathname.includes('/buttonSolution') ) {
        //   const query = parse(history.location.search);
        //   const { currentPage, isInit, limit } = query;
        //   if (isInit == '1') {
        //     dispatch({
        //       type: 'updateStates',
        //       payload: {
        //         loading: false,
        //         addModal: false,
        //         associatedModal: false,
        //         addObj: {},
        //         buttonGroupsList: [],
        //         parentIds: [],
        //         buttonList: [],
        //         buttonIds: [],
        //       },
        //     });
        //   }
        // }
      // });
    },
  },
  effects: {
    *getButtonGroups({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getButtonGroups, payload);
        const { currentPage } = yield select(state => state.buttonSolution);
        console.log('data----查询', data);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              buttonGroupsList: data.data.list,
              returnCount: data.data.returnCount,
            },
          });
          callback && callback();
        } else if (data.code != '401') {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *addButtonGroups({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(addButtonGroups, payload);
        const { currentPage, limit } = yield select(
          state => state.buttonSolution,
        );
        console.log('data----新增', data);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getButtonGroups',
            payload: {
              searchValue: '',
              start: currentPage,
              limit: limit,
            },
          });
          callback && callback();
        } else if (data.code != '401') {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *updateButtonGroups({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(updateButtonGroups, payload);
        const { currentPage, limit } = yield select(
          state => state.buttonSolution,
        );
        console.log('data----修改', data);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getButtonGroups',
            payload: {
              searchValue: '',
              start: currentPage,
              limit: limit,
            },
          });
          callback && callback();
        } else if (data.code != '401') {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *deleteButtonGroups({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(deleteButtonGroups, payload);
        const { currentPage, limit } = yield select(
          state => state.buttonSolution,
        );
        console.log('data----删除', data);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getButtonGroups',
            payload: {
              searchValue: '',
              start: currentPage,
              limit: limit,
            },
          });
          callback && callback();
        } else if (data.code != '401') {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getButtons({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getButtons, payload);
        if (data.code == REQUEST_SUCCESS) {
          for (let index = 0; index < data.data.list.length; index++) {
            const element = data.data.list[index];
            element.title=element.buttonName
            element.key=element.buttonId
            element.value=element.buttonId
            
          }
          yield put({
            type: 'updateStates',
            payload: {
              buttonList: data.data.list,
            },
          });
          if(!payload.searchValue){
            yield put({
              type: 'updateStates',
              payload: {
                allButtonList:data.data.list,
              },
            });
          }
          // const { addObj } = yield select(state => state.buttonSolution);
          // yield put({
          //   type: 'getButtonIds',
          //   payload: {
          //     buttonGroupId: addObj.groupId,
          //   },
          // });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getButtonIds({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getButtonIds, payload);
        if (data.code == REQUEST_SUCCESS) {
          const { buttonList } = yield select(state => state.buttonSolution);
            for (let index = 0; index < data.data.list.length; index++) {
              const element = data.data.list[index];
              element.title=element.buttonName
              element.key=element.buttonId
              element.value=element.buttonId
              
            }
          const margeButtonList = (buttonList, selectButtonList) => {
            let newButtonList = [];
            buttonList.forEach(item => {
              let selectInfo = selectButtonList.filter(
                info => info.buttonId == item.buttonId,
              );
              if (selectInfo && selectInfo.length) {
                newButtonList.push(selectInfo[0]);
              } else {
                item.showType = 1;
                item.groupName = '';
                newButtonList.push(item);
              }
            });
            return newButtonList;
          };
          yield put({
            type: 'updateStates',
            payload: {
              buttonList: margeButtonList(buttonList, data.data.list),
              selectedRowKeys: data.data.list.map(item => {
                return item.buttonId;
              }),
              preSelectedRowKeys: data.data.list.map(item => {
                return item.buttonId;
              }),
              isShowDefault: true,
              newSelectButtonList:data.data.list

            },
          });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *addButtonIds({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(addButtonIds, payload);
        console.log('data---绑定', data);
        if (data.code == REQUEST_SUCCESS) {
          message.success('保存成功');
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *setSelectedRowKeys({ payload, callback }, { call, put, select }) {
      const { selectedRowKeys } = yield select(state => state.buttonSolution);

      yield put({
        type: 'updateStates',
        payload: {
          selectedRowKeys: payload.selectedRowKeys,
          // preSelectedRowKeys: selectedRowKeys,
        },
      });
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
