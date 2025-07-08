import {connect} from 'umi';
import {Table,Button} from 'antd';
import {useEffect,useState} from 'react';
import indexStyles from '../index.less';
import styles from './formAuth.less';
const columns=[
  {
    title: '按钮名称',
    dataIndex: 'buttonName',
    width:100,
  },
  {
    title: '按钮描述',
    dataIndex: 'buttonDesc',
    width:100,
  }
]
function ButtonAuth({dispatch,bizSolId,stateObj,loading,tabValue,onCancel,authorityTab,nodeActId}){
  console.log('stateObj=',stateObj);
  const {buttonList,actId,procDefId,bizFromInfo,buttonAuthIds}=stateObj;
  // useEffect(()=>{
  //   init(actId)
  // },[])
  const [oldTabValue,setOldTabValue] = useState('');
  const [oldAuthorityTab,setOldAuthorityTab] = useState('');
  useEffect(() => {
    setOldAuthorityTab(authorityTab);
      if(oldTabValue == 'node'&&authorityTab=='viewButton'){
        updateButtonAuth()
      }
      setOldTabValue(tabValue)
  },[tabValue]);
  useEffect(() => {
    if(oldAuthorityTab == 'viewButton'){
      updateButtonAuth()
    }
    if(authorityTab=='viewButton'){
      console.log('authorityTab2=',authorityTab);
      init(actId)
    }
    setOldAuthorityTab(authorityTab);
  },[authorityTab]);
  useEffect(() => { //切换节点 保存
    if(nodeActId&&authorityTab == 'viewButton'){
      updateButtonAuth()
      //init()
    }
  },[nodeActId]);
  function init(nodeId){
    //获取全部按钮
    dispatch({
      type:"applyModelConfig/getButtonsByGroup",
      payload:{
        buttonGroupId:bizFromInfo.viewButtonGroupId
      }
    })
    //获取按钮权限绑定
     dispatch({
      type:"applyModelConfig/getButtonAuth",
      payload:{
        bizSolId,
        procDefId,
        actId:nodeId ? nodeId : nodeActId,
        buttonGroupId:bizFromInfo.viewButtonGroupId,
        deployFormId:bizFromInfo.formDeployId
      }
    })
  }
  const [changeStatus,setChangeStatus] = useState(false)
  //保存
  const updateButtonAuth=()=>{
    let buttonJson=[];
    buttonList.map((item)=>{
      if(buttonAuthIds.includes(item.buttonId)){
        buttonJson.push({
          buttonId:item.buttonId,
          isShow:'DISPLAY'
        })
      }else{
        buttonJson.push({
          buttonId:item.buttonId,
          isShow:'NONE'
        })
      }
    })
    if(changeStatus){
      dispatch({
        type:"applyModelConfig/updateButtonAuth",
        payload:{
          bizSolId,
          procDefId,
          actId,
          buttonGroupId:bizFromInfo.viewButtonGroupId,
          buttonJson:JSON.stringify(buttonJson),
          deployFormId:bizFromInfo.formDeployId,
        },
        callback:function(){
          setChangeStatus(false)
        }
      })
   }
  }
  return (
    <>
    <Table
      columns={columns}
      dataSource={buttonList}
      pagination={false}
      rowKey="buttonId"
      style={{height:'378px',overflow:'auto'}}
      rowSelection={{
        type:"checkbox",
        selectedRowKeys:buttonAuthIds,
        onChange:(selectedRowKeys)=>{
          setChangeStatus(true)
          dispatch({
            type:"applyModelConfig/updateStates",
            payload:{
              buttonAuthIds:selectedRowKeys
            }
          })
        }
      }}
    />
    <div className={indexStyles.node_button}>
      <Button type="priamry" loading={loading.global} className={styles.save} onClick={onCancel}>取消</Button>
      <Button type="priamry" onClick={updateButtonAuth} loading={loading.global} type="primary" className={styles.save} id="buttonAuthSave">保存</Button>
    </div>
    </>
  )
}
export default  connect(({applyModelConfig,loading})=>{return {applyModelConfig,loading}})(ButtonAuth)
