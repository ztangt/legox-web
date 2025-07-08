import React,{useState} from 'react'
import {connect} from 'dva'
import GlobalModal from '../../../componments/GlobalModal';
import Table from '../../../componments/columnDragTable';
import {Input,Button,message} from 'antd'
 function AbilitySortModal({dispatch,applyPublish}) {
     const {isShowAbilityModal,abilityList}=applyPublish
     const [sortArr,setSortArr]=useState([])
     const handelCanel=()=>{
         dispatch({
             type:'applyPublish/updateStates',
             payload:{
                isShowAbilityModal:false
             }
         })
     }
     const changSortValue=(record,e)=>{
      const obj={
          sort:e.target.value,
          abilityId:record.id
      }
      const index=sortArr.findIndex(item=>item.id==record.id)
      if(index<0){
          sortArr.push(obj)
      }else{
          sortArr[index].sort=e.target.value
      }
      setSortArr(sortArr)
  }
  const saveSort=()=>{
    var reg = /^\d{1,9}$|^\d{1,9}[.]\d{1,6}$/;
    console.log(sortArr,'sortArr');
    const flag= sortArr.every(item=>reg.test(item.sort))
    if(!flag){
     message.error('最大支持9位整数，6位小数')
    }else{
        dispatch({
            type:'applyPublish/updateAbilitySort',
            payload:{
                json:JSON.stringify(sortArr)
            }
        })
        handelCanel()
    }
}
     const tableProps={
       columns:[
         {
          title:'序号',
          render:(text,record,index)=><span>{index+1}</span>
         },
         {
           title:'能力名称',
           dataIndex:'abilityName',
         },
         {
           title:'排序',
           dataIndex:'sort',
           render:(text,record)=><Input onBlur={changSortValue.bind(this,record)} defaultValue={text}/>
         }
       ],
       pagination:false,
       dataSource:abilityList,
       scroll:{y:'calc(100% - 45px)'}
     }
  return (
    <div>
      <GlobalModal
      visible={true}
      widthType={2}
      title={'能力排序'}
      onCancel={handelCanel}
      maskClosable={false}
      mask={false}
      centered
      getContainer={() => {
        return document.getElementById('apply_container') || false
      }}
      bodyStyle={{ padding: '0 8px' }}
      footer={[
        <Button key="cancel" onClick={handelCanel}>取消</Button>,
        <Button key="submit" type="primary" onClick={saveSort} >
          保存
        </Button>
      ]}
      >
        <div style={{height:'100%'}}>
          <Table {...tableProps}/>
        </div>
      </GlobalModal>
    </div>
  )
}
export default connect(({applyPublish})=>({applyPublish}))(AbilitySortModal)

