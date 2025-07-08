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
  FormStepPreview as FormStep,
  FormTablePreview as FormTable,
  Graph,
  InputPreview as Input,
  InsertControl,
  Invoice,
  ModalContainer,
  NumberInput,
  NumberPicker,
  OrgTree,
  PersonTree,
  PortalApp,
  PortalBar,
  PortalBarCoordinate,
  PortalBarLand,
  PortalBarStacked,
  PortalCalendar,
  PortalCustom,
  PortalFocus,
  PortalLine,
  PortalLineSmooth,
  PortalNotice,
  PortalPie,
  PortalPieDouble,
  PortalPieHollow,
  PortalProfile,
  PortalTitle,
  PortalTodo,
  PortalWorkbench,
  PullData,
  TextArea,
  TreeTable,
  UploadFile,
  WriteSign,
  Year,
  YearPicker,
} from '@/custom/components'
import { TreeNode } from '@/designable/core'
import { transformToSchema } from '@/designable/transformer/src'
import {
  ArrayCards,
  Checkbox,
  Editable,
  EditableModal,
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
import { createForm, onFieldChange } from '@formily/core'
import { createSchemaField } from '@formily/react'
import { Card, Rate, Slider } from 'antd'
import { cloneDeep, debounce } from 'lodash'
import React, { useEffect, useMemo } from 'react'
import { useModel } from 'umi'
import { MAIN_TABLE_CODE_NAME } from '../../utils/constant'
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
} from '../../utils/formUtil'
import {
  calculateTime,
  dealBigMoney,
  mergeSameKeys,
  toNumber,
} from '../../utils/utils'
import { injectCodeSnippet } from './Operation/injectCodeSnippet'
const Text: React.FC<{
  value?: string
  content?: string
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p'
}> = ({ value, mode, content, ...props }) => {
  const tagName = mode === 'normal' || !mode ? 'div' : mode
  return React.createElement(tagName, props, value || content)
}
const formStep = FormStep.createFormStep()
export const SchemaField = createSchemaField({
  components: {
    Space,
    FormGrid,
    FormLayout,
    FormTab,
    FormCollapse,
    ArrayTable,
    ArrayCards,
    FormItem,
    Checkbox,
    Cascader,
    Editable,
    EditableModal,
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
    UploadFile,
    DeptTree,
    OrgTree,
    TreeTable,
    Button,
    PullData,
    WriteSign,
    DatePicker,
    BasicData,
    AreaTravel,
    Invoice,
    AttachmentBiz,
    Year,
    YearPicker,
    NumberInput,
    Graph,
    BaseChart,
    FormStep,
    FormTable,
    TextArea,
    ModalContainer,
    ButtonUploadFile,
    PortalNotice,
    PortalTodo,
    PortalBar,
    PortalBarLand,
    PortalBarStacked,
    PortalBarCoordinate,
    PortalPie,
    PortalPieDouble,
    PortalPieHollow,
    PortalLine,
    PortalLineSmooth,
    PortalTitle,
    PortalCustom,
    PortalWorkbench,
    PortalFocus,
    PortalProfile,
    PortalApp,
    PortalCalendar,
    FlowDetails,
    DocNo,
    InsertControl,
  },
})

export interface IPreviewWidgetProps {
  tree: TreeNode
}

export const PreviewWidget: React.FC<IPreviewWidgetProps> = (props) => {
  const form = useMemo(() => {
    let valuesString = window.localStorage.getItem('values')
    let values = JSON.parse(valuesString)
    return createForm({})
  }, [])
  const { deployFormId } = useModel('designable')
  const {
    operationList,
    getOperation,
    getTableColumnsFn,
    setState,
    values,
  } = useModel('operation')

  const { form: formProps, schema } = transformToSchema(props.tree)

  useEffect(() => {
    if (deployFormId) {
      getOperation({ deployFormId }, successCallback)
      // getTableColumnsFn({ deployFormId, type: 'YES' })
    }
  }, [deployFormId])

  function successCallback(data) {
    const optTypeArr = []
    const guizeArr = []
    const guizeNumberArr = []
    const eventTypeArr = []
    const resultTypeArr = []
    const toggleCaseArr = []
    const toggleColumnArr = []
    const primaryTableName = localStorage.getItem('primaryTableName') //主表名称 看看咋获取
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
    // console.log('~~~~~~2',code);
    let laterCode = mergeSameKeys(code)
    let realCode = ''
    laterCode.forEach((item) => {
      realCode =
        realCode +
        `
      onFieldChange('${item.key}', debounce((field, form) => {
        ${item.val}
      }),1000)
      `
    })

    const executeCode = (
      onFieldChange,
      debounce,
      toNumber,
      dealBigMoney,
      calculateTime
    ) => {
      const fn = new Function(
        'onFieldChange',
        'debounce',
        'toNumber',
        'dealBigMoney',
        'calculateTime',
        realCode
      )
      fn(onFieldChange, debounce, toNumber, dealBigMoney, calculateTime)
    }
    setTimeout(() => {
      realCode &&
        form.addEffects('when', () => {
          executeCode(
            onFieldChange,
            debounce,
            toNumber,
            dealBigMoney,
            calculateTime
          )
        })
    }, 0)
  }

  return (
    <div id="preview_warp" style={{ height: '100%' }}>
      <Form {...formProps} form={form} className={'preview_warp'}>
        <SchemaField
          schema={schema}
          scope={{
            formStep,
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
          }}
        />
        {/* <FormButtonGroup.FormItem>
          <Submit
            onSubmit={(values) => {
              window.localStorage.setItem('values', JSON.stringify(values))
            }}
          >
            暂时把数据存在localStorage
          </Submit>
        </FormButtonGroup.FormItem> */}
      </Form>
    </div>
  )
}
