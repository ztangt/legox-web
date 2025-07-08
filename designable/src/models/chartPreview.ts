import apis from '@/service'
import { useSetState } from 'ahooks'
import { message } from 'antd'
interface State {
  loading?: any
  sceneLayoutJson?: any //场景布局json
}
export default () => {
  const [state, setState] = useSetState<State>({
    loading: false,
    sceneLayoutJson: {},
  })
  //查询可进行上传的minioUrl
  const getChartMinioUrl = async (payload: any, callback?: Function) => {
    setState({ loading: true })
    const { data } = await apis.getChartMinioUrl(payload, () => {
      getChartMinioUrl(payload, callback)
    })
    if (data.code == 200) {
      setState({
        loading: false,
      })
      callback && callback(data?.data?.minioUrl)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }
  //获取场景
  const getChartBean = async (payload: any) => {
    setState({ loading: true })
    const { data } = await apis.getChartBean(payload, () => {
      getChartBean(payload)
    })
    if (data.code == 200) {
      setState({
        loading: false,
      })
      data.data.chart.minioUrl &&
        getSceneStyleUrl(data.data.chart.minioUrl, 'sceneLayoutJson')
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }

  async function getSceneStyleUrl(url, name) {
    setState({ loading: true })
    try {
      let response = await (await fetch(url)).json()
      setState({ loading: false })
      setState({ [name]: response })
    } catch (error) {
      setState({ [name]: {} })
      console.log('JSON解析失败:', error)
      setState({ loading: false })
    }
  }

  return {
    ...state,
    setState,
    getChartBean,
    getSceneStyleUrl,
    getChartMinioUrl,
  }
}
