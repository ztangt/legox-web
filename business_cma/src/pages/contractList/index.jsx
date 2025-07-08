//合同下钻的执行金额(支出、收入)列表
import { Button } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import { useEffect } from 'react';
import { history, useModel } from 'umi';
import ColumnDragTable from '../../components/columnDragTable';
import IPagination from '../../components/iPagination/iPagination';
import { formattingMoney } from '../../util/util';
import styles from './index.less';

function Index({ dispatch, contractList }) {
    const { location: locationFromQK } = useModel('@@qiankunStateFromMaster');

    const { list, start, limit, currentPage, returnCount, currentHeight } = contractList;
    const { id } = history.location?.query || {};

    useEffect(() => {
        if (id) {
            getList(start, limit);
        }
    }, [limit]);

    const columns = [
        {
            key: 'index',
            dataIndex: 'index',
            title: '序号',
            width: 50,
            render: (text, record, index) => index + 1,
        },
        {
            title: '标题',
            dataIndex: 'sourceBizTitle',
            key: 'sourceBizTitle',
            ellipsis: true,
            render: (text) => <span onClick={() => window.open(text)}>{text}</span>,
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
            dataIndex: 'thisPayMoney',
            key: 'thisPayMoney',
            ellipsis: true,
            render: (text) => {
                return formattingMoney(text);
            },
        },

        {
            title: '登记人',
            dataIndex: 'registerIdentityName',
            key: 'registerIdentityName',
            ellipsis: true,
        },
        {
            title: '登记部门',
            dataIndex: 'registerDeptName',
            key: 'registerDeptName',
            ellipsis: true,
        },
        {
            title: '登记时间',
            dataIndex: 'createTime',
            key: 'createTime',
            ellipsis: true,
            render: (text) => {
                return text && dayjs.unix(text).format('YYYY-MM-DD HH:mm:ss');
            },
        },
    ];

    function getList(start, limit) {
        dispatch({
            type: 'contractList/getList',
            payload: {
                start,
                limit,
                contractId: id,
            },
        });
    }

    const changePage = (nextPage, size) => {
        dispatch({
            type: 'contractList/updateStates',
            payload: {
                start: nextPage,
                limit: size,
            },
        });
        getList(nextPage, size);
    };

    const tableProps = {
        container: 'contractList_com',
        listHead: 'contractList_head',
        taskType: 'MONITOR',
        tableLayout: 'fixed',
        modulesName: 'contractList',
        rowKey: (record) => record.id,
        dataSource: list,
        pagination: false,
        bordered: true,
        showSorterTooltip: false,
        columns: columns,
        scroll: { y: list.length > 0 ? currentHeight : 0 },
    };

    return (
        <div className={styles.container} id="contractList_com">
            <div className={styles.control} id="contractList_head">
                <Button onClick={() => history.back()}>返回</Button>
            </div>
            <div style={{ position: 'relative', clear: 'both' }}>
                <ColumnDragTable {...tableProps} />
            </div>
            <IPagination current={currentPage} total={returnCount} onChange={changePage} pageSize={limit} />
        </div>
    );
}

export default connect(({ contractList }) => ({
    contractList,
}))(Index);
