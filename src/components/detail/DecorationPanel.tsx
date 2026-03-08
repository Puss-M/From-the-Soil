'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { DecorationItem } from '@/data/decorationData';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface Props {
  decorations: DecorationItem[];
  stationName: string;
}

export function DecorationPanel({ decorations, stationName }: Props) {
  // 按表现形式分组
  const groupedByForm = useMemo(() => {
    const groups: Record<string, DecorationItem[]> = {};
    decorations.forEach((d) => {
      const key = d.form || '其他';
      if (!groups[key]) groups[key] = [];
      groups[key].push(d);
    });
    return groups;
  }, [decorations]);

  // 饼图数据 - 按表现形式统计
  const formPieOption = useMemo(() => {
    const data = Object.entries(groupedByForm).map(([name, items]) => ({
      name,
      value: items.length,
    }));
    return {
      backgroundColor: 'transparent',
      title: {
        text: '装饰类型分布',
        left: 'center',
        textStyle: { fontSize: 15, fontWeight: 700, color: '#3a2a1a' },
      },
      tooltip: {
        trigger: 'item' as const,
        formatter: '{b}: {c}项 ({d}%)',
      },
      legend: {
        orient: 'vertical' as const,
        left: 'left',
        top: 'middle',
        textStyle: { fontSize: 11, color: '#6b7280' },
      },
      series: [{
        type: 'pie',
        radius: ['35%', '65%'],
        center: ['58%', '55%'],
        roseType: 'radius',
        label: {
          show: true,
          fontSize: 11,
          color: '#4a4a4a',
          formatter: '{b}\n{c}项',
        },
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
        },
        data: data.map((d, i) => ({
          ...d,
          itemStyle: {
            color: [
              '#c4581c', '#4a90c4', '#2d8a56', '#8b5cf6',
              '#f59e0b', '#06b6d4', '#ec4899', '#84cc16',
            ][i % 8],
          },
        })),
      }],
    };
  }, [groupedByForm]);

  // 题材分类饼图
  const categoryPieOption = useMemo(() => {
    const catMap: Record<string, number> = {};
    decorations.forEach((d) => {
      const cats = (d.category || '').split(/[、，,]/);
      cats.forEach((c) => {
        const trimmed = c.trim();
        if (trimmed && trimmed !== '无题材类') {
          catMap[trimmed] = (catMap[trimmed] || 0) + 1;
        }
      });
    });
    const data = Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));

    return {
      backgroundColor: 'transparent',
      title: {
        text: '题材分类统计',
        left: 'center',
        textStyle: { fontSize: 15, fontWeight: 700, color: '#3a2a1a' },
      },
      tooltip: {
        trigger: 'item' as const,
        formatter: '{b}: {c}次 ({d}%)',
      },
      legend: {
        orient: 'vertical' as const,
        right: 'right',
        top: 'middle',
        textStyle: { fontSize: 10, color: '#6b7280' },
      },
      series: [{
        type: 'pie',
        radius: ['30%', '60%'],
        center: ['40%', '55%'],
        label: {
          show: true,
          fontSize: 10,
          color: '#4a4a4a',
        },
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2,
        },
        data: data.map((d, i) => ({
          ...d,
          itemStyle: {
            color: [
              '#dc2626', '#d97706', '#16a34a', '#2563eb',
              '#7c3aed', '#0891b2', '#db2777', '#65a30d',
              '#ca8a04', '#0d9488',
            ][i % 10],
          },
        })),
      }],
    };
  }, [decorations]);

  const formIcons: Record<string, string> = {
    '砖雕': '🧱', '木雕': '🪵', '石雕': '🪨', '彩绘': '🎨',
    '绘画装饰': '🖌️', '灰塑': '🏗️', '瓦作': '🏠',
    '针黹工艺（毡绣/刺绣）': '🧵', '木工雕刻/彩绘': '🪚',
    '银铜器饰艺': '🥇', '竹编': '🎋', '陶塑': '🏺',
  };

  return (
    <div style={{ marginBottom: 48 }}>
      {/* 标题 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
      }}>
        <div style={{ width: 4, height: 24, background: '#c4581c', borderRadius: 2 }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#3a2a1a', margin: 0 }}>
          装饰艺术
        </h2>
        <span style={{ fontSize: 12, color: '#a08b73' }}>
          {stationName} · 共 {decorations.length} 项
        </span>
      </div>

      {/* 图表行 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
        marginBottom: 24,
      }}>
        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: 20,
          border: '1px solid #e8e0d8',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}>
          <ReactECharts option={formPieOption} style={{ height: 300 }} />
        </div>
        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: 20,
          border: '1px solid #e8e0d8',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}>
          <ReactECharts option={categoryPieOption} style={{ height: 300 }} />
        </div>
      </div>

      {/* 分类列表 */}
      {Object.entries(groupedByForm).map(([form, items]) => (
        <div key={form} style={{ marginBottom: 20 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
            padding: '8px 16px',
            background: 'rgba(196, 168, 130, 0.08)',
            borderRadius: 10,
            borderLeft: '3px solid #c4a882',
          }}>
            <span style={{ fontSize: 18 }}>{formIcons[form] || '🎨'}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#5c4a3a' }}>{form}</span>
            <span style={{ fontSize: 11, color: '#a08b73', marginLeft: 4 }}>({items.length}项)</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 10,
          }}>
            {items.map((item, idx) => (
              <div key={idx} style={{
                background: 'white',
                borderRadius: 12,
                padding: '14px 18px',
                border: '1px solid #e8e0d8',
                fontSize: 12,
                lineHeight: 1.7,
              }}>
                <div style={{ fontWeight: 600, color: '#5c4a3a', marginBottom: 4 }}>
                  📍 {item.location}
                </div>
                <div style={{ color: '#4a4a4a', marginBottom: 4 }}>
                  {item.motif.length > 100 ? item.motif.slice(0, 100) + '...' : item.motif}
                </div>
                {item.category && (
                  <div style={{
                    display: 'inline-block',
                    fontSize: 10,
                    color: '#8b5cf6',
                    background: '#faf5ff',
                    padding: '2px 8px',
                    borderRadius: 10,
                    marginRight: 4,
                  }}>
                    {item.category}
                  </div>
                )}
                {item.feature && (
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, fontStyle: 'italic' }}>
                    {item.feature}
                  </div>
                )}
                {item.folklore && (
                  <div style={{ fontSize: 11, color: '#92400e', marginTop: 4 }}>
                    🎭 {item.folklore.length > 80 ? item.folklore.slice(0, 80) + '...' : item.folklore}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
