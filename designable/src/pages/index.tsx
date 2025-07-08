import 'antd/dist/antd.less'
import { useEffect, useMemo } from 'react'
// import { GlobalRegistry } from '@/designable/core/registry'
import {
  ComponentTreeWidget,
  CompositePanel,
  Designer,
  DesignerToolsWidget,
  HistoryWidget,
  OutlineTreeWidget,
  ResourceWidget,
  SettingsPanel,
  StudioPanel,
  ToolbarPanel,
  ViewPanel,
  ViewportPanel,
  ViewToolsWidget,
  Workspace,
  WorkspacePanel,
} from '@/designable/react'
import {
  setNpmCDNRegistry,
  SettingsForm,
} from '@/designable/react-settings-form'
import pinyinUtil from '../utils/pinyinUtil'

import {
  AreaTravel,
  ArrayTable,
  AttachmentBiz,
  BaseChart,
  BasicData,
  Button,
  ButtonUploadFile,
  Card,
  Cascader,
  DatePicker,
  DeptTree,
  DocNo,
  FlowDetails,
  FormCollapse,
  FormGrid,
  FormLayout,
  FormStep,
  FormTab,
  FormTable,
  Input,
  InsertControl,
  Invoice,
  NumberInput,
  NumberPicker,
  OrgTree,
  PerformanceIndicator,
  PersonTree,
  PullData,
  Space,
  SubObject,
  Text,
  TextArea,
  TreeTable,
  UploadFile,
  WriteSign,
  Year,
} from '@/custom/components'
import {
  ArrayCards,
  Checkbox,
  Field,
  Form,
  Password,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
} from '@/designable/antd'
import {
  createDesigner,
  GlobalRegistry,
  KeyCode,
  Shortcut,
} from '@/designable/core'
import { TreeSelectSource } from '@/designable/react/icons'
import {
  onFieldInit,
  onFieldReact,
  onFieldValueChange,
  onFormUnmount,
} from '@formily/core'
import { ConfigProvider, message, Spin } from 'antd'
import _ from 'lodash'
import { useState } from 'react'
import { useModel } from 'umi'
import { getBussionSources } from '../components/service'
import {
  ActionsWidget,
  MarkupSchemaWidget,
  PreviewWidget,
  SchemaEditorWidget,
} from '../components/widgets'
import { INIT_DATA } from '../service/constant'
import styles from './index.less'

ConfigProvider.config({
  theme: {
    primaryColor: JSON.parse(
      window.localStorage.getItem('skinPeeler_support') || '{}'
    ).primaryColor,
  },
})
// import loader from '@monaco-editor/loader'
// loader.config({
//   paths: {
//     vs: `http://10.8.12.154:8088/monaco-editor/min/vs`,
//   },
// })
process.env.NODE_ENV == 'production'
  ? setNpmCDNRegistry(`${window.location.origin}/child/designable`)
  : setNpmCDNRegistry(`http://localhost:8004`)
