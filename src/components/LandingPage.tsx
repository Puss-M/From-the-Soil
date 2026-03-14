'use client';

import { useStore } from '@/store/useStore';
import {
  motion,
  useAnimationControls,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

type Particle = {
  x: number;
  y: number;
  size: number;
  speedY: number;
  driftX: number;
};

const TITLE_CHARS = ['千', '里', '江', '山'];
const ENGLISH_SUBTITLE = 'FROM THE SOIL';

const titleContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.5,
    },
  },
};

const titleCharVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const textExitVariants: Variants = {
  initial: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

function usePointerCapabilities() {
  const [isTouchLike, setIsTouchLike] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(hover: none), (pointer: coarse)');
    const update = () => {
      setIsTouchLike(mediaQuery.matches);
    };

    update();
    mediaQuery.addEventListener('change', update);

    return () => {
      mediaQuery.removeEventListener('change', update);
    };
  }, []);

  return isTouchLike;
}

function useParticleCanvas(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  disabled: boolean
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || disabled || typeof window === 'undefined') {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    let animationFrameId = 0;
    const particles: Particle[] = [];
    const particleCount = 42;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);
    };

    const resetParticle = (particle: Particle, randomY = true) => {
      particle.x = Math.random() * window.innerWidth;
      particle.y = randomY
        ? Math.random() * window.innerHeight
        : -10 - Math.random() * 120;
      particle.size = 1 + Math.random() * 2;
      particle.speedY = 0.2 + Math.random() * 0.3;
      particle.driftX = (Math.random() - 0.5) * 0.18;
    };

    resize();

    for (let index = 0; index < particleCount; index += 1) {
      const particle = {
        x: 0,
        y: 0,
        size: 0,
        speedY: 0,
        driftX: 0,
      };
      resetParticle(particle);
      particles.push(particle);
    }

    const render = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.fillStyle = 'rgba(200, 169, 126, 0.08)';

      for (const particle of particles) {
        particle.y += particle.speedY;
        particle.x += particle.driftX;

        if (
          particle.y > window.innerHeight + 12 ||
          particle.x < -20 ||
          particle.x > window.innerWidth + 20
        ) {
          resetParticle(particle, false);
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    animationFrameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef, disabled]);
}

function useMouseHalo(
  disabled: boolean,
  onPointerMove?: (point: { x: number; y: number }) => void
) {
  const [position, setPosition] = useState({ x: -999, y: -999 });
  const targetRef = useRef({ x: -999, y: -999 });
  const currentRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    if (disabled || typeof window === 'undefined') {
      targetRef.current = { x: -999, y: -999 };
      currentRef.current = { x: -999, y: -999 };
      return;
    }

    let animationFrameId = 0;

    const handlePointerMove = (event: MouseEvent) => {
      const next = { x: event.clientX, y: event.clientY };
      targetRef.current = next;
      onPointerMove?.(next);
    };

    const animate = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.1;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.1;

      setPosition({
        x: currentRef.current.x,
        y: currentRef.current.y,
      });

      animationFrameId = window.requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handlePointerMove);
    animationFrameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, [disabled, onPointerMove]);

  return position;
}

