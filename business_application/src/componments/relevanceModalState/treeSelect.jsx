import { Tree, Table, Spin, message, Input } from 'antd'
import React, { useState, useEffect } from 'react'
import styles from '../../componments/commonTreeMg.less'
import PropTypes from 'prop-types'
import { checkWOrd } from '../../util/util'
import highSearch from '../../../public/assets/high_search.svg'
import {
  DeleteOutlined,
  FormOutlined,
  BankOutlined,
  ApartmentOutlined,
  ClusterOutlined,
} from '@ant-design/icons'
import { useModel } from 'umi'
import { useSetState } from 'ahooks'
import {connect} from 'dva';
let parentNames = []
let deptNames = []
function TreeSelect({
  nodeType,
  isShowSearch,
  plst,
  getData,
  checkable,
  onCheck,
  checkStrictly,
  isDisableCheckbox,
  checkedKeys,
  type,
  nodeIds,
  treeType,
  treeSelect,
  dispatch,
  onlySubDept,
  treeExcuteAuth,
  parentLoopTree
}) {
  const [state, setState] = useSetState({
    treeData: [],
    expandedKeys: [],
    treeSearchWord: '',
    currentNode: {},
    expandId: '',
    postList: [],
  })
  const {treeData,expandedKeys,treeSearchWord,currentNode,expandId,postList} = state;
  useEffect(() => {
    getOrgChildrenFn(
      {
        parentId:'',
        orgKind:'ORG', //左侧列表都是查询的ORG，然后查询单位下级的时候，如果查询的是部门那么传DEPT，查询的是单位传ORG
        searchWord:'',
      },
      [],
      []
    )
  }, [])
  const loop = (data) =>
    data &&
    data.length != 0 &&
    data.map((item) => {
      if (isDisableCheckbox) {
        if (item.nodeType == nodeType) {
          item['disableCheckbox'] = false
        } else {
          item['disableCheckbox'] = true
        }
      }
      if (item.key != -1) {
        let title = ''
        if (treeSearchWord) {
          const index = item.title.indexOf(treeSearchWord)
          const beforeStr = item.title.substr(0, index)
          const afterStr = item.title.substr(index + treeSearchWord.length)
          title =
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
            )
        } else {
          title = <span>{item.title}</span>
        }
        if (item.children) {
          return {
            ...item,
            title,
            key: item.key,
            children: loop(item.children),
          }
        }
        return {
          ...item,
          title,
          key: item.key,
        }
      } else {
        return {
          ...item,
        }
      }
    })
  //改变搜索框
  function onChangeValue(e) {
    setState({ treeSearchWord: e.target.value })
  }
  /**
   * 搜索组织树信息
   * @param {*} value
   */
  function onSearchTree(value) {
    if (checkWOrd(value)) {
      message.error('查询条件不支持特殊字符，请更换其它关键字！')
      return
    }
    getOrgChildrenFn({
      parentId:'',
      orgKind:'ORG', //左侧列表都是查询的ORG，然后查询单位下级的时候，如果查询的是部门那么传DEPT，查询的是单位传ORG
      searchWord:value,
    },[],[])
  }
  function getOrgChildrenFn(params,treeData,postList){
    dispatch({
      type:'treeSelect/getOrgChildren',
      payload:params,
      extraParams:{
        treeData,
        postList
      },
      state:state,
      callback:(treeData)=>{
        console.log('treeData===',treeData);
        setState({ treeData })
      }
    })
  }
  //展开
  function onExpand(expandedKeys, { expanded, node }) {
    expandedKeys.push(node.key)
    if (expanded) {
      if (node.isParent == 1 && node.children[0].key == -1) {
        //如果子集未加载到数据时删除该key值
        let index = expandedKeys.findIndex((value) => {
          return value == node.key
        })
        expandedKeys.splice(index, 1)
      }
      setState({
        expandedKeys: Array.from(new Set(expandedKeys)),
        expandId: node.key,
      })
      if (node.isParent == 1) {
        getOrgChildrenFn(
          {
            parentId:node.key,
            orgKind:'ORG', //左侧列表都是查询的ORG，然后查询单位下级的时候，如果查询的是部门那么传DEPT，查询的是单位传ORG
            searchWord:'',
          },
        );
      }
    } else {
      let arr = []
      arr.push(node)
      getLoopExpandedKeys(arr, expandedKeys)
    }
  }
  function getLoopExpandedKeys(arr, expandedKeys) {
    arr.forEach(function (item, i) {
      expandedKeys.forEach(function (policy, j) {
        if (policy == item.key) {
          expandedKeys.splice(j, 1)
        }
      })
      if (item.children && item.children.length != 0) {
        getLoopExpandedKeys(item.children, expandedKeys)
      }
    })
    setState({ expandedKeys: expandedKeys })
  }
  // function getLoopExpandedKeys(params){
  //   dispatch({
  //     type:"treeSelect/getLoopExpandedKeys",
  //     payload:params,
  //     callback:()=>{

  //     }
  //   })
  // }
  /**
   *
   * @param {*} selectedKeys  选中节点key
   * @param {*} info info.node 当前节点信息
   */
  function onSelect(selectedKeys, info) {
    if (info.node) {
      setState({ currentNode: info.node })
      getData(info.node)
    }
  }
  //选中
  function onTreeCheck(checkedKeys, { checked, node }) {
    if (typeof onCheck != 'undefined' && onCheck) {
      onCheck(checkedKeys, { checked, node })
    }
  }
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
            onSearchTree(value)
          }}
          enterButton={
            <img
              src={highSearch}
              style={{ margin: '0 8px 2px 0' }}
            />
          }
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
            </span>
          )}
          className={styles.tree_list}
          onSelect={onSelect.bind(this)}
          treeData={loop(parentLoopTree(treeData,nodeType))}
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
      </Spin>
    </div>
  )
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
   * 是否根据请求类型显示复选框的禁止
   */
  isDisableCheckbox: PropTypes.bool,
}
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
}
export default connect(({ treeSelect, loading }) => ({
  treeSelect,
  loading,
}))(TreeSelect);
