'use client';

import { useStore } from '@/store/useStore';
import { useState } from 'react';

export function LandingPage() {
  const { setPhase } = useStore();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStart = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setPhase('map');
    }, 800);
  };

  return (
    <div
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        background: 'linear-gradient(145deg, #f7f0e3 0%, #efe3ce 30%, #e8d5b8 60%, #dfc8a5 100%)',
      }}
    >
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes borderDraw {
          from { stroke-dashoffset: 3000; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.08; }
        }
        .fade-in-1 {
          animation: fadeIn 1s ease-out 0.2s both;
        }
        .fade-in-2 {
          animation: fadeIn 1s ease-out 0.5s both;
        }
        .fade-in-3 {
          animation: fadeIn 1s ease-out 0.8s both;
        }
        .fade-in-4 {
          animation: fadeIn 1s ease-out 1s both;
        }
        .fade-in-5 {
          animation: fadeIn 1s ease-out 1.2s both;
        }
        .fade-in-6 {
          animation: fadeIn 1s ease-out 1.5s both;
        }
        .border-anim {
          stroke-dashoffset: 3000;
          animation: borderDraw 3s ease-out 0.3s forwards;
        }
        .border-anim-delay {
          stroke-dashoffset: 3000;
          animation: borderDraw 3s ease-out 0.8s forwards;
        }
        .landing-btn {
          animation: fadeIn 1s ease-out 1.4s both, gentleFloat 4s ease-in-out 3s infinite;
        }
        .landing-btn:hover {
          background: rgba(235, 218, 190, 0.9) !important;
          box-shadow: 3px 3px 0 rgba(139, 107, 71, 0.25), 0 0 30px rgba(200, 169, 126, 0.15) !important;
          transform: translateY(-3px) !important;
          border-color: #b8956a !important;
        }
      `}</style>

      {/* 宣纸纹理叠加 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 50%, rgba(180, 150, 100, 0.08) 0%, transparent 70%),
            radial-gradient(ellipse at 80% 30%, rgba(160, 130, 80, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 80%, rgba(200, 170, 110, 0.05) 0%, transparent 50%)
          `,
        }}
      />

      {/* 墨渍装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          style={{
            position: 'absolute', top: '-5%', right: '-5%',
            width: '40vw', height: '40vw',
            background: 'radial-gradient(circle, rgba(139,107,71,0.04) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'shimmer 8s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: '-10%', left: '-8%',
            width: '50vw', height: '50vw',
            background: 'radial-gradient(circle, rgba(180,150,100,0.05) 0%, transparent 60%)',
            borderRadius: '50%',
            animation: 'shimmer 10s ease-in-out infinite 2s',
          }}
        />
      </div>

      {/* 古典边框装饰 SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
      >
        <rect x="30" y="20" width="940" height="560" fill="none"
          stroke="#c8a97e" strokeWidth="0.6" opacity="0.25"
          strokeDasharray="3000" className="border-anim"
        />
        <rect x="45" y="35" width="910" height="530" fill="none"
          stroke="#c8a97e" strokeWidth="0.3" opacity="0.15"
          strokeDasharray="3000" className="border-anim-delay"
        />

        {/* 四角回纹装饰 */}
        <g opacity="0.2" stroke="#8b6b47" fill="none" strokeWidth="0.8">
          <path d="M30,20 L30,60 L70,60 L70,45 L45,45 L45,20" />
          <path d="M35,25 L35,55 L65,55 L65,40 L50,40 L50,25" />
        </g>
        <g opacity="0.2" stroke="#8b6b47" fill="none" strokeWidth="0.8">
          <path d="M970,20 L970,60 L930,60 L930,45 L955,45 L955,20" />
          <path d="M965,25 L965,55 L935,55 L935,40 L950,40 L950,25" />
        </g>
        <g opacity="0.2" stroke="#8b6b47" fill="none" strokeWidth="0.8">
          <path d="M30,580 L30,540 L70,540 L70,555 L45,555 L45,580" />
          <path d="M35,575 L35,545 L65,545 L65,560 L50,560 L50,575" />
        </g>
        <g opacity="0.2" stroke="#8b6b47" fill="none" strokeWidth="0.8">
          <path d="M970,580 L970,540 L930,540 L930,555 L955,555 L955,580" />
          <path d="M965,575 L965,545 L935,545 L935,560 L950,560 L950,575" />
        </g>

        <line x1="100" y1="300" x2="400" y2="300" stroke="#c8a97e" strokeWidth="0.3" opacity="0.12" />
        <line x1="600" y1="300" x2="900" y2="300" stroke="#c8a97e" strokeWidth="0.3" opacity="0.12" />
      </svg>

      {/* 主体内容 — 垂直水平居中 */}
      <div
        className="text-center px-8"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          maxWidth: '800px',
          width: '100%',
        }}
      >
        {/* 顶部英文副标题 */}
        <div
          className="fade-in-1"
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.5em',
            color: '#9d815a',
            fontFamily: 'var(--font-serif), "Noto Serif SC", SimSun, STSong, serif',
            marginBottom: '2.5rem',
          }}
        >
          ALGORITHMIC ARCHITECTURAL DIALECTS
        </div>

        {/* 主标题 "千里江山" */}
        <h1
          className="fade-in-2"
          style={{
            fontSize: 'clamp(3.5rem, 8vw, 6rem)',
            fontWeight: 700,
            color: '#3a2e21',
            letterSpacing: '0.4em',
            fontFamily: 'var(--font-serif), "Noto Serif SC", SimSun, STSong, serif',
            lineHeight: 1.1,
            textShadow: '3px 3px 6px rgba(139, 107, 71, 0.08)',
            marginBottom: '1rem',
          }}
        >
          千里江山
        </h1>

        {/* 装饰分割线 + 副标题 */}
        <div
          className="flex items-center justify-center gap-5 mb-10 fade-in-3"
        >
          <div style={{
            width: 80, height: 1,
            background: 'linear-gradient(90deg, transparent, #c8a97e, transparent)',
          }} />
          <span
            style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              letterSpacing: '0.4em',
              color: '#8b6b47',
              fontFamily: 'var(--font-serif), "Noto Serif SC", SimSun, STSong, serif',
              fontWeight: 400,
            }}
          >
            从土而生 · 建筑方言
          </span>
          <div style={{
            width: 80, height: 1,
            background: 'linear-gradient(90deg, transparent, #c8a97e, transparent)',
          }} />
        </div>

        {/* 简介 */}
        <div className="space-y-3 mb-12 fade-in-4" style={{ maxWidth: '600px' }}>
          <p style={{
            fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)',
            color: '#8b6b47',
            letterSpacing: '0.15em',
            lineHeight: 2,
            fontFamily: 'var(--font-serif), "Noto Serif SC", SimSun, STSong, serif',
          }}>
            探索中国传统民居在不同气候带中的适应性智慧
          </p>
          <p style={{
            fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)',
            color: '#8b6b47',
            letterSpacing: '0.15em',
            lineHeight: 2,
            fontFamily: 'var(--font-serif), "Noto Serif SC", SimSun, STSong, serif',
          }}>
            从气候中提炼规则，从建筑中读懂土地
          </p>
          <p style={{
            fontSize: 'clamp(0.78rem, 1vw, 0.85rem)',
            color: '#9d815a',
            letterSpacing: '0.12em',
            lineHeight: 2,
            marginTop: '0.75rem',
            fontFamily: 'var(--font-serif), "Noto Serif SC", SimSun, STSong, serif',
          }}>
            穿越山川河谷与气候分界线，在温度、湿度与风向的变化中，
            <br />
            观察驿站民居形态如何随环境细腻生长
          </p>
        </div>

        {/* 入口按钮 — 古典印章风格 */}
        <button
          onClick={handleStart}
          disabled={isAnimating}
          className="landing-btn"
          style={{
            padding: '18px 64px',
            borderRadius: 0,
            border: '1.5px solid #c8a97e',
            background: isAnimating
              ? 'rgba(230, 210, 180, 0.95)'
              : 'rgba(245, 235, 215, 0.6)',
            color: '#6b5235',
            fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
            fontWeight: 500,
            letterSpacing: '0.35em',
            cursor: isAnimating ? 'wait' : 'pointer',
            transition: 'background 0.4s, box-shadow 0.4s, transform 0.4s, border-color 0.4s',
            boxShadow: '2px 2px 0 rgba(139, 107, 71, 0.15)',
            backdropFilter: 'blur(12px)',
            fontFamily: 'var(--font-serif), "Noto Serif SC", SimSun, STSong, serif',
          }}
        >
          踏上旅途
        </button>
      </div>

      {/* 底部版权 */}
      <footer
        className="absolute bottom-6 left-0 right-0 text-center fade-in-6"
        style={{
          fontSize: '0.7rem',
          color: '#b39a72',
          letterSpacing: '0.15em',
          fontFamily: 'var(--font-serif), "Noto Serif SC", SimSun, STSong, serif',
          zIndex: 10,
        }}
      >
        © 2025 从土而生 · From the Soil · 计算机设计大赛
      </footer>
    </div>
  );
}
