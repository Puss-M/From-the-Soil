'use client';

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
  useGLTF,
  Html,
} from '@react-three/drei';
import * as THREE from 'three';
import type { Station } from '@/types';

/* ── 单个 GLB 模型加载组件 ──────────────────────── */
function GLBModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
          mat.transparent = false;
          mat.opacity = 1;
          mat.needsUpdate = true;
        });
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 6;
    const scaleFactor = maxDim > 0 ? targetSize / maxDim : 1;

    clone.scale.setScalar(scaleFactor);
    clone.position.set(
      -center.x * scaleFactor,
      -box.min.y * scaleFactor,
      -center.z * scaleFactor
    );

    return clone;
  }, [scene]);

  return <primitive object={clonedScene} castShadow receiveShadow />;
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
          <PerspectiveCamera makeDefault position={[10, 8, 10]} fov={45} />
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            enableDamping
            dampingFactor={0.08}
            minDistance={3}
            maxDistance={30}
            target={[0, 2, 0]}
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
            scale={30}
            blur={2.5}
            far={5}
            color="#8b7355"
          />
          {/* 地台 */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
            <circleGeometry args={[8, 64]} />
            <meshStandardMaterial color="#c8b89a" roughness={0.95} />
          </mesh>
          {/* 模型 - 已在 GLBModel 内部自动归一化大小 */}
          <GLBModel url={station.modelPath} />
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
