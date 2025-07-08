import apis from '@/service'
import { message } from 'antd'
export default () => {
  //获取可用于生成的文号集合
  const getGenerateDocNOList = async (payload: any, callback: any) => {
    const { data } = await apis.getGenerateDocNOList(payload)
    if (data.code == 200) {
      callback(data.data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  const generateDocNO = async (payload: any, callback: any) => {
    const { data } = await apis.generateDocNO(payload)
    if (data.code == 200) {
      callback('', true)
    } else if (data.code == 'OA_DOC_NO_USED') {
      message.error(`【当前文号已被占用，将更新为“${data.data.currentNo}”】`)
      callback(data.data.currentNo, false)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  const getFillNo = async (payload: any, callback: any) => {
    const { data } = await apis.getFillNo(payload)
    if (data.code == 200) {
      callback(data.data.list)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  const delDocNo = async (payload: any, callback: any) => {
    const { data } = await apis.delDocNo(payload)
    if (data.code == 200) {
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  // sys/dictInfo/list
  return {
    getGenerateDocNOList,
    generateDocNO,
    getFillNo,
    delDocNo,
  }
}
