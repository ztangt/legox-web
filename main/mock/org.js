export default {
    'GET /sys/org/children': {
        code: 200,
        data: {
            jsonResult: [
                {
                    nodeId: 25,
                    nodeName: "最高法1",
                    nodeType: "ORG",
                    isParent: 1,
                    children: [
                        {
                            nodeId: 253,
                            nodeName: "法厅机关weqq",
                            nodeType: "DEPT",
                            isParent: 1,
                            
                        }
                    ]

                }
            ]
        }
    },
    "GET /sys/org/tree": {//搜索组织机构数
        code: 200,
        data: {
            jsonResult: [
                {
                    nodeId: 23,
                    nodeName: "最高法1",
                    nodeType: "ORG",
                    isParent: 1,
                    children: [
                        {
                            nodeId: 2,
                            nodeName: "法厅机关",
                            nodeType: "ORG",
                            isParent: 1,
                            children: [
                                {
                                    nodeId: 3,
                                    nodeName: "检察院",
                                    nodeType: "ORG",
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    "POST /sys/org":{//单位信息新增
        code: 200
    },
    "PUT /sys/org":{//单位信息修改
        code: 200
    },
    "GET /sys/org/list":{//根据父单位id查询单位信息
        "code": 200,
        "data": {
            "returnCount": 20,
            "allPage": 2,
            "currentPage": 1,
            "list": [
                {
                    "orgId": 1,
                    "orgName": "法院机关33",
                    "orgCode": "sdsdfsa",
                    "orgNumber": 22221425246,
                    "orgShortName": "法机",
                    "orgDesc": "安守本分建行卡",
                    "isEnable": 1,
                    "createTime": 1609987896
                },
                {
                    "orgId": 2,
                    "orgName": "法院机关",
                    "orgCode": "sdsdfsa",
                    "orgNumber": 22221425246,
                    "orgShortName": "法机",
                    "orgDesc": "安守本分建行卡",
                    "isEnable": 0,
                    "createTime": 1609987896
                }
            ]
        }
    },
    "DELETE /sys/org":{//删除单位信息
        code: 200
    },

  }