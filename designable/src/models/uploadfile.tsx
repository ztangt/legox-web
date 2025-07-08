import { useSetState } from 'ahooks'
import { message } from 'antd'
import apis from '@/service'
import _ from 'lodash'

export default () => {
  // 根据文件md5查询是否存在该文件
  const getFileMD5 = async (
    payload: any,
    callback: Function,
    nextState: any
  ) => {
    const { data } = await apis.getFileMD5(payload, () => {
      getFileMD5(payload, callback, nextState)
    })
    if (data.code == 200) {
      callback(data.data, payload, nextState)
    } else if (data.code != 401) {
      message.error(data.msg)
    }
  }
  //文件预上传
  const presignedUploadUrl = async (
    payload: any,
    callback: Function,
    nextState: any
  ) => {
    const { data } = await apis.presignedUploadUrl(payload)
    if (data.code == 200) {
      callback(data.data, payload?.file, nextState)
    } else if (data.code != 401) {
      message.error(data.msg)
    }
  }

  // 根据文件路径合并文件
  const getFileMerage = async (
    payload: any,
    callback: Function,
    nextState: any
  ) => {
    const { data } = await apis.getFileMerage(payload)
    if (data.code == 200) {
      callback(data.data, nextState)
    } else if (data.code != 401) {
      message.error(data.msg)
    }
  }
  //存储文件信息到数据库接口
  const storingFileInformation = async (
    payload: any,
    callback: Function,
    nextState: any
  ) => {
    const { data } = await apis.storingFileInformation(payload)
    if (data.code == 200) {
      callback(payload, data.data, nextState)
    } else if (data.code != 401) {
      message.error(data.msg)
    }
  }
  return {
    getFileMD5,
    presignedUploadUrl,
    getFileMerage,
    storingFileInformation,
  }
}
