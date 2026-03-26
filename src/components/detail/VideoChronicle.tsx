'use client';

import { useEffect, useRef, useState } from 'react';
import type { Station } from '@/types';
import type { WorldClimData } from '@/data/climateDetails';
import type { StationDetailData } from '@/data/stationDetails';
import type { HeritageInfo } from '@/data/heritageData';
import type { DecorationItem } from '@/data/decorationData';

interface Props {
  station: Station;
  climate?: WorldClimData;
  detail?: StationDetailData;
  heritage: HeritageInfo[];
  decorations: DecorationItem[];
}

export function VideoChronicle({ station }: Props) {
  const isBeijingSiheyuan = station.id === 'beijing';
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [frameScale, setFrameScale] = useState(1);

  useEffect(() => {
    if (!isBeijingSiheyuan) {
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
  }, [isBeijingSiheyuan]);

  if (isBeijingSiheyuan) {
    return (
      <div
        ref={frameRef}
        style={{
          position: 'relative',
          height: '100%',
          minHeight: 0,
          borderRadius: 20,
          overflow: 'hidden',
          border: '1px solid rgba(196,168,130,0.28)',
          background: '#06132b',
          boxShadow: '0 18px 40px rgba(91, 71, 47, 0.12)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 1920,
            height: 1080,
            transform: `translate(-50%, -50%) scale(${frameScale})`,
            transformOrigin: 'center center',
          }}
        >
          <iframe
            src="/legacy/siheyuan-dashboard/index.html"
            title="北京四合院影像志数据大屏"
            scrolling="no"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        minHeight: 0,
        color: '#443621',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at top, rgba(244, 251, 255, 0.76), transparent 24%), linear-gradient(180deg, rgba(234, 244, 246, 0.96) 0%, rgba(223, 236, 230, 0.96) 46%, rgba(202, 224, 214, 0.96) 100%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 12, color: '#2e90b7', letterSpacing: 6, marginBottom: 8 }}>VIDEO CHRONICLE</div>
          <h2 style={{ margin: 0, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#1e7e96', fontWeight: 800 }}>
            {station.name.replace(/驿$/, '')} · 影像志
          </h2>
          <div style={{ marginTop: 8, color: '#5a7d78', fontSize: 13, letterSpacing: 2 }}>
            当前仅北京四合院接入 4C 原始大屏
          </div>
        </div>

        <div
          style={{
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
          }}
        >
          该民居的影像志大屏尚未单独制作。
        </div>
      </div>
    </div>
  );
}
