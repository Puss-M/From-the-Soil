'use client';

import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float, Text } from '@react-three/drei';
import { TerrainMesh } from './TerrainMesh';
import { stations } from '@/data/stations';
import { Station } from '@/types';
import { useStore } from '@/store/useStore';
import * as THREE from 'three';

// Simplified Station Node (inline to avoid import issues)
function SimpleStation({ 
  station, 
  isSelected, 
  onClick 
}: { 
  station: Station; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  const color = isSelected ? '#22d3ee' : '#4a7c59';
  
  return (
    <group position={station.position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* Base */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.4, 6]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      
      {/* Building */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.4, 0.6, 0.4]} />
        <meshStandardMaterial color={color} emissive={isSelected ? color : '#000'} emissiveIntensity={isSelected ? 0.5 : 0} />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 1.1, 0]}>
        <coneGeometry args={[0.35, 0.4, 4]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, 1.6, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        {station.name}
      </Text>
    </group>
  );
}

export function MapScene({ onStartJourney }: { onStartJourney?: () => void }) {
  const { startStation, endStation, setRoute, setPhase } = useStore();
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

  const handleStationClick = useCallback((station: Station) => {
    if (!startStation) {
      setRoute(station, null as unknown as Station);
    } else if (!endStation) {
      setRoute(startStation, station);
    } else {
      setRoute(station, null as unknown as Station);
    }
  }, [startStation, endStation, setRoute]);

  const handleStartJourney = () => {
    if (startStation && endStation) {
      setPhase('transition');
      onStartJourney?.();
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 15, 20], fov: 45 }}>
        {/* Background */}
        <color attach="background" args={['#0a1628']} />
        <fog attach="fog" args={['#0a1628', 20, 60]} />
        
        {/* Controls */}
        <OrbitControls 
          minDistance={10}
          maxDistance={40}
          maxPolarAngle={Math.PI / 2.1}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} color="#4a6fa5" />
        <directionalLight 
          position={[15, 20, 10]} 
          intensity={1.5}
          color="#F5E6CA" 
          castShadow
        />
        <spotLight 
          position={[-20, 10, -10]} 
          intensity={2} 
          color="#22D3EE"
          angle={0.5}
          penumbra={1}
        />
        
        {/* Stars */}
        <Stars radius={80} depth={30} count={1500} factor={3} fade speed={0.5} />

        {/* Terrain */}
        <TerrainMesh size={30} resolution={128} />

        {/* Stations */}
        {stations.map((station) => (
          <Float key={station.id} speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
            <SimpleStation
              station={station}
              isSelected={startStation?.id === station.id || endStation?.id === station.id}
              onClick={() => handleStationClick(station)}
            />
          </Float>
        ))}

        {/* Route Line */}
        {startStation && endStation && (
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  ...startStation.position,
                  ...endStation.position
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#22d3ee" linewidth={2} />
          </line>
        )}
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
              <div className="w-3 h-3 rounded bg-[#112F41]" />
              <span className="text-slate-300">水域</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-[#407D5C]" />
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
