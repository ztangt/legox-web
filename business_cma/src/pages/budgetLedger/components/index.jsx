import { message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { connect, history, useModel } from 'umi';
import ColumnDragTable from '../../../components/columnDragTable';
import CarryModal from './carryModal';
import { getColumns } from './config';
import DetailModal from './detailModal';
import ExportModal from './exportModal';
import ImportModal from './importModal';
import SearchCom from './searchCom';
import TargetModal from './targetModal';

import { PlusSquareOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const Container = ({ dispatch, budgetLedger, targetWarning }) => {
    const { location, openEvent, openNewPage } = useModel('@@qiankunStateFromMaster');
    const { bizSolId, uuId, url } = location.query;
    const {
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
        showAdvSearch,
    } = budgetLedger;

    let columns = getColumns();

    //保存调整记录信息
    const onShowDetail = (info) => {
        dispatch({
            type: 'budgetLedger/updateStates',
            payload: {
                detailModal: true,
                normCode: info.NORM_CODE,
            },
        });
    };

    const loopChild = (parentCode, allList, addList) => {
        allList.forEach((item) => {
            if (item.OBJ_CODE == parentCode) {
                setOpenKey([...openKey, item.OBJ_CODE]);
                return (item.children = addList);
            }
            if (item.children && item.children.length) {
                loopChild(parentCode, item.children, addList);
            }
        });
        return list;
    };

    const getChildList = (record) => {
        dispatch({
            type: 'budgetLedger/getChildList',
            payload: { ...formData, parentCode: record.OBJ_CODE },
            callback: (addList) => {
                let newList = loopChild(record.OBJ_CODE, list, addList);
                dispatch({
                    type: 'budgetLedger/updateStates',
                    payload: { list: [...newList] },
                });
            },
        });
    };

    const openBudgetTarget = (info) => {
        history.push({
            pathname: '/budgetTarget',
            query: {
                projectCode: info.OBJ_CODE,
            },
        });

        // historyPush({
        //     pathname: '/budgetTarget',
        //     query: {
        //         projectCode: info.OBJ_CODE,
        //     },
        // })
    };
    columns = [
        {
            dataIndex: 'OBJ_NAME',
            title: '项目名称',
            width: 300,
            fixed: 'left',
            render: (text, record, index) => (
                <div className="flex flex_align_center">
                    {record.isParent == 1 && !record.children ? (
                        <PlusSquareOutlined className="g6 fb mr10 primaryColor" onClick={() => getChildList(record)} />
                    ) : (
                        ''
                    )}
                    <span>{text}</span>
                </div>
            ),
        },
        ...columns,
        {
            title: '指标详情',
            fixed: 'right',
            width: 200,
            render: (text, record) => (
                <span className="primaryColor" onClick={() => openBudgetTarget(record)}>
                    {' '}
                    查看{' '}
                </span>
            ),
        },
    ];

    const [exportVisible, setExportVisible] = useState(false); //导出弹框
    const [selectedRowKey, setSelectedRowKey] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);
    const [selectedRowKeyIds, setSelectedRowKeyIds] = useState([]);

    const [openKey, setOpenKey] = useState([]); //展开行
    const onSelectChange = (selectedRowKeyList, selectedRowsList, info) => {
        setSelectedRowKey(selectedRowKeyList);
        setSelectedRow(selectedRowsList);
        let ids = [];
        let bzids = [];
        let deployFormIds = [];
        selectedRowKeyList.forEach((item) => {
            const tmp = item.split('-');
            ids.push(tmp[0]); // ID
            bzids.push(tmp[1]); // BIZ_ID
            deployFormIds.push(tmp[2]); // DEPLOY_FORM_ID
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
            type: 'budgetLedger/updateStates',
            payload: {
                cutomHeaders,
            },
        });
    };

    const tableProps = {
        expandedRowKeys: openKey,
        onExpand: (expanded, record) => {
            //展开合起
            if (openKey.includes(record.OBJ_CODE)) {
                setOpenKey(openKey.filter((item) => item != record.OBJ_CODE));
            } else {
                setOpenKey([...openKey, record.OBJ_CODE]);
            }
        },
        container: 'budgetLedger_id',
        listHead: 'budgetLedger_head',
        taskType: 'MONITOR',
        tableLayout: 'fixed',
        modulesName: 'budgetLedger',
        // rowKey: (record) => `${ record.ID }-${ record.BIZ_ID }-${ record.DEPLOY_FORM_ID }`,
        rowKey: (record) => `${record.OBJ_CODE}`,
        // rowSelection: {
        //     selectedRowKeys: selectedRowKey,
        //     defaultSelectedRowKeys: selectedRowKey,
        //     onChange: onSelectChange,
        // },
        dataSource: list,
        pagination: false,
        bordered: true,
        showSorterTooltip: false,
        scroll: { y: list.length > 0 ? currentHeight : 0 },
        columns: columns,
    };
    const getList = (startPage) => {
        dispatch({
            type: 'budgetLedger/getList',
            payload: { ...formData, start: startPage, limit },
        });
    };
    // 重置表格高度
    useEffect(() => {
        limit > 0 && getList(currentPage);
    }, [limit]);

    const changePage = (nextPage, size) => {
        getList(nextPage);
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
            type: 'budgetLedger/checkNorm',
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
                    type: 'budgetLedger/checkNorm',
                    payload: { normId: selectedRow?.[0].ID },
                    callback: (data) => {
                        if (data) {
                            message.warning('此指标已被使用，无法删除');
                        } else {
                            dispatch({
                                type: 'budgetLedger/delFormData',
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
            type: 'budgetLedger/powerNorm',
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
        console.log(selectedRow, 'selectedRow');
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
            type: 'budgetLedger/annualCarryForward',
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
            type: 'budgetLedger/updateStates',
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
            type: 'budgetLedger/updateStates',
            payload: {
                isShowImportModal: true,
                importType,
            },
        });
    };

    //导入取消
    const onImportCancel = () => {
        dispatch({
            type: 'budgetLedger/updateStates',
            payload: {
                isShowImportModal: false,
                importData: {},
            },
        });
    };

    const onExport = async (fileType) => {
        dispatch({
            type: 'budgetLedger/updateStates',
            payload: {
                fileType,
            },
        });
        setExportVisible(true);
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
    };
    const exportColumns = '';

    return (
        <div id="budgetLedger_id">
            <SearchCom buttonEvents={buttonEvents} />
            <ColumnDragTable key={showAdvSearch} {...tableProps} />
            {detailModal && <DetailModal currentYear={formData.usedYear} />}
            {isShowEditModal && (
                <TargetModal
                    WHETHER_WARNING_TLDT_="1"
                    containerId="budgetLedger_id"
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
                    usedYear={formData.currentYear}
                    bizSolId={bizSolId}
                    fileType={fileType}
                    columns={exportColumns}
                    selectedRowKeys={selectedRowKeyIds}
                    setExportVisible={setExportVisible}
                />
            )}
        </div>
    );
};
export default connect(({ budgetLedger, targetWarning }) => ({
    budgetLedger,
    targetWarning,
}))(Container);
