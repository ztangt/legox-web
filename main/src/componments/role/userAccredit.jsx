/**
 * 关联用户
 * （注意，请在相关的model里面定义selectedUserIds，selectedUsers）
 * selectedUsers为选中的用户信息，selectedUserIds为选中的用户id
 */
import React from 'react';
import ReSizeLeftRightCss from '../public/reSizeLeftRightCss';
import styles from './userAccredit.less';
import {connect} from 'umi';
import ITree from '../../componments/Tree';
import RightUserAccredit from './rightUserAccredit';
import MiddleUserAccredit from './middleUserAccredit';
import _ from 'lodash';
function Index({dispatch,nameSpace,spaceInfo}){
  console.log('spaceInfo=',spaceInfo);
  const {users,selectedNodeId,selectedUserIds,treeData,currentNode,expandedKeys,treeSearchWord,selectedUsers}=spaceInfo;
  console.log('treeData=',treeData);
  const columns = [
    {
      title: '人员',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      key: 'deptName',
    },
    {
      title: '单位',
      dataIndex: 'orgName',
      key: 'orgName',
    },
    {
      title: '操作',
      dataIndex: 'orgRefUserId',
      key: 'orgRefUserId',
      render:(text)=><div onClick={closeTag.bind(this,text)} class="table_operation">删除</div>
    },
  ];
  //更新选择的用户ID
  const updateSelectIdsFn=(selectedUserIds,selectedUsers)=>{
    dispatch({
      type:`${nameSpace}/updateStates`,
      payload:{
        selectedUserIds:selectedUserIds,
        selectedUsers:_.cloneDeep(selectedUsers)
      }
    })
  }
  //关闭标签(关闭所以标签（清空）)
  const closeTag=(orgRefUserId)=>{
    if(orgRefUserId){
      selectedUserIds.splice(selectedUserIds.indexOf(orgRefUserId),1);
      let newSelectedUsers = selectedUsers.filter(item=>item.orgRefUserId!=orgRefUserId);
      updateSelectIdsFn(selectedUserIds,newSelectedUsers)
    }else{
      updateSelectIdsFn([],[])
    }
  }
  const getQueryUser=(searchWord,selectedNodeId,selectNodeType)=>{
    dispatch({
      type: `userAccredit/queryUser`,
      payload:{
        namespace:nameSpace,
        searchWord:searchWord,
        orgId:selectNodeType == 'ORG' ? selectedNodeId : '',
        deptId:selectNodeType == 'DEPT' ? selectedNodeId : '',
        start:1,
        limit: 10000,
        type:''
      }
    })
  }
  //搜索人名
  const searchWordFn=(searchWord)=>{
    getQueryUser(searchWord,selectedNodeId,selectNodeType);
  }
  //获取用户列表
  const getData=(node)=>{
    dispatch({
      type:`${nameSpace}/updateStates`,
      payload:{
        selectedNodeId:node.key,
        selectNodeType:node.nodeType
      }
    })
    getQueryUser('',node.key,node.nodeType);
  }
  //左侧
  const leftRender=()=>{
    return (
      <div className={styles.left_org_tree}>
        <span className={styles.title}>
          组织机构
        </span>
        <div className={styles.content}>
          <ITree
            treeData={treeData}
            currentNode={currentNode}
            expandedKeys={expandedKeys}
            treeSearchWord={treeSearchWord}
            plst='请输入部门名称'
            getData={getData}
            nodeType='DEPT'
            moudleName={nameSpace}
            onEditTree={()=>{}}
          />
        </div>
      </div>
    )
  }
  console.log('users=',users);
  return (
    <div className={styles.user_warp}>
      <span className={styles.split_line}></span>
      <ReSizeLeftRightCss
        leftChildren={leftRender()}
        rightChildren={
          <ReSizeLeftRightCss
          leftChildren={<MiddleUserAccredit
                          originalData={users}
                          selectIds={selectedUserIds}
                          searchWordFn={searchWordFn}
                          updateSelectIdsFn={updateSelectIdsFn}
                          selectedUsers={selectedUsers}
                          idKey="identityId"
                          nameKey="userName"
                          selectedNodeId={selectedNodeId}
                        />}
          rightChildren={<RightUserAccredit
                          selectedUsers={selectedUsers}
                          idKey="identityId"
                          nameKey="userName"
                          columns={columns}
                          closeTag={closeTag}
                          />
                        }
          />
        }
      />
    </div>
  )
}
Index.propTypes = {
  /**
   * nameSpace（model的命名）
   */
  nameSpace:'',
  /**
   * model的state值
   */
  spaceInfo:{}
}
export default connect(({role,layoutG})=>{return {role,layoutG}})(Index);
