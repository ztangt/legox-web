import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';
const {getBpmnXml,postChoreography,getSubProcessTableList,saveSubProcessUserArrange,
  getOrgTree,getApplyModelTree,getApplyModelList,getUgs} = apis

export default {
    namespace: 'subProcessArrangeSpace',
    state: {
        newFlowImg: '',
        subProcessList: [], // 子流程集合
        targetKeys: [], // 选中后target
        bizSolId: '',
        formDeployId: '',
        procDefId: '',
        nodeUser: [], // 获取办理人列表
        getSubProcessHandleList: [],
        getSubProcessReaderList: [], // 获取阅办人列表
        pearsonActionType: '0', // 多人单人分类
        selectedDataIds:[],
        orgUserType: '',
        flowTreeModal: false,
        selectedDatas:[],
        nodeUserType:'',
        NodeBaseObj: {},
        treeData: [],
        expandedKeys: [],
        checkedKeys: [],
        selectNodeId: '', 
        currentNode:{} ,
        originalData:[],
        oldOriginalData: [],
        selectedNodeId: '',
        treeSearchWord:'',
        selectNodeType:'',
        actives: '1',
        changeStatus: false,
        mainPageTreeData: [], // 进入页面左侧树
        mainPageCurrentNode: {},// 进入页面左侧树选中
        iTreeData: [], // 模型树数据
        iTreeSelectedId: '', // 选中selectedId
        limit: 10,
        start: 1,
        returnCount: 0,
        businessList: [],// 应用建模列表
        applySelectedRowKeys: [], // applyModel选中
        userGList:[],
        searchData: []
    },
    subscriptions: {
    },
    effects: {
      // 获取左侧树
      *getOrgTree({ payload,callback }, { call, put, select }){
         const {data} = yield call(getOrgTree,payload,'','subProcessArrangeSpace')
         const { mainPageTreeData } = yield select(state => state.subProcessArrangeSpace)
         const loop = (array, children, org) => {
          for (var i = 0; i < array.length; i++) {
              // array[i]['title'] = `${NODE_TYPE[array[i]['nodeType']]}-${array[i]['nodeName']}`
              // console.log(array[i],'array[i]');
              if (array[i].id) {
                  array[i]['title'] = `${array[i]['orgName']}`;
                  array[i]['key'] = array[i]['id'];
                  array[i]['value'] = array[i]['id'];
                  if (payload.parentId == array[i]['id']) {
                      array[i]['children'] = children;
                  }

                  if (org && array[i]['nodeType'] == 'DEPT') {
                      //如果是部门取父级单位
                      array[i]['orgName'] = org.nodeName;
                      array[i]['orgId'] = org.nodeId;
                      // array[i]['icon'] = <ApartmentOutlined />
                  } else {
                      // array[i]['icon'] = <BankOutlined />
                  }
              }

              if (array[i].children && array[i].children.length != 0) {
                  loop(array[i].children, children, array[i].orgKind == 'ORG' ? array[i] : org);
              } else {
                  if (array[i].isParent == 1 && !payload.searchWord) {
                      array[i]['children'] = [{ key: '-1' }];
                  }
                  // else{
                  //   array[i]['isLeaf'] = true
                  // }
              }
          }
          return array;
        }; 
         if(data.code ==REQUEST_SUCCESS){
            let sourceTree = mainPageTreeData
            if(data.data.length !=0){
              // 判断初次进入
              if ((sourceTree && sourceTree.length == 0) || !payload.parentId) {
                sourceTree = data.data.list;
              }
              sourceTree = loop(sourceTree,data.data.list)
              yield put({
                type:'updateStates',
                payload: {
                  mainPageTreeData: sourceTree,
                  searchData: sourceTree
                }
              })
              console.log("sourceTree",sourceTree)
              callback&&callback(sourceTree)
            }          

         }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }

      },
      // 用户组 
      *getUgs({ payload,callback }, { call, put, select }) {
        try {
            const { data } = yield call(apis.getUgs, payload,'','subProcessArrangeSpace');
            if (data.code == 200) {
                let list = data.data.list;
                for(let i = 0;i<list.length;i++){
                    list[i]['nodeName'] = list[i]['ugName'];
                    list[i]['nodeId'] = list[i]['id'];
                }
                yield put({
                    type: 'updateStates',
                    payload: {
                      userGList: list
                    }
                })
                callback&&callback();
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        } catch (e) {
        } finally {
        }
  
    },  
      
      // 获取应用建模列表
      *getApplyModelList({ payload,callback }, { call, put, select }){
        const {data} = yield call(getApplyModelList,payload,'','subProcessArrangeSpace')
        if(data.code == REQUEST_SUCCESS){
          const businessList = data&&data.data&&data.data.list&&data.data.list.map((item,index)=>{
            item.number = index+1
            return item
          })||[]
            yield put({
              type: 'updateStates',
              payload: {
                start: data.data.currentPage,
                businessList,
                returnCount: data.data.returnCount,
              }
            })
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      },
      // 获取应用模型树
      *getApplyModelTree({ payload,callback }, { call, put, select }){
        const {data} = yield call(getApplyModelTree,payload,'','subProcessArrangeSpace')
        if(data.code == REQUEST_SUCCESS){
            yield put({
              type: 'updateStates',
              payload:{ 
                iTreeData: data.data.list
              }
            })
          
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      },
      // 保存子流程用户编排
      *saveSubProcessUserArrange({ payload,callback }, { call, put, select }){
          const {data} = yield call(saveSubProcessUserArrange,payload,'','subProcessArrangeSpace')
          if(data.code == REQUEST_SUCCESS){
            callback&&callback(data)
          }else if (data.code != 401 && data.code != 419 && data.code !=403) {
            message.error(data.msg);
          }
      },  
      // 获取子流程節點設置
      *getSubProcessTableList({ payload,callback }, { call, put, select }){
        const {data} = yield call(getSubProcessTableList,payload,'','subProcessArrangeSpace')
        if(data.code == REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload: {
              getSubProcessHandleList: data.data.handler,
              getSubProcessReaderList: data.data.reader,
              nodeUser: data.data,
              pearsonActionType: data.data.dealStrategy //执行类型
            }
          })

        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
            message.error(data.msg);
        }
      },
      // 保存流程编排配置
      *postChoreography({ payload,callback }, { call, put, select }){
        const {data} = yield call(postChoreography,payload,'','subProcessArrangeSpace')
        console.log("getData",data)
        if(data.code == REQUEST_SUCCESS){
          callback&&callback(data)
          const targetKeys = data.data.choreographyList&&data.data.choreographyList.map(item=>item.actId)||[]
          yield put({
            type: 'updateStates',
            payload: {
              targetKeys,
              choreographyList: data.data.choreographyList||[]
            }
          })

        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
            message.error(data.msg);
        }
      },
      // 获取流程编排
      *getBpmnXml({ payload,callback }, { call, put, select }){
        const {data} = yield call(getBpmnXml,payload,'','subProcessArrangeSpace')
        if(data.code == REQUEST_SUCCESS){
          const subProcess = data.data.subProcessList&&data.data.subProcessList.map(item=>{
            item.choreographyList&&item.choreographyList.map((element,index)=>{
              element.number = index+1
              return element
            })||[]
            return item||[]
          })
            yield put({
                type: 'updateStates',
                payload: {
                    newFlowImg: data.data.xmlStr,
                    subProcessList: subProcess,
                    bizSolId: data.data.bizSolId,
                    formDeployId: data.data.formDeployId,
                    procDefId: data.data.procDefId
                }
            })
            callback&&callback()

        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
            message.error(data.msg);
        }
      }
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