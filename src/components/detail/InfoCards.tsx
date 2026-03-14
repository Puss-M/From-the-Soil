'use client';

import { useMemo, useState } from 'react';
import { StationDetailData } from '@/data/stationDetails';

interface Props {
  detail: StationDetailData;
  stationName: string;
}

type DetailKey = keyof StationDetailData;

type CardConfig = {
  key: DetailKey;
  icon: string;
  label: string;
  color: string;
  accent: string;
  background: string;
  english: string;
  size: 'hero' | 'medium' | 'small';
};

const CARD_CONFIG: CardConfig[] = [
  {
    key: 'classification',
    icon: '📐',
    label: '建筑分类',
    english: 'Classification',
    color: '#6b4e2e',
    accent: '#c4a882',
    background: 'linear-gradient(145deg, rgba(247,240,227,0.98), rgba(236,220,194,0.92))',
    size: 'hero',
  },
  {
    key: 'materials',
    icon: '🧱',
    label: '建筑材料',
    english: 'Materials',
    color: '#5c4a3a',
    accent: '#b78a56',
    background: 'linear-gradient(145deg, rgba(241,232,218,0.98), rgba(227,206,176,0.92))',
    size: 'hero',
  },
  {
    key: 'defense',
    icon: '🛡️',
    label: '防御体系',
    english: 'Defense',
    color: '#6a3f2a',
    accent: '#8b6b47',
    background: 'linear-gradient(145deg, rgba(247,240,227,0.95), rgba(230,216,198,0.88))',
    size: 'medium',
  },
  {
    key: 'folklore',
    icon: '🎭',
    label: '构件民俗含义',
    english: 'Folklore',
    color: '#6b4d3e',
    accent: '#a37a58',
    background: 'linear-gradient(145deg, rgba(248,243,235,0.95), rgba(235,223,209,0.9))',
    size: 'medium',
  },
  {
    key: 'distribution',
    icon: '🗺️',
    label: '地理分布',
    english: 'Distribution',
    color: '#5f5243',
    accent: '#8f7758',
    background: 'rgba(255,255,255,0.72)',
    size: 'small',
  },
  {
    key: 'heating',
    icon: '🔥',
    label: '取暖方式',
    english: 'Heating',
    color: '#7a4f2f',
    accent: '#c47c3c',
    background: 'rgba(255,255,255,0.72)',
    size: 'small',
  },
  {
    key: 'moistureProof',
    icon: '💧',
    label: '防潮方式',
    english: 'Moisture Proof',
    color: '#4f5e5c',
    accent: '#7b9b98',
    background: 'rgba(255,255,255,0.72)',
    size: 'small',
  },
];

const clampMap: Record<CardConfig['size'], number> = {
  hero: 4,
  medium: 4,
  small: 4,
};

const layoutMap: Record<CardConfig['size'], { gridColumn: string; minHeight: number }> = {
  hero: { gridColumn: 'span 2', minHeight: 280 },
  medium: { gridColumn: 'span 2', minHeight: 170 },
  small: { gridColumn: 'span 1', minHeight: 170 },
};

