import VTable from '@/components/vTable';
import { Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useRef, useState } from 'react';
import IPagination from '../../../components/iPagination/iPagination';
import { getVTableColumns } from './config';
import SearchCom from './searchCom';

const Index = ({ dispatch, paymentMethod }) => {
    const { limit, currentPage, returnCount, loading } = paymentMethod;
    const [columns, setColumns] = useState([]);
    const list = useRef([]);
    const checkStates = useRef([]);
    const vTableRef = useRef(null);

    //初始化columns
    useEffect(() => {
        setColumns(getVTableColumns());
        dispatch({ type: 'paymentMethod/findLoginUserByIdAndRoleId' });
    }, []);

    //更新limit
    const getLimit = (newLimit) => {
        dispatch({
            type: 'paymentMethod/updateStates',
            payload: { limit: newLimit },
        });
        getList();
    };
    const getList = () => {
        dispatch({ type: 'paymentMethod/updateStates', payload: { loading: true } });
        dispatch({
            type: 'paymentMethod/getState',
            callback: ({ formInfo, currentPage, limit }) => {
                dispatch({
                    type: 'paymentMethod/getList',
                    payload: { ...formInfo, start: currentPage, limit: limit },
                    callback: (newList) => {
                        list.current = newList;
                        vTableRef.current.setRecords(newList, { sortState: null });
                        vTableRef.current.scrollToCell({ col: 2, row: 1 }); //表格跳转到第一行
                        vTableRef.current.clearSelected();
                        checkStates.current = [];
                    },
                });
            },
        });
    };

    //切换分页
    const changePage = (nextPage, size) => {
        dispatch({ type: 'paymentMethod/updateStates', payload: { limit: size } });
        getList();
    };

    // const onCheckboxStateChange = (field) => {
    //     const {originData, checked, col, row} = field;
    //     // console.log(col, row, '----->col,row')
    //     let newChecked = vTableRef.current.getCheckboxState();
    //
    //     list.current.forEach((item,index)=>{
    //         vTableRef.current.setCellCheckboxState(0, index + 1, item.cashierInfoId == originData.cashierInfoId);
    //     })
    //     // let newChecked = vTableRef.current.getCheckboxState();
    //     console.log(newChecked,'--->最后的newChecked')
    //     checkStates.current = newChecked;
    // };

    //获取选中的行和ID
    const getChecked = () => {
        let rows = [];
        let rowKeys = [];
        const checkedState = vTableRef.current.getRadioState();
        console.log(checkedState, '----->checkedState');

        if (checkedState.isChecked || checkedState.isChecked == 0) {
            console.log(checkedState.isChecked, 'checkedState.isChecked');
            let checkInfo = list.current[checkedState.isChecked];
            rows = [checkInfo];
            rowKeys = [checkInfo.cashierInfoId];
        }
        return { rowKeys, rows };
    };

    return (
        <Spin spinning={loading}>
            <SearchCom getList={getList} getChecked={getChecked} />
            <VTable
                ref={vTableRef}
                headId={'paymentMethod_head_id'}
                columns={columns}
                getLimit={getLimit}
                frozenColCount={2}
            />
            <IPagination
                current={currentPage}
                total={returnCount}
                onChange={changePage}
                pageSize={limit}
                isRefresh={true}
                refreshDataFn={getList}
            />
        </Spin>
    );
};

export default connect(({ paymentMethod, layoutG }) => ({
    paymentMethod,
    layoutG,
}))(Index);
