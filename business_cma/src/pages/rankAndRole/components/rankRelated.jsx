import { connect } from 'dva';
import { useEffect, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import { BASE_WIDTH } from '../../../util/constant';
import styles from '../index.less';
import { configData } from './config';
import SearchLine from './searchLine';

const RankRelated = ({ dispatch, location, rangAndRole }) => {
    const { currentHeight, rankList, currentPage, returnCount, limit, searchContent } = rangAndRole;
    const [selectRowKey, setSelectRowKey] = useState([]);
    useEffect(() => {
        getTableList('', 1, limit);
    }, [limit]);
    // 获取table 列表数据
    const getTableList = (searchContent = '', currentPage = 1, limit = limit) => {
        dispatch({
            type: 'rangAndRole/getRankTableList',
            payload: {
                searchWord: searchContent,
                limit,
                start: currentPage,
            },
        });
    };
    // 页面改变
    const changePage = (nextPage, size) => {
        getTableList(searchContent, nextPage, size);
    };

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectRowKey(selectedRows);
        },
    };
    const tableProps = {
        rowKey: 'id',
        columns: [
            {
                title: '序号',
                dataIndex: 'number',
                width: 60,
            },
            {
                title: '职级名称',
                dataIndex: 'cmaPositionLevel',
                render: (text) => (
                    <div className={styles.titleName} title={text}>
                        {<span>{configData.rankLevel[text]} </span>}
                    </div>
                ),
            },
            {
                title: '角色名称',
                dataIndex: 'roleName',
                width: BASE_WIDTH * 1.5,
            },
            {
                title: '角色编码',
                dataIndex: 'roleCode',
            },
            {
                title: '角色简称',
                dataIndex: 'roleTag',
            },
            {
                title: '角色描述',
                dataIndex: 'roleDesc',
            },
        ],
        dataSource:
            rankList &&
            rankList.length > 0 &&
            rankList.map((item, index) => {
                item.number = index + 1;
                return item;
            }),
        pagination: false,
        bordered: true,
        showSorterTooltip: false,
    };

    return (
        <div className="common_container" id="dom_container_cma">
            <div>
                <SearchLine getTableList={getTableList} selectRowKey={selectRowKey} />
            </div>
            <div>
                <ColumnDragTable
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    taskType="MONITOR"
                    tableLayout="fixed"
                    modulesName="rangAndRole"
                    {...tableProps}
                    scroll={{ y: currentHeight }}
                ></ColumnDragTable>
            </div>
            <IPagination
                current={Number(currentPage)}
                total={returnCount}
                onChange={changePage}
                pageSize={limit}
                isRefresh={true}
                refreshDataFn={() => {
                    getTableList(searchContent, currentPage, limit);
                }}
            />
        </div>
    );
};

export default connect(({ rangAndRole, layoutG }) => ({
    rangAndRole,
    layoutG,
}))(RankRelated);
