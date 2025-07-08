// 事件处理器
import { connect } from 'dva';
import React, { useState,useEffect } from 'react';
import { Modal,Button,Form,Input,Space,Select,Row,Table,message} from 'antd';
import { dataFormat } from '../../../util/util.js';
import {CloseOutlined} from '@ant-design/icons';
import _ from "lodash";
import styles from '../index.less';
import { history } from 'umi';
import { parse } from 'query-string';
function EventHandler ({dispatch,loading,onCancel,onNodeCancel,query,applyModelConfig,eventNodeType,
  nodeActId,tabValue,setParentState,parentState}){
    const bizSolId = query.bizSolId;
    const {actId,procDefId,bizFromInfo,codeList,bizSolInfo,authList,nodeObj,nodeElement,eventList}=parentState;
    const [selectEvent, setSelectEvent] = useState(false); //点击选择 modal 框
    const [selectEventType, setSelectEventType] = useState(''); //事件类型
    let beforeObj = { //进入节点初始化模板
        eventType:'BEFORE',
        arr:[]
    }
    let afterObj = { //离开节点初始化模板
        eventType:'AFTER',
        arr:[]
    }
    let returnsObj = { //节点驳回初始化模板
        eventType:'RETURN',
        arr:[]
    }
    let withdrawObj = { //节点撤回初始化模板
        eventType:'WITHDRAW',
        arr:[]
    }
    // 回显选中的项
    const [before, setBefore] = useState(beforeObj);
    const [after, setAfter] = useState(afterObj);
    const [returns, setReturns] = useState(returnsObj);
    const [withdraw, setWithdraw] = useState(withdrawObj);
    // 回显选中的id
    const [beforeIds, setBeforeIds] = useState([]);
    const [afterIds, setAfterIds] = useState([]);
    const [returnsIds, setReturnsIds] = useState([]);
    const [withdrawIds, setWithdrawIds] = useState([]);
    // 选中的项
    const [beforeItem, setBeforeItem] = useState([]);
    const [afterItem, setAfterItem] = useState([]);
    const [returnsItem, setReturnsItem] = useState([]);
    const [withdrawItem, setWithdrawItem] = useState([]);
    const [form] = Form.useForm();
    let eventCode = {
        'BEFORE':'进入节点时执行',
        'AFTER':'离开节点时执行（流程完成前）',
        'RETURN':'此节点驳回时执行',
        'WITHDRAW':'此节点撤回时执行'
    }

    //初始
    useEffect(() => {
        init(actId)

    },[eventNodeType]);
    useEffect(() => {
        if(nodeActId && tabValue == 'form'){
            init()
        }
    },[nodeActId]);
    function init(nodeId){
        dispatch({
            type:"applyModelConfig/getNodeEvent",
            payload:{
                bizSolId:bizSolId,
                procDefId:procDefId,
                formDeployId:bizFromInfo.formDeployId,
                actId:nodeId ? nodeId : nodeActId
            },
            callback:function(list){
                console.log('list',list)
                let a1=list.filter(function(item){
                    return item.eventType == 'BEFORE'
                })
                setBefore({
                    eventType:'BEFORE',
                    arr:a1
                })
                let a2=list.filter(function(item){
                    return item.eventType == 'AFTER'
                })
                setAfter({
                    eventType:'AFTER',
                    arr:a2
                })
                let a3=list.filter(function(item){
                    return item.eventType == 'RETURN'
                })
                setReturns({
                    eventType:'RETURN',
                    arr:a3
                })
                let a4=list.filter(function(item){
                    return item.eventType == 'WITHDRAW'
                })
                setWithdraw({
                    eventType:'WITHDRAW',
                    arr:a4
                })
            }
        })
    }
    function selectClick(type){//选择
        setSelectEventType(type)
        setSelectEvent(true)
        dispatch({
            type:"applyModelConfig/getEventList",
            payload:{
                start:1,
                limit:10
            },
            callback:function(list){

                if(type == 'BEFORE'){
                    //before
                    let newArr = [];
                    before.arr.forEach(function(item,i){
                        list.forEach(function(policy,j){
                            console.log('policy',policy)
                            if(item.eventId == policy.id){
                                newArr.push(item.eventId)
                            }
                        })
                    })
                    setBeforeIds(newArr)
                }else if(type == 'AFTER'){
                    //after
                    let newArr = [];
                    after.arr.forEach(function(item,i){
                        list.forEach(function(policy,j){
                            console.log('policy',policy)
                            if(item.eventId == policy.id){
                                newArr.push(item.eventId)
                            }
                        })
                    })
                    setAfterIds(newArr)
                }else if(type == 'RETURN'){
                    //returns
                    let newArr = [];
                    returns.arr.forEach(function(item,i){
                        list.forEach(function(policy,j){
                            console.log('policy',policy)
                            if(item.eventId == policy.id){
                                newArr.push(item.eventId)
                            }
                        })
                    })
                    setReturnsIds(newArr)
                }else if(type == 'WITHDRAW'){
                    //withdraw
                    let newArr = [];
                    withdraw.arr.forEach(function(item,i){
                        list.forEach(function(policy,j){
                            console.log('policy',policy)
                            if(item.eventId == policy.id){
                                newArr.push(item.eventId)
                            }
                        })
                    })
                    setWithdrawIds(newArr)
                }
            }
        })
    }
    function getTextByJs(arr) {
        var str = "";
        for (var i = 0; i < arr.length; i++) {
            str += arr[i]+ ",";
        }
        if (str.length > 0) {
            str = str.substr(0, str.length - 1);
        }
        return str;
    }
    function empty(type){//清空
            if(type == 'BEFORE' && before.arr.length == 0){
                return
            }
            if(type == 'AFTER' && after.arr.length == 0){
                return
            }
            if(type == 'RETURN' && returns.arr.length == 0){
                return
            }
            if(type == 'WITHDRAW' && withdraw.arr.length == 0){
                return
            }
            Modal.confirm({
                title: '清空',
                content: '确认清空',
                okText: '清空',
                cancelText: '取消',
                onOk() {
                    if(type == 'BEFORE'){
                        setBefore(beforeObj)
                        setBeforeIds('')
                        setBeforeItem([])
                    }else if(type == 'AFTER'){
                        setAfter(afterObj)
                        setAfterIds('')
                        setAfterItem([])
                    }else if(type == 'RETURN'){
                        setReturns(returnsObj)
                        setReturnsIds('')
                        setReturnsItem([])
                    }else if(type == 'WITHDRAW'){
                        setWithdraw(withdrawObj)
                        setWithdrawIds('')
                        setWithdrawItem([])
                    }
                    dispatch({
                        type:"applyModelConfig/deleteNodeEvent",
                        payload:{
                            bizSolId:bizSolId,
                            procDefId:procDefId,
                            formDeployId:bizFromInfo.formDeployId,
                            actId:actId,
                            eventType:type
                        }
                    })
                }
            });
    }
    function eventFn(obj){
        const listItems = obj.arr.map((item,i) =>{
            return (<li key={i}>
                <p>{item.eventName}</p>
                <p></p>
            </li>)
        });
        let num = 0;
        if(obj.arr.length > 2){
             num = (obj.arr.length - 2) * 15 + 'px'
        }
        return (
            <div>
                <div>
                    <p style={{marginTop:num}}>{eventCode[obj.eventType]}</p>
                    <Row  style={{width: '140px',margin:'4px auto 0'}} >
                        <Button onClick={selectClick.bind(this,obj.eventType)}>
                            选择
                        </Button>
                        <Button style={{marginLeft: 8}} onClick={empty.bind(this,obj.eventType)}>
                            清空
                        </Button>
                    </Row>
                </div>
                <ul style={{padding:'0'}}>{listItems}</ul>
            </div>
        );
    }

    function onFinish(values){
        console.log('values',values)
    }

    function onSelectCancel(){
        setSelectEvent(false)
    }

    function nextClick(){
        let obj = {
            eventType:selectEventType,
            arr:[]
        }
        if(selectEventType == 'BEFORE'){
            obj.arr = beforeItem;
            setBefore(obj)
        }else if(selectEventType == 'AFTER'){
            obj.arr = afterItem;
            setAfter(obj)
        }else if(selectEventType == 'RETURN'){
            obj.arr = returnsItem;
            setReturns(obj)
        }else if(selectEventType == 'WITHDRAW'){
            obj.arr = withdrawItem;
            setWithdraw(obj)
        }
        console.log('obj',obj)  //getTextByJs
        let ids = [];
        let names = [];
        obj.arr.forEach(function(item,i){
            ids.push(item.id)
            names.push(item.eventName)
        })
        ids = getTextByJs(ids)
        names = getTextByJs(names)
        dispatch({
            type:"applyModelConfig/addNodeEvent",
            payload:{
                bizSolId:bizSolId,
                procDefId:procDefId,
                formDeployId:bizFromInfo.formDeployId,
                actId:actId,
                eventType:obj.eventType,
                eventIds:ids,
                eventNames:names
            },
            callback:function(){
                setSelectEvent(false)
                message.success('保存成功');
            }
        })
    }
      const userTableProp = {
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
        //   selectedRowKeys: userIds,
        selectedRowKeys: selectEventType == 'BEFORE' ? beforeIds : selectEventType == 'AFTER' ? afterIds : selectEventType == 'RETURN' ? returnsIds : selectEventType == 'WITHDRAW' ? withdrawIds : '',
        onChange: (selectedRowKeys, selectedRows) => {
            if(selectEventType == 'BEFORE'){
                setBeforeIds(selectedRowKeys)
                setBeforeItem(selectedRows)
            }else if(selectEventType == 'AFTER'){
                setAfterIds(selectedRowKeys)
                setAfterItem(selectedRows)
            }else if(selectEventType == 'RETURN'){
                setReturnsIds(selectedRowKeys)
                setReturnsItem(selectedRows)
            }else if(selectEventType == 'WITHDRAW'){
                setWithdrawIds(selectedRowKeys)
                setWithdrawItem(selectedRows)
            }
        },
        },
    }
    return (
        <div className={styles.eventHandler}>
            <div style={{display:'flex',backgroundColor:'#03A4FF',color:'#fff',borderRadius:'2px'}}><p style={{width:'24%',textAlign:'center'}}>环节</p><p style={{width:'38%',textAlign:'center'}}>事件名称</p><p style={{width:'38%',textAlign:'center'}}>处理类</p></div>
            <div className={styles.eventWarp}>
                {eventNodeType == '开始' ? eventFn(before) : ''}
                {eventNodeType == '开始' ? eventFn(after) : ''}
                {eventNodeType == '结束' ? eventFn(after) : ''}
                {eventNodeType == '事件处理器' ? eventFn(before) : ''}
                {eventNodeType == '事件处理器' ? eventFn(after) : ''}
                {eventNodeType == '事件处理器' ? eventFn(returns) : ''}
                {eventNodeType == '事件处理器' ? eventFn(withdraw) : ''}

                {/* {eventFn(before)}
                {eventFn(after)}
                {eventFn(returns)}
                {eventFn(withdraw)} */}
            </div>
            {/* <Row style={{width: '200px',margin:'10px auto 0',border:'0'}} >
                <Button  type="primary" loading={loading.global}>
                    保存
                </Button>
                <Button onClick={onNodeCancel} style={{marginLeft: 8}}>
                    取消
                </Button>
            </Row> */}
            <Modal
                visible={selectEvent}
                width={600}
                title='事件选择'
                bodyStyle={{minHeight:'447px',padding: '10px'}}
                onCancel={onSelectCancel}
                centered
                // mask={false}
                // maskClosable={false}
                getContainer={() =>{
                    return document.getElementById('node_modal')||false
                }}
                footer={[
                    <Button onClick={onSelectCancel}>
                    取消
                    </Button>,
                    <Button loading={loading.global} type="primary" onClick={nextClick}>
                    保存
                    </Button>
                ]}
            >
            <div>
               <Table {...userTableProp} key={loading}/>
            </div>
        </Modal>


        </div>
    )
}



export default (connect(({applyModelConfig,layoutG,loading})=>({
    applyModelConfig,
    ...layoutG,
    loading
  }))(EventHandler));
