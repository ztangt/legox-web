import IconLeft from '@/Icon-left'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { getColumnCodeValue, setColumnCodeValue } from '@/utils/formUtil'
import { dataFormat } from '@/utils/utils'
import { onFieldValueChange } from '@formily/core'
import { observer, useField, useFieldSchema, useForm } from '@formily/react'
import { DatePicker as AntdDatePicker } from 'antd'
import classnames from 'classnames'
import type { Moment } from 'moment'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { initStyle } from '../../../service/constant'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'
export const DatePicker: DnFC<any> = observer((props) => {
  const fieldScme: any = useFieldSchema()
  const columnCode: string = fieldScme ? fieldScme.columnCode : ''
  const form = useForm()
  const field = useField()
  // console.log('field1111===', field)

  const [dataName, setDataName] = useState<any>()
  const [isOk, setIsOk] = useState(false) //为了初始化
  // console.log('field11111=', field.path.segments)
  // console.log('propsdataName==', props, dataName)
  //获取父节点的code
  const pathSegments = field.path.segments
  useEffect(() => {
    if (props.value == 'current') {
      let currentDate = `date_${Math.floor(new Date().getTime() / 1000)}`
      setColumnCodeValue(
        form,
        pathSegments,
        columnCode,
        currentDate,
        true,
        () => {}
      )
      // if (pathSegments.length > 1 && pathSegments[0] != 'x-component-props') {
      //   //包含在字表里面
      //   const index = pathSegments[pathSegments.length - 2]
      //   const parentCode = pathSegments[pathSegments.length - 3]
      //   const tabelValue = form.values[parentCode]
      //   tabelValue[index][columnCode] = currentDate
      //   form.setValues({ [parentCode]: _.cloneDeep(tabelValue) })
      // } else {
      //   //包含在主表里面
      //   form.setValues({ [columnCode]: currentDate })
      // }
    }
  }, [])
  useEffect(() => {
    if (field.value == '') {
      field.setValue(null)
    }
  }, [field.value])
  form.addEffects('table', () => {
    onFieldValueChange(columnCode, (field) => {
      if (field.value && !field.value.includes('date_')) {
        form.setFieldState(columnCode, (state) => {
          if (parseInt(field.value) == field.value) {
            //为正常的时间戳
            state.value = `date_${field.value}`
          } else {
            state.value = null
          }
        })
      }
    })
  })
  useMemo(() => {
    // console.log('111111====', dataName, pathSegments)
    if (isOk) {
      setColumnCodeValue(
        form,
        pathSegments,
        columnCode,
        dataName,
        true,
        () => {}
      )
      // if (pathSegments.length > 1 && pathSegments[0] != 'x-component-props') {
      //   //包含在字表里面
      //   const index = pathSegments[pathSegments.length - 2]
      //   const parentCode = pathSegments[pathSegments.length - 3]
      //   const tabelValue = form.values[parentCode]
      //   tabelValue[index][columnCode] = dataName
      //   form.setValues({ [parentCode]: _.cloneDeep(tabelValue) })
      // } else {
      //   //包含在主表里面
      //   form.setValues({ [columnCode]: dataName })
      // }
      setIsOk(false)
    }
  }, [dataName])
  const changeDate = (date: Moment, dateString: string) => {
    setIsOk(true)
    if (date) {
      let newValue = 0
      if (props.format == 'YYYY-MM-DD') {
        newValue = moment(`${dateString} 00:00:00`).valueOf()
        console.log('newValue===', newValue)
      } else {
        newValue = date.valueOf()
      }
      setDataName(`date_${Math.floor(newValue / 1000)}`)
    } else {
      setDataName(null)
    }
  }
  const getValueFn = () => {
    let value = getColumnCodeValue(form, pathSegments, columnCode)?.value
    // if (pathSegments.length > 1 && pathSegments[0] != 'x-component-props') {
    //   //包含在字表里面
    //   const index = pathSegments[pathSegments.length - 2]
    //   const parentCode = pathSegments[pathSegments.length - 3]
    //   const tabelValue = form.values[parentCode]
    //   value = tabelValue?.[index]?.[columnCode]
    // } else {
    //   value = form.values[columnCode]
    // }
    let fromValue =
      value && value.includes('date_') ? value.split('date_')[1] : value
    let newValue = fromValue ? dataFormat(fromValue, props.format) : '' //将字符串解析成日期
    return newValue ? moment(newValue, props.format) : ''
  }
  return (
    <AntdDatePicker
      {...props}
      onChange={changeDate.bind(this)}
      showTime={
        props.format == 'YYYY-MM-DD HH:mm:ss' ||
        props.format == 'YYYY-MM-DD HH:mm' ||
        props.format == 'YYYY年MM月DD日 HH时'
          ? true
          : false
      }
      className={
        field.authType != 'NONE' && getValueFn()
          ? classnames(styles.date_warp, props.redClassName, styles.hover_close)
          : classnames(styles.date_warp, props.redClassName)
      }
      value={field.authType == 'NONE' ? '' : getValueFn()}
      placeholder={props.disabled ? '' : props.placeholder}
    />
  )
})

DatePicker.Behavior = createBehavior({
  name: 'DatePicker',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'DatePicker',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.DatePicker),
  },
  designerLocales: AllLocales.DatePicker,
})

DatePicker.Resource = createResource({
  icon: <IconLeft type="icon-riqiziduan" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: '日期',
        'x-decorator': 'FormItem',
        'x-component': 'DatePicker',
        'x-component-props': {
          allowClear: true,
          style: {
            ...initStyle?.style,
          },
        },
        'x-decorator-props': {
          labelStyle: {
            ...initStyle?.labelStyle,
          },
        },
      },
    },
  ],
})
