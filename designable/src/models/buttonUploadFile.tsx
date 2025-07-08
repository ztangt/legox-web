import apis from '@/service'
import { message } from 'antd'
export default () => {
  //追加保存附件控件(new)
  const saveAppendBizRelAtt = async (payload: any, callback: Function) => {
    const { data } = await apis.saveAppendBizRelAtt(payload, () => {
      saveAppendBizRelAtt(payload, callback)
    })
    callback && callback(data)
    // if (data.code == 200) {
    //   message.success('上传成功')
    //   callback && callback(data.data?.ids || [])
    // } else if (data.code != 401 && data.code != 419 && data.code != 403) {
    //   message.error(data.msg)
    // }
  }

  //获取已关联附件
  const getV2BizRelAtt = async (payload: any, callback: Function) => {
    const { data } = await apis.getV2BizRelAtt(payload, () => {
      getV2BizRelAtt(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data.data.list)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  ///public/bizRelAtt/checkName
  const checkName = async (payload: any, callback: Function) => {
    const { data } = await apis.checkName(payload, () => {
      checkName(payload, callback)
    })
    if (data.code == 200) {
      if (data.data.have == 1) {
        message.error('文件名重复，请修改你上传的文件名')
        return false
      } else {
        return true
      }
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
      return false
    }
  }
  //删除表单控件中关联的附件(new)
  const deleteV2BizRelAtt = async (payload: any, callback: Function) => {
    const { data } = await apis.deleteV2BizRelAtt(payload, () => {
      deleteV2BizRelAtt(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //重命名
  const updateBizRelAttName = async (payload: any, callback: Function) => {
    const { data } = await apis.updateBizRelAttName(payload, () => {
      updateBizRelAttName(payload, callback)
    })
    if (data.code == 200) {
      callback && callback()
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //批量下载
  const downZip = async (payload: any, callback: Function) => {
    const { data } = await apis.downZip(payload, () => {
      downZip(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data.data.downloadUrl)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  return {
    saveAppendBizRelAtt,
    getV2BizRelAtt,
    deleteV2BizRelAtt,
    checkName,
    updateBizRelAttName,
    downZip,
  }
}
