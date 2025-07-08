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

const Index = ({ dispatch, demoList }) => {
    const [isShowHighSearch, setIsShowHighSearch] = useState(false);
    const [selectRowKey, setSelectRowKey] = useState({}); // 选中行的主键ID集合 arr
    const [selectRows, setSelectRows] = useState([]); // 选中行的all data
    const { currentHeight, currentPage, limit, returnCount, companyList } = demoList;
    console.log('companyList1', companyList);

    useEffect(() => {
        // getCompanyList();
    }, []);

    useEffect(() => {
        // limit有值再请求接口
        limit && getDemoList();
    }, [currentPage, limit]); // 依赖项[xx]改变 getDemoList重新执行

    // TODO 接口替换getDemoList
    function getDemoList() {
        console.log('请求列表一下子');
        // dispatch({
        //   type: `demoList/getDemoList`,
        //   payload: {
        //     start: currentPage,
        //     limit: limit,
        //   },
        // });
    }
    function getCompanyList() {
        dispatch({
            type: `demoList/getCompanyList`,
            payload: {
                xxx: '',
            },
        });
    }

    // TODO maObj 接口获取
    const maObj = {
        0: '码值0',
        1: '码值1',
        2: '码值2',
        3: '码值3',
        4: '码值4',
    };

    // TODO list 接口获取
    const list = [
        {
            id: 0,
            mainId: '0',
            btlmc: '标题类名称0',
            bmlmc: '编码类名称0',
            date: '2222-11-22',
            mzl: '0',
            money: '12.000000',
            dieID: '119',
        },
        {
            id: 1,
            btlmc: '标题类名称1',
            bmlmc: '编码类名称1',
            date: '2222-11-22',
            mzl: '1',
            money: '222.443100',
            dieID: '119',
        },
        {
            id: 2,
            btlmc: '标题类名称2',
            bmlmc: '编码类名称2',
            date: '2222-11-22',
            mzl: '2',
            money: '877.345000',
            dieID: '119',
        },
        {
            id: 3,
            btlmc: '标题类名称3',
            bmlmc: '编码类名称3',
            date: '2222-11-22',
            mzl: '3',
            money: '447.345000',
            dieID: '11191111',
        },
        {
            id: 4,
            btlmc: '标题类名称4',
            bmlmc: '编码类名称4',
            date: '2222-11-22',
            mzl: '4',
            money: '997.345000',
            dieID: '11191111',
        },
    ];
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
                title: '标题类',
                dataIndex: 'btlmc',
                width: BASE_WIDTH * 2.5,
                render: (text) => (
                    <div className={styles.titleName} title={text}>
                        {text}
                    </div>
                ),
            },
            {
                title: '编码类',
                dataIndex: 'bmlmc',
                width: BASE_WIDTH * 1.5,
            },
            {
                title: '时间类',
                dataIndex: 'date',
            },
            {
                dataIndex: 'money',
                title: '金额类',
                align: 'right',
                render: (text, record) => (
                    <a
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('money');
                        }}
                    >
                        {formattingMoney(text)}
                    </a>
                ),
            },
            {
                title: '码值类',
                dataIndex: 'mzl',
                render: (text) => <div>{maObj[text]}</div>,
            },
            {
                dataIndex: 'suibianqimingzi',
                title: '操作类',
                render: (text, record) => (
                    <>
                        <a
                            className="_margin_right_8"
                            onClick={(e) => {
                                console.log('操作1', record.id);
                                Modal.confirm({
                                    title: '提示',
                                    content: `确认删除？`,
                                    okText: '确定',
                                    getContainer: () => {
                                        return (
                                            document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) ||
                                            false
                                        );
                                    },
                                    maskClosable: false,
                                    mask: false,
                                    onOk() {
                                        // TODO  req
                                        dispatch({
                                            type: `demoList/delItem`,
                                            payload: {
                                                id: record.id,
                                            },
                                            callback: () => {
                                                // TODO 刷新列表
                                                // getDemoList()
                                            },
                                        });
                                    },
                                });
                            }}
                        >
                            删除
                        </a>
                        <a
                            onClick={(e) => {
                                console.log('操作2', record.id);
                            }}
                        >
                            操作2
                        </a>
                    </>
                ),
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

    // 高级显隐
    const showHigherForm = (isShow) => {
        setIsShowHighSearch(!isShow);
    };

    // 基础搜索
    const baseFindCallback = (value, list) => {
        console.log('基础搜索回调：', value);
        // TODO request
    };

    // 高级搜索
    const higherFindCallback = (value, list) => {
        console.log('高级搜索：', value);
        const { title, name2 } = value;
        // TODO 更新model里的state值
        // dispatch({
        //   type: `demoList/updateStates`,
        //   payload: {
        //     currentPage: 1
        //   },
        // });
        // dispatch({
        //   type: `demoList/getDemoList`,
        //   payload: {
        //     start: 1,
        //     limit: limit,
        //     title: title,
        //     x1: name2
        //   },
        // });
    };

    // 分页改变
    const changePage = (nextPage, size) => {
        console.log(nextPage, size);
        dispatch({
            type: `demoList/updateStates`,
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
                {/* 替换 */}
                <SearchLine
                    selectRows={selectRows}
                    companyList={companyList}
                    selectRowKey={selectRowKey}
                    showHigherForm={showHigherForm}
                    baseFindCallback={baseFindCallback}
                    higherFindCallback={higherFindCallback}
                />
            </div>
            {/* 列表 替换 */}
            <div className={styles.tableList}>
                <ColumnDragTable
                    {...tableProps}
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    isShowHighSearch={isShowHighSearch}
                    taskType="MONITOR"
                    tableLayout="fixed"
                    key={isShowHighSearch}
                    className={styles.table}
                    modulesName="demoList"
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
                    getDemoList(currentPage, limit);
                }}
            />
        </div>
    );
};
export default connect(({ demoList }) => ({
    demoList,
}))(Index);
