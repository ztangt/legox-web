import { history } from 'umi';
import apis from 'api';
import { message } from 'antd';
const limit=10;
const Model = {
  namespace: 'role',
  state: {
    searchObj:{
      '/sysRole':{
        limit:10,
        selectedNodeId:"",
        selectedDataIds:[],
        treeData:[],
        currentNode:[],
        expandedKeys:[],
        treeSearchWord:'',
        selectedDatas:[],
        originalData:[],
        selectNodeType:'',
        autoExpandParent: false,
        isInit: 0,
        isShowAddModal:false,//是否显示添加弹框
        roleType:'',
        searchWord:'',
        returnCount:0,
        allPage:0,
        currentPage:0,
        list:[],
        roleInfo:[],//单条角色的信息
        selectedRowKeys:[],//选中的角色
        copyRoleId:'',//要复制的角色id
        isShowSetModal:false,//显示设置弹框
        isShowRuleModal:false,//显示设置弹框
        tabValue:'',//设置弹框中的标签切换值
        roleId: '',//角色Id
        sysRegisteTree: [],//注册系统树
        registerId:'',
        sysModulesTree: [],//模块资源树
        sysDataRuleList:[],//关联菜单
        roleModulesTree: [],//获取角色关联模块资源及按钮
        dataRuleSource: [],//自定义规则列表
        sysRuleMenu: [],//数据规则菜单
        sysEchoRuleMenu: [],//回显数据规则菜单
        menus:[],//模块资源勾选项
        menuId: '',
        dataRuleId:'',
        dataRules: [],
        selectNodeCode:'',
        menuInfo:{},
        isRule:false,
        definedReturnCount:0,
        definedCurrentpage:1,
        moudleName:''
      },//系统角色
      '/allRole':{
        limit:10,
        selectedNodeId:"",
        selectedDataIds:[],
        treeData:[],
        currentNode:[],
        expandedKeys:[],
        treeSearchWord:'',
        selectedDatas:[],
        originalData:[],
        selectNodeType:'',
        autoExpandParent: false,
        isInit: 0,
        isShowAddModal:false,//是否显示添加弹框
        roleType:'',
        searchWord:'',
        returnCount:0,
        allPage:0,
        currentPage:0,
        list:[],
        roleInfo:[],//单条角色的信息
        selectedRowKeys:[],//选中的角色
        copyRoleId:'',//要复制的角色id
        isShowSetModal:false,//显示设置弹框
        isShowRuleModal:false,//显示设置弹框
        tabValue:'',//设置弹框中的标签切换值
        roleId: '',//角色Id
        sysRegisteTree: [],//注册系统树
        sysModulesTree: [],//模块资源树
        sysDataRuleList:[],//关联菜单
        roleModulesTree: [],//获取角色关联模块资源及按钮
        dataRuleSource: [],//自定义规则列表
        sysRuleMenu: [],//数据规则菜单
        sysEchoRuleMenu: [],//回显数据规则菜单
        menus:[],//模块资源勾选项
        menuId: '',
        registerId:'',
        dataRuleId:'',
        dataRules: [],
        selectNodeCode:'',
        menuInfo:{},
        isRule:false,
        definedReturnCount:0,
        definedCurrentpage:1,
        moudleName:''
      },//全局角色
      '/unitRole':{
        limit:10,
        selectedNodeId:"",
        selectedDataIds:[],
        treeData:[],
        currentNode:[],
        expandedKeys:[],
        treeSearchWord:'',
        selectedDatas:[],
        originalData:[],
        selectNodeType:'',
        autoExpandParent: false,
        isInit: 0,
        isShowAddModal:false,//是否显示添加弹框
        roleType:'',
        searchWord:'',
        returnCount:0,
        allPage:0,
        currentPage:0,
        list:[],
        roleInfo:[],//单条角色的信息
        selectedRowKeys:[],//选中的角色
        copyRoleId:'',//要复制的角色id
        isShowSetModal:false,//显示设置弹框
        isShowRuleModal:false,//显示设置弹框
        tabValue:'',//设置弹框中的标签切换值
        roleId: '',//角色Id
        sysRegisteTree: [],//注册系统树
        sysModulesTree: [],//模块资源树
        sysDataRuleList:[],//关联菜单
        roleModulesTree: [],//获取角色关联模块资源及按钮
        dataRuleSource: [],//自定义规则列表
        sysRuleMenu: [],//数据规则菜单
        sysEchoRuleMenu: [],//回显数据规则菜单
        menus:[],//模块资源勾选项
        menuId: '',
        registerId:'',
        dataRuleId:'',
        dataRules: [],
        selectNodeCode:'',
        menuInfo:{},
        isRule:false,
        definedReturnCount:0,
        definedCurrentpage:1,
        moudleName:'',
        unitAllRole: false,
      },//单位角色
    },
    pathname: '',


  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        // const pathname=history.location.pathname.split('/support')?.[1];
        // if(pathname=='/sysRole' || pathname=='/allRole' || pathname=='/unitRole'){
        //   console.log(pathname,'pathname');
        //   const roleType=history.location.pathname.split('/support')?.[1]=='/sysRole'?'SYSROLE':(pathname=='/allRole'?'ALLROLE':'ORGROLE');
        //   dispatch({
        //     type:'updateStatesSelf',
        //     payload:{
        //       pathname:pathname
        //     }
        //   })
        //   dispatch({
        //     type:'updateStates',
        //     payload:{
        //       roleType:roleType,
        //       limit:limit
        //     }
        //   })
        // }
      })
    }
  },
  effects: {
    *getSysRoles({ payload }, { call, put }) {
      const {data} = yield call(apis.getSysRoles, payload,'','role');
      if(data.code==200){
        yield put({
          type: 'updateStates',
          payload:{
            ...data.data,
            //roleInfo:[]
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //修改角色
    *updateRole({ payload,pathname }, { call, put,select }) {
      const {data} = yield call(apis.updateRole, payload,'','role');
      if(data.code==200){
        message.success('修改成功');
        //重新获取列表
        const {searchObj} = yield select(state=>state.role);
        const {limit,searchWord,list,currentPage,roleType,selectOrgId} = searchObj[pathname];
        if(list.length==1&&payload.roleName.indexOf(searchWord)==-1&&currentPage!=1){
          //获取列表
          yield put({
            type:"getSysRoles",
            payload:{
              start:currentPage-1,
              limit:limit,
              searchWord:searchWord,
              roleType:roleType,
              orgId:selectOrgId
            }
          })
        }else{
          yield put({
            type:"getSysRoles",
            payload:{
              start:currentPage,
              limit:limit,
              searchWord:searchWord,
              roleType:roleType,
              orgId:selectOrgId
            }
          })
        }
        yield put({
          type:"updateStates",
          payload:{
            isShowAddModal:false
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *addRole({ payload,pathname }, { call, put,select }) {
      const {data} = yield call(apis.addRole, payload,'','role');
      if(data.code==200){
        message.success('添加成功');
        yield put({
          type: 'updateStates',
          payload:{
            searchWord:'',
            isShowAddModal:false
          }
        })
        const {searchObj} = yield select(state=>state.role);
        const {limit,roleType,selectOrgId} = searchObj[pathname];
        yield put({
          type:"getSysRoles",
          payload:{
            start:1,
            limit:limit,
            searchWord:'',
            roleType:roleType,
            orgId:selectOrgId
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //删除角色
    *delRoles({ payload ,pathname}, { call, put,select }) {
      const {data} = yield call(apis.delRoles, payload,'','role');
      if(data.code==200){
        message.success('删除成功');
        const {searchObj} = yield select(state=>state.role);
        const {limit,roleType,list,currentPage,searchWord,selectOrgId} = searchObj[pathname]
        if(currentPage!=1&&payload.roleIds.split(',').length==list.length){
          yield put({
            type:"getSysRoles",
            payload:{
              start:currentPage-1,
              limit:limit,
              searchWord:searchWord,
              roleType:roleType,
              orgId:selectOrgId
            }
          })
        }else{
          yield put({
            type:"getSysRoles",
            payload:{
              start:currentPage,
              limit:limit,
              searchWord:searchWord,
              roleType:roleType,
              orgId:selectOrgId
            }
          })
        }
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //复制角色
    *copyRole({ payload ,pathname}, { call, put,select }) {
      const {data} = yield call(apis.copyRole, payload,'','role');
      if(data.code==200){
        message.success('复制成功');
        yield put({
          type: 'updateStates',
          payload:{
            searchWord:'',
            isShowAddModal:false
          }
        })
        const {searchObj} = yield select(state=>state.role);
        const {limit,roleType,selectOrgId} = searchObj[pathname]
        yield put({
          type:"getSysRoles",
          payload:{
            start:1,
            limit:limit,
            searchWord:'',
            roleType:roleType,
            orgId:selectOrgId
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取注册系统
    *getSysRegister({ payload }, { call, put,select }) {
      const {data} = yield call(apis.getSysRegister, payload,'','role');
      if(data.code==200){
        //if(typeof(data.code) == 'string'){
        yield put({
          type: 'updateStates',
          payload:{
            sysRegisteTree: data.data.list.filter(item=>item.dr!==1),
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    // 根据角色ID查询查询关联菜单
    *getDataRuleMenuList({ payload,callback }, { call, put,select }) {
      const {data} = yield call(apis.getDataRuleMenuList, payload,'','role');
      const loopTree=(data)=>{
        data.forEach(item=>{
          item.registerId=payload.registerId
          if(item.children){
            loopTree(item.children)
          }
        })
        return data
      }
      if(data.code==200){
        yield put({
          type: 'updateStates',
          payload:{
            sysDataRuleList:loopTree(data.data.list)
          }
        })
        callback&&callback(loopTree(data.data.list))
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
     // 获取系统模块资源
     *getSysByMenus({ payload,callback }, { call, put,select }) {
      const {data} = yield call(apis.getSysByMenus, payload,'','role');
      const loopTree=(data)=>{
        data.forEach(item=>{
          item.registerId=payload.registerId
          if(item.children){
            loopTree(item.children)
          }
        })
        return data
      }
      if(data.code==200){
        yield put({
          type: 'updateStates',
          payload:{
            sysModulesTree:loopTree(data.data.list)
          }
        })
        callback&&callback(loopTree(data.data.list))
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    // 获取角色关联模块资源及按钮
    *getRoleMenus({ payload,callback }, { call, put,select }) {
      const {data} = yield call(apis.getRoleMenus, payload,'','role');
      if(data.code==200){
        //if(typeof(data.code) == 'string'){
        yield put({
          type: 'updateStates',
          payload:{
            roleModulesTree: data.data.list
          }
        })
        callback&&callback(data.data.list);
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //修改角色关联模块资源及按钮
    *updateRoleMenus({ payload,callback }, { call, put,select }) {
      const {data} = yield call(apis.updateRoleMenus, payload,'','role');
      if(data.code==200){
        //if(typeof(data.code) == 'string'){
        message.success('保存成功');
        typeof callback=='function'&&callback();
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    // 获取角色关联数据规则
    *getDatarule({ payload,callback}, { call, put,select }) {
      const {data} = yield call(apis.getDatarule, payload,'','role');
      if(data.code==200){
        // const {pathname,searchObj} = yield select(state=>state.role);
        // let {dataRules} = searchObj[pathname];
        yield put({
          type: 'updateStates',
          payload:{
            sysEchoRuleMenu: data.data.list
          }
        })
        if(typeof callback=='function'){
          callback(data.data.list);
        }
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //修改角色关联数据规则
    *updateDatarule({ payload,callback }, { call, put,select }) {
      const {data} = yield call(apis.updateDatarule, payload,'','role');
      if(data.code==200){
        //if(typeof(data.code) == 'string'){
        message.success('保存成功');
        typeof callback=='function'&&callback()
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //通过数据类型获取数据规则信息
    *getInfoByDataRuleType({ payload }, { call, put,select }) {
      const {data} = yield call(apis.getInfoByDataRuleType, payload,'','role');
      if(data.code==200){
        //if(typeof(data.code) == 'string'){
        yield put({
          type: 'updateStates',
          payload:{
            sysRuleMenu: data.data
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取数据规则列表
    *getDataRules({ payload }, { call, put,select }) {
      const {data} = yield call(apis.getDataRules, payload,'','role');
      if(data.code==200){
        //if(typeof(data.code) == 'string'){
        yield put({
          type: 'updateStates',
          payload:{
            dataRuleSource: data.data.list,
            definedReturnCount:data.data.returnCount,
            definedCurrentpage:data.data.currentPage
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },

    //查询用户
    *queryUser({ payload }, { call, put,select }) {
      const {data} = yield call(apis.queryUser, payload,'','role');
      if(data.code==200){
        console.log('data.data.list=',data.data.list);
        yield put({
          type: 'updateStates',
          payload:{
            users:data.data.list
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //修改角色关联用户
    *updateRoleUser({ payload,callback }, { call, put,select }) {
      const {data} = yield call(apis.updateRoleUser, payload,'','role');
      if(data.code==200){
        message.success('关联用户成功');
        typeof callback=='function'&&callback();
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    //获取已经关联角色的用户列表
    *getRoleUser({ payload }, { call, put,select }) {
      const {data} = yield call(apis.getRoleUser, payload,'','role');
      if(data.code==200){
        if(data && data.data) {
          let selectedUserIds = [];
          data.data.list.map((item)=>{
            selectedUserIds.push(item.orgRefUserId);
          })
          yield put({
            type:'updateStates',
            payload:{
              selectedDataIds:selectedUserIds,
              isShowUserModal:true//为了第一次进入以后获取选中数据
            }
          })
        }
        yield put({
          type:'updateStates',
          payload:{
            isShowUserModal:true//为了第一次进入以后获取选中数据
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }
    },
    *getRoleIdentityList({payload},{call,put,select}){
      const {data}=yield call(apis.getRoleIdentityList,payload)
      console.log(data,'data===');
      if(data.code==200){
        if(data && data.data) {
          let selectedUserIds = [];
          data.data.list.map((item)=>{
            selectedUserIds.push(item.identityId);
          })
          console.log(selectedUserIds,'selectedUserIds');
          yield put({
            type:'updateStates',
            payload:{
              selectedDataIds:selectedUserIds,
              selectedDatas:[...data.data.list],
              isShowUserModal:true//为了第一次进入以后获取选中数据
            }
          })
        }
        yield put({
          type:'updateStates',
          payload:{
            isShowUserModal:true//为了第一次进入以后获取选中数据
          }
        })
      }else if (data.code != 401 && data.code != 419 && data.code !=403) {
        message.error(data.msg);
      }

    },
    //替换reducers 的updateStates
    *updateStates({ payload,isClear,currentPathName }, { call, put,select }) {
      const {pathname,searchObj} = yield select(state=>state.role);
      const pname=history.location.pathname.split('/support')?.[1].includes('userView')?pathname:history.location.pathname.split('/support')?.[1];
      if(!isClear){
        for (var key in payload) {
          searchObj[pname][key]=payload[key]
        }
        yield put({
          type:"updateStatesSelf",
          payload:{
            searchObj:searchObj
          }
        })
      }else{
        let tmpSearchObj={
          '/sysRole':{
            limit:10,
            selectedNodeId:"",
            selectedDataIds:[],
            treeData:[],
            currentNode:[],
            expandedKeys:[],
            treeSearchWord:'',
            selectedDatas:[],
            originalData:[],
            selectNodeType:'',
            autoExpandParent: false,
            isInit: 0,
            isShowAddModal:false,//是否显示添加弹框
            roleType:'',
            searchWord:'',
            returnCount:0,
            allPage:0,
            currentPage:0,
            list:[],
            roleInfo:[],//单条角色的信息
            selectedRowKeys:[],//选中的角色
            copyRoleId:'',//要复制的角色id
            isShowSetModal:false,//显示设置弹框
            isShowRuleModal:false,//显示设置弹框
            tabValue:'',//设置弹框中的标签切换值
            roleId: '',//角色Id
            sysRegisteTree: [],//注册系统树
            registerId:'',
            sysModulesTree: [],//模块资源树
            sysDataRuleList:[],//关联菜单
            roleModulesTree: [],//获取角色关联模块资源及按钮
            dataRuleSource: [],//自定义规则列表
            sysRuleMenu: [],//数据规则菜单
            sysEchoRuleMenu: [],//回显数据规则菜单
            menus:[],//模块资源勾选项
            menuId: '',
            dataRuleId:'',
            dataRules: [],
            selectNodeCode:'',
            menuInfo:{},
            isRule:false,
            definedReturnCount:0,
            definedCurrentpage:1,
          },//系统角色
          '/allRole':{
            limit:10,
            selectedNodeId:"",
            selectedDataIds:[],
            treeData:[],
            currentNode:[],
            expandedKeys:[],
            treeSearchWord:'',
            selectedDatas:[],
            originalData:[],
            selectNodeType:'',
            autoExpandParent: false,
            isInit: 0,
            isShowAddModal:false,//是否显示添加弹框
            roleType:'',
            searchWord:'',
            returnCount:0,
            allPage:0,
            currentPage:0,
            list:[],
            roleInfo:[],//单条角色的信息
            selectedRowKeys:[],//选中的角色
            copyRoleId:'',//要复制的角色id
            isShowSetModal:false,//显示设置弹框
            isShowRuleModal:false,//显示设置弹框
            tabValue:'',//设置弹框中的标签切换值
            roleId: '',//角色Id
            sysRegisteTree: [],//注册系统树
            sysModulesTree: [],//模块资源树
            sysDataRuleList:[],//关联菜单
            roleModulesTree: [],//获取角色关联模块资源及按钮
            dataRuleSource: [],//自定义规则列表
            sysRuleMenu: [],//数据规则菜单
            sysEchoRuleMenu: [],//回显数据规则菜单
            menus:[],//模块资源勾选项
            menuId: '',
            registerId:'',
            dataRuleId:'',
            dataRules: [],
            selectNodeCode:'',
            menuInfo:{},
            isRule:false,
            definedReturnCount:0,
            definedCurrentpage:1,
          },//全局角色
          '/unitRole':{
            limit:10,
            selectedNodeId:"",
            selectedDataIds:[],
            treeData:[],
            currentNode:[],
            expandedKeys:[],
            treeSearchWord:'',
            selectedDatas:[],
            originalData:[],
            selectNodeType:'',
            autoExpandParent: false,
            isInit: 0,
            isShowAddModal:false,//是否显示添加弹框
            roleType:'',
            searchWord:'',
            returnCount:0,
            allPage:0,
            currentPage:0,
            list:[],
            roleInfo:[],//单条角色的信息
            selectedRowKeys:[],//选中的角色
            copyRoleId:'',//要复制的角色id
            isShowSetModal:false,//显示设置弹框
            isShowRuleModal:false,//显示设置弹框
            tabValue:'',//设置弹框中的标签切换值
            roleId: '',//角色Id
            sysRegisteTree: [],//注册系统树
            sysModulesTree: [],//模块资源树
            sysDataRuleList:[],//关联菜单
            roleModulesTree: [],//获取角色关联模块资源及按钮
            dataRuleSource: [],//自定义规则列表
            sysRuleMenu: [],//数据规则菜单
            sysEchoRuleMenu: [],//回显数据规则菜单
            menus:[],//模块资源勾选项
            menuId: '',
            registerId:'',
            dataRuleId:'',
            dataRules: [],
            selectNodeCode:'',
            menuInfo:{},
            isRule:false,
            definedReturnCount:0,
            definedCurrentpage:1,
          },//单位角色
        }
        searchObj[currentPathName] = tmpSearchObj[currentPathName];
        yield put({
          type:"updateStatesSelf",
          payload:{
            searchObj:searchObj
          }
        })
      }

    }
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
export default Model;
