'use client';

import { useStore } from '@/store/useStore';
import { stationDetails } from '@/data/stationDetails';
import { climateDetails } from '@/data/climateDetails';
import { heritageData } from '@/data/heritageData';
import { decorationData } from '@/data/decorationData';
import { ArchitectureKnowledgeGraph } from './ArchitectureKnowledgeGraph';
import { StationHeader } from './StationHeader';
import { InfoCards } from './InfoCards';
import { ModelViewer } from './ModelViewer';
import { HeritageDashboard } from './HeritageDashboard';
import { VideoChronicle } from './VideoChronicle';
import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* ── Tab 定义 ──────────────────────────────── */
const TABS = [
  { key: 'model',  label: '3D 模型',   icon: '🏛️', subtitle: 'Architectural Model' },
  { key: 'info',   label: '建筑档案',  icon: '📜', subtitle: 'Architecture Profile' },
  { key: 'heritage', label: '风物志', icon: '🏺', subtitle: 'Heritage Dashboard' },
  { key: 'video', label: '影像志', icon: '🎬', subtitle: 'Video Chronicle' },
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

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      display: 'grid',
      gridTemplateRows: '72px 1fr',
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
            fontSize: 15,
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
            fontSize: 24, fontWeight: 700, color: '#3a2a1a', margin: 0,
            fontFamily: 'var(--font-serif, serif)', letterSpacing: 3,
            whiteSpace: 'nowrap',
          }}>
            {selectedStation.name}
          </h1>
          <span style={{
            fontSize: 14, color: '#a08b73', letterSpacing: 2,
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
                  padding: '11px 22px',
                  border: 'none',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontSize: 15,
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
                <span style={{ fontSize: 16 }}>{tab.icon}</span>
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
                  {detail && (
                    <>
                      <InfoCards detail={detail} stationName={selectedStation.name} />

                      <div style={{ marginTop: 40, marginBottom: 44 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 16,
                            marginBottom: 20,
                            flexWrap: 'wrap',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 4, height: 26, background: '#c4a882', borderRadius: 999 }} />
                            <div>
                              <h3 style={{
                                fontSize: 20, fontWeight: 700, color: '#3a2a1a',
                                margin: 0, letterSpacing: 2, fontFamily: 'var(--font-serif, serif)',
                              }}>
                                建筑基因知识图谱
                              </h3>
                              <div style={{
                                marginTop: 4, fontSize: 11, color: '#a08b73',
                                letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'var(--font-mono)',
                              }}>
                                Architecture Gene Knowledge Graph
                              </div>
                            </div>
                          </div>

                          <div style={{
                            padding: '8px 14px',
                            background: 'rgba(255,255,255,0.7)',
                            border: '1px solid rgba(196,168,130,0.24)',
                            borderRadius: 999,
                            color: '#8b7355',
                            fontSize: 12,
                            letterSpacing: 1,
                          }}>
                            拖拽节点可重新组织关系
                          </div>
                        </div>

                        <div style={{
                          height: 600,
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(250,245,238,0.98) 100%)',
                          borderRadius: 20,
                          border: '1px solid #e8e0d8',
                          boxShadow: '0 12px 36px rgba(92, 74, 58, 0.08)',
                          overflow: 'hidden',
                          padding: 8,
                        }}>
                          <ArchitectureKnowledgeGraph detail={detail} stationName={selectedStation.name} />
                        </div>
                      </div>
                    </>
                  )}
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

          {/* ── Tab 3: 风物志 ── */}
          {activeTab === 'heritage' && (
            <div key="heritage-wrap" style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              overflow: 'hidden',
              background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0eb 30%, #f0ece6 100%)',
            }}>
              <motion.div
                style={{ height: '100%' }}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } }}
                exit={{ opacity: 0, x: direction > 0 ? -60 : 60, transition: { duration: 0.2 } }}
              >
                <div style={{ maxWidth: 1540, height: '100%', margin: '0 auto', padding: '10px 18px 8px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <div style={{ textAlign: 'center', marginBottom: 10, flexShrink: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 20,
                        marginBottom: 12,
                        flexWrap: 'wrap',
                      }}
                    >
                      <div>
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          gap: 16, marginBottom: 12,
                        }}>
                          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #c4a882)' }} />
                          <span style={{ fontSize: 11, color: '#a08b73', letterSpacing: 6 }}>
                            HERITAGE DASHBOARD
                          </span>
                          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, #c4a882, transparent)' }} />
                        </div>
                        <h2 style={{
                          fontSize: '1.8rem', fontWeight: 800, color: '#3a2a1a',
                          letterSpacing: 4, margin: 0,
                          fontFamily: 'var(--font-serif, serif)',
                        }}>
                          {selectedStation.name} · 风物志
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: 1, minHeight: 0 }}>
                    {climate && detail && (
                      <HeritageDashboard
                        station={selectedStation}
                        climate={climate}
                        detail={detail}
                        heritage={heritage || []}
                        decorations={decorations || []}
                      />
                    )}
                    {(!climate || !detail) && (
                      <div
                        style={{
                          marginTop: 40,
                          padding: '48px 32px',
                          border: '1px solid #e8e0d8',
                          borderRadius: 20,
                          background: 'rgba(255,255,255,0.75)',
                          textAlign: 'center',
                          color: '#7c6a56',
                        }}
                      >
                        当前驿站尚未接入完整的民居大屏数据。
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* ── Tab 4: 影像志 ── */}
          {activeTab === 'video' && (
            <div key="video-wrap" style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              overflow: 'hidden',
              background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0eb 30%, #f0ece6 100%)',
            }}>
              <motion.div
                style={{ height: '100%' }}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } }}
                exit={{ opacity: 0, x: direction > 0 ? -60 : 60, transition: { duration: 0.2 } }}
              >
                <div style={{ maxWidth: 1540, height: '100%', margin: '0 auto', padding: '10px 18px 8px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <div style={{ flex: 1, minHeight: 0 }}>
                    <VideoChronicle
                      station={selectedStation}
                      climate={climate}
                      detail={detail}
                      heritage={heritage || []}
                      decorations={decorations || []}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
