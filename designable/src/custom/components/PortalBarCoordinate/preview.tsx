import { creatPortalFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { BarChartOutlined } from '@ant-design/icons'
import { observer } from '@formily/react'
import * as echarts from 'echarts'
import { useEffect, useRef, useState } from 'react'
import { DEFAULT_COLOR_LIST, initStyle } from '../../../service/constant'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import styles from './index.less'
export interface PortalBarCoordinateProps {
  option: echarts.EChartsOption
}
export const PortalBarCoordinate: DnFC<PortalBarCoordinateProps> = observer(
  (props) => {
    const chartRef = useRef<HTMLInputElement>(null)
    const [chart, setChart] = useState<echarts.ECharts>()
    let defaultProps = {
      option: {
        title: [
          {
            text: '极坐标柱状图',
          },
        ],
        color: DEFAULT_COLOR_LIST,
        polar: {
          radius: [30, '80%'],
        },
        radiusAxis: {
          max: 150,
        },
        angleAxis: {
          type: 'category',
          data: ['部门A', '部门B', '部门C', '部门D', '部门E', '部门F'],
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
        tooltip: {},
        series: {
          type: 'bar',
          data: [
            {
              itemStyle: {
                color: DEFAULT_COLOR_LIST[0],
              },
              value: 120,
            },
            {
              itemStyle: {
                color: DEFAULT_COLOR_LIST[1],
              },
              value: 100,
            },
            {
              itemStyle: {
                color: DEFAULT_COLOR_LIST[2],
              },
              value: 150,
            },
            {
              itemStyle: {
                color: DEFAULT_COLOR_LIST[3],
              },
              value: 110,
            },
            {
              itemStyle: {
                color: DEFAULT_COLOR_LIST[4],
              },
              value: 120,
            },
            {
              itemStyle: {
                color: DEFAULT_COLOR_LIST[5],
              },
              value: 112,
            },
          ],
          coordinateSystem: 'polar',
          label: {
            show: true,
            position: 'middle',
            formatter: '{b}: {c}',
          },
        },
        animation: false,
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

PortalBarCoordinate.Behavior = createBehavior({
  name: 'PortalBarCoordinate',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'PortalBarCoordinate',
  designerProps: {
    propsSchema: creatPortalFieldSchema(AllSchemas.PortalBarCoordinate),
  },
  designerLocales: AllLocales.PortalBarCoordinate,
})

PortalBarCoordinate.Resource = createResource({
  icon: <BarChartOutlined className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'PortalBarCoordinate',
        'x-decorator': 'FormItem',
        'x-component': 'PortalBarCoordinate',
        'x-reactions': {
          dependencies: [
            {
              property: 'value',
              type: 'any',
            },
          ],

          fulfill: {
            run:
              "// 3.例子：（圆形坐标系柱子）各类建设性质项目数量变化趋势\n// 默认展示数据\nvar default_xData = ['部门A', '部门B', '部门C', '部门D', '部门E', '部门F'];\nvar default_yData = [120, 100, 150, 110, 120, 15];\nconst state = $observable({\n  // 默认展示数据\n  xData: [],\n  yData: [],\n  maxCount: 150,\n})\n\nvar option\n\n// 柱状图实例\noption = {\n  title: [\n    {\n      text: '各类建设性质项目数量变化趋势'\n    }\n  ],\n  color:\n    [\n      '#4776FF',\n      '#00D3D7',\n      '#FFC42F',\n      '#8772FB',\n      '#FF80B0',\n      '#FF6531',\n      '#1DBC9C',\n      '#708590',\n      '#C5CDD4',\n      '#DB9420',\n    ],\n  polar: {\n    radius: [30, '80%']\n  },\n  radiusAxis: {\n    max: state.maxCount,\n  },\n  angleAxis: {\n    type: 'category',\n    data: state.xData.length ? state.xData : default_xData,\n    startAngle: 90\n  },\n  toolbox: {\n    show: true,\n    feature: {\n      restore: {\n        show: true,\n        title: '刷新',\n        emphasis: {\n          iconStyle: {\n            borderColor: '#40a9ff',\n          },\n        },\n      },\n    },\n  },\n  tooltip: {},\n  series: {\n    type: 'bar',\n    data: state.yData.length ? state.yData : default_yData,\n    coordinateSystem: 'polar',\n    label: {\n      show: true,\n      position: 'middle',\n      formatter: '{b}: {c}'\n    }\n  },\n  animation: false\n};\n\n$props({\n  option,\n})\n\n$effect(() => {\n  $self.loading = true\n  // 真实接口替换\n  // fetch(`${ window.localStorage.getItem(\"env\")}/public/city?cityName=`, {\n  fetch(`http://81.70.235.200:3222/mock/136/barData002`, {\n    method: \"get\",\n    headers: {\n      Authorization: \"Bearer \" + window.localStorage.getItem(\"userToken\"),\n      Datarulecode: window.localStorage.getItem(\"maxDataruleCode\") || '',\n    },\n  })\n    .then((response) => response.json())\n    .then(\n      ({ data }) => {\n        let arr = []\n        data.ydatas.forEach((item, index) => {\n          arr.push({\n            value: item,\n            itemStyle: {\n              color: option.color[index % 10]\n            }\n          })\n        })\n        state.xData = data.xnames;\n        state.yData = arr;\n        // 使用 Math.max() 方法取最大值\n        state.maxCount = Math.max.apply(null, data.ydatas);\n        $self.loading = false\n      },\n      () => {\n        // 为了让有默认数据 cdxb\n        let arr = []\n        default_yData.forEach((item, index) => {\n          arr.push({\n            value: item,\n            itemStyle: {\n              color: option.color[index % 10]\n            }\n          })\n        })\n        state.yData = arr;\n        $self.loading = false\n        $self.loading = false\n      }\n    )\n}, [])\n",
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
