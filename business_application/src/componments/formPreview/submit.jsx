/**表单送交弹框页的办理人及阅办人的选择页面 */
import { connect } from 'dva';
import React, { useState,useRef,useEffect} from 'react';
import {Input,message,Tabs,Tree,Search,Spin,Checkbox,Space,Tag} from 'antd';
import {Button} from '@/componments/TLAntd';
import GlobalModal from '../GlobalModal/index';
import styles from './submit.less';
import MiddleWaitData from '../relevanceModal/middleWaitData';
import RightSelectData from '../relevanceModal/rightSelectData';
import {renderCol} from '../relevanceModal/columns';
import ReSizeLeftRightCss from '../public/reSizeLeftRight';
import classnames from 'classnames';
import { ApartmentOutlined,AppstoreOutlined,BankOutlined,UserOutlined,BarsOutlined,CloseOutlined} from '@ant-design/icons';
const TabPane=Tabs.TabPane;
//一级分组
const GROUPTYPE=[
  {
    nodeId:"ORG",
    nodeName:'从组织机构'
  },
  {
    nodeId:"ROLE",
    nodeName:'用户组/岗位/角色'
  },
  {
    nodeId:"CUSTOM",
    nodeName:'自定义组'
  },
]
const  loopTree = (array)=>{
  console.log('array=',array);
  for(var i=0;i<array.length;i++){
    array[i]['title'] = array[i]['nodeName'];
    array[i]['key'] = array[i]['key'];
    array[i]['value'] = array[i]['nodeId'];
    array[i]['isLeaf']=array[i]['isHaveChild']||array[i]['isParent']=='1'?false:true;//应为搜索和展开是两个不同的接口返回的数据不同
    if(array[i].children&&typeof array[i].children!='undefined'&&array[i].children.length!=0){
      array[i].children = loopTree(array[i].children)
    }else{
      array[i].children=[];
    }
  }
  return array
}
function Submit({form,dispatch,loading,onCancel,save,state,setState,targetKey}){
    const {bizInfo,treeData,expandedKeys,userList,selectNodeUser,checkList,userType,
      groupActiveKey,searchUserList,searchTreeWord,selectedTreeKey,
      selectUserActId,selectDealStrategy,groupData} = state;
    useEffect(()=>{
      // console.log('oldSelectNodeUser=',oldSelectNodeUser);
      //获取用户 信息
      if(checkList.length){
        dispatch({
          type: `formShow/getUsersByIds`,
          payload:{
            identityIds:checkList,
            userType:userType,
            start:1,
            limit:1000
          },
          callback:(selectNodeUser)=>{
            setState({
              selectNodeUser
            })
          }
        })
      }
    },[])
    function tabCallback(key) {
      //通过key获取当前的组信息
      let currentInfo = groupData?.[key]||[];
      console.log('currentInfo=',currentInfo);
      setState({
        groupActiveKey:key,
        treeData:_.cloneDeep(currentInfo),//更新treeData
        userList:[],
        expandedKeys:[],
        searchTreeWord:'',
        selectedTreeKey:'',
        searchUserList:[],
        searchUserWord:''
      })
    }
    function onExpand(expandedKeys, {expanded, node}){
      expandedKeys.push(node.key)
      if(expanded){
        setState({
          expandedKeys: Array.from(new Set(expandedKeys)),
        })
        //获取子集
        dispatch({
          type: 'formShow/getSubordinateSendTree',
          payload:{
              bizInfoId:bizInfo.bizInfoId,
              bizSolId:bizInfo.bizSolId,
              procDefId:bizInfo.procDefId,
              formDeployId:bizInfo.formDeployId,
              actId:selectUserActId,
              nodeId: node.nodeId,
              nodeType:node.nodeType,
              subordinate:node.subordinate,
              nodeName:node.nodeName,
              nodeKey:node.key,
              userType
          },
          callback:(treeData)=>{
            setState({
              treeData
            })
          },
          state:state
        })
      }else{
        let arr = [];
        arr.push(node)
        loop(arr,expandedKeys)
      }
    }
    console.log('treedata====',treeData);
    function loop(arr,expandedKeys){
      arr.forEach(function(item,i) {
        expandedKeys.forEach(function(policy,j) {
          if(policy == item.key){
            expandedKeys.splice(j, 1)
          }
        });
        if(item.children&&item.children.length!=0){
          loop(item.children,expandedKeys)
        }
      });
      console.log('expandedKeys==',expandedKeys);
      setState({
        expandedKeys
      })
    }
    const onSelect = (selectedKeys, {selected,node}) => {
      console.log('node===',node);
      if(selected){
        setState({
          selectedTreeKey:node.nodeId
        })
        if(node.nodeType == 'ORG' || node.nodeType == 'DEPT'){
          let orgId = node.nodeId;
          //let deptId = node.nodeType == 'DEPT' ? node.nodeId : '';
          dispatch({
              type: 'formShow/queryUsersNoRule',
              payload:{
                  start:1,
                  limit:1000,
                  orgId,
                  //deptId
              },
              callback:(list)=>{
                setState({
                  userList: list,
                  searchUserList:list,
                  originalData:list, //用于传阅
                  oldOriginalData:list,
                })
              }
          })
        }else if(node.nodeType == 'POST'){
          dispatch({
            type:"formShow/getPostUserList",
            payload:{
              postId:node.nodeId,
              start:1,
              limit:10000
            },
            callback:(list)=>{
              setState({
                userList:list,
                searchUserList:list,
              })
            }
          })
        }else if(node.nodeType == 'USER_GROUP'){
          dispatch({
            type:"formShow/getGroupUserList",
            payload:{
              usergroupId:node.nodeId,
            },
            callback:(list)=>{
              setState({
                userList:list,
                searchUserList:list,
              })
            }
          })
        }else if(node.nodeType == 'ROLE'){
          dispatch({
            type:"formShow/getRoleUserList",
            payload:{
              roleId:node.nodeId,
            },
            callback:(list)=>{
              setState({
                userList: list,
                searchUserList:list,
              })
            }
          })
        }else if(node.nodeType == 'GLOBAL_CHECKER'){
          const idArr=node.nodeId.split('_')
          dispatch({
            type:"formShow/getGlobalCheckerList",
            payload:{
              targetIdentityId:idArr&&idArr[0],
              globalCheckerId:idArr&&idArr[1]
            },
            callback:(list)=>{
              setState({
                userList: list,
                searchUserList:list,
              })
            }
          })
        }else if(node.nodeType == 'CUSTOM'){
          dispatch({
            type:"formShow/getCustomUserList",
            payload:{
              bizInfoId:bizInfo.bizInfoId,
              actId:bizInfo.actId,
              customEventId:node.eventId
            },
            callback:(list)=>{
              setState({
                userList: list,
                searchUserList:list,
              })
            }
          })
        }
      }
    };
    function onCheckChange(newSelectIds,newSelectedUsers) {
      setState({
        selectNodeUser:newSelectedUsers,
        checkList:newSelectIds
      })
    }
    function removeOnClick(idValue,idKey){
      if(idValue){
        checkList.splice(checkList.indexOf(idValue),1);
        let newSelectedDatas = selectNodeUser.filter(item=>item[idKey]!=idValue);
        setState({
          selectNodeUser:newSelectedDatas,
          checkList:checkList
        })
      }else{
        setState({
          selectNodeUser:[],
          checkList:[]
        })
      }
    }
    function onCancel(){
      setState({
        submitModal:false
      })
    }
    //搜索用户列表
    function updateUserList(value){
      let newList = [];
      userList.map((item)=>{
        if(item.userName.includes(value)){
          newList.push(item)
        }
      })
      setState({
        searchUserList:newList
      })
    }
    console.log('selectNodeUser=',selectNodeUser);
    // console.log('oldSelectNodeUser=',oldSelectNodeUser);
    //搜索单位树
    function searchOrgTree(value){
      if(value){
        if(groupActiveKey=='ORG'){
          //获取nodeIds的集合
          let nodeIdsAndSub = [];
          groupData['ORG'].map((item)=>{
            nodeIdsAndSub.push({
              nodeId:item.nodeId,
              subordinate:item.subordinate
            })
          })
          dispatch({
            type:"formShow/getSearchSendTree",
            payload:{
              nodeIdsAndSub:JSON.stringify(nodeIdsAndSub),
              nodeType:'',
              searchWord:value
            },
            callback:(treeData)=>{
              setState({
                treeData
              })
            }
          })
        }else{
          let searchTreeData = [];
          treeData.map((item)=>{
            if(item.nodeName.includes(value)){
              searchTreeData.push(item);
            }
          })
          setState({
            treeData:searchTreeData
          })
        }
      }else{//清空
        let newTreeData = groupData[groupActiveKey];
        setState({
          treeData:newTreeData
        })
      }
      setState({
        expandedKeys:[],
      })
    }
    function changeSearchTreeWord(e){
      setState({
        searchTreeWord:e.target.value
      })
    }
    function leftRender(){
      console.log('treeData=',treeData);
      let loopTreeData = treeData&&treeData.length?loopTree(_.cloneDeep(treeData)):[];
      return (
        <div className={styles.left_org_tree}>
          <Input.Search
            onSearch={searchOrgTree}
            allowClear
            value={searchTreeWord}
            onChange={changeSearchTreeWord}
            style={{padding:'0px 8px 8px 8px'}}
          />
          <div className={groupActiveKey=='ORG'?styles.tree_warp:classnames(styles.tree_warp,styles.no_icon_tree)}>
            <Tree
                titleRender={(node)=><span key={node.key} className={styles.tree_node}>
                {
                node.nodeType=='DEPT'&&groupActiveKey=='ORG'?
                <ApartmentOutlined style={{marginRight:5}}/>:
                node.nodeType=='ORG'&&groupActiveKey=='ORG'?
                <BankOutlined style={{marginRight:5}}/> :
                node.nodeType=='POST'&&groupActiveKey=='ORG'?
                <AppstoreOutlined style={{marginRight:5}}/> :
                node.nodeType=='USER'&&groupActiveKey=='ORG'?
                <UserOutlined style={{marginRight:5}}/>:''
                }
                {titleRender(node.title)}
                </span>}
                treeData={loopTreeData}
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                checkStrictly={true}
                key={"nodeId"}
                showLine={{showLeafIcon: true}}
                showIcon={true}
                onSelect={onSelect}
            />
          </div>
        </div>
      )
    }
    //渲染tree标题
    function titleRender(title){
      let index = -1;
      let beforeStr = '';
      let afterStr = '';
      if(searchTreeWord){
        index = title.indexOf(searchTreeWord);
        beforeStr = title.substr(0, index);
        afterStr = title.substr(index + searchTreeWord.length);
      }else{
        index = -1;
      }
      const newTitle =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{background:"#ffeb75"}}>{searchTreeWord}</span>
            {afterStr}
          </span>
        ) : (
          <span>
            {title}
          </span>
        );
        return newTitle;
    }
        return (
            <GlobalModal
                visible={true}
                widthType={3}
                title='请选择'
                onCancel={onCancel}
                mask={false}
                maskClosable={false}
                getContainer={() =>{
                    return document.getElementById(`formShow_container_${targetKey}`)
                }}
                bodyStyle={{overflow:'hidden'}}
                footer={[
                    <Button key="cancel" onClick={onCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={save}>保存</Button>
                ]}
                className={styles.submit_warp}
            >
                <div className={styles.submitWrap}>
                    <Tabs activeKey={groupActiveKey} onChange={tabCallback}>
                      {GROUPTYPE.map((item,index)=>{
                        if(groupData[item.nodeId]?.length){
                          return (
                            <TabPane tab={item.nodeName} key={item.nodeId} style={{margin:'0 10px'}}>
                            </TabPane>
                          )
                        }
                      })}
                    </Tabs>
                      <ReSizeLeftRightCss
                        height={'calc(100% - 46px)'}
                        leftChildren={leftRender()}
                        isShowRight={true}
                        suffix={'send_submit'}
                        rightChildren={
                          <ReSizeLeftRightCss
                            height={'100%'}
                            isShowRight={true}
                            level={2}
                            suffix={'send_submit'}
                            leftChildren={<MiddleWaitData
                              originalData={searchUserList}
                              selectIds={checkList}
                              searchWordFn={updateUserList}
                              updateSelectIdsFn={onCheckChange}
                              selectedDatas={selectNodeUser}
                              idKey="identityId"
                              nameKey="userName"
                              selectedNodeId={selectedTreeKey}
                              searchWordHint="请输入姓名"
                              selectButtonType={selectDealStrategy == '1'?"radio":'checkBox'}
                              isShowTitle={false}
                              postName="postName"
                            />}
                            rightChildren={<RightSelectData
                                selectedDatas={JSON.parse(JSON.stringify(selectNodeUser))}
                                idKey="identityId"
                                nameKey="userName"
                                columns={renderCol('USER',removeOnClick)}
                                closeTag={removeOnClick}
                                isShowTitle={false}
                              />
                              }
                            />
                        }
                      />
                    </div>
        </GlobalModal>
        )

  }


  export default connect(({formShow,loading})=>{return {formShow,loading}})(Submit);
