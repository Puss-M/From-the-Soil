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
import { VideoChronicle } from './VideoChronicle';
import { HeritageDashboard } from './HeritageDashboard';
import { Cube3D } from '@/components/Cube3D';
import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Compass } from './Compass';
import FlipImage from './FlipImage';
const TABS = [
    { key: 'model', label: '3D 模型', icon: '🏛️', subtitle: 'Architectural Model' },
    { key: 'info', label: '建筑档案', icon: '📜', subtitle: 'Architecture Profile' },
    { key: 'heritage', label: '风物志', icon: '🏺', subtitle: 'Heritage Dashboard' },
    { key: 'video', label: '影像志', icon: '🎬', subtitle: 'Video Chronicle' },
] as const;
type TabKey = (typeof TABS)[number]['key'];
export function StationDetail() {
    const { selectedStation, setPhase } = useStore();
    const [activeTab, setActiveTab] = useState<TabKey>('model');
    const [direction, setDirection] = useState(0);
    const sid = selectedStation?.id ?? '';
    const handleTabChange = useCallback((newTab: TabKey) => {
        const oldIdx = TABS.findIndex((t) => t.key === activeTab);
        const newIdx = TABS.findIndex((t) => t.key === newTab);
        setDirection(newIdx > oldIdx ? 1 : -1);
        setActiveTab(newTab);
    }, [activeTab]);
    if (!selectedStation) {
        return (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p>未选择驿站</p>
      </div>);
    }
    const detail = stationDetails[sid];
    const climate = climateDetails[sid];
    const heritage = heritageData[sid];
    const decorations = decorationData[sid];
    return (<div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'grid',
            gridTemplateRows: '72px 1fr',
            background: '#f7f1e3',
        }}>
      <style>{`
        @media (max-width: 1024px) {
          .detail-topbar {
            height: auto !important;
            min-height: 72px;
            padding: 10px 12px !important;
            flex-wrap: wrap;
            gap: 10px;
          }
          .detail-tab-group {
            width: 100%;
            overflow-x: auto;
            white-space: nowrap;
          }
          .detail-tab-button {
            padding: 10px 14px !important;
            font-size: 13px !important;
          }
        }
      `}</style>
      
      <div className="detail-topbar" style={{
            display: 'flex', alignItems: 'center',
            padding: '0 24px',
            borderBottom: '1px solid rgba(139, 104, 70, 0.24)',
            background: 'rgba(255,250,240,0.86)',
            backdropFilter: 'blur(16px)',
            zIndex: 50,
        }}>
        
        <button className="guofeng-button" onClick={() => setPhase('map')} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px',
            borderRadius: 999,
            cursor: 'pointer',
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--paper-ink)',
            marginRight: 24,
            flexShrink: 0,
        }}>
          ← 返回地图
        </button>

        
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

        
        <div className="detail-tab-group" style={{
            display: 'flex', gap: 4,
            background: 'rgba(239,227,198,0.58)',
            borderRadius: 12,
            padding: 4,
            flexShrink: 0,
        }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (<button key={tab.key} className="detail-tab-button" onClick={() => handleTabChange(tab.key)} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '11px 22px',
                    border: 'none',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontSize: 15,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#fff' : '#8b7355',
                    background: isActive
                        ? 'linear-gradient(135deg, #8b6846, #5b4631)'
                        : 'transparent',
                    boxShadow: isActive
                        ? '0 6px 16px rgba(91,70,44,0.24)'
                        : 'none',
                    transition: 'all 0.25s ease',
                    letterSpacing: 1,
                }} onMouseEnter={(e) => {
                    if (!isActive)
                        e.currentTarget.style.background = 'rgba(139,104,70,0.14)';
                }} onMouseLeave={(e) => {
                    if (!isActive)
                        e.currentTarget.style.background = 'transparent';
                }}>
                <span style={{ fontSize: 16 }}>{tab.icon}</span>
                {tab.label}
              </button>);
        })}
        </div>
      </div>

      
      <div style={{
            position: 'relative',
            overflow: 'hidden',
            background: activeTab === 'model' ? 'url(/3d模型背景图.jpg) center center / cover no-repeat' : 'inherit',
        }}>
        <AnimatePresence mode="wait" custom={direction}>
          
          {activeTab === 'model' && (<div key="model-wrap" style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                overflow: 'auto',
                background: 'transparent',
            }}>
              <motion.div className="w-full min-h-full" custom={direction} initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }} animate={{ opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } }} exit={{ opacity: 0, x: direction > 0 ? -60 : 60, transition: { duration: 0.2 } }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px 80px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <StationHeader station={selectedStation} heritage={heritage} climate={climate}/>
                  
                  <div style={{
                marginTop: 32,
                background: 'rgba(255, 252, 246, 0.25)',
                borderRadius: 16,
                border: 'none',
                boxShadow: 'none',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 600,
                height: 'calc(100vh - 400px)',
            }}>
                    
                    <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid #f0ebe4',
                background: 'rgba(243,232,205,0.42)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#3a2a1a', letterSpacing: 1 }}>
                            3D 建筑场景模拟
                          </h3>
                        </div>
                      <span style={{ fontSize: 11, color: '#a08b73', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                        Interactive Model Viewer
                      </span>
                    </div>

                    
                    <div style={{ flex: 1, position: 'relative' }}>
                      <ModelViewer station={selectedStation}/>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>)}

          
          {activeTab === 'info' && (<div key="info-wrap" style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                overflow: 'hidden',
                background: 'url(/建筑档案背景图.png) center center / cover no-repeat',
            }}>
              <FlipImage frontImage="/zhuyu1.png" backImage="/zhuyu2.png" width={270} height={360} stationName={selectedStation.name}/>
              <motion.div custom={direction} initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }} animate={{ opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } }} exit={{ opacity: 0, x: direction > 0 ? -60 : 60, transition: { duration: 0.2 } }}>
                <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
            }}>
                  <Cube3D stationId={sid} stationName={selectedStation.name}/>
                </div>
                <Compass stationName={selectedStation.name}/>
              </motion.div>
            </div>)}

          
          {activeTab === 'heritage' && (<div key="heritage-wrap" style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                overflow: 'auto',
                background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0eb 30%, #f0ece6 100%)',
            }}>
              <motion.div style={{ height: '100%' }} custom={direction} initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }} animate={{ opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } }} exit={{ opacity: 0, x: direction > 0 ? -60 : 60, transition: { duration: 0.2 } }}>
                <div style={{ maxWidth: 1540, height: '100%', margin: '0 auto', padding: '10px 18px 8px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <div style={{ flex: 1, minHeight: 0 }}>
                    <HeritageDashboard station={selectedStation}/>
                  </div>
                </div>
              </motion.div>
            </div>)}

          
          {activeTab === 'video' && (<div key="video-wrap" style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                overflow: 'auto',
                background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0eb 30%, #f0ece6 100%)',
            }}>
              <motion.div style={{ height: '100%' }} custom={direction} initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }} animate={{ opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } }} exit={{ opacity: 0, x: direction > 0 ? -60 : 60, transition: { duration: 0.2 } }}>
                <div style={{ maxWidth: 1540, height: '100%', margin: '0 auto', padding: '10px 18px 8px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <div style={{ flex: 1, minHeight: 0 }}>
                    <VideoChronicle station={selectedStation} climate={climate} detail={detail} heritage={heritage || []} decorations={decorations || []}/>
                  </div>
                </div>
              </motion.div>
            </div>)}
        </AnimatePresence>
      </div>
    </div>);
}
