import IPagination from '@/components/iPagination/iPagination';
import { connect } from 'dva';
import qs from 'qs';
import { useEffect } from 'react';
import { history } from 'umi';
import ColumnDragTable from '../../components/columnDragTable';

const index = ({ dispatch, downloadIframe }) => {
    const { list, currentPage, returnCount, limit } = downloadIframe;

    useEffect(() => {
        getList(1, limit);
    }, []);

    const getList = (newStart, newLimit) => {
        let str = history.location.search.split('?')[1] || '';
        const { projectCode = '', fileTypeTldt = '' } = qs.parse(str);
        dispatch({
            type: 'downloadIframe/getList',
            payload: { start: newStart, limit: newLimit, projectCode, fileTypeTldt },
            // payload: { start: newStart, limit: newLimit,projectCode:'zzzzz',fileTypeTldt:0 },
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
                title: '文件类型',
                dataIndex: 'fileType',
                width: 100,
            },
            {
                title: '操作',
                width: 100,
                fixed: 'right',
                render: (text, recode) => (
                    <div className="primaryColor" onClick={() => window.open(recode.fileDownloadUrl, '_blank')}>
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
    //切换分页
    const changePage = (nextPage, size) => {
        getList(nextPage, size);
    };
    return (
        <div className="pt8 pl8 pr8" style={{ height: '580px', position: 'relative' }}>
            <ColumnDragTable taskType="MONITOR" tableLayout="fixed" key={list} {...tableProps} />
            <IPagination
                current={currentPage}
                total={returnCount}
                onChange={changePage}
                pageSize={limit}
                showSizeChanger={false}
                isRefresh={true}
                refreshDataFn={() => {
                    getList(currentPage, limit);
                }}
            />
        </div>
    );
};

export default connect(({ downloadIframe }) => ({
    downloadIframe,
}))(index);
