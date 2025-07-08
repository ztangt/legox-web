import { Modal, Form, Input, Button, Select, Radio, Row, Col, TreeSelect, InputNumber, Switch } from 'antd';
import { connect } from 'umi';
import { useEffect, useState } from 'react';
import styles from '../index.less';
import GlobalModal from '../../../components/GlobalModal';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const { Option } = Select;
function Index({ dispatch, medicalfee, mform, onMformFinish }) {
    const [form] = Form.useForm();
    const [economicSubjectList, setEconomicSubjectList] = useState([]);
    const { medicalRegistration, isConfirm } = medicalfee;
    useEffect(() => {
        form.setFieldsValue({
            cmaPaymentMethodWayAmount: mform.getFieldValue('personalDepositCardAmount'),
        });
        //获取经济分类码表值
        dispatch({
            type: 'medicalfee/getEconomicClassify',
            payload: {},
            callback: (data) => {
                if (data.length) {
                    var list = _.uniqBy(data, 'code'); //根据code编码去重
                    setEconomicSubjectList(list);
                    if (!medicalRegistration?.economicSubject && medicalRegistration?.cmaEmployeeOrgId) {
                        //经济分类中无值
                        var index = _.findIndex(list, {
                            orgId: medicalRegistration?.cmaEmployeeOrgId,
                        }); //根据职工单位主键id	取经济分类默认值
                        if (index != -1) {
                            var obj = list[index];
                            form.setFieldsValue({
                                economicSubject: `${obj?.code}&${obj?.name}`,
                            });
                        }
                    }
                }
            },
        });
    }, []);
    const handelCanel = () => {
        dispatch({
            type: 'medicalfee/updateStates',
            payload: {
                selfCardModal: false,
            },
        });
    };
    //提交
    const onFinish = (values) => {
        for (let key in values) {
            if (typeof values[key] == 'string') {
                values[key] = values[key].trim();
            }
        }
        const economicSubject = values['economicSubject']?.split('&');
        mform.setFieldsValue({
            [medicalRegistration?.cmaPaymentMethodWayCode == '01' ? 'cashAmount' : 'personalDepositCardAmount']:
                values['cmaPaymentMethodWayAmount'],
        });
        var obj = {
            ...medicalRegistration,
            ...values,
            // economicSubjectId: economicSubject?.[0]||'',
            economicSubjectCode: economicSubject?.[0] || '',
            economicSubjectName: economicSubject?.[1] || '',
        };
        if (isConfirm) {
            dispatch({
                type: 'medicalfee/updateStates',
                payload: {
                    isConfirm: false,
                    medicalRegistration: obj,
                },
            });
            setTimeout(() => {
                onMformFinish(mform.getFieldsValue(true));
            }, 1000);

            return;
        }
        dispatch({
            type: 'medicalfee/updateStates',
            payload: {
                medicalRegistration: obj,
                selfCardModal: false,
            },
        });
    };
    const onValuesChange = (changedValues, allValues) => {
        // dispatch({
        //   type:"medicalfee/updateStates",
        //   payload:{
        //     medicalRegistration:{
        //         medicalRegistration,
        //         ...changedValues,
        //     }
        //   }
        // })
    };

    return (
        <GlobalModal
            open={true}
            title={'个人储蓄卡明细'}
            onCancel={handelCanel}
            maskClosable={false}
            mask={false}
            centered
            modalSize="middle"
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
            <Form
                {...layout}
                colon={false}
                form={form}
                name="role"
                initialValues={medicalRegistration}
                onFinish={onFinish.bind(this)}
                onValuesChange={onValuesChange}
                labelAlign={'right'}
                className={styles.form_container}
            >
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item label="姓名" name="personName">
                            <Input disabled={true} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="身份证号" name="idCard">
                            <Input disabled={true} />
                        </Form.Item>
                    </Col>
                    <Col span={8}></Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item label="卡号" name="bankCardNumCategory">
                            <Input disabled={true} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="开户银行" name="depositBankName">
                            <Input disabled={true} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="开户行号" name="depositBankNo">
                            <Input disabled={true} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item label="报销金额" name="cmaPaymentMethodWayAmount">
                            <InputNumber className={styles.input_number} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="经济分类" name="economicSubject" wrapperCol={24}>
                            <Select className={styles.input_number}>
                                {economicSubjectList &&
                                    economicSubjectList.map((item, index) => (
                                        <Option value={`${item?.code}&${item?.name}`} key={index}>
                                            {item.name}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}></Col>
                </Row>
            </Form>
        </GlobalModal>
    );
}
export default connect(({ medicalfee }) => {
    return { medicalfee };
})(Index);
