import {Table,Button,message,Form,Input,Select} from 'antd';
import {connect,history} from 'umi';
import ButtonAuth from './buttonAuth';
import {SyncOutlined} from "@ant-design/icons";
import GlobalModal from '../../../componments/GlobalModal';
function ModalButton({query,dispatch,applyModelConfig,actId,parentState,setParentState}){
  const bizSolId = query.bizSolId;
  const {bizFromInfo,procDefId,selectButtonGroupInfo}=parentState;
  const [form]=Form.useForm();
  const handelCancle=()=>{
    setParentState({
      isShowButtonModal:false,
      selectButtonGroupInfo:{}
    })
  }
  //显示按钮方案弹框
  const showButtonGroupFn=()=>{
    setParentState({
      isShowButtonGroup:true
    })
  }
  const getButtonAuth=()=>{
    if(bizFromInfo.buttonGroupId){
      dispatch({
        type:"applyModelConfig/getReButtonAuth",
        payload:{
          bizSolId,
          procDefId,
          actId:0,
          isRefresh:1,
          buttonGroupId:bizFromInfo.buttonGroupId,
          deployFormId:bizFromInfo.formDeployId
        },
        callback:(newButtonList)=>{
          //将刷新后获取的新的按钮默认值
          newButtonList.map((item)=>{
            form.setFields([
              {
                name: `isShow_${item.buttonId}`,
                value: item.isShow?(item.isShow=='DISPLAY'?true:false):true,
              },
              {
                name: `authSource_${item.buttonId}`,
                value: item.authSource,
              },
              {
                name: `rangeType_${item.buttonId}`,
                value: item.range?item.range:'ALL',
              },
              {
                name: `old_range_${item.buttonId}`,
                value: item.range?item.range:'ALL',
              },
              {
                name: `rangeContentId_${item.buttonId}`,
                value: item.rangeContentId,
              },
              {
                name: `rangeContentValue_${item.buttonId}`,
                value: item.rangeContentValue?item.rangeContentValue:'所有人',
              },
            ])
          })
        },
        extraParams:{
          state:parentState,
          setState:setParentState
        }
      })
    }
  }
  return (
    <GlobalModal
      visible={true}
      title="绑定按钮方案"
      onCancel={handelCancle}
      centered
      widthType={3}
      maskClosable={false}
      mask={false}
      containerId = {`code_modal_${bizSolId}`}
      getContainer={() =>{
        return document.getElementById(`code_modal_${bizSolId}`)||false
      }}
      bodyStyle={{padding:'0px'}}
      footer={[
        <Button key="cancel" onClick={handelCancle}>取消</Button>,
        <Button type="primary" key="submit" onClick={()=>form.submit()}>确定</Button>
      ]}
    >
      <div style={{padding:'8px'}}>
        <Button type="primary" onClick={showButtonGroupFn} style={{marginRight:"8px"}}>选择按钮方案</Button>
        <span>{selectButtonGroupInfo.groupName}</span>
        <SyncOutlined style={{float:'right',marginTop:"9px"}} onClick={getButtonAuth}/>
      </div>
      <ButtonAuth
        query={query}
        actId={actId}
        form={form}
        setParentState={setParentState}
        parentState={parentState}
        style={{height:"calc(100% - 48px)"}}
      />
    </GlobalModal>
  )
}
export default connect(({layoutG,applyModelConfig})=>{return {layoutG,applyModelConfig}})(ModalButton);
