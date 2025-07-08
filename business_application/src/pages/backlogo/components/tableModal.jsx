import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import {history} from 'umi'
import { Table, Divider, Input, Space, Button, message } from 'antd';
import { dataFormat } from '../../../util/util';
import  BacklogoModal from '../../../componments/backlogoModal'
import IPagination from '../../../componments/public/iPagination';
import {BASE_WIDTH} from '../../../util/constant'
import ColumnDragTable from '../../../componments/columnDragTable';
import styles from './index.less'
const Index = ({ dispatch, backlogo, keyWords,location }) => {
    const messageSort = ['事项提醒', '日常消息', '即时通讯', '系统', '其它']
    // const [isModalVisible, setIsModalVisible] = useState(false);;
    // const [item, setItem] = useState(null)
    const { list, returnCount, searchWord, category, limit, currentPage, selectedRowKeys,unreadLength,currentHeight,isModalVisible,sysItem ,currentType} = backlogo
    useEffect(() => {
        getMessageList(searchWord, keyWords, 1, limit,)
    }, [limit])
    const getMessageList = (searchWord, category, start, limit,) => {
        dispatch({
            type: 'backlogo/getMessageList',
            payload: {
                searchWord,
                category,
                start,
                limit,
            }
        })
    }
    const searchWordFn = () => {
        dispatch({
            type: 'backlogo/updateStates',
            payload: {
                currentPage: 1
            }
        })
        getMessageList(searchWord, keyWords, 1, limit,)
    };
    const onChangeValue = (e) => {
        dispatch({
            type: 'backlogo/updateStates',
            payload: {
                searchWord: e.target.value
            }
        })
        if(e.type=='click'){
            getMessageList('', keyWords, currentPage, limit,)
        }
    };
    const changeStatus = (ids) => {
        if (selectedRowKeys.length > 0) {
            dispatch({
                type: 'backlogo/putMessage',
                payload: {
                    msgIds: ids.join(',')
                },
                callback:()=>{
                    getMessageList(searchWord, keyWords, currentPage, limit,)
                }
            })
            dispatch({
                type:'user/updateStates',
                payload:{
                    msgLength:unreadLength
                }
            })
        }
        else {
            message.warning('请选择')
        }
    }
    const showDetailModal = (record) => {
        const params = JSON.parse(record.targetParam)
        // const pattern = /【(.*?)】/g;
        // const matches = record.msgTitle.match(pattern);
        var maxDataruleCodes = JSON.parse(
            localStorage.getItem('maxDataruleCodes') || '{}',
        );
        var maxDataruleCode = maxDataruleCodes[location.pathname]|| '';
        if (keyWords == "MATTER" || (keyWords.length==0&&record.msgCategory=='MATTER')) {
            historyPush({
                pathname: '/waitMatter/formShow', query: {
                    bizInfoId: params.bizInfoId,
                    bizSolId: params.bizSolId,
                    bizTaskId: params.bizTaskId,
                    id: params.mainTableId,
                    title:params.bizTitle,
                    maxDataruleCode,
                }
            })
        }
        else if (keyWords == 'SYS'||(keyWords.length==0&&record.msgCategory=='SYS')) {
            dispatch({
                type:'backlogo/updateStates',
                payload:{
                    isModalVisible:true,
                    sysItem:record,
                    currentType:'page',
                }
            })
            // setIsModalVisible(true);
            // setItem(record)
        }else if(record.msgType=='DAILY_NOTICE'){
            dispatch({
                type: 'notification/addViewsNotice',
                payload: {
                noticeId: params.noticeId,
                },
            });
            historyPush({
                pathname: '/noticePage',
                query: {
                title: '查看',
                id: params.noticeId,
                },
            });
        }else if(params.scheduleCount){
            historyPush({
                pathname: '/calendarMg',
            })

        }
        dispatch({
            type: 'backlogo/putMessage',
            payload: {
                msgIds: record.msgId
            },
            callback:()=>{
                getMessageList(searchWord, keyWords, currentPage, limit,)
            }
        })
        dispatch({
            type:'user/updateStates',
            payload:{
                msgLength:unreadLength
            }
        })
    }
    const changePage=(page,size)=>{
        dispatch({
            type: 'backlogo/updateStates',
            payload: {
                limit: size,
                currentPage:page
            }

        })
        getMessageList(searchWord, keyWords, page, size,)
    }
    const tableProps = {
        rowKey: 'msgId',
        columns: [
            {
                title: '序号',
                dataIndex: 'number',
                width:60
            },
            {
                title: '消息内容',
                dataIndex: 'msgTitle',
                width: BASE_WIDTH*2.5,
                render: (text, record) => <a onClick={() => { showDetailModal(record) }} className={styles.msgTitle} title={text}>{text}</a>,
            },
            {
                title: '状态',
                dataIndex: 'msgStatus',
                width:100,
                render: (text) => <>{text == '1' ? <span className={styles.read}>已读</span> : <span className={styles.unRead}>未读</span>}</>
            },
            {
                title: '消息分类',
                dataIndex: 'msgCategory',
                render: (text) => {
                    if (text == 'MATTER') {
                        return messageSort[0]
                    }
                    else if (text == 'DAILY') {
                        return messageSort[1]
                    }
                    else if (text == 'IM') {
                        return messageSort[2]
                    }
                    else if (text == 'SYS') {
                        return messageSort[3]
                    } else if (text == 'OTHER') {
                        return messageSort[4]
                    }
                }
            },
            {
                title: '发送人',
                dataIndex: 'msgSendUsername',
            },
            {
                title: '收到时间',
                dataIndex: 'createTime',
                width:150,
                render: (text) => {
                    return <span>{dataFormat(text, 'YYYY-MM-DD HH:mm:ss')}</span>
                }
            },
        ],
        dataSource: list?.map((item, index) => {
            item.number = index + 1

            return item
        }),
        pagination:false,
        rowSelection: {
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                dispatch({
                    type: 'backlogo/updateStates',
                    payload: {
                        selectedRowKeys
                    }
                })
            },
        }
    }
    return (
        <div className={styles.table}>
                 <span className={styles.topContent}>
                <Input
                    className={styles.search}
                    value={searchWord}
                    placeholder={'请输入标题'}
                    allowClear
                    onChange={onChangeValue}
                    // onSearch={searchWordFn}
                    // enterButton={<img src={require('../../../../public/assets/search_black.svg')} style={{ marginRight: 8,marginTop:-3,marginLeft:4 }}/>}
                />
                <Button
                    type="primary"
                    style={{ margin: '0 8px' }}
                    onClick={searchWordFn}
                    >
                    查询
                </Button>
                <Button type='primary' className={styles.button}  onClick={() => { changeStatus(selectedRowKeys) }}>设为已读</Button>
            </span>
            <div style={{height:'calc(100% - 100px)'}}>
                <ColumnDragTable {...tableProps} taskType="MONITOR" modulesName="backlogo" scroll={list.length>0?{y:'calc(100% - 45px)'}:{}}/>
            </div>
            <IPagination current={Number(currentPage)} total={returnCount}
                         onChange={changePage} pageSize={limit}
                         isRefresh={true} refreshDataFn={()=>{getMessageList(searchWord, keyWords, currentPage, limit,)}}/>
            {
                isModalVisible&&currentType=='page' && <BacklogoModal
                    containerId='backlogo_id'
                />
            }
        </div>
    )
}

export default connect(({ backlogo }) => ({
    backlogo
}))(Index)
