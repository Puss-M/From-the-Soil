'use client';

import { Suspense, useState, useCallback, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars, Float } from '@react-three/drei';
import { StationNode } from './StationNode';
import { RouteVisualizer } from './RouteVisualizer';
import { TerrainMesh } from './TerrainMesh';
import { stations } from '@/data/stations';
import { Station } from '@/types';
import { useStore } from '@/store/useStore';
import * as THREE from 'three';

function MapContent() {
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const { startStation, endStation, setRoute } = useStore();

  const handleStationClick = useCallback((station: Station) => {
    if (!startStation) {
      setRoute(station, null as unknown as Station);
    } else if (!endStation) {
      setRoute(startStation, station);
    } else {
      setRoute(station, null as unknown as Station);
    }
  }, [startStation, endStation, setRoute]);

  // Rotate camera slowly
  const controlsRef = useRef<any>(null);
  
  return (
    <>
      {/* Background & Atmosphere */}
      <color attach="background" args={['#05121b']} />
      <fog attach="fog" args={['#05121b', 10, 50]} />

      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 15, 18]} fov={45} />
      
      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 0, 0]}
      />

      {/* Lighting - Dramatic "Stage" Lighting */}
      <ambientLight intensity={0.2} color="#112F41" /> {/* Deep Cool Ambient */}
      
      {/* Warm Key Light (Sun/Life) */}
      <directionalLight 
        position={[15, 20, 10]} 
        intensity={1.5}
        color="#F5E6CA" 
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* Cool Rim Light (Moon/Tech) */}
      <spotLight 
        position={[-20, 10, -10]} 
        intensity={2} 
        color="#22D3EE"
        angle={0.5}
        penumbra={1}
      />

      {/* Top Fill */}
      <pointLight position={[0, 20, 0]} intensity={0.5} color="#e0f2fe" />

      {/* Environment */}
      <Environment preset="city" blur={0.8} background={false} />
      
      {/* Dynamic Stars (Simple implementation for now) */}
      <Stars radius={80} depth={20} count={2000} factor={3} saturation={0} fade speed={0.5} />

      {/* Terrain */}
      <TerrainMesh size={30} resolution={128} />

      {/* Stations */}
      {stations.map((station) => (
        <Float key={station.id} speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <StationNode
              station={station}
              isSelected={startStation?.id === station.id || endStation?.id === station.id}
              isHovered={hoveredStation === station.id}
              onClick={() => handleStationClick(station)}
              onHover={(hovered) => setHoveredStation(hovered ? station.id : null)}
            />
        </Float>
      ))}

      {/* Route */}
      <RouteVisualizer 
        startStation={startStation} 
        endStation={endStation} 
      />
    </>
  );
}

interface MapSceneProps {
  onStartJourney?: () => void;
}

export function MapScene({ onStartJourney }: MapSceneProps) {
  const { startStation, endStation, setPhase } = useStore();

  const handleStartJourney = () => {
    if (startStation && endStation) {
      setPhase('transition');
      onStartJourney?.();
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* 3D Canvas */}
      <Canvas shadows className="bg-slate-900">
        <Suspense fallback={null}>
          <MapContent />
        </Suspense>
      </Canvas>

      {/* 标题 */}
      <div className="absolute top-6 left-6 z-10">
        <h1 className="text-3xl font-bold text-white tracking-wider mb-1">
          千里江山
        </h1>
        <p className="text-cyan-400 text-sm">数据舆图 · Data Map</p>
      </div>

      {/* 选择状态面板 */}
      <div className="absolute top-6 right-6 z-10 w-72">
        <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase tracking-widest mb-3">
            路线规划
          </div>

          {/* 起点 */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
            <div>
              <div className="text-xs text-slate-500">起点</div>
              <div className="text-white">
                {startStation ? startStation.name : '点击选择驿站'}
              </div>
            </div>
          </div>

          {/* 连线 */}
          <div className="border-l-2 border-dashed border-slate-600 h-4 ml-1.5" />

          {/* 终点 */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
            <div>
              <div className="text-xs text-slate-500">终点</div>
              <div className="text-white">
                {endStation ? endStation.name : '点击选择驿站'}
              </div>
            </div>
          </div>

          {/* 出发按钮 */}
          <button
            onClick={handleStartJourney}
            disabled={!startStation || !endStation}
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              startStation && endStation
                ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {startStation && endStation ? '🚀 启程' : '请选择起点和终点'}
          </button>
        </div>
      </div>

      {/* 图例 */}
      <div className="absolute bottom-6 left-6 z-10">
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-2">地形图例</div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-[#2D5A4A]" />
              <span className="text-slate-300">水域</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-[#4A7C59]" />
              <span className="text-slate-300">平原</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-[#8FB996]" />
              <span className="text-slate-300">丘陵</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-[#C4A484]" />
              <span className="text-slate-300">高原</span>
            </div>
          </div>
        </div>
      </div>

      {/* 操作提示 */}
      <div className="absolute bottom-6 right-6 z-10">
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2">
          <div className="text-xs text-slate-400">
            点击驿站选择路线 | 拖拽旋转地图 | 滚轮缩放
          </div>
        </div>
      </div>
    </div>
  );
}
