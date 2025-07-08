import { connect } from 'dva';
import { Modal, Input,Button,message,Form,Row,Col,Switch,Select} from 'antd';
import _ from "lodash";
import styles from '../../unitInfoManagement/index.less';
import pinyinUtil from '../../../service/pinyinUtil';
import GlobalModal from '../../../componments/GlobalModal';
const FormItem = Form.Item;
const layout =  {labelCol: { span: 6 },wrapperCol: { span: 18 }};

function addpostForm ({dispatch,dataRule,onCancel,onSubmit,loading,setValues,isView}){
    const [form] = Form.useForm();
    dataRule.dataRuleType = dataRule.dataRuleId?dataRule.dataRuleType:'MODULE';

    function onFinish(values){
        Object.keys(values).forEach(function(key) {
            if(key!='dataRuleDesc'&&
               key!='dataRuleWeight'&&
               values[key]){
                values[key] = values[key].trim();
            }
        })
        onSubmit(values)
    }
    function onValuesChange(changedValues, allValues){
        setValues(allValues)
    }
    function checkCode(_,value){
        let regCode = /^[a-zA-Z0-9_]*$/;
        if(value&&!regCode.test(value)){
            return Promise.reject(new Error('支持字母、数字，下划线'))
        }else{
            return Promise.resolve();
        }

    }
    //输入完名称后获取简拼
    function nameCallback(e) {
        let name = `${pinyinUtil.getFirstLetter(e.target.value)}`
        if(!dataRule.dataRuleId){
            form.setFieldsValue({
                dataRuleCode: name,
            });
        }

    }
    return (
        <GlobalModal
            visible={true}
            widthType={1}
            incomingWidth={500}
            incomingHeight={300}
            title={isView?'查看数据规则定义':dataRule.dataRuleId?'修改数据规则定义':'新增数据规则定义'}
            onCancel={onCancel}
            className={styles.add_form}
            maskClosable={false}
            mask={false}
            centered
            getContainer={() =>{
                return document.getElementById('dataRuleMg_container')||false
            }}
            footer={
                !isView&&[<Button onClick={onCancel}>
                取消
            </Button>,<Button  type="primary" htmlType="submit" loading={loading} onClick={()=>{form.submit()}}>
                保存
            </Button>]}
        >
        <Form initialValues={dataRule} form={form} onFinish={onFinish}  onValuesChange={onValuesChange.bind(this)}>
            <Form.Item
                {...layout}
                label="数据规则名称"
                name="dataRuleName"
                rules={[
                    { required: true,message:'请填写数据规则名称' },
                    { pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]*$/, message: '只支持汉字英文数字'},
                    { max: 50,message:'最多输入50个字符'}
                ]}
            >
                <Input placeholder={'请填写数据规则名称'} onChange={nameCallback.bind(this)} disabled={isView}/>
            </Form.Item>

            <Form.Item
                {...layout}
                label="数据规则编码"
                name="dataRuleCode"
                rules={
                    [
                     { required: true,message:'请填写数据规则编码' },
                     { max: 50,message:'最多输入50个字符'},
                     { validator: checkCode.bind(this)}
                    ]
                }
            >
                <Input placeholder={'请填写数据规则编码'} disabled={dataRule.dataRuleId?true:false}/>
            </Form.Item>


            <Form.Item
                {...layout}
                label="数据规则简称"
                name="dataRuleShort"
                rules={[
                    { max: 50,message:'最多输入50个字符'},
                    { pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]*$/, message: '只支持汉字英文数字'},
                ]}
            >
                <Input placeholder={'请填写数据规则简称'} disabled={isView}/>
            </Form.Item>
            <Form.Item
                    {...layout}
                    label="数据规则类型"
                    name="dataRuleType"
                    rules={[
                        { required: true,message:'请选择数据规则类型' },
                    ]}
                >
                    <Select placeholder='请选择数据规则类型' disabled={dataRule.dataRuleId?true:false}>
                        <Select.Option value={'MODULE'}>模块资源规则</Select.Option>
                        <Select.Option value={'PUBLIC'}>公共规则</Select.Option>

                    </Select>
            </Form.Item>
            <Form.Item
                {...layout}
                label="数据规则描述"
                name="dataRuleDesc"
                rules={[
                    { max: 200,message:'最多输入200个字符'}
                ]}
            >
                <Input.TextArea placeholder={'请填写数据规则描述'} disabled={isView}/>
            </Form.Item>
            <Form.Item
                {...layout}
                label="权重值"
                name="dataRuleWeight"
                rules={[
                    { required: true,message:'请填写权重值' },
                    {
                        pattern:  /^\d{1,9}$|^\d{1,9}[.]\d{1,6}$/ ,
                        message: '最大支持9位整数，6位小数'
                    },
                ]}
            >
                <Input placeholder={'请填写权重值'} disabled={isView}/>
            </Form.Item>
        </Form>
    </GlobalModal>
    )
  }



export default (connect(({})=>({

  }))(addpostForm));
