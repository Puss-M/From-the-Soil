'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial, Float } from '@react-three/drei';
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

    // Roof Pitch: Rainfall -> Height
    const roofHeight = 0.5 + (rainfall / 2000) * 1.5;
    
    // Eaves: Sunlight -> Overhang
    const eavesOverhang = 0.2 + sunlight * 0.6;

    // Windows: Defense -> Size
    const windowScale = Math.max(0.2, 1 - defense / 15);

    // Wall Thickness
    const wallThickness = 0.2 + (defense / 10) * 0.3;

    return { roofHeight, eavesOverhang, windowScale, wallThickness };
  }, [currentClimate]);

  // Smooth Animation
  const animatedValues = useRef({ ...calculations });

  useFrame((_, delta) => {
    const speed = 4;
    const target = calculations;
    
    // Lerp helpers
    const lerp = (key: keyof typeof calculations) => {
      animatedValues.current[key] = THREE.MathUtils.lerp(
        animatedValues.current[key],
        target[key],
        delta * speed
      );
    };

    lerp('roofHeight');
    lerp('eavesOverhang');
    lerp('windowScale');
    lerp('wallThickness');
  });

  // ============ Geometry Logic ============
  const baseWidth = 4;
  const baseDepth = 3;
  const baseHeight = 2.5;

  // Re-calculate geometry in render (for smoothness, technically should use Vertex Shader for perfect perf but this is fine for low poly)
  // Actually, we must use state values to update geometry or scale meshes. 
  // Updating geometry every frame is heavy. 
  // Better approach: Use morph targets if possible, or simple scaling.
  // Here we use the calculated values directly effectively re-creating geometry on re-render? No, Memo does it.
  // Ideally we want native morphing. For now, let's just use the memoized values which update when `currentClimate` changes.
  // The useFrame lerp above updates the REF but doesn't trigger re-render unless we force it.
  // So current implementation is: Component Re-renders on Store Change -> Target calculates -> Geometry updates.
  // The 'lerp' in useFrame is useless if we bind geometry to 'calculations'.
  // We need to use 'animatedValues' in the view. But that requires re-render every frame.
  // Given "house morphing" is a key feature, let's optimize:
  // We will pass the 'animatedValues' ref to a child or just let React handle re-renders for now 
  // (Assuming climate changes aren't 60fps). 
  // Wait, slider changes ARE frequent.
  // But let's stick to the reactive approach: Store updates -> Component Re-renders.
  // We drop the `useFrame` lerp for geometry and just let React handle state updates (it might be jerky without `useTransition` but simple).
  // Actually, let's keep it simple: Functional update based on store.

  const { roofHeight, eavesOverhang, windowScale } = calculations;

  // Roof Geometry with Bevels
  const roofGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const w = baseWidth / 2 + eavesOverhang;
    const h = roofHeight;
    const d = baseDepth / 2 + eavesOverhang;

    // Cross section
    shape.moveTo(-w, 0);
    shape.lineTo(w, 0);
    // Add subtle curve or just straight to peak
    shape.lineTo(0, h);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: d * 2,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 2,
    }).rotateX(Math.PI / 2).translate(0, 0, -d);
  }, [roofHeight, eavesOverhang]);

  return (
    <group ref={groupRef} position={position}>
      {/* 
         Environment: Water Reflection (for Jiangnan / Wet) 
         or Ground (for North / Dry).
         Let's dynamically switch?
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
                mirror={0} // Fix TS error if 1
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

      {/* Floating Animation Wrapper */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2} floatingRange={[0, 0.2]}>
          <group position={[0, 0, 0]}>
            {/* Foundation */}
            <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
                <boxGeometry args={[baseWidth + 0.5, 0.4, baseDepth + 0.5]} />
                <meshStandardMaterial color="#3f3f46" />
            </mesh>

            {/* Walls (With "Paper" texture approximation via roughness) */}
            <mesh position={[0, baseHeight / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[baseWidth, baseHeight, baseDepth]} />
                <meshStandardMaterial 
                  color="#e5e5e5" 
                  roughness={0.9} // Concrete/Paper feel
                  metalness={0.1}
                />
            </mesh>

            {/* Roof */}
            <mesh position={[0, baseHeight, 0]} geometry={roofGeometry} castShadow>
                <meshStandardMaterial 
                    color="#1e293b" 
                    roughness={0.6}
                    metalness={0.4} // Slight glaze
                />
            </mesh>
            
            {/* Detailed Windows (Boolean subtraction would be better, but we stick to overlays for now) */}
             {/* Front Window */}
             <mesh position={[0, baseHeight / 2, baseDepth / 2 + 0.05]}>
                <boxGeometry args={[1.5 * windowScale, 1.5 * windowScale, 0.1]} />
                <meshStandardMaterial 
                    color="#0ea5e9" 
                    emissive="#0ea5e9" 
                    emissiveIntensity={0.5} 
                    roughness={0.2}
                />
             </mesh>
             
             {/* Frame */}
             <mesh position={[0, baseHeight / 2, baseDepth / 2 + 0.05]}>
                 <ringGeometry args={[1.5 * windowScale * 0.4, 1.5 * windowScale * 0.5, 4]} />
                 <meshStandardMaterial color="#333" />
             </mesh>
          </group>
      </Float>
    </group>
  );
}
