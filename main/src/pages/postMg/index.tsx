import { connect } from 'dva';
import { Input,Button,message,Modal,Table,Dropdown,Menu} from 'antd';
import styles from '../unitInfoManagement/index.less';
import _ from "lodash";
import { checkWOrd,dataFormat,getButton,getButtonByUrl } from '../../util/util.js'
import CTM from '../../componments/commonTreeMg'
import ADD from './componments/addPostForm'

import ViewDetailsModal from '../../componments/public/viewDetailsModal';
import ImportPostModal from './componments/importPostModal';
import ExportPostModal from './componments/exportPostModal';
import {components} from '../../componments/sort';
import {DownOutlined} from '@ant-design/icons';
import COMMONSORT from '../../componments/commonSort'
import IPagination from '../../componments/public/iPagination';
import {ORDER_WIDTH,BASE_WIDTH} from '../../util/constant'
import ColumnDragTable from '../../componments/columnDragTable'
import searchIcon from '../../../public/assets/search_black.svg'
import React from 'react'
const pathname = '/postMg'  
var viewDetailsModalRef; //查看Modalref
@connect(({ postMg, loading, user }) => ({
  postMg,
  loading,
  user
}))
class PostMg extends React.Component {
  state = {
    commonSort:false,
    columns:[],
    sortData:[],
    inputValue: '',
    height:document.documentElement.clientHeight - 300,
  }
  componentDidMount() {
    window.addEventListener('resize',this.onResize.bind(this));
  }
  onResize() {
    this.setState({
      height: document.documentElement.clientHeight - 300,
    })
  }
  componentWillUnmount() {
    window.removeEventListener('resize',this.onResize.bind(this));
  }
  getPosts(orgType, orgId, start, searchWord, limit) {
    if (!orgId) {
      message.error('请选择所属单位/部门!');
      return;
    }
    const { dispatch } = this.props;
    let deptId = '';
    if (orgType == 'ORG') {
      orgId = orgId;
      deptId = orgId;
    } else {
      deptId = orgId;
      orgId = orgId;
    }
    dispatch({
      type: 'postMg/getPosts',
      payload: {
        searchWord,
        orgId,
        deptId,
        start,
        limit,
        requireOrgPost: 'NO',
      },
    });
  }

  onSearchTable(value) {
    this.setState({
      inputValue: value
    })
    if (checkWOrd(value)) {
      message.error('查询条件不支持特殊字符，请更换其它关键字！');
      return;
    }
    const { dispatch, postMg } = this.props;
    const { currentPage, limit } = postMg;
    const { key, nodeType } = postMg.currentNode;
    this.getPosts(nodeType, key, 1, value, limit);
    dispatch({
      type: 'postMg/updateStates',
      payload: {
        searchWord: value,
      },
    });
  }

  onAdd(post) {
    const { dispatch, postMg } = this.props;
    const { postIds } = postMg;
    const { key, orgKind, orgId, orgName ,belongOrgName,orgParentId} = postMg.currentNode;
    if (!orgId && !key && !post.id) {
      message.error('请选择上级单位/部门！');
      return;
    }
    if (JSON.stringify(post) === '{}') {
      post.isEnable = true;
    }
    if (orgKind == 'DEPT') {
      post.parentOrgName = belongOrgName;
      post.parentOrgId = orgParentId;
      post.parentDeptId = key;
      post.parentDeptName = orgName;
    } else {
      post.parentOrgName = orgName;
      post.parentOrgId = key;
      post.parentDeptId = '';
      post.parentDeptName = '';
    }
    if (post.id) {
      post.isEnable = post.isEnable == 1 ? true : false;
    }

    dispatch({
      type: 'postMg/updateStates',
      payload: {
        modalVisible: true,
        post,
      },
    });

    // if(post.id&&postIds.length!=0){//当前操作为修改操作且批量选择
    //   message.error('请先取消批量操作!')
    //   return
    // }
    // dispatch({
    //   type: 'postMg/findPermissionAuth',
    //   payload: {
    //     orgId: post.id?post.id:post.parentOrgId,
    //     type: 'POST',
    //     status: post.id?'UPDATE':'SAVE',
    //   },
    //   callback: (data) =>{
    //     if(data.data.isAuth){
    //       dispatch({
    //         type: 'postMg/updateStates',
    //         payload: {
    //           modalVisible: true,
    //           post,
    //         },
    //       });
    //     }
        
    //   }
    // });
   
  }
  onCancel() {
    const { dispatch } = this.props;
    dispatch({
      type: 'postMg/updateStates',
      payload: {
        modalVisible: false,
        isView:false
      },
    });
    this.setState({commonSort:false})
  }

