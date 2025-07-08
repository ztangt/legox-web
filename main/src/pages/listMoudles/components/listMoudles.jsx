import { connect } from 'dva';
import { Input,Button,Modal,Space,Menu, Dropdown,Table, message} from 'antd';
import styles from '../index.less';
import { dataFormat,getButton } from '../../../util/util.js';
import CTM from '../../../componments/commonDepartmentTreeMg';
// import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import ADDLIST from './addListMoudles'
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getDvaApp, history } from 'umi'
import { DownOutlined } from '@ant-design/icons';
import ListPreview from '../../../componments/listMoudlePreview/listMoudlePreview';
import IPagination from '../../../componments/public/iPagination';
import copy from 'copy-to-clipboard';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import ITree from '../../../componments/public/iTree';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import ColumnDragTable from './../../../componments/columnDragTable'
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import searchIcon from '../../../../public/assets/search_black.svg'
import GlobalModal from "@/componments/GlobalModal";
import RelevanceModal from "@/componments/relevanceModal/relevanceModal";

function ListMoudles ({dispatch,loading,currentNode,returnCount,addObj,
                      limit,treeData,initialTreeData,addModal,listMoudle,selectCtlgId,
                      autoExpandParent,expandedKeys,treeSearchWord,ctlgId,
                      currentPage,formlistModels,searchWord,user,
                      selectedNodeId,
                      selectedDataIds,
                      selectedDatas,
                      originalData,
                      selectNodeType,
                      isShowRelationModal, // 归属单位弹窗
                      dataIdList, // 列表勾选数据
                      location, // 路由
                      leftNum
}){
  console.log('expandedKeys----------',expandedKeys);
  const treeRef = useRef(null);
  const { key,title,nodeName } = currentNode
  const { menus, menuObj } = user
  var viewDetailsModalRef; //查看Modalref
  const  [isListPreview,setIsListPreview] =  useState(false)
  const [expandedList,setExpandedList] = useState([])
  const [modelIds, setModelIds] = useState('');
  const [show, setShow] = useState('');

  const [height, setHeight] = useState(document.documentElement.clientHeight - 305)

  const onResize = useCallback(() => {
    setHeight(document.documentElement.clientHeight - 305)
  }, [])

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return (() => {
      window.removeEventListener('resize', onResize)
    })
  }, [])

  useEffect(()=>{
    dispatch({
      type: 'listMoudles/updateStates',
      payload:{
        searchWord: ''
      }
    })
    dispatch({
      type: 'listMoudles/getCtlgTree',
      payload:{
        type:'ALL',
        hasPermission:'0'
      }
    })
  },[])

  useEffect(()=>{
    if(ctlgId){
      getModel(ctlgId,currentPage,searchWord,limit)
    }
  },[])

  const onOperatingMoreClick = ({key},obj) => {
    if(key == '修改'){//编辑
        onAdd(obj);
    }else if(key == '预览'){//预览
      onPreView(obj);
    } else if (key == '复制ID') {
      copy(obj.modelId);
      message.success('ID复制成功！');
    }
  };

  const onPreView = (obj) =>{
        //获取表单详情
        dispatch({
          type:'listMoudlePreview/getFormListModelInfo',
          payload:{
              modelId: obj.modelId,
          }
      })
      setIsListPreview(true)
  }
  const OperatingMoreMenu = (record) => {
    return (<Menu onClick={(e)=>{onOperatingMoreClick(e,record)}}>
      {getButton(menus,'update')&&<Menu.Item key="修改">修改</Menu.Item>}
      {getButton(menus,'preview')&&<Menu.Item key="预览">预览</Menu.Item>}
      {<Menu.Item key="复制ID">复制ID</Menu.Item>}

    </Menu>)
  }

  function showDetails(record) {
    viewDetailsModalRef.show([
      { key: '列表名称', value: record.modelName },
      { key: '列表编码', value: record.modelCode },
      { key: '创建时间', value: dataFormat(record.createTime,'YYYY-MM-DD') },
      {key: '应用类类别',value: nodeName},
      { key: '列表描述', value: record.modelDesc ,type: 3},

    ]);
  }

  function onCancel(){
    dispatch({
      type: 'listMoudles/updateStates',
      payload:{
        addModal: false,
      }
    })
  }

  function onDesign(id) {
    historyPush({
      pathname: '/listMoudles/moudleDesign',
      query:{
        moudleId: id,
        ctlgId: key
      }
    });
   var model =  _.find(getDvaApp()._models, { namespace: `moudleDesign_${id}` })||{};
    dispatch({
      type: `moudleDesign_${id}/updateStates`,
      payload:{
        ...model.state
      }
    })

  }

  const tableProps = {
    rowKey: 'modelId',
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        render: (text,record,index)=><div>{index+1}</div>,
        width:ORDER_WIDTH
      },
      {
        title: '列表名称',
        dataIndex: 'modelName',
        width:BASE_WIDTH,
        render: (text, record) => (
          <div className={styles.text} title={text}>
            {getButton(menus,'view')?<a
              onClick={() => {
                // showDetails(record);
                onAdd(record, 'show')
              }}
            >
              {text}
            </a>:text}
          </div>
        ),
      },
      {
        title: '列表编码',
        dataIndex: 'modelCode',
        width:BASE_WIDTH,
        render: text=><div className={styles.text} title={text}>{text}</div>
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width:BASE_WIDTH,
        render: (text)=><div className={styles.text}>{dataFormat(text,'YYYY-MM-DD')}</div>
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width:BASE_WIDTH,
        render: (text,record)=>{return <div>
            <Space>
              {getButton(menus,'design')&&<a onClick={onDesign.bind(this,record.modelId)}>设计</a>}
              {getButton(menus,'delete')&&<a onClick={onDelete.bind(this,record.modelId)}>删除</a>}
              <Dropdown overlay={OperatingMoreMenu.bind(this,record)} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  更多 <DownOutlined />
                </a>
              </Dropdown>
            </Space>
        </div>}
      },
    ],
    dataSource: formlistModels,
    pagination: false,
    rowSelection: {
      onChange: (selectedRowKeys, selectedRows) => {
        setModelIds(selectedRowKeys.toString())
      },
    },
  }

  function getModel(ctlgId,start,searchWord,limit){
    dispatch({
      type: 'listMoudles/updateStates',
      payload:{
        limit
      }
    })
    dispatch({
      type: 'listMoudles/getFormListModel',
      payload:{
        searchWord,
        ctlgId,
        start,
        limit
      }
    })
  }

  function checkWord(value) {
    let specialKey = "@[`·~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
    for (let i = 0; i < value.length; i++) {
      if (specialKey.indexOf(value.substr(i, 1)) != -1) {
        return true
      }
    }
    return false
  }

  function onSearchTable(value){
    if (checkWord(value)) {
      message.error('查询条件不支持特殊字符，请更换其它关键字！')
      dispatch({
        type: 'listMoudles/updateStates',
        payload:{
          searchWord: ''
        }
      })
      return
    }
    if (!ctlgId) {
      // message.error('请先选择应用类别！')
      return
    }
    getModel(ctlgId,1,value,limit)
    dispatch({
      type: 'listMoudles/updateStates',
      payload:{
        searchWord: value
      }
    })
  }

  //新增 编辑保存回调
  function onAddSubmit(values,text,node){
    console.log('values',values);
    if(text == '新增'){
      dispatch({
        type: 'listMoudles/addFormListModel',
        payload:{
          ...values
        },
        node: node
      })
    }else{
      values['modelId'] = listMoudle.modelId;
      dispatch({
        type: 'listMoudles/updateFormListModel',
        payload:{
          ...values
        },
        currentNode: node
      })
    }
  }


