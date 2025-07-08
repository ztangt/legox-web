import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Modal, Form, Input, Select } from 'antd';
import { connect } from 'dva';
import BaseForm from '../../../components/baseFormMix';
import styles from '../index.less';

const SearchLine = (props) => {
    const { selectRowKey, selectRows, baseFindCallback, dispatch } = props;
    // base 普通表单
    const [formRef, setFormRef] = useState({});
    /**
     * 设置普通表单的ref
     */
    const getFormRef = (formRef) => {
        setFormRef(formRef);
    };

    /**
     * 普通 回调函数
     */
    const callback = (value, list) => {
        // console.log('value', value);
        // console.log('list', list);
        baseFindCallback(value, list);
        // onClose()
    };
    /**
     * 普通搜索 重置
     */
    const searchLineResetFields = () => {
        formRef.current.resetFields();
    };

    // 删除
    const onDelClick = (e) => {
        if (selectRowKey && selectRowKey.length > 0) {
            // TODO
            Modal.confirm({
                title: '提示',
                content: `确认删除？`,
                okText: '确定',
                getContainer: () => {
                    return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                },
                maskClosable: false,
                mask: false,
                onOk() {
                    console.log(selectRowKey.toString(), selectRows);
                    dispatch({
                        type: `manageOrg/deleteManagrOrg`,
                        payload: {
                            ids: selectRowKey.toString(),
                        },
                        callback: () => {
                            // TODO 刷新列表
                            // getDemoList()
                        },
                    });
                },
            });
        } else {
            message.error('请选择操作项');
        }
    };
    // 新增
    const click2 = () => {
        console.log('按钮2', searchWord.value);
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
            // key: 'checkInput',
            label: '搜索项', // label+placeholder
            required: false, // 校验
            showLabel: false, // 是否显示label
            isSearch: true, //input是否是搜索组件
            key: 'searchWord',
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

    return (
        <div id="list_head_cma">
            <div className={styles.header}>
                <BaseForm inline={true} {...config} />
                <div className={styles.higher}>
                    {/* TODO 替换按钮操作 */}
                    <div>
                        <Button onClick={onDelClick} className="_margin_right_8">
                            删除
                        </Button>
                        <Button onClick={click2}>新增</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default connect(({ manageOrg }) => ({
    manageOrg,
}))(SearchLine);
