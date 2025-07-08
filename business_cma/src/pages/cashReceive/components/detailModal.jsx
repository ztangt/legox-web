import { Button } from 'antd';
import 'dayjs/locale/zh-cn';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import ColumnDragTable from '../../../components/columnDragTable';
import GlobalModal from '../../../components/GlobalModal';
import { getColumnsList } from './config';
const DetailModal = ({ dispatch, cashReceive, changeVisible, info }) => {
    const { detailList, formInfo } = cashReceive;
    const [curHeight, setCurHeight] = useState(0);
    const [columns, setColumns] = useState([]);
    useEffect(() => {
        let height = document.getElementById('cashReceive_modal_container')?.clientHeight - 50;
        setCurHeight(height);
        // 现金领用详情查询
        dispatch({
            type: `cashReceive/getDetailList`,
            payload: {
                businessDate: formInfo.businessDate,
                receiveUserId: info.receiveUserId,
            },
        });

        setColumns(getColumnsList(cashReceive, [], 2));
    }, []);

    return (
        <div>
            <GlobalModal
                title="现金领用详情"
                open={true}
                footer={[
                    <Button key="back" onClick={() => changeVisible(false)}>
                        取消
                    </Button>,
                ]}
                onCancel={() => changeVisible(false)}
                centered
                getContainer={() => {
                    return document.getElementById(`dom_container-panel-${GET_TAB_ACTIVITY_KEY()}`) || false;
                }}
                maskClosable={false}
                mask={false}
                modalSize="middle"
            >
                <div id={'cashReceive_modal_container'} className="height_100">
                    <ColumnDragTable
                        taskType="MONITOR"
                        tableLayout="fixed"
                        rowKey={'id'}
                        columns={columns}
                        dataSource={detailList}
                        pagination={false}
                        showSorterTooltip={false}
                        bordered
                        scroll={{ y: curHeight }}
                    />
                </div>
            </GlobalModal>
        </div>
    );
};

export default connect(({ cashReceive }) => ({ cashReceive }))(DetailModal);
