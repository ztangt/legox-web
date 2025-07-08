import { message } from 'antd';
import apis from 'api';
import dayjs from 'dayjs';
const { getDayInOutList, generateDayInOutList, exportDayInOutList, findLoginUserByIdAndRoleId, againCreateDayInOut } =
    apis;

export default {
    namespace: 'cashDayInOut',
    state: {
        loading: true,
        confirmLoading: false,
        limit: 0,
        allPages: 0,
        returnCount: 0,
        currentPage: 0,
        currentHeight: 0,
        list: [],
        formInfo: {
            businessDate: dayjs().format('YYYY-MM-DD'),
        },
        orgList: [],
    },
    effects: {
        //获取管理单位
        *findLoginUserByIdAndRoleId({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                findLoginUserByIdAndRoleId,
                payload,
                'findLoginUserByIdAndRoleId',
                'cashDayInOut',
            );
            if (data.code == 200) {
                let list = data.data?.list || [];
                yield put({
                    type: 'updateStates',
                    payload: {
                        orgList: list.map((item) => ({ ...item, value: item.orgId, label: item.orgName })),
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },

        //现金日收支列表查询
        *getList({ payload, callback }, { call, put, select }) {
            console.log(payload, '-------->现金日收支列表查询参数');
            try {
                const { data } = yield call(getDayInOutList, payload, 'getList', 'cashDayInOut');
                yield put({
                    type: 'updateStates',
                    payload: {
                        loading: false,
                    },
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
                }
            } catch (e) {}
        },
        //生成现金日收支明细报表
        *generateDayInOutList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(generateDayInOutList, payload, '', 'cashDayInOut');
                yield put({
                    type: 'updateStates',
                    payload: {
                        loading: false,
                        confirmLoading: false,
                    },
                });
                if (data.code == 200) {
                    callback && callback(data.data);
                } else {
                    message.warning(data.msg || '请求失败');
                }
            } catch (e) {}
        },
        //生成现金日收支明细报表
        *againCreateDayInOut({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(againCreateDayInOut, payload, '', 'cashDayInOut');
                yield put({
                    type: 'updateStates',
                    payload: {
                        loading: false,
                        confirmLoading: false,
                    },
                });
                if (data.code == 200) {
                    callback && callback(data.data);
                } else {
                    message.warning(data.msg || '请求失败');
                }
            } catch (e) {}
        },
        //现金日收支明细导出
        *exportDayInOutList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(exportDayInOutList, payload, '', 'cashDayInOut');
            yield put({
                type: 'updateStates',
                payload: {
                    loading: false,
                },
            });
            if (data.code == 200) {
                callback && callback(data.data);
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
