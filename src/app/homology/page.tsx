'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import distanceData from '../../../data.csv';

export default function HomologyPage() {
  const heatmapRef = useRef<HTMLDivElement>(null);
  const dendrogramRef = useRef<HTMLDivElement>(null);
  
  // 解析CSV数据
  const parseCSV = () => {
    const lines = distanceData.trim().split('\n');
    const headers = lines[0].split(',').slice(1);
    const matrix: number[][] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').slice(1).map(Number);
      matrix.push(values);
    }
    
    return { headers, matrix };
  };
  
  // 绘制热力图
  const renderHeatmap = () => {
    if (!heatmapRef.current) return;
    
    const { headers, matrix } = parseCSV();
    const myChart = echarts.init(heatmapRef.current);
    
    const data: [number, number, number][] = [];
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        data.push([i, j, matrix[i][j]]);
      }
    }
    
    const option = {
      title: {
        text: '14个民居建筑相似度热力图',
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        formatter: (params: any) => {
          return `${headers[params.data[0]]} <-> ${headers[params.data[1]]}<br/>距离: ${params.data[2].toFixed(3)}`;
        }
      },
      grid: {
        height: '70%',
        top: '15%'
      },
      xAxis: {
        type: 'category',
        data: headers,
        splitArea: { show: true },
        axisLabel: { rotate: 45, fontSize: 10 }
      },
      yAxis: {
        type: 'category',
        data: headers,
        splitArea: { show: true },
        axisLabel: { fontSize: 10 }
      },
      visualMap: {
        min: 0,
        max: 14,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '5%',
        inRange: {
          color: ['#50a3ba', '#eac736', '#d94e5d']
        }
      },
      series: [{
        name: '距离矩阵',
        type: 'heatmap',
        data: data,
        label: { show: false },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    
    myChart.setOption(option);
  };
  
  // 绘制层次聚类树图
  const renderDendrogram = () => {
    if (!dendrogramRef.current) return;
    
    const { headers, matrix } = parseCSV();
    const myChart = echarts.init(dendrogramRef.current);
    
    // 简化层次聚类可视化 - 树状图结构
    const option = {
      title: {
        text: '14个民居建筑层次聚类图',
        left: 'center',
        textStyle: { fontSize: 18 }
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'tree',
          data: [{
            name: '民居建筑聚类',
            children: [
              {
                name: '北方院落组',
                children: [
                  { name: '北京四合院' },
                  { name: '窑洞' },
                  { 
                    name: '西北民居',
                    children: [
                      { name: '高台民居' },
                      { name: '新疆阿以旺' }
                    ]
                  },
                  { name: '山东海草房' }
                ]
              },
              {
                name: '南方民居组',
                children: [
                  {
                    name: '江南民居',
                    children: [
                      { name: '徽派民居' },
                      { name: '苏州民居' },
                      { name: '湘西吊脚楼' }
                    ]
                  },
                  {
                    name: '岭南民居',
                    children: [
                      { name: '广东镬耳屋' },
                      { name: '竹楼' },
                      { name: '客家土楼' }
                    ]
                  }
                ]
              },
              {
                name: '特殊民居组',
                children: [
                  { name: '蒙古包' },
                  { name: '藏族碉房' },
                  { name: '彝族土掌房' }
                ]
              }
            ]
          }],
          top: '10%',
          bottom: '5%',
          layout: 'orthogonal',
          symbol: 'circle',
          symbolSize: 8,
          initialTreeDepth: 3,
          label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 11
          },
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left'
            }
          },
          emphasis: {
            focus: 'descendant'
          },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750
        }
      ]
    };
    
    myChart.setOption(option);
  };
  
  useEffect(() => {
    renderHeatmap();
    renderDendrogram();
    
    const handleResize = () => {
      if (heatmapRef.current) {
        echarts.getInstanceByDom(heatmapRef.current)?.resize();
      }
      if (dendrogramRef.current) {
        echarts.getInstanceByDom(dendrogramRef.current)?.resize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '20px', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: 'white', 
        marginBottom: '30px',
        fontSize: '28px',
        fontWeight: 'bold'
      }}>
        同源路 - 民居建筑相似性分析
      </h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '30px',
        maxWidth: '1800px',
        margin: '0 auto'
      }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <div ref={heatmapRef} style={{ width: '100%', height: '700px' }} />
        </div>
        
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <div ref={dendrogramRef} style={{ width: '100%', height: '700px' }} />
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '30px', color: 'rgba(255,255,255,0.8)' }}>
        <p>数据说明：数值越小表示两个民居建筑的相似性越高，数值越大表示差异性越大</p>
      </div>
    </div>
  );
}