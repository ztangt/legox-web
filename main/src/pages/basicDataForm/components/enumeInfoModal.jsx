import { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Row, Col, Switch, Button } from 'antd';
import styles from './enumeInfoModal.less';
import pinyinUtil from '../../../service/pinyinUtil';
import GlobalModal from '../../../componments/GlobalModal';
function BasicDataForm({ dispatch, basicDataForm, layoutG, infoAddOrModify, leftSelectedRecord, record }) {

    const {
        pathname,
        dictInfoId,
        tableData,
        searchWord,
        isView
    } = basicDataForm
    const [basicForm] = Form.useForm();
    const [isEnable, setIsEnable] = useState(1);
    const [loading, setLoading] = useState(false);
    const totalData=JSON.parse(window.localStorage.getItem('totalData'))
    const copyTotalData=totalData
    const layouts =  {labelCol: { span: 8},wrapperCol: { span: 16}};
    useEffect(() => {
        if (infoAddOrModify == 'modifyInfo') {
            basicForm.setFieldsValue({
                'enumeName': record.dictInfoName,
                'enumeCode': record.dictInfoCode,
                'enumeSpell': record.simpleSpelling,
                'enumeSimpleName': record.simpleName,
            })
        }
    }, [])
    useEffect(() => {
        let parentNode = getParentKey(record.id?record.parentId:dictInfoId[0],copyTotalData?copyTotalData:[])
        console.log(parentNode,'parentNode');
        if(parentNode){
            basicForm.setFieldsValue({
                'parentName': parentNode.dictInfoName,
            })
        }
    }, [record])
    //获取选中节点父节点
    let parentNode;
    function getParentKey(key, tree){
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if(node.id == key){
                parentNode = node
            }else{
                if(node.children && node.children.length > 0){
                    getParentKey(key, node.children)
                }
            }


        }
        return parentNode;
    };



    //确认新增
    const handleOk = async (value) => {
        if (loading) return; 
        setLoading(true); 
        for (let key in value) {
            if (typeof value[key] == 'string') {
                value[key] = value[key].trim()
            }
        }
        if (infoAddOrModify == 'addInfo') {
            await dispatch({
                type: 'basicDataForm/addDictInfo',
                payload: {
                    dictTypeId: leftSelectedRecord.node.dataRef.dictTypeId,
                    dictTypeCode: leftSelectedRecord.node.dataRef.dictTypeCode,
                    dictInfoCode: value.enumeCode,
                    dictInfoName: value.enumeName,
                    simpleSpelling: value.enumeSpell,
                    simpleName: value.enumeSimpleName,
                    enable: isEnable,
                    parentId:dictInfoId.length == 1 ? dictInfoId[0] : '0'
                }, callback: (success) => {
                    console.log(success)
                    if (success) {
                        setLoading(false)
                        dispatch({
                            type: 'basicDataForm/updateStates',
                            payload: {
                                isShowEnumeInfoModal: false,
                            }
                        })
                    }
                }
            })
        } else if (infoAddOrModify == 'modifyInfo') {
            await dispatch({
                type: 'basicDataForm/updateDictInfo',
                payload: {
                    dictTypeId: leftSelectedRecord.node.dataRef.dictTypeId,
                    dictTypeInfoCode: record.dictTypeCode+'__'+value.enumeCode,
                    dictInfoCode: value.enumeCode,
                    dictInfoName: value.enumeName,
                    dictTypeInfoId: record.id,
                    enable: isEnable,
                    simpleSpelling: value.enumeSpell,
                    simpleName: value.enumeSimpleName,
                    parentId:record.parentId ? record.parentId : '0'
                }, callback: async (success) => {
                    if (success) {
                        setLoading(false)
                        await dispatch({
                            type: 'basicDataForm/updateStates',
                            payload: {
                                isShowEnumeInfoModal: false,
                            }
                        })
                    }
                }
            })
        }
        await dispatch({
            type: 'basicDataForm/getDictType',
            payload: {
                dictTypeCode: leftSelectedRecord.node.dataRef.dictTypeCode,
                showType: 'ALL',
                isTree:'1',
                searchWord:searchWord
            }
        })

    }
    //新增关闭
    const handleCancel = () => {
        dispatch({
            type: 'basicDataForm/updateStates',
            payload: {
                isShowEnumeInfoModal: false,
                isView:false
            }
        })
    }

    /**
     * 开关的开启关闭
     * @param {开关的开启关闭} checked
     */
    function onChange(checked) {
        if (checked) {
            setIsEnable(1)
        } else {
            setIsEnable(0)
        }
    }


    //输入完名称后获取简拼
    function nameCallback(e) {
        let name = `${pinyinUtil.getFirstLetter(e.target.value).toLowerCase()}`
        basicForm.setFieldsValue({
            enumeSpell: name,

        });
        // if(infoAddOrModify == 'addInfo'){
        //     basicForm.setFieldsValue({
        //         enumeCode: name,
        //     });
        // }
    }

    const validatorPwd = (rule, value, callback) => {
        if (value) {
            let matchPwd = /(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]/;
            if (!matchPwd.test(value)) {
                callback('请输入数字和字母');
            } else {
                callback();
            }
        } else {
            callback();
        }
    }


    return (
        <GlobalModal
            title={isView?'查看枚举':infoAddOrModify == 'addInfo' ? '新增枚举值' : '修改枚举值'}
            visible={true}
            onCancel={handleCancel}
            maskClosable={false}
            mask={false}
            centered
            widthType={1}
            incomingWidth={600}
            incomingHeight={200}
            getContainer={() =>{
              return document.getElementById('basicDataForm_container')||false
            }}
            // bodyStyle={{height:200}}
            footer={
                !isView&&[<Button onClick={handleCancel}>
                    取消
                </Button>,
                    <Button type="primary" htmlType="submit" onClick={()=>{basicForm.submit()}} loading={loading}>
                    保存
                </Button>
                
                ]
            }
        >
            <Form
                form={basicForm}
                className={styles.form}
                onFinish={handleOk}
                {...layouts}
            >
                {
                    infoAddOrModify == 'addInfo' ?
                        <>
                            <Row gutter={0}>
                                <Col span={12}>
                                    <Form.Item
                                    labelCol={{span:8}}
                                    wrapperCol={{span:8}}
                                        label="枚举名称"
                                        name="enumeName"
                                        rules={[{ required: true, message: '请输入枚举名称' }, { max: 50, message: '最多输入50个字符' },{ whitespace: true, message: '请输入枚举名称!'}]}
                                    >
                                        <Input style={{ width: '100px' }} onChange={(e) => { nameCallback(e) }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="枚举值编码"
                                        name="enumeCode"
                                        rules={[{ required: true, message: '请输入枚举值编码' }, { max: 50, message: '最多输入50个字符' }, { pattern: /^[0-9a-zA-Z_-]+$/,message: '只能输入字母、数字、下划线、中划线'}]}
                                    >
                                        <Input style={{ width: '100px' }}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={0}>
                                <Col span={12}>
                                    <Form.Item
                                        label="枚举值简拼"
                                        name="enumeSpell"
                                        rules={[{ required: true, message: '请输入枚举值简拼' }, { max: 50, message: '最多输入50个字符' },{whitespace:true,message: '请输入枚举值简拼'}]}
                                    >
                                        <Input style={{ width: '100px' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="枚举值简称"
                                        name="enumeSimpleName"
                                        rules={[
                                            // {required:true,message:'请输入枚举值简称'},
                                            { max: 50, message: '最多输入50个字符' }]}
                                    >
                                        <Input style={{ width: '100px' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={0}>
                                <Col span={12}>
                                    <Form.Item
                                        label="上级枚举值"
                                        name="parentName"
                                    >
                                        <Input style={{ width: '100px' }} disabled/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="启用状态"
                                        name="enableStatus"
                                    >
                                        <Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked={true} onChange={onChange} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                        :
                        <>
                            <Row gutter={0}>
                                <Col span={12}>
                                    <Form.Item
                                        label="枚举名称"
                                        name="enumeName"
                                        rules={[{ required: true, message: '请输入枚举名称' },{ whitespace: true, message: '请输入枚举名称!'}]}
                                    >
                                        <Input style={{ width: '100px' }} onChange={(e) => { nameCallback(e) }} disabled={isView}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="枚举值编码"
                                        name="enumeCode"
                                        rules={[{ required: true, message: '请输入枚举值编码' }, { pattern: /^[0-9a-zA-Z_.]+$/,message: '只能输入字母、数字、_'}]}
                                    >
                                        {/* disabled={leftSelectedRecord.node.dataRef.isSys == 1||infoAddOrModify != 'addInfo'} */}
                                        <Input style={{ width: '100px' }}  disabled={isView}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={0}>
                                <Col span={12}>
                                    <Form.Item
                                        label="枚举值简拼"
                                        name="enumeSpell"
                                        rules={[{ required: true, message: '请输入枚举值简拼' },{whitespace:true,message: '请输入枚举值简拼'}]}
                                    >
                                        <Input style={{ width: '100px' }} disabled={isView}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="枚举值简称"
                                        name="enumeSimpleName"
                                        rules={[
                                            // { required: true, message: '请输入枚举值简称' }
                                            { max: 50, message: '最多输入50个字符' }
                                        ]}
                                    >
                                        <Input style={{ width: '100px' }} disabled={isView}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={0}>
                                <Col span={12}>
                                    <Form.Item
                                        label="上级枚举值"
                                        name="parentName"
                                    >
                                        <Input style={{ width: '100px' }} disabled/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="启用状态"
                                        name="enableStatus"
                                    >
                                        <Switch checkedChildren="启用" unCheckedChildren="禁用" onChange={onChange} defaultChecked={record.enable == 1} disabled={isView}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                }
            </Form>
        </GlobalModal>
    )
}
export default connect(({ basicDataForm, layoutG,loading }) => ({
    basicDataForm,
    layoutG,
    loading
}))(BasicDataForm);
