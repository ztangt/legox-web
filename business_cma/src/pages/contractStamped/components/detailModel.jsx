import React from 'react';
import { connect } from 'dva';
import GlobalModal from '../../../components/GlobalModal';
import ColumnDragTable from '../../../components/columnDragTable';
import dayjs from 'dayjs';
import { Button } from 'antd';
function DetailModel({ dispatch, contractStamped }) {
    const { detailList } = contractStamped;
    const onCancel = () => {
        dispatch({
            type: 'contractStamped/updateStates',
            payload: {
                detailVisible: false,
            },
        });
    };

    const tableProps = {
        rowKey: 'id',
        columns: [
            {
                title: '序号',
                width: 60,
                render: (text, recode, index) => <span>{index + 1}</span>,
            },
            {
                title: '说明',
                dataIndex: 'number',
                width: 320,
                render: (text, record) => {
                    let history = JSON.parse(record.history) || [];
                    return (
                        <div>
                            <div
                                className="primaryColor mb10"
                                style={{
                                    width: '300px',
                                    whiteSpace: 'break-spaces',
                                }}
                            >
                                {record.sourceBizTitle}
                            </div>
                            {history.map((item, itemIndex) => (
                                <div
                                    key={itemIndex}
                                    style={{
                                        width: '300px',
                                        whiteSpace: 'break-spaces',
                                    }}
                                >
                                    <span className="g6">{item.columnName}：</span>
                                    <span>
                                        {' '}
                                        {item.fromVal || '无'}→{item.toVal}
                                    </span>
                                </div>
                            ))}
                        </div>
                    );
                },
            },
            {
                title: '业务类型',
                dataIndex: 'sourceMenuName',
                width: 200,
            },
            {
                title: '操作人',
                dataIndex: 'registerIdentityName',
                width: 200,
            },
            {
                title: '操作时间',
                dataIndex: 'createTime',
                width: 200,
                render: (text) => text && dayjs.unix(text).format('YYYY-MM-DD HH:mm:ss'),
            },
        ],
        dataSource: detailList,
        pagination: false,
        bordered: true,
        showSorterTooltip: false,
    };

    return (
        <GlobalModal
            title="详情"
            open={true}
            top={'2%'}
            getContainer={() => {
                return document.getElementById('contractStamped_id');
            }}
            footer={[
                <Button key={1} onClick={onCancel}>
                    取消
                </Button>,
            ]}
            onCancel={onCancel}
            maskClosable={false}
            mask={false}
            modalSize="middle"
        >
            <ColumnDragTable
                taskType="MONITOR"
                tableLayout="fixed"
                key={detailList}
                {...tableProps}
                scroll={{
                    y: window.outerHeight - 600,
                    x: detailList.length > 0 ? 600 : 'auto',
                }}
            ></ColumnDragTable>
        </GlobalModal>
    );
}

export default connect(({ contractStamped }) => ({
    contractStamped,
}))(DetailModel);
