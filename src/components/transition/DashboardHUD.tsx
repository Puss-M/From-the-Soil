'use client';

import { useStore } from '@/store/useStore';
import { useMemo } from 'react';

export function DashboardHUD() {
  const { currentClimate, transitionProgress, startStation, endStation } = useStore();

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

  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-56">
      <div className="bg-black/70 backdrop-blur-md border border-cyan-500/30 rounded-xl p-4">
        {/* 标题 */}
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs text-cyan-400 uppercase tracking-widest">
            环境仪表盘
          </span>
        </div>

        {/* 气候参数 */}
        <div className="space-y-3">
          {/* 降雨量 */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">🌧️ 降雨量</span>
              <span className="text-cyan-400 font-mono">{displayData.rainfall} mm</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                style={{ width: `${(currentClimate.rainfall / 2000) * 100}%` }}
              />
            </div>
          </div>

          {/* 湿度 */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">💧 湿度</span>
              <span className="text-blue-400 font-mono">{displayData.humidity}%</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${currentClimate.humidity}%` }}
              />
            </div>
          </div>

          {/* 温度 */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">🌡️ 温度</span>
              <span className="text-orange-400 font-mono">{displayData.temperature}°C</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-blue-500 via-green-500 to-orange-500 transition-all duration-300"
                style={{ width: `${((currentClimate.temperature + 10) / 40) * 100}%` }}
              />
            </div>
          </div>

          {/* 海拔 */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">⛰️ 海拔</span>
              <span className="text-emerald-400 font-mono">{displayData.altitude} m</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                style={{ width: `${(currentClimate.altitude / 4000) * 100}%` }}
              />
            </div>
          </div>

          {/* 日照 */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">☀️ 日照</span>
              <span className="text-yellow-400 font-mono">{displayData.sunlight}%</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-yellow-500 to-amber-500 transition-all duration-300"
                style={{ width: `${currentClimate.sunlight * 100}%` }}
              />
            </div>
          </div>

          {/* 防御 */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">🛡️ 防御</span>
              <span className="text-red-400 font-mono">Lv.{displayData.defense}</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-red-500 to-rose-500 transition-all duration-300"
                style={{ width: `${(currentClimate.defense / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 分隔线 */}
        <div className="border-t border-white/10 my-4" />

        {/* 建筑形态参数 */}
        <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">
          建筑形态
        </div>
        <div className="space-y-2 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">屋顶坡度</span>
            <span className="text-cyan-400">{buildingParams.roofPitch.toFixed(1)}°</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">屋檐出挑</span>
            <span className="text-yellow-400">{buildingParams.eavesOverhang.toFixed(2)}m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">窗户比例</span>
            <span className="text-red-400">{(buildingParams.windowScale * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
