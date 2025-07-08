import GlobalModal from '@/components/GlobalModal';
import { formatSeconds } from '@/util/util';
import { Button, Col, Form, Input, message, Row, Space, Table } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import styles from '../index.less';

function Index({ dispatch, summaryList, divId, downloadHandle }) {
    console.log('summaryList', summaryList);

    // 关闭弹窗
    const onCancel = () => {
        dispatch({
            type: 'pmAttachment/updateStates',
            payload: {
                showDownloadModal: false,
            },
        });
    };

    const columns = [
        {
            title: '文件类型',
            dataIndex: 'processStatusName',
        },
        {
            title: '操作',
            dataIndex: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a>详情</a>
                    <a
                        onClick={() => {
                            downloadHandle(record);
                        }}
                    >
                        下载({record.count})
                    </a>
                </Space>
            ),
        },
    ];

    return (
        <GlobalModal
            title={'下载'}
            open={true}
            onCancel={onCancel}
            maskClosable={false}
            mask={false}
            getContainer={() => {
                return document.getElementById(divId) || false;
            }}
            modalSize="smallBigger"
            footer={[
                <Button
                    onClick={() => {
                        downloadHandle();
                    }}
                >
                    打包下载
                </Button>,
                <Button
                    onClick={() => {
                        onCancel();
                    }}
                >
                    关闭
                </Button>,
            ]}
        >
            <div className="flex flex_align_start flex_justify_between">
                {/* <table>
                    <tr>
                        <td>文件类型</td>
                        <td>操作</td>
                    </tr>
                    {summaryList.map(item => {
                        <tr>
                            <td>{item.processStatusName}</td>
                            <td>
                                <Space size="middle">
                                    <a>详情 {item.processStatusName}</a>
                                    <a>下载（{item.count}）</a>
                                </Space>
                            </td>
                        </tr>
                    })}

                </table> */}
                <Table
                    columns={columns}
                    dataSource={summaryList}
                    pagination={false}
                    rowKey={(record) => `${record.id}`}
                    scroll={{ x: 'auto' }}
                />
            </div>
        </GlobalModal>
    );
}

export default connect(({ pmAttachment }) => ({
    pmAttachment,
}))(Index);
