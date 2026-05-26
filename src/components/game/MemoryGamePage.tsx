'use client';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
type MemoryStation = {
    id: string;
    name: string;
    image: string;
    reward: string;
};
type MemoryCard = {
    uid: string;
    stationId: string;
    name: string;
    image: string;
    matched: boolean;
};
const ROUND_SECONDS = 60;
const MATCH_COUNT = 8;
const FLIP_BACK_DELAY = 850;
const MEMORY_STATIONS: MemoryStation[] = [
    { id: 'siheyuan', name: '北京四合院', image: '/memory-game/四合院.jpg', reward: '北京四合院徽章已点亮' },
    { id: 'yaodong', name: '窑洞', image: '/memory-game/窑洞.jpg', reward: '黄土营造徽章已点亮' },
    { id: 'tulou', name: '客家土楼', image: '/memory-game/土楼.jpg', reward: '客家土楼徽章已点亮' },
    { id: 'haicaofang', name: '山东海草房', image: '/memory-game/海草房.jpg', reward: '山东海草房徽章已点亮' },
    { id: 'aiwang', name: '新疆阿以旺', image: '/memory-game/阿以旺.jpg', reward: '新疆阿以旺徽章已点亮' },
    { id: 'sushi-minju', name: '苏州民居', image: '/memory-game/苏式民居.jpg', reward: '苏州民居徽章已点亮' },
    { id: 'diaofang', name: '藏族碉房', image: '/memory-game/碉房.jpg', reward: '藏族碉房徽章已点亮' },
    { id: 'gaotai-minju', name: '高台民居', image: '/memory-game/高台民居.jpg', reward: '生土聚落徽章已点亮' },
    { id: 'huipai-minju', name: '徽派民居', image: '/memory-game/徽派民居.jpg', reward: '粉墙黛瓦徽章已点亮' },
    { id: 'guoerwu', name: '广东镬耳屋', image: '/memory-game/镬耳屋.jpg', reward: '广东镬耳屋徽章已点亮' },
    { id: 'diaojiaolou', name: '湘西吊脚楼', image: '/memory-game/吊脚楼.jpg', reward: '湘西吊脚楼徽章已点亮' },
    { id: 'tuzhangfang', name: '云南彝族土掌房', image: '/memory-game/土掌房.jpg', reward: '云南彝族土掌房徽章已点亮' },
    { id: 'menggubao', name: '蒙古包', image: '/memory-game/蒙古包.jpg', reward: '穹庐游牧徽章已点亮' },
    { id: 'zhulou', name: '竹楼', image: '/memory-game/竹楼.jpg', reward: '雨林干栏徽章已点亮' },
];
function shuffle<T>(input: T[]) {
    const output = [...input];
    for (let index = output.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [output[index], output[randomIndex]] = [output[randomIndex], output[index]];
    }
    return output;
}
function buildDeck() {
    const selected = shuffle(MEMORY_STATIONS).slice(0, MATCH_COUNT);
    const cards = shuffle(selected.flatMap((station) => [
        { uid: `${station.id}-a`, stationId: station.id, name: station.name, image: station.image, matched: false },
        { uid: `${station.id}-b`, stationId: station.id, name: station.name, image: station.image, matched: false },
    ]));
    return { cards, selected };
}
export default function MemoryGamePage() {
    const { setPhase } = useStore();
    const [gameData, setGameData] = useState(() => buildDeck());
    const [flippedIds, setFlippedIds] = useState<string[]>([]);
    const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
    const [round, setRound] = useState(1);
    const [hasStarted, setHasStarted] = useState(false);
    const [collectedStationIds, setCollectedStationIds] = useState<string[]>([]);
    const [lastUnlockedStations, setLastUnlockedStations] = useState<MemoryStation[]>([]);
    const cards = gameData.cards;
    const selectedStations = gameData.selected;
    const isIdle = !hasStarted;
    const matchedStationIds = useMemo(() => Array.from(new Set(cards.filter((card) => card.matched).map((card) => card.stationId))), [cards]);
    const matchedCount = useMemo(() => cards.filter((card) => card.matched).length / 2, [cards]);
    const status: 'idle' | 'playing' | 'won' | 'lost' = !hasStarted ? 'idle' : matchedCount === MATCH_COUNT ? 'won' : secondsLeft <= 0 ? 'lost' : 'playing';
    const startRound = useCallback((nextRound?: number) => {
        setGameData(buildDeck());
        setFlippedIds([]);
        setSecondsLeft(ROUND_SECONDS);
        setHasStarted(true);
        setLastUnlockedStations([]);
        if (typeof nextRound === 'number') {
            setRound(nextRound);
        }
    }, []);
    const beginGame = () => {
        setGameData(buildDeck());
        setFlippedIds([]);
        setSecondsLeft(ROUND_SECONDS);
        setHasStarted(true);
        setLastUnlockedStations([]);
    };
    useEffect(() => {
        if (status !== 'playing') {
            return;
        }
        const timer = window.setTimeout(() => {
            setSecondsLeft((current) => current - 1);
        }, 1000);
        return () => window.clearTimeout(timer);
    }, [secondsLeft, status]);
    const handleCardClick = (card: MemoryCard) => {
        if (status !== 'playing') {
            return;
        }
        if (card.matched || flippedIds.includes(card.uid) || flippedIds.length >= 2) {
            return;
        }
        if (flippedIds.length === 0) {
            setFlippedIds([card.uid]);
            return;
        }
        const firstCard = cards.find((item) => item.uid === flippedIds[0]);
        if (!firstCard) {
            setFlippedIds([card.uid]);
            return;
        }
        if (firstCard.stationId === card.stationId) {
            const nextCards = cards.map((item) => item.stationId === card.stationId ? { ...item, matched: true } : item);
            const nextMatchedCount = nextCards.filter((item) => item.matched).length / 2;
            setGameData((current) => ({
                ...current,
                cards: nextCards,
            }));
            if (nextMatchedCount === MATCH_COUNT) {
                const unlocked = selectedStations.filter((station) => !collectedStationIds.includes(station.id));
                setLastUnlockedStations(unlocked);
                if (unlocked.length > 0) {
                    setCollectedStationIds((current) => Array.from(new Set([...current, ...unlocked.map((station) => station.id)])));
                }
            }
            setFlippedIds([]);
            return;
        }
        setFlippedIds([flippedIds[0], card.uid]);
        window.setTimeout(() => {
            setFlippedIds([]);
        }, FLIP_BACK_DELAY);
    };
    const collectedBadgeCount = collectedStationIds.length;
    const unlockedSummary = lastUnlockedStations.length > 0
        ? `本轮点亮了 ${lastUnlockedStations.map((station) => station.name).join('、')}。`
        : `本轮民居已收录，当前已点亮 ${collectedBadgeCount} 枚徽章。`;
    return (<div style={{
            minHeight: '100vh',
            background: 'linear-gradient(rgba(248, 242, 231, 0.35), rgba(231, 217, 195, 0.45)), url(/翻翻乐背景图.jpg) center center / cover no-repeat',
            color: '#3a2a1a',
            position: 'relative',
            overflow: 'hidden',
        }}>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1480, margin: '0 auto', padding: '10px 12px 12px' }}>
        <style>{`
          .memory-game-shell {
            height: calc(100vh - 22px);
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          .memory-game-layout {
            flex: 1;
            min-height: 0;
            display: grid;
            grid-template-columns: 220px minmax(0, 1fr) 220px;
            gap: 12px;
            align-items: stretch;
          }
          .memory-game-sidebar {
            min-height: 0;
            display: flex;
            flex-direction: column;
            padding: 12px;
            border-radius: 20px;
            background: linear-gradient(180deg, rgba(255, 251, 244, 0.86), rgba(247, 238, 223, 0.9));
            border: 1px solid rgba(196,168,130,0.22);
            box-shadow: 0 18px 36px rgba(92,74,58,0.08), inset 0 1px 0 rgba(255,255,255,0.35);
            backdrop-filter: blur(8px);
          }
          .memory-game-sidebar-content {
            min-height: 0;
            overflow: auto;
            padding-right: 2px;
          }
          .memory-game-badge-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }
          .memory-game-pool {
            display: grid;
            gap: 8px;
          }
          .memory-game-center {
            min-width: 0;
            min-height: 0;
            display: flex;
            align-items: flex-start;
            justify-content: center;
          }
          .memory-game-grid {
            width: min(100%, calc(100vh - 236px));
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 10px;
          }
          .memory-card-button {
            aspect-ratio: 1 / 1;
            border: none;
            background: transparent;
            padding: 0;
            perspective: 1200px;
          }
          .memory-card-button.is-playing {
            cursor: pointer;
          }
          .memory-card-button.is-playing:hover .memory-card-face-back {
            transform: translateY(-3px) scale(1.015);
            box-shadow: 0 16px 28px rgba(92,74,58,0.14);
          }
          .memory-card-shell {
            position: relative;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            transition: transform 0.6s ease;
          }
          .memory-card-face {
            position: absolute;
            inset: 0;
            backface-visibility: hidden;
            border-radius: 16px;
            overflow: hidden;
          }
          .memory-card-face-back {
            transition: transform 0.28s ease, box-shadow 0.28s ease, opacity 0.28s ease, background 0.28s ease;
          }
          .memory-card-face-back.idle {
            background:
              url(/翻翻乐背面.png) center center / cover no-repeat,
              linear-gradient(135deg, #ffffff 0%, #e9ddc8 100%);
            opacity: 0.96;
            border: 1px solid rgba(177, 147, 111, 0.26);
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,0.82),
              inset 0 -1px 0 rgba(110,90,65,0.12),
              0 12px 24px rgba(92,74,58,0.14);
          }
          .memory-card-face-back.playing {
            background:
              url(/翻翻乐背面.png) center center / cover no-repeat,
              linear-gradient(135deg, #ffffff 0%, #e9ddc8 100%);
            opacity: 0.96;
            border: 1px solid rgba(177, 147, 111, 0.26);
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,0.82),
              inset 0 -1px 0 rgba(110,90,65,0.12),
              0 12px 24px rgba(92,74,58,0.14);
          }
          .memory-card-sheen {
            position: absolute;
            inset: 0;
            background: transparent;
            pointer-events: none;
          }
          .memory-card-orb {
            width: 52px;
            height: 52px;
            border-radius: 999px;
            display: grid;
            place-items: center;
            margin-bottom: 12px;
          }
          @media (max-width: 1024px) {
            .memory-game-shell {
              height: auto;
              overflow: visible;
            }
            .memory-game-layout {
              display: grid;
              grid-template-columns: 1fr;
              gap: 10px;
            }
            .memory-game-grid {
              width: min(100%, 720px);
            }
            .memory-game-sidebar {
              max-height: none;
            }
            .memory-game-sidebar-content {
              overflow: visible;
            }
          }
          @media (max-width: 720px) {
            .memory-game-grid {
              width: 100%;
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
          }
          @media (max-width: 560px) {
            .memory-game-badge-grid {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
            .memory-game-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }
        `}</style>
        <div className="memory-game-shell">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: 10,
            flexShrink: 0,
        }}>
            <div>
              <div style={{ fontSize: 10, color: '#8b7355', letterSpacing: 4, marginBottom: 4 }}>MEMORY GAME</div>
              <h1 style={{ margin: 0, fontSize: 'clamp(1.5rem, 2.3vw, 2.2rem)', fontFamily: 'var(--font-serif, serif)', letterSpacing: 2 }}>
                民居翻翻乐
              </h1>
              <div style={{ marginTop: 4, color: '#6b5842', fontSize: 12, lineHeight: 1.5 }}>
                以翻牌的方式收集中国传统民居记忆，在一轮轮发现中点亮你的建筑图鉴。
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" onClick={beginGame} style={{
            padding: '10px 18px',
            borderRadius: 999,
            border: '1px solid rgba(139,104,70,0.24)',
            background: hasStarted ? 'rgba(255,252,246,0.86)' : 'linear-gradient(135deg, #8b6846, #5b4631)',
            color: hasStarted ? '#5b4631' : '#fff9f0',
            cursor: 'pointer',
            fontWeight: 700,
            boxShadow: hasStarted ? 'none' : '0 14px 28px rgba(91,70,49,0.18)',
        }}>
                {hasStarted ? '重新开局' : '开始游戏'}
              </button>
              <button type="button" onClick={() => setPhase('map')} style={{
            padding: '9px 14px',
            borderRadius: 999,
            border: '1px solid rgba(139,104,70,0.24)',
            background: 'rgba(255,252,246,0.82)',
            color: '#5b4631',
            cursor: 'pointer',
            fontWeight: 700,
        }}>
                ← 返回地图
              </button>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
            padding: '12px 18px',
            borderRadius: 20,
            background: 'linear-gradient(180deg, rgba(255,252,246,0.9), rgba(245,235,219,0.88))',
            border: '1px solid rgba(196,168,130,0.22)',
            boxShadow: '0 14px 30px rgba(92,74,58,0.08)',
            marginBottom: 10,
            flexShrink: 0,
            flexWrap: 'wrap',
        }}>
            <div style={{ minWidth: 180 }}>
              <div style={{ fontSize: 11, color: '#8b7355', letterSpacing: 3, marginBottom: 6 }}>探索状态</div>
              <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 12px',
            borderRadius: 999,
            background: isIdle ? 'rgba(180, 159, 128, 0.16)' : status === 'playing' ? 'rgba(128, 108, 78, 0.14)' : status === 'won' ? 'rgba(110,145,95,0.16)' : 'rgba(174, 112, 81, 0.16)',
            color: '#5f4a34',
            fontWeight: 700,
            fontSize: 13,
        }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: isIdle ? '#ad8f68' : status === 'playing' ? '#8b6846' : status === 'won' ? '#6d915f' : '#b46943' }}/>
                {status === 'idle' ? '等待开始' : status === 'playing' ? '挑战中' : status === 'won' ? '挑战成功' : '时间到'}
              </div>
            </div>
            {[
            { label: '倒计时', value: hasStarted ? `${secondsLeft}s` : '--' },
            { label: '轮次', value: `第 ${round} 轮` },
            { label: '配对进度', value: `${matchedCount} / ${MATCH_COUNT}` },
            { label: '徽章收集', value: `${collectedBadgeCount} / ${MEMORY_STATIONS.length}` },
        ].map((item) => (<div key={item.label} style={{ minWidth: 120 }}>
                <div style={{ fontSize: 10, color: '#9c8469', letterSpacing: 2, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#3a2a1a' }}>{item.value}</div>
              </div>))}
          </div>

          <div className="memory-game-layout">
            <aside className="memory-game-sidebar">
              <div style={{ fontSize: 11, color: '#8b7355', letterSpacing: 3, marginBottom: 8 }}>徽章进度</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#3a2a1a', marginBottom: 4 }}>
                {collectedBadgeCount} / {MEMORY_STATIONS.length}
              </div>
              <div style={{ fontSize: 12, color: '#6b5842', lineHeight: 1.6, marginBottom: 10 }}>
                更像一册逐步点亮的民居图鉴，而不是一组静态数据。
              </div>
              <div className="memory-game-sidebar-content">
                <div className="memory-game-badge-grid">
                  {MEMORY_STATIONS.map((station) => {
            const unlocked = collectedStationIds.includes(station.id);
            return (<div key={station.id} style={{
                    borderRadius: 14,
                    overflow: 'hidden',
                    background: unlocked ? 'linear-gradient(180deg, #fffaf1, #f3e7d6)' : 'rgba(140,117,90,0.08)',
                    border: unlocked ? '1px solid rgba(110,145,95,0.28)' : '1px dashed rgba(140,117,90,0.2)',
                    boxShadow: unlocked ? '0 12px 24px rgba(92,74,58,0.10)' : 'inset 0 1px 0 rgba(255,255,255,0.25)',
                    transform: unlocked ? 'translateY(-1px)' : 'none',
                }}>
                        <div style={{ position: 'relative', aspectRatio: '1 / 1' }}>
                          <Image src={station.image} alt={station.name} fill sizes="160px" style={{ objectFit: 'cover', filter: unlocked ? 'none' : 'grayscale(1) saturate(0.35)', opacity: unlocked ? 1 : 0.34 }}/>
                          <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: unlocked ? 'linear-gradient(180deg, transparent 48%, rgba(33,24,16,0.58) 100%)' : 'rgba(57,42,26,0.22)',
                }}/>
                        </div>
                        <div style={{ padding: '7px 8px' }}>
                          <div style={{ fontSize: 12, fontWeight: 800, color: unlocked ? '#3a2a1a' : '#7d6a56' }}>{station.name}</div>
                          <div style={{ marginTop: 2, fontSize: 10, color: unlocked ? '#7b644b' : '#a18a72', lineHeight: 1.5 }}>
                            {unlocked ? station.reward : '等待点亮'}
                          </div>
                        </div>
                      </div>);
        })}
                </div>
              </div>
            </aside>

            <div className="memory-game-center">
              <div className="memory-game-grid">
                {cards.map((card) => {
            const isFlipped = flippedIds.includes(card.uid) || card.matched;
            return (<button key={card.uid} type="button" onClick={() => handleCardClick(card)} className={`memory-card-button ${status === 'playing' && !card.matched ? 'is-playing' : ''}`} aria-label={isIdle ? `待开启卡片 ${card.name}` : `翻开 ${card.name}`}>
                      <div className="memory-card-shell" style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                        <div className={`memory-card-face memory-card-face-back ${isIdle ? 'idle' : 'playing'}`} style={{
                    color: 'transparent',
                }}>
                        </div>

                        <div className="memory-card-face" style={{
                    transform: 'rotateY(180deg)',
                    background: '#fffaf1',
                    border: `1px solid ${card.matched ? 'rgba(110,145,95,0.45)' : 'rgba(196,168,130,0.24)'}`,
                    boxShadow: '0 10px 18px rgba(92,74,58,0.10)',
                }}>
                          <Image src={card.image} alt={card.name} fill sizes="(max-width: 560px) 50vw, (max-width: 720px) 33vw, (max-width: 1024px) 25vw, 13vw" style={{ objectFit: 'cover' }}/>
                          <div style={{
                    position: 'absolute',
                    left: 8,
                    right: 8,
                    bottom: 8,
                    padding: '6px 8px',
                    borderRadius: 10,
                    background: 'rgba(37, 27, 16, 0.68)',
                    color: '#fffaf0',
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 1,
                }}>
                            {card.name}
                          </div>
                        </div>
                      </div>
                    </button>);
        })}
              </div>
            </div>

            <aside className="memory-game-sidebar">
              <div style={{ fontSize: 11, color: '#8b7355', letterSpacing: 3, marginBottom: 8 }}>本轮民居池</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#3a2a1a', marginBottom: 4 }}>{selectedStations.length} 个目标</div>
              <div style={{ fontSize: 12, color: '#6b5842', lineHeight: 1.6, marginBottom: 10 }}>
                这一轮的线索清单会随着配对进度逐步被点亮。
              </div>
              <div className="memory-game-sidebar-content">
                <div className="memory-game-pool">
                  {selectedStations.map((station) => {
            const isMatched = matchedStationIds.includes(station.id);
            return (<div key={station.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '54px minmax(0, 1fr)',
                    gap: 10,
                    alignItems: 'center',
                    padding: 8,
                    borderRadius: 14,
                    background: isMatched ? 'linear-gradient(180deg, rgba(110,145,95,0.18), rgba(255,252,246,0.84))' : 'rgba(255,252,246,0.84)',
                    border: `1px solid ${isMatched ? 'rgba(110,145,95,0.34)' : 'rgba(196,168,130,0.2)'}`,
                    boxShadow: isMatched ? '0 12px 24px rgba(92,74,58,0.08)' : 'none',
                }}>
                        <div style={{ position: 'relative', width: 54, aspectRatio: '1 / 1', borderRadius: 12, overflow: 'hidden' }}>
                          <Image src={station.image} alt={station.name} fill sizes="54px" style={{ objectFit: 'cover' }}/>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#3a2a1a' }}>{station.name}</div>
                          <div style={{ marginTop: 3, fontSize: 11, color: isMatched ? '#56724a' : '#8b7355' }}>
                            {isMatched ? '已完成配对' : '等待发现'}
                          </div>
                        </div>
                      </div>);
        })}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {(status === 'won' || status === 'lost') && (<div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(26,20,14,0.38)',
                display: 'grid',
                placeItems: 'center',
                zIndex: 20,
                padding: 24,
            }}>
          <div style={{
                width: 'min(520px, 100%)',
                borderRadius: 28,
                background: 'linear-gradient(180deg, #fffaf3 0%, #f1e6d7 100%)',
                border: '1px solid rgba(196,168,130,0.3)',
                boxShadow: '0 28px 60px rgba(46,32,18,0.18)',
                padding: '30px 28px',
                textAlign: 'center',
            }}>
            <div style={{ fontSize: 12, color: '#8b7355', letterSpacing: 4, marginBottom: 10 }}>
              {status === 'won' ? 'ROUND COMPLETE' : 'TIME OUT'}
            </div>
            <h2 style={{ margin: 0, fontSize: 30, color: '#3a2a1a', fontFamily: 'var(--font-serif, serif)' }}>
              {status === 'won' ? '挑战成功' : '再来一次'}
            </h2>
            <div style={{ marginTop: 16, color: '#5c4a3a', lineHeight: 1.8, fontSize: 15 }}>
              {status === 'won'
                ? `你已完成本轮全部配对，${unlockedSummary}`
                : '倒计时已结束，本轮卡牌将重新洗牌后开始新的挑战。'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 26, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => startRound(round + 1)} style={{
                padding: '12px 20px',
                borderRadius: 999,
                border: '1px solid rgba(139,104,70,0.24)',
                background: 'linear-gradient(135deg, #8b6846, #5b4631)',
                color: '#fffaf0',
                cursor: 'pointer',
                fontWeight: 700,
            }}>
                {status === 'won' ? '进入下一轮' : '再来一局'}
              </button>
              <button type="button" onClick={() => setPhase('map')} style={{
                padding: '12px 20px',
                borderRadius: 999,
                border: '1px solid rgba(139,104,70,0.24)',
                background: 'rgba(255,252,246,0.86)',
                color: '#5b4631',
                cursor: 'pointer',
                fontWeight: 700,
            }}>
                返回地图
              </button>
            </div>
          </div>
        </div>)}
    </div>);
}
