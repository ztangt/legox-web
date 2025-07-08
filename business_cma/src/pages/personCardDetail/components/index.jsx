import VTable from '@/components/vTable';
import calcFn from '@/util/calc';
import { Spin } from 'antd';
import { connect } from 'dva';
import qs from 'qs';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { getColumnsList } from './config';
import SearchCom from './searchCom';

const Index = ({ dispatch, personCardDetail }) => {
    const [columns, setColumns] = useState([]);
    const { isInit, loading } = personCardDetail;
    const vTableRef = useRef(null);
    const checkStates = useRef([]);
    const [number, setNumber] = useState({ length: 0, amount: 0 });
    const [sortInfo, setSortInfo] = useState({});

    const list = useRef([]);

    useEffect(() => {
        dispatch({ type: 'personCardDetail/getDictList' }); //获取字典
        dispatch({ type: 'personCardDetail/findLoginUserByIdAndRoleId' }); //获取管理单位
        getList();
    }, []);

    const { location } = useModel('@@qiankunStateFromMaster');
    const urlParams = qs.parse(location.query?.url.split('?')[1]);
    const [text, setText] = useState('');
    useEffect(() => {
        // urlParams.searchType = 1; 国家局 报账卡号(默认)
        // urlParams.searchType =2 ; 省局 预算指标
        let resText = urlParams.searchType == '2' ? '预算指标' : '报账卡号';
        setText(resText);
        isInit && setColumns(getColumnsList(personCardDetail, resText)); //获取表格项目
    }, [isInit]);

    //保存查询条件
    const formInfo = useRef({});
    const changeFormInfo = (values) => {
        formInfo.current = values;
    };

    // 查询列表
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

        dispatch({ type: 'personCardDetail/updateStates', payload: { loading: true } });
        dispatch({
            type: `personCardDetail/getList`,
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
        const { originData, checked, row } = field;

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

    //排序
    const onSortClick = (args) => {
        let { field, order } = args;
        let newOrder = order == 'normal' ? 'desc' : order == 'desc' ? 'asc' : 'normal';
        getList({ field, order: newOrder });
        return false;
    };

    return (
        <div>
            <Spin spinning={loading}>
                <SearchCom
                    formInfo={formInfo.current}
                    getChecked={getChecked}
                    getList={getList}
                    number={number}
                    changeFormInfo={changeFormInfo}
                    text={text}
                />
                <VTable
                    ref={vTableRef}
                    headId={'personCardDetail_list_id'}
                    columns={columns}
                    onCheckboxStateChange={onCheckboxStateChange}
                    onSortClick={onSortClick}
                    frozenColCount={2}
                    sortState={sortInfo}
                />
            </Spin>
        </div>
    );
};

export default connect(({ personCardDetail }) => ({ personCardDetail }))(Index);
