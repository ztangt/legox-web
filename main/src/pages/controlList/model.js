import {message} from 'antd';
import _ from "lodash";
import { REQUEST_SUCCESS } from '../../service/constant'
import apis from 'api'

const NEW_TYPE = 0;
const EDIT_TYPE = 1;

export default {
  namespace: 'controlList',
  state: {
    formModalVisible: false,//修改、添加控件弹窗状态
    countId: 0,
    controlTable: [],
    checkedControls: [],
    formInitial: {}, //表单初值
    formData: {}, //表单内容
    formType: NEW_TYPE, // 添加/修改
    changeIndex: -1,

    listIdNow: -1, //修改设计的控件ID
    listModalVisible: false, //设计表单弹窗状态
    listModalTable:  [],
    listModalChecked: [], //已经选中的表单
    finalChecked: [], //最终选择提交的表单




  },

  subscriptions: {
    // setup({dispatch, history}) {
    //   history.listen((location) => {
    //     if (history.location.pathname === '/controlList') {
    //       dispatch({
    //         type: 'getControlList',
    //         payload: {

    //         }
    //       });

    //     }
    //   });

    // },

  },
  effects: {
    *getControlList({ payload,callback}, { call, put, select }) {
      try {
        const {data} = yield call(apis.getAllControls, {});
        if(data.code == REQUEST_SUCCESS) {
          let newTable = data.data;//api接口测试
          // let newTable = data.data.list;//YAPI接口

          // console.log("res is", newTable);
          yield put({
            type: 'updateStates',
            payload:{
              controlTable: [...newTable],
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (error) {

      } finally {

      }
    },

    *addControl({ payload,callback}, { call, put, select }) {
      try {

        const {data} = yield call(apis.addControl, payload);
        if(data.code == REQUEST_SUCCESS) {
          // console.log(data);
          yield put({
            type: 'getControlList',
            payload: {

            }
          });
          callback&&callback();
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }


      } catch (error) {

        // console.log("error is",error);

      } finally {

      }

    },

    *changeControl({ payload,callback}, { call, put, select }) {
      try {
        const {controlName, controlCode, controlType} = payload;
        const {changeIndex, controlTable} = yield select(state => state.controlList);
        if(changeIndex > -1) {
          const newData = {controlId: controlTable[changeIndex].controlId, controlName: controlName, controlCode: controlCode, controlType: controlType};

          const {data} = yield call(apis.updateControl, newData);
          if(data.code == REQUEST_SUCCESS) {
            // console.log(data);
            yield put({
              type: 'getControlList',
              payload: {

              }
            });
            callback&&callback();
          } else if (data.code != 401 && data.code != 419 && data.code !=403) {
            message.error(data.msg);
          }
        }



      } catch (error) {

      } finally {

      }
    },

    *deleteControl({ payload,callback}, { call, put, select }) {
      try {
        const {controlId} = payload;
        let controlIds = [controlId];
        // console.log("delete payload is", {controlIds});

        yield put({
          type: 'deleteControls',
          payload: {
            controlIds: controlIds,
          }
        });
      } catch (error) {

      } finally {

      }
    },

    *deleteControls({ payload,callback}, { call, put, select }) {
      try {
        const {data} = yield call(apis.deleteControl, payload);
        if(data.code == REQUEST_SUCCESS) {
          // console.log(data);
          yield put({
            type: 'getControlList',
            payload: {

            }
          });
          callback&&callback();
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }

      } catch (error) {

      }
    },

    *getComponentsList({ payload,callback}, { call, put, select }) {
      const {data} = yield call(apis.getComponentsList, {});
      // console.log(data);
      // console.log('all', data.data.list);
      if(data.code == REQUEST_SUCCESS) {
        // let newTable = data.data;//api接口测试
        let newTable = data.data.list;//YAPI接口
        yield put({
          type: 'updateStates',
          payload:{
            listModalTable: [...newTable],
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }

    },

    *getComponentsById({ payload,callback}, { call, put, select }) {
      const {data} = yield call(apis.getComponentsById, payload);
      // console.log(payload, data.data.list);
      if(data.code == REQUEST_SUCCESS) {
        // let newTable = data.data;//api接口测试
        // let newTable = data.data.list.map((item) => ({
        //   componentId: item.COMPONENTID,
        //   componentCode: item.COMPONENTCODE,
        //   componentName: item.COMPONENTNAME,
        //   componentType: item.COMPONENTTYPE,
        //   componentDesc: item.COMPONENTDESC,
        // }));
        let newTable = data.data.list;

        yield put({
          type: 'updateStates',
          payload:{
            listModalChecked: [...newTable],
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },

    *updateComponentsById({ payload,callback}, { call, put, select }) {
      const {listIdNow} = yield select(state => state.controlList);

      const {data} = yield call(apis.updateComponentsById,  {controlId: listIdNow, ...payload});
      // console.log("update id  " + listIdNow + ":  params is " + JSON.stringify({controlId: listIdNow, ...payload}));

      if(data.code == REQUEST_SUCCESS) {
        // console.log("update id  " + listIdNow + ":  params is " + JSON.stringify({controlId: listIdNow, ...payload}) + '  res is', data);
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },

  },

  reducers: {
    updateStates(state, action){
      // console.log('control action.payload',action.payload);
      return {
        ...state,
        ...action.payload
      }
    }


  },
}
