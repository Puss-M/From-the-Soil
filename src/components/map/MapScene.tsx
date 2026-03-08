'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from 'react-simple-maps';
import { stations } from '@/data/stations';
import { Station } from '@/types';
import { useStore } from '@/store/useStore';

const CHINA_GEO_URL = '/china.json';

function getRegionColor(region: string): string {
  const colors: Record<string, string> = {
    '江南': '#2563eb', '皖南': '#7c3aed', '闽西': '#dc2626',
    '晋中': '#d97706', '陕北': '#b45309', '滇西': '#059669',
    '藏区': '#6366f1', '南疆': '#e11d48', '京畿': '#ea580c',
    '湘西': '#16a34a', '胶东': '#0891b2', '滇南': '#10b981',
    '蒙古': '#0d9488', '岭南': '#f43f5e', '东疆': '#f59e0b',
    '中原': '#8b5cf6', '赣北': '#a855f7',
  };
  return colors[region] || '#6366f1';
}

const labelOffsets: Record<string, [number, number]> = {
  'suzhou': [14, -12], 'wuxi': [14, 8], 'hangzhou': [-16, 10],
  'huizhou': [-16, -8], 'wuyuan': [-16, 8], 'beijing': [14, 0],
  'weihai': [14, -10], 'pingyao': [0, -16], 'yanan': [-16, 0],
  'xilingol': [14, -10], 'guangzhou': [-16, 6], 'fujian': [14, 0],
  'fenghuang': [-16, 0], 'dali': [-16, 0], 'xishuangbanna': [14, 0],
};

function getProvinceRegionTint(name: string): string {
  const tints: Record<string, string> = {
    '浙江': '#dbeafe', '江苏': '#dbeafe', '上海': '#dbeafe',
    '安徽': '#ede9fe', '江西': '#ede9fe',
    '福建': '#fee2e2', '广东': '#fce7f3',
    '山西': '#fef3c7', '陕西': '#fef3c7', '甘肃': '#fef3c7',
    '云南': '#d1fae5', '四川': '#d1fae5',
    '西藏': '#e0e7ff', '新疆': '#fce7f3',
    '北京': '#ffedd5', '天津': '#ffedd5', '河北': '#ffedd5',
    '湖南': '#dcfce7', '湖北': '#dcfce7', '山东': '#cffafe',
    '内蒙古': '#ccfbf1', '河南': '#f3e8ff', '广西': '#ffe4e6',
    '贵州': '#ecfccb', '辽宁': '#e0f2fe', '吉林': '#e0f2fe',
    '黑龙江': '#e0f2fe', '重庆': '#fce7f3', '海南': '#fbcfe8',
    '宁夏': '#fef9c3', '青海': '#e8e8fd', '台湾': '#d1fae5',
    '香港': '#fce7f3', '澳门': '#fce7f3',
  };
  return tints[name] || '#f1f5f9';
}

