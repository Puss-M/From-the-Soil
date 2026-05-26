import type { Station } from '@/types';
import type { WorldClimData } from './climateDetails';
import type { StationDetailData } from './stationDetails';
import type { HeritageInfo } from './heritageData';
import type { DecorationItem } from './decorationData';
import docDashboardRaw from './fengwuzhiDocData.json';
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
    radarLabels: string[];
    metrics: DashboardMetric[];
    monthlyTemperature: number[];
    monthlyPrecipitation: number[];
    materialDistribution: Array<{
        name: string;
        value: number;
    }>;
    categoryDistribution: Array<{
        name: string;
        value: number;
    }>;
    radarValues: number[];
    mapPoint: {
        name: string;
        coords: [
            number,
            number
        ];
    };
    mapRegions: string[];
    words: DashboardWord[];
    heritageTimeline: Array<{
        era: string;
        text: string;
    }>;
    sankeyData: {
        nodes: Array<{
            name: string;
            label?: {
                position: 'left' | 'right';
            };
        }>;
        links: SankeyLink[];
    };
    gauges: DashboardGauge[];
    preserveRange: string;
    preserveDate: string;
    preserveCount: string;
}
const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
const RADAR_LABELS = ['防火', '防盗', '防匪', '防恶劣天气', '防水'];
export { MONTHS };
interface DocSeries {
    name: string;
    data: number[];
}
interface DocDashboardStationData {
    displayName?: string;
    radar?: Partial<Record<(typeof RADAR_LABELS)[number], number>> & {
        总分?: number;
    };
    climate?: {
        data?: {
            series?: DocSeries[];
        };
    };
    materials?: {
        data?: {
            series?: Array<{
                data?: Array<{
                    name: string;
                    value: number;
                }>;
            }>;
        };
    };
    sankey?: {
        data?: {
            nodes?: Array<{
                name: string;
            }>;
            links?: SankeyLink[];
        };
    };
    map?: {
        data?: {
            mapData?: Array<{
                name: string;
            }>;
        };
    };
    categories?: {
        data?: Array<{
            name: string;
            value: number;
        }>;
    };
    timeline?: {
        data?: {
            data?: Array<{
                date: string;
                x2?: string[];
            }>;
        };
    };
    wordcloud?: {
        data?: Array<{
            name: string;
            value: number;
        }>;
    };
}
const docDashboardData = docDashboardRaw as Record<string, DocDashboardStationData>;
function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}
function toNumber(value: unknown, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
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
function buildDocCategoryDistribution(stationId: string) {
    const docCategories = docDashboardData[stationId]?.categories?.data;
    if (!Array.isArray(docCategories) || docCategories.length === 0) {
        return null;
    }
    return docCategories
        .map((item) => ({ name: item.name, value: toNumber(item.value) }))
        .filter((item) => item.name && item.value > 0)
        .slice(0, 6);
}
function buildMaterialDistribution(detail: StationDetailData, stationId: string) {
    const docSeries = docDashboardData[stationId]?.materials?.data?.series?.[0]?.data;
    if (Array.isArray(docSeries) && docSeries.length > 0) {
        return docSeries
            .map((item) => ({ name: item.name, value: toNumber(item.value) }))
            .filter((item) => item.name && item.value > 0)
            .slice(0, 6);
    }
    const presets: Record<string, Array<{
        name: string;
        value: number;
    }>> = {
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
function buildTimelineFromDoc(stationId: string) {
    const items = docDashboardData[stationId]?.timeline?.data?.data;
    if (!Array.isArray(items) || items.length === 0) {
        return null;
    }
    return items.slice(0, 3).map((item) => ({
        era: item.date,
        text: (item.x2 || []).join('\n'),
    }));
}
function buildRadarValues(stationId: string, detail: StationDetailData, climate: WorldClimData, heritage: HeritageInfo[], decorations: DecorationItem[]) {
    const docRadar = docDashboardData[stationId]?.radar;
    if (docRadar) {
        return RADAR_LABELS.map((label) => toNumber(docRadar[label], 60));
    }
    const text = [detail.defense, detail.materials, detail.moistureProof, detail.heating].join(' ');
    const fireScore = (text.includes('砖') || text.includes('石') || text.includes('火墙') || text.includes('镬耳')) ? 85 : 45;
    const waterScore = (text.includes('排水') || text.includes('抬高') || text.includes('石材') || text.includes('防潮')) ? 82 : 55;
    const weatherScore = (detail.defense.includes('气候') || detail.defense.includes('风') || detail.defense.includes('沙') || climate.precipSeasonality > 80) ? 88 : 65;
    const antiTheftScore = (detail.defense.includes('盗') || detail.defense.includes('封闭') || detail.defense.includes('厚重')) ? 86 : 35;
    const antiBanditScore = (detail.defense.includes('匪') || detail.defense.includes('防御') || detail.defense.includes('易守难攻'))
        ? clamp(antiTheftScore - 4, 35, 96)
        : clamp(heritage.length * 10 + decorations.length * 2 + 30, 30, 88);
    return [fireScore, antiTheftScore, antiBanditScore, weatherScore, waterScore];
}
function buildSankeyData(stationId: string, detail: StationDetailData, title: string) {
    const docSankey = docDashboardData[stationId]?.sankey?.data;
    if (docSankey?.nodes?.length && docSankey.links?.length) {
        return {
            nodes: docSankey.nodes,
            links: docSankey.links.map((item) => ({
                source: item.source,
                target: item.target,
                value: toNumber(item.value, 1),
            })),
        };
    }
    const categories = [
        { label: '分类', value: detail.classification },
        { label: '防御', value: detail.defense },
        { label: '材料', value: detail.materials },
        { label: '调节', value: detail.heating + ' ' + detail.moistureProof },
        { label: '文化', value: detail.folklore },
    ];
    const nodes: Array<{
        name: string;
        label?: {
            position: 'left' | 'right';
        };
    }> = [{ name: title }];
    const links: SankeyLink[] = [];
    categories.forEach((cat) => {
        const nodeName = cat.label;
        const valueText = safeSlice(sanitizeText(cat.value), 12);
        nodes.push({ name: nodeName, label: { position: 'left' } });
        nodes.push({ name: valueText, label: { position: 'right' } });
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
function buildWordCloud(detail: StationDetailData, heritage: HeritageInfo[], decorations: DecorationItem[], stationId: string) {
    const docWords = docDashboardData[stationId]?.wordcloud?.data;
    if (Array.isArray(docWords) && docWords.length > 0) {
        return docWords
            .map((item) => ({
            text: item.name,
            weight: clamp(Math.round(toNumber(item.value, 1) * 3 + 12), 12, 52),
        }))
            .slice(0, 16);
    }
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
function buildMonthlyTemperature(stationId: string, climate: WorldClimData) {
    const series = docDashboardData[stationId]?.climate?.data?.series;
    const docTemp = series?.find((item) => item.name.includes('温度'))?.data;
    if (Array.isArray(docTemp) && docTemp.length === 12) {
        return docTemp.map((item) => Number(item.toFixed(1)));
    }
    return distributeMonthlyTemperature(climate);
}
function buildMonthlyPrecipitation(stationId: string, climate: WorldClimData) {
    const series = docDashboardData[stationId]?.climate?.data?.series;
    const docPrecip = series?.find((item) => item.name.includes('降水'))?.data;
    if (Array.isArray(docPrecip) && docPrecip.length === 12) {
        return docPrecip.map((item) => Number(item.toFixed(1)));
    }
    return distributeMonthlyPrecipitation(climate);
}
function buildGauges(stationId: string, heritage: HeritageInfo[], decorations: DecorationItem[]): DashboardGauge[] {
    if (stationId === 'beijing') {
        return [
            { label: '完整四合院存量', value: 92, display: '923座', color: '#d59f4c' },
            { label: '保护四合院占比', value: 48, display: '48%', color: '#d7a24e' },
            { label: '完整格局占比', value: 23, display: '23%', color: '#45bfd0' },
        ];
    }
    const docRadar = docDashboardData[stationId]?.radar;
    if (docRadar) {
        const labels: Array<(typeof RADAR_LABELS)[number]> = ['防火', '防盗', '防水'];
        return labels.map((label, index) => ({
            label,
            value: toNumber(docRadar[label], 60),
            display: `${toNumber(docRadar[label], 60)}`,
            color: ['#d58b54', '#d8a03a', '#39b9c8'][index],
        }));
    }
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
    const stationDoc = docDashboardData[station.id];
    const stationLabel = stationDoc?.displayName || (station.id === 'beijing' ? '北京四合院' : station.name.replace(/驿$/, ''));
    const docTimeline = buildTimelineFromDoc(station.id);
    const docCategoryDistribution = buildDocCategoryDistribution(station.id);
    const mapRegions = stationDoc?.map?.data?.mapData?.map((item) => item.name).filter(Boolean) || [station.region];
    const isBeijing = station.id === 'beijing';
    const metrics = isBeijing
        ? [
            { label: '年平均气温', value: climate.annualMeanTemp.toFixed(4) },
            { label: '年降水量', value: Math.round(climate.annualPrecipitation).toString() },
            { label: '年平均水蒸气压', value: climate.annualMeanVaporPressure.toFixed(4) },
            { label: '经度', value: climate.latitude.toFixed(4) },
            { label: '纬度', value: climate.longitude.toFixed(4) },
            { label: '海拔', value: climate.altitude.toFixed(4) },
        ]
        : [
            { label: '年平均气温', value: climate.annualMeanTemp.toFixed(4) },
            { label: '年降水量', value: Math.round(climate.annualPrecipitation).toString() },
            { label: '年平均水蒸气压', value: climate.annualMeanVaporPressure.toFixed(4) },
            { label: '经度', value: climate.longitude.toFixed(4) },
            { label: '纬度', value: climate.latitude.toFixed(4) },
            { label: '海拔', value: climate.altitude.toFixed(4) },
        ];
    const preserveRange = isBeijing ? '4000-5000' : `${Math.max(Math.round(climate.annualPrecipitation * 3), 1600)}-${Math.max(Math.round(climate.annualPrecipitation * 5), 3200)}`;
    const preserveDate = isBeijing ? '2026-03-11' : new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' }).format(new Date());
    const preserveCount = isBeijing ? '923座' : `${Math.max(heritage.length, 1)}项`;
    return {
        title: stationLabel,
        subtitle: `${station.region} · ${station.nameEn}`,
        location: climate.location,
        climateType: climate.climateType,
        radarLabels: RADAR_LABELS,
        metrics,
        monthlyTemperature: buildMonthlyTemperature(station.id, climate),
        monthlyPrecipitation: buildMonthlyPrecipitation(station.id, climate),
        materialDistribution: buildMaterialDistribution(detail, station.id),
        categoryDistribution: docCategoryDistribution || countByCategory(decorations),
        radarValues: buildRadarValues(station.id, detail, climate, heritage, decorations),
        mapPoint: {
            name: station.name,
            coords: [station.coordinates[0], station.coordinates[1]],
        },
        mapRegions,
        words: buildWordCloud(detail, heritage, decorations, station.id),
        heritageTimeline: docTimeline || buildTimeline(heritage, detail),
        sankeyData: buildSankeyData(station.id, detail, stationLabel),
        gauges: buildGauges(station.id, heritage, decorations),
        preserveRange,
        preserveDate,
        preserveCount,
    };
}
