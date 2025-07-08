import {Button,Modal,message} from 'antd';
import {connect,history} from 'umi';
import { dataFormat } from "../../../util/util";
import {useState,useEffect} from 'react';
import {MinusSquareOutlined,PlusSquareOutlined} from '@ant-design/icons';
import IPagination from '../../../componments/public/iPagination'
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
    title: '表单名称',
    dataIndex: 'bizFormName',
    key: 'bizFormName',
    width:200,
    render:(text)=><div className="col_ellipsis" title={text}>{text}</div>
  },
  {
    title: '表单编码',
    dataIndex: 'bizFormCode',
    key: 'bizFormCode',
    // width:'150px',
  },
  {
    title: '主版本',
    dataIndex: 'formVersion',
    key: 'formVersion',
    // width:'80px'，
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
    key: 'createUserName',
    // width:'150px',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    // width:'150px',
    render:(text)=><div>{dataFormat(text,'YYYY-MM-DD')}</div>
  },
];
function ModalFrom({query,dispatch,layoutG,parentState,setParentState}){
  const bizSolId = query.bizSolId;
  const {bizFromInfo,formData,tableData,mainFormData,bizSolInfo,formCurrentPage,formReturnCount,procDefId}=parentState;
  //通过formBizFormId和formDeployId确定表单的ID
  const [selectFormId,setSelectFormId]=useState(bizFromInfo.formBizFormId);
  const [selectFormInfo,setSelectFormInfo] = useState({});
  const [deployFormVersion,setDeployFormVersion] = useState(bizFromInfo.deployFormVersion);//对应的是formVersion
  const [expandedRowKeys,setExpandedRowKeys] = useState([]);
  const [limit,setLimit] = useState(10);
  console.log('formData==',formData);
  //获取业务表单数据
  const getBusinessForm=(start,limit)=>{
    dispatch({
      type:'applyModelConfig/getBusinessForm',
      payload:{
        ctlgId:bizSolInfo.ctlgId,
        start,
        limit,
        type:'1,3'
      },
      extraParams:{
        setState:setParentState,
        state:parentState
      }
    })
  }
  useEffect(()=>{
    getBusinessForm(1,limit)
  },[])
  //分页
  const changePage=(nextpage,size)=>{
    setExpandedRowKeys([]);
    setLimit(size)
    getBusinessForm(nextpage,size)
  }
  //子版本的单选事件
  // const rowSelectionChildForm= {
  //   selectedRowKeys:[selectFormId],
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     setSelectFormId(selectedRowKeys[0])
  //   }
  // };
  const handelCancle=()=>{
    setParentState({
      isShowFormModal:false
    })
  }
  //表单
  const rowSelectionForm= {
    selectedRowKeys:[selectFormId],
    onChange: (selectedRowKeys, selectedRows) => {
      console.log('selectedRows=')
      setSelectFormId(selectedRowKeys[0])
      setSelectFormInfo(selectedRows[0]);
      setDeployFormVersion(selectedRows[0].formVersion)
      dispatch({
        type:'applyModelConfig/updateStatesGlobal',
        payload:{
          designItem:selectedRows,
        }
      })
    }
  };
  //选中行
  const selectRow=(record)=>{
    return{
      onClick:()=>{
        setSelectFormId(record.id)
        setSelectFormInfo(record);
        setDeployFormVersion(record.formVersion)
        dispatch({
          type:'applyModelConfig/updateStatesGlobal',
          payload:{
            designItem:[record],
          }
        })
      }
    }
  }
  //设置表单的值
  const setSelectFormValue=()=>{
    let formBizFormId = bizFromInfo.formBizFormId;
    if(Object.keys(selectFormInfo).length){
      let selectOne = {};
      formData.map((item)=>{
        if(item.id===selectFormId){
          selectOne=item;
        }else if(item.children&&item.children.length){
          let selectOnes = item.children.filter(child=>child.id==selectFormId);
          if(selectOnes.length){
            selectOne=selectOnes[0]
          }

        }
      })
      if(formBizFormId!=selectFormId){
        bizFromInfo.usedFlag = 0;
      }
      bizFromInfo.formBizFormId=selectFormId;
      bizFromInfo.formDeployId=selectOne.deployId||selectOne.deployFormId;
      bizFromInfo.deployFormVersion = deployFormVersion;
      tableData[2].name = selectFormInfo.bizFormName;
      tableData[2].code = selectFormInfo.bizFormCode;
      setParentState({
        bizFromInfo,
        tableData:tableData
      })
    }
  }
  //保存
  const saveList=()=>{
    if(selectFormId){
      //判断表单和流程有没有版本，有则更新配置信息并切换版本，没有则是更改并版本变成编辑中
      if(bizFromInfo&&bizFromInfo.formBizFormId!=selectFormId){//配置信息已经存在的时候
        dispatch({
          type:"applyModelConfig/getBizSolFormConfigProDef",
          payload:{
            bizSolId:bizSolId,
            procDefId,
            formDeployId:selectFormInfo.deployId
          },
          callback:()=>{
            setSelectFormValue()
          },
          extraParams:{
            setState:setParentState,
            state:parentState
          }
        })
      }else{//新增配置信息的时候
        setSelectFormValue()
      }
      setParentState({
        isShowFormModal:false,
        titleList:[]
      })
    }else{
      message.error('请选择表单');
    }
  }
  const onExpand=(expanded,record)=>{
    if(expanded){
      expandedRowKeys.push(record.id);
      dispatch({
        type:"applyModelConfig/getFormOtherVersions",
        payload:{
          formId:record.formId
        },
        extraParams:{
          setState:setParentState,
          state:parentState
        }
      })
      setExpandedRowKeys(expandedRowKeys)
    }else{
      let tmpKeys = expandedRowKeys.filter(i=>i!=record.id);
      setExpandedRowKeys(tmpKeys)
    }
  }
  return (
    <GlobalModal
      visible={true}
      title="表单"
      onCancel={handelCancle}
      widthType={3}
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
      bodyStyle={{padding:'0px',overflow:'hidden',position:'relative'}}
    >
      <Table
        dataSource={_.cloneDeep(formData)}
        columns={columns}
        rowKey={"id"}
        onRow={selectRow}
        scroll={{ y: 'calc(100% - 78px)' }}
        pagination={false}
        rowSelection={{
          type:'radio',
          ...rowSelectionForm,
          checkStrictly:true
        }}
        taskType={'MONITOR'}
        expandable={{
          onExpand:onExpand,
          expandedRowKeys:expandedRowKeys,
          indentSize:25,
          expandIcon: ({ expanded, onExpand, record }) =>
          record.bizFormType==1||record.isChildVersion=='0'?null:(
              expanded ? (
                <MinusSquareOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    onExpand(record, e);
                  }}
                  style={{paddingRight:'4px'}}
                />
              ) : (
                <PlusSquareOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    onExpand(record, e);
                  }}
                  style={{paddingRight:'4px'}}
                />
              )
            )
        }}
      />
      <IPagination
        current={formCurrentPage}
        pageSize={limit}
        total={formReturnCount}
        onChange={changePage.bind(this)}
        style={{borderTop:'1px solid rgb(235, 235, 235)',height:'38px',right:'0px',width:'100%',background:'#fff',paddingRight:'8px'}}
      />
    </GlobalModal>
  )
}
export default connect(({layoutG,applyModelConfig})=>{return {layoutG,applyModelConfig}})(ModalFrom);
