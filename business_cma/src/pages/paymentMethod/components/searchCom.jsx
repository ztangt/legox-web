import { Button, Form, Input, message, Modal, Select } from 'antd';
import { connect } from 'dva';
import qs from 'qs';
import { useState } from 'react';
import { useModel } from 'umi';
import commonStyles from '../../../common.less';
import CashExtractModal from './payModal';

const FormItem = Form.Item;

const Index = ({ dispatch, getList, getChecked, paymentMethod }) => {
    const [form] = Form.useForm();
    const [modalShow, setModalShow] = useState(false);

    let { orgList, accountList } = paymentMethod;
    // 查询
    const onSearch = () => {
        let values = form.getFieldsValue();
        dispatch({ type: 'paymentMethod/updateStates', payload: { formInfo: { ...values }, loading: true } });
        getList();
    };
    // 支票退办
    const onexChange = () => {
        let { rows: selectedRows, rowKeys: selectedRowKeys } = getChecked();
        console.log(selectedRows, selectedRowKeys, '这是支票退办的参数');

        if (selectedRowKeys && selectedRowKeys.length == 1) {
            Modal.confirm({
                title: '提示',
                content: `确定进行支票退办？`,
                okText: '确定',
                getContainer: () => {
                    return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                },
                maskClosable: false,
                mask: false,
                onOk() {
                    dispatch({
                        type: 'paymentMethod/updateStates',
                        payload: { loading: true },
                    });
                    dispatch({
                        type: 'paymentMethod/putCheckWithdraw',
                        payload: {
                            cashierInfoId: selectedRowKeys,
                            bizId: selectedRows[0].bizId,
                            checkNo: selectedRows[0].checkNumber,
                        },
                        callback(data) {
                            if (data == 'Y') {
                                message.success('办理成功');
                                getList();
                            } else if (data == '已有其他已办结的支付方式') {
                                message.success(data);
                            } else {
                                message.success('办理失败');
                            }
                        },
                    });
                },
            });
        } else {
            message.error('请选择一个操作项');
        }
    };

    //支票退换
    const [returnInfo, setReturnInfo] = useState({}); // 选中的数据
    const onReloadhd = (value) => {
        let { rows: selectedRows, rowKeys: selectedRowKeys } = getChecked();
        if (selectedRowKeys && selectedRowKeys.length == 1) {
            setReturnInfo(selectedRows[0]);
            changeModal(true);
        } else {
            message.error('请选择一个操作项');
        }
    };

    // 修改弹窗状态
    const changeModal = (isShow) => {
        setModalShow(isShow);
    };
    const onReset = () => {
        form.resetFields();
        onSearch();
    };

    const changeOrg = (value) => {
        if (value) {
            dispatch({ type: 'paymentMethod/getBankAccount', payload: { orgId: value } });
            form.setFieldValue('bankAccount', '');
        }
    };

    const { location } = useModel('@@qiankunStateFromMaster');
    const urlParams = qs.parse(location.query?.url.split('?')[1]);
    const [text, setText] = useState(urlParams.searchType == '2' ? '预算指标' : '报账卡号');
    // urlParams.searchType = 1; 国家局 报账卡号(默认)
    // urlParams.searchType =2 ; 省局 预算指标
    return (
        <div id="paymentMethod_head_id" className="pt8">
            <div className={'flex flex_justify_between'}>
                <Form form={form} colon={false} className={[commonStyles.no_ellipsis_select, 'flex', 'flex_wrap']}>
                    <FormItem label={text} name={'reimbCardNum'}>
                        <Input placeholder={`请输入${text}`}></Input>
                    </FormItem>
                    {/*<FormItem label={'单位'} name={'orgName'}>*/}
                    {/*    <Input placeholder={'请输入单位'}></Input>*/}
                    {/*</FormItem>*/}
                    {/*<FormItem label={'银行账户'} name={'bankAccount'}>*/}
                    {/*    <Input placeholder={'请输入银行账户'}></Input>*/}
                    {/*</FormItem>*/}

                    <FormItem label={'管理单位'} name={'cashierOrgId'}>
                        <Select
                            allowClear
                            placeholder={'请选择管理单位'}
                            options={orgList}
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            onChange={changeOrg}
                            showSearch
                            optionFilterProp="label"
                        />
                    </FormItem>
                    <FormItem label={'银行账户'} name={'bankAccount'}>
                        <Select
                            placeholder={'请选择银行账户'}
                            options={accountList}
                            allowClear
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        />
                    </FormItem>

                    <FormItem label={'单据编号'} name={'voucherNumber'}>
                        <Input placeholder={'请输入单据编号'}></Input>
                    </FormItem>
                    <FormItem label={'原支票号'} name={'checkNumber'}>
                        <Input placeholder={'请输入原支票号'}></Input>
                    </FormItem>
                    <Button className="ml8" onClick={onSearch}>
                        查询
                    </Button>
                    <Button className="ml8" onClick={onReset}>
                        重置
                    </Button>
                </Form>
                <div className="flex flex_justify_end">
                    <Button className="mr8 mb8" onClick={onexChange}>
                        支票退办
                    </Button>
                    <Button className="mr8 mb8" onClick={onReloadhd}>
                        支票退换
                    </Button>
                </div>
            </div>
            {/* 弹窗显隐 */}
            {modalShow && <CashExtractModal changeVisible={changeModal} info={returnInfo} getList={getList} />}
        </div>
    );
};

export default connect(({ paymentMethod }) => ({
    paymentMethod,
}))(Index);
