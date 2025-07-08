import { connect } from 'dva';
import React, { useState,useRef } from 'react';
import { Modal, Input,Button,message,Form,Row,Col,Switch,Select,TreeSelect,Upload} from 'antd';
import styles from '../index.less';
import { history } from 'umi';
import { uploadButton,FormOutlined,PlusOutlined,LoadingOutlined} from '@ant-design/icons';
import { parse } from 'query-string';
const { TextArea } = Input;
const layout =  {labelCol: { span: 8 },wrapperCol: { span: 16 }};
function SaveIssueModule ({onCancel,location,dispatch,loading,layoutG,applyModelConfig,menuLists
}){   
    const query = parse(history.location.search);
    const bizSolId = query.bizSolId;
    const {procDefId,imgNode,actId,nodeObj,bizFromInfo,saveIssueModule,sysMenuList,imageUrl,menuImgId}=applyModelConfig.stateObj[bizSolId]
    console.log('menuLists',menuLists)
    const [imageLoading, setImageLoading] = useState(false);
    const [fields, setFields] = useState([
        {
            name: ['menuSourceCode'],
            value: 'APP'
        },
        {
            name: ['isEnable'],
            value: true
        },
        {
            name: ['bizSolId'],
            value: bizSolId
        }
    ]);
    // const [UploadForm] = Form.useForm();
    function onFinish(values){
        values.isEnable = values.isEnable? '1' : '0';
        // values.isParent = values.isParent? '1' : '0';
        values.isDataruleCode = values.menuSourceCode == 'OUT' ? '0' : '1';
        values.menuImg = menuImgId;
        values.sysPlatType = 'PLATFORM_BUSS';
        values.registerId = '1397739473063718914';
        dispatch({
            type: 'applyModelConfig/addMenu',
            payload:{
              ...values
            },
            callback:function(){
                dispatch({
                    type:"applyModelConfig/updateStates",
                    payload:{
                        saveIssueModule:false
                    }
                })
            }
        })
    }

    const uploadButton = (
        <div style={{width:'612px',height:'250px',border:'1px solid #f0f0f0'}}>
            <div style={{ marginTop: '120px',textAlign:'center'}}>
                {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                <p>图片预览</p>
            </div>
        </div>
    );

    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('上传的图片不是JPG/PNG格式');
        }
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
          message.error('上传的图片不能大于5MB!');
        }
        return isJpgOrPng && isLt2M;
    }
    const uploadFormData = new FormData();
    //上传头像
    function doImgUpload(options){
        const { onSuccess, onError, file, onProgress } = options;
        const reader = new FileReader();
        reader.readAsDataURL(file); // 读取图片文件
        reader.onload = (file) => {
            dispatch({
                type: 'applyModelConfig/updateStates',
                payload:{
                    imageUrl:file.target.result
                }
            })
            setImageLoading(false)
        };
        uploadFormData.append('fileType','OTHERS')
        uploadFormData.append('file',file);
        dispatch({
            type: 'userInfoManagement/doImgUploader',
            payload:uploadFormData,
            callback:function(dataId){
                dispatch({
                    type: 'applyModelConfig/updateStates',
                    payload:{
                        menuImgId:dataId,
                    }
                })
            }
        })    
    };
  

    function onChange(value){
        setFields([
            {
                name: ['menuParentId'],
                value: value
            }
        ])
    }
    function sysMenuOnSelect(value,node){
        setFields([
            {
                name: ['menuName'],
                value: node.title
            }
        ])
    }

   
        return (
            <Modal
                visible={true}
                footer={false}
                width={800}
                title='保存发布至模块资源'
                onCancel={onCancel}
                className={styles.add_form}
                // mask={false}
                bodyStyle={{overflow: 'auto'}}
                centered
                maskClosable={false}
                // getContainer={() =>{
                //     return document.getElementById('moduleResourceMg_container')
                // }}
            >
                <div style={{height:"500px"}}>
                    <Form 
                    fields={fields}
                    onFinish={onFinish} 
                    >
                        <Row gutter={0} >
                            <Col span={12}>
                                <Form.Item 
                                    {...layout}
                                    label="模块来源"
                                    name="menuSourceCode" 
                                    rules={[
                                        { required: true,message:'选择模块来源' },
                                    ]}
                                >
                                    <Select disabled>
                                        <Select.Option value="APP">业务应用建模</Select.Option>
                                        {/* <Select.Option value="OUT">外部链接</Select.Option>
                                        <Select.Option value="OWN">授权能力</Select.Option>  */}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item 
                                    {...layout}
                                    label="能力名称"
                                    name="bizSolId" 
                                    rules={[
                                        { required: true,message:'选择建模或能力' },
                                    ]}
                                >
                                    <TreeSelect
                                        style={{ width: '100%' }}
                                        // value={this.state.value}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        treeData={sysMenuList}
                                        treeDefaultExpandAll
                                        onSelect={sysMenuOnSelect}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={0} >
                            <Col span={12}>
                                <Form.Item 
                                    {...layout}
                                    label="模块资源名称"
                                    name="menuName" 
                                    rules={[
                                        { required: true,message:'请输入模块资源名称' },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item 
                                    {...layout}
                                    label="数据源"
                                    name="metaData" 
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item 
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            label="模块链接"
                            name="menuLink" 
                        >
                            <Input disabled={true} />
                        </Form.Item>
                        <Row gutter={0} >
                            <Col span={12}>
                                <Form.Item 
                                    {...layout}
                                    label="模块图标"
                                    name="menuIcon" 
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item 
                                    {...layout}
                                    label='上级节点'
                                    name="menuParentId" 
                                >
                                    <TreeSelect
                                        treeData={menuLists}
                                        style={{ width: '100%' }}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        allowClear
                                        onChange={onChange}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={0} >
                            <Col span={12}>
                                <Form.Item 
                                    // labelCol={{ span: 16 }}
                                    // wrapperCol={{ span: 8 }}
                                    {...layout}
                                    label="是否启用"
                                    name="isEnable" 
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item 
                                    {...layout}
                                    label="打开方式"
                                    name="openTypeCode" 
                                    rules={[
                                        { required: true,message:'请选择打开方式' },
                                    ]}
                                >
                                    <Select>
                                        <Select.Option value="EMB">嵌入</Select.Option>
                                        <Select.Option value="POP">新窗口</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item 
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            label="统计sql"
                            name="staSql" 
                        >
                            <TextArea />
                        </Form.Item>
                        <Form.Item 
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            label="模块大图"
                            name="menuImg" 
                        >
                            <Upload
                                name="avatar"
                                listType="picture"
                                className={styles.avatarUploader}
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                                customRequest={doImgUpload}
                            >
                                <p style={{marginTop:'5px',textAlign:'center'}}>请选择一张图片</p>
                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '612px',height:'250px' }} /> : uploadButton}
                                
                            </Upload>
                        </Form.Item>
                        <Row className={styles.bt_group} style={{width: '200px',margin:'0 auto',paddingBottom:'20px'}} >
                            <Button  type="primary" htmlType="submit" loading={loading}>
                                保存
                            </Button>
                            <Button onClick={onCancel} style={{marginLeft: 8}}>
                                取消
                            </Button>
                        </Row>
                    </Form> 
                </div>
            
        </Modal>
        )
    
  }


  
export default connect(({applyModelConfig,layoutG})=>({
    applyModelConfig,
    layoutG
}))(SaveIssueModule);
