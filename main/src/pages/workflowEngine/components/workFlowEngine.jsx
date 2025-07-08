import { connect } from 'dva';
import { Input,Button,message,Modal,Space,Menu, Dropdown,Table} from 'antd';
import styles from '../index.less';
import { dataFormat,getButton } from '../../../util/util.js';
import CTM from '../../../componments/commonDepartmentTreeMg';
import IPagination from '../../../componments/public/iPagination';
import React, { useState,useCallback,useEffect,useRef } from 'react';
import IUpload from '../../../componments/Upload/uploadModal';
import CopyModel from './copy'
import Imports from './imports'
import {useSelector,history} from 'umi'
import CONTROL from './control';
import DETAIL from './detailModal';
import ADD from './addForm';
import DESIGN from './design';
import DesignFlow from './designFlow'

import NODENAMECHANGE　from　'./nameNodeChange'
import ColumnDragTable from '../../../componments/columnDragTable';
import {
  DownOutlined,
  FrownOutlined,
  SmileOutlined,
  MehOutlined,
  FrownFilled,xw
} from '@ant-design/icons';

import moment from 'moment';
import 'moment/locale/zh-cn';
import GlobalModal from "@/componments/GlobalModal";
import RelevanceModal from "@/componments/relevanceModal/relevanceModal";
moment.locale('zh-cn');

