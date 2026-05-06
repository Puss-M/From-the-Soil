'use client';

import { useEffect, useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';

// 动态生成旁白的模板工厂
function generateNarrations(startName: string, endName: string, startGene: string, endGene: string, startDesc: string, endDesc: string) {
  return [
    {
      progressStart: 0,
      progressEnd: 0.15,
      text: `离开${startName}，踏上建筑寻访之旅。此地的「${startGene}」风格独具特色——${startDesc}。沿途风景渐渐变化...`,
      highlight: startGene,
    },
    {
      progressStart: 0.15,
      progressEnd: 0.3,
      text: `渐行渐远，${startName}的轮廓正在身后消隐。建筑的屋顶开始微妙变化，气候在悄然影响着每一处构造细节...`,
      highlight: '气候',
    },
    {
      progressStart: 0.3,
      progressEnd: 0.45,
      text: `行至旅途中段，建筑形态的差异已然显现。降雨量与日照的变化，驱使屋顶坡度、窗户大小逐渐演变，每一寸砖石都回应着大地的呼唤...`,
      highlight: '演变',
    },
    {
      progressStart: 0.45,
      progressEnd: 0.6,
      text: `穿越气候的分界线，建筑的构造逻辑正在发生根本性转变。从「${startGene}」的基因中，新的形态密码开始浮现...`,
      highlight: '分界线',
    },
    {
      progressStart: 0.6,
      progressEnd: 0.75,
      text: `${endName}的建筑风貌初露端倪。「${endGene}」的特征逐渐清晰——这是土地与人类智慧千百年来的对话结晶...`,
      highlight: endGene,
    },
    {
      progressStart: 0.75,
      progressEnd: 0.9,
      text: `临近目的地，建筑形态已与起点截然不同。${endDesc}——环境塑造了建筑，建筑诉说着环境...`,
      highlight: '环境',
    },
    {
      progressStart: 0.9,
      progressEnd: 1,
      text: `抵达${endName}，见证了从「${startGene}」到「${endGene}」的形态演变。这不仅是空间的跨越，更是建筑智慧的传承...`,
      highlight: '传承',
    },
  ];
}

export function NarratorPanel() {
  const { transitionProgress, startStation, endStation } = useStore();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // 根据实际站点动态生成旁白
  const narrations = useMemo(() => {
    return generateNarrations(
      startStation?.name || '起点',
      endStation?.name || '终点',
      startStation?.buildingGene || '传统',
      endStation?.buildingGene || '传统',
      startStation?.description || '传统民居',
      endStation?.description || '传统民居',
    );
  }, [startStation, endStation]);

  // 根据进度获取当前旁白
  const currentNarration = useMemo(() => {
    return narrations.find(
      (n) => transitionProgress >= n.progressStart && transitionProgress < n.progressEnd
    );
  }, [transitionProgress, narrations]);

  // 打字机效果
  useEffect(() => {
    if (!currentNarration) return;

    const fullText = currentNarration.text;
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [currentNarration]);

  // 高亮关键词
  const formattedText = useMemo(() => {
    if (!currentNarration || !displayedText) return displayedText;
    
    const highlight = currentNarration.highlight;
    if (!highlight || !displayedText.includes(highlight)) return displayedText;

    const parts = displayedText.split(highlight);
    return (
      <>
        {parts[0]}
        <span style={{ color: '#6366f1', fontWeight: 700 }}>{highlight}</span>
        {parts.slice(1).join(highlight)}
      </>
    );
  }, [displayedText, currentNarration]);

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 w-[600px] max-w-[90vw]">
      <div
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(16px)',
          borderRadius: 14,
          padding: '16px 20px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* 路线信息 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, fontSize: 12, color: '#94a3b8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#2563eb', fontWeight: 600 }}>{startStation?.name || '起点'}</span>
            <span>→</span>
            <span style={{ color: '#dc2626', fontWeight: 600 }}>{endStation?.name || '终点'}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)' }}>
            {(transitionProgress * 100).toFixed(0)}%
          </div>
        </div>

        {/* 旁白文字 */}
        <div style={{ color: '#334155', lineHeight: 1.7, minHeight: 48, fontSize: 14 }}>
          {formattedText}
          {isTyping && (
            <span style={{ color: '#6366f1', animation: 'pulse 1s infinite' }}>|</span>
          )}
        </div>

        {/* 底部装饰 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 10, borderTop: '1px solid #e2e8f0' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
          <span style={{ fontSize: 10, color: '#94a3b8' }}>智能旁白 · 基于气候数据实时生成</span>
        </div>
      </div>
    </div>
  );
}
