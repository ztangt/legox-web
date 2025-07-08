import VTable from '@/components/vTable';
import calcFn from '@/util/calc';
import { message, Modal, Spin } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import qs from 'qs';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { getColumnsList } from './config.jsx';
import SearchCom from './searchCom';

const Index = ({ dispatch, collectionSettlement }) => {
    const { loading, textDate } = collectionSettlement;
    const [columns, setColumns] = useState([]);
    const vTableRef = useRef(null);
    const checkStates = useRef([]);
    const [number, setNumber] = useState({ length: 0, amount: 0 });
    const list = useRef([]);

    //保存查询条件
    const formInfo = useRef({ payState: 0, orgAccountCode: '' });
    const changeFormInfo = (values) => {
        formInfo.current = values;
    };

    const { location } = useModel('@@qiankunStateFromMaster');
    const urlParams = qs.parse(location.query?.url.split('?')[1]);
    const [text, setText] = useState('');

    useEffect(() => {
        // urlParams.searchType = 1; 国家局 报账卡号(默认)
        // urlParams.searchType =2 ; 省局 预算指标
        let resText = urlParams.searchType == '2' ? '预算指标' : '报账卡号';
        setText(resText);
        dispatch({ type: 'collectionSettlement/findLoginUserByIdAndRoleId' }); //获取管理单位
        setColumns(getColumnsList(collectionSettlement, resText));
        getList();
    }, []);

    const getList = () => {
        dispatch({
            type: 'collectionSettlement/updateStates',
            payload: { loading: true },
        });
        dispatch({
            type: 'collectionSettlement/getList',
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

    // 收回
    const retrieve = (info) => {
        Modal.confirm({
            title: '提示',
            content: `确定是否回收`,
            okText: '确定',
            getContainer: () => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            },
            maskClosable: false,
            mask: false,
            onOk() {
                dispatch({
                    type: 'collectionSettlement/processRecall',
                    payload: {
                        cashierInfoId: info.cashierInfoId,
                        deployFormId: info.deployFormId,
                        mainTableId: info.mainTableId,
                    },
                    callback() {
                        message.success('回收成功');
                        getList();
                    },
                });
            },
        });
    };

    const onBatchHandle = (record) => {
        let selectedRowKeys = record && record.cashierInfoId ? [record.cashierInfoId] : getChecked().rowKeys;
        let selectedRows = record && record.cashierInfoId ? [record] : getChecked().rows;

        dispatch({
            type: 'collectionSettlement/getState',
            callback: ({ businessDate, bankKeyInfo }) => {
                console.log(businessDate, bankKeyInfo, '是否是最新值');
                if (!selectedRowKeys.length) {
                    return message.error('请选择操作项');
                }
                if (selectedRows.find((item) => item.payState == 1)) {
                    return message.error('请选择待办理项');
                }
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
                    content: `确认要办理？`,
                    okText: '确定',
                    getContainer: () => {
                        return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                    },
                    maskClosable: false,
                    mask: false,
                    onOk() {
                        let postData = {
                            cashierInfoId: selectedRowKeys.join(','),
                            businessDate: dayjs(businessDate).unix(),
                        };
                        if (isProvincial) {
                            postData.bankKeyInfo = bankKeyInfo.BANK_ACCOUNT_PRIMARY_KEY;
                        }
                        console.log('办理最后传的参数2222', postData, businessDate);
                        dispatch({
                            type: 'collectionSettlement/generateAction',
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

    const onCheckboxStateChange = (field) => {
        const { originData, checked, col, row } = field;
        let newChecked = vTableRef.current.getCheckboxState();
        //单选
        if (row != 0) {
            //相同单据编号的选中是一起的，但是反选是单个的
            if (checked) {
                list.current.forEach((item, index) => {
                    if (item.voucherNumber == originData.voucherNumber) {
                        newChecked[index].isChecked = checked;
                        vTableRef.current.setCellCheckboxState(0, index + 1, checked);
                    }
                });
            }
        }
        checkStates.current = newChecked;
        // 计算选中的行数和金额
        let length = 0;
        let amount = 0;
        newChecked.forEach((item, index) => {
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

    return (
        <Spin spinning={loading}>
            <SearchCom
                getList={getList}
                number={number}
                changeFormInfo={changeFormInfo}
                getChecked={getChecked}
                onBatchHandle={onBatchHandle}
                text={text}
            />
            <VTable
                ref={vTableRef}
                headId={'collectionSettlement_head_id'}
                columns={columns}
                frozenColCount={2}
                rightFrozenColCount={1}
                onClickCell={onClickCell}
                onCheckboxStateChange={onCheckboxStateChange}
            />
        </Spin>
    );
};

export default connect(({ collectionSettlement }) => ({
    collectionSettlement,
}))(Index);
