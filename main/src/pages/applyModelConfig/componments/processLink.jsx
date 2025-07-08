import React,{useEffect,useState} from 'react'
import { connect } from 'dva';
import {message, Modal,Spin} from 'antd'
import Progress from './process'
import GlobalModal from '../../../componments/GlobalModal';

const ProcessSortModal = ({dispatch,onCancel,procDefId,setParentState,parentState,query})=>{
  const {bizSolId} = query;
    const [processArr,setProcessArr] = useState([]);
    const [loading,setLoading] = useState(false);
    useEffect(()=>{
        getTreeData()
    },[])
    // 获取节点数数据
    const getTreeData = ()=>{
        dispatch({
            type: 'applyModelConfig/detailsTree',
            payload:{
                procDefId:procDefId
            },
            callback(value){
                setProcessArr(value)
            },
            extraParams:{
              setState:setParentState
            }
        })
    }
    const changeTreeData=(dragNode,nextItem,preItem)=>{
        // setLoading(true)
        dispatch({
          type: 'applyModelConfig/changeBpmnImgSort',
          payload: {
            id: dragNode.id,
            lastActSort: preItem?preItem.sort:undefined,
            nextActSort: nextItem?nextItem.sort:undefined
          },
          callback: (value)=>{
            setProcessArr(value)
          },
          extraParams:{
            setState:setParentState,
            state:parentState
          }
        })
      }
    //   key={processArr}
    return (
        <div>
            <GlobalModal
                visible={true}
                footer={false}
                widthType={2}
                title={'节点排序'}
                onCancel={onCancel}
                mask={false}
                maskClosable={false}
                getContainer={() =>{
                    return document.getElementById(`node_modal_${bizSolId}`)||false
                }}
            >
                <Spin spinning={loading}>
                    {processArr.length>0&&<Progress  treeList={processArr} changeTreeData={changeTreeData}/>}
                </Spin>
            </GlobalModal>
        </div>
    )
}

export default connect(({applyModelConfig})=>({applyModelConfig}))(ProcessSortModal)
