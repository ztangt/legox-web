import { Button, Modal } from 'antd';
import { connect } from 'dva';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ColumnDragTable from '../../components/columnDragTable';
import IPagination from '../../components/iPagination/iPagination';
import { HISTORYTYPE, ORDER_WIDTH } from '../../util/constant';
import { dataFormat, formattingMoney } from '../../util/util';
import styles from './index.less';

const { confirm } = Modal;

function Index({ dispatch, contractAmount }) {
    const { location, openEvent } = useModel('@@qiankunStateFromMaster');

    const { formList, limit, currentPage, returnCount, currentHeight, pageTotal } = contractAmount;
    const { alreadyMoney, contractId } = location?.query || {};

    useEffect(() => {
        debugger;
        if (contractId && limit > 0) {
            getList(currentPage, limit);
        }
    }, [contractId, limit]);

    const columns = [
        {
            key: 'index',
            dataIndex: 'index',
            title: '序号',
            width: ORDER_WIDTH,
            render: (text, record, index) => <span>{index + 1}</span>,
            fixed: 'left',
        },
        {
            title: '合同编号',
            dataIndex: 'contractNumber',
            key: 'contractNumber',
            ellipsis: true,
        },
        {
            title: '合同名称',
            dataIndex: 'contractName',
            key: 'contractName',
            ellipsis: true,
        },
        {
            title: '申请人名称',
            dataIndex: 'registerIdentityName',
            key: 'registerIdentityName',
            ellipsis: true,
        },
        {
            title: '申请人部门',
            dataIndex: 'registerDeptName',
            key: 'registerDeptName',
            ellipsis: true,
        },
        {
            title: '本次支付金额',
            dataIndex: 'alreadyMoney',
            key: 'alreadyMoney',
            ellipsis: true,
            render: (text) => {
                return formattingMoney(text);
            },
        },

        {
            title: '记录类型',
            dataIndex: 'historyType',
            key: 'historyType',
            ellipsis: true,
            render: (text) => {
                return HISTORYTYPE[text];
            },
        },
        {
            title: '单据名称',
            dataIndex: 'sourceBizTitle',
            key: 'sourceBizTitle',
            ellipsis: true,
        },
        {
            title: '单据编号',
            dataIndex: 'documentNumber',
            key: 'documentNumber',
            ellipsis: true,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            ellipsis: true,
            width: 200,
            render: (text) => {
                return dataFormat(text, 'YYYY-MM-DD HH:mm:ss');
            },
        },
    ];

    function getList(newStart, newLimit) {
        dispatch({
            type: 'contractAmount/findExpenseReportsByContract',
            payload: {
                start: newStart,
                limit: newLimit,
                contractId,
            },
        });
    }

    function openFormDetail() {
        openEvent(arguments[0], arguments[1], arguments[2]?.sourceBizId, arguments[2], arguments[3]);
    }

    function goBack() {
        historyPush(
            {
                pathname: `/business_application/meteorological`,
                query: {
                    title: '合同台账',
                    microAppName: 'business_cma',
                    url: 'contractLedger',
                    // maxDataruleCode
                    // menuId
                },
            },
            `/business_cma/contractAmount/${contractId}`,
        );
    }

    const changePage = (nextPage, size) => {
        console.log(size, '--->size发生修改');
        if (size != limit) {
            dispatch({
                type: 'contractAmount/updateStates',
                payload: {
                    limit: size,
                },
            });
        } else {
            getList(nextPage, size);
        }
    };

    const tableProps = {
        container: 'contractAmount_com',
        listHead: 'contractAmount_head',
        taskType: 'MONITOR',
        tableLayout: 'fixed',
        modulesName: 'contractAmount',
        rowKey: (record) => record.id,
        dataSource: formList,
        pagination: false,
        // onRow: (record) => {
        //     return {
        //         onClick: openFormDetail.bind(this, {}, {}, record, 'new'), // 点击行
        //     };
        // },
        scroll: { y: formList.length > 0 ? currentHeight : 0 },
        columns: columns,
    };

    return (
        <div className={styles.container} id="contractAmount_com">
            <div className={'p8 flex flex_align_center'} id="freezeOrExec_head">
                <Button onClick={goBack}>返回</Button>
                <div className={'ml20'}>
                    <span>本页总金额</span>
                    <span className="gPrimary ml5 mr20">{formattingMoney(pageTotal)}</span>
                </div>
            </div>
            <div style={{ position: 'relative', clear: 'both' }}>
                <ColumnDragTable {...tableProps} />
            </div>
            <IPagination
                current={currentPage}
                total={returnCount}
                onChange={changePage}
                pageSize={limit}
                isRefresh={true}
                refreshDataFn={() => {
                    getList(currentPage, limit);
                }}
            />
        </div>
    );
}

export default connect(({ contractAmount }) => ({
    contractAmount,
}))(Index);
