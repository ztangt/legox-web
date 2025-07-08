import { useEffect,useState } from 'react';
import { connect } from 'dva';
import styles from './enumeTypeModal.less';
import { Modal, Form, Input, Row, Col, Button ,Select} from 'antd';
import pinyinUtil from '../../../service/pinyinUtil';
import {BASICTYPE} from '../../../service/constant'
import GlobalModal from '../../../componments/GlobalModal';
const {Option}=Select
function BasicDataForm({ dispatch, basicDataForm, layoutG, rightSelectedRecord, typeAddOrModify }) {

const [basicForm] = Form.useForm();
const [res,setRes]=useState([])
const [selectValue,setValue]=useState('0')
const [loading, setLoading] = useState(false);
const {treeSearchWord}=basicDataForm
    useEffect(() => {
        if (typeAddOrModify == 'modifyType') {
            basicForm.setFieldsValue({
                'dictTypeName': rightSelectedRecord.dataRef.dictTypeName,
                'dictTypeCode': rightSelectedRecord.dataRef.dictTypeCode,
                'dictTypeDesc': rightSelectedRecord.dataRef.dictTypeDesc,
                'enumType':rightSelectedRecord.dataRef.enumType=='0'?'同级':'多级',
            })
        }
    }, [])

    const searchTree = (data, searchWord) => {
        data.forEach((item, index) => {
            if (item.dictTypeName.includes(searchWord)) {
                res.push(item)
            }
            if (item.children) {
                searchTree(item.children, searchWord)
            }
        })
        return res
    }
    const handleOk = async(value) => {
        if (loading) return; 
        setLoading(true); 
        for (let key in value) {
            if (typeof value[key] == 'string' && key != 'dictTypeDesc') {
                value[key] = value[key].trim()
            }
        }
        if (typeAddOrModify == 'addType') {
            await dispatch({
                type: 'basicDataForm/addDictType',
                payload: {
                    dictTypeName: value.dictTypeName,
                    dictTypeDesc: value.dictTypeDesc,
                    dictTypeCode: value.dictTypeCode,
                    enumType:selectValue,
                    parentId: rightSelectedRecord.dataRef.id,
                    isSys: rightSelectedRecord.dataRef.isSys,
                }, callback: (success) => {
                    if (success) {
                        setLoading(false)
                        dispatch({
                            type: 'basicDataForm/getDictTypeTree',
                            payload: {}
                        })
                        dispatch({
                            type: 'basicDataForm/updateStates',
                            payload: {
                                isShowEnumeTypeModal: false,
                            }
                        })
                    }
                }
            })
        } else if (typeAddOrModify == 'modifyType') {
            await dispatch({
                type: 'basicDataForm/updateDictType',
                payload: {
                    dictTypeName: value.dictTypeName,
                    dictTypeCode: value.dictTypeCode,
                    dictTypeDesc: value.dictTypeDesc,
                    enumType:selectValue,
                    parentId: rightSelectedRecord.dataRef.parentId,
                    dictTypeId: rightSelectedRecord.dataRef.dictTypeId,
                    isSys: rightSelectedRecord.dataRef.isSys
                }, callback: (success) => {
                    if (success) {
                        setLoading(false)
                        dispatch({
                            type: 'basicDataForm/updateStates',
                            payload: {
                                isShowEnumeTypeModal: false,
                                enumType:selectValue
                            }
                        })
                        if(treeSearchWord){
                            dispatch({
                              type: 'basicDataForm/getDictTypeTree',
                              callback:(data)=>{
                                const resultTree=searchTree(data,treeSearchWord)
                                console.log(resultTree,'resultTree==');
                                resultTree.forEach((item=>{
                                    item.children=[]
                                }))
                                dispatch({
                                    type: `basicDataForm/updateStates`,
                                    payload: {
                                    treeData: [...resultTree],
                                    },
                                });
                                setRes([])
                              }
                            });
                          }else{
                            dispatch({
                                type: 'basicDataForm/getDictTypeTree',
                                payload: {}
                            })
                        }
                    }
                }
            })
        }
    }
    const handleCancel = () => {
        dispatch({
            type: 'basicDataForm/updateStates',
            payload: {
                isShowEnumeTypeModal: false,
            }
        })
    }
    function onChangeName(e){
        if(e.target.value&&typeAddOrModify == 'addType'){
            basicForm.setFieldsValue({'dictTypeCode': pinyinUtil.getFirstLetter(e.target.value,false)})
        }
    }
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };
    const changeSelectValue=(value)=>{
        console.log(value,'value--');
        setValue(value)
    }

    return (
        <GlobalModal
            title={typeAddOrModify == 'addType' ? '新增字典类型' : '修改字典类型'}
            visible={true}
            onOk={handleOk}
            onCancel={handleCancel}
            maskClosable={false}
            mask={false}
            centered
            widthType={1}
            incomingWidth={600}
            incomingHeight={300}
            getContainer={() =>{
              return document.getElementById('basicDataForm_container')||false
            }}
            footer={
                [
                    <Button onClick={handleCancel}>
                            取消
                        </Button>,
                        <Button type="primary" htmlType="submit" onClick={()=>{basicForm.submit()}} loading={loading.global}>
                            保存
                        </Button>
                ]
            }
        >
            <Form
                form={basicForm}
                onFinish={handleOk}
                className={styles.form}
            >

                        <Form.Item
                            {...layout}
                            label="字典类型名称"
                            name="dictTypeName"
                            rules={[{ required: true, message: '请输入字典类型名称' }, { max: 50, message: '最多输入50个字符' },{whitespace: true,message: '请输入字典类型名称'}]}
                        >
                            <Input   onChange={onChangeName.bind(this)}/>
                        </Form.Item>

                        <Form.Item
                            {...layout}
                            label="字典编码"
                            name="dictTypeCode"
                            rules={[
                                { required: true, message: '请输入字典类型' },
                                { max: 50, message: '最多输入50个字符' },
                                { pattern: /^[A-Za-z0-9_]+$/,message: '只能输入字母、数字、下划线'}
                            ]}
                        >
                            <Input  disabled={typeAddOrModify != 'addType'}/>
                        </Form.Item>

                        <Form.Item
                            {...layout}
                            label="枚举值类型"
                            name="enumType"
                        >
                            <Select
                            defaultValue={'0'}
                            onChange={changeSelectValue.bind(this)}
                                >
                                    {
                                        BASICTYPE.map(item=>{
                                            return <Option value={item.value}>{item.name}</Option>
                                        })
                                    }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            {...layout}
                            label="字典类型描述"
                            name="dictTypeDesc"
                            rules={[{ max: 200, message: '最多输入200个字符' }]}
                        >
                            <Input.TextArea  rows={4} />
                        </Form.Item>
            </Form>
        </GlobalModal >
    )
}
export default connect(({ basicDataForm, layoutG,loading }) => ({
    basicDataForm,
    layoutG,
    loading
}))(BasicDataForm);
