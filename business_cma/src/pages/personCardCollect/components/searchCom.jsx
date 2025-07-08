import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import moment from 'moment';
import { useState } from 'react';
import commonStyles from '../../../common.less';
import styles from '../index.less';
const FormItem = Form.Item;

const Index = ({ dispatch, personCardCollect, getList, onBatchHandle, changeFormInfo, number, getChecked }) => {
    const { accountList, payStateList, reNumList, orgList, fundSourceList } = personCardCollect;
    const [form] = Form.useForm();

    const getFormValues = () => {
        let values = form.getFieldsValue();
        values.businessDate = values.businessDate ? dayjs(values.businessDate).format('YYYY-MM-DD') : '';
        values.startCreateTime = values.startCreateTime ? dayjs(values.startCreateTime).format('YYYY-MM-DD') : '';
        values.endCreateTime = values.endCreateTime ? dayjs(values.endCreateTime).format('YYYY-MM-DD') : '';
        values.startPayTime = values.startPayTime ? dayjs(values.startPayTime).format('YYYY-MM-DD') : '';
        values.endPayTime = values.endPayTime ? dayjs(values.endPayTime).format('YYYY-MM-DD') : '';
        let moreValues = moreForm.getFieldsValue();
        return { ...values, ...moreValues };
    };

    // 导出
    const exportAll = () => {
        let values = getFormValues();
        let selectedRowKeys = getChecked().rowKeys;
        dispatch({
            type: 'personCardCollect/updateStates',
            payload: { loading: true },
        });
        dispatch({
            type: 'personCardCollect/exportAll',
            payload: {
                cashierInfoIds: selectedRowKeys.join(','),
                ...values,
                exportType: selectedRowKeys.length ? 0 : 1,
                fileType: 'xls',
                fileName: '个人储蓄卡汇总导出',
            },
        });
    };

    // 取消汇总
    const onUnSummary = () => {
        let selectedRowKeys = getChecked().rowKeys;
        if (selectedRowKeys.length == 0) {
            message.error('请选择数据');
            return;
        }
        Modal.confirm({
            title: '提示',
            content: `确定要取消汇总吗?`,
            okText: '确定',
            maskClosable: false,
            mask: false,
            getContainer: document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false,
            onOk() {
                dispatch({
                    type: 'personCardCollect/updateStates',
                    payload: { loading: true },
                });
                dispatch({
                    type: 'personCardCollect/undoSummary',
                    payload: {
                        type: 0,
                        cashierInfoId: selectedRowKeys.join(','),
                    },
                    callback() {
                        message.success('取消汇总成功！');
                        getList();
                    },
                });
            },
        });
    };

    //零余额、非零余额导出
    const onExportByBankFormat = (type) => {
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
        dispatch({
            type: 'personCardCollect/updateStates',
            payload: { loading: true },
        });
        dispatch({
            type: 'personCardCollect/exportByBankFormat',
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
                window.open(path);
            },
        });
    };

    const [postData, setPostData] = useState({
        businessDate: dayjs().format('YYYY-MM-DD'),
    });

    // 选择日期,重新获取还款单号
    const changeDate = (date, dateStr) => {
        if (dateStr) {
            //获取还款单号
            dispatch({
                type: 'personCardCollect/getSummaryNumberList',
                payload: { businessDate: dateStr, cashierOrgId: postData.cashierOrgId },
            });
            form.setFieldsValue({ businessCardSummaryId: '' });
        }
        //保存业务日期 办理的时候用
        setPostData({
            ...postData,
            businessDate: dateStr,
        });
        console.log('选择的日期', dateStr);
        dispatch({
            type: 'personCardCollect/updateStates',
            payload: { businessDate: dateStr },
        });
    };

    //修改管理单位
    const changeOrg = (value) => {
        //重置表单的银行账户和还款单号
        form.setFieldsValue({ payerAccountNumber: '', businessCardSummaryId: '' });
        if (value) {
            dispatch({ type: 'personCardCollect/getAccountInfoList', payload: { orgId: value } });
        } else {
            dispatch({ type: 'personCardCollect/updateStates', payload: { accountList: [] } });
        }
        //获取还款单号
        dispatch({
            type: 'personCardCollect/getSummaryNumberList',
            payload: { cashierOrgId: value, businessDate: postData.businessDate },
        });
        //保存管理单位
        setPostData({
            ...postData,
            cashierOrgId: value,
        });
    };

    //查询
    const onSearch = () => {
        let values = getFormValues();
        changeFormInfo(values);
        getList();
    };

    const changeBankAccount = (value) => {
        let info = value ? accountList.find((item) => item.value == value) : null;
        console.log('选择的银行', info);
        dispatch({
            type: 'personCardCollect/updateStates',
            payload: { bankKeyInfo: info },
        });
    };

    //高级
    const [moreForm] = Form.useForm();
    const [showMore, setShowMore] = useState(false);
    //重置
    const onReset = () => {
        moreForm.resetFields();
        onSearch();
    };
    //高级查询
    const changeShowMore = (isShow) => {
        setShowMore(isShow);
    };

    return (
        <div id="personCardCollect_head_id" className="pt10">
            <Form
                form={form}
                initialValues={{ payState: 0, businessDate: moment() }}
                colon={false}
                className={[commonStyles.no_ellipsis_select, 'flex', 'flex_wrap']}
            >
                <FormItem name="businessDate" label="业务日期">
                    <DatePicker className={'width_100'} onChange={changeDate} />
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
                        onChange={changeBankAccount}
                        placeholder={'请选择银行账户'}
                        options={accountList}
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </FormItem>

                <FormItem label={'还款单号'} name={'businessCardSummaryId'}>
                    <Select
                        placeholder={'请选择还款单号'}
                        options={reNumList}
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
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
                <FormItem label={'办理状态'} name={'payState'}>
                    <Select
                        placeholder={'请选择办理状态'}
                        options={payStateList}
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                </FormItem>
                <div className={'flex flex_justify_end mb8'}>
                    <Button className="mr8" onClick={onSearch}>
                        查询
                    </Button>
                    <Button className="mr8" onClick={() => changeShowMore(true)}>
                        高级
                    </Button>
                </div>
            </Form>

            <div className="flex flex_align_center pl8 pr8 pb8">
                <div className={styles.total_amount}>
                    <span>选中</span>
                    <span className="gPrimary ml5 mr5">{number.length}笔</span>
                    <span>共计金额</span>
                    <span className="gPrimary ml5 mr5">{number.amount}</span>
                </div>
                <div className={'flex  pr8 flex_justify_end flex_1'}>
                    <Button className="mr8" onClick={onUnSummary}>
                        取消汇总
                    </Button>
                    <Button className="mr8" onClick={onBatchHandle}>
                        出纳办理
                    </Button>
                    <Button className="mr8" onClick={exportAll}>
                        导出
                    </Button>
                    <Button className="mr8" onClick={() => onExportByBankFormat(0)}>
                        按银行格式导出(零余额)
                    </Button>
                    <Button onClick={() => onExportByBankFormat(1)}>按银行格式导出(非零余额)</Button>
                </div>
            </div>
            {showMore ? (
                <div className={'bg_f7 p8 width_100'}>
                    <Form form={moreForm} name="basic" colon={false} onFinish={onSearch}>
                        <Row>
                            <Col span={8}>
                                <FormItem label="预算科目代码" name="budgetAccountCode">
                                    <Input placeholder="请输入预算科目代码" />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label={'资金来源代码'} name="fundTypeCode">
                                    <Select
                                        placeholder="请选择"
                                        fieldNames={{ label: 'fundTypeName', value: 'fundTypeCode' }}
                                        allowClear
                                        className="mr10"
                                        options={fundSourceList}
                                    />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="政府经济分类" name="govEconomicCode">
                                    <Input placeholder="请输入" />
                                </FormItem>
                            </Col>
                        </Row>
                        <div className="flex flex_justify_center">
                            <Button htmlType="submit">查询</Button>
                            <Button onClick={onReset} className="ml8 mr8">
                                重置
                            </Button>
                            <Button onClick={() => changeShowMore(false)}> 取消 </Button>
                        </div>
                    </Form>
                </div>
            ) : null}
        </div>
    );
};

export default connect(({ personCardCollect }) => ({
    personCardCollect,
}))(Index);
