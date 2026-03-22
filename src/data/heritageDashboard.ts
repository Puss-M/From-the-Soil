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
    '表现', '一种', '由于', '主要是', '进行', '分布', '因此', '这种', '以及',
    '不仅', '具备', '具有', '对于', '也是', '可以', '实现', '整体', '所谓',
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
  
  // Use distinct sources for each era to avoid repetition
  const content = [
    safeSlice(sanitizeText(detail.materials), 24),      // 营造源流 -> focus on materials/technique
    safeSlice(sanitizeText(detail.classification), 24), // 空间演化 -> focus on structure/class
    heritage.length > 0 
      ? safeSlice(sanitizeText(heritage[0].projectName), 24) 
      : safeSlice(sanitizeText(detail.moistureProof), 24), // 当代保护 -> focus on heritage items
  ];

  return fallback.map((era, index) => ({
    era,
    text: content[index],
  }));
}

function buildRadarValues(detail: StationDetailData, climate: WorldClimData, heritage: HeritageInfo[], decorations: DecorationItem[]) {
  const text = [detail.defense, detail.materials, detail.moistureProof, detail.heating].join(' ');
  
  // 防火: 根据材料判断 (砖石结构得分高)
  const fireScore = (text.includes('砖') || text.includes('石') || text.includes('火墙') || text.includes('镬耳')) ? 85 : 45;
  
  // 防水/潮: 根据防潮描述判断
  const waterScore = (text.includes('排水') || text.includes('抬高') || text.includes('石材') || text.includes('防潮')) ? 82 : 55;
  
  // 防恶劣天气 (风/雪/沙): 根据防御和气候判断
  const weatherScore = (detail.defense.includes('气候') || detail.defense.includes('风') || detail.defense.includes('沙') || climate.precipSeasonality > 80) ? 88 : 65;
  
  // 防匪/盗: 根据防御描述判断
  const securityScore = (detail.defense.includes('匪') || detail.defense.includes('盗') || detail.defense.includes('封闭') || detail.defense.includes('厚重')) ? 86 : 35;
  
  // 综合适应性/文化价值: 根据非遗项和装饰丰富度
  const heritageScore = clamp(heritage.length * 12 + decorations.length * 4 + 45, 40, 95);

  return [fireScore, waterScore, weatherScore, securityScore, heritageScore];
}

function buildSankeyData(detail: StationDetailData, title: string) {
  const categories = [
    { label: '分类', value: detail.classification },
    { label: '防御', value: detail.defense },
    { label: '材料', value: detail.materials },
    { label: '调节', value: detail.heating + ' ' + detail.moistureProof },
    { label: '文化', value: detail.folklore },
  ];

  const nodes = [{ name: title }];
  const links: SankeyLink[] = [];

  categories.forEach((cat) => {
    const nodeName = cat.label;
    const valueText = safeSlice(sanitizeText(cat.value), 12);
    nodes.push({ name: nodeName, label: { position: 'left' } } as any);
    nodes.push({ name: valueText, label: { position: 'right' } } as any);
    links.push({ source: title, target: nodeName, value: 20 });
    links.push({ source: nodeName, target: valueText, value: 20 });
  });

  const uniqueNodesMap = new Map();
  nodes.forEach(n => {
    if (!uniqueNodesMap.has(n.name)) {
      uniqueNodesMap.set(n.name, n);
    }
  });
  const uniqueNodes = Array.from(uniqueNodesMap.values());

  return { nodes: uniqueNodes, links };
}

function buildGauges(heritage: HeritageInfo[], decorations: DecorationItem[]): DashboardGauge[] {
  return [
    { label: '现存建筑热度', value: clamp(heritage.length * 18 + 30, 20, 96), display: `${Math.max(heritage.length, 1)}项`, color: '#d58b54' },
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
  const recordCount = Math.max(heritage.length, 1);

  return {
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
    monthlyTemperature: distributeMonthlyTemperature(climate),
    monthlyPrecipitation: distributeMonthlyPrecipitation(climate),
    materialDistribution: buildMaterialDistribution(detail, station.id),
    categoryDistribution: countByCategory(decorations),
    radarValues: buildRadarValues(detail, climate, heritage, decorations),
    mapPoint: {
      name: station.name,
      coords: [station.coordinates[0], station.coordinates[1]],
    },
    words: buildWordCloud(detail, heritage, decorations),
    heritageTimeline: buildTimeline(heritage, detail),
    sankeyData: buildSankeyData(detail, stationLabel),
    gauges: buildGauges(heritage, decorations),
    preserveRange: `${Math.max(recordCount * 160, 600)}-${Math.max(recordCount * 260, 1200)}`,
    preserveDate: new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' }).format(new Date()),
    preserveCount: `${recordCount}项`,
  };
}
