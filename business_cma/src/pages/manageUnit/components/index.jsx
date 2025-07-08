import { Button, message, Spin } from 'antd';
import qs from 'qs';
import { useEffect } from 'react';
import { connect, useModel } from 'umi';
import styles from '../index.less';
import MemberTree from './memberTree';
import MenuTree from './menuTree';
import SysTree from './sysTree';
import UnitTree from './unitTree';
const Container = ({ dispatch, manageUnit }) => {
    const onSave = () => {
        dispatch({
            type: 'manageUnit/getState',
            callback: ({
                roleCheckId,
                memberCheckId,
                menuCheckInfo,
                unitCheckInfo,
                rigCheckInfo,
                roleList,
                memberList,
            }) => {
                console.log(roleCheckId, '----角色');
                console.log(memberCheckId, '----成员');
                console.log(rigCheckInfo, '----注册系统');
                console.log(menuCheckInfo, '----组织结构');
                console.log(unitCheckInfo, '----分管单位');
                if (!roleCheckId.length) {
                    return message.error('请选择角色');
                }
                if (!memberCheckId.length) {
                    return message.error('请选择成员');
                }
                if (!menuCheckInfo) {
                    return message.error('请选择组织结构');
                }
                if (!unitCheckInfo) {
                    return message.error('请选择分管单位');
                }
                if (!rigCheckInfo) {
                    return message.error('请选择注册系统');
                }

                let roleInfo = roleList.find((item) => item.id == roleCheckId[0]);
                let memberInfo = memberList.find((item) => item.id == memberCheckId[0]);
                dispatch({
                    type: 'manageUnit/saveFun',
                    payload: {
                        roleId: roleInfo.id,
                        roleName: roleInfo.roleName,
                        registerId: rigCheckInfo.registerId,
                        registerName: rigCheckInfo.registerName,
                        userList: [
                            {
                                id: memberInfo.userId,
                                userName: memberInfo.userName,
                                identityId: memberInfo.identityId,
                            },
                        ],

                        menuList: menuCheckInfo,
                        orgList: unitCheckInfo,
                    },
                });
            },
        });
    };
    const { LOCATIONHASH } = useModel('@@qiankunStateFromMaster');

    //获取组织结构的下拉选项
    useEffect(() => {
        dispatch({
            type: 'manageUnit/getRigListFun',
            payload: {
                start: 1,
                limit: 10000,
            },
            callback: (list) => {
                //查看是否前面页面带过来的roleCheckId,如果有就要回显数据
                let str = LOCATIONHASH();
                let newStr = str.split('?');
                if (newStr.length > 1) {
                    console.log(qs.parse(newStr[1]), '---->qs.parse(newStr[1]);');
                    let { roleCheckId, identityId } = qs.parse(newStr[1]);
                    if (roleCheckId) {
                        //回显角色
                        dispatch({
                            type: 'manageUnit/updateStates',
                            payload: {
                                roleCheckId: [roleCheckId],
                                identityId: identityId,
                            },
                        });
                        //获取成员列表
                        dispatch({
                            type: 'manageUnit/getMemberListFun',
                            payload: { roleId: roleCheckId },
                        });
                        //回显分管单位
                        dispatch({
                            type: 'manageUnit/getCheckedUnitListFun',
                            payload: {
                                identityId: identityId,
                                roleId: roleCheckId,
                            },
                        });
                    }
                }

                //注册系统默认取业务平台的，如果没有取第一个
                if (list.length) {
                    let defaultInfo = list.find((item) => item.registerCode == '1002');
                    let rigCheckInfoNew = defaultInfo ? defaultInfo : list[0];

                    dispatch({
                        type: 'manageUnit/updateStates',
                        payload: {
                            rigCheckInfo: rigCheckInfoNew,
                        },
                    });

                    if (newStr.length > 1) {
                        let { roleCheckId } = qs.parse(newStr[1]);
                        //根据角色获取组织菜单
                        if (roleCheckId) {
                            dispatch({
                                type: 'manageUnit/getMenuListFun',
                                payload: { roleId: roleCheckId, registerId: rigCheckInfoNew.registerId },
                            });
                        }
                    }
                }
            },
        });
    }, []);

    return (
        <Spin spinning={manageUnit.loading}>
            <div className={'pt10 pl10 pr10'}>
                <div className={'flex flex_justify_end mb10'}>
                    <Button onClick={onSave}>保存</Button>
                </div>
                <div className="flex">
                    <div className={`flex_1 ${styles.item_box} mr10 p10`}>
                        <SysTree />
                    </div>
                    <div className={`flex_1 ${styles.item_box} mr10 p10`}>
                        <MemberTree />
                    </div>
                    <div className={`flex_1 ${styles.item_box} mr10 p10`}>
                        <MenuTree />
                    </div>
                    <div className={`flex_1 ${styles.item_box} p10`}>
                        <UnitTree />
                    </div>
                </div>
            </div>
        </Spin>
    );
};

export default connect(({ manageUnit }) => ({
    manageUnit,
}))(Container);
