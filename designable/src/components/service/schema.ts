import { Engine } from '@/designable/core'
import {
  transformToSchema,
  transformToTreeNode,
  transformToConfigSchema,
} from '@/designable/transformer/src'
import { message } from 'antd'
import { createBehavior, createResource } from '@/designable/core'
import { Select as FormilySelect } from '@/formily/antd'
import { DnFC } from '@/designable/react'
import { connect, mapProps } from '@formily/react'
import { Select } from '@/designable/antd'
import { TreeTable } from '@/custom/components'
export const saveSchema = (designer: Engine) => {
  localStorage.setItem(
    'formily-schema',
    JSON.stringify(transformToSchema(designer.getCurrentTree()))
  )
  // message.success('Save Success')
}

export const loadInitialSchema = (designer: Engine) => {
  try {
    console.log('3222', localStorage.getItem('formily-schema'))

    designer.setCurrentTree(
      transformToTreeNode(JSON.parse(localStorage.getItem('formily-schema')))
    )
  } catch {}
}
export const getBussionSources = (data: any) => {
  // const data = [
  //   {
  //     title: '业务组件1',
  //     code: 'fetch("/api/sys/role/roles?start=1&limit=10&searchWord=&roleType=ALLROLE", {\n  method: "get",\n  headers: {\n    // TODO   "Bearer " + window.localStorage.getItem("refreshToken")!!!!\n    Authorization:\n      "Bearer " +\n      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXB0TmFtZSI6bnVsbCwib3JnTmFtZSI6bnVsbCwidXNlcl9uYW1lIjoiNjg1NDQ0IiwiZGVwdElkIjpudWxsLCJyb2xlQ29kZXMiOm51bGwsInBvc3RJZCI6bnVsbCwidXNlck5hbWUiOiI2ODU0NDQiLCJ1c2VySWQiOjE0NTc1OTc5MDMxMDIwNDYyMDksInBpY3R1cmUiOiIxIiwib3JnSWQiOm51bGwsImNsaWVudF9pZCI6ImxlZ294IiwiY3VzdG9tVHlwZSI6Mywicm9sZUlkcyI6bnVsbCwib3JnQ29kZSI6bnVsbCwiaWRlbnRpdHlJZCI6bnVsbCwic2NvcGUiOlsiYWxsIl0sInVzZXJBY2NvdW50IjoiNjg1NDQ0IiwicG9zdE5hbWUiOm51bGwsInRlbmFudElkIjoxNDU3NTk3OTAzMTAyMDQ2MjA5LCJwb3N0Q29kZSI6bnVsbCwiZXhwIjoxNjU1Njk1NDA1LCJqdGkiOiIyYTQyOTUzMC0zNTk4LTQzY2MtYmFkYi0wOWI2YTJiOWVjZTIiLCJkZXB0Q29kZSI6bnVsbH0.LeO0dp3jil6DD3FpDxBYSj72NF49-citWu6_qTz-F7WNC-4KtJQtH3Uv4HqqLQCxMaWaw_bQ_l67mUN4XxPYZJPFK901lL7JJwaDH4zsvNsUmTri0TNZhdT4kSzj_bqqvepZb4ZQUGNE35HZz0oUqXmVX6CFJThLlOtp4blJhEQjcW_7ZwR-x2EpfslLqVMayb86X4NTuCr0ZzWJX66tD6xFs4_u2yt_PjXpJQc8OrSUfMNfIyurKs0R2TZvb-OMTFSqb_GR5yla-A19I4cSzo9H8YYebc3oKgZ_8_RAJod-LgBpQq_rRmIwF9O0ROrbwgLlvdlQ0qjfWmuA25eWbA",\n  },\n}).then((response) => {\n  response.json().then((data) => {\n    $form.setFieldState("aabbcc", (state) => {\n      state.value = data.msg\n    })\n    $form.setFieldState("aabbcc", (state) => {\n      state.value = data.msg\n    })\n  })\n})',
  //   },
  //   {
  //     title: '业务组件2',
  //     code: '$props({\n  //表头json\n  columns() {\n    let columns = [\n      {\n        title: "角色名称",\n        dataIndex: "nodeName",\n      },\n      {\n        title: "Age",\n        dataIndex: "nodeCode",\n      },\n      {\n        title: "Address",\n        dataIndex: "address",\n      },\n    ]\n    return columns\n  },\n  //获取数据源\n  getDataSource(start, limit, searchWord) {\n    fetch(`api/sys/org/children?nodeType=ORG&start=1&limit=200`, {\n      method: "get",\n      headers: {\n        // TODO   "Bearer " + window.localStorage.getItem("refreshToken")!!!!\n        Authorization: "Bearer " + window.localStorage.getItem("userToken"),\n      },\n    }).then((response) => {\n      response.json().then((data) => {\n        $self.data = {\n          currentPage: data.data.currentPage,\n          returnCount: data.data.returnCount,\n          data: data.data.list,\n        }\n      })\n    })\n  },\n  //弹框的确认操作\n  onOk(selectedRows) {\n    let value = ""\n    selectedRows.map((item) => {\n      if (!value) {\n        value = item.roleName\n      } else {\n        value = value + "," + item.roleName\n      }\n    })\n    $self.value = value\n  },\n  //展开\n  onExpand(expanded, record,callback) {\n    let childData = []\n    fetch(\n      `api/sys/org/children?nodeId=${record.nodeId}&nodeType=ORG&start=1&limit=200`,\n      {\n        method: "get",\n        headers: {\n          // TODO   "Bearer " + window.localStorage.getItem("refreshToken")!!!!\n          Authorization: "Bearer " + window.localStorage.getItem("userToken"),\n        },\n      }\n    ).then((response) => {\n      response.json().then((data) => {\n\t\tcallback(data.data.list)\n      })\n    })\n  },\n})',
  //   },
  // ]
  let businessSourcesObject = {}
  let businessSources = []
  data.map((item, index) => {
    const Tree1: DnFC<any> = connect(TreeTable, mapProps())
    Tree1.Behavior = createBehavior({
      ...TreeTable.Behavior[0],
      selector: (node) => node.props['x-component'] === `TreeTable`,
      designerLocales: {
        ...TreeTable.Behavior[0].designerLocales,
        // 'zh-CN': {
        //   ...TreeTable.Behavior[0].designerLocales['zh-CN'],
        //   title: item.controlName,
        // },
      }, //语言
    })
    Tree1.Resource = createResource({
      ...TreeTable.Resource[0],
      elements: [
        {
          ...TreeTable.Resource[0].elements[0],
          props: {
            ...TreeTable.Resource[0].elements[0].props,
            title: item.controlName,
            'x-component': `TreeTable`,
            'x-component-props': {
              ...TreeTable.Resource[0].elements[0].props['x-component-props'],
              hiddenColumn: item.hiddenColumn,
            },
            'x-reactions': {
              fulfill: {
                run: item.code,
              },
            },
          },
        },
      ],
      title: item.controlName,
    })
    businessSourcesObject[`TreeTable`] = Tree1
    businessSources.push(Tree1)
  })
  return {
    businessSourcesObject: businessSourcesObject,
    businessSources: businessSources,
  }
}
