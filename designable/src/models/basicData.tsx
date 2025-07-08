import { useSetState } from 'ahooks'
import { message } from 'antd'
import apis from '@/service'
import _ from 'lodash'
export default () => {
  //获取表单样式
  const getDictType = async (payload: any, callback: any) => {
    payload.searchWord = ''
    payload.isTree = '1'
    const { data } = await apis.getDictType(payload, () => {
      getDictType(payload, callback)
    })
    if (data.code == 200) {
      callback(data.data.list)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  const getDictTypeList = async (payload: any, callback: any) => {
    payload.isTree = '0'
    payload.searchWord = ''
    const { data } = await apis.getDictType(payload, () => {
      getDictType(payload, callback)
    })
    if (data.code == 200) {
      callback(data.data.list)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  const getALLDictTypeList = async (payload: any, callback: any) => {
    const { data } = await apis.getALLDictTypeList(payload, () => {
      getALLDictTypeList(payload, callback)
    })
    if (data.code == 200) {
      callback(data.data.list)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  // sys/dictInfo/list
  return {
    getDictType,
    getDictTypeList,
    getALLDictTypeList,
  }
}
