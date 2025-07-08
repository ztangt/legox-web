import React from 'react';
import {connect} from 'dva';
import {Modal,Form,Button,Input,Select} from 'antd';
import pinyinUtil from '../../service/pinyinUtil';
import GlobalModal from '../GlobalModal';
import {history} from 'umi'
const {Option} = Select;
const {TextArea} = Input;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
function AddUpdateModal({location,dispatch,role,loading,layoutG,pathname,isView,setIsView}){
  const [form] = Form.useForm();
  // const pathname=location.pathname;
  const {searchObj }=role;
  const {roleInfo,roleType,copyRoleId,selectOrgId,selectNodeCode}=searchObj[pathname];
  const cancelHandle=()=>{
    setIsView(false)
    dispatch({
      type:"role/updateStates",
      payload:{
        isShowAddModal:false,
        roleInfo:[]
      }
    })
  }
  //提交
  const onFinish=(values)=>{
    for(let key in values){
      if(typeof values[key]=='string'&&key!='roleDesc'){
        values[key] = values[key].trim()
      }
    }
    if(roleInfo.id){//修改
      dispatch({
        type:'role/updateRole',
        payload:{
          ...values,
          isEnable:0,
          roleType:roleType,
          id:roleInfo.id,
          orgCode:selectNodeCode
        },
        pathname:pathname
      })
    }else{
      if(copyRoleId){//复制
        dispatch({
          type:'role/copyRole',
          payload:{
            ...values,
            roleId:copyRoleId,
            orgCode:selectNodeCode
          },
          pathname:pathname
        })
      }else{//新增
        dispatch({
          type:'role/addRole',
          payload:{
            ...values,
            isEnable:0,
            roleType:roleType,
            orgId:selectOrgId,
            orgCode:selectNodeCode
          },
          pathname:pathname
        })
      }
    }
  }
  const onValuesChange=(changedValues, allValues)=>{
    dispatch({
      type:"role/updateStates",
      payload:{
        roleInfo:{...roleInfo,...allValues}
      }
    })
  }
  function onChangeName(e){
    if(e.target.value&&!roleInfo.id){
        form.setFieldsValue({'roleCode': pinyinUtil.getFirstLetter(e.target.value,false)})
    }
  }
  //验证code
  const validatorCode=(rule, value)=>{
    let reg=/^[0-9a-zA-Z_]*$/;
    if(value&&!reg.test(value)){
      return Promise.reject(new Error('字符格式：数字、字母、下划线'));
    }else{
      return Promise.resolve();
    }
  }
  return (
    <GlobalModal
      visible={true}
      title={isView?'查看角色':roleInfo.id?'修改角色':(copyRoleId?'复制角色':'新增角色')}
      widthType={4}
      onCancel={cancelHandle}
      maskClosable={false}
      mask={false}
      centered
      getContainer={() =>{
        return document.getElementById(`${pathname.split("/")[1]}_container`)||false
      }}
      footer={!isView&&[
        <Button key="cancel" onClick={cancelHandle}>
        取消
      </Button>,
        <Button key="submit" type="primary" loading={loading.global} htmlType={"submit"} onClick={()=>{form.submit()}}>
        保存
      </Button>
      ]}
    >
      <Form
        {...layout}
        form={form}
        name={`${pathname.split("/")[1]}_role`}
        initialValues={{
          roleName:roleInfo.roleName,
          roleCode:roleInfo.roleCode,
          roleDesc:roleInfo.roleDesc,
          roleTag:roleInfo.roleTag,
          orgRoleType:roleInfo.orgRoleType?roleInfo.orgRoleType:1
        }}
        onFinish={onFinish.bind(this)}
        onValuesChange={onValuesChange}
      >
        <Form.Item
          label="角色名称"
          name="roleName"
          rules={[{ required: true, message: '请输入角色名称!' },
            {max:50, message: '名称长度不能超过50!' },
            {whitespace:true,message: '请输入角色名称!'}
          ]}
        >
          <Input onChange={onChangeName} disabled={isView?true:false}/>
        </Form.Item>
        {selectOrgId?<Form.Item
          label="角色类型"
          name="orgRoleType"
          rules={[{ required: true, message: '请选择角色类型!' }
        ]}
        >
          <Select disabled={roleInfo.id?true:false}>
            <Option value={1}>自有</Option>
            <Option value={2}>公共</Option>
          </Select>
        </Form.Item>:null}
        <Form.Item
          label="角色编码"
          name="roleCode"
          rules={[{ required: true, message: '请输入角色编码!' },
            {max:50, message: '编码长度不能超过50!' },
            {validator:validatorCode}
          ]}
        >
          <Input disabled={roleInfo.id?true:false}/>
        </Form.Item>
        <Form.Item
          label="角色简称"
          name="roleTag"
          rules={[
            {max:50, message: '角色简称不能超过50!' },
          ]}
        >
          <Input disabled={isView?true:false}/>
        </Form.Item>
        <Form.Item
          label="角色描述"
          name="roleDesc"
          rules={[
            {max:200, message: '角色描述不能超过200!' },
          ]}
        >
          <TextArea disabled={isView?true:false}/>
        </Form.Item>
      </Form>
    </GlobalModal>
  )
}
export default connect(({layoutG,role,loading})=>{return {layoutG,role,loading}})(AddUpdateModal);
