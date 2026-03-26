'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Text, Html, Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';
import { Station } from '@/types';
import { calculateMutationIndex, getCrossedClimateBoundaries } from '@/data/stations';

interface RouteVisualizerProps {
  startStation: Station | null;
  endStation: Station | null;
  progress?: number; // 0-1 for animation
}

const PARTICLE_COUNT = 8;

export function RouteVisualizer({ startStation, endStation }: RouteVisualizerProps) {
  const particlesRef = useRef<THREE.Group>(null);

  // Bezier Curve
  const { curve, points, midPoint } = useMemo(() => {
    if (!startStation || !endStation) {
      return { curve: null, points: [], midPoint: null };
    }

    const start = new THREE.Vector3(...startStation.position);
    const end = new THREE.Vector3(...endStation.position);
    
    // Control Point
    const mid = start.clone().lerp(end, 0.5);
    mid.y += Math.max(1, start.distanceTo(end) * 0.4);

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(50);

    return { curve, points, midPoint: mid };
  }, [startStation, endStation]);

  // Animate Particles
  useFrame((state) => {
    if (particlesRef.current && curve) {
      const t = state.clock.elapsedTime;
      particlesRef.current.children.forEach((child, i) => {
        // Staggered motion
        const offset = i / PARTICLE_COUNT;
        const tt = (t * 0.5 + offset) % 1; // Loop 0-1
        const pos = curve.getPoint(tt);
        child.position.copy(pos);
        
        // Scale based on position (fade in/out at ends)
        const scale = Math.sin(tt * Math.PI) * 1.5; // Bubble up in middle
        child.scale.setScalar(scale);
      });
    }
  });

  if (!startStation || !endStation || !curve) return null;

  const mutationIndex = calculateMutationIndex(startStation, endStation);
  const boundaries = getCrossedClimateBoundaries(startStation, endStation);

  // Color based on mutation
  const pathColor = mutationIndex > 50 ? '#ef4444' : mutationIndex > 30 ? '#f59e0b' : '#22d3ee';

  return (
    <group>
      {/* Glow Line */}
      <Line
        points={points}
        color={pathColor}
        lineWidth={4}
        transparent
        opacity={0.6}
        toneMapped={false}
      />
      
      {/* Core Line */}
      <Line
        points={points}
        color="#ffffff"
        lineWidth={1}
        transparent
        opacity={0.8}
        dashed
        dashSize={0.2}
        gapSize={0.1}
      />

      {/* Floating Particles */}
      <group ref={particlesRef}>
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
            <mesh key={i}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>
        ))}
      </group>

      {/* Midpoint Info (Glassmorphism) */}
      {midPoint && (
        <Html position={[midPoint.x, midPoint.y + 0.5, midPoint.z]} center>
          <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-lg p-3 min-w-[200px] pointer-events-none transform -translate-y-full shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs font-serif">GENETIC DRIFT</span>
              <span 
                className="font-mono font-bold text-lg"
                style={{ color: pathColor, textShadow: `0 0 10px ${pathColor}` }}
              >
                {mutationIndex}%
              </span>
            </div>
            
            <div className="h-px bg-white/10 mb-2" />

            {/* Boundaries */}
             {boundaries.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {boundaries.map((boundary, i) => (
                  <span 
                    key={i} 
                    className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30"
                  >
                    {boundary}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Html>
      )}

      {/* Pulse Rings at Endpoints */}
      <mesh position={startStation.position} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.4, 0.45, 32]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.4} />
      </mesh>
      
      <mesh position={endStation.position} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.4, 0.45, 32]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
