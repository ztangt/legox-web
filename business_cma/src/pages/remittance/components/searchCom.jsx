import { Button, DatePicker, Form, Input, message, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import moment from 'moment';
import commonStyles from '../../../common.less';
import styles from '../index.less';

const FormItem = Form.Item;

const Index = ({ dispatch, remittance, getList, number, changeFormInfo, getChecked, text }) => {
    const { payStateList, backAccountList, accountCodeList, orgList } = remittance;
    const [form] = Form.useForm();

    const getFormValues = () => {
        let values = form.getFieldsValue();
        values.startCreateTime = values.startCreateTime ? dayjs(values.startCreateTime).format('YYYY-MM-DD') : '';
        values.endCreateTime = values.endCreateTime ? dayjs(values.endCreateTime).format('YYYY-MM-DD') : '';
        values.startPayTime = values.startPayTime ? dayjs(values.startPayTime).format('YYYY-MM-DD') : '';
        values.endPayTime = values.endPayTime ? dayjs(values.endPayTime).format('YYYY-MM-DD') : '';
        return values;
    };

    //查询
    const onSearch = () => {
        let values = getFormValues();
        changeFormInfo(values);
        getList();
    };

    //零余额、非零余额导出
    const onExport = (type) => {
        let { rows: selectedRows, rowKeys: selectedRowKeys } = getChecked();
        let typeStr = type == 1 ? '非零余额' : '零余额';
        if (!selectedRows.length) {
            return message.error('请选择操作项');
        }
        if (type == 1 && selectedRows.find((item) => item.reimbursementAccountType == 7)) {
            return message.error('请选择同类型账户（非零余额）');
        }
        if (type == 0 && selectedRows.find((item) => item.reimbursementAccountType != 7)) {
            return message.error('请选择同类型账户（零余额）');
        }
        dispatch({ type: 'remittance/updateStates', payload: { loading: true } });
        dispatch({
            type: 'remittance/exportByBankFormat',
            payload: {
                cashierInfoIds: selectedRowKeys.join(','),
                fileType: 'excel',
                fileName: `转账汇款${typeStr}导出`,
                exportType: 0,
            },
            callback: function (path) {
                if (!path) {
                    return;
                }
                message.success('导出成功');
                // 这里的文件名根据实际情况从响应头或者url里获取
                const a = document.createElement('a');
                a.href = path;
                a.click();
            },
        });
    };

    //批量处理
    const onBatchHandle = () => {
        let { rows: selectedRows, rowKeys: selectedRowKeys } = getChecked();
        if (!selectedRowKeys.length) {
            return message.error('请选择操作项');
        }
        if (selectedRows.find((item) => item.payState == 1)) {
            return message.error('请选择待办理项');
        }

        dispatch({
            type: 'remittance/getState',
            callback: ({ businessDate, bankKeyInfo }) => {
                if (!businessDate) {
                    return message.error('请选择业务日期');
                }
                let tenantMark = localStorage.getItem('tenantMark');
                let isProvincial = !!(tenantMark && tenantMark != '860396'); //只要不是860396的租户，就是省局，省局的办理要必填银行账户
                if (isProvincial && !bankKeyInfo) {
                    return message.error('请选择银行账户');
                }

                Modal.confirm({
                    title: '提示',
                    content: `确认要批量办理？`,
                    okText: '确定',
                    maskClosable: false,
                    mask: false,
                    getContainer: document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false,
                    onOk() {
                        dispatch({
                            type: 'remittance/updateStates',
                            payload: { loading: true },
                        });
                        let postData = {
                            cashierInfoId: selectedRowKeys.join(','),
                            businessDate: dayjs(businessDate).unix(),
                        };
                        if (isProvincial) {
                            postData.bankKey = bankKeyInfo.BANK_ACCOUNT_PRIMARY_KEY;
                        }
                        dispatch({
                            type: 'remittance/generate',
                            payload: { ...postData },
                            callback() {
                                message.success('批量办理成功!');
                                getList();
                            },
                        });
                    },
                });
            },
        });
    };

    //修改管理单位
    const changeOrg = (value) => {
        form.setFieldsValue({ orgAccountCode: '', payerAccountNumber: '' });
        if (value) {
            dispatch({ type: 'remittance/getAccountCodeList', payload: { orgId: value } }); //获取账套
            dispatch({ type: 'remittance/getBankAccount', payload: { orgId: value } }); //获取银行账户
        }
    };
    //修改业务日期
    const changeBusinessDate = (date, dateString) => {
        console.log('选择的日期', dateString);
        dispatch({
            type: 'remittance/updateStates',
            payload: { businessDate: dateString },
        });
    };

    //修改银行账户
    const changeBankAccount = (value) => {
        let info = value ? backAccountList.find((item) => item.value == value) : null;
        console.log('选择的银行', info);
        dispatch({
            type: 'remittance/updateStates',
            payload: { bankKeyInfo: info },
        });
    };

    return (
        <div id="remittance_head_id" className="pt8">
            <Form
                form={form}
                initialValues={{ payState: 0 }}
                colon={false}
                className={[commonStyles.no_ellipsis_select, 'flex', 'flex_wrap']}
            >
                {/*业务日期在查询的时候不传，办理的时候传*/}
                <FormItem label={'业务日期'}>
                    <DatePicker defaultValue={moment()} className={'width_100'} onChange={changeBusinessDate} />
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
                <FormItem label={text} name={'reimbCardNum'}>
                    <Input placeholder={`请输入${text}`} />
                </FormItem>
                <FormItem label={'单据编号'} name={'voucherNumber'}>
                    <Input placeholder={'请输入单据编号'}></Input>
                </FormItem>
                <FormItem label={'办理状态'} name={'payState'}>
                    <Select
                        placeholder={'请选择办理状态'}
                        options={payStateList}
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
                    <Button className="mr8 mb8" onClick={onBatchHandle}>
                        批量办理
                    </Button>
                    <Button className="mr8 mb8" onClick={() => onExport(0)}>
                        按银行格式导出(零余额)
                    </Button>
                    <Button className="mr8 mb8" onClick={() => onExport(1)}>
                        按银行格式导出(非零余额)
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default connect(({ remittance }) => ({
    remittance,
}))(Index);
