import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../util/constant';

export default {
    // namespace 命名空间  必须唯一 建议和路由名一致
    namespace: 'demoList',
    state: {
        limit: 0,
        allPages: 0,
        returnCount: 0,
        currentPage: 0,
        currentHeight: 0,
        list: [], //列表,
        companyList: [
            {
                id: 1,
                name: '公司1',
            },
            {
                id: 2,
                name: '公司2',
            },
        ],
    },
    effects: {
        // TODO 接口替换
        *getCompanyList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getCompanyList, payload, '', 'demoList');
                if (data.code == REQUEST_SUCCESS) {
                    console.log(data);
                    yield put({
                        type: 'updateStates',
                        payload: {
                            companyList: data.data.companyList,
                        },
                    });
                } else {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            } finally {
            }
        },
        //
        // TODO 接口替换
        *getDemoList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getDemoList, payload, '', 'demoList');
                if (data.code == REQUEST_SUCCESS) {
                    console.log(data);
                    yield put({
                        type: 'updateStates',
                        payload: {
                            list: data.data.list,
                            returnCount: data.data.returnCount,
                            allPage: data.data.allPage,
                            currentPage: data.data.currentPage,
                        },
                    });
                } else {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            } finally {
            }
        },
        // TODO 接口替换
        *delItem({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.delItem, payload, '', 'demoList');
                if (data.code == REQUEST_SUCCESS) {
                    message.success('删除成功');
                    // 回调
                    callback && callback();
                } else {
                    message.error(data.msg);
                }
            } catch (e) {
                console.log(e);
            } finally {
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
