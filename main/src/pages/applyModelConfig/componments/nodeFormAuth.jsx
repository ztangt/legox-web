import {Modal,Button,Input, message} from 'antd';
import {connect,history} from 'umi';
import {useEffect,useState} from 'react';
import styles from './nodeFormAuth.less';
import _ from "lodash";
import {AUTHTYPE,AUTHSCOPE,DEFAULTTYPE} from '../../../service/constant';
import ApplyModelFormAuth from './applyModelFormAuth';
import indexStyles from '../index.less';
import Table from '../../../componments/columnDragTable';
const {confirm}=Modal;
const {Search} = Input;
function NodeFormAuth({dispatch,bizSolId,successChangeTab,
  changeAuthorityTab,cancelNodeModal,parentState,setParentState,query}){
  const {procDefId,authList,oldAuthList,bizFromInfo,actId,isShowAuthModal,preNodeTabValue,
    nextNodeTabValue,nodeChangeStatus,nextAuthorityTab,preAuthorityTab,preActId,authorityTab,
    nodeTabValue} = parentState;
  const deployFormId= bizFromInfo.formDeployId;
  const [searchWord,setSearchWord] = useState('');
  const [selectedRowKeys,setSelectedRowKeys] = useState([]);
  const columns=[
    {
      title: '权限类型',
      dataIndex: 'authScopeType',
      width:100,
      render:(text)=><span>{text=='ALL'?'全局权限':'节点权限'}</span>
    },
    {
      title: '字段名称',
      dataIndex: 'formColumnName',
      width:100,
    },
    {
      title: '字段编码',
      dataIndex: 'formColumnCode',
      width:100,
    },
    {
      title: '权限类型',
      dataIndex: 'authType',
      width:150,
      render:(text)=><span>{text?AUTHTYPE.filter(info=>info.key==text)[0].name:"请选择"}</span>
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
      title: '默认值',
      dataIndex: 'defaultType',
      render:(text)=><span>{text?DEFAULTTYPE.filter(info=>info.key==text)?.[0]?.name:""}</span>
    },
    {
      title: '固定值',
      dataIndex: 'defaultVal',
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
      type:'applyModelConfig/getAuthority',
      payload:{
        bizSolId,
        procDefId,
        actId:actId,
        deployFormId
      },
      extraParams:{
        setState:setParentState
      }
    })
  },[actId])
  //切换标签保存
  useEffect(()=>{
    if(preNodeTabValue=='node'||preAuthorityTab=='form'||(nodeTabValue=='node'&&authorityTab=='form'&&preActId==actId)){
      updateAuth();
    }
  },[preNodeTabValue,preAuthorityTab,preActId])
  const updateAuth = ()=>{
    if(nodeChangeStatus){
      //只保存节点的
      let saveData = [];
      oldAuthList.map((item)=>{
        //删除index
        //delete(item.index);//这样会改变原数组
        if(item.authScopeType !== 'ALL'){
          let tmpItem = _.cloneDeep(item);
          delete(tmpItem.index);
          saveData.push(tmpItem);
        }
      })
      dispatch({
        type:`applyModelConfig/updateAuth`,
        payload:{
          bizSolId,
          actId:actId,
          procDefId,
          deployFormId:deployFormId,
          authList:JSON.stringify(saveData)
        },
        callback:function(){
          successChangeTab();
          changeAuthorityTab();
        }
      })
    }else{
      successChangeTab();
      changeAuthorityTab();
    }
  }
  const searchWordFn=(value)=>{
    let newAuthList = [];
    oldAuthList.map((item)=>{
      if(item.formColumnName.includes(value)||item.formColumnCode.includes(value)){
        newAuthList.push(item)
      }
    })
    setParentState({
      authList:newAuthList
    })
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
        authList.map((item)=>{
          if(!selectedRowKeys.includes(item.index)){
            newAuthList.push(item);
          }
        })
        setSelectedRowKeys([]);
        setParentState({
          authList:newAuthList,
          nodeChangeStatus: true,
          oldAuthList:newAuthList
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
      authTabValue:'form'
    })
  }
  //改变授权则清空搜索词
  useEffect(()=>{
    setSearchWord('');
    setParentState({
      authList:oldAuthList
    })
  },[oldAuthList])
  return (
    <div className={styles.node_form_auth}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Search
            onChange={(e)=>{setSearchWord(e.target.value)}}
            onSearch={searchWordFn}
            placeholder="请输入字段名称或编码"
            value={searchWord}
            style={{width:'200px'}}
            allowClear
          />
        </div>
        <div className={styles.right}>
          <Button type="primary" onClick={showAuthFn}>授权</Button>
          <Button type="primary" onClick={deleteNodeAuth}>删除</Button>
        </div>
      </div>
      <div style={{height:'calc(100% - 96px)'}}>
        <Table
          bordered
          dataSource={_.cloneDeep(authList)}
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
