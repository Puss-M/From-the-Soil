'use client';
import { useEffect, useMemo } from 'react';
import styles from './page.module.css';
import { initBigscreenCharts } from './initCharts';
import { getBigscreenPayload } from './data';
function fitScreen() {
    const baseWidth = 1920;
    const baseHeight = 1080;
    const scaleX = window.innerWidth / baseWidth;
    const scaleY = window.innerHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);
    const screen = document.getElementById('screen');
    if (!screen)
        return;
    const realWidth = baseWidth * scale;
    const realHeight = baseHeight * scale;
    screen.style.transform = `scale(${scale})`;
    screen.style.transformOrigin = 'left top';
    screen.style.left = `${(window.innerWidth - realWidth) / 2}px`;
    screen.style.top = `${(window.innerHeight - realHeight) / 2}px`;
}
export function BigscreenView({ stationId }: {
    stationId: string;
}) {
    const payload = useMemo(() => getBigscreenPayload(stationId), [stationId]);
    useEffect(() => {
        if (!payload)
            return;
        let disposeCharts: (() => void) | undefined;
        const boot = async () => {
            disposeCharts = await initBigscreenCharts(payload.dashboard);
            fitScreen();
        };
        void boot();
        window.addEventListener('resize', fitScreen);
        return () => {
            window.removeEventListener('resize', fitScreen);
            if (disposeCharts)
                disposeCharts();
        };
    }, [payload]);
    if (!payload) {
        return (<div className={styles.page}>
        <div className={styles.emptyState}>未找到该民居的风物志数据。</div>
      </div>);
    }
    const { dashboard } = payload;
    const timeline = dashboard.heritageTimeline.slice(0, 3);
    return (<div className={styles.page}>
      <div id="screen" className={styles.screen}>
        <div className={styles.bgLayer}/>
        <header className={styles.topbar}/>

        <section className={styles.mainStage}>
          <div className={styles.titleBoard}>{dashboard.title}</div>

          <div className={`${styles.panel} ${styles.panelLine}`}>
            <div className={styles.panelTitle}>温雨双折图</div>
            <div className={styles.chart} id="chart-line"/>
          </div>

          <div className={`${styles.panel} ${styles.panelMetrics}`}>
            <div className={styles.panelTitle}>分布地数据</div>
            <div className={styles.metricGrid}>
              {dashboard.metrics.map((metric) => (<div key={metric.label} className={styles.metricItem}>
                  <div className={styles.metricValue}>{metric.value}</div>
                  <div className={styles.metricLabel}>{metric.label}</div>
                </div>))}
            </div>
          </div>

          <div className={`${styles.panel} ${styles.panelRadar}`}>
            <div className={styles.panelTitle}>分类　　　　　　　　　　　防御指数</div>
            <div className={styles.panelRadarContent}>
              <div id="chart-category"/>
              <div id="chart-radar"/>
            </div>
          </div>

          <div className={`${styles.panel} ${styles.panelPie}`}>
            <div className={styles.panelTitle}>建材环形图</div>
            <div className={styles.chart} id="chart-pie"/>
          </div>

          <div className={`${styles.panel} ${styles.panelMap}`}>
            <div className={styles.panelTitle}>分布图</div>
            <div className={styles.chart} id="chart-map"/>
            <div className={styles.mapRegions}>{dashboard.mapRegions.join(' · ')}</div>
          </div>

          <div className={`${styles.panel} ${styles.panelHistory}`}>
            <div className={styles.panelTitle}>历史进程图</div>
            <div className={styles.historyBox}>
              <div className={styles.historyNotes}>
                {timeline.map((item) => (<div key={`${item.era}-${item.text}`}>
                    {item.text.split('\n').map((line) => (<div key={line}>{line}</div>))}
                  </div>))}
              </div>
              <div className={styles.historyAxis}>
                <span className={`${styles.seg} ${styles.segA}`}/>
                <span className={`${styles.seg} ${styles.segB}`}/>
                <span className={`${styles.seg} ${styles.segC}`}/>
              </div>
              <div className={styles.historyLabels}>
                {timeline.map((item) => (<span key={item.era}>{item.era}</span>))}
              </div>
            </div>
          </div>

          <div className={`${styles.panel} ${styles.panelSankey}`}>
            <div className={styles.panelTitle}>构造桑基图</div>
            <div className={styles.chart} id="chart-sankey"/>
          </div>

          <div className={`${styles.panel} ${styles.panelGauge}`}>
            <div className={styles.panelGaugeInner}>
              <div>
                <div className={styles.panelTitle}>保护状况</div>
                <div className={styles.gaugeDate}>{dashboard.preserveDate}</div>
                <div className={styles.gaugeBig}>{dashboard.preserveRange}</div>
                <div className={styles.gaugeSub}>
                  现存{dashboard.title.replace(/民居$|建筑$|院$/, '')}数量
                </div>
              </div>
              <div className={styles.gaugeRight}>
                <div className={styles.gaugeItem} id="chart-g1"/>
                <div className={styles.gaugeItem} id="chart-g2"/>
                <div className={styles.gaugeItem} id="chart-g3"/>
              </div>
            </div>
          </div>

          <div className={`${styles.panel} ${styles.panelWordCloud}`}>
            <div className={styles.panelTitle}>分布词云图</div>
            <div className={styles.chart} id="chart-wordcloud"/>
          </div>
        </section>
      </div>
    </div>);
}
