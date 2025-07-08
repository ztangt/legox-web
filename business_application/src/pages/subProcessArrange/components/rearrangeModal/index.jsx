// 重新编排
import React,{useEffect,useRef,useState} from 'react'
import {Button} from 'antd'
import { connect } from 'dva';
import GlobalModal from '../../../../componments/GlobalModal';
import ApplyTransfer from '../transfer'

const RearrangeModal = ({subRearrangeConfirm,rearrangeRef,handelCancel,leftRearrange,rightTargetKeys})=>{

    // 获取callback
    const rearrangeCallback = (value)=>{
        rearrangeRef.current = value
    }
    return (
        <GlobalModal
            title="子流程编排详情"
            visible={true}
            onOk={subRearrangeConfirm}
            onCancel={handelCancel}
            mask={false}
            bodyStyle={{padding:'16px'}}
            maskClosable={false}
            getContainer={() =>{
                return document.getElementById(`sub_container`)
            }}
            widthType={3}  
        >
            <ApplyTransfer treeData={leftRearrange} rightTargetKeys={rightTargetKeys} callback={rearrangeCallback}/>
        </GlobalModal>
    )
}

export default connect(({subProcessArrangeSpace})=>({subProcessArrangeSpace}))(RearrangeModal)