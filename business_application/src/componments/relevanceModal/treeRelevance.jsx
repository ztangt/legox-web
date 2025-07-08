/**
 * 关联用户单位岗位
 * （注意，请在相关的model里面定义selectedNodeId,selectedDataIds,treeData,currentNode,expandedKeys,treeSearchWord,
 * selectedDatas,originalData,selectNodeType）
 * (selectedDataIds是上次保存的数据id)
 * selectedDatas为选中的数据信息，selectedDataIds为选中的数据id
 */
import React, { useEffect } from 'react';
import ReSizeLeftRight from '../public/reSizeLeftRight';
import styles from './relevanceModal.less';
import { connect } from 'umi';
import RightSelectData from './rightSelectData';
import MiddleWaitData from './middleWaitData';
import PropTypes from 'prop-types';
import { renderCol } from './columns';
import { Tree, Input } from 'antd';
import _ from 'lodash';
import {
  ApartmentOutlined,
  AppstoreOutlined,
  BankOutlined,
  UserOutlined,
  BarsOutlined,
  CloseOutlined,
} from '@ant-design/icons';
function Index({
  dispatch,
  nameSpace,
  spaceInfo,
  orgUserType,
  selectButtonType,
  getOrgChildren,
  field,
  loading,
  searchOrgTree,
}) {
  const {
    selectedNodeId,
    selectedDataIds,
    treeData,
    expandedKeys,
    treeSearchWord,
    selectedDatas,
    originalData,
    oldOriginalData,
  } = spaceInfo;
  console.log('treeData123=', treeData);
  const { titleName, key, isLeaf, children } = field;
  useEffect(() => {
    //初始话
    dispatch({
      type: `${nameSpace}/updateStates`,
      payload: {
        selectedNodeId: '',
        selectedDatas: [],
        selectedDataIds: [],
        currentNode: [],
        expandedKeys: [],
        treeSearchWord: '',
        originalData: [],
      },
    });
  }, []);
  //展开收起
  const onExpand = (expandedKeys, { expanded, node }) => {
    if (expanded) {
      if (orgUserType == 'ORG') {
        //获取下级
        getOrgChildren(node);
      }
    }
    dispatch({
      type: `${nameSpace}/updateStates`,
      payload: {
        expandedKeys: expandedKeys,
      },
    });
  };
  //获取用户信息
  const onSelect = (selectedKeys, { selected, node }) => {
    if (selected) {
      dispatch({
        type: `${nameSpace}/updateStates`,
        payload: {
          selectedNodeId: node.nodeId,
        },
      });
      if (
        orgUserType == 'ORG' &&
        (node.nodeType == 'ORG' || node.nodeType == 'DEPT')
      ) {
        dispatch({
          type: 'formShow/queryUsers',
          payload: {
            start: 1,
            limit: 1000,
            orgId: node.nodeId,
          },
        });
      } else if (orgUserType == 'ORG' && node.nodeType == 'POST') {
        dispatch({
          type: 'formShow/getPostUserList',
          payload: {
            postId: node.nodeId,
          },
        });
      } else if (orgUserType == 'USER_GROUP') {
        dispatch({
          type: 'formShow/getGroupUserList',
          payload: {
            usergroupId: node.nodeId,
          },
        });
      } else if (orgUserType == 'ROLE') {
        dispatch({
          type: 'formShow/getRoleUserList',
          payload: {
            roleId: node.nodeId,
          },
        });
      }
    }
  };
  //重新组织树结构
  const loopTree = (data) => {
    return data.map((item) => {
      let index = -1;
      let beforeStr = '';
      let afterStr = '';
      if (treeSearchWord) {
        index = item[titleName].indexOf(treeSearchWord);
        beforeStr = item[titleName].substr(0, index);
        afterStr = item[titleName].substr(index + treeSearchWord.length);
      } else {
        index = -1;
      }
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: 'blue' }}>{treeSearchWord}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item[titleName]}</span>
        );
      if (item[children] && item[children].length) {
        return {
          title,
          key: item[key],
          isLeaf: item[isLeaf] && item[isLeaf] == '1' ? false : true,
          ...item,
          children: loopTree(item[children]),
        };
      }
      return {
        title,
        key: item[key],
        isLeaf: item[isLeaf] && item[isLeaf] == '1' ? false : true,
        ...item,
      };
    });
  };
  //左侧
  function leftRender() {
    return (
      <div style={{ height: '100%' }}>
        <span className={styles.title}>组织机构</span>
        <Input.Search
          onSearch={searchOrgTree}
          allowClear
          value={treeSearchWord}
          onChange={changeSearchTreeWord}
          className={styles.searchInput}
          style={{ marginBottom: '16px', marginTop: '16px' }}
        />
        <div style={{ height: 'calc(100% - 86px)', overflow: 'auto' }}>
          <Tree
            titleRender={(node) => (
              <span key={node.key} className={styles.tree_node}>
                {node.nodeType == 'DEPT' ? (
                  <ApartmentOutlined style={{ marginRight: 5 }} />
                ) : node.nodeType == 'ORG' ? (
                  <BankOutlined style={{ marginRight: 5 }} />
                ) : node.nodeType == 'POST' ? (
                  <AppstoreOutlined style={{ marginRight: 5 }} />
                ) : node.nodeType == 'USER' ? (
                  <UserOutlined style={{ marginRight: 5 }} />
                ) : (
                  ''
                )}
                {node.title}
              </span>
            )}
            treeData={loopTree(treeData)}
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            checkStrictly={true}
            key={loading.global}
            showLine={{ showLeafIcon: true }}
            showIcon={true}
            onSelect={onSelect}
            selectedKeys={[selectedNodeId]}
          />
        </div>
      </div>
    );
  }
  //关闭标签(关闭所以标签（清空）)
  const closeTag = (idValue, idKey) => {
    if (idValue) {
      selectedDataIds.splice(selectedDataIds.indexOf(idValue), 1);
      let newSelectedDatas = selectedDatas.filter(
        (item) => item[idKey] != idValue,
      );
      dispatch({
        type: `${nameSpace}/updateStates`,
        payload: {
          selectedDataIds: selectedDataIds,
          selectedDatas: newSelectedDatas,
        },
      });
    } else {
      dispatch({
        type: `${nameSpace}/updateStates`,
        payload: {
          selectedDataIds: [],
          selectedDatas: [],
        },
      });
    }
  };
  function changeSearchTreeWord(e) {
    dispatch({
      type: `${nameSpace}/updateStates`,
      payload: {
        treeSearchWord: e.target.value,
      },
    });
  }
  //搜索用户列表
  function updateUserList(value) {
    let newList = [];
    oldOriginalData.map((item) => {
      if (item.userName.includes(value)) {
        newList.push(item);
      }
    });
    dispatch({
      type: `${nameSpace}/updateStates`,
      payload: {
        originalData: newList,
      },
    });
  }
  //更新选择的用户ID
  const updateSelectIdsFn = (selectedDataIds, selectedDatas) => {
    dispatch({
      type: `${nameSpace}/updateStates`,
      payload: {
        selectedDataIds: selectedDataIds,
        selectedDatas: selectedDatas,
      },
    });
  };
  return (
    <div className={styles.user_warp}>
      <span className={styles.split_line}></span>
      <ReSizeLeftRight
        level={1}
        height={'100%'}
        leftChildren={leftRender(
          false,
          [],
          'DEPT',
          '请输入单位/部门名称',
          false,
        )}
        rightChildren={
          <ReSizeLeftRight
            level={2}
            height={'100%'}
            leftChildren={
              <MiddleWaitData
                originalData={originalData}
                selectIds={selectedDataIds}
                searchWordFn={updateUserList}
                updateSelectIdsFn={updateSelectIdsFn}
                selectedDatas={selectedDatas}
                idKey="identityId"
                nameKey="userName"
                selectedNodeId={selectedNodeId}
                searchWordHint="姓名/账号"
                selectButtonType={selectButtonType}
              />
            }
            rightChildren={
              <RightSelectData
                selectedDatas={_.cloneDeep(selectedDatas)}
                idKey="identityId"
                nameKey="userName"
                columns={renderCol('USER', closeTag)}
                closeTag={closeTag}
              />
            }
          />
        }
      />
    </div>
  );
}
Index.propTypes = {
  /**
   * nameSpace（model的命名）
   */
  nameSpace: PropTypes.string.isRequired,
  /**
   * model的state值
   */
  spaceInfo: PropTypes.object.isRequired,
  /**
   * 加载类型
   */
  orgUserType: PropTypes.string.isRequired,
  /**
   * 选择的按钮类型
   */
  selectButtonType: PropTypes.string,
  /**
   * 单位数展开获取的数据的函数
   */
  getOrgChildren: PropTypes.func,
  /**
   * 自定义树字段
   */
  field: PropTypes.object,
  /**搜索树 */
  searchOrgTree: PropTypes.func,
};
Index.defaultProps = {
  selectButtonType: 'checkBox',
  getOrgChildren: () => {},
  field: { titleName: 'nodeName', key: 'nodeId', children: 'children' },
  searchOrgTree: () => {},
};
export default connect(({ role, layoutG, loading }) => {
  return { role, layoutG, loading };
})(Index);
