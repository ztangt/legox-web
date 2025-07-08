import { message } from 'antd';
import apis from 'api';
import { history } from 'umi';
import _ from 'lodash';
export default {
  namespace: 'choiceUser',
  state: {
    bizTaskNodes: {},
    checkNodeIds: [],
    groupData: {}, //组数据
    treeData: [], //默认第一个
    userList: [],
    searchUserList: [],
    taskActList: [],
    currentNodeId: '',
    returnCount: 0,
    commentList: [],
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
        console.log('location',location);
        if(location?.location?.pathname=="/business_application/mobile/choiceUser"){
          dispatch({
            type: 'updateStates',
            payload:{
              bizTaskNodes: {},
              checkNodeIds: [],
              groupData: {}, //组数据
              treeData: [], //默认第一个
              userList: [],
              searchUserList: [],
              taskActList: [],
              currentNodeId: '',
              returnCount: 0,
            }
          })
        }
      });
    },
  },
  effects: {
    //获取任务办理送交环节
    *getTaskDealNode({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getTaskDealNode, payload);
        if (data.code == 200) {
          var taskActList = _.cloneDeep(data.data.taskActList) ||[]
          if(taskActList?.length){
            taskActList[0].isChecked = true
          }
          yield put({
            type: 'updateStates',
            payload: {
              bizTaskNodes: data.data,
              checkNodeIds: data.data.taskActList.length
                ? data.data.taskActList[0].actId
                : [],
              taskActList,
            },
          });
          callback && callback(data.data.taskActList,data.data);
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (error) {
        console.log('error', error);
      }
    },
    *getSearchSendTree({ payload }, { call, put, select }) {
      const { data } = yield call(
        apis.getSearchSendTree,
        payload,
        '',
        'choiceUser',
      );
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            treeData: data?.data?.list,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取全部组结构
    *getGroupList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(
        apis.getSendUserTree,
        payload,
        '',
        'choiceUser',
      );
      if (data.code == 200) {
        // data.data?.['ORG']?.map((item) => {
        //   item.key = uuidv4();
        // });
        // data.data?.['ROLE']?.map((item) => {
        //   item.key = uuidv4();
        // });
        // data.data?.['CUSTOM']?.map((item) => {
        //   item.key = uuidv4();
        // });

        // var nodeId = data.data?.['ORG']?.[0]?.nodeId;

        // if(!nodeId){
        //   nodeId = data.data?.['ROLE']?.[0]?.nodeId
        // }
        // if(!nodeId){
        //   nodeId = data.data?.['CUSTOM']?.[0]?.nodeId
        // }
        // console.log('nodeId', nodeId);
        // if (nodeId) {
        //   yield put({
        //     type: 'queryUser',
        //     payload: {
        //       start: 1,
        //       limit: 24,
        //       orgId: nodeId,
        //       //deptId
        //     },
        //   });
        // }
        yield put({
          type: 'updateStates',
          payload: {
            groupData: data.data, //组数据
            // treeData: data.data?.['ORG'] || [], //默认第一个
            // currentNodeId: nodeId,
          },
        });
        callback && callback(data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *queryUser({ payload, callback }, { call, put, select }) {
      try {
        const { userList, searchUserList } = yield select(
          (state) => state.choiceUser,
        );
        const { data } = yield call(apis.queryUser, payload, '', 'choiceUser');
        if (data.code == 200) {
          yield put({
            type: 'updateStates',
            payload: {
              userList:
                payload?.start != 1
                  ? [...userList, ...data?.data?.list]
                  : data?.data?.list,
              returnCount: data?.data?.returnCount,
              currentPage: data?.data?.currentPage,
              searchUserList:
                payload?.start != 1
                  ? [...userList, ...data?.data?.list]
                  : data?.data?.list,
            },
          });
          callback && callback(data?.data?.list || []);
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getRoleUserList({ payload, callback }, { call, put, select }) {
      const { userList, searchUserList } = yield select(
        (state) => state.choiceUser,
      );
      const { data } = yield call(
        apis.getRoleUserList,
        payload,
        '',
        'choiceUser',
      );
      if (data.code == 200) {
        // data?.data?.list.map((item) => {
        //   item.identity = item.postName;
        // });
        yield put({
          type: 'updateStates',
          payload: {
            userList:data?.data?.list||[],
            searchUserList: data?.data?.list||[],
          },
        });
        callback && callback(data?.data?.list || []);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //查询自定送交人员
    *getCustomUserList({ payload,callback }, { call, put, select }) {
      const { userList, searchUserList } = yield select(
        (state) => state.choiceUser,
      );
      const { data } = yield call(
        apis.getCustomUserList,
        payload,
        '',
        'choiceUser',
      );
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            userList:data?.data?.list||[],
            searchUserList: data?.data?.list||[],
          },
        });
        callback && callback(data?.data?.list || []);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getPostUserList({ payload, callback }, { call, put, select }) {
      const { userList, searchUserList } = yield select(
        (state) => state.choiceUser,
      );
      const { data } = yield call(
        apis.getPostUserList,
        payload,
        '',
        'choiceUser',
        {callback:callback}
      );
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            userList:
            payload?.start != 1
              ? [...userList, ...data?.data?.list]
              : data?.data?.list,
          returnCount: data?.data?.returnCount,
          currentPage: data?.data?.currentPage,
          searchUserList:
            payload?.start != 1
              ? [...userList, ...data?.data?.list]
              : data?.data?.list,
          },
        });
        callback && callback(data?.data?.list || []);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getGroupUserList({ payload, callback }, { call, put, select }) {
      const { userList, searchUserList } = yield select(
        (state) => state.choiceUser,
      );
      const { data } = yield call(
        apis.getGroupUserList,
        payload,
        '',
        'choiceUser',
        {callback:callback}
      );
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            userList:data?.data?.list||[],
            searchUserList: data?.data?.list||[],
          },
        });
        callback && callback(data?.data?.list || []);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //根据身份获取可送交的全局审核人
    *getGlobalCheckerList({payload,callback},{call,put,select}){
      try {
        
      } catch (error) {
        
      }
      const { userList, searchUserList } = yield select(
        (state) => state.choiceUser,
      );
      const {data}=yield call(apis.getGlobalChecker,payload,'','choiceUser',{callback:callback})
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
          //   userList:
          //   payload?.start != 1
          //     ? [...userList, ...data?.data?.list]
          //     : data?.data?.list,
          // returnCount: data?.data?.returnCount,
          // currentPage: data?.data?.currentPage,
          // searchUserList:
          //   payload?.start != 1
          //     ? [...userList, ...data?.data?.list]
          //     : data?.data?.list,
          userList:data?.data?.list||[],
          searchUserList: data?.data?.list||[],
          },
        });
        callback && callback(data?.data?.list || []);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取流程启动送交环节
    *getProcessStartNode({ payload, callback }, { call, put, select }) {
      const { data } = yield call(
        apis.getProcessStartNode,
        payload,
        '',
        'choiceUser',
      );
      
      if (data.code == 200) {
        var taskActList = _.cloneDeep(data.data.taskActList) ||[]
        if(taskActList?.length){
          taskActList[0].isChecked = true
        }
        yield put({
          type: 'updateStates',
          payload: {
            bizTaskNodes: data.data,
            checkNodeIds: data.data.taskActList.length
              ? data.data.taskActList[0].actId
              : [],
            taskActList,
          },
        });
        callback && callback(data.data.taskActList,data.data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //流程启动的时候的送交
    *processStart({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.processStart, payload, '', 'choiceUser');
      if (data.code == 200) {
        message.success(data.msg);
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //流程送交
    *processSend({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.processSend, payload, '', 'choiceUser');
      if (data.code == 200) {
        message.success(data.msg);
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //流程驳回
    *processBack({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.processBack, payload, '', 'choiceUser');
      if (data.code == 200) {
        message.success(data.msg);
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取节点全部默认办理人
    *getDefaultList({payload,callback},{call,put,select}){
      const {data}=yield call(apis.getDefaultList,payload,'','choiceUser',{callback:callback})
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
          userList:data?.data?.list||[],
          searchUserList: data?.data?.list||[],
          },
        });
        callback && callback(data?.data?.list || []);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取暂存手写签批
    *getTemporarySignList({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getTemporarySignList, payload, 'getTemporarySignList', 'choiceUser');
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            commentList: data?.data?.tableColumCodes||[],
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg, 5);
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
