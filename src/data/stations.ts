// 驿站数据 - 中国各地民居代表性节点
import { Station } from '@/types';

export const stations: Station[] = [
  // 江南水乡
  {
    id: 'suzhou',
    name: '苏州驿',
    nameEn: 'Suzhou',
    position: [-4, 0.3, 4],
    climate: {
      rainfall: 1200,
      humidity: 82,
      temperature: 16,
      altitude: 5,
      sunlight: 0.55,
      defense: 1,
    },
    buildingGene: '抬梁式',
    description: '四水归堂，天井院落',
    region: '江南',
  },
  // 徽州
  {
    id: 'huizhou',
    name: '徽州驿',
    nameEn: 'Huizhou',
    position: [-2, 0.8, 2],
    climate: {
      rainfall: 1500,
      humidity: 78,
      temperature: 15,
      altitude: 200,
      sunlight: 0.5,
      defense: 3,
    },
    buildingGene: '砖雕马头墙',
    description: '粉墙黛瓦，马头墙',
    region: '皖南',
  },
  // 福建土楼
  {
    id: 'fujian',
    name: '永定驿',
    nameEn: 'Yongding',
    position: [-3, 0.5, -1],
    climate: {
      rainfall: 1800,
      humidity: 85,
      temperature: 20,
      altitude: 300,
      sunlight: 0.6,
      defense: 9,
    },
    buildingGene: '圆形土楼',
    description: '防御工事，聚族而居',
    region: '闽西',
  },
  // 山西平遥
  {
    id: 'pingyao',
    name: '平遥驿',
    nameEn: 'Pingyao',
    position: [3, 1.2, 3],
    climate: {
      rainfall: 450,
      humidity: 55,
      temperature: 10,
      altitude: 800,
      sunlight: 0.75,
      defense: 5,
    },
    buildingGene: '窑洞式',
    description: '厚墙平顶，抵御风沙',
    region: '晋中',
  },
  // 陕北窑洞
  {
    id: 'yanan',
    name: '延安驿',
    nameEn: "Yan'an",
    position: [4, 1.5, 1],
    climate: {
      rainfall: 350,
      humidity: 45,
      temperature: 9,
      altitude: 1000,
      sunlight: 0.8,
      defense: 4,
    },
    buildingGene: '黄土窑洞',
    description: '依山而凿，冬暖夏凉',
    region: '陕北',
  },
  // 云南
  {
    id: 'dali',
    name: '大理驿',
    nameEn: 'Dali',
    position: [0, 2, -3],
    climate: {
      rainfall: 1000,
      humidity: 70,
      temperature: 15,
      altitude: 2000,
      sunlight: 0.7,
      defense: 2,
    },
    buildingGene: '三坊一照壁',
    description: '白族民居，照壁迎客',
    region: '滇西',
  },
  // 西藏
  {
    id: 'lhasa',
    name: '拉萨驿',
    nameEn: 'Lhasa',
    position: [2, 2.5, -4],
    climate: {
      rainfall: 200,
      humidity: 35,
      temperature: 8,
      altitude: 3650,
      sunlight: 0.9,
      defense: 6,
    },
    buildingGene: '碉房',
    description: '石砌碉房，抵御严寒',
    region: '藏区',
  },
  // 新疆
  {
    id: 'kashgar',
    name: '喀什驿',
    nameEn: 'Kashgar',
    position: [5, 1.8, -2],
    climate: {
      rainfall: 100,
      humidity: 30,
      temperature: 12,
      altitude: 1200,
      sunlight: 0.85,
      defense: 7,
    },
    buildingGene: '生土民居',
    description: '平顶厚墙，中庭天井',
    region: '南疆',
  },
];

// 根据两点气候差异计算"基因突变度"
export function calculateMutationIndex(stationA: Station, stationB: Station): number {
  const weights = {
    rainfall: 0.35,
    humidity: 0.15,
    temperature: 0.15,
    altitude: 0.1,
    sunlight: 0.1,
    defense: 0.15,
  };

  const normalize = {
    rainfall: 2000,
    humidity: 100,
    temperature: 30,
    altitude: 4000,
    sunlight: 1,
    defense: 10,
  };

  let totalDiff = 0;
  for (const key of Object.keys(weights) as Array<keyof typeof weights>) {
    const diff = Math.abs(stationA.climate[key] - stationB.climate[key]) / normalize[key];
    totalDiff += diff * weights[key];
  }

  return Math.round(totalDiff * 100);
}

// 获取跨越的气候带提示
export function getCrossedClimateBoundaries(stationA: Station, stationB: Station): string[] {
  const boundaries: string[] = [];
  
  // 800mm等降水量线 (半湿润/半干旱分界)
  if ((stationA.climate.rainfall > 800 && stationB.climate.rainfall < 800) ||
      (stationA.climate.rainfall < 800 && stationB.climate.rainfall > 800)) {
    boundaries.push('跨越 800mm 等降水量线，建筑形态将由坡顶向平顶演变');
  }
  
  // 400mm等降水量线 (半干旱/干旱分界)
  if ((stationA.climate.rainfall > 400 && stationB.climate.rainfall < 400) ||
      (stationA.climate.rainfall < 400 && stationB.climate.rainfall > 400)) {
    boundaries.push('跨越 400mm 等降水量线，进入干旱地区');
  }
  
  // 海拔2000m线
  if ((stationA.climate.altitude > 2000 && stationB.climate.altitude < 2000) ||
      (stationA.climate.altitude < 2000 && stationB.climate.altitude > 2000)) {
    boundaries.push('跨越 2000m 海拔线，高原民居特征显现');
  }
  
  // 防御等级显著变化
  if (Math.abs(stationA.climate.defense - stationB.climate.defense) >= 5) {
    boundaries.push('社会环境剧变，防御形态将发生显著变化');
  }

  return boundaries;
}
