'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { stations } from '@/data/stations';
import { useStore } from '@/store/useStore';

export function MapScene({ onStartJourney }: { onStartJourney?: () => void }) {
  const { startStation, endStation, setPhase, setSelectedStation } = useStore();
  const [geoLoaded, setGeoLoaded] = useState(false);

  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

  useEffect(() => {
    fetch('/china.json')
      .then((res) => res.json())
      .then((data) => {
        echarts.registerMap('china', data);
        setGeoLoaded(true);
      })
      .catch(err => console.error("Failed to load china.json", err));
  }, []);

  const handleStartJourney = () => {
    if (startStation && endStation) {
      setPhase('transition');
      onStartJourney?.();
    }
  };

  const hoveredData = useMemo(() => {
    if (!hoveredStation) return null;
    return stations.find((s) => s.id === hoveredStation) || null;
  }, [hoveredStation]);

  const onEvents = useMemo(() => ({
    click: (params: any) => {
      if (params.seriesType === 'effectScatter' && params.data) {
        const station = stations.find(s => s.id === params.data.id);
        if (station) {
          setSelectedStation(station);
          setPhase('detail');
        }
      }
    },
    mouseover: (params: any) => {
      if (params.seriesType === 'effectScatter' && params.data) {
        setHoveredStation(params.data.id);
      }
    },
    mouseout: () => {
      setHoveredStation(null);
    }
  }), [setSelectedStation, setPhase]);

  const option = useMemo(() => {
    if (!geoLoaded) return {};

    const scatterData = stations.map(s => ({
      name: s.name,
      value: [...s.coordinates, s.name],
      id: s.id,
      itemStyle: {
        color: hoveredStation === s.id || startStation?.id === s.id || endStation?.id === s.id ? '#8c221c' : '#cbbbae',
        borderColor: '#ffffff',
        borderWidth: 1.5,
      }
    }));

    const linesData = [];
    if (startStation && endStation) {
      linesData.push({
        coords: [startStation.coordinates, endStation.coordinates],
      });
    }

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        show: false
      },
      geo: {
        map: 'china',
        roam: true, // 允许缩放和平移
        zoom: 1.2,
        center: [104.195397, 35.86166],
        label: {
          show: false,
          color: '#5a4d42'
        },
        itemStyle: {
          areaColor: '#f7f1e9', // Parchment-like light area
          borderColor: '#d6cbbd', // Traditional paper fold color
          borderWidth: 1.2,
          shadowColor: 'rgba(0, 0, 0, 0.05)',
          shadowBlur: 5
        },
        emphasis: {
          itemStyle: {
            areaColor: '#fdfaf7',
          },
          label: {
            show: false
          }
        }
      },
      series: [
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: scatterData,
          symbolSize: 10,
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke',
            scale: 3,
            period: 4
          },
          label: {
            show: true,
            formatter: '{b}',
            position: 'top',
            color: '#5a4d42',
            fontSize: 12,
            fontWeight: 'bold',
            distance: 5,
            backgroundColor: 'transparent',
            textBorderColor: 'transparent'
          },
          labelLayout: {
            hideOverlap: false,
            moveOverlap: 'shiftY',
          },
          itemStyle: {
            color: '#8c221c', // Seal Red
            shadowBlur: 4,
            shadowColor: 'rgba(0,0,0,0.2)'
          },
          zlevel: 1
        },
        ...(linesData.length > 0 ? [{
          type: 'lines',
          coordinateSystem: 'geo',
          zlevel: 2,
          effect: {
            show: true,
            period: 4,
            trailLength: 0.4,
            color: '#8c221c',
            symbol: 'arrow',
            symbolSize: 5
          },
          lineStyle: {
            color: '#8c221c',
            width: 1.5,
            opacity: 0.4,
            curveness: 0.2,
            type: 'dashed'
          },
          data: linesData
        }] : [])
      ]
    };
  }, [geoLoaded, hoveredStation, startStation, endStation]);

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

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: '#faf7f2' /* Light parchment background */ }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        {geoLoaded ? (
          <ReactECharts
            option={option}
            style={{ width: '100%', height: '100%' }}
            onEvents={onEvents}
          />
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#5c4a3a' }}>加载地图中...</div>
        )}
      </div>

      {/* 左上角标题 */}
      <div style={{ position: 'fixed', top: 24, left: 32, zIndex: 20 }}>
        <h1 style={{
          fontSize: '1.8rem', fontWeight: 800, color: '#3a2a1a',
          letterSpacing: '0.15em', marginBottom: 4, fontFamily: 'var(--font-serif)',
        }}>
          千里江山
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#8c221c', fontWeight: 500 }}>
          从土而生 · 建筑方言 · Architectural Dialects
        </p>
      </div>

      {/* 右上角路线规划面板 */}
      <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 20, width: 260 }}>
        <div style={{
          background: 'rgba(250,247,242,0.95)', backdropFilter: 'blur(16px)',
          borderRadius: 4, padding: 20, boxShadow: '0 4px 24px rgba(92, 74, 58, 0.08)',
          border: '1px solid #e8e0d8',
        }}>
          <div style={{ fontSize: 11, color: '#8a7d73', letterSpacing: 2, marginBottom: 14, fontWeight: 600 }}>
            路线规划
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#3a2a1a', boxShadow: '0 0 8px rgba(58, 42, 26, 0.3)' }} />
            <div>
              <div style={{ fontSize: 11, color: '#8a7d73' }}>起点</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: startStation ? '#3a2a1a' : '#8a7d73' }}>
                {startStation ? startStation.name : '点击地图选择'}
              </div>
            </div>
          </div>

          <div style={{ borderLeft: '2px dashed #cbbbae', height: 14, marginLeft: 5 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#8c221c', boxShadow: '0 0 8px rgba(140, 34, 28, 0.3)' }} />
            <div>
              <div style={{ fontSize: 11, color: '#8a7d73' }}>终点</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: endStation ? '#3a2a1a' : '#8a7d73' }}>
                {endStation ? endStation.name : '点击地图选择'}
              </div>
            </div>
          </div>

          <button
            onClick={handleStartJourney}
            disabled={!startStation || !endStation}
            style={{
              width: '100%', padding: '12px 0', borderRadius: 4, border: '1px solid #e8e0d8',
              fontWeight: 600, fontSize: 14,
              cursor: startStation && endStation ? 'pointer' : 'not-allowed',
              background: startStation && endStation ? '#8c221c' : '#f0ece3',
              color: startStation && endStation ? '#faf7f2' : '#b0a498',
              boxShadow: startStation && endStation ? '0 4px 16px rgba(140, 34, 28, 0.25)' : 'none',
              transition: 'all 0.3s', letterSpacing: '0.05em',
            }}
          >
            {startStation && endStation ? '🚀 启程探索' : '请选择起点和终点'}
          </button>

          {startStation && endStation && (
            <div style={{ fontSize: 11, color: '#8a7d73', textAlign: 'center', marginTop: 8 }}>
              将从「{startStation.buildingGene}」渐变至「{endStation.buildingGene}」
            </div>
          )}
        </div>
      </div>

      {/* 左下角图例 */}
      <div style={{ position: 'fixed', bottom: 20, left: 32, zIndex: 20 }}>
        <div style={{
          background: 'rgba(250,247,242,0.95)', backdropFilter: 'blur(8px)',
          borderRadius: 4, padding: '10px 16px',
          boxShadow: '0 4px 24px rgba(92, 74, 58, 0.08)', border: '1px solid #e8e0d8',
        }}>
          <div style={{ fontSize: 10, color: '#8a7d73', letterSpacing: 2, marginBottom: 4, fontWeight: 600 }}>
            地域图例
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', maxWidth: 500 }}>
            {['江南','皖南','赣北','闽西','湘西','岭南','滇西','滇南','藏区','晋中','陕北','京畿','胶东','蒙古','南疆','东疆','中原'].map((region) => (
              <div key={region} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: getRegionColor(region) }} />
                <span style={{ fontSize: 10, color: '#5a4d42' }}>{region}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右下角驿站计数 */}
      <div style={{ position: 'fixed', bottom: 20, right: 24, zIndex: 20 }}>
        <div style={{
          background: 'rgba(250,247,242,0.95)', backdropFilter: 'blur(8px)',
          borderRadius: 4, padding: '6px 14px',
          boxShadow: '0 4px 24px rgba(92, 74, 58, 0.08)', border: '1px solid #e8e0d8',
        }}>
          <span style={{ fontSize: 11, color: '#8a7d73' }}>共 {stations.length} 个驿站 · 点击选择路线</span>
        </div>
      </div>

      {/* 悬停信息卡 */}
      {hoveredData && (
        <div style={{
          position: 'fixed', right: 300, top: 24,
          zIndex: 50, pointerEvents: 'none',
        }}>
          <div style={{
            background: 'rgba(250,247,242,0.96)', backdropFilter: 'blur(16px)',
            borderRadius: 4, padding: '14px 20px',
            boxShadow: '0 8px 32px rgba(92, 74, 58, 0.12)',
            border: `2px solid ${getRegionColor(hoveredData.region)}20`,
            minWidth: 240,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: getRegionColor(hoveredData.region) }} />
              <span style={{ fontWeight: 700, fontSize: 16, color: '#3a2a1a' }}>{hoveredData.name}</span>
              <span style={{ fontSize: 12, color: '#8a7d73', marginLeft: 'auto' }}>{hoveredData.region}</span>
            </div>
            <div style={{ fontSize: 13, color: '#5a4d42', marginBottom: 4 }}>🏠 {hoveredData.buildingGene}</div>
            <div style={{ fontSize: 12, color: '#8a7d73' }}>{hoveredData.description}</div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#b0a498', marginTop: 6 }}>
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
