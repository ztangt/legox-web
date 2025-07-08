import { Button, Col, Form, InputNumber, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { connect } from 'umi';
import GlobalModal from '../../../components/GlobalModal';
import styles from '../index.less';
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const { Option } = Select;
function Index({ dispatch, reimbursementRate }) {
    const [form] = Form.useForm();
    const [cmaPayKindList, setCmaPayKindList] = useState([]);
    const [cmaPersonnelMoldList, setCmaPersonnelMoldList] = useState([]);
    const { drugExpense, selfSetModal } = reimbursementRate;
    useEffect(() => {
        dispatch({
            type: 'reimbursementRate/updateStates',
            payload: {
                drugExpense: {},
            },
        });
        //人员类型
        dispatch({
            type: 'reimbursementRate/getLogicCode',
            payload: {
                logicCode: 'CMA_100010',
            },
            callback: (data) => {
                setCmaPersonnelMoldList(data);
            },
        });
        //收费种类
        dispatch({
            type: 'reimbursementRate/getLogicCode',
            payload: {
                logicCode: 'CMA_100013',
            },
            callback: (data) => {
                setCmaPayKindList(data);
            },
        });
    }, []);

    useEffect(() => {
        if (drugExpense?.cmaPayKindId && drugExpense?.cmaPersonnelMoldId) {
            //基本信息-报销费率-药费自费费率获取
            dispatch({
                type: 'reimbursementRate/getDrugExpense',
                payload: {
                    cmaPayKindId: drugExpense?.cmaPayKindId, //收费种类主键ID
                    cmaPersonnelMoldId: drugExpense?.cmaPersonnelMoldId, //人员类型主键ID
                },
                callback: (data) => {
                    form.setFieldsValue({ ownExpenseRatio: data.ownExpenseRatio, treatmentRatio: data.treatmentRatio });
                },
            });
        }
    }, [drugExpense?.cmaPayKindId, drugExpense?.cmaPersonnelMoldId]);
    const handelCanel = () => {
        dispatch({
            type: 'reimbursementRate/updateStates',
            payload: {
                selfSetModal: false,
                drugExpense: {},
            },
        });
    };
    //提交
    const onFinish = (values) => {
        const cmaPayKind = values?.['cmaPayKind']?.split('&');
        const cmaPersonnelMold = values?.['cmaPersonnelMold']?.split('&');
        dispatch({
            type: 'reimbursementRate/setDrugExpense',
            payload: JSON.stringify({
                ...drugExpense,
                ...values,
                ownExpenseRatio: values?.['ownExpenseRatio'],
                treatmentRatio: values?.['treatmentRatio'],
                cmaPersonnelMoldId: cmaPersonnelMold?.[0] || '',
                cmaPersonnelMoldObjCode: cmaPersonnelMold?.[1] || '',
                cmaPersonnelMoldObjName: cmaPersonnelMold?.[2] || '',
                cmaPayKindId: cmaPayKind?.[0] || '',
                cmaPayKindKindCode: cmaPayKind?.[1] || '',
                cmaPayKindKindName: cmaPayKind?.[2] || '',
            }),
            callback: () => {
                dispatch({
                    type: 'reimbursementRate/updateStates',
                    payload: {
                        selfSetModal: false,
                        drugExpense: {},
                    },
                });
            },
        });
    };
    const onValuesChange = (changedValues, allValues) => {
        const cmaPayKind = allValues?.['cmaPayKind']?.split('&');
        const cmaPersonnelMold = allValues?.['cmaPersonnelMold']?.split('&');
        dispatch({
            type: 'reimbursementRate/updateStates',
            payload: {
                drugExpense: {
                    ...drugExpense,
                    ...changedValues,
                    cmaPersonnelMoldId: cmaPersonnelMold?.[0] || '',
                    cmaPersonnelMoldObjCode: cmaPersonnelMold?.[1] || '',
                    cmaPersonnelMoldObjName: cmaPersonnelMold?.[2] || '',
                    cmaPayKindId: cmaPayKind?.[0] || '',
                    cmaPayKindKindCode: cmaPayKind?.[1] || '',
                    cmaPayKindKindName: cmaPayKind?.[2] || '',
                },
            },
        });
    };

    return (
        <GlobalModal
            open={true}
            title={'药费自费费率金额设置'}
            onCancel={handelCanel}
            maskClosable={false}
            mask={false}
            centered
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
            modalSize={'middle'}
        >
            <Form
                {...layout}
                colon={false}
                form={form}
                name="role"
                initialValues={drugExpense}
                onFinish={onFinish.bind(this)}
                onValuesChange={onValuesChange}
                labelAlign={'left'}
                className={styles.form_container}
            >
                <div style={{ display: 'flex' }}>
                    <div
                        style={{
                            width: `calc(${(1 / 6) * 24 * 100}%  - 12px)`,
                            marginLeft: '12px',
                        }}
                    >
                        人员类型
                    </div>
                    <div style={{ width: `${(5 / 6) * 24 * 100}%`, marginLeft: '-12px' }}>
                        <Form.Item
                            label={''}
                            name={'cmaPersonnelMold'}
                            wrapperCol={24}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择人员类型!',
                                },
                            ]}
                        >
                            <Select className={styles.input_number}>
                                {cmaPersonnelMoldList &&
                                    cmaPersonnelMoldList.map((item, index) => (
                                        <Option value={`${item.ID}&${item.OBJ_CODE}&${item.OBJ_NAME}`} key={index}>
                                            {item.OBJ_NAME}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>
                    </div>
                </div>
                <div style={{ display: 'flex' }}>
                    <div
                        style={{
                            width: `calc(${(1 / 6) * 24 * 100}%  - 12px)`,
                            marginLeft: '12px',
                        }}
                    >
                        收费种类
                    </div>
                    <div style={{ width: `${(5 / 6) * 24 * 100}%`, marginLeft: '-12px' }}>
                        <Form.Item
                            label={''}
                            name={'cmaPayKind'}
                            wrapperCol={24}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择收费种类!',
                                },
                            ]}
                        >
                            <Select className={styles.input_number}>
                                {cmaPayKindList &&
                                    cmaPayKindList.map((item, index) => (
                                        <Option value={`${item.ID}&${item.KIND_CODE}&${item.KIND_NAME}`} key={index}>
                                            {item.KIND_NAME}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>
                    </div>
                </div>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="自费比例" name="ownExpenseRatio">
                            <InputNumber className={styles.input_number} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="享受待遇" name="treatmentRatio" wrapperCol={24}>
                            <InputNumber className={styles.input_number} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </GlobalModal>
    );
}
export default connect(({ reimbursementRate }) => {
    return { reimbursementRate };
})(Index);
