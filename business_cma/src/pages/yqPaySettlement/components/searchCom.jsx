import { Button, DatePicker, Form, Input, message, Modal, Select, Tabs } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import { useMemo, useState } from 'react';
import commonStyles from '../../../common.less';

const FormItem = Form.Item;

const Container = ({ dispatch, yqPaySettlement, getList, changeSelect, selectedRowKeys, selectedRows }) => {
    const { orgList, formInfo, limit, currentPage } = yqPaySettlement;
    const [form] = Form.useForm();

    const changeTab = (key) => {
        let newFormInfo = { ...formInfo, processingStatus: key };
        dispatch({ type: 'yqPaySettlement/updateStates', payload: { formInfo: newFormInfo } });
        dispatch({ type: 'yqPaySettlement/getList', payload: { ...newFormInfo, start: 1, limit } });
        changeSelect([], []);
    };
    const onSearch = () => {
        let values = form.getFieldsValue();
        let draftTime = values.draftTime ? dayjs(values.draftTime).format('YYYY-MM-DD') : '';
        let newFormInfo = { ...formInfo, ...values, draftTime };
        dispatch({ type: 'yqPaySettlement/updateStates', payload: { formInfo: newFormInfo } });
        dispatch({ type: 'yqPaySettlement/getList', payload: { ...newFormInfo, start: 1, limit } });
        changeSelect([], []);
    };

    const [tabList, setTabList] = useState([
        { label: '待生成支付结算单', key: '2,3' },
        { label: '已生成支付结算单', key: '1' },
    ]);

    // 生成支付结算单
    const saveHandled = () => {
        let mainTableIds = selectedRows.map((item) => item.numberMainTableId);
        // console.log('去重之前的', mainTableIds);
        mainTableIds = Array.from(new Set(mainTableIds));
        // console.log('去重之后的', mainTableIds);
        if (mainTableIds.length !== 1) {
            message.error('请选择相同单据编号的数据');
            return;
        }
        // console.log('最后传的参数', mainTableIds.join(','));

        console.log(formInfo, '--->formInfo');
        if (!formInfo.numberOrgId) {
            return message.error('请选择分管单位');
        }
        dispatch({
            type: 'yqPaySettlement/checkIsEnableBank',
            payload: { draftOrgId: formInfo.numberOrgId },
            callback: (result) => {
                if (result) {
                    onGenerate(mainTableIds);
                } else {
                    message.error('请检查是否启用银企配置项');
                }
            },
        });
    };

    const onGenerate = (mainTableIds) => {
        Modal.confirm({
            title: '提示',
            content: `确定要生成支付结算单吗?`,
            okText: '确定',
            maskClosable: false,
            mask: false,
            getContainer: document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false,
            onOk() {
                dispatch({
                    type: 'yqPaySettlement/updateStates',
                    payload: { loading: true, cutomHeaders: { orgId: selectedRows[0].numberOrgId } },
                });
                dispatch({
                    type: 'yqPaySettlement/savePaySetStatus',
                    payload: { mainTableIds: mainTableIds.join(',') },
                    callback() {
                        message.success('生成支付结算单成功!');
                        getList(currentPage, limit);
                    },
                });
            },
        });
    };

    // 取消生产支付结算单
    const changeHandled = () => {
        if (selectedRows.length == 0) {
            message.error('请至少选择一条数据');
            return;
        }
        let mainTableIdList = selectedRows.map((item) => item.numberMainTableId).join(',');
        Modal.confirm({
            title: '提示',
            content: `确定要取消生成支付结算单吗?`,
            okText: '确定',
            maskClosable: false,
            mask: false,
            getContainer: document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false,
            onOk() {
                dispatch({
                    type: 'yqPaySettlement/updateStates',
                    payload: { loading: true },
                });
                dispatch({
                    type: 'yqPaySettlement/changePaySetStatus',
                    payload: { mainTableIdList, processingStatus: '3' },
                    callback() {
                        message.success('取消生成支付结算单成功!');
                        getList(currentPage, limit);
                    },
                });
            },
        });
    };

    const slot = useMemo(() => {
        if (formInfo.processingStatus === '2,3') {
            return {
                right: (
                    <Button className={'mr8'} onClick={saveHandled}>
                        生成支付结算单
                    </Button>
                ),
            };
        }
        if (formInfo.processingStatus === '1') {
            return {
                right: (
                    <Button className={'mr8'} onClick={changeHandled}>
                        取消生成支付结算单
                    </Button>
                ),
            };
        }
        return null;
    }, [formInfo.processingStatus, selectedRowKeys]);
    return (
        <div id="yqPaySettlement_list_head" className="pt10">
            <Form form={form} colon={false} className={[commonStyles.no_ellipsis_select, 'flex', 'flex_wrap']}>
                <FormItem label={'业务日期'} name={'draftTime'}>
                    <DatePicker className={'width_100'} />
                </FormItem>
                <FormItem label={'分管单位'} name={'numberOrgId'}>
                    <Select
                        placeholder={'请选择单位/分管单位'}
                        options={orgList}
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        showSearch
                        optionFilterProp="label"
                    />
                </FormItem>
                <FormItem label={'单据编号'} name={'numberNo'}>
                    <Input placeholder={'请输入单据编号'}></Input>
                </FormItem>
                <br />
                <FormItem label={'报账卡号'} name={'reimbCardNum'}>
                    <Input placeholder={'请输入报账卡号'}></Input>
                </FormItem>
                <Button className="mr8" onClick={onSearch}>
                    查询
                </Button>
            </Form>
            <Tabs
                activeKey={formInfo.processingStatus}
                items={tabList}
                onChange={changeTab}
                tabBarExtraContent={slot}
            />
        </div>
    );
};

export default connect(({ yqPaySettlement }) => ({ yqPaySettlement }))(Container);
