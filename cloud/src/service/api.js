/**
 * api定义，规则为：method apiname
 */
export default {
  login: "POST auth/login",//登录
  logout: "GET auth/logout",//登出
  getTenants:'GET sys/tenant/list',//获取租户信息列表
  getOrgCenters:'GET sys/tenant/list',//获取组织中心列表(分页查询)
  addOrgCenters:'POST sys/orgCenter',//添加组织中心
  updateOrgCenters:'PUT sys/orgCenter',//修改组织中心
  deleteOrgCenters:'DELETE sys/orgCenter',//删除组织中心
  getOrgByCenter:'GET sys/org/tree',//搜索组织机构树
  updateTenant:'PUT sys/tenant',//修改租户信息
  getUsers:"GET sys/user/cloudUser/list",//获取云平台用户管理列表
  getIdUsers:"GET sys/user/:userId",//获取某用户信息
  addUsers:"POST sys/user/cloudUser",//新增用户（云管理）
  updateUsers:"PUT sys/user",//修改用户
  getUserInfo:"GET sys/user",//修改用户
  orgEnable: 'PUT sys/org/enable', // 组织中心启用停用
  identityEnable: 'PUT sys/identity/enable',// 用户启用停用
  postEnable: 'PUT sys/post/enable',// 岗位启用停用
  removeUsers:"DELETE sys/user/removeUser",//移除用户
  joinUsers:"POST sys/identity/user",//加入用户
  deleteUsers:"DELETE sys/identity",//删除用户
  userMgDeleteUsers:"DELETE sys/user/cloudUser",// 用户管理删除用户
  batchUsers:"POST sys/user/joinTenant",//批量加入用户
  getUser:"GET sys/identity/list",//获取用户管理列表
  getPosts:"GET sys/post/list",//获取岗位列表
  addPosts:"POST sys/post",//添加岗位
  updatePosts:"PUT sys/post",//修改岗位
  deletePosts:"DELETE sys/post",//删除岗位
  getPostsId:"GET sys/post/:postId",//获取某岗位信息
  getTenantOrg: "GET sys/tenant/org",//获取单位组织树
  getOrgChildren: "GET sys/org/children",//点击单位组织树缩进
  getDept: "GET sys/dept/:deptId",//获取某部门
  getOrg: "GET sys/org/:orgId",//获取某单位
  addOrgChildren: "POST sys/org/addManageOrg",//添加单位（云管理）
  addDept: "POST sys/dept",//添加部门
  updateDept: "PUT sys/dept",//修改部门
  updateOrgChildren: "PUT sys/org",//修改单位
  deleteOrgDept: "DELETE sys/org",//删除单位部门
  getOrgShare: "GET sys/orgCenter/:orgCenterId",
  submitTenantOrg:'POST sys/tenant/org',//保存/修改共享组织勾选单位
  getShareOrgInfo:'GET sys/tenant/org',//获取共享组织勾选单位
  getCurrentUserInfo:'GET sys/user/info',//获取当前登录用户信息
  //uploadFile:'POST sys/license/import',//授权导入
  getLoginConfig:'GET sys/tenant/config/login',//获取租户登录方案/LOGO/版权设置
  updateLoginConfig:'POST sys/tenant/config/loginset',
  getIdentity:'GET sys/user/identity',//获取用户身份列表
  addIdentity:'POST sys/user/identity',//保存用户身份列表
  isExistLicense:'GET lock/cloud/license/exist',//是否授权
  importUser: "POST sys/user/importExcel",//用户信息导入
  importUserResult: "GET sys/user/refreshImportExcel",//用户信息导入结果查看
  importPost:"POST sys/post/importExcel",//岗位信息导入
  importPostResult: "GET sys/post/refreshImportExcel",//岗位信息导入结果查看
  importDept:"POST sys/dept/importExcel",//部门信息导入
  importDeptResult: "GET sys/dept/refreshImportExcel",//部门信息导入结果查看
  importOrg: "POST sys/org/importExcel",//单位信息导入
  importOrgResult: "GET sys/org/refreshImportExcel",//单位信息导入结果查看
  getDownFileUrl: "POST public/fileStorage/getDownFileUrl",//上传后的下载
  uploaderFile: "POST public/fileStorage/uploaderFile",//上传头像
  uploadCloudFile:'POST lock/cloud/license/add',//专属云导入
  uploadTenantFile:'POST lock/tenant/license',//租户导入
  updatePassword: 'PUT sys/user/password',//修改密码
  getSolmodelList:'GET setup/solmodel/list',//获取应用建模分页数据
  deleteSolmodel:'DELETE setup/solmodel',//应用模型删除
  getSolmodelDetails:'GET setup/solmodel/details',//获取下发模型分页数据
  getTenantList:'GET sys/tenant/list',//获取租户信息列表(分页查询)
  getCtlgTree: 'GET setup/ctlg/tree', //获取业务应用类别树
  sendSolmodel:'POST setup/solmodel/import',//下发应用模型接口
  getFileMD5: 'GET public/fileStorage/presigned/fileencryption', //根据文件md5查询是否存在该文件
  presignedUploadUrl: 'POST public/fileStorage/presigned', //文件预上传接口
  storingFileInformation: 'POST public/fileStorage/file', //存储文件信息到数据库接口
  getDatasourceTree:'GET form/datasource/tenant/tree',//根据租户获取数据源树
  addDatasource: 'POST form/datasource', //添加数据源
  addDatasourceTest: 'POST form/datasource/test', //数据源测试接口
  getFileMerage: 'GET public/fileStorage/compare', //根据文件路径合并文件

  getOrgTreeList:'GET sys/v1/org/list',//单位列表树v1
  getSolmodelTableData:'GET setup/solmodel/tableData',//获取应用建模表数据
  getTenantDatasource:'GET form/datasource/table/tenant',//获取表集合
  addSourceTable:'POST form/datasource/table/tenant',//创建表
  validatorDatasource:'GET form/datasource/column/validator',//校验字段一致性
  addLicenseZip:'POST lock/tenant/licenseZip',//新增租户授权-压缩包
  checkDataSource:'GET form/datasource/checkDynamic',//校验数据源标识是否存在
  checkTenantSolImportStatus: 'GET lock/tenant/licenseZipLog', //检查租户授权导入应用下发状态

  isOrgCenterShareOrg:'GET sys/tenant/isOrgCenterShareOrg',//判断共享租户是否关联单位
}
