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
import AddUpdateModal from './addUpdateEngine';
import searchIcon from '../../../../public/assets/search_black.svg'
//import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import Table from '../../../componments/columnDragTable';
import React, {useEffect,useCallback,useState} from 'react';
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import GlobalModal from "@/componments/GlobalModal";
import RelevanceModal from "@/componments/relevanceModal/relevanceModal";
import copy from 'copy-to-clipboard';

const {Search}=Input;
const {confirm}=Modal;

function ChartEngine({location,dispatch,loading,chartEngine,user}){
  const {limit,searchWord,currentPage,returnCount,selectCtlgId,chartList,ctlgTree,
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
  }=chartEngine;
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
      title: '方案名称',
      dataIndex: 'chartName',
      key: 'chartName',
      width:BASE_WIDTH,
       render: (text,record)=><div>
         {getButtonByUrl(menusUrlList,'view','','/chartEngine')?<a onClick={addUpdateModalFn.bind(this,record,true)}>{text}</a>:text}</div>

    },
    {
      title: '方案编码',
      dataIndex: 'chartCode',
      key: 'chartCode',
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
      dataIndex: 'id',
      key: 'id',
      fixed:'right',
      width:BASE_WIDTH,
      render:(text,obj)=><div className="table_operation">
        <span onClick={addUpdateModalFn.bind(this,obj,false)}>修改</span>
        <span onClick={delChart.bind(this,text)}>删除</span>
        <span type="primary" onClick={() => {onDesign(obj)}}>设计</span>
        <span type="primary" onClick={() => {onCopy(obj)}}>复制链接</span>
        {/*{getButtonByUrl(menusUrlList,'update','','/chartEngine')&&<span onClick={addUpdateModalFn.bind(this,obj,false)}>修改</span>}*/}
        {/*{getButtonByUrl(menusUrlList,'delete','','/chartEngine')&&<span onClick={delChart.bind(this,text)}>删除</span>}*/}
      </div>
    }
  ];

  const onCopy = (obj) => {
    const {id} = obj;
    copy(`/chartPage/${id}`);
    message.success('复制成功')
  };

  const onDesign = (obj) => {
    const {id, minioUrl} = obj;
    let path = `/support/designer/chartDesigner?id=${id}&minioUrl=${minioUrl}`;
    window.open(`#${path}`, '_blank');
  };

  useEffect(()=>{
    dispatch({
      type: 'chartEngine/getCtlgTree',
      payload:{
        type:'ALL',
        hasPermission:'0'
      }
    })
  },[])
  //分类id改变
  useEffect(()=>{
    if(selectCtlgId){
      getChartList(selectCtlgId,'',1,limit)
      dispatch({
        type:'chartEngine/updateStates',
        payload:{
          searchWord:''
        }
      })
    }
  },[selectCtlgId])
  //删除
  const delChart=(id)=>{
    confirm({
      content: '确认删除吗？',
      mask: false,
      getContainer:() =>{
        return document.getElementById('chart_modal')
      },
      onOk() {
        dispatch({
          type:'chartEngine/delChart',
          payload:{
            ids:id
          }
        })
      },
      onCancel() {
      },
    });
  }
  const changeBusiness=(e)=>{
    dispatch({
      type:'chartEngine/updateStates',
      payload:{
        searchWord:e.target.value
      }
    })
  }
  //获取列表
  const getChartList=(ctlgId,searchWord,start,limit)=>{
    dispatch({
      type:'chartEngine/getChartList',
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
    getChartList(selectCtlgId,value,1,limit)
  }
  //分页
  const changePage=(nextPage,size)=>{
    dispatch({
      type:"chartEngine/updateStates",
      payload:{
        limit:size
      }
    })
    getChartList(selectCtlgId,searchWord,nextPage,size)
  }
  //点击分类获取列表
  const selectCtlgFn=(key,e)=>{
    dispatch({
      type:'chartEngine/updateStates',
      payload:{
        selectCtlgId:e.node.nodeId,
      }
    })
  }
  //新增
  const addUpdateModalFn=(obj,isLook)=>{
    dispatch({
      type:'chartEngine/updateStates',
      payload:{
        chartInfo:obj,
        isShowAddModal:true,
        isLookModal:isLook
      }
    })
  }

   //搜索树名称
  const onSearch=(value)=>{
    if(value){
      // expandedLists = []
      // let arr = expandedLoop(oldCtlgTree)
      setDefaultExpandAll(true)
      const res=searchTable(value,oldCtlgTree)
      const newData=deleteChildren(res)
      dispatch({
        type:'chartEngine/updateStates',
        payload:{
          ctlgTree:newData
        }
      })
    } else {
      setDefaultExpandAll(false);
      dispatch({
        type:'chartEngine/updateStates',
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
  const deleteBatchChart=()=>{
    if(!selectedRowKeys.length){
      message.error('请选择要删除的方案');
      return;
    }
    confirm({
      content: '确认删除吗？',
      mask: false,
      getContainer:() =>{
        return document.getElementById('chart_modal')
      },
      onOk() {
        dispatch({
          type:'chartEngine/delChart',
          payload:{
            ids:selectedRowKeys.join(',')
          },
          callback:()=>{
            getChartList(selectCtlgId,searchWord,1,limit)
            setSelectedRowKeys([])
            selectedRows([])
          }
        })
      },
      onCancel() {
      },
    });
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
        type: 'chartEngine/updateStates',
        payload: {
          dataIdList:selectedRowKeys
        },
      });
      // 弹窗中的数据赋值空
      dispatch({
        type: 'chartEngine/updateStates',
        payload: {
          selectedDataIds:[],
          selectedDatas:[]
        },
      });
      if (selectedRowKeys.length === 1) {
        // 查询回显数据
        dispatch({
          type: 'chartEngine/queryBelongOrg',
          payload: {
            // orgId: '1582671220996861954',
            dataId: selectedRowKeys,
            menuId: menuObj[location.pathname].id
          },
          callback: () => {
            dispatch({
              type: 'chartEngine/updateStates',
              payload: {
                isShowRelationModal: true
              }
            })
          }
        })
      } else {
        dispatch({
          type: 'chartEngine/updateStates',
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
      type: 'chartEngine/updateStates',
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
      type: 'chartEngine/saveBelongOrg',
      payload: {
        menuId: menuObj[location.pathname].id,
        menuCode: menuObj[location.pathname].menuCode,
        insertStr: JSON.stringify(insertStr),
        dataIds: dataIdList.toString()
      },
      callback: () => {
        dispatch({
          type: 'chartEngine/updateStates',
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
            <Button type="primary" onClick={addUpdateModalFn.bind(this,'',false)}>新增</Button>
            <Button type="primary" onClick={deleteBatchChart.bind(this)}>删除</Button>
            {/*{getButtonByUrl(menusUrlList,'add','','/applyModel')&&<Button type="primary" onClick={addUpdateModalFn.bind(this,'',false)}>新增</Button>}*/}
            {/*{getButtonByUrl(menusUrlList,'delete','','/applyModel')&&<Button type="primary" onClick={deleteBatchChart.bind(this)}>删除</Button>}*/}
            <Button onClick={saveBelongOrg}>归属单位</Button>
          </div>
        </div>
        <div style={{height:'calc(100% - 100px)'}}>
          <Table
            columns={columns}
            dataSource={chartList}
            rowKey="id"
            pagination={false}
            scroll={chartList.length?{y:'calc(100% - 40px)'}:{}}
            rowSelection={rowSelection}
          />
        </div>
        <IPagination
          current={currentPage}
          total={returnCount}
          onChange={changePage}
          pageSize={limit}
          isRefresh={true}
          refreshDataFn={()=>{getChartList(selectCtlgId,searchWord,1,limit)}}
        />
      </div>
    )
  }
  return (
    <div className={styles.chart_container} id="chart_modal">
      <ReSizeLeftRight
        leftChildren={leftRender(selectCtlgId)}
        rightChildren={rightRender()}
        suffix={'chartEngine'}
        paddingNum={0}
        vNum={leftNum}
      />
      {isShowAddModal && <AddUpdateModal/>}
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
                return document.getElementById('chart_modal')||false;
              }}
          >
            <RelevanceModal nameSpace="chartEngine" spaceInfo={chartEngine} orgUserType="ORG" containerId="chart_modal"  />
            <div style={{color:'red', fontSize: 14, position:"fixed", marginTop: 38 }}>注:多条配置,无法回显,确认覆盖更新,请谨慎!</div>
          </GlobalModal>
      }
    </div>
  );
}
export default connect(({chartEngine,loading,layoutG,user})=>{return {chartEngine,loading,layoutG,user}})(ChartEngine)
