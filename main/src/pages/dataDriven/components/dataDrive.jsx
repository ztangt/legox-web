import { connect } from 'dva';
import { Input,Button,message,Modal,Space,Menu, Dropdown,Table,Tabs} from 'antd';
import styles from '../index.less';
import { dataFormat, getButton } from '../../../util/util.js';
import CTM from '../../../componments/commonDepartmentTreeMg';
import IPagination from '../../../componments/public/iPagination';
import ADDDataDriven from './addDataDriven'
import { useState, useEffect, useCallback } from 'react';
import searchIcon from '../../../../public/assets/search_black.svg'
import ColumnDragTable from '../../../componments/columnDragTable'
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import { history } from 'umi';
import {
  DownOutlined,
  FrownOutlined,
  SmileOutlined,
  MehOutlined,
  FrownFilled,xw
} from '@ant-design/icons';

import moment from 'moment'; 
import 'moment/locale/zh-cn'; 
moment.locale('zh-cn');
function DataDriven ({dispatch,loading,currentNode,returnCount,addObj,
                      limit,treeData,oldTreeData,addModal,dataDrive,
                      autoExpandParent,expandedKeys,treeSearchWord,
                      currentPage,dataDrives,planName,driveType,user,leftNum
}){
  const { key, nodeName, deployFormId, deployFormVersion } = currentNode   
  const { menus } = user
  const { TabPane } = Tabs;
  const [ids, setIds] = useState('');
  const [height, setHeight] = useState(document.documentElement.clientHeight - 350);
  const [defaultExpandAll,setDefaultExpandAll] = useState(false)

  const onResize = useCallback(() => {
    setHeight(document.documentElement.clientHeight - 350)
  }, [])

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return (() => {
      window.removeEventListener('resize', onResize)
    })
  }, [])

  useEffect(()=>{
    dispatch({
      type: 'dataDriven/getBizSolTree',
      payload:{
      }
    })
    return (() => {
      dispatch({
        type: 'dataDriven/updateStates',
        payload:{
          addModal: false,
        }
      })
    })
  },[])


  const tableProps = {
    rowKey: 'id',
    columns: [
      {
        title: '序号',
        dataIndex: 'key',
        render: (text,record,index)=><div>{index+1}</div>,
        width: ORDER_WIDTH,
    },
      {
        title: '方案',
        ellipsis:true,
        dataIndex: 'planName',
        width: BASE_WIDTH,
        render: text=><div className={styles.text} title={text}>{text}</div>
      },
      {
        title: '应用来源',
        ellipsis:true,
        width: BASE_WIDTH,
        dataIndex: 'sourceModeName',
        render: text=><div className={styles.text} title={text}>{text}</div>
      },
      {
        title: '来源表单版本',
        ellipsis:true,
        align: 'center',
        width: BASE_WIDTH,
        dataIndex: 'pushFormVersion',
        render: text=><div className={styles.text} title={text}>{text}</div>
      },
      {
        title: '目标应用',
        ellipsis:true,
        width: BASE_WIDTH,
        dataIndex: 'targetModelName',
        render: text=><div className={styles.text} title={text}>{text}</div>
      },
      {
        title: '目标表单版本',
        ellipsis:true,
        align: 'center',
        width: BASE_WIDTH,
        dataIndex: 'targetFormVersion',
        render: text=><div className={styles.text} title={text}>{text}</div>
      },
      // {
      //   title: '创建人',
      //   dataIndex: 'createUserName',
      //   render: text=><div className={styles.text} title={text}>{text}</div>
      // },
      {
        title: '创建日期',
        ellipsis:true,
        width: BASE_WIDTH,
        dataIndex: 'createTime',
        render: (text)=><div className={styles.text}>{dataFormat(text,'YYYY-MM-DD')}</div>
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: BASE_WIDTH,
        render: (text,record)=>{return <div>
            <Space>
              {getButton(menus,'update')&&<a onClick={onAdd.bind(this,record.id)}>修改</a>}
              {getButton(menus,'delete')&&<a onClick={onDelete.bind(this,record.id)}>删除</a>}
            </Space>
        </div>}
      },
    ],
    dataSource: dataDrives,
    pagination: false,
    // scroll:{y:'calc(100vh - 340px)',x:'auto'},
    // pagination: {
    //   total: returnCount,
    //   pageSize: limit,
    //   showQuickJumper: true,
    //   showSizeChanger:true,
    //   showTotal: (total)=>{return `共 ${total} 条` },
    // //   current: currentPage,
    //   onChange: (page,size)=>{
    //     dispatch({
    //       type: 'dataDriven/updateStates',
    //       payload:{
    //         currentPage: page,
    //         limit: size,
    //       }
    //     })
    //     getDataDrives(key,page,planName,size,driveType)
    //   }
    // },
    rowSelection: {
      onChange: (selectedRowKeys, selectedRows) => {
        setIds(selectedRowKeys.toString())
        console.log(selectedRowKeys.toString());
        // dispatch({
        //   type: 'dataDriven/updateStates',
        //   payload: {
        //     ids: selectedRowKeys.toString()
        //   }
        // })
      },
    },
  }

  const changePage = (page, size) => {
      dispatch({
      type: 'dataDriven/updateStates',
      payload:{
        currentPage: page,
        limit: size,
      }
    })
    getDataDrives(key,page,planName,size,driveType)
    
  }

  function getDataDrives(ctlgId,start,planName,limit,driveType){
    dispatch({
      type: 'dataDriven/updateStates',
      payload:{
        limit
      }
    })
    dispatch({
      type: 'dataDriven/getFormDataDrive',
      payload:{
        planName,
        ctlgId,
        start,
        limit,
        driveType
      }
    })
  }


 
  function onSearchTable(value){
    getDataDrives(key,currentPage,value,limit,driveType)
    dispatch({
      type: 'dataDriven/updateStates',
      payload:{
        planName: value
      }
    })
    
  }



  

