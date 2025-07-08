import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Modal, Form, Input, Select } from 'antd';
import { useModel } from 'umi';
import { connect } from 'dva';
import { DoubleRightOutlined } from '@ant-design/icons';
import BaseForm from '../../../components/baseFormMix';
import SuperSearch from '../../../components/superSearch';
import styles from '../index.less';

const SearchLine = (props) => {
    const { location } = useModel('@@qiankunStateFromMaster');
    console.log(location, '==location');
    const { showHigherForm, selectRowKey, baseFindCallback, higherFindCallback, dispatch } = props;
    // base 普通表单
    const [formRef, setFormRef] = useState({});
    const [highRef, setHighRef] = useState({});
    const [isShowHigher, setIsShowHigher] = useState(false);

    /**
     * 设置普通表单的ref
     */
    const getFormRef = (formRef) => {
        setFormRef(formRef);
    };

    /***
     * 设置高级表单的ref
     *
     */
    const getHighFormRef = (formRef) => {
        setHighRef(formRef);
    };
    /**
     * 高级搜索callback
     */
    const highCallback = (value, list) => {
        console.log('value=>', value, list);
        higherFindCallback(value, list);
        // onClose()
    };

    /**
     * 普通 回调函数
     */
    const callback = (value, list) => {
        console.log('value', value);
        console.log('list', list);
        baseFindCallback(value, list);
        onClose();
    };
    /**
     * 普通搜索 重置
     */
    const searchLineResetFields = () => {
        formRef.current.resetFields();
    };
    /**
     * 高级搜索 重置
     */
    const highSearchResetFields = () => {
        highRef.current.resetFields();
        searchLineResetFields();
        // onClose()
    };
    // 显示高级
    const showHigherLevel = () => {
        setIsShowHigher(!isShowHigher);
        // 列表用来动态计算高度
        showHigherForm(isShowHigher);
    };
    // 关闭高级
    const onClose = () => {
        setIsShowHigher(false);
        // 列表用来动态计算高度
        showHigherForm(isShowHigher);
    };
    // 申请作废
    const applicationInvalidate = () => {
        console.log('selectRowKey', selectRowKey);
        if (!selectRowKey.length) {
            message.error('请选择操作项');
            return;
        }
        dispatch({
            type: 'layoutG/updateStates',
            payload: {
                modalShow: true,
            },
        });
    };
    // 取消申请
    const applicationCancel = () => {
        if (!selectRowKey.length) {
            message.error('请选择操作项');
            return;
        }
        if (selectRowKey[0].zpzt == '已作废') {
            Modal.confirm({
                title: '提示',
                content: `已作废不可申请作废`,
                okText: '确定',
                getContainer: () => {
                    return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                },
                maskClosable: false,
                mask: false,
            });
        } else {
            Modal.confirm({
                title: '提示',
                content: `未申请作废，不可取消作废`,
                okText: '确定',
                getContainer: () => {
                    return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                },
                maskClosable: false,
                mask: false,
            });
        }
    };
    // 导出excel
    const exportExcel = () => {};

    const list = [
        {
            fieldtype: 'input',
            key: 'checkInput',
            label: '支票号查询', // label+placeholder
            required: false, // 校验
            showLabel: false, // 是否显示label
            isSearch: true, //input是否是搜索组件
        },
    ];
    const config = {
        // data: {
        //   //   ...data,
        //   initFieldsValueFlag: true,
        // },
        list: list,
        getFormRef: getFormRef,
        callback: callback,
        initialValues: {
            checkInput: '',
        },
        searchLineResetFields: searchLineResetFields,
    };
    const highList = [
        {
            fieldtype: 'input',
            key: 'company',
            label: '单位',
            required: false,
            showLabel: true,
        },
        {
            fieldtype: 'select',
            key: 'checkType',
            label: '支票类型',
            required: false,
            showLabel: true,
            list: [
                {
                    id: 0,
                    name: '全部',
                },
                {
                    id: 1,
                    name: '现金',
                },
                {
                    id: 2,
                    name: '转账',
                },
            ],
            option: {},
        },
        {
            fieldtype: 'input',
            key: 'bank',
            label: '开户行',
            required: false,
            showLabel: true,
        },
        {
            fieldtype: 'input',
            key: 'bankAccount',
            label: '银行账户',
            required: false,
            showLabel: true,
        },
        {
            fieldtype: 'input',
            key: 'recipient',
            label: '领用人',
            required: false,
            showLabel: true,
        },
        {
            fieldtype: 'select',
            key: 'checkStatus',
            label: '支票状态',
            required: false,
            showLabel: true,
            list: [
                {
                    id: 0,
                    name: '全部',
                },
                {
                    id: 1,
                    name: '已领用',
                },
                {
                    id: 2,
                    name: '已使用',
                },
                {
                    id: 3,
                    name: '已作废',
                },
            ],
            option: {},
        },
        {
            fieldtype: 'select',
            key: 'isInvalid',
            label: '是否申请作废',
            required: false,
            showLabel: true,
            list: [
                {
                    id: 0,
                    name: '全部',
                },
                {
                    id: 1,
                    name: '是',
                },
                {
                    id: 2,
                    name: '否',
                },
            ],
            option: {},
        },
    ];

    const highConfig = {
        // data: {
        //   //   ...data,
        //   initFieldsValueFlag: true,
        // },
        list: highList,
        getFormRef: getHighFormRef,
        callback: highCallback,
        initialValues: {
            company: '',
            recipient: '',
            bank: '',
            bankAccount: '',
            checkType: 0,
            checkStatus: 0,
            isInvalid: 0,
        },
        onClose: onClose,
        highSearchResetFields: highSearchResetFields,
    };

    return (
        <div id="list_head_cma">
            <div className="header">
                <BaseForm inline={true} {...config} />
                <div className="_flex_justify_content_between _flex_1">
                    <div className="_margin_top_5 _cursor_pointer" onClick={showHigherLevel.bind(this)}>
                        <span className="_color_ant_primary">高级</span>
                        <DoubleRightOutlined className="_svg_w_10 margin_top_5 _transform_rotate_90" />
                    </div>
                    <div className={styles.publish}>
                        <Button className="_margin_right_8" onClick={applicationInvalidate}>
                            申请作废
                        </Button>
                        <Button className="_margin_right_8" onClick={applicationCancel}>
                            取消作废申请
                        </Button>
                        <Button onClick={exportExcel}>导出Excel</Button>
                    </div>
                </div>
            </div>
            {isShowHigher && <SuperSearch {...highConfig} />}
        </div>
    );
};

export default connect(({ checkProvide, layoutG }) => ({
    checkProvide,
    layoutG,
}))(SearchLine);
