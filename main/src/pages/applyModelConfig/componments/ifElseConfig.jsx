import RuleSetFun from './ruleSetFun';
import {Modal,Select,Input,Popover} from 'antd';
import D3Tree from './d3Tree';
import React,{useMemo} from 'react';
const {Option} = Select;
const msgSelect= [
  {key:"success",title:"通过"},
  {key:"if",title:"如果"},
  {key:"execute_function",title:"执行函数"},
];
const elseSelect = [
  {key:"text",title:"输出提醒文字"},
  {key:"if",title:"如果"},
  {key:"execute_function",title:"执行函数"},
]
function IfElseConfig({updateData,allCol,setIsChangeConfig,isChangeConfig,
  colMainTabel,query,funData,setFunData,bizSolId,setData,data,treeData,setTreeData,
  setMaxId,maxId
}){
  //添加那么的内容
  const msgContent=(msg,index,curId,parentId)=>{
    return (
      <Select value={msg.type} style={{width:"160px"}} onChange={changeMsgContent.bind(this,'ifMsg',index,curId,parentId)}>
        {msgSelect.map((item,index)=>{
          return (
            <Option value={item.key} key={index} >{item.title}</Option>
          )
        })}
      </Select>
    )
  }
  //添加else内容
  const elseContent=(elseInfo,index,curId,parentId)=>{
    return (
      <Select value={elseInfo.type} style={{width:"200px"}} onChange={changeMsgContent.bind(this,'else',index,curId,parentId)}>
        {elseSelect.map((item,index)=>{
          return (
            <Option value={item.key} key={index}>{item.title}</Option>
          )
        })}
      </Select>
    )
  }
  //else提示内容
  const changeElseValue=(index,e)=>{
    setIsChangeConfig(true);
    data[index].else.value = e.target.value;
    setData(JSON.parse(JSON.stringify(data)));
  }
  //改变那么否则的内容
  const changeMsgContent=(elseIfType,index,curId,parentId,value)=>{
    Modal.confirm({
      title:'确认要切换吗？',
      content:'切换将清空当前的数据',
      onOk:()=>{
        setIsChangeConfig(true);
        debugger;
        //如果切换之前是函数则需要在funData中删除掉
        let contion = elseIfType=='ifMsg'?'if':'else';
        if(funData.length){
          debugger;
          //存在则删除
          _.remove(funData,function(i){return i.id==curId&&i.type==contion});
          setFunData(funData);
        }
        data[index][elseIfType]['type'] = value;
        let tmpId = (parseInt(maxId)+1).toString();
        switch(value){
          case 'if':
            //添加如果，那么，否则
            data.push(
              {
                id:tmpId,
                ifCondition:{
                  "condition":"&&",
                  "level":"0",
                  "children":[]
                },
                ifMsg:{type:"success",value:''},
                else:{type:'text',value:''},
                parentId:parentId+'_'+curId,
                elseIfType:elseIfType
              }
            )
            let tmpTreeData = loopUpdataTree(treeData,{id:tmpId,type:elseIfType,children:[]},curId);
            setTreeData(JSON.parse(JSON.stringify(tmpTreeData)));
            setData(JSON.parse(JSON.stringify(data)));
            setMaxId(tmpId);
            break;
          default:
            //删除掉当前id为父节点的子节点
            let newData = [];
            data.map((item)=>{
              if(!(item.parentId!='0'&&item.parentId.split('_').includes(curId)&&item.elseIfType==elseIfType)){
                newData.push(item);
              }
            })
            let newTreeData = loopDeleteTree(treeData,curId,elseIfType,[]);
            setTreeData(JSON.parse(JSON.stringify(newTreeData)));
            setData(newData);
            break;
        }
      }
    })
  }
  const loopUpdataTree=(treeData,addData,parentId)=>{
    treeData.map((item)=>{
      if(item.id==parentId){
        item.children.push(addData);
      }else if(item.children&&item.children.length){
        loopUpdataTree(item.children,addData,parentId)
      }
    })
    return treeData;
  }
  const loopDeleteTree=(treeData,curId,type)=>{
    treeData.map((item)=>{
      if(item.id==curId){
        item.children=item.children.filter(i=>i.type!=type);
      }else if(item.children&&item.children.length){
        loopDeleteTree(item.children,curId,type)
      }
    })
    return treeData;
  }
  console.log('treeData====',JSON.parse(JSON.stringify(treeData)),treeData,data);
  const loopData=(children,ifType)=>{

    let tmpInfo = _.find(children,{type:ifType});
    console.log('tmpInfo===',tmpInfo,ifType);
    if(ifType&&tmpInfo){
      return treeRender(tmpInfo);
    }else{
      return null;
    }
  }
  const treeRender=(treeItem,type)=>{
    console.log('treeItem==',treeItem);
    if(!treeItem){
      return null;
    }
    //查找index(通过item的id查找data数据的index)
    let index = _.findIndex(data,{id:treeItem.id});
    let item = data[index];
    if(index>=0){
      return <div>
        <p>如果：</p>
        <D3Tree
          updateData={updateData}
          defaultData={item.ifCondition}
          dataIndex={index}
          allCol={allCol}
          setIsChangeConfig={setIsChangeConfig}
          isChangeConfig={isChangeConfig}
          id={item.id}
          colMainTabel={colMainTabel}
          query={query}
          type={type}
        />
        <p>那么：
          <Popover content={msgContent(item.ifMsg,index,item.id,item.parentId)} title="">
            <a>添加动作</a>
          </Popover>
          <br/>
          {item.ifMsg.type=='success'&&<span style={{marginLeft:"30px"}}>{msgSelect.filter(i=>i.key==item.ifMsg.type)[0].title}</span>}
          {item.ifMsg.type=='execute_function'&&<RuleSetFun
            id={item.id}
            funData={funData}
            setFunData={setFunData}
            contion={'if'}
            title={item.ifMsg.type?msgSelect.filter(i=>i.key==item.ifMsg.type)[0].title+':':""}
            bizSolId={bizSolId}
          />}
          {item.ifMsg.type=='if'&&treeItem.children && treeItem.children.length > 0&&<div style={{marginLeft:"30px"}}>{loopData(treeItem.children,'ifMsg')}</div>}
        </p>
        <p>否则：
          <Popover content={elseContent(item.else,index,item.id,item.parentId)} title="">
            <a>添加动作</a>
          </Popover>
          <br/>
          {item.else.type=='text'&&
            <>
              <span style={{marginLeft:"30px"}}>{item.else.type?elseSelect.filter(i=>i.key==item.else.type)[0].title+':':""}</span>
              <Input style={{width:'200px'}} onBlur={changeElseValue.bind(this,index)} defaultValue={item.else.value} maxLength={50}/>
            </>
          }
          {item.else.type=='execute_function'&&<RuleSetFun
            id={item.id}
            funData={funData}
            setFunData={setFunData}
            contion={'else'}
            title={item.else.type?elseSelect.filter(i=>i.key==item.else.type)[0].title+':':""}
            bizSolId={bizSolId}
          />}
          {item.else.type=='if'&&treeItem.children && treeItem.children.length > 0&&<div style={{marginLeft:"30px"}}>{loopData(treeItem.children,'else')}</div>}
        </p>
      </div> 
    }else{
      return null;
    }
  };
  const configRender=useMemo(()=>{
    return treeRender(treeData?.[0],'')
  },[treeData])
  return (
    <>{configRender}</>
  )
}
export default IfElseConfig;