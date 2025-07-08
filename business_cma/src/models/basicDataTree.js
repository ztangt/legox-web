import { message } from 'antd';
import apis from 'api';

export default {
    namespace: 'basicDataTree',
    state: {},
    effects: {
        //根据logicCode调用接口获取bizSolId
        *getBizSolId({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.more_getLogicCode, payload, 'getBizSolId', 'basicDataTree');
            if (data.code == 200) {
                if (data.data) {
                    callback && callback(data.data);
                } else {
                    message.error('暂无数据-bizSolId');
                }
            } else {
                message.error(data.msg);
            }
        },
        //根据bizSolId调用接口获取listModelId
        *getListModelId({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.more_dataEntry_getListModelId, payload, 'getListModelId', 'basicDataTree');
            if (data.code == 200) {
                if (data.data?.bizSolForm?.listId) {
                    callback && callback(data.data?.bizSolForm?.listId);
                } else {
                    message.error('暂无数据-listModelId');
                }
            } else {
                message.error(data.msg);
            }
        },
        //根据listModelId调用接口获取基础数据树
        *getTreeList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                apis.getCurrentYearListTreeData,
                { ...payload },
                'getTreeList',
                'basicDataTree',
            );
            if (data.code == 200) {
                callback && callback(data.data?.list || []);
            } else {
                message.error(data.msg);
            }
        },
        //获取基础树的子级
        *getTreeChildList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(
                apis.getListTreeChildrenData,
                { ...payload },
                'getTreeChildList',
                'basicDataTree',
            );
            if (data.code == 200) {
                callback && callback(data.data?.list || []);
            } else {
                message.error(data.msg);
            }
        },
        //查询预算编报树
        *getRefineTree({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.getRefineTree, { ...payload }, 'getRefineTree', 'basicDataTree');
            if (data.code == 200) {
                let list = data.data?.list?.map((item) => {
                    return {
                        ...item,
                        title: `[${item.OBJ_CODE}][${item.OBJ_NAME}]`,
                    };
                });
                callback && callback(list || []);
            } else {
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
