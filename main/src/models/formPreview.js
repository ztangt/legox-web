import apis from 'api';
import {env} from '../../../project_config/env';

export default {
  namespace: 'formPreview',
  state: {
    formJSON: [],
    formStyleJSON:{},//样式
    signConfig:{}
  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      history.listen(location => {
        // if(history.location.pathname=='/designer/formDesigner'){
        //   dispatch({
        //     type: 'getTenantSign'
        //   })
        // }
      });
    }
  },
  effects: {
        //获取表单详情
    *getFormDetail({ payload }, { call, put, select }) {
      const {data} = yield call(apis.getFormDetail,payload);
      if(data.code==200){
        // //请求formJson
        // yield put({
        //   type:'getLayouts',
        //   payload:{
        //     url:`${data.data.formJsonUrl}`
        //   }
        // })
        if(window.location.href.includes('/formAppEngine')&&data.data.appJsonUrl){
          //获取样式
          yield put({
            type: 'getFormStyleUrl',
            payload: {
              url: `${data.data.appJsonUrl}`
            }
          })
          return
        }
        if(window.location.href.includes('/formEngine')&&data.data.formJsonUrl){
          //获取样式
          yield put({
            type: 'getFormStyleUrl',
            payload: {
              url: `${data.data.formJsonUrl}`
            }
          })
        }
       
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取布局数据
    *getLayouts({ payload,callback }, { call, put, select }) {
      let data = [];
      try {
        data = yield call(async (url)=>{
            let response = await fetch(url);
            return response.json();
        },payload.url);
      } catch (e) {

      }
      if(!_.isEmpty(data)){
        console.log('data=',data);
        //重新组织grids
        data.map((item)=>{
          if(typeof item.grids!='undefined'&&item.grids&&item.grids.length){
            item.grids.map((grid,index)=>{
              delete grid['isDraggable']
              delete grid['isResizable']
            })
          }else{
            item.grids=[]
          }
        })
        yield put({
          type: 'updateStates',
          payload: {
            formJSON: data
          }
        })
      }
    },
    *getFormStyleUrl({ payload,callback,feId }, { call, put, select }) {
      // const {subLayouts,form} = yield select(state=>state.designer);
      let data = [];
      try {
        data = yield call(async (url)=>{
            let response = await fetch(url);
            return response.json();
        },payload.url);
      } catch (e) {

      }
      yield put({
        type:"updateStates",
        payload:{
          formStyleJSON:data
        }
      })
    },
    // 获取手写签批样式管理
    *getTenantSign({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getTenantSign, payload);
      console.log(data);
      if (data.code == 200) {
          yield put({
              type: "updateStates",
              payload: {
                signConfig: data.data,
              }
          })
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
      }
  },
  },
  reducers: {
    updateStates(state, action){
      return {
        ...state,
        ...action.payload
      }
    }
  },
};
