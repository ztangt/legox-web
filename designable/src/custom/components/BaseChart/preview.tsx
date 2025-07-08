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
export interface BaseChartProps {
  option: echarts.EChartsOption
}
export const BaseChart: DnFC<BaseChartProps> = observer((props) => {
  const chartRef = useRef<HTMLInputElement>(null)
  const [chart, setChart] = useState<echarts.ECharts>()

  const handleResize = () => {
    chart?.resize()
    console.log('======')
    console.log(chart)
  }

  const initChart = () => {
    if (chart) {
      window.removeEventListener('resize', handleResize)
      chart?.dispose()
    }
    const newChart = echarts?.init(chartRef?.current as HTMLElement)
    props?.option && newChart.setOption(props?.option, true)
    setChart(newChart)
    window.addEventListener('resize', handleResize)
  }

  useEffect(() => {
    props?.option && initChart()
  }, [props?.option])

  if (!props?.option) {
    return <div {...props}>基础图表（预览中查看效果）</div>
  } else {
    return <div ref={chartRef} {...props} />
  }
})

BaseChart.Behavior = createBehavior({
  name: 'BaseChart',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'BaseChart',
  designerProps: {
    propsSchema: creatPortalFieldSchema(AllSchemas.BaseChart),
  },
  designerLocales: AllLocales.BaseChart,
})

BaseChart.Resource = createResource({
  icon: <BarChartOutlined className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'BaseChart',
        'x-decorator': 'FormItem',
        'x-component': 'BaseChart',
        'x-reactions': {
          dependencies: [
            {
              property: 'value',
              type: 'any',
            },
          ],

          fulfill: {
            run:
              "const state = $observable({\n  pieData:[],\n  xData: [],\n  yData: []\n})\n\nvar option\n\n// 柱状图实例\noption = {\n  title: {\n    text: '柱形图',\n    left: 'left',\n    top: 'top',\n    textStyle: {\n      fontSize: 14,\n      fontWeight: 400,\n      color: '#333333',\n    },\n  },\n  legend: {\n    data: ['一级预警', '二级预警', '三级预警'],\n  },\n  xAxis: {\n    type: 'category',\n    data: [\n      '气象局A',\n      '气象局B',\n      '气象局C',\n      '气象局D',\n      '气象局E',\n      '气象局F',\n      '气象局G',\n    ],\n  },\n  yAxis: {\n    type: 'value',\n    splitLine: {\n      show: false,\n    },\n  },\n  tooltip: {\n    show: true,\n    trigger: 'axis',\n    axisPointer: {\n      // 坐标轴指示器，坐标轴触发有效\n      type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'\n    },\n  },\n  color: ['#00D3D7', '#FFC42F', '#4776FF', '#B57BFE'],\n  itemStyle: {\n    borderRadius: 4,\n  },\n  series: [\n    {\n      data: [120, 200, 150, 80, 70, 110, 130],\n      type: 'bar',\n      name: '一级预警',\n    },\n    {\n      data: [20, 100, 250, 10, 170, 210, 230],\n      type: 'bar',\n      name: '二级预警',\n    },\n    {\n      data: [20, 100, 250, 10, 170, 210, 230],\n      type: 'bar',\n      name: '三级预警',\n    },\n  ],\n}\n\n// 饼图实例\n// option = {\n//   title: {\n//     text: '饼状图',\n//     left: 'left',\n//     top: 'top',\n//     textStyle: {\n//       fontSize: 14,\n//       fontWeight: 400,\n//       color: '#333333',\n//     },\n//   },\n//   // 在无数据的时候显示一个占位圆。\n//   showEmptyCircle: true,\n//   tooltip: {\n//     trigger: 'item',\n//   },\n//   legend: {\n//     orient: 'vertical',\n//     right: 'right',\n//     top: 'center',\n//     // 使用回调函数\n//     formatter: function (name) {\n//       let data = option.series[0].data\n//       let total = 0\n//       let current = 0\n//       for (let i = 0; i < data.length; i++) {\n//         total += data[i].value\n//         if (data[i].name == name) {\n//           current = data[i].value\n//         }\n//       }\n//       let p = ((current / total) * 100).toFixed(2)\n//       return `${name}: ${current}个`\n//       // return `${name}: ${p}%`\n//     },\n//   },\n//   color: ['#00D3D7', '#FFC42F', '#4776FF', '#B57BFE'],\n//   series: [\n//     {\n//       name: '饼图',\n//       type: 'pie',\n//       // radius Array.<number|string>：数组的第一项是内半径，第二项是外半径\n//       radius: [25, 125],\n//       // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。支持设置成百分比，设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度。\n//       center: ['50%', '50%'],\n//       // 是否展示成南丁格尔图\n//       roseType: 'area',\n//       itemStyle: {\n//         borderRadius: 1,\n//       },\n//       label: {\n//         fontSize: 14,\n//         fontWeight: 400,\n//         color: '#333333',\n//       },\n//       data: [\n//         { value: 20, name: 'rosea' },\n//         { value: 30, name: 'roseb' },\n//         { value: 25, name: 'rosec' },\n//         { value: 25, name: 'rosed' },\n//       ],\n//       label: {\n//         show: true,\n//         // {b} 表示数据项的名称，{c} 表示数据项的值，{d} 表示数据项的百分比。\n//         // formatter: '{b} : {c} ({d}%)'\n//       },\n//     },\n//   ],\n// }\n\n$props({\n  option,\n})\n\n// $effect(()=>{\n//   $self.loading = true\n//   fetch(`${ window.localStorage.getItem(\"env\")}/public/city?cityName=`, {\n//     method: \"get\",\n//     headers: {\n//       // TODO   \"Bearer \" + window.localStorage.getItem(\"refreshToken\")!!!!\n//       Authorization:\n//         \"Bearer \" + window.localStorage.getItem(\"userToken\"),\n//     },\n//   })\n//     .then((response) => response.json())\n//     .then(\n//       ({ data }) => {\n//         var pieData = []\n//         var xData = []\n//         var yData = []\n//         data.list?.[0]?.children?.forEach((item) => {\n//           pieData.push({\n//             name: item.cityName,\n//             value: Number(item.cityId),\n//           })\n//           xData.push(item.cityName)\n//           yData.push(Number(item.cityId))\n//         })\n//         state.pieData = pieData\n//         state.yData = yData\n//         state.xData = xData\n//         $self.loading = false\n//         $self.dataSource = tmp\n//       },\n//       () => {\n//         $self.loading = false\n//       }\n//     )\n// },[])\n",
          },
        },
        'x-component-props': {
          style: {
            ...initStyle?.style,
            minHeight: '200px',
            minWidth: '200px',
            height: '400px',
            borderStyle: 'none',
          },
        },
        'x-decorator-props': {
          labelStyle: {
            ...initStyle?.labelStyle,
            width: '0px',
          },
        },
      },
    },
  ],
})
