import apis from '@/service'
import { useSetState } from 'ahooks'
import { message } from 'antd'
// //根据类型请求接口
const getActionByType = [
  {
    type: 'USER',
    ids: 'identityIds',
    action: 'getUsersByIds',
    list: 'list',
    idKey: 'orgRefUserId',
    nameKey: 'userName',
  },
  {
    type: 'USERGROUP',
    ids: 'ugIds',
    action: 'getUsergroupByIds',
    list: 'list',
    idKey: 'id',
    nameKey: 'ugName',
  },
  {
    type: 'ORG',
    ids: 'orgIds',
    action: 'getOrgByIds',
    list: 'orgs',
    idKey: 'id',
    nameKey: 'orgName',
  },
  {
    type: 'POST',
    ids: 'postIds',
    action: 'getPostByIds',
    list: 'list',
    idKey: 'id',
    nameKey: 'postName',
  },
  {
    type: 'DEPT',
    ids: 'deptIds',
    action: 'getDeptByIds',
    list: 'depts',
    idKey: 'id',
    nameKey: 'deptName',
  },
  {
    type: 'RULE',
    ids: 'roleIds',
    action: 'getRuleByIds',
    list: 'list',
    idKey: 'id',
    nameKey: 'roleName',
  },
]
interface State {
  selectedNodeId: string
  selectedDataIds: Array<any>
  currentNode: object
  expandedKeys: Array<any>
  treeSearchWord: string
  selectedDatas: Array<any>
  originalData: Array<any>
  selectNodeType: string
  orgKind: string
  treeType: string
}
export default () => {
  const [state, setState] = useSetState<State>({
    selectedNodeId: '',
    selectedDataIds: [],
    currentNode: {},
    expandedKeys: [],
    treeSearchWord: '',
    selectedDatas: [],
    originalData: [],
    selectNodeType: '',
    orgKind: '',
    treeType: '',
  })
  const getQueryUserFn = async (payload: any) => {
    const { data } = await apis.getSearchUserByOrgTree(payload)
    if (data.code == 200) {
      setState({ originalData: data.data.list })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //获取单位角色
  const getUnitRoleFn = async (payload: any) => {
    const { data } = await apis.getUnitRole(payload, () => {
      getUnitRoleFn(payload)
    })
    if (data.code == 200) {
      setState({ originalData: data.data.list })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //获取数据
  const getUgsFn = async (payload: any) => {
    const { data } = await apis.getUgs(payload, () => {
      getUgsFn(payload)
    })
    if (data.code == 200) {
      let list = data.data.list
      for (let i = 0; i < list.length; i++) {
        list[i]['nodeName'] = list[i]['ugName']
        list[i]['nodeId'] = list[i]['id']
      }
      setState({ originalData: list })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  const getSelectedDatasFn = async (payload: any) => {
    let orgUserType = payload.orgUserType
    let curAction = getActionByType.filter((item) => item.type == orgUserType)
    let newPayload = {}
    newPayload[curAction[0].ids] = payload.selectedDataIds.join(',')
    newPayload['start'] = 1
    newPayload['limit'] = 100
    const { data } = await apis[curAction[0].action](newPayload, () => {
      getSelectedDatasFn(payload)
    })
    if (data.code == 200) {
      let selectedDatas = data.data[curAction[0].list]
      selectedDatas.map((item: any) => {
        item.nodeId = item[curAction[0].idKey]
        item.nodeName = item[curAction[0].nameKey]
      })
      setState({
        selectedDatas: selectedDatas,
        selectedDataIds: payload.selectedDataIds,
      })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  return {
    ...state,
    setState,
    getQueryUserFn,
    getUnitRoleFn,
    getUgsFn,
    getSelectedDatasFn,
  }
}
