import apis from '@/service'
import { useSetState } from 'ahooks'
import { message } from 'antd'
import _ from 'lodash'

interface State {
  treeData: Array<any>
  expandedKeys: Array<any>
  treeSearchWord: string
  currentNode: any
  expandId: string
  postList: Array<any>
}
const loop = (
  array: Array<any>,
  children: Array<any>,
  org?: any,
  nodeIds?: string,
  postList?: any,
  searchWord?: string
) => {
  for (var i = 0; i < array.length; i++) {
    // array[i]['title'] = `${NODE_TYPE[array[i]['nodeType']]}-${array[i]['nodeName']}`
    array[i]['title'] = `${array[i]['nodeName']}`
    array[i]['key'] = array[i]['nodeId']
    array[i]['value'] = array[i]['nodeId']
    if (nodeIds && nodeIds == array[i]['nodeId']) {
      //赋值一个父节点的name和一个父节点的类型
      children.map((itemChild) => {
        itemChild['parentName'] = `${array[i]['nodeName']}`
        itemChild['parentType'] = array[i]['nodeType']
      })
      // array[i]['children'] = children
      array[i]['children'] = _.concat(children, postList)
    }

    if (org && array[i]['nodeType'] == 'DEPT') {
      //如果是部门取父级单位
      array[i]['orgName'] = org.nodeName
      array[i]['orgId'] = org.nodeId
      // array[i]['icon'] = <ApartmentOutlined />
    } else {
      // array[i]['icon'] = <BankOutlined />
    }

    if (array[i].children && array[i].children.length != 0) {
      loop(
        array[i].children,
        children,
        array[i].nodeType == 'ORG' ? array[i] : org,
        nodeIds,
        postList,
        searchWord
      )
    } else {
      if (array[i].isParent == 1 && !searchWord) {
        // if(payload.type =='ORGS'){
        //   array[i]['isLeaf'] = true
        // }else{
        array[i]['children'] = [{ key: '-1' }]
        // }
      } else {
        array[i]['isLeaf'] = true
      }
    }
  }
  return array
}
export default () => {
  const [state, setState] = useSetState<State>({
    treeData: [],
    expandedKeys: [],
    treeSearchWord: '',
    currentNode: {},
    expandId: '',
    postList: [],
  })
  //获取单位树
  const getOrgChildrenFn = async (
    payload: any,
    treeData?: any,
    postList?: any
  ) => {
    const { data } = await apis.getOrgChildren(payload, () => {
      getOrgChildrenFn(payload, treeData, postList)
    })
    if (data.code == 200) {
      let sourceTree = treeData
        ? Array.from(new Set(treeData))
        : Array.from(new Set(state.treeData))
      // let sourcePostList = postList ? postList : state.postList
      console.log('sourceTree111=', sourceTree)
      let newList = data.data.list
      if (newList.length != 0) {
        if (sourceTree && sourceTree.length == 0) {
          console.log('newList111==', newList)
          sourceTree = loop(
            newList,
            [],
            '',
            payload.orgIds,
            [],
            payload.searchWord
          )
        } else {
          console.log('newList22222==', newList)
          sourceTree = loop(
            sourceTree,
            newList,
            '',
            payload.orgIds,
            [],
            payload.searchWord
          )
        }
      } else {
        sourceTree = []
        // if(payload.searchWord){
        //   sourceTree = [];
        // }else{
        //   if ((sourceTree && sourceTree.length == 0) || !payload.orgIds) {
        //     console.log('newList44444==', newList)
        //     sourceTree = _.concat(data.data.list, sourcePostList)
        //   }
        //   sourceTree = loop(
        //     sourceTree,
        //     newList,
        //     '',
        //     payload.orgIds,
        //     sourcePostList,
        //     payload.searchWord
        //   )
        // }
      }
      console.log('sourceTree=', sourceTree)
      setState({ treeData: sourceTree })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //搜索树
  const getSearchTreeFn = async (payload: any) => {
    const { data } = await apis.getNewSearchTree(payload)
    if (data.code == 200) {
      let sourceTree = []
      if (data.data?.list?.length) {
        sourceTree = loop(data.data.list, [], '', '', [], payload.searchWord)
      }
      setState({ treeData: sourceTree, expandedKeys: [] })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg, 5)
    }
  }
  // const getPostsFn = async (props: any) => {
  //   let node = props.node
  //   let nodeType = props.nodeType
  //   // delete props.node
  //   // delete props.nodeType
  //   let tmpProps = {
  //     searchWord: props.searchWord,
  //     orgId: '1557620574870659074',
  //     deptId: '1557620574870659074',
  //     start: 1,
  //     limit: 10,
  //     requireOrgPost: 'NO'
  //   }
  //   const { data } = await apis.getPosts(tmpProps, () => {
  //     getPostsFn(props)
  //   })
  //   if (data.code == 200) {
  //     for (let i = 0; i < data.data.list.length; i++) {
  //       data.data.list[i]['title'] = data.data.list[i]['postName']
  //       data.data.list[i]['key'] = data.data.list[i]['id']
  //       data.data.list[i]['value'] = data.data.list[i]['id']
  //       data.data.list[i]['nodeName'] = data.data.list[i]['postName']
  //       data.data.list[i]['nodeId'] = data.data.list[i]['id']
  //       data.data.list[i]['nodeType'] = 'POST'
  //     }
  //     setState({ postList: data.data.list })
  //     getOrgChildrenFn({
  //       nodeIds: node.key,
  //       treeType: props.treeType,
  //       type: props.type,
  //       child: 1,
  //     })
  //   } else if (data.code != 401 && data.code != 419 && data.code != 403) {
  //     message.error(data.msg)
  //   }
  // }
  return {
    ...state,
    setState,
    getOrgChildrenFn,
    getSearchTreeFn,
    //getPostsFn,
  }
}
