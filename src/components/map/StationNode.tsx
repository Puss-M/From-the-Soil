'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Station } from '@/types';

interface StationNodeProps {
  station: Station;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export function StationNode({ 
  station, 
  isSelected, 
  isHovered,
  onClick, 
  onHover 
}: StationNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [localHover, setLocalHover] = useState(false);

  // 悬浮动画
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.position.y = station.position[1] + Math.sin(t * 2 + station.position[0]) * 0.05;
      
      // 选中时发光脉冲
      if (isSelected) {
        const scale = 1 + Math.sin(t * 3) * 0.05;
        groupRef.current.scale.setScalar(scale);
      } else {
        groupRef.current.scale.setScalar(1);
      }
    }
  });

  // 建筑颜色根据气候变化
  const buildingColor = useMemo(() => {
    const rainfall = station.climate.rainfall;
    // 干旱→黄褐色，湿润→青灰色
    const t = rainfall / 2000;
    return new THREE.Color().lerpColors(
      new THREE.Color('#8B7355'), // 干旱土黄
      new THREE.Color('#4A5568'), // 湿润青灰
      t
    );
  }, [station.climate.rainfall]);

  // 屋顶高度根据降雨量
  const roofHeight = 0.15 + (station.climate.rainfall / 2000) * 0.25;

  return (
    <group 
      ref={groupRef} 
      position={station.position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); setLocalHover(true); onHover(true); }}
      onPointerOut={() => { setLocalHover(false); onHover(false); }}
    >
      {/* 微缩建筑模型 */}
      <group scale={0.5}>
        {/* 地基 */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.8, 0.1, 0.6]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>

        {/* 主体 */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.6, 0.5, 0.5]} />
          <meshStandardMaterial 
            color={buildingColor} 
            emissive={isSelected ? '#00ffff' : '#000000'}
            emissiveIntensity={isSelected ? 0.3 : 0}
          />
        </mesh>

        {/* 屋顶 */}
        <mesh position={[0, 0.6 + roofHeight / 2, 0]}>
          <coneGeometry args={[0.5, roofHeight, 4]} />
          <meshStandardMaterial 
            color="#2d3748" 
            emissive={isSelected ? '#0ea5e9' : '#000000'}
            emissiveIntensity={isSelected ? 0.2 : 0}
          />
        </mesh>

        {/* 发光边框 */}
        <lineSegments position={[0, 0.35, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(0.62, 0.52, 0.52)]} />
          <lineBasicMaterial 
            color={isSelected ? '#00ffff' : isHovered ? '#0ea5e9' : '#334155'} 
            linewidth={2} 
          />
        </lineSegments>
      </group>

      {/* 驿站名称 */}
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.15}
        color={isSelected ? '#00ffff' : '#e2e8f0'}
        anchorX="center"
        anchorY="top"
      >
        {station.name}
      </Text>

      {/* 悬停信息面板 */}
      {(localHover || isHovered) && !isSelected && (
        <Html position={[0.8, 0.5, 0]} distanceFactor={10}>
          <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/50 rounded-lg p-3 min-w-48 pointer-events-none">
            <div className="text-cyan-400 font-bold text-sm mb-2">{station.name}</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">降雨量</span>
                <span className="text-white">{station.climate.rainfall}mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">湿度</span>
                <span className="text-white">{station.climate.humidity}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">建筑基因</span>
                <span className="text-cyan-300">{station.buildingGene}</span>
              </div>
            </div>
          </div>
        </Html>
      )}

      {/* 选中光环 */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[0.4, 0.5, 32]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
