import apis from 'api';
import { message } from 'antd';
import { REQUEST_SUCCESS } from '../../util/constant';

export default {
    namespace: 'checkProvide',
    state: {
        limit: 10,
        allPages: 0,
        returnCount: 0,
        currentPage: 0,
        currentHeight: 0,
        grantModal: false,
        grantModalListData: [],
    },
    effects: {
        *getGrantModalList({ payload, callback }, { call, put, select }) {
            const listData = {
                total: 23,
                rows: [
                    {
                        user_id: 'a9cd31bc159541868d31906c536b97fb',
                        dept_name: '001013102006',
                        user_name: '测试用户',
                    },
                    {
                        user_id: '14c2f09dfdd34a0aaac8ff82d8ad1fc3',
                        dept_name: '办公室（计划财务处）',
                        user_name: '韩思雪',
                    },
                    {
                        user_id: 'a9cd31bc159541868d31906c536b97f1',
                        dept_name: '001013102006',
                        user_name: '测试用户',
                    },
                    {
                        user_id: '14c2f09dfdd34a0aaac8ff82d8ad1fct',
                        dept_name: '办公室（计划财务处）',
                        user_name: '韩思雪',
                    },
                    {
                        user_id: 'a9cd31bc159541868d31906c536b97fa',
                        dept_name: '001013102006',
                        user_name: '测试用户',
                    },
                    {
                        user_id: '14c2f09dfdd34a0aaac8ff82d8ad1fce',
                        dept_name: '办公室（计划财务处）',
                        user_name: '韩思雪',
                    },
                ],
            };
            yield put({
                type: 'updateStates',
                payload: {
                    grantModalListData: listData,
                },
            });
            console.log('listData==', listData);
            callback && callback(listData);
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
