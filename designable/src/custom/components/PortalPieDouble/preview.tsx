import { creatPortalFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { BarChartOutlined } from '@ant-design/icons'
import { observer } from '@formily/react'
import * as echarts from 'echarts'
import { useEffect, useRef, useState } from 'react'
import { initStyle } from '../../../service/constant'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'
export interface PortalPieDoubleProps {
  option: echarts.EChartsOption
}
export const PortalPieDouble: DnFC<PortalPieDoubleProps> = observer((props) => {
  const chartRef = useRef<HTMLInputElement>(null)
  const [chart, setChart] = useState<echarts.ECharts>()
  const pieData = [
    { value: 2020, name: '数据1' },
    { value: 2021, name: '数据2' },
    { value: 2002, name: '数据3' },
    { value: 2320, name: '数据4' },
  ]
  let defaultProps = {
    option: {
      title: {
        text: '双标签饼状图',
        subtext: '副标题',
        left: 8,
        top: 0,
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#333333',
        },
      },
      toolbox: {
        show: true,
        feature: {
          restore: {
            show: true,
            title: '刷新',
            emphasis: {
              iconStyle: {
                borderColor: '#40a9ff',
              },
            },
          },
        },
      },
      // 在无数据的时候显示一个占位圆。
      showEmptyCircle: true,
      tooltip: {
        trigger: 'item',
      },
      color: ['#4776FF', '#00D3D7', '#FFC42F', '#B57BFE'],

      series: [
        {
          type: 'pie',
          center: ['50%', '50%'],
          itemStyle: {
            borderRadius: 1,
          },
          label: {
            fontSize: 12,
            // {b} 表示数据项的名称，{c} 表示数据项的值，{d} 表示数据项的百分比。
            formatter: ['{b}', '{c}(万元)'].join('\n\n'), //实现两文本上下换行的效果
          },
          data: pieData,
        },
        {
          type: 'pie',
          center: ['50%', '50%'],
          itemStyle: {
            borderRadius: 1,
          },
          label: {
            position: 'inner',
            fontSize: 14,
            // {b} 表示数据项的名称，{c} 表示数据项的值，{d} 表示数据项的百分比。
            formatter: '{d}%',
          },
          data: pieData,
        },
      ],
    },
  }

  const handleResize = () => {
    const chart = echarts.getInstanceByDom(chartRef?.current as HTMLElement)
    chart.resize()
  }

  const initChart = () => {
    if (chart) {
      window.removeEventListener('resize', handleResize)
      chart?.dispose()
    }
    const newChart = echarts?.init(chartRef?.current as HTMLElement)
    if (props?.option) {
      newChart.setOption(props?.option, true)
    } else {
      newChart.setOption(defaultProps.option, true)
    }
    newChart.on('click', function (params) {
      // if (
      //   window.location.href?.includes('business_application') &&
      //   !window.location.href?.includes('portalDesigner') &&
      //   params.data?.menuLink
      // ) {
      //   window.localStorage.setItem('portalQuery', JSON.stringify(params.data))
      //   setTimeout(() => {
      //     window.location.href = `#/business_application?sys=portal&portalTitle=工作台&portalPosition=sys`
      //   }, 0)
      // }
    })
    setChart(newChart)
    window.addEventListener('resize', handleResize)
  }

  useEffect(() => {
    initChart()
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [props?.option])

  return <div className={styles.pie} ref={chartRef} {...props} />
})

PortalPieDouble.Behavior = createBehavior({
  name: 'PortalPieDouble',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'PortalPieDouble',
  designerProps: {
    propsSchema: creatPortalFieldSchema(AllSchemas.PortalPieDouble),
  },
  designerLocales: AllLocales.PortalPieDouble,
})

PortalPieDouble.Resource = createResource({
  icon: <BarChartOutlined className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'PortalPieDouble',
        'x-decorator': 'FormItem',
        'x-component': 'PortalPieDouble',
        'x-reactions': {
          dependencies: [
            {
              property: 'value',
              type: 'any',
            },
          ],

          fulfill: {
            run:
              "// 例子：（内外标签全都有饼图）项目管理类型投资估算占比\n// 默认展示数据\nvar default_pieData = [\n    { value: 2020, name: '数据1' },\n    { value: 2021, name: '数据2' },\n    { value: 2002, name: '数据3' },\n    { value: 2320, name: '数据4' },\n  ];\nconst state = $observable({\n  pieData: [],\n})\n\nvar option\n\noption = {\n  title: {\n    text: '项目管理类型投资估算占比',\n    subtext: '单位：万元',\n    left: 8,\n    top: 0,\n    textStyle: {\n      fontSize: 16,\n      fontWeight: 'bold',\n      color: '#333333',\n    },\n  },\n  toolbox: {\n    show: true,\n    feature: {\n      restore: {\n        show: true, title: '刷新', emphasis: {\n          iconStyle: {\n            borderColor: '#40a9ff'\n          }\n        }\n      },\n    },\n  },\n  // 在无数据的时候显示一个占位圆。\n  showEmptyCircle: true,\n  tooltip: {\n    trigger: 'item',\n  },\n  color: ['#4776FF', '#00D3D7', '#FFC42F', '#B57BFE'],\n\n  series: [\n    {\n      type: 'pie',\n      center: ['50%', '50%'],\n      itemStyle: {\n        borderRadius: 1,\n      },\n      data: state.pieData.length ? state.pieData : default_pieData,\n    },\n    {\n      type: 'pie',\n      center: ['50%', '50%'],\n      itemStyle: {\n        borderRadius: 1,\n      },\n      label: {\n        position: 'inner',\n        fontSize: 14,\n        // {b} 表示数据项的名称，{c} 表示数据项的值，{d} 表示数据项的百分比。\n        formatter: '{d}%'\n      },\n      data: state.pieData.length ? state.pieData : default_pieData,\n    },\n  ],\n}\n\n$props({\n  option,\n})\n\n$effect(() => {\n  $self.loading = true\n  // 真实接口替换\n  // fetch(`${ window.localStorage.getItem(\"env\")}/public/city?cityName=`, {\n  fetch(`http://81.70.235.200:3222/mock/136/pieData`, {\n    method: \"get\",\n    headers: {\n      Authorization: \"Bearer \" + window.localStorage.getItem(\"userToken\"),\n      Datarulecode: window.localStorage.getItem(\"maxDataruleCode\") || '',\n    },\n  })\n    .then((response) => response.json())\n    .then(\n      ({ data }) => {\n        state.pieData = data.pieDatas\n        $self.loading = false\n      },\n      () => {\n        $self.loading = false\n      }\n    )\n}, [])",
          },
        },
        'x-component-props': {
          style: {
            ...initStyle?.style,
            minHeight: '300px',
            minWidth: '400px',
            height: '400px',
            width: 'auto',
            borderStyle: 'none',
            padding: '8px 0',
          },
        },
        'x-decorator-props': {
          labelStyle: {
            ...initStyle?.labelStyle,
            width: '0px',
            padding: '0px',
          },
        },
      },
    },
  ],
})
