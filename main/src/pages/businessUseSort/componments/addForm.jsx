import { connect } from 'dva';
import { Modal, Input,Button,message,Form,Row,Col,Switch,Select} from 'antd';
import _ from "lodash";
import styles from '../index.less';
import { history } from 'umi';
import pinyinUtil from '../../../service/pinyinUtil';
import GlobalModal from '../../../componments/GlobalModal';
const FormItem = Form.Item;
const { TextArea } = Input;
function addForm({onAddSubmit,addObj,parentStrCtlgId,setValues,onCancel,loading,parentStrCtlgName}){
    const [form] = Form.useForm();
    const layout =  {labelCol: { span: 5 },wrapperCol: { span: 19 }};
    let fields = [{
        name: ['parentStrCtlgName'],
        value: parentStrCtlgName,
    },
    {
        name: ['ctlgId'],
        value: parentStrCtlgId,
    }]
    function onFinish(values){
        // const { onAddSubmit,addObj,parentStrCtlgId} =this.props
        values['ctlgName'] = values['ctlgName'].trim();
        values['ctlgServiceNum'] = values['ctlgServiceNum'].trim();
        if(addObj.nodeId){
            onAddSubmit(values,'修改')
        }else{
            values['parentStrCtlgId'] = parentStrCtlgId.length == 1 ? parentStrCtlgId[0] : ''
            onAddSubmit(values,'新增')
        }
        
    }

    function onValuesChange(changedValues, allValues){
        // const { setValues} =this.props
        setValues(allValues)
    }

    //输入完名称后获取简拼
    function nameCallback(e) {
        let name = `${pinyinUtil.getFirstLetter(e.target.value)}`
        if(!addObj.nodeId){
            form.setFieldsValue({
                ctlgServiceNum: name,
            });
        }
    }
    function checkUserName(_,value){
        let regCode = /^[a-zA-Z0-9_]*$/;
        if(value.trim() == ''){
            return Promise.reject(new Error('请输入业务编码'))
        }else if
        (value&&!regCode.test(value)){
            return Promise.reject(new Error('支持字母、数字，下划线'))
        }

            return Promise.resolve();
        
           
    }
      
       
    
    return (
        <GlobalModal
            visible={true}
            widthType={1}
            incomingWidth={500}
            incomingHeight={240}
            title={addObj.nodeId?'修改业务应用类别':'新增业务应用类别'}
            onCancel={onCancel}
            className={styles.add_form}
            mask={false}
            maskClosable={false}
            getContainer={() =>{
                return document.getElementById(`${history.location.pathname.split("/")[2]}_container`)
            }}
            footer={
                [
                <Button onClick={onCancel}>
                    取消
                </Button>,
                <Button  type="primary" htmlType="submit" loading={loading.global} onClick={()=>{form.submit()}}>
                    保存
                </Button>
                ]
            }
        >
        <Form 
            fields={fields}
            initialValues={addObj} 
            onFinish={onFinish.bind(this)} 
            onValuesChange={onValuesChange.bind(this)}
            form={form} 
        >
            <Form.Item 
                label="&nbsp;&nbsp;分类名称"
                name="ctlgName"
                {...layout}
                rules={[
                    { required: true,message:'请输入分类名称' },
                    { max: 50,message:'最多输入50个字符'},
                    { whitespace: true, message: '请输入分类名称'}
                ]}
            >
                <Input onChange={nameCallback.bind(this)}/>
            </Form.Item>
            <Form.Item 
                label="&nbsp;&nbsp;业务编码"
                name="ctlgServiceNum"
                {...layout}
                rules={[
                    { required: true,message:'' },
                    { max: 50,message:'最多输入50个字符'},
                    // { whitespace: true, message: '请输入业务编码'},
                    { validator: checkUserName.bind(this)}
                ]}
            >
                <Input disabled={addObj.nodeId ? true : false}/>
            </Form.Item>
            {/* {
                addObj.nodeId? (<Form.Item 
                    label="&nbsp;&nbsp;本级分类"
                    name="ctlgId"
                    {...layout}
                >
                    <Input disabled/>
                </Form.Item>) : (<Form.Item 
                label="&nbsp;&nbsp;上级分类"
                name="parentStrCtlgId"
                {...layout}
            >
                <Input disabled/>
            </Form.Item>)
            } */}
           <Form.Item 
                label="&nbsp;&nbsp;上级分类"
                name="parentStrCtlgName"
                {...layout}
            >
                <Input disabled/>
            </Form.Item>
            
            <Form.Item 
                label="&nbsp;&nbsp;描述:"
                name="ctlgDesc"
                {...layout}
                rules={[
                    { max: 200,message:'最多输入200个字符'}
                ]}
            >
                <TextArea />
            </Form.Item>     
        </Form>
    </GlobalModal>
    )
    
}


  
export default (connect(({businessUseSort,loading})=>({
    ...businessUseSort,
    loading
  }))(addForm));
