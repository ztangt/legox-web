const data = {
  currentPage: 1,
  searchWord: '',
  currentNode: {},
  treeData:[],
  expandId: '',
  expandedKeys: [],
  treeSearchWord: '',
  autoExpandParent: false,
}
export default {
  namespace: 'layoutG',
  state: {
    routerTabs: [],
    currentKey: '',
    searchObj: {
      '/':{

      },
      '/unitInfoManagement': {//单位信息管理
        currentPage: 1,
        limit:10,
        searchWord: '',
        currentNode: {},
        treeData:[],
        expandId: '',
        expandedKeys: [],
        treeSearchWord: '',
        isInit: 0,
      },
      '/deptMg': {//部门信息管理
        currentPage: 1,
        limit:10,
        searchWord: '',
        currentNode: {},
        treeData:[],
        expandId: '',
        expandedKeys: [],
        treeSearchWord: '',
        isInit: 0,
      },
      '/postMg': {//岗位息管理
        currentPage: 1,
        limit:10,
        searchWord: '',
        currentNode: {},
        treeData:[],
        expandId: '',
        expandedKeys: [],
        treeSearchWord: '',
        isInit: 0,

      },
      '/userInfoManagement': {//用户信息管理
        currentPage: 1,
        limit:10,
        searchWord: '',
        currentNode: {},
        treeData:[],
        expandId: '',
        expandedKeys: [],
        treeSearchWord: '',
        type: '',
        isInit: 0,

      },
      '/userGroupMg':{//用户组信息管理
        currentPage: 1,
        limit:10,
        searchWord: '',
        currentNode: {},
        treeData:[],
        expandId: '',
        expandedKeys: [],
        treeSearchWord: '',
        isInit: 0,

      },
      '/formEngine': {
        currentPage: 1,
        limit:10,
        searchWord: '',
        currentNode: {},
        treeData:[],
        expandId: '',
        expandedKeys: [],
        treeSearchWord: '',
        autoExpandParent: false,
        isInit: 0,

      },//表单引擎
      '/workflowEngine': {
        currentPage: 1,
        limit:10,
        searchWord: '',
        currentNode: {},
        treeData:[],
        expandId: '',
        expandedKeys: [],
        treeSearchWord: '',
        autoExpandParent: false,
        isInit: 0,

      },//流程引擎
      '/businessUseSort':{
        currentPage: 1,
        limit:10,
        searchWord: '',
        currentNode: {},
        treeData:[],
        expandId: '',
        expandedKeys: [],
        treeSearchWord: '',
        autoExpandParent: false,
        isInit: 0,

      },//业务应用类别
      '/buttonLibrary':{
        searchWord: '',
        currentNode: {},
        treeData:[],
        isInit: 0,

      },//按钮库
      '/buttonSolution':{
        currentPage: 1,
        limit:10,
        searchWord: '',
        currentNode: {},
        treeData:[],
        isInit: 0,

      },
      '/dataRuleMg':{
        searchWord: '',
        currentPage: 1,
        limit:10,
        isInit: 0,
        currentNode: {},
        treeData:[],
        expandId: '',
        expandedKeys: [],
        treeSearchWord: '',
        autoExpandParent: false,
        isInit: 0,
      },//数据规则定义
      '/moduleResourceMg':{
        currentPage: 1,
        limit:10,
        searchWord: '',
        currentNode: {},
        treeData:[],
        expandId: '',
        expandedKeys: [],
        treeSearchWord: '',
        autoExpandParent: false,
        isInit: 0,
      },//模块资源管理
      '/sysRole':{
        limit:10,
        treeData:[],
        currentNode: {},
        expandId: '',
        expandedKeys: [],
        treeSearchWord: '',
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
        roleModulesTree: [],//获取角色关联模块资源及按钮
        dataRuleSource: [],//自定义规则列表
        sysRuleMenu: [],//数据规则菜单
        sysEchoRuleMenu: [],//回显数据规则菜单
        selectListType:'list',//选择的人员显示的方式，默认列表显示
        selectData:[],//选择人员的数据
        users:[],//用户信息
        selectedUserIds:[],
        selectOrgId:'',//单位角色的时候用到
        menus:[],//模块资源勾选项
        menuId: '',
        registerId:'',
        dataRuleId:'',
        dataRules: [],
      },//系统角色
      '/allRole':{
        limit:10,
        treeData:[],
        currentNode: {},
        expandId: '',
        expandedKeys: [],
        treeSearchWord: '',
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
        roleModulesTree: [],//获取角色关联模块资源及按钮
        dataRuleSource: [],//自定义规则列表
        sysRuleMenu: [],//数据规则菜单
        sysEchoRuleMenu: [],//回显数据规则菜单
        selectListType:'list',//选择的人员显示的方式，默认列表显示
        selectData:[],//选择人员的数据
        users:[],//用户信息
        selectedUserIds:[],
        selectOrgId:'',//单位角色的时候用到
        menus:[],//模块资源勾选项
        menuId: '',
        registerId:'',
        dataRuleId:'',
        dataRules: [],
      },//全局角色
      '/unitRole':{
        limit:10,
        treeData:[],
        currentNode: {},
        expandId: '',
        expandedKeys: [],
        treeSearchWord: '',
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
        roleModulesTree: [],//获取角色关联模块资源及按钮
        dataRuleSource: [],//自定义规则列表
        sysRuleMenu: [],//数据规则菜单
        sysEchoRuleMenu: [],//回显数据规则菜单
        selectListType:'list',//选择的人员显示的方式，默认列表显示
        selectData:[],//选择人员的数据
        users:[],//用户信息
        selectedUserIds:[],
        selectOrgId:'',//单位角色的时候用到
        menus:[],//模块资源勾选项
        menuId: '',
        registerId:'',
        dataRuleId:'',
        dataRules: [],
      },//单位角色
      '/test':{
        currentPage: 1,
        searchWord: '',
        currentNode: {},
        treeData:[],
        expandId: '',
        expandedKeys: [],
        treeSearchWord: '',
        autoExpandParent: false,
        isInit: 0,
      }

    },



  },
  subscriptions: {
    setup({dispatch, history},{call, select}) {
      history.listen(location => {
        // dispatch({
        //     type: 'updateStates',
        //     payload: {
        //       routerTabs:[],
        //     }
        // })
      });
    }
  },
  effects: {

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
