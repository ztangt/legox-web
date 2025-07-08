/**
 * 关联弹框的保存操作
 */
import {Modal}  from 'antd';
import {connect,history} from 'umi';
import RelevanceModal from '../../../componments/relevanceModal/relevanceModal';
import _ from 'lodash';
import styles from './userModal.less';
function Index({dispatch,namespace,stateObj,selectedRowKeys,setParentState,containerId}){
  const {colAuthorityList,selectedDatas,selectedDataIds,selectFormColumnId,orgUserType,selectCol}=stateObj;
  //关闭
  const handleUserCancle=()=>{
    setParentState({
      isShowUserModel:false,
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
    colAuthorityList.map((item)=>{
      if((selectedRowKeys.includes(selectFormColumnId)&&selectedRowKeys.includes(item.formColumnId))||item.formColumnId==selectFormColumnId){
        if(selectCol=='authScopeName'||selectCol=='authScope'){
          if(selectedDataIds.length){
            item['authScopeId'] = selectedDataIds.join(',')
            item['authScopeName'] = nameValue.join(',')
            item['authScope']=orgUserType
          }else{
            item['authScope']='NONE'
            item['authScopeId'] = ''
            item['authScopeName'] = '请选择'
          }
        }else if(selectCol=='defaultVal'||selectCol=='defaultType'){
          if(selectedDataIds.length){
            item['defaultIdVal'] = selectedDataIds.join(',')
            item['defaultVal'] = nameValue.join(',')
            item['defaultType']=orgUserType
          }else{
            item['defaultType']='NONE'
            item['defaultIdVal'] = ''
            item['defaultVal'] = '请选择'
          }
        }
      }
    })
    setParentState({
      colAuthorityList:colAuthorityList,
      isShowUserModel:false
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
