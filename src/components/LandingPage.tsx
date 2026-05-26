'use client';
import { useStore } from '@/store/useStore';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
const LANDING_VIDEO_SIZE = {
    width: 2050,
    height: 1280,
};
const LANDING_CONTROL_ANCHOR = {
    x: LANDING_VIDEO_SIZE.width / 2,
    y: LANDING_VIDEO_SIZE.height * 0.836,
};
type ControlAnchor = {
    left: number;
    top: number;
};
export function LandingPage() {
    const { setPhase } = useStore();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showPart2, setShowPart2] = useState(false);
    const [controlAnchor, setControlAnchor] = useState<ControlAnchor | null>(null);
    const part1Ref = useRef<HTMLVideoElement | null>(null);
    const part2Ref = useRef<HTMLVideoElement | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const startButtonRef = useRef<HTMLButtonElement | null>(null);
    const handlePart1End = useCallback(() => {
        setShowPart2(true);
        if (part2Ref.current) {
            part2Ref.current.play().catch(() => {
            });
        }
    }, []);
    useEffect(() => {
        if (part2Ref.current) {
            part2Ref.current.load();
        }
    }, []);
    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) {
            return;
        }
        let frameId = 0;
        const updateControlAnchor = () => {
            window.cancelAnimationFrame(frameId);
            frameId = window.requestAnimationFrame(() => {
                const { width, height } = root.getBoundingClientRect();
                if (width <= 0 || height <= 0) {
                    return;
                }
                const scale = Math.max(width / LANDING_VIDEO_SIZE.width, height / LANDING_VIDEO_SIZE.height);
                const renderedWidth = LANDING_VIDEO_SIZE.width * scale;
                const renderedHeight = LANDING_VIDEO_SIZE.height * scale;
                const offsetX = (width - renderedWidth) / 2;
                const offsetY = (height - renderedHeight) / 2;
                const nextLeft = offsetX + LANDING_CONTROL_ANCHOR.x * scale;
                const nextTop = offsetY + LANDING_CONTROL_ANCHOR.y * scale;
                const sideInset = Math.min(40, width / 2);
                const bottomInset = Math.min(28, height * 0.08);
                const minTop = Math.min(160, Math.max(0, height - bottomInset));
                const maxTop = Math.max(minTop, height - bottomInset);
                setControlAnchor({
                    left: Math.min(Math.max(nextLeft, sideInset), width - sideInset),
                    top: Math.min(Math.max(nextTop, minTop), maxTop),
                });
            });
        };
        updateControlAnchor();
        const resizeObserver = typeof ResizeObserver === 'undefined'
            ? null
            : new ResizeObserver(updateControlAnchor);
        resizeObserver?.observe(root);
        window.addEventListener('resize', updateControlAnchor);
        return () => {
            window.cancelAnimationFrame(frameId);
            resizeObserver?.disconnect();
            window.removeEventListener('resize', updateControlAnchor);
        };
    }, []);
    const handleStart = useCallback(() => {
        if (isTransitioning) {
            return;
        }
        setIsTransitioning(true);
        setPhase('map');
    }, [isTransitioning, setPhase]);
    return (<div ref={rootRef} className="relative flex items-center justify-center w-full overflow-hidden" style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            fontFamily: '"演示秋鸿楷", "YanShi QiuHongKai", var(--font-serif), "Noto Serif SC", SimSun, STSong, serif',
        }}>
      
      <video ref={part1Ref} autoPlay muted playsInline preload="auto" onEnded={handlePart1End} aria-hidden="true" style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            pointerEvents: 'none',
        }}>
        <source src="/part1.mp4" type="video/mp4"/>
      </video>

      
      <video ref={part2Ref} muted loop playsInline preload="auto" aria-hidden="true" style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            pointerEvents: 'none',
            opacity: showPart2 ? 1 : 0,
            transition: 'opacity 0.01s ease',
        }}>
        <source src="/part2.mp4" type="video/mp4"/>
      </video>

      
      <div style={{
            position: 'absolute',
            ...(controlAnchor
                ? {
                    left: controlAnchor.left,
                    top: controlAnchor.top,
                    transform: 'translate(-50%, -100%)',
                }
                : {
                    bottom: 'clamp(92px, 15vh, 190px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                }),
            zIndex: 10,
            maxWidth: '880px',
            width: '100%',
            padding: '0 2rem',
            textAlign: 'center',
        }}>
        <div style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
          <button ref={startButtonRef} type="button" onClick={handleStart} disabled={isTransitioning} style={{
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
            boxShadow: 'inset 0 0 0 3px transparent, inset 0 0 0 4px rgba(200, 169, 126, 0.3), 0 12px 28px rgba(139, 107, 71, 0.09)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            willChange: 'transform, opacity',
        }} onMouseEnter={(event) => {
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
        }} onMouseLeave={(event) => {
            event.currentTarget.style.transform = 'translateY(0)';
            event.currentTarget.style.borderColor = '#c8a97e';
            event.currentTarget.style.boxShadow =
                'inset 0 0 0 3px transparent, inset 0 0 0 4px rgba(200, 169, 126, 0.3), 0 12px 28px rgba(139, 107, 71, 0.09)';
            for (const node of Array.from(event.currentTarget.querySelectorAll('[data-corner="true"]'))) {
                (node as HTMLSpanElement).style.borderColor = '#c8a97e';
            }
        }}>
            {[
            { top: 8, left: 8, borderTop: '1.5px solid #c8a97e', borderLeft: '1.5px solid #c8a97e' },
            { top: 8, right: 8, borderTop: '1.5px solid #c8a97e', borderRight: '1.5px solid #c8a97e' },
            { bottom: 8, left: 8, borderBottom: '1.5px solid #c8a97e', borderLeft: '1.5px solid #c8a97e' },
            { bottom: 8, right: 8, borderBottom: '1.5px solid #c8a97e', borderRight: '1.5px solid #c8a97e' },
        ].map((corner, index) => (<span key={index} data-corner="true" aria-hidden="true" style={{
                position: 'absolute',
                width: 14,
                height: 14,
                transition: 'border-color 0.35s ease',
                ...corner,
            }}/>))}
            <span style={{
            position: 'relative',
            zIndex: 1,
            fontSize: 'clamp(1.3rem, 1.8vw, 1.5rem)',
            fontFamily: '"FangSong", "仿宋", "STFangsong", serif',
            fontWeight: 700,
            letterSpacing: '0.1em',
        }}>
              踏上旅途
            </span>
          </button>
          <div style={{
            fontSize: '0.7rem',
            color: '#b39a72',
            marginTop: '1rem',
            letterSpacing: '0.14em',
        }}>
            点击开启你的建筑探索之旅
          </div>
        </div>
      </div>
    </div>);
}
