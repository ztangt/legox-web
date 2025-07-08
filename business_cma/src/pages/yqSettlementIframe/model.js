import { message } from 'antd';
import apis from 'api';
//9月20日 文凯让改的字段

export default {
    namespace: 'yqSettlementIframe',
    state: {
        rtcList: [],
        cardList: [],
        hasCreate: '未生成', //是否已生成支付结算单

        isMatchList: [],
    },
    effects: {
        //转账汇款支付明细
        *getRtcList({ payload, callback }, { call, put, select }) {
            let postData = {
                bizSolId: payload.SOL_ID,
                mainTableId: payload.MAIN_TABLE_ID,
                bankAccount: payload.PAY_ACCOUNT_NAME,
                paymentCode: '',
                searchType: 'zzhk',
                draftOrgId: payload.ORG_ID,
            };
            try {
                const { data } = yield call(
                    apis.more_qy_getSettlementList,
                    postData,
                    'getRtcList',
                    'yqSettlementIframe',
                );
                if (data.code == 200 && data.data) {
                    let list = data.data.list || [];
                    let newList = list.map((item) => {
                        return {
                            ...item,
                            PAYOUT_CODE: payload.BUDGET_INTEGRATION_INDICATOR_CODE == 'XXX' ? '1' : '2',
                            SUBJECT_CODE: payload.FUNC_SUBJECT_CODE || '',
                            SUBJECT_NAME: payload.FUNC_SUBJECT_NAME || '',
                            OUTLAY_CODE: payload.GOV_ECONOMIC_CODE || '',
                            PUR_TYPE: '',
                            ORIGIN_CODE: payload.SOURCE_OF_FUNDS_CODE || '',

                            draftOrgId: payload.ORG_ID || '',
                            draftOrgCode: payload.ORG_CODE || '',
                            draftOrgName: payload.ORG_NAME || '',
                            draftUserId: payload.CREATE_USER_ID || '',
                            draftUserName: payload.CREATE_USER_NAME || '',
                        };
                    });
                    yield put({
                        type: 'updateStates',
                        payload: {
                            rtcList: newList,
                        },
                    });
                }
            } catch (e) {}
        },
        //公务卡支付明细
        *getCardList({ payload, callback }, { call, put, select }) {
            let postData = {
                bizSolId: payload.SOL_ID,
                mainTableId: payload.MAIN_TABLE_ID,
                bankAccount: payload.PAY_ACCOUNT_NAME,
                paymentCode: '',
                searchType: 'gwk',
                draftOrgId: payload.ORG_ID,
            };

            const { data } = yield call(apis.more_qy_getSettlementList, postData, 'getCardList', 'yqSettlementIframe');
            if (data.code == 200 && data.data) {
                let list = data.data.list || [];
                let isMatchList = [];
                for (let i = 0; i < list.length; i++) {
                    let item = list[i];

                    let paramData = {
                        fkBankCode: item.FK_BANK_CODE, //付款方银行编码
                        fkBankAccount: item.FK_BANK_ACCOUNT, //付款方银行账号
                        personnel: item.PERSONNEL, //持卡人姓名
                        cardNum: item.CARD_NUM, //卡号
                        dateOfConsumption: item.DATE_OF_CONSUMPTION, //消费日期
                        sumOfConsumption: item.SUM_OF_CONSUMPTION, //消费金额
                        onlineBankChannelNumber: item.ONLINE_BANK_CHANNEL_NUMBER, //付款方网银渠道号
                        draftOrgId: payload.ORG_ID, //单据创建单位ID,小笋干让把payload.draftOrgId改为payload.ORG_ID
                        numberMainTableId: payload.MAIN_TABLE_ID, //添加MAIN_TABLE_ID，小笋干让加的
                        accountTypeTldt: payload.ACCOUNT_TYPE_TLDT, //添加ACCOUNT_TYPE_TLDT_，小笋干让加的
                    };
                    //公务卡明细列表查询消费记录校验是否匹配
                    const { data } = yield call(apis.more_qy_getCardType, paramData);
                    list[i] = {
                        ...list[i],
                        xfjlxy: data?.data?.xfjlxy,
                        GWK_TXN_DATE: data?.data?.GWK_TXN_DATE,
                        GWK_TXN_TIME: data?.data?.GWK_TXN_TIME,
                        GWK_TXN_TPCD: data?.data?.GWK_TXN_TPCD,
                        GWK_MERCHANT_NAME: data?.data?.GWK_MERCHANT_NAME,

                        PAYOUT_CODE: payload.BUDGET_INTEGRATION_INDICATOR_CODE == 'XXX' ? '1' : '2',
                        SUBJECT_CODE: payload.FUNC_SUBJECT_CODE || '',
                        SUBJECT_NAME: payload.FUNC_SUBJECT_NAME || '',
                        OUTLAY_CODE: payload.GOV_ECONOMIC_CODE || '',
                        PUR_TYPE: '6',
                        ORIGIN_CODE: payload.SOURCE_OF_FUNDS_CODE || '',

                        draftOrgId: payload.ORG_ID || '',
                        draftOrgCode: payload.ORG_CODE || '',
                        draftOrgName: payload.ORG_NAME || '',
                        draftUserId: payload.CREATE_USER_ID || '',
                        draftUserName: payload.CREATE_USER_NAME || '',
                    };
                    isMatchList.push(data?.data?.xfjlxy == '1' ? '匹配' : '未匹配');
                    yield put({
                        type: 'updateStates',
                        payload: { cardList: list, isMatchList: isMatchList },
                    });
                }
            }
        },

        //判断是否已生成支付结算单
        *checkHasCreate({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(
                    apis.more_qy_hasCreateStlmt,
                    payload,
                    'checkHasCreate',
                    'yqSettlementIframe',
                );
                if (data.code == 200 && data.data) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            hasCreate: data.data == true ? '已生成' : '未生成',
                        },
                    });
                }
            } catch (e) {}
        },
        *createStlmt({ payload, callback }, { call, put, select }) {
            const rtcList = yield select((state) => state.yqSettlementIframe.rtcList);
            const cardList = yield select((state) => state.yqSettlementIframe.cardList);
            let postData = {
                bizSolId: payload.SOL_ID,
                bpmBizInfoId: payload.BIZ_ID,
                mainTableId: payload.MAIN_TABLE_ID,
                relateBillNo: payload.NUMBER,
                transferRemittanceData: JSON.stringify(rtcList),
                OfficialCardData: JSON.stringify(cardList),
            };
            try {
                const { data } = yield call(
                    apis.more_qy_createSettlement,
                    postData,
                    'createStlmt',
                    'yqSettlementIframe',
                );
                if (data.code == 200 && data.data) {
                    message.success('确认成功');
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
