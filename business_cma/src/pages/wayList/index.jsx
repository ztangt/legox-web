import { Button, Modal } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import ColumnDragTable from '../../components/columnDragTable';
import IPagination from '../../components/iPagination/iPagination';
import { BIZSTATUS, ORDER_WIDTH } from '../../util/constant';
import { dataFormat, formattingMoney } from '../../util/util';
import styles from './index.less';

const { confirm } = Modal;

function Index({ dispatch, wayList }) {
    const { location: locationFromQK, openEvent, openNewPage } = useModel('@@qiankunStateFromMaster');

    const { formList, limit, currentPage, returnCount, currentHeight } = wayList;
    const { normCode = '', moneyType = '', currentYear = '' } = history.location?.query || {};

    const [resList, setResList] = useState([]);
    const [selectedRowKey, setSelectedRowKey] = useState('');

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
            width: ORDER_WIDTH,
            render: (text, record, index) => <span>{index + 1}</span>,
        },
        {
            title: '标题',
            dataIndex: 'sourceBizTitle',
            key: 'sourceBizTitle',
            ellipsis: true,
        },
        {
            title: '单据号',
            dataIndex: 'documentNumber',
            key: 'documentNumber',
            ellipsis: true,
        },
        {
            title: '单据类型',
            dataIndex: 'sourceMenuName',
            key: 'sourceMenuName',
            ellipsis: true,
        },
        {
            title: '金额',
            dataIndex: 'sumMoney',
            key: 'sumMoney',
            ellipsis: true,
            render: (text) => {
                return formattingMoney(text);
            },
        },
        {
            title: '单据状态',
            dataIndex: 'bizStatus',
            key: 'bizStatus',
            ellipsis: true,
            render: (text) => {
                return BIZSTATUS[text];
            },
        },
        {
            title: '登记人',
            dataIndex: 'draftUserName',
            key: 'draftUserName',
            ellipsis: true,
        },
        {
            title: '登记部门',
            dataIndex: 'draftDeptName',
            key: 'draftDeptName',
            ellipsis: true,
        },
        {
            title: '登记时间',
            dataIndex: 'draftTime',
            key: 'draftTime',
            ellipsis: true,
            render: (text) => {
                return dataFormat(text, 'YYYY-MM-DD HH:mm:ss');
            },
        },
    ];

    function getList(newStart, newLimit) {
        dispatch({
            type: 'wayList/getNormOnwayList',
            payload: {
                start: newStart,
                limit: newLimit,
                normCode,
                moneyType,
                currentYear,
            },
        });
    }

    function openFormDetail() {
        openEvent(arguments[0], arguments[1], arguments[2]?.sourceBizId, arguments[2], arguments[3]);
    }

    const changePage = (nextPage, size) => {
        console.log(size, '--->size发生修改');
        if (size != limit) {
            dispatch({
                type: 'wayList/updateStates',
                payload: {
                    limit: size,
                },
            });
        } else {
            getList(nextPage, size);
        }
    };

    const tableProps = {
        container: 'wayList_com',
        listHead: 'wayList_head',
        taskType: 'MONITOR',
        tableLayout: 'fixed',
        modulesName: 'wayList',
        rowKey: (record) => record.id,
        dataSource: formList,
        pagination: false,
        onRow: (record) => {
            return {
                onClick: openFormDetail.bind(this, {}, {}, record, 'new'), // 点击行
            };
        },
        scroll: { y: formList.length > 0 ? currentHeight : 0 },
        columns: columns,
    };

    return (
        <div className={styles.container} id="wayList_com">
            <div className={styles.control} id="wayList_head">
                <Button onClick={() => history.push(`/budgetTarget`)}>返回</Button>
            </div>
            <div style={{ position: 'relative', clear: 'both' }}>
                <ColumnDragTable {...tableProps} />
            </div>
            <IPagination current={currentPage} total={returnCount} onChange={changePage} pageSize={limit} />
        </div>
    );
}

export default connect(({ wayList }) => ({
    wayList,
}))(Index);
