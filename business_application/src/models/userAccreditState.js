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
    type: 'USERGROUP',
    ids: 'ugIds',
    action: 'getUsergroupByIds',
    list: 'list',
    idKey: 'id',
    nameKey: 'ugName',
  },
  {
    type: 'ORG',
    ids: 'orgIds',
    action: 'getOrgByIds',
    list: 'list',
    idKey: 'id',
    nameKey: 'orgName',
  },
  {
    type: 'POST',
    ids: 'postIds',
    action: 'getPostByIds',
    list: 'list',
    idKey: 'id',
    nameKey: 'postName',
  },
  {
    type: 'DEPT',
    ids: 'deptIds',
    action: 'getDeptByIds',
    list: 'list',
    idKey: 'id',
    nameKey: 'deptName',
  },
  {
    type: 'RULE',
    ids: 'roleIds',
    action: 'getRuleByIds',
    list: 'list',
    idKey: 'id',
    nameKey: 'roleName',
  },
];
const Model = {
  namespace: 'userAccreditState',
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {});
    },
  },
  effects: {
    //查询用户
    *queryUser({ payload,callback }, { call, put, select }) {
      const { data } = yield call(apis.queryUser, payload, '', 'userAccreditState');
      if (data.code == 200) {
        callback&&callback(data.data.list);
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取用户组列表
    *getUgs({ payload,callback}, { call, put, select }) {
      try {
        const { data } = yield call(apis.getUgs, payload);
        if (data.code == 200) {
          let list = data.data.list;
          for (let i = 0; i < list.length; i++) {
            list[i]['nodeName'] = list[i]['ugName'];
            list[i]['nodeId'] = list[i]['id'];
          }
          callback&&callback(list)
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //获取单位角色
    *getSysRoles({ payload,callback }, { call, put, select }) {
      const { data } = yield call(
        apis.getSysRoles,
        payload,
        '',
        'userAccreditState',
      );
      if (data.code == 200) {
        callback&&callback(data.data.list)
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //
    *getSelectedDatas({ payload,callback }, { call, put, select }) {
      let orgUserType = payload.orgUserType;
      let curAction = getActionByType.filter(
        (item) => item.type == orgUserType,
      );
      let newPayload = {};
      newPayload[curAction[0].ids] = payload.selectedDataIds.join(',');
      if (curAction[0].action == 'getUsersByIds') {
        newPayload.start = 1;
        newPayload.limit = 1000;
      }
      const { data } = yield call(
        apis[curAction[0].action],
        newPayload,
        '',
        'userAccreditState',
      );
      if (data.code == 200) {
        let selectedDatas = data.data[curAction[0].list];
        selectedDatas?.forEach((item) => {
          item.nodeId = item[curAction[0].idKey];
          item.nodeName = item[curAction[0].nameKey];
        });
        callback&&callback(selectedDatas)
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getPosts({ payload,callback }, { call, put, select }) {
      let namespace = payload.namespace;
      delete(payload.namespace);
      try {
        const {data} = yield call(apis.getPosts, payload);
        if(data.code==200){
          for(let i=0;i<data.data.list.length;i++){
            data.data.list[i]['title'] = data.data.list[i]['postName'];
            data.data.list[i]['key'] = data.data.list[i]['id'];
            data.data.list[i]['value'] = data.data.list[i]['id'];
            data.data.list[i]['nodeName'] = data.data.list[i]['postName'];
            data.data.list[i]['nodeId'] = data.data.list[i]['id'];
            data.data.list[i]['nodeType'] ='POST';
          }
          callback&&callback(data.data.list)
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
