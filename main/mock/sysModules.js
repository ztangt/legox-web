import { sysModules, boolean } from './index'
const {
    getSysUserGroupSearchWord,
    getSysUserGroup,
    getUserByGroupId,
    getOrgChildren,
    queryUser,
    getIdentity,
    getSearchTree,
    getUserRole,
    getUserPartRole,
    getUserMenu,
    getUserUserGroup,
} = sysModules

export default {
    //添加用户组
    'POST /sys/usergroup': {
        "code": 200,
        "msg": "添加成功",
    },
    //修改用户组
    'PUT /sys/usergroup': {
        "code": 200,
        "msg": "修改成功",
    },
    //删除用户组(支持批量)
    'DELETE /sys/usergroup': {
        "code": 200,
        "msg": "删除成功",
    },
    //获取用户组列表
    'GET /sys/usergroup/list': {
        "code": 200,
        "msg": "",
        "data": {
            "returnCount": 20,
            "allPage": 2,
            "currentPage": 2,
            "list": [
                getSysUserGroupSearchWord(),
                getSysUserGroupSearchWord(),
                getSysUserGroupSearchWord(),
                getSysUserGroupSearchWord(),
                getSysUserGroupSearchWord(),
                getSysUserGroupSearchWord(),
            ]
        }
    },
    //获取某用户组信息
    'GET /sys/usergroup/:ugId': {
        "code": 200,
        "msg": "",
        "data": getSysUserGroup(),
    },
    //保存用户组关联用户
    'GET /sys/usergroup/saveUsers': {
        "code": 200,
        "msg": "保存成功",
    },
    //获得用户组关联的用户信息
    'GET /sys/usergroup/getUserByGroupId/:userGroupId': {
        "code": 200,
        "msg": "",
        "data": {
            "list": [
                getUserByGroupId(),
                getUserByGroupId(),
                getUserByGroupId(),
            ]
        }
    },
    // 获取组织树
    'GET /sys/org/children': {
        "code": 200,
        "data": {
            "jsonResult": [
                getOrgChildren(),
                getOrgChildren(),
                getOrgChildren(),
                getOrgChildren(),
            ]
        }
    },
    // 获取用户信息列表
    "GET /sys/user/list": {
        "code": 200,
        "msg": '',
        "data": {
            "returnCount": 4,
            "allPage": 2,
            "currentPage": 1,
            "list": [
                queryUser(),
                queryUser(),
                queryUser(),
                queryUser(),
            ]
        }
    },
    // 搜索组织机构数
    "GET /sys/org/tree": {
        "code": 200,
        "msg": '',
        data: {
            jsonResult: [
                {
                    ...getSearchTree(),
                    children: [
                        {
                            ...getSearchTree(),
                            children: null
                        }
                    ]
                },
                {
                    ...getSearchTree(),
                    children: [
                        {
                            ...getSearchTree(),
                            children: null
                        }
                    ]
                },
            ]
        }
    },
    // 获取用户身份列表
    "GET /sys/user/identity": {
        "code": 200,
        "msg": '',
        data: {
            identityFullName: '法院-立案庭-庭长',
            editMainPostMark: '1',
            identitys: [
                getIdentity(),
                getIdentity(),
                getIdentity(),
            ]
        }
    },
    //获取用户关联角色列表
    'GET /sys/user/role': {
        "code": 200,
        "msg": '',
        data: [
            getUserRole(),
            getUserRole(),
            getUserRole(),
        ]
    },
    //新增用户角色
    'POST /sys/user/role': {
        "code": 200,
        "msg": '新增成功',
    },
    //获取所有角色
    'GET /sys/user/role/partrole': {
        "code": 200,
        "msg": '',
        data: [
            getUserPartRole(),
            getUserPartRole(),
            getUserPartRole(),
        ]
    },
    // 获取用户所属角色的模块资源
    'GET /sys/user/menu': {
        "code": 200,
        "msg": '',
        data: [
            {
                ...getUserMenu(),
                children: [
                    {
                        ...getUserMenu(),
                        children: null,
                    }
                ]
            },
            {
                ...getUserMenu(),
                children: [
                    {
                        ...getUserMenu(),
                        children: null,
                    }
                ]
            }
        ]
    },
    // 获取用户关联用户组信息
    'GET /sys/user/usergroup': {
        "code": 200,
        "msg": '',
        data: [
            getUserUserGroup(),
            getUserUserGroup(),
            getUserUserGroup(),
        ]
    },
    // 设置用户关联用户组
    'POST /sys/user/usergroup': {
        "code": 200,
        "msg": '',
    },

    // 取消岗位身份树勾选
    'GET /sys/user/identity/nocheck': {
        "code": 200,
        "msg": '',
        data: {
            checkFlag: boolean(),
        }
    },
    // 用户离岗操作
    'POST /sys/user/identity/leavepost': {
        "code": 200,
        "msg": '',
    },
}