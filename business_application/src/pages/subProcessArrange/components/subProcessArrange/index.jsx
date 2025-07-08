import React,{useEffect,useRef,useState} from 'react'
import {Button,message,Empty} from 'antd'
import { connect } from 'dva';
import Header from '../header';
import ReSizeLeftRightCss from '../../../../componments/public/reSizeLeftRight';
import BpmnView from '../../../../componments/BpmnView/bpmnShow'
import ColumnDragTable from '../../../../componments/columnDragTable'
import ApplyModal from '../applyModal'
import ProcessDetailModal from '../processDetailModal';
import RearrangeModal from '../rearrangeModal'
import Tree from './tree'
import {subProcessConfig} from '../configs'
import pluse from '../../../../../public/assets/pluse.svg'
import minus from '../../../../../public/assets/minus.svg'
import styles from '../../index.less'

const SubProcess = ({dispatch,subProcessArrangeSpace})=>{
    const {newFlowImg,subProcessList,bizSolId,formDeployId,procDefId,targetKeys,mainPageCurrentNode,applySelectedRowKeys} = subProcessArrangeSpace
    const [processId,setProcessId] = useState('')
    const [applyShow,setApplyShow] = useState(false) // applyModal弹窗
    const [processShow,setProcessShow] = useState(false) // 详情弹窗
    const [rearrange,setRearrange] = useState(false) // 重新编排
    const [leftRearrange,setLeftRearrange] = useState([]) // 左侧编排数据
    const [rightTargetKeys,setRightTargetKeys] = useState([]) // 右侧选中列表
    const [actId,setActId] = useState('') //actId
    const [isActive,setIsActive] = useState(true) // 关闭弹窗
    // const [orgId,setOrgId] = useState('') //orgId

    const treeRef = useRef(null)
    const selectRef = useRef([])
    const bpmnRef = useRef(null)

    useEffect(() => {
        getTreeList()
        initCurrentNode()
    }, []);
    const initCurrentNode = ()=>{
        dispatch({
            type: 'subProcessArrangeSpace/updateStates',
            payload: {
                mainPageCurrentNode: {},
                applySelectedRowKeys:[],
                newFlowImg: '',
                subProcessList:[],
                bizSolId: '',
                formDeployId: '',
                procDefId: '',
            }
        })
    }
    // 获取树列表
    const getTreeList = ()=>{
        dispatch({
            type: 'subProcessArrangeSpace/getTreeList',
            payload: {
                parentId: '',
                orgKind: 'ORG',
                searchWord: ''
            }
        })
    }
    /**
     * bizSolId: '1701832110623514625',
        orgId: '1557620574870659000'
     * 
    */
    // 获取流程数据
    const getXmlData = ()=>{
        if(applySelectedRowKeys.length==0){
            return 
        }
        if(!treeRef.current){
            return 
        }
        console.log("222222222",treeRef.current,"applySelectedRowKeys",applySelectedRowKeys)
        dispatch({
            type: 'subProcessArrangeSpace/getBpmnXml',
            payload:{
                bizSolId: applySelectedRowKeys[0],
                orgId:treeRef.current
            },
            callback(){
                setApplyShow(false)
            }
        })
    }
    // // 搜素
    // const onSearch = (value)=>{
    //     console.log("value00",value)
    // }
    // 聚焦
    const onClickApplyModal = ()=>{
        if(!treeRef.current){
            message.error('请选择左侧单位树')
            return 
        }
        dispatch({
            type: 'subProcessArrangeSpace/updateStates',
            payload: {
                businessList: [],
                iTreeSelectedId: '',
                returnCount: 0,
            }
        })
        setApplyShow(true)
    }
    // 切换树设置默认
    const getData= (data)=>{
        dispatch({
            type: 'subProcessArrangeSpace/updateStates',
            payload:{
                applySelectedRowKeys:[],
                newFlowImg: '',
                subProcessList:[],
                bizSolId: '',
                formDeployId: '',
                procDefId: '',
            }
        })      
        // getXmlData()
        //  setOrgId(data.id) 
        treeRef.current = data.id
    }

    // 左侧树
    const leftRender = ()=>{
          return (
            <Tree
                nodeType="ORG"
                isShowSearch={true}
                plst="请输入单位名称、编码"
                getData={getData}
                checkable={false}
                mainPageCurrentNode={mainPageCurrentNode}
          />
          )
    }
    // 获取element的回调
    const  getElementIdByClick = (id,element)=>{
        console.log("elementclick",id,element)
        setProcessId(id)
        setIsActive(true)
    }
     // 关闭applyModal弹窗
     const handelCancel = ()=>{
        setApplyShow(false)
        setProcessShow(false)
        setRearrange(false)
        selectRef.current = []
        dispatch({
            type: 'subProcessArrangeSpace/updateStates',
            payload: {
                changeStatus: false,
                iTreeSelectedId: '',
                actives: '1',
            }
        })
    } 
    // applyModal确认
    const applyConfirm = ()=>{
        getXmlData()
    }
    // 子流程重新编排确认
    const subRearrangeConfirm = ()=>{
        console.log("current",selectRef.current)
        console.log("leftRearrange",leftRearrange) 
        
        const arr = [];
        if(selectRef.current.length>0){
            selectRef.current.forEach(item=>{
                leftRearrange.forEach(cur=>{
                    if(item==cur.actId){
                        arr.push({
                            actId: cur.actId,
                            actName: cur.actName
                        })
                    }
                })
            })
        }
        
        console.log("arr999",arr)  
        dispatch({
            type: 'subProcessArrangeSpace/postChoreography',
            payload: {
                bizSolId,
                formDeployId,
                procDefId,
                orgId:treeRef.current,
                subProcessId: processId,
                choreographyList: arr||[]
            },
            callback(){
                handelCancel()
                getXmlData()
            }
        })  
    }

    // 点击流程
    const clickProcess = (item)=>{
        setProcessId(item.subProcessId)
        if(processId != item.subProcessId){
            setIsActive(true)
            return 
        }
        setIsActive(!isActive)
    }   
    // 重新编排
    const reuseEdit = (reset)=>{
        setRearrange(true)
        setIsActive(true)
        const nowReuse = reset.children&&reset.children.map(item=>{
            item.key = item.actId
            item.title = item.actName
            return item
        })||[]
        const targetKeys = reset.choreographyList&&reset.choreographyList.map(item=>{
            return item.actId
        })||[] 
        setRightTargetKeys(targetKeys)
        setLeftRearrange(nowReuse)
        setProcessId(reset.subProcessId)
    }
    // 点击配置
    const configAction = (record)=>{
        setProcessShow(true)
        setActId(record.actId)
    }

    // applyModal配置
    const applyConfig = {
        handelCancel,
        applyConfirm,
        orgId: treeRef.current
    }    
    
    //办理详情配置
    const detailConfig = {
        handelCancel,
        actId,
        bizSolId,
        procDefId,
        formDeployId,
        orgId: treeRef.current,
    }
    // 子流程编排配置
    const rearrangeConfig = {
        handelCancel,
        subRearrangeConfirm,
        leftRearrange,
        rearrangeRef: selectRef,
        rightTargetKeys    
    }
   
    // console.log("processId99",processId)
    return (
        <div className={styles.container} id="sub_container">
            <div className={styles.sub_content}>
                <ReSizeLeftRightCss
                    suffix={'subProcessArrangeSpace'}
                    vLeftNumLimit={238}
                    vNum={238}
                    leftChildren={leftRender()}
                    rightChildren={
                        <div className={styles.right_content}>
                            <div className={styles.right_button}>
                                <div></div>
                                <div>
                                    <Button style={{width:100}} onClick={onClickApplyModal}>选择应用建模</Button>
                                </div>
                            </div>
                            <div className={styles.right_header} style={{height:subProcessList&&subProcessList.length>0?'270px':'100%'}}>
                                {newFlowImg?<BpmnView key={newFlowImg} processId={processId} isActive={isActive} getBpmnId={getElementIdByClick} bpmnRef={bpmnRef} isSub={true} newFlowImg={newFlowImg} query={{bizSolId:applySelectedRowKeys[0]}}/>:
                                <p style={{textAlign:'center',display:'flex',justifyContent:'center',height:'100%',alignItems:'center', width: '100%',color:'gray'}}>
                                    {/* 暂无流程 */}
                                    {/* border:'1px solid #EFF2FF', */}
                                    <div>
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                                        <div className={styles.chose_module} onClick={onClickApplyModal}>请选择应用建模</div>
                                    </div>
                                </p>}
                            </div>
                            <div className={styles.right_table}>
                                {
                                  subProcessList&&subProcessList.map((item,_index)=>(
                                    <div key={item.subProcessId} className={isActive?styles.active_tab:styles.table_box}>
                                        <div className={styles.header} >
                                            <div className={styles.sub_header_name} onClick={()=>clickProcess(item)}>
                                                {isActive&&item.subProcessId==processId?<img className={styles.sub_header_img} src={minus}/>:<img className={styles.sub_header_img} src={pluse} />}
                                                {item.subProcessName}
                                            </div>
                                            <Button className={styles.button_reset} onClick={()=>reuseEdit(item)}>重新编排</Button>
                                        </div>
                                        <div className={styles.table_content}
                                          style={{display:item.subProcessId==processId?'block':'none'}}  
                                        >
                                            <ColumnDragTable 
                                                taskType = {'MONITOR'}
                                                rowKey={'actId'}
                                                pagination={false}
                                                style={{display:isActive?'block':'none'}}
                                                columns={subProcessConfig({configAction}).columns}
                                                key={processId}
                                                dataSource={item.choreographyList||[]}
                                                // scroll={{y:160}}
                                            />
                                        </div>
                                    </div>
                                  ))  
                                }
                            </div>
                        </div>
                    }
                />
            </div>
            {
                applyShow&&<ApplyModal {...applyConfig}/>
            }
            {
                processShow&&<ProcessDetailModal {...detailConfig}/>
            }
            {
               rearrange&&<RearrangeModal {...rearrangeConfig}/>
            }
        </div>
    )
}

export default connect(({ subProcessArrangeSpace }) => ({
    subProcessArrangeSpace,
  }))(SubProcess);
  