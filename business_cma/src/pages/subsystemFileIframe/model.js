import { REQUEST_SUCCESS } from '@/service/constant';
import { message } from 'antd';
import apis from 'api';
let titleList = [
    '投资决策管理子系统',
    '工程设计管理子系统',
    '建设准备管理子系统',
    '工程实施管理子系统',
    '绩效评价管理子系统',
];
export default {
    namespace: 'subsystemFileIframe',
    state: {
        start: 1,
        limit: 10,
        currentPage: 0,
        returnCount: 0,
        allPages: 0,
        list: [],
    },
    effects: {
        *getList({ payload }, { call, put, select }) {
            const { data } = yield call(
                apis.more_get_subsystemFileIframe_list,
                payload,
                'getList',
                'subsystemFileIframe',
            );
            // const data = mockInfo;
            if (data.code == REQUEST_SUCCESS) {
                //处理后端返回的数据
                let list = data?.data?.list || [];

                let dataList = list.map((item, index) => {
                    return item[index + 1];
                });

                let resList = titleList.map((item, index) => {
                    return {
                        name: item,
                        list: dataList[index],
                    };
                });
                yield put({
                    type: 'updateStates',
                    payload: {
                        list: resList,
                    },
                });
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg, 5);
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
