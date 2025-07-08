import {Modal,message} from 'antd';
import {connect} from 'umi';
import RelevanceModal from '../relevanceModalState/relevanceModal';
import GlobalModal from '../GlobalModal'
import './index.less'

function ChangeUser({dispatch,handelCancel,bizTaskIds,spaceInfo,nameSpace,dropScopeTab,getContainerId,updateState}){
  const {selectedDataIds} = spaceInfo;
  //转办
  const transferFn=()=>{
    if(selectedDataIds.length){
      dispatch({
        type:`${nameSpace}/transferTask`,
        payload:{
          bizTaskIds:bizTaskIds,
          orgRefUserId:selectedDataIds.join(',')
        },
        callback:()=>{
          handelCancel()
          dropScopeTab&&dropScopeTab();
        }
      })
    }else{
      message.error('请选择要转办的人员')
    }
  }
  return (
    <GlobalModal
     visible={true}
     title="选择转办的人员"
     onOk={transferFn}
     onCancel={handelCancel}
     widthType={3}
     top={15}
     className="formPreview"
     bodyStyle={{padding:'16px 0px 0px 0px'}}
     getContainer={() => {
      return document.getElementById(getContainerId)
      }}
      maskClosable={false}
      mask={false}
    >
      <RelevanceModal
        nameSpace={nameSpace}
        spaceInfo={{...spaceInfo}}
        orgUserType="USER"
        selectButtonType='radio'
        updateState={updateState}
      />
    </GlobalModal>
  )
}
export default connect(({formShow})=>{return {formShow}})(ChangeUser);
