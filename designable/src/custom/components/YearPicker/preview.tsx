import IconLeft from '@/Icon-left'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { observer } from '@formily/react'
import { DatePicker as AntdDatePicker } from 'antd'
import moment from 'moment'
import { useState } from 'react'
import { initStyle } from '../../../service/constant'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
const { RangePicker } = AntdDatePicker
const yearFormat = 'YYYY'
const customFormat = (value) => `${value.format(yearFormat)}年`
const currentYear = new Date().getFullYear()
export const YearPicker: DnFC<any> = observer((props) => {
  const [startYear, setStartYear] = useState(currentYear - 4)
  const [endYear, setEndYear] = useState(currentYear)

  return (
    <RangePicker
      {...props}
      picker="year"
      allowClear={false}
      disabled={false}
      defaultValue={[
        moment(startYear, yearFormat),
        moment(endYear, yearFormat),
      ]}
      format={customFormat}
    />
  )
})

YearPicker.Behavior = createBehavior({
  name: 'YearPicker',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'YearPicker',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.YearPicker),
  },
  designerLocales: AllLocales.YearPicker,
})

YearPicker.Resource = createResource({
  icon: <IconLeft type="icon-riqiziduan" className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'YearPicker',
        'x-decorator': 'FormItem',
        'x-component': 'YearPicker',
        'x-component-props': {
          style: {
            ...initStyle?.style,
          },
          // defaultValue: [moment(currentYear - 5, yearFormat), moment(currentYear, yearFormat)],
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
