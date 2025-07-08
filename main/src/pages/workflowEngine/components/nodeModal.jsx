import {Button,Modal,Input, message,Form,Row} from 'antd';
import {connect,history,useSelector} from 'umi';
import {useState,useEffect,useRef} from 'react';
import GlobalModal from '../../../componments/GlobalModal';

const NodeModalChangeName = ({dispatch,loading,onCancel})=>{
    const {nodeValue,procDefId} = useSelector(({workflowEngine})=>({...workflowEngine}))

    const [form] = Form.useForm()
    const formRef = useRef({})
    const onFinish = (values)=>{
        dispatch({
            type: 'workflowEngine/nodeChangeName',
            payload: {
                procDefId,
                actId: nodeValue.id,
                actName: values.nameNode
            }
        })
        onCancel()
    }
    // 确定
    const onConfirm = ()=>{
        formRef.current.submit()
    }
    return (
        <GlobalModal
            visible={true}
            widthType={5}
            title={`节点修改`}
            bodyStyle={{padding: '10px',overflow:'hidden'}}
            onCancel={onCancel}
            mask={false}
            maskClosable={false}
            getContainer={() =>{
            return document.getElementById('workflowEngine_container')||false
            }}
            footer={[
                <Button onClick={onCancel} style={{ marginLeft: 8 }}>
                    取消
                </Button>,
                <Button type="primary" onClick={onConfirm} loading={loading}>
                    保存
                </Button>
            ]}
        >

            <Form form={form} ref={formRef} onFinish={onFinish} initialValues={nodeValue}>
                <Form.Item
                    label="节点ID"
                    >
                   {nodeValue.id}
                </Form.Item>
                <Form.Item
                    label="节点名称"
                    name="nameNode"
                    rules={[
                        { required: true, message: '节点名称不能为空' },
                        {
                            max:50, message: '名称长度不超过50'
                        }
                    ]}
                    >
                    <Input maxLength={50}/>
                </Form.Item>
            </Form>
        </GlobalModal>
    )
}

export default connect(({workFlowEngine,layoutG})=>({
    workFlowEngine,
    layoutG
  }))(NodeModalChangeName);
