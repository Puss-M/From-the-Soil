'use client';
import { use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
function getScreenSrc(stationId: string) {
    if (stationId === 'beijing') {
        return '/beijing-dashboard/index.html';
    }
    return `/folk-dashboard/index.html?stationId=${stationId}`;
}
export default function ScreenPage({ params, }: {
    params: Promise<{
        stationId: string;
    }>;
}) {
    const router = useRouter();
    const { stationId } = use(params);
    const src = useMemo(() => getScreenSrc(stationId), [stationId]);
    const backgroundImage = stationId === 'beijing'
        ? '/beijing-dashboard/images/bg.jpg'
        : '/beijing-dashboard/images/bg.jpg';
    return (<div style={{
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            background: `url('${backgroundImage}') center/cover no-repeat`,
            position: 'relative',
        }}>
      <button type="button" onClick={() => router.back()} style={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 10,
            border: '1px solid rgba(255,255,255,0.55)',
            background: 'rgba(69, 45, 20, 0.16)',
            color: '#fff7e8',
            borderRadius: 999,
            padding: '6px 14px',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
            letterSpacing: 1,
        }}>
        返回
      </button>
      <iframe src={src} title={`${stationId} 风物志大屏`} style={{
            width: '100vw',
            height: '100vh',
            border: 'none',
            display: 'block',
            background: 'transparent',
        }}/>
    </div>);
}
