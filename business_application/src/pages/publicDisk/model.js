import apis from 'api';
import { message } from 'antd';
import lodash from 'lodash';
import { REQUEST_SUCCESS } from '../../service/constant';
import PublicSvg from '../../../public/assets/publicPng.png'
import FileIconSvg from '../../../public/assets/filePng.png'
import { dataFormat } from '../../util/util';

const {
  getPagingList_CommonDisk,
  getAuthorityView_CommonDisk,
  postSetAuthority_CommonDisk,
  putDownLoad_CommonDisk,
  delDelete_CommonDisk,
  postMove_CommonDisk,
  postNewDir_CommonDisk,
  postCopy_CommonDisk,
  putSort_CommonDisk,
  getDetailPublicMessage_CommonDisk,
  getDetailPagingMessage_CommonDisk,
  putRechristen_CommonDisk,
  postUpload_CommonDisk,
  getFileLengthURL_CommonDisk,
} = apis;

export default {
  namespace: 'publicDisk',
  state: {
    publicTreeData: [
      {
        title: '公共文件',
        key: '0',
        isLeaf: false,
        icon:<img src={PublicSvg}/>,
        url: [{ key: '0', title: '公共文件' }],
      },
    ],
    md5FileId: '',
    md5FilePath: '',
    fileStorageId: '', //存储信息到数据库返回id
    getFileMD5Message: {}, //md5返回的文件信息
    fileExists: '', //判断文件是否存在于minio服务器中，判断fileExists状态进行后续分别操作
    typeName: '公共文件',
    selectTreeUrl: [{ key: 0, title: '公共文件' }], //面包屑
    moveOrCopyIdType: '', //判断移动或复制按钮点击的位置，one是点击列表中的，mutch是点击顶部button的
    moveOrCopyIsLeaf: '', //移动或复制时小三角是否显示
    moveOrCopyTitle: '', //移动或复制时标题
    disabledAllButton: false, //禁用掉所有按钮
    uploadFlag: true, //上传暂停器
    nowMessage: '', //实时信息
    isStop: true, //暂停按钮的禁用
    isContinue: true, //继续按钮的禁用
    isCancel: false, //取消按钮的禁用
    downName: '', //下载的文件名
    filelenthurl: '', //用来获取length的url
    downURL: '', //返回的下载地址
    fileSize: '',
    needfilepathHALF: '', //需要的路径，除开后面的数字
    needfilepath: '', //需要的路径
    v: 1, //计数器
    md5: '', //文件md5值
    merageFilepath: '', //合并后的文件路径
    success: '', //判断上传路径是否存在
    publicDetailMSG: {},
    publicControlflag: false,
    publicDetailStart: 1,
    publicDetailLimit: 10,
    pbulicDetail: false,
    index: 0,
    file: {},
    optionFile: [],
    typeNames: '',
    fileNames: '',
    fileName: '', //每片文件名
    fileChunkedList: [], //文件分片完成之后的数组
    ///////
    selectedPublicKey: 0, //单条id
    selectedKeysValue: 0,
    moveOrCopyFlag: false,
    open: false,
    search: '', //搜索内容
    typeId: 0, //左侧类别id
    start: 1,
    limit: 10,
    showNewDir: false, //新建文件夹显示隐藏
    showAuthority: false, //权限设置显示隐藏
    dirName: '', //新建文件夹名称
    treeId: 0, //树主键根节点0
    ItreeId: 0, //移动或复制用主树根节点
    rowSelectionKey: [], //列表选中id数组
    rowSelection: [], //列表选中数组
    authlist: [], //获取回显的权限列表
    radioSeeValue: 1, //控制是否可查看按钮
    radioDownloadValue: 1, //控制是否可下载
    radioDetailValue: 1, //控制是否可查看详情
    commentsRows: [], //权限单选选中的
    commentsRowsKeys: '', //权限单选选中的id
    controlDisabled: true, //下方权限选项是否禁用
    authorityList: [], //左侧公共树形结构
    List: [], //右侧公共列表结构
    list: [], //右侧列表结构
    AllList: [], // 所有的右侧列表数据
    listReturnCount: '',
    listCurrentPage: 0,
    fileId: [], //minio文件主键
    id: '', //文件主键
    ids: [], //多条文件主键
    publicMoveVisible: false, //移动框
    moveOrCopyCode: 'move', //move移动。copy复制。
    sortVisible: false, //排序框
    sortJson: [], //排序数组
    detailVisible: false, //详情弹窗
    detailPublic: {}, //公共详情信息
    detailList: [], //公共详情分页列表
    detailreturnCount: '', //公共详情分页总条数
    detailCurrentPage: 0, //公共详情分页当前页
    detailStart: 1,
    detailLimit: 10,
    controlflag: false, //控制分页详情渲染开关
    resetName: false, //重命名弹窗
    flag: false, //文件分片上传状态
    uploadVisible: false,
    chunkId: 0, //
    ////////////////////////以下为其他组件必须
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
    resetNameList: [],
    isUploading: false,
    treeKeys: new Date().getTime(),
  },
  subscriptions: {
  },
  effects: {
    //获取右侧列表
    *getPagingList_CommonDisk_List(
      { payload, callback },
      { call, put, select },
    ) {
      const { status = '', ...otherParams } = payload;
      // call第三个参数：如果effects中的当前函数名和call的接口key不相同需添加
      const { data } = yield call(getPagingList_CommonDisk, otherParams,'getPagingList_CommonDisk_List','publicDisk');
      if (data.code == REQUEST_SUCCESS) {
        if (status === 'ALL') {
          yield put({
            type: 'updateStates',
            payload: {
              // list: data.data.list ? lodash.sortBy(data.data.list,'sort') : [],
              AllList: data.data.list
                ? lodash.sortBy(data.data.list, function (o) {
                    return -o.createTime;
                  })
                : [],
            },
          });
        } else {
          yield put({
            type: 'updateStates',
            payload: {
              // list: data.data.list ? lodash.sortBy(data.data.list,'sort') : [],
              list: data.data.list
                ? lodash.sortBy(data.data.list, function (o) {
                    return -o.createTime;
                  })
                : [],
              listReturnCount: data.data.returnCount,
              listCurrentPage: data.data.currentPage,
            },
          });
        }

        callback && callback(data.data.list);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //获取左侧树形结构
    *getPagingList_CommonDisk_Tree(
      { payload, callback },
      { call, put, select },
    ) {
      const { data } = yield call(getPagingList_CommonDisk, payload,'getPagingList_CommonDisk_Tree','publicDisk');
      if (data.code == REQUEST_SUCCESS) {
        const { publicTreeData } = yield select((state) => state.publicDisk);

        let transformTreeList = data.data.list.reduce((pre, cur) => {
          pre.push({
            title: cur.cloudDiskName,
            key: cur.id,
            isLeaf: cur.child == 'Y' ? false : true,
            icon: <img src={FileIconSvg}/>
          });
          return pre;
        }, []);

        let newTree = (list) => {
          return list.reduce((pre, cur) => {
            if (cur.key === payload.id) {
              pre.push({
                ...cur,
                children: transformTreeList,
              });
            } else {
              let newChildrenList = cur.children && newTree(cur.children);

              pre.push({
                ...cur,
                children: newChildrenList,
              });
            }
            return pre;
          }, []);
        };

        yield put({
          type: 'updateStates',
          payload: {
            publicTreeData: newTree(publicTreeData),
          },
        });

        callback && callback(transformTreeList);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 获取权限列表回显（限单条数据）
    *getAuthorityView_CommonDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getAuthorityView_CommonDisk, payload,'getAuthorityView_CommonDisk','publicDisk');
      console.log("data==00",data)
      if (data.code == REQUEST_SUCCESS) {
        let selectDatas = [];
        let selectedDataIds = [];
        data.data.authlist.map((item) => {
          if (item.operation == 'ORG') {
            selectDatas.push({
              nodeId: item.orgId,
              nodeName: item.orgName,
            });
            selectedDataIds.push(item.orgId);
          } else if (item.operation == 'USER') {
            selectDatas.push({
              nodeId: item.authUserId,
              nodeName: item.authUserName,
            });
            selectedDataIds.push(item.authUserId);
          }
        });
        yield put({
          type: 'updateStates',
          payload: {
            authlist: data.data.authlist ? data.data.authlist : [],
            selectedDatas: selectDatas,
            oldSelectedDatas: selectDatas,
            selectedDataIds: selectedDataIds,
            oldSelectedDataIds: selectedDataIds,
          },
        });
        callback&&callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 权限设置
    *postSetAuthority_CommonDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(postSetAuthority_CommonDisk, payload,'postSetAuthority_CommonDisk','publicDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback&&callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 下载
    *putDownLoad_CommonDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(putDownLoad_CommonDisk, payload,'putDownLoad_CommonDisk','publicDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            downURL: data.data.filePath,
            downName: data.data.fileName,
          },
        });
        callback&&callback(data.data.filePath, data.data.fileName);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 删除
    *delDelete_CommonDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(delDelete_CommonDisk, payload,'','publicDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback&&callback();
        message.success('删除成功');
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 移动
    *postMove_CommonDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(postMove_CommonDisk, payload,'','publicDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback&&callback();
        message.success('移动成功');
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 复制
    *postCopy_CommonDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(postCopy_CommonDisk, payload,'','publicDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback&&callback();
        message.success('复制成功');
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 新建文件夹
    *postNewDir_CommonDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(postNewDir_CommonDisk, payload,'','publicDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback&&callback(data.data);
        message.success('创建成功');
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 排序
    *putSort_CommonDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(putSort_CommonDisk, payload,'','publicDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {},
        });
        callback&&callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 获取详情公共信息
    *getDetailPublicMessage_CommonDisk(
      { payload, callback },
      { call, put, select },
    ) {
      const { data } = yield call(getDetailPublicMessage_CommonDisk, payload,'','publicDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            detailPublic: data.data,
          },
        });
        callback&&callback();
        // message.success(data.msg);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 获取详情公共分页
    *getDetailPagingMessage_CommonDisk(
      { payload, callback },
      { call, put, select },
    ) {
      const { data } = yield call(getDetailPagingMessage_CommonDisk, payload,'','publicDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            detailList: data.data.list ? data.data.list : [],
            detailreturnCount: data.data.returnCount,
            detailCurrentPage: data.data.currentPage,
          },
        });
        callback&&callback();
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 重命名
    *putRechristen_CommonDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(putRechristen_CommonDisk, payload,'','publicDisk');
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
    // 获取文件大小
    *getFileLengthURL_CommonDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(getFileLengthURL_CommonDisk, payload,'','publicDisk');
      if (data.code == REQUEST_SUCCESS) {
        yield put({
          type: 'updateStates',
          payload: {
            filelenthurl: data.data,
          },
        });
        callback&&callback(data.data);
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    // 上传（文件已经存在于minio）
    *postUpload_CommonDisk({ payload, callback }, { call, put, select }) {
      const { data } = yield call(postUpload_CommonDisk, payload,'','publicDisk');
      const { start, limit, treeId, search } = yield select(
        (state) => state.publicDisk,
      );
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
            fileExists: '',
          },
        });
        yield put({
          type: 'getPagingList_CommonDisk_List',
          payload: {
            start: start,
            limit: limit,
            id: treeId,
            name: search,
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
