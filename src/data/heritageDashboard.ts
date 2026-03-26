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

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface DashboardStatCard {
  label: string;
  value: string;
}

export interface DashboardHistoryStage {
  title: string;
  text: string;
  color: string;
}

export interface DashboardRegionWord {
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

export interface DashboardPetal {
  label: string;
  color: string;
}

export interface HeritageDashboardData {
  mode: 'beijing-showcase' | 'generic';
  title: string;
  subtitle: string;
  location: string;
  climateType: string;
  metrics: DashboardMetric[];
  statsCards: DashboardStatCard[];
  monthlyTemperature: number[];
  monthlyPrecipitation: number[];
  materialDistribution: Array<{ name: string; value: number }>;
  categoryDistribution: Array<{ name: string; value: number }>;
  classificationPetals: DashboardPetal[];
  radarValues: number[];
  radarLabels: string[];
  mapPoint: {
    name: string;
    coords: [number, number];
  };
  words: DashboardWord[];
  regionWords: DashboardRegionWord[];
  heritageTimeline: Array<{ era: string; text: string }>;
  historyStages: DashboardHistoryStage[];
  sankeyData: {
    nodes: Array<{ name: string }>;
    links: SankeyLink[];
  };
  gauges: DashboardGauge[];
  preserveRange: string;
  preserveDate: string;
  preserveCount: string;
}

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

export { MONTHS };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function sanitizeText(text: string) {
  return text
    .replace(/\uFFFD/g, '')
    .replace(/[．]/g, '。')
    .replace(/\s+/g, ' ')
    .trim();
}

function safeSlice(text: string, size: number) {
  return text.length > size ? `${text.slice(0, size)}...` : text;
}

function splitTokens(text: string) {
  return sanitizeText(text)
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
      { name: '白灰', value: 80 },
      { name: '青灰', value: 80 },
      { name: '大理石', value: 60 },
      { name: '耐火土', value: 50 },
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
    '表现', '一种', '由于', '主要是', '进行', '分布', '因此', '这种', '以及',
    '不仅', '具备', '对于', '也是', '可以', '实现', '所谓',
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

function buildTimeline(heritage: HeritageInfo[], detail: StationDetailData) {
  const fallback = ['营造源流', '空间演化', '当代保护'];
  const content = [
    safeSlice(sanitizeText(detail.materials), 24),
    safeSlice(sanitizeText(detail.classification), 24),
    heritage.length > 0
      ? safeSlice(sanitizeText(heritage[0].projectName), 24)
      : safeSlice(sanitizeText(detail.moistureProof), 24),
  ];

  return fallback.map((era, index) => ({
    era,
    text: content[index],
  }));
}

function buildRadarValues(detail: StationDetailData, climate: WorldClimData, heritage: HeritageInfo[], decorations: DecorationItem[]) {
  const text = [detail.defense, detail.materials, detail.moistureProof, detail.heating].join(' ');
  const fireScore = (text.includes('砖') || text.includes('石') || text.includes('火墙') || text.includes('镬耳')) ? 85 : 45;
  const waterScore = (text.includes('排水') || text.includes('抬高') || text.includes('石材') || text.includes('防潮')) ? 82 : 55;
  const weatherScore = (detail.defense.includes('气候') || detail.defense.includes('风') || detail.defense.includes('沙') || climate.precipSeasonality > 80) ? 88 : 65;
  const securityScore = (detail.defense.includes('匪') || detail.defense.includes('盗') || detail.defense.includes('封闭') || detail.defense.includes('厚重')) ? 86 : 35;
  const heritageScore = clamp(heritage.length * 12 + decorations.length * 4 + 45, 40, 95);

  return [fireScore, waterScore, weatherScore, securityScore, heritageScore];
}

function buildSankeyData(detail: StationDetailData, title: string) {
  const categories = [
    { label: '分类', value: detail.classification },
    { label: '防御', value: detail.defense },
    { label: '材料', value: detail.materials },
    { label: '调节', value: `${detail.heating} ${detail.moistureProof}` },
    { label: '文化', value: detail.folklore },
  ];

  const nodes = [{ name: title }];
  const links: SankeyLink[] = [];

  categories.forEach((cat) => {
    const nodeName = cat.label;
    const valueText = safeSlice(sanitizeText(cat.value), 12);
    nodes.push({ name: nodeName, label: { position: 'left' } } as never);
    nodes.push({ name: valueText, label: { position: 'right' } } as never);
    links.push({ source: title, target: nodeName, value: 20 });
    links.push({ source: nodeName, target: valueText, value: 20 });
  });

  const uniqueNodesMap = new Map<string, { name: string }>();
  nodes.forEach((node) => {
    if (!uniqueNodesMap.has(node.name)) {
      uniqueNodesMap.set(node.name, node);
    }
  });

  return { nodes: Array.from(uniqueNodesMap.values()), links };
}

function buildGauges(heritage: HeritageInfo[], decorations: DecorationItem[]): DashboardGauge[] {
  return [
    { label: '现存台合院数', value: clamp(heritage.length * 18 + 30, 20, 96), display: `${Math.max(heritage.length, 1)}项`, color: '#d79b4d' },
    { label: '保护四合院占比', value: clamp(heritage.length * 16 + 24, 18, 92), display: `${clamp(heritage.length * 16 + 24, 18, 92)}%`, color: '#e3bf55' },
    { label: '完整格局占比', value: clamp(decorations.length * 2 + 18, 16, 88), display: `${clamp(decorations.length * 2 + 18, 16, 88)}%`, color: '#53c8cf' },
  ];
}

function buildRegionWords(station: Station, words: DashboardWord[]): DashboardRegionWord[] {
  if (station.id === 'beijing') {
    return [
      { text: '东城区', x: 58, y: 54, size: 30, color: '#2092d8' },
      { text: '西城区', x: 43, y: 69, size: 28, color: '#d83838' },
      { text: '丰台区', x: 33, y: 48, size: 18, color: '#d45534' },
      { text: '海淀区', x: 74, y: 46, size: 18, color: '#2ab0b0' },
      { text: '崇文门周边', x: 71, y: 82, size: 16, color: '#6f3db4' },
      { text: '宣武门周边', x: 55, y: 84, size: 16, color: '#c47a18' },
      { text: '昌平区近郊', x: 22, y: 72, size: 14, color: '#7f47bc' },
      { text: '通州周边', x: 84, y: 66, size: 14, color: '#31a860' },
      { text: '前门片区', x: 56, y: 35, size: 13, color: '#e04958' },
      { text: '南锣鼓巷', x: 80, y: 58, size: 14, color: '#24aa7b' },
      { text: '南区', x: 28, y: 79, size: 12, color: '#44a95b' },
      { text: '天津老城厢', x: 86, y: 37, size: 12, color: '#d36f2b' },
    ];
  }

  return words.slice(0, 10).map((word, index) => ({
    text: word.text,
    x: 18 + (index % 4) * 20 + (index % 2) * 3,
    y: 24 + Math.floor(index / 4) * 24 + (index % 3) * 2,
    size: 12 + Math.min(word.weight, 28),
    color: ['#2092d8', '#d83838', '#2ab0b0', '#c47a18', '#7f47bc'][index % 5],
  }));
}

function buildHistoryStages(station: Station, detail: StationDetailData, heritage: HeritageInfo[]): DashboardHistoryStage[] {
  if (station.id === 'beijing') {
    return [
      { title: '商周', text: '院落雏形显现，民居聚落开始分化', color: '#3dc4d2' },
      { title: '汉唐', text: '礼制与坊巷秩序叠加，合院格局成熟', color: '#d4a24c' },
      { title: '汉魏-清代', text: '四合院营造定型并传承至近现代', color: '#d74f6f' },
    ];
  }

  return [
    { title: '营造源流', text: safeSlice(sanitizeText(detail.materials), 22), color: '#3dc4d2' },
    { title: '空间演化', text: safeSlice(sanitizeText(detail.classification), 22), color: '#d4a24c' },
    { title: '当代保护', text: heritage[0] ? safeSlice(sanitizeText(heritage[0].projectName), 22) : safeSlice(sanitizeText(detail.moistureProof), 22), color: '#d74f6f' },
  ];
}

function buildClassificationPetals(station: Station, decorations: DecorationItem[]): DashboardPetal[] {
  if (station.id === 'beijing') {
    return [
      { label: '分类', color: '#da6a68' },
      { label: '营建', color: '#9b4f86' },
      { label: '礼序', color: '#5eaec6' },
      { label: '防御指数', color: '#d8b750' },
    ];
  }

  const categories = countByCategory(decorations);
  const fallbackNames = categories.length > 0 ? categories.map((item) => item.name) : ['材料', '构造', '习俗', '防御'];

  return fallbackNames.slice(0, 4).map((label, index) => ({
    label,
    color: ['#da6a68', '#9b4f86', '#5eaec6', '#d8b750'][index],
  }));
}

function buildBeijingShowcaseData(station: Station, climate: WorldClimData): HeritageDashboardData {
  return {
    mode: 'beijing-showcase',
    title: '北京四合院',
    subtitle: `${station.region} · ${station.nameEn}`,
    location: climate.location,
    climateType: climate.climateType,
    metrics: [
      { label: '年平均温', value: '12.4868' },
      { label: '年降水量', value: '574' },
      { label: '年平均水汽压', value: '1.0141' },
      { label: '经度', value: '39.9042' },
      { label: '纬度', value: '116.3976' },
      { label: '海拔', value: '50.7628' },
    ],
    statsCards: [
      { label: '年平均温', value: '12.4868' },
      { label: '年降水量', value: '574' },
      { label: '年平均水汽压', value: '1.0141' },
      { label: '经度', value: '39.9042' },
      { label: '纬度', value: '116.3976' },
      { label: '海拔', value: '50.7628' },
    ],
    monthlyTemperature: [-3.5, -0.7, 6.4, 14.2, 20.2, 24.5, 26.8, 25.8, 20.6, 13.2, 5.0, -1.5],
    monthlyPrecipitation: [2.8, 5.1, 8.5, 21.4, 36.8, 78.9, 175.6, 156.2, 59.3, 27.5, 9.7, 3.2],
    materialDistribution: [
      { name: '白灰', value: 80 },
      { name: '青灰', value: 80 },
      { name: '大理石', value: 60 },
      { name: '耐火土', value: 50 },
    ],
    categoryDistribution: [
      { name: '白灰', value: 80 },
      { name: '青灰', value: 80 },
      { name: '大理石', value: 60 },
      { name: '耐火土', value: 50 },
    ],
    classificationPetals: [
      { label: '分类', color: '#da6a68' },
      { label: '营建', color: '#9b4f86' },
      { label: '礼序', color: '#5eaec6' },
      { label: '防御指数', color: '#d8b750' },
    ],
    radarValues: [80, 90, 75, 85, 70],
    radarLabels: ['防火', '防盗', '防匪', '防恶劣天气', '防水'],
    mapPoint: {
      name: '北京',
      coords: [116.3976, 39.9042],
    },
    words: [
      { text: '东城区', weight: 46 },
      { text: '西城区', weight: 44 },
      { text: '丰台区', weight: 32 },
      { text: '海淀区', weight: 30 },
      { text: '崇文门周边', weight: 26 },
      { text: '宣武门周边', weight: 24 },
      { text: '昌平区近郊', weight: 22 },
      { text: '通州周边', weight: 20 },
      { text: '前门片区', weight: 18 },
      { text: '南锣鼓巷', weight: 18 },
      { text: '南区', weight: 14 },
      { text: '天津老城厢', weight: 14 },
    ],
    regionWords: buildRegionWords(station, []),
    heritageTimeline: [
      { era: '商周', text: '院落雏形' },
      { era: '汉唐', text: '礼序定型' },
      { era: '汉魏-清代', text: '四合院成熟' },
    ],
    historyStages: [
      { title: '商周', text: '院落雏形显现，民居聚落开始分化', color: '#3dc4d2' },
      { title: '汉唐', text: '礼制与坊巷秩序叠加，合院格局成熟', color: '#d4a24c' },
      { title: '汉魏-清代', text: '四合院营造定型并传承至近现代', color: '#d74f6f' },
    ],
    sankeyData: {
      nodes: [
        { name: '冬季寒冷' },
        { name: '风速高' },
        { name: '位于两河之间' },
        { name: '烧火炕保暖' },
        { name: '台基抬高防潮' },
        { name: '灰土垫层防潮' },
        { name: '石板隔水防潮' },
      ],
      links: [
        { source: '冬季寒冷', target: '烧火炕保暖', value: 5 },
        { source: '风速高', target: '烧火炕保暖', value: 5 },
        { source: '位于两河之间', target: '台基抬高防潮', value: 5 },
        { source: '位于两河之间', target: '灰土垫层防潮', value: 5 },
        { source: '位于两河之间', target: '石板隔水防潮', value: 5 },
      ],
    },
    gauges: [
      { label: '现存台合院数', value: 92, display: '923座', color: '#d79b4d' },
      { label: '保护四合院占比', value: 48, display: '48%', color: '#e3bf55' },
      { label: '完整格局占比', value: 23, display: '23%', color: '#53c8cf' },
    ],
    preserveRange: '4000-5000',
    preserveDate: '2026-03-11',
    preserveCount: '923座',
  };
}

export function buildHeritageDashboardData(args: {
  station: Station;
  climate: WorldClimData;
  detail: StationDetailData;
  heritage: HeritageInfo[];
  decorations: DecorationItem[];
}): HeritageDashboardData {
  const { station, climate, detail, heritage, decorations } = args;

  if (station.id === 'beijing') {
    return buildBeijingShowcaseData(station, climate);
  }

  const stationLabel = station.name.replace(/驿$/, '');
  const recordCount = Math.max(heritage.length, 1);
  const words = buildWordCloud(detail, heritage, decorations);

  return {
    mode: 'generic',
    title: stationLabel,
    subtitle: `${station.region} · ${station.nameEn}`,
    location: climate.location,
    climateType: climate.climateType,
    metrics: [
      { label: '年均温度', value: `${climate.annualMeanTemp.toFixed(1)} ℃` },
      { label: '年降水量', value: `${Math.round(climate.annualPrecipitation)} mm` },
      { label: '均水气压', value: `${climate.annualMeanVaporPressure.toFixed(2)} kPa` },
      { label: '海拔', value: `${climate.altitude.toFixed(0)} m` },
      { label: '坐标', value: `${climate.longitude.toFixed(1)}E/${climate.latitude.toFixed(1)}N` },
      { label: '区域', value: station.region },
    ],
    statsCards: [
      { label: '年均温度', value: climate.annualMeanTemp.toFixed(1) },
      { label: '年降水量', value: `${Math.round(climate.annualPrecipitation)}` },
      { label: '均水气压', value: climate.annualMeanVaporPressure.toFixed(2) },
      { label: '经度', value: climate.longitude.toFixed(2) },
      { label: '纬度', value: climate.latitude.toFixed(2) },
      { label: '海拔', value: climate.altitude.toFixed(1) },
    ],
    monthlyTemperature: distributeMonthlyTemperature(climate),
    monthlyPrecipitation: distributeMonthlyPrecipitation(climate),
    materialDistribution: buildMaterialDistribution(detail, station.id),
    categoryDistribution: countByCategory(decorations),
    classificationPetals: buildClassificationPetals(station, decorations),
    radarValues: buildRadarValues(detail, climate, heritage, decorations),
    radarLabels: ['防火', '防水', '防恶劣天气', '防御性', '文化适应'],
    mapPoint: {
      name: station.name,
      coords: [station.coordinates[0], station.coordinates[1]],
    },
    words,
    regionWords: buildRegionWords(station, words),
    heritageTimeline: buildTimeline(heritage, detail),
    historyStages: buildHistoryStages(station, detail, heritage),
    sankeyData: buildSankeyData(detail, stationLabel),
    gauges: buildGauges(heritage, decorations),
    preserveRange: `${Math.max(recordCount * 160, 600)}-${Math.max(recordCount * 260, 1200)}`,
    preserveDate: new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' }).format(new Date()),
    preserveCount: `${recordCount}项`,
  };
}
