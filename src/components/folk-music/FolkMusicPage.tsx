'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { stations } from '@/data/stations';
export function FolkMusicPage() {
    const { setPhase } = useStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [showDirectory, setShowDirectory] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const isPlayingRef = useRef(isPlaying);
    const currentStation = stations[currentIndex];
    const stationFolkNames: Record<string, string> = {
        'beijing': '北京驿 · 四合院',
        'huizhou': '徽州驿 · 徽派民居',
        'suzhou': '苏州驿 · 苏州民居',
        'fujian': '永定驿 · 福建土楼',
        'xilingol': '草原驿 · 蒙古包',
        'yanan': '延安驿 · 窑洞',
        'fenghuang': '凤凰驿 · 吊脚楼',
        'lhasa': '拉萨驿 · 碉房',
        'weihai': '威海驿 · 海草房',
        'kashgar': '喀什驿 · 高台民居',
        'turpan': '和田驿 · 阿以旺',
        'guangzhou': '广州驿 · 镬耳屋',
        'dali': '大理驿 · 土掌房',
        'xishuangbanna': '版纳驿 · 竹楼',
    };
    const songs: Record<string, {
        name: string;
        artist: string;
    }> = {
        'beijing': { name: '四合院儿', artist: '李谷一' },
        'huizhou': { name: '云瞰徽州', artist: '卞珊珊' },
        'suzhou': { name: '苏州好风光', artist: '朱虹' },
        'fujian': { name: '土楼神韵', artist: '戴海霞' },
        'xilingol': { name: '蒙古包', artist: '乌兰图雅' },
        'yanan': { name: '黄土高坡', artist: '杭天琪' },
        'fenghuang': { name: '高山有好水', artist: '徐千雅' },
        'lhasa': { name: '古碉悠情', artist: '在帝' },
        'weihai': { name: '海草房之恋', artist: '柏文' },
        'kashgar': { name: '喀什的夜', artist: '阿尔法' },
        'turpan': { name: '吐鲁番的葡萄熟了', artist: '刀郎' },
        'guangzhou': { name: '大旗头之歌', artist: '钟Sir' },
        'dali': { name: '梦回土掌房', artist: 'LOHE' },
        'xishuangbanna': { name: '月光下的凤尾竹', artist: '纯音乐' },
    };
    const stationDescriptions: Record<string, string> = {
        'beijing': '《四合院儿》是刻着老北京魂的京味金曲，用李谷一温润的唱腔，把四合院的灰瓦、影壁、胡同烟火唱得活灵活现。北京四合院是北方合院建筑的巅峰，方正格局藏着"四世同堂"的中式家文化，而这首歌的京韵念白、胡同意象，完美复刻了四合院里的邻里温情与岁月沉淀，让建筑不再是冰冷的砖瓦，而是有温度的老北京生活载体，每一句都对应着四合院的建筑肌理与人文底蕴。',
        'huizhou': '《云瞰徽州》以水墨般的旋律，勾勒出徽派民居"粉墙黛瓦马头墙"的江南意境。徽派民居是江南民居的代表，白墙黑瓦、飞檐翘角、天井院落，藏着徽州人的耕读文化与山水情怀。这首歌的旋律温婉空灵，和徽派建筑的清雅气质高度契合，歌词里的青瓦、白墙、古巷，精准对应着徽派民居的建筑特色，让听众在旋律里沉浸式感受徽州古村的诗意与厚重，是徽派民居最适配的文化注脚。',
        'suzhou': '《苏州好风光》是苏州的城市名片，改编自苏州评弹，吴侬软语里满是江南水乡的灵动。苏州民居依水而建，白墙黑瓦、小桥流水，是江南民居的活化石，而这首歌的评弹韵律、水乡意象，完美贴合苏州民居的温婉气质，歌词里的"山塘街、拙政园、江南春"，精准对应着苏州民居的建筑风貌与生活场景，让建筑与音乐融为一体，尽显江南民居的雅致与烟火气。',
        'fujian': '《土楼神韵》是客家土楼的专属交响诗篇，以客家山歌为基底，唱出了土楼的千年传奇。福建土楼是世界独一无二的大型夯土民居，圆形、方形的楼体藏着客家人聚族而居的智慧，而这首歌的大气旋律、客家元素，完美复刻了土楼的雄浑与温情，歌词里的"夯土墙、圆楼梦、客家魂"，精准对应着土楼的建筑特色与文化内涵，让土楼的历史厚重感在旋律里尽情绽放。',
        'xilingol': '《蒙古包》是乌兰图雅演唱的草原金曲，用悠扬的长调，唱出了蒙古包的游牧风情。蒙古包是蒙古族的传统民居，可拆卸的毡房适配逐水草而居的生活，而这首歌的草原旋律、游牧意象，完美贴合蒙古包的文化属性，歌词里的"蓝天、草原、蒙古包"，精准对应着蒙古包的建筑形态与生活场景，让听众在旋律里感受草原民居的辽阔与自由，是蒙古包最具代表性的音乐名片。',
        'yanan': '《黄土高坡》是陕北窑洞的国民级符号，用"西北风"的豪迈，唱出了窑洞的黄土情怀。窑洞是陕北特有的生土民居，凿土而居，冬暖夏凉，是黄土高原的生活印记，而这首歌的高亢旋律、黄土意象，完美对应着窑洞的地域文化，歌词里的"我家住在黄土高坡"，直接点明了窑洞的生存环境，让窑洞不再是简单的建筑，而是陕北人坚韧精神的载体，每一句都刻着窑洞的灵魂。',
        'fenghuang': '《高山有好水》是湘西凤凰的专属金曲，用灵动的旋律，唱出了吊脚楼的山水意境。湘西吊脚楼是苗族、土家族的传统民居，依山傍水、悬空而建，是湘西山水里的活态建筑，而这首歌的旋律里满是湘西的山水灵气，歌词里的"吊脚楼、小背篓、沱江水"，精准对应着吊脚楼的建筑特色与地域风情，让吊脚楼的灵动与诗意在旋律里完美呈现，是湘西吊脚楼最适配的文化注解。',
        'lhasa': '《古碉悠情》是藏地风情的纯音佳作，用悠远的藏式旋律，唱出了碉房的千年厚重。藏族碉房是青藏高原的传统民居，石砌墙体、平顶造型，适配高原的气候与生活，而这首歌的空灵旋律、藏地元素，完美贴合碉房的雄浑气质，旋律里的高原回响，精准对应着碉房的建筑肌理与文化底蕴，让碉房的历史感与神圣感在音乐里尽情流淌，是藏族碉房最具氛围感的音乐表达。',
        'weihai': '《海草房之恋》是威海海草房的原创金曲，用温柔的旋律，唱出了海草房的渔乡情怀。山东海草房是胶东半岛的特色民居，以海草为顶、石头为墙，是渔家人的海上家园，而这首歌的旋律里满是大海的气息，歌词里的"海草房、渔家人、威海湾"，精准对应着海草房的建筑特色与渔乡文化，让海草房的质朴与温情在旋律里完美呈现，是海草房最专属的音乐名片。',
        'kashgar': '《喀什的夜》是喀什高台民居的专属金曲，用西域风情的旋律，唱出了高台民居的千年烟火。高台民居是喀什噶尔的活化石，土坯墙、老巷、高台之上的维吾尔族民居，藏着丝路的千年传奇，而这首歌的歌词直接唱到"走进高台民居回到了家"，精准对应着高台民居的建筑风貌与生活场景，让高台民居的古老与鲜活在旋律里完美融合，是高台民居最强关联的音乐注解。',
        'turpan': '《吐鲁番的葡萄熟了》是吐鲁番的地标金曲，用悠扬的维吾尔族旋律，唱出了阿以旺的庭院生活。阿以旺是吐鲁番维吾尔族的传统民居，以明亮的庭院为核心，葡萄架下是维吾尔族人的生活日常，而这首歌的旋律里满是吐鲁番的阳光与甜蜜，歌词里的"葡萄架、庭院、吐鲁番"，精准对应着阿以旺的建筑特色与生活场景，让阿以旺的西域风情在旋律里尽情绽放，是阿以旺最经典的音乐表达。',
        'guangzhou': '《大旗头之歌》是广东镬耳屋的专属金曲，用粤语唱腔，唱出了镬耳屋的岭南风情。广东镬耳屋是广府民居的代表，镬耳状山墙、青砖黛瓦，是岭南古村的标志性建筑，而大旗头古村是镬耳屋的经典代表，这首歌的歌词直接写镬耳屋的建筑特色，用粤语演唱尽显广府文化底蕴，完美贴合镬耳屋的岭南气质，让镬耳屋的古朴与厚重在旋律里完美呈现。',
        'dali': '《梦回土掌房》是云南彝族土掌房的原创金曲，用彝族风情的旋律，唱出了土掌房的高原情怀。土掌房是彝族的传统民居，平顶夯土、依山而建，是云南高原的特色民居，而这首歌的旋律里满是彝族的民族风情，歌词直接以土掌房为主题，精准对应着土掌房的建筑特色与彝族文化，让土掌房的质朴与厚重在旋律里完美呈现，是土掌房最专属的音乐名片。',
        'xishuangbanna': '《月光下的凤尾竹》是极具代表性的傣族纯音乐，旋律轻柔悠扬、婉转绵长，与版纳竹楼的气质高度契合。乐曲以葫芦丝为主奏，音色空灵柔美，如同月光洒在傣家村寨，将竹楼掩映于凤尾竹间的画面徐徐铺展。竹楼作为傣族典型干栏式民居，轻盈通透、临水而筑，与自然相融，而这首纯音乐没有歌词干扰，只用旋律便勾勒出傣家民居的清雅静谧，既体现了地域风情，又贴合竹楼灵动雅致的建筑特色，让听者在乐声中感受竹楼与自然共生的独特韵味。',
    };
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);
    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const wasPlaying = isPlayingRef.current;
            audio.load();
            const canPlayHandler = () => {
                if (audioRef.current && wasPlaying) {
                    audioRef.current.play()
                        .then(() => setIsPlaying(true))
                        .catch(() => setIsPlaying(false));
                }
                audio.removeEventListener('canplay', canPlayHandler);
            };
            audio.addEventListener('canplay', canPlayHandler);
            return () => {
                audio.removeEventListener('canplay', canPlayHandler);
            };
        }
    }, [currentIndex]);
    const resetPlaybackState = () => {
        setCurrentTime(0);
        setDuration(0);
    };
    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
            else {
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(() => setIsPlaying(false));
            }
        }
    };
    const prevTrack = () => {
        resetPlaybackState();
        setCurrentIndex((prev) => (prev === 0 ? stations.length - 1 : prev - 1));
    };
    const nextTrack = () => {
        resetPlaybackState();
        setCurrentIndex((prev) => (prev === stations.length - 1 ? 0 : prev + 1));
    };
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };
    const handleError = (e: React.SyntheticEvent<HTMLAudioElement>) => {
        console.warn('音频加载失败:', e);
        setIsPlaying(false);
    };
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
    };
    const formatTime = (time: number) => {
        if (isNaN(time))
            return '00:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    const stationId = currentStation?.id || 'beijing';
    const folkName = stationFolkNames[stationId] || `${currentStation?.name}·传统民居`;
    const songInfo = songs[stationId] || { name: '当地民谣', artist: '民间艺人' };
    return (<div className="w-full h-screen flex flex-col overflow-hidden" style={{
            backgroundImage: 'url(/乡韵集/乡韵集背景.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundAttachment: 'fixed',
            backgroundColor: '#f7e9d1',
            fontFamily: '"演示秋鸿楷", "YanShi QiuHongKai", var(--font-serif), "Noto Serif SC", SimSun, STSong, serif',
        }}>
      
      <audio ref={audioRef} src={`/乡韵集/音源/${stationId === 'beijing' ? '四合院儿（李谷一）' :
            stationId === 'huizhou' ? '云瞰徽州（卞珊珊）' :
                stationId === 'suzhou' ? '苏州好风光（朱虹）' :
                    stationId === 'fujian' ? '土楼神韵（戴海霞）' :
                        stationId === 'xilingol' ? '蒙古包（乌兰图雅）' :
                            stationId === 'yanan' ? '黄土高坡（杭天琪）' :
                                stationId === 'fenghuang' ? '高山有好水（俆千雅）' :
                                    stationId === 'lhasa' ? '古碉悠情（在帝）' :
                                        stationId === 'weihai' ? '海草房之恋（柏文）' :
                                            stationId === 'kashgar' ? '喀什的夜（阿尔法）' :
                                                stationId === 'turpan' ? '吐鲁番的葡萄熟了（刀郎）' :
                                                    stationId === 'guangzhou' ? '大旗头之歌（钟Sir）' :
                                                        stationId === 'dali' ? '梦回土掌房（LOHE）' :
                                                            stationId === 'xishuangbanna' ? '月光下的凤尾竹（纯音乐）' : '四合院儿（李谷一）'}.MP3`} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={nextTrack} onError={handleError} preload="auto"/>

      
      <div style={{
            height: '12vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '0 60px',
        }}>
        <h1 style={{
            fontSize: '5vh',
            fontWeight: 700,
            color: '#5c3f1e',
            letterSpacing: '0.3em',
            textShadow: '3px 3px 6px rgba(255,235,200,0.7)',
        }}>
          {folkName}
        </h1>
        
        <button onClick={() => setPhase('map')} style={{
            position: 'absolute',
            right: '60px',
            padding: '12px 28px',
            borderRadius: '12px',
            background: 'linear-gradient(145deg, rgba(220,180,120,0.35) 0%, rgba(180,140,80,0.25) 100%)',
            border: '2px solid rgba(150,110,60,0.4)',
            color: '#6b4a25',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(150,110,60,0.25)';
        }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
        }}>
          ← 返回地图
        </button>
      </div>

      
      <div style={{
            height: '63vh',
            display: 'flex',
            gap: '40px',
            padding: '0 80px',
            paddingBottom: '30px',
        }}>
        
        <div style={{
            width: '63vh',
            height: '63vh',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(145deg, rgba(255,250,240,0.9) 0%, rgba(248,235,215,0.85) 100%)',
            border: '3px solid rgba(170,130,80,0.35)',
            boxShadow: '0 12px 40px rgba(100,70,30,0.15)',
        }}>
          <img src={`/memory-game/${stationId === 'beijing' ? '四合院' :
            stationId === 'huizhou' ? '徽派民居' :
                stationId === 'suzhou' ? '苏式民居' :
                    stationId === 'fujian' ? '土楼' :
                        stationId === 'xilingol' ? '蒙古包' :
                            stationId === 'yanan' ? '窑洞' :
                                stationId === 'fenghuang' ? '吊脚楼' :
                                    stationId === 'lhasa' ? '碉房' :
                                        stationId === 'weihai' ? '海草房' :
                                            stationId === 'kashgar' ? '高台民居' :
                                                stationId === 'turpan' ? '阿以旺' :
                                                    stationId === 'guangzhou' ? '镬耳屋' :
                                                        stationId === 'dali' ? '土掌房' :
                                                            stationId === 'xishuangbanna' ? '竹楼' : '四合院'}.jpg`} alt={folkName} style={{
            width: '90%',
            height: '90%',
            borderRadius: '12px',
            objectFit: 'contain',
            display: 'block',
        }}/>
        </div>

        
        <div style={{
            flex: 1,
            borderRadius: '20px',
            padding: '44px',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(155deg, rgba(255,254,250,0.22) 0%, rgba(252,245,235,0.18) 45%, rgba(248,238,225,0.15) 100%)',
            border: '2px solid rgba(185,145,95,0.35)',
            boxShadow: `
              0 16px 50px rgba(100,70,30,0.12),
              inset 0 1px 2px rgba(255,255,255,0.4)
            `,
            position: 'relative',
            overflow: 'hidden',
        }}>
          
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,150,90,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
        }}/>
          
          
          <div style={{
            position: 'absolute',
            top: '-1px',
            left: '-1px',
            width: '40px',
            height: '40px',
            borderTop: '3px solid rgba(180,130,70,0.6)',
            borderLeft: '3px solid rgba(180,130,70,0.6)',
            borderTopLeftRadius: '20px',
            pointerEvents: 'none',
        }}/>
          <div style={{
            position: 'absolute',
            top: '-1px',
            right: '-1px',
            width: '40px',
            height: '40px',
            borderTop: '3px solid rgba(180,130,70,0.6)',
            borderRight: '3px solid rgba(180,130,70,0.6)',
            borderTopRightRadius: '20px',
            pointerEvents: 'none',
        }}/>
          <div style={{
            position: 'absolute',
            bottom: '-1px',
            left: '-1px',
            width: '40px',
            height: '40px',
            borderBottom: '3px solid rgba(180,130,70,0.6)',
            borderLeft: '3px solid rgba(180,130,70,0.6)',
            borderBottomLeftRadius: '20px',
            pointerEvents: 'none',
        }}/>
          <div style={{
            position: 'absolute',
            bottom: '-1px',
            right: '-1px',
            width: '40px',
            height: '40px',
            borderBottom: '3px solid rgba(180,130,70,0.6)',
            borderRight: '3px solid rgba(180,130,70,0.6)',
            borderBottomRightRadius: '20px',
            pointerEvents: 'none',
        }}/>
          
          <button onClick={() => setShowDirectory(!showDirectory)} style={{
            position: 'absolute',
            top: '30px',
            right: '30px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            fontSize: '22px',
            color: '#6b4a25',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(45deg)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}>
            ⚙️
          </button>

          {!showDirectory ? (<>
              <h3 style={{
                fontSize: '3vh',
                fontWeight: 700,
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '2px solid rgba(150,110,60,0.25)',
                color: '#5c3f1e',
            }}>
                简介
              </h3>
              
              <div style={{
                flex: 1,
                overflowY: 'auto',
                fontSize: '2.3vh',
                lineHeight: '2.1',
                color: '#4a3a28',
                textAlign: 'justify',
            }}>
                <p>{stationDescriptions[stationId]}</p>
              </div>
            </>) : (<>
              <h3 style={{
                fontSize: '3vh',
                fontWeight: 700,
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '2px solid rgba(150,110,60,0.25)',
                color: '#5c3f1e',
            }}>
                歌曲目录
              </h3>
              
              <div style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
            }}>
                {stations.map((station, index) => {
                const sid = station.id;
                const song = songs[sid];
                const isActive = index === currentIndex;
                return (<div key={sid} onClick={() => {
                        resetPlaybackState();
                        setCurrentIndex(index);
                        setShowDirectory(false);
                    }} style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: isActive ? 'rgba(200, 150, 100, 0.2)' : 'transparent',
                        borderLeft: isActive ? '3px solid #b88850' : '3px solid transparent',
                    }} onMouseEnter={(e) => {
                        if (!isActive) {
                            e.currentTarget.style.background = 'rgba(200, 150, 100, 0.1)';
                        }
                    }} onMouseLeave={(e) => {
                        if (!isActive) {
                            e.currentTarget.style.background = 'transparent';
                        }
                    }}>
                      <div style={{
                        fontSize: '2vh',
                        fontWeight: 600,
                        color: isActive ? '#8b5a2b' : '#5c3f1e',
                        marginBottom: '4px',
                    }}>
                        {stationFolkNames[sid]}
                      </div>
                      <div style={{
                        fontSize: '1.6vh',
                        color: '#8b6846',
                    }}>
                        🎵 {song?.name || '当地民谣'} · {song?.artist || '民间艺人'}
                      </div>
                    </div>);
            })}
              </div>
            </>)}
        </div>
      </div>

      {/* AI辅助生成：Doubao-Seed-2.0-Lite, 2026-4-06 */}
      <div style={{
            height: '20vh',
            display: 'flex',
            alignItems: 'center',
            padding: '0 80px',
            background: 'linear-gradient(to top, rgba(190,150,90,0.3) 0%, rgba(210,170,110,0.15) 60%, transparent 100%)',
        }}>
        <div style={{
            width: '100%',
            borderRadius: '20px',
            padding: '28px 48px',
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
            background: 'linear-gradient(165deg, rgba(255,254,251,0.25) 0%, rgba(250,244,235,0.20) 60%, rgba(246,236,220,0.18) 100%)',
            border: '2px solid rgba(185,145,95,0.38)',
            boxShadow: `
              0 -10px 40px rgba(100,70,30,0.1),
              inset 0 1px 2px rgba(255,255,255,0.45)
            `,
        }}>
          
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h4 style={{
            fontSize: '2.4vh',
            fontWeight: 700,
            color: '#5c3f1e',
            marginBottom: '4px',
        }}>
              {songInfo.name}
            </h4>
            <p style={{
            fontSize: '1.7vh',
            color: '#8b6846',
        }}>
              {songInfo.artist}
            </p>
          </div>

          
          <div style={{
            flex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
        }}>
            
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
        }}>
              <button onClick={prevTrack} style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            color: '#6b4a25',
            fontSize: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                ⏮
              </button>
              
              <button onClick={togglePlay} style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(145deg, #e0b078 0%, #c5945c 50%, #a87848 100%)',
            border: 'none',
            color: '#fff',
            fontSize: '26px',
            cursor: 'pointer',
            boxShadow: `
                    0 8px 24px rgba(180,120,60,0.4),
                    inset 0 2px 4px rgba(255,255,255,0.3),
                    inset 0 -2px 4px rgba(120,80,40,0.2)
                  `,
            transition: 'all 0.2s ease',
            textShadow: '0 1px 2px rgba(80,50,20,0.3)',
        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                {isPlaying ? '⏸' : '▶'}
              </button>
              
              <button onClick={nextTrack} style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            color: '#6b4a25',
            fontSize: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                ⏭
              </button>
            </div>

            
            <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
        }}>
              <span style={{
            fontSize: '14px',
            color: '#8b6846',
            minWidth: '50px',
            fontWeight: 500,
        }}>
                {formatTime(currentTime)}
              </span>
              
              <input type="range" min="0" max={duration || 100} value={currentTime} onChange={handleSeek} style={{
            flex: 1,
            height: '6px',
            borderRadius: '3px',
            appearance: 'none',
            cursor: 'pointer',
            background: `linear-gradient(to right, #c89860 ${(currentTime / (duration || 1)) * 100}%, #e6d2b6 ${(currentTime / (duration || 1)) * 100}%)`,
        }}/>
              
              <span style={{
            fontSize: '14px',
            color: '#8b6846',
            minWidth: '50px',
            textAlign: 'right',
            fontWeight: 500,
        }}>
                {formatTime(duration)}
              </span>
            </div>
          </div>

          
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            justifyContent: 'flex-end',
        }}>
            <span style={{
            fontSize: '24px',
            color: '#6b4a25'
        }}>🔊</span>
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} style={{
            width: '100px',
            height: '6px',
            borderRadius: '3px',
            appearance: 'none',
            cursor: 'pointer',
            background: `linear-gradient(to right, #c89860 ${volume * 100}%, #e6d2b6 ${volume * 100}%)`,
        }}/>
          </div>
        </div>
      </div>
    </div>);
}
