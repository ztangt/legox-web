import { message } from 'antd';
import apis from 'api';
const { getRemunerationList, getRemunerationNoPay, payment, getPaymentAmount } = apis;

export default {
    namespace: 'remuneration',
    state: {
        limit: 10,
        allPages: 0,
        returnCount: 0,
        currentPage: 0,
        currentHeight: 0,
        list: [],
        accountType: '',
        businessDate: '',
        selectList: [], // 配置分类列表
        accountList: [],
        manageOrg: '', // 管理单位搜
        accountOrg: '', // 账户管理搜索
        paymentAmount: {}, //支付成功失败金额
        mainTableId: '', // 单据编号
        searchWord: '', // 查询结果
    },
    effects: {
        *getRemunerationList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getRemunerationList, payload, '', 'remuneration');
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            list: data.data.list,
                            returnCount: data.data.returnCount,
                            allPage: data.data.allPage,
                            currentPage: data.data.currentPage,
                        },
                    });
                }
            } catch (e) {}
        },
        // 下拉框
        *getRemunerationNoPay({ payload, callback }, { call, put, select }) {
            // debugger;
            const { data } = yield call(getRemunerationNoPay, payload, '', 'remuneration');
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        selectList: data.data.list,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                // debugger;
                message.error(data.msg);
            }
        },
        //支付
        *payment({ payload, callback }, { call, put, select }) {
            // debugger;
            const { data } = yield call(payment, payload, '', 'remuneration');
            callback && callback(data);
        },
        // 获取 总金额 支付成功 与失败金额
        *getPaymentAmount({ payload, callback }, { call, put, select }) {
            // debugger;

            const { data } = yield call(getPaymentAmount, payload, '', 'remuneration');
            callback && callback(data.data);

            // let data = {
            //   total: 123,
            //   isPay: 456,
            //   noPay: 789,
            // };
            // callback && callback(data);
            // yield put({
            //   type: 'updateStates',
            //   payload: {
            //     paymentAmount: {
            //       total: 123,
            //       isPay: 456,
            //       noPay: 789,
            //     },
            //   },
            // });
            // const { data } = yield call(getPaymentAmount, payload);
            // if (data.code == 200) {
            //   yield put({
            //     type: 'updateStates',
            //     payload: {
            //       selectList: data.data.list,
            //     },
            //   });
            // } else if (data.code != 401 && data.code != 419 && data.code != 403) {
            //   debugger;
            //   message.error(data.msg);
            // }
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
