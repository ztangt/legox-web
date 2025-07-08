import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Modal, Form, Input, Select } from 'antd';
import { connect } from 'dva';
import { DoubleRightOutlined } from '@ant-design/icons';
import BaseForm from '../../../components/baseFormMix';
import SuperSearch from '../../../components/superSearch';
import styles from '../index.less';

const SearchLine = (props) => {
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
    // 发放
    const provide = (e) => {
        if (selectRowKey && selectRowKey.length > 0) {
            const selectStatusOne = JSON.parse(JSON.stringify(selectRowKey));
            // 根据不同支票状态显示
            const selectStatusArr = selectStatusOne.filter((item) => item.zpzt == 2);
            if (selectStatusArr.length > 0) {
                Modal.confirm({
                    title: '提示',
                    content: `支票号${selectStatusArr[0].zph}已领用,不可再次发放`,
                    okText: '确定',
                    getContainer: () => {
                        return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                    },
                    maskClosable: false,
                    mask: false,
                });
            } else {
                dispatch({
                    type: 'checkProvide/getGrantModalList',
                    payload: {},
                    callback: (value) => {
                        dispatch({
                            type: 'layoutG/updateStates',
                            payload: {
                                modalShow: true,
                            },
                        });
                    },
                });
            }
        } else {
            message.error('请选择操作项');
        }
    };
    // 取消发放
    const cancelProvide = () => {
        if (selectRowKey && selectRowKey.length > 0) {
            const selectStatusOne = JSON.parse(JSON.stringify(selectRowKey));
            // 根据不同支票状态显示
            const selectStatusArr = selectStatusOne.filter((item) => item.zpzt == 1);
            if (selectStatusArr.length > 0) {
                Modal.confirm({
                    title: '提示',
                    content: `支票号${selectStatusArr[0].zph}未领用,不可取消发放`,
                    okText: '确定',
                    getContainer: () => {
                        return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                    },
                    maskClosable: false,
                    mask: false,
                });
            } else {
                Modal.confirm({
                    title: '信息',
                    content: '确定要取消发放',
                    okText: '是',
                    cancelText: '否',
                    getContainer: () => {
                        return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                    },
                    maskClosable: false,
                    mask: false,
                });
            }
        } else {
            message.error('请选择操作项');
        }
    };
    const list = [
        {
            fieldtype: 'input',
            key: 'checkInput',
            label: '支票号查询', // label+placeholder
            required: false, // 校验
            showLabel: false, // 是否显示label
            isSearch: true, //input是否是搜索组件
        },
        {
            fieldtype: 'select',
            key: 'checkType',
            label: '支票类型',
            required: false,
            showLabel: true,
            list: [
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
            checkType: 1,
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
                    name: '已入库未领用',
                },
                {
                    id: 2,
                    name: '已领用未使用',
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
            <div className={styles.header}>
                <BaseForm inline={true} {...config} />
                <div className={styles.higher}>
                    <div className={styles.higher_content} onClick={showHigherLevel.bind(this)}>
                        <span>高级</span>
                        <DoubleRightOutlined />
                    </div>
                    <div className={styles.publish}>
                        <Button onClick={provide} className={styles.btn}>
                            发放
                        </Button>
                        <Button onClick={cancelProvide}>取消发放</Button>
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
