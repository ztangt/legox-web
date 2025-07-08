// 全局审核人查看
import React from 'react';
import { connect } from 'umi';
import GlobalModal from '../../../componments/GlobalModal';
import { Form, Input, Button } from 'antd';
import {dataFormat} from '../../../util/util'

const { TextArea } = Input;

const GlobalReviewerModal = ({containerId,onCancel,record})=>{
    const typeCheck = {
        'ORG': '单位审核人',
        'DEPT': '部门审核人'
    }
    return (
        <GlobalModal 
            title="查看审核人"  
            visible={true}
            onCancel={onCancel.bind(this)}
            maskClosable={false}
            mask={false}
            footer={false}
            widthType={1}
            getContainer={() => {
              return document.getElementById(containerId)||false;
            }}
        >   
         <Form
            name="globalViewer"
            labelCol={{
            span: 4,
            }}
            wrapperCol={{
            span: 18,
            }}
            initialValues={{
                checkerDesc: record.checkerDesc,
                checkName: record.checkerName,
                checkerProperty: record.checkerProperty=='PUBLIC'?'公共':'私有',
                checkerType: typeCheck[record.checkerType]
            }}
        >
            <Form.Item 
                label="审核人名称"
                name="checkName"
            >
                <Input disabled={true}/>

            </Form.Item>
            <Form.Item 
                label="属性"
                name="checkerProperty"
            >
                <Input  disabled={true}/>

            </Form.Item>
            <Form.Item 
                label="描述"
                name="checkerDesc"
            >
                <TextArea disabled={true}/>

            </Form.Item>
            <Form.Item 
                label="类型"
                name="checkerType"
            >
                 <Input disabled={true}/>

            </Form.Item>
          </Form>
        </GlobalModal>
    )
}

export default connect(((relationUserModel)=>(relationUserModel)))(GlobalReviewerModal)