'use client';
import { useEffect, useRef, useState } from 'react';
import type { Station } from '@/types';
interface Props {
    station: Station;
}
const stationIdToFolderMap: Record<string, string> = {
    'beijing': '北京驿',
    'huizhou': '徽州驿',
    'suzhou': '苏州驿',
    'fenghuang': '凤凰驿',
    'lhasa': '拉萨驿',
    'weihai': '威海驿',
    'kashgar': '喀什驿',
    'turpan': '吐鲁番驿',
    'guangzhou': '广州驿',
    'xishuangbanna': '版纳驿',
    'fujian': '永定驿',
    'xilingol': '草原驿',
    'dali': '大理驿',
    'yanan': '延安驿',
};
export function HeritageDashboard({ station }: Props) {
    const frameRef = useRef<HTMLDivElement | null>(null);
    const [frameScale, setFrameScale] = useState(1);
    const folderName = stationIdToFolderMap[station.id];
    const hasHeritageDashboard = folderName !== undefined;
    useEffect(() => {
        if (!hasHeritageDashboard) {
            return;
        }
        const frame = frameRef.current;
        if (!frame) {
            return;
        }
        const BASE_WIDTH = 1920;
        const BASE_HEIGHT = 1080;
        const updateScale = () => {
            const { width, height } = frame.getBoundingClientRect();
            if (!width || !height) {
                return;
            }
            setFrameScale(Math.min(width / BASE_WIDTH, height / BASE_HEIGHT));
        };
        updateScale();
        const observer = new ResizeObserver(updateScale);
        observer.observe(frame);
        window.addEventListener('resize', updateScale);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updateScale);
        };
    }, [hasHeritageDashboard]);
    if (hasHeritageDashboard) {
        const heritageSrc = `/fengwuzhi/${folderName}/index.html?embedded=1`;
        return (<div ref={frameRef} style={{
                position: 'relative',
                height: '100%',
                minHeight: 0,
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid rgba(196,168,130,0.28)',
                background: '#2c2416',
                boxShadow: '0 18px 40px rgba(91, 71, 47, 0.12)',
            }}>
        <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 1920,
                height: 1080,
                transform: `translate(-50%, -50%) scale(${frameScale})`,
                transformOrigin: 'center center',
            }}>
          <iframe src={heritageSrc} title={`${station.name}风物志数据大屏`} scrolling="no" style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block',
            }}/>
        </div>
      </div>);
    }
    return (<div style={{
            position: 'relative',
            height: '100%',
            minHeight: 0,
            color: '#443621',
            overflow: 'hidden',
        }}>
      <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at top, rgba(244, 251, 255, 0.76), transparent 24%), linear-gradient(180deg, rgba(234, 244, 246, 0.96) 0%, rgba(223, 236, 230, 0.96) 46%, rgba(202, 224, 214, 0.96) 100%)',
        }}/>

      <div style={{ position: 'relative', zIndex: 1, height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 12, color: '#2e90b7', letterSpacing: 6, marginBottom: 8 }}>HERITAGE DASHBOARD</div>
          <h2 style={{ margin: 0, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#1e7e96', fontWeight: 800 }}>
            {station.name.replace(/驿$/, '')} · 风物志
          </h2>
          <div style={{ marginTop: 8, color: '#5a7d78', fontSize: 13, letterSpacing: 2 }}>
            风物志大屏正在开发中
          </div>
        </div>

        <div style={{
            flex: 1,
            minHeight: 0,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(255,255,255,0.56)',
            border: '1px solid rgba(72, 193, 202, 0.28)',
            borderRadius: 20,
            color: '#5a7d78',
            fontSize: 16,
            textAlign: 'center',
            padding: 32,
        }}>
          该民居的风物志大屏尚未单独制作。
        </div>
      </div>
    </div>);
}
