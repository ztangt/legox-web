import { connect } from 'dva';
import { Modal, Input,Button,message,Form,Row,Col,Switch,Select} from 'antd';
import _ from "lodash";
import styles from '../../unitInfoManagement/index.less';
import pinyinUtil from '../../../service/pinyinUtil';
import GlobalModal from '../../../componments/GlobalModal';
const FormItem = Form.Item;

function addDeptForm ({dispatch,dept,onCancel,onSubmit,loading,setValues,isCat}){
    console.log('dept',dept);
    const [form] = Form.useForm();
    const layouts = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

    function onFinish(values){
        for(let key in values){
            if(key!='isEnable'&&typeof values[key]=='string' && key!='deptDesc'){
              values[key] = values[key].trim()
            }
        }
        values['isEnable'] = values.isEnable?1:0;
        // values['deptName'] = values['deptName'].trim();
        // values['deptShortName'] = values['deptShortName'].trim();
        // values['orgNumber'] = values['orgNumber'].trim();        
        onSubmit(values)
    }
    function onValuesChange(changedValues, allValues){
        setValues(allValues)
    }
    //输入完名称后获取简拼
    function nameCallback(e) {
        let name = `${pinyinUtil.getFirstLetter(e.target.value)}`
        if(!dept.id){
            form.setFieldsValue({
                orgNumber: name,
            });
        }
    }

    function checkCode(_,value){
        let regCode = /^[a-zA-Z0-9_]*$/;
        if(value&&!regCode.test(value)){
            return Promise.reject(new Error('支持字母、数字，下划线'))
        }else{
            return Promise.resolve();
        }
            
    }
    return (
        <GlobalModal
            visible={true}
            widthType={1}
            incomingWidth={800}
            incomingHeight={300}
            title={isCat?'查看部门':dept.id?'修改部门':'新增部门'}
            onCancel={onCancel}
            className={styles.add_form}
            maskClosable={false}
            mask={false}
            getContainer={() =>{
                return document.getElementById('deptMg_container')||false
            }}
            centered
            footer={
                !isCat&&[
                    <Button onClick={onCancel} style={{marginLeft: 8}}>
                        取消
                    </Button>,
                    <Button  type="primary" htmlType="submit" loading={loading} onClick={()=>{form.submit()}}>
                        保存
                    </Button>
                ]
            }
        >
        <Form initialValues={dept} onFinish={onFinish} onValuesChange={onValuesChange.bind(this)} form={form} {...layouts}>
        
            <Row gutter={0} >
                <Col span={11}>
                    <Form.Item 
                        label="所属单位"
                        name="orgName" 
                    >
                        <Input disabled/>
                    </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                    <Form.Item 
                        label="是否启用"
                        name="isEnable"
                        valuePropName="checked"
                    >
                        <Switch disabled={isCat}/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={0} >

                <Col span={11}>
                    <Form.Item 
                        label="部门名称"
                        name="deptName" 
                        rules={[
                            { required: true,message:'请输入部门名称', whitespace: true},
                            // { pattern: /^[^\s]*$/,message: '禁止输入空格'},
                            { max: 50,message:'最多输入50个字符'}
                        ]}
                    >
                        <Input placeholder='请输入部门名称' onChange={nameCallback.bind(this)} disabled={isCat}/>
                    </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                    <Form.Item 
                        label="上级部门"
                        name="parentName" 
                    >
                        <Input disabled/>
                    </Form.Item>
                </Col>
                
            </Row>
            <Row gutter={0}>
                <Col span={11}>
                    <Form.Item 
                    label="部门编码"
                    name="orgNumber" 
                    rules={[
                        { required: true,message:'请输入部门编码' },
                        // { pattern: /^[^\s]*$/,message: '禁止输入空格'},
                        { max: 50,message:'最多输入50个字符'},
                        { validator: checkCode.bind(this)}
                    ]}
                    >
                        <Input placeholder='请输入部门编码' disabled={dept.id}/>
                    </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                    <Form.Item 
                        label="部门简称"
                        name="deptShortName" 
                        rules={[
                            // { required: true,message:'请输入部门简称' },
                            // { pattern: /^[^\s]*$/,message: '禁止输入空格'},
                            { max: 50,message:'最多输入50个字符'}

                        ]}
                    >
                        <Input placeholder='请输入部门简称' disabled={isCat}/>
                    </Form.Item>
                </Col>
                
            </Row>
            <Row gutter={0}>
                <Col span={11}>
                    <Form.Item 
                    label="部门描述"
                    name="deptDesc" 
                    rules={[
                        // { pattern: /^[^\s]*$/,message: '禁止输入空格'},
                        { max: 200,message:'最多输入200个字符'}
                    ]}
                    >
                        <Input.TextArea placeholder='请输入部门描述' disabled={isCat}/>
                    </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                    {
                        dept.id?
                        <Form.Item 
                        label="部门树路径"
                        name="deptFullName" 
                        >
                            <Input disabled/>
                        </Form.Item>:''
                    }
                </Col>
            </Row>
        </Form>
    </GlobalModal>
    )
  }


  
export default (connect(({})=>({

  }))(addDeptForm));
