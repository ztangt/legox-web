import {Button,message} from 'antd';
import {connect,history} from 'umi';
import { dataFormat } from "../../../util/util";
import {useState,useEffect} from 'react';
import IPagination from '../../../componments/public/iPagination';
import GlobalModal from '../../../componments/GlobalModal';
import Table from '../../../componments/columnDragTable'
export const columnsList = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width:80,
    render:(text,obj,index)=><div>{index+1}</div>
  },
  {
    title: '列表名称',
    dataIndex: 'bizFormName',
    key: 'bizFormName',
  },
  {
    title: '列表编码',
    dataIndex: 'bizFormCode',
    key: 'bizFormCode',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    render:(text)=><div>{dataFormat(text,'YYYY-MM-DD')}</div>
  },
];
function ModalList({query,dispatch,parentState,setParentState}){
  const bizSolId = query.bizSolId;
  const {bizFromInfo,formData,tableData,bizSolInfo,formCurrentPage,formReturnCount}=parentState;
  const [listBizFormId,setListBizFormId]=useState(bizFromInfo.listBizFormId);//对用的是ID
  const [listId,setListId]=useState(bizFromInfo.listId);//对应的是formId
  const [listModelVersion,setListModelVersion] = useState(bizFromInfo.listModelVersion);//对应的是formVersion
  const [listInfo,setListInfo] = useState({});
  const [limit,setLimit] = useState(10);
  useEffect(()=>{
    getBusinessForm(1,limit)
  },[])
  const handelCancle=()=>{
    setParentState({
      isShowListModal:false
    })
  }
  //获取业务表单数据
  const getBusinessForm=(start,limit)=>{
    dispatch({
      type:'applyModelConfig/getBusinessForm',
      payload:{
        ctlgId:bizSolInfo.ctlgId,
        start,
        limit,
        type:'2,4'
      },
      extraParams:{
        setState:setParentState,
        state:parentState
      }
    })
  }
  //分页
  const changePage=(nextpage,size)=>{
    setLimit(size)
    getBusinessForm(nextpage,size)
  }
  //列表
  const rowSelectionList = {
    selectedRowKeys:[listBizFormId],
    onChange: (selectedRowKeys, selectedRows) => {
      setListBizFormId(selectedRowKeys[0]);
      setListId(selectedRows[0].formId);
      setListInfo(selectedRows[0]);
      setListModelVersion(selectedRows[0].formVersion)
    }
  };
  //保存
  const saveList=()=>{
    if(listBizFormId){
      if(Object.keys(listInfo).length){//改变数据才更新
        bizFromInfo.listBizFormId=listBizFormId;
        bizFromInfo.listId=listId;
        bizFromInfo.listModelVersion=listModelVersion;
        tableData[0].name=listInfo.bizFormName;
        tableData[0].code=listInfo.bizFormCode;
        setParentState({
          bizFromInfo,
          isShowListModal:false,
          tableData
        })
      }else{
        setParentState({
          isShowListModal:false,
        })
      }
    }else{
      message.error('请选择列表')
    }
  }
  const selectRow=(record)=>{
    return {
      onClick:()=>{
        setListBizFormId(record.id);
        setListId(record.formId);
        setListInfo(record);
        setListModelVersion(record.formVersion)
      }
    }
  }
  return (
    <GlobalModal
      visible={true}
      title="列表"
      onCancel={handelCancle}
      widthType={3}
      maskClosable={false}
      mask={false}
      centered
      getContainer={() =>{
        return document.getElementById(`code_modal_${bizSolId}`)||false
      }}
      footer={[
        <Button key="cancel" onClick={handelCancle}>取消</Button>,
        <Button type="primary" key="submit" onClick={saveList}>确定</Button>
      ]}
      bodyStyle={{overflow:'hidden',position:'relative',padding:'0px'}}
      containerId ={`code_modal_${bizSolId}`}
    >
      <Table
        dataSource={formData}
        columns={columnsList}
        rowKey={"id"}
        scroll={{ y: 'calc(100% - 78px)' }}
        onRow={selectRow}
        pagination={false}
        taskType={'MONITOR'}
        rowSelection={{
          type:'radio',
          ...rowSelectionList,
        }}
      />
      <IPagination
        current={formCurrentPage}
        pageSize={limit}
        total={formReturnCount}
        onChange={changePage.bind(this)}
        style={{borderTop:'1px solid rgb(235, 235, 235)',height:'38px',right:'0px',width:'100%',background:'#fff',paddingRight:"8px"}}
      />
    </GlobalModal>
  )
}
export default connect(({layoutG,applyModelConfig})=>{return {layoutG,applyModelConfig}})(ModalList);
