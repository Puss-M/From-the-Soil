'use client';
import { useState } from 'react';
interface FlipImageProps {
    frontImage?: string;
    backImage?: string;
    width?: number;
    height?: number;
    stationName?: string;
}
const stationTextMap: Record<string, string> = {
    '草原驿': `蒙古包是蒙古族最具代表性的民居，特别适合游牧生活，搭建和拆卸都很方便。整个建筑以木架做支撑，外面包裹厚实的毛毡，既能抵挡草原上的大风大雪，又能保持内部透气舒适。圆圆的造型稳固又好看，内部空间开阔，处处体现着游牧民族的生活智慧。`,
    '北京驿': `北京四合院是北方最经典的合院民居，讲究中轴对称、方方正正。整个院子由正房、厢房围合而成，既安静私密，又符合传统家庭长幼有序的居住习惯。青砖灰瓦、院落规整，不只是一处住所，更是老北京文化和传统礼仪的生动体现。`,
    '威海驿': `胶东海草房是胶东沿海特有的老房子，为了应对多风多雨的天气，当地人用石头砌墙、海草盖顶。厚厚的海草屋顶不仅防雨防潮，还冬暖夏凉，非常耐用。远远看去，一座座海草房朴实厚重，和海边的风景融为一体，是很有地方特色的民居样式。`,
    '苏州驿': `苏州民居是典型的江南水乡建筑，大多依水而建，白墙黛瓦，清秀雅致。房屋布局精巧，通风采光都很讲究，配上精致的木雕砖雕，显得格外细腻。小桥流水、粉墙黛瓦相映成趣，走在这里，能真切感受到江南独有的温柔与灵气。`,
    '永定驿': `客家土楼是客家人聚族而居的特色大型民居，外墙用黄土、沙石等夯筑而成，厚实坚固，防御性极强。楼内房间整齐排列，中心设有祠堂，既能容纳几十上百人共同生活，又能凝聚家族情感。这种独特的圆形或方形建筑，是客家先民在异乡团结生存的智慧结晶。`,
    '广州驿': `镬耳屋是岭南传统民居的经典代表，因屋顶两侧高高翘起、形似锅耳而得名。这种建筑防火、通风、遮阳效果极佳，非常适合南方炎热多雨的气候。镬耳造型不仅美观大气，还寓意着吉祥兴旺，是广府地区乡村与古镇里最具辨识度的建筑符号。`,
    '版纳驿': `傣族竹楼是为湿热环境量身打造的民居，整栋楼用竹木搭建，底层架空，不住人，用来防潮防虫。上层是居住空间，通风凉爽，住起来非常舒服。人字顶的屋顶轻巧好看，既利于排水，又和当地的雨林环境十分协调，充满少数民族风情。`,
    '大理驿': `彝族土掌房是云南彝族最常见的民居，以泥土、木材、石块为主要材料，屋顶是平整的夯土平台。平顶既可以晾晒粮食，又能在上面活动休息，房屋厚实保温，适应高原昼夜温差大的环境。整体造型朴实厚重，与山地环境融为一体，充满浓郁的民族生活气息。`,
    '凤凰驿': `湘西吊脚楼多依山傍水而建，一半靠在山坡上，一半用木柱悬空撑起，造型特别灵动。这种结构既节约山地，又能防潮通风，居住起来干爽舒适。吊脚楼线条轻盈，和山水融为一体，是苗族、土家族先民适应山地环境的巧妙创造。`,
    '徽州驿': `徽派民居以白墙黛瓦、马头墙为标志，外观素雅又有层次。内部布局讲究，天井、厅堂错落有致，砖雕、石雕、木雕工艺精湛，处处透着精致。它不仅是居住的房子，更是徽商文化、儒家思想和传统美学的集中体现。`,
    '拉萨驿': `藏族碉房是高原上非常实用的民居，墙体用石头或土坯砌得十分厚实，能抵御寒风和低温。外形稳重坚固，平顶设计还能用来晾晒东西。这种建筑和高原环境高度适配，沉稳大气，展现出藏族人民朴实又坚韧的生活气息。`,
    '和田驿': `阿以旺是维吾尔族的特色民居，最特别的是中间带天窗的大厅，采光好、空气流通，特别适合新疆干燥炎热的气候。建筑以土坯、砖石为主，外观朴实，内部庭院常常种满花草，生活气息浓厚，是当地人适应沙漠绿洲环境的智慧民居。`,
    '喀什驿': `喀什高台民居依着高坡修建，土坯房层层叠叠、小巷纵横交错，已经有上百年历史。建筑就地取材，黄土夯筑，坚固耐用。整个民居群依山而建、高低错落，像一座小城，保留着最地道的老城风貌和民俗气息。`,
    '延安驿': `陕北窑洞直接在黄土崖壁上挖建而成，不用太多建材，却格外实用。窑洞内部冬暖夏凉，隔音又保湿，完美适应黄土高原的气候。形式简单却充满烟火气，是陕北人民最传统、最接地气的居住方式，也藏着浓浓的黄土风情。`
};
export default function FlipImage({ frontImage = '/zhuyu1.png', backImage = '/zhuyu2.png', width = 270, height = 360, stationName = '' }: FlipImageProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const stationText = stationName ? stationTextMap[stationName] || '' : '';
    const handleClick = () => {
        if (isAnimating)
            return;
        setIsAnimating(true);
        setIsFlipped(!isFlipped);
        setTimeout(() => {
            setIsAnimating(false);
        }, 600);
    };
    return (<div className="flip-image-container" style={{
            position: 'absolute',
            top: 0,
            left: '120px',
            zIndex: 10,
            width: `${width}px`,
            height: `${height}px`,
            perspective: '1000px',
            cursor: 'pointer',
            pointerEvents: 'auto',
        }} onClick={handleClick}>
      
      <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            zIndex: 1,
        }}>
        <img src={backImage} alt="建筑档案背面" style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
        }} onError={(e) => {
            console.error('Failed to load back image', backImage);
            e.currentTarget.style.display = 'none';
        }}/>
        
        {stationText && (<div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                padding: '122px 38px 7px 38px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                fontFamily: '"KaiTi", "STKaiti", "SimSun", "宋体", serif',
                fontSize: '14px',
                lineHeight: 1.6,
                color: '#3D2810',
                textAlign: 'left',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
                zIndex: 2,
                pointerEvents: 'none',
                overflow: 'hidden',
                wordWrap: 'break-word',
                wordBreak: 'break-word',
                hyphens: 'auto',
            }}>
            <div style={{
                width: '100%',
                height: '100%',
                overflowY: 'auto',
                paddingRight: '4px',
                background: 'linear-gradient(to bottom, transparent 0%, rgba(245, 240, 235, 0.06) 10%, rgba(245, 240, 235, 0.06) 90%, transparent 100%)',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(139, 104, 70, 0.3) transparent',
            }}>
              <div style={{
                padding: '2px 0',
                textAlign: 'justify',
                textJustify: 'inter-character',
                letterSpacing: '0.05em',
                wordSpacing: '0.05em',
                textIndent: '2em',
            }}>
                {stationText}
              </div>
            </div>
          </div>)}
      </div>
      
      
      <div className="flip-page" style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isFlipped ? 'rotateX(-180deg)' : 'rotateX(0deg)',
            zIndex: 2,
        }}>
        <img src={frontImage} alt="建筑档案正面" style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
        }} onError={(e) => {
            console.error('Failed to load front image', frontImage);
            e.currentTarget.style.display = 'none';
        }}/>
        
        
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#f5f0eb',
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            opacity: 0.8,
        }}/>
      </div>

      
      <style jsx>{`
        .flip-image-container:hover .flip-page {
          transform: ${isFlipped ? 'rotateX(-180deg) scale(1.02)' : 'rotateX(0deg) scale(1.02)'};
        }
        .flip-page {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
      `}</style>
    </div>);
}
