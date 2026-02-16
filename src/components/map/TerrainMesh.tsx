"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TerrainMeshProps {
  size?: number;
  resolution?: number;
}

// Vertex Shader
const vertexShader = `
varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vElevation = position.y;
  vNormal = normalize(normalMatrix * normal);
  vViewPosition = -viewPosition.xyz;
}
`;

// Fragment Shader
const fragmentShader = `
uniform vec3 uColorWater;
uniform vec3 uColorLow;
uniform vec3 uColorMid;
uniform vec3 uColorHigh;
uniform vec3 uColorPeak;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  // Height based gradient
  float mixStrength = (vElevation + 0.2) * 0.8;
  vec3 color = mix(uColorWater, uColorLow, smoothstep(-0.2, 0.0, vElevation));
  color = mix(color, uColorMid, smoothstep(0.0, 0.4, vElevation));
  color = mix(color, uColorHigh, smoothstep(0.4, 0.8, vElevation));
  color = mix(color, uColorPeak, smoothstep(0.8, 1.2, vElevation));

  // Fresnel
  vec3 viewDirection = normalize(vViewPosition);
  vec3 normal = normalize(vNormal);
  float fresnelTerm = dot(viewDirection, normal);
  fresnelTerm = clamp(1.0 - fresnelTerm, 0.0, 1.0);
  fresnelTerm = pow(fresnelTerm, 3.0);

  // Jade/Glass feel
  vec3 fresnelColor = vec3(0.8, 0.9, 0.9); // Icy white/blue rim
  color = mix(color, fresnelColor, fresnelTerm * 0.5);

  gl_FragColor = vec4(color, 0.95); // Slightly transparent?
    
  // Simple lighting fix
  vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
  float diff = max(dot(normal, lightDir), 0.0);
  gl_FragColor.rgb *= (0.6 + 0.4 * diff);
  
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export function TerrainMesh({ size = 20, resolution = 128 }: TerrainMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Generate Heightmap Geometry
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, resolution, resolution);
    geo.rotateX(-Math.PI / 2);

    const positions = geo.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);

      // Multi-layer noise for terrain
      const noise1 = Math.sin(x * 0.3) * Math.cos(z * 0.3) * 0.5;
      const noise2 = Math.sin(x * 0.8 + 1) * Math.cos(z * 0.6 + 2) * 0.3;
      const noise3 = Math.sin(x * 1.5 + 3) * Math.cos(z * 1.2 + 1) * 0.15;
      const trend = (x + z) * 0.05; // SE low, NW high

      let height = noise1 + noise2 + noise3 + trend;

      // Soften edges
      const edgeDist = Math.max(
        Math.abs(x) / (size / 2),
        Math.abs(z) / (size / 2),
      );
      height *= 1 - Math.pow(edgeDist, 4);

      positions.setY(i, height);
    }

    geo.computeVertexNormals();
    return geo;
  }, [size, resolution]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColorWater: { value: new THREE.Color("#112F41") }, // Deep Blue/Green
        uColorLow: { value: new THREE.Color("#104E3E") }, // Dark Jade
        uColorMid: { value: new THREE.Color("#407D5C") }, // Medium Jade
        uColorHigh: { value: new THREE.Color("#8FB996") }, // Light Jade
        uColorPeak: { value: new THREE.Color("#C4A484") }, // Ochre/Soil
      },
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  // Water wave animation
  useFrame((state) => {
    if (meshRef.current) {
      // Optional: Animate uniforms or vertices here if needed
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={shaderMaterial}
      receiveShadow
      castShadow
    />
  );
}
