'use client';

import { useStore } from '@/store/useStore';

export function ControlPanel() {
  const { currentClimate, setClimateParam } = useStore();

  // 計算顯示值
  const roofPitch = (15 + (currentClimate.rainfall / 2000) * 45).toFixed(1);
  const eavesOverhang = (0.1 + currentClimate.sunlight * 0.7).toFixed(2);
  const windowScale = Math.max(0.17, 1 - currentClimate.defense / 12).toFixed(2);

  return (
    <div className="absolute top-6 left-6 w-96 z-10 pointer-events-none">
      <div className="pointer-events-auto">
          {/* 標題區域 */}
          <div className="mb-6 pl-2 border-l-4 border-cyan-500">
            <h1 className="text-4xl font-bold text-white tracking-widest font-serif drop-shadow-lg">
              形态渐变
            </h1>
            <p className="text-cyan-400 text-sm font-mono tracking-widest mt-1 opacity-80">
              ARCHITECTURAL MORPHOGENESIS
            </p>
          </div>

          {/* 控制面板容器 - Glassmorphism */}
          <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden group">
            
            {/* 裝飾性光效 */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-all duration-700" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-700" />

            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em] mb-6 flex justify-between items-center">
              <span>Environmental Parameters</span>
              <div className="w-12 h-px bg-zinc-700" />
            </div>

            {/* 降雨量滑块 */}
            <div className="mb-8 relative">
              <div className="flex justify-between items-end mb-3">
                <label className="text-zinc-300 text-sm font-medium flex items-center gap-2">
                  <span className="text-xl">🌧️</span> 
                  <span className="font-serif">降雨量</span>
                </label>
                <div className="flex flex-col items-end">
                    <span className="text-cyan-300 font-mono text-xl font-bold">{currentClimate.rainfall.toFixed(0)}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">MILLIMETERS</span>
                </div>
              </div>
              
              <input
                type="range"
                min="0"
                max="2000"
                step="10"
                value={currentClimate.rainfall}
                onChange={(e) => setClimateParam('rainfall', Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer 
                           [&::-webkit-slider-thumb]:appearance-none 
                           [&::-webkit-slider-thumb]:w-6 
                           [&::-webkit-slider-thumb]:h-6 
                           [&::-webkit-slider-thumb]:rounded-full 
                           [&::-webkit-slider-thumb]:bg-cyan-500
                           [&::-webkit-slider-thumb]:border-4
                           [&::-webkit-slider-thumb]:border-black
                           [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(6,182,212,0.5)]
                           [&::-webkit-slider-thumb]:transition-transform
                           [&::-webkit-slider-thumb]:hover:scale-110"
              />
              
              {/* 刻度背景 */}
              <div className="flex justify-between mt-2 px-1">
                <span className="text-[10px] text-zinc-600 font-mono transform -rotate-45 origin-top-left">DRY</span>
                <span className="text-[10px] text-zinc-600 font-mono transform -rotate-45 origin-top-right">WET</span>
              </div>
            </div>

            {/* 日照系数滑块 */}
            <div className="mb-8 relative">
              <div className="flex justify-between items-end mb-3">
                <label className="text-zinc-300 text-sm font-medium flex items-center gap-2">
                  <span className="text-xl">☀️</span> 
                  <span className="font-serif">日照量</span>
                </label>
                <div className="flex flex-col items-end">
                    <span className="text-amber-300 font-mono text-xl font-bold">{(currentClimate.sunlight * 100).toFixed(0)}%</span>
                    <span className="text-[10px] text-zinc-500 font-mono">INTENSITY</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={currentClimate.sunlight}
                onChange={(e) => setClimateParam('sunlight', Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer 
                           [&::-webkit-slider-thumb]:appearance-none 
                           [&::-webkit-slider-thumb]:w-6 
                           [&::-webkit-slider-thumb]:h-6 
                           [&::-webkit-slider-thumb]:rounded-full 
                           [&::-webkit-slider-thumb]:bg-amber-400
                           [&::-webkit-slider-thumb]:border-4
                           [&::-webkit-slider-thumb]:border-black
                           [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(251,191,36,0.5)]
                           [&::-webkit-slider-thumb]:transition-transform
                           [&::-webkit-slider-thumb]:hover:scale-110"
              />
            </div>

            {/* 防御等级滑块 */}
            <div className="relative">
              <div className="flex justify-between items-end mb-3">
                <label className="text-zinc-300 text-sm font-medium flex items-center gap-2">
                  <span className="text-xl">🛡️</span> 
                  <span className="font-serif">防御级</span>
                </label>
                <div className="flex flex-col items-end">
                    <span className="text-red-400 font-mono text-xl font-bold">Lv.{currentClimate.defense.toFixed(0)}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">DEFENSE</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={currentClimate.defense}
                onChange={(e) => setClimateParam('defense', Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer 
                           [&::-webkit-slider-thumb]:appearance-none 
                           [&::-webkit-slider-thumb]:w-6 
                           [&::-webkit-slider-thumb]:h-6 
                           [&::-webkit-slider-thumb]:rounded-full 
                           [&::-webkit-slider-thumb]:bg-red-500
                           [&::-webkit-slider-thumb]:border-4
                           [&::-webkit-slider-thumb]:border-black
                           [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(239,68,68,0.5)]
                           [&::-webkit-slider-thumb]:transition-transform
                           [&::-webkit-slider-thumb]:hover:scale-110"
              />
            </div>
          </div>

          {/* 实时逻辑反馈 */}
          <div className="mt-4 grid grid-cols-3 gap-2">
             <DataCard label="Roof Pitch" value={`${roofPitch}°`} color="cyan" />
             <DataCard label="Overhang" value={`${eavesOverhang}m`} color="amber" />
             <DataCard label="Openness" value={`${(Number(windowScale) * 100).toFixed(0)}%`} color="emerald" />
          </div>
      </div>
    </div>
  );
}

function DataCard({ label, value, color }: { label: string, value: string, color: string }) {
    const colorClasses: Record<string, string> = {
        cyan: 'text-cyan-400 border-cyan-500/20',
        amber: 'text-amber-400 border-amber-500/20',
        emerald: 'text-emerald-400 border-emerald-500/20',
        red: 'text-red-400 border-red-500/20',
    };

    return (
        <div className={`backdrop-blur-md bg-black/20 border ${colorClasses[color]} rounded-lg p-3 flex flex-col items-center justify-center transition-all hover:bg-white/5`}>
            <span className="text-[9px] text-zinc-500 uppercase font-mono mb-1">{label}</span>
            <span className={`text-sm font-bold font-mono ${colorClasses[color].split(' ')[0]}`}>{value}</span>
        </div>
    )
}
