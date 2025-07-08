import { connect } from 'dva';
import React, { useState } from 'react';
import { Modal,Button,Form,Row,Checkbox,Input} from 'antd';
import {CloseOutlined} from '@ant-design/icons';
import _ from "lodash";
import styles from '../index.less';
import { history } from 'umi';
   
function addForm ({dispatch,loading,onCancel,tenementLists,userIds}){ 
    const [form] = Form.useForm();

    const [checkedList, setCheckedList] = React.useState([]);
    const [indeterminate, setIndeterminate] = React.useState(false);
    const [checkAll, setCheckAll] = React.useState(false);

    const onChange = list => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < tenementLists.length);
        setCheckAll(list.length === tenementLists.length);
    };
    
    const onCheckAllChange = e => {
        let arr = [];
        if(e.target.checked){
            tenementLists.forEach(function(item,i){
                arr.push(item.value)
            })
            setCheckedList(arr);
        }else{
            setCheckedList([])
        }
      //  setCheckedList(e.target.checked ? tenementLists : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };

    function resultSameValue(arr1, arr2) {
        let newArr = Array.from(new Set([...arr1].filter(x => arr2.includes(x.id))));
        return newArr;
    }
    function ulList(list) {
        let arr = resultSameValue(tenementLists,list)
        const listItems = arr.map((item,i) =>{
            return (<li key={i} style={{ lineHeight: '26px', marginLeft:'8px',backgroundColor:'#f8f8f8',padding:'0 10px'}}>
                {item.tenantName}<CloseOutlined onClick={(e)=>{removeLi(item.id)}} style={{marginLeft:'10px',color:'#ccc',cursor: 'pointer'}}/>
            </li>)
        });
        return (
            <ul style={{display:'flex'}}>{listItems}</ul>
        );
    }
    function removeLi(id){
        let arr = [];
        checkedList.forEach(function(item,i){
            if(item != id){
                arr.push(item)
            }
        })
        setCheckedList(arr)
        if(arr.length == 0){
            setCheckAll(false)
        }
    }
    function getByIdJs(arr) {
        var str = "";
        for (var i = 0; i < arr.length; i++) {
            str += arr[i]+ ",";
        }
        if (str.length > 0) {
            str = str.substr(0, str.length - 1);
        }
        return str;
    }
    function submit(){
        dispatch({
            type:"userMg/batchUsers",
            payload:{
                userIds:getByIdJs(JSON.parse(JSON.stringify(userIds))),
                tenantIds:getByIdJs(JSON.parse(JSON.stringify(checkedList)))
            },
            callback:function(){
                dispatch({
                    type:"userMg/updateStates",
                    payload:{
                        batchModal:false,
                    }
                }) 
            }
        }) 
    }
    return (
        <Modal
            visible={true}
            footer={false}
            width={900}
            title='租户列表'
            bodyStyle={{padding: '10px'}}
            onCancel={onCancel}
            mask={false}
            maskClosable={false}
            getContainer={() =>{
                return document.getElementById('userMg_container')
            }}
        >
            <div style={{height:"500px"}}>
                <Input.Search
                    style={{width:'200px'}}
                    placeholder={'租户名称'}
                    allowClear
                />
                <div className={styles.mian}>
                    <div className={styles.mianLeft}>
                        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>全选</Checkbox>
                        <Checkbox.Group className={styles.checkItem} options={tenementLists} value={checkedList} onChange={onChange} />
                    </div>
                    <div className={styles.mianRight}>
                        {ulList(checkedList)}
                    </div>
                </div>
            </div>
            <Row style={{width: '200px',margin:'10px auto 0'}} >
                <Button  type="primary" loading={loading.global} onClick={submit}>
                    保存
                </Button>
                <Button onClick={onCancel} style={{marginLeft: 8}}>
                    取消
                </Button>
            </Row>
            
    </Modal>
    )
  }


  
export default (connect(({userMg,layoutG,loading})=>({
    ...userMg,
    ...layoutG,
    loading
  }))(addForm));
