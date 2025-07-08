import commonStyles from '@/common.less';
import GlobalModal from '@/components/GlobalModal';
import { Button, DatePicker, Form, message, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import moment from 'moment';
import { useState } from 'react';

const FormItem = Form.Item;

const Index = ({ dispatch, cashDayInOut, getList }) => {
    const { limit, confirmLoading, orgList } = cashDayInOut;
    const [form] = Form.useForm();
    //查询
    const onSearch = () => {
        let values = form.getFieldsValue();
        if (values.businessDate) {
            values.businessDate = dayjs(values.businessDate).format('YYYY-MM-DD');
        }
        dispatch({ type: 'cashDayInOut/updateStates', payload: { formInfo: { ...values }, loading: true } });
        dispatch({ type: 'cashDayInOut/getList', payload: { ...values, start: 1, limit } });
    };

    let initialValues = {
        businessDate: moment(),
        endTime: moment().add(31, 'days'),
        orgId: '',
    };

    const createReport = () => {
        Modal.confirm({
            title: '信息',
            content: `确定要生成报表？`,
            okText: '确定',
            getContainer: () => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            },
            maskClosable: false,
            mask: false,
            onOk() {
                let { businessDate, orgId } = form.getFieldsValue();
                dispatch({
                    type: 'cashDayInOut/updateStates',
                    payload: {
                        loading: true,
                    },
                });
                dispatch({
                    type: 'cashDayInOut/generateDayInOutList',
                    payload: {
                        businessDate: businessDate ? dayjs(businessDate).format('YYYY-MM-DD') : '',
                        // type: 0, // 0-生成，1-重新生成
                        orgId: orgId || '',
                    },
                    callback() {
                        message.success('生成成功');
                        getList(1, limit);
                    },
                });
            },
        });
    };

    //导出报表
    const onExport = () => {
        dispatch({
            type: 'cashDayInOut/updateStates',
            payload: {
                loading: true,
            },
        });
        let { businessDate, orgId } = form.getFieldsValue();

        dispatch({
            type: 'cashDayInOut/exportDayInOutList',
            payload: {
                businessDate: businessDate ? dayjs(businessDate).format('YYYY-MM-DD') : '',
                orgId: orgId || '',
            },
            callback: function (path) {
                if (!path) {
                    return;
                }
                // 这里的文件名根据实际情况从响应头或者url里获取
                const a = document.createElement('a');
                a.href = path;
                a.click();
                message.success('导出成功');
            },
        });
    };

    const [modalShow, setModalShow] = useState(false); //弹窗显隐
    const [reloadDate, setReloadDate] = useState([initialValues.businessDate, initialValues.endTime]); //重新生成日期
    const [newOrgId, setNewOrgId] = useState(initialValues.orgId); //重新生成时选择的单位
    const [dates, setDates] = useState(null);

    const changeReloadDate = (dates, dateString) => {
        setReloadDate(dates);
    };
    const changeOrgId = (value) => {
        console.log(value, '--->选择的orgId');
        setNewOrgId(value);
    };

    const onReload = () => {
        let businessDate = dayjs(reloadDate).format('YYYY-MM-DD');
        let startTime = dayjs(reloadDate[0]).format('YYYY-MM-DD');
        let endTime = dayjs(reloadDate[1]).format('YYYY-MM-DD');
        Modal.confirm({
            title: '信息',
            content: `确定要重新生成报表？`,
            okText: '确定',
            getContainer: () => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            },
            maskClosable: false,
            mask: false,
            onOk() {
                dispatch({
                    type: 'cashDayInOut/updateStates',
                    payload: {
                        confirmLoading: true,
                    },
                });

                dispatch({
                    type: 'cashDayInOut/againCreateDayInOut',
                    payload: {
                        // type: 1, // 0-生成，1-重新生成
                        orgId: newOrgId,
                        startTime,
                        endTime,
                    },
                    callback() {
                        message.success('重新生成成功');
                        setModalShow(false);
                        // getList(1, limit,);//重新生成后不刷新列表
                    },
                });
            },
        });
    };
    const cancelReload = () => {
        setModalShow(false);
    };
    const disabledDate = (current) => {
        if (!dates) {
            return false;
        }
        const tooLate = dates[0] && current.diff(dates[0], 'days') > 31;
        const tooEarly = dates[1] && dates[1].diff(current, 'days') > 31;
        return !!tooEarly || !!tooLate;
    };
    const showReload = () => {
        setModalShow(true);
        const startTime = form.getFieldsValue().businessDate;
        const endTime = _.cloneDeep(startTime).add(31, 'days');
        setReloadDate([startTime, endTime]);
    };
    return (
        <div id="cashDayInOut_list_head" className="pt10 flex flex_justify_between">
            <Form
                form={form}
                colon={false}
                initialValues={initialValues}
                className={[commonStyles.no_ellipsis_select, 'flex', 'flex_wrap']}
            >
                <FormItem label={'管理单位'} name={'orgId'}>
                    <Select
                        placeholder={'请选择管理单位'}
                        options={orgList}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        onChange={changeOrgId}
                        allowClear
                        showSearch
                        optionFilterProp="label"
                    />
                </FormItem>

                <FormItem label={'业务日期'} name={'businessDate'}>
                    <DatePicker className={'width_100'} allowClear={false} />
                </FormItem>
                <Button onClick={onSearch}>查询</Button>
            </Form>
            <div className="flex flex_justify_end">
                <Button className="mr8 mb8" onClick={createReport}>
                    生成报表
                </Button>
                <Button className="mr8 mb8" onClick={showReload}>
                    重新生成
                </Button>
                <Button className="mr8 mb8" onClick={onExport}>
                    导出报表
                </Button>
            </div>

            {modalShow && (
                <GlobalModal
                    getContainer={() => {
                        return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                    }}
                    title="重新生成报表"
                    open={true}
                    onOk={onReload}
                    onCancel={cancelReload}
                    confirmLoading={confirmLoading}
                    modalSize="small"
                >
                    <div className="flex_center" style={{ width: '350px', margin: '30px auto' }}>
                        <div style={{ width: '80px' }}>管理单位</div>
                        <Select
                            allowClear
                            onChange={changeOrgId}
                            value={newOrgId}
                            className={'width_100'}
                            placeholder={'请选择管理单位'}
                            options={orgList}
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        />
                    </div>
                    <div className="flex_center" style={{ width: '350px', margin: '30px auto' }}>
                        <div style={{ width: '80px' }}>业务日期</div>
                        <DatePicker.RangePicker
                            value={reloadDate}
                            className={'width_100'}
                            allowClear={true}
                            onChange={changeReloadDate}
                            disabledDate={disabledDate}
                            onCalendarChange={(val) => setDates(val)}
                        />
                    </div>
                </GlobalModal>
            )}
        </div>
    );
};

export default connect(({ cashDayInOut }) => ({
    cashDayInOut,
}))(Index);
