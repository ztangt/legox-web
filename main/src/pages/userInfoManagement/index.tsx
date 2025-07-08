import { connect } from 'dva';
import {
  Input,
  Button,
  message,
  Modal,
  Space,
  Menu,
  Dropdown,
  Table,
  Tabs,
} from 'antd';
import styles from './index.less';
import IPagination from '../../componments/public/iPagination';
import _ from 'lodash';
import { dataFormat, getButton ,getButtonByUrl} from '../../util/util.js';
import CTM from '../../componments/commonTreeMg';
import React,{ useState } from 'react';
import { components } from '../../componments/sort';
import NewUsers from './components/newUsers';
import IDENTITY from './components/identityModal';
import ImprotUserModal from './components/importUserModal';
import { DownOutlined } from '@ant-design/icons';
import { Link, history } from 'umi';
import COMMONSORT from '../../componments/commonSort';
import EXPORTUSER from './components/exportUser';
import moment from 'moment';
import 'moment/locale/zh-cn';
import ViewDetailsModal from '../../componments/public/viewDetailsModal';
import {ORDER_WIDTH,BASE_WIDTH} from '../../util/constant'
import copy from 'copy-to-clipboard';
import searchIcon from '../../../public/assets/search_black.svg'
import ColumnDragTable from '../../componments/columnDragTable'
moment.locale('zh-cn');
const { TabPane } = Tabs;
var viewDetailsModalRef; //查看Modalref
@connect(({ userInfoManagement, loading, layoutG, user ,userView}) => ({
  userInfoManagement,
  loading,
  layoutG,
  user,
  userView
}))
class UserInfo extends React.Component {
  state = {
    selectedRows: null,
    commonSort: false,
    columns: [],
    sortData: [],
    viewModal:false

  };

  moreClick({ key }, record) {
    const { dispatch, layoutG } = this.props;
    // const { routerTabs } = layoutG;
    // dispatch({
    //   type:'userView/updateStates',
    //   payload:{
    //     tabKey: '用户信息'
    //   }
    // })
    switch (key) {
      case 'admin':
        historyPush({
          pathname: `/userInfoManagement/userView`,
          query: {
            userId: record.userId,
            // record: JSON.stringify(record),
            identityId:record.identityId
          },
        });
        break;
      case 'resetPassword':
        Modal.confirm({
          title: '',
          content: '确认重置密码吗？',
          mask: false,
          getContainer:() =>{
            return document.getElementById('userInfo_container')
          },
          onOk() {
              dispatch({
                type:'userInfoManagement/resetPassword',
                payload:{
                  userIds:record.userId
                }
              })
            }
        });
        break;
      case 'resetLoginNum':
        Modal.confirm({
          title: '',
          content: '确认重置登录次数吗？',
          mask: false,
          getContainer:() =>{
            return document.getElementById('userInfo_container')
          },
          onOk() {
              dispatch({
                type:'userInfoManagement/resetLoginNum',
                payload:{
                  userIds:record.userId
                }
              })
            }
        });
        break;
      case 'copy':
        if (record && copy(record.id)) {
          message.success('复制成功');
        }
        break;
      default:
        break;
    }
    //     if(key == 'admin'){
    //       // let obj = {
    //       //   path: "/userInfoManagement/userView",
    //       //   key: "/userInfoManagement/userView",
    //       //   name: "管理",
    //       // }
    //       // if(routerTabs.length==0){
    //       //   routerTabs.push(obj)
    //       // }else{
    //       //   let flag = routerTabs.findIndex((r)=>{return r.path==obj.path});
    //       //   if(flag==-1){
    //       //     routerTabs.push(obj)
    //       //   }
    //       // }
    //       // dispatch({
    //       //   type: 'layoutG/updateStates',
    //       //   payload: {
    //       //     routerTabs,
    //       //     currentKey: obj.key
    //       //   }
    //       // })
    //       // historyPush({
    //       //   pathname: obj.path,
    //       //   query:{
    //       //       userId,
    //       //   }
    //       // });
    //       historyPush({
    //         pathname: '/userInfoManagement/userView',
    //         query: {
    //             userId
    //         },
    //       });
    //     }
  }

