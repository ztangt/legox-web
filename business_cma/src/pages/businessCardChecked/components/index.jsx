import calcFn from '@/util/calc';
import { message, Modal, Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useRef, useState } from 'react';
import VTable from '../../../components/vTable/index';
import { getColumnsList } from './config';
import SearchCom from './searchCom';

const Index = ({ dispatch, businessCardChecked }) => {
    const { loading, isInit } = businessCardChecked;
    const [columns, setColumns] = useState([]);
    const vTableRef = useRef(null);
    const list = useRef([]);
    const checkStates = useRef([]);

    useEffect(() => {
        dispatch({ type: 'businessCardChecked/getDictList' });
        dispatch({ type: 'businessCardChecked/findLoginUserByIdAndRoleId' });
        getList();
    }, []);

    useEffect(() => {
        isInit && setColumns(getColumnsList(businessCardChecked));
    }, [isInit]);

    //保存查询条件
    const formInfo = useRef({});
    const changeFormInfo = (values) => {
        formInfo.current = values;
    };

    const [number, setNumber] = useState({ length: 0, amount: 0 });
    const getList = () => {
        dispatch({ type: 'businessCardChecked/updateStates', payload: { loading: true } });
        dispatch({
            type: 'businessCardChecked/getList',
            payload: { ...formInfo.current },
            callback: (newList) => {
                list.current = newList;
                vTableRef.current.setRecords(newList, { sortState: null });
                vTableRef.current.clearSelected();
                vTableRef.current.scrollToCell({ row: 1, col: 2 }); //表格跳转到第一行
                checkStates.current = [];
                setNumber({ length: 0, amount: 0 });
            },
        });
    };

    const onExport = (values) => {
        let selectedRowKeys = getChecked().rowKeys;
        dispatch({ type: 'businessCardChecked/updateStates', payload: { loading: true } });
        dispatch({
            type: 'businessCardChecked/onExport',
            payload: {
                ...values,
                cashierInfoIds: selectedRowKeys.join(','),
                quryType: 0,
                fileName: '公务卡待核对导出',
                fileType: 'excel',
                exportType: selectedRowKeys.length ? 0 : 1,
            },
            callback: function (path) {
                if (!path) {
                    return;
                }
                message.success('导出成功');
                // 这里的文件名根据实际情况从响应头或者url里获取
                const a = document.createElement('a');
                a.href = path;
                a.click();
            },
        });
    };

    // 批量核对
    const onBatchHandle = () => {
        let selectedRowKeys = getChecked().rowKeys;
        if (!selectedRowKeys.length) {
            return message.error('请选择操作项');
        }
        Modal.confirm({
            title: '提示',
            content: `确定要批量核对？`,
            okText: '确定',
            maskClosable: false,
            mask: false,
            getContainer: document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false,
            onOk() {
                dispatch({
                    type: 'businessCardChecked/updateStates',
                    payload: { loading: true },
                });
                console.log(selectedRowKeys.join(','), '单据ID');
                dispatch({
                    type: 'businessCardChecked/batchCheck',
                    payload: {
                        cashierInfoId: selectedRowKeys.join(','),
                    },
                    callback() {
                        message.success('批量核对成功');
                        getList();
                    },
                });
            },
        });
    };

    const onCheckboxStateChange = (field) => {
        checkStates.current = vTableRef.current.getCheckboxState();
        // 计算选中的行数和金额
        let length = 0;
        let amount = 0;
        checkStates.current.forEach((item, index) => {
            if (item.isChecked) {
                length++;
                amount = calcFn.add(amount, list.current[index].amount);
            }
        });
        setNumber({ length, amount });
    };

    //获取选中的行和ID
    const getChecked = () => {
        let rows = [];
        let rowKeys = [];
        checkStates.current.forEach((item, index) => {
            if (item.isChecked) {
                rowKeys.push(list.current[index].cashierInfoId);
                rows.push(list.current[index]);
            }
        });
        return { rowKeys, rows };
    };

    return (
        <div>
            <Spin spinning={loading}>
                <SearchCom
                    getList={getList}
                    onExport={onExport}
                    onBatchHandle={onBatchHandle}
                    number={number}
                    changeFormInfo={changeFormInfo}
                />
                <VTable
                    ref={vTableRef}
                    headId={'businessCardChecked_head_id'}
                    columns={columns}
                    onCheckboxStateChange={onCheckboxStateChange}
                    frozenColCount={2}
                />
            </Spin>
        </div>
    );
};

export default connect(({ businessCardChecked }) => ({
    businessCardChecked,
}))(Index);
