import commonStyles from '@/common.less';
import { Button, DatePicker, Form, Input, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../index.less';
const FormItem = Form.Item;
const Index = ({ dispatch, cashDeposit }) => {
    const { limit, accountTypeList, orgList, accountList } = cashDeposit;
    // 时间选择
    const timerChange = (value, valueString) => {
        dispatch({
            type: 'cashDeposit/updateStates',
            payload: {
                businessDate: valueString,
            },
        });
    };
    const [form] = Form.useForm();
    // 查询
    const onSearch = () => {
        let values = form.getFieldsValue();
        dispatch({ type: 'cashDeposit/updateStates', payload: { formInfo: { ...values }, loading: true } });
        dispatch({ type: 'cashDeposit/getList', payload: { ...values, start: 1, limit } });
    };

    const defaultDate = moment();

    const changeOrg = (value) => {
        if (value) {
            dispatch({ type: 'cashDeposit/getBankAccount', payload: { orgId: value } });
            form.setFieldValue('payerAccountNumber', '');
        }
    };
    return (
        <div id="cashDeposit_list_head" className={styles.cashDeposit_list_head}>
            <div className={'flex flex_justify_between'}>
                <Form form={form} colon={false} className={[commonStyles.ui_form_box, 'flex', 'flex_wrap', 'flex_1']}>
                    <FormItem label={'管理单位'} name={'orgId'}>
                        <Select
                            placeholder={'请选择管理单位'}
                            options={orgList}
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            allowClear
                            onChange={changeOrg}
                            showSearch
                            optionFilterProp="label"
                        />
                    </FormItem>
                    <FormItem label={'银行账户'} name={'payerAccountNumber'}>
                        <Select
                            placeholder={'请选择银行账户'}
                            options={accountList}
                            allowClear
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        />
                    </FormItem>

                    <FormItem label={'账户性质'} name={'accountType'}>
                        <Select placeholder={'请选择账户性质'} options={accountTypeList} allowClear />
                    </FormItem>
                    <FormItem label={'关键字'} name={'searchWord'}>
                        <Input placeholder={'请输入关键字'}></Input>
                    </FormItem>
                    <Button onClick={onSearch} className={'mb8 ml8'}>
                        查询
                    </Button>
                </Form>

                <div className="flex mr8">
                    <div style={{ lineHeight: '32px' }} className="mr8">
                        日期选择
                    </div>
                    <DatePicker defaultValue={defaultDate} onChange={timerChange} />
                </div>
            </div>
        </div>
    );
};

export default connect(({ cashDeposit }) => ({
    cashDeposit,
}))(Index);
