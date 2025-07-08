import React from 'react';
import { connect } from 'dva';
import {Modal,Button} from 'antd';
import RelevanceModal from '../../../componments/relevanceModal/relevanceModal';
function OrgTree ({location,dispatch,dataRuleMg,onCancel,setSql}){
    const { selectedDatas,selectedDataIds,orgUserType,selectedNodeId,
            treeData,currentNode,expandedKeys,treeSearchWord,originalData,
            selectNodeType,groups,currentKey} = dataRuleMg
    const index = groups.findIndex((item)=>{return item.key==currentKey})

    const spceInfo = {
      selectedNodeId,
      selectedDataIds,
      treeData,
      currentNode,
      expandedKeys,
      treeSearchWord,
      selectedDatas,
      originalData,
      selectNodeType
    }




    function submitClick() {
      let names = [];
      selectedDatas.forEach(function(item,i){
        if(orgUserType=='USER'){
          names.push(item.userName)
        }else if(orgUserType=='RULE'){
          names.push(item.roleName)
        }else{
          names.push(item.nodeName)
        }
      })
      groups[index]['propTypeValue'] = names//改变每个输入框值
      groups[index]['propTypeValueId'] = selectedDataIds,
      groups[index]['orgId'] = currentNode.key

      dispatch({
        type:'dataRuleMg/updateStates',
        payload:{
          groups,
        }
      })
      setSql(groups)
      onCancel();
    }

    function onCancel() {

      dispatch({
        type: 'dataRuleMg/updateStates',
        payload: {
          treeData:[],
          currentNode: {},
          expandId: '',
          expandedKeys: [],
          treeSearchWord: '',
          autoExpandParent: false,
        }
      })
    dispatch({
      type: 'dataRuleMg/updateStates',
      payload:{
        selectVisible: false,
        middleData: [],
        middleValue: [],
        middleValueName:[],
        rightData: [],
      }
    })
  }
    return (
        <Modal
            visible={true}
            width={'95%'}
            title='选择'
            bodyStyle={{padding: '0'}}
            onCancel={onCancel}
            mask={false}
            maskClosable={false}
            centered
            getContainer={() =>{
              return document.getElementById('dataRuleMg_container')||false
            }}
            footer={[
              <Button key="cancel" onClick={onCancel}>取消</Button>,
              <Button key="submit" type="primary" onClick={submitClick}>确定</Button>,
            ]}
        >
          <RelevanceModal
            nameSpace="dataRuleMg"
            spaceInfo={{...spceInfo}}
            orgUserType={orgUserType}
            selectButtonType={'checkBox'}
          />
        </Modal>

    )
}

export default connect(({dataRuleMg,loading})=>({
   dataRuleMg,
    loading
  }))(OrgTree);

