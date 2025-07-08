import React, { useState,useRef,useEffect } from 'react';
import { connect } from 'dva';
import {message,Modal } from 'antd'
import {history} from 'umi'
import { useSelector} from 'umi';
import DefaultEmptyXML from './../../../componments/BpmnEditor/resources/init'
import {CustomModeler} from './../../../componments/BpmnEditor/Editor'
import EditingTools from './../../../componments/BpmnEditor/EditingTools';
import FullModal from './../../../componments/widgets/FullModal';
import CustomTranslateModule from './../../../componments/BpmnEditor/translations'
import BpmnColorPickerModule from 'bpmn-js-color-picker';
import lintModule from 'bpmn-js-bpmnlint'
import bpmnlint from './../../../componments/BpmnEditor/lint'
import CodeView from './codeView'
import {modelingColor} from '../../../util/util'
import zhCN from '../../../componments/BpmnEditor/translations/zh-cn'
// import {attrProperty} from './../../../util/util'
// 小地图
import minimapModule from "diagram-js-minimap";

// 获取extension
import {activitiExtension} from '../../../componments/BpmnEditor/moddle/activiti'
import activitiDescriptor from '../../../componments/BpmnEditor/resources/descriptor/activiti.json'
import {camundaExtension} from '../../../componments/BpmnEditor/moddle/camunda'
import camundaDescriptor from '../../../componments/BpmnEditor/resources/descriptor/camunda.json'
import {flowableExtension}  from '../../../componments/BpmnEditor/moddle/flowable'
import flowableDescriptor from '../../../componments/BpmnEditor/resources/descriptor/flowable.json'

// 常量引入
import {
    ACTIVITI_PREFIX,
    CAMUNDA_PREFIX,
    FLOWABLE_PREFIX,
  } from '../../../componments/BpmnEditor/constant/constants';

