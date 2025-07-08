import {Button,Modal,Input, message} from 'antd';
import {connect,history} from 'umi';
import ITree from '../../../componments/public/iTree';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
import {useEffect, useState} from 'react';
import styles from './modalCode.less';
import {dataFormat} from '../../../util/util'
import GlobalModal from '../../../componments/GlobalModal';
import Table from '../../../componments/columnDragTable';
function ModalCode({query,dispatch,loading,parentState,setParentState}){
  const {codeRuleInfo,codeRules,selectIndex,codeList,codeSelectedKeys,oldCodeRules,fromCols}=parentState;
  const {bizSolId}=query
  console.log('parentState==',parentState);
  const [selectedRowKeys,setSelectedRowKeys] = useState([codeList[selectIndex].codeRuleId]);
  const [res,setRes]=useState([])
  const columns=[
  {
    title: '编号名称',
    dataIndex: 'codeRuleName'
  },
  {
    title: '编号预览',
    dataIndex: 'codeRuleView'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    render:(text)=><div>{dataFormat(text,'YYYY-MM-DD HH:mm')}</div>
  },
]
  //选择数据
  const selectData=(selectedKeys)=>{
    dispatch({
      type:"applyModelConfig/getCodeRuleInfo",
      payload:{
        codeRuleId:selectedKeys[0],
        codeName:'',
        start:1,
        limit:10000,
        ackFlag:'NO'
      },
      extraParams:{
        setState:setParentState,
        state:parentState
      }
    })
    setParentState({
      codeSelectedKeys:selectedKeys[0]
    })
  }
  const rowSelection={
    selectedRowKeys:selectedRowKeys,
    onChange:(selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }
  //右侧渲染
  const renderRight=()=>{
    return <Table
      dataSource={codeRuleInfo}
      columns={columns}
      rowKey="codeRuleId"
      loading={loading.global}
      rowSelection={{
        type: 'radio',
        ...rowSelection,
      }}
      scroll={{y:'calc(100% - 41px)'}}
      pagination={false}
  />
  }
  //更新选择的code
  const updateSelectCode=()=>{
    if(selectedRowKeys[0]=='add_0'){
      message.error('请选择编号')
      return
    }
    codeList[selectIndex].codeRuleId=selectedRowKeys[0];
    //通过id获取codeview
    let codeview = '';
    let needCodeRuleIds='';
    let codeRuleName="";
    let countType=null;
    codeRuleInfo.map((item)=>{
      if(item.codeRuleId==selectedRowKeys[0]){
        codeRuleName=item.codeRuleName;
        codeview=item.codeRuleView;
        needCodeRuleIds=item.needCodeRuleIds;
        countType = item.countType;
        return;
      }
    })
    let relFromCols = [];
    if(countType=='ORG'){
      relFromCols = fromCols.filter(i=>i.colType=='ORGTREE');
    }else if(countType=='DEPT'){
      relFromCols = fromCols.filter(i=>i.colType=='DEPTTREE');
    }
    codeList[selectIndex].relationCol = '';
    codeList[selectIndex].relFromCols = relFromCols;
    codeList[selectIndex].codeView=codeview;
    codeList[selectIndex].needCol=[];
    codeList[selectIndex].codeRuleName=codeRuleName;
    if(needCodeRuleIds){
      needCodeRuleIds.split(',').map((item)=>{
        codeList[selectIndex].needCol.push({
          codeRuleId:item,
          formColumnId:'',
          formColumnCode:'',
          needColType:'VALUE'
        })
      })
    }
    setParentState({
      codeList:codeList,
      isShowCodeModal:false,
      codeSelectedKeys:[]
    })
  }
  const handelCancel=()=>{
    setParentState({
      isShowCodeModal:false,
      codeSelectedKeys:[]
    })
  }
  const onChangeValue=(e)=>{
      setRes([])
  }
  const searchTree = (data, searchWord) => {

    data.forEach((item, index) => {
        if (item.codeRuleName.includes(searchWord)) {
            res.push(item)
        }
        if (item.children) {
            searchTree(item.children, searchWord)
        }
    })

    return res
  }
  const onSearchTree= (value)=>{
      if(value){
        const resultTree=searchTree(_.cloneDeep(oldCodeRules),value)
        resultTree.forEach((item=>{
            item.children=[]
        }))
        setParentState({
          codeRules:resultTree
        })
        setRes([])
      }else{
        setParentState({
          codeRules:oldCodeRules
        })
      }
  }
  return (
    <GlobalModal
      visible={true}
      title="选择编号"
      widthType={3}
      bodyStyle={{padding:'0px'}}
      centered
      footer={[
        <Button key="cancel" onClick={handelCancel}>取消</Button>,
        <Button key="submit" type="primary" onClick={updateSelectCode} loading={loading.global}>保存</Button>
      ]}
      maskClosable={false}
      mask={false}
      getContainer={() =>{
        return document.getElementById(`code_modal_${bizSolId}`)||false
      }}
      className={styles.code_warp}
      onCancel={handelCancel}
    >
    <ReSizeLeftRight
      height={'inherit'}
      leftChildren={
       <>
       <Input.Search
          className={styles.search}
          placeholder={'请输入分类名称'}
          allowClear
          onChange={onChangeValue.bind(this)}
          onSearch={(value) => { onSearchTree(value) }}
          style={{width:200}}
        />
        <ITree
        field={{titleName:"codeRuleName",key:"codeRuleId",children:"children"}}
        isSearch={false}
        defaultExpandAll={true}
        onSelect={selectData}
        selectedKeys={codeSelectedKeys}
        treeData={codeRules}
        style={{padding:'8px 8px 0px 0px',height:'calc(100% - 32px)'}}
        />
       </>

      }
      rightChildren={renderRight()}
      suffix={`bindCode_${bizSolId}`}
    />
    </GlobalModal>
  )
}
export default connect(({layoutG,applyModelConfig,loading})=>{return {layoutG,applyModelConfig,loading}})(ModalCode);
