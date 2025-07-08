import apis from 'api';
import { message } from 'antd';
import lodash from 'lodash';
import PersonImg from '../../../public/assets/personPng.png'
import RecycleSvg from '../../../public/assets/recycle.svg'
import PublicPng from '../../../public/assets/publicPng.png'
import FilePng from '../../../public/assets/filePng.png'
import Icon  from '@ant-design/icons'
import { REQUEST_SUCCESS } from '../../service/constant';
const {
  getPagingOrBinList_SignDisk,
  postNewDir_SignDisk,
  putDownLoad_SignDisk,
  delDelete_SignDisk,
  putSort_SignDisk,
  postCopy_SignDisk,
  postMove_SignDisk,
  putRechristen_SignDisk,
  getDetailPublicMessage_SignDisk,
  getDetailPagingMessage_SignDisk,
  getOtherShareList_SignDisk,
  getMyShareList_SignDisk,
  delShareAll_SignDisk,
  delShare_SignDisk,
  getMyShareDetail,
  putRecover,
  getAuthorityList_CommonDisk,
  postUpload_SignDisk,
  postShare_SignDisk, ///
  getDetailPublicMessage_CommonDisk, ///
  getDetailPagingMessage_CommonDisk, ///
  getFileLengthURL,
  getFileLengthURL_CommonDisk,
  putDownLoad_CommonDisk,
} = apis;

