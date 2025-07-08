import { useEffect, useState, useMemo, useRef } from 'react';
import styles from './index.less';
import { history, MicroAppWithMemoHistory, connect } from 'umi';
import { useSetState } from 'ahooks';
import './index.less';
import * as dd from 'dingtalk-jsapi';
import { Checkbox, Spin, Divider } from 'antd';
import {
  SearchBar,
  Space,
  IndexBar,
  List,
  Footer,
  Popup,
  Toast,
  Button,
  PullToRefresh
} from 'antd-mobile/es';
import {
  CheckOutline,
  CloseOutline,
  AaOutline,
  UpOutline,
} from 'antd-mobile-icons';
import { USER_SCREEN_TYPE } from '../../../service/constant';
import InfiniteScroll from 'react-infinite-scroll-component';
import { parse } from 'query-string';
function Index({ dispatch, location, choiceUser }) {
  const indexBarRef = useRef(null);
  const [value, setValue] = useState([]);
  const [valueGroup, setValueGroup] = useState(groupData?.['ORG']?.[0]?.nodeId||groupData?.['ROLE']?.[0]?.nodeId||groupData?.['CUSTOM']?.[0]?.nodeId);
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
  } = choiceUser;
  const [itemValue, setItemValue] = useState(groupData?.['ORG']?.[0]||groupData?.['ROLE']?.[0]||groupData?.['CUSTOM']?.[0]);
  const query = parse(history.location.search);
  const { bizTaskId, bizInfoId, actId } = query;
  const bizInfo = JSON.parse(localStorage.getItem('bizInfo') || '{}');
  const actData = JSON.parse(localStorage.getItem('actData') || '{}');
  const commentJson = JSON.parse(localStorage.getItem('commentJson') || '[]');
  // const commentJson = localStorage.getItem('commentJson');
  const submitSecurityId = localStorage.getItem('submitSecurityId') || '';
  const cutomHeaders = JSON.parse(localStorage.getItem('cutomHeaders') || '{}');
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
  }, []);
  //加载更多
  function loadMore() {
    getUserList(itemValue, itemKey, Number(currentPage) + 1);
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
    if (bizTaskId) {
      dispatch({
        type: 'choiceUser/getTaskDealNode',
        payload: {
          bizTaskId,
        },
        callback: (list, data) => {
          if (data?.actType == 'endEvent') {
            getGroupList(data?.actId,data?.choreographyFlag,data?.choreographyOrgId)
          } else {
            setDealStrategy(list?.[0]?.dealStrategy)
            getGroupList(list?.[0]?.actId,list?.[0]?.choreographyFlag,list?.[0]?.choreographyOrgId)
            list?.[0]?.handlerId!='null'&&list?.[0]?.handlerId!=null&&setValue(list?.[0]?.handlerId?.split(','))
          }
        }
      });
    } else {
      dispatch({
        type: 'choiceUser/getProcessStartNode',
        payload: {
          bizInfoId: bizInfo.bizInfoId,
          actId: bizInfo.actId,
        },
        callback: (list, data) => {
          if (data?.actType == 'endEvent') {
            getGroupList(data?.actId,data?.choreographyFlag,data?.choreographyOrgId)
          } else {
            setDealStrategy(list?.[0]?.dealStrategy)
            getGroupList(list?.[0]?.actId,list?.[0]?.choreographyFlag,list?.[0]?.choreographyOrgId)
            setValue(list?.[0]?.handlerId)

          }
        }
      });
    }

  }, []);
  const getGroupList = (actId,choreographyFlag,choreographyOrgId) => {
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
        if(data.data?.['ORG']?.length){
          // setOrgData(data.data?.['ORG'])
          setValueGroup(data.data?.['ORG']?.[0]?.nodeId);
          setItemValue(data.data?.['ORG']?.[0]);
          setItemKey('ORG');
          getUserList(data.data?.['ORG']?.[0], 'ORG', 1)
        }else{
          Object.keys(data.data)?.map((key,index,)=>{
            if(index==0){

            }
            data.data?.[key]
          })
        }
      },
      // callback:function(){
      //     dispatch({
      //         type:'choiceUser/updateStates',
      //         payload:{
      //             submitModal:true,
      //             selectUserActId:actId,
      //             selectDealStrategy:dealStrategy
      //         }
      //     })
      // }
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
  const nodeFlag = taskActList.findIndex((item) => {
    return item.isChecked;
  });
  // console.log('nodeFlag', nodeFlag, taskActList);
  // const chipsLinkData = [
  //   {
  //     code: 'node',
  //     text: (
  //       <div className={styles.footer_item}>
  //         <AaOutline className={styles.footer_item_icon} />
  //         <br />
  //         {nodeFlag != -1 ? taskActList[nodeFlag]?.actName : '节点'}
  //       </div>
  //     ),
  //     type: 'link',
  //   },
  //   {
  //     code: 'send',
  //     text: (
  //       <div className={styles.footer_item}>
  //         <AaOutline className={styles.footer_item_icon} />
  //         <br />
  //         送交
  //       </div>
  //     ),
  //     type: 'link',
  //   },
  // ];

  //送交
  function onSend() {
    var flag = taskActList.findIndex((item) => {
      return item.isChecked;
    });
    // var index = taskActList.findIndex((item) => {
    //   return item.handlerId;
    // });
    var list = taskActList.filter((item) => { return item.handlerId })
    if (flag == -1 && bizTaskNodes.actType != 'endEvent') {
      Toast.show({
        icon: 'fail',
        content: '请选择送交环节',
      });
      return;
    }
    if (list.length == 0 && bizTaskNodes.actType != 'endEvent') {
      // if (index == -1 && bizTaskNodes.actType != 'endEvent') {
      Toast.show({
        icon: 'fail',
        content: '请选择送交人',
      });
      return;
    }
    if(list.length == 0 && bizTaskNodes.actType == 'endEvent'){//结束节点
      list = taskActList
    }
    if ((bizTaskNodes.actType == 'parallelGateway'||bizTaskNodes?.checkAll) && list.length != taskActList.length) {//互斥只能选1个 并行必须全选 包容至少选一个
      var index = taskActList.findIndex((item) => {
        return !item.handlerId;
      });
      Toast.show({
        icon: 'fail',
        content: `${taskActList[index].actName}节点尚未选择送交人`,
      });
      return;
    }
    let isError = false;
    let targetActJson = {};
    targetActJson.actId = bizTaskNodes.actId;
    targetActJson.actName = bizTaskNodes.actName;
    targetActJson.actType = bizTaskNodes.actType;
    targetActJson.flowTaskActList = [];
    list.map((item) => {
      // delete item['isChecked']
      let newItem = item;
      delete item['isChecked'];
      targetActJson.flowTaskActList.push(newItem);
    });
    // if(bizTaskNodes.actType != 'endEvent' && isError){
    //     message.error('请选择主办人');
    //     return
    // }
    if (bizTaskId) {
      dispatch({
        type: 'choiceUser/processSend',
        payload: {
          bizTaskId: bizTaskId,
          // procDefId: bizInfo.procDefId,
          // bizSolId: bizInfo.bizSolId,
          // bizInfoId: bizInfo.bizInfoId,
          // targetActJson: JSON.stringify(targetActJson),
          // commentJsonArray: JSON.stringify(commentJson),
          // variableJson: JSON.stringify(actData),
          flowAct:targetActJson,
          commentList:commentJson,
          variableJson:actData,
          // formDataId: submitSecurityId,
          headers: cutomHeaders,
        },
        callback: function () {
          history.push({
            pathname: `/mobile/TODOList`,
          });
          // getRuleFn(dispatch,bizInfo,'',globalRule,nodeRule,ruleData,values,'afterSend').then(()=>{
          //   setFields([])
          //   dropScopeTab();
          // })
        },
      });
    } else {
      dispatch({
        type: 'choiceUser/processStart',
        payload: {
          procDefId: bizInfo.procDefId,
          bizSolId: bizInfo.bizSolId,
          bizInfoId: bizInfo.bizInfoId,
          flowAct:targetActJson,
          commentList:commentJson,
          // targetActJson: JSON.stringify(targetActJson),
          // commentJsonArray: JSON.stringify(commentJson),
          draftActId: bizInfo.actId,
          // variableJson: JSON.stringify(actData),
          variableJson: actData,
          formDataId: submitSecurityId,
          headers: cutomHeaders,
        },
        callback: function () {
          history.push({
            pathname: `/mobile/TODOList`,
          });
          // getRuleFn(dispatch,bizInfo,'',globalRule,nodeRule,ruleData,values,'afterSend').then(()=>{
          //   setFields([])
          //   dropScopeTab();
          // })
        },
      });
    }
  }
  //footer点击事件
  const onChipClick = (item, index) => {
    switch (item) {
      case 'node':
        setActVisible(true);
        break;
      case 'send':
        onSend();
        break;
      default:
        break;
    }
  };
  //搜索用户列表
  const updateUserList = (value) => {
    let newList = [];
    userList.map((item) => {
      if (item.userName.includes(value)) {
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

  //选择节点
  const onActClick = (item, index) => {
    setActVisible(false);
    if (bizTaskNodes.actType == 'endEvent') {
      getGroupList(bizTaskNodes.actId,bizTaskNodes?.choreographyFlag,bizTaskNodes?.choreographyOrgId)
      return
    }
    setDealStrategy(item.dealStrategy);
    getGroupList(item.actId,taskActList[index]?.choreographyFlag,taskActList[index]?.choreographyOrgId)
    if (taskActList[index]['isChecked']) {
      //已经是勾选状态不再做处理
      return;
    }
    setValue([])
    taskActList[index]['isChecked'] = true;
    taskActList.forEach((element, flag) => {
      if (element.actId != item.actId) {
        taskActList[flag]['isChecked'] = false;
        if ((bizTaskNodes.actType != 'parallelGateway' || bizTaskNodes.actType != 'inclusiveGateway') &&!bizTaskNodes.checkAll ) {//包容网关，并行网关 多个节点  并行网关 所有节点必须必须选择且有送交人
          //单选 清空其他组数据 (互斥网关单选节点)
          taskActList[flag]['handlerId'] = '';
          taskActList[flag]['handlerName'] = '';
          taskActList[flag]['handlerPicture'] = '';
          taskActList[flag]['readerId'] = '';
          taskActList[flag]['readerName'] = '';
        }
      }
    });
    taskActList[index]['handlerId'] &&
      setValue(taskActList[index]['handlerId'].split(','));

    dispatch({
      type: 'choiceUser/updateStates',
      payload: {
        taskActList,
      },
    });
  };

  //获取用户列表
  const getUserList = (item, key, start) => {
    if(item.nodeType == 'ORG' || item.nodeType == 'DEPT'){
      let orgId = item.nodeId;
      dispatch({
          type: 'choiceUser/queryUsers',
          payload:{
              start:1,
              limit:1000,
              orgId,
          },
          callback:(list)=>{
            setScreenVisible(false);
          }
      })
    }else if(item.nodeType == 'POST'){
      dispatch({
        type:"choiceUser/getPostUserList",
        payload:{
          postId:item.nodeId,
          start:1,
          limit:10000
        },
        callback:(list)=>{
          setScreenVisible(false);
        }
      })
    }else if(item.nodeType == 'USER_GROUP'){
      dispatch({
        type:"choiceUser/getGroupUserList",
        payload:{
          usergroupId:item.nodeId,
        },
        callback:(list)=>{
          setScreenVisible(false);
        }
      })
    }else if(item.nodeType == 'ROLE'){
      dispatch({
        type:"choiceUser/getRoleUserList",
        payload:{
          roleId:item.nodeId,
        },
        callback:(list)=>{
          setScreenVisible(false);
        }
      })
    }else if(item.nodeType == 'GLOBAL_CHECKER'){
      const idArr=item.nodeId.split('_')
      dispatch({
        type:"choiceUser/getGlobalCheckerList",
        payload:{
          targetIdentityId:idArr&&idArr[0],
          globalCheckerId:idArr&&idArr[1]
        },
        callback:(list)=>{
          setScreenVisible(false);
        }
      })
    }else if(item.nodeType == 'CUSTOM'){
      dispatch({
        type:"choiceUser/getCustomUserList",
        payload:{
          bizInfoId:bizInfo.bizInfoId,
          actId:bizInfo.actId,
          customEventId:item.eventId
        },
        callback:(list)=>{
          setScreenVisible(false);
        }
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

  //点击搜索项
  const onNode = (item, key) => {
    if (!item) {
      var type = ''
      if(groupData?.['ORG'].length!=0){
        type = 'ORG'
      }else if(groupData?.['ROLE'].length!=0){
        type = 'ROLE'
      }else if(groupData?.['CUSTOM'].length!=0){
        type = 'CUSTOM'
      }
      //重置 初始化查询条件
      setValueGroup(groupData?.[type]?.[0]?.nodeId);
      setItemValue(groupData?.[type]?.[0]);
      setItemKey(type);
      getUserList(groupData?.[type]?.[0], type, 1);
    } else {
      setValueGroup(item.nodeId);
      setItemValue(item);
      setItemKey(key);
    }
  };

  //选择人员
  const onChangeUser = (v) => {
    if (v.length > 1 && (dealStrategy == '1' || bizTaskNodes.actType == 'endEvent')) {
      Toast.show({
        icon: 'fail',
        content: '最多选择一个人员',
      });
      return;
    }
    var flag = taskActList.findIndex((item) => {
      return item.isChecked;
    });
    if (flag == -1) {
      Toast.show({
        icon: 'fail',
        content: '请先选择节点',
      });
      return;
    }
    var indexList = [];
    var indexNameList = [];
    searchUserList.forEach((item) => {
      if (v.toString().includes(item.identityId)) {
        indexList.push(item.identityId);
        indexNameList.push(item.userName);
      }
    });
    setValue(v);
    taskActList[flag]['handlerId'] = indexList.toString();
    taskActList[flag]['handlerName'] = indexNameList.toString();
    dispatch({
      type: 'choiceUser/updateStates',
      payload: {
        taskActList,
      },
    });
  };

  //取消人员选择
  const onClose = (identityId) => {
    var v = value.filter((item) => item != identityId);
    onChangeUser(v);
  };

  //流程节点渲染
  const returnAct = () => {
    return (
      <ul className={styles.list}>
        {bizTaskNodes.actType == 'endEvent' ? (
          <li onClick={onActClick.bind(this)}>
            <a>
              {bizTaskNodes.actName ? bizTaskNodes.actName : '结束节点'}
            </a>
            <span className={styles.icon_block}><CheckOutline className={styles.icon_check} /></span>

          </li>
        ) : (
          bizTaskNodes?.taskActList?.map((item, index) => {
            return (
              <li key={item.actId} onClick={onActClick.bind(this, item, index)}>
                <a>{item.actName}</a>
                <span className={styles.icon_block}>
                  {taskActList[index].isChecked ? (
                    <CheckOutline className={styles.icon_check} />
                  ) : (
                    ''
                  )}
                </span>
              </li>
            );
          })
        )}
      </ul>
    );
  };

  //右侧筛选项
  const returnScreen = () => {
    return (
      <>
        {Object.keys(USER_SCREEN_TYPE).map((key) => {
          const element = groupData[key];
          if (!element||element?.length == 0) {
            return;
          }
          return (
            <div className={styles.screen_container_list}>
              <h1 className={styles.screen_title}> {USER_SCREEN_TYPE[key]}</h1>
              {element.length != 0 && (
                <ul className={styles.screen_list}>
                  {element.length &&
                    element?.map((item, index) => (
                      <li
                        key={item.nodeId}
                        onClick={onNode.bind(this, item, key)}
                        className={
                          styles[
                          item.nodeId == valueGroup
                            ? 'screen_item_checked'
                            : 'screen_item'
                          ]
                        }
                      >
                        {item.nodeName}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          );
        })}
      </>
    );
  };
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
    return depIdeName ? `(${depIdeName})` : '';
  }
  return (
    <div className={styles.container}>
      <Popup
        position="right"
        visible={screenVisible}
        bodyStyle={{ width: '80%' }}
        onMaskClick={() => {
          setScreenVisible(false)
        }}
      >
        <div className={styles.screen_container}>{returnScreen()}</div>
        <div className={styles.screen_footer}>
          <Button
            onClick={() => {
              onNode();
            }}
          >
            重置
          </Button>
          <Button
            onClick={() => {
              getUserList(itemValue, itemKey, 1);
            }}
            type="primary"
          >
            确定
          </Button>
        </div>
      </Popup>
      <Popup
        position="bottom"
        visible={actVisible}
        // showCloseButton
        onClose={() => {
          setActVisible(false);
        }}
        onMaskClick={() => {
          setActVisible(false);
        }}
      >
        <div className={styles.act_container}>
          {/* <h1 className={styles.title}>环节名称</h1> */}
          {returnAct()}
        </div>
      </Popup>
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
      <div className={styles.search_check_list}>
        <Checkbox
          className="all_check"
          indeterminate={
            value.length > 0 && value.length < searchUserList.length
          }
          checked={value.length === searchUserList.length}
          onChange={(e) => {
            var indexList = [];
            var indexNameList = [];
            var flag = taskActList.findIndex((item) => {
              return item.isChecked;
            });
            if (flag == -1) {
              Toast.show({
                icon: 'fail',
                content: '请先选择节点',
              });
              return;
            }
            if (e.target.checked) {
              searchUserList.forEach((item) => {
                indexList.push(item.identityId);
                indexNameList.push(item.userName);
              });
              // setValue(indexList);
            } else {
              // setValue([]);
            }
            setValue(indexList);
            taskActList[flag]['handlerId'] = indexList.toString();
            taskActList[flag]['handlerName'] = indexNameList.toString();
            dispatch({
              type: 'choiceUser/updateStates',
              payload: {
                taskActList,
              },
            });
          }}
          disabled={dealStrategy == '1' || bizTaskNodes.actType == 'endEvent' ? true : false}
        >
          全选
        </Checkbox>

        <Checkbox.Group
          value={value}
          onChange={onChangeUser.bind(this)}
          style={{
            height: value.length
              ? `calc(100% - 6.86rem)`
              : `calc(100% - 3.43rem)`,
            overflow: 'auto',
            background: '#FFF',
          }}
          className={styles.checkgroup_container}

        >
          <PullToRefresh
            onRefresh={() => {
              getUserList(itemValue, itemKey, 1)
            }}
            id="scrollableDiv"
          >
            <InfiniteScroll
              dataLength={searchUserList.length}
              next={loadMore}
              hasMore={searchUserList?.length < returnCount}
              loader={<Spin className="spin_div" />}
              endMessage={
                searchUserList?.length == 0 ? (
                  ''
                ) : (
                  <span className="footer_more">没有更多啦</span>
                )
              }
              scrollableTarget="scrollableDiv"
            >
              {/* <IndexBar ref={indexBarRef}>
            {filterData?.map((group) => {
              const { title, items } = group;
              return (
                <IndexBar.Panel
                  index={title}
                  title={`${title}`}
                  key={`${title}`}
                > */}
              {searchUserList.map((item) => (
                <Checkbox key={item.value} value={item.identityId} disabled={bizTaskNodes.actType == 'endEvent'}>
                  <span className={styles.checkItemlabel}>
                    {/* <img className={styles.checkItemImg} src={item.picturePath} /> */}
                    {item.userName}
                    {showIdentity(item)}
                  </span>
                </Checkbox>
              ))}
              {/* <List>
                {items.map((item, index) => (
                  <List.Item key={index}>{item.label}</List.Item>
                ))}
              </List> */}
              {/* </IndexBar.Panel>
              );
            })}
          </IndexBar> */}
            </InfiniteScroll>
          </PullToRefresh>
        </Checkbox.Group>

        {value.length != 0 && (
          <div className={styles.checked_list}>
            <span className={styles.checked_list_at}>已选：</span>
            <ul className={styles.checked_list_container}>
              {value.map((v, index) => {
                var name = '';
                var index = bizTaskNodes?.taskActList.findIndex((item) => {
                    return item.handlerId == v;
                });
                if(index!=-1){
                  name = bizTaskNodes?.taskActList[index]?.handlerName
                }else{  
                  index = searchUserList.findIndex((item) => {
                  return item.identityId == v;
                  });
                  if(index!=-1){
                    name = searchUserList[index]?.userName
                  }else{//两个列表都找不到可能是多选
                    var checkedIndex = bizTaskNodes?.taskActList?.findIndex((item)=>{
                      return item.handlerId&&item.handlerId.includes(',')&&item.handlerName.includes(',')&&item.handlerId.includes(v)
                    })
                    var checkHandler = bizTaskNodes?.taskActList?.[checkedIndex]
                    var handlers = checkHandler.handlerId.split(',') || []
                    var handlerNames = checkHandler.handlerName.split(',') || []
                    index = handlers.findIndex((item) => {
                      return item == v;
                    });
                    name = handlerNames[index]                    
                  }
                }
                
                // if(searchUserList.length==0&&!groupData?.['ORG']){
                // if(searchUserList.length==0){
                    // var index = bizTaskNodes?.taskActList.findIndex((item) => {
                    //   return item.handlerId == v;
                    // });
                //     name = bizTaskNodes?.taskActList[index]?.handlerName
                // }else{
                //     var index = searchUserList.findIndex((item) => {
                //     return item.identityId == v;
                //     });
                //     name = searchUserList[index]?.userName
                // }
                return (
                  <li className={styles.checked_list_item}>
                    {/* <div className={styles.img_group}>
                       <img src={searchUserList[index]?.picturePath}></img>
                      <CloseOutline
                        className={styles.close}
                        onClick={onClose.bind(
                          this,
                          searchUserList[index]?.identityId,
                        )}
                      />
                    </div> */}

                    <i>{name}</i>
                    <CloseOutline
                      className={styles.close}
                      onClick={onClose.bind(
                        this,
                        v,
                      )}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      <div className={styles.send_footer}>
        <span onClick={onChipClick.bind(this, 'node')}>
          <UpOutline className={styles.footer_icon} />
          <b>{nodeFlag != -1 ? taskActList[nodeFlag]?.actName : bizTaskNodes.actType == 'endEvent' ? '结束节点' : '节点'}</b>
        </span>
        <Button onClick={onChipClick.bind(this, 'send')}>送交</Button>
      </div>
      {/* // <Footer
      //   chips={chipsLinkData}
      //   onChipClick={onChipClick}
      //   className={styles.footer}
      // ></Footer> */}
    </div>
  );
}
export default connect(({ choiceUser, loading }) => {
  return { choiceUser, loading };
})(Index);