GlobalRegistry.registerDesignerLocales({
  'zh-CN': {
    sources: {
      Inputs: '基础控件',
      Layouts: '页面布局',
      ORGTREE: '组织机构控件',
      business: '业务组件',
      DataChart: '图表组件',
    },
    icons: {
      Move: '移动',
      Selection: '选择',
      // Close: '关闭',
      PC: '电脑',
      Mobile: '手机',
      Responsive: '响应',
      Flip: '旋转',
      Redo: '回退',
      Undo: '撤回',
      Play: '预览',
      Code: '代码',
      JSON: 'JSON',
      Design: '设计',
      Clone: '复制',
      Remove: '删除',
    },
  },
})
const App = () => {
  const {
    loading,
    getDatasourceField,
    bizSoldData,
    setState,
    tableColList,
    dictData,
    ctlgs,
    dsTree,
    businessControls,
    settingForm,
    getBasicDataListFn,
    dsTableTree,
    getBusinessControlFn,
    getDictTypeFn,
    authLogin,
    getDictInfoList,
  } = useModel('designable')
  console.log('settingForm', settingForm)

  const { location } = useModel('@@qiankunStateFromMaster')
  const [time, setTime] = useState('0')
  const getNewUserToken = () => {
    let designerLastTime = parseInt(
      window.localStorage.getItem('designerLastTime')
    )
    designerLastTime = Math.floor(designerLastTime / 60000)
    let currentTime = Math.floor(new Date().getTime() / 60000)
    console.log('currentTime=', currentTime)
    console.log('designerLastTime=', designerLastTime)
    console.log('ssssss=====1222', currentTime - designerLastTime)
    if (
      currentTime - designerLastTime > 0 &&
      currentTime - designerLastTime <= 11
    ) {
      //请求刷新接口
      authLogin()
    }
  }
  useEffect(() => {
    //用于记录引擎的操作时间
    window.localStorage.setItem('designerLastTime', Date.now().toString())
    const newIntervalId = setInterval(() => {
      getNewUserToken()
    }, 600000) //10分钟
    return () => clearInterval(newIntervalId)
  }, [])
  const { ctlgId, formId, isBusiness, version } = location.query
  const engine = useMemo(
    () =>
      createDesigner({
        shortcuts: [
          new Shortcut({
            codes: [
              [KeyCode.Meta, KeyCode.S],
              [KeyCode.Control, KeyCode.S],
            ],
            handler(ctx) {
              // saveSchema(ctx.engine)
            },
          }),
        ],
        rootComponentName: 'Form',
      }),
    []
  )
  const effects = (form, node) => {
    const type = node?.props?.['x-component']
    onFieldInit('formCode', (field) => {
      form.setFieldState('formCode', (state) => {
        state.value = settingForm?.formCode
        state.disabled =
          // (Number(isBusiness) != 1 && formId) ||
          Number(isBusiness) != 1 && Number(version) ? true : false
      })
    })
    onFieldInit('formName', (field) => {
      form.setFieldState('formName', (state) => {
        state.value = settingForm?.formName
        state.disabled = window.location.href.includes('/appDesigner')
          ? true
          : false
        // state.disabled =
        //   (Number(isBusiness) != 1 && formId) ||
        //   (Number(isBusiness) != 1 && Number(version))
        //     ? true
        //     : false
      })
    })
    onFieldValueChange('formName', (field) => {
      form.setFieldState('formCode', (state) => {
        if (
          !state.disabled && //
          field.value &&
          ((Number(isBusiness) != 1 && !formId) ||
            (Number(isBusiness) == 1 && formId))
        ) {
          state.value = pinyinUtil
            .getFirstLetter(field.value, false)
            .toUpperCase()
        }
      })
      settingForm['formName'] = field.value
      // setState({ settingForm })
    })

    onFieldValueChange('formCode', (field) => {
      settingForm['formCode'] = field.value
      // setState({ settingForm })
    })
    onFieldValueChange('columnName', (field) => {
      form.setFieldState('columnCode', (state) => {
        if (state.disabled) {
          return
        }
        if (node?.props?.isDeploy == 1 && Number(version) && isBusiness != 1) {
          return
        }
        if (field.query('columnId').value()) {
          return
        }
        state.value = pinyinUtil
          .getFirstLetter(field.value, false)
          .toUpperCase()
      })
    })
    onFieldValueChange('columnId', (field) => {
      //根据选择字段设置字段配置信息
      if (!field.value) {
        return
      }
      const [
        columnId,
        columnName,
        columnCode,
        columnLength,
        columnDecimalLength,
        columnType,
      ] = field.value.split(',')
      if (!columnType) {
        return
      }
      //判断控件类型是否匹配
      if (columnType != INIT_DATA?.[type]?.columnType) {
        message.error('当前选择字段类型与控件不匹配')
        form.setFieldState('columnId', (state) => {
          state.value = ''
        })
        return
      }
      form.setFieldState('columnName', (state) => {
        state.value = columnName
      })
      form.setFieldState('columnCode', (state) => {
        state.value = columnCode
      })

      form.setFieldState('columnLength', (state) => {
        state.value = columnLength
        state.validator = {
          maximum: columnLength,
        }
      })
      form.setFieldState('columnDecimalLength', (state) => {
        state.value = columnDecimalLength
      })
      form.setFieldState('columnType', (state) => {
        state.value = columnType
      })
    })

    onFieldInit('dsId', (field) => {
      //数据源
      field.setDataSource(dsTree)

      if (node?.root?.props?.dsId) {
        const flag = dsTree.findIndex((item) => {
          return item.dsId == field.query('dsId').value()?.split(',')[0]
        })
        const dsDynamicFlag = dsTree.findIndex((item) => {
          return item.dsDynamic == field.query('dsId').value()?.split(',')[1]
        })
        if (flag != -1 && dsDynamicFlag != -1) {
          form.setFieldState('dsId', (state) => {
            state.disabled = true
          })
          return
        } else {
          field.value = ''
        }
      }
      if (settingForm?.dsId && settingForm?.dsDynamic) {
        form.setFieldState('dsId', (state) => {
          state.value = settingForm?.dsId?.includes(settingForm?.dsDynamic)
            ? settingForm?.dsId
            : `${settingForm?.dsId},${settingForm?.dsDynamic}`
          state.disabled = true
        })
      }
    })

    onFieldReact('tableId', (field) => {
      //根据数据源响应表
      if (field.query('dsId').value()) {
        const flag = dsTree.findIndex((item) => {
          return item.dsId == field.query('dsId').value()?.split(',')[0]
        })
        if (flag == -1) {
          return
        }
        field.setDataSource(dsTree?.[flag]?.tables)
      }
    })

    // onFieldReact('columnType', (field) => {
    //   //根据x-display响应字段类型是否为隐藏字段
    //   if (
    //     form.values?.['x-display'] == 'hidden' ||
    //     form.values?.['x-display'] == 'none'
    //   ) {
    //     form.setFieldState('columnType', (state) => {
    //       state.value = 'HIDDEN'
    //     })
    //   }
    // })

    onFieldValueChange('tableId', (field) => {
      if (!field?.value) {
        return
      }
      const [id, tableName, tableCode] = field?.value?.split(',')

      if (
        type == 'ArrayTable' ||
        (node?.props?.['type'] == 'object' && !node?.props?.['x-component'])
      ) {
        //更新浮动表表名、code
        form.setFieldState('columnName', (state) => {
          if (state.value) {
            return
          } else {
            state.value = tableName
          }
          // state.disabled = true
        })

        form.setFieldState('columnCode', (state) => {
          // state.disabled = true
          if (state.value) {
            return
          } else if (
            node?.props?.isDeploy == 1 &&
            Number(version) &&
            isBusiness != 1
          ) {
            return
          } else {
            state.value = tableCode
          }
        })
      }
      if (!node?.parent) {
        //更新主表表名、code
        form.setFieldState('formName', (state) => {
          if (state.value) {
            return
          } else {
            state.value = tableName
          }
          // state.disabled = true
        })
        form.setFieldState('formCode', (state) => {
          // state.disabled = true
          if (state.value) {
            return
          } else {
            state.value = tableCode
          }
        })
      }
      form.setFieldState('dsId', (state) => {
        state.disabled = true
      })
      // form.setFieldState('tableId', (state) => {
      //   state.disabled = true
      // })
    })
    onFieldInit('ctlgId', (field) => {
      //表单分类
      field.setDataSource(ctlgs)
      form.setFieldState('ctlgId', (state) => {
        state.disabled =
          settingForm?.ctlgId ||
          (Number(isBusiness) != 1 && formId) ||
          (Number(isBusiness) != 1 && Number(version))
            ? true
            : false
        if (settingForm?.ctlgId) {
          state.value = settingForm?.ctlgId
        }
        if (node?.props?.ctlgId) {
          return
        }
        state.value = ctlgId != 'undefined' ? ctlgId : settingForm?.ctlgId
      })
    })

    // onFieldValueChange('ctlgId', (field) => {
    //   settingForm['ctlgId'] = field.value
    //   setState({ settingForm })
    // })
    onFieldInit('tableId', (field) => {
      console.log(
        'settingForm?.subForms',
        settingForm?.subForms,
        node?.parent,
        node
      )

      if (node?.root?.props?.dsId) {
        const flag = dsTree.findIndex((item) => {
          return item.dsId == node?.root?.props?.dsId?.split(',')[0]
        })
        if (flag != -1) {
          field.setDataSource(dsTree?.[flag]?.tables)

          console.log('field.value', field.value)
          // if(isBusiness==1){
          //   field.value = ''
          // }
          var tableId = field.value

          if (!field.value && !node?.parent && node?.root?.props?.tableId) {
            tableId = node?.root?.props?.tableId
          }
          if (
            !node?.parent &&
            settingForm?.tableId &&
            !tableId?.includes(settingForm?.tableId)
          ) {
            //父节点
            tableId = settingForm?.tableId
          }
          if (
            type == 'ArrayTable' ||
            (node?.props?.['type'] == 'object' && !node?.props?.['x-component'])
          ) {
            //子表
            const subObj = _.find(settingForm?.subForms, {
              //子表对象
              formCode: node?.props?.columnCode,
            })
            if (
              subObj &&
              Object?.keys(subObj)?.length &&
              subObj?.tableId &&
              !tableId.includes(subObj?.tableId)
            ) {
              //子表tableId赋值
              tableId = subObj?.tableId
            }
          }

          if (tableId && !tableId.includes(',')) {
            //tebleId中无tableCode tableName
            var obj = _.find(dsTree?.[flag]?.tables, { id: tableId })
            if (obj && Object.keys(obj).length) {
              form.setFieldState('tableId', (state) => {
                state.value = `${obj.id},${obj.tableName},${obj.tableCode}`
              })
            }
          }
        } else {
          field.value = ''
        }
      } else {
        field.value = ''
      }
      form.setFieldState('tableId', (state) => {
        state.disabled =
          // field.value ||
          window.location.href.includes('/appDesigner') ||
          (node?.props?.isDeploy == 1 && Number(version) && isBusiness != 1) //已发布则不能编辑
        if (
          type == 'ArrayTable' ||
          (node?.props?.['type'] == 'object' &&
            !node?.props?.['x-component']) ||
          !node?.parent
        ) {
          //子表或根节点
          //子表的显示
          state.visible = true
        } else {
          state.visible = false
        }
      })
    })
    onFieldInit('columnId', (field) => {
      let tableId = node?.root?.props?.tableId //主表taleId
      //选择数据源列
      if (
        type == 'ArrayTable' ||
        (node?.props?.['type'] == 'object' && !node?.props?.['x-component'])
      ) {
        //子表的配置时隐藏
        form.setFieldState('columnId', (state) => {
          state.visible = false
        })
        return
      }
      // if (
      //   node?.parent?.parent?.parent?.props?.['x-component'] == 'ArrayTable' ||
      //   (node?.parent?.props?.['type'] == 'object' &&
      //     !node?.props?.['x-component'])
      // ) {
      //   tableId = node?.parent?.parent?.parent?.props?.tableId //浮动表taleId
      // }
      if (
        node?.parent?.parent?.parent?.props?.['x-component'] == 'ArrayTable'
        //  ||
        // (node?.parent?.props?.['type'] == 'object' &&
        //   !node?.props?.['x-component'])
      ) {
        tableId = node?.parent?.parent?.parent?.props?.tableId //浮动表taleId
        //子表
        const subObj = _.find(settingForm?.subForms, {
          //子表对象
          formCode: node?.parent?.parent?.parent?.props?.columnCode,
        })
        if (
          subObj &&
          Object?.keys(subObj)?.length &&
          subObj?.tableId &&
          !tableId?.includes(subObj?.tableId)
        ) {
          //子表tableId赋值
          tableId = subObj?.tableId
        }
      }

      if (node?.getParents()?.length != 0) {
        node?.getParents()?.map((parent, index) => {
          console.log('parentparent', parent)

          if (
            parent?.props?.type == 'object' &&
            parent?.props?.['x-component-props']?.['subContainerName'] ==
              'subObject'
          ) {
            console.log('parentparent', parent?.props)
            tableId = parent?.props?.tableId //容器表id
            //子表
            const subObj = _.find(settingForm?.subForms, {
              //子表对象
              formCode: parent?.props?.columnCode,
            })
            if (
              subObj &&
              Object?.keys(subObj)?.length &&
              subObj?.tableId &&
              !tableId.includes(subObj?.tableId)
            ) {
              //子表tableId赋值
              tableId = subObj?.tableId
            }
            return
          }
        })
      }

      if (!tableId) {
        field.value = ''
        return
      }
      const [id, tableName, tableCode] = tableId.split(',')
      form.setFieldState('columnId', (state) => {
        // state.value = ''
        state.loading = true
        if (node?.props?.isDeploy == 1 && Number(version) && isBusiness != 1) {
          //已发布则不可编辑
          state.disabled = true
        }
        getDatasourceField(
          {
            tableId: id,
            start: 1,
            limit: 10000,
            searchWord: '',
          },
          (data) => {
            node.setProps({
              colCodes: data.map((item) => {
                return item.colCode
              }),
            })
            field.setDataSource(data)
            state.loading = false
          }
        )
      })
    })
    onFieldInit('columnType', (field) => {
      form.setFieldState('columnType', (state) => {
        if (
          type == 'ArrayTable' ||
          (node?.props?.['type'] == 'object' && !node?.props?.['x-component'])
        ) {
          //子表的配置时隐藏
          state.visible = false
        }
        state.disabled = true
        // if (
        //   form.values?.['x-display'] == 'hidden' ||
        //   form.values?.['x-display'] == 'none'
        // ) {
        //   state.value = 'HIDDEN'
        // } else {
        state.value = INIT_DATA?.[type]?.['columnType']
        // }
      })
    })
    onFieldInit('columnLength', (field) => {
      //
      form.setFieldState('columnLength', (state) => {
        state.disabled = window.location.href.includes('/appDesigner')
          ? true
          : false
        if (
          type == 'ArrayTable' ||
          (node?.props?.['type'] == 'object' && !node?.props?.['x-component'])
        ) {
          //子表的配置时隐藏
          state.visible = false
        }
        if (INIT_DATA?.[type]?.['disabled']) {
          //固定类型控件不可编辑长度
          state.disabled = true
        }
        if (node?.props?.isDeploy == 1 && Number(version) && isBusiness != 1) {
          //已发布则不能编辑
          state.disabled = true
        }
        state.validator = {
          maximum: INIT_DATA?.[type]?.['columnLength'],
        }
        if (state.value) {
          return
        }
        // state.disabled = true
        state.value = INIT_DATA?.[type]?.['columnLength']
      })
    })
    onFieldInit('columnDecLength', (field) => {
      form.setFieldState('columnDecLength', (state) => {
        state.disabled = window.location.href.includes('/appDesigner')
          ? true
          : false
        state.visible = type == 'NumberPicker' ? true : false
        if (state.value) {
          return
        }
        state.value = INIT_DATA?.[type]?.['columnDecLength']
      })
    })
    onFieldInit('columnName', (field) => {
      form.setFieldState('columnName', (state) => {
        state.disabled = window.location.href.includes('/appDesigner')
          ? true
          : false
        if (
          type == 'ArrayTable' ||
          (node?.props?.['type'] == 'object' && !node?.props?.['x-component'])
        ) {
          //子表的配置时修改title
          state.title = '子表名称'
          if (
            node?.props?.isDeploy == 1 &&
            Number(version) &&
            isBusiness != 1
          ) {
            //已发布则不能编辑
            state.disabled = true
          }
        } else {
          //非子表名称 发布后表名可编辑
          // if (
          //   node?.props?.isDeploy == 1 &&
          //   Number(version) &&
          //   isBusiness != 1
          // ) {
          //   //已发布则不能编辑
          //   state.disabled = true
          // }
        }
      })
    })
    onFieldInit('columnCode', (field) => {
      form.setFieldState('columnCode', (state) => {
        if (
          type == 'ArrayTable' ||
          (node?.props?.['type'] == 'object' && !node?.props?.['x-component'])
        ) {
          //子表的配置时修改title
          state.title = '子表编码'
        }
        state.disabled = window.location.href.includes('/appDesigner')
          ? true
          : false
        if (node?.props?.isDeploy == 1 && Number(version) && isBusiness != 1) {
          //已发布则不能编辑
          state.disabled = true
        }
      })
    })

    //
    onFieldInit('title', (field) => {
      form.setFieldState('title', (state) => {
        if (type == 'Text') {
          state.disabled = false
        } else {
          state.disabled = true
        }
      })
    })
    //
    onFieldInit('name', (field) => {
      form.setFieldState('name', (state) => {
        if (type == 'Text') {
          state.hidden = TreeSelectSource
        } else {
          state.hidden = false
        }
      })
    })
    //公共自定义组件的值来源
    onFieldInit('x-component-props.bizSolId', (field) => {
      field.setDataSource(bizSoldData)
    })
    //基础数据码表
    onFieldInit('x-component-props.codeTable', (field) => {
      field.setDataSource(
        _.concat([{ key: '', value: '', title: '请选择' }], dictData)
      )
    })
    //码表改变，该fild的数据源改变
    onFieldValueChange('x-component-props.codeTable', (field) => {
      console.log('field=', field)
    })
    onFieldInit('x-component-props.limitorg', (field) => {
      form.setFieldState('x-component-props.OrgTreeNAME_', (state) => {
        state.visible = field.value == 'ORGS' ? true : false
        state.value = field.value != 'ORGS' ? '' : state.value
      })
      form.setFieldState('x-component-props.OrgTreeID_', (state) => {
        state.value = field.value != 'ORGS' ? '' : state.value
      })
    })
    //单位选择的现实和隐藏
    onFieldValueChange('x-component-props.limitorg', (field) => {
      form.setFieldState('x-component-props.OrgTreeNAME_', (state) => {
        state.visible = field.value == 'ORGS' ? true : false
        state.value = field.value != 'ORGS' ? '' : state.value
      })
      form.setFieldState('x-component-props.OrgTreeID_', (state) => {
        state.value = field.value != 'ORGS' ? '' : state.value
      })
    })
    onFieldValueChange('x-component-props.selectModal', (field) => {
      if (node?.props?.isDeploy == 1 && Number(version)) {
        //已发布 修改基础数据码表选选择模式  只能发布新版
        setState({ updateDisabled: true })
      }
    })
    //高度与行高的关联
    onFieldValueChange('x-component-props.style.height', (field) => {
      form.setFieldState('x-component-props.style.lineHeight', (state) => {
        state.value = field.value
      })
    })

    //高度与行高的关联
    onFieldValueChange('x-decorator-props.labelStyle.height', (field) => {
      form.setFieldState('x-decorator-props.labelStyle.lineHeight', (state) => {
        state.value = field.value
      })
    })
    onFieldReact('x-component-props.isShowLineEdit', (field) => {
      //根据数据源响应表
      let largerDataValue = field
        .query('x-component-props.isLargerData')
        .value()
      if (largerDataValue) {
        field.setState({
          // value: largerDataValue,
          visible: largerDataValue,
        })
      }
    })
    onFormUnmount(() => {
      if (form.values?.['dsId'] && form.values?.['dsId'] != settingForm?.dsId) {
        console.log('settingForm4444', settingForm)
        // settingFormObj['dsId'] = form.values?.['dsId']
        // settingFormObj['dsDynamic'] = form.values?.['dsId']?.split(',')?.[1]
        // settingFormObj['dsId'] = form.values?.['tableId']?.split(',')?.[0] ||
        //                       settingFormObj.tableId ||

        setState({
          settingForm: {
            ...settingForm,
            dsId: form.values?.['dsId'],
            dsDynamic: form.values?.['dsId']?.split(',')?.[1],
            tableId:
              form.values?.['tableId']?.split(',')?.[0] ||
              settingForm.tableId ||
              '',
          },
        })

        // setState({settingForm: settingFormObj})
      }
      // if (
      //   (form.values?.['formName'] &&
      //     form.values?.['formName'] != settingForm?.formName) ||
      //   (form.values?.['formCode'] &&
      //     form.values?.['formCode'] != settingForm?.formCode)
      // ) {
      //   console.log('settingForm4444',settingForm);
      //   // settingFormObj['formName'] = form.values?.['formName']
      //   // settingFormObj['formCode'] = form.values?.['formCode']
      //   // setState({settingForm: settingFormObj})

      //   // setState({
      //   //   settingForm: {
      //   //     ...settingForm,
      //   //     formName: form.values?.['formName'],
      //   //     formCode: form.values?.['formCode'],
      //   //   },
      //   // })
      // }
    })
    onFieldInit('x-component-props.tabId', (field) => {
      field.value = node?.props?.name || node.id
    })
  }
  const [businessSources, setBusinessSources] = useState<any>([])
  const [businessSourcesObject, setBusinessSourcesObject] = useState<any>({})
  useEffect(() => {
    //获取业务组件
    getBusinessControlFn()
    //获取业务方案非流程非基础数据列表数据
    getBasicDataListFn({ bpmFlag: 0, baiscDataFlag: 0 })
    //获取基础数据码表
    getDictTypeFn()
  }, [])
  useEffect(() => {
    if (businessControls.length) {
      //获取业务组件
      const { businessSourcesObject, businessSources } = getBussionSources(
        businessControls
      )
      setBusinessSourcesObject(businessSourcesObject)
      setBusinessSources(businessSources)
    }
  }, [businessControls])
  useEffect(() => {
    //获取全部枚举类型及详细信息
    getDictInfoList()
  }, [])
  return (
    <Spin spinning={loading}>
      <Designer engine={engine}>
        <StudioPanel actions={<ActionsWidget />}>
          <CompositePanel>
            <CompositePanel.Item title="panels.Component" icon="Component">
              <ResourceWidget
                title="sources.Layouts"
                sources={[
                  Card,
                  FormGrid,
                  FormTab,
                  FormLayout,
                  FormCollapse,
                  Space,
                  ArrayTable,
                  SubObject,
                  FormStep,
                  FormTable,
                ]}
              />
              <ResourceWidget
                title="sources.Inputs"
                sources={
                  window.location.href.includes('/appDesigner')
                    ? [
                        Text,
                        Input,
                        TextArea,
                        NumberPicker,
                        DatePicker,
                        UploadFile,
                        PullData,
                        WriteSign,
                        BasicData,
                        Invoice,
                        AttachmentBiz,
                        Year,
                        NumberInput,
                        ButtonUploadFile,
                        Button,
                        FlowDetails,
                        DocNo,
                        PerformanceIndicator,
                        InsertControl,
                      ]
                    : [
                        Text,
                        Input,
                        TextArea,
                        NumberPicker,
                        DatePicker,
                        UploadFile,
                        PullData,
                        WriteSign,
                        BasicData,
                        Invoice,
                        AttachmentBiz,
                        Year,
                        NumberInput,
                        ButtonUploadFile,
                        Button,
                        DocNo,
                        PerformanceIndicator,
                        InsertControl,
                      ]
                }
              />
              <ResourceWidget
                title="sources.ORGTREE"
                sources={[PersonTree, OrgTree, DeptTree]}
              />
              {businessSources.length ? (
                <ResourceWidget
                  title="sources.Business"
                  sources={[...businessSources, AreaTravel, Cascader]}
                />
              ) : (
                ''
              )}
              <ResourceWidget title="sources.DataChart" sources={[BaseChart]} />
            </CompositePanel.Item>
            <CompositePanel.Item title="panels.OutlinedTree" icon="Outline">
              <OutlineTreeWidget />
            </CompositePanel.Item>
            <CompositePanel.Item title="panels.History" icon="History">
              <HistoryWidget />
            </CompositePanel.Item>
          </CompositePanel>
          <Workspace id="form">
            <WorkspacePanel>
              <ToolbarPanel>
                <DesignerToolsWidget />
                <ViewToolsWidget
                  use={['DESIGNABLE', 'JSONTREE', 'MARKUP', 'PREVIEW']}
                />
              </ToolbarPanel>
              <ViewportPanel style={{ height: '100%' }}>
                <ViewPanel type="DESIGNABLE" className="designable_wrap">
                  {() => (
                    <ComponentTreeWidget
                      components={{
                        Form,
                        Field,
                        Input,
                        Select,
                        TreeSelect,
                        Cascader,
                        Radio,
                        Checkbox,
                        Slider,
                        Rate,
                        NumberPicker,
                        Transfer,
                        Password,
                        DatePicker,
                        TimePicker,
                        Upload,
                        Switch,
                        Text,
                        Card,
                        ArrayCards,
                        ArrayTable,
                        Space,
                        FormTab,
                        FormCollapse,
                        FormGrid,
                        FormLayout,
                        PersonTree,
                        UploadFile,
                        DeptTree,
                        OrgTree,
                        TreeTable,
                        ...businessSourcesObject,
                        PullData,
                        WriteSign,
                        BasicData,
                        SubObject,
                        AreaTravel,
                        Invoice,
                        AttachmentBiz,
                        Year,
                        NumberInput,
                        BaseChart,
                        FormStep,
                        FormTable,
                        TextArea,
                        ButtonUploadFile,
                        Button,
                        FlowDetails,
                        DocNo,
                        PerformanceIndicator,
                        InsertControl,
                      }}
                    />
                  )}
                </ViewPanel>

                <ViewPanel type="JSONTREE" scrollable={false}>
                  {(tree, onChange) => (
                    <SchemaEditorWidget tree={tree} onChange={onChange} />
                  )}
                </ViewPanel>
                <ViewPanel type="MARKUP" scrollable={false}>
                  {(tree) => <MarkupSchemaWidget tree={tree} />}
                </ViewPanel>
                <ViewPanel type="PREVIEW">
                  {(tree) => <PreviewWidget tree={tree} />}
                </ViewPanel>
              </ViewportPanel>
            </WorkspacePanel>
          </Workspace>
          <SettingsPanel title="panels.PropertySettings">
            <SettingsForm
              effects={effects}
              className={styles.design_setting_wrap}
            />
          </SettingsPanel>
        </StudioPanel>
      </Designer>
    </Spin>
  )
}
export default App