export default {
  namespace: 'signDisk',
  state: {
    ItreeData: [
      {
        title: '公共文件',
        key: 1,
        isLeaf: false,
        type: 'public',
        icon: <img src={PublicPng}/>,
        url: [{ key: 1, title: '公共文件' }],
      },
      {
        title: '个人文件',
        key: 2,
        isLeaf: false,
        type: 'person',
        icon: <img src={PersonImg}/>,
        url: [{ key: 2, title: '个人文件' }],
        children: [
          {
            title: '我的文件',
            key: 0,
            isLeaf: false,
            type: 'person',
            icon: <img src={FilePng}/>,
            url: [
              { key: 2, title: '个人文件' },
              { key: 0, title: '我的文件' },
            ],
          },
          {
            title: '他人分享',
            key: 3,
            isLeaf: true,
            type: 'person',
            icon: <img src={FilePng}/>,
            url: [
              { key: 2, title: '个人文件' },
              { key: 3, title: '他人分享' },
            ],
          },
          {
            title: '我的分享',
            key: 4,
            isLeaf: true,
            type: 'person',
            icon: <img src={FilePng}/>,
            url: [
              { key: 2, title: '个人文件' },
              { key: 4, title: '我的分享' },
            ],
          },
          {
            title: '回收站',
            key: 5,
            isLeaf: true,
            type: 'person',
            icon: <img src={RecycleSvg}/>,
            url: [
              { key: 2, title: '个人文件' },
              { key: 5, title: '回收站' },
            ],
          },
        ],
      },
    ],
    moveOrCopyTreeData: [], //移动复制功能专用树
    fileStorageId: '', //存储信息到数据库返回id
    getFileMD5Message: {}, //md5返回的文件信息
    fileExists: '', //判断文件是否存在于minio服务器中，判断fileExists状态进行后续分别操作
    typeName: '',
    selectTreeUrl: [{ key: 1, title: '公共文件' }], //面包屑
    moveOrCopyIdType: '', //判断移动或复制按钮点击的位置，one是点击列表中的，mutch是点击顶部button的
    controlFlag: false, //公共文件首次加载控制开关
    disabledAllButton: false, //禁用掉所有的按钮
    uploadFlag: true, //上传暂停器
    nowMessage: '', //实时信息
    isStop: true, //暂停按钮的禁用
    isContinue: false, //继续按钮的禁用
    isCancel: false, //取消按钮的禁用
    downName: '', //下载的文件名
    filelenthurl: '', //用来获取文件length的url
    downURL: '', //返回的下载地址
    fileSize: '',
    needfilepathHALF: '', //需要的minio路径，除开后面的数字
    needfilepath: '', //需要的minio路径
    v: 1, //计数器
    md5: '', //文件md5值
    merageFilepath: '', //合并后的文件路径
    success: '', //判断上传路径是否存在
    filePathIsReal: '', //文件路径有返回，没有则空
    publicDetailMSG: {},
    publicControlflag: false,
    publicDetailStart: 1,
    publicDetailLimit: 10,
    pbulicDetail: false,
    index: 0,
    file: {},
    optionFile: {},
    typeNames: '',
    fileNames: '',
    fileName: '', //每片文件名
    fileChunkedList: [], //文件分片完成之后的数组
    info: 'public', //类别
    container: [], //装key
    // treeKey: '',//当前点击的小三角的key
    ctorl: false,
    search: '', //我的文件搜索内容
    dirName: '', //文件夹名
    myFileId: 0,
    // newTreeData: [],//树表
    typeId: 0, //左侧类别id
    start: 1,
    limit: 10,
    myFileStart: 1,
    myFileLimit: 10,
    uploadVisible: false, //上传弹窗
    chunkId: 0,
    selectedKeysValue: 1, //左侧选中的树
    treeId: 0, //树主键根节点0
    ItreeId: 0, //移动或复制用主树根节点
    treeName: '', //树名（用于区分右侧列表，暂定）
    returnCounts: '', //我的文件全部条数
    currentPage: 0,
    trashReturnCount: '', //回收站全部条数
    trashCurrent: 0, //回收站当前页
    showNewDir: false, //我的文件新建文件夹弹窗
    signMoveVisible: false, //移动框
    moveOrCopyCode: 'move', //移动。复制
    sortVisible: false, //排序框
    id: 1, //文件主键
    open: false,
    detailVisible: false, //我的详情弹窗
    publicList: [], //公共列表
    publicReturnCounts: '', //公共列表全部条数
    publicCurrentPage: 0,
    publicStart: 1,
    publicLimit: 10,
    publicSearch: '',
    pubRowSelectionKey: '',
    pubRowSelection: [],
    detailPublic: {}, //我的文件公共详情信息
    detailList: [], //我的文件公共详情分页列表
    detailreturnCount: '', //我的文件公共详情分页总条数
    detailCurrentPage: 0, //我的文件公共详情分页当前页
    otherShareReturnCount: '', //他人分享总数量
    otherSharecurrentPage: 0, //他人分享当前页
    myShareReturnCount: '', //我的分享总数量
    mySharecurrentPage: 0, //我的分享当前页
    myShareDetailReturnCount: '', //我的分享详情总数量
    myShareDetailCurrentPage: 0, //我的分享详情当前页
    myShareDetailVisible: false, //我的分享详情页弹窗
    detailStart: 1,
    detailLimit: 10,
    otherShareStart: 1, //他人分享页列表start
    otherShareLimit: 10, //他人分享列页表limit
    otherShareName: '', //他人分享页搜索内容
    myShareStart: 1, //我的分享页列表start
    myShareLimit: 10, //我的分享页列表limit
    myShareName: '', //我的分享页搜索内容
    myShareDetailStart: 1, //我的分享详情页start
    myShareDetailLimit: 10, //我的分享详情页limit
    myShareDetailName: '', //我的分享详情页搜索内容
    trashStart: 1,
    trashLimit: 10,
    trashName: '',
    authlist: [], //权限列表
    List: [], //公共文件左侧权限树
    sortJson: [], //我的文件排序数组
    fileId: [], //我的文件minio文件主键
    otherShareFileId: [], //他人分享文件minio文件主键
    myShareFileId: [], //我的分享文件minio文件主键
    trashFileId: [], //回收站minio文件主键
    authorityList: [], //左侧公共树形结构
    myList: [], //我的文件右侧列表结构
    myAllList: [], // 所有文件
    trashList: [], //回收站右侧列表
    ids: [], //多条文件主键
    rowSelectionKey: [], //我的文件列表选中id数组
    rowSelection: [], //我的文件列表选中数组
    otherShareRowSelectionKey: [], //我的文件列表选中id数组
    otherShareRowSelection: [], //我的文件列表选中数组
    myShareRowSelectionKey: [], //我的分享列表选中id数组
    myShareRowSelection: [], //我的分享列表选中数组
    myShareDetailRowSelectionKey: [], //我的分享详情列表选中id数组
    myShareDetailRowSelection: [], //我的分享列表详情选中数组
    trashRowSelection: [],
    trashRowSelectionKey: [],
    otherShareList: [], //他人分享页列表
    myShareList: [], //我的分享页列表
    myShareDetailList: [], //我的分享页详情列表
    oldSelectedDatas: [],
    oldSelectedDataIds: [],
    returnCount: '',
    uploadStoreIndex: 0,
    publicDetailList: [],
    publicDetailreturnCount: '',
    publicDetailCurrentPage: 0,
    // 以下为其他组件必须
    selectedNodeId: '',
    selectedDataIds: [],
    treeData: [],
    currentNode: [],
    expandedKeys: [],
    treeSearchWord: '',
    selectedDatas: [],
    oldSelectedDatas: [],
    selectedDataIds: [],
    oldSelectedDataIds: [],
    originalData: [],
    selectNodeType: '',
    searchValue:'',
  },
  subscriptions: {
  },
  effects: {
    // 权限公共树
    *getAuthorityList_CommonDisk_Tree(
      { payload, callback },
      { call, put, select },
    ) {
      const { data } = yield call(getAuthorityList_CommonDisk, payload,'getAuthorityList_CommonDisk_Tree','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        let newData = [];
        data.data.list
          ? data.data.list.map((item) => {
              newData.push({
                title: item.cloudDiskName,
                key: item.id,
                isLeaf: item.child == 'Y' ? false : true,
              });
            })
          : [];
        yield put({
          type: 'updateStates',
          payload: {
            List: newData,
          },
        });
        callback && callback(newData);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 权限公共列表
    *getAuthorityList_CommonDisk_List(
      { payload, callback },
      { call, put, select },
    ) {
      const { data } = yield call(getAuthorityList_CommonDisk, payload,'getAuthorityList_CommonDisk_List','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            publicList: data.data.list
              ? lodash.sortBy(data.data.list, function (o) {
                  return -o.createTime;
                })
              : [],
            publicReturnCounts: data.data.returnCount,
            publicCurrentPage: data.data.currentPage,
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 我的文件右侧列表
    *getPagingOrBinList_SignDisk_List(
      { payload, callback },
      { call, put, select },
    ) {
      const { status = '', ...otherParams } = payload;
      const { data } = yield call(getPagingOrBinList_SignDisk, otherParams,'getPagingOrBinList_SignDisk_List','signDisk');
      if ((data.code = REQUEST_SUCCESS)) {
        if (status === 'ALL') {
          yield put({
            type: 'updateStates',
            payload: {
              myAllList: data.data.list
                ? lodash.sortBy(data.data.list, function (o) {
                    return -o.createTime;
                  })
                : lodash.sortBy(data.data.list, 'sort'),
            },
          });
        } else {
          yield put({
            type: 'updateStates',
            payload: {
              // myList: data.data.list ? data.data.list : [],
              // myList: data.data.list ? lodash.sortBy(data.data.list,'sort') : [],
              myList: data.data.list
                ? lodash.sortBy(data.data.list, function (o) {
                    return -o.createTime;
                  })
                : lodash.sortBy(data.data.list, 'sort'),
              returnCounts: data.data.returnCount,
              currentPage: data.data.currentPage,
            },
          });
        }

        callback && callback(data.data.list);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 我的文件左侧树
    *getPagingOrBinList_SignDisk_Tree(
      { payload, callback },
      { call, put, select },
    ) {
      const { data } = yield call(getPagingOrBinList_SignDisk, payload,'getPagingOrBinList_SignDisk_Tree','signDisk');
      if ((data.code = REQUEST_SUCCESS)) {
        let newData = [];
        data.data&&data.data.list
          ? data.data.list.map((item) => {
              newData.push({
                title: item.cloudDiskName,
                key: item.id,
                isLeaf: item.child == 'Y' ? false : true,
              });
            })
          : [];
        yield put({
          type: 'updateStates',
          payload: {},
        });
        // console.log("newData=0",newData)
        callback && callback(newData);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 回收站
    *getPagingOrBinList_SignDisk_Listist_Trash(
      { payload, callback },
      { call, put, select },
    ) {
      const { data } = yield call(getPagingOrBinList_SignDisk, payload,'getPagingOrBinList_SignDisk_Listist_Trash','signDisk');
      if ((data.code = REQUEST_SUCCESS)) {
        yield put({
          type: 'updateStates',
          payload: {
            trashList: data.data.list
              ? lodash.sortBy(data.data.list, function (o) {
                  return -o.delTime;
                })
              : [],
            trashReturnCount: data.data.returnCount,
            trashCurrent: data.data.currentPage,
          },
        });
        callback&&callback(data.data.list)
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 新建文件夹
    *postNewDir_SignDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(postNewDir_SignDisk, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback && callback(data.data);
        message.success('创建成功');
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 获取文件大小
    *getFileLengthURL_CommonDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getFileLengthURL_CommonDisk, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            filelenthurl: data.data,
          },
        });
        callback && callback(data.data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //公共云盘下载
    *putDownLoad_CommonDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(putDownLoad_CommonDisk, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            downURL: data.data.filePath,
            downName: data.data.fileName,
          },
        });
        callback && callback(data.data.filePath, data.data.fileName);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 下载
    *putDownLoad_SignDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(putDownLoad_SignDisk, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            downURL: data.data.filePath,
            downName: data.data.fileName,
          },
        });
        callback && callback(data.data.filePath, data.data.fileName);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 删除
    *delDelete_SignDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(delDelete_SignDisk, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback && callback();
        message.success('删除成功');
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 排序
    *putSort_SignDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(putSort_SignDisk, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 移动
    *postMove_SignDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(postMove_SignDisk, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback && callback();
        message.success('移动成功');
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 复制
    *postCopy_SignDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(postCopy_SignDisk, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback && callback();
        message.success('复制成功');
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 重命名
    *putRechristen_SignDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(putRechristen_SignDisk, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback && callback();
        message.success('重命名成功');
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 获取详情公共信息
    *getDetailPublicMessage_SignDisk(
      { payload, callback },
      { call, put, select },
    ) {
      const { data } = yield call(getDetailPublicMessage_SignDisk, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            detailPublic: data.data ? data.data : {},
          },
        });
        callback && callback();
        // message.success(data.msg);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 获取详情公共分页
    *getDetailPagingMessage_SignDisk(
      { payload, callback },
      { call, put, select },
    ) {
      const { data } = yield call(getDetailPagingMessage_SignDisk, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            detailList: data.data.list ? data.data.list : [],
            detailreturnCount: data.data.returnCount,
            detailCurrentPage: data.data.currentPage,
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取他人分享页列表
    *getOtherShareList_SignDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getOtherShareList_SignDisk, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            otherShareList: data.data.list
              ? lodash.sortBy(data.data.list, function (o) {
                  return -o.createTime;
                })
              : [],
            otherShareReturnCount: data.data.returnCount,
            otherSharecurrentPage: data.data.currentPage,
          },
        });
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 获取我的分享页列表
    *getMyShareList_SignDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getMyShareList_SignDisk, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            myShareList: data.data.list ? data.data.list : [],
            myShareReturnCount: data.data.returnCount,
            mySharecurrentPage: data.data.currentPage,
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 取消分享我的列表
    *delShareAll_SignDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(delShareAll_SignDisk, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 取消分享我的详情列表
    *delShare_SignDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(delShare_SignDisk, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 获取我的分享详情
    *getMyShareDetail({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getMyShareDetail, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            myShareDetailList: data.data.list ? data.data.list : [],
            myShareDetailReturnCount: data.data.returnCount,
            myShareDetailCurrentPage: data.data.currentPage,
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 恢复
    *putRecover({ payload, callback }, { call, put, select }) {
      const { data } = yield call(putRecover, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback && callback(data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 分享
    *postShare_SignDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(postShare_SignDisk, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 获取详情公共信息
    *getDetailPublicMessage_CommonDisk(
      { payload, callback },
      { call, put, select },
    ) {
      const { data } = yield call(getDetailPublicMessage_CommonDisk, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            publicDetailMSG: data.data ? data.data : {},
          },
        });

        callback &&
          callback(
            data.data ? data.data.see : {},
            data.data ? data.data.download : {},
          );
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 获取详情分页信息
    *getDetailPagingMessage_CommonDisk(
      { payload, callback },
      { call, put, select },
    ) {
      const { data } = yield call(getDetailPagingMessage_CommonDisk, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            publicDetailList: data.data.list ? data.data.list : [],
            publicDetailreturnCount: data.data.returnCount,
            publicDetailCurrentPage: data.data.currentPage,
          },
        });
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    ////////////////////////////////////////////////////////////////////////////////////////////
    // 获取文件大小
    *getFileLengthURL({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getFileLengthURL, payload,'','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            filelenthurl: data.data,
          },
        });
        callback && callback(data.data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 上传
    *postUpload_CommonDisk({ payload, callback }, { call, put, select }) {
      const { myFileStart, myFileLimit, treeId } = yield select(
        (state) => state.signDisk,
      );
      const { data } = yield call(postUpload_SignDisk, payload,'postUpload_CommonDisk','signDisk');
      if (data.code == REQUEST_SUCCESS) {
        message.success('上传成功!');
        yield put({
          type: 'updateStates',
          payload: {
            nowMessage: '',
            uploadVisible: false,
            index: 0,
            isStop: true,
            isContinue: true,
            isCancel: false,
          },
        });
        yield put({
          type: 'getPagingOrBinList_SignDisk_List',
          payload: {
            start: myFileStart,
            limit: myFileLimit,
            id: treeId,
            name: '',
            delete: 'Y',
            type: 'L',
          },
        });
        callback && callback();
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
