import { Input, Button, Tree, Table, Spin, Tabs } from 'antd';
import React from "react";
import styles from './commonRegisterTree.less';
import '../global.less'
import { connect } from 'dva';
import { history } from 'umi'
import _ from "lodash";
import ReSizeLeftRight from './public/reSizeLeftRight'

class TreeMg extends React.Component {
  state = {
    treeData: [],
    expandedKeys: [],
    treeSearchWord: '',
    currentNode: {},
    props: {},
    autoExpandParent: true,

  }
  componentDidMount() {
    const { dispatch, layoutG } = this.props;
    const { searchObj } = layoutG
    this.init(searchObj)
  }

  init(searchObj) {
    const { dispatch } = this.props
    //  if(searchObj[history.location.pathname].treeData.length==0){//左侧树无数据时再获取树信息
    dispatch({
      type: 'registerTree/getRegister',
      payload: {
        searchWord: '',
        limit: 100,
        start: 1
      },
      pathname: history.location.pathname.split('/support')?.[1],//当前路由路径
      // callback: function(data){//更新所对应路由下的树信息
      //   if(searchObj[history.location.pathname]){
      //     searchObj[history.location.pathname].treeData =  data
      //     searchObj[history.location.pathname].autoExpandParent = true
      //     dispatch({
      //       type: 'layoutG/updateStates',
      //       payload:{
      //         searchObj
      //       }
      //     })
      //   }
      // }

    })
    //  }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { treeData, expandedKeys, treeSearchWord, currentNode, autoExpandParent } = nextProps

    const { props } = prevState
    if (treeData != props.treeData ||
      expandedKeys !== props.expandedKeys ||
      treeSearchWord !== props.treeSearchWord ||
      currentNode !== props.currentNode ||
      autoExpandParent !== props.autoExpandParent

    ) {
      return {
        expandedKeys,
        treeSearchWord,
        currentNode,
        treeData,
        autoExpandParent,
        props: {
          expandedKeys,
          treeSearchWord,
          currentNode,
          treeData,
          autoExpandParent
        }
      }
    }
    return null


  }

  /**
   *
   * @param {*} selectedKeys  选中节点key
   * @param {*} info info.node 当前节点信息
   */
  onSelect(selectedKeys, info) {
    const { dispatch, getData, layoutG } = this.props
    const { searchObj } = layoutG
    if (info.node) {
      // if(searchObj[history.location.pathname]){
      //   searchObj[history.location.pathname].currentNode =  info.node
      dispatch({
        type: `${history.location.pathname.split("/")[2]}/updateStates`,
        payload: {
          currentNode: info.node
        }
      });
      dispatch({
        type: 'moduleResourceMg/updateStates',
        payload: {
          typeName: info.node.title.props.children[2]
        }
      });
    }
    getData(info.node)
    // }
  }

  render() {
    const { registerTree, plst, loading, leftRightSuffix,leftNum } = this.props;
    const { treeData } = registerTree;
    // const { searchObj } = layoutG;

    // if(searchObj[history.location.pathname] && Object.keys(searchObj[history.location.pathnameocation.pathname]).length > 0){
    const { expandedKeys, currentNode, treeSearchWord } = this.state;
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
          return { title, key: item.key, children: loop(item.children) };
        }
        return {
          title,
          key: item.key,
          registerCode: item.registerCode,
          registerFlag:item.registerFlag
        };
      });

    return (
      <div className={styles.container}>

        <ReSizeLeftRight
          leftChildren={
            <div className={styles.registerTree}>
              <p style={{ fontSize: '16px', fontWeight: '900' }}>注册系统</p>
              {/* <Spin  spinning={loading.global}  > */}
              <Tree
                key={loading.global}
                className={styles.tree_list}
                onSelect={this.onSelect.bind(this)}
                treeData={loop(treeData)}
                selectedKeys={[currentNode.key]}
                defaultExpandAll
                // expandedKeys={expandedKeys}
                showLine={{ showLeafIcon: true }}
              />
              {/* </Spin> */}

            </div>
          }
          rightChildren={
            <div className={styles.table}>
              {this.props.children}
            </div>
          }
          suffix={leftRightSuffix?leftRightSuffix:history.location.pathname.split('/support')?.[1]}
          vNum={leftNum}
        />
      </div>
    );
    // }else{
    //   return null
    // }
  }
}
export default connect(({ registerTree, loading, layoutG }) => ({
  registerTree,
  loading,
  layoutG,
}))(TreeMg);
