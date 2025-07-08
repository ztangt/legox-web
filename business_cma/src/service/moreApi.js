export default {
    getHuiJianLevel: 'GET cma-app/cma/huijian/classification', //获取会见等级
    // 预算指标库 TODO
    getProjectBizSolId: 'GET ic/norm/getProjectBizSolId', //获取预算项目bizSolId
    // getBudgetProjectTree: 'GET ic/budgetProject/tree', //预算项目树获取
    getNormList: 'GET cma-app/norm/juisdiction/norm/list', //获取预算指标库列表
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
    getExportList: 'GET report/export/list', // 导出记录列表
    more_budgetTarget_exportFile: 'GET cma-app/norm/export', // 报账卡管理新导出

    getUsersByIds: 'GET sys/identity/list', //根据岗人ID集合获取岗人详情
    getUsergroupByIds: 'GET sys/usergroup/findInfoByIds', //根据用户组ID集合获取用户组详情
    getOrgByIds: 'GET sys/org/findInfoByIds', //根据单位ID集合获取单位详情
    getPostByIds: 'GET sys/post/findInfoByIds', //根据岗位ID集合获取岗位详情
    getDeptByIds: 'GET sys/dept/findInfoByIds', //根据部门ID集合获取部门详情
    getRuleByIds: 'GET sys/role/findInfoByIds', //根据角色ID集合获取角色详情
    queryUser: 'GET sys/identity/list', //用户信息列表查询
    getUgs: 'GET sys/usergroup/list', //根据父单位id查询岗位信息
    getSysRoles: 'GET sys/role/roles', //获取角色列表

    more_getLogicCode: 'GET setup/bizAssocLogic/getBizSolIdByLogicCode', //获取逻辑编码 ,新的变量都加个more_前缀,区分api

    more_qy_getUnitList: 'GET cma-app/manage/org/list', //查询银企直连的单位下拉
    more_qy_getAccountList: 'GET cap-payment/api/acct/query/account', //查询单位下账户

    more_qy_getBaTranList: 'GET cap-payment/api/ba/query/trans/detail', //普通账户交易明细查询
    more_qy_getZbaTranList: 'GET cap-payment/api/zba/query/trans/detail', //零余额账户交易明细查询
    more_qy_exportBaTranList: 'GET cap-payment/api/ba/trans/export', //普通账户交易明细导出
    more_qy_exportZbaTranList: 'GET cap-payment/api/zba/trans/export', //零余额账户交易明细导出

    more_qy_getBaBalanList: 'GET cap-payment/api/ba/query/balance', //普通账户余额与额度查询
    more_qy_getZbaBalanList: 'GET cap-payment/api/zba/query/limit', //零余额账户余额与额度查询

    more_qy_stlmtPageList: 'GET cap-payment/api/pay/stlmtPageList', //支付查询
    more_qy_checkPsd: 'POST cma-app/payment/password/check', //校验支付密码
    more_qy_confirmPay: 'POST cma-app/payment/topay', //支付
    more_qy_batchNullify: 'POST cap-payment/api/acct/settlement/delete', //作废
    more_qy_exportStlmt: 'GET cap-payment/api/pay/stlmt/export', //支付查询导出
    more_qy_batchRepay: 'POST cma-app/payment/batchRepay', //重新支付
    more_qy_batchCancel: 'POST cma-app/payment/batchCancel', //终止支付
    more_qy_syncPayStatus: 'POST cap-payment/api/acct/syncPayStatus', //状态下载

    more_qy_hasCreateStlmt: 'GET cma-app/payment/isCreatePayBymainTableId', //查询是否已生成结算单
    more_qy_getSettlementList: 'GET cma-app/payment/selectFormPayList', //查询支付结算单列表
    more_qy_createSettlement: 'POST cma-app/payment/doSavePayListInfo', //生成结算单
    more_qy_getCardType: 'GET cap-payment/api/ccb/queryRefund', //查询公务卡类型

    more_qy_getPaySettlementList: 'GET cma-app/payment/management/list', //获取支付结算列表
    more_qy_changePaySetStatus: 'PUT cma-app/payment/management/updateProcessingStatus', //修改支付结算状态
    more_qy_savePaySetStatus: 'PUT cma-app/payment/management/savePaySettlementAndPushCashier', //生成支付结算单
    more_qy_isEnableBank: 'GET cma-app/payment/management/isEnableBank', //检查是否启用银企配置项

    more_contract_getContractList: 'GET cma-app/contractTabulation/list', //获取合同列表(合同台账、审批、已盖章、未盖章)
    more_contract_getContractDetails: 'GET cma-app/contractTabulation/history', //获取合同详情列表
    more_contract_camsContractNum: 'GET cma-app/contractTabulation/camsContractNum', //气科院已盖章合同管理列表-查询不同状态的合同数目

    more_contract_list: 'GET cma-app/contractTabulation/executeList', //合同列表执行金额下钻列表
    more_contractLedger_file: 'GET cma-app/contractTabulation/file', //合同台账附件列表
    more_contractArchives_file: 'GET cma-app/contractTabulation/fileFj', //合同档案管理附件列表
    more_contractTemplate_file: 'GET cma-app/contract/template/list', //合同模板下载

    more_buy_process: 'GET cma-app/purchase/process/picture', //采购进度图
    more_buy_archives: 'GET cma-app/purchase/record/list', //采购档案管理列表
    more_buy_archives_file: 'GET cma-app/purchase/record/fileList', //采购档案管理附件列表
    more_budget_getLedgerList: 'GET cma-app/standing/book', //获取预算指标台账列表

    more_get_download_file: 'GET cma-app/ipmtInformation/queryFileByProjectCode', //获取档案类型文件下载地址
    more_get_subsystemFileIframe_list: 'GET cma-app/ipmtInformation/fileArea', //获取综合查询附件列表
    more_get_warnExecute_list: 'GET cma-app/ipmtInformation/projectStatus', //项目执行进度

    more_get_warnConstruct_list: 'GET cma-app/ipmtInformation/projectConstructContent/list', //项目建设内容列表获取
    more_get_warnConstruct_percent: 'GET cma-app/ipmtInformation/projectConstructContent/proportion', //项目建设百分比列表获取

    more_get_personWage_year: 'GET cma-app/personalWage/year', //个人工资分解-->年度列表获取
    more_get_personWage_org: 'GET cma-app/personalWage/org', //个人工资分解-->单位列表获取
    more_get_personWage_userInfo: 'GET cma-app/personalWage/user', //个人工资-->分解人员信息获取
    more_get_personWage_infoAll: 'GET cma-app/personalWage/listAll', //个人工资-->分解获取薪资三项
    more_get_personWage_listGroup: 'GET cma-app/personalWage/listGroup', //个人工资-->点击查询分月/汇总列表
    more_get_personWage_listDetail: 'GET cma-app/personalWage/listDetail', //个人工资-->查询分月之后的详情
    more_export_personWage: 'GET cma-app/personalWage/exportSalary', //个人工资-->导出
    more_get_personWage_reimbursementGroup: 'GET cma-app/personalWage/reimbursementGroup', //个人工资-->报销列表
    more_get_personWage_reimbursementList: 'GET cma-app/personalWage/reimbursementList', //个人工资-->报销明细
    more_export_personWage_business: 'GET cma-app/personalWage/exportBusinesscardBill', //个人工资-->公务卡导出
    more_export_personWage_personal: 'GET cma-app/personalWage/exportDepositcardBill', //个人工资-->个人储蓄卡导出
    more_export_personWage_laborChargeDetail: 'GET cma-app/personalWage/laborChargeDetail', //个人工资-->劳务费查询
    more_export_personWage_laborChargeGroup: 'GET cma-app/personalWage/laborChargeGroup', //个人工资-->劳务费查询汇总
    more_export_personWage_laborChargeExport: 'GET cma-app/personalWage/exportLaborChargeInfo', //个人工资-->劳务费导出

    more_permissionSetView_getRole: 'GET cma-app/manage/org/getRoleByIdentityId', //权限设置查看-获取角色列表
    more_permissionSetView_getUnit: 'GET cma-app/manage/org/getManageOrgAndAuthority', //权限设置查看-根据角色获取单位列表
    more_permissionSetView_getSysList: 'GET sys/register/getRegisterByIdentityId', //权限设置查看-根据身份获取所属系统
    more_permissionSetView_getMenuList: 'GET cma-app/manage/org/getMenuByRoleId', //权限设置查看-根据所属系统获取菜单列表
    more_permissionSetView_getWeight: 'GET sys/role/getRoleRefMenuByRoleId', //权限设置查看-获取权重
    more_permissionSetView_getCustomWeight: 'GET sys/dataRule/getDataRuleByCode', //权限设置查看-根据code获取权重
    more_permissionSetView_getRuleList: 'GET public/fileStorage/readFileContent', //权限设置查看-获取规则列表
    more_permissionSetView_delManageOrg: 'DELETE cma-app/manage/org/deleteByOrgId', //权限设置查看-删除管理单位
    more_permissionSetView_handleErrorData: 'POST cma-app/manage/org/errorDataProcessing', //权限设置查看-一键处理异常数据

    more_gatewayList_getTodoList: 'GET bpm/work/todo', //门户首页-待办
    more_gatewayList_getSendList: 'GET bpm/work/send', //门户首页-发送

    more_dataEntryIssued_getList: 'GET cma-app/project/refine/middle', //预算编报-数据录入与下发-列表
    more_dataEntryIssued_getChildList: 'GET cma-app/project/refine/middle/queryDecomposeList', //预算编报-数据录入与下发-下级列表

    more_dataEntryRule_getList: 'GET cma-app/approvalRule/list', //预算编报-审核规则-列表
    more_dataEntryRule_add: 'POST cma-app/approvalRule', //预算编报-审核规则-新增
    more_dataEntryRule_edit: 'PUT cma-app/approvalRule', //预算编报-审核规则-修改
    more_dataEntryRule_delete: 'DELETE cma-app/approvalRule', //预算编报-审核规则-删除
    more_dataEntryRule_detail: 'GET cma-app/approvalRule', //预算编报-审核规则-详情
    more_dataEntry_getListModelId: 'GET setup/bizSol/bussinessForm/cfg/:bizSolId', //预算编报-根据bizSolId获取模型ID
    more_deposit_findBalanceDetail: 'GET cma-app/deposit/findBalanceDetail', //收入送存登记详情查询
    more_deposit_saveBalance: 'POST cma-app/deposit/saveBalance', //收入送存登记保存
    getControlSearchTree: 'GET sys/org/control/search/tree', //搜索树结构控件的单位树
    more_deposit_findExpenseReportsByContract: 'GET cma-app/contract/findExpenseReportsByContract', //合同
    getRefineTree: 'GET cma-app/project/refine/tree', //查询预算编报树
    getWorkSearch: 'GET bpm/work/search', //高级查询-自定义查询条件获取
    saveSearchCol: 'POST bpm/work/search', //高级查询-自定义查询条件设置
    getWorkRule: 'GET bpm/workRule', //事项规则查询
    getFastSendTaskNodes: 'GET bpm/bizTask/process-fast-send/nodes', //一键审批获取任务送审环节信息
    processSend: 'POST bpm/bizTask/process-send', //流程送交
    getUsersByIds: 'GET sys/identity/list', //根据岗人ID集合获取岗人详情
    getSendUserTree: 'GET sys/send/user/tree', //获取送交选人维度树
    getSubordinateSendTree: 'GET sys/send/user/subordinate/tree', //获取送办组织树（用于是否有下级的查询）
    queryUser: 'GET sys/identity/list', //用户信息列表查询
    getPostUserList: 'GET sys/user/post/userlist', //通过岗位获取用户列表
    getGroupUserList: 'GET sys/user/usergroup/userlist', //通过用户组获取用户列表
    getRoleUserList: 'GET sys/role/users', //通过角色获取用户列表
    getCustomUserList: 'GET bpm/bizTask/process/node-user/custom/list', //获取自定义送交人员集合
    getSearchSendTree: 'POST sys/send/user/tree/search', //搜索送交选人维度树
    getTodoWork: 'GET cma-app/qx/work/todo', //待办事项列表
    traceWork: 'POST bpm/work/trace', //加入/取消跟踪（支持批量）
};
