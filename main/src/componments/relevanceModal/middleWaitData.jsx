/**
 * 关联用户的中间部分
 */
import React, { useState, useEffect,useCallback } from 'react';
import { Input, Checkbox, Radio } from 'antd';
import styles from './relevanceModal.less';
import { history } from 'umi'
const { Search } = Input;
function MiddleUserAccredit({
  searchWordFn,
  selectIds,
  originalData,
  updateSelectIdsFn,
  idKey,
  nameKey,
  selectedNodeId,
  selectedDatas,
  searchWordHint,
  selectButtonType,
  orgUserType
}) {
  const [searchWord, setSearchWord] = useState('');
  const [flag,setFlag]=useState(false)
  const [curTreeSelectIds, setCurTreeSelectIds] = useState([]);
  const [visibleItems, setVisibleItems] = useState(50);
  const pathname=history.location.pathname
  const moudleName=pathname.split('/')[2]
  //清空输入框
  useEffect(() => {
    setSearchWord('');
  }, [selectedNodeId]);
  useEffect(()=>{
    const container = document.getElementById(`${moudleName}_middleContent`);
    // 当列表容器滚动到底部时加载更多数据
    const handleScroll = (e) => {
      const scrollTop=e.target.scrollTop
      const scrollHeight=e.target.scrollHeight
      if (Math.ceil(scrollTop + container.clientHeight) >= scrollHeight) {
        loadMore();
      }
      if(scrollTop == 0){
        setVisibleItems(50)
      }
    };
    container.addEventListener('scroll', handleScroll,true);
    return () => {
      container.removeEventListener('scroll', handleScroll,false);
    };
  },[])
  const loadMore=useCallback(()=>{
    setVisibleItems((prevVisibleItems)=>{
      return prevVisibleItems+50
    })
  },[])
  //如果selectIds改变，则当前的节点的选中用户更新，避免节点间的全选状态冲突
  useEffect(() => {
    let newCurSelectIds = [];
    originalData.map(item => {
      if (selectIds.includes(item[idKey])) {
        newCurSelectIds.push(item[idKey]);
      }
    });
    setCurTreeSelectIds(newCurSelectIds);
  }, [originalData]);
  useEffect(() => {
    let newCurSelectIds = [];
    originalData.map(item => {
      if (selectIds.includes(item[idKey])) {
        newCurSelectIds.push(item[idKey]);
      }
    });
    setCurTreeSelectIds(newCurSelectIds);
  }, [selectIds.length]);
  //改变搜索词的输入框
  const changeInput = e => {

    if(e.type=='click'){
      setFlag(true)
      setTimeout(()=>{
        searchWordFn('')
      },100)
    }else{
      setSearchWord(e.target.value);
      setFlag(false)
    }
  };
  //全选
  const onCheckAllChange = e => {
    let newSelectIds = [];
    let newSelectedUsers = [];
    if (e.target.checked) {
      newSelectIds = selectIds;
      newSelectedUsers = selectedDatas;
      //获取全部的用户ID
      originalData.map(item => {
        if (!selectIds.includes(item[idKey])) {
          newSelectIds.push(item[idKey]);
          newSelectedUsers.push(item);
        }
      });
    } else {
      selectedDatas.map(item => {
        if (!_.find(originalData, { [idKey]: item[idKey] })) {
          newSelectedUsers.push(item);
          newSelectIds.push(item[idKey]);
        }
      });
    }
    console.log('newSelectedUsers=', newSelectedUsers);
    updateSelectIdsFn(newSelectIds, newSelectedUsers);
  };
  //复选框
  const changeSelect = e => {
    let newSelectIds = selectIds || [];
    let newSelectedUsers = selectedDatas || [];
    if (selectButtonType == 'checkBox') {
      if (e.target.checked) {
        //添加
        newSelectIds.push(e.target.value);
        //获取当前用户数据
        const curUserInfo = originalData.filter(
          item => item[idKey] == e.target.value,
        );

        if (curUserInfo.length) {
          const ids = newSelectedUsers.map(item => item.id || item[idKey]);
          if (!ids.includes(e.target.value)) {
            newSelectedUsers.push(curUserInfo[0]);
          }
        }
      } else {
        //删除
        newSelectIds = selectIds.filter(i => i != e.target.value);
        newSelectedUsers = selectedDatas.filter(item => {
          const key = item.orgRefUserId || item.id;
          return key != e.target.value;
        });
      }
    } else {
      if (e.target.checked) {
        //添加
        newSelectIds = [e.target.value];
        //获取当前用户数据
        const curUserInfo = originalData.filter(
          item => item[idKey] == e.target.value,
        );
        if (curUserInfo.length) {
          newSelectedUsers = curUserInfo;
        }
      } else {
        //删除
        newSelectIds = [];
        newSelectedUsers = [];
      }
    }
    console.log('newSelectedUsers=', newSelectedUsers);
    updateSelectIdsFn(newSelectIds, newSelectedUsers);
  };
  //显示部门岗位
  const showIdentity=(item)=>{
    debugger
    const parts = [];
    if (item['deptName']) {
      parts.push(item['deptName']);
    }
    if (item['postName']) {
      parts.push(item['postName']);
    }
    const postType = item.isMainPost === 1 ? '主岗' : '兼职';
    const postStatus = item.isLeavePost === 1 ? '离岗' : '在岗';
    parts.push(postType);
    parts.push(postStatus);

    return `(${parts.join('_')})`;    
  }
  const indeterminate =
    curTreeSelectIds.length && curTreeSelectIds.length != originalData.length;
  const checkAll = curTreeSelectIds.length == originalData.length;
  console.log('curTreeSelectIds=', curTreeSelectIds);
  console.log('originalData=', originalData);
  return (
    <div className={styles.await_select_list}>
      <span className={styles.title}>待选择</span>
      <div className={styles.content}>
        <div>
          <Search
            onSearch={searchWordFn.bind(this, flag?'':searchWord)}
            onChange={changeInput}
            value={flag?'':searchWord}
            placeholder={searchWordHint}
            style={{ width: '205px' }}
            allowClear
          />
          <br />
        </div>
        <div className={styles.middle_list} id={`${moudleName}_middleContent`}>
          {selectButtonType == 'checkBox' ? (
            <>
              <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
              >
                全部
              </Checkbox>
            </>
          ) : null}
          {originalData.slice(0,visibleItems).map(item => {
            return (
              <div key={item[idKey]}>
                <Checkbox
                  value={item[idKey]}
                  onChange={changeSelect}
                  checked={
                    selectIds &&
                    selectIds.filter(i => i == item[idKey]).length > 0
                      ? true
                      : false
                  }
                  className={styles.check_box_middle}
                >
                  {item[nameKey]}
                  {orgUserType&&orgUserType=='POST'?'':showIdentity(item)}
                </Checkbox>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default MiddleUserAccredit;
