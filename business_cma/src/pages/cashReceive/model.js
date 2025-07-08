import { message } from 'antd';
import apis from 'api';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

const {
    getCashReceiveList,
    getCashReceiveDetail,
    getCashReceiverUserList,
    saveCashReceive,
    findLoginUserByIdAndRoleId,
} = apis;

export default {
    namespace: 'cashReceive',
    state: {
        limit: 0,
        allPages: 0,
        returnCount: 0,
        currentPage: 0,
        currentHeight: 0,
        list: [],
        userList: [], //领用人列表
        detailList: [], //领用详情列表
        formInfo: {
            businessDate: dayjs().format('YYYY-MM-DD'), //业务日期
            searchWord: '', //搜索关键字
        },
        loading: true,
        businessDate: dayjs().format('YYYY-MM-DD'), //业务日期
        manageOrgId: '', //选中的管理单位
        orgList: [], //管理单位
    },
    effects: {
        //获取管理单位
        *findLoginUserByIdAndRoleId({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                findLoginUserByIdAndRoleId,
                payload,
                'findLoginUserByIdAndRoleId',
                'cashReceive',
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

        //领用列表查询
        *getList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getCashReceiveList, payload, 'getList', 'cashReceive');
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
                }
            } catch (e) {}
        },
        //领用详情查询
        *getDetailList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getCashReceiveDetail, payload, 'getDetailList', 'cashReceive');
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            detailList: data.data.list,
                            // returnCount: data.data.returnCount,
                            // allPage: data.data.allPage,
                            // currentPage: data.data.currentPage,
                        },
                    });
                }
            } catch (e) {}
        },
        //领用人查询
        *getUserList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getCashReceiverUserList, payload, 'getUserList', 'cashReceive');
                if (data.code == 200) {
                    let list = data?.data?.list || [];
                    yield put({
                        type: 'updateStates',
                        payload: {
                            userList: list.map((item) => ({
                                ...item,
                                value: item.receiverId,
                                label: item.receiverName,
                            })),
                        },
                    });
                }
            } catch (e) {}
        },
        //领用登记保存
        *saveCashReceive({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(saveCashReceive, payload, 'saveCashReceive', 'cashReceive');
                yield put({
                    type: 'updateStates',
                    payload: { loading: false },
                });
                if (data.code == 200) {
                    callback && callback(data.data);
                } else {
                    message.warning(data.msg || '请求失败');
                }
            } catch (e) {
                console.log(e);
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
