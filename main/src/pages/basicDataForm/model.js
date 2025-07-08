import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant'

export default {
    namespace: 'basicDataForm',
    state: {
        sysTreeData: '',
        diyTreeData: '',
        tableData: [],//列表数据
        isShowEnumeTypeModal: false,
        isShowEnumeInfoModal: false,
        enumeTypeSort: '',
        dictInfoSelect: '',//勾选的枚举详情
        dictInfoId: '',//勾选的枚举详情id
        treeSearchWord: '',
        dictTypeId: '',
        limit: 10,
        treeData:[],
        enumType:'',
        leftNum:220,
        isView:false,
    },
    subscriptions: {
        setup({ dispatch, history }, { call, select }) {
            // history.listen(location => {
            //     if (history.location.pathname === '/basicDataForm') {
            //         dispatch({
            //             type: 'updateStates',
            //             payload: {
            //                 pathname: history.location.pathname,
            //             }
            //         })
            //         dispatch({
            //             type: 'getDictTypeTree',
            //             payload: {}
            //         })
            //     }
            // });
        }
    },
    effects: {
        //获取枚举类型树 ==> 获取树
        //创建枚举类型 ==>新增树
        //删除枚举类型 ==>删除树
        //修改枚举类型信息==>修改树
        //获取全部枚举类型及详细信息==>树查询
        //获取枚举类型的详细信息==>获取列表
        //创建枚举详细信息==>列表新增
        //删除枚举详情==>列表删除
        //修改枚举详细信息==>列表数据修改
        //获取全部枚举详细信息的中文名称==>列表查询

        //获取枚举类型树
        *getDictTypeTree({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {sysTreeData,diyTreeData,
            //     pathname
            // } = yield select(state => state.basicDataForm), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.getDictTypeTree, payload);
            const loopTree=(data,count)=>{
                data.forEach((item,index)=>{
                  item.pos=count
                  if(item.children){
                    loopTree(item.children,item.pos+1)
                  }
                })
                return data
              }
            
            if (data.code == REQUEST_SUCCESS) {
                if(data.data&&data.data.length!=0){
                    yield put({
                        type: 'updateStates',
                        payload: {
                            sysTreeData: data.data.list.length>0?loopTree([data.data.list[0].sys],2)[0]:[],
                            diyTreeData: data.data.list.length>0?loopTree([data.data.list[1].diy],2)[0]:[],
                            treeData:[data.data.list.length>0?loopTree([data.data.list[0].sys],2)[0]:[],data.data.list.length>0?loopTree([data.data.list[1].diy],2)[0]:[]]
                        }
                    })
                    callback&&callback([data.data.list.length>0?loopTree([data.data.list[0].sys],2)[0]:[],data.data.list.length>0?loopTree([data.data.list[1].diy],2)[0]:[]])
                }
                
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }

        },
        //创建枚举类型
        *addDictType({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.basicDataForm), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.addDictType, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('添加成功');
                callback && callback(true);
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                callback && callback(false);
                message.error(data.msg);
            }

        },
        //删除枚举类型
        *deleteDictType({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.basicDataForm), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.deleteDictType, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('删除成功');
                callback&&callback()
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        //修改枚举类型信息
        *updateDictType({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.basicDataForm), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.updateDictType, payload);

            if (data.code == REQUEST_SUCCESS) {
                message.success('修改成功');
                callback && callback(true);
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
                callback && callback(false);
            }

        },
        //获取全部枚举类型及详细信息
        *getDictList({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.basicDataForm), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.getDictList, payload);
            if (data.code == REQUEST_SUCCESS) {
                message.success('添加成功');
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }

        },
        //获取枚举类型的详细信息
        *getDictType({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.basicDataForm), {

            // } = searchObj[pathname];

            
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
                if(data.data&&data.data.list.length!=0){
                    yield put({
                        type: 'updateStates',
                        payload: {
                            tableData: loop(data.data.list)
                        }
                    })
                    callback&&callback(data.data.list)
                }else{
                    yield put({
                        type: 'updateStates',
                        payload: {
                            tableData: []
                        }
                    })
                }
                
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }

        },
        //创建枚举详细信息
        *addDictInfo({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.basicDataForm), {

            // } = searchObj[pathname];

            const { data } = yield call(apis.addDictInfo, payload);

            if (data.code == REQUEST_SUCCESS) {
                message.success('添加成功');
                callback && callback(true);
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
                callback && callback(false);
            }

        },
        //删除枚举详情
        *deleteDictInfo({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.basicDataForm), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.deleteDictInfo, payload);

            if (data.code == REQUEST_SUCCESS) {
                message.success('删除成功');
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }

        },
        //修改枚举详细信息
        *updateDictInfo({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.basicDataForm), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.updateDictInfo, payload);

            if (data.code == REQUEST_SUCCESS) {
                message.success('修改成功');
                callback && callback(true);
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
                callback && callback(false);
            }

        },
         //上移/下移枚举详情
         *moveDictInfo({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.basicDataForm), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.moveDictInfo, payload);
            if (data.code == REQUEST_SUCCESS) {
                callback && callback();
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        //获取全部枚举详细信息的中文名称
        *getDictInfoName({ payload, callback }, { call, put, select }) {
            // const {
            //     searchObj
            // } = yield select(state => state.layoutG), {
            //     pathname
            // } = yield select(state => state.basicDataForm), {

            // } = searchObj[pathname];
            const { data } = yield call(apis.getDictInfoName, payload);
            console.log(data)
            if (data.code == REQUEST_SUCCESS) {
                message.success('添加成功');
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // updateStates ==> layoutG/updateStates
        // *updateStates({ payload }, { call, put, select }) {
        //     const {
        //         searchObj
        //     } = yield select(state => state.layoutG), {
        //         pathname
        //     } = yield select(state => state.basicDataForm);

        //     for (var key in payload) {
        //         searchObj[pathname][key] = payload[key]
        //     }
        //     yield put({
        //         type: "layoutG/updateStates",
        //         payload: {
        //             searchObj: searchObj
        //         }
        //     })
        // }
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