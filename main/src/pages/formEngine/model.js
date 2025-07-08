import { message } from 'antd';
import apis from 'api';
import { version } from 'react';
import { REQUEST_SUCCESS } from '../../service/constant';
import { env } from '../../../../project_config/env';
import uploader from '../../service/uploaderRequest';
import { parse } from 'query-string';
import _ from 'lodash';
import { history } from 'umi'
const { getForms, getFormVersions, deleteForm, setMainVersion } = apis;
export default {
  namespace: 'formEngine',
  state: {
    fileUrl: '',
    selectTreeUrl: [], //面包屑路径
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
    ///////////
    currentPage: 0,
    returnCount: 0,
    forms: [], //表单列表
    formVersions: [], //表单版本列表
    fvCurrentPage: 1,
    fvReturnCount: 0,
    formId: '', //当前表单id
    searchWord: '', //搜索词
    fromIds: [],
    modalVisible: false,
    currentNode: {},
    treeData: [],
    limit: 10,
    treeSearchWord: '',
    expandedKeys: [],
    autoExpandParent: true,
    mainVersion: '', //当前表单主版本号
    formJSON: [],
    selectedFroms: [], //已选择表单
    ftCurrentPage: 1,
    ftReturnCount: 0,
    formTableList: [], //表单关联数据源
    ftVisible: false,
    fbVisible: false,
    deployFormId: '', //当前发布表单id
    businessFormList: [], //绑定的业务应用
    importModal: false, //导入弹窗
    importForm: {}, //导入的表单信息
    importFileName: '', //导入的文件名
    isSubmiting: false,
    ftLimit: 10,
    fvLimit: 10,
    initialTreeData: [],
    ctlgId: '',


    selectedNodeId:'',
    selectedDataIds:[],
    // treeData:[],
    // currentNode:[],
    // expandedKeys:[],
    // treeSearchWord:'',
    selectedDatas:[],
    originalData:[],
    selectNodeType:[],
    leftNum:246,
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      // history.listen(location => {
      //   if (history.location.pathname == '/formEngine') {
      //     const query = parse(history.location.search);
      //     const {
      //       currentNodeId,
      //       currentPage,
      //       searchWord,
      //       isInit,
      //       limit,
      //     } = query;
      //     if (isInit == '1') {
      //       dispatch({
      //         type: 'updateStates',
      //         payload: {
      //           returnCount: 0,
      //           forms: [], //表单列表
      //           formVersions: [], //表单版本列表
      //           fvCurrentPage: 1,
      //           fvReturnCount: 0,
      //           formId: '', //当前表单id
      //           fromIds: [],
      //           modalVisible: false,
      //         },
      //       });
      //     }
      //     if (currentNodeId && currentNodeId != 'undefined') {
      //       dispatch({
      //         type: 'getForms',
      //         payload: {
      //           start: currentPage,
      //           limit: limit ? limit : 10,
      //           searchWord,
      //           ctlgId: currentNodeId,
      //         },
      //       });
      //     }
      //   }
      // });
    },
  },
  effects: {
    *getCtlgTree({ payload, callback }, { call, put, select }) {
      try {
        const loop = array => {
          for (var i = 0; i < array.length; i++) {
            array[i]['title'] = array[i]['nodeName'];
            array[i]['key'] = array[i]['nodeId'];
            array[i]['value'] = array[i]['nodeId'];
            if (array[i].children && array[i].children.length != 0) {
              loop(array[i].children);
            }
          }
          return array;
        };

        const { data } = yield call(apis.getCtlgTree, payload);
        if (data.code == REQUEST_SUCCESS) {
          //默认为第一个
          if (data.data.list.length) {
            let sourceTree = loop(data.data.list);
            yield put({
              type: 'updateStates',
              payload: {
                treeData: data.data.list,
                initialTreeData: data.data.list,
                treeDataByAdd: sourceTree,
                currentNode: {
                  key: data.data.list?.[0].nodeId,
                  title: data.data.list?.[0].nodeName,
                  nodeName: data.data.list?.[0].nodeName,
                },
                ctlgId: data.data.list?.[0].nodeId,
              },
            });
            yield put({
              type: 'getForms',
              payload: {
                ctlgId: data.data.list?.[0].nodeId,
                start: 1,
                limit: 10,
                searchWord: '',
              },
            });
          }
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log('e',e);
      } finally {
      }
    },
    *getForms({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(getForms, payload);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              forms: data.data.list,
              returnCount: data.data.returnCount,
              currentPage: data.data.currentPage,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getFormVersions({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(getFormVersions, payload);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              formVersions: data.data.list,
              fvReturnCount: data.data.returnCount,
              fvCurrentPage: data.data.currentPage,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *deleteForm({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(deleteForm, payload);
        const { fvCurrentPage, formId } = yield select(
          state => state.formEngine,
        );
        const { currentNode, currentPage, searchWord, limit } = yield select(
          state => state.formEngine,
        );

        if (data.code == REQUEST_SUCCESS) {
          if (payload.version) {
            yield put({
              type: 'getFormVersions',
              payload: {
                start: fvCurrentPage,
                limit: limit,
                formId,
              },
            });
          } else {
            yield put({
              type: 'getForms',
              payload: {
                start: currentPage,
                limit: limit,
                searchWord,
                ctlgId: currentNode.key,
              },
            });
          }
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *setMainVersion({ payload, version }, { call, put, select }) {
      try {
        const { data } = yield call(setMainVersion, payload);
        const {
          fvCurrentPage,
          currentPage,
          formId,
          currentNode,
          limit,
          searchWord,
          selectedFroms,
        } = yield select(state => state.formEngine);

        const newSelectedFroms = selectedFroms.map(item => {
          return { ...item, mainVersion: payload.version };
        });

        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              mainVersion: payload.version,
              selectedFroms: newSelectedFroms,
            },
          });
          yield put({
            type: 'getForms',
            payload: {
              start: currentPage,
              limit: limit,
              searchWord,
              ctlgId: currentNode.key,
            },
          });
          yield put({
            type: 'getFormVersions',
            payload: {
              start: fvCurrentPage,
              limit: limit,
              formId,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log('33', e);
      } finally {
      }
    },
    *uploadFile({ payload, callback }, { call, put, select }) {
      // console.log(payload);
      // const {data} = yield call(apis.uploaderFile,payload);
      // if(data.code==200){
      //   callback&&callback(data.data)
      // }else if (data.code != 401 && data.code != 419 && data.code !=403) {
      //   message.error(data.msg);
      // }

      try {
        let action = 'POST public/fileStorage/uploaderFile';
        uploader(action, payload).then(data => {
          if (data.data.code == 200) {
            callback && callback(data.data.data);
          } else {
            message.error(data.data.msg, 5);
          }
        });
      } catch (e) {
        console.log('e', e);
      } finally {
      }
    },
    *presignedUploadUrl({ payload, callback }, { call, put, select }) {
      //预上传
      const { data } = yield call(apis.presignedUploadUrl, payload);
      if (data.code == 200) {
        callback && callback(data.data.presignedUploadUrl);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *importForm({ payload, callback }, { call, put, select }) {
      const { currentNode, currentPage, searchWord, limit } = yield select(
        state => state.formEngine,
      );
      const { data } = yield call(apis.importForm, payload);
      if (data.code == 200) {
        yield put({
          type: 'getForms',
          payload: {
            start: currentPage,
            limit: limit,
            searchWord,
            ctlgId: currentNode.key,
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *exportForm({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.exportForm, payload);
      if (data.code == 200) {
        callback && callback(data.data.path);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getFormTableList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getFormTableList, payload);
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            formTableList: data.data.list,
            ftCurrentPage: data.data.currentPage,
            ftReturnCount: data.data.returnCount,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    *getBussinessFormList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getBussinessFormList, payload);
      if (data.code == 200) {
        yield put({
          type: 'updateStates',
          payload: {
            businessFormList: data?.data?.list,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },



    //获取下载地址url
    *getDownFileUrl({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getDownFileUrl, payload);
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            fileUrl: data.data.fileUrl,
          },
        });
        callback && callback(data.data.fileUrl);
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
        ...action.payload,
      };
    },
  },
};
