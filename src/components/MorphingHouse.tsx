'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial, Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

interface MorphingHouseProps {
  position?: [number, number, number];
}

// 辅助组件：加载并显示单个 GLB 模型
function GLBModel({
  url,
  opacity = 1,
  visible = true,
}: {
  url: string;
  opacity?: number;
  visible?: boolean;
}) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // 设置模型所有材质的透明度
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach((mat) => {
          mat.transparent = true;
          mat.opacity = opacity;
          mat.needsUpdate = true;
        });
      }
    });
  }, [clonedScene, opacity]);

  // 平滑过渡透明度
  useFrame(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach((mat) => {
          mat.opacity = THREE.MathUtils.lerp(mat.opacity, opacity, 0.1);
        });
      }
    });
  });

  if (!visible) return null;

  return (
    <primitive
      object={clonedScene}
      castShadow
      receiveShadow
    />
  );
}

export function MorphingHouse({ position = [0, 0, 0] }: MorphingHouseProps) {
  const groupRef = useRef<THREE.Group>(null);
  const {
    currentClimate,
    startStation,
    endStation,
    transitionProgress,
    phase,
  } = useStore();

  // 确定要显示的模型路径
  const startModelPath = startStation?.modelPath || null;
  const endModelPath = endStation?.modelPath || null;

  // 在过场阶段，两个模型做交叉渐变；其他阶段只显示终点模型
  const showStartModel = phase === 'transition' && startModelPath;
  const showEndModel = !!endModelPath;

  const startOpacity = phase === 'transition' ? 1 - transitionProgress : 0;
  const endOpacity = phase === 'transition' ? transitionProgress : 1;

  return (
    <group ref={groupRef} position={position}>
      {/* 
         地面环境：降雨量 > 800mm 显示水面倒影（江南风格），
         否则显示干燥土地（北方风格）。
         保留原有逻辑不做改动。
      */}
      {currentClimate.rainfall > 800 ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
            <circleGeometry args={[8, 64]} />
            <MeshReflectorMaterial
                blur={[300, 100]}
                resolution={1024}
                mixBlur={1}
                mixStrength={40}
                roughness={0.1}
                depthScale={1.2}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color="#203040"
                metalness={0.5}
                mirror={0}
            />
        </mesh>
      ) : (
         <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
            <circleGeometry args={[8, 64]} />
            <meshStandardMaterial 
                color="#5d5045" 
                roughness={0.9} 
            />
        </mesh>
      )}

      {/* 浮动动画包裹 — scale 缩放模型到合适大小 */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2} floatingRange={[0, 0.2]}>
        <group scale={[0.15, 0.15, 0.15]}>
          {/* 起点建筑模型（过场阶段渐隐） */}
          {showStartModel && startModelPath && (
            <GLBModel
              url={startModelPath}
              opacity={startOpacity}
              visible={startOpacity > 0.01}
            />
          )}

          {/* 终点建筑模型（过场阶段渐显，漫游阶段完全显示） */}
          {showEndModel && endModelPath && (
            <GLBModel
              url={endModelPath}
              opacity={endOpacity}
              visible={endOpacity > 0.01}
            />
          )}

          {/* 如果没有选择任何驿站（直接控制模式），显示默认提示 */}
          {!startModelPath && !endModelPath && (
            <mesh position={[0, 1, 0]}>
              <boxGeometry args={[2, 2, 2]} />
              <meshStandardMaterial
                color="#334155"
                wireframe
                transparent
                opacity={0.3}
              />
            </mesh>
          )}
        </group>
      </Float>
    </group>
  );
}
