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
                        { value: 7, name: '建筑科普' },
                        { value: 18, name: '文化历史' },
                        { value: 0, name: '旅游实拍' },
                        { value: 2, name: '生活体验' },
                        { value: 2, name: '房产介绍' },
                        { value: 31, name: '其他' }
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
                            if (value >= 30) {
                                return '#cc0000';
                            }
                            else if (value >= 20) {
                                return '#0055aa';
                            }
                            else if (value >= 15) {
                                return '#006600';
                            }
                            else if (value >= 10) {
                                return '#660099';
                            }
                            else if (value >= 7) {
                                return '#cc5500';
                            }
                            else {
                                return '#007777';
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
                        { name: '建筑', value: 33 },
                        { name: '山墙', value: 19 },
                        { name: '广东', value: 17 },
                        { name: '祠堂', value: 12 },
                        { name: '房子', value: 12 },
                        { name: '佛山', value: 11 },
                        { name: '广西', value: 11 },
                        { name: '修建', value: 10 },
                        { name: '耳屋', value: 9 },
                        { name: '防火', value: 9 },
                        { name: '碉楼', value: 9 },
                        { name: '保存', value: 8 },
                        { name: '科普', value: 7 },
                        { name: '历史', value: 7 },
                        { name: '地区', value: 7 },
                        { name: '民居', value: 7 },
                        { name: '广府', value: 7 },
                        { name: '风火墙', value: 6 },
                        { name: '马头墙', value: 6 },
                        { name: '防风', value: 6 },
                        { name: '耳楼', value: 6 },
                        { name: '岭南', value: 5 },
                        { name: '五行', value: 5 },
                        { name: '大户人家', value: 5 },
                        { name: '特色', value: 5 },
                        { name: '古蓬村', value: 5 },
                        { name: '陈公祠', value: 5 },
                        { name: '装饰', value: 4 },
                        { name: '雨水', value: 4 },
                        { name: '两边', value: 4 },
                        { name: '火灾', value: 6 },
                        { name: '蔓延', value: 6 },
                        { name: '有效', value: 6 }
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
                '<span style="font-size: 30px; color: #2f89cf;">四合院(178)</span>' +
                '<span style="font-size: 20px; color: #27d08a;">房子(79)</span>' +
                '<span style="font-size: 18px; color: #ff9f7f;">建筑(67)</span>' +
                '<span style="font-size: 16px; color: #f5c87c;">喜欢(64)</span>' +
                '<span style="font-size: 14px; color: #9d96f5;">院子(34)</span>' +
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
                        { value: 56, name: '正面' },
                        { value: 85, name: '中性' },
                        { value: 14, name: '负面' }
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
                            { name: '32', value: 32, xAxis: 17, yAxis: 32, symbolSize: 8, itemStyle: { color: '#ff6b6b' } }
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
                    data: [13, 8, 10, 2, 1, 8, 2, 0, 6, 7, 18, 10, 7, 17, 22, 5, 7, 32, 16, 20, 19, 19, 21, 12]
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
                        '镬耳屋', '岭南文化', '传承保护', '图形元素', '文化隐喻',
                        '历史建筑', '建筑元素', '传统建筑元素', '建构游戏', '数据集',
                        '乡村振兴', '文创产品', '大旗头古村', '数字设计', '风扇设计',
                        '运用研究', '植物染', '民居建筑', '广佛肇', '《镬耳屋》'
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
                    data: [7, 5, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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
