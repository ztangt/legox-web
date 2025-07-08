
import apis from 'api';
import { message}  from 'antd'
export default {
  namespace: 'listMoudlePreview',
  state: {
    modelId: '',
    listMoudleInfo: {},
    checkedKeys: [],
    sortList: [],
    editorState: [],
    columnSort: '',
    seniorSearchList: [],
    seniorCheckedKeys: [],
    buttonGroupId: '',
    seniorTree: [],
    formKey: -1,
    buttons:[],
    yearData: [],
    offsetWidth: '',
  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      history.listen(location => {
      });
    }
  },
  effects: {
    *getFormListModelInfo({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(apis.getFormListModelInfo, payload);
        const { dsTree,buttonGroups } = yield select((state)=>state.moudleDesign)

        if(data.code==200){
          let offsetWidth = document.getElementById(`table_${data.data.modelId}`)?.offsetWidth
          let checkedKeys = [] //已选择的列数据
          let list = []
          if(data.data.columnList&&data.data.columnList.length!=0){
            for (let index = 0; index < data.data.columnList.length; index++) {
              const element = data.data.columnList[index];
              checkedKeys.push(element.columnCode)
              element.colCode = element.columnCode
              element.key = element.colCode
              element.title = element.colCode
              element.colName = element.columnName
              element.checked = true
              element.widthN = element.width&&element.width.split(',')[0]
              element.widthP = element.width&&element.width.split(',')[1]
              list.push(element)
            }
          }
          data.data.normalSearch = data.data.normalSearch?data.data.normalSearch.split(','):[]
          let columnSort = []
          dsTree.map((item)=>{
            if(item.dsId==data.data.dsId){
              data.data['dsName'] = item.dsName
            }
            columnSort.push(item.colCode)
          })
          data.data.seniorSearchInfo = data.data.seniorSearchInfo&&JSON.parse(data.data.seniorSearchInfo),
          data.data['sourceId'] = data.data.tableId?[`${data.data.dsId}-${data.data.dsDynamic}-${data.data.dsName}-${data.data.tableId}`]:[]
          let seniorCheckedKeys = data.data.seniorSearchInfo&&data.data.seniorSearchInfo.map((item)=>{
            return item.columnCode
          })
          buttonGroups&&buttonGroups.length!=0&&buttonGroups.map((item)=>{
            if(item.groupId==data.data.buttonGroupId){
              data.data.buttonGroupName =  item.groupName
            }
          })
          if(data.data.buttonGroupId){
            yield put({
              type:"getButtonIds",
              payload:{
                buttonGroupId: data.data.buttonGroupId
              }
            })
          }
          if(data.data.yearCutFlag==1){
            yield put({
              type:"getDictType",
              payload:{
                dictTypeCode: 'SYS_YEAR',
                showType: 'ALL',
                isTree:'1',
                searchWord:''
              }
            })
          }
          yield put({
            type:"updateStates",
            payload:{
              offsetWidth,
              listMoudleInfo: {
                ...data.data,
              },
              checkedKeys,
              sortList: data.data.columnList,
              editorState: data.data.titleStyle,
              outputHTML: data.data.titleStyle,
              columnSort: columnSort.toString(),
              seniorSearchList: data.data.seniorSearchInfo,
              seniorCheckedKeys,
              buttonGroupId: data.data.buttonGroupId,
              modelId: data.data.modelId,
              seniorTree: [{
                  key: data.data.tableId,
                  title: data.data.tableName,
                  dsDynamic: data.data.dsDynamic,
                  children: list,
                }]
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
    *getButtonIds({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(apis.getButtonIds, payload);
        if(data.code==200){
          yield put({
            type:"updateStates",
            payload:{
              buttons: data.data.list
            }
          })
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //获取枚举类型的详细信息
    *getDictType({ payload, callback }, { call, put, select }) {
      const { data } = yield call(apis.getDictType, payload);
      if (data.code == 200) {
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
