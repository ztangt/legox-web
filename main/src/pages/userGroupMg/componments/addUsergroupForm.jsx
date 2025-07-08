import { connect } from 'dva';
import { Modal, Input,Button,message,Form,Row,Col,Switch,Select} from 'antd';
import _ from "lodash";
import styles from '../../unitInfoManagement/index.less';
import pinyinUtil from '../../../service/pinyinUtil';
import GlobalModal from '../../../componments/GlobalModal';
function addpostForm ({dispatch,ug,onCancel,onSubmit,loading,setValues,isView}){
    const [form] = Form.useForm();
    const layout={labelCol:{span:6},wrapperCol:{span:18}}
    function onFinish(){
        const values=form.getFieldValue()
        values['isEnable'] = values.isEnable?1:0;
        values['ugName'] = values['ugName'].trim();
        values['ugCode'] = values['ugCode'].trim();
        onSubmit(values)
    }
    function onValuesChange(changedValues, allValues){
        setValues(allValues)
    }
    function onChangeName(e){
        let name = `${pinyinUtil.getFirstLetter(e.target.value,false)}`
        if(!ug.id){
            form.setFieldsValue({
                ugCode: name,
            });
        }
    }
    //验证code
    const validatorCode=(rule, value)=>{
      let reg=/^[0-9a-zA-Z_]*$/;
      if(value&&!reg.test(value)){
        return Promise.reject(new Error('字符格式：数字、字母、下划线'));
      }else{
        return Promise.resolve();
      }
    }
    return (
        <GlobalModal
            visible={true}
            widthType={1}
            incomingWidth={800}
            incomingHeight={200}
            title={isView?'查看用户组':ug.id?'修改用户组':'新增用户组'}
            onCancel={onCancel}
            className={styles.add_form}
            maskClosable={false}
            mask={false}
            centered
            getContainer={() =>{
                return document.getElementById('userGroupMg_container')||false
            }}
            footer={
                !isView&&[
                    <Button onClick={onCancel}>
                    取消
                </Button>,
                    <Button  type="primary" htmlType="submit" loading={loading} onClick={()=>{form.submit()}}>
                    保存
                </Button>
                ]
            }
        >
        <Form
          onFinish={onFinish}
          initialValues={ug}
          onValuesChange={onValuesChange.bind(this)}
          form={form}
          className={styles.user_form}
        >

            <Row gutter={16} >
               <Col span={12}>
                <Form.Item
                    {...layout}
                    label="用户组名称"
                    name="ugName"
                    rules={[
                        { required: true,message:'请填写用户组名称' },
                        // pattern: /^(?:0|[1-9]\d?)$/,
                        { pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]*$/,message: '只支持汉字英文数字'},
                        { max: 50,message:'最多输入50个字符'}
                    ]}
                >
                    <Input placeholder={'请填写用户组名称'} onChange={onChangeName} disabled={isView}/>
                </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        {...layout}
                        label="是否启用"
                        name="isEnable"
                        valuePropName="checked"
                    >
                        <Switch disabled={isView}/>
                    </Form.Item>

                </Col>
            </Row>
            <Row gutter={16} >
                <Col span={12}>
                    <Form.Item
                        {...layout}
                        label="用户组编码"
                        name="ugCode"
                        rules={[
                            { required: true,message:'请填写用户组编码' },
                            // { pattern: /^[^\s]*$/,message: '禁止输入空格'},
                            { max: 50,message:'最多输入50个字符'},
                            {validator:validatorCode}
                        ]}
                    >
                        <Input placeholder={'请填写用户组编码'}  disabled={ug.id?true:false}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        {...layout}
                        label="用户组描述"
                        name="ugDesc"
                        rules={[
                            // { pattern: /^[^\s]*$/,message: '禁止输入空格'},
                            { max: 200,message:'最多输入200个字符'}
                        ]}
                    >
                        <Input.TextArea placeholder={'请填写用户组描述'} disabled={isView}/>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    </GlobalModal>
    )
  }



export default (connect(({})=>({

  }))(addpostForm));