export function MapScene({ onStartJourney }: { onStartJourney?: () => void }) {
  const { startStation, endStation, setRoute, setPhase, setSelectedStation } = useStore();

  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleStationClick = useCallback(
    (station: Station) => {
      // 单击驿站 → 进入详情页
      setSelectedStation(station);
      setPhase('detail');
    },
    [setSelectedStation, setPhase]
  );

  const handleStartJourney = () => {
    if (startStation && endStation) {
      setPhase('transition');
      onStartJourney?.();
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const hoveredData = useMemo(() => {
    if (!hoveredStation) return null;
    return stations.find((s) => s.id === hoveredStation) || null;
  }, [hoveredStation]);

  const visibleConnections = useMemo(() => {
    const activeId = hoveredStation || startStation?.id || null;
    if (!activeId) return [];
    return stations
      .filter((s) => s.id !== activeId)
      .map((s) => {
        const active = stations.find((st) => st.id === activeId)!;
        return { from: active, to: s };
      });
  }, [hoveredStation, startStation]);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #e0f2fe 0%, #f0f9ff 30%, #f5f3ff 60%, #fdf2f8 100%)' }}
      onMouseMove={handleMouseMove}
    >
      {/* ══ Layer 0: Canvas (地图 SVG) ═══════════════════════ */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [104, 33], scale: 580 }}
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            <marker id="arrowHead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
            </marker>
          </defs>

          <Geographies geography={CHINA_GEO_URL}>
            {({ geographies }: { geographies: Array<{ rsmKey: string; properties?: { name?: string } }> }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getProvinceRegionTint(geo.properties?.name || '')}
                  stroke="#cbd5e1"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#e2e8f0', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {visibleConnections.map(({ from, to }) => {
            const isHighlighted =
              (startStation?.id === from.id && endStation?.id === to.id) ||
              (startStation?.id === to.id && endStation?.id === from.id);
            if (isHighlighted) return null;
            return (
              <Line key={`${from.id}-${to.id}`} from={from.coordinates} to={to.coordinates}
                stroke="#94a3b8" strokeWidth={0.5} strokeOpacity={0.25} strokeDasharray="3,6" />
            );
          })}

          {startStation && endStation && (
            <Line from={startStation.coordinates} to={endStation.coordinates}
              stroke="#2563eb" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="8,5"
              style={{ animation: 'dashFlow 1s linear infinite' }} />
          )}

          {stations.map((station) => {
            const isSelected = startStation?.id === station.id || endStation?.id === station.id;
            const isHovered = hoveredStation === station.id;
            const color = getRegionColor(station.region);
            const r = isSelected ? 7 : isHovered ? 6 : 4;
            const offset = labelOffsets[station.id] || [0, -14];
            return (
              <Marker key={station.id} coordinates={station.coordinates}
                onClick={() => handleStationClick(station)}
                onMouseEnter={() => setHoveredStation(station.id)}
                onMouseLeave={() => setHoveredStation(null)}
                style={{ default: { cursor: 'pointer' }, hover: { cursor: 'pointer' }, pressed: {} }}
              >
                {isSelected && (
                  <circle r={16} fill={color} opacity={0.12}>
                    <animate attributeName="r" values="8;20;8" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.25;0.03;0.25" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle r={r + 2.5} fill="white" stroke={color} strokeWidth={1.5} opacity={isSelected || isHovered ? 1 : 0.85} />
                <circle r={r} fill={color} stroke="white" strokeWidth={1.5} />
                <text x={offset[0]} y={offset[1]}
                  textAnchor={offset[0] > 0 ? 'start' : offset[0] < 0 ? 'end' : 'middle'}
                  alignmentBaseline="middle" fill="#334155"
                  fontSize={isSelected || isHovered ? 11 : 9.5}
                  fontWeight={isSelected || isHovered ? 700 : 500}
                  style={{ paintOrder: 'stroke', stroke: 'rgba(255,255,255,0.92)', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }}
                >
                  {station.name}
                </text>
              </Marker>
            );
          })}
        </ComposableMap>
      </div>

      {/* ══ Layer 1: UI 控件 (每个独立 fixed/absolute + z-index) ══ */}

      {/* 左上角标题 */}
      <div style={{ position: 'fixed', top: 24, left: 32, zIndex: 20 }}>
        <h1 style={{
          fontSize: '1.8rem', fontWeight: 800, color: '#1e293b',
          letterSpacing: '0.15em', marginBottom: 4, fontFamily: 'var(--font-serif)',
        }}>
          千里江山
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 500 }}>
          从土而生 · 建筑方言 · Architectural Dialects
        </p>
      </div>

      {/* 右上角路线规划面板 */}
      <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 20, width: 260 }}>
        <div style={{
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)',
          borderRadius: 16, padding: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ fontSize: 11, color: '#64748b', letterSpacing: 2, marginBottom: 14, fontWeight: 600 }}>
            路线规划
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#2563eb', boxShadow: '0 0 8px rgba(37,99,235,0.3)' }} />
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>起点</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: startStation ? '#1e293b' : '#94a3b8' }}>
                {startStation ? startStation.name : '点击地图选择'}
              </div>
            </div>
          </div>

          <div style={{ borderLeft: '2px dashed #cbd5e1', height: 14, marginLeft: 5 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#dc2626', boxShadow: '0 0 8px rgba(220,38,38,0.3)' }} />
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>终点</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: endStation ? '#1e293b' : '#94a3b8' }}>
                {endStation ? endStation.name : '点击地图选择'}
              </div>
            </div>
          </div>

          <button
            onClick={handleStartJourney}
            disabled={!startStation || !endStation}
            style={{
              width: '100%', padding: '12px 0', borderRadius: 12, border: 'none',
              fontWeight: 600, fontSize: 14,
              cursor: startStation && endStation ? 'pointer' : 'not-allowed',
              background: startStation && endStation ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : '#f1f5f9',
              color: startStation && endStation ? 'white' : '#94a3b8',
              boxShadow: startStation && endStation ? '0 4px 16px rgba(37,99,235,0.25)' : 'none',
              transition: 'all 0.3s', letterSpacing: '0.05em',
            }}
          >
            {startStation && endStation ? '🚀 启程探索' : '请选择起点和终点'}
          </button>

          {startStation && endStation && (
            <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 8 }}>
              将从「{startStation.buildingGene}」渐变至「{endStation.buildingGene}」
            </div>
          )}
        </div>
      </div>

      {/* 左下角图例 */}
      <div style={{ position: 'fixed', bottom: 20, left: 32, zIndex: 20 }}>
        <div style={{
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
          borderRadius: 10, padding: '10px 16px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0',
        }}>
          <div style={{ fontSize: 10, color: '#94a3b8', letterSpacing: 2, marginBottom: 4, fontWeight: 600 }}>
            地域图例
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', maxWidth: 500 }}>
            {['江南','皖南','赣北','闽西','湘西','岭南','滇西','滇南','藏区','晋中','陕北','京畿','胶东','蒙古','南疆','东疆','中原'].map((region) => (
              <div key={region} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: getRegionColor(region) }} />
                <span style={{ fontSize: 10, color: '#475569' }}>{region}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右下角驿站计数 */}
      <div style={{ position: 'fixed', bottom: 20, right: 24, zIndex: 20 }}>
        <div style={{
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
          borderRadius: 10, padding: '6px 14px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0',
        }}>
          <span style={{ fontSize: 11, color: '#64748b' }}>共 {stations.length} 个驿站 · 点击选择路线</span>
        </div>
      </div>

      {/* 悬停信息卡 */}
      {hoveredData && (
        <div style={{
          position: 'fixed', left: mousePos.x + 16, top: mousePos.y - 10,
          transform: 'translateY(-100%)', zIndex: 50, pointerEvents: 'none',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(16px)',
            borderRadius: 14, padding: '14px 20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: `2px solid ${getRegionColor(hoveredData.region)}20`,
            minWidth: 240,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: getRegionColor(hoveredData.region) }} />
              <span style={{ fontWeight: 700, fontSize: 16, color: '#1e293b' }}>{hoveredData.name}</span>
              <span style={{ fontSize: 12, color: '#64748b', marginLeft: 'auto' }}>{hoveredData.region}</span>
            </div>
            <div style={{ fontSize: 13, color: '#334155', marginBottom: 4 }}>🏠 {hoveredData.buildingGene}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{hoveredData.description}</div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
              <span>🌧️ {hoveredData.climate.rainfall}mm</span>
              <span>☀️ {(hoveredData.climate.sunlight * 100).toFixed(0)}%</span>
              <span>🛡️ Lv.{hoveredData.climate.defense}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
