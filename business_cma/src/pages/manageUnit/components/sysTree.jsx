import { message, Tree } from 'antd';
import { useEffect } from 'react';
import { connect } from 'umi';
import InputSearch from '../../../components/inputSearch';
import styles from '../index.less';

const Index = ({ dispatch, manageUnit }) => {
    const { roleList, roleCheckId, rigCheckInfo } = manageUnit;

    useEffect(() => {
        getTreeData();
    }, []);
    //获取数据
    const getTreeData = (searchWord) => {
        dispatch({
            type: 'manageUnit/getRoleListFun',
            payload: {
                start: 1,
                limit: 10000,
                searchWord: searchWord,
                roleType: 'ALLROLE',
                orgCode: '',
            },
            callback: clearRole,
        });
    };

    //清空选中的角色信息和成员信息
    const clearRole = () => {
        dispatch({
            type: 'manageUnit/updateStates',
            payload: { roleCheckId: [], memberCheckId: [], memberList: [] },
        });
    };

    //点击选中
    const onSelect = (checkedKeys, info) => {
        let { id } = info.node;
        dispatch({
            type: 'manageUnit/updateStates',
            payload: { roleCheckId: [id], loading: true },
        });
        dispatch({
            type: 'manageUnit/getMemberListFun',
            payload: { roleId: id },
            callback: clearMember,
        });

        //根据角色获取组织菜单
        if (!rigCheckInfo) {
            return message.error('请选择注册系统');
        }
        dispatch({
            type: 'manageUnit/getMenuListFun',
            payload: { roleId: id, registerId: rigCheckInfo.registerId },
            callback: clearMenu,
        });
    };
    //清空清空选中的菜单
    const clearMenu = () => {
        dispatch({
            type: 'manageUnit/updateStates',
            payload: { menuCheckId: [], menuCheckInfo: null },
        });
    };

    //清空清空选中的成员管理单位
    const clearMember = () => {
        dispatch({
            type: 'manageUnit/updateStates',
            payload: { memberCheckId: [] },
        });
    };
    // 新管理单位
    return (
        <div>
            <div className="mb10 gPrimary">全局角色</div>
            <InputSearch placeholder="请输入角色名称" onSearch={(value) => getTreeData(value)} />
            <div className={styles.tree_box}>
                <Tree
                    selectable={false}
                    checkable={true}
                    onCheck={onSelect}
                    checkedKeys={roleCheckId}
                    treeData={roleList}
                    blockNode
                    fieldNames={{ title: 'roleName', key: 'id', children: 'children' }}
                />
            </div>
        </div>
    );
};

export default connect(({ manageUnit }) => ({
    manageUnit,
}))(Index);
