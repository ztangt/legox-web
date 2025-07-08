import {
  AreaTravel,
  ArrayTablePreview as ArrayTable,
  AttachmentBiz,
  BaseChart,
  BasicData,
  Button,
  ButtonUploadFile,
  Cascader,
  DatePicker,
  DeptTree,
  DocNo,
  FlowDetails,
  FormStep,
  FormTablePreview as FormTable,
  InputPreview as Input,
  InsertControl,
  Invoice,
  ModalContainer,
  NumberInput,
  NumberPicker,
  OrgTree,
  PersonTree,
  PullData,
  TextArea,
  TreeTable,
  UploadFile,
  WriteSign,
  Year,
} from '@/custom/components'
import {
  ArrayCards,
  Checkbox,
  Editable,
  Form,
  FormCollapse,
  FormGrid,
  FormItem,
  FormLayout,
  FormTab,
  Password,
  PreviewText,
  Radio,
  Reset,
  Select,
  Space,
  Submit,
  Switch,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
} from '@/formily/antd'
import {
  authListFn,
  clearRedColFn,
  redColFn,
  serialNumListFn,
} from '@/utils/formUtil'
import {
  createForm,
  onFieldChange,
  onFieldValueChange,
  onFormSubmitValidateEnd,
  onFormValuesChange,
} from '@formily/core'
import { createSchemaField } from '@formily/react'
import { Card, Modal, Rate, Slider, message } from 'antd'
import { cloneDeep, debounce } from 'lodash'
import moment from 'moment'
import React, { useEffect, useMemo } from 'react'
import { useModel } from 'umi'
import { injectCodeSnippet } from '../components/widgets/Operation/injectCodeSnippet'
import { MAIN_TABLE_CODE_NAME } from '../utils/constant'
import {
  CONFIRM,
  DATAFORMAT,
  ENCODEHTML,
  GETFORMDATAID,
  LOCATIONHASH,
  MESSAGE,
  QS,
  SNOWFLAKE,
  UUID,
  fetchAsync,
  globalPinyinUtil,
} from '../utils/formUtil'
import {
  calculateTime,
  dealBigMoney,
  mergeSameKeys,
  toNumber,
} from '../utils/utils'
import './preview.less'
const Text: React.FC<{
  value?: string
  content?: string
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p'
}> = ({ value, mode, content, ...props }) => {
  const tagName = mode === 'normal' || !mode ? 'div' : mode
  return React.createElement(tagName, props, value || content)
}
const Preview = () => {
  const SchemaField = createSchemaField({
    components: {
      Space,
      FormGrid,
      FormLayout,
      FormTab,
      FormCollapse,
      ArrayTable,
      ArrayCards,
      FormItem,
      DatePicker,
      Checkbox,
      Cascader,
      Editable,
      Input,
      Text,
      NumberPicker,
      Switch,
      Password,
      PreviewText,
      Radio,
      Reset,
      Select,
      Submit,
      TimePicker,
      Transfer,
      TreeSelect,
      Upload,
      Card,
      Slider,
      Rate,
      PersonTree,
      OrgTree,
      DeptTree,
      UploadFile,
      PullData,
      WriteSign,
      BasicData,
      AreaTravel,
      TreeTable,
      Invoice,
      AttachmentBiz,
      Year,
      NumberInput,
      FormTable,
      FormStep,
      TextArea,
      BaseChart,
      ModalContainer,
      ButtonUploadFile,
      Button,
      FlowDetails,
      DocNo,
      InsertControl,
    },
  })
  const {
    location,
    deployFormId,
    setForm,
    authList,
    bizInfo,
    serialNumList,
    formId,
    version,
    isPreview,
    redCol,
    formJson,
    bussinessForm,
    leftTreeData,
    setParentState,
    bizModalProps,
    bizModal,
    isUpdataAuth,
    id,
    bizSolId,
    updateFlag,
    targetKey,
    intFormValues,
    cutomHeaders,
    formRelBizInfoList,
    formAttachmentList,
    buttonFormAuthInfo,
    menuObj,
    serialCodeList,
    historyPush,
  } = useModel('@@qiankunStateFromMaster')
  const {
    setState,
    getEncoding,
    preRedCol,
    getSerialNum,
    getTemplateColumnList,
  } = useModel('preview')
  const subMap = bussinessForm?.subMap || {}
  const { getOperation } = useModel('operation')
  const { form: formProps, schema } = formJson
  useEffect(() => {
    window.localStorage.setItem('teshucount', 'on')
    //  form渲染完毕再进行预算设置
    !(
      location?.query?.title == '查看' ||
      decodeURIComponent(location?.query?.title) == '查看'
    ) &&
      !isPreview &&
      formProps &&
      getOperation({ deployFormId }, successCallback) // 运算设置
    return () => {
      if (window.location.href.includes('/mobile')) {
        //取消横屏样式
        document.documentElement.style.transform = 'unset'
        document.documentElement.style.width = `unset`
        document.documentElement.style.overflow = 'unset'
        document.documentElement.style.position = 'unset'
        if (document.getElementById(`formShow_container_${targetKey}`)) {
          document.getElementById(
            `formShow_container_${targetKey}`
          ).style.position = 'relative'
        }
      }
    }
  }, []) //数据回显
  const initialValuesFn = () => {
    var values = {}
    if (updateFlag == 1) {
      intFormValues &&
        intFormValues.length &&
        intFormValues.map((dataItem: any, index: number) => {
          var tableData = dataItem?.data
          if (index == 0) {
            values = tableData?.[0]
          } else {
            var tableCode = ''
            if (subMap && Object.keys(subMap).length != 0) {
              for (let subKey in subMap) {
                if (subMap[subKey] === dataItem?.deployFormId) {
                  tableCode = subKey
                }
              }
              values[tableCode] = tableData
            }
          }
        })
    } else {
      if (leftTreeData) {
        let dragCodes = leftTreeData?.dragCodes
        //let usedYear = location?.query?.usedYear || new Date().getFullYear()
        let searchCodes = leftTreeData?.searchCodes
        if (dragCodes && Object.keys(dragCodes).length) {
          values = { ...values, ...dragCodes }
          //只有配置的时候才调用编码(会在按钮里面写不用加了)
        }
        if (searchCodes && Object.keys(searchCodes).length) {
          //开始带入
          values = { ...values, ...searchCodes }
        }
      }
    }
    //给表单增加一个额外的字段用于响应器里面取值
    values['extraParams'] = {
      bizInfo,
      cutomHeaders: cutomHeaders,
      menuObj: menuObj,
    }
    setState({ isInIt: true })
    return values
  }
  const form = useMemo(() => {
    //组合初始数据
    let tmpInitialValues = initialValuesFn()
    let creactFrom = createForm({
      editable: false,
      initialValues: tmpInitialValues,
    })
    setForm && setForm(creactFrom)
    return creactFrom
  }, [])
  useEffect(() => {
    formRelBizInfoList &&
      Object.keys(formRelBizInfoList).map((key) => {
        form.setFieldState(key, (state) => {
          state['dataSource'] = formRelBizInfoList[key]
        })
      })
    formAttachmentList &&
      Object.keys(formAttachmentList).map((key) => {
        form.setFieldState(key, (state) => {
          state['dataSource'] = formAttachmentList[key]
        })
      })
  }, [])
  useEffect(() => {
    //首先清空背景色
    clearRedColFn(form, preRedCol, subMap)
    if (redCol && redCol.length) {
      setState({ preRedCol: redCol })
      redColFn(form, redCol, subMap)
    } else {
      setState({ preRedCol: [] })
    }
  }, [redCol])
  //通过按钮设置表单的权限和值
  const setFormAuth = (params: any, values: any) => {
    Object.keys(params).map((key) => {
      form.setFieldState(key, (state) => {
        state['editable'] = params[key]
      })
    })
    if (values && Object.keys(values).length) {
      form.setValues(values)
    }
  }
  useEffect(() => {
    getTemplateColumnList(
      {
        bizSolId,
        formDeployId: deployFormId,
        procDefId: bizInfo?.procDefId,
      },
      () => {}
    )
    if (!isPreview && authList.length) {
      authListFn(authList, subMap, form, bizInfo, location, isUpdataAuth) //表单授权
    }
    console.log('serialCodeList===', serialCodeList)
    if (
      !window.location.href.includes('mobile') &&
      !isPreview &&
      serialCodeList.length
    ) {
      //获取值
      let connectJson = []
      let isBindCode = false
      serialCodeList.map((item: any) => {
        let tmpValue = form.values[item.relationCol]
        if (item.relationCol && (!tmpValue || tmpValue.includes(','))) {
          isBindCode = true
        } else {
          let codeValue = form.values[item.formColumnCode] || ''
          if (!codeValue) {
            connectJson.push({
              connectId: item.connectId,
              value: tmpValue,
            })
          }
        }
      })
      if (isBindCode) {
        message.error('编号配置有误,未匹配到唯一入参参数,请检查参数配置')
      }
      if (!connectJson.length) {
        if (buttonFormAuthInfo && Object.keys(buttonFormAuthInfo).length) {
          setFormAuth(buttonFormAuthInfo.authList, buttonFormAuthInfo.values) //通过按钮id获取按钮对表单的操作权限设置
        }
        return
      }
      //请求生成编码接口，获取编码数据
      getSerialNum(
        {
          connectJsonString: JSON.stringify(connectJson),
        },
        (serialNumList: any) => {
          if (serialNumList.length) {
            //移动端不加默认值
            serialNumListFn(serialNumList, form) //绑定编码
          }
          if (buttonFormAuthInfo && Object.keys(buttonFormAuthInfo).length) {
            setFormAuth(buttonFormAuthInfo.authList, buttonFormAuthInfo.values) //通过按钮id获取按钮对表单的操作权限设置
          }
        }
      )
    } else {
      if (buttonFormAuthInfo && Object.keys(buttonFormAuthInfo).length) {
        setFormAuth(buttonFormAuthInfo.authList, buttonFormAuthInfo.values) //通过按钮id获取按钮对表单的操作权限设置
      }
    }
  }, [])
  form.id = formProps?.formCode

  function successCallback(data) {
    const optTypeArr = []
    const guizeArr = []
    const guizeNumberArr = []
    const eventTypeArr = []
    const resultTypeArr = []
    const toggleCaseArr = []
    const toggleColumnArr = []
    const primaryTableName = formProps?.formCode

    const tmp = cloneDeep(data)
    for (let i = 0; i < tmp.length; i++) {
      optTypeArr.push(tmp[i].optType)
      eventTypeArr.push(tmp[i].triggerType)

      const expressionArr = tmp[i].expression
        .replaceAll(`${MAIN_TABLE_CODE_NAME}:`, `${primaryTableName}:`)
        .split(',')

      guizeArr.push(
        `${
          tmp[i].resultFormCode === MAIN_TABLE_CODE_NAME
            ? primaryTableName
            : tmp[i].resultFormCode
        }:${tmp[i].resultColumnCode}=${expressionArr[0]}`
      )
      guizeNumberArr.push(expressionArr[1])
      resultTypeArr.push(tmp[i].resultType)
      toggleCaseArr.push(tmp[i].toggleCase)
      toggleColumnArr.push(tmp[i].toggleColumn)
    }
    let code = injectCodeSnippet(
      primaryTableName,
      guizeArr,
      optTypeArr,
      resultTypeArr,
      toggleCaseArr,
      eventTypeArr,
      guizeNumberArr,
      toggleColumnArr
    )

    let laterCode = mergeSameKeys(code)
    let realCode = ''
    let realCodeEdit = ''
    laterCode.forEach((item) => {
      realCode =
        realCode +
        `
      onFieldChange('${item.key}', debounce((field, form) => {
        ${item.val}
      }),500)
      `
      realCodeEdit =
        realCodeEdit +
        `
      onFieldValueChange('${item.key}', debounce((field, form) => {
        ${item.val}
      }),500)
      `
    })

    const executeCode = (
      onFieldChange,
      debounce,
      toNumber,
      dealBigMoney,
      calculateTime,
      message
    ) => {
      const fn = new Function(
        'onFieldChange',
        'debounce',
        'toNumber',
        'dealBigMoney',
        'calculateTime',
        'message',
        realCode
      )
      fn(
        onFieldChange,
        debounce,
        toNumber,
        dealBigMoney,
        calculateTime,
        message
      )
    }

    const executeCodeEdit = (
      onFieldValueChange,
      debounce,
      toNumber,
      dealBigMoney,
      calculateTime,
      message
    ) => {
      const fn = new Function(
        'onFieldValueChange',
        'debounce',
        'toNumber',
        'dealBigMoney',
        'calculateTime',
        'message',
        realCodeEdit
      )
      fn(
        onFieldValueChange,
        debounce,
        toNumber,
        dealBigMoney,
        calculateTime,
        message
      )
    }
    // console.log('=========00',realCode);
    // console.log('=========001',location);
    setTimeout(() => {
      if (realCode) {
        if (
          location?.query?.title == '新增' ||
          decodeURIComponent(location?.query?.title) == '新增'
        ) {
          form.addEffects('when', () => {
            try {
              // 特殊处理
              if (location?.query?.url === 'budgetTarget') {
                executeCodeEdit(
                  onFieldValueChange,
                  debounce,
                  toNumber,
                  dealBigMoney,
                  calculateTime,
                  message
                )
              } else {
                executeCode(
                  onFieldChange,
                  debounce,
                  toNumber,
                  dealBigMoney,
                  calculateTime,
                  message
                )
              }
              return true
            } catch (e) {
              if (e instanceof SyntaxError) {
                message.error('表单运算配置有误，请检查公式配置！', 5)
                return false
              } else {
                message.error('表单运算配置有误，请检查公式配置！', 5)
                throw e
              }
            }
          })
        } else {
          form.addEffects('when', () => {
            try {
              executeCodeEdit(
                onFieldValueChange,
                debounce,
                toNumber,
                dealBigMoney,
                calculateTime,
                message
              )
              // 特殊处理
              // if (location?.query?.url === 'budgetTarget') {
              //   executeCodeEdit(
              //     onFieldValueChange,
              //     debounce,
              //     toNumber,
              //     dealBigMoney,
              //     calculateTime,
              //     message
              //   )
              // } else {
              //   // executeCode(
              //   //   onFieldChange,
              //   //   debounce,
              //   //   toNumber,
              //   //   dealBigMoney,
              //   //   calculateTime,
              //   //   message
              //   // )
              //   executeCodeEdit(
              //     onFieldValueChange,
              //     debounce,
              //     toNumber,
              //     dealBigMoney,
              //     calculateTime,
              //     message
              //   )
              // }
              return true
            } catch (e) {
              if (e instanceof SyntaxError) {
                message.error('表单运算配置有误，请检查公式配置！')
                return false
              } else {
                message.error('表单运算配置有误，请检查公式配置！')
                throw e
              }
            }
          })
        }
        // if (location.query.title == '修改') {

        // }
      }
    }, 0)
  }

  form.addEffects('Failed', () => {
    onFormSubmitValidateEnd((form) => {
      if (form?.errors?.length != 0) {
        const uniqueErrors = form?.errors?.filter((obj, index) => {
          if (obj.path.includes('.') && obj.path.split('.').length == 3) {
            //这个是浮动表的为了给弹框去重
            let paths = obj.path.split('.')
            let parentCode = paths[0]
            let colCode = paths[2]
            return (
              _.findIndex(form?.errors, function (o) {
                return (
                  o.path.includes('.') &&
                  o.path.split('.').length == 3 &&
                  parentCode == o.path.split('.')[0] &&
                  colCode == o.path.split('.')[2]
                )
              }) === index
            )
          } else {
            return true
          }
        })
        let messages = ''
        uniqueErrors.map((item) => {
          form.getFieldState(item.path, (state) => {
            if (state.parent?.componentProps.isModal) {
              messages = `${messages}<${state.parent.title}.${state.title}>`
            } else if (state.decoratorProps.className == 'decorator_hidden') {
              if (state.parent?.title) {
                messages = `${messages}<${state.parent.title}.${state.title}>`
              } else {
                messages = `${messages}<${state.title}>`
              }
            } else {
              //messages = `${messages}<${state.title}>`
            }
          })
        })
        if (messages) {
          Modal.confirm({
            wrapClassName: 'error_modal',
            content: `请输入${messages}`,
            bodyStyle: { padding: '8px', height: '100%', overflow: 'hidden' },
            getContainer: () => {
              return document.getElementById(`formShow_container_${targetKey}`)
            },
            mask: false,
            maskClosable: false,
            cancelText: '',
          })
        }
        setTimeout(() => {
          //这个暂时只能加一个延迟，当前获取不到
          //由于校验失败ant会自动给失败表单项添加类名，直接获取即可
          const container = document.getElementById(
            `formShow_container_${targetKey}`
          )
          const errorList = container?.querySelectorAll(
            '.ant-formily-item-error'
          )
          const errorListPover = container?.querySelectorAll('.ant-popover')
          for (let index = 0; index < errorListPover.length; index++) {
            const element = errorListPover[index]
            if (element.style.display == 'none') {
              element.style.display = 'block'
            }
          }
          if (errorList.length) {
            errorList?.[0]?.scrollIntoView({
              block: 'nearest', //定义垂直方向的对齐，start、center、end 或 nearest 之一。默认为 start。
              behavior: 'auto', //滚动行为由 scroll-behavior 的计算值决定。
              inline: 'center', //start、center、end 或 nearest 之一。默认为 nearest。
            })
          }
        }, 1)
      }
    })
    onFormValuesChange((form) => {
      if (form?.errors?.length != 0) {
        //当前表单存在错误校验
        form?.errors?.forEach((element) => {
          form.query(element?.path).take((field) => {
            field.validate() //再次校验错误字段
          })
        })
      }
    })
  })
  const formRender = useMemo(() => {
    return (
      <Form
        {...formProps}
        form={form}
        className="preview_warp"
        style={{
          marginLeft: window.location.href.includes('/mobile') ? '0' : '10px',
        }}
      >
        <SchemaField
          schema={schema}
          scope={{
            ENCODEHTML,
            SNOWFLAKE,
            GETFORMDATAID,
            CONFIRM,
            MESSAGE,
            QS,
            globalPinyinUtil,
            LOCATIONHASH,
            UUID,
            DATAFORMAT,
            fetchAsync,
            historyPush,
            moment,
          }}
        />
      </Form>
    )
  }, [])
  const formPreviewRender = () => (
    <Form
      {...formProps}
      form={form}
      className="preview_warp"
      style={{ marginLeft: '10px' }}
    >
      <SchemaField
        schema={schema}
        scope={{
          ENCODEHTML,
          SNOWFLAKE,
          GETFORMDATAID,
          CONFIRM,
          MESSAGE,
          QS,
          globalPinyinUtil,
          LOCATIONHASH,
          UUID,
          DATAFORMAT,
          fetchAsync,
          historyPush,
        }}
      />
    </Form>
  )
  if (window.location.href.includes('/formAppEngine') && isPreview) {
    const prefix = 'dn-mobile-simulator-body'
    const screen = {
      flip: false,
    }
    const MockupImages = {
      dark: [
        '//img.alicdn.com/imgextra/i3/O1CN01zXMc8W26oJZGUaCK1_!!6000000007708-55-tps-946-459.svg',
        '//img.alicdn.com/imgextra/i3/O1CN012KWk2i1DLduN7InSK_!!6000000000200-55-tps-459-945.svg',
      ],
      light: [
        '//img.alicdn.com/imgextra/i4/O1CN01vuXGe31tEy00v2xBx_!!6000000005871-55-tps-946-459.svg',
        '//img.alicdn.com/imgextra/i4/O1CN01ehfzMc1QPqY6HONTJ_!!6000000001969-55-tps-459-945.svg',
      ],
    }
    const theme = 'light'
    return (
      <div
        className={prefix}
        style={{
          alignItems: screen.flip ? 'center' : '',
          minWidth: screen.flip ? 1000 : 0,
        }}
      >
        <div
          className={prefix + '-wrapper'}
          style={{
            position: 'relative',
            minHeight: screen.flip ? 0 : 1000,
          }}
        >
          <img
            src={screen.flip ? MockupImages[theme][0] : MockupImages[theme][1]}
            style={{
              display: 'block',
              margin: '20px 0',
              width: screen.flip ? 946.667 : 460,
              height: screen.flip ? 460 : 946.667,
              boxShadow: '0 0 20px #0000004d',
              borderRadius: 60,
              backfaceVisibility: 'hidden',
            }}
          ></img>
          <div
            className={prefix + '-content'}
            style={{
              position: 'absolute',
              width: 414,
              height: 736,
              top: 126.667,
              left: 23.3333,
              overflow: 'hidden',
            }}
          >
            {formPreviewRender()}
          </div>
        </div>
      </div>
    )
  }
  if (window.location.href.includes('/formEngine') && isPreview) {
    return formPreviewRender()
  }

  return <>{formRender}</>
}
export default Preview
