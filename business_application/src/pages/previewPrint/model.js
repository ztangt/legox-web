import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';
import _ from 'lodash';

const { getPrintUrl } = apis;

export default {
  namespace: 'templateEditorPrint',
  state: {
    deployFormId: '',
    bizInfoId: '',
    mainTableId: '',
    previewURL: '',

    bizSolId: '',
    bizInfoId: '',
    oldFileId: '',//表单原来存的FILE_ID
    isOpen: false,//是否是批量打印
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen((location) => {
        // if (location.pathname === '/previewPrint') {
        //   const { url } = location.query;

        //   dispatch({
        //     type: 'updateStates',
        //     payload: {
        //       previewURL: url,
        //     },
        //   });

        //   // dispatch({
        //   //   type: 'previewPrintTemplate',
        //   //   payload: { deployFormId, bizInfoId, mainTableId },
        //   // });
        // }
      });
    },
  },
  effects: {
    // 打印模板预览
    *previewPrintTemplate({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getPrintUrl, payload, 'previewPrintTemplate', 'getPrintUrl');
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


    //根据md5文件判断是否文件存在
    *getFileMD5({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(apis.getFileMD5, payload, 'getFileMD5', 'templateEditorPrint');
        if (data.code == REQUEST_SUCCESS) {
          callback && callback(data)
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {} finally { }
    },

    // pdf文件上传到minio
    *uploadPdfFileToMinio({ payload, callback }, { call, put, select }) {
      const { presignedUploadUrl, file } = payload;
      try {
        // 上传mio;
        yield call(fetch, presignedUploadUrl, {
          method: 'PUT',
          body: file,
        });
        // 上传成功后，存储文件信息
        yield put({
          type: 'storingFileInformation',
          payload: payload,
        });

      } catch (e) {
        console.error(e);
      } finally { }
    },

    //存储文件信息到数据库接口
    *storingFileInformation({ payload, }, { call, put, select },) {
      const { data } = yield call(
        apis.storingFileInformation,
        {
          fileName: payload.fileName,
          fileSize: payload.fileSize,
          filePath: payload.filePath,
          fileEncryption: payload.fileEncryption,
        },
        'storingFileInformation',
        'templateEditorPrint',
      );
      if (data.code == REQUEST_SUCCESS) {
        let { fileStorageId } = data.data;
        // alert('文件存储成功');
        // 数据存储成功后，使用fileStorageId调用高老板的接口去更新表单信息
        yield put({
          type: 'updateFormDataList',
          payload: {
            fileStorageId: fileStorageId,
            filePath: payload.filePath,
          }
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },

    //调用接口更新附件信息
    *updateFormDataList({ payload, callback }, { call, put, select }) {
      let { fileStorageId, filePath } = payload;
      let { bizSolId, mainTableId, isOpen } = yield select(state => state.templateEditorPrint);

      let postData = {
        json: JSON.stringify({ 'FILE_ID': fileStorageId }),
        bizSolId: bizSolId,
        ids: String(mainTableId),
      }
      console.log('postData', postData);
      const { data } = yield call(
        apis.updateFormDataList,
        postData,
        'updateFormDataList',
        'templateEditorPrint',
      );
      if (data.code == REQUEST_SUCCESS) {

        //isOpen为true表示是批量打印
        if (isOpen) {
          // 更新完表单后，使用fileStorageId调用卢老板的接口去更新表单信息
          yield put({
            type: 'getMergePrintInfo',
            payload: {
              fileStorageId: fileStorageId,
              filePath: filePath,
            }
          });
        } else {
          //更新完表单以后调用小笋干的接口去删除原来表单关联的文件
          yield put({
            type: 'deleteOldFile',
          });
        }
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },

    //删除原来表单关联的文件
    *deleteOldFile({ payload, callback }, { call, put, select }) {
      let { oldFileId } = yield select(state => state.templateEditorPrint);
      const { data } = yield call(
        apis.deleteOldFileAboutForm,
        { id: oldFileId },
        'deleteOldFile',
        'templateEditorPrint',
      );
      if (data.code == REQUEST_SUCCESS) {
        // alert('删除成功');
      }
    },


    //获取合并打印信息
    *getMergePrintInfo({ payload, callback }, { call, put, select }) {
      let { bizSolId, bizInfoId, mainTableId, pdfFilePath } = yield select(state => state.templateEditorPrint);

      const postData = {
        bizSolId: bizSolId,
        bizInfoId: bizInfoId,
        mainTableId: mainTableId,
        pdfFilePath: payload.filePath,
      }
      const { data } = yield call(apis.getMergePrintUrl, postData, 'getMergePrintInfo', 'templateEditorPrint');
      if (data.code == REQUEST_SUCCESS) {
        if (data?.data?.url) {
          //更新完表单以后调用小笋干的接口去删除原来表单关联的文件
          yield put({
            type: 'deleteOldFile',
          });
          let href = window.document.location.href
          let pathname = href.split('/business_application')
          window.open(`${pathname[0]}/business_application/pdfPreview?src=${data.data.url}`)
        }

      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
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
