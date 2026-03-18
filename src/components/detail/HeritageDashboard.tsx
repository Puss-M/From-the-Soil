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
const BASE_HEIGHT = 934;
const panelBorder = '1px solid rgba(180, 137, 66, 0.42)';
const panelInset = 'inset 0 0 0 1px rgba(255, 248, 228, 0.2)';

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
        border: panelBorder,
        boxShadow: panelInset,
        background:
          'linear-gradient(180deg, rgba(245, 211, 139, 0.18), rgba(255, 248, 233, 0.08)), rgba(255, 248, 230, 0.18)',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          width: 14,
          height: 14,
          borderTop: '3px solid rgba(181, 137, 60, 0.56)',
          borderLeft: '3px solid rgba(181, 137, 60, 0.56)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          width: 14,
          height: 14,
          borderTop: '3px solid rgba(181, 137, 60, 0.56)',
          borderRight: '3px solid rgba(181, 137, 60, 0.56)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          left: 14,
          width: 14,
          height: 14,
          borderBottom: '3px solid rgba(181, 137, 60, 0.56)',
          borderLeft: '3px solid rgba(181, 137, 60, 0.56)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          right: 14,
          width: 14,
          height: 14,
          borderBottom: '3px solid rgba(181, 137, 60, 0.56)',
          borderRight: '3px solid rgba(181, 137, 60, 0.56)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: -28,
          left: 0,
          fontSize: 20,
          lineHeight: 1,
          color: '#7a4e17',
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        {title}
      </div>
      {children}
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
          background: 'rgba(202,170,111,0.9)',
          boxShadow: '0 0 10px rgba(202,170,111,0.28)',
        }}
      />
    </div>
  );
}

