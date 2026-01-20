'use client';

import { useStore } from '@/store/useStore';
import { MapScene } from '@/components/map/MapScene';
import { TransitionScene } from '@/components/transition/TransitionScene';
import { RoamingScene } from '@/components/roaming/RoamingScene';

export default function Home() {
  const { phase } = useStore();

  return (
    <main className="w-screen h-screen bg-slate-900 overflow-hidden">
      {/* 根据阶段渲染不同场景 */}
      {phase === 'map' && <MapScene />}
      {phase === 'transition' && <TransitionScene />}
      {phase === 'roaming' && <RoamingScene />}
    </main>
  );
}
