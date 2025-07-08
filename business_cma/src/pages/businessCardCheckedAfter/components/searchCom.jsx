import { Button, DatePicker, Form, Input, Select } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import commonStyles from '../../../common.less';
import styles from '../index.less';

const FormItem = Form.Item;
const Index = ({
    dispatch,
    businessCardCheckedAfter,
    getList,
    onExport,
    onCancelVeri,
    onBatchHandle,
    changeFormInfo,
    number,
}) => {
    const { companyList, backAccountList, orgList } = businessCardCheckedAfter;
    const [form] = Form.useForm();

    const getFormValues = () => {
        let values = form.getFieldsValue();
        values = {
            ...values,
            startDate: values.startDate ? dayjs(values.startDate).format('YYYY-MM-DD') : '',
            endDate: values.endDate ? dayjs(values.endDate).format('YYYY-MM-DD') : '',
            cashierOrgId: values.cashierOrgId ? values.cashierOrgId : '', //这个值必须有，否则导出会报错
            reimbursementAccountType: values.reimbursementAccountType ? values.reimbursementAccountType : '', //这个值必须有，否则导出会报错
            voucherNumber: values.voucherNumber ? values.voucherNumber : '', //这个值必须有，否则导出会报错
        };
        return values;
    };

    const onExportBtn = () => {
        onExport(getFormValues());
    };
    //修改管理单位
    const changeOrg = (value) => {
        if (value) {
            dispatch({ type: 'businessCardCheckedAfter/getBankAccount', payload: { orgId: value } });
            form.setFieldValue('payerAccountNumber', '');
        }
    };
    // 查询
    const onSearch = () => {
        let values = getFormValues();
        changeFormInfo(values);
        getList();
    };

    return (
        <div id="businessCardCheckedAfter_head_id" className="pt10">
            <Form form={form} colon={false} className={[commonStyles.no_ellipsis_select, 'flex', 'flex_wrap']}>
                <FormItem label={'开始时间'} name={'startDate'}>
                    <DatePicker className={'width_100'} />
                </FormItem>
                <FormItem label={'结束时间'} name={'endDate'}>
                    <DatePicker className={'width_100'} />
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
                <FormItem label={'银行账户'} name={'payerAccountNumber'}>
                    <Select
                        placeholder={'请选择银行账户'}
                        options={backAccountList}
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </FormItem>
                <FormItem label={'账户性质'} name={'reimbursementAccountType'}>
                    <Select
                        placeholder={'请选择账户性质'}
                        options={companyList}
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </FormItem>
                <FormItem label={'单据编号'} name={'voucherNumber'}>
                    <Input placeholder={'请输入单据编号'}></Input>
                </FormItem>
                <Button className="ml8" onClick={onSearch}>
                    查询
                </Button>
            </Form>
            <div className="pl8 flex flex_justify_between flex_align_end">
                <div className={styles.total_amount}>
                    <span>选中</span>
                    <span className="gPrimary ml5 mr5">{number.length}笔</span>
                    <span>共计金额</span>
                    <span className="gPrimary ml5 mr5">{number.amount}</span>
                </div>
                <div>
                    <Button className="mr8 mb8" onClick={onCancelVeri}>
                        取消核对
                    </Button>
                    <Button className="mr8 mb8" onClick={onBatchHandle}>
                        汇总
                    </Button>
                    <Button className="mr8 mb8" onClick={onExportBtn}>
                        导出
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default connect(({ businessCardCheckedAfter }) => ({
    businessCardCheckedAfter,
}))(Index);
