import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';
import { v4 as uuidv4 } from 'uuid';
import SparkMD5 from 'spark-md5';
import { dataFormat } from '../../util/util';
import logoBaseBusiness from '../../../public/assets/business_logo.png'// business_logo
import logoBase from '../../../public/assets/login_logo.png' // 微协同
import platFormLogo from '../../../public/assets/icap_logo.png'
import platFormBusinessLogo from '../../../public/assets/business_logo.png'
import defaultLogo from '../../../public/assets/defaultLogo.jpg'
import uploader from '../../service/uploaderRequest';
const {
  getRegister,
  getBaseset,
  supportBaseset,
  bussinessBaseset,
  microBaseset,
  getLogo,
  addLogo,
  updateLogo,
  getPartability,
  deleteTenantLogo,
  getMenu
} = apis;
export default {
  namespace: 'systemLayout', //系统配置
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
    homeImgList: [], //首页logo
    partabilityList: [], //获取授权能力
    radioIndex: 0, // 是否默认开启下标
    isAddSystem: false,
    detailData: {},
    searchWord: '',
    isSort: false,
    businessList: [], //排序数据
    customLink: '',
    limit: 10,
    currentPage: 1,
    returnCount: 0,
    menuList:[]
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      history.listen(location => {
        // if (history.location.pathname === '/systemLayout') {
        //   dispatch({
        //     type: 'getRegister',
        //     payload: {
        //       searchWord: '',
        //       limit: 100,
        //       start: 1,
        //     },
        //   });
        // }
      });
    },
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
    *getRegister({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getRegister, payload);
        console.log('data---', data);
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              getData: data.data.list,
              returnCount: data.data.returnCount,
              currentPage: data.data.currentPage,
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
    *doImgUploader({ payload, callback }, { call, put, select }) {
      try {
        let action = 'POST public/fileStorage/uploaderFile';
        uploader(action, payload).then(data => {
          console.log('data上传图片', data);
          if (data.data.code == REQUEST_SUCCESS) {
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
    //获取上传的 图片路径
    *getDownFileUrl({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getDownFileUrl, payload);
        console.log('图片路径', data);
        if (data.code == REQUEST_SUCCESS) {
          callback && callback(data.data.fileUrl);
        } else {
          message.error(data.msg, 5);
        }
      } catch (e) {
      } finally {
      }
    },
    *getBaseset({ payload, callback }, { call, put, select }) {
      // try {
        const registerName = payload.registerName
        delete payload.registerName
        const { data } = yield call(getBaseset, payload);
        console.log('查询支撑业务微协同', data);
        // 记录是否默认开启的下标
        let radioIndex = 0;
        let basesetObj = JSON.parse(JSON.stringify(data.data));

        if (basesetObj.personConfig) {
          basesetObj['PERSONENUM__CONNADMIN'] = JSON.parse(
            basesetObj.personConfig || {},
          ).PERSONENUM__CONNADMIN;
          basesetObj['PERSONENUM__DOWNLOAD'] = JSON.parse(
            basesetObj.personConfig || {},
          ).PERSONENUM__DOWNLOAD;
          basesetObj.personConfig = JSON.parse(basesetObj.personConfig || {});
          for (const key1 in basesetObj.personConfig) {
            basesetObj['' + key1] = basesetObj.personConfig[key1];
          }
        }
        if (basesetObj.tableConfig) {
          // 'TABLE_LEADER',
          // 'TABLE_INTERNAL',
          const tableKeyArr = [
            'TABLE_PERSON',
            'TABLE_MIX',
            'TABLE_FAST',
            'TABLE_CUSTOM',
          ];
          let tableConfig = JSON.parse(basesetObj.tableConfig || {});
          tableKeyArr.forEach((item, index) => {
            if (tableConfig[item]) {
              let arr = tableConfig[item].split(',');
              if (arr[1] === '1') {
                radioIndex = Number(index);
              }
              basesetObj[item] = Number(arr[0]);
            }
          });
        } else {
          // 第一次没有tableConfig时 需要预置N种桌面 SJB
          basesetObj['TABLE_FAST'] = 1;
          basesetObj['TABLE_MIX'] = 1;
          basesetObj['TABLE_PERSON'] = 1;
          basesetObj['TABLE_CUSTOM'] = 1;
        }
        if (basesetObj.abilityCodes&&registerName=='业务平台') {
          basesetObj.abilityCodes = JSON.parse(basesetObj.abilityCodes || {});
          for (const key3 in basesetObj.abilityCodes) {
            basesetObj['' + key3] = basesetObj.abilityCodes[key3];
          }
        }
        if(basesetObj.abilityCodes&&registerName == '微协同'){
          basesetObj.abilityCodes = basesetObj.abilityCodes
          if(basesetObj.abilityCodes){
            const splitCont = basesetObj.abilityCodes.split(',')
            if(splitCont&&splitCont.length>0){
              const nowArr = splitCont.map(item=>{
                const nowKey = item.split('_')[0]
                const nowValue = Number(item.split('_')[1])
                basesetObj[nowKey] = nowValue
                return {
                  [nowKey]:nowValue
                }
              })
              // basesetObj.abilityCodes = Object.assign({},...nowArr)
            }
          }
        }
        const newData = JSON.parse(JSON.stringify(data.data.tableConfig || {}));
        const customLink =
          newData && Object.keys(newData).length > 0
            ? JSON.parse(newData)?.TABLE_CUSTOM
            : '';
        const str = customLink.split(',');
        
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              basesetObj,
              radioIndex,
              customLink: str[str.length - 1],
            },
          });
          callback && callback();
        } else {
          message.error(data.msg, 5);
        }
      // } catch (e) {
      // } finally {
      // }
    },
    *getPartability({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(getPartability, payload);
        console.log('获取服务授权能力', data);
        let partabilityList = JSON.parse(JSON.stringify(data.data.abilitys));
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              partabilityList,
            },
          });
          callback && callback();
        } else {
          message.error(data.msg, 5);
        }
      } catch (e) {
      } finally {
      }
    },
    // 添加、修改支撑平台配置（已废弃）
    *supportBaseset({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(supportBaseset, payload);
        console.log('添加修改支撑', data);
        if (data.code == REQUEST_SUCCESS) {
          callback && callback();
        } else {
          message.error(data.msg, 5);
        }
      } catch (e) {
      } finally {
      }
    },
    *bussinessBaseset({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(bussinessBaseset, payload);
        console.log('添加修改业务', data);
        if (data.code == REQUEST_SUCCESS) {
          callback && callback();
        } else {
          message.error(data.msg, 5);
        }
      } catch (e) {
      } finally {
      }
    },
    *microBaseset({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(microBaseset, payload);
        console.log('添加修改微协同', data);
        if (data.code == REQUEST_SUCCESS) {
          callback && callback();
        } else {
          message.error(data.msg, 5);
        }
      } catch (e) {
      } finally {
      }
    },
    *getLogo({ payload, callback }, { call, put, select }) {
      try {
        const registerCode = payload.registerCode;
        delete payload.registerCode;
        const { data } = yield call(getLogo, payload);
        console.log('获取logo', data);
        console.log('获取payload', payload); //registerId  tabTypeCode
        if (data.code == REQUEST_SUCCESS) {
          // if(payload.registerId == '1'){
          //   //支撑
          //   yield put({
          //     type: 'updateStates',
          //     payload:{
          //       loginImgList:data.data.list,
          //     }
          //   })
          // }else if(payload.registerId == '2'){
          //业务
          let isEnable = 0;
          if (data.data.list.length != 0) {
            var index = data.data.list.findIndex(item => {
              return item.isEnable == 1;
            });
            if (index == -1) {
              isEnable = 1;
            }
          } else {
            isEnable = 1;
          }
          let defaultList = [];
          if (
            payload.tabTypeCode == 'PAGETAB_FIRSTLOGO'&&
            registerCode == 'PLATFORM_BUSS'
          ) {
            defaultList = [
              {
                logoName: '系统默认',
                logoId: 0,
                logoUrl: defaultLogo,
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
                logoUrl: logoBase,
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
          } else if (
            payload.tabTypeCode == 'PAGETAB_FIRSTLOGO' 
            &&registerCode == 'PLATFORM_SYS'
          ) {
            defaultList = [
              {
                logoName: '系统默认',
                logoId: 0,
                logoUrl:
                  registerCode == 'PLATFORM_SYS'
                    ? platFormLogo
                    : defaultLogo,
                isEnable: isEnable,
              },
            ];
            //首页
            yield put({
              type: 'updateStates',
              payload: {
                homeImgList: _.concat(defaultList, data.data.list),
              },
            });
          }
          //}

          callback && callback();
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
            namespace: 'systemLayout',
            isPresigned: 1,
            fileEncryption: fileMD5,
            filePath: `systemLayout/${dataFormat(
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
    //添加注册系统
    *addRegister({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.addRegister, payload);
      const {searchWord} = yield select(state => state.systemLayout);
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'getRegister',
          payload: {
            searchWord,
            limit: 100,
            start: 1,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取某注册系统信息
    *getRegisterId({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getRegisterId, payload);
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            detailData: data.data,
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //修改系统
    *updateRegister({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.updateRegister, payload);
      const {searchWord} = yield select(state => state.systemLayout);
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'getRegister',
          payload: {
            searchWord,
            limit: 100,
            start: 1,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //删除系统
    *deleteRegister({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.deleteRegister, payload);
      const {searchWord} = yield select(state => state.systemLayout);
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'getRegister',
          payload: {
            searchWord,
            limit: 100,
            start: 1,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //分页获取业务平台标识系统信息
    *getSystemSortList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getSystemSortList, payload);
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            businessList: data.data.list,
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //排序
    *sortSystemList({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.sortSystemList, payload);
      const {searchWord} = yield select(state => state.systemLayout);
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'getRegister',
          payload: {
            searchWord,
            limit: 100,
            start: 1,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取功能菜单
    *getMenu({ payload, callback }, { call, put, select }){
      const { data } = yield call(getMenu, payload);
      const loop = (array) => {
        for (var i = 0; i < array.length; i++) {
          array[i]['title'] = array[i]['menuName']
          array[i]['key'] = array[i]['id']
          array[i]['value'] = array[i]['id']
          if (array[i].children && array[i].children.length != 0) {
            // loop(array[i].children,children)
            array[i]['disabled']=true
            loop(array[i].children)
          }
        }
        return array
      }
      if (data.code == REQUEST_SUCCESS) {
        let sourceTree = data.data.jsonResult.list;
        yield put({
          type: 'updateStates',
          payload: {
            menuList: loop(sourceTree),
          },
        });
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
