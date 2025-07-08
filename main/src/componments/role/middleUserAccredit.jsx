/**
 * 关联用户的中间部分
 */
import React,{useState,useEffect} from 'react';
import {Input,Checkbox} from 'antd';
import styles from './userAccredit.less';
const {Search} = Input;
function MiddleUserAccredit({searchWordFn,selectIds,originalData,updateSelectIdsFn,idKey,nameKey,selectedNodeId,selectedUsers}){
  const [searchWord,setSearchWord] = useState('');
  //清空输入框
  useEffect(() => {
    setSearchWord('');
  }, [selectedNodeId]);
  //改变搜索词的输入框
  const changeInput=(e)=>{
    setSearchWord(e.target.value);
  }
  //全选
  const onCheckAllChange=(e)=>{
    let selectIds = [];
    let newSelectedUsers=[];
    if(e.target.checked){
      //获取全部的用户ID
      originalData.map((item)=>{
        selectIds.push(item[idKey]);
        newSelectedUsers.push(item);
      })
    }
    updateSelectIdsFn(selectIds,newSelectedUsers);
  }
  //复选框
  const changeSelect=(e)=>{
    let newSelectIds = selectIds;
    let newSelectedUsers = selectedUsers;
    if(e.target.checked){//添加
      newSelectIds.push(e.target.value);
      //获取当前用户数据
      const curUserInfo = originalData.filter(item=>item[idKey]==e.target.value);
      if(curUserInfo.length){
        newSelectedUsers.push(curUserInfo[0]);
      }
    }else{//删除
      newSelectIds = selectIds.filter(i=>i!=e.target.value);
      newSelectedUsers = selectedUsers.filter(item=>item[idKey]!=e.target.value);
    }
    console.log('newSelectedUsers=',newSelectedUsers);
    updateSelectIdsFn(newSelectIds,newSelectedUsers);
  }
  //显示部门岗位
  const showIdentity=(item)=>{
    debugger
    const parts = [];
    if (item['deptName']) {
      parts.push(item['deptName']);
    }
    if (item['identity']) {
      parts.push(item['identity']);
    }
    const postType = item.isMainPost === 1 ? '主岗' : '兼职';
    const postStatus = item.isLeavePost === 1 ? '离岗' : '在岗';
    parts.push(postType);
    parts.push(postStatus);

    return `(${parts.join('_')})`;    
  }
  const indeterminate=selectIds.length&&selectIds.length!=originalData.length;
  const checkAll = selectIds.length==originalData.length;
  return (<div className={styles.await_select_list}>
    <span className={styles.title}>待选择</span>
    <div className={styles.content}>
      <Search onSearch={searchWordFn.bind(this,searchWord)} onChange={changeInput} value={searchWord}/><br/>
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
      全部
      </Checkbox><br/>
      {originalData.map((item)=>{
        return (
          <div key={item[idKey]}>
          <Checkbox
            value={item[idKey]}
            onChange={changeSelect}
            checked={selectIds.filter(i=>i==item[idKey]).length>0?true:false}
            className={styles.check_box_middle}
          >
            {item[nameKey]}
            {showIdentity(item)}
          </Checkbox>
          <br/>
          </div>
        )
      })}
    </div>
  </div>)
}
export default MiddleUserAccredit;
