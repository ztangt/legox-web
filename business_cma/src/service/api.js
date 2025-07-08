import moreApi from './moreApi';

export default {
    getOriginData: 'GET cma-app/cas/original', // 气政通获取原始数据
    roleBySave: 'POST cma-app/cas/role', // 气政通关联角色数据保存,
    roleByEdit: 'PUT cma-app/cas/role', // 气正通关联角色数据修改
    roleByGet: 'GET cma-app/cas/role', // 气正通关联角色数据查询
    roleByDelete: 'DELETE cma-app/cas/role', // 气正通关联角色数据删除,
    roleByAddGet: 'GET cma-app/cas/role/roles', // 气政通关联角色数据新增查询,
    originDataReloadSync: 'POST cma-app/cas/manualpush', //气政通原始数据重新同步
    roleByEditGet: 'GET cma-app/cas/role/level/check', // 气正通根据职级查询，勾选角色
    originDataPayDataFilter: 'PUT ods-app/monitorExec/machineSelect', // 积木原始数据-支付数据管理
    doubtDataPayDataDoubtNormal: 'PUT ods-app/monitorExec/doubt/normal', // 疑点数据管理-支付数据管理-确认正常
    waitReturnConfirm: 'PUT ods-app/monitorExec/doubt/return', // 疑点数据管理-支付数据管理 待回退确认
    doubtDataPayDoubtConfirm: 'PUT ods-app/monitorExec/doubt/confirm', // 疑点数据管理-支付数据管理- 疑点确认
    monitorDataManagePayList: 'GET ods-app/monitorSetup/rule/list', // 监控规则管理-支付数据列表
    getBaseDataCodeTable: 'GET sys/dictType/:dictTypeId', // 获取配置的基础数据码表
    postMonitorRulesAddApi: 'POST ods-app/monitorSetup/rule', //提交监控规则管理-支付数据-新增
    getCurrentYearListTreeData: 'GET form/listModelTreeData', // 获取当前年度树数据
    getListTreeChildrenData: 'GET form/listModelTreeChildData', // 获取当前树子数据
    putMonitorRulesEditApi: 'PUT ods-app/monitorSetup/rule', // 修改提交监控规则管理-支付数据-修改
    getMonitorRulesBackApi: 'GET ods-app/monitorSetup/rule', // 监控规则管理-支付数据-回显
    getOrgChildren: 'GET sys/org/children', //获取组织树
    getSearchTree: 'GET sys/org/tree', //搜索组织机构数
    getDepts: 'GET sys/dept/list', //根据父单位id查询部门信息
    getControlTree: 'GET sys/org/control/tree', //获取树结构控件的单位树
    getPosts: 'GET sys/post/list', //根据父单位id查询岗位信息
    deleteMonitorList: 'DELETE ods-app/monitorSetup/rule', //  监控规则管理-支付数据-list-删除接口
    isEnableListItemApi: 'PUT ods-app/monitorSetup/rule/enable', // 监控规则管理-支付数据 -list-启用禁用
    getManageOrgList: 'GET manage/org', // 管理单位  查询
    deleteManagrOrg: 'DELETE manage/org', // 管理单位   删除
    getMedicalRegistrationList: 'GET cma-app/medicalfee/medicalRegistration/list', //医药费报销登记-报销-列表
    getMedicalRegistration: 'GET cma-app/medicalfee/medicalRegistration', //医药费报销登记-报销-查询
    deleteMedicalRegistration: 'DELETE cma-app/medicalfee/medicalRegistration', //医药费报销登记-报销-删除
    updateMedicalRegistration: 'PUT cma-app/medicalfee/medicalRegistration', //医药费报销登记-报销-修改
    addMedicalRegistration: 'POST cma-app/medicalfee/medicalRegistration', //医药费报销登记-报销-新增
    exportMedicalRegistration: 'GET cma-app/medicalfee/medicalRegistration/export', //医药费报销登记-报销-导出
    printMedicalRegistration: 'POST cma-app/medicalfee/medicalRegistration/print', //医药费报销登记-报销-打印
    updateReimbursementCard: 'PUT cma-app/medicalfee/reimbursementCard', //医药费报销登记-报销-选择报账卡号
    getPersonnelInformation: 'GET cma-app/medicalfee/personnelInformation', //医药费报销登记-根据医疗编号获取人员名单信息
    getLogicCode: 'GET cma-app/medicalfee/logicCode', //医药费报销登记-根据应用关联获取医药费基础类型的数据列表
    getDrugExpensePersonnelMoldId: 'GET cma-app/medicalfee/drugExpense/personnelMoldId', //医药费报销登记-报销-根据人员类型主键id获取自费费率数据
    getServiceChargePersonnelMoldId: 'GET cma-app/medicalfee/serviceCharge/personnelMoldId', //医药费报销登记-报销-根据人员类型主键id获取医事服务费金额
    getDrugExpense: 'GET cma-app/medicalfee/drugExpense', //基本信息-报销费率-药费自费费率获取
    setDrugExpense: 'POST cma-app/medicalfee/drugExpense', //基本信息-报销费率-药费自费费率金额设置
    getServiceCharge: 'GET cma-app/medicalfee/serviceCharge', //基本信息-报销费率-医事服务费金额获取
    setServiceCharge: 'POST cma-app/medicalfee/serviceCharge', //基本信息-报销费率-药费自费费率金额设置
    getMedicalRate: 'GET cma-app/medicalfee/medicalRate', //基本信息-报销费率-获取所有报销费率
    getJuisdictionControlList: 'GET cma-app/norm/juisdiction/control/list', //查询报账卡控件
    getBusinessCardList: 'GET cma-app/cashier/businessCard/businessCardList', //公务卡查询
    businessDetailedExcel: 'POST cma-app/cashier/BusinessCardexport', // 公务卡导出
    getAuthorizationList: 'GET cma-app/norm/juisdiction', // 查询报账卡授权
    baseIdGetAuthorization: 'GET cma-app/norm/juisdiction/:id', // 根据id查询报账卡授权
    multipleAuthorization: 'POST cma-app/norm/juisdiction', // 批量报账卡指标授权 批量授权
    empowerByUnit: 'POST cma-app/norm/juisdiction/batch', // 批量报账卡指标授权 按单位授权
    deleteAuthorization: 'DELETE cma-app/norm/juisdiction', // 报账卡指标授权 删除
    getUserGroupList: 'GET sys/usergroup/list', // 获取穿梭框左侧用户组列表
    findLoginUserByIdAndRoleId: 'GET cma-app/manage/org/list', // 获取穿梭框左侧用户组列表
    getSelectedTransferData: 'GET cma-app/norm/juisdiction/selected', // 获取已经选中的穿梭框数据
    getOrgTree: 'GET sys/v1/org/tree', //单位树v1 目前报账卡左侧穿梭框使用
    businessCardChecked: 'GET cma-app/cashier/businessCard/businessCardChecked', // 公务卡待核对，已核对接口
    batchCheck: 'PUT cma-app/cashier/businessCard/batchCheck', // 公务卡待核对，已核对接口
    BusinessCardCheckedExport: 'POST cma-app/cashier/BusinessCardCheckedExport', // 公务卡待核对，已核对接口
    BusinessCardSummarize: 'PUT cma-app/cashier/businessCard/businessCardSummarize', // 公务卡汇总
    BusinessCardSummary: 'POST cma-app/cashier/businessCard/businessCardSummary', // 公务卡汇总查询
    // generate: 'PUT cma-app/cashier/unity/generate', // 公务卡汇总查询
    summaryExcel: 'POST cma-app/cashier/summaryExcel', // 公务卡汇总导出
    remittancedetail: 'GET cma-app/cashier/remittance/detail', //获取银行账户
    remittanceList: 'GET cma-app/cashier/remittance/list', //批量转账代办
    accountInfoSetByOrg: 'GET cma-app/control/unit/accountInfoSetByOrg', //获取银行账户
    getAccountInfoList: 'GET cma-app/control/unit/accountInfoListbyOrg', //获取银行账户
    cancelVerification: 'PUT cma-app/cashier/businessCard/cancelVerification', // 公务卡已核对，取消核对

    //现金管理
    getExtractList: 'GET cma-app/extract/list', //现金提取登记列表查询
    getExtractDetail: 'GET cma-app/extract/detail', //现金提取(登记、修改)详情查询
    getCheckExtract: 'GET cma-app/extract/checkExtract', //现金提取校验是否需要重新盘库
    saveExtract: 'POST cma-app/extract/insert', //现金提取登记保存
    updateExtract: 'PUT cma-app/extract/modify', //现金提取登记修改
    getCashReceiveList: 'GET cma-app/receive/list', //现金领用登记列表查询
    getCashReceiverUserList: 'GET cma-app/receive/receiverUserList', //现金领用人查询
    getCashReceiveDetail: 'GET cma-app/receive/detail', //现金领用登记详情查询
    saveCashReceive: 'POST cma-app/receive/insert', //现金领用登记保存
    getCashDepositDetail: 'GET cma-app/deposit/detail', //现金送存登记详情查询
    saveCashDeposit: 'POST cma-app/deposit/save', //现金送存登记保存
    getDayInOutList: 'GET cma-app/dayInOut/list', //现金日收支列表查询
    generateDayInOutList: 'GET cma-app/dayInOut/createDayInOut', //生成现金日收支汇总
    exportDayInOutList: 'GET cma-app/dayInOut/exportDayInOut', //现金日收支明细导出
    getVaultDetailList: 'GET cma-app/vaultDetail/list', //现金库存明细列表查询
    generateVaultDetail: 'GET cma-app/vaultDetail/create', //生成当日库存明细
    getCashExtractCheckList: 'GET cma-app/check/cashCheckList', //现金管理查询现金支票信息列表

    //个人储蓄卡
    getSummaryNumberList: 'GET cma-app/cashier/summaryNumberList', //还款单号查询列表
    getPersonCardDetail: 'POST cma-app/cashier/personCardReturn/detailList', //个人储蓄卡还款明细列表查询
    getPersonCardInfo: 'GET cma-app/cashier/personCardReturn/detail', //个人储蓄卡还款明细列表查询
    getPersonCardCollect: 'POST cma-app/cashier/personCardReturn/collectionList', //个人储蓄卡还款汇总列表查询
    getAccountInfo: 'GET cma-app/control/unit/accountInfoList', //银行账户
    personCardCollect: 'POST cma-app/cashier/businessCard/collect', //汇总
    personExportDetail: 'POST cma-app/cashier/personCardReturn/exportDetails', //个人储蓄卡还款明细导出
    personExportCollect: 'POST cma-app/cashier/personCardReturn/exportCollects', //个人储蓄卡还款汇总导出
    exportPersonBank: 'POST cma-app/cashier/exportPersonBank', //个人储蓄卡还款汇总新接口导出
    generate: 'PUT cma-app/cashier/unity/generate', //出纳办理

    // 项目管理附件
    getPmAttachmentPageList: 'GET cma-app/pm/attachment/page', // 项目管理附件分页查询接口
    getPmAttachmentSummaryList: 'GET cma-app/pm/attachment/summary/list', // 项目管理附件汇总列表接口
    getPmAttachmentDownloadUrl: 'GET cma-app/pm/attachment/download-url', // 项目管理附件汇总列表接口
    getPmAttachmentBatchDownloadUrl: 'GET cma-app/pm/attachment/download-url/batch', // 项目管理附件汇总列表接口

    //汇总
    getFundSourceList: 'GET cma-app/cashier/fundTypeCodeList', //资金来源列表查询

    // 项目管理附件
    getPmAttachmentPageList: 'GET cma-app/pm/attachment/page', // 项目管理附件分页查询接口
    getPmAttachmentSummaryList: 'GET cma-app/pm/attachment/summary/list', // 项目管理附件汇总列表接口
    getPmAttachmentDownloadUrl: 'GET cma-app/pm/attachment/download-url', // 项目管理附件汇总列表接口
    getPmAttachmentBatchDownloadUrl: 'GET cma-app/pm/attachment/download-url/batch', // 项目管理附件汇总列表接口

    //出纳
    cashIframe: 'GET cma-app/cashier/cash/detail', //出纳-现金结算（iframe）
    checkIframe: 'GET cma-app/cashier/cash/chequeHandling', //支票结算-支票出纳登记簿（iframe）
    checkGenerate: 'PUT cma-app/cashier/unity/checkGenerate', //支票结算出纳办理
    payState: 'PUT cma-app/cashier/unity/payState', //现金、转账汇款的出纳办理，不推ncc
    processRecall: 'GET cma-app/cashier/unity/processRecall', //出纳收回

    //稿酬
    getRemunerationList: 'GET cma-app/remuneration', //稿酬列表查询
    getRemunerationNoPay: 'GET cma-app/remuneration/unitSelectData', //支付确认选择框
    getRemunerationPay: 'GET cma-app/remuneration/unitSelectDataOver', //查询选择框
    getPaymentAmount: 'GET cma-app/remuneration/unitAccount', //查询稿酬
    payment: 'PUT cma-app/remuneration/payment', //查询稿酬
    exportRemuneration: 'GET cma-app/remuneration/exportRemuneration', //查询稿酬

    //收款结算
    getreceivelist: 'GET cma-app/cashier/receive/list', //收款结算列表查询
    checkNumberList: 'GET cma-app/cashier/check/checkNumberList', //新支票号

    //支票退换业务
    getfindCheckExchangeList: 'GET cma-app/cashier/cash/findCheckExchangeList', //支票退还业务查询列表
    putCheckWithdraw: 'GET cma-app/cashier/check/checkWithdraw', //支票退办

    putexChange: 'PUT cma-app/cashier/check/exChange', //支票退换
    exportByBankFormat: 'POST cma-app/cashier/exportByBankFormat',
    exportAccount: 'POST cma-app/cashier/exportAccount',
    getReimbursementCard: 'GET cma-app/medicalfee/reimbursementCardNo', //医药费报销登记-报销列表-查询报账卡的bizSolId和使用年度
    getSerialNum: 'GET form/serialNum/codeRuleId', //根据编号id获取编号
    getWageClass: 'GET cma-app/cma/wage/wageClass', //工资分解-获取工资类别
    getWageMonth: 'GET cma-app/cma/wage/wageMaxMonth', //工资分解-获取最大月份
    getWageBatch: 'GET cma-app/cma/wage/wageBatch', //工资分解-获取批次
    getWageItems: 'GET cma-app/cma/wage/wageItem', //工资分解-获取工资项
    getExtractWageDetailed: 'GET cma-app/cma/wage/extractWageDetailed', //工资分解-提取工资明细
    getDecomposeWageDetailed: 'GET cma-app/cma/wage/decomposeWageDetailed', //工资分解-分解工资明细
    getBizSolIdByLogicCode: 'GET setup/bizAssocLogic/getBizSolIdByLogicCode', //根据逻辑编码获取bizSolId
    getBudgetProjectTree: 'GET ic/budgetProject/tree', //预算项目树获取
    getNormNuisdictionList: 'GET cma-app/norm/juisdiction/control/list', //查询报账卡控件
    delSalaryDetails: 'DELETE cma-app/cma/wage/delSalaryDetails', //
    saveData: 'POST cma-app/cma/wage/allSave', //工资分解-一键保存
    extractSyncWaPayment: 'GET cma-app/cma/wage/syncWaPayment', //工资分解-提取工资数据
    generateWageReceipt: 'POST cma-app/cma/wage/generateWageReceipt', //工资分解-生成工资报销单和五险一金单
    syncWage: 'GET cma-app/cma/wage/syncWage', //工资分解-同步NCC工资发放项目
    getEconomicClassify: 'GET cma-app/medicalfee/economicClassify', //医药费报销登记-报销单获取个人储蓄卡中经济分类方法

    sysRegisterApi: 'sys/registers', // 管理单位，注册系统
    getMenusRoleList: 'GET sys/menus', // 管理单位 获取菜单
    getMenusByRole: 'GET sys/role/menus', // 根据角色获取菜单
    getSysRoleUsers: 'GET sys/identity/list', // 管理单位,用户列表
    getSysUserListApi: 'GET sys/role/roles', // 管理单位，角色列表
    getMemberListBySys: 'GET sys/role/identity/list', // 根据管理单位获取成员列表
    getMenuAndOrgByIdentityId: 'GET cma-app/manage/org/getMenuAndOrgByIdentityId', // 根据角色ID、用户ID查询对应的菜单ID和单位ID进行回显
    addManageOrgApi: 'POST cma-app/manage/org', // 管理单位 新增角色和用户

    getHomePageApi: 'GET ods-app/homePage/info', // 联网监控首页获取信息
    getHomePageOrgApi: 'GET ods-app/homePage/org', // 获取首页 组织单位列表
    loginOut: 'GET auth/logout', // 登出
    getCurrentUserInfo: 'GET sys/user/info', //获取当前登录用户信息
    getFileMD5: 'GET public/fileStorage/presigned/fileencryption', //根据文件md5查询是否存在该文件
    presignedUploadUrl: 'POST public/fileStorage/presigned', //文件预上传接口
    getFileMerage: 'GET public/fileStorage/compare', //根据文件路径合并文件
    storingFileInformation: 'POST public/fileStorage/file', //存储文件信息到数据库接口
    bizRelAtt: 'POST public/bizRelAtt/replace', //将附件关联到业务
    getFileZip: 'POST public/fileStorage/getZip', //获取压缩包
    getFileDatails: 'GET cma-app/profile/detailInfo', //档案详情接口
    importExcel: 'POST report/excel/import', // 导入操作
    refreshImportExcel: 'GET report/re/refreshImportExcel', // 导入刷新上传
    getAllProfileInfoList: 'GET cma-app/completed/AllProfileInfo/list', //获取项目下所有的浮动表文件信息
    saveArchivesFile: 'POST cma-app/archives/supply', //文件上传
    approvaleMedicalRegistration: 'PUT cma-app/medicalfee/medicalRegistration/approval', //医药费报销登记-报销-审核按钮

    postSuperReportImport: 'POST ods-app/execDyna/supervision', // 执行动态 督办快报 导入
    downloadSuperReport: 'GET ods-app/execDyna/supervision', // 执行动态 督办快报 下载
    exportWordReport: 'GET ods-app/quality/exportWord', // 执行动态 执行通报 导出
    importReportNotification: 'POST ods-app/notification', //执行动态 执行通报导入
    publishExportWordRelease: 'GET ods-app/quality/exportWordRelease', // 执行动态 执行通报 发布

    getMonitorWarningBar: 'GET ods-app/monitorWarning/org/situation', // 图表-中国气象局/各(区、市)-柱状图
    getMonitorWarningPie: 'GET ods-app/monitorWarning/situation/piechart', // 图表-监控预警-饼图
    getMonitorWarningInfo: 'GET ods-app/monitorWarning/situation/info', // 图表-监控预警数据

    getPortalBudgeProgressList: 'GET cma-app/protalDoor/portaBudgeProgress', // 未达序时进度预算指标iframe-列表
    againCreate: 'GET cma-app/vaultDetail/againCreate', // 重新生成当日库存明细
    againCreateDayInOut: 'GET cma-app/dayInOut/againCreateDayInOut', // 生成现金日收支明细报表(一段时间内)
    ...moreApi, //这个不许去掉
};
