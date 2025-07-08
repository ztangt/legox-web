// 事件处理器
import { connect } from 'dva';
import React, { useState,useEffect } from 'react';
import { Modal,Button,Form,Input,Space,Select,Row,Table,message,Tabs} from 'antd';
import _ from "lodash";

function EventHandler ({query,dispatch,loading,eventIndex,type,customEventId,setParentState,parentState}){
    const bizSolId = query.bizSolId;
    const {eventList,nodeUser,nodeUserType} = parentState;
    const [eventIds, setEventIds] = useState([]);
    const [events, setEvents] = useState([]);
    //初始
    useEffect(() => {
        dispatch({
            type:"applyModelConfig/getEventList",
            payload:{
                start:1,
                limit:1000
            },
            callback:(eventList)=>{
              setParentState({
                eventList
              })
            }
        })
        dispatch({
            type: 'applyModelConfig/getFormDataDrive',
            payload:{
              start: 1,
              limit: 10000,
              ctlgId: bizSolId,
              driveType: 'EVENT',
              planName:'',
            },
            extraParams:{
              setState:setParentState
            }
        })

    },[]);
    console.log(customEventId,'customEventId');
    useEffect(() => {//初始化单选框状态
        if(customEventId){
            setEventIds([customEventId])
        }
    },[customEventId]);

    function onCancel(){
      setParentState({
        selectEvent: false
      })
    }

    function onSave(){
            var eventArray = events.map((item)=>{return {eventName: item.eventName,eventType:'E',eventId:item.id}})
        if(eventArray.length){
          setParentState({
            changeStatus:true
          })
            let newArr = JSON.parse(JSON.stringify(nodeUser))
            if(nodeUserType == 'host'){
                newArr.handler[type].forEach(function(item,i){
                    if(i == eventIndex){
                      item.customEventId = eventArray[0].eventId;
                      item.customEventName = eventArray[0].eventName;
                    }
                })
            }else{
                newArr.reader[type].forEach(function(item,i){
                    if(i == eventIndex){
                        item.customEventId = eventArray[0].eventId;
                        item.customEventName = eventArray[0].eventName;
                    }
                })
            }
            setParentState({
              nodeUser:newArr
            })
        }
        setParentState({
          selectEvent: false
        })

    }
    const userTableProp = {
        scroll: {y: 300},
        rowKey: 'id',
        size: 'middle',
        columns: [
            {
              title: '名称',
              dataIndex: 'eventName',
            },
            {
              title: '方法名称',
              dataIndex: 'eventMethod',
            }
        ],
        dataSource: eventList,
        pagination: false,
        rowSelection: {
            type:'radio',
            selectedRowKeys: eventIds,
            onChange: (selectedRowKeys, selectedRows) => {
                    setEventIds(selectedRowKeys)
                    setEvents(selectedRows)

            },
            getCheckboxProps: (record) => ({
                // disabled: selectedEventIds.includes(record.id), // Column configuration not to be checked
                // name: record.name,
            }),
        },
    }

    return (

            <Modal
                visible={true}
                width={600}
                title={'添加事件'}
                bodyStyle={{height:'360px',padding: '10px'}}
                onCancel={onCancel}
                mask={false}
                maskClosable={false}
                centered
                getContainer={() =>{
                    return document.getElementById('code_modal')||false
                }}
                footer={[
                    <Button onClick={onCancel}>
                    取消
                    </Button>,
                    <Button loading={loading.global} type="primary" onClick={onSave}>
                    保存
                    </Button>
                ]}
            >
            <Table {...userTableProp} key={loading}/>


        </Modal>


    )
}



export default (connect(({applyModelConfig,layoutG,loading})=>({
    applyModelConfig,
    ...layoutG,
    loading
  }))(EventHandler));
