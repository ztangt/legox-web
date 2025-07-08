import apis from '@/service'
import { useSetState } from 'ahooks'
import { message } from 'antd'
interface State {
  loading?: any
  fontFlag?: any //前台JSON
  configFlag?: any //默认JSON
  sceneLayoutJson?: any //场景布局json
  sceneLayout?: any //场景布局详情
  noticeList?: Array<any> //通告列表
  todoList?: Array<any> //待办全列表
  appList?: Array<any> //最近应用列表
  workList?: Array<any> //工作台列表
  menus?: Array<any> //菜单列表
  sceneDefaultLayoutJson?: any //默认场景布局json
  registers?: Array<any>
}
export default () => {
  const [state, setState] = useSetState<State>({
    loading: false,
    fontFlag: false, //前台JSON
    configFlag: false, //默认JSON
    sceneLayoutJson: {},
    sceneLayout: {},
    noticeList: [],
    todoList: [],
    appList: [],
    workList: [],
    menus: [],
    sceneDefaultLayoutJson: {},
    registers: [],
  })
  //获取场景
  const getSceneLayout = async (payload: any) => {
    setState({ loading: true })
    const { data } = await apis.getSceneLayout(payload, () => {
      getSceneLayout(payload)
    })
    if (data.code == 200) {
      setState({
        sceneLayout: data.data,
        loading: false,
      })

      if (!localStorage.getItem('postId')) {
        // 没有岗位ID的话 按路径规则去取minio的数据
        const noPostIdUrl = `${localStorage.getItem(
          'minioUrl'
        )}/scene/${localStorage.getItem('tenantId')}/${localStorage.getItem(
          'identityId'
        )}/front/scenelayout.json`
        getSceneStyleUrl(noPostIdUrl, 'sceneLayoutJson', 'fontFlag')
        data.data.sceneStyleUrl &&
          getSceneStyleUrl(
            data.data.sceneStyleUrl,
            'sceneDefaultLayoutJson',
            'configFlag'
          )
      } else {
        data.data.frontStyleUrl &&
          getSceneStyleUrl(
            data.data.frontStyleUrl,
            'sceneLayoutJson',
            'fontFlag'
          )
        data.data.sceneStyleUrl &&
          getSceneStyleUrl(
            data.data.sceneStyleUrl,
            'sceneDefaultLayoutJson',
            'configFlag'
          )
      }
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }

  async function getSceneStyleUrl(url, name, flag) {
    setState({ loading: true })
    try {
      let response = await (await fetch(url)).json()
      setState({ loading: false })
      setState({ [name]: response })
      setState({ [flag]: true })
    } catch (error) {
      setState({ [name]: {} })
      console.log('JSON解析失败:', error)
      setState({ loading: false })
    }
  }

  //查看通知公告列表
  const getNoticeViewList = async (payload: any) => {
    setState({ loading: true })
    const { data } = await apis.getNoticeViewList(payload, () => {
      getNoticeViewList(payload)
    })
    if (data.code == 200) {
      setState({
        noticeList: data.data.list,
        loading: false,
      })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }

  //获取代办事项接口
  const getTodoList = async (payload: any, callback?: Function) => {
    setState({ loading: true })
    const { data } = await apis.getTodoList(payload, () => {
      getTodoList(payload, callback)
    })
    if (data.code == 200) {
      // 传了isFrist 设置count
      if (payload.isFrist) {
        callback && callback(data.data.returnCount)
      }
      // isFrist=1（全部）和没传isFrist的时候设置todoList 仅这一次
      if (payload.isFrist === 1 || !payload.isFrist) {
        setState({
          todoList: data.data.list,
          loading: false,
        })
      } else {
        setState({ loading: false })
      }
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }

  //获取最近应用
  const getAppList = async (payload: any) => {
    setState({ loading: true })
    const { data } = await apis.getAppList(payload, () => {
      getAppList(payload)
    })
    if (data.code == 200) {
      setState({
        appList: data.data.list.slice(0, 20),
        loading: false,
      })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }

  //获取场景工作台接口（前）
  const getWorkList = async (payload: any) => {
    setState({ loading: true })
    const { data } = await apis.getWorkList(payload, () => {
      getWorkList(payload)
    })
    if (data.code == 200) {
      setState({
        workList: data.data.list,
        loading: false,
      })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }

  const getUserMenus = async (payload: any) => {
    setState({ loading: true })
    const { data } = await apis.getUserMenus(payload, () => {
      getUserMenus(payload)
    })
    if (data.code == 200) {
      setState({
        menus: data.data.menus,
        loading: false,
      })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }

  //获取登录人可登录系统集合
  const getUserRegister = async (payload: any, callback: Function) => {
    setState({ loading: true })
    const { data } = await apis.getUserRegister(payload, () => {
      getUserRegister(payload, callback)
    })
    if (data.code == 200) {
      const obj = {
        registerId: '',
        registerName: '全部',
        registerCode: '',
      }
      const arr = data.data.registers
      arr.unshift(obj)
      setState({
        // registers: arr,
        loading: false,
      })
      callback && callback(arr)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }

  const updateSceneLayout = async (payload: any) => {
    setState({ loading: true })
    const { data } = await apis.updateSceneLayout(payload, () => {
      updateSceneLayout(payload)
    })
    if (data.code == 200) {
      setState({
        loading: false,
      })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }

  return {
    ...state,
    setState,
    getUserRegister,
    getSceneLayout,
    getSceneStyleUrl,
    getNoticeViewList,
    getTodoList,
    getAppList,
    getWorkList,
    getUserMenus,
    updateSceneLayout,
  }
}
