'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

// 使用种子生成确定性伪随机数（解决 React compiler 纯函数约束）
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// 预计算粒子数据（模块级别，在组件外部，不受 React 纯函数规则约束）
const RAIN_PARTICLES = Array.from({ length: 1000 }).map((_, i) => ({
  position: [
    (seededRandom(i * 3) - 0.5) * 20,
    seededRandom(i * 3 + 1) * 10,
    (seededRandom(i * 3 + 2) - 0.5) * 20,
  ] as [number, number, number],
  speed: 0.5 + seededRandom(i * 7) * 0.5,
}));

const DUST_PARTICLES = Array.from({ length: 200 }).map((_, i) => ({
  position: [
    (seededRandom(i * 5 + 1000) - 0.5) * 20,
    seededRandom(i * 5 + 1001) * 8,
    (seededRandom(i * 5 + 1002) - 0.5) * 20,
  ] as [number, number, number],
  factor: seededRandom(i * 11 + 2000),
  speed: 0.01 + seededRandom(i * 13 + 3000) * 0.02,
}));

export function ClimateEffects() {
  const { currentClimate } = useStore();
  const { rainfall } = currentClimate;

  const isRain = rainfall > 500;
  const count = isRain ? Math.min(1000, Math.floor(rainfall * 2)) : 200;

  return (
    <group>
      {isRain ? (
        <RainSystem count={count} />
      ) : (
        <DustSystem count={count} />
      )}
    </group>
  );
}

function RainSystem({ count }: { count: number }) {
  return (
    <Instances range={count}>
      <cylinderGeometry args={[0.01, 0.01, 0.5]} />
      <meshBasicMaterial color="#a5f3fc" transparent opacity={0.4} />
      {RAIN_PARTICLES.slice(0, count).map((data, i) => (
        <RainDrop key={i} data={data} />
      ))}
    </Instances>
  );
}

function RainDrop({ data }: { data: { position: [number, number, number]; speed: number } }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.position.y -= data.speed * 10 * delta;
    if (ref.current.position.y < 0) {
      ref.current.position.y = 10;
    }
  });

  return (
    <group ref={ref} position={data.position}>
      <Instance />
    </group>
  );
}

function DustSystem({ count }: { count: number }) {
  return (
    <Instances range={count}>
      <dodecahedronGeometry args={[0.03, 0]} />
      <meshBasicMaterial color="#fbbf24" transparent opacity={0.4} />
      {DUST_PARTICLES.slice(0, count).map((data, i) => (
        <DustMolecule key={i} data={data} />
      ))}
    </Instances>
  );
}

interface DustData {
  position: [number, number, number];
  factor: number;
  speed: number;
}

function DustMolecule({ data }: { data: DustData }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * data.speed;
    ref.current.position.y += Math.sin(t) * 0.002;
    ref.current.position.x += Math.cos(t * data.factor) * 0.002;
    ref.current.rotation.x = t;
    ref.current.rotation.y = t * 0.5;
  });

  return (
    <group ref={ref} position={data.position}>
      <Instance />
    </group>
  );
}
