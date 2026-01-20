'use client';

import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { MorphingHouse } from '@/components/MorphingHouse';
import { DashboardHUD } from './DashboardHUD';
import { NarratorPanel } from './NarratorPanel';
import { useStore } from '@/store/useStore';

// 进度条组件
function ProgressBar() {
  const { transitionProgress, setTransitionProgress, startStation, endStation } = useStore();

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-[500px] max-w-[80vw]">
      <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-xl p-4">
        {/* 路线标签 */}
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span className="text-cyan-400">{startStation?.name || '起点'}</span>
          <span className="text-amber-400">{endStation?.name || '终点'}</span>
        </div>

        {/* 进度滑块 */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={transitionProgress}
          onChange={(e) => setTransitionProgress(Number(e.target.value))}
          className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer 
                     [&::-webkit-slider-thumb]:appearance-none 
                     [&::-webkit-slider-thumb]:w-5 
                     [&::-webkit-slider-thumb]:h-5 
                     [&::-webkit-slider-thumb]:rounded-full 
                     [&::-webkit-slider-thumb]:bg-cyan-400
                     [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(34,211,238,0.7)]
                     [&::-webkit-slider-thumb]:border-2
                     [&::-webkit-slider-thumb]:border-white"
        />

        {/* 进度指示 */}
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-slate-500">拖动进度条，观察建筑形态演变</div>
          <div className="text-sm font-mono text-cyan-400">
            {(transitionProgress * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}

// 3D 场景
function TransitionContent() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[6, 4, 6]} fov={50} />
      
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={4}
        maxDistance={15}
        target={[0, 1, 0]}
        autoRotate
        autoRotateSpeed={0.5}
      />

      {/* 灯光 */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.3} color="#00ffff" />
      <pointLight position={[5, 3, 5]} intensity={0.2} color="#f59e0b" />

      {/* 环境 */}
      <Environment preset="night" />

      {/* 地面阴影 */}
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.5}
        scale={10}
        blur={2}
        far={4}
      />

      {/* 网格地面 */}
      <gridHelper args={[20, 40, '#1e3a5f', '#0f172a']} position={[0, 0, 0]} />

      {/* 参数化建筑 */}
      <MorphingHouse position={[0, 0, 0]} />
    </>
  );
}

interface TransitionSceneProps {
  onComplete?: () => void;
  onBack?: () => void;
}

export function TransitionScene({ onComplete, onBack }: TransitionSceneProps) {
  const { transitionProgress, setPhase, startStation, endStation, setDirectControl, updateClimateFromProgress } = useStore();

  // 进入过场时，关闭直接控制，启用插值
  useEffect(() => {
    if (startStation && endStation) {
      setDirectControl(false);
    }
  }, [startStation, endStation, setDirectControl]);

  // 进度变化时更新气候
  useEffect(() => {
    updateClimateFromProgress();
  }, [transitionProgress, updateClimateFromProgress]);

  const handleComplete = () => {
    if (transitionProgress >= 0.95) {
      setPhase('roaming');
      onComplete?.();
    }
  };

  const handleBack = () => {
    setPhase('map');
    onBack?.();
  };

  return (
    <div className="relative w-full h-full bg-slate-900">
      {/* 3D Canvas */}
      <Canvas shadows className="bg-slate-900">
        <Suspense fallback={null}>
          <TransitionContent />
        </Suspense>
      </Canvas>

      {/* 标题 */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 text-center">
        <h2 className="text-2xl font-bold text-white tracking-wider mb-1">
          形态渐变
        </h2>
        <p className="text-cyan-400 text-sm">Morphing Journey</p>
      </div>

      {/* 左侧仪表盘 */}
      <DashboardHUD />

      {/* 右侧模型窗 - 显示当前阶段描述 */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-56">
        <div className="bg-black/70 backdrop-blur-md border border-amber-500/30 rounded-xl p-4">
          <div className="text-xs text-amber-400 uppercase tracking-widest mb-3">
            当前形态
          </div>
          <div className="text-white text-sm mb-2">
            {transitionProgress < 0.3 
              ? '江南水乡型' 
              : transitionProgress < 0.6 
                ? '过渡型' 
                : '西北高原型'}
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            {transitionProgress < 0.3 
              ? '高耸坡顶，深远出挑，大窗采光，适应多雨气候'
              : transitionProgress < 0.6 
                ? '屋顶渐缓，出挑减少，窗户开始变小'
                : '平顶或缓坡，厚重墙体，小窗防风，适应干旱气候'}
          </div>
        </div>
      </div>

      {/* 旁白面板 */}
      <NarratorPanel />

      {/* 进度条 */}
      <ProgressBar />

      {/* 返回按钮 */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 z-10 px-4 py-2 bg-black/50 hover:bg-black/70 
                   border border-white/20 rounded-lg text-white text-sm transition-colors"
      >
        ← 返回地图
      </button>

      {/* 完成按钮 */}
      {transitionProgress >= 0.9 && (
        <button
          onClick={handleComplete}
          className="absolute top-6 right-6 z-10 px-4 py-2 
                     bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400
                     rounded-lg text-white text-sm font-medium transition-all
                     shadow-lg shadow-cyan-500/25"
        >
          进入漫游 →
        </button>
      )}
    </div>
  );
}
