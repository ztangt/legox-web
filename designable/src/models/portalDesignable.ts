import apis from '@/service'
import { useSetState } from 'ahooks'
import { message } from 'antd'
import { getFlatArr } from '../utils/utils'

interface State {
  portalLayoutJson?: any //场景布局json
  sceneSection?: any //场景布局详情
  loading?: any
  registers?: Array<any>
  menus?: Array<any>
  selectKeys?: Array<any>
  workListBack?: Array<any>
  workList?: Array<any>
}
export default () => {
  const [state, setState] = useSetState<State>({
    portalLayoutJson: {},
    sceneSection: {},
    loading: false,
    registers: [],
    menus: [],
    selectKeys: [],
    workListBack: [],
    workList: [],
  })

  // 根据文件md5查询是否存在该文件
  const getFileMD5 = async (payload: any, callback: Function) => {
    const { data } = await apis.getFileMD5(payload, () => {
      getFileMD5(payload, callback)
    })
    if (data.code == 200) {
      callback(data.data, payload)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }

  //获取场景
  const getScene = async (payload: any) => {
    setState({ loading: true })
    const { data } = await apis.getScene(payload, () => {
      getScene(payload)
    })
    if (data.code == 200) {
      setState({
        sceneSection: data.data,
        loading: false,
      })
      getSceneStyleUrl(data.data.sceneStyleUrl)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }

  //修改场景
  const updateScene = async (payload: any, callback: Function) => {
    setState({ loading: true })
    const { data } = await apis.updateScene(payload, () => {
      updateScene(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
      message.success('修改成功')
      setState({ loading: false })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
      setState({ loading: false })
    }
  }

  async function getSceneStyleUrl(url) {
    setState({ loading: true })
    try {
      let response = await (await fetch(url)).json()
      setState({ loading: false })
      setState({ portalLayoutJson: response })
    } catch (error) {
      setState({ loading: false })
      console.log('JSON解析失败:', error)
    }
  }

  //获取登录人可登录系统集合
  const getUserRegister = async (payload: any, callback: Function) => {
    setState({ loading: true })
    const { data } = await apis.getUserRegister(payload, () => {
      getUserRegister(payload, callback)
    })
    if (data.code == 200) {
      setState({
        registers: data.data.registers,
        loading: false,
      })
      callback && callback(data.data.registers)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }

  //获取前台系统
  const getRegister = async (payload: any, callback: Function) => {
    setState({ loading: true })
    const { data } = await apis.getRegister(payload, () => {
      getRegister(payload, callback)
    })
    if (data.code == 200) {
      setState({
        registers: data.data.list,
        loading: false,
      })
      callback && callback(data.data.list)
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
      let allAppList = data.data.menus
      let tmp = allAppList.filter((i) => !i.hideInMenu)
      let moreArr = tmp.filter((i) => !i.children?.length && i.menuLink)
      tmp = allAppList.filter((i) => i.children?.length)
      tmp.forEach((element) => {
        element['children'] = getFlatArr(element.children).filter(
          (i) => i.menuLink
        )
      })
      if (moreArr.length) {
        tmp.push({
          menuId: 'more',
          menuName: '更多',
          children: moreArr,
        })
      }
      setState({
        menus: tmp,
        loading: false,
      })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }

  //获取模块资源列表
  const getMenu = async (payload: any) => {
    setState({ loading: true })
    const { data } = await apis.getMenu(payload, () => {
      getMenu(payload)
    })
    if (data.code == 200) {
      let allAppList = data.data.jsonResult.list
      let tmp = allAppList.filter((i) => !i.hideInMenu)
      let moreArr = tmp.filter((i) => !i.children?.length && i.menuLink)
      tmp = allAppList.filter((i) => i.children?.length)
      tmp.forEach((element) => {
        element['children'] = getFlatArr(element.children).filter(
          (i) => i.menuLink
        )
      })
      if (moreArr.length) {
        tmp.push({
          menuId: 'more',
          menuName: '更多',
          children: moreArr,
        })
      }
      setState({
        menus: tmp,
        loading: false,
      })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }

  //获取场景工作台接口（后端）
  const getWorkListBack = async (payload: any) => {
    setState({ loading: true })
    const { data } = await apis.getWorkListBack(payload, () => {
      getWorkListBack(payload)
    })
    if (data.code == 200) {
      const tmp = data.data.list
      const arr = []
      tmp.forEach((element) => {
        arr.push(element.menuId)
      })
      setState({
        workListBack: data.data.list,
        selectKeys: arr,
        loading: false,
      })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }

  //新增工作台接口(后)
  const addWorkList = async (payload: any, callback: Function) => {
    setState({ loading: true })
    const { data } = await apis.addWorkList(payload, () => {
      addWorkList(payload, callback)
    })
    if (data.code == 200) {
      setState({
        loading: false,
      })
      // message.success(data.msg)
      callback && callback()
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }

  //新增工作台接口(前)
  const addFontWorkList = async (payload: any, callback: Function) => {
    setState({ loading: true })
    const { data } = await apis.addFontWorkList(payload, () => {
      addFontWorkList(payload, callback)
    })
    if (data.code == 200) {
      setState({
        loading: false,
      })
      message.success(data.msg)
      callback && callback()
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
      const tmp = data.data.list
      const arr = []
      tmp.forEach((element) => {
        arr.push(element.menuId)
      })
      setState({
        workList: data.data.list,
        selectKeys: arr,
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
    getScene,
    getSceneStyleUrl,
    updateScene,
    getRegister,
    getUserRegister,
    getMenu,
    getUserMenus,
    addWorkList,
    addFontWorkList,
    getWorkList,
    getWorkListBack,
    getFileMD5,
  }
}
