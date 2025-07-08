// 子流程配置
import React,{useEffect,useState,useRef} from 'react';
import {connect} from 'umi';
import {Form,Radio,Space,Select,Button} from 'antd'
import GlobalModal from '../../../componments/GlobalModal';

const SubProcessModal = ({dispatch,query,onSubCancel,parentState,nodeObjId,procDefId})=>{
    const {bizFromInfo} = parentState
    const {bizSolId} = query
    const getRefs = useRef({})
    const [form] = Form.useForm();
    const {formDeployId} = bizFromInfo
    const [formValue,setFormValue] = useState("STARTER") // 选中值
    const [formDataList,setFormDataList] = useState([]) // 获取formList
    const [selectFromValue,setSelectFromValue] = useState('') // 选择表单值
    const [bizSolNodeBaseId,setBizSolNodeBaseId] = useState('') // bizSolNodeBaseId
    const [originValue,setOriginValue] = useState(null)

    const layout = {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 16,
        },
      };

    useEffect(()=>{
        getFormTableColumns()
    },[]) 
    useEffect(()=>{
        getNodeBaseId()
    },[nodeObjId])
    // 获取表单columns
    const getFormTableColumns = ()=>{
        dispatch({
            type:"applyModelConfig/getFormTreeColumns",
            payload:{
                deployFormId: formDeployId
            },
            callback:(data)=>{
                // 选择组织的列表
                const formColumns =data.formColumns&&data.formColumns.length>0&&data.formColumns.filter(item=>item.formColumnControlCode == "ORGTREE").map(ele=>{
                    ele.value = formColumnCodeShowFn(ele.formColumnCode)
                    ele.label = ele.formColumnName
                    return ele
                })||[]
                setFormDataList(formColumns)
            }
        })
    } 
   
    // 获取节点配置id
    const getNodeBaseId = ()=>{
        dispatch({
            type: 'applyModelConfig/getNodeBase',
            payload:{
                    bizSolId,
                    procDefId,
                    formDeployId,
                    actId: nodeObjId,
            },
            callback(value){
                setBizSolNodeBaseId(value.bizSolNodeBaseId)
                setOriginValue(value)
                setFormValue(value.choreographyOrgType)
                value.choreographyOrgField =='SRA'?setSelectFromValue(''):setSelectFromValue(value.choreographyOrgField)
                form.setFieldsValue({
                    originalUnit: value.choreographyOrgType||'STARTER'
                })
            }
        })
    }
    // 替换NAME
    const formColumnCodeShowFn=(formColumnCode)=>{
        if(formColumnCode.includes('NAME_')){
          let formColumnCodes = formColumnCode.split('NAME_');
          return formColumnCodes[0]+'ID_'
        }else{
          return formColumnCode;
        }
    }

    // 保存
    const onSubConfirm = ()=>{
        getRefs.current.submit()
    }
    // 完成
    const onFinish = (values)=>{
        // console.log("values99",values,selectFromValue,"selectFromValue",formDataList[0].value,nodeObjId)
 
        dispatch({
            type: 'applyModelConfig/updateNodeBase',
            payload:{
                    bizSolNodeBaseId,
                    choreographyOrgType: values.originalUnit,
                    choreographyOrgField: selectFromValue||formDataList[0].value,
                    bizSolId,
                    procDefId,
                    formDeployId,
                    actId: nodeObjId,
            },
            callback(){
                onSubCancel()
            }
        })
    } 
    // 单选    
    const radioChange = (e)=>{  
        setFormValue(e.target.value)
    }
    // 表单选择
    const formChange = (value)=>{
        setSelectFromValue(value)
    }
    // console.log("formValue",formValue,"formDataList",formDataList)
    return (
        <GlobalModal 
            title="子流程配置"
            visible={true}
            widthType={1}
            bodyStyle={{padding: '10px'}}
            onCancel={onSubCancel}
            mask={false}
            maskClosable={false}
            incomingHeight={200}
            getContainer={() =>{
                return document.getElementById(`node_modal_${bizSolId}`)||false
            }}
            footer={[
                <Button onClick={onSubCancel}>取消</Button>,
                <Button type="primary" onClick={onSubConfirm}>保存</Button>
            ]}
        >
            <Form ref={getRefs} {...layout} initialValues={{originalUnit:"STARTER"}} style={{paddingTop:16}} form={form} onFinish={onFinish}>
                <Form.Item 
                    name="originalUnit"
                    label="单位选择"
                >
                    <Radio.Group onChange={radioChange} value={formValue}>
                        <Space direction="vertical">
                            <Radio value="STARTER">流程发起人单位</Radio>
                            <div style={{display:'flex',width:280}}>
                                <Radio value="FORM">来自表单</Radio>
                                {
                                    formValue=='FORM'&&<Select
                                        style={{width: 160}}
                                        key={formDataList}
                                        onChange={formChange}
                                        defaultValue={formDataList&&formDataList.length>0&&formDataList[0].value}
                                        options= {
                                            formDataList
                                        }    
                                />
                                }
                            </div>
                        </Space>
                    </Radio.Group>

                </Form.Item>
            </Form> 
        </GlobalModal>
    )

}

export default connect(({applyModelConfig})=>({applyModelConfig}))(SubProcessModal)