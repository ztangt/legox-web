import React from 'react';
import { connect } from 'dva';
import {Modal,Button} from 'antd';
import RelevanceModal from '../../../componments/relevanceModal/relevanceModal';
import { parse } from 'query-string';
import GlobalModal from '../../../componments/GlobalModal';

function BasicUserModal ({query,form,applyModelConfig,str,setChangeStatus,setParentState,parentState}){
    const {selectedDataIds,selectedDatas} = parentState
    const bizSolId = query.bizSolId;
    function submitClick(){
      //获取name信息
      let arrNames = [];
      selectedDatas.map((item)=>{
        arrNames.push(item.userName);
      })
      if(str=="jointSignatureUserNames"){
        form.setFieldsValue(
          {
            jointSignatureUsers:selectedDataIds.join(','),
            jointSignatureUserNames:arrNames.join(',')
          }
        )
      }else{
        form.setFieldsValue(
          {
            jointSignatureAllUsers:selectedDataIds.join(','),
            jointSignatureAllUserNames:arrNames.join(',')
          }
        )
      }
      setChangeStatus(true)
      onCancel();
    }
    const onCancel=()=>{
      setParentState({
        orgTreeModal:false
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
            getContainer={() =>{
              return document.getElementById(`code_modal_${bizSolId}`)||false
            }}
            footer={[
              <Button key="cancel" onClick={onCancel}>取消</Button>,
              <Button key="submit" type="primary" onClick={submitClick}>确定</Button>,
            ]}
        >
          <RelevanceModal
            nameSpace="applyModelConfig"
            spaceInfo={{...parentState}}
            orgUserType={"USER"}
            selectButtonType={"checkBox"}
            setParentState={setParentState}
          />
        </GlobalModal>

    )
}
export default connect(({applyModelConfig,layoutG,loading})=>({
    applyModelConfig,
    layoutG,
    loading
  }))(BasicUserModal);

