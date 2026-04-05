'use client';

import React, { useMemo, useState } from 'react';
import { stations } from '@/data/stations';
import { useStore } from '@/store/useStore';

const MAP_REVIEW_LABEL = '标准地图审图号：GS(2016)2888号';
const MAP_IMAGE_PATH = '/china-standard-map-v2-transparent.png';

// These bounds align station points to the visible mainland frame of the
// approved standard map image while preserving the original audit label.
const STATION_ANCHORS: Record<
  string,
  {
    left: string;
    top: string;
    labelDx?: number;
    labelDy?: number;
  }
> = {
  kashgar: { left: '13.4%', top: '36.8%', labelDx: -8, labelDy: 12 },
  turpan: { left: '20.4%', top: '40.8%', labelDx: 0, labelDy: 12 },
  lhasa: { left: '37.5%', top: '56.3%', labelDx: -6, labelDy: 12 },
  dali: { left: '50.8%', top: '64.8%', labelDx: -6, labelDy: 12 },
  xishuangbanna: { left: '52.0%', top: '74.0%', labelDx: 0, labelDy: 12 },
  yanan: { left: '56.0%', top: '42.3%', labelDx: -6, labelDy: 12 },
  xilingol: { left: '66.7%', top: '24.6%', labelDx: 0, labelDy: 12 },
  beijing: { left: '66.2%', top: '35.1%', labelDx: 0, labelDy: 12 },
  weihai: { left: '76.4%', top: '40.2%', labelDx: 10, labelDy: 10 },
  huizhou: { left: '64.9%', top: '60.1%', labelDx: 10, labelDy: 10 },
  suzhou: { left: '69.9%', top: '57.0%', labelDx: 10, labelDy: 10 },
  fenghuang: { left: '56.4%', top: '62.8%', labelDx: 0, labelDy: 12 },
  guangzhou: { left: '61.6%', top: '73.8%', labelDx: 10, labelDy: 10 },
  fujian: { left: '67.4%', top: '68.3%', labelDx: 10, labelDy: 10 },
};

type ProjectedStation = {
  id: string;
  name: string;
  region: string;
  buildingGene: string;
  description: string;
  left: string;
  top: string;
  labelDx: number;
  labelDy: number;
};

