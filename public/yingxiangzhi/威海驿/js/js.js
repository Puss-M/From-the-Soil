$(function () {
    echarts_2();
    echarts_4();
    echarts_5();
    echarts_7();
    echarts_8();
    function echarts_1() {
        var myChart = echarts.init(document.getElementById('echart1'));
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '0%',
                top: '10px',
                right: '0%',
                bottom: '4%',
                containLabel: true
            },
            xAxis: [{
                    type: 'category',
                    data: ['商超门店', '教育培训', '房地产', '生活服务', '汽车销售', '旅游酒店', '五金建材'],
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "rgba(255,255,255,.1)",
                            width: 1,
                            type: "solid"
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        interval: 0,
                        show: true,
                        splitNumber: 15,
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize: '12',
                        },
                    },
                }],
            yAxis: [{
                    type: 'value',
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize: '12',
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "rgba(255,255,255,.1	)",
                            width: 1,
                            type: "solid"
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,.1)",
                        }
                    }
                }],
            series: [
                {
                    type: 'bar',
                    data: [200, 300, 300, 900, 1500, 1200, 600],
                    barWidth: '35%',
                    itemStyle: {
                        normal: {
                            color: '#2f89cf',
                            opacity: 1,
                            barBorderRadius: 5,
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
    function echarts_2() {
        var myChart = echarts.init(document.getElementById('echart2'));
        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                top: '5%',
                left: 'center',
                itemWidth: 10,
                itemHeight: 10,
                textStyle: {
                    color: '#000',
                    fontSize: '12',
                }
            },
            series: [
                {
                    name: '视频类型占比',
                    type: 'pie',
                    radius: ['40%', '60%'],
                    center: ['50%', '55%'],
                    avoidLabelOverlap: true,
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        formatter: function (params) {
                            var percent = params.percent;
                            var value = params.value;
                            var name = params.name;
                            return name + '\n' + value + ' (' + percent.toFixed(1) + '%)';
                        },
                        color: '#000',
                        fontSize: 12,
                        fontWeight: 'normal'
                    },
                    labelLine: {
                        show: true,
                        length: 10,
                        length2: 15,
                        lineStyle: {
                            color: 'rgba(255,255,255,.3)'
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 14,
                            fontWeight: 'bold'
                        }
                    },
                    data: [
                        { value: 15, name: '建筑科普' },
                        { value: 11, name: '文化历史' },
                        { value: 1, name: '旅游实拍' },
                        { value: 1, name: '生活体验' },
                        { value: 2, name: '房产介绍' },
                        { value: 30, name: '其他' }
                    ],
                    color: ['#4a9eff', '#2de69e', '#ffb399', '#ffe29e', '#b3adff', '#8fd4ff']
                }
            ]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
    function echarts_5() {
        console.log('开始初始化词云图...');
        var container = document.getElementById('echart5');
        if (!container) {
            console.error('找不到词云图容器 #echart5');
            return;
        }
        console.log('词云图容器找到:', container);
        if (typeof echarts === 'undefined') {
            console.error('ECharts未定义，请检查加载顺序');
            return;
        }
        console.log('检查wordCloud系列类型...');
        console.log('echarts对象:', echarts);
        console.log('echarts.seriesTypes:', echarts.seriesTypes);
        try {
            var myChart = echarts.init(container);
            console.log('ECharts实例创建成功');
        }
        catch (error) {
            console.error('创建ECharts实例失败:', error);
            return;
        }
        option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return params.name + ': ' + params.value + '次';
                }
            },
            series: [{
                    type: 'wordCloud',
                    left: 'center',
                    top: 'center',
                    width: '100%',
                    height: '100%',
                    sizeRange: [14, 42],
                    rotationRange: [0, 0],
                    rotationStep: 0,
                    gridSize: 12,
                    drawOutOfBound: false,
                    textStyle: {
                        fontFamily: '"Microsoft YaHei", "Segoe UI", Arial, sans-serif',
                        fontWeight: 'normal',
                        color: function (params) {
                            var value = params.value;
                            var colors = [
                                '#b30000',
                                '#003366',
                                '#006633',
                                '#663399',
                                '#993300',
                                '#006666',
                                '#663300',
                                '#330066',
                                '#003300',
                                '#660066'
                            ];
                            if (value >= 25) {
                                return colors[0];
                            }
                            else if (value >= 15) {
                                return colors[1];
                            }
                            else if (value >= 10) {
                                return colors[2];
                            }
                            else if (value >= 8) {
                                return colors[3];
                            }
                            else if (value >= 6) {
                                return colors[4];
                            }
                            else if (value >= 5) {
                                return colors[5];
                            }
                            else if (value >= 4) {
                                return colors[6];
                            }
                            else if (value >= 3) {
                                return colors[7];
                            }
                            else if (value >= 2) {
                                return colors[8];
                            }
                            else {
                                return colors[9];
                            }
                        }
                    },
                    emphasis: {
                        focus: 'self',
                        textStyle: {
                            shadowBlur: 4,
                            shadowColor: 'rgba(0,0,0,0.15)',
                            fontWeight: 'bold'
                        }
                    },
                    layoutAnimation: false,
                    ellipticity: 1,
                    shape: 'rect',
                    weightFactor: function (size) {
                        return size * 0.7;
                    },
                    data: [
                        { name: '海草房', value: 32 },
                        { name: '海草', value: 16 },
                        { name: '房子', value: 10 },
                        { name: '建筑', value: 9 },
                        { name: '屋顶', value: 8 },
                        { name: '农村', value: 8 },
                        { name: '环境', value: 8 },
                        { name: '小', value: 8 },
                        { name: '不错', value: 7 },
                        { name: '支持', value: 7 },
                        { name: '地理', value: 6 },
                        { name: '修', value: 6 },
                        { name: '海边', value: 6 },
                        { name: '技术', value: 6 },
                        { name: '设计师', value: 6 },
                        { name: '墙壁', value: 5 },
                        { name: '胶东半岛', value: 3 },
                        { name: '生态', value: 3 },
                        { name: '民居', value: 3 },
                        { name: '舒适', value: 3 },
                        { name: '城市', value: 3 },
                        { name: '瓦房', value: 3 },
                        { name: '红砖', value: 3 },
                        { name: '红瓦', value: 3 },
                        { name: '发展', value: 3 },
                        { name: '潮湿', value: 3 },
                        { name: '冬暖夏凉', value: 3 },
                        { name: '漂亮', value: 2 },
                        { name: '特色', value: 2 },
                        { name: '青苔', value: 2 },
                        { name: '防水', value: 2 },
                        { name: '防火', value: 2 },
                        { name: '保温', value: 2 },
                        { name: '寿命', value: 2 },
                        { name: '材料', value: 2 },
                        { name: '就地取材', value: 2 },
                        { name: '山东', value: 2 },
                        { name: '荣成', value: 2 },
                        { name: '沿海', value: 2 },
                        { name: '沿海地区', value: 2 },
                        { name: '气候', value: 2 },
                        { name: '砌墙', value: 2 },
                        { name: '渔网', value: 2 },
                        { name: '石块', value: 2 },
                        { name: '重物', value: 2 },
                        { name: '背阴', value: 2 },
                        { name: '排水', value: 2 },
                        { name: '失传', value: 2 },
                        { name: '稀缺', value: 2 },
                        { name: '因地制宜', value: 2 },
                        { name: '草顶', value: 2 },
                        { name: '维修', value: 2 },
                        { name: '省钱', value: 2 },
                        { name: '成本', value: 2 },
                        { name: '贵', value: 2 },
                        { name: '便宜', value: 2 }
                    ]
                }]
        };
        try {
            myChart.setOption(option);
            console.log('词云图配置设置成功');
            window.addEventListener("resize", function () {
                myChart.resize();
            });
        }
        catch (error) {
            console.error('设置词云图选项失败:', error);
            console.error('错误详情:', error.message, error.stack);
            console.log('尝试使用文本显示数据...');
            container.innerHTML = '<div style="color: white; padding: 20px; text-align: center;">' +
                '<h3>评论高频词汇</h3>' +
                '<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 20px;">' +
                '<span style="font-size: 30px; color: #b30000;">海草房(32)</span>' +
                '<span style="font-size: 20px; color: #003366;">海草(16)</span>' +
                '<span style="font-size: 18px; color: #006633;">房子(10)</span>' +
                '<span style="font-size: 16px; color: #663399;">建筑(9)</span>' +
                '<span style="font-size: 14px; color: #993300;">屋顶(8)</span>' +
                '</div></div>';
        }
    }
    function echarts_4() {
        var myChart = echarts.init(document.getElementById('echart4'));
        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                top: '5%',
                left: 'center',
                itemWidth: 10,
                itemHeight: 10,
                textStyle: {
                    color: '#000',
                    fontSize: '12',
                },
                data: ['正面', '中性', '负面']
            },
            series: [
                {
                    name: '评论情感',
                    type: 'pie',
                    radius: ['40%', '60%'],
                    center: ['50%', '55%'],
                    avoidLabelOverlap: true,
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        formatter: function (params) {
                            var percent = params.percent;
                            var value = params.value;
                            var name = params.name;
                            return name + '\n' + value + ' (' + percent.toFixed(1) + '%)';
                        },
                        color: '#000',
                        fontSize: 12,
                        fontWeight: 'normal'
                    },
                    labelLine: {
                        show: true,
                        length: 10,
                        length2: 15,
                        lineStyle: {
                            color: 'rgba(255,255,255,.3)'
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 14,
                            fontWeight: 'bold'
                        }
                    },
                    data: [
                        { value: 39, name: '正面' },
                        { value: 199, name: '中性' },
                        { value: 21, name: '负面' }
                    ],
                    color: ['#4cd08a', '#4a9eff', '#ff8b7b']
                }
            ]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
    function echarts_6() {
        var myChart = echarts.init(document.getElementById('echart6'));
        var dataStyle = {
            normal: {
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
            }
        };
        var placeHolderStyle = {
            normal: {
                color: 'rgba(255,255,255,.05)',
                label: { show: false, },
                labelLine: { show: false }
            },
            emphasis: {
                color: 'rgba(0,0,0,0)'
            }
        };
        option = {
            color: ['#0f63d6', '#0f78d6', '#0f8cd6', '#0fa0d6', '#0fb4d6'],
            tooltip: {
                show: true,
                formatter: "{a} : {c} "
            },
            legend: {
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 12,
                bottom: '3%',
                data: ['浙江', '上海', '广东', '北京', '深圳'],
                textStyle: {
                    color: 'rgba(255,255,255,.6)',
                }
            },
            series: [
                {
                    name: '浙江',
                    type: 'pie',
                    clockWise: false,
                    center: ['50%', '42%'],
                    radius: ['59%', '70%'],
                    itemStyle: dataStyle,
                    hoverAnimation: false,
                    data: [{
                            value: 80,
                            name: '01'
                        }, {
                            value: 20,
                            name: 'invisible',
                            tooltip: { show: false },
                            itemStyle: placeHolderStyle
                        }]
                },
                {
                    name: '上海',
                    type: 'pie',
                    clockWise: false,
                    center: ['50%', '42%'],
                    radius: ['49%', '60%'],
                    itemStyle: dataStyle,
                    hoverAnimation: false,
                    data: [{
                            value: 70,
                            name: '02'
                        }, {
                            value: 30,
                            name: 'invisible',
                            tooltip: { show: false },
                            itemStyle: placeHolderStyle
                        }]
                },
                {
                    name: '广东',
                    type: 'pie',
                    clockWise: false,
                    hoverAnimation: false,
                    center: ['50%', '42%'],
                    radius: ['39%', '50%'],
                    itemStyle: dataStyle,
                    data: [{
                            value: 65,
                            name: '03'
                        }, {
                            value: 35,
                            name: 'invisible',
                            tooltip: { show: false },
                            itemStyle: placeHolderStyle
                        }]
                },
                {
                    name: '北京',
                    type: 'pie',
                    clockWise: false,
                    hoverAnimation: false,
                    center: ['50%', '42%'],
                    radius: ['29%', '40%'],
                    itemStyle: dataStyle,
                    data: [{
                            value: 60,
                            name: '04'
                        }, {
                            value: 40,
                            name: 'invisible',
                            tooltip: { show: false },
                            itemStyle: placeHolderStyle
                        }]
                },
                {
                    name: '深圳',
                    type: 'pie',
                    clockWise: false,
                    hoverAnimation: false,
                    center: ['50%', '42%'],
                    radius: ['20%', '30%'],
                    itemStyle: dataStyle,
                    data: [{
                            value: 50,
                            name: '05'
                        }, {
                            value: 50,
                            name: 'invisible',
                            tooltip: { show: false },
                            itemStyle: placeHolderStyle
                        }]
                },
            ]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
    function echarts_31() {
        var myChart = echarts.init(document.getElementById('fb1'));
        option = {
            title: [{
                    text: '年龄分布',
                    left: 'center',
                    textStyle: {
                        color: '#fff',
                        fontSize: '16'
                    }
                }],
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)",
                position: function (p) {
                    return [p[0] + 10, p[1] - 10];
                }
            },
            legend: {
                top: '70%',
                itemWidth: 10,
                itemHeight: 10,
                data: ['0岁以下', '20-29岁', '30-39岁', '40-49岁', '50岁以上'],
                textStyle: {
                    color: 'rgba(255,255,255,.5)',
                    fontSize: '12',
                }
            },
            series: [
                {
                    name: '年龄分布',
                    type: 'pie',
                    center: ['50%', '42%'],
                    radius: ['40%', '60%'],
                    color: ['#065aab', '#066eab', '#0682ab', '#0696ab', '#06a0ab', '#06b4ab', '#06c8ab', '#06dcab', '#06f0ab'],
                    label: { show: false },
                    labelLine: { show: false },
                    data: [
                        { value: 1, name: '0岁以下' },
                        { value: 4, name: '20-29岁' },
                        { value: 2, name: '30-39岁' },
                        { value: 2, name: '40-49岁' },
                        { value: 1, name: '50岁以上' },
                    ]
                }
            ]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
    function echarts_32() {
        var myChart = echarts.init(document.getElementById('fb2'));
        option = {
            title: [{
                    text: '职业分布',
                    left: 'center',
                    textStyle: {
                        color: '#fff',
                        fontSize: '16'
                    }
                }],
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)",
                position: function (p) {
                    return [p[0] + 10, p[1] - 10];
                }
            },
            legend: {
                top: '70%',
                itemWidth: 10,
                itemHeight: 10,
                data: ['电子商务', '教育', 'IT/互联网', '金融', '学生', '其他'],
                textStyle: {
                    color: 'rgba(255,255,255,.5)',
                    fontSize: '12',
                }
            },
            series: [
                {
                    name: '年龄分布',
                    type: 'pie',
                    center: ['50%', '42%'],
                    radius: ['40%', '60%'],
                    color: ['#065aab', '#066eab', '#0682ab', '#0696ab', '#06a0ab', '#06b4ab', '#06c8ab', '#06dcab', '#06f0ab'],
                    label: { show: false },
                    labelLine: { show: false },
                    data: [
                        { value: 5, name: '电子商务' },
                        { value: 1, name: '教育' },
                        { value: 6, name: 'IT/互联网' },
                        { value: 2, name: '金融' },
                        { value: 1, name: '学生' },
                        { value: 1, name: '其他' },
                    ]
                }
            ]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
    function echarts_33() {
        var myChart = echarts.init(document.getElementById('fb3'));
        option = {
            title: [{
                    text: '兴趣分布',
                    left: 'center',
                    textStyle: {
                        color: '#fff',
                        fontSize: '16'
                    }
                }],
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)",
                position: function (p) {
                    return [p[0] + 10, p[1] - 10];
                }
            },
            legend: {
                top: '70%',
                itemWidth: 10,
                itemHeight: 10,
                data: ['汽车', '旅游', '财经', '教育', '软件', '其他'],
                textStyle: {
                    color: 'rgba(255,255,255,.5)',
                    fontSize: '12',
                }
            },
            series: [
                {
                    name: '兴趣分布',
                    type: 'pie',
                    center: ['50%', '42%'],
                    radius: ['40%', '60%'],
                    color: ['#065aab', '#066eab', '#0682ab', '#0696ab', '#06a0ab', '#06b4ab', '#06c8ab', '#06dcab', '#06f0ab'],
                    label: { show: false },
                    labelLine: { show: false },
                    data: [
                        { value: 2, name: '汽车' },
                        { value: 3, name: '旅游' },
                        { value: 1, name: '财经' },
                        { value: 4, name: '教育' },
                        { value: 8, name: '软件' },
                        { value: 1, name: '其他' },
                    ]
                }
            ]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
    function echarts_7() {
        var myChart = echarts.init(document.getElementById('echart7'));
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#dddc6b'
                    }
                }
            },
            grid: {
                left: '0',
                top: '30',
                right: '65',
                bottom: '10',
                containLabel: true
            },
            xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    name: '时间',
                    nameGap: 20,
                    nameTextStyle: {
                        color: '#000',
                        fontSize: 12
                    },
                    axisLabel: {
                        interval: 4,
                        textStyle: {
                            color: "#000",
                            fontSize: 12,
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#000'
                        }
                    },
                    data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
                }],
            yAxis: [{
                    type: 'value',
                    name: '评论数',
                    nameTextStyle: {
                        color: '#000',
                        fontSize: 12
                    },
                    axisTick: { show: false },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#000',
                            width: 1
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: "#000",
                            fontSize: 12,
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                }],
            series: [
                {
                    name: '评论数量',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    markPoint: {
                        data: [
                            { name: '25', value: 25, xAxis: 22, yAxis: 25, symbolSize: 8, itemStyle: { color: '#ff6b6b' } }
                        ],
                        symbol: 'circle',
                        symbolSize: 8,
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{b}',
                            color: '#ff6b6b',
                            fontSize: 12,
                            fontWeight: 'bold'
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#2f89cf',
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(47, 137, 207, 0.4)'
                                }, {
                                    offset: 0.8,
                                    color: 'rgba(47, 137, 207, 0.1)'
                                }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#2f89cf',
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: [13, 9, 2, 1, 5, 2, 4, 1, 6, 10, 11, 7, 10, 23, 16, 15, 17, 10, 11, 12, 17, 20, 25, 13]
                }
            ]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
    function echarts_8() {
        console.log('开始初始化知网论文数柱状图...');
        var container = document.getElementById('echart8');
        if (!container) {
            console.error('找不到柱状图容器 #echart8');
            return;
        }
        try {
            var myChart = echarts.init(container);
            console.log('ECharts实例创建成功');
        }
        catch (error) {
            console.error('创建ECharts实例失败:', error);
            return;
        }
        option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params) {
                    return params[0].name + ': ' + params[0].value + '篇';
                }
            },
            grid: {
                left: '2%',
                right: '10%',
                top: '15%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: [{
                    type: 'category',
                    name: '主题',
                    nameGap: 5,
                    nameTextStyle: {
                        color: '#000',
                        fontSize: 12
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#000',
                            width: 1,
                            type: 'solid'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        interval: 2,
                        rotate: 45,
                        textStyle: {
                            color: '#000',
                            fontSize: 10
                        }
                    },
                    data: [
                        '海草房', '传统村落', '传统民居', '胶东地区', '胶东半岛',
                        '烟墩角', '东楮岛', '海草房传统村落', '设计研究', '山东省',
                        '特色民居', '荣成市', '策略研究', '村落景观', '地域性',
                        '地域文化', '传统村落保护', '乡村振兴', '营造技艺', '山东荣成'
                    ]
                }],
            yAxis: [{
                    type: 'value',
                    name: '论文数',
                    nameTextStyle: {
                        color: '#000',
                        fontSize: 12
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#000',
                            width: 1,
                            type: 'solid'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,.3)'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#000',
                            fontSize: 10
                        }
                    }
                }],
            series: [{
                    name: '文献数(篇)',
                    type: 'bar',
                    barWidth: '60%',
                    data: [130, 31, 17, 15, 13, 13, 11, 11, 11, 11, 10, 10, 9, 8, 8, 8, 7, 7, 6, 6],
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#4a9eff' },
                                { offset: 1, color: '#2a6ad6' }
                            ]),
                            barBorderRadius: [3, 3, 0, 0],
                            opacity: 0.9
                        },
                        emphasis: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#ff6b6b' },
                                { offset: 1, color: '#ff4d4d' }
                            ]),
                            shadowBlur: 10,
                            shadowColor: 'rgba(255,107,107,0.5)'
                        }
                    },
                    label: {
                        show: true,
                        position: 'top',
                        color: '#000',
                        fontSize: 10,
                        fontWeight: 'normal',
                        formatter: function (params) {
                            return params.value;
                        }
                    }
                }]
        };
        try {
            myChart.setOption(option);
            console.log('知网论文数柱状图配置设置成功');
            window.addEventListener("resize", function () {
                myChart.resize();
            });
        }
        catch (error) {
            console.error('设置柱状图选项失败:', error);
            console.error('错误详情:', error.message, error.stack);
        }
    }
});
