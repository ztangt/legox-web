import styles from '../index.less';
import '../index.less';
import {
  Popup,
  Button
} from 'antd-mobile/es';
import { Checkbox } from 'antd';
import { useState,useEffect } from 'react'
function Index({dispatch,bizTaskNodes,actVisible,checkedAct,setCheckedAct,currentAct,setCurrentAct,setDealStrategy,getGroupList,setValue,taskActList,setActVisible,value}) {
  const [disabledActs,setDisabledActs] = useState([])
  useEffect(()=>{
    if(bizTaskNodes?.taskActList?.length){
      let actNode = _.find(bizTaskNodes?.taskActList,{actId: checkedAct?.[0]})
      if(!actNode){//没有选中节点，恢复不可点击配置
        setDisabledActs([])
        return
      }
      let freeArr =  []//流转节点
      let noramalArr =  []//非流转节点
      let disabledArr = []
      bizTaskNodes?.taskActList?.map((item)=>{
        if(item.freeFlag){
          freeArr.push(item.actId)
        }else{
          noramalArr.push(item.actId)
        }
          
      })
      if(freeArr?.length){
        if(actNode.freeFlag){//已选的节点是流转节点，非流转节点设为不可编辑
          disabledArr = noramalArr
        }else{
          disabledArr = freeArr
        }
        setDisabledActs(disabledArr)
      }
    }
      
  },[checkedAct])
  const onActChange = (value) =>{
    if (value.length>1&&bizTaskNodes.actType=='exclusiveGateway') {//单选  (互斥网关单选节点)
      // Toast.show({
      //   icon: 'fail',
      //   content: '互斥网关最多选择一个节点',
      // });
      setCheckedAct([value?.[value.length-1]])
      return
    }
    setCheckedAct(value)
  }
    //选择节点
    const onActClick = (item, index, e) => {
      if(bizTaskNodes.actType=='inclusiveGateway'){//包容网关，选择分支的时候，只有点击“复选框”才触发复选框的勾选状态，选中其它区域，只触发选中状态，不要影响复选框的勾选状态
        e.stopPropagation();
        e.preventDefault();
      }
      if(currentAct==item.actId){//已选中的节点与当前点击节点相同
        return
      }
      // //当前点击节点与已勾的actID不同
      // if ((checkedAct.length==1&&item.actId!=checkedAct[0])&&bizTaskNodes.actType=='exclusiveGateway') {//单选  (互斥网关单选节点)
      //   return
      // }
      setCurrentAct(item.actId)
      if (bizTaskNodes.actType == 'endEvent') {//结束节点
        getGroupList(bizTaskNodes.actId,bizTaskNodes?.choreographyFlag,bizTaskNodes?.choreographyOrgId,bizTaskNodes)
        return
      }
      setDealStrategy(item.dealStrategy);
      getGroupList(item.actId,taskActList[index]?.choreographyFlag,taskActList[index]?.choreographyOrgId,bizTaskNodes)
      // setValue([])
      if(taskActList[index]['handlerId']){
        setValue(taskActList[index]['handlerId'].split(','));
      }else{
        setValue([])
      }
      
    };
  const onOkAct = () =>{
    setActVisible(false);
  }
  const onCancelAct = () =>{
    setActVisible(false);
  }
    //流程节点渲染
    const returnAct = () => {
      if(bizTaskNodes.actType == 'endEvent'){
        return <Checkbox.Group onChange={onActChange} value={checkedAct}>
                 <div onClick={onActClick.bind(this)}>
                  <Checkbox 
                    value={bizTaskNodes.actId}
                    className={currentAct==bizTaskNodes.actId?styles.checkbox_item_checked:{}} 
                    >
                      {bizTaskNodes.actName ? bizTaskNodes.actName : '结束节点'}
                  </Checkbox>
                 </div>
               </Checkbox.Group>
      }else{
        return <Checkbox.Group onChange={onActChange} value={checkedAct}>
                {
                  bizTaskNodes?.taskActList?.map((item,index)=>{
                    return<div onClick={onActClick.bind(this,item,index)} className={currentAct==item.actId?styles.checkbox_item_checked:{}}>
                    <Checkbox 
                      disabled={bizTaskNodes?.checkAll||bizTaskNodes.actType == 'parallelGateway'||disabledActs.toString().includes(item.actId)}
                      key={index}
                      value={item.actId}
                      >
                        {item.actName}
                      </Checkbox>
                    </div>
                  })
                }
                </Checkbox.Group>
      }
    };

  return (
    <Popup
    position="bottom"
    visible={actVisible}
    onClose={onCancelAct}
    onMaskClick={onCancelAct}
    bodyStyle={{
      height: '40%'
    }}
  >
    <div className={styles.act_container}>
      <h1 className={styles.act_title}>节点名称</h1>
      {returnAct()}
    </div>
    <Button className={styles.act_footer_button} onClick={onOkAct}>确定</Button>
  </Popup>
  );
}
export default Index;
