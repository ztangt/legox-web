//办理详情
import React,{useEffect,useRef,useState} from 'react'
import { connect } from 'dva';
import GlobalModal from '../../../../componments/GlobalModal';
import { Tabs,Button } from 'antd';
import HandlerDetailModal from '../handlerDetailModal';
import styles from '../../index.less'

const ProcessDetail = ({dispatch,handelCancel,actId,bizSolId,formDeployId,orgId,procDefId,subProcessArrangeSpace})=>{
    const {getSubProcessHandleList,getSubProcessReaderList,changeStatus,pearsonActionType,nodeUser,actives}=subProcessArrangeSpace    
    const [emptyVisible,setEmptyVisible] = useState({})  

    // 办理详情确认
    const detailConfirm = ()=>{
      let isEmpty = false;
      if(isEmptyFn(nodeUser.handler)){
        isEmpty = true
      }else if(isEmptyFn(nodeUser.reader)){
        isEmpty = true
      }
      if(isEmpty){
        return 
      }
      let obj = JSON.parse(JSON.stringify(nodeUser))
      console.log("obj999",obj,"changeStatus",changeStatus,actId,bizSolId,formDeployId,orgId,procDefId)
      dispatch({
        type: 'subProcessArrangeSpace/saveSubProcessUserArrange',
        payload: {
          actId,
          bizSolId,
          formDeployId,
          orgId,
          procDefId,
          handler: obj.handler,
          reader: obj.reader,
        },
        callback(){
          handelCancel()
        }
      })
  }
     //判断组织机构值域，为空的时候提示(每次切换页面的时候就需要做判断)
  const isEmptyFn = (orgs)=>{
    let newEmptyVisible = {};
    let isEmpty = false;
    orgs.map((item,index)=>{
      if(item.orgType!="CURRENT_ORG"&&item.orgType!="CURRENT_DEPT"){
        if(!item.orgValue){
          console.log('index=',index);
          newEmptyVisible[index]=true;
          isEmpty = true;
        }else{
          newEmptyVisible[index]=false
        }
      }
    })
    setEmptyVisible(newEmptyVisible);
    return isEmpty
  }
    // 切换tabs类型
    const changeActive = (val)=>{
        let isEmpty = false;
          if(val==1){
            isEmpty = isEmptyFn(nodeUser.reader);
          }else{
            isEmpty = isEmptyFn(nodeUser.handler);
          }
          if(isEmpty){
            return;
          }else{
            setEmptyVisible({})
          }
        dispatch({
            type: 'subProcessArrangeSpace/updateStates',
            payload: {
                actives: val
            }
        })
    }

    const configDetail = {
        procDefId,
        orgId,
        formDeployId,
        bizSolId,
        actId,
        getSubProcessHandleList,
        getSubProcessReaderList,
        pearsonActionType,
        actives,
        nodeUser,
        isEmptyFn,
        emptyVisible,
        setEmptyVisible,
    }
    // 获取列表
    useEffect(()=>{
        getNodeList()
    },[])


    const getNodeList = ()=>{
        dispatch({
            type: 'subProcessArrangeSpace/getSubProcessTableList',
            payload: {
                actId,
                formDeployId,
                procDefId,
                orgId,
                bizSolId
            }
        })
    }
    console.log("actives",actives)
    return (
        <GlobalModal
            title="办理人员详情"
            visible={true}
            mask={false}
            bodyStyle={{padding:'8px'}}
            onCancel={handelCancel}
            maskClosable={false}
            getContainer={() =>{
                return document.getElementById(`sub_container`)
            }}
            widthType={3}
            footer={
              [
                <Button onClick={handelCancel}>取消</Button>,
                <Button type="primary" onClick={detailConfirm}>保存</Button>
              ]
            } 
        >
            <div className={styles.process_box}>
                <Tabs onChange={changeActive} activeKey={actives} defaultActiveKey="1">
                    <Tabs.TabPane tab="办理人" key="1">
                        {actives==1&&Object.keys(nodeUser).length>0?<HandlerDetailModal {...configDetail}/>:null}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="传阅人" key="2">
                        {actives==2&&Object.keys(nodeUser).length>0?<HandlerDetailModal {...configDetail}/>:null}
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </GlobalModal>
    )
}

export default connect(({subProcessArrangeSpace})=>({subProcessArrangeSpace}))(ProcessDetail)