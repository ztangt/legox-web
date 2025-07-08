import { history } from 'umi';
import apis from 'api';
import { message } from 'antd';
//根据类型请求接口
const getActionByType = [
  {
    type: 'USER',
    ids: 'identityIds',
    action: 'getUsersByIds',
    list: 'list',
    idKey: 'orgRefUserId',
    nameKey: 'userName',
  },
  {
    type:'USERGROUP',
    ids:'ugIds',
    action:'getUsergroupByIds',
    list:'ugs',
    idKey:'id',
    nameKey:'ugName'
  },
  {
    type:'ORG',
    ids:'orgIds',
    action:'getOrgByIds',
    list:'orgs',
    idKey:'id',
    nameKey:'orgName'
  },
  {
    type:'POST',
    ids:'postIds',
    action:'getPostByIds',
    list:'posts',
    idKey:'id',
    nameKey:'postName'
  },
  {
    type:'DEPT',
    ids:'deptIds',
    action:'getDeptByIds',
    list:'depts',
    idKey:'id',
    nameKey:'deptName'
  },
  {
    type:'RULE',
    ids:'roleIds',
    action:'getRuleByIds',
    list:'roles',
    idKey:'id',
    nameKey:'roleName'
  },
];
const Model = {
  namespace: 'userAccredit',
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {});
    },
  },
  effects: {
    //查询用户
    *queryUser({ payload,callback }, { call, put, select }) {
      let namespace = payload.namespace;
      delete payload.namespace;
      if(namespace=='notification'||namespace=='information'){
        payload.headers = {
          'Datarulecode': ''
        };
      }
      const { data } = yield call(apis.queryUser, payload, '', 'userAccredit');
      if (data.code == 200) {
        console.log("data=list",data.data)
        let list = data.data.list;
          for (let i = 0; i < list.length; i++) {
            list[i]['nodeName'] = list[i]['orgName'];
            list[i]['nodeId'] = list[i]['id'];
          }
          console.log("listss==-",list)
        yield put({
          type: `${namespace}/updateStates`,
          payload: {
            originalData: list,
          },
        });
        callback&&callback(data.data.list)
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取用户组列表
    *getUgs({ payload,callback }, { call, put, select }) {
      let namespace = payload.namespace;
      delete payload.namespace;
      try {
        const { data } = yield call(apis.getUgs, payload, 'getUgs', 'userAccredit');
        if (data.code == 200) {
          let list = data.data.list;
          for (let i = 0; i < list.length; i++) {
            list[i]['nodeName'] = list[i]['ugName'];
            list[i]['nodeId'] = list[i]['id'];
          }
          yield put({
            type: `${namespace}/updateStates`,
            payload: {
              originalData: list,
              oldOriginalData: list,
            },
          });
          callback&&callback(list)
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //获取单位角色
    *getSysRoles({ payload }, { call, put, select }) {
      let namespace = payload.namespace;
      delete payload.namespace;
      const { data } = yield call(
        apis.getSysRoles,
        payload,
        '',
        'userAccredit',
      );
      if (data.code == 200) {
        console.log("data00999",data.data.list)
        yield put({
          type: `${namespace}/updateStates`,
          payload: {
            originalData: data.data.list,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //
    *getSelectedDatas({ payload }, { call, put, select }) {
      let orgUserType = payload.orgUserType;
      let namespace = payload.namespace;
      let curAction = getActionByType.filter(
        (item) => item.type == orgUserType,
      );
      let newPayload = {};
      newPayload[curAction[0].ids] = payload.selectedDataIds.join(',');
      if (curAction[0].action == 'getUsersByIds') {
        newPayload.start = 1;
        newPayload.limit = 1000;
        if(namespace=='notification'||namespace=='information'){
          newPayload.headers = {
            'Datarulecode': ''
          };
        }
      }
      const { data } = yield call(
        apis[curAction[0].action],
        newPayload,
        '',
        'userAccredit',
      );
      if (data.code == 200) {
        let selectedDatas = data.data[curAction[0].list];
        console.log("selectedDatas",selectedDatas,"data999",data)
        selectedDatas?.forEach((item) => {
          item.nodeId = item[curAction[0].idKey];
          item.nodeName = item[curAction[0].nameKey];
        });
        yield put({
          type: `${namespace}/updateStates`,
          payload: {
            selectedDatas: selectedDatas,
          },
        });
        console.log('selectedDatas=', selectedDatas);
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getPosts({ payload,callback }, { call, put, select }) {
      let namespace = payload.namespace;
      delete(payload.namespace);
      try {
        const {data} = yield call(apis.getPosts, payload,'getPosts', 'userAccredit');
        if(data.code==200){
          for(let i=0;i<data.data.list.length;i++){
            data.data.list[i]['title'] = data.data.list[i]['postName'];
            data.data.list[i]['key'] = data.data.list[i]['id'];
            data.data.list[i]['value'] = data.data.list[i]['id'];
            data.data.list[i]['nodeName'] = data.data.list[i]['postName'];
            data.data.list[i]['nodeId'] = data.data.list[i]['id'];
            data.data.list[i]['nodeType'] ='POST';
          }
          yield put({
            type: `${namespace}/updateStates`,
            payload:{
              originalData:data.data.list
            }
          })
          callback&&callback()
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
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
export default Model;
