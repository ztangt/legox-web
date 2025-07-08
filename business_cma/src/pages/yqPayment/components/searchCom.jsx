import commonStyles from '@/common.less';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, message, Modal, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import { useRef, useState } from 'react';
import { sm2 } from 'sm-crypto';
import GlobalModal from '../../../components/GlobalModal';
import styles from '../index.less';
import { isZeroList, servicePublicKey, statusList } from './config';

const { TextArea } = Input;
const { confirm } = Modal;

const Container = ({ dispatch, yqPayment }) => {
    const { unitList, formData, limit, currentPage, ids, list } = yqPayment;
    const [formRef, setFormRef] = useState({});

    // 查询
    const onSearch = (postStatus) => {
        //查询的时候清除选中状态
        dispatch({
            type: 'yqPayment/updateStates',
            payload: {
                ids: [],
            },
        });

        formRef.current.validateFields().then((values) => {
            let { startTime, endTime } = values;
            endTime = endTime ? dayjs(endTime).format('YYYY-MM-DD') : '';
            startTime = startTime ? dayjs(startTime).format('YYYY-MM-DD') : '';

            if (startTime != endTime && !dayjs(startTime).isBefore(dayjs(endTime))) {
                return message.error('开始时间不能大于结束时间');
            }
            let diffDay = dayjs(endTime).diff(dayjs(startTime), 'day');
            console.log(diffDay, 'diffDay');
            if (diffDay > 120) {
                return message.error('查询时间跨度不能大于120天');
            }

            let postData = {
                ...values,
                payStatus: postStatus || formData.payStatus,
                startTime,
                endTime,
            };
            dispatch({
                type: 'yqPayment/updateStates',
                payload: { formData: postData, loading: true },
            });
            dispatch({
                type: 'yqPayment/getList',
                payload: { ...postData, limit, start: 1 },
            });
        });
    };

    // 导出
    const onReloadSync = () => {
        formRef.current.validateFields().then((values) => {
            let { startTime, endTime } = values;
            endTime = endTime ? dayjs(endTime).format('YYYY-MM-DD') : '';
            startTime = startTime ? dayjs(startTime).format('YYYY-MM-DD') : '';

            if (startTime != endTime && !dayjs(startTime).isBefore(dayjs(endTime))) {
                return message.error('开始时间不能大于结束时间');
            }
            let diffDay = dayjs(endTime).diff(dayjs(startTime), 'day');
            console.log(diffDay, 'diffDay');
            if (diffDay > 120) {
                return message.error('查询时间跨度不能大于120天');
            }

            let postData = {
                ...values,
                payStatus: formData.payStatus,
                startTime,
                endTime,
            };
            dispatch({
                type: 'yqPayment/updateStates',
                payload: { loading: true },
            });
            dispatch({
                type: 'yqPayment/exportExcel',
                payload: postData,
            });
        });
    };

    //输入密码的弹窗
    const [payVisible, setPayVisible] = useState(false);
    const [payFormRef, setPayFormRef] = useState({});
    const [forgetPasswordVisible, setForgetPasswordVisible] = useState(false);
    const forgetFormRef = useRef(null);

    const goForgetPassword = () => {
        setForgetPasswordVisible(true);
    };
    const cancelForgetPassword = () => {
        setForgetPasswordVisible(false);
    };
    const goPay = () => {
        setPayVisible(true);
    };
    const cancelPay = () => {
        setPayVisible(false);
    };

    //刷新数据
    const updateList = () => {
        dispatch({
            type: 'yqPayment/getList',
            payload: { limit, start: currentPage, ...formData },
        });
        dispatch({
            type: 'yqPayment/updateStates',
            payload: {
                ids: [],
            },
        });
    };
    //提交修改密码
    const onSubmitPassword = () => {
        forgetFormRef.current.validateFields().then((values) => {
            dispatch({
                type: 'yqPayment/checkPsd',
                payload: {
                    userId: JSON.parse(localStorage.getItem('userInfo') || {})?.userId,
                    password: '04' + sm2.doEncrypt(values.password, servicePublicKey),
                    type: 1,
                },
                //密码校验成功以后的回调
                callback: () => {
                    setForgetPasswordVisible(false);
                    // //确认支付
                    // confirm({
                    //     title: '提示?',
                    //     icon: <ExclamationCircleFilled />,
                    //     content: '确认支付操作吗？',
                    //     getContainer: () => document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`),
                    //     onOk() {
                    //         dispatch({
                    //             type: 'yqPayment/confirmPay',
                    //             payload: { ids: ids.join(','), coCode },
                    //             callback: () => {
                    //                 setPayVisible(false);
                    //                 updateList();
                    //             },
                    //         });
                    //     },
                    //     onCancel() {},
                    // });
                },
            });
        });
    };
    //提交支付
    const onSubmitPay = () => {
        let coCode = formRef.current.getFieldValue('coCode');
        payFormRef.current.validateFields().then((values) => {
            dispatch({
                type: 'yqPayment/checkPsd',
                payload: {
                    userId: JSON.parse(localStorage.getItem('userInfo') || {})?.userId,
                    password: '04' + sm2.doEncrypt(values.password, servicePublicKey),
                    type: 0,
                },
                //密码校验成功以后的回调
                callback: () => {
                    //确认支付
                    confirm({
                        title: '提示?',
                        icon: <ExclamationCircleFilled />,
                        content: '确认支付操作吗？',
                        getContainer: () => document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`),
                        onOk() {
                            dispatch({
                                type: 'yqPayment/confirmPay',
                                payload: { ids: ids.join(','), coCode },
                                callback: () => {
                                    setPayVisible(false);
                                    updateList();
                                },
                            });
                        },
                        onCancel() {},
                    });
                },
            });
        });
    };
    //作废
    const goNullify = () => {
        //零余额支付的单据,有则提示功能为开放
        let selectedList = list.filter((item) => ids.includes(item.id));
        if (selectedList.find((item) => item.isZerobal == 1)) {
            return message.error('零余额单据作废功能暂未开放');
        }

        confirm({
            title: '提示?',
            icon: <ExclamationCircleFilled />,
            content: '是否作废结算单？',
            getContainer: () => document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`),
            onOk() {
                Modal.success({
                    title: '删除成功',
                    content: (
                        <div>
                            <p className="f12">如需重新生成支付结算单，请将对应单据重启流程。</p>
                            <p className="f12">如不需要重新支付，请手动删除出纳日记账及凭证。</p>
                        </div>
                    ),
                    onOk() {
                        dispatch({
                            type: 'yqPayment/goNullify',
                            payload: { ids: ids.join(',') },
                            callback: () => {
                                updateList();
                            },
                        });
                    },
                });
            },
        });
    };

    //重新支付
    const goRepay = () => {
        let coCode = formRef.current.getFieldValue('coCode');
        if (coCode) {
            dispatch({
                type: 'yqPayment/goRepay',
                payload: { ids: ids.join(','), coCode },
                callback: () => {
                    updateList();
                },
            });
        }
    };

    //终止支付
    const [stopPay, setStopPay] = useState(false);
    const [stopFormRef, setStopFormRef] = useState({});
    const goStopPay = () => {
        if (ids.length > 1) {
            return message.error('每次只能对一条数据进行终止支付');
        }

        //零余额支付的单据,有则提示功能为开放
        let selectedList = list.filter((item) => ids.includes(item.id));
        if (selectedList.find((item) => item.isZerobal == 1)) {
            return message.error('零余额单据终止功能暂未开放');
        }

        setStopPay(true);
    };
    const cancelStopPay = () => {
        setStopPay(false);
    };
    const onSubmitStopPay = () => {
        stopFormRef.current.validateFields().then((values) => {
            dispatch({
                type: 'yqPayment/stopPay',
                payload: { ids: ids.join(','), stopReason: values.remark },
                callback: () => {
                    setStopPay(false);
                    updateList();
                },
            });
        });
    };
    //状态下载
    const goStatusDown = () => {
        // if (ids.length > 1) {
        //     return message.error('每次只能对一条数据进行终止支付');
        // }
        dispatch({
            type: 'yqPayment/statusDown',
            payload: { ids: ids.join(',') },
            callback: (res) => {
                updateList();
            },
        });
    };

    const changeOrgId = (value, info) => {
        let orgId = unitList.find((item) => item.orgCode === value)?.orgId;
        dispatch({
            type: 'yqPayment/updateStates',
            payload: {
                cutomHeaders: { orgId: orgId },
            },
        });
    };

    return (
        <div id="list_head_cma">
            <div className={'pt10 flex flex_justify_between'}>
                <Form ref={formRef} colon={false} className={[commonStyles.no_ellipsis_select, 'flex', 'flex_wrap']}>
                    <Form.Item label="单位" name="coCode" rules={[{ required: true, message: '请选择单位' }]}>
                        <Select
                            placeholder={'请选择单位'}
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            onSelect={changeOrgId}
                            showSearch
                            optionFilterProp="children"
                        >
                            {unitList.map((item, index) => {
                                return (
                                    <Select.Option value={item.orgCode} key={index}>
                                        {item.orgName}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="录入时间"
                        name="startTime"
                        rules={[{ required: true, message: '请选择录入时间' }]}
                    >
                        <DatePicker className={'width_100'} />
                    </Form.Item>
                    <Form.Item label="至" name="endTime" rules={[{ required: true, message: '请选择结束时间' }]}>
                        <DatePicker className={'width_100'} />
                    </Form.Item>
                    {formData.payStatus !== 'unpaid' ? (
                        <Form.Item label="是否零余额支付" name="isZero" initialValue={''}>
                            <Select
                                placeholder={'请选择是否零余额支付'}
                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            >
                                {isZeroList.map((item, index) => {
                                    return (
                                        <Select.Option value={item.value} key={index}>
                                            {item.label}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    ) : null}
                    <Button className="ml8 mb8" onClick={() => onSearch(formData.payStatus)}>
                        查询
                    </Button>
                </Form>
                <div className="pl8 flex flex_align_end">
                    <Button className="mr8 mb8" onClick={onReloadSync}>
                        导出
                    </Button>
                    {formData.payStatus === 'unpaid' ? (
                        <Button className="mr8 mb8" disabled={!ids.length} onClick={goPay}>
                            支付
                        </Button>
                    ) : null}
                    {formData.payStatus === 'unpaid' ? (
                        <Button className="mr8 mb8" disabled={!ids.length} onClick={goNullify}>
                            作废
                        </Button>
                    ) : null}
                    {formData.payStatus === 'failed' ? (
                        <Button className="mr8 mb8" disabled={!ids.length} onClick={goRepay}>
                            重新支付
                        </Button>
                    ) : null}
                    {formData.payStatus === 'failed' ? (
                        <Button className="mr8 mb8" disabled={!ids.length} onClick={goStopPay}>
                            终止支付
                        </Button>
                    ) : null}
                    {formData.payStatus === 'doing' ? (
                        <Button className="mr8 mb8" disabled={!ids.length} onClick={goStatusDown}>
                            状态下载
                        </Button>
                    ) : null}
                </div>
            </div>
            <div className={'pl8'}>
                {statusList.map((item) => (
                    <Button
                        className={item.value !== formData.payStatus ? `${styles.deButton} mr8 mb8` : 'mr8 mb8'}
                        onClick={() => onSearch(item.value)}
                        key={item.value}
                    >
                        {item.label}
                    </Button>
                ))}
            </div>
            {payVisible && (
                <GlobalModal
                    title="提示"
                    open={true}
                    maskClosable={false}
                    mask={false}
                    modalSize="small"
                    bodyStyle={{ height: '300px' }}
                    footer={[
                        <Button key="back" onClick={cancelPay}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" onClick={onSubmitPay}>
                            确定
                        </Button>,
                    ]}
                    onCancel={cancelPay}
                    getContainer={() => {
                        return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                    }}
                >
                    <div className="flex flex_direction_column height_100">
                        <div className="flex_center flex_direction_column">
                            <Form ref={payFormRef}>
                                <Space>
                                    <Form.Item
                                        label="支付密码:"
                                        name="password"
                                        rules={[{ required: true, message: '请输入支付密码' }]}
                                    >
                                        <Input.Password />
                                    </Form.Item>
                                    <a onClick={goForgetPassword}>忘记密码</a>
                                </Space>
                            </Form>
                        </div>
                    </div>
                </GlobalModal>
            )}
            {forgetPasswordVisible && (
                <GlobalModal
                    title="忘记密码"
                    open={true}
                    maskClosable={false}
                    mask={false}
                    modalSize="small"
                    bodyStyle={{ height: '300px' }}
                    footer={[
                        <Button key="back" onClick={cancelForgetPassword}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" onClick={onSubmitPassword}>
                            确定
                        </Button>,
                    ]}
                    onCancel={cancelForgetPassword}
                    getContainer={() => {
                        return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                    }}
                >
                    <div className="flex flex_direction_column height_100">
                        <div className="flex_center flex_direction_column">
                            <Form ref={forgetFormRef}>
                                <Form.Item
                                    labelCol={{ span: 10 }}
                                    wrapperCol={{ span: 14 }}
                                    label="支付密码:"
                                    name="password"
                                    rules={[{ required: true, message: '请输入支付密码' }]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 10 }}
                                    wrapperCol={{ span: 14 }}
                                    label="请确认支付密码:"
                                    name="confirmPassword"
                                    rules={[
                                        { required: true, message: '请确认支付密码' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                //   if (!value) {
                                                //     return Promise.reject(new Error('请确认支付密码'));
                                                //   } else
                                                if (getFieldValue('password') !== value) {
                                                    return Promise.reject(new Error('两次输入密码不一致!'));
                                                }
                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </GlobalModal>
            )}
            {stopPay && (
                <GlobalModal
                    title="是否终止支付！如终止支付金额将返还到指标中！"
                    open={true}
                    top={'2%'}
                    maskClosable={false}
                    mask={false}
                    modalSize="small"
                    footer={[
                        <Button key="back" onClick={cancelStopPay}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" onClick={onSubmitStopPay}>
                            确定
                        </Button>,
                    ]}
                    bodyStyle={{ height: '300px' }}
                    onCancel={cancelStopPay}
                    getContainer={() => {
                        return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                    }}
                >
                    <div className="flex_center flex_direction_column">
                        <Form ref={stopFormRef}>
                            <Form.Item
                                label="请输入终止支付原因:"
                                name="remark"
                                rules={[{ required: true, message: '请输入终止支付原因' }]}
                            >
                                <TextArea />
                            </Form.Item>
                        </Form>
                    </div>
                </GlobalModal>
            )}
        </div>
    );
};

export default connect(({ yqPayment }) => ({
    yqPayment,
}))(Container);
