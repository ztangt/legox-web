import styles from '../index.less';
import { history, } from 'umi';
import '../index.less';
import { Checkbox, Spin, Divider } from 'antd';
import {
  Toast,
  Button,
  PullToRefresh,
} from 'antd-mobile/es';
import {
  CloseOutline,
  UpOutline,
} from 'antd-mobile-icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import empty_bg from '../../../../../public/assets/empty_bg.svg'
import user_header from '../../../../../public/assets/user_img.svg'

function Index({dispatch,setActVisible,checkedAct,bizTaskNodes,taskActList,setLoadingType,searchUserList,setValue,value,dealStrategy,currentAct,getUserList,returnCount,itemValue,itemKey,currentPage,bizTaskId,commentList,category}) {
  const bizInfo = JSON.parse(localStorage.getItem('bizInfo') || '{}');
  const actData = JSON.parse(localStorage.getItem('actData') || '{}');
  const commentJson = JSON.parse(localStorage.getItem('commentJson') || '[]');
  // const commentJson = localStorage.getItem('commentJson');
  const submitSecurityId = localStorage.getItem('submitSecurityId') || '';
  const cutomHeaders = JSON.parse(localStorage.getItem('cutomHeaders') || '{}');
  const nodeFlag = taskActList.findIndex((item) => {
    return item.actId==currentAct;
  });
    //加载更多
    function loadMore() {
      getUserList(itemValue, itemKey, Number(currentPage) + 1);
    }
    //footer点击事件
    const onChipClick = (item, index) => {
      switch (item) {
        case 'node':
          if(taskActList.length<=1){
            return
          }
          setActVisible(true);
          break;
        case 'send':
          onSend();
          break;
        default:
          break;
      }
    };
      //送交
  function onSend() {
    if (!checkedAct.length && bizTaskNodes.actType != 'endEvent') {
      Toast.show({
        icon: 'fail',
        content: '请选择送交环节',
      });
      setActVisible(true);
      return;
    }
    var list = taskActList.filter((item) => { return item.handlerId })
    var endList = taskActList.filter((item) => { return item.actType =='endEvent' })
    if (list.length == 0 && bizTaskNodes.actType != 'endEvent'&& taskActList?.[0]?.actType!='endEvent' && !checkedAct.toString().includes(endList?.[0]?.actId)) {//送交至结束节点都可不选人
      // if (index == -1 && bizTaskNodes.actType != 'endEvent') {
      Toast.show({
        icon: 'fail',
        content: '请选择主办人',
      });
      return;
    }
    if(list.length == 0 && (bizTaskNodes.actType == 'endEvent'|| taskActList?.[0]?.actType=='endEvent') || checkedAct.toString().includes(endList?.[0]?.actId)){//结束节点
      list = taskActList
    }  
    if ((bizTaskNodes.actType == 'parallelGateway'||bizTaskNodes?.checkAll) && list.length != taskActList.length) {//互斥网关只能选1个 并行网关必须全选 包容至少选一个
      var index = taskActList.findIndex((item) => {
        return !item.handlerId;
      });
      Toast.show({
        icon: 'fail',
        content: `${taskActList[index].actName}节点尚未选择主办人`,
      });
      return;
    }
    let targetActJson = {};
    targetActJson.actId = bizTaskNodes.actId;
    targetActJson.actName = bizTaskNodes.actName;
    targetActJson.actType = bizTaskNodes.actType;
    targetActJson.flowTaskActList = [];
    list.map((item) => {
      if(checkedAct.toString().includes(item.actId)){
        if(item.freeFlag){//已选节点为流转节点,设置节点信息参数为流转节点信息
          targetActJson.actId = item.actId;
          targetActJson.actName = item.actName;
          targetActJson.actType = item.actType;
        }
        targetActJson.flowTaskActList.push(item);
      }
    });
    if(targetActJson.flowTaskActList.length==0&&checkedAct.length!=0){
      Toast.show({
        icon: 'fail',
        content: `请选择主办人`,
      });
      return
    }
    if (bizTaskId) {
      setLoadingType('choiceUser/processSend')
      dispatch({
        type: 'choiceUser/processSend',
        payload: {
          bizTaskId: bizTaskId,
          flowAct:targetActJson,
          commentList:commentList,
          variableJson:actData,
          headers: cutomHeaders,
        },
        callback: function () {
          if(category=='MATTER'){
            history.push({
              pathname: `/mobile/MATTERMsgLIst`,
            });
          }else if(category=='SYS'){
            history.push({
              pathname: `/mobile/SYSMsgLIst`,
            });
          }else{
            history.push({
              pathname: `/mobile/TODOList`,
            });
          }
        },
      });
    } else {
      setLoadingType('choiceUser/processStart')
      dispatch({
        type: 'choiceUser/processStart',
        payload: {
          procDefId: bizInfo.procDefId,
          bizSolId: bizInfo.bizSolId,
          bizInfoId: bizInfo.bizInfoId,
          flowAct:targetActJson,
          commentList:commentList,
          draftActId: bizInfo.actId,
          variableJson: actData,
          formDataId: submitSecurityId,
          headers: cutomHeaders,
        },
        callback: function () {
          if(category=='MATTER'){
            history.push({
              pathname: `/mobile/MATTERMsgLIst`,
            });
          }else if(category=='SYS'){
            history.push({
              pathname: `/mobile/SYSMsgLIst`,
            });
          }else{
            history.push({
              pathname: `/mobile/TODOList`,
            });
          }
        },
      });
    }
  }
    //选择人员
    const onChangeUser = (v) => {
      if (v.length > 1 && (dealStrategy == '1' || bizTaskNodes.actType == 'endEvent')) {
        v = [v[v.length-1]]
        // Toast.show({
        //   icon: 'fail',
        //   content: '最多选择一个人员',
        // });
        // return;
      }
      var flag = taskActList.findIndex((item) => {
        return item.actId==currentAct;
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
          indexNameList.push(item.userName||item.checkerName);
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
  
  
    const showIdentity = (item) => {
      return item['postName']
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
    <>
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
          return item.actId==currentAct;
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
            indexNameList.push(item.userName||item.checkerName);
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
    {
      searchUserList.length==0?<div className={styles.empty_container}>
          <img src={empty_bg}/>暂无数据
      </div>: <Checkbox.Group
      id='scrollableDiv'
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
      >
        <InfiniteScroll
          dataLength={searchUserList.length}
          next={loadMore}
          hasMore={itemValue?.nodeType == 'ORG' || itemValue?.nodeType == 'DEPT' || itemValue?.nodeType == 'POST'?searchUserList?.length < returnCount:false}
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
            <Checkbox key={item.identityId} value={item.identityId} disabled={bizTaskNodes.actType == 'endEvent'}>
              <img className={styles.checkItemImg} src={item.picturePath||item.picPath||user_header} />
              <span className={styles.checkItemlabel}>
                <b>{item.userName||item.checkerName}</b>
                <b style={{color:'#666'}}>{showIdentity(item)}</b>
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
    }
    {value.length != 0 && (
      <div className={styles.checked_list}>
        <span className={styles.checked_list_at}>已选：</span>
        <ul className={styles.checked_list_container}>
          {value&&value?.map((v, index) => {
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
                name = searchUserList[index]?.userName || searchUserList[index]?.checkerName
                var postName = searchUserList[index]?.postName
                if(postName){
                  name = `${name}【${postName}】`
                }
              }
              else{//两个列表都找不到可能是多选
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
            {taskActList.length>1?<UpOutline className={styles.footer_icon} />:''}
            <b>{nodeFlag != -1 ? taskActList[nodeFlag]?.actName : bizTaskNodes.actType == 'endEvent' ? '结束节点' : '节点'}</b>
          </span>
          <Button onClick={onChipClick.bind(this, 'send')}>送交</Button>
        </div>
    </>
  );
}
export default Index;
