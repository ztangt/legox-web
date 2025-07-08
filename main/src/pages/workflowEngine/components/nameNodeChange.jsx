import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import {
  Modal,
  Input,
  Button,
  Form,
  Row,
  TreeSelect,
  Col,
  message
} from 'antd'
import {useSelector} from 'umi'
import BpmnView from '../../applyModelConfig/componments/bpmnView'
import NodeModal from './nodeModal'
import GlobalModal from '../../../componments/GlobalModal'
import styles from '../index.less'

const ChangeNodeName = ({dispatch,onCancel,loading,flowXmlStr,nodeRecord})=>{
    const [nodeValue,setNodeValue] = useState({})
    const [modalStyle,setModalStyle] = useState({display:'none'});
    const {nodeNameChange} = useSelector(({workflowEngine})=>({...workflowEngine}))

    const getElementIdByClick = (id,element)=>{
        setNodeValue({
            id,
            nameNode: element&&element.element&&element.element.businessObject.name
        })

        let x = element.originalEvent.layerX + 'px';
        let y = element.originalEvent.layerY + 'px';
        let styles = {
            display:'block',
            left:x,
            top:y
        }
        setModalStyle(styles);
        // dispatch({
        //     type:"applyModelConfig/updateStates",
        //     payload:{
        //         nodeModalActId:id,//当前节点,不直接复制成actId,是想着节点改变的时候才显示基本信息弹框
        //     }
        // })
    }
    const bpmnNameChange=()=>{
        setModalStyle({display:'none'})//不显示弹框
        dispatch({
            type: 'workflowEngine/updateStates',
            payload: {
                nodeNameChange: true,
                nodeValue
            }
        })
    }
    const onClose = ()=>{
        dispatch({
            type: 'workflowEngine/updateStates',
            payload: {
                nodeNameChange: false
            }
        })
    }

    return (
        <GlobalModal
            visible={true}
            footer={false}
            widthType={1}
            title={'节点名称修改'}
            onCancel={onCancel}
            className={styles.add_form}
            mask={false}
            maskClosable={false}
            getContainer={() =>{
                return document.getElementById('workflowEngine_container')||false
            }}
        >
            <div className={styles.nodeContent}>
                <BpmnView key={flowXmlStr} query={{bizSolId:nodeRecord.id}} newFlowImg={flowXmlStr} needEventOn={true}  getBpmnId={getElementIdByClick}/>
                <ul style={modalStyle} className={styles.modalStyle}>
                {/* <li onClick={basicClick.bind(this,nodeModalActId)}><p>基本信息</p></li> */}
                    <li onClick={bpmnNameChange.bind(this)}><p>节点名称修改</p></li>
                    {/* <li><p>配置复用至</p></li>
                    <li><p>引用模板</p></li> */}
                </ul>
            </div>
            {nodeNameChange&&<NodeModal onCancel={onClose}/>}
        </GlobalModal>
    )
}

export default connect(({workflowEngine,layoutG})=>({...workflowEngine,...layoutG}))(ChangeNodeName)
