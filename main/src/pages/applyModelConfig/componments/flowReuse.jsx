import React, { useState,useRef,useEffect,useCallback } from 'react';
import { connect } from 'dva';
import {Space,Button,Table,Checkbox,Radio,Modal,Row,Tree,Spin} from 'antd';
import ITree from '../../../componments/public/iTree';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import IPagination from '../../../componments/public/iPagination';
import ColumnDragTable from '../../../componments/columnDragTable'
import GlobalModal from '../../../componments/GlobalModal';
import {dataFormat} from '../../../util/util';
import {useSelector,history } from 'umi'

import styles from '../index.less';
const FlowAbleReuse = ({dispatch,query,setParentState,saveReuse})=>{
    const {reuseLimit=10,returnCount,searchWord,currentPage,ctlgTree,selectCtlgId,processUseList,loading,reuseSelectId,reuseCtlgTree,reuseCurrentPage,reuseReturnCount} = useSelector(({applyModel})=>({...applyModel}))
    const [expandedList,setExpandedList] = useState([])
    const {bizSolCode,bizSolName,ctlgId,bizSolId} = query
    const [selectedRowKeys,setSelectedRowKeys] = useState([])
    const [selectedRowData,setSelectedRowData] = useState([])
    const treeRef = useRef(null);
    const [height,setHeight] = useState(document.documentElement.clientHeight-305)
    const onResize = useCallback(()=>{
        setHeight(document.documentElement.clientHeight-305)
    },[])
    useEffect(()=>{
        window.addEventListener('resize',onResize);
        return (()=>{
            window.removeEventListener('resize',onResize)
        })
    },[])
    const columns = [
        {
          title: '序号',
          dataIndex: 'key',
          width: 90,
          render: (text, record, index) => <div>{index + 1}</div>,
        },
        {
          title: '名称',
          dataIndex: 'modelName',
          key: 'modelName',
        },
        {
          title: '应用编码',
          dataIndex: 'modelKey',
          key: 'modelKey',
        },
        {
          title: '版本',
          dataIndex: 'processDefinitionVersion',
        },
        {
            title: '定义ID',
            dataIndex: 'processDefinitionId',
            width: 260
        },
        {
          title: '创建人',
          dataIndex: 'createUserName',
          key: 'createUserName',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          render:(text)=><div>{dataFormat(text,'YYYY-MM-DD')}</div>
        }
      ];
    // 关闭
    const onCancel = ()=>{
      setParentState({
        flowReuseModel: false
      })
    }
    useEffect(()=>{
        dispatch({
          type: 'applyModel/getCtlgTree',
          payload:{
            type:'ALL',
            hasPermission:'0'
          },
          typeName:'reuse'
        })
    },[])
    //分类id改变
  useEffect(()=>{
    if(reuseSelectId){
      getBusinessList(reuseSelectId,'',1,reuseLimit)
      dispatch({
        type:'applyModel/updateStates',
        payload:{
          searchWord:''
        }
      })
    }
  },[reuseSelectId])
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
      //搜索树名称
  const onSearch=(value)=>{
    if(value){
      dispatch({
        type: 'applyModel/getCtlgTree',
        payload:{
          type:'ALL',
          hasPermission:'0'
        },
        typeName:'reuse',
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
            type:'applyModel/updateStates',
            payload:{
              reuseCtlgTree:newData
            }
          })
        }
      })
      treeRef.current && treeRef.current.expandAll()
    } else {
      dispatch({
        type: 'applyModel/getCtlgTree',
        payload:{
          type:'ALL',
          hasPermission:'0'
        },
        typeName:'reuse'
      })
    }
  }
   //获取列表
   const getBusinessList=(ctlgId,searchWord,start,limit)=>{
    dispatch({
      type:'applyModel/getProcessReuseList',
      payload:{
        ctlgId,
        searchWord,
        start,
        limit
      }
    })
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
    const leftRender=(nodeId)=>{
        return (
          <ITree
            ref={treeRef}
            treeData={reuseCtlgTree}
            onSelect={selectCtlgFn}
            selectedKeys={reuseSelectId}
            onSearch={onSearch}
            isSearch={true}
            defaultExpandAll={true}
            // onExpand={onExpand}
            // expandedKeys={expandedList}
            style={{width:'100%',padding:'8px 0px 0px'}}
          />
        )
      }
      //点击分类获取列表
    const selectCtlgFn=(key,e)=>{
        dispatch({
            type:'applyModel/updateStates',
            payload:{
              reuseSelectId:e.node.nodeId,
            }
        })
    }
    const rowSelections = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys:`, selectedRowKeys, 'selectedRows: ', selectedRows);
            setSelectedRowKeys(selectedRowKeys)
            setSelectedRowData(selectedRows)
        }
    }
    //选中行
    const selectRow=(record)=>{
      return {
        onClick:()=>{
          setSelectedRowKeys([record.processDefinitionId])
          setSelectedRowData([record])
        }
      }
    }
    const onExpand=(expandedKeys, { expanded, node })=>{
      console.log(expandedKeys,'expandedKeys');
      setExpandedList(expandedKeys)
  }

    // 右侧渲染
    const rightRender = ()=>{
        return (
        <>
            <div style={{height:"calc(100% - 44px)"}}>
              <ColumnDragTable
                columns={columns}
                dataSource={processUseList.length>0&&processUseList}
                rowKey='processDefinitionId'
                pagination={false}
                onRow={selectRow}
                rowSelection={{
                  type: 'radio',
                  selectedRowKeys: selectedRowKeys,
                  ...rowSelections,
                  // checkStrictly:true
                }}
                scroll={processUseList.length?{y:'calc(100% - 40px)'}:{}}
              //   expandable={{
              //     // onExpand:onExpand,
              //     indentSize:25,
              //     expandIcon: ({ expanded, onExpand, record }) =>
              //         record.children.length =='0'?null:(
              //         expanded ? (
              //             <CaretDownOutlined
              //             onClick={(e) => {
              //                 e.stopPropagation();
              //                 // onExpand(record, e);
              //             }}
              //             />
              //         ) : (
              //             <CaretRightOutlined
              //             onClick={(e) => {
              //                 e.stopPropagation();
              //                 // onExpand(record, e);
              //             }}
              //             />
              //         )
              //         )
              //     }}
              />
            </div>
            <IPagination
              // style={{width:'68%'}}
              current={reuseCurrentPage}
              total={Number(reuseReturnCount)}
              onChange={changePage}
              pageSize={reuseLimit}
              isRefresh={false}
              style={{height:'44px'}}
              // refreshDataFn={()=>{getBusinessList(reuseSelectId,searchWord,reuseCurrentPage,reuseLimit)}}
            />
          </>)
    }
    //分页
    const changePage=(nextPage,size)=>{
        dispatch({
          type:"applyModel/updateStates",
          payload:{
            reuseLimit:size
          }
        })
        getBusinessList(reuseSelectId,searchWord,nextPage,size)
    }
    const onSave = ()=>{

        dispatch({
            type: 'upBpmnFile/addBpmnFlow',
            payload: {
                modelKey: bizSolCode,
                modelName: bizSolName,
                ctlgId: ctlgId,
                processDefinitionId: selectedRowData[0].processDefinitionId
            },
            callback: value=>{
              saveReuse(true)
              // historyPush({
              //   pathname: '/applyModelConfig/designFlowable',
              //   query: {
              //     bizSolCode: query.bizSolCode,
              //     bizSolId: query.bizSolId,
              //     bizSolName: query.bizSolName,
              //     ctlgId: query.ctlgId,
              //     isReuse: true // 增加流程复用标识
              //   }
              // })
            }
        })
        onCancel()
    }
    return (
        <GlobalModal
            visible={true}
            widthType={2}
            title='流程复用'
            bodyStyle={{overflow:'hidden',position:'relative',padding:'0px'}}
            onCancel={onCancel}
            mask={false}
            maskClosable={false}
            getContainer={() =>{
                return  document.getElementById(`form_modal_${bizSolId}`)||false
            }}
            footer={[
            <Row justify="end">
              <Button  onClick={onCancel}   htmlType="submit" loading={loading}>
                  取消
              </Button>
              <Button  onClick={onSave} type="primary" htmlType="submit" loading={loading}>
                  确定
              </Button>
            </Row>
            ]}
            >
            <div className={styles.reuse}>
                <ReSizeLeftRight
                    leftChildren={leftRender(reuseSelectId)}
                    rightChildren={rightRender()}
                    suffix={`flowResuse_${bizSolId}`}
                />
            </div>
        </GlobalModal>
    )
}


export default connect(({
    applyModelConfig,
    applyModel
    ,layoutG})=>({applyModelConfig,layoutG,applyModel}))(FlowAbleReuse)
