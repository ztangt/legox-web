import { connect } from 'dva';
import React,{ Component,useEffect,useState } from 'react';
import { history } from 'umi';
import {  Table, Tag, Space, Tabs, message } from 'antd';
import styles from './index.less';
import UserInformation from './components/userInformation'
import UserIdentDetails from './components/userIdentDetails'
import UserRoleManage from './components/userRoleManage'
import UserAuthorityCat from './components/userAuthorityCat'
import UserGroupManage from './components/userGroupManage'
import { getButton } from '../../../util/util';
import { parse } from 'query-string';
import {useSetState} from 'ahooks'
const { TabPane } = Tabs;

 function Index({dispatch,userView,user,role,location}) {
    // const { dispatch, userView,user,role} = this.props;
    const [state,setState]=useSetState({
        isShowChoicePerson:false,
        loading: false,
        returnCount: 0,
        currentPage: 1,
        ugs: [],
        imageUrl: '',
        signImageUrl: '',
        postTreeData: [],
        identityList: {},
        fixedIdentityList: {},
        userRoleList: {},
        allUserRole: [],
        userGroupList: {},
        userTargetKeys: [],
        userGroupTargetKeys: [],
        echoCheckedKeys: [],
        curRecord: null,
        identityFullName: '',
        editMainPostMark: '1',
        isShowLeavePostModal: false,
        isShowUserSettingModal: false,
        isShowGroupSettingModal: false,
        checkedKeys:[],
        userId:'',
        authorityTree:[],
        tabKey:"用户信息",

        selectedNodeId:'',
        selectedDataIds:[],
        treeData:[],//单位树
        currentNode:[],
        expandedKeys:[],
        treeSearchWord:'',
        selectedDatas:[],
        originalData:[],
        selectNodeType:[],
        isShowMigrateModal:false,
        selectedRowsData:[],

        selectedRowKeys:'',
        leavepostType:'',
        isShowRole:false,
        user:null,
        rolePathname:'',
    })
        const { curRecord, echoCheckedKeys, tabKey } = state;
        const { menus } = user
        const [currentItem,setCurrentItem]=useState(null)
        const query = location.query;
    useEffect(()=>{
        setState({
            userId:query.userId,
        })
        dispatch({
            type: 'userView/getOrgRefUser',
            payload: {
                userId: query.userId,
                identityId: query.identityId,
            },
            extraParams:{
                setState:setState,
                state:state
            }
        });
    },[])
    const onChnageTab=(key)=> {
        setState({
            tabKey: key
        })      
        console.log('curRecord=',curRecord, '0000000');
        if (curRecord?.userId) {
            switch (key) {
                case '用户组管理':
                    // 获取用户组列表(左列)
                    dispatch({
                        type: 'userView/getUgs',
                        payload: {
                            start: 1,
                            limit: 10000
                        },
                        extraParams:{
                            setState:setState,
                            state:state
                        }
                    })
                    // 获取用户关联用户组信息(右列)
                    dispatch({
                        type: 'userView/getUserUserGroup',
                        payload: {
                            orgRefUserId: curRecord.identityId,
                        },
                        extraParams:{
                            setState:setState,
                            state:state
                        }
                    })
                    return;
                case '用户身份详情':
                  console.log('用户身份详情');
                    // 获取用户身份列表
                    dispatch({
                        type: 'userView/getIdentity',
                        payload: {
                            userId: curRecord.userId,
                        },
                        extraParams:{
                            setState:setState,
                            state:state
                        }
                    });
                    return;
                case '用户角色管理':
                    // 获取用户关联角色 列表
                    dispatch({
                        type: 'userView/getUserRole',
                        payload: {
                            orgRefUserId: curRecord.identityId,
                        },
                        extraParams:{
                            setState:setState,
                            state:state
                        }
                    })
                    return;
                case '用户权限查看':
                    // 获取用户所属角色的模块资源
                    dispatch({
                        type: 'userView/getUserMenu',
                        payload: {
                            orgRefUserId: curRecord.identityId,
                            //orgRefUserId: '0',
                        },
                        extraParams:{
                            setState:setState,
                            state:state
                        }
                    })
                    return;
            }
        } else {
            message.error('请选择用户');
            return;
        }
    }
  return (
    <div className={styles.body} id={`user_detail_${query?.userId}_${query?.identityId}`}>
                <Tabs  onChange={onChnageTab.bind(this)} activeKey={tabKey} style={{height:'100%'}}>
                    {getButton(menus,'view')&&<TabPane tab="用户信息" key="用户信息">
                        <UserInformation query={query} parentState={state} setParentState={setState}/>
                    </TabPane>}
                    {getButton(menus,'userIdentity')&&<TabPane tab="用户身份详情" key="用户身份详情">
                        <UserIdentDetails query={query} echoCheckedKeys={echoCheckedKeys} setParentState={setState} parentState={state} />
                    </TabPane>}
                    {getButton(menus,'userIdentity')&&<TabPane tab="用户角色管理" key="用户角色管理">
                        <UserRoleManage query={query} role={role} setParentState={setState} parentState={state}/>
                    </TabPane>}
                    {getButton(menus,'userIdentity')&&<TabPane tab="用户组管理" key="用户组管理">
                        <UserGroupManage query={query} setParentState={setState} parentState={state}/>
                    </TabPane>}
                    {getButton(menus,'userIdentity')&&<TabPane tab="用户权限查看" key="用户权限查看" style={{height:'100%'}}>
                        <UserAuthorityCat setParentState={setState} parentState={state}/>
                    </TabPane>}
                </Tabs>
            </div>
  )
}
export default connect(({userView, loading,user,role })=>({userView, loading,user,role }))(Index)

