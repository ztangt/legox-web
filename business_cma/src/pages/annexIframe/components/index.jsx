import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import ColumnDragTable from '../../../components/columnDragTable';
import dayjs from 'dayjs';

const index = ({ dispatch, annexIframe }) => {
    const { list, typeList, isInit } = annexIframe;
    const [selectFiles, setSelectFiles] = useState([]);

    useEffect(() => {
        isInit &&
            dispatch({
                type: 'annexIframe/getList',
            });
    }, [isInit]);
    useEffect(() => {
        dispatch({ type: 'annexIframe/getDictList' }); //合同类型
    }, []);

    const getLabel = (list, value) => {
        let item = list.find((item) => item.value == value);
        return item ? item.label : '';
    };

    //选中行
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            let files = [];
            selectedRows.forEach((item) => {
                if (item.fileUrl) {
                    files.push({
                        ...item,
                        labelTitle: getLabel(typeList, item.annexType),
                    });
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
            type: 'annexIframe/getZip',
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
                render: (text) => <div className="whiteSpace">{text}</div>,
            },
            {
                title: '合同类型',
                dataIndex: 'annexType',
                width: 300,
                render: (text) => <div className="whiteSpace">{getLabel(typeList, text)}</div>,
            },
            {
                title: '操作',
                width: 100,
                fixed: 'right',
                render: (text, recode) => (
                    <div className="primaryColor" onClick={() => window.open(recode.fileUrl, '_blank')}>
                        下载
                    </div>
                ),
            },
        ],
        dataSource: list,
        pagination: false,
        bordered: true,
        showSorterTooltip: false,
    };
    return (
        <div>
            <Button className="mb10 mt10" disabled={!selectFiles.length} onClick={downLoadList}>
                打包下载
            </Button>
            <ColumnDragTable
                taskType="MONITOR"
                tableLayout="fixed"
                key={list}
                {...tableProps}
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                scroll={{
                    y: 500,
                    x: list.length > 0 ? 700 : 'auto',
                }}
            ></ColumnDragTable>
        </div>
    );
};

export default connect(({ annexIframe }) => ({
    annexIframe,
}))(index);
