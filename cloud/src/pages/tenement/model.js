import {message} from 'antd';
import apis from 'api';
import {history} from 'umi';
export default {
  namespace: 'tenement',
  state: {
  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      history.listen(location => {
        if(history.location.pathname=='/tenement'){
          //获取列表
          // dispatch({
          //     type: 'getTenants',
          //     payload: {
          //       searchWord:'',
          //       start:1,
          //       limit:10
          //     }
          // })
        }
      });
    }
  },
  effects: {
    //获取列表
    *getTenants({payload},{call,put,select}){
      const {data}=yield call(apis.getTenants,payload,'','tenement');
      if(data.code==200){
        yield put({
          type:'updateStates',
          payload:{
            ...data.data
          }
        })
      }else if(data.code != 401 && data.code != 419 && data.code !=403){
        message.error(data.msg);
      }
    },
    //获取组织中心
    *getOrgCenters({payload},{call,put,select}){
      const {data}=yield call(apis.getOrgCenters,payload);
      if(data.code==200){
        yield put({
          type:'updateStates',
          payload:{
            orgCenterLists:data.data.list
          }
        })
      }else if(data.code != 401 && data.code != 419 && data.code !=403){
        message.error(data.msg);
      }
    },
    //更新租户信息
    *updateTenant({payload},{call,put,select}){
      const {data}=yield call(apis.updateTenant,payload);
      if(data.code==200){
        //重新获取列表
        const {searchObj} = yield select(state=>state.layoutG);
        const {pathname} = history.location;
        const {limit,searchWord,list,currentPage} = searchObj[pathname];
        if(list.length==1&&payload.tenantName.indexOf(searchWord)==-1&&currentPage!=1){
          //获取列表
          yield put({
            type:"getTenants",
            payload:{
              start:currentPage-1,
              limit:limit,
              searchWord:searchWord,
            }
          })
        }else{
          yield put({
            type:"getTenants",
            payload:{
              start:currentPage,
              limit:limit,
              searchWord:searchWord
            }
          })
        }
        yield put({
          type:'updateStates',
          payload:{
            isShowUpdateModal:false,
            tenantInfo:[]
          }
        })
      }else if(data.code != 401 && data.code != 419 && data.code !=403){
        message.error(data.msg);
      }
    },
    //保存共享组织
    *submitTenantOrg({payload},{call,put,select}){
      const {data}=yield call(apis.submitTenantOrg,payload);
      if(data.code==200){
        message.success('保存成功');
        yield put({
          type:'updateStates',
          payload:{
            isShowShareOrgModal:false,
            checkOrgInfos:[],
            orgCenterId:''
          }
        })
      }else if(data.code != 401 && data.code != 419 && data.code !=403){
        message.error(data.msg);
      }
    },
    //获取共享组织信息
    *getShareOrgInfo({payload},{call,put,select}){
      const {data}=yield call(apis.getShareOrgInfo,payload);
      if(data.code==200){
        let checkOrgInfos=[];
        let checkedKeys=[];
        data.data.list.map((item)=>{
          checkOrgInfos.push({
            orgId:item.orgId,
            permission:item.permission,
            scope:item.scope,
            orgCenterId:item.orgCenterId
          })
          checkedKeys.push(item.orgId);
        })
        yield put({
          type:'updateStates',
          payload:{
            checkOrgInfos:checkOrgInfos,
            checkedKeys:checkedKeys,
            orgCenterId:checkOrgInfos.length?checkOrgInfos[0].orgCenterId:''//用于选中状态
          }
        })
      }else if(data.code != 401 && data.code != 419 && data.code !=403){
        message.error(data.msg);
      }
    },
    //获取登录配置信息
    *getLoginConfig({payload,callback},{call,put,select}){
      const {data}=yield call(apis.getLoginConfig,payload);
      if(data.code==200){
        yield put({
          type:'updateStates',
          payload:{
            loginConfigInfo:data.data
          }
        })
        if(typeof callback=='function'){
          callback();
        }
      }else if(data.code != 401 && data.code != 419 && data.code !=403){
        message.error(data.msg);
      }
    },
    //更新登录配置
    *updateLoginConfig({payload},{call,put,select}){
      const {data}=yield call(apis.updateLoginConfig,payload);
      if(data.code==200){
        message.success('更新成功');
        yield put({
          type:'updateStates',
          payload:{
            isShowLoginConfig:false,
            tenantId:''
          }
        })
      }else if(data.code != 401 && data.code != 419 && data.code !=403){
        message.error(data.msg);
      }
    },
    //上传文件
    *uploadFile({payload}, { call, put,select }) {
      const {data} = yield call(apis.uploadTenantFile, payload,'');
      if(data.code==200){
        message.success('上传成功');
        const {searchObj} = yield select(state=>state.layoutG);
        const {pathname} = history.location;
        const {limit} = searchObj[pathname];
        //获取列表
        yield put({
          type:"getTenants",
          payload:{
            start:1,
            limit:limit,
            searchWord:'',
          }
        })
        yield put({
          type:"updateStates",
          payload:{
            searchWord:''
          }
        })
      }else if(data.code != 401 && data.code != 419 && data.code !=403){
        message.error(data.msg);
      }
    },
      // 数据源测试接口
  *addDatasourceTest({ payload }, { call, put, select }) {
      const { data } = yield call(apis.addDatasourceTest, payload);
      if (data.code == 200) {
          if (data.data) {
              message.success('连接成功');
          } else {
              message.error('连接失败');
          }
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
      }
  },
  *addLicenseZip({ payload ,callback}, { call, put, select }){
    const { data } = yield call(apis.addLicenseZip, payload);
    if (data.code == 200) {
      // message.success('导入成功');
      callback&&callback(data.data)
      const {searchObj} = yield select(state=>state.layoutG);
      const {pathname} = history.location;
      const {limit} = searchObj[pathname];
      //获取列表
      yield put({
        type:"getTenants",
        payload:{
          start:1,
          limit:limit,
          searchWord:'',
        }
      })
      yield put({
        type:"updateStates",
        payload:{
          searchWord:''
        }
      })
    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
        yield put({
          type:"updateStates",
          payload:{
            errorMsg:data.msg
          }
        })
    }
  },
  *checkDataSource({ payload ,callback}, { call, put, select }){
    const { data } = yield call(apis.checkDataSource, payload);
      if (data.code == 200) {
          if (data.data) {
              message.error('数据源已存在!,请重新输入');
              callback&&callback()
          }
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
      }
  },
    // 检查业务应用导入状态
    * checkTenantSolImportStatus({payload, callback}, {call, put, select}) {
      const {data} = yield call(apis.checkTenantSolImportStatus, payload);
      if (data.code == 200) {
        callback && callback(data.data);
      }else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //替换reducers 的updateStates
    *updateStates({ payload }, { call, put,select }) {
      const {searchObj} = yield select(state=>state.layoutG);
      const pathname = history.location.pathname;
      for (var key in payload) {
        searchObj[pathname][key]=payload[key]
      }
      yield put({
        type:"layoutG/updateStates",
        payload:{
          searchObj:searchObj
        }
      })
    },
  },
  reducers: {
    updateStatesSelf(state, action){
      return {
        ...state,
        ...action.payload
      }
    }
  },
};
