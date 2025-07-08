import {Table,Button,Select,Switch,Input,message}  from 'antd';
import {connect,history} from 'umi';
import {EditableCell,EditableRow} from '../../../componments/public/editableCell';
import {ATTAUTHTYPE,AUTHSCOPE,DEFAULTTYPEOBJECT} from '../../../service/constant';
import styles from './formAuth.less';
import indexStyles from '../index.less';
import {useEffect,useState,useRef,forwardRef,useImperativeHandle} from 'react';
import UserModalAtt from './userModalAtt';
import _ from 'lodash';
import ColumnDragTable from '../../../componments/columnDragTable'
const Option=Select.Option;
//actId为父节点传过来的actId，actId为0为全局配置，actId存在为节点配置
const Index=forwardRef(({dispatch,loading,actId,stateObj,bizSolId,deployFormId,procDefId,namespace,
  isAction,onCancel,setParentState,attRef})=>{
  const {isShowAttUserModel,attAuthList,attAuthorityList}=stateObj;
  const [changeStatus,setChangeStatus] = useState(false);
  const authRef = useRef()
  useImperativeHandle(attRef, () => {
    return {
      updateAuth,
    };
  });
  let columns=[
    {
      title: '序号',
      dataIndex: 'index',
      width:60,
      render:(text,record,index)=><div>{index+1}</div>
    },
    {
      title: '授权对象',
      dataIndex: 'formColumnCode',
      width:100,
      render:(text)=><div>{text=='REL_FILE'?'关联平台内文件':'附件'}</div>
    },
    {
      title: '授权类型',
      dataIndex: 'authType',
      width:150,
      render:(text,obj,index)=>{
        return (
            <Select
              onSelect={updateAuthListDataFn.bind(this,'authType',obj,index)}
              value={text?text:''}
              style={{width:'100px'}}
            >
              {ATTAUTHTYPE.map((item)=>{
                return (<Option value={item.key} key={item.key}>{item.name}</Option>)
              })}
            </Select>
        )
      }
    },
    {
      title: '授权范围',
      dataIndex: 'authScope',
      render:(text,obj,index)=>(
        <Select
          onSelect={updateAuthListDataFn.bind(this,'authScope',obj,index)}
          value={text?text:'NONE'}
          style={{width:'100px'}}
          disabled={obj.hideFlag==1?true:false}
        >
          {AUTHSCOPE.map((item)=>{
            return (<Option value={item.key} key={item.key}>{item.name}</Option>)
          })}
        </Select>
      )
    },
    {
      title: '范围值',
      dataIndex: 'authScopeName',
      width:150,
      render:(text,obj,index)=><div
          onClick={changeAuthScope.bind(this,obj,'authScopeName',index)}
          >
          {text}
        </div>
    },
    {
      title: '必填项',
      dataIndex: 'isRequired',
      render:(text,obj,index)=>
      <Switch
        checked={text==1?true:false}
        onChange={updateAuthListDataFn.bind(this,'isRequired',obj,index)}
      />
    }
  ]
  useEffect(()=>{
    //获取上次保存的关联文档授权信息
    getAttAuthList()
  },[])
  const getAttAuthList=()=>{
    dispatch({
      type:'applyModelConfig/getAttAuthList',
      payload:{
        bizSolId,
        procDefId:procDefId,
        actId:actId,
        deployFormId,
        type:'ASSOCIATED'
      },
      callback:(data)=>{
        setParentState({
          attAuthList:data
        })
      }
    })
  }
  //改变授权直
  const changeAuthScope=(info,col,index)=>{
    if((col=='authScopeName'&&(info.authScope=='USER'||info.authScope=='ORG'||info.authScope=='DEPT'||info.authScope=='POST'
    ||info.authScope=='USERGROUP'||info.authScope=='RULE'))){
      let selectedDataIds=info.authScopeId?info.authScopeId.split(','):[];
      let orgUserType = info.authScope;
      //弹出用户选择框
      setParentState({
        isShowAttUserModel:true,
        selectedDataIds:selectedDataIds,
        selectedDatas:[],
        selectFormColumnCode:info.formColumnCode,
        orgUserType:orgUserType,
      })
      setChangeStatus(true);
    }
  }
  //更新授权列表数据
  const updateAuthListDataFn=(col,info,index,value)=>{
    if((col=='authScope'&&(value=='USER'||value=='ORG'||value=='DEPT'||value=='POST'
    ||value=='USERGROUP'||value=='RULE'))){
      let selectedDataIds=[];//切换授权范围直接清空选择值
      let orgUserType = value;
      //弹出用户选择框
      setParentState({
        isShowAttUserModel:true,
        selectedDataIds:selectedDataIds,
        selectedDatas:[],
        selectFormColumnCode:info.formColumnCode,
        orgUserType:orgUserType
      })
    }else{
      if(col=='isRequired'){
        attAuthList[index][col]=value?"1":"0";
      }
      if(col=='authType'){
        attAuthList[index][col]=value
      }
      if(col=='authScope'){
        if(value=='USER'||value=='ORG'||value=='DEPT'||value=='POST'
        ||value=='USERGROUP'||value=='RULE'){
          //item['authScopeName']='';
        }else{
          attAuthList[index][col]=value;
          attAuthList[index]['authScopeName']=AUTHSCOPE.filter(i=>i.key==value)[0].name;
          attAuthList[index]['authScopeId']='';
        }
      }
    }
    setParentState({
      attAuthList:attAuthList
    })
    setChangeStatus(true);
  }
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  columns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title
      }),
    };
  });
  //保存
  const updateAuth=(isClose)=>{
    if(changeStatus){
      let newColAuthorityList=[];
      attAuthList.map((item)=>{
        if((item.authType&&item.authType!='NONE')||(item.authScope&&item.authScope!='NONE')||
          item.isRequired==1||item.authType){
          newColAuthorityList.push(item);
        }
      })
      if(isAction){//是否调用更新接口，全局调用，节点不调用
        //只给后端更改的数据
        dispatch({
          type:`${namespace}/updateOtherAuth`,
          payload:{
            bizSolId,
            actId:actId,
            procDefId,
            deployFormId:deployFormId,
            authList:JSON.stringify(newColAuthorityList),
            type:'ASSOCIATED'
          },
          callback:()=>{
            message.success('保存成功');
            setChangeStatus(false);
            if(isClose){
              setParentState({
                isShowAuthModal:false
              })
            }
          }
        })
      }else{
        setChangeStatus(false);
        //显示全局的和节点的
        let allAuthList = [];
        attAuthorityList.map((item)=>{
          if(item.authScopeType === 'ALL'){
            allAuthList.push(item)
          }
        })
        let newAuthList = newColAuthorityList.concat(allAuthList);
        newAuthList.map((item,index)=>{
          item.index=index+1;//用于删除
        })
        if(isClose){
          setParentState({
            attAuthorityList:newAuthList,
            isShowAuthModal:false,
            nodeChangeStatus:true//用于节点是否保存
          })
        }else{
          setParentState({
            attAuthorityList:newAuthList,
            nodeChangeStatus:true//用于节点是否保存
          })
        }
      }
    }else{
      if(isClose){
        setParentState({
          isShowAuthModal:false
        })
      }
    }
  }
  return (
    <div className={styles.auth_warp} ref={authRef}>
      <div style={{height:"calc(100% - 100px"}}>
        <ColumnDragTable
          params={{bizSolId:bizSolId,deployFormId:deployFormId}}
          components={components}
          bordered
          dataSource={attAuthList}
          columns={columns}
          rowKey="id"
          pagination={false}
          scroll={{ x: 1200,y:'calc(100% - 42px)'}}
          taskType={'MONITOR'}
        />
      </div>
      <div className={indexStyles.node_button}>
        <Button type="priamry" loading={loading.global} className={styles.save} onClick={onCancel}>取消</Button>
        <Button type="priamry" onClick={updateAuth.bind(this,true)} loading={loading.global} className={styles.save} id="formAuthSave">保存</Button>
      </div>
      {isShowAttUserModel&&
        <UserModalAtt
          namespace={namespace}
          stateObj={stateObj}
          setParentState={setParentState}
          containerId={`attAuth_${procDefId}_${actId}_${bizSolId}`}
        />
      }
    </div>
  )
})
export default connect(({loading,layoutG,applyModelFormAuth,applyModelConfig})=>{return {loading,layoutG,applyModelFormAuth,applyModelConfig}})(Index);
