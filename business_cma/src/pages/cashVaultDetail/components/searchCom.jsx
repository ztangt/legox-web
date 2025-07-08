import commonStyles from '@/common.less';
import GlobalModal from '@/components/GlobalModal';
import { Button, DatePicker, Form, message, Modal } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { connect } from 'dva';
import moment from 'moment/moment';
import { useState } from 'react';
const FormItem = Form.Item;

const CashVaultDetailData = ({ dispatch, cashVaultDetail }) => {
    const { limit, confirmLoading } = cashVaultDetail;
    const [form] = Form.useForm();
    // 当日重新盘库
    const onReloadVault = (bDate) => {
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
                let { businessDate } = form.getFieldsValue();
                dispatch({
                    type: 'cashVaultDetail/generateVaultDetail',
                    payload: {
                        businessDate: businessDate ? dayjs(businessDate).format('YYYY-MM-DD') : '',
                    },
                    callback(data) {
                        message.success('保存成功');
                    },
                });
            },
        });
    };
    // 打印报表
    const printReport = (date) => {
        let { businessDate } = form.getFieldsValue();
        let date1 = dayjs(businessDate).format('YYYY-MM-DD');
        let time = dayjs(date1).valueOf();
        let jumpUrl = `http://${window.location.hostname}:8088/jmreport/view/854219912763232256?businessDate=${time}&token=Bearer ${window.localStorage.userToken}`;
        window.open(jumpUrl);
    };

    let initialValues = {
        businessDate: moment(),
        endTime: moment().add(31, 'days'),
    };
    const [modalShow, setModalShow] = useState(false); //弹窗显隐
    const [reloadDate, setReloadDate] = useState([initialValues.businessDate, initialValues.endTime]); //重新生成日期
    const [dates, setDates] = useState(null);
    //查询
    const onSearch = () => {
        let values = form.getFieldsValue();
        if (values.businessDate) {
            values.businessDate = dayjs(values.businessDate).format('YYYY-MM-DD');
        }
        dispatch({ type: 'cashVaultDetail/updateStates', payload: { formInfo: { ...values }, loading: true } });
        dispatch({ type: 'cashVaultDetail/getList', payload: { ...values, start: 1, limit } });
    };
    const disabledDate = (current) => {
        if (!dates) {
            return false;
        }
        const tooLate = dates[0] && current.diff(dates[0], 'days') > 31;
        const tooEarly = dates[1] && dates[1].diff(current, 'days') > 31;
        return !!tooEarly || !!tooLate;
    };
    const changeReloadDate = (dates, dateString) => {
        setReloadDate(dates);
    };
    const onReload = () => {
        let startTime = dayjs(reloadDate[0]).format('YYYY-MM-DD');
        let endTime = dayjs(reloadDate[1]).format('YYYY-MM-DD');
        Modal.confirm({
            title: '信息',
            content: `确定要重新盘库？`,
            okText: '确定',
            getContainer: () => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            },
            maskClosable: false,
            mask: false,
            onOk() {
                dispatch({
                    type: 'cashVaultDetail/updateStates',
                    payload: {
                        confirmLoading: true,
                    },
                });

                dispatch({
                    type: 'cashVaultDetail/againCreate',
                    payload: {
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
    const showReload = () => {
        setModalShow(true);
        const startTime = form.getFieldsValue().businessDate;
        const endTime = _.cloneDeep(startTime).add(31, 'days');
        setReloadDate([startTime, endTime]);
    };
    return (
        <div id="cashVaultDetail_list_head" className="pt10 flex flex_justify_between">
            <Form
                form={form}
                colon={false}
                initialValues={initialValues}
                className={[commonStyles.no_ellipsis_select, 'flex', 'flex_wrap']}
            >
                <FormItem label={'业务日期'} name={'businessDate'}>
                    <DatePicker className={'width_100'} allowClear={false} />
                </FormItem>
                <Button onClick={onSearch}>查询</Button>
            </Form>
            <div>
                <Button className="mr8  mb8" onClick={onReloadVault}>
                    当日重新盘库
                </Button>
                <Button className="mr8  mb8" onClick={showReload}>
                    重新盘库
                </Button>
                <Button className="mr8  mb8" onClick={printReport}>
                    打印报表
                </Button>
            </div>
            {modalShow && (
                <GlobalModal
                    getContainer={() => {
                        return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                    }}
                    title="重新盘库"
                    open={true}
                    onOk={onReload}
                    onCancel={cancelReload}
                    confirmLoading={confirmLoading}
                    modalSize="small"
                >
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

export default connect(({ cashVaultDetail }) => ({
    cashVaultDetail,
}))(CashVaultDetailData);
