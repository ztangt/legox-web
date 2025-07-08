import { Col, message, Row } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import GlobalModal from '../../../components/GlobalModal';

const HandleModal = ({ dispatch, chooseInfo, contentInfo, changeVisible, remittance, getList, text }) => {
    const { loading } = remittance;
    const onHandled = () => {
        dispatch({
            type: 'remittance/updateStates',
            payload: { loading: true },
        });
        dispatch({
            type: 'remittance/getState',
            callback: ({ businessDate, bankKeyInfo }) => {
                console.log(businessDate, bankKeyInfo, '---->办理的参数');
                let postData = {
                    cashierInfoId: chooseInfo.cashierInfoId,
                    businessDate: dayjs(businessDate).unix(),
                };
                if (chooseInfo.isProvincial) {
                    //如果是省局，必填银行账户
                    postData.bankKey = bankKeyInfo.BANK_ACCOUNT_PRIMARY_KEY;
                }
                dispatch({
                    type: 'remittance/generate',
                    payload: { ...postData },
                    callback: () => {
                        message.success('办理成功');
                        changeVisible(false);
                        getList();
                    },
                });
            },
        });
    };

    let infoArr = {
        reimbCardNum: text || '报账卡号',
        voucherNumber: '单据编号',
        cashierOrgName: '单位名称',
        fundTypeName: '资金性质',
        fundWay: '资金用途',
        budgetAccountName: '预算科目',
    };

    let contentArr = {
        amount: '汇款金额',
        amountChinese: '金额大写',
        receiveOrgName: '收款单位',
        receiveOrgLocation: '收款单位所在地',
        receiveOrgOpenBankName: '收款单位开户行',
        receiveOrgOpenBankNumber: '银行行号',
        expendType: '支出类型',
        economicTypeName: '经济分类',
        payCode: '支付码',
    };
    return (
        <div>
            <GlobalModal
                title={'办理'}
                modalSize={'middle'}
                open={true}
                okText={'出纳已办理'}
                onCancel={() => changeVisible(false)}
                onOk={onHandled}
                mask={false}
                confirmLoading={loading}
                getContainer={() => {
                    return document.getElementById(`remittance_id`) || false;
                }}
            >
                <div className="flex_center f20 gPrimary mb10 fb">汇款出纳登记簿</div>
                <Row className="p20 radius_8" style={{ border: '1px solid #999' }}>
                    {Object.keys(infoArr).map((itemStr, index) => (
                        <Col span={12} key={itemStr} className="f16 mb10 flex flex_wrap">
                            <div className="mr10 g6">{infoArr[itemStr]}：</div>
                            <div className="g3 fb ">
                                {itemStr == 'fundWay' ? chooseInfo.fundTypeName : chooseInfo[itemStr]}
                            </div>
                        </Col>
                    ))}
                </Row>
                <div className="flex_center f20 gPrimary mt10 mb10 fb">汇款信息</div>
                <Row className="p20 radius_8" style={{ border: '1px solid #999' }}>
                    {Object.keys(contentArr).map((itemStr, index) => (
                        <Col span={12} key={itemStr} className="f16 mb10 flex flex_wrap">
                            <div className="mr10 g6">{contentArr[itemStr]}：</div>
                            <div className="g3 fb ">{contentInfo[itemStr]}</div>
                        </Col>
                    ))}
                </Row>
            </GlobalModal>
        </div>
    );
};

export default connect(({ remittance }) => ({ remittance }))(HandleModal);
