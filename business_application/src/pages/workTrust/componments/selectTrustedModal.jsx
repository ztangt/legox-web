import RelevanceModal from '../../../componments/relevanceModal/relevanceModal';
import {Modal,message} from 'antd';
import {connect} from 'umi';
import GlobalModal from '../../../componments/GlobalModal';
function SelectTrusted({dispatch,workTrust,form}){
  const {selectedDatas,selectedDataIds} = workTrust;
  console.log(selectedDataIds,'selectedDataIds');
  console.log(selectedDatas,'selectedDatas');
  const handelCancel=()=>{
    dispatch({
      type:"workTrust/updateStates",
      payload:{
        isShowSelectUser:false,
      }
    })
  }
  const saveTrusted=()=>{
   form.setFields([
    {
      name:['trustedIdentityId'],
      value:selectedDatas[0]?.orgRefUserId
    },
    {
      name:['trustedUserName'],
      value:selectedDatas[0]?.userName
    },
  ]);
    if(selectedDatas[0]?.userName){
      handelCancel()
    }
    else{
      message.warning('请选择被委托人')
    }
    
  }
 return (
  <Modal
    title="选择被委托人"
    visible={true}
    width={900}
    bodyStyle={{height:'calc(100vh - 315px)',padding:'16px'}}
    // widthType={3}
    onCancel={handelCancel}
    onOk={saveTrusted}
    getContainer={() =>{
      return document.getElementById('work_trust')||false
    }}
    maskClosable={false}
    mask={false}
  >
    <RelevanceModal
      nameSpace="workTrust"
      spaceInfo={workTrust}
      orgUserType="USER"
      selectButtonType="radio"
      treeType={"ORG"}
      type={"INCLUDESUB"}
      nodeIds={""}
    />
  </Modal>
 )
}
export default connect(({workTrust,loading})=>{return {workTrust,loading}})(SelectTrusted)
