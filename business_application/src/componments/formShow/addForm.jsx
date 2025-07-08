/**
 * 自由表单的添加和展示
 */
import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";
import {components} from './formConfig';
import React, { useState, useEffect } from "react";
import styles from './index.less';
import {Form,Button,Popover, message} from 'antd';
import {connect} from 'umi';
import OT from './orgTree'
import PD from "./pullDataModel";
import NormalSubForm from "./NormalSubForm";
import WriteSign from "./writeSing";
import BasicData from "./basicData";
import {Input} from 'antd';
import {dataFormat, number_format} from '../../util/util';
import moment from 'moment'
import UploadFile from './UploadFile';
import AttachmentBiz from "./attachmentBiz";
import { defaultStyle } from "./defaultStyle";
import { parser } from 'xijs';
const ReactGridLayout = WidthProvider(RGL);
//配置
const defaultProps = {
  className: "layout",
  isDraggable: false,
  isResizable: false,
  margin:[0,0],
  containerPadding: [0, 0],
  //isBounded: false,
  cols: 12,
  rowHeight: 16,
  onLayoutChange: function() {}
};
function AddForm({form,location,dispatch,formShow,formCallBack,buttonCode,dynamicPage}){
  const bizSolId = location.query.bizSolId;
  const bizInfoId = location.query.bizInfoId;
  const currentTab = location.query.currentTab;
  const {stateObj} = formShow;
  const {formJSON,formColumnJSON,formdata,authList,bizInfo,selectVisible,
        pullDataModel,pullData, fieldName, subFormJSON,serialNumList,
        actData,dictInfos,searchType,treeType,nodeIds,isMultipleTree,
        paramsData,attachmentFormList,attachmentList,attachmentTarget,
        relBizTarget,formRelBizInfoList,relBizInfoList,formStyleJSON,
        subFormColumnJSON,subDataIndex,deployFormId,isSubData,globalRule,
        nodeRule,redCol} = stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab];
  const [visibleInfo,setVisibleInfo] = useState({});
  const [values,setValues] = useState({});//用于存储不对应的页面数据
  const [moneyValues,setMoneyValues] = useState({})//用于存储金额字段
  console.log('moneyValues',moneyValues,formdata,values);
  function upperJSONKey(jsonObj){
    for (var key in jsonObj){
        jsonObj[key.toLowerCase()] = jsonObj[key];
        // delete(jsonObj[key]);
    }
    return jsonObj;
  }
  // useEffect(()=>{
  //   if(formdata.length!=0&&formdata[0]&&formdata[0].data&&formdata[0].data.length!=0){
  //     setValues(formdata[0].data[0]);
  //   }
  // },[])

    //获取name值
    const getFormColName=(formColumnJSON,i)=>{
      let formColumnInfo=formColumnJSON.filter((col)=>col.feId==i);
      let name="";
      if(formColumnInfo.length){
        formColumnInfo[0].components.map((item)=>{
          if(item.componentCode=='tableColCode'){
            name=item.componentValue
          }
        })
      }
      return name;
    }

  useEffect(()=>{
    for (let index = 0; index < pullData.length; index++) {
      const element = pullData[index];
      if(element.feId==0){//主表
        let values = {}
        _.keysIn(form.getFieldsValue(true)).map((item)=>{
          if(element.data.length!=0&&element.data[0][item.toUpperCase()]){
            values[item] = element.data[0][item.toUpperCase()]
          }
          values = datainitValues(element.data[0],values,item,mvalues,dateValues,selectValues)
        })
        setValues(values)

        form.setFieldsValue(values);
      }else{//插入浮动表数据
        const tableColsIndex =  _.findIndex(subFormJSON,{feId: element.feId});
        const deployFormId = tableColsIndex==-1?[]:subFormJSON[tableColsIndex].deployFormId//已发布表单id
        const tableIndex = _.findIndex(formdata,{deployFormId: deployFormId	})
        let subValues = []
        element.data.lenght!=0&&element.data.map((data)=>{
          let subValue = {}
          Object.keys(element.data[0]).map((item)=>{
              subValue = datainitValues(data,data,item,mvalues,dateValues,selectValues)
          })
          subValues.push(subValue)
        })
        onSubValuesChange(deployFormId,tableIndex,false,{},{[deployFormId]:upperJSONKey(subValues)})
      }
    }
  },[pullData])


  const datainitValues = (data,values,item,mvalues,dateValues,selectValues) =>{
    console.log('data[item.toUpperCase()]',data);
    mvalues.length!=0&&mvalues.map((mv)=>{//金额字段需要处理格式化后的数据
      if(mv.name==item&&data[item.toUpperCase()]){
        let thus  = ''
        let decimal = {'THUSSECDECIMAL':2,'SECDECIMAL':2,'THUSFOURDECIMAL':4,'FOURDECIMAL':4,'SIXDECIMAL':6,'THUSSIXDECIMAL':6}
        if(mv.moneyFormat){
          if(mv.moneyFormat.includes('THUS')){
            thus = ','
          }
        }
        let val = 0
        if(!isNaN(data[item.toUpperCase()])){
          val = data[item.toUpperCase()]
        }
        var mvv = number_format(val,decimal[mv.moneyFormat],'.',thus)
        values[item]= mvv;
      }
    })
    dateValues.length!=0&&dateValues.map((datev)=>{
      if(datev.name==item&&data[item.toUpperCase()]){
        if(moment.isMoment(data[item.toUpperCase()])){
          values[item] = data[item.toUpperCase()]
        }else{
          console.log('datev.format,',datev.format,data,item.toUpperCase(),data[item.toUpperCase(),!isNaN(data[item.toUpperCase()])])

          if(datev.format){
            console.log('datev.format,',datev.format,data,item.toUpperCase(),data[item.toUpperCase(),!isNaN(data[item.toUpperCase()])])

            if(!isNaN(data[item.toUpperCase()])){
              if(data[item.toUpperCase()]==null){//针对value是null的情况
                values[item] = ''
              }else{
                values[item]= moment(dataFormat(data[item.toUpperCase()],datev.format))
              }
            }else{
              values[item]= moment(dataFormat(33,datev.format))//非数字的默认1970-1-1
            }
          }
        }

      }
    })
    selectValues.length!=0&&selectValues.map((sv)=>{
      if(sv.name==item&&data[item.toUpperCase()]){
        if(data[item.toUpperCase()]==null){//针对value是null的情况
          values[item] = ''
        }else{
          if(data[item.toUpperCase()].includes(':')){//截取code
            if(sv.choiceStyle=='CHECK'){
              values[item] =  _.words(data[item.toUpperCase()].split(':')[1])
            }else{
              values[item] =  _.words(data[item.toUpperCase()].split(':')[1]).length>1?_.words(data[item.toUpperCase()].split(':')[1])[0]:data[item.toUpperCase()].split(':')[1]

            }
          }else{
            values[item]= data[item.toUpperCase()]
          }
        }
      }
    })


    return values
  }

  const onSubValuesChange = (deployFormId,tableIndex,isSubSelfUpdate,changedValues, allValues) =>{
    console.log('allValues',allValues);
    let obj = {deployFormId,data: allValues[deployFormId]}
    // let obj = {deployFormId,data: allValues}
    let newFormdata = _.cloneDeep(formdata)
    if(newFormdata.length==0){//没有表单数据时初始化主表数据
        newFormdata = [{deployFormId:bizInfo.deployFormId,data:[]}]
    }
    if(tableIndex==-1){
        newFormdata.push(obj)
    }else{

        newFormdata[tableIndex] = obj
    }
    dispatch({
        type: 'formShow/updateStates',
        payload: {
            formdata: newFormdata,
            isSubSelfUpdate
        }
    })
}



  //金额的长度判断
  const validatorMoneyLength=(lengthValue,rule,value)=>{
    if(value&&value.split('.')[0].lenght>lengthValue){
      return Promise.reject(new Error(`整数部分长度不能大于${lengthValue}`))
    }else{
      return Promise.resolve();
    }
  }
  //获取当前组件的配置信息
  const getColConfigInfo=(formColumnJSON,i,code,type)=>{
    let formColumnInfos=formColumnJSON.filter(col=>col.feId==i);
    let formColumnInfo = formColumnInfos.length?formColumnInfos[0]:[];
    let rules=[];//校验规则
    let configProps={};//组件属性
    if(Object.keys(formColumnInfo).length){
      let components = formColumnInfo.components;
      let orgIds = formColumnInfo.orgIds;
      if(formColumnInfo.orgIds){
        configProps['orgIds'] = formColumnInfo.orgIds
      }
      let prefix = '';
      let suffix = '';
      formColumnInfo.components&&components.map((item)=>{
        if(item.componentCode=='prefix'&&item.componentValue){
          prefix = item.componentValue
        }
        if(item.componentCode=='suffix'&&item.componentValue){
          suffix = item.componentValue
        }
      })

      formColumnInfo.components&&components.map((item)=>{

        switch(item.componentCode) {
          case 'tableColLength':
              if(type=='Select'||type=='Date'){
                return
              }

              if((type!='Select'||type!='Date')&&formColumnInfo.controlCode!='MoneyInput'){//金额字段用来判断长度
                rules.push({
                  max:parseInt(item.componentValue),
                  message:'长度不能大于'+item.componentValue,
                })
              }else if(formColumnInfo.controlCode=='MoneyInput'){
                rules.push({
                  validator: (rule,value)=>{
                    if(value){
                      if(value.includes('.')&&value.split('.')[0].length>(item.componentValue-8)){
                        return Promise.reject(new Error(`整数部分长度不能大于${item.componentValue-8}`))
                      }else{
                        return Promise.resolve()
                      }
                    }else{
                      return Promise.resolve()
                    }
                  }
                })
              }
          break;
          case 'tableColDecLength':
            if(type=='MoneyInput'){
              rules.push({
                validator: (rule,value)=>{
                    if(value){
                      if(value.includes('.')&&value.split('.')[1].length>item.componentValue){
                        return Promise.reject(new Error(`小数位长度不能大于${item.componentValue}`))
                      }else{
                        return Promise.resolve()
                      }
                    }else{
                      return Promise.resolve()
                    }
                }
              })
            }
          break;
          case 'verifyRule':
              rules.push({
                validator: (rule,value)=>{
                    if(value){
                      switch (item.componentValue) {
                        case 'EMAIL':
                          if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)){
                            return Promise.reject(new Error(`请输入正确的邮箱`))
                          }else{
                            return Promise.resolve()
                          }
                          break;
                        case 'IDCARD':
                          if(!/^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/.test(value)){
                            return Promise.reject(new Error(`请输入正确的身份证号`))
                          }else{
                            return Promise.resolve()
                          }
                          break;
                        case 'CN':
                          if(!/^[\u4e00-\u9fa5],{0,}$/.test(value)){
                            return Promise.reject(new Error(`请输入汉字`))
                          }else{
                            return Promise.resolve()
                          }
                          break;
                        case 'EN':
                          if(!/^[a-zA-Z]+$/.test(value)){
                            return Promise.reject(new Error(`请输入英文字母`))
                          }else{
                            return Promise.resolve()
                          }
                          break;
                        case 'NUM':
                          if(!/^(\-|\+)?\d+(\.\d+)?$/.test(value)){
                            return Promise.reject(new Error(`请输入数字`))
                          }else{
                            return Promise.resolve()
                          }
                          break;
                        case 'INT':
                          if(!/^(0|[1-9][0-9]*|-[1-9][0-9]*)$/.test(value)){
                            return Promise.reject(new Error(`请输入整数`))
                          }else{
                            return Promise.resolve()
                          }
                          break;
                        case 'PHONE':
                          if(!/^\d{11}$/.test(value)){
                          // if(!/^[1-9][8,3,5][0-9]{9}$/.test(value)){
                            return Promise.reject(new Error(`请输入正确的手机号`))
                          }else{
                            return Promise.resolve()
                          }
                          break;

                        default:
                          return Promise.resolve()

                          break;
                      }
                    }else{
                      return Promise.resolve()
                    }
                }
              })

          break;
          case 'dateFormat':
            // var format = item.componentValue?item.config.options.filter((option)=>{return option.id==item.componentValue})[0].name:'YYYY-MM-DD hh:mm:ss'
            var format = item.componentValue?item.componentValue:'YYYY-MM-DD HH:mm:ss'
            configProps['format'] = format
            configProps['showTime'] = item.componentValue=='YYYY-MM-DD HH:mm:ss'?true:false
            break;
          default:
            configProps[item.componentCode]=typeof item.componentValue=='undefined'?'':item.componentValue;

            break;
        }
      })
    }

    if(authList.length){
      authList[0].columnAuthList.map((item)=>{
        if(item.formColumnCode==code){
          rules.push({
            required:item.isRequierd&&item.isRequierd==1?true:false,
            message:'此处不可空白',
          })
        }
      })
    }
    return {rules,configProps,columnCode:formColumnInfo.columnCode};
  }
  const mvalues = []
  const dateValues = []
  const selectValues = []
  formJSON.length!=0&&formJSON.map((form)=>{
    form.grids&&form.grids.length!=0&&form.grids.map((item, i)=>{
      var type = item.i.split('_')[0];
      var configInfo = getColConfigInfo(formColumnJSON,item.i,name,type);
      if(type=='MoneyInput'){
        mvalues.push({'name': getFormColName(formColumnJSON,item.i),'moneyFormat': configInfo.configProps.moneyFormat})
      }
      if(type=='Date'){
        dateValues.push({'name': getFormColName(formColumnJSON,item.i),'format': configInfo.configProps.format})
      }
      if(type=='Select'){
        selectValues.push({'name': getFormColName(formColumnJSON,item.i),'choiceStyle': configInfo.configProps.choiceStyle,digitalProgram:configInfo.configProps.digitalProgram})
      }

    })
  })
  subFormJSON.length!=0&&subFormColumnJSON.length!=0&&subFormJSON.map((subForm)=>{
    subForm.formJSON&&subForm.formJSON.map((item)=>{
      var type = item.componentType.split('_')[0];
      var configInfo = getColConfigInfo(_.find(subFormColumnJSON,{feId: subForm.feId}).formColumnJSON,item.feId,item.tableColCode,type);
      if(type=='MoneyInput'){
        mvalues.push({'name': item.tableColCode,'moneyFormat': configInfo.configProps.moneyFormat})
      }
      if(type=='Date'){
        dateValues.push({'name': item.tableColCode,'format': configInfo.configProps.format})
      }
      if(type=='Select'){
        selectValues.push({'name': item.tableColCode,'choiceStyle': configInfo.configProps.choiceStyle,digitalProgram:configInfo.configProps.digitalProgram})
      }
    })
  })
  //获取上次保存的值
  const getInitialValue=(formData,name,type,moneyFormat,dateFormat,choiceStyle)=>{
    let value="";
    if(formData.length){//表单的保存数据
      formData[0].data.map((item)=>{
        value = item[name.toUpperCase()]
      })
    }
    if(!value&&authList.length){//表单权限的配置
      authList[0].columnAuthList.map((item)=>{

        if(item.formColumnCode==name){
          value=item.defaultVal
          if(item.defaultType=='TIME'){
            value=dataFormat(item.defaultVal,dateFormat?dateFormat:'YYYY-MM-DD HH:mm:ss')

          }
        }
      })
    }
    if(!value&&serialNumList.length){//默认值为编码值
      let serialInfo = _.find(serialNumList,{bindCol:name})
      if(typeof serialInfo!='undefined'){
        value=serialInfo.serialNum
        if(serialInfo.needCols){
          let needCols = serialInfo.needCols.split(',');
          let needColsValue =[];//获取编码字段对应的表单字段默认值的设置
          if(authList.length){
            needCols.map((item)=>{
              let authInfo = _.find(authList[0].columnAuthList,{'formColumnCode': item});
              if(typeof authInfo!='undefined'){
                needColsValue.push({
                  code:item,
                  value:authInfo.defaultVal
                })
              }else{
                needColsValue.push({
                  code:item,
                  value:''
                })
              }
            })
          }
          needColsValue.map((item)=>{
            value=_.replace(value,item.code,item.value);
          })
        }
      }
    }
    // if(!value&&type=='Select'&&config.selectDefualtValue=='FIRST'&&dictInfos.length!=0){
    //   value = dictInfos[0].dictInfoCode
    // }
    if(type=='Date'){
      return value?moment(dataFormat(value,dateFormat?dateFormat:'YYYY-MM-DD HH:mm:ss')):''
    }else if(type=='MoneyInput'&&value){
      let thus  = ''
      let decimal = {'THUSSECDECIMAL':2,'SECDECIMAL':2,'THUSFOURDECIMAL':4,'FOURDECIMAL':4,'SIXDECIMAL':6,'THUSSIXDECIMAL':6}
      if(moneyFormat){
        if(moneyFormat.includes('THUS')){
          thus = ','
        }
      }
      let moneyValue = number_format(value,decimal[moneyFormat],'.',thus)
      return moneyValue
    }else if(type=='Select'&&value&&value.includes(':')){
      if(choiceStyle=='CHECK'){
        return  _.words(value.split(':')[1])
      }else{
        return  _.words(value.split(':')[1]).length>1?
        _.words(value.split(':')[1])[0]:
        value.split(':')[1]

      }
      // if(isJSON(value)){//判断当前的值是否为JSON格式
      //   value = JSON.parse(value)
      //   return Array.isArray(value)?value:[value]
      // }else{
      //   return value?[value]:[]
      // }
    }else{
      return value;
    }


  }

  const isJSON = (value)=>{
    try {
      JSON.parse(value)
      return true
    } catch(e) {
      return false

    }
  }
  //字段权限
  const getDisabledFn=(code,deployFormId)=>{
    let disabled = false;
    if(bizInfo.operation=='view'){
      disabled=true;
    }else{

      if(authList.length){
        let columnAuthListIndex = -1;
        if(deployFormId){//子表
          columnAuthListIndex =  _.findIndex(authList,{deployFormId:deployFormId})
        }else{//主表
          columnAuthListIndex =  _.findIndex(authList,{tableType:'MAIN'})
        }
        if(columnAuthListIndex!=-1&&authList[columnAuthListIndex]){
            if(_.findIndex(authList[columnAuthListIndex].columnAuthList,{formColumnCode:code})==-1){//判断当前值是否存在
              disabled=true;
            }else{
              authList[columnAuthListIndex].columnAuthList.map((item)=>{
                if(!item.formColumnCode){
                  disabled=true;
                }else{
                  if(item.formColumnCode==code&&(item.authType=='NONE'||!item.authType)){
                    disabled=true;
                  }
                }
              })
            }

        }

      }else{
        disabled=true
      }
    }
    return disabled
  }

  const onClickTree = (type,name,searchType,index,deployFormId) =>{
     let dataIndex =  _.findIndex(formdata,{deployFormId:deployFormId})
     let tabledata = dataIndex!=-1?formdata[dataIndex].data:[]
     let data =  tabledata[index]
     let cValues = {}
     if(deployFormId){
      cValues = data
     }else{
      cValues = Object.keys(values).length!=0?values:formdata[0]&&formdata[0].data[0]
     }
      type = type.replace('Tree','').toUpperCase();
      console.log('cValues',cValues);
      dispatch({
        type: 'formShow/updateStates',
        payload: {
          selectNodeType: type=='PERSON'?'USER':type,
          selectedDataIds:cValues&&Object.keys(cValues).length!=0&&cValues[`${name.split('NAME_')[0]}_`]?cValues[`${name.split('NAME_')[0]}_`].split(','):[],
          orgUserType: type=='PERSON'?'USER':type,
          selectVisible: true,
          fieldName: name,
          type,
          treeType: type=='PERSON'?'USER':type,
          searchType: type=='ORG'?searchType['limitOrgs']:searchType['limitOrg'],
          treeData: [],
          nodeIds: searchType['orgIds']&&searchType['orgIds'].toString(),
          isMultipleTree: searchType['isMultiple'],
          deployFormId,
          subDataIndex:index,
          isSubData: deployFormId?true:false,

        }
      })
  }

  const onBiz = (tableColumn,config) =>{
      if(bizInfo.formDeployId){
        dispatch({
          type: 'formShow/getPullDataDriveInfos',
          payload: {
            deployFormId:bizInfo.formDeployId,
            bizSolId,
            tableColumn,
          }
        })
        dispatch({
          type: 'formShow/updateStates',
          payload: {
            isMultipleTree:config.isMultiple,
            pullDataTableCode: tableColumn
          }
        })
        dispatch({
          type:"formShow/getDictType",
          payload:{
            searchWord:'',
            dictTypeCode: 'SYS_YEAR',
            showType: 'ALL',
            isTree:'1'
          }
        })
      }

  }

  const onBlurMoneyInput = (moneyFormat,code,index,deployFormId,e)=>{
    console.log('deployFormId',deployFormId);
    if(e.target.value&&moneyFormat){
      let thus  = ''
      let decimal = {'THUSSECDECIMAL':2,'SECDECIMAL':2,'THUSFOURDECIMAL':4,'FOURDECIMAL':4,'SIXDECIMAL':6,'THUSSIXDECIMAL':6}
      if(moneyFormat){
        if(moneyFormat.includes('THUS')){
          thus = ','
        }
        let reg = new RegExp(",","g");
        let value = number_format(e.target.value.replace(reg,""),decimal[moneyFormat],'.',thus)
        // moneyValues[code] = value.replace(reg,"")
        // setMoneyValues(moneyValues);//将格式化后的数据转换成非字符串的形式
        if(deployFormId){//设置子表数据
          const tableData = _.find(formdata,{deployFormId: deployFormId	}).data||[]
          if(!tableData[index]){
            tableData[index] = {}
          }
          tableData[index][code] = value
          form.setFieldsValue({[deployFormId]:tableData});
          dispatch({
            type: 'formShow/updateStates',
            payload: {
              isSubSelfUpdate: true
            }
          })
        }else{
          form.setFieldsValue({[code]: value});
        }
      }
      }
    }

  const generateDOM=(grids,componentValues)=>{
    return grids&&grids.length&&grids.map((item, i)=>{
      const type = item.i.split('_')[0];
      let MyComponent = components[type]||BasicData;
      let componentValueInfo = componentValues&&componentValues.filter((value)=>value.i==item.i)||[];
      let componentValue = componentValueInfo.length?componentValueInfo[0].value:'';
      let name = '',
         configInfo = {},
         authInfo = '';
      if(formColumnJSON.length){
        //获取字段编码作为name
        name = getFormColName(formColumnJSON,item.i);
        //获取当前组件的配置信息
        configInfo = getColConfigInfo(formColumnJSON,item.i,name,type);
        //不显示是不显示内容
        authInfo = authList.length?_.find(authList[0].columnAuthList,{formColumnCode:name.toUpperCase()}):"";
      }
      let componentStyleInfo = formStyleJSON&&formStyleJSON.componentStyles.length&&formStyleJSON.componentStyles.filter(info=>info.i==item.i)||[]//单个控件的样式
      let componentStyle={};
      if(componentStyleInfo.length){
        componentStyle = {...defaultStyle,...componentStyleInfo[0].style}
      }else{
        componentStyle={...defaultStyle}
      }
      let newComponentStyle = {...componentStyle,borderColor:'unset',borderWidth:'0px',borderStyle:"unset"};
      let arrComponentValues = componentValue?componentValue.split(''):"";
      let newComponentValue='';
      if(newComponentStyle.transform=='rotate(90deg)'){//竖排文字
        arrComponentValues.map((i)=>{
          newComponentValue=newComponentValue+i+'\n';
        })
        newComponentStyle.transform ='rotate(0deg)';
      }else{
        newComponentValue=arrComponentValues;
      }
      let borderStyle = {borderStyle:componentStyle.borderStyle,borderWidth:componentStyle.borderWidth,borderColor:componentStyle.borderColor};
      if(redCol.includes(name)){
        borderStyle={...borderStyle,borderColor:'red'};
      }
      switch (type) {
        case 'Upload'://上传组件
          return (
            <div key={item.i} className={styles.wrap} style={{...newComponentStyle,'justify-content':'flex-start','align-items':'flex-start',...borderStyle}}>
              {authInfo&&typeof authInfo!='undefined'&&authInfo.authType=='NONE'?
              <span className={styles.boxInput} style={{display:'inline-block',background:'#f5f5f5',cursor:'not-allowed'}}></span>:
              <UploadFile   disabled={getDisabledFn(name)} tableColCode={name} {...configInfo.configProps} relType={'FORM'}/>}
            </div>
          )
          break;
        case 'AssociatedBiz'://关联文档
          return (
            <div key={item.i} className={styles.wrap} style={{...newComponentStyle,'justify-content':'flex-start','align-items':'flex-start',...borderStyle}}>
              {authInfo&&typeof authInfo!='undefined'&&authInfo.authType=='NONE'?
              <span className={styles.boxInput} style={{display:'inline-block',background:'#f5f5f5',cursor:'not-allowed'}}></span>:
              <AttachmentBiz   disabled={getDisabledFn(name)} tableColCode={name} {...configInfo.configProps} relType={'FORM'}/>}
            </div>
          )
        break;
        case 'Title':
          return (
            <div key={item.i} className={styles.wrap} style={borderStyle}>
              <MyComponent
                value={componentValue}
                readOnly="readOnly"
                style={{...newComponentStyle}}
              />
            </div>
          )
        case 'Text':
          return (
            <div key={item.i} className={styles.wrap} style={{...borderStyle,backgroundColor:newComponentStyle.backgroundColor}}>
              <MyComponent value={componentValue} style={{...newComponentStyle,height:'100%'}}/>
            </div>
          )
          break;
        case 'DataPull':
          var formColumn = formColumnJSON.filter((col)=>col.feId==item.i)[0]
          var columnCode = formColumn&&formColumn.columnCode
          return (
            <div key={item.i} className={styles.wrap} style={{...newComponentStyle,...borderStyle}}>
                <Button onClick={onBiz.bind(this,columnCode,configInfo.configProps,name)} disabled={getDisabledFn(name)}>单据引用</Button>
            </div>
          )
          break;
        case 'NormalSubForm':
          return (
            <div key={item.i} className={styles.wrap} style={{...newComponentStyle,...borderStyle}}>
              <NormalSubForm
                feId={item.i}
                getColConfigInfo={getColConfigInfo}
                form={form}
                onSubValuesChange={onSubValuesChange}
                datainitValues={datainitValues}
                onClickTree={onClickTree}
                changeComponent={changeComponent}
                getDisabledFn={getDisabledFn}
                onBlurMoneyInput={onBlurMoneyInput}
                newComponentStyle={newComponentStyle}
                visibleInfo={visibleInfo}
              >

                </NormalSubForm>
            </div>
          )
        break;
        case 'OptionTextArea':

          return (
            <div key={item.i} className={styles.wrap} style={{...newComponentStyle,...borderStyle}}>
                {authInfo&&typeof authInfo!='undefined'&&authInfo.authType=='NONE'?
                <span className={styles.boxInput} style={{display:'inline-block',background:'#f5f5f5',cursor:'not-allowed'}}></span>:
                <WriteSign configInfo={configInfo.configProps} setValues={setValues} values={values} tableColCode={name} disabled={getDisabledFn(name)}/>}
            </div>
          )
        break;
        default:
          if(formColumnJSON.length){

            // //获取字段编码作为name
            // let name = getFormColName(formColumnJSON,item.i);
            // //获取当前组件的配置信息
            // let configInfo = getColConfigInfo(formColumnJSON,item.i,name,type);
            // //不显示是不显示内容
            // let authInfo = authList.length?_.find(authList[0].columnAuthList,{formColumnCode:name.toUpperCase()}):"";
            //组件属性
            return (

              <div key={item.i} style={type=='Fragment'&&!name.includes('_Name')?{}:{...borderStyle,overflowY:'auto'}} id={name}>
                <Popover
                  content={visibleInfo&&visibleInfo.name==name?visibleInfo.content:''}
                  title=""
                  trigger="focus"
                  visible={visibleInfo&&visibleInfo.name==name?visibleInfo.visible:false}
                  placement="topRight"
                >

                  <Form.Item
                    label=""
                    name={name}
                    rules={configInfo.rules}
                    tooltip={{placement:'topRight',content:"111111"}}
                    initialValue={getInitialValue(formdata,name,type,type=='MoneyInput'?configInfo.configProps.moneyFormat:'',type=='Date'?configInfo.configProps.moneyFormat:'',type=='Select'?configInfo.configProps.choiceStyle:'')}
                    className={styles.form_item_input}
                  >

                    {authInfo&&typeof authInfo!='undefined'&&authInfo.authType=='NONE'?
                    <span style={{display:'inline-block',background:'#f5f5f5',cursor:'not-allowed'}}></span>:
                    <MyComponent
                      controls={false}
                      {...configInfo.configProps}
                      onBlur={type=='MoneyInput'?onBlurMoneyInput.bind(this,configInfo.configProps.moneyFormat,name,'',''):()=>{}}
                      id={name}
                      form={form}
                      disabled={getDisabledFn(name)}
                      fieldValue={getInitialValue(formdata,name,type,type=='MoneyInput'?configInfo.configProps.moneyFormat:'',type=='Date'?configInfo.configProps.moneyFormat:'',type=='Select'?configInfo.configProps.choiceStyle:'')}
                      allowClear={(type=='PersonTree'||type=='DeptTree'||type=='OrgTree')?true:false}
                      onClick={(type=='PersonTree'||type=='DeptTree'||type=='OrgTree')?onClickTree.bind(this,type,name,configInfo.configProps):()=>{}}
                      onChange={(e)=>{changeComponent(e,name,type,configInfo.configProps)}}
                      style={{...newComponentStyle,height:'100%',width:'100%',background:getDisabledFn(name)?'#f5f5f5':''}}
                    />
                    }

                  </Form.Item>

              </Popover>

                  {(type=='Fragment'||name.includes('NAME_'))&&
                    <Form.Item
                      label=""
                      name={name.includes('NAME_')?name.split('NAME_')[0]+'_':name}
                      initialValue={getInitialValue(formdata,name.includes('NAME_')?name.split('NAME_')[0]+'_':name,type)}
                      style={{display:"none"}}
                    >
                      <Input/>
                    </Form.Item>
                  }
              </div>
            )
          }else{
            console.log('111111112',item.i);

            return <div key={item.i} className={styles.wrap}></div>
          }
      }
    })
  }


  //组件改变触发visible
  const changeComponent=(e,name,type,config,deployFormId,index)=>{
    console.log('type',type,name);
    let value  = e
    switch (type) {
      case 'Input':
        case 'PersonTree':
          case 'DeptTree':
            case 'OrgTree':

        value = e.target.value
        break;
      case 'Select':
        value = e
        if(config.showStyle=='TILE'&&config.choiceStyle=='SINGLE'){//单选框
          value = e.target.value
        }
      break;
      default:
        value = e

        break;
    }
    if((type=='PersonTree'||type=='DeptTree'||type=='OrgTree')&&!value){
      if(deployFormId){
        const tableIndex = _.findIndex(formdata,{deployFormId: deployFormId	})
        let newFormdata = _.cloneDeep(formdata)
        newFormdata[tableIndex].data[index][name] = ''
        newFormdata[tableIndex].data[index][`${name.split('NAME_')[0]}_`] = ''
        dispatch({
            type: 'formShow/updateStates',
            payload: {
                formdata: newFormdata,
                isSubSelfUpdate: true
            }
        })
      }else{
        console.log('value');
        setValues({...values,[name]:'',[`${name.split('NAME_')[0]}_`]:''})
        form.setFieldsValue({[name]:''});
        form.setFieldsValue({[`${name.split('NAME_')[0]}_`]:''});
      }
    }
    if(value){
      setVisibleInfo({name:name,visible:false})
    }else{
      setVisibleInfo({name:name,visible:false,content:"此处不可空白"})
    }
  }
  const onFinishFailed=({values, errorFields, outOfDate })=>{
    console.log('values',values,errorFields);
    //暂存不做校验
    if(buttonCode!='save'){
      if(errorFields.length){
        let firstError = errorFields[0];
        document.getElementById(firstError.name[0]).focus()
        setVisibleInfo({name:firstError.name[0],visible:true,content:firstError.errors[0]})
      }
    }else{
      onFinish(values)
    }
  }

  const onFinshFormatData = (data,item) =>{
    // if(values[item]&&typeof values[item]=='object'){
    //   dataJson[item]=parseInt(values[item].valueOf()/1000);
    // }else{
    //   dataJson[item]=values[item];
    //   Object.keys(moneyValues).map((mv)=>{//金额字段需要处理格式化后的数据
    //     if(mv==item){
    //       dataJson[item]=moneyValues[item];
    //     }
    //   })
    //   dateValues.map((dv)=>{
    //     if(dv.name==item){
    //       dataJson[item] = values[item]==null?'':values[item]
    //     }
    //   })

    // }

    mvalues.map((mv)=>{//金额字段需要处理掉逗号
      if(mv.name==item&&data[item]){
        let reg = new RegExp(",","g");
        var mvv = data[item].replace(reg,"")
        data[item]= mvv;
      }
    })
    dateValues.map((datev)=>{//日期字
      console.log('data',data[item],item,datev);
      if(datev.name==item&&data[item]){
        if(data[item]==null){
          data[item]= ''
        }else{
          console.log('data[item].valueOf()',data[item].valueOf());
          data[item] = parseInt(data[item].valueOf()/1000)
        }
      }
    })
    console.log('sv',selectValues);

    selectValues.map((sv)=>{
      console.log('sv',sv,item,data[item]);

      if(sv.name==item&&data[item]){
        if(data[item]==null){//针对value是null的情况
          data[item] = ''
        }else{
          data[item]= `${sv.digitalProgram}:${data[item].toString()}`
        }
      }
    })
    return data
  }
  const messageFn=(text)=>{//提示文案，应为放在字符串中不能解析message为定义
    message.error(text);
  }
  const onFinish = (values)=>{
    //暂存不做校验
    console.log('buttonCode=',buttonCode);
    if(buttonCode!='temporary'){
      //规则定义的条件判断
      let isErrors = [];
      let conditions=[];//条件数组
      var p = /values\[([^\[\]]*)\][=>]*(\'(.*?)\'|values\[([^\[\]]*)\])/g;
      if(Object.keys(globalRule).length){//全局规则定义的条件判断
        globalRule.check&&globalRule.check.map((item,index)=>{
          let isError = false;
          let ruleJsonContent = parser.parse(item.ruleJsonContent);
          eval(ruleJsonContent.text);
          isErrors.push({isControl:item.isControl,isError:isError});
          item.isError = isError;//当前规则的通过情况
          //有错误表单字段标红
          if(isError){
            var m;
            while(m = p.exec(ruleJsonContent.text)){
              conditions.push(m[0])
            }
          }
        })
      }
      if(Object.keys(nodeRule).length){//节点规则定义的条件判断
        nodeRule.check&&nodeRule.check.map((item)=>{
          let isError = false;
          let ruleJsonContent = parser.parse(item.ruleJsonContent);
          eval(ruleJsonContent.text);
          isErrors.push({isControl:item.isControl,isError:isError});
          item.isError = isError;//当前规则的通过情况
          //有错误表单字段标红
          if(isError){
            var m;
            while(m = p.exec(ruleJsonContent.text)){
              conditions.push(m[0])
            }
          }
        })
      }
      console.log('conditions=',conditions);
      //循环一个一个的判断，哪个没通过则标红
      let redCol = [];
      let con_p = /\[([^\[\]]*)\]*/g;
      conditions.map((item)=>{
        let isError = false;
        console.log('item=',item);
        let str="if("+item+"){}else{isError=true}"
        eval(str);
        if(isError){
          var m;
          while(m = con_p.exec(str)){
            let col = m[0].split('["')[1].split('"]')[0];//将【“A”]截取获取A
            console.log('col=',col);
            redCol.push(col)
          }
        }
      })

      dispatch({
        type:'formShow/updateStates',
        payload:{
          globalRule:globalRule,
          nodeRule:nodeRule,
          redCol:redCol,
          isShowRule:_.findIndex(isErrors, {'isError': true })<0?false:true//判断错误的时候自动展示右侧
        }
      })
      let errorIndex = _.findIndex(isErrors, { 'isControl': 1, 'isError': true });
      if(errorIndex>=0){
        return false;
      }
    }
    let dataJson=formdata.length&&formdata[0].data&&formdata[0].data.length?formdata[0].data[0]:{};
    let id = formdata.length&&formdata[0].data&&formdata[0].data.length?formdata[0].data[0].ID.toString():null;
    values['ID'] = id;
    Object.keys(values).map((item)=>{
      dataJson[item]=values[item];
      dataJson = onFinshFormatData(dataJson,item)
    })

    //生成流程所需数据变量
    if(Object.keys(paramsData).length>0){
      Object.keys(paramsData).map((item)=>{
        let actData = {}
        if(item=='0'){//主表
          for (let p = 0; p < paramsData[item]; p++) {
            let mainKey = paramsData[item][p]
            actData[mainKey.toUpperCase()] = values[mainKey]
          }
        }else{//浮动表



        }

      dispatch({
        type: 'formShow/updateStates',
        payload: {
          actData
        }
      })


      })
    }
    //生成流程所需数据变量
    // if(actData.length!=0){
    //   for (let index = 0; index < actData.length; index++) {
    //     const element = actData[index];
    //     if(element.feId==0){//主表
    //       let data = {}
    //       Object.keys(element.data).map((item)=>{
    //           data[item.toUpperCase()]=values[item];
    //       })
    //       element.data = data
    //     }else{//子表
    //       for (let index = 0; index < formdata.length; index++) {
    //         const fd = formdata[index];
    //         if(fd.feId!=0&&fd.feId==element.feId){//匹配到数据中的子表
    //           let subData = {}
    //           Object.keys(element.data).map((item)=>{
    //             subData[item.toUpperCase()]=fd.data[item];
    //           })
    //           element.data = subData
    //         }
    //       }
    //     }
    //   }
    //   dispatch({
    //     type: 'formShow/updateStates',
    //     payload: {
    //       actData
    //     }
    //   })
    // }
    formdata[0] = {
      deployFormId:bizInfo.formDeployId,
      data:[{...dataJson}]
    }
    let saveData = _.cloneDeep(formdata);
    console.log('formdata',formdata);
    saveData.map((item,index)=>{
        if(index!=0){//浮动表
          let subDataJson = []
          item.data&&item.data.map((data)=>{
            let subData = {}
            data&&Object.keys(data).map((key)=>{
                console.log('data',data,key)
              subData = onFinshFormatData(data,key)
            })
            subDataJson.push(subData)
          })
          item.data = subDataJson
        }


    })
    dispatch({
      type: 'formShow/updateStates',
      payload: {
        isSubSelfUpdate: false
      }
    })
    dispatch({
      type:'formShow/saveFormData',
      payload:{
        bizSolId:bizSolId,
        bizInfoId:bizInfoId?bizInfoId:bizInfo.bizInfoId,//如果存在在则按全局的
        actId:bizInfo.actId,
        procDefId:bizInfo.procDefId,
        bpmFlag:bizInfo.bpmFlag,
        deployFormId:bizInfo.formDeployId,
        formdata:JSON.stringify(saveData)
      },
      callback:function(data){
        const callBack=(bizInfoId,title)=>{
          //更新标题
          dispatch({
            type:"formShow/changeTitle",
            payload:{
              bizInfoId,
              title
            }
          })
          formCallBack(bizInfoId);
          if(attachmentTarget){
            saveAttachment(bizInfoId);
          }
          if(relBizTarget){
            saveBiz(bizInfoId);
          }

        }
        //根据编码的设置，显示值
        let valuesKeys = Object.keys(values);
        let dataKyes = Object.keys(data)
        valuesKeys.map((key)=>{
          if(dataKyes.includes(key.toUpperCase())){
            form.setFieldsValue({[key]:data[key.toUpperCase()]});
          }
        })
        getBizInfoTitle(callBack);
        //刷新列表
        const search = location.search.includes('?') || !location.search ?location.search : `?${location.search}`
        let pathname = `/${location.pathname.split('/')[1]}`;
        if(pathname=='/dynamicPage'){
          console.log('dynamicPage=',dynamicPage.stateObj[bizSolId]);
          //如果不分页则请求全部
          //加载列表建模数据
          if(dynamicPage.stateObj[bizSolId]&&Object.keys(dynamicPage.stateObj[bizSolId]).length){
            const {limit,listModel,yearCutColumn,year,listSearchWord}=dynamicPage.stateObj[bizSolId];
            dispatch({
              type:"dynamicPage/getListModelData",
              payload:{
                bizSolId,
                start:1,
                limit:listModel.pageFlag?limit:100000,
                searchWord: listSearchWord,
                year: (yearCutColumn && listModel.yearCutFlag)? JSON.stringify({"columnCode":yearCutColumn,"value":year}) : '',
                pageSearch:
                  listModel.listPage
                    ? JSON.stringify({ columnCode: listModel.listPage, value: 0 })
                    : '',
              }
            })
          }
        }
      }
    })
  }
  //保存附件
  function saveAttachment(bizInfoId){
    let atts = [];
    if(Object.keys(attachmentFormList).length!=0){
      Object.keys(attachmentFormList).map((item)=>{
        atts.push({relType:'FORM',columnCode: item,files:attachmentFormList[item]});
      })
    }
    if(attachmentList.length!=0){
      atts.push({relType:'ATT',files:attachmentList})
    }
    dispatch({
        type: 'formShow/saveAttachment',
        payload:{
            bizInfoId,
            atts: JSON.stringify(atts),
            bizSolId: bizSolId,
        }
    })
  }

  function saveBiz(bizInfoId){
    let atts = [];
    let relBizInfoIds = [];
    if(Object.keys(formRelBizInfoList).length!=0){
      Object.keys(formRelBizInfoList).map((item)=>{
        atts.push({relType:'FORM',columnCode: item,relBizInfoIds:formRelBizInfoList[item].map((item)=>item.relBizInfoId)});
        relBizInfoIds = relBizInfoIds.concat(formRelBizInfoList[item].map((item)=>item.relBizInfoId))
      })
    }
    if(relBizInfoList.length!=0){
      atts.push({relType:'ATT',relBizInfoIds:relBizInfoList.map((item)=>item.relBizInfoId)})
      relBizInfoIds = relBizInfoIds.concat(relBizInfoList.map((item)=>item.relBizInfoId))
    }
    dispatch({
      type: 'formShow/saveRelBizInfo',
      payload:{
        atts: JSON.stringify(atts),
        bizInfoId,
        bizSolId: bizSolId,
        relBizInfoIds: relBizInfoIds.toString(),
      }
    })
  }
    //获取标题
    const getBizInfoTitle=(callback)=>{
      //获取表单值
      let formValue = form.getFieldsValue(true);
      dispatch({
        type:"formShow/getBizInfoTitle",
        payload:{
          dataJson:JSON.stringify(formValue),
          bizSolId:bizSolId,
          procDefId:bizInfo.procDefId,
          formDeployId:bizInfo.formDeployId
        },
        callback:(title)=>{
          callback(bizInfo.bizInfoId,title)
        }
      })
    }
  const onOKValue = (name,id,orgId) =>{

    if(isSubData){//子表
      const tableIndex = _.findIndex(formdata,{deployFormId: deployFormId	})
      // const tableData = tableIndex!=-1?formdata[tableIndex].data:[]
      // if(!tableData[subDataIndex]){
      //   tableData[subDataIndex] = {}
      // }
      // if(!tableData[subDataIndex]){
      //   tableData[subDataIndex] = {}
      // }
      // tableData[subDataIndex][fieldName] = name.join(',')
      // tableData[subDataIndex][`${fieldName.split('NAME_')[0]}_`] = id.join(',')
      // form.setFieldsValue({[deployFormId]:tableData});
      let newFormdata = _.cloneDeep(formdata)
      if(newFormdata.length==0){//没有表单数据时初始化主表数据
        newFormdata = [{deployFormId:bizInfo.deployFormId,data:[]}]
      }
      if(tableIndex==-1){
        newFormdata.push({deployFormId:deployFormId,data:[{[fieldName]:name.join(','),[`${fieldName.split('NAME_')[0]}_`]:id.join(',')}]})
      }else{
        if(!newFormdata[tableIndex].data[subDataIndex]){//添加的子表数据为undefined
          newFormdata[tableIndex].data[subDataIndex] = {}
        }
        newFormdata[tableIndex].data[subDataIndex][fieldName] = name.join(',')
        newFormdata[tableIndex].data[subDataIndex][`${fieldName.split('NAME_')[0]}_`] = id.join(',')
      }
      dispatch({
          type: 'formShow/updateStates',
          payload: {
              formdata: newFormdata,
              isSubSelfUpdate: true
          }
      })

    }else{
      form.setFieldsValue({[fieldName]:name.join(',')});
      form.setFieldsValue({[`${fieldName.split('NAME_')[0]}_`]:id.join(',')});//传ID
      setValues({
        ...values,
        [`${fieldName.split('NAME_')[0]}_`]:id.join(','),
        [`${fieldName}_ORGID`]: orgId,
        [`${fieldName}_NAME`]:name
      })
    }


  }
  return (
    <Form
      name="form_add"
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      className={styles.form_warp}
      scrollToFirstError={true}
      requiredMark={false}
    >
      {formJSON.length?formJSON.map((item,index)=>{
          return <ReactGridLayout
          key={index}
          layout={item.grids}
          {...defaultProps}
          isDraggable={false}
          autoSize={true}
        >
          {generateDOM(item.grids,item.componentValues)}
        </ReactGridLayout>
        }):
        null
      }
      {/**selectVisible&&<CM onOKValue={onOKValue} orgId={values[`${fieldName}_OrgId`]} valueName={values[`${fieldName}_Name`]} value={values[`${fieldName}`]} />*/}
      {selectVisible&&<OT onOKValue={onOKValue}   orgId={values[`${fieldName}_ORGID`]} type={searchType} treeType={treeType} nodeIds={nodeIds} isMultipleTree={isMultipleTree}/>}
      {pullDataModel&&<PD />}
    </Form>
  );
}
export default connect(({formShow,loading,dynamicPage})=>{return {formShow,loading,dynamicPage}})(AddForm);
