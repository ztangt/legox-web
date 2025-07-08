import { Table } from 'antd';
import { connect } from 'dva';
import { useEffect } from 'react';
import { useModel } from 'umi';
import GlobalModal from '../../../components/GlobalModal';
import { dataFormat } from '../../../util/util';

function DetailModal({ dispatch, budgetTarget, currentYear = '2022' }) {
    const { detailList, normCode } = budgetTarget;
    const { location: locationFromQK, openEvent } = useModel('@@qiankunStateFromMaster');

    useEffect(() => {
        getDetailList();
    }, []);
    const getDetailList = () => {
        dispatch({
            type: 'budgetTarget/getDetailList',
            payload: {
                normCode,
                currentYear,
            },
        });
    };
    const handelCancel = () => {
        dispatch({
            type: 'budgetTarget/updateStates',
            payload: { detailModal: false },
        });
    };

    const onTitleClick = (v) => {
        if (v?.sourceBizId) {
            openEvent({}, {}, v?.sourceBizId, v, 'new');
        }
    };

    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 60,
            render: (text, record, index) => <span>{index + 1}</span>,
        },
        {
            title: '说明',
            dataIndex: 'history',
            key: 'history',

            width: 200,
            render: (text, record, idx) => {
                let arr = [];
                if (record.history) {
                    arr = JSON.parse(record.history);
                }
                return (
                    <div>
                        <a onClick={() => onTitleClick(record)}>{record.sourceBizTitle}</a>
                        {arr.map((item, index) => {
                            return (
                                <p key={index} title={`${item.columnName}:${item.fromVal}->${item.toVal}`}>
                                    {item.columnName === '登记创建' && item.toVal === ''
                                        ? `${item.columnName}`
                                        : `${item.columnName}:${item.fromVal}->${item.toVal}`}
                                </p>
                            );
                        })}
                    </div>
                );
            },
        },
        {
            title: '业务类型',
            dataIndex: 'sourceMenuName',
            key: 'sourceMenuName',

            width: 100,
        },
        {
            title: '操作人',
            dataIndex: 'operateIdentityName',
            key: 'operateIdentityName',

            width: 100,
        },
        {
            title: '操作时间',
            dataIndex: 'operateIdentityTime',
            key: 'operateIdentityTime',

            width: 100,
            render: (text) => {
                return dataFormat(text, 'YYYY-MM-DD HH:mm:ss');
            },
        },
    ];
    return (
        <GlobalModal
            title="调整记录"
            open={true}
            onCancel={handelCancel}
            maskClosable={false}
            mask={false}
            modalSize="middle"
            getContainer={() => {
                return document.getElementById('budgetTarget_cma_id');
            }}
            onOk={handelCancel}
        >
            <Table
                columns={columns}
                pagination={false}
                dataSource={detailList}
                bordered
                scroll={{ y: 'calc(100% - 42px)' }}
            />
        </GlobalModal>
    );
}

export default connect(({ budgetTarget }) => ({ budgetTarget }))(DetailModal);
