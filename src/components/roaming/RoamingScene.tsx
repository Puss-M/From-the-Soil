'use client';
import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Grid } from '@react-three/drei';
import { MorphingHouse } from '@/components/MorphingHouse';
import { InteractiveElement } from './InteractiveElement';
import { CollectionDock } from '@/components/ui/CollectionDock';
import { useStore } from '@/store/useStore';
import { CollectionItem } from '@/types';
import { ClimateEffects } from '@/components/ClimateEffects';
import { ControlPanel } from '@/components/ControlPanel';
const collectibleItems: CollectionItem[] = [
    { id: 'yingbi', name: '影壁', category: '装饰构件',
        description: '立于门内或门外的独立墙壁，既可遮挡视线保护隐私，又有风水上的"挡煞"作用。',
        attributes: { privacy: 9, fengshui: 8, cost: 6, aesthetic: 7 }, collected: false },
    { id: 'chuangling', name: '窗棂', category: '结构构件',
        description: '窗户的格栅装饰，既有采光通风功能，又是传统工艺的精华体现。',
        attributes: { privacy: 5, fengshui: 4, cost: 7, aesthetic: 9 }, collected: false },
    { id: 'dougong', name: '斗拱', category: '结构构件',
        description: '中国古建筑特有的承重结构，层层叠加，承载屋檐重量。',
        attributes: { privacy: 1, fengshui: 6, cost: 9, aesthetic: 10 }, collected: false },
    { id: 'matouqiang', name: '马头墙', category: '装饰构件',
        description: '徽派建筑标志性元素，高出屋顶的阶梯状山墙，具有防火功能。',
        attributes: { privacy: 3, fengshui: 5, cost: 5, aesthetic: 8 }, collected: false },
    { id: 'tianjing', name: '天井', category: '功能构件',
        description: '民居中央的露天庭院，"四水归堂"收集雨水，寓意财源广进。',
        attributes: { privacy: 4, fengshui: 10, cost: 4, aesthetic: 6 }, collected: false },
];
function RoamingContent() {
    const { collectItem, collectedItems, setCollectedItems } = useStore();
    useEffect(() => {
        if (collectedItems.length === 0)
            setCollectedItems(collectibleItems);
    }, [collectedItems.length, setCollectedItems]);
    return (<>
      <PerspectiveCamera makeDefault position={[8, 5, 8]} fov={50}/>
      <OrbitControls enablePan enableZoom enableRotate minDistance={3} maxDistance={20} target={[0, 1, 0]}/>
      <ambientLight intensity={0.62} color="#fff8ea"/>
      <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow color="#f3e5cb" shadow-mapSize={[2048, 2048]}/>
      <pointLight position={[-5, 5, -5]} intensity={0.42} color="#b88a3b"/>
      <Environment preset="apartment" blur={0.8}/>
      <ClimateEffects />
      <Grid position={[0, -0.01, 0]} args={[30, 30]} cellSize={1} cellThickness={0.5} cellColor="#d8cab1" sectionSize={5} sectionThickness={1} sectionColor="#8b6846" fadeDistance={40} fadeStrength={1} infiniteGrid/>
      <ContactShadows position={[0, -0.01, 0]} opacity={0.6} scale={20} blur={2.5} far={5} color="#b39a72"/>
      <MorphingHouse position={[0, 0, 0]}/>
      {collectibleItems.map((item, index) => (<InteractiveElement key={item.id} item={{ ...item, collected: collectedItems.find(c => c.id === item.id)?.collected || false }} position={[
                Math.cos((index / collectibleItems.length) * Math.PI * 2) * 4, 0.6,
                Math.sin((index / collectibleItems.length) * Math.PI * 2) * 4,
            ]} rotation={[0, -(index / collectibleItems.length) * Math.PI * 2, 0]} onCollect={(id) => collectItem(id)}/>))}
    </>);
}
const glass = {
    background: 'rgba(255, 250, 240, 0.8)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '1px solid rgba(139, 104, 70, 0.25)',
    boxShadow: '0 12px 32px rgba(91, 70, 44, 0.14)',
    borderRadius: 16,
} as const;
interface RoamingSceneProps {
    onBack?: () => void;
}
export function RoamingScene({ onBack }: RoamingSceneProps) {
    const { setPhase, viewMode, toggleViewMode, endStation } = useStore();
    const handleBack = () => { setPhase('transition'); onBack?.(); };
    return (<>
      
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Canvas shadows style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(165deg, #f7f0e3 0%, #efe3c6 40%, #e4cfab 100%)',
        }}>
          <Suspense fallback={null}>
            <RoamingContent />
          </Suspense>
        </Canvas>
      </div>

      
      <div style={{ position: 'fixed', inset: 0, zIndex: 20, pointerEvents: 'none' }}>

        
        <div style={{
            position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
            textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: '1.4rem', fontWeight: 700, color: 'var(--paper-ink)',
            letterSpacing: '0.15em', fontFamily: 'var(--font-serif)',
            textShadow: '0 1px 10px rgba(255,252,246,0.75)',
        }}>
            {endStation?.name || '民居漫游'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--paper-gold)', display: 'inline-block' }}/>
            <span style={{ color: 'var(--paper-brown)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
              {endStation?.buildingGene || 'ARCHITECTURAL EXPLORATION'}
            </span>
          </div>
        </div>

        
        <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 8, pointerEvents: 'auto' }}>
          <button className="guofeng-button" onClick={handleBack} style={{
            ...glass, padding: '8px 16px', borderRadius: 50,
            color: 'var(--paper-ink)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6,
        }}>
            <span>←</span> 返回地图
          </button>
          <button className="guofeng-button" onClick={toggleViewMode} style={{
            ...glass, padding: '8px 16px', borderRadius: 50,
            color: 'var(--paper-brown)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.2s',
        }}>
            {viewMode === 'tourist' ? '🎯 游客视角' : '🌍 鸟瞰视角'}
          </button>
        </div>

        
        <div style={{ pointerEvents: 'auto' }}>
          <ControlPanel />
        </div>

        
        {endStation && (<div style={{
                position: 'absolute', top: 70, right: 20, width: 220,
                pointerEvents: 'auto',
            }}>
            <div style={{ ...glass, padding: 14 }}>
              <div style={{ fontSize: 9, color: 'var(--paper-brown)', letterSpacing: 3, fontWeight: 600, marginBottom: 8 }}>
                STATION INFO
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--paper-ink)', marginBottom: 6, fontFamily: 'var(--font-serif)' }}>
                {endStation.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--paper-muted)', marginBottom: 8, lineHeight: 1.5 }}>
                {endStation.description}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11 }}>
                {[
                { icon: '🌧️', label: '降雨量', val: `${endStation.climate.rainfall}mm`, color: '#5b8d86' },
                { icon: '☀️', label: '日照', val: `${(endStation.climate.sunlight * 100).toFixed(0)}%`, color: '#b88a3b' },
                { icon: '⛰️', label: '海拔', val: `${endStation.climate.altitude}m`, color: '#8b6846' },
                { icon: '🛡️', label: '防御', val: `Lv.${endStation.climate.defense}`, color: '#7a5a3f' },
            ].map(({ icon, label, val, color }) => (<div key={label} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--paper-muted)' }}>
                    <span>{icon} {label}</span>
                    <span style={{ color, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{val}</span>
                  </div>))}
              </div>
              <div style={{ borderTop: '1px solid rgba(91, 70, 44, 0.12)', marginTop: 8, paddingTop: 6 }}>
                <div style={{ fontSize: 11, color: 'var(--paper-muted)', fontFamily: 'var(--font-mono)' }}>
                  {endStation.coordinates[0].toFixed(2)}°E, {endStation.coordinates[1].toFixed(2)}°N
                </div>
                <div style={{ fontSize: 11, color: 'var(--paper-brown)', marginTop: 2, fontWeight: 500 }}>
                  {endStation.region}
                </div>
              </div>
            </div>
          </div>)}

        
        <div style={{
            position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 640, pointerEvents: 'auto',
        }}>
          <CollectionDock />
        </div>
      </div>
    </>);
}
