import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';
import { LH_STATE } from '../../util/constant';

export default {
  namespace: 'budgetTarget',
  state: {
    fileType: 'BUDGETPROJECT',
    currentYear: String(new Date().getFullYear()),
    returnCount: 0,
    allPage: 1,
    currentPage: 1,
    start: 1,
    limit: 0,
    currentHeight: 0,
    sizeFlag: false,
    searchWord: '',
    normCode: '',
    isShowDetailModal: false,
    isShowCarryModal: false,
    normList: [],
    detailList: [],
    treeData: [],
    expandedKeys: [], //展开keys
    isShowReleveModal: false,
    originalData: [],
    orgUserType: '',
    formType: '',
    selectedNodeId: '',
    selectedDataIds: [],
    selectedDatas: [],
    cutomHeaders: {},
    params: {
      bizSolId: '',
      isTree: '',
      usedYear: '',
      start: '',
      limit: '',
      parentId: '',
      budgetOrgId_: '',
      normCode: '',
      usedDept_: '',
      projectTypeCode: '',
      projectCode: '',
      funcSubjectCode: '',
      economicSubjectCode: '',
      moneySourceTldt_: '',
      crBudget: '',
      calculateType: '',
    },
    isShowImportModal: false,
    importData: {},
    importType: '',
    /////////////////////////////////////////////////////////////////////
    uploadFlag: true, //上传暂停器
    nowMessage: '', //提示上传进度的信息
    md5: '', //文件的md5值，用来和minio文件进行比较
    fileChunkedList: [], //文件分片完成之后的数组
    fileName: '', //文件名字
    fileNames: '', //文件前半部分名字
    fileStorageId: '', //存储文件信息到数据库接口返回的id
    typeNames: '', //文件后缀名
    optionFile: {}, //文件信息
    fileSize: '', //文件大小，单位是字节
    getFileMD5Message: {}, //md5返回的文件信息
    success: '', //判断上传路径是否存在
    v: 1, //计数器
    needfilepath: '', //需要的minio路径
    isStop: true, //暂停按钮的禁用
    isContinue: false, //继续按钮的禁用
    isCancel: false, //取消按钮的禁用
    index: 0, //fileChunkedList的下标，可用于计算上传进度
    merageFilepath: '', //合并后的文件路径
    typeName: '', //层级
    fileExists: '', //判断文件是否存在于minio服务器中，相关modal中监听判断fileExists状态进行后续分别操作
    md5FileId: '', //md5查询到的文件返回的id
    md5FilePath: '', //md5查询到的文件返回的pathname
    importLoading: false,
    allColumns: [],
    columns: [],
  },
  subscriptions: {},
  effects: {
    *importExcel({ payload, callback }, { call, put, select }) {
      const { cutomHeaders } = yield select((state) => state.budgetTarget);
      if (cutomHeaders) {
        payload.headers = cutomHeaders; //需要在headers中添加参数
      }
      const { data } = yield call(
        apis.importExcel,
        payload,
        '',
        'budgetTarget',
      );
      if (data.code == 200) {
        callback && callback(data?.data?.importId);
      } else if (data.code != 401) {
        message.error(data.msg);
      }
    },

    *refreshImportExcel({ payload, callback }, { call, put, select }) {
      const { cutomHeaders } = yield select((state) => state.budgetTarget);
      if (cutomHeaders) {
        payload.headers = cutomHeaders; //需要在headers中添加参数
      }
      const { data } = yield call(
        apis.refreshImportExcel,
        payload,
        '',
        'budgetTarget',
      );
      if (data.code == 200) {
        callback && callback(true, data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        callback && callback(false, data);
      }
    },
    *exportFile({ payload, callback }, { call, put, select }) {
      const { cutomHeaders } = yield select((state) => state.budgetTarget);
      payload.headers = cutomHeaders; //需要在headers中添加参数
      const { data } = yield call(apis.exportFile, payload, '', 'budgetTarget');
      if (data.code == REQUEST_SUCCESS) {
        callback && callback();
      } else {
        message.error(data.msg);
      }
    },
    *checkNorm({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.checkNorm,
          payload,
          '',
          'budgetTarget',
        );
        if (data.code == REQUEST_SUCCESS) {
          callback && callback(data.data);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    *powerNorm({ payload, callback }, { call, put, select }) {
      const { cutomHeaders } = yield select((state) => state.budgetTarget);
      payload.headers = cutomHeaders; //需要在headers中添加参数
      try {
        const { data } = yield call(
          apis.powerNorm,
          payload,
          '',
          'budgetTarget',
        );
        // TODO  ==
        if (data.code == REQUEST_SUCCESS) {
          callback && callback();
        } else {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },

    //删除(无流程)
    *delFormData({ payload, callback }, { call, put, select }) {
      const { cutomHeaders } = yield select((state) => state.budgetTarget);
      payload.headers = cutomHeaders; //需要在headers中添加参数
      const { data } = yield call(
        apis.delFormData,
        payload,
        '',
        'budgetTarget',
      );
      if (data.code == REQUEST_SUCCESS) {
        callback && callback(data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getNormList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getNormList,
          payload,
          '',
          'budgetTarget',
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              normList: data.data.list,
              returnCount: data.data.returnCount,
              allPage: data.data.allPage,
              currentPage: data.data.currentPage,
            },
          });
        } else {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    *getDetailList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getNormHistory,
          payload,
          'getDetailList',
          'budgetTarget',
        );
        // TODO  ==
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              detailList: data.data.list,
            },
          });
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    *annualCarryForward({ payload, callback }, { call, put, select }) {
      const { cutomHeaders } = yield select((state) => state.budgetTarget);
      payload.headers = cutomHeaders; //需要在headers中添加参数
      try {
        const { data } = yield call(
          apis.annualCarryForward,
          payload,
          '',
          'budgetTarget',
        );
        if (data.code == REQUEST_SUCCESS) {
          message.success('结转成功');
          callback && callback();
        } else {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    *getProjectBizSolId({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getProjectBizSolId,
          payload,
          '',
          'budgetTarget',
        );
        if (data.code == REQUEST_SUCCESS) {
          callback && callback(data.data);
        } else {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },

    *getBudgetProjectTree({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getBudgetProjectTree,
          payload,
          '',
          'budgetTarget',
        );
        const { expandedKeys, treeData } = yield select(
          (state) => state.budgetTarget,
        );
        const loop = (array, children) => {
          for (var i = 0; i < array.length; i++) {
            array[i]['title'] = `[${array[i]['OBJ_CODE']}]${
              array[i]['OBJ_NAME']
            }（${LH_STATE[array[i]['FINISH_TURN_TLDT_']]}）`;
            array[i]['key'] = array[i]['OBJ_CODE'];
            array[i]['value'] = array[i]['OBJ_CODE'];
            if (array[i]['FINISH_TURN_TLDT_'] == 1) {
              array[i]['disabled'] = true;
            }
            // TODO
            if (payload.parentCode == array[i]['OBJ_CODE']) {
              // if (i == 0) {
              //赋值一个父节点的name和一个父节点的类型
              children.map((itemChild) => {
                // itemChild['parentName'] = `${array[i]['nodeName']}`
                // itemChild['parentType'] = array[i]['nodeType']
                itemChild['title'] = `[${itemChild['OBJ_CODE']}]${
                  itemChild['OBJ_NAME']
                }（${LH_STATE[itemChild['FINISH_TURN_TLDT_']]}）`;
                itemChild['key'] = itemChild['OBJ_CODE'];
                itemChild['value'] = itemChild['OBJ_CODE'];
                if (itemChild['FINISH_TURN_TLDT_'] == 1) {
                  itemChild['disabled'] = true;
                }
              });
              array[i]['children'] = children;
            }
            if (array[i].children && array[i].children.length != 0) {
              loop(array[i].children, children);
            } else {
              // TODO
              if (array[i].isParent == 1) {
                array[i]['children'] = [
                  {
                    key: '-1',
                  },
                ];
              } else {
                array[i]['isLeaf'] = true;
              }
            }
          }
          return array;
        };
        // TODO
        if (data.code == REQUEST_SUCCESS) {
          let sourceTree = treeData;
          if (data.data.list.length !== 0) {
            if ((sourceTree && sourceTree.length == 0) || !payload.parentCode) {
              sourceTree = data.data.list;
            }
            sourceTree = loop(sourceTree, data.data.list);
            yield put({
              type: 'updateStates',
              payload: {
                treeData: sourceTree,
                // expandedKeys: keys
              },
            });
          } else {
            // sourceTree = loop(sourceTree, data.data.list);
            // yield put({
            //   type: 'updateStates',
            //   payload:{
            //     treeData: sourceTree,
            //   }
            // })
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
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
