'use client';

import { Suspense, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
  useGLTF,
  Html,
  Float,
} from '@react-three/drei';
import * as THREE from 'three';
import type { Station } from '@/types';

/* ── 单个 GLB 模型加载组件 ──────────────────────── */
function GLBModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
          mat.transparent = false;
          mat.opacity = 1;
          mat.needsUpdate = true;
        });
      }
    });
  }, [clonedScene]);

  return <primitive object={clonedScene} castShadow receiveShadow />;
}

/* ── 自动旋转展台 ─────────────────────────────── */
function Turntable({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}

/* ── 加载状态 ──────────────────────────────────── */
function LoadingFallback() {
  return (
    <Html center>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        color: '#8b7355', fontFamily: 'var(--font-serif, serif)',
      }}>
        <div style={{
          width: 40, height: 40, border: '3px solid #d4c5b0',
          borderTopColor: '#8b7355', borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <span style={{ fontSize: 14, letterSpacing: 2 }}>模型加载中…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Html>
  );
}

/* ── 主组件 ────────────────────────────────────── */
interface ModelViewerProps {
  station: Station;
}

export function ModelViewer({ station }: ModelViewerProps) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* 3D 画布 */}
      <Canvas
        shadows
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(160deg, #f5f0eb 0%, #ebe4db 40%, #e8e0d4 100%)',
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <PerspectiveCamera makeDefault position={[35, 25, 35]} fov={45} />
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            enableDamping
            dampingFactor={0.08}
            minDistance={2}
            maxDistance={60}
            target={[0, 1, 0]}
            autoRotate
            autoRotateSpeed={0.5}
          />
          <ambientLight intensity={0.7} color="#faf5ef" />
          <directionalLight
            position={[8, 12, 8]}
            intensity={1.4}
            castShadow
            color="#fff7ed"
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.4} color="#d4a574" />
          <Environment preset="apartment" blur={0.8} />
          <ContactShadows
            position={[0, -0.01, 0]}
            opacity={0.5}
            scale={20}
            blur={2.5}
            far={5}
            color="#8b7355"
          />
          {/* 地台 */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
            <circleGeometry args={[6, 64]} />
            <meshStandardMaterial color="#c8b89a" roughness={0.95} />
          </mesh>
          {/* 模型 */}
          <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
            <group scale={[0.15, 0.15, 0.15]}>
              <GLBModel url={station.modelPath} />
            </group>
          </Float>
        </Suspense>
      </Canvas>

      {/* 底部悬浮：交互提示 */}
      <div style={{
        position: 'absolute', bottom: 16, right: 16,
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(8px)',
        padding: '6px 14px',
        borderRadius: 20,
        display: 'flex', gap: 12, fontSize: 11, color: '#5c4a3a',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        border: '1px solid rgba(255,255,255,0.4)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 14 }}>🖱️</span> 拖拽旋转
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 14 }}>🔍</span> 滚轮缩放
        </span>
      </div>
    </div>
  );
}
