import {Modal,message,Button} from 'antd';
import {connect} from 'umi';
import RelevanceModal from '../relevanceModal/relevanceModal';
// import {superModelComputed} from '../../util/util'
import GlobalModal from '../GlobalModal'
import _ from 'loadsh'
import{useState} from 'react'
function ChangeUser({dispatch,handelCancel,bizTaskIds,spaceInfo,nameSpace,dropScopeTab,getContainerId,setParentState}){
  const {selectedDataIds} = spaceInfo;
  const [loading,setLoading]=useState(false)
  //转办
  const transferFn=()=>{
    if(selectedDataIds.length){
      setLoading(true)
      dispatch({
        type:`${nameSpace}/transferTask`,
        payload:{
          bizTaskIds:bizTaskIds,
          orgRefUserId:selectedDataIds.join(',')
        },
        callback:()=>{
          dropScopeTab&&dropScopeTab();
          dispatch({
            type:`${nameSpace}/updateStates`,
            payload:{
              selectedDataIds:[]
            }
          })
          setLoading(false)
        },
        state:spaceInfo
      })
      handelCancel()
    }else{
      message.error('请选择要转办的人员')
    }
  }
  const updateTransfer = _.debounce(transferFn, 500)
  return (
    <GlobalModal
     visible={true}
     title="选择转办的人员"
    //  onOk={transferFn}
     onCancel={handelCancel}
     widthType={3}
     top={15}
     bodyStyle={{padding:'0px'}}
     getContainer={() => {
      return document.getElementById(getContainerId)
      }}
      maskClosable={false}
      mask={false}
      footer={
        [
          <Button onClick={handelCancel}>取消</Button>,
          <Button onClick={updateTransfer} loading={loading}>确定</Button>,
        ]
      }
    >
      <RelevanceModal
        nameSpace={nameSpace}
        spaceInfo={{...spaceInfo}}
        orgUserType="USER"
        selectButtonType='radio'
        setParentState={setParentState}
      />
    </GlobalModal>
  )
}
export default connect(({formShow})=>{return {formShow}})(ChangeUser);
