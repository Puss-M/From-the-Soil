'use client';
import { useState } from 'react';
import ScrollAnimation from '@/components/ScrollAnimation';
export default function ScrollDemoPage() {
    const [expandedState, setExpandedState] = useState<boolean>(false);
    const [animationDuration, setAnimationDuration] = useState<number>(600);
    const [contentDelay, setContentDelay] = useState<number>(300);
    const [initialExpanded, setInitialExpanded] = useState<boolean>(false);
    const handleScrollClick = (isExpanded: boolean) => {
        console.log('卷轴状态:', isExpanded ? '展开' : '收起');
        setExpandedState(isExpanded);
    };
    const sampleContent = (<div className="scroll-demo-content">
      <h2 className="scroll-title">《从土中来》项目介绍</h2>
      <div className="scroll-divider"></div>
      <p className="scroll-paragraph">
        本项目旨在探索中国传统民居的建筑智慧与文化内涵，通过数字化手段呈现各地特色民居的独特魅力。
      </p>
      <p className="scroll-paragraph">
        从北方的四合院到南方的土楼，从草原的蒙古包到高原的碉房，每一种民居都是当地自然环境、气候条件和文化传统的结晶。
      </p>
      <div className="scroll-features">
        <div className="feature-item">
          <span className="feature-icon">🏛️</span>
          <span className="feature-text">建筑结构解析</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🔥</span>
          <span className="feature-text">取暖方式展示</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🛡️</span>
          <span className="feature-text">防御体系分析</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">💧</span>
          <span className="feature-text">防潮技术揭秘</span>
        </div>
      </div>
      <p className="scroll-paragraph">
        点击卷轴可以展开或收起内容，体验传统卷轴的展开动画效果。
      </p>
    </div>);
    return (<div className="scroll-demo-page">
      
      <header className="demo-header">
        <h1 className="demo-title">卷轴展开动画演示</h1>
        <p className="demo-subtitle">点击卷轴体验横向展开/收起动画效果</p>
      </header>

      
      <div className="control-panel guofeng-glass">
        <h3 className="control-title">动画参数设置</h3>
        <div className="control-grid">
          <div className="control-item">
            <label className="control-label">
              动画时长: <span className="control-value">{animationDuration}ms</span>
            </label>
            <input type="range" min="300" max="1200" step="100" value={animationDuration} onChange={(e) => setAnimationDuration(parseInt(e.target.value))} className="guofeng-slider"/>
          </div>
          <div className="control-item">
            <label className="control-label">
              内容淡入延迟: <span className="control-value">{contentDelay}ms</span>
            </label>
            <input type="range" min="0" max="600" step="50" value={contentDelay} onChange={(e) => setContentDelay(parseInt(e.target.value))} className="guofeng-slider"/>
          </div>
          <div className="control-item">
            <label className="control-label">
              初始状态:
            </label>
            <div className="toggle-group">
              <button className={`toggle-button ${!initialExpanded ? 'active' : ''}`} onClick={() => setInitialExpanded(false)}>
                收起
              </button>
              <button className={`toggle-button ${initialExpanded ? 'active' : ''}`} onClick={() => setInitialExpanded(true)}>
                展开
              </button>
            </div>
          </div>
          <div className="control-item">
            <div className="status-display">
              <span className="status-label">当前状态:</span>
              <span className={`status-value ${expandedState ? 'expanded' : 'collapsed'}`}>
                {expandedState ? '已展开' : '已收起'}
              </span>
            </div>
          </div>
        </div>
      </div>

      
      <div className="demo-area">
        <ScrollAnimation initialExpanded={initialExpanded} animationDuration={animationDuration} contentFadeDelay={contentDelay} onClick={handleScrollClick}>
          {sampleContent}
        </ScrollAnimation>
      </div>

      
      <div className="feature-grid">
        <div className="feature-card guofeng-glass">
          <div className="feature-icon-large">🎨</div>
          <h4 className="feature-card-title">传统美学</h4>
          <p className="feature-card-desc">
            采用传统卷轴设计，结合现代动画技术，呈现古典与现代的完美融合。
          </p>
        </div>
        <div className="feature-card guofeng-glass">
          <div className="feature-icon-large">⚡</div>
          <h4 className="feature-card-title">平滑动画</h4>
          <p className="feature-card-desc">
            使用CSS Transition实现流畅的展开/收起动画，支持自定义动画时长。
          </p>
        </div>
        <div className="feature-card guofeng-glass">
          <div className="feature-icon-large">📱</div>
          <h4 className="feature-card-title">响应式设计</h4>
          <p className="feature-card-desc">
            适配各种屏幕尺寸，在移动设备和桌面端都能完美显示。
          </p>
        </div>
        <div className="feature-card guofeng-glass">
          <div className="feature-icon-large">🔄</div>
          <h4 className="feature-card-title">交互友好</h4>
          <p className="feature-card-desc">
            支持点击、键盘操作，提供视觉反馈和状态提示。
          </p>
        </div>
      </div>

      
      <style jsx>{`
        .scroll-demo-page {
          min-height: 100vh;
          padding: 40px 20px;
          background: var(--background);
          color: var(--foreground);
          font-family: "Noto Serif SC", "STSong", "SimSun", serif;
        }

        .demo-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .demo-title {
          font-size: 36px;
          font-weight: 800;
          color: var(--paper-brown);
          margin: 0 0 12px 0;
          font-family: "KaiTi", "STKaiti", "Noto Serif SC", serif;
          letter-spacing: 0.12em;
        }

        .demo-subtitle {
          font-size: 16px;
          color: var(--paper-muted);
          margin: 0;
          letter-spacing: 0.1em;
          opacity: 0.9;
        }

        .control-panel {
          max-width: 800px;
          margin: 0 auto 48px;
          padding: 24px;
          border-radius: var(--radius-lg);
        }

        .control-title {
          font-size: 20px;
          font-weight: 600;
          color: var(--paper-brown);
          margin: 0 0 20px 0;
          text-align: center;
          font-family: "KaiTi", "STKaiti", "Noto Serif SC", serif;
        }

        .control-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .control-item {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .control-label {
          font-size: 14px;
          color: var(--paper-ink);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .control-value {
          font-weight: 600;
          color: var(--paper-gold);
        }

        .toggle-group {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .toggle-button {
          flex: 1;
          padding: 8px 16px;
          border: 1px solid var(--ui-border);
          background: var(--paper-base);
          color: var(--paper-muted);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .toggle-button.active {
          background: var(--paper-gold-soft);
          color: var(--paper-brown);
          border-color: var(--paper-gold);
          font-weight: 600;
        }

        .toggle-button:hover:not(.active) {
          border-color: var(--paper-muted);
        }

        .status-display {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: rgba(139, 104, 70, 0.05);
          border-radius: var(--radius-sm);
          border: 1px solid rgba(139, 104, 70, 0.1);
        }

        .status-label {
          font-size: 14px;
          color: var(--paper-muted);
        }

        .status-value {
          font-size: 14px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 999px;
          transition: all 0.3s ease;
        }

        .status-value.collapsed {
          background: rgba(139, 104, 70, 0.1);
          color: var(--paper-brown);
        }

        .status-value.expanded {
          background: rgba(184, 138, 59, 0.15);
          color: var(--paper-gold);
        }

        .demo-area {
          margin: 48px auto;
          max-width: 1000px;
        }

        .scroll-demo-content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .scroll-title {
          font-size: 28px;
          font-weight: 700;
          color: var(--paper-brown);
          margin: 0 0 16px 0;
          font-family: "KaiTi", "STKaiti", "Noto Serif SC", serif;
        }

        .scroll-divider {
          width: 80px;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--paper-gold), transparent);
          margin: 0 auto 24px;
        }

        .scroll-paragraph {
          font-size: 16px;
          line-height: 1.8;
          color: var(--paper-ink);
          margin: 0 0 16px 0;
          max-width: 600px;
        }

        .scroll-features {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
          margin: 24px 0;
        }

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(184, 138, 59, 0.08);
          border-radius: var(--radius-md);
          border: 1px solid rgba(184, 138, 59, 0.2);
          min-width: 120px;
        }

        .feature-icon {
          font-size: 24px;
        }

        .feature-text {
          font-size: 14px;
          color: var(--paper-brown);
          font-weight: 500;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 64px auto 0;
        }

        .feature-card {
          padding: 24px;
          text-align: center;
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
        }

        .feature-icon-large {
          font-size: 40px;
          margin-bottom: 16px;
        }

        .feature-card-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--paper-brown);
          margin: 0 0 12px 0;
          font-family: "KaiTi", "STKaiti", "Noto Serif SC", serif;
        }

        .feature-card-desc {
          font-size: 14px;
          line-height: 1.6;
          color: var(--paper-muted);
          margin: 0;
        }

        @media (max-width: 768px) {
          .demo-title {
            font-size: 28px;
          }
          
          .control-grid {
            grid-template-columns: 1fr;
          }
          
          .feature-grid {
            grid-template-columns: 1fr;
          }
          
          .scroll-features {
            flex-direction: column;
            align-items: center;
          }
          
          .feature-item {
            width: 100%;
            max-width: 200px;
          }
        }
      `}</style>
    </div>);
}
