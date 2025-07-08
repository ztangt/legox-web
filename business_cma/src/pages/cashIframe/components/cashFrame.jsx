import { Col, message, Modal, Row } from 'antd';
import { connect } from 'dva';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { modalCurrentHeight } from '../../../util/util';
import styles from '../index.less';
const cashFrame = ({ dispatch, cashIframe }) => {
    const [curHeight, setCurHeight] = useState(0);

    const { rowInfoArr, urlQK } = useModel('@@qiankunStateFromMaster');
    const [cashierInfoId, setCashierInfoId] = useState('');
    const { cashData } = cashIframe;

    const [text, setText] = useState('报账卡号');
    useEffect(() => {
        // searchType = 1; 国家局 报账卡号(默认)
        // searchType = 2; 省局 预算指标
        if (urlQK) {
            let obj = qs.parse(urlQK.split('?')[1]);
            if (obj.searchType == '2') {
                setText('预算指标');
            }
        }
    }, []);

    // 点击确定保存
    const confirm = () => {
        generate();
    };

    const generate = () => {
        Modal.confirm({
            title: '信息',
            content: `确定要办理吗?`,
            okText: '确定',
            maskClosable: false,
            mask: false,
            onOk() {
                dispatch({
                    type: 'cashIframe/payState',
                    payload: {
                        cashierInfoId: cashierInfoId,
                    },
                    callback: function (data) {
                        if (data.code == 200) {
                            message.success('出纳办理成功！');
                        } else {
                            message.error(data.msg);
                        }
                    },
                });
            },
        });
    };

    //现金提取登记详情查询
    function getCashInfo(cashierInfoId) {
        // debugger
        console.log('现金iframe', cashierInfoId);
        dispatch({
            type: `cashIframe/cashIframe`,
            payload: {
                cashierInfoId: cashierInfoId,
            },
        });
    }

    useEffect(() => {
        setCurHeight(modalCurrentHeight());
    }, []);

    useEffect(() => {
        if (rowInfoArr && rowInfoArr.length > 0) {
            let { ID, cashierInfoId } = rowInfoArr[0];
            cashierInfoId = cashierInfoId || ID; //兼容现金出纳登记簿
            setCashierInfoId(cashierInfoId);
            localStorage.setItem('CMA_cashierInfoId', cashierInfoId);
            getCashInfo(cashierInfoId);
        }
    }, [rowInfoArr]);

    return (
        <div>
            <div>
                <div className={styles.db_first}>现金出纳登记簿</div>

                <Row className={styles.db_top}>
                    <Col span={12}>
                        <span>{text}：</span>
                        <span>{cashData.reimbursementAccountNumber}</span>
                    </Col>
                    <Col span={12}>
                        <span>单据编号：</span>
                        <span>{cashData.voucherNumber}</span>
                    </Col>
                    <Col span={12}>
                        <span>单位名称：</span>
                        <span>{cashData.cashierOrgName}</span>
                    </Col>

                    <Col span={12}>
                        <span>资金来源：</span>
                        <span>{cashData.fundTypeName}</span>
                    </Col>
                    <Col span={12}>
                        <span>预算科目：</span>
                        <span>{cashData.budgetAccountName}</span>
                    </Col>
                </Row>
                <div className={styles.db_middle}>现金信息</div>

                <Row className={styles.db_text}>
                    <Col span={12}>
                        <span>支付金额：</span>
                        <span>{cashData.amount}</span>
                    </Col>
                    <Col span={12}>
                        <span>金额大写：</span>
                        <span>{cashData.amountChinese}</span>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default connect(({ cashIframe }) => ({
    cashIframe,
}))(cashFrame);