export function MapScene() {
  const { setPhase, setSelectedStation } = useStore();
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

  const hoveredData = useMemo(() => {
    if (!hoveredStation) return null;
    return stations.find((s) => s.id === hoveredStation) || null;
  }, [hoveredStation]);

  const projectedStations = useMemo<ProjectedStation[]>(() => {
    return stations.map((station) => ({
      ...(STATION_ANCHORS[station.id] || { left: '50%', top: '50%', labelDx: 0, labelDy: 12 }),
      id: station.id,
      name: station.name,
      region: station.region,
      buildingGene: station.buildingGene,
      description: station.description,
    }));
  }, []);

  function getRegionColor(region: string): string {
    const colors: Record<string, string> = {
      江南: '#5b8d86',
      皖南: '#7f6f52',
      闽西: '#8b4a3a',
      晋中: '#9b7442',
      陕北: '#8b6846',
      滇西: '#5f7f6a',
      藏区: '#6d6376',
      南疆: '#98624f',
      京畿: '#8a6a4d',
      湘西: '#6a8465',
      胶东: '#6b7f8c',
      滇南: '#638974',
      蒙古: '#76806a',
      岭南: '#9a6d5f',
      东疆: '#b88a3b',
      中原: '#7e6b59',
      赣北: '#766355',
    };
    return colors[region] || '#8b6846';
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        backgroundImage: 'url(/fengmian/di3.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '84px 28px 76px',
        }}
      >
        <div
          style={{
            position: 'relative',
            height: 'min(78vh, 920px)',
            aspectRatio: '1936 / 2375',
            filter: 'drop-shadow(0 10px 24px rgba(58, 42, 26, 0.14))',
          }}
        >
          <img
            src={MAP_IMAGE_PATH}
            alt={MAP_REVIEW_LABEL}
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              userSelect: 'none',
              pointerEvents: 'none',
              opacity: 1,
            }}
          />

          {projectedStations.map((station) => (
            <button
              key={station.id}
              type="button"
              aria-label={`查看${station.name}详情`}
              onClick={() => {
                const selected = stations.find((item) => item.id === station.id);
                if (!selected) return;
                setSelectedStation(selected);
                setPhase('detail');
              }}
              onMouseEnter={() => setHoveredStation(station.id)}
              onMouseLeave={() => setHoveredStation((current) => (current === station.id ? null : current))}
              style={{
                position: 'absolute',
                left: station.left,
                top: station.top,
                transform: 'translate(-50%, -50%)',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: 0,
                zIndex: hoveredStation === station.id ? 3 : 2,
              }}
            >
              <span
                style={{
                  display: 'block',
                  width: hoveredStation === station.id ? 16 : 13,
                  height: hoveredStation === station.id ? 16 : 13,
                  borderRadius: '999px',
                  background: '#8c221c',
                  border: '2px solid rgba(255,255,255,0.95)',
                  boxShadow:
                    hoveredStation === station.id
                      ? '0 0 0 6px rgba(140,34,28,0.14), 0 0 18px rgba(140,34,28,0.35)'
                      : '0 0 0 4px rgba(140,34,28,0.08)',
                  transition: 'all 0.2s ease',
                }}
              />
              <span
                style={{
                  display: 'block',
                  position: 'absolute',
                  left: station.labelDx,
                  top: station.labelDy,
                  color: '#4b3a2c',
                  fontSize: 12,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  textShadow: '0 1px 0 rgba(255,255,255,0.9)',
                }}
              >
                {station.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        className="guofeng-glass-strong"
        style={{ position: 'fixed', top: 20, left: 22, zIndex: 20, padding: '10px 14px' }}
      >
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#3a2a1a',
            letterSpacing: '0.12em',
            marginBottom: 3,
            fontFamily:
              '"演示秋鸿楷", "YanShi QiuHongKai", var(--font-serif), "Noto Serif SC", SimSun, STSong, serif',
          }}
        >
          山河筑语
        </h1>
        <p style={{ fontSize: '0.74rem', color: '#8b6846', fontWeight: 500 }}>
          从土而生 · 建筑方言 · Architectural Dialects
        </p>
      </div>

      <div style={{ position: 'fixed', bottom: 20, right: 24, zIndex: 20 }}>
        <div className="guofeng-glass-strong" style={{ padding: '6px 14px' }}>
          <span style={{ fontSize: 11, color: '#8a7d73' }}>共 {stations.length} 个驿站 · 点击探索详情</span>
        </div>
      </div>

      <div style={{ position: 'fixed', right: 24, bottom: 58, zIndex: 20 }}>
        <div
          className="guofeng-glass-strong"
          style={{
            padding: '6px 12px',
            color: '#8b7355',
            fontSize: 10.5,
            letterSpacing: 1,
            border: '1px solid rgba(139,105,70,0.2)',
          }}
        >
          {MAP_REVIEW_LABEL}
        </div>
      </div>

      <div style={{ position: 'fixed', top: 20, right: 24, zIndex: 20, display: 'flex', gap: 10 }}>
        <button
          className="guofeng-glass-strong"
          onClick={() => setPhase('memory-game')}
          style={{
            padding: '10px 20px',
            border: '1px solid rgba(139, 105, 70, 0.3)',
            background: 'linear-gradient(135deg, rgba(157, 112, 66, 0.14) 0%, rgba(111, 73, 35, 0.08) 100%)',
            color: '#8b6846',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              'linear-gradient(135deg, rgba(157, 112, 66, 0.22) 0%, rgba(111, 73, 35, 0.14) 100%)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 105, 70, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              'linear-gradient(135deg, rgba(157, 112, 66, 0.14) 0%, rgba(111, 73, 35, 0.08) 100%)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span style={{ fontSize: '16px' }}>◈</span>
          民居翻翻乐
        </button>
        <button
          className="guofeng-glass-strong"
          onClick={() => setPhase('craftsmanship')}
          style={{
            padding: '10px 20px',
            border: '1px solid rgba(139, 105, 70, 0.3)',
            background: 'linear-gradient(135deg, rgba(201, 168, 106, 0.1) 0%, rgba(139, 105, 70, 0.05) 100%)',
            color: '#8b6846',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              'linear-gradient(135deg, rgba(201, 168, 106, 0.2) 0%, rgba(139, 105, 70, 0.1) 100%)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 105, 70, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              'linear-gradient(135deg, rgba(201, 168, 106, 0.1) 0%, rgba(139, 105, 70, 0.05) 100%)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <i className="fas fa-hammer" style={{ fontSize: '16px' }}></i>
          匠作志
        </button>
      </div>

      {hoveredData && (
        <div
          style={{
            position: 'fixed',
            right: 24,
            top: 86,
            zIndex: 50,
            pointerEvents: 'none',
          }}
        >
          <div
            className="guofeng-glass-strong"
            style={{
              padding: '14px 20px',
              border: `1px solid ${getRegionColor(hoveredData.region)}66`,
              minWidth: 240,
              maxWidth: 360,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: getRegionColor(hoveredData.region),
                }}
              />
              <span style={{ fontWeight: 700, fontSize: 16, color: '#3a2a1a' }}>{hoveredData.name}</span>
              <span style={{ fontSize: 12, color: '#8a7d73', marginLeft: 'auto' }}>{hoveredData.region}</span>
            </div>
            <div style={{ fontSize: 13, color: '#5a4d42', marginBottom: 4 }}>{hoveredData.buildingGene}</div>
            <div style={{ fontSize: 12, color: '#8a7d73' }}>{hoveredData.description}</div>
          </div>
        </div>
      )}
    </div>
  );
}
