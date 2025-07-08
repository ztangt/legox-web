import { Tree } from 'antd';
import { useEffect, useState } from 'react';
import { connect } from 'umi';
import InputSearch from '../../../components/inputSearch';
import styles from '../index.less';

const updateTreeData = (list, key, children) =>
    list.map((node) => {
        if (node.id === key) {
            return {
                ...node,
                isLeaf: node.isParent == 0,
                children: children.map((item) => ({ ...item, isLeaf: item.isParent == 0 })),
            };
        }
        if (node.children) {
            return {
                ...node,
                isLeaf: node.isParent == 0,
                children: updateTreeData(node.children, key, children),
            };
        }
        return node;
    });

const Index = ({ dispatch, personalPermissionView }) => {
    const { unitList, searchWord, limit } = personalPermissionView;

    const [openKey, setOpenKey] = useState(0); //解决tree组件总保存展开项问题
    //初始化数据
    useEffect(() => {
        getTreeData('');
    }, []);

    const getTreeData = (searchWord) => {
        dispatch({
            type: 'personalPermissionView/getUnitListFun',
            payload: {
                parentId: '',
                orgKind: 'ORG_',
                searchWord: searchWord,
                isEnable: 1,
            },
            callback: (list) => {
                dispatch({
                    type: 'personalPermissionView/updateStates',
                    payload: {
                        unitList: list.map((item) => ({ ...item, isLeaf: item.isParent == 0 })),
                        orgId: '', //清空选中的orgId
                    },
                });
                setOpenKey(openKey + 1);
            },
        });
    };
    //点击选中
    const onSelect = (selectedKeys, info) => {
        dispatch({
            type: 'personalPermissionView/getUserListFun',
            payload: {
                searchWord: searchWord,
                orgId: selectedKeys[0],
                start: 1,
                limit: 15,
                type: 'SELF_AND_CHILD', //本级含以下
            },
        });
        //保存选中的orgId
        dispatch({
            type: 'personalPermissionView/updateStates',
            payload: {
                orgId: selectedKeys[0],
            },
        });
    };
    //点击加载数据
    const onLoadData = ({ key, children }) =>
        new Promise((resolve) => {
            if (children) {
                resolve();
                return;
            }
            setTimeout(() => {
                dispatch({
                    type: 'personalPermissionView/getUnitListFun',
                    payload: {
                        parentId: key,
                        orgKind: 'ORG_',
                        searchWord: '',
                        isEnable: 1,
                    },
                    callback: (res) => {
                        let newData = updateTreeData(unitList, key, res);
                        dispatch({
                            type: 'personalPermissionView/updateStates',
                            payload: {
                                unitList: newData,
                            },
                        });
                    },
                });
                resolve();
            }, 500);
        });

    // 新管理单位
    return (
        <div className={'p10'}>
            <div className="mb5 gPrimary">分管单位</div>
            <InputSearch placeholder="请输入单位名称" onSearch={(value) => getTreeData(value)} />
            <div className={styles.tree_box}>
                <Tree
                    key={openKey}
                    selectable={true}
                    onSelect={onSelect}
                    treeData={unitList}
                    loadData={onLoadData}
                    fieldNames={{ title: 'orgName', key: 'id', children: 'children' }}
                />
            </div>
        </div>
    );
};

export default connect(({ personalPermissionView }) => ({
    personalPermissionView,
}))(Index);
