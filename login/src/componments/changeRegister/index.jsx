import GlobalModal from '../GlobalModal'
import { useState,useEffect } from 'react'
import { Select, Modal, Button } from 'antd';
import styles from './index.less'
import _ from 'lodash-es';
export default function Index({registerList,onOKLogin,dispatch,registerId}){
    const [currentItem,setCurrentItem]= useState({})
    useEffect(()=>{
        let register = _.find(registerList,{registerId: localStorage.getItem('registerId')})
        if(register){
            setCurrentItem(register)
        }else{
            setCurrentItem(registerList?.[0])
        }
    },[])
    function onSelect(item){
        dispatch({
            type: 'user/updateStates',
            payload: {
                registerId: item.registerId
            }
        })
        setCurrentItem(item)
    }
    function onCancel(value,option){
        dispatch({
            type: 'user/updateStates',
            payload: {
                registerModal: false
            }
        })
    }
    return (
        <div className={styles.register_container}>
            <div className={styles.register_container_list}>
            {
                registerList?.map((item,key)=>{
                    return<div key={item.registerId} className={currentItem?.registerId==item.registerId?styles.register_item_current:styles.register_item} onClick={onSelect.bind(this,item)} title={item.registerName} onDoubleClick={()=>{onOKLogin(item)}}>
                        {item.registerName}{localStorage.getItem('registerId')==item.registerId?`(上次选择)`:''}
                    </div>
                })
            }
            </div>
            <div className={styles.button_group}>
                <Button className={styles.button_pre} onClick={onCancel.bind(this)}>上一步</Button>
                <Button className={styles.button_next} onClick={()=>{onOKLogin(currentItem)}}>下一步</Button>
            </div>
         </div>
         
    )
    
}