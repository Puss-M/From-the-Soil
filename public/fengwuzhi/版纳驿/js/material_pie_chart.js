// 材料环形图配置
(function() {
    // 初始化材料环形图
    function initMaterialPieChart() {
        const chartContainer = document.getElementById('material-pie-chart');
        if (!chartContainer) {
            console.error('材料环形图容器未找到: #material-pie-chart');
            return;
        }
        
        // 初始化ECharts实例
        const chart = echarts.init(chartContainer);
        
        // 材料数据 - 版纳竹楼
        const materialData = [
            { name: '竹材', value: 90 },
            { name: '木材', value: 80 },
            { name: '茅草', value: 70 },
            { name: '藤条', value: 60 }
        ];
        
        // 颜色配置
        const colors = ['#58c8d2', '#c8954d', '#d3a657', '#db5b61'];
        
        // 环形图配置选项 - 简化版
        const option = {
            color: colors,
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    const total = materialData.reduce((sum, item) => sum + item.value, 0);
                    const percent = ((params.value / total) * 100).toFixed(1);
                    return `
                        <div style="font-weight:bold;color:#8a5a1f;font-size:12px;">${params.name}</div>
                        <div style="color:#8a5a1f;font-size:11px;">${percent}%</div>
                    `;
                },
                backgroundColor: 'rgba(255, 255, 255, 0.85)', // 白色背景，高透明度
                borderColor: 'rgba(212, 160, 23, 0.5)',
                borderWidth: 1,
                textStyle: {
                    color: '#8a5a1f',
                    fontSize: 11
                },
                extraCssText: 'box-shadow: 0 0 6px rgba(139, 91, 31, 0.3); padding: 6px; border-radius: 4px;'
            },
            series: [{
                type: 'pie',
                radius: ['45%', '75%'], // 把环形图变大一点
                center: ['50%', '45%'], // 向上移动：垂直45%（原50%）
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 6,
                    borderColor: 'rgba(255,255,255,0.2)',
                    borderWidth: 1
                },
                label: {
                    show: false // 不显示标签文字
                },
                emphasis: {
                    scale: true,
                    scaleSize: 8,
                    label: {
                        show: false // 悬停时不显示标签
                    },
                    itemStyle: {
                        shadowBlur: 15,
                        shadowColor: 'rgba(212, 160, 23, 0.5)'
                    }
                },
                labelLine: {
                    show: false // 不显示标签线
                },
                data: materialData.map((item, index) => ({
                    ...item,
                    itemStyle: {
                        color: colors[index % colors.length]
                    }
                }))
            }],
            legend: {
                show: true, // 显示图例
                orient: 'vertical', // 垂直排列
                right: '2%', // 图例在圆环右边，更靠近右边
                top: 'center', // 垂直居中
                itemWidth: 12, // 图例标记宽度，稍微大一点
                itemHeight: 10, // 图例标记高度，稍微大一点
                textStyle: {
                    color: 'rgba(212, 160, 23, 0.9)', // 深一点的土黄色文字
                    fontSize: 10, // 字体大小，稍微大一点
                    fontWeight: 'normal'
                },
                itemGap: 10 // 图例项间距，稍微大一点
            },
            graphic: [] // 不显示任何图形文字
        };
        
        // 设置配置
        chart.setOption(option);
        
        // 添加点击事件
        chart.on('click', function(params) {
            console.log(`点击了材料: ${params.name}, 数量: ${params.value}`);
            // 可以在这里添加更多的交互逻辑，比如显示详细信息
        });
        
        // 添加鼠标悬停效果
        chart.on('mouseover', function(params) {
            console.log(`悬停在材料: ${params.name}`);
        });
        
        // 窗口大小变化时重绘
        window.addEventListener('resize', function() {
            chart.resize();
        });
        
        return chart;
    }
    
    // 页面加载完成后初始化环形图
    document.addEventListener('DOMContentLoaded', function() {
        // 确保ECharts已加载
        if (typeof echarts === 'undefined') {
            console.error('ECharts未加载，请确保echarts.min.js已正确引入');
            return;
        }
        
        // 初始化环形图
        initMaterialPieChart();
    });
    
    // 导出函数供外部调用
    window.initMaterialPieChart = initMaterialPieChart;
})();