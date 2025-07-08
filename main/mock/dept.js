export default {
    "POST /sys/dept":{//部门信息新增
        code: 200
    },
    "PUT /sys/dept":{//部门信息修改
        code: 200
    },
    "GET /sys/dept/list":{//根据父单位id查询部门信息
        "code": 200,
        "data": {
            "returnCount": 20,
            "allPage": 2,
            "currentPage": 1,
            "list": [
                {
                    "deptId": 1,
                    "deptName": "法院机关33",
                    "deptCode": "sdsdfsa",
                    "deptNumber": 22221425246,
                    "deptShortName": "法机",
                    "deptDesc": "安守本分建行卡",
                    "isEnable": 1,
                    "createTime": 1609987896,
                    "children":  [
                        {
                            "deptId": 11,
                            "deptName": "法院机关33",
                            "deptCode": "sdsdfsa",
                            "deptNumber": 22221425246,
                            "deptShortName": "法机",
                            "deptDesc": "安守本分建行卡",
                            "isEnable": 1,
                            "createTime": 1609987896,
                        },
                        {
                            "deptId": 12,
                            "deptName": "法院机关",
                            "deptCode": "sdsdfsa",
                            "deptShortName": "法机",
                            "deptDesc": "安守本分建行卡",
                            "isEnable": 0,
                            "createTime": 1609987896
                        }
                    ]
                },
                {
                    "deptId": 2,
                    "deptName": "法院机关",
                    "deptCode": "sdsdfsa",
                    "deptShortName": "法机",
                    "deptDesc": "安守本分建行卡",
                    "isEnable": 0,
                    "createTime": 1609987896
                },
                {
                    "deptId": 3,
                    "deptName": "法院机关33",
                    "deptCode": "sdsdfsa",
                    "deptNumber": 22221425246,
                    "deptShortName": "法机",
                    "deptDesc": "安守本分建行卡",
                    "isEnable": 1,
                    "createTime": 1609987896,
                    "children":  [
                        {
                            "deptId": 31,
                            "deptName": "法院机关33",
                            "deptCode": "sdsdfsa",
                            "deptNumber": 22221425246,
                            "deptShortName": "法机",
                            "deptDesc": "安守本分建行卡",
                            "isEnable": 1,
                            "createTime": 1609987896,
                        },
                        {
                            "deptId": 32,
                            "deptName": "法院机关",
                            "deptCode": "sdsdfsa",
                            "deptShortName": "法机",
                            "deptDesc": "安守本分建行卡",
                            "isEnable": 0,
                            "createTime": 1609987896
                        }
                    ]
                },
                {
                    "deptId": 4,
                    "deptName": "法院机关33",
                    "deptCode": "sdsdfsa",
                    "deptNumber": 22221425246,
                    "deptShortName": "法机",
                    "deptDesc": "安守本分建行卡",
                    "isEnable": 1,
                    "createTime": 1609987896,
                    "children":  [
                        {
                            "deptId": 41,
                            "deptName": "法院机关33",
                            "deptCode": "sdsdfsa",
                            "deptNumber": 22221425246,
                            "deptShortName": "法机",
                            "deptDesc": "安守本分建行卡",
                            "isEnable": 1,
                            "createTime": 1609987896,
                        },
                        {
                            "deptId": 42,
                            "deptName": "法院机关",
                            "deptCode": "sdsdfsa",
                            "deptShortName": "法机",
                            "deptDesc": "安守本分建行卡",
                            "isEnable": 0,
                            "createTime": 1609987896
                        }
                    ]
                }
            ]
        }
    },
    "DELETE /sys/org":{//删除部门信息
        code: 200
    },

  }