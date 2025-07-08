import {message} from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant'
import { parse } from 'query-string';
import { history } from 'umi'
const {} = apis;

export default {
  namespace: 'authorizedView',
  state: {
    loading: false,
    menuList:[],
    addModal:false,  //新增修改
    setModal:false,//业务域设置
    addObj:{},
    sysTreeData:[{
        title: '业务域',
        key: '10',
        selectable:false,
        children:[
          {
            title: '支撑平台',
            key: '1',
          },
          {
              title: '业务平台',
              key: '2',
          },
          {
              title: '微协同',
              key: '3',
          }
        ]
    }],//系统树
    moduleTreeData:[
      {
        title: '模块资源名称',
        key: '1',
      },
      {
          title: '组织与权限',
          key: '2',
      },
      {
          title: '应用建模',
          key: '3',
      },
      {
        title: '预算管理',
        key: '4',
      },
      {
          title: '公文管理',
          key: '5',
      },
      {
          title: '通用管理',
          key: '6',
      }
    ],
    imageUrl:'',
    menuImgId:'',
    parentIds:[],//上级节点id
  },
  subscriptions: {
    // setup({dispatch, history},{call, select}) {
    //   history.listen(location => {
    //     if (history.location.pathname === '/authorizedView') {
    //       const query = parse(history.location.search);
    //       if(query.isInit=='1'){
    //         dispatch({
    //           type: 'updateStates',
    //           payload:{
    //             loading: false,
    //             menuList:[],
    //             addModal:false,
    //             setModal:false,
    //             addObj:{},
    //             sysTreeData:[],
    //             imageUrl:'',
    //             menuImgId:'',
    //             parentIds:[]
    //           }
    //         })
    //       }
    //     }
    //   });
    // }
  },
  effects: {
   
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
