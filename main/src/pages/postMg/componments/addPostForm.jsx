import { connect } from 'dva';
import { Modal, Input,Button,message,Form,Row,Col,Switch,Select} from 'antd';
import _ from "lodash";
import styles from '../../unitInfoManagement/index.less';
import pinyinUtil from '../../../service/pinyinUtil';
import GlobalModal from '../../../componments/GlobalModal';

const FormItem = Form.Item;

function addpostForm ({dispatch,post,onCancel,onSubmit,loading,setValues,isView}){
    const [form] = Form.useForm();
    function onFinish(values){
        values['isEnable'] = values.isEnable?1:0;

        Object.keys(values).forEach(function(key) {
            if(key!='isEnable'&&
               values[key]&&
               key!='postDesc'){
                values[key] = values[key].trim()
            }
        })
        onSubmit(values)
    }

    function onValuesChange(changedValues, allValues){
        setValues(allValues)
    }
    //输入完名称后获取简拼
    function nameCallback(e) {
        let name = `${pinyinUtil.getFirstLetter(e.target.value)}`
        if(!post.id){
            form.setFieldsValue({
                postNumber: name,
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
            incomingHeight={240}
            title={isView?'查看岗位':post.id?'修改岗位':'新增岗位'}
            onCancel={onCancel}
            className={styles.add_form}
            maskClosable={false}
            mask={false}
            centered
            getContainer={() =>{
                return document.getElementById('postMg_container')||false
            }}
            footer={
                !isView&&[
                    <Button onClick={onCancel}>取消</Button>,
                    <Button  type="primary" htmlType="submit" loading={loading} onClick={()=>{form.submit()}}>保存</Button>,
            ]
            }
        >
        <Form initialValues={post} form={form} onFinish={onFinish} onValuesChange={onValuesChange.bind(this)}>

            <Row gutter={0} >
                <Col span={11}>
                    <Form.Item
                        label="&nbsp;&nbsp;&nbsp;所属单位"
                        name="parentOrgName"
                    >
                        <Input disabled/>
                    </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                    <Form.Item
                        label="&nbsp;&nbsp;&nbsp;是否启用"
                        name="isEnable"
                        valuePropName="checked"
                    >
                        <Switch disabled={isView}/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={0} >
                <Col span={11}>
                    <Form.Item
                        label="岗位名称"
                        name="postName"
                        rules={[
                            { required: true,message:'请输入岗位名称' },
                            { pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]*$/, message: '只支持汉字英文数字'},
                            { max: 50,message:'最多输入50个字符'}
                        ]}
                    >
                        <Input onChange={nameCallback.bind(this)} disabled={isView}/>
                    </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                    <Form.Item
                        label="所属部门"
                        name="parentDeptName"

                    >
                        <Input disabled/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={0}>
                <Col span={11}>
                    <Form.Item
                            label="岗位编码"
                            name="postNumber"
                            rules={[
                                { required: true,message:'请输入部门编码' },
                                { max: 50,message:'最多输入50个字符'},
                                { validator: checkCode.bind(this)}

                            ]}
                        >
                            <Input disabled={post.id}/>
                    </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                    <Form.Item
                        label="岗位简称"
                        name="postShortName"
                        rules={[
                            // { required: true,message:'请输入岗位简称' },
                            { max: 50,message:'最多输入50个字符'}
                        ]}
                    >
                        <Input disabled={isView}/>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item
                label="&nbsp;&nbsp;&nbsp;岗位描述"
                name="postDesc"
                rules={[
                    { max: 200,message:'最多输入200个字符'}
                ]}
            >
                <Input.TextArea disabled={isView}/>
            </Form.Item>
        </Form>
    </GlobalModal>
    )
  }



export default (connect(({})=>({

  }))(addpostForm));
