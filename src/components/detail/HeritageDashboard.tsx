'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import * as echarts from 'echarts';
import type { Station } from '@/types';
import type { WorldClimData } from '@/data/climateDetails';
import type { StationDetailData } from '@/data/stationDetails';
import type { HeritageInfo } from '@/data/heritageData';
import type { DecorationItem } from '@/data/decorationData';
import { MONTHS, buildHeritageDashboardData, type DashboardGauge, type DashboardRegionWord } from '@/data/heritageDashboard';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface Props {
  station: Station;
  climate: WorldClimData;
  detail: StationDetailData;
  heritage: HeritageInfo[];
  decorations: DecorationItem[];
}

const BASE_WIDTH = 1660;
const BASE_HEIGHT = 900;

// 国风配色常量
const panelBorder = 'rgba(139, 104, 70, 0.25)';
const panelBorderStrong = 'rgba(139, 104, 70, 0.4)';
const panelTitle = '#5b4631';
const textMuted = '#8f7556';
const accentCyan = '#5b8d86';
const accentOchre = '#b88a3b';
const paperBackground =
  'linear-gradient(180deg, rgba(255, 252, 246, 0.55), rgba(243, 232, 205, 0.42))';

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
        border: `1px solid ${panelBorder}`,
        borderRadius: '12px',
        background: 'rgba(255, 252, 246, 0.35)',
        boxShadow: 
          'inset 0 1px 0 rgba(255, 255, 255, 0.5), ' +
          '0 4px 16px rgba(58, 48, 40, 0.08), ' +
          '0 1px 4px rgba(58, 48, 40, 0.06)',
        backdropFilter: 'blur(20px) saturate(1.1)',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.05) 40%, transparent), ' +
            'radial-gradient(circle at 50% 0%, rgba(184, 138, 59, 0.08), transparent 60%)',
          pointerEvents: 'none',
          borderRadius: 'inherit',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 16,
          fontSize: 15,
          lineHeight: 1,
          color: panelTitle,
          fontFamily: '"KaiTi", "STKaiti", serif',
          fontWeight: 700,
          letterSpacing: 1.5,
          textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
          zIndex: 2,
        }}
      >
        {title}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 11,
          left: 15,
          right: 15,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${panelBorderStrong} 20%, ${panelBorderStrong} 80%, transparent)`,
          marginTop: 26,
          opacity: 0.4,
          zIndex: 1,
        }}
      />
      <div style={{ position: 'relative', height: '100%', padding: '40px 16px 14px', zIndex: 1 }}>
        {children}
      </div>
    </section>
  );
}

function BambooDecoration({
  side,
}: {
  side: 'left' | 'right';
}) {
  const isLeft = side === 'left';

  return (
    <div
      style={{
        position: 'absolute',
        [isLeft ? 'left' : 'right']: 0,
        bottom: 0,
        width: 176,
        height: 320,
        opacity: 0.22,
        pointerEvents: 'none',
        transform: isLeft ? undefined : 'scaleX(-1)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 120,
          bottom: -10,
          width: 4,
          height: 280,
          background: 'linear-gradient(180deg, rgba(70,44,14,0.16), rgba(70,44,14,0.7), rgba(70,44,14,0.18))',
          borderRadius: 999,
        }}
      />
      {[
        { left: 42, top: 48, rotate: -22 },
        { left: 54, top: 102, rotate: -15 },
        { left: 34, top: 156, rotate: -20 },
        { left: 122, top: 60, rotate: 20 },
        { left: 134, top: 120, rotate: 12 },
        { left: 140, top: 176, rotate: 24 },
      ].map((leaf) => (
        <div
          key={`${leaf.left}-${leaf.top}`}
          style={{
            position: 'absolute',
            left: leaf.left,
            top: leaf.top,
            width: 74,
            height: 20,
            borderRadius: '100% 0 100% 0',
            background: 'linear-gradient(90deg, rgba(66,45,18,0.1), rgba(66,45,18,0.72), rgba(66,45,18,0.08))',
            transform: `rotate(${leaf.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function RegionWordCloud({ words }: { words: DashboardRegionWord[] }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {words.map((word) => (
        <div
          key={word.text}
          style={{
            position: 'absolute',
            left: `${word.x}%`,
            top: `${word.y}%`,
            transform: 'translate(-50%, -50%)',
            fontSize: word.size,
            lineHeight: 1,
            fontWeight: 700,
            color: word.color,
            whiteSpace: 'nowrap',
            textShadow: '0 0 10px rgba(255,255,255,0.35)',
          }}
        >
          {word.text}
        </div>
      ))}
    </div>
  );
}

function ClassificationPetals({
  items,
}: {
  items: Array<{ label: string; color: string }>;
}) {
  const petals = items.slice(0, 4);

  return (
    <div style={{ position: 'relative', width: 180, height: 160, margin: '10px auto 0' }}>
      {petals.map((item, index) => {
        const positions = [
          { left: 18, top: 46 },
          { left: 56, top: 6 },
          { left: 92, top: 46 },
          { left: 56, top: 84 },
        ][index];

        return (
          <div
            key={item.label}
            title={item.label}
            style={{
              position: 'absolute',
              left: positions.left,
              top: positions.top,
              width: 68,
              height: 68,
              borderRadius: '68px 0 68px 0',
              transform: `rotate(${index * 45}deg)`,
              background: item.color,
              opacity: 0.84,
              boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
            }}
          />
        );
      })}
    </div>
  );
}

function Gauge({ gauge }: { gauge: DashboardGauge }) {
  const option = useMemo(() => ({
    backgroundColor: 'transparent',
    series: [
      {
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 100,
        radius: '92%',
        center: ['50%', '64%'],
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 12,
            color: [
              [gauge.value / 100, new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: gauge.color },
                { offset: 1, color: gauge.color + 'dd' }
              ])],
              [1, 'rgba(239, 227, 198, 0.35)'],
            ],
          },
        },
        axisTick: {
          distance: -14,
          splitNumber: 5,
          lineStyle: { color: 'rgba(139, 104, 70, 0.3)', width: 1.5 },
        },
        splitLine: {
          distance: -16,
          length: 10,
          lineStyle: { color: 'rgba(139, 104, 70, 0.4)', width: 2 },
        },
        axisLabel: { show: false },
        pointer: {
          icon: 'path://M4 0 L0 48 L8 48 Z',
          width: 10,
          length: '52%',
          offsetCenter: [0, '-2%'],
          itemStyle: { 
            color: panelTitle,
            shadowBlur: 4,
            shadowColor: 'rgba(58, 48, 40, 0.3)'
          },
        },
        anchor: {
          show: true,
          size: 9,
          itemStyle: { 
            color: panelTitle,
            borderWidth: 2,
            borderColor: '#fff',
            shadowBlur: 4,
            shadowColor: 'rgba(58, 48, 40, 0.2)'
          },
        },
        title: { show: false },
        detail: {
          offsetCenter: [0, '42%'],
          color: textMuted,
          fontSize: 13,
          fontWeight: 700,
          fontFamily: '"KaiTi", "STKaiti", serif',
          formatter: () => gauge.display,
        },
        data: [{ value: gauge.value }],
      },
    ],
  }), [gauge]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 12, color: panelTitle, fontWeight: 700, marginBottom: 2 }}>{gauge.label}</div>
      <ReactECharts option={option} style={{ height: 96 }} />
    </div>
  );
}

