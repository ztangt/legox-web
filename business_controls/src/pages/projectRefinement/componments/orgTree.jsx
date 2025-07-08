import { Input, Spin, Tree, message } from 'antd';
import PropTypes from 'prop-types';
import styles from './commonTreeMg.less';
// import '../global.less';
import {
  ApartmentOutlined,
  BankOutlined,
  ClusterOutlined,
} from '@ant-design/icons';
import { useSetState } from 'ahooks';
import { connect } from 'dva';
import { useEffect } from 'react';
import Icon from '../../../../Icon';
import highSearch from '../../../../public/assets/high_search.svg';
const OrgTree = ({
  dispatch,
  onCheck,
  defaultCheckedKeys,
  checkStrictly,
  checkable,
  plst,
  isShowSearch,
  loading,
  otherTitleRender,
  getData,
  usedYear,
  budgetStage,
}) => {
  const [state, setState] = useSetState({
    treeData: [],
    expandedKeys: [],
    currentNode: {},
    checkedKeys: defaultCheckedKeys,
    searchWord: '',
  });
  const { treeData, expandedKeys, currentNode, checkedKeys } = state;
  useEffect(() => {
    //获取单位数
    getBudPreOrgTree('', '');
  }, []);
  useEffect(() => {
    //清空选中状态
    if (/^\d{4}$/.test(usedYear)) {
      setState({ currentNode: {} });
    }
  }, [usedYear]);
  const getBudPreOrgTree = (
    parentId,
    searchWord,
    lockOrgCode,
    unLockOrgCode,
  ) => {
    dispatch({
      type: 'orgTree/getBudPreOrgTree',
      payload: {
        parentId,
        searchWord,
        budgetStage: budgetStage,
        lockOrgCode: lockOrgCode || '',
        unLockOrgCode: unLockOrgCode || '',
      },
      state: state,
      callback: (data) => {
        setState({
          treeData: data,
        });
      },
    });
  };
  /**
   * 搜索框内容校验是否包含特殊字符
   * @param {*校验值} value
   */
  const checkWOrd = (value) => {
    let specialKey =
      "`@《》·~!%#$^&*=|{}':;'\\.<>/?~！#￥……&*|{}‘；：”“'。，、？‘'";
    for (let i = 0; i < value.length; i++) {
      if (specialKey.indexOf(value.substr(i, 1)) != -1) {
        return true;
      }
    }
    return false;
  };
  /**
   * 搜索组织树信息
   * @param {*} value
   */
  const onSearchTree = (value) => {
    if (checkWOrd(value)) {
      message.error('查询条件不支持特殊字符，请更换其它关键字！');
      return;
    }
    getBudPreOrgTree('', value);
    //清空展开节点
    setState({
      expandedKeys: [],
      searchWord: value,
    });
  };
  /**
   *
   * @param {*} selectedKeys  选中节点key
   * @param {*} info info.node 当前节点信息
   */
  const onSelect = (selectedKeys, info) => {
    setState({
      currentNode: info.node,
    });
    getData(info.node);
  };
  //展开节点
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
      setState({
        expandedKeys: Array.from(new Set(expandedKeys)),
      });
      if (node.isParent == 1) {
        //当前点击节点为父节点  获取下一级数据
        getBudPreOrgTree(node.id, '');
      }
    } else {
      let arr = [];
      arr.push(node);
      loop(arr, expandedKeys);
    }
  };
  const loop = (arr, expandedKeys) => {
    arr.forEach(function (item, i) {
      expandedKeys.forEach(function (policy, j) {
        if (policy == item.key) {
          expandedKeys.splice(j, 1);
        }
      });
      if (item.children && item.children.length != 0) {
        loop(item.children, expandedKeys);
      }
    });
    setState({
      expandedKeys,
    });
  };
  //选中
  const onCheckFn = (checkedKeys, { checked, node }) => {
    if (typeof onCheck != 'undefined' && onCheck) {
      onCheck(checkedKeys, { checked, node });
    }
    setState({
      checkedKeys: checkedKeys,
    });
  };
  const lockOrgFn = (isLock, node) => {
    if (isLock == '0') {
      //解锁
      getBudPreOrgTree('', state.searchWord, '', node.orgCode);
    } else {
      //锁定
      getBudPreOrgTree('', state.searchWord, node.orgCode, '');
    }
  };
  return (
    <div className={styles.tree}>
      {isShowSearch && (
        <Input.Search
          className={styles.tree_search}
          placeholder={plst}
          allowClear
          enterButton={
            <img src={highSearch} style={{ margin: '0 8px 2px 0' }} />
          }
          onSearch={(value) => {
            onSearchTree(value);
          }}
        />
      )}
      <Spin spinning={false}>
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
              {budgetStage && budgetStage != '0' ? (
                node.isLock == '0' ? (
                  <Icon
                    type="icon-guansuo"
                    onClick={lockOrgFn.bind(this, '1', node)}
                    style={{ marginLeft: '4px' }}
                  />
                ) : (
                  <Icon
                    type="icon-kaisuo"
                    onClick={lockOrgFn.bind(this, '0', node)}
                    style={{ marginLeft: '4px' }}
                  />
                )
              ) : null}
              {otherTitleRender ? otherTitleRender : null}
            </span>
          )}
          // className={styles.tree_list}
          onSelect={onSelect.bind(this)}
          treeData={treeData}
          onExpand={onExpand.bind(this)}
          selectedKeys={[currentNode.key]}
          expandedKeys={expandedKeys}
          showLine={{ showLeafIcon: false }}
          showIcon={true}
          checkable={checkable}
          onCheck={onCheckFn.bind(this)}
          checkStrictly={checkStrictly}
          checkedKeys={checkedKeys}
        />
      </Spin>
    </div>
  );
};
OrgTree.propTypes = {
  /**
   * 搜索框提示文本
   */
  plst: PropTypes.string,
  /**
   * 点击树节点获取相关数据信息
   */
  getData: PropTypes.func,
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
   * 标题后面其他的操作icon
   */
  otherTitleRender: PropTypes.element,
};
OrgTree.defaultProps = {
  checkable: false,
  checkStrictly: false,
  checkedKeys: [],
  isShowSearch: true,
  style: { height: '500px' },
};
export default connect(({ orgTree, loading }) => ({
  orgTree,
  loading,
}))(OrgTree);
