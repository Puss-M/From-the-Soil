'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Station } from '@/types';

interface StationNodeProps {
  station: Station;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

// Procedural Pavilion Component
function Pavilion({ color, scale = 1, glowing = false }: { color: THREE.Color, scale?: number, glowing?: boolean }) {
    // Roof Geometry (Pyramid with 4 sides)
    const roofGeo = useMemo(() => {
        const geo = new THREE.ConeGeometry(1, 0.6, 4, 1);
        geo.rotateY(Math.PI / 4); // Align with axes
        geo.translate(0, 0.8, 0); // Lift up
        return geo;
    }, []);

    // Pillars (4 corners)
    const pillarGeo = useMemo(() => {
        const geo = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
        geo.translate(0, 0.4, 0);
        return geo;
    }, []);

    const baseGeo = useMemo(() => new THREE.CylinderGeometry(0.8, 0.9, 0.2, 4).rotateY(Math.PI/4), []);

    return (
        <group scale={scale}>
            {/* Base */}
            <mesh geometry={baseGeo} position={[0, 0.1, 0]}>
                <meshStandardMaterial color="#334155" />
            </mesh>

            {/* Pillars */}
            {[[-0.4, -0.4], [0.4, -0.4], [-0.4, 0.4], [0.4, 0.4]].map(([x, z], i) => (
                <mesh key={i} geometry={pillarGeo} position={[x, 0, z]}>
                    <meshStandardMaterial color="#475569" />
                </mesh>
            ))}

            {/* Roof */}
            <mesh geometry={roofGeo}>
                <meshStandardMaterial 
                    color={glowing ? '#0ea5e9' : '#1e293b'} 
                    emissive={glowing ? '#0ea5e9' : '#000000'}
                    emissiveIntensity={glowing ? 0.5 : 0}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>

            {/* Glow Core */}
            {glowing && (
                <mesh position={[0, 0.5, 0]}>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshBasicMaterial color="#00ffff" />
                </mesh>
            )}
        </group>
    );
}

export function StationNode({ 
  station, 
  isSelected, 
  isHovered,
  onClick, 
  onHover 
}: StationNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [localHover, setLocalHover] = useState(false);

  // Hover Animation
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      // Gentle float
      const hoverOffset = (isSelected || isHovered) ? 0.2 : 0;
      groupRef.current.position.y = THREE.MathUtils.lerp(
          groupRef.current.position.y,
          station.position[1] + hoverOffset + Math.sin(t * 2 + station.position[0]) * 0.05,
          0.1
      );
      
      // Selected pulse scale
      const targetScale = isSelected ? 1.2 : isHovered ? 1.1 : 1;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1));
    }
  });

  // Color calculation
  const buildingColor = useMemo(() => {
    const rainfall = station.climate.rainfall;
    // Dry -> Ochre, Wet -> Teal
    const t = rainfall / 2000;
    return new THREE.Color().lerpColors(
      new THREE.Color('#C4A484'), // Ochre
      new THREE.Color('#2D5A4A'), // Teal
      t
    );
  }, [station.climate.rainfall]);

  // Interaction handlers
  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setLocalHover(true);
    onHover(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setLocalHover(false);
    onHover(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group 
      ref={groupRef} 
      position={station.position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
        {/* The Pavilion Model */}
        <Pavilion 
            color={buildingColor} 
            scale={0.5} 
            glowing={isSelected || isHovered} 
        />

      {/* Station Name */}
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.25}
        font="/fonts/NotoSerifSC-Bold.woff2" // We'll need to handle fonts, falling back to default if missing
        color={isSelected ? '#00ffff' : '#e2e8f0'}
        anchorX="center"
        anchorY="top"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {station.name}
      </Text>

      {/* Hover Info Panel (HTML) */}
      {(localHover || isHovered) && !isSelected && (
        <Html position={[0, 1.5, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
            <div className="bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-lg p-2 min-w-[120px] text-center transform transition-all duration-300">
                <div className="text-cyan-400 font-bold text-xs">{station.name}</div>
                <div className="h-px bg-cyan-500/20 my-1"/>
                <div className="text-[10px] text-slate-300">
                    <div>🌧️ {station.climate.rainfall}mm</div>
                    <div>🛡️ Lv.{station.climate.defense}</div>
                </div>
            </div>
        </Html>
      )}

      {/* Selection Ring */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <ringGeometry args={[0.6, 0.7, 32]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

