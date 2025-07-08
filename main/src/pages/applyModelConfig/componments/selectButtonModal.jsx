import { connect } from 'dva';
import React, { useState,useEffect } from 'react';
import { Modal,Button,Tree,Checkbox, message, Radio} from 'antd';
import {  BUTTONTYPES } from '../../../service/constant'
import { parse } from 'query-string';
import { history } from 'umi'
 function SelectButtonModal({query,dispatch,loading,eventId,selectedNodes,eventIndex,
  parentState,setParentState}) {
    const {bizSolId} = query;
    const { procDefId, bizFromInfo, bizEventList, procDefTreeList ,bizSolInfo,buttonList,buttonTree,checkedKey} = parentState;
    const [subjects, setNodes] = useState(selectedNodes||[]);
    useEffect(()=>{
        dispatch({
            type:"applyModelConfig/getButtonIds",
            payload:{
              buttonGroupId:bizFromInfo.buttonGroupId
            },
            callback:(buttonList)=>{
                buttonList.forEach(item=>item.key=item.buttonId)
                const buttonTree=[{
                  buttonName:'表单按钮',
                  key:'1',
                  children:buttonList?.filter(item=>item.operationType=='HANDLE'),
                }]
                setParentState({
                  buttonTree:buttonTree
                })
              }
          })
     },[])
     function onCancel(){
      setParentState({
        buttonFlag: false,
        checkedKey:[]
      })
    }
    const onSave=()=>{
        bizEventList[eventIndex]['subjects'] =  subjects
        setParentState({
          bizEventList: bizEventList,
          buttonFlag: false,
          checkedKey:[]
        })
    }
    function onChange (node,e) {
        // let i=e.target.value.lastIndexOf("\_");
        //       let val=  e.target.value.substring(i+1,e.target.value.length);
        // console.log(val,'111');
        let index = subjects.findIndex((item)=>{return item.subjectId==node.buttonId})
        if(index==-1){
            subjects.push({'subjectId': node.buttonId, 'subjectName': node.buttonName, 'triggerTime':e.target.value.toString()})
        }else{
            subjects[index]['triggerTime'] =e.target.value.toString()
        }
        setNodes(subjects)
    };
    const onCheck=(checkedKeys, {checked,node})=>{
      setParentState({
        checkedKey:checkedKeys
      })
        if(checkedKeys.length==0){
            setNodes([])
            return
        }
        if(node.buttonName=='表单按钮'){
            const res=[]
            node.children.forEach((item)=>{
                res.push({'subjectId': item.buttonId, 'subjectName': item.buttonName, 'triggerTime':''})
            })
            setNodes(res)
        }
        else{
                let index = subjects.findIndex((item)=>{return item.subjectId==node.buttonId})
            if(index==-1){
                subjects.push({'subjectId': node.buttonId, 'subjectName': node.buttonName, 'triggerTime':''})
                setNodes(subjects)
            }else{
                const res=[]
                subjects.forEach((item,index)=>{
                    checkedKeys.forEach((val,ind)=>{
                        if(item.subjectId==val){
                            res.push(item);
                        }
                    })
                })
                setNodes(res)
            }
        }
    }
  return (
    <Modal
                visible={true}
                width={800}
                title='选择按钮'
                onCancel={onCancel}
                mask={false}
                maskClosable={false}
                centered
                getContainer={() =>{
                    return document.getElementById(`event_modal_${bizSolId}`)||false
                }}
                footer={[
                    <Button onClick={onCancel}>
                    取消
                    </Button>,
                    <Button loading={loading.global} type="primary" onClick={onSave}>
                    保存
                    </Button>
                ]}
            >
            <div>
               <Tree
                expandedKeys={buttonTree.length!=0&&[buttonTree[0].key]}
                treeData={buttonTree}
                checkable
                onCheck={onCheck}
                checkedKeys={checkedKey}
                titleRender={(node)=>{
                    return <div>
                        <span style={{display:'inline-block',width: 100}}>{node.buttonName}</span>
                            {/* {node.operationType&&<Radio.Group onChange={onChange.bind(this,node)}  >
                                {
                                    BUTTONTYPES?.map((item)=>{
                                            return <Radio value={`${node.buttonId}_${item.key}`} key={item.key}>{item.name}</Radio>
                                    })
                                }
                        </Radio.Group>   } */}
                    </div>
                }}
                />
            </div>
        </Modal>
  )
}
export default (connect(({applyModelConfig,layoutG,loading})=>({
    applyModelConfig,
    ...layoutG,
    loading
  }))(SelectButtonModal));
