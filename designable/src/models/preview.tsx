import { IFormilySchema } from '@/designable/transformer/src'
import apis from '@/service'
import { useSetState } from 'ahooks'
import { message } from 'antd'

interface State {
  formStyle?: any
  formJson?: IFormilySchema
  formdata?: Array<any>
  attachmentList?: any
  formData?: any
  tableStyleInfo?: any
  pullDataList?: any
  pullDatacurrentPage?: any
  pullDataTotalCount?: any
  pullDataModal?: any
  bizSolList?: any
  signConfig?: any
  dataDriveInfoId?: any
  isBase?: any
  pullData?: any
  userInfo?: any
  dictInfos?: any
  buttonList?: any
  authList?: any
  deployFormId?: String
  attachmentBizList?: any
  isInIt?: boolean
  dictsList?: any
  preRedCol?: any
  isShowError?: boolean
  errorsMessage?: any
  templateColumnList?: any
}
export default () => {
  const [state, setState] = useSetState<State>({
    formStyle: {},
    formJson: {},
    formdata: [],
    attachmentList: {},
    buttonList: {},
    authList: [],
    tableStyleInfo: {}, //拉取列表样式
    pullDataList: [], //拉取数据列表
    pullDatacurrentPage: 1,
    pullDataTotalCount: 0,
    pullDataModal: false, //数据拉取弹窗
    bizSolList: [], //拉取方案
    signConfig: {}, //意见签批配置
    dataDriveInfoId: '',
    isBase: 0,
    pullData: {}, //拉取数据
    userInfo: {}, //用户信息
    dictInfos: [], //字典表
    deployFormId: '',
    attachmentBizList: [],
    isInIt: false, //是否初始化完成
    dictsList: {}, //全部码表信息
    preRedCol: [], //用于清空上一次的
    isShowError: false, //是否显示错误信息的弹框
    errorsMessage: [], //错误信息
    templateColumnList: [], //文件模板
  })
  //获取表单样式
  const getFormDetail = async (payload: any) => {
    const { data } = await apis.getFormDetail(payload, () => {
      getFormDetail(payload)
    })
    if (data.code == 200) {
      setState({
        formStyle: data.data,
        deployFormId: data.data?.deployFormId,
      })
      getFormJson(data.data.formJsonUrl)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //移动端的办理详情控件
  const getBpmnDetail = async (payload: any, callback: any) => {
    const { data } = await apis.getBpmnDetail(payload, () => {
      getBpmnDetail(payload, callback)
    })
    if (data.code == 200) {
      let obj = JSON.parse(JSON.stringify(data.data))
      if (!obj?.bizInfo) {
        obj.bizInfo = {}
      }
      callback && callback(obj)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //获取表单样式
  // const getFormStyle = async (payload: any, setCutomHeaders) => {
  //   // const { data } = await apis.getFormStyle(payload, () => {
  //   //   getFormStyle(payload, setCutomHeaders)
  //   // })
  //   // if (data.code == 200) {
  //   //   // setState({ formStyle: data.data })
  //   //   // getFormJson(data.data.formJsonUrl)
  //   //   // setCutomHeaders(data?.data?.dsDynamic)
  //   // } else if (data.code != 401 && data.code != 419 && data.code != 403) {
  //   //   message.error(data.msg)
  //   // }
  // }
  //
  // const getBizInfo = async (payload: any) => {
  //   const { data } = await apis.getBizInfo(payload)
  //   if (data.code == 200) {
  //     setState({ bizInfo: data.data, bizInfoId: data.data.bizInfoId })
  //     getFormStyle({ deployFormId: data.data.formDeployId })
  //     getBussinessForm({
  //       bizSolId: data.data.bizSolId,
  //       procDefId: data.data.procDefId,
  //       formDeployId: data.data.formDeployId,
  //     })
  //     //获取附件列表
  //     getFormAttachmentList({
  //       bizInfoId: data.data.bizInfoId,
  //     })
  //   } else if (data.code != 401 && data.code != 419 && data.code !=403) {
  //     message.error(data.msg)
  //   }
  // }

  // const getBacklogBizInfo = async (payload: any) => {
  //   const { data } = await apis.getBacklogBizInfo(payload)
  //   if (data.code == 200) {
  //     setState({ bizInfo: data.data, bizInfoId: data.data.bizInfoId })
  //     getFormStyle({ deployFormId: data.data.formDeployId })
  //     getBussinessForm({
  //       bizSolId: data.data.bizSolId,
  //       procDefId: data.data.procDefId,
  //       formDeployId: data.data.formDeployId,
  //     })
  //     //获取附件列表
  //     getFormAttachmentList({
  //       bizInfoId: data.data.bizInfoId,
  //     })
  //   } else if (data.code != 401 && data.code != 419 && data.code !=403) {
  //     message.error(data.msg)
  //   }
  // }
  // const getBussinessForm = async (payload: any) => {
  //   const { data } = await apis.getBussinessForm(payload)
  //   setState({ bussinessForm: data.data })
  // }
  async function getFormJson(url) {
    try {
      let response = await (await fetch(url)).json()
      setState({ formJson: response })
    } catch (error) {
      console.log('JSON解析失败:', error)
    }
  }

  const getFormData = async (payload: any, callback: any) => {
    const { data } = await apis.getFormData(payload, () => {
      getFormData(payload, callback)
    })
    if (data.code == 200) {
      callback(data.data.list)
      //return data.data.list
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  const saveFormData = async (payload: any) => {
    const { data } = await apis.saveFormData(payload, () => {
      saveFormData(payload)
    })
    if (data.code == 200) {
      let formdata = JSON.parse(payload.formdata)
      formdata[0].data[0].ID = data.data.id
      setState({
        formdata,
      })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  // //保存附件
  // const saveAttachmentFn = async (payload: any) => {
  //   const { data } = await apis.saveAttachment(payload)
  //   if (data.code == 200) {
  //     //保存成功
  //   } else if (data.code != 401 && data.code != 419 && data.code !=403) {
  //     message.error(data.msg)
  //   }
  // }
  const getFormAttachmentList = async (payload: any, callback: any) => {
    const { data } = await apis.getFormAttachmentList(payload, () => {
      getFormAttachmentList(payload, callback)
    })
    if (data.code == 200) {
      callback(data.data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  const getFormRelBizInfoList = async (payload: any, callback: any) => {
    const { data } = await apis.getFormRelBizInfoList(payload, () => {
      getFormRelBizInfoList(payload, callback)
    })
    if (data.code == 200) {
      callback(data.data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //获取意见签批配置
  const getSignConfig = async (payload: any, callback: Function) => {
    const { data } = await apis.getSignConfig(payload, () => {
      getSignConfig(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //获取登录用户信息
  const getCurrentUserInfo = async (payload: any, callback: Function) => {
    const { data } = await apis.getCurrentUserInfo(payload, () => {
      getCurrentUserInfo(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  ///拉取数据方案集合
  const getPullDataDriveInfos = async (payload: any, callback: Function) => {
    const { data } = await apis.getPullDataDriveInfos(payload, () => {
      getPullDataDriveInfos(payload, callback)
    })
    if (data.code == 200) {
      if (data.data.bizSolList.length != 0) {
        callback && callback(data)
      }
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //获取拉取列表样式
  const getPullStyle = async (payload: any, callback: Function) => {
    const { data } = await apis.getPullStyle(payload, () => {
      getPullStyle(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
      return data.data
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //获取拉取数据列表
  const getPullDataList = async (payload: any, callback: Function) => {
    const { data } = await apis.getPullDataList(payload, () => {
      getPullDataList(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //获取拉取数据
  const getPullData = async (payload: any, callback: Function) => {
    const { data } = await apis.getPullData(payload, () => {
      getPullData(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //获取字典表
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
  //获取意见签批列表
  const getSignList = async (payload: any, callback: Function) => {
    const { data } = await apis.getSignList(payload, () => {
      getSignList(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  const getTemporarySignList = async (payload: any, callback: Function) => {
    const { data } = await apis.getTemporarySignList(payload, () => {
      getTemporarySignList(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  const getEncoding = async (payload: any, callback: Function) => {
    const { data } = await apis.getEncoding(payload, () => {
      getEncoding(payload, callback)
    })
    if (data.code == 200) {
      callback(data.data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //获取全部枚举类型及详细信息
  // const getDictInfoList = async (callback: any) => {
  //   const { data } = await apis.getDictInfoList({}, () => {
  //     getDictInfoList(callback)
  //   })
  //   if (data.code == 200) {
  //     // setState({ dictsList: data?.data?.dicts })
  //     callback && callback(data?.data?.dicts)
  //   } else if (data.code != 401 && data.code != 419 && data.code != 403) {
  //     message.error(data.msg)
  //   }
  // }
  //通过按钮id获取按钮信息
  const getButtonInfo = async (playlod: any, callback: any) => {
    const { data } = await apis.getButtonInfo(playlod, () => {
      getButtonInfo(playlod, callback)
    })
    if (data.code == 200) {
      callback &&
        callback(
          data.data.beforeEvent,
          data.data.thenEvent,
          data.data.afterEvent
        )
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  const getBizFormData = async (payload: any, callback: any) => {
    const { data } = await apis.getBizFormData(payload, () => {
      getBizFormData(payload, callback)
    })
    if (data.code == 200) {
      callback(data.data)
      //return data.data.list
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  const resetBizRelAtt = async (payload: any, callback: any) => {
    const { data } = await apis.resetBizRelAtt(payload, () => {
      resetBizRelAtt(payload, callback)
    })
    if (data.code == 200) {
      // callback(data.data)
      //return data.data.list
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  // *getSerialNum({ payload, callback }, { call, put, select }) {
  //   const { data } = yield call(apis.getSerialNum, payload);
  //   if (data.code == 200) {
  //     return data.data?.serialNumList||[]
  //   } else if (data.code != 401 && data.code != 419 && data.code != 403){
  //     message.error(data.msg);
  //   }else if(data.code == 401){
  //     let tmpArr = yield Promise.all([
  //       yield put({
  //         type:"getSerialNum",
  //         payload:payload
  //       })
  //     ])
  //     return tmpArr[0];
  //   }
  //   return {
  //     confirmSerialNumList:[],
  //     serialNumList:[]
  //   }
  // },
  const getSerialNum = async (payload: any, callback: any) => {
    const { data } = await apis.getSerialNum(payload)
    if (data.code == 200) {
      callback(data.data?.serialNumList || [])
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  const getTemplateFileList = async (payload: any, callback: any) => {
    //获取业务应用已配置附件模板文件集合
    const { data } = await apis.getTemplateFileList(payload)
    if (data.code == 200) {
      callback(data.data || [])
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  const getTemplateColumnList = async (payload: any, callback: any) => {
    //获取业务应用已配置附件模板字段集合
    const { data } = await apis.getTemplateColumnList(payload)
    if (data.code == 200) {
      setState({ templateColumnList: data.data })
      callback(data.data || [])
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  return {
    ...state,
    setState,
    //getFormStyle,
    getFormData,
    saveFormData,
    getSignConfig,
    getCurrentUserInfo,
    getPullDataDriveInfos,
    getPullStyle,
    getPullDataList,
    getPullData,
    getDictType,
    getSignList,
    getFormDetail,
    getTemporarySignList,
    getEncoding,
    getFormRelBizInfoList,
    getFormAttachmentList,
    // getDictInfoList,
    getButtonInfo,
    getBizFormData,
    resetBizRelAtt,
    getBpmnDetail,
    getSerialNum,
    getTemplateColumnList,
    getTemplateFileList,
  }
}
