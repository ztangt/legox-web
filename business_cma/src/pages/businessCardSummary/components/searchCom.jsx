import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import moment from 'moment';
import { useState } from 'react';
import commonStyles from '../../../common.less';
import styles from '../index.less';

const FormItem = Form.Item;

const Index = ({
    dispatch,
    businessCardSummary,
    getList,
    onExport,
    onUnSummary,
    onBatchHandle,
    changeFormInfo,
    number,
}) => {
    const [form] = Form.useForm();
    const { orgList, backAccountList, payStateList, reNumList, companyList, fundSourceList } = businessCardSummary;

    const getFormValues = () => {
        let values = form.getFieldsValue();
        values = {
            ...values,
            startDate: values.startDate ? dayjs(values.startDate).format('YYYY-MM-DD') : '',
            startCreateTime: values.startCreateTime ? dayjs(values.startCreateTime).format('YYYY-MM-DD') : '',
            endCreateTime: values.endCreateTime ? dayjs(values.endCreateTime).format('YYYY-MM-DD') : '',
            startPayTime: values.startPayTime ? dayjs(values.startPayTime).format('YYYY-MM-DD') : '',
            endPayTime: values.endPayTime ? dayjs(values.endPayTime).format('YYYY-MM-DD') : '',
        };
        let moreValues = moreForm.getFieldsValue();
        return {
            ...values,
            ...moreValues,
        };
    };

    // 导出
    const onExportBtn = () => {
        onExport(getFormValues());
    };

    // 查询
    const onSearch = () => {
        let values = getFormValues();
        changeFormInfo(values);
        getList();
    };

    const [postData, setPostData] = useState({
        businessDate: dayjs().format('YYYY-MM-DD'),
    });

    //修改管理单位
    const changeOrg = (value) => {
        //重置表单的银行账户和还款单号
        form.setFieldsValue({ payerAccountNumber: '', businessCardSummaryId: '' });
        if (value) {
            dispatch({ type: 'businessCardSummary/getBankAccount', payload: { orgId: value } });
        } else {
            dispatch({ type: 'businessCardSummary/updateStates', payload: { backAccountList: [] } });
        }
        //获取还款单号
        dispatch({
            type: 'businessCardSummary/getSummaryNumberList',
            payload: { cashierOrgId: value, businessDate: postData.businessDate },
        });
        setPostData({
            ...postData,
            cashierOrgId: value,
        });
    };

    //修改业务日期
    const changeDate = (date, dateString) => {
        if (dateString) {
            dispatch({
                type: 'businessCardSummary/getSummaryNumberList',
                payload: { businessDate: dateString, cashierOrgId: postData.cashierOrgId },
            });
            form.setFieldsValue({ businessCardSummaryId: '' });
        }
        setPostData({
            ...postData,
            businessDate: dateString,
        });
        console.log('选择的日期', dateString);
        dispatch({ type: 'businessCardSummary/updateStates', payload: { businessDate: dateString } });
    };

    //选择银行账户
    const changeBankAccount = (value) => {
        let info = value ? backAccountList.find((item) => item.value == value) : null;
        console.log('选择的银行', info);
        dispatch({ type: 'businessCardSummary/updateStates', payload: { bankKeyInfo: info } });
    };

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
        <div id="businessCardSummary_head_id" className="pt10">
            <Form
                form={form}
                initialValues={{ payState: 0, startDate: moment() }}
                colon={false}
                className={[commonStyles.no_ellipsis_select, 'flex', 'flex_wrap']}
            >
                <FormItem name="startDate" label="业务日期">
                    <DatePicker allowClear={false} className={'width_100'} onChange={changeDate} />
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
                        options={backAccountList}
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
                <FormItem label={'账户性质'} name={'reimbursementAccountType'}>
                    <Select
                        placeholder={'请选择账户性质'}
                        options={companyList}
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
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
                    <Button className="ml8" onClick={onSearch}>
                        查询
                    </Button>
                    <Button className="ml8" onClick={() => changeShowMore(true)}>
                        高级
                    </Button>
                </div>
            </Form>

            <div className={'flex flex_align_center pl8 pr8 pb8'}>
                <div className={styles.total_amount}>
                    <span>选中</span>
                    <span className="gPrimary ml5 mr5">{number.length}笔</span>
                    <span>共计金额</span>
                    <span className="gPrimary ml5 mr5">{number.amount}</span>
                </div>
                <div className={'flex flex_justify_end flex_1'}>
                    <Button className="mr8" onClick={onUnSummary}>
                        取消汇总
                    </Button>
                    <Button className="mr8" onClick={onBatchHandle}>
                        出纳办理
                    </Button>
                    <Button onClick={onExportBtn}>导出</Button>
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

export default connect(({ businessCardSummary }) => ({
    businessCardSummary,
}))(Index);
