import { message } from 'antd';
import apis from 'api';
import { DEFAULT_ALL_GROUP_CODE } from '../../service/constant';
export default {
  namespace: 'workRule',
  state: {
    workRuleList: [],
    bizSolData: [],
    bizSolIds: '',
    selectWorkRuleInfo: {}, //用于判断是否是全部
    workRuleInfo: {},
    defaultBizSolCheckKeys: [],
    allRoleList: [],
    roleListTarget: [],
    leftNum:220
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen(location => {});
    },
  },
  effects: {
    // 保存角色
    *saveWorkRuleRole({payload,callback},{call,put,select}){
      const {data} = yield call(apis.saveWorkRule,payload)
      if(data.code == 200){
        callback&&callback(data)
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },

    // 根据角色获取列表
    *getWorkRuleAllRole({payload,callback},{call,put,select}){
      const {data} = yield call(apis.getAllWorkRule,payload)
      if(data.code == 200){
        const roleList =data.data&&data.data.list&&data.data.list.length>0&&data.data.list.map(item=>{
          item.key = item.id
          item.title = item.roleName
          return item
        }) ||[]
        yield put({
          type: 'updateStates',
          payload: {
            allRoleList: roleList
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    // 根据事件规则id获取角色列表
    *getWorkRuleById({payload,callback},{call,put,select}){
      const {data} = yield call(apis.getWorkRuleById,payload)
      if(data.code == 200){ 
        const roleList =data.data.list.map(item=>{
          return item.roleId
        }) ||[]
        callback&&callback()
        yield put({
          type: 'updateStates',
          payload: {
            roleListTarget: roleList
          }
        })
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },

    *getWorkRule({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getWorkRule, payload);
      if (data.code == 200) {
        let workRuleList = [];
        //首项添加全部前端写死
        workRuleList.unshift({
          title: '全部',
          groupCode:'R0000',
          groupHide: 0,
          disableCheckbox: true,
          children: null,
          key: '1777887666778166122355665'
        })
        if (data.data.list.length > 0) {
          data.data.list.forEach(item => {
            workRuleList.push({
              title: item.groupName,
              key: item.workRuleId,
              groupHide: item.groupHide,
              groupName: item.groupName,
              groupCode: item.groupCode,
              disableCheckbox:
                item.groupCode != DEFAULT_ALL_GROUP_CODE ? false : true,
              children: null,
            });
          });
        }

        yield put({
          type: 'updateStates',
          payload: {
            workRuleList: workRuleList,
          },
        });
        callback && callback(workRuleList.length ? workRuleList[0] : []);
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getBizSolTree({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getBizSolTree, payload);
      if (data.code == 200) {
        //循环出全部的业务的id
        const loopBizSolIds = (tree, ids) => {
          // console.log("tree_ids",tree,"tree=0",ids)
          if (!tree || tree.length === 0) {
            return ids;
          }
          tree.map(item => {
            ids.push(item.nodeId);
            if (item.children && item.children.length) {
              loopBizSolIds(item.children, ids);
            }
          });
          return ids;
        };
        let defaultBizSolCheckKeys = loopBizSolIds(data.data.list, []);
        // console.log("defaultBizo",defaultBizSolCheckKeys)
        yield put({
          type: 'updateStates',
          payload: {
            bizSolData: data?.data?.list || [],
            defaultBizSolCheckKeys: defaultBizSolCheckKeys, //默认全部选中
          },
        });
        callback && callback(defaultBizSolCheckKeys);
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getBizSolRule({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getBizSolRule, payload);
      if (data.code == 200) {
        callback && callback(data.data);
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *updateGroupName({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.updateGroupName, payload);
      if (data.code == 200) {
        message.success('更新成功');
        const { workRuleList } = yield select(state => state.workRule);
        workRuleList.map(item => {
          if (item.key == payload.workRuleId) {
            if (typeof payload.groupName != 'undefined') {
              item.title = payload.groupName;
            }
            if (typeof payload.groupHide != 'undefined') {
              item.groupHide = payload.groupHide;
            }
          }
        });
        console.log('workRuleList=', workRuleList);
        yield put({
          type: 'updateStates',
          payload: {
            workRuleList: workRuleList,
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *addGroupName({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.addGroupName, payload);
      if (data.code == 200) {
        message.success('保存成功');
        //重新获取
        yield put({
          type: 'getWorkRule',
          // payload: {
          //   start: 1,
          //   limit: 100,
          //   searchWord: '',
          // },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *deleteGroup({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.deleteGroup, payload);
      if (data.code == 200) {
        message.success('删除成功');
        const { workRuleList, selectWorkRuleInfo } = yield select(
          state => state.workRule,
        );
        let newSelectWorkRuleInfo = {};
        let newWorkRuleList = [];
        workRuleList.map(item => {
          if (item.groupCode == DEFAULT_ALL_GROUP_CODE) {
            newSelectWorkRuleInfo = item;
          }
          if (!payload.workRuleIds.split(',').includes(item.key)) {
            newWorkRuleList.push(item);
          }
        });
        if (payload.workRuleIds.split(',').includes(selectWorkRuleInfo.key)) {
          //删除的包含当前选中的则默认选中全面
          yield put({
            type: 'updateStates',
            payload: {
              selectWorkRuleInfo: newSelectWorkRuleInfo,
            },
          });
        }
        yield put({
          type: 'updateStates',
          payload: {
            workRuleList: newWorkRuleList,
          },
        });
        //重新获取
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *saveRuleBizSol({ payload }, { call, put, select }) {
      const { data } = yield call(apis.saveRuleBizSol, payload);
      if (data.code == 200) {
        message.success('保存成功');
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
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
