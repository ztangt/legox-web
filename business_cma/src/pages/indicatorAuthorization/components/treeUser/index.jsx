import { ApartmentOutlined, BankOutlined, ClusterOutlined } from '@ant-design/icons';
import { Input, message, Tree } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import styles from './index.less';

function TreeSelect({
    dispatch,
    nodeType,
    isShowSearch,
    plst,
    getData,
    checkable,
    onCheck,
    checkStrictly,
    isDisableCheckbox,
    checkedKeys,
    currentNode,
    isDisabled,
}) {
    const [treeData, setTreeData] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [treeSearchWord, setTreeSearchWord] = useState('');
    // const [currentNode,setCurrentNode] = useState({});
    const [expandId, setExpandId] = useState('');
    const pathname = history.location.pathname;
    //左侧列表都是查询的ORG，然后查询单位下级的时候，如果查询的是部门那么传DEPT，查询的是单位传ORG
    useEffect(() => {
        init(nodeType == 'DEPT' ? 'ORG_' : nodeType, treeData);
    }, []);
    function init(nodeType, treeData) {
        if (treeData.length == 0) {
            //左侧树无数据时再获取树信息
            getOrgChildren('', nodeType, '', 1);
        }
    }
    function getOrgChildren(nodeId, nodeType, node, onlySubDept) {
        dispatch({
            type: 'indicatorNamespace/getOrgTree',
            payload: {
                parentId: nodeId,
                orgKind: nodeType,
                // treeData:treeData,
                searchWord: '',
                // onlySubDept:pathname=="/unitRole"||'/sysRole'||'/allRole'?onlySubDept:''
            },
            nodeType: typeof node != 'undefined' && node ? node.orgKind : '', //拼接节点
            nodeId: typeof node != 'undefined' && node ? node.id : '', //拼接节点
            nodePath:
                typeof node != 'undefined' && node
                    ? node.nodePath
                        ? JSON.stringify(node.nodePath)
                        : JSON.stringify([])
                    : '', //拼接节点
            callback: (treeData) => {
                setTreeData(treeData);
            },
        });
    }

    //改变搜索框
    function onChangeValue(e) {
        setTreeSearchWord(e.target.value);
    }
    /**
     * 搜索框内容校验是否包含特殊字符
     * @param {*校验值} value
     */
    function checkWOrd(value) {
        let specialKey = "`@《》·~!%#$^&*=|{}':;'\\.<>/?~！#￥……&*|{}‘；：”“'。，、？‘'";
        for (let i = 0; i < value.length; i++) {
            if (specialKey.indexOf(value.substr(i, 1)) != -1) {
                return true;
            }
        }
        return false;
    }
    /**
     * 搜索组织树信息
     * @param {*} value
     */
    function onSearchTree(value) {
        if (checkWOrd(value)) {
            message.error('查询条件不支持特殊字符，请更换其它关键字！');
            return;
        }
        if (value) {
            dispatch({
                type: 'indicatorNamespace/getSearchTree',
                payload: {
                    parentId: '',
                    orgKind: nodeType == 'DEPT' ? 'ORG_' : nodeType,
                    searchWord: value,
                    expandedKeys,
                },
                callback: (treeData, expandedKeys) => {
                    setTreeData(treeData);
                    setExpandedKeys(expandedKeys);
                },
            });
        } else {
            getOrgChildren('', 'ORG_', '', 1);
            setExpandedKeys([]);
        }
    }
    /**
     *
     * @param {*} selectedKeys  选中节点key
     * @param {*} info info.node 当前节点信息
     */
    function onSelect(selectedKeys, info) {
        if (info.node) {
            // setCurrentNode(info.node)
            dispatch({
                type: 'indicatorNamespace/updateStates',
                payload: {
                    currentNode: info.node,
                },
            });
            getData(info.node);
        }
    }
    const loop = (data) =>
        data &&
        data.length != 0 &&
        data.map((item) => {
            if (isDisableCheckbox) {
                if (item.orgKind == nodeType) {
                    item['disableCheckbox'] = false;
                } else {
                    item['disableCheckbox'] = true;
                }
            }
            if (item.key != -1) {
                const index = item.title.indexOf(treeSearchWord);
                const beforeStr = item.title.substr(0, index);
                const afterStr = item.title.substr(index + treeSearchWord.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span className={styles.siteTreeSearchValue}>{treeSearchWord}</span>
                            {afterStr}
                        </span>
                    ) : (
                        <span>{item.title}</span>
                    );
                if (item.children) {
                    return {
                        ...item,
                        title,
                        key: item.key,
                        children: loop(item.children),
                    };
                }
                return {
                    ...item,
                    title,
                    key: item.key,
                };
            } else {
                return {
                    ...item,
                };
            }
        });
    function onExpand(expandedKeys, { expanded, node }) {
        expandedKeys.push(node.key);
        if (expanded) {
            // expandedKeys.push(node.key)
            if (node.isParent == 1 && node.children[0].key == -1) {
                //如果子集未加载到数据时删除该key值
                let index = expandedKeys.findIndex((value) => {
                    return value == node.key;
                });
                expandedKeys.splice(index, 1);
            }
            setExpandedKeys(Array.from(new Set(expandedKeys)));
            setExpandId(node.key);
            if (node.isParent == 1) {
                //当前点击节点为父节点  获取下一级数据
                getOrgChildren(node.key, nodeType == 'DEPT' ? 'ORG_' : nodeType, node, 0);
            }
        } else {
            let arr = [];
            arr.push(node);
            getLoopExpandedKeys(arr, expandedKeys);
        }
    }
    function getLoopExpandedKeys(arr, expandedKeys) {
        arr.forEach(function (item, i) {
            expandedKeys.forEach(function (policy, j) {
                if (policy == item.key) {
                    expandedKeys.splice(j, 1);
                }
            });
            if (item.children && item.children.length != 0) {
                getLoopExpandedKeys(item.children, expandedKeys);
            }
        });
        setExpandedKeys(expandedKeys);
    }
    //选中
    const onTreeCheck = (checkedKeys, { checked, node }) => {
        if (typeof onCheck != 'undefined' && onCheck) {
            onCheck(checkedKeys, { checked, node });
        }
    };

    return (
        <div className={styles.tree}>
            {isShowSearch && (
                <Input.Search
                    className={styles.tree_search}
                    placeholder={plst}
                    allowClear
                    defaultValue={treeSearchWord}
                    onChange={onChangeValue.bind(this)}
                    onSearch={(value) => {
                        onSearchTree(value);
                    }}
                />
            )}
            <div>
                <Tree
                    titleRender={(node) => (
                        <span key={node.key} className={styles.tree_node}>
                            {node.orgKind == 'DEPT' ? (
                                <ApartmentOutlined style={{ marginRight: 5 }} />
                            ) : node.orgKind == 'POST' ? (
                                <ClusterOutlined style={{ marginRight: 5 }} />
                            ) : (
                                <BankOutlined style={{ marginRight: 5 }} />
                            )}
                            {node.title}
                        </span>
                    )}
                    className={styles.tree_list_user}
                    onSelect={onSelect.bind(this)}
                    treeData={loop(treeData)}
                    onExpand={onExpand.bind(this)}
                    selectedKeys={[currentNode?.key]}
                    expandedKeys={expandedKeys}
                    showLine={true}
                    showIcon={true}
                    checkable={checkable}
                    onCheck={onTreeCheck}
                    checkStrictly={checkStrictly}
                    checkedKeys={checkedKeys}
                    disabled={isDisabled}
                />
            </div>
        </div>
    );
}
TreeSelect.propTypes = {
    /**
     * 搜索框提示文本
     */
    plst: PropTypes.string,
    /**
     * 点击树节点获取相关数据信息
     */
    getData: PropTypes.func,
    /**
     *点击右键编辑树节点
     */
    onEditTree: PropTypes.func,
    /**
     *点击删除节点
     */
    onDeleteTree: PropTypes.func,
    /**
     * 节点类型
     */
    nodeType: PropTypes.string,
    /**
     * 节点前添加 Checkbox 复选框
     */
    checkable: PropTypes.bool,
    /**
     * checkable 状态下节点选择完全受控（父子节点选中状态不再关联）
     */
    checkStrictly: PropTypes.bool,
    /**
     * 选中的节点
     */
    checkedKeys: PropTypes.array,
    /**
     * 选中节点的操作
     */
    onCheck: PropTypes.func,
    /**
     * 是否显示搜索框
     */
    isShowSearch: PropTypes.bool,
    /**
     * 树的外部样式
     */
    style: PropTypes.object,
    /**
     * 是否添加根节点
     */
    isShowAdd: PropTypes.bool,
    /**
     * 树的添加根节点
     */
    onAdd: PropTypes.func,
    /**
     * 是否根据请求类型显示复选框的禁止
     */
    isDisableCheckbox: PropTypes.bool,
};
TreeSelect.defaultProps = {
    /**
     * 节点类型
     */
    nodeType: 'ORG_',
    checkable: false,
    checkStrictly: false,
    checkedKeys: [],
    isShowSearch: true,
    style: { height: '500px' },
};
export default connect(({ indicatorNamespace }) => ({
    indicatorNamespace,
}))(TreeSelect);
