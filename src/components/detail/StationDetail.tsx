'use client';

import { useStore } from '@/store/useStore';
import { stationDetails } from '@/data/stationDetails';
import { climateDetails } from '@/data/climateDetails';
import { heritageData } from '@/data/heritageData';
import { decorationData } from '@/data/decorationData';
import { StationHeader } from './StationHeader';
import { InfoCards } from './InfoCards';
import { ClimateCharts } from './ClimateCharts';
import { DecorationPanel } from './DecorationPanel';
import { ModelViewer } from './ModelViewer';
import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* ── Tab 定义 ──────────────────────────────── */
const TABS = [
  { key: 'model',  label: '3D 模型',   icon: '🏛️', subtitle: 'Architectural Model' },
  { key: 'info',   label: '建筑档案',  icon: '📜', subtitle: 'Architecture Profile' },
  { key: 'charts', label: '数据可视化', icon: '📊', subtitle: 'Data Visualization' },
] as const;
type TabKey = (typeof TABS)[number]['key'];

/* ── 主组件 ────────────────────────────────── */
export function StationDetail() {
  const { selectedStation, setPhase } = useStore();
  const [activeTab, setActiveTab] = useState<TabKey>('model');
  const [direction, setDirection] = useState(0);

  const handleTabChange = useCallback((newTab: TabKey) => {
    const oldIdx = TABS.findIndex((t) => t.key === activeTab);
    const newIdx = TABS.findIndex((t) => t.key === newTab);
    setDirection(newIdx > oldIdx ? 1 : -1);
    setActiveTab(newTab);
  }, [activeTab]);

  const goPrev = useCallback(() => {
    const idx = TABS.findIndex((t) => t.key === activeTab);
    if (idx > 0) handleTabChange(TABS[idx - 1].key);
  }, [activeTab, handleTabChange]);

  const goNext = useCallback(() => {
    const idx = TABS.findIndex((t) => t.key === activeTab);
    if (idx < TABS.length - 1) handleTabChange(TABS[idx + 1].key);
  }, [activeTab, handleTabChange]);

  if (!selectedStation) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p>未选择驿站</p>
      </div>
    );
  }

  const sid = selectedStation.id;
  const detail = stationDetails[sid];
  const climate = climateDetails[sid];
  const heritage = heritageData[sid];
  const decorations = decorationData[sid];
  const curTabIdx = TABS.findIndex((t) => t.key === activeTab);

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      display: 'grid',
      gridTemplateRows: '64px 1fr 52px',
      background: '#faf8f5',
    }}>
      {/* ═══ 顶部导航栏 (Row 1) ═══ */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '0 24px',
        borderBottom: '1px solid #e8e0d8',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        zIndex: 50,
      }}>
        {/* 返回按钮 */}
        <button
          onClick={() => setPhase('map')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid #e0d6cc',
            borderRadius: 10,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            color: '#5c4a3a',
            transition: 'all 0.2s',
            marginRight: 24,
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f5f0eb';
            e.currentTarget.style.borderColor = '#c4a882';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = '#e0d6cc';
          }}
        >
          ← 返回地图
        </button>

        {/* 驿站名 */}
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 10,
          flex: 1, minWidth: 0,
        }}>
          <h1 style={{
            fontSize: 20, fontWeight: 700, color: '#3a2a1a', margin: 0,
            fontFamily: 'var(--font-serif, serif)', letterSpacing: 3,
            whiteSpace: 'nowrap',
          }}>
            {selectedStation.name}
          </h1>
          <span style={{
            fontSize: 12, color: '#a08b73', letterSpacing: 2,
            whiteSpace: 'nowrap',
          }}>
            {selectedStation.region} · {selectedStation.nameEn}
          </span>
        </div>

        {/* Tab 按钮组 */}
        <div style={{
          display: 'flex', gap: 4,
          background: '#f0ebe4',
          borderRadius: 12,
          padding: 4,
          flexShrink: 0,
        }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 18px',
                  border: 'none',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#fff' : '#8b7355',
                  background: isActive
                    ? 'linear-gradient(135deg, #8b7355, #6b5842)'
                    : 'transparent',
                  boxShadow: isActive
                    ? '0 2px 8px rgba(107,88,66,0.3)'
                    : 'none',
                  transition: 'all 0.25s ease',
                  letterSpacing: 1,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(139,115,85,0.12)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: 15 }}>{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ 内容区 (Row 2 — CSS Grid 保证 1fr 高度) ═══ */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
      }}>
        <AnimatePresence mode="wait" custom={direction}>
          {/* ── Tab 1: 3D 模型 ── */}
          {activeTab === 'model' && (
            <div key="model-wrap" style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              overflow: 'auto',
              background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0eb 30%, #f0ece6 100%)',
            }}>
              <motion.div
                className="w-full min-h-full"
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } }}
                exit={{ opacity: 0, x: direction > 0 ? -60 : 60, transition: { duration: 0.2 } }}
              >
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px 80px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <StationHeader station={selectedStation} heritage={heritage} climate={climate} />
                  
                  <div style={{
                    marginTop: 32,
                    background: '#fff',
                    borderRadius: 16,
                    border: '1px solid #e8e0d8',
                    boxShadow: '0 8px 32px rgba(92, 74, 58, 0.08)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    // Calculate height: fallback to 600px if viewport is short
                    minHeight: 600,
                    height: 'calc(100vh - 400px)',
                  }}>
                    {/* 模型卡片头部 */}
                    <div style={{
                      padding: '16px 24px',
                      borderBottom: '1px solid #f0ebe4',
                      background: '#faf8f5',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 18 }}>🏛️</span>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#3a2a1a', letterSpacing: 1 }}>
                          3D 建筑场景模拟
                        </h3>
                      </div>
                      <span style={{ fontSize: 11, color: '#a08b73', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                        Interactive Model Viewer
                      </span>
                    </div>

                    {/* 3D 渲染区 */}
                    <div style={{ flex: 1, position: 'relative' }}>
                      <ModelViewer station={selectedStation} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* ── Tab 2: 建筑档案 ── */}
          {activeTab === 'info' && (
            <div key="info-wrap" style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              overflow: 'auto',
              background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0eb 30%, #f0ece6 100%)',
            }}>
              <motion.div
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } }}
                exit={{ opacity: 0, x: direction > 0 ? -60 : 60, transition: { duration: 0.2 } }}
              >
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px 80px' }}>
                  <StationHeader station={selectedStation} heritage={heritage} climate={climate} />
                  {detail && <InfoCards detail={detail} stationName={selectedStation.name} />}
                  {heritage && heritage.length > 0 && (
                    <div style={{ marginTop: 40 }}>
                      <h3 style={{
                        fontSize: 20, fontWeight: 700, color: '#3a2a1a',
                        marginBottom: 20, letterSpacing: 2,
                        fontFamily: 'var(--font-serif, serif)',
                        display: 'flex', alignItems: 'center', gap: 10,
                      }}>
                        <span style={{ fontSize: 22 }}>🏛️</span>
                        非物质文化遗产
                      </h3>
                      {heritage.map((h, i) => (
                        <div key={i} style={{
                          background: '#fff',
                          border: '1px solid #e8e0d8',
                          borderRadius: 16,
                          padding: '24px 28px',
                          marginBottom: 16,
                          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        }}>
                          <div style={{
                            display: 'flex', gap: 12, alignItems: 'center',
                            marginBottom: 12, flexWrap: 'wrap',
                          }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 12px',
                              background: h.level.includes('国家') ? '#fef2f2' : h.level.includes('省') ? '#fffbeb' : '#ecfdf5',
                              color: h.level.includes('国家') ? '#c41d1d' : h.level.includes('省') ? '#b45309' : '#047857',
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 600,
                            }}>
                              {h.level}
                            </span>
                            <span style={{ fontWeight: 700, color: '#3a2a1a', fontSize: 16 }}>
                              {h.projectName}
                            </span>
                            <span style={{ fontSize: 12, color: '#9ca3af' }}>
                              {h.projectCode}
                            </span>
                          </div>
                          <div style={{ fontSize: 13, color: '#5c4a3a', lineHeight: 1.9, marginBottom: 10 }}>
                            <span style={{ color: '#8b7355' }}>地区：{h.region}</span>
                          </div>
                          {h.description && h.description !== '无' && (
                            <div style={{
                              fontSize: 13.5, color: '#5c4a3a', lineHeight: 2,
                              maxHeight: 240, overflow: 'auto',
                              padding: '12px 16px',
                              background: '#faf8f5',
                              borderRadius: 10,
                              border: '1px solid #f0ebe4',
                            }}>
                              {h.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {/* ── Tab 3: 数据可视化 ── */}
          {activeTab === 'charts' && (
            <div key="charts-wrap" style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              overflow: 'auto',
              background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0eb 30%, #f0ece6 100%)',
            }}>
              <motion.div
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } }}
                exit={{ opacity: 0, x: direction > 0 ? -60 : 60, transition: { duration: 0.2 } }}
              >
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px 80px' }}>
                  <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 16, marginBottom: 12,
                    }}>
                      <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #c4a882)' }} />
                      <span style={{ fontSize: 11, color: '#a08b73', letterSpacing: 6 }}>
                        DATA VISUALIZATION
                      </span>
                      <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, #c4a882, transparent)' }} />
                    </div>
                    <h2 style={{
                      fontSize: '1.8rem', fontWeight: 800, color: '#3a2a1a',
                      letterSpacing: 4, margin: 0,
                      fontFamily: 'var(--font-serif, serif)',
                    }}>
                      {selectedStation.name} · 数据可视化
                    </h2>
                  </div>
                  {selectedStation.id === 'beijing' && (
                    <div style={{
                      marginTop: 32,
                      width: '100%',
                      height: 800,
                      background: 'transparent',
                      borderRadius: 16,
                      overflow: 'hidden'
                    }}>
                      <iframe
                        src="https://sugar.aipage.com/dashboard/7bd937bff3e778c380e8a1ec5b7eb297"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="北京四合院数据可视化"
                      />
                    </div>
                  )}
                  {climate && <ClimateCharts climate={climate} stationName={selectedStation.name} />}
                  {decorations && decorations.length > 0 && (
                    <DecorationPanel decorations={decorations} stationName={selectedStation.name} />
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ 底部导航栏 (Row 3) ═══ */}
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: 16, padding: '0 24px',
        borderTop: '1px solid #e8e0d8',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
      }}>
        <button
          onClick={goPrev}
          disabled={curTabIdx === 0}
          style={{
            padding: '8px 20px',
            border: '1px solid #e0d6cc',
            borderRadius: 10,
            background: curTabIdx === 0 ? '#f5f0eb' : '#fff',
            color: curTabIdx === 0 ? '#c4b89c' : '#5c4a3a',
            cursor: curTabIdx === 0 ? 'default' : 'pointer',
            fontSize: 13,
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
        >
          ← 上一页
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              style={{
                width: activeTab === tab.key ? 24 : 8,
                height: 8,
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === tab.key ? '#8b7355' : '#d4c5b0',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
          <span style={{ fontSize: 11, color: '#a08b73', marginLeft: 4 }}>
            {curTabIdx + 1} / {TABS.length}
          </span>
        </div>
        <button
          onClick={goNext}
          disabled={curTabIdx === TABS.length - 1}
          style={{
            padding: '8px 20px',
            border: '1px solid #e0d6cc',
            borderRadius: 10,
            background: curTabIdx === TABS.length - 1 ? '#f5f0eb' : '#fff',
            color: curTabIdx === TABS.length - 1 ? '#c4b89c' : '#5c4a3a',
            cursor: curTabIdx === TABS.length - 1 ? 'default' : 'pointer',
            fontSize: 13,
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
        >
          下一页 →
        </button>
      </div>
    </div>
  );
}
