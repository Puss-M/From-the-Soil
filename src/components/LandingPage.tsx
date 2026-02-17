'use client';

import { useStore } from '@/store/useStore';
import { useState, useEffect } from 'react';

// 确定性伪随机 — 同一种子在 SSR/客户端产出相同结果，消除 hydration 差异
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// 预计算装饰粒子（模块级别 — 服务端 & 客户端共用同一份）
const PARTICLES = Array.from({ length: 30 }).map((_, i) => {
  const s = (n: number) => seededRandom(i * 7 + n);
  return {
    width: 2 + s(0) * 4,
    height: 2 + s(1) * 4,
    left: `${s(2) * 100}%`,
    top: `${s(3) * 100}%`,
    background: `rgba(${100 + s(4) * 60}, ${130 + s(5) * 60}, ${180 + s(6) * 40}, ${0.12 + s(7) * 0.15})`,
    animation: `float ${6 + s(8) * 8}s ease-in-out infinite`,
    animationDelay: `${s(9) * 5}s`,
  };
});

export function LandingPage() {
  const { setPhase } = useStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStart = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setPhase('map');
    }, 600);
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #f8fafc 0%, #f1f5f9 30%, #e8edf5 60%, #eef2f7 100%)',
      }}
    >
      {/* 背景装饰粒子 — 仅客户端渲染，避免 SSR 数值精度导致的 hydration 差异 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mounted && PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={p}
          />
        ))}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0.15; }
            25% { transform: translateY(-30px) translateX(10px); opacity: 0.35; }
            50% { transform: translateY(-15px) translateX(-15px); opacity: 0.2; }
            75% { transform: translateY(-40px) translateX(5px); opacity: 0.4; }
          }
        `}</style>
      </div>

      {/* 水墨风装饰线条 */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none">
        <line x1="10%" y1="20%" x2="90%" y2="20%" stroke="#475569" strokeWidth="0.5" strokeDasharray="4,8" />
        <line x1="10%" y1="80%" x2="90%" y2="80%" stroke="#475569" strokeWidth="0.5" strokeDasharray="4,8" />
        <line x1="15%" y1="0%" x2="15%" y2="100%" stroke="#475569" strokeWidth="0.5" strokeDasharray="4,8" />
        <line x1="85%" y1="0%" x2="85%" y2="100%" stroke="#475569" strokeWidth="0.5" strokeDasharray="4,8" />
      </svg>

      {/* 主内容区 */}
      <div
        className="relative z-10 flex flex-col items-center justify-center h-full"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 1.2s ease-out, transform 1.2s ease-out',
        }}
      >
        {/* 顶部英文标签 */}
        <div
          className="mb-8"
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.4em',
            color: '#94a3b8',
            fontFamily: 'var(--font-mono)',
            opacity: mounted ? 1 : 0,
            transition: 'opacity 1.5s ease-out 0.3s',
          }}
        >
          ALGORITHMIC ARCHITECTURAL DIALECTS
        </div>

        {/* 主标题 */}
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 700,
            color: '#1e293b',
            letterSpacing: '0.25em',
            fontFamily: 'var(--font-serif)',
            lineHeight: 1.3,
            textAlign: 'center',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1s ease-out 0.5s, transform 1s ease-out 0.5s',
          }}
        >
          千里江山
        </h1>

        {/* 副标题 */}
        <div
          className="flex items-center gap-4 mt-4 mb-12"
          style={{
            opacity: mounted ? 1 : 0,
            transition: 'opacity 1s ease-out 0.8s',
          }}
        >
          <div style={{ width: 48, height: 1, background: '#cbd5e1' }} />
          <span
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.3rem)',
              letterSpacing: '0.3em',
              color: '#64748b',
              fontFamily: 'var(--font-serif)',
            }}
          >
            从土而生 · 建筑方言
          </span>
          <div style={{ width: 48, height: 1, background: '#cbd5e1' }} />
        </div>

        {/* 简介文字 */}
        <p
          className="max-w-md text-center mb-16 leading-relaxed"
          style={{
            fontSize: '0.9rem',
            color: '#64748b',
            opacity: mounted ? 1 : 0,
            transition: 'opacity 1s ease-out 1s',
          }}
        >
          探索中国传统民居的气候适应性智慧
          <br />
          选择两座驿站，见证建筑如何从土地中生长
        </p>

        {/* 开始按钮 */}
        <button
          onClick={handleStart}
          disabled={isAnimating}
          style={{
            padding: '14px 48px',
            borderRadius: 50,
            border: '1px solid rgba(99, 102, 241, 0.35)',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(79, 70, 229, 0.06))',
            color: '#6366f1',
            fontSize: '0.95rem',
            fontWeight: 500,
            letterSpacing: '0.2em',
            cursor: isAnimating ? 'wait' : 'pointer',
            transition: 'all 0.4s ease',
            opacity: mounted ? 1 : 0,
            transform: mounted
              ? isAnimating
                ? 'scale(0.95)'
                : 'translateY(0)'
              : 'translateY(20px)',
            boxShadow: '0 0 30px rgba(99, 102, 241, 0.08)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(79, 70, 229, 0.12))';
            e.currentTarget.style.boxShadow = '0 0 40px rgba(99, 102, 241, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(79, 70, 229, 0.06))';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.35)';
          }}
        >
          开始体验
        </button>
      </div>

      {/* 底部版权 */}
      <div
        className="absolute bottom-6 left-0 right-0 text-center"
        style={{
          fontSize: '0.7rem',
          color: '#94a3b8',
          letterSpacing: '0.1em',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1s ease-out 1.5s',
        }}
      >
        © 2026 从土而生 · From the Soil · 计算机设计大赛
      </div>
    </div>
  );
}
