import React, { useEffect, useRef, useState } from 'react'
import { IndexBar, List,SearchBar,Empty } from 'antd-mobile'
import {connect,useSearchParams} from 'umi'
import pinyinUtil from '../../../util/pinyinUtil'
import NoneUserImg from '../../../../public/assets/user.svg'
import { Checkbox } from 'antd';
import {PullToRefresh} from 'antd-mobile/es'
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './index.less'

// const charCodeOfA = 'A'.charCodeAt(0)
// const groups = Array(26)
//   .fill('')
//   .map((_, i) => ({
//     title: String.fromCharCode(charCodeOfA + i),
//     items: ()=>{
//         console.log("aaaaaaaaaaa",String.fromCharCode(charCodeOfA + i))
//     },
//   }))


const UserChoice = ({dispatch,userChoiceSpace}) => {
    const {returnCount,currentPage,searchWord,choiceList} = userChoiceSpace
    const [searchParams] = useSearchParams()
    const [checkAll, setCheckAll] = useState(false);
    const [checkItem,setCheckItem] = useState('') // 单个选中
    const [checkItemName,setCheckItemName] = useState('') // 单个选中相关人名称
    // const [checkedList, setCheckedList] = useState(new Set());

    // 按照中文姓氏的拼音首字母分组
 const  groupContactsByInitial=(contacts)=> {
        let groupedContacts = {};
        contacts.forEach((contact) => {
          // const initial = toInitial(contact.surname);
          const initial = pinyinUtil.getFirstLetter(
            contact.userName.charAt(0).toUpperCase(),
          );
          if (/^[A-Z]$/.test(initial)) {
            if (!groupedContacts[initial]) groupedContacts[initial] = [];
            groupedContacts[initial].push(contact);
          } else {
            if (!groupedContacts['#']) groupedContacts['#'] = [];
            groupedContacts['#'].push(contact);
          }
        });
        // 排序分组键，确保A-Z的顺序，但#排在最后
        const sortedKeys = Object.keys(groupedContacts).sort((a, b) => {
          if (a === '#') return 1;
          if (b === '#') return -1;
          return a.localeCompare(b);
        });
  
        const finalGroupedContacts = {};
        sortedKeys.forEach((key) => {
          finalGroupedContacts[key] = groupedContacts[key];
        });
  
        const keysArray = Object.keys(finalGroupedContacts);
        const valuesArray = keysArray.map((key) => finalGroupedContacts[key]);
  
        return [keysArray, valuesArray];
      }

  const indexBarRef = useRef(null)
    

  
  // const [keysArray,valuesArray] = groupContactsByInitial(list)
  // const groups = 
  // valuesArray.map((item, i) => {
  //   return ({
  //       items:item,
  //       title: keysArray[i]
  //   })
    
  // })
  // console.log("groups99888",groups)    


  useEffect(() => {
    // indexBarRef.current?.scrollTo(groups[1].title)
    getUserList('',1)
    const selectedId = searchParams.get('checkUserId')
    const selectedName = searchParams.get('checkUserName')
    setCheckItem(selectedId)
    setCheckItemName(selectedName)
  }, [])

  // 获取用户信息
  const getUserList = (searchValue,start=1)=>{
    dispatch({
      type: 'userChoiceSpace/getAddress',
      payload: {
        orgId:'',
        limit:10,
        start,
        searchWord: searchValue,
        userSelectLevel:2
      }
    })
  }

  // 加载更多
  const loadMore = ()=>{
    getUserList(searchWord,Number(currentPage)+1)
  }

  function flattenArray(arr) {
    const result = [];
    
    arr.forEach(item => {
      if (Array.isArray(item)) {
        result.push(...flattenArray(item)); // 递归处理子数组
      } else {
        result.push(item); // 收集非数组元素
      }
    });
    
    return result;
  }

  // 选中全部
  const onCheckAllChange = (e)=>{
    // console.log("eeeeeeeeeee",e.target.checked,flattenArray(valuesArray))
    setCheckAll(e.target.checked)
    // const arr = flattenArray(valuesArray).map(item=>item.id)
    if(e.target.checked){
        // setCheckedList(new Set(arr))
    }else{
        setCheckedList(new Set())
    }
  }
  // 单个选中数组类
  // const onChangeItem = (value)=>{
  //   setCheckedList((prevSelected) => {
  //       const newSelected = new Set(prevSelected);
  //       if (newSelected.has(value)) {
  //         newSelected.delete(value);
  //       } else {
  //         newSelected.add(value);
  //       }
  //       return newSelected;
  //     });
  // }
  // 单个选中单个
  const onChangeItemSingle = (value)=>{
    setCheckItem(value.id)
    setCheckItemName(value.userName)
  }
  // 清除
  const onClear = ()=>{
    getUserList('',1)
    dispatch({
        type: 'userChoiceSpace/updateStates',
        payload: {
          searchWord: ''
        }
    })
  }
  // 保存
  const onSave = ()=>{
    // console.log("checkedList",[...checkedList])
    dispatch({
      type: 'mobileCalendarDetail/updateStates',
      payload: {
        checkedRelationId: checkItem,
        checkRelationName: checkItemName,
      }
    })
    const relationObj = {
      relationId: checkItem,
      relationName: checkItemName
    }
    localStorage.setItem("relation",JSON.stringify(relationObj))
    // addSchedule

    history.go(-1)
  }

  // 搜索内容
  const onSearchValue= (val)=>{
    dispatch({
      type: 'userChoiceSpace/updateStates',
      payload: {
        searchWord: val
      }
    })
    getUserList(val,1)
  }
// console.log("list0099",list)
  return (
    <div className={styles.choice_user}>
        <div className={styles.search}><SearchBar
            onSearch={val => onSearchValue(val)}
            onClear={onClear}    
            placeholder='请输入搜索内容'/></div>
        {/* <div className={styles.check_all} onChange={onCheckAllChange} checked={checkAll}><Checkbox >
            全选
        </Checkbox></div> */}
        {
              choiceList.length==0? <Empty
              style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
              }}
              imageStyle={{ width: 128 }}
              description="暂无数据"
        />:
        <div className={styles.bar_box}>
            {/* <IndexBar ref={indexBarRef}>
                {groups.map(group => {
                const { title, items } = group
                // console.log("groups9988","items",valuesArray)
                return (
                    <IndexBar.Panel
                    index={title}
                    title={`${title}`}
                    key={`${title}`}
                    >
                    <div className={styles.list}   key={`${title}`}>
                        {
                            items.map((item,index)=>{
                                // console.log("itemssss999",item)
                                return (
                                    <div className={styles.items_box} key={index}>
                                        <div className={styles.items_check}>
                                            <Checkbox value={item.id}
                                                checked={checkedList.has(item.id)} 
                                                onChange={()=>onChangeItem(item.id)}
                                            ></Checkbox>        
                                        </div>
                                    <div className={styles.items_cont}>
                                        <div className={styles.head}></div>
                                        <div className={styles.cont}> 
                                            <div className={styles.cont_name}>{item.userName}</div>
                                            <div className={styles.cont_part}>{item.part}</div>
                                        </div>  
                                    </div>   
                                    </div>
                                )
                            })
                        }

                    </div>
                    </IndexBar.Panel>
                )
                })}
            </IndexBar> */}
            
            <div className={styles.list} id="pullToRefresh">
              <PullToRefresh 
                onRefresh={() => {
                  getUserList(searchWord,1)
                }}>
                  <InfiniteScroll  
                      dataLength={choiceList.length}
                      hasMore={choiceList?.length < returnCount}
                      next={loadMore}
                      endMessage={
                        choiceList?.length == 0 ? (
                          ''
                          ) : (
                          <span className="footer_more">没有更多啦</span>
                          )
                      }
                      //   loader={<Spin className="spin_div" />}
                      scrollableTarget="pullToRefresh"
                      >
                        {
                            choiceList.map((item,index)=>{
                                return (
                                    <div className={styles.items_box} key={item.id}>
                                        <div className={styles.items_check}>
                                            <Checkbox value={item.id}
                                                // checked={checkedList.has(item.id)}
                                                checked={checkItem==item.id} 
                                                onChange={()=>onChangeItemSingle(item)}
                                            ></Checkbox>        
                                        </div>
                                        <div className={styles.items_cont}>
                                            <div className={styles.head}>
                                              {
                                                item.picturePath?<img src={item.picturePath} />:<img src={NoneUserImg}/>
                                              }
                                            </div>
                                            <div className={styles.cont}> 
                                                <div className={styles.cont_name}>{item.userName}</div>
                                                <div className={styles.cont_part}>{item.postName}</div>
                                            </div>  
                                        </div>   
                                    </div>
                                )
                            })
                        }
                  </InfiniteScroll>    
                </PullToRefresh>    
            </div>
            <div className={styles.save_box}>
                  <div className={styles.save} onClick={onSave}>保存</div>
            </div>   
        </div>
        }
        
    </div>
  )
}

export default connect(({userChoiceSpace,mobileCalendarDetail})=>({userChoiceSpace,mobileCalendarDetail}))(UserChoice)