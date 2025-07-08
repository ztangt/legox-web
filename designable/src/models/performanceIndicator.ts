import apis from '@/service'
import { useSetState } from 'ahooks'
import { message } from 'antd'

interface State {
  dataSource?: Array<any>
  treeDataSource?: Array<any>
  expandedRowKeys?: Array<any>
  selectedRowKeys?: Array<any>
  selectedRowData?: Array<any>
  performanceInfo?: any
}
export default () => {
  const [state, setState] = useSetState<State>({
    dataSource: [],
    treeDataSource: [],
    expandedRowKeys: [],
    selectedRowKeys: [],
    selectedRowData: [],
    performanceInfo: {},
  })
  //查询表单绑定的绩效指标信息
  const getPerfromanceList = async (payload: any) => {
    const { data } = await apis.getPerfromanceList(payload)
    if (data.code == 200) {
      setState({
        dataSource: data.data.list,
      })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //查询绩效指标树
  const getPerformanceTree = async (payload: any, callback: Function) => {
    const { data } = await apis.getPerformanceTree(payload)
    if (data.code == 200) {
      //需要将IS_PARENT转换成isParent才能用公用的方法
      data.data.list.map((item: any) => {
        item.isParent = item.IS_PARENT
        item['performanceCode'] = item.PERFORMANCE_CODE //增加一行performanceCode，不用一会小写一会大写混淆
        item['id'] = item.ID //增加一行performanceCode，不用一会小写一会大写混淆
      })
      callback && callback(data.data.list)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  const getPerformanceInfo = async (payload: any) => {
    const { data } = await apis.getPerformanceInfo(payload)
    if (data.code == 200) {
      setState({
        performanceInfo: data.data,
      })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  return {
    ...state,
    setState,
    getPerfromanceList,
    getPerformanceTree,
    getPerformanceInfo,
  }
}