  getUsers(orgId, start, searchWord, type, limit, nodeType) {
    const { dispatch, userInfoManagement } = this.props;
    // if(!orgId){
    //   message.error('请选择所属单位/部门!')
    //   return
    // }
    dispatch({
      type: 'userInfoManagement/queryUser',
      payload: {
        searchWord,
        orgId: orgId,
        deptId: orgId,
        start,
        limit,
        type,
      },
    });
  }

  onSearchTable(value) {
    const { dispatch, userInfoManagement } = this.props;
    const { currentPage, limit, type, currentNode } = userInfoManagement;
    const { key, nodeType } = currentNode;
   
    this.getUsers(key, 1, value, type, limit, nodeType);
    dispatch({
      type: 'layoutG/updateStates',
      payload: {
        searchWord: value,
      },
    });
  }

  handleEditOkClick(values, userId, orgId, postId) {
    const { dispatch, userInfoManagement } = this.props;
    const { currentUg,users,currentNode} = userInfoManagement;
    values.orgCode = currentUg.deptCode?currentUg.deptCode:currentNode.orgCode;
    if (currentUg.id) {
      dispatch({
        type: 'userInfoManagement/updateUser',
        payload: {
          ...values,
          userId: currentUg.userId,
          identityId: currentUg.identityId,
        },
        callback: function() {
          dispatch({
            type: 'userInfoManagement/updateStates',
            payload: {
              addModal: false,
              users:[]
            },
          });
        },
      });
    } else {
      console.log(values,'values');
      if(userId) {
        dispatch({
          type: 'userInfoManagement/checkIdentityExist',
          payload:{
              userIds: userId,
              orgId: orgId,
              postId: postId
          },
          callback: function(data) {
            console.log(data, '179---------')
              if(!data.list) {
                dispatch({
                  type: 'userInfoManagement/addUser',
                  payload: {
                    ...values,
                  },
                });
                return;
              }
              if(data && data.list[0] && data.list[0].dr == 1) {
                  // 说明该身份之前被删除或者移除过，需要给出提示
                  Modal.confirm({
                      title: '用户身份存在是否进行恢复',
                      content: '',
                      okText: '确定 ',
                      cancelText: '取消',
                      mask: false,
                      onOk() {
                        dispatch({
                          type: 'userInfoManagement/addUser',
                          payload: {
                            ...values,
                          },
                        });
                      },
                    });
              }else{
                dispatch({
                  type: 'userInfoManagement/addUser',
                  payload: {
                    ...values,
                  },
                });
              }
          }
        })
      } else {
        dispatch({
          type: 'userInfoManagement/addUser',
          payload: {
            ...values,
          },
        });
      }
    }
  }

  getText(arr) {
    if (arr && arr.length > 0) {
      arr.reverse();
      var str = '';
      for (var i = 0; i < arr.length; i++) {
        str += arr[i] + '-';
      }
      // arr.reverse()
      if (str.length > 0) {
        str = str.substr(0, str.length - 1);
      }
      return str;
    } else {
      return '';
    }
  }

