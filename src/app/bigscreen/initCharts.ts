import * as echarts from 'echarts';
import type { HeritageDashboardData } from '@/data/heritageDashboard';
import { MONTHS } from '@/data/heritageDashboard';

const textLight = 'rgba(255,255,255,0.86)';
const chartColors = ['#db5b61', '#66427e', '#52b9c7', '#baa151', '#4f7de0', '#df8a5f'];

function axisStyle() {
  return {
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.45)' } },
    axisTick: { show: false },
    axisLabel: { color: textLight, fontSize: 11 },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.12)' } },
  };
}

function initGauge(id: string, label: string, value: number, display: string, color: string) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const chart = echarts.init(dom);

  chart.setOption({
    title: {
      text: label,
      left: 'center',
      top: 6,
      textStyle: { color: '#f7f0db', fontSize: 14, fontWeight: 'bold' },
    },
    series: [
      {
        type: 'gauge',
        min: 0,
        max: 100,
        startAngle: 210,
        endAngle: -30,
        center: ['50%', '72%'],
        radius: '86%',
        axisLine: {
          lineStyle: {
            width: 10,
            color: [
              [value / 100, color],
              [1, 'rgba(255,255,255,0.3)'],
            ],
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        pointer: {
          icon: 'path://M6 0 L0 48 L12 48 Z',
          width: 8,
          length: '54%',
          itemStyle: { color: '#d59c4a' },
        },
        anchor: { show: true, size: 7, itemStyle: { color: '#d59c4a' } },
        detail: {
          offsetCenter: [0, '34%'],
          color,
          fontSize: 18,
          fontWeight: 800,
          formatter: () => display,
        },
        data: [{ value }],
      },
    ],
  });
}

export async function initBigscreenCharts(data: HeritageDashboardData) {
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
    if (!dom) return;
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

  const maxPrecip = Math.max(...data.monthlyPrecipitation, 100);
  const precipMax = Math.ceil(maxPrecip / 30) * 30;
  const maxRadar = Math.max(...data.radarValues, 100);
  const radarMax = Math.ceil(maxRadar / 20) * 20;

  lineChart.setOption({
    backgroundColor: 'transparent',
    grid: { left: 40, right: 34, top: 18, bottom: 28 },
    legend: {
      bottom: 0,
      itemWidth: 12,
      itemHeight: 8,
      textStyle: { color: textLight, fontSize: 10 },
    },
    xAxis: [{ type: 'category', data: MONTHS, ...axisStyle() }],
    yAxis: [
      { type: 'value', min: 0, max: precipMax, interval: Math.max(10, Math.round(precipMax / 6)), ...axisStyle() },
      { type: 'value', min: -30, max: 30, interval: 10, axisLabel: { color: textLight, fontSize: 11 }, splitLine: { show: false } },
    ],
    series: [
      {
        name: '月降水量(mm)',
        type: 'bar',
        barWidth: 14,
        itemStyle: { color: '#56c7d2', borderRadius: [6, 6, 0, 0] },
        data: data.monthlyPrecipitation,
      },
      {
        name: '月均温度(℃)',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: { width: 2, color: '#c69a56' },
        itemStyle: { color: '#e7c489' },
        data: data.monthlyTemperature,
      },
    ],
  });

  pieChart.setOption({
    backgroundColor: 'transparent',
    legend: { bottom: 0, itemWidth: 12, itemHeight: 10, textStyle: { color: textLight, fontSize: 11 } },
    series: [
      {
        type: 'pie',
        radius: ['40%', '64%'],
        center: ['50%', '48%'],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        itemStyle: { borderWidth: 0 },
        data: data.materialDistribution.map((item, index) => ({
          ...item,
          itemStyle: { color: chartColors[index % chartColors.length] },
        })),
      },
    ],
  });

  categoryChart.setOption({
    legend: { bottom: 0, itemWidth: 10, itemHeight: 8, textStyle: { color: textLight, fontSize: 10 } },
    series: [
      {
        type: 'pie',
        radius: ['0%', '58%'],
        center: ['50%', '50%'],
        roseType: 'area',
        label: { show: false },
        data: data.categoryDistribution.map((item, index) => ({
          ...item,
          itemStyle: { color: chartColors[index % chartColors.length] },
        })),
      },
    ],
  });

  radarChart.setOption({
    radar: {
      radius: '62%',
      center: ['50%', '54%'],
      splitNumber: 5,
      axisName: { color: '#8b5b1f', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.35)' } },
      splitArea: { areaStyle: { color: ['transparent'] } },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.35)' } },
      indicator: data.radarLabels.map((label) => ({ name: label, max: radarMax })),
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: data.radarValues,
            name: data.title,
            areaStyle: { color: 'rgba(225, 193, 127, 0.18)' },
            lineStyle: { color: '#d7b06e', width: 2 },
            itemStyle: { color: '#d7b06e' },
          },
        ],
      },
    ],
  });

  const mapRes = await fetch('/china.json');
  const chinaJson = await mapRes.json();
  echarts.registerMap('china', chinaJson);

  mapChart.setOption({
    backgroundColor: 'transparent',
    geo: {
      map: 'china',
      roam: false,
      zoom: 1,
      top: '8%',
      layoutCenter: ['50%', '54%'],
      layoutSize: '90%',
      itemStyle: {
        areaColor: '#dca74d',
        borderColor: 'rgba(255,255,255,0.8)',
        borderWidth: 1.2,
      },
      emphasis: { itemStyle: { areaColor: '#cf9a43' } },
      regions: data.mapRegions.map((name) => ({
        name,
        itemStyle: {
          areaColor: '#cf9a43',
        },
      })),
    },
    series: [
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        symbolSize: 14,
        data: [{ name: data.mapPoint.name, value: [...data.mapPoint.coords, 1] }],
        itemStyle: { color: '#d6f5ff', borderColor: '#4bb8bf', borderWidth: 3 },
      },
    ],
  });

  sankeyChart.setOption({
    backgroundColor: 'transparent',
    series: [
      {
        type: 'sankey',
        top: '14%',
        bottom: '8%',
        left: '2%',
        right: '18%',
        nodeGap: 8,
        data: data.sankeyData.nodes,
        links: data.sankeyData.links,
        lineStyle: { color: 'gradient', opacity: 0.36, curveness: 0.5 },
        label: { color: '#8a6332', fontSize: 10, fontWeight: 700 },
        itemStyle: { borderWidth: 0, color: '#d3a04c' },
      },
    ],
  });

  const points = data.words.slice(0, 9).map((item, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const x = (col - 1) * 26 + Math.sin((index + 1) * 11.3) * 3;
    const y = (row - 1) * -20 + Math.cos((index + 1) * 15.7) * 3;
    return {
      name: item.text,
      value: [x, y, item.weight] as [number, number, number],
      itemStyle: { color: chartColors[index % chartColors.length] },
    };
  });

  cloudChart.setOption({
    backgroundColor: 'transparent',
    xAxis: { show: false, min: -55, max: 55 },
    yAxis: { show: false, min: -48, max: 48 },
    series: [
      {
        type: 'scatter',
        data: points,
        symbolSize: 0,
        label: {
          show: true,
          formatter: '{b}',
          color: (params: { dataIndex: number }) => chartColors[params.dataIndex % chartColors.length],
          fontSize: (params: { value: [number, number, number] }) => Math.max(16, Math.min(40, params.value[2])),
          fontWeight: 700,
          fontFamily: '"KaiTi", "STKaiti", serif',
        },
      },
    ],
  });

  data.gauges.slice(0, 3).forEach((gauge, index) => {
    initGauge(`chart-g${index + 1}`, gauge.label, gauge.value, gauge.display, gauge.color);
  });

  if (data.gauges.length > 0 && data.gauges.length < 3) {
    const fallback = data.gauges[data.gauges.length - 1];
    for (let index = data.gauges.length; index < 3; index += 1) {
      initGauge(`chart-g${index + 1}`, fallback.label, fallback.value, fallback.display, fallback.color);
    }
  }

  const charts = [lineChart, categoryChart, radarChart, pieChart, mapChart, sankeyChart, cloudChart];

  const onResize = () => {
    charts.forEach((chart) => chart.resize());
    ['chart-g1', 'chart-g2', 'chart-g3'].forEach((id) => {
      const dom = document.getElementById(id);
      if (dom) {
        echarts.getInstanceByDom(dom)?.resize();
      }
    });
  };

  window.addEventListener('resize', onResize);

  return () => {
    window.removeEventListener('resize', onResize);
    ids.forEach((id) => {
      const dom = document.getElementById(id);
      if (!dom) return;
      echarts.getInstanceByDom(dom)?.dispose();
    });
  };
}
