/**
 * api定义，规则为：method apiname
 */
export default {
  getTentant: 'GET sys/tenant/mark', //通过访问地址获取租户
  getLoginConfig: 'GET sys/tenant/config/login', //获取登录方案配置
  getUsersByIds: 'GET sys/identity/list', //根据岗人ID集合获取岗人详情
  getSysRoles: 'GET sys/role/roles', //获取角色列表
  getSchedules: 'GET public/schedule', //查询日程列表
  getSchedule: 'GET public/schedule/:scheduleId', //查询某一个日程
  addSchedule: 'POST public/schedule', //添加日程
  changeSchedule: 'PUT public/schedule', //修改日程
  deleteSchedule: 'DELETE public/schedule', //删除日程
  getHolidays: 'GET public/calendarHoliday/list', //获取节假日列表
  getOrgChildren: 'GET sys/org/children', //获取组织树
  queryPostUser: 'GET sys/post/orgRefUsers', //根据岗位查询岗人列表
  getUgs: 'GET sys/usergroup/list', //根据父单位id查询岗位信息
  getUsergroupByIds: 'GET sys/usergroup/findInfoByIds', //根据用户组ID集合获取用户组详情
  addSysUserGroup: 'POST sys/usergroup', //添加用户组
  updateUserGroup: 'PUT sys/usergroup', //修改用户组
  deleteUserGroup: 'DELETE sys/usergroup', //删除用户组(支持批量)
  getSysUserGroupSearchWord: 'GET sys/usergroup/list', //获取用户组列表
  getSysUserGroup: 'GET sys/usergroup/:ugId', //获取某用户组信息
  addSysUserGroupSaveUsers: 'POST sys/usergroup/user', //保存用户组关联用户
  getUserByGroupId: 'GET sys/usergroup/user/:userGroupId', //获得用户组关联的用户信息
  getFormAuthoritys: 'GET form/authoritys/:bizSolId', //获取表单按钮与字段权限
  getFormStyle: 'GET form/formStyle', //获取表单样式路径
  getFormData: 'GET form/formdata/:bizSolId', //获取表单数据
  saveFormData: 'POST form/formdata', //保存表单数据
  delFormData: 'DELETE form/formdata/:bizSolId', //删除表单数据
  deleteDataByCode: 'DELETE ic/budgetProject/deleteDataByCode', //删除对应code所有下级数据
  getTodoWork: 'GET bpm/work/todo', //待办事项列表
  getDoneWork: 'GET bpm/work/done', //已办事项列表
  getCirculateWork: 'GET bpm/work/circulate', //传阅事项列表
  getListModelStyleInfo: 'GET form/listModelStyleInfo/:bizSolId',
  getListModelData: 'GET form/listModelData',
  getBizInfo: 'POST bpm/bizInfo/:bizSolId', //获取任务业务配置
  getBacklogBizInfo: 'GET bpm/bizInfo/:bizInfoId', //获取待办业务配置
  getBussinessForm: 'GET setup/bizSol/bussinessForm', //获取业务应用表单在用版本配置信息
  getUserDentityList: 'GET sys/user/identity/list', //获取当前登录用户身份列表
  getUserMenu: 'GET sys/user/menus', //根据当前切换的身份获取菜单及按钮
  login: 'POST auth/login', //登录
  logout: 'GET auth/logout', //登出
  getGroupButton: 'GET sys/buttonGroup/button', //新增按钮查询接口
  getUserMenus: 'GET sys/user/menu/tree', //根据当前切换的身份获取菜单及按钮
  getUserMenusList: 'GET sys/user/menu/list', //根据当前切换的身份获取菜单(列表)
  getBizTaskNodes: 'GET bpm/bizTask/send/nodes', //获取送审环节
  getBizTaskTree: 'GET bpm/bizTask/send/user/tree', //获取送交选人树
  saveBizTaskSend: 'POST bpm/bizTask/send', //送交
  backNodes: 'GET bpm/bizTask/v2/process-back/nodes/:bizTaskId', //获取退回环节
  getDetail: 'GET bpm/bizInfo/:bizInfoId/detail', //办理详情
  traceWork: 'POST bpm/work/trace', //加入/取消跟踪（支持批量）
  setCirculate: 'PUT bpm/work/circulate', //批量勾选设置已阅
  cancleMonitor: 'POST bpm/bizInfo/revoke/:bizInfoId', //事项监控撤销
  getTraceWork: 'GET bpm/work/trace', //跟踪事项列表
  getWorkSearch: 'GET bpm/work/search', //高级查询-自定义查询条件获取
  getMonitorWork: 'GET bpm/work/monitor', //事项监控列表
  saveSearchCol: 'POST bpm/work/search', //高级查询-自定义查询条件设置
  transferTask: 'POST bpm/bizTask/transfer', //转办
  revokeBiz: 'POST bpm/bizInfo/revoke/:bizInfoId', //撤销流程
  completeBiz: 'POST bpm/bizInfo/complete', //办结流程
  queryUser: 'GET sys/identity/list', //用户信息列表查询
  getDepts: 'GET sys/dept/list', //根据父单位id查询部门信息
  getOrgs: 'GET sys/org/list', //根据父单位id查询单位信息
  getSignConfig: 'GET sys/tenant/sign', //获取手写签批配置
  getCurrentUserInfo: 'GET sys/user/info', //获取当前登录用户信息
  updatePassword: 'PUT sys/user/password', //修改密码
  getWorkRule: 'GET bpm/workRule', //事项规则查询
  getSendWork: 'GET bpm/work/send', //已发事项列表
  getAllWork: 'GET bpm/work/all', //所有事项列表
  getTrustWork: 'GET bpm/work/trust', //委托事项列表
  getTrustedWork: 'GET bpm/work/trusted', //受委托事项列表
  getBaseset: 'GET sys/tenant/baseset/system', //查询支撑平台、业务平台、微协同基础设置
  getRegisterByCode: 'GET sys/register/getRegisterByCode', //通过注册系统code获取系统信息
  // updateUser: 'PUT sys/user/baseInfo/:userId', //修改个人信息
  updateUser: 'PUT sys/user', //用户信息修改
  uploadFile: 'POST public/fileStorage/uploaderFile', //上传文件
  mergeData: 'PUT sys/tenant/front/merge', //待办数据合并
  getWorkCategory: 'GET bpm/work/category', //分类类型查询
  getCollectionWork: 'GET bpm/work/collection', //事项归档查询
  addCategory: 'POST bpm/work/category', //分类类型新增
  updateCategory: 'PUT bpm/work/category', //分类类型更新
  deleteCategory: 'DELETE bpm/work/category', //分类类型删除
  updateCollectionWork: 'PUT bpm/work/collection', //事项归档移动
  deleteCollWork: 'DELETE bpm/work/collection', //事项归档移除
  addCollWork: 'POST bpm/work/collection', //事项归档新增
  getAddress: 'GET sys/address', //查询通讯录列表
  userExport: 'GET sys/address/export', //用户导出
  userCollect: 'POST sys/address/collect', //收藏/取消收藏
  getCollectList: 'GET sys/address/collect/list', //获取通讯录收藏列表
  getCategoryList: 'GET sys/msg/category', //获取消息分类
  getMessageList: 'GET sys/msg', //获取消息列表分页
  putMessage: 'PUT sys/msg', //读取消息
  delRecentUse: 'PUT sys/tenant/front/menus', //常用应用设置删除
  addMenuList: 'POST sys/tenant/front/menus', //常用应用设置
  getMenuList: 'GET sys/tenant/front/menus', //常用应用获取
  addNotice: 'POST public/notice', //添加通知公告
  updateNotice: 'PUT public/notice', //修改通知公告
  delNotice: 'DELETE public/notice', //删除通知公告
  getNotice: 'GET public/notice/:noticeId', //查看通知公告
  getNoticeList: 'GET public/notice/list', //获取本人发布的通知公告列表
  releaseNotice: 'PUT public/notice/release', //发布通知公告
  addViewsNotice: 'PUT public/notice/view', //增加浏览次数并添加浏览记录
  getNoticeViewList: 'GET public/notice/view/list', //查看通知公告列表
  getNoticeCollectList: 'GET public/noticeCollect/list', //获取收藏的通知公告全部列表
  delNoticeCollect: 'DELETE public/noticeCollect', //删除收藏公告
  putNoticeCollect: 'PUT public/noticeCollect', //收藏通知公告
  getNoticeView: 'GET public/notice/view', //查询浏览记录
  getDownFileUrl: 'POST public/fileStorage/getDownFileUrl', //获取下载地址URL
  getPullDataDriveInfos: 'GET form/pullData/driveInfos/:bizSolId', //拉取数据方案集合
  getPullStyle: 'GET form/pullData/pullStyle', //拉取数据样式
  getPullDataList: 'GET form/pullData/pullDataList', //获取拉取数据列表
  getPullData: 'GET form/pullData/pullData', //获取拉取数据
  getBizInfoTitle: 'GET bpm/bizInfo/title', //获取事项标题规则
  changeTitle: 'PUT bpm/bizInfo/title/change', //改变标题
  getSerialNum: 'GET form/serialNum/:bizSolId', //生成编号
  getProcessVariables: 'GET setup/processvariables', //获取流程变量
  getWorkTrust: 'GET bpm/trust', //查询委托列表
  addWorkTrust: 'POST bpm/trust', //新增工作委托
  updateWorkTrust: 'PUT bpm/trust', //修改委托
  delTrust: 'DELETE bpm/trust', //删除工作委托
  getPostUserList: 'GET sys/user/post/userlist', //通过岗位获取用户列表
  getGroupUserList: 'GET sys/user/usergroup/userlist', //通过用户组获取用户列表
  getRoleUserList: 'GET sys/role/users', //通过角色获取用户列表
  addInformation: 'POST public/information', //添加资讯公告
  getInformation: 'GET public/information', //查询资讯公告
  updateInformation: 'PUT public/information', //修改资讯公告
  delInformation: 'DELETE public/information', //批量删除资讯公告
  updateInformationMove: 'PUT public/information/move', //移动资讯公告
  updateInformationOperation: 'PUT public/information/operation', //批量发布，置顶，轮播资讯公告
  addInformationAuthority: 'PUT public/informationAuthority', //添加资讯公告权限
  getInformationAuthority: 'GET public/informationAuthority', //查询资讯公告权限
  delInformationAuthority: 'DELETE public/informationAuthority', //删除资讯公告权限
  addInformationComment: 'POST public/informationComment', //新增评论或者回复评论
  getInformationComment: 'GET public/informationComment', //去评论页面
  putInformationLikes: 'PUT public/informationComment/like', //点赞评论
  getInformationCommentList: 'GET public/informationComment/list', //查询评论管理列表
  delInformationCommentList: 'DELETE public/informationComment', //批量删除资讯公告评论
  addInformationType: 'POST public/informationType', //添加资讯公告类别
  updateInformationType: 'PUT public/informationType', //修改资讯公告类别
  delInformationType: 'DELETE public/informationType', //删除资讯公告类别
  getInformationType: 'GET public/informationType', //查询资讯公告类别列表
  upInformationLoopList: 'PUT public/information/sort', //资讯公告轮播排序
  getSomeoneInformation: 'GET public/information/:informationId', //查询某一个资讯公告
  getDownloadFileUrl: 'POST public/fileStorage/getDownFileUrl', //获取下载地址url
  getSendUserTree: 'GET sys/send/user/tree', //获取送交选人维度树
  getSearchSendTree: 'POST sys/send/user/tree/search', //搜索送交选人维度树
  getDictType: 'GET sys/dictType/:dictTypeCode', //获取枚举类型
  getControlTree: 'GET sys/org/control/tree', //获取树结构控件的单位树
  getOrgByIds: 'GET sys/org/findInfoByIds', //根据单位ID集合获取单位详情
  getPostByIds: 'GET sys/post/findInfoByIds', //根据岗位ID集合获取岗位详情
  getDeptByIds: 'GET sys/dept/findInfoByIds', //根据部门ID集合获取部门详情
  getRuleByIds: 'GET sys/role/findInfoByIds', //根据角色ID集合获取角色详情
  getCurrentOrg: 'GET sys/org/bennode', //获取当前用户的单位信息
  circulateTask: 'POST bpm/bizTask/circulate', //传阅
  getSignList: 'GET bpm/sign/list', //手写签批列表
  // presignedUploadUrl: 'POST public/fileStorage/presignedUploadUrl',//文件预上传接口
  presignedUploadUrl: 'POST public/fileStorage/presigned', //文件预上传接口
  saveAttachment: 'POST public/bizRelAtt', //保存业务建模/表单中关联附件
  getFormAttachmentList: 'GET public/bizRelAtt/form/list', //获取表单控件中关联附件列表
  deleteAttachment: 'DELETE public/bizRelAtt', //删除表单控件中关联的附件
  getAttachmentList: 'GET public/bizRelAtt/list', //获取业务应用建模中关联附件列表
  getTaskDealNode: 'GET bpm/bizTask/process-send/node/:bizTaskId', //获取任务办理送交环节
  getProcessStartNode: 'GET bpm/bizTask/process-start/node/:bizInfoId/:actId', //获取流程启动送交环节
  saveRelBizInfo: 'POST public/relbizinfo', //保存业务建模关联事项
  deleteRelBizInfo: 'DELETE public/relbizinfo', //删除业务建模关联事项
  getRelBizInfoList: 'GET public/relbizinfo/list', //获取业务建模关联事项列表
  getFormRelBizInfoList: 'GET public/relbizinfo/form/list', //获取表单中关联事项列表
  updateAttachment: 'PUT public/bizRelAtt', //修改关联文档排序或重命名
  processStart: 'POST bpm/bizTask/process-start', //流程启动
  processSend: 'POST bpm/bizTask/process-send', //流程送交
  processBack: 'POST bpm/bizTask/process-back', //流程驳回
  updateTableLayout: 'POST sys/table/layout', //桌面布局设置保存
  getTableLayout: 'GET sys/table/layout', //获取桌面布局设置
  recoverBizInfo: 'POST bpm/bizTask/v2/recover/:bizInfoId', //撤销
  getSearchTree: 'GET sys/org/tree', //搜索组织机构数
  getBizTaskSingns: 'GET bpm/bizTask/:bizInfoId/taskSigns', //获取签批意见流程列表
  deleteBizInfo: 'DELETE bpm/bizInfo/:bizSolId/batch/:bizInfoIds', //批量删除业务信息
  delInvoice: 'PUT ic/invoice/ref', //删除关联发票(同时修改发票使用状态)
  signBatch: 'PUT bpm/sign/batch', //批量修改手写签批
  getAuthorityList_CommonDisk: 'GET public/commondisk/authlist', //获取带权限的分页列表
  getPagingList_CommonDisk: 'GET public/commondisk', //获取分页列表
  postNewDir_CommonDisk: 'POST public/commondisk', //新建文件夹
  postUpload_CommonDisk: 'POST public/commondisk/upload', //上传
  putDownLoad_CommonDisk: 'GET public/commondisk/down', //下载
  getAuthorityView_CommonDisk: 'GET public/commondisk/auth', //获取权限设置回显，只适应勾选一条，多选是不做回显
  postSetAuthority_CommonDisk: 'POST public/commondisk/auth', //权限设置
  getDetailPublicMessage_CommonDisk: 'GET public/commondisk/details/common', //获取详情公共信息
  getDetailPagingMessage_CommonDisk: 'GET public/commondisk/details', //获取详情分页信息
  putRechristen_CommonDisk: 'PUT public/commondisk', //重命名
  postCopy_CommonDisk: 'POST public/commondisk/copy', //复制
  postMove_CommonDisk: 'POST public/commondisk/move', //移动
  putSort_CommonDisk: 'PUT public/commondisk/sort', //排序
  delDelete_CommonDisk: 'DELETE public/commondisk', //删除
  getPagingOrBinList_SignDisk: 'GET public/persondisk', //获取分页列表/回收站列表
  postNewDir_SignDisk: 'POST public/persondisk', //新建文件夹
  postUpload_SignDisk: 'POST public/persondisk/upload', //上传
  postShare_SignDisk: 'POST public/persondisk/share', //分享
  putDownLoad_SignDisk: 'GET public/persondisk/down', //下载
  putRechristen_SignDisk: 'PUT public/persondisk', //重命名
  postCopy_SignDisk: 'POST public/persondisk/copy', //复制
  postMove_SignDisk: 'POST public/persondisk/move', //移动
  putSort_SignDisk: 'PUT public/persondisk/sort', //排序
  delDelete_SignDisk: 'DELETE public/persondisk', //删除
  getDetailPublicMessage_SignDisk: 'GET public/persondisk/common', //获取详情公共信息
  getDetailPagingMessage_SignDisk: 'GET public/persondisk/details', //获取详情分页信息
  getOtherShareList_SignDisk: 'GET public/persondisk/othershare', //获取他人分享页列表
  getMyShareList_SignDisk: 'GET public/persondisk/share', //获取我的分享页列表
  delShareAll_SignDisk: 'DELETE public/persondisk/shareall', //取消分享（数据列表内容）
  delShare_SignDisk: 'DELETE public/persondisk/share', //取消分享（详情人名内容）
  getMyShareDetail: 'GET public/persondisk/sharedist', //获取我的分享详情
  putRecover: 'PUT public/persondisk/demove', //恢复
  // getFileMD5: 'GET public/fileStorage/getfileencryption',//根据文件md5查询是否存在该文件
  getFileMD5: 'GET public/fileStorage/presigned/fileencryption', //根据文件md5查询是否存在该文件
  getUploadURLisReal: 'GET public/fileStorage/bucketExists', //判断上传路径是否存在
  getFileMerage: 'GET public/fileStorage/compare', //根据文件路径合并文件
  getFileLengthURL: 'GET public/persondisk/downfilelenth', //获取文件大小
  getFileLengthURL_CommonDisk: 'GET public/commondisk/downfilelenth', //获取文件大小（公共云盘）
  // storingFileInformation: 'POST public/fileStorage/saveFileStorage',//存储文件信息到数据库接口
  storingFileInformation: 'POST public/fileStorage/file', //存储文件信息到数据库接口
  updateFormDataList: 'POST form/form/updateFormDataList', //更新表单数据
  getMergePrintUrl:'GET report/print/template/getMergePrintUrl', // 获取合并打印URL
  deleteOldFileAboutForm: 'DELETE public/fileStorage/byId', //删除与表单相关的旧文件

  getRule: 'GET setup/rule', //获取规则定义
  readFileContent: 'GET public/fileStorage/readFileContent', //文件读取
  getActivateNodes: 'GET bpm/bizInfo/activate/task-list/:bizInfoId', //获取可激活流程任务节点
  saveActivateNode: 'POST bpm/bizInfo/activate', //流程激活
  setPolicy: 'GET public/fileStorage/policy', //设置策略
  saveTemporarySign: 'POST bpm/sign/saveTemporarySign', //保存暂存意见
  getTemporarySignList: 'GET bpm/temporarySign/list', //获取暂存的手写签批
  getListModelTreeData: 'GET form/listModelTreeData', //列表建模树列表接口
  getListModelTreeChildData: 'GET form/listModelTreeChildData', //列表建模树展开接口
  getDictInfoName: 'GET sys/dictInfo/name', //获取全部枚举详细信息的中文名称
  changeBizStatus: 'PUT bpm/bizInfo/change-status', //更新业务状态
  getUrlByBSId: 'GET setup/bizSol/bussinessForm/list-form-url/:bizSolId', //获取业务方案配置的超链接列表url
  getCheckEncoding: 'GET ic/encodingPlan/checkEncoding', //校验预算编码
  getWorkMenuList: 'GET sys/user/menu/is-bpm-bizsol', //有流程的事项
  getBpmnDetail: 'GET bpm/bizInfo/detail/:bizInfoId', // 获取流程图
  checkPlan: 'GET ic/encodingPlan/isHaveEncodingPlan', //判断是否含有编码方案
  exportFile: 'POST report/export', // 导出操作
  getExportList: 'GET report/export/list', // 导出记录列表
  importExcel: 'POST report/excel/import', // 导入操作
  refreshImportExcel: 'GET report/re/refreshImportExcel', // 导入刷新上传
  getPrintUrl: 'GET report/print/template/getPrintUrl', // 获取表单打印URL
  previewPrintTemplate: 'GET report/print/template/preview/:id', // 打印预览
  baseDataEnable: 'PUT ic/budgetProject/enable', //基础数据启用或者不启用
  projectFinishTurn: 'PUT ic/budgetProject/finishTurn', // 预算项目结转
  baseDatafinishTurn: 'PUT ic/encodingPlan/baseDataFinishTurn', // 基础数据结转
  baseDataTree: 'GET ic/budgetProject/tree', // 预算项目树获取
  monitorHangup: 'PUT bpm/bizInfo/suspend/:bizInfoId', //事项监控挂起
  monitorRecover: 'PUT bpm/bizInfo/activate/:bizInfoId', //事项监控恢复
  laborEnable: 'PUT ic/labor/enable', // 劳务启用或者停用
  recallTask: 'GET bpm/bizTask/v2/recover/:bizInfoId', //撤回任务详情
  recoverTask: 'POST bpm/bizTask/v2/recover/:bizInfoId', //已办事项撤回
  getLaborAmountList:'POST ic/labor/getLaborAmountList',//获取劳务费报销计税后列表
  isHaveSub:'GET ic/budgetProject/isHaveSubordinate',//用于判断删除本级数据，判断下级是否存在
  getDictInfoList: 'GET sys/dictInfo/list', //获取全部枚举类型及详细信息
  getIdentityDatarule: 'GET sys/datarule/identity',//根据当前菜单获取当前登录人的数据规则
  getPosts: 'GET sys/post/list', //根据父单位id查询岗位信息
  deleteICRedis: 'DELETE ic/invoice/ref/redis', //删除关联发票缓存（点叉时调用）
  getCustomUserList:'GET bpm/bizTask/process/node-user/custom/list',//获取自定义送交人员集合
  getSubordinateSendTree:'GET sys/send/user/subordinate/tree',//获取送办组织树（用于是否有下级的查询）
  getBizSolName: 'GET bpm/work/bizSolName', //事项业务类型信息列表
  getFastSendTaskNodes: 'GET bpm/bizTask/process-fast-send/nodes', //一键审批获取任务送审环节信息
  getMenusObj:'GET sys/menu/registerIdMenu',//上下文 loginRegisterId 获取对应的menu菜单
  deleteV2BizRelAtt: 'DELETE public/bizRelAtt/column ', //根据字段删除某几个附件
  checkName: 'GET public/bizRelAtt/checkName', //判断文件名是否重复
  updateBizRelAttName: 'PUT public/bizRelAtt', //修改关联文档排序或重命名
  saveAppendBizRelAtt: 'POST public/bizRelAtt/column', //追加保存临时业务建模中关联附件
  getV2BizRelAtt: 'GET public/bizRelAtt/column', //根据字段获取附件集合
  getColumnList:'GET sys/desk/section/list',//获取栏目信息列表(分页)
  getFormTabs:'GET setup/combine/formTabs',//获取多应用表单页签
  getOrgTree:'GET sys/v1/org/tree',//单位树v1
  getGlobalChecker: 'GET sys/globalChecker/identity/available',//根据身份获取可送交的全局审核人
  resetBizRelAtt: 'PUT public/bizRelAtt/reset', //重置状态
  getBpmnXml:'GET bpm/choreography', // 子流程获取xml
  getSubChoreographyUser :'GET bpm/choreography/user', // 获取流程编排环节用户
  postChoreography:'POST bpm/choreography', // 保存流程编排
  getRegister: 'GET sys/user/register', //获取注册系统
  getSubProcessTableList:'GET bpm/choreography/user',//获取bpmn业务应用节点人员配置
  saveSubProcessUserArrange:'POST bpm/choreography/user', // 保存子流程用户编排
  getApplyModelTree :'GET setup/ctlg/tree', // 获取应用建模树
  getApplyModelList :'GET setup/bizSol/list', // 获取应用建模列表
  addApp: 'POST sys/scene/front/menus', //前端新增最近应用接口
  getTodoList: 'GET sys/scene/front/todo', //获取代办事项(门户)
  getImportList: 'GET report/import/list', // 导入记录列表
  editableBizTask:'GET bpm/bizTask/editable/:bizTaskId',//校验
  getAuthList: 'GET form/authoritys/app/:bizSolId',//获取app表单意见字段权限
  getPopularList: 'GET bpm/popular/sign/list', //获取常用语
  getDefaultList: 'GET bpm/bizTask/process/node-user/default/list',//获取节点全部默认办理人
  useHistoryReference:'POST bpm/doc/reference', // 引用历史公文
  mainHistoryText:'GET bpm/doc/history/list', // 历史正文
  getFormTrace:'GET form/formTrace/:id',//数据留痕展示接口
  getFormTraceList:'GET form/formTrace/list/:mainTableId',//表单留痕列表
  getMessage: 'GET sys/msg/:msgId', //获取消息
  getConnectionCode:'GET form/connection/:bizSolId',//获取关联关系
  queryUsersNoRule:'GET sys/identity/list/norule',//获取没有规则的用户列表
  getRedTemplate: 'GET oa/red-template/list',// 获取套红文件
  deleteRedTemplate: 'DELETE oa/red-template', // 删除套红模板
  addTemplate:'POST oa/red-template',// 新增模板套红
  updateTemplate: 'PUT oa/red-template', // 修改更新模板
  disableTemplate:'PUT oa/red-template/disable',// 模板禁用
  enableTemplate:'PUT oa/red-template/enable', // 模板启用
  getTemplateOrgIds:'GET oa/red-template/orgIds', // 获取模板orgIds
  postWpsBaseLocal:'POST public/wps/reference/file', // wps 引用本地文档
  getWpsRedTemplateView:'GET public/wps/red/preview', // 查看模板套红预览
  saveWpsRdTemplate:'POST public/wps/red/save', // 套红预览后保存
  getWpsDownload:'GET public/wps/down', // 获取文件下载信息
  postTransferRelAtt:'POST bpm/doc/transfer/relAtt', //'正文转附件'
  postDaftNewDoc:'POST bpm/bizInfo/draft-new-doc', // 针对此文拟稿新文

  getNoticeTypeList:'GET public/noticeType',//查询通知公告类别列表
  addNoticeType:'POST public/noticeType',//添加通知公告类型
  updateNoticeType:'PUT public/noticeType',//添加通知公告类型
  deleteNoticeType:'DELETE public/noticeType',//删除通知公告类型
  releaseNoticeCancel:'PUT public/notice/release/cancel',//取消发布通知公告
  releaseInformationCancel:'PUT public/information/release/cancel',//取消发布咨询公告
  getRedTemplateByOrgId: 'GET oa/red-template/getByOrgId',//获取单位可用模板集合
  getOtherAuthoritys:'GET form/authoritys/other/:bizSolId',//查询关联文档等权限
  getRedTemplateListByOrgId: 'GET oa/red-template/getListByOrgId',//获取业务可用模板集合
  transferPdf: 'POST public/wps/transfer/pdf',//正文转pdf
  updateBookMark: 'PUT oa/red-template/bookmark',//模板更新书签域
  getSocketTest:'GET socket-sock/mq/test', //老肖WS测试专用
  geCheckEncodingByFilterObject: 'ic/budgetProject/checkEncodingByFilterObject', //校验预算编码
  queryDocumentInfo: 'GET cma-app/accountVouchersFile/queryDocumentInfo', //根据单据编号获取表单信息
  queryAccountVoucherFile: 'GET cma-app/accountVouchersFile/queryAccountVoucherFile', //根据单据编号查询附件列表
  uploadVouchersFile: 'POST cma-app/accountVouchersFile/uploadFile',//附件上传接口
  deleteAccountVouchersFile: 'DELETE cma-app/accountVouchersFile/deleteFile',//根据附件id删除附件
  editFileAccountVouchersFile: 'PUT cma-app/accountVouchersFile/editFile',//附件排序, 重命名
  getZip: 'POST public/fileStorage/getZip', //组合附件生成ZIP
  getPDFMergeUrl: 'POST report/print/template/getPDFMergeUrl', //PDF合并
  editFileName: 'PUT cma-app/accountVouchersFile/editFileName',//附件重命名
};
  