//点击列表上新增  或者 修改  
  function onAdd(id){
    dispatch({
      type: 'dataDriven/updateStates',
      payload:{
        sourceTableListA:[]
      }
    })
    if(Object.keys(currentNode).length==0){
      message.error('请选择业务应用!')
      return
    }
    if(id){//修改获取当前数据驱动信息
      dispatch({
        type: 'dataDriven/getDataDriverById',
        payload:{
          dataDriveId: id
        }
      })
    }else{
      let obj = {}
      if(driveType=='PULL'){
        obj.targetModelId = key
        obj.targetModelName= nodeName
        obj['targetFormId'] = deployFormId
        obj['targetFormVersion'] = deployFormVersion
      }else{
        obj.sourceModeId = key
        obj.sourceModeName = nodeName
        obj['pushFormId'] = deployFormId
        obj['pushFormVersion'] = deployFormVersion
      }
      obj.newlineFlag = true
      obj.pageFlag = true
      obj.getType = 1
      obj.updateType = 1
      obj.getState = 0

      dispatch({
        type: 'dataDriven/updateStates',
        payload:{
          dataDrive: obj,
          refreshkey: 1,
          selectedRowKeys: [],
          sourceTableList: [],
          targetTableList: [],
          sourceColumnList: [],
          targetColumnList: [],
          pushTargetColList: [],
          pushSourceColList: [],
          fieldTree: [],
          seniorModal: false,
          sortList: [],
          selectedIndex: -1,
          selectedKeys: [],
          checkedKeys: [],
          targetDsDynamic: '',
          sourceDsDynamic: '',
          formKey:1,
        }
      })
    }
    dispatch({
      type: 'dataDriven/getFormTableColumns',
      payload:{
        deployFormId: deployFormId
      },
      name: driveType=='PULL'?'targetTableList':'sourceTableList',
      dynamicName: driveType=='PULL'?'targetDsDynamic':'sourceDsDynamic'
    })
    
    dispatch({
      type: 'dataDriven/updateStates',
      payload:{
        addModal:true,
        selectedRowKeys: [],
      }
    })


  }

  //删除
  function onDelete(id){
    Modal.confirm({
      title: '确认删除',
      content: '确认删除该驱动信息',
      okText: '删除',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'dataDriven/deleteDataDrive',
          payload:{
              id: id || ids
          },
          callback:function(){

          }
        })
      }
    }); 
  }
  function onChangeTab(value) {
    let obj = {}
    obj.sourceModeId = ''
    obj.targetModeId = ''
    obj.sourceModeName = ''
    obj.targetModelName = ''
    
    getDataDrives('',1,planName,limit,value)
    dispatch({
      type: 'dataDriven/updateStates',
      payload:{
        treeSearchWord: '',
        driveType: value,
        expandedKeys: [],
        currentNode: {},
        dataDrives: [],
        dataDrive: obj
      }
    })
  }

  let dataList = [];
  let defalutExpandedKeys = [];
  const generateList = data => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, nodeName } = node;
      defalutExpandedKeys.push(key)
      dataList.push({ key, title: nodeName });
      if (node.children) {
        generateList(node.children);
      }
    }
  };

  //获取搜索内容的父节点然后展开
