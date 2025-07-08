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
export interface PortalBarLandProps {
  option: echarts.EChartsOption
}
export const PortalBarLand: DnFC<PortalBarLandProps> = observer((props) => {
  const chartRef = useRef<HTMLInputElement>(null)
  const [chart, setChart] = useState<echarts.ECharts>()
  let defaultProps = {
    option: {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      // grid: {
      //   right: 8,
      //   bottom: 20,
      // },
      title: {
        text: '横向柱状图',
        left: 8,
        top: 0,
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#333333',
        },
      },
      legend: {
        top: 20, // 图例组件位置  按需自行修改
        textStyle: {
          fontSize: 14,
        },
      },

      xAxis: {
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLine: { show: false }, //不显示坐标轴
        axisTick: {
          show: false, //不显示坐标轴刻度线
        },
      },
      yAxis: {
        type: 'category',
        data: ['部门A', '部门B', '部门C', '部门D', '部门E', '部门F'],
        splitLine: {
          show: false,
        },
        axisLine: { show: false }, //不显示坐标轴
        axisTick: {
          show: false, //不显示坐标轴刻度线
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
      tooltip: {
        show: true,
      },
      color: ['#4776FF', '#00D3D7', '#FFC42F', '#B57BFE'],
      itemStyle: {
        borderRadius: 4,
      },
      series: [
        {
          data: [120, 200, 150, 110, 120, 165],
          type: 'bar',
          name: '数据1',
          barWidth: 20,
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
      console.log(params)
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

  return <div className={styles.bar} ref={chartRef} {...props} />
})

PortalBarLand.Behavior = createBehavior({
  name: 'PortalBarLand',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'PortalBarLand',
  designerProps: {
    propsSchema: creatPortalFieldSchema(AllSchemas.PortalBarLand),
  },
  designerLocales: AllLocales.PortalBarLand,
})

PortalBarLand.Resource = createResource({
  icon: <BarChartOutlined className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'PortalBarLand',
        'x-decorator': 'FormItem',
        'x-component': 'PortalBarLand',
        'x-reactions': {
          dependencies: [
            {
              property: 'value',
              type: 'any',
            },
          ],

          fulfill: {
            run:
              "// 例子：（柱子）各项目种类数量变化趋势\n// 默认展示数据\nvar default_xData = ['部门A', '部门B', '部门C', '部门D', '部门E', '部门F'];\nvar default_yData = [\n    {\n      data: [120, 200, 150, 110, 120, 165],\n      type: 'bar',\n      name: '数据1',\n      barWidth: 20,\n    }\n  ];\nconst state = $observable({\n  // 默认展示数据\n  xData: [],\n  yData: [],\n})\n\nvar option\n\n// 柱状图实例\noption = {\n  grid: {\n    left: '3%',\n    right: '4%',\n    bottom: '3%',\n    containLabel: true\n  },\n  // grid: {\n  //   right: 8,\n  //   bottom: 20,\n  // },\n  title: {\n    text: '各项目种类数量变化趋势',\n    left: 8,\n    top: 0,\n    textStyle: {\n      fontSize: 16,\n      fontWeight: 'bold',\n      color: '#333333',\n    },\n  },\n  legend: {\n    top: 20,   // 图例组件位置  按需自行修改\n    textStyle: {\n      fontSize: 14,\n    },\n  },\n\n  xAxis: {\n    type: 'value',\n    splitLine: {\n      show: false,\n    },\n    axisLine: { show: false },//不显示坐标轴\n    axisTick: {\n      show: false,//不显示坐标轴刻度线\n    },\n  },\n  yAxis: {\n    type: 'category',\n    data:  state.xData.length ? state.xData : default_xData,\n    splitLine: {\n      show: false,\n    },\n    axisLine: { show: false },//不显示坐标轴\n    axisTick: {\n      show: false,//不显示坐标轴刻度线\n    },\n  },\n  toolbox: {\n    show: true,\n    feature: {\n      restore: {\n        show: true, title: '刷新',\n        emphasis: {\n          iconStyle: {\n            borderColor: '#40a9ff'\n          }\n        }\n      },\n\n    },\n  },\n  tooltip: {\n    show: true,\n  },\n  color: ['#4776FF', '#00D3D7', '#FFC42F', '#B57BFE'],\n  itemStyle: {\n    borderRadius: 4,\n  },\n  series: state.yData.length ? state.yData : default_yData,\n}\n$props({\n  option,\n})\n\n$effect(() => {\n  $self.loading = true\n  // 真实接口替换\n  // fetch(`${ window.localStorage.getItem(\"env\")}/public/city?cityName=`, {\n  fetch(`http://81.70.235.200:3222/mock/136/barData001`, {\n    method: \"get\",\n    headers: {\n      Authorization: \"Bearer \" + window.localStorage.getItem(\"userToken\"),\n      Datarulecode: window.localStorage.getItem(\"maxDataruleCode\") || '',\n    },\n  })\n    .then((response) => response.json())\n    .then(\n      ({ data }) => {\n        data.ydatas.forEach((item, index) => {\n          item.type = 'bar';\n          item.barWidth = '20px';\n          item.name = item.yname;\n          item.data = item.ydata;\n        });\n\n        state.xData = data.xnames;\n        state.yData = data.ydatas\n        $self.loading = false\n      },\n      () => {\n        $self.loading = false\n      }\n    )\n}, [])",
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
