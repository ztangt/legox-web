import { message } from 'antd';
import apis from 'api';
const { getRemunerationList, exportRemuneration, getRemunerationPay, getPaymentAmount, payment } = apis;

export default {
    namespace: 'remunerationPay',
    state: {
        limit: 10,
        allPages: 0,
        returnCount: 0,
        currentPage: 0,
        currentHeight: 0,
        list: [],
        accountType: '',
        businessDate: '',
        searchWord: '',
        mainTableId: '',
        selectList: [], // 配置分类列表
        accountList: [],
        manageOrg: '', // 管理单位搜
        accountOrg: '', // 账户管理搜索
        payList: [], //支付成功失败金额
    },
    effects: {
        // 支付成功/支付失败
        *paymentStatus({ payload, callback }, { call, put, select }) {
            const { data } = yield call(payment, payload, 'paymentStatus', 'remunerationPay');
            if (data.code == 200) {
                callback && callback(data);
                message.success('修改成功');
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        *getRemunerationList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getRemunerationList, payload, '', 'remunerationPay');
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
        // // 下拉框
        // *getRemunerationNoPay({ payload, callback }, { call, put, select }) {
        //   // debugger;
        //   const { data } = yield call(getRemunerationNoPay, payload);
        //   if (data.code == 200) {
        //     yield put({
        //       type: 'updateStates',
        //       payload: {
        //         selectList: data.data.list,
        //       },
        //     });
        //   } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        //     // debugger;
        //     message.error(data.msg);
        //   }
        // },
        // 下拉框
        *getRemunerationPay({ payload, callback }, { call, put, select }) {
            // debugger;
            const { data } = yield call(getRemunerationPay, payload, '', 'remunerationPay');
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        payList: data.data.list,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                // debugger;
                message.error(data.msg);
            }
        },
        // 获取 总金额 支付成功 与失败金额
        *getPaymentAmount({ payload, callback }, { call, put, select }) {
            const { data } = yield call(getPaymentAmount, payload, '', 'remunerationPay');
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
        *exportRemuneration({ payload, callback }, { call, put, select }) {
            const { data } = yield call(exportRemuneration, payload, '', 'remunerationPay');
            callback && callback(data);
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
