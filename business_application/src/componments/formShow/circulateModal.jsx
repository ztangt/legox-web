import {Modal,message} from 'antd';
import {connect} from 'umi';
import { useEffect } from 'react';
import TreeRelevanceModal from '../relevanceModal/treeRelevance';
// import {superModelComputed} from '../../util/util'
import GlobalModal from '../GlobalModal'
import './conditionModal.less'
function CirculateModal({location,dispatch,formShow}){
  const bizSolId = location.query.bizSolId;
  const bizInfoId = location.query.bizInfoId;
  const currentTab = location.query.currentTab;
  const bizTaskId = location.query.bizTaskId;
  const {stateObj} = formShow;
  const {bizInfo,selectedDatas,selectedDataIds} = stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab];
  useEffect(()=>{
    //获取树的数据
    dispatch({
      type:"formShow/getCurrentOrg",
      payload:{

      }
    })
  },[])
  const handelCancel=()=>{
    dispatch({
      type:"formShow/updateStates",
      payload:{
        isShowCirculate:false,
        treeData:[],
        selectedDataIds:[]
      }
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
          usersJson:JSON.stringify(selectedDatas)
        },
        callback:()=>{
          handelCancel()
        }
      })
    }else{
      message.error('请选择要传阅的人员')
    }
  }
  const getOrgChildren=(node)=>{
    dispatch({
      type: 'formShow/getOrgChildren',
      payload:{
        nodeType:'DEPT',
        nodeId: node.nodeId,
        start:1,
        limit:200
      },
    })
  }
  //搜索单位树
  function searchOrgTree(value){
    dispatch({
      type:"formShow/getSearchSendTree",
      payload:{
        nodeIds:treeData[0].nodeId,
        nodeType:treeData[0].nodeType.split(',')[0],
        subordinate:1,
        searchWord:value
      }
    })
  }
  return (
    <GlobalModal
     visible={true}
     title="选择传阅的人员"
     onOk={circulateFn}
     onCancel={handelCancel}
     widthType={3}
     top={15}
     mask={false}
     bodyStyle={{padding:'0px'}}
     maskClosable={false}
     getContainer={() =>{
         return document.getElementById('formShow_container')
     }}
    >
      <TreeRelevanceModal
        nameSpace={'formShow'}
        spaceInfo={{...stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab]}}
        orgUserType="ORG"
        selectButtonType='checkBox'
        getOrgChildren={getOrgChildren}
        field={{titleName:"nodeName",key:"nodeId",isLeaf:'isParent',children:"children"}}
      />
    </GlobalModal>
  )
}
export default connect(({formShow})=>{return {formShow}})(CirculateModal);
