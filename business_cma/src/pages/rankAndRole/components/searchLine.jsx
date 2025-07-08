import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import { Button, message, Modal } from 'antd';
import BaseForm from '../../../components/baseFormMix';
import EditModal from './editModal';
import { configData } from './config';
import styles from '../index.less';

const SearchLine = ({ dispatch, getTableList, selectRowKey, rangAndRole }) => {
    const { limit, currentPage } = rangAndRole;
    const [modalShow, setModalShow] = useState(false);
    const [editStatus, setEditStatus] = useState('');
    const [formRef, setFormRef] = useState({});
    const [searchWord, setSearchWord] = useState('');
    /**
     * 设置普通表单的ref
     */
    const getFormRef = (formRef) => {
        setFormRef(formRef);
    };
    const callback = (value, list) => {
        getTableList(value.cmaPositionLevel, 1, limit);
        setSearchWord(value.cmaPositionLevel);
    };
    const list = [
        {
            fieldtype: 'select',
            key: 'cmaPositionLevel',
            label: '职级',
            required: false,
            showLabel: true,
            list: configData.rankArrList,
            option: {},
        },
    ];
    const config = {
        list: list,
        callback: callback,
        getFormRef: getFormRef,
        initialValues: {},
    };
    const onCancel = (isRefresh = false) => {
        setModalShow(false);
        if (isRefresh) {
            getTableList(searchWord, 1, limit);
        }
    };
    // 查询提交
    const onSearch = () => {
        formRef.current.submit();
    };
    const onAdd = () => {
        setModalShow(true);
        setEditStatus('ADD');
        dispatch({
            type: 'rangAndRole/updateStates',
            payload: {
                rankEditModalSelect: [],
            },
        });
    };
    const onEdit = () => {
        if (!selectRowKey.length) {
            message.error('请选择操作项');
            return;
        }
        if (selectRowKey && selectRowKey.length > 1) {
            message.error('请单选操作项');
            return;
        }
        setModalShow(true);
        setEditStatus('EDIT');
        // 获取选中项
        dispatch({
            type: 'rangAndRole/getEditRoleList',
            payload: {
                cmaPositionLevel: selectRowKey.length > 0 && selectRowKey[0].cmaPositionLevel,
            },
        });
    };
    const onDelete = () => {
        if (!selectRowKey.length) {
            message.error('请选择操作项');
            return;
        }
        Modal.confirm({
            title: '提示',
            content: '确定要删除当前操作项',
            okText: '确定',
            cancelText: '取消',
            getContainer: () => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            },
            maskClosable: false,
            mask: false,
            bodyStyle: { height: 180, overflow: 'hidden' },
            onOk() {
                if (selectRowKey && selectRowKey.length > 0) {
                    const deleteArr = selectRowKey.map((item) => item.id).join(',');
                    console.log('deleteArr', deleteArr);
                    dispatch({
                        type: 'rangAndRole/deleteRankAndRole',
                        payload: {
                            idList: deleteArr,
                        },
                        callback() {
                            // 刷新页面
                            getTableList(searchWord, currentPage, limit);
                        },
                    });
                }
            },
        });
    };
    const modalConfig = {
        editStatus,
        onCancel,
        getTableList,
        searchWord,
        searchLimit: limit,
    };

    return (
        <div id="list_head_cma">
            <div className="_flex_justify_content_between _padding_left_right_16">
                <div className={styles.rank_header}>
                    <BaseForm inline={true} {...config} />
                    <Button className="_margin_top_2" onClick={onSearch}>
                        查询
                    </Button>
                </div>
                <div>
                    <Button className="_margin_right_8" onClick={onAdd}>
                        新增
                    </Button>
                    <Button className="_margin_right_8" onClick={onEdit}>
                        修改
                    </Button>
                    <Button onClick={onDelete}>删除</Button>
                </div>
            </div>
            {modalShow && <EditModal selectRowItem={selectRowKey} {...modalConfig} />}
        </div>
    );
};
export default connect(({ rangAndRole }) => ({
    rangAndRole,
}))(SearchLine);
