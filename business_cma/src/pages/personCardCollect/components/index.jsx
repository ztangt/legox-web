import VTable from '@/components/vTable';
import calcFn from '@/util/calc';
import { message, Modal, Spin } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import { useEffect, useRef, useState } from 'react';
import { getColumnsList } from './config.jsx';
import SearchCom from './searchCom';

const Index = ({ dispatch, personCardCollect }) => {
    const { isInit, loading } = personCardCollect;
    const vTableRef = useRef(null);
    const list = useRef([]);
    const checkStates = useRef([]);
    const [number, setNumber] = useState({ length: 0, amount: 0 });
    useEffect(() => {
        dispatch({ type: 'personCardCollect/getDictList' });
        dispatch({ type: 'personCardCollect/findLoginUserByIdAndRoleId' });
        dispatch({
            type: 'personCardCollect/getSummaryNumberList',
            payload: { businessDate: dayjs().format('YYYY-MM-DD') },
        });
        dispatch({ type: 'personCardCollect/getFundSourceList', payload: { businessCardType: 2 } });
        getList();
    }, []);

    //初始化columns
    const [columns, setColumns] = useState([]);
    useEffect(() => {
        isInit && setColumns(getColumnsList(personCardCollect));
    }, [isInit]);

    //保存查询条件
    const formInfo = useRef({ payState: 0, businessDate: dayjs().format('YYYY-MM-DD') });
    const changeFormInfo = (values) => {
        formInfo.current = values;
    };
    const getList = () => {
        dispatch({ type: 'personCardCollect/updateStates', payload: { loading: true } });
        dispatch({
            type: 'personCardCollect/getList',
            payload: { ...formInfo.current },
            callback: (newList) => {
                list.current = newList;
                vTableRef.current.setRecords(newList, { sortState: null });
                vTableRef.current.clearSelected();
                vTableRef.current.scrollToCell({ row: 1, col: 2 });
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

    //定义方法收回
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
                    type: 'personCardCollect/updateStates',
                    payload: { loading: true },
                });
                dispatch({
                    type: 'personCardCollect/processRecall',
                    payload: {
                        cashierInfoId: info.cashierInfoId,
                        deployFormId: info.deployFormId,
                        mainTableId: info.mainTableId,
                    },
                    callback() {
                        message.success('收回成功');
                        getList();
                    },
                });
            },
        });
    };

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
            type: 'personCardCollect/getState',
            callback: ({ businessDate, bankKeyInfo }) => {
                console.log(businessDate, bankKeyInfo, '---->获取的业务日期和银行账户');
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
                    content: `确认办理？`,
                    okText: '确定',
                    mask: false,
                    getContainer: document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false,
                    onOk() {
                        dispatch({
                            type: 'personCardCollect/updateStates',
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
                            type: 'personCardCollect/generate',
                            payload: { ...postData },
                            callback: () => {
                                message.success('正在办理...');
                                getList();
                            },
                        });
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
                    onBatchHandle={onBatchHandle}
                    getChecked={getChecked}
                />
                <VTable
                    ref={vTableRef}
                    headId={'personCardCollect_head_id'}
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

export default connect(({ personCardCollect }) => ({ personCardCollect }))(Index);