function FormEngine ({dispatch,loading,currentNodeId,returnCount,orgIds,
                      formModels,controlModal,detailModal,addFormModal,addObj,
                      designUrl,procDefId,designModal,nodeObj,limit,treeData,
                      autoExpandParent,expandedKeys,treeSearchWord,currentNode,
                      currentPage,user,searchWord,nodeNameModelShow,
                      selectedNodeId, selectedDataIds, selectedDatas, originalData,
                      selectNodeType,
                      isShowRelationModal, // 归属单位弹窗
                      dataIdList, // 列表选中数据
                      location, // 路由
                      leftNum
}){

  const pathname = '/workflowEngine';
  const { menus, menuObj } = user
  const { key,title,nodeType,orgId,orgName } = currentNode
  const [expandedList,setExpandedList] = useState([])
  const [selectId,setSelectId] = useState([])
  const [selectRows,setSelectRows] = useState([])
  const [watchName,setWatchName] = useState(false)
  const {fileName,fileExists} = useSelector(({workflowEngine})=>({...workflowEngine}))
  const importRef = useRef()
  const copyRef = useRef()
  const [fileNameValue,setFileNameValue] = useState('')
  const [filePreValue,setFilePreValue] = useState('');
  const [fileCodeValue,setFileCodeValue] = useState('')
  const [nodeRecord,setNodeRecord] = useState(null)
  //显示流程引擎弹窗
  const [isBpmnModalShow,setIsBpmnModalShow] = useState(false)
  const [isLoading,setIsLoading] = useState(false) // loading显示
  const [query,setQuery] = useState({}) // 设置参数
  const [height,setHeight] = useState(document.documentElement.clientHeight-305)
    const onResize = useCallback(()=>{
    setHeight(document.documentElement.clientHeight-305)
    },[])
  const statusStyle = {
    'width':'4px',
    'height':'4px',
    'borderRadius':'4px',
    'position':'absolute',
    'top':'50%',
    'transform':'translateY(-50%)'
  }
  useEffect(()=>{
    window.addEventListener('resize',onResize);
    return (()=>{
      window.removeEventListener('resize',onResize)
    })
  },[])
  useEffect(()=>{
    if (!currentNode.key) {
      // message.error('请选择一个应用类别');
      return;
    }
    console.log("fileExists",fileExists)
    if(fileExists||fileExists==false){
      setFileNameValue(fileName)
      const file = fileName||fileNameValue
      const filePre = file.split('.')[0];
      const [formName,formCode] = filePre.split('@');
      setFilePreValue(formName)
      setFileCodeValue(formCode)
      importRef.current.showModal()
    }
    // if(fileName){
    //   console.log("fileName---111",fileName,currentNode)
    //   // importRef.current.showModal()
    //   // const filePre = useFileName.slice(0,fileName.length - 15)
    //   // const [formName,formCode] = filePre.split(',');
    //   // dispatch({
    //   //   type: 'formEngine/updateStates',
    //   //   payload: {
    //   //     importModal: true,
    //   //     importForm: {
    //   //       formName,
    //   //       formCode
    //   //     }
    //   //   }
    //   // });
    // }
  },[fileExists])

  const onOperatingMoreClick = ({key},obj) => {
    console.log("版本控制",key,obj)
    setNodeRecord(obj)
    if(key == '版本控制'){
      dispatch({
        type: 'workflowEngine/updateStates',
        payload: {
          controlModal:true,
          modelKey: obj.modelKey,
          mainVersion:obj.versionNumber
        }
      })
      dispatch({
        type: 'workflowEngine/detailsModel',
        payload: {
          id:obj.id
        }
      })
    }else if(key == '明细'){
      dispatch({
        type: 'workflowEngine/updateStates',
        payload: {
          detailModal:true,
          procDefId:obj.procDefId
        }
      })
      dispatch({
        type: 'workflowEngine/detailsModel',
        payload: {
          id:obj.id
        }
      })
    }else if(key == '修改'){
      if(Object.keys(currentNode).length > 0){
        loop(treeData,currentNode.key);
        obj['ctlgId'] = nodeObj.key;
      }
      dispatch({
        type: 'workflowEngine/updateStates',
        payload:{
          addObj:obj,
          addFormModal:true
        }
      })
    }else if(key == '删除'){
      Modal.confirm({
        title: '流程类型管理',
        content: '是否删除流程类型',
        okText: '删除',
        cancelText: '取消',
        mask:false,
        getContainer: ()=>{
          return document.getElementById('workflowEngine_container')
        },
        onOk() {
          dispatch({
            type: 'workflowEngine/deleteModel',
            payload:{
              id:obj.id
            },
            callback:function(){
              // dispatch({
              //   type: 'workflowEngine/updateStates',
              //   payload:{
              //   }
              // })
            }
          })
        }
      });
    }else if(key =='复制'){
      copyRef.current.showModalCopy()
      dispatch({
        type: 'workflowEngine/updateStates',
        payload:{
          addObj:{...obj,useType:currentNode.key}
        }
      })
    }else if(key == '节点名称'){
      dispatch({
        type: 'workflowEngine/getProcessNewDiagram',
        payload: {
          procDefId: obj.processDefinitionId
        },
        callback:()=>{
          dispatch({
            type: 'workflowEngine/updateStates',
            payload: {
              nodeNameModelShow: true,
              procDefId: obj.processDefinitionId
            }
          })
        }
      })

    }
  };
  /**
   * todo
   * getButton(menus,'version')&&版本
   * getButton(menus,'copy')&&复制
   * getButton(menus,'detail')&&明细
   * getButton(menus,'design')&&设计
  */
  const OperatingMoreMenu = (record) => {
    console.log("record",record)
    return (<Menu onClick={(e)=>{onOperatingMoreClick(e,record)}}>
      {<Menu.Item key="版本控制">版本控制</Menu.Item>}
      {<Menu.Item key="复制">复制</Menu.Item>}
      {<Menu.Item key="明细">明细</Menu.Item>}
      {<Menu.Item key="修改">修改</Menu.Item>}
      {record.modelStatus==0?<Menu.Item key="删除">删除</Menu.Item>:''}
      {record.modelStatus!=0&&<Menu.Item key="节点名称">节点名称</Menu.Item>}
    </Menu>)
  }

  function onDeploy(values){
    dispatch({
      type: 'workflowEngine/deployModel',
      payload: {
        id:values.id
      },
      callback:()=>{
        // 更新下列表
        getModel(key,currentPage,searchWord,limit)
      }
    })
  }
  // 设计
  function onDesign(obj){
    dispatch({
      type: 'upBpmnFile/getEngineModel',
      payload: {
        id: obj.id
      },
      callback: value=>{
        setIsBpmnModalShow(true)
        setQuery({
          bizSolCode:value.modelKey,
          id: value.id,
          bizSolName: value.modelName,
          ctlgId: value.ctlgId
        })
        // historyPush({
        //   pathname: `/workflowEngine/designFlow?bizSolCode=${value.modelKey}&id=${value.id}&bizSolName=${value.modelName}&ctlgId=${value.ctlgId}`,
        // })
      }
  })
  }
  // 关闭流程引擎弹窗
  const onCloseBpmnModal = ()=>{
    setIsBpmnModalShow(false)
  }
  // http://81.70.230.227:25897/7.0/web/legox-web.git
  function onCancel(needReload=false){
    // 查看弹窗重置
    setWatchName(false)
    dispatch({
      type: 'workflowEngine/updateStates',
      payload:{
        controlModal: false,
        detailModal:false,
        addFormModal:false,
        designModal:false,
        nodeNameModelShow: false,
        nodeNameChange: false,
        historyList: []
      }
    })
    console.log("needReload=",needReload)
    // 更改主版本更新列表
    if(needReload==true){
      // 关闭弹窗更新列表
      getModel(key,currentPage,searchWord,limit)
    }

  }
  function onCancelAddForm(){
    setWatchName(false)
    dispatch({
      type: 'workflowEngine/updateStates',
      payload:{
        addFormModal: false,
      }
    })
  }
  function onCancelDesignModal(){
    setWatchName(false)
    dispatch({
      type: 'workflowEngine/updateStates',
      payload:{
        designModal: false,
      }
    })
  }
  function onCancelControl(){
    setWatchName(false)
    dispatch({
      type: 'workflowEngine/updateStates',
      payload:{
        controlModal: false,
      }
    })
  }
  function onCancelDetail(){
    setWatchName(false)
    dispatch({
      type: 'workflowEngine/updateStates',
      payload:{
        detailModal: false,
      }
    })
  }
  function onCancelNodeName(){
    setWatchName(false)
    dispatch({
      type: 'workflowEngine/updateStates',
      payload:{
        nodeNameModelShow: false,
        nodeNameChange: false,
      }
    })
  }
  const tableArr = formModels.length>0&&formModels.map((item,index)=>{
    item.key = item.id
    item.number = index + 1
    return item
  })
  const tableProps = {
    columns: [
      {
        title: '序号',
        dataIndex: 'number',
        width: 60
      },
      {
        title: '名称',
        dataIndex: 'modelName',
        render: (text,record)=>{
         return <div className={styles.listPoint} title={decodeURI(text)} onClick={onAdd.bind(this,record,true)}><a>{decodeURI(text)}</a></div>
        }
      },
      {
        title: '编码',
        dataIndex: 'modelKey',
      },
      {
        title: '版本号',
        dataIndex: 'versionNumber',
        width: 80,
      },
      {
        title: '状态',
        dataIndex: 'modelStatus',
        width: 90,
        render: (text,record)=>{return <div style={{'display':'flex'}}>
          {/* <div style={{...statusStyle,text == '0' ? color:'red' : color:'#666'}}></div> */}
          <div style={{...statusStyle,background:text =='0' ? '#1790FF' : '#52C41B'}}></div>
          <div style={{'marginLeft':'10px'}}>{text == '0' ? '草稿' : '发布'}</div>
      </div>}
      },
      {
        title: '创建人',
        dataIndex: 'createdBy',
      },
      {
        title: '创建日期',
        dataIndex: 'createTime',
        width: 110,
        render:text=>{return dataFormat(text,'YYYY-MM-DD')}
      },
      // todo
      {
        title: '操作',
        dataIndex: 'operation',
        width: 150,
        render: (text,record)=>{return <div>
            <Space className={styles.actions}>
              {/* todo
                  getButton(menus,'update')&&
                  getButton(menus,'deploy')&&
                  getButton(menus,'delete')&&
              */}
              { <a onClick={onDesign.bind(this,record)}>设计</a>}
              {<a onClick={onDeploy.bind(this,record)}>发布</a>}
              <Dropdown overlay={OperatingMoreMenu.bind(this,record)} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  更多 <DownOutlined />
                </a>
              </Dropdown>
            </Space>
        </div>}
      },
    ],
    dataSource: tableArr||[],
    pagination: false,
    // pagination: {
    //   total: returnCount,
    //   pageSize: limit,
    //   showQuickJumper: true,
    //   showSizeChanger:true,
    //   showTotal: (total)=>{return `共 ${total} 条` },
    //   current: currentPage,
    //   onChange: (page,size)=>{
    //     dispatch({
    //       type: 'layoutG/updateStates',
    //       payload:{
    //         currentPage: page,
    //         limit: size,
    //       }
    //     });
    //     // debugger;
    //     getModel(key,page,searchWord,size)
    //   }
    // },
    rowSelection: {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`);
        setSelectId(selectedRowKeys)
        setSelectRows(selectedRows)
      },
    },
  }

  function getModel(ctlgId,start,searchWord,limit){
    dispatch({
      type: 'workflowEngine/updateStates',
      payload:{
        limit
      }
    })
    dispatch({
      type: 'workflowEngine/getModel',
      payload:{
        searchWord,
        ctlgId,
        start,
        limit
      }
    })
  }



  function onSearchTable(value){
    // 搜索从1页开始
    getModel(currentNode.key,1,value,limit)
    dispatch({
      type: 'workflowEngine/updateStates',
      payload:{
        searchWord: value
      }
    })
    dispatch({
      type: 'layoutG/updateStates',
      payload:{
        currentPage: 1,
        limit,
      }
    })
  }
  function onChangeInput(e){
    if(!e.target.value&&e.type !='change'){
      dispatch({
        type: 'layoutG/updateStates',
        payload:{
          currentPage: 1,
          limit,
        }
      })
    }
    dispatch({
      type: 'workflowEngine/updateStates',
      payload:{
        searchWord: e.target.value
      }
    })
  }

  function handleEditOkClick(){
    console.log('点击确定');

  }

  //新增 编辑保存回调
  function onAddSubmit(values,text){
    setIsLoading(true)
    if(text == '新增'){
      dispatch({
        type: 'workflowEngine/addModel',
        payload:{
          modelName: values.name,
          modelKey: values.key,
          description: values.description,
          ctlgId: values.ctlgId
        },
        callback:function(){
          dispatch({
            type: 'workflowEngine/updateStates',
            payload:{
              addFormModal:false
            }
          })
          setIsLoading(false)
        }
      })
    }else{
      values['id'] = addObj.id;
      dispatch({
        type: 'workflowEngine/updateModel',
        payload:{
          modelName: values.name,
          modelKey: values.key,
          description: values.description,
          ctlgId: values.ctlgId,
          id: values.id
        },
        callback:function(){
          dispatch({
            type: 'workflowEngine/updateStates',
            payload:{
              addFormModal:false
            }
          })
          setIsLoading(false)
        }
      })
    }
  }
  // 删除多个
  function onDeleteAll(){
    if(selectId.length==0){
      message.error('请选择需要删除的数据')
      return
    }
    Modal.confirm({
      title: '流程类型管理',
      content: '是否删除流程类型',
      okText: '删除',
      cancelText: '取消',
      mask:false,
      getContainer: ()=>{
        return document.getElementById('workflowEngine_container')
      },
      onOk() {
        dispatch({
          type: 'workflowEngine/multipleDeleteModel',
          payload:{
            ids:selectId
          },
          callback:()=>{
            setSelectId([])
            setSelectRows([])
          }
        })
      }
    });
  }
  function loop(array,key){
    for(let i=0;i<array.length;i++){
      if(array[i]['key'] == key){
        nodeObj = array[i];
        break
      }
      if(array[i].children&&array[i].children.length!=0){
        loop(array[i].children,key)
      }

    }
    dispatch({
      type:'workflowEngine/updateStates',
      payload:{
        nodeObj
      }
    })
  }
//点击列表上新增  或者 修改
  function onAdd(obj,isWatch=false){
    setWatchName(isWatch)
    if(Object.keys(currentNode).length > 0){
      loop(treeData,currentNode.key);
      obj['ctlgId'] = nodeObj.key;
    }
    dispatch({
      type: 'workflowEngine/updateStates',
      payload:{
        addObj:obj,
        addFormModal:true
      }
    })
  }
  //搜索树名称
  const onSearch=(value)=>{
    if(value){
      dispatch({
        type: 'departmentTree/getCtlgTree',
        payload:{
          type:'ALL',
          hasPermission:'0'
        },
        callback:(data)=>{
          expandedLists = []
          let arr = expandedLoop(data)
          setExpandedList(arr)
          const res=searchTable(value,data)
          const newData=deleteChildren(res)
          dispatch({
            type:'departmentTree/updateStates',
            payload:{
              treeData: newData
            }
          })
        }
      })
    } else {
      dispatch({
        type: 'departmentTree/getCtlgTree',
        payload:{
          type:'ALL',
          hasPermission:'0'
        }
      })
    }
  }
  const searchTable=(value,data)=>{
    if(!data){
      return []
    }
    let newData=[]
    data.forEach(item=>{
      if(item.nodeName.indexOf(value)>-1){
        const res=searchTable(value,item.children)
        const obj={
          ...item,
          children:res
        }
        newData.push(obj)
      }
      else{
        if(item.children&&item.children.length>0){
          const res=searchTable(value,item.children)
          const obj={
            ...item,
            children:res
          }
          if(res&&res.length>0){
            newData.push(obj)
          }
        }
      }
    })
    return newData
  }
   // children为[],则删除children
  const deleteChildren=(data)=> {
    data.forEach(item=>{
      if (item.children&&item.children.length) {
        deleteChildren(item.children)
      }else {
        delete item.children
      }
    })
    return data
  }
  let expandedLists = []
  function expandedLoop(array){
    for(let i= 0;i<array.length;i++){
      let item = array[i];
      if(item.children && item.children.length >= 1){
        expandedLists.push(item.nodeId)
      }
      if(item.children&&item.children.length!=0){
        expandedLoop(item.children)
      }
    }
    return expandedLists
  }

  //导出
  function onExport(selectIds){
    if(selectIds.length==0){
      message.error('请选择列表中一个进行导出')
      return
    }
     if(selectIds.length>1){
      message.error('请单选进行导出')
      return
    }
    if(selectRows[0].modelStatus==0){
      message.error('草稿状态不能导出')
      return
    }
    dispatch({
      //导出
      type: 'workflowEngine/exportModel',
      payload: {
        modelId:selectIds[0],
        // processDefinitionId:
      },
      callback: function(path) {
        if (!path) {
          return;
        }
        // 这里的文件名根据实际情况从响应头或者url里获取
        const a = document.createElement('a');
        a.href = path;
        // a.download = `${selectedFroms[0].formName}.json`;
        a.click();
      },
    });
  }

  // 归属单位 start
  const saveBelongOrg = (ids) => {
    debugger
    if (ids.length > 0) {
      // 赋值列表选中数据
      dispatch({
        type: 'workflowEngine/updateStates',
        payload: {
          dataIdList:ids
        },
      });
      // 弹窗中的数据赋值空
      dispatch({
        type: 'workflowEngine/updateStates',
        payload: {
          selectedDataIds:[],
          selectedDatas:[]
        },
      });
      if (ids.length === 1) {
        // 查询回显数据
        dispatch({
          type: 'workflowEngine/queryBelongOrg',
          payload: {
            dataId: ids,
            menuId: menuObj[location.location.pathname].id
          },
          callback: () => {
            dispatch({
              type: 'workflowEngine/updateStates',
              payload: {
                isShowRelationModal: true
              }
            })
          }
        })
      } else {
        dispatch({
          type: 'workflowEngine/updateStates',
          payload: {
            isShowRelationModal: true
          }
        })
      }

    } else {
      message.error('请至少选择一条数据');
    }
  }

  // 单位树取消：隐藏弹窗
  const handleCancel = () => {
    dispatch({
      type: 'workflowEngine/updateStates',
      payload: {
        isShowRelationModal: false,
        dataIdList: []
      },
    });
  };
  // 单位树确认：获取到选中id
  const onOk = () => {
    if(menuObj[location.location.pathname] === undefined) {
      message.error('获取不到菜单ID和菜单编码')
      return;
    }
    let insertStr = [];
    for (i = 0; i < selectedDatas.length; i++) {
      const orgObj = selectedDatas[i];
      let belongObj = {'ORG_ID': orgObj.nodeId, 'ORG_NAME': orgObj.nodeName, 'PARENT_ORG_ID': orgObj.parentId, 'PARENT_ORG_NAME': orgObj.parentName}
      insertStr.push(belongObj);
    }
    dispatch({
      type: 'workflowEngine/saveBelongOrg',
      payload: {
        menuId: menuObj[location.location.pathname].id,
        menuCode: menuObj[location.location.pathname].menuCode,
        insertStr: JSON.stringify(insertStr),
        dataIds: dataIdList.toString()
      },
      callback: () => {
        dispatch({
          type: 'workflowEngine/updateStates',
          payload: {
            isShowRelationModal: false,
            dataIdList: []
          }
        })
      }
    })
  }
  // 归属单位 end

  // console.log("currentPage",currentPage)
    return (
      <div style={{height:'100%',borderRadius:'4px'}} className={styles.flow_engine} id="workflowEngine_container_id" >
        {/*         selectedKeys={selectCtlgId} */}
        <CTM
            leftNum={leftNum}
            moudleName={'workflowEngine'}
            treeData={treeData}
            autoExpandParent={autoExpandParent}
            expandedKeys={expandedKeys}
            treeSearchWord={treeSearchWord}
            isOverFlow={true}
            onSearch={onSearch}
            // selectedKeys={selectCtlgId}
            currentNode={currentNode}
            nodeType={'ALL'}
            plst={'输入分类名称'}
            // onSearchTable={onSearchTable.bind(this)}
            getData={(node)=>{
              dispatch({
                type: 'workflowEngine/updateStates',
                payload:{
                  currentPage: 1,
                  searchWord: ''
                }
              })
              dispatch({
                type: 'layoutG/updateStates',
                payload: {
                  currentPage: 1
                }
              })
              getModel(node.key,1,'',10)
            }}
          >
            <div className={styles.other}>
              <Input.Search
                className={styles.search}
                placeholder={'请输入流程名称'}
                allowClear
                value={searchWord}
                onChange = {onChangeInput.bind(this)}
                onSearch={(value)=>{onSearchTable(value)}}
              />
              <Space>
                {/*
                    getButton(menus,'add')&&
                    getButton(menus,'export')&&

                */}
                    {<Button type='primary' onClick={onAdd.bind(this,{},false)} className={styles.fontSize7}>新增</Button>}
                    {/* {<Button onClick={onDeleteAll.bind(this)}  className={styles.fontSize7}>删除</Button>} */}
                    {<IUpload
                      typeName={currentNode.nodeName}
                      nameSpace="workflowEngine"
                      requireFileSize={5}
                      buttonContent={<Button  className={styles.fontSize7}>导入</Button>}
                      beforeCondition={currentNode.key}
                      beforeConditionMessage="请选择一个类别"
                    />}
                    {<Button onClick={()=>onExport(selectId)} className={styles.fontSize7}>导出</Button>}
                    {<Button onClick={()=>saveBelongOrg(selectId)} className={styles.fontSize7}>归属单位</Button>}

                </Space>
            </div>
            <ColumnDragTable
            taskType = 'MONITOR'
            scroll={tableArr.length>0?
              {y: height+20}:{}
            }
            rowKey={record=>record.id}
            style={{marginLeft:5}} {...tableProps} key={loading}/>
          <IPagination
            current={currentPage}
            total={returnCount}
            onChange={(page,size)=>{
                  dispatch({
                    type: 'layoutG/updateStates',
                    payload:{
                      currentPage: page,
                      limit: size,
                    }
                  })
                  getModel(key,page,searchWord,size)
                }
              }
            pageSize={limit}
            isRefresh={true}
            refreshDataFn={()=>{
              getModel(key,1,searchWord,limit)
              dispatch({
                type: 'layoutG/updateStates',
                payload:{
                  currentPage: 1,
                  limit,
                }
              })
            }}
          />
        </CTM>
        {controlModal&&<CONTROL   //版本控制
          // org={org}
        nodeRecord={nodeRecord}
        loading={loading.global}
        onCancel={onCancelControl.bind(this)}
        // onSubmit={onSubmit.bind(this)}
        />}

        {detailModal&&<DETAIL  //明细
        // org={org}
        nodeRecord={nodeRecord}
        loading={loading.global}
        onCancel={onCancelDetail.bind(this)}
        // onSubmit={onSubmit.bind(this)}
        />}

        {addFormModal && (<ADD  //新增
          addObj = {addObj}
          setValues={(values)=>{
            dispatch({
              type: 'workflowEngine/updateStates',
              payload:{
                addObj: {...addObj,...values}
              }
            }) }
          }
          isWatch={watchName}
          loading={isLoading}
          onCancel={onCancelAddForm.bind(this)}
          onAddSubmit = {onAddSubmit.bind(this)}
        />)}

        {designModal&&<DESIGN  //设计
          // org={org}
        loading={loading.global}
        onCancel={onCancelDesignModal.bind(this)}
        // onSubmit={onSubmit.bind(this)}
        />}
        <Imports importForm={{useType:currentNode.key}}  filePreValue={filePreValue} fileCodeValue={fileCodeValue} ref={importRef}/>
        <CopyModel  ref={copyRef} />
        {nodeNameModelShow&&<NODENAMECHANGE nodeRecord={nodeRecord} onCancel={onCancelNodeName.bind(this)}/>}
        {isBpmnModalShow&&<DesignFlow onCloseBpmnModal={onCloseBpmnModal} query={query} />}

        {isShowRelationModal &&
            <GlobalModal
                title="关联单位"
                visible={true}
                onOk={onOk}
                onCancel={handleCancel}
                widthType={3}
                maskClosable={false}
                // bodyStyle={{ height: '445px', padding: '0px' }}
                mask={false}
                okText="确认"
                cancelText="关闭"
                getContainer={() => {
                  return document.getElementById('workflowEngine_container_id')||false;
                }}
            >
              <RelevanceModal nameSpace="workflowEngine" spaceInfo={{
                selectedNodeId,
                selectedDataIds,
                currentNode,
                expandedKeys,
                treeSearchWord,
                selectedDatas,
                originalData,
                selectNodeType,
              }} orgUserType="ORG" containerId="workflowEngine_container_id"  />
              <div style={{color:'red', fontSize: 14, position:"fixed", marginTop: 38 }}>注:多条配置,无法回显,确认覆盖更新,请谨慎!</div>
            </GlobalModal>
        }
      </div>
    )
  }
export default connect(({workflowEngine,upBpmnFile,departmentTree,layoutG,user})=>({
  ...workflowEngine,
  ...departmentTree,
  ...layoutG,
  ...upBpmnFile,
  user
}))(FormEngine);
