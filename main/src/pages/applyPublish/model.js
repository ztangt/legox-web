import { message } from 'antd';
import apis from 'api';
const limit = 10;
export default {
    namespace: 'applyPublish',
    state: {
        searchWord: '',
        businessList: [],
        returnCount: 0,
        currentPage: 1,
        ctlgTree: [],
        oldCtlgTree: [],
        isShowAddModal: false,
        isShowImportModal: false,
        selectRegisterId: '',
        limit: 10,
        isShowPublish:false,
        operationType:'',
        abilityGroupTreeSys:[],
        abilityGroupTreeBuss:[],
        abilityGroupTreeMic:[],
        newTreeData:[],
        selectAgInfo:[],
        treeData:[],
        selectedKeys:[],
        params:{
          sys:{
            isEnable:'',
            nodeType:'ABILITYGROUP',
            serviceApplication:'PLATFORM_SYS'
          },
          buss:{
            isEnable:'',
            nodeType:'ABILITYGROUP',
            serviceApplication:'PLATFORM_BUSS'
          },
          mic:{
            isEnable:'',
            nodeType:'ABILITYGROUP',
            serviceApplication:'PLATFORM_MIC'
          }
        },
        isShowAbilityRelease:false,
        selectedRowKeys:[],
        selectedRows:[],
        isShowAbilityModal:false,
        releaseBizList:[],
        abilityList:[],//能力列表
        abilityLimit:10,
        abilityReturnCount:0,
        abilityCurrentPage:1,
        isShowPublishRecord:false,
        recordList:[],//发布记录
        recordCount:0,
        platType:'',//平台类型
        registerList:[],
        menuList:[],
        leftNum:220
    },
    subscriptions: {

    },
    effects: {
      //获取注册系统列表
    *getRegister({ payload,callback }, { call, put, select }) {
      const {data} = yield call(apis.getRegister, payload);
      if(data.code==200){
        yield put({
          type:"updateStates",
          payload:{
            registerList:data.data.list.filter(item=>item.createUserId=='1')//只展示初始注册系统
          }
        })
        // callback(data.data.list)
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getMenu({ payload, callback }, { call, put, select }) {
      function filterByIdNotEqualOne(items) {  
        return items.reduce((acc, item) => {  
          if (item.menuSource !== 'OWN') {  
            // 如果当前项的id不等于1，则将其加入结果数组  
             console.log(item, 12)
              if (item.children) {  
            // 如果当前项的id等于1，但它有children，则递归处理children  
            const filteredChildren = filterByIdNotEqualOne(item.children);  
            if (filteredChildren.length > 0) {  
              // 只有当children中有符合条件的项时，才将当前项（更新children后）加入结果数组  
                console.log(item, 123, filteredChildren)
               acc.push({ ...item,
                title: item.menuName,
                key: item.id,
                value: item.id,
                 children: filteredChildren });
            }  
            } else {
              acc.push({ ...item,
                title: item.menuName,
                key: item.id,
                value: item.id,
               }); // 使用展开语法来复制对象，避免直接修改原对象  
           }  
          } else {
              if (item.children) {
                  const filteredChildren = filterByIdNotEqualOne(item.children);  
                  [...filteredChildren].map(i => acc.push({
                    ...i,
                    title: i.menuName,
                    key: i.id,
                    value: i.id,
                  }))
              }
          }
          return acc;  
            console.log(acc)
        }, []); // 初始结果数组为空  
      }  
      const loop = (array) => {
        const newArray = [];
        for (let i = 0; i < array.length; i++) {
          if (array[i].menuSource !== 'OWN') {
            newArray.push({
              ...array[i],
              title: array[i].menuName,
              key: array[i].id,
              value: array[i].id
            });    
            if (array[i].children && array[i].children.length !== 0) {
              newArray[newArray.length - 1].children = loop(array[i].children);
            }
          }else if(array[i].children&&array[i].children.length){
            loop(array[i].children);
          }
        }
        return newArray;
      }
        const { data } = yield call(apis.getMenu, payload, '', 'applyPublish');
        if (data.code == 200) {
          let sourceTree = data.data.jsonResult.list;
          sourceTree = filterByIdNotEqualOne(sourceTree);
          sourceTree.forEach((item)=>{//对于父级是授权能力的 更改父id
            if(item.children&&item.children.length){
              item.children.forEach(val=>{
                val.menuParentId=item.id
              })
            }
          })
            yield put({
              type: 'updateStates',
              payload: {
                menuList: sourceTree
              }
            })
          callback && callback(sourceTree);
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
    },
        //获取业务应用类别树
        *getCtlgTree({ payload, typeName, callback }, { call, put, select }) {
            const { data } = yield call(apis.getCtlgTree, payload);
            if (data.code == 200) {
                //默认为第一个
                yield put({
                    type: "updateStates",
                    payload: {
                        ctlgTree: data.data.list,
                        oldCtlgTree: _.cloneDeep(data.data.list),
                        selectRegisterId: data.data.list.length ? data.data.list[0].nodeId : '',
                    }
                })

                callback && callback(data.data.list)
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
        //通过类别获取业务应用
        *getPublishList({ payload }, { call, put, select }) {
            const { data } = yield call(apis.getPublishList, payload);
            if (data.code == 200) {
                yield put({
                    type: "updateStates",
                    payload: {
                        ...data.data,
                        businessList: data.data.list
                    }
                })
            } else if (data.code != 401 && data.code != 419 && data.code != 403) {
                message.error(data.msg);
            }
        },
            //树
    *getAbilityGroupTree({payload}, { call, put,select }) {
        const {data} = yield call(apis.getServiceTree, payload,'getAbilityGroupTree');
        const loopTree=(data)=>{
          data.forEach(item=>{
            item.key=item.nodeId
            item.title=item.nodeName
            if(item.children&&item.children.length>0){
              loopTree(item.children)
            }
          })
          return data
        }
        if(data.code==200){
          if(payload.serviceApplication=='PLATFORM_SYS'){
            yield put({
              type:'updateStates',
              payload:{
                abilityGroupTreeSys:loopTree(data.data.list)
              }
            })
          }else if(payload.serviceApplication=='PLATFORM_BUSS'){
            yield put({
              type:'updateStates',
              payload:{
                abilityGroupTreeBuss:loopTree(data.data.list)
              }
            })
          }else{
            yield put({
              type:'updateStates',
              payload:{
                abilityGroupTreeMic:loopTree(data.data.list)
              }
            })
          }
        }else if(data.code != 401 && data.code != 419 && data.code != 403){
          message.error(data.msg);
        }
      },
      *getAbilityList({payload,callback}, { call, put,select }){
        const { data } = yield call(apis.getAbilityList, payload);
        if (data.code == 200) {
            console.log(data,'data==');
            yield put({
              type:'updateStates',
              payload:{
                abilityList:data.data.list,
                abilityCurrentPage:data.data.currentPage,
                abilityReturnCount:data.data.returnCount
              }
            })
            callback&&callback()
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
            message.error(data.msg);
        }
      },
      //发布
      *releaseBizToAbility({payload,callback},{call,put,select}){
        const { data } = yield call(apis.releaseBizToAbility, payload);
        const {selectedKeys,releaseBizList,selectedRows,selectedRowKeys}=yield select(state=>state.applyPublish)
        if (data.code == 200) {
            // message.success('发布成功')
          callback&&callback()


        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
            message.error(data.msg);
        }
      },
      //排序
      *updateAbilitySort({payload,callback}, { call, put,select }){
        const {data}=yield call(apis.updateAbilitySort,payload)
        if(data.code==200){
          //重新获取列表
          const {selectedKeys,releaseBizList,selectedRows,abilityCurrentPage,abilityLimit,selectedRowKeys,platType}=yield select(state=>state.applyPublish)
          yield put({
            type:'getAbilityList',
            payload:{
              agId:selectedKeys[0],
              menuIds:selectedRowKeys.join(','),
              abilityName:'',
              start:abilityCurrentPage,
              limit:abilityLimit,
              registerType:platType
            }
          })
        }else if(data.code != 401 && data.code != 419 && data.code != 403){
          message.error(data.msg)
        }
      },
      //获取已发布应用所属能力组
      *getPublishTreeList({payload,callback}, { call, put,select }){
        const {data}=yield call(apis.getPublishTreeList,payload)
        const loopTree=(list)=>{
          list.forEach((item)=>{
            item.key=item.nodeId
            item.title=item.nodeName
            if(item.children&&item.children.length>0){
              loopTree(item.children)
            }
          })
          return list
        }
        if(data.code==200){
          console.log(data,'data==');
          data.data.list.forEach(item=>{
            item.key=item.nodeId
            item.title=item.nodeName
          })
          yield put({
            type:'updateStates',
            payload:{
              treeData:loopTree(data.data.list),
              newTreeData:loopTree(data.data.list)
            }
          })
  
        }else if(data.code != 401 && data.code != 419 && data.code != 403){
          message.error(data.msg)
        }
      },
      //更新
      *updateBizAbility({payload,callback}, { call, put,select }){
        const {data}=yield call(apis.updateBizAbility,payload)
        if(data.code==200){
          message.success('更新成功')
  
        }else if(data.code != 401 && data.code != 419 && data.code != 403){
          message.error(data.msg)
        }
      },
      //获取发布记录
      *getPublishRecordList({payload,callback}, { call, put,select }){
        const {data}=yield call(apis.getPublishRecordList,payload)
        if(data.code==200){
          yield put({
            type:'updateStates',
            payload:{
              recordList:data.data.list,
              recordCount:data.data.returnCount
            }
          })
          callback&&callback(data.data.list)
        }else if(data.code != 401 && data.code != 419 && data.code != 403){
          message.error(data.msg)
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