  //点击列表上新增  或者 修改
  onAdd(obj) {
    const { userInfoManagement, dispatch, layoutG } = this.props;
    const { currentNode, userIds, parentNames, deptNames } = userInfoManagement;
    const { key, orgKind, orgName, nodeName, orgCode, parentId} = currentNode;
    console.log(currentNode,'currentNode');
    const { searchObj } = layoutG;
    const { echoFormData } = searchObj['/passwordMg'];
    let deptId = '';
    let orgId = '';
      deptId = key;
      orgId = key;
      this.setState({viewModal:false});
      if (obj.userId) {
        console.log(obj,'obj===');
        dispatch({
          type: 'userInfoManagement/obtainUser',
          payload: {
            userId:obj.userId,
            orgCenterId:obj.orgCenterId,
            identityId:obj.id
          },
          callback: function(data) {
            // data.orgName = obj.identityFullName.split('-')[0];
            // data.deptName = obj.identityFullName.split('-')[1];
            dispatch({
              type: 'userInfoManagement/getPosts',
              payload: {
                orgId:data.deptId?data.deptId:data.orgId,
                start: 1,
                limit: 1000,
                // requireOrgPost: nodeType == 'DEPT' ? 'YES':'NO',
                isEnable: 1,
                orgParentId: parentId=='0'?key:parentId
              },
              callback:(list)=>{
                dispatch({
                  type: 'userInfoManagement/updateStates',
                  payload: {
                    posts: list,
                  },
                });
              }
            });
            dispatch({
              type: 'userInfoManagement/updateStates',
              payload: {
                currentUg: data,
                addModal: true,
              },
            });
          },
        });
      } else {
          if (key) {
            dispatch({
              type: 'userInfoManagement/getPosts',
              payload: {
                orgId,
                start: 1,
                limit: 1000,
                // requireOrgPost: nodeType == 'DEPT' ? 'YES':'NO',
                isEnable: 1,
                orgParentId: parentId=='0'?key:parentId
              },
              callback:(list)=>{
                dispatch({
                  type: 'userInfoManagement/updateStates',
                  payload: {
                    posts: list,
                  },
                });
              }
            });
            if (orgKind == 'DEPT') {
              obj.deptName =
                deptNames.length > 0
                  ? this.getText(deptNames) + '-' + orgName
                  : orgName;
              obj.deptId = key;
              obj.orgId = currentNode.orgParentId;
              obj.orgName = currentNode.belongOrgName;
            } else {
              obj.orgName =
                parentNames.length > 0
                  ? this.getText(parentNames) + '-' + orgName
                  : orgName;
              obj.orgId = key;
            }
            obj.customType = '1';
            obj.isEnable = true;
            if (echoFormData) {
              obj.userPassword = echoFormData.password
                ? echoFormData.password
                : '123456';
              dispatch({
                type: 'userInfoManagement/updateStates',
                payload: {
                  currentUg: obj,
                  addModal: true,
                  // posts: [],
                  imageUrl: '',
                  signImageUrl: '',
                },
              });
            } else {
              dispatch({
                type: 'passwordMg/passwordMgStates',
                payload: {
                  pathname: '/passwordMg',
                },
              });
              dispatch({
                type: 'passwordMg/getPasswordPolicy',
                callback: function(data) {
                  obj.userPassword = data.password ? atob(data.password) : '123456';
                  dispatch({
                    type: 'userInfoManagement/updateStates',
                    payload: {
                      currentUg: obj,
                      addModal: true,
                      // posts: [],
                      imageUrl: '',
                      signImageUrl: '',
                    },
                  });
                },
              });
            }
        } else {
            message.error('请选择组织机构');
    }
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
  onDelete(orgRefUserId) {
    const { userInfoManagement, dispatch } = this.props;
    const { userIds } = userInfoManagement;
    let ids = '';
    if(orgRefUserId){
      ids = orgRefUserId;
    } else {
      if(userIds.length > 0){
        ids = this.getByIdJs(userIds);
      } else {
        message.error('请先选择需要删除的数据');
        return;
      }
    }
    Modal.confirm({
      title: '确认删除吗？',
      // content: '确认删除该用户信息',
      okText: '删除',
      cancelText: '取消',
      mask:false,
      maskClosable:false,
      getContainer:(()=>{
        return document.getElementById('userInfo_container')
      }),
      onOk() {
        dispatch({
          type: 'userInfoManagement/deleteUser',
          payload: {
            identityIds: ids?ids:orgRefUserId,
          },
        });
      },
    });
  }


  adminHandle(curRecord) {
    if (curRecord.length == 1) {
      this.moreClick({ key: 'admin' }, curRecord[0]);
    } else {
      message.error('请选择一条用户信息进行管理');
    }
  }

  onChnageTab(type) {
    const { userInfoManagement, dispatch } = this.props;
    const { limit, searchWord, currentNode } = userInfoManagement;
    const { key, nodeType } = currentNode;
    currentNode.type = type;
      dispatch({
        type: 'userInfoManagement/updateStates',
        payload: {
          type,
        },
      });
    if (key) {
      this.getUsers(key, 1, searchWord, type, limit, nodeType);
    }

  }

  onChangeSearchWord(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'userInfoManagement/updateStates',
      payload: {
        searchWord: e.target.value,
      },
    });
  }
  identityPost(obj) {
    const { userInfoManagement, loading, dispatch } = this.props;
    const { identityModal, currentUg } = userInfoManagement;
    //orgItemUg.nodeId
    dispatch({
      type: 'userInfoManagement/getIdentity',
      payload: {
        userId: obj.userId,
      },
      callback: function() {
        dispatch({
          type: 'userInfoManagement/identityPost',
          payload: {
            nodeType: 'POST',
            identityParent: [],
          },
          callback: function() {
            dispatch({
              type: 'userInfoManagement/updateStates',
              payload: {
                identityModal: true,
                currentUg: obj,
              },
            });
          },
        });
      },
    });
  }
  onAddCancel() {
    const { userInfoManagement, dispatch } = this.props;
    const { identityModal } = userInfoManagement;
    dispatch({
      type: 'userInfoManagement/updateStates',
      payload: {
        identityModal: false,
        exportUserModal: false,
      },
    });
    this.setState({ commonSort: false });
  }
  importUser() {
    const { userInfoManagement, dispatch } = this.props;
    const { isShowImportUserModel } = userInfoManagement;
    dispatch({
      type: 'userInfoManagement/updateStates',
      payload: {
        isShowImportUserModel: true,
      },
    });
  }

