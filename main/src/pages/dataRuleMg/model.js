import {message} from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant'
import { parse } from 'query-string';
import { history } from 'umi'
const {  getDataRules, addDataRule, deleteDataRule, updateDataRule, 
          testSql, getTableColumns, setDataRule, getDataRuleInfo, getMenu,
          getMenuId, getRegister, getDepts, getOrgs, queryUser, uploadFileio,
          readFileContent } = apis;
export default {
  namespace: 'dataRuleMg',
  state: {
    dataRules: [],//数据规则列表
    returnCount: 0,
    modalVisible: false,//弹窗状态
    dataRule: {},//当前数据规则信息
    dataRuleIds: [],//复选的数据规则
    groups: [],
    groupNum: 1,//分组个数
    rdVisible: false,//规则定义弹窗
    mnVisible: false,//资源模块弹窗
    dataRuleInfo:{},//数据规则详情
    execResult: false,//sql测试结果
    columns: [],//表列信息
    menus: [],//模块资源信息
    metaData: [],//表集合
    registers:[],//注册系统列表
    registerId: '',//注册系统id
    expandedMenuKeys: [],//资源模块展开节点
    selectVisible: false,
    originalData: [], //中间列表数据
    requestType: 'orgName',
    middleData: [],
    rightData: [],
    middleSW: '',//中间搜索词
    currentKey: '',//当前修改属性值的key
    selectListType: 'list',//列表类型
    groupSql: '',//配置的Sql语句
    selectedGroup: [],//选择的组别
    lastKey: 1,//最后一个key值
    searchWord: '',
    limit: 0,
    currentPage:1,
    treeData: [],
    currentNode: {},
    expandedKeys: [],
    middleValue: [],
    middleValueName:[],
    selectedDatas:[],
    selectedDataIds:[],
    orgUserType:'',
    selectedNodeId:'',
    treeSearchWord:'',
    selectNodeType:'',
    dataRuleName:'',
    menuName:'',
    dataRuleTypeInfo:'1',
    isShowRelationModal:false,
    dataIdList:[],
    isView:false
    
  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      // history.listen(location => {
      //   if(history.location.pathname == '/dataRuleMg'){
      //     const query = parse(history.location.search);
      //     const { searchWord, currentPage, isInit, limit} = query
      //     if(isInit=='1'){
      //       dispatch({
      //         type: 'updateStates',
      //         payload:{
      //           dataRules: [],//数据规则列表
      //           returnCount: 0,
      //           modalVisible: false,//弹窗状态
      //           dataRule: {},//当前数据规则信息
      //           dataRuleIds: [],
      //         }
      //       })
      //     }
          
      //   }
      // });
    }
  },
  effects: {
    
    *getDataRules({ payload }, { call, put, select }) {
      try {
        const {data} = yield call(getDataRules, payload);
      
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload:{
              dataRules: data.data.list,
              returnCount: data.data.returnCount,
            }
          })
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }

    },
    *updateDataRule({ payload }, { call, put, select }) {

      try {
        const {data} = yield call(updateDataRule, payload);
        const {currentPage,searchWord,limit} = yield select(state=>state.dataRuleMg)
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'getDataRules',
            payload:{
              start: currentPage,
              limit,
              searchValue: searchWord
            }
          })
          yield put({
            type: 'updateStates',
            payload:{
              modalVisible: false
            }
          })
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }

    },
    *addDataRule({ payload }, { call, put, select }) {
      try {
        const {data} = yield call(addDataRule, payload);
        const { searchObj } = yield select(state=>state.layoutG)
        const {currentPage,limit} = yield select(state=>state.dataRuleMg)
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload:{
              // currentPage: 1,
              // limit: 10,
              searchWord: '',
            }
          })
          yield put({
            type: 'getDataRules',
            payload:{
              start: currentPage,
              limit: limit,
            }
          })
          yield put({
            type: 'updateStates',
            payload:{
              modalVisible: false
            }
          })
          
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *deleteDataRule({ payload, callback}, { call, put, select }) {
      try {
        const {data} = yield call(deleteDataRule, payload);
        const {currentPage,searchWord,limit} = yield select(state=>state.dataRuleMg)
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'getDataRules',
            payload:{
              start: currentPage,
              searchValue: searchWord,
              limit,
            }
          })
          callback&&callback();
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getDataRuleInfo({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getDataRuleInfo, payload);
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload:{
              dataRuleInfo: data.data,
              registerId: data.data.registerId,
              groupSql: data.data.execSql?data.data.execSql:''
            }
          })
          callback&&callback(data.data)
          if(data.data.searchJson){
            yield put({
              type: 'readFileContent',
              payload:{
                fileStorageId: data.data.searchJson
              }
            })
          }else{
            yield put({
              type: 'updateStates',
              payload:{
                groups: []
              }
            })
          }
          
          if(data.data.dataRuleType=='MODULE'){//如果是模块资源
            yield put({
              type: 'getRegister',
              payload:{
                start: 1,
                limit: 1000,
              }
            })
            if(data.data.menuId){
              yield put({
                type: 'getMenuId',
                payload:{
                  menuId: data.data.menuId
                },
              })
            }
            
          }
              
          yield put({
            type: 'updateStates',
            payload:{
              rdVisible: true,
            }
          })
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    *testSql({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(testSql, payload);
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload:{
              execResult: data.data.execResult
            }
          })
          console.log(data.data.execResult,'data.data.execResult');
          callback&&callback(data.data.execResult);
          if(data.data.execResult){
            message.success('校验成功')
          }else{
            message.error('校验失败')
          }
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },   
    *getTableColumns({ payload,serviceName }, { call, put, select }) {
      try {
        const {data} = yield call(getTableColumns, payload,'','dataRuleMg',serviceName);
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload:{
              columns: data.data.columns
            }
          })
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getMenu({ payload }, { call, put, select }) {
      
      try {
        const {data} = yield call(getMenu, {...payload});
        const  loop = (array)=>{
          for(var i=0;i<array.length;i++){
            array[i]['title'] = array[i]['menuName']
            array[i]['key'] = array[i]['id']
            array[i]['value'] = array[i]['id']
            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children)
            }
          }
          return array
        }
        if(data.code==REQUEST_SUCCESS){
          function loopTree(data){
            return data.filter(item=>{
                let f = false;
                if(item.children){
                    item.children = loopTree(item.children)
                    if(item.children.length > 0){
                        f = true
                    }
                }
                return item.isDatarule==1 || f
            })
        }
         let sourceTree = loop(data.data.jsonResult.list);
          yield put({
            type: 'updateStates',
            payload:{
              menus: loopTree(sourceTree) 
            }
          })
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getMenuId({ payload }, { call, put, select }) {
      try {
        const {data} = yield call(getMenuId, payload);
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload:{
              metaData: data.data.metaData&&data.data.metaData.split(','),
              menuName:data.data.menuName,
              registerId:data.data.registerId
            }
          })
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    *setDataRule({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(setDataRule, payload);
        const {currentPage,searchWord,limit} = yield select(state=>state.dataRuleMg)
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'getDataRules',
            payload:{
              start: currentPage,
              limit,
              searchValue: searchWord
            }
          })
          callback&&callback()
          // yield put({
          //   type: 'updateStates',
          //   payload:{
          //     rdVisible: false
          //   }
          // })
          
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getRegister({ payload }, { call, put, select }) {
      try {
        const {data} = yield call(getRegister, payload);
        if(data.code==REQUEST_SUCCESS){
         
          yield put({
            type: 'updateStates',
            payload:{
              registers: data.data.list,
              registerId: data.data.list.length!=0&&data.data.list[0].id
            }
          })
          
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getDepts({ payload }, { call, put, select }) {
      try {
        const {data} = yield call(getDepts, payload);        
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload:{
              middleData: data.data.list,
            }
          })
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getOrgs({ payload }, { call, put, select }) {
      try {
        const {data} = yield call(getOrgs, payload);
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload:{
              middleData: data.data.list,
            }
          })
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *queryUser({ payload }, { call, put, select }) {
      try {
        const {data} = yield call(queryUser, payload);
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload:{
              middleData: data.data.list,
            }
          })
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *uploadFileio({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(uploadFileio, payload);
        if(data.code==REQUEST_SUCCESS){
          callback&&callback(data);
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *readFileContent({ payload }, { call, put, select }) {
      try {
        const {data} = yield call(readFileContent, payload);
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload:{
              groups: data.data?JSON.parse(data.data):[]
            }
          })
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
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
    updateStates(state, action){
      console.log('action.payload',action.payload);
      return {
        ...state,
        ...action.payload
      }
    }
  },
};
