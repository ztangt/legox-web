import {Modal,Select,Input,Popover,DatePicker,Button} from 'antd';
import {useEffect, useState,useRef,useCallback} from 'react';
import {connect} from 'dva';
import styles from './ruleConfig.less';
import moment from 'moment';
import SparkMD5 from 'spark-md5';
import { v4 as uuidv4 } from 'uuid';
import { parser } from 'xijs';
import {dataFormat} from '../../../util/util';
import ScriptEditor from '../../../componments/public/scriptEditor'
import beautify from "js-beautify";
import IfElseConfig from './ifElseConfig';
function RuleSetModal({query,dispatch,handelCancle,data,ruleName,textContent,
  ruleProperty,propertyValue,setData,setRuleName,setRuleProperty,setTextContent,
  setPropertyValue,oldData,parentState,setParentState,setFunData,funData,treeData,
  oldTreeData,setTreeData,maxId,oldMaxId,setMaxId
}){
  const bizSolId = query.bizSolId;
  const editorRef = useRef();
  const [type,setType]=useState("config");
  const [isChangeConfig,setIsChangeConfig] = useState(false);
  const [forceUpdate,setfForceUpdate] = useState(true)
  const {procDefId,selectActId,ruleIndex,currentRule,bizFromInfo,allCol,colMainTabel} = parentState;
  const deployFormId= bizFromInfo.formDeployId;
  const [height, setHeight] = useState(
    document.getElementById(`code_modal_${bizSolId}`)?document.getElementById(`code_modal_${bizSolId}`).offsetHeight-62-87:0
  )
  const onResize = useCallback(() => {
    setHeight(
      Number(
        document.getElementById(`code_modal_${bizSolId}`).offsetHeight-62-87
      )
    )
  }, [])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])
  const saveRuleConfig=()=>{
    if(type=='text'){
      textContent = editorRef?.current?.getValue();
      const res=parser.stringify({
        title:ruleName,
        ruleProperty,
        propertyValue,
        config:data,
        text:textContent,
        funData:funData,
        maxId,
        treeData
      })
      const blob = new Blob([res], { type: 'text/javascript' });
      const file = new File([blob], uuidv4(), {
        type: 'text/javascript',
      });
      console.log(file,'file');
      const fileMD5 = SparkMD5.hashBinary(res);
      console.log(fileMD5,'fileMD5');
       dispatch({
        type: 'applyModelConfig/updateStatesGlobal',
        payload: {
          fileChunkedList: [file],
          md5: fileMD5,
          fileName: `${file.name}.js`,
          fileSize: file.size,
        },
      });
      dispatch({
        type:'applyModelConfig/getScriptFileToMinio',
        callback:(filePath,fileFullPath)=>{
                console.log(filePath,'filePath');
                console.log(fileFullPath,'fileFullPath');
                console.log(currentRule,'currentRule---');
                    currentRule.check[ruleIndex].ruleJsUrl=filePath;
                    currentRule.check[ruleIndex].ruleJsFullUrl=fileFullPath;
                    setParentState({
                      currentRule
                    })
                    handelCancle(false,0,'','')
        }
      })
    }else{
      if(isChangeConfig){//可视化配置改变才改变脚本
        conStatementFn().then((conData)=>{
          textContent = conData;
          const res=parser.stringify({
            title:ruleName,
            ruleProperty,
            propertyValue,
            config:data,
            text:textContent,
            funData:funData,
            maxId,
            treeData
          })
          const blob = new Blob([res], { type: 'text/javascript' });
          const file = new File([blob], uuidv4(), {
            type: 'text/javascript',
          });
          console.log(file,'file');
          const fileMD5 = SparkMD5.hashBinary(res);
          console.log(fileMD5,'fileMD5');
           dispatch({
            type: 'applyModelConfig/updateStatesGlobal',
            payload: {
              fileChunkedList: [file],
              md5: fileMD5,
              fileName: `${file.name}.js`,
              fileSize: file.size,
            },
          });
          dispatch({
            type:'applyModelConfig/getScriptFileToMinio',
            callback:(filePath,fileFullPath)=>{
                currentRule.check[ruleIndex].ruleJsUrl=filePath;
                currentRule.check[ruleIndex].ruleJsFullUrl=fileFullPath;
                setParentState({
                  currentRule
                })
                handelCancle(false,0,'','')
            }
          })
        })
      }
    }
  }
  

  
  const updateData = (index,ifData)=>{
    console.log('ifData=',ifData);
    console.log('data=',data);
    console.log('index=',index);
    data[index].ifCondition = ifData;
    console.log('data[index]=',data);
    setData(data);
  }

  const loopCondition=async(ifCondition,info,tmpIfElseCons,parentNum,parentCondition)=>{
    // let tmpTabelCode=tabelCode;
    let tableCode = '';
    let oneCondition = '';
    let errorStatement = '';
    let childrens = [];
    let childrenLevels = [];
    if(ifCondition.children&&ifCondition.children.length){
      for(let i=0;i<ifCondition.children.length;i++){
        let c = ifCondition.children[i];
        let tmpTabelCode='';
        if(typeof c.condition=='undefined'){
          let condition = '';
          let startCode = '';
          let endCode = '';
          let tmpErrorStatement = '';
          if(c.startCode.split('__').length>1){//为子表的时候
            startCode = c.startCode.split('__')[1];
            tmpTabelCode = c.startCode.split('__')[0];
          }else{
            startCode = c.startCode;
          }
          if(c.endCode.split('__').length>1){//为子表的时候
            endCode = c.endCode.split('__')[1];
            tmpTabelCode = c.endCode.split('__')[0];
          }else{
            endCode = c.endCode;
          }
          if(c.endCode=='inputNumber'){
            c.value = c.value?c.value:"";//这样写是为了显示 ""的显示问题
            if(c.operator=='includes'){
              let str = "'"+c.value.replaceAll(",","','")+"'";
              if(c.startCode.includes('__')){
                tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],function(item){return !(getResult(item["${startCode}"],[${str}]))}):0;
                if(errorIndex>=0){
                  errorsInfo.push({
                    'tableCode':'${tmpTabelCode}',
                    'index':errorIndex,
                    'key': '${startCode}'
                  });
                }`;
                // tmpErrorStatement = `if(!(getResult(item["${startCode}"],[${str}]))){
                //   errorsInfo.push({
                //     'tableCode':'${tabelCode||tmpTabelCode}',
                //     'index':index,
                //     'key': '${startCode}'
                //   });
                // }`;
                condition = `getResult(item["${startCode}"],[${str}])`
              }else{
                tmpErrorStatement = `if(!(getResult(values["${startCode}"],[${str}]))){
                  errorsInfo.push({
                    'tableCode':'',
                    'index':0,
                    'key': '${startCode}'
                  });
                }`;
                condition = `getResult(values["${startCode}"],[${str}])`
              }
              //condition=`[${str}].includes(values["${c.startCode}"])`;
            }else if(c.operator=='noIncludes'){
              let str = "'"+c.value.replaceAll(",","','")+"'";
              if(c.startCode.includes('__')){
                tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],function(item){return !(getNoResult(item["${startCode}"],[${str}]))}):0;
                if(errorIndex>=0){
                  errorsInfo.push({
                    'tableCode':'${tmpTabelCode}',
                    'index':errorIndex,
                    'key': '${startCode}'
                  });
                }`;
                // tmpErrorStatement = `if(!(getNoResult(item["${startCode}"],[${str}]))){
                //   errorsInfo.push({
                //     'tableCode':'${tabelCode||tmpTabelCode}',
                //     'index':index,
                //     'key': '${startCode}'
                //   });
                // }`;
                condition= `getNoResult(item["${startCode}"],[${str}])`;
              }else{
                tmpErrorStatement = `if(!(getNoResult(values["${startCode}"],[${str}]))){
                  errorsInfo.push({
                    'tableCode':'',
                    'index':0,
                    'key': '${startCode}'
                  });
                }`;
                condition= `getNoResult(values["${startCode}"],[${str}])`;
              }
            }else if(c.operator=='>'||c.operator=='>='||c.operator=='<'||c.operator=='<='){
              if(c.startCode.includes('__')){
                tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                function(item){return !(Number(transformValue(item["${startCode}"]))`+c.operator+`"${c.value}")}):0;
                if(errorIndex>=0){
                  errorsInfo.push({
                    'tableCode':'${tmpTabelCode}',
                    'index':errorIndex,
                    'key': '${startCode}'
                  });
                }`;
                // tmpErrorStatement = `if(!(Number(transformValue(item["${startCode}"]))`+c.operator+`"${c.value}")){
                //   errorsInfo.push({
                //     'tableCode':'${tabelCode||tmpTabelCode}',
                //     'index':index,
                //     'key': '${startCode}'
                //   });
                // }`;
                condition = `Number(transformValue(item["${startCode}"]))`+c.operator+`"${c.value}"`;
              }else{
                tmpErrorStatement = `if(!(Number(transformValue(values["${startCode}"]))`+c.operator+`"${c.value}")){
                  errorsInfo.push({
                    'tableCode':'',
                    'index':0,
                    'key': '${startCode}'
                  });
                }`;
                condition = `Number(transformValue(values["${startCode}"]))`+c.operator+`"${c.value}"`;
              }
            }else if(c.operator=='contain'){
              if(c.startCode.includes('__')){
                tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                function(item){return !(transformValue(item["${startCode}"]).includes("${c.value}"))}):0;
                if(errorIndex>=0){
                  errorsInfo.push({
                    'tableCode':'${tmpTabelCode}',
                    'index':errorIndex,
                    'key': '${startCode}'
                  });
                }`;
                // tmpErrorStatement = `if(!(transformValue(item["${startCode}"]).includes("${c.value}"))){
                //   errorsInfo.push({
                //     'tableCode':'${tabelCode||tmpTabelCode}',
                //     'index':index,
                //     'key': '${startCode}'
                //   });
                // }`;
                condition = `transformValue(item["${startCode}"]).includes("${c.value}")`;
              }else{
                tmpErrorStatement = `if(!(transformValue(values["${startCode}"]).includes("${c.value}"))){
                  errorsInfo.push({
                    'tableCode':'',
                    'index':0,
                    'key': '${startCode}'
                  });
                }`;
                condition = `transformValue(values["${startCode}"]).includes("${c.value}")`;
              }
            }else if(c.operator=='noContain'){
              if(c.startCode.includes('__')){
                tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                function(item){return transformValue(item["${startCode}"]).includes("${c.value}")}):0;
                if(errorIndex>=0){
                  errorsInfo.push({
                    'tableCode':'${tmpTabelCode}',
                    'index':errorIndex,
                    'key': '${startCode}'
                  });
                }`;
                // tmpErrorStatement = `if((transformValue(item["${startCode}"]).includes("${c.value}"))){
                //   errorsInfo.push({
                //     'tableCode':'${tabelCode||tmpTabelCode}',
                //     'index':index,
                //     'key': '${startCode}'
                //   });
                // }`;
                condition = `!(transformValue(item["${startCode}"]).includes("${c.value}"))`;
              }else{
                tmpErrorStatement = `if((transformValue(values["${startCode}"]).includes("${c.value}"))){
                  errorsInfo.push({
                    'tableCode':'',
                    'index':0,
                    'key': '${startCode}'
                  });
                }`;
                condition = `!(transformValue(values["${startCode}"]).includes("${c.value}"))`;
              }
            }else{
              if(c.startCode.includes('__')){
                tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                function(item){return !(transformValue(item["${startCode}"])`+c.operator+`"${c.value}")}):0;
                if(errorIndex>=0){
                  errorsInfo.push({
                    'tableCode':'${tmpTabelCode}',
                    'index':errorIndex,
                    'key': '${startCode}'
                  });
                }`;
                // tmpErrorStatement = `if(!(transformValue(item["${startCode}"])`+c.operator+`"${c.value}")){
                //   errorsInfo.push({
                //     'tableCode':'${tabelCode||tmpTabelCode}',
                //     'index':index,
                //     'key': '${startCode}'
                //   });
                // }`;
                condition = `transformValue(item["${startCode}"])`+c.operator+`"${c.value}"`;
              }else{
                tmpErrorStatement = `if(!(transformValue(values["${startCode}"])`+c.operator+`"${c.value}")){
                  errorsInfo.push({
                    'tableCode':'',
                    'index':0,
                    'key': '${startCode}'
                  });
                }`;
                condition = `transformValue(values["${startCode}"])`+c.operator+`"${c.value}"`;
              }
            }
          }else{
            if(c.operator=='empty'){
              if(c.startCode.includes('__')){
                tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                function(item){return !(transformValue(item["${startCode}"])=="")}):0;
                if(errorIndex>=0){
                  errorsInfo.push({
                    'tableCode':'${tabelCode||tmpTabelCode}',
                    'index':errorIndex,
                    'key': '${startCode}'
                  });
                }`;
                // tmpErrorStatement = `if(!(transformValue(item["${startCode}"])=="")){
                //   errorsInfo.push({
                //     'tableCode':'${tmpTabelCode}',
                //     'index':index,
                //     'key': '${startCode}'
                //   });
                // }`;
                condition = `transformValue(item["${startCode}"])==""`;
              }else{
                tmpErrorStatement = `if(!(transformValue(values["${startCode}"])=="")){
                  errorsInfo.push({
                    'tableCode':'',
                    'index':0,
                    'key': '${startCode}'
                  });
                }`;
                condition = `transformValue(values["${startCode}"])==""`;
              }
  
            }else if(c.operator=='noEmpty'){
              if(c.startCode.includes('__')){
                tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                function(item){return !(transformValue(item["${startCode}"])!="")}):0;
                if(errorIndex>=0){
                  errorsInfo.push({
                    'tableCode':'${tmpTabelCode}',
                    'index':errorIndex,
                    'key': '${startCode}'
                  });
                }`;
                // tmpErrorStatement = `if(!(transformValue(item["${startCode}"])!="")){
                //   errorsInfo.push({
                //     'tableCode':'${tmpTabelCode}',
                //     'index':index,
                //     'key': '${startCode}'
                //   });
                // }`;
                condition = `transformValue(item["${startCode}"])!=""`;
              }else{
                tmpErrorStatement = `if(!(transformValue(values["${startCode}"])!="")){
                  errorsInfo.push({
                    'tableCode':'',
                    'index':0,
                    'key': '${startCode}'
                  });
                }`;
                condition = `transformValue(values["${startCode}"])!=""`;
              }
            }else if(c.operator=='includes'){
              if(c.startCode.includes('__')){
                if(c.endCode.includes('__')){
                  tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                  function(item){return !(getResult(item["${startCode}"],[item["${endCode}"]]||''))}):0;
                  if(errorIndex>=0){
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${startCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${endCode}'
                    });
                  }`;
                  // tmpErrorStatement = `if(!(getResult(item["${startCode}"],[item["${endCode}"]]||''))){
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${startCode}'
                  //   });
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${endCode}'
                  //   });
                  // }`;
                  condition= `getResult(item["${startCode}"],[item["${endCode}"]]||'')`;
                }else{
                  tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                  function(item){return !(getResult(item["${startCode}"],[values["${endCode}"]]||''))}):0;
                  if(errorIndex>=0){
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${startCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${endCode}'
                    });
                  }`;
                  // tmpErrorStatement = `if(!(getResult(item["${startCode}"],[values["${endCode}"]]||''))){
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${startCode}'
                  //   });
                  //   errorsInfo.push({
                  //     'tableCode':'',
                  //     'index':0,
                  //     'key': '${endCode}'
                  //   });
                  // }`;
                  condition= `getResult(item["${startCode}"],[values["${endCode}"]]||'')`;
                }
              }else{
                if(c.endCode.includes('__')){
                  tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                  function(item){return !(getResult(values["${startCode}"],[item["${endCode}"]]||''))}):0;
                  if(errorIndex>=0){
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${endCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${startCode}'
                    });
                  }`;
                  // tmpErrorStatement = `if(!(getResult(values["${startCode}"],[item["${endCode}"]]||''))){
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${endCode}'
                  //   });
                  //   errorsInfo.push({
                  //     'tableCode':'',
                  //     'index':0,
                  //     'key': '${startCode}'
                  //   });
                  // }`;
                  condition= `getResult(values["${startCode}"],[item["${endCode}"]]||'')`;
                }else{
                  tmpErrorStatement = `if(!(getResult(values["${startCode}"],[values["${endCode}"]]||''))){
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${endCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${startCode}'
                    });
                  }`;
                  condition= `getResult(values["${startCode}"],[values["${endCode}"]]||'')`;
                }
              }
              //condition=`values["${c.startCode}"].includes('values["${c.endCode}"]')`;
            }else if(c.operator=='noIncludes'){
              if(c.startCode.includes('__')){
                if(c.endCode.includes('__')){
                  tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                  function(item){return !(getNoResult(item["${startCode}"],[item["${endCode}"]||'']))}):0;
                  if(errorIndex>=0){
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${startCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${endCode}'
                    });
                  }`;
                  // tmpErrorStatement = `if(!(getNoResult(item["${startCode}"],[item["${endCode}"]||'']))){
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${startCode}'
                  //   });
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${endCode}'
                  //   });
                  // }`;
                  condition= `getNoResult(item["${startCode}"],[item["${endCode}"]||''])`;
                }else{
                  condition= `getNoResult(item["${startCode}"],[values["${endCode}"]||''])`;
                }
              }else{
                if(c.endCode.includes('__')){
                  tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                  function(item){return !(getNoResult(values["${startCode}"],[item["${endCode}"]||'']))}):0;
                  if(errorIndex>=0){
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${startCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${endCode}'
                    });
                  }`;
                  // tmpErrorStatement = `if(!(getNoResult(values["${startCode}"],[item["${endCode}"]||'']))){
                  //   errorsInfo.push({
                  //     'tableCode':'',
                  //     'index':0,
                  //     'key': '${startCode}'
                  //   });
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${endCode}'
                  //   });
                  // }`;
                  condition= `getNoResult(values["${startCode}"],[item["${endCode}"]||''])`;
                }else{
                  tmpErrorStatement = `if(!(getNoResult(values["${startCode}"],[values["${endCode}"]||'']))){
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${startCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${endCode}'
                    });
                  }`;
                  condition= `getNoResult(values["${startCode}"],[values["${endCode}"]||''])`;
                }
              }
              //condition=`!(values["${c.startCode}"].includes('values["${c.endCode}"]'))`;
            }else if(c.operator=='>'||c.operator=='>='||c.operator=='<'||c.operator=='<='){
              if(c.startCode.includes('__')){
                if(c.endCode.includes('__')){
                  tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                  function(item){return !(Number(transformValue(item["${startCode}"]))`+c.operator+`Number(transformValue(item["${endCode}"])))}):0;
                  if(errorIndex>=0){
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${startCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${endCode}'
                    });
                  }`;
                  // tmpErrorStatement = `if(!(Number(transformValue(item["${startCode}"]))`+c.operator+`Number(transformValue(item["${endCode}"])))){
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${startCode}'
                  //   });
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${endCode}'
                  //   });
                  // }`;
                  condition = `Number(transformValue(item["${startCode}"]))`+c.operator+`Number(transformValue(item["${endCode}"]))`;
                }else{
                  tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                  function(item){return !(Number(transformValue(item["${startCode}"]))`+c.operator+`Number(transformValue(values["${endCode}"])))}):0;
                  if(errorIndex>=0){
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${startCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${endCode}'
                    });
                  }`;
                  // tmpErrorStatement = `if(!(Number(transformValue(item["${startCode}"]))`+c.operator+`Number(transformValue(values["${endCode}"])))){
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${startCode}'
                  //   });
                  //   errorsInfo.push({
                  //     'tableCode':'',
                  //     'index':0,
                  //     'key': '${endCode}'
                  //   });
                  // }`;
                  condition = `Number(transformValue(item["${startCode}"]))`+c.operator+`Number(transformValue(values["${endCode}"]))`;
                }
              }else{
                if(c.endCode.includes('__')){
                  tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                  function(item){return !(Number(transformValue(values["${startCode}"]))`+c.operator+`Number(transformValue(item["${endCode}"])))}):0;
                  if(errorIndex>=0){
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${endCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${startCode}'
                    });
                  }`;
                  // tmpErrorStatement = `if(!(Number(transformValue(values["${startCode}"]))`+c.operator+`Number(transformValue(item["${endCode}"])))){
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${endCode}'
                  //   });
                  //   errorsInfo.push({
                  //     'tableCode':'',
                  //     'index':0,
                  //     'key': '${startCode}'
                  //   });
                  // }`;
                  condition = `Number(transformValue(values["${startCode}"]))`+c.operator+`Number(transformValue(item["${endCode}"]))`;
                }else{
                  tmpErrorStatement = `if(!(Number(transformValue(values["${startCode}"]))`+c.operator+`Number(transformValue(values["${endCode}"])))){
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${endCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${startCode}'
                    });
                  }`;
                  condition = `Number(transformValue(values["${startCode}"]))`+c.operator+`Number(transformValue(values["${endCode}"]))`;
                }
              }
            }else if(c.operator=='contain'){
              if(c.startCode.includes('__')){
                if(c.endCode.includes('__')){
                  tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                  function(item){return !(transformValue(item["${startCode}"]).includes(transformValue(item["${endCode}"])))}):0;
                  if(errorIndex>=0){
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${endCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${startCode}'
                    });
                  }`;
                  // tmpErrorStatement = `if(!(transformValue(item["${startCode}"]).includes(transformValue(item["${endCode}"])))){
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${endCode}'
                  //   });
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${startCode}'
                  //   });
                  // }`;
                  condition = `transformValue(item["${startCode}"]).includes(transformValue(item["${endCode}"]))`;
                }else{
                  tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                  function(item){return !(transformValue(item["${startCode}"]).includes(transformValue(values["${endCode}"])))}):0;
                  if(errorIndex>=0){
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${endCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${startCode}'
                    });
                  }`;
                  // tmpErrorStatement = `if(!(transformValue(item["${startCode}"]).includes(transformValue(values["${endCode}"])))){
                  //   errorsInfo.push({
                  //     'tableCode':'',
                  //     'index':0,
                  //     'key': '${endCode}'
                  //   });
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${startCode}'
                  //   });
                  // }`;
                  condition = `transformValue(item["${startCode}"]).includes(transformValue(values["${endCode}"]))`;
                }
              }else{
                if(c.endCode.includes('__')){
                  tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                  function(item){return !(transformValue(values["${startCode}"]).includes(transformValue(item["${endCode}"])))}):0;
                  if(errorIndex>=0){
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${startCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${endCode}'
                    });
                  }`;
                  // tmpErrorStatement = `if(!(transformValue(values["${startCode}"]).includes(transformValue(item["${endCode}"])))){
                  //   errorsInfo.push({
                  //     'tableCode':'',
                  //     'index':0,
                  //     'key': '${startCode}'
                  //   });
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${endCode}'
                  //   });
                  // }`;
                  condition = `transformValue(values["${startCode}"]).includes(transformValue(item["${endCode}"]))`;
                }else{
                  tmpErrorStatement = `if(!(transformValue(values["${startCode}"]).includes(transformValue(values["${endCode}"])))){
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${startCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${endCode}'
                    });
                  }`;
                  condition = `transformValue(values["${startCode}"]).includes(transformValue(values["${endCode}"]))`;
                }
              }
            }else if(c.operator=='noContain'){
              if(c.startCode.includes('__')){
                if(c.endCode.includes('__')){
                  tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                  function(item){return (transformValue(item["${startCode}"]).includes(transformValue(item["${endCode}"])))}):0;
                  if(errorIndex>=0){
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${startCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${endCode}'
                    });
                  }`;
                  // tmpErrorStatement = `if((transformValue(item["${startCode}"]).includes(transformValue(item["${endCode}"])))){
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${endCode}'
                  //   });
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${startCode}'
                  //   });
                  // }`;
                  condition = `!(transformValue(item["${startCode}"]).includes(transformValue(item["${endCode}"])))`;
                }else{
                  tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                  function(item){return (transformValue(item["${startCode}"]).includes(transformValue(values["${endCode}"])))}):0;
                  if(errorIndex>=0){
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${startCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${endCode}'
                    });
                  }`;
                  // tmpErrorStatement = `if((transformValue(item["${startCode}"]).includes(transformValue(values["${endCode}"])))){
                  //   errorsInfo.push({
                  //     'tableCode':'',
                  //     'index':0,
                  //     'key': '${endCode}'
                  //   });
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${startCode}'
                  //   });
                  // }`;
                  condition = `!(transformValue(item["${startCode}"]).includes(transformValue(values["${endCode}"])))`;
                }
              }else{
                if(c.endCode.includes('__')){
                  tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                  function(item){return (transformValue(values["${startCode}"]).includes(transformValue(item["${endCode}"])))}):0;
                  if(errorIndex>=0){
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${startCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${endCode}'
                    });
                  }`;
                  // tmpErrorStatement = `if((transformValue(values["${startCode}"]).includes(transformValue(item["${endCode}"])))){
                  //   errorsInfo.push({
                  //     'tableCode':'',
                  //     'index':0,
                  //     'key': '${startCode}'
                  //   });
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${endCode}'
                  //   });
                  // }`;
                  condition = `!(transformValue(values["${startCode}"]).includes(transformValue(item["${endCode}"])))`;
                }else{
                  tmpErrorStatement = `if((transformValue(values["${startCode}"]).includes(transformValue(values["${endCode}"])))){
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${startCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${endCode}'
                    });
                  }`;
                  condition = `!(transformValue(values["${startCode}"]).includes(transformValue(values["${endCode}"])))`;
                }
              }
            }else{
              if(c.startCode.includes('__')){
                if(c.endCode.includes('__')){
                  tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                  function(item){return !(transformValue(item["${startCode}"])`+c.operator+`transformValue(item["${endCode}"]))}):0;
                  if(errorIndex>=0){
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${startCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${endCode}'
                    });
                  }`;
                  // tmpErrorStatement = `if(!(transformValue(item["${startCode}"])`+c.operator+`transformValue(item["${endCode}"]))){
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${endCode}'
                  //   });
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${startCode}'
                  //   });
                  // }`;
                  condition = `transformValue(item["${startCode}"])`+c.operator+`transformValue(item["${endCode}"])`;
                }else{
                  tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                  function(item){return !(transformValue(item["${startCode}"])`+c.operator+`transformValue(values["${endCode}"]))}):0;
                  if(errorIndex>=0){
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${startCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${endCode}'
                    });
                  }`;
                  // tmpErrorStatement = `if(!(transformValue(item["${startCode}"])`+c.operator+`transformValue(values["${endCode}"]))){
                  //   errorsInfo.push({
                  //     'tableCode':'',
                  //     'index':0,
                  //     'key': '${endCode}'
                  //   });
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${startCode}'
                  //   });
                  // }`;
                  condition = `transformValue(item["${startCode}"])`+c.operator+`transformValue(values["${endCode}"])`;
                }
              }else{
                if(c.endCode.includes('__')){
                  tmpErrorStatement = `errorIndex = values["${tmpTabelCode}"].length?_.findIndex(values["${tmpTabelCode}"],
                  function(item){return !(transformValue(values["${startCode}"])`+c.operator+`transformValue(item["${endCode}"]))}):0;
                  if(errorIndex>=0){
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${startCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'${tmpTabelCode}',
                      'index':errorIndex,
                      'key': '${endCode}'
                    });
                  }`;
                  // tmpErrorStatement = `if(!(transformValue(values["${startCode}"])`+c.operator+`transformValue(item["${endCode}"]))){
                  //   errorsInfo.push({
                  //     'tableCode':'',
                  //     'index':0,
                  //     'key': '${startCode}'
                  //   });
                  //   errorsInfo.push({
                  //     'tableCode':'${tmpTabelCode}',
                  //     'index':index,
                  //     'key': '${endCode}'
                  //   });
                  // }`;
                  condition = `transformValue(values["${startCode}"])`+c.operator+`transformValue(item["${endCode}"])`;
                }else{
                  tmpErrorStatement = `if(!(transformValue(values["${startCode}"])`+c.operator+`transformValue(values["${endCode}"]))){
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${startCode}'
                    });
                    errorsInfo.push({
                      'tableCode':'',
                      'index':0,
                      'key': '${endCode}'
                    });
                  }`;
                  condition = `transformValue(values["${startCode}"])`+c.operator+`transformValue(values["${endCode}"])`;
                }
              }
            }
          }
          if(oneCondition){
            oneCondition = `${oneCondition} ${ifCondition.condition} ${condition}`;
          }else{
            if(tmpIfElseCons.length){
              oneCondition = `${condition}`;
            }else{//只有初始的条件加if
              oneCondition = `if(${condition}`;
            }
          }
          errorStatement = errorStatement+tmpErrorStatement;
          console.log('tmpErrorStatement==',tmpErrorStatement,condition)

          // //为了折行才这么写
          // conStatement = `${conStatement}
          // ${condition}`;
          // errorStatement = `${errorStatement}
          // ${tmpErrorStatement}`;
        }else{
          if(c.children&&c.children.length){
            if(tmpIfElseCons.length){
              if(oneCondition){
                oneCondition = `${oneCondition} ${c.condition} (childrenCon${c.level})`;
              }else{
                oneCondition = `(childrenCon${c.level})`;
              }
            }else{//只有初始的条件加if
              if(oneCondition){
                oneCondition = `${oneCondition} ${ifCondition.condition} (childrenCon${c.level})`;
              }else{
                oneCondition = `if((childrenCon${c.level})`;
              }
            }

            // errorStatement = errorStatement+tmpErrorStatement;
            childrens.push(c);
            childrenLevels.push(c.level)
          }
          //tmpIfElseCons = loopCondition(c,info,tmpIfElseCons,c.level,c.condition);
        }
        tableCode = tmpTabelCode||tableCode;
      }
      tmpIfElseCons.push({
        tableCode,
        errorStatement,
        oneElseCon:oneCondition,
        infoId:info.id,
        childrenLevels,
        parentNum
      })
      for(let i=0;i<childrens.length;i++){
        let c = childrens[i];
        tmpIfElseCons = await loopCondition(c,info,tmpIfElseCons,c.level,c.condition);
      }
    }
    return tmpIfElseCons;
  }
  //组合成ifelse语句里面的内容
  const getIfElseContent=(item,info,errorStatement)=>{
    let tmpContent = '';
    let ifId='';
    let elseId = '';
    item.children.map((childrenItem)=>{
      if(childrenItem.type=='else'){
        elseId = childrenItem.id;
      }else{
        ifId = childrenItem.id;
      }
    })
    if(ifId&&elseId){
      tmpContent = `condition${ifId}}else{isError=true;let errorIndex = 0;condition${elseId}}`;
    }else if(ifId){
      let elseCon = '';
      if(info.else.type=='text'){
        elseCon=info.else.value?`messageFn("${info.else.value}")`:'';
      }else if(info.else.type=='execute_function'){
        elseCon=`let funData = await evalFun_${info.id}_else(errorsInfo,isError);
         errorsInfo = funData.errorsInfo;
         isError = funData.isError;
        `;
      }
      tmpContent = `condition${ifId}}else{isError=true;${errorStatement};${elseCon}}`;
    }else if(elseId){
      let ifCon = '';
      if(info.ifMsg.type=='text'){
        ifCon=info.ifMsg.value?`messageFn("${info.ifMsg.value}")`:"";
      }else if(info.ifMsg.type=='execute_function'){
        ifCon=`let funData = await evalFun_${info.id}_if(errorsInfo,isError);
        errorsInfo = funData.errorsInfo;
        isError = funData.isError;
       `;
      }
      tmpContent = `${ifCon}}else{isError=true;condition${elseId}}`;
    }else{
      let elseCon = '';
      if(info.else.type=='text'){
        elseCon=info.else.value?`messageFn("${info.else.value}")`:'';
      }else if(info.else.type=='execute_function'){
        elseCon=`let funData = await evalFun_${info.id}_else(errorsInfo,isError);
        errorsInfo = funData.errorsInfo;
        isError = funData.isError;
       `;
      }
      let ifCon = '';
      if(info.ifMsg.type=='text'){
        ifCon=info.ifMsg.value?`messageFn("${info.ifMsg.value}")`:'';
      }else if(info.ifMsg.type=='execute_function'){
        ifCon=`let funData = await evalFun_${info.id}_if(errorsInfo,isError);
        errorsInfo = funData.errorsInfo;
        isError = funData.isError;
       `;
      }
      tmpContent = `${ifCon}}else{isError=true;let errorIndex = 0;${errorStatement};${elseCon}}`;
    }
    return tmpContent;
  }
  const loopConStatementFn = async(children,conditions)=>{
    let tmpData = children.map(async(item)=>{
      //从data中找到当前条件信息
      let info = _.find(data,{id:item.id});
      let ifCondition=info.ifCondition;
      console.log('ifCondition==',ifCondition);
      //存储子的条件（用于整合成一条完整的语句）(同级别的条件为一条数据)
      let tmpIfElseCons = await loopCondition(ifCondition,info,[],'','');
      console.log('data==111',tmpIfElseCons);
      debugger;
      //循环组合语句
      let tabelCode = '';
      let errorStatement = '';
      let tmpConStatement = '';
      for(let i=0;i<tmpIfElseCons.length;i++){
        let ifItem  = tmpIfElseCons[i];
        tabelCode = tabelCode||ifItem.tableCode;
        if(!tmpConStatement){
          tmpConStatement = ifItem.oneElseCon;
        }
        errorStatement = errorStatement+ifItem.errorStatement;
        ifItem.childrenLevels.map((level=>{
          let tmpConName = `childrenCon${level}`;
          //查找parentNum等于level然后替换
          let ifInfo = _.find(tmpIfElseCons,{parentNum:level});
          if(ifInfo){
            tmpConStatement = tmpConStatement.replace(tmpConName,ifInfo.oneElseCon);
          }
        }))
      }
      if(tabelCode){
        //应为子表没有数据的时候不会走map这个时候就没办法校验了，
        //这个时候子表的数据都是空，则把语句判断的transformValue(**)至为空作判断
        let emptyStatement = tmpConStatement.replace(/transformValue\(item(.+?)(?=\))\)/g,'""');
        emptyStatement = `let emptyError = false; 
        if(!values['${tabelCode}']||!values['${tabelCode}'].length){
          ${emptyStatement}){
            emptyError = false;
          }else{
            emptyError = true;
          }
        }`
        tmpConStatement = `${emptyStatement}
        let infos${item.id} = [];
        values['${tabelCode}']&&values['${tabelCode}'].map((item,index)=>{
          ${tmpConStatement}){
            infos${item.id}.push(item);
          }
        })
        if(!emptyError&&infos${item.id}.length==values['${tabelCode}'].length){
          isError=false;
        `;
        //根据不同的情况组合成不同的ifesle语句
        let elseContent = getIfElseContent(item,info,errorStatement);
        tmpConStatement = tmpConStatement+'   '+elseContent;
        conditions.push({
          key:info.id,
          type:item.type,
          conStatement:tmpConStatement
        });
      }else{
        let elseContent = getIfElseContent(item,info,errorStatement);
        tmpConStatement = tmpConStatement+'){isError=false;'+elseContent;
        conditions.push({
          key:info.id,
          type:item.type,
          conStatement:tmpConStatement
        });
      }
      if(item.children.length){
        return loopConStatementFn(item.children,conditions).then((data)=>{
          return new Promise((resolve)=>{
            resolve(1);
          })
        })
      }else{
        return new Promise((resolve)=>{
          resolve(1);
        })
      }
    })
    return Promise.all(tmpData).then((data)=>{
      return conditions
    })
  }
  const conStatementFn=async()=>{
    //组合成ifelse语句
    return new Promise((resolve)=>{
      //这个loopConStatementFn这个返回的结果中包含子的变量需要替换
      loopConStatementFn(treeData,[]).then((data)=>{
        debugger;
        let conStatement = '';
        data.map((item,index)=>{
          if(index!=0){
            conStatement = conStatement.replace(`condition${item.key}`,item.conStatement);
          }else{
            conStatement = item.conStatement;
          }
        })
        resolve(conStatement);
      })
    })
  }
  console.log('TextContent====',textContent);
  //改变配置
  const changeType=(value)=>{
    if(isChangeConfig){//可视化配置改变才改变脚本
      conStatementFn().then((data)=>{

        debugger;
        setTextContent(data);
        setIsChangeConfig(false);
        setType(value);
      })
    }else{
      if(value!='text'){
        setTextContent(editorRef?.current?.getValue());
      }
      setType(value);
    }
  }
  //重置
  const resetData=()=>{//TODO
    setfForceUpdate(false);
    setData(JSON.parse(JSON.stringify(oldData)));
    setTreeData(JSON.parse(JSON.stringify(oldTreeData)));
    setMaxId(oldMaxId);
    setTimeout(() => {
      setfForceUpdate(true);
    }, 0);
  }
  return (
    <Modal
      visible={true}
      onCancel={()=>{handelCancle(false,0,'','')}}
      width={'95%'}
      bodyStyle={{height:height}}
      onOk={saveRuleConfig}
      className={styles.rule_modal_warp}
      centered
      title={'规则设置'}
      maskClosable={false}
      mask={false}
      getContainer={() =>{
        return document.getElementById(`code_modal_${bizSolId}`)||false
      }}
    >
      <div className={styles.r_m_hearder}>
        <Select style={{width:'100px'}} onChange={(value)=>{changeType(value)}} value={type}>
          <Select.Option value={"config"}>配置</Select.Option>
          <Select.Option value={"text"}>脚本</Select.Option>
        </Select>
        <span>规则：</span>
        <Input onChange={(e)=>{setRuleName(e.target.value)}} value={ruleName} style={{width:"200px"}} maxLength={50}/>
        <span style={{marginLeft:"10px"}}>添加属性：</span>
        <Select style={{width:'100px'}} value={ruleProperty} onChange={(value)=>{setPropertyValue('');setRuleProperty(value)}}>
          <Select.Option value={"empty"}>无</Select.Option>
          <Select.Option value={"activeDate"}>生效日期</Select.Option>
          <Select.Option value={"loseDate"}>失效日期</Select.Option>
        </Select>
        {ruleProperty=='level'?
          <Input onChange={(e)=>{setPropertyValue(e.target.value)}} value={propertyValue} style={{width:'100px'}}/>:
          (ruleProperty=='activeDate'||ruleProperty=='loseDate'?
          <DatePicker
            onChange={(date, dateString)=>{setPropertyValue(ruleProperty=='loseDate'?moment(dateString).unix()+86400-1:moment(dateString).unix())}}
            value={propertyValue?moment(dataFormat(propertyValue,'YYYY-MM-DD'),'YYYY-MM-DD'):""}
            format="YYYY-MM-DD"
          />:
          null)
        }
        <div style={{float:"right"}}>
          <Button onClick={resetData}>重置</Button>
        </div>
      </div>
      {forceUpdate&&
        <div id="condition" className={styles.r_m_content}>
          {type=='config'?
            <IfElseConfig
              updateData={updateData}
              allCol={allCol}
              setIsChangeConfig={setIsChangeConfig}
              isChangeConfig={isChangeConfig}
              colMainTabel={colMainTabel}
              query={query}
              funData={funData}
              setFunData={setFunData}
              bizSolId={bizSolId}
              setData={setData}
              data={data}
              treeData={treeData}
              setTreeData={setTreeData}
              setMaxId={setMaxId}
              maxId={maxId}
            />:
            <ScriptEditor
              scriptValue={textContent&&beautify(textContent, {
                  indent_size: 2,//缩进两个空格
                  space_in_empty_paren: true,
                })}
              ref={editorRef}
            />
          }
        </div>
      }
    </Modal>
  )
}
export default connect(({applyModelConfig})=>{return {applyModelConfig}})(RuleSetModal);
//数据格式
// const data = [
//     {
//       "id":"1",
//       "ifCondition":{
//           "condition":"&&",
//           "level":"0",
//           "children":[
//               {
//                   "startCode":"A",
//                   "operator":"=",
//                   "endCode":"inputNumber",
//                   "value":"5.5",
//                   "level":"1"
//               },
//               {
//                   "condition":"or",
//                   "children":[
//                       {
//                           "startCode":"A",
//                           "operator":"=",
//                           "endCode":"inputNumber",
//                           "value":"5.5",
//                           "level":"2_1"
//                       },
//                       {
//                           "condition":"&&",
//                           "level":"2_2",
//                           "children":[
//                               {
//                                   "startCode":"A",
//                                   "operator":"=",
//                                   "endCode":"inputNumber",
//                                   "value":"5.5",
//                                   "level":"2_2_1"
//                               },
//                               {
//                                   "startCode":"A",
//                                   "operator":"=",
//                                   "endCode":"inputNumber",
//                                   "value":"5.56",
//                                   "level":"2_2_2"
//                               }
//                           ]
//                       }
//                   ],
//                   "level":"2"
//               }
//           ]
//       },
//       "ifMsg":{
//           "type":"success",
//           "value":""
//       },
//       "else":{
//           "type":"if",
//           "value":""
//       },
//       "parentId":"0"
//   },
//   {
//       "id":"2",
//       "ifCondition":{
//           "condition":"or",
//           "level":"0",
//           "children":[
//               {
//                   "startCode":"A",
//                   "operator":"=",
//                   "endCode":"inputNumber",
//                   "value":"5.5",
//                   "level":"1"
//               },
//               {
//                   "condition":"or",
//                   "children":[
//                       {
//                           "startCode":"A",
//                           "operator":"=",
//                           "endCode":"inputNumber",
//                           "value":"5.5",
//                           "level":"2_1"
//                       },
//                       {
//                           "condition":"&&",
//                           "level":"2_2",
//                           "children":[
//                               {
//                                   "startCode":"A",
//                                   "operator":"=",
//                                   "endCode":"inputNumber",
//                                   "value":"5.5",
//                                   "level":"2_2_1"
//                               },
//                               {
//                                   "startCode":"A",
//                                   "operator":"=",
//                                   "endCode":"inputNumber",
//                                   "value":"5.56",
//                                   "level":"2_2_2"
//                               }
//                           ]
//                       }
//                   ],
//                   "level":"2"
//               }
//           ]
//       },
//       "ifMsg":{
//           "type":"success",
//           "value":""
//       },
//       "else":{
//           "type":"text",
//           "value":"ddddddd"
//       },
//       "parentId":"1"
//   }
// ]
