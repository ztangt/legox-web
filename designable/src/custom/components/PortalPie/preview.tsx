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
export interface PortalPieProps {
  option: echarts.EChartsOption
}
export const PortalPie: DnFC<PortalPieProps> = observer((props) => {
  const chartRef = useRef<HTMLInputElement>(null)
  const [chart, setChart] = useState<echarts.ECharts>()
  let defaultProps = {
    option: {
      title: {
        text: '饼状图',
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
        top: 25,
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

      series: [
        {
          name: '饼图',
          type: 'pie',
          // radius Array.<number|string>：数组的第一项是内半径，第二项是外半径
          radius: [55, 125],
          // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。支持设置成百分比，设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度。
          center: ['50%', '60%'],
          // 是否展示成南丁格尔图
          roseType: 'area',
          itemStyle: {
            borderRadius: 1,
          },

          label: {
            show: false,
            position: 'center',
            // {b} 表示数据项的名称，{c} 表示数据项的值，{d} 表示数据项的百分比。
            // formatter: '{b} : {c} ({d}%)'
          },
          data: [
            { value: 2020, name: '数据1' },
            { value: 2021, name: '数据2' },
            { value: 2002, name: '数据3' },
            { value: 2320, name: '数据4' },
          ],
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

PortalPie.Behavior = createBehavior({
  name: 'PortalPie',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'PortalPie',
  designerProps: {
    propsSchema: creatPortalFieldSchema(AllSchemas.PortalPie),
  },
  designerLocales: AllLocales.PortalPie,
})

PortalPie.Resource = createResource({
  icon: <BarChartOutlined className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'PortalPie',
        'x-decorator': 'FormItem',
        'x-component': 'PortalPie',
        'x-reactions': {
          dependencies: [
            {
              property: 'value',
              type: 'any',
            },
          ],

          fulfill: {
            run:
              "// 默认展示数据\nvar default_pieData = [\n    { value: 2020, name: '数据1' },\n    { value: 2021, name: '数据2' },\n    { value: 2002, name: '数据3' },\n    { value: 2320, name: '数据4' },\n  ];\n\nconst state = $observable({\n  pieData: [],\n})\n\nvar option\n\noption = {\n  title: {\n    text: '饼状图',\n    left: 16,\n    top: 0,\n    textStyle: {\n      fontSize: 16,\n      fontWeight: 'bold',\n      color: '#333333',\n    },\n  },\n  toolbox: {\n    show: true,\n    feature: {\n      restore: {\n        show: true, title: '刷新', emphasis: {\n          iconStyle: {\n            borderColor: '#40a9ff'\n          }\n        }\n      },\n    },\n  },\n  // 在无数据的时候显示一个占位圆。\n  showEmptyCircle: true,\n  tooltip: {\n    trigger: 'item',\n  },\n  legend: {\n    // orient: 'vertical',\n    // right: 'right',\n    top: 25,\n    // itemGap: 24,\n    textStyle: {\n      fontSize: 14,\n    },\n    // 使用回调函数\n    formatter: function (name) {\n      let data = option.series[0].data\n      let total = 0\n      let current = 0\n      for (let i = 0; i < data.length; i++) {\n        total += data[i].value\n        if (data[i].name == name) {\n          current = data[i].value\n        }\n      }\n      let p = ((current / total) * 100).toFixed(2)\n      return `${name}: ${current}个`\n      // return `${name}: ${p}%`\n    },\n  },\n  color: ['#4776FF', '#00D3D7', '#FFC42F', '#B57BFE'],\n\n  series: [\n    {\n      name: '饼图',\n      type: 'pie',\n      // radius Array.<number|string>：数组的第一项是内半径，第二项是外半径\n      radius: [55, 105],\n      // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。支持设置成百分比，设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度。\n      center: ['50%', '60%'],\n      // 是否展示成南丁格尔图\n      roseType: 'area',\n      itemStyle: {\n        borderRadius: 1,\n      },\n\n      label: {\n        show: false,\n        position: 'center'\n        // {b} 表示数据项的名称，{c} 表示数据项的值，{d} 表示数据项的百分比。\n        // formatter: '{b} : {c} ({d}%)'\n      },\n      data: state.pieData.length ? state.pieData : default_pieData,\n    },\n  ],\n}\n\n$props({\n  option,\n})\n\n$effect(() => {\n  $self.loading = true\n  // 真实接口替换\n  // fetch(`${ window.localStorage.getItem(\"env\")}/public/city?cityName=`, {\n  fetch(`http://81.70.235.200:3222/mock/136/pieData`, {\n    method: \"get\",\n    headers: {\n      Authorization: \"Bearer \" + window.localStorage.getItem(\"userToken\"),\n      Datarulecode: window.localStorage.getItem(\"maxDataruleCode\") || '',\n    },\n  })\n    .then((response) => response.json())\n    .then(\n      ({ data }) => {\n        state.pieData = data.pieDatas\n        $self.loading = false\n      },\n      () => {\n        $self.loading = false\n      }\n    )\n}, [])\n",
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
