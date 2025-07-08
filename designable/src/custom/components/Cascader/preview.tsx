import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { observer, useField } from '@formily/react'
import { Cascader as AntdCascader } from 'antd'
import { CalendarProps } from 'antd/lib/calendar'
import classnames from 'classnames'
import { useEffect } from 'react'
import { initStyle } from '../../../service/constant'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'
export const Cascader: DnFC<CalendarProps<any>> = observer((props) => {
  const field = useField()
  console.log('props===', props)
  console.log('field===', field)
  useEffect(() => {
    if (typeof props.value == 'object' && props.value != null) {
      field.setValue(props.value.join('/'))
    }
  }, [props.value])
  const getValue = () => {
    if (typeof field.value != 'object') {
      return field.value?.split('/') || []
    }
  }
  return (
    <div
      style={
        !props.disabled
          ? { ...props.style }
          : { ...props.style, background: '#f5f5f5' }
      }
      className={classnames(styles.cascader_container, props.redClassName)}
    >
      <AntdCascader
        {...props}
        value={getValue()}
        options={field.dataSource}
        placeholder={props.disabled ? '' : props.placeholder}
        style={{}}
      />
    </div>
  )
})
Cascader.Behavior = createBehavior({
  name: 'Cascader',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Cascader',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Cascader),
  },
  designerLocales: AllLocales.Cascader,
})

Cascader.Resource = createResource({
  icon: 'CascaderSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: '出发地区差旅树',
        'x-decorator': 'FormItem',
        'x-component': 'Cascader',
        'x-component-props': {
          fieldNames: {
            label: 'cityName',
            value: 'cityName',
            children: 'children',
          },
          showSearch: true,
          changeOnSelect: true,
          displayRender: (label) => label.join('-'),
          style: {
            ...initStyle?.style,
          },
        },
        'x-reactions': {
          fulfill: {
            run:
              '$effect(() => {\n  fetch(`${window.localStorage.getItem("env")}/public/city?cityName=`, {\n    method: "get",\n    headers: {\n      Authorization: "Bearer " + window.localStorage.getItem("userToken"),\n    },\n  })\n    .then((response) => response.json())\n    .then(({ data }) => {\n      $self.dataSource = data.list\n    })\n}, [])\n',
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
