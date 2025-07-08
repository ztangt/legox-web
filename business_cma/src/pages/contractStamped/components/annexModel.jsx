import React, { useState } from 'react';
import { connect } from 'dva';
import GlobalModal from '../../../components/GlobalModal';
import ColumnDragTable from '../../../components/columnDragTable';
import { Button, message } from 'antd';

function DetailModel({ dispatch, contractStamped }) {
    const { annexList } = contractStamped;
    const [selectFiles, setSelectFiles] = useState([]);
    const onCancel = () => {
        dispatch({
            type: 'contractStamped/updateStates',
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
        let annexIds = selectFiles.map((item) => item.annexId);
        annexIds = [...new Set(annexIds)];
        let newList = [];
        //这个方法是有点反人类，是为了拼后端需要的参数格式
        annexIds.forEach((item, index) => {
            let firList = selectFiles.filter((A) => A.annexId == item);
            if (firList.length) {
                let { bizTitle } = firList[0];
                let fjName = [];
                //去重
                let labelList = firList.map((B) => B.labelTitle);
                labelList = [...new Set(labelList)];
                labelList.forEach((C) => {
                    let thrList = firList.filter((D) => D.labelTitle == C);
                    fjName.push({
                        label: C,
                        list: thrList.map((E) => ({ filePath: E.filePath })),
                    });
                });
                newList.push({
                    bizTitle: bizTitle + '_' + index,
                    fjName,
                });
            }
        });
        dispatch({
            type: 'contractStamped/getZip',
            payload: {
                zipName: '下载文件' + new Date().getTime(),
                filePaths: JSON.stringify(newList),
            },
        });
    };
    //单个下载
    const openNewPage = (record) => {
        if (record.fileUrl) {
            return window.open(record.fileUrl, '_blank');
        }
        message.error('暂无文件');
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
                title: '业务应用类别',
                dataIndex: 'sourceMenuName',
                width: 300,
                onCell: (record, index) => {
                    let arr = annexList.filter((item) => item.annexId === record.annexId);
                    return {
                        rowSpan: record.noFile ? 1 : record.itemId == 1 ? arr.length : 0,
                    };
                },
                render: (text) => <div className="whiteSpace">{text}</div>,
            },
            {
                title: '相关事项名称',
                dataIndex: 'bizTitle',
                width: 200,
                onCell: (record, index) => {
                    let arr = annexList.filter((item) => item.annexId == record.annexId);
                    return {
                        rowSpan: record.noFile ? 1 : record.itemId == 1 ? arr.length : 0,
                    };
                },
                render: (text) => <div className="whiteSpace">{text}</div>,
            },
            {
                title: '附件名称',
                dataIndex: 'fileName',
                width: 400,
                render: (text, recode) => (
                    <div>
                        <div className="g6 mb10 whiteSpace">{recode.fileName}</div>
                        <div className="primaryColor whiteSpace">{recode.filePath}</div>
                    </div>
                ),
            },
            {
                title: '操作',
                width: 200,
                render: (text, recode) => (
                    <div className="primaryColor mr10" onClick={() => openNewPage(recode)}>
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
                    y: window.outerHeight - 500,
                    x: annexList.length > 0 ? 600 : 'auto',
                }}
            ></ColumnDragTable>
        </GlobalModal>
    );
}

export default connect(({ contractStamped }) => ({
    contractStamped,
}))(DetailModel);
