import type { Station } from '@/types';
import type { WorldClimData } from './climateDetails';
import type { StationDetailData } from './stationDetails';
import type { HeritageInfo } from './heritageData';
import type { DecorationItem } from './decorationData';

export interface DashboardMetric {
  label: string;
  value: string;
  accent: string;
}

export interface DashboardWord {
  text: string;
  weight: number;
}

export interface HeritageDashboardData {
  title: string;
  subtitle: string;
  location: string;
  metrics: DashboardMetric[];
  monthlyTemperature: number[];
  monthlyPrecipitation: number[];
  formDistribution: Array<{ name: string; value: number }>;
  categoryDistribution: Array<{ name: string; value: number }>;
  radarValues: number[];
  mapPoint: {
    name: string;
    coords: [number, number];
  };
  words: DashboardWord[];
  heritageTimeline: Array<{ era: string; text: string }>;
  summary: string[];
}

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

export { MONTHS };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalize(value: number, max: number) {
  return Number(((value / max) * 100).toFixed(1));
}

function safeSlice(text: string, size: number) {
  return text.length > size ? `${text.slice(0, size)}...` : text;
}

function distributeMonthlyTemperature(climate: WorldClimData) {
  const amplitude = climate.tempAnnualRange / 2;

  return Array.from({ length: 12 }, (_, monthIndex) => {
    const seasonal = Math.sin(((monthIndex - 3) / 12) * Math.PI * 2);
    return Number((climate.annualMeanTemp + amplitude * seasonal).toFixed(1));
  });
}

function distributeMonthlyPrecipitation(climate: WorldClimData) {
  const climateType = climate.climateType;
  const wetSummer = /季风|雨林/.test(climateType);
  const dryContinental = /干旱|大陆性/.test(climateType);
  const basePattern = wetSummer
    ? [0.45, 0.52, 0.66, 0.84, 1.14, 1.62, 2.08, 1.98, 1.36, 0.86, 0.58, 0.46]
    : dryContinental
      ? [0.28, 0.3, 0.38, 0.54, 0.82, 1.08, 1.26, 1.18, 0.86, 0.62, 0.4, 0.28]
      : [0.36, 0.42, 0.56, 0.78, 1.04, 1.34, 1.62, 1.52, 1.08, 0.74, 0.48, 0.36];
  const totalWeight = basePattern.reduce((sum, item) => sum + item, 0);
  const raw = basePattern.map((weight) => (weight / totalWeight) * climate.annualPrecipitation);

  return raw.map((value, index) => {
    const adjustment = Math.sin(((index - 4) / 12) * Math.PI * 2);
    const adjusted = value + adjustment * climate.precipSeasonality * 0.06;
    return Number(Math.max(adjusted, climate.precipDriestMonth * 0.45).toFixed(0));
  });
}

