'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
const themeText = '#8a5a1f';
const subText = '#a2743c';
const lightText = '#9a6a2e';
export default function SiheyuanDashboard() {
    const router = useRouter();
    const screenRef = useRef<HTMLDivElement>(null);
    const chartsRef = useRef<echarts.ECharts[]>([]);
    const [currentDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [isEmbedded, setIsEmbedded] = useState(false);
    async function initCharts() {
        const list: echarts.ECharts[] = [];
        await import('echarts-wordcloud');
        const lineChart = echarts.init(document.getElementById('chart-line')!);
        list.push(lineChart);
        lineChart.setOption({
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                borderColor: 'rgba(93, 222, 214, 0.5)',
                textStyle: { color: '#333' }
            },
            grid: { left: 48, right: 38, top: 38, bottom: 38 },
            legend: {
                top: 6, right: 22,
                itemWidth: 15, itemHeight: 10,
                textStyle: { color: lightText, fontSize: 11 }
            },
            xAxis: [{
                    type: 'category',
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    axisLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.3)' } },
                    axisTick: { show: false },
                    axisLabel: { color: lightText, fontSize: 11 }
                }],
            yAxis: [
                {
                    type: 'value', name: '降水(mm)',
                    nameTextStyle: { color: subText, fontSize: 10 },
                    min: 0, max: 200, interval: 50,
                    axisLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.3)' } },
                    axisTick: { show: false },
                    axisLabel: { color: subText, fontSize: 10 },
                    splitLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.08)' } }
                },
                {
                    type: 'value', name: '温度(℃)',
                    nameTextStyle: { color: subText, fontSize: 10 },
                    min: -10, max: 30, interval: 10,
                    axisLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: { color: subText, fontSize: 10 },
                    splitLine: { show: false }
                }
            ],
            series: [
                {
                    name: '月降水量', type: 'bar', yAxisIndex: 0, barWidth: 17,
                    itemStyle: {
                        color: '#58c8d2',
                        borderRadius: [8, 8, 0, 0],
                        shadowBlur: 8,
                        shadowColor: 'rgba(88, 200, 210, 0.3)'
                    },
                    data: [3, 5, 8, 18, 35, 78, 173, 151, 58, 28, 8, 2]
                },
                {
                    name: '月均温度', type: 'line', yAxisIndex: 1, smooth: true,
                    symbol: 'circle', symbolSize: 7,
                    lineStyle: { width: 3, color: '#c8954d' },
                    itemStyle: { color: '#d7b06e', borderColor: '#c8954d', borderWidth: 2 },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(200, 149, 77, 0.35)' },
                            { offset: 1, color: 'rgba(200, 149, 77, 0.05)' }
                        ])
                    },
                    data: [-4, -1, 7, 15, 21, 26, 28, 27, 22, 14, 5, -2]
                }
            ]
        });
        const catChart = echarts.init(document.getElementById('chart-category')!);
        list.push(catChart);
        catChart.setOption({
            graphic: [
                { type: 'circle', left: '20%', top: '25%', shape: { r: 45 }, style: { fill: 'rgba(224, 93, 106, 0.8)' }, z: 10 },
                { type: 'circle', left: '42%', top: '18%', shape: { r: 55 }, style: { fill: 'rgba(102, 66, 126, 0.8)' }, z: 10 },
                { type: 'circle', left: '55%', top: '45%', shape: { r: 48 }, style: { fill: 'rgba(82, 185, 199, 0.8)' }, z: 10 },
                { type: 'circle', left: '25%', top: '52%', shape: { r: 42 }, style: { fill: 'rgba(186, 161, 81, 0.8)' }, z: 10 },
                { type: 'text', left: '18%', top: '24%', style: { text: '一进', fill: '#fff', fontSize: 11, fontWeight: 'bold' }, z: 20 },
                { type: 'text', left: '41%', top: '16%', style: { text: '三进', fill: '#fff', fontSize: 12, fontWeight: 'bold' }, z: 20 },
                { type: 'text', left: '54%', top: '44%', style: { text: '二进', fill: '#fff', fontSize: 11, fontWeight: 'bold' }, z: 20 },
                { type: 'text', left: '23%', top: '51%', style: { text: '四进', fill: '#fff', fontSize: 10, fontWeight: 'bold' }, z: 20 }
            ],
            legend: {
                show: true, bottom: 2, left: 'center',
                itemWidth: 10, itemHeight: 10,
                textStyle: { color: lightText, fontSize: 10 },
                data: ['一进四合院', '三进四合院', '二进四合院', '四进四合院']
            }
        });
        const radarChart = echarts.init(document.getElementById('chart-radar')!);
        list.push(radarChart);
        radarChart.setOption({
            title: { show: false },
            radar: {
                radius: '78%', center: ['55%', '55%'],
                indicator: [
                    { name: '防火', max: 100 },
                    { name: '防盗', max: 100 },
                    { name: '防水', max: 100 },
                    { name: '防恶劣天气', max: 100 },
                    { name: '防匪', max: 100 }
                ],
                axisName: { color: themeText, fontSize: 11, fontWeight: 'bold' },
                splitArea: {
                    show: true,
                    areaStyle: { color: ['rgba(211, 166, 87, 0.04)', 'rgba(211, 166, 87, 0.09)'] }
                },
                splitLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.18)' } },
                axisLine: { lineStyle: { color: 'rgba(139, 91, 31, 0.18)' } }
            },
            series: [{
                    type: 'radar',
                    data: [{
                            value: [78, 85, 70, 83, 65],
                            name: '四合院防御',
                            areaStyle: { color: 'rgba(211, 166, 87, 0.28)' },
                            lineStyle: { color: '#d3a657', width: 2.5 },
                            itemStyle: { color: '#d3a657' }
                        }]
                }]
        });
        const pieChart = echarts.init(document.getElementById('chart-pie')!);
        list.push(pieChart);
        pieChart.setOption({
            legend: {
                orient: 'horizontal', bottom: 5, left: 'center',
                itemWidth: 12, itemHeight: 10,
                textStyle: { color: lightText, fontSize: 11 }
            },
            series: [{
                    type: 'pie', radius: ['48%', '82%'], center: ['50%', '45%'],
                    avoidLabelOverlap: false,
                    label: { show: false }, labelLine: { show: false },
                    itemStyle: { borderWidth: 0, shadowBlur: 16, shadowColor: 'rgba(0, 0, 0, 0.12)' },
                    emphasis: { scale: true, scaleSize: 8 },
                    data: [
                        { value: 35, name: '白灰', itemStyle: { color: '#d8c8a2' } },
                        { value: 30, name: '青砖', itemStyle: { color: '#4ec4cf' } },
                        { value: 25, name: '大理石', itemStyle: { color: '#6f8bf0' } },
                        { value: 20, name: '耐火土', itemStyle: { color: '#dc5d6d' } }
                    ]
                }]
        });
        try {
            const resp = await fetch('/china.json');
            const chinaJson = await resp.json();
            echarts.registerMap('china', chinaJson);
            const mapChart = echarts.init(document.getElementById('chart-map')!);
            list.push(mapChart);
            mapChart.setOption({
                graphic: [
                    {
                        type: 'text',
                        right: 20,
                        bottom: 20,
                        style: {
                            text: '中国地图审图号：CS（2024）0650号',
                            fill: 'rgba(255, 255, 255, 0.45)',
                            fontSize: 10
                        }
                    }
                ],
                geo: {
                    map: 'china', roam: false, zoom: 1.26, center: [105, 36],
                    label: { show: false },
                    emphasis: { label: { show: false }, itemStyle: { areaColor: '#B8D4F9' } },
                    itemStyle: {
                        areaColor: '#D2E0F7',
                        borderColor: '#A8C6F0',
                        borderWidth: 2.5,
                        shadowColor: 'rgba(210, 224, 247, 0.55)',
                        shadowBlur: 36
                    },
                    regions: [{
                            name: '南海诸岛',
                            itemStyle: {
                                opacity: 0
                            },
                            label: {
                                show: false
                            }
                        }]
                },
                series: [{
                        type: 'effectScatter', coordinateSystem: 'geo',
                        data: [{ name: '北京', value: [116.407, 39.904, 180] }],
                        symbolSize: 32, showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke', color: '#7FB6FF',
                            period: 3.2, scale: 6.5, number: 3
                        },
                        label: {
                            show: true, formatter: '{b}', position: 'right',
                            color: '#fff', fontSize: 14, fontWeight: 'bold', distance: 10,
                            textBorderColor: 'rgba(0,0,0,0.4)', textBorderWidth: 2.5
                        },
                        itemStyle: {
                            color: '#7FB6FF',
                            shadowBlur: 30, shadowColor: 'rgba(127, 182, 255, 0.9)'
                        },
                        zlevel: 1
                    }]
            });
        }
        catch (e) {
            console.warn('无法加载 china.json，地图跳过', e);
        }
        const sankeyChart = echarts.init(document.getElementById('chart-sankey')!);
        list.push(sankeyChart);
        sankeyChart.setOption({
            series: {
                type: 'sankey', layout: 'none',
                top: 30, bottom: 30, left: 40, right: 40,
                nodeWidth: 6, nodeGap: 16, draggable: false,
                emphasis: { focus: 'adjacency' },
                lineStyle: { color: 'gradient', curveness: 0.45, opacity: 0.16 },
                data: [
                    { name: '大门', itemStyle: { color: 'rgba(228, 80, 99, 0.6)', borderWidth: 0 } },
                    { name: '影壁', itemStyle: { color: 'rgba(52, 192, 213, 0.6)', borderWidth: 0 } },
                    { name: '倒座房', itemStyle: { color: 'rgba(211, 166, 87, 0.6)', borderWidth: 0 } },
                    { name: '垂花门', itemStyle: { color: 'rgba(82, 185, 199, 0.6)', borderWidth: 0 } },
                    { name: '游廊', itemStyle: { color: 'rgba(186, 161, 81, 0.6)', borderWidth: 0 } },
                    { name: '正房', itemStyle: { color: 'rgba(219, 84, 119, 0.6)', borderWidth: 0 } },
                    { name: '厢房', itemStyle: { color: 'rgba(102, 66, 126, 0.6)', borderWidth: 0 } },
                    { name: '耳房', itemStyle: { color: 'rgba(102, 142, 234, 0.6)', borderWidth: 0 } },
                    { name: '后罩房', itemStyle: { color: 'rgba(223, 97, 113, 0.6)', borderWidth: 0 } }
                ],
                links: [
                    { source: '大门', target: '影壁', value: 10 },
                    { source: '大门', target: '倒座房', value: 8 },
                    { source: '影壁', target: '垂花门', value: 10 },
                    { source: '倒座房', target: '垂花门', value: 5 },
                    { source: '垂花门', target: '游廊', value: 8 },
                    { source: '垂花门', target: '正房', value: 12 },
                    { source: '游廊', target: '厢房', value: 6 },
                    { source: '正房', target: '耳房', value: 8 },
                    { source: '正房', target: '后罩房', value: 4 },
                    { source: '厢房', target: '后罩房', value: 3 }
                ],
                label: { color: lightText, fontSize: 10, fontWeight: 'normal' }
            }
        });
        const colorMap: Record<string, string> = {
            '东城区': '#e45063', '西城区': '#c8954d', '崇文门周边': '#baa151',
            '海淀区': '#b4934d', '丰台区': '#db5477', '什刹海': '#28a8ff',
            '南锣鼓巷': '#58c8d2', '前门': '#6f8bf0', '大栅栏': '#58c8d2',
            '天津老城厢': '#c8954d', '宣武门周边': '#e45063', '胡同': '#6f8bf0',
            '顺义区': '#58c8d2'
        };
        const wordChart = echarts.init(document.getElementById('chart-wordcloud')!);
        list.push(wordChart);
        wordChart.setOption({
            series: [{
                    type: 'wordCloud',
                    shape: 'square',
                    sizeRange: [18, 105],
                    rotationRange: [0, 0],
                    rotationStep: 0,
                    gridSize: 18,
                    drawOutOfBound: false,
                    layoutAnimation: true,
                    left: '10%', top: '12%', width: '80%', height: '70%',
                    textStyle: {
                        fontFamily: '"Microsoft YaHei", "PingFang SC", sans-serif',
                        fontWeight: 'bold',
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.22)',
                        color: (params: {
                            name: string;
                        }) => colorMap[params.name] || '#58c8d2'
                    },
                    emphasis: {
                        focus: 'self',
                        textStyle: { shadowBlur: 18, shadowColor: 'rgba(0, 0, 0, 0.45)' }
                    },
                    data: [
                        { name: '西城区', value: 140 },
                        { name: '东城区', value: 150 },
                        { name: '崇文门周边', value: 120 },
                        { name: '海淀区', value: 86 },
                        { name: '丰台区', value: 82 },
                        { name: '什刹海', value: 74 },
                        { name: '南锣鼓巷', value: 68 },
                        { name: '前门', value: 58 },
                        { name: '大栅栏', value: 52 },
                        { name: '天津老城厢', value: 46 },
                        { name: '宣武门周边', value: 42 },
                        { name: '胡同', value: 38 },
                        { name: '顺义区', value: 28 }
                    ]
                }]
        });
        const gaugeIds = ['chart-g1', 'chart-g2', 'chart-g3'];
        const gaugeNames = ['完整四合院占比', '保护四合院占比', '完整核桃树占比'];
        const gaugeValues = [92, 48, 23];
        const gaugeColors = ['#58c8d2', '#c8954d', '#db5477'];
        gaugeIds.forEach((id, i) => {
            const g = echarts.init(document.getElementById(id)!);
            list.push(g);
            g.setOption({
                series: [{
                        type: 'gauge', radius: '88%', center: ['50%', '60%'],
                        startAngle: 180, endAngle: 0, min: 0, max: 100,
                        progress: {
                            show: true, width: 9,
                            itemStyle: { color: gaugeColors[i], shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.2)' }
                        },
                        axisLine: { lineStyle: { width: 9, color: [[1, 'rgba(255, 255, 255, 0.1)']] } },
                        axisTick: {
                            show: true, splitNumber: 5, distance: -9, length: 3,
                            lineStyle: { color: gaugeColors[i], width: 1 }
                        },
                        splitLine: {
                            show: true, distance: -9, length: 6,
                            lineStyle: { color: gaugeColors[i], width: 1.5 }
                        },
                        axisLabel: { show: false },
                        pointer: { show: false },
                        anchor: { show: false },
                        title: {
                            show: true, offsetCenter: [0, '62%'], fontSize: 9,
                            color: subText, lineHeight: 11, overflow: 'truncate', width: 70
                        },
                        detail: {
                            valueAnimation: true, offsetCenter: [0, '8%'],
                            fontSize: 22, fontWeight: 'bold',
                            formatter: '{value}%', color: gaugeColors[i]
                        },
                        data: [{ value: gaugeValues[i], name: gaugeNames[i] }]
                    }]
            });
        });
        chartsRef.current = list;
    }
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setIsEmbedded(params.get('embedded') === '1');
        const handleResize = () => {
            const baseW = 1920, baseH = 1080;
            const s = Math.min(window.innerWidth / baseW, window.innerHeight / baseH);
            if (screenRef.current) {
                screenRef.current.style.transform = `scale(${s})`;
                screenRef.current.style.left = `${(window.innerWidth - baseW * s) / 2}px`;
                screenRef.current.style.top = `${(window.innerHeight - baseH * s) / 2}px`;
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        initCharts();
        const resizeCharts = () => {
            document.querySelectorAll('[data-echart]').forEach(dom => {
                const inst = echarts.getInstanceByDom(dom as HTMLElement);
                if (inst)
                    inst.resize();
            });
        };
        window.addEventListener('resize', resizeCharts);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('resize', resizeCharts);
            chartsRef.current.forEach(c => c.dispose());
        };
    }, []);
    return (<div className={styles.container} style={isEmbedded ? { gridTemplateRows: '1fr' } : undefined}>
      {!isEmbedded && (<div className={styles.topbar}>
          <button type="button" className={`guofeng-button ${styles.backButton}`} onClick={() => router.back()}>
            ← 返回上一页
          </button>

          <div className={styles.titleGroup}>
            <h1 className={styles.pageTitle}>北京四合院</h1>
            <span className={styles.pageSubtitle}>Beijing Siheyuan · Heritage Dashboard</span>
          </div>

          <div className={styles.navGroup}>
            <button type="button" className={`${styles.navButton} ${styles.navButtonActive}`} aria-current="page">
              风物志
            </button>
            <button type="button" className={styles.navButton} onClick={() => router.push('/bigscreen')}>
              通用风物志
            </button>
          </div>
        </div>)}

      <div className={styles.viewport}>
        <div id="screen" className={styles.screen} ref={screenRef}>
          <div className={styles.bgLayer}/>

          <section className={styles.mainStage}>
            <div className={styles.stageHint}>
              <span className={styles.stageHintLabel}>界面导航</span>
              <span className={styles.stageHintText}>顶部导航栏可切换入口与返回</span>
            </div>

            
            <div className={styles.titleBoard}>北京四合院</div>

            
            <div className={`${styles.panel} ${styles.panelLine}`}>
              <div className={styles.panelTitle}>温雨双折图</div>
              <div id="chart-line" className={styles.chart} data-echart/>
            </div>

            
            <div className={`${styles.panel} ${styles.panelMetrics}`}>
              <div className={styles.metricGrid}>
                <div className={styles.metricItem}><div className={styles.metricValue}>12.48</div><div className={styles.metricLabel}>年均气温</div></div>
                <div className={styles.metricItem}><div className={styles.metricValue}>574</div><div className={styles.metricLabel}>年降水量</div></div>
                <div className={styles.metricItem}><div className={styles.metricValue}>1.01</div><div className={styles.metricLabel}>平均水压</div></div>
                <div className={styles.metricItem}><div className={styles.metricValue}>39.9</div><div className={styles.metricLabel}>经度</div></div>
                <div className={styles.metricItem}><div className={styles.metricValue}>116.4</div><div className={styles.metricLabel}>纬度</div></div>
                <div className={styles.metricItem}><div className={styles.metricValue}>50.7</div><div className={styles.metricLabel}>海拔</div></div>
              </div>
            </div>

            
            <div className={`${styles.panel} ${styles.panelRadar}`}>
              <span className={styles.radarSubTitle} style={{ left: 28 }}>分类</span>
              <span className={styles.radarSubTitle} style={{ right: 28 }}>防御指数</span>
              <div id="chart-category" className={styles.chartCategory} data-echart/>
              <div id="chart-radar" className={styles.chartRadar} data-echart/>
            </div>

            
            <div className={`${styles.panel} ${styles.panelPie}`}>
              <div className={styles.panelTitle}>建材环形图</div>
              <div id="chart-pie" className={styles.chart} data-echart/>
            </div>

            
            <div className={`${styles.panel} ${styles.panelMap}`}>
              <div className={styles.panelTitle}>分布图</div>
              <div id="chart-map" className={styles.chart} data-echart/>
            </div>

            
            <div className={`${styles.panel} ${styles.panelHistory}`}>
              <div className={styles.panelTitle}>历史进程图</div>
              <div className={styles.historyBox}>
                <div className={styles.historyNotes}>
                  <div>院落雏形<br />围合结构</div>
                  <div>布局规整<br />礼制观念</div>
                  <div>形制多样<br />高墙封闭</div>
                </div>
                <div className={styles.historyAxis}>
                  <span className={styles.segA}/>
                  <span className={styles.segB}/>
                  <span className={styles.segC}/>
                </div>
                <div className={styles.historyLabels}>
                  <span style={{ color: '#34c0d5' }}>商周</span>
                  <span style={{ color: '#d3a657' }}>汉唐</span>
                  <span style={{ color: '#db5477' }}>明清</span>
                </div>
              </div>
            </div>

            
            <div className={`${styles.panel} ${styles.panelSankey}`}>
              <div className={styles.panelTitle}>构造桑基图</div>
              <div id="chart-sankey" className={styles.chart} data-echart/>
            </div>

            
            <div className={`${styles.panel} ${styles.panelGauge}`}>
              <div className={styles.gaugeLeft}>
                <div className={styles.gaugeTitle}>保护状况</div>
                <div className={styles.gaugeDate}>{currentDate}</div>
                <div className={styles.gaugeBig}>4k-5k</div>
                <div className={styles.gaugeSub}>现存数量</div>
              </div>
              <div className={styles.gaugeRight}>
                <div id="chart-g1" className={styles.gaugeItem} data-echart/>
                <div id="chart-g2" className={styles.gaugeItem} data-echart/>
                <div id="chart-g3" className={styles.gaugeItem} data-echart/>
              </div>
            </div>

            
            <div className={`${styles.panel} ${styles.panelWordcloud}`}>
              <div className={styles.panelTitle}>分布词云图</div>
              <div id="chart-wordcloud" className={styles.chart} data-echart/>
            </div>
          </section>
        </div>
      </div>
    </div>);
}
