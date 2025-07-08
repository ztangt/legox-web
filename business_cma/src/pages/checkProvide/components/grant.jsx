// 发放弹窗
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import GlobalModal from '../../../components/GlobalModal';
import BaseForm from '../../../components/baseFormMix';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import { BASE_WIDTH } from '../../../util/constant';
import styles from '../index.less';

const GrantModal = ({ dispatch, onCancel, layoutG, checkProvide }) => {
    const { modalShow } = layoutG;
    const { currentHeight, currentPage, returnCount, limit, grantModalListData } = checkProvide;
    const [formRef, setFormRef] = useState({});
    // 保存确认
    const confirm = () => {
        onCancel();
    };
    // 页面改变
    const changePage = () => {};

    /**
     * 设置普通表单的ref
     */
    const getFormRef = (formRef) => {
        setFormRef(formRef);
    };
    console.log('grantModalListData', grantModalListData);
    const tableProps = {
        rowKey: 'user_id',
        columns: [
            {
                title: '序号',
                dataIndex: 'number',
                width: 60,
            },
            {
                title: '人员名称',
                dataIndex: 'user_name',
                width: BASE_WIDTH,
            },
            {
                title: '所属部门',
                dataIndex: 'dept_name',
                width: BASE_WIDTH,
            },
        ],
        dataSource:
            grantModalListData.rows &&
            grantModalListData.rows.length > 0 &&
            grantModalListData.rows.map((item, index) => {
                item.number = index + 1;
                return item;
            }),
        pagination: false,
        bordered: true,
    };
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
    };

    /**
     * 普通 回调函数
     */
    const callback = (value, list) => {
        console.log('value', value);
        console.log('list', list);
    };
    const list = [
        {
            fieldtype: 'input',
            key: 'grantModalInput',
            label: '关键字查询', // label+placeholder
            required: false, // 校验
            showLabel: false, // 是否显示label
            isSearch: true, //input是否是搜索组件
        },
    ];
    // 配置
    const config = {
        list: list,
        //   getFormRef: getFormRef,
        callback: callback,
        initialValues: {
            grantModalInput: '',
        },
    };
    console.log('grantModalListData', grantModalListData);
    return (
        <GlobalModal
            title="信息"
            open={modalShow}
            onCancel={onCancel}
            onOk={confirm}
            top={'4%'}
            getContainer={() => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            }}
            maskClosable={false}
            mask={false}
            modalSize="smallBigger"
        >
            <div className={styles.grantList}>
                <div>
                    <BaseForm inline={true} {...config} />
                </div>
                <div className={styles.tableList}>
                    <ColumnDragTable
                        rowSelection={{
                            type: 'checkbox',
                            ...rowSelection,
                        }}
                        taskType="MONITOR"
                        tableLayout="fixed"
                        {...tableProps}
                        className={styles.table}
                        modulesName="checkProvide"
                        scroll={{
                            y: 170,
                            x: grantModalListData.rows.length > 0 ? '500px' : 'auto',
                        }}
                    />
                </div>
                <IPagination
                    current={Number(currentPage)}
                    total={returnCount || 1}
                    onChange={changePage}
                    pageSize={limit}
                    isRefresh={true}
                    style={{ zIndex: 99999 }}
                    // refreshDataFn={()=>{getMessageList(searchWord, keyWords, currentPage, limit,)}}
                />
            </div>
        </GlobalModal>
    );
};

export default connect(({ checkProvide, layoutG }) => ({
    checkProvide,
    layoutG,
}))(GrantModal);
