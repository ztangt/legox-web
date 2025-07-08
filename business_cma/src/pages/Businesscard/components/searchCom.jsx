import { Button, DatePicker, Form, Input, message, Select } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import commonStyles from '../../../common.less';
import styles from '../index.less';

const FormItem = Form.Item;

const Index = ({ dispatch, businessCard, number, changeFormInfo, getChecked, getList }) => {
    const { orgList, backAccountList, limit } = businessCard;
    const [form] = Form.useForm();

    const getFormValues = () => {
        let values = form.getFieldsValue();
        values = {
            ...values,
            startDate: values.startDate ? dayjs(values.startDate).format('YYYY-MM-DD') : '',
            endDate: values.endDate ? dayjs(values.endDate).format('YYYY-MM-DD') : '',
        };
        return values;
    };
    // 导出公务卡明细列表
    const onExportBtn = () => {
        let selectedRowKeys = getChecked().rowKeys;
        let values = getFormValues();
        console.log(selectedRowKeys, values, '--->导出操作的id');
        dispatch({ type: 'businessCard/updateStates', payload: { loading: true } });
        dispatch({
            type: 'businessCard/onExport',
            payload: {
                ...values,
                cashierInfoIds: selectedRowKeys.join(','),
                fileName: '公务卡明细列表',
                fileType: 'excel',
                exportType: selectedRowKeys.length ? 0 : 1,
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

    //查询
    const onSearch = () => {
        let values = getFormValues();
        changeFormInfo(values);
        getList(1, limit);
    };

    const changeOrg = (value) => {
        if (value) {
            dispatch({ type: 'businessCard/getBankAccount', payload: { orgId: value } });
            form.setFieldValue('payerAccountNumber', '');
        }
    };

    return (
        <div id="businessCard_head_id" className="pt10">
            <Form form={form} colon={false} className={[commonStyles.no_ellipsis_select, 'flex', 'flex_wrap']}>
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
                <FormItem label={'开始时间'} name={'startDate'}>
                    <DatePicker className={'width_100'} />
                </FormItem>
                <FormItem label={'结束时间'} name={'endDate'}>
                    <DatePicker className={'width_100'} />
                </FormItem>
                <FormItem label={'单据编号'} name={'voucherNumber'}>
                    <Input placeholder={'请输入单据编号'}></Input>
                </FormItem>
                <Button onClick={onSearch} className="ml8">
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
                    <Button className="mr8  mb8" onClick={onExportBtn}>
                        导出
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default connect(({ businessCard }) => ({
    businessCard,
}))(Index);
