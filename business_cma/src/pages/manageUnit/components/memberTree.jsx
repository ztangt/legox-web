import { message, Tree } from 'antd';
import { useEffect, useState } from 'react';
import { connect } from 'umi';
import InputSearch from '../../../components/inputSearch';
import styles from '../index.less';

const Index = ({ dispatch, manageUnit }) => {
    const { memberList, memberCheckId, roleCheckId, menuList } = manageUnit;
    const [allList, setAllList] = useState([]);

    useEffect(() => {
        setAllList(memberList);
    }, [memberList]);

    //前端自己做搜索
    const onSearch = (value) => {
        dispatch({
            type: 'manageUnit/updateStates',
            payload: {
                memberCheckId: [],
            },
        });
        setAllList(memberList.filter((item) => item.userName.includes(value)));
    };

    //点击选中
    const onSelect = (checkedKeys, info) => {
        let id = info.node.id;
        dispatch({
            type: 'manageUnit/updateStates',
            payload: {
                memberCheckId: [id],
            },
        });

        //点击成员获取选中的组织菜单回显
        if (roleCheckId.length == 0) {
            return message.error('请选择角色');
        }

        // dispatch({
        //     type: 'manageUnit/getCheckdMenuUnitFun',
        //     payload: {
        //         roleId: roleCheckId[0],
        //         identityId: id,
        //     },
        //     callback: (res) => {
        //         let keys = Object.keys(res);
        //         if (keys.length) {
        //             dispatch({
        //                 type: 'manageUnit/updateStates',
        //                 payload: {
        //                     menuCheckId: keys,
        //                     menuCheckInfo: findObjectsByIds(menuList, keys),
        //                 },
        //             });
        //         }
        //     },
        // });
    };

    //写个循环获取菜单MenuName
    const findObjectsByIds = (arr, ids) => {
        const result = [];
        function traverse(items) {
            items.forEach((item) => {
                if (typeof item === 'object' && item !== null) {
                    if (ids.includes(item.menuId)) {
                        // 添加简化后的对象到结果数组
                        result.push({ id: item.menuId, menuName: item.menuName });
                    }
                    // 如果对象有children属性，递归遍历子对象
                    if (Array.isArray(item.children)) {
                        traverse(item.children);
                    }
                }
            });
        }
        // 开始遍历多维数组
        traverse(arr);
        // 返回结果数组
        return result.length ? result : null;
    };

    // 新管理单位
    return (
        <div>
            <div className="mb10 gPrimary">成员列表</div>
            <InputSearch placeholder="请输入姓名" onSearch={onSearch} />
            <div className={styles.tree_box}>
                <Tree
                    selectable={false}
                    checkable={true}
                    onCheck={onSelect}
                    checkedKeys={memberCheckId}
                    treeData={allList}
                    blockNode
                    fieldNames={{ title: 'newNickName', key: 'id', children: 'children' }}
                />
            </div>
        </div>
    );
};

export default connect(({ manageUnit }) => ({
    manageUnit,
}))(Index);
