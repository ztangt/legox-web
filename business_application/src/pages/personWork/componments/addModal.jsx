import {Modal,Form,Input,Button} from 'antd';
import {connect} from 'umi';
import styles from './addModal.less'
function AddModal({dispatch,setParentState,parentState}){
  const {selectUpdateCategoryInfo,selectCategorId}= parentState;
  const [form] = Form.useForm();
  const handelCancle=()=>{
    setParentState({
      isShowAddModal:false
    })
  }
  //提交
  const sumbitForm=(values)=>{
    if(selectUpdateCategoryInfo.key){
      dispatch({
        type:"personWork/updateCategory",
        payload:{
          categoryId:selectUpdateCategoryInfo.key,
          ...values
        },
        setState:setParentState,
        state:parentState
      })
    }else{
      dispatch({
        type:"personWork/addCategory",
        payload:{
          parentId:selectCategorId!='all'?selectCategorId:"0",
          ...values
        },
        setState:setParentState,
        state:parentState
      })
    }
  }
  console.log('selectUpdateCategoryInfo=',selectUpdateCategoryInfo);
  return (
    <Modal
      visible={true}
      onCancel={handelCancle}
      width={400}
      bodyStyle={{height:110}}
      title={selectUpdateCategoryInfo&&selectUpdateCategoryInfo.key?'修改事项分类':'新增事项分类'}
      getContainer={() =>{
        return document.getElementById('add_work_modal')
      }}
      maskClosable={false}
      mask={false}
      className={styles.addModal}
      footer={[
        <Button key="cancel" onClick={handelCancle}>取消</Button>,
        <Button key="submit" onClick={()=>{form.submit()}} type="primary">确定</Button>,

      ]}
    >
      <Form
        name="add_category"
        onFinish={sumbitForm}
        form={form}
        initialValues={{
          categoryName:selectUpdateCategoryInfo?selectUpdateCategoryInfo.categoryName:""
        }}
      >
        <Form.Item
          name="categoryName"
          label="事项分类"
          rules={[{required:true,message:"请输入事项分类"},
            {max:'50',message:'最大长度不能超过50'}]}
        >
          <Input/>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default connect(({personWork,loading})=>{return {personWork,loading}})(AddModal)
