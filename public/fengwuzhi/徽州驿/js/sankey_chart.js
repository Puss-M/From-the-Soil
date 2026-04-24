// 构造桑基图配置
(function() {
    // 初始化桑基图
    function initSankeyChart() {
        const chartContainer = document.getElementById('sankey-chart');
        if (!chartContainer) {
            console.error('桑基图容器未找到: #sankey-chart');
            return;
        }
        
        // 初始化ECharts实例
        const chart = echarts.init(chartContainer);
        
        // 节点数据 - 徽派民居构造桑基图
        const nodes = [
            // 第一层：环境因素
            { name: '冬季寒冷', depth: 0, x: 0.7 },
            { name: '多雨易积水', depth: 0, x: 0.7 },
            { name: '中低山丘陵地貌', depth: 0, x: 0.7 },
            
            // 第二层：构造特征
            { name: '墙体厚实', depth: 1, x: 0.3 },
            { name: '砖石火塘取暖', depth: 1, x: 0.3 },
            { name: '四水归堂天井排水', depth: 1, x: 0.3 },
            { name: '马头墙导排雨水', depth: 1, x: 0.3 }
        ];
        
        // 关系数据 - 徽派民居构造关系
        const links = [
            // 冬季寒冷 → 墙体厚实
            { source: '冬季寒冷', target: '墙体厚实', value: 30 },
            
            // 冬季寒冷 → 砖石火塘取暖
            { source: '冬季寒冷', target: '砖石火塘取暖', value: 25 },
            
            // 多雨易积水 → 四水归堂天井排水
            { source: '多雨易积水', target: '四水归堂天井排水', value: 20 },
            
            // 多雨易积水 → 马头墙导排雨水
            { source: '多雨易积水', target: '马头墙导排雨水', value: 20 },
            
            // 中低山丘陵地貌 → 四水归堂天井排水
            { source: '中低山丘陵地貌', target: '四水归堂天井排水', value: 20 }
        ];
        
        // 颜色配置 - 徽派民居
        const colors = {
            // 环境因素 - 蓝色系
            '冬季寒冷': '#4f7de0',
            '多雨易积水': '#58c8d2',
            '中低山丘陵地貌': '#52b9c7',
            
            // 构造特征 - 土黄色系
            '墙体厚实': '#d4a017',
            '砖石火塘取暖': '#c8954d',
            '四水归堂天井排水': '#d3a657',
            '马头墙导排雨水': '#baa151'
        };
        
        // 桑基图配置选项
        const option = {
            // 移除grid配置，桑基图不使用grid
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove',
                position: function(point, params, dom, rect, size) {
                    // 居中显示提示框
                    const x = point[0];
                    const y = point[1];
                    const domWidth = dom.offsetWidth || 120;
                    const domHeight = dom.offsetHeight || 80;
                    const viewWidth = size.viewSize[0];
                    const viewHeight = size.viewSize[1];
                    
                    // 计算居中位置
                    let posX = x - domWidth / 2;
                    let posY = y - domHeight - 10;
                    
                    // 边界检查
                    if (posX < 5) posX = 5;
                    if (posX + domWidth > viewWidth - 5) posX = viewWidth - domWidth - 5;
                    if (posY < 5) posY = y + 10;
                    
                    return [posX, posY];
                },
                formatter: function(params) {
                    if (params.dataType === 'node') {
                        // 节点提示
                        return `
                            <div style="font-weight:bold;color:#8a5a1f;font-size:12px;text-align:center;">${params.name}</div>
                            <div style="color:#b38c12;font-size:11px;text-align:center;">${getNodeDescription(params.name)}</div>
                        `;
                    } else if (params.dataType === 'edge') {
                        // 连线提示
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
                nodeGap: 6, // 进一步减小节点间距
                nodeWidth: 6, // 进一步减小节点宽度
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
                        show: true, // 显示节点标签
                        color: '#ffffff', // 白色文字
                        fontSize: node.depth === 0 ? 14 : 14, // 左边节点10像素，右边节点8像素
                        fontWeight: 'normal', // 不要加粗
                        position: node.depth === 0 ? 'right' : 'inside', // 左边节点文字在右边，右边节点文字在内部
                        distance: node.depth === 0 ? 5 : 0, // 左边节点距离5像素，右边节点无距离
                        padding: node.depth === 1 ? [1, 1, 1, 1] : undefined, // 右边节点有内边距
                        formatter: function(params) {
                            // 只显示主要文字，不换行
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
                            show: true, // 悬停时也显示标签
                            color: '#ffffff', // 白色文字
                            fontSize: node.depth === 0 ? 13 : 11, // 左边节点11像素，右边节点9像素
                            fontWeight: 'normal', // 不要加粗
                            position: node.depth === 0 ? 'right' : 'inside' // 保持位置一致
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
                    show: false // 不显示任何标签
                }
            }],
            graphic: [] // 不显示任何文字
        };
        
        // 设置配置
        chart.setOption(option);
        
        // 添加点击事件
        chart.on('click', function(params) {
            if (params.dataType === 'node') {
                console.log(`点击了节点: ${params.name}`);
            } else if (params.dataType === 'edge') {
                console.log(`点击了关系: ${params.data.source} → ${params.data.target}`);
            }
        });
        
        // 添加鼠标悬停效果
        chart.on('mouseover', function(params) {
            if (params.dataType === 'node') {
                console.log(`悬停在节点: ${params.name}`);
            }
        });
        
        // 窗口大小变化时重绘
        window.addEventListener('resize', function() {
            chart.resize();
        });
        
        return chart;
    }
    
    // 获取节点描述 - 徽派民居
    function getNodeDescription(nodeName) {
        const descriptions = {
            '冬季寒冷': '徽州地区冬季寒冷的气候特点',
            '多雨易积水': '徽州地区多雨易积水的环境特征',
            '中低山丘陵地貌': '徽州地区中低山丘陵地貌特征',
            '墙体厚实': '徽派民居墙体厚实，保温防寒',
            '砖石火塘取暖': '传统砖石火塘取暖方式',
            '四水归堂天井排水': '四水归堂天井设计，有效排水',
            '马头墙导排雨水': '马头墙设计，导排雨水防火'
        };
        return descriptions[nodeName] || '徽派民居构造要素';
    }
    
    // 页面加载完成后初始化桑基图
    document.addEventListener('DOMContentLoaded', function() {
        // 确保ECharts已加载
        if (typeof echarts === 'undefined') {
            console.error('ECharts未加载，请确保echarts.min.js已正确引入');
            return;
        }
        
        // 初始化桑基图
        initSankeyChart();
    });
    
    // 导出函数供外部调用
    window.initSankeyChart = initSankeyChart;
})();