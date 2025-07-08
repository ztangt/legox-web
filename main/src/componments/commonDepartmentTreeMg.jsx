import { Input, Button, Tree, Table, Spin, Tabs, message } from 'antd';
import React from "react";
import styles from './commonDepartmentTreeMg.less';
import '../global.less'
import { connect } from 'dva';
import { history } from 'umi'
import _ from "lodash";
import ReSizeLeftRight from './public/reSizeLeftRight'
import searchIcon from '../../public/assets/search_black.svg'
const { Search } = Input;

let dataList = [];
let defalutExpandedKeys = [];
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key, nodeName } = node;
    defalutExpandedKeys.push(key)
    dataList.push({ key, title: nodeName });
    if (node.children) {
      generateList(node.children);
    }
  }
};

//获取搜索内容的父节点然后展开
const getParentKey = (nodeKey, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node['children']) {
      if (node['children'].some(item => item['key'] === nodeKey)) {
        parentKey = node['key'];
      } else if (getParentKey(nodeKey, node.children)) {
        parentKey = getParentKey(nodeKey, node.children);
      }
    }
  }
  return parentKey;
};

const unique = arr => {
  return Array.from(new Set(arr))
}

class TreeMg extends React.Component {
  state = {
    treeData: [],
    expandedKeys: [],
    treeSearchWord: '',
    currentNode: {},
    props: {},
    autoExpandParent: true,
    height: '100%',

  }

  componentDidMount() {
    const { dispatch, nodeType, layoutG, departmentTree } = this.props;
    const { treeData } = departmentTree;
    const { searchObj } = layoutG
    this.init(nodeType, searchObj)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { treeData, expandedKeys, treeSearchWord, currentNode, autoExpandParent, height } = nextProps

    const { props } = prevState
    if (treeData != props.treeData ||
      expandedKeys !== props.expandedKeys ||
      treeSearchWord !== props.treeSearchWord ||
      currentNode !== props.currentNode ||
      autoExpandParent !== props.autoExpandParent ||
      height !== props.height

    ) {
      return {
        expandedKeys,
        treeSearchWord,
        currentNode,
        treeData,
        autoExpandParent,
        height,
        props: {
          expandedKeys,
          treeSearchWord,
          currentNode,
          treeData,
          autoExpandParent,
          height
        }
      }
    }
    return null


  }

  init(type, searchObj) {

    const { dispatch, treeData,getData } = this.props;
    if (treeData.length == 0 && history.location.pathname.split("/")[2] != 'dataDriven') {//左侧树无数据时再获取树信息
      dispatch({
        type: 'departmentTree/getCtlgTree',
        payload: {
          type,
          hasPermission: 0,//是否带有权限详情
        },
        pathname: history.location.pathname,//当前路由路径
        callback: function (data) {//更新所对应路由下的树信息
          dispatch({
            type: `${history.location.pathname.split("/")[2]}/updateStates`,
            payload: {
              treeData: data,
              // currentNode: data[0]
            }
          })
          // getData(data[0])
        }

      })
    }
  }

  /**
   * 
   * @param {*} selectedKeys  选中节点key
   * @param {*} info info.node 当前节点信息
   */
  onSelect(selectedKeys, info) {
    const { dispatch, getData } = this.props
    if (info.node) {
      dispatch({
        type: `${history.location.pathname.split("/")[2]}/updateStates`,
        payload: {
          // selectTreeUrl: info.node.url,
          currentNode: info.node
        }
      })
      getData(info.node)
    }
  }

