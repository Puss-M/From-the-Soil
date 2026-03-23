'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import dynamic from 'next/dynamic';
import * as echarts from 'echarts';
import type { Station } from '@/types';
import type { WorldClimData } from '@/data/climateDetails';
import type { StationDetailData } from '@/data/stationDetails';
import type { HeritageInfo } from '@/data/heritageData';
import type { DecorationItem } from '@/data/decorationData';
import { MONTHS, buildHeritageDashboardData } from '@/data/heritageDashboard';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface Props {
  station: Station;
  climate: WorldClimData;
  detail: StationDetailData;
  heritage: HeritageInfo[];
  decorations: DecorationItem[];
}

const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;
const borderCyan = 'rgba(56, 198, 203, 0.8)';
const panelBg = 'rgba(220, 182, 110, 0.08)';
const numberBlue = '#18a1ea';
const textBrown = '#7f5528';

function Panel({ title, style, children }: { title: string; style?: CSSProperties; children: React.ReactNode }) {
  return (
    <section
      style={{
        position: 'relative',
        border: `2px solid ${borderCyan}`,
        background: panelBg,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 8,
          top: 6,
          fontSize: 34,
          lineHeight: 1,
          color: 'rgba(255,255,255,0.16)',
          fontFamily: '"KaiTi", "STKaiti", serif',
          pointerEvents: 'none',
        }}
      >
        墨
      </div>
      <div style={{ position: 'absolute', left: 10, top: 10, width: 18, height: 18, borderLeft: `3px solid ${borderCyan}`, borderTop: `3px solid ${borderCyan}`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 10, top: 10, width: 18, height: 18, borderRight: `3px solid ${borderCyan}`, borderTop: `3px solid ${borderCyan}`, pointerEvents: 'none' }} />
      <div
        style={{
          position: 'absolute',
          left: 10,
          top: -34,
          color: textBrown,
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: 1,
          fontFamily: '"KaiTi", "STKaiti", serif',
        }}
      >
        {title}
      </div>
      <div style={{ position: 'relative', height: '100%', padding: '18px 8px 8px' }}>{children}</div>
    </section>
  );
}

