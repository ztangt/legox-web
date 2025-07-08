const state = $observable({
  xData: [],
  yData: [],
})

var option

// 柱状图实例
option = {
  title: {
    text: '预算指标执行情况',
    left: 8,
    top: 0,
    textStyle: {
      fontSize: 14,
      fontWeight: 400,
      color: '#333333',
    },
  },
  legend: {
    data: ['序时率', '平均率'],
    top: 20,
    right: 30,
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
      restore: { show: true, title: '刷新' },
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
  color: ['#27a844', '#db3645'],
  itemStyle: {
    borderRadius: 4,
  },
  series: state.yData,
  dataZoom: [
    {
      type: 'slider',
      realtime: true,
      // start: 0,
      // end: 80, // 数据窗口范围的结束百分比。范围是：0 ~ 100。
      // end: this.setNum(xAxisData.length), // 数据窗口范围的结束百分比。范围是：0 ~ 100。
      height: 1, // 组件高度
      // left: 5, // 左边的距离
      // right: 5, // 右边的距离
      bottom: 10, // 下边的距离
      show: true, // 是否展示
      fillerColor: '#195CC5', // 滚动条颜色
      borderColor: 'rgba(17, 100, 210, 0.12)',
      handleSize: 0, // 两边手柄尺寸
      xAxisIndex: [0],
      showDetail: false, // 拖拽时是否展示滚动条两侧的文字
      zoomLock: true, // 是否只平移不缩放
      moveOnMouseMove: false, // 鼠标移动能触发数据窗口平移
      zoomOnMouseWheel: true, // 鼠标移动能触发数据窗口缩放

      startValue: 0, // 数据窗口范围的起始数值。
      endValue: 10, // 数据窗口范围的结束数值。
    },
    {
      type: 'inside', // 支持内部鼠标滚动平移
      start: 0,
      end: 70,
      zoomOnMouseWheel: false, // 关闭滚轮缩放
      moveOnMouseWheel: true, // 开启滚轮平移
      moveOnMouseMove: true, // 鼠标移动能触发数据窗口平移
    },
  ],
}
$props({
  option,
})

// 处理bar data
const tfBarData = (bar_json = []) => {
  let tmp = []
  tmp = bar_json
  let average = 0

  let ydatas = bar_json.ydatas || []
  if (ydatas.length) {
    let info = ydatas.find((item) => item.yname.includes('平均率'))
    if (info && info.ydata && info.ydata.length) {
      average = info.ydata[0]
    }
  }

  tmp.ydatas?.forEach((item, index) => {
    if (item.yname.includes('序时率')) {
      item.type = 'line'
      item.symbolSize = 0
      item.endLabel = {
        show: true,
        formatter: function (params) {
          return params.value
        },
      }
      item.lineStyle = {
        color: '#27a844',
        width: 1,
        type: 'dashed',
      }
    } else if (item.yname.includes('平均率')) {
      item.type = 'line'
      item.symbolSize = 0
      item.endLabel = {
        show: true,
        formatter: function (params) {
          return params.value
        },
      }
      item.lineStyle = {
        color: '#db3645',
        width: 1,
        type: 'dashed',
      }
    } else {
      let tmp = item.ydata
      for (let i = 0; i < tmp.length; i++) {
        //自定义单个柱子的颜色  小于平均值红色  MDZZ
        if (tmp[i] < average) {
          tmp[i] = {
            value: tmp[i],
            itemStyle: {
              color: '#db3645',
            },
          }
        }
      }
      item.type = 'bar'
    }

    item.barWidth = '20px'
    item.name = item.yname
    item.data = item.ydata
    item.itemStyle = {
      borderRadius: 6,
    }
  })
  return tmp
}

$effect(() => {
  $self.loading = true
  // fetch(`${ window.localStorage.getItem("env")}/public/city?cityName=`, {
  // fetch(`http://10.20.105.21:8088/api/ods-app/unifiedPortal/execute/dynamics`, {
  fetch(`http://81.70.235.200:3222/mock/136/getBar`, {
    method: 'get',
    headers: {
      // TODO   "Bearer " + window.localStorage.getItem("refreshToken")!!!!
      Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
    },
  })
    .then((response) => response.json())
    .then(
      ({ data }) => {
        let laterData = tfBarData(data)
        state.xData = data.xnames
        state.yData = laterData.ydatas
        $self.loading = false
      },
      () => {
        $self.loading = false
      }
    )
}, [])
