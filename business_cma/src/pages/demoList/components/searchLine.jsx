import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Modal, Form, Input, Select } from 'antd';
import { connect } from 'dva';
import { DoubleRightOutlined } from '@ant-design/icons';
import BaseForm from '../../../components/baseFormMix';
import SuperSearch from '../../../components/superSearch';
import styles from '../index.less';

const SearchLine = (props) => {
    const { showHigherForm, selectRowKey, selectRows, baseFindCallback, higherFindCallback, dispatch, companyList } =
        props;
    console.log('companyList2', companyList);
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
        // console.log('value=>', value, list);
        higherFindCallback(value, list);
        // onClose()
    };

    /**
     * 普通 回调函数
     */
    const callback = (value, list) => {
        // console.log('value', value);
        // console.log('list', list);
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
    // 按钮1
    const onDelClick = (e) => {
        if (selectRowKey && selectRowKey.length > 0) {
            // TODO
            Modal.confirm({
                title: '提示',
                content: `确认XXXonDelClick？`,
                okText: '确定',
                getContainer: () => {
                    return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                },
                maskClosable: false,
                mask: false,
                onOk() {
                    console.log(selectRowKey.toString(), selectRows);
                    // TODO  req
                    // dispatch({
                    //   type: `demoList/delItem`,
                    //   payload: {
                    //     ids: selectRowKey,
                    //   },
                    // });
                    // message.success('onDelClick',selectRowKey);
                },
            });
        } else {
            message.error('请选择操作项');
        }
    };
    // 按钮2
    const click2 = () => {
        if (selectRowKey && selectRowKey.length > 0) {
            // TODO
            Modal.confirm({
                title: '提示',
                content: `确认XXXclick2？`,
                okText: '确定',
                getContainer: () => {
                    return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                },
                maskClosable: false,
                mask: false,
                onOk() {
                    // TODO  req
                    message.success('click2');
                },
            });
        } else {
            message.error('请选择操作项');
        }
    };
    //  TODO 常规搜索项
    const list = [
        {
            fieldtype: 'input',
            key: 'checkInput',
            label: '搜索项', // label+placeholder
            required: false, // 校验
            showLabel: false, // 是否显示label
            isSearch: true, //input是否是搜索组件
        },
        {
            fieldtype: 'select',
            key: 'checkType',
            label: '下拉选择类',
            required: false,
            showLabel: true,
            list: companyList,
            // list: [
            //   {
            //     id: 1,
            //     name: '选项1',
            //   },
            //   {
            //     id: 2,
            //     name: '选项2',
            //   },
            // ],
            option: {},
        },
    ];
    const config = {
        list: list,
        getFormRef: getFormRef,
        callback: callback,
        initialValues: {
            checkInput: '',
            checkType: 1,
        },
        searchLineResetFields: searchLineResetFields,
    };
    // TODO 高级搜索项
    const highList = [
        {
            fieldtype: 'input',
            key: 'title',
            label: '输入框',
            required: false,
            showLabel: true,
        },
        {
            fieldtype: 'inputNumber',
            key: 'name2',
            label: '数字输入框',
            required: false,
            showLabel: true,
        },
        {
            fieldtype: 'select',
            key: 'name3',
            label: '下拉选择类',
            required: false,
            showLabel: true,
            list: [
                {
                    id: 0,
                    name: '全部',
                },
                {
                    id: 1,
                    name: '选项1',
                },
                {
                    id: 2,
                    name: '选项2',
                },
            ],
            option: {},
        },
        {
            fieldtype: 'date',
            key: 'name4',
            label: '日期输入框',
            format: 'YYYY-MM-DD',
            required: false,
            showLabel: true,
        },
        {
            fieldtype: 'checkbox',
            key: 'name5',
            label: '多选框',
            required: false,
            showLabel: true,
            list: [
                {
                    id: 0,
                    name: '全部',
                },
                {
                    id: 1,
                    name: '选项1',
                },
                {
                    id: 2,
                    name: '选项2',
                },
            ],
            option: {},
        },
        {
            fieldtype: 'radio',
            key: 'name6',
            label: '单选框',
            required: false,
            showLabel: true,
            list: [
                {
                    id: 0,
                    name: '全部',
                },
                {
                    id: 1,
                    name: '选项1',
                },
                {
                    id: 2,
                    name: '选项2',
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
        // TODO highList中的key对应
        initialValues: {
            name1: '',
            name2: '',
            name3: '',
            name4: '',
            name5: '',
            name6: '',
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
                    {/* TODO 替换按钮操作 */}
                    <div>
                        <Button onClick={onDelClick} className="_margin_right_8">
                            批量删除
                        </Button>
                        <Button onClick={click2}>按钮2</Button>
                    </div>
                </div>
            </div>
            {isShowHigher && <SuperSearch {...highConfig} />}
        </div>
    );
};

export default connect(({ demoList }) => ({
    demoList,
}))(SearchLine);
