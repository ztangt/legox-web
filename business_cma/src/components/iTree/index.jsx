/**
 * 树节点的封装
 * tree[{}]
 */
import React, { useState, useMemo } from 'react';
import { Input, Tree } from 'antd';
import styles from './index.less';
import PropTypes from 'prop-types';
import { CaretDownOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
const Search = Input.Search;
function ITree(props) {
    const [searchValue, setSearchValue] = useState('');
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const { title, key, children } = props.field;
    //将树节点展开为一级，并获取全部的末级数量，默认全部展开
    const dataList = [];
    const defalutExpandedKeys = [];
    const generateList = (data) => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const title = node.title;
            const nodeKey = node['key'];
            dataList.push({ key: nodeKey, title });
            defalutExpandedKeys.push(nodeKey);
            if (node.children) {
                generateList(node.children);
            }
        }
    };
    generateList(props.treeData);
    //获取搜索内容的父节点然后展开
    const getParentKey = (nodeKey, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node['children']) {
                if (node['children'].some((item) => item['key'] === nodeKey)) {
                    parentKey = node['key'];
                } else if (getParentKey(nodeKey, node.children)) {
                    parentKey = getParentKey(nodeKey, node.children);
                }
            }
        }
        return parentKey;
    };
    //展开收起
    const onExpand = (expandedKeys) => {
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(false);
    };
    //搜索树名称
    const onSearch = (value) => {
        setSearchValue(value);
        const expandedKeys = dataList
            .map((item) => {
                if (item.title.indexOf(value) > -1) {
                    return getParentKey(item.key, props.treeData);
                }
                return null;
            })
            .filter((item, i, self) => item && self.indexOf(item) === i);
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(true);
    };
    const onSelect = (selectedKeys, e) => {
        if (e.selected) {
            props.onSelect(selectedKeys, e);
        }
    };
    //重新组织树结构
    const treeData = useMemo(() => {
        const loop = (data) =>
            data.map((item) => {
                const strTitle = item.title;
                const index = strTitle.indexOf(searchValue);
                const beforeStr = strTitle.substring(0, index);
                const afterStr = strTitle.slice(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span className={styles.searchContent}>{searchValue}</span>
                            {afterStr}
                        </span>
                    ) : (
                        <span>{strTitle}</span>
                    );
                if (item.children) {
                    return {
                        title,
                        key: item.key,
                        children: loop(item.children),
                    };
                }
                return {
                    title,
                    key: item.key,
                };
            });
        return loop(props.treeData);
    }, [searchValue]);
    return (
        <div style={props.style} className={styles[props.className]}>
            {props.isSearch ? (
                <Search
                    style={{ width: '100%' }}
                    onSearch={onSearch}
                    allowClear
                    className={styles.search}
                    placeholder="请输入要搜索的名称"
                />
            ) : null}
            <Tree
                //  switcherIcon={<CaretDownOutlined />}
                // key={loop(props.treeData)}
                treeData={treeData}
                style={{ width: '100%', height: '100%', overflowY: 'hidden' }}
                expandedKeys={expandedKeys.length ? expandedKeys : props.defaultExpandAll ? defalutExpandedKeys : []}
                onExpand={onExpand}
                autoExpandParent={autoExpandParent}
                selectedKeys={[...props.selectedKeys]}
                onSelect={onSelect}
                checkable={props.checkable}
                checkedKeys={props.checkedKeys}
                onCheck={props.onCheck}
                showLine={props.showLine}
                titleRender={props.titleRender}
            />
        </div>
    );
}
ITree.propTypes = {
    /**
     * 是否显示搜索框
     * @type {boolean}
     */
    isSearch: PropTypes.bool,
    /**
     * tree数据
     * @type {object}
     */
    treeData: PropTypes.array.isRequired,
    /**
     * 是否展开全部
     * @type {boolean}
     */
    defaultExpandAll: PropTypes.bool,
    /**
     * 样式
     */
    style: PropTypes.object,
    /**
     * 获取节点ID
     */
    onSelect: PropTypes.func,
    /**
     * 自定义树字段
     */
    field: PropTypes.object,
    /**
     * 选中的节点ID
     */
    selectedKeys: PropTypes.array,
    /**
     * 是否显示复选框
     */
    checkable: PropTypes.bool,
    /**
     * 复选框选中的节点
     */
    checkedKeys: PropTypes.array,
    /**
     * 点击复选框触发
     */
    onCheck: PropTypes.func,
    /**
     * tree的样式，一般是表示分割线
     */
    className: PropTypes.string,
    /**
     * 重新渲染树节点
     */
    titleRender: PropTypes.func,
};
ITree.defaultProps = {
    isSearch: false,
    defaultExpandAll: false,
    style: { width: '235px' },
    onSelect: () => {},
    field: { title: 'nodeName', key: 'nodeId', children: 'children' },
    selectedKeys: '',
    checkable: false,
    className: 'tree',
    titleRender: (node) => {
        return <span>{node.title}</span>;
    },
};
export default ITree;
