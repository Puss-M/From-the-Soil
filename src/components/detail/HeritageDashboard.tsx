'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
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

const BASE_WIDTH = 1660;
const BASE_HEIGHT = 900; // Reduced base height to fit better in viewports
const inkText = '#5b4631';
const mutedInk = '#8d7356';
const goldInk = '#b1833c';
const cyanInk = '#5d8d85';
const panelWash =
  'linear-gradient(180deg, rgba(255,252,246,0.3), rgba(241,230,200,0.14)), radial-gradient(circle at 50% 0%, rgba(184,138,59,0.14), transparent 44%)';

function DashboardPanel({
  title,
  style,
  children,
}: {
  title: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        position: 'relative',
        background: panelWash,
        overflow: 'hidden',
        color: inkText,
        borderRadius: 4,
        boxShadow: 'inset 0 0 40px rgba(184,138,59,0.05)',
        ...style,
      }}
    >
      {/* Decorative Borders */}
      <div style={{ position: 'absolute', inset: '4px', border: '1px solid rgba(184,138,59,0.1)', pointerEvents: 'none' }} />
      
      {title ? (
        <div
          style={{
            position: 'absolute',
            top: 6, // Moved up slightly
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            minWidth: 200,
            color: goldInk,
            fontFamily: '"KaiTi", "STKaiti", serif',
            fontSize: 16, // Slightly smaller font
            lineHeight: 1,
            fontWeight: 700,
            letterSpacing: 1,
            zIndex: 10,
            textShadow: '0 0 8px rgba(255,255,255,0.8)',
          }}
        >
          <span style={{ width: 30, height: 1, background: 'linear-gradient(90deg, transparent, rgba(177,131,60,0.6))' }} />
          {title}
          <span style={{ width: 30, height: 1, background: 'linear-gradient(90deg, rgba(177,131,60,0.6), transparent)' }} />
        </div>
      ) : null}
      <div style={{ position: 'relative', height: '100%', paddingTop: title ? 28 : 0 }}>
        {children}
      </div>
    </section>
  );
}

function InkMountain({
  style,
  opacity = 0.22,
}: {
  style?: CSSProperties;
  opacity?: number;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        opacity,
        background:
          'radial-gradient(ellipse at 20% 80%, rgba(85,57,20,0.9) 0 18%, transparent 19%), radial-gradient(ellipse at 38% 72%, rgba(92,66,26,0.76) 0 24%, transparent 25%), radial-gradient(ellipse at 56% 78%, rgba(74,49,17,0.72) 0 20%, transparent 21%), radial-gradient(ellipse at 72% 70%, rgba(98,70,29,0.68) 0 22%, transparent 23%), radial-gradient(ellipse at 88% 82%, rgba(63,41,13,0.62) 0 16%, transparent 17%)',
        filter: 'blur(7px)',
        ...style,
      }}
    />
  );
}

