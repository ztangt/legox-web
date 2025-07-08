// 1.例子：（柱子） 带平均值折线的柱形图表
const state = $observable({
  xData: [],
  yData: [],
})

var option

// 柱状图实例
option = {
  grid: {
    right: 8,
    bottom: 20,
  },
  title: {
    text: '柱形图',
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
    type: 'category',
    data: state.xData,
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: false,
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
  itemStyle: {
    borderRadius: 4,
  },
  series: state.yData,
}
$props({
  option,
})

$effect(() => {
  $self.loading = true
  // fetch(`${ window.localStorage.getItem("env")}/public/city?cityName=`, {
  fetch(`http://81.70.235.200:3222/mock/136/barData`, {
    method: 'get',
  })
    .then((response) => response.json())
    .then(
      ({ data }) => {
        data.ydatas.forEach((item, index) => {
          if (index === data.ydatas.length - 1) {
            item.type = 'line'
            item.symbolSize = 0
            item.endLabel = {
              show: true,
              formatter: function (params) {
                return params.value[0]
              },
            }
            item.lineStyle = {
              color: '#FFC42F',
              width: 1,
              type: 'dashed',
            }
          } else {
            item.type = 'bar'
          }
          item.barWidth = '20px'
          item.name = item.yname
          item.data = item.ydata
        })
        console.log('data.ydatas', data.ydatas)

        state.xData = data.xnames
        state.yData = data.ydatas
        $self.loading = false
      },
      () => {
        $self.loading = false
      }
    )
}, [])

// // 2.例子：（柱子）各项目种类数量变化趋势
// const state = $observable({
//   xData: [],
//   yData: []
// })

// var option

// // 柱状图实例
// option = {
//   grid: {
//     left: '3%',
//     right: '4%',
//     bottom: '3%',
//     containLabel: true
//   },
//   // grid: {
//   //   right: 8,
//   //   bottom: 20,
//   // },
//   title: {
//     text: '各项目种类数量变化趋势',
//     left: 8,
//     top: 0,
//     textStyle: {
//       fontSize: 16,
//       fontWeight: 'bold',
//       color: '#333333',
//     },
//   },
//   legend: {
//     top: 20,   // 图例组件位置  按需自行修改
//     textStyle: {
//       fontSize: 14,
//     },
//   },

//   xAxis: {
//     type: 'value',
//     splitLine: {
//       show: false,
//     },
//     axisLine: { show: false },//不显示坐标轴
//     axisTick: {
//       show: false,//不显示坐标轴刻度线
//     },
//   },
//   yAxis: {
//     type: 'category',
//     data: state.xData,
//     splitLine: {
//       show: false,
//     },
//     axisLine: { show: false },//不显示坐标轴
//     axisTick: {
//       show: false,//不显示坐标轴刻度线
//     },
//   },
//   toolbox: {
//     show: true,
//     feature: {
//       restore: {
//         show: true, title: '刷新',
//         emphasis: {
//           iconStyle: {
//             borderColor: '#40a9ff'
//           }
//         }
//       },

//     },
//   },
//   tooltip: {
//     show: true,
//   },
//   color: ['#4776FF', '#00D3D7', '#FFC42F', '#B57BFE'],
//   itemStyle: {
//     borderRadius: 4,
//   },
//   series: state.yData,
// }
// $props({
//   option,
// })

// $effect(() => {
//   $self.loading = true
//   // fetch(`${ window.localStorage.getItem("env")}/public/city?cityName=`, {
//   fetch(`http://81.70.235.200:3222/mock/136/barData001`, {
//     method: "get",
//   })
//     .then((response) => response.json())
//     .then(
//       ({ data }) => {
//         data.ydatas.forEach((item, index) => {
//           item.type = 'bar';
//           item.barWidth = '20px';
//           item.name = item.yname;
//           item.data = item.ydata;
//         });

//         state.xData = data.xnames;
//         state.yData = data.ydatas
//         $self.loading = false
//       },
//       () => {
//         $self.loading = false
//       }
//     )
// }, [])

// // 3.例子：（圆形坐标系柱子）各类建设性质项目数量变化趋势
// const state = $observable({
//   xData: [],
//   yData: [],
//   maxCount: 10,
// })

// var option

// // 柱状图实例
// option = {
//   title: [
//     {
//       text: '各类建设性质项目数量变化趋势'
//     }
//   ],
//   color: ['#4776FF', '#00D3D7', '#FFC42F', '#B57BFE'],
//   polar: {
//     radius: [30, '80%']
//   },
//   radiusAxis: {
//     max: state.maxCount,
//   },
//   angleAxis: {
//     type: 'category',
//     data: state.xData,
//     startAngle: 90
//   },
//   tooltip: {},
//   series: {
//     type: 'bar',
//     data: state.yData,
//     coordinateSystem: 'polar',
//     label: {
//       show: true,
//       position: 'middle',
//       formatter: '{b}: {c}'
//     }
//   },
//   animation: false
// };

// $props({
//   option,
// })

// $effect(() => {
//   $self.loading = true
//   // fetch(`${ window.localStorage.getItem("env")}/public/city?cityName=`, {
//   fetch(`http://81.70.235.200:3222/mock/136/barData002`, {
//     method: "get",
//   })
//     .then((response) => response.json())
//     .then(
//       ({ data }) => {
//         let arr = []
//         data.ydatas.forEach((item, index) => {
//           arr.push({
//             value: item,
//             itemStyle: {
//               color: option.color[index % 4]
//             }
//           })
//         })
//         state.xData = data.xnames;
//         state.yData = arr;
//         // 使用 Math.max() 方法取最大值
//         state.maxCount = Math.max.apply(null, data.ydatas);
//         $self.loading = false
//       },
//       () => {
//         $self.loading = false
//       }
//     )
// }, [])

// 4.例子：（柱子）各单位参与项目数量
// const state = $observable({
//   xData: [],
//   yData: []
// })

// var option

// // 柱状图实例
// option = {
//   grid: {
//     left: '3%',
//     right: '4%',
//     bottom: '3%',
//     containLabel: true
//   },
//   // grid: {
//   //   right: 8,
//   //   bottom: 20,
//   // },
//   title: {
//     text: '各单位参与项目数量',
//     left: 8,
//     top: 0,
//     textStyle: {
//       fontSize: 16,
//       fontWeight: 'bold',
//       color: '#333333',
//     },
//   },
//   legend: {
//     top: 20,   // 图例组件位置  按需自行修改
//     textStyle: {
//       fontSize: 14,
//     },
//   },

//   xAxis: {
//     type: 'category',
//     data: state.xData,
//     // splitLine: {
//     //   show: false,
//     // },
//     // axisLine: { show: false },//不显示坐标轴
//     // axisTick: {
//     //   show: false,//不显示坐标轴刻度线
//     // },
//   },
//   yAxis: {
//     type: 'value',
//     // splitLine: {
//     //   show: false,
//     // },
//     // axisLine: { show: false },//不显示坐标轴
//     // axisTick: {
//     //   show: false,//不显示坐标轴刻度线
//     // },
//   },
//   toolbox: {
//     show: true,
//     feature: {
//       restore: {
//         show: true, title: '刷新',
//         emphasis: {
//           iconStyle: {
//             borderColor: '#40a9ff'
//           }
//         }
//       },

//     },
//   },
//   tooltip: {
//     show: true,
//   },
//   color: ['#4776FF', '#00D3D7', '#FFC42F', '#B57BFE'],
//   itemStyle: {
//     borderRadius: 4,
//   },
//   series: state.yData,
// }
// $props({
//   option,
// })

// $effect(() => {
//   $self.loading = true
//   // fetch(`${ window.localStorage.getItem("env")}/public/city?cityName=`, {
//   fetch(`http://81.70.235.200:3222/mock/136/barData001`, {
//     method: "get",
//   })
//     .then((response) => response.json())
//     .then(
//       ({ data }) => {
//         data.ydatas.forEach((item, index) => {
//           item.type = 'bar';
//           item.barWidth = '20px';
//           item.name = item.yname;
//           item.data = item.ydata;
//         });

//         state.xData = data.xnames;
//         state.yData = data.ydatas
//         $self.loading = false
//       },
//       () => {
//         $self.loading = false
//       }
//     )
// }, [])

// 5.例子：（堆叠柱子）前十主管单位项目数量详情
// const state = $observable({
//   xData: [],
//   yData: []
// })

// var option

// // 柱状图实例
// option = {
//   grid: {
//     right: 8,
//     bottom: 20,
//   },
//   title: {
//     text: '前十主管单位项目数量详情',
//     left: 8,
//     top: 0,
//     textStyle: {
//       fontSize: 16,
//       fontWeight: 'bold',
//       color: '#333333',
//     },
//   },
//   legend: {
//     top: 25,   // 图例组件位置  按需自行修改
//     textStyle: {
//       fontSize: 10,
//     },
//   },
//   xAxis: {
//     type: 'category',
//     data: state.xData,
//   },
//   yAxis: {
//     type: 'value',
//     splitLine: {
//       show: false,
//     },
//   },
//   toolbox: {
//     show: true,
//     feature: {
//       restore: {
//         show: true, title: '刷新',
//         emphasis: {
//           iconStyle: {
//             borderColor: '#40a9ff'
//           }
//         }
//       },

//     },
//   },
//   tooltip: {
//     show: true,
//     trigger: 'axis',
//     // axisPointer: {
//     //   // 坐标轴指示器，坐标轴触发有效
//     //   type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
//     // },
//     axisPointer: {
//       type: 'cross',
//       crossStyle: {
//         color: '#999'
//       }
//     }
//   },
//   color: ['#4776FF', '#00D3D7', '#FFC42F', '#B57BFE'],
//   // itemStyle: {
//   //   borderRadius: 4,
//   // },
//   series: state.yData,
// }
// $props({
//   option,
// })

// $effect(() => {
//   $self.loading = true
//   // fetch(`${ window.localStorage.getItem("env")}/public/city?cityName=`, {
//   fetch(`http://81.70.235.200:3222/mock/136/barData003`, {
//     method: "get",
//   })
//     .then((response) => response.json())
//     .then(
//       ({ data }) => {
//         data.ydatas.forEach((item, index) => {
//           item.type = 'bar';
//           item.stack = 'top',
//           item.barWidth = '20px';
//           item.name = item.yname;
//           item.data = item.ydata;
//         });

//         state.xData = data.xnames;
//         state.yData = data.ydatas
//         $self.loading = false
//       },
//       () => {
//         $self.loading = false
//       }
//     )
// }, [])
