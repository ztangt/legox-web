import {Button,Modal,Input, message,Form,Row} from 'antd';
import {connect,history} from 'umi';
import {useState,useEffect,useRef} from 'react';
import GlobalModal from '../../../componments/GlobalModal';

const NodeModalChangeName = ({query,dispatch,loading,onCancel,parentState,setParentState})=>{
    const {nodeValue,procDefId} = parentState
    const {bizSolId} = query;
    const [form] = Form.useForm()
    const formRef = useRef({})
    const onFinish = (values)=>{
        dispatch({
            type: 'applyModelConfig/nodeChangeName',
            payload: {
                procDefId,
                actId: nodeValue.id,
                actName: values.nameNode
            },
            extraParams:{
              setState:setParentState,
              state:parentState
            }
        })

        // dispatch({
        //     type: 'applyModelConfig/updateStates',
        //     payload: {
        //         nodeValue: {
        //             nameNode: values.nameNode,
        //             id: nodeChange.id
        //         }
        //     }
        // })
        onCancel()
    }
    const onConfirm = ()=>{
        formRef.current.submit();
    }

    return (
        <GlobalModal
            visible={true}
            widthType={5}
            title={`节点修改`}
            bodyStyle={{padding: '10px',overflow:'hidden'}}
            incomingHeight={260}
            onCancel={onCancel}
            mask={false}
            maskClosable={false}
            getContainer={() =>{
                return document.getElementById(`node_modal_${bizSolId}`)||false
            }}
            footer={
                [
                    <Button onClick={onCancel} style={{ marginLeft: 8 }}>
                        取消
                    </Button>,
                    <Button type="primary" onClick={onConfirm} loading={loading}>
                        保存
                    </Button>
                ]
            }
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
                    rules={[{ required: true, message: '节点名称不能为空' },{max:50}]}
                    >
                    <Input/>
                </Form.Item>
            </Form>
        </GlobalModal>
    )
}

export default connect(({applyModelConfig})=>({
    applyModelConfig
  }))(NodeModalChangeName);
