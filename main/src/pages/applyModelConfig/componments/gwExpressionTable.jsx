// import {Table} from 'antd';
import {connect} from 'dva';
import DesignModal from './designModal';
import Table from '../../../componments/columnDragTable';
function GWExpressionTable({query,dispatch,setChangeStatus,setParentState,parentState}){
  const {gatewayExpressionList,isShowDesign,gatewayParamList,designIndex}=parentState;
  const columns = [
    {
      title: '目标节点',
      dataIndex: 'targetActName',
      width:'180px',
      render: (value, record, index) => {
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = record.rowSpan
        return obj;
      }
    },
    {
      title: <div>条件表达式片段<span style={{color:'red',fontSize:'14px'}}>（注：各表达式片段为逻辑或关系）</span></div>,
      dataIndex: 'expressionDesign',
      render:(text)=><div style={{wordBreak:'break-all'}}>{text}</div>
    },
    {
      title: '操作',
      dataIndex: 'index',
      width:'120px',
      render:(text,record,index)=>
        <div className="table_operation" style={{width:"120px"}}>
          <span onClick={showDesignFn.bind(this,true,index,record)}>设计</span>
          <span onClick={addExpression.bind(this,index,record)}>添加</span>
          <span onClick={delExpression.bind(this,index,record)}>删除</span>
        </div>
    },
  ];
  //显示设计
  const showDesignFn=(isShowDesign,index,record)=>{
    setParentState({
      isShowDesign:isShowDesign,
      designIndex:index
    })
  }
  //添加表达式行
  const addExpression=(index,record)=>{
    //添加
    let addData = {
      targetActId:record.targetActId,
      targetActName:record.targetActName,
      expressionDesign:'',
      rowSpan:0
    }
    gatewayExpressionList.splice(index+1,0,addData);
    //更新rowSpan
    gatewayExpressionList.map((item)=>{
      if(item.rowSpan&&item.targetActId==record.targetActId){
        item.rowSpan = item.rowSpan+1;
      }
    })
    setParentState({
      gatewayExpressionList:JSON.parse(JSON.stringify(gatewayExpressionList))
    })
  }
  //删除表达行
  const delExpression=(index,record)=>{
    setChangeStatus(true);
    //删除
    if(record.rowSpan!=0){
      let curNodeDatas = gatewayExpressionList.filter(i=>i.targetActId==record.targetActId);
      console.log('curNodeDatas=',curNodeDatas);
      if(curNodeDatas.length==1){
        gatewayExpressionList[index].expressionDesign='';
      }else{
        gatewayExpressionList.splice(index,1);
        gatewayExpressionList[index].rowSpan = curNodeDatas.length-1;
      }
    }else{
      gatewayExpressionList.splice(index,1);
      //更新rowSpan
      gatewayExpressionList.map((item,newIndex)=>{
        if(item.rowSpan&&item.targetActId==record.targetActId){
          item.rowSpan = item.rowSpan-1;
        }
      })
    }
    // //更新rowSpan
    // gatewayExpressionList.map((item,newIndex)=>{
    //   if(index==0&&newIndex==0){//如果删除为第一个则新的第一个的rowSpan为gatewayExpressionList的长度减一
    //     item.rowSpan = gatewayExpressionList.length-1;
    //   }else if(item.rowSpan&&item.targetActId==record.targetActId){
    //     item.rowSpan = item.rowSpan-1;
    //   }
    // })
    setParentState({
      gatewayExpressionList:JSON.parse(JSON.stringify(gatewayExpressionList))
    })
  }
  const saveDesign=(expression)=>{
    gatewayExpressionList[designIndex].expressionDesign=expression;
    setParentState({
      gatewayExpressionList:JSON.parse(JSON.stringify(gatewayExpressionList))
    })
    showDesignFn(false);
  }
  return (
    <div>
    <Table
      columns={columns}
      dataSource={gatewayExpressionList}
      pagination={false}
      bordered
      rowKey={"index"}
      style={{height:'auto'}}
      />
      {isShowDesign&&<DesignModal
        handelCancleDesign={showDesignFn.bind(this,false)}
        gatewayParamList={gatewayParamList}
        saveDesign={saveDesign}
        content={gatewayExpressionList.length?gatewayExpressionList[designIndex].expressionDesign:''}
        setChangeStatus={setChangeStatus}
        query={query}

      />}
    </div>
  )
}
export default connect(({applyModelConfig})=>{return {applyModelConfig}})(GWExpressionTable);
