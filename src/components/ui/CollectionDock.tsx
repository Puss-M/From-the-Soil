'use client';

import { useStore } from '@/store/useStore';
import { useState } from 'react';

export function CollectionDock() {
  const { collectedItems } = useStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const totalItems = collectedItems.length;
  const collectedCount = collectedItems.filter(item => item.collected).length;
  const selectedItem = selectedId ? collectedItems.find(i => i.id === selectedId) : null;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* 已选择的构件详情浮窗 */}
      {selectedItem && selectedItem.collected && (
        <div
          style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(16px)',
            borderRadius: 14,
            padding: '14px 18px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            width: 280,
            animation: 'fadeInUp 0.3s ease',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: '#1e293b', fontFamily: 'var(--font-serif)' }}>
              {selectedItem.name}
            </span>
            <button
              onClick={() => setSelectedId(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 14 }}
            >
              ✕
            </button>
          </div>
          <div style={{ fontSize: 10, color: '#6366f1', marginBottom: 6, letterSpacing: 2, fontWeight: 600 }}>
            {selectedItem.category}
          </div>
          <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, marginBottom: 8 }}>
            {selectedItem.description}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, fontSize: 10 }}>
            {[
              { label: '隐私保护', value: selectedItem.attributes.privacy, color: '#0ea5e9' },
              { label: '风水功能', value: selectedItem.attributes.fengshui, color: '#eab308' },
              { label: '造价成本', value: selectedItem.attributes.cost, color: '#ef4444' },
              { label: '美学价值', value: selectedItem.attributes.aesthetic, color: '#8b5cf6' },
            ].map(attr => (
              <div key={attr.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#94a3b8' }}>{attr.label}</span>
                <div style={{ flex: 1, height: 3, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${attr.value * 10}%`, background: attr.color, borderRadius: 2 }} />
                </div>
                <span style={{ color: attr.color, fontWeight: 600, width: 14, textAlign: 'right' }}>{attr.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dock 主体 */}
      <div
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(16px)',
          borderRadius: 14,
          padding: '12px 16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* 标题 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 15 }}>📜</span>
            <span style={{ fontSize: 10, color: '#6366f1', letterSpacing: 3, fontWeight: 600, textTransform: 'uppercase' }}>
              图谱收集
            </span>
          </div>
          <div style={{ fontSize: 12, color: collectedCount === totalItems ? '#10b981' : '#6366f1', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            {collectedCount}/{totalItems}
            {collectedCount === totalItems && ' ✨'}
          </div>
        </div>

        {/* 收集品列表 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
          {collectedItems.map((item) => (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => item.collected && setSelectedId(selectedId === item.id ? null : item.id)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                border: `2px solid ${item.collected ? '#6366f1' : '#e2e8f0'}`,
                background: item.collected ? '#eef2ff' : '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s',
                cursor: item.collected ? 'pointer' : 'default',
                transform: hoveredId === item.id ? 'scale(1.1)' : 'scale(1)',
                boxShadow: item.collected && hoveredId === item.id ? '0 4px 12px rgba(99,102,241,0.2)' : 'none',
                position: 'relative',
              }}
            >
              {item.collected ? (
                <span style={{ fontSize: 16, color: '#6366f1', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
                  {item.name[0]}
                </span>
              ) : (
                <span style={{ fontSize: 18, color: '#cbd5e1' }}>?</span>
              )}

              {/* Tooltip */}
              {hoveredId === item.id && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: 6,
                    background: 'rgba(30,41,59,0.9)',
                    color: 'white',
                    fontSize: 11,
                    padding: '4px 10px',
                    borderRadius: 6,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    fontWeight: 500,
                  }}
                >
                  {item.collected ? item.name : '未收集'}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 进度条 */}
        <div style={{ marginTop: 8, height: 3, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
          <div 
            style={{
              height: '100%',
              background: collectedCount === totalItems
                ? 'linear-gradient(to right, #10b981, #6366f1)'
                : 'linear-gradient(to right, #6366f1, #2563eb)',
              width: `${(collectedCount / Math.max(totalItems, 1)) * 100}%`,
              borderRadius: 2,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}
