$(function () {
    // 颜色配置基线 - 统一暖棕色系
    const themeText = '#8a5a1f';
    const subText = '#a2743c';
    const lightText = '#9a6a2e';
    const chartBlue = '#34c0d5';
    const chartGold = '#d3a657';
    const chartRed = '#db5477';

    // 坐标轴样式基线
    function axisStyle() {
        return {
            axisLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.2)' } },
            axisTick: { show: false },
            axisLabel: { color: themeText, fontSize: 11 },
            splitLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.05)' } }
        };
    }

    // 1. 温雨双折图 - 更亮的青蓝色和暖金色
    function initLineChart() {
        const myChart = echarts.init(document.getElementById('chart-line'));
        const option = {
            tooltip: { 
                trigger: 'axis',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                borderColor: 'rgba(93, 222, 214, 0.5)',
                textStyle: { color: '#333' }
            },
            grid: { left: 48, right: 38, top: 38, bottom: 38 },
            legend: {
                top: 6,
                right: 22,
                itemWidth: 15,
                itemHeight: 10,
                textStyle: { color: lightText, fontSize: 11 }
            },
            xAxis: [{
                type: 'category',
                data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                axisLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.3)' } },
                axisTick: { show: false },
                axisLabel: { color: lightText, fontSize: 11 }
            }],
            yAxis: [
                { 
                    type: 'value', 
                    name: '降水(mm)', 
                    nameTextStyle: { color: subText, fontSize: 10 },
                    min: 0, 
                    max: 200, 
                    interval: 50,
                    axisLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.3)' } },
                    axisTick: { show: false },
                    axisLabel: { color: subText, fontSize: 10 },
                    splitLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.08)' } }
                },
                { 
                    type: 'value', 
                    name: '温度(℃)',
                    nameTextStyle: { color: subText, fontSize: 10 },
                    min: -10, 
                    max: 30, 
                    interval: 10,
                    axisLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: { color: subText, fontSize: 10 },
                    splitLine: { show: false }
                }
            ],
            series: [
                {
                    name: '月降水量',
                    type: 'bar',
                    yAxisIndex: 0,
                    barWidth: 17,
                    itemStyle: { 
                        color: '#58c8d2',
                        borderRadius: [8, 8, 0, 0],
                        shadowBlur: 8,
                        shadowColor: 'rgba(88, 200, 210, 0.3)'
                    },
                    data: [3, 5, 8, 18, 35, 78, 173, 151, 58, 28, 8, 2]
                },
                {
                    name: '月均温度',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 7,
                    lineStyle: { width: 3, color: '#c8954d' },
                    itemStyle: { 
                        color: '#d7b06e',
                        borderColor: '#c8954d',
                        borderWidth: 2
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(200, 149, 77, 0.35)' },
                            { offset: 1, color: 'rgba(200, 149, 77, 0.05)' }
                        ])
                    },
                    data: [-4, -1, 7, 15, 21, 26, 28, 27, 22, 14, 5, -2]
                }
            ]
        };
        myChart.setOption(option);
    }

    // 2. 分类图 - 四瓣花重叠设计（最像目标）
    function initCategoryChart() {
        const myChart = echarts.init(document.getElementById('chart-category'));
        const option = {
            graphic: [
                {
                    type: 'circle',
                    left: '20%',
                    top: '25%',
                    shape: { r: 45 },
                    style: { fill: 'rgba(224, 93, 106, 0.8)' },
                    z: 10
                },
                {
                    type: 'circle',
                    left: '42%',
                    top: '18%',
                    shape: { r: 55 },
                    style: { fill: 'rgba(102, 66, 126, 0.8)' },
                    z: 10
                },
                {
                    type: 'circle',
                    left: '55%',
                    top: '45%',
                    shape: { r: 48 },
                    style: { fill: 'rgba(82, 185, 199, 0.8)' },
                    z: 10
                },
                {
                    type: 'circle',
                    left: '25%',
                    top: '52%',
                    shape: { r: 42 },
                    style: { fill: 'rgba(186, 161, 81, 0.8)' },
                    z: 10
                },
                // 添加标注文字
                {
                    type: 'text',
                    left: '18%',
                    top: '24%',
                    style: { text: '一进', fill: '#fff', fontSize: 11, fontWeight: 'bold' },
                    z: 20
                },
                {
                    type: 'text',
                    left: '41%',
                    top: '16%',
                    style: { text: '三进', fill: '#fff', fontSize: 12, fontWeight: 'bold' },
                    z: 20
                },
                {
                    type: 'text',
                    left: '54%',
                    top: '44%',
                    style: { text: '二进', fill: '#fff', fontSize: 11, fontWeight: 'bold' },
                    z: 20
                },
                {
                    type: 'text',
                    left: '23%',
                    top: '51%',
                    style: { text: '四进', fill: '#fff', fontSize: 10, fontWeight: 'bold' },
                    z: 20
                }
            ],
            legend: {
                show: true,
                bottom: 2,
                left: 'center',
                itemWidth: 10,
                itemHeight: 10,
                textStyle: { color: lightText, fontSize: 10 },
                data: ['一进四合院', '三进四合院', '二进四合院', '四进四合院']
            }
        };
        myChart.setOption(option);
    }

    // 3. 雷达图 - 放大到78%填满右侧
    function initRadarChart() {
        const myChart = echarts.init(document.getElementById('chart-radar'));
        const option = {
            title: { show: false },
            radar: {
                radius: '78%',
                center: ['55%', '55%'],
                indicator: [
                    { name: '防火', max: 100 },
                    { name: '防盗', max: 100 },
                    { name: '防水', max: 100 },
                    { name: '防恶劣天气', max: 100 },
                    { name: '防匪', max: 100 }
                ],
                axisName: { 
                    color: themeText, 
                    fontSize: 11,
                    fontWeight: 'bold'
                },
                splitArea: { 
                    show: true,
                    areaStyle: {
                        color: ['rgba(211, 166, 87, 0.04)', 'rgba(211, 166, 87, 0.09)']
                    }
                },
                splitLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.18)' } },
                axisLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.18)' } }
            },
            series: [{
                type: 'radar',
                data: [{
                    value: [78, 85, 70, 83, 65],
                    name: '四合院防御',
                    areaStyle: { color: 'rgba(211, 166, 87, 0.28)' },
                    lineStyle: { color: '#d3a657', width: 2.5 },
                    itemStyle: { color: '#d3a657' }
                }]
            }]
        };
        myChart.setOption(option);
    }

    // 4. 建材环形图 - 终版加粗
    function initPieChart() {
        const myChart = echarts.init(document.getElementById('chart-pie'));
        const option = {
            legend: {
                orient: 'horizontal',
                bottom: 5,
                left: 'center',
                itemWidth: 12,
                itemHeight: 10,
                textStyle: { color: lightText, fontSize: 11 }
            },
            series: [{
                type: 'pie',
                radius: ['48%', '82%'],
                center: ['50%', '45%'],
                avoidLabelOverlap: false,
                label: { show: false },
                labelLine: { show: false },
                itemStyle: {
                    borderWidth: 0,
                    shadowBlur: 16,
                    shadowColor: 'rgba(0, 0, 0, 0.12)'
                },
                emphasis: {
                    scale: true,
                    scaleSize: 8
                },
                data: [
                    { value: 35, name: '白灰', itemStyle: { color: '#d8c8a2' } },
                    { value: 30, name: '青砖', itemStyle: { color: '#4ec4cf' } },
                    { value: 25, name: '大理石', itemStyle: { color: '#6f8bf0' } },
                    { value: 20, name: '耐火土', itemStyle: { color: '#dc5d6d' } }
                ]
            }]
        };
        myChart.setOption(option);
    }

    // 5. 分布图 (中国地图) - 终版发光加强
    function initMapChart() {
        const myChart = echarts.init(document.getElementById('chart-map'));
        const option = {
            graphic: [
                {
                    type: 'text',
                    right: 20,
                    bottom: 20,
                    style: {
                        text: '审图号：GS(2019)1719号',
                        fill: 'rgba(138, 90, 31, 0.6)',
                        fontSize: 10
                    }
                }
            ],
            geo: {
                map: 'china',
                roam: false,
                zoom: 1.26,
                center: [105, 36],
                label: { show: false },
                emphasis: {
                    label: { show: false },
                    itemStyle: { areaColor: '#e3b45c' }
                },
                itemStyle: {
                    areaColor: '#dca548',
                    borderColor: '#b98a47',
                    borderWidth: 2.5,
                    shadowColor: 'rgba(255, 245, 220, 0.55)',
                    shadowBlur: 36,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0
                }
            },
            series: [
                {
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: [
                        { name: '北京', value: [116.407, 39.904, 180] }
                    ],
                    symbolSize: 32,
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke',
                        color: '#9ef0ff',
                        period: 3.2,
                        scale: 6.5,
                        number: 3
                    },
                    label: {
                        show: true,
                        formatter: '{b}',
                        position: 'right',
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 'bold',
                        distance: 10,
                        textBorderColor: 'rgba(0,0,0,0.4)',
                        textBorderWidth: 2.5
                    },
                    itemStyle: {
                        color: '#9ef0ff',
                        shadowBlur: 30,
                        shadowColor: 'rgba(158, 240, 255, 0.9)'
                    },
                    zlevel: 1
                }
            ]
        };
        myChart.setOption(option);
    }

    // 6. 构造桑基图 - 最终装饰化版本
    function initSankeyChart() {
        const myChart = echarts.init(document.getElementById('chart-sankey'));
        const option = {
            series: {
                type: 'sankey',
                layout: 'none',
                top: 30,
                bottom: 30,
                left: 40,
                right: 40,
                nodeWidth: 6,
                nodeGap: 16,
                draggable: false,
                emphasis: { focus: 'adjacency' },
                lineStyle: {
                    color: 'gradient',
                    curveness: 0.45,
                    opacity: 0.16
                },
                data: [
                    { name: '大门', itemStyle: { color: 'rgba(228, 80, 99, 0.6)', borderWidth: 0 } },
                    { name: '影壁', itemStyle: { color: 'rgba(52, 192, 213, 0.6)', borderWidth: 0 } },
                    { name: '倒座房', itemStyle: { color: 'rgba(211, 166, 87, 0.6)', borderWidth: 0 } },
                    { name: '垂花门', itemStyle: { color: 'rgba(82, 185, 199, 0.6)', borderWidth: 0 } },
                    { name: '游廊', itemStyle: { color: 'rgba(186, 161, 81, 0.6)', borderWidth: 0 } },
                    { name: '正房', itemStyle: { color: 'rgba(219, 84, 119, 0.6)', borderWidth: 0 } },
                    { name: '厢房', itemStyle: { color: 'rgba(102, 66, 126, 0.6)', borderWidth: 0 } },
                    { name: '耳房', itemStyle: { color: 'rgba(102, 142, 234, 0.6)', borderWidth: 0 } },
                    { name: '后罩房', itemStyle: { color: 'rgba(223, 97, 113, 0.6)', borderWidth: 0 } }
                ],
                links: [
                    { source: '大门', target: '影壁', value: 10 },
                    { source: '大门', target: '倒座房', value: 8 },
                    { source: '影壁', target: '垂花门', value: 10 },
                    { source: '倒座房', target: '垂花门', value: 5 },
                    { source: '垂花门', target: '游廊', value: 8 },
                    { source: '垂花门', target: '正房', value: 12 },
                    { source: '游廊', target: '厢房', value: 6 },
                    { source: '正房', target: '耳房', value: 8 },
                    { source: '正房', target: '后罩房', value: 4 },
                    { source: '厢房', target: '后罩房', value: 3 }
                ],
                label: { 
                    color: lightText, 
                    fontSize: 10,
                    fontWeight: 'normal'
                }
            }
        };
        myChart.setOption(option);
    }

    // 7. 分布词云图 - 终版精准排版
    function initWordCloud() {
        const myChart = echarts.init(document.getElementById('chart-wordcloud'));
        const option = {
            series: [{
                type: 'wordCloud',
                shape: 'square',
                sizeRange: [18, 105],
                rotationRange: [0, 0],
                rotationStep: 0,
                gridSize: 18,
                drawOutOfBound: false,
                layoutAnimation: true,
                left: '10%',
                top: '12%',
                width: '80%',
                height: '70%',
                textStyle: {
                    fontFamily: '"Microsoft YaHei", "PingFang SC", sans-serif',
                    fontWeight: 'bold',
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.22)',
                    color: function (params) {
                        const map = {
                            '东城区': '#e45063',
                            '西城区': '#c8954d',
                            '崇文门周边': '#baa151',
                            '海淀区': '#b4934d',
                            '丰台区': '#db5477',
                            '什刹海': '#28a8ff',
                            '南锣鼓巷': '#58c8d2',
                            '前门': '#6f8bf0',
                            '大栅栏': '#58c8d2',
                            '天津老城厢': '#c8954d',
                            '宣武门周边': '#e45063',
                            '胡同': '#6f8bf0',
                            '顺义区': '#58c8d2'
                        };
                        return map[params.name] || '#58c8d2';
                    }
                },
                emphasis: {
                    focus: 'self',
                    textStyle: {
                        shadowBlur: 18,
                        shadowColor: 'rgba(0, 0, 0, 0.45)'
                    }
                },
                data: [
                    { name: '西城区', value: 140 },
                    { name: '东城区', value: 150 },
                    { name: '崇文门周边', value: 120 },
                    { name: '海淀区', value: 86 },
                    { name: '丰台区', value: 82 },
                    { name: '什刹海', value: 74 },
                    { name: '南锣鼓巷', value: 68 },
                    { name: '前门', value: 58 },
                    { name: '大栅栏', value: 52 },
                    { name: '天津老城厢', value: 46 },
                    { name: '宣武门周边', value: 42 },
                    { name: '胡同', value: 38 },
                    { name: '顺义区', value: 28 }
                ]
            }]
        };
        myChart.setOption(option);
    }

    // 8. 仪表盘 (保持状况示例) - 调整尺寸适应新高度
    function initGauges() {
        const ids = ['chart-g1', 'chart-g2', 'chart-g3'];
        const names = ['完整四合院占比', '保护四合院占比', '完整核桃树占比'];
        const values = [92, 48, 23];
        const colors = ['#58c8d2', '#c8954d', '#db5477'];

        ids.forEach((id, i) => {
            const myChart = echarts.init(document.getElementById(id));
            const option = {
                series: [{
                    type: 'gauge',
                    radius: '88%',
                    center: ['50%', '60%'],
                    startAngle: 180,
                    endAngle: 0,
                    min: 0,
                    max: 100,
                    progress: { 
                        show: true, 
                        width: 9,
                        itemStyle: { 
                            color: colors[i],
                            shadowBlur: 12,
                            shadowColor: 'rgba(0,0,0,0.2)'
                        }
                    },
                    axisLine: { 
                        lineStyle: { 
                            width: 9, 
                            color: [[1, 'rgba(255, 255, 255, 0.1)']] 
                        } 
                    },
                    axisTick: { 
                        show: true,
                        splitNumber: 5,
                        distance: -9,
                        length: 3,
                        lineStyle: {
                            color: colors[i],
                            width: 1
                        }
                    },
                    splitLine: { 
                        show: true,
                        distance: -9,
                        length: 6,
                        lineStyle: {
                            color: colors[i],
                            width: 1.5
                        }
                    },
                    axisLabel: { show: false },
                    pointer: { show: false },
                    anchor: { show: false },
                    title: { 
                        show: true,
                        offsetCenter: [0, '62%'], 
                        fontSize: 9, 
                        color: subText,
                        lineHeight: 11,
                        overflow: 'truncate',
                        width: 70
                    },
                    detail: {
                        valueAnimation: true,
                        offsetCenter: [0, '8%'],
                        fontSize: 22,
                        fontWeight: 'bold',
                        formatter: '{value}%',
                        color: colors[i]
                    },
                    data: [{ value: values[i], name: names[i] }]
                }]
            };
            myChart.setOption(option);
        });
    }

    // 全部初始化
    initLineChart();
    initCategoryChart();
    initRadarChart();
    initPieChart();
    initMapChart();
    initSankeyChart();
    initWordCloud();
    initGauges();

    // 响应式
    window.addEventListener('resize', function () {
        const charts = document.querySelectorAll('.chart');
        charts.forEach(c => {
            const inst = echarts.getInstanceByDom(c);
            if (inst) inst.resize();
        });
    });
});
