const data = {
    currentPage: 1,
    searchWord: '',
    currentNode: {},
    treeData: [],
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
            '/moduleResourceMg': {
                currentPage: 1,
                limit: 10,
                searchWord: '',
                currentNode: {},
                treeData: [],
                expandId: '',
                expandedKeys: [],
                treeSearchWord: '',
                autoExpandParent: false,
                isInit: 0,
            },//模块资源管理
            '/sysRole': {
                limit: 10,
                treeData: [],
                currentNode: {},
                expandId: '',
                expandedKeys: [],
                treeSearchWord: '',
                autoExpandParent: false,
                isInit: 0,
                isShowAddModal: false,//是否显示添加弹框
                roleType: '',
                searchWord: '',
                returnCount: 0,
                allPage: 0,
                currentPage: 0,
                list: [],
                roleInfo: [],//单条角色的信息
                selectedRowKeys: [],//选中的角色
                copyRoleId: '',//要复制的角色id
                isShowSetModal: false,//显示设置弹框
                isShowRuleModal: false,//显示设置弹框
                tabValue: '',//设置弹框中的标签切换值
                roleId: '',//角色Id
                sysRegisteTree: [],//注册系统树
                sysModulesTree: [],//模块资源树
                roleModulesTree: [],//获取角色关联模块资源及按钮
                dataRuleSource: [],//自定义规则列表
                sysRuleMenu: [],//数据规则菜单
                sysEchoRuleMenu: [],//回显数据规则菜单
                selectListType: 'list',//选择的人员显示的方式，默认列表显示
                selectData: [],//选择人员的数据
                users: [],//用户信息
                selectedUserIds: [],
                selectOrgId: '',//单位角色的时候用到
                menus: [],//模块资源勾选项
                menuId: '',
                registerId: '',
                dataRuleId: '',
                dataRules: [],
            },//系统角色
            '/allRole': {
                limit: 10,
                treeData: [],
                currentNode: {},
                expandId: '',
                expandedKeys: [],
                treeSearchWord: '',
                autoExpandParent: false,
                isInit: 0,
                isShowAddModal: false,//是否显示添加弹框
                roleType: '',
                searchWord: '',
                returnCount: 0,
                allPage: 0,
                currentPage: 0,
                list: [],
                roleInfo: [],//单条角色的信息
                selectedRowKeys: [],//选中的角色
                copyRoleId: '',//要复制的角色id
                isShowSetModal: false,//显示设置弹框
                isShowRuleModal: false,//显示设置弹框
                tabValue: '',//设置弹框中的标签切换值
                roleId: '',//角色Id
                sysRegisteTree: [],//注册系统树
                sysModulesTree: [],//模块资源树
                roleModulesTree: [],//获取角色关联模块资源及按钮
                dataRuleSource: [],//自定义规则列表
                sysRuleMenu: [],//数据规则菜单
                sysEchoRuleMenu: [],//回显数据规则菜单
                selectListType: 'list',//选择的人员显示的方式，默认列表显示
                selectData: [],//选择人员的数据
                users: [],//用户信息
                selectedUserIds: [],
                selectOrgId: '',//单位角色的时候用到
                menus: [],//模块资源勾选项
                menuId: '',
                registerId: '',
                dataRuleId: '',
                dataRules: [],
            },//全局角色
            '/unitRole': {
                limit: 10,
                treeData: [],
                currentNode: {},
                expandId: '',
                expandedKeys: [],
                treeSearchWord: '',
                autoExpandParent: false,
                isInit: 0,
                isShowAddModal: false,//是否显示添加弹框
                roleType: '',
                searchWord: '',
                returnCount: 0,
                allPage: 0,
                currentPage: 0,
                list: [],
                roleInfo: [],//单条角色的信息
                selectedRowKeys: [],//选中的角色
                copyRoleId: '',//要复制的角色id
                isShowSetModal: false,//显示设置弹框
                isShowRuleModal: false,//显示设置弹框
                tabValue: '',//设置弹框中的标签切换值
                roleId: '',//角色Id
                sysRegisteTree: [],//注册系统树
                sysModulesTree: [],//模块资源树
                roleModulesTree: [],//获取角色关联模块资源及按钮
                dataRuleSource: [],//自定义规则列表
                sysRuleMenu: [],//数据规则菜单
                sysEchoRuleMenu: [],//回显数据规则菜单
                selectListType: 'list',//选择的人员显示的方式，默认列表显示
                selectData: [],//选择人员的数据
                users: [],//用户信息
                selectedUserIds: [],
                selectOrgId: '',//单位角色的时候用到
                menus: [],//模块资源勾选项
                menuId: '',
                registerId: '',
                dataRuleId: '',
                dataRules: [],
            },//单位角色
            '/test': {
                currentPage: 1,
                searchWord: '',
                currentNode: {},
                treeData: [],
                expandId: '',
                expandedKeys: [],
                treeSearchWord: '',
                autoExpandParent: false,
                isInit: 0,
            },
            //平台编码规则
            '/platformCodeRules': {
                isShowAddModal: false,
                isShowBindModal: false,
                treeData: [],
                returnCount: '',
                currentPage: 1,
                limit: 10,
                isTreeOrTable: '',
                isAddOrModify: '',
                iscodeOrClassify: '',
                codeRuleId: '',
                echoBindRules: [],
            },
            //手写签批样式管理
            '/writeSignStyle': {
                obtainFormData: {},
                tenantId: '',
            },
            //基础数据码表
            '/basicDataForm': {
                sysTreeData: '',
                diyTreeData: '',
                tableData: [],//列表数据
                isShowEnumeTypeModal: false,
                isShowEnumeInfoModal: false,
                enumeTypeSort: '',
                dictInfoSelect: '',//勾选的枚举详情
                dictInfoId: '',//勾选的枚举详情id
            },
            //业务表单管理
            '/businessFormManage': {
                limit: 10,
                currentPage: 1,
                returnCount: 0,
                searchWord: '',
                businessFormTable: [],
                businessFormTree: [],
                formVersionsTable: [],
                fvReturnCount: 0,
                fvCurrentPage: 0,
                isShowAddURLModal: false,
                isShowCatVersionInfo: false,
                isShowAddApplicationCategory: false,
            },
            //应用数据建模
            '/useDataBuildModel': {
                limit: 10,
                currentPage: 1,
                returnCount: 0,
                searchWord: '',
                getExportUrl: '',
                fileStorageId: '',
                datasourceTree: [],
                datasourceTable: [],
                getIndexTable: [],
                getFieldForm: {},
                getPhysicalForm: {},
                getDataSourceForm: {},
                isShowAddFieldModal: false,
                isShowCreateIndexModal: false,
                isShowTableCopyModal: false,
                isShowAddIndexModal: false,
                isShowImportModal: false,
                isShowAddPhysicalTableModal: false,
                isShowAddLinkDataSourceModal: false,
            },
            //密码管理
            '/passwordMg': {
                echoFormData: '',
            },
             //事件注册器
            '/eventRegister': {
                returnCount:0,//总条目数
                limit:10,
                currentPage:1,
                searchWord:'',
                isShowAddModal:false,
                isShowDataDriver:false,
                eventData:[],//列表数据
                tableData:[],
                dataDrivers:[],
                eventId:''
            },
            '/authorizedView': {
                currentPage: 1,
                limit: 10,
                searchWord: '',
                currentNode: {},
                treeData: [],
                expandId: '',
                expandedKeys: [],
                treeSearchWord: '',
                autoExpandParent: false,
                isInit: 0,
            },//模块资源管理
            //业务应用建模
            '/applyModel': {
              limit:10,
              searchWord:'',
              businessList:[],
              returnCount:0,
              currentPage:1,
              ctlgTree:[],
              isShowAddModal:false,
              selectCtlgInfo:[],
              isShowConfig:true,
              tabValue:'info',
              urlBizSolInfo:[],//配置页面的详情
              bizSolInfo:[],//修改的时候获取的数据
              fromData:[],
              listData:[],
              buttonList:[],
              bizFromInfo:[],
              isShowAuthModal:false,
              authList:[],//授权列表
              isShowElution:false,
            },
            //事件注册器
            '/eventRegister': {
                returnCount:0,//总条目数
                limit:10,
                currentPage:1,
                searchWord:'',//搜索词
                isShowAddModal:false,
                isShowDataDriver:false,
                eventData:[],//列表数据
                tableData:[],//参数列表数据
                dataDriver:[],//数据驱动数据
                eventId:'',//事件id
                tableSelectData:[],
                tableSelectId:[],
                editingKey:''
            },
            //业务应用建模的授权配置
            '/applyModelFromAuth':{
                authList:[],//授权列表
              }
        },



    },
    subscriptions: {
        setup({ dispatch, history }, { call, select }) {
            // history.listen(location => {

            //     dispatch({
            //         type: 'updateStates',
            //         payload: {
            //           routerTabs:[],
            //         }
            //     })
            // });
        }
    },
    effects: {

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
