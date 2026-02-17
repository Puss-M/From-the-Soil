'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { CollectionItem } from '@/types';

interface InteractiveElementProps {
  item: CollectionItem;
  position: [number, number, number];
  rotation?: [number, number, number];
  onCollect: (itemId: string) => void;
}

// 根据类别生成不同的组合几何体
function CategoryGeometry({ category, collected }: { category: string; collected: boolean }) {
  const color = collected ? '#94a3b8' : '#f8fafc';
  const emissive = collected ? '#000000' : '#6366f1';

  if (category === '装饰构件') {
    // 影壁/马头墙 — 阶梯状浮雕板
    return (
      <group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 1.0, 0.08]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.6, 0.2, 0.1]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[0.3, 0.15, 0.1]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.2} />
        </mesh>
      </group>
    );
  }

  if (category === '结构构件') {
    // 斗拱/窗棂 — 层叠十字结构
    return (
      <group>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.12, 0.6, 0.12]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.12, 0.5, 0.12]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.7, 0.08, 0.15]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.2} />
        </mesh>
      </group>
    );
  }

  // 功能构件 — 天井（方形围合）
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.0, 0.3, 1.0]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.7, 0.1, 0.7]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.1} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

export function InteractiveElement({ 
  item, 
  position, 
  rotation = [0, 0, 0],
  onCollect 
}: InteractiveElementProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  // 浮动旋转动画
  useFrame((state) => {
    if (groupRef.current && !item.collected) {
      const t = state.clock.elapsedTime;
      groupRef.current.position.y = position[1] + Math.sin(t * 2 + position[0]) * 0.08;
      groupRef.current.rotation.y = rotation[1] + t * 0.3;
    }
  });

  const handleClick = () => {
    if (!item.collected) {
      setShowDetail(true);
    }
  };

  const handleCollect = () => {
    onCollect(item.id);
    setShowDetail(false);
  };

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* 构件几何体 */}
      <group
        onClick={handleClick}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <CategoryGeometry category={item.category} collected={item.collected} />
      </group>

      {/* 名称标签 — 始终可见 */}
      {!item.collected && (
        <Html position={[0, -0.5, 0]} center>
          <div
            style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(8px)',
              borderRadius: 6,
              padding: '2px 8px',
              fontSize: 11,
              color: '#6366f1',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              border: '1px solid #e0e7ff',
              pointerEvents: 'none',
            }}
          >
            {item.name}
          </div>
        </Html>
      )}

      {/* 悬停提示 */}
      {isHovered && !showDetail && !item.collected && (
        <Html position={[0, 1.0, 0]} center>
          <div
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '6px 12px',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ color: '#6366f1', fontSize: 13, fontWeight: 600 }}>{item.name}</div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>点击查看详情</div>
          </div>
        </Html>
      )}

      {/* 已收集标记 */}
      {item.collected && (
        <Html position={[0, 0.6, 0]} center>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, pointerEvents: 'none' }}>
            <span style={{ fontSize: 20, color: '#10b981' }}>✓</span>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>{item.name}</span>
          </div>
        </Html>
      )}

      {/* 详情面板 */}
      {showDetail && (
        <Html position={[1.5, 0, 0]} center>
          <div
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid #e2e8f0',
              borderRadius: 14,
              padding: 16,
              width: 260,
              pointerEvents: 'auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            {/* 标题 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', fontFamily: 'var(--font-serif)' }}>{item.name}</h3>
              <button 
                onClick={() => setShowDetail(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 14 }}
              >
                ✕
              </button>
            </div>

            {/* 分类 */}
            <div style={{ fontSize: 10, color: '#6366f1', marginBottom: 8, letterSpacing: 2, fontWeight: 600 }}>{item.category}</div>

            {/* 描述 */}
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12, lineHeight: 1.6 }}>{item.description}</p>

            {/* 属性条 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              {[
                { label: '隐私保护', value: item.attributes.privacy, color: '#0ea5e9' },
                { label: '风水功能', value: item.attributes.fengshui, color: '#eab308' },
                { label: '造价成本', value: item.attributes.cost, color: '#ef4444' },
                { label: '美学价值', value: item.attributes.aesthetic, color: '#8b5cf6' },
              ].map(attr => (
                <div key={attr.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                  <span style={{ color: '#94a3b8', width: 50, flexShrink: 0 }}>{attr.label}</span>
                  <div style={{ flex: 1, height: 4, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${attr.value * 10}%`, background: attr.color, borderRadius: 2 }} />
                  </div>
                  <span style={{ color: attr.color, fontWeight: 600, width: 16, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{attr.value}</span>
                </div>
              ))}
            </div>

            {/* 收集按钮 */}
            <button
              onClick={handleCollect}
              style={{
                width: '100%',
                padding: '10px 0',
                background: 'linear-gradient(135deg, #6366f1, #2563eb)',
                border: 'none',
                borderRadius: 10,
                color: 'white',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
              }}
            >
              📥 收入图谱
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}
