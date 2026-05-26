import { Station } from '@/types';
export const stations: Station[] = [
    {
        id: 'suzhou',
        name: '苏州驿',
        nameEn: 'Suzhou',
        position: [-4, 0.3, 4],
        coordinates: [120.62, 31.30],
        climate: {
            rainfall: 1200,
            humidity: 82,
            temperature: 16,
            altitude: 5,
            sunlight: 0.55,
            defense: 1,
        },
        buildingGene: '苏州民居',
        description: '四水归堂，天井院落',
        region: '江南',
        modelPath: '/models/苏式民居1.glb',
    },
    {
        id: 'huizhou',
        name: '徽州驿',
        nameEn: 'Huizhou',
        position: [-2, 0.8, 2],
        coordinates: [118.33, 29.86],
        climate: {
            rainfall: 1500,
            humidity: 78,
            temperature: 15,
            altitude: 200,
            sunlight: 0.5,
            defense: 3,
        },
        buildingGene: '徽派民居',
        description: '粉墙黛瓦，马头墙',
        region: '皖南',
        modelPath: '/models/徽派民居1.glb',
    },
    {
        id: 'fujian',
        name: '永定驿',
        nameEn: 'Yongding',
        position: [-3, 0.5, -1],
        coordinates: [116.73, 24.73],
        climate: {
            rainfall: 1800,
            humidity: 85,
            temperature: 20,
            altitude: 300,
            sunlight: 0.6,
            defense: 9,
        },
        buildingGene: '客家土楼',
        description: '防御工事，聚族而居',
        region: '闽西',
        modelPath: '/models/土楼.glb',
    },
    {
        id: 'yanan',
        name: '延安驿',
        nameEn: "Yan'an",
        position: [4, 1.5, 1],
        coordinates: [109.49, 36.59],
        climate: {
            rainfall: 350,
            humidity: 45,
            temperature: 9,
            altitude: 1000,
            sunlight: 0.8,
            defense: 4,
        },
        buildingGene: '窑洞',
        description: '依山而凿，冬暖夏凉',
        region: '陕北',
        modelPath: '/models/窑洞.glb',
    },
    {
        id: 'dali',
        name: '大理驿',
        nameEn: 'Dali',
        position: [0, 2, -3],
        coordinates: [100.23, 25.59],
        climate: {
            rainfall: 1000,
            humidity: 70,
            temperature: 15,
            altitude: 2000,
            sunlight: 0.7,
            defense: 2,
        },
        buildingGene: '云南彝族土掌房',
        description: '白族民居，照壁迎客',
        region: '滇西',
        modelPath: '/models/土掌房.glb',
    },
    {
        id: 'lhasa',
        name: '拉萨驿',
        nameEn: 'Lhasa',
        position: [2, 2.5, -4],
        coordinates: [91.17, 29.65],
        climate: {
            rainfall: 200,
            humidity: 35,
            temperature: 8,
            altitude: 3650,
            sunlight: 0.9,
            defense: 6,
        },
        buildingGene: '藏族碉房',
        description: '石砌碉房，抵御严寒',
        region: '藏区',
        modelPath: '/models/碉房.glb',
    },
    {
        id: 'kashgar',
        name: '喀什驿',
        nameEn: 'Kashgar',
        position: [5, 1.8, -2],
        coordinates: [75.99, 39.47],
        climate: {
            rainfall: 100,
            humidity: 30,
            temperature: 12,
            altitude: 1200,
            sunlight: 0.85,
            defense: 7,
        },
        buildingGene: '高台民居',
        description: '平顶厚墙，中庭天井',
        region: '南疆',
        modelPath: '/models/高台民居.glb',
    },
    {
        id: 'beijing',
        name: '北京驿',
        nameEn: 'Beijing',
        position: [1, 0.5, 4],
        coordinates: [116.40, 39.90],
        climate: {
            rainfall: 600,
            humidity: 55,
            temperature: 12,
            altitude: 50,
            sunlight: 0.65,
            defense: 6,
        },
        buildingGene: '北京四合院',
        description: '正房坐北朝南，四面合围',
        region: '京畿',
        modelPath: '/models/北京四合院.glb',
    },
    {
        id: 'fenghuang',
        name: '凤凰驿',
        nameEn: 'Fenghuang',
        position: [-1, 0.6, 1],
        coordinates: [109.60, 27.95],
        climate: {
            rainfall: 1400,
            humidity: 80,
            temperature: 17,
            altitude: 300,
            sunlight: 0.5,
            defense: 2,
        },
        buildingGene: '湘西吊脚楼',
        description: '依山傍水，半干栏式建筑',
        region: '湘西',
        modelPath: '/models/吊脚楼.glb',
    },
    {
        id: 'weihai',
        name: '威海驿',
        nameEn: 'Weihai',
        position: [0, 0.3, 5],
        coordinates: [122.12, 37.50],
        climate: {
            rainfall: 700,
            humidity: 70,
            temperature: 12,
            altitude: 20,
            sunlight: 0.6,
            defense: 3,
        },
        buildingGene: '山东海草房',
        description: '海草苫顶，石砌墙身',
        region: '胶东',
        modelPath: '/models/海草房.glb',
    },
    {
        id: 'xishuangbanna',
        name: '版纳驿',
        nameEn: 'Xishuangbanna',
        position: [-1, 1.5, -4],
        coordinates: [100.80, 22.00],
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
    {
        id: 'xilingol',
        name: '草原驿',
        nameEn: 'Xilingol',
        position: [3, 1.0, 5],
        coordinates: [116.07, 43.94],
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
    {
        id: 'guangzhou',
        name: '广州驿',
        nameEn: 'Guangzhou',
        position: [-3, 0.3, -3],
        coordinates: [113.26, 23.13],
        climate: {
            rainfall: 1800,
            humidity: 82,
            temperature: 22,
            altitude: 10,
            sunlight: 0.55,
            defense: 3,
        },
        buildingGene: '广东镬耳屋',
        description: '镬耳山墙，岭南特色',
        region: '岭南',
        modelPath: '/models/镬耳屋.glb',
    },
    {
        id: 'turpan',
        name: '和田驿',
        nameEn: 'Hotan',
        position: [5, 0.8, 0],
        coordinates: [79.93, 37.11],
        climate: {
            rainfall: 50,
            humidity: 25,
            temperature: 14,
            altitude: -50,
            sunlight: 0.95,
            defense: 4,
        },
        buildingGene: '新疆阿以旺',
        description: '土坯平顶，内设天窗通风',
        region: '南疆',
        modelPath: '/models/阿以旺.glb',
    },
];
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
export function getCrossedClimateBoundaries(stationA: Station, stationB: Station): string[] {
    const boundaries: string[] = [];
    if ((stationA.climate.rainfall > 800 && stationB.climate.rainfall < 800) ||
        (stationA.climate.rainfall < 800 && stationB.climate.rainfall > 800)) {
        boundaries.push('跨越 800mm 等降水量线，建筑形态将由坡顶向平顶演变');
    }
    if ((stationA.climate.rainfall > 400 && stationB.climate.rainfall < 400) ||
        (stationA.climate.rainfall < 400 && stationB.climate.rainfall > 400)) {
        boundaries.push('跨越 400mm 等降水量线，进入干旱地区');
    }
    if ((stationA.climate.altitude > 2000 && stationB.climate.altitude < 2000) ||
        (stationA.climate.altitude < 2000 && stationB.climate.altitude > 2000)) {
        boundaries.push('跨越 2000m 海拔线，高原民居特征显现');
    }
    if (Math.abs(stationA.climate.defense - stationB.climate.defense) >= 5) {
        boundaries.push('社会环境剧变，防御形态将发生显著变化');
    }
    return boundaries;
}
