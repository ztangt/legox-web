import {message} from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant'
import { history } from 'umi'
import { env } from '../../../../project_config/env'
import _ from 'lodash'
const { addOrg, deleteOrg, updateOrg, getOrg,importOrg,importOrgResult,getDownFileUrl,findPermissionAuth,orgExport,orgEnable,orgSort,getPasswordPolicy, getOrgChildren,getSearchTree,getOrgTree,isOrgCenterShareOrg} = apis;
import { parse } from 'query-string';
export default {
  namespace: 'unitInfoManagement',
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

    orgs: [],//单位列表
    currentPage: 1,
    returnCount: 0,
    allPage: 1,
    modalVisible: false,//弹窗状态
    org: {},//当前单位信息
    searchWord: '',
    orgIds: [],
    editTreeVisible: false,//编辑弹窗状态
    treeData: [],
    currentNode: {},
    treeSearchWord: '',
    expandedKeys: [],
    expandId: '',
    limit: 10,
    isShowImportUnitModel:false,
    isShowExportUnitModel:false,
    importData: {},
    viewOrgPicModel:false,
    viewOrgPicData:{},
    initTreeList:[],//
    leftNum:220
  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      history.listen(location => {
        if (history.location.pathname === '/unitInfoManagement') {
          const query = parse(history.location.search);
          // const {currentNodeId,searchWord,currentPage,isInit,limit} = query
          // if(isInit=='1'){
          //   dispatch({
          //     type: 'updateStates',
          //     payload:{
          //       orgIds: [],
          //       orgs: [],
          //       returnCount: 0,
          //       modalVisible: false,
          //       editTreeVisible: false,
          //       org: {},//当前单位信息
          //     }
          //   })
          // }
          // if(currentNodeId&&currentNodeId!='undefined'){
          //   dispatch({
          //     type: 'getOrgChildren',
          //     payload:{
          //       orgId: currentNodeId,
          //       start: currentPage,
          //       limit: limit?limit:10,
          //       searchWord
          //     }
          //   })
          // }
        }
      });
    }
  },
  effects: {
    
    *getOrgChildren({ payload,callback,isDelete }, { call, put, select }) {
      try {
        const {data} = yield call(getOrgChildren, payload);
        const {expandedKeys, orgs} = yield select(state=>state.unitInfoManagement);
        const  loop = (array,children)=>{
          for(var i=0;i<array.length;i++){
            if(payload.nodeId == array[i]['nodeId']){
              if(children.length > 0){
                array[i]['children'] = children;
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
        if(data.code==REQUEST_SUCCESS){
          let treeData = JSON.parse(JSON.stringify(data.data.list));
          for(let i=0;i<treeData.length;i++){
            treeData[i]['id'] = treeData[i]['nodeId'];
            treeData[i]['orgName'] = treeData[i]['nodeName'];
            treeData[i]['orgNumber'] = treeData[i]['nodeNumber'];
            treeData[i]['orgCode'] = treeData[i]['nodeCode'];
            treeData[i]['isParent'] = treeData[i]['isParent'];
            treeData[i]['parentId'] = treeData[i]['parentId'];
            if(treeData[i]['isParent'] == '1'){
              // treeData[i]['children'] = []
            }
          }
          let deptData = [];
          if(orgs && orgs.length >0){
            if(payload.nodeId){
              deptData = loop(orgs,treeData);
            }else{
              deptData = treeData;
            }
          }else{
            deptData = treeData;
          }
          console.log(deptData,data, '0000000140');
          yield put({
            type: 'updateStates',
            payload:{
              orgIds: [],
              orgs: deptData,
              returnCount: data.data.returnCount,
              currentPage: data.data.currentPage,

              // allPage: data.data.allPage,
            }
          })
          // if(data.data.list.length==0&&isDelete){
          //   let exs = expandedKeys.filter((item)=>{return item!=payload.orgId})
          //   yield put({
          //     type: 'updateStates',
          //     payload:{
          //       expandedKeys: exs
          //     }
          //   })
          // }
          callback&&callback(data.data.list)
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }

    },
    *getOrgTreeList({ payload,callback,isDelete }, { call, put, select }){
      try {
        const {data} = yield call(apis.getOrgTreeList, payload);
        const {expandedKeys, orgs} = yield select(state=>state.unitInfoManagement);
        const  loop = (array,children)=>{
          for(var i=0;i<array.length;i++){
            if(payload.parentId == array[i]['id']){
              if(children.length > 0){
                array[i]['children'] = children;
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
        if(data.code==REQUEST_SUCCESS){
          let treeData = JSON.parse(JSON.stringify(data.data.list));
          let deptData = [];
          if(orgs && orgs.length >0){
              deptData = loop(orgs,treeData);
          }else{
            deptData = treeData;
          }
          console.log(deptData,data, '0000000140');
          yield put({
            type: 'updateStates',
            payload:{
              orgIds: [],
              orgs: deptData,
              returnCount: data.data.returnCount,
              currentPage: data.data.currentPage,
            }
          })
          callback&&callback(data.data.list)
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getSortOrgs({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(apis.getOrgTreeList, payload);
        if(data.code==REQUEST_SUCCESS){
          callback && callback(data.data.list);
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }

    },
    *getOrg({ payload }, { call, put, select }) {

      try {
        const {data} = yield call(getOrg, payload);
        const {currentNode} = yield select(state=>state.unitInfoManagement)

        if(data.code==REQUEST_SUCCESS){
          let org =  data.data
          org.isEnable = org.isEnable==1?true:false
          org.isDefaultAdmin = org.isDefaultAdmin==1?true:false
          if(org.parentId!=0){//非父级单位
            org.parentOrgName = currentNode.orgName
          }
          yield put({
            type: 'updateStates',
            payload:{
              org,
              modalVisible: true,

            }
          })
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log('e',e);

      } finally {
      }
    },
    *updateOrg({ payload, callback}, { call, put, select }) {
      yield put({
        type: 'updateStates',
        payload:{
          loading: true
        }
      })
      try {
        const {data} = yield call(updateOrg, payload);
        const {currentPage,searchWord,currentNode,limit,orgs, treeSearchWord} = yield select(state=>state.unitInfoManagement)
        // const {currentNodeId} = yield select(state=>state.tree)
        if(data.code==REQUEST_SUCCESS){
            // yield put({
            //   type: 'getOrgChildren',
            //   payload:{
            //     nodeId: currentNode.nodeId || payload.id,
            //     nodeType: 'ORG',
            //     start:1,
            //     limit:10,
            //     // onlySubDept:maxDataruleCode!=('A0004'||'A0002')?1:0
            //   },
            // })

            yield put({
              type: 'getOrgTreeList',
              payload:{
                parentId:currentNode.id ,
                start:currentPage,
                limit:limit,
                orgKind: 'ORG',
                searchWord:searchWord
              },
            })

            // yield put({
            //   type: 'tree/getOrgChildren',
            //   payload:{
            //     nodeId:payload.parentId=='0'?'':payload.parentId,
            //     nodeType: 'ORG',
            //     start:1,
            //     limit:200,
            //     isEnable: '1',
            //     onlySubDept:(maxDataruleCode=='A0004'||maxDataruleCode=='A0002')?0:1
            //   },
            //   pathname: '/unitInfoManagement',
            //   isParent: true,
            // })
            yield put({
              type: 'tree/getOrgTree',
              payload:{
                parentId:payload.parentId=='0'?'':payload.parentId,
                orgKind:'ORG',
                searchWord:'',
                isEnable:'1'
              },
              pathname: '/unitInfoManagement',
              isParent: true,
            })
            if(treeSearchWord) {
              yield put({
                type: 'tree/getSearchTree',
                payload:{
                  parentId:'',
                  orgKind:'ORG',
                  searchWord:treeSearchWord,
                },
                // type: 'tree/getSearchTree',
                // payload:{
                //   searchWord: treeSearchWord,
                //   type: 'ORG',
                //   start:1,
                //   limit: 100,
                //   onlySubDept:(maxDataruleCode=='A0004'||maxDataruleCode=='A0002')?0:1
                // },
              })
            }

          yield put({
            type: 'updateStates',
            payload:{
              modalVisible: false,
              orgs:[]
            }
          })
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
      yield put({
        type: 'updateStates',
        payload:{
          loading: false
        }
      })
    },
    *addOrg({ payload,callback }, { call, put, select }) {
      yield put({
        type: 'updateStates',
        payload:{
          loading: true
        }
      })
      try {
        const {data} = yield call(addOrg, payload);
        const {currentNode,limit,treeData,allPage,orgs,expandedKeys,currentPage} = yield select(state=>state.unitInfoManagement)
        callback&&callback(data);
        if(data.code==REQUEST_SUCCESS){
          // if(treeData.length!=0&&Object.keys(currentNode).length!=0){
            // yield put({
            //   type: 'getOrgChildren',
            //   payload:{
            //     nodeId: payload.parentId?payload.parentId:currentNode.id,
            //     start: currentNode.id==payload.parentId?currentPage:1,
            //     limit: limit,
            //     nodeType: 'ORG',
            //   },
            // })
            yield put({
              type: 'getOrgTreeList',
              payload:{
                parentId:payload.parentId?payload.parentId:currentNode.id,
                start:currentPage,
                limit:limit,
                orgKind: 'ORG',
                searchWord:''
              },
            })
          // }
          
          // yield put({
          //   type: 'tree/getOrgChildren',
          //   payload:{
          //     // nodeId: payload.parentId?(orgs.length==0?(currentNode.parentId==0?'':currentNode.parentId):currentNode.nodeId):'',
          //     nodeId: '',
          //     nodeType: 'ORG',
          //     start:1,
          //     limit:2000
          //   },
          //   pathname: '/unitInfoManagement',
          //   isParent: true,
          // })
          yield put({
            type: 'tree/getOrgTree',
            payload:{
              parentId:payload.parentId=='0'?'':payload.parentId,
              orgKind:'ORG',
              searchWord:'',
              isEnable:'1'
            },
            pathname: '/unitInfoManagement',
            isParent: true,
          })
          currentNode.key=payload.parentId?payload.parentId:currentNode.key
          currentNode.id=payload.parentId?payload.parentId:currentNode.id
          currentNode.orgName=payload.parentName?payload.parentName:currentNode.orgName
          
          yield put({
            type: 'updateStates',
            payload:{
              modalVisible: false,
              orgs:[],
              currentNode
            }
          })
          
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
      yield put({
        type: 'updateStates',
        payload:{
          loading: false
        }
      })
    },
    *getSearchTree({ payload,callback,pathname,moudleName }, { call, put, select }) {
      try {
          const {data} = yield call(getSearchTree, payload);
          const { exportUsers,orgs } = yield select(state => state.unitInfoManagement);
          if(data.code==REQUEST_SUCCESS){
            yield put({
              type: 'updateStates',
              payload:{
                orgs: data.data.list,
                returnCount: data.data.returnCount,
              }
            })
            console.log(data.data, '327')
            }else if (data.code != 401 && data.code != 419 && data.code !=403) {
              message.error(data.msg,5)
            }
      } catch (e) {
          console.log(e);
      } finally {

      }
    },
    *deleteOrg({ payload,parentId }, { call, put, select }) {
      yield put({
        type: 'updateStates',
        payload:{
          loading: true
        }
      })
      try {
        const {data} = yield call(deleteOrg, payload);
        const {currentNodeId} = yield select(state=>state.tree)
        const {currentPage,currentNode,limit,orgs,org} = yield select(state=>state.unitInfoManagement)
        console.log(parentId,'parentId');
        if(data.code==REQUEST_SUCCESS){
          if(parentId!=0){
            // yield put({
            //   type: 'getOrgChildren',
            //   payload:{
            //     nodeId: currentNode.key || payload.orgIds,
            //     start: currentPage,
            //     nodeType: 'ORG',
            //     limit: limit,
            //   },
            //   isDelete: true,

            // })
            if(orgs.length==payload.orgIds.split(',').length&&currentPage!==1){
              yield put({
                type: 'getOrgTreeList',
                payload:{
                  parentId:currentNode.key,
                  start:currentPage-1,
                  limit:limit,
                  orgKind: 'ORG',
                  searchWord:''
                },
                isDelete: true,
              })
            }else{
              yield put({
                type: 'getOrgTreeList',
                payload:{
                  parentId:currentNode.key,
                  start:currentPage,
                  limit:limit,
                  orgKind: 'ORG',
                  searchWord:''
                },
                isDelete: true,
              })
            }
            
            // yield put({
            //   type: 'tree/getOrgChildren',
            //   payload:{
            //     // nodeId: orgs.length==1?(currentNode.parentId==0?'':currentNode.parentId):currentNode.nodeId,
            //     // nodeId:currentNode.parentId,
            //     nodeType: 'ORG',
            //     start:1,
            //     limit:200,
            //     onlySubDept:(maxDataruleCode=='A0004'||maxDataruleCode=='A0002')?0:1
            //   },
            //   pathname: '/unitInfoManagement',
            //   isParent: true,
            // })
            yield put({
              type: 'tree/getOrgTree',
              payload:{
                parentId:currentNode.key,
                orgKind:'ORG',
                searchWord:'',
                isEnable:'1'
              },
              pathname: '/unitInfoManagement',
              isParent: true,
            })
            yield put({
              type: 'updateStates',
              payload:{
                modalVisible: false,
                orgs:[]
              }
            })
          }else{//删除左侧树节点 树列表更新数据
            // yield put({
            //   type: 'tree/getOrgChildren',
            //   payload:{
            //     nodeId: '',
            //     nodeType: 'ORG',
            //     start:1,
            //     limit:200,
            //     onlySubDept:(maxDataruleCode=='A0004'||maxDataruleCode=='A0002')?0:1
            //   },
            //   pathname: '/unitInfoManagement',
            // })
            yield put({
              type: 'tree/getOrgTree',
              payload:{
                parentId:'',
                orgKind:'ORG',
                searchWord:'',
                isEnable:'1'
              },
              pathname: '/unitInfoManagement',
            })
          }
          
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
      yield put({
        type: 'updateStates',
        payload:{
          loading: false
        }
      })
    },

    // 文件上传接口
    *uploaderFile({ payload, callback }, { call, put, select }) {
        yield fetch(`${env}/public/fileStorage/uploaderFile`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + window.localStorage.userToken,
            },
            body: payload.importFormData,
        }).then(res => {
            res.json().then((data) => {
                if (data.code == 200) {
                    callback && callback(data.data);
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            }).catch((err) => {
              // 将 err 转换为字符串类型
              const errorMessage = err instanceof Error ? err.message : String(err);
              message.error(errorMessage);
            })
        })
    },

    //部门信息导入
    *importOrg({ payload, callback }, { call, put, select }) {
        const { data } = yield call(importOrg, payload);
        if (data.code == REQUEST_SUCCESS) {
            callback&&callback(data.data.importId)
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
            message.error(data.msg);
        }
    },

    //部门信息导入结果查看
    *importOrgResult({ payload, callback }, { call, put, select }) {
        const { data } = yield call(importOrgResult, payload);
        if (data.code == REQUEST_SUCCESS) {
            callback&&callback(true,data)
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
            callback&&callback(false,data)
        }
    },
     //获取上传的文件路径
     *getDownFileUrl({ payload, callback }, { call, put, select }) {
        try {
            const { data } = yield call(getDownFileUrl, payload);
            if (data.code == REQUEST_SUCCESS) {
                callback && callback(data.data.fileUrl)
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
    *orgExport({ payload, callback }, { call, put, select }) {
      const { data } = yield call(orgExport, payload);
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
        message.success('操作成功');
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
    //获取密码管理
    *getPasswordPolicy({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getPasswordPolicy, payload);
      if (data.code == REQUEST_SUCCESS) {
          yield put({
              type: "updateStates",
              payload: {
                  echoFormData: data.data
              }
          })
          callback && callback(data.data)
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
      }
    },
    *getInitTreeList({payload,callback},{call,put,select}){
      const {data}=yield call(getOrgTree,payload)
      if (data.code == REQUEST_SUCCESS) {
        const newData=data.data.list.map(({children,...item})=>item)
        const result=newData&&newData.filter(item=>item.isTopLevel==1)
          yield put({
              type: "updateStates",
              payload: {
                  initTreeList: result,
                  oldInitTreeList:result,
              }
          })
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
      }
    },
    *isOrgCenterShareOrg({payload,callback},{call,put,select}){
      const {data}=yield call(isOrgCenterShareOrg,payload)
      if (data.code == REQUEST_SUCCESS) {
          callback&&callback(data.data)
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
      }
    }
  },
  reducers: {
    updateStates(state, action){
      console.log(state);
      return {
        ...state,
        ...action.payload
      }
    }
  },
};
