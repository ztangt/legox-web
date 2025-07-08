import React, { useState } from 'react'
import { connect } from 'dva'
import { Modal, message, Button, Table,Form,Col,Row } from 'antd'
import GlobalModal from '../../../componments/GlobalModal'
import { TASKSTATUS, BIZSTATUS, TODOBIZSTATUS, DETAILTASKSTATUS } from '../../../service/constant.js';
import ChangeUser from '../../../componments/formShow/changeUser';
import { dataFormat, replaceGTPU } from '../../../util/util';
import {BASE_WIDTH,ORDER_WIDTH} from '../../../util/constant'
import ColumnDragTable from '../../../componments/columnDragTable/index';
import styles from './activateNodeModal.less';
function transferModal({ dispatch, setParentState, parentState,loading }) {
    const { transferId, detailData } = parentState
    const [isShowRelevance, setIsShowRelevance] = useState(false);
    const layouts = { labelCol: { span: 6}, wrapperCol: { span: 18 } };
    const onVisible = () => {
      setParentState({
        isTransfer: false
      })
    }
    const showChangeDo = () => {
        console.log(transferId, 'transferId');
        if (!transferId) {
            message.error('请选择一条数据')
        } else {
            setIsShowRelevance(true)
        }

    }
    const handelCancel = () => {
        setIsShowRelevance(false)
        setParentState({
          selectedRowKeys: [],
          isTransfer: false,
          bizSigns: [],
          selectedDataIds: [],
          transferId: ''
        })
    }
    const tableProps = {
        rowKey: 'bizTaskId',
        columns: [
            {
                title: '环节名称',
                dataIndex: 'actName',
                width:BASE_WIDTH,
                render: text => <div className={styles.ellipsis} title={text}>{text}</div>
            },
            {
                title: '办理环节',
                dataIndex: 'suserName',
                width:BASE_WIDTH,
                render: (text, obj) => {
                    return (
                        <div className={styles.ellipsis}>
                            {`${text}-->`}
                            {obj.makeAction == 'SEND' ? '' : <span style={{ color: 'red' }}>{DETAILTASKSTATUS[obj.makeAction]}</span>}
                            {obj.makeAction == 'SEND' || obj.makeAction == 'DRAFT' ? '' : '-->'}
                            {obj.makeAction != 'DRAFT' ? obj.ruserName : ""}
                            <br />
                            {obj.agentUserName ? `${obj.agentUserName}代办` : ''}
                        </div>
                    )
                }
            },
            {
                title: '办理人单位',
                dataIndex: 'ruserOrgName',
                width:BASE_WIDTH*1.5,
                render: text => <div className={styles.ellipsis} title={text}>{text ? replaceGTPU(text) : ""}</div>
            },
            {
                title: '送达时间',
                dataIndex: 'startTime',
                width:BASE_WIDTH,
                render: text => <span className={styles.ellipsis}> {dataFormat(text, 'YYYY-MM-DD HH:mm:ss')} </span>
            },
            {
                title: '完成时间',
                dataIndex: 'endTime',
                width:BASE_WIDTH,
                render: (text, row) => <span className={styles.ellipsis}> {row.taskStatus == 3 ? '' : dataFormat(text, 'YYYY-MM-DD HH:mm:ss') }</span>
            },
            {
                title: '办理状态',
                dataIndex: 'taskStatus',
                width:BASE_WIDTH,
                render: text => <span className={styles.ellipsis}>{ text == 0 ? '未收未办' : text == 1 ? '已收未办' : text == 2 ? '已收已办' : text == 3 ? '已追回' : '' }</span>
            },
            {
                title: '意见',
                dataIndex: 'signList',
                width:BASE_WIDTH*2.5,
                render: (text) => {
                    return (
                        <ul className={styles.ellipsis}>
                            {text.map((item) => {
                                return <li style={{ listStyleType: 'disc' }}>
                                    {item.messageText}{item.messageImgUrl ? <img src={item.messageImgUrl} width={30} /> : ''}
                                </li>
                            })
                            }
                        </ul>
                    )
                }
            }
        ],
        dataSource: detailData.tasks,
        pagination: false,
        rowSelection: {
            type: 'radio',
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                setParentState({
                  transferId: `${selectedRowKeys}`
                })
            },
            getCheckboxProps: (record) => ({
                disabled: record.taskStatus == '2' || record.taskStatus == '3',
                // Column configuration not to be checked
                name: record.taskStatus == 0 ? '未收未办' : record.taskStatus == 1 ? '已收未办' : record.taskStatus == 2 ? '已收已办' : record.taskStatus == 3 ? '已追回' : '',
            }),
        }
    }
    return (
        <div>
            <GlobalModal
                widthType={3}
                visible={true}
                // width={800}
                // bodyStyle={{height:400,overFlow:'auto'}}
                title={'转办'}
                onCancel={onVisible.bind(this, false)}
                maskClosable={false}
                mask={false}
                // onOk={onSave.bind(this)}
                incomingHeight={450}
                getContainer={() => {
                    return document.getElementById('monitorWork_container')
                }}
                footer={
                    [
                        <Button onClick={onVisible.bind(this, false)}>取消</Button>,
                        <Button onClick={showChangeDo.bind(this)} loading={loading.global}>转办</Button>,
                    ]
                }
            >
                <div className={styles.handle_detail}>
                  {/* <Descriptions title={'办理详情'}  style={{textAlign:'center'}}>
                  </Descriptions> */}
                  <p style={{textAlign:'center',fontWeight:'bolder'}}>办理详情</p>
                  <Form>
                    <Row gutter={0}>
                      <Col span={12}>
                        <Form.Item label='任务名称' {...layouts}>
                        <span>{detailData?.bizInfo.bizTitle}</span>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label='业务状态' {...layouts}>
                        <span>{detailData.bizInfo.bizStatus == '0' ? '待发' : detailData.bizInfo.bizStatus == '1' ? '待办' : detailData.bizInfo.bizStatus == '2' ? '办结' : ''}</span>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={0}>
                       <Col span={12}>
                       <Form.Item label='开始时间' {...layouts}>
                          <span>{dataFormat(detailData.bizInfo.startTime, 'YYYY-MM-DD HH:mm:ss')}</span>
                        </Form.Item>
                       </Col>
                       <Col span={12}>
                       <Form.Item label='结束时间' {...layouts}>
                          <span>{dataFormat(detailData.bizInfo.endTime, 'YYYY-MM-DD HH:mm:ss')}</span>
                        </Form.Item>
                       </Col>
                    </Row>
                    <Row gutter={0}>
                       <Col span={12}>
                       <Form.Item label='拟稿人名称' {...layouts}>
                          <span>{detailData.bizInfo.draftUserName}</span>
                        </Form.Item>
                       </Col>
                       <Col span={12}>
                       </Col>
                    </Row>
                  </Form>
                </div>
                {/* <div style={{ marginTop: '10px' }}>
                    <p style={{ height: '30px', textAlign: 'center', lineHeight: '30px', marginBottom: '10px' }}>办理详情</p>
                    <div className={styles.manage}>
                        <div style={{ borderBottom: 'none', width: "50%" }}><p>任务名称</p><p>{detailData?.bizInfo.bizTitle}</p></div>
                        <div style={{ borderBottom: 'none', width: "50%", borderRight: "1px solid #ccc" }}>
                            <p>业务状态</p>
                            <p>{detailData.bizInfo.bizStatus == '0' ? '待发' : detailData.bizInfo.bizStatus == '1' ? '待办' : detailData.bizInfo.bizStatus == '2' ? '办结' : ''}</p>
                        </div>
                        <div><p>开始时间</p><p>{dataFormat(detailData.bizInfo.startTime, 'YYYY-MM-DD HH:mm:ss')}</p></div>
                        <div><p>结束时间</p><p>{dataFormat(detailData.bizInfo.endTime, 'YYYY-MM-DD HH:mm:ss')}</p></div>
                        <div style={{ borderRight: "1px solid #ccc" }}><p>拟稿人名称</p><p>{detailData.bizInfo.draftUserName}</p></div>
                    </div>
                </div> */}
                <div style={{ marginTop: '10px' }}>
                    <p style={{ height: '30px', textAlign: 'center', lineHeight: '30px', marginBottom: '10px' ,fontWeight:'bolder'}}>流转详情</p>
                    <ColumnDragTable {...tableProps} key={loading}  />
                </div>
            </GlobalModal>
            {isShowRelevance &&
                <ChangeUser
                    // location={location}
                    handelCancel={handelCancel}
                    bizTaskIds={transferId}
                    spaceInfo={parentState}
                    nameSpace={'monitorWork'}
                    getContainerId={'monitorWork_container'}
                    setParentState={setParentState}
                />
            }
        </div>
    )
}
export default connect(({ monitorWork, loading }) => { return { monitorWork, loading } })(transferModal);
