import { useSetState } from 'ahooks'
import { message } from 'antd'
import apis from '@/service'
import _ from 'lodash'
import { getParam } from '../utils/index'

interface State {
  operationTable?: Array<any>
  fieldData?: Array<any>
  operationList?: Array<any>
  values?: Object
  mainTableCode?: String
}
export default () => {
  const [state, setState] = useSetState<State>({
    operationTable: [], //运算表
    fieldData: [],
    values: {},
    mainTableCode: '',
  })

  //获取表单关联数据建模列数据
  const getTableColumnsFn = async (payload: any, callback?: Function) => {
    const { data } = await apis.getTableColumns(payload, () => {
      getTableColumnsFn(payload, callback)
    })
    if (data.code == 200) {
      if (data.data.columnList && data.data.columnList.length) {
        // 获取到所有字段 根据表id组合各字段
        const fieldData = []
        const list = data.data.columnList
        let map = new Map()
        list.forEach((item) => {
          map.set(item.formId, item)
        })
        const resultData = [...map.values()]
        resultData.forEach((el) => {
          fieldData.push({
            id: el.formId,
            code: el.formCode,
            name: el.formName,
            children: [],
          })
        })
        for (let i = 0; i < list.length; i++) {
          if (list[i].tableScope === 'MAIN') {
            setState({ mainTableCode: list[i].formCode })
            break
          }
        }
        for (let i = 0; i < fieldData.length; i++) {
          for (let j = 0; j < list.length; j++) {
            if (fieldData[i].id === list[j].formId) {
              fieldData[i].children.push({
                id: list[j].formColumnId,
                code: list[j].formColumnCode,
                name: list[j].formColumnName,
              })
            }
          }
        }
        setState({ fieldData })
        callback && callback(data)
      }
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }

  //表单运算保存
  const saveOperation = async (payload: any, callback: Function) => {
    const { data } = await apis.saveOperation(payload, () => {
      saveOperation(payload, callback)
    })
    if (data.code == 200) {
      message.success('保存成功')
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }

  //表单运算查询
  const getOperation = async (payload: any, callback?: Function) => {
    const { data } = await apis.getOperation(payload, () => {
      getOperation(payload, callback)
    })
    if (data.code == 200) {
      const tmp = data.data.operationList || []
      // + index
      for (let i = 0; i < tmp.length; i++) {
        tmp[i]['index'] = i
      }
      setState({ operationList: tmp })
      callback && callback(tmp)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      // TODO 临时
      setState({ operationList: [] })
      message.error(data.msg)
    }
  }

  return {
    ...state,
    setState,
    getTableColumnsFn,
    saveOperation,
    getOperation,
  }
}
