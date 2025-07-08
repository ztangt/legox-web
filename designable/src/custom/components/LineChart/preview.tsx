import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import { observer, useField, useFieldSchema, useForm } from '@formily/react'
import { useEffect, useState } from 'react'
import { Line } from '@ant-design/charts'
export const LineChart: DnFC<any> = observer((props) => {
  const [config, setConfig] = useState<any>({
    data: [],
    height: 400,
    xField: 'year',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
  })
  const field = useField()
  useEffect(() => {
    const config = {
      data: field.data ? field.data : [],
      height: 400,
      xField: 'Date',
      yField: 'scales',
      xAxis: {
        // type: 'timeCat',
        tickCount: 5,
      },
    }
    setConfig(config)
  }, [field.data])
  return (
    <div id="container_line" {...props}>
      <Line {...config} />
    </div>
  )
})
LineChart.Behavior = createBehavior({
  name: '折线图',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'LineChart',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.NumberInput),
  },
  designerLocales: AllLocales.NumberInput,
})

LineChart.Resource = createResource({
  icon: 'NumberPickerSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'LineChart',
        'x-decorator': 'FormItem',
        'x-component': 'LineChart',
        'x-component-props': {},
      },
    },
  ],
})
