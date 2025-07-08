import React,{useEffect,useState} from 'react'
import {connect} from 'dva'
import {Modal,Button} from 'antd'
import GlobalModal from '../../../componments/GlobalModal';
import Table from '../../../componments/columnDragTable';
import { dataFormat} from '../../../util/util';
import { ORDER_WIDTH, BASE_WIDTH } from '../../../util/constant'
import IPagination from '../../../componments/public/iPagination';
 function PublishRecordModal({dispatch,applyPublish,releasRecord}) {
     const {recordList,recordCount}=applyPublish
     const [current,setCurrent]=useState(1)
     const [limit,setLimit]=useState(10)

     useEffect(()=>{
         dispatch({
             type:'applyPublish/getPublishRecordList',
             payload:{
                start:1,
                limit:10,
                menuId:releasRecord.id
            }
         })
     },[])
     const handelCanel=()=>{
        dispatch({
            type:'applyPublish/updateStates',
            payload:{
                isShowPublishRecord:false
            }
        })
     }
     function downLoad(record){
        if(record.errorLogPath){
            window.location.href=record.errorLogPath
        }
    }
     const tableProps={
        scroll:{y:'calc(100% - 45px)'},
         columns:[
             {
                 title:'序号',
                 render:(text,record,index)=><span>{index+1}</span>,
                 width:ORDER_WIDTH,
             },
             {
                title:'模块资源名称',
                dataIndex:'menuName',
                width:BASE_WIDTH,
            },
            {
                title:'能力名称',
                dataIndex:'abilityName',
                width:BASE_WIDTH,
            },
            {
                title:'发布时间',
                dataIndex:'createTime',
                width:BASE_WIDTH,
                render: (text) => {
                    return dataFormat(text, 'YYYY-MM-DD HH:mm:ss');
                  }
            },
            {
                title:'发布状态',
                dataIndex:'fileStatus',
                width:BASE_WIDTH,
                render:(text,record,index)=><span>{text==0?'失败':text==1?'进行中':text==2?'已完成':''}{text==0&&<Button onClick={downLoad.bind(this,record)} style={{marginLeft:8}}>下载</Button>}</span>
            },
         ],
         dataSource:recordList,
         pagination:false
     }
     const changePage=(nextPage, size)=>{
         setCurrent(nextPage)
         setLimit(size)
         dispatch({
            type:'applyPublish/getPublishRecordList',
            payload:{
               start:nextPage,
               limit:size,
               menuId:releasRecord.id
           }
        })
     }
  return (
      <GlobalModal
        visible={true}
        widthType={2}
        title={'发布记录'}
        onCancel={handelCanel}
        maskClosable={false}
        mask={false}
        centered
        getContainer={() => {
            return document.getElementById('apply_container') || false
        }}
        bodyStyle={{ padding: '0 8px' }}
        footer={[
            <Button key="cancel" onClick={handelCanel}>关闭</Button>,
        ]}
      >
          <div style={{height:'calc(100% - 50px)'}}>
          <Table {...tableProps}/>
          </div>
          <IPagination
          style={{position:'absolute',bottom:55}}
          current={current}
          total={recordCount}
          onChange={changePage}
          pageSize={limit}
          isRefresh={true}
          refreshDataFn={
            ()=>{
                setCurrent(1)
                dispatch({
                    type:'applyPublish/getPublishRecordList',
                    payload:{
                       start:1,
                       limit:limit,
                       menuId:releasRecord.id
                   }
                })
            }
          }
      />
      </GlobalModal>
  )
}
export default connect(({applyPublish})=>({applyPublish}))(PublishRecordModal)
