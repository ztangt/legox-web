import { connect } from 'dva';
import React, { useState } from 'react';
import { Input,Modal,Button,Tree,Select,message} from 'antd';
import styles from './index.less'
import {useLocation} from 'umi'
import { parse } from 'query-string';
const query = parse(history.location.search);
function SeniorSearch({dispatch,seniorTree,listMoudleInfo,seniorSearchList,seniorCheckedKeys}){
    const location = useLocation();
    const namespace = `moudleDesign_${query.moudleId}`;
    console.log('seniorTree',seniorTree);
    function onCancel(){
        let checkedKeys = listMoudleInfo.seniorSearchInfo&&listMoudleInfo.seniorSearchInfo.map((item)=>{
            return item.columnCode
        })
        console.log('checkedKeys',checkedKeys);
        dispatch({
            type: `${namespace}/updateStates`,
            payload: {
                seniorModal: false,
                seniorSearchList: listMoudleInfo.seniorSearchInfo,
                seniorCheckedKeys: checkedKeys

            }
        })
    }
    function onSave() {
        let isFlag = true;
        if(seniorSearchList.length!=0){
            for (let index = 0; index < seniorSearchList.length; index++) {
                const element = seniorSearchList[index];
                console.log(element);
                if(!element.value){
                    isFlag = false
                }
            }
        }
        if(isFlag){
            dispatch({
                type: `${namespace}/updateStates`,
                payload: {
                    seniorModal: false
                }
            })
        }else{
            message.error('请选择所选字段的查询组件')
        }
    }


    function onCheck(checkedKeys, {checked: bool, checkedNodes, node, event, halfCheckedKeys}) {
        console.log('checkedNodes',checkedNodes);
        let list = checkedNodes.filter((item)=>{return listMoudleInfo['tableId']!=item.key})
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            console.log('element',element);
            // if(element.colType&&(element.colType.toLowerCase()=='varchar'||element.colType.toLowerCase()=='varchar')){
            //     list[index]['value'] = 'input'
            //     // list[index]['disabled'] = true

            // }
            if(!element.value){
                list[index]['value'] = 'input'
            }

        }
        dispatch({
            type: `${namespace}/updateStates`,
            payload: {
                seniorSearchList: list,
                seniorCheckedKeys: checkedKeys
            }
        })

    }

    function  onchange(index,value) {
        seniorSearchList[index].value = value
        dispatch({
            type: `${namespace}/updateStates`,
            payload: {
                seniorSearchList
            }
        })
    }

    return(
        <Modal
            visible={true}
            footer={false}
            width={'95%'}
            title={'高级查询'}
            onCancel={onCancel}
            maskClosable={false}
            mask={false}
            centered
            getContainer={() =>{
                return document.getElementById(`moudleDesign_container_${query.moudleId}`)||false
            }}
        >
            <div className={styles.senior_container}>
                <Tree
                    checkedKeys={seniorCheckedKeys}
                    className={styles.tree}
                    checkable
                    autoExpandParent={true}
                    onCheck={onCheck}
                    treeData={seniorTree}
                    defaultExpandedKeys={seniorTree&&[seniorTree[0].key]}
                    />
                    <ul className={styles.input_list} >
                        {
                            seniorSearchList&&seniorSearchList.length!=0?
                            seniorSearchList.map((item,index)=>{
                                return <li key={index+6}>
                                    <span style={{width: 100,textAlign:'right',display:'inline-block'}}>{item.colName}</span>
                                    <Select style={{width: 200,height: 32,marginTop: 20}} defaultValue={item.value} onChange={onchange.bind(this,index)} disabled={item.disabled}>
                                        <Select.Option value='input'>输入框</Select.Option>
                                        <Select.Option value='time'>时间选择</Select.Option>
                                    </Select>
                                </li>
                            }):''
                        }
                    </ul>
            </div>

            <div className={styles.bt_group}  >
                <Button  type="primary" onClick={onSave.bind(this)}>
                    保存
                </Button>
                <Button onClick={onCancel} style={{marginLeft: 8}}>
                    取消
                </Button>
            </div>
        </Modal>
    )
}
// export default connect(({moudleDesign})=>({
//     ...moudleDesign
// }))(SeniorSearch);
export default connect((state)=>({
        ...state[`moudleDesign_${query.moudleId}`],

  }))(SeniorSearch);
