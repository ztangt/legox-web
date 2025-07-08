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

const Index = ({ dispatch, manageUnit }) => {
    const { unitList, unitCheckId } = manageUnit;

    const [openKey, setOpenKey] = useState(0); //解决tree组件总保存展开项问题
    //初始化数据
    useEffect(() => {
        getTreeData('');
    }, []);

    const getTreeData = (searchWord) => {
        dispatch({
            type: 'manageUnit/getUnitListFun',
            payload: {
                parentId: '',
                searchWord: searchWord,
                isEnable: 1,
            },
            callback: (list) => {
                dispatch({
                    type: 'manageUnit/updateStates',
                    payload: {
                        unitList: list.map((item) => ({ ...item, isLeaf: item.isParent == 0 })),
                        unitCheckId: [], //查询后清空选中
                        unitCheckInfo: null,
                    },
                });
                setOpenKey(openKey + 1);
            },
        });
    };
    //点击选中
    const onSelect = (checkedKeys, info) => {
        let { checkedNodes } = info;
        let { checked } = checkedKeys;

        console.log(checked, 1111);
        console.log(info, 22222);

        dispatch({
            type: 'manageUnit/updateStates',
            payload: {
                unitCheckId: checked,
                unitCheckInfo: checked.length
                    ? checkedNodes.map((item) => ({
                          orgName: item.orgName,
                          id: item.id,
                          orgCode: item.orgCode,
                          orgKind: item.orgKind,
                      }))
                    : null,
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
                    type: 'manageUnit/getUnitListFun',
                    payload: {
                        parentId: key,
                        searchWord: '',
                        isEnable: 1,
                    },
                    callback: (res) => {
                        let newData = updateTreeData(unitList, key, res);
                        dispatch({
                            type: 'manageUnit/updateStates',
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
        <div>
            <div className="mb10 gPrimary">分管单位</div>
            <InputSearch placeholder="请输入单位名称" onSearch={(value) => getTreeData(value)} />
            <div className={styles.tree_box}>
                <Tree
                    key={openKey}
                    selectable={false}
                    checkStrictly={true} //父子节点选中状态不再关联
                    checkable={true}
                    onCheck={onSelect}
                    checkedKeys={unitCheckId}
                    treeData={unitList}
                    loadData={onLoadData}
                    fieldNames={{ title: 'orgName', key: 'id', children: 'children' }}
                />
            </div>
        </div>
    );
};

export default connect(({ manageUnit }) => ({
    manageUnit,
}))(Index);
