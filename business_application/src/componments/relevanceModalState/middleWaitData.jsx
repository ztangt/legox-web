/**
 * 关联用户的中间部分
 */
import React, { useState, useEffect } from 'react';
import { Input, Checkbox, Radio } from 'antd';
import styles from './relevanceModal.less';
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
  postName,
  isShowTitle,
}) {
  const [searchWord, setSearchWord] = useState('');
  const [curTreeSelectIds, setCurTreeSelectIds] = useState([]);
  //清空输入框
  useEffect(() => {
    setSearchWord('');
  }, [selectedNodeId]);
  //如果selectIds改变，则当前的节点的选中用户更新，避免节点间的全选状态冲突
  useEffect(() => {
    let newCurSelectIds = [];
    originalData.map((item) => {
      if (selectIds.includes(item[idKey])) {
        newCurSelectIds.push(item[idKey]);
      }
    });
    setCurTreeSelectIds(newCurSelectIds);
  }, [originalData]);
  useEffect(() => {
    let newCurSelectIds = [];
    originalData.map((item) => {
      if (selectIds.includes(item[idKey])) {
        newCurSelectIds.push(item[idKey]);
      }
    });
    setCurTreeSelectIds(newCurSelectIds);
  }, [selectIds.length]);
  //改变搜索词的输入框
  const changeInput = (e) => {
    setSearchWord(e.target.value);
  };
  //全选
  const onCheckAllChange = (e) => {
    let newSelectIds = [];
    let newSelectedUsers = [];
    if (e.target.checked) {
      newSelectIds = selectIds;
      newSelectedUsers = selectedDatas;
      //获取全部的用户ID
      originalData.map((item) => {
        if (!selectIds.includes(item[idKey])) {
          newSelectIds.push(item[idKey]);
          newSelectedUsers.push(item);
        }
      });
    } else {
      selectedDatas.map((item) => {
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
  const changeSelect = (e) => {
    let newSelectIds = selectIds || [];
    let newSelectedUsers = selectedDatas || [];
    if (selectButtonType == 'checkBox') {
      if (e.target.checked) {
        //添加
        newSelectIds.push(e.target.value);
        //获取当前用户数据
        const curUserInfo = originalData.filter(
          (item) => item[idKey] == e.target.value,
        );
        console.log('curUserInfo=', curUserInfo);
        console.log('selectedDatas=', selectedDatas);
        if (curUserInfo.length) {
          newSelectedUsers.push(curUserInfo[0]);
        }
      } else {
        //删除
        newSelectIds = selectIds.filter((i) => i != e.target.value);
        newSelectedUsers = selectedDatas.filter(
          (item) => item[idKey] != e.target.value,
        );
      }
    } else {
      if (e.target.checked) {
        //添加
        newSelectIds = [e.target.value];
        //获取当前用户数据
        const curUserInfo = originalData.filter(
          (item) => item[idKey] == e.target.value,
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
  const showIdentity = (item) => {
    let depIdeName = '';
    if (item['deptName']) {
      depIdeName = item['deptName'];
    }
    if (item['postName']) {
      if (depIdeName) {
        depIdeName = depIdeName + '_' + item['postName'];
      } else {
        depIdeName = item['postName'];
      }
    }
    let mainPost = item.isMainPost == 1 ? '主岗' : item.isMainPost == 0 ? '兼职' : ''
    let leavePost = item.isLeavePost == 1 ? '离岗' : item.isLeavePost == 0 ? '在岗' : ''
    // 使用数组过滤和join方法拼接字符串
    const result = [depIdeName, mainPost, leavePost].filter(Boolean).join('_')
    return result ? `(${result})` : ''
  };
  const indeterminate =
    curTreeSelectIds.length && curTreeSelectIds.length != originalData.length;
  const checkAll = (curTreeSelectIds.length == originalData.length) && originalData.length != 0;
  console.log('curTreeSelectIds=', curTreeSelectIds);
  console.log('originalData=', originalData);
  return (
    <div className={styles.await_select_list}>
      {isShowTitle && <span className={styles.title}>待选择</span>}
      <div
        className={styles.content}
        style={isShowTitle ? { height: 'calc(100% - 31px)' } : {}}
      >
        <div>
          <Search
            onSearch={searchWordFn.bind(this, searchWord)}
            onChange={changeInput}
            value={searchWord}
            placeholder={searchWordHint}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.middle_list}>
          {selectButtonType == 'checkBox' ? (
            <>
              <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
              >
                全部
              </Checkbox>
              <br />
            </>
          ) : null}
          {originalData.map((item) => {
            return (
              <div key={item[idKey]}>
                <Checkbox
                  value={item[idKey]}
                  onChange={changeSelect}
                  checked={
                    selectIds &&
                      selectIds.filter((i) => i == item[idKey]).length > 0
                      ? true
                      : false
                  }
                  className={styles.check_box_middle}
                >
                  {item[nameKey]}
                  {showIdentity(item)}
                </Checkbox>
                <br />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
MiddleUserAccredit.defaultProps = {
  isShowTitle: true,
  postName: 'identity', //由于每个接口返回的岗位字段不同
};
export default MiddleUserAccredit;