export function InfoCards({ detail, stationName }: Props) {
  const [expandedMap, setExpandedMap] = useState<Partial<Record<DetailKey, boolean>>>({});

  const cards = useMemo(
    () =>
      CARD_CONFIG.filter((config) => {
        const content = detail[config.key];
        return typeof content === 'string' && content.trim() && content !== '无';
      }),
    [detail]
  );

  return (
    <div style={{ marginBottom: 48 }}>
      <style>{`
        @media (max-width: 767px) {
          .detail-bento-grid {
            grid-template-columns: 1fr !important;
          }
          .detail-bento-card {
            grid-column: span 1 !important;
            min-height: auto !important;
          }
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 18,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 4, height: 28, background: '#c4a882', borderRadius: 999 }} />
          <div>
            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#3a2a1a',
                margin: 0,
                fontFamily: 'var(--font-serif, serif)',
                letterSpacing: 2,
              }}
            >
              建筑基因档案
            </h2>
            <div
              style={{
                marginTop: 4,
                fontSize: 11,
                color: '#a08b73',
                letterSpacing: 3,
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Bento Architecture Profile
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '8px 14px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(196,168,130,0.24)',
            color: '#8b7355',
            fontSize: 12,
            letterSpacing: 1,
            boxShadow: '0 8px 24px rgba(92,74,58,0.05)',
          }}
        >
          {stationName}
        </div>
      </div>

      <div
        className="detail-bento-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gridTemplateRows: 'auto',
          gap: 16,
          alignItems: 'stretch',
        }}
      >
        {cards.map((config) => {
          const content = detail[config.key] ?? '';
          const isExpanded = Boolean(expandedMap[config.key]);
          const layout = layoutMap[config.size];
          const shouldToggle = content.length > 120;

          return (
            <div
              key={config.key}
              className="detail-bento-card"
              style={{
                gridColumn: layout.gridColumn,
                minHeight: layout.minHeight,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 24,
                padding: config.size === 'hero' ? '24px 26px' : '20px 22px',
                border: '1px solid rgba(196,168,130,0.18)',
                background: config.background,
                boxShadow: '0 16px 36px rgba(92,74,58,0.08)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                transition: 'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
                event.currentTarget.style.boxShadow = '0 24px 44px rgba(92,74,58,0.14)';
                event.currentTarget.style.borderColor = 'rgba(196,168,130,0.34)';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform = 'translateY(0) scale(1)';
                event.currentTarget.style.boxShadow = '0 16px 36px rgba(92,74,58,0.08)';
                event.currentTarget.style.borderColor = 'rgba(196,168,130,0.18)';
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: -40,
                  right: -32,
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${config.accent}22 0%, transparent 70%)`,
                }}
              />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 14,
                  marginBottom: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div
                    style={{
                      width: config.size === 'hero' ? 54 : 42,
                      height: config.size === 'hero' ? 54 : 42,
                      borderRadius: config.size === 'hero' ? 18 : 14,
                      background: `${config.accent}1f`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: config.size === 'hero' ? 26 : 22,
                      boxShadow: `inset 0 0 0 1px ${config.accent}22`,
                      flexShrink: 0,
                    }}
                  >
                    {config.icon}
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: config.size === 'hero' ? 18 : 15,
                        fontWeight: 700,
                        color: config.color,
                        fontFamily: 'var(--font-serif, serif)',
                        letterSpacing: 1.2,
                      }}
                    >
                      {config.label}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 10,
                        color: '#a08b73',
                        letterSpacing: 2.4,
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {config.english}
                    </div>
                  </div>
                </div>

                {shouldToggle && (
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedMap((current) => ({
                        ...current,
                        [config.key]: !current[config.key],
                      }))
                    }
                    style={{
                      border: 'none',
                      background: 'rgba(255,255,255,0.66)',
                      color: '#8b7355',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      borderRadius: 999,
                      padding: '6px 10px',
                      boxShadow: '0 6px 18px rgba(92,74,58,0.08)',
                      flexShrink: 0,
                    }}
                  >
                    {isExpanded ? '收起' : '展开'}
                  </button>
                )}
              </div>

              <div
                style={{
                  color: '#4e4133',
                  fontSize: config.size === 'small' ? 12.5 : 13.5,
                  lineHeight: config.size === 'small' ? 1.8 : 1.95,
                  whiteSpace: 'pre-wrap',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: isExpanded ? 'unset' : clampMap[config.size],
                  overflow: 'hidden',
                }}
              >
                {content}
              </div>

              <div
                style={{
                  marginTop: 16,
                  paddingTop: 12,
                  borderTop: '1px solid rgba(196,168,130,0.18)',
                  fontSize: 11,
                  color: '#a08b73',
                  letterSpacing: 1.4,
                }}
              >
                {config.size === 'hero'
                  ? '核心建筑基因'
                  : config.size === 'medium'
                    ? '关键文化与空间策略'
                    : '补充环境响应信息'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
