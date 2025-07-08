import React,{useEffect} from 'react'
import {connect} from 'dva'
import {Modal,Button} from 'antd'
import ScriptEditor from './scriptEditor'
import GlobalModal from '../../../componments/GlobalModal';
import {CONTROLCODE,DRIVETYPE} from '../../../service/constant'
 function scriptModal({dispatch,controlManagement}) {
    let ChildRef = React.createRef()
     const {isShowScriptEditor,ruleData,detailData}=controlManagement
      useEffect(()=>{
        if(detailData.id){
            ChildRef.current.changeValue(ruleData)
        }
    },[detailData])
     const handleCancel=()=>{
         dispatch({
             type:'controlManagement/updateStates',
             payload:{
                isShowScriptEditor:false
             }
         })
     }
     const onOk=()=>{
         console.log(ruleData,'ruleData');
        dispatch({
            type:'controlManagement/updateStates',
            payload:{
               isShowScriptEditor:false
            }
        })
     }
  return (
    <GlobalModal title='代码编译器'
     visible={true}
     onCancel={handleCancel}
    //  width={800}
     widthType={1}
                // incomingWidth={900}
                // incomingHeight={300}
    //  bodyStyle={{height:'calc(100vh - 300px)'}}
     getContainer={() => {
         return document.getElementById('controlManagement_id')||false
     }}
     mask={false}
     maskClosable={false}
     footer={[<Button type='primary' onClick={()=>{onOk()}}>确定</Button>,
     <Button onClick={handleCancel}>关闭</Button>
    ]}
     >
         <ScriptEditor onRef={ChildRef} readOnly={false} height={'100%'}/>
    </GlobalModal>
  )
}
export default connect(({controlManagement})=>({controlManagement}))(scriptModal)

