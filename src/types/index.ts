export interface ClimateData {
    rainfall: number;
    humidity: number;
    temperature: number;
    altitude: number;
    sunlight: number;
    defense: number;
}
export interface Station {
    id: string;
    name: string;
    nameEn: string;
    position: [
        number,
        number,
        number
    ];
    coordinates: [
        number,
        number
    ];
    climate: ClimateData;
    buildingGene: string;
    description: string;
    region: string;
    modelPath: string;
}
export interface CollectionItem {
    id: string;
    name: string;
    category: string;
    description: string;
    attributes: {
        privacy: number;
        fengshui: number;
        cost: number;
        aesthetic: number;
    };
    collected: boolean;
    modelPath?: string;
}
export interface NarrationSegment {
    progressStart: number;
    progressEnd: number;
    text: string;
    highlight?: string;
}
export type AppPhase = "landing" | "map" | "transition" | "roaming" | "detail" | "craftsmanship" | "memory-game" | "folk-music" | "homology";
export type ViewMode = "tourist" | "god";
