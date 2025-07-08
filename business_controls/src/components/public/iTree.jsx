/**
 * 树节点的封装
 * tree[{}]
 */
import { Input, Tree } from 'antd';
import PropTypes from 'prop-types';
import { useState } from 'react';
import styles from './itree.less';
const Search = Input.Search;
function ITree(props) {
  const [searchValue, setSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const { titleName, key, children } = props.field;
  //将树节点展开为一级，并获取全部的末级数量，默认全部展开
  const dataList = [];
  const defalutExpandedKeys = [];
  const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const title = node[titleName];
      const nodeKey = node[key];
      dataList.push({ key: nodeKey, titleName: title });
      defalutExpandedKeys.push(nodeKey);
      if (node[children]) {
        generateList(node[children]);
      }
    }
  };
  generateList(props.treeData);
  //获取搜索内容的父节点然后展开
  const getParentKey = (nodeKey, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node[children]) {
        if (node[children].some((item) => item[key] === nodeKey)) {
          parentKey = node[key];
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
  // const onSearch=(e)=>{
  //   const value= e.target.value;
  //   setSearchValue(value);
  //   const expandedKeys = dataList
  //   .map(item => {
  //     if (item.titleName.indexOf(value) > -1) {
  //       return getParentKey(item.key, props.treeData);
  //     }
  //     return null;
  //   }).filter((item, i, self) => item && self.indexOf(item) === i);
  //   setExpandedKeys(expandedKeys)
  //   setAutoExpandParent(true)
  // }
  const onSelect = (selectedKeys, e) => {
    if (e.selected) {
      props.onSelect(selectedKeys, e);
    }
  };
  //重新组织树结构
  const loop = (data) => {
    return data.map((item) => {
      let index = -1;
      let beforeStr = '';
      let afterStr = '';
      if (searchValue) {
        index = item[titleName].indexOf(searchValue);
        beforeStr = item[titleName].substr(0, index);
        afterStr = item[titleName].substr(index + searchValue.length);
      } else {
        index = -1;
      }
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ background: 'rgba(255, 235, 117)' }}>
              {searchValue}
            </span>
            {afterStr}
          </span>
        ) : (
          <div>
            <span>{item[titleName]}</span>
          </div>
        );
      if (item[children] && item[children].length) {
        return {
          title,
          key: item[key],
          ...item,
          children: loop(item[children]),
        };
      }
      return {
        title,
        key: item[key],
        ...item,
      };
    });
  };
  return (
    <div style={props.style} className={styles[props.className]}>
      {/* {props.isSearch?
        <Search style={{width:"100%" }}  onChange={onSearch} className={styles.search} allowClear placeholder="请输入要搜索的名称"/>:
        null
      } */}
      <Tree
        treeData={loop(props.treeData)}
        style={{ width: '100%', height: '100%' }}
        expandedKeys={
          expandedKeys.length
            ? expandedKeys
            : props.defaultExpandAll
            ? defalutExpandedKeys
            : []
        }
        onExpand={onExpand}
        autoExpandParent={autoExpandParent}
        selectedKeys={[props.selectedKeys]}
        onSelect={onSelect}
        checkable={props.checkable}
        checkedKeys={props.checkedKeys}
        onCheck={props.onCheck}
        showLine={true}
        titleRender={props.titleRender}
        disabled={props.disabled}
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
  selectedKeys: PropTypes.string,
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
  /**
   * 将树禁用
   */
  disabled: PropTypes.bool,
};
ITree.defaultProps = {
  isSearch: false,
  defaultExpandAll: false,
  style: { width: '200px' },
  onSelect: () => {},
  field: { titleName: 'nodeName', key: 'nodeId', children: 'children' },
  selectedKeys: '',
  checkable: false,
  className: 'tree',
  titleRender: (node) => {
    return <span>{node.title}</span>;
  },
  disabled: false,
};
export default ITree;
