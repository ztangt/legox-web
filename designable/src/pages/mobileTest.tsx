import React, { useMemo, useEffect, useCallback, useState } from 'react'
import { createSchemaField } from '@formily/react'
import {
  createForm,
  onFormSubmitValidateEnd,
  onFormValidateFailed,
  onFormValidateStart,
  onFormValuesChange,
  onFieldChange,
  onFieldValueChange,
} from '@formily/core'
import { cloneDeep, debounce } from 'lodash'
import {
  dealBigMoney,
  calculateTime,
  toNumber,
  mergeSameKeys,
} from '../utils/utils'
import { MAIN_TABLE_CODE_NAME } from '../utils/constant'
import {
  Form,
  FormButtonGroup,
  FormItem,
  Checkbox,
  Editable,
  Switch,
  Password,
  PreviewText,
  Radio,
  Reset,
  Select,
  Space,
  Submit,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
  FormGrid,
  FormLayout,
  FormTab,
  FormCollapse,
  ArrayCards,
} from '@/formily/antd'
import { Card, Slider, Rate } from 'antd'
import { TreeNode } from '@/designable/core'
import { transformToSchema } from '@/designable/transformer/src'
import {
  PersonTree,
  OrgTree,
  DeptTree,
  UploadFile,
  DatePicker,
  PullData,
  ArrayTablePreview as ArrayTable,
  WriteSign,
  BasicData,
  AreaTravel,
  TreeTable,
  NumberPicker,
  Invoice,
  Cascader,
  AttachmentBiz,
  Year,
  NumberInput,
  InputPreview as Input,
  FormTablePreview as FormTable,
  TextArea,
  FormStep,
  BaseChart,
} from '@/custom/components'
import { useModel } from 'umi'
import {
  serialNumListFn,
  authListFn,
  redColFn,
  clearRedColFn,
} from '@/utils/formUtil'
import { injectCodeSnippet } from '../components/widgets/Operation/injectCodeSnippet'
import { scriptEvent } from '@/utils/performScript'
import Moblie from './mobilePreview'
const Preview = () => {
  const Text: React.FC<{
    value?: string
    content?: string
    mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p'
  }> = ({ value, mode, content, ...props }) => {
    const tagName = mode === 'normal' || !mode ? 'div' : mode
    return React.createElement(tagName, props, value || content)
  }
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
    setSubMap,
    redCol,
    subMap,
    cutomHeaders,
    setCutomHeaders,
    setFormParams,
    leftTreeData,
  } = useModel('@@qiankunStateFromMaster')
  const {
    //deployFormId,
    formJson,
    attachmentList,
    formStyle,
    getFormStyle,
    setState,
    getFormDetail,
    getFormData,
    getEncoding,
    getFormRelBizInfoList,
    getFormAttachmentList,
    // getDictInfoList,
    getButtonInfo,
  } = useModel('preview')
  const { getOperation } = useModel('operation')
  const { form: formProps, schema } = formJson
  const pathname = window.location.pathname.split('/')[1]
  //获取表单json
  useEffect(() => {
    deployFormId && getFormStyle({ deployFormId }, setCutomHeaders)
  }, [deployFormId])
  useEffect(() => {
    formId && getFormDetail({ formId, version })
    // localStorage.removeItem('isGetTableColumCodes') //初次加载时删除签批控件的缓存
    // localStorage.removeItem('tableColumCodes')
    // localStorage.removeItem('signUserInfo')
    // localStorage.removeItem('signConfig')
    // localStorage.removeItem('commentJson')
  }, [formId])
  // useEffect(() => {
  //   if (formJson && Object.keys(formJson).length) {
  //     if (location.query.bizInfoId) {
  //       getFormData(
  //         {
  //           //获取数据
  //           bizSolId: bizInfo.bizSolId,
  //           id: location.query.id || '0',
  //           bizInfoId: location.query.bizInfoId,
  //         },
  //         (data) => {
  //           //保存mainTableId
  //           setCutomHeaders('', data[0].data[0].ID)
  //           var values = {}
  //           data.map((dataItem: any, index: number) => {
  //             var tableData = dataItem?.data
  //             if (index == 0) {
  //               values = tableData?.[0]
  //             } else {
  //               var tableCode = ''
  //               if (subMap && Object.keys(subMap).length != 0) {
  //                 for (let subKey of subMap) {
  //                   if (subMap[subKey] === dataItem?.deployFormId) {
  //                     tableCode = subKey
  //                   }
  //                 }
  //                 values[tableCode] = tableData
  //               }
  //             }
  //           })
  //           //form.reset().then(() => {
  //           form.setValues(values)
  //           setState({ isInIt: true })
  //           //附件回显
  //           getFormRelBizInfoList(
  //             {
  //               bizInfoId: bizInfo.bizInfoId,
  //               mainTableId: data[0].data[0].ID,
  //             },
  //             (data) => {
  //               console.log('data=', data)
  //               //orm.setValues(data)
  //               Object.keys(data).map((key) => {
  //                 form.setFieldState(key, (state) => {
  //                   state['dataSource'] = data[key]
  //                 })
  //               })
  //             }
  //           )
  //           //关联文件回显
  //           getFormAttachmentList(
  //             {
  //               bizInfoId: bizInfo.bizInfoId,
  //               mainTableId: data[0].data[0].ID,
  //             },
  //             (attachmentList: any) => {
  //               form.setValues(attachmentList)
  //             }
  //           )
  //           //}) //是为了码表空间修改页面不赋首页的默认值
  //           //获取全部枚举类型及详细信息
  //           // getDictInfoList((dictsList: any) => {
  //           //   setFormParams({ dictsList: dictsList }) //将列表传到formShow,用于标题的显示
  //           // })
  //         }
  //       )
  //     } else {
  //       //对于左树右列表的列表建模，按钮里面配置了执行带入则执行在formShow里面
  //       //新增的时候有可能有编码带入
  //       // getItem('leftTreeData', {
  //       //   bizSolId: location.query.bizSolId,
  //       //   pathname: pathname,
  //       // }).then((data) => {
  //       // console.log('data==', data)
  //       // let leftTreeData = data
  //       console.log('leftTreeData===', leftTreeData)
  //       if (leftTreeData) {
  //         //let listModel = leftTreeData?.listModel
  //         let dragCodes = leftTreeData?.dragCodes
  //         //let dragInData = leftTreeData?.dragInData || {}
  //         let usedYear = location.query.usedYear || new Date().getFullYear()
  //         let searchCodes = leftTreeData?.searchCodes
  //         //let searchData = leftTreeData?.searchData
  //         // if (
  //         //   //左树为表单的情况
  //         //   listModel?.modelType === 'TREELIST' &&
  //         //   listModel?.treeSourceType != 'ORGANIZATION'
  //         // ) {
  //         // form.setValues({
  //         //   PARENT_ID: dragInData.PARENT_ID,
  //         // }) //只要是树的就需要代PARENT_ID
  //         if (dragCodes && Object.keys(dragCodes).length) {
  //           //只有配置的时候才调用编码
  //           getEncoding(
  //             {
  //               bizSolId: location.query.bizSolId,
  //               parentCode: dragCodes?.PARENT_CODE,
  //               grade: dragCodes?.GRADE,
  //               usedYear: usedYear,
  //             },
  //             (newEncode) => {
  //               dragCodes.OBJ_CODE = newEncode
  //               //开始带入
  //               let tmpDragInData = {}
  //               dragCodes &&
  //                 Object.keys(dragCodes).map((key) => {
  //                   tmpDragInData[key] = dragCodes[key]
  //                 })
  //               form.setValues({
  //                 ...tmpDragInData,
  //               })
  //             }
  //           )
  //         }
  //         if (searchCodes && Object.keys(searchCodes).length) {
  //           //开始带入
  //           let tmpSearchData = {}
  //           Object.keys(searchCodes).map((key) => {
  //             tmpSearchData[key] = searchCodes[key]
  //           })
  //           form.setValues({
  //             ...tmpSearchData,
  //           })
  //         }
  //         //}
  //       }
  //       //})
  //       //获取全部枚举类型及详细信息
  //       // getDictInfoList((dictsList: any) => {
  //       //   setFormParams({ dictsList: dictsList }) //将列表传到formShow,用于标题的显示
  //       // })
  //     }
  //   }
  //   //  form渲染完毕再进行预算设置
  //   location.query.title !== '查看' &&
  //     formProps &&
  //     !isPreview &&
  //     getOperation({ deployFormId }, successCallback) // 运算设置
  // }, [formJson]) //数据回显
  //附件回显
  //关联文档回显
  // useEffect(() => {
  //   if (cutomHeaders?.mainTableId) {

  //   }
  // }, [cutomHeaders?.mainTableId])
  useEffect(() => {
    setSubMap && setSubMap(formStyle?.subMap)
  }, [formStyle])
  const form = useMemo(() => {
    let creactFrom = createForm({})
    setForm && setForm(creactFrom)
    return creactFrom
  }, [])
  // useEffect(() => {
  //   //首先清空背景色
  //   clearRedColFn(form, redCol, subMap)
  //   if (redCol && redCol.length) {
  //     redColFn(form, redCol, subMap)
  //   }
  // }, [redCol])
  // //在列表的按钮里设置的（配置了以后设置表单权限）
  // const setFormAuth = (params: any) => {
  //   Object.keys(params).map((key) => {
  //     form.setFieldState(key, (state) => {
  //       state['editable'] = params[key]
  //     })
  //   })
  // }
  // const setFormAuthByButton = () => {
  //   //获取按钮信息
  //   getButtonInfo(
  //     { buttonId: location.query.buttonId },
  //     async (beforeEvent: string, thenEvent: string, afterEven: string) => {
  //       //[cur.beforeEvent, cur.thenEvent, cur.afterEven];
  //       // scriptEvent 为按钮前置、中置、后置事件列表
  //       let fnList = await scriptEvent([beforeEvent, thenEvent, afterEven])
  //       try {
  //         let isNull = fnList.filter((i: any) => i)
  //         if (!isNull || isNull.length === 0) {
  //         } else {
  //           fnList.forEach((item: any) => {
  //             if (item.includes('setFormAuth(')) {
  //               let pattern = /[//]*[\s]*setFormAuth.*?(\}\))/g
  //               let content = []
  //               let m: any
  //               while ((m = pattern.exec(item))) {
  //                 content.push(m[0])
  //               }
  //               content.map((data) => {
  //                 eval(data)
  //               })
  //             }
  //           })
  //         }
  //       } catch (e) {
  //         console.log('e=====', e)
  //       }
  //     }
  //   )
  // }
  // const authFn = useCallback(
  //   (subMap) => {
  //     //查看情况不可编辑,没有授权也不可编辑
  //     form.setState({ editable: false })
  //     if (authList.length) {
  //       authListFn(authList, subMap, form, bizInfo, location) //表单授权
  //     }
  //     serialNumListFn(serialNumList, form, subMap) //绑定编码
  //   },
  //   [authList, serialNumList]
  // )
  // useEffect(() => {
  //   if (schema && !isPreview && formStyle && Object.keys(formStyle).length) {
  //     authFn(formStyle?.subMap)
  //     if (location.query?.buttonId) {
  //       setFormAuthByButton() //通过按钮id获取按钮对表单的操作权限设置
  //     }
  //   }
  //   if (schema && isPreview && formStyle && Object.keys(formStyle).length) {
  //     form.setState({ editable: false })
  //   }
  // }, [schema, authList, serialNumList, formStyle])
  // form.id = formProps?.formCode

  // function successCallback(data) {
  //   const optTypeArr = []
  //   const guizeArr = []
  //   const guizeNumberArr = []
  //   const eventTypeArr = []
  //   const resultTypeArr = []
  //   const toggleCaseArr = []
  //   const toggleColumnArr = []
  //   const primaryTableName = formProps?.formCode

  //   const tmp = cloneDeep(data)
  //   for (let i = 0; i < tmp.length; i++) {
  //     optTypeArr.push(tmp[i].optType)
  //     eventTypeArr.push(tmp[i].triggerType)

  //     const expressionArr = tmp[i].expression
  //       .replaceAll(`${MAIN_TABLE_CODE_NAME}:`, `${primaryTableName}:`)
  //       .split(',')

  //     guizeArr.push(
  //       `${
  //         tmp[i].resultFormCode === MAIN_TABLE_CODE_NAME
  //           ? primaryTableName
  //           : tmp[i].resultFormCode
  //       }:${tmp[i].resultColumnCode}=${expressionArr[0]}`
  //     )
  //     guizeNumberArr.push(expressionArr[1])
  //     resultTypeArr.push(tmp[i].resultType)
  //     toggleCaseArr.push(tmp[i].toggleCase)
  //     toggleColumnArr.push(tmp[i].toggleColumn)
  //   }
  //   let code = injectCodeSnippet(
  //     primaryTableName,
  //     guizeArr,
  //     optTypeArr,
  //     resultTypeArr,
  //     toggleCaseArr,
  //     eventTypeArr,
  //     guizeNumberArr,
  //     toggleColumnArr
  //   )

  //   let laterCode = mergeSameKeys(code)
  //   let realCode = ''
  //   let realCodeEdit = ''
  //   laterCode.forEach((item) => {
  //     realCode =
  //       realCode +
  //       `
  //     onFieldChange('${item.key}', debounce((field, form) => {
  //       ${item.val}
  //     }),1000)
  //     `
  //     realCodeEdit =
  //       realCodeEdit +
  //       `
  //     onFieldValueChange('${item.key}', debounce((field, form) => {
  //       ${item.val}
  //     }),1000)
  //     `
  //   })

  //   const executeCode = (
  //     onFieldChange,
  //     debounce,
  //     toNumber,
  //     dealBigMoney,
  //     calculateTime
  //   ) => {
  //     const fn = new Function(
  //       'onFieldChange',
  //       'debounce',
  //       'toNumber',
  //       'dealBigMoney',
  //       'calculateTime',
  //       realCode
  //     )
  //     fn(onFieldChange, debounce, toNumber, dealBigMoney, calculateTime)
  //   }

  //   const executeCodeEdit = (
  //     onFieldValueChange,
  //     debounce,
  //     toNumber,
  //     dealBigMoney,
  //     calculateTime
  //   ) => {
  //     const fn = new Function(
  //       'onFieldValueChange',
  //       'debounce',
  //       'toNumber',
  //       'dealBigMoney',
  //       'calculateTime',
  //       realCodeEdit
  //     )
  //     fn(onFieldValueChange, debounce, toNumber, dealBigMoney, calculateTime)
  //   }
  //   // console.log('~~~~~~1',realCode);
  //   setTimeout(() => {
  //     if (realCode) {
  //       if (location.query.title == '新增') {
  //         form.addEffects('when', () => {
  //           executeCode(
  //             onFieldChange,
  //             debounce,
  //             toNumber,
  //             dealBigMoney,
  //             calculateTime
  //           )
  //         })
  //       } else {
  //         form.addEffects('when', () => {
  //           executeCode(
  //             onFieldChange,
  //             debounce,
  //             toNumber,
  //             dealBigMoney,
  //             calculateTime
  //           )
  //           executeCodeEdit(
  //             onFieldValueChange,
  //             debounce,
  //             toNumber,
  //             dealBigMoney,
  //             calculateTime
  //           )
  //         })
  //       }
  //       // if (location.query.title == '修改') {

  //       // }
  //     }
  //   }, 0)
  // }
  // form.addEffects('Failed', () => {
  //   onFormSubmitValidateEnd((form) => {
  //     if (form?.errors?.length != 0) {
  //       //由于校验失败ant会自动给失败表单项添加类名，直接获取即可
  //       const errorList = (document as any).querySelectorAll(
  //         '.ant-formily-item-error-help'
  //       )
  //       errorList?.[0]?.scrollIntoView({
  //         block: 'nearest',
  //         behavior: 'smooth',
  //       })
  //     }
  //   })
  //   onFormValuesChange((form) => {
  //     if (form?.errors?.length != 0) {
  //       //当前表单存在错误校验
  //       form?.errors?.forEach((element) => {
  //         form.query(element?.path).take((field) => {
  //           field.validate() //再次校验错误字段
  //         })
  //       })
  //     }
  //   })
  // })
  console.log('schema', schema)
  if (
    window.location.href.includes('mobile') &&
    JSON.parse(localStorage.mobileSchema || '[]').length != 0
  ) {
    return (
      <>
        <Form {...formProps} form={form} className="preview_warp">
          <SchemaField schema={JSON.parse(localStorage.mobileSchema || '[]')} />
        </Form>
      </>
    )
  }
  if (window.location.href.includes('mobile') && !schema) {
    return <Moblie />
  }

  return (
    <>
      <Form {...formProps} form={form} className="preview_warp">
        <SchemaField schema={schema} />
      </Form>
    </>
  )
}
export default Preview
