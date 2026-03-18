import type { Station } from '@/types';
import type { WorldClimData } from './climateDetails';
import type { StationDetailData } from './stationDetails';
import type { HeritageInfo } from './heritageData';
import type { DecorationItem } from './decorationData';

export interface DashboardMetric {
  label: string;
  value: string;
}

export interface DashboardWord {
  text: string;
  weight: number;
}

export interface DashboardGauge {
  label: string;
  value: number;
  color: string;
  display: string;
}

export interface HeritageDashboardData {
  title: string;
  subtitle: string;
  location: string;
  climateType: string;
  metrics: DashboardMetric[];
  monthlyTemperature: number[];
  monthlyPrecipitation: number[];
  materialDistribution: Array<{ name: string; value: number }>;
  categoryDistribution: Array<{ name: string; value: number }>;
  radarValues: number[];
  mapPoint: {
    name: string;
    coords: [number, number];
  };
  words: DashboardWord[];
  heritageTimeline: Array<{ era: string; text: string }>;
  summary: Array<{ label: string; value: string }>;
  gauges: DashboardGauge[];
  preserveRange: string;
  preserveDate: string;
  preserveCount: string;
}

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

const BEIJING_RAW_DASHBOARD = {
  metrics: [
    { label: '年平均气温', value: '12.4868' },
    { label: '年降水量', value: '574' },
    { label: '年平均水蒸气压', value: '1.0141' },
    { label: '经度', value: '39.9042' },
    { label: '纬度', value: '116.3976' },
    { label: '海拔', value: '50.7628' },
  ],
  monthlyTemperature: [0, 2, 8, 16, 22, 27, 28, 27, 22, 15, 8, 2],
  monthlyPrecipitation: [4, 5, 8, 20, 35, 78, 175, 152, 58, 27, 9, 4],
  materialDistribution: [
    { name: '白灰', value: 28 },
    { name: '青灰', value: 34 },
    { name: '大理石', value: 16 },
    { name: '耐火土', value: 22 },
  ],
  radarValues: [64, 82, 76, 88, 71],
  words: [
    { text: '北京四合院', weight: 44 },
    { text: '西城区', weight: 40 },
    { text: '东城区', weight: 36 },
    { text: '砖雕', weight: 28 },
    { text: '木雕', weight: 26 },
    { text: '抱鼓石', weight: 24 },
    { text: '青灰', weight: 22 },
    { text: '白灰', weight: 20 },
    { text: '耐火土', weight: 20 },
    { text: '影壁', weight: 18 },
    { text: '门簪', weight: 18 },
    { text: '吉祥祈福', weight: 26 },
    { text: '台基抬高', weight: 20 },
    { text: '灰土垫层', weight: 20 },
    { text: '昌平区', weight: 18 },
    { text: '海淀区', weight: 18 },
  ],
  heritageTimeline: [
    { era: '商周', text: '院落雏形\n简单围合结构' },
    { era: '汉唐', text: '布局规整\n融入礼制观念' },
    { era: '明清', text: '形制多样\n高墙封闭\n院落进排布局固定' },
  ],
  summary: [
    { label: '冬季寒冷', value: '火炕、火墙和厚墙保温' },
    { label: '防潮抗碱胀', value: '灰土垫层与台基抬高' },
    { label: '风速高', value: '四面合围以减弱寒风侵袭' },
    { label: '台基抬高防潮', value: '白灰勾缝与耐火土夯实' },
    { label: '厅堂之间', value: '正房坐北朝南，厢房围合' },
  ],
  gauges: [
    { label: '现存四合院数量', value: 73, display: '923座', color: '#c78d52' },
    { label: '保护四合院占比', value: 48, display: '48%', color: '#d8a03a' },
    { label: '完整格局占比', value: 23, display: '23%', color: '#8aa88a' },
  ],
  preserveRange: '4000-5000',
  preserveDate: '2026-03-09',
  preserveCount: '923座',
} as const;

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

