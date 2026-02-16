'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

export function ClimateEffects() {
  const { currentClimate } = useStore();
  const { rainfall, defense } = currentClimate; // defense used for 'chaos' or wind? rainfall for rain.

  // Determine type: Rain (High rainfall) vs Dust (Low rainfall)
  const isRain = rainfall > 500;
  const count = isRain ? Math.floor(rainfall * 2) : 500; // More rain with more rainfall
  
  // Geometry
  const rainGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    // Simple line for rain
    const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -0.5, 0)];
    geo.setFromPoints(points);
    return geo;
  }, []);

  const dustGeo = useMemo(() => new THREE.DodecahedronGeometry(0.02), []);

  return (
    <group>
        {isRain ? (
            <RainSystem count={count} />
        ) : (
             <DustSystem count={200} />
        )}
    </group>
  );
}

function RainSystem({ count }: { count: number }) {
    const materialRef = useRef<THREE.LineBasicMaterial>(null);
    const rainRef = useRef<THREE.Group>(null);

    // Create random positions
    const particles = useMemo(() => {
        return Array.from({ length: 1000 }).map(() => ({
            position: [
                (Math.random() - 0.5) * 20,
                Math.random() * 10,
                (Math.random() - 0.5) * 20
            ] as [number, number, number],
            speed: 0.5 + Math.random() * 0.5
        }));
    }, []);
    
    // We use basic lines for rain
    // Ideally use InstancedMesh but LineSegments with custom shader is better for rain.
    // For simplicity/R3F: Arrays of lines or <Instances> if we use meshes.
    // Let's use <Instances> called "RainStrokes"
    return (
        <Instances range={count}>
            <cylinderGeometry args={[0.01, 0.01, 0.5]} />
            <meshBasicMaterial color="#a5f3fc" transparent opacity={0.4} />
            {particles.map((data, i) => (
                <RainDrop key={i} data={data} />
            ))}
        </Instances>
    )
}

function RainDrop({ data }: { data: { position: [number, number, number], speed: number } }) {
    const ref = useRef<THREE.Group>(null);
    useFrame((state, delta) => {
        if (!ref.current) return;
        ref.current.position.y -= data.speed * 10 * delta;
        if (ref.current.position.y < 0) {
            ref.current.position.y = 10;
        }
    });

    return <group ref={ref} position={data.position}><Instance /></group>;
}

function DustSystem({ count }: { count: number }) {
     const particles = useMemo(() => {
        return Array.from({ length: count }).map(() => ({
            position: [
                (Math.random() - 0.5) * 20,
                Math.random() * 8,
                (Math.random() - 0.5) * 20
            ] as [number, number, number],
            factor: Math.random(),
            speed: 0.01 + Math.random() * 0.02
        }));
    }, [count]);

    return (
        <Instances range={count}>
            <dodecahedronGeometry args={[0.03, 0]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.4} />
            {particles.map((data, i) => (
                <DustMolecule key={i} data={data} />
            ))}
        </Instances>
    )
}

function DustMolecule({ data }: { data: any }) {
    const ref = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime * data.speed;
        ref.current.position.y += Math.sin(t) * 0.002;
        ref.current.position.x += Math.cos(t * data.factor) * 0.002;
        ref.current.rotation.x = t;
        ref.current.rotation.y = t * 0.5;
    });

    return <group ref={ref} position={data.position}><Instance /></group>;
}
