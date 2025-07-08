import { connect } from 'dva';
import React, { useState } from 'react';
import { Input,Modal,Button,Tree,Select} from 'antd';
import styles from './index.less'

function SeniorSearch({dispatch,seniorTree,listMoudleInfo,seniorSearchList,seniorCheckedKeys}){

    function onCancel(){
        let checkedKeys = listMoudleInfo.seniorSearchInfo&&listMoudleInfo.seniorSearchInfo.map((item)=>{
            return item.colCode
        })
        dispatch({
            type: 'dataDriven/updateStates',
            payload: {
                seniorModal: false,
                seniorSearchList: listMoudleInfo.seniorSearchInfo,
                seniorCheckedKeys: checkedKeys

            }
        })
    }
    function onSave() {
        dispatch({
            type: 'dataDriven/updateStates',
            payload: {
                seniorModal: false
            }
        })
    }


    function onCheck(checkedKeys, {checked: bool, checkedNodes, node, event, halfCheckedKeys}) {
        let list = checkedNodes.filter((item)=>{return listMoudleInfo['tableId']!=item.key})
        list.forEach((element,i) => {
            console.log('list',list);
            if(!element.value){
                list[i].value = 'input'
            }
        });
        dispatch({
            type: 'dataDriven/updateStates',
            payload: {
                seniorSearchList: list,
                seniorCheckedKeys: checkedKeys
            }
        })

    }

    function  onchange(index,value) {
        seniorSearchList[index].value = value
        dispatch({
            type: 'dataDriven/updateStates',
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
                return document.getElementById('dataDriven_container')||false
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
                    defaultExpandedKeys={[listMoudleInfo['dsId']]}
                    />
                    <ul className={styles.input_list} >
                        {
                            seniorSearchList&&seniorSearchList.length!=0?
                            seniorSearchList.map((item,index)=>{
                                return <li key={index+6}>
                                    <span>{item.colName}</span>
                                    <Select style={{width: 240,height: 32,marginTop: 20}} defaultValue={item.value} onChange={onchange.bind(this,index)}>
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
export default connect(({dataDriven})=>({
    ...dataDriven
}))(SeniorSearch);
