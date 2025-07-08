import React, { useEffect, useState ,useCallback} from 'react'
import { connect } from 'dva'
import { Input, Table, Button ,Modal,message} from 'antd'
import IPagination from '../../../componments/public/iPagination'
import AddLogic from './addLogic'
import ConfigModal from './configModal'
import styles from '../index.less'
import searchIcon from '../../../../public/assets/search_black.svg'
import ColumnDragTable from '../../../componments/columnDragTable'
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
function applyCorrelation({ dispatch, applyCorrelation }) {
  const { Search } = Input
  const {confirm} =Modal
  const { limit ,selectedRowKeys,list,currentPage,returnCount,searchWord,isShow,isShowConfig,configData,totalData,detailConfigList} = applyCorrelation
  const [height,setHeight] = useState(document.documentElement.clientHeight-305)
    const onResize = useCallback(()=>{
    setHeight(document.documentElement.clientHeight-305)
    },[])
  useEffect(() => {
    window.addEventListener('resize',onResize);
    return (()=>{
        window.removeEventListener('resize',onResize)
    })
  }, [])
  useEffect(()=>{
    if(limit>0){
      getApplyCorrelationList('',limit,1)
    }
  },[limit])
  const getApplyCorrelationList = (searchWord,limit,start) => {
    dispatch({
      type: 'applyCorrelation/getApplyCorrelationList',
      payload: {
        searchWord,
        limit,
        start
      }
    })
  }
  //搜索
  const onSearch = (value) => {
    console.log(value,'value');
    dispatch({
        type: "applyCorrelation/updateStates",
        payload: {
          searchWord: value
        }
      })
      getApplyCorrelationList(value,limit,1)
}
  const changePage = (nextPage, size) => {
    dispatch({
      type: "applyCorrelation/updateStates",
      payload: {
        limit: size
      }
    })
    getApplyCorrelationList(searchWord,size,nextPage)
  }
  //删除
  const deleteApply=(ids)=>{
    console.log(ids,'ids');
    if(ids.length>0){
      confirm({
        content:'确认要删除吗？',
        mask:false,
        getContainer:()=>{
          return document.getElementById('applyCorrelation_container')
        },
        onOk:()=>{
          dispatch({
            type:'applyCorrelation/deleteApplyCorrelation',
            payload:{
              logicIds:ids.join(',')
            }
          })
        }

      })
    }else{
      message.warning('请选择一条数据')
    }
  }
  //导出
  const exportApply=(ids)=>{
    console.log(ids,'ids');
    dispatch({
      type:'applyCorrelation/exportApplyCorrelation',
      payload:{
        logicIds:ids.join(',')
      }
    })
  }
  //新增
  const addApply=(type)=>{
      dispatch({
        type:'applyCorrelation/updateStates',
        payload:{
          isShow:true
        }
      })
  }
  //修改
  const updateApply=(record)=>{
    console.log(record,'record');
    dispatch({
      type:'applyCorrelation/updateStates',
      payload:{
        isShow:true,
        detailData:record,
        selectBusiness: [record.bizSolId],
        selectBusinessRows:[record]
      }
    })
  }
  const changeConfig=(data,record)=>{
    let newData = []
    data.map((item, index) => {
      newData.push({
            relationBizSolId: item.relationBizSolId,
            relationBizSolName: item.relationBizSolName,
            relationLogicCode: item.relationLogicCode,
            relationLogicName: item.relationLogicName,
            tableData: []
        })
    })
    let c = newData
    for (var i = 0; i < newData.length; i++) {
        // 获取当前元素后的所有元素
        for (var j = i + 1; j < c.length; j++) {
            // 判断两个元素的值是否相等
            if (newData[i].relationLogicCode == c[j].relationLogicCode) {
                // 如果相等则证明出现了重复的元素，则删除j对应的元素
                newData.splice(j, 1);
                // 当删除了当前j所在的元素以后，后边的元素会自动补位
                // 此时将不会在比较这个元素 所以需要在比较一次j所在的位置的元素 使j自减
                j--;
            }
        }
    }

    console.log(newData);
    data.forEach((item, index) => {
        if(record.bizSolId){//新导入的 重新绑定了应用建模 修改对应配置的bizSolId和bizSolName
          item.bizSolId=record.bizSolId,
          item.bizSolName=record.bizSolName
        }
        newData.forEach((val, index) => {
            if (item.relationLogicCode == val.relationLogicCode) {
                val.tableData.push(item)
            }
        })
    })
    var random = function () { // 生成10-12位不等的字符串
        return Math.random().toString(36).slice(2); // 截取小数点后的字符串
    }
    newData.forEach((item, index) => {
        item.tableData.forEach((val, ind) => {
            if (ind == 0) {
                val.conditionNum = item.tableData.length
                val.groupName = index + 1
                val.key = random()
                val.isRowCol = true
            } else {
                val.conditionNum = item.tableData.length
                val.groupName = index + 1
                val.key = random()
                val.isRowCol = false
            }

        })

    })
    console.log(newData, 'newBB');
    return newData
  }
  const loopTree=(data)=>{

      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        item.title=item.dictInfoName
        item.value=item.dictInfoCode

        if (item.children && item.children.length > 0) {
          item.children = loopTree(item.children);
        }
      }

      return data;
  }
  //配置
  const showConfigFun=async(record)=>{
    console.log(detailConfigList,'detailConfigList');
    console.log(record,'config==');
   await dispatch({
      type:'applyCorrelation/getDetailConfig',
      payload:{
        logicCode:record.logicCode
      },
      callback:(data)=>{
        let newData=changeConfig(data,record)
       let item= newData[0].tableData [newData[0].tableData.length-1]
         dispatch({
          type:'applyCorrelation/updateStates',
          payload:{
            totalData:data.length>0?newData:totalData,
            groupNum:item.groupName
          }
        })
      }
    })
    await dispatch({
      type:'applyCorrelation/updateStates',
      payload:{
        isShowConfig:true,
        configData:record,
      }
    })
      dispatch({
        type: 'applyCorrelation/getDictType',
        payload: {
            dictTypeCode: 'SYS_RELATION',
            showType: 'ALL',
            isTree: '1',
            searchWord: ''
        },
        callback:(data)=>{
          dispatch({
            type:'applyCorrelation/updateStates',
            payload:{
              relationData:data
            }
          })
        }
      });
      dispatch({
        type: 'applyCorrelation/getDictType',
        payload: {
            dictTypeCode: 'SYS_ATTRIBUTE',
            showType: 'ALL',
            isTree: '1',
            searchWord: ''
        },
        callback:(data)=>{
          dispatch({
            type:'applyCorrelation/updateStates',
            payload:{
              attributeData:data
            }
          })
        }
      });
      dispatch({
        type: 'applyCorrelation/getDictType',
        payload: {
            dictTypeCode: 'SYS_LABEL',
            showType: 'ALL',
            isTree: '1',
            searchWord: ''
        },
        callback:(data)=>{
          dispatch({
            type:'applyCorrelation/updateStates',
            payload:{
              labelData:loopTree(data)
            }
          })
        }
      });

  }
  const tableProps = {
    rowKey: 'logicId',
    columns: [
      {
        title: '序号',
        render: (text, record, index) => <span>{index + 1}</span>,
        width:ORDER_WIDTH
      },
      {
        title: '逻辑功能名称',
        dataIndex: 'logicName',
        width:BASE_WIDTH
      },
      {
        title: '逻辑功能编码',
        dataIndex: 'logicCode',
        width:BASE_WIDTH
      },
      {
        title: '绑定业务应用建模名称',
        dataIndex: 'bizSolName',
        width:BASE_WIDTH
      },
      {
        title: '操作',
        dataIndex: 'logicId',
        width:BASE_WIDTH,
        render: (text, record) => {
          return (
            <div className='table_operation'>
              <a onClick={()=>{updateApply(record)}}>修改</a>
              <a onClick={()=>{deleteApply([text])}}>删除</a>
              <a onClick={()=>{showConfigFun(record)}}>配置</a>
            </div>
          )
        }
      },
    ],
    dataSource: list,
    pagination: false,
    rowSelection: {
      selectedRowKeys: selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys,'selectedRowKeys');
        dispatch({
          type: 'applyCorrelation/updateStates',
          payload: {
            selectedRowKeys,
          }
        })
      }
    }
  }
  return (
    <div className={styles.container} id='applyCorrelation_container'>
      <div className={styles.header} id='list_head'>
        <div className={styles.search}>
          <Search placeholder='请输入逻辑功能名称' onSearch={onSearch} allowClear
             enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
          />
        </div>
        <div className={styles.button}>
          <Button onClick={()=>{addApply('add')}}>新增</Button>
          <Button onClick={()=>{deleteApply(selectedRowKeys)}}>删除</Button>
          <Button onClick={()=>{exportApply(selectedRowKeys)}}>导出</Button>
        </div>
      </div>
      <div className={styles.table}>
        <ColumnDragTable taskType="MONITOR" modulesName="applyCorrelation" {...tableProps} scroll={list.length ? { y: 'calc(100% - 51px)' } : {}} />
      </div>
      <IPagination current={Number(currentPage)} total={Number(returnCount)} onChange={changePage} pageSize={limit}
                />
      {isShow&&<AddLogic/>}
      {isShowConfig&&<ConfigModal/>}
    </div>
  )
}
export default connect(({ applyCorrelation }) => ({ applyCorrelation }))(applyCorrelation)
