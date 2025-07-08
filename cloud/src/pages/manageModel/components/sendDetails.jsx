import React from 'react'
import {connect} from 'dva'
import {Modal,Table,Button,TreeSelect,message,Select,Input} from 'antd'
import {history} from 'umi'
import AddLinkDataSource from './addLinkDataSource'
import {PlusOutlined} from '@ant-design/icons';
import TenantDataTable from './tenantDataTable'
 function sendDetails({dispatch,manageModel}) {
     const {tenantList,selectedDeatailRowKeys,isShowButton,selectedRowKeys,ctlgTree,selectedRows,isAddLinkDataSource,dataOrigin,tenantDetailList}=manageModel
     const onCancel=()=>{
        dispatch({
            type:'manageModel/updateStates',
            payload:{
                isShowDetails:false,
                selectedDeatailRowKeys:[],
                isShowButton:'',
                selectedRowKeys:[],
                selectedRows:[],
                tenantDetailList:[],
                tenantList:[]
            }
        })
     }
      //格式话节点数据
        const ctlgTreeFn=(tree)=>{
            tree.map((item)=>{
            item.value=item.nodeId;
            item.title=item.nodeName;
            if(item.children){
                ctlgTreeFn(item.children)
            }
        })
    return tree;
  }
  const onSelect=(index,value,node)=>{
      tenantList[index].ctlgName=node.nodeName
      tenantList[index].ctlgId=node.nodeId
      dispatch({
          type:'manageModel/updateStates',
          payload:{
            tenantList
          }
      })
  }
  const onClickCtlg=(record)=>{
    console.log(record,'record');
    dispatch({
        type: 'manageModel/getCtlgTree',
        payload: {
            hasPermission: '0',
            type: 'ALL',
            searchWord: '',
            tenantId:record.id
        }
    })
  }
  const getDataSource=(record)=>{
      console.log(record,'record==');
    dispatch({
        type: 'manageModel/getDatasourceTree',
        payload: {
            tenantId:record.id
        }
    })
    dispatch({
        type:'manageModel/updateStates',
        payload:{
            id:record.id
        }
    })
  }
  //新增数据源
  const changeDataSource=(index,value,option)=>{
      tenantList[index].dsDynamic=value
      tenantList[index].dsName=option?.name
      tenantList[index].dsId=option?.id
    //   if(value=='add'){
    //     dispatch({
    //         type:'manageModel/updateStates',
    //         payload:{
    //             isAddLinkDataSource:true
    //         }
    //     })
    //   }
  }
  const addDataSource=(record)=>{
    dispatch({
        type:'manageModel/updateStates',
        payload:{
            isAddLinkDataSource:true,
            id:record.id
        }
    })
  }
     const tablesProps={
         scroll:isShowButton=='2'?{y:'calc(100% - 60px)',x:1000}:{y:'calc(100% - 60px)'},
         rowKey:'id',
         columns:isShowButton=='2'?
         [
            {
                title:'序号',
                dataIndex:'num',
                width:60,
                render:(text,record,index)=><span>{index+1}</span>
            },
            {
                title:'租户名称',
                dataIndex:'tenantName',
            },
            {
                title:'下发数据源名称',
                dataIndex:'dsDynamic',
                render:(text,record,index)=>{
                    return <><Select style={{ width: '200px' }} defaultValue={text}  onChange={changeDataSource.bind(this,index)} onClick={()=>{getDataSource(record)}}>
                        {
                            dataOrigin.map((item,index)=>{
                                return <Option value={item.dsDynamic} name={item.dsName} id={item.dsId}>{item.dsName}</Option>
                            })
                        }
                        {/* <Option value='add'>新增</Option> */}
                    </Select> <span style={{marginLeft:'8px'}} onClick={()=>{addDataSource(record)}}><PlusOutlined /></span></>
                }
            },
            {
                title:'第一步(应用类别)',
                dataIndex:'ctlgId',
                render:(text,record,index)=> <TreeSelect
                        style={{ width: '200px' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' ,minWidth:200}}
                        treeData={ctlgTreeFn(ctlgTree)}
                        onSelect={onSelect.bind(this,index)}
                        onClick={()=>{onClickCtlg(record)}}
                        placeholder="请选择"
                        treeDefaultExpandAll
                        value={record.ctlgName}
                        dropdownMatchSelectWidth={false}/>    
            },
         ]
         :[
            {
                title:'序号',
                dataIndex:'num',
                render:(text,record,index)=><span>{index+1}</span>
            },
            {
                title:'租户名称',
                dataIndex:'tenantName',
            },
            {
                title:'租户账号',
                dataIndex:'tenantCode',
            },
         ],
         dataSource:tenantList,
         pagination:false,
         rowSelection:isShowButton=='2'?'':{
            selectedRowKeys:selectedDeatailRowKeys,
            onChange:(selectedRowKeys, selectedRows)=>{
                dispatch({
                    type:'manageModel/updateStates',
                    payload:{
                        selectedDeatailRowKeys:selectedRowKeys,
                    }
                })
            }
         }
         
     }
     //下一步
     const nextWork=()=>{
         if(selectedDeatailRowKeys.length>0){
            dispatch({
                type:'manageModel/updateStates',
                payload:{
                    isShowButton:'2',
                    tenantList:tenantList.filter(v => selectedDeatailRowKeys.some(val => val === v.id))
                }
            })
         }else{
             message.error('请选择租户')
         }
     }
     //上一步
     const lastStep= async()=>{
         const newData=[...tenantList]
       await dispatch({
            type:'manageModel/updateStates',
            payload:{
                isShowButton:'1',
                selectedDeatailRowKeys:tenantList.map(item=>item.id)
            }
        })
       await dispatch({
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
                        newData.forEach(val=>{
                            if(item.id==val.id){
                                item.ctlgName=val.ctlgName
                                item.ctlgId=val.ctlgId
                                item.dsDynamic=val.dsDynamic
                                item.dsName=val.dsName
                                item.dsId=val.dsId
                            }
                        })
                    })
                }
            })
     }
     //第三步
     const finalStep=()=>{
        const flag=tenantList.every(item=>item.ctlgId!=='')
        if(!flag){
            return message.error('请选择应用类别')
        }
        dispatch({
            type:'manageModel/updateStates',
            payload:{
                isShowButton:'3',
                // tenantDetailList:newData
            }
        })
        //切换数据源清空配置
        const compareIds = (item1, item2) => item1.dsDynamic === item2.dsDynamic; 
        const idsEqual = tenantList.length === tenantDetailList.length && tenantList.every((item, index) => compareIds(item, tenantDetailList[index]));
        if(!idsEqual){
            const newData=_.cloneDeep(tenantList)
            newData.forEach(item=>item.isExpand=1)
            dispatch({
                type:'manageModel/updateStates',
                payload:{
                    // isShowButton:'3',
                    tenantDetailList:newData
                }
            })
            dispatch({
                type: 'manageModel/getSolmodelTableData',
                payload: {
                    filePath: selectedRows[0].filePath
                }
            })
            const res = tenantList.map((item) => ({ tenantId: item.id, dsDynamic: item.dsDynamic }))
            dispatch({
                type: 'manageModel/getTenantDatasource',
                payload: {
                    tenantJson: JSON.stringify(res)
                }
            })
        }
     }
     //第二步
     const secondStep=()=>{
        dispatch({
            type:'manageModel/updateStates',
            payload:{
                isShowButton:'2',
            }
        })
     }
     const sendWork=()=>{
         let mergeArr=[]
         tenantDetailList.forEach((item,index)=>{
            mergeArr=[...mergeArr,...item.children]
                item.children=item.children.map(val=>({sourceCode:val.tableCode,targetId:val.tableSourceId,targetCode:val.tableCode_detail,targetName:val.tableName_detail}))
         })
        //  const tableData=mergeArr.map(item=>({sourceCode:item.tableCode,targetId:item.tableSourceId,targetCode:item.tableCode_detail,targetName:item.tableName_detail}))

         dispatch({
             type:'sendTask/updateStates',
             payload:{
                solModelId:selectedRowKeys.join(',')
             }
         })
         console.log(mergeArr,'mergeArr');
         if(mergeArr.every(item=>item.tableFlag=='Y')){
            const newData=[]
            tenantList.forEach(item=>{
                newData.push({tenantId:item.id,ctlgId:item.ctlgId,dsDynamic:item.dsDynamic})
            })
            console.log(tenantDetailList,'tenantDetailList');
            tenantDetailList.forEach(item=>{
                newData.forEach(val=>{
                    if(val.tenantId==item.id){
                        val.tableData=item.children
                    }
                })
            })
            console.log(newData,'newData');
             const newArr=[]
             selectedRows.forEach((item,index)=>{
                 newArr.push({
                    bizSolId: item.bizSolId,
                    solModelId: item.solModelId,
                    solModelName: item.solModelName+'V'+item.version,
                    filePath:item.filePath,
                 })
             })
             dispatch({
                 type:'manageModel/sendSolmodel',
                 payload:{
                    tenantCtlgJson:JSON.stringify(newData),
                    bizSolModelJson:JSON.stringify(newArr),
                 }
             })
            history.push('/sendTask')
            onCancel()
         }else{
             message.error('校验未通过，不可下发')
         }
     }
     //搜索租户
     const onSearch=(value)=>{
        dispatch({
            type:'manageModel/getTenantList',
            payload:{
                start:1,
                limit:1000,
                searchWord:value,
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
     }
  return (
    <div>
        <Modal
        title='应用下发详情'
        visible={true}
        width={850}
        onCancel={onCancel}
        mask={false}
        maskClosable={false}
        bodyStyle={{height:400,overflow:'auto'}}
        getContainer={()=>{
            return document.getElementById('container_manageModel')
        }}
        footer={
            [
                isShowButton=='1'?<Button onClick={nextWork.bind(this)}>下一步</Button>:isShowButton=='2'?<><Button onClick={lastStep.bind(this)}>上一步</Button><Button onClick={finalStep.bind(this)}>下一步</Button><Button onClick={onCancel}>关闭</Button> </>:isShowButton=='3'?<><Button onClick={secondStep.bind()}>上一步</Button><Button onClick={sendWork.bind(this)}>下发</Button></>:''
            ]
        }
        >
            {isShowButton=='1'&&<Input.Search placeholder='请输入租户名称/租户账号' style={{width:200,marginBottom:16}} allowClear onSearch={onSearch}/>}
            <div style={isShowButton=='1'?{height:'calc(100% - 48px)'}:{height:'100%'}}>
                {isShowButton!=='3'&&<Table {...tablesProps}/>}
                {isShowButton=='3'&&<TenantDataTable/>}
            </div>
        </Modal>
        {
            isAddLinkDataSource&&<AddLinkDataSource isAddLinkDataSource={isAddLinkDataSource}/>
        }
    </div>
  )
}
export default connect(({manageModel})=>({manageModel}))(sendDetails)
