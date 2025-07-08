import {
  ApartmentOutlined,
  BankOutlined,
  ClusterOutlined,
} from '@ant-design/icons';
import { useSetState } from 'ahooks';
import { Input, Tree, message } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import highSearch from '../../../../public/assets/high_search.svg';
import styles from './commonTreeMg.less';
const BudgetPreparation = ({
  dispatch,
  onCheck,
  defaultCheckedKeys,
  checkStrictly,
  checkable,
  plst,
  isShowSearch,
  loading,
  otherTitleRender,
  treeData,
  currentOrgNode,
  getData,
  usedYear,
  currentNode,
  budgetStage,
  projectRefinement,
}) => {
  const { projectTreeSearchWord } = projectRefinement;
  const [state, setState] = useSetState({
    expandedKeys: [],
    checkedKeys: defaultCheckedKeys,
  });
  const { expandedKeys, checkedKeys } = state;
  useEffect(() => {
    //获取全部的项目树信息
    getDataSource({}, '', {});
  }, []);
  useEffect(() => {
    setState({ expandedKeys: [] }); //清空展开数据
  }, [usedYear, currentOrgNode.id]);
  const getDataSource = (nodeInfo, searchWord, currentOrgNode) => {
    //获取项目树
    dispatch({
      type: 'projectRefinement/getBudPreProjectTree',
      payload: {
        budgetStage: budgetStage,
        searchWord: searchWord,
        parentId: nodeInfo?.nodeId || '',
        usedYear: usedYear,
        orgId: currentOrgNode.id || '',
        treeType: nodeInfo.treeType,
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
    setState({ expandedKeys: [] }); //清空展开数据
    getDataSource('', value, currentOrgNode);
    dispatch({
      type: 'projectRefinement/updateStates',
      payload: {
        projectTreeSearchWord: value,
      },
    });
  };
  /**
   *
   * @param {*} selectedKeys  选中节点key
   * @param {*} info info.node 当前节点信息
   */
  const onSelect = (selectedKeys, info) => {
    if (!currentOrgNode.id) {
      message.error('请先选择单位');
      return;
    }
    dispatch({
      type: 'projectRefinement/updateStates',
      payload: {
        currentNode: info.node,
      },
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
        getDataSource(node, projectTreeSearchWord, currentOrgNode);
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
  // const onCheckFn = (checkedKeys, { checked, node }) => {
  //   if (typeof onCheck != 'undefined' && onCheck) {
  //     onCheck(checkedKeys, { checked, node });
  //   }
  //   setState({
  //     checkedKeys: checkedKeys,
  //   });
  // };
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
      {/* <Spin spinning={loading.global}> */}
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
            {otherTitleRender ? otherTitleRender : null}
          </span>
        )}
        key={loading.global}
        className={styles.tree_list}
        onSelect={onSelect.bind(this)}
        treeData={treeData}
        onExpand={onExpand.bind(this)}
        selectedKeys={[currentNode.key]}
        expandedKeys={expandedKeys}
        showLine={{ showLeafIcon: false }}
        showIcon={true}
        // checkable={checkable}
        // onCheck={onCheckFn.bind(this)}
        // checkStrictly={checkStrictly}
        // checkedKeys={checkedKeys}
      />
      {/* </Spin> */}
    </div>
  );
};
BudgetPreparation.propTypes = {
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
BudgetPreparation.defaultProps = {
  checkable: false,
  checkStrictly: false,
  checkedKeys: [],
  isShowSearch: true,
  style: { height: '500px' },
};
export default connect(({ projectRefinement, loading }) => ({
  projectRefinement,
  loading,
}))(BudgetPreparation);
