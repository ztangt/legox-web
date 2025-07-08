import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import ColumnDragTable from '../../../components/columnDragTable';
import { modalCurrentHeight } from '../../../util/util';
import GlobalModal from '../../../components/GlobalModal';
import IPagination from '../../../components/iPagination/iPagination';
import { timeStampFormat } from '../../../util/util';
import styles from '../index.less';
import { recordConfigData } from './config';

const CheckWindowData = ({ dispatch, checkIframe, onCancel, confirm }) => {
    // 弹窗显隐
    const [selectRowKey, setSelectRowKey] = useState([]);
    const [selectSyncKeys, setSelectSyncKeys] = useState([]);
    const [selectRows, setSelectRows] = useState([]); // 选中行的all data
    const { list } = checkIframe;

    const [curHeight, setCurHeight] = useState(0);

    // 获取基础码表配置
    const getChekckNumber = () => {
        dispatch({
            type: 'checkIframe/getCheckNumber',
            payload: {},
        });
    };

    //复选框
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log('selectedRowKeys', selectedRowKeys);
            console.log('setSelectRows', selectedRows);
            setSelectRowKey(selectedRows);
            setSelectSyncKeys(selectedRowKeys);
            setSelectRows(selectedRows);
        },
    };

    const tableProps = {
        rowKey: 'ID',
        columns: [
            {
                title: '序号',
                dataIndex: 'number',
                width: 40,
            },
            {
                title: '单位',
                dataIndex: 'orgName',
            },
            {
                title: '银行',
                dataIndex: 'checkBankAccountName',
            },
            {
                title: '银行账户',
                dataIndex: 'checkBankAccount',
            },
            {
                title: '类别',
                dataIndex: 'checkType',
                render: (text) => <div>{recordConfigData.iframeCheckType[text]}</div>,
            },
            {
                title: '支票号',
                dataIndex: 'checkNo',
            },
            {
                title: '支票状态',
                dataIndex: 'checkStatus',
                render: (text) => <div>{recordConfigData.iframeCheckStatus[text]}</div>,
            },
            {
                title: '领用人',
                dataIndex: 'recipintName',
            },
            {
                title: '领用时间',
                dataIndex: 'recipintTime',
                render(text) {
                    return <div>{timeStampFormat(text * 1000)}</div>;
                },
            },
        ],
        dataSource:
            list &&
            list.length > 0 &&
            list.map((item, index) => {
                item.number = index + 1;
                return item;
            }),
        pagination: false,
        bordered: true,
        showSorterTooltip: false,
    };

    useEffect(() => {
        setCurHeight(modalCurrentHeight());
        getChekckNumber();
    }, []);

    return (
        <GlobalModal
            title="信息"
            open={true}
            onCancel={onCancel}
            onOk={() => confirm(selectRows)}
            top={'5%'}
            getContainer={() => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            }}
            maskClosable={false}
            mask={false}
            modalSize="middle"
            zIndex={10000}
        >
            <div id="modal_container" className={styles.table}>
                <div>
                    <ColumnDragTable
                        rowSelection={{
                            type: 'radio',
                            ...rowSelection,
                        }}
                        taskType="MONITOR"
                        tableLayout="fixed"
                        modulesName="checkIframe"
                        {...tableProps}
                        scroll={{ y: 1500, x: 1600 }}
                    ></ColumnDragTable>
                </div>

                {/* <IPagination
            current={Number(currentPage)}
            total={Number(returnCount)}
            onChange={changePage}
            pageSize={Number(limit)}
            isRefresh={true}
            refreshDataFn={() => {
              getReceiveList('', '', currentPage, limit);
            }}
          /> */}
            </div>
        </GlobalModal>
    );
};

export default connect(({ checkIframe }) => ({
    checkIframe,
}))(CheckWindowData);
