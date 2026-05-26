'use client';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
type Hotspot = {
    id: string;
    name: string;
    summary: string;
    detail: string;
    image: string;
    top: string;
    left: string;
};
const HOTSPOTS: Hotspot[] = [
    {
        id: 'gate',
        name: '大门',
        summary: '四合院礼序与迎客的核心空间',
        detail: '大门是院落最重要的仪式入口，常见门簪、门钉与门槛等装饰构件。访客由此进入，空间序列也由“街巷-门-院”逐层展开，体现传统居住礼制与家族身份。',
        image: '/siheyuan/gate.png',
        top: '73%',
        left: '50%',
    },
    {
        id: 'plaque',
        name: '横批',
        summary: '门额题字，承载家风与审美',
        detail: '横批通常悬于门额正中，文字多为堂号、吉语或品格寄寓。其书法、边框和彩绘共同构成门脸视觉焦点，是四合院精神意涵与文化品位的集中表达。',
        image: '/siheyuan/plaque.png',
        top: '42%',
        left: '50%',
    },
    {
        id: 'pillar',
        name: '石柱',
        summary: '稳定门廊结构并强化立面节奏',
        detail: '石柱承担檐下受力并界定入口秩序，形制多见方柱与圆柱。柱础、柱身与柱头的比例变化让建筑更有节奏感，也提升了门前空间的庄重气质。',
        image: '/siheyuan/pillar.png',
        top: '58%',
        left: '32%',
    },
    {
        id: 'stele',
        name: '石碑',
        summary: '记事与纪念的文化载体',
        detail: '石碑常用于铭刻家训、修缮记、纪念性文字等内容。它既是院落历史的可视化记录，也是空间中的精神标识，强化了场所的文化厚度。',
        image: '/siheyuan/stele.png',
        top: '80%',
        left: '67%',
    },
];
export default function SiheyuanPage() {
    const router = useRouter();
    const [activeId, setActiveId] = useState(HOTSPOTS[0].id);
    const active = useMemo(() => HOTSPOTS.find((item) => item.id === activeId) ?? HOTSPOTS[0], [activeId]);
    return (<main className={styles.page}>
      <section className={styles.canvasPanel}>
        <header className={styles.header}>
          <div className={styles.headerActions}>
            <button type="button" className={`${styles.backButton} guofeng-button`} onClick={() => router.back()}>
              ← 返回
            </button>
            <button type="button" className={`${styles.dashboardButton} guofeng-button`} onClick={() => router.push('/siheyuan-dashboard')}>
              进入数据大屏
            </button>
          </div>
          <p className={styles.tag}>建筑装饰交互页</p>
          <h1 className={styles.title}>四合院装饰解析</h1>
          <p className={styles.tip}>点击建筑中的圆点，右侧将展示对应构件说明。</p>
        </header>

        <div className={styles.figureWrap}>
          <Image src="/siheyuan/overall.png" alt="四合院整体建筑示意图" fill priority sizes="(max-width: 1200px) 100vw, 65vw" className={styles.mainImage}/>

          {HOTSPOTS.map((item) => {
            const activePoint = active.id === item.id;
            return (<button key={item.id} type="button" className={`${styles.hotspot} ${activePoint ? styles.hotspotActive : ''}`} style={{ top: item.top, left: item.left }} onClick={() => setActiveId(item.id)} aria-label={`查看${item.name}介绍`}>
                <span className={styles.hotspotCore}/>
              </button>);
        })}
        </div>
      </section>

      <aside className={styles.infoPanel}>
        <div className={styles.infoImageWrap}>
          <Image src={active.image} alt={active.name} fill sizes="(max-width: 1200px) 100vw, 35vw" className={styles.infoImage}/>
        </div>

        <div className={styles.infoBody}>
          <p className={styles.infoKicker}>当前交互点</p>
          <h2 className={styles.infoTitle}>{active.name}</h2>
          <p className={styles.infoSummary}>{active.summary}</p>
          <p className={styles.infoDetail}>{active.detail}</p>
        </div>
      </aside>
    </main>);
}
