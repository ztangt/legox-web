import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../../service/constant';
import { dataFormat } from '../../../util/util';
import { v4 as uuidv4 } from 'uuid';
import { fetchResource } from '../../../util/performScript';
import SparkMD5 from 'spark-md5';
import _ from 'lodash';
import { parse } from 'query-string';

const {
  getFromColumnsAll,
  createPrintTemplate,
  getPrintTemplate,
  previewPrintTemplate,
  getDeployFormId,
  datasetAndResult,
  getBeanResult,
  createDataset,
  getEventList,
  getEventDetail,
  deleteEvent,
} = apis;

export default {
  namespace: 'templateEditor',
  state: {
    formId: '', // 列表选中的表单ID
    version: '',
    deployFormId: '', // 自由表单打印ID
    tableList: [], // 左侧打印模板列表
    fromSelectCode: {}, // 左侧选择的内容
    templatePath: '', // 编辑器内容，用于保存
    paperSize: 'A4', // 纸张大小
    paperLayout: 'landscape', // 纸张方向
    isChromatography: 1, // 是否套打
    paperWidth: 21, // 纸张宽度
    paperHeight: 29.7, // 纸张高度
    topMargin: 2.54, // 上
    bottomMargin: 2.54, // 下边距
    leftMargin: 3.18, // 左边距
    rightMargin: 3.18, // 右边距
    fromJsonMap: {}, // 表单映射
    selectSectionTableKey: '', // 当前选中的单元格
    templateFullPath: '', // 获取表单资源路径
    previewURL: '', // 表单预览内容
    moneyFormat: '#0.00',
    dateFormat: 'yyyy-MM-dd',
    signDetails: 'ALL', // 打印明细
    isChangeTree: false,
    beanTableList: [], //bean数据
    start: 1,
    limit: 10,
    searchWord: '',
    evenList: [],
    returnCount: 0,
    allPage: 0,
    currentPage: 0,
    selectEventKeys: '',
    selectEventRows: [],
    eventObj: {},
    eventParams: [],
    eventResults: [],
    BeanModalVisible: false,
    selectedResRowKeys: [],
    selectedParamsRowKeys: [],
    //////////////////////////////////////////////////文件上传用
    fileChunkedList: [], // 文件上传用，文件列表
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
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      // history.listen(location => {
      //   if (history.location.pathname === '/formEngine/templateEditor') {
      //     const query = parse(history.location.search);
      //     const { formId, version } = query;
      //     dispatch({
      //       type: 'updateStates',
      //       payload: {
      //         formId,
      //         version,
      //       },
      //     });

      //     // 获取bean数据集
      //     dispatch({
      //       type: 'datasetAndResult',
      //       payload: {
      //         formId,
      //         version,
      //       },
      //     });

      //     // 获取表单字段
      //     dispatch({
      //       type: 'getFromColumnsAll',
      //       payload: {
      //         formId,
      //         version,
      //       },
      //       callback: id => {
      //         // 获取表单资源路径
      //         dispatch({
      //           type: 'getPrintTemplate',
      //           payload: { id },
      //         });
      //       },
      //     });
      //   }
      // });
    },
  },
  effects: {
    *getFromColumnsAll({ payload, callback }, { call, put, select }) {
      try {
        const deployFormId = yield call(getDeployFormId, payload);
        const { data } = yield call(getFromColumnsAll, deployFormId.data.data);
        if (data.code == REQUEST_SUCCESS) {
          callback && callback(deployFormId.data.data.deployFormId);
          yield put({
            type: 'updateStates',
            payload: {
              tableList: data.data.tableList,
              deployFormId: deployFormId.data.data.deployFormId,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // 获取表单打印模板
    *getPrintTemplate({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getPrintTemplate, payload);
        if (data.code == REQUEST_SUCCESS) {
          let fetJSONData = yield fetchResource(data.data.filedContextFullPath);
          console.log('fetJSONData', JSON.parse(fetJSONData));

          yield put({
            type: 'updateStates',
            payload: {
              templateFullPath: data.data.templateFullPath,
              fromJsonMap: JSON.parse(fetJSONData),
              paperLayout: data.data.paperLayout,
              paperSize: data.data.paperSize,
              paperWidth: data.data.paperWidth,
              paperHeight: data.data.paperHeight,
              topMargin: data.data.topMargin,
              bottomMargin: data.data.bottomMargin,
              leftMargin: data.data.leftMargin,
              rightMargin: data.data.rightMargin,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // 新增表单打印模板
    *createPrintTemplate({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(createPrintTemplate, payload);
        if (data.code == REQUEST_SUCCESS) {
          message.success('保存成功');
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // json提交minio
    *getJSONToMinio({ payload, callback }, { call, put, select }) {
      try {
        const blob = new Blob([payload], { type: 'application/json' });
        const file = new File([blob], uuidv4(), {
          type: 'application/json',
        });
        const fileMD5 = SparkMD5.hashBinary(payload);

        yield put.resolve({
          type: 'updateStates',
          payload: {
            fileChunkedList: [file],
            md5: fileMD5,
            fileName: `${file.name}.json`,
            fileSize: file.size,
          },
        });
        // 上传mio;
        yield put.resolve({
          type: 'uploadfile/getFileMD5',
          payload: {
            namespace: 'templateEditor',
            isPresigned: 1,
            fileEncryption: fileMD5,
            filePath: `templateEditor/${dataFormat(
              String(new Date().getTime()).slice(0, 10),
              'YYYY-MM-DD',
            )}/${file.name}.json`,
          },
          uploadSuccess: callback,
        });
      } catch (e) {
        console.error(e);
      }
    },
    // 模板提交minio
    *getTemplateToMinio({ payload, callback }, { call, put, select }) {
      try {
        const blob = new Blob([payload], { type: 'text/html,charset=UTF-8' });
        const file = new File([blob], uuidv4(), {
          type: 'text/html',
        });
        const fileMD5 = SparkMD5.hashBinary(payload);

        yield put.resolve({
          type: 'updateStates',
          payload: {
            fileChunkedList: [file],
            md5: fileMD5,
            fileName: `${file.name}.html`,
            fileSize: file.size,
          },
        });
        // 上传mio;
        yield put.resolve({
          type: 'uploadfile/getFileMD5',
          payload: {
            namespace: 'templateEditor',
            isPresigned: 1,
            fileEncryption: fileMD5,
            filePath: `templateEditor/${dataFormat(
              String(new Date().getTime()).slice(0, 10),
              'YYYY-MM-DD',
            )}/${file.name}.html`,
          },
          uploadSuccess: callback,
        });
      } catch (e) {
        console.error(e);
      }
    },
    // 图片minio
    *getPicToMinio({ payload, callback }, { call, put, select }) {
      const extMap = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
      };
      try {
        let fileExt = '';
        //将base64转换为blob
        const dataURLtoBlob = dataURL => {
          let arr = dataURL.split(',');
          let mime = arr[0].match(/:(.*?);/)[1];
          let bstr = atob(arr[1]);
          let n = bstr.length;
          let u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          fileExt = extMap[mime];
          return new Blob([u8arr], { type: mime });
        };

        const blob = dataURLtoBlob(payload);
        const file = new File([blob], uuidv4());

        const fileMD5 = SparkMD5.hashBinary(payload);

        yield put.resolve({
          type: 'updateStates',
          payload: {
            fileChunkedList: [file],
            md5: fileMD5,
            fileName: `${file.name}${fileExt}`,
            fileSize: file.size,
          },
        });

        // 上传mio;
        yield put.resolve({
          type: 'uploadfile/getFileMD5',
          payload: {
            namespace: 'templateEditor',
            isPresigned: 1,
            fileEncryption: fileMD5,
            filePath: `templateEditor/${dataFormat(
              String(new Date().getTime()).slice(0, 10),
              'YYYY-MM-DD',
            )}/${file.name}${fileExt}`,
          },
          uploadSuccess: (...args) => {
            callback(...args, fileExt);
          },
        });
      } catch (e) {
        console.error(e);
      }
    },
    // 打印模板预览
    *previewPrintTemplate({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(previewPrintTemplate, payload);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              previewURL: data.data.url,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // 获取bean数据
    *datasetAndResult({ payload, callback }, { call, put, select }) {
      try {
        const deployFormId = yield call(getDeployFormId, payload);
        const { data } = yield call(datasetAndResult, {
          templateId: deployFormId.data.data.deployFormId,
        });

        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              beanTableList: data.data.list,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // 获取bean信息
    *getBeanResult({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getBeanResult, payload);
        if (data.code == REQUEST_SUCCESS) {
          const newEventObj = {
            ...data.data,
            isArray: data.data.isArray === 1 ? true : false,
          };
          console.log('newEventObj', newEventObj);
          yield put({
            type: 'updateStates',
            payload: {
              eventObj: newEventObj,
              BeanModalVisible: true,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // 保存bean数据
    *createDataset({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(createDataset, payload);
        const { formId, version } = yield select(state => state.templateEditor);
        if (data.code == REQUEST_SUCCESS) {
          message.success('保存成功');

          yield put({
            type: 'datasetAndResult',
            payload: {
              formId,
              version,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // 获取事件列表
    *getEventList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getEventList, payload);
        console.log('data', data);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              evenList: data.data.list ? data.data.list : [],
              allPage: data.data.allPage,
              currentPage: data.data.currentPage,
              returnCount: data.data.returnCount,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // 获取事件详细信息
    *getEventDetail({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getEventDetail, payload);
        let newPar = [];
        let newRes = [];
        if (data.data.params.length > 0) {
          newPar = data.data.params.reduce((pre, cur) => {
            pre.push({
              ...cur,
              valueBound: 'FROMFORM',
            });
            return pre;
          }, []);
        }

        if (data.data.params.length > 0) {
          newRes = data.data.results.reduce((pre, cur) => {
            pre.push({
              ...cur,
              resultControl: 'MONEY',
            });
            return pre;
          }, []);
        }

        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              eventParams: newPar,
              eventResults: newRes,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // 删除bean数据
    *deleteDataset({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(deleteEvent, payload);
        const { formId, version } = yield select(state => state.templateEditor);
        if (data.code == REQUEST_SUCCESS) {
          message.success('删除成功');

          yield put({
            type: 'datasetAndResult',
            payload: {
              formId,
              version,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
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
