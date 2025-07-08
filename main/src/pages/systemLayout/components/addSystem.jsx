import React from 'react'
import {connect} from 'dva'
import {Modal,Form,Input,Button} from 'antd'
import GlobalModal from '../../../componments/GlobalModal';
import pinyinUtil from '../../../service/pinyinUtil';
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
 function addSystem({dispatch,systemLayout}) {
   const {detailData}=systemLayout
   console.log(detailData,'detailData');
    const [form] = Form.useForm();
     const onCancel=()=>{
        dispatch({
            type:'systemLayout/updateStates',
            payload:{
              isAddSystem:false,
              detailData:{}
            }
          })
     }
      //输入完名称后获取简拼
  function nameCallback(e) {
      let name = `${pinyinUtil.getFirstLetter(e.target.value)}`
      form.setFieldsValue({
        registerTag: name,
        registerCode: name,
      });
  }
  const onFinish=(values)=>{
console.log(values,'values');
    if(detailData.id){
      dispatch({
        type:'systemLayout/updateRegister',
        payload:{
          id:detailData.id,
          registerName:values.registerName,
          registerCode:values.registerCode,
          registerDesc:values.registerDesc,
          registerTag:values.registerTag,
        }
      })
    }else{
      dispatch({
        type:'systemLayout/addRegister',
        payload:{
          registerName:values.registerName,
          registerCode:values.registerCode,
          registerDesc:values.registerDesc,
          registerTag:values.registerTag,
        }
      })
    }
    onCancel()
  }
  // 校验
  const checkCode=(_,value)=>{
    let reg = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    if(value&&value.length>50){
      return Promise.reject(new Error('长度不能超过50!'))
    }else if(value&&!reg.test(value)){
      return Promise.reject(new Error('只能输入字母、数字、下划线，且首位必须是字母!'))
    }else{
      return Promise.resolve();
    }
  }  

  return (
    <div>
        <GlobalModal
        title={detailData.id?'修改系统':'新增系统'}
        visible={true}
        widthType={4}
        onCancel={onCancel}
        maskClosable={false}
        mask={false}
        getContainer={() =>{
            return document.getElementById('systemLayout_container')||false
        }}
        footer={[
          <Button key="cancel" onClick={onCancel}>取消</Button>,
          <Button key="submit" type="primary"  htmlType={"submit"} onClick={()=>{form.submit()}}>
            保存
          </Button>,
        ]}
        >
            <Form {...layout}
            form={form}
            onFinish={onFinish.bind(this)}
            initialValues={detailData}
            >
                <Form.Item
                label='系统名称'
                rules={[
                  {
                    required: true
                  }
                ]}
                name='registerName'
                >
                    <Input onChange={nameCallback.bind(this)}/>
                </Form.Item>
                <Form.Item
                label='系统简称'
                name='registerTag'
                >
                     <Input/>
                </Form.Item>
                <Form.Item
                label='系统编码'
                rules={[
                  {
                    required: true,
                    message: '请输入系统编码!'
                  },
                  {
                    validator: checkCode
                  }
                ]}
                name='registerCode'
                >
                     <Input disabled={detailData.id?true:false}/>
                </Form.Item>
                <Form.Item
                label='系统描述'
                rules={[
                  {
                    required: true,
                    message: '请输入系统描述'
                  }
                ]}
                name='registerDesc'
                >
                     <Input/>
                </Form.Item>
            </Form>
        </GlobalModal>
    </div>
  )
}
export default connect(({ systemLayout}) => ({systemLayout}))(addSystem);
