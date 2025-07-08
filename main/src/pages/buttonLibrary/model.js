import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';
import { dataFormat } from '../../util/util';
import { v4 as uuidv4 } from 'uuid';
import SparkMD5 from 'spark-md5';
import { parse } from 'query-string';
import { history } from 'umi'
const { getButtons, addButtons, updateButtons, deleteButtons,exportButtons } = apis;
export default {
  namespace: 'buttonLibrary', //按钮库
  state: {
    loading: false,
    addModal: false,
    addObj: {},
    buttonsList: [],
    parentIds: [],
    searchValue: '',
    fileChunkedList: [], // 文件上传用，文件列表
    currentPage: 1,
    limit: 0,
    returnCount: 0,
    index: 0,
    md5: '', // 文件上传用，md5格式
    fileName: '', // 文件名
    fileSize: 0, // 文件大小
    fileExists: true,
    filePath: '',
    md5FileId: '',
    md5FilePath: '',
    needfilepath: '',
    fileStorageId: '', //存储信息到数据库返回id
    getFileMD5Message: {}, //md5返回的文件信息
    uploadFlag: true, //上传暂停器
    isStop: true, //暂停按钮的禁用
    isContinue: false, //继续按钮的禁用
    isCancel: false, //取消按钮的禁用
    quoteButtons:[],//引用按钮数据（全部）
    funList: [],
    funCurrentPage:1,
    funReturnCount:0,
    funLimit:10,
    isShowButtonModal: false,
    isView:false,
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      // history.listen(location => {
      //   if (history.location.pathname === '/buttonLibrary') {
      //     const query = parse(history.location.search);
      //     if (query.isInit == '1') {
      //       dispatch({
      //         type: 'updateStates',
      //         payload: {
      //           loading: false,
      //           addModal: false,
      //           addObj: {},
      //           buttonsList: [],
      //           parentIds: [],
      //         },
      //       });
      //     }
      //     // dispatch({
      //     //   type: 'getButtons',
      //     //   payload: {
      //     //     searchValue: '',
      //     //     buttonType: '',
      //     //     limit:10,
      //     //     start:1,
      //     //     buttonSourceName:'CUSTOM'
      //     //   },
      //     // });
      //   }
      // });
    },
  },
  effects: {
    *getFuncLibList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getFuncLibList, payload);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              funList: data.data.list,
              funCurrentPage:data.data.currentPage,
              funReturnCount:data.data.returnCount
            },
          });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getFuncLibById({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getFuncLibById, payload);
        if (data.code == REQUEST_SUCCESS) {
          callback && callback(data?.data?.funcName,data?.data);
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getButtons({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getButtons, payload);
        console.log('data----查询', data);
        const getFilterCustom = list => {
          return list.filter(i => i.buttonSourceName === 'CUSTOM');
        };
        if (data.code == REQUEST_SUCCESS) {
          if(!payload.start){
            yield put({
              type: 'updateStates',
              payload: {
                quoteButtons:data.data.list
              },
            });
          }else{
            yield put({
              type: 'updateStates',
              payload: {
                buttonsList: getFilterCustom(data.data.list),
                returnCount: data.data.returnCount,
                searchValue: payload.searchValue,
                // currentPage: data.data.currentPage,
              },
            });
          }
          
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *addButtons({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(addButtons, payload);
        const { searchValue,limit,currentPage } = yield select(state => state.buttonLibrary);
        console.log('data----新增', data);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getButtons',
            payload: {
              searchValue,
              buttonType: '',
              start:currentPage,
              limit,
              buttonSourceName:'CUSTOM'
            },
          });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *updateButtons({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(updateButtons, payload);
        const { searchValue,limit,currentPage } = yield select(state => state.buttonLibrary);
        console.log('data----修改', data, searchValue);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getButtons',
            payload: {
              searchValue,
              buttonType: '',
              start:currentPage,
              limit,
              buttonSourceName:'CUSTOM'
            },
          });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //导出
    *exportButtons({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(exportButtons, payload)
        if (data.code == 200) {
          window.location.href = data.data
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      }catch (e) {
        console.log(e);
      } finally { }
    },
    *deleteButtons({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(deleteButtons, payload);
        const { searchValue,limit,currentPage } = yield select(state => state.buttonLibrary);
        console.log('data----删除', data);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getButtons',
            payload: {
              searchValue,
              buttonType: '',
              start:currentPage,
              limit,
              buttonSourceName:'CUSTOM'
            },
          });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // js文件上传到minio
    *getScriptFileToMinio({ payload, callback }, { call, put, select }) {
      const { fileString, buttonId, thenEventRelative } = payload
      console.log(fileString,'fileString');
      try {
        const blob = new Blob([fileString], { type: 'text/javascript' });
        const file = new File([blob], uuidv4(), {
          type: 'text/javascript',
        });
        console.log(file,'file==');
        const fileMD5 = SparkMD5.hashBinary(fileString);

        yield put.resolve({
          type: 'updateStates',
          payload: {
            fileChunkedList: [file],
            md5: fileMD5,
            fileName: `${file.name}.js`,
            fileSize: file.size,
          },
        });
        // 上传mio;
        yield put.resolve({
          type: 'uploadfile/getFileMD5',
          payload: {
            namespace: 'buttonLibrary',
            isUpdate: 1, 
            isPresigned: 1,
            fileEncryption: fileMD5,
            filePath:buttonId&&thenEventRelative ? thenEventRelative :
            `buttonLibrary/${dataFormat(
              String(new Date().getTime()).slice(0, 10),
              'YYYY-MM-DD',
            )}/${file.name}.js`,
          },
          uploadSuccess: callback,
        });
      } catch (e) {
        console.error(e);
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
