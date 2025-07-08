import { useSetState } from 'ahooks'
import { message } from 'antd'
import apis from '@/service'
import _ from 'lodash'

interface State {
  values?: any
}
export default () => {
  const [state, setState] = useSetState<State>({
    values: {},
  })
  const getFormDataId = async (payload: any, callback: Function) => {
    const { data } = await apis.getFormDataId(payload, () => {
      getFormDataId(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }

  //导入浮动表数据
  const importForm = async (payload: any, callback: Function) => {
    const { data } = await apis.importForm(payload, () => {
      importForm(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //导出浮动表数据
  const exportForm = async (payload: any, callback: Function) => {
    const { data } = await apis.exportForm(payload, () => {
      exportForm(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //exportForm
  //下载导入模板
  const downloadModel = async (payload: any, callback: Function) => {
    const { data } = await apis.downloadModel(payload, () => {
      downloadModel(payload, callback)
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
    importForm,
    exportForm,
    downloadModel,
    getFormDataId,
  }
}
