import {message} from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant'
import _ from "lodash";
import {env} from '../../../../project_config/env'
import { parse } from 'query-string';
import { history } from 'umi'
const {  addDept, deleteDept, updateDept, getDept, importDept,importDeptResult,getDownFileUrl,getOrgPermissionAuth,findPermissionAuth,deptExport,orgSort,orgEnable, getOrgChildren, getSearchTree} = apis;
export default {
  namespace: 'deptMg',
  state: {
    // 使用公用upload组件 所需的全部初始数据（有的用不到，酌情删减）
    fileUrl:'',
    selectTreeUrl: [],//面包屑路径
    uploadFlag: true, //上传暂停器
    nowMessage: '', //提示上传进度的信息
    md5: '', //文件的md5值，用来和minio文件进行比较
    fileChunkedList: [], //文件分片完成之后的数组
    fileName: '', //文件名字
    fileNames: '',  //文件前半部分名字
    fileStorageId: '', //存储文件信息到数据库接口返回的id
    typeNames: '', //文件后缀名
    optionFile: {}, //文件信息
    fileSize: '', //文件大小，单位是字节
    getFileMD5Message: {}, //md5返回的文件信息
    success: '', //判断上传路径是否存在
    v: 1, //计数器
    needfilepath: '', //需要的minio路径
    isStop: true,  //暂停按钮的禁用
    isContinue: false, //继续按钮的禁用
    isCancel: false, //取消按钮的禁用
    index: 0, //fileChunkedList的下标，可用于计算上传进度
    merageFilepath: '',  //合并后的文件路径
    typeName: '', //层级
    fileExists: '', //判断文件是否存在于minio服务器中，相关modal中监听判断fileExists状态进行后续分别操作
    md5FileId: '', //md5查询到的文件返回的id
    md5FilePath: '', //md5查询到的文件返回的pathname 
    ///////////

    depts: [], //部门列表
    allPage: 1,
    currentPage: 1,
    returnCount: 0,
    modalVisible: false, //弹窗状态
    dept: {}, //当前部门信息
    searchWord: '',
    deptIds: [],
    currentParentDeptId: '', //父节点部门id
    currentParentDeptName: '', //父节点部门名称
    hasMore: true,
    key: 0,
    selectedRows: [],
    expandOrgList:[],
    treeData: [],
    currentNode: {},
    treeSearchWord: '',
    expandedKeys: [],
    expandId: '',
    limit: 10,
    isShowImportDeptModel: false,
    isShowExportDeptModel:false,
    importData: {},
    viewDeptPicModel:false,
    viewDeptPicData:{},
    sortData:[],
    sortExpandedRowKeys:[],
    expandedRowKeys:[],
    leftNum:220,
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen(location => {
        // if (history.location.pathname.includes ('/deptMg')) {
        //   const query = parse(history.location.search);
        //   const {
        //     currentNodeId,
        //     currentPage,
        //     searchWord,
        //     isInit,
        //     limit,
        //   } = query;
        //   if (isInit == '1') {
        //     dispatch({
        //       type: 'updateStates',
        //       payload: {
        //         orgIds: [],
        //         deptIds: [],
        //         dept: {},
        //         returnCount: 0,
        //         modalVisible: false,
        //         currentParentDeptId: '', //父节点部门id
        //         currentParentDeptName: '', //父节点部门名称
        //         hasMore: true,
        //         key: 0,
        //         selectedRows: [],
        //         depts: [], //部门列表
        //       },
        //     });
        //   }
        //   // if (currentNodeId && currentNodeId != 'undefined') {
        //   //   dispatch({
        //   //     type: 'getOrgChildren',
        //   //     payload: {
        //   //       nodeId: currentNodeId,
        //   //       start: currentPage,
        //   //       limit: limit,
        //   //       nodeType: 'ORG',
        //   //     },
        //   //   });
        //   // }
        // }
      });
    },
  },
  effects: {
    *getOrgChildren({ payload, typeName ,callback}, { call, put, select }) {
      try {
        const { data } = yield call(getOrgChildren, payload);
        const { depts,deptIds,expandedRowKeys } = yield select(state => state.deptMg);
        // 根据isHasChild参数判断是否显示子级
        const  loop = (array,children)=>{
          for(var i=0;i<array.length;i++){
            if(payload.nodeId == array[i]['id']){
              if(children.length > 0){
                children.forEach((item,index) => {
                  item.number = index+1;
                  item.nodeName='\xa0'.repeat((item.grade-2)*4)+item.nodeName
                })
                array[i]['children'] = children;
                children.forEach((item) => {
                  item.number = index+1;
                })
              }else{
                array[i]['children'] = null;
              }

            }
            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children,children);
            }
            if(depts.length==1&&depts[0]['isParent']=='0'){
              array=children
            }
          }
          return array;
        }
        if (data.code == REQUEST_SUCCESS) {
          let treeData = JSON.parse(JSON.stringify(data.data.list));
          for(let i=0;i<treeData.length;i++){
            treeData[i]['number'] = i+1;
            if(treeData[i]['isParent'] == '1'){
              treeData[i]['children'] = [];
              treeData[i]['id'] = treeData[i]['nodeId'];
              treeData[i]['orgShortName'] = treeData[i]['orgShortName'];
            }
          }
          let deptData = [];
          let sortData=[]
          if(typeName=='sort'){
            sortData=treeData
            yield put({
              type: 'updateStates',
              payload: {
                sortData:sortData
              }
            });
            // return 
          }else{
            if(depts && depts.length >0){
              if(payload.nodeId){
                deptData = loop(depts,treeData);
                if(deptIds.length==0){
                  deptData=treeData
                }
              }else{
                deptData = treeData;
              }
            }else{
              deptData = treeData;
            }
            yield put({
              type: 'updateStates',
              payload: {
                // deptIds: [],
                // selectedKeys: [],
                // depts: _.concat(depts,data.data.depts),
                depts: deptData,
                returnCount: data.data.returnCount,
                // currentPage: data.data.currentPage,
                // allPage: data.data.allPage,
                expandedRowKeys:deptIds.length==0?[]:expandedRowKeys
              },
            });
          }
          
          callback && callback(deptData,data.data.list);
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getOrgTreeList({payload,typeName,callback},{call,put ,select}){
      try {
        const { data } = yield call(apis.getOrgTreeList, payload);
        const { depts,deptIds,expandedRowKeys } = yield select(state => state.deptMg);
        // 根据isHasChild参数判断是否显示子级
        const  loop = (array,children)=>{
          for(var i=0;i<array.length;i++){
            if(payload.parentId == array[i]['id']){
              if(children.length > 0){
                children.forEach((item,index) => {
                  item.number = index+1;
                  item.orgName='\xa0'.repeat((item.grade-2)*4)+item.orgName
                })
                array[i]['children'] = children;
                children.forEach((item) => {
                  item.number = index+1;
                })
              }else{
                array[i]['children'] = null;
              }

            }
            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children,children);
            }
            if(depts.length==1&&depts[0]['isParent']=='0'){
              array=children
            }
          }
          return array;
        }
        if (data.code == REQUEST_SUCCESS) {
          let treeData = JSON.parse(JSON.stringify(data.data.list));
          for(let i=0;i<treeData.length;i++){
            treeData[i]['number'] = i+1;
            if(treeData[i]['isParent'] == '1'&&!payload.searchWord){
              treeData[i]['children'] = [];
            }
          }
          let deptData = [];
          let sortData=[]
          if(typeName=='sort'){
            sortData=treeData
            yield put({
              type: 'updateStates',
              payload: {
                sortData:sortData
              }
            });
            // return 
          }else if(typeName=='view'){
            callback && callback(deptData,data.data.list);
          }
          else{
            if(depts && depts.length >0){
              if(payload.parentId){
                deptData = loop(depts,treeData);
                if(deptIds.length==0){
                  deptData=treeData
                }
              }else{
                deptData = treeData;
              }
            }else{
              deptData = treeData;
            }
            yield put({
              type: 'updateStates',
              payload: {
                // deptIds: [],
                // selectedKeys: [],
                // depts: _.concat(depts,data.data.depts),
                depts: deptData,
                returnCount: data.data.returnCount,
                // currentPage: data.data.currentPage,
                // allPage: data.data.allPage,
                expandedRowKeys:deptIds.length==0?[]:expandedRowKeys
              },
            });
          }
          
          callback && callback(deptData,data.data.list);
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *newGetOrgTreeList({payload,typeName},{call, put, select}){
      try {
        const { data } = yield call(apis.getOrgTreeList, payload);
        const { depts,sortData } = yield select(state => state.deptMg);
        // 根据isHasChild参数判断是否显示子级
        const  loop = (array,children)=>{
          for(var i=0;i<array.length;i++){
            if(payload.parentId == array[i]['id']){
              if(children.length > 0){
                array[i]['children'] = children;
                children.forEach((item,index) => {
                  item.number = index+1;
                  item.orgName='\xa0'.repeat((item.grade-2)*4)+item.orgName
                })
              }else{
                array[i]['children'] = null;
              }

            }
            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children,children);
            }
          }
          return array;
        }
        if (data.code == REQUEST_SUCCESS) {
          let treeData = JSON.parse(JSON.stringify(data.data.list));
          for(let i=0;i<treeData.length;i++){
            treeData[i]['number'] = i+1;
            if(treeData[i]['isParent'] == '1'){
              treeData[i]['children'] = [];
              treeData[i]['id'] = treeData[i]['id'];
            }
          }
          if(typeName=='sort'){
            yield put({
              type:'updateStates',
              payload:{
                sortData: [...loop(sortData,treeData)]
              }
            })
          }else{
            let deptData = [];
            if(depts && depts.length >0){
              if(payload.parentId){
                deptData = loop(depts,treeData);
              }else{
                deptData = treeData;
              }
            }else{
              deptData = treeData;
            }
          }
          
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *newGetOrgChildren({ payload,typeName }, { call, put, select }) {
      try {
        const { data } = yield call(getOrgChildren, payload);
        const { depts,sortData } = yield select(state => state.deptMg);
        // 根据isHasChild参数判断是否显示子级
        const  loop = (array,children)=>{
          for(var i=0;i<array.length;i++){
            if(payload.nodeId == array[i]['id']){
              if(children.length > 0){
                array[i]['children'] = children;
                children.forEach((item,index) => {
                  item.number = index+1;
                  item.nodeName='\xa0'.repeat((item.grade-2)*4)+item.nodeName
                })
              }else{
                array[i]['children'] = null;
              }

            }
            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children,children);
            }
          }
          return array;
        }
        if (data.code == REQUEST_SUCCESS) {
          let treeData = JSON.parse(JSON.stringify(data.data.list));
          for(let i=0;i<treeData.length;i++){
            treeData[i]['number'] = i+1;
            if(treeData[i]['isParent'] == '1'){
              treeData[i]['children'] = [];
              treeData[i]['id'] = treeData[i]['nodeId'];
            }
          }
          if(typeName=='sort'){
            yield put({
              type:'updateStates',
              payload:{
                sortData: loop(sortData,treeData)
              }
            })
          }else{
            let deptData = [];
            if(depts && depts.length >0){
              if(payload.nodeId){
                deptData = loop(depts,treeData);
              }else{
                deptData = treeData;
              }
            }else{
              deptData = treeData;
            }
          }
          
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getSearchTree({ payload,callback,pathname,moudleName }, { call, put, select }) {
      try {
        const {data} = yield call(getSearchTree, payload);
        const { exportUsers,orgs } = yield select(state => state.unitInfoManagement);
        data.data.list.forEach((item, index) => {
          item.number = index+1;
        })
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              depts: data.data.list,
              returnCount: data.data.returnCount,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getSortDepts({ payload,callback }, { call, put, select }) {
      try {
        const { data } = yield call(getOrgChildren, payload);
        if (data.code == REQUEST_SUCCESS) {
          callback && callback(data.data.list);
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //修改
    *updateDept({ payload }, { call, put, select }) {
      // yield put({
      //   type: 'updateStates',
      //   payload: {
      //     loading: true,
      //   },
      // });
      try {
        const { data } = yield call(updateDept, payload);
        const { currentNode, currentPage, searchWord, limit, depts,expandedRowKeys} = yield select(
          state => state.deptMg,
        );
        if (data.code == REQUEST_SUCCESS) {
          if(searchWord) {
            yield put({
              type: 'getOrgTreeList',
              payload:{
                // searchWord: searchWord,
                // type: 'DEPT',
                // start: currentPage,
                // limit: limit,
                // parentId: currentNode.id

                parentId:currentNode.id,
                start:currentPage,
                limit:limit,
                orgKind: 'DEPT',
                searchWord:searchWord
              }
            });
            yield put({
              type: 'updateStates',
              payload: {
                modalVisible: false,
                depts: [],
                expandedRowKeys: []
              },
            });
          } else {
            // yield put({
            //   type: 'getOrgChildren',
            //   payload: {
            //     nodeId: payload.parentId?payload.parentId:currentNode.key,
            //     start: currentPage,
            //     limit: limit,
            //     nodeType: 'DEPT',
            //     onlySubDept: '1'
            //   },
            // });
            yield put({
              type: 'getOrgTreeList',
              payload: {
                parentId:payload.parentId?payload.parentId:currentNode.key,
                start:payload.parentId?1:currentPage,
                limit:limit,
                orgKind: 'DEPT',
                searchWord:''
              },
            });
            if(!payload.parentId) {
              yield put({
                type: 'updateStates',
                payload: {
                  modalVisible: false,
                  expandedRowKeys: [],
                  depts: [],
                },
              });
            } else {
              yield put({
                type: 'updateStates',
                payload: {
                  expandedRowKeys: [],
                  modalVisible: false,
                },
              });
            }
          }
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //新增
    *addDept({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(addDept, payload);
        const { currentNode, limit, allPage, currentPage ,deptIds} = yield select(state => state.deptMg);

        if (data.code == REQUEST_SUCCESS) {
          // yield put({
          //   type: 'getOrgChildren',
          //   payload: {
          //     nodeId: payload.parentId?payload.parentId:currentNode.key,
          //     start:payload.parentId?currentPage:(allPage==0?1:allPage),
          //     limit: limit,
          //     nodeType: 'DEPT',
          //     onlySubDept: 1
          //   },
          // });
          yield put({
            type: 'getOrgTreeList',
            payload: {
              parentId:payload.parentId?payload.parentId:currentNode.key,
              start:deptIds.length?1:currentPage,
              limit:limit,
              orgKind: 'DEPT',
              searchWord:''
            },
          });
          yield put({
            type: 'updateStates',
            payload: {
              modalVisible: false,
              // depts: []
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *deleteDept({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(deleteDept, payload);
        const { currentNode, currentPage, searchWord, limit, depts } = yield select(
          state => state.deptMg,
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              currentParentDeptId: '',
              currentParentDeptName: '',
              depts: [],
              selectedRows: [],
              expandedRowKeys:[]
            },
          });
          
          // yield put({
          //   type: 'getOrgChildren',
          //   payload: {
          //     nodeId: currentNode.key,
          //     start:depts.length==1?currentPage-1:currentPage,
          //     limit: limit,
          //     nodeType: 'DEPT',
          //     onlySubDept: 1
          //   },
          // });
          yield put({
            type: 'getOrgTreeList',
            payload: {
              parentId:currentNode.key,
              start:depts.length==1?currentPage-1:currentPage,
              limit:limit,
              orgKind: 'DEPT',
              searchWord:''
            },
          });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getDept({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getDept, payload);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              dept: data.data,
              modalVisible: true,
            },
          });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },

    *getDeptForView({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getDept, payload);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              dept: data.data,
            },
          });
          callback && callback(data.data);
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },

    // 文件上传接口
    *uploaderFile({ payload, callback }, { call, put, select }) {
      yield fetch(`${env}/public/fileStorage/uploaderFile`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + window.localStorage.userToken,
        },
        body: payload.importFormData,
      }).then(res => {
        res
          .json()
          .then(data => {
            if (data.code == 200) {
              callback && callback(data.data);
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
              message.error(data.msg);
            }
          })
          .catch(err => {
              // 将 err 转换为字符串类型
              const errorMessage = err instanceof Error ? err.message : String(err);
              message.error(errorMessage);
          });
      });
    },

    //部门信息导入
    *importDept({ payload, callback }, { call, put, select }) {
      const { data } = yield call(importDept, payload);
      if (data.code == REQUEST_SUCCESS) {
        callback && callback(data.data.importId);
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },

    //部门信息导入结果查看
    *importDeptResult({ payload, callback }, { call, put, select }) {
      const { data } = yield call(importDeptResult, payload);
      if (data.code == REQUEST_SUCCESS) {
        callback && callback(true, data);
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        callback && callback(false, data);
      }
    },
    //获取上传的文件路径
    *getDownFileUrl({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getDownFileUrl, payload);
        if (data.code == REQUEST_SUCCESS) {
          callback && callback(data.data.fileUrl);
        } else {
          message.error(data.msg, 5);
        }
      } catch (e) {
      } finally {
      }
    },
    //获取组织机构只读编辑权限
    *getOrgPermissionAuth({ payload, callback }, { call, put, select }) {
      try {
          const { data } = yield call(getOrgPermissionAuth, payload);
          if (data.code == REQUEST_SUCCESS) {
              callback && callback(data.data.isAuth);
          } else {
              message.error(data.msg, 5)
          }
      } catch (e) {
      } finally {
      }
  
    },
    *findPermissionAuth({ payload, callback }, { call, put, select }) {
      const { data } = yield call(findPermissionAuth, payload);
      if (data.code == REQUEST_SUCCESS) {
          callback&&callback(data)
      } 
    },
    *deptExport({ payload, callback }, { call, put, select }) {
      const { data } = yield call(deptExport, payload);
      if (data.code == REQUEST_SUCCESS) {
        callback&&callback(data.data)
      } 
    },
    *orgChart({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.orgChart, payload);
      if (data.code == REQUEST_SUCCESS) {
        callback&&callback(data.data.orgs)
      } 
    },
    *orgSort({ payload, callback }, { call, put, select }) {
      const { data } = yield call(orgSort, payload);
      if (data.code == REQUEST_SUCCESS) {
        callback&&callback()
      } 
    },
    *orgEnable({ payload, callback }, { call, put, select }) {
      const { data } = yield call(orgEnable, payload);
      if (data.code == REQUEST_SUCCESS) {
        message.success('操作成功');
        callback&&callback()
      } 
    },
    
  },
  reducers: {
    updateStates(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
