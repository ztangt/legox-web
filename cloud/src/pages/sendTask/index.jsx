import React,{useCallback,useState,useEffect} from 'react'
import {connect} from 'dva'
import {Space,Button,Table,Input,message,Spin} from 'antd'
import IPagination from '../../componments/public/iPagination';
import {history} from "umi";
import { dataFormat } from '../../util/util'
import styles from './index.less'
 function SendTask({dispatch,sendTask}) {
    const {tableData,returnCount,currentPage,limit,searchWord,selectedRowKeys,solModelId}=sendTask
    const [scrollY, setScrollY] = useState(document.documentElement.clientHeight-305);
    const [loading, setLoading] = useState(false);
    const onResize = useCallback(()=>{
      setScrollY(document.documentElement.clientHeight-305);
    },[])
    useEffect(()=>{
        getTableList(1,10,'',solModelId)
        window.addEventListener('resize',onResize);
        return (()=>{
            window.removeEventListener('resize',onResize)
        })
    },[])
    const getTableList=(start,limit,searchWord,solModelId)=>{
        dispatch({
            type:'sendTask/getSolmodelDetails',
            payload:{
                start,
                limit,
                searchWord,
                solModelIds:solModelId
            },
            callback:()=>{
                setTimeout(()=>{
                    setLoading(false)
                },200) 
            }
        })
    }
    const onSearchTable=(value)=>{
        dispatch({
            type:'sendTask/updateStates',
            payload:{
                searchWord:value
            }
        })
        getTableList(currentPage,limit,value,solModelId)
     }
     const gotoConfig=(record)=>{
        if(record.fileStatus==3){
            var index = record.solModelName.indexOf("V")
            var bizSolName = record.solModelName.substring(0, index);
            window.open(`#/cloud/applyConfig?bizSolId=${record.bizSolId}&bizSolName=${bizSolName}&ctlgId=${record.ctlgId}&bizSolCode=${record.bizSolCode}&tenantId=${record.tenantId}`)
            // history.push({
            //     pathname: '/applyConfig',
            //     query: {
            //       bizSolId: record.bizSolId,
            //       bizSolName:bizSolName,
            //       ctlgId: record.ctlgId,
            //       bizSolCode:record.bizSolCode,
            //       tenantId: record.tenantId
            //     },
            //   });
         }
     }
     function downLoad(record){
        if(record.errorLogPath){
            window.location.href=record.errorLogPath
        }
    }
     const tableProps={
         rowKey:'solModelId',
         columns:[
             {
                 title:'序号',
                 dataIndex:'index',
                 render:(text,record,index)=><span>{index+1}</span>
             },
             {
                title:'模型名称',
                dataIndex:'solModelName'
            },
            {
                title:'租户名称',
                dataIndex:'tenantName'
            },
            {
                title:'下发时间',
                dataIndex:'createTime',
                render:(text)=><span>{dataFormat(text,'YYYY-MM-DD HH:mm:ss')}</span>
            },
            {
                title:'第一步(应用类别)',
                dataIndex:'ctlgName'
            },
            {
                title:'第二步(导入数据)',
                dataIndex:'downStatus',
                render:(text)=><span className={text==0?styles.red:text==1?styles.gray:text==2?'':styles.green}>{text==0?'导入失败':text==1?'队列中':text==2?'进行中':'已完成'}</span>
            },
            {
                title:'第三步(配置补充)',
                dataIndex:'ctlgId',
                render:(text,record)=><span><a className={record.fileStatus==3?styles.success:styles.error} disabled={record.fileStatus==3?false:true} onClick={()=>{gotoConfig(record)}}>配置 </a>
                <a style={{marginLeft:'8px'}} onClick={downLoad.bind(this,record)}>{record.errorLogPath?'错误日志':''}</a>
                </span>
            },
         ],
         dataSource:tableData,
         pagination:false,
         rowSelection:{
            selectedRowKeys:selectedRowKeys,
            onChange:(selectedRowKeys, selectedRows)=>{
                dispatch({
                    type:'sendTask/updateStates',
                    payload:{
                        selectedRowKeys:selectedRowKeys,
                    }
                })
            },
            getCheckboxProps: (record) => ({
                disabled: record.downStatus != 0,
                // Column configuration not to be checked
                downStatus: record.downStatus,
              }),
        },
     }
     function changePage (page,size) {
        dispatch({
            type: 'sendTask/updateStates',
            payload:{
                limit:size,
                currentPage:page
            }
        })
        getTableList(page,size,searchWord,solModelId)
    }
    //导入
    const leadIn=()=>{
        if(selectedRowKeys.length==1){
        }else{
            message.error('请选择一条模型')
        }
    }
  return (
    <div id='sendTask_container' style={{ height: '100%', background: '#fff', display: 'flex', }}>
        <div className={styles.sendTask}>
            <div className={styles.header}>
                <Input.Search
                    className={styles.search}
                    placeholder={'请输入模型名称'}
                    allowClear
                    onSearch={(value) => { onSearchTable(value) }}
                    />
                <Space>
                    <Button onClick={()=>{leadIn()}}>导入</Button>
                </Space>
            </div>
            <Spin spinning={loading}>
            <div className={styles.table}>
                <Table {...tableProps} scroll={{y:scrollY}}  rowKey={(record) => {
                 return (record.solModelId+record.key)
               }}/>
            </div>
            </Spin>
            {
                tableData.length>0?
                    <IPagination
                        total={returnCount}
                        current={Number(currentPage)}
                        pageSize={limit}
                        onChange={changePage.bind(this)}
                        isRefresh={true}
                        refreshDataFn={()=>{setLoading(true);getTableList(1,limit,searchWord,solModelId)}}
                />
                :''
           }
        </div>
    </div>
  )
}
export default connect(({sendTask})=>({sendTask}))(SendTask)
