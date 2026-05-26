import { stations } from '@/data/stations';
import { climateDetails } from '@/data/climateDetails';
import { stationDetails } from '@/data/stationDetails';
import { heritageData } from '@/data/heritageData';
import { decorationData } from '@/data/decorationData';
import { buildHeritageDashboardData } from '@/data/heritageDashboard';
export function getBigscreenPayload(stationId: string) {
    const station = stations.find((item) => item.id === stationId);
    const climate = climateDetails[stationId];
    const detail = stationDetails[stationId];
    if (!station || !climate || !detail) {
        return null;
    }
    return {
        station,
        climate,
        detail,
        heritage: heritageData[stationId] || [],
        decorations: decorationData[stationId] || [],
        dashboard: buildHeritageDashboardData({
            station,
            climate,
            detail,
            heritage: heritageData[stationId] || [],
            decorations: decorationData[stationId] || [],
        }),
    };
}
