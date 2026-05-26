'use client';
import { useState, useRef, useEffect } from 'react';
import './ScrollAnimation.css';
interface ScrollAnimationProps {
    children?: React.ReactNode;
    initialExpanded?: boolean;
    animationDuration?: number;
    contentFadeDelay?: number;
    className?: string;
    onClick?: (isExpanded: boolean) => void;
}
export default function ScrollAnimation({ children, initialExpanded = false, animationDuration = 600, contentFadeDelay = 300, className = '', onClick, }: ScrollAnimationProps) {
    const [isExpanded, setIsExpanded] = useState(initialExpanded);
    const [isAnimating, setIsAnimating] = useState(false);
    const [contentVisible, setContentVisible] = useState(initialExpanded);
    const scrollRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const handleToggle = () => {
        if (isAnimating)
            return;
        setIsAnimating(true);
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState);
        if (newExpandedState) {
            setTimeout(() => {
                setContentVisible(true);
            }, contentFadeDelay);
        }
        else {
            setContentVisible(false);
        }
        setTimeout(() => {
            setIsAnimating(false);
        }, animationDuration);
        onClick?.(newExpandedState);
    };
    const handleScrollClick = (e: React.MouseEvent) => {
        if (e.target === scrollRef.current ||
            (scrollRef.current && scrollRef.current.contains(e.target as Node))) {
            handleToggle();
        }
    };
    useEffect(() => {
        if (initialExpanded) {
            const timer = window.setTimeout(() => setContentVisible(true), 0);
            return () => window.clearTimeout(timer);
        }
        return undefined;
    }, [initialExpanded]);
    return (<div className={`scroll-animation-container ${className}`} style={{
            '--animation-duration': `${animationDuration}ms`,
            '--content-fade-delay': `${contentFadeDelay}ms`,
        } as React.CSSProperties}>
      
      <div ref={scrollRef} className={`scroll-wrapper ${isExpanded ? 'expanded' : 'collapsed'} ${isAnimating ? 'animating' : ''}`} onClick={handleScrollClick} role="button" aria-expanded={isExpanded} aria-label={isExpanded ? '收起卷轴' : '展开卷轴'} tabIndex={0} onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggle();
            }
        }}>
        
        <div className="scroll-left-axis">
          <img src="/左轴.png" alt="卷轴左轴" className="axis-image" draggable="false"/>
        </div>

        
        <div className="scroll-middle-paper">
          <div className="paper-background">
            
            <div className="paper-background-image"></div>
          </div>
          
          
          <div ref={contentRef} className={`scroll-content ${contentVisible ? 'visible' : 'hidden'}`}>
            {children}
          </div>
        </div>

        
        <div className="scroll-right-axis">
          <img src="/右轴.png" alt="卷轴右轴" className="axis-image" draggable="false"/>
        </div>
      </div>

      
      <div className="scroll-hint">
        <span className="hint-text">
          {isExpanded ? '点击卷轴收起' : '点击卷轴展开'}
        </span>
      </div>
    </div>);
}