  onExpand(expandedKeys, { expanded, node }) {
    console.log(expandedKeys, expanded, node, 'sssssss');
    const { dispatch, nodeType, layoutG } = this.props
    const { searchObj } = layoutG;
    expandedKeys.push(node.key)
    if (expanded) {
      dispatch({
        type: `${history.location.pathname.split("/")[2]}/updateStates`,
        payload: {
          expandedKeys: unique(expandedKeys),
          autoExpandParent: false
        }
      })
      dispatch({
        type: 'departmentTree/updateStates',
        payload: {
          expandedKeys: unique(expandedKeys),
        }
      })
    } else {
      let index = expandedKeys.findIndex((value) => { return value == node.key })
      expandedKeys.splice(index, 1)
      dispatch({
        type: `${history.location.pathname.split("/")[2]}/updateStates`,
        payload: {
          expandedKeys: expandedKeys,
          autoExpandParent: false
        }
      })
      dispatch({
        type: 'departmentTree/updateStates',
        payload: {
          expandedKeys
        }
      })
    }
  }
  onSearchTree(value) {
    defalutExpandedKeys = []
    if (this.checkWOrd(value)) {
      message.error('查询条件不支持特殊字符，请更换其它关键字！')
      return
    }
    
    // dataList = [];
    const { departmentTree, dispatch, layoutG,onSearch } = this.props;
    const { treeData } = departmentTree;
    onSearch&&onSearch(value)
    if (history.location.pathname.split("/")[2] == 'dataDriven') {
      return
    }
    const { searchObj } = layoutG;
    generateList(treeData);

    const expandedKey = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      }).filter((item, i, self) => item && self.indexOf(item) === i);
      console.log('expandedKey',expandedKey);
    // let arr = dataList.filter(function(item){
    //   return item.title.indexOf(value) > -1
    // })
    // let newArr = []
    // arr.forEach(function(item,i){
    //   newArr.push(item.key)
    // })
    dispatch({
      type: `${history.location.pathname.split("/")[2]}/updateStates`,
      payload: {
        expandedKeys: expandedKey,
        autoExpandParent: true,
        treeSearchWord: value
      }
    })
    if (!value) {
      let obj = {}
      obj.sourceModeId = ''
      obj.targetModeId = ''
      obj.sourceModeName = ''
      obj.targetModelName = ''
      dispatch({
        type: `${history.location.pathname.split("/")[2]}/updateStates`,
        payload: {
          currentNode: {},
          dataDrives: [],
          dataDrive: obj
        }
      })
    }
  }

  checkWOrd(value) {
    let specialKey = "@[`·~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
    for (let i = 0; i < value.length; i++) {
      if (specialKey.indexOf(value.substr(i, 1)) != -1) {
        return true
      }
    }
    return false
  }


  onChangeValue(e) {
    const { dispatch, layoutG } = this.props
    const { searchObj } = layoutG
    // dispatch({
    //   type: 'tree/updateStates',   
    //   payload:{
    //     searchWord: e.target.value.replace(/[^u4e00-u9fa5w]/g,'')
    //   }
    // })
    // if(this.checkWOrd(e.target.value)){
    //   message.error('请勿输入特殊字符')
    // }
    dispatch({
      type: `${history.location.pathname.split("/")[2]}/updateStates`,
      payload: {
        treeSearchWord: e.target.value
      }
    })
  }

  render() {
    const { departmentTree, plst, loading,isOverFlow ,leftNum,moudleName} = this.props;
    const { treeData, expandedKeys, treeSearchWord, currentNode, autoExpandParent, height } = this.state
    console.log("currentNode111",currentNode)
    // if(Object.keys(searchObj[history.location.pathname]).length > 0){
    const searchWord = treeSearchWord ? treeSearchWord : '';
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchWord);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchWord.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className={styles.siteTreeSearchValue}>{searchWord}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return { title, key: item.key, nodeName: item.nodeName ? item.nodeName : '', nodeType: item.nodeType ? item.nodeType : '', children: loop(item.children) };
        }
        return {
          title,
          key: item.key,
          nodeType: item.nodeType ? item.nodeType : '',
          nodeName: item.nodeName ? item.nodeName : '',
          deployFormId: item.deployFormId ? item.deployFormId : '',
          deployFormVersion: item.deployFormVersion ? item.deployFormVersion : '',
          basicDataFlag: item.basicDataFlag ? item.basicDataFlag : '',
          deployFlag: item.deployFlag ? item.deployFlag : '',
        };
      });
    // let loadingTree = false
    // if(loading.effects[`departmentTree/getCtlgTree`]!=undefined){
    //   loadingTree = loading.effects[`departmentTree/getCtlgTree`]
    // }else if(loading.effects[`${history.location.pathname.split("/")[1]}/getBizSolTree`]!=undefined){
    //   loadingTree = loading.effects[`${history.location.pathname.split("/")[1]}/getBizSolTree`]
    // }else if(loading.effects[`${history.location.pathname.split("/")[1]}/getCtlgTree`]!=undefined){
    //   loadingTree = loading.effects[`${history.location.pathname.split("/")[1]}/getCtlgTree`]
    // }
    return (
      <div className={styles.container} >
        <ReSizeLeftRight
          height={height}
          suffix={moudleName}
          vNum={leftNum}
          leftChildren={
            <div style={ isOverFlow?{display:'flex'}:{}} className={styles.main}>
              <div className={styles.main_header}>
                <Input.Search
                  className={styles.tree_search}
                  placeholder={plst}
                  allowClear
                  defaultValue={treeSearchWord}
                  onChange={this.onChangeValue.bind(this)}
                  onSearch={(value) => { this.onSearchTree(value) }}
                  enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
                />
              </div>
              <div className={styles.main_body}>
                <Spin spinning={false}>
                  <Tree
                    // key={loop(treeData)}
                    className={styles.tree_list}
                    onSelect={this.onSelect.bind(this)}
                    treeData={loop(treeData)}
                    onExpand={this.onExpand.bind(this)}
                    selectedKeys={[currentNode.key]}
                    autoExpandParent={autoExpandParent}
                    expandedKeys={expandedKeys.length ? expandedKeys : defalutExpandedKeys}
                    showLine={true}
                    showIcon={true}
                  />
                </Spin>
              </div>
            </div>
          }
          rightChildren={
            <div className={isOverFlow? styles.table_wap:styles.table}>
              {this.props.children}
            </div>
          }
        />
      </div>
    );
    // }else{
    //   return null
    // }
  }
}
export default connect(({ departmentTree, loading, layoutG }) => ({
  departmentTree,
  loading,
  layoutG,
}))(TreeMg);