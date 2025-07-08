// 按钮编写方法名,默认返填内容
export const scriptStr = `
// 送交(送交特殊逻辑：前置为onRule(); 并且入参为true,如果不是不用加)
// submitForm(buttonId,{codeFlag:'YES'},()=>{
//   saveSubmit(bizInfo.bizInfoId, bizInfo);
// })
// 无流程的保存
// submitForm(buttonId,{codeFlag:'YES'},()=>{
//  saveNoProcDef();
//  dropScopeTab();
// })
// 驳回
// submitForm(buttonId,{codeFlag:'NO'},()=>{
  // reject();
// })
// 办结
// submitForm(buttonId,{codeFlag:'NO'},()=>{
// completeBiz();
// })
// 暂存(false为不做校验,其他情况都做校验)
// submitForm(buttonId,{codeFlag:'YES'},()=>{
//   dropScopeTab();
// },false
//)
// 转办
// submitForm(buttonId,{codeFlag:'NO'},()=>{
// setIsShowRelevance(true);
// })
// 打印
// printTemplate();
// 打印预览页面默认不展示批量打印按钮，可展示示例：printTemplate({showBatchPrintBtn:true})
// 传阅
//circulate();
// 办理详情
// viewFlow();
// 新增
// openFormDetail();
// 新增是否带入编码(columnCode为表单字段编码，nodeId为树选中信息属性)
// let data = getData();
// let leftTreeInfo = JSON.parse(data.leftTreeInfo.json?data.leftTreeInfo.json:'{}');
// let searchObj = data.searchObj;
// let listInfo = data.listInfo;
// let GRADE = parseInt(leftTreeInfo.GRADE?leftTreeInfo.GRADE:'0') + 1;
// let PARENT_CODE = leftTreeInfo.OBJ_CODE?leftTreeInfo.OBJ_CODE:'0';
// let PARENT_ID = data.leftTreeInfo.nodeId?data.leftTreeInfo.nodeId:'0';
// openFormDetail({columnCode:leftTreeInfo.OBJ_CODE});
// // 新增是否带入搜索项或者列表的勾选项
// let data = getData();
// let leftTreeInfo = JSON.parse(data.leftTreeInfo.json?data.leftTreeInfo.json:'{}');
// let searchObj = data.searchObj;
// let listInfo = data.listInfo;
// openFormDetail({},{columnCode:listInfo[0].CREATE_USER_ID,columnCode:searchObj.year});
// 修改
// openFormDetail({},{},rowInfo.BIZ_ID, rowInfo,'update');
//列表按钮对表单的权限操作(DOCUMENT_NUM为控件的编码，true的时候可编辑，false不可编辑)
//setFormAuth({DOCUMENT_NUM:false});
// 删除
// handleDelete(rowInfo);
// 调用接口（示例：第一个但是是请求类型，第二个参数是请求地址，第三个参数是传参）
// fetchCheckAPI("GET", "ic/norm/check", {})
// 导出
// onExport();
// 启用
// startUse();
// 停用
// stopUse();
// 启用（劳务人员）
// laborStartUse();
// 停用（劳务人员）
// laborStopUse();
// 基础数据结转功能
// finishTurn();
// 基础数据按照项目结转
// finishTurnToProject();
// 预算指标库收回功能
// regainItem();
// 预算指标库取消收回功能
// cancelRegainItem();
// 预算指标库项目结转
// carryProject();
// 预算指标库列表结转
// carryList();
// 预算指标库预警设置
// warningSet();
//根据浏览器高度计算弹框高度
//getBrowserHeight()
// 基础提示框
// baseConfirm({
//   title: '提示',
//   content: 'ddddd提示ddddddd提示dddwef',
//   okText: '确认',
//   cancelText: '取消',
//   onOk: () => {
//     console.log('dddddwadaffew');
//   },
//   onCancel: () => {
//     console.log('regergerb');
//   },
//  width:600,
//  height:getHeight(40),//px
// });
// 通用message提示
// baseMessage('提示内容').warning();
// baseMessage('提示内容').success();
// baseMessage('提示内容').error();
// 基础弹框
// baseModalComponments({
//   title: '测试弹框',
//   width: 600,
//   height: 300,
//   onOk: (values) => {
//     console.log('values', values);
//   },
//   renderFooterList: [
//     {
//       label: '取消',
//       key: 'cancel',
//       btnProps: {},
//       onClick: () => {},
//     },
//     {
//       label: '确定',
//       key: 'submit',
//       btnProps: {
//         type: 'primary',
//       },
//       onClick: (values) => {
//         console.log('values', values);
//       },
//     },
//     {
//       label: '按钮名字',
//       key: 'custom',
//       btnProps: {},
//       onClick: () => {
//         console.log('custom');
//       },
//     },
//   ],
//   renderChildList: [
//     {
//       label: '选择意见',
//       key: 'chooseOpinion',
//       componentName: 'Input',
//       formRules: [
//         {
//           required: true,
//           message: '请输入选择意见',
//         },
//         { max: 50, message: '最多输入50个字符' },
//       ],
//       componentProps: {
//         placeholder: '疑点确认',
//       },
//     },
//     {
//       label: '选择预警分类',
//       key: 'warningType',
//       componentName: 'Select',
//       formRules: [{ required: true }],
//       componentProps: {
//         placeholder: '请选择',
//         options: [
//           {
//             value: 'jack',
//             label: '会计规范性监控',
//           },
//           {
//             value: 'lucy',
//             label: '财务管理监控',
//           },
//           {
//             value: 'Yiminghe',
//             label: '项目管理类',
//           },
//         ],
//       },
//     },
//     {
//       label: '日期',
//       key: 'date',
//       componentName: 'RangePicker',
//     },
//     {
//       label: '多选',
//       key: 'checkGroup',
//       componentName: 'CheckboxGroup',
//       componentProps: {
//         options: [
//           {
//             value: 'jack',
//             label: '会计规范性监控',
//           },
//           {
//             value: 'lucy',
//             label: '财务管理监控',
//           },
//           {
//             value: 'Yiminghe',
//             label: '项目管理类',
//           },
//         ],
//       },
//     },
//     {
//       label: '单选',
//       key: 'radioGroup',
//       componentName: 'RadioGroup',
//       componentProps: {
//         options: [
//           {
//             value: 'jack',
//             label: '会计规范性监控',
//           },
//           {
//             value: 'lucy',
//             label: '财务管理监控',
//           },
//           {
//             value: 'Yiminghe',
//             label: '项目管理类',
//           },
//         ],
//       },
//     },
//     {
//       label: '文本域',
//       key: 'text',
//       componentName: 'TextArea',
//       componentProps: {
//         placeholder: '请输入',
//       },
//     },
//     {
//       label: '上传',
//       key: 'file',
//       componentName: 'Upload',
//       componentProps: {},
//     },
//   ],
// });
// 按钮事件 走完接口想刷新一下列表看这里（需要放到按钮请求的回调里）
// // 左树右列表：
// getListModelTreeData();
// getListModelData();
// // 仅仅列表：
// getListModelData();
// 嵌套iframe弹框
// baseIframeModalComponments({
//   title: '提示',
//   width: 800,
//   height: 460,
//   url: '',
//   renderFooterList: [
//     {
//       label: '取消',
//       key: 'cancel',
//       btnProps: {},
//       onClick: () => {},
//     },
//     {
//       label: '确定',
//       key: 'submit',
//       btnProps: {
//         type: 'primary',
//       },
//       onClick: () => {
//         console.log('values');
//       },
//     },
//     {
//       label: '按钮名字',
//       key: 'custom',
//       btnProps: {},
//       onClick: () => {
//         console.log('custom');
//       },
//     },
//   ],
// });
//将列表中的值带入到表中中
// let data = getData();
// let listInfo = data.listInfo;//列表选中的行数据
// const search = location.search.includes('?')
//   ? location.search
//   : \`?${location.search}\`;
// dispatch({
//   type: 'formShow/updateStatesGlobal',
//   payload: {
//     urlFrom: history.location.pathname + search,//这个是用于返回按钮的地址
//     leftTreeData: {
//       dragCodes:{},
//       searchCodes:{ID:listInfo[0]['ID']}//这个用来赋值
//     },
//   },
// });
// historyPush({//这个是跳转
//   pathname: \`/dynamicPage/formShow\`,
//   query: {
//     bizSolId: '1645655767367331842',
//     currentTab:UUID(),
//     title:'新增',
//     usedYear:'2023',
//     buttonId:buttonId
//   },
// });
// steptsModalComponments({
//   title:'验收情况',
//   width:850,
//   height:100,
//   steptsList:[
//     {
//       title: 'Finished',
//       description:'11',
//       status:'finish'
//     },
//     {
//       title: 'In Progress',
//       description:'22',
//       subTitle: 'Left 00:00:08',
//       status:'finish'
//     },
//     {
//       title: 'Waiting',
//       description:'33',
//       status:'process'
//     },
//   ],
//   onCancel:()=>{
//    console.log('cancel');
//   }
// })
`;