  onSubmit(values) {
    const { dispatch, postMg } = this.props;
    const { post, currentNode} = postMg;
    const { key } = currentNode;
    values.orgCode = currentNode.orgCode;
    values.PostOrgType = currentNode.orgKind == 'DEPT' ? 2 : 1;
    if (post.id) {
      dispatch({
        type: 'postMg/updatePost',
        payload: {
          orgId: post.parentOrgId,
          deptId: post.parentDeptId,
          id: post.id,
          ...values,
        },
      });
    } else {
      dispatch({
        type: 'postMg/addPost',
        payload: {
          ...values,
          orgId: key,
          deptId: key,
        },
      });
    }
  }
  getByIdJs(arr) {
    var str = "";
    for (var i = 0; i < arr.length; i++) {
        str += arr[i]+ ",";
    }
    if (str.length > 0) {
        str = str.substr(0, str.length - 1);
    }
    return str;
  }
  onDelete(postId) {
    const { dispatch, postMg } = this.props;
    const { postIds } = postMg;
    let ids = '';
    if(postId){
      ids = postId;
    } else {
      if(postIds.length > 0){
          ids = this.getByIdJs(postIds);
      } else {
          message.error('请先选择需要删除的数据');
          return;
      }
    }
    Modal.confirm({
      title: '确认删除吗？',
      // content: '确认删除该岗位',
      okText: '删除',
      cancelText: '取消',
      mask: false,
      maskClosable:false,
      getContainer:() =>{
        return document.getElementById('postMg_container');
      },
      onOk() {
        dispatch({
          type: 'postMg/deletePost',
          payload: {
            postIds: ids?ids:postId,
          },
        });
      },
    });
  }

