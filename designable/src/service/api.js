/**
 * api定义，规则为：method apiname
 */
export default {
  addForm: 'POST form/form', //新增表单
  deleteForm: 'DELETE form/form', //删除表单
  updateForm: 'PUT form/form', //更新表单
  releaseForm: 'PUT form/release', //发布表单
  getForm: 'GET form/form/:formId', //获取表单详情
  uploadFileIo: 'POST public/fileStorage/fileio', //流上传
  getCtlg: 'GET setup/ctlg/tree', //获取应用类别
  getDataSourceTree: 'GET form/datasource/tree', //获取数据源树
  getBacklogBizInfo: 'GET bpm/bizInfo/:bizSolId/:bizInfoId', //获取待办业务配置
  getBizInfo: 'POST bpm/bizInfo/:bizSolId', //获取biz详情
  getFormStyle: 'GET form/formStyle', //获取表单样式
  getFormData: 'GET form/formdata/:bizSolId', //获取任务业务配置
  saveFormData: 'POST form/formdata/:bizSolId', //保存表单数据
  getBussinessForm: 'GET setup/bizSol/bussinessForm/:bizSolId', //获取业务应用表单在用版本配置信息
  saveAttachment: 'POST public/bizRelAtt', //保存业务建模/表单中关联附件
  getFormAttachmentList: 'GET public/bizRelAtt/form/list', //获取表单控件中关联附件列表
  getFormAuthoritys: 'GET form/authoritys/:bizSolId', //获取表单按钮与字段权限
  getDatasourceField: 'GET form/datasource/field', //获取数据源列
  getBasicDataList: 'GET setup/bizSol/bpm-flag/basicdata-flag/list', //获取业务方案非流程非基础数据列表数据
  getBusinessControl: 'GET form/businessControl', //获取业务控件列表
  getSignConfig: 'GET sys/tenant/sign', //获取手写签批配置
  getCurrentUserInfo: 'GET sys/user/info', //获取当前登录用户信息
  getPullDataDriveInfos: 'GET form/pullData/driveInfos/:bizSolId', //拉取数据方案集合
  getPullStyle: 'GET form/pullData/pullStyle', //拉取数据样式
  getPullDataList: 'GET form/pullData/pullDataList', //获取拉取数据列表
  getPullData: 'POST form/pullData/pullData', //获取拉取数据
  getDictType: 'GET sys/dictType/:dictTypeCode', //获取枚举类型
  getOrgChildren: 'GET sys/org/control/tree', //树结构控件的单位树
  getSignList: 'GET bpm/sign/list', //手写签批列表
  getFormDetail: 'GET form/form/:formId', //获取表单详情
  getDictTypeTree: 'GET sys/dictType/tree', //获取枚举类型树
  getTemporarySignList: 'GET bpm/temporarySign/list', //获取暂存的手写签批
  getTableColumns: 'GET form/form/tableColumns', //获取表单关联数据建模列数据
  getOperation: 'GET form/operation', //表单运算查询
  saveOperation: 'POST form/operation', //表单运算保存
  getSearchTree: 'GET sys/org/tree',
  getPosts: 'GET sys/post/list',
  getQueryUser: 'GET sys/identity/list',
  getUnitRole: 'GET sys/role/roles',
  getUgs: 'GET sys/usergroup/list',
  getUsersByIds: 'GET sys/identity/list',
  getUsergroupByIds: 'GET sys/usergroup/findInfoByIds',
  getOrgByIds: 'GET sys/org/findInfoByIds',
  getPostByIds: 'GET sys/post/findInfoByIds',
  getDeptByIds: 'GET sys/dept/findInfoByIds',
  getRuleByIds: 'GET sys/role/findInfoByIds',
  presignedUploadUrl: 'POST public/fileStorage/presigned', //文件预上传接口
  authLogin: 'POST auth/login',
  getIcCity: 'GET ic/city',
  getTravelexpense: 'GET ic/travelexpense/list',
  getFileMD5: 'GET public/fileStorage/presigned/fileencryption', //根据文件md5查询是否存在该文件
  getUploadURLisReal: 'GET public/fileStorage/bucketExists', //判断上传路径是否存在
  getFileMerage: 'GET public/fileStorage/compare', //根据文件路径合并文件
  storingFileInformation: 'POST public/fileStorage/file', //存储文件信息到数据库接口
  getIcCity: 'GET public/city',
  getTravelexpense: 'GET ic/travelexpense/post/list',
  getInvoiceTree: 'GET ic/invoice/classify/tree', //查询票据分类树
  addInvoiceTree: 'POST ic/invoice/classify', //新增票据分类
  updateInvoiceTree: 'PUT ic/invoice/classify', //修改票据分类
  deleteInvoiceTree: 'DELETE ic/invoice/classify', //删除票据分类
  getInvoiceList: 'GET ic/invoice/list', //查询发票列表
  uploadInvoice: 'POST ic/invoice', //上传发票
  transferInvoice: 'PUT ic/invoice/classify/change', //转移票据分类
  updateInvoiceList: 'PUT ic/invoice', //修改发票（OCR识别，验真）
  getDetailInvoice: 'GET ic/invoice', //查询单张发票信息
  deleteInvoiceList: 'DELETE ic/invoice', //删除发票
  getEncoding: 'GET ic/encodingPlan/getEncoding', //生成编码
  getDictType: 'GET sys/dictType/:dictTypeCode', //获取枚举类型的详细信息
  getAllWork: 'GET bpm/work/all', //所有事项列表
  getFormRelBizInfoList: 'GET public/relbizinfo/form/list', //获取表单中关联事项列表
  getALLDictTypeList: 'GET sys/dictInfo/allList', //获取全部枚举类型及详细信息
  getFormDataId: 'GET form/form/formData/id', //获取全部枚举类型及详细信息
  getDictInfoList: 'GET sys/dictInfo/list', //获取全部枚举类型及详细信息
  getButtonInfo: 'GET sys/button/:buttonId', //根据id查询按钮接口
  refInvoice: 'POST ic/invoice/ref', //根据id查询按钮接口关联发票
  getRefInvoice: 'GET ic/invoice/ref', //获取关联发票信息
  deleteInvoiceRef: 'DELETE ic/invoice/ref/subtable', //删除关联发票浮动表数据
  getInvoiceListByIds: 'GET ic/invoice/list/ids', // 根据id集合查询发票信息
  getBizFormData: 'GET form/app/formdata/:bizSolId', //获取表单数据
  saveAppendBizRelAtt: 'POST public/bizRelAtt/column', //追加保存临时业务建模中关联附件
  getV2BizRelAtt: 'GET public/bizRelAtt/column', //根据字段获取附件集合
  deleteV2BizRelAtt: 'DELETE public/bizRelAtt/column ', //根据字段删除某几个附件
  checkName: 'GET public/bizRelAtt/checkName', //判断文件名是否重复
  updateBizRelAttName: 'PUT public/bizRelAtt', //修改关联文档排序或重命名
  resetBizRelAtt: 'PUT public/bizRelAtt/reset', //重置状态
  getPopularList: 'GET bpm/popular/sign/list', //获取常用语
  deletePopular: 'DELETE bpm/popular/sign', //删除常用语
  changeSort: 'PUT bpm/popular/sign/chang-sort', //变更排序
  addPopularList: 'POST bpm/popular/sign', //新增常用语
  downZip: 'GET public/bizRelAtt/column/zip', //组合附件生成ZIP
  getScene: 'GET sys/scene', //单场景查询
  updateScene: 'PUT sys/scene', //场景修改
  getSceneLayout: 'GET sys/scene/layout/front', //获取场景布局接口（前端）
  // 👇🏻 门户相关
  getNoticeViewList: 'GET public/notice/view/list', //查看通知公告列表
  getTodoList: 'GET sys/scene/front/todo', //获取代办事项
  getAppList: 'GET sys/scene/front/menus', //获取最近应用
  getHolidays: 'GET public/calendarHoliday/list', //获取节假日列表
  getSchedules: 'GET public/schedule', //查询日程列表
  getUserMenus: 'GET sys/user/menu/tree', //根据当前切换的身份获取菜单及按钮（获取前台的菜单MD）
  getRegister: 'GET sys/registers', //获取注册系统
  getUserRegister: 'GET sys/user/register', //获取登录人可登录系统集合
  getMenu: 'GET sys/menus', //获取模块资源列表
  addWorkList: 'POST sys/scene/refmenus', //新增工作台接口(后台)
  addFontWorkList: 'POST sys/scene/front/refmenus', //新增工作台接口(前台)
  getWorkList: 'GET sys/scene/menus', //获取场景工作台(前台)
  getWorkListBack: 'GET sys/scene/platform/menus', //获取场景工作台接口（后台）
  getChartBean: 'GET form/chart/:id', //查询图表bean
  getChartMinioUrl: 'GET form/chart/minioUrl/:id', //查询可进行上传的minioUrl
  getAppFormUrl: 'GET form/form/appForm/url', //查询app设计表单上传json的url
  getBpmnDetail: 'GET bpm/bizInfo/detail/:bizInfoId', // 获取流程图
  getGenerateDocNOList: 'GET oa/docNo/generate/list', //获取可用于生成的文号集合
  generateDocNO: 'POST oa/docNo/generate', //生成文号
  getSerialNum: 'GET form/serialNum/list', //生成编号
  getNewSearchTree: 'GET sys/org/control/search/tree', //搜索树结构控件
  getFillNo: 'GET oa/docNo/discard/list', //获取文号可补号
  delDocNo: 'DELETE oa/docNo/trace', //文号占用删除
  getPerfromanceList: 'GET ic/performance/listData', //查询表单绑定的绩效指标信息
  getPerformanceTree: 'GET ic/performance/tree', //查询绩效指标树
  getPerformanceInfo: 'GET ic/budgetPreparation/performanceView/:id',
  getSearchUserByOrgTree: 'GET sys/identity/searchUserByOrgTree', //人员控件搜索接口
  getTemplateFileList: 'GET setup/bizSol/attachment/template/fileList', //获取业务应用已配置附件模板文件集合
  getTemplateColumnList: 'GET setup/bizSol/attachment/template/columnList', //获取业务应用已配置附件模板字段集合
}
