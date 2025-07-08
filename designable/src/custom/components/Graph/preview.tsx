import { Input as FormilyInput } from '@/formily/antd'
import { Select, Modal, Input } from 'antd'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import { observer, useField, useFieldSchema, useForm } from '@formily/react'
import { useEffect, useRef } from 'react'
import { initStyle } from '../../../service/constant'
import { InputProps } from 'antd/lib/input'
import G6 from '@antv/g6'
import ReactDOM from 'react-dom'
import { Chart } from '@antv/g2'

interface ExtraProps extends InputProps {}
export const Graph: DnFC<ExtraProps> = observer((props) => {
  // const ref = useRef(null);
  // let graph = null;
  // const data = {
  //   nodes: [
  //     {
  //       id: '1',
  //       label: '公司1'
  //     },
  //     {
  //       id: '2',
  //       label: '公司2'
  //     },
  //     {
  //       id: '3',
  //       label: '公司3'
  //     },
  //     {
  //       id: '4',
  //       label: '公司4'
  //     },
  //     {
  //       id: '5',
  //       label: '公司5'
  //     },
  //     {
  //       id: '6',
  //       label: '公司6'
  //     },
  //     {
  //       id: '7',
  //       label: '公司7'
  //     },
  //     {
  //       id: '8',
  //       label: '公司8'
  //     },
  //     {
  //       id: '9',
  //       label: '公司9'
  //     }
  //   ],
  //   edges: [
  //     {
  //       source: '1',
  //       target: '2',
  //       data: {
  //         type: 'name1',
  //         amount: '100,000,000,00 元',
  //         date: '2019-08-03'
  //       }
  //     },
  //     {
  //       source: '1',
  //       target: '3',
  //       data: {
  //         type: 'name2',
  //         amount: '100,000,000,00 元',
  //         date: '2019-08-03'
  //       }
  //     },
  //     {
  //       source: '2',
  //       target: '5',
  //       data: {
  //         type: 'name1',
  //         amount: '100,000,000,00 元',
  //         date: '2019-08-03'
  //       }
  //     },
  //     {
  //       source: '5',
  //       target: '6',
  //       data: {
  //         type: 'name2',
  //         amount: '100,000,000,00 元',
  //         date: '2019-08-03'
  //       }
  //     },
  //     {
  //       source: '3',
  //       target: '4',
  //       data: {
  //         type: 'name3',
  //         amount: '100,000,000,00 元',
  //         date: '2019-08-03'
  //       }
  //     },
  //     {
  //       source: '4',
  //       target: '7',
  //       data: {
  //         type: 'name2',
  //         amount: '100,000,000,00 元',
  //         date: '2019-08-03'
  //       }
  //     },
  //     {
  //       source: '1',
  //       target: '8',
  //       data: {
  //         type: 'name2',
  //         amount: '100,000,000,00 元',
  //         date: '2019-08-03'
  //       }
  //     },
  //     {
  //       source: '1',
  //       target: '9',
  //       data: {
  //         type: 'name3',
  //         amount: '100,000,000,00 元',
  //         date: '2019-08-03'
  //       }
  //     }
  //   ]
  // };
  // useEffect(() => {
  //   if (!graph) {
  //     graph = new G6.Graph({
  //       container: ReactDOM.findDOMNode(ref.current),
  //       width: 1200,
  //       height: 800,
  //       modes: {
  //         default: ['drag-canvas'],
  //       },
  //       layout: {
  //         type: 'dagre',
  //         direction: 'LR',
  //       },
  //       defaultNode: {
  //         type: 'node',
  //         labelCfg: {
  //           style: {
  //             fill: '#000000A6',
  //             fontSize: 10,
  //           },
  //         },
  //         style: {
  //           stroke: '#72CC4A',
  //           width: 150,
  //         },
  //       },
  //       defaultEdge: {
  //         type: 'polyline',
  //       },
  //     });
  //   }
  //   graph.data(data);
  //   graph.render();
  // }, []);
  // return <div ref={ref}></div>;
  // 准备数据
  const data = [
    { genre: 'Sports', sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action', sold: 120 },
    { genre: 'Shooter', sold: 350 },
    { genre: 'Other', sold: 150 },
  ]

  // 初始化图表实例
  const chart = new Chart({
    container: document.getElementById('chart'),
  })

  // 声明可视化
  chart
    .interval() // 创建一个 Interval 标记
    .data(data || props?.data) // 绑定数据
    .encode('x', 'genre') // 编码 x 通道
    .encode('y', 'sold') // 编码 y 通道

  // 渲染可视化
  chart.render()
  return <div id="chart"></div>
})

Graph.Behavior = createBehavior({
  name: 'Graph',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Graph',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.NumberInput),
  },
  designerLocales: AllLocales.NumberInput,
})

Graph.Resource = createResource({
  icon: 'NumberPickerSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'NumberInput',
        'x-decorator': 'FormItem',
        'x-component': 'Graph',
        'x-component-props': {
          allowClear: true,
          style: {
            ...initStyle?.style,
            padding: '2px 11px 2px 11px',
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
