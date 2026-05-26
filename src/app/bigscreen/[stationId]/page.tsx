import { BigscreenView } from '../BigscreenView';
export default async function BigscreenStationPage({ params, }: {
    params: Promise<{
        stationId: string;
    }>;
}) {
    const { stationId } = await params;
    return <BigscreenView stationId={stationId}/>;
}
