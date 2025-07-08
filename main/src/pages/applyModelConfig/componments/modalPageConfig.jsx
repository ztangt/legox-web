import {Modal,Button,Checkbox} from 'antd';
import {connect,history} from 'umi';
import {useState} from 'react';
import { parse } from 'query-string';
const optionsPageAttr = [
  {
    label:'正文',
    value:'WORD'
  },
  {
    label:'关联文档',
    value:'ANNEX'
  }
]
function ModalPageConfig({query,dispatch,bizFromInfo,setParentState}){
  const {bizSolId} = query;
  const [template,setTemplate]=useState(bizFromInfo.template);
  const handelCancle=()=>{
    setParentState({
      isShowPageModal:false
    })
  }
  //改变分页属性
  const changeTemplate=(checkedValues)=>{
    setTemplate(checkedValues.join('|'));
  }
  //保存
  const savePage=()=>{
    bizFromInfo.template=template;
    setParentState({
      bizFromInfo,
      isShowPageModal:false
    })
  }
  return (
    <Modal
      visible={true}
      title="分页"
      onCancel={handelCancle}
      maskClosable={false}
      mask={false}
      centered
      getContainer={() =>{
        return document.getElementById(`form_modal_${bizSolId}`)||false
      }}
      footer={[
        <Button key="cancel" onClick={handelCancle}>取消</Button>,
        <Button key="submit" onClick={savePage} type="primary">确定</Button>
      ]}
    >
      <span>边框设置</span>
      <Checkbox.Group
        onChange={changeTemplate}
        value={template!='undefined'&&template?template.split('|'):''}
        options={optionsPageAttr}
      />
    </Modal>
  )
}
export default connect(({applyModelConfig})=>{return {applyModelConfig}})(ModalPageConfig);
