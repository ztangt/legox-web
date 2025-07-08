import { message,Modal } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';
import uploader from '../../service/uploaderRequest';
import _ from "lodash";
import { env } from '../../../../project_config/env'
import moment from 'moment';
import 'moment/locale/zh-cn';
import { parse } from 'query-string';
import {history} from 'umi'
moment.locale('zh-cn');
const { addUser, updateUser, deleteUser, queryUser, getPosts, getDownFileUrl, getOrgChildren, getIdentity, addIdentity, obtainUser, importUser, importUserResult,getOrgRefUser,userExport,userSort,userEnable,getUserInfo, checkIdentityExist } = apis;
export default {
    namespace: 'userInfoManagement',
    state: {
        // 使用公用upload组件 所需的全部初始数据（有的用不到，酌情删减）
        fileUrl:'',
        selectTreeUrl: [],//面包屑路径
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
        minioTurePicture:'',
        minioTureSignature:'',
        minioFalsePicture:'',
        minioFalseSignature:'',
        ///////////

        loading: false,
        users: [],//用户列表
        currentPage: 1,
        returnCount: 0,
        currentUg: {},//当前用户信息
        searchWord: '',
        userIds: [],
        posts: [],
        type: 'SELF',
        doImgUploader: null,//头像id
        signDoImgUploader: null,//手写签批id
        signImageUrl: '',//手写签批头像
        imageUrl: '',//头像
        addModal: false,//新增modal框
        currentNode: {},
        treeData: [],
        limit: 10,
        treeSearchWord: '',
        expandedKeys: [],
        expandedPostKeys: [],
        identityPosts: [],//带岗位树
        identityObj: {},//身份
        identityModal: false,
        checkedKeys: [],
        parentNames:[],
        deptNames:[],
        isShowImportUserModel:false,
        importData: {},
        deptSearchWord:'',
        exportUserModal:false,
        exportUsers:[],
        exportExpands:[],
        exportCheckeds:[],
        allPage: 0,
        uploadType:'',
        picUrl:{},
        fileFullPath:'',
        sexData:[],
        leftNum:220,
    },
    subscriptions: {
        setup({ dispatch, history }, { call, select }) {
            history.listen(location => {
                // if (history.location.pathname == '/userInfoManagement') {
                //     const query = parse(history.location.search);
                    // const { currentNodeId, currentNodeType, currentPage, searchWord, isInit,limit} = query
                    // if(isInit=='1'){
                    //   dispatch({
                    //     type: 'updateStates',
                    //     payload:{
                    //       loading: false,
                    //       users: [],//用户列表
                    //       returnCount: 0,
                    //       currentUg: {},//当前用户信息
                    //       userIds: [],
                    //       posts: [],
                    //       type: '',
                    //       doImgUploader:null,//头像id
                    //       signDoImgUploader:null,//手写签批id
                    //       signImageUrl:'',//手写签批头像
                    //       imageUrl:'',//头像
                    //       addModal:false,//新增modal框
                    //     }
                    //   })
                    // }
                    // let deptId = ''
                    // let orgId = ''
                    // if(currentNodeType=='ORG'){
                    //   orgId = currentNodeId
                    //   deptId = ''
                    // }else{
                    //   deptId = currentNodeId
                    //   orgId  = ''
                    // }
                    // if(currentNodeId&&currentNodeId!='undefined'){
                    //   dispatch({
                    //     type: 'queryUser',
                    //     payload:{
                    //       deptId,
                    //       orgId,
                    //       start: currentPage,
                    //       limit: limit?limit:10,

                    //     }
                    //   })
                    // }
                // }
            });
        }
    },
    effects: {
        *queryUser({ payload }, { call, put, select }) {
            try {
                const { data } = yield call(queryUser, payload);
                if (data.code == REQUEST_SUCCESS) {
                    yield put({
                        type: 'updateStates',
                        payload: {
                            userIds: [],
                            users: data.data.list,
                            returnCount: data.data.returnCount,
                            currentPage: data.data.currentPage,
                            allPage: data.data.allPage,
                        }
                    })
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
            } finally {
            }
        },
        *querySortUser({ payload,callback }, { call, put, select }) {
            try {
                const { data } = yield call(queryUser, payload);
                if (data.code == REQUEST_SUCCESS) {
                    callback && callback(data.data.list)
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
            } finally {
            }
        },
        *updateUser({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(updateUser, payload);
                const { currentNode, currentPage, limit ,searchWord} = yield select(state => state.userInfoManagement)
                if (data.code == REQUEST_SUCCESS) {
                    let deptId = currentNode.key;
                    let orgId = currentNode.key;
                    yield put({
                        type: 'queryUser',
                        payload: {
                            searchWord,
                            deptId,
                            orgId,
                            start: currentPage,
                            limit: limit,
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
        *deleteUser({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(deleteUser, payload);
                const { currentNode, currentPage, limit,searchWord } = yield select(state => state.userInfoManagement)
                if (data.code == REQUEST_SUCCESS) {
                    let deptId = currentNode.key;
                    let orgId = currentNode.key;
                    yield put({
                        type: 'queryUser',
                        payload: {
                            searchWord,
                            deptId,
                            orgId,
                            start: currentPage,
                            limit: limit,

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
        *addUser({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(addUser, payload);
                const { currentNode, limit,addModal,allPage ,searchWord} = yield select(state => state.userInfoManagement)
                if (data.code == REQUEST_SUCCESS) {
                    let deptId = currentNode.key;
                    let orgId = currentNode.key;
                    yield put({
                        type: 'queryUser',
                        payload: {
                            searchWord,
                            deptId,
                            orgId,
                            start: allPage==0?1:allPage,
                            limit: limit,
                        }
                    })
                    yield put({
                        type: 'updateStates',
                        payload: {
                            addModal: false,
                        }
                    })
                    callback && callback(data.code);
                }else if(data.code == 'ALERT_DESIGN_PLATFORM_USER_ADD_USER_CONFIRM'){
                    callback && callback('ALERT_DESIGN_PLATFORM_USER_ADD_USER_CONFIRM');
                }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }

            } catch (e) {
            } finally {
            }
        },
        *getPosts({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getPosts, payload);
                const { posts,currentNode } = yield select(state => state.userInfoManagement)
                // const type = {
                //     "DEPT": '部门',
                //     "ORG": "单位"
                // }
                // console.log('currentNode.orgId',currentNode);
                if (data.code == REQUEST_SUCCESS) {
                    let list = []
                    if (data.data.list.length != 0) {
                        list = data.data.list.map((item) => {
                            // deptId有值说明是部门，没值则是单位
                            let type = '';
                            if(item.deptId&&item.deptId!==null) {
                                type = '部门';
                            } else {
                                type = '单位';
                            }
                            return {
                                value: item.id,
                                name: `${type}-${item.postName}`
                            }
                        })
                        yield put({
                            type: 'updateStates',
                            payload: {
                                posts: list,
                            }
                        })
                        if (payload.nodeType == 'DEPT') {
                          //获取最近的单位的id
                        //   let index = _.findLastIndex(currentNode.nodePath, function(o) { return o.type == 'ORG'; });
                        //     yield put({
                        //         type: 'getOrgPosts',
                        //         payload:{
                        //           orgId:currentNode.nodePath[index].id,
                        //           start: 1,
                        //           limit: 1000,
                        //           nodeType: 'ORG'
                        //         }
                        //     })
                        } else {
                           list = list
                        }
                    }
                    callback&&callback(list)
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
            } finally {
            }

        },
        *getOrgPosts({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getPosts, payload);
                const { posts } = yield select(state => state.userInfoManagement)
                const type = {
                    "DEPT": '部门',
                    "ORG": "单位"
                }
                if (data.code == REQUEST_SUCCESS) {
                    callback && callback();
                    let orgList = []
                    if (data.data.list.length != 0) {
                        orgList = data.data.list.map((item) => {
                            return {
                                value: item.id,
                                name: `${type[payload.nodeType]}-${item.postName}`
                            }
                        })
                        orgList = _.concat(posts, orgList)
                    }else{
                        orgList = posts
                    }
                    yield put({
                        type: 'updateStates',
                        payload: {
                            posts: orgList,
                        }
                    })


                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
            } finally {
            }

        },

        // 文件上传接口
        *uploaderFile({ payload, callback }, { call, put, select }) {
            yield fetch(`${env}/public/fileStorage/uploaderFile`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + window.localStorage.userToken,
                },
                body: payload.importFormData,
            }).then(res => {
                res.json().then((data) => {
                    if (data.code == 200) {
                        callback && callback(data.data);
                    } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                        message.error(data.msg);
                    }
                }).catch((err) => {
                    // 将 err 转换为字符串类型
                    const errorMessage = err instanceof Error ? err.message : String(err);
                    message.error(errorMessage);
                })
            })
        },

        //用户信息导入
        *importUser({ payload, callback }, { call, put, select }) {
            const { data } = yield call(importUser, payload);
            if (data.code == REQUEST_SUCCESS) {
                callback && callback(data.data.importId)
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        // 校验用户是否重复加入身份
        *checkIdentityExist({ payload, callback }, { call, put, select }) {
            const { data } = yield call(checkIdentityExist, payload);
            if (data.code == REQUEST_SUCCESS) {
                callback && callback(data.data)
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        //用户信息导入结果查看
        *importUserResult({ payload,callback }, { call, put, select }) {
            const { data } = yield call(importUserResult, payload);
            if (data.code == REQUEST_SUCCESS) {
                callback&&callback(true,data)
            } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                callback&&callback(false,data)

            }
        },

        //上传头像
        *doImgUploader({ payload, callback }, { call, put, select }) {
            try {
                let action = "POST public/fileStorage/uploaderFile";
                uploader(action, payload).then(data => {
                    if (data.data.code == REQUEST_SUCCESS) {
                        callback && callback(data.data.data);
                    } else {
                        message.error(data.data.msg, 5)
                    }
                })
            } catch (e) {
                console.log('e', e)
            } finally {
            }

        },
        //获取上传的 图片路径
        *getDownFileUrl({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getDownFileUrl, payload);
                if (data.code == REQUEST_SUCCESS) {
                    callback && callback(data.data.fileUrl);
                } else {
                    message.error(data.msg, 5)
                }
            } catch (e) {
            } finally {
            }

        },
        *identityPost({ payload, callback }, { call, put, select }) {
            try {
                let identityParent = JSON.parse(JSON.stringify(payload.identityParent))
                delete payload.identityParent
                const { data } = yield call(getOrgChildren, payload);
                const { identityPosts } = yield select(state => state.userInfoManagement)
                //获取选中节点的单位节点
                let orgId = '';
                const getParentKey = (nodeKey, tree) => {
                    for (let i = 0; i < tree.length; i++) {
                        const node = tree[i];
                        if (node['children']) {
                            if (node['children'].some(item => item['nodeId'] === nodeKey)) {
                                if (node['nodeType'] == 'ORG') {
                                    orgId = node.key;
                                } else {
                                    getParentKey(node['nodeId'], identityPosts);
                                }

                            } else if (node.children && node.children.length > 0) {
                                getParentKey(nodeKey, node.children)
                            }
                        }
                    }
                };
                const loop = (array, children) => {
                    if (array && array.length > 0) {
                        for (var i = 0; i < array.length; i++) {
                            array[i]['key'] = array[i].nodeId;
                            array[i]['value'] = array[i]['nodeId']
                            array[i]['keys'] = array[i].nodeId;
                            array[i]['title'] = array[i].nodeName;
                            if (array[i].isParent == '0' && array[i].nodeType != 'DEPT') {
                                array[i].isLeaf = true
                            } else {
                                array[i].isLeaf = false
                            }
                            if (array[i]['nodeType'] == 'DEPT') {
                                array[i]['icon'] = <ApartmentOutlined />
                            } else if (array[i]['nodeType'] == 'ORG') {
                                array[i]['icon'] = <BankOutlined />
                            } else if (array[i]['nodeType'] == 'POST') {
                                array[i]['icon'] = <AppstoreOutlined />
                            }
                            if (payload.nodeId == array[i]['nodeId']) {
                                if (children.length > 0) {
                                    if (array[i].nodeType == 'DEPT') {
                                        for (let j = 0; j < children.length; j++) {
                                            if (children[j].nodeType == 'POST') {
                                                getParentKey(array[i].key, identityPosts)
                                                children[j].key = orgId + '-' + array[i].key + '-' + children[j].key;
                                                children[j].nodeId = orgId + '-' + array[i].key + '-' + children[j].nodeId;
                                            }
                                        }
                                    }
                                }
                                array[i]['children'] = _.concat(children, identityParent);
                            }
                            if (array[i].children && array[i].children.length != 0) {
                                loop(array[i].children, children)
                            }
                        }
                    } else {
                        array = children;
                        for (var i = 0; i < array.length; i++) {
                            array[i]['key'] = array[i].nodeId;
                            array[i]['value'] = array[i]['nodeId']
                            array[i]['title'] = array[i].nodeName;
                            array[i]['keys'] = array[i].nodeId;
                            if (array[i].isParent == '0') {
                                array[i].isLeaf = true
                            } else {
                                array[i].isLeaf = false
                            }
                            if (array[i]['nodeType'] == 'DEPT') {
                                array[i]['icon'] = <ApartmentOutlined />
                            } else if (array[i]['nodeType'] == 'ORG') {
                                array[i]['icon'] = <BankOutlined />
                            } else if (array[i]['nodeType'] == 'POST') {
                                array[i]['icon'] = <AppstoreOutlined />
                            }
                        }
                    }

                    return array
                }
                if (data.code == REQUEST_SUCCESS) {
                    let treeData = JSON.parse(JSON.stringify(data.data.jsonResult));
                    treeData = loop(identityPosts, treeData);
                    yield put({
                        type: 'updateStates',
                        payload: {
                            identityPosts: treeData,
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

        *getOrgChildren({ payload,callback,pathname,moudleName }, { call, put, select }) {
            try {
                const {data} = yield call(apis.getOrgChildren, payload);
                const { exportUsers } = yield select(state => state.userInfoManagement)
                const  loop = (array,children)=>{
                    for(var i=0;i<array.length;i++){
                        array[i]['title'] = array[i]['nodeName']
                        array[i]['key'] = array[i]['nodeId']
                        array[i]['value'] = array[i]['nodeId']
                        if(payload.nodeId == array[i]['nodeId']){
                            // array[i]['children'] = children
                            array[i]['children'] = _.concat(children)
                        }
                        if(array[i].children&&array[i].children.length!=0){
                            loop(array[i].children,children)
                        }else{
                        if(array[i].isParent==1){
                            // array[i]['children'] = [{key: '-1'}]
                            array[i]['isLeaf'] = false
                        }else{
                            array[i]['isLeaf'] = true
                        }
                        }
                    }
                    return array
                }
                if(data.code==REQUEST_SUCCESS){
                    let sourceTree = JSON.parse(JSON.stringify(exportUsers));
                    if(data.data.list.length!=0){
                        if(sourceTree&&sourceTree.length==0){
                            sourceTree = data.data.list
                        }
                        sourceTree = loop(sourceTree,data.data.list);
                        yield put({
                            type: 'updateStates',
                            payload:{
                                exportUsers: sourceTree
                            }
                        })
                        if(!payload.nodeId){//请求根节点时，清空已展开的节点
                            yield put({
                                type: 'updateStates',
                                payload:{
                                    exportExpands:[]
                                }
                            })
                        }
                        callback&&callback();
                    }
                }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg,5)
                }
            } catch (e) {
                console.log(e);
            } finally {

            }
        },
        *getOrgTree({ payload,callback,pathname,moudleName }, { call, put, select }) {
            try {
                const {data} = yield call(apis.getOrgTree, payload);
                const { exportUsers } = yield select(state => state.userInfoManagement)
                const  loop = (array,children)=>{
                    for(var i=0;i<array.length;i++){
                        array[i]['title'] = array[i]['orgName']
                        array[i]['key'] = array[i]['id']
                        array[i]['value'] = array[i]['id']
                        if(payload.parentId == array[i]['id']){
                            // array[i]['children'] = children
                            array[i]['children'] = _.concat(children)
                        }
                        if(array[i].children&&array[i].children.length!=0){
                            loop(array[i].children,children)
                        }else{
                        if(array[i].isParent==1){
                            // array[i]['children'] = [{key: '-1'}]
                            array[i]['isLeaf'] = false
                        }else{
                            array[i]['isLeaf'] = true
                        }
                        }
                    }
                    return array
                }
                if(data.code==REQUEST_SUCCESS){
                    let sourceTree = JSON.parse(JSON.stringify(exportUsers));
                    if(data.data.list.length!=0){
                        if(sourceTree&&sourceTree.length==0){
                            sourceTree = data.data.list
                        }
                        sourceTree = loop(sourceTree,data.data.list);
                        yield put({
                            type: 'updateStates',
                            payload:{
                                exportUsers: sourceTree
                            }
                        })
                        if(!payload.parentId){//请求根节点时，清空已展开的节点
                            yield put({
                                type: 'updateStates',
                                payload:{
                                    exportExpands:[]
                                }
                            })
                        }
                        callback&&callback();
                    }
                }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg,5)
                }
            } catch (e) {
                console.log(e);
            } finally {

            }
        },
        *getSearchTree({ payload,callback,pathname,moudleName }, { call, put, select }) {
            try {
                const {data} = yield call(apis.getOrgTree, payload);
                const { exportUsers,exportExpands } = yield select(state => state.userInfoManagement)
                if(data.code==REQUEST_SUCCESS){
                    const  loop = (array,keys)=>{

                      for(var i=0;i<array.length;i++){
                        array[i]['title'] = `${array[i]['orgName']}`
                        array[i]['key'] = array[i]['id']
                        array[i]['value'] = array[i]['id']
                        keys.push(array[i]['id'])

                        if(array[i].children&&array[i].children.length!=0){
                          loop(array[i].children,keys)
                        }
                      }
                      return {
                        array,
                        keys
                      }
                    }

                    const {keys,array} = loop(data.data.list,exportExpands)
                      yield put({
                        type: 'updateStates',
                        payload:{
                            exportUsers: array,
                            exportExpands:keys
                        }
                    })

                  }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg,5)
                  }
            } catch (e) {
                console.log(e);
            } finally {

            }
        },
        *getIdentity({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(getIdentity, payload);
                const { checkedKeys } = yield select(state => state.userInfoManagement)
                let arr = []
                const loop = (array) => {
                    for (let i = 0; i < array.length; i++) {
                        let aa = ''
                        if (array[i].deptId && array[i].postId) {
                            aa = array[i].orgId + '-' + array[i].deptId + '-' + array[i].postId;
                        } else if (array[i].deptId) {
                            aa = array[i].deptId;
                        } else if (array[i].postId) {
                            aa = array[i].postId;
                        }
                        arr.push(aa)
                    }
                    return array
                }
                if (data.code == REQUEST_SUCCESS) {
                    let identityObj = JSON.parse(JSON.stringify(data.data))
                    loop(identityObj.identitys)
                    yield put({
                        type: 'updateStates',
                        payload: {
                            identityObj,
                            checkedKeys: arr
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
        *addIdentity({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(addIdentity, payload);
                if (data.code == REQUEST_SUCCESS) {
                    callback && callback();
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
            } finally {
            }
        },
        *getUserInfo({ payload,callback }, { call, put, select }) {
            try {
              const {data} = yield call(getUserInfo, payload);
              if(data.code==REQUEST_SUCCESS){
                let newObj = JSON.parse(JSON.stringify(data.data))
                newObj.isEnable = newObj.isEnable == 1 ? true : false//是否启用
                newObj.isAppEnable = newObj.isAppEnable == 1 ? true : false//是否移动端登录
                newObj.sex = newObj.sex&&newObj.sex<3? String(newObj.sex) : '0'//性别
                newObj.political = newObj.political ? String(newObj.political) : '0'//政治面貌
                newObj.personType = newObj.personType ? String(newObj.personType) : '0'//人员类型
                newObj.customType = newObj.customType ? String(newObj.customType) : '0'//用户类型
                newObj.education = newObj.education ? String(newObj.education) : '0'//学历
                newObj.degree = newObj.degree ? String(newObj.degree) : '0'//学位
                newObj.idenType = newObj.idenType ? String(newObj.idenType) : '0'//证件类型
                newObj.birthday = newObj.birthday ? moment.unix(Number(newObj.birthday), 'YYYY-MM-DD') : null//出生日期
                newObj.pwdExprTime = newObj.pwdExprTime ? moment.unix(Number(newObj.pwdExprTime), 'YYYY-MM-DD') : null//密码失效日期
                newObj.workTime = newObj.workTime ? moment.unix(Number(newObj.workTime), 'YYYY-MM-DD') : null//参加工作时间
                newObj.entryTime = newObj.entryTime ? moment.unix(Number(newObj.entryTime), 'YYYY-MM-DD') : null//调入时间
                newObj.joinTime = newObj.joinTime ? moment.unix(Number(newObj.joinTime), 'YYYY-MM-DD') : null//入党时间
                callback&&callback(newObj);
              }else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
              }
            } catch (e) {
            } finally {
            }
          },
        *obtainUser({ payload, callback }, { call, put, select }) {
            try {
                const { data } = yield call(obtainUser, payload);
                const { currentNode,deptNames,parentNames,picUrl } = yield select(state => state.userInfoManagement);
                const { key, title, nodeType, orgName } = currentNode
                if (data.code == REQUEST_SUCCESS) {
                    let newObj = JSON.parse(JSON.stringify(data.data))
                    newObj.isEnable = newObj.isEnable == 1 ? true : false//是否启用
                    newObj.isAppEnable = newObj.isAppEnable == 1 ? true : false//是否移动端登录
                    newObj.sex = newObj.sex&&newObj.sex<3? String(newObj.sex) : '0'//性别
                    newObj.political = newObj.political ? String(newObj.political) : '0'//政治面貌
                    newObj.personType = newObj.personType ? String(newObj.personType) : '0'//人员类型
                    newObj.customType = newObj.customType ? String(newObj.customType) : '0'//用户类型
                    newObj.education = newObj.education ? String(newObj.education) : '0'//学历
                    newObj.degree = newObj.degree ? String(newObj.degree) : '0'//学位
                    newObj.idenType = newObj.idenType ? String(newObj.idenType) : '0'//证件类型
                    newObj.birthday = newObj.birthday ? moment.unix(Number(newObj.birthday), 'YYYY-MM-DD') : null//出生日期
                    newObj.pwdExprTime = newObj.pwdExprTime ? moment.unix(Number(newObj.pwdExprTime), 'YYYY-MM-DD') : null//密码失效日期
                    newObj.workTime = newObj.workTime ? moment.unix(Number(newObj.workTime), 'YYYY-MM-DD') : null//参加工作时间
                    newObj.entryTime = newObj.entryTime ? moment.unix(Number(newObj.entryTime), 'YYYY-MM-DD') : null//调入时间
                    newObj.joinTime = newObj.joinTime ? moment.unix(Number(newObj.joinTime), 'YYYY-MM-DD') : null//入党时间
                    callback && callback(newObj);
                    picUrl['pictureUrl'] = newObj.picturePath
                    picUrl['signatureUrl'] = newObj.signaturePath
                    yield put({
                      type: 'updateStates',
                      payload: {
                          picUrl
                      },
                    });
                } else if (data.code != 401 && data.code != 419 && data.code !=403) {
                    message.error(data.msg);
                }
            } catch (e) {
            } finally {
            }
        },
        *userExport({ payload, callback }, { call, put, select }) {
            const { data } = yield call(userExport, payload);
            if (data.code == REQUEST_SUCCESS) {
              callback&&callback(data.data)
            }  else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        *userSort({ payload, callback }, { call, put, select }) {
            const { data } = yield call(userSort, payload);
            if (data.code == REQUEST_SUCCESS) {
              callback&&callback()
            }  else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
        },
        *userEnable({ payload, callback }, { call, put, select }) {
            const { data } = yield call(userEnable, payload);
            if (data.code == REQUEST_SUCCESS) {
              message.success('操作成功');
              callback&&callback()
            }  else if (data.code != 401 && data.code != 419 && data.code !=403) {
                message.error(data.msg);
            }
          },
          //获取头像下载地址url
    *getPictureDownFileUrl({ payload, callback }, { call, put, select }) {
        const { data } = yield call(apis.getDownFileUrl, payload);
        const { picUrl } = yield select(state => state.userInfoManagement);
        if (data.code == 200) {
          // let userInfos = {};
          picUrl['pictureUrl'] = data.data.fileUrl
          yield put({
            type: 'updateStates',
            payload: {
                picUrl
            },
          });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      },
      //获取签名下载地址url
      *getSignatureDownFileUrl({ payload, callback }, { call, put, select }) {
        const { data } = yield call(apis.getDownFileUrl, payload);
        const { picUrl } = yield select(state => state.userInfoManagement);
        if (data.code == 200) {
          // let userInfos = {};
          picUrl['signatureUrl'] = data.data.fileUrl
          yield put({
            type: 'updateStates',
            payload: {
                picUrl
            },
          });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code !=403) {
          message.error(data.msg);
        }
      },
      //重置密码
      *resetPassword({payload,callback},{call,put,select}){
        const {data}=yield call(apis.resetPassword,payload)
        if(data.code==200){
            message.success(data.msg)
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
            message.error(data.msg);
        }
      },
      //重置登录次数
      *resetLoginNum({payload,callback},{call,put,select}){
        const {data}=yield call(apis.resetLoginNum,payload)
        if(data.code==200){
            message.success(data.msg)
        }else if (data.code != 401 && data.code != 419 && data.code !=403) {
            message.error(data.msg);
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
                        sexData: loop(data.data.list)
                    }
                })
            }else{
                yield put({
                    type: 'updateStates',
                    payload: {
                        sexData: []
                    }
                })
            }
  
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