import styles from '../index.less'
let bpmnModeler = ''
function CustomCanvas (props){
    const {location,dispatch,modelerSrcId,isEngine=false,query,type,onCloseModal,onCloseBpmnModal,isReused} = props
    const [scale,setScale] = useState(1)
    const [svgSrc,setSvgSrc] = useState('')
    const [svgVisible,setSvgVisible] = useState(false)
    const {processDefinitionId} = useSelector(({upBpmnFile})=>({...upBpmnFile}))
    const getWay = ['bpmn:StartEvent','bpmn:EndEvent',"bpmn:ExclusiveGateway","bpmn:ParallelGateway","bpmn:InclusiveGateway"];
    console.log(processDefinitionId,"processDefinitionId111",modelerSrcId)
    const initPrefix = 'flowable'
    const getCodeView = useRef()
        //初始获取流程图文件
        useEffect(() => {
            bpmnModeler = new CustomModeler({
               container: '#canvas',
               propertiesPanel: {
                 parent: '#js-properties-panel'
               },
                // 校验    
               linting: {
                active: true,
                bpmnlint: bpmnlint
              },
               additionalModules: getAdditionalModules(),
               moddleExtensions: getModdleExtensions(),
                minimap: {
                    open: true
                },
                bpmnRenderer:{
                    defaultStrokeColor:"#808080",//线条 文字颜色
                    // defaultFillColor:"#FFF"//图形填充颜色
                }
             });             
             let xml = modelerSrcId&&modelerSrcId.xmlStr|| null;
             console.log(xml);
            //  可调取接口 看业务
             createNewDiagram(xml)
             props.modeler(bpmnModeler)
             lighting()
             addEventBusListener()
        },[]);
        // 映射节点名称
        const elementTypeLabel = ()=>{
            return {
                'bpmn:StartEvent': '开始',
                'bpmn:EndEvent': '结束',
                "bpmn:ExclusiveGateway": "互斥网关",
                "bpmn:ParallelGateway": "并行网关",
                "bpmn:InclusiveGateway": "包容网关"
            }
        }
        const getAdditionalModules = ()=>{
            const modules = [];
            const baseModules = [ 
                CustomTranslateModule,
                BpmnColorPickerModule,
                minimapModule,
                lintModule
            ];
            if(initPrefix===FLOWABLE_PREFIX){
                modules.push(flowableExtension)
            }
            if(initPrefix===ACTIVITI_PREFIX){
                modules.push(activitiExtension)
            }
            if(initPrefix===CAMUNDA_PREFIX){
                modules.push(camundaExtension)
            }
            
            return [...modules,...baseModules]
        }
        const getModdleExtensions = ()=>{
            const extensions = {};
            if(initPrefix === FLOWABLE_PREFIX){
                extensions.flowable = flowableDescriptor
            }
            if(initPrefix === ACTIVITI_PREFIX){
                extensions.activiti = activitiDescriptor
            }
            if(initPrefix === CAMUNDA_PREFIX){
                extensions.camunda =camundaDescriptor
            }
            return extensions
        }
        const createNewDiagram= async(xml)=> {
            // 定义流程信息
            let definitionsInfo = null;
            let processInfo = null;
            // 使用xml2js解析xml获取流程对象
            const parseString = require('xml2js').parseString;
            parseString(xml,function(err,result){
                // 去掉bpmn2:，因为这里用的是bpmn1
                if(result){
                    definitionsInfo = result[`definitions`];
                    processInfo = result[`definitions`][`process`][0][`$`];
                }
            })
            // 增加流程复用标识isReused
            let newId = isReused?location.bizSolCode: processInfo?.id||`${location.bizSolCode}`;
            let newName = isReused? location.bizSolName: processInfo?.name||`${location.bizSolName}`;
            let xmlString = xml || DefaultEmptyXML(newId,newName,initPrefix);
            // bpmnModeler.get("modeling").updateProperties(bpmnElement, {
            //     id: elementBusinessObject[key],
            //   });
           try {
             const result = await bpmnModeler.importXML(xmlString);
             const canvas = bpmnModeler.get("canvas");
                canvas.zoom("fit-viewport", "auto");
             const { warnings } = result;
             console.log(warnings);
             if(result){
                
                const allShapes = bpmnModeler.get("elementRegistry");
                allShapes.forEach(element => {
                    const shapeId = element.businessObject.id;
                    
                    modelingColor(allShapes,null,'#808080',shapeId,bpmnModeler)
                        // 如果是流程复用就更新流程节点和名称 
                        if(isReused&&shapeId ==processInfo.id){
                            bpmnModeler.get("modeling").updateProperties(element, {
                                id: location.bizSolCode,
                                name: location.bizSolName
                            });
                        } 
                    }
                )
             }
             
           } catch (err) {
             console.log(err.message, err.warnings);
           }
         }
         // 导入 xml 文件
       const  handleOpenFile = e => {
           // const that = this;
           const file = e.target.files[0];
           const reader = new FileReader();
           let data = '';
           reader.readAsText(file);
           reader.onload = (event)=> {
               data = event.target.result;
               createNewDiagram(data, 'open');
           };
       };
       // 前进
       const  handleRedo = () => {
           bpmnModeler.get('commandStack').redo();
       };
   
       // 后退
       const handleUndo = () => {
           bpmnModeler.get('commandStack').undo();
       };
       // 下载 SVG 格式
       const handleDownloadSvg = () => {
       bpmnModeler.saveSVG({format: true}, (err, data) => {
           download('svg', data);
       });
       };
       // 流程图放大缩小
       const  handleZoom = radio => {
       const newScale = !radio
           ? 1.0 // 不输入radio则还原
           : scale + radio <= 0.2 // 最小缩小倍数
           ? 0.2
           : scale + radio;
   
       bpmnModeler.get('canvas').zoom(newScale);
       setScale(newScale)
       };
   
       // 下载 XML 格式
       const  handleDownloadXml = () => {
           bpmnModeler.saveXML({format: true}, (err, data) => {
               download('xml', data);
           });
       };
       /**
        * 下载xml/svg
        *  @param  type  类型  svg / xml
        *  @param  data  数据
        *  @param  name  文件名称
        */
       const download = (type, data, name) => {
           console.log(type,data,name)
           let dataTrack = '';
           const a = document.createElement('a');
   
           switch (type) {
               case 'xml':
                   // bpmn
                   dataTrack = 'xml';
                   break;
               case 'svg':
                   dataTrack = 'svg';
                   break;
               default:
                   break;
           }
   
           name = name || `diagram.${dataTrack}`;
   
           a.setAttribute(
               'href',
               `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`
           );
           a.setAttribute('target', '_blank');
           a.setAttribute('dataTrack', `diagram:download-${dataTrack}`);
           a.setAttribute('download', name);
   
           document.body.appendChild(a);
           a.click();
           document.body.removeChild(a);
       };
       // 预览图片
       const handlePreview = () => {
           bpmnModeler.saveSVG({format: true}, (err, data) => {
               setSvgSrc(data)
               setSvgVisible(true)
           });
       };
        // 关闭流程图弹窗
       const handleCancel = () => {
           setSvgSrc('')
           setSvgVisible(false)
       };
        //  是否开启校验
       const lighting= (toggle=false)=>{
        const linting = bpmnModeler.get('linting');
        linting.toggle(toggle)
       }
       // 监听拖拽
    const  addEventBusListener=()=> {
        const eventBus = bpmnModeler.get("eventBus");
        eventBus.on("drag.start", function(e) {
        const linting = bpmnModeler.get('linting');
            linting.toggle(false)
        });
        // 删除 bpmn logo
        const bjsIoLogo = document.querySelector('.bjs-powered-by');
        while (bjsIoLogo.firstChild) {
            bjsIoLogo.removeChild(bjsIoLogo.firstChild);
        }
    }

    // 代码预览
    const handleCodeView = async()=>{
        getCodeView.current.showModal()
    }

    // 保存
    const handleSave = () => {
        handleSaveAndPublish(false)
    };
    // 校验label标签数量
    const lintRegistryLabel = ()=>{
        const registry =  bpmnModeler.get("elementRegistry")
        let isReturn  = false
        registry.forEach(element=>{
            const shapeId = element.businessObject.id;
            if(element.businessObject&&element.businessObject.name&&element.businessObject.name.length>50){
                isReturn = true
            }
        })
       return isReturn
    }
    const handleSaveAndPublish=(isDeploy)=>{
        lighting(true)
        let json_xml = '';
        const lint_arr = [];
        let lint_arr_value = []
        const linting = bpmnModeler.get('linting');
        if(lintRegistryLabel()){
            message.error('标签/名称长度超过50')
            return false
        }
        // 保存自动添加开始结束网关名称
        const allShapes = bpmnModeler.get("elementRegistry"); 
        const modeling = bpmnModeler.get("modeling")
        allShapes.forEach((element)=>{
            if(element.type == 'bpmn:SubProcess'){
                const baseName = element.businessObject.name
                const name = baseName||`子流程${element.businessObject.id}`
                modeling.updateLabel(element,name)
            }
            if(getWay.includes(element.type)){
                const name = element.businessObject.name
                modeling.updateLabel(element,name?name:elementTypeLabel()[element.type])
            }
            if(element.type === 'bpmn:UserTask'){
                modeling.updateProperties(element,{
                    'flowable:assignee': "${assignee_"+`${element.id}`+"}"
                })
            }
        })

        let timer = null
        timer = setTimeout(async()=>{
            for(let key in linting._issues){
                lint_arr.push(key)
                lint_arr_value.push(linting._issues[key])
            }
            if(!lint_arr.length){
                const result = await bpmnModeler.saveXML({format: true})
                json_xml = result.xml;
                // 网关处理
                // attrProperty(element,'bpmn:ExclusiveGateway','eq')
                // attrProperty(element,'bpmn:InclusiveGateway','contains')
                // getScriptFileToMinio 上传到minio
                    const uploadCallBack=val=>{
                        //  保存数据接口
                    // if(!modelerSrcId||!modelerSrcId.xmlStr){
                        // if(isEngine){
                            dispatch({
                                type: 'upBpmnFile/newAddBPmnFlow',
                                payload: {
                                    modelName: location.bizSolName,
                                    modelKey: location.bizSolCode,
                                    modelPath: val,
                                    isDeploy,
                                    // isDeploy后续添加保存并部署按钮传 true，目前只是保存
                                    ctlgId: location.ctlgId,
                                    id: isEngine?location.id:modelerSrcId.id
                                },
                                callback:value=>{

                                    // 如果是发布
                                    if(isDeploy){
                                        if(type){
                                            onCloseModal()
                                        }else{
                                            onCloseBpmnModal()
                                        }
                                        props.handleIframePostMessage(value)
                                        dispatch({
                                            type:"applyModelConfig/updateStates",
                                            payload:{
                                              titleList:[]
                                            }
                                        })
                                    } 
                                }
                            })
                        // }
                    if(result){
                        clearTimeout(timer)
                        }
                    }
                dispatch({
                    type: 'upBpmnFile/getScriptFileToMinio',
                    payload: {
                        json_xml,
                        bizSolId:isEngine?location.id:modelerSrcId.id
                    },
                    callback: uploadCallBack,
                    });
                return             
            }else{
                // message.error('有错误节点内容请修改')
                // console.log(lint_arr_value,"lint_arr111")
                const flatArr = lint_arr_value.flat(Infinity)
                // console.log("flatArr",flatArr)
                message.error(zhCN[flatArr[0].message])
                return false
            }       
        },150)
    }
    // 保存并发布
    const handleCodePublish = ()=>{
        handleSaveAndPublish(true)
    }
    const handleGoBack =()=>{
        if(type){
            onCloseModal()
            return 
        }else{
            onCloseBpmnModal()
            return 
        }
        
    }
    return (
        <div className={styles.canvasHeight}>
            <div className={styles.canvasHeight}>
                <div id="canvas" className={styles.canvasBg}>
                </div>
                <div id="js-properties-panel" className="panel">
                </div>
            </div>
                {svgVisible && (
                <FullModal visible={svgVisible} onCancel={handleCancel}>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: svgSrc,
                        }}
                    />
                </FullModal>
            )}
            {/* 浏览code view 代码规范 */}
            <CodeView  modeler={bpmnModeler} ref={getCodeView}/>

            <EditingTools
                onOpenFIle={handleOpenFile}
                onSave={handleSave}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onDownloadSvg={handleDownloadSvg}
                onDownloadXml={handleDownloadXml}
                onZoomIn={() => handleZoom(0.1)}
                onZoomOut={() => handleZoom(-0.1)}
                onZoomReset={() => handleZoom()}
                onPreview={handlePreview}
                onCodeView={handleCodeView}
                onSaveAndUpload= {handleCodePublish}
                onGoBack={handleGoBack}
            />
        </div>
    )
}

export default (connect(({applyModelConfig,upBpmnFile})=>({
    applyModelConfig,
    upBpmnFile
  }))(CustomCanvas));