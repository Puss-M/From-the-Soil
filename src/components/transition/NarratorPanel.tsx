'use client';

import { useEffect, useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { NarrationSegment } from '@/types';

// 旅程旁白数据
const narrations: NarrationSegment[] = [
  {
    progressStart: 0,
    progressEnd: 0.15,
    text: '离开江南水乡，踏上寻访民居之旅。此地雨量充沛，屋顶高耸以利排水，"四水归堂"的天井收集天赐之水...',
    highlight: '四水归堂',
  },
  {
    progressStart: 0.15,
    progressEnd: 0.3,
    text: '渐入皖南山区，马头墙渐渐显现。这不仅是装饰，更是防火的智慧。徽商走南闯北，家中女眷久盼归人...',
    highlight: '马头墙',
  },
  {
    progressStart: 0.3,
    progressEnd: 0.45,
    text: '穿越秦岭淮河线，雨水渐少。为了收集珍贵的雨水，屋顶形式由陡坡向缓坡演变，窗户也开始变小以抵御风沙...',
    highlight: '秦岭淮河线',
  },
  {
    progressStart: 0.45,
    progressEnd: 0.6,
    text: '进入黄土高原，窑洞民居开始出现。依山而凿，冬暖夏凉，是人与自然和谐相处的典范...',
    highlight: '窑洞',
  },
  {
    progressStart: 0.6,
    progressEnd: 0.75,
    text: '海拔渐高，空气稀薄，日照强烈。墙体越来越厚，窗户越来越小，这是高原民居抵御严寒的必然选择...',
    highlight: '高原',
  },
  {
    progressStart: 0.75,
    progressEnd: 0.9,
    text: '临近目的地，建筑风貌已与起点截然不同。环境塑造了建筑，建筑诉说着环境...',
    highlight: '环境',
  },
  {
    progressStart: 0.9,
    progressEnd: 1,
    text: '旅途终点，见证建筑从江南水乡到西北高原的形态演变。这不仅是空间的跨越，更是建筑智慧的传承...',
    highlight: '智慧',
  },
];

export function NarratorPanel() {
  const { transitionProgress, startStation, endStation } = useStore();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // 根据进度获取当前旁白
  const currentNarration = useMemo(() => {
    return narrations.find(
      (n) => transitionProgress >= n.progressStart && transitionProgress < n.progressEnd
    );
  }, [transitionProgress]);

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
    }, 50);

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
        <span className="text-cyan-400 font-bold">{highlight}</span>
        {parts.slice(1).join(highlight)}
      </>
    );
  }, [displayedText, currentNarration]);

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 w-[600px] max-w-[90vw]">
      <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-5">
        {/* 路线信息 */}
        <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">{startStation?.name || '起点'}</span>
            <span>→</span>
            <span className="text-amber-400">{endStation?.name || '终点'}</span>
          </div>
          <div className="font-mono">
            {(transitionProgress * 100).toFixed(0)}%
          </div>
        </div>

        {/* 旁白文字 */}
        <div className="text-slate-200 leading-relaxed min-h-[60px]">
          {formattedText}
          {isTyping && (
            <span className="animate-pulse text-cyan-400">|</span>
          )}
        </div>

        {/* 底部装饰 */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs text-slate-500">AI 旁白 · Powered by DeepSeek</span>
        </div>
      </div>
    </div>
  );
}
