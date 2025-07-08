import {message} from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';
import moment from 'moment';
import 'moment/locale/zh-cn';
import _ from "lodash";
import {history} from 'umi';
import {env} from '../../../../project_config/env'
moment.locale('zh-cn');

export default {
  namespace: 'sendTask',
  state: {
      tableData:[],
      limit:10,
      returnCount:0,
      currentPage:1,
      searchWord:'',
      selectedRowKeys:[],
      solModelId:'',

  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      history.listen(location => {
        if(history.location.pathname==='/sendTask'){
        
        }
      });
    }
  },
  effects: {
       //获取下发模型分页数据
        *getSolmodelDetails({payload,callback},{call,put,select}){
            const {data}=yield call(apis.getSolmodelDetails,payload)
            if(data.code==REQUEST_SUCCESS){
              data.data.list.forEach(item=>{
                item.key=Math.random().toString(36).slice(2)
            })
                yield put({
                    type:'updateStates',
                    payload:{
                        tableData:data.data.list,
                        returnCount:data.data.returnCount,
                        currentPage:data.data.currentPage
                    }
                })
                callback&&callback()

            }else if(data.code != 401 && data.code != 419 && data.code !=403){
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
