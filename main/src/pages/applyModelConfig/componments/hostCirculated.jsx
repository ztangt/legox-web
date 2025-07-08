// 办理人设置
import { connect } from 'dva';
import React, { useState,useEffect } from 'react';
import {Button,Form,Input,Space,Select,Tabs,Row,Col,Checkbox,Radio,Popover,Spin,InputNumber,message} from 'antd';
import _ from "lodash";
import styles from '../index.less';
import ORGTREE from './orgTree';
import SelectEvent from './selectEvent';
import classnames from 'classnames';
import Table from '../../../componments/columnDragTable';
const TabPane=Tabs.TabPane;
function HostCirculated ({query,dispatch,loading,applyModelConfig,onNodeCancel,tabValue,nodeUserFn,
  emptyVisible,setEmptyVisible,isEmptyFn,formHost,emptyFormVisible,setEmptyFormVisible,setTabTransact,
  tabTransact,isEmptyFormFn,successChangeTab,parentState,setParentState}){
    const bizSolId = query.bizSolId;
    const {nodeObj, actId,procDefId,nodeUser,nodeUserType,orgUserType,formColumns,bizFromInfo,nodeElement,
      reviewerList,flowTreeModal,msgConfig,formInfo,nextNodeTabValue,changeStatus,selectEvent,eventIndex,customEventId,groupList}=parentState;
    const [orgListId, setOrgListId] = useState([]);
    const [formListId, setFormListId] = useState([]);
    const [customListId, setCustomListId] = useState([]);
    const [nodeIsStatus,setNodeIsStatus] = useState(true);
    const [clickIndex,setClickIndex] = useState(0);
    const setChangeStatus=(changeStatus)=>{
      setParentState({
        changeStatus
      })
    }
    formHost.setFieldsValue({
        'hostConfig':msgConfig.hostConfig,
        'circularizeConfig':msgConfig.circularizeConfig,
        'hostMessage':msgConfig.hostMessage,
        'circularizeMessage':msgConfig.circularizeMessage,
    })
  //   useEffect(() => {
  //       // 节点切换时 如页面有改动自动调保存接口 以及 新节点基本属性 接口 : 页面没有改动不调保存接口 只有 新节点基本属性 接口
  //      if(tabValue == 'flow' && changeStatus){
  //           setNodeIsStatus(false)
  //           // formHost.submit()
  //      }else if(nodeActId && tabValue == 'flow' && !changeStatus){
  //           nodeUserFn()
  //      }
  //  },[nodeActId]);
    const changeTab=(tabValue)=>{
        // setChangeStatus(true)
        let isEmpty = false;
        if(tabTransact=='org'&&nodeUserType=='host'){
          isEmpty = isEmptyFn(nodeUser.handler.org);
        }else if(tabTransact=='org'){
          isEmpty = isEmptyFn(nodeUser.reader.org);
        }
        if(tabTransact=='form'&&nodeUserType=='host'){
          isEmpty = isEmptyFormFn(nodeUser.handler.form);
        }else if(tabTransact=='form'){
          isEmpty = isEmptyFormFn(nodeUser.reader.form);
        }
        if(isEmpty){
          return;
        }else{
          setEmptyVisible({})
          setEmptyFormVisible({})
        }
        setTabTransact(tabValue)
        //后续有浮动表再改  先写死 主表的 2021-05-27
        if(tabValue == 'form'){
          dispatch({
              type:"applyModelConfig/getFormTreeColumns",
              payload:{
                  deployFormId:bizFromInfo.formDeployId
              },
              callback:(data)=>{
                setParentState({
                  ...data
                })
              }
          })
        }else if(tabValue=='relative'){
          dispatch({
            type:"applyModelConfig/getGlobalReviewerList",
            payload:{
              orgId:'',
              searchword:'',
              start:0,
              limit:1000,
              queryType:'ALL',
            },
            extraParams:{
              setState:setParentState
            }
          })
        }
    }
    function selectChange(obj,index,text,value){ //切换分类
        setChangeStatus(true)
        let newArr = JSON.parse(JSON.stringify(nodeUser))
        if(nodeUserType == 'host'){
            if(text == '组织库'){
                newArr.handler.org.forEach(function(item,i){
                    if(i == index){
                        item.valueType = value;
                        if(value == 'GROUP'){
                            item.orgType = 'CURRENT_ORG';
                            item.orgValue = '';
                            item.orgValueName = '';
                        }else{
                            item.orgType = 'USER';
                            item.orgValue = '';
                            item.orgValueName = '';
                        }
                    }
                })
            }else if(text == '字段中获取'){
              let fromInfo = [];
              if(value=='GROUP'){
                fromInfo = formColumns.filter(info=>info.formColumnControlCode!='PERSONTREE');
              }else{
                fromInfo = formColumns.filter(info=>info.formColumnControlCode=='PERSONTREE');
              }
                newArr.handler.form.forEach(function(item,i){
                    if(i == index){
                        item.valueType = value;
                        item.formColumnCode=fromInfo.length?formColumnCodeShowFn(fromInfo[0].formColumnCode):''
                    }
                })
                if(fromInfo.length&&fromInfo[0].formColumnCode){//有默认的第一个则去掉为空的行
                  delete(emptyFormVisible[index]);
                  setEmptyFormVisible(emptyFormVisible);
                }
            }else if(text == '相对关系'){
                newArr.handler.relative.forEach(function(item,i){
                    if(i == index){//relativeValue
                        item.valueType = value;
                        if(value == 'GROUP'){
                            item.relativeValue = 'CURRENT_DEPT';
                        }else{
                            item.relativeValue = ''
                        }
                    }
                })
            }else if(text=='自定义'){
                newArr.handler.custom.forEach(function(item,i){
                    if(i == index){
                        item.valueType = value;
                        if(value == 'GROUP'){
                            item.customName = '';
                            item.customEventId = '';
                            item.customEventName= '';
                        }else{
                            item.customName = '人员';
                            item.customEventId = '';
                            item.customEventName = '';
                        }
                    }
                })
            }
        }else{
            if(text == '组织库'){
                newArr.reader.org.forEach(function(item,i){
                    if(i == index){
                        item.valueType = value;
                        if(value == 'GROUP'){
                            item.orgType = 'CURRENT_ORG';
                        }else{
                            item.orgType = 'USER'
                        }
                    }
                })
            }else if(text == '字段中获取'){
              let fromInfo = [];
              if(value=='GROUP'){
                fromInfo = formColumns.filter(info=>info.formColumnControlCode!='PERSONTREE');
              }else{
                fromInfo = formColumns.filter(info=>info.formColumnControlCode=='PERSONTREE');
              }
              newArr.reader.form.forEach(function(item,i){
                  if(i == index){
                      item.valueType = value;
                      item.formColumnCode=fromInfo.length?formColumnCodeShowFn(fromInfo[0].formColumnCode):''
                  }
              })
              if(fromInfo.length&&fromInfo[0].formColumnCode){//有默认的第一个则去掉为空的行
                delete(emptyFormVisible[index]);
                setEmptyFormVisible(emptyFormVisible);
              }
                // newArr.reader.form.forEach(function(item,i){
                //     if(i == index){
                //         item.valueType = value;
                //         item.formColumnCode=""
                //     }
                // })
            }else if(text == '相对关系'){
                newArr.reader.relative.forEach(function(item,i){
                    if(i == index){
                        item.valueType = value;
                        if(value == 'GROUP'){
                            item.relativeValue = 'CURRENT_DEPT';
                        }else{
                            item.relativeValue = ''
                        }
                    }
                })
            }else if(text=='自定义'){
                newArr.reader.custom.forEach(function(item,i){
                    if(i == index){
                        item.valueType = value;
                        if(value == 'GROUP'){
                            item.customName = '';
                        }else{
                            item.customName = '人员'
                        }
                    }
                })
            }
        }
        setParentState({
          nodeUser:newArr
        })
    }
    function selectformColumn(obj,index,value){ //字段中选择字段
        setChangeStatus(true)
        let newArr = JSON.parse(JSON.stringify(nodeUser))
        if(nodeUserType == 'host'){
            newArr.handler.form.forEach(function(item,i){
                if(i == index){
                    item.formColumnCode = value;
                    item.formCode = formInfo.formTableCode
                }
            })
        }else{
            newArr.reader.form.forEach(function(item,i){
                if(i == index){
                  item.formColumnCode = value;
                  item.formCode = formInfo.formTableCode
                }
            })
        }
        setParentState({
          nodeUser:newArr
        })
    }
    function selectReferenceChange(obj,index,value){//切换相对关系中的属性
        setChangeStatus(true)
        let curIndex=0;
        nodeElement.map((item,index)=>{
          if(item.id==actId){
            curIndex = index;
          }
        })
        let preNode = nodeElement[curIndex-1];
        let newArr = JSON.parse(JSON.stringify(nodeUser))
        if(nodeUserType == 'host'){
            newArr.handler.relative.forEach(function(item,i){
                if(i == index){
                  if(item.valueType=='USER'){//只有流程启用者值域才能是流程启用者
                    item.relativeValue = 'CURRENT_VALUE';
                    item.relativeValueId = '';
                  }else if(item.valueType=='GROUP'){
                    item.relativeValue='CURRENT_DEPT';
                    item.relativeValueId = '';
                  }
                  item.relativeReference = value;
                  if(value=='LAST_USER'){//上一节点的需要增加ID
                    item.relativeActId = preNode?.id;
                  }
                }
            })
        }else{
            newArr.reader.relative.forEach(function(item,i){
                if(i == index){
                  if(item.valueType=='USER'){//只有流程启用者值域才能是流程启用者
                    item.relativeValue = 'CURRENT_VALUE';
                    item.relativeValueId = '';
                  }else if(item.valueType=='GROUP'){
                    item.relativeValue='CURRENT_DEPT';
                    item.relativeValueId = '';
                  }
                  item.relativeReference = value;
                  if(value=='LAST_USER'){//上一节点的需要增加ID
                    item.relativeActId = preNode?.id;
                  }
                }
            })
        }
        setParentState({
          nodeUser:newArr
        })
    }
    //改变节点id
    const changeRelativeActId=(obj,index,value)=>{
      setChangeStatus(true)
      let newArr = JSON.parse(JSON.stringify(nodeUser))
      if(nodeUserType == 'host'){
          newArr.handler.relative.forEach(function(item,i){
              if(i == index){
                item.relativeActId = value;
              }
          })
      }else{
          newArr.reader.relative.forEach(function(item,i){
              if(i == index){
                item.relativeActId = value;
              }
          })
      }
      setParentState({
        nodeUser:newArr
      })
    }
    function orgChange(obj,index,value){
        setChangeStatus(true)
        let newArr = JSON.parse(JSON.stringify(nodeUser))
        if(nodeUserType == 'host'){
            newArr.handler.org.forEach(function(item,i){
                if(i == index){
                    item.orgType = value;
                    item.orgValueName = '';
                    item.orgValue = '';
                }
            })
        }else{
            newArr.reader.org.forEach(function(item,i){
                if(i == index){
                    item.orgType = value;
                    item.orgValueName = '';
                    item.orgValue = '';
                }
            })
        }
        setParentState({
          selectedDataIds:[],
          nodeUser:newArr
        })
    }
    const findName=(data,id)=>{
        const result = data.find(item => item.value === id);
        return result ? result.label : "";
    }
    function relativeChange(obj,index,value){
        setChangeStatus(true)
        let newArr = JSON.parse(JSON.stringify(nodeUser))
        if(nodeUserType == 'host'){
            newArr.handler.relative.forEach(function(item,i){
                if(i == index){
                    item.relativeValue = value.includes('_')?value:'GLOBAL_CHECKER';
                    item.relativeValueId=!value.includes('_')?value:'';
                    item.relativeValueName=!value.includes('_')?findName(reviewerList,value):'';
                }
            })
        }else{
            newArr.reader.relative.forEach(function(item,i){
                if(i == index){
                    item.relativeValue = value.includes('_')?value:'GLOBAL_CHECKER';
                    item.relativeValueId=!value.includes('_')?value:'';
                    item.relativeValueName=!value.includes('_')?findName(reviewerList,value):'';
                }
            })
        }
        setParentState({
          nodeUser:newArr
        })
    }
    //改变排序
    function changeSort(index,type,value){
      setChangeStatus(true)
      let newArr = JSON.parse(JSON.stringify(nodeUser))
      if(nodeUserType == 'host'){
          newArr.handler[type].forEach(function(item,i){
              if(i == index){
                item.sort = value;
              }
          })
      }else{
          newArr.reader[type].forEach(function(item,i){
              if(i == index){
                item.sort = value;
              }
          })
      }
      setParentState({
        nodeUser:newArr
      })
    }
    function subordinateChange(obj,index,e){ //组织库中是否含下级
        setChangeStatus(true)
        let newArr = JSON.parse(JSON.stringify(nodeUser))
        if(nodeUserType == 'host'){
            newArr.handler.org.forEach(function(item,i){
                if(i == index){
                    item.subordinate = e.target.checked;
                }
            })
        }else{
            newArr.reader.org.forEach(function(item,i){
                if(i == index){
                    item.subordinate = e.target.checked;
                }
            })
        }
        setParentState({
          nodeUser:newArr
        })
    }

    function onHostFinish(values){
        let obj = JSON.parse(JSON.stringify(nodeUser))
        console.log('nodeUser=',nodeUser);
        let flag=nodeUser.handler.relative.some(item=>item.relativeReference=='ASSIGN_USER'&&!item.relativeActId)
        if(flag){
           return message.error('请选择节点信息')
        }
        //判断组织机构值域，为空的时候提示
        let isEmpty = false;
        if(tabTransact=='org'){
          if(nodeUserType=='host'){
            isEmpty = isEmptyFn(nodeUser.handler.org);
          }else{
            isEmpty = isEmptyFn(nodeUser.reader.org);
          }
        }else if(tabTransact=='form'){
          if(nodeUserType=='host'){
            isEmpty = isEmptyFormFn(nodeUser.handler.form);
          }else{
            isEmpty = isEmptyFormFn(nodeUser.reader.form);
          }
        }
        if(isEmpty){
          setParentState({
            nextNodeTabValue:'',
            preNodeTabValue:'',
            preActId:'',
            nextActId:""
          })
          return;
        }
        obj.handler.config = values.hostConfig;
        obj.reader.config = values.circularizeConfig;
        obj.handler.message = values.hostMessage;
        obj.reader.message = values.circularizeMessage;
        if(changeStatus){
            dispatch({
                type:"applyModelConfig/addNodeUser",
                payload:{
                    bizSolId,
                    procDefId,
                    formDeployId:bizFromInfo.formDeployId,
                    actId:actId,
                    handler:JSON.stringify(obj.handler),
                    reader:JSON.stringify(obj.reader)
                },
                callback:function(){
                    setChangeStatus(false)
                    if(tabValue == 'flow' && !nodeIsStatus){
                      setParentState({
                        nodeUser:{}
                      })
                      nodeUserFn()
                    }
                    successChangeTab()
                }
            })
        }else{
          successChangeTab()
        }
    }
    function selectEventFn(index,text){
      setParentState({
        selectEvent: true,
        eventIndex:index,
        customEventId:text
      })
    }
    function changeCustomName(index,type,e){
        setChangeStatus(true)
        let newArr = JSON.parse(JSON.stringify(nodeUser))
        if(nodeUserType == 'host'){
            newArr.handler[type].forEach(function(item,i){
                if(i == index){
                  item.customName = e.target.value;
                }
            })
        }else{
            newArr.reader[type].forEach(function(item,i){
                if(i == index){
                  item.customName = e.target.value;
                }
            })
        }
        setParentState({
          nodeUser:newArr
        })
    }
    function addRowClick(text){ //添加行
        setChangeStatus(true)
        let newArr = JSON.parse(JSON.stringify(nodeUser))
        //获取排序的最大值
        let sortMax = 0;
        let newOrg = [];
        let newForm = [];
        let newRelative = [];
        let newCustom = [];
        if(nodeUserType == 'host'){
          if(newArr.handler.org.length){
            newOrg = _.sortBy(newArr.handler.org, ['sort']);
          }
          if(newArr.handler.form.length){
            newForm = _.sortBy(newArr.handler.form, ['sort']);
          }
          if(newArr.handler.relative.length){
            newRelative = _.sortBy(newArr.handler.relative, ['sort']);
          }
          if(newArr.handler.custom.length){
            newCustom = _.sortBy(newArr.handler.custom, ['sort']);
          }
        }else{
          if(newArr.reader.org.length){
            newOrg = _.sortBy(newArr.reader.org, ['sort']);
          }
          if(newArr.reader.form.length){
            newForm = _.sortBy(newArr.reader.form, ['sort']);
          }
          if(newArr.reader.relative.length){
            newRelative = _.sortBy(newArr.reader.relative, ['sort']);
          }
          if(newArr.reader.custom.length){
            newCustom = _.sortBy(newArr.reader.custom, ['sort']);
          }
        }
        let orgMax = newOrg.length?newOrg[newOrg.length-1]:'';
        let orgSortMax = orgMax?orgMax.sort:0;
        let formMax = newForm.length?newForm[newForm.length-1]:'';
        let formSortMax = formMax?formMax.sort:0;
        let relativeMax = newRelative.length?newRelative[newRelative.length-1]:"";
        let relativeSortMax = relativeMax?relativeMax.sort:0;
        let customMax = newCustom.length?newCustom[newCustom.length-1]:'';
        let customSortMax = customMax?customMax.sort:0;
        sortMax = Math.max(orgSortMax,formSortMax,relativeSortMax,customSortMax);
        if(text == '组织库'){
            let arr = {
                valueType: 'USER',
                orgType: 'USER',
                orgValue: '',
                subordinate: false,
                sort:sortMax+1
            }
            if(nodeUserType == 'host'){
                newArr.handler.org.push(arr)
            }else{
                newArr.reader.org.push(arr)
            }
        }else if(text == '字段中获取'){
            let fromInfo = formColumns.filter(info=>info.formColumnControlCode=='PERSONTREE');
            let arr = {
                valueType: 'USER',
                formColumnCode:fromInfo.length?formColumnCodeShowFn(fromInfo[0].formColumnCode):'',//默认为第一个
                subordinate: false,
                formCode:formInfo.formTableCode,
                sort:sortMax+1
            }
            if(nodeUserType == 'host'){
                newArr.handler.form.push(arr)
            }else{
                newArr.reader.form.push(arr)
            }
        }else if(text == '相对关系'){
            let arr = {
                valueType: 'USER',
                relativeValue:'CURRENT_VALUE',
                sort:sortMax+1,
                relativeReference:'START_USER'
            }
            if(nodeUserType == 'host'){
                newArr.handler.relative.push(arr)
            }else{
                newArr.reader.relative.push(arr)
            }
        }else if(text=='自定义'){
            let arr = {
                valueType: 'USER',
                customName: 'USER',
                customEventId: '',
                customEventName:'',
                subordinate: false,
                sort:sortMax+1
            }
            if(nodeUserType == 'host'){
                newArr.handler.custom.push(arr)
            }else{
                newArr.reader.custom.push(arr)
            }
        }
        setParentState({
          nodeUser:newArr
        })
    }
    function removeRowClick(text){ //删除行
        setChangeStatus(true)
        let newArr = JSON.parse(JSON.stringify(nodeUser))
        if(nodeUserType == 'host'){
            if(text == '组织库'){
                let newOrg = [];
                newArr.handler.org.forEach(function(item,i){
                  if(!orgListId.includes(i)){
                    newOrg.push(item)
                  }
                })
                newArr.handler.org = newOrg;
            }else if(text == '字段中获取'){
                let newFrom = [];
                newArr.handler.form.forEach(function(item,i){
                  if(!formListId.includes(i)){
                    newFrom.push(item)
                  }
                })
                newArr.handler.form = newFrom;
            }else if(text == '相对关系'){
              let newRelative = [];
              newArr.handler.relative.forEach(function(item,i){
                if(!formListId.includes(i)){
                  newRelative.push(item)
                }
              })
              newArr.handler.relative = newRelative;
            }else if(text=='自定义'){
                let newCustom = [];
                newArr.handler.custom.forEach(function(item,i){
                  if(!customListId.includes(i)){
                    newCustom.push(item)
                  }
                })
                newArr.handler.custom = newCustom;
            }

        }else{
            if(text == '组织库'){
              let newOrg = [];
              newArr.reader.org.forEach(function(item,i){
                if(!orgListId.includes(i)){
                  newOrg.push(item)
                }
              })
              newArr.reader.org = newOrg;
            }else if(text == '字段中获取'){
              let newFrom = [];
              newArr.reader.form.forEach(function(item,i){
                if(!formListId.includes(i)){
                  newFrom.push(item)
                }
              })
              newArr.reader.form = newFrom;
            }else if(text == '相对关系'){
              let newRelative = [];
              newArr.reader.relative.forEach(function(item,i){
                if(!formListId.includes(i)){
                  newRelative.push(item)
                }
              })
              newArr.reader.relative = newRelative;
            }else if(text=='自定义'){
                let newCustom = [];
              newArr.reader.custom.forEach(function(item,i){
                if(!customListId.includes(i)){
                    newCustom.push(item)
                }
              })
              newArr.reader.custom = newCustom;
            }
        }
        setFormListId([])
        setOrgListId([])
        setCustomListId([])
        setParentState({
          nodeUser:newArr,
        })
    }
    //单位部门岗位用户选人树
    function orgTreeClick(obj,index){
        setChangeStatus(true)
        setClickIndex(index)
        let arr = [];
        let nameArr = [];
        let userName = [];
        let orgType = '';
        if(nodeUserType == 'host'){
            nodeUser.handler.org.forEach(function(item,i){
                if(item.sort == obj.sort){
                    arr = item.orgValue ? item.orgValue.split(',') : [];
                    nameArr = item.orgValueName ? item.orgValueName.split(',') : [];
                    orgType=item.orgType
                }
            })
        }else{
            nodeUser.reader.org.forEach(function(item,i){
                if(item.sort == obj.sort){
                    arr = item.orgValue ? item.orgValue.split(',') : [];
                    nameArr = item.orgValueName ? item.orgValueName.split(',') : [];
                    orgType=item.orgType
                }
            })
        }
        setParentState({
          selectedDataIds:arr,
          orgUserType:orgType=='ROLE'?'RULE':(orgType=='USER_GROUP'?'USERGROUP':orgType),
          flowTreeModal:true
        })
    }
    //从组织库中选择列表
    const orgTableProp = {
        rowKey:'key',
        size: 'small',
        columns: [
            {
                title: '分类',
                dataIndex: 'valueType',
                width:100,
                render: (text,record,index)=><Select value={text} style={{width:'84px'}} onChange={selectChange.bind(this,record,index,'组织库')}>
                    <Select.Option value="USER">默认人</Select.Option>
                    <Select.Option value="GROUP">默认组</Select.Option>
                </Select>
            },
            {
                title: '类型',
                dataIndex: 'orgType',
                width:100,
                render: (text,record,index)=>
                    record.valueType == 'GROUP' ? (<Select style={{width:'84px'}} value={text} onChange={orgChange.bind(this,record,index)}>
                    <Select.Option value="CURRENT_ORG">本单位</Select.Option>
                    <Select.Option value="ORG">某单位</Select.Option>
                    <Select.Option value="CURRENT_DEPT">本部门</Select.Option>
                    <Select.Option value="DEPT">某部门</Select.Option>
                    <Select.Option value="USER_GROUP">用户组</Select.Option>
                    <Select.Option value="POST">岗位</Select.Option>
                    <Select.Option value="ROLE">角色</Select.Option>
                    </Select>) : (<Select style={{width:'84px'}} value='USER'>
                        <Select.Option value="USER">人员</Select.Option>
                    </Select>)
            },
            {
                title: '值域',
                dataIndex: 'orgValueName',
                width:280,
                ellipsis: {
                    showTitle: false,
                },
                render: (text,record,index)=>{
                  console.log('emptyVisible[index]=',emptyVisible[index]);
                  return (
                    <>
                    <div id={`message_${index}`}>
                    {record.orgType == 'CURRENT_ORG' ?
                      <div>本单位</div> :
                      record.orgType == 'CURRENT_DEPT' ?
                      <div>本部门</div> :
                      <Popover
                        content="请输入值域"
                        title=""
                        visible={emptyVisible[index]?emptyVisible[index]:false}
                        placement="right"
                        getPopupContainer={()=>{return document.getElementById(`message_${index}`)}}
                        overlayClassName={styles.popover_style}
                      >
                        <div style={{height:'32px',border:'1px solid #ccc',cursor:'pointer',overflow:'hidden',borderRadius:'4px',lineHeight:'32px',paddingLeft:'8px'}} onClick={orgTreeClick.bind(this,record,index)}>{text}</div>
                      </Popover>
                    }
                    </div>
                    </>
                  )
                }
            },
            {
                title: '含下级',
                width:60,
                dataIndex: 'subordinate',
                render: (text,record,index)=>record.valueType == 'GROUP' ? (<Checkbox checked={record.subordinate} onChange={subordinateChange.bind(this,record,index)}></Checkbox>) :''
            },
            {
              title: '排序',
              dataIndex: 'sort',
              width:100,
              render: (text,record,index)=><div>
                <InputNumber onChange={changeSort.bind(this,index,'org')} step="0.000001" min="0" value={text}/>
              </div>
            },
        ],
        dataSource: nodeUserType == 'host' ? addKeyFn(nodeUser.handler.org) : addKeyFn(nodeUser.reader.org),
        pagination: false,
        rowSelection: {
            selectedRowKeys: orgListId,
            onChange: (selectedRowKeys, selectedRows) => {
                setOrgListId(selectedRowKeys)
            },
        },
    }
     //自定义
     const customTableProp = {
        rowKey:'key',
        size: 'small',
        columns: [
            {
                title: '分类',
                dataIndex: 'valueType',
                width:100,
                render: (text,record,index)=><Select value={text} style={{width:'84px'}} onChange={selectChange.bind(this,record,index,'自定义')}>
                    <Select.Option value="USER">默认人</Select.Option>
                    <Select.Option value="GROUP">默认组</Select.Option>
                </Select>
            },
            {
                title: '名称',
                dataIndex: 'customName',
                width:100,
                render: (text,record,index)=>
                    record.valueType=='USER'?<div style={{fontSize:14}}>人员</div>:<Input value={record.customName} onChange={changeCustomName.bind(this,index,'custom')}/>
            },
            {
                title: '事件',
                dataIndex: 'customEventId',
                width:280,
                ellipsis: {
                    showTitle: false,
                },
                render: (text,record,index)=>{
                  console.log('emptyVisible[index]=',emptyVisible[index]);
                  return (
                    <>
                        <Input onClick={selectEventFn.bind(this,index,text)} value={record?.customEventName}/>
                    </>
                  )
                }
            },
            // {
            //     title: '含下级',
            //     width:60,
            //     dataIndex: 'subordinate',
            //     render: (text,record,index)=>record.valueType == 'GROUP' ? (<Checkbox checked={record.subordinate} onChange={subordinateChange.bind(this,record,index)}></Checkbox>) :''
            // },
            {
              title: '排序',
              dataIndex: 'sort',
              width:100,
              render: (text,record,index)=><div>
                <InputNumber onChange={changeSort.bind(this,index,'custom')} step="0.000001" min="0" value={text}/>
              </div>
            },
        ],
        dataSource: nodeUserType == 'host' ? addKeyFn(nodeUser.handler.custom) : addKeyFn(nodeUser.reader.custom),
        pagination: false,
        rowSelection: {
            selectedRowKeys: customListId,
            onChange: (selectedRowKeys, selectedRows) => {
                setCustomListId(selectedRowKeys)
            },
        },
    }
    //分开code
    const formColumnCodeShowFn=(formColumnCode)=>{
      if(formColumnCode.includes('NAME_')){
        let formColumnCodes = formColumnCode.split('NAME_');
        return formColumnCodes[0]+'ID_'
      }else{
        return formColumnCode;
      }
    }
    //从字段中获取列表
    const formTableProp = {
        rowKey:'key',
        size: 'small',
        columns: [
            {
                title: '分类',
                dataIndex: 'valueType',
                render: (text,record,index)=><Select value={text} onChange={selectChange.bind(this,record,index,'字段中获取')}>
                    <Select.Option value="USER">默认人</Select.Option>
                    <Select.Option value="GROUP">默认组</Select.Option>
                </Select>
            },
            {
                title: '表单',
                dataIndex: 'formName',
                ellipsis: {
                    showTitle: false,
                },
                render:()=><span>{formInfo.formTableName}</span>
            },
            {
                title: '字段',
                dataIndex: 'formColumnCode',
                render: (text,record,index)=>{
                  return (
                    <div id={`message_form_${index}`}>
                    <Popover
                    content="请输入值域"
                    title=""
                    visible={emptyFormVisible[index]?emptyFormVisible[index]:false}
                    placement="right"
                    getPopupContainer={()=>{return document.getElementById(`message_form_${index}`)}}
                    overlayClassName={styles.popover_style}
                    overlayStyle={{width:'100px'}}
                    >
                    <Select value={text} style={{width:'150px'}} onChange={selectformColumn.bind(this,record,index)}>
                      {formColumns.map((item,index)=>{
                        if(record.valueType=='USER'){
                          if(item.formColumnControlCode=='PERSONTREE'){
                            return (
                              <Select.Option
                                value={formColumnCodeShowFn(item.formColumnCode)}
                                key={index}
                              >
                                {item.formColumnName}
                              </Select.Option>
                            )
                          }
                        }else{
                          if(item.formColumnControlCode=='DEPTTREE' || item.formColumnControlCode=='ORGTREE'){
                            return (
                              <Select.Option
                                value={formColumnCodeShowFn(item.formColumnCode)}
                                key={index}
                              >
                                {item.formColumnName}
                              </Select.Option>
                            )
                          }
                        }
                      })}
                    </Select>
                    </Popover>
                    </div>
                  )
                }
            },
            {
              title: '排序',
              dataIndex: 'sort',
              width:100,
              render: (text,record,index)=><div>
                <InputNumber onChange={changeSort.bind(this,index,'form')} step="0.000001" min="0" value={text}/>
              </div>
            },
        ],
        dataSource: nodeUser.handler.form ? nodeUserType == 'host' ? addKeyFn(nodeUser.handler.form) : addKeyFn(nodeUser.reader.form) : [],
        pagination: false,
        rowSelection: {
            selectedRowKeys: formListId,
            onChange: (selectedRowKeys, selectedRows) => {
                setFormListId(selectedRowKeys)
            },
        },
    }
    console.log('nodeUser=',nodeUser);
    //相对关系列表
    const relativeTableProp = {
        rowKey:'key',
        size: 'small',
        columns: [
            {
                title: '分类',
                dataIndex: 'valueType',
                width:100,
                render: (text,record,index)=><Select value={text} onChange={selectChange.bind(this,record,index,'相对关系')}>
                    <Select.Option value="USER">默认人</Select.Option>
                    <Select.Option value="GROUP">默认组</Select.Option>
                </Select>
            },
            {
                title: '属性',
                dataIndex: 'relativeReference',
                width:200,
                render: (text,record,index)=><Select value={text} style={{width:'150px'}} onChange={selectReferenceChange.bind(this,record,index)}>
                    <Select.Option value="START_USER">流程启动者</Select.Option>
                    <Select.Option value="CURRENT_USER">当前所属人</Select.Option>
                    <Select.Option value="LAST_USER">上一节点办理人</Select.Option>
                    <Select.Option value="ASSIGN_USER">指定节点办理人</Select.Option>
                </Select>
            },
            {
                title: '节点信息',
                dataIndex: 'relativeActId',
                width:200,
                render: (text,record,index)=> record.relativeReference == 'LAST_USER' ?
                  <div>上一节点</div> :
                    record.relativeReference == 'ASSIGN_USER' ?
                    <Select defaultValue={text} style={{width:'150px'}} onChange={changeRelativeActId.bind(this,record,index)}>
                    {
                      /*'ParallelGateway'//这个只存在于历史数据中*/
                      nodeElement.map((item,index)=> {
                        if(item.type!='EndEvent'
                            &&item.type!='SubProcess'
                            &&item.type!='ParallelGateway'
                            &&item.type!='InclusiveGateway'
                            &&item.type!='ExclusiveGateway'
                          )
                        return <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
                      })
                    }
                </Select>: <div style={{height:'30px',backgroundColor:'#ccc'}}></div>

            },
            {
                title: '值域',
                dataIndex: 'relativeValue',
                width:200,
                render: (text,record,index)=>{
                   return record.valueType == 'GROUP' ? (
                    // <Select style={{width:'150px'}} value={text} onChange={relativeChange.bind(this,record,index)}>
                    // <Select.Option value="CURRENT_DEPT">本部门</Select.Option>
                    // <Select.Option value="PARENT_DEPT">上级部门</Select.Option>
                    // <Select.Option value="CURRENT_ORG">本单位</Select.Option>
                    // <Select.Option value="PARENT_ORG">上级单位</Select.Option>
                    // </Select>
                    <Select style={{width:'150px'}} value={text=='GLOBAL_CHECKER'?record.relativeValueName:text} onChange={relativeChange.bind(this,record,index)}
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label ?? '').includes(input)
                      }
                      options={groupList}
                    />
                    ) : (<Select style={{width:'150px'}} value={text=='CURRENT_VALUE'?'属性本身':record.relativeValueName} onChange={relativeChange.bind(this,record,index)}
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label ?? '').includes(input)
                      }
                      options={reviewerList}
                    />

                    )
                }
            },
            {
              title: '排序',
              dataIndex: 'sort',
              width:150,
              render: (text,record,index)=><div>
                <InputNumber style={{width:'120px'}} onChange={changeSort.bind(this,index,'relative')} step="0.000001" min="0" value={text}/>
              </div>
            },
        ],
        dataSource: nodeUser.handler.relative ? nodeUserType == 'host' ? addKeyFn(nodeUser.handler.relative) : addKeyFn(nodeUser.reader.relative) : [],
        pagination: false,
        rowSelection: {
            selectedRowKeys: formListId,
            onChange: (selectedRowKeys, selectedRows) => {
                setFormListId(selectedRowKeys)
            },
        },
    }
    //为数组添加key
    function addKeyFn(data){
      let newData = _.cloneDeep(data);
      newData.map((item,index)=>{
        item.key=index
      })
      return newData;
    }
    function onCancel(){
      setParentState({
        flowTreeModal:false
      })
    }
    function onValuesChange(values){
        setChangeStatus(true)
        let str = Object.keys(values)[0];
        let msgConfigs = JSON.parse(JSON.stringify(msgConfig))
        msgConfigs[str] = values[str];
        setParentState({
          msgConfig:msgConfigs
        })
    }

    return (
        <div className={classnames(`classNodeAttribute`,styles.host_warp)} style={{height:'100%'}}>
            <Spin spinning={loading.global}>
                <div style={{display:'flex',height:'calc(100% - 48px)',borderBottom:'1px solid #ccc',overflow:"hidden"}}>
                    {!nodeObj.isDraft ? <Tabs onChange={changeTab} activeKey={tabTransact} style={{width:'70%',height:'100%'}}>
                        <TabPane tab="从组织库中选择" key="org" className={styles.org_table}>
                            <div>
                                <Space style={{margin:'8px 0'}}>
                                    <Button onClick={addRowClick.bind(this,'组织库')}>添加行</Button>
                                    <Button onClick={removeRowClick.bind(this,'组织库')}>删除行</Button>
                                </Space>
                                <Table {...orgTableProp} scroll={{ y:'calc(100% - 40px)'}}  key={loading}/>
                            </div>
                        </TabPane>
                        <TabPane tab="字段中获取" key="form" className={styles.org_table}>
                            <div>
                                <Space style={{margin:'8px 0'}}>
                                    <Button onClick={addRowClick.bind(this,'字段中获取')}>添加行</Button>
                                    <Button onClick={removeRowClick.bind(this,'字段中获取')}>删除行</Button>
                                </Space>
                                <Table {...formTableProp} scroll={{ y:'calc(100% - 40px)'}}  key={loading}/>
                            </div>
                        </TabPane>
                        <TabPane tab="相对关系" key="relative">
                            <Space style={{margin:'8px 0'}}>
                                <Button onClick={addRowClick.bind(this,'相对关系')}>添加行</Button>
                                <Button onClick={removeRowClick.bind(this,'相对关系')}>删除行</Button>
                            </Space>
                            <div style={{height:'calc(100% - 48px)'}}>
                              <Table {...relativeTableProp} scroll={{ y:'calc(100% - 40px)'}}  key={loading}/>
                            </div>
                        </TabPane>

                        {/* <TabPane tab="业务规则" key="4">
                            业务规则
                        </TabPane> */}

                        <TabPane tab="自定义" key="5">
                        <Space style={{margin:'8px 0'}}>
                                <Button onClick={addRowClick.bind(this,'自定义')}>添加行</Button>
                                <Button onClick={removeRowClick.bind(this,'自定义')}>删除行</Button>
                            </Space>
                            <div style={{height:'calc(100% - 48px)'}}>
                              <Table {...customTableProp} scroll={{ y:'calc(100% - 40px)'}}  key={loading}/>
                            </div>
                        </TabPane>
                    </Tabs>:null}
                    <div style={{width:'30%',height:'100%',borderLeft:'1px solid #ccc',overflow:'auto'}}>
                        {/* {nodeUserType == 'host' ?  */}
                        <Form
                            form={formHost}
                            // initialValues={msgConfig}
                            onFinish={onHostFinish.bind(this)}
                            onValuesChange={onValuesChange.bind(this)}
                        >
                            <div style={{height:'200px',padding:'8px'}}>
                                <p className={styles.marginBottom8}>消息发送方式：</p>
                                <Form.Item name="hostMessage" label="" noStyle hidden={nodeUserType == 'host' ? false : true}>
                                    <Checkbox.Group>
                                        <Row>
                                            <Col span={16}>
                                                <Checkbox value="SYS_MSG">
                                                    系统消息
                                                </Checkbox>
                                            </Col>
                                            <Col span={16}>
                                                <Checkbox value="SHORT_MSG">
                                                    短信
                                                </Checkbox>
                                            </Col>
                                            <Col span={16}>
                                                <Checkbox value="INSTANT_MSG">
                                                    即时通讯
                                                </Checkbox>
                                            </Col>
                                            <Col span={16}>
                                                <Checkbox value="MAIL">
                                                    邮件
                                                </Checkbox>
                                            </Col>
                                            <Col span={16}>
                                                <Checkbox value="WEIXIN">
                                                    微信
                                                </Checkbox>
                                            </Col>
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                                <Form.Item name="circularizeMessage" label="" noStyle hidden={nodeUserType == 'host' ? true : false}>
                                    <Checkbox.Group>
                                        <Row>
                                            <Col span={16}>
                                                <Checkbox value="SYS_MSG">
                                                    系统消息
                                                </Checkbox>
                                            </Col>
                                            <Col span={16}>
                                                <Checkbox value="SHORT_MSG">
                                                    短信
                                                </Checkbox>
                                            </Col>
                                            <Col span={16}>
                                                <Checkbox value="INSTANT_MSG">
                                                    即时通讯
                                                </Checkbox>
                                            </Col>
                                            <Col span={16}>
                                                <Checkbox value="MAIL">
                                                    邮件
                                                </Checkbox>
                                            </Col>
                                            <Col span={16}>
                                                <Checkbox value="WEIXIN">
                                                    微信
                                                </Checkbox>
                                            </Col>
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                            </div>
                            {!nodeObj.isDraft &&
                            <div style={{height:'150px',padding:'8px'}}>
                                <p>相关属性设置：</p>
                                <Row gutter={0} style={{marginTop:'8px'}}>
                                    <Col span={24}>
                                        <Form.Item name="hostConfig" label="" noStyle hidden={nodeUserType == 'host' ? false : true}>
                                            <Radio.Group value={nodeUser.handler?.config} >
                                                <Space direction="vertical">
                                                    <Radio value='0'>允许更改默认人</Radio>
                                                    <Radio value='1'>不可编辑</Radio>
                                                    <Radio value='2'>隐藏</Radio>
                                                </Space>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item name="circularizeConfig" label="" noStyle hidden={nodeUserType == 'host' ? true : false}>
                                            <Radio.Group value={nodeUser.reader?.config}>
                                                <Space direction="vertical">
                                                    <Radio value='0'>允许更改默认人</Radio>
                                                    <Radio value='1'>不可编辑</Radio>
                                                    <Radio value='2'>隐藏</Radio>
                                                </Space>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                            }
                        </Form>
                    </div>
                </div>
                <div className={styles.node_button}>
                    <Button style={{marginRight:'8px'}} onClick={onNodeCancel}>
                        取消
                    </Button>
                    <Button key="submit" type="primary" loading={loading.global} htmlType={"submit"} onClick={()=>{setNodeIsStatus(true);formHost.submit()}}>
                            保存
                    </Button>
                </div>
            </Spin>
            {flowTreeModal && (<ORGTREE //单位组织选人
             //   loading={loading.global}
                onCancel={onCancel.bind(this)}
                query={query}
                clickIndex={clickIndex}
                setEmptyVisible={setEmptyVisible}
                emptyVisible={emptyVisible}
                setParentState={setParentState}
                parentState={parentState}
            />)}
            {selectEvent&&<SelectEvent
              query={query}
              type={'custom'}
              eventIndex={eventIndex}
              customEventId={customEventId}
              parentState={parentState}
              setParentState={setParentState}
            />}
        </div>
    )
}


export default connect(({loading,layoutG,applyModelConfig})=>{return {loading,layoutG,applyModelConfig}})(HostCirculated);

