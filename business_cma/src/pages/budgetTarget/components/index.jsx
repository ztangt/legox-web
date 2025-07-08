import { formatObj, getMenuId } from '@/util/util';
import { message, Modal, Spin } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import { useEffect, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import SetCol from '../../../components/setCol';
import CarryModal from './carryModal';
import { getColumns } from './config';
import DetailModal from './detailModal';
import ExportModal from './exportModal';
import ImportModal from './importModal';
import SearchCom from './searchCom';
import TargetModal from './targetModal';

const { confirm } = Modal;
const Container = ({ dispatch, budgetTarget, targetWarning }) => {
    const { bizSolId: bizSolIdOk, location: locationQK, openEvent, openNewPage } = useModel('@@qiankunStateFromMaster');

    useEffect(() => {
        // let menuIdKeyValArr = JSON.parse(localStorage.getItem('menuIdKeyValArr'));
        // let menuId = menuIdKeyValArr[`${bizSolIdOk}-0`];
        let menuId = getMenuId();
        console.log(menuId, '---->报账卡管理的menuId');

        dispatch({
            type: 'budgetTarget/updateStates',
            payload: {
                bizSolId: bizSolIdOk,
                menuId: menuId,
            },
        });
        dispatch({
            type: 'budgetTarget/getBudgetUnitList',
            payload: { menuId },
        });
    }, []);

    let {
        list,
        currentHeight,
        currentPage,
        returnCount,
        limit,
        formData,
        detailModal,
        cutomHeaders,
        isShowCarryModal,
        isShowImportModal,
        importType,
        importData,
        importLoading,
        fileType,
        bizSolId,
        normStateList,
        isInit,
        showAdvSearch,

        allColumns,
        columns,
    } = budgetTarget;

    //保存调整记录信息
    const onShowDetail = (info) => {
        dispatch({
            type: 'budgetTarget/updateStates',
            payload: {
                detailModal: true,
                normCode: info.NORM_CODE,
            },
        });
    };

    const [colVisiblePop, setColVisiblePop] = useState(false); //设置列的设置弹框
    let allColumnsList = getColumns(formData.usedYear, budgetTarget, openFormDetail, dispatch);
    let [selectColumnCode, setSelectColumnCode] = useState(allColumnsList.map((item) => item.key)); //选中的列

    // let columns = getColumns(formData.usedYear, budgetTarget);

    //设置初始化的表格列表头
    useEffect(() => {
        if (isInit) {
            let columnsList = [...allColumnsList];
            let selectArr = [...allColumnsList].map((item) => item.key);
            if (localStorage.getItem('BudgetTarget_SetCol')) {
                selectArr = localStorage.getItem('BudgetTarget_SetCol').split(',');
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
                type: 'budgetTarget/updateStates',
                payload: {
                    allColumns: [...allColumnsList],
                    columns: [...columnsList],
                },
            });
        }
    }, [isInit]);

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
                type: 'budgetTarget/updateStates',
                payload: {
                    allColumns: [...newAllColumns],
                },
            });
        }
        setColVisiblePop(!colVisiblePop);
    };

    const saveCols = (colSelectKey, colSelect) => {
        dispatch({
            type: 'budgetTarget/updateStates',
            payload: {
                columns: [...colSelect],
            },
        });
        setSelectColumnCode(colSelectKey);
        localStorage.setItem('BudgetTarget_SetCol', colSelectKey);
        setColVisiblePop(false);
    };

    columns = [
        {
            dataIndex: 'index',
            title: '序号',
            width: 60,
            fixed: 'left',
            render: (text, record, index) => (
                <span className="primaryColor" onClick={openFormDetail.bind(this, {}, {}, record.BIZ_ID, record, 'Y')}>
                    {index + 1}
                </span>
            ),
        },
        ...columns,
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
                        id="budgetTarget_cma_id"
                    />
                </div>
            ),
            dataIndex: 'normCode',
            fixed: 'right',
            width: 120,
            render: (text, record) => (
                <span className="primaryColor" onClick={() => onShowDetail(record)}>
                    详情
                </span>
            ),
        },
    ];

    const [exportVisible, setExportVisible] = useState(false); //导出弹框
    const [selectedRowKey, setSelectedRowKey] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);
    const [selectedRowKeyIds, setSelectedRowKeyIds] = useState([]);
    const onSelectChange = (selectedRowKeyList, selectedRowsList, info) => {
        setSelectedRowKey(selectedRowKeyList);
        setSelectedRow(selectedRowsList);
        getKeys(selectedRowsList);
    };
    const getKeys = (selectedRowsList) => {
        let ids = [];
        let bzids = [];
        let deployFormIds = [];
        selectedRowsList.forEach((item) => {
            ids.push(item.ID); // ID
            bzids.push(item.BIZ_ID); // BIZ_ID
            deployFormIds.push(item.DEPLOY_FORM_ID); // DEPLOY_FORM_ID
        });
        setSelectedRowKeyIds(ids);
        setCutomHeaders(ids.toString(), bzids.toString(), deployFormIds.toString());
        window.localStorage.setItem('normId', selectedRowsList?.[0]?.ID);
    };

    const setCutomHeaders = (mainTableId, bizInfoId, deployFormId) => {
        // 必传字段：bizSolId, mainTableId,
        // 选传字段：deployFormId, bizInfoId
        cutomHeaders.bizSolId = bizSolId;
        if (mainTableId) {
            cutomHeaders.mainTableId = mainTableId;
        }
        if (bizInfoId) {
            cutomHeaders.bizInfoId = bizInfoId;
        }
        if (deployFormId) {
            cutomHeaders.deployFormId = deployFormId;
        }
        dispatch({
            type: 'budgetTarget/updateStates',
            payload: {
                cutomHeaders,
            },
        });
    };

    const tableProps = {
        container: 'budgetTarget_cma_id',
        listHead: 'budgetTarget_head',
        // taskType: 'MONITOR',
        tableLayout: 'fixed',
        modulesName: 'budgetTarget',
        rowKey: (record) => `${record.ID}-${record.BIZ_ID}-${record.DEPLOY_FORM_ID}`,
        rowSelection: {
            selectedRowKeys: selectedRowKey,
            defaultSelectedRowKeys: selectedRowKey,
            onChange: onSelectChange,
        },
        dataSource: list,
        pagination: false,
        bordered: true,
        showSorterTooltip: false,
        scroll: { y: list.length > 0 ? currentHeight : 0 },
        columns: columns,
    };
    const getList = (startPage) => {
        dispatch({
            type: 'budgetTarget/getList',
            payload: { ...formData, start: startPage, limit, bizSolId },
        });
    };

    useEffect(() => {
        const { projectCode } = history.location?.query || {};

        if (projectCode) {
            dispatch({
                type: 'budgetTarget/updateStates',
                payload: {
                    formData: {
                        usedYear: dayjs().year(),
                        projectCode: projectCode,
                    },
                    initProjectCode: projectCode,
                },
            });
        }
        // dispatch({ type: 'budgetTarget/getBizSolId' });
        dispatch({ type: 'budgetTarget/getGoverLogicCode' });
        dispatch({ type: 'budgetTarget/getPartLogicCode' });
        dispatch({ type: 'budgetTarget/getFundsLogicCode' });
        dispatch({ type: 'budgetTarget/getDictList' });
    }, []);

    // 重置表格高度
    useEffect(() => {
        isInit && bizSolId && limit > 0 && getList(currentPage);
    }, [limit, bizSolId, isInit]);

    const changePage = (nextPage, size) => {
        //要保存页数组件传回来的size
        if (size !== limit) {
            dispatch({
                type: 'budgetTarget/updateStates',
                payload: {
                    limit: size,
                },
            });
        } else {
            getList(nextPage);
        }
    };

    function openFormDetail() {
        if (arguments.length === 0) {
            openEvent({}); //新增
        } else if (arguments.length === 1) {
            openEvent(arguments[0]); //新增
        } else if (arguments.length === 5) {
            handleEdit(); //修改
        } else if (arguments.length === 6) {
            openEvent(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]); //查看
        }
    }

    const handleEdit = () => {
        if (selectedRow.length !== 1) {
            return message.warning('请选择一条数据');
        }
        dispatch({
            type: 'budgetTarget/checkNorm',
            payload: { normId: selectedRow?.[0].ID },
            callback: (data) => {
                if (data) {
                    message.warning('此指标已被使用，无法修改');
                } else {
                    openEvent({}, {}, selectedRow?.[0]?.BIZ_ID, selectedRow?.[0]);
                }
            },
        });
    };
    const initSelect = () => {
        setSelectedRowKey([]);
        setSelectedRow([]);
    };

    //删除
    const handleDelete = () => {
        if (selectedRow.length !== 1) {
            return message.warning('请选择一条数据');
        }
        confirm({
            title: '确认操作',
            content: '确认要删除？',
            onOk() {
                dispatch({
                    type: 'budgetTarget/checkNorm',
                    payload: { normId: selectedRow?.[0].ID },
                    callback: (data) => {
                        if (data) {
                            message.warning('此指标已被使用，无法删除');
                        } else {
                            dispatch({
                                type: 'budgetTarget/delFormData',
                                payload: { bizSolId, ids: selectedRowKeyIds.join(',') },
                                callback: () => {
                                    message.success('删除成功');
                                    getList(currentPage);
                                    initSelect();
                                },
                            });
                        }
                    },
                });
            },
        });
    };
    //启用
    const powerNorm = (updateStr, describe) => {
        dispatch({
            type: 'budgetTarget/powerNorm',
            payload: { updateStr },
            callback: function () {
                message.success(`${describe}成功`);
                getList(currentPage);
                initSelect();
            },
        });
    };
    // 启用
    const startUse = () => {
        if (selectedRow.length < 1) {
            return message.warning('请至少选择一条数据');
        }
        // if (selectedRow[0].IS_ENABLE_TLDT_ == 1) {
        //     return message.warning('该指标已启用');
        // }
        let obj = {
            // ID: selectedRowKeyIds.toString(),
            ID: selectedRowKeyIds,
            BIZ_SOL_ID: bizSolId,
            IS_ENABLE_TLDT_: 1,
            UPDATE_TIME: selectedRow[0].UPDATE_TIME || '',
        };
        console.log(obj, '启用参数');
        let updateStr = JSON.stringify(obj);
        powerNorm(updateStr, '启用');
    };
    const stopUse = () => {
        if (selectedRow.length < 1) {
            return message.warning('请至少选择一条数据');
        }
        // if (selectedRow[0].IS_ENABLE_TLDT_ == 0) {
        //     return message.warning('该指标已停用');
        // }
        let obj = {
            // ID: selectedRowKeyIds.toString(),
            ID: selectedRowKeyIds,
            BIZ_SOL_ID: bizSolId,
            IS_ENABLE_TLDT_: 0,
            UPDATE_TIME: selectedRow[0].UPDATE_TIME || '',
        };
        console.log(obj, '停用参数');
        let updateStr = JSON.stringify(obj);
        powerNorm(updateStr, '停用');
    };
    // 收回
    const regainItem = () => {
        if (selectedRow.length < 1) {
            return message.warning('请至少选择一条数据');
        }
        // if (selectedRow[0].NORM_STATE_TLDT_ == 0) {
        //     return message.warning('该指标已收回');
        // }
        let obj = {
            // ID: selectedRowKeyIds.toString(),
            ID: selectedRowKeyIds,
            BIZ_SOL_ID: bizSolId,
            NORM_STATE_TLDT_: 0,
            UPDATE_TIME: selectedRow[0].UPDATE_TIME || '',
        };
        console.log(obj, '收回参数');
        let updateStr = JSON.stringify(obj);
        powerNorm(updateStr, '收回');
    };
    // 取消收回 TODO码值
    const cancelRegainItem = () => {
        if (selectedRow.length < 1) {
            return message.warning('请至少选择一条数据');
        }
        // if (selectedRow[0].NORM_STATE_TLDT_ == 1) {
        //     return message.warning('该指标已取消收回');
        // }
        let obj = {
            // ID: selectedRowKeyIds.toString(),
            ID: selectedRowKeyIds,
            BIZ_SOL_ID: bizSolId,
            NORM_STATE_TLDT_: 1,
            UPDATE_TIME: selectedRow[0].UPDATE_TIME || '',
        };
        let updateStr = JSON.stringify(obj);
        console.log(obj, '取消收回参数');
        powerNorm(updateStr, '取消收回');
    };

    //预警设置（打开弹窗）
    const { editCount, isShowEditModal } = targetWarning;
    const warningSet = () => {
        if (!selectedRowKey.length) {
            return message.warning('请至少选择一条数据');
        }
        dispatch({
            type: 'targetWarning/updateStates',
            payload: {
                isShowEditModal: true,
                selectedRowKey: selectedRowKeyIds,
                selectedRow,
            },
        });
    };
    //预警设置（reset）
    const resetKeys = () => {
        initSelect();
        dispatch({
            type: 'targetWarning/updateStates',
            payload: {
                selectedRowKey: [],
                selectedRow: [],
            },
        });
    };
    //按列表结转
    const carryList = () => {
        if (!selectedRowKey.length) {
            return message.warning('请至少选择一条数据');
        }
        for (let i = 0; i < selectedRow.length; i++) {
            if (selectedRow[i].NORM_STATE_TLDT_ == 2) {
                return message.warning('选中指标中包含已结转的数据，请重新选择！');
            }
        }
        dispatch({
            type: 'budgetTarget/annualCarryForward',
            payload: {
                bizSolId,
                ids: selectedRowKeyIds.toString(),
                usedYear: formData.usedYear,
                carryForwardType: 0,
            },
            callback: () => {
                getList(currentPage);
                initSelect();
            },
        });
    };

    //按项目结转（打开弹窗）
    const carryProject = () => {
        dispatch({
            type: 'budgetTarget/updateStates',
            payload: {
                isShowCarryModal: true,
            },
        });
    };

    //下载
    const onDownLoadTemplate = () => {
        fetch(`${window.localStorage.getItem('env')}/setup/bizSol/bussinessForm/import-template-downpath/${bizSolId}`, {
            method: 'get',
            headers: {
                Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
            },
        }).then((response) => {
            response.json().then((res) => {
                if (res.code == 200) {
                    if (res.data.downPath) {
                        window.open(res.data.downPath);
                    }
                } else {
                    message.error(res.msg);
                }
            });
        });
    };
    //导入
    const onImportClick = (importType) => {
        dispatch({
            type: 'budgetTarget/updateStates',
            payload: {
                isShowImportModal: true,
                importType,
            },
        });
    };

    //导入取消
    const onImportCancel = () => {
        dispatch({
            type: 'budgetTarget/updateStates',
            payload: {
                isShowImportModal: false,
                importData: {},
            },
        });
    };

    const [searchForm, setSearchForm] = useState({});
    let searchRef = useRef(null);

    const onExport = async (fileType) => {
        dispatch({
            type: 'budgetTarget/updateStates',
            payload: {
                fileType,
            },
        });
        let searchForm = searchRef.current?.getSearchInfo() || {};
        setSearchForm(formatObj(searchForm));
        setExportVisible(true);
    };
    const getRows = () => {
        return selectedRow;
    };

    let buttonEvents = {
        openFormDetail,
        handleDelete,
        startUse,
        stopUse,
        regainItem,
        cancelRegainItem,
        warningSet,
        carryList,
        carryProject,
        onDownLoadTemplate,
        onImportClick,
        onExport,
        getRows,
    };
    const exportColumns = '';

    const [show, setShow] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setShow(true);
        }, 500);
    }, []);

    return (
        <div id="budgetTarget_cma_id">
            <Spin spinning={!show}>
                <SearchCom ref={searchRef} buttonEvents={buttonEvents} />
                {show && <ColumnDragTable key={showAdvSearch} {...tableProps} />}
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
                {detailModal && <DetailModal currentYear={formData.usedYear} />}
                {isShowEditModal && (
                    <TargetModal
                        WHETHER_WARNING_TLDT_="1"
                        containerId="budgetTarget_cma_id"
                        bizSolId={bizSolId}
                        resetKeys={resetKeys}
                    />
                )}
                {isShowCarryModal && <CarryModal bizSolIdOther={bizSolId} currentYear={formData.usedYear} />}
                {isShowImportModal && (
                    <ImportModal
                        usedYear={formData.usedYear}
                        bizSolId={bizSolId}
                        importData={importData}
                        importType={importType}
                        importLoading={importLoading}
                        refreshList={() => getList(currentPage)}
                        onCancel={onImportCancel}
                    />
                )}
                {exportVisible && (
                    <ExportModal
                        searchForm={searchForm}
                        usedYear={formData.usedYear}
                        bizSolId={bizSolId}
                        fileType={'BUDGETPROJECT'}
                        columns={exportColumns}
                        selectedRowKeys={selectedRowKeyIds}
                        setExportVisible={setExportVisible}
                    />
                )}
            </Spin>
        </div>
    );
};
export default connect(({ budgetTarget, targetWarning }) => ({
    budgetTarget,
    targetWarning,
}))(Container);
