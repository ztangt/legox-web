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
      '/tenement': { //租户管理
        searchWord:'',
        limit:10,
        returnCount:0,
        allPage:0,
        currentPage:0,
        list:[],
        tenantInfo:[],
        isShowUpdateModal:false,
        treeData:[],
        currentNode:[],
        expandedKeys:[],
        treeSearchWord:'',
        orgCenterLists:[],
        isShowShareOrgModal:false,
        orgCenterId:'',
        checkOrgInfos:[],
        checkTenantId:'',
        checkScope:'',
        isShowLoginConfig:false,
        tenantId:'',
        loginConfigInfo:[],
        isShowAccredit:false,
        isShowAddDataSource:false,
        errorMsg:''
      },
      '/userMg': { //用户管理
        searchWord:'',
        limit:10,
        returnCount:0,
        allPage:0,
        currentPage:1,
        isInit: 0,
      },
      '/organization': { //组织中心
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
      '/userAuthorization':{
        
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
