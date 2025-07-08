import {Table,Button,Modal,message,Select,Switch} from 'antd';
import {connect,history} from 'umi';
import { dataFormat } from "../../../util/util";
import {useState} from 'react';
import styles from './modalChose.less'
import { parse } from 'query-string';
function ModalList({query,dispatch,setParentState,parentState}){
  const bizSolId = query.bizSolId;
  const {bizFromInfo,colList,dataDrivers,procDefId}=parentState;
  const deployFormId = bizFromInfo.formDeployId
  const columnsList = [
    {
      title: '字段名称',
      dataIndex: 'colName',
      key: 'colName',
    },
    {
      title: '字段编码',
      dataIndex: 'colCode',
      key: 'colCode',
    },
    {
      title: '拉取方案名称',
      dataIndex: 'dataDriveIds',
      key: 'dataDriveIds',
      render: (text,record,index)=>{return <Select value={text?text.split(','):[]} onChange={onChangeDrive.bind(this,index)} mode="multiple" style={{width:'100%',marginRight: 8}}>
                {dataDrivers.map((item,index)=><Select.Option value={item.id}>{item.planName}</Select.Option>)}
        </Select>}
    },
    {
      title: '跨应用数据选中',
      dataIndex: 'crossFlag',
      key: 'crossFlag',
      algin: 'center',
      render: (text,record,index)=>{return <Switch checked={text==0?false:true} onChange={onChangeCrossFlag.bind(this,index)}/>}
    }
  ]

  const onChangeCrossFlag = (index,value) =>{
    console.log('indexindex',index,value);
    colList[index]['crossFlag'] = value?1:0
    setParentState({
      colList
    })
  }

  const onChangeDrive = (index,values) =>{
    colList[index]['dataDriveIds'] = values.toString()
    setParentState({
      colList
    })
  }

  const handelCancle=()=>{
    setParentState({
      isShowChoseModal:false
    })
  }

  //保存
  const saveList=()=>{
      let list = colList.map((item)=>{
        return {
          colCode:item.colCode,
          dataDriveIds:item.dataDriveIds,
          bindId:item.bindId,
          crossFlag:item.crossFlag
        }
      })
      dispatch({
        type:"applyModelConfig/savePushInfoBind",
        payload:{
          deployFormId,
          bizSolId,
          colList: JSON.stringify(list),
          procDefId,
        },
        extraParams:{
          setState:setParentState,
          state:parentState
        }
      })

  }
  return (
    <Modal
      visible={true}
      title="列表"
      onCancel={handelCancle}
      width={896}
      centered
      maskClosable={false}
      mask={false}
      getContainer={() =>{
        return document.getElementById(`form_modal_${bizSolId}`)||false
      }}
      footer={[
        <Button key="cancel" onClick={handelCancle}>取消</Button>,
        <Button type="primary" key="submit" onClick={saveList}>确定</Button>
      ]}
    >
      <div className={styles.data_chose}>
        <Table
          dataSource={colList}
          columns={columnsList}
          rowKey={"colCode"}
          scroll={{ y: 240 }}
          pagination={false}
        />
      </div>
    </Modal>
  )
}
export default connect(({applyModelConfig})=>{return {applyModelConfig}})(ModalList);
