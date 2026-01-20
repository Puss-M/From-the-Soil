'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Grid } from '@react-three/drei';
import { MorphingHouse } from '@/components/MorphingHouse';
import { InteractiveElement } from './InteractiveElement';
import { CollectionDock } from '@/components/ui/CollectionDock';
import { useStore } from '@/store/useStore';
import { CollectionItem } from '@/types';

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

      {/* 灯光 */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 15, 10]} intensity={1} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.3} color="#00ffff" />

      {/* 环境 */}
      <Environment preset="city" />

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
        opacity={0.4}
        scale={20}
        blur={2}
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
    <div className="relative w-full h-full bg-slate-900">
      {/* 3D Canvas */}
      <Canvas shadows className="bg-slate-900">
        <Suspense fallback={null}>
          <RoamingContent />
        </Suspense>
      </Canvas>

      {/* 标题 */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 text-center">
        <h2 className="text-2xl font-bold text-white tracking-wider mb-1">
          民居漫游
        </h2>
        <p className="text-cyan-400 text-sm">
          {endStation?.name || '目的地'} · {endStation?.buildingGene || '探索中'}
        </p>
      </div>

      {/* 返回按钮 */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 z-10 px-4 py-2 bg-black/50 hover:bg-black/70 
                   border border-white/20 rounded-lg text-white text-sm transition-colors"
      >
        ← 返回旅途
      </button>

      {/* 视角切换 */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={toggleViewMode}
          className="px-4 py-2 bg-black/50 hover:bg-black/70 
                     border border-white/20 rounded-lg text-white text-sm transition-colors"
        >
          {viewMode === 'tourist' ? '🎯 游客视角' : '🌍 上帝视角'}
        </button>
      </div>

      {/* 小地图占位 */}
      <div className="absolute top-20 right-6 z-10 w-32 h-32">
        <div className="bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg 
                        w-full h-full flex items-center justify-center">
          <span className="text-xs text-slate-400">小地图</span>
        </div>
      </div>

      {/* 操作提示 */}
      <div className="absolute left-6 bottom-24 z-10">
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-2">操作说明</div>
          <div className="text-xs text-slate-300 space-y-1">
            <div>• 点击发光构件查看详情</div>
            <div>• 拖拽旋转视角</div>
            <div>• 滚轮缩放</div>
          </div>
        </div>
      </div>

      {/* 图谱收集 Dock */}
      <CollectionDock />
    </div>
  );
}
