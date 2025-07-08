/**
 * 关联弹框的保存操作
 */
import {Modal}  from 'antd';
import {connect,history} from 'umi';
import RelevanceModal from '../../../componments/relevanceModal/relevanceModal';
import _ from 'lodash';
import styles from './userModal.less';
function Index({dispatch,namespace,stateObj,setParentState,containerId}){
  const {selectedDatas,selectedDataIds,orgUserType,attAuthList,selectFormColumnCode}=stateObj;
  //关闭
  const handleUserCancle=()=>{
    setParentState({
      isShowAttUserModel:false,
      selectedDataIds:[],
      selectedDatas:[]
    })
  }
  //保存
  const saveSelectUsers=()=>{
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
    attAuthList.map((item)=>{
      if(item.formColumnCode==selectFormColumnCode){
        if(selectedDataIds.length){
          item['authScopeId'] = selectedDataIds.join(',')
          item['authScopeName'] = nameValue.join(',')
          item['authScope']=orgUserType
        }else{
          item['authScope']='NONE'
          item['authScopeId'] = ''
          item['authScopeName'] = '请选择'
        }
      }
    })
    setParentState({
      attAuthList:attAuthList,
      isShowAttUserModel:false
    })
  }
  return (
    <Modal
    visible={true}
    onCancel={handleUserCancle}
    width={'95%'}
    mask={false}
    maskClosable={false}
    bodyStyle={{paddingBottom:'0px',overflow:'auto'}}
    onOk={saveSelectUsers}
    className={styles.user_modal}
    centered
  >
    <RelevanceModal
      nameSpace={namespace}
      spaceInfo={{...stateObj}}
      orgUserType={orgUserType}
      setParentState={setParentState}
      containerId={containerId}
    />
  </Modal>
  )
}
export default connect(({loading,layoutG,applyModelFormAuth,applyModelConfig})=>{return {loading,layoutG,applyModelFormAuth,applyModelConfig}})(Index);
