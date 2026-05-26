'use client';
import { create } from 'zustand';
import { ClimateData, Station, CollectionItem, AppPhase, ViewMode, } from '@/types';
interface AppState {
    phase: AppPhase;
    setPhase: (phase: AppPhase) => void;
    selectedStation: Station | null;
    setSelectedStation: (station: Station | null) => void;
    startStation: Station | null;
    endStation: Station | null;
    setRoute: (start: Station, end: Station) => void;
    transitionProgress: number;
    setTransitionProgress: (progress: number) => void;
    currentClimate: ClimateData;
    updateClimateFromProgress: () => void;
    directControl: boolean;
    setDirectControl: (enabled: boolean) => void;
    setClimateParam: <K extends keyof ClimateData>(key: K, value: ClimateData[K]) => void;
    collectedItems: CollectionItem[];
    setCollectedItems: (items: CollectionItem[]) => void;
    initializeCollectionItems: (items: CollectionItem[]) => void;
    collectItem: (itemId: string) => void;
    viewMode: ViewMode;
    toggleViewMode: () => void;
}
const defaultClimate: ClimateData = {
    rainfall: 1200,
    humidity: 80,
    temperature: 18,
    altitude: 50,
    sunlight: 0.6,
    defense: 2,
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const useStore = create<AppState>((set, get) => ({
    phase: 'landing',
    setPhase: (phase) => set({ phase }),
    selectedStation: null,
    setSelectedStation: (station) => set({ selectedStation: station }),
    startStation: null,
    endStation: null,
    setRoute: (start, end) => set({ startStation: start, endStation: end }),
    transitionProgress: 0,
    setTransitionProgress: (progress) => {
        set({ transitionProgress: progress });
        get().updateClimateFromProgress();
    },
    currentClimate: { ...defaultClimate },
    updateClimateFromProgress: () => {
        const { startStation, endStation, transitionProgress, directControl } = get();
        if (directControl)
            return;
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
    directControl: true,
    setDirectControl: (enabled) => set({ directControl: enabled }),
    setClimateParam: (key, value) => {
        set((state) => ({
            currentClimate: { ...state.currentClimate, [key]: value },
        }));
    },
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
            collectedItems: state.collectedItems.map((item) => item.id === itemId ? { ...item, collected: true } : item),
        }));
    },
    viewMode: 'god',
    toggleViewMode: () => {
        set((state) => ({
            viewMode: state.viewMode === 'tourist' ? 'god' : 'tourist',
        }));
    },
}));
