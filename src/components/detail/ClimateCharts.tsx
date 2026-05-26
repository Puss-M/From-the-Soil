'use client';
import { useMemo, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { WorldClimData } from '@/data/climateDetails';
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });
interface Props {
    climate: WorldClimData;
    stationName: string;
}
const ink = '#5b4631';
const muted = '#8f7556';
const gold = '#b88a3b';
const brown = '#8b6846';
const cyan = '#5b8d86';
const paper = '#f7f1e3';
function buildChartTitle(text: string) {
    return {
        text,
        left: 'center',
        top: 8,
        textStyle: {
            color: brown,
            fontSize: 16,
            fontWeight: 700,
            fontFamily: 'KaiTi, STKaiti, serif',
        },
    };
}
function buildAxisTheme(unit: string) {
    return {
        type: 'value' as const,
        name: unit,
        nameTextStyle: {
            color: muted,
            fontSize: 11,
            padding: [0, 0, 0, 6],
        },
        axisLabel: { fontSize: 10, color: muted },
        axisLine: { show: true, lineStyle: { color: 'rgba(184,138,59,0.38)' } },
        axisTick: { show: false },
        splitLine: { show: false },
    };
}
function buildCategoryAxis(data: string[]) {
    return {
        type: 'category' as const,
        data,
        axisLabel: { fontSize: 10, color: muted, interval: 0 },
        axisLine: { lineStyle: { color: 'rgba(184,138,59,0.36)' } },
        axisTick: { show: false },
    };
}
function ChartShell({ title, children, }: {
    title: string;
    children: ReactNode;
}) {
    return (<section style={{
            position: 'relative',
            minHeight: 300,
            padding: '22px 20px 12px',
            background: 'linear-gradient(180deg, rgba(255,252,246,0.36), rgba(238,226,196,0.18)), radial-gradient(circle at top, rgba(184,138,59,0.12), transparent 44%)',
        }}>
      <div style={{
            position: 'absolute',
            top: 6,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: brown,
            fontFamily: '"KaiTi", "STKaiti", serif',
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 2,
        }}>
        <span style={{ width: 68, height: 1, background: 'linear-gradient(90deg, transparent, rgba(184,138,59,0.72), rgba(91,141,134,0.3))' }}/>
        {title}
        <span style={{ width: 68, height: 1, background: 'linear-gradient(90deg, rgba(91,141,134,0.3), rgba(184,138,59,0.72), transparent)' }}/>
      </div>
      {children}
    </section>);
}
export function ClimateCharts({ climate, stationName }: Props) {
    const radarOption = useMemo(() => ({
        backgroundColor: 'transparent',
        title: buildChartTitle('气候六维雷达'),
        tooltip: {
            trigger: 'item' as const,
            backgroundColor: 'rgba(247,241,227,0.96)',
            borderColor: 'rgba(184,138,59,0.28)',
            textStyle: { color: ink },
        },
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
            radius: '62%',
            axisName: { color: ink, fontSize: 10, fontWeight: 600 },
            splitArea: {
                areaStyle: {
                    color: ['rgba(184,138,59,0.02)', 'rgba(184,138,59,0.04)', 'rgba(91,141,134,0.04)', 'rgba(91,141,134,0.06)'],
                },
            },
            splitLine: { lineStyle: { color: 'rgba(184,138,59,0.18)' } },
            axisLine: { lineStyle: { color: 'rgba(91,141,134,0.18)' } },
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
                                x: 0.5,
                                y: 0.45,
                                r: 0.72,
                                colorStops: [
                                    { offset: 0, color: 'rgba(184,138,59,0.28)' },
                                    { offset: 1, color: 'rgba(91,141,134,0.06)' },
                                ],
                            },
                        },
                        lineStyle: { color: gold, width: 2 },
                        itemStyle: { color: cyan, borderColor: paper, borderWidth: 1 },
                    }],
            }],
    }), [climate, stationName]);
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
            title: buildChartTitle('温度分布'),
            tooltip: {
                trigger: 'axis' as const,
                backgroundColor: 'rgba(247,241,227,0.96)',
                borderColor: 'rgba(184,138,59,0.28)',
                textStyle: { color: ink },
                formatter: (params: Array<{
                    name: string;
                    value: number;
                }>) => Array.isArray(params) && params.length > 0 ? `${params[0].name}：${params[0].value.toFixed(1)}℃` : '',
            },
            grid: { left: 56, right: 24, top: 54, bottom: 40 },
            xAxis: buildCategoryAxis(categories),
            yAxis: buildAxisTheme('℃'),
            series: [{
                    type: 'bar',
                    barWidth: '44%',
                    data: values.map((value) => ({
                        value,
                        itemStyle: {
                            color: value < 0
                                ? {
                                    type: 'linear' as const,
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: '#8fb7b0' },
                                        { offset: 1, color: '#5b8d86' },
                                    ],
                                }
                                : {
                                    type: 'linear' as const,
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: '#d4b27f' },
                                        { offset: 1, color: '#b88a3b' },
                                    ],
                                },
                            borderRadius: [10, 10, 2, 2],
                        },
                    })),
                    label: {
                        show: true,
                        position: 'top' as const,
                        fontSize: 11,
                        color: ink,
                        formatter: (params: {
                            value: number;
                        }) => `${params.value.toFixed(1)}°`,
                    },
                }],
        };
    }, [climate]);
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
            title: buildChartTitle('降水分布'),
            tooltip: {
                trigger: 'axis' as const,
                backgroundColor: 'rgba(247,241,227,0.96)',
                borderColor: 'rgba(91,141,134,0.24)',
                textStyle: { color: ink },
                formatter: (params: Array<{
                    name: string;
                    value: number;
                }>) => Array.isArray(params) && params.length > 0 ? `${params[0].name}：${params[0].value} mm` : '',
            },
            grid: { left: 56, right: 24, top: 54, bottom: 40 },
            xAxis: buildCategoryAxis(categories),
            yAxis: buildAxisTheme('mm'),
            series: [{
                    type: 'bar',
                    barWidth: '44%',
                    data: values.map((value) => ({
                        value,
                        itemStyle: {
                            color: {
                                type: 'linear' as const,
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    { offset: 0, color: '#9cc0ba' },
                                    { offset: 1, color: '#5b8d86' },
                                ],
                            },
                            borderRadius: [10, 10, 2, 2],
                        },
                    })),
                    label: {
                        show: true,
                        position: 'top' as const,
                        fontSize: 11,
                        color: ink,
                    },
                }],
        };
    }, [climate]);
    const keyMetrics = [
        { label: '年均温', value: `${climate.annualMeanTemp.toFixed(1)}℃`, accent: gold },
        { label: '年降水量', value: `${climate.annualPrecipitation}mm`, accent: cyan },
        { label: '日较差', value: `${climate.meanDiurnalRange.toFixed(1)}℃`, accent: brown },
        { label: '太阳辐射', value: `${(climate.annualMeanSolarRadiation / 1000).toFixed(1)}k`, accent: gold },
        { label: '风速', value: `${climate.annualMeanWindSpeed.toFixed(1)}m/s`, accent: cyan },
        { label: '降水季节性', value: `${climate.precipSeasonality.toFixed(0)}`, accent: brown },
    ];
    return (<div style={{ marginBottom: 48, color: ink }}>
      <div style={{ marginBottom: 22, textAlign: 'center' }}>
        <div className="guofeng-section-title">气候数据可视化</div>
        <div style={{ marginTop: 8, fontSize: 12, color: muted, letterSpacing: 1 }}>
          WorldClim 2.1 · {climate.climateType} · {stationName}
        </div>
      </div>

      <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 12,
            marginBottom: 24,
        }}>
        {keyMetrics.map(({ label, value, accent }) => (<div key={label} style={{
                padding: '14px 8px',
                textAlign: 'center',
                background: 'linear-gradient(180deg, rgba(255,252,246,0.28), rgba(184,138,59,0.08))',
            }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: accent, marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 11, color: muted }}>{label}</div>
          </div>))}
      </div>

      <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
            marginBottom: 20,
        }}>
        <ChartShell title="气候指标">
          <ReactECharts option={radarOption} style={{ height: 320, marginTop: 14 }}/>
        </ChartShell>

        <ChartShell title="温度变化">
          <ReactECharts option={tempOption} style={{ height: 320, marginTop: 14 }}/>
        </ChartShell>
      </div>

      <ChartShell title="雨量节律">
        <ReactECharts option={precipOption} style={{ height: 300, marginTop: 14 }}/>
      </ChartShell>

      {climate.terrain ? (<div style={{
                marginTop: 18,
                padding: '14px 18px',
                background: 'linear-gradient(180deg, rgba(255,252,246,0.26), rgba(91,141,134,0.08))',
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
            }}>
          <div style={{ fontSize: 12, color: brown, fontWeight: 700, minWidth: 64 }}>地形地貌</div>
          <div style={{ fontSize: 13, lineHeight: 1.9, color: ink }}>{climate.terrain}</div>
        </div>) : null}
    </div>);
}
