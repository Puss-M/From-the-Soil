'use client';

import { useStore } from '@/store/useStore';

export function ControlPanel() {
  const { currentClimate, setClimateParam } = useStore();

  // 计算显示值
  const roofPitch = (15 + (currentClimate.rainfall / 2000) * 45).toFixed(1);
  const eavesOverhang = (0.1 + currentClimate.sunlight * 0.7).toFixed(2);
  const windowScale = Math.max(0.17, 1 - currentClimate.defense / 12).toFixed(2);

  return (
    <div className="absolute top-6 left-6 w-80 z-10">
      {/* 标题 */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white tracking-wider">
          建筑方言
        </h1>
        <p className="text-cyan-400 text-sm">Architectural Dialects</p>
      </div>

      {/* 控制面板 */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 space-y-5">
        <div className="text-xs text-slate-400 uppercase tracking-widest mb-3">
          环境控制台 / The God Mode
        </div>

        {/* 降雨量滑块 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-slate-200 text-sm font-medium">
              🌧️ 降雨量 <span className="text-slate-500">Rainfall</span>
            </label>
            <span className="text-cyan-400 font-mono text-sm">
              {currentClimate.rainfall.toFixed(0)} mm
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="2000"
            step="10"
            value={currentClimate.rainfall}
            onChange={(e) => setClimateParam('rainfall', Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer 
                       [&::-webkit-slider-thumb]:appearance-none 
                       [&::-webkit-slider-thumb]:w-4 
                       [&::-webkit-slider-thumb]:h-4 
                       [&::-webkit-slider-thumb]:rounded-full 
                       [&::-webkit-slider-thumb]:bg-cyan-400
                       [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>极干旱 (平顶晒粮)</span>
            <span>多雨 (尖顶排水)</span>
          </div>
        </div>

        {/* 日照系数滑块 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-slate-200 text-sm font-medium">
              ☀️ 日照系数 <span className="text-slate-500">Sunlight</span>
            </label>
            <span className="text-cyan-400 font-mono text-sm">
              {(currentClimate.sunlight * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={currentClimate.sunlight}
            onChange={(e) => setClimateParam('sunlight', Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer 
                       [&::-webkit-slider-thumb]:appearance-none 
                       [&::-webkit-slider-thumb]:w-4 
                       [&::-webkit-slider-thumb]:h-4 
                       [&::-webkit-slider-thumb]:rounded-full 
                       [&::-webkit-slider-thumb]:bg-yellow-400
                       [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(250,204,21,0.5)]"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>弱 (短出挑采光)</span>
            <span>强 (深出挑遮阳)</span>
          </div>
        </div>

        {/* 防御等级滑块 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-slate-200 text-sm font-medium">
              🛡️ 防御等级 <span className="text-slate-500">Defense</span>
            </label>
            <span className="text-cyan-400 font-mono text-sm">
              Lv.{currentClimate.defense.toFixed(0)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={currentClimate.defense}
            onChange={(e) => setClimateParam('defense', Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer 
                       [&::-webkit-slider-thumb]:appearance-none 
                       [&::-webkit-slider-thumb]:w-4 
                       [&::-webkit-slider-thumb]:h-4 
                       [&::-webkit-slider-thumb]:rounded-full 
                       [&::-webkit-slider-thumb]:bg-red-400
                       [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(248,113,113,0.5)]"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>和平 (大窗通透)</span>
            <span>战乱 (射击孔)</span>
          </div>
        </div>
      </div>

      {/* 逻辑监视器 */}
      <div className="mt-4 bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4">
        <div className="text-xs text-cyan-500 uppercase tracking-widest mb-3">
          逻辑可视化 / The Logic
        </div>

        <div className="space-y-2 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">屋顶坡度</span>
            <span className="text-cyan-400">
              y = 0.025x + 15 → <span className="text-white font-bold">{roofPitch}°</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">屋檐出挑</span>
            <span className="text-yellow-400">
              y = 0.7x + 0.1 → <span className="text-white font-bold">{eavesOverhang}m</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">窗户比例</span>
            <span className="text-red-400">
              y = 1 - x/12 → <span className="text-white font-bold">{(Number(windowScale) * 100).toFixed(0)}%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
