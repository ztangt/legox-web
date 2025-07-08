import React,{useEffect,useState} from 'react';
import {connect} from 'umi';
import {CustomViewer} from '..'
import DefaultEmptyXML from '../resource/init'
// import DefaultEmptyXML from '../../../componments/BpmnView/resource/test'
import BpmnTools from '../../BpmnTools'
import  '../index.less'
let viewer = null;
const BpmnView = ({dispatch,getBpmnId,newFlowImg,isSub=false,historyActive,currentActive,nodeMouseOut,targetKey,processId,
    bpmnRef,isActive})=>{
    const [scale,setScale] = useState(0.4)
    useEffect(()=>{
        initView()
    },[])
    useEffect(()=>{
        if(processId){
            subProcessChangeColor(processId)
        }
    },[processId,isActive])
    // 子流程改变颜色
    function subProcessChangeColor(processId){
        const allShapes = viewer.get("elementRegistry");
        const modeling =  viewer.get('modeling');
        // console.log("9888viewers",allShapes)
        allShapes.forEach(element=>{
            if(!isActive){
                modeling.setColor(element,{
                    fill: null,
                    stroke:'#1890FF'
                })     
            }else{
                if(element.type == 'bpmn:SubProcess'){
                    if(processId== element.id){
                        modeling.setColor(element,{
                            fill:'#EFF2FF',
                            // stroke:'#ffffff'
                        })
                    }else{
                        modeling.setColor(element,{
                            fill: null,
                            stroke:'#1890FF'
                        })  
                    }
                }
            }
        })
    }
    function modelingColor(shape,fill=null,stroke='#d4d9e1'){
        const modeling =  viewer.get('modeling')
        modeling.setColor(shape,{
            fill,
            stroke
        })
    }
    const initView = async()=>{
        viewer = new CustomViewer({
            container: '#view-canvas'+targetKey,
            bpmnRenderer:{
                defaultStrokeColor: isSub? '#1890FF':'#b3b3b3',
            },
             // 可以改变字符距离图位置
            textRenderer: {
                defaultStyle:{
                    lineHeight: 2,
                }
            },
            additionalModules: [
                {
                    paletteProvider: ["value", ''], //禁用/清空左侧工具栏
                    labelEditingProvider: ["value", ''], //禁用节点编辑
                    contextPadProvider: ["value", ''], //禁用图形菜单
                    bendpoints: ["value", {}], //禁用连线拖动
                    move: ['value', ''], //禁用单个图形拖动
           }],
            height: '100%'
        })
            let definitionsInfo = null;
            let processInfo = null;
            let xml = newFlowImg||null
            console.log("000-xml",xml)
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
            console.log("xmlString",xmlString)
            try {
                const res = await viewer.importXML(xmlString);
                if(res){
                    const canvas = viewer.get("canvas");
                    canvas.zoom("fit-viewport", "auto");
                    const zoom_scale = viewer.get('canvas')._cachedViewbox.scale
                    setScale(zoom_scale)
                    
                    console.log("historyActive",historyActive)
                    // 获取到全部节点 开始添加更换节点颜色
                    const allShapes = viewer.get("elementRegistry");
                    if(historyActive&&historyActive.length&&historyActive.length>0){
                        historyActive.forEach(item=>{
                            if (allShapes._elements[item]) {
                                // const element =  allShapes._elements[item].gfx
                                // element.classList.add('highLight')
                                modelingColor(allShapes._elements[item].element,null,'#1890FF')
                            }
                        })
                    }
                    if(currentActive&&currentActive.length&&currentActive.length>0){
                        currentActive.forEach(item=>{
                            if(allShapes._elements[item]){
                                modelingColor(allShapes._elements[item].element,'#007bff','#fff')
                            }
                        })
                    }

                    if(isSub){
                        bpmnRef.current = viewer
                        eventSubClick(viewer)
                    }else{
                        eventListener(viewer)
                    }
               }    
              } catch (err) {
                console.log(err.message, err.warnings);
              }     

        // 子流程点击事件
        function eventSubClick (viewer){
            let eventBus = viewer.get('eventBus');
            eventBus.on('element.click',function(e){
                // console.log("element1111",e.element)
                if(e.element.type !="bpmn:SubProcess"){
                    return 
                }

                getBpmnId(e.element.id,e)
                subProcessChangeColor(e.element.id)
            })
        }
        // 监听流程点击事件
        function eventListener(viewer){
            let eventBus = viewer.get('eventBus');
            // console.log('eventBus==',eventBus);
            eventBus.on('element.hover',function(e){
                if(e.element.id==='Process_1'){
                    return
                }
                // console.log(e,"element==111111")
                if(e.element.type === 'bpmn:UserTask'){
                    getBpmnId(e.element.id,e)
                }else if(e.element.type == 'bpmn:ExclusiveGateway'||e.element.type=='bpmn:InclusiveGateway'){
                    getBpmnId(e.element.id,e)
                }
            })
            eventBus.on('element.out',function(e){
                const overlays = viewer.get('overlays')
                overlays.clear() 
                nodeMouseOut&&nodeMouseOut();   
            })
        }
    }
    // 放大
    const handleZoom = radio=>{
        const newScale = !radio
           ? 1.0 // 不输入radio则还原
           : scale + radio <= 0.15 // 最小缩小倍数
           ? 0.15
           : scale + radio;
           setScale(newScale)
        viewer.get('canvas').zoom(newScale);
    }
    const handleReset = ()=>{
        const viewer = bpmnRef.current
        viewer.get('canvas').zoom("fit-viewport", "auto");
        const cache_scale = viewer.get('canvas')._cachedViewbox.scale
        setScale(cache_scale)
    }

    return (
        <div id={`view-canvas${targetKey}`} className="canvasView">
            {isSub&&<BpmnTools handleZoom={handleZoom} handleReset={handleReset}/>}
        </div> 
    )
}

export default connect(({layoutG,applyModelConfig})=>{return {layoutG,applyModelConfig}})(BpmnView);
