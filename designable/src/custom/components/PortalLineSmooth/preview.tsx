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
export interface PortalLineSmoothProps {
  option: echarts.EChartsOption
}
export const PortalLineSmooth: DnFC<PortalLineSmoothProps> = observer(
  (props) => {
    const chartRef = useRef<HTMLInputElement>(null)
    const [chart, setChart] = useState<echarts.ECharts>()
    let defaultProps = {
      option: {
        title: {
          text: '曲线折线图',
          left: 'left',
          top: 'top',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333333',
          },
        },
        color: ['#4776FF', '#00D3D7', '#FFC42F', '#B57BFE'],
        xAxis: {
          type: 'category',
          data: ['年度A', '年度B', '年度C', '年度D', '年度E', '年度F'],
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
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true,
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

    return <div className={styles.line} ref={chartRef} {...props} />
  }
)

PortalLineSmooth.Behavior = createBehavior({
  name: 'PortalLineSmooth',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'PortalLineSmooth',
  designerProps: {
    propsSchema: creatPortalFieldSchema(AllSchemas.PortalLineSmooth),
  },
  designerLocales: AllLocales.PortalLineSmooth,
})

PortalLineSmooth.Resource = createResource({
  icon: <BarChartOutlined className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'PortalLineSmooth',
        'x-decorator': 'FormItem',
        'x-component': 'PortalLineSmooth',
        'x-reactions': {
          dependencies: [
            {
              property: 'value',
              type: 'any',
            },
          ],
          fulfill: {
            run:
              "var default_xData = ['年度A','年度B','年度C','年度D','年度E','年度F'];\nvar default_yData = [\n    {\n      data: [820, 932, 901, 934, 1290, 1330, 1320],\n      type: 'line',\n      smooth: true,\n    }\n  ];\nconst state = $observable({\n  // 默认展示数据\n  xData: [],\n  yData: [],\n  titleText: '近年项目数量变化情况'\n})\n\nvar option\n\n// 曲线折线图实例\noption = {\n  grid: {\n    right: 8,\n    bottom: 20,\n  },\n  title: {\n    text: state.titleText,\n    subtext: \"单位：万元\",\n    left: 8,\n    top: 0,\n    textStyle: {\n      fontSize: 16,\n      fontWeight: 'bold',\n      color: '#333333',\n    },\n  },\n  legend: {\n    top: 20,   // 图例组件位置  按需自行修改\n    textStyle: {\n      fontSize: 14,\n    },\n  },\n  xAxis: {\n    type: 'category',\n    data: state.xData.length ? state.xData: default_xData,\n  },\n  yAxis: {\n    type: 'value',\n  },\n  toolbox: {\n    show: true,\n    feature: {\n      restore: {\n        show: true, title: '刷新',\n        emphasis: {\n          iconStyle: {\n            borderColor: '#40a9ff'\n          }\n        }\n      },\n\n    },\n  },\n  tooltip: {\n    show: true,\n    trigger: 'axis',\n    // axisPointer: {\n    //   // 坐标轴指示器，坐标轴触发有效\n    //   type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'\n    // },\n    axisPointer: {\n      type: 'cross',\n      crossStyle: {\n        color: '#999'\n      }\n    }\n  },\n  color: ['#4776FF', '#00D3D7', '#FFC42F', '#B57BFE'],\n  itemStyle: {\n    borderRadius: 4,\n  },\n  series: state.yData.length ? state.yData: default_yData,\n}\n$props({\n  option,\n})\n\n$effect(() => {\n  // TODO startYear&endYear req\n  const currentYear = new Date().getFullYear()\n  let startYear = $values['SJD'] ? $values['SJD'][0]['_d'].getFullYear() : currentYear - 4;\n  let endYear = $values['SJD'] ? $values['SJD'][1]['_d'].getFullYear() : currentYear;\n  let rangeYear = endYear - startYear + 1;\n\n  $self.loading = true\n  // 真实接口替换\n  // fetch(`${ window.localStorage.getItem(\"env\")}/public/city?cityName=`, {\n  fetch(`http://81.70.235.200:3222/mock/136/LineData`, {\n    method: \"get\",\n    headers: {\n      Authorization: \"Bearer \" + window.localStorage.getItem(\"userToken\"),\n      Datarulecode: window.localStorage.getItem(\"maxDataruleCode\") || '',\n    },\n  })\n    .then((response) => response.json())\n    .then(\n      ({ data }) => {\n        data.ydatas.forEach((item) => {\n          item.type = 'line';\n          item.smooth = true;\n          item.name = item.yname;\n          item.data = item.ydata;\n        });\n\n        state.xData = data.xnames;\n        state.yData = data.ydatas\n        state.titleText = `近${rangeYear}年项目数量变化情况`\n\n        $self.loading = false\n      },\n      () => {\n        state.titleText = `近${rangeYear}年项目数量变化情况`\n        $self.loading = false\n      }\n    )\n}, [$values['YCZD']])\n\n",
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
