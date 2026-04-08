'use client';

import { useState, useRef, useEffect } from 'react';
import './ScrollAnimation.css';

interface ScrollAnimationProps {
  /**
   * 卷轴内容
   */
  children?: React.ReactNode;
  /**
   * 初始状态是否展开
   */
  initialExpanded?: boolean;
  /**
   * 展开动画持续时间（毫秒）
   */
  animationDuration?: number;
  /**
   * 内容淡入延迟（毫秒）
   */
  contentFadeDelay?: number;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 点击回调函数
   */
  onClick?: (isExpanded: boolean) => void;
}

/**
 * 卷轴展开动画组件
 * 
 * 实现逻辑：
 * 1. 初始状态：只显示左轴、右轴，中间纸宽度为 0
 * 2. 点击按钮：中间纸从 0 平滑展开到完整宽度，左右轴保持不动
 * 3. 中间纸使用卷轴.png 作为背景，宽度展开时自动拉伸
 * 4. 展开后内容淡入
 * 5. 再次点击可收起
 */
export default function ScrollAnimation({
  children,
  initialExpanded = false,
  animationDuration = 600,
  contentFadeDelay = 300,
  className = '',
  onClick,
}: ScrollAnimationProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [isAnimating, setIsAnimating] = useState(false);
  const [contentVisible, setContentVisible] = useState(initialExpanded);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // 处理展开/收起动画
  const handleToggle = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    
    // 如果正在展开，延迟显示内容
    if (newExpandedState) {
      setTimeout(() => {
        setContentVisible(true);
      }, contentFadeDelay);
    } else {
      // 如果正在收起，立即隐藏内容
      setContentVisible(false);
    }
    
    // 动画完成后重置动画状态
    setTimeout(() => {
      setIsAnimating(false);
    }, animationDuration);
    
    // 调用点击回调
    onClick?.(newExpandedState);
  };

  // 处理外部点击展开/收起
  const handleScrollClick = (e: React.MouseEvent) => {
    // 如果点击的是卷轴本身（不是内容区域），触发切换
    if (e.target === scrollRef.current || 
        (scrollRef.current && scrollRef.current.contains(e.target as Node))) {
      handleToggle();
    }
  };

  // 初始状态设置
  useEffect(() => {
    if (initialExpanded) {
      setContentVisible(true);
    }
  }, [initialExpanded]);

  return (
    <div 
      className={`scroll-animation-container ${className}`}
      style={{
        '--animation-duration': `${animationDuration}ms`,
        '--content-fade-delay': `${contentFadeDelay}ms`,
      } as React.CSSProperties}
    >
      {/* 卷轴容器 */}
      <div 
        ref={scrollRef}
        className={`scroll-wrapper ${isExpanded ? 'expanded' : 'collapsed'} ${isAnimating ? 'animating' : ''}`}
        onClick={handleScrollClick}
        role="button"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? '收起卷轴' : '展开卷轴'}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        {/* 左轴 */}
        <div className="scroll-left-axis">
          <img 
            src="/左轴.png" 
            alt="卷轴左轴" 
            className="axis-image"
            draggable="false"
          />
        </div>

        {/* 中间纸（可展开部分） */}
        <div className="scroll-middle-paper">
          <div className="paper-background">
            {/* 使用卷轴.png作为背景，通过CSS控制显示部分 */}
            <div className="paper-background-image"></div>
          </div>
          
          {/* 内容区域 */}
          <div 
            ref={contentRef}
            className={`scroll-content ${contentVisible ? 'visible' : 'hidden'}`}
          >
            {children}
          </div>
        </div>

        {/* 右轴 */}
        <div className="scroll-right-axis">
          <img 
            src="/右轴.png" 
            alt="卷轴右轴" 
            className="axis-image"
            draggable="false"
          />
        </div>
      </div>

      {/* 提示文本 */}
      <div className="scroll-hint">
        <span className="hint-text">
          {isExpanded ? '点击卷轴收起' : '点击卷轴展开'}
        </span>
      </div>
    </div>
  );
}