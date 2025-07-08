import React from 'react'
import PropTypes from 'prop-types';
import * as echarts from 'echarts';
import styles from './chart.less'


export default class ColumnChart extends React.PureComponent {
        constructor(props) {
            super(props)
            this.initBar = this.initBar.bind(this)
         }
        componentDidMount() {
            const { data} = this.props
            this.initBar()
        }
        componentDidUpdate() {
            const { data} = this.props
            this.initBar()
        }
        columnChat (data){
          let myChartOption= {
            grid: {
                top:'15%',
                right: '18',
                left: '28',
                bottom: '50'
            },
            tooltip: {
				trigger: 'axis',
                formatter:function(params) {
                　　var result = `<span style="font-size: 14px;color: rgba(0,0,0,0.85);line-height: 26.4px;">${params[0].name}</span>` + "</br>"
                　　params.forEach(function (item) {
                      if(1 / item.value > 0){
                  　　　 result += `<span style="font-size: 14px;color: #616161;">${item.seriesName}:&nbsp;&nbsp;${item.value}</span>` + "</br>"
                      }
                　　})
                　　return result
                },
			    backgroundColor: '#FFFFFF',
                axisPointer : {
                    type : 'shadow',
                    shadowStyle:{
                        color:"#F0F3F9",
                        opacity:0.3
                    }
                },
                textStyle:{
                        fontSize: 14,
                        color: '#98A9BC',
                },
                extraCssText: 'box-shadow:  0 4px 14px 0 #EDF3F6;',
				padding: 20,
		    },
            xAxis: {
                type: 'category',
                data:  data.xAxis || [],
                axisLabel:{
                    color: '#666666',
                    interval:'auto',
                    fontWeight:'normal',
                },
                axisTick:{
                    show: false
                },
                axisLine:{
                    lineStyle:{
                        color:'#F2F2F2'
                    }
                }
            },
            yAxis: {
                type: 'value',
                offset: -25,
                axisLine:{
                    show: false,
                    onZero: false,
                },
                axisTick:{
                    show: false
                },
                splitLine:{
                    show: true,
                    lineStyle:{
  				              color: ['#F2F2F2'],
  				              width: 1,
  				              type: 'dashed'
  				          }
                },
                axisLabel:{
                    formatter: `{value}万元`,
                    color: '#999999'
                },
                scale:  true,
                max: 100,
                min: 0,
                interval: 20,
            },
            legend: {
              right: '10',
              icon: "circle",
              itemWidth: 8,
              itemHeight: 8,
              textStyle: {
                  color: '#98A9BC',
                  fontSize: 14
                },
            },
            series: [
              {
                data: data.pay,
                name: '支出',
                type: 'bar',
                barWidth:'8',
                itemStyle: {
                    normal:{
                        
                      color:new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,

                        [
                            {offset: 0, color: '#EB4B45'},
                            {offset: 1, color: '#FFD2D0'}
                        ]
                      ),
                      barBorderRadius:8

                    }
                }
              },
              {
                data: data.budget,
                name: '预算',
                type: 'bar',
                barWidth:'8',
                itemStyle: {
                    normal:{
                        color:new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, //4个参数用于配置渐变色的起止位置, 这4个参数依次对应右/下/左/上四个方位. 而0 0 0 1则代表渐变色从正上方开始
                            [
                                {offset: 0, color: '#5793F4'},
                                {offset: 1, color: '#D5E4FB'}
                                //数组, 用于配置颜色的渐变过程. 每一项为一个对象, 包含offset和color两个参数. offset的范围是0 ~ 1, 用于表示位置
                            ]
                        ),
                        barBorderRadius:8

                    }
                }
              },
            ]
        };
          return myChartOption
        }
	    initBar(){
            const { data } = this.props
            //初始化echarts
            let myChart = echarts.init(this.ID)
            if(data.xAxis.length > 0){
                //组件添加loading
                myChart.showLoading({color:'#5793F4',textColor:'#5793F4'})
                myChart.width = 'auto'
                //组件注入数据
                myChart.setOption(this.columnChat(data))
                myChart.hideLoading()
                //在容器大小发生改变时调用。
                window.onresize = function () {
                    myChart.resize()
                }
            } else {
                myChart.clear()
            }
	}
    render() {
        const { ID, width, height, title,data } = this.props
        return (
          <div style={{height: height}}>
            <span  className={styles.title}>三公经费比较</span>
            <div ref={ID => this.ID = ID} style={{height:height,width:width}}></div>
            {data.xAxis.length == 0 && <div ><img /><p>暂无数据～</p></div> }
          </div>
        )
    }
}
ColumnChart.defaultProps = {
    //echarts容器的id
    ID: 'id',
    // 图标标题
    title: '柱形图',
    // 画布的宽
    width: '300px',
    // 画布的高
    height: '300px',
    // 数据
    data: {}
}

ColumnChart.propTypes = {
    // 组件唯一标示
    ID: PropTypes.string.isRequired,
    // 图标标题
    title: PropTypes.string.isRequired,
    // 画布的宽
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // 画布的高
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // 数据
    data: PropTypes.object.isRequired
}
