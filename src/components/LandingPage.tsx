'use client';

import { useStore } from '@/store/useStore';
import { useCallback, useEffect, useRef, useState } from 'react';

export function LandingPage() {
  const { setPhase } = useStore();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPart2, setShowPart2] = useState(false);
  const part1Ref = useRef<HTMLVideoElement | null>(null);
  const part2Ref = useRef<HTMLVideoElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const startButtonRef = useRef<HTMLButtonElement | null>(null);

  // part1 播放结束后，无缝切换到 part2 并循环播放
  const handlePart1End = useCallback(() => {
    setShowPart2(true);
    if (part2Ref.current) {
      part2Ref.current.play().catch(() => {
        // 静默处理自动播放被阻止的情况
      });
    }
  }, []);

  // 页面加载后预加载 part2
  useEffect(() => {
    if (part2Ref.current) {
      part2Ref.current.load();
    }
  }, []);

  const handleStart = useCallback(() => {
    if (isTransitioning) {
      return;
    }
    setIsTransitioning(true);
    setPhase('map');
  }, [isTransitioning, setPhase]);

  return (
    <div
      ref={rootRef}
      className="relative flex items-center justify-center w-full overflow-hidden"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        fontFamily: '"演示秋鸿楷", "YanShi QiuHongKai", var(--font-serif), "Noto Serif SC", SimSun, STSong, serif',
      }}
    >
      {/* part1 背景视频 - 自动静音播放1遍 */}
      <video
        ref={part1Ref}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handlePart1End}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <source src="/part1.mp4" type="video/mp4" />
      </video>

      {/* part2 背景视频 - part1结束后无缝切换，循环播放 */}
      <video
        ref={part2Ref}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          pointerEvents: 'none',
          opacity: showPart2 ? 1 : 0,
          transition: 'opacity 0.01s ease',
        }}
      >
        <source src="/part2.mp4" type="video/mp4" />
      </video>

      {/* 「踏入旅途」按钮 - 置于视频中所有文字下方 */}
      <div
        style={{
          position: 'absolute',
          bottom: 'calc(8% + 90px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          maxWidth: '880px',
          width: '100%',
          padding: '0 2rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <button
            ref={startButtonRef}
            type="button"
            onClick={handleStart}
            disabled={isTransitioning}
            style={{
              position: 'relative',
              padding: '18px 64px',
              borderRadius: 0,
              border: '1.5px solid #c8a97e',
              background: isTransitioning
                ? 'rgba(232, 215, 189, 0.9)'
                : 'rgba(247, 240, 227, 0.42)',
              color: '#6b5235',
              fontSize: 'clamp(0.92rem, 1.2vw, 1rem)',
              fontWeight: 500,
              letterSpacing: '0.35em',
              cursor: isTransitioning ? 'wait' : 'pointer',
              transition: 'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, background 0.35s ease',
              boxShadow:
                'inset 0 0 0 3px transparent, inset 0 0 0 4px rgba(200, 169, 126, 0.3), 0 12px 28px rgba(139, 107, 71, 0.09)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              willChange: 'transform, opacity',
            }}
            onMouseEnter={(event) => {
              if (isTransitioning) {
                return;
              }
              event.currentTarget.style.transform = 'translateY(-2px)';
              event.currentTarget.style.borderColor = '#8b6b47';
              event.currentTarget.style.boxShadow =
                'inset 0 0 0 3px transparent, inset 0 0 0 4px rgba(139, 107, 71, 0.38), 0 16px 36px rgba(139, 107, 71, 0.12)';
              for (const node of Array.from(event.currentTarget.querySelectorAll('[data-corner="true"]'))) {
                (node as HTMLSpanElement).style.borderColor = '#8b6b47';
              }
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform = 'translateY(0)';
              event.currentTarget.style.borderColor = '#c8a97e';
              event.currentTarget.style.boxShadow =
                'inset 0 0 0 3px transparent, inset 0 0 0 4px rgba(200, 169, 126, 0.3), 0 12px 28px rgba(139, 107, 71, 0.09)';
              for (const node of Array.from(event.currentTarget.querySelectorAll('[data-corner="true"]'))) {
                (node as HTMLSpanElement).style.borderColor = '#c8a97e';
              }
            }}
          >
            {[
              { top: 8, left: 8, borderTop: '1.5px solid #c8a97e', borderLeft: '1.5px solid #c8a97e' },
              { top: 8, right: 8, borderTop: '1.5px solid #c8a97e', borderRight: '1.5px solid #c8a97e' },
              { bottom: 8, left: 8, borderBottom: '1.5px solid #c8a97e', borderLeft: '1.5px solid #c8a97e' },
              { bottom: 8, right: 8, borderBottom: '1.5px solid #c8a97e', borderRight: '1.5px solid #c8a97e' },
            ].map((corner, index) => (
              <span
                key={index}
                data-corner="true"
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  width: 14,
                  height: 14,
                  transition: 'border-color 0.35s ease',
                  ...corner,
                }}
              />
            ))}
            <span
              style={{
                position: 'relative',
                zIndex: 1,
                fontSize: 'clamp(1.3rem, 1.8vw, 1.5rem)',
                fontFamily: '"FangSong", "仿宋", "STFangsong", serif',
                fontWeight: 700,
                letterSpacing: '0.1em',
              }}
            >
              踏上旅途
            </span>
          </button>
          <div
            style={{
              fontSize: '0.7rem',
              color: '#b39a72',
              marginTop: '1rem',
              letterSpacing: '0.14em',
            }}
          >
            点击开启你的建筑探索之旅
          </div>
        </div>
      </div>
    </div>
  );
}
