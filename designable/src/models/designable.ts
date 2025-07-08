import apis from '@/service'
import { useSetState } from 'ahooks'
import { message } from 'antd'
import axios from 'axios'
import _ from 'lodash'
import { initFormJson } from '../service/constant'
import { getParam } from '../utils/index'
function loop(array: any) {
  for (let index = 0; index < array.length; index++) {
    const element = array[index]
    element['title'] = element.dictTypeName
    element['value'] = element.dictTypeCode
    element['key'] = element.dictTypeCode
    if (element.dictTypeCode == 'sys' || element.dictTypeCode == 'diy') {
      element['disabled'] = true
    }
    if (element.children) {
      loop(element.children)
    }
  }
  return array
}
interface State {
  settingForm?: any
  dsTree?: Array<any>
  ctlgs?: Array<any>
  formTSX?: String
  formJson?: any
  configSchema?: any
  tableColList?: Array<any>
  bizSoldData?: Array<any>
  dsTableTree?: Array<any>
  businessControls?: Array<any>
  dictData?: Array<any>
  deployFormId?: String
  loading?: boolean
  updateDisabled?: boolean
  dictsList?: any
  appJsonUrl?: any
}
export default () => {
  const [state, setState] = useSetState<State>({
    settingForm: {}, //表单详情
    dsTree: [], //数据源树
    ctlgs: [], //应用类别树
    formTSX: '',
    formJson: {},
    configSchema: {}, //当前配置schema数据
    tableColList: [], //表列集合
    bizSoldData: [], //自定义公共空间的值来源
    dsTableTree: [],
    businessControls: [], //业务控件
    dictData: [], //基础数据码表
    deployFormId: '',
    loading: false,
    updateDisabled: false,
    dictsList: {}, //全部码表信息
    appJsonUrl: '', //appjson
  })
  //获取表单
  const getForm = async (payload: any) => {
    setState({ loading: true })
    const { data } = await apis.getForm(payload, () => {
      getForm(payload)
    })
    const { isBusiness } = getParam()
    if (data.code == 200) {
      setState({ loading: false })
      // 给运算设置用的primaryTableName
      localStorage.setItem('primaryTableName', data.data.formCode || '')
      if (isBusiness != 1) {
        setState({
          settingForm: data.data,
          deployFormId: data.data?.deployFormId,
        })
      }

      if (window.location.href.includes('/formDesigner')) {
        getFormUrl(data.data.formJsonUrl, '')
      } else {
        // data.data?.deployFormId &&
        //   getAppFormUrl({ deployFormId: data.data?.deployFormId })
        getFormUrl(data.data.appJsonUrl, data.data.formJsonUrl)
      }
      // getFormTSX(data.data.formTsxUrl)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }
  //发布表单
  const addForm = async (payload: any, callback: Function) => {
    setState({ loading: true })
    const { data } = await apis.addForm(payload, () => {
      addForm(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data, 'add')
      message.success('保存成功')
      //跳转到新发布版本
      window.location.replace(
        `#/support/designer/formDesigner?formId=${data.data.formId}`
      )
      var newFormRefreshKey = localStorage.getItem('newFormRefreshKey') || 0
      newFormRefreshKey = Number(newFormRefreshKey) + 1
      localStorage.setItem('newFormRefreshKey', String(newFormRefreshKey))
      localStorage.setItem('newFormCtlgId', payload?.ctlgId)
      init()
      setState({ loading: false })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
      setState({ loading: false })
    }
  }

  //发布表单
  const updateForm = async (payload: any, callback: Function) => {
    setState({ loading: true })
    const { data } = await apis.updateForm(payload, () => {
      updateForm(payload, callback)
    })
    const { settingForm } = state
    if (data.code == 200) {
      callback && callback(data, 'update')
      message.success('更新成功')
      //跳转到新发布版本
      // window.location.replace(
      //   `#/support/designer/formDesigner?formId=${settingForm.formId}&version=${settingForm.version}`
      // )
      var newFormRefreshKey = localStorage.getItem('newFormRefreshKey') || 0
      newFormRefreshKey = Number(newFormRefreshKey) + 1
      localStorage.setItem('newFormRefreshKey', String(newFormRefreshKey))
      localStorage.setItem('newFormCtlgId', payload?.ctlgId)
      // init()
      setState({ loading: false })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }
  //发布表单
  const releaseForm = async (payload: any, callback: Function) => {
    setState({ loading: true })
    const { data } = await apis.releaseForm(payload, () => {
      releaseForm(payload, callback)
    })
    if (data.code == 200) {
      callback && callback(data, 'release')
      message.success('发布成功')
      //跳转到新发布版本
      window.location.replace(
        `#/support/designer/formDesigner?formId=${data.data.formId}&version=${data.data.version}`
      )
      var newFormRefreshKey = localStorage.getItem('newFormRefreshKey') || 0
      newFormRefreshKey = Number(newFormRefreshKey) + 1
      localStorage.setItem('newFormRefreshKey', String(newFormRefreshKey))
      localStorage.setItem('newFormCtlgId', payload?.ctlgId)
      init()
      setState({ loading: false })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
      setState({ loading: false })
    }
  }

  //获取应用类别
  const getCtlg = async (payload: any) => {
    setState({ loading: true })
    const { data } = await apis.getCtlg(payload, () => {
      getCtlg(payload)
    })
    const loop = (children) => {
      return children.map((item) => ({
        title: item.nodeName,
        value: item.nodeId,
        children: loop(item.children || []),
      }))
    }
    if (data.code == 200) {
      setState({ loading: false })
      setState({ ctlgs: loop(data.data.list) })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }
  //获取数据源树
  const getDataSourceTree = async (payload: any) => {
    setState({ loading: true })
    const { data } = await apis.getDataSourceTree(payload, () => {
      getDataSourceTree(payload)
    })
    const loop = (array, isShowTable) => {
      for (var i = 0; i < array.length; i++) {
        array[i]['title'] = array[i]['dsName']
        array[i]['key'] = `${array[i]['dsId']},${array[i]['dsDynamic']}`
        array[i]['value'] = `${array[i]['dsId']},${array[i]['dsDynamic']}`
        array[i]['disabled'] = isShowTable
        array[i]['children'] = []
        if (array[i].tables && array[i].tables.length != 0) {
          //不显示表
          let children = array[i].tables
          for (var f = 0; f < children.length; f++) {
            children[f]['title'] = children[f]['tableName']
            children[f][
              'key'
            ] = `${children[f]['id']},${children[f]['tableName']},${children[f]['tableCode']}`
            children[f][
              'value'
            ] = `${children[f]['id']},${children[f]['tableName']},${children[f]['tableCode']}`
          }
          array[i]['tables'] = children
        }
      }
      return array
    }
    if (data.code == 200) {
      setState({ loading: false })
      const dataArray = [].concat(data.data.list)
      setState({
        dsTree: loop(dataArray, false).filter((item) => {
          return item.isEnable == 1
        }),
      })
      console.log('data.data', data.data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }
  //获取数据源树
  const getDatasourceField = async (payload: any, callback: Function) => {
    // setState({ loading: true })
    const { data } = await apis.getDatasourceField(payload, () => {
      getDatasourceField(payload)
    })
    const loop = (array) => {
      for (var i = 0; i < array.length; i++) {
        array[i]['label'] = array[i]['colName']
        array[i]['key'] = array[i]['colId']
        array[i][
          'value'
        ] = `${array[i]['colId']},${array[i]['colName']},${array[i]['colCode']},${array[i]['colLength']},${array[i]['colDecimalLength']},${array[i]['colType']}`
      }
      return array
    }
    if (data.code == 200) {
      // setState({ loading: false })
      callback && callback(loop(data.data.list))
      setState({
        tableColList: loop(data.data.list),
      })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      // setState({ loading: false })
      message.error(data.msg)
    }
  }
  const init = () => {
    //初始化表单
    const { isBusiness, formId, version } = getParam()
    getCtlg({ type: 'ALL', hasPermission: '0' })
    getDataSourceTree({})
    if (formId) {
      getForm({ formId, version })
    }
  }

  async function getFormUrl(url, formUrl) {
    const { isBusiness, formId, version } = getParam()
    setState({ loading: true })
    try {
      let response = await (
        await fetch(url, { headers: { 'If-None-Match': '123' } })
      ).json()
      setState({ loading: false })
      if (Number(isBusiness) == 1) {
        setState({ formJson: { ...response, form: initFormJson.form } })
      } else {
        setState({ formJson: response })
      }
    } catch (error) {
      setState({ loading: false })
      console.log('JSON解析失败:', error)
      formUrl && getFormUrl(formUrl, '')
    }
  }

  async function getFormTSX(url) {
    let response = await (await fetch(url)).json()
    setState({ formTSX: response })
  }
  //获取业务方案非流程非基础数据列表数据
  const getBasicDataListFn = async (payload: any) => {
    setState({ loading: true })
    const { data } = await apis.getBasicDataList(payload, () => {
      getBasicDataListFn(payload)
    })
    if (data.code == 200) {
      setState({ loading: false })
      setState({ bizSoldData: data.data })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }
  //获取控件
  const getBusinessControlFn = async () => {
    setState({ loading: true })
    const { data } = await apis.getBusinessControl({}, () => {
      getBusinessControlFn()
    })
    if (data.code == 200) {
      setState({ loading: false })
      ;(await data.data.list) &&
        data.data.list.map(async (item) => {
          //循环获取内容
          await axios.get(item.codeUrl, {}).then(function (res) {
            if (res.status == 200) {
              item.code = res.data
              console.log('item===', item)
            }
          })
        })
      setTimeout(() => {
        console.log('data.data.list===', _.clone(data.data.list))
        setState({ businessControls: _.clone(data.data.list) })
      }, 5000) //TODO不能立即获取代码
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }
  //基础数据码表
  const getDictTypeFn = async () => {
    setState({ loading: true })
    const { data } = await apis.getDictTypeTree({}, () => {
      getDictTypeFn()
    })
    if (data.code == 200) {
      setState({ loading: false })
      if (data.data && data.data.list.length) {
        setState({
          dictData: loop([data.data.list[0].sys, data.data.list[1].diy]),
        })
      }
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }
  const authLogin = async () => {
    let loginPayload = {
      clientType: 'PC',
      grantType: 'refresh_token',
      refreshToken: window.localStorage.getItem('refreshToken'),
    }
    setState({ loading: true })
    const { data } = await apis.authLogin(loginPayload, () => {
      authLogin()
    })
    if (data.code == 200) {
      setState({ loading: false })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
      setState({ loading: false })
    }
  }
  const getAllWork = async (payload: any, callback: any) => {
    setState({ loading: true })
    const { data } = await apis.getAllWork(payload, () => {
      getAllWork(payload, callback)
    })
    if (data.code == 200) {
      setState({ loading: false })
      callback(data.data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }
  //获取全部枚举类型及详细信息
  const getDictInfoList = async () => {
    const { data } = await apis.getDictInfoList({}, () => {
      getDictInfoList()
    })
    if (data.code == 200) {
      setState({ dictsList: data?.data?.dicts })
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      message.error(data.msg)
    }
  }
  //获取表单
  const getAppFormUrl = async (payload: any, callback: any) => {
    setState({ loading: true })
    const { data } = await apis.getAppFormUrl(payload, () => {
      getAppFormUrl(payload, callback)
    })
    if (data.code == 200) {
      setState({ loading: false })
      setState({ appJsonUrl: data?.data?.appUrl })
      callback && callback(data)
    } else if (data.code != 401 && data.code != 419 && data.code != 403) {
      setState({ loading: false })
      message.error(data.msg)
    }
  }
  return {
    ...state,
    setState,
    getForm,
    addForm,
    updateForm,
    releaseForm,
    getCtlg,
    getDataSourceTree,
    init,
    getFormUrl,
    getFormTSX,
    getDatasourceField,
    getBasicDataListFn,
    getBusinessControlFn,
    getDictTypeFn,
    authLogin,
    getAllWork,
    getDictInfoList,
    getAppFormUrl,
  }
}
