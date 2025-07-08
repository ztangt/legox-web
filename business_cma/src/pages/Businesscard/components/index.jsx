import VTable from '@/components/vTable';
import calcFn from '@/util/calc';
import { Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useRef, useState } from 'react';
import IPagination from '../../../components/iPagination/iPagination';
import { getColumnsList } from './config';
import SearchCom from './searchCom';

const Index = ({ dispatch, businessCard }) => {
    const { currentPage, returnCount, loading, limit } = businessCard;
    const [columns, setColumns] = useState([]);
    const vTableRef = useRef(null);
    const checkStates = useRef([]);
    const [number, setNumber] = useState({ length: 0, amount: 0 });
    const list = useRef([]);
    const [sortInfo, setSortInfo] = useState({});

    //初始化columns
    useEffect(() => {
        setColumns(getColumnsList());
        dispatch({ type: 'businessCard/findLoginUserByIdAndRoleId' }); //获取管理单位
    }, []);

    const getLimit = (newLimit) => {
        //更新limit
        dispatch({
            type: 'businessCard/updateStates',
            payload: { limit: newLimit },
        });
        getList(1, newLimit);
    };

    //保存查询条件
    const formInfo = useRef({});
    const changeFormInfo = (values) => {
        formInfo.current = values;
    };

    const getList = (newStart, newLimit, newSortInfo = {}) => {
        // @ApiImplicitParam(name = "sortCode", value = "排序字段"),
        // @ApiImplicitParam(name = "sortOrder", value = "排序"),降序desc升序asc
        let sortPost =
            newSortInfo.order == 'desc' || newSortInfo.order == 'asc'
                ? {
                      sortCode: newSortInfo.field,
                      sortOrder: newSortInfo.order,
                  }
                : {};

        dispatch({ type: 'businessCard/updateStates', payload: { loading: true } });
        dispatch({
            type: 'businessCard/getList',
            payload: { ...formInfo.current, ...sortPost, start: newStart, limit: newLimit },
            callback: (newList) => {
                list.current = newList;
                vTableRef.current.setRecords(newList, { sortState: newSortInfo || null });

                let jumpRow = newSortInfo.order ? { row: 1 } : { col: 2, row: 1 };
                console.log(jumpRow, '----->jumpRow');
                vTableRef.current.scrollToCell(jumpRow); //表格跳转到第一行
                vTableRef.current.clearSelected();
                checkStates.current = [];
                setNumber({ length: 0, amount: 0 });
                setSortInfo(newSortInfo);
            },
        });
    };

    //切换分页
    const changePage = (nextPage, size) => {
        dispatch({ type: 'businessCard/updateStates', payload: { limit: size } });
        getList(nextPage, size, sortInfo);
    };

    //排序
    const onSortClick = (args) => {
        let { field, order } = args;
        let newOrder = order == 'normal' ? 'desc' : order == 'desc' ? 'asc' : 'normal';
        dispatch({
            type: 'businessCard/getState',
            callback: ({ currentPage, limit }) => {
                getList(currentPage, limit, { field, order: newOrder });
            },
        });
        return false;
    };
    //获取全部
    const onGetAll = () => {
        getList(1, returnCount, sortInfo);
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
            <div>
                <SearchCom getList={getList} getChecked={getChecked} number={number} changeFormInfo={changeFormInfo} />
                <VTable
                    ref={vTableRef}
                    headId={'businessCard_head_id'}
                    columns={columns}
                    onCheckboxStateChange={onCheckboxStateChange}
                    onSortClick={onSortClick}
                    getLimit={getLimit}
                    frozenColCount={2}
                    sortState={sortInfo}
                />
                <IPagination
                    current={currentPage}
                    total={returnCount}
                    onChange={changePage}
                    pageSize={limit}
                    isRefresh={true}
                    refreshDataFn={() => {
                        getList(currentPage, limit, sortInfo);
                    }}
                    isAll={true}
                    onGetAll={onGetAll}
                />
            </div>
        </Spin>
    );
};

export default connect(({ businessCard }) => ({ businessCard }))(Index);
