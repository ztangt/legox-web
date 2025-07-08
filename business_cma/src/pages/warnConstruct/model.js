import { message } from 'antd';
import apis from 'api';

export default {
    namespace: 'warnConstruct',
    state: {
        list: [],
        currentHeight: 0,
        limit: 0,
        returnCount: 0,
        currentPage: 0,
        allPages: 0,
        formInfo: {
            projectName: '', //项目名称
            projectLegalEntityCode: '', //管理单位
        }, //表单信息

        loading: true,
        orgList: [], //管理单位
        progressList: [
            // { value: 0, label: '全部' },
            { value: 1, label: '是' },
            { value: 2, label: '否' },
        ], //进度列表
        executeList: [
            // { value: 0, label: '全部' },
            { value: 1, label: '是' },
            { value: 2, label: '否' },
        ], //执行列表

        isInit: false,
    },

    effects: {
        *getList({ payload, callback }, { call, put, select }) {
            let postData = {
                ...payload,
                projectName: payload.projectName || '',
                projectLegalEntityCode: payload.projectLegalEntityCode || '',
            };

            console.log(postData, '获取风险预警→项目建设内容列表');
            const { data } = yield call(apis.more_get_warnConstruct_list, postData, 'getList', 'warnConstruct');
            // const data = listInfo;
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
            } else {
                message.error(data.msg);
            }
        },

        //获取占比
        *getPercent({ payload, callback }, { call, put, select }) {
            let postData = {
                ...payload,
                projectName: payload?.projectName || '',
                projectLegalEntityCode: payload?.projectLegalEntityCode || '',
            };
            console.log(postData, '获取风险预警→项目建设内容占比');
            const { data } = yield call(apis.more_get_warnConstruct_percent, postData, 'getPercent', 'warnConstruct');
            // const data = percentInfo;
            if (data.code == 200) {
                yield put({
                    type: 'updateStates',
                    payload: {
                        exeAbnormalRate: [
                            {
                                value: data?.data?.exeAbnormalRate || 0,
                                name: '占比率',
                            },
                        ],
                        budgetAbnormalRate: [
                            {
                                value: data?.data?.budgetAbnormalRate || 0,
                                name: '占比率',
                            },
                        ],
                        totalAbnormalRate: [
                            {
                                value: data?.data?.totalAbnormalRate || 0,
                                name: '占比率',
                            },
                        ],
                    },
                });
            } else {
                message.error(data.msg);
            }
        },

        //获取管理单位
        *getOrgList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.findLoginUserByIdAndRoleId, payload, 'getOrgList', 'warnConstruct');
            if (data.code == 200) {
                let list = data.data?.list || [];
                let newList = list.map((item) => ({ ...item, value: item.orgCode, label: item.orgName }));
                let projectLegalEntityCode = newList.length ? newList[0].value : '';
                //默认取第一个管理单位的code
                yield put({
                    type: 'updateStates',
                    payload: {
                        orgList: [...newList],
                        formInfo: {
                            projectLegalEntityCode,
                        },
                        isInit: true,
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
