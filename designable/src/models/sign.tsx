import { useSetState } from 'ahooks'
import { message } from 'antd'
import apis from '@/service'
import _ from 'lodash'
interface State {}
export default () => {
  const [state, setState] = useSetState<State>({})
  //获取常用语列表
  const getPopularList = async (payload: any, callback: Function) => {
    const { data } = await apis.getPopularList(payload, () => {
      getPopularList(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //删除常用语
  const deletePopular = async (payload: any, callback: Function) => {
    const { data } = await apis.deletePopular(payload, () => {
      deletePopular(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //更改常用语顺序
  const changeSort = async (payload: any, callback: Function) => {
    const { data } = await apis.changeSort(payload, () => {
      changeSort(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //添加常用语
  const addPopularList = async (payload: any, callback: Function) => {
    const { data } = await apis.addPopularList(payload, () => {
      addPopularList(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }

  return {
    ...state,
    setState,
    getPopularList,
    deletePopular,
    changeSort,
    addPopularList,
  }
}
