import React, { useState } from 'react';
import { connect } from 'dva';
import GlobalModal from '../../../components/GlobalModal';
import ColumnDragTable from '../../../components/columnDragTable';
import { Button } from 'antd';

function DetailModel({ dispatch, contractLedger }) {
    const { annexList } = contractLedger;
    const [selectFiles, setSelectFiles] = useState([]);

    const onCancel = () => {
        dispatch({
            type: 'contractLedger/updateStates',
            payload: {
                annexVisible: false,
            },
        });
    };

    //选中行
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            let files = [];
            selectedRows.forEach((item) => {
                if (item.fileUrl) {
                    files.push(item);
                }
            });
            setSelectFiles(files);
        },
    };
    //批量下载
    const downLoadList = () => {
        let labelList = selectFiles.map((item) => item.labelTitle);
        labelList = [...new Set(labelList)]; //去重
        let newList = [];
        labelList.forEach((A) => {
            let list = selectFiles.filter((item) => item.labelTitle == A);
            newList.push({
                label: A,
                list: list.map((item) => ({ filePath: item.filePath })),
            });
        });
        dispatch({
            type: 'contractLedger/getZip',
            payload: {
                zipName: '下载文件',
                filePaths: JSON.stringify([
                    {
                        bizTitle: '下载' + new Date().getTime(),
                        fjName: newList,
                    },
                ]),
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
                title: '文件名称',
                dataIndex: 'fileName',
                width: 300,
            },
            {
                title: '操作',
                width: 200,
                render: (text, recode) => (
                    <div className="primaryColor" onClick={() => window.open(recode.fileUrl, '_blank')}>
                        下载
                    </div>
                ),
            },
        ],
        dataSource: annexList,
        pagination: false,
        bordered: true,
        showSorterTooltip: false,
    };

    return (
        <GlobalModal
            title="查看"
            open={true}
            top={'2%'}
            getContainer={() => {
                return document.getElementById('contractLedger_id');
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
            <Button className="mb10" disabled={!selectFiles.length} onClick={downLoadList}>
                打包下载
            </Button>
            <ColumnDragTable
                taskType="MONITOR"
                tableLayout="fixed"
                key={annexList}
                {...tableProps}
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                scroll={{
                    y: window.outerHeight - 600,
                    x: annexList.length > 0 ? 600 : 'auto',
                }}
            ></ColumnDragTable>
        </GlobalModal>
    );
}

export default connect(({ contractLedger }) => ({
    contractLedger,
}))(DetailModel);
