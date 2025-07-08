export default {
    "GET /sys/dataRule":{//获取数据规则列表
        "code": "200",
        "msg": "Duis sed cupidatat",
        "data": {
            "returnCount": 10,
            "allPage": 95204292,
            "currentPage": 1,
            "list": [
            {
                "dataRuleId": "1111111111",
                "dataRuleName": "fugiat non enim",
                "dataRuleShort": "esse",
                "dataRuleCode": "1003",
                "dataRuleType": "1",
                "dataRuleDesc": "anim ut non",
                "createTime": 5887296,
                "dataRuleWeight": 1
            },
            {
                "dataRuleId": "222222",
                "dataRuleName": "quis id tempor",
                "dataRuleShort": "anim culpa magna",
                "dataRuleCode": "1002",
                "dataRuleType": "2",
                "dataRuleDesc": "laborum ad pariatur",
                "createTime": 58872965,
                "dataRuleWeight": 88505725.9475761
            },
            {
                "dataRuleId": "3333333",
                "dataRuleName": "magna sint ea",
                "dataRuleShort": "aliqua consectetur dolor",
                "dataRuleCode": "1001",
                "dataRuleType": "3",
                "dataRuleDesc": "consequat anim",
                "createTime": 20509642,
                "dataRuleWeight": 89499474.22951424
            }
            ]
        }
    },
    "POST /sys/dataRule":{//新增数据规则
        code: 200
    },
    "PUT /sys/dataRule":{//新增数据规则
        code: 200
    },
    "DELETE /sys/dataRule":{//删除数据规则
        code: 200
    },
    "GET /sys/dataRule/:dataRuleId":{//获取数据规则详情
        "data": {
          "dataRuleTypeId": "111111",
          "dataRuleType": "2",
          "sysId": "1",
          "sysName": "",
          "menuId": "amet qui cup",
          "menuName": "deserunt consequat sed",
          "dbTableName": "dolore ad",
          "searchJson": "dolore aliquip fugiat",
          "sqlData": "",
          "execSql": "in "
        },
        "code": "200"
    },
    "PUT sys/dataRule/info":{//数据规则定义
        code: 200
    },
    "DELETE /sys/org":{//删除部门信息
        code: 200
    },
    "GET /sys/table/sqlTest":{//获取sql测试结果
        "code": "200",
        "msg": "Duis ullamco in",
        "data": {
          "execResult": false
        }
    },
    "GET /sys/table/columns":{//获取表列信息
        "code": "200",
        "msg": "Lorem ex dolore reprehenderit in",
        "data": {
          "columns": [
            {
              "tableColumn": "aliqua",
              "tableColumnName": "aliqua",
              "tableColumnType": "int"
            },
            {
              "tableColumn": "elit",
              "tableColumnName": "minim ad",
              "tableColumnType": "tinyint"
            },
            {
              "tableColumn": "veniam",
              "tableColumnName": "consectetu",
              "tableColumnType": "int"
            },
            {
              "tableColumn": "esse",
              "tableColumnName": "cupidatat et nisi ea velit",
              "tableColumnType": "float"
            }
          ]
        }
      },
"GET /sys/registers":{//获取注册系统列表
    "code": "200",
    "msg": "cillum qui commodo quis",
    "data": {
      "returnCount": -3696019,
      "allPage": 10,
      "currentPage": 1,
      "list": [
        {
          "id": "1",
          "registerDesc": "exercitation ve",
          "registerCode": "nisi",
          "registerFlag": "consequat Lorem do",
          "registerName": "系统一",
          "dr": "voluptate culpa",
          "createTime": 1615444389000,
          "registerAtt": "labore dolore incididunt esse amet",
          "registerTag": "sint nulla eu"
        },
        {
          "id": "labore",
          "registerDesc": "2",
          "registerCode": "dolore ",
          "registerFlag": "ut adipisicing officia dolore",
          "registerName": "系统二",
          "dr": "mollit",
          "createTime": 1615444389000,
          "registerAtt": "ullamco culpa Duis proident enim",
          "registerTag": "consequat pariatur cillum quis"
        },
        {
          "id": "3",
          "registerDesc": "officia aliquip esse elit ad",
          "registerCode": "ex ut mollit esse nisi",
          "registerFlag": "aliquip Ut nulla adipisicing minim",
          "registerName": "系统三",
          "dr": "commodo occaecat qui",
          "createTime": 1615444389000,
          "registerAtt": "velit esse",
          "registerTag": "fugiat exercitation amet"
        },
        {
          "id": "4",
          "registerDesc": "cillum sed incididunt commodo Lorem",
          "registerCode": "est et sunt voluptate Duis",
          "registerFlag": "veniam",
          "registerName": "系统四",
          "dr": "ex est culpa voluptate exercitation",
          "createTime": 1615444389000,
          "registerAtt": "sint",
          "registerTag": "non molli"
        },
        {
          "id": "5",
          "registerDesc": "laborum in est",
          "registerCode": "sit dolor",
          "registerFlag": "reprehenderit irure",
          "registerName": "系统五",
          "dr": "u",
          "createTime": 1615444389000,
          "registerAtt": "in amet in",
          "registerTag": "ullamco iru"
        }
      ]
    }
  }



  }