  onChangeSearchWord(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'postMg/updateStates',
      payload: {
        searchWord: e.target.value,
      },
    });
  }

  importPost() {
    const { dispatch } = this.props
    dispatch({
        type: "postMg/updateStates",
        payload: {
            isShowImportPostModel: true
        }
    })
  }
  onImportModalCancel(){
    const { dispatch } = this.props
    dispatch({
      type: 'postMg/updateStates',
      payload:{
        isShowImportPostModel: false,
        isShowExportPostModel:false,
        importData:{},
        fileName:''
      }
    })
  }
  showDetails(record) {
    const {  postMg,dispatch } = this.props;
    // const { key, nodeName, nodeType, orgId, orgName } = postMg.currentNode;
    // if (!orgId && !key && !record.id) {
    //   message.error('请选择上级单位/部门！');
    //   return;
    // }
    // if (nodeType == 'DEPT') {
    //   record.parentOrgName = orgName;
    //   record.parentOrgId = orgId;
    //   record.parentDeptId = key;
    //   record.parentDeptName = nodeName;
    // } else {
    //   record.parentOrgName = nodeName;
    //   record.parentOrgId = key;
    //   record.parentDeptId = '';
    //   record.parentDeptName = '';
    // }
    // viewDetailsModalRef.show([
    //   { key: '岗位名称', value: record.postName },
    //   {
    //     key: '岗位简称',
    //     value: record.postShortName,
    //   },
    //   { key: '岗位编码', value: record.postNumber },

    //   { key: '所属单位', value: record.parentOrgName },
    //   {
    //     key: '所属部门',
    //     value: record.parentDeptName,
    //   },
    //   {
    //     key: '是否启用',
    //     value: record.isEnable,
    //     type: 1,
    //   },
    //   { key: '岗位描述', value: record.postDesc, type: 3 },
    //   { key: '创建时间', value: record.createTime, type: 2 },
    // ]);
  
    this.onAdd(record)
    dispatch({
      type: 'postMg/updateStates',
      payload: {
        modalVisible: true,
        isView:true
      },
    });
  }
  handleSave(record){
    const { dispatch } = this.props;
    console.log('111111========',record)
    let arr = [];
    arr.push(record)
    dispatch({
      type: 'postMg/updateStates',
      payload: {
        depts: arr,
      },
    });
  }
  OperatingMoreMenu(){
    const {user} = this.props;
    const { menus ,menusUrlList}= user
    return <Menu onClick={this.onMenuClick.bind(this)}>
              {getButtonByUrl(menusUrlList,'export','','/postMg')&&<Menu.Item key="export">导出</Menu.Item>}
              {getButtonByUrl(menusUrlList,'import','','/postMg')&&<Menu.Item key="import">导入</Menu.Item>}
              {getButtonByUrl(menusUrlList,'enable','','/postMg')&&<Menu.Item key="enable">启用</Menu.Item>}
              {getButtonByUrl(menusUrlList,'disable','','/postMg')&&<Menu.Item key="disable">停用</Menu.Item>}
              {getButtonByUrl(menusUrlList,'sort','','/postMg')&&<Menu.Item key="sort">排序</Menu.Item>}
              {/* <Menu.Item key="sort">排序</Menu.Item> */}
    </Menu>
  }
  onMenuClick(event){
    const { key } = event;
    switch(key){
      case 'import' :
        this.importPost()
        break;
      case 'export' :
        this.exportPost()
        break;  
      case 'sort' :
        this.onCommonSort()
        break;  
      case 'enable' :
        this.enablePost('enable')
        break;  
      case 'disable' :
        this.enablePost('disable')
        break;  
    }
  };
  enablePost(text){
    const { dispatch, postMg } = this.props;
    const { currentPage, limit,postIds } = postMg;
    const { key, nodeType } = postMg.currentNode;
    if(postIds.length >0){
      dispatch({
        type: 'postMg/postEnable',
        payload: {
          type:text == 'enable' ? 1 : 0,
          postIds:postIds.toString()
        },
        callback:() =>{
          this.getPosts(nodeType, key, currentPage, '', limit);
        }
      });
    }else{
      message.error('请至少选择一个岗位');
    }
  }
  changePage(page,size) {
    const { dispatch, postMg } = this.props;
    const { key, nodeType } = postMg.currentNode;
    dispatch({
      type: 'postMg/updateStates',
      payload: {
        currentPage: page,
        limit: size,
      },
    });
    this.getPosts(nodeType, key, page,this.state.inputValue, size);
  }
  exportPost(){
    const { dispatch, postMg} = this.props;
    const { currentNode } = postMg;
    const time=Math.round(new Date().getTime() / 1000)
    const str=dataFormat(time, 'YYYY-MM-DD HH:mm:ss') 
    currentNode.newFileName = `岗位信息管理${str.replace(/[-\s:]/g, '')}`;
    dispatch({
        type: "postMg/updateStates",
        payload: {
            isShowExportPostModel: true
        }
    })
  }
  //排序
  onCommonSort(){
    const { dispatch, postMg } = this.props;
    const { currentNode } = postMg;
    const { key,nodeType} = currentNode;
    if(key){
      this.setState({
        columns:[
          {
            title: '序号',
            dataIndex: 'index',
            width: '8%',
            render:(value,obj,index)=><span>{index+1}</span>
          },    
          {
          title: '岗位名称',
          dataIndex: 'postName',
          width: '36%',
        },{
          title: '岗位编码',
          dataIndex: 'postNumber',
          width: '36%',
        }]
      })
      
      dispatch({
        type: 'postMg/getSortPosts',
        payload: {
          searchWord:'',
          orgId:key,
          deptId:key,
          start:1,
          limit:10000,
        },
        callback:(list) =>{
          this.setState({sortData:list})
          this.setState({commonSort:true})
        }
      });
      
    }else{
      message.error('请选择所属单位')
    }
  }
  saveCallBack(list){
    const { dispatch, postMg } = this.props;
    const { currentPage, limit } = postMg;
    const { key, nodeType } = postMg.currentNode;
    let arr = [];
    var reg = /^\d{1,9}$|^\d{1,9}[.]\d{1,6}$/;
    const flag= list.every(item=>reg.test(item.sort))
    if(!flag){
      message.error('最大支持9位整数，6位小数')
    }else{
      list.forEach(function(item,i){
        let obj = {
          sort:item.sort,
          postId:item.id
        }
        arr.push(obj)
      })
      dispatch({
        type: 'postMg/postSort',
        payload:{
          json:JSON.stringify(arr)
        },
        callback:() =>{
          this.getPosts(nodeType, key, currentPage, '', limit);
          this.setState({commonSort:false})
        }
      })
    }
  }
  

  render() {
    const { dispatch, postMg, loading, user } = this.props;
    const {commonSort,columns,sortData} = this.state
    const {
      currentPage,
      treeData,
      treeSearchWord,
      currentNode,
      expandedKeys,
      returnCount,
      modalVisible,
      posts,
      postIds,
      post,
      limit,
      searchWord,
      isShowImportPostModel,
      isShowExportPostModel,
      importData,
      isView,
      leftNum
    } = postMg;
    const { menus ,menusUrlList} =  user
    const { key, nodeType } = currentNode;
    const tableProps = {
      scroll:posts.length>0?{ x: 1100,y:'calc(100% - 45px)'}:{},
      rowKey: 'id',
      columns: [
        {
          title:'序号',
          width:ORDER_WIDTH,
          dataIndex:'index',
          render:(value,obj,index)=><span>{index+1}</span>
        },
        {
          title: '岗位名称',
          dataIndex: 'postName',
          width: BASE_WIDTH,
          render: (text,record) => (
            <div className={styles.text} title={text}>
              {getButtonByUrl(menusUrlList,'view','','/postMg')?<a
                onClick={() => {
                  this.showDetails(record);
                }}
              >
                {text}
              </a>:text}
            </div>
          ),
        },
        {
          title: '岗位编码',
          dataIndex: 'postNumber',
          width: BASE_WIDTH,
          render: text => (
            <div className={styles.text} title={text}>
              {text}
            </div>
          ),
        },
        {
          title: '岗位描述',
          dataIndex: 'postDesc',
          width: BASE_WIDTH*2.5,
          render: text => (
            <div className={styles.text} title={text}>
              {text}
            </div>
          ),
        },
        {
          title: '启用',
          dataIndex: 'isEnable',
          width: BASE_WIDTH,
          render: text => {
            return text ? '是' : '否';
          },
        },
        // {
        //   title: '排序',
        //   dataIndex: 'sort',
        //   onCell: (record) => ({
        //     record,
        //     editable: true,
        //     dataIndex: 'sort',
        //     title: '排序',
        //     handleSave: this.handleSave.bind(this)
        //   }),
        //   render: text => (
        //     <div className={styles.text} title={text}>
        //       {text}
        //     </div>
        //   ),
        // },
        {
          title: '创建日期',
          dataIndex: 'createTime',
          width: BASE_WIDTH,
          render: text => (
            <div className={styles.text} title={dataFormat(text, 'YYYY-MM-DD')}>
              {dataFormat(text, 'YYYY-MM-DD')}
            </div>
          ),
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: BASE_WIDTH*1.5,
          fixed:'right',
          render: (text, record) => {
            return (
              <div  className="table_operation">
                
                {
                  getButtonByUrl(menusUrlList,'update','','/postMg')&&<span
                    onClick={this.onAdd.bind(this, record)}
                  >
                    修改
                  </span>
                }
                {getButtonByUrl(menusUrlList,'update','','/postMg')&&<span onClick={this.onDelete.bind(this, record.id)}>删除</span>}
                
              </div>
            );
          },
        },
      ],
      dataSource: posts,
      pagination: false,
      rowSelection: {
        selectedRowKeys: postIds,
        onChange: (selectedRowKeys, selectedRows) => {
          dispatch({
            type: 'postMg/updateStates',
            payload: {
              postIds: selectedRowKeys,
            },
          });
        },
        getCheckboxProps: record => ({
          disabled: record.isSelected == 1,
        }),
      },
    };
    return (
      <div id="postMg_container" style={{ height: '100%' }}>
        {/* <ViewDetailsModal
          title="查看岗位"
          containerId="postMg_container"
          ref={ref => {
            viewDetailsModalRef = ref;
          }}
        ></ViewDetailsModal> */}
        <CTM
          treeData={treeData}
          expandedKeys={expandedKeys}
          treeSearchWord={treeSearchWord}
          currentNode={currentNode}
          nodeType={'ORG_'}
          plst={'请输入单位/部门名称、编码'}
          moudleName={"postMg"}
          onSearchTable={this.onSearchTable.bind(this)}
          leftNum={leftNum}
          getData={node => {
            console.log(node,'node==');
            dispatch({
              type: 'postMg/updateStates',
              payload: {
                currentPage: 1,
                searchWord: ''
              },
            });
            this.setState({inputValue:''})
            this.getPosts(node.orgKind, node.key, 1, '', limit);
          }}
        >
          {modalVisible && (
            <ADD
              loading={loading.global}
              post={post}
              setValues={values => {
                dispatch({
                  type: 'postMg/updateStates',
                  payload: {
                    post: { ...post, ...values },
                  },
                });
              }}
              onCancel={this.onCancel.bind(this)}
              onSubmit={this.onSubmit.bind(this)}
              isView={isView}
            />
          )}
          {
            isShowImportPostModel&&<ImportPostModal 
                                    importData={importData}
                                    currentNode={currentNode}
                                    onCancel={this.onImportModalCancel.bind(this)}/>
          }
          {
            isShowExportPostModel&&<ExportPostModal 
                                    importData={importData}
                                    currentNode={currentNode}
                                    postIds={postIds}
                                    onCancel={this.onImportModalCancel.bind(this)}/>
          }
          {commonSort && <COMMONSORT loading={loading.global} name='postMg' onCancel={this.onCancel.bind(this)} tableList={sortData} columns={columns} saveCallBack={this.saveCallBack.bind(this)}/>}    
          <div className={styles.other} id='list_head'>
            <Input.Search
              className={styles.search}
              placeholder={'请输入岗位名称、编码'}
              allowClear
              defaultValue={searchWord}
              value={searchWord}
              onChange={this.onChangeSearchWord.bind(this)}
              onSearch={value => {
                this.onSearchTable(value);
              }}
              enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
            />
            <div className={styles.bt_gp}>
              {getButtonByUrl(menusUrlList,'add','','/postMg')&&<Button type='primary' onClick={this.onAdd.bind(this, {})}>新增</Button>}
              {getButtonByUrl(menusUrlList,'delete','','/postMg')&&<Button onClick={this.onDelete.bind(this,'')}>删除</Button>}
              {/* {getButtonByUrl(menusUrlList,'import','','/postMg')&&<Button className={styles.fontSize7} onClick={this.importPost.bind(this)}>导入</Button>} */}
              <Dropdown overlay={this.OperatingMoreMenu.bind(this)} trigger={['click']}>
                <Button onClick={e => e.preventDefault()}>更多<DownOutlined /></Button>
              </Dropdown>
            </div>
          </div>
          <div style={{height:'calc(100% - 90px)'}}>
            <ColumnDragTable taskType="MONITOR" modulesName="postMg" {...tableProps} key={loading} components={components}/>
          </div>
          
          {
            <div
              style={{
                marginTop: '40px',
                paddingBottom: '10px',
              }}
            >
              <IPagination
                current={currentPage}
                total={returnCount}
                pageSize={limit}
                isRefresh={true}
                onChange={this.changePage.bind(this)}
                refreshDataFn={() => {this.changePage(1,limit)}}
              />
            </div>
          }
        </CTM>
      </div>
    );
  }
}

  export default () => {
    return (
  
        <PostMg />
    
    );
  }