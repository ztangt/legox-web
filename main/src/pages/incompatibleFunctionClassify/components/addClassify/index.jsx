import React,{useState,useRef,useEffect} from 'react'
import {Modal,Form,Input,Switch } from 'antd'
import GlobalModal from '../../../../componments/GlobalModal'
import pinyinUtil from '../../../../service/pinyinUtil'; 
import {connect} from 'dva'
import styles from '../../index.less'
const {TextArea } = Input

// 新增模块
const AddClassifyComponent = ({dispatch,handleCancel,handleConfirm,callback,getFormRef,editType,editData,onlyWatch})=>{
    const formRef = useRef({})
    const [form] = Form.useForm();
    useEffect(()=>{
        if (formRef) {
            getFormRef && getFormRef(formRef);
        }
        return ()=>false
    },[])
    // 结束
    const onFinish = (value)=>{
        if(value){
            callback(value)
        }
    }
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
    };
    const wrapper = {
        wrapperCol: {
            span: 10
        }
    }
    // 职能分类名称规则显示
    const functionNameChange = (e)=>{
        if(!editType){
            let name = `${pinyinUtil.getFirstLetter(e.target.value)}`
            form.setFieldsValue({
                functionTypeCode: name,
            });
        }
    }

    // 校验编码规则
   const checkCode=(_,value)=>{
    let reg = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    if(!value){
      return Promise.reject(new Error('请输入编码规则'))
    }else if(value&&!reg.test(value)){
      return Promise.reject(new Error('只能输入字母、数字、下划线，且首位必须是字母'))
    }else{
      return Promise.resolve();
    }
  }

    return (
        <GlobalModal 
            title={editType?'编辑':"新增"}
            widthType={2}
            visible={true}
            mask={false}
            onCancel={handleCancel}
            onOk={handleConfirm}
            maskClosable={false}
            getContainer={() =>{
                return  document.getElementById('incompatibleFunction')||false
            }}
        >
            <Form
                form={form}
                ref={formRef}
                onFinish={onFinish}
                className={styles.form_classify}
                initialValues={
                    editType? {...editData}:{
                        isEnable: true
                    }
                }
                {...layout}
            >
                <Form.Item 
                    label="职能分类名称"
                    name="functionTypeName"
                    {...wrapper}
                    rules={[{
                        required: true,
                    }]} 
                >
                    <Input onChange={functionNameChange} disabled={onlyWatch}/>
                </Form.Item>   
                <Form.Item 
                    label="职能分类编码"
                    name="functionTypeCode"
                    {...wrapper}
                    rules={[
                        {
                        required: true,
                        validator:checkCode
                        },
                    ]} 
                >
                    <Input disabled={onlyWatch?true:editType?true:false}/>
                </Form.Item>    
                <Form.Item 
                    label="职能分类描述"
                    name="functionTypeDesc"
                >
                    <TextArea 
                       disabled={onlyWatch}
                       style={{
                            height: 105,
                            resize: 'none',
                        }} 
                    />
                </Form.Item>
                <Form.Item 
                    label="是否启用"
                    name="isEnable"
                >
                    <Switch checkedChildren="开启" disabled={onlyWatch} unCheckedChildren="关闭" defaultChecked={editType?editData.isEnable:true}/>
                </Form.Item>    

            </Form>

        </GlobalModal>
    )
}

export default connect(({functionClassifySpace})=>({functionClassifySpace}))(AddClassifyComponent) 