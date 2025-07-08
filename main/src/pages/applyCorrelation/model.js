import { message } from 'antd'
import apis from 'api';
export default {
    namespace: 'applyCorrelation',
    state: {
        allPage: 0,
        currentPage: 0,
        returnCount: 0,
        list: [],//列表数据
        selectedRowKeys: [],
        limit: 0,
        searchWord: '',
        detailData: {},//详细信息
        isShow: false,
        isApply: false,
        ctlgTree: [],
        ctlgId: '',
        businessList:[],
        applyCurrentPage:0,
        applyReturnCount:0,
        applyLimit:10,
        selectBusiness: [],
        selectBusinessRows: [],
        isShowConfig:false,//配置详情
        lastKey: 1,//最后一个key值
        tableData:[],
        groupNum: 1,//分组个数
        configData:{},
        relationList:[],//关联应用列表
        copyRelationList:[],
        mainName:'',
        mainAndSub:[],
        relationName:'',
        mainList:[],
        // basicData:[],//基础数据码表数据
        relationData:[],
        attributeData:[],
        labelData:[],
        detailConfigList:[],
        relationArray:[],
        relationLogicList:[],//关联应用列表
        totalData:[
        {   relationBizSolId:'',
            relationBizSolName: '',
            relationLogicCode: '',
            relationLogicName: '',
            tableData:
            [
                {
                    "key": 1,
                    "groupName": 1,
                    "mainBizTable": "",
                    "mainBizField": "",
                    "bizTableScope":'',
                    "mainRelationTable": "",
                    "mainRelationField": null,
                    "incidenceRelation": "",
                    "relationTableScope":"",
                    "bizAttribute": "",
                    "bizInject": "",
                    "bizLabel": null,
                    "conditionNum": 1,
                    "isRowCol": true,
                },
            ]
        },
    ]
    },
    subscriptions: {
        setup({ dispatch, history }, { call, select }) {
            history.listen(location => {
                // if (history.location.pathname === '/applyCorrelation') {
                //     dispatch({
                //         type: 'updateStates',
                //         payload: {
                //             pathname: history.location.pathname
                //         }
                //     })
                // }
            });
        }
    },
    effects: {
        *getApplyCorrelationList({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.getApplyCorrelationList, payload)
                console.log(data, 'data==');
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            ...data.data
                        }
                    })
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg, 5)
                }
            } catch (e) {

            } finally { }
        },
        *getRelationLogicList({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.getApplyCorrelationList,payload)
                if(data.code==200){
                    yield put({
                        type: 'updateStates',
                        payload: {
                            relationLogicList:data.data.list
                        }
                    })
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg, 5)
                }
            }catch(e){

            }finally{}
        },
        //删除
        *deleteApplyCorrelation({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(apis.deleteApplyCorrelation, payload)
                const { searchWord, limit, currentPage, list } = yield select(state => state.applyCorrelation)
                if (data.code == 200) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            selectedRowKeys: []
                        }
                    })
                    if (list.length == payload.logicIds.split(',').length && currentPage != 1) {
                        yield put({
                            type: 'getApplyCorrelationList',
                            payload: {
                                start: currentPage - 1,
                                limit,
                                searchWord
                            },
                        });
                    } else {
                        yield put({
                            type: 'getApplyCorrelationList',
                            payload: {
                                start: currentPage,
                                limit,
                                searchWord
                            },
                        });
                    }
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg, 5)
                }
            } catch (e) {
                console.log(e);
            } finally { }
        },
        //导出
        *exportApplyCorrelation({ payload, callback }, { call, put, select }) {
          try {
            const { data } = yield call(apis.exportApplyCorrelation, payload)
            if (data.code == 200) {
              window.location.href = data.data
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
              message.error(data.msg);
            }
          }catch (e) {
            console.log(e);
          } finally { }
        },
        //获取逻辑编码
        // *getLogicCode({ payload, callback }, { call, put, select }) {
        //     try {
        //         const { data } = yield call(apis.getLogicCode)
        //         if (data.code == 200) {
        //             callback && callback(data.data)
        //         } else if (data.code != 401 && data.code != 419 && data.code !=403) {
        //             message.error(data.msg, 5)
        //         }
        //     } catch (e) {
        //         console.log(e);
        //     } finally { }
        // },
        //获取业务应用类别树
        *getCtlgTree({ payload, callback }, { call, put, select }) {
            const { data } = yield call(apis.getCtlgTree, payload);
            if (data.code == 200) {
                yield put({
                    type: "updateStates",
                    payload: {
                        ctlgTree: data.data.list,
                    }
                })
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        //通过类别获取业务应用
        *getBusinessList({ payload }, { call, put, select }) {
            const { data } = yield call(apis.getBusinessList, payload);
            if (data.code == 200) {
                yield put({
                    type: "updateStates",
                    payload: {
                        businessList: data.data.list,
                        applyCurrentPage: data.data.currentPage,
                        applyReturnCount: data.data.returnCount,
                    }
                })
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        //新增
        *addApplyCorrelation({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.addApplyCorrelation,payload)
                const {currentPage,limit,searchWord}=yield select(state=>state.applyCorrelation)
                if(data.code==200){
                    yield put({
                        type:'getApplyCorrelationList',
                        payload:{
                            limit,
                            start:currentPage,
                            searchWord
                        }
                    })
                }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            }catch(e){
                console.log(e);
            }finally{}
        },
        //修改
        *updateApplyCorrelation({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.updateApplyCorrelation,payload)
                const {currentPage,limit,searchWord}=yield select(state=>state.applyCorrelation)
                if(data.code==200){
                    yield put({
                        type:'getApplyCorrelationList',
                        payload:{
                            limit,
                            start:currentPage,
                            searchWord
                        }
                    })
                }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
            }catch(e){
                console.log(e);
            }finally{}
        },
        //根据bizSolId获取关联的应用集合
        // *getRelationApply({payload,callback},{call,put,select}){
        //     try{
        //         const {data}=yield call(apis.getRelationApply,payload)
        //         if(data.code==200){
        //             let newArr = data.data.list.reduce((pre, cur) => {
        //                 if (!pre.some(item => item.bizSolId == cur.bizSolId)) {
        //                     pre.push(cur)
        //                 }
        //                 return pre
        //             }, [])
        //             console.log(newArr,'newArr');
        //             yield put({
        //                 type:'updateStates',
        //                 payload:{
        //                     relationList:newArr,
        //                     copyRelationList:newArr,
        //                 }
        //             })
        //         }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        //             message.error(data.msg)
        //         }
        //     }catch(e){
        //         console.log(e);
        //     }finally{

        //     }
        // },
        //根据业务应用id获取表单的所有表信息
        *getFormMenu({payload,callback},{call,put,select}){
            const type=payload.type
            delete payload.type
            try{
                const {data}=yield call(apis.getFormMenu,payload)
                if(data.code==200){
                     const options = [];
                        for (let i = 0; i < data.data?.MAIN?.split(',').length; i++) {
                            const item=data.data?.MAIN?.split(',')[i]
                        options.push({
                            value:item,
                            label:item,
                            code:'MAIN'
                        });
                        }
                        for (let i = 0; i < data.data?.SUB?.split(',').length; i++) {
                            const val=data.data?.SUB?.split(',')[i]
                            if(val){
                                options.push({
                                value:val,
                                label:val,
                                code:'SUB'
                             });
                            }

                            }
                    console.log(data,'data===');
                    if(type=='main'){
                        // const newData=data.data.MAIN?data.data.MAIN.split(','):[].concat(data.data.SUB?data.data.SUB.split(','):[])
                        // const options = [];
                        // for (let i = 0; i < newData.length; i++) {
                        // options.push({
                        //     value:newData[i],
                        //     label:newData[i],
                        // });
                        // }
                        // console.log(options,'options');
                        yield put({
                            type:'updateStates',
                            payload:{
                                mainName:data.data,
                                mainAndSub:options
                            }
                        })
                    }else{
                        yield put({
                            type:'updateStates',
                            payload:{
                                relationName:data.data,
                                relationArray:options
                            }
                        })
                    }
                }else if(data.code!==401){
                    message.error(data.msg)
                }
            }catch(e){
                console.log(e);
            }finally{}
        },
        //获取主应用字段列表
        *getApplyFieldsList({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.getApplyFieldsList,payload)
                if(data.code==200){
                    const options = [];
                        for (let i = 0; i < data.data.columns.length; i++) {
                        options.push({
                            value:data.data.columns[i].tableColumn,
                            label:data.data.columns[i].tableColumn,
                        });
                        }
                    yield put({
                        type:'updateStates',
                        payload:{
                            mainList:options
                        }
                    })
                }else if(data.code!==401){
                    message.error(data.msg)
                }
            }catch(e){
                console.log(e);
            }finally{}
        },
        //获取码表数据
        *getDictType({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.getDictType,payload)
                if(data.code==200){
                    // yield put({
                    //     type:'updateStates',
                    //     payload:{
                    //         basicData:data.data.list
                    //     }
                    // })
                    callback&&callback(data.data.list)
                }else if(data.code!==401){
                    message.error(data.msg)
                }
            }catch(e){
                console.log(e);
            }finally{}
        },
        //保存配置
        *saveConfig({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.saveConfig,payload)
                if(data.code==200){
                    // yield put({
                    //     type:'updateStates',
                    //     payload:{
                    //         isShowConfig:false,
                    //         relationName:[],
                    //         relationArray:[],
                    //         mainList:[],
                    //         totalData:[
                    //             {   relationBizSolId:'',
                    //                 relationBizSolName: '',
                    //                 tableData:
                    //                 [
                    //                     {
                    //                         "key": 1,
                    //                         "groupName": 1,
                    //                         "mainBizTable": "",
                    //                         "mainBizField": "",
                    //                         "bizTableScope":'',
                    //                         "mainRelationTable": "",
                    //                         "mainRelationField": null,
                    //                         "incidenceRelation": "",
                    //                         "relationTableScope":"",
                    //                         "bizAttribute": "",
                    //                         "bizInject": "",
                    //                         "bizLabel": null,
                    //                         "conditionNum": 1,
                    //                         "isRowCol": true,
                    //                     },
                    //                 ]
                    //             },
                    //         ]
                    //     }
                    // })
                }else if(data.code!==401){
                    message.error(data.msg)
                }
            }catch(e){
                console.log(e);
            }finally{}
        },
        //获取配置详情
        *getDetailConfig({payload,callback},{call,put,select}){
            try{
                const {data}=yield call(apis.getDetailConfig,payload)
                if(data.code==200){
                    yield put({
                        type:'updateStates',
                        payload:{
                            detailConfigList:data.data.list?data.data.list:[]
                        }
                    })
                    callback&&callback(data.data.list?data.data.list:[])
                }else if(data.code!==401){
                    message.error(data.msg)
                }
            }catch(e){
                console.log(e);
            }finally{}
        }
    },
    reducers: {
        updateStates(state, action) {
            return {
                ...state,
                ...action.payload
            }
        }
    }
}
