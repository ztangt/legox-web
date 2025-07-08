import React from 'react';
import { connect } from 'dva';
import {Modal,Button} from 'antd';
import RelevanceModal from '../../../componments/relevanceModal/relevanceModal';
import GlobalModal from '../../../componments/GlobalModal';
function OrgTree ({onCancel,clickIndex,emptyVisible,setEmptyVisible,
  parentState,setParentState,query}){
    const {selectedDatas,selectedDataIds,orgUserType,nodeUserType,nodeUser,NodeBaseObj} = parentState;
    function submitClick(){
      let names = [];
      selectedDatas.forEach(function(item,i){
        if(orgUserType=='USER'){
          if(item.postName){
            names.push(`${item.userName}【${item.postName}】`)
          }else{
            names.push(`${item.userName}`)
          }
        }else if(orgUserType=='RULE'){
          names.push(item.roleName)
        }else{
          names.push(item.nodeName)
        }
      })
      if(nodeUserType == 'host'){
        nodeUser.handler.org.forEach(function(item,i){
          if(i==clickIndex){
            item['orgValueName'] = names.join(',');
            item['orgValue'] = selectedDataIds.join(',')
          }
        })
      }else{
        nodeUser.reader.org.forEach(function(item,i){
          if(i==clickIndex){
            item['orgValueName'] = names.join(',');
            item['orgValue'] = selectedDataIds.join(',')
          }
        })
      }
      emptyVisible[clickIndex] = false;
      setEmptyVisible(emptyVisible)
      setParentState({
        flowTreeModal:false,
        nodeUser:nodeUser
      })
    }
    return (
        <GlobalModal
            visible={true}
            widthType={3}
            title='选择'
            bodyStyle={{padding: '0'}}
            onCancel={onCancel}
            mask={false}
            maskClosable={false}
            centered
            getContainer={() =>{
              return document.getElementById(`code_modal_${query?.bizSolId}`)||false
            }}
            footer={[
              <Button key="cancel" onClick={onCancel}>取消</Button>,
              <Button key="submit" type="primary" onClick={submitClick}>确定</Button>,
            ]}
        >
          <RelevanceModal
            nameSpace="applyModelConfig"
            spaceInfo={{...parentState}}
            orgUserType={orgUserType}
            selectButtonType={orgUserType=='USER'?(NodeBaseObj.dealStrategy==1&&nodeUserType=='host'?'radio':"checkBox"):"radio"}
            setParentState={setParentState}
            containerId={`transactor_${query?.bizSolId}`}
          />
        </GlobalModal>

    )
}
export default connect(({applyModelConfig,layoutG,loading})=>({
    applyModelConfig,
    layoutG,
    loading
  }))(OrgTree);

