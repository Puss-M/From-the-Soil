'use client';

import { useStore } from '@/store/useStore';
import { stationDetails } from '@/data/stationDetails';
import { climateDetails } from '@/data/climateDetails';
import { heritageData } from '@/data/heritageData';
import { decorationData } from '@/data/decorationData';
import { StationHeader } from './StationHeader';
import { InfoCards } from './InfoCards';
import { ClimateCharts } from './ClimateCharts';
import { DecorationPanel } from './DecorationPanel';
import { useRef } from 'react';

export function StationDetail() {
  const { selectedStation, setPhase } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!selectedStation) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p>未选择驿站</p>
      </div>
    );
  }

  const sid = selectedStation.id;
  const detail = stationDetails[sid];
  const climate = climateDetails[sid];
  const heritage = heritageData[sid];
  const decorations = decorationData[sid];

  return (
    <div
      ref={scrollRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0eb 30%, #f0ece6 100%)',
      }}
    >
      {/* 固定返回按钮 */}
      <button
        onClick={() => setPhase('map')}
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 20px',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #e8e0d8',
          borderRadius: 12,
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600,
          color: '#5c4a3a',
          transition: 'all 0.2s',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
          e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
        }}
      >
        ← 返回地图
      </button>

      {/* 内容区 */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px 80px' }}>
        {/* 头部信息 */}
        <StationHeader station={selectedStation} heritage={heritage} climate={climate} />

        {/* 建筑基因信息卡片 */}
        {detail && <InfoCards detail={detail} stationName={selectedStation.name} />}

        {/* 气候数据图表 */}
        {climate && <ClimateCharts climate={climate} stationName={selectedStation.name} />}

        {/* 装饰数据 */}
        {decorations && decorations.length > 0 && (
          <DecorationPanel decorations={decorations} stationName={selectedStation.name} />
        )}
      </div>
    </div>
  );
}
