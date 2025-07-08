import React, { useState ,useEffect} from 'react';
import { connect } from 'dva';
import {history} from 'umi'
import styles from './userRoleManage.less';
import UserSettingModal from './userSettingModal';
import { Tree, Table, Button, Input, Space } from 'antd';
import RoleSet from '../../../../componments/role/roleSet'
import ColumnDragTable from '../../../../componments/columnDragTable'
import {BASE_WIDTH,ORDER_WIDTH} from '../../../../util/constant'
function UserRoleManage({dispatch,setParentState,parentState, role,query}) {
    const {
        curRecord,
        userRoleList,
        isShowUserSettingModal,
        userId,
        isShowRole,
        rolePathname
    } = parentState;
    const pathname = history.location.pathname;
    console.log('userRoleList---',userRoleList)
    console.log('userId---',userId)
    const tableProps = {
        rowKey: 'roleId',
        columns: [
            {
              title:'序号',
              dataIndex: 'index',
              width:ORDER_WIDTH,
              render:(text,obj,index)=><div>{index+1}</div>
            },
            {
                title: '角色名称',
                dataIndex: 'roleName',
                width:BASE_WIDTH,
                render:(text,record)=><a onClick={()=>{showSetModal(record)}}>{text}</a>
            },
            // {
            //     title: '角色简称',
            //     dataIndex: 'roleTag',
            // },
            {
                title: '角色编码',
                dataIndex: 'roleCode',
                width:BASE_WIDTH,
            },
            {
                title: '角色描述',
                dataIndex: 'roleDesc',
                width:BASE_WIDTH*2.5,
            },
            {
                title: '角色来源',
                dataIndex: 'roleType',
                width:BASE_WIDTH,
                render: text => {
                    if (text == 'SYSROLE') {
                        return `系统角色`
                    }
                    if (text == 'ALLROLE') {
                        return `全局角色`
                    }
                    if (text == 'ORGROLE') {
                        return `单位角色`
                    }
                },
            },
            {
                title: '单位名称',
                dataIndex: 'orgName',
                width:BASE_WIDTH,
            },
        ],
        dataSource: userRoleList[userId],
        scroll:{y:'calc(100% - 45px)'}
    }
     //显示甚至弹框
  const showSetModal=(obj)=>{
      const path=obj.roleType=="ALLROLE"?'/allRole':obj.roleType=="ORGROLE"?'/unitRole':obj.roleType=="SYSROLE"?'/sysRole':''
      
      role.pathname=path
      setParentState({
        rolePathname:path
      })
      dispatch({
        type: 'role/getSysRegister',
        payload: {
          roleId: obj.id,
        }
      })
            role.searchObj[role.pathname].isShowSetModal=true
            role.searchObj[role.pathname].tabValue='functionSet'
            role.searchObj[role.pathname].roleId=obj.id
            role.searchObj[role.pathname].pathname=role.pathname
            role.searchObj[role.pathname].moudleName='userRoleManage'
            setParentState({
                isShowRole: true,
            })
    //   console.log(props.searchObj['/allRole'],'props.searchObj');
  }
    const settingFn = () => {
        // 获取所有角色
        dispatch({
            type: 'userView/getUserPartRole',
            payload: {
                orgId: curRecord.orgId,
            },
            extraParams:{
                setState:setParentState,
                state:parentState
            },
        })
        setParentState({
            isShowUserSettingModal: true,
        })
    }

    return (
        <div className={styles.roleManage_container}>
            <Space>
                <Button onClick={settingFn} className={styles.button}>设置</Button>
            </Space>
            <div style={{height:'calc(100% - 48px)'}}>
                <ColumnDragTable {...tableProps} pagination={false}/>
            </div>
            {isShowUserSettingModal && <UserSettingModal query={query} setParentState={setParentState} parentState={parentState}/>}
            { isShowRole&& <RoleSet location={history.location} isShow={false} pathname={rolePathname} container={`user_detail_${query?.userId}_${query?.identityId}`} setParentState={setParentState}/>}
        </div>
    )
}
export default connect(({ userView,role, loading }) => ({
    ...userView,
    ...role,
    loading
}))(UserRoleManage);
