import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant'
import { parse } from 'query-string';
const { addMenu, updateMenu, deleteMenu, getMenu, getMenuId, getBizSolTree, formMateData ,getRegister,getBussMenuList,getMicMenuIds,getMobileBillingTag} = apis;
export default {
  namespace: 'moduleResourceMg',
  state: {
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
    //////
    loading: false,
    menuList: [],
    modalMenuList:[],//弹框的上级节点数据
    addModal: false,  //新增修改
    setModal: false,//业务域设置
    addObj: {},
    oldAddObj: {},
    abilitys: [],
    selectAbility: {},
    sysTreeData: [{
      title: '业务域',
      key: '10',
      selectable: false,
      children: [
        {
          title: '支撑平台',
          key: '1',
        },
        {
          title: '业务平台',
          key: '2',
        },
        {
          title: '微协同',
          key: '3',
        }
      ]
    }],//系统树
    moduleTreeData: [
      {
        title: '模块资源名称',
        key: '1',
      },
      {
        title: '组织与权限',
        key: '2',
      },
      {
        title: '应用建模',
        key: '3',
      },
      {
        title: '预算管理',
        key: '4',
      },
      {
        title: '公文管理',
        key: '5',
      },
      {
        title: '通用管理',
        key: '6',
      }
    ],
    imageUrl: '',
    menuImgId: '',
    parentIds: [],//上级节点id
    parentObjs: [],//上级点击obj
    treeData: [{
      title: '业务域',
      key: '10',
      selectable: false,
      children: [
        {
          title: '支撑平台',
          key: '1',
        },
        {
          title: '业务平台',
          key: '2',
        },
        {
          title: '微协同',
          key: '3',
        }
      ]
    }],
    expandedKeys: [],
    currentNode: {},
    treeSearchWord: '',
    sysMenuList: [],
    menuLists: [],
    selectBizsolModal: false,
    ctlgTree: [],
    limit: 10,
    start: 1,
    returnCount: 0,
    currentPage: 1,
    businessList: [],
    selectBusiness: [],
    selectBusinessRows: [],
    moudleCurrentPage: 1,
    ctlgId: '',
    businessFormTree:[],
    isShowDesign:false,
    designId:'',
    businessFormTable:[],
    businessCurrentPage: 1,
    businessReturnCount: 0,
    selectDesign: [],
    selectDesignRows: [],
    parentNodeId:[],
    leftNum:220,
    isShowBusiness:false,
    bussTreeData:[],
    bussLimit: 10,
    bussReturnCount: 0,
    bussCurrentPage: 1,
    bussMenuList:[],
    moduleRows:[],
    mobileTag:'',
    searchWord:''
  },
  subscriptions: {
    setup({ dispatch, history }, { call, select }) {
      // history.listen(location => {
      //   if (history.location.pathname === '/moduleResourceMg') {
      //     // dispatch({
      //     //   type: 'getMenu',
      //     //   payload:{
      //     //     start: 1,
      //     //     limit: 10,
      //     //     ctlgId:1
      //     //   }
      //     // })
      //     const query = parse(history.location.search);
      //     if (query.isInit == '1') {
      //       dispatch({
      //         type: 'updateStates',
      //         payload: {
      //           loading: false,
      //           menuList: [],
      //           addModal: false,
      //           setModal: false,
      //           addObj: {},
      //           sysTreeData: [],
      //           imageUrl: '',
      //           menuImgId: '',
      //           parentIds: []
      //         }
      //       })
      //     }
      //   }
      // });
    }
  },
  effects: {
    *getMenu({ payload, callback,isForm }, { call, put, select }) {
      try {
        // const  loop = (array,children)=>{
        const loop = (array) => {
          for (var i = 0; i < array.length; i++) {
            array[i]['title'] = array[i]['menuName']
            array[i]['key'] = array[i]['id']
            array[i]['value'] = array[i]['id']
            if (array[i].children && array[i].children.length != 0) {
              // loop(array[i].children,children)
              loop(array[i].children)
            }
          }
          return array
        }
        const { data } = yield call(getMenu, payload, '', 'moduleResourceMg');
        if (data.code == REQUEST_SUCCESS) {
          let sourceTree = data.data.jsonResult.list;
          // sourceTree = loop(sourceTree,data.data.jsonResult.list);
          sourceTree = loop(sourceTree);
          if(isForm=="modal"){//添加弹框的上级目录
            yield put({
              type: 'updateStates',
              payload: {
                //menuList: data.data.jsonResult.list,
                modalMenuList: sourceTree,
                menuList: sourceTree
              }
            })
          }else{
            yield put({
              type: 'updateStates',
              payload: {
                //menuList: data.data.jsonResult.list,
                menuList: sourceTree
              }
            })
          }
          callback && callback(sourceTree);
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *addMenu({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(addMenu, payload, '', 'moduleResourceMg');
        //  const {currentPage } = yield select(state=>state.moduleResourceMg)
        const { currentNode } = yield select(state => state.moduleResourceMg)
        if (data.code == REQUEST_SUCCESS) {
          if(data.data.isRecover=='false'){
            yield put({
              type: 'getMenu',
              payload: {
                registerId: currentNode.key
              }
            })
          }
          callback && callback(data.data);
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *updateMenu({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(updateMenu, payload, '', 'moduleResourceMg');
        const { currentNode } = yield select(state => state.moduleResourceMg)
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getMenu',
            payload: {
              registerId: currentNode.key
            }
          })
          callback && callback(data);
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *deleteMenu({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(deleteMenu, payload, '', 'moduleResourceMg');
        const { currentNode } = yield select(state => state.moduleResourceMg)
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getMenu',
            payload: {
              registerId: currentNode.key
            }
          })
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getBizSolTree({ payload, callback }, { call, put, select }) {
      try {
        const loop = (array) => {
          for (var i = 0; i < array.length; i++) {
            array[i]['title'] = array[i]['nodeName']
            array[i]['key'] = array[i]['nodeId']
            array[i]['value'] = array[i]['nodeId']
            if (array[i]['nodeType'] != 'bizSol') {
              array[i]['disabled'] = true
            }
            if (array[i].children && array[i].children.length != 0) {
              loop(array[i].children)
            }
          }
          return array
        }
        const { data } = yield call(getBizSolTree, payload, '', 'moduleResourceMg');
        if (data.code == REQUEST_SUCCESS) {
          console.log('data获取业务应用类别树', data.data)
          let sourceTree = loop(data.data);

          yield put({
            type: 'updateStates',
            payload: {
              sysMenuList: sourceTree
            }
          })


          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //获取业务应用类别树
    *getCtlgTree({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getCtlgTree, payload, '', 'moduleResourceMg');
      if (data.code == REQUEST_SUCCESS) {
        //默认为第一个
        // if(data.data.length){
        //   yield put({
        //     type:'getBusinessList',
        //     payload:{
        //       ctlgId:data.data[0].nodeId,
        //       start:1,
        //       limit:limit,
        //       searchWord:''
        //     }
        //   })
        // }
        yield put({
          type: "updateStates",
          payload: {
            ctlgTree: data.data.list,
            //  selectCtlgInfo:{nodeId:data.data.length?data.data[0].nodeId:'',nodeName:data.data.length?data.data[0].nodeName:''}
          }
        })
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //通过类别获取业务应用
    *getBusinessList({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getBusinessList, payload, '', 'moduleResourceMg');
      if (data.code == 200) {
        yield put({
          type: "updateStates",
          payload: {
            businessList: data.data.list,
            moudleCurrentPage: data.data.currentPage,
            returnCount: data.data.returnCount,
          }
        })
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //上移下移
    *menuMove({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.menuMove, payload, '', 'moduleResourceMg');
      if (data.code == 200) {
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //批量保存
    *menuSort({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.menuSort, payload, '', 'moduleResourceMg');
      if (data.code == 200) {
        callback && callback();

      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    // 根据业务方案ID获取相应的表的数据拼接
    *formMateData({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.formMateData, payload, '', 'moduleResourceMg');
      if (data.code == 200) {
        callback && callback(data.data);
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //查看租户信息
    *getTenantLicense({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getTenantLicense, payload, '', 'moduleResourceMg');
      if (data.code == 200) {
        const abilityLoop = (tree) => {
          if(tree){
            tree.map((item) => {
              if (item.nodeType == 'ABILITYGROUP' || item.nodeType == 'BUTTON') {
                item.disabled = true
              }
              if (item.children && item.children.length) {
                abilityLoop(item.children)
              }
              if(item.nodeType=='ABILITY'){
                item.children=[];
              }
            })
            return tree;
          }else{
            return []
          }
        }
        console.log('abilityLoop(data.data.ability)=', abilityLoop(data.data.ability));
        yield put({
          type: "updateStates",
          payload: {
            abilitys: abilityLoop(data.data.ability)
          }
        })
        callback && callback();
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *recoverMenu({ payload }, { call, put, select }) {
      const { data } = yield call(apis.recoverMenu, payload, '', 'moduleResourceMg');
      if (data.code == 200) {
        const { currentNode } = yield select(state => state.moduleResourceMg)
          yield put({
            type: 'getMenu',
            payload: {
              registerId: currentNode.key
            }
          })
        message.success('恢复成功');
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取下载地址url
    *getDownFileUrl({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getDownFileUrl, payload, '', 'moduleResourceMg');
      if (data.code == REQUEST_SUCCESS) {

        yield put({
          type: 'updateStates',
          payload: {
            imageUrl: data.data.fileUrl
          },
        });
        callback&&callback();
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getSysCtlgTree({ payload ,callback}, { call, put, select }) {
      const { data } = yield call(apis.getSysCtlgTree, payload, '', 'moduleResourceMg');
      if (data.code == REQUEST_SUCCESS) {
          yield put({
              type: 'updateStates',
              payload: {
                  businessFormTree: data.data.list,

              },
          })
          callback&&callback()


      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
      }
    },
    // 根据业务应用类别ID查询业务表单
    *getBusinessForm({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getBusinessForm, payload, '', 'moduleResourceMg');
      console.log(data.data.list,'data.data.list');
      if (data.code == REQUEST_SUCCESS) {
          yield put({
              type: 'updateStates',
              payload: {
                  businessFormTable: data.data.list,
                  businessCurrentPage: data.data.currentPage,
                  businessReturnCount: data.data.returnCount,
                  // limit: payload.limit,
              }
          })
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
      }
    },
    //校验模块资源
    // *geCheckRule({payload,callback},{call,put,select}){
    //   const {data}=yield call(apis.geCheckRule,payload, '', 'moduleResourceMg')
    //   if(data.code==REQUEST_SUCCESS){
    //     callback&&callback(data.data)
    //   }else if (data.code != 401 && data.code != 419 && data.code !=403) {
    //       message.error(data.msg);
    //   }
    // },
    // *updateDeleteMenu({payload,callback},{call,put,select}){
    //   const {data}=yield call(apis.updateDeleteMenu,payload, '', 'moduleResourceMg')
    //   const { currentNode } = yield select(state => state.moduleResourceMg)
    //   if(data.code==REQUEST_SUCCESS){
    //     yield put({
    //       type: 'getMenu',
    //       payload: {
    //         registerId: currentNode.key
    //       }
    //     })
    //   }else if (data.code != 401 && data.code != 419 && data.code !=403) {
    //       message.error(data.msg);
    //   }
    // }

    //获取业务前台类型的注册系统
    *getRegister({payload},{call,put,select}){
      const {data}=yield call(getRegister,payload,'','moduleResourceMg')
      if (data.code == REQUEST_SUCCESS) {
        const  loop = (array)=>{
          for(var i=0;i<array.length;i++){
            array[i]['title'] = array[i]['registerName']
            array[i]['key'] = array[i]['id']
            array[i]['value'] = array[i]['id']
            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children)
            }
          }
          return array
        }
        yield put({
            type: 'updateStates',
            payload: {
              bussTreeData:loop(data.data.list)
            }
        })
      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
    },
    *getBussMenuList({payload},{call,put,select}){
      const {data}=yield call(getBussMenuList,payload,'','moduleResourceMg')
      if(data.code==REQUEST_SUCCESS){
        yield put({
          type: 'updateStates',
          payload:{
            bussMenuList:data.data.list,
            bussCurrentPage: data.data.currentPage,
            bussReturnCount: data.data.returnCount,
          }
        })
      }else if(data.code != 401 && data.code != 419 && data.code !=403){
        message.error(data.msg);
      }
    },
    *getMicMenuIds({payload,callback},{call,put}){
      const {data}=yield call(getMicMenuIds,payload,'','moduleResourceMg')
      if(data.code==REQUEST_SUCCESS){
        const newList=Boolean(data.data)?data.data.split(','):[]
        callback&&callback(newList)
      }else if(data.code != 401 && data.code != 419 && data.code !=403){
        message.error(data.msg);
      }
    },
    *getMobileBillingTag({payload,callback},{call,put}){
      const {data}=yield call(getMobileBillingTag,payload,'','moduleResourceMg')
      if(data.code==REQUEST_SUCCESS){
        yield put({
          type:'updateStates',
          payload:{
            mobileTag:data.data
          }
        })
      }else if(data.code != 401 && data.code != 419 && data.code !=403){
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
