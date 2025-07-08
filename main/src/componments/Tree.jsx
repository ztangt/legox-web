import { Tree,Table,Spin,message,Input,Button} from 'antd';
import React from "react";
import styles from './commonTreeMg.less';
import PropTypes from 'prop-types';
import '../global.less'
import { connect } from 'dva';
import _ from "lodash";
import { history } from 'umi'
import {  DeleteOutlined, FormOutlined, BankOutlined, ApartmentOutlined,ClusterOutlined } from '@ant-design/icons';
import { parse } from 'query-string';
import searchIcon from '../../public/assets/search_black.svg' 
let parentNames = [];
let deptNames = []

class TreeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData:[],
      expandedKeys: [],
      treeSearchWord: '',
      currentNode:{},
      moudleName: '',
      props: {},
      scrollTopNumber:0,
      visibleItems:50
    }
    // this.onScrollEvent = this.onScrollEvent.bind(this);
  }


  componentDidMount(){
    const {nodeType,treeData,moudleName,setParentState,parentState} = this.props
    // this.init(nodeType == 'DEPT' ? 'ORG' : nodeType,treeData)
    this.init(nodeType,treeData,setParentState,parentState)
    document.getElementById(`${moudleName}_orgTree`).addEventListener('scroll',this.onScroll.bind(this),true)
  }
  // 加载更多岗位数据
  loadMore(){
    this.setState((state)=>{
      return {
        ...state,
        visibleItems:state.visibleItems+50
      }
    })
  }
  onScroll(e){
    const {scrollTopNumber}=this.state
    const {treeData,moudleName}=this.props
    const clientHeight=document.getElementById(`${moudleName}_orgTree`)?.clientHeight
    const scrollTop=e.target.scrollTop
    const scrollHeight=e.target.scrollHeight
    let num = scrollTopNumber
    if (Math.ceil(clientHeight+scrollTop)>=scrollHeight) {
      this.loadMore()
    }else if(scrollTop == 0){
      this.setState({
        visibleItems:50,
      })
    }
  }
  // onScrollEvent() {
  //   if (this.scrollRef.scrollTop + this.scrollRef.clientHeight ===
  //     this.scrollRef.scrollHeight) {
  //       console.log('33333333333到底了');
  //       // 这里去做你的异步数据加载
  //   }
  // }


  static getDerivedStateFromProps (nextProps, prevState) {
    const { treeData, expandedKeys, treeSearchWord, currentNode, nodeType, dispatch,moudleName} = nextProps
		const {props} = prevState
		if (treeData !== props.treeData||
        expandedKeys !== props.expandedKeys||
        treeSearchWord !== props.treeSearchWord||
        currentNode !== props.currentNode||
        moudleName !== props.moudleName
      ) {
			return {
        treeData,
        expandedKeys,
        treeSearchWord,
        currentNode,
        moudleName,
				props : {
					treeData,
          expandedKeys,
          treeSearchWord,
          currentNode,
          moudleName,
				}
			}
		}
		return null


  }

  init(nodeType,treeData,setParentState,parentState){
      const {dispatch,moudleName} = this.props
      const query = parse(history.location.search);
      const maxDataruleCode=query.maxDataruleCode
      const pathname=history.location.pathname.split('/support')?.[1];
      if(treeData.length==0){//左侧树无数据时再获取树信息
        // dispatch({
        //   type: 'tree/getOrgChildren',
        //   payload:{
        //     nodeType:nodeType,
        //     start:1,
        //     limit:200,
        //     onlySubDept:(maxDataruleCode=='A0004'||maxDataruleCode=='A0002')?0:1
        //     // onlySubDept:((history.location.pathname=='/postMg'&&maxDataruleCode!=='A0004')||(history.location.pathname=='/globalReviewer'&&maxDataruleCode!=='A0004')||(history.location.pathname=='/deptMg'&&(maxDataruleCode=='A0004'||maxDataruleCode=='A0002'))||(history.location.pathname=='/unitInfoManagement'&&(maxDataruleCode=='A0004'||maxDataruleCode=='A0002')))?0:1
        //   },
        //   pathname: history.location.pathname,//当前路由路径
        //   moudleName: moudleName,
        // })
        dispatch({
          type: 'tree/getOrgTree',
          payload:{
            parentId:'',
            orgKind:nodeType,
            searchWord:'',
            isEnable:'1'
          },
          callback:(data)=>{
            if(setParentState){
              setParentState({treeData:data})
            }
          },
          pathname: pathname,//当前路由路径
          moudleName: moudleName,
        })
      }

  }

    //获取选中节点的父节点
    getParentKey(nodeKey, tree){
      let self = this;
      const { treeData} = this.state;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node['children']) {
          if (node['children'].some(item => item['key'] === nodeKey)) {
            if(node['orgKind'] == 'DEPT'){
              deptNames.push(node['title'])
            }else{
              parentNames.push(node['title']);
            }
            self.getParentKey(node['key'], treeData);
          } else if (self.getParentKey(nodeKey, node.children)) {
            self.getParentKey(nodeKey, node.children);
          }
        }
      }
    };


    /**
     *
     * @param {*} selectedKeys  选中节点key
     * @param {*} info info.node 当前节点信息
     */
    onSelect(selectedKeys,info){
      parentNames = []
      deptNames = []
      const { dispatch, getData, moudleName ,setParentState} = this.props
      const { treeData} = this.state;
      if(info.node){
          if(`${moudleName?moudleName:history.location.pathname.split("/")[2]}` == 'userInfoManagement'){
            this.getParentKey(info.node.key,treeData);
            dispatch({
              type: `userInfoManagement/updateStates`,
              payload:{
                currentNode: info.node,
                parentNames:parentNames,
                deptNames:deptNames
              }
            })
          }else{
            if(setParentState){
              setParentState({currentNode: info.node})
            }else{
              dispatch({
                type: `${moudleName?moudleName:history.location.pathname.split("/")[2]}/updateStates`,
                payload:{
                  currentNode: info.node
                }
              })
            }
          }
          getData(info.node)
      }
    }

    //展开节点
    onExpand(expandedKeys, {expanded, node}){
      const { dispatch,nodeType,moudleName ,setParentState} = this.props
      expandedKeys.push(node.key)
      const pathname=history.location.pathname.split('/support')?.[1];
      if(expanded){
       // expandedKeys.push(node.key)
        if(node.isParent==1&&node.children[0].key==-1){//如果子集未加载到数据时删除该key值
          let index = expandedKeys.findIndex((value)=>{return value ==node.key})
          expandedKeys.splice(index, 1)
        }
        var pname = history.location.pathname
        if(pname.includes('/support')){
          pname = pname.split('/support')[1]
        }
        if(setParentState){
          setParentState({
            expandId: node.key,
            expandedKeys: Array.from(new Set(expandedKeys)),
          })
        }else{
          dispatch({
            type: `${moudleName?moudleName:pname.split("/")[1]}/updateStates`,
            payload:{
              expandId: node.key,
              expandedKeys: Array.from(new Set(expandedKeys)),
            }
          })
        }
        console.log('node=',node);

        if(node.isParent==1){ //当前点击节点为父节点  获取下一级数据
          if(moudleName=='applyModelConfig'){
            dispatch({
              type: 'tree/getPosts',
              payload:{
                searchWord:'',
                start:1,
                limit:200,
                deptId:node.key,
                orgId:node.key,
                requireOrgPost: node.orgKind == 'DEPT' ? 'YES':'NO',
                isEnable: 1,
              },
              callback:function(){
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
                //   nodeType:node.nodeType,//拼接节点
                //   nodeId:node.key,//拼接节点
                //   nodePath:node.nodePath?JSON.stringify(node.nodePath):JSON.stringify([])
                // })
                dispatch({
                  type: 'tree/getOrgTree',
                  payload:{
                    parentId:node.key,
                    orgKind:nodeType,
                    searchWord:'',
                    isEnable:'1'
                  },
                  pathname:pathname,
                  moudleName: moudleName,
                  nodeType:node.orgKind,//拼接节点
                  nodeId:node.key,//拼接节点
                  nodePath:node.nodePath?JSON.stringify(node.nodePath):JSON.stringify([])
                })
              }
            })
          }
          else if(moudleName == 'userView'){
            // dispatch({
            //   type: 'tree/getPosts',
            //   payload:{
            //     searchWord:'',
            //     start:1,
            //     limit:200,
            //     deptId:node.key,
            //     orgId:node.key,
            //     requireOrgPost:'NO',
            //     isEnable: 1,
            //   },
            //   callback:function(){
            //     dispatch({
            //       type: 'tree/getOrgChildren',
            //       payload:{
            //           nodeId: node.key,
            //           nodeType,
            //           start:1,
            //           limit:200,
            //           onlySubPost:nodeType=='POST'?1:''
            //       },
            //       pathname: history.location.pathname,
            //       moudleName: moudleName,
            //       nodeType:node.nodeType,//拼接节点
            //       nodeId:node.key,//拼接节点
            //       nodePath:node.nodePath?JSON.stringify(node.nodePath):JSON.stringify([])
            //     })
            //   }
            // })

            dispatch({
              type: 'tree/getPosts',
              payload:{
                searchWord:'',
                start:1,
                limit:200,
                deptId:node.key,
                orgId:node.key,
                requireOrgPost:'NO',
                isEnable: 1,
              },
              callback:function(){
                dispatch({
                  type: 'tree/getOrgTree',
                  payload:{
                    parentId:node.key,
                    orgKind:nodeType,
                    searchWord:'',
                    isEnable:1
                  },
                  pathname: pathname,
                  moudleName: moudleName,
                  nodeType:node.orgKind,//拼接节点
                  nodeId:node.key,//拼接节点
                  nodePath:node.nodePath?JSON.stringify(node.nodePath):JSON.stringify([])
                })
              }
            })
          }
          else{
            // dispatch({
            //   type: 'tree/getOrgChildren',
            //   payload:{
            //       nodeId: node.key,
            //       nodeType,
            //       start:1,
            //       limit:200,
            //       isEnable: 1,
            //       onlySubDept:(maxDataruleCode=='A0004'||maxDataruleCode=='A0002')?0:1
            //       // onlySubDept:((history.location.pathname=='/postMg'&&maxDataruleCode!=='A0004')||(history.location.pathname=='/globalReviewer'&&maxDataruleCode!=='A0004')||(history.location.pathname=='/deptMg'&&(maxDataruleCode=='A0004'||maxDataruleCode=='A0002'))||(history.location.pathname=='/unitInfoManagement'&&(maxDataruleCode=='A0004'||maxDataruleCode=='A0002')))?0:1
            //   },
            //   pathname: history.location.pathname,
            //   moudleName: moudleName,
            //   nodeType:node.nodeType,//拼接节点
            //   nodeId:node.key,//拼接节点
            //   nodePath:node.nodePath?JSON.stringify(node.nodePath):JSON.stringify([])//拼接节点
            // })

            dispatch({
              type: 'tree/getOrgTree',
              payload:{
                parentId:node.key,
                orgKind:nodeType,
                searchWord:'',
                isEnable:1
              },
              pathname: pathname,
              moudleName: moudleName,
              nodeType:node.orgKind,//拼接节点
              nodeId:node.key,//拼接节点
              nodePath:node.nodePath?JSON.stringify(node.nodePath):JSON.stringify([])//拼接节点
            })
          }   
        }
      }else{
        let arr = [];
        arr.push(node)
        this.loop(arr,expandedKeys)
      }
    }

    loop(arr,expandedKeys){
      let self = this;
      const { dispatch, moudleName ,setParentState} = this.props
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
      if(setParentState){
        setParentState({
          expandedKeys: expandedKeys,
        })
      }else{
        dispatch({
          type: `${moudleName?moudleName:history.location.pathname.split("/")[2]}/updateStates`,
          payload:{
            expandedKeys: expandedKeys,
          }
        })
      }
      

    }

    /**
     * 搜索组织树信息
     * @param {*} value
     */
    onSearchTree(value){
      const { nodeType,dispatch,moudleName ,setParentState} = this.props
      const pathname=history.location.pathname.split('/support')?.[1];
      if(this.checkWOrd(value)){
        message.error('查询条件不支持特殊字符，请更换其它关键字！')
        return
      }
      if(value){
        this.setState({
          visibleItems:50
        })
        // dispatch({
        //   type: 'tree/getSearchTree',
        //   payload:{
        //     searchWord: value,
        //     type: nodeType,
        //     start:1,
        //     limit: 100,
        //     onlySubDept:(maxDataruleCode=='A0004'||maxDataruleCode=='A0002')?0:1
        //     // onlySubDept:((history.location.pathname=='/postMg'&&maxDataruleCode!=='A0004')||(history.location.pathname=='/globalReviewer'&&maxDataruleCode!=='A0004')||(history.location.pathname=='/deptMg'&&(maxDataruleCode=='A0004'||maxDataruleCode=='A0002'))||(history.location.pathname=='/unitInfoManagement'&&(maxDataruleCode=='A0004'||maxDataruleCode=='A0002')))?0:1
        //   },
        //   pathname: history.location.pathname,
        //   moudleName: moudleName,
        // })
        dispatch({
          type: 'tree/getSearchTree',
          payload:{
            parentId:'',
            orgKind:nodeType,
            searchWord:value,
            isEnable:'1',
          },
          pathname: pathname,
          moudleName: moudleName,
        })
      }else{
        // dispatch({
        //   type: 'tree/getOrgChildren',
        //   payload:{
        //     nodeType,
        //     start:1,
        //     limit:200,
        //     onlySubDept:(maxDataruleCode=='A0004'||maxDataruleCode=='A0002')?0:1
        //     // onlySubDept:((history.location.pathname=='/postMg'&&maxDataruleCode!=='A0004')||(history.location.pathname=='/globalReviewer'&&maxDataruleCode!=='A0004')||(history.location.pathname=='/deptMg'&&(maxDataruleCode=='A0004'||maxDataruleCode=='A0002'))||(history.location.pathname=='/unitInfoManagement'&&(maxDataruleCode=='A0004'||maxDataruleCode=='A0002')))?0:1
        //   },
        //   pathname: history.location.pathname,
        //   moudleName: moudleName,
        // })
        dispatch({
          type: 'tree/getOrgTree',
          payload:{
            parentId:'',
            orgKind:nodeType,
            searchWord:'',
            isEnable:'1'
            // onlySubDept:((history.location.pathname=='/postMg'&&maxDataruleCode!=='A0004')||(history.location.pathname=='/globalReviewer'&&maxDataruleCode!=='A0004')||(history.location.pathname=='/deptMg'&&(maxDataruleCode=='A0004'||maxDataruleCode=='A0002'))||(history.location.pathname=='/unitInfoManagement'&&(maxDataruleCode=='A0004'||maxDataruleCode=='A0002')))?0:1
          },
          pathname: pathname,
          moudleName: moudleName,
        })
        if(setParentState){
          setParentState({
            currentNode: {}
          })
        }else{
          if(moudleName!=='unitInfoManagement'){//单位信息管理搜索时不影响选中状态
            dispatch({
              type: `${moudleName?moudleName:history.location.pathname.split("/")[2]}/updateStates`,
              payload:{
                currentNode: {}
              }
            })
          }
          if(history.location.pathname.split("/")[2]=='userInfoManagement'){
            dispatch({
              type: `${moudleName?moudleName:history.location.pathname.split("/")[2]}/updateStates`,
              payload:{
                users: []
              }
            })
          }
        }
      }
    }

    /**
     * 搜索框内容校验是否包含特殊字符
     * @param {*校验值} value
     */
    checkWOrd(value){
      let specialKey = "`@《》·~!%#$^&*=|{}':;'\\.<>/?~！#￥……&*|{}‘；：”“'。，、？‘'";
      for (let i = 0; i < value.length; i++) {
        if (specialKey.indexOf(value.substr(i, 1)) != -1) {
          return true
        }
      }
      return false
    }


    onChangeValue(e){
      const { dispatch,moudleName,setParentState } = this.props
      if(setParentState){
        setParentState({
          treeSearchWord: e.target.value
        })
      }else{
        dispatch({
          type: `${moudleName?moudleName:history.location.pathname.split("/")[2]}/updateStates`,
          payload:{
            treeSearchWord: e.target.value
          }
        })
      }
    }

    //编辑树节点
    onEditTree(node,e){
      e.stopPropagation();
      if(this.props.onEditTree){
        this.props.onEditTree(node);
      }
    }

    //删除树节点
    onDeleteTree(node,e){
      e.stopPropagation();
      if(this.props.onDeleteTree){
        this.props.onDeleteTree(node);
      }
    }

    //选中
    onCheck(checkedKeys, {checked,node}){
      if(typeof this.props.onCheck!='undefined'&&this.props.onCheck){
        this.props.onCheck(checkedKeys, {checked,node});
      }
    }

    render(){
        const { plst,loading,checkedKeys,checkable,checkStrictly,isShowSearch,style,onAdd,isShowAdd, defaultCheckedKeys,moudleName} = this.props
        const { treeData, expandedKeys, treeSearchWord, currentNode,visibleItems } = this.state
        const searchWord = treeSearchWord ? treeSearchWord : '';
          const loop = data =>
              data&&data.length!=0&&data.slice(0,visibleItems).map(item => {
                // console.log('item',item);
              if(item.key!=-1&&item.title){
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
          return(

            <div className={styles.tree}    
            >
              {isShowSearch&&
              <Input.Search
                className={styles.tree_search}
                placeholder={plst}
                allowClear
                defaultValue={treeSearchWord}
                onChange={this.onChangeValue.bind(this)}
                onSearch={(value)=>{this.onSearchTree(value)}}
                enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
              />
              }
              {/* {isShowAdd&&<Button onClick={onAdd.bind(this)} type='primary'style={{width: 205,marginTop: 10}}>添加根节点</Button>} */}

              <div className={styles.content_tree} id={`${moudleName}_orgTree`}>
              <Tree

                titleRender={(node)=><span key={node.key} className={styles.tree_node}>
                {
                  node.orgKind=='DEPT'?
                  <ApartmentOutlined style={{marginRight:5}}/>:
                  (node.orgKind=='POST'?
                  <ClusterOutlined style={{marginRight:5}}/>:node.title?
                  <BankOutlined style={{marginRight:5}}/>:"")
                }
                {node.title}
                {//根节点编辑操作

                node.parentId&&history.location.pathname.split('/support')?.[1]=='/unitInfoManagement'?
                  <FormOutlined
                    className={styles.edit}
                    onClick={this.onEditTree.bind(this,node)}
                    title='修改'
                  />
                  :''
                }
                {//根节点删除操作
                  node.parentId&&history.location.pathname.split('/support')?.[1]=='/unitInfoManagement'?
                  <DeleteOutlined
                    className={styles.edit}
                    onClick={this.onDeleteTree.bind(this,node)}
                    title='删除'
                  />
                  :''
                }
                </span>}
                key={loading.global}
                className={styles.tree_list}
                onSelect={this.onSelect.bind(this)}
                treeData={loop(treeData)}
                onExpand={this.onExpand.bind(this)}
                selectedKeys={[currentNode.key]}
                expandedKeys={expandedKeys}
                showLine={true}
                showIcon={true}
                checkable={checkable}
                onCheck={this.onCheck.bind(this)}
                checkStrictly={checkStrictly}
                defaultCheckedKeys={defaultCheckedKeys}
                // checkedKeys={checkedKeys}
                />
              </div>


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
  defaultCheckedKeys:PropTypes.array,
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
}
TreeSelect.defaultProps = {
  /**
   * 节点类型
   */
  nodeType:'ORG',
  checkable:false,
  checkStrictly:false,
  checkedKeys:[],
  defaultCheckedKeys: [],
  isShowSearch:true,
  isShowAdd: false,
  onAdd: ()=>{},
  style:{ height: '500px'}
}
export default connect(({tree,loading,layoutG})=>({
  tree,
  loading,
  ...layoutG
}))(TreeSelect);
