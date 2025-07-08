export default {
  'GET /sys/role/roles': {
    "code": "200",
    "msg": "reprehenderit commodo enim laborum dolor",
    "data": {
      "returnCount": 20,
      "allPage": 2,
      "currentPage": 2,
      "list": [
        {
          "id": "1",
          "roleName": "aliquip sunt ad dolor dolor",
          "roleTag": "aliquip laborum amet",
          "roleCode": "non adipisicing",
          "roleDesc": "in aliquip Ut occaecat veniam",
          "roleType": "全局角色",
          "orgRoleType": "reprehenderit",
          "isEnable": "1",
          "createTime": "1615448740"
        },
        {
          "id": "2",
          "roleName": "aliquip sunt ad dolor dolo111111r",
          "roleTag": "aliquip laborum amet",
          "roleCode": "non adipisicing",
          "roleDesc": "in aliquip Ut occaecat veniam",
          "roleType": "全局角色",
          "orgRoleType": "reprehenderit",
          "isEnable": "1",
          "createTime": "1615448740"
        }
      ]
    }
  },
  'GET /sys/role/:roleId':{
    "id": "1",
    "roleName": "aliquip sunt ad dolor dolor",
    "roleTag": "aliquip laborum amet",
    "roleCode": "non adipisicing",
    "roleDesc": "in aliquip Ut occaecat veniam",
    "roleType": "全局角色",
    "orgRoleType": "reprehenderit",
    "isEnable": "1",
    "createTime": "1615448740"
  },
  'POST /sys/role':{
    "code":200,
    "msg":''
  },
  'PUT /sys/role':{
    "code":200,
    "msg":''
  },
  'DELETE /sys/role':{
    "code":200,
    "msg":''
  },
  'POST /sys/role/copy':{
    "code": "200",
    "data": {
      "id": "Duis in"
    },
    "msg": "eiusmod nisi"
  },
  'GET sys/role/users':{
    "code": "200",
    "msg": "tempor ad labore",
    "data": [
      {
        "userId": "laboris ",
        "userName": "nulla ex nisi dolore"
      }
    ]
  }
}
