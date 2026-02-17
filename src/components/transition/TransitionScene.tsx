'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { MorphingHouse } from '@/components/MorphingHouse';
import { DashboardHUD } from './DashboardHUD';
import { NarratorPanel } from './NarratorPanel';
import { useStore } from '@/store/useStore';

/* ═══════════════════════════════════════════════════════
   3D Scene Contents
   ═══════════════════════════════════════════════════════ */
function TransitionContent() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[6, 4, 6]} fov={50} />
      <OrbitControls
        enablePan={false} enableZoom enableRotate
        minDistance={4} maxDistance={15} target={[0, 1, 0]}
        autoRotate autoRotateSpeed={0.5}
      />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.3} color="#00ffff" />
      <pointLight position={[5, 3, 5]} intensity={0.2} color="#f59e0b" />
      <Environment preset="apartment" />
      <ContactShadows position={[0, -0.01, 0]} opacity={0.5} scale={10} blur={2} far={4} />
      <gridHelper args={[20, 40, '#cbd5e1', '#e2e8f0']} position={[0, 0, 0]} />
      <MorphingHouse position={[0, 0, 0]} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   Glassmorphism card style (shared)
   ═══════════════════════════════════════════════════════ */
const glass = {
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  borderRadius: 14,
} as const;

/* ═══════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════ */
interface TransitionSceneProps {
  onComplete?: () => void;
  onBack?: () => void;
}

