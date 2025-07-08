import { Tree,Table,Spin,message,Input,Radio} from 'antd';
import React from "react";
import styles from './commonTreeMg.less';
import PropTypes from 'prop-types';
import '../global.less'
import { connect } from 'dva';
import _ from "lodash";
import { history } from 'umi'
class TreeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tenantId: ''
    };
  }
  componentDidMount(){
    const {payload,searchObj} = this.props
    this.setState({tenantId:this.props.payload.tenantId})
    this.init(payload,searchObj);
  }
  componentWillReceiveProps(newProps){
    if(this.state.tenantId&&newProps.payload.tenantId!=this.state.tenantId){//点击组织中心则重新请求
      this.setState({tenantId:newProps.payload.tenantId})
      this.init(newProps.payload,newProps.searchObj)
    }
  }
  init(payload,searchObj){
    const {dispatch} = this.props
    if(searchObj[history.location.pathname]){
      //if(searchObj[history.location.pathname].treeData.length==0){//左侧树无数据时再获取树信息
        dispatch({
          type: 'tree/getTenantOrg',
          payload:{
           ...payload
          },
          pathname: history.location.pathname,//当前路由路径
          callback:()=>{
            this.props.extraTreeData()//额外的节点属性
          }
        })
      //}
    }

  }


    /**
     *
     * @param {*} selectedKeys  选中节点key
     * @param {*} info info.node 当前节点信息
     */
    onSelect(selectedKeys,info){
      const { dispatch, getData,searchObj } = this.props

      if(info.node){
        if(searchObj[history.location.pathname]){
          searchObj[history.location.pathname].currentNode =  info.node
          dispatch({
            type: 'layoutG/updateStates',
            payload:{
              searchObj
            }
          })
        }

        getData(info.node)
      }
    }

    //展开节点
    onExpand(expandedKeys, {expanded, node}){
      const { dispatch,payload,searchObj } = this.props;
      expandedKeys.push(node.key)
      if(expanded){
       // expandedKeys.push(node.key)
        if(node.isParent==1&&node.children[0].key==-1){//如果子集未加载到数据时删除该key值
          let index = expandedKeys.findIndex((value)=>{return value ==node.key})
          expandedKeys.splice(index, 1)
        }
        //更新所对应路由下的树信息（节点展开状态）
        if(searchObj[history.location.pathname]){
          searchObj[history.location.pathname].expandId =  node.key
          searchObj[history.location.pathname].expandedKeys =  Array.from(new Set(expandedKeys))
          dispatch({
            type: 'layoutG/updateStates',
            payload:{
              searchObj
            }
          })
        }

        if(node.isParent==1){ //当前点击节点为父节点  获取下一级数据
          dispatch({
            type: 'tree/getOrgTreeList',
            payload: {
              parentId:node.id,
              start:1,
              limit:200,
              orgKind: 'ORG_',
              searchWord:''
            },
            callback:()=>{
              //展开额外的操作
             this.props.extraExpand(node);//这个是为了别的地方展开以后有额外的操作
            }
          });
          // dispatch({
          //   type: 'tree/getOrgChildren',
          //   payload:{
          //     nodeType: 'ORG',
          //     orgCenterId: node.orgCenterId,
          //     nodeId: node.id,
          //     start:1,
          //     limit: 200
          //   },
          //   // pathname: history.location.pathname,
          //   callback:(data)=>{
          //     // console.log(data, '106')
          //     //展开额外的操作
          //    this.props.extraExpand(node);//这个是为了别的地方展开以后有额外的操作
          //   }
          // })
        }
      }else{
        let arr = [];
        arr.push(node)
        this.loop(arr,expandedKeys)
      }
    }

    loop(arr,expandedKeys){
      let self = this;
      const { dispatch,searchObj } = this.props
      arr.forEach(function(item,i) {
        expandedKeys.forEach(function(policy,j) {
          if(policy == item.key){
            expandedKeys.splice(j, 1)
          }
        });
        if(item.children&&item.children.length!=0){
          self.loop(item.children,expandedKeys)
        }
      });
      dispatch({
        type: 'tree/updateStates',
        payload:{
          expandedKeys
        }
      })
      if(searchObj[history.location.pathname]){
        searchObj[history.location.pathname].expandedKeys =  expandedKeys
        dispatch({
          type: 'layoutG/updateStates',
          payload:{
            searchObj
          }
        })
      }
    }

    /**
     * 搜索组织树信息
     * @param {*} value
     */
    onSearchTree(value){
      const { payload,dispatch,searchObj } = this.props
      if(this.checkWOrd(value)){
        message.error('搜索词中包含特殊字符！')
        return
      }
      if(value){
        dispatch({
          type: 'tree/getSearchTree',
          payload:{
            searchWord: value,
            type: payload.nodeType,
            ...payload
          },
          pathname: history.location.pathname,
        })
      }else{
        dispatch({
          type: 'tree/getTenantOrg',
          payload:{
            ...payload
          },
          pathname: history.location.pathname,
        })
      }
    }

    /**
     * 搜索框内容校验是否包含特殊字符
     * @param {*校验值} value
     */
    checkWOrd(value){
      let specialKey = "[`·~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
      for (let i = 0; i < value.length; i++) {
        if (specialKey.indexOf(value.substr(i, 1)) != -1) {
          return true
        }
      }
      return false
    }


    onChangeValue(e){
      const { dispatch,searchObj } = this.props
      // dispatch({
      //   type: 'tree/updateStates',
      //   payload:{
      //     searchWord: e.target.value.replace(/[^u4e00-u9fa5w]/g,'')
      //   }
      // })
      // if(this.checkWOrd(e.target.value)){
      //   message.error('请勿输入特殊字符')
      // }
      if(searchObj[history.location.pathname]){//更新搜索框
        searchObj[history.location.pathname].treeSearchWord =  e.target.value
        dispatch({
          type: 'layoutG/updateStates',
          payload:{
            searchObj
          }
        })
      }
    }

    onRightClick({event,node}){
      const { onEditTree } = this.props
      if(node.parentId==0){
        onEditTree(node);
      }
    }
    titleRender(self,nodeData){//title自定义渲染
      if(typeof self.props.titleRender!='undefined'){
        return self.props.titleRender(nodeData);
      }else{
        return <span>{nodeData.nodeName}</span>
      }
    }
    //选择复选框
    onCheckNode(self,checkedKeys,e){
      // console.log(checkedKeys,e, '111111')
      self.onCheckNode(checkedKeys,e);
    }
    render(){
        const { plst,loading,searchObj,isShowSearch,checkable} = this.props
        if(searchObj[history.location.pathname]&&searchObj[history.location.pathname].currentNode){
          const {expandedKeys, treeData,treeSearchWord,currentNode,checkedKeys,orgCenterId,checkOrgCenterId} = searchObj[history.location.pathname];
          if(checkOrgCenterId=="") {
            searchObj[history.location.pathname].treeData = [];
          } else {
            searchObj[history.location.pathname].treeData = searchObj[history.location.pathname].treeData;
          }
          return(

            <div className={styles.tree}>
              {isShowSearch&&
              <Input.Search
                className={styles.tree_search}
                placeholder={plst}
                allowClear
                defaultValue={treeSearchWord}
                onChange={this.onChangeValue.bind(this)}
                onSearch={(value)=>{this.onSearchTree(value)}}
              />}
              <Spin  spinning={loading.global}  >
                <Tree
                  key={loading.global}
                  className={styles.tree_list}
                  onSelect={this.onSelect.bind(this)}
                  treeData={treeData}
                  onExpand={this.onExpand.bind(this)}
                  selectedKeys={[currentNode.key]}
                  expandedKeys={expandedKeys}
                  showLine={{showLeafIcon: false}}
                  showIcon={true}
                  onRightClick={this.onRightClick.bind(this)}
                  // titleRender={this.titleRender.bind(_,this)}
                  checkable={checkable}
                  onCheck={this.onCheckNode.bind(this,this.props)}
                  // onCheck={this.onCheckNode.bind(this)}
                  checkedKeys={checkedKeys}
                  checkStrictly={this.props.checkStrictly}
                  disabled={this.props.disabled}
                />
              </Spin>

            </div>


        );
        }else{
          return null
        }

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
  getData:PropTypes.func,
    /**
   *点击右键编辑树节点
   */
  onEditTree:PropTypes.func,
  /**
   * 节点类型
   */
  payload:PropTypes.object,
  /**
   * 是否显示搜索
   */
  isShowSearch:PropTypes.bool,
  /**
   * title自定义渲染
   */
  titleRender:PropTypes.func,
  /**
   * 是否显示复选框
   */
  checkable:PropTypes.bool,
  /**
   * 父子节点的选中与否不再关联
   */
  checkStrictly:PropTypes.bool,
  /**
   * 展开额外的操作
   */
  extraExpand:PropTypes.func,
  /**是否禁用树 */
  disabled:PropTypes.bool
}
TreeSelect.defaultProps = {
  /**
   * 节点类型
   */
  payload:{nodeType:'ORG'},
  /**
   * 是否显示搜索
   */
  isShowSearch:true,
  checkable:false,
  checkStrictly:false,
  extraExpand:()=>{},
  extraTreeData:()=>{},
  disabled:false
}
export default connect(({tree,loading,layoutG})=>({
  tree,
  loading,
  ...layoutG
}))(TreeSelect);