function countByForm(decorations: DecorationItem[]) {
  const counter = new Map<string, number>();

  decorations
    .filter((item) => item.form.trim())
    .forEach((item) => {
      counter.set(item.form, (counter.get(item.form) || 0) + 1);
    });

  return Array.from(counter.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

function countByCategory(decorations: DecorationItem[]) {
  const counter = new Map<string, number>();

  decorations.forEach((item) => {
    item.category
      .split(/[、，,]/)
      .map((token) => token.trim())
      .filter((token) => token && token !== '无题材类')
      .forEach((token) => {
        counter.set(token, (counter.get(token) || 0) + 1);
      });
  });

  return Array.from(counter.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

function tokenize(text: string) {
  const stopWords = new Set([
    '建筑', '民居', '传统', '方式', '功能', '主要', '形成', '体现', '采用', '装饰',
    '构件', '进行', '作用', '结构', '空间', '文化', '地区', '系统', '一种', '整体',
    '设计', '用于', '通过', '具有', '兼具', '以及', '其中', '部分', '造型', '实现',
    '核心', '墙体', '屋顶', '院落', '纹样', '图案', '类别', '分布', '地域', '吉祥',
  ]);

  return text
    .split(/[\s\n\r\t、，,。；：:（）()\/·“”"'‘’\-]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && token.length <= 8 && !stopWords.has(token));
}

function buildWordCloud(detail: StationDetailData, heritage: HeritageInfo[], decorations: DecorationItem[]) {
  const source = [
    detail.classification,
    detail.materials,
    detail.folklore,
    detail.moistureProof,
    ...heritage.map((item) => `${item.projectName} ${item.region} ${item.description}`),
    ...decorations.map((item) => `${item.form} ${item.location} ${item.motif} ${item.category} ${item.folklore || ''}`),
  ].join(' ');
  const counter = new Map<string, number>();

  tokenize(source).forEach((token) => {
    counter.set(token, (counter.get(token) || 0) + 1);
  });

  return Array.from(counter.entries())
    .map(([text, count]) => ({ text, weight: clamp(count * 8 + text.length * 4, 14, 44) }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 22);
}

function buildTimeline(heritage: HeritageInfo[]) {
  const labels = ['营造源流', '地理分布', '非遗保护'];
  const fallback = ['形制成熟', '因地制宜', '持续传承'];
  const content = heritage.length > 0
    ? heritage.slice(0, 3).map((item) => `${item.projectName} · ${safeSlice(item.region, 16)}`)
    : fallback;

  return labels.map((era, index) => ({
    era,
    text: content[index] || fallback[index],
  }));
}

export function buildHeritageDashboardData(args: {
  station: Station;
  climate: WorldClimData;
  detail: StationDetailData;
  heritage: HeritageInfo[];
  decorations: DecorationItem[];
}): HeritageDashboardData {
  const { station, climate, detail, heritage, decorations } = args;

  return {
    title: station.name.replace(/驿$/, ''),
    subtitle: `${station.region} · ${station.nameEn}`,
    location: climate.location,
    metrics: [
      { label: '年平均气温', value: `${climate.annualMeanTemp.toFixed(2)}°C`, accent: '#2089d2' },
      { label: '年降水量', value: `${Math.round(climate.annualPrecipitation)} mm`, accent: '#42b6c9' },
      { label: '年平均水蒸气压', value: `${climate.annualMeanVaporPressure.toFixed(3)} kPa`, accent: '#2ca784' },
      { label: '经度 / 纬度', value: `${climate.longitude.toFixed(4)} / ${climate.latitude.toFixed(4)}`, accent: '#d28c28' },
      { label: '海拔', value: `${Math.round(climate.altitude)} m`, accent: '#b77422' },
      { label: '非遗 / 装饰', value: `${heritage.length} / ${decorations.length}`, accent: '#8d5bd1' },
    ],
    monthlyTemperature: distributeMonthlyTemperature(climate),
    monthlyPrecipitation: distributeMonthlyPrecipitation(climate),
    formDistribution: countByForm(decorations),
    categoryDistribution: countByCategory(decorations),
    radarValues: [
      normalize(climate.annualPrecipitation, 2000),
      normalize(climate.altitude, 4000),
      normalize(climate.tempAnnualRange, 55),
      normalize(detail.defense.includes('强') ? 90 : detail.defense.includes('局部') ? 52 : 26, 100),
      normalize(decorations.length * 8, 100),
      normalize(heritage.length * 28, 100),
    ],
    mapPoint: {
      name: station.name,
      coords: [station.coordinates[0], station.coordinates[1]],
    },
    words: buildWordCloud(detail, heritage, decorations),
    heritageTimeline: buildTimeline(heritage),
    summary: [
      `分类：${safeSlice(detail.classification, 56)}`,
      `材料：${safeSlice(detail.materials, 56)}`,
      `防潮：${safeSlice(detail.moistureProof, 56)}`,
    ],
  };
}
