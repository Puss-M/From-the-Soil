'use client';
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial, Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
interface MorphingHouseProps {
    position?: [
        number,
        number,
        number
    ];
}
function GLBModel({ url, opacity = 1, visible = true, }: {
    url: string;
    opacity?: number;
    visible?: boolean;
}) {
    const { scene } = useGLTF(url);
    const clonedScene = useMemo(() => scene.clone(true), [scene]);
    const materialsRef = useRef<THREE.Material[]>([]);
    const opacityTargetRef = useRef(opacity);
    opacityTargetRef.current = opacity;
    useEffect(() => {
        const mats: THREE.Material[] = [];
        clonedScene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
                const materials = Array.isArray(child.material)
                    ? child.material
                    : [child.material];
                materials.forEach((mat) => {
                    mat.transparent = true;
                    mat.opacity = opacityTargetRef.current;
                    mat.needsUpdate = true;
                    mats.push(mat);
                });
            }
        });
        materialsRef.current = mats;
    }, [clonedScene]);
    useFrame(() => {
        const target = opacityTargetRef.current;
        for (const mat of materialsRef.current) {
            // Three.js materials are external mutable objects updated per frame.
            // eslint-disable-next-line react-hooks/immutability
            mat.opacity = THREE.MathUtils.lerp(mat.opacity, target, 0.1);
        }
    });
    if (!visible)
        return null;
    return (<primitive object={clonedScene} castShadow receiveShadow/>);
}
export function MorphingHouse({ position = [0, 0, 0] }: MorphingHouseProps) {
    const groupRef = useRef<THREE.Group>(null);
    const { currentClimate, startStation, endStation, transitionProgress, phase, } = useStore();
    const startModelPath = startStation?.modelPath || null;
    const endModelPath = endStation?.modelPath || null;
    const showStartModel = phase === 'transition' && startModelPath;
    const showEndModel = !!endModelPath;
    const startOpacity = phase === 'transition' ? 1 - transitionProgress : 0;
    const endOpacity = phase === 'transition' ? transitionProgress : 1;
    return (<group ref={groupRef} position={position}>
      
      {currentClimate.rainfall > 800 ? (<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
            <circleGeometry args={[8, 64]}/>
            <MeshReflectorMaterial blur={[300, 100]} resolution={1024} mixBlur={1} mixStrength={40} roughness={0.1} depthScale={1.2} minDepthThreshold={0.4} maxDepthThreshold={1.4} color="#203040" metalness={0.5} mirror={0}/>
        </mesh>) : (<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
            <circleGeometry args={[8, 64]}/>
            <meshStandardMaterial color="#5d5045" roughness={0.9}/>
        </mesh>)}

      
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2} floatingRange={[0, 0.2]}>
        <group scale={[0.15, 0.15, 0.15]}>
          
          {showStartModel && startModelPath && (<GLBModel url={startModelPath} opacity={startOpacity} visible={startOpacity > 0.01}/>)}

          
          {showEndModel && endModelPath && (<GLBModel url={endModelPath} opacity={endOpacity} visible={endOpacity > 0.01}/>)}

          
          {!startModelPath && !endModelPath && (<mesh position={[0, 1, 0]}>
              <boxGeometry args={[2, 2, 2]}/>
              <meshStandardMaterial color="#334155" wireframe transparent opacity={0.3}/>
            </mesh>)}
        </group>
      </Float>
    </group>);
}
