import { message, Select, Tree } from 'antd';
import { useState } from 'react';
import { connect } from 'umi';
import styles from '../index.less';
const Index = ({ dispatch, manageUnit }) => {
    const { menuList, menuCheckId, rigList, roleCheckId, rigCheckInfo } = manageUnit;
    const [searchWord, setSearchWord] = useState('');

    //获取数据
    const getTreeData = (registerId = '', searchWord = '') => {
        if (!roleCheckId.length) {
            return message.error('请选择角色');
        }
        dispatch({
            type: 'manageUnit/getMenuListFun',
            payload: {
                searchWord: searchWord,
                registerId: registerId,
                roleId: roleCheckId[0],
            },
            // callback: (res) => {
            //     //清空选中的菜单
            //     dispatch({
            //         type: 'manageUnit/updateStates',
            //         payload: {
            //             menuCheckId: [],
            //             menuCheckInfo: null,
            //         },
            //     });
            // },
        });
    };

    //选中
    // const onCheck = (checkedKeys, info) => {
    // let { checkedNodes } = info;
    // dispatch({
    //     type: 'manageUnit/updateStates',
    //     payload: {
    //         menuCheckId: checkedKeys,
    //         menuCheckInfo: checkedKeys.length
    //             ? checkedNodes.map((item) => ({ menuName: item.menuName, id: item.menuId }))
    //             : null,
    //     },
    // });
    // };

    //搜索
    // const onSearch = (value) => {
    //     setSearchWord(value);
    //     getTreeData(registerId, value);
    // };

    //注册系统改变
    const onChange = (id) => {
        getTreeData(id, searchWord);
        dispatch({
            type: 'manageUnit/updateStates',
            payload: {
                rigCheckInfo: rigList.find((item) => item.registerId == id),
            },
        });
    };
    // 新管理单位
    return (
        <div>
            <div className="mb10 gPrimary">组织结构</div>
            <div className={'flex mb10 flex_align_center'}>
                <div className={'mr5'}>注册系统</div>
                <Select
                    className={'flex_1'}
                    allowClear={false}
                    onChange={onChange}
                    autoComplete="off"
                    placeholder="请选择"
                    value={rigCheckInfo ? rigCheckInfo.registerId : ''}
                >
                    {rigList.map((item, index) => (
                        <Select.Option key={index} value={item.registerId}>
                            {item.registerName}
                        </Select.Option>
                    ))}
                </Select>
            </div>
            {/*<InputSearch placeholder="请输入单位/部门" onSearch={onSearch} />*/}
            <div className={styles.tree_box} style={{ height: 'calc(100vh - 280px)' }}>
                <Tree
                    disabled={true}
                    selectable={false}
                    multiple={true}
                    checkable={true}
                    // onCheck={onCheck}
                    checkedKeys={menuCheckId}
                    treeData={menuList}
                    blockNode
                    fieldNames={{ title: 'menuName', key: 'menuId', children: 'children' }}
                />
            </div>
        </div>
    );
};

export default connect(({ manageUnit }) => ({
    manageUnit,
}))(Index);
