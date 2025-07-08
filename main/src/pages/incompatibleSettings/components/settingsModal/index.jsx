import React,{useEffect, useState,useRef} from 'react'
import {connect} from 'dva'
import {Modal,Form,Row,Col,Input,Select,Button, message} from 'antd'
import ColumnDragTable from '../../../../componments/columnDragTable'
import GlobalModal from '../../../../componments/GlobalModal'
import pinyinUtil from '../../../../service/pinyinUtil';
import configs from '../configs'
import styles from '../../index.less'

const {Option} = Select
const { TextArea } = Input;
const SettingsModalComponent = ({dispatch,handleCancel,handleConfirm,selectedTypesFn,incompatibleSettingsSpace,getFormRef,callback,editData,addType,disAbled})=>{
    const {selectedChoseArr,selectedChoseJobArr,selectedModalType} = incompatibleSettingsSpace
    const [form] = Form.useForm();
    const formRef = useRef({});
    
    useEffect(()=>{
        if(!addType){
            dispatch({
                type: 'incompatibleSettingsSpace/updateStates',
                payload: {
                    selectedModalType: 0
                }
            })
        }
        if (formRef) {
            getFormRef && getFormRef(formRef);
        }
        return ()=>false
    },[])
    // 完成
    const onFinish = (value)=>{ 
        if(selectedChoseArr.length==0&&selectedChoseJobArr.length==0){
            message.error('请选择不相容对象')
            return 
        }
        if(value){
            callback(value)
        }
    }
    // 选择对象
   const selectTypes = ()=>{
        console.log("selectedModalType0",selectedModalType)
        selectedTypesFn(selectedModalType)  
   }
   // 选中改变
   const onSelectedChange = (value)=>{
        dispatch({
            type: 'incompatibleSettingsSpace/updateStates',
            payload: {
                selectedModalType: value
            }
        })
   }
   // 名称修改
   const inputRulesChange= (e)=>{
    if(!addType){
        let name = `${pinyinUtil.getFirstLetter(e.target.value)}`
        form.setFieldsValue({
            rulesCode: name,
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
  
   const tableList = selectedModalType == 1?selectedChoseJobArr.map((item,index)=>{
        item.listNumber= index+1
        return item
   }):selectedChoseArr.map((item,index)=>{
        item.listNumber= index + 1
        return item
   })
//    console.log("tableList==0",tableList,selectedModalType)
 
    return (
        <div>
            <GlobalModal title={disAbled?'查看':addType?'编辑':"新增"} 
                visible={true} 
                widthType={2}
                bodyStyle={{overflow:'hidden'}}
                mask={false}
                onCancel={handleCancel}
                onOk={handleConfirm}
                maskClosable={false}
                getContainer={() =>{
                    return  document.getElementById('incompatibleSettings')||false
                }}
            >
                <Form 
                    form={form}
                    ref={formRef}
                    onFinish={onFinish}
                    initialValues={
                        editData
                    }
                >
                    <Row>
                        <Col span={8}>
                            <Form.Item 
                                label="规则名称"
                                name="rulesName" 
                                rules={[
                                    {
                                    required: true,
                                    message: '请输入规则名称',
                                    },
                                ]}
                            >
                                <Input onChange={inputRulesChange} disabled={disAbled}/>
                            </Form.Item>    
                        </Col>
                        <Col span={8} offset={3}>
                            <Form.Item 
                                label="规则编码"
                                name="rulesCode"
                                rules={[
                                    {
                                    required: true,
                                    validator:checkCode
                                    },
                                ]}
                            >
                                <Input disabled={disAbled?true:addType?true:false}/>
                            </Form.Item>    
                        </Col>
                    </Row>
                    <Form.Item 
                        label="不相容类型"
                        name = "incompatibleTypes"
                    >
                        <div className={styles.select}>
                            <Select 
                                style={{width: 180,marginRight: 8}}
                                defaultValue={addType? editData.incompatibleTypes:0}
                                onChange={onSelectedChange}
                                disabled={disAbled}
                            >
                                {
                                    configs().options.map(item=>(<Option key={'0'+item.value} value={item.value}>{item.label}</Option>))
                                }
                            </Select>
                            <Button onClick={selectTypes} disabled={disAbled}>选择对象</Button>      
                        </div>
                    </Form.Item>
                    <Form.Item label="不相容对象" name="incompatibleType"
                    >
                        <div>
                            <ColumnDragTable 
                                columns={configs({selectedModalType}).settingColumns}
                                dataSource={tableList}
                                rowKey='id'
                                pagination={false}
                                // style={{height: 240}}
                                scroll={{y:220}}
                            />
                        </div>

                    </Form.Item>
                    <Form.Item label="规则描述" name="rulesMsg">
                        <TextArea 
                            style={{
                                height: 85,
                                resize: 'none',
                            }}
                            disabled={disAbled}
                        />    
                    </Form.Item>
                </Form>
            </GlobalModal>
               
        </div>
    )
}

export default connect(({incompatibleSettingsSpace})=>({incompatibleSettingsSpace}))(SettingsModalComponent)