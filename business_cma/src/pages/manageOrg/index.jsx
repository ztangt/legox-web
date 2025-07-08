import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Modal, message } from 'antd';
import styles from './index.less';
import SearchLine from './components/searchLine';
import ColumnDragTable from '../../components/columnDragTable';
import IPagination from '../../components/iPagination/iPagination';

import { formattingMoney } from '../../util/util';
import { ORDER_WIDTH, BASE_WIDTH } from '../../util/constant';

// * antd组件库地址  https://4x.ant.design/components/overview-cn/

const Index = ({ dispatch, manageOrg }) => {
    const [selectRowKey, setSelectRowKey] = useState({}); // 选中行的主键ID集合 arr
    const [selectRows, setSelectRows] = useState([]); // 选中行的all data
    const { currentHeight, currentPage, limit, returnCount, list } = manageOrg;

    useEffect(() => {}, []);

    useEffect(() => {
        // limit有值再请求接口
        limit && getManageOrgList();
    }, [currentPage, limit]); // 依赖项[xx]改变 getManageOrgList重新执行

    // TODO 接口替换getManageOrgList
    function getManageOrgList(searchWord) {
        console.log('请求列表一下子');
        dispatch({
            type: `manageOrg/getManageOrgList`,
            payload: {
                searchWord: searchWord,
                start: currentPage,
                limit: limit,
            },
        });
    }

    // TODO 管理类型码值
    const manageTypeObj = {
        1: '单位',
        2: '人员',
    };

    // TODO 单位类型码值
    const orgKindObj = {
        ORG: '单位',
        DEPT: '部门',
    };

    const tableProps = {
        // TODO 主键 按需修改
        rowKey: 'id',
        // TODO columns 按需修改
        columns: [
            {
                title: '序号',
                dataIndex: 'number',
                width: ORDER_WIDTH,
            },
            {
                title: '管理类型',
                dataIndex: 'manageType',
                render: (text) => <div>{manageTypeObj[text]}</div>,
            },
            {
                title: '用户名称',
                dataIndex: 'userName',
                width: BASE_WIDTH * 1.5,
            },
            {
                title: '单位名称',
                dataIndex: 'orgName',
                width: BASE_WIDTH * 1.5,
            },
            {
                title: '单位类型',
                dataIndex: 'orgKind',
                render: (text) => <div>{orgKindObj[text]}</div>,
            },
        ],
        // 数据源
        dataSource:
            list &&
            list.length > 0 &&
            list.map((item, index) => {
                item.number = index + 1;
                return item;
            }),
        // table自带分页器 这里不用 用自定义的
        pagination: false,
        // 边框
        bordered: true,
    };

    // 基础搜索
    const baseFindCallback = (value, list) => {
        console.log('基础搜索回调：', value, list, selectRowKey, selectRows);
        getManageOrgList(value.searchWord);
        // TODO request
    };

    // 分页改变
    const changePage = (nextPage, size) => {
        dispatch({
            type: `manageOrg/updateStates`,
            payload: {
                currentPage: nextPage,
                limit: size,
            },
        });
    };

    const rowSelection = {
        // 选择框勾选 ☑️
        onChange: (selectedRowKeys, selectedRows) => {
            // console.log(list,selectedRows);
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectRows(selectedRows);
            setSelectRowKey(selectedRowKeys);
        },
    };
    return (
        <div className="common_container" id="dom_container_cma">
            {/* 查询项 */}
            <div className="_padding_left_right_16">
                <SearchLine selectRows={selectRows} selectRowKey={selectRowKey} baseFindCallback={baseFindCallback} />
            </div>
            {/* 列表 */}
            <div className={styles.tableList}>
                <ColumnDragTable
                    {...tableProps}
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    taskType="MONITOR"
                    tableLayout="fixed"
                    className={styles.table}
                    modulesName="manageOrg"
                    scroll={{ y: currentHeight, x: list.length > 0 ? '1600px' : 'auto' }}
                />
            </div>
            {/* 分页 */}
            <IPagination
                current={Number(currentPage)}
                total={returnCount || 1}
                onChange={changePage}
                pageSize={limit}
                isRefresh={true}
                refreshDataFn={() => {
                    getManageOrgList(currentPage, limit);
                }}
            />
        </div>
    );
};
export default connect(({ manageOrg }) => ({
    manageOrg,
}))(Index);
