import * as echarts from 'echarts';
import type { HeritageDashboardData } from '@/data/heritageDashboard';
import { MONTHS } from '@/data/heritageDashboard';
const themeText = '#8a5a1f';
const subText = '#a2743c';
const lightText = '#9a6a2e';
const chartColors = ['#e45063', '#c8954d', '#baa151', '#58c8d2', '#6f8bf0', '#db5477'];
function initGauge(id: string, label: string, value: number, display: string, color: string) {
    const dom = document.getElementById(id);
    if (!dom)
        return;
    const chart = echarts.init(dom);
    chart.setOption({
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
                    itemStyle: { color, shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.2)' },
                },
                axisLine: { lineStyle: { width: 9, color: [[1, 'rgba(255, 255, 255, 0.1)']] } },
                axisTick: {
                    show: true,
                    splitNumber: 5,
                    distance: -9,
                    length: 3,
                    lineStyle: { color, width: 1 },
                },
                splitLine: {
                    show: true,
                    distance: -9,
                    length: 6,
                    lineStyle: { color, width: 1.5 },
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
                    width: 70,
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: [0, '8%'],
                    fontSize: 22,
                    fontWeight: 'bold',
                    formatter: '{value}%',
                    color,
                },
                data: [{ value, name: label }],
            }],
    });
}
export async function initBigscreenCharts(data: HeritageDashboardData) {
    await import('echarts-wordcloud');
    const ids = [
        'chart-line',
        'chart-category',
        'chart-radar',
        'chart-pie',
        'chart-map',
        'chart-sankey',
        'chart-wordcloud',
        'chart-g1',
        'chart-g2',
        'chart-g3',
    ];
    ids.forEach((id) => {
        const dom = document.getElementById(id);
        if (!dom)
            return;
        echarts.getInstanceByDom(dom)?.dispose();
    });
    const lineDom = document.getElementById('chart-line');
    const categoryDom = document.getElementById('chart-category');
    const radarDom = document.getElementById('chart-radar');
    const pieDom = document.getElementById('chart-pie');
    const mapDom = document.getElementById('chart-map');
    const sankeyDom = document.getElementById('chart-sankey');
    const cloudDom = document.getElementById('chart-wordcloud');
    if (!lineDom || !categoryDom || !radarDom || !pieDom || !mapDom || !sankeyDom || !cloudDom) {
        return () => undefined;
    }
    const lineChart = echarts.init(lineDom);
    const categoryChart = echarts.init(categoryDom);
    const radarChart = echarts.init(radarDom);
    const pieChart = echarts.init(pieDom);
    const mapChart = echarts.init(mapDom);
    const sankeyChart = echarts.init(sankeyDom);
    const cloudChart = echarts.init(cloudDom);
    lineChart.setOption({
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            borderColor: 'rgba(93, 222, 214, 0.5)',
            textStyle: { color: '#333' },
        },
        grid: { left: 48, right: 38, top: 38, bottom: 38 },
        legend: {
            top: 6,
            right: 22,
            itemWidth: 15,
            itemHeight: 10,
            textStyle: { color: lightText, fontSize: 13 },
        },
        xAxis: [{
                type: 'category',
                data: MONTHS,
                axisLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.3)' } },
                axisTick: { show: false },
                axisLabel: { color: lightText, fontSize: 13 },
            }],
        yAxis: [
            {
                type: 'value',
                name: '降水(mm)',
                nameTextStyle: { color: subText, fontSize: 12 },
                min: 0,
                max: Math.max(200, Math.ceil(Math.max(...data.monthlyPrecipitation, 1) / 50) * 50),
                interval: 50,
                axisLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.3)' } },
                axisTick: { show: false },
                axisLabel: { color: subText, fontSize: 12 },
                splitLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.08)' } },
            },
            {
                type: 'value',
                name: '温度(℃)',
                nameTextStyle: { color: subText, fontSize: 12 },
                min: -10,
                max: 30,
                interval: 10,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { color: subText, fontSize: 12 },
                splitLine: { show: false },
            },
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
                    shadowColor: 'rgba(88, 200, 210, 0.3)',
                },
                data: data.monthlyPrecipitation,
            },
            {
                name: '月均温度',
                type: 'line',
                yAxisIndex: 1,
                smooth: true,
                symbol: 'circle',
                symbolSize: 7,
                lineStyle: { width: 3, color: '#c8954d' },
                itemStyle: { color: '#d7b06e', borderColor: '#c8954d', borderWidth: 2 },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(200, 149, 77, 0.35)' },
                        { offset: 1, color: 'rgba(200, 149, 77, 0.05)' },
                    ]),
                },
                data: data.monthlyTemperature,
            },
        ],
    });
    const topCategories = data.categoryDistribution.slice(0, 4);
    const categoryNames = ['一类', '二类', '三类', '四类'];
    const petals = ['rgba(224, 93, 106, 0.8)', 'rgba(102, 66, 126, 0.8)', 'rgba(82, 185, 199, 0.8)', 'rgba(186, 161, 81, 0.8)'];
    categoryChart.setOption({
        graphic: [
            { type: 'circle', left: '20%', top: '25%', shape: { r: 45 }, style: { fill: petals[0] }, z: 10 },
            { type: 'circle', left: '42%', top: '18%', shape: { r: 55 }, style: { fill: petals[1] }, z: 10 },
            { type: 'circle', left: '55%', top: '45%', shape: { r: 48 }, style: { fill: petals[2] }, z: 10 },
            { type: 'circle', left: '25%', top: '52%', shape: { r: 42 }, style: { fill: petals[3] }, z: 10 },
            { type: 'text', left: '18%', top: '24%', style: { text: topCategories[0]?.name ?? categoryNames[0], fill: '#fff', fontSize: 14, fontWeight: 'bold' }, z: 20 },
            { type: 'text', left: '41%', top: '16%', style: { text: topCategories[1]?.name ?? categoryNames[1], fill: '#fff', fontSize: 15, fontWeight: 'bold' }, z: 20 },
            { type: 'text', left: '54%', top: '44%', style: { text: topCategories[2]?.name ?? categoryNames[2], fill: '#fff', fontSize: 14, fontWeight: 'bold' }, z: 20 },
            { type: 'text', left: '23%', top: '51%', style: { text: topCategories[3]?.name ?? categoryNames[3], fill: '#fff', fontSize: 13, fontWeight: 'bold' }, z: 20 },
        ],
        legend: {
            show: true,
            bottom: 2,
            left: 'center',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: { color: lightText, fontSize: 12 },
            data: topCategories.map((item) => item.name),
        },
    });
    radarChart.setOption({
        title: { show: false },
        radar: {
            radius: '78%',
            center: ['55%', '55%'],
            indicator: data.radarLabels.map((label) => ({ name: label, max: 100 })),
            axisName: { color: themeText, fontSize: 13, fontWeight: 'bold' },
            splitArea: {
                show: true,
                areaStyle: { color: ['rgba(211, 166, 87, 0.04)', 'rgba(211, 166, 87, 0.09)'] },
            },
            splitLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.18)' } },
            axisLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.18)' } },
        },
        series: [{
                type: 'radar',
                data: [{
                        value: data.radarValues,
                        name: `${data.title}防御`,
                        areaStyle: { color: 'rgba(211, 166, 87, 0.28)' },
                        lineStyle: { color: '#d3a657', width: 2.5 },
                        itemStyle: { color: '#d3a657' },
                    }],
            }],
    });
    pieChart.setOption({
        legend: {
            orient: 'horizontal',
            bottom: 5,
            left: 'center',
            itemWidth: 12,
            itemHeight: 10,
            textStyle: { color: lightText, fontSize: 13 },
        },
        series: [{
                type: 'pie',
                radius: ['48%', '82%'],
                center: ['50%', '45%'],
                avoidLabelOverlap: false,
                label: { show: false },
                labelLine: { show: false },
                itemStyle: { borderWidth: 0, shadowBlur: 16, shadowColor: 'rgba(0, 0, 0, 0.12)' },
                emphasis: { scale: true, scaleSize: 8 },
                data: data.materialDistribution.map((item, index) => ({
                    ...item,
                    itemStyle: { color: chartColors[index % chartColors.length] },
                })),
            }],
    });
    try {
        const resp = await fetch('/china.json');
        const chinaJson = await resp.json();
        echarts.registerMap('china', chinaJson);
        mapChart.setOption({
            graphic: [
                {
                    type: 'text',
                    right: 20,
                    bottom: 20,
                    style: {
                        text: '中国地图审图号：CS（2024）0650号',
                        fill: 'rgba(255, 255, 255, 0.45)',
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
                emphasis: { label: { show: false }, itemStyle: { areaColor: '#B8D4F9' } },
                itemStyle: {
                    areaColor: '#D2E0F7',
                    borderColor: '#A8C6F0',
                    borderWidth: 2.5,
                    shadowColor: 'rgba(210, 224, 247, 0.55)',
                    shadowBlur: 36,
                },
                regions: [
                    {
                        name: '南海诸岛',
                        itemStyle: {
                            opacity: 0
                        },
                        label: {
                            show: false
                        }
                    },
                    ...data.mapRegions.map((name) => ({
                        name,
                        itemStyle: { areaColor: '#cf9a43' },
                    })),
                ],
            },
            series: [{
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: [{ name: data.mapPoint.name, value: [...data.mapPoint.coords, 180] }],
                    symbolSize: 32,
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke',
                        color: '#7FB6FF',
                        period: 3.2,
                        scale: 6.5,
                        number: 3,
                    },
                    label: {
                        show: true,
                        formatter: '{b}',
                        position: 'right',
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: 'bold',
                        distance: 10,
                        textBorderColor: 'rgba(0,0,0,0.4)',
                        textBorderWidth: 2.5,
                    },
                    itemStyle: {
                        color: '#7FB6FF',
                        shadowBlur: 30,
                        shadowColor: 'rgba(127, 182, 255, 0.9)',
                    },
                    zlevel: 1,
                }],
        });
    }
    catch (error) {
        console.warn('无法加载 china.json，地图跳过', error);
    }
    sankeyChart.setOption({
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
            lineStyle: { color: 'gradient', curveness: 0.45, opacity: 0.16 },
            data: data.sankeyData.nodes.map((item, index) => ({
                ...item,
                itemStyle: { color: `${chartColors[index % chartColors.length]}99`, borderWidth: 0 },
            })),
            links: data.sankeyData.links,
            label: { color: lightText, fontSize: 13, fontWeight: 'normal' },
        },
    });
    cloudChart.setOption({
        series: [{
                type: 'wordCloud',
                shape: 'square',
                sizeRange: [24, 120],
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
                    color: (params: {
                        dataIndex: number;
                    }) => chartColors[params.dataIndex % chartColors.length],
                },
                emphasis: {
                    focus: 'self',
                    textStyle: { shadowBlur: 18, shadowColor: 'rgba(0, 0, 0, 0.45)' },
                },
                data: data.words.slice(0, 13).map((item) => ({
                    name: item.text,
                    value: item.weight,
                })),
            }],
    });
    const gauges = data.gauges.slice(0, 3);
    gauges.forEach((gauge, index) => {
        initGauge(`chart-g${index + 1}`, gauge.label, gauge.value, gauge.display, gauge.color);
    });
    if (gauges.length > 0 && gauges.length < 3) {
        const fallback = gauges[gauges.length - 1];
        for (let index = gauges.length; index < 3; index += 1) {
            initGauge(`chart-g${index + 1}`, fallback.label, fallback.value, fallback.display, fallback.color);
        }
    }
    const charts = [lineChart, categoryChart, radarChart, pieChart, mapChart, sankeyChart, cloudChart];
    const onResize = () => {
        charts.forEach((chart) => chart.resize());
        ['chart-g1', 'chart-g2', 'chart-g3'].forEach((id) => {
            const dom = document.getElementById(id);
            if (!dom)
                return;
            echarts.getInstanceByDom(dom)?.resize();
        });
    };
    window.addEventListener('resize', onResize);
    return () => {
        window.removeEventListener('resize', onResize);
        ids.forEach((id) => {
            const dom = document.getElementById(id);
            if (!dom)
                return;
            echarts.getInstanceByDom(dom)?.dispose();
        });
    };
}
