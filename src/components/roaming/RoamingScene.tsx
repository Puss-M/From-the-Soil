'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Grid, Stars } from '@react-three/drei';
import { MorphingHouse } from '@/components/MorphingHouse';
import { InteractiveElement } from './InteractiveElement';
import { CollectionDock } from '@/components/ui/CollectionDock';
import { useStore } from '@/store/useStore';
import { CollectionItem } from '@/types';
import { ClimateEffects } from '@/components/ClimateEffects';
import { ControlPanel } from '@/components/ControlPanel';

// 可收集的构件数据
const collectibleItems: CollectionItem[] = [
  {
    id: 'yingbi',
    name: '影壁',
    category: '装饰构件',
    description: '立于门内或门外的独立墙壁，既可遮挡视线保护隐私，又有风水上的"挡煞"作用。',
    attributes: { privacy: 9, fengshui: 8, cost: 6, aesthetic: 7 },
    collected: false,
  },
  {
    id: 'chuangling',
    name: '窗棂',
    category: '结构构件',
    description: '窗户的格栅装饰，既有采光通风功能，又是传统工艺的精华体现。',
    attributes: { privacy: 5, fengshui: 4, cost: 7, aesthetic: 9 },
    collected: false,
  },
  {
    id: 'dougong',
    name: '斗拱',
    category: '结构构件',
    description: '中国古建筑特有的承重结构，层层叠加，承载屋檐重量。',
    attributes: { privacy: 1, fengshui: 6, cost: 9, aesthetic: 10 },
    collected: false,
  },
  {
    id: 'matouqiang',
    name: '马头墙',
    category: '装饰构件',
    description: '徽派建筑标志性元素，高出屋顶的阶梯状山墙，具有防火功能。',
    attributes: { privacy: 3, fengshui: 5, cost: 5, aesthetic: 8 },
    collected: false,
  },
  {
    id: 'tianjing',
    name: '天井',
    category: '功能构件',
    description: '民居中央的露天庭院，"四水归堂"收集雨水，寓意财源广进。',
    attributes: { privacy: 4, fengshui: 10, cost: 4, aesthetic: 6 },
    collected: false,
  },
];

// 3D 场景内容
function RoamingContent() {
  const { collectItem, collectedItems, setCollectedItems } = useStore();
  
  // 初始化收集品列表
  useEffect(() => {
    if (collectedItems.length === 0) {
      setCollectedItems(collectibleItems);
    }
  }, [collectedItems.length, setCollectedItems]);

  const handleCollect = (itemId: string) => {
    collectItem(itemId);
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[8, 5, 8]} fov={50} />
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
        target={[0, 1, 0]}
      />

      {/* 灯光 - Dramatic */}
      <ambientLight intensity={0.2} color="#1e293b" />
      <directionalLight 
        position={[10, 15, 10]} 
        intensity={1.2} 
        castShadow 
        color="#fff7ed" // Warm sun
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#38bdf8" /> {/* Cool fill */}

      {/* 环境 */}
      <Environment preset="city" blur={0.8} />
      <Stars radius={100} depth={50} count={2000} factor={4} fade speed={1} />
      
      {/* 气候粒子 */}
      <ClimateEffects />

      {/* 地面 */}
      <Grid
        position={[0, -0.01, 0]}
        args={[30, 30]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1e3a5f"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#0ea5e9"
        fadeDistance={40}
        fadeStrength={1}
        infiniteGrid={true}
      />

      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.6}
        scale={20}
        blur={2.5}
        far={5}
        color="#0f172a"
      />

      {/* 主建筑 */}
      <MorphingHouse position={[0, 0, 0]} />

      {/* 可交互构件 */}
      {collectibleItems.map((item, index) => (
        <InteractiveElement
          key={item.id}
          item={{
            ...item,
            collected: collectedItems.find(c => c.id === item.id)?.collected || false,
          }}
          position={[
            Math.cos((index / collectibleItems.length) * Math.PI * 2) * 4,
            0.6,
            Math.sin((index / collectibleItems.length) * Math.PI * 2) * 4,
          ]}
          rotation={[0, -(index / collectibleItems.length) * Math.PI * 2, 0]}
          onCollect={handleCollect}
        />
      ))}
    </>
  );
}

interface RoamingSceneProps {
  onBack?: () => void;
}

export function RoamingScene({ onBack }: RoamingSceneProps) {
  const { setPhase, viewMode, toggleViewMode, endStation } = useStore();

  const handleBack = () => {
    setPhase('transition');
    onBack?.();
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden font-sans">
      {/* 3D Canvas */}
      <Canvas shadows className="bg-slate-900">
        <Suspense fallback={null}>
          <RoamingContent />
        </Suspense>
      </Canvas>

      {/* 左侧：环境控制面板 */}
      <ControlPanel />

      {/* 顶部标题 */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
        <h2 className="text-3xl font-bold text-white tracking-[0.2em] mb-1 font-serif drop-shadow-md">
          {endStation?.name || '民居漫游'}
        </h2>
        <div className="flex items-center justify-center gap-2 text-cyan-400 text-sm font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>{endStation?.buildingGene || 'ARCHITECTURAL EXPLORATION'}</span>
        </div>
      </div>

      {/* 底部导航区域 */}
      <div className="absolute bottom-10 left-10 z-20 flex gap-4">
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-black/40 hover:bg-black/60 backdrop-blur-md
                       border border-white/10 hover:border-white/30 rounded-full 
                       text-white text-sm transition-all flex items-center gap-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            BACK TO MAP
          </button>
          
          <button
            onClick={toggleViewMode}
            className="px-6 py-3 bg-black/40 hover:bg-black/60 backdrop-blur-md
                       border border-cyan-500/20 hover:border-cyan-500/50 rounded-full 
                       text-cyan-400 text-sm transition-all"
          >
            {viewMode === 'tourist' ? '🎯 TOURIST VIEW' : '🌍 GOD VIEW'}
          </button>
      </div>

      {/* 右侧：小地图与图谱 (Replacing MiniMap with just a placeholder/dock) */}
      <div className="absolute top-6 right-6 z-10 w-64 space-y-4">
        {/* Mininav */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4">
           <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Navigation</div>
           <div className="h-32 rounded-lg bg-slate-800/50 flex items-center justify-center border border-white/5">
                <span className="text-xs text-slate-500">MINIMAP ONLINE</span>
           </div>
        </div>
      </div>

      {/* 图谱收集 Dock - Centered Bottom */}
      <div className="absolute bottom-10 right-10 z-20">
         {/* <CollectionDock /> - Keeping it if it works, usually bottom centered */}
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl z-20">
         <CollectionDock /> 
      </div>
    </div>
  );
}
