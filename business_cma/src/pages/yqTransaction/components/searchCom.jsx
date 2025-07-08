import { Button, DatePicker, Form, message, Select } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import { useState } from 'react';
import commonStyles from '../../../common.less';

const { RangePicker } = DatePicker;

const Container = ({ dispatch, yqTransaction }) => {
    const { unitList, accList } = yqTransaction;
    const [formRef, setFormRef] = useState({});

    // 查询
    const onSearch = () => {
        formRef.current.validateFields().then((values) => {
            let { startDate, endDate, account, unit } = values;
            startDate = startDate ? dayjs(startDate).format('YYYY-MM-DD') : '';
            endDate = endDate ? dayjs(endDate).format('YYYY-MM-DD') : '';
            if (startDate != endDate && !dayjs(startDate).isBefore(dayjs(endDate))) {
                return message.error('开始时间不能大于结束时间');
            }
            let diffDay = dayjs(endDate).diff(dayjs(startDate), 'day');
            console.log(diffDay, 'diffDay');
            if (diffDay > 120) {
                return message.error('查询时间跨度不能大于120天');
            }

            let isZero = accList.find((item) => item.bankAccount == account)?.isZero;
            let formData = { startDate, endDate, account };
            // 零余额账户交易明细查询时，添加orgId参数
            if (isZero == 1) {
                formData.orgId = unit;
                return message.error('零余额账户请在预算一体化系统中查询交易明细');
            }

            dispatch({
                type: 'yqTransaction/updateStates',
                payload: { loading: true },
            });
            console.log(formData, '--->formData');
            dispatch({
                type: 'yqTransaction/getList',
                payload: { isZero, formData },
            });
        });
    };

    // 导出明细列表
    const onReloadSync = (value) => {
        formRef.current.validateFields().then((values) => {
            let { startDate, endDate, account, unit } = values;
            startDate = startDate ? dayjs(startDate).format('YYYY-MM-DD') : '';
            endDate = endDate ? dayjs(endDate).format('YYYY-MM-DD') : '';

            if (startDate != endDate && !dayjs(startDate).isBefore(dayjs(endDate))) {
                return message.error('开始时间不能大于结束时间');
            }
            let diffDay = dayjs(endDate).diff(dayjs(startDate), 'day');
            console.log(diffDay, 'diffDay');
            if (diffDay > 120) {
                return message.error('查询时间跨度不能大于120天');
            }

            let isZero = accList.find((item) => item.bankAccount == account)?.isZero;
            let formData = { startDate, endDate, account };
            // 零余额账户交易明细导出时，添加orgId参数
            if (isZero == 1) {
                formData.orgId = unit;
                return message.error('零余额账户请在预算一体化系统中查询交易明细');
            }
            dispatch({
                type: 'yqTransaction/updateStates',
                payload: { loading: true },
            });
            dispatch({
                type: 'yqTransaction/exportExcel',
                payload: { isZero, formData },
            });
        });
    };

    //修改单位
    const changeOrg = (value) => {
        formRef.current.setFieldValue('account', '');
        console.log(value, '--单位ID');
        dispatch({
            type: 'yqTransaction/getAccList',
            payload: { belongOrgId: value },
        });
        dispatch({
            type: 'yqTransaction/updateStates',
            payload: {
                cutomHeaders: { orgId: value },
            },
        });
    };

    return (
        <div id="list_head_cma" className={'pt10'}>
            <Form
                initialValues={{}}
                ref={formRef}
                colon={false}
                className={[commonStyles.no_ellipsis_select, 'flex', 'flex_wrap']}
            >
                <Form.Item label="单位" name="unit" rules={[{ required: true, message: '请选择单位' }]}>
                    <Select
                        onChange={changeOrg}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        placeholder={'请选择单位'}
                        showSearch
                        optionFilterProp="children"
                    >
                        {unitList.map((item, index) => {
                            return (
                                <Select.Option value={item.orgId} key={index}>
                                    {item.orgName}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="账户" name="account" rules={[{ required: true, message: '请选择账户' }]}>
                    <Select
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        placeholder={'请选择账户'}
                    >
                        {accList.map((item, index) => {
                            return (
                                <Select.Option value={item.bankAccount} key={index}>
                                    {item.bankAccount}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="开始日期" name="startDate" rules={[{ required: true, message: '请选择开始日期' }]}>
                    <DatePicker format="YYYY-MM-DD" className={'width_100'} />
                </Form.Item>
                <Form.Item label="结束日期" name="endDate" rules={[{ required: true, message: '请选择结束日期' }]}>
                    <DatePicker format="YYYY-MM-DD" className={'width_100'} />
                </Form.Item>
                <Button className="mr8 mb8" onClick={onSearch}>
                    查询
                </Button>
                <Button className="mr8 mb8" onClick={onReloadSync}>
                    导出
                </Button>
            </Form>
        </div>
    );
};

export default connect(({ yqTransaction }) => ({
    yqTransaction,
}))(Container);
