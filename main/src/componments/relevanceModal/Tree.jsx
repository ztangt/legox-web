import { Tree,Table,Spin,message,Input,Button,Tooltip} from 'antd';
import React,{useState,useEffect,useCallback} from "react";
import styles from './tree.less';
import PropTypes from 'prop-types';
import { connect } from 'dva';
// ../../../util/util.js
import { checkWOrd } from '../../util/util.js'
import _ from "lodash";
import { history } from 'umi'
import {  DeleteOutlined, FormOutlined, BankOutlined, ApartmentOutlined,ClusterOutlined } from '@ant-design/icons';
let parentNames = [];
let deptNames = []
function TreeSelect({dispatch,nodeType,isShowSearch,plst,getData,checkable,onCheck,checkStrictly,
  isDisableCheckbox,checkedKeys,orgKind,selectOrgId,unitAllRole}){
    console.log('nodeType==',nodeType);
  const [treeData,setTreeData] = useState([]);
  const [expandedKeys,setExpandedKeys] = useState([]);
  const [treeSearchWord,setTreeSearchWord] = useState('');
  const [currentNode,setCurrentNode] = useState({});
  const [expandId,setExpandId] = useState('');
  const pathname=history.location.pathname
  const moudleName=pathname.split('/')[2]
  const [visibleItems, setVisibleItems] = useState(50);
  //左侧列表都是查询的ORG，然后查询单位下级的时候，如果查询的是部门那么传DEPT，查询的是单位传ORG
  useEffect(()=>{
    init(nodeType,treeData)
    const container = document.getElementById(`${moudleName}_Tree`);
    // 当列表容器滚动到底部时加载更多数据
    const handleScroll = (e) => {
      const scrollTop=e.target.scrollTop
      const scrollHeight=e.target.scrollHeight
      if (Math.ceil(scrollTop + container.clientHeight) >= scrollHeight) {
        loadMore();
      }
      if(scrollTop == 0){
        setVisibleItems(50)
      }
    };
    container.addEventListener('scroll', handleScroll,true);
    return () => {
      container.removeEventListener('scroll', handleScroll,false);
    };
  },[])
  const loadMore=useCallback(()=>{
    setVisibleItems((prevVisibleItems)=>{
      return prevVisibleItems+50
    })
  },[])
  function init(nodeType,treeData){
    if(treeData.length==0){//左侧树无数据时再获取树信息
      getOrgChildren('',nodeType,'',1);
    }
  }
  // function getOrgChildren(nodeId,nodeType,node,onlySubDept){
  //   dispatch({
  //     type: 'treeState/getOrgChildren',
  //     payload:{
  //       nodeId:nodeId,
  //       nodeType,
  //       treeData:treeData,
  //       start:1,
  //       limit:200,
  //       onlySubDept:pathname=="/unitRole"||'/sysRole'||'/allRole'?onlySubDept:''
  //     },
  //     nodeType:typeof node!='undefined'&&node?node.nodeType:"",//拼接节点
  //     nodeId:typeof node!='undefined'&&node?node.nodeId:'',//拼接节点
  //     nodePath:typeof node!='undefined'&&node?(node.nodePath?JSON.stringify(node.nodePath):JSON.stringify([])):"",//拼接节点
  //     callback:(treeData)=>{
  //       setTreeData(treeData)
  //     }
  //   })
  // }
  function getOrgChildren(nodeId,nodeType,node,onlySubDept){
    let params={
      parentId:nodeId,
      orgKind:nodeType,
      treeData:treeData,
      searchWord:'',
      isEnable:1
    }
    if(pathname.includes('/unitRole')&&unitAllRole&&!params.parentId){
      params = {
        ...params,
        orgId: selectOrgId
      }
    }
    dispatch({
      type: 'treeState/getOrgTree',
      payload: params,
      // payload:{
      //   // onlySubDept:pathname=="/unitRole"||'/sysRole'||'/allRole'?onlySubDept:''
      // },
      nodeType:typeof node!='undefined'&&node?node.orgKind:"",//拼接节点
      nodeId:typeof node!='undefined'&&node?node.id:'',//拼接节点
      nodePath:typeof node!='undefined'&&node?(node.nodePath?JSON.stringify(node.nodePath):JSON.stringify([])):"",//拼接节点
      callback:(treeData)=>{
        setTreeData(treeData)
      }
    })
  }
  //改变搜索框
  function onChangeValue(e){
    setTreeSearchWord(e.target.value);
  }
  /**
   * 搜索组织树信息
   * @param {*} value
  */
  function onSearchTree(value){
    setTreeData([]);
    if(checkWOrd(value)){
      message.error('查询条件不支持特殊字符，请更换其它关键字！')
      return
    }
    if(value){
      setVisibleItems(50)
      // dispatch({
      //   type: 'treeState/getSearchTree',
      //   payload:{
      //     start: 1,
      //     limit:100,
      //     searchWord: value,
      //     type: nodeType,
      //     expandedKeys
      //   },
      //   callback:(treeData,expandedKeys)=>{
      //     setTreeData(treeData);
      //     setExpandedKeys(expandedKeys)
      //   }
      // })
      dispatch({
        type: 'treeState/getSearchTree',
        payload:{
          parentId:'',
          orgKind:nodeType,
          searchWord:value,
          isEnable:1,
          expandedKeys
        },
        callback:(treeData,expandedKeys)=>{
          setTreeData(treeData);
          setExpandedKeys(expandedKeys)
        }
      })
    }else{
      getOrgChildren('',nodeType,'',1);
      setExpandedKeys([])
    }
  }
  /**
   *
   * @param {*} selectedKeys  选中节点key
   * @param {*} info info.node 当前节点信息
   */
  function onSelect(selectedKeys,info){
    if(info.node){
      setCurrentNode(info.node)
      getData(info.node)
    }
  }
  const loop = data =>
    data&&data.length!=0&&data.map(item => {
    if(isDisableCheckbox){
      if(item.orgKind==orgKind){
        item['disableCheckbox'] = false
      }else{
        item['disableCheckbox'] = true
      }
    }
    if(item.key!=-1){
      const index = item.title.indexOf(treeSearchWord);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + treeSearchWord.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className={styles.siteTreeSearchValue}>{treeSearchWord}</span>
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
            children: loop(item.children)
          };
        }
        return {
          ...item,
          title,
          key: item.key,
        };
    }else{
      return {
        ...item
      }
    }
  });
  function onExpand(expandedKeys, {expanded, node}){
    expandedKeys.push(node.key)
    if(expanded){
     // expandedKeys.push(node.key)
      if(node.isParent==1&&node.children[0].key==-1){//如果子集未加载到数据时删除该key值
        let index = expandedKeys.findIndex((value)=>{return value ==node.key})
        expandedKeys.splice(index, 1)
      }
      setExpandedKeys( Array.from(new Set(expandedKeys)));
      setExpandId(node.key);
      if(node.isParent==1){ //当前点击节点为父节点  获取下一级数据
        // if(nodeType =='POST'){
        //   dispatch({
        //     type: 'treeState/getPosts',
        //     payload:{
        //       searchWord:'',
        //       start:1,
        //       limit:200,
        //       deptId:node.key,
        //       orgId:node.key,
        //       requireOrgPost:'NO',
        //       isEnable: 1,
        //     },
        //     callback:function(){
        //       getOrgChildren(node.key,nodeType,node,0);
        //     }
        //   })
        // }else{
          getOrgChildren(node.key,nodeType,node,0);
        //}
      }
    }else{
      let arr = [];
      arr.push(node)
      getLoopExpandedKeys(arr,expandedKeys)
    }
  }
  function getLoopExpandedKeys(arr,expandedKeys){
    arr.forEach(function(item,i) {
      expandedKeys.forEach(function(policy,j) {
        if(policy == item.key){
          expandedKeys.splice(j, 1)
        }
      });
      if(item.children&&item.children.length!=0){
        getLoopExpandedKeys(item.children,expandedKeys)
      }
    });
    setExpandedKeys(expandedKeys);
  }
  //选中
  function onTreeCheck(checkedKeys, {checked,node}){
    if(typeof onCheck!='undefined'&&onCheck){
      onCheck(checkedKeys, {checked,node});
    }
  }
  console.log('treeData123=',treeData);
  return(
    <div className={styles.tree}>
      {isShowSearch&&
      <Tooltip title={plst}>
          <Input.Search
          className={styles.tree_search}
          placeholder={plst}
          allowClear
          defaultValue={treeSearchWord}
          onChange={onChangeValue.bind(this)}
          onSearch={(value)=>{onSearchTree(value)}}
        />
      </Tooltip>
      
      }
      <div style={{height:'calc(100% - 32px)'}} id={`${moudleName}_Tree`}>
        <Tree
          titleRender={(node)=><span key={node.key} className={styles.tree_node}>
            {
              node.orgKind=='DEPT'?
              <ApartmentOutlined style={{marginRight:5}}/>:
              (node.orgKind=='POST'?
              <ClusterOutlined style={{marginRight:5}}/>:
              <BankOutlined style={{marginRight:5}}/>)
            }
            {node.title}
            </span>
          }
          className={styles.tree_list_user}
          onSelect={onSelect.bind(this)}
          treeData={loop(treeData.slice(0,visibleItems))}
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
  getData:PropTypes.func,
    /**
   *点击右键编辑树节点
   */
  onEditTree:PropTypes.func,
     /**
   *点击删除节点
   */
   onDeleteTree:PropTypes.func,
  /**
   * 节点类型
   */
  nodeType:PropTypes.string,
  /**
   * 节点前添加 Checkbox 复选框
   */
  checkable:PropTypes.bool,
  /**
   * checkable 状态下节点选择完全受控（父子节点选中状态不再关联）
   */
  checkStrictly:PropTypes.bool,
  /**
   * 选中的节点
   */
  checkedKeys:PropTypes.array,
  /**
   * 选中节点的操作
   */
  onCheck:PropTypes.func,
  /**
   * 是否显示搜索框
   */
  isShowSearch:PropTypes.bool,
  /**
   * 树的外部样式
   */
  style:PropTypes.object,
    /**
   * 是否添加根节点
   */
  isShowAdd:PropTypes.bool,
      /**
   * 树的添加根节点
   */
  onAdd:PropTypes.func,
  /**
   * 是否根据请求类型显示复选框的禁止
   */
   isDisableCheckbox:PropTypes.bool
}
TreeSelect.defaultProps = {
  /**
   * 节点类型
   */
  nodeType:'ORG',
  checkable:false,
  checkStrictly:false,
  checkedKeys:[],
  isShowSearch:true,
  style:{ height: '500px'}
}
export default connect(({treeState,loading,layoutG})=>({
  treeState,
  loading,
  ...layoutG
}))(TreeSelect);
