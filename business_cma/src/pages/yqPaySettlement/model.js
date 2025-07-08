import { message } from 'antd';
import apis from 'api';

const {
    more_qy_getUnitList,
    more_qy_getPaySettlementList,
    more_qy_savePaySetStatus,
    more_qy_changePaySetStatus,
    more_qy_isEnableBank,
} = apis;

export default {
    namespace: 'yqPaySettlement',
    state: {
        currentHeight: 0,
        list: [], //表格列表
        limit: 0,
        currentPage: 0,
        allPages: 0,
        returnCount: 0,
        orgList: [], //分管单位
        formInfo: {
            processingStatus: '2,3', //1-已处理 2-未处理,3-取消办理
        },
        processingStatusList: ['', '已办理', '未办理', '取消办理'],
        payList: [], //支付方式
        isInit: false, //是否初始化
        loading: false, //是否加载中
        cutomHeaders: {}, //传给后端的自定义headers
    },
    effects: {
        //检查是否启用银企配置项
        *checkIsEnableBank({ payload, callback }, { call, put, select }) {
            const { data } = yield call(more_qy_isEnableBank, payload, 'isEnableBank', 'yqPaySettlement');
            if (data.code == 200) {
                callback && callback(data.data);
            } else {
                message.error(data.msg || '检查是否启用银企配置项失败');
            }
        },

        //获取单位列表
        *getOrgList({ payload, callback }, { call, put, select }) {
            const { data } = yield call(more_qy_getUnitList, {}, 'getOrgList', 'yqPaySettlement');
            if (data.code == 200 && data.data) {
                let list = data.data?.list || [];

                yield put({
                    type: 'updateStates',
                    payload: {
                        orgList: list.map((item) => ({ ...item, value: item.orgId, label: item.orgName })),
                    },
                });
            } else {
                message.error(data.msg || '获取单位列表失败');
            }
        },
        //查询
        *getList({ payload, callback }, { call, put, select }) {
            console.log(payload, '获取银企支付结算列表参数');
            const { data } = yield call(more_qy_getPaySettlementList, payload, 'getList', 'yqPaySettlement');
            if (data.code == 200 && data.data && data.data.list) {
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
                message.error(data.detailMsg || data.msg || '查询失败');
            }
        },

        //获取枚举
        *getDictList({ payload, callback }, { call, put, select }) {
            //从sessionStorage中获取字典值
            let dictList = JSON.parse(sessionStorage.getItem('dictsList')) || {};
            let keyList = [
                { key: 'METHODOFPAYMENT', value: 'payList' }, //支付方式
            ];
            for (let i = 0; i < keyList.length; i++) {
                let keyInfo = keyList[i];
                let dictInfo = dictList[keyInfo.key];
                //如果没有字典值，则请求
                if (!dictInfo) {
                    let params = { showType: 'ALL', isTree: '1', searchWord: '', dictTypeId: keyInfo.key };
                    try {
                        const { data } = yield call(
                            apis.getBaseDataCodeTable,
                            params,
                            'getDictList',
                            'yqPaySettlement',
                        );
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
                    id: item.dictInfoCode,
                    name: item.dictInfoName,
                }));

                console.log('obj', obj);
                yield put({
                    type: 'updateStates',
                    payload: { ...obj, isInit: true },
                });
            }
        },

        //修改支付结算状态
        *changePaySetStatus({ payload, callback }, { call, put, select }) {
            const { data } = yield call(more_qy_changePaySetStatus, payload, 'changePaySetStatus', 'yqPaySettlement');
            yield put({
                type: 'updateStates',
                payload: { loading: false },
            });
            if (data.code == 200) {
                callback && callback();
            } else {
                message.error(data.msg || '操作失败');
            }
        },

        //生成支付结算单
        *savePaySetStatus({ payload, callback }, { call, put, select }) {
            const { cutomHeaders } = yield select((state) => state.yqPaySettlement);
            payload.headers = cutomHeaders; //需要在headers中添加参数

            const { data } = yield call(more_qy_savePaySetStatus, payload, 'savePaySetStatus', 'yqPaySettlement');
            yield put({
                type: 'updateStates',
                payload: { loading: false },
            });
            if (data.code == 200) {
                callback && callback();
            } else {
                message.error(data.msg || '操作失败');
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
