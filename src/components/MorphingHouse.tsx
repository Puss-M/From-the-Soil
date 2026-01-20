'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

interface MorphingHouseProps {
  position?: [number, number, number];
}

export function MorphingHouse({ position = [0, 0, 0] }: MorphingHouseProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { currentClimate } = useStore();

  // ============ 算法计算 ============
  const calculations = useMemo(() => {
    const { rainfall, sunlight, defense } = currentClimate;

    // 屋顶坡度算法：rainfall 影响屋顶高度
    // 0mm → 平顶 (0.2), 2000mm → 尖顶 (2.0)
    const roofHeight = 0.2 + (rainfall / 2000) * 1.8;
    const roofPitch = 15 + (rainfall / 2000) * 45; // 角度用于显示

    // 屋檐出挑算法：sunlight 影响出挑深度
    // 低日照 → 短出挑 (0.1), 高日照 → 深出挑 (0.8)
    const eavesOverhang = 0.1 + sunlight * 0.7;

    // 窗户缩放算法：defense 影响窗户大小
    // 低防御 → 大窗 (1.0), 高防御 → 小窗/射击孔 (0.17)
    const windowScale = Math.max(0.17, 1 - defense / 12);

    // 墙体厚度算法：defense 影响墙体厚度
    const wallThickness = 0.3 * (1 + defense / 5);

    return {
      roofHeight,
      roofPitch,
      eavesOverhang,
      windowScale,
      wallThickness,
    };
  }, [currentClimate]);

  // 平滑动画
  const animatedValues = useRef({
    roofHeight: calculations.roofHeight,
    eavesOverhang: calculations.eavesOverhang,
    windowScale: calculations.windowScale,
  });

  useFrame((_, delta) => {
    const speed = 3;
    animatedValues.current.roofHeight = THREE.MathUtils.lerp(
      animatedValues.current.roofHeight,
      calculations.roofHeight,
      delta * speed
    );
    animatedValues.current.eavesOverhang = THREE.MathUtils.lerp(
      animatedValues.current.eavesOverhang,
      calculations.eavesOverhang,
      delta * speed
    );
    animatedValues.current.windowScale = THREE.MathUtils.lerp(
      animatedValues.current.windowScale,
      calculations.windowScale,
      delta * speed
    );
  });

  // ============ 几何体尺寸 ============
  const baseWidth = 4;
  const baseDepth = 3;
  const baseHeight = 2;

  const { roofHeight, eavesOverhang, windowScale } = calculations;

  // 屋顶几何
  const roofGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const halfWidth = baseWidth / 2 + eavesOverhang;
    const halfDepth = baseDepth / 2 + eavesOverhang;

    // 创建屋顶截面 (等腰三角形)
    shape.moveTo(-halfWidth, 0);
    shape.lineTo(halfWidth, 0);
    shape.lineTo(0, roofHeight);
    shape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: halfDepth * 2,
      bevelEnabled: false,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.rotateX(Math.PI / 2);
    geometry.translate(0, 0, -halfDepth);

    return geometry;
  }, [roofHeight, eavesOverhang]);

  // ============ 渲染 ============
  return (
    <group ref={groupRef} position={position}>
      {/* 地基平台 */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[baseWidth + 1, 0.2, baseDepth + 1]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>

      {/* 主体墙壁 */}
      <mesh position={[0, baseHeight / 2, 0]}>
        <boxGeometry args={[baseWidth, baseHeight, baseDepth]} />
        <meshStandardMaterial 
          color="#f5f5f5" 
          wireframe={false}
        />
      </mesh>

      {/* 墙壁边框线 */}
      <lineSegments position={[0, baseHeight / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth)]} />
        <lineBasicMaterial color="#00ffff" linewidth={2} />
      </lineSegments>

      {/* 屋顶 */}
      <mesh position={[0, baseHeight, 0]} geometry={roofGeometry}>
        <meshStandardMaterial color="#2d3748" side={THREE.DoubleSide} />
      </mesh>

      {/* 屋顶边框线 */}
      <lineSegments position={[0, baseHeight, 0]}>
        <edgesGeometry args={[roofGeometry]} />
        <lineBasicMaterial color="#00ffff" linewidth={2} />
      </lineSegments>

      {/* 前窗户 */}
      <mesh position={[0, baseHeight / 2, baseDepth / 2 + 0.01]}>
        <planeGeometry args={[1.2 * windowScale, 1.5 * windowScale]} />
        <meshStandardMaterial color="#1a365d" emissive="#0ea5e9" emissiveIntensity={0.3} />
      </mesh>

      {/* 左侧窗户 */}
      <mesh position={[-baseWidth / 2 - 0.01, baseHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.8 * windowScale, 1 * windowScale]} />
        <meshStandardMaterial color="#1a365d" emissive="#0ea5e9" emissiveIntensity={0.3} />
      </mesh>

      {/* 右侧窗户 */}
      <mesh position={[baseWidth / 2 + 0.01, baseHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.8 * windowScale, 1 * windowScale]} />
        <meshStandardMaterial color="#1a365d" emissive="#0ea5e9" emissiveIntensity={0.3} />
      </mesh>

      {/* 门 */}
      <mesh position={[0, 0.7, baseDepth / 2 + 0.01]}>
        <planeGeometry args={[0.9, 1.4]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
    </group>
  );
}
