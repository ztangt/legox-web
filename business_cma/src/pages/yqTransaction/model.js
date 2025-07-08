import { message } from 'antd';
import apis from 'api';

const {
    more_qy_getUnitList,
    more_qy_getAccountList,
    more_qy_getBaTranList,
    more_qy_getZbaTranList,
    more_qy_exportBaTranList,
    more_qy_exportZbaTranList,
} = apis;

export default {
    namespace: 'yqTransaction',
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
                const { data } = yield call(more_qy_getUnitList, {}, 'getUnitList', 'yqTransaction');
                if (data.code == 200 && data.data) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            unitList: data.data?.list || [],
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
                const { data } = yield call(more_qy_getAccountList, payload, 'getAccList', 'yqTransaction');
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
            const { cutomHeaders } = yield select((state) => state.yqTransaction);

            console.log('银企交易明细获取列表', { ...formData, headers: cutomHeaders });
            try {
                const { data } = yield call(
                    isZero == 1 ? apis.more_qy_getZbaTranList : apis.more_qy_getBaTranList,
                    { ...formData, headers: cutomHeaders },
                    'getList',
                    'yqTransaction',
                );
                yield put({
                    type: 'updateStates',
                    payload: {
                        loading: false,
                        isZero: isZero,
                    },
                });
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            list: data?.data || [],
                            formData: formData,
                        },
                    });
                } else {
                    message.error(data.msg || '查询失败，请重试');
                }
            } catch (e) {}
        },
        // 导出
        *exportExcel({ payload, callback }, { call, put, select }) {
            let { isZero, formData } = payload;
            const { cutomHeaders } = yield select((state) => state.yqTransaction);
            formData.headers = cutomHeaders;
            const { data } = yield call(
                isZero == 1 ? apis.more_qy_exportZbaTranList : apis.more_qy_exportBaTranList,
                formData,
                'exportExcel',
                'yqTransaction',
            );
            yield put({
                type: 'updateStates',
                payload: {
                    loading: false,
                },
            });
            if (data.code == 200) {
                window.open(data.data, '_blank');
                message.success('导出成功');
            } else {
                message.error(data.msg || '导出失败，请重试');
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
