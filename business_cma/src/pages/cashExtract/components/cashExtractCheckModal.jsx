import { Button, message } from 'antd';
import { useEffect, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import GlobalModal from '../../../components/GlobalModal';
import InputSearch from '../../../components/inputSearch';
import IPagination from '../../../components/iPagination/iPagination';
import { getColumnsList } from './config';

import { connect } from 'dva';

const CashExtractCheckModal = ({ dispatch, info, changeVisible, cashExtract, onOk, oldCheckNo }) => {
    const { checkStart, checkLimit, extractCheckList, checkReturnCount } = cashExtract;

    const [curHeight, setCurHeight] = useState(0);
    const [selectRowKey, setSelectRowKey] = useState([]);
    const [selectRow, setSelectRow] = useState([]);

    const [checkNo, setCheckNo] = useState('');
    const [columns, setColumns] = useState([]);

    //初始化selectRowKey、初始化columns
    useEffect(() => {
        let boxHeight = document.getElementById('cashExtractCheckModal_box')?.clientHeight || 0;
        let headHeight = document.getElementById('cashExtractCheckModal_head')?.clientHeight || 0;
        let height = boxHeight - headHeight - 70;
        setCurHeight(height);
        setSelectRowKey([oldCheckNo]);
        getList(1, '');
        setColumns(getColumnsList(cashExtract, null, 'pay'));
    }, []);

    //初始化rows
    useEffect(() => {
        let rows = extractCheckList.filter((item) => item.checkNo == selectRowKey);
        setSelectRow(rows);
    }, [extractCheckList, selectRowKey]);

    //获取可选择的支票
    const getList = (checkStart, checkNo) => {
        dispatch({
            type: 'cashExtract/getCashExtractCheckList',
            payload: {
                checkBankAccount: info.BANK_ACCOUNT,
                checkNo: checkNo, //搜索框内容
                start: checkStart,
                limit: checkLimit,
            },
        });
    };

    const changeRow = (selectedRowKeys, selectedRows) => {
        setSelectRowKey(selectedRowKeys);
        setSelectRow(selectedRows);
    };

    //分页
    const changePage = (nextPage, size) => {
        getList(nextPage, checkNo);
    };

    const onConfirm = () => {
        console.log(selectRow, 'selectRow');
        if (selectRow.length != 1) {
            return message.error('请选择一个支票号');
        }
        onOk(selectRow[0]);
    };
    return (
        <div>
            <GlobalModal
                title="请选择支票号"
                open={true}
                top={'2%'}
                getContainer={() => {
                    return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                }}
                footer={[
                    <Button onClick={() => changeVisible(false)}>取消</Button>,
                    <Button type="primary" onClick={onConfirm}>
                        确定
                    </Button>,
                ]}
                onCancel={() => changeVisible(false)}
                maskClosable={false}
                mask={false}
                modalSize="middle"
            >
                <div id="cashExtractCheckModal_box" className="height_100" style={{ position: 'relative' }}>
                    <div className={'pb10'} id={'cashExtractCheckModal_head'}>
                        <InputSearch
                            placeholder="请输入支票号查询"
                            onSearch={(value) => getList(1, value)}
                            allowClear
                            style={{ width: 360 }}
                            onChange={(e) => setCheckNo(e.target.value)}
                        />
                    </div>
                    <ColumnDragTable
                        rowSelection={{
                            type: 'radio',
                            selectedRowKeys: selectRowKey,
                            onChange: changeRow,
                        }}
                        rowKey="checkNo"
                        taskType="MONITOR"
                        tableLayout="fixed"
                        scroll={{
                            y: curHeight,
                        }}
                        dataSource={extractCheckList}
                        pagination={false}
                        bordered={true}
                        showSorterTooltip={false}
                        columns={columns}
                    />
                    <IPagination
                        showSizeChanger={false}
                        current={checkStart}
                        total={checkReturnCount}
                        pageSize={checkLimit}
                        isRefresh={true}
                        refreshDataFn={() => {
                            getList(checkStart, checkNo);
                        }}
                        onChange={changePage}
                    />
                </div>
            </GlobalModal>
        </div>
    );
};

export default connect(({ cashExtract }) => ({ cashExtract }))(CashExtractCheckModal);
