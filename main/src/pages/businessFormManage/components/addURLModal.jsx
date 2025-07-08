import { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Input, Button, message, Modal, Form, Row, Col, Select, TreeSelect } from 'antd';
import styles from './addURLModal.less'
import pinyinUtil from '../../../service/pinyinUtil';
import ButtonMoudle from './buttonMoudle'
import GlobalModal from '../../../componments/GlobalModal';
const { TreeNode } = TreeSelect;
function AddURLModal({ dispatch, businessFormManage, layoutG, isAddURLModal, selectCtlgInfo, businessFormTree, rowRecord, isPreview,setSelectedKeys, setSelectCtlgInfo,getBusinessForm,setIsPreview }) {
    const {
        pathname,
        limit,
        isShowAddURLModal,
        start,
        searchWord,
        buttonModal
    } = businessFormManage
    console.log('buttonModal',buttonModal);
    const [form] = Form.useForm();
    const [bizFormType, setBizFormType] = useState('1');
    const [bizTreeNode, setBizTreeNode] = useState(selectCtlgInfo.nodeId);
    const [bizTreeNodeName, setBizTreeNodeName] = useState(selectCtlgInfo.nodeName);
    function onChangeName(e){
        if(e.target.value&&isAddURLModal){
            form.setFieldsValue({'bizFormCode': pinyinUtil.getFirstLetter(e.target.value,false)})
        }
    }
    useEffect(() => {
        if (!isAddURLModal) {

            rowRecord && form.setFieldsValue({
                bizFormCode: rowRecord.bizFormCode,
                bizFormName: rowRecord.bizFormName,
                bizFormType: rowRecord.bizFormType,
                bizFormUrl: rowRecord.bizFormUrl,
                bizFormDesc: rowRecord.bizFormDesc,
                printTemplate: rowRecord.printTemplate,
                buttonGroupId: rowRecord.buttonGroupId,
                buttonGroupName: rowRecord.buttonGroupName,
            })
        }

        rowRecord&&setBizFormType(rowRecord.bizFormType);
        form.setFieldsValue({
            applyCategory: bizTreeNode,
            bizFormType:rowRecord?rowRecord.bizFormType:1
        })
        // selectCtlgInfo && setBizTreeNode(selectCtlgInfo.nodeId)
    }, [1])
    // TreeNode节点处理
    const renderTreeNodes = data => data.map((item) => {
        if (item.children) {
            return (
                <TreeNode title={item.nodeName} key={item.nodeId} value={item.nodeId} dataRef={item}>
                    {renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode title={item.nodeName} key={item.nodeId} value={item.nodeId} dataRef={item} />
    })
    const onValuesChange = () => { }
    const successFunction = () =>{
        setSelectCtlgInfo({nodeId: bizTreeNode,nodeName: bizTreeNodeName})
        setSelectedKeys([bizTreeNode]);
        dispatch({
            type: 'businessFormManage/updateStates',
            payload: {
                isShowAddURLModal: false,
            }
        })
        getBusinessForm(bizTreeNode, '', 1, limit);
    }
    const onButton = () =>{
        dispatch({
            type: 'businessFormManage/updateStates',
            payload: {
                buttonModal: true,
            }
        })
        dispatch({
            type: `businessFormManage/getButtonGroups`,
            payload: {
                searchValue: '',
                start: 1,
                limit: 100000,
                groupType: 'TABLE',
            }
        })
    }
    const onFinish = (values) => {
        Object.keys(values).forEach(function(key) {
            if((key=='bizFormName'|| key=='bizFormCode' ||key=='bizFormUrl'||key=='printTemplate')&&
               values[key]){
                values[key] = values[key].trim()
            }
        })
        if (isAddURLModal) {
            // 新增
            dispatch({
                type: 'businessFormManage/addBusinessForm',
                payload: {
                    ctlgName: bizTreeNodeName.toString(),
                    ctlgId: bizTreeNode,
                    ...values,
                    applyCategory: bizTreeNode,
                    bizFormType,
                },
                callback: () => {
                    successFunction();
                }
            })
        } else {
            // 修改
            dispatch({
                type: 'businessFormManage/updateBusinessForm',
                payload: {
                    ctlgName: bizTreeNodeName,
                    ctlgId: bizTreeNode,
                    id: rowRecord.id,
                    ...values,
                    applyCategory: bizTreeNode,
                    bizFormType,
                },
                callback: () => {
                    successFunction();
                }
            })
        }


    }
    const onCancel = () => {
        setIsPreview(false)
        dispatch({
            type: 'businessFormManage/updateStates',
            payload: {
                isShowAddURLModal: false,
            }
        })
    }
    // 类别
    const categoryFn = (value, label, extra) => {
        form.setFieldsValue({
            applyCategory: value,
        })
        setBizTreeNode(value);
        setBizTreeNodeName(label);

    }
    // 类型
    const typeFn = (value) => {
        setBizFormType(value);
    }


    const layouts =  {labelCol: { span: 4 },wrapperCol: { span: 20}};

    return (
        <GlobalModal
            visible={true}
            widthType={1}
            incomingWidth={900}
            incomingHeight={300}
            title={isPreview?'信息预览':isAddURLModal ? "新增URL" : '修改URL'}
            onCancel={onCancel}
            maskClosable={false}
            mask={false}
            centered
            getContainer={() =>{
                return document.getElementById('businessFormManage_container')||false
            }}
            footer={!isPreview&&[
                <Button onClick={onCancel}>
                            取消
                        </Button>,
                <Button type="primary" htmlType="submit" onClick={()=>{form.submit()}}>
                            保存
                        </Button>
                        
            ]}
        >
            <Form onFinish={onFinish} form={form} onValuesChange={onValuesChange} className={styles.form_wrap} >
                <Row gutter={0}>
                    <Col span={12}>
                        <Form.Item
                            label="应用类别"
                            name="applyCategory"
                            rules={[
                                { required: true, message: '请输入业务应用类别!' }
                            ]}
                        >
                            <TreeSelect
                                showSearch
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                allowClear
                                treeDefaultExpandAll
                                placeholder="请选择类别"
                                onChange={categoryFn}
                                value={bizTreeNode}
                                disabled={!isAddURLModal}
                            >
                                {businessFormTree.length>0?renderTreeNodes(businessFormTree):''}
                            </TreeSelect>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="类型"
                            name="bizFormType"
                            rules={[
                                { required: true, message: '请选择类型!' }
                            ]}
                        >
                            {isPreview?<Select
                                // placeholder="请选择类型"
                                onChange={typeFn}
                                disabled={isPreview}
                            >
                                <Select.Option value={1}>超链接表单</Select.Option>
                                <Select.Option value={2}>超链接列表</Select.Option>
                                <Select.Option value={3}>表单建模</Select.Option>
                                <Select.Option value={4}>列表建模</Select.Option>
                            </Select>:<Select
                                // placeholder="请选择类型"
                                onChange={typeFn}
                            >
                                <Select.Option value={1}>超链接表单</Select.Option>
                                <Select.Option value={2}>超链接列表</Select.Option>
                            </Select>
                            }
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={0}>
                    <Col span={12}>
                        <Form.Item
                            label="名称"
                            name="bizFormName"
                            rules={[
                                { required: true, message: '请输入业务应用名称!' },
                                { max: 50, message: '长度不能超过50!' },
                                { whitespace: true, message: '请输入业务应用名称!'}
                            ]}
                        >
                            <Input disabled={isPreview} onChange={onChangeName.bind(this)}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="编码"
                            name="bizFormCode"
                            rules={[
                                { required: true, message: '请输入编码!' },
                                { max: 50, message: '长度不能超过50!' },
                                { whitespace: true, message: '请输入编码!'},
                                { pattern: /^\w+$/,message: '只能输入字母、数字、下划线'},

                            ]}
                        >
                            <Input disabled={!isAddURLModal}/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={0}>
                    <Col span={12}>
                        <Form.Item
                            label="URL"
                            name="bizFormUrl"
                            rules={[
                                { required: true, message: '请输入业务应用URL!' },
                                { max: 200, message: '最大输入200字符' },
                                { whitespace: true, message: '请输入业务应用URL!'}
                            ]}
                        >
                            <Input disabled={isPreview} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        {(bizFormType==2||bizFormType==4)?<Form.Item //bizFormType==4 查看时展示按钮模版
                            label="按钮模板"
                            name="buttonGroupName"
                            rules={[
                                { required: true, message: '请选择按钮模板!' },
                            ]}
                        >
                            <Input disabled={isPreview} onClick={onButton}/>
                        </Form.Item>
                        :<Form.Item
                            label="打印模板"
                            name="printTemplate"
                            rules={[
                                { max: 50, message: '长度不能超过50!' },
                            ]}
                        >
                            <Input disabled={isPreview} />
                        </Form.Item>}
                        <Form.Item
                            label="按钮模板"
                            name="buttonGroupId"
                            hidden={true}

                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={0}>
                    <Col span={24} align={'center'}>
                        <Form.Item
                            label="描述"
                            name="bizFormDesc"
                            rules={[
                                { max: 200, message: '长度不能超过200!' },
                            ]}
                        >
                            <Input.TextArea style={{ height: '100px' }} disabled={isPreview} />
                        </Form.Item>
                    </Col>
                </Row>
                {/* {!isPreview &&
                    <Row align={'center'}>
                        <Button type="primary" htmlType="submit">
                            保存
                        </Button>
                        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
                            取消
                        </Button>
                    </Row>
                } */}
                {buttonModal&&<ButtonMoudle form={form}/>}
            </Form>

        </GlobalModal>
    )
}
export default connect(({ businessFormManage, layoutG }) => ({
    businessFormManage,
    layoutG,
}))(AddURLModal);
