import { connect } from 'dva';
import React, { useState,useRef,useEffect} from 'react';
import { Modal, Input,Button,message,Tabs,Tree,Search,Spin,Checkbox,Space,Tag} from 'antd';
import { history } from 'umi';
import styles from './submit.less';
import MiddleWaitData from '../relevanceModal/middleWaitData';
import RightSelectData from '../relevanceModal/rightSelectData';
import {renderCol} from '../relevanceModal/columns';
import ReSizeLeftRightCss from '../public/reSizeLeftRightCss';
import { ApartmentOutlined,AppstoreOutlined,BankOutlined,UserOutlined,BarsOutlined,CloseOutlined} from '@ant-design/icons';
const TabPane=Tabs.TabPane;
const  loopTree = (array)=>{
  console.log('array=',array);
  for(var i=0;i<array.length;i++){
    array[i]['title'] = array[i]['nodeName'];
    array[i]['key'] = array[i]['nodeId'];
    array[i]['value'] = array[i]['nodeId'];
    array[i]['isLeaf']=array[i]['isHaveChild']||array[i]['isParent']=='1'?false:true;//应为搜索和展开是两个不同的接口返回的数据不同
    if(array[i].children&&typeof array[i].children!='undefined'&&array[i].children.length!=0){
      loopTree(array[i].children)
    }else{
      array[i].children=[];
    }
  }
  return array
}
function Submit({form,location,dispatch,formShow,loading,onCancel,save}){
    const bizSolId = location.query.bizSolId;
    const bizInfoId = location.query.bizInfoId;
    const currentTab = location.query.currentTab;
    const {stateObj} = formShow;
    const {treeData,expandedKeys,userList,selectNodeUser,submitModal,checkList,bizInfo,userType,
      groupData,groupActiveKey,searchUserList,searchUserWord,firstGroupData,searchTreeWord,selectedTreeKey,
      selectUserActId,selectDealStrategy} = stateObj[bizSolId+'_'+bizInfoId+'_'+currentTab];
    useEffect(()=>{
      // console.log('oldSelectNodeUser=',oldSelectNodeUser);
      //获取用户 信息
      if(checkList.length){
        dispatch({
          type: `formShow/getUsersByIds`,
          payload:{
            orgRefUserIds:checkList,
            userType:userType
          }
        })
      }
      // else{
      //   //获取
      //   if(userType=='HANDLER'){
      //     checkIdsByUser(oldSelectNodeUser);
      //     dispatch({
      //       type:"formShow/updateStates",
      //       payload:{
      //         selectNodeUser:_.cloneDeep(oldSelectNodeUser)
      //       }
      //     })
      //   }else{
      //     checkIdsByUser(oldReaderSelectNodeUser);
      //     dispatch({
      //       type:"formShow/updateStates",
      //       payload:{
      //         selectNodeUser:_.cloneDeep(oldReaderSelectNodeUser)
      //       }
      //     })
      //   }
      // }
    },[])
    // //通过选中的用户列表获取选中的id
    // function checkIdsByUser(selectNodeUser){
    //   let checkList = [];
    //   selectNodeUser.map((item)=>{
    //     checkList.push(item.orgRefUserId)
    //   })
    //   dispatch({
    //     type:"formShow/updateStates",
    //     payload:{
    //       checkList
    //     }
    //   })
    // }
    // console.log('checkList=',checkList);
    function tabCallback(key) {
      //通过key获取当前的组信息
      let currentInfo = groupData[key];
      console.log('currentInfo=',currentInfo);
      dispatch({
        type:"formShow/updateStates",
        payload:{
          groupActiveKey:key,
          treeData:currentInfo,//更新treeData
          userList:[],
          expandedKeys:[],
          searchTreeWord:'',
          selectedTreeKey:'',
          searchUserList:[],
          searchUserWord:''
        }
      })
    }
    function onExpand(expandedKeys, {expanded, node}){
      expandedKeys.push(node.key)
      if(expanded){
        dispatch({
          type: 'formShow/updateStates',
          payload:{
            expandedKeys: Array.from(new Set(expandedKeys)),
          }
        })
        //if(node.subordinate){ //当前点击节点为父节点  获取下一级数据
          dispatch({
            type: 'formShow/getSendUserTree',
            payload:{
                bizInfoId:bizInfo.bizInfoId,
                bizSolId:bizInfo.bizSolId,
                procDefId:bizInfo.procDefId,
                formDeployId:bizInfo.formDeployId,
                actId:selectUserActId,
                nodeId: node.nodeId,
                nodeType:node.nodeType,
                subordinate:firstGroupData[groupActiveKey].subordinate,
                nodeName:node.nodeName,
                userType
            }
          })
        //}
      }else{
        let arr = [];
        arr.push(node)
        loop(arr,expandedKeys)
      }
    }
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
      dispatch({
        type: 'formShow/updateStates',
        payload:{
          expandedKeys
        }
      })
    }
    const onSelect = (selectedKeys, {selected,node}) => {
      if(selected){
        dispatch({
          type:'formShow/updateStates',
          payload:{
            selectedTreeKey:node.nodeId
          }
        })
        if(node.nodeType == 'ORG' || node.nodeType == 'DEPT'){
          let orgId = node.nodeType == 'ORG' ? node.nodeId : '';
          let deptId = node.nodeType == 'DEPT' ? node.nodeId : '';
          dispatch({
              type: 'formShow/queryUsers',
              payload:{
                  start:1,
                  limit:1000,
                  orgId,
                  deptId
              }
          })
        }else if(node.nodeType == 'POST'){
          dispatch({
            type:"formShow/getPostUserList",
            payload:{
              postId:node.nodeId,
            }
          })
        }else if(node.nodeType == 'USER_GROUP'){
          dispatch({
            type:"formShow/getGroupUserList",
            payload:{
              usergroupId:node.nodeId,
            }
          })
        }else if(node.nodeType == 'ROLE'){
          dispatch({
            type:"formShow/getRoleUserList",
            payload:{
              roleId:node.nodeId,
            }
          })
        }
      }
    };
    function onCheckChange(newSelectIds,newSelectedUsers) {
      dispatch({
        type: 'formShow/updateStates',
        payload:{
          selectNodeUser:newSelectedUsers,
          checkList:newSelectIds
        }
      })
    }
    function removeOnClick(idValue,idKey){
      if(idValue){
        checkList.splice(checkList.indexOf(idValue),1);
        let newSelectedDatas = selectNodeUser.filter(item=>item[idKey]!=idValue);
        dispatch({
          type: 'formShow/updateStates',
          payload:{
            selectNodeUser:newSelectedDatas,
            checkList:checkList
          }
        })
      }else{
        dispatch({
          type: 'formShow/updateStates',
          payload:{
            selectNodeUser:[],
            checkList:[]
          }
        })
      }
    }
    function onCancel(){
      dispatch({
        type: 'formShow/updateStates',
        payload:{
          submitModal:false
        }
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
      dispatch({
        type:"formShow/updateStates",
        payload:{
          searchUserList:newList
        }
      })
    }
    console.log('selectNodeUser=',selectNodeUser);
    // console.log('oldSelectNodeUser=',oldSelectNodeUser);
    //搜索单位树
    function searchOrgTree(value){
      console.log('firstGroupData[groupActiveKey]=',firstGroupData[groupActiveKey]);
      dispatch({
        type:"formShow/getSearchSendTree",
        payload:{
          nodeIds:firstGroupData[groupActiveKey].nodeId,
          nodeType:firstGroupData[groupActiveKey].nodeType.split(',')[0],
          subordinate:firstGroupData[groupActiveKey].subordinate?1:0,
          searchWord:value
        }
      })
    }
    function changeSearchTreeWord(e){
      dispatch({
        type:"formShow/updateStates",
        payload:{
          searchTreeWord:e.target.value
        }
      })
    }
    function leftRender(){
      console.log('treeData=',treeData);
      return (
        <div style={{marginTop:'12px'}}>
          <Input.Search
            onSearch={searchOrgTree}
            allowClear
            value={searchTreeWord}
            onChange={changeSearchTreeWord}
            style={{marginBottom:'10px'}}
          />
          <Tree
              titleRender={(node)=><span key={node.key} className={styles.tree_node}>
              {
              node.nodeType=='DEPT'?
              <ApartmentOutlined style={{marginRight:5}}/>:
              node.nodeType=='ORG'?
              <BankOutlined style={{marginRight:5}}/> :
              node.nodeType=='POST'?
              <AppstoreOutlined style={{marginRight:5}}/> :
              node.nodeType=='USER'?
              <UserOutlined style={{marginRight:5}}/>:''
              }
              {titleRender(node.title)}
              </span>}
              treeData={loopTree(treeData)}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              checkStrictly={true}
              key={loading.global}
              showLine={{showLeafIcon: true}}
              showIcon={true}
              onSelect={onSelect}
              selectedKeys={[selectedTreeKey]}
           />
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
            <Modal
                visible={true}
                width={'95%'}
                title='请选择'
                onCancel={onCancel}
                mask={false}
                maskClosable={false}
                getContainer={() =>{
                    return document.getElementById('formShow_container')
                }}
                footer={[
                    <Button key="cancel" onClick={onCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={save}>保存</Button>
                ]}
                className={styles.submit_warp}
            >
                <div className={styles.submitWrap}>
                    <Tabs activeKey={groupActiveKey} onChange={tabCallback}>
                      {firstGroupData.map((item,index)=>{
                        return (
                          <TabPane tab={item.nodeName} key={index} style={{margin:'0 10px'}}>
                          </TabPane>
                        )
                      })}
                    </Tabs>
                      <ReSizeLeftRightCss
                        lineStyle={{top:'-22px'}}
                        leftChildren={leftRender()}
                        rightChildren={
                          <ReSizeLeftRightCss
                          lineStyle={{top:'-22px'}}
                          leftChildren={<MiddleWaitData
                            originalData={searchUserList}
                            selectIds={checkList}
                            searchWordFn={updateUserList}
                            updateSelectIdsFn={onCheckChange}
                            selectedDatas={selectNodeUser}
                            idKey="identityId"
                            nameKey="userName"
                            selectedNodeId={selectedTreeKey}
                            searchWordHint="姓名/账号"
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
        </Modal>
        )

  }


  export default connect(({formShow,loading})=>{return {formShow,loading}})(Submit);
