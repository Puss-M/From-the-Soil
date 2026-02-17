'use client';

import { useStore } from '@/store/useStore';

export function ControlPanel() {
  const { currentClimate, setClimateParam } = useStore();

  // 計算顯示值
  const roofPitch = (15 + (currentClimate.rainfall / 2000) * 45).toFixed(1);
  const eavesOverhang = (0.1 + currentClimate.sunlight * 0.7).toFixed(2);
  const windowScale = Math.max(0.17, 1 - currentClimate.defense / 12).toFixed(2);

  const sliderStyle = `w-full h-1.5 rounded-full appearance-none cursor-pointer
    [&::-webkit-slider-thumb]:appearance-none 
    [&::-webkit-slider-thumb]:w-5 
    [&::-webkit-slider-thumb]:h-5 
    [&::-webkit-slider-thumb]:rounded-full 
    [&::-webkit-slider-thumb]:border-2
    [&::-webkit-slider-thumb]:border-white
    [&::-webkit-slider-thumb]:shadow-lg
    [&::-webkit-slider-thumb]:transition-transform
    [&::-webkit-slider-thumb]:hover:scale-110`;

  return (
    <div style={{
      position: 'fixed', top: 80, left: 20, width: 300, zIndex: 20,
      pointerEvents: 'auto',
    }}>
      <div>
          {/* 標題區域 */}
          <div className="mb-5 pl-2 border-l-4 border-indigo-400">
            <h1
              style={{
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#1e293b',
                letterSpacing: '0.15em',
                fontFamily: 'var(--font-serif)',
              }}
            >
              形态调控
            </h1>
            <p style={{ color: '#6366f1', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', marginTop: 2, opacity: 0.8 }}>
              ARCHITECTURAL MORPHOGENESIS
            </p>
          </div>

          {/* 控制面板容器 - 浅色磨砂玻璃风格 */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: 16,
              padding: 20,
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              border: '1px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'var(--font-mono)', letterSpacing: 3, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>ENVIRONMENTAL PARAMETERS</span>
              <div style={{ width: 32, height: 1, background: '#e2e8f0' }} />
            </div>

            {/* 降雨量滑块 */}
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <label style={{ color: '#475569', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 16 }}>🌧️</span> 
                  <span style={{ fontFamily: 'var(--font-serif)' }}>降雨量</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ color: '#0ea5e9', fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700 }}>{currentClimate.rainfall.toFixed(0)}</span>
                    <span style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>MILLIMETERS</span>
                </div>
              </div>
              
              <input
                type="range"
                min="0"
                max="2000"
                step="10"
                value={currentClimate.rainfall}
                onChange={(e) => setClimateParam('rainfall', Number(e.target.value))}
                className={sliderStyle}
                style={{ background: `linear-gradient(to right, #0ea5e9 ${(currentClimate.rainfall / 2000) * 100}%, #e2e8f0 ${(currentClimate.rainfall / 2000) * 100}%)` }}
              />
              
              <div className="flex justify-between mt-1 px-1">
                <span style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>DRY</span>
                <span style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>WET</span>
              </div>
            </div>

            {/* 日照系数滑块 */}
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <label style={{ color: '#475569', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 16 }}>☀️</span> 
                  <span style={{ fontFamily: 'var(--font-serif)' }}>日照量</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ color: '#f59e0b', fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700 }}>{(currentClimate.sunlight * 100).toFixed(0)}%</span>
                    <span style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>INTENSITY</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={currentClimate.sunlight}
                onChange={(e) => setClimateParam('sunlight', Number(e.target.value))}
                className={sliderStyle}
                style={{ background: `linear-gradient(to right, #f59e0b ${currentClimate.sunlight * 100}%, #e2e8f0 ${currentClimate.sunlight * 100}%)` }}
              />
            </div>

            {/* 防御等级滑块 */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label style={{ color: '#475569', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 16 }}>🛡️</span> 
                  <span style={{ fontFamily: 'var(--font-serif)' }}>防御级</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ color: '#ef4444', fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700 }}>Lv.{currentClimate.defense.toFixed(0)}</span>
                    <span style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>DEFENSE</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={currentClimate.defense}
                onChange={(e) => setClimateParam('defense', Number(e.target.value))}
                className={sliderStyle}
                style={{ background: `linear-gradient(to right, #ef4444 ${(currentClimate.defense / 10) * 100}%, #e2e8f0 ${(currentClimate.defense / 10) * 100}%)` }}
              />
            </div>
          </div>

          {/* 实时逻辑反馈 */}
          <div className="mt-3 grid grid-cols-3 gap-2">
             <DataCard label="Roof Pitch" value={`${roofPitch}°`} color="cyan" />
             <DataCard label="Overhang" value={`${eavesOverhang}m`} color="amber" />
             <DataCard label="Openness" value={`${(Number(windowScale) * 100).toFixed(0)}%`} color="emerald" />
          </div>
      </div>
    </div>
  );
}

function DataCard({ label, value, color }: { label: string, value: string, color: string }) {
    const colorMap: Record<string, { text: string; border: string; bg: string }> = {
        cyan: { text: '#0ea5e9', border: '#e0f2fe', bg: '#f0f9ff' },
        amber: { text: '#f59e0b', border: '#fef3c7', bg: '#fffbeb' },
        emerald: { text: '#10b981', border: '#d1fae5', bg: '#ecfdf5' },
        red: { text: '#ef4444', border: '#fee2e2', bg: '#fef2f2' },
    };
    const c = colorMap[color] || colorMap.cyan;

    return (
        <div
          style={{
            background: c.bg,
            border: `1px solid ${c.border}`,
            borderRadius: 10,
            padding: '8px 6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
        >
            <span style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: c.text }}>{value}</span>
        </div>
    )
}
