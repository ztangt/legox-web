export default {
    'GET /sys/button': {
        code: 200,
        data: {
            buttons: [
                {
                    buttonId: 111111,
                    buttonDesc: "通用新增",
                    buttonName: "新增",
                    buttonCode:'10000',
                    buttonType:'列表按钮',
                    buttonSource:'系统预制',
                },
                {
                    buttonId: 222222,
                    buttonDesc: "资产新增",
                    buttonName: "修改",
                    buttonCode:'10001',
                    buttonType:'列表按钮',
                    buttonSource:'系统预制',
                },
                {
                    buttonId: 333333,
                    buttonDesc: "修改",
                    buttonName: "删除",
                    buttonCode:'10002',
                    buttonType:'列表按钮',
                    buttonSource:'系统预制',
                }
            ]
        }
    },
    'GET /sys/buttonGroup': {
        code: 200,
        data: {
            list: [
                {
                    groupId: 111111,
                    groupDesc: "dsfs",
                    groupName: "新增",
                    groupCode:'10000',
                    groupTypeName:'列表',
                },
                {
                    groupId: 222222,
                    groupDesc: "dsfsd",
                    groupName: "修改",
                    groupCode:'10001',
                    groupTypeName:'表单',
                },
                {
                    groupId: 333333,
                    groupDesc: "dsfsds",
                    groupName: "删除",
                    groupCode:'10002',
                    groupTypeName:'列表',
                }
            ]
        }
    }
  }