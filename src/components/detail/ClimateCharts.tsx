'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { WorldClimData } from '@/data/climateDetails';

// 动态导入 ECharts 避免 SSR 问题
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface Props {
  climate: WorldClimData;
  stationName: string;
}

export function ClimateCharts({ climate, stationName }: Props) {
  // 雷达图数据
  const radarOption = useMemo(() => ({
    backgroundColor: 'transparent',
    title: {
      text: '气候指标雷达图',
      left: 'center',
      textStyle: { fontSize: 15, fontWeight: 700, color: '#3a2a1a' },
    },
    tooltip: { trigger: 'item' as const },
    radar: {
      indicator: [
        { name: '年均温\n(℃)', max: 30 },
        { name: '年降水\n(mm)', max: 2000 },
        { name: '温度年较差\n(℃)', max: 55 },
        { name: '太阳辐射\n(kJ)', max: 18000 },
        { name: '风速\n(m/s)', max: 5 },
        { name: '水蒸气压\n(kPa)', max: 2.5 },
      ],
      shape: 'polygon' as const,
      splitNumber: 4,
      axisName: { color: '#6b7280', fontSize: 10 },
      splitArea: {
        areaStyle: {
          color: ['rgba(196,168,130,0.03)', 'rgba(196,168,130,0.06)', 'rgba(196,168,130,0.09)', 'rgba(196,168,130,0.12)'],
        },
      },
      splitLine: { lineStyle: { color: 'rgba(196,168,130,0.2)' } },
      axisLine: { lineStyle: { color: 'rgba(196,168,130,0.3)' } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: [
          climate.annualMeanTemp,
          climate.annualPrecipitation,
          climate.tempAnnualRange,
          climate.annualMeanSolarRadiation,
          climate.annualMeanWindSpeed,
          climate.annualMeanVaporPressure,
        ],
        name: stationName,
        areaStyle: {
          color: {
            type: 'radial' as const,
            x: 0.5, y: 0.5, r: 0.5,
            colorStops: [
              { offset: 0, color: 'rgba(196,88,28,0.25)' },
              { offset: 1, color: 'rgba(196,88,28,0.05)' },
            ],
          },
        },
        lineStyle: { color: '#c4581c', width: 2 },
        itemStyle: { color: '#c4581c' },
      }],
    }],
  }), [climate, stationName]);

  // 温度范围图
  const tempOption = useMemo(() => {
    const categories = ['最冷月最低温', '最冷季均温', '年均温', '最暖季均温', '最热月最高温'];
    const values = [
      climate.minTempColdestMonth,
      climate.meanTempColdestQuarter,
      climate.annualMeanTemp,
      climate.meanTempWarmestQuarter,
      climate.maxTempWarmestMonth,
    ];

    return {
      backgroundColor: 'transparent',
      title: {
        text: '温度分布 (℃)',
        left: 'center',
        textStyle: { fontSize: 15, fontWeight: 700, color: '#3a2a1a' },
      },
      tooltip: {
        trigger: 'axis' as const,
        formatter: (params: Array<{ name: string; value: number }>) => {
          if (Array.isArray(params) && params.length > 0) {
            return `${params[0].name}: ${params[0].value.toFixed(1)}℃`;
          }
          return '';
        },
      },
      grid: { left: 60, right: 30, top: 50, bottom: 40 },
      xAxis: {
        type: 'category' as const,
        data: categories,
        axisLabel: { fontSize: 10, color: '#6b7280', interval: 0 },
        axisLine: { lineStyle: { color: '#d4c4b0' } },
      },
      yAxis: {
        type: 'value' as const,
        name: '℃',
        axisLabel: { fontSize: 10, color: '#6b7280' },
        splitLine: { lineStyle: { color: '#f0ece6' } },
        axisLine: { lineStyle: { color: '#d4c4b0' } },
      },
      series: [{
        type: 'bar',
        data: values.map((v, i) => ({
          value: v,
          itemStyle: {
            color: v < 0
              ? `rgba(59, 130, 246, ${0.5 + i * 0.1})`
              : `rgba(239, 68, 68, ${0.3 + i * 0.15})`,
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barWidth: '45%',
        label: {
          show: true,
          position: 'top' as const,
          fontSize: 11,
          fontWeight: 600,
          color: '#4a4a4a',
          formatter: (params: { value: number }) => `${params.value.toFixed(1)}°`,
        },
      }],
    };
  }, [climate]);

  // 降水分布图
  const precipOption = useMemo(() => {
    const categories = ['最干月', '最干季', '年降水', '最湿季', '最湿月'];
    const values = [
      climate.precipDriestMonth,
      climate.precipDriestQuarter,
      climate.annualPrecipitation,
      climate.precipWettestQuarter,
      climate.precipWettestMonth,
    ];

    return {
      backgroundColor: 'transparent',
      title: {
        text: '降水分布 (mm)',
        left: 'center',
        textStyle: { fontSize: 15, fontWeight: 700, color: '#3a2a1a' },
      },
      tooltip: {
        trigger: 'axis' as const,
        formatter: (params: Array<{ name: string; value: number }>) => {
          if (Array.isArray(params) && params.length > 0) {
            return `${params[0].name}: ${params[0].value}mm`;
          }
          return '';
        },
      },
      grid: { left: 60, right: 30, top: 50, bottom: 40 },
      xAxis: {
        type: 'category' as const,
        data: categories,
        axisLabel: { fontSize: 10, color: '#6b7280', interval: 0 },
        axisLine: { lineStyle: { color: '#d4c4b0' } },
      },
      yAxis: {
        type: 'value' as const,
        name: 'mm',
        axisLabel: { fontSize: 10, color: '#6b7280' },
        splitLine: { lineStyle: { color: '#f0ece6' } },
        axisLine: { lineStyle: { color: '#d4c4b0' } },
      },
      series: [{
        type: 'bar',
        data: values.map((v) => ({
          value: v,
          itemStyle: {
            color: {
              type: 'linear' as const,
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#3b82f6' },
                { offset: 1, color: '#93c5fd' },
              ],
            },
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barWidth: '45%',
        label: {
          show: true,
          position: 'top' as const,
          fontSize: 11,
          fontWeight: 600,
          color: '#4a4a4a',
          formatter: (params: { value: number }) => `${params.value}`,
        },
      }],
    };
  }, [climate]);

  // 关键数据卡片
  const keyMetrics = [
    { label: '年均温', value: `${climate.annualMeanTemp.toFixed(1)}℃`, icon: '🌡️', color: '#ef4444' },
    { label: '年降水量', value: `${climate.annualPrecipitation}mm`, icon: '🌧️', color: '#3b82f6' },
    { label: '日较差', value: `${climate.meanDiurnalRange.toFixed(1)}℃`, icon: '📊', color: '#f59e0b' },
    { label: '太阳辐射', value: `${(climate.annualMeanSolarRadiation / 1000).toFixed(1)}k`, icon: '☀️', color: '#f97316' },
    { label: '风速', value: `${climate.annualMeanWindSpeed.toFixed(1)}m/s`, icon: '💨', color: '#06b6d4' },
    { label: '降水季节性', value: `${climate.precipSeasonality.toFixed(0)}`, icon: '📈', color: '#8b5cf6' },
  ];

  return (
    <div style={{ marginBottom: 48 }}>
      {/* 标题 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
      }}>
        <div style={{ width: 4, height: 24, background: '#4a90c4', borderRadius: 2 }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#3a2a1a', margin: 0 }}>
          气候数据可视化
        </h2>
        <span style={{ fontSize: 12, color: '#a08b73' }}>WorldClim 2.1 · {climate.climateType}</span>
      </div>

      {/* 关键指标卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 12,
        marginBottom: 24,
      }}>
        {keyMetrics.map(({ label, value, icon, color }) => (
          <div key={label} style={{
            background: 'white',
            borderRadius: 12,
            padding: '14px 12px',
            textAlign: 'center',
            border: '1px solid #e8e0d8',
            boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
          }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color, marginBottom: 2 }}>{value}</div>
            <div style={{ fontSize: 10, color: '#9ca3af' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* 图表区 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
        marginBottom: 20,
      }}>
        {/* 雷达图 */}
        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: 20,
          border: '1px solid #e8e0d8',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}>
          <ReactECharts option={radarOption} style={{ height: 320 }} />
        </div>

        {/* 温度范围图 */}
        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: 20,
          border: '1px solid #e8e0d8',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}>
          <ReactECharts option={tempOption} style={{ height: 320 }} />
        </div>
      </div>

      {/* 降水图 */}
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: 20,
        border: '1px solid #e8e0d8',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}>
        <ReactECharts option={precipOption} style={{ height: 300 }} />
      </div>

      {/* 地形描述 */}
      {climate.terrain && (
        <div style={{
          marginTop: 16,
          background: 'white',
          borderRadius: 14,
          padding: '16px 24px',
          border: '1px solid #e8e0d8',
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>🏔️</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#8b7355', marginBottom: 6 }}>地形地貌</div>
            <div style={{ fontSize: 13, lineHeight: 1.8, color: '#4a4a4a' }}>{climate.terrain}</div>
          </div>
        </div>
      )}
    </div>
  );
}
