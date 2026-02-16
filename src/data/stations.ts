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
    modelPath: '/models/苏式民居1.glb',
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
    modelPath: '/models/徽派民居1.glb',
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
    modelPath: '/models/土楼.glb',
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
    modelPath: '/models/窑洞.glb',
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
    modelPath: '/models/窑洞.glb',
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
    modelPath: '/models/土掌房.glb',
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
    modelPath: '/models/碉房.glb',
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
    modelPath: '/models/高台民居.glb',
  },
  // 北京
  {
    id: 'beijing',
    name: '北京驿',
    nameEn: 'Beijing',
    position: [1, 0.5, 4],
    climate: {
      rainfall: 600,
      humidity: 55,
      temperature: 12,
      altitude: 50,
      sunlight: 0.65,
      defense: 6,
    },
    buildingGene: '四合院',
    description: '正房坐北朝南，四面合围',
    region: '京畿',
    modelPath: '/models/北京四合院.glb',
  },
  // 湘西吊脚楼
  {
    id: 'fenghuang',
    name: '凤凰驿',
    nameEn: 'Fenghuang',
    position: [-1, 0.6, 1],
    climate: {
      rainfall: 1400,
      humidity: 80,
      temperature: 17,
      altitude: 300,
      sunlight: 0.5,
      defense: 2,
    },
    buildingGene: '吊脚楼',
    description: '依山傍水，半干栏式建筑',
    region: '湘西',
    modelPath: '/models/吊脚楼.glb',
  },
  // 胶东海草房
  {
    id: 'weihai',
    name: '威海驿',
    nameEn: 'Weihai',
    position: [0, 0.3, 5],
    climate: {
      rainfall: 700,
      humidity: 70,
      temperature: 12,
      altitude: 20,
      sunlight: 0.6,
      defense: 3,
    },
    buildingGene: '海草房',
    description: '海草苫顶，石砌墙身',
    region: '胶东',
    modelPath: '/models/海草房.glb',
  },
  // 云南竹楼
  {
    id: 'xishuangbanna',
    name: '版纳驿',
    nameEn: 'Xishuangbanna',
    position: [-1, 1.5, -4],
    climate: {
      rainfall: 1600,
      humidity: 88,
      temperature: 22,
      altitude: 600,
      sunlight: 0.55,
      defense: 1,
    },
    buildingGene: '竹楼',
    description: '傣族干栏式竹楼，通风隔潮',
    region: '滇南',
    modelPath: '/models/竹楼.glb',
  },
  // 内蒙古蒙古包
  {
    id: 'xilingol',
    name: '草原驿',
    nameEn: 'Xilingol',
    position: [3, 1.0, 5],
    climate: {
      rainfall: 300,
      humidity: 40,
      temperature: 2,
      altitude: 1000,
      sunlight: 0.8,
      defense: 1,
    },
    buildingGene: '蒙古包',
    description: '毡帐穹庐，逐水草而居',
    region: '蒙古',
    modelPath: '/models/蒙古包.glb',
  },
  // 岭南镬耳屋
  {
    id: 'guangzhou',
    name: '广州驿',
    nameEn: 'Guangzhou',
    position: [-3, 0.3, -3],
    climate: {
      rainfall: 1800,
      humidity: 82,
      temperature: 22,
      altitude: 10,
      sunlight: 0.55,
      defense: 3,
    },
    buildingGene: '镬耳屋',
    description: '镬耳山墙，岭南特色',
    region: '岭南',
    modelPath: '/models/镬耳屋.glb',
  },
  // 吐鲁番阿以旺
  {
    id: 'turpan',
    name: '吐鲁番驿',
    nameEn: 'Turpan',
    position: [5, 0.8, 0],
    climate: {
      rainfall: 50,
      humidity: 25,
      temperature: 14,
      altitude: -50,
      sunlight: 0.95,
      defense: 4,
    },
    buildingGene: '阿以旺',
    description: '土坯平顶，内设天窗通风',
    region: '东疆',
    modelPath: '/models/阿以旺.glb',
  },
  // 古驿站（通用驿站建筑）
  {
    id: 'yizhan',
    name: '古驿站',
    nameEn: 'Ancient Post',
    position: [1, 1.0, 0],
    climate: {
      rainfall: 500,
      humidity: 50,
      temperature: 12,
      altitude: 500,
      sunlight: 0.7,
      defense: 5,
    },
    buildingGene: '驿站',
    description: '官道驿亭，传书递檄',
    region: '中原',
    modelPath: '/models/驿站.glb',
  },
  // 杭州（苏式民居2）
  {
    id: 'hangzhou',
    name: '杭州驿',
    nameEn: 'Hangzhou',
    position: [-5, 0.3, 3],
    climate: {
      rainfall: 1400,
      humidity: 78,
      temperature: 17,
      altitude: 10,
      sunlight: 0.55,
      defense: 1,
    },
    buildingGene: '抬梁式',
    description: '西湖风韵，园林雅居',
    region: '江南',
    modelPath: '/models/苏式民居2.glb',
  },
  // 婺源（徽派民居2）
  {
    id: 'wuyuan',
    name: '婺源驿',
    nameEn: 'Wuyuan',
    position: [-2, 0.9, 0],
    climate: {
      rainfall: 1600,
      humidity: 80,
      temperature: 16,
      altitude: 250,
      sunlight: 0.5,
      defense: 3,
    },
    buildingGene: '砖雕马头墙',
    description: '油菜花田，白墙黛阁',
    region: '赣北',
    modelPath: '/models/徽派民居2.glb',
  },
  // 无锡（苏式民居3）
  {
    id: 'wuxi',
    name: '无锡驿',
    nameEn: 'Wuxi',
    position: [-4, 0.3, 5],
    climate: {
      rainfall: 1100,
      humidity: 80,
      temperature: 16,
      altitude: 8,
      sunlight: 0.55,
      defense: 1,
    },
    buildingGene: '抬梁式',
    description: '太湖之滨，水乡人家',
    region: '江南',
    modelPath: '/models/苏式民居3.glb',
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
