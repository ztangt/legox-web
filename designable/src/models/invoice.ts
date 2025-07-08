import apis from '@/service'
import { message } from 'antd'
import { useSetState } from 'ahooks'

interface State {
  operationTable?: Array<any>
}
export default () => {
  const [state, setState] = useSetState<State>({})

  //查询票据分类树
  const getInvoiceTree = async (payload: any, callback: Function) => {
    const { data } = await apis.getInvoiceTree(payload, () => {
      getInvoiceTree(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }

  //添加发票树
  const addInvoiceTree = async (payload: any, callback: Function) => {
    const { data } = await apis.addInvoiceTree(payload, () => {
      addInvoiceTree(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }

  //更新发票树
  const updateInvoiceTree = async (payload: any, callback: Function) => {
    const { data } = await apis.updateInvoiceTree(payload, () => {
      updateInvoiceTree(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }

  //删除分类树
  const deleteInvoiceTree = async (payload: any, callback: Function) => {
    const { data } = await apis.deleteInvoiceTree(payload, () => {
      deleteInvoiceTree(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }

  //发票列表
  const getInvoiceList = async (payload: any, callback: Function) => {
    const { data } = await apis.getInvoiceList(payload, () => {
      getInvoiceList(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }

  //删除发票
  const deleteInvoiceList = async (payload: any, callback: Function) => {
    const { data } = await apis.deleteInvoiceList(payload, () => {
      deleteInvoiceList(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }

  //上传
  const uploadInvoice = async (payload: any, callback: Function) => {
    const { data } = await apis.uploadInvoice(payload, () => {
      uploadInvoice(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }

  //转移分类
  const transferInvoice = async (payload: any, callback: Function) => {
    const { data } = await apis.transferInvoice(payload, () => {
      transferInvoice(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }

  //查询单张发票信息
  const getDetailInvoice = async (payload: any, callback: Function) => {
    const { data } = await apis.getDetailInvoice(payload, () => {
      getDetailInvoice(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }

  //更新发票
  const updateInvoiceList = async (payload: any, callback: Function) => {
    const { data } = await apis.updateInvoiceList(payload, () => {
      updateInvoiceList(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }

  //获取发票类型
  const getDictType = async (payload: any, callback: Function) => {
    const { data } = await apis.getDictType(payload, () => {
      getDictType(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }

  const getRefInvoice = async (payload: any, callback: Function) => {
    const { data } = await apis.getRefInvoice(payload, () => {
      getRefInvoice(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }

  const refInvoice = async (payload: any, callback: Function) => {
    const { data } = await apis.refInvoice(payload, () => {
      refInvoice(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //删除关联发票浮动表数据
  const deleteInvoiceRef = async (payload: any, callback: Function) => {
    const { data } = await apis.deleteInvoiceRef(payload, () => {
      deleteInvoiceRef(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //删除关联发票浮动表数据
  const getInvoiceListByIds = async (payload: any, callback: Function) => {
    const { data } = await apis.getInvoiceListByIds(payload, () => {
      getInvoiceListByIds(payload, callback)
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
    getInvoiceTree, //查询票据分类树
    addInvoiceTree, //新增票据分类
    updateInvoiceTree, //修改票据分类
    deleteInvoiceTree, //删除票据分类
    getInvoiceList, //查询发票列表
    uploadInvoice, //上传发票
    transferInvoice, //转移票据分类
    updateInvoiceList, //修改发票（OCR识别，验真）
    getDetailInvoice, //查询单张发票信息
    deleteInvoiceList, //删除发票
    getDictType,
    getRefInvoice,
    refInvoice,
    deleteInvoiceRef,
    getInvoiceListByIds,
  }
}
