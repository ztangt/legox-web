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
            color: [{
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: '#5793F4' // 0% 处的颜色
                }, {
                    offset: 1, color: '#D5E4FB' // 100% 处的颜色
                }],
                global: false // 缺省为 false
            },{
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: '#EB4C46' // 0% 处的颜色
                }, {
                    offset: 1, color: '#FFD1D0' // 100% 处的颜色
                }],
                global: false // 缺省为 false
            }],


            tooltip: {
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
            legend: {
              right: '10',
              bottom: 10,
              icon: "circle",
              itemWidth: 8,
              itemHeight: 8,
              textStyle: {
                  color: '#333333',
                  fontSize: 18
                },
            },
            series: [
              {
                data: data,
                type: 'pie',
                radius: ['70%', '90%'],
                label: {
                    show: false,
                },
              },
              
            ]
        };
          return myChartOption
        }
	    initBar(){
            const { data } = this.props
            //初始化echarts
            let myChart = echarts.init(this.ID)
            if(data.length > 0){
                //组件添加loading
                myChart.showLoading({color:'#5793F4',textColor:'#5793F4'})
                //组件注入数据
                myChart.setOption(this.columnChat(data))
                myChart.hideLoading()
                //在容器大小发生改变时调用。
                window.onresize = function () {
                    // echarts.getInstanceByDom(document.getElementById('cct')).resize()
                    myChart.resize();
                }
            } else {
                myChart.clear()
            }
	}
    render() {
        const { ID, width, height, title,data } = this.props
        return (
          <div style={{height:height}}>
            <span  className={styles.title}>预算执行情况</span>
            <div ref={ID => this.ID = ID} style={{height:height,width:width}}></div>
            {data.length == 0 && <div ><img /><p>暂无数据～</p></div> }
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
    width: '100%',
    // 画布的高
    height: '100%',
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
    data: PropTypes.array.isRequired
}
