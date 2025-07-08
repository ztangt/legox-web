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
    const [cmaHospitalNatureList, setCmaHospitalNatureList] = useState([]);
    const [cmaPrincipleOfProximityList, setCmaPrincipleOfProximityList] = useState([]);
    const { serviceCharge, serviceSetModal } = reimbursementRate;
    useEffect(() => {
        dispatch({
            type: 'reimbursementRate/updateStates',
            payload: {
                serviceCharge: {},
            },
        });
        //医院性质
        dispatch({
            type: 'reimbursementRate/getLogicCode',
            payload: {
                logicCode: 'CMA_100009',
            },
            callback: (data) => {
                setCmaHospitalNatureList(data);
            },
        });
        //就诊方式
        dispatch({
            type: 'reimbursementRate/getLogicCode',
            payload: {
                logicCode: 'CMA_100011',
            },
            callback: (data) => {
                setCmaPrincipleOfProximityList(data);
            },
        });
    }, []);

    useEffect(() => {
        if (serviceCharge?.cmaHospitalNatureId && serviceCharge?.cmaPrincipleOfProximityId) {
            //基本信息-报销费率-医事服务费金额获取
            dispatch({
                type: 'reimbursementRate/getServiceCharge',
                payload: {
                    cmaHospitalNatureId: serviceCharge?.cmaHospitalNatureId, //医院性质主键ID
                    cmaPrincipleOfProximityId: serviceCharge?.cmaPrincipleOfProximityId, //就诊方式主键ID
                },
                callback: (data) => {
                    form.setFieldsValue(data);
                },
            });
        }
        // else {
        //     if (!serviceCharge?.serviceChargeList?.length) {
        //         dispatch({
        //             type: 'reimbursementRate/getLogicCode', //获取人员类型
        //             payload: {
        //                 logicCode: 'CMA_100010',
        //             },
        //             callback: (data) => {
        //                 var list = data?.map((item) => {
        //                     return {
        //                         cmaPersonnelMoldId: item?.ID,
        //                         cmaPersonnelMoldObjCode: item?.OBJ_CODE,
        //                         cmaPersonnelMoldObjName: item?.OBJ_NAME,
        //                     };
        //                 });
        //                 dispatch({
        //                     type: 'reimbursementRate/updateStates',
        //                     payload: {
        //                         serviceCharge: {
        //                             ...serviceCharge,
        //                             serviceChargeList: list,
        //                         },
        //                     },
        //                 });
        //             },
        //         });
        //     }
        // }
    }, [
        serviceCharge?.cmaHospitalNatureId,
        serviceCharge?.cmaPrincipleOfProximityId,
        // serviceCharge?.serviceChargeList,
    ]);
    useEffect(() => {
        if (!serviceCharge?.serviceChargeList?.length) {
            dispatch({
                type: 'reimbursementRate/getLogicCode', //获取人员类型
                payload: {
                    logicCode: 'CMA_100010',
                },
                callback: (data) => {
                    var list = data?.map((item) => {
                        return {
                            cmaPersonnelMoldId: item?.ID,
                            cmaPersonnelMoldObjCode: item?.OBJ_CODE,
                            cmaPersonnelMoldObjName: item?.OBJ_NAME,
                        };
                    });
                    dispatch({
                        type: 'reimbursementRate/updateStates',
                        payload: {
                            serviceCharge: {
                                ...serviceCharge,
                                serviceChargeList: list,
                            },
                        },
                    });
                },
            });
        }
    }, [serviceCharge?.serviceChargeList]);
    const handelCanel = () => {
        serviceCharge?.serviceChargeList.map((item) => {
            form.setFieldsValue({ [item?.cmaPersonnelMoldId]: '' });
        });
        dispatch({
            type: 'reimbursementRate/updateStates',
            payload: {
                serviceSetModal: false,
            },
        });
        dispatch({
            type: 'reimbursementRate/updateStates',
            payload: {
                serviceCharge: {},
            },
        });
    };
    //提交
    const onFinish = (values) => {
        const cmaHospitalNature = values?.['cmaHospitalNature']?.split('&');
        const cmaPrincipleOfProximity = values?.['cmaPrincipleOfProximity']?.split('&');
        var dataList = serviceCharge?.serviceChargeList?.map((item) => {
            return {
                ...item,
                cmaHospitalNatureId: cmaHospitalNature?.[0] || '',
                cmaHospitalNatureRankCode: cmaHospitalNature?.[1] || '',
                cmaHospitalNatureRankName: cmaHospitalNature?.[2] || '',
                cmaPrincipleOfProximityId: cmaPrincipleOfProximity?.[0] || '',
                cmaPrincipleOfProximityWayCode: cmaPrincipleOfProximity?.[1] || '',
                cmaPrincipleOfProximityWayName: cmaPrincipleOfProximity?.[2] || '',
                cmaMedicalServiceAmount: values[item.cmaPersonnelMoldId],
            };
        });
        dispatch({
            type: 'reimbursementRate/setServiceCharge',
            payload: JSON.stringify(dataList),
            callback: handelCanel(),
        });
    };
    const onValuesChange = (changedValues, allValues) => {
        const cmaHospitalNature = allValues?.['cmaHospitalNature']?.split('&');
        const cmaPrincipleOfProximity = allValues?.['cmaPrincipleOfProximity']?.split('&');
        if (changedValues?.cmaHospitalNature || changedValues?.cmaPrincipleOfProximity) {
            serviceCharge?.serviceChargeList.map((item) => {
                form.setFieldsValue({ [item?.cmaPersonnelMoldId]: '' });
            });
            dispatch({
                type: 'reimbursementRate/updateStates',
                payload: {
                    serviceCharge: {
                        ...serviceCharge,
                        cmaHospitalNatureId: cmaHospitalNature?.[0] || '',
                        cmaHospitalNatureRankCode: cmaHospitalNature?.[1] || '',
                        cmaHospitalNatureRankName: cmaHospitalNature?.[2] || '',
                        cmaPrincipleOfProximityId: cmaPrincipleOfProximity?.[0] || '',
                        cmaPrincipleOfProximityWayCode: cmaPrincipleOfProximity?.[1] || '',
                        cmaPrincipleOfProximityWayName: cmaPrincipleOfProximity?.[2] || '',
                    },
                },
            });
        }
    };

    return (
        <GlobalModal
            open={true}
            title={'医事服务费金额设置'}
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
            modalSize="middle"
        >
            <Form
                {...layout}
                colon={false}
                form={form}
                name="role"
                initialValues={serviceCharge}
                onFinish={onFinish.bind(this)}
                onValuesChange={onValuesChange}
                labelAlign={'left'}
                className={styles.form_container}
            >
                <div style={{ display: 'flex' }}>
                    <div
                        style={{
                            width: `calc(${(1 / 9) * 24 * 100}%  - 12px)`,
                            marginLeft: '12px',
                        }}
                    >
                        医院性质
                    </div>
                    <div style={{ width: `${(8 / 9) * 24 * 100}%`, marginLeft: '-12px' }}>
                        <Form.Item
                            label={''}
                            name={'cmaHospitalNature'}
                            wrapperCol={24}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择医院性质!',
                                },
                            ]}
                        >
                            <Select className={styles.input_number}>
                                {cmaHospitalNatureList &&
                                    cmaHospitalNatureList.map((item, index) => (
                                        <Option value={`${item.ID}&${item.RANK_CODE}&${item.RANK_NAME}`} key={index}>
                                            {item.RANK_NAME}
                                        </Option>
                                    ))}
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
                        就诊方式
                    </div>
                    <div style={{ width: `${(8 / 9) * 24 * 100}%`, marginLeft: '-12px' }}>
                        <Form.Item
                            label={''}
                            name={'cmaPrincipleOfProximity'}
                            wrapperCol={24}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择就诊方式!',
                                },
                            ]}
                        >
                            <Select className={styles.input_number}>
                                {cmaPrincipleOfProximityList &&
                                    cmaPrincipleOfProximityList.map((item, index) => (
                                        <Option value={`${item.ID}&${item.WAY_CODE}&${item.WAY_NAME}`} key={index}>
                                            {item.WAY_NAME}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>
                    </div>
                </div>
                <Row gutter={24} style={{ display: 'flex' }} className={styles.row_container}>
                    {serviceCharge?.serviceChargeList?.map((item, index) => {
                        return (
                            <Col span={8} key={index}>
                                <Form.Item label={item?.cmaPersonnelMoldObjName} name={item?.cmaPersonnelMoldId}>
                                    <InputNumber className={styles.input_number} />
                                </Form.Item>
                            </Col>
                        );
                    })}
                </Row>
            </Form>
        </GlobalModal>
    );
}
export default connect(({ reimbursementRate }) => {
    return { reimbursementRate };
})(Index);
