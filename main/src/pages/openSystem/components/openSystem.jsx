import React,{useEffect,useState,useCallback} from 'react'
import {connect} from 'dva'
import {Table,Button,Input,message,Modal} from 'antd'
import IPagination from '../../../componments/public/iPagination'
import AddOpenSystemModal from './addOpenSystemModal'
import ViewDetailsModal from '../../../componments/public/viewDetailsModal';
import styles from '../index.less'
import ColumnDragTable from '../../../componments/columnDragTable'
import {BASE_WIDTH,ORDER_WIDTH} from '../../../util/constant'
import searchIcon from '../../../../public/assets/search_black.svg'
 function openSystem({dispatch,openSystem}) {
     const {Search}=Input
     const {confirm}=Modal
     const {list,currentPage,returnCount,limit,selectedRowKeys,searchWord,isShow,detailData}=openSystem
     const [height,setHeight] = useState(document.documentElement.clientHeight-305)
     const onResize = useCallback(()=>{
    setHeight(document.documentElement.clientHeight-305)
    },[])
     var viewDetailsModalRef; //查看Modalref
     useEffect(()=>{
        window.addEventListener('resize',onResize);
      return (()=>{
          window.removeEventListener('resize',onResize)
      })
     },[])
     useEffect(()=>{
         if(limit>0){
            getOpenSystemList(1,limit,'')
         }
     },[limit])
     //列表
     const getOpenSystemList=(start,limit,searchWord)=>{
         dispatch({
             type:'openSystem/getOpenSystemList',
             payload:{
                 start,
                 limit,
                 searchWord,
             }

         })
     }
     const onSearch=(value)=>{
        dispatch({
            type:'openSystem/updateStates',
            payload:{
                searchWord:value
            }
        })
        getOpenSystemList(1,limit,value)
     }
     const changePage = (nextPage, size) => {
        dispatch({
          type: "openSystem/updateStates",
          payload: {
            limit: size
          }
        })
        getOpenSystemList(nextPage,limit,searchWord)
      }
      //删除
    const deleteOpenSystemItem=(id)=>{
        confirm({
            title:'确认删除吗？',
            mask:false,
            getContainer:(()=>{
                return document.getElementById('openSystem_id')
            }) ,
            onOk:()=>{
                dispatch({
                    type:'openSystem/deleteOpenSystem',
                    payload:{
                        clientId:id
                    }
                })
            }
            })
    }
    //批量删除
    const deleteOpenSystem=(ids)=>{
        if(ids.length){
            confirm({
                title:'确认删除吗？',
                mask:false,
                getContainer:(()=>{
                    return document.getElementById('openSystem_id')
                }) ,
                onOk:()=>{
                    dispatch({
                        type:'openSystem/deleteOpenSysIds',
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
    
      //新增修改
      const addOpenSystem=(record)=>{
          console.log(record,'record');
          if(record.id){
              dispatch({
                  type:'openSystem/getDetailOpenSystem',
                  payload:{
                    clientId:record.id
                  }
              })
          }
        dispatch({
            type:'openSystem/updateStates',
            payload:{
                isShow:true
            }
        })
      }
      //查看
      const showDetail=(record)=>{
        dispatch({
            type:'openSystem/getDetailOpenSystem',
            payload:{
              clientId:record.id
            }
        })
        viewDetailsModalRef.show([
            { key: '系统名称', value: record.clientName },
            { key: '服务商', value: record.provider },
            { key: '系统KEY', value: record.clientKey},
            { key: '系统秘钥', value: record.clientSecret},
            { key: '回调地址', value: record.webServerRedirectUri},
            { key: '授权方式', value: record.authorizedGrantTypes},
            { key: '授权时效', value: record.accessTokenValidity},
            { key: '所在行业', value: record.industry},
            { key: '公司规模', value: record.scale},
            { key: '备注', value: record.remark, type: 3 },
          ]);
      }
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
                dataIndex: 'clientName',
                render:(text,record)=><a onClick={()=>{showDetail(record)}} style={{cursor:'pointer'}} >{text}</a>,
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
                            <a onClick={()=>{addOpenSystem(record)}}>修改</a>
                            <a onClick={()=>{deleteOpenSystemItem(text)}}>删除</a>
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
                    type:'openSystem/updateStates',
                    payload:{
                        selectedRowKeys,
                    }
                })
            }
        }
    }
  return (
    <div className={styles.container} id='openSystem_id'>
            <div className={styles.header} id='list_head'>
                <div className={styles.search}>
                    <Search placeholder='请输入系统名称' onSearch={onSearch} allowClear
                     enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
                    />
                </div>
                <div className={styles.button}>
                    <Button onClick={()=>{addOpenSystem('')}}>新增</Button>
                    <Button onClick={()=>{deleteOpenSystem(selectedRowKeys)}}>删除</Button>
                </div>
            </div>
            <div className={styles.table}>
                <ColumnDragTable taskType="MONITOR" modulesName="openSystem" {...tableProps}/>
            </div>
            <IPagination 
                current={currentPage} total={returnCount} onChange={changePage} pageSize={limit}
                />
               {isShow&&<AddOpenSystemModal/>}
               <ViewDetailsModal
               title='查看系统信息'
               containerId='openSystem_container'
               ref={ref=>{viewDetailsModalRef=ref}}
               />
        </div >
  )
}
export default connect(({openSystem})=>({openSystem}))(openSystem)
