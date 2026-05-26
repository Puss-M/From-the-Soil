'use client';
import { Station } from '@/types';
import { HeritageInfo } from '@/data/heritageData';
import { WorldClimData } from '@/data/climateDetails';
interface Props {
    station: Station;
    heritage?: HeritageInfo[];
    climate?: WorldClimData;
}
function getHeritageBadge(level: string) {
    if (level.includes('国家'))
        return { color: '#c41d1d', bg: '#fef2f2', border: '#fca5a5', icon: '🏆' };
    if (level.includes('省'))
        return { color: '#b45309', bg: '#fffbeb', border: '#fcd34d', icon: '🥈' };
    if (level.includes('市'))
        return { color: '#047857', bg: '#ecfdf5', border: '#6ee7b7', icon: '🥉' };
    return { color: '#6b7280', bg: '#f9fafb', border: '#d1d5db', icon: '📋' };
}
export function StationHeader({ station, heritage, climate }: Props) {
    const heritageLevel = heritage?.[0]?.level || '';
    const badge = getHeritageBadge(heritageLevel);
    const visibleCardsCount = [
        !!heritageLevel,
        !!climate,
        !!climate,
        !!climate
    ].filter(Boolean).length;
    const borderImage = visibleCardsCount === 4
        ? 'url(/容器边框短.png)'
        : 'url(/容器边框长.png)';
    return (<div style={{ marginBottom: 40, paddingTop: 20 }}>
      
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            marginBottom: 16,
        }}>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #c4a882)' }}/>
          <span style={{ fontSize: 12, color: '#a08b73', letterSpacing: 6, fontWeight: 500 }}>
            {station.region} · {station.nameEn}
          </span>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, #c4a882, transparent)' }}/>
        </div>

        
        <h1 style={{
            fontSize: '2.8rem',
            fontWeight: 800,
            color: '#3a2a1a',
            letterSpacing: '0.12em',
            margin: '0 0 12px',
            fontFamily: 'var(--font-serif, serif)',
        }}>
          {station.buildingGene}
        </h1>

        
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 20px',
            background: 'rgba(196, 168, 130, 0.1)',
            borderRadius: 20,
            border: '1px solid rgba(196, 168, 130, 0.3)',
        }}>
          <span style={{ fontSize: 14, color: '#8b7355', fontWeight: 500 }}>
            {station.buildingGene}
          </span>
          <span style={{ margin: '0 4px', color: '#d4c4b0' }}>·</span>
          <span style={{ fontSize: 13, color: '#a08b73' }}>
            {station.description}
          </span>
        </div>
      </div>

      
      <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 8,
        }}>
        
        {heritageLevel && (<div style={{
                background: 'transparent',
                border: 'none',
                borderRadius: 14,
                padding: '16px 20px',
                minHeight: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                backgroundImage: borderImage,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
            }}>
            <div style={{ width: '100%' }}>
              <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, marginBottom: 2 }}>非遗保护</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111111' }}>
                {heritageLevel}
              </div>
              {heritage && heritage.length > 0 && (<div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                  {heritage[0].projectName}
                </div>)}
            </div>
          </div>)}

        
        {climate && (<div style={{
                background: 'transparent',
                border: 'none',
                borderRadius: 14,
                padding: '16px 20px',
                minHeight: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                backgroundImage: borderImage,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
            }}>
            <div style={{ width: '100%' }}>
              <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, marginBottom: 2 }}>具体位置</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111111', lineHeight: 1.4 }}>
                {climate.location.length > 30 ? climate.location.slice(0, 30) + '...' : climate.location}
              </div>
            </div>
          </div>)}

        
        {climate && (<div style={{
                background: 'transparent',
                border: 'none',
                borderRadius: 14,
                padding: '16px 20px',
                minHeight: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                backgroundImage: borderImage,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
            }}>
            <div style={{ width: '100%' }}>
              <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, marginBottom: 2 }}>气候类型</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111111' }}>
                {climate.climateType}
              </div>
            </div>
          </div>)}

        
        {climate && (<div style={{
                background: 'transparent',
                border: 'none',
                borderRadius: 14,
                padding: '16px 20px',
                minHeight: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                backgroundImage: borderImage,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
            }}>
            <div style={{ width: '100%' }}>
              <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, marginBottom: 2 }}>海拔高度</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#111111' }}>
                {climate.altitude.toFixed(0)} <span style={{ fontSize: 12, fontWeight: 400 }}>m</span>
              </div>
            </div>
          </div>)}
      </div>
    </div>);
}
