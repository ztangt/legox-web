import React from 'react';
import { connect } from 'dva';
import {Modal,Button} from 'antd';
import RelevanceModal from '../relevanceModal/relevanceModal';
import {  useLocation} from 'umi';

function OrgTree ({dispatch,formShow,onOKValue,orgId,nodeIds,treeType,type,isMultipleTree}){
    const {stateObj} = formShow;
    const bizSolId = useLocation().query.bizSolId;
    const bizInfoId = useLocation().query.bizInfoId;
    const currentTab = useLocation().query.currentTab;
    const {selectedDatas,selectedDataIds,orgUserType} = stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab]
    function submitClick(){
      let names = [];
      selectedDatas.forEach(function(item,i){
        if(orgUserType=='USER'){
          names.push(item.userName)
        }else{
          names.push(item.nodeName)
        }
      })

      onOKValue(names,selectedDataIds,orgId)
      dispatch({
        type: 'formShow/updateStates',
        payload:{
          selectVisible:false,
        }
      })
    }

    function onCancel(){
      dispatch({
          type:"formShow/updateStates",
          payload:{
              selectVisible:false
          }
      })
  }
    return (
        <Modal
            visible={true}
            width={'95%'}
            title='选择'
            bodyStyle={{height:'500px',padding: '0'}}
            onCancel={onCancel}
            mask={false}
            maskClosable={false}
            getContainer={() =>{
              return document.getElementById('formShow_container')
            }}
            footer={[
              <Button key="cancel" onClick={onCancel}>取消</Button>,
              <Button key="submit" type="primary" onClick={submitClick}>确定</Button>,
            ]}
        >
          <RelevanceModal
            nodeIds={nodeIds}
            treeType={treeType}
            type={type}
            nameSpace="formShow"
            spaceInfo={_.cloneDeep(formShow.stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab])}
            orgUserType={orgUserType}
            selectButtonType={isMultipleTree=='YES'?"checkBox":'radio'}
          />
        </Modal>

    )
}
export default connect(({loading,formShow})=>({
    formShow,
    loading
  }))(OrgTree);