const getParentKey = (nodeKey, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node['children']) {
      if (node['children'].some(item => item['key'] === nodeKey)) {
        parentKey = node['key'];
      } else if (getParentKey(nodeKey, node.children)) {
        parentKey = getParentKey(nodeKey, node.children);
      }
    }
  }
  return parentKey;
};

   //搜索树名称
   const onSearch=(value)=>{
    if(value){
      // setDefaultExpandAll(true)
      const res=searchTable(value,oldTreeData)
      const newData=deleteChildren(res)
      console.log(newData);
      generateList(newData);
      const expandedKey = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, newData);
        }
        return null;
      }).filter((item, i, self) => item && self.indexOf(item) === i);

      dispatch({
        type:'dataDriven/updateStates',
        payload:{
          expandedKeys: expandedKey,
          treeData: newData,
        }
      })
    } else {
      // setDefaultExpandAll(false);
      dispatch({
        type:'dataDriven/updateStates',
        payload:{
          expandedKeys: [],
          treeData:_.cloneDeep(oldTreeData),
        }
      })
    }
    console.log(expandedKeys);
    console.log(autoExpandParent);
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

  
    return (
      <div style={{height:'100%',borderRadius:'4px'}}>
         <div className={styles.card_container}>
          <Tabs type="card" onChange={onChangeTab.bind(this)} activeKey={driveType}>
            {
                [{name:'拉取/更新',value: 'PULL'},{name:'推送',value: 'PUSH'}].map((item,index)=>{
                  return<TabPane tab={item.name} key={item.value}>
           <CTM 
            leftNum={leftNum}
            onSearch={onSearch}
            moudleName={'dataDriven'}
            height={'calc(100vh - 200px)'}
            treeData={treeData}
            // defaultExpandAll={defaultExpandAll}
            autoExpandParent={autoExpandParent}
            expandedKeys={expandedKeys}
            treeSearchWord={treeSearchWord}
            currentNode={currentNode}
            nodeType={'ALL'}
            plst={'输入分类名称'}
            getData={(node)=>{
              let obj = {}
              if(node.nodeType=='bizSol'){
                if(driveType=='PULL'){
                  obj.targetModelId = node.key
                  obj.targetModelName= node.nodeName
                  obj.sourceModeId = ''
                  obj.sourceModeName = ''
                }else{
                  obj.sourceModeId = node.key
                  obj.sourceModeName = node.nodeName
                  obj.targetModeId = ''
                  obj.targetModelName = ''
                }
                dispatch({
                  type: 'dataDriven/updateStates',
                  payload:{
                    currentPage: 1,
                    dataDrive: obj,
                    currentNode: node
                  }
                })
                getDataDrives(node.key,1,'',10,driveType)
              }else{
                obj.sourceModeId = ''
                obj.targetModeId = ''
                obj.sourceModeName = ''
                obj.targetModelName = ''
                dispatch({
                  type: 'dataDriven/updateStates',
                  payload:{
                    currentNode: {},
                    dataDrives: [],
                    dataDrive: obj
                  }
                })
                // message.error('当前节点非业务应用!')
              }
            }}
          >
              <div className={styles.other}>
                <Input.Search
                  className={styles.search}
                  placeholder={'请输入方案名称'}
                  allowClear
                  onSearch={(value)=>{onSearchTable(value)}}
                  enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
                />
                <Space>
                    {getButton(menus,'add')&&<Button onClick={onAdd.bind(this,'')} className={styles.add_button} type={'primary'}>新增</Button>}
                    {/* {getButton(menus,'delete')&&<Button onClick={onDelete.bind(this, '')} className={styles.add_button} type={'primary'}>删除</Button>} */}
                </Space>
              </div>
              <div style={{height:'calc(100% - 90px)'}}>
                <ColumnDragTable {...tableProps} scroll={dataDrives.length?{y:'calc(100% - 45px)',X:1300}:{}}/>
              </div>
              {/* <Table {...tableProps} scroll={dataDrives.length>0?{y:document.documentElement.clientHeight - 300}:{}}/> */}
              <IPagination 
                isRefresh={true}
                refreshDataFn={() => { getDataDrives(key, currentPage,planName,limit,driveType) }}
                current={Number(currentPage)} 
                total={returnCount} 
                onChange={changePage} 
                pageSize={limit} 
              />
              {addModal&&<ADDDataDriven />}
            </CTM>         
                  </TabPane>
                })
            }
          </Tabs>
        </div>
                      
      </div>
    )
  }
export default connect(({dataDriven,user})=>({
    ...dataDriven,
    user
}))(DataDriven);
