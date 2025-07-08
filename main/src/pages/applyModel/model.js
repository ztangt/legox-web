import { message } from 'antd';
import apis from 'api';
import {REQUEST_SUCCESS} from "@/service/constant";
const limit = 10;
export default {
  namespace: 'applyModel',
  state: {
    pathname: '/applyModel',
    searchWord: '',
    businessList: [],
    returnCount: 0,
    currentPage: 1,
    ctlgTree: [],
    oldCtlgTree: [],
    isShowAddModal: false,
    isShowImportModal: false,
    selectCtlgId: '',
    bizSolInfo: [],//修改的时候获取的数据
    processUseList: [],// 流程引擎复用列表

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
     limit:10,
     reuseSelectId:'',//流程复用选中id
     reuseCtlgTree:[],//流程复用tree
     reuseReturnCount: 0,
     reuseCurrentPage: 1,
     reuseLimit:10,
      selectedNodeId:'',
      selectedDataIds:[],
      treeData:[],
      currentNode:[],
      expandedKeys:[],
      treeSearchWord:'',
      selectedDatas:[],
      originalData:[],
      selectNodeType:[],
      leftNum:220,
     ///////////
  },
  subscriptions: {
    // setup({ dispatch, history }, { call, select }) {
    //   history.listen(location => {
    //     if (history.location.pathname === '/applyModel') {
    //       dispatch({
    //         type: 'updateStates',
    //         payload: {
    //           limit: limit
    //         }
    //       })
    //     }
    //   });
    // }
  },
  effects: {
    //获取业务应用类别树
    *getCtlgTree({ payload,typeName, callback }, { call, put, select }) {
      const { data } = yield call(apis.getCtlgTree, payload);
      if (data.code == 200) {
        if(typeName=='reuse'){
           //默认为第一个
          yield put({
            type: "updateStates",
            payload: {
              reuseCtlgTree: data.data.list,
              reuseSelectId:data.data.list.length ? data.data.list[0].nodeId : '',
            }
          })
        }else{
           //默认为第一个
          yield put({
            type: "updateStates",
            payload: {
              ctlgTree: data.data.list,
              oldCtlgTree: _.cloneDeep(data.data.list),
              selectCtlgId: data.data.list.length ? data.data.list[0].nodeId : '',
            }
          })
        }

        callback && callback(data.data.list)
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //通过类别获取业务应用
    *getBusinessList({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getBusinessList, payload);
      if (data.code == 200) {
        yield put({
          type: "updateStates",
          payload: {
            ...data.data,
            businessList: data.data.list
          }
        })
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 流程复用列表
    *getProcessReuseList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.modelReuseList, payload)
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            reuseCurrentPage:data.data.currentPage,
            reuseReturnCount:data.data.returnCount,
            processUseList: data.data.list
          }
        })
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //修改
    *addBizSol({ payload }, { call, put, select }) {
      const { data } = yield call(apis.addBizSol, payload);
      if (data.code == 200) {
        const { searchWord, businessList, currentPage, selectCtlgId } = yield select(state => state.applyModel);
        if (selectCtlgId == payload.ctlgId) {
          //获取列表
          yield put({
            type: "getBusinessList",
            payload: {
              ctlgId: payload.ctlgId,
              start: 1,
              limit: limit,
              searchWord: '',
            }
          })
        } else {
          yield put({
            type: "updateStates",
            payload: {
              selectCtlgId: payload.ctlgId
            }
          })
        }
        yield put({
          type: "updateStates",
          payload: {
            isShowAddModal: false,
            bizSolInfo: [],
            searchWord: '',
          }
        })
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //修改
    *updateBizSol({ payload }, { call, put, select }) {
      const { data } = yield call(apis.updateBizSol, payload);
      if (data.code == 200) {
        //重新获取
        const { searchWord, businessList, currentPage, selectCtlgId } = yield select(state => state.applyModel);
        if (selectCtlgId == payload.ctlgId) {
          if (businessList.length == 1 && payload.bizSolName.indexOf(searchWord) == -1 && currentPage != 1) {
            //获取列表
            yield put({
              type: "getBusinessList",
              payload: {
                ctlgId: payload.ctlgId,
                start: currentPage - 1,
                limit: limit,
                searchWord: searchWord,
              }
            })
          } else {
            yield put({
              type: "getBusinessList",
              payload: {
                ctlgId: payload.ctlgId,
                start: currentPage,
                limit: limit,
                searchWord: searchWord
              }
            })
          }
        } else {
          yield put({
            type: "updateStates",
            payload: {
              selectCtlgId: payload.ctlgId
            }
          })
        }
        yield put({
          type: "updateStates",
          payload: {
            isShowAddModal: false,
            bizSolInfo: []
          }
        })
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //删除
    *delDizSol({ payload }, { call, put, select }) {
      const { data } = yield call(apis.delDizSol, payload);
      if (data.code == 200) {
        //重新获取
        const { searchWord, businessList, currentPage, selectCtlgId } = yield select(state => state.applyModel);
        if (businessList.length == 1 && currentPage != 1) {
          //获取列表
          yield put({
            type: "getBusinessList",
            payload: {
              ctlgId: selectCtlgId,
              start: currentPage - 1,
              limit: limit,
              searchWord: searchWord,
            }
          })
        } else {
          yield put({
            type: "getBusinessList",
            payload: {
              ctlgId: selectCtlgId,
              start: currentPage,
              limit: limit,
              searchWord: searchWord,
            }
          })
        }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //根据业务应用类别ID查询业务表单
    *getBusinessFrom({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getBusinessFrom, payload);
      if (data.code == 200) {
        let listData = [];//列表数据
        let fromData = [];//表单数据
        data.data.list.map((item) => {//TODO
          if (item.bizFormType == '1' || item.bizFormType == '2') {
            listData.push(item)
          } else {
            fromData.push(item)
          }
        })
        yield put({
          type: "updateStates",
          payload: {
            listData: listData,
            fromData: fromData
          }
        })
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取表单按钮
    *getButtons({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getButtons, payload);
      if (data.code == 200) {
        //添加序号
        data.data.list.map((item, index) => {
          item.index = index + 1;
        })
        yield put({
          type: "updateStates",
          payload: {
            buttonList: data.data.list
          }
        })
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取表单配置
    *getBizSolFormConfig({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getBizSolFormConfig, payload);
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            bizFromInfo: data.data
          }
        })
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取权限绑定
    *getAuthority({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getAuthority, payload);
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            authList: data.data.authList
          }
        })
        if (typeof callback == 'function') {
          callback();
        }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //
    *updateAuth({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.updateAuth, payload);
      if (data.code == 200) {
        message.success('保存成功');
        yield put({
          type: 'updateStates',
          payload: {
            isShowAuthModal: false
          }
        })
        if (typeof callback == 'function') {
          callback();
        }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *deleteBatchBiz({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.deleteBatchBiz, payload);
      if (data.code == 200) {
        message.success('删除成功');
        if (typeof callback == 'function') {
          callback();
        }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *reuseExport({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.reuseExport, payload)
      if (data.code == 200) {
        // console.log(data,'data==');
        // message.success('上传成功')
        callback && callback()
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *bizSolExport({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.bizSolExport, payload)
      if (data.code == 200) {
        callback && callback(data.data)
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 业务方案导入
    *bizSolImport({ payload, callback, errorCallback }, { call, put, select }) {
      const { data } = yield call(apis.bizSolImport, payload)
      if(data.code == 200) {
        callback && callback(data.data);
      }
      else if (data.code != 401 && data.code != 419 && data.code != 403) {
        errorCallback && errorCallback(data.msg, data.data)
        // message.error(data.msg);
      }
    },
    // 检查业务应用导入状态
    *checkBizSolImportStatus({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.checkBizSolImportStatus, payload)
      if (data.code == 200) {
        callback && callback(data.data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getDatasourceTree({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getDatasourceList, payload);
      if (data.code == 200) {
        callback && callback(data.data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 保存归属单位
    *saveBelongOrg({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.saveBelongOrg, payload);
      if (data.code == REQUEST_SUCCESS) {
        message.success('保存成功');
        callback&&callback()
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },

    // 查询归属单位
    *queryBelongOrg({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.queryBelongOrg, payload);
      // 过滤重复数据
      const dataList = data.data.list.filter((item, index, dataList) => {
        return dataList.findIndex(t => t.orgId === item.orgId) === index;
      })
      let selectedOrgIds = [];
      dataList.map((item)=>{
        selectedOrgIds.push(item.orgId);
      })
      dataList.forEach((item) => {
        item.nodeId = item.orgId;
        item.nodeName = item.orgName;
        item.parentId = item.parentOrgId;
        item.parentName = item.parentOrgName;
      });
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            selectedDataIds: selectedOrgIds,
            selectedDatas: dataList
          }
        })
        callback&&callback()
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },

  },
  reducers: {
    updateStates(state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  },
};
