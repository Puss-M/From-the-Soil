'use client';

import { StationDetailData } from '@/data/stationDetails';

interface Props {
  detail: StationDetailData;
  stationName: string;
}

const CARD_CONFIG = [
  { key: 'classification' as const, icon: '📐', label: '建筑分类', color: '#92400e', bg: '#fffbeb' },
  { key: 'distribution' as const, icon: '🗺️', label: '地理分布', color: '#1e40af', bg: '#eff6ff' },
  { key: 'defense' as const, icon: '🛡️', label: '防御体系', color: '#991b1b', bg: '#fef2f2' },
  { key: 'materials' as const, icon: '🧱', label: '建筑材料', color: '#6b21a8', bg: '#faf5ff' },
  { key: 'folklore' as const, icon: '🎭', label: '构件民俗含义', color: '#9f1239', bg: '#fff1f2' },
  { key: 'heating' as const, icon: '🔥', label: '取暖方式', color: '#c2410c', bg: '#fff7ed' },
  { key: 'moistureProof' as const, icon: '💧', label: '防潮方式', color: '#0e7490', bg: '#ecfeff' },
];

export function InfoCards({ detail, stationName }: Props) {
  return (
    <div style={{ marginBottom: 48 }}>
      {/* 标题 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
      }}>
        <div style={{ width: 4, height: 24, background: '#c4a882', borderRadius: 2 }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#3a2a1a', margin: 0 }}>
          建筑基因档案
        </h2>
        <span style={{ fontSize: 12, color: '#a08b73' }}>{stationName}</span>
      </div>

      {/* 卡片网格 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 16,
      }}>
        {CARD_CONFIG.map(({ key, icon, label, color, bg }) => {
          const content = detail[key];
          if (!content || content === '无') return null;

          return (
            <div
              key={key}
              style={{
                background: 'white',
                borderRadius: 16,
                padding: '20px 24px',
                border: '1px solid #e8e0d8',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* 卡片头 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                }}>
                  {icon}
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color }}>
                  {label}
                </span>
              </div>
              {/* 卡片内容 */}
              <div style={{
                fontSize: 13,
                lineHeight: 1.8,
                color: '#4a4a4a',
                whiteSpace: 'pre-wrap',
              }}>
                {content.length > 300 ? content.slice(0, 300) + '...' : content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
