import { connect } from 'dva';
import React, { useState, useEffect} from 'react';
import { Button, Space, Upload,Avatar ,message,Row, Col,Input ,Switch,Select,DatePicker,Form,Radio,Modal,Spin} from 'antd';
import _ from "lodash";
import styles from '../index.less';
import { history } from 'umi';
const FormItem = Form.Item;
const { TextArea } = Input;
import pinyinUtil from '../../../service/pinyinUtil';
let pandedRowKeys=[] 
function addForm ({dispatch,loading,searchObj,onAddCancel,isCat, layoutG}){ 
    const pathname = '/organization';
    const currentPage = searchObj[pathname]['users'].currentPage;
    const limit = searchObj[pathname]['users'].limit;
    const { organizationId,orgUg,orgClildrens,orgItemUg,expandOrgList,tenantOrgShare} = searchObj[pathname];
    const [isAdmin, setIsAdmin] = useState(orgUg.isDefaultAdmin == 1 ? true : false);
    const [fields, setFields] = useState([
        // {
        //     name: ['isEnable'],
        //     value: true,
        // },
    ]);
    useEffect(()=>{
        form.setFieldsValue(orgUg)
    },[orgUg.id])
    const [form] = Form.useForm();
    const layout =  {labelCol: { span: 8 },wrapperCol: { span: 16 }};
    function onFinish(values){
        pandedRowKeys = []
        values.orgName = values.orgName ? values.orgName.trim() : '';
        values.orgNumber = values.orgNumber ? values.orgNumber.trim() : '';
        values.orgShortName = values.orgShortName ? values.orgShortName.trim() : '';
        values.isEnable = values.isEnable ? 1:0;
        values.createTenantId = organizationId;
        // 新增修改字段
        values.tenantId = organizationId;
        values.isDefaultAdmin = values.isDefaultAdmin ? 1:0;
        values.sort = 1; //排序
        values.id = orgUg.id;
        const addOrgFn=()=>{
            dispatch({
                type:"organization/addOrgChildren",
                payload:{
                    ...values
                },
                callback:function(){
                    if(orgItemUg && orgItemUg.parentId) {
                        // dispatch({
                        //     type:"organization/getOrgChildren",
                        //     payload:{
                        //         nodeType:'DEPT',
                        //         orgCenterId:orgItemUg.orgCenterId,
                        //         nodeId:orgItemUg.id,
                        //         start:currentPage,
                        //         limit:limit
                        //     }
                        // })
                        dispatch({
                            type: 'organization/getOrgTreeList',
                            payload: {
                            parentId:orgItemUg.id,
                            start:1,
                            limit:1000,
                            orgKind: 'ORG_',
                            searchWord:''
                            },
                        });
                    
                    } else {
                        dispatch({
                            type:"organization/getTenantOrg",
                            payload:{
                                tenantId:organizationId,
                                start:currentPage,
                                limit:limit,
                            },
                            callback: function() {
                                dispatch({
                                    type: 'organization/updateStates',
                                    payload:{
                                        expandOrgList: [],
                                    }
                                })
                            }
                        })  
                    }       
                }
            }) 
        }
        if(orgItemUg) {
            values.parentId = orgItemUg.id;
        }
        if(orgUg.id){
            // 修改单位信息
            dispatch({
                type:"organization/updateOrgChildren",
                payload:{
                    ...values,
                    sort:orgUg.sort
                },
                callback:function(){  
                    if(orgUg.parentId==0) {
                        dispatch({
                            type:"organization/getTenantOrg",
                            payload:{
                                tenantId:organizationId,
                                start:currentPage,
                                limit:limit,
                            },
                            callback: function() {
                                dispatch({
                                    type: 'organization/updateStates',
                                    payload:{
                                        expandOrgList: [],
                                    }
                                })
                            }
                        }) 
                    } else {
                        // dispatch({
                        //     type:"organization/getOrgChildren",
                        //     payload:{
                        //         nodeType:'DEPT',
                        //         orgCenterId:orgUg.orgCenterId,
                        //         nodeId:orgUg.parentId,
                        //         start:currentPage,
                        //         limit:limit
                        //     }
                        // })
                        dispatch({
                            type: 'organization/getOrgTreeList',
                            payload: {
                              parentId:orgUg.parentId,
                              start:1,
                              limit:1000,
                              orgKind: 'ORG_',
                              searchWord:''
                            },
                        });
                    }
                }
            }) 
        }else{

            if(tenantOrgShare=='YES'){
                dispatch({
                    type:'organization/isOrgCenterShareOrg',
                    payload:{
                        tenantId:organizationId
                    },
                    callback:(data)=>{
                        if(!data){
                            Modal.confirm({
                                title: '当前租户组织中心为共享方案，当前无绑定（如需关联绑定其他已存在的组织中心请点击“选择组织中心”按钮），是否添加单位信息并创建新的组织中心？',
                                // content: '当前租户组织中心为共享方案，当前无绑定（如需关联绑定其他已存在的组织中心请点击”选择组织中心“按钮），是否添加单位信息并创建新的组织中心？',
                                okText: '确定',
                                cancelText: '取消',
                                getContainer:()=>{
                                    return document.getElementById('organization_container')
                                },
                                onOk() {
                                    addOrgFn()
           
                                }
                            });
                        }else{
                            addOrgFn()
                        }
                    }
                })
            }else{
                addOrgFn()
           
            }


        }
    }
    function getParentKey(nodeKey, tree){
        for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node['children']) {  
            if (node['children'].some(item => item['nodeId'] === nodeKey)) {
                pandedRowKeys.push(node.nodeId)
                getParentKey(node['nodeId'], orgClildrens);
            } else if (node.children&&node.children.length!=0) {
                getParentKey(nodeKey, node.children);
            }
        }
        }
    };
    // 自动获取单位编码，根据名称按照拼音首字母生成
    function nameCallback(e){
        let name = `${pinyinUtil.getFirstLetter(e.target.value)}`
        if(!orgUg.id){
            form.setFieldsValue({
                orgNumber: name,
            });
        }
    }
    function onValuesChange(values){
        if(values){
            setIsAdmin(true)
        }else{
            setIsAdmin(false)
        }
    }
    function checkUserName(_,value){
        let regCode = /^[a-zA-Z0-9_]*$/;
        if(value&&!regCode.test(value)){
            return Promise.reject(new Error('支持字母、数字，下划线'))
        }else{
            return Promise.resolve();
        }
           
    }
    return (
        <Modal
            visible={true}
            width={900}
            title={isCat?'查看单位':orgUg.id ? '修改单位':'新增单位'}
            onCancel={onAddCancel}
            className={styles.add_form}
            mask={false}
            maskClosable={false}
            getContainer={() =>{
                return document.getElementById('organization_container')
            }}
            footer={
                !isCat&&[  <Button onClick={onAddCancel}>
                    取消
                </Button>,
                <Button  type="primary" htmlType="submit" loading={loading.global} onClick={()=>{form.submit()}}>
                    保存
                </Button>
          ]
            }
        >
            <div >
                <Form  onFinish={onFinish} fields={fields} form={form} initialValues={orgUg}>
                    <Row gutter={0}>
                    <Col span={12}>
                            <Form.Item 
                                label="上级单位"
                                {...layout}
                                name="parentName"
                                // valuePropName="checked"
                            >
                               <Input disabled/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                label="是否启用"
                                {...layout}
                                name="isEnable" 
                                valuePropName="checked"
                            >
                                <Switch disabled={isCat}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="单位名称"
                                name="orgName"
                                rules={[
                                    { required: true,message:'请输入单位名称',whitespace: true },
                                    { max: 50,message:'最多输入50个字符'}
                                ]}
                            >
                                {/* <Input onBlur={(e)=>{nameCallback(e)}}/> */}
                                <Input disabled={isCat} placeholder={'请输入单位名称'} onChange={nameCallback.bind(this)}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="单位简称"
                                name="orgShortName" 
                                rules={[
                                    { max: 50,message:'最多输入50个字符'}
                                ]}
                            >
                                <Input disabled={isCat} placeholder={'请输入单位简称'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={0}>
                        <Col span={12}>
                                <Form.Item 
                                    {...layout}
                                    label="单位编码"
                                    name="orgNumber" 
                                    rules={[
                                        { required: true,message:'请输入单位编码'},
                                        { max: 50,message:'最多输入50个字符'},
                                        { validator: checkUserName.bind(this)}
                                    ]}
                                >
                                    <Input disabled={orgUg.id} placeholder={'请输入单位编码'}/>
                                </Form.Item>
                            </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="单位类型"
                                name="orgType" 
                                rules={[
                                ]}
                            >
                                <Select disabled={isCat} placeholder={'请输入单位类型'}>
                                    <Select.Option value="SCIENTIFIC_ORG">科研单位</Select.Option>
                                    <Select.Option value="ADMINISTRATIVE_ORG">行政单位</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="行业类别"
                                name="orgGroup" 
                                rules={[
                                ]}
                            >
                                <Select disabled={isCat} placeholder={'请选择行业类别'}>
                                    <Select.Option value="GOVERNMENT_ORG">政府机构</Select.Option>
                                    <Select.Option value="PUBLIC_ORG">事业单位</Select.Option>
                                </Select>
                            </Form.Item>
                    </Col>
                    <Form.Item 
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        label="单位描述"
                        name="orgDesc" 
                        rules={[
                            { max: 200,message:'最多输入200个字符'}
                        ]}
                    >
                        <TextArea disabled={isCat} placeholder={'请输入单位描述'}/>
                    </Form.Item>
                    <Row gutter={0}>
                        <Col span={12}>
                        </Col>  
                    </Row>
                    {isAdmin ? (<Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="单位管理员账号"
                                name="adminAccount" 
                                rules={[
                                    { required: true,message:'请输入单位管理员账号'},
                                    { max: 50,message:'最多输入50个字符'}
                                ]}
                            >
                                <Input disabled={isCat}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="单位管理员密码"
                                name="adminPwd" 
                                rules={[
                                    { required: true,message:'请输入单位管理员密码'},
                                ]}
                            >
                                <Input disabled={isCat}/>
                            </Form.Item>
                        </Col>
                    </Row>) : ''}
                    {isAdmin ? (<Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="单位管理员手机号"
                                name="adminPhone" 
                                rules={[
                                    { required: true,message:'请输入单位管理员手机号'},
                                    { max: 50,message:'最多输入50个字符'}
                                ]}
                            >
                                <Input disabled={isCat}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="单位管理员名称"
                                name="adminName" 
                                rules={[
                                    { required: true,message:'请输入单位管理员名称'},
                                    { max: 50,message:'最多输入50个字符'}
                                ]}
                            >
                                <Input disabled={isCat}/>
                            </Form.Item>
                        </Col>
                    </Row>) : ''}
                    {/* {!isCat&&
                        <Row className={styles.bt_group} style={{width: '200px',margin:'24px auto 0'}} >
                            <Button  type="primary" htmlType="submit" loading={loading.global}>
                                保存
                            </Button>
                            <Button onClick={onAddCancel} style={{marginLeft: 8}}>
                                取消
                            </Button>
                        </Row>
                    } */}
                </Form>  
            </div>
    </Modal>
    )
  }


  
export default (connect(({organization,layoutG,loading})=>({
    ...organization,
    ...layoutG,
    loading
  }))(addForm));
