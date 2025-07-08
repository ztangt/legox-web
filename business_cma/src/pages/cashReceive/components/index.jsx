import { Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useRef, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import IPagination from '../../../components/iPagination/iPagination';
import { getColumnsList } from './config';
import DetailModal from './detailModal';
import SearchCom from './searchCom';

const Index = ({ dispatch, cashReceive }) => {
    const { list, currentHeight, currentPage, returnCount, limit, loading } = cashReceive;

    const [columns, setColumns] = useState([]);
    useEffect(() => {
        //获取领用人
        dispatch({ type: `cashReceive/getUserList` });
        let colList = [
            {
                title: '本日详情',
                render: (record) => {
                    return (
                        <div className="primaryColor" onClick={() => handleDetail(record)}>
                            查看
                        </div>
                    );
                },
            },
        ];
        setColumns(getColumnsList(cashReceive, colList, 1));

        dispatch({
            type: 'cashReceive/findLoginUserByIdAndRoleId', //获取管理单位
        });
    }, []);

    useEffect(() => {
        limit > 0 && getList(1, limit);
    }, [limit]);

    //保存表单信息
    const formInfo = useRef({ ...cashReceive.formInfo });
    useEffect(() => {
        formInfo.current = { ...cashReceive.formInfo };
    }, [cashReceive.formInfo]);

    // 现金领用登记列表查询
    const getList = (newStart, newLimit) => {
        dispatch({
            type: 'cashReceive/updateStates',
            payload: { loading: true },
        });
        dispatch({
            type: 'cashReceive/getList',
            payload: { ...formInfo.current, start: newStart, limit: newLimit },
        });
    };
    let [chooseInfo, setChooseInfo] = useState({});
    let [detailShow, setDetailShow] = useState(false);

    const handleDetail = (record) => {
        setChooseInfo(record);
        changeDetailShow(true);
    };

    const changeDetailShow = (isShow) => {
        setDetailShow(isShow);
    };
    const changePage = (nextPage, size) => {
        if (size !== limit) {
            dispatch({
                type: 'cashReceive/updateStates',
                payload: { limit: size },
            });
        } else {
            getList(nextPage, size);
        }
    };

    return (
        <Spin spinning={loading}>
            <SearchCom getList={getList} />
            <ColumnDragTable
                listHead={'cashReceive_list_head'}
                rowKey={'receiveUserId'}
                taskType="MONITOR"
                tableLayout="fixed"
                modulesName="cashReceive"
                scroll={{ y: currentHeight }}
                dataSource={list}
                pagination={false}
                showSorterTooltip={false}
                columns={columns}
                bordered
            />
            <IPagination
                current={currentPage}
                total={returnCount}
                onChange={changePage}
                pageSize={limit}
                isRefresh={true}
                refreshDataFn={() => {
                    getList(currentPage, limit);
                }}
            />

            {/* 领用详情弹窗 */}
            {detailShow && <DetailModal changeVisible={changeDetailShow} info={chooseInfo} />}
        </Spin>
    );
};

export default connect(({ cashReceive }) => ({
    cashReceive,
}))(Index);
