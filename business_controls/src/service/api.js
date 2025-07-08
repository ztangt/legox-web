/**
 * api定义，规则为：method apiname
 */
export default {
  getUsersByIds: 'GET sys/identity/list', //根据岗人ID集合获取岗人详情
  getUsergroupByIds: 'GET sys/usergroup/findInfoByIds', //根据用户组ID集合获取用户组详情
  getOrgByIds: 'GET sys/org/findInfoByIds', //根据单位ID集合获取单位详情
  getPostByIds: 'GET sys/post/findInfoByIds', //根据岗位ID集合获取岗位详情
  getDeptByIds: 'GET sys/dept/findInfoByIds', //根据部门ID集合获取部门详情
  getRuleByIds: 'GET sys/role/findInfoByIds', //根据角色ID集合获取角色详情
  queryUser: 'GET sys/identity/list', //用户信息列表查询
  getUgs: 'GET sys/usergroup/list', //根据父单位id查询岗位信息
  getSysRoles: 'GET sys/role/roles', //获取角色列表
  getPosts: 'GET sys/post/list', //获取岗位列表

  getOrgChildren: 'GET sys/org/children', //获取组织树
  getSearchTree: 'GET sys/org/tree', //搜索组织机构数
  getDepts: 'GET sys/dept/list', //根据父单位id查询部门信息
  getControlTree: 'GET sys/org/control/tree', //获取树结构控件的单位树

  getMetting: 'GET ic/meeting',
  getTravelExpenseList: 'GET ic/travelexpense/list', //查询差旅费设置
  getCityTreeList: 'GET public/city', //查询城市树
  addTravelexpense: 'POST ic/travelexpense', //保存差旅费设置
  updateTravelexpense: 'PUT ic/travelexpense', //修改差旅费设置
  deleteTravelexpense: 'DELETE ic/travelexpense', //删除差旅费设置
  getOneTravelexpense: 'GET ic/travelexpense', //查询单条差旅费信息

  getGradeList: 'GET ic/travelexpense/grade/list', //查询差旅费级别设置
  deleteTravelexpenseGrade: 'DELETE ic/travelexpense/grade', //删除差旅费级别设置
  updateTravelexpenseGrade: 'PUT ic/travelexpense/grade', //修改差旅费级别设置
  addTravelexpenseGrade: 'POST ic/travelexpense/grade', //保存差旅费级别设置

  getPreexpenseList: 'GET ic/preexpense/list', //查询超事前报销设置
  deletePreexpense: 'DELETE ic/preexpense', //删除超事前报销设置
  addPreexpense: 'POST ic/preexpense', //保存超事前报销设置
  getBasicdataFlagList: 'GET setup/bizSol/bpm-flag/basicdata-flag/list', //获取业务方案非流程非基础数据列表数据
  updatePreexpense: 'PUT ic/preexpense', //修改超事前报销设置
  getOnePreexpense: 'GET ic/preexpense', //查询单条超事前报销设置

  // 预算指标库 TODO
  getProjectBizSolId: 'GET ic/norm/getProjectBizSolId', //获取预算项目bizSolId
  getBudgetProjectTree: 'GET ic/budgetProject/tree', //预算项目树获取
  getNormList: 'GET ic/norm/list', //获取预算指标库列表
  addNorm: 'POST ic/norm', //预算指标新增
  // deleteBizInfo: 'DELETE bpm/bizInfo/:bizSolId/batch/:bizInfoIds', //批量删除业务信息
  delFormData: 'DELETE form/formdata/:bizSolId', //删除表单数据
  powerNorm: 'PUT ic/norm', //预算指标修改（超能力接口~~~~~修改、删除、启用、停用、收回、取消收回都TM用这一个）
  getControlList: 'GET ic/norm/controlList', //查询预算指标列表控件
  annualCarryForward: 'POST ic/norm/annualCarryForward', //预算指标结转
  getNormHistory: 'GET ic/norm/history', //预算指标调整详情
  getFreezeFormList: 'GET ic/freezeForm/list', //冻结金额单据列表
  findNormExecuteInfoByBeforeId: 'GET ic/freezeForm/source/:sourceId', //通过事前申请单ID查找对应的事后执行单
  rollbackNormFreezeMoney: 'PUT ic/freezeForm', //退回冻结金额
  getExecuteFormList: 'GET ic/executeForm/list', //执行金额单据列表
  findNormFreeBySourceIdList: 'GET ic/executeForm/before/:beforeId', //根据事前申请单Id查询事前数据
  rollbackNormExecuteMoney: 'PUT ic/executeForm', //退回执行金额
  getNormOnwayList: 'GET ic/normOnway/list', //在途冻结或在途执行表单列表
  getWarningList: 'GET ic/norm/warning/list', //获取指标预警
  saveWarning: 'PUT ic/norm/warning', //保存指标预警
  checkNorm: 'GET ic/norm/check/:normId', //获取指标是否被使用
  exportFile: 'POST report/export', // 导出操作

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
  moveInvoice: 'PUT ic/invoice/change', //转移票据

  getFileMD5: 'GET public/fileStorage/presigned/fileencryption', //根据文件md5查询是否存在该文件
  presignedUploadUrl: 'POST public/fileStorage/presigned', //文件预上传接口
  getFileMerage: 'GET public/fileStorage/compare', //根据文件路径合并文件
  storingFileInformation: 'POST public/fileStorage/file', //存储文件信息到数据库接口
  getDownFileUrl: 'POST public/fileStorage/getDownFileUrl', //获取下载地址URL
  uploadFile: 'POST public/fileStorage/uploaderFile', //上传文件

  importExcel: 'POST report/excel/import', // 导入操作
  refreshImportExcel: 'GET report/re/refreshImportExcel', // 导入刷新上传

  saveEncodingPlan: 'POST ic/encodingPlan', //预算编码方案保存
  saveBaseEncodingPlan: 'PUT ic/encodingPlan/baseDataFinishTurn', // 基础数据结转
  getEncoding: 'GET ic/encodingPlan/getEncoding', // 生成编码
  finishTurn: 'POST ic/encodingPlan/finishTurn', // 编码方案结转接口
  getEncodingPlanList: 'GET ic/encodingPlan', // 预算编码方案列表
  getIsHaveBaseData: 'GET ic/encodingPlan/isHaveBaseData', // 判断是否含有基础数据

  getDetailInvoiceTree: 'GET ic/invoice/classify', //查询单个票据分类信息
  getReportList: 'GET ic/labor/getLaborExpenseReportList', // 获取劳务费报表列表
  getDictType: 'GET sys/dictType/:dictTypeId', // 获取枚举类型的详细信息
  getInvoiceListByIds: 'GET ic/invoice/list/ids', // 根据id集合查询发票信息
  //////////////////////////////////////////////////////////////////
  getContractLedgerList: 'GET ic/contract/ledger/list', // 获取合同台账列表
  getLedgerAdjustList: 'GET ic/contract/ledgerAdjust/list', // 详情
  getContractFilesList: 'GET ic/contract/file/list', //获取合同管理档案列表
  getContractFileFjList: 'GET ic/contract/fileFj/list', // 获取附件列表
  getFileStorageZip: 'POST public/fileStorage/getZip', // 下载
  getExecuteList: 'GET ic/contract/execute/list', // 获取执行下钻
  getOcrResult: 'POST public/ocr', //OCR识别
  getOcrEnum: 'GET public/ocr/typeEnum', //OCR识别后获取票据显示枚举信息
  vatInvoiceVerification: 'POST public/ocr/invoiceVerify', //发票验真
  getOcrInfoMo: 'GET public/ocr/mo', //获取存储到minio里的ocr识别信息
  getBizSolIdByLogicCode: 'GET setup/bizAssocLogic/getBizSolIdByLogicCode', //获取bizSolId
  //getBudgetProjectTree: 'GET ic/budgetProject/tree', //获取内控基础数据树
  getBudPreOrgTree: 'GET ic/budgetPreparation/orgTree', //查询编报项目库-单位树
  getBudPreProjectTree: 'GET ic/budgetPreparation/projectTree', //查询编报项目库-项目树
  getBudPreProjectList: 'GET ic/budgetPreparation/budgetProjectList', //查询编报项目库-项目列表
  getOrgTree: 'GET sys/v1/org/tree', //单位树v1
  pushRefineProject: 'POST ic/budgetPreparation/pushRefineProject', //编报项目库->推送细化
  deleteBudget: 'DELETE ic/budgetPreparation/deleteProject', //删除各个阶段的项目
  exportProject: 'POST ic/budgetPreparation/exportProject', //编报项目库-导出项目(zip)
  budgetFinishTurn: 'POST ic/budgetPreparation/finishTurn', //编报项目库-结转
  getPerfromanceList: 'GET ic/performance/listData', //查询表单绑定的绩效指标信息
  getPerformanceTree: 'GET ic/performance/tree', //查询绩效指标树
  getPerformanceInfo: 'GET ic/budgetPreparation/performanceView/:id',
  tmpSavePer: 'POST ic/performance/tempSave', //临时保存绩效指标
  getControlSearchTree: 'GET sys/org/control/search/tree', //搜索树结构控件的单位树
};
