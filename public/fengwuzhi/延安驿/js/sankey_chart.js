(function () {
    function initSankeyChart() {
        const chartContainer = document.getElementById('sankey-chart');
        if (!chartContainer) {
            console.error('桑基图容器未找到: #sankey-chart');
            return;
        }
        const chart = echarts.init(chartContainer);
        const nodes = [
            { name: '黄土高原', depth: 0, x: 0.7 },
            { name: '干旱少雨', depth: 0, x: 0.7 },
            { name: '冬季严寒', depth: 0, x: 0.7 },
            { name: '夏季炎热', depth: 0, x: 0.7 },
            { name: '窑洞拱顶', depth: 1, x: 0.3 },
            { name: '靠山崖选址', depth: 1, x: 0.3 },
            { name: '厚土保温', depth: 1, x: 0.3 }
        ];
        const links = [
            { source: '黄土高原', target: '窑洞拱顶', value: 30 },
            { source: '干旱少雨', target: '靠山崖选址', value: 25 },
            { source: '冬季严寒', target: '厚土保温', value: 20 },
            { source: '夏季炎热', target: '厚土保温', value: 20 }
        ];
        const colors = {
            '黄土高原': '#4f7de0',
            '干旱少雨': '#58c8d2',
            '冬季严寒': '#6ba3ef',
            '夏季炎热': '#7bc4f5',
            '窑洞拱顶': '#d4a017',
            '靠山崖选址': '#c8954d',
            '厚土保温': '#d3a657'
        };
        const option = {
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove',
                position: function (point, params, dom, rect, size) {
                    const x = point[0];
                    const y = point[1];
                    const domWidth = dom.offsetWidth || 120;
                    const domHeight = dom.offsetHeight || 80;
                    const viewWidth = size.viewSize[0];
                    const viewHeight = size.viewSize[1];
                    let posX = x - domWidth / 2;
                    let posY = y - domHeight - 10;
                    if (posX < 5)
                        posX = 5;
                    if (posX + domWidth > viewWidth - 5)
                        posX = viewWidth - domWidth - 5;
                    if (posY < 5)
                        posY = y + 10;
                    return [posX, posY];
                },
                formatter: function (params) {
                    if (params.dataType === 'node') {
                        return `
                            <div style="font-weight:bold;color:#8a5a1f;font-size:12px;text-align:center;">${params.name}</div>
                            <div style="color:#b38c12;font-size:11px;text-align:center;">${getNodeDescription(params.name)}</div>
                        `;
                    }
                    else if (params.dataType === 'edge') {
                        return `
                            <div style="font-weight:bold;color:#8a5a1f;font-size:12px;text-align:center;">构造关系</div>
                            <div style="color:#b38c12;font-size:11px;text-align:center;">${params.data.source} → ${params.data.target}</div>
                            <div style="color:#8a5a1f;font-size:11px;text-align:center;">关联强度: ${params.data.value}</div>
                        `;
                    }
                    return params.name;
                },
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: 'rgba(212, 160, 23, 0.5)',
                borderWidth: 1,
                textStyle: {
                    color: '#8a5a1f',
                    fontSize: 11,
                    align: 'center'
                },
                extraCssText: 'box-shadow: 0 0 6px rgba(139, 91, 31, 0.3); padding: 8px; border-radius: 4px; text-align: center;'
            },
            series: [{
                    type: 'sankey',
                    layout: 'none',
                    draggable: false,
                    focusNodeAdjacency: 'allEdges',
                    nodeAlign: 'left',
                    nodeGap: 6,
                    nodeWidth: 6,
                    layoutIterations: 32,
                    orient: 'horizontal',
                    levels: [
                        {
                            depth: 0,
                            itemStyle: {
                                color: '#4f7de0',
                                borderColor: '#3a5db0'
                            },
                            lineStyle: {
                                color: 'source',
                                opacity: 0.6
                            }
                        },
                        {
                            depth: 1,
                            itemStyle: {
                                color: '#d4a017',
                                borderColor: '#b38c12'
                            },
                            lineStyle: {
                                color: 'source',
                                opacity: 0.6
                            }
                        }
                    ],
                    data: nodes.map(node => ({
                        ...node,
                        itemStyle: {
                            color: colors[node.name] || '#d4a017',
                            borderColor: 'rgba(255,255,255,0.3)',
                            borderWidth: 1
                        },
                        label: {
                            show: true,
                            color: '#ffffff',
                            fontSize: node.depth === 0 ? 14 : 14,
                            fontWeight: 'normal',
                            position: node.depth === 0 ? 'right' : 'inside',
                            distance: node.depth === 0 ? 5 : 0,
                            padding: node.depth === 1 ? [1, 1, 1, 1] : undefined,
                            formatter: function (params) {
                                return params.name;
                            }
                        },
                        emphasis: {
                            itemStyle: {
                                borderColor: '#ffcc00',
                                borderWidth: 2,
                                shadowBlur: 10,
                                shadowColor: 'rgba(255, 204, 0, 0.5)'
                            },
                            label: {
                                show: true,
                                color: '#ffffff',
                                fontSize: node.depth === 0 ? 13 : 11,
                                fontWeight: 'normal',
                                position: node.depth === 0 ? 'right' : 'inside'
                            }
                        }
                    })),
                    links: links.map(link => ({
                        ...link,
                        lineStyle: {
                            color: 'source',
                            curveness: 0.3,
                            opacity: 0.6
                        },
                        emphasis: {
                            lineStyle: {
                                opacity: 0.9,
                                width: 3
                            }
                        }
                    })),
                    lineStyle: {
                        color: 'gradient',
                        curveness: 0.3,
                        opacity: 0.6
                    },
                    emphasis: {
                        lineStyle: {
                            opacity: 0.9
                        }
                    },
                    label: {
                        show: false
                    }
                }],
            graphic: []
        };
        chart.setOption(option);
        chart.on('click', function (params) {
            if (params.dataType === 'node') {
                console.log(`点击了节点: ${params.name}`);
            }
            else if (params.dataType === 'edge') {
                console.log(`点击了关系: ${params.data.source} → ${params.data.target}`);
            }
        });
        chart.on('mouseover', function (params) {
            if (params.dataType === 'node') {
                console.log(`悬停在节点: ${params.name}`);
            }
        });
        window.addEventListener('resize', function () {
            chart.resize();
        });
        return chart;
    }
    function getNodeDescription(nodeName) {
        const descriptions = {
            '黄土高原': '黄土高原的地理环境特点',
            '干旱少雨': '干旱少雨的气候特征',
            '冬季严寒': '冬季严寒的气候特点',
            '夏季炎热': '夏季炎热的气候特征',
            '窑洞拱顶': '窑洞拱顶结构，利用黄土特性',
            '靠山崖选址': '靠山崖选址，因地制宜',
            '厚土保温': '厚土保温设计，冬暖夏凉'
        };
        return descriptions[nodeName] || '窑洞民居构造要素';
    }
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof echarts === 'undefined') {
            console.error('ECharts未加载，请确保echarts.min.js已正确引入');
            return;
        }
        initSankeyChart();
    });
    window.initSankeyChart = initSankeyChart;
})();