function splitTokens(text: string) {
  return text
    .split(/[\s\n\r\t、，,。；：:（）()\/·“”"'‘’\-]+/)
    .map((token) => token.trim())
    .filter(Boolean);
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
    .slice(0, 4);
}

function buildMaterialDistribution(detail: StationDetailData, stationId: string) {
  const presets: Record<string, Array<{ name: string; value: number }>> = {
    beijing: [
      { name: '白灰', value: 28 },
      { name: '青灰', value: 34 },
      { name: '大理石', value: 16 },
      { name: '耐火土', value: 22 },
    ],
    fujian: [
      { name: '生土', value: 40 },
      { name: '杉木', value: 26 },
      { name: '石料', value: 18 },
      { name: '青砖瓦', value: 16 },
    ],
  };

  if (presets[stationId]) {
    return presets[stationId];
  }

  const candidateTerms = [
    '木材', '石材', '砖瓦', '夯土', '生土', '青砖', '青瓦', '石料', '白灰', '青灰',
    '竹材', '竹木', '花岗岩', '泥土', '土坯', '杉木', '海草', '大理石',
  ];
  const counter = new Map<string, number>();
  const tokens = splitTokens(detail.materials);

  candidateTerms.forEach((term) => {
    const hitCount = tokens.filter((token) => token.includes(term)).length;
    if (hitCount > 0) {
      counter.set(term, hitCount);
    }
  });

  const items = Array.from(counter.entries())
    .map(([name, count]) => ({ name, value: clamp(count * 10 + 8, 10, 36) }))
    .slice(0, 4);

  return items.length > 0
    ? items
    : [
        { name: '木材', value: 30 },
        { name: '石材', value: 22 },
        { name: '砖瓦', value: 28 },
        { name: '土料', value: 20 },
      ];
}

function tokenize(text: string) {
  const stopWords = new Set([
    '建筑', '民居', '传统', '方式', '主要', '形成', '体现', '采用', '装饰',
    '构件', '作用', '结构', '空间', '文化', '地区', '整体', '设计', '通过',
    '具有', '其中', '部分', '造型', '功能', '材料', '防潮', '防御', '建筑材料',
    '用于', '民俗', '图案', '纹样', '布局', '营造', '工艺', '构造', '家族',
  ]);

  return splitTokens(text).filter((token) => token.length >= 2 && token.length <= 8 && !stopWords.has(token));
}

function buildWordCloud(detail: StationDetailData, heritage: HeritageInfo[], decorations: DecorationItem[]) {
  const source = [
    detail.classification,
    detail.materials,
    detail.folklore,
    detail.moistureProof,
    detail.heating,
    ...heritage.map((item) => `${item.projectName} ${item.region} ${item.description}`),
    ...decorations.map((item) => `${item.form} ${item.location} ${item.motif} ${item.category} ${item.folklore || ''}`),
  ].join(' ');
  const counter = new Map<string, number>();

  tokenize(source).forEach((token) => {
    counter.set(token, (counter.get(token) || 0) + 1);
  });

  return Array.from(counter.entries())
    .map(([text, count]) => ({ text, weight: clamp(count * 8 + text.length * 4, 14, 46) }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 16);
}

function buildTimeline(heritage: HeritageInfo[], detail: StationDetailData, stationId: string) {
  if (stationId === 'beijing') {
    return BEIJING_RAW_DASHBOARD.heritageTimeline.map((item) => ({ ...item }));
  }

  const fallback = ['营造源流', '空间演化', '当代保护'];
  const content = heritage.length > 0
    ? heritage.slice(0, 3).map((item) => safeSlice(`${item.projectName} ${item.region}`, 18))
    : [
        safeSlice(detail.classification, 18),
        safeSlice(detail.materials, 18),
        safeSlice(detail.moistureProof, 18),
      ];

  return fallback.map((era, index) => ({
    era,
    text: content[index] || content[content.length - 1],
  }));
}

function buildSummary(detail: StationDetailData) {
  return [
    { label: '冬季寒冷', value: safeSlice(detail.heating, 26) },
    { label: '防潮抗碱胀', value: safeSlice(detail.moistureProof, 26) },
    { label: '风速高', value: safeSlice(detail.defense, 26) },
    { label: '台基抬高防潮', value: safeSlice(detail.materials, 26) },
    { label: '厅堂之间', value: safeSlice(detail.classification, 26) },
  ];
}

function buildMonthlyTemperature(climate: WorldClimData, stationId: string) {
  if (stationId === 'beijing') {
    return [...BEIJING_RAW_DASHBOARD.monthlyTemperature];
  }

  return distributeMonthlyTemperature(climate);
}

function buildMonthlyPrecipitation(climate: WorldClimData, stationId: string) {
  if (stationId === 'beijing') {
    return [...BEIJING_RAW_DASHBOARD.monthlyPrecipitation];
  }

  return distributeMonthlyPrecipitation(climate);
}

function buildWords(
  detail: StationDetailData,
  heritage: HeritageInfo[],
  decorations: DecorationItem[],
  stationId: string
) {
  if (stationId === 'beijing') {
    return BEIJING_RAW_DASHBOARD.words.map((item) => ({ ...item }));
  }

  return buildWordCloud(detail, heritage, decorations);
}

function buildGauges(heritage: HeritageInfo[], decorations: DecorationItem[], stationId: string): DashboardGauge[] {
  if (stationId === 'beijing') {
    return BEIJING_RAW_DASHBOARD.gauges.map((item) => ({ ...item }));
  }

  return [
    { label: '现存建筑热度', value: clamp(heritage.length * 18 + 30, 20, 96), display: `${heritage.length || 1}项`, color: '#d58b54' },
    { label: '保护占比', value: clamp(heritage.length * 16 + 24, 18, 92), display: `${clamp(heritage.length * 16 + 24, 18, 92)}%`, color: '#d8a03a' },
    { label: '完整格局占比', value: clamp(decorations.length * 2 + 18, 16, 88), display: `${clamp(decorations.length * 2 + 18, 16, 88)}%`, color: '#39b9c8' },
  ];
}

export function buildHeritageDashboardData(args: {
  station: Station;
  climate: WorldClimData;
  detail: StationDetailData;
  heritage: HeritageInfo[];
  decorations: DecorationItem[];
}): HeritageDashboardData {
  const { station, climate, detail, heritage, decorations } = args;
  const stationLabel = station.id === 'beijing' ? '北京四合院' : station.name.replace(/驿$/, '');
  const isBeijing = station.id === 'beijing';

  return {
    title: stationLabel,
    subtitle: `${station.region} · ${station.nameEn}`,
    location: climate.location,
    climateType: climate.climateType,
    metrics: isBeijing
      ? BEIJING_RAW_DASHBOARD.metrics.map((item) => ({ ...item }))
      : [
          { label: '年平均气温', value: climate.annualMeanTemp.toFixed(4) },
          { label: '年降水量', value: `${Math.round(climate.annualPrecipitation)}` },
          { label: '年平均水蒸气压', value: climate.annualMeanVaporPressure.toFixed(4) },
          { label: '经度', value: climate.latitude.toFixed(4) },
          { label: '纬度', value: climate.longitude.toFixed(4) },
          { label: '海拔', value: climate.altitude.toFixed(4) },
        ],
    monthlyTemperature: buildMonthlyTemperature(climate, station.id),
    monthlyPrecipitation: buildMonthlyPrecipitation(climate, station.id),
    materialDistribution: isBeijing
      ? BEIJING_RAW_DASHBOARD.materialDistribution.map((item) => ({ ...item }))
      : buildMaterialDistribution(detail, station.id),
    categoryDistribution: countByCategory(decorations),
    radarValues: isBeijing
      ? [...BEIJING_RAW_DASHBOARD.radarValues]
      : [
          normalize(climate.annualPrecipitation, 2000),
          normalize(climate.precipSeasonality, 140),
          normalize(climate.tempAnnualRange, 50),
          normalize(detail.defense.includes('强') ? 88 : detail.defense.includes('局部') ? 58 : 24, 100),
          normalize(heritage.length * 28 + decorations.length * 2, 100),
        ],
    mapPoint: {
      name: station.name,
      coords: [station.coordinates[0], station.coordinates[1]],
    },
    words: buildWords(detail, heritage, decorations, station.id),
    heritageTimeline: buildTimeline(heritage, detail, station.id),
    summary: isBeijing
      ? BEIJING_RAW_DASHBOARD.summary.map((item) => ({ ...item }))
      : buildSummary(detail),
    gauges: buildGauges(heritage, decorations, station.id),
    preserveRange: isBeijing ? BEIJING_RAW_DASHBOARD.preserveRange : `${Math.max(heritage.length * 200, 600)}-${Math.max(heritage.length * 260, 1200)}`,
    preserveDate: isBeijing ? BEIJING_RAW_DASHBOARD.preserveDate : '2026-03-14',
    preserveCount: isBeijing ? BEIJING_RAW_DASHBOARD.preserveCount : `${Math.max(heritage.length * 2, 1)}项`,
  };
}
