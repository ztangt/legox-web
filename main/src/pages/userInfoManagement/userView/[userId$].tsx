import { connect } from 'dva';
import React,{ Component } from 'react';
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
const { TabPane } = Tabs;

@connect(({ userView, loading,user,role }) => ({
    userView,
    loading,
    user,
    role
}))

class UserView extends React.Component {
    componentDidMount() {
        const { dispatch} = this.props
        const query = parse(history.location.search);
        dispatch({
            type: 'userView/getOrgRefUser',
            payload: {
                userId: query?.userId,
                identityId:query?.identityId,
            }
        });
        dispatch({
            type: 'userView/updateStates',
            payload: {
                // curRecord: JSON.parse(query?.record)&&JSON.parse(query?.record),
                userId:query?.userId,
            }
        })
    }
    onChnageTab(key) {
        const { dispatch, userView } = this.props;
        const { curRecord } = userView;
        dispatch({
            type: 'userView/updateStates',
            payload: {
                tabKey: key
            }
        })
        console.log('curRecord=',curRecord, '0000000');
        if (curRecord.userId) {
            switch (key) {
                case '用户组管理':
                    // 获取用户组列表(左列)
                    dispatch({
                        type: 'userView/getUgs',
                        payload: {
                            start: 1,
                            limit: 10000
                        }
                    })
                    // 获取用户关联用户组信息(右列)
                    dispatch({
                        type: 'userView/getUserUserGroup',
                        payload: {
                            orgRefUserId: curRecord.identityId,
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
                        }
                    });
                    return;
                case '用户角色管理':
                    // 获取用户关联角色 列表
                    dispatch({
                        type: 'userView/getUserRole',
                        payload: {
                            orgRefUserId: curRecord.identityId,
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
                        }
                    })
                    return;
            }
        } else {
            message.error('请选择用户');
            return;
        }
    }
    render() {
        const { dispatch, userView,user,role} = this.props;
        const { curRecord, echoCheckedKeys, tabKey } = userView;
        const { menus } = user
        return (
            <div className={styles.body} id='user_detail'>
                <Tabs  onChange={this.onChnageTab.bind(this)} activeKey={tabKey} style={{height:'100%'}}>
                    {getButton(menus,'view')&&<TabPane tab="用户信息" key="用户信息">
                        <UserInformation />
                    </TabPane>}
                    {getButton(menus,'userIdentity')&&<TabPane tab="用户身份详情" key="用户身份详情">
                        <UserIdentDetails echoCheckedKeys={echoCheckedKeys} />
                    </TabPane>}
                    {getButton(menus,'userIdentity')&&<TabPane tab="用户角色管理" key="用户角色管理">
                        <UserRoleManage role={role} />
                    </TabPane>}
                    {getButton(menus,'userIdentity')&&<TabPane tab="用户组管理" key="用户组管理">
                        <UserGroupManage />
                    </TabPane>}
                    {getButton(menus,'userIdentity')&&<TabPane tab="用户权限查看" key="用户权限查看" style={{height:'100%'}}>
                        <UserAuthorityCat />
                    </TabPane>}
                </Tabs>
            </div>
        )
    }
}
export default () => {
//     const search = history.location.search.includes('?') || !history.location.search ? history.location.search : `?${history.location.search}`
//    console.log(search,'search');
//    console.log(history);
    return (
            <UserView />
    );
}
