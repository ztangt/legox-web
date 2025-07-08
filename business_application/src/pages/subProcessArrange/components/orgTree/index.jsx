import React from 'react';
import { connect } from 'dva';
import {Modal,Button} from 'antd';
import RelevanceModal from '../../../../componments/relevanceModal/relevanceModal';
import GlobalModal from '../../../../componments/GlobalModal';
function OrgTree ({dispatch,onCancel,clickIndex,emptyVisible,setEmptyVisible,actives,query,pearsonActionType,subProcessArrangeSpace}){
    const {selectedDatas,selectedDataIds,orgUserType,nodeUserType,nodeUser,NodeBaseObj} = subProcessArrangeSpace;
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
      if(actives == 1){
        nodeUser.handler.forEach(function(item,i){
          if(i==clickIndex){
            item['orgValueName'] = names.join(',');
            item['orgValue'] = selectedDataIds.join(',')
          }
        })
      }else{
        nodeUser.reader.forEach(function(item,i){
          if(i==clickIndex){
            item['orgValueName'] = names.join(',');
            item['orgValue'] = selectedDataIds.join(',')
          }
        })
      }
      emptyVisible[clickIndex] = false;
      setEmptyVisible(emptyVisible)
      dispatch({
        type: 'subProcessArrangeSpace/updateStates',
        payload: {
          flowTreeModal:false,
          nodeUser:nodeUser,
          getSubProcessHandleList: nodeUser.handler,
          getSubProcessReaderList: nodeUser.reader
        }
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
              return document.getElementById(`sub_container`)||false
            }}
            footer={[
              <Button key="cancel" onClick={onCancel}>取消</Button>,
              <Button key="submit" type="primary" onClick={submitClick}>确定</Button>,
            ]}
        >
          <RelevanceModal
            nameSpace="subProcessArrangeSpace"
            spaceInfo={subProcessArrangeSpace}
            orgUserType={orgUserType}
            selectButtonType={orgUserType=='USER'?(pearsonActionType==1&actives==1?'radio':"checkBox"):"radio"}
          />
        </GlobalModal>

    )
}
export default connect(({subProcessArrangeSpace,layoutG})=>({
  subProcessArrangeSpace,
  layoutG
  }))(OrgTree);

