import {Modal,Input,Breadcrumb} from 'antd';
import ReSizeLeftRightCss from '../../../componments/public/reSizeLeftRight';
import styles from './enclosureModal.less';
import {connect} from 'dva';
import Disk from './disk';
import {dataFormat} from '../../../util/util';
import { useEffect, useState } from 'react';
import IPagination from '../../../componments/public/iPagination';
import GlobalModal from '../../../componments/GlobalModal';
import Table from '../../../componments/columnDragTable';
const columns = [
  {
    title: '文件名',
    dataIndex: 'cloudDiskName',
    key: 'cloudDiskName',
  },
  {
    title: '类型',
    dataIndex: 'cloudDiskType',
    key: 'cloudDiskType',
  },
  {
    title: '大小',
    dataIndex: 'cloudDiskSize',
    key: 'cloudDiskSize',
    render: (text, record) => {
      if (record.cloudDiskType != '文件夹') {
        return <div>{`${text / 1024 / 1024 >= 1024 ? `${(text / 1024 / 1024 / 1024).toFixed(2)}GB` : `${(text / 1024 / 1024).toFixed(2)}MB`}`}</div>
      } else {
        return <div></div>
      }
    }
  },
  {
    title: '上传时间',
    dataIndex: 'createTime',
    key: 'createTime',
    render: (text) => dataFormat(text, 'YYYY-MM-DD HH:mm:ss')
  }
];
function EnclosurceModal({query,dispatch,parentState,setParentState}){
  const {bizSolId} = query;
  const {diskData,currentRule,limit,diskCurrentPage,diskReturnCount,treeId,diskSearchWork,
    selectTreeUrl}=parentState;
    console.log('selectTreeUrl=',selectTreeUrl);
  const [allSelectedRowKeys,setAllSelectedRowKeys] = useState([]);
  const [allSelectRow,setAllSelectRow] = useState([]);
  useEffect(()=>{
    let ids = [];
    let rows = [];
    currentRule.enclosure.map((item)=>{
      ids.push(item.enclosureId);
      rows.push({
        id:item.enclosureId,
        cloudDiskName:item.enclosureName,
        fileId:item.enclosureUrl,
        sort:'1'
      });
    })
    setAllSelectedRowKeys(ids);
    setAllSelectRow(rows);
  },[])
  useEffect(()=>{
    setParentState({
      diskSearchWork:'',
    })
    getPagingList_CommonDisk_List(1,limit,treeId,'')
  },[treeId])
  const rowSelection = {
    selectedRowKeys:allSelectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      //删除掉当前列表里面选中的值
      let newAllSelectedRowKeys = [];
      allSelectedRowKeys.map((item)=>{
        if(!_.find(diskData,{id:item})){
          newAllSelectedRowKeys.push(item);
        }
      })
      let newAllSelectRow =[];
      allSelectRow.map((item)=>{
        if(!_.find(diskData,{id:item.id})){
          newAllSelectRow.push(item);
        }
      })
      setAllSelectedRowKeys([...new Set([...newAllSelectedRowKeys, ...selectedRowKeys])])
      selectedRows.map((item)=>{
        if(!_.find(newAllSelectRow,{id:item.id})){
          newAllSelectRow.push(item)
        }
      })
      setAllSelectRow(newAllSelectRow);
    },
  };
  console.log('allSelectedRowKeys=',allSelectedRowKeys);
  console.log('allSelectRow=',allSelectRow);
  // 分页
  const changePage=(nextPage,size)=>{
    setParentState({
      limit:size
    })
    getPagingList_CommonDisk_List(nextPage,size,treeId,diskSearchWork);
  }
  const getPagingList_CommonDisk_List=(start,limit,treeId,name)=>{
    dispatch({
      type:'applyModelConfig/getPagingList_CommonDisk_List',
      payload:{
        start,
        limit,
        id: treeId?treeId:'0',//必须传0,空不行
        name,
        type: 'L'
      },
      extraParams:{
        setState:setParentState,
        state:parentState
      }
    })
  }
  const diskSearchWorkFn=(e)=>{
    setParentState({
      diskSearchWork:e.target.value
    })
  }
  const searchDiskFn=()=>{
    getPagingList_CommonDisk_List(1,limit,treeId,diskSearchWork)
  }
  //面包屑路径改变，左侧数的选中状态也跟着变
  const changeSelectTreeId=(item,index)=>{
    console.log('item=',item);
    console.log('index=',index);
    let newSelectTreeUrl = [];
    selectTreeUrl.map((item,i)=>{
      if(i<=index){
        newSelectTreeUrl.push(item);
      }
    })
    setParentState({
      treeId: item.key,
      selectTreeUrl:newSelectTreeUrl
    })
  }
  const rightChildren=()=>{
    return (
      <>
        <div className={styles.enclosure}>
        <Breadcrumb separator=">" className={styles.breadcrumb}>
          {selectTreeUrl.map((item,index)=>{
            return (
              <Breadcrumb.Item onClick={changeSelectTreeId.bind(this,item,index)}>{item.title}</Breadcrumb.Item>
            )
          })}
        </Breadcrumb>
          <Input.Search
            onChange={diskSearchWorkFn}
            value={diskSearchWork}
            onSearch={searchDiskFn}
            placeholder="输入文件名"
            className={styles.input_search}
          />
        </div>
        <div style={{height:'calc(100% - 84px)'}}>
          <Table
            className={styles.table}
            columns = {columns}
            dataSource={diskData}
            rowKey="id"
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            pagination={false}
            scroll={{y:'calc(100% - 40px'}}
            taskType={'MONITOR'}
          />
        </div>
        <IPagination
          current={diskCurrentPage}
          total={diskReturnCount}
          pageSize={limit}
          onChange={changePage}
          style={{overflow:'hidden',height:'36px',width:'100%'}}
        />
      </>
    )
  }
  const handelCancel=()=>{
    setParentState({
      isShowEnclosurce:false,
      selectTreeUrl:[{key:'0',title:"公共文件"}],
      treeId:'0',
    })
  }
  const saveEnclosurce=()=>{
    let newEnclosurce=[];
    allSelectRow.map((item)=>{
      newEnclosurce.push({
        enclosureId:item.id,
        enclosureName:item.cloudDiskName,
        enclosureUrl:item.fileId,
        sort:'1'
      })
    })
    currentRule.enclosure = newEnclosurce;
    setParentState({
      currentRule
    })
    handelCancel();
  }
  return (
    <GlobalModal
      visible={true}
      title="关联云盘"
      widthType={2}
      bodyStyle={{padding:'0px'}}
      mask={false}
      maskClosable={false}
      centered
      getContainer={() =>{
      return document.getElementById(`rule_modal_${bizSolId}`)||false
      }}
      onCancel={handelCancel}
      onOk={saveEnclosurce}
    >
      <ReSizeLeftRightCss
        level={1}
        leftChildren={<Disk setSelectedRowKeys={setAllSelectedRowKeys} query={query} setParentState={setParentState} parentState={parentState}/>}
        rightChildren={rightChildren()}
        height={'inherit'}
        suffix={`enclosureModal_${bizSolId}`}
      />
    </GlobalModal>
  )
}
export default connect(({applyModelConfig})=>{return {applyModelConfig}})(EnclosurceModal)
