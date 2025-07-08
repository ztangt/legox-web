import { message } from 'antd';
import apis from 'api';
import { DEFAULTCOLUMN } from '../service/constant';
const Model = {
    namespace: 'work',
    state: {},
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {});
        },
    },
    effects: {
        //高级查询-自定义查询条件获取/bpm/work/search
        *getWorkSearch({ payload, namespace, callback }, { call, put }) {
            const { data } = yield call(apis.getWorkSearch, payload, '', 'work');
            if (data.code == 200) {
                //searchColumnCodes为空时赋值默认
                console.log('data123=', data);
                let searchColumnCodes =
                    typeof data.data.searchColumnCodes != 'undefined' && data.data.searchColumnCodes
                        ? data.data.searchColumnCodes.split(',')
                        : [];
                if (!searchColumnCodes.length) {
                    searchColumnCodes = DEFAULTCOLUMN[payload.taskType].split(',');
                }
                // console.log('searchColumnCodes=',searchColumnCodes);
                // yield put({
                //   type:`${namespace}/updateStates`,
                //   payload:{
                //     searchColumnCodes:searchColumnCodes,
                //     oldSearchColumnCodes:searchColumnCodes,
                //     listColumnCodes:typeof data.data.listColumnCodes!='undefined'&&data.data.listColumnCodes?data.data.listColumnCodes.split(','):[],
                //   }
                // })
                if (typeof callback == 'function') {
                    callback(
                        searchColumnCodes,
                        typeof data.data.listColumnCodes != 'undefined' && data.data.listColumnCodes
                            ? data.data.listColumnCodes.split(',')
                            : [],
                    );
                }
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg, 5);
            }
        },
        *saveSearchCol({ payload, namespace, callback }, { call, put }) {
            const { data } = yield call(apis.saveSearchCol, payload, '', 'work');
            if (data.code == 200) {
                console.log('payload=', payload);
                if (typeof callback == 'function') {
                    callback();
                }
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg, 5);
            }
        },
        //获取业务应用类别树
        *getCtlgTree({ payload, namespace }, { call, put, select }) {
            const { data } = yield call(apis.getCtlgTree, payload, 'getCtlgTree', 'work');
            if (data.code == 200) {
                yield put({
                    type: `${namespace}/updateStates`,
                    payload: {
                        ctlgTree: data.data,
                    },
                });
            } else {
                message.error(data.msg);
            }
        },
        *getBusinessList({ payload, namespace }, { call, put, select }) {
            const { data } = yield call(apis.getBusinessList, payload, 'getBusinessList', 'work');
            if (data.code == 200) {
                yield put({
                    type: `${namespace}/updateStates`,
                    payload: {
                        businessList: data.data.list,
                    },
                });
            } else {
                message.error(data.msg);
            }
        },
        //事项规则
        *getWorkRule({ payload, namespace, callback }, { call, put, select }) {
            const { data } = yield call(apis.getWorkRule, payload, 'getWorkRule', 'work');
            console.log('namespace=', namespace);
            if (data.code == 200) {
                let workRules = [];
                data.data.list.unshift({
                    title: '全部',
                    groupName: '全部',
                    groupCode: 'R0000',
                    workRuleId: '1777887666778166122355665',
                    groupHide: 0,
                });
                //去掉隐藏数据
                data.data.list.map((item) => {
                    if (item.groupHide != 1) {
                        workRules.push(item);
                    }
                });
                callback &&
                    callback(
                        workRules,
                        workRules.length ? workRules[0].groupCode : '',
                        workRules.length ? workRules[0].workRuleId : '',
                    );
                // yield put({
                //   type:`${namespace}/updateStates`,
                //   payload:{
                //     workRules:workRules,
                //     groupCode:workRules.length?workRules[0].groupCode:"",
                //     workRuleId:workRules.length?workRules[0].workRuleId:"",
                //   }
                // })
                //callback&&callback(workRules)
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
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
export default Model;
