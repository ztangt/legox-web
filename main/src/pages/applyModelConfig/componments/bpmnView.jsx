import React,{useEffect,useState,useRef} from 'react';
import {connect} from 'umi';
import {CustomViewer} from './../../../componments/BpmnView'
//  import { defaultXml } from '../../../componments/BpmnView/resource/xml';
import DefaultEmptyXML from './../../../componments/BpmnEditor/resources/init'
// import DefaultEmptyXML from '../../../componments/BpmnView/resource/test'
import {modelingColor} from '../../../util/util'
import  '../index.less'
const BpmnView = ({dispatch,getBpmnId,needEventOn=false,newFlowImg,query})=>{
  const {bizSolId} = query;
  const refs = useRef({})
    useEffect(()=>{
        initView()
    },[])

    const initView = async()=>{
        let additionsArr = [{
            paletteProvider: ["value", ''], //禁用/清空左侧工具栏
            labelEditingProvider: ["value", ''], //禁用节点编辑
            contextPadProvider: ["value", ''], //禁用图形菜单
            bendpoints: ["value", {}], //禁用连线拖动
            move: ['value', ''] //禁用单个图形拖动
       }]
      const viewer = new CustomViewer({
            container: refs.current,
            textRenderer: {
                defaultStyle:{
                    lineHeight: 2,
                }
            },
            additionalModules: additionsArr,
            height: '100%'
        })
            let definitionsInfo = null;
            let processInfo = null;
            let xml = newFlowImg||null
            // 使用xml2js解析xml获取流程对象
            const parseString = require('xml2js').parseString;
            parseString(xml,function(err,result){
                // 去掉bpmn2:，因为这里用的是bpmn1
                if(result){
                    definitionsInfo = result[`definitions`];
                    processInfo = result[`definitions`][`process`][0][`$`];
                }
            })
            let newId = processInfo?.id||`${location.bizSolCode}`;
            let newName =  processInfo?.name||`${location.bizSolName}`;
            let xmlString = xml || DefaultEmptyXML(newId,newName,'flowable');
            try{

                const result = await viewer.importXML(xmlString);
                const canvas = viewer.get("canvas");
                canvas.zoom("fit-viewport", "auto");
                if(result){
                    // 获取到全部节点 开始添加更换节点颜色
                const allShapes = viewer.get("elementRegistry");
                // console.log("appShapes",allShapes)
                allShapes.forEach(element => {
                    const shapeId = element.businessObject.id;
                    // console.log(element.businessObject,"business")
                    modelingColor(allShapes,null,'#808080',shapeId,viewer)
                    // if(element&&(element.type == 'bpmn:StartEvent'||element.type == 'bpmn:EndEvent')){
                    //     const shape = allShapes.get(shapeId)
                    //     const modeling =  viewer.get('modeling')
                    //     let defaultValue = '开始'
                    //     if(element.type == 'bpmn:EndEvent'){
                    //         defaultValue = '结束'
                    //     }
                    //     setTimeout(()=>{
                    //         modeling.updateLabel(shape,defaultValue,{
                    //             x: shape.x+shape.width/6,
                    //             y: shape.y+shape.height/3,
                    //             width: shape.label.width,
                    //             height: shape.label.height
                    //         })
                    //     },10)
                    // }
                  });
                  setTimeout(()=>{
                    if(needEventOn){
                        eventListener(viewer)
                      }
                  },700)
                }
            }catch(err){
                console.log(err.message, err.warnings);
            }

        // 监听流程点击事件
        const eventListener = (viewer)=>{
            let eventBus = viewer.get('eventBus');
            eventBus.on('element.contextmenu',function(e){
                if(e.element.id==='Process_1'){
                    return
                }
                e.preventDefault();
                if(e.element.type === 'bpmn:UserTask'||e.element.type === 'bpmn:EndEvent'){
                    getBpmnId(e.element.id,e)
                }else if(e.element.type == 'bpmn:ExclusiveGateway'||e.element.type=='bpmn:InclusiveGateway'||e.element.type=='bpmn:ParallelGateway'){
                    getBpmnId(e.element.id,e)
                }else if(e.element.type == "bpmn:SubProcess"){
                    getBpmnId(e.element.id,e)
                }
            })
            // element.dblclick
            // eventBus.on('element.changed',function(e){
            //     if(e.element.id==='Process_1'){
            //         return
            //     }
            //     e.preventDefault();
            //     if(e.element.type === 'bpmn:UserTask'){
            //         getBpmnEditorId(e.element.id,e)
            //     }else if(e.element.type == 'bpmn:ExclusiveGateway'||e.element.type=='bpmn:InclusiveGateway'){
            //         getBpmnEditorId(e.element.id,e)
            //     }
            // })
        }
    }
    if(needEventOn){
        return (
            <div id={`view-canvas_${bizSolId}`} style={{height:'100%'}} className='canvasNode' ref={refs}>
            </div>
        )
    }
    return (
        <div id={`view-canvas_${bizSolId}`} style={{height:'100%'}}  className="canvasView" ref={refs}>
        </div>
    )
}

export default connect(({layoutG,applyModelConfig})=>{return {layoutG,applyModelConfig}})(BpmnView);
