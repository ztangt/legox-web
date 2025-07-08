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
export interface PortalPieHollowProps {
  option: echarts.EChartsOption
}
export const PortalPieHollow: DnFC<PortalPieHollowProps> = observer((props) => {
  const chartRef = useRef<HTMLInputElement>(null)
  const [chart, setChart] = useState<echarts.ECharts>()
  const pieData = [
    { value: 20, name: '数据1' },
    { value: 10, name: '数据2' },
    { value: 22, name: '数据3' },
    { value: 12, name: '数据4' },
  ]
  let defaultProps = {
    option: {
      title: {
        text: '空心饼状图',
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
      legend: {
        orient: 'vertical',
        right: 'right',
        top: 'center',
        icon: 'circle',
        itemGap: 24,
        textStyle: {
          fontSize: 14,
        },
        // 使用回调函数
        formatter: function (name) {
          let data = defaultProps.option.series[0].data
          let total = 0
          let current = 0
          for (let i = 0; i < data.length; i++) {
            total += data[i].value
            if (data[i].name == name) {
              current = data[i].value
            }
          }
          let p = ((current / total) * 100).toFixed(2)
          return `${name}: ${current}个`
          // return `${name}: ${p}%`
        },
      },
      color: ['#4776FF', '#00D3D7', '#FFC42F', '#B57BFE'],
      graphic: [
        {
          type: 'text',
          left: '25%',
          top: '45%',
          z: 10,
          style: {
            fill: '#1a1a1a',
            text: ['总项目数量', '64'].join('\n\n'), //实现两文本上下换行的效果
            textAlign: 'center',
          },
        },
      ],
      series: [
        {
          name: '在建项目',
          type: 'pie',
          radius: [55, 125],
          center: ['30%', '50%'],
          itemStyle: {
            borderRadius: 1,
          },
          label: {
            position: 'inner',
            fontSize: 14,
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

PortalPieHollow.Behavior = createBehavior({
  name: 'PortalPieHollow',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'PortalPieHollow',
  designerProps: {
    propsSchema: creatPortalFieldSchema(AllSchemas.PortalPieHollow),
  },
  designerLocales: AllLocales.PortalPieHollow,
})

PortalPieHollow.Resource = createResource({
  icon: <BarChartOutlined className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'PortalPieHollow',
        'x-decorator': 'FormItem',
        'x-component': 'PortalPieHollow',
        'x-reactions': {
          dependencies: [
            {
              property: 'value',
              type: 'any',
            },
          ],

          fulfill: {
            run:
              "// 例子：（空心儿饼图）各阶段项目数量情况\nconst state = $observable({\n  // 默认展示数据\n  pieData: [\n    { value: 2, name: '数据1' },\n    { value: 4, name: '数据2' },\n    { value: 6, name: '数据3' },\n    { value: 8, name: '数据4' },\n  ],\n  count: 0,\n})\n\nvar option\n\noption = {\n  title: {\n    text: '各阶段项目数量情况',\n    left: 8,\n    top: 0,\n    textStyle: {\n      fontSize: 16,\n      fontWeight: 'bold',\n      color: '#333333',\n    },\n  },\n  toolbox: {\n    show: true,\n    feature: {\n      restore: {\n        show: true, title: '刷新', emphasis: {\n          iconStyle: {\n            borderColor: '#40a9ff'\n          }\n        }\n      },\n    },\n  },\n  // 在无数据的时候显示一个占位圆。\n  showEmptyCircle: true,\n  tooltip: {\n    trigger: 'item',\n  },\n  legend: {\n    orient: 'vertical',\n    right: 'right',\n    top: 'center',\n    icon: 'circle',\n    itemGap: 24,\n    textStyle: {\n      fontSize: 14,\n    },\n    // 使用回调函数\n    formatter: function (name) {\n      let data = option.series[0].data\n      let total = 0\n      let current = 0\n      for (let i = 0; i < data.length; i++) {\n        total += data[i].value\n        if (data[i].name == name) {\n          current = data[i].value\n        }\n      }\n      let p = ((current / total) * 100).toFixed(2)\n      return `${name}: ${current}个`\n      // return `${name}: ${p}%`\n    },\n  },\n  color: ['#4776FF', '#00D3D7', '#FFC42F', '#B57BFE'],\n  graphic: [{\n    type: 'text',\n    left: '25%',\n    top: '45%',\n    z: 10,\n    style: {\n      fill: '#1a1a1a',\n      text: [\n        '总项目数量',\n        state.count\n      ].join('\\n\\n'),//实现两文本上下换行的效果\n      textAlign: 'center',\n    }\n  }],\n\n  series: [\n    {\n      name: '在建项目',\n      type: 'pie',\n      radius: [55, 125],\n      center: ['30%', '50%'],\n      itemStyle: {\n        borderRadius: 1,\n      },\n\n      label: {\n        position: 'inner',\n        fontSize: 14,\n        formatter: '{d}%'\n      },\n      data: state.pieData,\n    },\n  ],\n}\n\n$props({\n  option,\n})\n\n$effect(() => {\n  $self.loading = true\n  // 真实接口替换\n  // fetch(`${ window.localStorage.getItem(\"env\")}/public/city?cityName=`, {\n  fetch(`http://81.70.235.200:3222/mock/136/pieData`, {\n    method: \"get\",\n    headers: {\n      Authorization: \"Bearer \" + window.localStorage.getItem(\"userToken\"),\n      Datarulecode: window.localStorage.getItem(\"maxDataruleCode\") || '',\n    },\n  })\n    .then((response) => response.json())\n    .then(\n      ({ data }) => {\n        state.pieData = data.pieDatas\n        let count = 0\n        data.pieDatas?.forEach((item) => {\n          count = count + item.value\n        })\n        state.count = count\n        $self.loading = false\n      },\n      () => {\n        let count = 0\n        state.pieData.forEach((item) => {\n          count = count + item.value\n        })\n        state.count = count\n        $self.loading = false\n      }\n    )\n\n}, [])\n",
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
