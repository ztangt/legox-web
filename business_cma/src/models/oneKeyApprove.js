import { REQUEST_SUCCESS } from '@/service/constant';
import { message } from 'antd';
import apis from 'api';
import { v4 as uuidv4 } from 'uuid';

const loopKey = (array, children, nodeKey) => {
    for (var i = 0; i < array.length; i++) {
        if (nodeKey == array[i]['key']) {
            array[i]['children'] = children;
        } else if (array[i].children && array[i].children.length != 0) {
            loopKey(array[i].children, children, nodeKey);
        }
    }
    return array;
};

export default {
    namespace: 'oneKeyApprove',
    state: {
        taskNodes: {},
        tableData: [],
        taskActChooseModal: {
            bizTaskId: '',
            actType: '',
            taskActList: [],
            selectedActIds: [],
        },
        submitModal: false, // 选人框是否展示
        treeData: [],
        selectNodeUser: [],
        searchUserList: [],
    },
    subscriptions: {
        setup({ dispatch, history }, { call, select }) {
            history.listen((location) => {});
        },
    },
    effects: {
        *getTaskNodes({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.getFastSendTaskNodes, payload);
            console.log('getTaskNodes -> ', data);
            if (data.code == REQUEST_SUCCESS) {
                // yield put({
                //   type: 'updateStates',
                //   payload: {
                //     taskNodes: data.data
                //   }
                // })
                callback && callback(data.data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                return message.error(data.msg);
            }
        },

        //流程送交
        *processSend({ payload, callback }, { call, put, select }) {
            console.log('send -> ', payload);
            //payload.headers = cutomHeaders; //需要在headers中添加参数
            const { data } = yield call(apis.processSend, payload);
            if (data.code == 200) {
                //message.success(data.msg);
                callback && callback(data.code, data.msg);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                callback && callback(data.code, data.msg);
                //return message.error(data.msg);
            }
        },

        *getUsersByIds({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.getUsersByIds, payload);
            console.log('getUsersByIds -> ', data);
            if (data.code == REQUEST_SUCCESS) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        selectNodeUser: data.data.list,
                    },
                });
                //callback&&callback(data.data.users);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                return message.error(data.msg);
            }
        },
        //获取全部组结构
        *getGroupList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.getSendUserTree, payload);
            if (data.code == 200) {
                //增加key,相同的数展开收起不影响
                data.data?.['ORG']?.map((item) => {
                    item.key = uuidv4();
                });
                data.data?.['ROLE']?.map((item) => {
                    item.key = uuidv4();
                });
                data.data?.['CUSTOM']?.map((item) => {
                    item.key = uuidv4();
                });
                yield put({
                    type: 'updateStates',
                    payload: {
                        // firstGroupData: firstGroupData,
                        groupData: data.data, //组数据
                        treeData: data.data?.['ORG'] || [], //默认第一个
                        groupActiveKey: 'ORG', //默认第一个
                    },
                });
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                return message.error(data.msg);
            }
        },
        //获取该节点的子数据
        *getSubordinateSendTree({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.getSubordinateSendTree, payload);
            const { treeData } = yield select((state) => state.oneKeyApprove);
            if (data.code == 200) {
                if (data.data?.list && data.data.list.length != 0) {
                    data.data?.list &&
                        data.data.list[0].map((item) => {
                            item.key = uuidv4();
                        });
                    let newTreeData = loopKey(treeData, data.data.list[0], payload.nodeKey);
                    yield put({
                        type: 'updateStates',
                        payload: {
                            treeData: newTreeData,
                            //expandedKeys: payload.nodeId ? expandedKeys : [], //请求根节点时，清空已展开的节点
                        },
                    });
                }
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                return message.error(data.msg);
            }
        },
        *queryUsers({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.queryUser, payload);
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        userList: data.data.list,
                        searchUserList: data.data.list,
                        originalData: data.data.list, //用于传阅
                        oldOriginalData: data.data.list,
                    },
                });
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                return message.error(data.msg);
            }
        },
        *getPostUserList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.getPostUserList, payload);
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        userList: data.data.list,
                        searchUserList: data.data.list,
                    },
                });
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                return message.error(data.msg);
            }
        },
        *getGroupUserList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.getGroupUserList, payload);
            if (data.code == 200) {
                //返回的格式不符合要求，做截取
                data.data.list.map((item) => {
                    let deptNames = item.deptName ? item.deptName.split('>') : '';
                    item.deptName = deptNames ? deptNames[deptNames.length - 1] : '';
                    item.identity = item.postName;
                });
                yield put({
                    type: 'updateStates',
                    payload: {
                        userList: data.data.list,
                        searchUserList: data.data.list,
                    },
                });
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                return message.error(data.msg);
            }
        },
        *getRoleUserList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.getRoleUserList, payload);
            if (data.code == 200) {
                data?.data?.list.map((item) => {
                    item.identity = item.postName;
                });
                yield put({
                    type: 'updateStates',
                    payload: {
                        userList: data?.data?.list || [],
                        searchUserList: data?.data?.list || [],
                    },
                });
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                return message.error(data.msg);
            }
        },
        //查询自定送交人员
        *getCustomUserList({ payload }, { call, put, select }) {
            const { data } = yield call(apis.getCustomUserList, payload);
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        userList: data?.data?.list || [],
                        searchUserList: data?.data?.list || [],
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                return message.error(data.msg);
            }
        },
        *getSearchSendTree({ payload }, { call, put, select }) {
            const { data } = yield call(apis.getSearchSendTree, payload);
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        treeData: data.data.list,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                return message.error(data.msg);
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
