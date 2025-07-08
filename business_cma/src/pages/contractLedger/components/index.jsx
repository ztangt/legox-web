import { message } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import SetCol from '../../../components/setCol';
import styles from '../index.less';
import AnnexModel from './annexModel.jsx';
import { colorList, getColumns, getLabel, onlineType } from './config';
import DetailModel from './detailModel.jsx';
import SearchCom from './searchCom.jsx';

function contractLedger({ dispatch, contractLedger }) {
    let {
        limit,
        list,
        formData,
        currentPage,
        returnCount,
        ids,
        currentHeight,
        detailVisible,
        annexVisible,

        allColumns,
        columns,
        showAdvSearch,
        isInit,
        reList,
        tabNum,
    } = contractLedger;
    const getList = (nextPage) => {
        dispatch({
            type: 'contractLedger/getList',
            payload: { limit, start: nextPage, ...formData },
        });
    };
    useEffect(() => {
        dispatch({ type: 'contractLedger/getOrgList' });
        dispatch({ type: 'contractLedger/getDictList' });
        dispatch({ type: 'contractLedger/getFunCode' });
    }, []);

    //limit发生改变，重新请求数据
    useEffect(() => {
        if (isInit && limit > 0) {
            getList(currentPage);
        }
    }, [limit, isInit]);

    const changePage = (nextPage, size) => {
        //要保存页数组件传回来的size
        if (size !== limit) {
            dispatch({
                type: 'contractLedger/updateStates',
                payload: {
                    limit: size,
                },
            });
        } else {
            getList(nextPage);
        }
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
                type: 'contractLedger/updateStates',
                payload: {
                    ids: selectedRowKeys,
                    selectListInfo: selectedRows,
                },
            });
        },
        selectedRowKeys: ids,
    };
    const getTableInfo = (id, record) => {
        if (onlineType.includes(record.contractCategoryTldt)) {
            return message.error('此合同为线下合同，无详细信息');
        }
        dispatch({
            type: 'contractLedger/getDetailList',
            payload: { contractId: id },
            callback: () => {
                dispatch({
                    type: 'contractLedger/updateStates',
                    payload: {
                        detailVisible: true,
                    },
                });
            },
        });
    };

    //跳转到采购事项申请单
    const goLink = (record) => {
        historyPush({
            pathname: '/onlyFormShow',
            query: {
                bizSolId: record.purchaseRequestSolid,
                bizInfoId: record.purchaseRequestBizid,
                title: '查看',
                id: record.purchaseRequestId,
            },
        });
    };

    //查看附件
    const getAnnexInfo = (id, record) => {
        if (onlineType.includes(record.contractCategoryTldt)) {
            return message.error('此合同为线下合同，无附件信息');
        }
        dispatch({
            type: 'contractLedger/getAnnexList',
            payload: { contractId: id },
            callback: () => {
                dispatch({
                    type: 'contractLedger/updateStates',
                    payload: {
                        annexVisible: true,
                    },
                });
            },
        });
    };

    const [colVisiblePop, setColVisiblePop] = useState(false); //设置列的设置弹框
    let [selectColumnCode, setSelectColumnCode] = useState([]); //选中的列

    //设置初始化的表格列表头
    useEffect(() => {
        let allColumnsList = getColumns(contractLedger, tabNum);
        let columnsList = [...allColumnsList];
        let selectArr = [...allColumnsList].map((item) => item.key);
        if (localStorage.getItem(`ContractLedger_SetCol_${tabNum}`)) {
            selectArr = localStorage.getItem(`ContractLedger_SetCol_${tabNum}`).split(',');
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
            type: 'contractLedger/updateStates',
            payload: {
                allColumns: [...allColumnsList],
                columns: [...columnsList],
            },
        });
    }, [limit, tabNum]);

    const changeColVisiblePop = () => {
        let allColumnsList = getColumns(contractLedger, tabNum);

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
                type: 'contractLedger/updateStates',
                payload: {
                    allColumns: [...newAllColumns],
                },
            });
        }
        setColVisiblePop(!colVisiblePop);
    };

    //保存列设置
    const saveCols = (colSelectKey, colSelect) => {
        dispatch({
            type: 'contractLedger/updateStates',
            payload: {
                columns: [...colSelect],
            },
        });
        setSelectColumnCode(colSelectKey);
        localStorage.setItem(`ContractLedger_SetCol_${tabNum}`, colSelectKey);
        setColVisiblePop(false);
    };

    let operateColumns = [
        {
            title: '合同附件',
            width: 200,
            dataIndex: 'mainTableId',
            render: (id, record) => (
                <span className="primaryColor" onClick={() => getAnnexInfo(id, record)}>
                    查看
                </span>
            ),
        },
        {
            title: (
                <div className="flex flex_justify_between">
                    <div>调整记录</div>
                    <SetCol
                        allCols={allColumns}
                        selectColumnCode={selectColumnCode}
                        changeColVisiblePop={changeColVisiblePop}
                        taskType=""
                        colVisiblePop={colVisiblePop}
                        saveCols={saveCols}
                        id="contractLedger_id"
                    />
                </div>
            ),
            fixed: 'right',
            dataIndex: 'mainTableId',
            width: 200,
            render: (id, record) => (
                <span className="primaryColor" onClick={() => getTableInfo(id, record)}>
                    详情
                </span>
            ),
        },
    ];

    if (tabNum == 1) {
        operateColumns.unshift({
            title: '采购事项申请单',
            dataIndex: 'purchaseRequestName',
            width: 200,
            render: (text, record) => (
                <span className="primaryColor" onClick={() => goLink(record)}>
                    {text || ''}
                </span>
            ),
        });
    }

    columns = [
        {
            title: '序号',
            width: 60,
            render: (text, record, index) => index + 1,
            fixed: 'left',
        },
        {
            title: '预警提醒',
            width: 100,
            dataIndex: 'contractReminderState',
            render: (text, record, index) => (
                <div style={{ backgroundColor: getLabel(colorList, text) }} className={styles.wardRound} />
            ),
            fixed: 'left',
        },
        ...columns,
        ...operateColumns,
    ];

    return (
        <div id="contractLedger_id">
            <SearchCom />
            <ColumnDragTable
                key={showAdvSearch}
                container="contractLedger_id"
                listHead="contractLedger_head"
                taskType="MONITOR"
                tableLayout="fixed"
                modulesName="contractLedger"
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                {...tableProps}
                columns={columns}
                scroll={{ y: list.length > 0 ? currentHeight - 30 : 0 }}
            />
            <div className={styles.warnMessage}>
                <div className={'mr10'}>预警提示</div>
                {colorList.map((item, index) => {
                    return (
                        <div key={index} className="flex flex_align_center mr10">
                            <div style={{ backgroundColor: item.label }} className={styles.numberItem} />
                            <div>{item.dic}</div>
                        </div>
                    );
                })}
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
            {detailVisible && <DetailModel />}
            {annexVisible && <AnnexModel />}
        </div>
    );
}

export default connect(({ contractLedger, loading }) => ({
    contractLedger,
    loading,
}))(contractLedger);
