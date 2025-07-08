import { parser } from 'xijs';
import { message } from 'antd';
import {dataFormat} from '../../util/util'
import { scriptEvent, getCleanScript } from '../../util/performScript';
import {fetchAsync as fetchAsyncFN} from '../../util/globalFn';
const fetchAsync = fetchAsyncFN;//这个用于规则定义中请求接口，不能去掉
//在集合内
function getResult(arr1, arr2) {
  let tmpArr1 = arr1?.toString()?.split(',');
  if(tmpArr1&&tmpArr1.length){
    return tmpArr1.every(item => {
      return arr2.includes(item);
    })
  }else{
    return false
  }
}
//如果是undifad则转换成“”
function transformValue(value){
  if(typeof value=='undefined'||value==null){
    return '';
  }else{
    return value
  }
}
//不在集合内
function getNoResult(arr1, arr2) {
  console.log('arr1?.split(',')==',arr1?.toString()?.split(','))
  let tmpArr1 = arr1?.toString()?.split(',');
  if(tmpArr1&&tmpArr1.length){
    return tmpArr1.every(item => {
      return !arr2.includes(item);
    })
  }else{
    return true
  }
}
//获取标红的控件
export const redColFn=(errorsInfo,values)=>{
  console.log('values===',values);
  console.log('errorsInfo===',errorsInfo);
  let redCol = [];
    errorsInfo.map((item)=>{
      let isError = false;
      let str=""
      if(item.tableCode=='0'){
        str="if("+item.condition+"){}else{isError=true}"
        try{//避免写的不规范影响后续操作
          eval(str);
        }catch(e){
          console.log('e===',e);
        }
        if(isError){
          //主表（先判断condition执行是否成功，不成功将key的值写入）
          let keys = item.key.split(',');
          console.log('keys===',keys);
          keys.map((col)=>{
            redCol.push({code:`0__${col}`,index:0})
          })
        }
      }else{
        let tmpInfo = [];
        //判断是否为空,空的时候子表可以为空，不为空的时候子表数据不能为空
        let tmpConditions = item.condition.split('==');
        if(tmpConditions.length==2&&tmpConditions[1]==''){
          str=`tmpInfo=${item.condition};if(tmpInfo.length==values["${item.tableCode}"].length){}else{isError=true}`;
        }else{
          str=`tmpInfo=${item.condition};if(values["${item.tableCode}"].length&&tmpInfo.length==values["${item.tableCode}"].length){}else{isError=true}`;
        }
        try{//避免写的不规范影响后续操作
          eval(str);
        }catch(e){
          console.log('e===',e);
        }
        if(isError){
          //子表的时候获取子表错误的行数
          let tmpTabelData = values[`${item.tableCode}`];
          console.log('tmpTabelData==',tmpTabelData,tmpInfo);
          let isErrorsIndex = [];
          tmpTabelData&&tmpTabelData.length?tmpTabelData.map((info,index)=>{
            if(typeof _.find(tmpInfo,{ID:info.ID})=='undefined'){
              isErrorsIndex.push(index)
            }
          }):isErrorsIndex.push('*');
          console.log('isErrorsIndex==',isErrorsIndex);
          let keys = item.key.split(',');
          console.log('keys1111===',keys);
          keys.map((col)=>{
            if(col.includes('__')){
              isErrorsIndex.map((index)=>{
                redCol.push({code:col,index:index})
              })
            }else{
              redCol.push({code:`0__${col}`,index:0})
            }
          })
        }
      }
    })
    return redCol;
}
export const checkRule = async(values,globalRule,nodeRule,messageFn,errorsInfoFn,bizInfo,cutomHeaders)=>{
  //规则定义的条件判断
  let isErrors = [];
  let time = new Date();
  let allErrorsInfo=[];
  if(Object.keys(globalRule).length){//全局规则定义的条件判断
    let globalerrors = globalRule.check&&globalRule.check.map((item,index)=>{
      let ruleJsonContent = item.ruleJsonContent;
      if(ruleJsonContent&&((ruleJsonContent.ruleProperty=='activeDate'&&ruleJsonContent.propertyValue*1000<=Date.parse(time))||
      (ruleJsonContent.ruleProperty=='loseDate'&&ruleJsonContent.propertyValue*1000>Date.parse(time))||ruleJsonContent.ruleProperty=='empty')){
        let tmpText = ruleJsonContent.text;
        //将函数定义和text合并
        if(ruleJsonContent.funData?.length){
          let newScriptText = '';
          ruleJsonContent.funData.map((item)=>{
            let scriptContent = `async function evalFun_${item.id}_${item.type}(errorsInfo,isError){
              ${item.scriptContent}
              return {errorsInfo,isError};
            }`
            newScriptText = newScriptText+scriptContent
          })
          tmpText = newScriptText+ruleJsonContent.text;
        }
        //为了函数里面能够等待返回结果，在规则定义中在加一个函数方法
        //errorsInfo为错误信息，isError是否校验通过，false通过，true不通过，item为当前规则的信息
        tmpText = `let isError = false; 
        let errorsInfo=[];
        async function tmpFun(){
          ${tmpText} return {errorsInfo,isError,item} 
        }; tmpFun();`;
        console.log('tmpText==',tmpText);
        return new Promise((resolve, reject) => {
          setTimeout(()=>{
            try {
              const result = eval(tmpText);
              resolve(result);
            } catch (e) {
              reject(e);
            }
          },0)
        }).catch(e=>{
          message.error(`规则定义中语法错误：${e}`);
        });
      }
    })
    await Promise.all(globalerrors).then(data=>{
      console.log('data==',data);
      data.map((info)=>{
        if(info){
          let item = info.item;
          let isError = info.isError;
          allErrorsInfo = info.errorsInfo;
          isErrors.push({isControl:item.isControl,isError:isError,id:item.id});//这是单条的校验结果
        }
      })
    })
  }
  if(Object.keys(nodeRule).length){//节点规则定义的条件判断
    let nodeErrors = nodeRule.check&&nodeRule.check.map((item)=>{
      let ruleJsonContent =item.ruleJsonContent;
      if(ruleJsonContent&&((ruleJsonContent.ruleProperty=='activeDate'&&ruleJsonContent.propertyValue*1000<=Date.parse(time)/1000)||
        (ruleJsonContent.ruleProperty=='loseDate'&&ruleJsonContent.propertyValue*1000>Date.parse(time)/1000)||ruleJsonContent.ruleProperty=='empty')){
        let tmpText = ruleJsonContent.text;
        //将函数定义和text合并
        if(ruleJsonContent.funData?.length){
          let newScriptText = '';
          ruleJsonContent.funData.map((item)=>{
            let scriptContent = `async function evalFun_${item.id}_${item.type}(errorsInfo,isError){
              ${item.scriptContent}
              return {errorsInfo,isError};
            }`
            newScriptText = newScriptText+scriptContent
          })
          tmpText = newScriptText+ruleJsonContent.text;
        }
        //为了函数里面能够等待返回结果，在规则定义中在加一个函数方法
        //errorsInfo为错误信息，isError是否校验通过，false通过，true不通过，item为当前规则的信息
        tmpText = `let isError = false; 
        let errorsInfo=[];
        async function tmpFun(){
          ${tmpText} return {errorsInfo,isError,item} 
        }; tmpFun();
        `
        return new Promise((resolve, reject) => {
          setTimeout(()=>{
            try {
              const result = eval(tmpText);
              resolve(result);
            } catch (e) {
              message.error('语法错误');
              reject(e);
            }
          },0)
        }).catch(e=>{
          message.error(`规则定义中语法错误：${e}`);
        });
      }
    })
    await Promise.all(nodeErrors).then(data=>{
      data.map((info)=>{
        if(info){
          let item = info.item;
          let isError = info.isError;
          allErrorsInfo = allErrorsInfo.concat(info.errorsInfo);
          isErrors.push({isControl:item.isControl,isError:isError,id:item.id});//这是单条的校验结果
        }
      })
    })
  }
  return {isErrors,errorsInfo:allErrorsInfo}
}
//格式化表单值
export const formatFromValue=(value,key,form,type,tabelCode,dictsList)=>{
  let newValue = value;
  if (
    value &&
    typeof value == 'string' &&
    value.split('date_').length == 2
  ) {
    if(type=='title'){//在保存title 需要给后端传格式化的值
      let format = form.getFieldState(key).component[1].format;
      console.log('format=',format);
      let date = value.split('date_')[1];
      newValue = date&&date!='0'?dataFormat(date,format):''
    }else{
      newValue = value.split('date_')[1]
    }
  }
  else if(key.includes('TLDT_')){//基础数据码表
    if(type=='title'){//在标题中只有主表
      let basicTypeCode = [];
      let basicName = [];
      let tmpKey = key;//应为怕以后有子表为标题的，所以做了一个复制
      let codeTable = form.getFieldState(tmpKey)?.component[1].codeTable;
      let basicInfos = loopFilterBasic(value,dictsList[codeTable]?.dictInfos,[])
      basicInfos&&basicInfos.map((item)=>{
        basicName.push(item.dictInfoName)
      })
      basicName = [...new Set(basicName)]
      newValue = basicName.join(',');
    }else{
      newValue = value&&typeof value=='object'?value.join(','):value;
    }
  }else{
    // form.setFieldState(key, (state) => {//这个规则定义中需要，所以删除放到保存之前
    //   if (state.componentType == 'WriteSign') {
    //     //类型为手写签批时删除此字段的值
    //     newValue = '';
    //   }
    // })
  }
  return newValue
}
//存之前需要把手写签批时删除此字段的值
function saveFormatFromValue(values,form){
  let newValues = {};
  Object.keys(values).map((key)=>{
    let newValue = values[key];
    form.setFieldState(key, (state) => {
      if (state.componentType == 'WriteSign') {
        //类型为手写签批时删除此字段的值
        newValue = '';
      }
    })
    newValues[key] = newValue;
  })
  return newValues;
}
const loopFilterBasic=(value,hide_basicData,basicInfos)=>{
  hide_basicData&&hide_basicData.map((item)=>{
    if((typeof value=='string'&&value==item.dictInfoCode)||(typeof value=='object'&&value.length&&value.includes(item.dictInfoCode))){
      basicInfos.push(item)
    }
    if(item.children&&item.children.length){
      loopFilterBasic(value,item.children,basicInfos)
    }
  })
  return basicInfos;
}
export const getListModelData = (dynamicPage,dispatch,bizSolId) => {
  //如果不分页则请求全部
  //加载列表建模数据
  if (
    dynamicPage.stateObj[bizSolId] &&
    Object.keys(dynamicPage.stateObj[bizSolId]).length
  ) {
    const { limit, listModel, currentSelectInfo,dragInData, year,searchWord,yearCutColumn, listSearchWord } =
      dynamicPage.stateObj[bizSolId];
    if (listModel.treeSourceType === 'MODEL') {
      dispatch({
        type: 'dynamicPage/getListModelTreeData',
        payload: {
          listModelId: listModel.listModelId,
          start: 1,
          limit: limit,
          year: (yearCutColumn && listModel.yearCutFlag)? JSON.stringify({"columnCode":yearCutColumn,"value":year}) : '',
          searchWord,
          listModel,
        },
      });
    }
    dispatch({
      type: 'dynamicPage/getListModelData',
      payload: {
        bizSolId,
        listModelId: listModel.listModelId || '',
        start: 1,
        limit: listModel.pageFlag ? limit : 100000,
        // nodeValue: currentSelectInfo?.nodeCode,
        nodeValue: dragInData?.nodeId,
        searchWord: listSearchWord,
        year: (yearCutColumn && listModel.yearCutFlag)? JSON.stringify({"columnCode":yearCutColumn,"value":year}) : '',
        pageSearch:
              listModel.listPage
                ? JSON.stringify({ columnCode: listModel.listPage, value: 0 })
                : '',
      },
    });
  }
};
export const analysisTitle=(values,bizInfo,form,dictsList,setState)=>{
  //处理标题
  const titleDesign = bizInfo.titleDesign;
  let titleList = [];
  titleDesign&&titleDesign.map((item)=>{
    if(item.valueType=='COLUMN'){
      let key = item.value;
      let tmpValue = values[key]?formatFromValue(values[key], key, form, 'title','0',dictsList):"";
      titleList.push({
        column:key,
        value:tmpValue
      })
    }else if(item.valueType=='FIXED'){
      let value = item.value;
      if(item.value=='YEAR'||item.value=='MONTH'||item.value=='DAY'){
        let startTimes = dataFormat(parseInt(new Date()/1000),'YYYY-MM-DD');
        if(typeof bizInfo.operation!='undefined'&&bizInfo.operation!='edit'&&bizInfo.startTime){
          //送交时间
          startTimes = dataFormat(bizInfo.startTime,'YYYY-MM-DD');
        }
        let startTimesArr = startTimes.split('-');
        if(item.value=='YEAR'){
          value=startTimesArr[0];
        }else if(item.value=='MONTH'){
          value=startTimesArr[1]
        }else if(item.value=='DAY'){
          value=startTimesArr[2]
        }
      }
      titleList.push({
        column:'',
        value:value
      })
    }else{
      titleList.push({
        column:'',
        value:item.value
      })
    }
  })
  return titleList;
}
//自定义业务校验
export const getRuleFn=async(dispatch,bizInfo,buttonId,globalRule,nodeRule,ruleData,values,type,setState)=>{
  if(bizInfo.bizInfoId!='0'){//有流程
    switch(type){
      case 'afterSubmit':
        return customCheckAfterSubmit(globalRule,nodeRule,values);
      case 'beforeSubmit':
        return coustomCheck(dispatch,globalRule,nodeRule,values,setState);
      case 'afterSend':
        return customCheckAfterSend(globalRule,nodeRule,values);
    }
  }else{
    let tmpGlobalRule = {};
    let tmpNodeRule = {};
    for(let i=0;i<ruleData?.length;i++){
      let ruleItem = ruleData[i];
      if(ruleItem.subjectId==buttonId){
        tmpNodeRule=ruleItem;
      }else if(!ruleItem.subjectId||ruleItem.subjectId=='all'||ruleItem.subjectId=='1'){//全局
        tmpGlobalRule = ruleItem
      }
    }
    switch(type){
      case 'afterSubmit':
        return customCheckAfterSubmit(tmpGlobalRule,tmpNodeRule,values);
      case 'beforeSubmit':
        return coustomCheck(dispatch,tmpGlobalRule,tmpNodeRule,values,setState);
      case 'afterSend':
        return customCheckAfterSend(globalRule,nodeRule,values);
    }
  }
}
//送交后
const customCheckAfterSend=async(globalRule,nodeRule,values)=>{
  let pattern = /_onAfterSend/;
  await globalRule?.custom?.map((item)=>{
    if(item.ruleJsonContent&&pattern.test(item.ruleJsonContent)){
      //表单加载时调用
      try{
        eval(item.ruleJsonContent+'_onAfterSend(values)');
      }catch(e){
        console.log('e===',e);
      }
    }
  })
  await nodeRule?.custom?.map((item)=>{
    if(item.ruleJsonContent&&pattern.test(item.ruleJsonContent)){
      //表单加载时调用
      try{
        eval(item.ruleJsonContent+'_onAfterSend(values)');
      }catch(e){
        console.log('e===',e);
      }
    }
  })
}
//onAfterSubmit 表单提交后调用的代码
const customCheckAfterSubmit=async(globalRule,nodeRule,values)=>{
  let pattern = /_onAfterSubmit/;
  await globalRule?.custom?.map((item)=>{
    if(item.ruleJsonContent&&pattern.test(item.ruleJsonContent)){
      //表单加载时调用
      try{
        eval(item.ruleJsonContent+'_onAfterSubmit(values)');
      }catch(e){
        console.log('e===',e);
      }
    }
  })
  await nodeRule?.custom?.map((item)=>{
    if(item.ruleJsonContent&&pattern.test(item.ruleJsonContent)){
      //表单加载时调用
      try{
        eval(item.ruleJsonContent+'_onAfterSubmit(values)');
      }catch(e){
        console.log('e===',e);
      }
    }
  })
}
//表单提交之前处理方法，可以返回false防止数据提交。
const coustomCheck = async(dispatch,globalRule,nodeRule,values,setState)=>{
  let pattern = /_onBeforeSubmit/;
  let arrContinus = [];
  console.log('globalRule===',globalRule);
  console.log('nodeRule==',nodeRule);
  await globalRule?.custom?.map((item)=>{
    if(item.ruleJsonContent&&pattern.test(item.ruleJsonContent)){
      //表单加载时调用
      try{
        eval(item.ruleJsonContent+'if(!_onBeforeSubmit(values)){arrContinus.push({id:item.id,isError:true})}else{arrContinus.push({id:item.id,isError:false})}');
      }catch(e){
        console.log('e===',e);
      }
    }
  })
  await nodeRule?.custom?.map((item)=>{
    if(item.ruleJsonContent&&pattern.test(item.ruleJsonContent)){
      //表单加载时调用
      try{
        eval(item.ruleJsonContent+'if(!_onBeforeSubmit(values)){arrContinus.push({id:item.id,isError:true})}else{arrContinus.push({id:item.id,isError:false})}');
      }catch(e){
        console.log('e===',e);
      }
    }
  })
  console.log('arrContinus===',arrContinus);
  setState({
    arrContinus:arrContinus,
    isShowRule:_.find(arrContinus,{isError:true})?true:false//判断错误的时候自动展示右侧
  })
  if(arrContinus.filter(i=>i.isError==true).length){
    return false
  }else{
    return true;
  }
}
//处理表单数据
export const dealvaluesFn=(id,securityId,cutomHeaders,title,values,form,subMap)=>{
  if (id || securityId || cutomHeaders.mainTableId) {
    //拟稿的时候会自定生成一个mainTableId
    values['ID'] = id || securityId || cutomHeaders.mainTableId;
  }
  // values['TITLE'] = title;放到外面了不需要了
  //应为送交标题那需要日期的时时间格式，保存后端需要的是时间戳，所以时间值加了date_，需要在保存的时候去掉
  //console.log('values1111=', _.cloneDeep(values));
  const commentJson = values['commentJson']; //意见
  const attachment_array = values['attachment_array']; //关联文件
  delete values['commentJson'];
  delete values['array_areaTravel'];
  delete values['attachment_array'];
  delete values['extraParams'];
  let subData = [];
  //console.log('values=', _.cloneDeep(values));
  Object.keys(values).map((key) => {
    if (values[key] && typeof values[key] == 'object') {
      //判断是否是码表
      if (key.includes('TLDT_')) {
        values[key] = formatFromValue(values[key], key, form, '', '0');
      } else {
        if(values[key]&&Array.isArray(values[key])){
          values[key].map((item) => {
            Object.keys(item).map((subKey) => {
              item[subKey] = formatFromValue(
                item[subKey],
                subKey,
                form,
                '',
                key,
              );
            });
          });
        }else{
          delete(values[key]);
        }
        //console.log('values[key]==',values[key])
        if (subMap?.[key]) {
          subData.push({
            deployFormId: subMap?.[key] || '',
            data: values[key],
          });
          delete values[key]
        }else{
          //其他的是附件则需要处理成是否存在用于判断是否是空
          // console.log('upload_array==',upload_array);
          // if(upload_array&&upload_array[key]?.length){
          //   values[key] = 'noempty'
          // }else{
          //   values[key] = ''
          // }
        }
      }
    } else {
      values[key] = formatFromValue(values[key], key, form, '', '0');
    }
  });
  return {values:values,subData:subData,commentJson:commentJson,attachment_array:attachment_array};
}
  //表单提交
 export const submitFormFn = async(buttonId,values,params,saveCallback,form,dispatch,bizSolId,subMap,onRule,bizInfo,cutomHeaders,id,securityId,location,sctiptMap,dynamicPage,relBizInfoList,attachmentList,
  globalRule,nodeRule,ruleData,dictsList,updateFlag,setState,fnList,isNoMessage,bizTaskId) => {

    //获取标题
    const getBizInfoTitle = (
      values,
      saveValues,
      buttonId,
      params,
      saveCallback,
      relBizInfoList,
      attachmentList,
      dictsList,
      updateFlag
    ) => {
      //保存标题，及时送交的标题展示
      let title = analysisTitle(
        values,
        bizInfo,
        form,
        dictsList,
        setState
      );
      saveFormDataFn(values,saveValues, title, buttonId, params, saveCallback,dynamicPage,sctiptMap,relBizInfoList,attachmentList,updateFlag);
    };
    function saveAttachmentBiz(attachment_array,relBizInfoList){
      let relBizInfoIds=[];
      //关联文档附件
      let relAttsInfo = {
        relType: 'ATT',
        columnCode:'',
        relBizInfoIds: relBizInfoList.map((item) => item.relBizInfoId),
      }
      let tmpAttachmentArray = attachment_array?attachment_array:[]
      tmpAttachmentArray.push(relAttsInfo);
      tmpAttachmentArray&&tmpAttachmentArray.map((item)=>{
        relBizInfoIds = relBizInfoIds.concat(item.relBizInfoIds)
      })
      dispatch({
        type: 'formShow/saveRelBizInfo',
        payload:{
          atts: tmpAttachmentArray?JSON.stringify(tmpAttachmentArray):'',
          bizInfoId:bizInfo.bizInfoId,
          bizSolId: bizSolId,
          relBizInfoIds: relBizInfoIds.toString(),
          mainTableId:cutomHeaders.mainTableId
        }
      })
    }
    //保存附件
    function saveAttachment() {
      dispatch({
        type: 'formShow/saveAttachment',
        payload: {
          bizInfoId: bizInfo.bizInfoId,
          bizSolId: bizSolId,
          mainTableId:cutomHeaders.mainTableId
        },
      });
    }
    function saveTemporarySign(commentJson) {
      dispatch({
        type: 'formShow/saveTemporarySign',
        payload: JSON.stringify({
          bizInfoId:bizInfo.bizInfoId,
          bizTaskId:bizTaskId,
          signs:commentJson
        }),
        callback: (data) => {
          //form.setValues({ commentJson: data?.data?.tableColumCodes });
        },
      });
    }
    const saveFormDataFn = async (
      oldValues,
      values,
      title,
      buttonId,
      params,
      saveCallback,
      dynamicPage,
      sctiptMap,
      relBizInfoList,
      attachmentList,
      updateFlag
    ) => {
      // scriptEvent 为按钮前置、中置、后置事件列表
      //let fnList = buttonId&&await scriptEvent(sctiptMap[buttonId]);
      let dealvalues = dealvaluesFn(id,securityId,cutomHeaders,title,values,form,subMap);
      values = dealvalues['values'];
      let subData = dealvalues['subData'];
      //const upload_array = dealvalues['upload_array']; //上传附件的值
      const commentJson = dealvalues['commentJson']; //意见
      const attachment_array = dealvalues['attachment_array']; //关联文件
      //无流程的检验
      if(buttonId&&getCleanScript(fnList[0]).includes('onRule(true)')){
        onRule(values, subData,buttonId).then((data)=>{//校验区
          values = saveFormatFromValue({...values},form);
          if(!data){
            getRuleFn(dispatch,bizInfo,buttonId,globalRule,nodeRule,ruleData,oldValues,'beforeSubmit',setState).then((data)=>{//自定义业务校验
              if(data){
                let tdata = [];
                tdata[0] = {
                  deployFormId: bizInfo.formDeployId,
                  data: [{ ...values }],
                };
                tdata = tdata.concat(subData);
                saveFormData(
                  commentJson,
                  attachment_array,
                  tdata,
                  buttonId,
                  params,
                  saveCallback,
                  dynamicPage,
                  relBizInfoList,
                  attachmentList,
                  values,
                  oldValues,
                  updateFlag,
                  title
                );
              }
            })
          }
        })
      }else{
        values = saveFormatFromValue({...values},form);
        getRuleFn(dispatch,bizInfo,buttonId,globalRule,nodeRule,ruleData,oldValues,'beforeSubmit',setState).then((data)=>{//自定义业务校验
          if(data){
            let tdata = [];
            tdata[0] = {
              deployFormId: bizInfo.formDeployId,
              data: [{ ...values }],
            };
            tdata = tdata.concat(subData);
            saveFormData(
              commentJson,
              attachment_array,
              tdata,
              buttonId,
              params,
              saveCallback,
              dynamicPage,
              relBizInfoList,
              attachmentList,
              values,
              oldValues,
              updateFlag,
              title
            );
          }
        })
      }
    };
    //保存数据
    const saveFormData = (
      commentJson,
      attachment_array,
      tdata,
      buttonId,
      params,
      saveCallback,
      dynamicPage,
      relBizInfoList,
      attachmentList,
      values,
      oldValues,
      updateFlag,
      title
    ) => {
      let payload={
        buttonId: buttonId,
        bizSolId: bizSolId,
        bizInfoId: bizInfo.bizInfoId,
        actId: bizInfo.actId,
        actName:bizInfo.actName,
        procDefId: bizInfo.procDefId,
        bpmFlag: bizInfo.bpmFlag,
        deployFormId: bizInfo.formDeployId,
        formdata: JSON.stringify(tdata),
        mainTableId:tdata[0].data[0]['ID'],
        updateFlag:updateFlag,
        ...params,
        appFlag: window.location.href.includes('mobile')?'1':'0',
        title:JSON.stringify(title)
      }
      console.log('bizTaskId===',bizTaskId);
      if(bizTaskId){
        dispatch({
          type:'formShow/editableBizTask',
          payload:{
            bizTaskId:bizTaskId
          },
          callback:()=>{
            dispatch({
              type: 'formShow/saveFormData',
              payload: payload,
              isNoMessage:isNoMessage,
              callback: async (data) => {
                let newValue = {...values};
                //把返回的数据赋值到表单中
                data&&Object.keys(data).map((key)=>{
                  if(key!='id'&&key!='mainTableCode'&&key!='title'){
                    newValue[key] = data[key];
                    form.setValues({
                      [key]:data[key]
                    })
                  }
                })
                setState({
                  updateFlag:1,
                  allFormTitle: data?.title,
                })
                saveAttachment(); //保存附件
                if (commentJson) {
                  saveTemporarySign(commentJson); //暂存意见
                }
                //if (attachment_array) {
                  saveAttachmentBiz(attachment_array,relBizInfoList); //关联文件
                //}
                //自定义业务校验（表单提交后调用的代码
                getRuleFn(dispatch,bizInfo,buttonId,globalRule,nodeRule,ruleData,oldValues,'afterSubmit')
                setTimeout(()=>{
                  saveCallback(data,values,payload,data?.title);
                },500)//setValues没赋值完关闭会报错
                if(buttonId){
                  //刷新列表
                  let pathname = `/${location.pathname.split('/')[1]}`;
                  if (pathname == '/dynamicPage' && !location?.query?.microAppName) {
                    getListModelData(dynamicPage, dispatch, bizSolId);
                  }
                }
              },
            });
          }
        })
      }else{
        dispatch({
          type: 'formShow/saveFormData',
          payload: payload,
          isNoMessage:isNoMessage,
          callback: async (data) => {
            let newValue = {...values};
            //把返回的数据赋值到表单中
            data&&Object.keys(data).map((key)=>{
              if(key!='id'&&key!='mainTableCode'&&key!='title'){
                newValue[key] = data[key];
                form.setValues({
                  [key]:data[key]
                })
              }
            })
            setState({
              updateFlag:1,
              allFormTitle: data?.title,
            })
            saveAttachment(); //保存附件
            if (commentJson) {
              saveTemporarySign(commentJson); //暂存意见
            }
            //if (attachment_array) {
              saveAttachmentBiz(attachment_array,relBizInfoList); //关联文件
            //}
            //自定义业务校验（表单提交后调用的代码
            getRuleFn(dispatch,bizInfo,buttonId,globalRule,nodeRule,ruleData,oldValues,'afterSubmit')
            setTimeout(()=>{
              saveCallback(data,values,payload,data?.title);
            },500)//setValues没赋值完关闭会报错
            if(buttonId){
              //刷新列表
              let pathname = `/${location.pathname.split('/')[1]}`;
              if (pathname == '/dynamicPage' && !location?.query?.microAppName) {
                getListModelData(dynamicPage, dispatch, bizSolId);
              }
            }
          },
        });
      }
    };
    //一定要将form.values解析，要不改变会values值会改变表单的值
    //let values = JSON.parse(JSON.stringify(form.values));
    //form&&form.submit((values) => {
      let oldValues = JSON.parse(JSON.stringify(values));
      // console.log('values===', oldValues);
      // let leftTreeData = localStorage.getItem('leftTreeData')
      //   ? JSON.parse(localStorage.getItem('leftTreeData'))
      //   : '';
      // if (leftTreeData&&buttonId) {
        // let listModel = leftTreeData[location.query.bizSolId]?.listModel;
        // let dragCodes = leftTreeData[location.query.bizSolId]?.dragCodes;
        // let dragInData =
        //   leftTreeData[location.query.bizSolId]?.dragInData || {};
        // let usedYear =
        //   leftTreeData[location.query.bizSolId]?.usedYear ||
        //   new Date().getFullYear();
        // if (
        //   //左树为表单的情况
        //   listModel?.modelType === 'TREELIST' &&
        //   listModel?.treeSourceType != 'ORGANIZATION' &&
        //   dragCodes &&
        //   Object.keys(dragCodes).length
        // ) {
        //   let grade = dragInData?.GRADE;
        //   console.log('values=', values);
        //   //调用接口

        // } else {
        //   getBizInfoTitle(oldValues, values, buttonId, params, saveCallback,relBizInfoList,attachmentList,dictsList);
        // }
      //} else {
        getBizInfoTitle(oldValues, values, buttonId, params, saveCallback,relBizInfoList,attachmentList,dictsList,updateFlag);
      //}
   // });
  };
  export const getFileContent = async(check,dispatch)=>{
    let newCheck=[];
    await check&&JSON.parse(check).map(async(item)=>{
      //获取内容
      if(item.ruleJsFullUrl){
        await dispatch({
          type:"formShow/getRuleSetData",
          payload:{
            fileStorageId:item.ruleJsFullUrl
          },
          callback:(newData)=>{
            item.ruleJsonContent = newData;
          }
        })
      }
      newCheck.push(item);
    })
    console.log('newCheck====',newCheck);
    return newCheck;
  }
//获取自定义业务检验的内容
export const getCustomFile = async (custom) => {
  let pattern = /_onFormLoad/;
  let customs = (custom && JSON.parse(custom)) || [];
  let newCustoms = [];
  for (let i = 0; i < customs.length; i++) {
    let info = customs[i];
    await fetch(info.ruleJsFullUrl)
      .then((res) => res.text())
      .then((text) => {
        info.ruleJsonContent = text;
        newCustoms.push(info);
        if (text && pattern.test(text)) {
          //表单加载时调用
          try {
            eval(text + '_onFormLoad()');
          } catch (e) {
            console.log('e===', e);
          }
        }
      });
  }
  return newCustoms;
};

