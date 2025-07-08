import { Button, DatePicker, Form, Input, message, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import commonStyles from '../../../common.less';
import styles from '../index.less';

const FormItem = Form.Item;

const personCardDetailData = ({
    dispatch,
    personCardDetail,
    getList,
    formInfo,
    getChecked,
    number,
    changeFormInfo,
    text,
}) => {
    const { orgList, backAccountList } = personCardDetail;

    // 取消汇总
    const onSummary = () => {
        let selectedRowKeys = getChecked().rowKeys;
        if (selectedRowKeys.length == 0) {
            message.error('请选择数据');
            return;
        }
        if (!formInfo.payerAccountNumber) {
            // 选择银行账户,是为了确保汇总时的银行账户是一致的
            return message.error('请选择银行账户后查询,保证汇总时单据的银行账户一致');
        }
        Modal.confirm({
            title: '提示',
            content: `确定要汇总吗?`,
            okText: '确定',
            maskClosable: false,
            mask: false,
            getContainer: document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false,
            onOk() {
                dispatch({
                    type: 'personCardDetail/updateStates',
                    payload: { loading: true },
                });
                dispatch({
                    type: 'personCardDetail/personCardCollect',
                    payload: { type: 1, cashierInfoId: selectedRowKeys.join(',') },
                    callback() {
                        message.success('汇总成功!');
                        getList();
                    },
                });
            },
        });
    };

    const getFormValues = () => {
        let values = form.getFieldsValue();
        values.startCreateTime = values.startCreateTime ? dayjs(values.startCreateTime).format('YYYY-MM-DD') : '';
        values.endCreateTime = values.endCreateTime ? dayjs(values.endCreateTime).format('YYYY-MM-DD') : '';
        values.startPayTime = values.startPayTime ? dayjs(values.startPayTime).format('YYYY-MM-DD') : '';
        values.endPayTime = values.endPayTime ? dayjs(values.endPayTime).format('YYYY-MM-DD') : '';
        return values;
    };
    //导出
    const onExport = () => {
        let values = getFormValues();
        let selectedRowKeys = getChecked().rowKeys;
        dispatch({
            type: 'personCardDetail/updateStates',
            payload: { loading: true },
        });
        dispatch({
            type: 'personCardDetail/exportAll',
            payload: {
                cashierInfoIds: selectedRowKeys.join(','),
                ...values,
                exportType: selectedRowKeys.length ? 0 : 1,
                fileType: 'xls',
                fileName: '个人储蓄卡明细导出',
            },
        });
    };

    const [form] = Form.useForm();
    //修改管理单位
    const changeOrg = (value) => {
        if (value) {
            dispatch({ type: 'personCardDetail/getBankAccount', payload: { orgId: value } }); //获取银行账户
        }
        form.setFieldValue('payerAccountNumber', '');
    };

    //查询
    const onSearch = () => {
        let values = getFormValues();
        changeFormInfo(values);
        getList();
    };

    //零余额、非零余额导出
    const onExportByBankFormat = (type) => {
        let { rowKeys: selectedRowKeys, rows: selectedRows } = getChecked();
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
        dispatch({
            type: 'personCardDetail/updateStates',
            payload: { loading: true },
        });
        dispatch({
            type: 'personCardDetail/exportByBankFormat',
            payload: {
                cashierInfoIds: selectedRowKeys.join(','),
                fileType: 'excel',
                fileName: `个人储蓄卡${typeStr}导出`,
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
    return (
        <div id="personCardDetail_list_id" className="pt10">
            <Form
                form={form}
                initialValues={{ payState: 0 }}
                colon={false}
                className={[commonStyles.no_ellipsis_select, 'flex', 'flex_wrap']}
            >
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
                <FormItem label={'单据编号'} name={'voucherNumber'}>
                    <Input placeholder={'请输入单据编号'}></Input>
                </FormItem>
                <FormItem label={text} name={'reimbCardNum'}>
                    <Input placeholder={`请输入${text}`}></Input>
                </FormItem>
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
                    <Button className="mr8 mb8" onClick={onSummary}>
                        汇总
                    </Button>
                    <Button className="mr8 mb8" onClick={onExport}>
                        导出
                    </Button>
                    <Button className="mr8 mb8" onClick={() => onExportByBankFormat(0)}>
                        按银行格式导出(零余额)
                    </Button>
                    <Button className="mr8 mb8" onClick={() => onExportByBankFormat(1)}>
                        按银行格式导出(非零余额)
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default connect(({ personCardDetail }) => ({
    personCardDetail,
}))(personCardDetailData);
