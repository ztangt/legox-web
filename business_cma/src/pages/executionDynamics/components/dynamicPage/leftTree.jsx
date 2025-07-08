import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Space, Input, Tree } from 'antd';
import styles from './index.less';

const LeftTreeComponent = ({
    dispatch,
    checkStrictly,
    onCheck,
    checkable,
    isShowSearch,
    getLoadTreeData,
    getTreeChildren,
    onSearch,
    plst,
    getLoadExpandedKeys,
    curPayload,
    nameSpace,
    nameTreeName,
    executionDynamics,
    pickerTime,
    getInit,
    getData,
}) => {
    const { monitorTreeList, currentNode } = executionDynamics;
    // console.log('monitorTreeList', monitorTreeList, 'pickerTime', pickerTime);
    // 展开
    const [expandedKeys, setExpandedKeys] = useState([]);
    // 展开id
    const [expandId, setExpandId] = useState('');
    const [treeSearchWord, setTreeSearchWord] = useState('');

    // 树搜索
    const onSearchWord = (value) => {
        setTreeSearchWord(value);
        if (!value) {
            setExpandedKeys([]);
        }
        getInit({ monitorTreeList: [] });
        getLoadTreeData(value);
    };

    useEffect(() => {
        getLoadTreeData();
        setExpandedKeys([]);
    }, []);
    // 单独选中
    const onSelect = (selectedKeys, info) => {
        if (info.node) {
            getInit({ currentNode: info.node });
        }
    };
    // loop 有些checked被禁止
    // const loop = (data) =>
    //     data &&
    //     data.length != 0 &&
    //     data.map((item) => {
    //         if (isDisableCheckbox) {
    //             if (item.orgKind == nodeType) {
    //                 item['disableCheckbox'] = false;
    //             } else {
    //                 item['disableCheckbox'] = true;
    //             }
    //         }
    //         if (item.key != -1) {
    //             const index = item.title.indexOf(treeSearchWord);
    //             const beforeStr = item.title.substr(0, index);
    //             const afterStr = item.title.substr(index + treeSearchWord.length);
    //             const title =
    //                 index > -1 ? (
    //                     <span>
    //                         {beforeStr}
    //                         <span className={styles.siteTreeSearchValue}>{treeSearchWord}</span>
    //                         {afterStr}
    //                     </span>
    //                 ) : (
    //                     <span>{item.title}</span>
    //                 );
    //             if (item.children) {
    //                 return {
    //                     ...item,
    //                     title,
    //                     key: item.key,
    //                     children: loop(item.children),
    //                 };
    //             }
    //             return {
    //                 ...item,
    //                 title,
    //                 key: item.key,
    //             };
    //         } else {
    //             return {
    //                 ...item,
    //             };
    //         }
    //     });

    // 展开keys
    const getLoopExpandedKeys = (arr, expandedKeys) => {
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
    };
    // 展开
    const onExpand = (expandedKeys, { expanded, node }) => {
        expandedKeys.push(node.key);
        if (expanded) {
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
                getTreeChildren(node, expandedKeys);
            }
        } else {
            let arr = [];
            arr.push(node);
            getLoopExpandedKeys(arr, expandedKeys);
        }
    };
    console.log('expanedKeys', expandedKeys);
    return (
        <Space direction="vertical">
            {isShowSearch && (
                <Input.Search
                    className={styles.search}
                    placeholder={plst}
                    defaultValue={treeSearchWord}
                    onSearch={onSearchWord}
                    allowClear
                ></Input.Search>
            )}

            <Tree
                treeData={_.cloneDeep(monitorTreeList)}
                showLine={true}
                showIcon={true}
                checkable={checkable}
                selectedKeys={[currentNode?.key]}
                onSelect={onSelect}
                expandedKeys={expandedKeys}
                onCheck={checkable ? onCheck : () => {}}
                checkStrictly={checkStrictly}
                onExpand={onExpand}
            />
        </Space>
    );
};
LeftTreeComponent.propTypes = {
    /**
     * 搜索框提示文本
     */
    plst: PropTypes.string,
    /**
     * 点击树节点获取相关数据信息
     */
    getData: PropTypes.func,
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
    defaultCheckedKeys: PropTypes.array,
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
};

LeftTreeComponent.defaultProps = {
    /**
     * 节点类型
     */
    // nodeType: 'ORG',
    plst: '请输入关键词',
    checkable: false,
    checkStrictly: false,
    isDisableCheckbox: false,
    checkedKeys: [],
    defaultCheckedKeys: [],
    isShowSearch: true,
    // style: { height: '500px' },
};

export default connect(({ executionDynamics }) => ({
    executionDynamics,
}))(LeftTreeComponent);
