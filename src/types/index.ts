// 类型定义

// 气候数据
export interface ClimateData {
  rainfall: number; // 降雨量 (mm)
  humidity: number; // 湿度 (%)
  temperature: number; // 温度 (°C)
  altitude: number; // 海拔 (m)
  sunlight: number; // 日照系数 (0-1)
  defense: number; // 防御等级 (0-10)
}

// 驿站节点
export interface Station {
  id: string;
  name: string; // 中文名 "苏州驿"
  nameEn: string; // 英文名 "Suzhou"
  position: [number, number, number]; // 3D 坐标
  coordinates: [number, number]; // 真实经纬度 [经度, 纬度]
  climate: ClimateData;
  buildingGene: string; // 建筑基因 "抬梁式"
  description: string; // 描述
  region: string; // 地区
  modelPath: string; // GLB 模型路径，如 "/models/suzhou.glb"
}

// 收集品
export interface CollectionItem {
  id: string;
  name: string; // "影壁"
  category: string; // "装饰构件"
  description: string;
  attributes: {
    privacy: number; // 隐私保护等级 (0-10)
    fengshui: number; // 风水功能 (0-10)
    cost: number; // 造价成本 (0-10)
    aesthetic: number; // 美学价值 (0-10)
  };
  collected: boolean;
  modelPath?: string;
}

// 旅程旁白
export interface NarrationSegment {
  progressStart: number; // 0-1
  progressEnd: number;
  text: string;
  highlight?: string; // 关键词高亮
}

// 应用阶段
export type AppPhase = "landing" | "map" | "transition" | "roaming";

// 视角模式
export type ViewMode = "tourist" | "god";
