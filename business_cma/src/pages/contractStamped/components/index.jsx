import { getMaxDataRuleCode } from '@/util/util';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import SetCol from '../../../components/setCol';
import styles from '../index.less';
import AnnexModel from './annexModel';
import { colorList, getColumns, openPage } from './config';
import DetailModel from './detailModel.jsx';
import SearchCom from './searchCom.jsx';

function contractStamped({ dispatch, contractStamped }) {
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
        numberInfo,
        start,
        showAdvSearch,
        isInit,
        selectListInfo,
    } = contractStamped;

    useEffect(() => {
        dispatch({ type: 'contractStamped/getDictList' });
    }, []);

    //limit改变时重新调用接口
    useEffect(() => {
        if (limit > 0 && isInit) {
            getList(currentPage);
        }
    }, [limit, isInit]);

    const getList = (nextPage) => {
        dispatch({
            type: 'contractStamped/getList',
            payload: { limit, start: nextPage, ...formData },
        });
    };

    const changePage = (nextPage, size) => {
        if (size != limit) {
            dispatch({
                type: 'contractStamped/updateStates',
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
                type: 'contractStamped/updateStates',
                payload: {
                    ids: selectedRowKeys,
                    selectListInfo: selectedRows,
                },
            });
        },
        selectedRowKeys: ids,
    };

    //获取详情
    const getTableInfo = (id) => {
        dispatch({
            type: 'contractStamped/getDetailList',
            payload: { contractId: id },
            callback: () => {
                dispatch({
                    type: 'contractStamped/updateStates',
                    payload: {
                        detailVisible: true,
                    },
                });
            },
        });
    };
    //查看附件
    const getAnnexInfo = (id) => {
        dispatch({
            type: 'contractStamped/getAnnexList',
            payload: { contractId: id },
            callback: () => {
                dispatch({
                    type: 'contractStamped/updateStates',
                    payload: {
                        annexVisible: true,
                    },
                });
            },
        });
    };

    const [colVisiblePop, setColVisiblePop] = useState(false); //设置列的设置弹框
    let allColumnsList = getColumns(contractStamped);
    let [selectColumnCode, setSelectColumnCode] = useState(allColumnsList.map((item) => item.key)); //选中的列

    //设置初始化的表格列表头
    useEffect(() => {
        let columnsList = [...allColumnsList];
        let selectArr = [...allColumnsList].map((item) => item.key);
        if (localStorage.getItem('ContractStamped_SetCol')) {
            selectArr = localStorage.getItem('ContractStamped_SetCol').split(',');
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
            type: 'contractStamped/updateStates',
            payload: {
                allColumns: [...allColumnsList],
                columns: [...columnsList],
            },
        });

        const maxDataruleCode = getMaxDataRuleCode();
        dispatch({
            type: 'contractStamped/getCamsContractNum',
            payload: { maxDataruleCode },
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
                type: 'contractStamped/updateStates',
                payload: {
                    allColumns: [...newAllColumns],
                },
            });
        }
        setColVisiblePop(!colVisiblePop);
    };
    const saveCols = (colSelectKey, colSelect) => {
        dispatch({
            type: 'contractStamped/updateStates',
            payload: {
                columns: [...colSelect],
            },
        });
        setSelectColumnCode(colSelectKey);
        localStorage.setItem('ContractStamped_SetCol', colSelectKey);
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
            title: '预警',
            width: 60,
            dataIndex: 'untilContractExpirationDay',
            render: (text, record) => {
                //1是已验收,2是未验收,3是逾期未验收
                let acceptanceStatusTldt = record.acceptanceStatusTldt;
                if (acceptanceStatusTldt == '2' && text) {
                    // 未验收的合同到期时间少于30天，未即将逾期,显示黄色
                    let str = text.slice(0, text.length - 1);
                    if (str > 0 && str <= 30) {
                        acceptanceStatusTldt = '4';
                    }
                }
                let colorTxt = colorList.find((item) => item.value == acceptanceStatusTldt)?.color;
                return <span className={styles.warnColor} style={{ backgroundColor: colorTxt }} />;
            },
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
            title: '当前审批节点',
            dataIndex: 'actName',
            width: 200,
            fixed: 'right',
        },
        {
            title: (
                <div className="flex flex_justify_between">
                    <div>操作</div>
                    <SetCol
                        allCols={allColumns}
                        selectColumnCode={selectColumnCode}
                        changeColVisiblePop={changeColVisiblePop}
                        taskType=""
                        colVisiblePop={colVisiblePop}
                        saveCols={saveCols}
                        id="contractStamped_id"
                    />
                </div>
            ),
            dataIndex: 'mainTableId',
            width: 200,
            render: (id) => (
                <div>
                    <span className="primaryColor mr10" onClick={() => getTableInfo(id)}>
                        调整记录
                    </span>
                    <span className="primaryColor" onClick={() => getAnnexInfo(id)}>
                        合同附件
                    </span>
                </div>
            ),
            fixed: 'right',
        },
    ];

    const getRowClassName = (record, index) => {
        //合同到期天数小于等于0的行标红
        let className = index % 2 === 0 ? 'oddRow' : 'evenRow';
        if (record.untilContractExpirationDay) {
            let text = record.untilContractExpirationDay.slice(0, record.untilContractExpirationDay.length - 1);
            if (text <= 0) {
                className = 'redRow';
            }
        }
        return className;
    };

    return (
        <div id="contractStamped_id">
            <SearchCom />
            <ColumnDragTable
                key={showAdvSearch}
                container="contractStamped_id"
                listHead="contractStamped_head"
                taskType="MONITOR"
                tableLayout="fixed"
                modulesName="contractStamped"
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
                        <div key={index} className="flex flex_align_center mr5">
                            <div style={{ backgroundColor: item.color }} className={styles.numberItem}>
                                {numberInfo[item.keyName]
                                    ? numberInfo[item.keyName] > 999
                                        ? '999+'
                                        : numberInfo[item.keyName]
                                    : 0}
                            </div>
                            <div>{item.label}</div>
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

export default connect(({ contractStamped, loading }) => ({
    contractStamped,
    loading,
}))(contractStamped);
