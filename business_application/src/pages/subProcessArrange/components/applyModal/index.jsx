import React,{useEffect,useRef,useState} from 'react'
import { connect } from 'dva';
import {Button} from 'antd'
import {applyModelColumns} from '../configs'
import GlobalModal from '../../../../componments/GlobalModal'
import ReSizeLeftRight from '../../../../componments/public/reSizeLeftRight'
import ITree from '../../../../componments/public/iTree'
import ColumnDragTable from '../../../../componments/columnDragTable';
import IPagination from '../../../../componments/public/iPagination'
import styles from '../../index.less'

const ApplicationModal = ({dispatch,handelCancel,applyConfirm,orgId,subProcessArrangeSpace})=>{
    const [expandedList,setExpandedList] = useState([])
    const [selectedRowKeys,setSelectedRowKeys] = useState([]) // keys
    const [selectedRowData,setSelectedRowData] = useState([]) // row Data

    const {iTreeData,iTreeSelectedId,start,limit,businessList,returnCount} = subProcessArrangeSpace
    const treeRef = useRef({})

    useEffect(()=>{
        getLeftRender()
    },[])
    console.log("iTreeSelectedId",iTreeSelectedId)

    // 左侧树
    const getLeftRender = ()=>{
        dispatch({
            type: 'subProcessArrangeSpace/getApplyModelTree',
            payload: {
                type:'ALL',
                hasPermission: '0'
            }
        })
    }
    // 列表
    function getBusinessList(ctlgId,start=1,limit=10,searchWord=''){
        dispatch({
            type:'subProcessArrangeSpace/getApplyModelList',
            payload:{
              ctlgId,
              searchWord,
              start,
              limit,
              orgIds: orgId, // 归属单位ids,多个逗号拼接
            }
        })
    }

    // 搜索
    const onSearch = (value)=>{
        if(value){
            dispatch({
              type: 'subProcessArrangeSpace/getApplyModelTree',
              payload:{
                type:'ALL',
                hasPermission:'0'
              },
              callback:(treeData)=>{
                expandedLists = []
                console.log(treeData);
                let arr = expandedLoop(treeData)
                console.log(arr);
                setExpandedList(arr)
                const res=searchTable(value,treeData)
                const newData=deleteChildren(res)
                console.log(newData);
                dispatch({
                  type:'subProcessArrangeSpace/updateStates',
                  payload:{
                    iTreeData:newData
                  }
                })
              }
            })
            treeRef.current && treeRef.current.expandAll()
          } else {
            dispatch({
              type: 'subProcessArrangeSpace/getApplyModelTree',
              payload:{
                type:'ALL',
                hasPermission:'0'
              },
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
     //点击分类获取列表
     const selectCtlgFn=(key,e)=>{
        dispatch({
            type:'subProcessArrangeSpace/updateStates',
            payload:{
              iTreeSelectedId:e.node.nodeId,
            }
        })
        getBusinessList(e.node.nodeId)
    }

    // 左侧
    const leftRender = ()=>{
        return (
            <div className={styles.left_cont}>
                <div className={styles.header}>业务应用类型</div>
                <div className={styles.left_tree}>
                    <ITree
                        ref={treeRef}
                        treeData={iTreeData}
                        onSelect={selectCtlgFn}
                        selectedKeys={iTreeSelectedId}
                        // onSearch={onSearch}
                        isSearch={false}
                        // onExpand={onExpand}
                        // expandedKeys={expandedList}    
                        defaultExpandAll={true}
                    /> 
                </div>
            </div>
        )
    }
    // page
    const changePage = (current,next)=>{   
        dispatch({
            type: 'subProcessArrangeSpace/updateStates',
            payload: {
                start: current,
                limit: next
            }
        })
        if(iTreeSelectedId){
            getBusinessList(iTreeSelectedId,current,next)
        }
    }

    const rowSelections = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys:`, selectedRowKeys, 'selectedRows: ', selectedRows);
            setSelectedRowKeys(selectedRowKeys)
            setSelectedRowData(selectedRows)
            dispatch({
                type: 'subProcessArrangeSpace/updateStates',
                payload: {
                    applySelectedRowKeys: selectedRowKeys
                }
            })
        }
    }
    console.log("returnCount",start,returnCount)

    return (
        <GlobalModal 
            title="选择应用模型"
            visible={true}
            onOk={()=>applyConfirm()}
            onCancel={handelCancel}
            mask={false}
            bodyStyle={{padding:'8px'}}
            maskClosable={false}
            getContainer={() =>{
                return document.getElementById(`sub_container`)
            }}
            widthType={3}
        >
            <div className={styles.resize_left_right}>
            <div className={styles.line}></div>
                <ReSizeLeftRight 
                    suffix={'subProcessArrangeSpace'}
                    vLeftNumLimit={238}
                    vNum={238}
                    leftChildren={leftRender()}
                    level={2}
                    rightChildren = {
                        <div className={styles.right_cont}>
                            <div className={styles.right_apply}>应用模型</div> 
                            <div className={styles.right_table}>
                                <ColumnDragTable
                                    rowKey="bizSolId"
                                    columns={applyModelColumns().columns}                                   
                                    dataSource={businessList.length>0?businessList:[]}
                                    pagination={false}
                                    rowSelection={{
                                      type: 'radio',
                                      selectedRowKeys: selectedRowKeys,
                                      ...rowSelections,
                                      // checkStrictly:true
                                    }}
                                    scroll={businessList.length?{y:'calc(100% - 100px)'}:{}}
                                />

                                <IPagination 
                                    current={start}
                                    total={Number(returnCount)}
                                    onChange={changePage}
                                    pageSize={limit}
                                    style={{bottom:0}}
                                    isRefresh={false}
                                />
                            </div>                           
                        </div>
                    }
                />
            </div>
        </GlobalModal>
    )
}

export default connect(({subProcessArrangeSpace})=>({subProcessArrangeSpace}))(ApplicationModal)