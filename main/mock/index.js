
const Mock = require('mockjs');
export const id = () => Mock.mock('@id')
export const code = () => Mock.mock('@guid')
export const title = () => Mock.mock('@ctitle(3, 5)')
export const name = () => Mock.mock('@cname')
export const timestamp = () => new Date().getTime().toString().substring(-3, 10)
export const datetime = () => Mock.mock("@datetime('yyyy-MM-dd HH:mm:ss')")
export const time = () => Mock.mock("@datetime('HH:mm:ss')")
export const date = () => Mock.mock("@datetime('yyyy-MM-dd')")
export const avatar = () => Mock.mock("@image('200x200', 'red', '#fff', 'avatar')")
export const desc = () => Mock.mock('@paragraph')
export const cdesc = () => Mock.mock('@cparagraph(1,1)')
export const ip = () => Mock.mock('@ip')
export const email = () => Mock.mock('@email')
export const integer = () => Mock.mock('@integer(1,100)')
export const boolean = () => Mock.mock('@boolean')
export const url = () => Mock.mock('@url')
export const sentence = () => Mock.mock('@sentence(3, 5)')
export const account = () => Mock.mock(/\d\w{5,10}/)

export const sysModules = {
    // 获取用户组列表
    getSysUserGroupSearchWord: () => ({
        id: id(),
        ugName: title(),
        ugShortName: title(),
        ugCode: code(),
        ugDesc: cdesc(),
        isEnable: boolean(),
        createTime: timestamp(),
    }),
    // 获取某用户组信息
    getSysUserGroup: () => ({
        ugName: title(),
        ugShortName: title(),
        ugDesc: desc(),
        isEnable: boolean(),
        createTime: timestamp(),
    }),
    // 获得用户组关联的用户信息
    getUserByGroupId: () => ({
        id: id(),
        userName: title(),
    }),
    // 获取组织树
    getOrgChildren: () => ({
        nodeId: id(),
        nodeName: title(),
        nodeNumber: integer(),
        nodeType: 'POST',
        isParent: boolean(),
        parentId: id(),
        sort: integer(),
    }),
    // 获取用户信息列表
    queryUser: () => ({
        id: id(),
        orgRefUserId: id(),
        userId: id(),
        userAccount: account(),
        userName: name(),
        orgId: id(),
        orgName: title(),
        deptId: id(),
        deptName: title(),
        createTime: timestamp(),
        isEnable: boolean(),
    }),
    // 搜索组织机构数
    getSearchTree: () => ({
        nodeId: id(),
        nodeName: title(),
        nodeType: "ORG",
        nodeNumber: integer(),
        isParent: true,
        parentId: id(),
        sort: integer(),
        isEnable: boolean(),
    }),
    // 获取用户身份列表
    getIdentity: () => ({
        orgId: id(),
        orgName: title(),
        isMainPost: boolean(),
        createTime: timestamp(),
        deptId: id(),
        deptName: title(),
        postId: id(),
        postName: title(),
        identityFullName: title(),
    }),
    // 获取用户关联角色列表
    getUserRole: () => ({
        id: id(),
        roleName: title(),
        roleTag: title(),
        roleCode: code(),
        roleDesc: cdesc(),
        roleType: title(),
    }),
    // 获取所有角色
    getUserPartRole: () => ({
        id: id(),
        roleName: title(),
    }),
    // 获取用户所属角色的模块资源
    getUserMenu: () => ({
        nodeId: id(),
        nodeName: title(),
        parentId: id(),
    }),
    // 获取用户关联用户组信息
    getUserUserGroup: () => ({
        id: id(),
        ugName: title(),
        ugShortName: title(),
        ugDesc: cdesc(),
        ugCode: code(),
    })
}
export const setupModules = {
    //获取业务应用类别树
    getSysCtlgTree: () => ({
        nodeId: id(),
        nodeName: title(),
        nodeCode: code(),
        nodeServiceNum: integer(),
        createTime: timestamp(),
        createUserName: name(),
        ctlgDesc: desc(),
    }),
    //根据业务应用类别ID查询业务表单
    getBusinessForm: () => ({
        bizFormName: title(),
        bizFormCode: code(),
        bizFormType: 4,
        id: id(),
        formId: id(),
        ctlgId: id(),
        createTime: timestamp(),
        createUserName: name(),
    }),
}
export const formModules = {
    // 获取数据源树
    getDatasourceTree: () => ({
        dsId: id(),
        dsType: title(),
        dsName: title(),
        url: url(),
        dsDynamic: code(),
        username: name(),
        password: id(),
        validatuibQuery: code(),
        isEnable: boolean(),
    }),
    // 获取数据源树Tables
    getDatasourceTreeTables: () => ({
        tableId: id(),
        tableCode: code(),
        tableName: title(),
        tableDesc: desc(),
    }),
    // 获取字段列表
    getDatasourceField: () => ({
        colId: id(),
        colCode: code(),
        colName: name(),
        colType: title(),
        colLength: integer(),
        colDecimalLength: integer(),
        dsDynamic: code(),
        tableId: id(),
        tableCode: code(),
    }),
    // 获取已创建表索引
    getFieldForm: () => ({
        indexesName: title(),
        indexesFields: sentence(),
        dsDynamic: code(),
        tableId: id(),
        tableCode: code(),
    }),
    // 编号规则查询
    getCodeRuleInfo: () => ({
        codeRuleId: id(),
        codeRuleName: title(),
        codeRuleView: code(),
        needCodeRuleIds: id(),
        createTime: timestamp(),
        flowMaxNum: integer(),
        flowReset: title(),
    })
}