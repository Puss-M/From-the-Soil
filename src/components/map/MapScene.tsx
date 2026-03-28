'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { stations } from '@/data/stations';
import { useStore } from '@/store/useStore';

type MapEventParams = {
  seriesType?: string;
  data?: {
    id?: string;
  };
};

export function MapScene() {
  const { setPhase, setSelectedStation } = useStore();
  const [geoLoaded, setGeoLoaded] = useState(false);
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const chartRef = useRef<ReactECharts | null>(null);

  useEffect(() => {
    fetch('/china.json')
      .then((res) => res.json())
      .then((data) => {
        echarts.registerMap('china', data);
        setGeoLoaded(true);
      })
      .catch(err => console.error("Failed to load china.json", err));
  }, []);

  const hoveredData = useMemo(() => {
    if (!hoveredStation) return null;
    return stations.find((s) => s.id === hoveredStation) || null;
  }, [hoveredStation]);

  const handleChartReady = useCallback((instance: echarts.ECharts) => {
    const dom = instance.getDom();
    const preventDoubleClickZoom = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    dom.addEventListener('dblclick', preventDoubleClickZoom);

    return () => {
      dom.removeEventListener('dblclick', preventDoubleClickZoom);
    };
  }, []);

  const onEvents = useMemo(() => ({
    click: (params: MapEventParams) => {
      const stationId = params.data?.id;
      if (params.seriesType === 'effectScatter' && stationId) {
        const station = stations.find(s => s.id === stationId);
        if (station) {
          setSelectedStation(station);
          setPhase('detail');
        }
      }
    },
    mouseover: (params: MapEventParams) => {
      const stationId = params.data?.id;
      if (params.seriesType === 'effectScatter' && stationId) {
        setHoveredStation(stationId);
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
        color: '#cbbbae',
        borderColor: '#ffffff',
        borderWidth: 1.5,
      }
    }));

    return {
      backgroundColor: 'transparent',
      toolbox: {
        show: false
      },
      dataZoom: [],
      tooltip: {
        trigger: 'item',
        show: false
      },
      geo: {
        map: 'china',
        roam: 'scale', // 只允许缩放，禁止平移
        zoom: 1.2,
        scaleLimit: { min: 0.8, max: 5 },
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
          emphasis: {
            itemStyle: {
              color: '#8c221c',
              shadowBlur: 8,
              shadowColor: 'rgba(140,34,28,0.28)'
            },
            scale: true
          },
          zlevel: 1
        }
      ]
    };
  }, [geoLoaded]);

  function getRegionColor(region: string): string {
    const colors: Record<string, string> = {
      '江南': '#5b8d86', '皖南': '#7f6f52', '闽西': '#8b4a3a',
      '晋中': '#9b7442', '陕北': '#8b6846', '滇西': '#5f7f6a',
      '藏区': '#6d6376', '南疆': '#98624f', '京畿': '#8a6a4d',
      '湘西': '#6a8465', '胶东': '#6b7f8c', '滇南': '#638974',
      '蒙古': '#76806a', '岭南': '#9a6d5f', '东疆': '#b88a3b',
      '中原': '#7e6b59', '赣北': '#766355',
    };
    return colors[region] || '#8b6846';
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: '#f8f3e8' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        {geoLoaded ? (
          <ReactECharts
            ref={chartRef}
            option={option}
            opts={{ renderer: 'canvas' }}
            notMerge={false}
            lazyUpdate={true}
            style={{ width: '100%', height: '100%' }}
            onEvents={onEvents}
            onChartReady={handleChartReady}
          />
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#5c4a3a' }}>加载地图中...</div>
        )}
      </div>

      {/* 左上角标题 */}
      <div className="guofeng-glass-strong" style={{ position: 'fixed', top: 20, left: 22, zIndex: 20, padding: '10px 14px' }}>
        <h1 style={{
          fontSize: '1.5rem', fontWeight: 800, color: '#3a2a1a',
          letterSpacing: '0.12em', marginBottom: 3, fontFamily: 'var(--font-serif)',
        }}>
          千里江山
        </h1>
        <p style={{ fontSize: '0.74rem', color: '#8b6846', fontWeight: 500 }}>
          从土而生 · 建筑方言 · Architectural Dialects
        </p>
      </div>

      {/* 左下角图例 */}
      <div style={{ position: 'fixed', bottom: 20, left: 32, zIndex: 20 }}>
        <div className="guofeng-glass-strong" style={{ padding: '10px 16px' }}>
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
        <div className="guofeng-glass-strong" style={{ padding: '6px 14px' }}>
          <span style={{ fontSize: 11, color: '#8a7d73' }}>共 {stations.length} 个驿站 · 点击探索详情</span>
        </div>
      </div>

      {/* 匠作志按钮 */}
      <div style={{ position: 'fixed', top: 20, right: 24, zIndex: 20 }}>
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
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201, 168, 106, 0.2) 0%, rgba(139, 105, 70, 0.1) 100%)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 105, 70, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201, 168, 106, 0.1) 0%, rgba(139, 105, 70, 0.05) 100%)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <i className="fas fa-hammer" style={{ fontSize: '16px' }}></i>
          匠作志
        </button>
      </div>

      {/* 悬停信息卡 */}
      {hoveredData && (
        <div style={{
          position: 'fixed', right: 24, top: 86,
          zIndex: 50, pointerEvents: 'none',
        }}>
          <div className="guofeng-glass-strong" style={{
            padding: '14px 20px',
            border: `1px solid ${getRegionColor(hoveredData.region)}66`,
            minWidth: 240,
            maxWidth: 360,
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
