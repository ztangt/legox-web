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
export interface PortalBarStackedProps {
  option: echarts.EChartsOption
}
export const PortalBarStacked: DnFC<PortalBarStackedProps> = observer(
  (props) => {
    const chartRef = useRef<HTMLInputElement>(null)
    const [chart, setChart] = useState<echarts.ECharts>()
    let defaultProps = {
      option: {
        grid: {
          right: 8,
          bottom: 20,
        },
        title: {
          text: '堆叠柱状图',
          left: 8,
          top: 0,
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333333',
          },
        },
        legend: {
          top: 25, // 图例组件位置  按需自行修改
          textStyle: {
            fontSize: 10,
          },
        },
        xAxis: {
          type: 'category',
          data: ['部门A', '部门B', '部门C', '部门D', '部门E', '部门F'],
        },
        yAxis: {
          type: 'value',
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
          trigger: 'axis',
          // axisPointer: {
          //   // 坐标轴指示器，坐标轴触发有效
          //   type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          // },
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999',
            },
          },
        },
        color: ['#4776FF', '#00D3D7', '#FFC42F', '#B57BFE'],
        // itemStyle: {
        //   borderRadius: 4,
        // },
        series: [
          {
            name: '项目1',
            type: 'bar',
            stack: 'Ad',
            barWidth: 20,
            data: [120, 132, 101, 134, 90, 230],
          },
          {
            name: '项目2',
            type: 'bar',
            stack: 'Ad',
            barWidth: 20,
            data: [120, 132, 101, 134, 90, 230],
          },
          {
            name: '项目3',
            type: 'bar',
            stack: 'Ad',
            barWidth: 20,
            data: [120, 132, 101, 134, 90, 230],
          },
          {
            name: '项目4',
            type: 'bar',
            stack: 'Ad',
            barWidth: 20,
            data: [120, 132, 101, 134, 90, 230],
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
  }
)

PortalBarStacked.Behavior = createBehavior({
  name: 'PortalBarStacked',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'PortalBarStacked',
  designerProps: {
    propsSchema: creatPortalFieldSchema(AllSchemas.PortalBarStacked),
  },
  designerLocales: AllLocales.PortalBarStacked,
})

PortalBarStacked.Resource = createResource({
  icon: <BarChartOutlined className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'PortalBarStacked',
        'x-decorator': 'FormItem',
        'x-component': 'PortalBarStacked',
        'x-reactions': {
          dependencies: [
            {
              property: 'value',
              type: 'any',
            },
          ],

          fulfill: {
            run:
              "// 例子：（堆叠柱子）前十主管单位项目数量详情\n// 默认展示数据\nvar default_xData = ['部门A', '部门B', '部门C', '部门D', '部门E', '部门F'];\nvar default_yData = [\n    {\n      name: '项目1',\n      type: 'bar',\n      stack: 'Ad',\n      barWidth: 20,\n      data: [120, 132, 101, 134, 90, 230]\n    },\n    {\n      name: '项目2',\n      type: 'bar',\n      stack: 'Ad',\n      barWidth: 20,\n      data: [120, 132, 101, 134, 90, 230]\n    },\n    {\n      name: '项目3',\n      type: 'bar',\n      stack: 'Ad',\n      barWidth: 20,\n      data: [120, 132, 101, 134, 90, 230]\n    },\n    {\n      name: '项目4',\n      type: 'bar',\n      stack: 'Ad',\n      barWidth: 20,\n      data: [120, 132, 101, 134, 90, 230]\n    }\n  ];\nconst state = $observable({\n  // 默认展示数据\n  xData: ['部门A', '部门B', '部门C', '部门D', '部门E', '部门F'],\n  yData: [],\n})\n\nvar option\n\n// 柱状图实例\noption = {\n  grid: {\n    right: 8,\n    bottom: 20,\n  },\n  title: {\n    text: '前十主管单位项目数量详情',\n    left: 8,\n    top: 0,\n    textStyle: {\n      fontSize: 16,\n      fontWeight: 'bold',\n      color: '#333333',\n    },\n  },\n  legend: {\n    top: 25,   // 图例组件位置  按需自行修改\n    textStyle: {\n      fontSize: 10,\n    },\n  },\n  xAxis: {\n    type: 'category',\n    data: state.xData.length ? state.xData : default_xData,\n  },\n  yAxis: {\n    type: 'value',\n  },\n  toolbox: {\n    show: true,\n    feature: {\n      restore: {\n        show: true, title: '刷新',\n        emphasis: {\n          iconStyle: {\n            borderColor: '#40a9ff'\n          }\n        }\n      },\n\n    },\n  },\n  tooltip: {\n    show: true,\n    trigger: 'axis',\n    axisPointer: {\n      type: 'cross',\n      crossStyle: {\n        color: '#999'\n      }\n    }\n  },\n  color: ['#4776FF', '#00D3D7', '#FFC42F', '#B57BFE'],\n  series: state.yData.length ? state.yData : default_yData,\n}\n$props({\n  option,\n})\n\n$effect(() => {\n  $self.loading = true\n  // 真实接口替换\n  // fetch(`${ window.localStorage.getItem(\"env\")}/public/city?cityName=`, {\n  fetch(`http://81.70.235.200:3222/mock/136/barData003`, {\n    method: \"get\",\n    headers: {\n      Authorization: \"Bearer \" + window.localStorage.getItem(\"userToken\"),\n      Datarulecode: window.localStorage.getItem(\"maxDataruleCode\") || '',\n    },\n  })\n    .then((response) => response.json())\n    .then(\n      ({ data }) => {\n        data.ydatas.forEach((item, index) => {\n          item.type = 'bar';\n          item.stack = 'top',\n          item.barWidth = '20px';\n          item.name = item.yname;\n          item.data = item.ydata;\n        });\n\n        state.xData = data.xnames;\n        state.yData = data.ydatas\n        $self.loading = false\n      },\n      () => {\n        $self.loading = false\n      }\n    )\n}, [])",
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
