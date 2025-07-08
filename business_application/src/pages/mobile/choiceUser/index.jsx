import { useEffect, useState, useMemo, useRef } from 'react';
import styles from './index.less';
import { history, MicroAppWithMemoHistory, connect } from 'umi';
import { useSetState } from 'ahooks';
import './index.less';
import * as dd from 'dingtalk-jsapi';
import { Checkbox, Spin, Divider } from 'antd';
import {
  SearchBar,
  FloatingBubble
} from 'antd-mobile/es';
import { parse } from 'query-string';
import SideScreen from './componments/sideScreen'
import BottomAct from './componments/bottomAct'
import UserList from './componments/userList'
function Index({ dispatch, location, choiceUser,loading }) {
  const indexBarRef = useRef(null);
  const [value, setValue] = useState([]);
  const [valueGroup, setValueGroup] = useState(groupData?.['ORG']?.[0]?.key||groupData?.['ROLE']?.[0]?.key||groupData?.['CUSTOM']?.[0]?.key);
  const [screenVisible, setScreenVisible] = useState(false);
  const [dealStrategy, setDealStrategy] = useState('0');
  const [actVisible, setActVisible] = useState(false);
  const [itemKey, setItemKey] = useState('ORG');
  const {
    bizTaskNodes,
    checkNodeIds,
    taskActList,
    groupData,
    currentNodeId,
    userList,
    searchUserList,
    returnCount,
    currentPage,
    defaultTaskActList,
    commentList
  } = choiceUser;
  const [itemValue, setItemValue] = useState(groupData?.['ORG']?.[0]||groupData?.['ROLE']?.[0]||groupData?.['CUSTOM']?.[0]);
  const query = parse(history.location.search);
  const { bizTaskId, bizInfoId, actId,category } = query;
  const bizInfo = JSON.parse(localStorage.getItem('bizInfo') || '{}');
  const [checkedAct, setCheckedAct] = useState([])
  const [currentAct, setCurrentAct] = useState('')
  const [loadingType, setLoadingType] = useState('')
  useEffect(() => {
    if (dd.env.platform !== 'notInDingTalk') {
      dd.ready(function () {
        dd.biz.navigation.setTitle({
          title: '人员选择',
          onSuccess: function (res) {
            // 调用成功时回调
            console.log(res);
          },
          onFail: function (err) {
            // 调用失败时回调
            console.log(err);
          },
        });
        dd.biz.navigation.setLeft({
          control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
          text: '',//控制显示文本，空字符串表示显示默认文本
          onSuccess: (result) => {
            dd.biz.navigation.goBack({
              onSuccess: function (result) {
                /*result结构
                {}
                */
              },
              onFail: function (err) { }
            })
            //如果control为true，则onSuccess将在发生按钮点击事件被回调
          },
          onFail: function (err) { }
        });
        dd.biz.navigation.setRight({
          show: false,//控制按钮显示， true 显示， false 隐藏， 默认true
          control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
          text: '取消',//控制显示文本，空字符串表示显示默认文本
          onSuccess : function(result) {
          },
          onFail : function(err) {}
         });
      });
    }
    window.webUni && window.webUni.postMessage({data: {title: '人员选择'}});
  }, []);
  function onBack(){
    if (dd.env.platform !== 'notInDingTalk') {
      dd.ready(function () {
        dd.biz.navigation.goBack({
          onSuccess: function (result) {
            /*result结构
            {}
            */
          },
          onFail: function (err) { }
        })
      });
    }else{
      window.history.back();
    }
  }
  useEffect(() => {
    dispatch({
      type: 'updateStates',
      payload:{
        bizTaskNodes: {},
        checkNodeIds: [],
        groupData: {}, //组数据
        treeData: [], //默认第一个
        userList: [],
        searchUserList: [],
        taskActList: [],
        currentNodeId: '',
        returnCount: 0,
      }
    })
    dispatch({
      type:'choiceUser/getTemporarySignList',
      payload:{
        bizInfoId: bizInfo.bizInfoId,
        bizTaskId: bizTaskId?bizTaskId:'',
      }
    })
    if (bizTaskId) {
      setLoadingType('choiceUser/getTaskDealNode')
      dispatch({
        type: 'choiceUser/getTaskDealNode',
        payload: {
          bizTaskId,
        },
        callback: (list, data) => {
          if(list.length>1){
            setActVisible(true);
          }
          if (data?.actType == 'endEvent') {
            setCurrentAct(data?.actId)
            setCheckedAct([data?.actId])
            getGroupList(data?.actId,data?.choreographyFlag,data?.choreographyOrgId,data)
          } else {
            setCurrentAct(list?.[0]?.actId)
            if(data.actType == 'parallelGateway'||data?.checkAll){//并行网关和全部选择 所有节点必选选择
              var value = list.map((item)=>{return item.actId})
              setCheckedAct(value)
            }else{
              setCheckedAct([list?.[0]?.actId])
            }
            setDealStrategy(list?.[0]?.dealStrategy)
            getGroupList(list?.[0]?.actId,list?.[0]?.choreographyFlag,list?.[0]?.choreographyOrgId,data)
            list?.[0]?.handlerId!='null'&&list?.[0]?.handlerId!=null&&setValue(list?.[0]?.handlerId?.split(','))

          }
        }
      });
    } else {
      setLoadingType('choiceUser/getProcessStartNode')
      dispatch({
        type: 'choiceUser/getProcessStartNode',
        payload: {
          bizInfoId: bizInfo.bizInfoId,
          actId: bizInfo.actId,
        },
        callback: (list, data) => {
          if (data?.actType == 'endEvent') {
            getGroupList(data?.actId,data?.choreographyFlag,data?.choreographyOrgId,data)
          } else {
            setDealStrategy(list?.[0]?.dealStrategy)
            getGroupList(list?.[0]?.actId,list?.[0]?.choreographyFlag,list?.[0]?.choreographyOrgId,data)
            setValue([list?.[0]?.handlerId])

          }
        }
      });
    }

  }, []);

  const setDefaultUserList = (actId,data) =>{
    var index = data?.taskActList.findIndex((item)=>{return item.actId==actId})
    if(index!=-1){
      var ids =  data?.taskActList?.[index]?.handlerId?.split(',') || []
      var names =  data?.taskActList?.[index]?.handlerName?.split(',') || []
      var list  = ids.map((item,index)=>{
        return {
          identityId: item,
          userName: names[index]
        }
     })
    }
    dispatch({
      type: 'choiceUser/updateStates',
      payload: {
        searchUserList: list,
      },
    });
  }

  const getGroupList = (actId,choreographyFlag,choreographyOrgId,bizData) => {
    setLoadingType('choiceUser/getGroupList')
    dispatch({
      type: 'choiceUser/getGroupList',
      payload: {
        bizInfoId: bizInfo.bizInfoId,
        bizSolId: bizInfo.bizSolId,
        procDefId: bizInfo.procDefId,
        formDeployId: bizInfo.formDeployId,
        actId: actId,
        userType: 'HANDLER',
        nodeType: '',
        nodeId: '',
        choreographyFlag,
        choreographyOrgId,
      },
      callback: (data) => {
        var type = ''
        if(data?.data?.['ORG']?.length!=0){
          type = 'ORG'
        }else if(data?.data?.['ROLE']?.length!=0){
          type = 'ROLE'
        }else if(data?.data?.['CUSTOM']?.length!=0){
          type = 'CUSTOM'
        }
        if(data?.data?.[type]?.length){
          // setOrgData(data.data?.['ORG'])
          setValueGroup(data.data?.[type]?.[0]?.key);
          setItemValue(data.data?.[type]?.[0]);
          setItemKey(type);
          getUserList(data.data?.[type]?.[0], type, 1,()=>{setDefaultUserList(actId,bizData)})
        }
        if(!type||!data?.data?.[type]?.length){//无组或者组内无数据
          dispatch({
            type: 'choiceUser/getDefaultList',
            payload: {
              bizTaskId,
              actId: actId,
              userType: 'HANDLER',
              choreographyFlag,
              choreographyOrgId,
            },            
          })
          // setDefaultUserList(actId,bizData)
        }
      }
    });

  }
  // 安装使用 js-pinyin 插件，获取待处理字段的拼音
  // const pinyin = require('js-pinyin');
  // searchUserList.map((item) => {
  //   item.pinyin = pinyin.getFullChars(item.userName);
  // });

  // let provice = {};
  // searchUserList.map((item) => {
  //   const Initials = item.pinyin[0].toUpperCase();
  //   // 如果对象里有当前字母项则直接 push 一个对象,如果没有则创建一个新的键并赋值;
  //   if (provice[Initials]) {
  //     provice[Initials].push(item);
  //   } else {
  //     provice[Initials] = [item];
  //   }
  // });
  // // 将数据转为数组，并按字母顺利排列
  // var filterData = [];
  // for (let key in provice) {
  //   const obj = { title: key, items: provice[key] };
  //   filterData.push(obj);
  // }
  // filterData.sort((a, b) => {
  //   return a.title.localeCompare(b.title);
  // });

  //搜索用户列表
  const updateUserList = (value) => {
    let newList = [];
    userList.map((item) => {
      if (item.userName?.includes(value)||item.checkerName?.includes(value)) {
        newList.push(item);
      }
    });
    dispatch({
      type: 'choiceUser/updateStates',
      payload: {
        searchUserList: newList,
      },
    });
  };

  //获取用户列表
  const getUserList = (item, key, start,nullCallback) => {
    if(start==1){
      document?.getElementById('scrollableDiv')?.scrollTo(0, 0)
    }
     function callback(list){
      // if(list.length==0){
      //   nullCallback&&nullCallback()
      // }
      setScreenVisible(false);
    }
    if(item.nodeType == 'ORG' || item.nodeType == 'DEPT'){
      let orgId = item.nodeId;
      setLoadingType('choiceUser/queryUser')
      dispatch({
          type: 'choiceUser/queryUser',
          payload:{
              start:start,
              limit:15,
              orgId,
              type: item.subordinate?'SELF_AND_CHILD':'SELF'
          },
          callback,
      })
    }else if(item.nodeType == 'POST'){
      setLoadingType('choiceUser/getPostUserList')
      dispatch({
        type:"choiceUser/getPostUserList",
        payload:{
          postId:item.nodeId,
          start:1,
          limit:15,
        },
        callback
      })
    }else if(item.nodeType == 'USER_GROUP'){
      setLoadingType('choiceUser/getGroupUserList')
      dispatch({
        type:"choiceUser/getGroupUserList",
        payload:{
          usergroupId:item.nodeId,
        },
        callback
      })
    }else if(item.nodeType == 'ROLE'){
      debugger
      setLoadingType('choiceUser/getRoleUserList')
      dispatch({
        type:"choiceUser/getRoleUserList",
        payload:{
          roleId:item.nodeId,
        },
        callback
      })
    }else if(item.nodeType == 'GLOBAL_CHECKER'){
      setLoadingType('choiceUser/getGlobalCheckerList')
      const idArr=item.nodeId.split('_')
      dispatch({
        type:"choiceUser/getGlobalCheckerList",
        payload:{
          targetIdentityId:idArr&&idArr[0],
          globalCheckerId:idArr&&idArr[1]
        },
        callback
      })
    }else if(item.nodeType == 'CUSTOM'){
      setLoadingType('choiceUser/getCustomUserList')
      dispatch({
        type:"choiceUser/getCustomUserList",
        payload:{
          bizInfoId:bizInfo.bizInfoId,
          actId:bizInfo.actId,
          customEventId:item.eventId
        },
        callback
      })
    }
    // switch (key) {
    //   case 'ORG':
    //     dispatch({
    //       type: 'choiceUser/queryUser',
    //       payload: {
    //         start,
    //         limit: 24,
    //         orgId: item?.nodeId,
    //       },
    //       callback: () => {
    //         setScreenVisible(false);
    //       },
    //     });
    //     break;
    //   case 'ROLE':
    //     dispatch({
    //       type: 'choiceUser/getRoleUserList',
    //       payload: {
    //         roleId: item.nodeId,
    //       },
    //       callback: () => {
    //         setScreenVisible(false);
    //       },
    //     });
    //     break;
    //   case 'CUSTOM':
    //     dispatch({
    //       type: 'choiceUser/getCustomUserList',
    //       payload: {
    //         bizInfoId: bizInfo.bizInfoId,
    //         actId: bizInfo.actId,
    //         customEventId: item.eventId,
    //       },
    //       callback: () => {
    //         setScreenVisible(false);
    //       },
    //     });
    //     break;
    //   default:
    //     break;
    // }
  };

  const screenProps={
    dispatch,
    groupData,
    valueGroup,
    setValueGroup,
    screenVisible,
    setScreenVisible,
    itemKey,
    setItemKey,
    itemValue,
    setItemValue,
    getUserList
  }
  const bottomActProps = {
    dispatch,
    bizTaskNodes,
    checkedAct,
    actVisible,
    setCheckedAct,
    currentAct,
    setCurrentAct,
    setDealStrategy,
    getGroupList,
    setValue,
    taskActList,
    setActVisible,
    value
  }
  const userListProps = {
    dispatch,
    setActVisible,
    checkedAct,
    bizTaskNodes,
    taskActList,
    setLoadingType,
    searchUserList,
    setValue,
    value,
    dealStrategy,
    currentAct,
    getUserList,
    returnCount,
    itemValue,
    currentPage,
    bizTaskId,
    commentList,
    // isMessage,
    category
  }
  return (
    <Spin spinning={loading.effects[loadingType]}>
    <div className={styles.container}>
      {<FloatingBubble
        magnetic='x'
        style={{
          '--background':'var(--ant-primary-color)',
          '--border-radius': '3.57rem 0 0 3.57rem',
          '--size': '2.79rem',
          '--initial-position-right': '0rem',
          '--initial-position-top': '3.43rem',
          '--height-size': '1.75rem',
        }}
        onClick={onBack}
      >
        返回
      </FloatingBubble>}
      <SideScreen {...screenProps}/>
      <BottomAct {...bottomActProps}/>
      <div className={styles.search_header}>
        <SearchBar
          placeholder="请输入人员名称"
          className={styles.search}
          onSearch={updateUserList.bind(this)}
          onClear={updateUserList.bind(this, '')}
        />
        <a
          className={styles.screen}
          onClick={() => {
            setScreenVisible(true);
          }}
        >
          筛选
        </a>
      </div>
      <UserList {...userListProps}/>
    </div>
    </Spin>
  );
}
export default connect(({ choiceUser, loading }) => {
  return { choiceUser, loading };
})(Index);
