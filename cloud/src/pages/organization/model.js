import {message} from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';
import moment from 'moment';
import 'moment/locale/zh-cn';
import _ from "lodash";
import {history} from 'umi';
import {env} from '../../../../project_config/env'
import { parse } from 'query-string';
moment.locale('zh-cn');
const {getOrgCenters,getTenants,getOrgChildren,getTenantOrg, getPosts,getUser,addOrgChildren,updateOrgChildren,deleteOrgDept,getOrgShare,getDept,getOrg,addDept,updateDept,addOrgCenters,updateOrgCenters,deleteOrgCenters,addUsers,deleteUsers,removeUsers,joinUsers,updateUsers,getIdUsers,addPosts,updatePosts,deletePosts,getUsers,getOrgByCenter,getIdentity,addIdentity,getDownFileUrl,importUser,importUserResult,importOrg,importOrgResult,importPost,importPostResult,importDept,importDeptResult,uploaderFile, orgEnable,identityEnable,postEnable,submitTenantOrg,getOrgTreeList,isOrgCenterShareOrg} = apis;
import { ApartmentOutlined,AppstoreOutlined,BankOutlined} from '@ant-design/icons';
export default {
  namespace: 'organization',
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
    fileFullPath:'',
    ///////////
  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      history.listen(location => {
        if (history.location.pathname === '/organization') {
          const query = parse(history.location.search);
          if(query.isInit=='1'){
          
          }
          // dispatch({
          //   type: 'getTenants',
          //   payload:{
          //     searchValue:'',
          //     start:1,
          //     limit:1000,
          //     // excludeTenantId;
          //   }
          // })
        }
      });
    }
  },
  effects: {
    // 获取列表
    *getTenants({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getTenants, payload);
        if(data.code==REQUEST_SUCCESS){
          let organizationLists = JSON.parse(JSON.stringify(data.data.list));
          yield put({
            type: 'updateStates',
            payload:{
              organizationLists,
              organizationAddModal:false
            }
          })
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getOrgShare({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getOrgShare, payload);
        if(data.code==REQUEST_SUCCESS){
          callback&&callback(data.data);
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //获取组织中心
    *getOrgCenters({payload},{call,put,select}){
      const {data}=yield call(apis.getOrgCenters,payload);
      if(data.code==200){
        yield put({
          type:'updateStates',
          payload:{
            orgCenterLists:data.data.list
          }
        })
      }else if(data.code!=401){
        message.error(data.msg);
      }
    },
    *getOrgByCenter({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getOrgByCenter, payload);
        let newArr = []
        const loop = (array)=>{
          for(var i=0;i<array.length;i++){
            if(array[i].children&&array[i].children.length > 0){
              newArr.push(array[i].id)
              loop(array[i].children)
            }
          }
          return newArr
        }

        yield put({
          type: 'updateStates',
          payload:{
            orgClildrens: [],
            returnCount: 0,
          }
        })
        if(data.code==REQUEST_SUCCESS){
          let orgClildrens = JSON.parse(JSON.stringify(data.data.list));
          for(let i=0;i<orgClildrens.length;i++){
            orgClildrens[i]['orgName'] = orgClildrens[i]['nodeName'];
            orgClildrens[i]['orgCode'] = orgClildrens[i]['nodeCode'];
            orgClildrens[i]['orgKind'] = orgClildrens[i]['nodeType'];
            orgClildrens[i]['isEnable'] = orgClildrens[i]['isEnable'];
            orgClildrens[i]['parentId'] = orgClildrens[i]['parentId'];
            orgClildrens[i]['id'] = orgClildrens[i]['nodeId'];
            orgClildrens[i]['number'] = i+1;
          }
          console.log(orgClildrens, '165')
          let arr = loop(orgClildrens)
          yield put({
            type: 'updateStates',
            payload:{
              orgClildrens,
              expandOrgList:arr,
              returnCount: data.data.returnCount,
            }
          })
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *addOrgCenters({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(addOrgCenters, payload);
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'getOrgCenters',
            payload:{
              searchValue:'',
              start:1,
              limit:1000
            }
          })
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *updateOrgCenters({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(updateOrgCenters, payload);
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'getOrgCenters',
            payload:{
              searchValue:'',
              start:1,
              limit:1000
            }
          })
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *deleteOrgCenters({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(deleteOrgCenters, payload);
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'getOrgCenters',
            payload:{
              searchValue:'',
              start:1,
              limit:1000
            }
          })
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *orgEnable({ payload, callback }, { call, put, select }) {
      const { data } = yield call(orgEnable, payload);
      if (data.code == REQUEST_SUCCESS) {
        message.success('操作成功');
        callback&&callback()
      } 
    },
    *identityEnable({ payload, callback }, { call, put, select }) {
      const { data } = yield call(identityEnable, payload);
      if (data.code == REQUEST_SUCCESS) {
        message.success('操作成功');
        callback&&callback()
      } 
    },
    *postEnable({ payload, callback }, { call, put, select }) {
      const { data } = yield call(postEnable, payload);
      if (data.code == REQUEST_SUCCESS) {
        message.success('操作成功');
        callback&&callback()
      } 
    },
    *getOrgChildren({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getOrgChildren, payload);
        const {searchObj} = yield select(state=>state.layoutG);
        const pathname = history.location.pathname;
        const { orgClildrens } = searchObj[pathname];
        // const {orgAddModal,orgClildrens} = yield select(state=>state.organization)
        const  loop = (array,children)=>{
          for(var i=0;i<array.length;i++){
            if(payload.nodeId == array[i]['id']){
              if(children.length > 0){
                array[i]['children'] = children
              }else{
                array[i]['children'] = null
              }

            }
            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children,children)
            }
          }
          return array
        }
        if(data.code==REQUEST_SUCCESS){
          let treeData = JSON.parse(JSON.stringify(data.data.list))
          for(let i=0;i<treeData.length;i++){
            treeData[i]['nodeNames'] = treeData[i]['nodeName'];
            treeData[i]['nodeNumbers'] = treeData[i]['nodeNumber'];
            treeData[i]['orgName'] = treeData[i]['nodeName'];
            treeData[i]['orgCode'] = treeData[i]['nodeCode'];
            treeData[i]['orgKind'] = treeData[i]['nodeType'];
            treeData[i]['isEnable'] = treeData[i]['isEnable'];
            treeData[i]['parentId'] = treeData[i]['parentId'];
            treeData[i]['id'] = treeData[i]['nodeId'];
            if(treeData[i]['isParent'] == '1'){
              treeData[i]['children'] = []
            }
          }
          if(payload.onlySubDept == '1'){
            let deptData = loop(orgClildrens,treeData)
            yield put({
              type: 'updateStates',
              payload:{
                orgClildrens:deptData,
                orgAddModal:false,
                deptAddModal:false,
                treeData
              }
            })
          }else{
            let deptData = [];
            if(orgClildrens && orgClildrens.length >0){
              if(payload.nodeId){
                deptData = loop(orgClildrens,treeData)
              }else{
                deptData = treeData;
              }
            }else{
              deptData = treeData;
            }
            yield put({
              type: 'updateStates',
              payload:{
                orgClildrens:deptData,
                orgAddModal:false,
                deptAddModal:false,
                treeData
              }
            })
          }
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getOrgTreeList({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getOrgTreeList, payload);
        console.log(data,'data==');
        const {searchObj} = yield select(state=>state.layoutG);
        const pathname = history.location.pathname;
        const { orgClildrens } = searchObj[pathname];
        // const {orgAddModal,orgClildrens} = yield select(state=>state.organization)
        const  loop = (array,children)=>{
          for(var i=0;i<array.length;i++){
            if(payload.parentId == array[i]['id']){
              if(children.length > 0){
                array[i]['children'] = children
              }else{
                array[i]['children'] = null
              }

            }
            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children,children)
            }
          }
          return array
        }
        if(data.code==REQUEST_SUCCESS){
          let treeData = JSON.parse(JSON.stringify(data.data.list))
          for(let i=0;i<treeData.length;i++){
            treeData[i]['nodeNames'] = treeData[i]['orgName'];
            treeData[i]['nodeNumbers'] = treeData[i]['orgNumber'];
            treeData[i]['orgKind'] = treeData[i]['orgKind'];
            treeData[i]['isEnable'] = treeData[i]['isEnable'];
            treeData[i]['parentId'] = treeData[i]['parentId'];
            treeData[i]['id'] = treeData[i]['id'];
            if(treeData[i]['isParent'] == '1'){
              treeData[i]['children'] = []
            }
          }
          // if(payload.onlySubDept == '1'){
          //   let deptData = loop(orgClildrens,treeData)
          //   yield put({
          //     type: 'updateStates',
          //     payload:{
          //       orgClildrens:deptData,
          //       orgAddModal:false,
          //       deptAddModal:false,
          //       treeData
          //     }
          //   })
          // }else{
            let deptData = [];
            if(orgClildrens && orgClildrens.length >0){
              if(payload.parentId){
                deptData = loop(orgClildrens,treeData)
              }else{
                deptData = treeData;
              }
            }else{
              deptData = treeData;
            }
            yield put({
              type: 'updateStates',
              payload:{
                orgClildrens:deptData,
                orgAddModal:false,
                deptAddModal:false,
                treeData
              }
            })
          // }
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getTenantOrg({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getTenantOrg, payload);
        const {searchObj} = yield select(state=>state.layoutG);
        const pathname = history.location.pathname;
        const { orgClildrens } = searchObj[pathname];
        // const {orgAddModal,orgClildrens} = yield select(state=>state.organization)
        const  loop = (array,children)=>{
          for(var i=0;i<array.length;i++){
            if(payload.nodeId == array[i]['nodeId']){
              if(children.length > 0){
                array[i]['children'] = children
              }else{
                array[i]['children'] = null
              }

            }
            if(array[i].children&&array[i].children.length!=0){
              loop(array[i].children,children)
            }
          }
          return array
        }
        if(data.code==REQUEST_SUCCESS){
          let treeData = JSON.parse(JSON.stringify(data.data.list))
          for(let i=0;i<treeData.length;i++){
            treeData[i]['nodeNames'] = treeData[i]['nodeName'];
            treeData[i]['nodeNumbers'] = treeData[i]['nodeNumber'];
            treeData[i]['number'] = i+1;
            if(treeData[i]['isParent'] == '1'){
              treeData[i]['children'] = []
            }
            if(treeData[i]['orgKind']=="ORG"){
              treeData[i]['key'] = treeData[i]['id'];
              treeData[i]['value'] = treeData[i]['id'];
              treeData[i]['title'] = treeData[i]['orgName'];
            }
          }
          if(payload.onlySubDept == '1'){
            let deptData = loop(orgClildrens,treeData)
            yield put({
              type: 'updateStates',
              payload:{
                orgClildrens:deptData,
                orgAddModal:false,
                deptAddModal:false,
                treeData,
                returnCount: data.data.returnCount,
                // returnCountUser:0,
                // returnCountPost:0,
              }
            })
          }else{
            let deptData = [];
            if(orgClildrens && orgClildrens.length >0){
              if(payload.nodeId){
                deptData = loop(orgClildrens,treeData)
              }else{
                deptData = treeData;
              }
            }else{
              deptData = treeData;
            }
            yield put({
              type: 'updateStates',
              payload:{
                orgClildrens:deptData,
                orgAddModal:false,
                deptAddModal:false,
                treeData,
                returnCount: data.data.returnCount,
                // returnCountUser:0,
                // returnCountPost:0,
              }
            })
          }
          callback&&callback(data.data.list);
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *identityPost({ payload,callback }, { call, put, select }) {
      try {
        let identityParent = JSON.parse(JSON.stringify(payload.identityParent))
        delete payload.identityParent
        const {data} = yield call(getOrgChildren, payload);
        const {searchObj} = yield select(state=>state.layoutG);
        const pathname = history.location.pathname;
        const { identityPosts } = searchObj[pathname];
        // const {identityPosts} = yield select(state=>state.organization)
        //获取选中节点的单位节点
        let orgId = '';
        const getParentKey = (nodeKey, tree) =>{
          for (let i = 0; i < tree.length; i++) {
              const node = tree[i];
              if (node['children']) {
                  if (node['children'].some(item => item['nodeId'] === nodeKey)) {
                      if(node['nodeType'] == 'ORG'){
                        orgId = node.key;
                      }else{
                        getParentKey(node['nodeId'], identityPosts);
                      }

                  }else if(node.children && node.children.length > 0){
                      getParentKey(nodeKey, node.children)
                  }
              }
          }
        };
        const loop = (array,children)=>{
          if(array && array.length > 0){
            for(var i=0;i<array.length;i++){
              array[i]['key'] = array[i].nodeId;
              array[i]['value'] = array[i].nodeId;
              array[i]['keys'] = array[i].nodeId;
              array[i]['title'] = array[i].nodeName;
              if(array[i].isParent == '0' && array[i].nodeType != 'DEPT'){
                array[i].isLeaf = true
              }else{
                array[i].isLeaf = false
              }
              if(array[i]['nodeType']=='DEPT'){
                 array[i]['icon'] = <ApartmentOutlined />
              }else if(array[i]['nodeType']=='ORG'){
                 array[i]['icon'] = <BankOutlined />
              }else if(array[i]['nodeType']=='POST'){
                array[i]['icon'] = <AppstoreOutlined />
              }
              if(payload.nodeId == array[i]['nodeId']){
                if(children.length > 0){
                   console.log('array[j]',array[i])
                   if(array[i].nodeType == 'DEPT'){
                      for(let j=0;j<children.length;j++){
                        console.log('children[j]',children[j])
                        if(children[j].nodeType == 'POST'){
                          getParentKey(array[i].key,identityPosts)
                          children[j].key = orgId + '-' +  array[i].key + '-' + children[j].key;
                          children[j].nodeId = orgId + '-' +  array[i].key + '-' + children[j].nodeId;
                        }
                      }
                   }

                  // array[i]['children'] = _.concat(children,identityParent);
                }
                array[i]['children'] = _.concat(children,identityParent);
                // else{
                //   array[i]['children'] = null
                // }
              }
              if(array[i].children&&array[i].children.length!=0){
                loop(array[i].children,children)
              }
            }
          }else{
            array = children;
            for(var i=0;i<array.length;i++){
              array[i]['key'] = array[i].nodeId;
              array[i]['value'] = array[i].nodeId;
              array[i]['title'] = array[i].nodeName;
              array[i]['keys'] = array[i].nodeId;
              if(array[i].isParent == '0'){
                array[i].isLeaf = true
              }else{
                array[i].isLeaf = false
              }
              if(array[i]['nodeType']=='DEPT'){
                array[i]['icon'] = <ApartmentOutlined />
              }else if(array[i]['nodeType']=='ORG'){
                  array[i]['icon'] = <BankOutlined />
              }else if(array[i]['nodeType']=='POST'){
                array[i]['icon'] = <AppstoreOutlined />
              }
            }
          }

          return array
        }
        if(data.code==REQUEST_SUCCESS){
          let treeData = JSON.parse(JSON.stringify(data.data.list));
          treeData = loop(identityPosts,treeData);
          console.log('treeData',treeData)
          yield put({
            type: 'updateStates',
            payload:{
              identityPosts:treeData,
            }
          })
          // for(let i=0;i<treeData.length;i++){
          //   treeData[i]['nodeNames'] = treeData[i]['nodeName'];
          //   treeData[i]['nodeNumbers'] = treeData[i]['nodeNumber'];
          //   if(treeData[i]['isParent'] == '1'){
          //     treeData[i]['children'] = []
          //   }
          // }

          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getPosts({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getPosts, payload);
        if(data.code==REQUEST_SUCCESS){
          let postLists = JSON.parse(JSON.stringify(data.data.list))
          yield put({
            type: 'updateStates',
            payload:{
              postLists,
              returnCountPost:data.data.returnCount,
              postAddModal:false
            }
          })
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *addPosts({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(addPosts, payload);
        if(data.code==REQUEST_SUCCESS){
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *updatePosts({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(updatePosts, payload);
        if(data.code==REQUEST_SUCCESS){
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *deletePosts({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(deletePosts, payload);
        if(data.code==REQUEST_SUCCESS){
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getIdUsers({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getIdUsers, payload);
        data.data.sex = data.data.sex&&data.data.sex<3 ? String(data.data.sex) : '0'//性别
        data.data.isEnable = data.data.isEnable == 1 ? true : false//是否启用
        data.data.isAppEnable = data.data.isAppEnable == 1 ? true : false//是否移动端登录
        data.data.sex = data.data.sex ? String(data.data.sex) : '0'//性别
        data.data.political = data.data.political ? String(data.data.political) : '0'//政治面貌
        data.data.personType = data.data.personType ? String(data.data.personType) : '0'//人员类型
        data.data.customType = data.data.customType ? String(data.data.customType) : '1'//用户类型
        data.data.education = data.data.education ? String(data.data.education) : '0'//学历
        data.data.degree = data.data.degree ? String(data.data.degree) : '0'//学位
        data.data.idenType = data.data.idenType ? String(data.data.idenType) : '0'//证件类型


        data.data.birthday = data.data.birthday?moment.unix(Number(data.data.birthday), 'YYYY-MM-DD'):null//出生日期
        data.data.pwdExprTime = data.data.pwdExprTime?moment.unix(Number(data.data.pwdExprTime), 'YYYY-MM-DD'):null//密码失效日期
        data.data.workTime = data.data.workTime?moment.unix(Number(data.data.workTime), 'YYYY-MM-DD'):null//参加工作时间
        data.data.entryTime = data.data.entryTime?moment.unix(Number(data.data.entryTime), 'YYYY-MM-DD'):null//调入时间
        data.data.joinTime = data.data.joinTime?moment.unix(Number(data.data.joinTime), 'YYYY-MM-DD'):null//入党时间
        // const {currentPage} = yield select(state=>state.layoutG.searchObj['/organization']['user'])
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload:{
              userUg:data.data
            }
          })
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getUser({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getUser, payload);
        // const {currentPage} = yield select(state=>state.layoutG.searchObj['/organization']['user'])
        if(data.code==REQUEST_SUCCESS){
          let userLists = JSON.parse(JSON.stringify(data.data.list))
          yield put({
            type: 'updateStates',
            payload:{
              userLists,
              returnCountUser:data.data.returnCount,
            }
          })
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *addOrgChildren({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(addOrgChildren, payload);
        if(data.code==REQUEST_SUCCESS){
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *updateOrgChildren({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(updateOrgChildren, payload);
        if(data.code==REQUEST_SUCCESS){
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *addDept({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(addDept, payload);
        if(data.code==REQUEST_SUCCESS){
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *updateDept({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(updateDept, payload);
        if(data.code==REQUEST_SUCCESS){
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getDept({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getDept, payload);
        if(data.code==REQUEST_SUCCESS){
          let deptUg = JSON.parse(JSON.stringify(data.data))
          yield put({
            type: 'updateStates',
            payload:{
              deptUg
            }
          })
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    //替换reducers 的updateStates

    *updateStates({ payload ,isClear}, { call, put,select }) {
      const {searchObj} = yield select(state=>state.layoutG);
      const pathname = history.location.pathname;
      if(!isClear){
        for (var key in payload) {
          searchObj[pathname][key]=payload[key];
        }
        yield put({
          type:"layoutG/updateStates",
          payload:{
            searchObj:searchObj
          }
        })
      }else{
        const pathName='/organization'
        searchObj[pathName] =  { //组织中心
          loading: false,
          currentNode: 1,
          list:[],
          treeData: [],
          organizationLists: [],//组织中心列表
          orgCenterLists:[],
          organizationId: '',//组织中心选中的id
          checkOrgCenterId:'',
          tenantOrgShare:'',//是否选择共享组织
          contextMenuId:'',//组织中心右键选中的id
          orgCenterId: '', // 搜索单位时的id
          addModal:false,
          orgAddModal:false,
          deptAddModal:false,
          userAddModal:false,
          postAddModal:false,
          identityModal:false,
          isShowShareOrgModal:false,
          joinModal:false,
          onAddCancel:false,
          organizationAddModal:false,
          importModal:false,
          orgImportModal:false,
          importData:{},//导入结果数据
          orgClildrens:[],//组织机构树
          postLists:[],//单位列表
          userLists:[],//用户列表
          usersLists:[],//云管理用户列表
          organizationUg:{},//组织中心修改数据
          orgUg:{},//单位修改数据
          deptUg:{},//部门修改数据
          deptItemUg:{},//选中部门数据
          orgItemUg:{},//单位或部门选中数据
          userUg:{},//用户修改数据
          postUg:{},//岗位修改数据
          orgDeptIds:[],//单位部门选择id
          userIds:[],//用户选择id
          usersIds:[],//云管理用户选择id
          postIds:[],//岗位选择id
          selectedOrgRows:[],//单位部门选中项
          checkOrgInfos:[],
          returnCountUser:0,
          returnCountUsers:0,
          returnCountPost:0,
          returnCount:0,
          expandOrgList:[],
          identityPosts:[],//带岗位树
          expandedKeys:[],//身份展开
          identityObj:{},//身份
          checkedKeys:[],
          acountStatus:false,
          checkTenantId:'',
          checkOrgInfos:[],
          currentUser:{},
          user:{ // 用户
            searchWord:'',
            limit:10,
            returnCount:0,
            allPage:0,
            currentPage:1,
            isInit: 0,
          },
          users:{ //云管理用户
            searchWord:'',
            limit:10,
            returnCount:0,
            allPage:0,
            currentPage:1,
            isInit: 0,
          },
          post:{ //岗位
            searchWord:'',
            limit:10,
            returnCount:0,
            allPage:0,
            currentPage:1,
            isInit: 0,
          }
        },
        yield put({
          type:"layoutG/updateStates",
          payload:{
            searchObj:searchObj
          }
        })
      }
    },
    *submitTenantOrg({payload,callback },{call,put,select}){
      const {data}=yield call(submitTenantOrg,payload);
      if(data.code==200){
        message.success('保存成功');
        yield put({
          type:'updateStates',
          payload:{
            isShowShareOrgModal:false,
            checkOrgInfos:[],
            orgCenterId:''
          }
        })
        callback&&callback();
      }else if(data.code!=401){
        message.error(data.msg);
      }
    },
    *getOrg({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getOrg, payload);
        if(data.code==REQUEST_SUCCESS){
          let orgUg = JSON.parse(JSON.stringify(data.data))
          yield put({
            type: 'updateStates',
            payload:{
              orgUg
            }
          })
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *deleteOrgDept({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(deleteOrgDept, payload);
        const {searchObj} = yield select(state=>state.layoutG);
        const pathname = history.location.pathname;
        const { orgClildrens } = searchObj[pathname];
        // const {orgClildrens} = yield select(state=>state.organization)
        if(data.code==REQUEST_SUCCESS){
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *addUsers({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(addUsers, payload);
        if(data.code==REQUEST_SUCCESS){
          callback&&callback(data.code);
        }else if(data.code == 'ALERT_DESIGN_PLATFORM_USER_ADD_USER_CONFIRM'){
          callback && callback('ALERT_DESIGN_PLATFORM_USER_ADD_USER_CONFIRM');
        } else if(data.code!=401&&data.code!='ALERT_DESIGN_PLATFORM_USER_ADD_USER_CONFIRM'){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *deleteUsers({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(deleteUsers, payload);
        if(data.code==REQUEST_SUCCESS){
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *updateUsers({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(updateUsers, payload);
        if(data.code==REQUEST_SUCCESS){
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *removeUsers({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(removeUsers, payload);
        if(data.code==REQUEST_SUCCESS){
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *joinUsers({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(joinUsers, payload);
        if(data.code==REQUEST_SUCCESS){
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getUsers({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getUsers, payload);
        if(data.code==REQUEST_SUCCESS){
          yield put({
            type: 'updateStates',
            payload:{
                usersLists: data.data.list,
                returnCountUsers: data.data.returnCount,
            }
          })
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *getIdentity({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(getIdentity, payload);
        // const {checkedKeys} = yield select(state=>state.organization)
        console.log('data---获取身份',data)
        let arr = []
        const loop = (array)=>{
          console.log('array',array)
          for(let i = 0; i < array.length; i++){
            console.log(array[i])
            let aa = ''
            if(array[i].deptId && array[i].postId){
              aa = array[i].orgId + '-' +  array[i].deptId + '-' + array[i].postId;
            }else if(array[i].deptId){
              aa = array[i].deptId;
            }else if(array[i].postId){
              aa = array[i].postId;
            }
            arr.push(aa)
          }
          return array
        }
        if(data.code==REQUEST_SUCCESS){
          let identityObj = JSON.parse(JSON.stringify(data.data))
          loop(identityObj.identitys)
          console.log('arr',arr)
          yield put({
            type: 'updateStates',
            payload:{
              identityObj,
              checkedKeys:arr
            }
          })
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    *addIdentity({ payload,callback }, { call, put, select }) {
      try {
        const {data} = yield call(addIdentity, payload);
        console.log('data---保存身份',data)
        if(data.code==REQUEST_SUCCESS){
          // let identityObj = JSON.parse(JSON.stringify(data.data))
          // yield put({
          //   type: 'updateStates',
          //   payload:{
          //     identityObj
          //   }
          // })
          callback&&callback();
        }else if(data.code!=401){
          message.error(data.msg);
        }
      } catch (e) {
      } finally {
      }
    },
    // 文件上传接口
   *uploaderFile({ payload, callback }, { call, put, select }) {
    console.log(payload)
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
             } else if (data.code != 401) {
                 message.error(data.msg);
             }
         }).catch((err) => {
            // 将 err 转换为字符串类型
            const errorMessage = err instanceof Error ? err.message : String(err);
            message.error(errorMessage);
         })
     })
    },
    //单位信息导入
    *importOrg({ payload, callback }, { call, put, select }) {
        const { data } = yield call(importOrg, payload);
        if (data.code == REQUEST_SUCCESS) {
            callback&&callback(data.data.importId)
        } else if (data.code != 401) {
            message.error(data.msg);
        }
    },

    //单位信息导入结果查看
    *importOrgResult({ payload, callback }, { call, put, select }) {
        const { data } = yield call(importOrgResult, payload);
        if (data.code == REQUEST_SUCCESS) {
            callback&&callback(true,data)
        } else if (data.code != 401) {
            callback&&callback(false,data)
        }
    },
    //岗位信息导入
    *importPost({ payload, callback }, { call, put, select }) {
        const { data } = yield call(importPost, payload);
        if (data.code == REQUEST_SUCCESS) {
            callback&&callback(data.data.importId)
        } else if (data.code != 401) {
            message.error(data.msg);
        }
    },

    //岗位信息导入结果查看
    *importPostResult({ payload, callback }, { call, put, select }) {
        const { data } = yield call(importPostResult, payload);
        if (data.code == REQUEST_SUCCESS) {
            callback&&callback(true,data)
        } else if (data.code != 401) {
            callback&&callback(false,data)
        }
    },
    //部门信息导入
    *importDept({ payload, callback }, { call, put, select }) {
        const { data } = yield call(importDept, payload);
        if (data.code == REQUEST_SUCCESS) {
            callback&&callback(data.data.importId)
        } else if (data.code != 401) {
            message.error(data.msg);
        }
    },

    //部门信息导入结果查看
    *importDeptResult({ payload, callback }, { call, put, select }) {
        const { data } = yield call(importDeptResult, payload);
        if (data.code == REQUEST_SUCCESS) {
            callback&&callback(true,data)
        } else if (data.code != 401) {
            callback&&callback(false,data)

        }
    },
    //用户信息导入
    *importUser({ payload, callback }, { call, put, select }) {
        const { data } = yield call(importUser, payload);
        if (data.code == REQUEST_SUCCESS) {
            callback && callback(data.data.importId)
        } else if (data.code != 401) {
            message.error(data.msg);
        }
    },
    //用户信息导入结果查看
    *importUserResult({ payload,callback }, { call, put, select }) {
        const { data } = yield call(importUserResult, payload);
        if (data.code == REQUEST_SUCCESS) {
            callback&&callback(true,data)
        } else if (data.code != 401) {
            callback&&callback(false,data)

        }
    },
    //获取上传的 图片路径
    *getDownFileUrl({ payload, callback }, { call, put, select }) {
        try {
            const { data } = yield call(getDownFileUrl, payload);
            if (data.code == REQUEST_SUCCESS) {
                callback && callback(data.data.fileUrl);
            } else if(data.code!=401) {
                message.error(data.msg, 5)
            }
        } catch (e) {
        } finally {
        }
    },
    *isOrgCenterShareOrg({payload,callback},{call,put,select}){
      const {data}=yield call(isOrgCenterShareOrg,payload)
      if (data.code == REQUEST_SUCCESS) {
        callback&&callback(data.data)
      } else if(data.code!=401) {
          message.error(data.msg, 5)
      }
    },
  },

  reducers: {
    updateStatesSelf(state, action){
      return {
        ...state,
        ...action.payload
      }
    }
  },
};
