import {Modal,message} from 'antd';
import ITree from '../../../componments/public/iTree';
import {connect} from 'dva';
import {useState} from 'react';
import styles from '../index.less'
function AbilityModal({dispatch,moduleResourceMg,form}){
  console.log('moduleResourceMg=',moduleResourceMg);
  const {abilitys,selectAbility,currentNode}=moduleResourceMg;
  const [checkedKeys,setCheckedKeys] = useState(selectAbility.nodeCode?[selectAbility.nodeCode]:[]);
  const [newSelectAbility,setNewSelectAbility] = useState(selectAbility)
  const handelCancle=()=>{
    dispatch({
      type:'moduleResourceMg/updateStates',
      payload:{
        isShowAbilityModal:false
      }
    })
  }
  const onCheck=(checkedKeys,{checked, checkedNodes,node})=>{
    setCheckedKeys([node.nodeCode]);//单选
    setNewSelectAbility(node)
  }
  const submitTree=()=>{
    if(Object.keys(newSelectAbility).length){
      dispatch({
        type:"moduleResourceMg/updateStates",
        payload:{
          selectAbility:newSelectAbility
        }
      })
      form.setFields([
        {
            name: ['bizSolName'],
            value: newSelectAbility.nodeName
        },
        {
          name: ['sourceName'],
          value: newSelectAbility.nodeName
        },
        {
            name: ['menuName'],
            value: newSelectAbility.nodeName
        },
        {
            name: ['menuLink'],
            value: newSelectAbility.menuLink
        },
        {
          name:['metaData'],
          value:newSelectAbility.metaData
        }
      ])
      handelCancle()
    }else{
      message.error('请选择能力');
    }
  }
  return (
    <Modal
     visible={true}
     title="选择能力"
     centered
     onOk={submitTree}
     onCancel={handelCancle}
     className={styles.ability}
     mask={false}
     maskClosable={false}
     getContainer={() => {
      return document.getElementById('moduleResourceMg_container')||false
  }}
    >
      <div className={styles.abilityModal}>
        <ITree
          isSearch={false}
          treeData={abilitys}
          field={{titleName:"nodeName",key:"nodeCode",children:"children"}}
          checkedKeys={checkedKeys}
          onCheck={onCheck}
          checkable={true}
          style={{width:'100%'}}
        />
      </div>
    </Modal>
  )
}
export default  connect(({moduleResourceMg})=>{return {moduleResourceMg}})(AbilityModal)