export function LandingPage() {
  const { setPhase } = useStore();
  const prefersReducedMotion = useReducedMotion();
  const isTouchLike = usePointerCapabilities();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [showInkMask, setShowInkMask] = useState(false);
  const [contentExited, setContentExited] = useState(false);
  const [buttonRippleOrigin, setButtonRippleOrigin] = useState({ x: 0, y: 0 });
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayControls = useAnimationControls();

  useParticleCanvas(canvasRef, Boolean(prefersReducedMotion));

  const handlePointerMove = useCallback(
    ({ x, y }: { x: number; y: number }) => {
      if (!rootRef.current || prefersReducedMotion) {
        return;
      }

      const rect = rootRef.current.getBoundingClientRect();
      const normalizedX = (x - rect.left - rect.width / 2) / rect.width;
      const normalizedY = (y - rect.top - rect.height / 2) / rect.height;
      setParallaxOffset({
        x: normalizedX,
        y: normalizedY,
      });
    },
    [prefersReducedMotion]
  );

  const haloPosition = useMouseHalo(
    Boolean(prefersReducedMotion) || isTouchLike,
    handlePointerMove
  );

  const startButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleStart = useCallback(async () => {
    if (isTransitioning || !startButtonRef.current || !rootRef.current) {
      return;
    }

    const buttonRect = startButtonRef.current.getBoundingClientRect();
    const rootRect = rootRef.current.getBoundingClientRect();
    setButtonRippleOrigin({
      x: buttonRect.left - rootRect.left + buttonRect.width / 2,
      y: buttonRect.top - rootRect.top + buttonRect.height / 2,
    });
    setIsTransitioning(true);
    setShowRipple(true);
    setShowInkMask(true);
    setContentExited(true);

    if (prefersReducedMotion) {
      setPhase('map');
      return;
    }

    await overlayControls.start({
      clipPath: 'circle(150% at 50% 50%)',
      transition: {
        duration: 1.2,
        ease: [0.4, 0, 0.2, 1],
      },
    });
    setPhase('map');
  }, [isTransitioning, overlayControls, prefersReducedMotion, setPhase]);

  const mountainTransform = (factor: number) =>
    prefersReducedMotion
      ? 'translate3d(0, 0, 0)'
      : `translate3d(${parallaxOffset.x * factor * 100}px, ${parallaxOffset.y * factor * -60}px, 0)`;

  return (
    <div
      ref={rootRef}
      className="relative flex items-center justify-center w-full overflow-hidden"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background:
          'linear-gradient(160deg, #f7f0e3 0%, #f1e6d3 28%, #e3cdaa 66%, #d3b28b 100%)',
        fontFamily: 'var(--font-serif), "Noto Serif SC", SimSun, STSong, serif',
      }}
    >
      <style>{`
        @keyframes inkPulseSlow {
          0%, 100% { transform: scale(0.9); opacity: 0.03; }
          50% { transform: scale(1.1); opacity: 0.1; }
        }
        @keyframes inkPulseWide {
          0%, 100% { transform: scale(0.94); opacity: 0.04; }
          50% { transform: scale(1.08); opacity: 0.09; }
        }
        @keyframes titleBreath {
          0%, 100% { transform: scale(0.995); }
          50% { transform: scale(1.005); }
        }
        @media (prefers-reduced-motion: reduce) {
          .landing-ink,
          .landing-title-breath {
            animation: none !important;
          }
        }
      `}</style>

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          willChange: 'transform',
          opacity: prefersReducedMotion ? 0 : 1,
        }}
      />

      {!prefersReducedMotion && !isTouchLike && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: haloPosition.x - 150,
            top: haloPosition.y - 150,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(200, 169, 126, 0.06) 0%, rgba(200, 169, 126, 0.025) 35%, transparent 72%)',
            pointerEvents: 'none',
            zIndex: 2,
            mixBlendMode: 'multiply',
            willChange: 'transform',
          }}
        />
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage: `
            radial-gradient(circle at 18% 16%, rgba(247, 240, 227, 0.38) 0%, transparent 38%),
            radial-gradient(circle at 82% 20%, rgba(200, 169, 126, 0.12) 0%, transparent 45%),
            linear-gradient(180deg, rgba(247, 240, 227, 0.1) 0%, rgba(58, 46, 33, 0.02) 100%)
          `,
        }}
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        <div
          className="landing-ink"
          style={{
            position: 'absolute',
            top: '-8%',
            right: '-6%',
            width: '42vw',
            height: '42vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 107, 71, 0.07) 0%, transparent 72%)',
            animation: 'inkPulseSlow 13s ease-in-out infinite',
          }}
        />
        <div
          className="landing-ink"
          style={{
            position: 'absolute',
            bottom: '-14%',
            left: '-9%',
            width: '54vw',
            height: '54vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 107, 71, 0.08) 0%, transparent 68%)',
            animation: 'inkPulseWide 15s ease-in-out infinite 1.8s',
          }}
        />
        <div
          className="landing-ink"
          style={{
            position: 'absolute',
            top: '10%',
            right: '18%',
            width: '18vw',
            height: '18vw',
            minWidth: 180,
            minHeight: 180,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 107, 71, 0.06) 0%, transparent 70%)',
            animation: 'inkPulseSlow 12s ease-in-out infinite 0.8s',
          }}
        />
      </div>

      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 2 }}
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
      >
        <rect
          x="30"
          y="20"
          width="940"
          height="560"
          fill="none"
          stroke="#c8a97e"
          strokeWidth="0.6"
          opacity="0.25"
        />
        <rect
          x="45"
          y="35"
          width="910"
          height="530"
          fill="none"
          stroke="#c8a97e"
          strokeWidth="0.3"
          opacity="0.15"
        />
        <g opacity="0.2" stroke="#8b6b47" fill="none" strokeWidth="0.8">
          <path d="M30,20 L30,60 L70,60 L70,45 L45,45 L45,20" />
          <path d="M35,25 L35,55 L65,55 L65,40 L50,40 L50,25" />
          <path d="M970,20 L970,60 L930,60 L930,45 L955,45 L955,20" />
          <path d="M965,25 L965,55 L935,55 L935,40 L950,40 L950,25" />
          <path d="M30,580 L30,540 L70,540 L70,555 L45,555 L45,580" />
          <path d="M35,575 L35,545 L65,545 L65,560 L50,560 L50,575" />
          <path d="M970,580 L970,540 L930,540 L930,555 L955,555 L955,580" />
          <path d="M965,575 L965,545 L935,545 L935,560 L950,560 L950,575" />
        </g>
      </svg>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{ height: '22vh', zIndex: 3 }}
      >
        <svg
          viewBox="0 0 1200 220"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '15vh',
            bottom: 0,
            transform: mountainTransform(0.01),
            transition: 'transform 220ms ease-out',
          }}
        >
          <path
            d="M0,100 Q150,60 300,85 T600,70 Q750,90 900,75 T1200,80 L1200,220 L0,220 Z"
            fill="rgba(139, 107, 71, 0.06)"
          />
        </svg>
        <svg
          viewBox="0 0 1200 220"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '10vh',
            bottom: 0,
            transform: mountainTransform(0.02),
            transition: 'transform 220ms ease-out',
          }}
        >
          <path
            d="M0,130 Q120,92 260,114 T520,108 Q650,85 790,118 T1200,102 L1200,220 L0,220 Z"
            fill="rgba(139, 107, 71, 0.1)"
          />
        </svg>
        <svg
          viewBox="0 0 1200 220"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '6vh',
            bottom: 0,
            transform: mountainTransform(0.03),
            transition: 'transform 220ms ease-out',
          }}
        >
          <path
            d="M0,145 Q90,118 180,135 T360,124 Q470,94 590,130 T820,122 Q940,95 1040,128 T1200,120 L1200,220 L0,220 Z"
            fill="rgba(139, 107, 71, 0.15)"
          />
        </svg>
      </div>

      {showRipple && (
        <motion.div
          aria-hidden="true"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 50, opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'absolute',
            left: buttonRippleOrigin.x - 24,
            top: buttonRippleOrigin.y - 24,
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(58, 46, 33, 0.03)',
            pointerEvents: 'none',
            zIndex: 8,
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          maxWidth: '880px',
          width: '100%',
          padding: '0 2rem',
          textAlign: 'center',
        }}
      >
        <motion.div
          variants={textExitVariants}
          initial="initial"
          animate={contentExited ? 'exit' : 'initial'}
        >
          <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.03,
                delayChildren: 1.05,
              },
            },
          }}
          style={{
            fontSize: '0.68rem',
            letterSpacing: '0.8em',
            color: '#9d815a',
            marginBottom: '2.5rem',
            display: 'inline-flex',
            paddingLeft: '0.8em',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {ENGLISH_SUBTITLE.split('').map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              variants={{
                hidden: {
                  opacity: 0,
                  letterSpacing: '0.8em',
                },
                visible: {
                  opacity: 1,
                  letterSpacing: '0.5em',
                  transition: {
                    duration: 0.45,
                    ease: 'easeOut',
                  },
                },
              }}
              style={{
                display: 'inline-block',
                whiteSpace: char === ' ' ? 'pre' : 'normal',
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>

        <motion.h1
          className="landing-title-breath"
          variants={titleContainerVariants}
          initial="hidden"
          animate="visible"
          style={{
            fontSize: 'clamp(3.8rem, 9vw, 6.8rem)',
            fontWeight: 700,
            color: '#3a2e21',
            letterSpacing: '0.34em',
            lineHeight: 1.1,
            textShadow: '3px 3px 12px rgba(139, 107, 71, 0.08)',
            marginBottom: '1.25rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '0.28em',
            paddingLeft: '0.34em',
            animation: prefersReducedMotion ? 'none' : 'titleBreath 6s ease-in-out infinite 2.2s',
            transformOrigin: 'center center',
          }}
        >
          {TITLE_CHARS.map((char) => (
            <motion.span
              key={char}
              variants={titleCharVariants}
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
          }}
        >
          <motion.div
            initial={{ scaleX: 0, opacity: 0.5 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.15, ease: [0.4, 0, 0.2, 1] }}
            style={{
              width: 92,
              height: 1,
              transformOrigin: 'center center',
              background: 'linear-gradient(90deg, transparent, #c8a97e, transparent)',
            }}
          />
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 1.45, ease: 'easeOut' }}
            style={{
              fontSize: 'clamp(1.08rem, 2.4vw, 1.4rem)',
              letterSpacing: '0.32em',
              color: '#8b6b47',
              fontWeight: 400,
              whiteSpace: 'nowrap',
            }}
          >
            从土而生 建筑方言
          </motion.span>
          <motion.div
            initial={{ scaleX: 0, opacity: 0.5 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.15, ease: [0.4, 0, 0.2, 1] }}
            style={{
              width: 92,
              height: 1,
              transformOrigin: 'center center',
              background: 'linear-gradient(90deg, transparent, #c8a97e, transparent)',
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.55, ease: 'easeOut' }}
          style={{
            maxWidth: '640px',
            margin: '0 auto 3rem',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(0.88rem, 1.2vw, 0.98rem)',
              color: '#8b6b47',
              letterSpacing: '0.14em',
              lineHeight: 2,
              marginBottom: '0.4rem',
            }}
          >
            探索中国传统民居在不同气候带中的适应性智慧
          </p>
          <p
            style={{
              fontSize: 'clamp(0.88rem, 1.2vw, 0.98rem)',
              color: '#8b6b47',
              letterSpacing: '0.14em',
              lineHeight: 2,
              marginBottom: '0.8rem',
            }}
          >
            从气候中提炼规则，从建筑中读懂土地
          </p>
          <p
            style={{
              fontSize: 'clamp(0.78rem, 1vw, 0.86rem)',
              color: '#9d815a',
              letterSpacing: '0.12em',
              lineHeight: 2,
            }}
          >
            穿越山川河谷与气候分界线，在温度、湿度与风向的变化中，观察民居形态如何顺应环境细腻生长。
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.9, ease: 'easeOut' }}
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
              transform: isTransitioning ? 'translateY(0)' : 'translateY(0)',
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
            <span style={{ position: 'relative', zIndex: 1 }}>踏上旅途</span>
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
        </motion.div>
        </motion.div>
      </div>

      <footer
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '1.5rem',
          textAlign: 'center',
          fontSize: '0.7rem',
          color: '#b39a72',
          letterSpacing: '0.15em',
          zIndex: 10,
          opacity: contentExited ? 0 : 1,
          transform: contentExited ? 'translateY(-20px)' : 'translateY(0)',
          transition: 'transform 0.6s ease, opacity 0.6s ease',
        }}
      >
        © 2025 从土而生 · From the Soil · 计算机设计大赛
      </footer>

      {showInkMask && (
        <motion.div
          aria-hidden="true"
          initial={{ clipPath: 'circle(0% at 50% 50%)' }}
          animate={overlayControls}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#3a2e21',
            zIndex: 20,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}
