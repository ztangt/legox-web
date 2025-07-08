import { message } from 'antd';
import apis from 'api';

export default {
    namespace: 'dataEntryRule',
    state: {
        limit: 0,
        returnCount: 0,
        currentPage: 0,
        allPages: 0,
        currentHeight: 0,
        loading: true,
        formInfo: {},
        pageList: [], //页面列表
        checkTypeList: [], //审核类型
        rulesAndRangeAndList: [], //规则定义并且/或
        rulesDefinedNameList: [], //规则定义名称
        rulesAndRangeEqualStatusList: [], //规则定义和数据范围>、=、<
        rulesAndRangeTextList: [], //规则定义和数据 文本
    },
    effects: {
        *getList({ payload, callback }, { call, put, select }) {
            console.log(payload, '---->获取审核规则列表参数');
            try {
                const { data } = yield call(apis.more_dataEntryRule_getList, payload, 'getList', 'dataEntryRule');
                yield put({
                    type: 'updateStates',
                    payload: { loading: false },
                });
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            list: data.data?.list || [],
                            returnCount: data.data.returnCount * 1,
                            allPage: data.data.allPage * 1,
                            currentPage: data.data.currentPage * 1,
                        },
                    });
                    callback && callback(data.data?.list || []);
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },
        //新增规则
        *addRule({ payload, callback }, { call, put, select }) {
            console.log(payload, '---->新增规则参数');
            try {
                const { data } = yield call(apis.more_dataEntryRule_add, payload, 'getList', 'addRule');
                if (data.code == 200) {
                    callback && callback();
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },

        //编辑规则
        *editRule({ payload, callback }, { call, put, select }) {
            console.log(payload, '---->修改规则参数');
            try {
                const { data } = yield call(apis.more_dataEntryRule_edit, payload, 'getList', 'editRule');
                if (data.code == 200) {
                    callback && callback();
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },

        //删除规则
        *deleteRule({ payload, callback }, { call, put, select }) {
            console.log(payload, '---->删除规则参数');
            try {
                const { data } = yield call(apis.more_dataEntryRule_delete, payload, 'getList', 'deleteRule');
                if (data.code == 200) {
                    callback && callback();
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },

        //获取详情
        *getRuleInfo({ payload, callback }, { call, put, select }) {
            console.log(payload, '---->删除规则参数');
            try {
                const { data } = yield call(apis.more_dataEntryRule_detail, payload, 'getList', 'getRuleInfo');
                if (data.code == 200) {
                    callback && callback(data.data || {});
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
        },

        *getState({ payload, callback }, { call, put, select }) {
            const data = yield select((state) => state.dataEntryRule);
            callback && callback(payload && payload.type ? data[payload.type] : data);
        },

        //获取基础编码枚举
        *getDictList({ payload, callback }, { call, put, select }) {
            //从sessionStorage中获取字典值
            let dictList = JSON.parse(sessionStorage.getItem('dictsList')) || {};
            let keyList = [
                { key: 'YSBB_SHGZ_YMXZ', value: 'pageList' }, //页面列表
                { key: 'YSBB_SHGZ_SHLX', value: 'checkTypeList' }, //审核类型
                { key: 'YSBB_SHGZ_BLTJ', value: 'rulesAndRangeAndList' }, //规则定义并且/或
                { key: 'YSBB_SHGZ_SHZD', value: 'rulesDefinedNameList' }, //规则定义名称
                { key: 'YSBB_SHGZ_TJGS', value: 'rulesAndRangeEqualStatusList' }, //规则定义名称
                { key: 'YSBB_SHGZ_TRLX', value: 'rulesAndRangeTextList' }, //规则定义和数据 文本
            ];
            for (let i = 0; i < keyList.length; i++) {
                let keyInfo = keyList[i];
                let dictInfo = dictList[keyInfo.key];
                //如果没有字典值，则请求
                if (!dictInfo) {
                    let params = { showType: 'ALL', isTree: '1', searchWord: '', dictTypeId: keyInfo.key };
                    try {
                        const { data } = yield call(apis.getBaseDataCodeTable, params, 'getDictList', 'dataEntryRule');
                        if (data.code == 200) {
                            dictInfo = { dictInfos: data.data.list || [] };
                        }
                    } catch (e) {}
                }
                let obj = {};
                obj[keyInfo.value] = (dictInfo.dictInfos || []).map((item) => ({
                    ...item,
                    value: item.dictInfoCode,
                    label: item.dictInfoName,
                }));
                yield put({
                    type: 'updateStates',
                    payload: { ...obj },
                });
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