export function HeritageDashboard({ station, climate, detail, heritage, decorations }: Props) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [frameScale, setFrameScale] = useState(1);
  const [geoLoaded, setGeoLoaded] = useState(false);

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

      setFrameScale(Math.min(1, (width - 16) / BASE_WIDTH, (height - 16) / BASE_HEIGHT));
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
    animationDuration: 300,
    grid: { left: 32, right: 32, top: 18, bottom: 32 },
    legend: {
      bottom: 2,
      itemWidth: 12,
      itemHeight: 8,
      textStyle: { color: textMuted, fontSize: 10, fontWeight: 600 },
      data: ['月降水量(mm)', '月均温度(℃)'],
    },
    tooltip: { 
      trigger: 'axis' as const,
      backgroundColor: 'rgba(255, 252, 246, 0.95)',
      borderColor: panelBorder,
      textStyle: { color: panelTitle }
    },
    xAxis: {
      type: 'category' as const,
      data: MONTHS,
      axisLine: { lineStyle: { color: 'rgba(139, 104, 70, 0.25)' } },
      axisTick: { show: false },
      axisLabel: { color: textMuted, fontSize: 10, fontWeight: 600 },
    },
    yAxis: [
      {
        type: 'value' as const,
        min: 0,
        max: Math.max(180, Math.ceil(Math.max(...dashboard.monthlyPrecipitation) / 30) * 30),
        splitLine: { lineStyle: { color: 'rgba(139, 104, 70, 0.1)', type: 'dashed' } },
        axisLine: { show: true, lineStyle: { color: 'rgba(139, 104, 70, 0.22)' } },
        axisTick: { show: false },
        axisLabel: { color: textMuted, fontSize: 10, fontWeight: 600 },
      },
      {
        type: 'value' as const,
        min: -10,
        max: 30,
        splitLine: { show: false },
        axisLine: { show: true, lineStyle: { color: 'rgba(91, 141, 134, 0.22)' } },
        axisTick: { show: false },
        axisLabel: { color: textMuted, fontSize: 10, fontWeight: 600 },
      },
    ],
    series: [
      {
        name: '月降水量(mm)',
        type: 'bar',
        yAxisIndex: 0,
        data: dashboard.monthlyPrecipitation,
        barWidth: 11,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(91, 141, 134, 0.9)' },
            { offset: 1, color: 'rgba(91, 141, 134, 0.6)' }
          ]),
          borderRadius: [6, 6, 0, 0],
        },
      },
      {
        name: '月均温度(℃)',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: dashboard.monthlyTemperature,
        symbolSize: 6,
        lineStyle: { color: accentOchre, width: 2.5 },
        itemStyle: { 
          color: accentOchre,
          borderWidth: 2,
          borderColor: '#fff'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(184, 138, 59, 0.25)' },
            { offset: 1, color: 'rgba(184, 138, 59, 0.05)' }
          ])
        },
      },
    ],
  }), [dashboard.monthlyPrecipitation, dashboard.monthlyTemperature]);

  const materialOption = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: { 
      trigger: 'item' as const,
      backgroundColor: 'rgba(255, 252, 246, 0.95)',
      borderColor: panelBorder,
      textStyle: { color: panelTitle }
    },
    legend: {
      bottom: 2,
      itemWidth: 12,
      itemHeight: 8,
      textStyle: { color: textMuted, fontSize: 10, fontWeight: 600 },
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '64%'],
        center: ['50%', '44%'],
        label: { show: false },
        labelLine: { show: false },
        itemStyle: {
          borderColor: 'rgba(255, 252, 246, 0.9)',
          borderWidth: 2,
          shadowBlur: 8,
          shadowColor: 'rgba(58, 48, 40, 0.1)'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 16,
            shadowColor: 'rgba(58, 48, 40, 0.2)'
          },
          scale: true,
          scaleSize: 8
        },
        data: dashboard.materialDistribution.map((item, index) => ({
          ...item,
          itemStyle: {
            color: [accentCyan, accentOchre, '#8b6846', '#d4834f'][index % 4],
          },
        })),
      },
    ],
  }), [dashboard.materialDistribution]);

  const radarOption = useMemo(() => ({
    backgroundColor: 'transparent',
    radar: {
      center: ['50%', '54%'],
      radius: '64%',
      splitNumber: 5,
      indicator: dashboard.radarLabels.map((label) => ({ name: label, max: 100 })),
      axisName: { 
        color: panelTitle, 
        fontSize: 11, 
        fontWeight: 700,
        fontFamily: '"KaiTi", "STKaiti", serif'
      },
      splitLine: { lineStyle: { color: 'rgba(139, 104, 70, 0.2)' } },
      splitArea: { areaStyle: { color: ['rgba(255, 252, 246, 0.03)', 'rgba(184, 138, 59, 0.03)'] } },
      axisLine: { lineStyle: { color: 'rgba(139, 104, 70, 0.25)' } },
    },
    legend: {
      bottom: 2,
      itemWidth: 12,
      itemHeight: 8,
      textStyle: { color: textMuted, fontSize: 10, fontWeight: 600 },
      data: ['防御值'],
    },
    series: [
      {
        name: '防御值',
        type: 'radar',
        data: [
          {
            value: dashboard.radarValues,
            name: '防御值',
            lineStyle: { color: accentOchre, width: 2.5 },
            itemStyle: { 
              color: accentOchre,
              borderWidth: 2,
              borderColor: '#fff'
            },
            areaStyle: { 
              color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                { offset: 0, color: 'rgba(184, 138, 59, 0.3)' },
                { offset: 1, color: 'rgba(184, 138, 59, 0.1)' }
              ])
            },
          },
        ],
      },
    ],
  }), [dashboard.radarLabels, dashboard.radarValues]);

  const mapOption = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: { 
      trigger: 'item' as const, 
      formatter: '{b}',
      backgroundColor: 'rgba(255, 252, 246, 0.95)',
      borderColor: panelBorder,
      textStyle: { color: panelTitle }
    },
    geo: {
      map: 'china-dashboard',
      roam: false,
      top: '10%',
      layoutCenter: ['50%', '54%'],
      layoutSize: '92%',
      itemStyle: {
        areaColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#d4a968' },
          { offset: 1, color: '#b88a3b' }
        ]),
        borderColor: 'rgba(255, 252, 246, 0.8)',
        borderWidth: 1.5,
        shadowColor: 'rgba(58, 48, 40, 0.15)',
        shadowBlur: 16,
        shadowOffsetY: 4
      },
      emphasis: {
        itemStyle: { 
          areaColor: '#dcaf59',
          shadowBlur: 20
        },
      },
    },
    series: [
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        symbolSize: 20,
        data: [{ name: dashboard.mapPoint.name, value: [...dashboard.mapPoint.coords, 1] }],
        itemStyle: {
          color: '#fff',
          borderColor: accentCyan,
          borderWidth: 5,
          shadowColor: 'rgba(91, 141, 134, 0.5)',
          shadowBlur: 16,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 24,
            shadowColor: 'rgba(91, 141, 134, 0.7)',
          },
          scale: true,
          scaleSize: 4
        },
        rippleEffect: {
          brushType: 'stroke',
          color: accentCyan,
          period: 4,
          scale: 3
        }
      },
    ],
  }), [dashboard.mapPoint]);

  const sankeyOption = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: { 
      trigger: 'item' as const, 
      triggerOn: 'mousemove' as const,
      backgroundColor: 'rgba(255, 252, 246, 0.95)',
      borderColor: panelBorder,
      textStyle: { color: panelTitle }
    },
    series: [
      {
        type: 'sankey',
        top: '10%',
        bottom: '6%',
        left: '2%',
        right: '10%',
        data: dashboard.sankeyData.nodes,
        links: dashboard.sankeyData.links,
        nodeWidth: 18,
        nodeGap: 14,
        lineStyle: {
          color: 'gradient',
          opacity: 0.4,
          curveness: 0.5,
        },
        itemStyle: {
          borderWidth: 0,
          borderRadius: 2,
          color: (params: { dataIndex: number }) => [
            accentCyan, 
            accentOchre, 
            '#8b6846', 
            '#d4834f', 
            '#6b8e5f'
          ][params.dataIndex % 5],
          shadowBlur: 6,
          shadowColor: 'rgba(58, 48, 40, 0.1)'
        },
        label: {
          color: panelTitle,
          fontSize: 11,
          fontWeight: 700,
          fontFamily: '"KaiTi", "STKaiti", serif'
        },
        emphasis: {
          focus: 'adjacency'
        }
      },
    ],
  }), [dashboard.sankeyData]);

  return (
    <div
      ref={frameRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${frameScale})`,
          transformOrigin: 'center center',
          flexShrink: 0,
          overflow: 'hidden',
          background: paperBackground,
          borderRadius: '16px',
          boxShadow: 
            '0 24px 64px rgba(58, 48, 40, 0.2), ' +
            '0 8px 24px rgba(58, 48, 40, 0.12), ' +
            'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.4), transparent 20%), ' +
              'linear-gradient(180deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.05) 30%, rgba(184, 138, 59, 0.04) 100%)',
            pointerEvents: 'none',
            borderRadius: 'inherit',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 18% 75%, rgba(139, 104, 70, 0.08), transparent 28%), ' +
              'radial-gradient(ellipse at 82% 72%, rgba(91, 141, 134, 0.06), transparent 26%)',
            pointerEvents: 'none',
            borderRadius: 'inherit',
          }}
        />
        <BambooDecoration side="left" />
        <BambooDecoration side="right" />

        <div
          style={{
            position: 'absolute',
            left: 630,
            top: 8,
            width: 400,
            height: 60,
            background: 'url("/beijing-siheyuan/head_bg.png") center center / 100% 100% no-repeat',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"KaiTi", "STKaiti", serif',
            fontSize: 36,
            fontWeight: 700,
            color: panelTitle,
            letterSpacing: 3,
            textShadow: '0 2px 8px rgba(255, 255, 255, 0.8), 0 1px 2px rgba(58, 48, 40, 0.2)',
          }}
        >
          {dashboard.title}
        </div>

        <div style={{ position: 'absolute', left: 16, top: 18, width: 500, height: 206 }}>
          <DashboardPanel title="温雨双折图">
            <ReactECharts option={climateSeasonOption} style={{ height: '100%' }} />
          </DashboardPanel>
        </div>

        <div style={{ position: 'absolute', left: 16, top: 238, width: 500, height: 248 }}>
          <DashboardPanel title="建材环形图">
            <ReactECharts option={materialOption} style={{ height: '100%' }} />
          </DashboardPanel>
        </div>

        <div style={{ position: 'absolute', left: 16, top: 500, width: 500, height: 250 }}>
          <DashboardPanel title="构造桑基图">
            <ReactECharts option={sankeyOption} style={{ height: '100%' }} />
          </DashboardPanel>
        </div>

        <div style={{ position: 'absolute', left: 550, top: 68, width: 540, height: 124 }}>
          <DashboardPanel title="分布地数据">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, paddingTop: 6 }}>
              {dashboard.statsCards.map((card) => (
                <div
                  key={card.label}
                  style={{
                    border: `1px solid ${panelBorder}`,
                    background: 'rgba(248, 239, 214, 0.22)',
                    minHeight: 42,
                    display: 'grid',
                    placeItems: 'center',
                    padding: '10px 8px',
                  }}
                >
                  <div style={{ color: accentCyan, fontSize: 27, lineHeight: 1, fontWeight: 700, fontFamily: 'Georgia, "Times New Roman", serif' }}>
                    {card.value}
                  </div>
                  <div style={{ marginTop: 6, color: textMuted, fontSize: 12, fontWeight: 600 }}>{card.label}</div>
                </div>
              ))}
            </div>
          </DashboardPanel>
        </div>

        <div style={{ position: 'absolute', left: 548, top: 214, width: 548, height: 364 }}>
          <DashboardPanel title="分布图">
            {geoLoaded ? (
              <ReactECharts option={mapOption} style={{ height: '100%' }} />
            ) : (
              <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: textMuted }}>地理坐标加载中...</div>
            )}
          </DashboardPanel>
        </div>

        <div style={{ position: 'absolute', left: 548, top: 594, width: 548, height: 156 }}>
          <DashboardPanel title="保护状况">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18 }}>
              <div style={{ minWidth: 160, paddingTop: 4 }}>
                <div style={{ color: textMuted, fontSize: 12 }}>2026-03-11</div>
                <div style={{ marginTop: 24, fontSize: 38, lineHeight: 1, color: '#d44747', fontWeight: 800 }}>{dashboard.preserveRange}</div>
                <div style={{ marginTop: 10, color: textMuted, fontSize: 13 }}>现存四合院数量</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, flex: 1 }}>
                {dashboard.gauges.map((gauge) => (
                  <Gauge key={gauge.label} gauge={gauge} />
                ))}
              </div>
            </div>
          </DashboardPanel>
        </div>

        <div style={{ position: 'absolute', left: 1118, top: 18, width: 526, height: 258 }}>
          <DashboardPanel title="">
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 8, height: '100%' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: -22, left: 0, color: panelTitle, fontFamily: '"KaiTi", "STKaiti", serif', fontSize: 16, fontWeight: 700 }}>分类</div>
                <ClassificationPetals items={dashboard.classificationPetals} />
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: -22, left: 0, color: panelTitle, fontFamily: '"KaiTi", "STKaiti", serif', fontSize: 16, fontWeight: 700 }}>防御指数</div>
                <ReactECharts option={radarOption} style={{ height: '100%' }} />
              </div>
            </div>
          </DashboardPanel>
        </div>

        <div style={{ position: 'absolute', left: 1118, top: 292, width: 526, height: 138 }}>
          <DashboardPanel title="历史进程图">
            <div style={{ position: 'relative', height: '100%' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 26,
                  right: 26,
                  bottom: 18,
                  height: 5,
                  background: 'linear-gradient(90deg, #3dc4d2 0 33%, #d4a24c 33% 66%, #d74f6f 66% 100%)',
                }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10, paddingTop: 8 }}>
                {dashboard.historyStages.map((stage) => (
                  <div key={stage.title} style={{ textAlign: 'center' }}>
                    <div style={{ minHeight: 40, color: textMuted, fontSize: 10, lineHeight: 1.5, fontWeight: 700 }}>{stage.text}</div>
                    <div style={{ marginTop: 8, color: stage.color, fontSize: 16, fontWeight: 800 }}>{stage.title}</div>
                    <div style={{ width: 42, height: 3, background: stage.color, margin: '4px auto 0' }} />
                  </div>
                ))}
              </div>
            </div>
          </DashboardPanel>
        </div>

        <div style={{ position: 'absolute', left: 1118, top: 446, width: 526, height: 304 }}>
          <DashboardPanel title="分布词云图">
            <RegionWordCloud words={dashboard.regionWords} />
          </DashboardPanel>
        </div>
      </div>
    </div>
  );
}
