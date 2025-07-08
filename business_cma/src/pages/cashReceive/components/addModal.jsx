import { Button, DatePicker, Form, InputNumber, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import GlobalModal from '../../../components/GlobalModal';
const FormItem = Form.Item;

const AddModal = ({ dispatch, cashReceive, getList, changeVisible }) => {
    const { userList, currentPage, limit, orgList, businessDate, manageOrgId, formInfo } = cashReceive;
    const [form] = Form.useForm();

    let initialValues = {
        manageOrgId: formInfo.orgId,
        businessDate: formInfo.businessDate ? moment(formInfo.businessDate) : '',
    };

    //点击保存调用接口
    const onSave = () => {
        form.validateFields()
            .then((values) => {
                let { receiveUserId, receiveAmount, manageOrgId, businessDate } = values;
                let receiveUserName = userList.find((item) => item.value == receiveUserId)?.label;
                dispatch({
                    type: 'cashReceive/saveCashReceive',
                    payload: JSON.stringify({
                        receiveAmount,
                        receiveUserId,
                        receiveUserName,
                        businessDate: moment(businessDate).format('YYYY-MM-DD'),
                        manageOrgId,
                    }),
                    callback: (data) => {
                        changeVisible(false); // 隐藏登记弹窗
                        getList(currentPage, limit);
                    },
                });
            })
            .catch((errorInfo) => {
                console.log('Failed:', errorInfo);
            });
    };
    return (
        <div>
            <GlobalModal
                title="现金领用登记"
                open={true}
                footer={[
                    <Button onClick={() => changeVisible(false)}>取消</Button>,
                    <Button type="primary" onClick={onSave}>
                        保存
                    </Button>,
                ]}
                onCancel={() => changeVisible(false)}
                getContainer={() => {
                    return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                }}
                bodyStyle={{ height: '300px' }}
                maskClosable={false}
                mask={false}
                modalSize="small"
            >
                <Form form={form} initialValues={initialValues}>
                    <FormItem
                        label={'管理单位'}
                        name={'manageOrgId'}
                        rules={[{ required: true, message: '请选择管理单位!' }]}
                    >
                        <Select
                            placeholder={'请选择管理单位'}
                            options={orgList}
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            allowClear
                        />
                    </FormItem>
                    <FormItem
                        label={'业务日期'}
                        name={'businessDate'}
                        rules={[{ required: true, message: '请选择业务日期!' }]}
                    >
                        <DatePicker className={'width_100'} />
                    </FormItem>
                    <FormItem
                        label="领用人"
                        name="receiveUserId"
                        rules={[{ required: true, message: '请选择领用人!' }]}
                    >
                        <Select placeholder={'请选择领用人'} options={userList} allowClear />
                    </FormItem>

                    <FormItem
                        label="金额"
                        name="receiveAmount"
                        rules={[
                            { required: true, message: '' },
                            {
                                validator: (rule, value) => {
                                    if (value > 0) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('请输入大于0的金额!');
                                },
                            },
                        ]}
                    >
                        <InputNumber min={0} />
                    </FormItem>
                </Form>
            </GlobalModal>
        </div>
    );
};

export default connect(({ cashReceive }) => ({ cashReceive }))(AddModal);
