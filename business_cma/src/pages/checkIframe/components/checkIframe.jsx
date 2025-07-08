import { Col, Input, message, Modal, Row } from 'antd';
import { connect } from 'dva';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { modalCurrentHeight } from '../../../util/util';
import styles from '../index.less';
import CheckWindowData from './checkWindow';
const CheckModal = ({ dispatch, checkIframe }) => {
    const { rowInfoArr, urlQK } = useModel('@@qiankunStateFromMaster');
    // debugger
    const { checkData } = checkIframe;
    const [modalShow, setModalShow] = useState(false);
    const [cashierInfoId, setCashierInfoId] = useState('');
    const [cashierId, setCashierId] = useState('');
    const [value, setValue] = useState('');
    console.log(checkData);

    const [curHeight, setCurHeight] = useState(0);

    // 点击确定保存
    const submitConfirm = () => {
        checkGenerate();
    };

    const checkGenerate = () => {
        Modal.confirm({
            title: '信息',
            content: `确定要办理吗?`,
            okText: '确定',
            maskClosable: false,
            mask: false,
            onOk() {
                dispatch({
                    type: 'checkIframe/checkGenerate',
                    payload: {
                        cashierInfoId: cashierInfoId,
                        checkId: cashierId,
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

    // 关闭弹窗
    const onCancel = () => {
        setModalShow(false);
    };
    // 确定弹窗
    const confirm = (value) => {
        if (value[0].checkNo) {
            setValue(value[0].checkNo);
        }
        setCashierId(value[0].ID);
        setModalShow(false);
        localStorage.setItem('CMA_cashierInfo', JSON.stringify(value[0]));
    };

    //现金提取登记详情查询
    function getCheckInfo(cashierInfoId) {
        // debugger
        dispatch({
            type: `checkIframe/checkIframe`,
            payload: {
                cashierInfoId: cashierInfoId,
            },
        });
    }
    // 弹窗弹起
    const foucusCash = () => {
        setModalShow(true);
    };

    useEffect(() => {
        setCurHeight(modalCurrentHeight());
    }, []);

    useEffect(() => {
        if (rowInfoArr && rowInfoArr.length > 0) {
            let { ID, cashierInfoId } = rowInfoArr[0];
            cashierInfoId = cashierInfoId || ID; //兼容旧的支票出纳登记簿
            setCashierInfoId(cashierInfoId);
            localStorage.setItem('CMA_cashierInfoId', cashierInfoId);
            getCheckInfo(cashierInfoId);
        }
    }, [rowInfoArr]);

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
    return (
        <div>
            <div>
                <div className={styles.db_first}>支票出纳登记簿</div>

                <Row className={styles.db_top}>
                    <Col span={12}>
                        <span>{text}：</span>
                        <span>{checkData.reimbursementAccountNumber}</span>
                    </Col>
                    <Col span={12}>
                        <span>单据编号：</span>
                        <span>{checkData.voucherNumber}</span>
                    </Col>
                    <Col span={12}>
                        <span>单位名称：</span>
                        <span>{checkData.cashierOrgName}</span>
                    </Col>

                    <Col span={12}>
                        <span>资金来源：</span>
                        <span>{checkData.fundTypeName}</span>
                    </Col>
                    <Col span={12}>
                        <span>预算科目：</span>
                        <span>{checkData.budgetAccountName}</span>
                    </Col>
                </Row>
                <div className={styles.db_middle}>支票信息</div>

                <Row className={styles.db_text}>
                    <Col span={12}>
                        <span>支票金额：</span>
                        <span>{checkData.amount}</span>
                    </Col>
                    <Col span={12}>
                        <span>金额大写：</span>
                        <span>{checkData.amountChinese}</span>
                    </Col>
                    <Col span={13}>
                        <span>支票号：</span>
                        <Input value={value} className={styles.input_cash} onFocus={foucusCash}></Input>
                    </Col>
                    <Col span={12}>
                        <span>支出类型：</span>
                        <span>{checkData.expendType}</span>
                    </Col>
                    <Col span={12}>
                        <span>经济分类：</span>
                        <span>{checkData.economicTypeName}</span>
                    </Col>
                    <Col span={12}>
                        <span>支付码：</span>
                        <span>{checkData.payCode}</span>
                    </Col>
                    <Col span={12}>
                        <span>收款单位：</span>
                        <span>{checkData.receiveOrgName}</span>
                    </Col>
                </Row>
            </div>
            {/* <Button
        className="_margin_top_5"
        key="submit"
        type="primary"
        onClick={() => submitConfirm()}
      >
        出纳办理
      </Button> */}
            {modalShow && <CheckWindowData onCancel={onCancel} confirm={confirm}></CheckWindowData>}
        </div>
    );
};

export default connect(({ checkIframe }) => ({
    checkIframe,
}))(CheckModal);
