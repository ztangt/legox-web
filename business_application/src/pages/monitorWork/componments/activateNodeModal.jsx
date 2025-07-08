import {Modal,Form,Checkbox,Row,Button} from 'antd';
import {connect} from 'dva';
import styles from './activateNodeModal.less';
import GlobalModal from '../../../componments/GlobalModal';
function ActivateNodeModal({dispatch,parentState,setParentState,loading}){
  const {activateNodes,activateBizInfoId} = parentState;
  const [form] = Form.useForm();
  const handelCanle=()=>{
    setParentState({
      isShowActivateNode:false,
      activateBizInfoId:''
    })
  }
  const onChangeCheck=(checkedValues)=>{
    let bizTaskId = form.getFieldValue('bizTaskId');
    console.log('checkedValues=',checkedValues);
    console.log('bizTaskId=',bizTaskId);
    form.setFieldsValue({bizTaskId:checkedValues[0]})
  }
  const saveActivateNode=(values)=>{
    console.log('values=',values);
    dispatch({
      type:"monitorWork/saveActivateNode",
      payload:{
        bizInfoId:activateBizInfoId,
        ...values
      },
      setState:setParentState,
      state:parentState,
      callback:()=>{
        handelCanle()
      }
    })
  }
  return (
    <GlobalModal
      visible={true}
      title="激活流程"
      onCancel={handelCanle}
      // onOk={()=>{form.submit()}}
      getContainer={() => {
        return document.getElementById('monitorWork_container')||false
        }}
      maskClosable={false}
      mask={false}
      widthType={5}
      footer={
        [
          <Button onClick={handelCanle}>取消</Button>,
          <Button onClick={()=>{form.submit()}} loading={loading.global}>确定</Button>,
        ]
      }
    >
      <Form onFinish={saveActivateNode} form={form}>
        <Form.Item label="可激活环节" name="bizTaskId">
          <Checkbox.Group style={{ width: '100%' }} onChange={onChangeCheck} className={styles.nodes_check}>
            {activateNodes.map((item)=>{
              return (
                <Row>
                  <Checkbox value={item.bizTaskId}>{item.actName}({item.userName})</Checkbox>
                </Row>
              )
            })}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </GlobalModal>
  )
}
export default connect(({monitorWork})=>{return {monitorWork}})(ActivateNodeModal)
