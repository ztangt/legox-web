import React,{useEffect,useState,useCallback} from 'react'
import { connect } from 'dva'
import {Input,Table,Button,message,Modal} from 'antd'
import _ from 'lodash'
import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import IPagination from '../../../componments/public/iPagination'
import AddSysAccessModal from './addSysAccessModal';
import styles from '../index.less'
import ColumnDragTable from '../../../componments/columnDragTable';
import {BASE_WIDTH,ORDER_WIDTH} from '../../../util/constant'
import searchIcon from '../../../../public/assets/search_black.svg'
const { Search } = Input
const {confirm}=Modal
function systemAccess({dispatch,systemAccess}) {
    const {allPage,currentPage,returnCount,list,selectedRowKeys,limit,searchWord,detailData,isShow}=systemAccess
    var viewDetailsModalRef; //查看Modalref
    const [height,setHeight] = useState(document.documentElement.clientHeight-305)
    const onResize = useCallback(()=>{
    setHeight(document.documentElement.clientHeight-305)
    },[])
    useEffect(()=>{
        if(limit>0){
            getSystemAccessList(1,limit,'')
        }
    },[limit])
    const tableProps = {
        scroll:{y:'calc(100% - 90px)'},
        rowKey: 'id',
        columns: [
            {
                title: '序号',
                dataIndex: 'number',
                render: (text) => <span>{text}</span>,
                width:ORDER_WIDTH,
            },
            {
                title: '系统名称',
                dataIndex: 'appName',
                render:(text,record)=><a style={{cursor:'pointer'}} onClick={()=>{showDetail(record)}}>{text}</a>,
                width:BASE_WIDTH,
            },
            {
                title: '服务商',
                dataIndex: 'provider',
                width:BASE_WIDTH,
            },
            {
                title: '所在行业',
                dataIndex: 'industry',
                width:BASE_WIDTH,
            },
            {
                title: '备注',
                dataIndex: 'remark',
                width:BASE_WIDTH,
            },
            {
                title: '操作',
                dataIndex: 'id',
                width:BASE_WIDTH,
                render:(text,record)=>{
                    return(
                        <div className='table_operation'>
                            <a onClick={()=>{addSysModal(record)}}>修改</a>
                            <a onClick={()=>{delSysAccessItem(text)}}>删除</a>
                        </div>
                    )
                }
            },
        ],
        dataSource: list.map((item,index)=>{
            item.number=index+1
            return item
        }),
        pagination: false,
        rowSelection: {
            selectedRowKeys:selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                dispatch({
                    type:'systemAccess/updateStates',
                    payload:{
                        selectedRowKeys,
                    }
                })
            }
        }
    }
    useEffect(()=>{
        window.addEventListener('resize',onResize);
        return (()=>{
            window.removeEventListener('resize',onResize)
        })
    },[])
    const getSystemAccessList=(start,limit,searchWord)=>{
        dispatch({
            type:'systemAccess/getSystemAccessList',
            payload:{
                limit,
                start,
                searchWord,
            }
        })
    }
    const onSearch = (value) => {
        console.log(value,'value');
        dispatch({
            type: "systemAccess/updateStates",
            payload: {
              searchWord: value
            }
          })
          getSystemAccessList(1,limit,value)
    }
    const changePage = (nextPage, size) => {
        dispatch({
          type: "systemAccess/updateStates",
          payload: {
            limit: size
          }
        })
        getSystemAccessList(nextPage,limit,searchWord)
      }
      //删除
    const delSysAccessItem=(id)=>{
        confirm({
            title:'确认删除吗？',
            mask:false,
            getContainer:(()=>{
                return document.getElementById('systemAccess_id')
            }) ,
            onOk:()=>{
                dispatch({
                    type:'systemAccess/deleteSystemAccess',
                    payload:{
                        id:id
                    }
                })
            }
        })
           
    }
    //删除多条
    const delSysAccess=(ids)=>{
        if(ids.length){
            confirm({
                title:'确认删除吗？',
                mask:false,
                getContainer:(()=>{
                    return document.getElementById('systemAccess_id')
                }) ,
                onOk:()=>{
                    dispatch({
                        type:'systemAccess/deleteSysIds',
                        payload:{
                            ids:ids.join(',')
                        }
                    })
                }
            
            })
        }else{
            message.warning('请选择一条数据')
        }
    }
    //查看
    const showDetail=(record)=>{
        dispatch({
            type:'systemAccess/getDatailSystem',
            payload:{
                id:record.id
            }
        })
        viewDetailsModalRef.show([
            { key: '系统名称', value: record.appName },
            { key: '服务商', value: record.provider },
            { key: 'ADDID', value: record.appId},
            { key: 'APPKEY', value: record.appKey},
            { key: 'APP_URL', value: record.appUrl},
            { key: '所在行业', value: record.industry},
            { key: '公司规模', value: record.scale},
            { key: '备注', value: record.remark, type: 3 },
          ]);
    }
    //新增修改
    const addSysModal=(record)=>{
        if(record.id){
            dispatch({
                type:'systemAccess/getDatailSystem',
                payload:{
                    id:record.id
                }
            })
        }
        dispatch({
            type:'systemAccess/updateStates',
            payload:{
                isShow:true
            }
        })
    }
    return (
        <div className={styles.container} id='systemAccess_id'>
            <div className={styles.header} id='list_head'>
                <div className={styles.search}>
                    <Search placeholder='请输入系统名称' onSearch={onSearch} allowClear
                     enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
                     />
                </div>
                <div className={styles.button}>
                    <Button onClick={()=>{addSysModal('')}}>新增</Button>
                    <Button onClick={()=>{delSysAccess(selectedRowKeys)}}>删除</Button>
                </div>
            </div>
            <div className={styles.table}>
                <ColumnDragTable taskType="MONITOR" modulesName="systemAccess"  {...tableProps} />
            </div>
            <IPagination 
                current={currentPage} total={returnCount} onChange={changePage} pageSize={limit}
                />
                <ViewDetailsModal 
                title='查看系统信息'
                containerId='systemAccess_container'
                ref={
                    ref=>{
                        viewDetailsModalRef=ref
                    }
                }
                >
                     
                </ViewDetailsModal>
                {isShow&&<AddSysAccessModal/>}
        </div >
    )
}
export default connect(({ systemAccess }) => ({ systemAccess }))(systemAccess)
