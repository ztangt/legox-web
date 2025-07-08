import React,{useRef,useEffect,useState} from 'react'
import { Modal, Form, Input, Row, Col, Select, Button } from 'antd'
import { connect } from 'dva'
import pinyinUtil from '../../../../../cloud/src/service/pinyinUtil';
import ScriptEditor from './scriptEditor';
import { v4 as uuidv4 } from 'uuid';
import SparkMD5 from 'spark-md5';
import { dataFormat } from '../../../util/util';
import {CONTROLCODE,DRIVETYPE} from '../../../service/constant'
import ScriptModal from './scriptModal';
import GlobalModal from '../../../componments/GlobalModal';
import styles from '../index.less'
const { Option } = Select;
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 }
}
function AddControlModal({ dispatch, controlManagement }) {
     const {ruleData,editId,detailData,codeUrl,codeData,isShowScriptEditor} =controlManagement
     console.log(ruleData,'ruleData==111');
    const [form] = Form.useForm()
    let ChildRef = React.createRef()
    useEffect(()=>{
        ChildRef.current.changeValue(ruleData)
        form.setFieldsValue({
            codeUrl:ruleData
        })
    },[ruleData])
    useEffect(()=>{
        if(detailData.id){
            console.log( codeData,'cccc====');
            ChildRef.current.changeValue(ruleData)
            form.setFieldsValue({
                controlName:detailData.controlName,
                controlCode:detailData.controlCode,
                controlType:detailData.controlType,
                hiddenColumn:detailData.hiddenColumn,
                codeUrl:ruleData
            })
        }
    },[detailData])
    const onFinish = async(val) => {
        console.log(val.codeUrl,'val==');
        const blob = new Blob([ruleData], { type: 'text/javascript' });
        const file = new File([blob], uuidv4(), {
          type: 'text/javascript',
        });
        console.log(file,'file');
        const fileMD5 = SparkMD5.hashBinary(ruleData);
        console.log(fileMD5,'fileMD5');
       await dispatch({
          type: 'controlManagement/updateStates',
          payload: {
            fileChunkedList: [file],
            md5: fileMD5,
            fileName: `${file.name}.js`,
            fileSize: file.size,
          },
        });
       await dispatch({
            type:'controlManagement/getScriptFileToMinio',
            callback:(filePath)=>{
                if(detailData.id){
                    dispatch({
                        type:'controlManagement/updateBusinessControl',
                        payload:{
                            id:detailData.id,
                            controlName:val.controlName,
                            controlCode:val.controlCode,
                            hiddenColumn:val.hiddenColumn,
                            codeUrl:ruleData?filePath:'',
                        }
                    })
                }else{
                    dispatch({
                        type:'controlManagement/addBusinessControl',
                        payload:{
                            controlName:val.controlName,
                            controlCode:val.controlCode,
                            controlType:val.controlType,
                            hiddenColumn:val.hiddenColumn,
                            codeUrl:ruleData?filePath:'',
                        }
                    })
                }
            }
        })


        dispatch({
            type: 'controlManagement/updateStates',
            payload: {
                isShow: false,
                detailData:{},
            }
        })
    };

    const handleCancel = () => {
        dispatch({
            type: 'controlManagement/updateStates',
            payload: {
                isShow: false,
                detailData:{}
            }
        })
    };
    const changeName = (e) => {
        form.setFieldsValue({ 'controlCode': pinyinUtil.getFirstLetter(e.target.value, false) })
    }
    const changeValue = (value) => {
        console.log(value, '111');
    }
    const openCompiler=()=>{
        dispatch({
            type: 'controlManagement/updateStates',
            payload: {
                isShowScriptEditor:true
            }
        })
    }
    return (
        <div>
            <GlobalModal
                title={editId?'修改业务控件':'新增业务控件'}
                visible={true}
                widthType={1}
                // incomingWidth={900}
                // incomingHeight={300}
                // onOk={handleOk}
                onCancel={handleCancel}
                getContainer={() => {
                    return document.getElementById('controlManagement_id')||false
                }}
                mask={false}
                maskClosable={false}
                footer={[<Button onClick={handleCancel}>取消</Button>,<Button type='primary' htmlType='submit' onClick={()=>{form.submit()}}>保存</Button>,
                
            ]}
            >
                <Form form={form} {...layout} onFinish={onFinish} style={{height:'100%'}}
                >
                    <Form.Item
                        label='控件名称'
                        name='controlName'
                        rules={[
                            { required: true, message: '请填写控件名称' },
                        ]}
                    >
                        <Input onChange={changeName} disabled={detailData.id?true:false}/>
                    </Form.Item>
                    <Form.Item
                        label='控件编码'
                        name='controlCode'
                        rules={[
                            { required: true, message: '请填写控件编码' },
                        ]}
                    >
                        <Input disabled={detailData.id?true:false}/>
                    </Form.Item>
                    <Form.Item
                        label='控件类型'
                        name='controlType'
                        rules={[
                            { required: true, message: '请选择控件类型' },
                        ]}
                    >
                        <Select onChange={changeValue} disabled={detailData.id?true:false}>
                            <Option value="TREE">树形结构</Option>
                            <Option value="LIST">列表展示</Option>
                            <Option value="TREELIST">左树右列表</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                    label='生成多个默认字段'
                    name='hiddenColumn'
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label='带入规则'
                        name='codeUrl'
                        className={styles.codeStyle}
                    >
                        <Button onClick={()=>{openCompiler()}}>代码编译器</Button>
                        <ScriptEditor onRef={ChildRef} height={'100%'} readOnly={true}/>
                    </Form.Item>
                </Form>
            </GlobalModal>
            {
                isShowScriptEditor&&<ScriptModal/>
            }
        </div>
    )
}
export default connect(({controlManagement})=>({controlManagement}))(AddControlModal)
