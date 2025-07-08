import {Modal,Input,Select,message} from 'antd';
import Table from '../../../componments/columnDragTable/index';
import styles from './ruleCloumsModal.less';
import {useState} from 'react';
import { useEffect,useCallback } from 'react';
const columns = [
  {
    title: '字段名称',
    dataIndex: 'formColumnName',
    key: 'formColumnName',
  },
  {
    title: '字段编码',
    dataIndex: 'formColumnCode',
    key: 'formColumnCode',
  }
];
function RuleColumsModal({query,setIsShowColumsModal,allCol,confirmColums,selectCol}){
  const {bizSolId} = query;
  const [dataSource,setDataSource] = useState([]);
  const [oldDataSource,setOldDataSource] = useState([]);
  const [selectedRowKeys,setSelectedRowKeys] = useState([]);
  const [selectedRows,setSelectedRows] = useState([]);
  const [selectTableInfo,setSelectTableInfo] = useState({});
  const [height, setHeight] = useState(
    document.getElementById(`code_modal_${bizSolId}`)?document.getElementById(`code_modal_${bizSolId}`).offsetHeight-62-87:0
  )
  const onResize = useCallback(() => {
    setHeight(
      Number(
        document.getElementById(`code_modal_${bizSolId}`).offsetHeight-62-87
      )
    )
  }, [])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])
  useEffect(()=>{
    if(selectCol){
      //获取输入框选中的字段
      if(selectCol.includes('__')){
        let selectCols = selectCol.split('__');
        //为子表的时候
        let infos = _.find(allCol,{formCode:selectCols[0]});
        setDataSource(infos?.columnList||[]);
        setOldDataSource(infos?.columnList||[]);
        setSelectTableInfo(infos);
        //选中的值
        let selectCodeInfo = _.find(infos?.columnList,{formColumnCode:selectCols[1]});
        setSelectedRowKeys([selectCols[1]]);
        setSelectedRows([selectCodeInfo]);
      }else{
        //默认值第一个为主表
        let infos = _.find(allCol,{tableScope:"MAIN"});
        setDataSource(infos?.columnList||[]);
        setOldDataSource(infos?.columnList||[]);
        setSelectTableInfo(infos);
        //选中的值
        let selectCodeInfo = _.find(infos?.columnList,{formColumnCode:selectCol});
        setSelectedRowKeys([selectCol]);
        setSelectedRows([selectCodeInfo]);
      }
    }else{
      //默认值第一个为主表
      let infos = _.find(allCol,{tableScope:"MAIN"});
      setDataSource(infos?.columnList||[]);
      setOldDataSource(infos?.columnList||[]);
      setSelectTableInfo(infos);
    }
  },[])
  const onOk=()=>{
    if(selectedRows.length){
      confirmColums(selectTableInfo,selectedRows);
      setSelectedRows([]);
      setDataSource([]);
      setOldDataSource([]);
      setSelectedRowKeys([]);
      setIsShowColumsModal(false)
    }else{
      message.error('请选择字段');
    }
  }
  const onCancel = ()=>{
    setSelectedRows([]);
    setDataSource([]);
    setOldDataSource([]);
    setSelectedRowKeys([]);
    setIsShowColumsModal(false)
  }
  //通过表code获取字段
  const selectColFn=(value)=>{
    console.log('item===',value);
    let item = _.find(allCol,{formCode:value})
    setSelectTableInfo(item);
    setDataSource(item.columnList);
    setOldDataSource(item.columnList);
  }
  const rowSelection = {
    selectedRowKeys:selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    }
  };
  //点击选择
  const clickSelect=(record)=>{
    if(!selectedRowKeys.includes(record.formColumnCode)){//选中
      setSelectedRowKeys([record.formColumnCode]);
      setSelectedRows([record]);
    }else{
      //移除
      setSelectedRowKeys([]);
      setSelectedRows([]);
    }
  }
  //搜索
  const searchDataFn=(value)=>{
    if(value){
      let tmpData = oldDataSource.filter(i=>i.formColumnName.includes(value));
      setDataSource(tmpData)
    }else{
      setDataSource(oldDataSource)
    }
  }
  return (
    <Modal
      title="选择字段详情"
      visible={true}
      onOk={onOk.bind(this)}
      onCancel={onCancel.bind(this)}
      width={'75%'}
      bodyStyle={{height:height,padding:'0px',overflow:"hidden"}}
      className={styles.col_modal_warp}
      mask={false}
      maskClosable={false}
      centered
      getContainer={() =>{
        return document.getElementById(`code_modal_${bizSolId}`)||false
      }}
    >
      <div className={styles.header}>
        <Input.Search style={{width:'200px'}} onSearch={searchDataFn.bind(this)} allowClear/>
        <Select
          value={selectTableInfo?.formCode}
          className={styles.col_select}
          onChange={selectColFn.bind(this)}
        >
          {allCol.map((item)=>{
            return (
              <Select.Option value={item.formCode}>{item.formTableName}</Select.Option>
            )
          })}
        </Select>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        style={{height:'calc(100% - 44px)'}}
        rowKey="formColumnCode"
        pagination={false}
        scroll={{y:'calc(100% - 40px)'}}
        taskType={'MONITOR'}
        onRow={(record) => {
          return {
            onClick: (event) => {clickSelect(record)}, // 点击行
          };
        }}
      />
    </Modal>
  )
}
export default RuleColumsModal;
