'use client';

import { create } from 'zustand';

import { ClimateData, Station, CollectionItem, AppPhase, ViewMode } from '@/types';

// 应用状态类型
interface AppState {
  // 当前阶段
  phase: AppPhase;
  setPhase: (phase: AppPhase) => void;

  // 路线数据
  startStation: Station | null;
  endStation: Station | null;
  setRoute: (start: Station, end: Station) => void;

  // 过场进度 (0-1)
  transitionProgress: number;
  setTransitionProgress: (progress: number) => void;

  // 当前气候参数 (插值计算后的值)
  currentClimate: ClimateData;
  updateClimateFromProgress: () => void;

  // 直接控制模式 (Demo用)
  directControl: boolean;
  setDirectControl: (enabled: boolean) => void;
  setClimateParam: <K extends keyof ClimateData>(key: K, value: ClimateData[K]) => void;

  // 图谱收集
  collectedItems: CollectionItem[];
  setCollectedItems: (items: CollectionItem[]) => void;
  initializeCollectionItems: (items: CollectionItem[]) => void;
  collectItem: (itemId: string) => void;

  // 视角模式
  viewMode: ViewMode;
  toggleViewMode: () => void;
}

// 默认气候数据（江南水乡）
const defaultClimate: ClimateData = {
  rainfall: 1200,
  humidity: 80,
  temperature: 18,
  altitude: 50,
  sunlight: 0.6,
  defense: 2,
};

// 线性插值函数
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// 创建 Zustand Store
export const useStore = create<AppState>((set, get) => ({
  // 阶段
  phase: 'landing', // 默认从引导页开始
  setPhase: (phase) => set({ phase }),

  // 路线
  startStation: null,
  endStation: null,
  setRoute: (start, end) => set({ startStation: start, endStation: end }),

  // 进度
  transitionProgress: 0,
  setTransitionProgress: (progress) => {
    set({ transitionProgress: progress });
    get().updateClimateFromProgress();
  },

  // 气候
  currentClimate: { ...defaultClimate },
  updateClimateFromProgress: () => {
    const { startStation, endStation, transitionProgress, directControl } = get();
    
    // 如果是直接控制模式，不更新
    if (directControl) return;
    
    if (startStation && endStation) {
      const t = transitionProgress;
      set({
        currentClimate: {
          rainfall: lerp(startStation.climate.rainfall, endStation.climate.rainfall, t),
          humidity: lerp(startStation.climate.humidity, endStation.climate.humidity, t),
          temperature: lerp(startStation.climate.temperature, endStation.climate.temperature, t),
          altitude: lerp(startStation.climate.altitude, endStation.climate.altitude, t),
          sunlight: lerp(startStation.climate.sunlight, endStation.climate.sunlight, t),
          defense: lerp(startStation.climate.defense, endStation.climate.defense, t),
        },
      });
    }
  },

  // 直接控制
  directControl: true, // Demo 默认开启直接控制
  setDirectControl: (enabled) => set({ directControl: enabled }),
  setClimateParam: (key, value) => {
    set((state) => ({
      currentClimate: { ...state.currentClimate, [key]: value },
    }));
  },

  // 收集
  collectedItems: [],
  setCollectedItems: (items) => set({ collectedItems: items }),
  initializeCollectionItems: (items) => {
    const { collectedItems } = get();
    if (collectedItems.length === 0) {
      set({ collectedItems: items });
    }
  },
  collectItem: (itemId) => {
    set((state) => ({
      collectedItems: state.collectedItems.map((item) =>
        item.id === itemId ? { ...item, collected: true } : item
      ),
    }));
  },

  // 视角
  viewMode: 'god',
  toggleViewMode: () => {
    set((state) => ({
      viewMode: state.viewMode === 'tourist' ? 'god' : 'tourist',
    }));
  },
}));