  onImportModalCancel() {
    const { userInfoManagement, dispatch } = this.props;
    const { isShowImportUserModel, importData } = userInfoManagement;
    dispatch({
      type: 'userInfoManagement/updateStates',
      payload: {
        isShowImportUserModel: false,
        importData: {},
      },
    });
  }
  handleSave(record) {
    const { dispatch } = this.props;
    let arr = [];
    arr.push(record);
    dispatch({
      type: 'userInfoManagement/updateStates',
      payload: {
        users: arr,
      },
    });
  }
  OperatingMoreMenu() {
    const { user } = this.props;
    const { menus,menusUrlList } = user;
    return (
      <Menu onClick={this.onMenuClick.bind(this)}>
        {getButtonByUrl(menusUrlList, 'export','','/userInfoManagement') && <Menu.Item key="export">导出</Menu.Item>}
        {getButtonByUrl(menusUrlList, 'import','','/userInfoManagement') && <Menu.Item key="import">导入</Menu.Item>}
        {getButtonByUrl(menusUrlList, 'enable','','/userInfoManagement') && <Menu.Item key="enable">启用</Menu.Item>}
        {getButtonByUrl(menusUrlList, 'disable','','/userInfoManagement') && (
          <Menu.Item key="disable">停用</Menu.Item>
        )}
        {getButtonByUrl(menusUrlList, 'sort','','/userInfoManagement') && <Menu.Item key="sort">排序</Menu.Item>}
        {/* <Menu.Item key="sort">排序</Menu.Item> */}
      </Menu>
    );
  }
  onMenuClick(event) {
    const { key } = event;
    switch (key) {
      case 'import':
        this.importUser();
        break;
      case 'export':
        this.exportUser();
        break;
      case 'sort':
        this.onCommonSort();
        break;
      case 'enable':
        this.enableUser('enable');
        break;
      case 'disable':
        this.enableUser('disable');
        break;
    }
  }
  exportUser() {
    const { userInfoManagement, dispatch } = this.props;

    // dispatch({
    //   type: 'userInfoManagement/getOrgChildren',
    //   payload: {
    //     nodeType: 'ORG',
    //     start: 1,
    //     limit: 10000,
    //   },
    //   callback: function() {
    //     dispatch({
    //       type: 'userInfoManagement/updateStates',
    //       payload: {
    //         exportUserModal: true,
    //         exportCheckeds: [],
    //       },
    //     });
    //   },
    // });

    dispatch({
      type: 'userInfoManagement/getOrgTree',
      payload: {
        parentId:'',
        orgKind:'ORG',
        searchWord:'',
      },
      callback: function() {
        dispatch({
          type: 'userInfoManagement/updateStates',
          payload: {
            exportUserModal: true,
            exportCheckeds: [],
          },
        });
      },
    });

    return;

    const { currentNode, userIds, type } = userInfoManagement;
    const { key, nodeType } = currentNode;
    if (userIds.length > 0) {
      dispatch({
        type: 'userInfoManagement/userExport',
        payload: {
          orgId: nodeType == 'ORG' ? key : '',
          deptId: nodeType == 'DEPT' ? key : '',
          type,
          ids: userIds.toString(),
        },
        callback: function(data) {
          window.open(data);
        },
      });
    } else {
      message.error('请至少选择一个用户');
    }
  }
  //排序
  onCommonSort() {
    const { userInfoManagement, dispatch } = this.props;
    const { currentNode } = userInfoManagement;
    const { key, nodeType, type} = currentNode;
    if (key) {
      this.setState({
        columns: [
          {
            title:'序号',
            width: '8%',
            dataIndex:'index',
            render:(value,obj,index)=><span>{index+1}</span>
          },
          {
            title: '登录账号',
            dataIndex: 'userAccount',
            width: '36%',
          },
          {
            title: '姓名',
            dataIndex: 'userName',
            width: '36%',
          },
        ],
      });

      dispatch({
        type: 'userInfoManagement/querySortUser',
        payload: {
          searchWord: '',
          orgId: key,
          deptId: key,
          start: 1,
          limit: 10000,
          type: type
        },
        callback: list => {
          this.setState({ sortData: list, commonSort: true });
          // this.setState({commonSort:true})
        },
      });
    } else {
      message.error('请选择所属单位');
    }
  }
  saveCallBack(list) {
    const { dispatch, userInfoManagement } = this.props;
      
      const { currentPage, limit, type, currentNode ,searchWord} = userInfoManagement;
    const { key, nodeType } = currentNode;
    let arr = [];
    var reg = /^\d{1,9}$|^\d{1,9}[.]\d{1,6}$/;
    const flag= list.every(item=>reg.test(item.sort))
    if(!flag){
      message.error('最大支持9位整数，6位小数')
    }else{
      list.forEach(function(item, i) {
        let obj = {
          sort: item.sort,
          id: item.id,
        };
        arr.push(obj);
      });
      if(arr.length){
        dispatch({
          type: 'userInfoManagement/userSort',
          payload: {
            identities: JSON.stringify(arr),
          },
          callback: () => {
            this.getUsers(key, 1, searchWord, type, limit, nodeType);
          },
        });
      }
      this.setState({ commonSort: false });
    }
  }
  enableUser(text) {
    const { dispatch, userInfoManagement } = this.props;
    const {
      currentPage,
      limit,
      type,
      currentNode,
      userIds,
      searchWord
    } = userInfoManagement;
    const { key, nodeType } = currentNode;
    if (userIds.length > 0) {
      dispatch({
        type: 'userInfoManagement/userEnable',
        payload: {
          type: text == 'enable' ? 1 : 0,
          identityIds: userIds.toString(),
        },
        callback: () => {
          this.getUsers(key, 1, searchWord, type, limit, nodeType);
        },
      });
    } else {
      message.error('请至少选择一个用户');
    }
  }
  changePage(page,size) {
    console.log(page, size, '635-----')
    const { dispatch, userInfoManagement } = this.props;
    const { type, currentNode, searchWord } = userInfoManagement;
    const { key, nodeType } = currentNode;
    dispatch({
      type: 'userInfoManagement/updateStates',
      payload:{
        currentPage: page,
        limit: size,
      }
    })
    this.getUsers(key, page, searchWord, type, size, nodeType);
  }
  showDetails(record) {
    this.onAdd(record) 
    this.setState({viewModal:true})
    // viewDetailsModalRef.show([
    //   { key: '登录账号', value: record.userAccount },
    //   { key: '姓名', value: record.userName },
    //   { key: '姓名简称', value: record.userShortName },
    //   { key: '账号是否启用', value: record.isEnable, type: 1 },
    //   { key: '单位信息', value: record.orgName },
    //   { key: '岗位信息', value: record.postName },
    // ]);
  }