//点击列表上新增  或者 修改
  function onAdd(obj, type){
    obj.ctlgId = key
    obj.ctlgName = nodeName
    setShow(type);
    dispatch({
      type: 'listMoudles/updateStates',
      payload:{
        listMoudle:obj,
        addModal:true,
      }
    })
  }

  //删除
  function onDelete(modelIds){
    if (modelIds.length) {
      Modal.confirm({
        title: '确认删除',
        content: '确认删除该建模信息',
        okText: '删除',
        cancelText: '取消',
        mask: false,
        getContainer:() =>{
          return document.getElementById('listMoudles_container')
        },
        onOk() {
          dispatch({
            type: 'listMoudles/deleteFormListModel',
            payload:{
              modelIds
            },
            callback: () => {
              setModelIds('')
            }

          })
        }
      })
    } else {
      message.warn('请至少选择一条数据')
    }
  }


  // 归属单位 start
  const saveBelongOrg = (ids) => {
    const arr= ids.split(",");
    if (ids.length > 0) {
      // 赋值列表选中数据
      dispatch({
        type: 'listMoudles/updateStates',
        payload: {
          dataIdList:JSON.stringify(ids.split(','))
        },
      });
      // 弹窗中的数据赋值空
      dispatch({
        type: 'listMoudles/updateStates',
        payload: {
          selectedDataIds:[],
          selectedDatas:[]
        },
      });
      if (arr.length === 1) {
        // 查询回显数据
        dispatch({
          type: 'listMoudles/queryBelongOrg',
          payload: {
            dataId: arr[0],
            menuId: menuObj[location.pathname].id
          },
          callback: () => {
            dispatch({
              type: 'listMoudles/updateStates',
              payload: {
                isShowRelationModal: true
              }
            })
          }
        })
      } else {
        dispatch({
          type: 'listMoudles/updateStates',
          payload: {
            isShowRelationModal: true
          }
        })
      }
    } else {
      message.warn('请至少选择一条数据');
    }
  }

  // 单位树取消：隐藏弹窗
  const handleCancel = () => {
    dispatch({
      type: 'listMoudles/updateStates',
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
      type: 'listMoudles/saveBelongOrg',
      payload: {
        menuId: menuObj[location.pathname].id,
        menuCode: menuObj[location.pathname].menuCode,
        insertStr: JSON.stringify(insertStr),
        dataIds: JSON.parse(dataIdList).toString()
      },
      callback: () => {
        dispatch({
          type: 'listMoudles/updateStates',
          payload: {
            isShowRelationModal: false,
            dataIdList: []
          }
        })
      }
    })
  }
  // 归属单位 end

  function changePage(page,size) {
    if (searchWord && checkWord(searchWord)) {
      message.error('查询条件不支持特殊字符，请更换其它关键字！')
      dispatch({
        type: 'listMoudles/updateStates',
        payload:{
          searchWord: ''
        }
      })
      return
    }
    dispatch({
      type: 'listMoudles/updateStates',
      payload:{
        currentPage: page,
        limit: size,
      }
    })
    getModel(ctlgId,page,searchWord,size)
  }

  //点击分类获取列表
  const selectCtlgFn=(key,e)=>{
    dispatch({
      type:'listMoudles/updateStates',
      payload:{
        searchWord: '',
        ctlgId: e.node.nodeId,
        currentNode: e.node
      }
    })
    getModel(e.node.nodeId,1,'',limit)
  }

  const leftRender=()=>{
    return (
      <ITree
        ref={treeRef}
        treeData={treeData}
        onSelect={selectCtlgFn}
        selectedKeys={ctlgId}
        onSearch={onSearch}
        isSearch={true}
        // onExpand={onExpand}
        // expandedKeys={expandedKeys}
        defaultExpandAll={false}
        style={{width:'100%',overflow: 'auto'}}
      />
    )
  }

  const rightRender=()=>{
    return (
      <div className={styles.table_warp}>
        <div className={styles.header} id='list_head'>
          <div className={styles.left}>
            <Input.Search
              className={styles.search}
              placeholder={'请输入列表名称'}
              allowClear
              value={searchWord}
              onChange={(e)=>{
                dispatch({
                  type: 'listMoudles/updateStates',
                  payload:{
                    searchWord: e.target.value
                  }
                })
              }}
              onSearch={(value)=>{onSearchTable(value)}}
              enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
            />
          </div>
          <div className={styles.right}>
            {getButton(menus,'add')&&<Button onClick={onAdd.bind(this,{})}>新增</Button>}
            {getButton(menus,'delete')&&<Button onClick={onDelete.bind(this, modelIds)}>删除</Button>}
            {<Button onClick={saveBelongOrg.bind(this, modelIds)}>归属单位</Button>}
          </div>
        </div>
        <div className={styles.content}>
          <ColumnDragTable
          taskType="MONITOR" modulesName="listMoudles"
            {...tableProps}
            scroll={formlistModels.length?{y:'calc(100% - 45px)'}:{}}
          />
          <IPagination
            current={currentPage}
            total={returnCount}
            pageSize={limit}
            isRefresh={true}
            onChange={changePage}
            refreshDataFn={() => {changePage(currentPage,limit)}}
          />
        </div>
      </div>
    )
  }

  // function setAutoExpandParent(v) {
  //   console.log('1231432432323',v);
  // }

  //搜索树名称
  const onSearch=(value)=>{
    if(value){
      expandedLists = []
      let arr = expandedLoop(initialTreeData)
      setExpandedList(arr)
      const res=searchTable(value,initialTreeData)
      const newData=deleteChildren(res)
      console.log(newData);
      dispatch({
        type:'listMoudles/updateStates',
        payload:{
          treeData: newData
        }
      })
      treeRef.current && treeRef.current.expandAll()
    } else {
      dispatch({
        type: 'listMoudles/getCtlgTree',
        payload:{
          type:'ALL',
          hasPermission:'0'
        }
      })
      dispatch({
        type:'listMoudles/updateStates',
        payload:{
          formlistModels: [],
          ctlgId: ''
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

    return (
      <div className={styles.container} id='listMoudles_container'>
        <ReSizeLeftRight
          leftChildren={leftRender()}
          rightChildren={rightRender()}
          suffix={'listMoudles'}
          vNum={leftNum}
        />
        {addModal&&<ADDLIST show={show} listMoudle={listMoudle} onCancel={onCancel.bind(this)} onSubmit={onAddSubmit.bind(this)}/>}
        {isListPreview&&<ListPreview cancelPre={()=>{setIsListPreview(false)}} id='listMoudles_container'/>}
        {/* <ViewDetailsModal
          title="查看列表"
          containerId="listMoudles_container"
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
                // bodyStyle={{ height: '445px', padding: '0px' }}
                mask={false}
                okText="确认"
                cancelText="关闭"
                getContainer={() => {
                  return document.getElementById('listMoudles_container')||false;
                }}
            >
              <RelevanceModal nameSpace="listMoudles" spaceInfo={
                {selectedNodeId,
                  selectedDataIds,
                  currentNode,
                  expandedKeys,
                  treeSearchWord,
                  selectedDatas,
                  originalData,
                  selectNodeType,}
              } orgUserType="ORG" containerId="listMoudles_container"  />
              <div style={{color:'red', fontSize: 14, position:"fixed", marginTop: 38 }}>注:多条配置,无法回显,确认覆盖更新,请谨慎!</div>
            </GlobalModal>

        }
      </div>
    )
  }
export default connect(({listMoudles,user})=>({
    ...listMoudles,
    user
}))(ListMoudles);
