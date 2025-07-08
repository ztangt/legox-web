import calcFn from '@/util/calc';
import { message, Modal, Spin } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import { useEffect, useRef, useState } from 'react';
import VTable from '../../../components/vTable/index';
import { getColumnsList } from './config.jsx';
import SearchCom from './searchCom';

const Index = ({ dispatch, businessCardSummary }) => {
    const { loading, isInit } = businessCardSummary;
    const vTableRef = useRef(null);
    const list = useRef([]);
    const checkStates = useRef([]);

    //初始化表头
    const [columns, setColumns] = useState([]);
    useEffect(() => {
        dispatch({ type: 'businessCardSummary/getDictList' }); //枚举账户性质
        dispatch({
            type: 'businessCardSummary/getSummaryNumberList', //管理单位列表
            payload: { businessDate: dayjs().format('YYYY-MM-DD') },
        });
        dispatch({ type: 'businessCardSummary/findLoginUserByIdAndRoleId' }); //获取当前登录用户信息
        dispatch({ type: 'businessCardSummary/getFundSourceList', payload: { businessCardType: 1 } }); //资金来源
        getList();
    }, []);

    useEffect(() => {
        isInit && setColumns(getColumnsList(businessCardSummary));
    }, [isInit]);

    //保存查询条件
    const formInfo = useRef({ payState: 0, startDate: dayjs().format('YYYY-MM-DD') });
    const changeFormInfo = (values) => {
        formInfo.current = values;
    };
    const [number, setNumber] = useState({ length: 0, amount: 0 });
    const getList = () => {
        dispatch({ type: 'businessCardSummary/updateStates', payload: { loading: true } });
        dispatch({
            type: 'businessCardSummary/getList',
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

    //选择
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

    // 导出
    const onExport = (values) => {
        const { rowKeys: selectedRowKeys } = getChecked();
        dispatch({ type: 'businessCardSummary/updateStates', payload: { loading: true } });
        dispatch({
            type: 'businessCardSummary/onExport',
            payload: {
                ...values,
                cashierInfoIds: selectedRowKeys.join(','),
                quryType: 1,
                fileName: '公务卡汇总导出',
                fileType: 'excel',
                exportType: selectedRowKeys.length ? 0 : 1,
            },
            callback: function (path) {
                if (!path) {
                    return;
                }
                // 这里的文件名根据实际情况从响应头或者url里获取
                const a = document.createElement('a');
                a.href = path;
                a.click();
                message.success('导出成功');
            },
        });
    };

    // 取消汇总
    const onUnSummary = () => {
        const { rowKeys: selectedRowKeys } = getChecked();
        if (!selectedRowKeys.length) {
            return message.error('请选择操作项');
        }
        Modal.confirm({
            title: '提示',
            content: `确定进行取消汇总？`,
            okText: '确定',
            maskClosable: false,
            mask: false,
            getContainer: document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false,
            onOk() {
                dispatch({
                    type: 'businessCardSummary/updateStates',
                    payload: { loading: true },
                });
                dispatch({
                    type: 'businessCardSummary/batchCheck',
                    payload: {
                        cashierInfoId: selectedRowKeys.join(','),
                        type: 0,
                    },
                    callback() {
                        message.success('取消汇总成功');
                        getList();
                    },
                });
            },
        });
    };

    // 出纳办理
    const onBatchHandle = (record) => {
        let selectedRowKeys = record && record.cashierInfoId ? [record.cashierInfoId] : getChecked().rowKeys;
        let selectedRows = record && record.cashierInfoId ? [record] : getChecked().rows;

        if (!selectedRowKeys.length) {
            return message.error('请选择操作项');
        }

        if (selectedRows.find((item) => item.payState == 1)) {
            return message.error('请选择待办数据');
        }

        dispatch({
            type: 'businessCardSummary/getState',
            callback: ({ businessDate, bankKeyInfo }) => {
                if (!businessDate) {
                    return message.error('请选择业务日期');
                }
                let tenantMark = localStorage.getItem('tenantMark');
                let isProvincial = !!(tenantMark && tenantMark != '860396'); //只要不是860396的租户，就是省局，省局的办理要必填银行账户

                if (isProvincial && !bankKeyInfo) {
                    return message.error('请选择银行账户');
                }

                Modal.confirm({
                    title: '提示',
                    content: `确定进行出纳办理？`,
                    okText: '确定',
                    maskClosable: false,
                    mask: false,
                    getContainer: document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false,
                    onOk() {
                        dispatch({
                            type: 'businessCardSummary/updateStates',
                            payload: { loading: true },
                        });
                        let postData = {
                            cashierInfoId: selectedRowKeys.join(','),
                            businessDate: dayjs(businessDate).unix(),
                        };
                        //如果省局的租户，就要传银行账户
                        if (isProvincial) {
                            postData.bankKey = bankKeyInfo.BANK_ACCOUNT_PRIMARY_KEY;
                        }
                        console.log(businessDate, postData, '---->办理的参数');
                        dispatch({
                            type: 'businessCardSummary/generate',
                            payload: { ...postData },
                            callback() {
                                message.success('正在办理...');
                                getList();
                            },
                        });
                    },
                });
            },
        });
    };
    //收回
    const retrieve = (info) => {
        Modal.confirm({
            title: '提示',
            content: `确定是否收回`,
            okText: '确定',
            maskClosable: false,
            mask: false,
            getContainer: document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false,
            onOk() {
                dispatch({
                    type: 'businessCardSummary/updateStates',
                    payload: { loading: true },
                });
                dispatch({
                    type: 'businessCardSummary/processRecall',
                    payload: {
                        cashierInfoId: info.cashierInfoId,
                        deployFormId: info.deployFormId,
                        mainTableId: info.mainTableId,
                    },
                    callback: () => {
                        message.success('收回成功');
                        getList();
                    },
                });
            },
        });
    };

    //点击单元格
    const onClickCell = (args) => {
        let { originData, target } = args;
        //点击办理或者收回
        if (target.id == 'handle') {
            if (originData.payState == 0) {
                return onBatchHandle(originData);
            }
            if (originData.payState == 1) {
                return retrieve(originData);
            }
        }
    };

    return (
        <div>
            <Spin spinning={loading}>
                <SearchCom
                    getList={getList}
                    number={number}
                    changeFormInfo={changeFormInfo}
                    onExport={onExport}
                    onUnSummary={onUnSummary}
                    onBatchHandle={onBatchHandle}
                />
                <VTable
                    ref={vTableRef}
                    headId={'businessCardSummary_head_id'}
                    onCheckboxStateChange={onCheckboxStateChange}
                    columns={columns}
                    frozenColCount={2}
                    rightFrozenColCount={1}
                    onClickCell={onClickCell}
                />
            </Spin>
        </div>
    );
};

export default connect(({ businessCardSummary }) => ({
    businessCardSummary,
}))(Index);
