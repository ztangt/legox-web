import { message } from 'antd';
import apis from 'api';

const {
    more_qy_getUnitList,
    more_qy_getAccountList,

    more_qy_getBaBalanList,
    more_qy_getZbaBalanList,
} = apis;

export default {
    namespace: 'yqBalance',
    state: {
        currentHeight: 0,

        unitList: [], //单位列表,
        accList: [], //账户列表,
        list: [], //表格列表
        limit: 10,
        currentPage: 0,
        allPages: 0,
        returnCount: 0,

        isZero: null, //是否零余额，1是0否
        formData: {}, //查询条件
        loading: false,
        cutomHeaders: {},
    },
    effects: {
        //获取单位列表
        *getUnitList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(more_qy_getUnitList, {}, 'getUnitList', 'yqBalance');
                if (data.code == 200 && data.data) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            unitList: data.data.list || [],
                        },
                    });
                } else {
                    message.error(data.msg || '查询失败，请重试');
                }
            } catch (e) {}
        },
        //获取账户列表
        *getAccList({ payload, callback }, { call, put, select }) {
            let { belongOrgId } = payload;
            payload.headers = { orgId: belongOrgId }; //需要在headers中添加参数
            console.log(payload, '----->获取账户列表的参数');
            try {
                const { data } = yield call(more_qy_getAccountList, payload, 'getAccList', 'yqBalance');
                if (data.code == 200) {
                    let list = Array.isArray(data.data) ? data.data : [];
                    yield put({
                        type: 'updateStates',
                        payload: {
                            accList: list,
                        },
                    });
                } else {
                    message.error(data.msg || '请求错误，请重试');
                }
            } catch (e) {}
        },
        //查询
        *getList({ payload, callback }, { call, put, select }) {
            let { isZero, formData } = payload;
            const { cutomHeaders } = yield select((state) => state.yqBalance);
            console.log({ ...formData, headers: cutomHeaders }, '----->获取账户余额与额度查询列表');

            try {
                const { data } = yield call(
                    isZero == 1 ? more_qy_getZbaBalanList : more_qy_getBaBalanList,
                    { ...formData, headers: cutomHeaders },
                    'getList',
                    'yqBalance',
                );
                yield put({
                    type: 'updateStates',
                    payload: {
                        loading: false,
                    },
                });
                if (data.code == 200 && data.data) {
                    console.log(data.data, '----->data.data');
                    yield put({
                        type: 'updateStates',
                        payload: {
                            list: data.data,
                            isZero: isZero,
                            formData: formData,
                        },
                    });
                } else {
                    message.error(data.msg || '查询失败，请重试');
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