  render() {
    const { commonSort, columns, sortData ,viewModal} = this.state;
    const { userInfoManagement, loading, dispatch, user } = this.props;
    const {
      returnCount,
      userIds,
      searchWord,
      users,
      currentUg,
      imageUrl,
      signImageUrl,
      limit,
      addModal,
      currentNode,
      type,
      currentPage,
      treeData,
      treeSearchWord,
      expandedKeys,
      identityModal,
      isShowImportUserModel,
      importData,
      exportUserModal,
      leftNum
    } = userInfoManagement;
    const { key, nodeType } = currentNode;
    const { menus ,menusUrlList} = user;
    const OperatingMore = record => {
      return (
        <Menu
          onClick={e => {
            this.moreClick(e, record);
          }}
        >
          {getButtonByUrl(menusUrlList, 'delete','','/userInfoManagement') && (
            <Menu.Item key="admin">管理</Menu.Item>
          )}
           <Menu.Item key="resetPassword">重置密码</Menu.Item>
           <Menu.Item key="resetLoginNum">重置登录次数</Menu.Item>
           <Menu.Item key="copy">复制ID</Menu.Item>
        </Menu>
      );
    };
    // 处理岗位状态和主岗兼职的显示逻辑

    const getPostDisplayText = (record: any, text: string) => {
      // if (record.isPostStatus!== 1) {
      //   return text;
      // }
      const postType = record.isMainPost === 1 ? '主岗' : '兼职';
      const postStatus = record.isLeavePost === 1 ? '离岗' : '在岗';
      return `${text || ''}【${postType}】(${postStatus})`;
    };
    const tableProps = {
      rowKey: 'id',
      scroll:users.length>0?{ x: 1100,y: 'calc(100% - 45px)'}:{},

      columns: [
        {
          title:'序号',
          dataIndex:'index',
          width:ORDER_WIDTH,
          render:(value,obj,index)=><span>{index+1}</span>
        },
        {
          title: '登录账号',
          dataIndex: 'userAccount',
          width:BASE_WIDTH,
          render: (text, record) => (
            <div className={styles.text} title={text}>
              {getButtonByUrl(menusUrlList, 'view','','/userInfoManagement') ? (
                <a
                  style={{ marginLeft: '5px' }}
                  onClick={() => {
                    this.showDetails(record);
                  }}
                >
                  {text}
                </a>
              ) : (
                text
              )}
            </div>
          ),
        },
        {
          title: '姓名',
          dataIndex: 'userName',
          width:BASE_WIDTH,
          render: text => (
            <div className={styles.text} title={text}>
              {text}
            </div>
          ),
        },
        {
          title: '所属单位',
          dataIndex: 'orgName',
          width:BASE_WIDTH*2.5,
          render: text => (
            <div className={styles.text} title={text}>
              {text}
            </div>
          ),
        },
        {
          title: '所属部门',
          dataIndex: 'deptName',
          width:BASE_WIDTH*2.5,
          render: text => (
            <div className={styles.text} title={text}>
              {text}
            </div>
          ),
        },
        {
          title: '所属岗位',
          dataIndex: 'postName',
          width:BASE_WIDTH*1.5,
          render: (text,record) => (
            <div className={styles.text} title={text}>
              {getPostDisplayText(record, text)}
            </div>
          ),
        },
        // {
        //   title:'身份ID',
        //   dataIndex:'identityId',
        //   width:BASE_WIDTH,
        //   render: text => (
        //     <div className={styles.text} title={text}>
        //       {text}
        //     </div>
        //   ),
        // },
        {
          title: '账号状态',
          dataIndex: 'isEnable',
          width:BASE_WIDTH,
          render: text => {
            return text == 1 ? '启用' : '停用';
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
          width:BASE_WIDTH,
          render: text => (
            <div className={styles.text} title={text}>
              {dataFormat(text, 'YYYY-MM-DD')}
            </div>
          )
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          width:BASE_WIDTH*1.5,
          render: (text, record) => {
            return (
              <div  className="table_operation">
                {/* <Space> */}
                  {getButtonByUrl(menusUrlList, 'update','','/userInfoManagement') && (
                    <span onClick={this.onAdd.bind(this, record)}>修改</span>
                  )}
                  {getButtonByUrl(menusUrlList, 'delete','','/userInfoManagement') && (
                    <span
                      onClick={this.onDelete.bind(
                        this,
                        record.identityId,
                      )}
                    >
                      删除
                    </span>
                  )}
                  <Dropdown
                    overlay={OperatingMore.bind(this, record)}
                    trigger={['click']}
                  >
                    <span
                      className="ant-dropdown-link"
                      onClick={e => e.preventDefault()}
                    >
                      更多 <DownOutlined />
                    </span>
                  </Dropdown>
                {/* </Space> */}
              </div>
            );
          },
        },
      ],
      dataSource: users,
      pagination: false,
      rowSelection: {
        selectedRowKeys: userIds,
        onChange: (selectedRowKeys, selectedRows) => {
          this.setState({ selectedRows });
          dispatch({
            type: 'userInfoManagement/updateStates',
            payload: {
              userIds: selectedRowKeys,
            },
          });
        },
      },
    };

    return (
      <div
        style={{ height: '100%', borderRadius: '4px' }}
        id="userInfo_container"
      >
        <CTM
          treeData={treeData}
          expandedKeys={expandedKeys}
          treeSearchWord={treeSearchWord}
          currentNode={currentNode}
          nodeType={'ORG_'}
          plst={'输入单位/部门名称、编码'}
          moudleName={"userInfoManagement"}
          onSearchTable={this.onSearchTable.bind(this)}
          leftNum={leftNum}
          getData={node => {
            dispatch({
              type: 'userInfoManagement/updateStates',
              payload: {
                currentPage: 1,
                searchWord: ''
              },
            });
            this.getUsers(node.key, 1, '', type, limit, node.nodeType);
          }}
          UserDepartmentFiltering={true}
        >
          <div className="departmentFiltering">
            <Tabs defaultActiveKey="" onChange={this.onChnageTab.bind(this)}>
              {/* <TabPane tab="全部" key="">
            </TabPane> */}
              <TabPane tab="本级" key="SELF"></TabPane>
              <TabPane tab="本级含以下" key="SELF_AND_CHILD"></TabPane>
            </Tabs>
          </div>
          <div className={styles.other} id='list_head'>
            <Input.Search
              onChange={this.onChangeSearchWord.bind(this)}
              className={styles.search}
              placeholder={'姓名/账号/手机号/邮箱'}
              defaultValue={searchWord}
              value={searchWord}
              allowClear
              onSearch={value => {
                this.onSearchTable(value);
              }}
              enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
            />
            <Space className={styles.bt_gp}>
              {getButtonByUrl(menusUrlList, 'add','','/userInfoManagement') && (
                <Button
                type='primary'
                  onClick={this.onAdd.bind(this, {})}
                  className={styles.fontSize7}
                >
                  新增
                </Button>
              )}
              {getButtonByUrl(menusUrlList, 'delete','','/userInfoManagement') && (
                <Button
                  className={styles.fontSize7}
                  onClick={this.onDelete.bind(this, '', true)}
                >
                  删除
                </Button>
              )}
              <Dropdown
                overlay={this.OperatingMoreMenu.bind(this)}
                trigger={['click']}
              >
                <Button onClick={e => e.preventDefault()}>
                  更多
                  <DownOutlined />
                </Button>
              </Dropdown>
            </Space>
          </div>
          <div style={{height:'calc(100% - 135px)'}}>
            <ColumnDragTable taskType="MONITOR" modulesName="userInfoManagement" {...tableProps} key={loading} components={components} />
          </div>

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
          {addModal && (
            // <Modal
            //   title={currentUg.id ? '修改用户' : '新增用户'}
            //   visible={true}
            //   onCancel={() => {
            //     dispatch({
            //       type: 'userInfoManagement/updateStates',
            //       payload: {
            //         addModal: false,
            //       },
            //     });
            //   }}
            //   width={900}
            //   mask={false}
            //   maskClosable={false}
            //   centered
            //   className={styles.add_form}
            //   bodyStyle={{ overflow: 'auto',height:'calc(100vh - 275px)'}}
            //   footer={[]}
            //   getContainer={() => {
            //     return document.getElementById('userInfo_container')||false;
            //   }}
            // >
              <NewUsers
                handleEditOkClick={this.handleEditOkClick.bind(this)}
                onCancel={() => {
                  dispatch({
                    type: 'userInfoManagement/updateStates',
                    payload: {
                      addModal: false,
                    },
                  });
                }}
                viewModal={this.state.viewModal}
              />

          )}
          {isShowImportUserModel && (
            <ImprotUserModal
              importData={importData}
              currentNode={currentNode}
              onCancel={this.onImportModalCancel.bind(this)}
            />
          )}

          {commonSort && (
            <COMMONSORT
              loading={loading.global}
              name="userInfo"
              onCancel={this.onAddCancel.bind(this)}
              tableList={sortData}
              columns={columns}
              saveCallBack={this.saveCallBack.bind(this)}
            />
          )}
          {exportUserModal && (
            <EXPORTUSER
              onCancel={this.onAddCancel.bind(this)}
              loading={loading}
            />
          )}
          <ViewDetailsModal
            title="查看用户信息"
            containerId="userInfo_container"
            ref={ref => {
              viewDetailsModalRef = ref;
            }}
          ></ViewDetailsModal>
        </CTM>
        {identityModal && (
          <IDENTITY //身份
            loading={loading.global}
            onCancel={this.onAddCancel.bind(this)}
            // postUg={postUg}
          />
        )}
      </div>
    );
  }
}

export default () => {
  return (
      <UserInfo />
  );
};
