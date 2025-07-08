/*传阅的人员*/
import {Modal,message} from 'antd';
import {connect} from 'umi';
import { useEffect,useState,useCallback } from 'react';
import TreeRelevanceModal from '../relevanceModalState/treeRelevance';
import GlobalModal from '../GlobalModal'
import './index.less'
function CirculateModal({dispatch,state,setState,targetKey}){
  const {bizSolId,bizInfoId,bizTaskId,selectedDatas,selectedDataIds,bizInfo,cutomHeaders,treeData} = state;
  // const [height, setHeight] = useState(
  //   document.getElementById('formShow_container').offsetHeight * 0.8 - 87
  // )
  // const onResize = useCallback(() => {
  //   setHeight(
  //     Number(
  //       document.getElementById('formShow_container').offsetHeight * 0.8 - 87
  //     )
  //   )
  // }, [])

  // useEffect(() => {
  //   window.addEventListener('resize', onResize)
  //   return () => {
  //     window.removeEventListener('resize', onResize)
  //   }
  // }, [])
  useEffect(()=>{
    //获取树的数据
    dispatch({
      type:"formShow/getCurrentOrg",
      payload:{

      },
      callback:(treeData)=>{
        setState({
          treeData
        })
      }
    })
  },[])
  const handelCancel=()=>{
    setState({
      isShowCirculate:false,
      treeData:[],
      selectedDataIds:[]
    })
  }
  //传阅
  const circulateFn=()=>{
    console.log('selectedDatas=',selectedDatas);
    if(selectedDataIds.length){
      dispatch({
        type:`formShow/circulateTask`,
        payload:{
          bizTaskId:bizTaskId,
          bizInfoId:bizInfo.bizInfoId,
          usersJson:JSON.stringify(selectedDatas),
          headers:cutomHeaders
        },
        callback:()=>{
          handelCancel()
        }
      })
    }else{
      message.error('请选择要传阅的人员')
    }
  }
  const getNoReOrgChildren=(node)=>{
    dispatch({
      type: 'formShow/getNoReOrgChildren',
      payload:{
        nodeType:'DEPT',
        nodeId: node.nodeId,
        nodeKey:node.nodeId,
        start:1,
        limit:200
      },
      treeData:treeData,
      callback:(treeData)=>{
        setState({
          treeData
        })
      }
    })
  }
  //搜索单位树
  // function searchOrgTree(value){
  //   dispatch({
  //     type:"formShow/getSearchSendTree",
  //     payload:{
  //       nodeIds:treeData[0].nodeId,
  //       nodeType:treeData[0].nodeType.split(',')[0],
  //       subordinate:1,
  //       searchWord:value
  //     }
  //   })
  // }
  return (
    <GlobalModal
     visible={true}
     title="选择传阅的人员"
     onOk={circulateFn}
     onCancel={handelCancel}
     mask={false}
     bodyStyle={{padding:'10px 0 0 0'}}
     maskClosable={false}
     getContainer={() =>{
         return document.getElementById(`formShow_container_${targetKey}`)
     }}
     widthType={3}
    >
      <TreeRelevanceModal
        nameSpace={'formShow'}
        spaceInfo={{...state}}
        orgUserType="ORG"
        selectButtonType='checkBox'
        getOrgChildren={getNoReOrgChildren}
        field={{titleName:"nodeName",key:"nodeId",isLeaf:'isParent',children:"children"}}
        updateState={setState}
      />
    </GlobalModal>
  )
}
export default connect(({formShow})=>{return {formShow}})(CirculateModal);
