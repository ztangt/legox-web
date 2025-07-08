import React, { useState,useRef,useEffect } from 'react';
import { connect } from 'dva';
import {Space,Button,Table,Checkbox,Radio,Modal,Popover} from 'antd';
import {history} from 'umi';
// import WORKFLOW from './workflowNode';
import NODEATTRIBUTE from './nodeAttribute';
import EVENT from './eventHandler';
import GATEWAY from './gateway';
import BpmnView from './bpmnView';
import NodeModal from './nodeModal';
import ElutionOrderModal from './elutionOrderModal';
import CopyConfigModal from './copyConfigModal';
import ProcessSortModal from './processLink'
import ConfigReplication from './configReplication';//复制配置
import GlobalModal from '../../../componments/GlobalModal';
import SubProcess from './subModal'
import  '../index.less';
import { parse } from 'query-string';
// import SAVELSSUE from './saveIssueModule';//保存至模块资源
function NodeSet ({query,dispatch,setParentState,parentState}){
    const {bizSolId,bizSolName} = query;
    const {nodeAttributeModal,procDefId,imgNode,newFlowImg,version,actId,nodeObj,bizFromInfo,gatewayModal,
      nodeModalActId,nodeElement,nodeModalShow,isShowElution,isShowCopyConfig,isShowConfigModal,bizSolInfo}=parentState
        //NodeBaseObj
    const [modalStyle, setModalStyle] = useState({display:'none'});
    const [ulStyle,setUlStyle]=useState({display:'none'})
    const [modalNode, setModalNode] = useState(false);
    const [eventNodeType, setEventNodeType] = useState('');
    const [nodeValue,setNodeValue] = useState({})
    const [subModal,setSubModal] = useState(false) // 子流程弹窗
    // 节点排序弹窗
    const [processSortModalShow,setProcessSortModalShow] = useState(false);
    //初始
    useEffect(() => {
        //获取业务表单
        getImgNode()
    },[]);
    // 获取bpmn json节点信息
    const getImgNode = ()=>{
        dispatch({
            type:'applyModelConfig/getImgNode',
            payload:{
                procDefId,
                type: 'JSON'
            },
            callback:(data)=>{
              setParentState({
                ...data
              })
            }
        })
    }
    function onCancel(status=''){
      setParentState({
        nodeAttributeModal:false,
        gatewayModal:false,
        nodeModalShow: false,
        nodeObj:{},
        nodeValue:{}
      })
      setModalNode(false)
      // 刷新bpmn 节点
      if(status == 'close'){
          getImgNode()
          setProcessSortModalShow(false)
      }
    }
    // image图方式
    // function nodeModalClick(obj,index,e){//区域位置信息的显示
    //     console.log('obj',obj)
    //     e.preventDefault();
    //     if(obj.type == 'StartEvent'){
    //         setModalNode(false)
    //         setEventNodeType('开始')
    //     }else if(obj.type == 'EndEvent'){
    //         setModalNode(false)
    //         setEventNodeType('结束')
    //     }else if(obj.type == 'ExclusiveGateway'||obj.type=='InclusiveGateway'){
    //         dispatch({
    //             type:"applyModelConfig/updateStates",
    //             payload:{
    //               nodeAttributeModal:true,
    //               actId:obj.id
    //             }
    //         })
    //     }else{
    //         let x = obj.x + 60 + 'px';
    //         let y = obj.y + 80 + 'px';
    //         let styles = {
    //             display:'block',
    //             left:x,
    //             top:y
    //         }
    //         setModalStyle(styles);
    //         dispatch({
    //           type:"applyModelConfig/updateStates",
    //           payload:{
    //             nodeModalActId:obj.id,//当前节点,不直接复制成actId,是想着节点改变的时候才显示基本信息弹框
    //           }
    //       })
    //     }
    // }
    // console.log('nodeModalActId=',nodeModalActId);
    function basicClick(actId){
    //获取节点的排序列表
    	dispatch({
        type: 'applyModelConfig/nodeDetailsTree',
        payload:{
          procDefId:procDefId
        },
        callback(value){
					setParentState({
						actId:actId,
						nodeAttributeModal:true,
					})
					setModalStyle({display:'none'})//不显示弹框
					setUlStyle({display:'none'})
        },
        extraParams:{
          setState:setParentState
        }
    	})
    }
    // 子流程弹窗关闭
    const onSubCancel = ()=>{
        setSubModal(false)
    }
    // function workflowClick(){
    //     dispatch({
    //         type:"applyModelConfig/updateStates",
    //         payload:{
    //             workflowNodeModal:true
    //         }
    //     })
    // }
    // image图方式
    // function nodeSetFn(obj){
    //     const listMap = obj.nodeJson.elements.map((item,i)=>{
    //         return (<area shape="rect" key={i} coords={`${item.x},${item.y},${item.x + item.width},${item.y + item.height}`} type="userTask" style={{cursor:'pointer'}} onContextMenu={nodeModalClick.bind(this,item,i)}/>)
    //     })
    //     return (<map name="nodeSet" id="nodeSet">
    //         {listMap}
    //     </map> )
    // }
    // function filter (data) {
    //     var newData = data.filter(x => !x.menuLink)
    //     newData.forEach(x => x.children && x.children.length > 0 && (x.children = filter(x.children)))
    //     return newData
    // }
    // function loops(array){
    //     for(let i= 0;i<array.length;i++){
    //       let item = array[i];
    //       if(item.children && item.children.length == 0){
    //         item.children = null
    //       }
    //       if(item.children&&item.children.length!=0){
    //         loops(item.children)
    //       }
    //     }
    //     return array
    // }
    // function saveIssueModuleClick(){
    //     dropScope('/moduleResourceMg')
    //     dispatch({
    //         type: 'registerTree/getRegister',
    //         payload:{
    //             searchWord: '',
    //             limit:100,
    //             start:1
    //         },
    //         pathname: '/moduleResourceMg',//当前路由路径
    //         callback:function(list){
    //             console.log('list',list)
    //             list.forEach(function(item,i){
    //                 if(item.registerAtt == '业务平台'){
    //                     dispatch({
    //                         type: 'moduleResourceMg/getMenu',
    //                         payload:{
    //                             searchWord:'',
    //                             registerId:item.id,
    //                         },
    //                         callback:function(sourceTree){
    //                             let newMenuLists = JSON.parse(JSON.stringify(sourceTree))
    //                             newMenuLists = filter(newMenuLists)
    //                             newMenuLists = loops(newMenuLists)
    //                             dispatch({
    //                                 type: 'moduleResourceMg/updateStates',
    //                                 payload:{
    //                                     currentNode:item,
    //                                     addModal:true,
    //                                     menuLists:newMenuLists,
    //                                     addObj:{
    //                                         menuSourceCode:'APP',
    //                                         openTypeCode:'EMB',
    //                                         bizSolId,
    //                                         bizSolName
    //                                     },
    //                                     parentIds:[]
    //                                 }
    //                             })
    //                             historyPush({
    //                                 pathname: '/moduleResourceMg',
    //                                 query: {
    //                                     // bizSolId: bizSolId,
    //                                     // bizSolName:bizSolName
    //                                 }
    //                             });
    //                         }
    //                     })
    //                 }
    //             })
    //         }
    //       })
    // }
    // console.log('nodeAttributeModal=',nodeAttributeModal);
    const getElementIdByClick = (id,element)=>{
        console.log(element,'element');
        setNodeValue({
            id,
            nameNode: element&&element.element&&element.element.businessObject.name
        })
        if(element.element.type == "bpmn:SubProcess"){
            setSubModal(true)
            return 
        }
         if(element.type == 'bpmn:ExclusiveGateway'||element.type=='bpmn:InclusiveGateway'||element.type=='bpmn:ParallelGateway'){
          setParentState({
            nodeAttributeModal:true,
            actId:id
          })
        }else{
            let x = element.originalEvent.layerX + 'px';
            let y = element.originalEvent.layerY + 'px';
            let styles = {
                display:'block',
                left:x,
                top:y
            }
            if(element.element.type.includes('Gateway')){
                setUlStyle(styles)
                setModalStyle({display:'none'})
            }
            else{
                setModalStyle(styles);
                setUlStyle({display:'none'})
            }
            setParentState({
              nodeModalActId:id,//当前节点,不直接复制成actId,是想着节点改变的时候才显示基本信息弹框
            })
        }
    }
    const bpmnNameChange = ()=>{
        setModalStyle({display:'none'})//不显示弹框
        setUlStyle({display:'none'})
        setParentState({
          nodeModalShow: true,
          nodeValue
        })
    }
    const elutionClick=(actId)=>{
        setUlStyle({display:'none'})
        setParentState({
          isShowElution: true,
          actId:actId,
        })
    }
    //配置复用至
    const copyConfigClick=(nodeModalActId)=>{
        setModalStyle({display:'none'})//不显示弹框
        setUlStyle({display:'none'})
        const newData=nodeElement.filter(item=>item.id==nodeModalActId)
        const actType=newData&&newData[0].type
        const multiInstance=newData&&newData[0].multiInstance
       const newActNodeJson= nodeElement.filter((item)=>item.type==actType&&item.multiInstance==multiInstance&&item.id!==nodeModalActId&&!item.isDraft)
       setParentState({
        isShowCopyConfig:true,
        copyConfigData:newActNodeJson
       })
    }
    //复制配置
    const copyConfiguration=()=>{
        setModalStyle({display:'none'})//不显示弹框
        setUlStyle({display:'none'})
        setParentState({
          isShowConfigModal:true,
        })
    }
    // 节点排序
    const nodeSort = ()=>{
        setProcessSortModalShow(true)
    }
    console.log("nodeValue",nodeValue)
    console.log("nodeModalShow",nodeModalShow)
    return (
        <div className="flowWarp" id={`node_modal_${bizSolId}`} style={{height:'100%'}}>
            <div className="other">
                <p style={{fontSize:'14px'}}><span style={{fontWeight:'900'}}>流程定义名称：</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{decodeURI(bizSolName)}流程版本图-版本{version&&`（${version}）`}</span></p>
                <Space>
                    {/* <Button className={styles.fontSize7} onClick={workflowClick.bind(this)}>流程节点修改</Button> */}
                    <Button onClick={nodeSort}>节点排序</Button>
                    {/* <Button className={styles.fontSize7}>保存</Button> */}
                    {/* <Button className={styles.fontSize7} onClick={saveIssueModuleClick.bind(this)}>保存发布至模块资源</Button> */}
                    {/* <Button className={styles.fontSize7}>暂存</Button> */}
                </Space>
            </div>
            {/* <div> */}
                <div className="imgStr" style={{width:'100%',position:'relative',border: '1px solid black'}}>
                        {/* <img src={imgNode.imgStr} useMap="#nodeSet"/> */}

                        <BpmnView key={newFlowImg} newFlowImg={newFlowImg} needEventOn={true}  getBpmnId={getElementIdByClick} query={query}/>
                        {/* {nodeSetFn(imgNode)} */}
                        <ul style={modalStyle} className="modalStyle">
                            {
                                nodeElement.map(item=>{
                                    if(item.type!=="EndEvent"&&item.id==nodeModalActId){
                                        return<><li onClick={basicClick.bind(this,nodeModalActId)}><p>基本信息</p></li>
                                                <li onClick={bpmnNameChange.bind(this)}><p>节点名称修改</p></li>
                                                {
                                                    nodeElement.map((item,index)=>{
                                                            if(item.id==nodeModalActId&&!item.isDraft){
                                                                return <li onClick={copyConfigClick.bind(this,nodeModalActId)}><p>配置复用至</p></li>
                                                            }
                                                    })
                                                }
                                           </>
                                    }
                                })
                            }
                            <li onClick={copyConfiguration.bind(this)}><p>复制配置</p></li>
                            {/* <li><p>引用模板</p></li> */}
                        </ul>
                        <ul style={ulStyle} className="ulStyle">
                            <li onClick={basicClick.bind(this,nodeModalActId)}><p>基本信息</p></li>
                            <li onClick={bpmnNameChange.bind(this)}><p>节点名称修改</p></li>
                            <li onClick={elutionClick.bind(this,nodeModalActId)}><p>流出顺序</p></li>
                        </ul>
                    </div>
            {/* </div> */}
            {/* {workflowNodeModal && (<WORKFLOW //流程节点修改
             //   loading={loading.global}
                onCancel={onCancel.bind(this)}
                location={location}
            />)} */}
            {nodeAttributeModal && (<NODEATTRIBUTE //基本信息
             //   loading={loading.global}
                onCancel={onCancel.bind(this)}
                query={query}
                nodeModalActId={nodeModalActId}
                setParentState={setParentState}
                parentState={parentState}
            />)}
            {gatewayModal && (<GATEWAY //网关判断
             //   loading={loading.global}
                onCancel={onCancel.bind(this)}
                query={query}
                setParentState={setParentState}
                parentState={parentState}
            />)}
            {/* {saveIssueModule && (<SAVELSSUE //模块资源
             //   loading={loading.global}
                menuLists={menuLists}
                onCancel={onCancel.bind(this)}
                location={location}
            />)} */}
            {
                nodeModalShow&&<NodeModal
                    onCancel={onCancel.bind(this)}
                    query={query}
                    setParentState={setParentState}
                    parentState={parentState}
                />
            }
            {
               isShowElution&& <ElutionOrderModal
               query={query}
               setParentState={setParentState}
               parentState={parentState}
               />
            }
            {
                isShowCopyConfig&&<CopyConfigModal
                  query={query}
                  nodeModalActId={nodeModalActId}
                  setParentState={setParentState}
                  parentState={parentState}
                />
            }
             {
                processSortModalShow&&<ProcessSortModal
                  procDefId={procDefId}
                  onCancel={onCancel.bind(this,'close')}
                  setParentState={setParentState}
                  parentState={parentState}
                  query={query}
                />
             }
             {
                 isShowConfigModal&&<ConfigReplication
                 query={query}
                  nodeModalActId={nodeModalActId}
                  nodeElement={nodeElement}
                  setParentState={setParentState}
                  parentState={parentState}
                />
             }
             {subModal&&<SubProcess 
                query={query}
                onSubCancel={onSubCancel}
                setParentState={setParentState}
                procDefId={procDefId}
                nodeObjId = {nodeValue.id}
                parentState={parentState}
             />}
            <GlobalModal
                visible={modalNode}
                widthType={3}
                title={`${nodeObj.name}-节点属性`}
                bodyStyle={{padding: '10px'}}
                onCancel={onCancel}
                mask={false}
                maskClosable={false}
                getContainer={() =>{
                return document.getElementById(`node_modal_${bizSolId}`)||false
                }}
                footer={false}
            >
                <EVENT
                  query={query}
                  eventNodeType={eventNodeType}
                  setParentState={setParentState}
                  parentState={parentState}
                />
            </GlobalModal>

        </div>

    )
}
export default connect(({applyModelConfig,layoutG})=>({
    applyModelConfig,
    layoutG
  }))(NodeSet);

