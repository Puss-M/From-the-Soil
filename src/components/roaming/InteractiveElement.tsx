'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { CollectionItem } from '@/types';

interface InteractiveElementProps {
  item: CollectionItem;
  position: [number, number, number];
  rotation?: [number, number, number];
  onCollect: (itemId: string) => void;
}

export function InteractiveElement({ 
  item, 
  position, 
  rotation = [0, 0, 0],
  onCollect 
}: InteractiveElementProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  // 发光脉冲动画
  useFrame((state) => {
    if (meshRef.current && !item.collected) {
      const t = state.clock.elapsedTime;
      const intensity = 0.3 + Math.sin(t * 3) * 0.2;
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = isHovered ? 0.8 : intensity;
    }
  });

  const handleClick = () => {
    if (!item.collected) {
      setShowDetail(true);
    }
  };

  const handleCollect = () => {
    onCollect(item.id);
    setShowDetail(false);
  };

  return (
    <group position={position} rotation={rotation}>
      {/* 构件模型 - 简化为基础几何体 */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        {item.category === '装饰构件' && (
          <boxGeometry args={[0.8, 1.2, 0.1]} />
        )}
        {item.category === '结构构件' && (
          <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
        )}
        {item.category === '功能构件' && (
          <boxGeometry args={[1, 0.6, 0.8]} />
        )}
        <meshStandardMaterial
          color={item.collected ? '#4a5568' : '#f5f5f5'}
          emissive={item.collected ? '#000000' : '#00ffff'}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* 发光边框 */}
      {!item.collected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.82, 1.22, 0.12)]} />
          <lineBasicMaterial 
            color={isHovered ? '#00ffff' : '#0ea5e9'} 
            transparent 
            opacity={isHovered ? 1 : 0.5} 
          />
        </lineSegments>
      )}

      {/* 悬停提示 */}
      {isHovered && !showDetail && !item.collected && (
        <Html position={[0, 0.8, 0]} center>
          <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/50 
                          rounded-lg px-3 py-2 pointer-events-none whitespace-nowrap">
            <div className="text-cyan-400 text-sm font-medium">{item.name}</div>
            <div className="text-xs text-slate-400">点击查看详情</div>
          </div>
        </Html>
      )}

      {/* 已收集标记 */}
      {item.collected && (
        <Html position={[0, 0.6, 0]} center>
          <div className="text-green-400 text-lg">✓</div>
        </Html>
      )}

      {/* 详情面板 */}
      {showDetail && (
        <Html position={[1.5, 0, 0]} center>
          <div className="bg-black/90 backdrop-blur-md border border-cyan-500/30 
                          rounded-xl p-4 w-72 pointer-events-auto">
            {/* 标题 */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white">{item.name}</h3>
              <button 
                onClick={() => setShowDetail(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* 分类 */}
            <div className="text-xs text-cyan-400 mb-2">{item.category}</div>

            {/* 描述 */}
            <p className="text-sm text-slate-300 mb-4">{item.description}</p>

            {/* 雷达图 - 简化为条形图 */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">隐私保护</span>
                <div className="flex-1 mx-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500"
                    style={{ width: `${item.attributes.privacy * 10}%` }}
                  />
                </div>
                <span className="text-cyan-400 w-6">{item.attributes.privacy}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">风水功能</span>
                <div className="flex-1 mx-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500"
                    style={{ width: `${item.attributes.fengshui * 10}%` }}
                  />
                </div>
                <span className="text-yellow-400 w-6">{item.attributes.fengshui}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">造价成本</span>
                <div className="flex-1 mx-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500"
                    style={{ width: `${item.attributes.cost * 10}%` }}
                  />
                </div>
                <span className="text-red-400 w-6">{item.attributes.cost}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">美学价值</span>
                <div className="flex-1 mx-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500"
                    style={{ width: `${item.attributes.aesthetic * 10}%` }}
                  />
                </div>
                <span className="text-purple-400 w-6">{item.attributes.aesthetic}</span>
              </div>
            </div>

            {/* 收集按钮 */}
            <button
              onClick={handleCollect}
              className="w-full py-2 bg-linear-to-r from-cyan-500 to-blue-500 
                         hover:from-cyan-400 hover:to-blue-400
                         rounded-lg text-white text-sm font-medium transition-all"
            >
              📥 收入图谱
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}
