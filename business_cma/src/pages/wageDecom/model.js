import apis from 'api';
import { message } from 'antd';
import _ from 'loadsh';
//增加可展开的节点
const loop = (array, children, nodeId) => {
    for (var i = 0; i < array.length; i++) {
        if (nodeId == array[i]['OBJ_CODE']) {
            array[i]['children'] = children;
        } else if (array[i].children && array[i].children.length != 0) {
            loop(array[i].children, children, nodeId);
        }
    }
    return array;
};
export default {
    namespace: 'wageDecom',
    state: {
        years: [],
        orgs: [],
        wageClasss: [],
        wageMonths: [],
        wageBatchs: [],
        wageItems: [],
        wageInfos: {},
        decomWageInfos: {},
        accountantBizSolId: '', //会计科目的bizSolId
        economicsBizSolId: '', //经济分类的bizSolId
        accountants: [], //会计科目
        economics: [], //经济科目
    },
    effects: {
        //获取年份
        *getBaseDataCodeTable({ payload }, { call, put, select }) {
            const { data } = yield call(apis.getBaseDataCodeTable, payload, '', 'wageDecom');
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        years: data.data.list,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //查询当前登陆人和角色所管理的单位
        *findLoginUserByIdAndRoleId({ payload }, { call, put, select }) {
            const { data } = yield call(apis.findLoginUserByIdAndRoleId, payload, '', 'wageDecom');
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        orgs: data.data.list,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //工资分解-获取工资类别
        *getWageClass({ payload }, { call, put, select }) {
            const { data } = yield call(apis.getWageClass, payload, '', 'wageDecom');
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        wageClasss: data.data.classInfos,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //月份
        *getWageMonth({ payload }, { call, put, select }) {
            const { data } = yield call(apis.getWageMonth, payload, '', 'wageDecom');
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        wageMonths: data.data.months,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //批次
        *getWageBatch({ payload }, { call, put, select }) {
            const { data } = yield call(apis.getWageBatch, payload, '', 'wageDecom');
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        wageBatchs: data.data.batchInfos,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //工资项
        *getWageItems({ payload }, { call, put, select }) {
            const { data } = yield call(apis.getWageItems, payload, '', 'wageDecom');
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        wageItems: data.data.itemInfos,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //工资分解-提取工资明细
        *getExtractWageDetailed({ payload }, { call, put, select }) {
            const { data } = yield call(apis.getExtractWageDetailed, payload, '', 'wageDecom');
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        wageInfos: data.data.wageInfos,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //工资分解-分解工资明细
        *getDecomposeWageDetailed({ payload }, { call, put, select }) {
            const { data } = yield call(apis.getDecomposeWageDetailed, payload, '', 'wageDecom');
            if (data.code == 200) {
                //需要增加state:1后端需要这个接口
                data.data?.wageInfos?.resultList?.map((item) => {
                    item.state = '1';
                });
                yield put({
                    type: 'updateStates',
                    payload: {
                        decomWageInfos: data.data.wageInfos,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //根据逻辑编码获取会计科目的bizSolId
        *getBizSolIdByLogicCode_0014({ payload }, { call, put, select }) {
            const { data } = yield call(
                apis.getBizSolIdByLogicCode,
                payload,
                'getBizSolIdByLogicCode_0014',
                'wageDecom',
            );
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        accountantBizSolId: data.data,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //根据逻辑编码获取经济分类的bizSolId
        *getBizSolIdByLogicCode_0011({ payload }, { call, put, select }) {
            const { data } = yield call(
                apis.getBizSolIdByLogicCode,
                payload,
                'getBizSolIdByLogicCode_0011',
                'wageDecom',
            );
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        economicsBizSolId: data.data,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //根据逻辑编码获取预算指标的bizSolId
        *getBizSolIdByLogicCode_0001({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                apis.getBizSolIdByLogicCode,
                payload,
                'getBizSolIdByLogicCode_0001',
                'wageDecom',
            );
            if (data.code == 200) {
                callback && callback(data.data);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //会计科目
        *getBudgetProjectTree_0014({ payload, callback }, { call, put, select }) {
            let isExpend = payload.isExpend;
            delete payload.isExpend;
            const { data } = yield call(apis.getBudgetProjectTree, payload, 'getBudgetProjectTree_0014', 'wageDecom');
            if (data.code == 200) {
                data.data.list.map((item) => {
                    if (item.isParent == '1') {
                        item.children = [
                            {
                                key: '-1',
                            },
                        ];
                    }
                });
                const { accountants } = yield select((state) => state.wageDecom);
                let tmpAccountants = data.data.list;
                if (isExpend) {
                    tmpAccountants = loop(_.cloneDeep(accountants), data.data.list, payload.parentCode);
                }
                yield put({
                    type: 'updateStates',
                    payload: {
                        accountants: tmpAccountants,
                    },
                });
                console.log('tmpAccountants==', tmpAccountants);
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //经济科目
        *getBudgetProjectTree_0011({ payload, callback }, { call, put, select }) {
            let isExpend = payload.isExpend;
            delete payload.isExpend;
            const { data } = yield call(apis.getBudgetProjectTree, payload, 'getBudgetProjectTree_0011', 'wageDecom');
            if (data.code == 200) {
                const { economics } = yield select((state) => state.wageDecom);
                data.data.list.map((item) => {
                    if (item.isParent == '1') {
                        item.children = [
                            {
                                key: '-1',
                            },
                        ];
                    }
                });
                let tmpEconomics = data.data.list;
                if (isExpend) {
                    tmpEconomics = loop(_.cloneDeep(economics), data.data.list, payload.parentCode);
                }
                console.log('tmpEconomics==', tmpEconomics);
                yield put({
                    type: 'updateStates',
                    payload: {
                        economics: tmpEconomics,
                    },
                });
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //获取报账卡号
        *getNormNuisdictionList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.getNormNuisdictionList, payload, '', 'wageDecom');
            if (data.code == 200) {
                //更新数据
                callback && callback(data.data.list);
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //删除
        *delSalaryDetails({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.delSalaryDetails, payload, '', 'wageDecom');
            if (data.code == 200) {
                //更新数据
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //保存
        *saveData({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.saveData, payload, '', 'wageDecom');
            if (data.code == 200) {
                //更新数据
                callback && callback();
                message.success('保存成功');
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //提取工资数据
        *extractSyncWaPayment({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.extractSyncWaPayment, payload, '', 'wageDecom');
            if (data.code == 200) {
                //更新数据
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //生成工资报销单/生成五险一金报销单
        *generateWageReceipt({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.generateWageReceipt, payload, '', 'wageDecom');
            if (data.code == 200) {
                //更新数据
                message.success('生成成功');
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //同步NCC工资发放项目
        *syncWage({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.syncWage, payload, '', 'wageDecom');
            if (data.code == 200) {
                //更新数据
                message.success('同步成功');
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
