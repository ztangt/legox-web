import { checkWOrd } from '@/utils/utils'
import {
  ApartmentOutlined,
  BankOutlined,
  ClusterOutlined,
} from '@ant-design/icons'
import { Input, Tree, message } from 'antd'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'
import styles from './commonTreeMg.less'
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
}) {
  const {
    treeData,
    expandedKeys,
    treeSearchWord,
    currentNode,
    setState,
    getOrgChildrenFn,
    getSearchTreeFn,
    // getPostsFn,
  } = useModel('TreeSelect')
  const [tmpType, setTmpType] = useState(type) //由于控件的属性值已经定义好了，所以进来以后需要重新调整
  const [orgKind, setOrgKind] = useState(
    nodeType == 'ORG'
      ? 'ORG'
      : type == 'CURRENTORGCHILD' || type == 'ORGS'
      ? 'DEPT'
      : 'ORG_'
  )
  useEffect(() => {
    setState({
      treeData: [],
      expandedKeys: [],
      treeSearchWord: '',
      currentNode: {},
      postList: [],
    })
    if (
      !(
        window.localStorage.getItem('clientType') == 'PC' &&
        type == 'CURRENTORG'
      )
    ) {
      let newTmpType = ''
      switch (type) {
        case 'CURRENTORGCHILD':
          newTmpType = 'CURRENTORG'
          break
        case 'ORGS':
          newTmpType = 'ORGS'
          break
        case 'CURRENTORG':
          newTmpType = 'INCLUDESUB'
          break
        case 'HIGHERORG':
          newTmpType = 'HIGHERORG'
          break
        default:
          newTmpType = 'ALLORGS'
          break
      }
      setTmpType(newTmpType)
      setTimeout(() => {
        getOrgChildrenFn(
          {
            orgIds: nodeIds,
            treeType: newTmpType,
            orgKind: nodeType == 'ORG' ? 'ORG' : 'ORG_',
            searchWord: '',
          },
          [],
          []
        )
      }, 500)
    }
  }, [])

  const loop = (data: any) =>
    data &&
    data.length != 0 &&
    data.map((item: any) => {
      if (isDisableCheckbox) {
        if (item.nodeType == nodeType) {
          item['disableCheckbox'] = false
        } else {
          item['disableCheckbox'] = true
        }
      }
      if (item.key != -1) {
        let title: any = ''
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
  function onChangeValue(e: any) {
    setState({ treeSearchWord: e.target.value })
  }
  /**
   * 搜索组织树信息
   * @param {*} value
   */
  function onSearchTree(value: string) {
    if (checkWOrd(value)) {
      message.error('查询条件不支持特殊字符，请更换其它关键字！')
      return
    }
    if (value) {
      let orgIds = '' //打开控件的时候，把所有的nodeId用逗号进行拼接，treeType=ALLORGS：不传
      if (tmpType != 'ALLORGS') {
        //获取treeData一级数据单位ID
        treeData.map((item) => {
          if (orgIds) {
            orgIds = orgIds + ',' + item.nodeId
          } else {
            orgIds = item.nodeId
          }
        })
      }
      getSearchTreeFn({
        orgIds: orgIds,
        treeType: tmpType,
        orgKind: nodeType == 'ORG' ? 'ORG' : 'ORG_',
        searchWord: value,
      })
    } else {
      getOrgChildrenFn(
        {
          orgIds: nodeIds,
          treeType: tmpType,
          orgKind: nodeType == 'ORG' ? 'ORG' : 'ORG_',
          searchWord: value,
        },
        []
      )
    }
    setState({
      expandedKeys: [],
      expandId: '',
    })
  }
  //展开
  function onExpand(expandedKeys: Array<any>, { expanded, node }) {
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
        //当前点击节点为父节点  获取下一级数据（不用获取岗位）
        getOrgChildrenFn({
          orgIds: node.key,
          treeType: 'ALL',
          orgKind: orgKind,
          searchWord: '',
        })
      }
    } else {
      let arr = []
      arr.push(node)
      getLoopExpandedKeys(arr, expandedKeys)
    }
  }
  function getLoopExpandedKeys(arr: Array<any>, expandedKeys: Array<any>) {
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
  /**
   *
   * @param {*} selectedKeys  选中节点key
   * @param {*} info info.node 当前节点信息
   */
  function onSelect(selectedKeys: Array<any>, info: any) {
    if (info.node) {
      setState({ currentNode: info.node })
      getData(info.node, orgKind, tmpType)
    }
  }
  //选中
  function onTreeCheck(checkedKeys: Array<any>, { checked, node }) {
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
          defaultValue={''}
          onChange={onChangeValue.bind(this)}
          onSearch={(value) => {
            onSearchTree(value)
          }}
        />
      )}
      <Tree
        titleRender={(node: any) => (
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
        treeData={treeData.length ? loop(treeData) : []}
        onExpand={onExpand.bind(this)}
        selectedKeys={[currentNode.key]}
        expandedKeys={expandedKeys}
        showLine={{ showLeafIcon: true }}
        showIcon={true}
        checkable={checkable}
        onCheck={onTreeCheck.bind(this)}
        checkStrictly={checkStrictly}
        checkedKeys={checkedKeys}
      />
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
export default TreeSelect
