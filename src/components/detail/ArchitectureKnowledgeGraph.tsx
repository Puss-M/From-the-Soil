'use client';

import { useMemo, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { ECharts, EChartsOption } from 'echarts';
import type { StationDetailData } from '@/data/stationDetails';

interface Props {
  detail: StationDetailData;
  stationName: string;
}

type DetailKey = keyof Pick<
  StationDetailData,
  'classification' | 'distribution' | 'defense' | 'materials' | 'folklore' | 'heating' | 'moistureProof'
>;

type GraphNode = {
  id: string;
  name: string;
  category: number;
  symbolSize: number;
  value?: string;
  draggable?: boolean;
  itemStyle?: {
    color?: string;
    borderColor?: string;
    borderWidth?: number;
    shadowBlur?: number;
    shadowColor?: string;
  };
  label?: {
    color?: string;
    fontSize?: number;
    fontWeight?: number | string;
    width?: number;
    overflow?: 'break' | 'truncate' | 'none';
  };
};

type GraphLink = {
  source: string;
  target: string;
  lineStyle?: {
    color?: string;
    width?: number;
    opacity?: number;
    curveness?: number;
  };
};

const CATEGORY_META: Array<{
  key: DetailKey;
  label: string;
  shortLabel: string;
  color: string;
}> = [
  { key: 'classification', label: '建筑分类', shortLabel: '分类', color: '#8b7355' },
  { key: 'distribution', label: '地理分布', shortLabel: '分布', color: '#c4a882' },
  { key: 'defense', label: '防御体系', shortLabel: '防御', color: '#6b5842' },
  { key: 'materials', label: '建筑材料', shortLabel: '材料', color: '#b08968' },
  { key: 'folklore', label: '构件民俗含义', shortLabel: '民俗', color: '#9c6644' },
  { key: 'heating', label: '取暖方式', shortLabel: '取暖', color: '#a67c52' },
  { key: 'moistureProof', label: '防潮方式', shortLabel: '防潮', color: '#7f5539' },
];

function extractFragments(text: string) {
  return text
    .split(/\n+|(?<=。)|(?<=；)|(?<=;)|(?<=！)|(?<=\!)|(?<=\?)/)
    .flatMap((line) => line.split(/\d+\./))
    .map((item) => item.replace(/^\s*[、.．;；:：-]+\s*/, '').trim())
    .filter(Boolean)
    .map((item) => item.replace(/[。；;]+$/g, '').trim())
    .filter((item, index, array) => array.indexOf(item) === index)
    .slice(0, 4);
}

export function ArchitectureKnowledgeGraph({ detail, stationName }: Props) {
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const chartRef = useRef<ReactECharts | null>(null);

  const option = useMemo(() => {
    const nodes: GraphNode[] = [
      {
        id: 'station-root',
        name: stationName,
        category: 0,
        symbolSize: 74,
        draggable: true,
        value: `${stationName} 建筑基因`,
        itemStyle: {
          color: '#ead7bb',
          borderColor: '#f5ead7',
          borderWidth: 3,
          shadowBlur: 24,
          shadowColor: 'rgba(214,185,139,0.28)',
        },
        label: {
          color: '#2f2418',
          fontSize: 15,
          fontWeight: 700,
          width: 110,
          overflow: 'break',
        },
      },
    ];

    const links: GraphLink[] = [];

    CATEGORY_META.forEach((meta, index) => {
      const content = detail[meta.key];
      if (!content || content === '无') {
        return;
      }

      const categoryNodeId = `category-${meta.key}`;
      nodes.push({
        id: categoryNodeId,
        name: meta.shortLabel,
        category: index + 1,
        symbolSize: 42,
        draggable: true,
        value: content,
        itemStyle: {
          color: meta.color,
          borderColor: '#f5ead7',
          borderWidth: 2,
          shadowBlur: 14,
          shadowColor: `${meta.color}44`,
        },
        label: {
          color: '#fffdf8',
          fontSize: 12,
          fontWeight: 600,
          width: 70,
          overflow: 'break',
        },
      });

      links.push({
        source: 'station-root',
        target: categoryNodeId,
        lineStyle: {
          color: `${meta.color}66`,
          width: 2,
          opacity: 0.9,
        },
      });

      extractFragments(content).forEach((fragment, fragmentIndex) => {
        const fragmentId = `${meta.key}-${fragmentIndex}`;
        nodes.push({
          id: fragmentId,
          name: fragment.length > 16 ? `${fragment.slice(0, 16)}…` : fragment,
          category: index + 1,
          symbolSize: 24 + Math.min(fragment.length * 0.6, 12),
          draggable: true,
          value: fragment,
          itemStyle: {
            color: '#fff9f0',
            borderColor: meta.color,
            borderWidth: 1.5,
            shadowBlur: 10,
            shadowColor: `${meta.color}22`,
          },
          label: {
            color: '#3f3226',
            fontSize: 11,
            width: 92,
            overflow: 'break',
          },
        });

        links.push({
          source: categoryNodeId,
          target: fragmentId,
          lineStyle: {
            color: `${meta.color}55`,
            width: 1.2,
            opacity: 0.8,
            curveness: 0.08,
          },
        });
      });
    });

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(26, 22, 18, 0.94)',
        borderColor: '#8b7355',
        borderWidth: 1,
        textStyle: {
          color: '#f3e7d2',
          fontSize: 12,
        },
        formatter: (params) => {
          const payload = Array.isArray(params) ? params[0] : params;
          const data = payload?.data as { value?: string; name?: string } | null | undefined;
          return data?.value || payload?.name || data?.name || '';
        },
      },
      animationDuration: 900,
      animationEasingUpdate: 'cubicOut',
      series: [
        {
          type: 'graph',
          layout: 'force',
          roam: 'move',
          zoom,
          center: ['50%', '50%'],
          draggable: true,
          data: nodes,
          links,
          force: {
            repulsion: 420,
            gravity: 0.03,
            edgeLength: [110, 180],
            friction: 0.08,
            layoutAnimation: true,
          },
          label: {
            show: true,
            position: 'right',
            distance: 8,
            formatter: '{b}',
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 3,
            },
          },
          lineStyle: {
            color: 'rgba(196,168,130,0.28)',
            opacity: 0.82,
            width: 1.2,
            curveness: 0.06,
          },
        },
      ],
    } as EChartsOption;
  }, [detail, stationName, zoom]);

  const handleChartReady = (instance: ECharts) => {
    const dom = instance.getDom();

    const handleWheel = (event: WheelEvent) => {
      event.stopPropagation();
    };
    const handleMouseDown = () => {
      setIsDragging(true);
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    const handleMouseLeave = () => {
      setIsDragging(false);
    };

    dom.addEventListener('wheel', handleWheel, { passive: true });
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('mouseleave', handleMouseLeave);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 18,
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 20% 20%, rgba(196,168,130,0.16) 0%, transparent 28%), linear-gradient(180deg, #fbf7f1 0%, #f3eadf 100%)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(139,115,85,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(139,115,85,0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 2,
          display: 'flex',
          gap: 8,
        }}
      >
        {[
          { label: '－', onClick: () => setZoom((current) => Math.max(0.7, Number((current - 0.15).toFixed(2)))) },
          { label: '重置', onClick: () => setZoom(1) },
          { label: '＋', onClick: () => setZoom((current) => Math.min(1.8, Number((current + 0.15).toFixed(2)))) },
        ].map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            style={{
              minWidth: action.label === '重置' ? 52 : 34,
              height: 34,
              borderRadius: 10,
              border: '1px solid rgba(196,168,130,0.3)',
              background: 'rgba(255,255,255,0.86)',
              color: '#6b5842',
              fontSize: action.label === '重置' ? 12 : 18,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 18px rgba(92,74,58,0.08)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            {action.label}
          </button>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 14,
          top: 14,
          zIndex: 2,
          padding: '6px 10px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.82)',
          border: '1px solid rgba(196,168,130,0.22)',
          color: '#8b7355',
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
        }}
      >
        ZOOM {Math.round(zoom * 100)}%
      </div>

      <div
        style={{
          position: 'absolute',
          left: 14,
          bottom: 14,
          zIndex: 2,
          padding: '8px 10px',
          borderRadius: 12,
          background: 'rgba(255,255,255,0.82)',
          border: '1px solid rgba(196,168,130,0.24)',
          color: '#8b7355',
          fontSize: 11,
          lineHeight: 1.5,
          boxShadow: '0 8px 18px rgba(92,74,58,0.08)',
        }}
      >
        空白处拖动画布，节点可单独拖动
      </div>

      <ReactECharts
        ref={chartRef}
        option={option}
        opts={{ renderer: 'canvas' }}
        style={{
          width: '100%',
          height: '100%',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        notMerge={true}
        lazyUpdate={true}
        onChartReady={handleChartReady}
      />
    </div>
  );
}
