import apis from 'api';
import { message } from 'antd';

const { more_contractTemplate_file, getFileZip } = apis;

export default {
    namespace: 'annexIframe',
    state: {
        list: [],
        typeList: [], //合同类型 QKYHTLX
        isInit: false,
    },

    effects: {
        //获取附件列表
        *getList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(more_contractTemplate_file, {}, 'getList', 'annexIframe');
                if (data.code == 200) {
                    let list = data.data.list || [];
                    let arr = [];
                    list.forEach((item) => {
                        let annexList = (item.list || []).map((annexItem) => ({
                            ...annexItem,
                            annexType: item.CONTRACT_TYPE_TLDT_, //合同类型
                        }));
                        arr = [...arr, ...annexList];
                    });
                    yield put({
                        type: 'updateStates',
                        payload: {
                            list: arr,
                        },
                    });
                }
            } catch (e) {}
        },

        *getDictList({ payload, callback }, { call, put, select }) {
            //从sessionStorage中获取字典值
            let dictList = JSON.parse(sessionStorage.getItem('dictsList')) || {};
            let keyList = [
                { key: 'QKYHTLX', value: 'typeList' }, //合同类型
            ];
            for (let i = 0; i < keyList.length; i++) {
                let keyInfo = keyList[i];
                let dictInfo = dictList[keyInfo.key] || {};
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
            yield put({
                type: 'updateStates',
                payload: { isInit: true },
            });
        },
        //getZip,调用接口下载zip
        *getZip({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getFileZip, payload, 'getZip', 'annexIframe');
                if (data.code == 200) {
                    window.open(data.data);
                    message.success('下载成功');
                } else {
                    message.error(data.msg);
                }
            } catch (e) {}
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
