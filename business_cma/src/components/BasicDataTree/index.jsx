import { message, Tree } from 'antd';
import { useEffect, useState } from 'react';
import { connect } from 'umi';
import InputSearch from '../../components/inputSearch';
import { getMenuId } from '../../util/util';
import styles from './index.less';
/*
 * 基础数据树组件
 * @param getSelectTree 选中的基础数据回调
 * @param year 年份
 * @param title 标题
 * @param innerHeight 内部滚动条的高度
 * @param logicCode 逻辑编码/必传
 * */
const updateTreeData = (list, key, children) =>
    list.map((node) => {
        if (node.nodeId === key) {
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
const updateRefineTreeData = (list, key, children) =>
    list.map((node) => {
        debugger;
        if (node.OBJ_CODE === key) {
            return {
                ...node,
                isLeaf: node.IS_PARENT == 0,
                children: children.map((item) => ({ ...item, isLeaf: item.IS_PARENT == 0 })),
            };
        }
        if (node.children) {
            return {
                ...node,
                isLeaf: node.IS_PARENT == 0,
                children: updateRefineTreeData(node.children, key, children),
            };
        }
        return node;
    });
const Index = ({ dispatch, getSelectTree, year, title, logicCode, innerHeight, menuType }) => {
    const [openKey, setOpenKey] = useState(0); //解决tree组件总保存展开项问题
    const [treeList, setTreeList] = useState([]); //基础数据列表
    const [treeCheckId, setTreeCheckId] = useState([]); //选中的基础数据
    const [treeCheckInfo, setTreeCheckInfo] = useState(null); //选中的基础数据信息

    const [bizSolId, setBizSolId] = useState(''); //业务解决方案id
    const [listModelId, setListModelId] = useState(''); //列表模型id

    //初始化数据
    useEffect(() => {
        if (logicCode) {
            getListModelId('');
        } else {
            message.error('暂无logicCode');
        }
    }, []);

    //获取listModelId
    const getListModelId = () => {
        dispatch({
            type: 'basicDataTree/getBizSolId',
            payload: { logicCode },
            callback: (bizSolId) => {
                setBizSolId(bizSolId); //设置业务解决方案id
                dispatch({
                    type: 'basicDataTree/getListModelId',
                    payload: { bizSolId },
                    callback: (listModelId) => {
                        setListModelId(listModelId); //设置列表模型id
                        if (menuType <= 2) {
                            getRefineTree('');
                        } else {
                            getTreeData('', bizSolId, listModelId); //获取树列表
                        }
                    },
                });
            },
        });
    };

    const getRefineTree = (searchWord) => {
        dispatch({
            type: 'basicDataTree/getRefineTree',
            payload: {
                menuType: menuType, //1计财司，2职能司
                searchWord: searchWord,
                parentCode: '',
            },
            callback: (list) => {
                setTreeList(list);
                setTreeCheckId([]);
                setTreeCheckInfo(null);
                setOpenKey(openKey + 1);
            },
        });
    };
    //获取树列表
    const getTreeData = (searchWord, newBizSolId, newListModelId) => {
        if (!newListModelId) return;
        let postYear = year ? year : new Date().getFullYear();
        let menuId = getMenuId();
        dispatch({
            type: 'basicDataTree/getTreeList',
            payload: {
                listModelId: newListModelId,
                bizSolId: newBizSolId,
                listId: 0,
                formId: 0,
                menuId,
                start: 1,
                limit: 100000,
                searchWord,
                year: JSON.stringify({ columnCode: 'USED_YEAR', value: postYear }),
            },
            callback: (list) => {
                setTreeList(list);
                setTreeCheckId([]);
                setTreeCheckInfo(null);
                setOpenKey(openKey + 1);
            },
        });
    };
    //点击选中
    const onSelect = (checkedKeys, info) => {
        let { node, checked } = info;
        let idList = checked ? (menuType <= 2 ? [node.OBJ_CODE] : [node.nodeId]) : [];
        let infoList = checked ? [node] : null;
        setTreeCheckId(idList);
        setTreeCheckInfo(infoList);

        //回调父组件
        let selectId = checked ? (menuType <= 2 ? node.OBJ_CODE : node.nodeId) : [];
        let selectInfo = checked ? node : {};
        getSelectTree && getSelectTree(selectId, selectInfo);
    };

    //点击加载数据
    const onLoadData = (node) =>
        new Promise((resolve) => {
            if (node?.children) {
                resolve();
                return;
            }
            setTimeout(() => {
                let menuId = getMenuId();
                if (menuType <= 2) {
                    dispatch({
                        type: 'basicDataTree/getRefineTree',
                        payload: {
                            menuType: menuType, //1计财司，2职能司
                            searchWord: '',
                            parentCode: node?.key,
                            grade: node?.GRADE,
                        },
                        callback: (res) => {
                            let newData = updateRefineTreeData(treeList, node?.key, res);
                            setTreeList(newData);
                        },
                    });
                } else {
                    dispatch({
                        type: 'basicDataTree/getTreeChildList',
                        payload: {
                            start: 1,
                            limit: 10000,
                            menuId: menuId,
                            listModelId: listModelId,
                            nodeId: node?.key,
                        },
                        callback: (res) => {
                            let newData = updateTreeData(treeList, node?.key, res);
                            setTreeList(newData);
                        },
                    });
                }
                resolve();
            }, 500);
        });
    //搜索
    const onSearch = (value) => {
        if (menuType <= 2) {
            getRefineTree(value);
        } else {
            getTreeData(value, bizSolId, listModelId); //获取树列表
        }
    };
    //基础数据树
    return (
        <div className={styles.basicDataTree_Parent}>
            {menuType <= 2 ? '' : <div className="antd_primary_color">{title || '基础数据'}</div>}
            <InputSearch placeholder="请输入关键字" onSearch={onSearch} />
            <div
                className={styles.basicDataTree_box}
                style={{ height: innerHeight ? innerHeight : 'calc(100vh - 220px)' }}
            >
                <Tree
                    key={openKey}
                    selectable={false}
                    checkStrictly={true} //父子节点选中状态不再关联
                    checkable={true}
                    onCheck={onSelect}
                    checkedKeys={treeCheckId}
                    treeData={treeList}
                    loadData={onLoadData}
                    fieldNames={
                        menuType <= 2
                            ? { title: 'title', key: 'OBJ_CODE', children: 'children' }
                            : { title: 'nodeName', key: 'nodeId', children: 'children' }
                    }
                />
            </div>
        </div>
    );
};

export default connect(({ basicDataTree }) => ({
    basicDataTree,
}))(Index);
