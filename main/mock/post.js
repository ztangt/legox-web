export default {
    "POST /sys/post":{//岗位信息新增
        code: 200
    },
    "PUT /sys/post":{//岗位信息修改
        code: 200
    },
    "GET /sys/post/list":{//根据父单位id查询岗位信息
        "code": 200,
        "data": {
            "returnCount": 20,
            "allPage": 2,
            "currentPage": 1,
            "list": [
                {
                    "postId": 1,
                    "postName": "岗位1",
                    "postNumber": "sdsdfsa",
                    "postNumber": 22221425246,
                    "postShortName": "法机",
                    "postDesc": "安守本分建行卡",
                    "isEnable": 1,
                    "createTime": 1609987896,
                },
                {
                    "postId": 2,
                    "postName": "岗位2",
                    "postNumber": "sdsdfsa",
                    "postShortName": "法机",
                    "postDesc": "安守本分建行卡",
                    "isEnable": 0,
                    "createTime": 1609987896
                }
            ]
        }
    },
    "DELETE /sys/post":{//删除岗位信息
        code: 200
    },

  }