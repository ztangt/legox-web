import { useSetState } from 'ahooks'
import { message } from 'antd'
import apis from '@/service'
import _ from 'lodash'
interface State {
  area?: any
  travelexpense?: any
  returnCount?: number
  currentPage?: number
  limit?: number
}
export default () => {
  const [state, setState] = useSetState<State>({
    area: [],
    travelexpense: [],
    returnCount: 0,
    currentPage: 0,
    limit: 10,
  })
  const getIcCity = async (payload: any) => {
    const { data } = await apis.getIcCity(payload, () => {
      getIcCity(payload)
    })
    if (data.code == 200) {
      setState({ area: data.data.list })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  const getTravelexpense = async (payload: any) => {
    const { data } = await apis.getTravelexpense(payload, () => {
      getTravelexpense(payload)
    })
    if (data.code == 200) {
      setState({
        travelexpense: data.data.list,
        returnCount: data.data.returnCount,
        currentPage: data.data.currentPage,
      })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  return {
    ...state,
    setState,
    getIcCity,
    getTravelexpense,
  }
}
