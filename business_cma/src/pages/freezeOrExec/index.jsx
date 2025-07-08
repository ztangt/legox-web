import calcFn from '@/util/calc';
import { BIZSTATUS, EXECSTATE } from '@/util/constant';
import { dataFormat, formattingMoney } from '@/util/util';
import { Button, Table } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import ColumnDragTable from '../../components/columnDragTable';
import IPagination from '../../components/iPagination/iPagination';
import styles from './index.less';

function Index({ dispatch, freezeOrExec }) {
    const { openEvent } = useModel('@@qiankunStateFromMaster');

    const { formList, limit, currentPage, returnCount, currentHeight } = freezeOrExec;
    const { normCode = '', moneyType = '', currentYear = '' } = history.location?.query || {};

    const [resList, setResList] = useState([]);

    useEffect(() => {
        if (normCode && moneyType && limit > 0) {
            getList(currentPage, limit);
        }
    }, [normCode, moneyType, limit]);

    const columns = [
        {
            key: 'index',
            dataIndex: 'index',
            title: '序号',
            width: 60,
            render: (text, record, index) => <span>{index + 1}</span>,
        },
        {
            title: '标题',
            dataIndex: 'sourceBizTitle',
            key: 'sourceBizTitle',
            width: 400,
        },
        {
            title: '单据号',
            dataIndex: 'documentNumber',
            key: 'documentNumber',
            width: 300,
        },
        {
            title: '单据类型',
            dataIndex: 'sourceMenuName',
            key: 'sourceMenuName',
            width: 200,
        },
        {
            title: '金额',
            dataIndex: 'money',
            key: 'money',
            render: (text) => {
                return formattingMoney(text);
            },
            width: 200,
        },
        // 单据状态字段，0：待发；1：在办；2： 办结 BIZSTATUS
        {
            title: '单据状态',
            dataIndex: 'bizStatus',
            key: 'bizStatus',
            width: 120,
            render: (text) => BIZSTATUS[text],
        },
        {
            title: '登记人',
            dataIndex: 'draftUserName',
            key: 'draftUserName',
            width: 200,
        },
        {
            title: '登记部门',
            dataIndex: 'draftDeptName',
            key: 'draftDeptName',
            width: 200,
        },
        {
            title: '登记时间',
            dataIndex: 'draftTime',
            key: 'draftTime',
            width: 200,
            render: (text) => {
                return dataFormat(text, 'YYYY-MM-DD HH:mm:ss');
            },
        },
        {
            title: '操作',
            width: 100,
            fixed: 'right',
            render: (text, record) => (
                <div className="primaryColor" onClick={openFormDetail.bind(this, {}, {}, record, 'new')}>
                    查看
                </div>
            ),
        },
    ];

    const resColumns = [
        {
            key: 'index',
            dataIndex: 'index',
            title: '序号',
            width: 60,
            render: (text, record, index) => <span>{index + 1}</span>,
        },
        {
            title: '标题',
            dataIndex: 'sourceBizTitle',
            key: 'sourceBizTitle',
        },
        {
            title: '单据号',
            dataIndex: 'documentNumber',
            key: 'documentNumber',
        },
        {
            title: '单据类型',
            dataIndex: 'sourceMenuName',
            key: 'sourceMenuName',
        },
        {
            title: '金额',
            dataIndex: 'money',
            key: 'money',
            render: (text) => {
                return formattingMoney(text);
            },
        },
        {
            title: '单据状态',
            dataIndex: moneyType === 'FREEZE' ? 'execState' : 'freezeState',
            key: moneyType === 'FREEZE' ? 'execState' : 'freezeState',

            render: (text) => {
                return EXECSTATE[text];
            },
        },
        {
            title: '登记人',
            dataIndex: 'draftUserName',
            key: 'draftUserName',
        },
        {
            title: '登记部门',
            dataIndex: 'draftDeptName',
            key: 'draftDeptName',
        },
        {
            title: '登记时间',
            dataIndex: 'draftTime',
            key: 'draftTime',
            render: (text) => {
                return dataFormat(text, 'YYYY-MM-DD HH:mm:ss');
            },
        },
        {
            title: '操作',
            fixed: 'right',
            width: 100,
            render: (text, record) => (
                <div className="primaryColor" onClick={openFormDetail.bind(this, {}, {}, record, 'new')}>
                    查看
                </div>
            ),
        },
    ];

    function getList(newStart, newLimit) {
        dispatch({
            type: moneyType === 'FREEZE' ? 'freezeOrExec/getFreezeFormList' : 'freezeOrExec/getExecuteFormList',
            payload: {
                start: newStart,
                limit: newLimit,
                normCode,
                currentYear,
            },
        });
    }

    const onExpand = (expanded, record) => {
        if (!expanded) return;
        const { sourceId, normCode, execState, freezeState, beforeId } = record;
        dispatch({
            type:
                moneyType === 'FREEZE'
                    ? 'freezeOrExec/findNormExecuteInfoByBeforeId'
                    : 'freezeOrExec/findNormFreeBySourceIdList',
            payload: {
                sourceId,
                beforeId,
                normCode,
                // 报销未完成 0，报销已完成 1，撤销 2
                execState: moneyType === 'FREEZE' ? 1 : execState,
                freezeState: moneyType !== 'FREEZE' ? '' : freezeState,
                currentYear,
            },
            callback: (data) => {
                setResList({ ...resList, [record.id]: data });
            },
        });
    };

    const expandedRowRender = (record, index, indent, expanded) => {
        return <Table bordered columns={resColumns} dataSource={resList[record.id]} pagination={false} />;
    };

    function openFormDetail() {
        openEvent(arguments[0], arguments[1], arguments[2]?.sourceBizId, arguments[2], arguments[3]);
    }

    const changePage = (nextPage, size) => {
        if (size != limit) {
            dispatch({
                type: 'freezeOrExec/updateStates',
                payload: {
                    limit: size,
                },
            });
        } else {
            getList(nextPage, size);
        }
    };

    const tableProps = {
        container: 'freezeOrExec_com',
        listHead: 'freezeOrExec_head',
        taskType: 'MONITOR',
        tableLayout: 'fixed',
        modulesName: 'freezeOrExec',
        rowKey: (record) => record.id,
        dataSource: formList,
        pagination: false,
        bordered: true,
        showSorterTooltip: false,
        scroll: { y: formList.length > 0 ? currentHeight : 0 },
        columns: columns,
        expandable: {
            expandedRowRender,
            onExpand,
            fixed: 'right',
            rowExpandable: (record) => {
                return record.isDirectBill != 1;
            }, //是否允许展开
        },
    };

    const goBack = () => {
        history.push(`/budgetTarget`);
        dispatch({
            type: 'freezeOrExec/updateStates',
            payload: {
                returnCount: 0,
                allPage: 1,
                currentPage: 1,
                start: 1,
                limit: 0,
                formList: [],
                resList: [],
                currentHeight: 0,
            },
        });
    };

    let curNum = 0;
    formList.forEach((item) => {
        curNum = calcFn.add(curNum, item.money);
    });

    return (
        <div className={'height_100'} id="freezeOrExec_com">
            <div className={'p8 flex flex_align_center'} id="freezeOrExec_head">
                <Button onClick={goBack}>返回</Button>
                <div className={'ml20'}>
                    <span>本页总金额</span>
                    <span className="gPrimary ml5 mr20">{formattingMoney(curNum)}</span>
                </div>
            </div>
            <div className={styles.sedTable}>
                <ColumnDragTable {...tableProps} />
            </div>
            <IPagination current={currentPage} total={returnCount} onChange={changePage} pageSize={limit} />
        </div>
    );
}

export default connect(({ freezeOrExec }) => ({
    freezeOrExec,
}))(Index);
