import {Button,Modal,message} from 'antd';
import {connect,history} from 'umi';
import {useState,useEffect} from 'react';
import Table from '../../../componments/columnDragTable';
import GlobalModal from '../../../componments/GlobalModal';
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width:80,
    render:(text,obj,index)=><span>{index+1}</span>
  },
  {
    title: '按钮方案名称',
    dataIndex: 'groupName',
    key: 'groupName',
  },
  {
    title: '方案编码',
    dataIndex: 'groupCode',
    key: 'groupCode',
  },
  {
    title: '方案描述',
    dataIndex: 'groupDesc',
    key: 'groupDesc',
  },
];
function ModalButton({query,dispatch,setFromListValue,buttonGroupList,selectButtonGroupInfo,setParentState}){
  const {bizSolId} = query;
  const [buttonGroupId,setButtonGroupId]=useState(selectButtonGroupInfo.groupId);
  const [buttonGroupInfo,setButtonGroupInfo]=useState(selectButtonGroupInfo);
  useEffect(()=>{
    dispatch({
      type:'applyModelConfig/getButtonGroups',
      payload:{
        start:1,
        limit:100000,
        searchValue:'',
        groupType:'FORM'
      },
      extraParams:{
        setState:setParentState
      }
    })
  },[])
  const handelCancle=()=>{
    setParentState({
      isShowButtonGroup:false
    })
  }
  //按钮组
  const rowSelectionButton = {
    selectedRowKeys:[buttonGroupId],
    onChange: (selectedRowKeys, selectedRows) => {
      setButtonGroupId(selectedRowKeys[0]);
      setButtonGroupInfo(selectedRows[0]);
    }
  };
  //保存
  const saveList=()=>{
    if(buttonGroupId){
      setParentState({
        isShowButtonGroup:false,
        selectButtonGroupInfo:buttonGroupInfo,
      })
      //通过按钮组获取绑定的按钮列表
      dispatch({
        type:"applyModelConfig/getButtonIds",
        payload:{
          buttonGroupId
        },
        callback:(buttonList)=>{
          setParentState({
            buttonList
          })
          //重置form的默认值（这个是为了切换节点缓存的显示问题）
          setFromListValue(buttonList);

        }

      })
    }else{
      message.error('请选择按钮方案');
    }
  }
  //选中行
  const selectRow=(record)=>{
    return {
      onClick:()=>{
        setButtonGroupId(record.groupId);
        setButtonGroupInfo(record);
      }
    }
  }
  return (
    <GlobalModal
      visible={true}
      title="选择表单按钮方案"
      onCancel={handelCancle}
      widthType={3}
      centered
      maskClosable={false}
      mask={false}
      getContainer={() =>{
        return document.getElementById(`code_modal_${bizSolId}`)||false
      }}
      bodyStyle={{padding:'0px'}}
      footer={[
        <Button key="cancel" onClick={handelCancle}>取消</Button>,
        <Button type="primary" key="submit" onClick={saveList}>确定</Button>
      ]}
    >
      <Table
        dataSource={buttonGroupList}
        columns={columns}
        rowKey={"groupId"}
        onRow={selectRow}
        scroll={{ y:'calc(100% - 40px)'}}
        pagination={false}
        taskType='MONITOR'
        rowSelection={{
          type:'radio',
          ...rowSelectionButton,
        }}
      />
    </GlobalModal>
  )
}
export default connect(({layoutG,applyModelConfig})=>{return {layoutG,applyModelConfig}})(ModalButton);
