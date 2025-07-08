import styles from './index.less';
import { message } from 'antd';
import { useState} from 'react';
import {  Popup, Button as MobileButton } from 'antd-mobile/es'
import { CheckOutline } from 'antd-mobile-icons';
export default function Index({
  workType,
  setState,
  bizTaskId,
  actData,
  backNodes,
  commentList,
  dispatch,
  // isMessage,
  category
}) {
  // 通用弹框的props
  const [actIds,setActIds] = useState([]);  
  const [returnStrategy,setReturnStrategy] = useState();
  const onCloseBackAct = () =>{
    setState({
      backNodes:[]
    })
  }

  const onActClick = (item) => {
    //returnStrategy1：驳回上一步 2：驳回拟稿 3：自由驳回
    if(item.returnStrategy==3){//自由驳回只可选取一个节点
      setActIds([item.actId])
      setReturnStrategy(item.returnStrategy);
      return
    }
    var flag = actIds?.findIndex((actId)=>{return item.actId==actId})
    //1：驳回上一步 2：驳回拟稿 需全选其中某个策略下的全部节点
    if(flag!=-1){//当前节点已被选中 取消节点
      setReturnStrategy();
      setActIds([]);
    }else{
      setReturnStrategy(item.returnStrategy);
      //根据当前节点策略，选中所属该策略的所有节点
      var values = []
      backNodes.map((node)=>{ if( node.returnStrategy==item.returnStrategy){ values.push(node.actId)}})
      setActIds(values);
    }
  };

  const onConfirmReject = ()=>{
    if(!actIds?.length){
      message.warning('请选择驳回环节');
      return
  }
    let targetActJson={};
    let returnStrategy = '';
    let flowTaskActList = [];
    actIds?.map((item)=>{
      let info = _.find(backNodes,{actId:item});
      returnStrategy = info.returnStrategy;
      flowTaskActList.push(info);
    })
    targetActJson={
      returnStrategy,
      flowTaskActList
    }
    dispatch({
      type:'formShow/processBack',
      payload:{
          bizTaskId:bizTaskId,
          flowAct:targetActJson,
          commentList,
          variableJson:actData,
      },
      callback:function(){
        onCloseBackAct()
        if(category=='MATTER'){
          window.location.href = `#/business_application/mobile/MATTERMsgLIst`
        }else if(category=='SYS'){
          window.location.href = `#/business_application/mobile/SYSMsgLIst`
        }else{
          window.location.href = `#/business_application/mobile/${workType}List`
        }
      }
    })
  }

  const returnAct = () => {//TODO
    return (
      <ul className={styles.list}>
        {
          backNodes?.map((item, index) => {
            return (
              <li key={item.actId} onClick={onActClick.bind(this, item)}>
                <a>
                  {`${item.actName}(${item.handlerName})`}
                </a>
                {actIds.toString().includes(item?.actId)? (
                    <CheckOutline className={styles.icon_check} />
                  ) : (
                    <span className={styles.icon_check}></span>
                  )}
              </li>
            );
          })
        }
        <MobileButton onClick={onConfirmReject} className={styles.back_button}>驳回</MobileButton>
      </ul>
    );
  };
  return <>
      <Popup
      position="bottom"
      visible={backNodes.length > 0}
      showCloseButton={false}
      onClose={onCloseBackAct}
      className={styles.back_pop}
      closeOnMaskClick={true}
    >
      <div className={styles.act_container}>
        {/* <h1 className={styles.title}>环节名称</h1> */}
        {returnAct()}
      </div>
    </Popup>
  </>
  
 
}

