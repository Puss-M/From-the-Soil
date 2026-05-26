'use client';
import React, { useState, useMemo, useRef, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { stations } from '@/data/stations';
import { useStore } from '@/store/useStore';
import chinaGeoJson from '../../../public/china.json';
echarts.registerMap('china', chinaGeoJson as never);
const MAP_REVIEW_LABEL = '中国地图审图号：GS（2024）0650号';
type MapEventParams = {
    seriesType?: string;
    data?: {
        id?: string;
    };
};
export function MapScene() {
    const { setPhase, setSelectedStation } = useStore();
    const [hoveredStation, setHoveredStation] = useState<string | null>(null);
    const [isScrollExpanded, setIsScrollExpanded] = useState(false);
    const [isScrollAnimating, setIsScrollAnimating] = useState(false);
    const chartRef = useRef<ReactECharts | null>(null);
    const hoveredData = useMemo(() => {
        if (!hoveredStation)
            return null;
        return stations.find((s) => s.id === hoveredStation) || null;
    }, [hoveredStation]);
    const handleChartReady = useCallback((instance: echarts.ECharts) => {
        const dom = instance.getDom();
        const preventDoubleClickZoom = (event: Event) => {
            event.preventDefault();
            event.stopPropagation();
        };
        dom.addEventListener('dblclick', preventDoubleClickZoom);
        return () => {
            dom.removeEventListener('dblclick', preventDoubleClickZoom);
        };
    }, []);
    const onEvents = useMemo(() => ({
        click: (params: MapEventParams) => {
            const stationId = params.data?.id;
            if (params.seriesType === 'effectScatter' && stationId) {
                const station = stations.find(s => s.id === stationId);
                if (station) {
                    setSelectedStation(station);
                    setPhase('detail');
                }
            }
        },
        mouseover: (params: MapEventParams) => {
            const stationId = params.data?.id;
            if (params.seriesType === 'effectScatter' && stationId) {
                setHoveredStation(stationId);
            }
        },
        mouseout: () => {
            setHoveredStation(null);
        }
    }), [setSelectedStation, setPhase]);
    const option = useMemo(() => {
        const scatterData = stations.map(s => ({
            name: s.name,
            value: [...s.coordinates, s.name],
            id: s.id,
            itemStyle: {
                color: '#cbbbae',
                borderColor: '#ffffff',
                borderWidth: 1.5,
            }
        }));
        return {
            backgroundColor: 'transparent',
            toolbox: {
                show: false
            },
            dataZoom: [],
            tooltip: {
                trigger: 'item',
                show: false
            },
            geo: {
                map: 'china',
                roam: 'scale',
                zoom: 1.2,
                scaleLimit: { min: 0.8, max: 5 },
                center: [104.195397, 35.86166],
                label: {
                    show: false,
                    color: '#5a4d42'
                },
                itemStyle: {
                    areaColor: '#EFD59C4D',
                    borderColor: '#d6cbbd',
                    borderWidth: 1.2,
                    shadowColor: 'rgba(0, 0, 0, 0.05)',
                    shadowBlur: 5
                },
                emphasis: {
                    itemStyle: {
                        areaColor: '#EFD59C99',
                    },
                    label: {
                        show: false
                    }
                },
                regions: [{
                        name: '南海诸岛',
                        itemStyle: {
                            opacity: 0
                        },
                        label: {
                            show: false
                        }
                    }]
            },
            series: [
                {
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: scatterData,
                    symbolSize: 10,
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke',
                        scale: 3,
                        period: 4
                    },
                    label: {
                        show: true,
                        formatter: '{b}',
                        position: 'top',
                        color: '#5a4d42',
                        fontSize: 12,
                        fontWeight: 'bold',
                        distance: 5,
                        backgroundColor: 'transparent',
                        textBorderColor: 'transparent'
                    },
                    labelLayout: {
                        hideOverlap: false,
                        moveOverlap: 'shiftY',
                    },
                    itemStyle: {
                        color: '#8c221c',
                        shadowBlur: 4,
                        shadowColor: 'rgba(0,0,0,0.2)'
                    },
                    emphasis: {
                        itemStyle: {
                            color: '#8c221c',
                            shadowBlur: 8,
                            shadowColor: 'rgba(140,34,28,0.28)'
                        },
                        scale: true
                    },
                    zlevel: 1
                }
            ]
        };
    }, []);
    function getRegionColor(region: string): string {
        const colors: Record<string, string> = {
            '江南': '#5b8d86', '皖南': '#7f6f52', '闽西': '#8b4a3a',
            '晋中': '#9b7442', '陕北': '#8b6846', '滇西': '#5f7f6a',
            '藏区': '#6d6376', '南疆': '#98624f', '京畿': '#8a6a4d',
            '湘西': '#6a8465', '胶东': '#6b7f8c', '滇南': '#638974',
            '蒙古': '#76806a', '岭南': '#9a6d5f', '东疆': '#b88a3b',
            '中原': '#7e6b59', '赣北': '#766355',
        };
        return colors[region] || '#8b6846';
    }
    return (<div className="relative w-full h-full overflow-hidden" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            backgroundImage: 'url(/fengmian/di3.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
      <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
        }}>
        <ReactECharts ref={chartRef} option={option} opts={{ renderer: 'canvas' }} notMerge={false} lazyUpdate={true} style={{ width: '100%', height: '100%' }} onEvents={onEvents} onChartReady={handleChartReady}/>
      </div>

      
      <div className="guofeng-glass-strong" style={{ position: 'fixed', top: 20, left: 22, zIndex: 20, padding: '10px 14px' }}>
        <h1 style={{
            fontSize: '1.5rem', fontWeight: 800, color: '#3a2a1a',
            letterSpacing: '0.12em', marginBottom: 3,
            fontFamily: '"演示秋鸿楷", "YanShi QiuHongKai", var(--font-serif), "Noto Serif SC", SimSun, STSong, serif',
        }}>
          山河筑语
        </h1>
        <p style={{ fontSize: '0.74rem', color: '#8b6846', fontWeight: 500 }}>
          从土而生 · 建筑方言 · Architectural Dialects
        </p>
      </div>

      
      <div className="guofeng-glass-strong" style={{
            position: 'fixed',
            top: 20,
            right: 22,
            zIndex: 20,
            padding: '12px 20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        }} onClick={() => setPhase('landing')} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.background = 'rgba(255, 248, 234, 0.95)';
        }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = '';
        }}>
        <span style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#3a2a1a',
            fontFamily: '"演示秋鸿楷", "YanShi QiuHongKai", var(--font-serif), serif',
            letterSpacing: '0.1em',
        }}>
          返回首页
        </span>
      </div>

      
      <div style={{
            position: 'fixed',
            top: isScrollExpanded ? '80px' : '20px',
            left: '50%',
            transform: `translateX(-50%) ${isScrollExpanded ? 'scale(1.5)' : 'scale(1)'}`,
            zIndex: isScrollExpanded ? 100 : 20,
            width: isScrollExpanded ? '800px' : '500px',
            height: isScrollExpanded ? '400px' : '120px',
            backgroundImage: 'url(/卷轴.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: 'none',
        }} onClick={() => {
            if (isScrollAnimating)
                return;
            if (!isScrollExpanded) {
                setIsScrollAnimating(true);
                setIsScrollExpanded(true);
                setTimeout(() => {
                    setIsScrollAnimating(false);
                }, 600);
            }
        }} onMouseEnter={(e) => {
            if (!isScrollExpanded && !isScrollAnimating) {
                e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)';
            }
        }} onMouseLeave={(e) => {
            if (!isScrollExpanded && !isScrollAnimating) {
                e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
            }
        }}>
        <span style={{
            fontSize: isScrollExpanded ? '28px' : '20px',
            fontWeight: 700,
            color: '#3a2a1a',
            fontFamily: '"演示秋鸿楷", "YanShi QiuHongKai", var(--font-serif), serif',
            letterSpacing: '0.1em',
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
            padding: '10px 20px',
            opacity: isScrollExpanded ? 0 : 1,
            transition: 'opacity 0.3s ease',
        }}>
          {isScrollExpanded ? '点击收起卷轴' : '点击可查看民居目录'}
        </span>
        
          
        {isScrollExpanded && (<div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 70px',
                opacity: isScrollExpanded ? 1 : 0,
                transition: 'opacity 0.4s ease 0.2s',
            }}>
            
            <div style={{
                position: 'absolute',
                top: '60px',
                right: '60px',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                zIndex: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8b6846',
                fontSize: '28px',
                fontWeight: 'bold',
                background: 'rgba(255, 248, 234, 0.9)',
                borderRadius: '50%',
                boxShadow: '0 4px 12px rgba(91, 70, 44, 0.2)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: 'floatIn 0.4s ease-out forwards',
            }} onClick={(e) => {
                e.stopPropagation();
                if (isScrollAnimating)
                    return;
                setIsScrollAnimating(true);
                setIsScrollExpanded(false);
                setTimeout(() => {
                    setIsScrollAnimating(false);
                }, 600);
            }} onMouseEnter={(e) => {
                e.currentTarget.style.color = '#b88a3b';
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(184, 138, 59, 0.3)';
                e.currentTarget.style.background = 'rgba(255, 248, 234, 1)';
            }} onMouseLeave={(e) => {
                e.currentTarget.style.color = '#8b6846';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(91, 70, 44, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 248, 234, 0.9)';
            }}>
              ×
            </div>
            
            
            <style jsx>{`
              @keyframes floatIn {
                0% {
                  opacity: 0;
                  transform: translateY(-20px) scale(0.8);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }
              
              @keyframes floatInContent {
                0% {
                  opacity: 0;
                  transform: translateY(30px);
                }
                70% {
                  opacity: 0.9;
                  transform: translateY(-5px);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              
              @keyframes floatInText {
                0% {
                  opacity: 0;
                  transform: translateX(20px);
                }
                100% {
                  opacity: 1;
                  transform: translateX(0);
                }
              }
              
              .custom-scrollbar::-webkit-scrollbar {
                height: 6px;
                width: 6px;
              }
              
              .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(139, 105, 70, 0.1);
                border-radius: 3px;
              }
              
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(139, 105, 70, 0.3);
                border-radius: 3px;
                transition: all 0.2s ease;
              }
              
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(184, 138, 59, 0.5);
              }
              
              .custom-scrollbar::-webkit-scrollbar-corner {
                background: transparent;
              }
            `}</style>
            
            
            <div className="custom-scrollbar" style={{
                width: 'calc(100% - 140px)',
                height: 'calc(100% - 80px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                overflowX: 'auto',
                overflowY: 'hidden',
                padding: '20px 15px',
                marginTop: '10px',
                marginBottom: '10px',
                background: 'transparent',
                animation: 'floatInContent 0.6s ease-out 0.1s forwards',
                opacity: 0,
                transform: 'translateY(30px)',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '30px',
                height: '100%',
                padding: '0 15px',
                minWidth: 'min-content',
            }}>
                {stations.map((station, index) => (<div key={station.id} style={{
                    padding: '12px 8px',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    minWidth: '60px',
                    maxWidth: '75px',
                    fontFamily: '"KaiTi", "STKaiti", "Noto Serif SC", serif',
                    flexShrink: 0,
                    animation: `floatInText 0.5s ease-out ${0.1 + index * 0.05}s forwards`,
                    opacity: 0,
                    transform: 'translateX(20px)',
                }} onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#b88a3b';
                    e.currentTarget.style.transform = 'translateX(0) scale(1.05)';
                }} onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#3a2a1a';
                    e.currentTarget.style.transform = 'translateX(0) scale(1)';
                }} onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStation(station);
                    setPhase('detail');
                }}>
                    <div style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    lineHeight: '1.5',
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    letterSpacing: '0.1em',
                    wordBreak: 'keep-all',
                    whiteSpace: 'nowrap',
                }}>
                      {station.name}<br />{station.buildingGene}
                    </div>
                  </div>))}
              </div>
            </div>
          </div>)}
      </div>

      
      <div style={{ position: 'fixed', bottom: 20, right: 24, zIndex: 20 }}>
        <div className="guofeng-glass-strong" style={{ padding: '6px 14px' }}>
          <span style={{ fontSize: 11, color: '#8a7d73' }}>共 {stations.length} 个驿站 · 点击探索详情</span>
        </div>
      </div>

      <div style={{ position: 'fixed', right: 24, bottom: 58, zIndex: 20 }}>
        <div className="guofeng-glass-strong" style={{
            padding: '6px 12px',
            color: '#8b7355',
            fontSize: 10.5,
            letterSpacing: 1,
            border: '1px solid rgba(139,105,70,0.2)',
        }}>
          {MAP_REVIEW_LABEL}
        </div>
      </div>

      
      <div style={{
            position: 'fixed',
            top: '50%',
            left: 120,
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 80,
            transform: 'translateY(-50%)'
        }}>
        <button onClick={() => setPhase('memory-game')} style={{
            width: 160,
            height: 160,
            border: 'none',
            borderRadius: '0px',
            backgroundColor: 'transparent',
            backgroundImage: 'url(/左圆.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#3a2a1a',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.3s ease',
            boxShadow: 'none',
            fontFamily: '"演示秋鸿楷", "YanShi QiuHongKai", var(--font-serif), serif',
        }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = 'none';
        }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
        }}>
          <span style={{ paddingLeft: '9px' }}>翻翻乐</span>
        </button>

        <button onClick={() => setPhase('craftsmanship')} style={{
            width: 160,
            height: 160,
            border: 'none',
            borderRadius: '0px',
            backgroundColor: 'transparent',
            backgroundImage: 'url(/左圆.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#3a2a1a',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.3s ease',
            boxShadow: 'none',
            fontFamily: '"演示秋鸿楷", "YanShi QiuHongKai", var(--font-serif), serif',
        }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = 'none';
        }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
        }}>
          <span style={{ paddingLeft: '9px' }}>匠作志</span>
        </button>
      </div>

      
      <div style={{
            position: 'fixed',
            top: '50%',
            right: 120,
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 80,
            transform: 'translateY(-50%)'
        }}>
        <button onClick={() => setPhase('folk-music')} style={{
            width: 160,
            height: 160,
            border: 'none',
            borderRadius: '0px',
            backgroundColor: 'transparent',
            backgroundImage: 'url(/右圆.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#3a2a1a',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.3s ease',
            boxShadow: 'none',
            fontFamily: '"演示秋鸿楷", "YanShi QiuHongKai", var(--font-serif), serif',
        }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = 'none';
        }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
        }}>
          <span style={{ paddingRight: '9px' }}>乡韵集</span>
        </button>

         <button onClick={() => setPhase('homology')} style={{
            width: 160,
            height: 160,
            border: 'none',
            borderRadius: '0px',
            backgroundColor: 'transparent',
            backgroundImage: 'url(/右圆.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#3a2a1a',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.3s ease',
            boxShadow: 'none',
            fontFamily: '"演示秋鸿楷", "YanShi QiuHongKai", var(--font-serif), serif',
        }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = 'none';
        }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
        }}>
           <span style={{ paddingRight: '9px' }}>同源录</span>
         </button>
      </div>

      
      {hoveredData && (<div style={{
                position: 'fixed', right: 24, top: 86,
                zIndex: 50, pointerEvents: 'none',
            }}>
          <div className="guofeng-glass-strong" style={{
                padding: '14px 20px',
                border: `1px solid ${getRegionColor(hoveredData.region)}66`,
                minWidth: 240,
                maxWidth: 360,
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: getRegionColor(hoveredData.region) }}/>
              <span style={{ fontWeight: 700, fontSize: 16, color: '#3a2a1a' }}>{hoveredData.name}</span>
              <span style={{ fontSize: 12, color: '#8a7d73', marginLeft: 'auto' }}>{hoveredData.region}</span>
            </div>
            <div style={{ fontSize: 13, color: '#5a4d42', marginBottom: 4 }}>🏠 {hoveredData.buildingGene}</div>
            <div style={{ fontSize: 12, color: '#8a7d73' }}>{hoveredData.description}</div>
          </div>
        </div>)}
    </div>);
}