function Gauge({ label, value, display, color }: { label: string; value: number; display: string; color: string }) {
  const option = useMemo(
    () => ({
      backgroundColor: 'transparent',
      series: [
        {
          type: 'gauge',
          min: 0,
          max: 100,
          startAngle: 210,
          endAngle: -30,
          center: ['50%', '68%'],
          radius: '88%',
          axisLine: {
            lineStyle: {
              width: 10,
              color: [
                [value / 100, color],
                [1, 'rgba(255,255,255,0.32)'],
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
            color: color,
            fontSize: 18,
            fontWeight: 800,
            formatter: () => display,
          },
          data: [{ value }],
        },
      ],
    }),
    [color, display, value]
  );

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ color: '#f3d89f', fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{label}</div>
      <ReactECharts option={option} style={{ height: 114 }} />
    </div>
  );
}

function CategoryPetals({ data }: { data: Array<{ name: string; value: number }> }) {
  const petals = ['#dc5d5a', '#6f3f69', '#41b4c4', '#b9a04c'];
  const labels = data.slice(0, 4);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', left: '50%', top: '47%', width: 210, height: 170, transform: 'translate(-50%, -50%)' }}>
        {[
          { left: 36, top: 52 },
          { left: 68, top: 12 },
          { left: 100, top: 52 },
          { left: 68, top: 92 },
        ].map((pos, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: pos.left,
              top: pos.top,
              width: 78,
              height: 78,
              borderRadius: '50%',
              background: petals[idx],
              opacity: 0.9,
              mixBlendMode: 'multiply',
            }}
          />
        ))}
      </div>
      <div style={{ position: 'absolute', left: 18, right: 18, bottom: 2, display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 6 }}>
        {labels.map((item, index) => (
          <div key={item.name} style={{ fontSize: 11, color: '#7d5a34', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, background: petals[index], borderRadius: 2 }} />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryTimeline({ items }: { items: Array<{ era: string; text: string }> }) {
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div style={{ position: 'absolute', left: 40, right: 40, bottom: 26, height: 8, background: 'linear-gradient(90deg,#39bcc4 0 34%, #be9a56 34% 67%, #d14664 67% 100%)', borderRadius: 999 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', height: '100%' }}>
        {items.slice(0, 3).map((item, idx) => (
          <div key={item.era} style={{ textAlign: 'center', color: textBrown, paddingTop: 8 }}>
            <div style={{ minHeight: 78, fontSize: 13, lineHeight: 1.45, whiteSpace: 'pre-line', fontWeight: 700 }}>{item.text}</div>
            <div style={{ fontSize: 30, fontFamily: '"KaiTi", "STKaiti", serif', color: ['#2eb9c2', '#be9a56', '#cf4665'][idx] }}>{item.era}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeritageDashboard({ station, climate, detail, heritage, decorations }: Props) {
  const [geoLoaded, setGeoLoaded] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [frameScale, setFrameScale] = useState(1);

  useEffect(() => {
    let mounted = true;
    fetch('/china.json')
      .then((res) => res.json())
      .then((geo) => {
        if (!mounted) return;
        echarts.registerMap('china-dashboard', geo);
        setGeoLoaded(true);
      })
      .catch(() => setGeoLoaded(false));

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const update = () => {
      const rect = frame.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      setFrameScale(Math.min(1, rect.width / BASE_WIDTH, rect.height / BASE_HEIGHT));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  const dashboard = useMemo(
    () => buildHeritageDashboardData({ station, climate, detail, heritage, decorations }),
    [station, climate, detail, heritage, decorations]
  );

  const climateOption = useMemo(
    () => ({
      backgroundColor: 'transparent',
      grid: { left: 48, right: 42, top: 26, bottom: 40 },
      legend: {
        data: ['月降水量(mm)', '月均温度(℃)'],
        bottom: 2,
        itemWidth: 18,
        textStyle: { color: '#a57d49', fontSize: 11 },
      },
      xAxis: {
        type: 'category' as const,
        data: MONTHS,
        axisLabel: { color: '#9b7748', fontSize: 11 },
        axisLine: { lineStyle: { color: '#b98d4f' } },
      },
      yAxis: [
        {
          type: 'value' as const,
          axisLabel: { color: '#9b7748', fontSize: 11 },
          splitLine: { show: false },
          min: 0,
          max: Math.max(180, Math.ceil(Math.max(...dashboard.monthlyPrecipitation) / 30) * 30),
        },
        {
          type: 'value' as const,
          axisLabel: { color: '#9b7748', fontSize: 11 },
          splitLine: { show: false },
          min: -30,
          max: 30,
        },
      ],
      series: [
        {
          name: '月降水量(mm)',
          type: 'bar',
          data: dashboard.monthlyPrecipitation,
          barWidth: 18,
          itemStyle: { color: '#47b7bd', borderRadius: [10, 10, 3, 3] },
        },
        {
          name: '月均温度(℃)',
          type: 'line',
          data: dashboard.monthlyTemperature,
          yAxisIndex: 1,
          smooth: true,
          symbolSize: 6,
          lineStyle: { color: '#d0a25f', width: 2.3 },
          itemStyle: { color: '#d0a25f' },
        },
      ],
    }),
    [dashboard.monthlyPrecipitation, dashboard.monthlyTemperature]
  );

  const materialOption = useMemo(
    () => ({
      backgroundColor: 'transparent',
      legend: {
        bottom: 0,
        textStyle: { color: '#9b7748', fontSize: 12 },
        itemWidth: 14,
      },
      series: [
        {
          type: 'pie',
          radius: ['32%', '56%'],
          center: ['50%', '48%'],
          data: dashboard.materialDistribution,
          label: { show: false },
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(0,0,0,0.12)',
          },
        },
      ],
      color: ['#f3e8cf', '#4ac0c8', '#6d96ff', '#ef7083', '#e4b354', '#7f67d3'],
    }),
    [dashboard.materialDistribution]
  );

  const radarOption = useMemo(
    () => ({
      backgroundColor: 'transparent',
      radar: {
        radius: '72%',
        indicator: dashboard.radarLabels.map((name) => ({ name, max: 100 })),
        splitNumber: 5,
        axisName: { color: '#8a6130', fontSize: 14, fontWeight: 700 },
        splitLine: { lineStyle: { color: 'rgba(183,145,85,0.35)' } },
        splitArea: { areaStyle: { color: ['rgba(255,255,255,0)', 'rgba(216,178,113,0.12)'] } },
        axisLine: { lineStyle: { color: 'rgba(183,145,85,0.35)' } },
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: dashboard.radarValues,
              areaStyle: { color: 'rgba(216,178,113,0.32)' },
              lineStyle: { color: '#d29f55', width: 2.5 },
              itemStyle: { color: '#d29f55' },
            },
          ],
        },
      ],
    }),
    [dashboard.radarLabels, dashboard.radarValues]
  );

  const mapOption = useMemo(
    () => ({
      backgroundColor: 'transparent',
      geo: {
        map: 'china-dashboard',
        roam: false,
        zoom: 1.08,
        top: '8%',
        layoutCenter: ['50%', '54%'],
        layoutSize: '90%',
        itemStyle: {
          areaColor: '#dca74d',
          borderColor: 'rgba(255,255,255,0.8)',
          borderWidth: 1.2,
          shadowBlur: 10,
          shadowColor: 'rgba(0,0,0,0.2)',
        },
        emphasis: { itemStyle: { areaColor: '#cf9a43' } },
      },
      series: [
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          symbolSize: 18,
          data: [{ name: dashboard.mapPoint.name, value: [...dashboard.mapPoint.coords, 1] }],
          itemStyle: { color: '#d6f5ff', borderColor: '#4bb8bf', borderWidth: 4 },
        },
      ],
    }),
    [dashboard.mapPoint]
  );

  const sankeyOption = useMemo(
    () => ({
      backgroundColor: 'transparent',
      series: [
        {
          type: 'sankey',
          top: '12%',
          bottom: '8%',
          left: '2%',
          right: '24%',
          nodeGap: 7,
          data: dashboard.sankeyData.nodes,
          links: dashboard.sankeyData.links,
          lineStyle: { color: 'gradient', opacity: 0.36, curveness: 0.5 },
          label: { color: '#8a6332', fontSize: 11, fontWeight: 700 },
          itemStyle: { borderWidth: 0, color: '#d3a04c' },
        },
      ],
    }),
    [dashboard.sankeyData]
  );

  const wordCloudOption = useMemo(() => {
    const rows = 4;
    const cols = 4;
    const colors = ['#d43030', '#1ea7de', '#a63bb7', '#d79c12', '#2fa282', '#2578d1'];
    const points = dashboard.words.slice(0, 16).map((item, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const x = (col - (cols - 1) / 2) * 22 + Math.sin((index + 1) * 11.3) * 3;
      const y = (row - (rows - 1) / 2) * -18 + Math.cos((index + 1) * 15.7) * 3;

      return {
        name: item.text,
        value: [x, y, item.weight] as [number, number, number],
        itemStyle: { color: colors[index % colors.length] },
      };
    });

    type LabelParam = { value: [number, number, number] };

    return {
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
            fontSize: (params: LabelParam) => Math.max(18, params.value[2] * 0.66),
            fontWeight: 700,
            fontFamily: '"KaiTi", "STKaiti", serif',
            textShadowBlur: 4,
            textShadowColor: 'rgba(255,255,255,0.56)',
          },
        },
      ],
    };
  }, [dashboard.words]);

  const metrics = dashboard.metrics.slice(0, 6);

  return (
    <div
      ref={frameRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${frameScale})`,
          transformOrigin: 'left top',
          background:
            'linear-gradient(180deg, rgba(244,226,177,0.82), rgba(236,215,164,0.78)), url("/beijing-siheyuan/custom-bg.jpg") center center / cover no-repeat',
          boxShadow: '0 16px 50px rgba(0,0,0,0.18)',
          color: textBrown,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(245,236,208,0.68), rgba(245,236,208,0.68))' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% -4%, rgba(255,255,255,0.58), rgba(255,255,255,0))' }} />

        <div style={{ position: 'absolute', left: 56, top: 88, width: 1808, height: 948 }}>
          <div
            style={{
              position: 'absolute',
              left: 720,
              top: 0,
              width: 320,
              height: 86,
              display: 'grid',
              placeItems: 'center',
              border: '1px solid rgba(207, 190, 151, 0.7)',
              background: 'rgba(240, 226, 190, 0.12)',
              color: '#af7418',
              fontFamily: '"KaiTi", "STKaiti", serif',
              fontWeight: 700,
              fontSize: 34,
            }}
          >
            {dashboard.title}
          </div>

          <div style={{ position: 'absolute', left: 24, top: 40, width: 470, height: 134 }}>
            <Panel title="温雨双折图">
              <ReactECharts option={climateOption} style={{ height: '100%' }} />
            </Panel>
          </div>

          <div style={{ position: 'absolute', left: 530, top: 82, width: 520, height: 138 }}>
            <Panel title="分布地数据">
              <div style={{ height: '100%', padding: '8px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'repeat(2,1fr)', gap: 8 }}>
                {metrics.map((metric) => (
                  <div key={metric.label} style={{ border: '2px solid rgba(86,203,197,.48)', display: 'grid', placeItems: 'center', background: 'rgba(223, 183, 114, 0.08)' }}>
                    <div style={{ color: numberBlue, fontSize: 20, fontWeight: 700, lineHeight: 1 }}>{metric.value}</div>
                    <div style={{ color: '#f8f1dd', fontSize: 13, marginTop: 0, fontWeight: 600 }}>{metric.label}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div style={{ position: 'absolute', left: 1068, top: 40, width: 490, height: 134 }}>
            <Panel title="分类                        防御指数">
              <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <CategoryPetals data={dashboard.categoryDistribution} />
                <ReactECharts option={radarOption} style={{ height: '100%' }} />
              </div>
            </Panel>
          </div>

          <div style={{ position: 'absolute', left: 24, top: 320, width: 470, height: 134 }}>
            <Panel title="建材环形图">
              <ReactECharts option={materialOption} style={{ height: '100%' }} />
            </Panel>
          </div>

          <div style={{ position: 'absolute', left: 530, top: 314, width: 520, height: 142 }}>
            <Panel title="分布图">
              {geoLoaded ? (
                <ReactECharts option={mapOption} style={{ height: '100%' }} />
              ) : (
                <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: '#9b7849' }}>地图加载中...</div>
              )}
            </Panel>
          </div>

          <div style={{ position: 'absolute', left: 1068, top: 372, width: 490, height: 146 }}>
            <Panel title="历史进程图">
              <HistoryTimeline items={dashboard.heritageTimeline} />
            </Panel>
          </div>

          <div style={{ position: 'absolute', left: 24, top: 634, width: 470, height: 108 }}>
            <Panel title="构造桑基图">
              <ReactECharts option={sankeyOption} style={{ height: '100%' }} />
            </Panel>
          </div>

          <div style={{ position: 'absolute', left: 530, top: 700, width: 520, height: 182 }}>
            <Panel title="保护状况">
              <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '170px 1fr', gap: 8, padding: '6px 6px 0 10px' }}>
                <div style={{ paddingLeft: 2 }}>
                  <div style={{ color: '#f0e7c9', fontWeight: 700, fontSize: 14 }}>{dashboard.preserveDate}</div>
                  <div style={{ color: '#df4554', fontSize: 30, fontWeight: 800, marginTop: 10 }}>{dashboard.preserveRange}</div>
                  <div style={{ color: '#f4ebd4', fontSize: 14, marginTop: 10, fontWeight: 600 }}>现存四合院数量</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
                  {dashboard.gauges.map((gauge) => (
                    <Gauge key={gauge.label} label={gauge.label} value={gauge.value} display={gauge.display} color={gauge.color} />
                  ))}
                </div>
              </div>
            </Panel>
          </div>

          <div style={{ position: 'absolute', left: 1068, top: 546, width: 490, height: 130 }}>
            <Panel title="分布词云图">
              <ReactECharts option={wordCloudOption} style={{ height: '100%' }} />
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
