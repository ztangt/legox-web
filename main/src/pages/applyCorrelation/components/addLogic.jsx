import React, { useEffect } from 'react'
import { connect } from 'dva'
import { Modal, Button, Input, Form,Col,Row } from 'antd'
import RelevanceApply from './relevanceApply';
import GlobalModal from '../../../componments/GlobalModal';
function addLogic({ dispatch, applyCorrelation }) {
    const layouts = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const { isApply, selectBusinessRows, detailData } = applyCorrelation
    console.log(selectBusinessRows, 'selectBusinessRows');
    const [form] = Form.useForm()
    // useEffect(() => {
    //     if (!detailData.logicId) {
    //         dispatch({
    //             type: 'applyCorrelation/getLogicCode',
    //             callback: (logicCode) => {
    //                 form.setFieldsValue({ logicCode: logicCode })
    //             }
    //         })
    //     }
    // }, [])
    useEffect(() => {
        if (selectBusinessRows.length == 1) {
            form.setFieldsValue({ bizSolName: selectBusinessRows[0].bizSolName })
        }
    }, [selectBusinessRows])
    const onCancel = () => {
        dispatch({
            type: 'applyCorrelation/updateStates',
            payload: {
                isShow: false,
                detailData: {},
                selectBusinessRows:[],
                selectBusiness:[]
            }
        })
    }
    const onFocus = () => {
        dispatch({
            type: 'applyCorrelation/updateStates',
            payload: {
                isApply: true
            }
        })
        dispatch({
            type: 'applyCorrelation/getCtlgTree',
            payload: {
                type: 'ALL',
                hasPermission: '0'
            },
            callback: function () {
                // dispatch({
                //     type: 'moduleResourceMg/updateStates',
                //     payload: {
                //         selectBizsolModal: true,
                //         businessList: [],
                //     }
                // })
            }
        })
    }
    const onFinish = (values) => {
        console.log(values);
        if (detailData.logicId) {
            dispatch({
                type: 'applyCorrelation/updateApplyCorrelation',
                payload: {
                    bizSolId: selectBusinessRows[0]?.bizSolId,
                    bizSolName: selectBusinessRows[0]?.bizSolName,
                    logicName: values.logicName,
                    logicCode: values.logicCode,
                    logicId: detailData.logicId
                }
            })
        }
        else {
            dispatch({
                type: 'applyCorrelation/addApplyCorrelation',
                payload: {
                    bizSolId: selectBusinessRows[0]?.bizSolId,
                    bizSolName: selectBusinessRows[0]?.bizSolName,
                    logicName: values.logicName,
                    logicCode: values.logicCode
                }
            })
        }
        dispatch({
            type: 'applyCorrelation/updateStates',
            payload: {
                isShow: false,
                detailData: {},
                selectBusinessRows:[],
                selectBusiness:[],
            }
        })
    }
    return (
        <div>
            <GlobalModal
                // width={400}
                widthType={1}
                incomingWidth={420}
                incomingHeight={200}
                visible={true}
                title={detailData.logicId?'修改逻辑功能':'新建逻辑功能'}
                onCancel={onCancel}
                mask={false}
                maskClosable={false}
                getContainer={() => {
                    return document.getElementById('applyCorrelation_container')||false
                }}
                footer={[
                    <Button onClick={onCancel} key='cancel'>取消</Button>, <Button key={'primary'} type='primary' htmlType='submit' onClick={() => { form.submit() }}>确定</Button>,
                ]}
                // bodyStyle={{height:200}}
            >
                <Form {...layouts} form={form}
                    onFinish={onFinish}
                    initialValues={{
                        bizSolId: detailData.bizSolId,
                        bizSolName: detailData.bizSolName,
                        logicName: detailData.logicName,
                        logicCode: detailData.logicCode
                    }}
                >
                    <Form.Item label='逻辑功能名称' name='logicName'>
                        <Input />
                    </Form.Item>
                    <Form.Item label='逻辑功能编码' name='logicCode'>
                        <Input />
                    </Form.Item>
                    <Form.Item label='绑定业务应用建模' name='bizSolName'>
                        <Input onFocus={onFocus} />
                    </Form.Item>
                    <Row gutter={0}>
                        <Col span={8}>
                        </Col>
                        <Col span={16}>
                        <p style={{color:'#ff4d4f'}}> {detailData.logicId&&!detailData.bizSolId&&!selectBusinessRows[0]?.bizSolId&&'请绑定业务应用建模'}</p>
                        </Col>
                    </Row>
                </Form>
            </GlobalModal>
            {isApply && <RelevanceApply />}
        </div>
    )
}
export default connect(({ applyCorrelation }) => ({ applyCorrelation }))(addLogic)

