'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Station } from '@/types';
import { calculateMutationIndex, getCrossedClimateBoundaries } from '@/data/stations';

interface RouteVisualizerProps {
  startStation: Station | null;
  endStation: Station | null;
  progress?: number; // 0-1 for animation
}

export function RouteVisualizer({ startStation, endStation, progress = 0 }: RouteVisualizerProps) {
  const particleRef = useRef<THREE.Mesh>(null);

  // 计算贝塞尔曲线路径
  const { curve, points, midPoint } = useMemo(() => {
    if (!startStation || !endStation) {
      return { curve: null, points: [], midPoint: null };
    }

    const start = new THREE.Vector3(...startStation.position);
    const end = new THREE.Vector3(...endStation.position);
    
    // 控制点 - 抬高形成弧线
    const mid = start.clone().lerp(end, 0.5);
    mid.y += Math.max(1, start.distanceTo(end) * 0.3);

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(50);

    return { curve, points, midPoint: mid };
  }, [startStation, endStation]);

  // 粒子沿路径移动动画
  useFrame((state) => {
    if (particleRef.current && curve) {
      const t = (Math.sin(state.clock.elapsedTime * 0.5) + 1) / 2;
      const pos = curve.getPoint(t);
      particleRef.current.position.copy(pos);
    }
  });

  if (!startStation || !endStation || !curve) return null;

  const mutationIndex = calculateMutationIndex(startStation, endStation);
  const boundaries = getCrossedClimateBoundaries(startStation, endStation);

  // 路径颜色根据突变度
  const pathColor = mutationIndex > 50 ? '#ef4444' : mutationIndex > 30 ? '#f59e0b' : '#22d3ee';

  return (
    <group>
      {/* 路径线 - 渐变发光 */}
      <Line
        points={points}
        color={pathColor}
        lineWidth={3}
        transparent
        opacity={0.8}
      />

      {/* 路径虚线边缘 */}
      <Line
        points={points}
        color="#ffffff"
        lineWidth={1}
        transparent
        opacity={0.3}
        dashed
        dashSize={0.1}
        gapSize={0.1}
      />

      {/* 移动粒子 */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>

      {/* 中点信息标签 */}
      {midPoint && (
        <Html position={[midPoint.x, midPoint.y + 0.3, midPoint.z]} center>
          <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 min-w-56 pointer-events-none transform -translate-y-full">
            {/* 突变度 */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs">基因突变度</span>
              <span 
                className="font-mono font-bold text-lg"
                style={{ color: pathColor }}
              >
                {mutationIndex}%
              </span>
            </div>

            {/* 距离 */}
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="text-slate-400">路径距离</span>
              <span className="text-white">
                {(new THREE.Vector3(...startStation.position).distanceTo(
                  new THREE.Vector3(...endStation.position)
                ) * 200).toFixed(0)} km
              </span>
            </div>

            {/* 气候带跨越提示 */}
            {boundaries.length > 0 && (
              <div className="border-t border-white/10 pt-2 mt-2">
                {boundaries.map((boundary, i) => (
                  <div 
                    key={i} 
                    className="text-xs text-amber-400 flex items-start gap-1 mb-1"
                  >
                    <span>⚠️</span>
                    <span>{boundary}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Html>
      )}

      {/* 起点标记 */}
      <mesh position={startStation.position}>
        <ringGeometry args={[0.3, 0.4, 32]} />
        <meshBasicMaterial color="#22d3ee" side={THREE.DoubleSide} transparent opacity={0.5} />
      </mesh>
      <Text
        position={[startStation.position[0], startStation.position[1] - 0.5, startStation.position[2]]}
        fontSize={0.12}
        color="#22d3ee"
        anchorX="center"
      >
        起点
      </Text>

      {/* 终点标记 */}
      <mesh position={endStation.position}>
        <ringGeometry args={[0.3, 0.4, 32]} />
        <meshBasicMaterial color="#f59e0b" side={THREE.DoubleSide} transparent opacity={0.5} />
      </mesh>
      <Text
        position={[endStation.position[0], endStation.position[1] - 0.5, endStation.position[2]]}
        fontSize={0.12}
        color="#f59e0b"
        anchorX="center"
      >
        终点
      </Text>
    </group>
  );
}
