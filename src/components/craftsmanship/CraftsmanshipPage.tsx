'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store/useStore';
import './craftsmanship.css';
type PointPosition = {
    left: string;
    top: string;
};
type DetailItem = {
    name: string;
    image: string;
    description: string;
    pointPosition: PointPosition;
};
type DecorationType = {
    name: string;
    description: string;
};
type Station = {
    id: string;
    name: string;
    building: string;
    folder: string;
};
type StationData = {
    building: string;
    folder: string;
    mainImage: string;
    introText: string;
    infoItems: string[];
    decorationTypes: DecorationType[];
    details: DetailItem[];
};
const stations: Station[] = [
    { id: 'beijing', name: '北京驿', building: '四合院', folder: '北京驿' },
    { id: 'yanan', name: '延安驿', building: '窑洞', folder: '延安驿' },
    { id: 'yongding', name: '永定驿', building: '土楼', folder: '永定驿' },
    { id: 'weihai', name: '威海驿', building: '海草房', folder: '威海驿' },
    { id: 'turpan', name: '和田驿', building: '阿以旺', folder: '吐鲁番驿' },
    { id: 'suzhou', name: '苏州驿', building: '苏式民居', folder: '苏州驿' },
    { id: 'lasa', name: '拉萨驿', building: '碉房', folder: '拉萨驿' },
    { id: 'kashi', name: '喀什驿', building: '高台民居', folder: '喀什驿' },
    { id: 'huizhou', name: '徽州驿', building: '徽派民居', folder: '徽州驿' },
    { id: 'guangzhou', name: '广州驿', building: '镬耳屋', folder: '广州驿' },
    { id: 'fenghuang', name: '凤凰驿', building: '吊脚楼', folder: '凤凰驿' },
    { id: 'dali', name: '大理驿', building: '土掌房', folder: '大理驿' },
    { id: 'caoyuan', name: '草原驿', building: '蒙古包', folder: '草原驿' },
    { id: 'banna', name: '版纳驿', building: '竹楼', folder: '版纳驿' }
];
const stationDataMap: Record<string, StationData> = {
    beijing: {
        building: '四合院',
        folder: '北京驿',
        mainImage: '四合院主体.png',
        introText: '北京四合院装饰以 "礼序为骨、吉祥为魂" 为核心，通过砖雕、木雕、石雕、油饰、匾额楹联五大工艺，在建筑各部位形成完整体系。它既承载祈福镇宅、文人雅趣的精神内涵，又以色彩纹样体现等级礼制，是北方民居 "外简内精、尊卑有序" 居住文化的视觉表达。',
        infoItems: [
            '装饰类型：砖雕、木雕、石雕、油饰、匾额 / 对联 / 门神五大类',
            '装饰分布：重点集中于影壁、墀头墙、垂花门、宅门、抱鼓石等对外展示部位。',
            '装饰题材：以吉祥祈福、植物纹样、瑞兽纹样、文人雅趣为主，兼具礼制与驱邪寓意'
        ],
        decorationTypes: [
            { name: '砖雕', description: '戗檐题材最丰富，垫花分花篮 / 倒三角形态' },
            { name: '木雕', description: '以贴雕、浮雕工艺为主，门簪为核心装饰部位' },
            { name: '石雕', description: '圆鼓子配大宅，方鼓子配小宅，石敢当专司镇宅' },
            { name: '油饰', description: '"黑红净" 为民间主流配色手法' }
        ],
        details: [
            {
                name: '四合院匾额',
                image: '四合院匾额.png',
                description: '四合院匾额是宅第的文化名片，通常悬挂于门楣之上，多以木质或石质制成，题字多出自名家之手，内容或为祈福纳祥（如"福瑞祥和"），或彰显家风志向，兼具标识与教化功能。匾额的形制、字体与装饰也暗含门第等级，是传统建筑中"文以载道"的直观体现，承载着中式美学与家族精神。',
                pointPosition: { left: '52.25%', top: '45.46%' }
            },
            {
                name: '四合院木雕垂花门',
                image: '四合院木雕垂花门.png',
                description: '垂花门是四合院内宅与外院的分界，因檐柱垂头雕成花瓣状而得名。其木构件装饰极为考究，垂莲柱、雀替、门簪等处常雕刻花卉、瑞兽等吉祥纹样，工艺繁复细腻。它既起到空间过渡、遮挡内院视线的作用，又以精巧木雕展现匠人技艺，是四合院中最具装饰性与仪式感的门型，象征着家族的精致与内敛。',
                pointPosition: { left: '52.56%', top: '73.90%' }
            },
            {
                name: '四合院石雕抱鼓石',
                image: '四合院石雕抱鼓石.png',
                description: '抱鼓石是置于宅门两侧的石雕构件，多由青石或汉白玉雕成，造型以圆鼓形为主，常雕刻狮子、缠枝纹、祥云等图案。它最初用于稳固门轴、承托门扇，后逐渐演变为等级与身份的象征，造型越精美、体量越大，代表宅第主人地位越高。同时，瑞兽纹样也寄托着镇宅辟邪、祈福平安的寓意。',
                pointPosition: { left: '45.16%', top: '79.67%' }
            },
            {
                name: '四合院砖雕影壁',
                image: '四合院砖雕影壁.png',
                description: '影壁又称照壁，多以青砖砌筑，壁面布满精致砖雕。常见题材有花卉、鸟兽、吉祥图案（如"五福捧寿""连年有余"），工艺细腻生动。它既遮挡外部视线、保护院内隐私，又符合风水"挡煞"理念，同时以砖雕艺术传递家族对美好生活的向往，是四合院中集实用、装饰与文化于一体的经典构件。',
                pointPosition: { left: '36.73%', top: '51.23%' }
            }
        ]
    },
    yanan: {
        building: '窑洞',
        folder: '延安驿',
        mainImage: '窑洞主体.png',
        introText: '窑洞装饰依附黄土崖体而建，以实用防护为基础、乡土审美为特色，围绕崖面、窑口、门窗、院落形成简约质朴的装饰体系。整体少繁复雕刻，多以砖石砌筑、植物配植、结构线脚塑造美感，兼顾防冲刷、防坍塌、遮阳通风等功能，是黄土高原民居 "因地制宜、生态宜居" 的典型体现。',
        infoItems: [
            '装饰类型：女儿墙、护崖檐、挑檐、窗饰窗洞、拱头线、门楼坡道、崖头防护七类',
            '装饰分布：集中于窑洞崖面、窑口、门窗、院落入口及崖头坡面',
            '装饰题材：以砖石纹样、瓦作叠层、窗棂花饰、植物配植为主，造型质朴简洁'
        ],
        decorationTypes: [
            { name: '女儿墙', description: '以碎石、砖瓦嵌砌图案，塑造乡土视觉效果' },
            { name: '护崖檐', description: '小青瓦叠层排布，形成韵律感装饰' },
            { name: '窗饰窗洞', description: '多地窗棂样式各异，部分受外来形式影响' },
            { name: '拱头线', description: '强化窑洞拱形特征，突出建筑辨识度' }
        ],
        details: [
            {
                name: '窑洞门窗窗饰',
                image: '窑洞门窗窗饰.png',
                description: '窑洞门窗窗饰是黄土高原窑洞建筑的点睛之笔，多以木质为材，窗棂常采用几何纹、花卉纹或吉祥纹样，工艺精巧。拱形门洞与木格窗既适配窑洞的拱券结构，又能最大化采光通风。窗饰图案承载着当地百姓祈福纳祥的美好愿望，是实用功能与民俗审美、地域文化的巧妙融合。',
                pointPosition: { left: '31.41%', top: '61.23%' }
            },
            {
                name: '窑洞女儿墙装饰',
                image: '窑洞女儿墙装饰.png',
                description: '窑洞女儿墙是窑顶边缘的防护矮墙，其装饰多以砖雕、泥塑或彩绘为主，题材多为卷草纹、回纹、瑞兽等吉祥元素，风格质朴粗犷。它既起到遮挡窑顶、防止雨水倒灌与人员坠落的作用，又以简洁有力的装饰线条强化窑洞建筑的轮廓美感，彰显着黄土民居粗犷而细腻的乡土气质。',
                pointPosition: { left: '51.62%', top: '42.33%' }
            }
        ]
    },
    yongding: {
        building: '土楼',
        folder: '永定驿',
        mainImage: '土楼主体.png',
        introText: '客家土楼装饰以石雕、木雕、灰塑、壁画、瓦饰为核心，围绕大门、祖堂、梁柱、墙面展开，题材多取吉祥瑞兽、花鸟山水与教化文字，兼具祈福辟邪、宗族礼制、门第彰显功能。装饰整体庄重大气、重点突出，既体现客家迁徙文化底蕴，又在工艺上形成 "全域精雕、堂宇为重" 的鲜明特色。',
        infoItems: [
            '装饰类型：石雕、木雕、灰塑、壁画、瓦饰、彩绘、特色西洋装饰',
            '装饰分布：集中于大门门框门楣、祖堂梁枋、门窗屏风、楼内墙面及屋檐瓦当',
            '装饰题材：以吉祥文字、瑞兽花鸟、山水人物、戏剧神话为主，辅以西洋元素及时代印记'
        ],
        decorationTypes: [
            { name: '石雕', description: '多配瑞兽花卉与吉语，兼具加固与门第象征' },
            { name: '木雕', description: '擅镂空与书卷人物，祖堂与屏风最为精美' },
            { name: '灰塑壁画', description: '以竹苞松茂、山水花鸟烘托雅致氛围' },
            { name: '瓦饰', description: '以龙纹花形点缀屋檐，强化外观气势' }
        ],
        details: [
            {
                name: '土楼壁画',
                image: '土楼壁画.png',
                description: '土楼壁画多绘制于门厅、祖堂等公共空间，以矿物颜料为材，题材涵盖神话传说、历史故事、吉祥纹样与客家生活场景。色彩浓郁厚重，线条质朴生动，既承载着教化后人、凝聚宗族的功能，又传递着客家人对美好生活的向往，是客家文化与民间艺术的重要载体。',
                pointPosition: { left: '35.79%', top: '35.61%' }
            },
            {
                name: '土楼木雕',
                image: '土楼木雕.png',
                description: '土楼木雕多见于梁柱、门窗、屏风与神龛等处，以樟木、杉木等本地木材为料，雕刻技法多样，题材多为瑞兽、花鸟、戏曲人物与祈福纹样。工艺精巧细腻，既起到加固木构件、装饰空间的作用，又暗含客家宗族的伦理观念与审美追求，是土楼建筑中极具人文温度的装饰艺术。',
                pointPosition: { left: '50.48%', top: '40.61%' }
            },
            {
                name: '土楼石雕',
                image: '土楼石雕.png',
                description: '土楼石雕主要用于门墩、柱础、栏杆与碑刻等部位，以青石为材，造型浑厚古朴。常见题材有狮子、卷草纹、几何纹与吉祥文字，既稳固建筑结构，又彰显宗族的威严与秩序。石雕风格粗犷有力，与土楼夯土墙体的厚重感相得益彰，是客家建筑中刚柔并济的艺术表达。',
                pointPosition: { left: '63.60%', top: '46.23%' }
            },
            {
                name: '土楼砖雕',
                image: '土楼砖雕.png',
                description: '土楼砖雕多用于门楣、窗楣与屋脊装饰，以青砖为料，采用浮雕、透雕等技法，题材多为花卉、瑞兽与戏曲故事。砖雕工艺细腻，布局均衡，既美化建筑立面，又传递着客家文化的祈福寓意。它与土楼的夯土肌理形成材质对比，让厚重的土楼建筑更具层次与装饰美感。',
                pointPosition: { left: '60.48%', top: '72.48%' }
            }
        ]
    },
    weihai: {
        building: '海草房',
        folder: '威海驿',
        mainImage: '海草房主体.png',
        introText: '海草房（胶东沿海传统民居）装饰以海洋文化为核心底色，依托海草、砖石、木材等本土材料，聚焦屋脊、宅门、窗户、影壁及屋面等关键部位。装饰融合渔业生产生活特色，题材以水生生物、海神意象、吉祥文字为主，兼具祈福避祸、彰显地位、实用防护功能，风格质朴厚重，是胶东沿海渔民顺应海洋环境、寄托生活祈愿的建筑体现。',
        infoItems: [
            '装饰类型：海洋文化图像符号、几何图案与文字、宅门装饰、窗户装饰、影壁装饰、海草房屋面装饰',
            '装饰分布：集中于屋脊、照壁、门楼、门窗、庭院、地面及屋面（屋脊、坡面）',
            '装饰题材：鳌鱼、夔龙等水生动物纹，妈祖、八仙等神话人物，鱼虾蟹水草等水生动植物，各类几何纹，吉祥文字及组合图案，船形造型'
        ],
        decorationTypes: [
            { name: '宅门', description: '船形瓦作是特色，门簪门枕石装饰，彰显主人地位，寓意出海一帆风顺' },
            { name: '窗户', description: '奇数竖棂为主，配几何纹，兼顾安全与美观，便于糊窗纸防护' },
            { name: '影壁', description: '以 "五福捧寿" 为核心，砖雕灰雕结合，祈福辟邪、守护家宅财寿' },
            { name: '海草房屋面', description: '船形屋脊，海草苫盖 + 瓦片铺设，防腐防潮，寓意出海平安、居住安稳' }
        ],
        details: [
            {
                name: '海草房门饰',
                image: '海草房门饰.png',
                description: '海草房门饰以木质为基底，多搭配海草编织、木刻或简单彩绘装饰，题材多为几何纹、渔猎符号与吉祥纹样，风格质朴粗犷。它既加固了以海草为顶、木为骨的门扇结构，又适配沿海潮湿多风的气候，同时以充满渔家生活气息的装饰，传递着胶东渔民对自然的敬畏与对平安丰收的祈愿，是海草房极具地域辨识度的细节。',
                pointPosition: { left: '54.54%', top: '62.48%' }
            }
        ]
    },
    turpan: {
        building: '阿以旺',
        folder: '吐鲁番驿',
        mainImage: '阿以旺主体.png',
        introText: '阿以旺民居装饰以伊斯兰教文化为基底，整体呈现外简内繁、重点装饰的特点。装饰主要分布于门、窗、墙面、顶棚、外廊、壁龛及色彩系统，多用植物纹、几何纹、尖拱造型，不绘人物动物。装饰同时承载宗教表达、居住身份彰显、防风沙 / 采光 / 防潮等实用功能，体现中原、西域与伊斯兰文化的融合。',
        infoItems: [
            '装饰类型：门饰、窗饰、墙面装饰、顶棚装饰、外廊装饰、壁龛装饰、色彩装饰、毡毯装饰',
            '装饰分布：覆盖门框门板、窗格墙面、楼体内外墙面、横梁顶棚、木柱廊部、室内壁龛、建筑外立面及室内毡毯',
            '装饰题材：植物茎叶纹、石榴 / 葡萄等花卉纹、波浪纹、几何纹、尖拱造型、"卍" 纹、二方连续 / 四方连续纹样',
            '民俗寓意：植物纹象征生命繁荣；几何纹体现秩序美感；尖拱呼应伊斯兰教文化；白色象征纯洁平安，绿色象征生机与希望，蓝色代表尊贵。'
        ],
        decorationTypes: [
            { name: '门饰', description: '以尖拱造型与植物几何纹为主，木雕镂雕体现身份地位' },
            { name: '窗饰', description: '栅格 + 植物几何纹样，双扇窗抵御风沙，兼顾通风与采光' },
            { name: '墙面', description: '石膏雕刻与砖拼花为主，白条纹祈愿丰收，承载宗教与生活需求' },
            { name: '外廊', description: '木柱、尖拱券与彩绘结合，纹样融合中原与西域风格' }
        ],
        details: [
            {
                name: '阿以旺壁龛装饰',
                image: '阿以旺壁龛装饰.png',
                description: '阿以旺壁龛是嵌入墙体的装饰性龛位，多以石膏雕花、彩绘或木刻装点，题材以几何纹、植物纹与伊斯兰纹样为主，造型精致规整。它既兼具储物与陈设功能，可摆放器物与经书，又以细腻装饰美化室内空间，是维吾尔族建筑中融合实用与宗教审美、体现生活仪式感的经典细节。',
                pointPosition: { left: '56.73%', top: '42.48%' }
            },
            {
                name: '阿以旺门饰',
                image: '阿以旺门饰.png',
                description: '阿以旺门饰以木质门扉为核心，门楣、门框与门扇常饰有木雕、彩绘或石膏浮雕，纹样繁复对称，多为卷草纹、几何纹与宗教符号，色彩浓郁艳丽。它既起到加固门扇、分隔空间的作用，又以华丽装饰彰显宅第的富足与文化品位，是阿以旺建筑中极具民族辨识度的门面符号。',
                pointPosition: { left: '70.48%', top: '64.67%' }
            },
            {
                name: '阿以旺墙饰',
                image: '阿以旺墙饰.png',
                description: '阿以旺墙饰以石膏浮雕、彩绘与木刻为主要形式，题材涵盖几何纹、花卉纹与伊斯兰经文，布局均衡对称、线条流畅。墙饰多分布于厅堂与居室墙面，既起到防潮防风、保护墙体的作用，又以浓郁民族风格营造出庄重典雅的室内氛围，传递着维吾尔族对生活美学与宗教信仰的追求。',
                pointPosition: { left: '31.10%', top: '68.42%' }
            },
            {
                name: '阿以旺外廊装饰',
                image: '阿以旺外廊装饰.png',
                description: '阿以旺外廊是建筑的核心公共空间，廊柱、檐口与栏杆处常饰有木雕、石膏雕花与彩绘，纹样以卷草、葡萄、花卉等吉祥图案为主，风格华丽灵动。它既起到遮阳避雨、通风纳凉的实用功能，又以通透开放的形制与精致装饰，成为家族社交与节庆活动的场所，是阿以旺建筑中最具生活气息与艺术魅力的部分。',
                pointPosition: { left: '56.10%', top: '71.86%' }
            }
        ]
    },
    suzhou: {
        building: '苏式民居',
        folder: '苏州驿',
        mainImage: '苏式民居主体.png',
        introText: '苏州民居装饰以 "文人雅趣、精雕细琢" 为核心，依托木雕、石雕、砖雕、彩绘四大工艺，在建筑各部位形成完整体系。装饰题材多取山水花鸟、戏曲故事与吉祥文字，布局均衡雅致，兼具祈福纳祥、教化后人、彰显门第功能，是江南 "粉墙黛瓦、小桥流水" 居住文化的视觉表达。',
        infoItems: [
            '装饰类型：木雕、石雕、砖雕、彩绘、漏窗、铺地、匾额楹联',
            '装饰分布：集中于门楼、厅堂、门窗、栏杆、屋脊、照壁、庭院铺地',
            '装饰题材：梅兰竹菊四君子、山水花鸟、戏曲故事、吉祥文字、几何纹样、博古图案'
        ],
        decorationTypes: [
            { name: '木雕', description: '门窗梁枋为主，浮雕透雕结合，题材雅致细腻' },
            { name: '石雕', description: '栏杆柱础为主，造型简洁流畅，与园林景观相融' },
            { name: '砖雕', description: '门楼照壁为主，刀法细腻，布局均衡对称' },
            { name: '彩绘', description: '梁枋藻井为主，色彩淡雅，体现文人审美' }
        ],
        details: [
            {
                name: '苏州民居木雕窗',
                image: '苏州民居木雕窗.png',
                description: '苏州民居木雕窗以优质硬木为材，窗棂采用浮雕、透雕等技法，雕刻题材多为梅兰竹菊、花鸟虫鱼与吉祥纹样，工艺细腻雅致。它既起到通风采光、分隔空间的作用，又以精巧木雕传递江南文人的审美意趣，是苏州民居"移步换景"造园理念的重要载体，尽显温婉雅致的江南气质。',
                pointPosition: { left: '73.29%', top: '57.48%' }
            },
            {
                name: '苏州民居石栏杆',
                image: '苏州民居石栏杆.png',
                description: '苏州民居石栏杆多以青石或花岗岩打造，栏板与望柱常雕刻卷草纹、几何纹与山水图案，造型简洁流畅。它既保障了廊檐、天井等处的行走安全，又以质朴石材质感与白墙黛瓦形成对比，强化了建筑的层次美感，是江南园林与民居中兼具实用与装饰性的经典构件。',
                pointPosition: { left: '68.91%', top: '68.73%' }
            },
            {
                name: '苏州民居砖雕',
                image: '苏州民居砖雕.png',
                description: '苏州民居砖雕以青砖为料，采用浮雕、圆雕等技法，题材涵盖戏曲故事、山水园林与吉祥文字，布局均衡、刀法细腻。砖雕多见于门楣、照壁与屋脊等处，既美化建筑立面，又承载着家族祈福纳祥、崇文重教的美好寓意，是苏州民居"精雕细琢"工艺美学的集中体现。',
                pointPosition: { left: '38.29%', top: '44.98%' }
            }
        ]
    },
    lasa: {
        building: '碉房',
        folder: '拉萨驿',
        mainImage: '碉房主体.png',
        introText: '拉萨碉房装饰以藏传佛教文化为核心，整体呈现 "外朴内华、重点突出" 的特点。装饰主要分布于门窗、檐口、墙面、屋顶及室内经堂，多用彩绘、木雕、石雕与金属饰件，题材以宗教符号、吉祥八宝、瑞兽花卉为主，兼具祈福辟邪、彰显信仰、适应高原气候功能，是藏式民居 "因地制宜、信仰至上" 的典型体现。',
        infoItems: [
            '装饰类型：门窗装饰、檐口装饰、墙面装饰、屋顶装饰、室内装饰、色彩系统',
            '装饰分布：集中于门窗框楣、檐口挑檐、外墙涂饰、屋顶经幡、室内经堂与家具',
            '装饰题材：吉祥八宝、金刚杵、莲花、宝瓶等宗教符号，狮子、龙、凤等瑞兽，卷草纹、云纹等传统纹样'
        ],
        decorationTypes: [
            { name: '门窗', description: '黑框彩绘，梯形窗套，宗教符号装饰，兼具防风与信仰表达' },
            { name: '檐口', description: '挑檐彩绘，吉祥八宝图案，色彩鲜艳，强化建筑轮廓' },
            { name: '墙面', description: '白墙黑窗套，梯形窗洞，适应高原强光，体现藏式美学' },
            { name: '屋顶', description: '经幡风马旗，牛角状白石，祈福辟邪，彰显宗教信仰' }
        ],
        details: [
            {
                name: '碉房经幡风马旗',
                image: '碉房经幡风马旗.png',
                description: '碉房经幡风马旗是藏式民居屋顶的标志性装饰，由五彩布条印制经文与吉祥图案，随风飘扬。它既承载着祈福禳灾、传播佛法的心灵寄托，又以鲜艳色彩点缀厚重的石砌建筑，是藏民与天地神灵沟通的媒介，彰显着高原民居浓厚的宗教氛围与生命活力。',
                pointPosition: { left: '38.60%', top: '21.86%' }
            },
            {
                name: '碉房门窗',
                image: '碉房门窗.png',
                description: '碉房门窗以厚重的木质为框架，窗套呈梯形，饰有彩绘宗教符号与吉祥图案，色彩对比强烈。它既起到防风保温、适应高原气候的作用，又以独特的梯形造型与浓郁宗教装饰，强化了碉房建筑的防御性与神圣感，是藏式建筑美学与实用功能的完美结合。',
                pointPosition: { left: '37.35%', top: '73.11%' }
            },
            {
                name: '碉房牛角状白石',
                image: '碉房牛角状白石.png',
                description: '碉房牛角状白石是置于屋顶四角或门楣上的白石装饰，形似牛角，表面常刻有经文或吉祥图案。它既起到镇宅辟邪、祈福纳祥的宗教功能，又以白色石材与深色墙体形成鲜明对比，是藏民对自然崇拜与宗教信仰的物质化表达，承载着高原民族的精神寄托。',
                pointPosition: { left: '72.35%', top: '28.73%' }
            }
        ]
    },
    kashi: {
        building: '高台民居',
        folder: '喀什驿',
        mainImage: '高台民居主体.png',
        introText: '高台民居装饰以西域乡土文化为基底，整体呈现 "因地制宜、粗犷质朴" 的特点。装饰主要分布于门窗、墙面、檐口及屋顶，多用木雕、泥塑、彩绘与砖刻，题材以几何纹、植物纹与宗教符号为主，兼具防风沙、防日晒、祈福辟邪功能，是西域 "依山而建、层层叠叠" 居住文化的典型体现。',
        infoItems: [
            '装饰类型：门窗装饰、墙面装饰、檐口装饰、屋顶装饰、色彩系统',
            '装饰分布：集中于门窗框楣、夯土墙面、檐口挑檐、屋顶平台与建筑立面',
            '装饰题材：几何纹、回纹、植物纹、宗教符号、吉祥图案、西域传统纹样'
        ],
        decorationTypes: [
            { name: '门窗', description: '木质镂空结构，几何纹样拼接，防风沙兼顾通风采光' },
            { name: '墙面', description: '泥雕彩绘砖刻，花卉几何图案，美化墙面防止风化' },
            { name: '檐口', description: '木构挑檐，简单装饰，遮阳避雨强化建筑轮廓' },
            { name: '屋顶', description: '平台与护栏，实用为主，局部装饰体现生活气息' }
        ],
        details: [
            {
                name: '高台民居窗饰',
                image: '高台民居窗饰.png',
                description: '高台民居窗饰多为木质镂空结构，窗棂常以几何纹、回纹或简单花草纹样拼接而成，造型质朴简洁。它既适配高台民居的夯土墙体，保障室内通风采光，又能过滤风沙、遮挡视线，同时以规整的木构线条点缀厚重的土黄色墙面，形成材质与色彩的对比，是西域乡土建筑中实用与审美兼具的细节。',
                pointPosition: { left: '61.10%', top: '58.11%' }
            },
            {
                name: '高台民居门饰',
                image: '高台民居门饰.png',
                description: '高台民居门饰以木质门扉为核心，门楣、门框处常饰有简单木雕或彩绘，题材多为几何纹、植物纹与宗教符号，风格粗犷大气。门饰既加固了门扇结构，又彰显着家族的生活气息与文化信仰，与高台民居依山而建、层层叠叠的形制呼应，传递出西域民居厚重而鲜活的地域气质。',
                pointPosition: { left: '39.23%', top: '77.48%' }
            },
            {
                name: '高台民居墙饰',
                image: '高台民居墙饰.png',
                description: '高台民居墙饰以夯土墙面为基底，局部饰有泥雕、彩绘或砖刻，题材多为花卉、几何纹与吉祥图案，色彩浓郁质朴。墙饰既起到美化墙面、防止风化的作用，又寄托着当地居民祈福平安的美好愿望，与高台民居的土黄色肌理浑然一体，是西域建筑中极具生命力的装饰表达。',
                pointPosition: { left: '31.73%', top: '62.48%' }
            }
        ]
    },
    huizhou: {
        building: '徽派民居',
        folder: '徽州驿',
        mainImage: '徽派民居主体.png',
        introText: '徽派民居装饰以 "三雕"（木雕、石雕、砖雕）为核心，整体呈现 "外简内繁、精雕细琢" 的特点。装饰主要分布于门楼、厅堂、门窗、栏杆及屋脊，题材多取人物故事、山水花鸟与吉祥文字，兼具祈福纳祥、教化后人、彰显门第功能，是徽商文化 "贾而好儒、亦商亦文" 的视觉表达。',
        infoItems: [
            '装饰类型：木雕、石雕、砖雕、彩绘、漏窗、马头墙、匾额楹联',
            '装饰分布：集中于门楼、厅堂、门窗、栏杆、屋脊、照壁、天井',
            '装饰题材：人物故事、山水花鸟、吉祥文字、几何纹样、博古图案、戏曲场景'
        ],
        decorationTypes: [
            { name: '木雕', description: '门窗梁枋为主，浮雕透雕结合，题材雅致细腻' },
            { name: '石雕', description: '门墩柱础为主，造型浑厚古朴，与建筑结构相融' },
            { name: '砖雕', description: '门楼照壁为主，刀法细腻繁复，布局均衡对称' },
            { name: '马头墙', description: '防火封火山墙，造型错落有致，体现徽派特色' }
        ],
        details: [
            {
                name: '徽派木雕',
                image: '徽派木雕.png',
                description: '徽派木雕以优质硬木为材，采用浮雕、透雕、圆雕等技法，题材涵盖人物故事、山水花鸟与吉祥纹样，工艺精湛细腻。它多见于门窗、梁枋与屏风，既起到装饰空间、分隔功能的作用，又以精巧雕刻传递徽商"贾而好儒"的文化追求，是徽派建筑中极具艺术价值的装饰元素。',
                pointPosition: { left: '40.16%', top: '50.92%' }
            },
            {
                name: '徽派民居门楼与砖雕',
                image: '徽派民居门楼与砖雕.png',
                description: '徽派民居门楼是宅第的"脸面"，多以青砖砌筑，门楣、门框处布满精致砖雕，题材多为人物故事、吉祥图案与戏曲场景。它既起到标识门第、分隔内外的作用，又以繁复砖雕彰显家族的财力与文化品位，是徽派建筑中集实用、装饰与礼制于一体的经典构件。',
                pointPosition: { left: '36.41%', top: '68.11%' }
            },
            {
                name: '徽派石雕',
                image: '徽派石雕.png',
                description: '徽派石雕以青石、花岗岩为料，多用于门墩、柱础、栏杆与碑刻，造型浑厚古朴，题材涵盖瑞兽、花卉与吉祥文字。它既稳固建筑结构，又以质朴石材质感与白墙黛瓦形成对比，强化了徽派建筑的层次美感，是徽商文化中刚柔并济的艺术表达。',
                pointPosition: { left: '61.73%', top: '68.11%' }
            }
        ]
    },
    guangzhou: {
        building: '镬耳屋',
        folder: '广州驿',
        mainImage: '镬耳屋主体.png',
        introText: '镬耳屋装饰以广府文化为基底，整体呈现 "外繁内简、重点突出" 的特点。装饰主要集中于山墙、屋脊、门窗及檐口，多用灰塑、砖雕、木雕与彩绘，题材以花卉、瑞兽、吉祥文字与岭南风物为主，兼具祈福辟邪、彰显门第、适应湿热气候功能，是广府民居 "兼容并蓄、务实创新" 的典型体现。',
        infoItems: [
            '装饰类型：山墙装饰、屋脊装饰、门窗装饰、檐口装饰、灰塑、砖雕、彩绘',
            '装饰分布：集中于镬耳山墙、龙船脊、门窗框楣、檐口挑檐与建筑立面',
            '装饰题材：花卉、瑞兽、吉祥文字、岭南风物、戏曲故事、几何纹样'
        ],
        decorationTypes: [
            { name: '山墙', description: '镬耳造型，灰塑装饰，防火防风，彰显门第等级' },
            { name: '屋脊', description: '龙船脊为主，灰塑砖雕，祈福辟邪，强化建筑轮廓' },
            { name: '门窗', description: '木雕彩绘，几何纹样，通风防潮，体现广府特色' },
            { name: '檐口', description: '灰塑彩绘，花卉瑞兽，遮阳避雨，美化建筑立面' }
        ],
        details: [
            {
                name: '镬耳屋山墙装饰',
                image: '镬耳屋山墙装饰.png',
                description: '镬耳屋山墙装饰以灰塑、砖雕为主要形式，镬耳造型的山墙常饰有花卉、瑞兽与吉祥图案，色彩鲜艳，工艺繁复。它既起到防火防风、强化建筑结构的作用，又以独特的镬耳造型与华丽装饰彰显家族的财力与地位，是广府民居中最具辨识度的建筑符号。',
                pointPosition: { left: '18.29%', top: '32.17%' }
            },
            {
                name: '镬耳屋龙船脊',
                image: '镬耳屋龙船脊.png',
                description: '镬耳屋龙船脊是屋脊的典型形式，多以灰塑、砖雕装饰，题材涵盖花卉、瑞兽与吉祥文字，造型蜿蜒如龙船。它既起到防水排水、保护屋面的作用，又以华丽装饰寄托家族祈福纳祥、一帆风顺的美好愿望，是广府建筑中集实用与象征于一体的经典构件。',
                pointPosition: { left: '50.48%', top: '28.11%' }
            },
            {
                name: '镬耳屋门柱',
                image: '镬耳屋门柱.png',
                description: '镬耳屋门柱以石质或木质为材，柱身常雕刻花卉、瑞兽或吉祥文字，造型简洁有力。它既起到支撑门廊、分隔空间的作用，又以精致雕刻彰显门第的文化品位，与镬耳山墙、龙船脊共同构成广府民居完整而和谐的装饰体系。',
                pointPosition: { left: '35.48%', top: '67.17%' }
            }
        ]
    },
    fenghuang: {
        building: '吊脚楼',
        folder: '凤凰驿',
        mainImage: '吊脚楼主体.png',
        introText: '吊脚楼装饰以湘西苗族、土家族文化为基底，整体呈现 "因地制宜、质朴灵动" 的特点。装饰主要分布于栏杆、檐角、门窗及柱饰，多用木雕、彩绘与编织工艺，题材以花卉、鸟兽、几何纹与民族符号为主，兼具防潮通风、祈福辟邪、适应山地地形功能，是湘西民居 "依山傍水、天人合一" 的典型体现。',
        infoItems: [
            '装饰类型：栏杆装饰、檐角装饰、门窗装饰、柱饰、彩绘、编织装饰',
            '装饰分布：集中于栏杆、檐角挑檐、门窗框楣、吊瓜柱与建筑立面',
            '装饰题材：花卉、鸟兽、几何纹、民族符号、吉祥图案、生活场景'
        ],
        decorationTypes: [
            { name: '栏杆', description: '木质镂空，几何纹样，保障安全，美化建筑立面' },
            { name: '檐角', description: '翘角飞檐，简单装饰，排水防雨，强化建筑轮廓' },
            { name: '门窗', description: '木雕彩绘，民族纹样，通风采光，体现民族特色' },
            { name: '柱饰', description: '吊瓜柱造型，局部雕刻，结构装饰，适应山地地形' }
        ],
        details: [
            {
                name: '吊脚楼吊瓜柱',
                image: '吊脚楼吊瓜柱.png',
                description: '吊脚楼吊瓜柱是支撑楼体的重要构件，形似瓜果，柱身常饰有简单雕刻或彩绘，造型质朴灵动。它既起到承重结构、适应山地地形的作用，又以独特的造型点缀吊脚楼的立面，是湘西民居中极具地域特色的结构装饰元素。',
                pointPosition: { left: '32.25%', top: '61.08%' }
            },
            {
                name: '吊脚楼栏杆',
                image: '吊脚楼栏杆.png',
                description: '吊脚楼栏杆以木质为材，采用镂空、雕刻等工艺，纹样多为几何纹、花卉纹或民族符号，造型简洁实用。它既保障了楼廊行走的安全，又以规整的木构线条丰富建筑立面，与青山绿水相映成趣，彰显着湘西民居的灵动与质朴。',
                pointPosition: { left: '71.41%', top: '53.73%' }
            },
            {
                name: '吊脚楼檐角',
                image: '吊脚楼檐角.png',
                description: '吊脚楼檐角多呈翘角飞檐造型，局部饰有简单木雕或彩绘，风格轻盈灵动。它既起到排水防雨、保护楼体的作用，又以优美的曲线强化建筑轮廓，与周围的山水环境和谐相融，是湘西民居"天人合一"建筑理念的直观体现。',
                pointPosition: { left: '23.29%', top: '29.67%' }
            }
        ]
    },
    dali: {
        building: '土掌房',
        folder: '大理驿',
        mainImage: '土掌房主体.png',
        introText: '土掌房装饰以白族文化为基底，整体呈现 "外朴内华、重点装饰" 的特点。装饰主要集中于照壁、门窗、檐口及墙面，多用彩绘、木雕、石雕与灰塑，题材以花卉、瑞兽、吉祥文字与白族图腾为主，兼具祈福辟邪、彰显信仰、适应高原气候功能，是白族民居 "三坊一照壁、四合五天井" 的典型体现。',
        infoItems: [
            '装饰类型：照壁装饰、门窗装饰、檐口装饰、墙面装饰、彩绘、木雕、石雕',
            '装饰分布：集中于照壁、门窗框楣、檐口挑檐、外墙涂饰与建筑立面',
            '装饰题材：花卉、瑞兽、吉祥文字、白族图腾、山水图案、几何纹样'
        ],
        decorationTypes: [
            { name: '照壁', description: '彩绘灰塑，吉祥图案，祈福辟邪，美化庭院空间' },
            { name: '门窗', description: '木雕彩绘，花卉瑞兽，通风采光，体现白族特色' },
            { name: '檐口', description: '彩绘木雕，简单装饰，遮阳避雨，强化建筑轮廓' },
            { name: '墙面', description: '白墙彩绘，局部装饰，防潮防风，适应高原气候' }
        ],
        details: [
            {
                name: '土掌房石虎装饰',
                image: '土掌房石虎装饰.png',
                description: '土掌房石虎装饰是白族民居的特色构件，多以青石雕刻成虎形，置于门墩、照壁或屋顶，造型威猛古朴。它既起到镇宅辟邪、祈福纳祥的宗教功能，又以石材质感与土掌房的土木结构形成对比，是白族文化中自然崇拜与宗教信仰的物质化表达。',
                pointPosition: { left: '29.54%', top: '74.67%' }
            }
        ]
    },
    caoyuan: {
        building: '蒙古包',
        folder: '草原驿',
        mainImage: '蒙古包主体.png',
        introText: '蒙古包装饰以游牧文化为基底，整体呈现 "便携实用、色彩鲜艳" 的特点。装饰主要集中于毡毯、木构、银器及色彩系统，多用刺绣、编织、雕刻与金属工艺，题材以花卉、鸟兽、几何纹与蒙古族符号为主，兼具保暖防风、祈福辟邪、适应游牧生活功能，是草原民居 "逐水草而居、天人合一" 的典型体现。',
        infoItems: [
            '装饰类型：毡毯装饰、木构装饰、银器装饰、色彩装饰、刺绣、编织',
            '装饰分布：集中于毡毯覆盖、木构框架、银器饰品、室内陈设与建筑外观',
            '装饰题材：花卉、鸟兽、几何纹、蒙古族符号、吉祥图案、自然元素'
        ],
        decorationTypes: [
            { name: '毡毯', description: '刺绣编织，花卉几何，保暖防风，美化室内空间' },
            { name: '木构', description: '简单雕刻，结构装饰，支撑包体，体现游牧特色' },
            { name: '银器', description: '金属工艺，民族符号，祈福辟邪，彰显家族财富' },
            { name: '色彩', description: '鲜艳对比，民族审美，区分功能，适应草原环境' }
        ],
        details: [
            {
                name: '蒙古包毡绣',
                image: '蒙古包毡绣.png',
                description: '蒙古包毡绣以羊毛毡为底，采用刺绣、编织等工艺，纹样多为花卉、几何纹与蒙古族符号，色彩鲜艳对比强烈。它既起到保暖防风、装饰室内空间的作用，又以精美的工艺展现蒙古族妇女的巧手与审美，是游牧文化中实用与艺术完美结合的典范。',
                pointPosition: { left: '17.98%', top: '49.36%' }
            },
            {
                name: '蒙古包木雕',
                image: '蒙古包木雕.png',
                description: '蒙古包木雕多见于哈那（围墙）与乌尼（椽子）的连接处，采用简单雕刻工艺，纹样多为几何纹或民族符号，造型质朴实用。它既起到加固木构、稳定包体的作用，又以简洁装饰点缀蒙古包的内部结构，体现着游牧民族对自然材料的巧妙运用。',
                pointPosition: { left: '36.73%', top: '64.36%' }
            },
            {
                name: '蒙古包银器',
                image: '蒙古包银器.png',
                description: '蒙古包银器是游牧民族的重要装饰与实用器物，多以纯银或银合金打造，器身常雕刻花卉、瑞兽与蒙古族符号，工艺精湛。它既用于盛装奶茶、奶酒等日常饮食，又以华丽银饰彰显家族的财富与地位，是蒙古族文化中实用与审美完美结合的代表。',
                pointPosition: { left: '56.41%', top: '57.79%' }
            }
        ]
    },
    banna: {
        building: '竹楼',
        folder: '版纳驿',
        mainImage: '竹楼主体.png',
        introText: '竹楼装饰以傣族文化为基底，整体呈现 "因地制宜、轻盈通透" 的特点。装饰主要集中于屋顶、柱饰、栏杆及门窗，多用木雕、彩绘与编织工艺，题材以几何纹、动植物纹与民族符号为主，兼具防潮通风、祈福辟邪、适应湿热气候功能，是傣族民居 "依水而居、天人合一" 的典型体现。',
        infoItems: [
            '装饰类型：屋顶装饰、柱饰、栏杆装饰、门窗装饰、彩绘、编织装饰',
            '装饰分布：集中于歇山顶、支撑木柱、栏杆扶手、门窗框楣与建筑立面',
            '装饰题材：几何纹、动植物纹、民族符号、吉祥图案、自然元素、生活场景'
        ],
        decorationTypes: [
            { name: '屋顶', description: '歇山顶造型，茅草竹片铺盖，排水通风，体现傣族特色' },
            { name: '柱饰', description: '木柱竹柱雕刻，几何动植物纹，防潮防虫，美化建筑立面' },
            { name: '栏杆', description: '竹木编织，几何纹样，保障安全，丰富建筑层次' },
            { name: '门窗', description: '木雕彩绘，民族纹样，通风采光，体现傣族审美' }
        ],
        details: [
            {
                name: '竹楼歇山顶',
                image: '竹楼歇山顶.png',
                description: '竹楼歇山顶是傣族竹楼的典型屋顶形式，由多组三角形山面与坡面组合而成，檐角微微上翘，造型轻盈灵动。屋顶多以茅草或竹片铺盖，既利于快速排水，适配南方多雨气候，又能通过通透结构通风散热。山面顶端常饰有精致木雕或彩绘，既强化了建筑轮廓，也承载着傣族的民俗审美与文化寓意。',
                pointPosition: { left: '52%', top: '28%' }
            },
            {
                name: '竹楼柱饰',
                image: '竹楼柱饰.png',
                description: '竹楼柱饰是支撑架空底层的木柱或竹柱上的装饰，柱身多雕刻几何纹、动植物纹或吉祥图案，部分柱础也会做造型处理，既起到防潮防虫的作用，又美化了建筑立面。柱饰工艺质朴粗犷，与竹楼整体的通透轻盈风格呼应，既传递着傣族对自然的敬畏，也彰显了乡土建筑的人文温度。',
                pointPosition: { left: '57.04%', top: '48.42%' }
            }
        ]
    }
};
export default function CraftsmanshipPage() {
    const { setPhase } = useStore();
    const calibrationUiEnabled = false;
    const [currentStation, setCurrentStation] = useState<Station>(stations[0]);
    const [currentDetail, setCurrentDetail] = useState<DetailItem | null>(null);
    const [showDetail, setShowDetail] = useState(false);
    const [calibrationMode, setCalibrationMode] = useState(false);
    const [selectedCalibrationDetail, setSelectedCalibrationDetail] = useState<string | null>(null);
    const [calibrationMessage, setCalibrationMessage] = useState('开启校点模式后，先选择构件，再点击主体图记录位置。');
    const [pointOverridesByStation, setPointOverridesByStation] = useState<Record<string, Record<string, {
        left: string;
        top: string;
    }>>>({});
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageBounds, setImageBounds] = useState({ left: 0, top: 0, width: 0, height: 0 });
    const imageContainerRef = useRef<HTMLDivElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const baseStationData: StationData = stationDataMap[currentStation.id] || {
        building: '未知建筑',
        folder: '北京驿',
        mainImage: '四合院主体.png',
        introText: '暂无介绍',
        infoItems: ['暂无信息'],
        decorationTypes: [{ name: '暂无', description: '暂无描述' }],
        details: []
    };
    const pointOverrides = pointOverridesByStation[currentStation.id] || {};
    const stationData = {
        ...baseStationData,
        details: baseStationData.details.map((detail: DetailItem) => ({
            ...detail,
            pointPosition: pointOverrides[detail.name] || detail.pointPosition
        }))
    };
    const selectedCalibrationData = stationData.details.find((detail: DetailItem) => detail.name === selectedCalibrationDetail);
    const calibrationExportText = stationData.details
        .map((detail: DetailItem) => `{\n  name: '${detail.name}',\n  pointPosition: { left: '${detail.pointPosition?.left || '50%'}', top: '${detail.pointPosition?.top || '50%'}' }\n}`)
        .join(',\n');
    const handleBackToMap = () => {
        setPhase('map');
    };
    const handleSelectStation = (station: Station) => {
        setCurrentDetail(null);
        setShowDetail(false);
        setImageLoaded(false);
        setSelectedCalibrationDetail(null);
        setCalibrationMessage('切换驿站成功，先选择要校准的构件，再点击主体图。');
        setCurrentStation(station);
    };
    const handleShowDetail = (detail: DetailItem) => {
        if (calibrationMode) {
            setSelectedCalibrationDetail(detail.name);
            setCalibrationMessage(`已选中“${detail.name}”，请点击主体图上的对应位置。`);
            return;
        }
        setCurrentDetail(detail);
        setShowDetail(true);
    };
    const handleCloseDetail = () => {
        setShowDetail(false);
        setCurrentDetail(null);
    };
    const handleImageLoad = () => {
        setImageLoaded(true);
    };
    const handleToggleCalibrationMode = () => {
        const nextMode = !calibrationMode;
        setCalibrationMode(nextMode);
        setShowDetail(false);
        setCurrentDetail(null);
        setSelectedCalibrationDetail(null);
        setCalibrationMessage(nextMode
            ? '校点模式已开启。先选择一个构件，再点击主体图落点。'
            : '校点模式已关闭。');
    };
    const handleCalibrationTargetSelect = (detailName: string) => {
        setSelectedCalibrationDetail(detailName);
        setCalibrationMessage(`已选中“${detailName}”，请点击主体图上的对应位置。`);
    };
    const handleCopyCalibrationData = async () => {
        try {
            await navigator.clipboard.writeText(calibrationExportText);
            setCalibrationMessage(`已复制 ${currentStation.name} 的点位数据，可直接粘贴回 details。`);
        }
        catch {
            setCalibrationMessage('复制失败了，请手动从面板里复制。');
        }
    };
    const handleImageCalibration = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!calibrationMode || !selectedCalibrationDetail) {
            return;
        }
        const container = imageContainerRef.current;
        if (!container || imageBounds.width <= 0 || imageBounds.height <= 0) {
            setCalibrationMessage('图片还没准备好，稍等一下再点。');
            return;
        }
        const containerRect = container.getBoundingClientRect();
        const x = event.clientX - containerRect.left;
        const y = event.clientY - containerRect.top;
        const withinImageX = x >= imageBounds.left && x <= imageBounds.left + imageBounds.width;
        const withinImageY = y >= imageBounds.top && y <= imageBounds.top + imageBounds.height;
        if (!withinImageX || !withinImageY) {
            setCalibrationMessage('请点在线稿图片本体上，留白区域不会记录。');
            return;
        }
        const leftPercent = (((x - imageBounds.left) / imageBounds.width) * 100).toFixed(2);
        const topPercent = (((y - imageBounds.top) / imageBounds.height) * 100).toFixed(2);
        const nextPoint = { left: `${leftPercent}%`, top: `${topPercent}%` };
        setPointOverridesByStation((previous) => ({
            ...previous,
            [currentStation.id]: {
                ...(previous[currentStation.id] || {}),
                [selectedCalibrationDetail]: nextPoint
            }
        }));
        setCalibrationMessage(`“${selectedCalibrationDetail}” 已更新到 left: ${nextPoint.left}，top: ${nextPoint.top}。`);
    };
    useEffect(() => {
        const updateImageBounds = () => {
            const container = imageContainerRef.current;
            const image = imageRef.current;
            if (!container || !image) {
                return;
            }
            const containerRect = container.getBoundingClientRect();
            const imageRect = image.getBoundingClientRect();
            setImageBounds({
                left: imageRect.left - containerRect.left,
                top: imageRect.top - containerRect.top,
                width: imageRect.width,
                height: imageRect.height
            });
        };
        updateImageBounds();
        const resizeObserver = typeof ResizeObserver !== 'undefined'
            ? new ResizeObserver(() => {
                updateImageBounds();
            })
            : null;
        if (resizeObserver) {
            if (imageContainerRef.current) {
                resizeObserver.observe(imageContainerRef.current);
            }
            if (imageRef.current) {
                resizeObserver.observe(imageRef.current);
            }
        }
        window.addEventListener('resize', updateImageBounds);
        return () => {
            resizeObserver?.disconnect();
            window.removeEventListener('resize', updateImageBounds);
        };
    }, [currentStation, showDetail, imageLoaded]);
    const getPointStyle = (detail: DetailItem) => {
        const leftPercent = parseFloat(detail.pointPosition?.left || '50');
        const topPercent = parseFloat(detail.pointPosition?.top || '50');
        if (imageBounds.width > 0 && imageBounds.height > 0) {
            return {
                left: `${imageBounds.left + (imageBounds.width * leftPercent) / 100}px`,
                top: `${imageBounds.top + (imageBounds.height * topPercent) / 100}px`
            };
        }
        return {
            left: detail.pointPosition?.left || '50%',
            top: detail.pointPosition?.top || '50%'
        };
    };
    return (<div className="craftsmanship-container">
      
      <div className="timeline-layer">
        <div className="timeline-header">
          <div className="timeline-title">
            <i className="fas fa-timeline"></i>
            匠作志 · {currentStation.name} · {stationData.building}
          </div>
          <div className="timeline-actions">
            {calibrationUiEnabled && (<button className={`calibration-toggle ${calibrationMode ? 'active' : ''}`} onClick={handleToggleCalibrationMode}>
                <i className={`fas ${calibrationMode ? 'fa-crosshairs' : 'fa-location-crosshairs'}`}></i>
                {calibrationMode ? '退出校点' : '校点模式'}
              </button>)}
            <button className="back-button" onClick={handleBackToMap}>
              <i className="fas fa-map"></i>
              返回地图
            </button>
          </div>
        </div>
        
        
        <div className="stations-timeline-container">
          <div className="stations-timeline-line"></div>
          <div className="stations-nodes">
            {stations.map((station) => (<div key={station.id} className={`station-node ${currentStation.id === station.id ? 'active' : ''}`} onClick={() => handleSelectStation(station)}>
                <div className="station-dot"></div>
                <div className="station-label">{station.name}</div>
              </div>))}
          </div>
        </div>
      </div>

      
      <div className="content-layer">
        
        <div className="left-panel">
          
          <div className="building-name-section">
            <div className="building-name">
              <i className="fas fa-home"></i>
              <span>{stationData.building}</span>
            </div>
          </div>
          
          
          <div className="decoration-row">
            <div className="decoration-intro">
              <div className="section-title">
                <i className="fas fa-info-circle"></i>
                装饰简介
              </div>
              <div className="section-text">
                {stationData.introText}
              </div>
            </div>
            
            <div className="decoration-info">
              <div className="section-title">
                <i className="fas fa-list"></i>
                装饰信息
              </div>
              <ul className="info-list">
                {stationData.infoItems.map((item: string, index: number) => (<li key={index} className="info-item">
                    <span className="info-text">{item}</span>
                  </li>))}
              </ul>
            </div>
          </div>
          
          
          <div className="decoration-timeline-section">
            <div className="section-title">
              <i className="fas fa-stream"></i>
              装饰类型
            </div>
            <div className="decoration-timeline-container">
              <div className="decoration-timeline-line"></div>
              <div className="decoration-nodes">
                {stationData.decorationTypes.map((type: DecorationType, index: number) => (<div key={index} className="decoration-node">
                    <div className="decoration-dot"></div>
                    <div className="decoration-label">{type.name}</div>
                    <div className="decoration-description">{type.description}</div>
                  </div>))}
              </div>
            </div>
          </div>
        </div>

                
        <div className="right-panel">
          {calibrationUiEnabled && calibrationMode && (<div className="calibration-panel">
              <div className="calibration-panel-header">
                <div className="section-title">
                  <i className="fas fa-crosshairs"></i>
                  校点面板
                </div>
                <button className="copy-points-button" onClick={handleCopyCalibrationData}>
                  <i className="fas fa-copy"></i>
                  复制当前驿站坐标
                </button>
              </div>
              <div className="calibration-message">{calibrationMessage}</div>
              <div className="calibration-layout">
                <div className="calibration-list">
                  {stationData.details.length > 0 ? (stationData.details.map((detail: DetailItem) => {
                const isSelected = detail.name === selectedCalibrationDetail;
                return (<button key={detail.name} className={`calibration-item ${isSelected ? 'active' : ''}`} onClick={() => handleCalibrationTargetSelect(detail.name)}>
                          <span className="calibration-item-name">{detail.name}</span>
                          <span className="calibration-item-coords">
                            {detail.pointPosition?.left || '50%'} / {detail.pointPosition?.top || '50%'}
                          </span>
                        </button>);
            })) : (<div className="calibration-empty">当前驿站暂无可校准构件。</div>)}
                </div>
                <div className="calibration-preview">
                  {selectedCalibrationData ? (<>
                      <div className="calibration-preview-title">{selectedCalibrationData.name}</div>
                      <div className="calibration-preview-coords">
                        left: {selectedCalibrationData.pointPosition?.left || '50%'}
                      </div>
                      <div className="calibration-preview-coords">
                        top: {selectedCalibrationData.pointPosition?.top || '50%'}
                      </div>
                      <div className="calibration-preview-hint">
                        现在直接点击下方主体图，对应构件的点位就会被覆盖。
                      </div>
                    </>) : (<div className="calibration-preview-hint">
                      先在左侧选一个构件，再到主图上点击对应位置。
                    </div>)}
                </div>
              </div>
              <textarea className="calibration-export" value={calibrationExportText} readOnly aria-label="当前驿站点位导出结果"/>
            </div>)}
          <div className="image-area">
            
            <div ref={imageContainerRef} className={`main-image-container ${showDetail && !calibrationMode ? 'shrink' : ''} ${calibrationMode ? 'calibration-active' : ''}`} onClick={handleImageCalibration}>
              <img ref={imageRef} src={`/民居/${stationData.folder}/${stationData.mainImage}`} alt={`${stationData.building}主体`} className="main-image" onLoad={handleImageLoad}/>

              
              {stationData.details && stationData.details.length > 0 ? (stationData.details.map((detail: DetailItem, index: number) => (<div key={index} className={`detail-point ${detail.name === selectedCalibrationDetail ? 'selected' : ''} ${calibrationMode ? 'calibration-mode' : ''}`} style={getPointStyle(detail)} onClick={(event) => {
                event.stopPropagation();
                handleShowDetail(detail);
            }}>
                    <span className="point-label">{detail.name}</span>
                  </div>))) : (<div className="no-details-message">
                  暂无细节点
                </div>)}
            </div>
            
            
            {showDetail && currentDetail && !calibrationMode && (<div className="detail-container active">
                <div className="detail-header">
                  <div className="detail-title">{currentDetail.name}</div>
                  <div className="close-detail" onClick={handleCloseDetail}>
                    <i className="fas fa-times"></i>
                  </div>
                </div>
                <div className="detail-image-container">
                  <img src={`/民居/${stationData.folder}/${currentDetail.image}`} alt={currentDetail.name} className="detail-image"/>
                </div>
                <div className="detail-description">
                  <div className="detail-text">
                    {currentDetail.description}
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>);
}
