'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
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

function Panel({
  title,
  subtitle,
  children,
  minHeight,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  minHeight?: number;
}) {
  return (
    <section
      style={{
        position: 'relative',
        background: 'rgba(193, 247, 236, 0.18)',
        border: '1px solid rgba(59, 208, 226, 0.5)',
        boxShadow: 'inset 0 0 0 1px rgba(59, 208, 226, 0.15)',
        minHeight,
        padding: '16px 18px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 8,
          border: '1px solid rgba(59, 208, 226, 0.12)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 12, color: '#0f56bb', fontWeight: 700, marginBottom: 6 }}>{title}</div>
        {subtitle ? (
          <div style={{ fontSize: 11, color: '#4f7da6', marginBottom: 10 }}>{subtitle}</div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export function HeritageDashboard({ station, climate, detail, heritage, decorations }: Props) {
  const [geoLoaded, setGeoLoaded] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [frameScale, setFrameScale] = useState(1);
  const BASE_WIDTH = 1540;
  const BASE_HEIGHT = 760;

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

      const nextScale = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);
      setFrameScale(nextScale);
    };

    updateScale();

    const observer = new ResizeObserver(() => {
      updateScale();
    });

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
    animationDuration: 600,
    grid: { left: 38, right: 38, top: 30, bottom: 34 },
    tooltip: { trigger: 'axis' as const },
    legend: {
      data: ['月均水量(mm)', '月均温度(°C)'],
      bottom: 0,
      textStyle: { color: '#487086', fontSize: 11 },
    },
    xAxis: {
      type: 'category' as const,
      data: MONTHS,
      axisLine: { lineStyle: { color: '#79c8d8' } },
      axisLabel: { color: '#5d6f78', fontSize: 10 },
    },
    yAxis: [
      {
        type: 'value' as const,
        name: 'mm',
        nameTextStyle: { color: '#5d6f78', fontSize: 10 },
        axisLabel: { color: '#5d6f78', fontSize: 10 },
        splitLine: { lineStyle: { color: 'rgba(93, 111, 120, 0.12)' } },
      },
      {
        type: 'value' as const,
        name: '°C',
        nameTextStyle: { color: '#9d6b42', fontSize: 10 },
        axisLabel: { color: '#9d6b42', fontSize: 10 },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '月均水量(mm)',
        type: 'bar',
        data: dashboard.monthlyPrecipitation,
        barWidth: 16,
        itemStyle: {
          color: 'rgba(72, 186, 197, 0.82)',
          borderRadius: [10, 10, 0, 0],
        },
      },
      {
        name: '月均温度(°C)',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: dashboard.monthlyTemperature,
        symbolSize: 6,
        lineStyle: { color: '#ca8e56', width: 2 },
        itemStyle: { color: '#fff', borderColor: '#ca8e56', borderWidth: 2 },
      },
    ],
  }), [dashboard.monthlyPrecipitation, dashboard.monthlyTemperature]);

  const formOption = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' as const },
    legend: {
      bottom: 0,
      textStyle: { color: '#5d6f78', fontSize: 11 },
    },
    series: [
      {
        type: 'pie',
        radius: ['38%', '68%'],
        center: ['50%', '46%'],
        avoidLabelOverlap: true,
        label: {
          color: '#4a6172',
          formatter: '{b}',
          fontSize: 11,
        },
        itemStyle: {
          borderColor: 'rgba(250, 244, 230, 0.9)',
          borderWidth: 2,
        },
        data: dashboard.formDistribution.map((item, index) => ({
          ...item,
          itemStyle: {
            color: ['#51c4d3', '#f09c5c', '#5c83e6', '#8e74d8', '#c69a49', '#ec6b73'][index % 6],
          },
        })),
      },
    ],
  }), [dashboard.formDistribution]);

  const radarOption = useMemo(() => ({
    backgroundColor: 'transparent',
    radar: {
      radius: '70%',
      splitNumber: 4,
      indicator: [
        { name: '防火', max: 100 },
        { name: '防水', max: 100 },
        { name: '温差适应', max: 100 },
        { name: '防御', max: 100 },
        { name: '装饰', max: 100 },
        { name: '传承', max: 100 },
      ],
      axisName: { color: '#6a6258', fontSize: 12 },
      splitLine: { lineStyle: { color: 'rgba(245, 241, 230, 0.68)' } },
      splitArea: { areaStyle: { color: ['rgba(255,255,255,0.05)'] } },
      axisLine: { lineStyle: { color: 'rgba(245, 241, 230, 0.5)' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: dashboard.radarValues,
            name: dashboard.title,
            areaStyle: { color: 'rgba(224, 182, 112, 0.3)' },
            lineStyle: { color: '#c9964d', width: 2 },
            itemStyle: { color: '#c9964d' },
          },
        ],
      },
    ],
  }), [dashboard.radarValues, dashboard.title]);

  const categoryOption = useMemo(() => ({
    backgroundColor: 'transparent',
    grid: { left: 84, right: 18, top: 18, bottom: 18 },
    tooltip: { trigger: 'axis' as const },
    yAxis: {
      type: 'category' as const,
      data: dashboard.categoryDistribution.map((item) => item.name),
      axisLabel: { color: '#5d6f78', fontSize: 11 },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    xAxis: {
      type: 'value' as const,
      axisLabel: { color: '#5d6f78', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(93, 111, 120, 0.12)' } },
      axisLine: { show: false },
    },
    series: [
      {
        type: 'bar',
        data: dashboard.categoryDistribution.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: ['#45c2d0', '#7d9af2', '#89c36b', '#f3a84b', '#ad79ef', '#ef757f'][index % 6],
          },
        })),
        barWidth: 16,
        showBackground: true,
        backgroundStyle: { color: 'rgba(255,255,255,0.18)' },
        label: {
          show: true,
          position: 'right' as const,
          color: '#6b5134',
          fontSize: 11,
        },
      },
    ],
  }), [dashboard.categoryDistribution]);

  const formBarOption = useMemo(() => ({
    backgroundColor: 'transparent',
    grid: { left: 82, right: 16, top: 20, bottom: 12 },
    tooltip: { trigger: 'axis' as const },
    yAxis: {
      type: 'category' as const,
      data: dashboard.formDistribution.map((item) => item.name),
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { color: '#5d6f78', fontSize: 11 },
    },
    xAxis: {
      type: 'value' as const,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#5d6f78', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(93,111,120,0.12)' } },
    },
    series: [
      {
        type: 'bar',
        data: dashboard.formDistribution.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: ['#51c4d3', '#f09c5c', '#5c83e6', '#8e74d8', '#c69a49', '#ec6b73'][index % 6],
            borderRadius: 10,
          },
        })),
        barWidth: 14,
        label: {
          show: true,
          position: 'right' as const,
          color: '#6b5134',
          fontSize: 11,
        },
      },
    ],
  }), [dashboard.formDistribution]);

  const mapOption = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' as const, formatter: '{b}' },
    geo: {
      map: 'china-dashboard',
      roam: false,
      zoom: 1.05,
      itemStyle: {
        areaColor: '#d9a446',
        borderColor: 'rgba(255,255,255,0.7)',
        borderWidth: 1.1,
        shadowBlur: 12,
        shadowColor: 'rgba(255,255,255,0.5)',
      },
      emphasis: {
        itemStyle: { areaColor: '#ebb856' },
      },
      regions: [
        {
          name: '北京',
          itemStyle: { areaColor: '#d9a446' },
        },
      ],
    },
    series: [
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        symbolSize: 18,
        data: [
          {
            name: dashboard.mapPoint.name,
            value: [...dashboard.mapPoint.coords, 1],
          },
        ],
        itemStyle: { color: '#d2f4ff', borderColor: '#7cbfd8', borderWidth: 4, shadowBlur: 14, shadowColor: '#fff' },
      },
    ],
  }), [dashboard.mapPoint]);

  return (
    <div
      ref={frameRef}
      style={{
        position: 'relative',
        height: '100%',
        minHeight: 'calc(100vh - 152px)',
        padding: '0',
        color: '#443621',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at top, rgba(255, 250, 236, 0.88), transparent 26%), linear-gradient(180deg, rgba(246, 236, 204, 0.96) 0%, rgba(239, 224, 179, 0.96) 45%, rgba(227, 201, 144, 0.96) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 18% 18%, rgba(114, 188, 178, 0.12), transparent 18%), radial-gradient(circle at 84% 16%, rgba(255, 194, 102, 0.2), transparent 22%), radial-gradient(circle at 10% 90%, rgba(75, 157, 149, 0.16), transparent 20%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.14,
          pointerEvents: 'none',
          background:
            'linear-gradient(135deg, transparent 0%, transparent 46%, rgba(0,0,0,0.08) 50%, transparent 54%, transparent 100%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${frameScale})`,
          transformOrigin: 'top center',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: '#bc8a32', letterSpacing: 5, marginBottom: 4 }}>HERITAGE DASHBOARD</div>
          <h2 style={{ margin: 0, fontSize: 'clamp(1.45rem, 2.6vw, 2.2rem)', color: '#c27a0d', fontWeight: 800 }}>
            {dashboard.title}
          </h2>
          <div style={{ marginTop: 4, color: '#5c7e95', fontSize: 12, letterSpacing: 1.5 }}>{dashboard.subtitle}</div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
            gap: 8,
            marginBottom: 10,
          }}
        >
          {dashboard.metrics.map((metric) => (
            <div
              key={metric.label}
              style={{
                background: 'rgba(255, 250, 236, 0.58)',
                border: '1px solid rgba(59, 208, 226, 0.42)',
                padding: '10px 8px',
                textAlign: 'center',
                boxShadow: 'inset 0 0 0 1px rgba(59, 208, 226, 0.12)',
              }}
            >
              <div style={{ fontSize: 11, color: '#58a0ca', marginBottom: 5 }}>{metric.label}</div>
              <div style={{ fontSize: 15, color: metric.accent, fontWeight: 800 }}>{metric.value}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '300px minmax(0, 1fr) 320px',
            gap: 10,
            alignItems: 'start',
            height: 'calc(100% - 100px)',
          }}
        >
          <div style={{ display: 'grid', gap: 10, height: '100%', gridTemplateRows: '0.92fr 0.92fr 0.92fr' }}>
            <Panel title="温雨双折图" subtitle="基于核心气候数据推演月度季相" minHeight={0}>
              <ReactECharts option={climateSeasonOption} style={{ height: 158 }} />
            </Panel>
            <Panel title="装饰构成" subtitle="按装饰表现形式聚合" minHeight={0}>
              <div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 6, alignItems: 'center' }}>
                <ReactECharts option={formOption} style={{ height: 168 }} />
                <ReactECharts option={formBarOption} style={{ height: 168 }} />
              </div>
            </Panel>
            <Panel title="构造摘要" subtitle={dashboard.location} minHeight={0}>
              <div style={{ display: 'grid', gap: 8, fontSize: 12, lineHeight: 1.65, color: '#594d40' }}>
                {dashboard.summary.map((item) => (
                  <div key={item} style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.32)' }}>
                    {item}
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div style={{ display: 'grid', gap: 10, height: '100%', gridTemplateRows: '0.96fr 0.72fr' }}>
            <Panel title="分布地图数据" subtitle={climate.climateType} minHeight={0}>
              {geoLoaded ? (
                <ReactECharts option={mapOption} style={{ height: 238 }} />
              ) : (
                <div style={{ height: 238, display: 'grid', placeItems: 'center', color: '#6f7d81' }}>地图加载中...</div>
              )}
            </Panel>

            <Panel title="保护状况" subtitle="基于非遗与气候的摘要指标" minHeight={0}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: 10,
                  marginTop: 6,
                }}
              >
                {[
                  ['完整存量', `${Math.max(heritage.length * 300 + decorations.length * 12, 400)}`],
                  ['保护占比', `${Math.min(heritage.length * 18 + 24, 96)}%`],
                  ['装饰活跃度', `${Math.min(decorations.length * 3 + 12, 98)}%`],
                ].map(([label, value], index) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        margin: '0 auto 6px',
                        borderRadius: '50%',
                        border: `6px solid ${['#f09c5c', '#55c4d5', '#9b7ad8'][index]}`,
                        borderTopColor: 'rgba(255,255,255,0.55)',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'rgba(255,255,255,0.22)',
                        fontWeight: 800,
                        color: ['#b96224', '#27809a', '#7855ba'][index],
                      }}
                    >
                      {value}
                    </div>
                    <div style={{ fontSize: 11, color: '#5d6f78' }}>{label}</div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 10,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: 8,
                }}
              >
                {[
                  ['气候类型', climate.climateType],
                  ['代表位置', dashboard.location.split('（')[0]],
                  ['进化线索', dashboard.heritageTimeline.map((item) => item.era).join(' / ')],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      padding: '8px 10px',
                      background: 'rgba(255,255,255,0.24)',
                      minHeight: 58,
                    }}
                  >
                    <div style={{ fontSize: 10, color: '#6a8ea2', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 11, lineHeight: 1.45, color: '#5d4d39', fontWeight: 600 }}>{value}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div style={{ display: 'grid', gap: 10, height: '100%', gridTemplateRows: '0.88fr 0.66fr 0.9fr 0.66fr' }}>
            <Panel title="适应性评估" subtitle="气候与形制耦合指标" minHeight={0}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 12 }}>
                <div style={{ minHeight: 220 }}>
                  <ReactECharts option={radarOption} style={{ height: 156 }} />
                </div>
                <div
                  style={{
                    display: 'grid',
                    alignContent: 'start',
                    gap: 8,
                    color: '#6b5134',
                  }}
                >
                  {[
                    ['分类', detail.classification.split('，')[0]],
                    ['防御', detail.defense.split('，')[0]],
                    ['材料', detail.materials.split('，')[0]],
                    ['取暖', detail.heating.split('。')[0] || detail.heating],
                  ].map(([label, value], index) => (
                    <div
                      key={label}
                      style={{
                        padding: '8px 10px',
                        minHeight: 46,
                        background: ['rgba(212, 93, 98, 0.14)', 'rgba(91, 191, 212, 0.16)', 'rgba(123, 80, 120, 0.14)', 'rgba(201, 154, 73, 0.16)'][index],
                        borderLeft: `3px solid ${['#d45d62', '#5bbfd4', '#7b5078', '#c99a49'][index]}`,
                      }}
                    >
                      <div style={{ fontSize: 10, opacity: 0.8, marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.4 }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

            <Panel title="历史进程图" subtitle="从营造到保护的演进摘要" minHeight={0}>
              <div style={{ display: 'grid', gap: 10, marginTop: 4 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
                  {dashboard.heritageTimeline.map((item, index) => (
                    <div key={item.era} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: '#ffffff', marginBottom: 6, lineHeight: 1.4 }}>{item.text}</div>
                      <div
                        style={{
                          height: 5,
                          background: ['#48c2ca', '#cb9854', '#df6377'][index],
                          marginBottom: 6,
                        }}
                      />
                      <div style={{ color: ['#48c2ca', '#cb9854', '#df6377'][index], fontWeight: 800, fontSize: 15 }}>{item.era}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

            <Panel title="关键词画像" subtitle="高频语义 Top 10" minHeight={0}>
              <div style={{ display: 'grid', gap: 8 }}>
                {dashboard.words.slice(0, 7).map((word, index) => (
                  <div key={`${word.text}-${index}`}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 3,
                        fontSize: 11,
                        color: '#5b5246',
                      }}
                    >
                      <span>{word.text}</span>
                      <span>{word.weight}</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.2)' }}>
                      <div
                        style={{
                          width: `${Math.min(word.weight * 2.2, 100)}%`,
                          height: '100%',
                          background: ['#45c2d0', '#7d9af2', '#89c36b', '#f3a84b', '#ad79ef', '#ef757f'][index % 6],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="题材柱图" subtitle="题材分类 Top 6" minHeight={0}>
              <ReactECharts option={categoryOption} style={{ height: 118 }} />
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
