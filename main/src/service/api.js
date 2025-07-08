/**
 * api定义，规则为：method apiname
 */
export default {
  getOrg: 'GET sys/org/:orgId', //获取某单位信息
  getOrgChildren: 'GET sys/org/children', //获取组织树
  getSearchTree: 'GET sys/org/tree', //搜索组织机构数
  addOrg: 'POST sys/org', //单位信息新增
  updateOrg: 'PUT sys/org', //单位信息修改
  getOrgs: 'GET sys/org/list', //根据父单位id查询单位信息
  deleteOrg: 'DELETE sys/org', //删除单位信息
  importOrg: 'POST sys/org/importExcel', //单位信息导入
  importOrgResult: 'GET sys/org/refreshImportExcel', //单位信息导入结果查看
  addDept: 'POST sys/dept', //部门信息新增
  updateDept: 'PUT sys/dept', //部门信息修改
  getDepts: 'GET sys/dept/list', //根据父单位id查询部门信息
  deleteDept: 'DELETE sys/dept', //删除部门信息
  importDept: 'POST sys/dept/importExcel', //岗位信息导入
  importDeptResult: 'GET sys/dept/refreshImportExcel', //岗位信息导入结果查看
  addPost: 'POST sys/post', //岗位信息新增
  updatePost: 'PUT sys/post', //岗位信息修改
  getPosts: 'GET sys/post/list', //根据父单位id查询岗位信息
  deletePost: 'DELETE sys/post', //删除岗位信息
  addUg: 'POST sys/usergroup', //岗位信息新增
  updateUg: 'PUT sys/usergroup', //岗位信息修改
  getUgs: 'GET sys/usergroup/list', //根据父单位id查询岗位信息
  deleteUg: 'DELETE sys/usergroup', //删除岗位信息
  importPost: 'POST sys/post/importExcel', //岗位信息导入
  importPostResult: 'GET sys/post/refreshImportExcel', //岗位信息导入结果查看
  test: 'GET test/test/success',
  addUser: 'POST sys/user', //用户信息新增
  getUserInfo: 'GET sys/user', //修改用户
  updateUser: 'PUT sys/user', //用户信息修改
  queryUser: 'GET sys/identity/list', //用户信息列表查询
  deleteUser: 'DELETE sys/identity', //删除用户信息
  obtainUser: 'GET sys/user/:userId', //获取某用户信息
  checkIdentityExist: 'GET sys/identity/checkIdentityExist', // 校验用户是否重复加入身份
  getOrgRefUser: 'GET sys/user/:userId', //获取某岗人信息
  importUser: 'POST sys/user/importExcel', //用户信息导入
  importUserResult: 'GET sys/user/refreshImportExcel', //用户信息导入结果查看
  uploaderFile: 'POST public/fileStorage/uploaderFile', //上传头像
  getDownFileUrl: 'POST public/fileStorage/getDownFileUrl', //上传后的下载
  login: 'POST auth/login', //登录
  logout: 'GET auth/logout', //登出
  getCtlgTree: 'GET setup/ctlg/tree', //
  getCtlgMove: 'PUT setup/ctlg/move', //业务应用类别上移下移
  ctlgBatchsort: 'PUT setup/ctlg/batchsort', //业务应用类别批量保存
  getForms: 'GET form/form/list', //获取表单版本列表
  getFormVersions: 'GET form/form/versions/list', //获取表单版本列表
  deleteForm: 'DELETE form/form', //删除自由表单
  addCtlg: 'POST setup/ctlg', //新增应用类别
  updateCtlg: 'PUT setup/ctlg', //修er改应用类别
  deleteCtlg: 'DELETE setup/ctlg', //删除应用类别
  updatePermission: 'PUT setup/ctlg/permission', //单位信息修改
  getModel: 'GET bpm/model-design/list', //获取流程模型列表  后期加
  addModel: 'POST bpm/model-design', //添加流程模型  后期加 bpm
  getBpmnEngineModel: 'GET bpm/model-design/bpmn/:id', // 获取流程设计最新xml
  addAndUpdateBpmnModelSave: 'POST bpm/model-design/bpmn-save', // 流程设计流程图保存
  getBpmnEngineDetail: 'GET bpm/model-design/details/:id', //获取流程模型明细
  changeMainVersion: 'PUT bpm/model-design/change-version/:id', // 变更主版本
  deployModel: 'GET bpm/model-design/deploy/:id', // 部署流程模型 后期加 bpm
  updateModelForm: 'PUT bpm/model-design', // 更新修改流程引擎表单
  deleteModel: 'DELETE bpm/model-design/:id', //删除流程模型  后期加 bpm
  deleteMultiple: 'DELETE bpm/model-design/batchDelete', //批量删除流程模型
  copyModel: 'POST bpm/model-design/copy', // 复制流程引擎模型
  importModel: 'POST bpm/model-design/import', // 导入流程引擎
  exportModel: 'GET bpm/model-design/export', // 导出流程引擎
  modelChangeName: 'PUT bpm/model-design/change-act-name', // 流程引擎修改节点名称
  modelReuseList: 'GET bpm/model-design/getModelProcessDefinitionList', // 流程复用列表
  // addBizModel: 'POST bpm/model/addBizSolModel', //添加流程模型(获取id)
  detailsTree: 'GET bpm/model/details/tree/:procDefId', // 获取流程模型明细节点树 后期加 bpm
  // detailsModel: 'GET bpm/model/details/:id', // 获取流程模型明细 后期加 bpm
  getDataRules: 'GET sys/dataRule', // 获取数据规则列表
  addDataRule: 'POST sys/dataRule', // 新增数据规则
  updateDataRule: 'PUT sys/dataRule', // 修改数据规则
  deleteDataRule: 'DELETE sys/dataRule', // 删除数据规则
  getSysRoles: 'GET sys/role/roles', //获取角色列表
  updateRole: 'PUT sys/role', //修改角色
  addRole: 'POST sys/role', //新增角色
  delRoles: 'DELETE sys/role', //删除角色
  copyRole: 'POST sys/role/copy', //复制角色
  getRoleUser: 'GET sys/role/users', //获取角色关联用户列表
  updateRoleUser: 'PUT sys/role/users', //修改角色关联用户
  addRegister: 'POST sys/register', //添加注册系统
  getRegister: 'GET sys/registers', //获取注册系统
  updateRegister: 'PUT sys/register', //修改注册系统
  deleteRegister: 'DELETE sys/register', //删除注册系统
  getRegisterId: 'GET sys/register/:registerId', //获取某注册系统
  getBaseset: 'GET sys/tenant/baseset/system', //查询支撑平台、业务平台、微协同基础设置
  supportBaseset: 'POST sys/tenant/baseset/support', //添加修改支撑平台基础设置（已废弃）
  bussinessBaseset: 'POST sys/tenant/baseset/bussiness', //添加修改业务平台基础设置
  deleteTenantLogo:'DELETE sys/tenant/logo', // 删除支撑平台业务平台门户等上传logo
  microBaseset: 'POST sys/tenant/baseset/micro', //添加修改微协同基础设置
  getPartability: 'GET sys/register/partability', //获取服务授权能力接口
  getLogo: 'GET sys/tenant/logo', //获取LOGO
  addLogo: 'POST sys/tenant/logo', //添加LOGO
  updateLogo: 'PUT sys/tenant/logo', //修改LOGO
  getButtons: 'GET sys/button', //按钮列表查询
  addButtons: 'POST sys/button', //按钮列表新增
  updateButtons: 'PUT sys/button', //按钮列表修改
  deleteButtons: 'DELETE sys/button', //按钮列表删除
  exportButtons: 'GET sys/exportButtonData',//按钮导出
  getButtonGroups: 'GET sys/buttonGroup', //按钮组列表查询
  addButtonGroups: 'POST sys/buttonGroup', //按钮组列表新增
  updateButtonGroups: 'PUT sys/buttonGroup', //按钮组列表修改
  deleteButtonGroups: 'DELETE sys/buttonGroup', //按钮组列表删除
  getButtonIds: 'GET sys/buttonGroup/button', //按钮组查询按钮接口
  addButtonIds: 'POST sys/buttonGroup/button', //按钮组绑定按钮
  getBtnDetailById: 'GET sys/button/:buttonId', //根据id查询按钮接口
  addMenu: 'POST sys/menu', //资源模块新增
  updateMenu: 'PUT sys/menu', //资源模块修改
  deleteMenu: 'DELETE sys/menu', //资源模块删除
  getMenu: 'GET sys/menus', //资源模块获取
  getMenuId: 'GET sys/menu/:menuId', //获取模块资源信息
  menuMove: 'PUT sys/menu/move', //资源模块上移下移
  menuSort: 'PUT sys/menu/menuSort', //批量保存
  getSysRegister: 'GET sys/role/getSysRegister', // 获取角色注册系统
  getSysByMenus: 'GET sys/role/getSysByMenus', // 获取系统模块资源
  getRoleMenus: 'GET sys/role/menus', // 获取角色关联模块资源及按钮
  updateRoleMenus: 'PUT sys/role/menus', //修改角色关联模块资源及按钮
  getDatarule: 'GET sys/role/datarule', // 获取角色关联数据规则
  updateDatarule: 'PUT sys/role/datarule', // 修改角色关联数据规则
  getInfoByDataRuleType: 'GET sys/dataRule/infoByDataRuleType', // 通过数据类型获取数据规则信息
  getDataRuleInfo: 'GET sys/dataRule/:dataRuleId', //获取数据规则详情
  setDataRule: 'PUT sys/dataRule/info', //数据规则定义
  getTableColumns: 'GET sys/table/columns', //获取数据规则表列信息
  testSql: 'GET sys/table/sqlTest', //获取sql测试结果
  addCodeRule: 'POST form/codeRule', //新增编号
  updateCodeRule: 'PUT form/codeRule', //修改编号
  deleteCodeRule: 'DELETE form/codeRule', //删除编号
  getCodeRule: 'GET form/codeRule/list', //编号分类查询
  getCodeRuleInfo: 'GET form/codeRuleInfo', //编号规则查询
  addCodeRuleInfos: 'POST form/codeRuleInfos', //绑定编号规则
  getCodeRuleInfos: 'GET form/codeRuleInfos', //获取绑定规则
  addTenantSign: 'POST sys/tenant/sign', //添加手写签批样式管理
  updateTenantSign: 'PUT sys/tenant/sign', //修改手写签批样式管理
  getTenantSign: 'GET sys/tenant/sign', //获取手写签批样式管理
  getDictTypeTree: 'GET sys/dictType/tree', //获取枚举类型树
  addDictType: 'POST sys/dictType', //创建枚举类型
  deleteDictType: 'DELETE sys/dictType', //删除枚举类型
  updateDictType: 'PUT sys/dictType', //修改枚举类型信息
  getDictList: 'GET sys/dict/list', //获取全部枚举类型及详细信息
  getDictType: 'GET sys/dictType/:dictTypeCode', //获取枚举类型的详细信息
  addDictInfo: 'POST sys/dictInfo', //创建枚举详细信息
  deleteDictInfo: 'DELETE sys/dictInfo', //删除枚举详情
  updateDictInfo: 'PUT sys/dictInfo', //修改枚举详细信息
  moveDictInfo: 'PUT sys/dictInfo/move', //码表详细信息上移下移
  getDictInfoName: 'GET sys/dictInfo/name', //获取全部枚举详细信息的中文名称
  getBusinessList: 'GET setup/bizSol/list', //获取业务应用
  addBizSol: 'POST setup/bizSol', //新增业务应用
  updateBizSol: 'PUT setup/bizSol', //修改业务应用
  delDizSol: 'DELETE setup/bizSol/:bizSolId',
  getPasswordPolicy: 'GET sys/tenant/password', //获取密码管理
  savePasswordPolicy: 'POST sys/tenant/password', //保存/修改密码管理
  addSysCtlg: 'POST setup/ctlg', //保存业务应用类别
  updateSysCtlg: 'PUT setup/ctlg', //修改业务应用类别
  delSysCtlg: 'DELETE setup/ctlg', //删除业务应用类别
  updateSysCtlgPermission: 'PUT setup/ctlg/permission', //增加业务应用类别区分单位操作权限
  getSysCtlgPermission: 'GET setup/ctlg/permissions', //获取单个业务应用类别权限
  getSysCtlgTree: 'GET setup/ctlg/tree', //获取业务应用类别树
  addBusinessForm: 'POST setup/businessForm', //新增业务表单
  updateBusinessForm: 'PUT setup/businessForm', //修改业务表单
  delBusinessForm: 'DELETE setup/businessForm', //删除业务表单
  getBusinessForm: 'GET setup/businessForm/:ctlgId', //根据业务应用类别ID查询业务表单
  getBusinessFormNew: 'GET setup/businessForm/type/:ctlgId', //根据业务应用类别ID查询业务表单new
  getBusinessFormTable: 'GET setup/businessForm/table', //查询表绑定的业务表单
  getBpmflagAndBasicflag: 'GET setup/bizSol/bpmflag-and-basicflag/:id', //获取业务方案是否有流程和是否基础数据
  getDatasourceTree: 'GET form/datasource/tree', //获取数据源树
  getDatasourceField: 'GET form/datasource/field', //获取字段列表
  addDatasourceIndexes: 'POST form/datasource/table/indexes', //创建索引
  updateDatasourceIndexes: 'PUT form/datasource/table/indexes', //修改索引
  delDatasourceIndexes: 'DELETE form/datasource/table/indexes/:id', //删除索引
  getDatasourceIndexes: 'GET form/datasource/table/indexes/:tableId', //根据TABLE_ID获取已创建表索引
  getDatasourceTableField: 'GET form/datasource/table/field/:colId', //根据ID获取字段
  addDatasourceTableField: 'POST form/datasource/table/field', //添加字段
  updateDatasourceTableField: 'PUT form/datasource/table/field', //修改字段
  delDatasourceTableField: 'DELETE form/datasource/table/field/:colId', //删除字段
  getDatasourceTable: 'GET form/datasource/table/:id', //根据ID获取物理表
  addDatasourceTable: 'POST form/datasource/table', //添加物理表
  updateDatasourceTable: 'PUT form/datasource/table', //修改物理表
  delDatasourceTable: 'DELETE form/datasource/table/:tableId', //删除物理表
  addDatasourceTableCopy: 'POST form/datasource/copyTableStructure', //复制物理表
  getDataSourceList: 'GET form/datasource/list', //获取数据源列表
  getDatasourceTableExport: 'GET form/datasource/table/export/:tableId', //导出物理表
  addDatasourceTableImport: 'POST form/datasource/table/import', //导入物理表
  getDatasource: 'GET form/datasource/:id', //根据ID获取数据源
  addDatasource: 'POST form/datasource', //添加数据源
  updateDatasource: 'PUT form/datasource', //修改数据源
  delDatasource: 'DELETE form/datasource/:id', //删除数据源
  addDatasourceTest: 'POST form/datasource/test', //数据源测试接口
  getBizSolFormConfig: 'GET setup/bizSol/bussinessForm/cfg/:bizSolId', //获取业务应用表单配置信息
  getBusinessFrom: 'GET setup/businessForm/:ctlgId', //根据业务应用类别ID查询业务表单
  saveBussionFromInfo: 'POST setup/bizSol/bussinessForm', //保存业务应用表单配置信息
  syncVersionCfg: 'PUT setup/bizSol/bussinessForm/sync-version-cfg', // 同步业务应用表单版本配置
  getAuthority: 'GET form/authority', //获取权限绑定
  getColAuthorty: 'GET form/colAuthority/:bizSolId', //列绑定数据
  updateAuth: 'POST form/authority', //权限绑定
  getBizSolInfo: 'GET setup/bizSol/:bizSolId', //获取业务应用
  getBindformCode: 'GET form/formCode', //查询编号的绑定数据
  saveFromCode: 'POST form/formCode', //编号绑定
  getTentant: 'GET sys/tenant/mark', //通过访问地址获取租户
  getIdentity: 'GET sys/user/identity', //获取用户身份列表
  addIdentity: 'POST sys/user/identity', //保存用户身份信息
  getLoginConfig: 'GET sys/tenant/config/login', //获取登录方案配置
  getSystemBaseset: 'GET sys/tenant/baseset/system', //获取系统基础配置
  verifyModel: 'GET form/listModel/table', //验证表是否能成树
  getFormListModel: 'GET form/listModel/list', //查询列表建模
  addFormListModel: 'POST form/listModel', //新增列表建模
  deleteFormListModel: 'DELETE form/listModel', //删除列表建模
  updateFormListModel: 'PUT form/listModel', //修改列表建模
  designFormListModel: 'PUT form/listModel/info', //设计列表建模
  getFormListModelInfo: 'GET form/listModel/info', //设计列表建模
  getDataSourceTree: 'GET form/datasource/tree', //获取数据源树
  getDataSourceField: 'GET form/datasource/field', //获取低端列表
  getListModelCols: 'GET form/listModel/cols', //列表建模树获取表字段
  getTableColumnsFormId: 'GET form/form/tableColumns', //获取表单关联数据建模列数据
  getBizSolList: 'GET setup/bizSol/title', //获取业务应用标题设计
  saveTitle: 'POST setup/bizSol/title', //保存业务应用标题设计
  getEventTableData: 'GET setup/event/list', //获取事件注册分页数据
  addEventRegister: 'POST setup/event', //新增事件注册
  updataEventRegister: 'PUT setup/event', //更新事件注册
  deletaEventRegister: 'DELETE setup/event', //删除事件注册
  deleteOneEventRegister: 'DELETE setup/event/:id', //删除单个事件注册
  getEventRegisterParams: 'GET setup/event/param/list', //获取事件注册参数
  getDataDriverList: 'GET form/dataDrives', //查询数据驱动所有列表
  getWorkRuleById :'GET bpm/workRuleRefRole/workRuleRoleIds',// 根据事项规则id获取关联角色信息
  getAllWorkRule:'GET sys/user/role/partrole', // 获取所有列表角色
  saveWorkRule:'POST bpm/workRuleRefRole', // 事项规则关联角色保存
  getPlugTypeList: 'GET public/plugType/login/list', //查询插件类型列表
  addPlugType: 'POST public/plugType', //添加插件分类
  changePlugType: 'PUT public/plugType', //添加插件分类
  removePlugType: 'DELETE public/plugType', //添加插件分类
  getPlugList: 'GET public/plug/list', //查询插件列表
  getPlugListLogin: 'GET public/plug/listLogin',
  addPlug: 'POST public/plug', //添加插件
  changePlug: 'PUT public/plug', //修改插件
  deletePlug: 'DELETE public/plug', //删除插件
  enablePlug: 'PUT public/plug/enable', //启用插件
  movePlug: 'PUT public/plug/move', //移动插件
  getDept: 'GET sys/dept/:deptId', //根据父单位id查询部门信息
  addSysUserGroup: 'POST sys/usergroup', //添加用户组
  updateUserGroup: 'PUT sys/usergroup', //修改用户组
  deleteUserGroup: 'DELETE sys/usergroup', //删除用户组(支持批量)
  getSysUserGroupSearchWord: 'GET sys/usergroup/list', //获取用户组列表
  getSysUserGroup: 'GET sys/usergroup/:ugId', //获取某用户组信息
  addSysUserGroupSaveUsers: 'POST sys/usergroup/user', //保存用户组关联用户
  getUserByGroupId: 'GET sys/usergroup/user/:userGroupId', //获得用户组关联的用户信息
  getAllBusinessFrom: 'GET setup/businessForm/getAllBusinessForm', //根据业务应用类别ID查询所有业务表单
  getProcessDiagram: 'GET bpm/model/process/:procDefId/diagram', //获取流程图
  getBizSolFormConfigProDef: 'GET setup/bizSol/bussinessForm', //获取业务应用表单指定版本配置信息
  getFormDataDrive: 'GET form/dataDrive/list', //获取数据驱动列表
  getDataDrives: 'GET form/dataDrives', //获取数据驱动所有列表
  addDataDriver: 'POST form/dataDrive', //新增数据驱动方案
  getDataDriverById: 'GET form/dataDrive/:dataDriveId', //根据id获取方案信息
  updateDataDrive: 'PUT form/dataDrive', //修改数据驱动方案
  deleteDataDrive: 'DELETE form/dataDrive', //删除数据驱动
  getFormTableColumns: 'GET form/form/tableColumns/:deployFormId', //获取应用建模关联数据建模列数据
  getImgNode: 'GET bpm/model/process/:procDefId/diagram-node', //获取流程节点信息
  getNodeBase: 'GET setup/bizSol/node/base', //获取业务应用节点基本信息
  getBizSolTree: 'GET setup/bizSol/tree', //获取业务应用树
  getUserRole: 'GET sys/user/role', //获取用户关联角色列表
  addUserRole: 'POST sys/user/role', //新增用户角色
  getUserPartRole: 'GET sys/user/role/partrole', //获取所有角色
  updateNodeBase: 'PUT setup/bizSol/node/base', //保存业务应用节点基本信息
  getNodeEvent: 'GET setup/bizSol/node/event', //获取事件注册
  getNodeEvent: 'GET setup/bizSol/node/event', //获取事件节点
  addNodeEvent: 'POST setup/bizSol/node/event', //保存事件节点
  deleteNodeEvent: 'DELETE setup/bizSol/node/event', //删除事件节点
  getHistoryList: 'GET bpm/model/history/:key/list', //切换版本
  getEventList: 'GET setup/event/list', //获取事件注册数据
  getUserMenu: 'GET sys/user/menu', //获取用户所属角色的模块资源
  getUserUserGroup: 'GET sys/user/usergroup', //获取用户关联用户组信息
  addUserUserGroup: 'POST sys/user/usergroup', //设置用户关联用户组
  getIsNocheck: 'GET sys/user/identity/nocheck', //取消岗位身份树勾选
  addLeavepost: 'POST sys/user/identity/leavepost', //用户离岗操作
  recoverPost: 'PUT sys/user/identity/leavepost', //用户复岗操作
  getFormColumns: 'GET form/form/columns/:deployFormId', //获取发布表单关联数据建模列数据
  getNodeUser: 'GET setup/bizSol/node/user', //获取业务应用节点人员配置
  addNodeUser: 'POST setup/bizSol/node/user', //保存业务应用节点人员配置
  getHolidays: 'GET public/calendarHoliday/list', //获取节假日列表
  addHoliday: 'POST public/calendarHoliday', //添加节假日
  updateHoliday: 'PUT public/calendarHoliday', //修改节假日
  deleteHoliday: 'DELETE public/calendarHoliday', //删除节假日
  setMainVersion: 'PUT form/mainVersion/:deployFormId', //设置主版本
  getUserDentityList: 'GET sys/user/myIdentity/list', //获取当前登录用户身份列表
  getUserMenus: 'GET sys/user/menu/tree', //根据当前切换的身份获取菜单及按钮
  getOrgPermissionAuth: 'GET ', //获取组织机构只读编辑权限
  getFormDetail: 'GET form/form/:formId',
  getUsersByIds: 'GET sys/identity/list', //根据岗人ID集合获取岗人详情
  getUsergroupByIds: 'GET sys/usergroup/findInfoByIds', //根据用户组ID集合获取用户组详情
  getOrgByIds: 'GET sys/org/findInfoByIds', //根据单位ID集合获取单位详情
  getPostByIds: 'GET sys/post/findInfoByIds', //根据岗位ID集合获取岗位详情
  getDeptByIds: 'GET sys/dept/findInfoByIds', //根据部门ID集合获取部门详情
  getRuleByIds: 'GET sys/role/findInfoByIds', //根据角色ID集合获取角色详情
  findPermissionAuth: 'GET sys/org/findPermissionAuth', //获取组织机构只读编辑去权限
  getAllControls: 'GET form/controls', //获取所有控件信息
  addControl: 'POST form/control', //保存控件
  updateControl: 'PUT form/control', //更新控件
  deleteControl: 'DELETE form/control', //删除控件
  getComponentsList: 'GET form/components', //获取所有组件列表
  getComponentsById: 'GET form/controlRef', //获取当前控件绑定的组件列表
  updateComponentsById: 'POST form/controlRef', //更新当前控件绑定组件信息
  getButtonsByGroup: 'GET sys/buttonGroup/button', //按钮组查询按钮对象接口
  getButtonAuth: 'GET form/buttonAuth/:bizSolId', //获取按钮权限绑定
  updateButtonAuth: 'POST form/buttonAuth/:bizSolId', //按钮权限绑定
  orgExport: 'GET sys/org/export', //单位导出
  deptExport: 'GET sys/dept/export', //部门导出
  postExport: 'GET sys/post/export', //岗位导出
  userExport: 'GET sys/user/export', //用户导出
  orgChart: 'GET sys/org/chart', //查看组织结构图
  formMateData: 'GET form/form/mateData/:bizSolId', //根据业务方案ID获取相应的表的数据拼接
  orgEnable: 'PUT sys/org/enable', //单位部门启用停用
  orgSort: 'PUT sys/org/sort', //单位部门排序
  postEnable: 'PUT sys/post/enable', //岗位启用停用
  postSort: 'PUT sys/post/sort', //岗位排序
  userEnable: 'PUT sys/identity/enable', //用户启用停用
  userSort: 'PUT sys/identity/sort', //用户排序
  getGlobalReviewerList: 'GET sys/globalChecker/list', //获取全局审核人
  addGlobalReviewer: 'POST sys/globalChecker',
  changeGlobalReviewer: 'PUT sys/globalChecker',
  removeGlobalReviewer: 'DELETE sys/globalChecker',
  getGlobalReviewerIdentity: 'GET sys/globalChecker/identity',
  saveGlobalReviewerIdentity: 'PUT sys/globalChecker/identity',
  getVersionList: 'GET setup/businessForm/versions/list', //获取业务表单版本号
  getCurrentUserInfo: 'GET sys/user/info', //获取当前登录用户信息
  updatePassword: 'PUT sys/user/password', //修改密码
  getRegisterByCode: 'GET sys/register/getRegisterByCode', //通过注册系统code获取系统信息
  updateLicense: 'PUT sys/tenant/license/update', //租户授权更新
  getWorkRule: 'GET bpm/workRule', //业务分组查询
  getBizSolTree: 'GET setup/bizSol/tree', //业务应用树
  getBizSolRule: 'GET bpm/workRule/bizSol', //通过事项规则(业务分组)查询分类
  addGroupName: 'POST bpm/workRule', //业务分组新增
  updateGroupName: 'PUT bpm/workRule', //业务分组更新(业务分组重命名、业务分组是否可见)
  deleteGroup: 'DELETE bpm/workRule', //业务分组删除
  saveRuleBizSol: 'PUT bpm/workRule/bizSol', //业务分组勾选分类
  deleteNodeAuth: 'DELETE form/authority', //删除权限
  getPushInfoBind: 'GET form/pullData/pushInfoBind/:bizSolId', //查询推送方案绑定
  savePushInfoBind: 'POST form/pullData/pushInfoBind/:bizSolId', //保存推送方案绑定
  saveBizSolEvent: 'POST setup/bizSol/event', //保存事件注册流程绑定信息
  getBizSolEvent: 'GET setup/bizSol/event', //保存推送方案绑定
  deleteBizSolEvent: 'DELETE setup/bizSol/event', //保存推送方案绑定
  submitButtonAuth: 'POST form/buttonAuth/:bizSolId', //按钮权限绑定
  getTenantLicense: 'GET lock/tenant/license', //查看租户信息
  recoverMenu: 'PUT sys/menu/recover', //模块恢复
  saveStringUpload: 'POST public/fileStorage/fileio', //流上传
  copyRule: 'POST setup/rule/copy', //复制规则定义
  saveRule: 'POST setup/rule', //添加规则定义
  getRule: 'GET setup/rule', //获取规则定义
  getFormTreeColumns: 'GET form/form/treeColumns/:deployFormId', //获取表单的树控件字段
  exportForm: 'GET form/form/export', //导出表单
  importForm: 'POST form/form/import', //导入表单
  // presignedUploadUrl: 'POST public/fileStorage/presignedUploadUrl',//文件预上传接口
  presignedUploadUrl: 'POST public/fileStorage/presigned', //文件预上传接口
  getFormTableList: 'GET form/form/table/list', //获取表单关联数据表
  updateTableLayout: 'POST sys/table/layout', //桌面布局设置保存
  getTableLayout: 'GET sys/table/layout', //获取桌面布局设置
  getBussinessFormList:
    'GET setup/bizSol/bussinessForm/list/bizsol/:deployFormId', //获取自由表单绑定的业务应用相关信息
  getPagingList_CommonDisk: 'GET public/commondisk', //获取分页列表
  uploadFileio: 'POST public/fileStorage/fileio', //流上传
  readFileContent: 'GET public/fileStorage/readFileContent', //文件读取
  getGateWayNodeBase: 'GET setup/bizSol/gateway/cfg', //网关配置获取
  saveGateWayParams: 'POST setup/bizSol/gateway/param', //网关参数新增保存
  updateGateWayParams: 'PUT setup/bizSol/gateway/param', //网关参数更新保存
  delParam: 'DELETE setup/bizSol/gateway/param', //网关参数删除
  getFormcolumns: 'GET form/form/columns/:deployFormId', //获取发布表单关联数据建模列数据
  saveGateWay: 'PUT setup/bizSol/gateway/cfg', //网关配置保存
  // getFileMD5: 'GET public/fileStorage/getfileencryption',//根据文件md5查询是否存在该文件
  getFileMD5: 'GET public/fileStorage/presigned/fileencryption', //根据文件md5查询是否存在该文件
  getUploadURLisReal: 'GET public/fileStorage/bucketExists', //判断上传路径是否存在
  getFileMerage: 'GET public/fileStorage/compare', //根据文件路径合并文件
  // storingFileInformation: 'POST public/fileStorage/saveFileStorage',//存储文件信息到数据库接口
  storingFileInformation: 'POST public/fileStorage/file', //存储文件信息到数据库接口
  updateLoginConfig: 'POST sys/tenant/config/loginset', // 保存/修改登录方案设置
  getControlManagementList: 'GET form/businessControl', //获取业务控件列表
  deleteControl: 'DELETE form/businessControl', //删除业务控件
  addBusinessControl: 'POST form/businessControl', //新增业务控件
  getDetailControl: 'GET form/businessControl/:id', //获取单个控件信息
  updateBusinessControl: 'PUT form/businessControl', //修改业务控件
  getSystemAccessList: 'GET sys/third-party/app', //获取第三方应用信息列表
  deleteSystemAccess: 'DELETE sys/third-party/app/:id', //删除第三方应用
  getDatailSystem: 'GET sys/third-party/app/:id', //获取单条第三方应用信息
  addSystemAccess: 'POST sys/third-party/app', //新增第三方应用
  updateSystemAccess: 'PUT sys/third-party/app', //更新第三方应用
  putDownLoad_CommonDisk: 'GET public/commondisk/down', //下载
  getFileLengthURL_CommonDisk: 'GET public/commondisk/downfilelenth', //获取文件大小（公共云盘）
  AddBpmnByKey: 'POST bpm/model-design/addBizSolModel', //通过key新增流程图
  // addBpmnBySave: 'POST bpm/model-design', // 保存流程图文件
  // updateBpmnBySave: 'PUT bpm/model-design', // 保存更新流程图文件
  getBpmnNewDiagram:
    'GET bpm/model-design/process-definition/:procDefId/xml-str', // 获取新的流程图
  getBpmnProcessDefinitions: 'GET bpm/model-design/processDefinitions/:key', // 获取已发布的流程定义列表 切换版本新
  getChangeActSort: 'PUT bpm/model-design/change-act-sort/:id', // 获取流程排序
  // addBpmnEngine:  'GET bpm/model-design',// 流程引擎新增
  getApplyCorrelationList: 'GET setup/bizAssocLogic/list', //获取业务应用关联List
  exportApplyCorrelation:'GET setup/bizAssocLogic/LogicAndRelationData',//业务应用关联导出
  addApplyCorrelation: 'POST setup/bizAssocLogic', //业务应用关联保存
  updateApplyCorrelation: 'PUT setup/bizAssocLogic', //业务应用关联修改
  deleteApplyCorrelation: 'DELETE setup/bizAssocLogic', //业务应用关联删除
  getLogicCode: 'GET setup/bizAssocLogic/getLogicCode', //获取逻辑编码
  getFormMenu: 'GET form/form/table/:bizSolId', //根据业务应用id获取表单的所有表信息
  saveConfig: 'POST setup/bizRelation', //业务应用关联配置保存
  getDetailConfig: 'GET setup/bizRelation/list/:logicCode', //根据 logicCode 获取配置详情列表
  getRelationApply: 'GET setup/bizAssocLogic/logicList', //获取关联的应用集合
  getDeployFormId: 'GET form/form/deployFormId', // 获取发布自由表单id
  getFromColumnsAll: 'GET form/form/columns/all', // 获取发布表单的所有列数据
  createPrintTemplate: 'POST report/print/template', // 保存表单打印模板
  getPrintTemplate: 'GET report/print/template/:id', // 获取打印模板
  previewPrintTemplate: 'GET report/print/template/preview/:id', // 打印预览
  deleteBatchBiz: 'DELETE setup/bizSol/batch-delete', //批量删除业务应用
  getSystemAccessList: 'GET sys/third-party/app/list', //获取第三方应用信息列表
  deleteSystemAccess: 'DELETE sys/third-party/app/:id', //删除第三方应用
  getDatailSystem: 'GET sys/third-party/app/:id', //获取单条第三方应用信息
  addSystemAccess: 'POST sys/third-party/app', //新增第三方应用
  updateSystemAccess: 'PUT sys/third-party/app', //更新第三方应用
  deleteSysIds: 'DELETE sys/third-party/app/batch', //删除多条
  getOpenSystemList: 'GET sys/third-party/client/list', //获取第三方客户端信息列表
  deleteOpenSystem: 'DELETE sys/third-party/client/:clientId', //删除第三方客户端
  addOpenSystem: 'POST sys/third-party/client', //新增第三方客户端
  getDetailOpenSystem: 'GET sys/third-party/client/:clientId', //获取第三方客户端信息
  updateOpenSystem: 'PUT sys/third-party/client', //更新第三方客户端
  deleteOpenSysIds: 'DELETE sys/third-party/client/batch', //批量删除
  getFormOtherVersions: 'GET setup/businessForm/other', //查询非主版本的业务表单
  getGatewayOutFlows: 'GET bpm/flowable/getGatewayOutFlows', //获取网关出口流
  updateGatewayOutFlowsOrder: 'PUT bpm/flowable/updateGatewayOutFlowsOrder', //更新网关出口流顺序
  deleteModelDeployInfo: 'DELETE bpm/model-design/deleteModelDeployInfo', //删除流程模型已发布的指定版本流程定义
  getBussinessFormByBizFormId: 'GET setup/bizSol/bussinessForm/:bizSolFormId', //通过主键获取业务应用表单版本信息
  reuseExport: 'POST setup/biz-sol/reuseExport', //发布业务应用到模型库
  bizSolExport: 'GET setup/biz-sol/export',  //导出业务应用
  bizSolImport: 'POST setup/biz-sol/import', //导入业务应用
  checkBizSolImportStatus: 'GET setup/biz-sol/import/status', //检查业务应用导入状态
  getSystemSortList: 'GET sys/registers/buss', //分页获取业务平台标识系统信息
  sortSystemList: 'PUT sys/register/sort', //批量修改系统排序信息
  geCheckRule: 'POST sys/check/menu', //校验模块资源
  updateDeleteMenu: 'PUT sys/updateDelete/menu', //修改删除的模块资源为未删除
  getIdentityDatarule: 'GET sys/datarule/identity', //根据当前菜单获取当前登录人的数据规则
  resetPassword: 'POST sys/user/resetPassword', //重置密码
  resetLoginNum: 'POST auth/user/resetLoginNum', //重置登录次数
  datasetAndResult: 'GET report/print/datasetAndResult/list/:templateId', // 获取bean数据集
  createDataset: 'POST report/print/dataset/create/java-class', // 保存bean集
  getBeanResult: 'GET report/print/dataset/:datasetId', // 获取bean信息
  getEventList: 'GET setup/event/list', // 获取事件列表
  getEventDetail: 'GET setup/event/:eventId', // 获取事件信息
  deleteEvent: 'DELETE report/print/dataset/:datasetld', // 删除事件集
  getAllCol:'GET form/form/columns/all',//获取发布表单的所有列数据
  // copyConfigDetail:'GET bpm/model/process/:procDefId/diagram-node',//流程模型详情_copy
  copyNodeConfig:'PUT setup/bizSol/node/cfg-copy',//复制节点配置
  getApiManageList:'GET report/apiManage/api/list',//分页获取所有的api接口
  deleteApiManage:'DELETE report/apiManage/api',//删除api接口
  addApiManage:'POST report/apiManage/api',//新增接口（包含参数和结果集）
  updateApiManage:'PUT report/apiManage/api',//修改接口（包含参数和结果集）
  getDetailApiManage:'GET report/apiManage/api/:apiId',//根据id获取api接口
  getRoleIdentityList:'GET sys/role/identity/list',//根据角色获取关联的身份信息
  addColumn:'POST sys/desk/section',//添加栏目接口
  delColumn:'DELETE sys/desk/section',//删除栏目接口
  updateColumn:'PUT sys/desk/section',//修改栏目接口
  getColumnList:'GET sys/desk/section/list',//获取栏目信息列表(分页)
  getIncompatibleList: 'GET sys/incompatible/list',// 不相容设置规则列表
  addIncompatible :'POST sys/incompatible', // 新增不相容设置规则
  getIncompatibleRefList:'GET sys/incompatible/refObjList', // 获取不相容规则列表
  updateIncompatible :'PUT sys/incompatible', // 编辑不相容规则
  deleteIncompatible : 'DELETE sys/incompatible',// 删除不相容规则
  getIncompatibleWarnList :'GET sys/incompatible/Forewarn', // 获取不相容规则预警列表
  updateCurrentList :'POST sys/incompatible/Forewarn', // 当前列表更到最新
  getFunctionClassifyList :'GET sys/functionType/list', // 获取职能分类列表
  postAddFunctionType :'POST sys/functionType', // 新增职能分类
  deleteFunctionType :'DELETE sys/functionType', // 删除职能分类
  isEnableFunctionType :'PUT sys/functionType/enable', // 是否启用职能分类
  putFunctionType:'PUT sys/functionType', // 编辑修改职能分类
  bindPostFunctionType:'POST sys/functionType/refMenu', // 绑定模块资源
  findBindResource:'GET sys/functionType/refMenuList',// 查询已绑定的模块资源

  getOrgTree:'GET sys/v1/org/tree',//单位树v1
  getOrgTreeList:'GET sys/v1/org/list',//单位列表树v1
  getDatasourceList:'GET form/datasource/tenant/tree',//根据租户获取数据源树

  getBizSolVersionList:'GET setup/bizSol/bussinessForm/main-version-list',//查询使用同一表单发布ID的主版本配置业务应用列表
  saveBizSolNode:'PUT setup/bizSol/node/other-bizsol/cfg-copy',//复制节点配置-跨应用
  addScene:'POST sys/scene',//场景新增
  updateScene:'PUT sys/scene',//场景修改
  delScene:'DELETE sys/scene',//场景删除
  getSceneList:'GET sys/scene/list',//场景查询
  getSceneSingle:'GET sys/scene',//单场景查询
  sceneEnable:'PUT sys/scene/isenable',//场景启用停用
  sceneRefPost :'POST sys/scene/refpost',// 场景关联岗位
  getScenePost :'GET sys/scene/refpost', // 获取场景关联岗位id

  getApplyFieldsList:'GET form/form/table/columns',//获取应用字段列表
  getMenusObj:'GET sys/menu/registerIdMenu',//上下文 loginRegisterId 获取对应的menu菜单

  saveBelongOrg: 'POST sys/belong/org', // 保存归属单位
  queryBelongOrg: 'GET sys/belong/org', // 查询归属单位
  getServiceTree:`GET tom/service/tree`,
  getPublishList:'GET setup/bizSol/publishable/list',//获取可发布的业务应用分页列表
  releaseBizToAbility:'POST setup/biz/release',//发布业务应用到能力
  getAbilityList:'GET tom/biz/ability/list',//获取应用能力
  updateAbilitySort:'PUT tom/ability/sort',//能力排序修改
  getPublishTreeList:'GET tom/biz/ag/tree',//获取更新应用能力组相关树结构（只获取已经有能力得能立组）
  updateBizAbility:'PUT setup/biz/release',//更新业务应用到能力
  getPublishRecordList:'GET setup/biz/release/logs',//应用发布记录

  getChartList:'GET form/chart',//查询图表列表
  saveChart:'POST form/chart',//保存图表方案
  updateChart:'PUT form/chart',//更新图表方案
  delChart:'DELETE form/chart',//删除图表方案
  getNormLogList: 'GET ic/normLog/list',//获取预算指标日志
  getLoginAuditLog: 'GET public/sysAudit/loginAudit',//系统审计-登录审计日志
  auditBatchDelete:'POST public/sysAudit/batchDelete',// 审计日志批量删除
  getPubSysBusinessOpera:'GET public/sysAudit/sysBusinessOpera',//系统管理员业务操作日志全文检索
  getPubSafeBusinessOpera:'GET public/sysAudit/safeBusinessOpera',//安全管理员业务操作日志全文检索
  validateMenuLink: 'GET ic/menu/linkValidate',// 菜单授权验证
  getXxlJobList: 'GET public/xxl-job-admin/jobinfo/pageList',// 获取xxlJob任务详情
  getXxlJobGroup: 'GET public/xxl-job-admin/jobinfo/jobGroup/',// 获取xxlJob执行器
  addJobInfo: 'POST public/xxl-job-admin/jobinfo/add/',// 新增xxlJob任务
  jobTrigger: 'POST public/xxl-job-admin/jobinfo/trigger/',//xxlJob任务执行一次
  jobStart: 'POST public/xxl-job-admin/jobinfo/start/',// xxlJob任务启动
  jobStop: 'POST public/xxl-job-admin/jobinfo/stop/',// xxlJob任务停止
  deleteJobInfo: 'POST public/xxl-job-admin/jobinfo/remove/',// xxlJob删除

  getFuncLibList:'GET sys/funcLib',//查询函数
  getFuncLibById:'GET sys/funcLib/:funcLibId',//根据函数库ID查询函数库
  saveFuncLib:'POST sys/funcLib',//保存函数
  updateFuncLib:'PUT sys/funcLib',//更新函数
  delFuncLib:'DELETE sys/funcLib',//删除函数
  exportFunclib:'GET sys/funcLib/exportFuncLibData',//导出函数库

  getDataRuleMenuList:'GET sys/role/getRoleRefMenuByRole',//根据角色ID查询查询关联菜单

  getBussMenuList:'GET sys/app/menuList',//获取业务应用建模类型列表
  getMicMenuIds:'GET sys/app/findCite',//查找微协同注册ID引用菜单
  getMobileBillingTag:'GET sys/app/isBill',//检查当前用户是否可以进行开单操作

  isOrgCenterShareOrg:'GET sys/tenant/isOrgCenterShareOrg',//判断共享租户是否关联单位
  getAttAuthList:'GET form/authority/other',//获取关联文档等其他权限
  updateOtherAuth:'POST form/authority/other/type',//保存关联文档等其他权限
  getAttAuthority:'GET form/authority/other/all',//获取关联文档的其他的权限集合

  getNormAuxList:'GET ic/normAux/list',// 获取辅助核算项列表
  getNormAuxTable:'GET ic/normAux/getNormAuxTable',// 获取表
  getNormAuxDict:'GET ic/normAux/getNormAuxDict',// 获取辅助核算项
  getNormAuxTableColumn:'GET ic/normAux/getNormAuxTableColumn',// 获取表中的列
  saveNormAux:'POST ic/normAux',//保存辅助核算项配置
  getByTableCode:'GET ic/normAux/getByTableCode',//修改根据表名获取配置信息
  deleteNormAuxByTableCode:'DELETE ic/normAux/deleteByCodes',//根据表名删除辅助核算项
  getAttachmentTemplate:'GET setup/bizSol/attachment/template',//获取业务应用附件模板
  saveAttachmentTemplate:'POST setup/bizSol/attachment/template',//保存业务应用附件模板
  deleteAttachmentTemplate:'DELETE setup/bizSol/attachment/template/:id',//删除业务应用附件模板
};
