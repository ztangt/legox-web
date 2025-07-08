import calcFn from '@/util/calc';
import { message, Modal, Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useRef, useState } from 'react';
import VTable from '../../../components/vTable/index';
import { getColumnsList } from './config';
import SearchCom from './searchCom';

const Index = ({ dispatch, businessCardCheckedAfter }) => {
    const { loading, isInit } = businessCardCheckedAfter;
    const [columns, setColumns] = useState([]);
    const [number, setNumber] = useState({ length: 0, amount: 0 });
    const list = useRef([]);
    const vTableRef = useRef(null);
    const checkStates = useRef([]);

    useEffect(() => {
        dispatch({ type: 'businessCardCheckedAfter/getDictList' });
        dispatch({ type: 'businessCardCheckedAfter/findLoginUserByIdAndRoleId' });
        getList();
    }, []);

    useEffect(() => {
        isInit && setColumns(getColumnsList(businessCardCheckedAfter));
    }, [isInit]);

    //保存查询条件
    const formInfo = useRef({});
    const changeFormInfo = (values) => {
        formInfo.current = values;
    };
    const getList = () => {
        dispatch({ type: 'businessCardCheckedAfter/updateStates', payload: { loading: true } });
        dispatch({
            type: 'businessCardCheckedAfter/getList',
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

    //获取选中的行和ID
    const getChecked = () => {
        let rows = [];
        let rowKeys = [];
        console.log('checkStates', checkStates.current);
        checkStates.current.forEach((item, index) => {
            if (item.isChecked) {
                rowKeys.push(list.current[index].cashierInfoId);
                rows.push(list.current[index]);
            }
        });
        return { rowKeys, rows };
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

    const onExport = (values) => {
        let selectedRowKeys = getChecked().rowKeys;
        dispatch({ type: 'businessCardCheckedAfter/updateStates', payload: { loading: true } });
        dispatch({
            type: 'businessCardCheckedAfter/onExport',
            payload: {
                ...values,
                cashierInfoIds: selectedRowKeys.join(','),
                quryType: 1,
                fileName: '公务卡已核对导出',
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

    // 汇总
    const onBatchHandle = () => {
        let selectedRowKeys = getChecked().rowKeys;
        if (!selectedRowKeys.length) {
            return message.error('请选择操作项');
        }
        if (!formInfo.current.payerAccountNumber) {
            // 选择银行账户,是为了确保汇总时的银行账户是一致的
            return message.error('请选择银行账户后查询,保证汇总时单据的银行账户一致');
        }

        Modal.confirm({
            title: '提示',
            content: `确定进行汇总？`,
            okText: '确定',
            maskClosable: false,
            mask: false,
            getContainer: document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false,
            onOk() {
                dispatch({
                    type: 'businessCardCheckedAfter/updateStates',
                    payload: { loading: true },
                });
                dispatch({
                    type: 'businessCardCheckedAfter/batchCheck',
                    payload: {
                        cashierInfoId: selectedRowKeys.join(','),
                        type: 1,
                    },
                    callback() {
                        message.success('汇总成功');
                        getList();
                    },
                });
            },
        });
    };

    //取消核对
    const onCancelVeri = () => {
        let selectedRowKeys = getChecked().rowKeys;
        if (!selectedRowKeys.length) {
            return message.error('请选择操作项');
        }
        Modal.confirm({
            title: '提示',
            content: `确定取消核对？`,
            okText: '确定',
            maskClosable: false,
            mask: false,
            getContainer: document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false,
            onOk() {
                dispatch({
                    type: 'businessCardCheckedAfter/updateStates',
                    payload: { loading: true },
                });
                dispatch({
                    type: 'businessCardCheckedAfter/onCancelVeri',
                    payload: {
                        cashierInfoId: selectedRowKeys.join(','),
                    },
                    callback() {
                        message.success('取消核对成功');
                        getList();
                    },
                });
            },
        });
    };
    return (
        <div>
            <Spin spinning={loading}>
                <SearchCom
                    getList={getList}
                    number={number}
                    changeFormInfo={changeFormInfo}
                    onExport={onExport}
                    onBatchHandle={onBatchHandle}
                    onCancelVeri={onCancelVeri}
                />
                <VTable
                    ref={vTableRef}
                    headId={'businessCardCheckedAfter_head_id'}
                    onCheckboxStateChange={onCheckboxStateChange}
                    columns={columns}
                    frozenColCount={2}
                />
            </Spin>
        </div>
    );
};

export default connect(({ businessCardCheckedAfter }) => ({ businessCardCheckedAfter }))(Index);
