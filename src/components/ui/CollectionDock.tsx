'use client';

import { useStore } from '@/store/useStore';

export function CollectionDock() {
  const { collectedItems } = useStore();

  const totalItems = collectedItems.length;
  const collectedCount = collectedItems.filter(item => item.collected).length;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-black/70 backdrop-blur-md border border-white/20 rounded-xl p-4">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📜</span>
            <span className="text-xs text-slate-400 uppercase tracking-widest">
              图谱收集
            </span>
          </div>
          <div className="text-xs text-cyan-400 font-mono">
            {collectedCount}/{totalItems}
          </div>
        </div>

        {/* 收集品列表 */}
        <div className="flex items-center gap-2">
          {collectedItems.map((item) => (
            <div
              key={item.id}
              className={`
                w-12 h-12 rounded-lg border-2 flex items-center justify-center
                transition-all duration-300
                ${item.collected 
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
                  : 'bg-slate-800/50 border-slate-600 text-slate-500'
                }
              `}
              title={item.name}
            >
              {item.collected ? (
                <span className="text-lg">✓</span>
              ) : (
                <span className="text-lg opacity-30">?</span>
              )}
            </div>
          ))}
        </div>

        {/* 进度条 */}
        <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-linear-to-r from-cyan-500 to-blue-500 transition-all duration-500"
            style={{ width: `${(collectedCount / Math.max(totalItems, 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