function BambooBranch({
  style,
  flip = false,
}: {
  style?: CSSProperties;
  flip?: boolean;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        opacity: 0.22,
        transform: flip ? 'scaleX(-1)' : undefined,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 0,
          width: 4,
          height: '100%',
          background: 'linear-gradient(180deg, rgba(58,44,20,0.1), rgba(58,44,20,0.7), rgba(58,44,20,0.16))',
          borderRadius: 999,
        }}
      />
      {[
        { left: 4, top: 26, rotate: -24 },
        { left: 14, top: 78, rotate: -12 },
        { left: 8, top: 134, rotate: -20 },
        { left: 74, top: 40, rotate: 24 },
        { left: 86, top: 98, rotate: 12 },
        { left: 90, top: 154, rotate: 20 },
      ].map((leaf) => (
        <div
          key={`${leaf.left}-${leaf.top}`}
          style={{
            position: 'absolute',
            left: leaf.left,
            top: leaf.top,
            width: 64,
            height: 18,
            borderRadius: '100% 0 100% 0',
            background: 'linear-gradient(90deg, rgba(50,38,17,0.15), rgba(50,38,17,0.68), rgba(50,38,17,0.1))',
            transform: `rotate(${leaf.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function PlaqueFlourish({
  side,
}: {
  side: 'left' | 'right';
}) {
  const isLeft = side === 'left';

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        [isLeft ? 'left' : 'right']: -46,
        width: 56,
        height: 16,
        transform: `translateY(-50%) ${isLeft ? '' : 'scaleX(-1)'}`,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 7,
          width: 30,
          height: 2,
          background: 'linear-gradient(90deg, rgba(202,170,111,0), rgba(202,170,111,0.9), rgba(202,170,111,0.2))',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 28,
          top: 3,
          width: 18,
          height: 10,
          borderTop: '2px solid rgba(202,170,111,0.72)',
          borderRight: '2px solid rgba(202,170,111,0.72)',
          transform: 'skewX(-30deg)',
        }}
      />
        <div
          style={{
            position: 'absolute',
            left: 42,
            top: 6,
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'rgba(177,131,60,0.9)',
          }}
        />
      </div>
  );
}

function Gauge({
  label,
  value,
  color,
  display,
}: {
  label: string;
  value: number;
  color: string;
  display: string;
}) {
  const option = useMemo(() => ({
    backgroundColor: 'transparent',
    series: [
      {
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 100,
        splitNumber: 10,
        radius: '94%',
        center: ['50%', '66%'],
        axisLine: {
          lineStyle: {
            width: 11,
            color: [
              [value / 100, color],
              [1, 'rgba(255,255,255,0.5)'],
            ],
          },
        },
        progress: { show: false },
        axisTick: { distance: -14, splitNumber: 4, lineStyle: { color: 'rgba(177,131,60,0.36)', width: 1 } },
        splitLine: { distance: -16, length: 8, lineStyle: { color: 'rgba(177,131,60,0.5)', width: 1.2 } },
        axisLabel: { show: false },
        pointer: {
          icon: 'path://M4 0 L0 50 L8 50 Z',
          width: 10,
          length: '54%',
          offsetCenter: [0, '-2%'],
          itemStyle: { color: goldInk },
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 9,
          itemStyle: { color: goldInk },
        },
        detail: {
          valueAnimation: false,
          offsetCenter: [0, '35%'],
          color: goldInk,
          fontSize: 16,
          fontWeight: 800,
          formatter: () => display,
        },
        data: [{ value }],
      },
    ],
  }), [color, display, value]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 12, color: inkText, fontWeight: 700, marginBottom: 2 }}>{label}</div>
      <ReactECharts option={option} style={{ height: 104 }} />
    </div>
  );
}

export function HeritageDashboard({ station, climate, detail, heritage, decorations }: Props) {
  const [geoLoaded, setGeoLoaded] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [frameScale, setFrameScale] = useState(1);
  const [isCompactViewport, setIsCompactViewport] = useState(false);

  useEffect(() => {
    let active = true;

    fetch('/china.json')
      .then((res) => res.json())
      .then((data) => {
        if (!active) {
          return;
        }
        echarts.registerMap('china-dashboard', data);
        setGeoLoaded(true);
      })
      .catch(() => {
        if (active) {
          setGeoLoaded(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }

    const updateScale = () => {
      const { width, height } = frame.getBoundingClientRect();
      if (!width || !height) {
        return;
      }

      // Less aggressive threshold so normal laptops scale instead of clipping.
      const compact = width < 1024 || height < 600;
      setIsCompactViewport(compact);
      // Give a tiny padding (20px) to prevent bottom edge clipping
      setFrameScale(compact ? 1 : Math.min(1, (width - 20) / BASE_WIDTH, (height - 20) / BASE_HEIGHT));
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(frame);
    window.addEventListener('resize', updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  const dashboard = useMemo(
    () => buildHeritageDashboardData({ station, climate, detail, heritage, decorations }),
    [station, climate, detail, heritage, decorations]
  );

  const climateSeasonOption = useMemo(() => ({
    backgroundColor: 'transparent',
    textStyle: { fontFamily: '"Noto Sans SC", "Microsoft YaHei", sans-serif' },
    animationDuration: 500,
    grid: { left: 42, right: 38, top: 28, bottom: 40 },
    tooltip: { trigger: 'axis' as const },
    legend: {
      data: ['月降水量(mm)', '月均温度(℃)'],
      bottom: 2,
      itemWidth: 18,
      itemHeight: 10,
      textStyle: { color: mutedInk, fontSize: 11 },
    },
    xAxis: {
      type: 'category' as const,
      data: MONTHS,
      axisLine: { lineStyle: { color: 'rgba(177,131,60,0.46)' } },
      axisLabel: { color: mutedInk, fontSize: 10 },
      axisTick: { show: false },
    },
    yAxis: [
      {
        type: 'value' as const,
        min: 0,
        max: Math.max(180, Math.ceil(Math.max(...dashboard.monthlyPrecipitation) / 30) * 30),
        axisLine: { show: true, lineStyle: { color: 'rgba(177,131,60,0.38)' } },
        axisLabel: { color: mutedInk, fontSize: 10 },
        splitLine: { show: false },
      },
      {
        type: 'value' as const,
        min: -35,
        max: 35,
        axisLine: { show: true, lineStyle: { color: 'rgba(93,141,133,0.38)' } },
        axisLabel: { color: mutedInk, fontSize: 10 },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '月降水量(mm)',
        type: 'bar',
        data: dashboard.monthlyPrecipitation,
        barWidth: 16,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#8fc0ba' },
            { offset: 0.55, color: '#6ea49c' },
            { offset: 1, color: '#4f8179' },
          ]),
          borderRadius: [12, 12, 3, 3],
        },
        z: 3,
      },
      {
        name: '月均温度(℃)',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: dashboard.monthlyTemperature,
        symbolSize: 5,
        lineStyle: { color: goldInk, width: 2.4 },
        itemStyle: { color: '#f7f1e3', borderColor: goldInk, borderWidth: 1.5 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(191,130,84,0.16)' },
            { offset: 1, color: 'rgba(191,130,84,0)' },
          ]),
        },
        z: 4,
      },
    ],
  }), [dashboard.monthlyPrecipitation, dashboard.monthlyTemperature]);

  const materialOption = useMemo(() => ({
    backgroundColor: 'transparent',
    textStyle: { fontFamily: '"Noto Sans SC", "Microsoft YaHei", sans-serif' },
    tooltip: { trigger: 'item' as const },
    legend: {
      bottom: 0,
      itemWidth: 18,
      itemHeight: 10,
      textStyle: { color: mutedInk, fontSize: 11 },
    },
    series: [
      {
        type: 'pie',
        radius: ['34%', '62%'],
        center: ['50%', '48%'],
        silent: true,
        z: 0,
        label: { show: false },
        labelLine: { show: false },
          itemStyle: {
          color: 'rgba(111, 84, 48, 0.18)',
        },
        data: dashboard.materialDistribution.map((item) => ({ value: item.value })),
      },
      {
        type: 'pie',
        radius: ['34%', '62%'],
        center: ['50%', '41%'],
        label: { show: false },
        labelLine: { show: false },
        itemStyle: {
          borderWidth: 0,
          shadowBlur: 18,
          shadowColor: 'rgba(0,0,0,0.18)',
        },
        data: dashboard.materialDistribution.map((item, index) => ({
          ...item,
          itemStyle: {
            color: [
              new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: '#9fc7c2' },
                { offset: 1, color: '#5d8d85' },
              ]),
              new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: '#d7bb89' },
                { offset: 1, color: '#b1833c' },
              ]),
              new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: '#c8d6cf' },
                { offset: 1, color: '#7b9b90' },
              ]),
              new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: '#c8a887' },
                { offset: 1, color: '#8b6846' },
              ]),
            ][index % 4],
          },
        })),
        z: 3,
      },
      {
        type: 'pie',
        radius: ['0%', '24%'],
        center: ['50%', '41%'],
        silent: true,
        z: 4,
        label: { show: false },
        labelLine: { show: false },
        itemStyle: {
          color: new echarts.graphic.RadialGradient(0.45, 0.35, 0.8, [
            { offset: 0, color: 'rgba(255,255,255,0.48)' },
            { offset: 0.4, color: 'rgba(177,131,60,0.18)' },
            { offset: 1, color: 'rgba(126,86,31,0.04)' },
          ]),
        },
        data: [{ value: 1 }],
      },
    ],
  }), [dashboard.materialDistribution]);

  const radarOption = useMemo(() => ({
    backgroundColor: 'transparent',
    textStyle: { fontFamily: '"Noto Sans SC", "Microsoft YaHei", sans-serif' },
    radar: {
      radius: '72%',
      splitNumber: 5,
      indicator: [
        { name: '防火', max: 100 },
        { name: '防水', max: 100 },
        { name: '防风沙', max: 100 },
        { name: '防御性', max: 100 },
        { name: '文化适应', max: 100 },
      ],
      axisName: { color: inkText, fontSize: 12, fontWeight: 700 },
      splitLine: { lineStyle: { color: 'rgba(177,131,60,0.24)' } },
      splitArea: { areaStyle: { color: ['rgba(255,255,255,0)', 'rgba(184,138,59,0.04)'] } },
      axisLine: { lineStyle: { color: 'rgba(93,141,133,0.22)' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: dashboard.radarValues,
            areaStyle: { color: 'rgba(177,131,60,0.16)' },
            lineStyle: { color: goldInk, width: 2.5 },
            itemStyle: { color: goldInk },
          },
        ],
      },
    ],
  }), [dashboard.radarValues]);

  const mapOption = useMemo(() => ({
    backgroundColor: 'transparent',
    textStyle: { fontFamily: '"Noto Sans SC", "Microsoft YaHei", sans-serif' },
    tooltip: { trigger: 'item' as const, formatter: '{b}' },
    geo: {
      map: 'china-dashboard',
      roam: false,
      zoom: 1.08,
      top: '10%',
      layoutCenter: ['49%', '53%'],
      layoutSize: '92%',
      itemStyle: {
        areaColor: '#d8c39a',
        borderColor: 'rgba(255,252,244,0.72)',
        borderWidth: 1.1,
      },
      emphasis: {
        itemStyle: { areaColor: '#caa76b' },
      },
    },
    series: [
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        symbolSize: 22,
        data: [{ name: dashboard.mapPoint.name, value: [...dashboard.mapPoint.coords, 1] }],
        itemStyle: {
          color: '#f8f1df',
          borderColor: goldInk,
          borderWidth: 4,
        },
      },
    ],
  }), [dashboard.mapPoint]);

  const sankeyOption = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
    series: [
      {
        type: 'sankey',
        data: dashboard.sankeyData.nodes,
        links: dashboard.sankeyData.links,
        top: '15%',
        bottom: '10%',
        left: '2%',
        right: '28%', // Increased further for labels
        nodeGap: 8,
        emphasis: { focus: 'adjacent' },
        lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.3 },
        itemStyle: { borderWidth: 1, borderColor: goldInk, borderRadius: 2 },
        label: {
          position: 'right',
          distance: 6,
          color: inkText,
          fontSize: 10,
          fontWeight: 600,
          fontFamily: '"Noto Sans SC", sans-serif',
        },
      },
    ],
  }), [dashboard.sankeyData]);

  const wordCloudOption = useMemo(() => {
    // Improved layout: Use a 4x4 or 5x3 grid to place words to avoid overlaps
    const rows = 4;
    const cols = 4;
    const data = dashboard.words.slice(0, 16).map((w, idx) => {
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      // Map to -45 to 45 range with some jitter, keeping inner items slightly tighter
      const x = (c - (cols - 1) / 2) * 22 + (Math.random() - 0.5) * 6;
      const y = (r - (rows - 1) / 2) * -18 + (Math.random() - 0.5) * 6;
      
      return {
        name: w.text,
        value: [x, y, w.weight],
        itemStyle: {
          color: [
            '#0fa5dd', '#8b2fd6', '#df2630', '#d48e15', '#18a3a0', '#1d8cd3'
          ][idx % 6]
        }
      };
    });

    return {
      backgroundColor: 'transparent',
      tooltip: { show: true, formatter: '{b}' },
      xAxis: { show: false, min: -55, max: 55 },
      yAxis: { show: false, min: -50, max: 50 },
      series: [{
        type: 'scatter',
        data: data,
        symbolSize: 0,
        label: {
          show: true,
          formatter: '{b}',
          fontSize: (params: any) => Math.max(12, params.value[2] * 0.7),
          fontWeight: 'bold',
          fontFamily: '"Noto Sans SC", sans-serif',
          textShadowBlur: 4,
          textShadowColor: 'rgba(255,255,255,0.6)',
        },
        emphasis: {
          label: {
            fontSize: (params: any) => params.value[2] + 2,
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)',
            fontWeight: '900'
          }
        }
      }]
    };
  }, [dashboard.words]);

  return (
    <div
      ref={frameRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden', // Disable scrolling, force scaling
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        boxSizing: 'border-box',
      }}
    >
      <div
      style={{
        position: 'relative',
        zIndex: 1,
        width: BASE_WIDTH,
        height: BASE_HEIGHT,
        transform: `scale(${frameScale})`,
        transformOrigin: 'center center',
        flexShrink: 0,
        color: inkText,
        background:
          'linear-gradient(180deg, rgba(250,246,236,0.96), rgba(236,223,193,0.82)), url("/beijing-siheyuan/bg.jpg") center top / cover no-repeat',
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
        borderRadius: 8,
      }}
    >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.16), rgba(126,86,31,0.02)), url("/beijing-siheyuan/bg.jpg") center center / cover no-repeat',
            opacity: 0.18,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 50% 8%, rgba(255,248,230,0.85), transparent 22%), radial-gradient(circle at 18% 18%, rgba(255,255,255,0.3), transparent 16%), radial-gradient(circle at 82% 22%, rgba(255,255,255,0.22), transparent 14%), linear-gradient(180deg, rgba(248,227,177,0.42), rgba(221,182,103,0.16) 54%, rgba(168,122,52,0.08) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.5), transparent 22%), linear-gradient(180deg, rgba(255,255,255,0.08), rgba(95,62,20,0.02) 40%, rgba(75,52,19,0.08) 100%)',
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.32,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse at 24% 56%, rgba(85, 57, 20, 0.34) 0%, rgba(85, 57, 20, 0.16) 18%, transparent 34%), radial-gradient(ellipse at 78% 70%, rgba(65, 44, 14, 0.22) 0%, rgba(65, 44, 14, 0.12) 20%, transparent 34%), radial-gradient(ellipse at 62% 44%, rgba(106, 78, 32, 0.18) 0%, transparent 26%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
          }}
        >
          <InkMountain style={{ left: 230, bottom: 250, width: 660, height: 224 }} opacity={0.18} />
          <InkMountain style={{ left: 26, bottom: 96, width: 620, height: 286 }} opacity={0.24} />
          <InkMountain style={{ left: 912, bottom: 82, width: 654, height: 232 }} opacity={0.18} />
          <BambooBranch style={{ left: 0, bottom: 10, width: 132, height: 322 }} />
          <BambooBranch style={{ right: 0, bottom: 2, width: 138, height: 336 }} flip />
        </div>

        <div style={{ position: 'absolute', left: 10, top: 20, width: 500, height: 210 }}>
          <DashboardPanel title="气候环境监测" style={{ height: '100%' }}>
            <ReactECharts option={climateSeasonOption} style={{ height: '100%', paddingTop: 6 }} />
          </DashboardPanel>
        </div>

        <div style={{ position: 'absolute', left: 10, top: 246, width: 500, height: 300 }}>
          <DashboardPanel title="营建材料构成" style={{ height: '100%' }}>
            <ReactECharts option={materialOption} style={{ height: '100%', paddingTop: 20 }} />
          </DashboardPanel>
        </div>

        <div style={{ position: 'absolute', left: 10, top: 562, width: 500, height: 200 }}>
          <DashboardPanel title="构造关联桑基图" style={{ height: '100%' }}>
            <ReactECharts option={sankeyOption} style={{ height: '100%', padding: '6px' }} />
          </DashboardPanel>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 628,
            top: 2,
            width: 376,
            height: 54,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: inkText,
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: 2,
            fontFamily: '"KaiTi", "STKaiti", serif',
          }}
        >
          <PlaqueFlourish side="left" />
          {dashboard.title}
          <PlaqueFlourish side="right" />
        </div>

        <div style={{ position: 'absolute', left: 548, top: 64, width: 548, height: 160 }}>
          <DashboardPanel title="核心分布指标" style={{ height: '100%', padding: '12px 18px 10px' }}>
            <div style={{ height: '100%', border: '1px solid rgba(139,104,70,0.24)', background: 'rgba(255,252,246,0.64)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ background: 'rgba(184,138,59,0.12)' }}>
                    <th style={{ width: '50%', padding: '6px 12px', borderBottom: '1px solid rgba(139,104,70,0.2)', color: inkText, textAlign: 'left', fontSize: 11 }}>指标项</th>
                    <th style={{ padding: '6px 12px', borderBottom: '1px solid rgba(139,104,70,0.2)', color: inkText, textAlign: 'right', fontSize: 11 }}>测算数值</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.metrics.map((metric, idx) => (
                    <tr key={metric.label} style={{ background: idx % 2 === 0 ? 'rgba(255,255,255,0.28)' : 'transparent' }}>
                      <td style={{ padding: '6px 12px', borderBottom: '1px solid rgba(139,104,70,0.12)', fontSize: 12, color: mutedInk, fontWeight: 600 }}>{metric.label}</td>
                      <td style={{ padding: '6px 12px', borderBottom: '1px solid rgba(139,104,70,0.12)', textAlign: 'right', fontSize: 13, color: cyanInk, fontWeight: 800, fontFamily: 'monospace' }}>{metric.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardPanel>
        </div>

        <div style={{ position: 'absolute', left: 548, top: 240, width: 548, height: 380 }}>
          <div style={{ position: 'absolute', inset: '10px 8px 12px 8px', background: 'url("/beijing-siheyuan/bg.jpg") center center / cover no-repeat', opacity: 0.14, pointerEvents: 'none', mixBlendMode: 'multiply' }} />
          <InkMountain style={{ left: 18, bottom: 76, width: 510, height: 156 }} opacity={0.14} />
          {geoLoaded ? (
            <ReactECharts option={mapOption} style={{ height: '100%' }} />
          ) : (
            <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: '#7a6040' }}>地理坐标加载中...</div>
          )}
        </div>

        <div style={{ position: 'absolute', left: 550, top: 636, width: 548, height: 150 }}>
          <DashboardPanel title="遗存保护评估" style={{ height: '100%', padding: '8px 18px 6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 2, color: goldInk, fontWeight: 700 }}>
              <span style={{ fontSize: 16 }}>当前保护状态</span>
              <span style={{ fontSize: 12 }}>{dashboard.preserveDate} 更新</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ padding: '6px 0 0 4px', minWidth: 128 }}>
                <div style={{ fontSize: 22, color: '#b45b4e', fontWeight: 900 }}>{dashboard.preserveRange}</div>
                <div style={{ marginTop: 18, fontSize: 14, color: inkText, fontWeight: 700 }}>非遗载体: {dashboard.preserveCount}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 2, flex: 1 }}>
                {dashboard.gauges.map((gauge) => (
                  <Gauge
                    key={gauge.label}
                    label={gauge.label}
                    value={gauge.value}
                    color={gauge.color}
                    display={gauge.display}
                  />
                ))}
              </div>
            </div>
          </DashboardPanel>
        </div>

        <div style={{ position: 'absolute', left: 1110, top: 20, width: 540, height: 250 }}>
          <DashboardPanel title="民居防御与适应指数" style={{ height: '100%', padding: '20px 18px 16px' }}>
             <ReactECharts option={radarOption} style={{ height: '100%' }} />
          </DashboardPanel>
        </div>

        <div style={{ position: 'absolute', left: 1110, top: 286, width: 540, height: 130 }}>
          <DashboardPanel title="历史进程溯源" style={{ height: '100%', padding: '10px 18px 8px' }}>
            <div style={{ position: 'relative', height: '100%' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 22,
                  right: 22,
                  bottom: 20,
                  height: 6,
                  background: 'linear-gradient(90deg, #43c1c9 0 36%, #cb8a55 36% 69%, #d64969 69% 100%)',
                }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, paddingTop: 2 }}>
                {dashboard.heritageTimeline.map((item, index) => (
                  <div key={item.era} style={{ position: 'relative', textAlign: 'center', color: inkText }}>
                    <div style={{ minHeight: 40, fontSize: 10, lineHeight: 1.4, fontWeight: 700, whiteSpace: 'pre-line' }}>{item.text}</div>
                    <div style={{ color: ['#34baba', '#d29554', '#d34e65'][index], fontSize: 15, fontWeight: 900 }}>{item.era}</div>
                    <div style={{ width: 16, height: 3, margin: '4px auto 0', background: ['#34baba', '#d29554', '#d34e65'][index] }} />
                  </div>
                ))}
              </div>
            </div>
          </DashboardPanel>
        </div>

        <div style={{ position: 'absolute', left: 1110, top: 432, width: 540, height: 330 }}>
          <DashboardPanel title="文化关键词云" style={{ height: '100%', padding: '10px 18px 12px' }}>
            <div style={{ position: 'absolute', inset: '12px 14px', background: 'url("/beijing-siheyuan/bg.jpg") center center / cover no-repeat', opacity: 0.1, pointerEvents: 'none', mixBlendMode: 'multiply' }} />
            <InkMountain style={{ left: 18, bottom: 54, width: 500, height: 128 }} opacity={0.14} />
            <BambooBranch style={{ right: -8, bottom: -6, width: 102, height: 250 }} flip />
            <ReactECharts option={wordCloudOption} style={{ height: '100%' }} />
          </DashboardPanel>
        </div>
      </div>
    </div>
  );
}
