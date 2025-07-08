import React, { useState, useEffect,useRef } from 'react'
import { connect } from 'dva'
import {
  Modal,
  Input,
  Button,
  Form,
  Row,
  TreeSelect,
  Col
} from 'antd'
import _ from 'lodash'
import pinyinUtil from '../../../service/pinyinUtil'
import GlobalModal from '../../../componments/GlobalModal'
import { history,useSelector } from 'umi';
const FormItem = Form.Item
const layout = { labelCol: { span: 3 }, wrapperCol: { span: 22 } }
const {TextArea} = Input
function Index({ onCancel, onSubmit, loading, dispatch,refInstance}) {
  const [form] = Form.useForm()
  const getRefs = useRef({})
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {businessDatas} = useSelector(({businessUseSort})=>({...businessUseSort}))
  const {addObj}= useSelector(({workflowEngine})=>({...workflowEngine}))
    React.useImperativeHandle(refInstance, () => ({
        // 构造ref的获取数据方法
        showModalCopy: async () => {
                setIsModalVisible(true);
            }
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

  function onFinish(values) {
        dispatch({
            type: 'workflowEngine/copyModel',
            payload: {
            id: addObj.id,
            ctlgId: values.useType,
            modelName: values.formName,
            modelKey: values.formCode,
            description: values.description
            },
            callback:()=>{
              handleCancel()
            }
      })
  }

  function onChange(e) {
    form.setFieldsValue({
      formCode: pinyinUtil.getFirstLetter(e.target.value, false),
    })
  }
  const checkForm=(_,value)=>{
    // let reg = /^[a-zA-Z\u4e00-\u9fa5]{1}.*$/;
    // let regAll = /^[a-zA-Z0-9_\u4e00-\u9fa5]*$/;
    //且汉字字母数字下划线
    // if(value&&!reg.test(value)){
    //   return Promise.reject(new Error('汉字、字母开头,支持（汉字、字母、数字、下划线）'))
    // }else if(value&&!regAll.test(value)){
    //   return Promise.reject(new Error('汉字、字母开头,支持（汉字、字母、数字、下划线）'))
    // }else{
    //   return Promise.resolve();
    // }
    let regTest = /^[\a-\z\A-\Z0-9\u4e00-\u9fe5]+$/
    if(value&&(!regTest.test(value))){
      return Promise.reject(new Error(`只能输入汉字、英文、数字`))
    }else{
      return Promise.resolve()
    }
  }
  const checkFormCode=(_,value)=>{
    // /^[A-Z][A-Z0-9_]*$/
    var regCode = /^[a-zA-Z][a-zA-Z0-9]*$/;
    //且汉字字母数字下划线
    if(value&&!regCode.test(value)){
      return Promise.reject(new Error('只能输入字母+数字，且首位必须是字母!'))
    }else{
      return Promise.resolve();
    }
  }
  // 取消关闭
  const handleCancel = ()=>{
    setIsModalVisible(false)
    form.setFieldsValue({
        formCode: '',
        formName:'',
        description: ''
      })
  }
  // 确定
  const onConfirm = ()=>{
    getRefs.current.submit()
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
      title={'流程模型管理'}
      onCancel={handleCancel}
      maskClosable={false}
      incomingHeight={360}
      mask={false}
      getContainer={() =>{
        return document.getElementById('workflowEngine_container')||false
    }}
    footer={[
      <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
          取消
      </Button>,
      <Button type="primary" onClick={onConfirm} loading={loading}>
          保存
      </Button>
    ]}
    >
      <Form form={form} ref={getRefs} onFinish={onFinish} initialValues={addObj}>
        <Row>
            <Col span={12}>
                <Form.Item
                label="源名称"
                >
                {decodeURI(addObj.modelName)}
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                label="源编码"
                >
                {addObj.modelKey}
                </Form.Item>
            </Col>
        </Row>
        <Row>
            <Col span={12}>
                <Form.Item
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
            </Col>
            <Col span={12}>
                <Form.Item
                    label="编码"
                    name="formCode"
                    rules={[{ required: true, message: '请输入编码' },
                    {max: 50,message: '长度不能超过50!'},
                    {validator:checkFormCode},
                    ]}
                    >
                    <Input />
                </Form.Item>
            </Col>
        </Row>

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
            { message: '请输入描述' },
            {max: 200,message: '最多输入200个字符!'},
          ]}
        >
          <TextArea />
        </Form.Item>
        <div style={{marginLeft:'8%',fontSize: 12}}>
            注: 复制当前流程主版本
        </div>
      </Form>
    </GlobalModal>
  )
}
Index =  connect(({businessUseSort,workflowEngine})=>({
    ...businessUseSort,
    ...workflowEngine
  }))(Index);

export default React.forwardRef((props,ref)=><Index {...props} refInstance={ref}/>)
