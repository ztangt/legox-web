import { connect } from 'dva';
import React, { useState } from 'react';
import { Button, Space, Upload,Avatar ,message,Row, Col,Input ,Switch,Select,DatePicker,Form,Radio,Modal,Spin} from 'antd';
import _ from "lodash";
import styles from '../index.less';
import { history } from 'umi';
const FormItem = Form.Item;
const { TextArea } = Input;
import pinyinUtil from '../../../service/pinyinUtil';
let pandedRowKeys=[]   
function addForm ({dispatch,loading,location,searchObj,onAddCancel,isCat}){
    const pathname = '/organization';
    const { onAssSubmit,organizationId,deptItemUg,orgId,deptUg,orgClildrens, orgUg, selectedOrgRows} = searchObj[pathname];
    const currentPage = searchObj[pathname]['users'].currentPage;
    const limit = searchObj[pathname]['users'].limit;
    const [fields, setFields] = useState([
        // {
        //     name: ['isEnable'],
        //     value: true,
        // },
    ]);
    const [form] = Form.useForm();
    const layout =  {labelCol: { span: 8 },wrapperCol: { span: 16 }};
    function onFinish(values){
        pandedRowKeys=[];
        values.isEnable = values.isEnable ? 1:0;
        values.orgCenterId = organizationId;
        values.orgNumber = values.orgNumber ? values.orgNumber.trim() : '';
        values.deptName = values.deptName ? values.deptName.trim() : '';
        values.deptShortName = values.deptShortName ? values.deptShortName.trim() : '';
        values.parentId = deptItemUg.id;
        if(deptUg.id){
            // 修改部门信息
            values.id = deptUg.id;
            values.orgId = deptUg.orgId;
            dispatch({
                type:"organization/updateDept",
                payload:{
                    ...values
                },
                callback:function(){
                    // dispatch({
                    //     type:"organization/getOrgChildren",
                    //     payload:{
                    //         nodeType:'DEPT',
                    //         orgCenterId:deptUg.orgCenterId,
                    //         nodeId:deptUg.parentId?deptUg.parentId:deptUg.orgId,
                    //         start:currentPage,
                    //         limit:limit,
                    //         onlySubDept: 1
                    //     },
                    //     callback: function() {
                    //         if(!deptUg.parentId) {
                    //             dispatch({
                    //                 type: 'organization/updateStates',
                    //                 payload:{
                    //                     expandOrgList: [],
                    //                 }
                    //             })
                    //         }
                    //     }
                    // })
                    dispatch({
                        type: 'organization/getOrgTreeList',
                        payload: {
                          parentId:deptUg.parentId?deptUg.parentId:deptUg.orgId,
                          start:1,
                          limit:1000,
                          orgKind: 'ORG_',
                          searchWord:''
                        },
                        callback: function() {
                            if(!deptUg.parentId) {
                                dispatch({
                                    type: 'organization/updateStates',
                                    payload:{
                                        expandOrgList: [],
                                    }
                                })
                            }
                        }
                    });
                }
            }) 
        }else{
            // 新增部门信息
            values.orgId = deptItemUg.parentId!=0?deptItemUg.parentId:deptItemUg.id; // 所属单位的id
            dispatch({
                type:"organization/addDept",
                payload:{
                    ...values
                },
                callback:function(){
                    if(deptItemUg && deptItemUg.parentId) {
                        // dispatch({
                        //     type:"organization/getOrgChildren",
                        //     payload:{
                        //         nodeType:'DEPT',
                        //         orgCenterId:deptItemUg.orgCenterId,
                        //         nodeId:deptItemUg.id,
                        //         start:currentPage,
                        //         limit:limit
                        //     }
                        // })
                        dispatch({
                            type: 'organization/getOrgTreeList',
                            payload: {
                              parentId:deptItemUg.id,
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
        if(!deptUg.id){
            form.setFieldsValue({
                orgNumber: name,
            });
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
            title={isCat?'部门查看':deptUg.id ? '部门修改' : '新增部门'}
            onCancel={onAddCancel}
            className={styles.add_form}
            mask={false}
            maskClosable={false}
            getContainer={() =>{
                return document.getElementById('organization_container')
            }}
            footer={
                !isCat&&[
                    <Button onClick={onAddCancel}>
                    取消
                </Button>,
                    <Button  type="primary" htmlType="submit" loading={loading.global} onClick={()=>{form.submit()}}>
                    保存
                </Button>
                
                ]
            }
        >
            <div >
                <Form  onFinish={onFinish} fields={fields} form={form} initialValues={deptUg}>
                    <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                label="所属单位"
                                {...layout}
                                name="orgName" 
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
                                <Switch  disabled={isCat}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="部门名称"
                                name="deptName" 
                                rules={[
                                    { required: true,message:'请输入部门名称',whitespace: true},
                                    { max: 50,message:'最多输入50个字符'}
                                ]}
                            >
                                {/* <Input onBlur={(e)=>{nameCallback(e)}}/> */}
                                <Input placeholder={'请输入部门名称'} onChange={nameCallback.bind(this)}  disabled={isCat}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="上级部门"
                                name="parentName" 
                            >
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={0}>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="部门编码"
                                name="orgNumber" 
                                rules={[
                                    { required: true,message:'请输入部门编码'},
                                    { max: 50,message:'最多输入50个字符'},
                                    { validator: checkUserName.bind(this)}
                                ]}
                            >
                                <Input placeholder={'请输入部门编码'} disabled={deptUg.id}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...layout}
                                label="部门简称"
                                name="deptShortName" 
                                rules={[
                                    { max: 50,message:'最多输入50个字符'}
                                ]}
                            >
                                <Input placeholder={'请输入部门简称'}  disabled={isCat}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item 
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        label="部门描述"
                        name="deptDesc" 
                        rules={[
                            { max: 200,message:'最多输入200个字符'}
                        ]}
                    >
                        <TextArea placeholder={'请输入部门描述'}  disabled={isCat}/>
                    </Form.Item>
                    {
                        deptUg.id?
                        <Form.Item 
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        label="部门树路径"
                        name="deptFullName" 
                        >
                            <Input disabled/>
                        </Form.Item>:''
                    }
                    {/* {!isCat&&
                        <Row className={styles.bt_group} style={{width: '200px',margin:'24px auto 0'}}>
                            <Button  type="primary" htmlType="submit" loading={loading.global} >
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
