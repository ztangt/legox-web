import { Button, Col, Form, Input, InputNumber, message, Row, Select, Switch } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { connect } from 'umi';
import GlobalModal from '../../../components/GlobalModal';
import { dataFormat } from '../../../util/util';
import styles from '../index.less';
import MedicalServiceModal from './medicalServiceModal';
import SelfCardModal from './selfCardModal';
// import { create, all } from 'mathjs';
import BigNumber from 'bignumber.js';
import moment from 'moment';
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const { Option } = Select;
function Index({ dispatch, medicalfee }) {
    const [form] = Form.useForm();
    const { currentReimburseNo, selfCardModal, medicalServiceModal, medicalRegistration, isConfirm } = medicalfee;
    const [cmaPaymentMethodList, setCmaPaymentMethodList] = useState([]);
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
    const reimbursableAmount = Form.useWatch('reimbursableAmount', form);
    const medicalServiceFee = Form.useWatch('medicalServiceFee', form);
    const reimburseAmount = Form.useWatch('reimburseAmount', form);
    useEffect(() => {
        var reimburseAmount = BigNumber(reimbursableAmount || 0)
            .times(medicalRegistration?.reimburseRatio / 100 || 0)
            .plus(medicalServiceFee || 0); //医事服务费:
        form.setFieldsValue({ reimburseAmount }); //实际报销金额
    }, [reimbursableAmount, medicalServiceFee]);
    useEffect(() => {
        if (form?.getFieldValue('cmaPaymentMethodWayCode') == '02') {
            form.setFieldsValue({
                personalDepositCardAmount: reimburseAmount,
            });
        } else if (form?.getFieldValue('cmaPaymentMethodWayCode') == '01') {
            form.setFieldsValue({
                cashAmount: reimburseAmount,
            });
        }
    }, [reimburseAmount]);
    // const mathjs = create(all); //创建mathjs
    // mathjs.config({
    //   //配置精度，防止丢失
    //   number: 'BigNumber',
    //   precision: 20,
    // });
    useEffect(() => {
        if (!medicalRegistration?.cmaPaymentMethodWayCode) {
            form.setFieldsValue({ cmaPaymentMethodWayCode: '02' });
        }
        if (currentReimburseNo) {
            dispatch({
                type: 'medicalfee/getMedicalRegistration',
                payload: {
                    reimburseNo: currentReimburseNo,
                },
                callback: (data) => {
                    form.setFieldsValue(data);
                    medicalNoCallback({ target: { value: data.medicalNo } });
                },
            });
        } else {
            if (!medicalRegistration?.reimburseDate) {
                //报销日期
                medicalRegistration['reimburseDate'] = moment().format('X');
            }
            if (!medicalRegistration?.approvalUserName) {
                //审核人员
                medicalRegistration['approvalUserName'] = userInfo?.userName;
                medicalRegistration['approvalUserId'] = userInfo?.userId;
            }
            dispatch({
                type: 'medicalfee/updateStates',
                payload: {
                    medicalRegistration,
                },
            });
            dispatch({
                type: 'medicalfee/getSerialNum',
                payload: {
                    codeRuleId: '1639194404688265218', //固定编码
                },
                callback: (data) => {
                    setCmaPaymentMethodList(data);
                },
            });
        }
        dispatch({
            type: 'medicalfee/getLogicCode',
            payload: {
                logicCode: 'CMA_100014',
            },
            callback: (data) => {
                setCmaPaymentMethodList(data);
            },
        });
    }, []);

    const handelCanel = () => {
        dispatch({
            type: 'medicalfee/updateStates',
            payload: {
                editMedicalFreeModal: false,
                medicalRegistration: {},
            },
        });
    };
    //提交
    const onFinish = (values) => {
        if (values['cmaPaymentMethodWayCode'] == '02' && !isConfirm) {
            //储蓄卡支付二次确认
            dispatch({
                type: 'medicalfee/updateStates',
                payload: {
                    selfCardModal: true,
                    isConfirm: true,
                },
            });
            return;
        }
        for (let key in values) {
            if (key != 'calculateManually' && typeof values[key] == 'string') {
                values[key] = values[key].trim();
            }
        }
        // const cmaPaymentMethodWay = values['cmaPaymentMethodWay']?.split('&');
        var selfExpenseAmountJson = {
            //自费金额json
            ownExpenseList: values['ownExpenseList'],
            totalOfBillAmount: values['totalOfBillAmount'], //票据金额合计
            totalOfOwnExpense: values['totalOfOwnExpense'], //自费金额合计
        };
        values['calculateManually'] = values['calculateManually'] ? 1 : 0;
        var submitObj = {
            ...medicalRegistration,
            ...values,
            // cmaPaymentMethodId: cmaPaymentMethodWay?.[0] || '',
            // cmaPaymentMethodWayCode: cmaPaymentMethodWay?.[1] || '',
            // cmaPaymentMethodWayName: cmaPaymentMethodWay?.[2] || '',
            selfExpenseAmountJson: JSON.stringify(selfExpenseAmountJson),
        };
        if (medicalRegistration.id) {
            //修改
            dispatch({
                type: 'medicalfee/updateMedicalRegistration',
                payload: JSON.stringify(submitObj),
            });
        } else {
            //新增
            dispatch({
                type: 'medicalfee/addMedicalRegistration',
                payload: JSON.stringify(submitObj),
            });
        }
    };
    const onValuesChange = (changedValues, allValues) => {
        console.log('changedValues?', changedValues, changedValues?.['medicalServiceFee']);
        // if (
        //     // (changedValues?.['reimbursableAmount'] && //可报销金额
        //     //     medicalRegistration?.reimburseRatio && //享受待遇
        //     //     allValues?.medicalServiceFee) ||
        //     // (allValues?.['reimbursableAmount'] &&
        //     //     medicalRegistration?.reimburseRatio && //享受待遇
        //     //     changedValues?.medicalServiceFee) //医事服务费
        //     changedValues?.['reimbursableAmount']||changedValues?.['medicalServiceFee']
        // ) {
        //     // var reimburseAmount =
        //     //   allValues?.reimbursableAmount *
        //     //     Number(medicalRegistration?.reimburseRatio) +
        //     //   Number(allValues?.medicalServiceFee); //实际报销金额:
        //     // form.setFieldsValue({ reimburseAmount }); //实际报销金额
        //     var reimburseAmount = BigNumber(allValues?.reimbursableAmount || 0)
        //         .times(medicalRegistration?.reimburseRatio || 0)
        //         .plus(allValues?.medicalServiceFee || 0); //医事服务费:
        //     form.setFieldsValue({ reimburseAmount }); //实际报销金额
        // }
        // if (changedValues?.['reimburseAmount']) {
        //     //实际报销金额
        //     if (allValues['cmaPaymentMethodWayName'] == '01') {
        //         //支付方式
        //         form.setFieldsValue({ cashAmount: changedValues?.['reimburseAmount'] }); //现金
        //     } else {
        //         form.setFieldsValue({ personalDepositCardAmount: changedValues?.['reimburseAmount'] }); //个人储蓄卡
        //     }
        // }
        if (changedValues['cmaPaymentMethodWayCode'] == '01') {
            //支付方式
            form.setFieldsValue({
                personalDepositCardAmount: 0,
                cashAmount: allValues?.['reimburseAmount'] ? allValues?.['reimburseAmount'] : 0,
            }); //个人储蓄卡
            form.setFieldsValue({}); //现金
        }
        if (changedValues['cmaPaymentMethodWayCode'] == '02') {
            //支付方式
            form.setFieldsValue({
                cashAmount: 0,
                personalDepositCardAmount: allValues?.['reimburseAmount'] ? allValues?.['reimburseAmount'] : 0,
            }); //现金
        }
        if (changedValues?.calculateManually && !allValues?.personName) {
            message.info('请先填写人员信息！');
            return;
        }
        dispatch({
            type: 'medicalfee/updateStates',
            payload: {
                medicalRegistration: {
                    ...medicalRegistration,
                    ...changedValues,
                },
            },
        });
    };
    const checkCode = (_, value) => {
        let reg = /^[a-zA-Z][a-zA-Z0-9]*$/;
        if (value && value.length > 50) {
            return Promise.reject(new Error('长度不能超过50!'));
        } else if (value && !reg.test(value)) {
            return Promise.reject(new Error('只能输入字母+数字，且首位必须是字母!'));
        } else {
            return Promise.resolve();
        }
    };

    //保存medicalRegistration信息，解决medicalNoCallback函数取不到最新medicalRegistration问题
    const info = useRef({ ...medicalfee.medicalRegistration });
    useEffect(() => {
        info.current = { ...medicalfee.medicalRegistration };
    }, [medicalfee.medicalRegistration]);

    //输入医疗编号的回调
    function medicalNoCallback(e) {
        if (e.target.value) {
            dispatch({
                type: 'medicalfee/getPersonnelInformation', //根据编码获取人员信息
                payload: {
                    medicalNo: e.target.value,
                },
                callback: (data) => {
                    delete data['id'];
                    form.setFieldsValue({
                        ...data,
                    });
                    if (data?.cmaPersonnelMoldId) {
                        dispatch({
                            //医药费报销登记-报销-根据人员类型主键id获取自费费率数据
                            type: 'medicalfee/getDrugExpensePersonnelMoldId',
                            payload: {
                                personnelMoldId: data?.cmaPersonnelMoldId,
                            },
                            callback: (data) => {
                                form.setFieldsValue({
                                    ...data,
                                });
                            },
                        });
                    }
                    dispatch({
                        type: 'medicalfee/updateStates',
                        payload: {
                            medicalRegistration: {
                                // ...medicalRegistration,
                                ...info.current,
                                ...data,
                            },
                        },
                    });
                },
            });
        }
    }
    //医事服务费
    function onMedicalServiceFee() {
        if (!form?.getFieldValue('personName')) {
            message.info('请先填写人员信息');
            return;
        }
        dispatch({
            type: 'medicalfee/updateStates',
            payload: {
                medicalServiceModal: true,
            },
        });
    }

    //个人储蓄卡
    function onCard() {
        dispatch({
            type: 'medicalfee/updateStates',
            payload: {
                selfCardModal: true,
            },
        });
    }

    function onChangeVisitAmount(key, value) {
        if (value) {
            var ownExpenseList = form.getFieldValue('ownExpenseList');
            ownExpenseList[key]['ownExpenseAmount'] = BigNumber(ownExpenseList?.[key]?.['visitAmount']).times(
                ownExpenseList?.[key]?.['ownExpenseRatio'] / 100,
            );
            console.log('ownExpenseList[key]', ownExpenseList[key]);
            // ownExpenseList[key]['ownExpenseAmount'] = ownExpenseList?.[key]?.['visitAmount']*medicalRegistration?.ownExpenseList?.[key]?.['ownExpenseRatio']
            var totalOfBillAmountData = ownExpenseList.map((item) => {
                return Number(item.visitAmount);
            });
            var totalOfOwnExpenseData = ownExpenseList.map((item) => {
                return Number(item.ownExpenseAmount);
            });
            var totalOfBillAmount = _.sum(totalOfBillAmountData); //票据金额合计
            var totalOfOwnExpense = _.sum(totalOfOwnExpenseData); //自费金额合计
            var reimbursableAmount = BigNumber(totalOfBillAmount).minus(totalOfOwnExpense); //可报销金额
            var reimburseAmount = BigNumber(reimbursableAmount)
                .times(form.getFieldValue('reimburseRatio') / 100)
                .plus(
                    //享受待遇
                    form.getFieldValue('medicalServiceFee') || 0,
                ); //医事服务费
            form.setFieldsValue({
                ownExpenseList,
                totalOfBillAmount,
                totalOfOwnExpense,
                reimbursableAmount,
                reimburseAmount,
            });
        }
    }

    return (
        <GlobalModal
            open={true}
            title={'药费报销单'}
            onCancel={handelCanel}
            maskClosable={false}
            mask={false}
            centered
            modalSize="lager"
            getContainer={() => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            }}
            footer={[
                <Button key="cancel" onClick={handelCanel}>
                    取消
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    htmlType={'submit'}
                    onClick={() => {
                        form.submit();
                    }}
                >
                    保存
                </Button>,
            ]}
        >
            {selfCardModal && <SelfCardModal mform={form} onMformFinish={onFinish} />}
            {medicalServiceModal && <MedicalServiceModal form={form} />}
            <Form
                {...layout}
                colon={false}
                form={form}
                name="role"
                initialValues={medicalRegistration}
                onFinish={onFinish.bind(this)}
                onValuesChange={onValuesChange}
                onFieldsChange={onValuesChange}
                labelAlign={'left'}
                className={styles.form_container}
            >
                <div className={styles.form_title}>中国气象局机关药费报销单</div>
                <div className={styles.header_text}>
                    单据编号：{medicalRegistration?.reimburseNo}
                    <span>
                        报销日期：
                        {dataFormat(medicalRegistration?.reimburseDate, 'YYYY-MM-DD')}
                    </span>
                </div>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item
                            label="医疗编号"
                            name="medicalNo"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入医疗编号!',
                                    whitespace: true,
                                },
                            ]}
                        >
                            <Input onBlur={medicalNoCallback.bind(this)} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="姓名" name="personName">
                            <Input disabled={true} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="人员状态" name="cmaPersonnelStatusObjName">
                            <Input disabled={true} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item label="附件张数" name="annexCount">
                            <InputNumber className={styles.input_number} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="单位" name="cmaEmployeeOrgObjName">
                            <Input disabled={true} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="人员类型" name="cmaPersonnelMoldObjName">
                            <Input disabled={true} />
                        </Form.Item>
                    </Col>
                </Row>
                <div style={{ display: 'flex' }}>
                    <div
                        style={{
                            width: `calc(${(1 / 9) * 24 * 100}%  - 12px)`,
                            marginLeft: '12px',
                        }}
                    >
                        就近医院
                    </div>
                    <div style={{ width: `${(8 / 9) * 24 * 100}%`, marginLeft: '-12px' }}>
                        <Form.Item label="" name="nearbyHospital" wrapperCol={24}>
                            <Input className={styles.input_number} />
                        </Form.Item>
                    </div>
                </div>
                <div style={{ display: 'flex' }}>
                    <div
                        style={{
                            width: `calc(${(1 / 9) * 24 * 100}%  - 12px)`,
                            marginLeft: '12px',
                        }}
                    >
                        是否手算
                    </div>
                    <div style={{ width: `${(8 / 9) * 24 * 100}%`, marginLeft: '-12px' }}>
                        <Form.Item label="" name="calculateManually" wrapperCol={24} valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </div>
                </div>
                {!form?.getFieldValue('calculateManually') && (
                    <>
                        {medicalRegistration?.ownExpenseList?.length && (
                            <Row gutter={24}>
                                <Col span={8}>
                                    <Form.Item label="收费种类" name="">
                                        <div className={styles.form_item_text}>就诊金额</div>
                                    </Form.Item>
                                </Col>
                                <Col span={6} className={styles.form_item_text}>
                                    自费比例
                                </Col>
                                <Col span={10} className={styles.form_item_text}>
                                    自费金额
                                </Col>
                            </Row>
                        )}

                        <Form.List name="ownExpenseList">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, index) => {
                                        var currentItem = form.getFieldValue('ownExpenseList')[index];
                                        console.log('currentItem', currentItem);
                                        return (
                                            <Row gutter={24} key={field.key}>
                                                <Col span={8}>
                                                    <Form.Item
                                                        {...field}
                                                        label={`${currentItem?.cmaPayKindKindName}`}
                                                        name={[field.name, 'visitAmount']}
                                                    >
                                                        <InputNumber
                                                            className={styles.input_number}
                                                            onChange={onChangeVisitAmount.bind(this, field.key)}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={6}>
                                                    <Form.Item
                                                        {...field}
                                                        label=""
                                                        name={[field.name, 'ownExpenseRatioValue']}
                                                        wrapperCol={24}
                                                    >
                                                        <Input disabled={true} className={styles.input_number_left} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={10}>
                                                    <Form.Item
                                                        {...field}
                                                        label=""
                                                        name={[field.name, 'ownExpenseAmount']}
                                                        wrapperCol={24}
                                                    >
                                                        <InputNumber
                                                            disabled={true}
                                                            className={styles.input_number_left}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        );
                                    })}
                                </>
                            )}
                        </Form.List>
                        <div style={{ display: 'flex' }}>
                            <div
                                style={{
                                    width: `calc(${(1 / 9) * 24 * 100}%  - 12px)`,
                                    marginLeft: '12px',
                                }}
                            >
                                票据金额合计
                            </div>
                            <div
                                style={{
                                    width: `${(3.5 / 9) * 24 * 100}%`,
                                    marginLeft: '-12px',
                                }}
                            >
                                <Form.Item label="" name="totalOfBillAmount" wrapperCol={24}>
                                    <InputNumber disabled={true} className={styles.input_number} />
                                </Form.Item>
                            </div>
                            <div
                                style={{
                                    width: `calc(${(1 / 9) * 24 * 100}%  - 12px)`,
                                    marginLeft: '12px',
                                }}
                            >
                                自费金额合计
                            </div>
                            <div
                                style={{
                                    width: `${(3.5 / 9) * 24 * 100}%`,
                                    marginLeft: '-12px',
                                }}
                            >
                                <Form.Item label="" name="totalOfOwnExpense" wrapperCol={24}>
                                    <InputNumber disabled={true} className={styles.input_number} />
                                </Form.Item>
                            </div>
                        </div>
                    </>
                )}
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item label="可报销金额" name="reimbursableAmount">
                            <InputNumber className={styles.input_number} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="享受待遇" name="reimburseRatioName">
                            <Input disabled={true} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="医事服务费" name="medicalServiceFee">
                            <InputNumber onClick={onMedicalServiceFee} className={styles.input_number} />
                        </Form.Item>
                    </Col>
                </Row>
                <div style={{ display: 'flex' }}>
                    <div
                        style={{
                            width: `calc(${(1 / 9) * 24 * 100}%  - 12px)`,
                            marginLeft: '12px',
                        }}
                    >
                        实际报销金额
                    </div>
                    <div style={{ width: `${(8 / 9) * 24 * 100}%`, marginLeft: '-12px' }}>
                        <Form.Item label="" name="reimburseAmount" wrapperCol={24}>
                            <InputNumber className={styles.input_number} />
                        </Form.Item>
                    </div>
                </div>
                <div style={{ display: 'flex' }}>
                    <div
                        style={{
                            width: `calc(${(1 / 9) * 24 * 100}%  - 12px)`,
                            marginLeft: '12px',
                        }}
                    >
                        支付方式
                    </div>
                    <div style={{ width: `${(8 / 9) * 24 * 100}%`, marginLeft: '-12px' }}>
                        <Form.Item label="" name="cmaPaymentMethodWayCode" wrapperCol={24}>
                            <Select className={styles.input_number}>
                                {/* {cmaPaymentMethodList &&
                  cmaPaymentMethodList?.map((item, index) => (
                    <Option
                      value={`${item.ID}&${item.WAY_CODE}&${item.WAY_NAME}`}
                      key={index}
                    >
                      {item.WAY_NAME}
                    </Option>
                  ))} */}
                                <Option value={`01`}>现金</Option>
                                <Option value={`02`}>个人储蓄卡</Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>
                <div style={{ display: 'flex' }}>
                    <div
                        style={{
                            width: `calc(${(1 / 9) * 24 * 100}%  - 12px)`,
                            marginLeft: '12px',
                        }}
                    >
                        现金
                    </div>
                    <div style={{ width: `${(3.5 / 9) * 24 * 100}%`, marginLeft: '-12px' }}>
                        <Form.Item label="" name="cashAmount" wrapperCol={24}>
                            <InputNumber
                                disabled={form?.getFieldValue('cmaPaymentMethodWayCode') == '02'}
                                className={styles.input_number}
                            />
                        </Form.Item>
                    </div>
                    <div
                        style={{
                            width: `calc(${(1 / 9) * 24 * 100}%  - 12px)`,
                            marginLeft: '12px',
                        }}
                    >
                        个人储蓄卡
                    </div>
                    <div style={{ width: `${(3.5 / 9) * 24 * 100}%`, marginLeft: '-12px' }}>
                        <Form.Item label="" name="personalDepositCardAmount" wrapperCol={24}>
                            <InputNumber
                                disabled={form?.getFieldValue('cmaPaymentMethodWayCode') == '01'}
                                onClick={onCard}
                                className={styles.input_number}
                            />
                        </Form.Item>
                    </div>
                </div>
                <div className={styles.footer_text}>
                    (1)自费金额=就诊金额×基础信息中收费种类对应的费率
                    <span>审核会计：{medicalRegistration?.approvalUserName}</span>
                </div>
                <div className={styles.footer_text}>(2)可报销金额＝票据总金额－自费金额合计</div>
                <div className={styles.footer_text}>(3)实际报销金额＝可报销金额×享受待遇+医事服务费</div>
            </Form>
        </GlobalModal>
    );
}
export default connect(({ medicalfee }) => {
    return { medicalfee };
})(Index);
