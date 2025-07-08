import { connect } from 'dva';
import { useEffect, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable/index.jsx';
import IPagination from '../../../components/iPagination/iPagination.jsx';
import SetCol from '../../../components/setCol/index.jsx';
import styles from '../index.less';
import AnnexModel from './annexModel.jsx';
import { getColumns } from './config';
import SearchCom from './searchCom.jsx';

function BuyArchives({ dispatch, buyArchives }) {
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
        showAdvSearch,
    } = buyArchives;

    const getList = (nextPage) => {
        if (limit > 0) {
            dispatch({
                type: 'buyArchives/getList',
                payload: { limit, start: nextPage, ...formData },
            });
        }
    };

    useEffect(() => {
        if (limit > 0) {
            getList(currentPage);
        }
    }, [limit]);

    const changePage = (nextPage, size) => {
        if (size != limit) {
            return dispatch({
                type: 'buyArchives/updateStates',
                payload: {
                    limit: size,
                },
            });
        }
        getList(nextPage);
    };
    //查看附件
    const [mainTableId, setMainTableId] = useState('');
    const [bizInfoId, setBizInfoId] = useState('');
    const getAnnexInfo = (id, newMainTableId, newBizInfoId) => {
        setMainTableId(newMainTableId);
        setBizInfoId(newBizInfoId);
        dispatch({
            type: 'buyArchives/updateStates',
            payload: { contractId: id },
        });
        dispatch({
            type: 'buyArchives/getAnnexList',
            payload: { purchasePlanId: id },
            callback: () => {
                dispatch({
                    type: 'buyArchives/updateStates',
                    payload: {
                        annexVisible: true,
                    },
                });
            },
        });
    };

    const [colVisiblePop, setColVisiblePop] = useState(false); //设置列的设置弹框
    let allColumnsList = getColumns(buyArchives);
    let [selectColumnCode, setSelectColumnCode] = useState(allColumnsList.map((item) => item.key)); //选中的列

    //设置初始化的表格列表头
    useEffect(() => {
        let columnsList = [...allColumnsList];
        let selectArr = [...allColumnsList].map((item) => item.key);
        if (localStorage.getItem('BuyArchives_SetCol')) {
            selectArr = localStorage.getItem('BuyArchives_SetCol').split(',');
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
            type: 'buyArchives/updateStates',
            payload: {
                allColumns: [...allColumnsList],
                columns: [...columnsList],
            },
        });
        getList(1);
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
                type: 'buyArchives/updateStates',
                payload: {
                    allColumns: [...newAllColumns],
                },
            });
        }
        setColVisiblePop(!colVisiblePop);
    };
    const saveCols = (colSelectKey, colSelect) => {
        dispatch({
            type: 'buyArchives/updateStates',
            payload: {
                columns: [...colSelect],
            },
        });
        setSelectColumnCode(colSelectKey);
        localStorage.setItem('BuyArchives_SetCol', colSelectKey);
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
                    <div>操作</div>
                    <SetCol
                        allCols={allColumns}
                        selectColumnCode={selectColumnCode}
                        changeColVisiblePop={changeColVisiblePop}
                        taskType=""
                        colVisiblePop={colVisiblePop}
                        saveCols={saveCols}
                        id="buyArchives_id"
                    />
                </div>
            ),
            dataIndex: 'purchasePlanId',
            width: 200,
            render: (text, record) => {
                let {
                    purchasePlanId,
                    purchaseRequestMianId,
                    purchaseProjectMainId,
                    purchaseRequestBizId,
                    purchaseProjectBizId,
                } = record;
                //purchaseRequestMianId有值的话取purchaseRequestMianId，没有的话取purchaseProjectMainId
                let mainTableId = purchaseRequestMianId
                    ? purchaseRequestMianId
                    : purchaseProjectMainId
                    ? purchaseProjectMainId
                    : '';
                //bizInfoId  purchaseRequestBizId有值的话取purchaseRequestBizId，没有的话取purchaseProjectBizId
                let bizInfoId = purchaseRequestBizId
                    ? purchaseRequestBizId
                    : purchaseProjectBizId
                    ? purchaseProjectBizId
                    : '0';
                return (
                    <span className="primaryColor" onClick={() => getAnnexInfo(purchasePlanId, mainTableId, bizInfoId)}>
                        {' '}
                        查看{' '}
                    </span>
                );
            },
        },
    ];

    const tableProps = {
        container: 'buyArchives_id',
        listHead: 'buyArchives_head',
        taskType: 'MONITOR',
        tableLayout: 'fixed',
        modulesName: 'buyArchives',
        rowSelection: {
            type: 'checkbox',
            onChange: (selectedRowKeys, selectedRows) => {
                dispatch({
                    type: 'buyArchives/updateStates',
                    payload: {
                        ids: selectedRowKeys,
                        selectListInfo: selectedRows,
                    },
                });
            },
            selectedRowKeys: ids,
        },
        columns: columns,
        scroll: { y: list.length > 0 ? currentHeight : 0 },
        rowKey: 'id',
        dataSource: list,
        pagination: false,
        bordered: true,
        showSorterTooltip: false,
    };

    return (
        <div className={styles.warp} id="buyArchives_id">
            <SearchCom />
            <div>
                <ColumnDragTable key={showAdvSearch} {...tableProps} />
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
            {annexVisible && <AnnexModel mainTableId={mainTableId} bizInfoId={bizInfoId} />}
        </div>
    );
}

export default connect(({ buyArchives }) => ({
    buyArchives,
}))(BuyArchives);
