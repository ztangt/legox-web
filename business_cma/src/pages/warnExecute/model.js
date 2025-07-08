import { message } from 'antd';
import apis from 'api';
const { findLoginUserByIdAndRoleId, more_get_warnExecute_list } = apis;

export default {
    namespace: 'warnExecute',
    state: {
        list: [],
        currentHeight: 0,
        formInfo: {
            payState: 0, //默认查询待办
        }, //表单信息
        payStateList: [
            { value: 0, label: '待办' },
            { value: 1, label: '已办' },
        ], //办理状态

        orgList: [], //管理单位
        orgId: '',
        accountCodeList: [], //账套
        backAccountList: [], //银行账户
        modalVisible: false, //弹窗
        modalInfo: {}, //弹窗内信息
        isInit: false,
    },

    effects: {
        *getList({ payload, callback }, { call, put, select }) {
            console.log(payload, '获取风险预警→项目建设内容列表');
            const { data } = yield call(more_get_warnExecute_list, payload, 'getList', 'warnExecute');
            if (data.code == 200) {
                callback && callback(data.data);
            } else {
                message.error(data.msg);
            }
        },

        //获取管理单位
        *getOrgList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(findLoginUserByIdAndRoleId, payload, 'getOrgList', 'warnExecute');
            if (data.code == 200) {
                let list = data.data?.list || [];
                // let allInfo = { value: '', label: '全部单位' };
                let newList = list.map((item) => ({ ...item, value: item.orgId, label: item.orgName }));
                yield put({
                    type: 'updateStates',
                    payload: {
                        orgList: newList,
                        isInit: true,
                        orgId: newList.length ? newList[0].value : '',
                    },
                });
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
