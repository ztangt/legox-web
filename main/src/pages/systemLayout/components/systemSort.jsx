import React,{useState} from 'react'
import {connect} from 'dva'
import {Modal,Form,Input,Button,Table,message} from 'antd'
import GlobalModal from '../../../componments/GlobalModal'
import ColumnDragTable from '../../../componments/columnDragTable'
 function systemSort({dispatch,systemLayout}) {
     const {businessList}=systemLayout
     const [newData,setNewData]=useState([])
     const onCancel=()=>{
         dispatch({
             type:'systemLayout/updateStates',
             payload:{
                isSort:false
             }
         })
     }
     const changeValue=(e,record)=>{
        // console.log(record,'record');
        // var reg = /^\d{1,9}$|^\d{1,9}[.]\d{1,6}$/;
        //   if(!reg.test(e.target.value)){
        //    return message.error('最大支持9位整数，6位小数')
        //   }
        //   else{
            const arr=[]
            businessList.forEach((item,index)=>{
                if(item.id==record.id){
                    item.sort=e.target.value
                    let obj = {
                        sort:item.sort,
                        registerId:item.id
                      }
                      arr.push(obj)
                }
            })
            setNewData(arr)
        //   }
     }
     //保存
     const onSave=()=>{
        var reg = /^\d{1,9}$|^\d{1,9}[.]\d{1,6}$/;
        const flag= newData.every(item=>reg.test(item.sort))
        if(!flag){
          message.error('最大支持9位整数，6位小数')
        }else{
            if(newData.length>0){
                dispatch({
                    type:'systemLayout/sortSystemList',
                    payload:{
                        sortInfo:JSON.stringify(newData)
                    }
                })
             }
            onCancel()
        }    
     }
     const tableProps={
         columns:[
             {
                 title:'序号',
                 width:60,
                 render:(text,record,index)=><span>{index+1}</span>
             },
             {
                title:'系统名称',
                // width:200,
                dataIndex:'registerName',
            },
            {
                title:'排序',
                // width:200,
                dataIndex:'sort',
                render:(text,record,index)=><Input defaultValue={text} onChange={(e)=>{changeValue(e,record)}} style={{width:200}}/>
            },
         ],
         dataSource:businessList,
         pagination:false
     }
  return (
    <div>
        <GlobalModal
            title={'排序'}
            visible={true}
            widthType={1}
            onCancel={onCancel}
            maskClosable={false}
            mask={false}
            getContainer={() =>{
                return document.getElementById('systemLayout_container')||false
            }}
            footer={[
            <Button key="cancel" onClick={onCancel}>取消</Button>,
            <Button key="submit" type="primary"  htmlType={"submit"} onClick={onSave}>
                保存
            </Button>,
            ]}
        >
            <ColumnDragTable taskType = 'MONITOR' {...tableProps}/> 
        </GlobalModal>
    </div>
  )
}
export default connect(({systemLayout})=>({systemLayout}))(systemSort)
