import {Button,Modal,message,Form,Input,Select,Switch} from 'antd';
import {connect} from 'umi';
import {useState,useEffect} from 'react';
import { OPERATIONTYPE } from '../../../service/constant';
import RelevanceRangModal from './relevanceRangModal';
import ModalButtonGroup from './modalButtonGroup';
import {BUTTONRANG} from '../../../service/constant'
import Table from '../../../componments/columnDragTable'
const {Option}=Select;
let defaultColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width:80,
    render:(text,obj,index)=><span>{index+1}</span>
  },
  {
    title: '按钮展示名称',
    dataIndex: 'buttonName',
    key: 'buttonName',
  },
  {
    title: '类型',
    dataIndex: 'operationType',
    key: 'operationType',
    render:(text)=><span>{text?OPERATIONTYPE.filter(i=>i.key==text)[0].name:''}</span>
  },
  {
    title: '展示方式',
    dataIndex: 'showType',
    key: 'showType',
    render:(text)=><div>{text==1?'平铺':'下拉'}</div>
  },
  {
    title: '组名',
    dataIndex: 'groupName',
    key: 'groupName',
  },
  {
    title: '是否显示',
    dataIndex: 'isShow',
    key: 'isShow',
    editable: true,
  },
  {
    title: '值域类型',
    dataIndex: 'rangeType',
    key: 'rangeType',
    editable:true,
  },
  {
    title: '值',
    dataIndex: 'rangeContentValue',
    key: 'rangeContentValue',
    editable:true,
  }
];
function ModalButton({style,query,dispatch,setParentState,parentState,actId,form,successChangeTab,
  changeAuthorityTab}){
  const bizSolId = query.bizSolId;
  const {isShowReleveModal,buttonList,procDefId,bizFromInfo,isShowButtonGroup,orgUserType,selectButtonId,
    oldButtonList,isClickOk,tableData,selectButtonGroupInfo,preNodeTabValue,nextNodeTabValue,
    preAuthorityTab,nextAuthorityTab,preActId,authorityTab,nodeTabValue}=parentState;
  const [columns,setColumns]=useState(defaultColumns);
  const [changeStatus,setChangeStatus] = useState(false);
  useEffect(()=>{
    //获取全局的按钮用来切换来源以后能重新获取
    // if(actId){
    //   dispatch({
    //     type:"applyModelConfig/getGolbalButtonAuth",
    //     payload:{
    //       bizSolId,
    //       procDefId,
    //       actId:0,
    //       isRefresh:0,
    //       buttonGroupId:bizFromInfo.buttonGroupId,
    //       deployFormId:bizFromInfo.formDeployId
    //     }
    //   })
    // }
    // return () => {//tab切换时 调自动保存
    //   form.submit()
    // }
  },[])
  useEffect(()=>{
    //获取绑定的按钮
    // if(bizFromInfo.buttonGroupId&&!isClickOk){
    //   //
    // }else if(!isClickOk){
    //   // dispatch({
    //   //   type:"applyModelConfig/updateStates",
    //   //   payload:{
    //   //     buttonList:[]
    //   //   }
    //   // })
    // }else{
      //设置表单默认值
      setFromListValue(buttonList);
    //}
    if(actId){
      getButtonAuth(bizFromInfo.buttonGroupId);
      let newColumns=_.cloneDeep(defaultColumns);
      //增加一行来源
      newColumns.splice(5,0,{
        title: '来源',
        dataIndex: 'authScopeType',
        key: 'authScopeType',
        editable:true,
      })
      setColumns(newColumns);
    }else{
      setColumns(defaultColumns);
    }
  },[actId])
  useEffect(()=>{
    if(preNodeTabValue=='node'||preAuthorityTab=='button'||(nodeTabValue=='node'&&authorityTab=='button'&&preActId==actId)){
      form.submit()
    }
  },[preNodeTabValue,preAuthorityTab,preActId])
  //设置整个form的值
  const setFromListValue=(buttonList)=>{
    buttonList.map((item)=>{
      setFormItemValue(item,true)
    })
  }
  //设置表单值
  const setFormItemValue=(item,isUpdateButtonList)=>{
    form.setFields([
      {
        name: `isShow_${item.buttonId}`,
        value: item.isShow?(item.isShow=='DISPLAY'?true:false):true,
      },
      {
        name: `authScopeType_${item.buttonId}`,
        value: item.authScopeType,
      },
      {
        name: `rangeType_${item.buttonId}`,
        value: item.rangeType?item.rangeType:'ALL',
      },
      {
        name: `old_rangeType_${item.buttonId}`,
        value: item.rangeType?item.rangeType:'ALL',
      },
      {
        name: `rangeContentId_${item.buttonId}`,
        value: item.rangeContentId,
      },
      {
        name: `rangeContentValue_${item.buttonId}`,
        value: item.rangeContentValue?item.rangeContentValue:'所有人',
      },
    ])
    if(item.isShow=='NONE'&&typeof isUpdateButtonList=='undefined'){
      //清空值
      changeIsShow(item.buttonId,false)
    }
  }
  const getButtonAuth=(buttonGroupId)=>{
    dispatch({
      type:"applyModelConfig/getButtonAuth",
      payload:{
        bizSolId,
        procDefId:bizFromInfo.procDefId,
        actId,
        buttonGroupId,
        isRefresh:0,
        deployFormId:bizFromInfo.formDeployId
      },
      callback:(data)=>{
        setParentState({
          ...data
        })
        //重置form的默认值（这个是为了切换节点缓存的显示问题）
        let buttonList = data.buttonList
        setFromListValue(buttonList);
      }
    })

  }
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editable: col.editable,
      }),
    };
  });
  const changeRangContentValue=(buttonId,e)=>{
    let range = form.getFieldValue(`rangeType_${buttonId}`);
    if(range=='DEFAULT'){
      form.setFieldsValue({[`rangeContentValue_${buttonId}`]:e.target.value})
    }
  }
  const clickRangContentValue=(buttonId)=>{
    //获取范围类型
    let range = form.getFieldValue(`rangeType_${buttonId}`);
    if(range=='USER'||range=='USERGROUP'||range=='ORG'||range=='DEPT'||range=='POST'||range=='RULE'){
      setParentState({
        isShowReleveModal:true,
        selectedDataIds:form.getFieldValue(`rangeContentId_${buttonId}`)?form.getFieldValue(`rangeContentId_${buttonId}`).split(','):[],
        orgUserType:range,
        selectButtonId:buttonId
      })
    }
  }
  //值域类型改变则改变值
  const changeRange=(buttonId,value)=>{
    let content = '';
    form.setFieldsValue({[`rangeType_${buttonId}`]:value});
    if(value=='ALL'||value=='DRAFT'||value=='HANDLE'){
      BUTTONRANG.map((item)=>{
        if(item.key==value){
          content=item.name
        }
      })
      form.setFieldsValue({[`rangeContentValue_${buttonId}`]:content});
      form.setFieldsValue({[`old_rangeType_${buttonId}`]:value});
    }else{
      setParentState({
        isShowReleveModal:true,
        selectedDataIds:[],
        orgUserType:value,
        selectButtonId:buttonId
      })
    }
  }
  //是否显示
  const changeIsShow=(buttonId,checked)=>{
    //需要改变buttonList里面的isShow,用于值欲类型和值的显示不显示
    buttonList.map((item)=>{
      if(item.buttonId==buttonId){
        item.isShow=checked?'DISPLAY':"NONE"
      }
    })
    form.setFieldsValue({[`rangeType_${buttonId}`]:'ALL'});
    form.setFieldsValue({[`rangeContentValue_${buttonId}`]:'所有人'});
    form.setFieldsValue({[`old_rangeType_${buttonId}`]:'ALL'});
    form.setFieldsValue({[`rangeContentId_${buttonId}`]:''});
    setParentState({
      buttonList
    })
  }
  //改变来源
  const changeAuthSource = (buttonId,value)=>{
    //节点的值和值域不用改变，全局的需要显示全局的值
    if(value=='ALL'){
      let info = _.find(oldButtonList,{buttonId,buttonId});
      if(typeof info!='undefined'){
        buttonList.map((item)=>{
          if(item.buttonId==buttonId){
            item.authScopeType=value;
            item.isShow = info.isShow;
            item.rangeType = info.rangeType;
            item.rangeContentValue = info.rangeContentValue;
            item.rangeContentId = info.rangeContentId;
          }
        })
        setFormItemValue(info);
      }
    }else{
      buttonList.map((item)=>{
        if(item.buttonId==buttonId){
          item.authScopeType=value
        }
      })
    }
    setParentState({
      buttonList
    })
  }
  const EditableCell = ({
    editable,
    dataIndex,
    title,
    record,
    index,
    children,
    ...restProps
  }) => {
    let inputNode = <Input />;
    //let defaultValue = '';
    //去掉了默认值放到获取权限按钮的接口那设置
    if(editable){
      //defaultValue= typeof record[dataIndex]!='undefined'?record[dataIndex]:'';
      if(dataIndex=='isShow'){
        inputNode=(
          <Switch onChange={changeIsShow.bind(this,record.buttonId)} disabled={!actId||record['authScopeType']!='ALL'?false:true}/>
        )
        //defaultValue = record[dataIndex]?record[dataIndex]=='DISPLAY'?'checked':'':'checked';
      }else if(dataIndex=='rangeType'){
        if(record.operationType=='HANDLE' || record.isShow=='NONE'){
          inputNode=<span></span>
        }else{
          inputNode=(
            <Select onChange={changeRange.bind(this,record.buttonId)} disabled={!actId||record['authScopeType']!='ALL'?false:true}>
              {BUTTONRANG.map((item)=>{
                return (<Option value={item.key}>{item.name}</Option>)
              })}
            </Select>
          )
        }
        //defaultValue = record[dataIndex]?record[dataIndex]:'ALL'
      }else if(dataIndex=='rangeContentValue'){
        if(record.operationType=='HANDLE' || record.isShow=='NONE'){
          inputNode=<span></span>
        }else{
          inputNode = <Input
            disabled={!actId||record['authScopeType']!='ALL'?false:true}
            onClick={(actId&&record['authScopeType']!='ALL')||!actId?clickRangContentValue.bind(this,record.buttonId):''}
            onChange={changeRangContentValue.bind(this,record.buttonId)}
            readOnly={(actId&&record['authScopeType']!='ALL')||record.rangeType!='DEFAULT'?true:false}
          />
        }
        //defaultValue = record[dataIndex]?record[dataIndex]:'所有人'
      }else if(dataIndex = 'authScopeType'){
        inputNode=(
          <Select onChange={changeAuthSource.bind(this,record.buttonId)}>
            <Option value={'ALL'}>全局</Option>
            <Option value={'ACT'}>节点</Option>
          </Select>
        )
      }
    }
    return (
      <td {...restProps}>
        {
          editable?
          (dataIndex=='isShow'?
            <Form.Item
              name={`${dataIndex}_${record.buttonId}`}
              style={{
                margin: 0,
              }}
              valuePropName="checked"
              //initialValue={defaultValue}
            >
              {inputNode}
            </Form.Item>
          :
          <Form.Item
            name={`${dataIndex}_${record.buttonId}`}
            style={{
              margin: 0,
            }}
            //initialValue={defaultValue}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )
        }
        {
          dataIndex=='rangeContentValue'?
          <Form.Item
            name={`rangeContentId_${record.buttonId}`}
            style={{display:'none'}}
            //initialValue={record['rangeContentId']}
          >
            <Input/>
          </Form.Item>
          :null
        }
        {dataIndex=='rangeType'?//用来记录
            <Form.Item
            name={`old_rangeType_${record.buttonId}`}
            style={{display:'none'}}
            //initialValue={record['range']}
          >
            <Input/>
          </Form.Item>
          :null
        }
      </td>
    );
  };
  //提交
  const submitForm=(values)=>{
      if(actId){
        if(changeStatus){
          //保存按钮方案设置
          let buttonJson=[];
          buttonList.map((item)=>{
            if(values[`authScopeType_${item.buttonId}`]!='ALL'){
              buttonJson.push({
                buttonId:item.buttonId,
                buttonName:item.buttonName,
                operationType:item.operationType,
                showType:item.showType,
                groupName:item.groupName,
                isShow:values[`isShow_${item.buttonId}`]?'DISPLAY':'NONE',
                rangeType:values[`rangeType_${item.buttonId}`],
                rangeContentId:values[`rangeContentId_${item.buttonId}`],
                rangeContentValue:values[`rangeContentValue_${item.buttonId}`],
              })
            }
          })
          dispatch({
            type:"applyModelConfig/submitButtonAuth",
            payload:{
              bizSolId:bizSolId,
              procDefId,
              actId:actId,
              buttonGroupId:bizFromInfo.buttonGroupId,
              buttonJson:JSON.stringify(buttonJson),
              deployFormId:bizFromInfo.formDeployId
            },
            callback:()=>{
              successChangeTab();
              changeAuthorityTab();
            }
          })
        }else{
          successChangeTab();
          changeAuthorityTab();
        }
      }else{
        //更新按钮方案
        bizFromInfo.buttonGroupId=selectButtonGroupInfo.groupId;
        bizFromInfo.buttonGroupName= selectButtonGroupInfo.groupName;
        bizFromInfo.buttonGroupCode=selectButtonGroupInfo.groupCode
        tableData[1].name = selectButtonGroupInfo.groupName;
        tableData[1].code = selectButtonGroupInfo.groupCode;
        //更新按钮列表
        buttonList.map((item)=>{
          item.isShow = values[`isShow_${item.buttonId}`]?'DISPLAY':'NONE';
          item.rangeType = values[`rangeType_${item.buttonId}`];
          item.rangeContentId=values[`rangeContentId_${item.buttonId}`];
          item.rangeContentValue=values[`rangeContentValue_${item.buttonId}`];
          item.authScopeType=values[`authScopeType_${item.buttonId}`];
        })
        setParentState({
          isShowButtonModal:false,
          bizFromInfo:bizFromInfo,
          tableData:tableData,
          buttonList:buttonList,
          isClickOk:true
        })
      }
  }
  const onValuesChange=(changedValues, allValues)=>{
    setChangeStatus(true)
  }
  return (
    <div style={style?{...style}:{}}>
      <Form
        form={form}
        component={false}
        onFinish={submitForm}
        onValuesChange={onValuesChange}
      >
        <Table
          components={{
            body: {
              cell:EditableCell,
            },
          }}
          dataSource={buttonList}
          columns={mergedColumns}
          rowKey={"index"}
          scroll={{ y: 'calc(100% - 40px)',x:'1000px' }}
          pagination={false}
          isDrag={false}
        />
      </Form>
      {isShowReleveModal&&
        <RelevanceRangModal
        setFromListValue={setFromListValue}
        buttonList={buttonList}
        query={query}
        orgUserType={orgUserType}
        form={form}
        selectButtonId={selectButtonId}
        setParentState={setParentState}
        parentState={parentState}
        containerId={`buttonAuth_${bizSolId}`}
      />}
      {isShowButtonGroup&&
        <ModalButtonGroup
          getButtonAuth={getButtonAuth}
          query={query}
          form={form}
          setFromListValue={setFromListValue}
          buttonGroupList={parentState.buttonGroupList}
          selectButtonGroupInfo={parentState.selectButtonGroupInfo}
          setParentState={setParentState}
        />}
    </div>
  )
}
export default connect(({layoutG,applyModelConfig})=>{return {layoutG,applyModelConfig}})(ModalButton);
