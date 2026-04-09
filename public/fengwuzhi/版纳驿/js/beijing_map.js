// 苏州驿地图配置 - 基于folk_dashboard的地图实现（简化版）
(function() {
    // 初始化地图
    function initBeijingMap() {
        const mapContainer = document.getElementById('chart-map-beijing');
        if (!mapContainer) {
            console.error('地图容器未找到: #chart-map-beijing');
            return;
        }
        
        // 初始化ECharts实例
        const chart = echarts.init(mapContainer);
        
        // 重庆坐标（作为中心点，用于固定地图位置）
        const chongqingCoords = [106.55, 29.57];
        // 西双版纳坐标（云南西双版纳地区）
        const suzhouCoords = [100.8158, 21.9927];
        
        // 地图配置选项 - 以重庆为中心点，缩小地图，自动居中
        const option = {
            geo: {
                map: 'china',
                roam: false, // 禁止缩放和平移
                zoom: 0.9, // 缩小地图
                center: chongqingCoords, // 以重庆为中心点
                layoutCenter: ['50%', '50%'], // 放置在容器几何中心（左右上下居中）
                layoutSize: '100%', // 正常地图尺寸
                itemStyle: {
                    areaColor: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 1,
                        colorStops: [
                            {offset: 0, color: '#D2AB72'}, // 用户指定的颜色 #D2AB72
                            {offset: 0.5, color: '#E0BC85'}, // 稍亮的颜色
                            {offset: 1, color: '#C49A5F'} // 稍深的颜色
                        ]
                    },
                    borderColor: 'rgba(255,255,255,0.8)',
                    borderWidth: 1.2
                },
                emphasis: {
                    itemStyle: {
                        areaColor: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 1,
                            colorStops: [
                                {offset: 0, color: '#C49A5F'}, // 稍深的颜色
                                {offset: 0.5, color: '#D2AB72'}, // 用户指定的颜色
                                {offset: 1, color: '#B6894D'} // 更深的颜色
                            ]
                        }
                    }
                },
                label: {
                    show: false // 不显示省份标签
                },
                // 隐藏南海诸岛区域
                regions: [{
                    name: '南海诸岛',
                    itemStyle: {
                        opacity: 0  // 完全透明，隐藏该区域
                    },
                    label: {
                        show: false  // 隐藏标签
                    }
                }]
            },
            series: [{
                type: 'scatter',
                coordinateSystem: 'geo',
                symbolSize: 20, // 更大的圆点
                data: [
                    {
                        name: '西双版纳',
                        value: suzhouCoords.concat([100]) // 西双版纳坐标，第三个值用于大小
                    }
                ],
                itemStyle: {
                    color: '#ff6b6b', // 红色圆点
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false // 默认不显示标签文字
                },
                label: {
                    show: false // 默认不显示标签
                },
                emphasis: {
                    scale: true, // 悬停时稍微放大
                    scaleSize: 5, // 放大尺寸
                    label: {
                        show: true, // 悬停时显示标签
                        formatter: '云南',
                        position: 'right',
                        color: '#ff6b6b',
                        fontSize: 14,
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        padding: [4, 8],
                        borderRadius: 4,
                        borderColor: '#d4a017',
                        borderWidth: 1
                    }
                }
            }],
            tooltip: {
                show: false // 不显示提示框
            },
            title: {
                show: false // 不显示标题
            },
            // 审图号标注
            graphic: [
                {
                    type: 'text',
                    right: 10,
                    bottom: 10,
                    style: {
                        text: '中国地图审图号：GS（2024）0650',
                        fill: 'rgba(255, 255, 255, 0.7)',
                        fontSize: 10,
                        fontFamily: 'Arial, sans-serif'
                    }
                }
            ]
        };
        
        // 设置配置
        chart.setOption(option);
        
        // 窗口大小变化时重绘
        window.addEventListener('resize', function() {
            chart.resize();
        });
        
        return chart;
    }
    
    // 页面加载完成后初始化地图
    document.addEventListener('DOMContentLoaded', function() {
        // 确保ECharts已加载
        if (typeof echarts === 'undefined') {
            console.error('ECharts未加载，请确保echarts.min.js已正确引入');
            return;
        }
        
        // 初始化地图
        initBeijingMap();
    });
    
    // 导出函数供外部调用
    window.initBeijingMap = initBeijingMap;
})();
