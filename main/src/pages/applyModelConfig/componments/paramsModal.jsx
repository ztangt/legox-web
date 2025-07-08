import {Modal} from 'antd';
import { useEffect, useState,useCallback } from 'react';
import {connect,history} from 'umi';
import styles from './gwExpressionTable.less';
import { parse } from 'query-string';
import Table from '../../../componments/columnDragTable';
import GlobalModal from '../../../componments/GlobalModal';
function ParamsModal({query,dispatch,saveParam,dataType,parentState,setParentState}){
  const {bizSolId} = query;
  const {columnList,bizFromInfo}=parentState;
  const [selectedRows,setSelectedRows] = useState([]);
  const columns=[
    {
      title:'序号',
      dataIndex:'index',
      width:80,
      render:(text,row,index)=><span>{index+1}</span>
    },
    {
      title:'字段名称',
      dataIndex:'formColumnCode',
    },
    {
      title:'字段描述',
      dataIndex:'formColumnName',
    },
  ]
  useEffect(()=>{
    //获取数据
    dispatch({
      type:"applyModelConfig/getFormcolumns",
      payload:{
        deployFormId:bizFromInfo.formDeployId
      },
      extraParams:{
        setState:setParentState,
        state:parentState
      }
    })
  },[])
  const rowSelection={
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    }
  }
  const handelCancle=()=>{
    setParentState({
      isShowColSelect:false
    })
  }
  return (
    <GlobalModal
      visible={true}
      title="选择表单字段"
      onCancel={handelCancle}
      onOk={saveParam.bind(this,selectedRows)}
      widthType={1}
      className={styles.formCols}
      mask={false}
      maskClosable={false}
      bodyStyle={{padding:'0px'}}
      centered
      getContainer={() =>{
          return document.getElementById(`code_modal_${bizSolId}`)||false
      }}
    >
      <Table
        columns={columns}
        dataSource={Object.keys(columnList)?columnList[dataType]:[]}
        pagination={false}
        scroll={{y:'calc(100% - 40px)'}}
        rowKey="formColumnCode"
        rowSelection={{
          type:'radio',
          ...rowSelection
        }}
      />
    </GlobalModal>
  )
}
export default connect(({applyModelConfig})=>{return {applyModelConfig}})(ParamsModal);
