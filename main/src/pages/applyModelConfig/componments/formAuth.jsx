import {Table,Button,Select,Switch,Input,message}  from 'antd';
import {connect,history} from 'umi';
import {EditableCell,EditableRow} from '../../../componments/public/editableCell';
import {AUTHTYPE,AUTHSCOPE,DEFAULTTYPEOBJECT} from '../../../service/constant';
import styles from './formAuth.less';
import indexStyles from '../index.less';
import {useEffect,useState,useRef,useImperativeHandle,forwardRef} from 'react';
import UserModal from './userModal';
import _ from 'lodash';
import ColumnDragTable from '../../../componments/columnDragTable'
const Option=Select.Option;
//actId为父节点传过来的actId，actId为0为全局配置，actId存在为节点配置
const Index=forwardRef(({formRef,dispatch,loading,actId,stateObj,bizSolId,deployFormId,procDefId,namespace,
  isAction,onCancel,setParentState})=>{
  const {isShowUserModel,colAuthorityList,oldAuthList}=stateObj;
  const [colorMap,setColorMap]=useState(null)
  const [selectedRowKeys,setSelectedRowKeys] = useState([]);
  const [changeStatus,setChangeStatus] = useState(false);
  const authRef = useRef()
  useImperativeHandle(formRef, () => {
    return {
      updateAuth,
    };
  });
  //const [prevType, setPrevType] = useState('');
  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  useEffect(()=>{
   // 将formTableName相同的分组，并为每个组生成一个随机颜色
  const colorMap = colAuthorityList&&colAuthorityList.reduce((map, obj) => {
    if (!map.has(obj.formTableName)) {
      map.set(obj.formTableName, getRandomColor());
    }
    return map;
  }, new Map());
  setColorMap(colorMap)
  },[colAuthorityList])
  console.log(colAuthorityList,'colAuthorityList');
  let columns=[
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
      title: '字段表名称',
      dataIndex: 'formTableName',
      width:150,
      render:(text,record)=><span style={{color:record.color}}>{text}</span>
    },
    {
      title: '权限类型',
      dataIndex: 'authType',
      width:150,
      render:(text,obj)=>{
        let tmpAuthTypes = [];
        AUTHTYPE.map((item)=>{
          if(item.type=='OPERATE'){

          }
        })
        return (
            <Select
              onSelect={updateAuthListDataFn.bind(this,'authType',obj.formColumnId,obj)}
              value={text?text:''}
              style={{width:'100px'}}
              disabled={obj.hideFlag==1?true:false}
            >
              {AUTHTYPE.map((item)=>{
                if(obj.type=='OPERATE'&&item.key=='NONE'){
                }else{
                  return (<Option value={item.key} key={item.key}>{item.name}</Option>)
                }
              })}
            </Select>
        )
      }
    },
    {
      title: '授权范围',
      dataIndex: 'authScope',
      render:(text,obj)=>(
        <Select
          onSelect={updateAuthListDataFn.bind(this,'authScope',obj.formColumnId,obj)}
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
      render:(text,obj)=><div
          onClick={obj.hideFlag!=1?changeAuthScope.bind(this,obj,'authScopeName'):''}
          className={obj.hideFlag==1?'disabled':''}>
          {text}
        </div>
    },
    {
      title: '默认值',
      dataIndex: 'defaultType',
      render:(text,obj)=>{
        let tmpTypes = DEFAULTTYPEOBJECT[obj.formColumnType]||null;
        // if(obj.formColumnType=='YEAR'){
        //   tmpTypes = DEFAULTTYPE.filter(i=>i.key=='CURYEAR'||i.key=='NONE');
        // }else{
        //   tmpTypes = DEFAULTTYPE.filter(i=>i.key!='CURYEAR');
        // }
        return (
          <>{obj.type=='OPERATE'||!tmpTypes?null:
            <Select
              style={{width:'100px'}}
              onSelect={updateAuthListDataFn.bind(this,'defaultType',obj.formColumnId,obj)}
              value={obj.hideFlag==1?'VALUE':(text?text:'NONE')}
              disabled={obj.hideFlag==1||(selectedRowKeys.length>1&&selectedRowKeys.includes(obj.formColumnId))?true:false}
            >
              {tmpTypes.map((item)=>{
                return (<Option value={item.key} key={item.key}>{item.name}</Option>)
              })}
            </Select>
          }</>
        )
      }
    },
    {
      title: '固定值',
      dataIndex: 'defaultVal',
      width:150,
      render:(text,obj)=><div>
        {obj.hideFlag==1 ||obj.defaultType=='VALUE'?
          <Input
            maxLength={50}
            onInput={lenMin.bind(this)}
            value={text}
            onChange={changeDefaultType.bind(this,obj.formColumnId)}
            disabled={selectedRowKeys.length>1&&selectedRowKeys.includes(obj.formColumnId)?true:false}
          />:
          <span onClick={changeAuthScope.bind(this,obj,'defaultVal')}>{text}</span>
        }
      </div>
    },
    {
      title: '必填项',
      dataIndex: 'isRequired',
      render:(text,obj)=>
      <>{obj.type=='OPERATE'?null:
      <Switch
        checked={text==1?true:false}
        onChange={updateAuthListDataFn.bind(this,'isRequired',obj.formColumnId,obj)}
        disabled={obj.hideFlag==1?true:false}
      />}
      </>
    }
  ]
  useEffect(()=>{
    init(actId)
  },[])
  const lenMin=(e)=>{
    let flag=true
    e.target.value.trim()
    if(flag&&e.target.value.length>=50){
      message.error('最大不超过50字符')
      flag=false
    }else{
      return
    }
  }
  function init(nodeId){
    dispatch({//全局权限配置
      type: `${namespace}/getColAuthorty`,
      payload:{
        bizSolId,
        procDefId:procDefId,
        actId:nodeId,
        deployFormId
      },
      callback:(colAuthorityList)=>{
        setParentState({
          colAuthorityList
        })
        // if(!isAction){//如果不是立马保存，后端不会返回新的数据，需要将用户上次选中的的数据回显
        //   let newColAuthorityList = [];
        //   colAuthorityList.map((item)=>{
        //     let authInfo = authList.filter(i=>i.formColumnCode==item.formColumnCode&&i.authScopeType !== 'ALL');//全局的不用渲染数据到节点上
        //     if(authInfo.length){
        //       let newItem = {
        //         authType:authInfo[0].authType,
        //         authScope:authInfo[0].authScope,
        //         authScopeName:authInfo[0].authScopeName,
        //         defaultType:authInfo[0].defaultType,
        //         defaultVal:authInfo[0].defaultVal,
        //         isRequired:authInfo[0].isRequired
        //       }
        //       newColAuthorityList.push({...item,...newItem});
        //     }else{
        //       newColAuthorityList.push(item);
        //     }
        //   })
        //   console.log('colAuthorityList=',newColAuthorityList);
        //   dispatch({
        //     type:`${namespace}/updateStates`,
        //     payload:{
        //       colAuthorityList:newColAuthorityList
        //     }
        //   })
        // }
      }
    })
  }
  //固定值
  const changeDefaultType=(formColumnId,e)=>{
    setChangeStatus(true)
    colAuthorityList.map((item)=>{
      if((selectedRowKeys.includes(formColumnId)&&selectedRowKeys.includes(item.formColumnId))||item.formColumnId==formColumnId){
        item['defaultVal'] = e.target.value;
        item['defaultType'] = 'VALUE';
      }
    })
    setParentState({
      colAuthorityList:colAuthorityList,
    })

  }
  //改变授权直
  const changeAuthScope=(info,col)=>{
    setChangeStatus(true)
    console.log('info=',info);
    if((col=='authScopeName'&&(info.authScope=='USER'||info.authScope=='ORG'||info.authScope=='DEPT'||info.authScope=='POST'
    ||info.authScope=='USERGROUP'||info.authScope=='RULE'))||(col=='defaultVal'&&(info.defaultType=='USER'
    ||info.defaultType=='ORG'||info.defaultType=='DEPT'))){
      let selectedDataIds=[];
      let orgUserType = '';
      if(col=='authScopeName'){
        selectedDataIds=info.authScopeId?info.authScopeId.split(','):[];
        orgUserType=info.authScope;
      }else if(col=='defaultVal'){
        selectedDataIds=info.defaultIdVal?info.defaultIdVal.split(','):[];
        orgUserType=info.defaultType;
      }
      //弹出用户选择框
      setParentState({
        isShowUserModel:true,
        selectedDataIds:selectedDataIds,
        selectedDatas:[],
        selectFormColumnId:info.formColumnId,
        orgUserType:orgUserType,
        selectCol:col
      })
    }
  }
  //更新授权列表数据
  const updateAuthListDataFn=(col,formColumnId,info,value)=>{
    setChangeStatus(true)
    if((col=='authScope'&&(value=='USER'||value=='ORG'||value=='DEPT'||value=='POST'
    ||value=='USERGROUP'||value=='RULE'))||(col=='defaultType'&&(value=='USER'
    ||value=='ORG'||value=='DEPT'))){
      let selectedDataIds=[];
      let orgUserType = '';
      if(col=='authScope'){

        // if (value !== prevType) {
        //   selectedDataIds=[];
        // } else {
          selectedDataIds=[];//切换授权范围直接清空选择值
        //}
        orgUserType=value;
        //setPrevType(value);
      }else if(col=='defaultType'){
        selectedDataIds=info.defaultIdVal?info.defaultIdVal.split(','):[];
        orgUserType=value;
      }
      //弹出用户选择框
      setParentState({
        isShowUserModel:true,
        selectedDataIds:selectedDataIds,
        selectedDatas:[],
        selectFormColumnId:info.formColumnId,
        orgUserType:orgUserType,
        selectCol:col
      })
    }else{
      colAuthorityList.map((item)=>{
        if((selectedRowKeys.includes(formColumnId)&&selectedRowKeys.includes(item.formColumnId))||item.formColumnId==formColumnId){
          if(col=='isRequired'){
            item[col]=value?"1":"0";
          }
          if(col=='authType'){
            item[col]=value
          }
          if(col=='authScope'){
            if(value=='USER'||value=='ORG'||value=='DEPT'||value=='POST'
            ||value=='USERGROUP'||value=='RULE'){
              //item['authScopeName']='';
            }else{
              item[col]=value;
              item['authScopeName']=AUTHSCOPE.filter(i=>i.key==value)[0].name;
              item['authScopeId']='';
            }
          }else if(col=='defaultType'){
            if(value=='CURUSER'||value=='CURDEPT'||value=='CURORG'||value=='NONE'||value=='VALUE'||value=='TIME'||value=='CURYEAR'){
              console.log('1111111====');
              item['defaultIdVal']='';
              item['defaultVal']='';
              item[col]=value;
            }
          }
        }
      })
    }
    setParentState({
      colAuthorityList:colAuthorityList
    })
  }
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const handleSave=(row)=>{
    console.log('row=',row);
    let newAuthList = [];
    colAuthorityList.map((item)=>{
      if(item.formColumnId==row.formColumnId){
        newAuthList.push(row)
      }else{
        newAuthList.push(item)
      }
    })
    console.log('newAuthList=',newAuthList);
    setParentState({
      colAuthorityList:newAuthList,
      isShowAuthModal:false
    })
  }
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
        title: col.title,
        handleSave:handleSave,
      }),
    };
  });
  //保存
  const updateAuth=(isClose)=>{
    if(changeStatus){
      //去掉里面的id
      let newColAuthorityList=[];
      colAuthorityList.map((item)=>{
        delete(item.id);
        console.log('item=',item);
        if((item.authType&&item.authType!='NONE')||(item.authScope&&item.authScope!='NONE')||
          (item.defaultType&&item.defaultType!='NONE')||item.isRequired==1||item.authType){
          newColAuthorityList.push(item);
        }
      })
      if(isAction){//是否调用更新接口，全局调用，节点不调用
        dispatch({
          type:`${namespace}/updateAuth`,
          payload:{
            bizSolId,
            actId:actId,
            procDefId,
            deployFormId:deployFormId,
            authList:JSON.stringify(newColAuthorityList)
          },
          callback:function(){
            setChangeStatus(false)
            // setParentState({
            //   isShowAuthModal:false,
            // })
          }
        })
      }else{
        setChangeStatus(false);
        //显示全局的和节点的
        let allAuthList = [];
        oldAuthList.map((item)=>{
          if(item.authScopeType === 'ALL'){
            allAuthList.push(item)
          }
        })
        let newAuthList = newColAuthorityList.concat(allAuthList);
        newAuthList.map((item,index)=>{
          item.index=index+1;//用于删除
        })
        setParentState({
          authList:newAuthList,
          oldAuthList:newAuthList,
          isShowAuthModal:false,
          nodeChangeStatus:true//用于节点是否保存
        })
      }
      if(isClose){
        onCancel()
      }
    }
    else{//这块有页签了就不需要了
      if(isClose){
        onCancel()
      }
    }
  }
  const rowSelection={
    selectedRowKeys:selectedRowKeys,
    onChange:(selectedRowKeys,selectedRows) => {
      setSelectedRowKeys(selectedRowKeys)
    },
    getCheckboxProps: (record) => ({
      disabled: record.hideFlag == 1,
    }),
  }
  // useEffect(()=>{
  //   if(colAuthorityList&&colAuthorityList.length){
  //     let info = window.document.getElementsByClassName('auth_warp___30t_3');
  //     debugger;
  //     //let infos1 = info[0].getElementsByClassName('ant-table-tbody')[0].getElementsByTagName('tr')[10]
  //     console.log('info===',info);
  //   }
  // },[colAuthorityList])
  const userNameInput=(index)=>{
    let node = authRef.current;
    if(colAuthorityList.length&&index){
      console.log('c===',node,colAuthorityList,index);
      let tbodyNode = node.getElementsByClassName('ant-table-tbody')[0];
      let trNode = tbodyNode.getElementsByTagName('tr')[index];
      // let tdNodes = trNode.getElementsByTagName('td');
      // for(let i=0;i<tdNodes.length;i++){
      //   tdNodes[i].style.background='rgb(230, 247, 255)'
      // }
      trNode.scrollIntoView()
    }
  }
  const searchFn=(value)=>{
    if(value){
      let srcollIndex = 0;
      let nameSrcollIndex = -1;
      let codeSrcollIndex = -1;
      let formSrcollIndex = -1;
      colAuthorityList.map((item,index)=>{
        if(item.formColumnName.includes(value)&&nameSrcollIndex==-1){
          nameSrcollIndex = index;
        }else if(item.formColumnCode.includes(value)&&codeSrcollIndex==-1){
          codeSrcollIndex = index;
        }else if(item.formTableName.includes(value)&&formSrcollIndex==-1){
          formSrcollIndex = index;
        }
      })
      if(nameSrcollIndex!=-1){
        srcollIndex = nameSrcollIndex;
      }else if(codeSrcollIndex!=-1){
        srcollIndex = codeSrcollIndex
      }else{
        srcollIndex =formSrcollIndex;
      }
      // setSrcollIndex(srcollIndex);
      userNameInput(srcollIndex+1);
    }
  }
  return (
    <div className={styles.auth_warp} ref={authRef}>
      <div className={styles.height_warp}>
        <Input.Search onSearch={searchFn} className={styles.search_warp} placeholder='字段名称/字段编码/字段表名称'/>
      </div>
      <div style={{height:"calc(100% - 100px"}}>
        <ColumnDragTable
          params={{bizSolId:bizSolId,deployFormId:deployFormId}}
          components={components}
          bordered
          dataSource={ colAuthorityList&&colAuthorityList.map((obj) => {
            return { ...obj, color: colorMap?.get(obj.formTableName) };
          })}
          columns={columns}
          rowKey="formColumnId"
          pagination={false}
          scroll={{ x: 1200,y:'calc(100% - 42px)'}}
          rowSelection={{
            type:"checkbox",
            ...rowSelection
          }}
          taskType={'MONITOR'}
        />
      </div>
      <div className={indexStyles.node_button}>
        <Button type="priamry" loading={loading.global} className={styles.save} onClick={onCancel}>取消</Button>
        <Button type="priamry" onClick={updateAuth.bind(this,true)} loading={loading.global} className={styles.save} id="formAuthSave">保存</Button>
      </div>
      {isShowUserModel&&
        <UserModal
          namespace={namespace}
          stateObj={stateObj}
          selectedRowKeys={selectedRowKeys}
          setParentState={setParentState}
          containerId={`formAuth_${procDefId}_${actId}_${bizSolId}`}
        />
      }
    </div>
  )
})
export default connect(({loading,layoutG,applyModelFormAuth,applyModelConfig})=>{return {loading,layoutG,applyModelFormAuth,applyModelConfig}})(Index);
