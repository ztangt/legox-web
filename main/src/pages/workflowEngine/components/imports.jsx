import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'dva'
import {
  Modal,
  Input,
  Button,
  Form,
  Row,
  TreeSelect
} from 'antd'
import _ from 'lodash'
import pinyinUtil from '../../../service/pinyinUtil'
import GlobalModal from '../../../componments/GlobalModal'
import { history,useSelector } from 'umi';
const FormItem = Form.Item
const layout = { labelCol: { span: 4 }, wrapperCol: { span: 18 } }
const { TextArea } = Input;
function Index({ onCancel, onSubmit, loading, importForm, dispatch,filePreValue,fileCodeValue,refInstance}) {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {businessDatas} = useSelector(({businessUseSort})=>({...businessUseSort}))
  const {needfilepath,merageFilepath,md5FilePath} = useSelector(({workflowEngine})=>({...workflowEngine}))
  console.log(needfilepath,md5FilePath)
    const formRef = useRef(null)
    const initForms = {
      formName: filePreValue,
      formCode: pinyinUtil.getFirstLetter(fileCodeValue, false),
      ...importForm
    }
    React.useImperativeHandle(refInstance, () => ({
        // 构造ref的获取数据方法
        showModal: async () => {
              setIsModalVisible(true);
          },
    }));
    useEffect(()=>{
        dispatch({
            type: 'businessUseSort/getCtlgTree',
            payload:{
                type:'ALL',
                hasPermission:'1'
            }
        })
    },[])
    const onConfirm = ()=>{
      formRef.current.submit()
    }
  function onFinish(values) {
    if(!values?.formCode||!values?.formName){
      return
    }
    dispatch({
        type: 'workflowEngine/importModel',
        payload: {
            modelName: values.formName,
            modelKey: values.formCode,
            description: values.description,
            ctlgId: values.useType,
            xmlFilePath: md5FilePath||needfilepath
        },
        callback(value){
          if(!value||!value.includes('已存在')){
            handleCancel()
          }
        }
    })

  }

  function onChange(e) {
    const changeValue = e.target.value
    form.setFieldsValue({
      formCode: pinyinUtil.getFirstLetter(changeValue, false),
    })
  }
  const checkForm=(_,value)=>{
    let reg = /^[\a-\z\A-\Z0-9\u4e00-\u9fe5]+$/
    if(value&&(!reg.test(value))){
      return Promise.reject(new Error(`只能输入汉字、英文、数字`))
    }else{
      return Promise.resolve()
    }
  }
  const checkFormCode=(_,value)=>{
    var regCode = /^[a-zA-Z][a-zA-Z0-9]*$/;
    //且汉字字母数字下划线
    if(value&&!regCode.test(value)){
      return Promise.reject(new Error('只能输入字母+数字，且首位必须是字母!'))
    }else{
      return Promise.resolve();
    }
  }
  const handleCancel = ()=>{
    setIsModalVisible(false)
    formRef.current.resetFields()
  }
    //   树状选中
  const onSelect = (selectedKeys,info)=>{
    let newArr = [];
    newArr.push(selectedKeys)
    if(info.nodeId){

        dispatch({
          type: 'workflowEngine/updateStates',
          payload:{
            currentNode: info,
            expandedKeys: newArr,
            autoExpandParent: true,
          }
        })
    }
  }

  return (
    <GlobalModal
      visible={isModalVisible}
      widthType={2}
      footer={[
        <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
            取消
        </Button>,
        <Button type="primary" onClick={onConfirm} loading={loading}>
            保存
        </Button>
      ]}
      incomingHeight={320}
      title={'流程导入'}
      onCancel={handleCancel}
      maskClosable={false}
      mask={false}
      getContainer={() =>{
        return document.getElementById('workflowEngine_container')||false
    }}
    >
      <Form form={form} ref={formRef} onFinish={onFinish} initialValues={initForms}>
        <Form.Item
          {...layout}
          label="名称"
          name="formName"
          rules={[{ required: true, message: '请输入名称' },
          {max: 50,message: '最多输入50个字符!'},
          {validator:checkForm}
          ]}
        >
          <Input
            onChange={onChange}
          />
        </Form.Item>

        <Form.Item
          {...layout}
          label="编码"
          name="formCode"
          rules={[{ required: true, message: '请输入编码' },
          {max: 50,message: '长度不能超过50!'},
          {validator:checkFormCode},
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
            label="应用分类"
            name="useType"
            {...layout}
            rules={[{ required: true, message: '请选择分类' }]}
        >
            <TreeSelect
                showSearch
                treeData={businessDatas.length>0&&businessDatas}
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择"
                allowClear
                onSelect={onSelect}
                />
        </Form.Item>
        <Form.Item
          {...layout}
          label="描述"
          name="description"
          rules={[
            {  message: '请输入描述' },
            { max: 200,message:'最多输入200个字符'}
          ]}
        >
          <TextArea />
        </Form.Item>

        {/* <Row style={{ width: 200, margin: '20px auto' }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存
          </Button>
          <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
            取消
          </Button>
        </Row> */}
      </Form>
    </GlobalModal>
  )
}
Index =  connect(({businessUseSort,workflowEngine})=>({
    ...businessUseSort,
    ...workflowEngine
  }))(Index);

export default React.forwardRef((props,ref)=><Index {...props} refInstance={ref}/>)
