export default {
    'GET /sys/registers': {
        code: 200,
        data: {
            list: [
                {
                    id: 111111,
                    registerName: "支撑平台",
                },
                {
                    id: 222222,
                    registerName: "业务平台",
                },
                {
                    id: 333333,
                    registerName: "微协同",
                }
            ]
        }
    },
    'GET /sys/menus': {
        code: 200,
        data: {
            jsonResult: {
                list:[
                    {
                        id: 111111,
                        menuName: "组织与权限",
                        sysMenuName: "组织与权限",
                        isEnable:'1',
                        isDataruleCode:'NO',
                        children:[
                            {
                                id: 333333,
                                menuName: "用户中心11",
                                sysMenuName: "用户中心",
                                isEnable:'0',
                                isDataruleCode:'NO',
                                createUserName:'组织与权限',
                                children:[
                                    {
                                        id: 444444,
                                        menuName: "单位信息管理",
                                        sysMenuName: "单位信息管理",
                                        isEnable:'0',
                                        isDataruleCode:'YES',
                                        createUserName:'用户中心'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 222222,
                        menuName: "应用建模",
                        sysMenuName: "应用建模",
                        isEnable:'0',
                        isDataruleCode:'YES',
                    }
                ]
            }
        }
    }
  }