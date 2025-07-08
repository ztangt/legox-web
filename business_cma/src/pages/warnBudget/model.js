import { message } from 'antd';
import apis from 'api';
import mockInfo from './mock.js';
const { more_contract_camsContractNum, findLoginUserByIdAndRoleId } = apis;

export default {
    namespace: 'warnBudget',
    state: {
        list: [],
        currentHeight: 0,
        limit: 0,
        returnCount: 0,
        currentPage: 0,
        allPages: 0,
        formInfo: {
            // isProgress: '',
            // isExecute: '',
            // orgId: '',
        }, //表单信息

        loading: true,
        orgList: [], //管理单位
        progressList: [
            { value: 0, label: '全部' },
            { value: 1, label: '是' },
            { value: 2, label: '否' },
        ], //进度列表
        executeList: [
            { value: 0, label: '全部' },
            { value: 1, label: '是' },
            { value: 2, label: '否' },
        ], //执行列表

        numberInfo: {}, //不同状态的预警数目
    },

    effects: {
        *getList({ payload, callback }, { call, put, select }) {
            console.log(payload, '获取风险预警→项目建设内容列表');
            // const { data } = yield call(getBusinessCardList, payload, 'getList', 'warnBudget');
            const data = mockInfo;
            yield put({
                type: 'updateStates',
                payload: { loading: false },
            });
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        list: data.data.list,
                        returnCount: data.data.returnCount * 1,
                        allPage: data.data.allPage * 1,
                        currentPage: data.data.currentPage * 1,
                    },
                });
            } else {
                message.error(data.msg);
            }
        },
        //获取管理单位
        *getOrgList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(findLoginUserByIdAndRoleId, payload, 'getOrgList', 'warnBudget');
            if (data.code == 200) {
                let list = data.data?.list || [];
                let allInfo = { value: '', label: '全部' };
                let newList = list.map((item) => ({ ...item, value: item.orgId, label: item.orgName }));
                yield put({
                    type: 'updateStates',
                    payload: {
                        orgList: [allInfo, ...newList],
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //查询不同状态的合同数目
        *getNumberInfo({ payload, callback }, { call, put, select }) {
            try {
                // const { data } = yield call(more_contract_camsContractNum, payload, 'getNumberInfo', 'warnBudget');
                const data = {
                    code: '200',
                    msg: '请求成功',
                    data: {
                        total: 0,
                        contractApprove: 0,
                        contractSeal: 0,
                        contractUnSeal: 0,
                    },
                };
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            numberInfo: data.data || {},
                        },
                    });
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
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
