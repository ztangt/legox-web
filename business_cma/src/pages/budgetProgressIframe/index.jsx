//未达序时进度预算指标iframe
import { useEffect, useState } from 'react';
import { connect } from 'umi';
import Table from '../../components/columnDragTable';
import { getColumns } from './config';
import styles from './index.less';

const Index = ({ dispatch, budgetProgressIframe }) => {
    const { list } = budgetProgressIframe;
    const [columns, setColumns] = useState(getColumns(budgetProgressIframe));
    useEffect(() => {
        dispatch({
            type: 'budgetProgressIframe/getList',
            payload: {
                pageNo: 1,
                pageSize: 5,
            },
        });
    }, []);
    return (
        <div className={styles.budgetProgressIframeContainer}>
            <Table columns={columns} dataSource={list} pagination={false} bordered={true} showSorterTooltip={false} />
        </div>
    );
};

export default connect(({ budgetProgressIframe }) => ({
    budgetProgressIframe,
}))(Index);
