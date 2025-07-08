import { Tree, Table, Spin, message, Input, Button } from 'antd';
import React from 'react';
import styles from './commonTreeMg.less';
import PropTypes from 'prop-types';
import '../global.less';
import { connect } from 'dva';
import _ from 'lodash';
import { history } from 'umi';
import {
  DeleteOutlined,
  FormOutlined,
  BankOutlined,
  ApartmentOutlined,
  ClusterOutlined,
} from '@ant-design/icons';
let parentNames = [];
let deptNames = [];
class TreeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      expandedKeys: [],
      treeSearchWord: '',
      currentNode: {},
      moudleName: '',
      props: {},
    };
    // this.onScrollEvent = this.onScrollEvent.bind(this);
  }

  componentDidMount() {
    const { nodeType, treeData, nodeIds, isAddress } = this.props;
    console.log('treeData', treeData);
    this.init(nodeType, treeData, nodeIds, isAddress);
  }

  // onScrollEvent() {
  //   if (this.scrollRef.scrollTop + this.scrollRef.clientHeight ===
  //     this.scrollRef.scrollHeight) {
  //       console.log('33333333333到底了');
  //       // 这里去做你的异步数据加载
  //   }
  // }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      treeData,
      expandedKeys,
      treeSearchWord,
      currentNode,
      nodeType,
      dispatch,
      moudleName,
    } = nextProps;

    const { props } = prevState;
    if (
      treeData !== props.treeData ||
      expandedKeys !== props.expandedKeys ||
      treeSearchWord !== props.treeSearchWord ||
      currentNode !== props.currentNode ||
      moudleName !== props.moudleName
    ) {
      return {
        treeData,
        expandedKeys,
        treeSearchWord,
        currentNode,
        moudleName,
        props: {
          treeData,
          expandedKeys,
          treeSearchWord,
          currentNode,
          moudleName,
        },
      };
    }
    return null;
  }

  init(nodeType, treeData, nodeIds, isAddress) {
    if (treeData.length == 0) {
      //左侧树无数据时再获取树信息
      this.getTreeData(nodeType, nodeIds, 0, isAddress);
    }
  }

  getTreeData(nodeType, nodeIds, child, isAddress) {
    const { dispatch, moudleName, isControl, treeType, type } = this.props;
    if (isControl) {
      dispatch({
        type: 'tree/getControlTree',
        payload: {
          nodeIds,
          treeType,
          type,
          child,
        },
        pathname: history.location.pathname, //当前路由路径
        moudleName: moudleName,
      });
    } else {
      dispatch({
        type: 'tree/getOrgChildren',
        payload: {
          isAddress,
          nodeType,
          nodeId: nodeIds ? nodeIds : '',
          start: 1,
          limit: 200,
        },
        pathname: history.location.pathname, //当前路由路径
        moudleName: moudleName,
      });
    }
  }

  //获取选中节点的父节点
  getParentKey(nodeKey, tree) {
    let self = this;
    const { treeData } = this.state;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node['children']) {
        if (node['children'].some((item) => item['key'] === nodeKey)) {
          if (node['nodeType'] == 'DEPT') {
            deptNames.push(node['title']);
          } else {
            parentNames.push(node['title']);
          }
          self.getParentKey(node['key'], treeData);
        } else if (self.getParentKey(nodeKey, node.children)) {
          self.getParentKey(nodeKey, node.children);
        }
      }
    }
  }

  /**
   *
   * @param {*} selectedKeys  选中节点key
   * @param {*} info info.node 当前节点信息
   */
  onSelect(selectedKeys, info) {
    parentNames = [];
    deptNames = [];
    const { dispatch, getData, moudleName } = this.props;
    const { treeData } = this.state;
    if (info.node) {
      if (
        `${
          moudleName ? moudleName : history.location.pathname.split('/')[1]
        }` == 'userInfoManagement'
      ) {
        this.getParentKey(info.node.key, treeData);
        dispatch({
          type: `userInfoManagement/updateStates`,
          payload: {
            currentNode: info.node,
            parentNames: parentNames,
            deptNames: deptNames,
          },
        });
      } else {
        dispatch({
          type: `${
            moudleName ? moudleName : history.location.pathname.split('/')[1]
          }/updateStates`,
          payload: {
            currentNode: info.node,
          },
        });
      }
      getData(info.node);
    }
  }

  //展开节点
  onExpand(expandedKeys, { expanded, node }) {
    const { dispatch, nodeType, moudleName } = this.props;
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

      dispatch({
        type: `${
          moudleName ? moudleName : history.location.pathname.split('/')[1]
        }/updateStates`,
        payload: {
          expandId: node.key,
          expandedKeys: Array.from(new Set(expandedKeys)),
        },
      });

      if (node.isParent == 1) {
        //当前点击节点为父节点  获取下一级数据
        if (moudleName == 'userView') {
          dispatch({
            type: 'tree/getPosts',
            payload: {
              searchWord: '',
              start: 1,
              limit: 200,
              deptId: node.nodeType == 'DEPT' ? node.key : '',
              orgId: node.nodeType == 'ORG' ? node.key : '',
            },
            callback: function () {
              this.getTreeData(nodeType, node.key, 1);
              // dispatch({
              //   type: 'tree/',
              //   payload:{
              //       nodeId: node.key,
              //       nodeType,
              //       start:1,
              //       limit:200
              //   },
              //   pathname: history.location.pathname,
              //   moudleName: moudleName,
              // })
            },
          });
        } else {
          this.getTreeData(nodeType, node.key, 1);

          // dispatch({
          //   type: 'tree/getOrgChildren',
          //   payload:{
          //       nodeId: node.key,
          //       nodeType,
          //       start:1,
          //       limit:200
          //   },
          //   pathname: history.location.pathname,
          //   moudleName: moudleName,
          // })
        }
      }
    } else {
      let arr = [];
      arr.push(node);
      this.loop(arr, expandedKeys);
    }
  }

  loop(arr, expandedKeys) {
    let self = this;
    const { dispatch, moudleName } = this.props;
    arr.forEach(function (item, i) {
      expandedKeys.forEach(function (policy, j) {
        if (policy == item.key) {
          expandedKeys.splice(j, 1);
        }
      });
      if (item.children && item.children.length != 0) {
        self.loop(item.children, expandedKeys);
      }
    });
    dispatch({
      type: 'tree/updateStates',
      payload: {
        expandedKeys,
      },
    });
    dispatch({
      type: `${
        moudleName ? moudleName : history.location.pathname.split('/')[1]
      }/updateStates`,
      payload: {
        expandedKeys: expandedKeys,
      },
    });
  }

  /**
   * 搜索组织树信息
   * @param {*} value
   */
  onSearchTree(value) {
    const {
      nodeType,
      dispatch,
      moudleName,
      treeType,
      type,
      isControl,
    } = this.props;
    const { treeData } = this.state;

    if (this.checkWOrd(value)) {
      message.error('查询条件不支持特殊字符，请更换其它关键字！');
      return;
    }
    if (isControl) {
      if (type != 'CURRENTORG' && type != 'ORGS' && type != 'HIGHERORG') {
        //非当前单位 限定单位 上级单位
        dispatch({
          type: 'tree/getControlTree',
          payload: {
            searchWord: value,
            nodeIds:
              type == 'ALLORGS'
                ? ''
                : treeData
                    .map((item) => {
                      return item.nodeId;
                    })
                    .join(','),
            treeType,
            type,
            child: 0,
          },
          pathname: history.location.pathname, //当前路由路径
          moudleName: moudleName,
        });
      }
    } else {
      if (value) {
        dispatch({
          type: 'tree/getSearchTree',
          payload: {
            searchWord: value,
            type: nodeType,
          },
          pathname: history.location.pathname,
          moudleName: moudleName,
        });
      } else {
        dispatch({
          type: 'tree/getOrgChildren',
          payload: {
            nodeType,
            start: 1,
            limit: 200,
          },
          pathname: history.location.pathname,
          moudleName: moudleName,
        });
      }
    }
  }

  /**
   * 搜索框内容校验是否包含特殊字符
   * @param {*校验值} value
   */
  checkWOrd(value) {
    let specialKey =
      "`@《》·~!%#$^&*=|{}':;'\\.<>/?~！#￥……&*|{}‘；：”“'。，、？‘'";
    for (let i = 0; i < value.length; i++) {
      if (specialKey.indexOf(value.substr(i, 1)) != -1) {
        return true;
      }
    }
    return false;
  }

  onChangeValue(e) {
    const { dispatch, moudleName } = this.props;
    dispatch({
      type: `${
        moudleName ? moudleName : history.location.pathname.split('/')[1]
      }/updateStates`,
      payload: {
        treeSearchWord: e.target.value,
      },
    });
  }

  //编辑树节点
  onEditTree(node, e) {
    e.stopPropagation();
    if (this.props.onEditTree) {
      this.props.onEditTree(node);
    }
  }

  //删除树节点
  onDeleteTree(node, e) {
    e.stopPropagation();
    if (this.props.onDeleteTree) {
      this.props.onDeleteTree(node);
    }
  }

  //选中
  onCheck(checkedKeys, { checked, node }) {
    if (typeof this.props.onCheck != 'undefined' && this.props.onCheck) {
      this.props.onCheck(checkedKeys, { checked, node });
    }
  }

  render() {
    const {
      plst,
      loading,
      checkedKeys,
      checkable,
      checkStrictly,
      isShowSearch,
      style,
      onAdd,
      isShowAdd,
    } = this.props;
    const { treeData, expandedKeys, treeSearchWord, currentNode } = this.state;
    console.log('treeData=', treeData);
    return (
      <div className={styles.tree}>
        {isShowSearch && (
          <Input.Search
            className={styles.tree_search}
            placeholder={plst}
            allowClear
            defaultValue={treeSearchWord}
            onChange={this.onChangeValue.bind(this)}
            onSearch={(value) => {
              this.onSearchTree(value);
            }}
          />
        )}
        {isShowAdd && (
          <Button
            onClick={onAdd.bind(this)}
            type="primary"
            style={{ width: 205, marginTop: 10 }}
          >
            添加根节点
          </Button>
        )}
        <Spin spinning={loading.global}>
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
                {
                  //根节点编辑操作

                  !node.parentId &&
                  history.location.pathname == '/unitInfoManagement' ? (
                    <FormOutlined
                      className={styles.edit}
                      onClick={this.onEditTree.bind(this, node)}
                    />
                  ) : (
                    ''
                  )
                }
                {
                  //根节点删除操作
                  !node.parentId &&
                  history.location.pathname == '/unitInfoManagement' ? (
                    <DeleteOutlined
                      className={styles.edit}
                      onClick={this.onDeleteTree.bind(this, node)}
                    />
                  ) : (
                    ''
                  )
                }
              </span>
            )}
            key={loading.global}
            className={styles.tree_list}
            onSelect={this.onSelect.bind(this)}
            treeData={treeData}
            onExpand={this.onExpand.bind(this)}
            selectedKeys={[currentNode.key]}
            expandedKeys={expandedKeys}
            showLine={{ showLeafIcon: false }}
            showIcon={true}
            checkable={checkable}
            onCheck={this.onCheck.bind(this)}
            checkStrictly={checkStrictly}
            checkedKeys={checkedKeys}
          />
        </Spin>
      </div>
    );
    // }else{
    //   return null
    // }
  }
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
  isShowAdd: false,
  onAdd: () => {},
  style: { height: '500px' },
};
export default connect(({ tree, loading, layoutG }) => ({
  tree,
  loading,
  ...layoutG,
}))(TreeSelect);
