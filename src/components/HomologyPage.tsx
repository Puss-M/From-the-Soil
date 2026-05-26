'use client';
import React, { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useStore } from '@/store/useStore';
import comparisonData, { ComparisonText } from '@/data/homologyTexts';
const houseNames = [
    '北京四合院', '徽派民居', '苏州民居', '客家土楼', '蒙古包', '窑洞', '湘西吊脚楼',
    '藏族碉房', '山东海草房', '高台民居', '新疆阿以旺', '广东镬耳屋', '彝族土掌房', '竹楼'
];
const similarityMatrix = [
    [1.000000, 0.473235, 0.554538, 0.426550, 0.510101, 0.719050, 0.546172, 0.531721, 0.648836, 0.576536, 0.572806, 0.389546, 0.502998, 0.390826],
    [0.473235, 1.000000, 0.739139, 0.741810, 0.208804, 0.445266, 0.788995, 0.380648, 0.552027, 0.367791, 0.359546, 0.658413, 0.498926, 0.487816],
    [0.554538, 0.739139, 1.000000, 0.601060, 0.243978, 0.491592, 0.736833, 0.398939, 0.620903, 0.467046, 0.475613, 0.657987, 0.497908, 0.472594],
    [0.426550, 0.741810, 0.601060, 1.000000, 0.220663, 0.466389, 0.713464, 0.514572, 0.559647, 0.344795, 0.341216, 0.579223, 0.650898, 0.521088],
    [0.510101, 0.208804, 0.243978, 0.220663, 1.000000, 0.656654, 0.247646, 0.461032, 0.473438, 0.537038, 0.478579, 0.000000, 0.246483, 0.026042],
    [0.719050, 0.445266, 0.491592, 0.466389, 0.656654, 1.000000, 0.519857, 0.688351, 0.637954, 0.751605, 0.714863, 0.282101, 0.544550, 0.338522],
    [0.546172, 0.788995, 0.736833, 0.713464, 0.247646, 0.519857, 1.000000, 0.505052, 0.565105, 0.445499, 0.445393, 0.676807, 0.575908, 0.504970],
    [0.531721, 0.380648, 0.398939, 0.514572, 0.461032, 0.688351, 0.505052, 1.000000, 0.528804, 0.543742, 0.544000, 0.281840, 0.646486, 0.340324],
    [0.648836, 0.552027, 0.620903, 0.559647, 0.473438, 0.637954, 0.565105, 0.528804, 1.000000, 0.494657, 0.479136, 0.398117, 0.529067, 0.349766],
    [0.576536, 0.367791, 0.467046, 0.344795, 0.537038, 0.751605, 0.445499, 0.543742, 0.494657, 1.000000, 0.873719, 0.220231, 0.425583, 0.272509],
    [0.572806, 0.359546, 0.475613, 0.341216, 0.478579, 0.714863, 0.445393, 0.544000, 0.479136, 0.873719, 1.000000, 0.238255, 0.443691, 0.298316],
    [0.389546, 0.658413, 0.657987, 0.579223, 0.000000, 0.282101, 0.676807, 0.281840, 0.398117, 0.220231, 0.238255, 1.000000, 0.493391, 0.602266],
    [0.502998, 0.498926, 0.497908, 0.650898, 0.246483, 0.544550, 0.575908, 0.646486, 0.529067, 0.425583, 0.443691, 0.493391, 1.000000, 0.653610],
    [0.390826, 0.487816, 0.472594, 0.521088, 0.026042, 0.338522, 0.504970, 0.340324, 0.349766, 0.272509, 0.298316, 0.602266, 0.653610, 1.000000]
];
type HeatmapPoint = [number, number, number];
type HeatmapTooltipParams = {
    data: HeatmapPoint;
};
type TreeTooltipParams = {
    data?: {
        tooltip?: string;
    };
    name?: string;
};
type HeatmapClickParams = {
    componentType?: string;
    data?: HeatmapPoint;
};
export function HomologyPage() {
    const { setPhase } = useStore();
    const [selectedPair, setSelectedPair] = useState<[
        number,
        number
    ] | null>(null);
    const imageNameMap: Record<string, string> = {
        '北京四合院': '四合院',
        '湘西吊脚楼': '吊脚楼',
        '彝族土掌房': '土掌房',
        '客家土楼': '土楼',
        '山东海草房': '海草房',
        '藏族碉房': '碉房',
        '新疆阿以旺': '阿以旺',
        '广东镬耳屋': '镬耳屋',
        '苏州民居': '苏式民居'
    };
    const heatmapOption = useMemo(() => {
        const data: HeatmapPoint[] = [];
        for (let i = 0; i < 14; i++) {
            for (let j = 0; j < 14; j++) {
                data.push([i, j, similarityMatrix[i][j]]);
            }
        }
        return {
            title: {
                text: '14个民居建筑相似度热力图',
                left: 'center',
                textStyle: {
                    fontFamily: '"演示秋鸿楷", "YanShi QiuHongKai", serif',
                    fontSize: 20,
                    color: '#3a2a1a'
                }
            },
            tooltip: {
                position: 'top',
                formatter: (params: HeatmapTooltipParams) => {
                    return `${houseNames[params.data[0]]} ↔ ${houseNames[params.data[1]]}<br/>相似度: ${(params.data[2] * 100).toFixed(1)}%`;
                }
            },
            grid: {
                height: '70%',
                top: 80,
                left: 120
            },
            xAxis: {
                type: 'category',
                data: houseNames.map(name => name.split('').join('\n')),
                splitArea: { show: true },
                axisLabel: {
                    rotate: 0,
                    fontSize: 15,
                    fontFamily: 'SimSun',
                    fontWeight: 500,
                    lineHeight: 18
                }
            },
            yAxis: {
                type: 'category',
                data: houseNames,
                splitArea: { show: true },
                axisLabel: {
                    fontSize: 15,
                    fontFamily: 'SimSun',
                    fontWeight: 500
                }
            },
            visualMap: {
                min: 0,
                max: 1,
                calculable: true,
                orient: 'vertical',
                right: -15,
                top: 'center',
                bottom: 60,
                dimension: 2,
                hoverLink: true,
                text: ['高', '低'],
                showLabel: true,
                precision: 2,
                inRange: {
                    color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#fdae61', '#f46d43', '#d73027']
                }
            },
            series: [{
                    name: '相似度矩阵',
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
    }, []);
    const treeOption = useMemo(() => {
        return {
            title: {
                text: '14个民居建筑层次聚类树状图',
                left: 'center',
                textStyle: {
                    fontFamily: '"演示秋鸿楷", "YanShi QiuHongKai", serif',
                    fontSize: 20,
                    color: '#3a2a1a'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params: TreeTooltipParams) {
                    return params.data?.tooltip || params.name || '';
                },
                extraCssText: 'white-space: pre-wrap; max-width: 300px;'
            },
            series: [{
                    type: 'tree',
                    orient: 'LR',
                    top: '8%',
                    bottom: '3%',
                    left: '15%',
                    right: '15%',
                    layout: 'orthogonal',
                    symbol: 'circle',
                    symbolSize: 10,
                    initialTreeDepth: 7,
                    roam: false,
                    label: {
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 13,
                        fontFamily: 'SimSun',
                        fontWeight: 500,
                        rotate: 0
                    },
                    leaves: {
                        label: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left',
                            fontSize: 14,
                            fontWeight: 600,
                            rotate: 0
                        }
                    },
                    lineStyle: {
                        width: 2,
                        color: '#8b6846',
                        curveness: 0.5
                    },
                    itemStyle: {
                        color: '#b88a3b',
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    emphasis: {
                        focus: 'descendant'
                    },
                    expandAndCollapse: true,
                    animationDuration: 550,
                    animationDurationUpdate: 750,
                    data: [{
                            name: '全部民居谱系',
                            tooltip: '北方重保温防风、土砖石结构；南方重通风防潮、木构为主，气候与建筑体系差异最大。',
                            label: {
                                fontSize: 14,
                                fontWeight: 600
                            },
                            children: [
                                {
                                    name: '',
                                    tooltip: '高台民居、阿以旺、蒙古包、碉房、海草房、四合院、窑洞，均为北方/西北寒冷干旱区民居，以保温防风、土砖石结构为共同特征。',
                                    children: [
                                        {
                                            name: '',
                                            tooltip: '均为新疆干旱地区生土民居，厚墙隔热、防风沙，气候适应性与建筑形制高度相似。',
                                            children: [
                                                { name: '高台民居' },
                                                { name: '新疆阿以旺' }
                                            ]
                                        },
                                        {
                                            name: '',
                                            tooltip: '均属北方寒冷干旱/草原体系，核心功能为防风保暖，归为北方大类分支。',
                                            children: [
                                                { name: '蒙古包' },
                                                {
                                                    name: '',
                                                    tooltip: '均为高海拔/北方寒冷型建筑，石砌夯土墙、小窗封闭，抵御严寒强风。',
                                                    children: [
                                                        { name: '藏族碉房' },
                                                        {
                                                            name: '',
                                                            tooltip: '均属北方寒冷多风地区民居，厚重围护结构，共同适应低温、大风气候。',
                                                            children: [
                                                                { name: '山东海草房' },
                                                                {
                                                                    name: '',
                                                                    tooltip: '均为北方黄土/华北民居，内向封闭布局，土砖结构为主，注重冬季保温防风。',
                                                                    children: [
                                                                        { name: '北京四合院' },
                                                                        { name: '窑洞' }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    name: '',
                                    tooltip: '土掌房、竹楼、镬耳屋、土楼、苏州民居、徽派、吊脚楼，均为南方湿润区民居，以木构、通风防潮为共同特征。',
                                    children: [
                                        {
                                            name: '',
                                            tooltip: '均为西南亚热带少数民族民居，通风隔热、适应高温多雨与山地地形。',
                                            children: [
                                                { name: '彝族土掌房' },
                                                { name: '竹楼' }
                                            ]
                                        },
                                        {
                                            name: '',
                                            tooltip: '均属华南湿热民居，山墙防火通风，木构为主，适应高温多雨气候。',
                                            children: [
                                                { name: '广东镬耳屋' },
                                                {
                                                    name: '',
                                                    tooltip: '均为南方山地聚居民居，夯土木构、内向合院，适应多雨潮湿环境。',
                                                    children: [
                                                        { name: '客家土楼' },
                                                        {
                                                            name: '',
                                                            tooltip: '均属江南水乡民居体系，白墙黛瓦、天井布局，注重通风防潮，文化气候同源。',
                                                            children: [
                                                                { name: '苏州民居' },
                                                                {
                                                                    name: '',
                                                                    tooltip: '均为南方山地湿润民居，木结构为主，防潮通风，适应多雨多山地形。',
                                                                    children: [
                                                                        { name: '徽派民居' },
                                                                        { name: '湘西吊脚楼' }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }]
                }]
        };
    }, []);
    return (<div className="relative w-full h-full overflow-hidden" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            backgroundImage: 'url(/fengmian/di3.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
      
      <div className="guofeng-glass-strong" style={{
            position: 'fixed',
            top: 20,
            left: 22,
            zIndex: 20,
            padding: '12px 20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        }} onClick={() => setPhase('map')} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
        }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
        }}>
        <span style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#3a2a1a',
            fontFamily: '"演示秋鸿楷", serif',
            letterSpacing: '0.1em'
        }}>
          ← 返回地图
        </span>
      </div>

      
      <div style={{
            position: 'absolute',
            top: 25,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            textAlign: 'center'
        }}>
        <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#3a2a1a',
            fontFamily: '"演示秋鸿楷", serif',
            letterSpacing: '0.2em',
            margin: 0
        }}>
          同源录 · 建筑谱系分析
        </h2>
      </div>

      
      <div style={{
            display: 'flex',
            flexDirection: 'row',
            height: 'calc(100vh - 120px)',
            marginTop: 80,
            padding: '0 40px',
            gap: '30px'
        }}>
        
        <div style={{
            flex: 1,
            background: 'rgba(255, 248, 234, 1)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(91, 70, 44, 0.15)'
        }}>
          <ReactECharts option={heatmapOption} style={{ height: '100%', width: '100%' }} onEvents={{
            click: (params: HeatmapClickParams) => {
                const data = params.data;
                if (params.componentType === 'series' && data && data.length >= 3) {
                    const i = data[0];
                    const j = data[1];
                    if (i !== undefined && j !== undefined && i !== j) {
                        setSelectedPair([i, j]);
                    }
                }
            }
        }}/>
        </div>

        
        <div style={{
            flex: 1,
            background: 'rgba(255, 248, 234, 0.85)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(91, 70, 44, 0.15)',
            position: 'relative'
        }}>
          {selectedPair ? (() => {
            const key = `${Math.min(selectedPair[0], selectedPair[1])}_${Math.max(selectedPair[0], selectedPair[1])}`;
            const textData: ComparisonText | undefined = comparisonData[key];
            return (<div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                    flexShrink: 0
                }}>
                <h3 style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: 600,
                    fontFamily: '"演示秋鸿楷", serif',
                    color: '#3a2a1a'
                }}>
                  {houseNames[selectedPair[0]]} ↔ {houseNames[selectedPair[1]]}
                </h3>
                <span style={{
                    cursor: 'pointer',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#8b6846',
                    padding: '0 8px',
                    transition: 'all 0.2s'
                }} onClick={() => setSelectedPair(null)} onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#b88a3b';
                }} onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#8b6846';
                }}>
                  ×
                </span>
              </div>
              <div style={{
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 0
                }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <img src={`/memory-game/${imageNameMap[houseNames[selectedPair[0]]] || houseNames[selectedPair[0]]}.jpg`} alt={houseNames[selectedPair[0]]} style={{
                    maxWidth: '100%',
                    maxHeight: '350px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(91, 70, 44, 0.2)'
                }}/>
                  <p style={{ marginTop: '8px', fontSize: '14px', fontWeight: 500 }}>
                    {houseNames[selectedPair[0]]}
                  </p>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#b88a3b'
                }}>
                  ⇄
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <img src={`/memory-game/${imageNameMap[houseNames[selectedPair[1]]] || houseNames[selectedPair[1]]}.jpg`} alt={houseNames[selectedPair[1]]} style={{
                    maxWidth: '100%',
                    maxHeight: '350px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(91, 70, 44, 0.2)'
                }}/>
                  <p style={{ marginTop: '8px', fontSize: '14px', fontWeight: 500 }}>
                    {houseNames[selectedPair[1]]}
                  </p>
                </div>
              </div>
              <div style={{
                    textAlign: 'center',
                    marginTop: '8px',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#3a2a1a',
                    flexShrink: 0
                }}>
                相似度: {(similarityMatrix[selectedPair[0]][selectedPair[1]] * 100).toFixed(1)}%
              </div>
              {textData && (<div style={{
                        flex: 1,
                        overflowY: 'auto',
                        marginTop: '10px',
                        padding: '12px 14px',
                        background: 'rgba(255, 248, 234, 0.6)',
                        borderRadius: '8px',
                        border: '1px solid rgba(139, 104, 70, 0.2)',
                        fontSize: '20px',
                        lineHeight: '1.7',
                        color: '#3a2a1a',
                        fontFamily: 'SimSun, serif',
                        whiteSpace: 'pre-wrap'
                    }}>
                  <div style={{ marginBottom: '10px' }}>{textData.climate}</div>
                  <div>{textData.architecture}</div>
                </div>)}
            </div>);
        })() : (<div style={{ position: 'relative', height: '100%', width: '100%' }}>
              <ReactECharts option={treeOption} style={{ height: '100%', width: '100%' }}/>
              <div style={{
                position: 'absolute',
                right: '-5px',
                bottom: '-20px',
                fontSize: '14px',
                color: '#6b5a4a',
                fontFamily: '"演示秋鸿楷", serif',
                lineHeight: '1.5',
                textAlign: 'right',
                background: 'rgba(255, 248, 234, 0)',
                padding: '10px 15px',
                borderRadius: '8px',
                whiteSpace: 'nowrap'
            }}>
                「同源录」以热力图量化环境相似性，以聚类树构建民居谱系<br />
                可以通过交互探索，发现那些因相似气候而生的建筑同源智慧
              </div>
            </div>)}
        </div>
      </div>
    </div>);
}
