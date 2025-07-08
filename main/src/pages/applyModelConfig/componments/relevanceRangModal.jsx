import {Modal} from 'antd';
import RelevanceModal from '../../../componments/relevanceModal/relevanceModal';
import {connect,history} from 'umi';
import GlobalModal from '../../../componments/GlobalModal';
function RelevanceRangModal({query,dispatch,orgUserType,form,selectButtonId,parentState,setParentState,containerId}){
  const bizSolId = query.bizSolId;
  const {selectedDatas,selectedDataIds} = parentState;

  const handelCancle=()=>{
    setParentState({
      isShowReleveModal:false
    })
    form.setFieldsValue({[`rangeType_${selectButtonId}`]:form.getFieldValue(`old_rangeType_${selectButtonId}`)});
    // 重置form的prev值
    // setFromListValue(buttonList);
    // form.setFieldsValue({[`range_${selectButtonId}`]:form.getFieldValue(`old_range_${selectButtonId}`)});
  }
  const onOk=()=>{
    let nameValue = [];
    if(orgUserType=='USER'){
      selectedDatas.map((item)=>{
        nameValue.push(item.userName);
      })
    }else if(orgUserType=='RULE'){
      selectedDatas.map((item)=>{
        nameValue.push(item.roleName);
      })
    }else{
      selectedDatas.map((item)=>{
        nameValue.push(item.nodeName);
      })
    }
    form.setFieldsValue({[`rangeContentId_${selectButtonId}`]:selectedDataIds.join(',')})
    form.setFieldsValue({[`rangeContentValue_${selectButtonId}`]:nameValue.join(',') ? nameValue.join(',') : '所有人'})
    form.setFieldsValue({[`old_range_${selectButtonId}`]:form.getFieldValue(`range_${selectButtonId}`)});
    form.setFieldsValue({[`old_rangeType_${selectButtonId}`]:nameValue.join(',')?form.getFieldValue(`rangeType_${selectButtonId}`):'ALL'});
    if(!nameValue.join(',')){
      form.setFieldsValue({[`rangeType_${selectButtonId}`]:'ALL'});
    }
    setParentState({
      isShowReleveModal:false
    })
  }
  return (
    <GlobalModal
      visible={true}
      onCancel={handelCancle}
      onOk={onOk}
      widthType={3}
      centered
      mask={false}
      maskClosable={false}
      bodyStyle={{overflow:'hidden',padding:'0px'}}
      getContainer={() =>{
        return document.getElementById(`code_modal_${bizSolId}`)||false
      }}
    >
      <RelevanceModal
        nameSpace="applyModelConfig"
        spaceInfo={_.cloneDeep(parentState)}
        orgUserType={orgUserType}
        setParentState={setParentState}
        containerId={containerId}
      />
    </GlobalModal>
  )
}
export default connect(({applyModelConfig})=>{return {applyModelConfig}})(RelevanceRangModal)
