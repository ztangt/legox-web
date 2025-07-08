import { Form, Input, message, Spin } from 'antd';
import { connect } from 'dva';
import { useState } from 'react';
import GlobalModal from '../../../components/GlobalModal';
import PayModalCopy from './payModalCopy';

const FormItem = Form.Item;
const { TextArea } = Input;
const payModal = ({ dispatch, info, changeVisible, paymentMethod, getList }) => {
    const { payLoading } = paymentMethod;
    const [newShow, setNewShow] = useState(false);
    const changeNewShow = (isShow) => {
        setNewShow(isShow);
    };
    const [form] = Form.useForm();

    const onFinish = () => {
        let values = form.getFieldsValue();
        if (!values.newCheckNumber) {
            return message.error('请选择新支票号');
        }
        dispatch({
            type: 'paymentMethod/updateStates',
            payload: { payLoading: true },
        });
        dispatch({
            type: 'paymentMethod/putexChange',
            payload: {
                cashierInfoId: info.id,
                originCheckNo: info.checkNumber,
                newCheckNo: values.newCheckNumber,
                reason: values.reason,
                money: info.amount,
            },
            callback: () => {
                message.success('退换成功');
                changeVisible(false);
                getList();
            },
        });
    };
    const changeNewCheckNumber = (newInfo) => {
        form.setFieldValue('newCheckNumber', newInfo.checkNo);
    };
    const onFocus = () => {
        changeNewShow(true);
    };

    return (
        <>
            <GlobalModal
                title="支票退换"
                open={true}
                top={'2%'}
                onCancel={() => changeVisible(false)}
                getContainer={() => {
                    return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                }}
                maskClosable={false}
                mask={false}
                modalSize="smallBigger"
                onOk={onFinish}
            >
                <Spin spinning={payLoading}>
                    <h3 className="flex flex_center">支票退换</h3>
                    <Form
                        style={{ maxWidth: '500px', margin: '0 auto' }}
                        form={form}
                        colon={false}
                        initialValues={{ checkNumber: info?.checkNumber }}
                    >
                        <FormItem label={'原支票号'} name={'checkNumber'}>
                            <Input disabled />
                        </FormItem>
                        <FormItem
                            label={'新支票号'}
                            name={'newCheckNumber'}
                            rules={[{ required: true, message: '请选择新支票号' }]}
                        >
                            <Input onFocus={onFocus} placeholder={'请选择新支票号'} />
                        </FormItem>
                        <FormItem label={'作废原因'} name={'reason'}>
                            <TextArea rows={4} placeholder={'请输入作废原因'} />
                        </FormItem>
                    </Form>
                </Spin>
            </GlobalModal>

            {/* 弹窗显隐 */}
            {newShow && <PayModalCopy changeVisible={changeNewShow} getInfo={changeNewCheckNumber} />}
        </>
    );
};

export default connect(({ paymentMethod }) => ({ paymentMethod }))(payModal);
