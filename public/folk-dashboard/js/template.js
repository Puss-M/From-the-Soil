(function () {
  const COLORS = ['#db5b61', '#66427e', '#52b9c7', '#baa151', '#4f7de0', '#df8a5f'];
  const textLight = 'rgba(154, 106, 46, 0.95)';
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const charts = [];

  function fitScreen() {
    const baseWidth = 1920;
    const baseHeight = 1080;
    const scaleX = window.innerWidth / baseWidth;
    const scaleY = window.innerHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);
    const screen = document.getElementById('screen');
    if (!screen) return;

    const realWidth = baseWidth * scale;
    const realHeight = baseHeight * scale;
    screen.style.transform = `scale(${scale})`;
    screen.style.transformOrigin = 'left top';
    screen.style.left = `${(window.innerWidth - realWidth) / 2}px`;
    screen.style.top = `${(window.innerHeight - realHeight) / 2}px`;
  }

  function axisStyle() {
    return {
      axisLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.2)' } },
      axisTick: { show: false },
      axisLabel: { color: '#8a5a1f', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.05)' } }
    };
  }

  function getStationId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('stationId') || 'huizhou';
  }

  function setText(id, value) {
    const dom = document.getElementById(id);
    if (dom) dom.textContent = value;
  }

  function renderMetrics(metrics) {
    const grid = document.getElementById('metric-grid');
    if (!grid) return;
    grid.innerHTML = metrics.map((metric) => (
      `<div class="metric-item"><div class="metric-value">${metric.value}</div><div class="metric-label">${metric.label}</div></div>`
    )).join('');
  }

  function renderHistory(items) {
    const notes = document.getElementById('history-notes');
    const labels = document.getElementById('history-labels');
    if (!notes || !labels) return;
    notes.innerHTML = items.map((item) => (
      `<div>${String(item.text || '').split('\n').map((line) => `<div>${line}</div>`).join('')}</div>`
    )).join('');
    labels.innerHTML = items.map((item) => `<span>${item.era}</span>`).join('');
  }

  function initGauge(id, label, value, display, color) {
    const dom = document.getElementById(id);
    if (!dom) return;
    const chart = echarts.init(dom);
    chart.setOption({
      title: {
        text: label,
        left: 'center',
        top: 6,
        textStyle: { color: '#9a6a2e', fontSize: 14, fontWeight: 'bold' }
      },
      series: [{
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
              [1, 'rgba(139, 91, 31, 0.16)']
            ]
          }
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        pointer: {
          icon: 'path://M6 0 L0 48 L12 48 Z',
          width: 8,
          length: '54%',
          itemStyle: { color: '#d59c4a' }
        },
        anchor: { show: true, size: 7, itemStyle: { color: '#d59c4a' } },
        detail: {
          offsetCenter: [0, '34%'],
          color: color,
          fontSize: 18,
          fontWeight: 800,
          formatter: function () { return display; }
        },
        data: [{ value: value }]
      }]
    });
    charts.push(chart);
  }

  function initCharts(data) {
    const lineChart = echarts.init(document.getElementById('chart-line'));
    const categoryChart = echarts.init(document.getElementById('chart-category'));
    const radarChart = echarts.init(document.getElementById('chart-radar'));
    const pieChart = echarts.init(document.getElementById('chart-pie'));
    const mapChart = echarts.init(document.getElementById('chart-map'));
    const sankeyChart = echarts.init(document.getElementById('chart-sankey'));
    const cloudChart = echarts.init(document.getElementById('chart-wordcloud'));

    charts.push(lineChart, categoryChart, radarChart, pieChart, mapChart, sankeyChart, cloudChart);

    const precipMax = Math.ceil(Math.max.apply(null, data.monthlyPrecipitation.concat([100])) / 30) * 30;
    const radarMax = Math.ceil(Math.max.apply(null, data.radarValues.concat([100])) / 20) * 20;

    lineChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 48, right: 38, top: 38, bottom: 38 },
      legend: {
        top: 6,
        right: 22,
        itemWidth: 15,
        itemHeight: 10,
        textStyle: { color: textLight, fontSize: 11 }
      },
      xAxis: [{ type: 'category', data: months, ...axisStyle() }],
      yAxis: [
        { type: 'value', min: 0, max: precipMax, interval: Math.max(10, Math.round(precipMax / 5)), ...axisStyle() },
        { type: 'value', min: -30, max: 30, interval: 10, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#8a5a1f', fontSize: 10 }, splitLine: { show: false } }
      ],
      series: [
        {
          name: '月降水量',
          type: 'bar',
          barWidth: 17,
          itemStyle: { color: '#58c8d2', borderRadius: [8, 8, 0, 0] },
          data: data.monthlyPrecipitation
        },
        {
          name: '月均温度',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          symbol: 'circle',
          symbolSize: 7,
          lineStyle: { width: 3, color: '#c8954d' },
          itemStyle: { color: '#d7b06e' },
          data: data.monthlyTemperature
        }
      ]
    });

    categoryChart.setOption({
      series: [{
        type: 'pie',
        radius: ['0%', '58%'],
        center: ['50%', '50%'],
        roseType: 'area',
        label: { show: false },
        data: data.categoryDistribution.map(function (item, index) {
          return Object.assign({}, item, { itemStyle: { color: COLORS[index % COLORS.length] } });
        })
      }],
      legend: {
        show: true,
        bottom: 2,
        left: 'center',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: textLight, fontSize: 10 }
      }
    });

    radarChart.setOption({
      radar: {
        radius: '78%',
        center: ['55%', '55%'],
        indicator: data.radarLabels.map(function (label) { return { name: label, max: radarMax }; }),
        axisName: { color: '#8a5a1f', fontSize: 11, fontWeight: 'bold' },
        splitArea: { show: true, areaStyle: { color: ['rgba(211, 166, 87, 0.04)', 'rgba(211, 166, 87, 0.09)'] } },
        splitLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.18)' } },
        axisLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.18)' } }
      },
      series: [{
        type: 'radar',
        data: [{
          value: data.radarValues,
          name: data.title,
          areaStyle: { color: 'rgba(211, 166, 87, 0.28)' },
          lineStyle: { color: '#d3a657', width: 2.5 },
          itemStyle: { color: '#d3a657' }
        }]
      }]
    });

    pieChart.setOption({
      legend: {
        orient: 'horizontal',
        bottom: 5,
        left: 'center',
        itemWidth: 12,
        itemHeight: 10,
        textStyle: { color: textLight, fontSize: 11 }
      },
      series: [{
        type: 'pie',
        radius: ['48%', '82%'],
        center: ['50%', '45%'],
        label: { show: false },
        labelLine: { show: false },
        data: data.materialDistribution.map(function (item, index) {
          return Object.assign({}, item, { itemStyle: { color: COLORS[index % COLORS.length] } });
        })
      }]
    });

    mapChart.setOption({
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
          borderWidth: 1.2
        },
        emphasis: { itemStyle: { areaColor: '#cf9a43' } },
        regions: data.mapRegions.map(function (name) {
          return { name: name, itemStyle: { areaColor: '#cf9a43' } };
        })
      },
      series: [{
        type: 'scatter',
        coordinateSystem: 'geo',
        symbolSize: 14,
        data: [{ name: data.mapPoint.name, value: [data.mapPoint.coords[0], data.mapPoint.coords[1], 1] }],
        itemStyle: { color: '#d6f5ff', borderColor: '#4bb8bf', borderWidth: 3 }
      }]
    });

    sankeyChart.setOption({
      series: [{
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
        itemStyle: { borderWidth: 0, color: '#d3a04c' }
      }]
    });

    const points = data.words.slice(0, 12).map(function (item, index) {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const x = (col - 1.5) * 24 + Math.sin((index + 1) * 11.3) * 3;
      const y = (row - 1) * -18 + Math.cos((index + 1) * 15.7) * 3;
      return {
        name: item.text,
        value: [x, y, item.weight],
        itemStyle: { color: COLORS[index % COLORS.length] }
      };
    });

    cloudChart.setOption({
      xAxis: { show: false, min: -55, max: 55 },
      yAxis: { show: false, min: -48, max: 48 },
      series: [{
        type: 'scatter',
        data: points,
        symbolSize: 0,
        label: {
          show: true,
          formatter: '{b}',
          color: function (params) { return COLORS[params.dataIndex % COLORS.length]; },
          fontSize: function (params) { return Math.max(16, Math.min(40, params.value[2])); },
          fontWeight: 700,
          fontFamily: '"KaiTi", "STKaiti", serif'
        }
      }]
    });

    data.gauges.slice(0, 3).forEach(function (gauge, index) {
      initGauge(`chart-g${index + 1}`, gauge.label, gauge.value, gauge.display, gauge.color);
    });
  }

  async function boot() {
    fitScreen();
    const stationId = getStationId();
    const response = await fetch(`/api/bigscreen-data/${stationId}`);
    if (!response.ok) {
      setText('screen-title', '数据缺失');
      return;
    }

    const data = await response.json();
    document.title = `${data.title}大屏`;
    setText('screen-title', data.title);
    setText('currentDate', data.preserveDate);
    setText('preserve-range', data.preserveRange);
    setText('preserve-count', data.preserveCount);
    renderMetrics(data.metrics);
    renderHistory(data.heritageTimeline.slice(0, 3));
    initCharts(data);
  }

  window.addEventListener('resize', function () {
    fitScreen();
    charts.forEach(function (chart) {
      chart.resize();
    });
  });

  boot();
})();
