import {message} from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';
import moment from 'moment'; 
import 'moment/locale/zh-cn'; 
moment.locale('zh-cn');
import { parse } from 'query-string';
const {getTenants,getUsers,addUsers,updateUsers,userMgDeleteUsers,batchUsers,getIdUsers,getUserInfo,importUser,importUserResult} = apis;
const limit=10;
export default {
  namespace: 'userMg',
  state: {
    loading: false,
    returnCount: 0,
    tenementLists: [],//租户列表
    userLists:[],//用户列表
    batchModal:false,
    addModal:false,
    currentUg:{},
    tenantId:'',//选择的租户id
    userIds: [],
    importData:{},//导入结果数据
    acountStatus:true,
    typeNames: '',
    optionFile: {},
    fileSize: '',
    getFileMD5Message: {},
    success: '',
    v: 1,
    needfilepath: '',
    isStop: true,
    isContinue: false,
    isCancel: false,
    index: 0,
    merageFilepath: '',
    typeName: '',
    fileExists: '',
    fileExistsFu: '', // 是否有富文本内容
    md5FilePath: '',
    md5FileId: '',
    fileName:'',
    fileFullPath:'',
  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      history.listen(location => {
        if (history.location.pathname === '/userMg') {
           const query = parse(history.location.search);
          if(query.isInit=='1'){
            dispatch({
              type: 'updateStates',
              payload:{
                limit:limit,
                loading: false,
                tenementLists: [],//租户列表
                userLists:[],//用户列表
                batchModal:false,
                addModal:false,
                tenantId:'',
                userIds: [],
                importData:{},//导入结果数据
                acountStatus:true
              }
            })
          }
          // 点击用户管理请求数据
          // dispatch({
          //   type: 'getUsers',
          //   payload:{
          //     searchValue:'',
          //     start:1,
          //     limit:limit
          //   }
          // })
        }
      });
    }
  },
  effects: {
    *getTenants({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getTenants, payload);
        const {currentPage} = yield select(state=>state.layoutG.searchObj['/userMg'])
        if(data.code==REQUEST_SUCCESS){
          let tenementLists = JSON.parse(JSON.stringify(data.data.list))
          console.log(tenementLists, '-=====')
          tenementLists.forEach(function(item,i){
            item['label'] = item.tenantName;
            item['value'] = item.id
          })
          yield put({
            type: 'updateStates',
            payload:{
              tenementLists
            }
          })
          yield put({
            type: 'layoutG/updateStates',
            payload:{
              currentPage: data.data.currentPage
            }
          })
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getUsers({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getUsers, payload);
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload:{
              userIds: [],
              userLists: data.data.list,
              returnCount: data.data.returnCount,
            }
          })
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getUserInfo({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getUserInfo, payload);
        if(data.code==REQUEST_SUCCESS){
          callback&&callback(data.data);
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *addUsers({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(addUsers, payload);
        const {currentPage,limit} = yield select(state=>state.layoutG.searchObj['/userMg'])
        const {tenantId} = yield select(state=>state.userMg)
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type:'getUsers',
            payload:{
              searchValue:'',
              start:currentPage,
              limit:limit,
              tenantId:tenantId == '-1' ? '' : tenantId
            }
          })
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *updateUsers({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(updateUsers, payload);
        const {currentPage,limit} = yield select(state=>state.layoutG.searchObj['/userMg'])
        const {tenantId} = yield select(state=>state.userMg)
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type:'getUsers',
            payload:{
              searchValue:'',
              start:currentPage,
              limit:limit,
              tenantId:tenantId == '-1' ? '' : tenantId
            }
          })
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *userMgDeleteUsers({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(userMgDeleteUsers, payload);
        const {currentPage,limit} = yield select(state=>state.layoutG.searchObj['/userMg'])
        const {tenantId} = yield select(state=>state.userMg)
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type:'getUsers',
            payload:{
              searchValue:'',
              start:currentPage,
              limit:limit,
              tenantId:tenantId == '-1' ? '' : tenantId
            }
          })
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *batchUsers({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(batchUsers, payload);
        if(data.code==REQUEST_SUCCESS){
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getIdUsers({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getIdUsers, payload);
        data.data.sex = data.data.sex&&data.data.sex<3 ? String(data.data.sex) : '0'//性别
        data.data.isEnable = data.data.isEnable == 1 ? true : false//是否启用
        data.data.isAppEnable = data.data.isAppEnable == 1 ? true : false//是否移动端登录
        data.data.sex = data.data.sex ? String(data.data.sex) : '0'//性别
        data.data.political = data.data.political ? String(data.data.political) : '0'//政治面貌
        data.data.personType = data.data.personType ? String(data.data.personType) : '0'//人员类型
        data.data.customType = data.data.customType ? String(data.data.customType) : '1'//用户类型
        data.data.education = data.data.education ? String(data.data.education) : '0'//学历
        data.data.degree = data.data.degree ? String(data.data.degree) : '0'//学位
        data.data.idenType = data.data.idenType ? String(data.data.idenType) : '0'//证件类型
        data.data.birthday = data.data.birthday ? moment.unix(Number(data.data.birthday), 'YYYY-MM-DD') : null//出生日期

        data.data.pwdExprTime = data.data.pwdExprTime?moment.unix(Number(data.data.pwdExprTime), 'YYYY-MM-DD'):null//密码失效日期
        data.data.workTime = data.data.workTime?moment.unix(Number(data.data.workTime), 'YYYY-MM-DD'):null//参加工作时间
        data.data.entryTime = data.data.entryTime?moment.unix(Number(data.data.entryTime), 'YYYY-MM-DD'):null//调入时间
        data.data.joinTime = data.data.joinTime?moment.unix(Number(data.data.joinTime), 'YYYY-MM-DD'):null//入党时间
        // const {currentPage} = yield select(state=>state.layoutG.searchObj['/organization']['user'])
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload:{
              currentUg:data.data
            }
          })
          callback&&callback(data.data);
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //用户信息导入
    *importUser({ payload, callback }, { call, put, select }) {
      const { data } = yield call(importUser, payload);
      if (data.code == REQUEST_SUCCESS) {
          callback && callback(data.data.importId)
      } else if (data.code != 401) {
          message.error(data.msg);
      }
    },
    //用户信息导入结果查看
    *importUserResult({ payload,callback }, { call, put, select }) {
      const { data } = yield call(importUserResult, payload);
      if (data.code == REQUEST_SUCCESS) {
          callback&&callback(true,data)
      } else if (data.code != 401) {
          callback&&callback(false,data)

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
