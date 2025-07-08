import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

const PieChart = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chart = echarts.init(chartRef.current);

        const option = {
            title: {
                text: '',
                left: 'left',
                top: 'top',
                textStyle: {
                    fontSize: 14,
                    color: '#FFFFFF',
                },
            },
            // 在无数据的时候显示一个占位圆。
            showEmptyCircle: true,
            tooltip: {
                trigger: 'item',
            },
            legend: {
                orient: 'vertical',
                right: '5%',
                top: '5%',
                textStyle: {
                    fontSize: 14,
                    color: '#FFFFFF',
                },
                // 使用回调函数
                formatter: function (name) {
                    let data = option.series[0].data;
                    let total = 0;
                    let current = 0;
                    for (let i = 0; i < data.length; i++) {
                        let value = Number(data[i].value);
                        total = total + value;
                        if (data[i].name == name) {
                            current = data[i].value;
                        }
                    }
                    let p = ((current / total) * 100).toFixed(2);
                    return `${name}： ${p}%`;
                },
            },
            color: ['#db3645', '#dfa900', '#118494', '#25a644'],
            series: [
                {
                    name: '',
                    type: 'pie',
                    // radius Array.<number|string>：数组的第一项是内半径，第二项是外半径
                    radius: [45, 80],
                    // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。支持设置成百分比，设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度。
                    center: ['50%', '50%'],
                    // 是否展示成南丁格尔图
                    // roseType: 'area',
                    itemStyle: {
                        borderRadius: 1,
                    },
                    label: {
                        show: true,
                        fontSize: 14,
                        color: '#FFFFFF',
                        // {b} 表示数据项的名称，{c} 表示数据项的值，{d} 表示数据项的百分比。
                        formatter: '{b}： {c}',
                    },
                    data: data,
                },
            ],
        };

        chart.setOption(option);
        return () => {
            chart.dispose(); // 销毁图表实例
        };
    }, [data]);

    return <div ref={chartRef} style={{ width: '100%', height: '100%', marginTop: -40 }} />;
};

export default PieChart;
