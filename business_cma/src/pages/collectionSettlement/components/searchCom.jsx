import commonStyles from '@/common.less';
import styles from '@/pages/personCardDetail/index.less';
import { Button, DatePicker, Form, Input, Select } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import moment from 'moment/moment';
import { payTypeOptions } from './config';
const FormItem = Form.Item;

const Index = ({ dispatch, collectionSettlement, getList, changeFormInfo, number, onBatchHandle, text }) => {
    const { orgList, backAccountList, accountCodeList, payStateList } = collectionSettlement;
    const [form] = Form.useForm();
    const getFormValues = () => {
        let values = form.getFieldsValue();
        values.startCreateTime = values.startCreateTime ? dayjs(values.startCreateTime).format('YYYY-MM-DD') : '';
        values.endCreateTime = values.endCreateTime ? dayjs(values.endCreateTime).format('YYYY-MM-DD') : '';
        values.startPayTime = values.startPayTime ? dayjs(values.startPayTime).format('YYYY-MM-DD') : '';
        values.endPayTime = values.endPayTime ? dayjs(values.endPayTime).format('YYYY-MM-DD') : '';
        return values;
    };
    const onSearch = () => {
        let values = getFormValues();
        changeFormInfo(values);
        getList();
    };

    //修改管理单位
    const changeOrg = (value) => {
        form.setFieldsValue({ orgAccountCode: '', payerAccountNumber: '' });
        if (value) {
            dispatch({ type: 'collectionSettlement/getAccountCodeList', payload: { orgId: value } });
            dispatch({ type: 'collectionSettlement/getBankAccount', payload: { orgId: value } });
        }
    };

    const changeDate = (date, dateString) => {
        console.log('选择的业务日期', dateString);
        dispatch({
            type: 'collectionSettlement/updateStates',
            payload: { businessDate: dateString },
        });
    };

    const changeBankAccount = (value) => {
        let info = value ? backAccountList.find((item) => item.value == value) : null;
        console.log('选择的银行', info);
        dispatch({
            type: 'collectionSettlement/updateStates',
            payload: { bankKeyInfo: info },
        });
    };

    return (
        <div id="collectionSettlement_head_id" className="pt8">
            <Form
                form={form}
                initialValues={{ payState: 0 }}
                colon={false}
                className={[commonStyles.no_ellipsis_select, 'flex', 'flex_wrap']}
            >
                {/*业务日期在查询的时候不传，办理的时候传*/}
                <FormItem label={'业务日期'}>
                    <DatePicker defaultValue={moment()} className={'width_100'} onChange={changeDate} />
                </FormItem>

                <FormItem label={'办理状态'} name={'payState'}>
                    <Select
                        placeholder={'请选择办理状态'}
                        options={payStateList}
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </FormItem>
                <FormItem label={text} name={'reimbCardNum'}>
                    <Input placeholder={`请输入${text}`}></Input>
                </FormItem>
                <FormItem label={'管理单位'} name={'cashierOrgId'}>
                    <Select
                        placeholder={'请选择管理单位'}
                        options={orgList}
                        onChange={changeOrg}
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </FormItem>
                <FormItem label={'账套'} name={'orgAccountCode'}>
                    <Select
                        placeholder={'请选择账套'}
                        options={accountCodeList}
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </FormItem>
                <FormItem label={'银行账户'} name={'payerAccountNumber'}>
                    <Select
                        onChange={changeBankAccount}
                        placeholder={'请选择银行账户'}
                        options={backAccountList}
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </FormItem>
                <FormItem label={'单据编号'} name={'voucherNumber'}>
                    <Input placeholder={'请输入单据编号'}></Input>
                </FormItem>
                <FormItem label={'收款方式'} name={'payType'}>
                    <Select
                        placeholder={'请选择收款方式'}
                        options={payTypeOptions}
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </FormItem>
                <div className={'flex flex_wrap'}>
                    <FormItem label={'会计复核日期'} name={'startCreateTime'}>
                        <DatePicker className={'width_100'} />
                    </FormItem>
                    <FormItem label={'至'} name={'endCreateTime'}>
                        <DatePicker className={'width_100'} />
                    </FormItem>

                    <FormItem label={'出纳办理日期'} name={'startPayTime'}>
                        <DatePicker className={'width_100'} />
                    </FormItem>
                    <FormItem label={'至'} name={'endPayTime'}>
                        <DatePicker className={'width_100'} />
                    </FormItem>
                </div>
                <Button onClick={onSearch} className="ml8 mb8">
                    查询
                </Button>
            </Form>

            <div className="pl8 flex flex_justify_between flex_align_end pr8">
                <div className={styles.total_amount}>
                    <span>选中</span>
                    <span className="gPrimary ml5 mr5">{number.length}笔</span>
                    <span>收款金额为</span>
                    <span className="gPrimary ml5 mr5">{number.amount}</span>
                </div>
                <div>
                    <Button onClick={onBatchHandle} className="ml8 mb8">
                        批量办理
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default connect(({ collectionSettlement }) => ({
    collectionSettlement,
}))(Index);
