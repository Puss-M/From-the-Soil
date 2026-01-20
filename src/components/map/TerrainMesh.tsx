'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TerrainMeshProps {
  size?: number;
  resolution?: number;
}

export function TerrainMesh({ size = 20, resolution = 64 }: TerrainMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // 生成高度图
  const { geometry, colorAttribute } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, resolution, resolution);
    geo.rotateX(-Math.PI / 2);

    const positions = geo.attributes.position;
    const colors: number[] = [];

    // 青绿山水配色
    const waterColor = new THREE.Color('#2D5A4A');  // 深青
    const lowlandColor = new THREE.Color('#4A7C59'); // 青绿
    const hillColor = new THREE.Color('#8FB996');    // 浅绿
    const mountainColor = new THREE.Color('#C4A484'); // 土黄

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);

      // 使用多层噪声生成地形
      const noise1 = Math.sin(x * 0.3) * Math.cos(z * 0.3) * 0.5;
      const noise2 = Math.sin(x * 0.8 + 1) * Math.cos(z * 0.6 + 2) * 0.3;
      const noise3 = Math.sin(x * 1.5 + 3) * Math.cos(z * 1.2 + 1) * 0.15;
      
      // 东南低、西北高的整体趋势
      const trend = (x + z) * 0.05;
      
      let height = noise1 + noise2 + noise3 + trend;
      
      // 边缘压低
      const edgeDist = Math.min(
        Math.abs(x) / (size / 2),
        Math.abs(z) / (size / 2)
      );
      height *= 1 - Math.pow(edgeDist, 3);
      
      positions.setY(i, height);

      // 根据高度着色
      let color: THREE.Color;
      if (height < -0.2) {
        color = waterColor;
      } else if (height < 0.3) {
        color = lowlandColor.clone().lerp(hillColor, (height + 0.2) / 0.5);
      } else if (height < 1) {
        color = hillColor.clone().lerp(mountainColor, (height - 0.3) / 0.7);
      } else {
        color = mountainColor;
      }

      colors.push(color.r, color.g, color.b);
    }

    geo.computeVertexNormals();
    
    const colorAttr = new THREE.Float32BufferAttribute(colors, 3);
    geo.setAttribute('color', colorAttr);

    return { geometry: geo, colorAttribute: colorAttr };
  }, [size, resolution]);

  // 微妙的水波动画
  useFrame((state) => {
    if (meshRef.current) {
      const positions = geometry.attributes.position;
      const time = state.clock.elapsedTime;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        const baseY = positions.getY(i);
        
        // 只对低洼地区（水域）添加波动
        if (baseY < 0) {
          const wave = Math.sin(x * 2 + time) * Math.cos(z * 2 + time * 0.7) * 0.02;
          positions.setY(i, baseY + wave);
        }
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow>
      <meshStandardMaterial
        vertexColors
        side={THREE.DoubleSide}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

// 地形网格线
export function TerrainGrid() {
  return (
    <group position={[0, 0.01, 0]}>
      <gridHelper 
        args={[20, 40, '#1e3a5f', '#0f172a']} 
      />
    </group>
  );
}
