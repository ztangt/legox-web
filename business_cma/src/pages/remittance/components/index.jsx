import calcFn from '@/util/calc';
import { message, Modal, Spin } from 'antd';
import { connect } from 'dva';
import qs from 'qs';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import VTable from '../../../components/vTable/index';
import { getColumnsList } from './config';
import HandleModal from './handleModal';
import SearchCom from './searchCom';

const Index = ({ dispatch, remittance }) => {
    const { loading } = remittance;
    const [columns, setColumns] = useState([]);
    const vTableRef = useRef(null);
    const checkStates = useRef([]);
    const [number, setNumber] = useState({ length: 0, amount: 0 });
    const [sortInfo, setSortInfo] = useState({});
    const list = useRef([]);

    const { location } = useModel('@@qiankunStateFromMaster');
    const urlParams = qs.parse(location.query?.url.split('?')[1]);
    const [text, setText] = useState('');

    useEffect(() => {
        // urlParams.searchType = 1; 国家局 报账卡号(默认)
        // urlParams.searchType =2 ; 省局 预算指标
        let resText = urlParams.searchType == '2' ? '预算指标' : '报账卡号';
        setText(resText);
        dispatch({ type: 'remittance/findLoginUserByIdAndRoleId' }); //获取管理单位
        setColumns(getColumnsList(remittance, resText));
        getList();
    }, []);

    const formInfo = useRef({ payState: 0 });
    const changeFormInfo = (values) => {
        formInfo.current = values;
    };

    const getList = (newSortInfo = {}) => {
        // @ApiImplicitParam(name = "sortCode", value = "排序字段"),
        // @ApiImplicitParam(name = "sortOrder", value = "排序"),降序desc升序asc
        let sortPost =
            newSortInfo.order == 'desc' || newSortInfo.order == 'asc'
                ? {
                      sortCode: newSortInfo.field,
                      sortOrder: newSortInfo.order,
                  }
                : {};

        dispatch({ type: 'remittance/updateStates', payload: { loading: true } });
        dispatch({
            type: 'remittance/getList',
            payload: { ...formInfo.current, ...sortPost },
            callback: (newList) => {
                list.current = newList;
                vTableRef.current.setRecords(newList, { sortState: null });
                let jumpRow = newSortInfo.order ? { row: 1 } : { col: 2, row: 1 };
                vTableRef.current.scrollToCell(jumpRow);
                vTableRef.current.clearSelected();
                checkStates.current = [];
                setNumber({ length: 0, amount: 0 });
                setSortInfo(newSortInfo);
            },
        });
    };

    //操作
    const onClickCell = (args) => {
        let { originData, target } = args;
        if (target.id == 'handle') {
            if (originData.payState == 0) {
                dispatch({
                    type: 'remittance/getState',
                    callback: ({ businessDate, bankKeyInfo }) => {
                        //办理
                        if (!businessDate) {
                            return message.error('请选择业务日期');
                        }
                        let tenantMark = localStorage.getItem('tenantMark');
                        let isProvincial = !!(tenantMark && tenantMark != '860396'); //只要不是860396的租户，就是省局，省局的办理要必填银行账户
                        if (isProvincial && !bankKeyInfo) {
                            return message.error('请选择银行账户');
                        }
                        return openModal(originData, isProvincial);
                    },
                });
            }
            if (originData.payState == 1) {
                //收回
                return retrieve(originData);
            }
        }
    };

    //当前选中的数据
    const [chooseInfo, setChooseInfo] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [contentInfo, setContentInfo] = useState({});
    // 详情弹窗
    const openModal = (record, isProvincial) => {
        dispatch({
            type: 'remittance/getModalInfo',
            payload: { cashierInfoId: record.cashierInfoId },
            callback: (data) => {
                setModalVisible(true);
                setChooseInfo({ ...record, isProvincial });
                setContentInfo(data);
            },
        });
    };
    //定义方法
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
                    type: 'remittance/updateStates',
                    payload: { loading: true },
                });
                dispatch({
                    type: 'remittance/processRecall',
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

    //选择
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

    //排序
    const onSortClick = (args) => {
        let { field, order } = args;
        let newOrder = order == 'normal' ? 'desc' : order == 'desc' ? 'asc' : 'normal';
        getList({ field, order: newOrder });
        return false;
    };
    return (
        <div id={'remittance_id'}>
            <Spin spinning={loading}>
                <SearchCom
                    getList={getList}
                    number={number}
                    changeFormInfo={changeFormInfo}
                    getChecked={getChecked}
                    text={text}
                />
                <VTable
                    ref={vTableRef}
                    headId={'remittance_head_id'}
                    onCheckboxStateChange={onCheckboxStateChange}
                    columns={columns}
                    frozenColCount={2}
                    rightFrozenColCount={1}
                    onClickCell={onClickCell}
                    sortState={sortInfo}
                    onSortClick={onSortClick}
                />
                {modalVisible && (
                    <HandleModal
                        chooseInfo={chooseInfo}
                        contentInfo={contentInfo}
                        changeVisible={setModalVisible}
                        getList={getList}
                        text={text}
                    />
                )}
            </Spin>
        </div>
    );
};

export default connect(({ remittance }) => ({ remittance }))(Index);
