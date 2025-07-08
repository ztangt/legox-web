import { message, Modal, Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import { getColumnsList } from './config';
import RuleModal from './ruleModal';
import SearchCom from './searchCom';

const Index = ({ dispatch, dataEntryRule }) => {
    const [showRuleModal, setShowRuleModal] = useState(false);
    const [ruleInfo, setRuleInfo] = useState({});
    const { loading, currentHeight, limit, currentPage, returnCount, list } = dataEntryRule;
    //初始化columns
    const [columns, setColumns] = useState([]);
    useEffect(() => {
        let colList = [
            {
                title: '操作',
                fixed: 'right',
                render: (text, record) => {
                    return (
                        <div className={'flex'}>
                            <div className="primaryColor" onClick={() => openRuleModal(record)}>
                                修改
                            </div>
                            <div className="primaryColor ml20" onClick={() => delRule(record)}>
                                删除
                            </div>
                        </div>
                    );
                },
            },
        ];
        setColumns(getColumnsList(dataEntryRule, colList));
    }, []);

    const delRule = (record) => {
        Modal.confirm({
            title: '提示',
            content: `确认要删除此项规则？`,
            okText: '确定',
            getContainer: () => {
                return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
            },
            maskClosable: false,
            mask: false,
            onOk() {
                dispatch({
                    type: 'dataEntryRule/deleteRule',
                    payload: {
                        ids: record.id,
                    },
                    callback: () => {
                        message.success('删除成功');
                        getList(currentPage);
                    },
                });
            },
        });
    };

    // 详情弹窗
    const openRuleModal = (record) => {
        dispatch({
            type: 'dataEntryRule/getRuleInfo',
            payload: {
                id: record.id,
            },
            callback: (data) => {
                setRuleInfo({ ...data, id: record.id });
                changeRuleModal(true);
            },
        });
    };
    // 关闭弹窗
    const changeRuleModal = (isShow) => {
        setShowRuleModal(isShow);
    };

    const addRule = () => {
        setRuleInfo({});
        setShowRuleModal(true);
    };

    useEffect(() => {
        limit > 0 && getList(1);
    }, [limit]);

    // 获取列表数据
    const getList = (start) => {
        dispatch({
            type: 'dataEntryRule/getState',
            callback: ({ formInfo, limit }) => {
                dispatch({
                    type: 'dataEntryRule/updateStates',
                    payload: {
                        loading: true,
                    },
                });
                dispatch({
                    type: 'dataEntryRule/getList',
                    payload: {
                        start,
                        limit,
                        ...formInfo,
                    },
                });
            },
        });
    };
    // 页面更改
    const changePage = (nextPage, size) => {
        if (size !== limit) {
            dispatch({
                type: 'dataEntryRule/updateStates',
                payload: {
                    limit: size,
                },
            });
        } else {
            getList(nextPage);
        }
    };

    return (
        <Spin spinning={loading}>
            <SearchCom getList={getList} addRule={addRule} />
            <ColumnDragTable
                rowKey={'id'}
                taskType="MONITOR"
                tableLayout="fixed"
                modulesName="dataEntryRule"
                scroll={{ y: currentHeight }}
                dataSource={list}
                pagination={false}
                showSorterTooltip={false}
                bordered={true}
                listHead={'dataEntryRule_head_id'}
                columns={columns}
            />
            <IPagination
                current={currentPage}
                total={returnCount}
                onChange={changePage}
                pageSize={limit}
                isRefresh={true}
                refreshDataFn={() => getList(currentPage)}
            />
            {showRuleModal && <RuleModal getList={getList} info={ruleInfo} changeVisible={changeRuleModal} />}
        </Spin>
    );
};

export default connect(({ dataEntryRule }) => ({ dataEntryRule }))(Index);
