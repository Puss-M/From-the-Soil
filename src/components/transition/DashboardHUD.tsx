'use client';

import { useStore } from '@/store/useStore';
import { useMemo, useState } from 'react';

export function DashboardHUD() {
  const { currentClimate, startStation, endStation } = useStore();
  const [isCollapsed, setIsCollapsed] = useState(true);

  // 计算当前插值的气候数据
  const displayData = useMemo(() => {
    return {
      rainfall: currentClimate.rainfall.toFixed(0),
      humidity: currentClimate.humidity.toFixed(0),
      temperature: currentClimate.temperature.toFixed(1),
      altitude: currentClimate.altitude.toFixed(0),
      sunlight: (currentClimate.sunlight * 100).toFixed(0),
      defense: currentClimate.defense.toFixed(1),
    };
  }, [currentClimate]);

  // 计算屋顶和窗户参数
  const buildingParams = useMemo(() => {
    const roofPitch = 15 + (currentClimate.rainfall / 2000) * 45;
    const eavesOverhang = 0.1 + currentClimate.sunlight * 0.7;
    const windowScale = Math.max(0.17, 1 - currentClimate.defense / 12);
    return { roofPitch, eavesOverhang, windowScale };
  }, [currentClimate]);

  const indicators = [
    { icon: '🌧️', label: '降雨量', value: `${displayData.rainfall} mm`, pct: (currentClimate.rainfall / 2000) * 100, color: '#0ea5e9' },
    { icon: '💧', label: '湿度', value: `${displayData.humidity}%`, pct: currentClimate.humidity, color: '#6366f1' },
    { icon: '🌡️', label: '温度', value: `${displayData.temperature}°C`, pct: ((currentClimate.temperature + 10) / 40) * 100, color: '#f97316' },
    { icon: '⛰️', label: '海拔', value: `${displayData.altitude} m`, pct: (currentClimate.altitude / 4000) * 100, color: '#10b981' },
    { icon: '☀️', label: '日照', value: `${displayData.sunlight}%`, pct: currentClimate.sunlight * 100, color: '#eab308' },
    { icon: '🛡️', label: '防御', value: `Lv.${displayData.defense}`, pct: (currentClimate.defense / 10) * 100, color: '#ef4444' },
  ];

  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10" style={{ width: isCollapsed ? 48 : 220 }}>
      <div
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(16px)',
          borderRadius: 14,
          padding: isCollapsed ? '8px' : '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
        }}
      >
        {/* 折叠头部 */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: isCollapsed ? '4px' : '0 0 8px 0',
            borderBottom: isCollapsed ? 'none' : '1px solid #e2e8f0',
            marginBottom: isCollapsed ? 0 : 12,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
          {!isCollapsed && (
            <span style={{ fontSize: 10, color: '#6366f1', letterSpacing: 3, fontWeight: 600, textTransform: 'uppercase' }}>
              环境仪表盘
            </span>
          )}
          <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto' }}>
            {isCollapsed ? '▶' : '◀'}
          </span>
        </button>

        {/* 展开内容 */}
        {!isCollapsed && (
          <>
            {/* 气候参数 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {indicators.map((ind) => (
                <div key={ind.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                    <span style={{ color: '#64748b' }}>{ind.icon} {ind.label}</span>
                    <span style={{ color: ind.color, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{ind.value}</span>
                  </div>
                  <div style={{ height: 4, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        background: ind.color,
                        width: `${Math.min(100, Math.max(0, ind.pct))}%`,
                        borderRadius: 2,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 分隔线 */}
            <div style={{ borderTop: '1px solid #e2e8f0', margin: '12px 0' }} />

            {/* 建筑形态参数 */}
            <div style={{ fontSize: 10, color: '#6366f1', letterSpacing: 3, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>
              建筑形态
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>屋顶坡度</span>
                <span style={{ color: '#0ea5e9', fontWeight: 600 }}>{buildingParams.roofPitch.toFixed(1)}°</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>屋檐出挑</span>
                <span style={{ color: '#eab308', fontWeight: 600 }}>{buildingParams.eavesOverhang.toFixed(2)}m</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>窗户比例</span>
                <span style={{ color: '#ef4444', fontWeight: 600 }}>{(buildingParams.windowScale * 100).toFixed(0)}%</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
