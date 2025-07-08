import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import GlobalModal from '../../../components/GlobalModal';
import InputSearch from '../../../components/inputSearch';

import { connect } from 'dva';
import styles from '../index.less';
import { getColumnsList } from './config';

const Index = ({ dispatch, paymentMethod, changeVisible, getInfo }) => {
    const [columns, setColumns] = useState([]);
    //初始化columns
    useEffect(() => {
        setColumns(getColumnsList(paymentMethod, null, 2));
    }, []);

    const { payList, payLimit, payReturnCount, payCurrentPage, payAllPage } = paymentMethod;
    const [checkNo, setCheckNo] = useState('');

    useEffect(() => {
        getList('', 1);
    }, []);

    const getList = (checkNu, start) => {
        dispatch({
            type: 'paymentMethod/getNewCheckNumberList',
            payload: {
                start: start,
                limit: payLimit,
                checkNo: checkNu,
            },
        });
        changeSelect([], []);
    };
    const [selectRows, setSelectRows] = useState([]); // 选中行的all data
    const [selectRowKeys, setSelectRowKeys] = useState(); // 选中行的key

    const changeSelect = (rowKeys = [], rows = []) => {
        setSelectRowKeys(rowKeys);
        setSelectRows(rows);
    };
    //分页
    const changePage = (nextPage, size) => {
        getList(checkNo, nextPage);
    };

    const onSearch = (value, _e, info) => {
        setCheckNo(value);
        getList(value, payCurrentPage);
    };

    //确认选择
    const onConfirm = () => {
        if (selectRows.length === 1) {
            getInfo(selectRows[0]);
            changeVisible(false);
        } else {
            Modal.error('请选择一个支票号');
        }
    };
    return (
        <div>
            <GlobalModal
                title="信息"
                open={true}
                top={'2%'}
                getContainer={() => {
                    return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                }}
                onCancel={() => changeVisible(false)}
                footer={[
                    <Button onClick={() => changeVisible(false)}>取消</Button>,
                    <Button type="primary" onClick={onConfirm}>
                        选择
                    </Button>,
                ]}
                maskClosable={false}
                mask={false}
                modalSize="middle"
            >
                <div className={styles.payModalCopy}>
                    <InputSearch
                        onSearch={onSearch}
                        style={{ width: '360px' }}
                        className="mb10"
                        placeholder="请输入支票号"
                    />
                    <ColumnDragTable
                        rowSelection={{
                            type: 'radio',
                            onChange: (rowKeys, rows) => {
                                let { checkNo } = rows[0];
                                changeSelect(checkNo, rows);
                            },
                            selectRowKeys: selectRowKeys,
                        }}
                        rowKey={'ID'}
                        taskType="MONITOR"
                        tableLayout="fixed"
                        columns={columns}
                        dataSource={payList}
                        scroll={{ y: 1500 }}
                        pagination={{
                            current: payCurrentPage,
                            total: payReturnCount,
                            pageSize: payLimit,
                            onChange: changePage,
                        }}
                    />
                </div>
            </GlobalModal>
        </div>
    );
};

export default connect(({ paymentMethod }) => ({ paymentMethod }))(Index);
