import {Modal,Form,Button,Select,Input,InputNumber,Table} from 'antd';
import { useEffect,useState,useCallback } from 'react';
import styles from './gwExpressionTable.less';
import GlobalModal from '../../../componments/GlobalModal';
const NUM_CONDITION = [
  {
    key:"<",
    name:'<'
  },
  {
    key:"<=",
    name:'<='
  },
  {
    key:"==",
    name:'=='
  },
  {
    key:">=",
    name:'>='
  },
  {
    key:">",
    name:'>'
  },
];
const STRING_CONDITION =[
  {
    key:"==",
    name:'等于'
  },
  {
    key:"!=",
    name:'不等于'
  },
]
function DesignModal({handelCancleDesign,gatewayParamList,saveDesign,content,setChangeStatus,query}){
  console.log(query,'query');
  const {bizSolId}=query
  const [numList,setNumList] =useState([]);//数值字段
  const [stringList,setStringList]=useState([]);//字符串字段
  const [expression,setExpression] = useState('');
  const [form] = Form.useForm();
  const [data,setData] = useState([{
    title:'数值',
    colCode:'',
    condition:'<',
    value:"",
    type:"num"
  },
  {
    title:'字符串',
    colCode:'',
    condition:'<',
    value:"",
    type:"string"
  }]);
  const [conditionData,setConditionData] = useState([
    {
      title:'符号',
      condition:'(,),&&,||',
    },
    {
      title:'表达式',
      condition:'',
    }
  ])
  useEffect(()=>{
    let numList = [];
    let stringList = [];
    gatewayParamList.map((item)=>{
      if(item.paramType!='STRING'){//字符串
        numList.push({
          key:item.paramName,
          name:item.paramDesc
        })
      }else{
        stringList.push({
          key:item.paramName,
          name:item.paramDesc
        })
      }
    })
    setNumList(numList);
    setStringList(stringList);
    setExpression(content);
    form.setFields([{
      name:`col_num`,
      value:numList.length?numList[0].key:''
    },
    {
      name:`col_string`,
      value:stringList.length?stringList[0].key:''
    }
  ])
  },[])
  const columns=[
    {
      title:'标题',
      dataIndex:'title',
      width:100,
      render:(text)=>{
        return (
          <div style={{float:'right'}}>{text}:</div>
        )
      }
    },
    {
      title:'条件',
      dataIndex:'condition',
      render:(text,row,index)=>{
        let colList = [];
        let conditionSelect = [];
        switch(row.type){
          case 'num':
            colList = numList;
            conditionSelect=NUM_CONDITION;
            break;
          case "string":
            colList=stringList;
            conditionSelect=STRING_CONDITION;
            break;
        }
        console.log('colList=',colList);
        return (
          <div className={styles.form_item_style}>
            <Form.Item
              label=""
              name={`col_${row.type}`}
              style={{display:'inline-block'}}
              rules={[
                {required:'true',message:'不能为空'}
              ]}
            >
              <Select style={{width:'100px'}}>
                {colList.map((item)=>{
                  return (
                    <Select.Option value={item.key} key={item.key}>{item.name}</Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label=""
              name={`condition_${row.type}`}
              style={{display:'inline-block'}}
              initialValue={conditionSelect[0].key}
              rules={[
                {required:'true',message:'不能为空'}
              ]}
            >
              <Select style={{width:'100px'}}>
                {conditionSelect.map((item)=>{
                  return (
                    <Select.Option value={item.key} key={item.key}>{item.name}</Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label=""
              name={`value_${row.type}`}
              style={{display:'inline-block'}}
              rules={[
                {required:'true',message:'不能为空'}
              ]}
            >
              {row.type=='num'?
                <InputNumber style={{width:'200px'}}/>:
                <Input style={{width:'200px'}}/>
              }
            </Form.Item>
          </div>
        )
      }
    },
    {
      title:'操作',
      dataIndex:'type',
      width:100,
      align:'center',
      render:(text)=>{
        if(text=='num'){
          return (
            <span onClick={insertCondition.bind(this,text)} className={styles.opration}>插入</span>
          )
        }else{
          return (
            <span onClick={insertCondition.bind(this,text)} className={styles.opration}>插入</span>
          )
        }
      }
    },
  ];
  const conditionColumns=[
    {
      title:'标题',
      dataIndex:'title',
      width:100,
      render:(text)=>{
        return (
          <div style={{float:'right'}}>{text}:</div>
        )
      }
    },
    {
      title:'条件',
      dataIndex:'condition',
      render:(text,row,index)=>{
        if(index==0){
          let symbol = text.split(',');
          return symbol.map((item)=>{
            return <span key={item} className={styles.symbol} onClick={()=>{insertContent(item)}}>{item}</span>
          })
        }else{
          return (
            <Input.TextArea style={{height:"200px"}} value={expression} onChange={changeCondition}></Input.TextArea>
          )
        }
      }
    },
  ];
  //改变表达式
  const changeCondition=(e)=>{
    setExpression(e.target.value);
  }
  //插入
  const insertCondition=(type)=>{
    const values = form.getFieldsValue(true);
    let col = values[`col_${type}`];
    let condition = values[`condition_${type}`];
    let value = values[`value_${type}`];
    //拼接
    let conditionString = '';
    if(type=='num'){
      if(!value){
        value=0;
      }
      conditionString= col+condition+`${value}`;
    }else{
      conditionString= col+condition+`'${value}'`;
    }
    insertContent(conditionString);
  }
  const insertContent=(content)=>{
    let newExpression = expression+content;
    setExpression(newExpression);
  }
  const saveExpression = ()=>{//TODO
    setChangeStatus(true);
    saveDesign(expression);
  }
  return (
    <GlobalModal
      visible={true}
      title="设计表达式"
      widthType={1}
      centered
      onCancel={handelCancleDesign}
      className={styles.design_modal}
      onOk={saveExpression.bind(this)}
      mask={false}
      maskClosable={false}
      bodyStyle={{overflow:'auto',padding:"0px"}}
      getContainer={() =>{
          return document.getElementById(`code_modal_${bizSolId}`)||false
      }}
    >
      <Form form={form} name="design">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          showHeader={false}
          bordered={true}
          className={styles.form_table}
        />
      </Form>
      <Table
          className={styles.condition_table}
          columns={conditionColumns}
          dataSource={conditionData}
          pagination={false}
          showHeader={false}
          bordered={true}
      />
    </GlobalModal>
  )
}
export default DesignModal;