export function TransitionScene({ onComplete, onBack }: TransitionSceneProps) {
  const { transitionProgress, setTransitionProgress, setPhase, startStation, endStation, setDirectControl, updateClimateFromProgress } = useStore();
  const [infoExpanded, setInfoExpanded] = useState(false);

  useEffect(() => {
    if (startStation && endStation) setDirectControl(false);
  }, [startStation, endStation, setDirectControl]);

  useEffect(() => {
    updateClimateFromProgress();
  }, [transitionProgress, updateClimateFromProgress]);

  const handleComplete = () => {
    if (transitionProgress >= 0.95) { setPhase('roaming'); onComplete?.(); }
  };
  const handleBack = () => { setPhase('map'); onBack?.(); };

  const morphDesc = (() => {
    if (!startStation || !endStation) return { title: '过渡型', desc: '建筑形态正在演变中...' };
    const t = transitionProgress;
    if (t < 0.3) return { title: startStation.buildingGene, desc: `${startStation.name}形态：${startStation.description}` };
    if (t < 0.7) return { title: '过渡形态', desc: `正在从「${startStation.buildingGene}」向「${endStation.buildingGene}」演变` };
    return { title: endStation.buildingGene, desc: `${endStation.name}形态：${endStation.description}` };
  })();

  // 关键气候节点
  const keyNodes: { pos: number; label: string }[] = [];
  if (startStation && endStation) {
    const sr = startStation.climate.rainfall, er = endStation.climate.rainfall;
    for (const line of [800, 400]) {
      if ((sr > line && er < line) || (sr < line && er > line)) {
        const t = (line - sr) / (er - sr);
        if (t > 0 && t < 1) keyNodes.push({ pos: t, label: `${line}mm线` });
      }
    }
  }

  /* ─────────────────────────────────────────────────────
     Z-Axis Layering Architecture

     Layer 0  │ 3D Canvas          │ fixed inset-0, z-0
     Layer 1  │ HUD Overlay        │ fixed, z-20
              │  ┣ Top-Left:  Back button + Title
              │  ┣ Top-Right: "Enter Roaming" CTA
              │  ┣ Left:      DashboardHUD
              │  ┣ Right:     NarratorPanel
              │  ┣ Bottom-Left: Morph info (collapsible)
              │  ┗ Bottom-Center: Slider controller
     ───────────────────────────────────────────────────── */

  return (
    <>
      {/* ═══ Layer 0: THE STAGE (全屏 3D Canvas) ═══════════
          这是主体——用户在"漫游建筑"，不是在"阅读网页" */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Canvas shadows style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg, #f0f9ff 0%, #f8fafc 40%, #f5f3ff 100%)' }}>
          <Suspense fallback={null}>
            <TransitionContent />
          </Suspense>
        </Canvas>
      </div>

      {/* ═══ Layer 1: HUD OVERLAY (浮游 UI 岛屿) ══════════
          pointer-events: none 整层穿透 → 空白区可旋转/缩放模型
          各 UI 岛屿单独 pointer-events: auto */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 20, pointerEvents: 'none' }}>

        {/* ── 左上: 返回按钮 + 标题 ─────────────────────── */}
        <div style={{ position: 'absolute', top: 24, left: 24, pointerEvents: 'auto' }}>
          <button
            onClick={handleBack}
            style={{
              ...glass, padding: '8px 16px', borderRadius: 10,
              color: '#475569', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.2s', marginBottom: 12,
              display: 'block',
            }}
          >
            ← 返回地图
          </button>
          <div>
            <h2 style={{
              fontSize: '1.4rem', fontWeight: 700, color: '#1e293b',
              letterSpacing: '0.12em', fontFamily: 'var(--font-serif)',
              textShadow: '0 1px 8px rgba(255,255,255,0.6)',
            }}>
              形态渐变
            </h2>
            <p style={{ color: '#6366f1', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
              Morphing Journey
            </p>
          </div>
        </div>

        {/* ── 右上: 进入漫游 CTA ──────────────────────── */}
        {transitionProgress >= 0.9 && (
          <button
            onClick={handleComplete}
            style={{
              position: 'absolute', top: 24, right: 24,
              pointerEvents: 'auto',
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #2563eb, #6366f1)',
              border: 'none', borderRadius: 12,
              color: 'white', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.3s',
              boxShadow: '0 4px 20px rgba(37,99,235,0.35)',
              letterSpacing: '0.05em',
            }}
          >
            进入漫游 →
          </button>
        )}

        {/* ── 左下: 形态描述 (可折叠的岛屿) ──────────── */}
        <div style={{
          position: 'absolute', bottom: 90, left: 24,
          pointerEvents: 'auto', maxWidth: 280,
        }}>
          <div style={{ ...glass, padding: infoExpanded ? '14px 18px' : '10px 16px', cursor: 'pointer', transition: 'all 0.3s' }}
            onClick={() => setInfoExpanded(!infoExpanded)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 9, color: '#6366f1', letterSpacing: 3, fontWeight: 600, marginBottom: 4 }}>
                  当前形态
                </div>
                <div style={{ color: '#1e293b', fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-serif)' }}>
                  {morphDesc.title}
                </div>
              </div>
              <span style={{ fontSize: 12, color: '#94a3b8', transform: infoExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                ▼
              </span>
            </div>
            {infoExpanded && (
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, marginTop: 8, borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 8 }}>
                {morphDesc.desc}
              </div>
            )}
          </div>
        </div>

        {/* ── 底部居中: 进度条控制器 ─────────────────── */}
        <div style={{
          position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          pointerEvents: 'auto', width: '90%', maxWidth: 520,
        }}>
          <div style={{ ...glass, padding: '14px 20px' }}>
            {/* 路线标签 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: '#2563eb', fontWeight: 600 }}>{startStation?.name || '起点'}</span>
              <span style={{ color: '#dc2626', fontWeight: 600 }}>{endStation?.name || '终点'}</span>
            </div>

            {/* 滑块 */}
            <div className="relative">
              <input
                type="range" min="0" max="1" step="0.001"
                value={transitionProgress}
                onChange={(e) => setTransitionProgress(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer 
                           [&::-webkit-slider-thumb]:appearance-none 
                           [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
                           [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(37,99,235,0.4)]
                           [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
              />
              {keyNodes.map((node, i) => (
                <div key={i} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ left: `${node.pos * 100}%` }}>
                  <div style={{ width: 3, height: 12, background: '#ef4444', borderRadius: 2, transform: 'translateX(-50%)' }} />
                  <div style={{ fontSize: 9, color: '#ef4444', whiteSpace: 'nowrap', transform: 'translateX(-50%)', marginTop: 2, fontWeight: 600 }}>
                    {node.label}
                  </div>
                </div>
              ))}
            </div>

            {/* 进度数值 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: '#64748b' }}>拖动进度条，观察建筑形态演变</span>
              <span style={{ fontSize: 14, fontFamily: 'var(--font-mono)', color: '#2563eb', fontWeight: 600 }}>
                {(transitionProgress * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* ── 左侧: 仪表盘 HUD ─────────────────────── */}
        <div style={{ pointerEvents: 'auto' }}>
          <DashboardHUD />
        </div>

        {/* ── 右侧: 旁白面板 ──────────────────────── */}
        <div style={{ pointerEvents: 'auto' }}>
          <NarratorPanel />
        </div>
      </div>
    </>
  );
}
