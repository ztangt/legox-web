import { Button, message, Table } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import GlobalModal from '../../../GlobalModal';

function ChooseTaskActModal({ dispatch, oneKeyApprove, onClose }) {
    const { selectTargetActInfo, taskNodes } = oneKeyApprove;
    const [beginSelectKeys, setBeginSelectKeys] = useState('');
    // 初始化
    useEffect(() => {
        // 备份初始选中项

        //console.log('selectTargetActInfo', selectTargetActInfo);

        setBeginSelectKeys(_.cloneDeep(selectTargetActInfo.selectedActIds.sort().join()));
    }, []);

    // 确认事件
    function ok() {
        let selectKeys = selectTargetActInfo.selectedActIds;
        if (selectKeys.length === 0) {
            return message.error('请选择送审环节！');
        }
        let isReload = beginSelectKeys !== selectKeys.sort().join();
        if (isReload) {
            taskNodes[selectTargetActInfo.bizTaskId].selectTaskActs = selectKeys;
            console.log('update taskNodes = ', taskNodes);
            dispatch({
                type: 'oneKeyApprove/updateStates',
                payload: {
                    taskNodes: taskNodes,
                },
            });
        }
        onClose && onClose(isReload);
    }

    // 表格属性
    const tableProps = {
        rowKey: 'actId',
        columns: [{ title: '送审环节', dataIndex: 'actName' }],
        rowSelection: {
            type: selectTargetActInfo.actType === 'exclusiveGateway' ? 'radio' : 'checkbox',
            selectedRowKeys: selectTargetActInfo.selectedActIds,
            onChange: (selectedRowKeys, selectedRows) => {
                let selectedKeys = [];

                if (selectedRows) {
                    let current = selectedRows[selectedRows.length - 1];
                    selectedRows.forEach((item) => {
                        if (item.freeFlag == current.freeFlag) {
                            selectedKeys.push(item.actId);
                        }
                    });
                }

                selectTargetActInfo.selectedActIds = selectedKeys.length != 0 ? selectedKeys : selectedRowKeys;
                dispatch({
                    type: 'oneKeyApprove/updateStates',
                    payload: {
                        selectTargetActInfo: selectTargetActInfo,
                    },
                });
            },
        },
    };

    return (
        <div>
            <GlobalModal
                visible={true}
                title={'送审环节'}
                onCancel={() => onClose()}
                modalSize={'middle'}
                // modalType={'layout'}
                // widthType={1}
                footer={[
                    <Button onClick={() => onClose()}>取消</Button>,
                    <Button type="primary" htmlType="submit" onClick={() => ok()}>
                        确定
                    </Button>,
                ]}
                getContainer={() => {
                    return document.getElementById('dom_container') || false;
                }}
                mask={false}
                maskClosable={false}
            >
                {/* 表格 */}
                <Table
                    rowKey={tableProps.rowKey}
                    rowSelection={tableProps.rowSelection}
                    columns={tableProps.columns}
                    dataSource={selectTargetActInfo.taskActList}
                    pagination={false}
                    size="small"
                    bordered
                />
            </GlobalModal>
        </div>
    );
}

export default connect(({ oneKeyApprove }) => ({ oneKeyApprove }))(ChooseTaskActModal);
