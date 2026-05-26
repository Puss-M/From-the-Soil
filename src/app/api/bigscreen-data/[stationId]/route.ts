import { NextResponse } from 'next/server';
import { getBigscreenPayload } from '@/app/bigscreen/data';
export async function GET(_request: Request, { params }: {
    params: Promise<{
        stationId: string;
    }>;
}) {
    const { stationId } = await params;
    const payload = getBigscreenPayload(stationId);
    if (!payload) {
        return NextResponse.json({ message: 'station not found' }, { status: 404 });
    }
    return NextResponse.json(payload.dashboard);
}
