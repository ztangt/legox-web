import { connect } from 'dva';
import { useEffect, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import SetCol from '../../../components/setCol';
import styles from '../index.less';
import AnnexModel from './annexModel';
import { getColumns } from './config';
import SearchCom from './searchCom.jsx';

function contractArchives({ dispatch, contractArchives }) {
    let {
        limit,
        list,
        formData,
        currentPage,
        returnCount,
        ids,
        currentHeight,
        annexVisible,
        allColumns,
        columns,
        isInit,
        showAdvSearch,
    } = contractArchives;

    const getList = (nextPage) => {
        dispatch({
            type: 'contractArchives/getList',
            payload: {
                limit,
                start: nextPage,
                ...formData,
                isOfflineContract: 0, //添加参数：线上合同
            },
        });
    };
    //limit发生改变，重新请求数据
    useEffect(() => {
        if (isInit && limit > 0) {
            getList(currentPage);
        }
    }, [limit, isInit]);

    useEffect(() => {
        dispatch({ type: 'contractArchives/getDictList' }); //收支合同类型
    }, []);

    const changePage = (nextPage, size) => {
        if (size != limit) {
            return dispatch({
                type: 'contractArchives/updateStates',
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
                type: 'contractArchives/updateStates',
                payload: {
                    ids: selectedRowKeys,
                    selectListInfo: selectedRows,
                },
            });
        },
        selectedRowKeys: ids,
    };

    //查看附件
    const getAnnexInfo = (id) => {
        dispatch({
            type: 'contractArchives/updateStates',
            payload: { contractId: id },
        });
        dispatch({
            type: 'contractArchives/getAnnexList',
            payload: { contractId: id },
            callback: () => {
                dispatch({
                    type: 'contractArchives/updateStates',
                    payload: {
                        annexVisible: true,
                    },
                });
            },
        });
    };

    const [colVisiblePop, setColVisiblePop] = useState(false); //设置列的设置弹框
    let allColumnsList = getColumns(contractArchives);
    let [selectColumnCode, setSelectColumnCode] = useState(allColumnsList.map((item) => item.key)); //选中的列

    //设置初始化的表格列表头
    useEffect(() => {
        let columnsList = [...allColumnsList];
        let selectArr = [...allColumnsList].map((item) => item.key);
        if (localStorage.getItem('ContractArchives_SetCol')) {
            selectArr = localStorage.getItem('ContractArchives_SetCol').split(',');
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
            type: 'contractArchives/updateStates',
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
                type: 'contractArchives/updateStates',
                payload: {
                    allColumns: [...newAllColumns],
                },
            });
        }
        setColVisiblePop(!colVisiblePop);
    };
    const saveCols = (colSelectKey, colSelect) => {
        dispatch({
            type: 'contractArchives/updateStates',
            payload: {
                columns: [...colSelect],
            },
        });
        setSelectColumnCode(colSelectKey);
        localStorage.setItem('ContractArchives_SetCol', colSelectKey);
        setColVisiblePop(false);
    };

    columns = [
        {
            title: '序号',
            width: 60,
            render: (text, record, index) => index + 1,
            fixed: 'left',
        },
        ...columns,
        {
            fixed: 'right',
            title: (
                <div className="flex flex_justify_between">
                    <div>文档附件</div>
                    <SetCol
                        allCols={allColumns}
                        selectColumnCode={selectColumnCode}
                        changeColVisiblePop={changeColVisiblePop}
                        taskType=""
                        colVisiblePop={colVisiblePop}
                        saveCols={saveCols}
                        id="contractArchives_id"
                    />
                </div>
            ),
            dataIndex: 'mainTableId',
            width: 200,
            render: (mainTableId) => (
                <span className="primaryColor" onClick={() => getAnnexInfo(mainTableId)}>
                    查看
                </span>
            ),
        },
    ];

    return (
        <div className={styles.warp} id="contractArchives_id">
            <SearchCom />
            <div>
                <ColumnDragTable
                    key={showAdvSearch}
                    container="contractArchives_id"
                    listHead="contractArchives_head"
                    taskType="MONITOR"
                    tableLayout="fixed"
                    modulesName="contractArchives"
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    {...tableProps}
                    columns={columns}
                    scroll={{ y: list.length > 0 ? currentHeight : 0 }}
                ></ColumnDragTable>
            </div>

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
            {annexVisible && <AnnexModel />}
        </div>
    );
}

export default connect(({ contractArchives, loading }) => ({
    contractArchives,
    loading,
}))(contractArchives);
