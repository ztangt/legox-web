import {message} from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant'
import dataDrive from './components/dataDrive';


export default {
  namespace: 'dataDriven',
  state: {
    currentPage: 1,
    returnCount: 0,
    dataDrives: [],
    currentNode: {},
    treeData: [],
    oldTreeData: [],
    limit: 10,
    treeSearchWord:'',
    expandedKeys: [],
    autoExpandParent: true,
    driveType: 'PULL',
    planName: '',
    dataDrive: {
      pushColumnList: [],
    },
    dataDriveOther: {},
    refreshkey: 1,
    selectedRowKeys: [],
    sourceTableList: [],
    targetTableList: [],
    sourceTableListA: [],
    targetTableListA: [],
    sourceColumnList: [],
    targetColumnList: [],
    sourceColumntableScope: '',
    targetColumntableScope: '',
    pushTargetColList: [],
    pushSourceColList: [],
    fieldTree: [],
    seniorModal: false,
    sortList: [],
    sortVisible: false,
    selectedIndex: -1,
    selectedKeys: [],
    checkedKeys: [],
    targetDsDynamic: '',
    sourceDsDynamic: '',
    formKey:1,
    activeKey: "LIST",
    yearData: [],
    fieldCurrentPage: 1,
    leftNum:220,

  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      history.listen(location => {
       
      });
    }
  },
  effects: {
    *getBizSolTree({ payload,callback }, { call, put, select }) {
      try {
        let node = {};
        const  loop = (array)=>{
          for(var i=0;i<array.length;i++){
            array[i]['title'] = array[i]['nodeName']
            array[i]['key'] = array[i]['nodeId']
            array[i]['value'] = array[i]['nodeId']
            if(array[i]['nodeType']=='bizSol'&&_.isEmpty(node)){
                node = array[i]
            }else if(array[i]['nodeType']=='ctlg'){
              array[i]['disabled'] =  true
            }

            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children)
            }
          }
          return array
        }
        const {data} = yield call(apis.getBizSolTree, payload);
        const {limit,driveType,dataDrive} = yield select(state=>state.dataDriven)

        if(data.code==REQUEST_SUCCESS){
          let sourceTree = loop(data.data.list);
          if(driveType=='PULL'){
            dataDrive.targetModelId = node.nodeId
          }else{
            dataDrive.sourceModeId = node.nodeId
          }
          yield put({
            type: 'updateStates',
            payload:{
              treeData: sourceTree,
              oldTreeData: _.cloneDeep(sourceTree),
              currentNode: node,
              dataDrive

            }
          })
          //默认为第一个
          if(!_.isEmpty(node)){
            yield put({
              type:'getFormDataDrive',
              payload:{
                ctlgId:node.nodeId,
                start:1,
                limit:limit,
                planName:'',
                driveType,
              }
            })
          }
          callback&&callback();
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    
    *getBpmflagAndBasicflag({ payload,callback }, { call, put, select }) {
      try {
        const {dataDriveOther} = yield select(state=>state.dataDriven)
        const {data} = yield call(apis.getBpmflagAndBasicflag, payload);
        if(data.code==REQUEST_SUCCESS){
          dataDriveOther['bpmFlag'] = data.data?.bpmFlag
          dataDriveOther['basicDataFlag'] = data.data?.basicDataFlag
          dispatch({
            type: 'updateStates',
            payload:{
              dataDriveOther,
            }
          })
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getFormDataDrive({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(apis.getFormDataDrive, payload);
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload:{
              dataDrives: data.data.list,
              returnCount: data.data.returnCount,
              currentPage: data.data.currentPage
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
    *addDataDriver({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(apis.addDataDriver, payload);
        const {currentPage,currentNode,limit,driveType,planName} = yield select(state=>state.dataDriven)
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'getFormDataDrive',
            payload:{
              start: currentPage,
              limit,
              ctlgId:currentNode.key,
              driveType,
              planName,
            }
          })
          yield put({
            type: 'updateStates',
            payload:{
              addModal: false,
              selectedRowKeys:[],
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
    *updateDataDrive({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(apis.updateDataDrive, payload);
        const {currentPage,currentNode,limit,driveType,planName} = yield select(state=>state.dataDriven)
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'getFormDataDrive',
            payload:{
              start: currentPage,
              limit: limit,
              ctlgId:currentNode.key,
              planName,
              driveType,
            }
          })
          yield put({
            type: 'updateStates',
            payload:{
              addModal: false,
              selectedRowKeys: []
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
    *deleteDataDrive({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(apis.deleteDataDrive, payload);
        const {currentPage,currentNode,limit,driveType,planName} = yield select(state=>state.dataDriven)
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'getFormDataDrive',
            payload:{
              start: currentPage,
              limit: limit,
              ctlgId:currentNode.key,
              driveType,
              planName
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
    *getDataDriverById({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(apis.getDataDriverById, payload);
        const {currentPage,currentNode,limit} = yield select(state=>state.dataDriven)
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload:{
              dataDrive: data.data
            }
          })
          if(data.data.pushFormId){//获取来源应用下表数据
            yield put({
              type: 'getFormTableColumns',
              payload:{
                deployFormId: data.data.pushFormId
              },
              name: 'sourceTableList',
              dynamicName: 'sourceDsDynamic',
            })
          }
          if(data.data.targetFormId){//获取目标应用下表数据
            yield put({
              type: 'getFormTableColumns',
              payload:{
                deployFormId: data.data.targetFormId
              },
              name: 'targetTableList',
              dynamicName: 'targetDsDynamic',
            })
          }
          let pushColumnList = []
          let updateColumnList = []
          if(data.data.pushColJson){
            pushColumnList = JSON.parse(data.data.pushColJson)
            pushColumnList = pushColumnList.length!=0&&pushColumnList.map((item,index)=>{
              item.key = index
              return item
            })
          }
          if(data.data.writeColJson){
            updateColumnList = JSON.parse(data.data.writeColJson)
            updateColumnList = updateColumnList.length!=0&&updateColumnList.map((item,index)=>{
              item.key = index
              return item
            })
          }
          let tableColumnList = []
          let checkedKeys = [];
          if(data.data.columnJson){
            tableColumnList = JSON.parse(data.data.columnJson)
            tableColumnList = tableColumnList.length!=0&&tableColumnList.map((item,index)=>{
              item.key = index
              item.fieldName = item.columnName
              item.widthN = item.width&&item.width.split(',')[0]
              item.widthP = item.width&&item.width.split(',')[1]
              checkedKeys.push(item.columnCode)
              return item
            })
          }
          if (data.data.columnSort) {
            let columnListAfter = []
            let sortArr = data.data.columnSort.split(',')
            for (let i = 0; i < sortArr.length; i++) {
              for (let j = 0; j < tableColumnList.length; j++) {
                if (sortArr[i] ==  tableColumnList[j].columnCode ) {
                  columnListAfter.push(tableColumnList[j])
                } 
              }
          }
            tableColumnList = columnListAfter
          }

          // data.data['pushColumnList'] = pushColumnList;
          // data.data['tableColumnList'] = tableColumnList;

          yield put({
            type: 'updateStates',
            payload:{
              dataDrive: {
                ...data.data,
                pushColumnList,
                tableColumnList,
                updateColumnList,
                normalSearch: data.data.normalSearch?data.data.normalSearch.split(','):[]
              },
              checkedKeys,
              sortList: tableColumnList,
            }
          })
          callback&&callback();
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    *getFormTableColumns({ payload,callback,name,dynamicName }, { call, put, select }) {
      try {
        const {data} = yield call(apis.getFormTableColumns, payload);
        const {dataDrive,driveType} = yield select(state=>state.dataDriven)

        if(data.code==REQUEST_SUCCESS){
          if(data.data.tableList.length!=0){
            let initList = data.data.tableList.filter((item)=>{return item.tableScope=='MAIN'});
            yield put({
              type: 'updateStates',
              payload:{
                [name]: initList,
                [dynamicName]: data.data.tableList[0].dsDynamic,
                [`${name}A`]: data.data.tableList,
              }
            })
            if(driveType=='PUSH'&&dataDrive.isSplit==1){
              if(name=='sourceTableList'){
                let pushSourceTable = data.data.tableList.filter((item)=>{return item.formTableCode==dataDrive.pushSourceTableCode})
                let pushSourceColList = pushSourceTable&&pushSourceTable[0].columnList
                yield put({
                  type: 'updateStates',
                  payload:{
                    pushSourceColList
                  }
                })
                if (dataDrive.id) {
                  yield put({
                    type: 'updateStates',
                    payload:{
                      sourceTableList: pushSourceTable
                    }
                  })
                }
              }else{
                let pushTargetTable = data.data.tableList.filter((item)=>{return item.formTableCode==dataDrive.pushTargetTableCode})
                let pushTargetColList = pushTargetTable&&pushTargetTable[0].columnList
                yield put({
                  type: 'updateStates',
                  payload:{
                    pushTargetColList
                  }
                })
                if (dataDrive.id) {
                  yield put({
                    type: 'updateStates',
                    payload:{
                      targetTableList: pushTargetTable
                    }
                  })
                }
              }
            }
          }

          callback&&callback();
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //获取枚举类型的详细信息
    *getDictType({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getDictType, payload);
      if (data.code == REQUEST_SUCCESS) {
          const loop = (array) =>{
            for (let index = 0; index < array.length; index++) {
                if(array[index].children&&array[index].children.length==0){
                    delete array[index]['children']
                }else{
                    loop(array[index]['children']);
                }
            }
            return array
          }
          if(data.data&&data.data.length!=0){
              yield put({
                  type: 'updateStates',
                  payload: {
                      yearData: loop(data.data.list)
                  }
              })
          }else{
              yield put({
                  type: 'updateStates',
                  payload: {
                    yearData: []
                  }
              })
          }

      } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
      }

    },



  },
  reducers: {
    updateStates(state, action){
      return {
        ...state,
        ...action.payload
      }
    }
  },
};
