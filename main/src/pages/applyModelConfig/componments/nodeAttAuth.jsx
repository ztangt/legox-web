import {Modal,Button,Input, message} from 'antd';
import {connect,history} from 'umi';
import {useEffect,useState} from 'react';
import styles from './nodeFormAuth.less';
import _ from "lodash";
import {ATTAUTHTYPE,AUTHSCOPE,DEFAULTTYPE} from '../../../service/constant';
import ApplyModelFormAuth from './applyModelFormAuth';
import indexStyles from '../index.less';
import Table from '../../../componments/columnDragTable';
const {confirm}=Modal;
const {Search} = Input;
function NodeFormAuth({dispatch,bizSolId,successChangeTab,
  changeAuthorityTab,cancelNodeModal,parentState,setParentState,query}){
  const {procDefId,attAuthorityList,bizFromInfo,actId,isShowAuthModal,preNodeTabValue,
    nextNodeTabValue,nodeChangeStatus,nextAuthorityTab,preAuthorityTab,preActId,authorityTab,
    nodeTabValue} = parentState;
  const deployFormId= bizFromInfo.formDeployId;
  const [selectedRowKeys,setSelectedRowKeys] = useState([]);
  const columns=[
    {
      title: '序号',
      dataIndex: 'index',
      width:60,
      render:(text,record,index)=><span>{index+1}</span>
    },
    {
      title: '权限类型',
      dataIndex: 'authScopeType',
      width:100,
      render:(text)=><span>{text=='ALL'?'全局权限':'节点权限'}</span>
    },
    {
      title: '授权对象',
      dataIndex: 'formColumnName',
      width:100,
    },
    {
      title: '授权类型',
      dataIndex: 'authType',
      width:150,
      render:(text)=><span>{text?ATTAUTHTYPE.filter(info=>info.key==text)[0].name:"请选择"}</span>
    },
    {
      title: '授权范围',
      dataIndex: 'authScope',
      render:(text)=>(
        <span>{text?AUTHSCOPE.filter(info=>info.key==text)[0].name:''}</span>
      )
    },
    {
      title: '范围值',
      dataIndex: 'authScopeName',
      width:150,
    },
    {
      title: '必填项',
      dataIndex: 'isRequired',
      render:(text,obj)=><span>{text==1?'必填':'非必填'}</span>
    },
  ]
  useEffect(()=>{
    //获取权限绑定
    dispatch({
      type:'applyModelConfig/getAttAuthority',
      payload:{
        bizSolId,
        procDefId,
        actId:actId,
        deployFormId,
        type:"ASSOCIATED"
      },
      callback:(data)=>{
        setParentState({
          attAuthorityList:data,
          oldAttAuthorityList:data
        })
      }
    })
  },[actId])
  //切换标签保存
  useEffect(()=>{
    if(preNodeTabValue=='node'||preAuthorityTab=='att'||(nodeTabValue=='node'&&authorityTab=='att'&&preActId==actId)){
      updateAuth();
    }
  },[preNodeTabValue,preAuthorityTab,preActId])
  const updateAuth = ()=>{
    if(nodeChangeStatus){
      //只保存节点的
      let saveData = [];
      attAuthorityList.map((item)=>{
        //删除index
        //delete(item.index);//这样会改变原数组
        if(item.authScopeType !== 'ALL'){
          let tmpItem = _.cloneDeep(item);
          delete(tmpItem.index);
          saveData.push(tmpItem);
        }
      })
      dispatch({
        type:`applyModelConfig/updateOtherAuth`,
        payload:{
          bizSolId,
          actId:actId,
          procDefId,
          deployFormId:deployFormId,
          authList:JSON.stringify(saveData),
          type:'ASSOCIATED'
        },
        callback:function(){
          message.success('保存成功')
          successChangeTab();
          changeAuthorityTab();
          setParentState({
            nodeChangeStatus:false
          })
        }
      })
    }else{
      successChangeTab();
      changeAuthorityTab();
    }
  }
  //删除
  const deleteNodeAuth=()=>{
    if (selectedRowKeys.length === 0) {
      message.warning('请选择一条数据')
      return;
    }
    confirm({
      title: '',
      content: '确认要删除吗？',
      getContainer:() =>{
        return document.getElementById(`code_modal_${bizSolId}`);
      },
      mask:false,
      onOk() {
        let newAuthList = [];
        //删除的应该是index,新增授权没有authId这个
        attAuthorityList.map((item)=>{
          if(!selectedRowKeys.includes(item.index)){
            newAuthList.push(item);
          }
        })
        setSelectedRowKeys([]);
        setParentState({
          attAuthorityList:newAuthList,
          nodeChangeStatus: true
        })
      },
      onCancel() {
      },
    });
  }
  const rowSelection={
    selectedRowKeys:selectedRowKeys,
    onChange:(selectedRowKeys,selectedRows) => {
      setSelectedRowKeys(selectedRowKeys)
    },
    getCheckboxProps: (record) => ({
      disabled: record.authScopeType === 'ALL',//全局的数据不能删除
    }),
  }
  const showAuthFn=()=>{
    setParentState({
      isShowAuthModal:true,
      authTabValue:'att'
    })
  }
  return (
    <div className={styles.node_form_auth}>
      <div className={styles.header}>
        <div className={styles.left}>
        </div>
        <div className={styles.right}>
          <Button type="primary" onClick={showAuthFn}>授权</Button>
          <Button type="primary" onClick={deleteNodeAuth}>删除</Button>
        </div>
      </div>
      <div style={{height:'calc(100% - 96px)'}}>
        <Table
          bordered
          dataSource={_.cloneDeep(attAuthorityList)}
          columns={columns}
          rowKey="index"
          pagination={false}
          scroll={{ x: 1200,y:'calc(100% - 42px)'}}
          rowSelection={{
            type:"checkbox",
            ...rowSelection
          }}
        />
      </div>
      <div className={indexStyles.node_button}>
        <Button className={styles.save} onClick={cancelNodeModal}>取消</Button>
        <Button type="primary" onClick={updateAuth} className={styles.save}>保存</Button>
      </div>
      {isShowAuthModal&&<ApplyModelFormAuth
        query={query}
        actId={actId}
        isAction={false}
        parentState={parentState}
        setParentState={setParentState}
      />}
    </div>
  )
}
export default connect(({applyModelConfig})=>{return {applyModelConfig}})(NodeFormAuth);
