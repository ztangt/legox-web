import { message } from 'antd'
import apis from 'api'

export default {
  namespace: 'loginAuditLog',//命名空间
  state: {
    isShowDeleteModal: false,
    allPage: 0,
    currentPage: 1,
    returnCount: 0,
    list: [],//列表数据
    selectedRowKeys: '',
    limit: 10,
    search: '',
    detailData: {},//详细信息
  },
  effects: {
    //获取登录审计日志
    *getLoginAuditLog({ payload }, { call, put, select }) {
      const {data} = yield call(apis.getLoginAuditLog, payload);
      if(data.code==200){
        yield put({
          type:"updateStates",
          payload:{
            list:data.data.list,
            returnCount: data.data.returnCount,
            currentPage: data.data.currentPage,
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *deleteGroup({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.auditBatchDelete, payload);
      if (data.code == 200) {
        message.success('删除成功');
        //重新获取
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    }
  },
  reducers: {
    updateStates(state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  }

}
