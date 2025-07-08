import {formModules} from './index'
const {
    getDatasourceTree,
    getDatasourceTreeTables,
    getDatasourceField,
    getFieldForm
} = formModules
export default {
    "GET /form/form/versions": {//获取表单版本列表
        "code": 200,
        "msg": "''",
        "data": {
            "returnCount": 10,
            "currentPage": 1,
            "allPage": 2,
            "list": [
                {
                    "deployFormId": 1,
                    "formName": "表单1",
                    "formCode": 112,
                    "bussinessType": "一诺那个",
                    "version": 1,
                    "isDeploy": 0,
                    "createUserName": "zh",
                    "createTime": 1611822644
                },
                {
                    "deployFormId": 2,
                    "formName": "表单1",
                    "formCode": 112,
                    "bussinessType": "一诺那个",
                    "version": 1,
                    "isDeploy": 0,
                    "createUserName": "zh",
                    "createTime": 1611822644
                }
            ]
        }
    },
    "GET /form/forms": {//获取表单列表
        "code": 200,
        "msg": "''",
        "data": {
            "returnCount": 10,
            "currentPage": 1,
            "allPage": 2,
            "list": [
                {
                    "formId": 1,
                    "formName": "表单1",
                    "formCode": 112,
                    "ctlgName": "一诺那个",
                    "mainVersion": 1,
                    "isDeploy": 0,
                    "createUserName": "zh",
                    "createTime": 1611822644
                },
                {
                    "formId": 2,
                    "formName": "表单1",
                    "formCode": 112,
                    "ctlgName": "一诺那个",
                    "mainVersion": 1,
                    "isDeploy": 0,
                    "createUserName": "zh",
                    "createTime": 1611822644
                }
            ]
        }

    },
    "DELETE /form/form": {//删除岗位信息
        code: 200
    },


    // 获取数据源树
    'GET /form/datasource/tree': {
        "code": 200,
        "msg": "''",
        "data": [
            {
                ...getDatasourceTree(),
                tables: [
                    { ...getDatasourceTreeTables() },
                    { ...getDatasourceTreeTables() },
                    { ...getDatasourceTreeTables() },
                ]
            },
            {
                ...getDatasourceTree(),
                tables: [
                    { ...getDatasourceTreeTables() },
                    { ...getDatasourceTreeTables() },
                    { ...getDatasourceTreeTables() },
                ]
            },
            {
                ...getDatasourceTree(),
                tables: [
                    { ...getDatasourceTreeTables() },
                    { ...getDatasourceTreeTables() },
                    { ...getDatasourceTreeTables() },
                ]
            },
        ]
    },
    // 获取字段列表
    'GET /form/datasource/field': {
        "code": 200,
        "msg": "''",
        "data": {
            returnCount: 1,
            allPage: 1,
            currentPage: 1,
            list: [
                {
                    ...getDatasourceField(),
                },
                {
                    ...getDatasourceField(),
                },
                {
                    ...getDatasourceField(),
                },
                {
                    ...getDatasourceField(),
                },
            ],
        }
    },
    // 根据Id获取字段回显;
    'GET /form/datasource/table/field/:colId': {
        "code": 200,
        "msg": "''",
        'data': {
            ...getDatasourceField(),
        }
    },
    // 获取已创建表索引
    'GET /form/datasource/table/indexes/:tableId': {
        "code": 200,
        "msg": "''",
        'data': {
            list: [
                {
                    ...getFieldForm(),
                },
                {
                    ...getFieldForm(),
                },
                {
                    ...getFieldForm(),
                }
            ]
        }
    },
    // 导入
    'POST /form/datasource/table/import': {
        "code": 200,
    }

}