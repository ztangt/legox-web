import { connect } from 'dva';
import { useEffect, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import SetCol from '../../../components/setCol';
import { getColumns, getLabel, openPage } from './config';
import SearchCom from './searchDom.jsx';

function contractUnstamped({ dispatch, contractUnstamped }) {
    let {
        limit,
        list,
        formData,
        currentPage,
        returnCount,
        ids,
        currentHeight,

        allColumns,
        columns,
        checkList,
        isInit,
        start,
        showAdvSearch,
    } = contractUnstamped;

    const getList = (nextPage) => {
        dispatch({
            type: 'contractUnstamped/getList',
            payload: { limit, start: nextPage, ...formData },
        });
    };

    useEffect(() => {
        dispatch({ type: 'contractUnstamped/getDictList' }); //审核状态
    }, []);

    //limit发生改变，重新请求数据
    useEffect(() => {
        if (limit > 0 && isInit) {
            getList(currentPage);
        }
    }, [limit, isInit]);

    const changePage = (nextPage, size) => {
        if (size !== limit) {
            return dispatch({
                type: 'contractUnstamped/updateStates',
                payload: {
                    limit: size,
                },
            });
        }
        getList(nextPage);
    };

    const tableProps = {
        rowKey: 'id',
        dataSource: list,
        pagination: false,
        bordered: true,
        showSorterTooltip: false,
    };

    //选中行
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            dispatch({
                type: 'contractUnstamped/updateStates',
                payload: {
                    ids: selectedRowKeys,
                    selectListInfo: selectedRows,
                },
            });
        },
        selectedRowKeys: ids,
    };

    const [colVisiblePop, setColVisiblePop] = useState(false); //设置列的设置弹框
    let allColumnsList = getColumns(contractUnstamped);
    let [selectColumnCode, setSelectColumnCode] = useState(allColumnsList.map((item) => item.key)); //选中的列

    //设置初始化的表格列表头
    useEffect(() => {
        let columnsList = [...allColumnsList];
        let selectArr = [...allColumnsList].map((item) => item.key);
        if (localStorage.getItem('ContractUnstamped_SetCol')) {
            selectArr = localStorage.getItem('ContractUnstamped_SetCol').split(',');
            //按照选中的顺序排序
            let newColumns = [];
            selectArr.forEach((item) => {
                let columnsItem = columnsList.find((columnsItem) => columnsItem.key == item);
                if (columnsItem) {
                    newColumns.push(columnsItem);
                }
            });
            columnsList = [...newColumns];
        }
        setSelectColumnCode(selectArr);
        dispatch({
            type: 'contractUnstamped/updateStates',
            payload: {
                allColumns: [...allColumnsList],
                columns: [...columnsList],
            },
        });
    }, []);
    const changeColVisiblePop = () => {
        if (!colVisiblePop) {
            let selectKeys = columns.map((item) => item.key);
            //选中的排在最前面
            const newAllColumns = allColumnsList.sort((a, b) => {
                // 检查 a 的 key 是否在 B 中
                const aKeyIndex = selectKeys.indexOf(a.key);
                // 检查 b 的 key 是否在 B 中
                const bKeyIndex = selectKeys.indexOf(b.key);
                // 如果 a 在 B 中，但 b 不在 B 中，则 a 排在前面
                if (aKeyIndex !== -1 && bKeyIndex === -1) {
                    return -1;
                }
                // 如果 a 不在 B 中，但 b 在 B 中，则 b 排在前面
                if (aKeyIndex === -1 && bKeyIndex !== -1) {
                    return 1;
                }
                // 否则，保持原始顺序
                return 0;
            });
            dispatch({
                type: 'contractUnstamped/updateStates',
                payload: {
                    allColumns: [...newAllColumns],
                },
            });
        }
        setColVisiblePop(!colVisiblePop);
    };
    const saveCols = (colSelectKey, colSelect) => {
        dispatch({
            type: 'contractUnstamped/updateStates',
            payload: {
                columns: [...colSelect],
            },
        });
        setSelectColumnCode(colSelectKey);
        localStorage.setItem('ContractUnstamped_SetCol', colSelectKey);
        setColVisiblePop(false);
    };

    columns = [
        {
            title: '序号',
            width: 60,
            render: (text, record, index) => index + 1,
            fixed: 'left',
        },
        {
            title: '合同名称',
            dataIndex: 'contractName',
            width: 200,
            render: (text, record) => (
                <span className="primaryColor" onClick={() => openPage(record)}>
                    {text}
                </span>
            ),
            fixed: 'left',
        },
        ...columns,
        {
            title: '审核状态',
            dataIndex: 'auditStatusTldt',
            width: 200,
            fixed: 'right',
            render: (text) => getLabel(checkList, text),
        },
        {
            title: (
                <div className="flex flex_justify_between">
                    <div>当前审批节点</div>
                    <SetCol
                        allCols={allColumns}
                        selectColumnCode={selectColumnCode}
                        changeColVisiblePop={changeColVisiblePop}
                        taskType=""
                        colVisiblePop={colVisiblePop}
                        saveCols={saveCols}
                        id="contractUnstamped_id"
                    />
                </div>
            ),
            dataIndex: 'actName',
            width: 200,
            fixed: 'right',
        },
    ];

    return (
        <div id="contractUnstamped_id">
            <SearchCom />
            <ColumnDragTable
                key={showAdvSearch}
                container="contractUnstamped_id"
                listHead="contractUnstamped_head"
                taskType="MONITOR"
                tableLayout="fixed"
                modulesName="contractUnstamped"
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                {...tableProps}
                columns={columns}
                scroll={{ y: list.length > 0 ? currentHeight : 0 }}
            />
            <IPagination
                current={currentPage}
                total={returnCount}
                onChange={changePage}
                pageSize={limit}
                isRefresh={true}
                refreshDataFn={() => {
                    getList(currentPage);
                }}
            />
        </div>
    );
}

export default connect(({ contractUnstamped, loading }) => ({
    contractUnstamped,
    loading,
}))(contractUnstamped);