function HeritageFlowChart({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  const leftLabels = items.map((item) => item.label);
  const rightLabels = items.map((item) => item.value);
  const colors = ['#73c9d2', '#e08371', '#d7ba69', '#9d7bc5', '#8aa3c4'];

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(98,70,29,0.02)), url("/beijing-siheyuan/bg.jpg") center center / cover no-repeat',
          opacity: 0.18,
          pointerEvents: 'none',
        }}
      />
      <svg viewBox="0 0 460 180" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
        {leftLabels.map((label, index) => {
          const y = 20 + index * 30;
          const thickness = 18 + index * 4;
          const color = colors[index % colors.length];

          return (
            <g key={label}>
              <path
                d={`M 62 ${y + 8} C 152 ${y - 10}, 260 ${y + 16}, 388 ${y + 6} L 388 ${y + 6 + thickness} C 258 ${y + 28 + thickness * 0.35}, 152 ${y + 10 + thickness}, 62 ${y + 24} Z`}
                fill={color}
                fillOpacity="0.46"
                stroke="rgba(255,248,228,0.45)"
                strokeWidth="1"
              />
              <path
                d={`M 62 ${y + 8} C 152 ${y - 10}, 260 ${y + 16}, 388 ${y + 6}`}
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="3"
              />
              <rect x="20" y={y + 2} width="36" height={24} rx="2" fill={color} fillOpacity="0.82" />
              <rect x="394" y={y + 2} width="36" height={24} rx="2" fill={color} fillOpacity="0.68" />
            </g>
          );
        })}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '92px 1fr 130px', pointerEvents: 'none' }}>
        <div style={{ paddingTop: 18 }}>
          {leftLabels.map((label) => (
            <div key={label} style={{ height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff5e9', textShadow: '0 1px 2px rgba(89,60,21,0.38)' }}>
              {label}
            </div>
          ))}
        </div>
        <div />
        <div style={{ paddingTop: 18 }}>
          {rightLabels.map((label, index) => (
            <div key={`${label}-${index}`} style={{ height: 30, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontSize: 11, fontWeight: 700, color: '#fff5e9', textShadow: '0 1px 2px rgba(89,60,21,0.38)' }}>
              {label}
            </div>
          ))}
        </div>
      </div>
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
        axisTick: { distance: -14, splitNumber: 4, lineStyle: { color: '#fff3d6', width: 1 } },
        splitLine: { distance: -16, length: 8, lineStyle: { color: '#fff7e8', width: 1.5 } },
        axisLabel: { show: false },
        pointer: {
          icon: 'path://M4 0 L0 50 L8 50 Z',
          width: 10,
          length: '54%',
          offsetCenter: [0, '-2%'],
          itemStyle: { color: '#bb8352' },
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 9,
          itemStyle: { color: '#d4b07a' },
        },
        detail: {
          valueAnimation: false,
          offsetCenter: [0, '35%'],
          color: '#b07f4a',
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
      <div style={{ fontSize: 12, color: '#fff5e9', fontWeight: 700, marginBottom: 2 }}>{label}</div>
      <ReactECharts option={option} style={{ height: 104 }} />
    </div>
  );
}

export function HeritageDashboard({ station, climate, detail, heritage, decorations }: Props) {
  const [geoLoaded, setGeoLoaded] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [frameScale, setFrameScale] = useState(1);

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

      setFrameScale(Math.min(width / BASE_WIDTH, height / BASE_HEIGHT));
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
    animationDuration: 500,
    grid: { left: 42, right: 38, top: 28, bottom: 40 },
    tooltip: { trigger: 'axis' as const },
    legend: {
      data: ['月降水量(mm)', '月均温度(℃)'],
      bottom: 2,
      itemWidth: 18,
      itemHeight: 10,
      textStyle: { color: '#fff6e8', fontSize: 11 },
    },
    xAxis: {
      type: 'category' as const,
      data: MONTHS,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.8)' } },
      axisLabel: { color: '#fff4df', fontSize: 10 },
      axisTick: { show: false },
    },
    yAxis: [
      {
        type: 'value' as const,
        min: 0,
        max: Math.max(180, Math.ceil(Math.max(...dashboard.monthlyPrecipitation) / 30) * 30),
        axisLine: { show: true, lineStyle: { color: 'rgba(255,255,255,0.8)' } },
        axisLabel: { color: '#fff4df', fontSize: 10 },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.14)' } },
      },
      {
        type: 'value' as const,
        min: -30,
        max: 30,
        axisLine: { show: true, lineStyle: { color: 'rgba(255,255,255,0.8)' } },
        axisLabel: { color: '#fff4df', fontSize: 10 },
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
            { offset: 0, color: '#79d8da' },
            { offset: 0.55, color: '#55c2c3' },
            { offset: 1, color: '#3d9fa5' },
          ]),
          borderRadius: [12, 12, 3, 3],
          shadowBlur: 16,
          shadowColor: 'rgba(73,183,182,0.28)',
        },
        emphasis: { itemStyle: { shadowBlur: 20 } },
        z: 3,
      },
      {
        name: '月均温度(℃)',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: dashboard.monthlyTemperature,
        symbolSize: 5,
        lineStyle: { color: '#bf8254', width: 2.4, shadowBlur: 6, shadowColor: 'rgba(191,130,84,0.28)' },
        itemStyle: { color: '#fff8ec', borderColor: '#bf8254', borderWidth: 1.5 },
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
    tooltip: { trigger: 'item' as const },
    legend: {
      bottom: 0,
      itemWidth: 18,
      itemHeight: 10,
      textStyle: { color: '#fff6e8', fontSize: 11 },
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
          color: 'rgba(96, 66, 24, 0.22)',
          shadowBlur: 18,
          shadowColor: 'rgba(82, 56, 18, 0.14)',
        },
        data: dashboard.materialDistribution.map((item) => ({ value: item.value })),
      },
      {
        type: 'pie',
        radius: ['35%', '64%'],
        center: ['50%', '48%'],
        silent: true,
        z: 1,
        label: { show: false },
        labelLine: { show: false },
        itemStyle: {
          color: 'rgba(102, 66, 18, 0.12)',
          shadowBlur: 24,
          shadowColor: 'rgba(91, 61, 18, 0.16)',
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
                { offset: 0, color: '#84dbe1' },
                { offset: 1, color: '#4db8be' },
              ]),
              new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: '#97adff' },
                { offset: 1, color: '#5b7de6' },
              ]),
              new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: '#e0c8ff' },
                { offset: 1, color: '#b48ce8' },
              ]),
              new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: '#f59aa8' },
                { offset: 1, color: '#db6879' },
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
            { offset: 0, color: 'rgba(255,255,255,0.58)' },
            { offset: 0.4, color: 'rgba(188,139,74,0.22)' },
            { offset: 1, color: 'rgba(126,86,31,0.06)' },
          ]),
        },
        data: [{ value: 1 }],
      },
    ],
  }), [dashboard.materialDistribution]);

  const radarOption = useMemo(() => ({
    backgroundColor: 'transparent',
    radar: {
      radius: '72%',
      splitNumber: 5,
      indicator: [
        { name: '防火', max: 100 },
        { name: '防水', max: 100 },
        { name: '防恶劣天气', max: 100 },
        { name: '防匪', max: 100 },
        { name: '防盗', max: 100 },
      ],
      axisName: { color: '#7a5e36', fontSize: 12, fontWeight: 700 },
      splitLine: { lineStyle: { color: 'rgba(255, 245, 225, 0.7)' } },
      splitArea: { areaStyle: { color: ['rgba(255,255,255,0.02)'] } },
      axisLine: { lineStyle: { color: 'rgba(255,245,225,0.55)' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: dashboard.radarValues,
            areaStyle: { color: 'rgba(182, 121, 67, 0.16)' },
            lineStyle: { color: '#c8905a', width: 2.5 },
            itemStyle: { color: '#c8905a' },
          },
        ],
      },
    ],
  }), [dashboard.radarValues]);

  const mapOption = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' as const, formatter: '{b}' },
    geo: {
      map: 'china-dashboard',
      roam: false,
      zoom: 1.08,
      top: '10%',
      layoutCenter: ['49%', '53%'],
      layoutSize: '92%',
      itemStyle: {
        areaColor: '#e4ac41',
        borderColor: 'rgba(255,255,255,0.9)',
        borderWidth: 1.1,
        shadowBlur: 18,
        shadowColor: 'rgba(255,255,255,0.54)',
      },
      emphasis: {
        itemStyle: { areaColor: '#ebb856' },
      },
    },
    series: [
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        symbolSize: 22,
        data: [{ name: dashboard.mapPoint.name, value: [...dashboard.mapPoint.coords, 1] }],
        itemStyle: {
          color: '#fff8ec',
          borderColor: '#caa56a',
          borderWidth: 5,
          shadowBlur: 20,
          shadowColor: 'rgba(224, 185, 112, 0.65)',
        },
      },
    ],
  }), [dashboard.mapPoint]);

  const wordPalette = ['#0fa5dd', '#8b2fd6', '#df2630', '#d48e15', '#18a3a0', '#1d8cd3'];
  const fixedWordLayout = [
    { left: '50%', top: '56%', scale: 0.88 },
    { left: '35%', top: '66%', scale: 0.8 },
    { left: '20%', top: '76%', scale: 0.82 },
    { left: '55%', top: '18%', scale: 0.76 },
    { left: '66%', top: '40%', scale: 0.7 },
    { left: '66%', top: '74%', scale: 0.74 },
    { left: '28%', top: '26%', scale: 0.66 },
    { left: '14%', top: '64%', scale: 0.64 },
    { left: '74%', top: '66%', scale: 0.62 },
    { left: '75%', top: '24%', scale: 0.62 },
    { left: '10%', top: '46%', scale: 0.6 },
    { left: '43%', top: '24%', scale: 0.66 },
    { left: '70%', top: '54%', scale: 0.58 },
    { left: '59%', top: '81%', scale: 0.58 },
    { left: '18%', top: '18%', scale: 0.56 },
    { left: '40%', top: '84%', scale: 0.54 },
  ] as const;

  return (
    <div
      ref={frameRef}
      style={{
        position: 'relative',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${frameScale})`,
          transformOrigin: 'top center',
          margin: '0 auto',
          color: '#fff7ea',
          background:
            'linear-gradient(180deg, rgba(249,241,214,0.92), rgba(239,218,162,0.72)), url("/beijing-siheyuan/bg.jpg") center top / cover no-repeat',
          boxShadow: 'inset 0 0 0 1px rgba(179, 135, 67, 0.35)',
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
            background:
              'radial-gradient(circle at 10% 16%, rgba(255,255,255,0.35), transparent 22%), radial-gradient(circle at 82% 18%, rgba(255,255,255,0.2), transparent 18%), radial-gradient(circle at 30% 72%, rgba(111, 63, 17, 0.08), transparent 20%)',
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
            opacity: 0.16,
            pointerEvents: 'none',
            background:
              'repeating-linear-gradient(0deg, rgba(142,108,52,0.06) 0 2px, transparent 2px 24px), repeating-linear-gradient(90deg, rgba(142,108,52,0.03) 0 1px, transparent 1px 28px)',
            mixBlendMode: 'multiply',
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

        <div style={{ position: 'absolute', left: 10, top: 34, width: 500, height: 230 }}>
          <DashboardPanel title="温雨双折图" style={{ height: '100%' }}>
            <ReactECharts option={climateSeasonOption} style={{ height: '100%', paddingTop: 10 }} />
          </DashboardPanel>
        </div>

        <div style={{ position: 'absolute', left: 10, top: 284, width: 500, height: 320 }}>
          <DashboardPanel title="建材环形图" style={{ height: '100%' }}>
            <ReactECharts option={materialOption} style={{ height: '100%', paddingTop: 26 }} />
          </DashboardPanel>
        </div>

        <div style={{ position: 'absolute', left: 10, top: 612, width: 500, height: 216 }}>
          <DashboardPanel title="构造桑基图" style={{ height: '100%', padding: '22px 18px 14px' }}>
            <HeritageFlowChart items={dashboard.summary} />
          </DashboardPanel>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 628,
            top: 4,
            width: 376,
            height: 62,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#b76800',
            fontSize: 36,
            fontWeight: 900,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,246,225,0.06))',
            boxShadow: 'inset 0 0 0 1px rgba(205,182,132,0.5), 0 1px 8px rgba(176,141,84,0.08)',
            border: '1px solid rgba(212,191,146,0.28)',
            letterSpacing: 2,
            textShadow: '0 1px 0 rgba(255,250,235,0.9)',
          }}
        >
          <PlaqueFlourish side="left" />
          {dashboard.title}
          <PlaqueFlourish side="right" />
        </div>

        <div style={{ position: 'absolute', left: 548, top: 88, width: 548, height: 170 }}>
          <DashboardPanel title="分布地域数据" style={{ height: '100%', padding: '18px 18px 14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, height: '100%' }}>
              {dashboard.metrics.map((metric) => (
                <div
                  key={metric.label}
                  style={{
                    border: '1px solid rgba(60, 212, 220, 0.24)',
                    background: 'rgba(240, 194, 103, 0.08)',
                    display: 'grid',
                    placeItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 22, color: '#0f8eff', fontWeight: 700, marginBottom: 6 }}>{metric.value}</div>
                  <div style={{ fontSize: 15, color: '#fff6ea', fontWeight: 600 }}>{metric.label}</div>
                </div>
              ))}
            </div>
          </DashboardPanel>
        </div>

        <div style={{ position: 'absolute', left: 548, top: 276, width: 548, height: 410 }}>
          <div style={{ position: 'absolute', inset: '10px 8px 12px 8px', background: 'url("/beijing-siheyuan/bg.jpg") center center / cover no-repeat', opacity: 0.14, pointerEvents: 'none', mixBlendMode: 'multiply' }} />
          <InkMountain style={{ left: 18, bottom: 76, width: 510, height: 156 }} opacity={0.14} />
          <div style={{ position: 'absolute', top: -30, left: 0, fontSize: 20, color: '#7a4e17', fontWeight: 700 }}>分布图</div>
          {geoLoaded ? (
            <ReactECharts option={mapOption} style={{ height: '100%' }} />
          ) : (
            <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: '#7a6040' }}>地图加载中...</div>
          )}
        </div>

        <div style={{ position: 'absolute', left: 550, top: 664, width: 548, height: 162 }}>
          <DashboardPanel title="" style={{ height: '100%', padding: '10px 18px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 2, color: '#7a4e17', fontWeight: 700 }}>
              <span style={{ fontSize: 18 }}>保护状况</span>
              <span style={{ fontSize: 14 }}>{dashboard.preserveDate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ padding: '10px 0 0 4px', minWidth: 128 }}>
                <div style={{ fontSize: 24, color: '#de4444', fontWeight: 900 }}>{dashboard.preserveRange}</div>
                <div style={{ marginTop: 24, fontSize: 16, color: '#fff8ec', fontWeight: 700 }}>{dashboard.preserveCount}</div>
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

        <div style={{ position: 'absolute', left: 1110, top: 34, width: 540, height: 270 }}>
          <DashboardPanel title="" style={{ height: '100%', padding: '24px 18px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr', gap: 16, height: '100%' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#7a4e17', fontWeight: 700, marginBottom: 4, fontSize: 20 }}>
                  <span>分类</span>
                  <span style={{ fontSize: 20 }}>防御指数</span>
                </div>
                <div style={{ position: 'relative', width: 170, height: 170, margin: '18px auto 0' }}>
                  {[
                    { color: '#7f476e', left: 54, top: 0 },
                    { color: '#e1645c', left: 2, top: 42 },
                    { color: '#58b9ca', left: 106, top: 42 },
                    { color: '#d1b050', left: 54, top: 88 },
                  ].map((petal, index) => (
                    <div
                      key={petal.color}
                      style={{
                        position: 'absolute',
                        left: petal.left,
                        top: petal.top,
                        width: 72,
                        height: 72,
                        background: petal.color,
                        opacity: 0.92,
                        borderRadius: index === 0 ? '50% 50% 46% 46%' : index === 3 ? '46% 46% 55% 55%' : '50%',
                        filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.18))',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <ReactECharts option={radarOption} style={{ height: 212 }} />
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: -8 }}>
                  <span style={{ background: 'rgba(174, 111, 73, 0.76)', padding: '4px 14px', borderRadius: 6, fontSize: 12 }}>
                    {dashboard.title}
                  </span>
                </div>
              </div>
            </div>
          </DashboardPanel>
        </div>

        <div style={{ position: 'absolute', left: 1110, top: 338, width: 540, height: 146 }}>
          <DashboardPanel title="历史进程图" style={{ height: '100%', padding: '14px 18px 10px' }}>
            <div style={{ position: 'relative', height: '100%' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 22,
                  right: 22,
                  bottom: 24,
                  height: 7,
                  background: 'linear-gradient(90deg, #43c1c9 0 36%, #cb8a55 36% 69%, #d64969 69% 100%)',
                }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, paddingTop: 2 }}>
                {dashboard.heritageTimeline.map((item, index) => (
                  <div key={item.era} style={{ position: 'relative', textAlign: 'center', color: '#fff6ea' }}>
                    <div style={{ minHeight: 50, fontSize: 11, lineHeight: 1.45, fontWeight: 700, whiteSpace: 'pre-line' }}>{item.text}</div>
                    <div style={{ color: ['#34baba', '#d29554', '#d34e65'][index], fontSize: 17, fontWeight: 900 }}>{item.era}</div>
                    <div style={{ width: 20, height: 3, margin: '6px auto 0', background: ['#34baba', '#d29554', '#d34e65'][index] }} />
                  </div>
                ))}
              </div>
            </div>
          </DashboardPanel>
        </div>

        <div style={{ position: 'absolute', left: 1110, top: 506, width: 540, height: 336 }}>
          <DashboardPanel title="分布词云图" style={{ height: '100%', padding: '12px 18px 14px' }}>
            <div style={{ position: 'absolute', inset: '12px 14px', background: 'url("/beijing-siheyuan/bg.jpg") center center / cover no-repeat', opacity: 0.1, pointerEvents: 'none', mixBlendMode: 'multiply' }} />
            <InkMountain style={{ left: 18, bottom: 54, width: 500, height: 128 }} opacity={0.14} />
            <BambooBranch style={{ right: -8, bottom: -6, width: 102, height: 250 }} flip />
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {dashboard.words.map((word, index) => (
                <span
                  key={`${word.text}-${index}`}
                  style={{
                    position: 'absolute',
                    left: fixedWordLayout[index]?.left ?? `${6 + (index * 16) % 70}%`,
                    top: fixedWordLayout[index]?.top ?? `${8 + (index * 12) % 72}%`,
                    fontSize: Math.max(15, Math.round(word.weight * (fixedWordLayout[index]?.scale ?? 0.72))),
                    lineHeight: 1,
                    color: wordPalette[index % wordPalette.length],
                    fontWeight: word.weight > 30 ? 900 : 700,
                    opacity: 0.92,
                    transform: index % 5 === 0 ? 'rotate(-3deg)' : index % 4 === 0 ? 'rotate(2deg)' : 'none',
                    whiteSpace: 'nowrap',
                    textShadow: '0 1px 2px rgba(255,250,235,0.45)',
                  }}
                >
                  {word.text}
                </span>
              ))}
            </div>
          </DashboardPanel>
        </div>
      </div>
    </div>
  );
}
