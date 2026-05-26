(function () {
    function initMaterialPieChart() {
        const chartContainer = document.getElementById('material-pie-chart');
        if (!chartContainer) {
            console.error('材料环形图容器未找到: #material-pie-chart');
            return;
        }
        const chart = echarts.init(chartContainer);
        const materialData = [
            { name: '石材', value: 95 },
            { name: '土坯', value: 80 },
            { name: '木材', value: 70 },
            { name: '白灰', value: 60 }
        ];
        const colors = ['#58c8d2', '#A5D6A7', '#d3a657', '#db5b61'];
        const option = {
            color: colors,
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    const total = materialData.reduce((sum, item) => sum + item.value, 0);
                    const percent = ((params.value / total) * 100).toFixed(1);
                    return `
                        <div style="font-weight:bold;color:#8a5a1f;font-size:12px;">${params.name}</div>
                        <div style="color:#8a5a1f;font-size:11px;">${percent}%</div>
                    `;
                },
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
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
                    radius: ['45%', '75%'],
                    center: ['50%', '45%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 6,
                        borderColor: 'rgba(255,255,255,0.2)',
                        borderWidth: 1
                    },
                    label: {
                        show: false
                    },
                    emphasis: {
                        scale: true,
                        scaleSize: 8,
                        label: {
                            show: false
                        },
                        itemStyle: {
                            shadowBlur: 15,
                            shadowColor: 'rgba(212, 160, 23, 0.5)'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: materialData.map((item, index) => ({
                        ...item,
                        itemStyle: {
                            color: colors[index % colors.length]
                        }
                    }))
                }],
            legend: {
                show: true,
                orient: 'vertical',
                right: '2%',
                top: 'center',
                itemWidth: 12,
                itemHeight: 10,
                textStyle: {
                    color: 'rgba(212, 160, 23, 0.9)',
                    fontSize: 10,
                    fontWeight: 'normal'
                },
                itemGap: 10
            },
            graphic: []
        };
        chart.setOption(option);
        chart.on('click', function (params) {
            console.log(`点击了材料: ${params.name}, 数量: ${params.value}`);
        });
        chart.on('mouseover', function (params) {
            console.log(`悬停在材料: ${params.name}`);
        });
        window.addEventListener('resize', function () {
            chart.resize();
        });
        return chart;
    }
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof echarts === 'undefined') {
            console.error('ECharts未加载，请确保echarts.min.js已正确引入');
            return;
        }
        initMaterialPieChart();
    });
    window.initMaterialPieChart = initMaterialPieChart;
})();
