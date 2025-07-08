import { connect } from 'dva';
import { Modal, Input,Button,message,Form,Row,Col,Switch,Select,TreeSelect} from 'antd';
import _ from "lodash";
import styles from '../index.less'
import { useState,useEffect } from 'react'
import pinyinUtil from '../../../service/pinyinUtil';
import { sm2 } from 'sm-crypto';
import GlobalModal from '../../../componments/GlobalModal';

const servicePublicKey =
  '0416e39a2a5023e90a4f8d0c663b7f9e21bcd430c122e767150b201dd5935d8953a08227be68de4a04c46d46c6b2644d3042889404a7dcda92c7f211ee29f20c8e';
const FormItem = Form.Item;
// const [form] = Form.useForm();

function addOrgForm({dispatch,onSubmit,org,setValues,onCancel,loading,treeData,isView }){ 
    const [form] = Form.useForm();
    const [isDefaultAdmin, setIsDefaultAdmin] = useState(org.isDefaultAdmin);
    const [selectData,setSelectData]=useState(_.cloneDeep(treeData))
    const layout =  {labelCol: { span: 8 },wrapperCol: { span: 16 }};
    const layoutDes =  {labelCol: { span: 3 },wrapperCol: { span: 21}};
    const userInfo=JSON.parse(localStorage.getItem('userInfo'))
    useEffect(()=>{
        form.setFieldsValue(org)
    },[org.id])
    function onFinish(values){
        values['isDefaultAdmin'] = values.isDefaultAdmin?1:0
        values['isEnable'] = values.isEnable?1:0
        values['adminPwd'] = '04'+sm2.doEncrypt(values.adminPwd,servicePublicKey)

        Object.keys(values).forEach(function(key) {
            if(key!='isDefaultAdmin'&&
               key!='isEnable'&&
               values[key]&&
               key!='orgDesc'){
                values[key] = values[key].trim()
            }
        })
        if(userInfo.customType=='3'&&!org.id){
            dispatch({
                type:'unitInfoManagement/isOrgCenterShareOrg',
                payload:{
                    tenantId:userInfo.tenantId
                },
                callback:(data)=>{
                    if(!data){
                        Modal.confirm({
                            title: '当前租户组织中心为共享方案，当前无绑定（如需关联绑定其他已存在的组织中心请移至“云管理平台”），是否添加单位信息并创建新的组织中心？',
                            // content: '确认删除该单位',
                            okText: '确定',
                            cancelText: '取消',
                            mask: false,
                            maskClosable:false,
                            getContainer:() =>{
                              return document.getElementById('uintInfo_container');
                            },
                            onOk() {
                                onSubmit(values)
                            }
                          });
                    }else{
                        onSubmit(values)
                    }
                }
            })
        }else{
            onSubmit(values)
        }   
    }

    function onValuesChange(changedValues, allValues){
        setValues(allValues)
        setIsDefaultAdmin(allValues['isDefaultAdmin'])
    }

    function checkUserName(_,value){
        let regCode = /^[a-zA-Z0-9_]*$/;
        if(value&&!regCode.test(value)){
            return Promise.reject(new Error('支持字母、数字，下划线'))
        }else{
            return Promise.resolve();
        }
           
    }

    function checkPassword(_,value){
       
        let regCode = /^[a-zA-Z0-9!&@#$%*.]*$/;
        //且汉字字母数字下划线
        if(value&&!regCode.test(value)){
            return Promise.reject(new Error('支持字母、数字、特殊符号：!&@#$%*.'))
        }else{
            return Promise.resolve();
        }
           
    }

    //输入完名称后获取简拼
    function nameCallback(e) {
        let name = `${pinyinUtil.getFirstLetter(e.target.value)}`
        if(!org.id){
            console.log('name',name);

            form.setFieldsValue({
                orgNumber: name,
            });
        }
    }
    const ctlgTreeFn=(tree)=>{
        tree.map((item)=>{
          item.value=item.id;
          item.title=item.orgName;
          if(item.children&&item.children[0].id){
            ctlgTreeFn(item.children)
          }
        })
        return tree;
      }
      const loopTree = (data, id, newData) => {
        data.forEach((item) => {
          if (item.id == id) {
            item.children = newData;
          } else {
            if (item.children) {
              loopTree(item.children, id, newData);
            }
          }
        });
        return data;
      };
      //展开树节点
      const onTreeExpand=(expandedKeys)=>{
        dispatch({
            type: 'unitInfoManagement/getOrgTreeList',
            payload: {
                // nodeId: expandedKeys[expandedKeys.length-1],
                // nodeType:'ORG',
                // start:1,
                // limit:200,
                // isEnable: 1
                parentId:expandedKeys[expandedKeys.length-1],
                start:1,
                limit:200,
                orgKind: 'ORG',
                searchWord:'',
                isEnable: 1
            },
            callback:(data)=>{
                data.forEach((item) => {
                    if (item.isParent == '1') {
                        item.children = [{ key: '-1' }];
                    }
                });
                setSelectData([...loopTree(selectData,expandedKeys[expandedKeys.length - 1],data)])
            }
          });
      }
      //选择树
      const selectTree=(value, node, extra)=>{
        console.log(value, node, extra,'value, node, extra');
        org.parentId=value
        org.parentName=node.orgName
        dispatch({
            type: 'unitInfoManagement/updateStates',
            payload: {
              org
            },
          });
      }
      const changeValue=(val,key)=>{
        if(key.length==0){
            org.isEnable=false
            org.parentId=''
            org.parentName=''
        }else{
            org.isEnable=true
        }
        dispatch({
            type:'unitInfoManagement/updateStates',
            payload:{
                org
            }
        })
      }

        return (
            <GlobalModal
                visible={true}
                // width={800}
                widthType={1}
                incomingWidth={800}
                incomingHeight={300}
                title={isView?'查看单位':org.id?'修改单位':'新增单位'}
                onCancel={onCancel}
                className={styles.add_form}
                maskClosable={false}
                mask={false}
                centered
                getContainer={() =>{
                    return document.getElementById('uintInfo_container')||false
                }}
                // bodyStyle={{height:300}}
                footer={
                    !isView&&[
                       
                    <Button onClick={onCancel} style={{marginLeft: 8}}>
                        取消
                    </Button>,
                     <Button  type="primary" htmlType="submit" loading={loading} onClick={()=>{form.submit()}}>
                     保存
                 </Button>,
                    ]
                }
            >
            <Form
                form={form} 
                initialValues={org} 
                onFinish={onFinish.bind(this)} 
                onValuesChange={onValuesChange.bind(this)}
                {...layout}
            >
            
                <Row gutter={0} >
                    <Col span={11}>
                        <Form.Item 
                                label="上级单位"
                                name="parentName" 
                            >
                            {/* <Input disabled={org.id?true:false}/> */}
                            <TreeSelect
                                disabled={org.id?true:false}
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeData={ctlgTreeFn(selectData)}
                                onTreeExpand={onTreeExpand}
                                allowClear
                                onSelect={selectTree}
                                onChange={changeValue}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}>
                        <Form.Item 
                                label="是否启用"
                                name="isEnable"
                                valuePropName="checked"
                            >
                            <Switch disabled={!org.parentName}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={0} >

                    <Col span={11}>
                        <Form.Item 
                                label="单位名称"
                                name="orgName" 
                                rules={[
                                    { required: true,message:'请输入单位名称',whitespace: true},
                                    { max: 50,message:'最多输入50个字符'}

                                ]}
                            >
                            <Input placeholder='请输入单位名称' onChange={nameCallback.bind(this)} disabled={isView?true:false}/>
                        </Form.Item>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}>
                        <Form.Item 
                                label="单位简称"
                                name="orgShortName" 
                                rules={[
                                    // { required: true,message:'请输入单位简称' },
                                    { max: 50,message:'最多输入50个字符'}
                            
                                ]}
                            >
                                <Input placeholder='请输入单位简称' disabled={isView?true:false}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={0}>
                    <Col span={11}>
                        <Form.Item 
                            label="单位编码"
                            name="orgNumber" 
                            rules={[
                                { required: true,message:'请输入单位编码' },
                                { max: 50,message:'最多输入50个字符'},
                                { validator: checkUserName.bind(this)}

                            ]}
                        >
                            <Input placeholder='请输入单位编码' disabled={org.id}/>
                        </Form.Item>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}>
                        <Form.Item 
                            label="单位类型"
                            name="orgType" 
                            rules={[
                                // { required: true,message:'请选择单位类型' },

                            ]}
                        >
                            <Select placeholder='请选择单位类型' disabled={isView?true:false}>
                                <Option value="SCIENTIFIC_ORG">科研单位</Option>
                                <Option value="ADMINISTRATIVE_ORG">行政单位</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={0}>
                    <Col span={11}>
                        <Form.Item 
                            label="行业类别"
                            name="orgGroup" 
                            rules={[
                                // { required: true,message:'请选择行业类别' }
                            ]}
                        >
                            <Select placeholder='请选择行业类别' disabled={isView?true:false}>
                                <Option value="GOVERNMENT_ORG">政府机构 </Option>
                                <Option value="PUBLIC_ORG">事业单位</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}>
                        {/* <Form.Item 
                            label="默认生成管理员"
                            name="isDefaultAdmin" 
                            valuePropName="checked"
                        >
                            <Switch disabled={org.id?true:false}/>
                        </Form.Item> */}
                    </Col>
                    
                </Row>
                <Form.Item 
                    label="单位描述"
                    name="orgDesc" 
                    className={styles.form_item}
                    {...layoutDes}
                    rules={[
                        { max: 200,message:'最多输入200个字符'}
                    ]}
                >
                    <Input.TextArea placeholder='请输入单位描述' disabled={isView?true:false}/>
                </Form.Item>
                {
                    isDefaultAdmin?
                    <Row gutter={0}>
                        <Col span={11}>
                            <Form.Item 
                                label="用户账号"
                                name="adminAccount" 
                                rules={[
                                    { required: true,message:'请填写用户账号' },
                                    { max: 50,message:'最多输入50个字符'},
                                    { validator: checkUserName.bind(this)}
                                ]}
                            >
                                <Input placeholder='请填写用户账号' disabled={org.id?true:false}/>
                            </Form.Item>
                        </Col>
                        <Col span={2}></Col>
                        <Col span={11}>
                            <Form.Item 
                                label="账号密码"
                                name="adminPwd" 
                                rules={[
                                    { required: true,message:'请填写账号密码' },
                                    { max: 50,message:'最多输入50个字符'},
                                    { validator: checkPassword.bind(this)}
                                ]}
                            >
                                <Input.Password placeholder='请填写账号密码' disabled={org.id?true:false}/>

                            </Form.Item>
                        </Col>
                    </Row>:''
                }
                
                {
                    isDefaultAdmin?
                    <Row gutter={0}>
                        <Col span={11}>
                            <Form.Item 
                                label="账号姓名"
                                name="adminName" 
                                rules={[
                                    { required: true,message:'请填写账号姓名' },
                                    { max: 20,message:'最多输入20个字符'}
                                ]}
                            >
                                <Input placeholder='请填写账号姓名' disabled={org.id?true:false}/>
                            </Form.Item>
                        </Col>
                        <Col span={2}></Col>
                        <Col span={11}>
                            <Form.Item 
                                    label="手机号"
                                    name="adminPhone" 
                                    rules={[
                                        { required: true,message:'请填写手机号' },
                                 
                                        {
                                            max: 11,
                                            message: '最长11位!',
                                        },
                                       
                                        {
                                            pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
                                            message: '请输入正确的手机号',
                                        },
                                    ]}
                                >
                                    <Input placeholder='请填写手机号' disabled={org.id?true:false}/>
                            </Form.Item>
                        </Col>
                    </Row>:''
                }
            </Form>
        </GlobalModal>
        )
    
  }


  
export default connect(({unitInfoManagement})=>({unitInfoManagement}))(addOrgForm);
