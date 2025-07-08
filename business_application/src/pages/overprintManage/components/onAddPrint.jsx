import {useRef,useState,useEffect} from 'react'
import {Form,Input,Button} from 'antd'
import {connect} from 'umi'
import GlobalModal from '../../../componments/GlobalModal'
import OnOrgModal from './onOrgModal'
import styles from '../index.less'


// 新增
const onAddPrint = ({dispatch,onCancel,state,callback,overprintTemplate,getRefsCallback})=>{
  const {selectedDatas,selectedDataPrintKeys,selectedDataPrint}=overprintTemplate
    const formRef = useRef(null)
    const [orgShow,setOrgShow] = useState(false)
    const formItemLayout = {
        labelCol: {
          xs: {
            span: 24,
          },
          sm: {
            span: 5,
          },
        },
        wrapperCol: {
          xs: {
            span: 24,
          },
          sm: {
            span: 18,
          },
        },
    };
    useEffect(()=>{
      if(formRef){
        getRefsCallback&&getRefsCallback(formRef)
      }
      formRef.current.setFieldsValue({
        templateTypeName: state&&state.id? state.templateTypeName:''
      })
    },[])
    useEffect(()=>{ 
      formRef.current.setFieldsValue({
        useCompany: selectedDataPrint,
      })
    },[selectedDataPrint])

    // 结束
    function onFinish(values){
      const ids = selectedDataPrintKeys
      const obj = {...values,ids}
      callback&&callback(obj)
    }

    // 点击确定
    function onConfirm(){
        formRef.current.submit()
    } 
    // 选择用户单位弹窗
    function focusComponent(e){
        setOrgShow(true)
    }
    function cancelRelevance(){
      setOrgShow(false)
    } 

    return (
      <div>
         <GlobalModal
            title={state&&state.id?'编辑':"新增"}
            widthType={1}
            visible={true}
            onCancel={()=>onCancel(formRef)}
            incomingHeight={300}
            mask={false}
            maskClosable={false}
            
            getContainer={() => {
                return document.getElementById('overPrint')||false
            }}
            footer={[
                <Button onClick={()=>onCancel(formRef)} key='cancel'>取消</Button>, 
                <Button key={'primary'} type='primary' htmlType='submit' onClick={() => onConfirm()}>确定</Button>,
            ]}
        >
            <Form 
                {...formItemLayout}
                onFinish={onFinish}
                ref={formRef}
            >
                <Form.Item label="套红类型"
                    name="templateTypeName"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                >
                    <Input placeholder='请输入套红类型'/>

                </Form.Item>
                <Form.Item 
                    label="使用单位"
                    name="useCompany"
                    rules={[
                        {
                          required: true,
                        },
                    ]}
                >
                    <Input placeholder='默认当前用户单位，可修改，可多选'onFocus={focusComponent}/>

                </Form.Item>
            </Form>
          </GlobalModal> 
          {orgShow&&<OnOrgModal cancelRelevance={cancelRelevance}/>}          
      </div>
    )
}


export default connect(({overprintTemplate})=>({overprintTemplate}))(onAddPrint)