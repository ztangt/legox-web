
import React, { useEffect, useState } from 'react'
import { Button,Badge } from 'antd';
import { history } from 'umi'
import { connect } from 'dva'
import {CloseOutlined} from '@ant-design/icons'
import { dataFormat } from '../../../../util/util'
import BacklogoModal from '../../../../componments/backlogoModal'
import styles from './index.less'
function Index({ dispatch, msgNotice,backlogo, }) {
    const { messageList, idsArr ,messageLength} = msgNotice
    const list = messageList?.filter(item => item.msgStatus == 0)
    useEffect(() => {
        // getMessageList()
        getCategoryList()//获取未读数量接口
    }, [])
    // const getMessageList = () => {
    //     dispatch({
    //         type: 'msgNotice/getMessageList',
    //         payload: {
    //             searchWord: '',
    //             category: '',
    //             start: 1,
    //             limit: 10,
    //         }
    //     })
    // }
    const getCategoryList=()=>{
        dispatch({
            type: 'msgNotice/getCategoryList',
        })
    }
    const onCancel = () => {
        messageList.forEach(item => {
            idsArr.push(item.msgId)
            dispatch({
                type: 'msgNotice/updateStates',
                payload: {
                    idsArr: idsArr
                }
            })
        })
        if (idsArr.length > 0) {
            dispatch({
                type: 'msgNotice/putMessage',
                payload: {
                    msgIds: idsArr.join(',')
                }
            })
        }
        dispatch({
            type:'user/updateStates',
            payload:{
                msgLength:0
            }
        })

        dispatch({
            type:'msgNotice/updateStates',
            payload:{
              isShowModal:false
            }
        })
    }
    const onClose=()=>{
        dispatch({
            type:'msgNotice/updateStates',
            payload:{
              isShowModal:false
            }
        })
    }
    const goToBacklogo = () => {
        historyPush({pathname:'/backlogo',query:{title:'全部信息'}})
        onClose()
    }
    const gotoDetailPage = (record) => {
        const params = JSON.parse(record.targetParam)
        // var maxDataruleCodes = JSON.parse(
        //     localStorage.getItem('maxDataruleCodes') || '{}',
        // );
        // var maxDataruleCode = maxDataruleCodes[location.pathname]|| '';
        if (record.msgCategory=='MATTER') {
            historyPush({
                pathname: '/waitMatter/formShow', query: {
                    bizInfoId: params.bizInfoId,
                    bizSolId: params.bizSolId,
                    bizTaskId: params.bizTaskId,
                    id: params.mainTableId,
                    title:params.bizTitle,
                    // maxDataruleCode,
                }
            })
        }
        else if (record.msgCategory=='SYS') {
            dispatch({
                type:'backlogo/updateStates',
                payload:{
                    isModalVisible:true,
                    sysItem:record,
                    currentType:'deskTop',
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
            }
        })
        dispatch({
            type:'user/updateStates',
            payload:{
                msgLength:messageLength
            }
        })
        onClose()
    }
    return (
        <div className={styles.message_container}>

            <div className={styles.message_title}>
            <Badge
                  count={
                    messageLength
                  }
                  offset={[14, 20]}
                  size="small"
                >
                  <h3>消息设置</h3>
                </Badge>
                <span onClick={onClose}><CloseOutlined style={{color: '#fff',fontSize:16,cursor:'pointer'}}/></span></div>
            <div className={styles.message_center}>
                {
                    list?.slice(0,4).map((item, index) => {
                        return (
                        <li onClick={()=>{gotoDetailPage(item)}}><span>{index + 1}</span>{item.msgTitle}</li>
                        )
                    })
                }
                {!list?.length&&<div className={styles.noMessage}>暂无新消息</div>}
            </div>
            <div className={styles.bottom}>
                <Button onClick={goToBacklogo}>查看</Button>
                <Button onClick={onCancel}>忽略</Button>
            </div>
        </div>
    )
}
export default connect(({
    msgNotice,user,backlogo
}) => ({
    msgNotice,user,backlogo
}))(Index);
