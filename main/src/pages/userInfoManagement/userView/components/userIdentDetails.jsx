import React, { useState, useEffect ,useRef} from 'react';
import { connect } from 'dva';
import { dataFormat } from '../../../../util/util';
import styles from './userIdentDetails.less';
import ReSizeLeftRight from '../../../../componments/public/reSizeLeftRight';
import LeavePostModal from './leavePostModal';
import { Tree, Table, Button, Input, Space, message, Switch } from 'antd';
import Itree from '../../../../componments/Tree';
import {replaceGTPU} from '../../../../util/util'
import ColumnDragTable from '../../../../componments/columnDragTable'
import _ from 'lodash';
import {BASE_WIDTH,ORDER_WIDTH} from '../../../../util/constant'
function UserIdentDetails({dispatch,setParentState,parentState,query}) {
    // const {
    //     dispatch,identityList,treeData,currentNode,expandedKeys,curRecord,isShowLeavePostModal,fixedIdentityList,userId
    // } = props;
    const {identityList,treeData,currentNode,expandedKeys,curRecord,isShowLeavePostModal,fixedIdentityList,userId}=parentState
    let newData = [];
    console.log(treeData,'treeData---');
    let newIdentityList = _.cloneDeep(identityList[userId]);
    if(identityList[userId] && identityList[userId].length > 0) {
      identityList[userId].map((item) => {
        if(item.dr == '0') {
          // 该用户身份没有被删除过,删除过的用户不展示在列表
          newData.push(item);
        }
      })
    }
    identityList[userId] = newData;
    const [postRecord,setPostRecord]= useState();
    const [newIdentitData,setNewIdentityData] = useState(_.cloneDeep(identityList[userId]));
    const containersRef=useRef(null);
    useEffect(()=>{
      setNewIdentityData(identityList[userId])
    },[identityList])
    console.log(identityList,'identityList');
    const tableProps = {
      rowKey: 'identityId',
      columns: [
          {
              title: '所属单位',
              dataIndex: 'orgName',
              width:BASE_WIDTH,
              ellipsis:true,
              render:(text)=><span style={{cusor:'pointer'}} title={text}>{text}</span>
          },
          {
              title: '所属部门',
              dataIndex: 'deptName',
              width:BASE_WIDTH,
              ellipsis:true,
              render:(text)=><span style={{cusor:'pointer'}} title={text}>{text&&replaceGTPU(text)}</span>
          },
          {
              title: '岗位信息',
              dataIndex: 'postName',
              width:BASE_WIDTH,
              ellipsis:true,
              render:(text)=><span style={{cusor:'pointer'}} title={text}>{text&&replaceGTPU(text)}</span>
          },
          {
              title: '岗位状态',
              dataIndex: 'isMainPost',
              width:BASE_WIDTH,
              render: (text,obj) => <div>
                <span>{text == '1' ? '主岗' : '兼岗'}</span>
                <span>{obj.isLeavePost==1?`(离岗)`:''}</span>
                </div>
          },
          {
              title: '时间',
              dataIndex: 'createTime',
              width:BASE_WIDTH,
              render: text => { return dataFormat(text, 'YYYY-MM-DD') },
          },
          {
              title: '操作',
              width:BASE_WIDTH,
              render: (text, record) => {
                  if (record.noShowOperation) {
                      return '-';
                  } else {
                      return <>
                          <a
                            style={{ marginLeft: '5px' }}
                            onClick={record.isMainPost!='1'?majorPostFn.bind(this,record):() => {}}
                            disabled={record.isMainPost=='1'?true:false}
                          >主岗</a>
                          {record.isLeavePost==1?
                          <a
                            style={{ marginLeft: '5px' }}
                            onClick={()=>{recoverPost(record)}}
                          >
                            复岗
                          </a>:<a
                            style={{ marginLeft: '5px' }}
                            onClick={record.isMainPost=='1'?() => {}:() => { leavePostFn(record) }}
                            disabled={record.isMainPost=='1'?true:false}
                          >离岗</a>}
                      </>
                  }
              }
          },
      ],
      dataSource: newIdentitData.length<1?identityList[userId]:newIdentitData
    }
    // 离岗
    const leavePostFn = (record) => {
      // 岗人信息
      setPostRecord(record);
      setParentState({
        isShowLeavePostModal: true,
      })
    }
      //复岗
  const recoverPost=(record)=>{
    dispatch({
      type: 'userView/recoverPost',
      payload: {
        identityId: record.identityId,
        isLeavePost:0,//是否离岗 1是 0否
        userId:curRecord.userId,
      },
      callback:()=>{
        // 获取用户身份列表
        dispatch({
            type: 'userView/getIdentity',
            payload: {
                userId: curRecord.userId,
            },
            extraParams:{
                setState:setParentState,
                state:parentState
            },
        });
    }
  });
  }
    // 主岗
    const majorPostFn = (record) => {
      console.log('record---',record)
      let obj = _.cloneDeep(identityList)
      let tempIdentityList = obj[userId].map((item) => {
          if (item.postId == record.postId &&
              item.deptId == record.deptId &&
              item.orgId == record.orgId) {
              return {
                  ...item,
                  isMainPost: '1',
              }
          } else {
              return {
                  ...item,
                  isMainPost: '0',
              }
          }
      })
      obj[userId] = [...tempIdentityList]
      setParentState({
        identityList: obj,
      })
  }
    //为岗位和部门加上直属的单位和部门，并加上禁止
    const getParentNode=(treeData,parentOrgNode,parentDeptNode)=>{
      if(Object.keys(fixedIdentityList).length > 0){
        if(fixedIdentityList[userId] && fixedIdentityList[userId].length > 0){
          treeData.map((item)=>{
            if(item.orgKind=='ORG'){
              if (fixedIdentityList[userId].length && fixedIdentityList[userId].filter(i=>!i.deptId&&!i.postId&&i.orgId==item.id).length) {
                item['disabled'] = true;
              } else {
                item['disabled'] = false;
              }
              if (item.children && item.children.length != 0){
                getParentNode(item.children,item,[])
              }
            }else if(item.orgKind=='DEPT'){
              if (fixedIdentityList[userId].length && fixedIdentityList[userId].filter(i=>!i.postId&&i.deptId==item.id).length) {
                item['disabled'] = true;
              } else {
                item['disabled'] = false;
              }
              item.parentOrgId=parentOrgNode.id;
              item.parentOrgName = parentOrgNode.orgName;
              if (item.children && item.children.length != 0){
                getParentNode(item.children,parentOrgNode,item)
              }
            }else{
              if (fixedIdentityList[userId].length && fixedIdentityList[userId].filter(i=>i.postId==item.id).length) {
                item['disabled'] = true;
              } else {
                item['disabled'] = false;
              }
              console.log(parentOrgNode,'parentOrgNode');
              console.log(parentDeptNode,'parentDeptNode');
              item.parentOrgId=parentOrgNode.id;
              item.parentOrgName = parentOrgNode.orgName;
              item.parentDeptId = parentDeptNode.id;
              item.parentDeptName= parentDeptNode.orgName;
            }
          })
        }
      }
      return treeData;
    }
    //选中操作
    const checkTreeFn=(checkedKeys, {checked,node})=>{
      console.log(node,'node---');
      if(checked){//选中状态identityList加入一条
        newIdentitData.push({
          isMainPost: '0',
          isLeavePost: '0',
          isDataMerge:newIdentitData.length?newIdentitData[0].isDataMerge:0,
          postId: node.orgKind == 'POST'?node.id:'',
          postName: node.orgKind == 'POST'?node.orgName:"",
          deptId: node.orgKind == 'DEPT'?node.id:node.parentDeptId,
          deptName: node.orgKind == 'DEPT'?node.orgName:node.parentDeptName,
          orgId: node.orgKind == 'ORG'?node.id:node.parentOrgId,
          orgName: node.orgKind == 'ORG'?node.orgName:node.parentOrgName,
          orgCode: node.orgCode,
          noShowOperation: true,
        })
      }else{//
        const newList=[]
        let listIdKey = node.orgKind == 'POST'?'postId':(node.orgKind == 'DEPT'?'deptId':'orgId');
        newIdentitData.forEach((item,index)=>{
          if(!item.id&&item[listIdKey]==node.id){
            newIdentitData.splice(index,1)
          }
        })
      }

      // let newObj = _.cloneDeep(identityList);
      // newObj[userId] = newIdentityList
      identityList[userId] = newIdentitData;
      setNewIdentityData([...newIdentitData]);
      setParentState({
        identityList:identityList
      })
    }
    const checkedKeysFn=()=>{
      //岗位取岗位ID，部门取部门ID，单位取单位ID，保存的时候单位ID必填，其他选填
      if(Object.keys(identityList).length > 0){
        let tempCheckedKeys=[];
        if(identityList[userId] && identityList[userId].length > 0&&newIdentitData.length){
          console.log(newIdentitData,'newIdentitData');
          tempCheckedKeys = newIdentitData.map(item => {
            if (item.postId) {
                return item.postId
            }
            if (item.deptId) {
                return item.deptId
            }
            if (item.orgId) {
                return item.orgId
            }
          })
        }
        console.log(tempCheckedKeys,'tempCheckedKeys');
        return [...tempCheckedKeys]
      }
    }
    // 代办数据合并展示Switch;
    // const dataMergeFn = (checked) => {
    //   let tempIdentityList = [];
    //   tempIdentityList = identityList.map(item => ({
    //       ...item,
    //       "isDataMerge": checked ? 1 : 0,
    //   }))
    //   dispatch({
    //       type: 'userView/updateStates',
    //       payload: {
    //           identityList: [...tempIdentityList],
    //       }
    //   })
    // }
    //保存
    const onSave=()=>{
      let obj = _.cloneDeep(identityList)
      if(curRecord.customType==8&&newIdentitData.length>1){
        return message.error('管理员用户只能存在一个身份！')
      }
      //保存用户身份信息
      dispatch({
        type: 'userView/addIdentity',
        payload: {
          userId: curRecord.userId,
          identities: JSON.stringify(newIdentitData.map(item => ({
              "orgId": item.orgId,
              "deptId": item.deptId,
              "postId": item.postId,
              "isMainPost": item.isMainPost,
              "isLeavePost": item.isLeavePost,
              "isDataMerge": item.isDataMerge,
              "orgCode": item.deptCode?item.deptCode:item.orgCode,
              "userId": item.userId,
          }))),
        },
        extraParams:{
          setState:setParentState,
          state:parentState
        },
        callback:function(){
          // obj[userId] = [];
          // setParentState({
          //   identityList: obj,
          // })
        }
      })
    }

    // useEffect(() => {
    //   alert(containersRef.current.offsetHeight);
    //   console.log(containersRef.current.offsetHeight,'containersRef.current');
    // }, []);
    return (
        <div className={styles.containers} ref={containersRef}>
            <ReSizeLeftRight
                leftChildren={
                    <div className={styles.departmentTree}>
                      <Itree
                        plst=''
                        onSearchTable={()=>{}}
                        getData={()=>{}}
                        nodeType={'ORG_'}
                        onEditTree={()=>{}}
                        onDeleteTree={()=>{}}
                        treeData={getParentNode(treeData,[],[])}
                        currentNode={currentNode}
                        expandedKeys={expandedKeys}
                        treeSearchWord={""}
                        moudleName={"userView"}
                        checkStrictly={true}
                        onCheck={checkTreeFn}
                        // checkedKeys={checkedKeysFn()}
                        defaultCheckedKeys={checkedKeysFn()}
                        
                        checkable={true}
                        isShowSearch={false}
                        setParentState={setParentState}
                        parentState={parentState}
                      />
                    </div>
                }
                rightChildren={
                    <div className={styles.table}>
                        <div className={styles.other}>
                            <Space>
                                <div className={styles.bt_gp}>
                                    <Button type='primary' onClick={onSave}>保存</Button>
                                </div>
                                {/* <div className={styles.bt_gp}>
                                    <Switch
                                        className={styles.switch_bt}
                                        checkedChildren="代办数据合并显示"
                                        unCheckedChildren="代办数据合并隐藏"
                                        checked={identityList.length&&identityList[0].isDataMerge?true:false}
                                        onChange={dataMergeFn}
                                    />
                                </div> */}
                            </Space>
                        </div>
                        <div style={{height:'calc(100% - 44px)'}}>
                          <ColumnDragTable {...tableProps} pagination={false} scroll={{y:'calc(100% - 45px)'}}/>
                        </div>
                    </div>
                }
            />
            {isShowLeavePostModal && <LeavePostModal postRecord={postRecord} setParentState={setParentState} parentState={parentState} query={query}/>}
        </div>
    )
}

export default connect(({ userView, loading }) => ({
    ...userView,
    loading
}))(UserIdentDetails);
