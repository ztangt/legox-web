// 事件处理器
import { connect } from 'dva';
import React, { useState,useEffect } from 'react';
import { Modal,Button} from 'antd';
import _ from "lodash";
import {DRIVETYPE} from '../../../service/constant.js'
import Table from '../../../componments/columnDragTable';
import GlobalModal from '../../../componments/GlobalModal/index.jsx';
function EventHandler ({query,dispatch,loading,eventType,parentState,setParentState}){
    const bizSolId = query.bizSolId;
    const { procDefId, bizFromInfo, bizEventList, eventList, dataDrivers} = parentState;
    const [eventIds, setEventIds] = useState([]);
    const [events, setEvents] = useState([]);
    const [drivenIds, setDrivenIds] = useState([]);
    const [drivens, setDrivens] = useState([]);
    let selectedDriveIds = bizEventList.map((item)=>{if(item.triggerTime=='D'){return item.subjectId}})
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
                eventList:eventList
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
              setState:setParentState,
              state:parentState
            }
        })

    },[]);
    useEffect(() => {//初始化复选框状态
        if(bizEventList.length!=0){
            setDrivenIds(selectedDriveIds)
        }
    },[bizEventList]);

    function onCancel(){
      setParentState({
        eventChose: false
      })

    }

    function onSave(){
        // let arrays = [];
        // for (let index = 0; index < events.length; index++) {
        //     const element = events[index];
        //     element['eventId'] = element.id;
        //     if(!selectedEventIds.includes(element.eventId)){
        //         arrays.push(element);
        //     }
        // }

        // let newList = bizEventList.concat(arrays);
        // dispatch({
        //     type:"applyModelConfig/updateStates",
        //     payload:{
        //         bizEventList: newList,
        //         eventChose: false
        //     }
        // })
        let newList = []
        if(eventType=='E'){
            var eventArray = events.map((item)=>{return {eventName: item.eventName,eventType:'E',eventId:item.id}})
            newList = bizEventList.concat(eventArray)
            setParentState({
              bizEventList: newList,
              eventChose: false
            })
        }else{
            var drivenArray = drivens.map((item)=>{return {eventName: item.planName,eventType:'D',eventId:item.id}})
            newList = bizEventList.concat(drivenArray)
        }
        newList.forEach((item,index)=>{
            item.sort=index+1
            item.key=Math.random().toString(36).slice(2)
        })
        setParentState({
          bizEventList: newList,
          eventChose: false
        })

    }
    const userTableProp = {
        scroll: {y:'calc(100% - 40px)'},
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
    const drivenTableProp = {
        scroll: {y: 300},
        rowKey: 'id',
        size: 'middle',
        columns: [
            {
              title: '方案名称',
              dataIndex: 'planName',
            },
            {
              title: '方案类型',
              dataIndex: 'driveType',
              render:(text)=>DRIVETYPE[text]
            }
        ],
        dataSource: dataDrivers,
        pagination: false,
        rowSelection: {
            selectedRowKeys: drivenIds,
            onChange: (selectedRowKeys, selectedRows) => {
                    setDrivenIds(selectedRowKeys)
                    setDrivens(selectedRows)

            },
            getCheckboxProps: (record) => ({
                disabled: selectedDriveIds.includes(record.id), // Column configuration not to be checked
                name: record.name,
            }),
        },

    }

    return (

            <GlobalModal
                visible={true}
                widthType={1}
                title={eventType=='D'?'添加数据驱动':'添加事件'}
                bodyStyle={{padding: '0px'}}
                onCancel={onCancel}
                mask={false}
                maskClosable={false}
                centered
                getContainer={() =>{
                    return document.getElementById(`code_modal_${bizSolId}`)||false
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
            {eventType=='E'?<Table {...userTableProp} key={loading}/>:<Table {...drivenTableProp} key={loading}/>}


        </GlobalModal>


    )
}



export default (connect(({applyModelConfig,layoutG,loading})=>({
    applyModelConfig,
    ...layoutG,
    loading
  }))(EventHandler));
