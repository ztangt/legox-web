import React, { useEffect, useState,useCallback } from 'react'
import { connect } from 'dva'
import { Table, Input, Button ,message,Modal } from 'antd'
import AddControlModal from './addControlModal'
import {CONTROLCODE,DRIVETYPE} from '../../../service/constant'
import axios from 'axios'
import styles from '../index.less'
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import IPagination from '../../../componments/public/iPagination'
import ColumnDragTable from '../../../componments/columnDragTable'
import searchIcon from '../../../../public/assets/search_black.svg'
const { Search } = Input
const { confirm } = Modal;
function controlManagement({ dispatch, controlManagement }) {
    const {searchWord,businessControlList,selectedRowKeys,isShow,detailData,limit,currentPage,returnCount}=controlManagement
    const [height,setHeight] = useState(document.documentElement.clientHeight-285)
    const onResize = useCallback(()=>{
    setHeight(document.documentElement.clientHeight-285)
    },[])
    useEffect(()=>{
        window.addEventListener('resize',onResize);
    return (()=>{
        window.removeEventListener('resize',onResize)
    })   
    },[])
    useEffect(()=>{
        if(limit>0){
            getControlManagementList(1,limit,'')
        }
    },[limit])
    const getControlManagementList=(start,limit,searchWord)=>{
        dispatch({
            type:'controlManagement/getControlManagementList',
            payload:{
                searchWord,
                start,
                limit,
            }
        })
    }
    const onSearch=(value)=>{
        getControlManagementList(1,limit,value)
    }
    const delControlList=(ids)=>{
        if(ids.length){
            confirm({
                title:'确认删除吗？',
                mask:false,
                getContainer:(()=>{
                  return document.getElementById('controlManagement_id')
                }) ,
                onOk:()=>{
                  dispatch({
                    type: "controlManagement/deleteControl",
                    payload: {
                      ids: ids.join(',')
                    }
                  })
                }
              })
        }
        else{
            message.warn('请选择一条数据')
        }
    }
    const getCodeData=(url)=>{
        axios.get(url, {
        })
        .then(function (res) {
          if (res.status == 200) {
              console.log(res.data,'res==');
            dispatch({
              type: 'controlManagement/updateStates',
              payload: {
                ruleData: res.data,
              }
            })
          }
        })
    }
    const addControl=(record)=>{
        console.log(record,'record');
        if(record.id){
            dispatch({
                type:'controlManagement/getDetailControl',
                payload:{
                    id:record.id,
                },
            })
            const url=record.codeUrl
            getCodeData(url)
        }
        dispatch({
            type:'controlManagement/updateStates',
            payload:{
                isShow:true,
                editId:record.id,
                ruleData:CONTROLCODE
            }
        })
    }
    //分页
    const changePage=(nextPage,size)=>{
        dispatch({
            type: "controlManagement/updateStates",
            payload: {
              limit: size,
              currentPage:nextPage
            }
          })
        getControlManagementList(nextPage,size,searchWord)
    }
    const tableProps = {
        rowKey: 'id',
        columns: [
            {
                title: '序号',
                dataIndex: 'number',
                render: (text) => <span>{text}</span>,
                width:ORDER_WIDTH,
            },
            {
                title: '控件名称',
                dataIndex: 'controlName',
                width:BASE_WIDTH,
            },
            {
                title: '调用编码',
                dataIndex: 'controlCode',
                width:BASE_WIDTH
            },
            {
                title: '类型',
                dataIndex: 'controlType',
                width:BASE_WIDTH
            },
            {
                title: '操作',
                dataIndex: 'id',
                width:BASE_WIDTH,
                render:(text,record)=>{
                    return(
                        <div className='table_operation'>
                            <a onClick={()=>{addControl(record)}}>修改</a>
                            <a onClick={()=>{delControlList([text])}}>删除</a>
                        </div>
                    )
                }
            },
        ],
        dataSource: businessControlList.map((item,index)=>{
            item.number=index+1
            return item
        }),
        pagination: false,
        rowSelection: {
            selectedRowKeys:selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                dispatch({
                    type:'controlManagement/updateStates',
                    payload:{
                        selectedRowKeys,
                    }
                })
            }
        }
    }
      
        return(
        <div className = { styles.container } id='controlManagement_id'>
            <div className={styles.header} id='list_head'>
                <div className={styles.search}>
                    <Search placeholder='请输入事件名称' onSearch={onSearch} allowClear
                    enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
                    />
                </div>
                <div className={styles.button}>
                <Button onClick={()=>{addControl('')}}>新增</Button>
                <Button onClick={()=>{delControlList(selectedRowKeys)}}>删除</Button>
                </div>
            </div>
            <div className={styles.table}>
                <ColumnDragTable taskType="MONITOR" modulesName="controlManagement" {...tableProps} scroll={businessControlList.length?{y:'calc(100% - 51px)'}:{}}/>
            </div>
            <IPagination
            current={currentPage}
            total={returnCount}
            onChange={changePage}
            pageSize={limit}
            isRefresh={true}
            refreshDataFn={()=>{getControlManagementList(currentPage,limit,searchWord)}}
          />
            {isShow&&<AddControlModal/>}
        </div >
    )
}
export default connect(({ controlManagement }) => ({
    controlManagement
}))(controlManagement)
