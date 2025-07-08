import { Button, Drawer, Space,Input,Form,Card,Collapse, message  } from 'antd';
import React, { useState,useEffect,useRef } from 'react';
import Log from './../../util/Log'
import BaseInfo from './components/baseInfo'
import Common from './components/common'
import UpdateSign from './components/updateSign'
import './index.less'

const CustomPropertyPanel = (props) => {
    const {bpmnModeler} = props
    const [open, setOpen] = useState(false);
    const [isClick, seIsClick] = useState(false);    
    // const [selectedElements, setSelectedElements] = useState([])
    const [ bpmnElement,setBpmnElement] = useState(null) 
    const [elementType,setElementType] = useState("")
    const [elementId,setElementId] = useState("")
    const [elementBusinessObject, setElementBusinessObject]  = useState({})
    const [conditionFormVisible, setConditionFormVisible] = useState(false)
    const [formVisible,setFormVisible] = useState(false)
  
    useEffect(()=>{
        initModels()
        return ()=>{
            window.bpmnInstances = null;
        }
    },[bpmnModeler,open])
    useEffect(()=>{
      setOpen(true)
      return ()=>{
        setOpen(false)
      }
    },[])
   const initModels =()=> {
        // 初始化 modeler 以及其他 moddle
        let timer = null
        if (!bpmnModeler) {
          // 避免加载时 流程图 并未加载完成
          timer = setTimeout(() =>initModels(), 100);
          return;
        }
        if (timer) clearTimeout(timer);

        window.bpmnInstances = {
          modeler: bpmnModeler,
          modeling: bpmnModeler.get("modeling"),
          moddle: bpmnModeler.get("moddle"),
          eventBus: bpmnModeler.get("eventBus"),
          bpmnFactory: bpmnModeler.get("bpmnFactory"),
          elementFactory: bpmnModeler.get("elementFactory"),
          elementRegistry: bpmnModeler.get("elementRegistry"),
          replace: bpmnModeler.get("replace"),
          selection: bpmnModeler.get("selection")
        };
        getActiveElement(bpmnModeler);
      }
      const  getActiveElement=(bpmnModeler)=> {
        // 初始第一个选中元素 bpmn:Process
        initFormOnChanged(null);
        bpmnModeler.on("import.done", e => {
          initFormOnChanged(null);
        });
        // 监听选择事件，修改当前激活的元素以及表单
        bpmnModeler.on("selection.changed", ({ newSelection }) => {
          // console.log(newSelection)
          if(newSelection&&newSelection.length){
            seIsClick(true)
          }else{
            seIsClick(false)
          }
          initFormOnChanged(newSelection[0] || null);
        });
        bpmnModeler.on("element.changed", ({ element }) => {
          // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
          if (element && element.id === elementId) {
            initFormOnChanged(element);
          }
        });
        bpmnModeler.on('element.mousedown',({element})=>{
          if(element&&element.businessObject&&element.businessObject.flowElements&&element.businessObject.flowElements.length>0){
            element.businessObject.flowElements.forEach(item=>{
              if(item.name&&item.name.length>50){
                message.error('标签/名称长度超过50')
              }
            })
          }
        })
      }
    //   // 初始化数据
    const initFormOnChanged=(element)=> {
        let activatedElement = element;
        if (!activatedElement) {
          activatedElement =
            window.bpmnInstances.elementRegistry.find(el => el.type === "bpmn:Process") ??
            window.bpmnInstances.elementRegistry.find(el => el.type === "bpmn:Collaboration");
        }
        if (!activatedElement) return;
        Log.printBack(`select element changed: id: ${activatedElement.id} , type: ${activatedElement.businessObject.$type}`);
        Log.prettyInfo("businessObject", activatedElement.businessObject);
        window.bpmnInstances.bpmnElement = activatedElement;
        const bpmnElement = activatedElement;
        setBpmnElement(bpmnElement)
        const elementId = activatedElement.id;
        setElementId(elementId)
        const elementType = activatedElement.type.split(":")[1] || "";
        setElementType(elementType)
        const elementBusinessObject = JSON.parse(JSON.stringify(activatedElement.businessObject));
        setElementBusinessObject(elementBusinessObject)
        const conditionFormVisible = !!(
          elementType === "SequenceFlow" &&
          activatedElement.source &&
          activatedElement.source.type.indexOf("StartEvent") === -1
        );
        setConditionFormVisible(conditionFormVisible)
        const formVisible = elementType === "UserTask" 
        setFormVisible(formVisible)
        // updateProperties(activatedElement,elementBusinessObject)
      }
      // 更新节点方法
      const updateBaseInfo=(e,key)=> {
        seIsClick(true)
        console.log(key,"key")
        const value = e.target.value
        elementBusinessObject[key] = value
        if (key === "id") {
          bpmnModeler.get("modeling").updateProperties(bpmnElement, {
            id: elementBusinessObject[key],
            di: { id: `BpmnPlane_${elementBusinessObject[key]}` }
          });
          return;
        }
        // if(key === 'document'){
        //   const documentation = window.bpmnInstances.bpmnFactory.create('bpmn:Documentation',{text: value})
        //   window.bpmnInstances.modeling.updateProperties(bpmnElement, {
        //     documentation: [documentation]
        //   });
        // }
        const attrObj = Object.create(null);
        attrObj[key] = elementBusinessObject[key]=value;
        // console.log(attrObj,"attrObj")
        if (key === 'color') {
          onChangeColor(value)
        }
        bpmnModeler.get("modeling").updateProperties(bpmnElement, attrObj);
      }
      // 改变颜色
      const onChangeColor=(color)=>{
        const modeling = bpmnModeler.get('modeling')
        modeling.setColor(bpmnElement, {
          fill: null,
          stroke: color
        })
      }
      // 更新元素用户节点添加属性
      // const updateProperties=(bpmnElement,elementBusinessObject)=>{
      //   const modeling = bpmnModeler.get("modeling")
      //   if(bpmnElement.type === 'bpmn:UserTask'){
      //     modeling.updateProperties(bpmnElement,{
      //       'flowable:assignee': "${assignee_"+`${bpmnElement.id}`+"}"
      //     })
      //   }
      // }
      // 更新切换网关类型方法
      const updateActiveIndex = (index)=>{
        const multiInstanceLoopCharacteristics =  bpmnModeler.get('moddle').create('bpmn:MultiInstanceLoopCharacteristics');
        if(index === '0'){
          bpmnModeler.get('modeling').updateProperties(bpmnElement, {
                loopCharacteristics: undefined,
            });
            return 
        }
        if(index === '2'){
            multiInstanceLoopCharacteristics.isSequential = true; 
        }
        if(index ==='1'){
            multiInstanceLoopCharacteristics.isSequential = false;
        }
        multiInstanceLoopCharacteristics.$attrs['flowable:collection'] = `assigneeList_${bpmnElement.id}`
        multiInstanceLoopCharacteristics.$attrs['flowable:elementVariable'] = `assignee_${bpmnElement.id}`
        bpmnModeler.get('modeling').updateProperties(bpmnElement, {
            loopCharacteristics: multiInstanceLoopCharacteristics
        });
      }
    return (
      <div className="custom-properties-panel">
        <Card
          size="small"
          title="基本信息"
          style={{
            width: 300,
          }}
        >
            {!isClick&&<BaseInfo bpmnModeler={bpmnModeler}  bpmnElement={bpmnElement} elementBusinessObject={elementBusinessObject} updateInfo={updateBaseInfo}/>}
            {isClick&&<Common updateInfo={updateBaseInfo} bpmnElement={bpmnElement} elementBusinessObject={elementBusinessObject}>
                <BaseInfo bpmnModeler={bpmnModeler} isCommon={true}  bpmnElement={bpmnElement} elementBusinessObject={elementBusinessObject} updateInfo={updateBaseInfo}/>
              </Common>}
              {formVisible&&<UpdateSign element={bpmnElement} updateActiveIndex={updateActiveIndex}></UpdateSign>}
        </Card>
      </div>
    );
  };
  
  export default CustomPropertyPanel;