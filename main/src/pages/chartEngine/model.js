import { message } from 'antd';
import apis from 'api';
import {REQUEST_SUCCESS} from "@/service/constant";
const limit = 10;
export default {
  namespace: 'chartEngine',
  state: {
    pathname: '/chartEngine',
    searchWord: '',
    chartList: [],
    returnCount: 0,
    currentPage: 1,
    ctlgTree: [],
    oldCtlgTree: [],
    isShowAddModal: false,
    isShowImportModal: false,
    selectCtlgId: '',
    chartInfo: [],//修改的时候获取的数据
    processUseList: [],// 流程引擎复用列表

     // 使用公用upload组件 所需的全部初始数据（有的用不到，酌情删减）
     v: 1, //计数器
     isStop: true,  //暂停按钮的禁用
     isContinue: false, //继续按钮的禁用
     isCancel: false, //取消按钮的禁用
     index: 0, //fileChunkedList的下标，可用于计算上传进度
     merageFilepath: '',  //合并后的文件路径
     typeName: '', //层级
     limit:10,
     reuseReturnCount: 0,
     reuseCurrentPage: 1,
     reuseLimit:10,
      selectedNodeId:'',
      selectedDataIds:[],
      treeData:[],
      currentNode:[],
      expandedKeys:[],
      treeSearchWord:'',
      selectedDatas:[],
      originalData:[],
      selectNodeType:[],
      leftNum:220
     ///////////
  },
  subscriptions: {
  },
  effects: {
    //获取业务应用类别树
    *getCtlgTree({ payload,typeName, callback }, { call, put, select }) {
      const { data } = yield call(apis.getCtlgTree, payload);
      if (data.code == 200) {
        if(typeName=='reuse'){
           //默认为第一个
          yield put({
            type: "updateStates",
            payload: {
              reuseCtlgTree: data.data.list,
              reuseSelectId:data.data.list.length ? data.data.list[0].nodeId : '',
            }
          })
        }else{
           //默认为第一个
          yield put({
            type: "updateStates",
            payload: {
              ctlgTree: data.data.list,
              oldCtlgTree: _.cloneDeep(data.data.list),
              selectCtlgId: data.data.list.length ? data.data.list[0].nodeId : '',
            }
          })
        }

        callback && callback(data.data.list)
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //通过类别获取业务应用
    *getChartList({ payload }, { call, put, select }) {
      const { data } = yield call(apis.getChartList, payload);
      if (data.code == 200) {
        yield put({
          type: "updateStates",
          payload: {
            ...data.data,
            chartList: data.data.list
          }
        })
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //添加
    *addChart({ payload }, { call, put, select }) {
      const { data } = yield call(apis.saveChart, payload);
      if (data.code == 200) {
        const { searchWord, chartList, currentPage, selectCtlgId } = yield select(state => state.chartEngine);
        if (selectCtlgId == payload.ctlgId) {
          //获取列表
          yield put({
            type: "getChartList",
            payload: {
              ctlgId: payload.ctlgId,
              start: 1,
              limit: limit,
              searchWord: '',
            }
          })
        } else {
          yield put({
            type: "updateStates",
            payload: {
              selectCtlgId: payload.ctlgId
            }
          })
        }
        yield put({
          type: "updateStates",
          payload: {
            isShowAddModal: false,
            chartInfo: [],
            searchWord: '',
          }
        })
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //修改
    *updateChart({ payload }, { call, put, select }) {
      const { data } = yield call(apis.updateChart, payload);
      if (data.code == 200) {
        //重新获取
        const { searchWord, chartList, currentPage, selectCtlgId } = yield select(state => state.chartEngine);
        if (selectCtlgId == payload.ctlgId) {
          if (chartList.length == 1 && payload.chartName.indexOf(searchWord) == -1 && currentPage != 1) {
            //获取列表
            yield put({
              type: "getChartList",
              payload: {
                ctlgId: payload.ctlgId,
                start: currentPage - 1,
                limit: limit,
                searchWord: searchWord,
              }
            })
          } else {
            yield put({
              type: "getChartList",
              payload: {
                ctlgId: payload.ctlgId,
                start: currentPage,
                limit: limit,
                searchWord: searchWord
              }
            })
          }
        } else {
          yield put({
            type: "updateStates",
            payload: {
              selectCtlgId: payload.ctlgId
            }
          })
        }
        yield put({
          type: "updateStates",
          payload: {
            isShowAddModal: false,
            chartInfo: []
          }
        })
      } else if (data.code != 401 && data.code != 419 && data.code != 403) {
        message.error(data.msg);
      }
    },
    //删除
    *delChart({ payload }, { call, put, select }) {
      const { data } = yield call(apis.delChart, payload);
      if (data.code == 200) {
        //重新获取
        const { searchWord, chartList, currentPage, selectCtlgId } = yield select(state => state.chartEngine);
        if (chartList.length == 1 && currentPage != 1) {
          //获取列表
          yield put({
            type: "getChartList",
            payload: {
              ctlgId: selectCtlgId,
              start: currentPage - 1,
              limit: limit,
              searchWord: searchWord,
            }
          })
        } else {
          yield put({
            type: "getChartList",
            payload: {
              ctlgId: selectCtlgId,
              start: currentPage,
              limit: limit,
              searchWord: searchWord,
            }
          })
        }
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
        ...action.payload
      }
    }
  },
};
