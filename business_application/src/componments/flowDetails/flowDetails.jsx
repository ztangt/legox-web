import _ from "lodash";
import { dataFormat,replaceGTPU } from '../../util/util.js'
import React, {useState,useCallback, useEffect} from "react";
import styles from './index.less';
import {Radio,Form,Row,Col,Descriptions} from 'antd';
import Table from '../columnDragTable/index'
import {connect} from 'umi';
import {DETAILTASKSTATUS} from '../../service/constant.js';
import BpmnView from '../BpmnView/bpmnShow/index.jsx'
import {throttle} from '../../util/util.js'
import Tabs from "../TLTabs/index.jsx";
import {useSetState,useSize} from 'ahooks';
import {useRef} from 'react';
import TraceInfo from './traceInfo.jsx';
function FlowDetails({location,dispatch,loading}){
    const [state,setState] = useSetState({
      modalStyle:{display:'none'},
      isShowModal:false,
      nodeMouseOverItem:[],
      contentTab:'all',
      detailObj:{},
      isShowTraceModal:false,
      traceList:[],
      traceId:''
    });
    const infoRef=useRef(null);
    const infoSize = useSize(infoRef);
    const {modalStyle,isShowModal,nodeMouseOverItem,contentTab,detailObj,isShowTraceModal,traceList,
      traceId}= state;
    const tableProps = {
        rowKey: 'bizTaskId',
        size:'small',
        columns: [
          {
            title: '环节名称',
            dataIndex: 'actName',
            render: text=><div className={styles.text} title={text}>{text}</div>
          },
          {
            title: '办理环节',
            dataIndex: 'suserName',
            render: (text,obj)=>{
              return(
                <div>
                  {`${text}-->`}
                  {obj.makeAction=='SEND'?'':<span style={{color:'red'}}>{DETAILTASKSTATUS[obj.makeAction]}</span>}
                  {obj.makeAction=='SEND'||obj.makeAction=='DRAFT'||obj.makeAction=='INVALID'?'':'-->'}
                  {obj.makeAction!='DRAFT'&&obj.makeAction!='INVALID'?obj.ruserName:""}
                  <br/>
                  {obj.agentUserName?`${obj.agentUserName}代办`:''}
                </div>
              )
            }
          },
          {
            title: '办理人单位',
            dataIndex: 'ruserOrgName',
            render: text=><div className={styles.text} title={text}>{text?replaceGTPU(text):""}</div>
          },
          {
            title: '送达时间',
            dataIndex: 'startTime',
            render:text=>{return dataFormat(text,'YYYY-MM-DD HH:mm:ss')}
          },
          {
            title: '完成时间',
            dataIndex: 'endTime',
            render:(text,row)=>{return row.taskStatus==3?'':dataFormat(text,'YYYY-MM-DD HH:mm:ss')}
          },
          {
            title: '办理状态',
            dataIndex: 'taskStatus',
            render:text=>{return text== 0 ?'未收未办' : text== 1 ? '已收未办' : text== 2 ? '已收已办' : text==3?'已追回':''}
          },
          {
            title: '意见',
            dataIndex: 'signList',
            render:(text)=>{
              return (
                <ul>
                  {text.map((item)=>{
                    return <li style={{listStyleType:'disc'}}>
                      {item.messageText}{item.messageImgUrl?<img src={item.messageImgUrl} width={30}/>:''}
                      </li>
                  })
                  }
                </ul>
              )
            }
          }
        ],
        dataSource: detailObj.tasks,
        pagination: false,
    }
    useEffect(()=>{
      dispatch({
        type:'flowDetails/getNewBpmnDetail',
        payload:{
          bizInfoId:location.query.bizInfoId,
          procDefId:location.query.procDefId
        },
        callback:(data)=>{
          setState({
            detailObj:data
          })
        }
      })
      dispatch({
        type:"flowDetails/getFormTraceList",
        payload:{
          mainTableId:location.query.mainTableId,
          start:1,
          limit:10000
        },
        callback:(data)=>{
          setState({
            traceList:data.list
          })
        }
      })
    },[])
    function nodeMouseOver(id,obj,index,e){
        // e.preventDefault();
        let x = obj.originalEvent.layerX + 'px';
        let y = obj.originalEvent.layerY + 'px';
        // y = y + 80 + 'px';
        let styles = {
            display:'block',
            left:x,
            top:y
        }
        console.log("detailObj.tasks",detailObj.tasks,id)
        let arr = detailObj&&detailObj.tasks&&detailObj.tasks.length>0&&detailObj.tasks.filter(x=> x.actId == id)
        setState({
          nodeMouseOverItem:arr,
          modalStyle:styles,
          isShowModal:true
        })
    }
    const nodeMouseOut =()=>{
        setState({
          isShowModal:false
        })
    }
    function nodeMouseOverFn(lists){
        let list = lists&&lists.length>0?JSON.parse(JSON.stringify(lists)):[]
        const listItems = list.map((item, i) => {
           item.startTime = dataFormat(item.startTime,'YYYY-MM-DD HH:mm:ss');
           item.endTime = dataFormat(item.endTime,'YYYY-MM-DD HH:mm:ss');
            item.taskStatus = item.taskStatus == 0 ?'未收未办' : item.taskStatus== 1 ? '已收未办' : item.taskStatus== 2 ? '已收已办': item.taskStatus==3?'已追回':'';
            return (<div key={i} style={{paddingLeft:'10px',maxHeight:150,overflow:'auto'}}>
                <ul>
                    <li><p>审批人：{item.ruserName}</p></li>
                    <li><p>接收时间：{item.startTime}</p></li>
                    <li><p>审批状态：{item.taskStatus}</p></li>
                    <li><p>审批时间：{item.endTime}</p></li>
                </ul>
            </div> )
        });
        if(listItems.length == 0){
            return  isShowModal&&<ul style={modalStyle} className={styles.modalStyle}>
            <li style={{textAlign:'center',lineHeight:'90px'}}>无数据</li>
        </ul>
        }else{
            return isShowModal&&<ul style={modalStyle} className={styles.modalStyle}>
            {listItems}
        </ul>
        }
    }
    //表单留痕
    const traceColumns=[
      {
        title: '序号',
        dataIndex: 'index',
        width:60,
        render: (text,record,index)=><span>{index+1}</span>
      },
      {
        title: '时间',
        dataIndex: 'createTime',
        render: (text,record,index)=><span>{dataFormat(text,'YYYY-MM-DD HH:mm:ss')}</span>
      },
      {
        title: '操作人',
        dataIndex: 'createUserName',
      },
      {
        title: '流程环节',
        dataIndex: 'actName'
      },
      {
        title: '变更情况',
        dataIndex: 'id',
        render: (text,record,index)=>{
          if(record.minioUrl){
            return (
              <div className="table_operation"><span onClick={lookTraceInfo.bind(this,text)}>查看</span></div>
            )
          }else{
            return <span>没有变更</span>;
          }
        }
      },
    ];
    //查看表单痕迹详情
    const lookTraceInfo=(traceId)=>{
      setState({
        isShowTraceModal:true,
        traceId
      })
    }
    const onCancelTrace=()=>{
      setState({
        isShowTraceModal:false,
        traceId:''
      })
    }

  return (
    <div className={styles.form_detail_warp} id={`flowDetails_container_${location.query.bizInfoId}`}>
      <div className={styles.detail_heard} style={{height:contentTab=='img'?'100%':''}}>
      <Tabs onChange={(value)=>{setState({contentTab:value})}} value={contentTab} style={{height:contentTab=='img'?'100%':''}}>
        <Tabs.TabPane tab="流程办理详情" key="all">
          {
            Object.keys(detailObj).length > 0&&
              <div style={{height:'200px'}}>
                <BpmnView
                  getBpmnId={nodeMouseOver}
                  currentActive={detailObj.activeActivityIds}
                  historyActive={detailObj.historyActivityIds}
                  key={detailObj.xmlStr}
                  newFlowImg={detailObj.xmlStr}
                  nodeMouseOut={throttle(nodeMouseOut)}
                  targetKey={location.query.bizInfoId}
                ></BpmnView>
                {nodeMouseOverFn(nodeMouseOverItem)}
              </div>
          }
        </Tabs.TabPane>
        <Tabs.TabPane tab="流程图" key="img" style={{height:contentTab=='img'?'calc(100% - 20px)':''}}>
          {
            Object.keys(detailObj).length > 0&& 
            <div style={{height:'100%'}}>
                <BpmnView
                  getBpmnId={nodeMouseOver}
                  currentActive={detailObj.activeActivityIds}
                  historyActive={detailObj.historyActivityIds}
                  key={detailObj.xmlStr}
                  newFlowImg={detailObj.xmlStr}
                  nodeMouseOut={throttle(nodeMouseOut)}
                  targetKey={`${location.query.bizInfoId}img`}
                ></BpmnView>
                {nodeMouseOverFn(nodeMouseOverItem)}
           </div>
          }
        </Tabs.TabPane>
        <Tabs.TabPane tab="办理详情" key="content">
        </Tabs.TabPane>
      </Tabs>
      </div>
      {/* <div style={{height:'calc(100% - 56px)',position:'relative',overflow:'hidden'}}> */}
        {/* style={{width:detailObj.diagram.nodeJson.diagramWidth + 'px',height:detailObj.diagram.nodeJson.diagramHeight + 100 + 'px',position:'relative'}} */}
          {/* {Object.keys(detailObj).length > 0&&(contentTab=='all'||contentTab=='img') ?
            (contentTab=='all'?
              <div style={{height:'200px'}} key={contentTab}>
                <BpmnView
                  getBpmnId={nodeMouseOver}
                  currentActive={detailObj.activeActivityIds}
                  historyActive={detailObj.historyActivityIds}
                  key={detailObj.xmlStr}
                  newFlowImg={detailObj.xmlStr}
                  nodeMouseOut={throttle(nodeMouseOut)}
                  targetKey={location.query.bizInfoId}
                ></BpmnView>
                {nodeMouseOverFn(nodeMouseOverItem)}
              </div>:
              <div style={{height:'100%'}} key={contentTab}>
                <BpmnView
                  getBpmnId={nodeMouseOver}
                  currentActive={detailObj.activeActivityIds}
                  historyActive={detailObj.historyActivityIds}
                  key={detailObj.xmlStr}
                  newFlowImg={detailObj.xmlStr}
                  nodeMouseOut={throttle(nodeMouseOut)}
                  targetKey={location.query.bizInfoId}
                ></BpmnView>
                {nodeMouseOverFn(nodeMouseOverItem)}
              </div>
              ): null} */}
          {(contentTab=='all'||contentTab=='content')&&Object.keys(detailObj).length > 0 ?
            <div style={{marginTop:'10px',marginLeft:"60px",marginRight:"60px"}} ref={infoRef}>
              <Descriptions title="" className={styles.info_desc}>
                <Descriptions.Item label="标题">{detailObj.bizInfo.bizTitle}</Descriptions.Item>
                <Descriptions.Item label="业务状态">{detailObj.bizInfo.bizStatus == '0' ? '待发' : detailObj.bizInfo.bizStatus == '1' ? '在办' : detailObj.bizInfo.bizStatus == '2' ? '办结' : detailObj.bizInfo.bizStatus == '3'?'挂起':detailObj.bizInfo.bizStatus == '4'?'作废':''}</Descriptions.Item>
                <Descriptions.Item label="开始时间" style={{width:'260px'}}>{detailObj.bizInfo.startTime}</Descriptions.Item>
                <Descriptions.Item label="结束时间">{detailObj.bizInfo.endTime}</Descriptions.Item>
                <Descriptions.Item label="拟稿人名称">
                  {detailObj.bizInfo.draftUserName}
                </Descriptions.Item>
              </Descriptions>
            </div> : null
          }
        {(contentTab=='all'||contentTab=='content')&&Object.keys(detailObj).length > 0 ?
          <Tabs
          style={{height:contentTab!='content'?`calc(100% - ${250+infoSize?.height||0}px)`:`calc(100% - ${50+infoSize?.height||0}px)`}}
          className={styles.tab_form_info}
          >
            <Tabs.TabPane tab="流转详情" key="formFlow">
              <Table {...tableProps} key={loading} scroll={{y:'calc(100% - 40px)'}}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="表单留痕" key="formTrace">
              <Table 
                columns={traceColumns} 
                dataSource={traceList} 
                rowKey='id'
                size='small'
                scroll={{y:'calc(100% - 40px)'}}
                pagination={false}
              />
            </Tabs.TabPane>
          </Tabs>:null}
      {isShowTraceModal?
        <TraceInfo location={location} id={traceId} onCancel={onCancelTrace}/>
        :null 
      }
    </div>
  );
}
export default connect(({flowDetails,loading})=>{return {flowDetails,loading}})(FlowDetails);
