import React,{useState,useCallback,useEffect} from 'react'
import {connect} from 'dva'
import {Table,Button,Input,Space,message,Modal,Spin} from 'antd'
import { dataFormat } from '../../util/util'
import IPagination from '../../componments/public/iPagination';
import SendDetails from './components/sendDetails';
import styles from './index.less'
 function ManageModel({dispatch,manageModel}) {
    const {tableData,selectedRowKeys,returnCount,currentPage,limit,searchWord,isShowDetails,selectedRows}=manageModel
    const [scrollY, setScrollY] = useState(document.documentElement.clientHeight-305);
    const onResize = useCallback(()=>{
      setScrollY(document.documentElement.clientHeight-305);
    },[])
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        getTableData(1,limit,'')
        window.addEventListener('resize',onResize);
        return (()=>{
            window.removeEventListener('resize',onResize)
        })
    },[])
    const getTableData=(start,limit,searchWord)=>{
        dispatch({
            type:'manageModel/getSolmodelList',
            payload:{
                start,
                limit,
                searchWord
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
            type:'manageModel/updateStates',
            payload:{
                searchWord:value
            }
        })
        getTableData(currentPage,limit,value)
     }
     function changePage (page,size) {
        dispatch({
            type: 'manageModel/updateStates',
            payload:{
                limit:size,
                currentPage:page
            }
        })
        getTableData(page,size,searchWord)
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
                dataIndex:'num',
                render:(text,record,index)=><span>{index+1}</span>
            },
            {
                title:'模型名称',
                dataIndex:'solModelName',
                render:(text,record)=><span>{text+'V'+record.version}</span>
            },
            {
                title:'上传时间',
                dataIndex:'createTime',
                render:(text)=><span>{dataFormat(text,'YYYY-MM-DD HH:mm:ss')}</span>
            },
            {
                title:'上传租户名称',
                dataIndex:'tenantName',
            },
            {
                title:'上传账号',
                dataIndex:'createUserLoginName',
            },
            {
                title:'上传用户名',
                dataIndex:'createUserName',
            },
            {
                title:'导入状态',
                dataIndex:'upStatus',
                render:(text,record)=><><span>{text==0?'导入失败':text==1?'进行中':'已完成'}</span>
                <a style={{marginLeft:'8px'}} onClick={downLoad.bind(this,record)}>{record.errorLogPath?'错误日志':''}</a>
                </>
            }

         ],
         dataSource:tableData,
         rowSelection:{
            selectedRowKeys:selectedRowKeys,
            onChange:(selectedRowKeys, selectedRows)=>{
                console.log(selectedRowKeys,'selectedRowKeys');
                dispatch({
                    type:'manageModel/updateStates',
                    payload:{
                        selectedRowKeys:selectedRowKeys,
                        selectedRows:selectedRows
                    }
                })
            },
            // getCheckboxProps: (record) => ({
            //     disabled: record.upStatus !=2,
            //     downStatus: record.upStatus,
            //   }),
        },
        pagination: false,
     }
     //删除模型
     const deleteModel=(ids)=>{
         console.log(ids,'ids');
        if(ids.length<=0){
            message.error('请选择一条数据')
        }else{
            Modal.confirm({
                title: '确认删除吗',
                okText: '删除',
                cancelText: '取消',
                mask:false,
                maskClosable:false,
                getContainer:()=>{
                    return document.getElementById('container_manageModel')
                },
                onOk() {
                    dispatch({
                        type:'manageModel/deleteSolmodel',
                        payload:{
                            solModelIds:ids.join(',')
                        }
                    })
                }
            });
        }
     }
     //下发租户
     const sendTenement=(selectedRows)=>{
        const newFlag= selectedRows.every(item=>item.upStatus==2)
        if(selectedRows.length==1&&newFlag){
            dispatch({
                type:'manageModel/getTenantList',
                payload:{
                    start:1,
                    limit:1000,
                    searchWord:'',
                    // onlyShareOrgTenant:1,
                    // excludeTenantId:''
                },
                callback:(data)=>{
                    data.forEach(item=>{
                        item.ctlgName=''
                        item.ctlgId=''
                    })
                }
            })
            dispatch({
                type:'manageModel/updateStates',
                payload:{
                    isShowDetails:true,
                    isShowButton:'1'
                }
            })
        }else{
            message.error('请选择一个模型下发')
        }
     }
  return (
    <div id='container_manageModel' style={{ height: '100%', background: '#fff', display: 'flex', }}>
        <div className={styles.manageModel}>
            <div className={styles.header}>
            <Input.Search
                    className={styles.search}
                    placeholder={'请输入模型名称'}
                    allowClear
                    onSearch={(value) => { onSearchTable(value) }}
                />
                <Space>
                    <Button onClick={()=>{sendTenement(selectedRows)}}>下发租户</Button>
                    <Button onClick={()=>{deleteModel(selectedRowKeys)}}>删除</Button>
                </Space>
            </div>
            <Spin spinning={loading}>
                <div className={styles.table}>
                    <Table {...tableProps} scroll={{y:scrollY}}/>
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
                        refreshDataFn={()=>{ setLoading(true);getTableData(1,limit,searchWord)}}
                />
                :''
           }
        </div>
        {
            isShowDetails&&<SendDetails/>
        }
    </div>
  )
}
export default connect(({manageModel})=>({manageModel}))(ManageModel)
