//列表
import {Input,Button,Modal,message} from 'antd';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import styles from '../index.less';
import IPagination from '../../../componments/public/iPagination';
import {history} from "umi";
import {connect} from 'dva';
import ITree from '../../../componments/public/iTree';
import { CHUNK_SIZE } from '../../../service/constant';
import {dataFormat, getButtonByUrl,getContentLength,partDownload} from '../../../util/util';
import AddUpdateModal from './addUpdateModal';
import ImportModal from './importModal';
import searchIcon from '../../../../public/assets/search_black.svg'
//import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import Table from '../../../componments/columnDragTable';
import React, {useEffect,useCallback,useState} from 'react';
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import GlobalModal from "@/componments/GlobalModal";
import RelevanceModal from "@/componments/relevanceModal/relevanceModal";
const {Search}=Input;
const {confirm}=Modal;
function ApplyModel({location,dispatch,loading,applyModel,user}){
  const {limit,searchWord,currentPage,returnCount,selectCtlgId,businessList,ctlgTree,
    isShowAddModal,isShowImportModal,isLookModal,oldCtlgTree,
    isShowRelationModal, // 归属单位弹出框
    dataIdList, // 列表选中数据
    selectedNodeId,
    selectedDataIds,
    currentNode,
    expandedKeys,
    treeSearchWord,
    selectedDatas,
    originalData,
    selectNodeType,
    leftNum
  }=applyModel;
  var viewDetailsModalRef; //查看Modalref
  const { menusUrlList, menuObj } = user
  const [defaultExpandAll,setDefaultExpandAll] = useState(false)
  const [selectedRowKeys,setSelectedRowKeys] = useState([]);
  const [selectedRows,setSelectedRows] = useState([]);
  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      width: ORDER_WIDTH,
      render: (text, record, index) => <div>{index + 1}</div>,
    },
    {
      title: '名称',
      dataIndex: 'bizSolName',
      key: 'bizSolName',
      width:BASE_WIDTH,
       render: (text,record)=><div>
         {getButtonByUrl(menusUrlList,'view','','/applyModel')?<a onClick={addUpdateModalFn.bind(this,record,true)}>{text}</a>:text}</div>

    },
    {
      title: '应用编码',
      dataIndex: 'bizSolCode',
      key: 'bizSolCode',
      width:BASE_WIDTH,
    },
    {
      title: '是否有流程',
      dataIndex: 'bpmFlag',
      key: 'bpmFlag',
      width:BASE_WIDTH,
      render:(text)=><div>{text?'是':'否'}</div>
    },
    {
      title: '创建人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      width:BASE_WIDTH,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width:BASE_WIDTH,
      render:(text)=><div>{dataFormat(text,'YYYY-MM-DD')}</div>
    },
    {
      title: '操作',
      dataIndex: 'bizSolId',
      key: 'bizSolId',
      fixed:'right',
      width:BASE_WIDTH,
      render:(text,obj)=><div className="table_operation">
        <span onClick={showConfigFn.bind(this,obj)}>配置</span>
        {getButtonByUrl(menusUrlList,'update','','/applyModel')&&<span onClick={addUpdateModalFn.bind(this,obj,false)}>修改</span>}
        {getButtonByUrl(menusUrlList,'delete','','/applyModel')&&<span onClick={delDizSol.bind(this,text)}>删除</span>}
      </div>
    }
  ];
  useEffect(()=>{
    dispatch({
      type: 'applyModel/getCtlgTree',
      payload:{
        type:'ALL',
        hasPermission:'0'
      }
    })
  },[])
  //分类id改变
  useEffect(()=>{
    if(selectCtlgId){
      getBusinessList(selectCtlgId,'',1,limit)
      dispatch({
        type:'applyModel/updateStates',
        payload:{
          searchWord:''
        }
      })
    }
  },[selectCtlgId])
  //显示配置
  const showConfigFn=(obj)=>{
    console.log("配置",obj)
    console.log(selectCtlgId,'selectCtlgId');
    historyPush({
      pathname: '/applyModelConfig',
      query: {
        bizSolId: obj.bizSolId,
        bizSolName:obj.bizSolName,
        ctlgId: selectCtlgId,
        bizSolCode: obj.bizSolCode
      },
    });
  }
  //删除
  const delDizSol=(bizSolId)=>{
    confirm({
      title: '已产生业务数据的应用不能删除',
      content: '确认删除吗？',
      mask: false,
      getContainer:() =>{
        return document.getElementById('add_modal')
      },
      onOk() {
        dispatch({
          type:'applyModel/delDizSol',
          payload:{
            bizSolId
          }
        })
      },
      onCancel() {
      },
    });
  }
  const changeBusiness=(e)=>{
    dispatch({
      type:'applyModel/updateStates',
      payload:{
        searchWord:e.target.value
      }
    })
  }
  //获取列表
  const getBusinessList=(ctlgId,searchWord,start,limit)=>{
    dispatch({
      type:'applyModel/getBusinessList',
      payload:{
        ctlgId,
        searchWord,
        start,
        limit
      }
    })
  }
  //搜索
  const searchBusiness=(value)=>{
    getBusinessList(selectCtlgId,value,1,limit)
  }
  //分页
  const changePage=(nextPage,size)=>{
    dispatch({
      type:"applyModel/updateStates",
      payload:{
        limit:size
      }
    })
    getBusinessList(selectCtlgId,searchWord,nextPage,size)
  }
  //点击分类获取列表
  const selectCtlgFn=(key,e)=>{
    dispatch({
      type:'applyModel/updateStates',
      payload:{
        selectCtlgId:e.node.nodeId,
      }
    })
  }
  //新增
  const addUpdateModalFn=(obj,isLook)=>{
    dispatch({
      type:'applyModel/updateStates',
      payload:{
        bizSolInfo:obj,
        isShowAddModal:true,
        isLookModal:isLook?isLook:false
      }
    })
  }

  //导入
  const onShowImportModal=()=>{
    dispatch({
      type:'applyModel/updateStates',
      payload:{
        isShowImportModal: true,
      }
    })
  }

   function showDetails(record) {
     viewDetailsModalRef.show([
       { key: '应用名称', value: record.bizSolName },
       { key: '应用编码', value: record.bizSolCode },
       { key: '有无流程', value: record.bpmFlag, type: 1 },
       { key: '创建时间', value: record.createTime, type: 2 },
       { key: '描述', value: record.remark, type: 3 },
     ]);
   }

   //搜索树名称
  const onSearch=(value)=>{
    if(value){
      // expandedLists = []
      // let arr = expandedLoop(oldCtlgTree)
      setDefaultExpandAll(true)
      const res=searchTable(value,oldCtlgTree)
      const newData=deleteChildren(res)
      console.log(newData);
      dispatch({
        type:'applyModel/updateStates',
        payload:{
          ctlgTree:newData
        }
      })
    } else {
      setDefaultExpandAll(false);
      dispatch({
        type:'applyModel/updateStates',
        payload:{
          ctlgTree:_.cloneDeep(oldCtlgTree)
        }
      })
    }
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
  //选择
  const rowSelection = {
    selectedRowKeys:selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows)
    }
  };
  //批量删除
  const deleteBatchBiz=()=>{
    if(!selectedRowKeys.length){
      message.error('请选择要删除的业务模版');
      return;
    }
    confirm({
      title: '已产生业务数据的应用不能删除',
      content: '确认删除吗？',
      mask: false,
      getContainer:() =>{
        return document.getElementById('add_modal')
      },
      onOk() {
        dispatch({
          type:'applyModel/deleteBatchBiz',
          payload:{
            ids:selectedRowKeys.join(',')
          },
          callback:()=>{
            getBusinessList(selectCtlgId,searchWord,1,limit)
            setSelectedRowKeys([])
            selectedRows([])
          }
        })
      },
      onCancel() {
      },
    });
  }

  // 导出
  const bizSolExport = ()=> {
    if(selectedRows.length != 1){
      return message.error('请选择一条数据');
    }
    let row = selectedRows[0];
    dispatch({
      type:'applyModel/bizSolExport',
      payload:{
        bizSolId: row.bizSolId,
        bizSolName: row.bizSolName,
      },
      callback:(data)=>{
        partDownload(data.name, data.url, 0, CHUNK_SIZE, data.length);
      }
    })


  }

  const updateModel=()=>{
    if(selectedRowKeys.length>0){
      confirm({
        title: '确认模型上传?',
        mask: false,
        getContainer:() =>{
          return document.getElementById('add_modal')
        },
        onOk () {
          dispatch({
            type:'applyModel/reuseExport',
            payload:{
              bizSolIds:selectedRowKeys.join(',')
            },
            callback:()=>{
              Modal.info({
                title: '模型已进入上传任务，请前往“专属云管理平台”统一查看！',
                mask: false,
                okText:'关闭',
                getContainer:() =>{
                  return document.getElementById('add_modal')
                },
                onOk() {
                  setSelectedRowKeys([]);
                },
              });
            }
          })


          // confirm({
          //   title: '模型已进入上传任务，请前往“专属云管理平台”统一查看！',
          //   mask: false,
          //   okText:'关闭',
          //   cancelText:'11',
          //   getContainer:() =>{
          //     return document.getElementById('add_modal')
          //   },
          //   onOk () {
          //   },

        },
      });
    }else{
      message.error('请选择一条数据')
    }
  }
  const leftRender=(nodeId)=>{
    return (
      <ITree
        treeData={ctlgTree}
        onSelect={selectCtlgFn}
        selectedKeys={selectCtlgId}
        onSearch={onSearch}
        isSearch={true}
        // expandedList
        defaultExpandAll={defaultExpandAll}
        style={{width:'100%',overflow: 'auto',padding:'8px 0px 0px 8px'}}
      />
    )
  }

  // 归属单位 start
  const saveBelongOrg = () => {
    debugger
    if (selectedRowKeys.length > 0) {
      // 赋值列表选中数据
      dispatch({
        type: 'applyModel/updateStates',
        payload: {
          dataIdList:selectedRowKeys
        },
      });
      // 弹窗中的数据赋值空
      dispatch({
        type: 'applyModel/updateStates',
        payload: {
          selectedDataIds:[],
          selectedDatas:[]
        },
      });
      if (selectedRowKeys.length === 1) {
        // 查询回显数据
        dispatch({
          type: 'applyModel/queryBelongOrg',
          payload: {
            // orgId: '1582671220996861954',
            dataId: selectedRowKeys,
            menuId: menuObj[location.pathname].id
          },
          callback: () => {
            dispatch({
              type: 'applyModel/updateStates',
              payload: {
                isShowRelationModal: true
              }
            })
          }
        })
      } else {
        dispatch({
          type: 'applyModel/updateStates',
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
      type: 'applyModel/updateStates',
      payload: {
        isShowRelationModal: false,
        dataIdList: []
      },
    });
  };
  // 单位树确认：获取到选中id
  const onOk = () => {
    if(menuObj[location.pathname] === undefined) {
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
      type: 'applyModel/saveBelongOrg',
      payload: {
        menuId: menuObj[location.pathname].id,
        menuCode: menuObj[location.pathname].menuCode,
        insertStr: JSON.stringify(insertStr),
        dataIds: dataIdList.toString()
      },
      callback: () => {
        dispatch({
          type: 'applyModel/updateStates',
          payload: {
            isShowRelationModal: false,
            dataIdList: []
          }
        })
      }
    })
  }
  // 归属单位 end


  const rightRender=()=>{
    return (
      <div className={styles.table_warp}>
        <div className={styles.header}>
          <div className={styles.left}>
            <Search
              onChange={changeBusiness}
              onSearch={searchBusiness}
              placeholder="请输入要搜索的业务应用名称"
              value={searchWord}
              style={{width:'200px'}}
              allowClear
              enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
            />
          </div>
          <div className={styles.right}>
            {getButtonByUrl(menusUrlList,'add','','/applyModel')&&<Button type="primary" onClick={addUpdateModalFn.bind(this,'',false)}>新增</Button>}
            {getButtonByUrl(menusUrlList,'delete','','/applyModel')&&<Button type="primary" onClick={deleteBatchBiz.bind(this)}>删除</Button>}
            <Button onClick={onShowImportModal}>导入</Button>
            <Button onClick={bizSolExport}>导出</Button>
            <Button onClick={updateModel.bind(this)}>上传模型库</Button>
            <Button onClick={saveBelongOrg}>归属单位</Button>
          </div>
        </div>
        <div style={{height:'calc(100% - 100px)'}}>
          <Table
            columns={columns}
            dataSource={businessList}
            rowKey="bizSolId"
            pagination={false}
            scroll={businessList.length?{y:'calc(100% - 40px)'}:{}}
            rowSelection={rowSelection}
          />
        </div>
        <IPagination
          current={currentPage}
          total={returnCount}
          onChange={changePage}
          pageSize={limit}
          isRefresh={true}
          refreshDataFn={()=>{getBusinessList(selectCtlgId,searchWord,1,limit)}}
        />
      </div>
    )
  }
  return (
    <div className={styles.applyModal_container} id="add_modal">
      <ReSizeLeftRight
        leftChildren={leftRender(selectCtlgId)}
        rightChildren={rightRender()}
        suffix={'applyModel'}
        vNum={leftNum}
        paddingNum={0}
      />
      {isShowAddModal && <AddUpdateModal/>}
      {isShowImportModal && <ImportModal/>}

      {/* <ViewDetailsModal
        title="查看业务应用建模"
        containerId="add_modal"
        ref={ref => {
          viewDetailsModalRef = ref;
        }}
      ></ViewDetailsModal> */}

      {isShowRelationModal &&
          <GlobalModal
              title="关联单位"
              visible={true}
              onOk={onOk}
              onCancel={handleCancel}
              widthType={3}
              maskClosable={false}
              bodyStyle={{padding:'0px'}}
              mask={false}
              okText="确认"
              cancelText="关闭"
              getContainer={() => {
                return document.getElementById('add_modal')||false;
              }}
          >
            <RelevanceModal nameSpace="applyModel" spaceInfo={applyModel} orgUserType="ORG" containerId="add_modal"  />
            <div style={{color:'red', fontSize: 14, position:"fixed", marginTop: 14,marginLeft:8 }}>注:多条配置,无法回显,确认覆盖更新,请谨慎!</div>
          </GlobalModal>
      }
    </div>
  );
}
export default connect(({applyModel,loading,layoutG,user})=>{return {applyModel,loading,layoutG,user}})(ApplyModel)
