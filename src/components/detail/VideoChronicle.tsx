'use client';

import type { Station } from '@/types';

interface Props {
  station: Station;
}

export function VideoChronicle({ station }: Props) {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 170px)',
        padding: '12px 0 40px',
        color: '#443621',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at top, rgba(244, 251, 255, 0.76), transparent 24%), linear-gradient(180deg, rgba(234, 244, 246, 0.96) 0%, rgba(223, 236, 230, 0.96) 46%, rgba(202, 224, 214, 0.96) 100%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 12, color: '#2e90b7', letterSpacing: 6, marginBottom: 8 }}>VIDEO CHRONICLE</div>
          <h2 style={{ margin: 0, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#1e7e96', fontWeight: 800 }}>
            {station.name.replace(/驿$/, '')} · 影像志
          </h2>
          <div style={{ marginTop: 8, color: '#5a7d78', fontSize: 13, letterSpacing: 2 }}>
            视频信息模块预留位
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: 16,
          }}
        >
          <section
            style={{
              minHeight: 520,
              background: 'rgba(235, 250, 247, 0.38)',
              border: '1px solid rgba(72, 193, 202, 0.42)',
              boxShadow: 'inset 0 0 0 1px rgba(72, 193, 202, 0.14)',
              padding: 22,
            }}
          >
            <div style={{ fontSize: 13, color: '#14738d', fontWeight: 700, marginBottom: 12 }}>影像主屏</div>
            <div
              style={{
                height: 380,
                display: 'grid',
                placeItems: 'center',
                background:
                  'linear-gradient(135deg, rgba(34, 107, 124, 0.9), rgba(80, 141, 125, 0.85)), radial-gradient(circle at center, rgba(255,255,255,0.16), transparent 42%)',
                color: '#eefcff',
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: 4,
              }}
            >
              视频数据待接入
            </div>
            <div style={{ marginTop: 18, fontSize: 14, lineHeight: 1.9, color: '#48635e' }}>
              这里将用于展示 {station.name.replace(/驿$/, '')} 相关视频的播放数据、评论情感、词云、代表视频卡片等内容。
            </div>
          </section>

          <div style={{ display: 'grid', gap: 16 }}>
            {[
              ['拟接入数据', '播放量 / 点赞量 / 评论量 / 弹幕 / 情感分析'],
              ['推荐图表', '视频卡片、评论环图、词云、热视频榜、24小时分布'],
              ['当前状态', '尚无视频源文件，本页先保留结构与视觉位置'],
            ].map(([title, content]) => (
              <section
                key={title}
                style={{
                  minHeight: 160,
                  background: 'rgba(235, 250, 247, 0.38)',
                  border: '1px solid rgba(72, 193, 202, 0.42)',
                  boxShadow: 'inset 0 0 0 1px rgba(72, 193, 202, 0.14)',
                  padding: 20,
                }}
              >
                <div style={{ fontSize: 13, color: '#14738d', fontWeight: 700, marginBottom: 12 }}>{title}</div>
                <div style={{ fontSize: 14, lineHeight: 1.9, color: '#48635e' }}>{content}</div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
