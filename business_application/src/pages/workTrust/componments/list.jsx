import { Table, Input, Button, Modal, message } from 'antd';
import { dataFormat } from '../../../util/util';
import styles from './list.less';
import { connect } from 'umi';
import { useEffect } from 'react';
import IPagination from '../../../componments/public/iPagination';
import ColumnDragTable from '../../../componments/columnDragTable';
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import AddWorkTrust from './addWorkTrust';
import search_black from '../../../../public/assets/search_black.svg'
const { confirm } = Modal;
function List({ dispatch, workTrust }) {
  const { selectedRowKeys, list, isShow, limit, currentPage, returnCount, searchWord,currentHeight } = workTrust;
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: ORDER_WIDTH,
      render: (text, obj, index) => <div>{index + 1}</div>
    },
    {
      title: '委托人',
      dataIndex: 'trustUserName',
      key: 'trustUserName',
      width: BASE_WIDTH,
    },
    {
      title: '被委托人',
      dataIndex: 'trustedUserName',
      key: 'trustedUserName',
      width: BASE_WIDTH,
    },
    {
      title: '委托开始时间',
      dataIndex: 'trustStartTime',
      key: 'trustStartTime',
      width: BASE_WIDTH*1.5,
      render: (text) => <div>{text ? dataFormat(text, 'YYYY-MM-DD HH:mm:ss') : ''}</div>
    },
    {
      title: '委托结束时间',
      dataIndex: 'trustEndTime',
      key: 'trustEndTime',
      width: BASE_WIDTH*1.5,
      render: (text) => <div>{text ? dataFormat(text, 'YYYY-MM-DD HH:mm:ss') : ''}</div>
    },
    {
      title: '委托时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: BASE_WIDTH*1.5,
      render: (text) => <div>{text ? dataFormat(text, 'YYYY-MM-DD') : ''}</div>
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      width: BASE_WIDTH,
      fixed:'right',
      render: (text, obj) => <div className='table_operation'>
        <span onClick={showAddModalFn.bind(this, obj)}>编辑</span>
        <span className='table_operation_del' onClick={delWork.bind(this, [text],obj)}>删除</span>
      </div>
    }
  ]
  //获取列表
  useEffect(() => {
    getWorkTrust(searchWord, 1, limit);
  }, [limit])
  //显示添加编辑弹框
  const showAddModalFn = (obj) => {
    dispatch({
      type: "workTrust/updateStates",
      payload: {
        trustInfo: obj,
        isShow: true,
        selectedDataIds:[obj.trustedIdentityId]
      }
    })
  }
  //删除
  const delWork = (ids,obj) => {
    dispatch({
      type: "workTrust/updateStates",
      payload: {
        trustInfo:obj
      }
    })
    if (ids.length) {
      confirm({
        content:'确认要删除工作委托吗？',
        getContainer:(()=>{
          return document.getElementById('work_trust')
        }) ,
        mask:false,
        maskClosable:false,
        onOk:()=>{
          dispatch({
            type: "workTrust/deleteTrust",
            payload: {
              ids: ids.join(',')
            }
          })
        }
      })
    }else{
      message.warning('请选择要删除的工作委托')
    }
  }
  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      dispatch({
        type: "workTrust/updateStates",
        payload: {
          selectedRowKeys
        }
      })
    }
  }
  const changeSearchWord = (e) => {
    dispatch({
      type: "workTrust/updateStates",
      payload: {
        searchWord: e.target.value
      }
    })
  }
  const searchWordFn = (value) => {
    getWorkTrust(value, 1, limit)
  }
  const getWorkTrust = (searchWord, start, limit) => {
    dispatch({
      type: "workTrust/getWorkTrust",
      payload: {
        start,
        limit,
        searchWord
      }
    })
  }
  const changePage = (nextPage, size) => {
    dispatch({
      type: "workTrust/updateStates",
      payload: {
        limit: size,
        currentPage:nextPage
      }
    })
    getWorkTrust(searchWord, nextPage, size)
  }
  return (
    <div className={styles.work_warp} id="work_trust">
      <div id="list_head" style={{height:'100%'}}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Input.Search
            onSearch={searchWordFn}
            value={searchWord}
            onChange={changeSearchWord}
            allowClear
            placeholder="输入标题/委托人/受委托人"
            enterButton={<img src={search_black} style={{ marginRight: 8,marginTop:-3,marginLeft:4 }}/>}
          />
        </div>
        <div className={styles.right}>
          <Button type="primary" onClick={showAddModalFn.bind(this, {})}>新增</Button>
          <Button type="primary" onClick={delWork.bind(this, selectedRowKeys,{})}>删除</Button>
        </div>
      </div>
      </div>
      <ColumnDragTable
        tableLayout="fixed"
        taskType="MONITOR"
        modulesName="workTrust"
        columns={columns}
        dataSource={list}
        pagination={false}
        scroll={{ y:currentHeight }}
        rowKey="id"
        rowSelection={{
          type: "checkbox",
          ...rowSelection
        }}
      />
      <IPagination current={Number(currentPage)} total={returnCount} onChange={changePage} pageSize={limit} isRefresh={true} refreshDataFn={()=>{
        getWorkTrust(searchWord, 1, limit)
      }}/>
      {isShow && <AddWorkTrust />}
    </div>
  )
}
export default connect(({ workTrust }) => { return { workTrust } })(List);
