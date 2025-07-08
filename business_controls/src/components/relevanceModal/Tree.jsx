import {
  ApartmentOutlined,
  BankOutlined,
  ClusterOutlined,
} from '@ant-design/icons';
import { Input, Tree, message } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import styles from '../commonTreeMg.less';
let parentNames = [];
let deptNames = [];
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
}) {
  const [treeData, setTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [treeSearchWord, setTreeSearchWord] = useState('');
  const [currentNode, setCurrentNode] = useState({});
  const [expandId, setExpandId] = useState('');
  useEffect(() => {
    init(nodeType, treeData);
  }, []);
  function init(nodeType, treeData) {
    if (treeData.length == 0) {
      //左侧树无数据时再获取树信息
      // nodeType == 'DEPT' ? 'ORG'  最外层始终传ORG  子级按nodeType传
      // getOrgChildren('', nodeType == 'DEPT' ? 'ORG' : nodeType, '');
      getOrgChildren('', nodeType, '');
    }
  }
  function getOrgChildren(nodeId, nodeType, node) {
    if (nodeType == 'DEPT') {
      //部门树
      //treeType
      //CURRENTORG 当前单位
      //INCLUDESUB 当前单位(含下级)“
      //ALLORGS 所有单位
      //ORGS 指定单位(可多选)“
      //HIGHERORG 上级单位
      dispatch({
        type: 'treeState/getControlTree',
        payload: {
          orgIds: nodeId,
          orgKind: nodeId ? nodeType : 'ORG_', //部门树最外层传ORG_
          treeData: treeData,
          treeType: nodeId ? 'ALL' : 'INCLUDESUB', //最外层ALL 下级INCLUDESUB
        },
        nodeType: typeof node != 'undefined' && node ? node.nodeType : '', //拼接节点
        nodeId: typeof node != 'undefined' && node ? node.nodeId : '', //拼接节点
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
    } else {
      dispatch({
        type: 'treeState/getOrgChildren',
        payload: {
          nodeId: nodeId,
          nodeType,
          treeData: treeData,
          start: 1,
          limit: 200,
          onlySubPost: nodeType == 'POST' ? 1 : '',
        },
        nodeType: typeof node != 'undefined' && node ? node.nodeType : '', //拼接节点
        nodeId: typeof node != 'undefined' && node ? node.nodeId : '', //拼接节点
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
    let specialKey =
      "`@《》·~!%#$^&*=|{}':;'\\.<>/?~！#￥……&*|{}‘；：”“'。，、？‘'";
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
      if (nodeType == 'DEPT') {
        dispatch({
          type: 'treeState/getControlSearchTree',
          payload: {
            searchWord: value,
            orgKind: 'ORG_',
            orgIds: expandedKeys,
            treeType: 'INCLUDESUB',
          },
          callback: (treeData, expandedKeys) => {
            setTreeData(treeData);
            setExpandedKeys(expandedKeys);
          },
        });
      } else {
        dispatch({
          type: 'treeState/getSearchTree',
          payload: {
            searchWord: value,
            type: nodeType,
            expandedKeys,
            start: 1,
            limit: 20000,
          },
          callback: (treeData, expandedKeys) => {
            setTreeData(treeData);
            setExpandedKeys(expandedKeys);
          },
        });
      }
    } else {
      getOrgChildren('', nodeType, '');
    }
  }
  /**
   *
   * @param {*} selectedKeys  选中节点key
   * @param {*} info info.node 当前节点信息
   */
  function onSelect(selectedKeys, info) {
    if (info.node) {
      setCurrentNode(info.node);
      getData(info.node);
    }
  }
  const loop = (data) =>
    data &&
    data.length != 0 &&
    data.map((item) => {
      if (isDisableCheckbox) {
        if (item.nodeType == nodeType) {
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
              <span className={styles.siteTreeSearchValue}>
                {treeSearchWord}
              </span>
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
        if (nodeType == 'POST') {
          dispatch({
            type: 'treeState/getPosts',
            payload: {
              searchWord: '',
              start: 1,
              limit: 200,
              // deptId: node.nodeType == 'DEPT' ? node.key : '',
              // orgId: node.nodeType == 'ORG' ? node.key : '',
              deptId: node.key,
              orgId: node.key,
              requireOrgPost: 'NO',
              isEnable: 1,
            },
            callback: function () {
              getOrgChildren(node.key, nodeType, node);
            },
          });
        } else {
          getOrgChildren(node.key, nodeType, node);
        }
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
  function onTreeCheck(checkedKeys, { checked, node }) {
    if (typeof onCheck != 'undefined' && onCheck) {
      onCheck(checkedKeys, { checked, node });
    }
  }
  console.log('treeData123=', treeData);
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
      <Tree
        titleRender={(node) => (
          <span key={node.key} className={styles.tree_node}>
            {node.nodeType == 'DEPT' ? (
              <ApartmentOutlined style={{ marginRight: 5 }} />
            ) : node.nodeType == 'POST' ? (
              <ClusterOutlined style={{ marginRight: 5 }} />
            ) : (
              <BankOutlined style={{ marginRight: 5 }} />
            )}
            {node.title}
          </span>
        )}
        className={styles.tree_list}
        onSelect={onSelect.bind(this)}
        treeData={loop(treeData)}
        onExpand={onExpand.bind(this)}
        selectedKeys={[currentNode.key]}
        expandedKeys={expandedKeys}
        showLine={true}
        showIcon={true}
        checkable={checkable}
        onCheck={onTreeCheck.bind(this)}
        checkStrictly={checkStrictly}
        checkedKeys={checkedKeys}
      />
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
  nodeType: 'ORG',
  checkable: false,
  checkStrictly: false,
  checkedKeys: [],
  isShowSearch: true,
  style: { height: '500px' },
};
export default connect(({ treeState, loading, layoutG }) => ({
  treeState,
  loading,
  ...layoutG,
}))(TreeSelect);
