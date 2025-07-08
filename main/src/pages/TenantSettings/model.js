import { message } from 'antd';
import apis from 'api';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import SparkMD5 from 'spark-md5';
import { dataFormat } from '../../util/util';
import { REQUEST_SUCCESS } from '../../service/constant';

const {
  getLogo,
  addLogo,
  updateLogo,
  updateLoginConfig,
  getLoginConfig,
  deleteTenantLogo,
} = apis;

export default {
  namespace: 'tenantSettings', //系统配置
  state: {
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
    ////
    loading: false,
    addObj: {},
    getData: [],
    businessModal: false,
    mobileModal: false,
    supportModal: false,
    imageUrl: '', //登录页图片
    imageLoading: false,
    logoImgUploader: null, //登录页logo
    buttonList: [],
    basesetObj: {},
    basesetId: '',
    imgList: [], //登录页图片
    loginImgList: [], //登录页logo
    portaLoginImgList: [], //门户登录页logo
    portalImgList: [], //门户logo
    homeImgList: [], //首页logo
    partabilityList: [], //获取授权能力
    loginConfigInfo: {}, //登录信息
    tabTypeKey: '',
  },
  subscriptions: {
    // setup({ dispatch, history }, { call, select }) {
    //   history.listen(location => {
    //     if (history.location.pathname === '/tenantSettings') {
    //       let tenantId = window.localStorage.getItem('tenantId');
    //       dispatch({
    //         type: 'getLoginConfig',
    //         payload: {
    //           tenantId,
    //         },
    //       });

    //       dispatch({
    //         type: 'getLogo',
    //         payload: {
    //           tabTypeCode: 'PAGETAB_LOGINPIC',
    //           start: 1,
    //           limit: 1000,
    //         },
    //       });
    //     }
    //   });
    // },
  },
  effects: {
    // 删除门户/支撑/业务logo
    *deleteTenantLogo({ payload,callback }, { call, put, select }){
      const {data} = yield call(deleteTenantLogo,payload)
      if(data.code == REQUEST_SUCCESS){
        callback&&callback()
      }else {
        message.error(data.msg);
      }
    },
    //获取登录配置信息
    *getLoginConfig({ payload,callback }, { call, put, select }) {
      const { data } = yield call(getLoginConfig, payload);
      if (data.code == REQUEST_SUCCESS) {
        let contactObj = JSON.parse(data.data.contactPerson) || {};
        let personObj = JSON.parse(data.data.dictTypeInfoJson) || {};

        let loginInfo = {
          loginCopyright: data.data.copyRight,
          pageName: data.data.pageName,
          connadminType: data.data.connadminType,
          contactName: contactObj?.CONTACT_NAME,
          contactPhone: contactObj?.CONTACT_PHONE,
          contactTelephone: contactObj?.CONTACT_TELEPHONE,
          contactAddress: contactObj?.CONTACT_ADDRESS,
          contactOthers: contactObj?.CONTACT_OTHERS,

          PERSONENUM__CONNADMIN:
            personObj?.PERSONENUM__CONNADMIN === 1 ? true : false,
          PERSONENUM__DOWNLOAD:
            personObj?.PERSONENUM__DOWNLOAD === 1 ? true : false,
        };

        yield put({
          type: 'updateStates',
          payload: {
            loginConfigInfo: loginInfo,
          },
        });
        callback&&callback(loginInfo)
      } else {
        message.error(data.msg);
      }
    },
    *getLogo({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getLogo, payload);
        console.log('获取logo', data);
        console.log('获取payload', payload); //registerId  tabTypeCode
        if (data.code == REQUEST_SUCCESS) {
          //业务
          let isEnable = 0;
          if (data.data.list.length != 0) {
            var index = data.data.list.findIndex(item => {
              return item.isEnable == 1;
            });
            if (index == -1) {
              isEnable = 1;
            }
            const listStorage = localStorage.getItem(`actionUse${payload.tabTypeCode}`)
            data.data.list.forEach(item=>{
              if(item.id != listStorage){
                  item.isEnable = 0
              }
            })
          } else {
            isEnable = 1;
          }
          let defaultList = [];
          if (payload.tabTypeCode == 'PAGETAB_LOGINPIC') {
            defaultList = [
              {
                logoName: '系统默认',
                logoId: 0,
                logoUrl: require('../../../public/assets/login_custom_bg.png'),
                isEnable: isEnable,
              },
            ];
            //图片
            yield put({
              type: 'updateStates',
              payload: {
                imgList: _.concat(defaultList, data.data.list),
              },
            });
          } else if (payload.tabTypeCode == 'PAGETAB_LOGINLOGO') {
            defaultList = [
              {
                logoName: '系统默认',
                logoId: 0,
                logoUrl: require('../../../public/assets/logo_portal.png'),
                isEnable: isEnable,
              },
            ];

            //登录页logo
            yield put({
              type: 'updateStates',
              payload: {
                loginImgList: _.concat(defaultList, data.data.list),
              },
            });
          } else if (payload.tabTypeCode == 'PAGETAB_SCENELOGO') {
            defaultList = [
              {
                logoName: '系统默认',
                logoId: 0,
                logoUrl: require('../../../public/assets/logo_gateway.png'),
                isEnable: isEnable,
              },
            ];

            //登录页logo
            yield put({
              type: 'updateStates',
              payload: {
                portalImgList: _.concat(defaultList, data.data.list),
              },
            });
          }
          // 登录页图片
          else if (payload.tabTypeCode == 'PAGETAB_SCENELOGINPIC') {
            defaultList = [
              {
                logoName: '系统默认',
                logoId: 0,
                logoUrl: require('../../../public/assets/login_custom_bg.png'),
                isEnable: isEnable,
              },
            ];

            //登录页logo
            yield put({
              type: 'updateStates',
              payload: {
                portaLoginImgList: _.concat(defaultList, data.data.list),
              },
            });
          }
        } else {
          message.error(data.msg, 5);
        }
      } catch (e) {
      } finally {
      }
    },
    *addLogo({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(addLogo, payload);
        console.log('添加logo', data);
        if (data.code == REQUEST_SUCCESS) {
          callback && callback();
        } else {
          message.error(data.msg, 5);
        }
      } catch (e) {
      } finally {
      }
    },
    *updateLogo({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(updateLogo, payload);
        console.log('修改logo', data);
        if (data.code == REQUEST_SUCCESS) {
          callback && callback();
        } else {
          message.error(data.msg, 5);
        }
      } catch (e) {
      } finally {
      }
    },
    *updateLoginConfig({ payload, callback }, { call, put, select }) {
      const { data } = yield call(updateLoginConfig, payload);
      if (data.code == REQUEST_SUCCESS) {
        message.success('修改成功');
        //   yield put({
        //     type: 'updateStates',
        //     payload: {
        //       loginConfigInfo: data.data,
        //     },
        //   });
        callback&&callback()
      } else {
        message.error(data.msg);
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
            namespace: 'tenantSettings',
            isPresigned: 1,
            fileEncryption: fileMD5,
            filePath: `tenantSettings/${dataFormat(
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
