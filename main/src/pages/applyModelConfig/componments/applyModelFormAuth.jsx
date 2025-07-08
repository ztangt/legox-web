import {connect,history} from 'umi';
import FormAuth from './formAuth';
import AttAuth from './attAuth';
import {Modal} from 'antd';
import styles from './applyModelFormAuth.less';
import Tabs from '../../../componments/TLTabs';
import {useRef} from 'react';
function Index({dispatch,query,actId,isAction,parentState,setParentState}){
  const bizSolId = query.bizSolId;
  const {procDefId,bizFromInfo,isSaveFormAuth,authTabValue} = parentState;
  const deployFormId= bizFromInfo.formDeployId;
  const attRef = useRef(null);
  const formRef = useRef(null);
  const handelCancle=()=>{
    setParentState({
      isShowAuthModal:false
    })
  }
  //切换页签调用保存
  const changeTabs=(value)=>{
    debugger;
    if(authTabValue=='att'){
      attRef.current?.updateAuth();
    }else if(authTabValue=='form'){
      formRef.current?.updateAuth();
    }
    setParentState({
      authTabValue:value
    })
  }
  return (
    <Modal
      visible={true}
      onCancel={handelCancle}
      footer={null}
      width={'95%'}
      centered
      maskClosable={false}
      title={actId&&actId!='0'?'节点表单权限设置':'全局表单权限设置'}
      bodyStyle={{padding:'0px',height:'calc(100vh - 200px)'}}
      className={styles.apply_auth_warp}
    >
      <Tabs tab="建模概述" key="info" onChange={changeTabs.bind(this)} activeKey={authTabValue}>
        {(authTabValue=='form'&&actId)||!actId?
        <Tabs.TabPane tab="字段授权" key="form">
          <FormAuth
            actId={actId}
            bizSolId={bizSolId}
            deployFormId={deployFormId}
            procDefId={procDefId}
            stateObj={parentState}
            namespace="applyModelConfig"
            onCancel={handelCancle}
            isAction={isAction}
            bizFromInfo={bizFromInfo}
            isSaveFormAuth={isSaveFormAuth}
            setParentState={setParentState}
            formRef={formRef}
          />
        </Tabs.TabPane>
        :null}
        {(authTabValue=='att'&&actId)||(!actId&&bizFromInfo?.template?.includes('ANNEX'))?
        <Tabs.TabPane tab="关联文档" key="att">
          <AttAuth
            actId={actId}
            bizSolId={bizSolId}
            deployFormId={deployFormId}
            procDefId={procDefId}
            stateObj={parentState}
            namespace="applyModelConfig"
            bizFromInfo={bizFromInfo}
            setParentState={setParentState}
            attRef = {attRef}
            onCancel={handelCancle}
            isAction={isAction}
          />
        </Tabs.TabPane>
        :null}
      </Tabs>
    </Modal>
  )
}
export default connect(({loading,layoutG,applyModelConfig})=>{return {loading,layoutG,applyModelConfig}})(Index);
