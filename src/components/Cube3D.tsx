'use client';
import { useState, useRef, useEffect } from 'react';
interface Cube3DProps {
    stationId?: string;
    stationName?: string;
}
interface FaceContent {
    title: string;
    description: string;
}
const defenseSystemContent: Record<string, string> = {
    'beijing': '🧱 以院墙、大门为基础，形成局部基础防御\n🏡 院落纵深布局，影壁遮挡外部视线，增强私密性与安全性',
    'huizhou': '🧱 以高大封闭的马头墙为核心设施，兼具防火与防盗功能\n🏡 采用“四水归堂”封闭布局与纵深多进的院落结构\n🛡️ 配合高墙窄巷的村落格局，形成单体到村落的完整防御体系',
    'suzhou': '🏰 风火墙（马头墙）防火防风，兼具防御功能，守护居住安全\n🏘️ 深宅高墙搭配水巷环绕，形成隐蔽、安全的居住环境\n🛡️ 依托水巷地形，构建天然防御屏障，提升居住安全性',
    'fujian': '🧱 以高大厚重的生土版筑墙为主体，外墙封闭少窗，形成坚固防御屏障\n🏯 方形土楼设前院，一、二层不开窗，仅高层开小窗，防御性突出\n⭕ 圆形土楼为环形封闭结构，无防御死角，安全性能最优\n🛡️ 多座土楼聚居形成村落集群防御，整体安全性进一步提升',
    'xilingol': '🌪️ 圆形流线造型可让风沙雨雪顺滑滑落，避免渗漏与冲击\n🪢 哈那结构可灵活调节，雨天排水、大风时贴地减阻，不易掀翻\n🧶 可通过增减毛毡、更换苇帘应对寒暑，适应极端气候\n🛡️ 营地外围设木栅栏或勒勒车，形成临时防御圈，保障安全',
    'yanan': '🏔️ 依托黄土崖体天然形成防护屏障，兼具隐蔽性与坚固性\n🏠 窑洞洞口隐蔽、内部封闭，有效隔绝外界，守护家宅安全',
    'fenghuang': '🧱 以院墙与院门为基础，形成局部防御体系\n🏔️ 依山而建的地形优势，进一步提升居住安全性',
    'lhasa': '🛡️ 石木主体搭配厚达1米的夯土墙，整体防御性极强\n🚪 仅设一个高1.7m、宽0.8m的门洞，无侧窗，仅屋顶开小型天窗\n🏹 碉楼内设箭眼与望孔，结构封闭，易守难攻，御敌防盗',
    'weihai': '🧱 以院墙和院门为基础，形成局部基础防御\n🏘️ 依托紧凑村落布局，提升整体居住安全性',
    'kashgar': '🏔️ 建筑择高而建，外围墙体厚实，出入口少，封闭性强\n🛤️ 内部巷道多为丁字型、尽端式，狭窄深邃，易守难攻\n🪨 以不同地砖样式区分道路，兼具防御与生活导向功能',
    'turpan': '🧱 整体布局严密封闭，以四合院形式围合，以内廊相连\n🚪 外墙几乎无窗，门窗均开向内庭，仅设一个出入口，防盗防风沙\n🏜️ 庭院上部加盖封顶，有效堵截风沙侵袭，提升居住安全性',
    'guangzhou': '🧱 墙体厚达半米以上，青砖内夹铁枝与麻石板，结构极为坚固\n🚪 门窗高置气窗、低窗嵌铁条，防盗设计严密\n🏠 双层屋檐结构，大幅增加破顶难度\n🔥 镬耳式封火墙可有效阻隔火势，兼具防火与防御功能',
    'dali': '🧱 土掌房墙体厚实，不开窗或仅开小窗，有效阻隔寒风与风沙\n🏡 屋顶厚实严密，兼具防风、防雨、防盗功能，适配高原气候',
    'xishuangbanna': '🐍 采用干栏式高架结构，有效防范野兽、虫蛇侵扰与洪水侵袭\n🪜 底层架空设计，既通风防潮，又形成天然防御空间'
};
const beijingContent: Record<number, string> = {
    0: '🏛️ 大门样式多样，不同形制代表户主不同身份地位\n📜 民国前，门的形制、大小、油漆、装饰均受严格等级制度约束\n🏮 门簪、门墩、影壁等构件兼具装饰寓意与传统礼制象征',
    1: '🧱 以院墙、大门为基础，形成局部基础防御\n🏡 院落纵深布局，影壁遮挡外部视线，增强私密性与安全性',
    2: '🔥 主要依靠火炕取暖，温暖均匀且持久\n🏮 富裕人家使用地坑供暖，舒适度更高\n🧥 冬季加装帘架门、风门与棉门帘，有效阻隔寒风',
    3: '🏗️ 台基抬高30–50cm，阻断地下潮气向上渗透\n🪨 地基采用灰土垫层夯实，上铺青石板或方砖，致密隔水',
    4: '🏘️ 分为一进、二进、三进、四进四合院四种主要形制\n📏 三进四合院为布局最规整、最典型的标准形式',
    5: '🏅 项目：国家级非物质文化遗产——北京四合院传统营造技艺\n🔢 遗产编号：Ⅷ-208\n🏛️ 保护单位：中国艺术研究院\n📄 资料来源：中国非物质文化遗产网·中国非物质文化遗产数字博物馆'
};
const huizhouContent: Record<number, string> = {
    0: '💰 天井采用“四水归堂”布局，寓意肥水不流外人田、聚财纳福\n🏯 马头墙高低错落呈“五岳朝天”样式，寓意家族兴旺、气势蓬勃\n🕰️ 厅堂陈设座钟、花瓶、镜子，谐音“终生平安”，祈愿家庭安稳\n🪵 木雕楹联遍布宅内，彰显儒商文化品位，体现“以文传家”的理念',
    1: '🧱 以高大封闭的马头墙为核心设施，兼具防火与防盗功能\n🏡 采用“四水归堂”封闭布局与纵深多进的院落结构\n🛡️ 配合高墙窄巷的村落格局，形成单体到村落的完整防御体系',
    2: '🔥 墙体厚实，可有效蓄存热量，提升室内保温效果\n🧱 堂屋与主卧设置砖石火塘，为皖南民居主流取暖方式',
    3: '💧 依靠“四水归堂”天井实现集中排水，避免院内积水\n🌧️ 高低错落的马头墙引导雨水快速排离，防止墙体积水渗漏',
    4: '🏘️ 以三合院或四合院为基本形式，平面呈方形，按天井分为四类\n🏠 “冂”型：一进二层，正屋三间，天井两侧设廊房\n🏡 “口”型：三间二进，两进之间设狭长天井\n🏯 “H”型：前后双天井，两侧配廊房，代表为歙县方士载宅\n🏛️ “曰”型：三间两进或三进，各进设天井，以廊房相连',
    5: '🏅 项目：国家级非物质文化遗产——徽派传统民居营造技艺\n🔢 遗产编号：Ⅷ-178\n📍 保护地区：安徽省黄山市\n📄 资料来源：中国非物质文化遗产网·中国非物质文化遗产数字博物馆'
};
const suzhouContent: Record<number, string> = {
    0: '🏮 清代副阶沿石（如意石、燕窝石），名称自带吉祥寓意，彰显身份\n🪨 门枕石为东山、西山古宅特有，实用且象征尊贵身份\n📜 门枕石、如意石等构件，遵循清代制度规范，体现身份等级',
    1: '🏰 风火墙（马头墙）防火防风，兼具防御功能，守护居住安全\n🏘️ 深宅高墙搭配水巷环绕，形成隐蔽、安全的居住环境\n🛡️ 依托水巷地形，构建天然防御屏障，提升居住安全性',
    2: '🔥 堂屋设铜制炭炉，为全家公共暖区，供族人取暖\n🫘 室内搭配铜质手炉、锡质脚炉，精准聚热，适配冬季保暖\n🧣 冬季增设帘幕，阻隔寒风，提升保暖效果',
    3: '💧 檐口出挑、檐廊出挑，减少飘雨侵蚀，阻断潮气\n🏠 屋面望砖与青瓦搭配，致密隔水，减少潮气渗透\n🌧️ 屋面坡度合理，配合滴水瓦设计，快速排水，避免积水返潮',
    4: '🏘️ 分为城镇民居和乡村民居两大类，布局贴合当地地形\n📍 城镇民居依托水巷，乡村民居贴合山林，适配不同居住需求',
    5: '🏅 项目：香山帮传统建筑营造技艺\n🔢 遗产编号：Ⅷ-27\n📍 申报地区：江苏省苏州市\n📄 资料来源：中国非物质文化遗产网·中国非物质文化遗产数字博物馆'
};
const fujianContent: Record<number, string> = {
    0: '🌍 圆形楼体契合风水"天圆地方"理念，寓意天地相融、气场圆满\n💰 整体形制利于聚气纳财，寄托族人祈福兴旺、阖家团圆的美好愿望',
    1: '🧱 以高大厚重的生土版筑墙为主体，外墙封闭少窗，形成坚固防御屏障\n🏯 方形土楼设前院，一、二层不开窗，仅高层开小窗，防御性突出\n⭕ 圆形土楼为环形封闭结构，无防御死角，安全性能最优\n🛡️ 多座土楼聚居形成村落集群防御，整体安全性进一步提升',
    2: '🔥 厚实夯土墙具有极佳热惰性，有效阻隔寒风，保温效果突出\n☀️ 中央天井引入日照，提升冬季室内温度，形成温暖小气候\n🪵 楼内楼板、门窗多采用杉木，保温性好，夜间闭窗即可保持暖意\n🏡 依靠建筑结构与自然采光实现被动式取暖，无需额外供暖设备',
    3: '💧 夯土墙可自动吸湿放湿，配合石灰粉刷层，调节室内湿度\n🌧️ 台基抬高、设滴水沟与暗沟系统，高效排水防涝、避免雨水倒灌\n🪟 天井与通廊形成良好通风，加速湿气排出，保持楼内干燥\n🪵 粮仓、楼板多用杉木，抗潮防腐，可长期储存粮食不霉变',
    4: '🏛️ 永定客家土楼类型丰富，现存多达30余种形制\n📐 主要包含长方形楼、正方形楼、圆楼、五凤楼、府第式方楼等\n✨ 另有五角形、八角形、椭圆形、半月形、回字形、富字形等特色形制\n🏘️ 同时涵盖三合院式、U字形、走马楼、前圆后方等多样布局形式',
    5: '🏅 包含两项国家级非物质文化遗产\n📜 客家土楼营造技艺，遗产编号Ⅷ-28，申报地区为福建南靖、华安\n🏛️ 客家民居营造技艺，遗产编号Ⅷ-28，申报地区为福建龙岩\n📄 资料来源：中国非物质文化遗产网·中国非物质文化遗产数字博物馆'
};
const xilingolContent: Record<number, string> = {
    0: '☀️ 浑圆套脑如金轮，乌尼杆如银伞，寓意光明与庇护\n🐟 木门如双鱼，哈那网格如盘蚕，均为吉祥符号\n🌸 顶棚围毡似旗帜，顶饰如莲花瓣，寄托平安祥和的祈愿',
    1: '🌪️ 圆形流线造型可让风沙雨雪顺滑滑落，避免渗漏与冲击\n🪢 哈那结构可灵活调节，雨天排水、大风时贴地减阻，不易掀翻\n🧶 可通过增减毛毡、更换苇帘应对寒暑，适应极端气候\n🛡️ 营地外围设木栅栏或勒勒车，形成临时防御圈，保障安全',
    2: '🔥 中央设火塘燃烧牛粪，热量在圆形空间内均匀扩散\n🧶 多层毛毡形成保温层，可抵御零下四五十度的严寒\n🛏️ 部分定居点设半圆盘炕与外置地灶，兼顾取暖与炊事\n🏥 专设热炕，满足老人、病人等特殊人群的保暖需求',
    3: '🏔️ 选址于高坡地带，远离低洼积水区域\n🔥 火塘持续燃烧，降低室内空气湿度\n🪵 木质哈那架架空地面，形成通风层，有效阻隔地潮',
    4: '🏕️ 按套脑（天窗）形制分为井字式、插孔式、串连式套脑蒙古包\n🌾 另有苇包形制，适配草原不同游牧生产生活场景',
    5: '🏅 国家级非物质文化遗产：蒙古包营造技艺，编号Ⅷ-181，申报地区：内蒙古自治区西乌珠穆沁旗\n🏅 国家级非物质文化遗产：蒙古包营造技艺，编号Ⅷ-181，申报地区：内蒙古自治区陈巴尔虎旗\n🏅 国家级非物质文化遗产：蒙古包营造技艺，编号Ⅷ-181，申报地区：青海省黄南藏族自治州河南蒙古族自治县\n🏅 国家级非物质文化遗产：蒙古包营造技艺，编号Ⅷ-181，申报地区：内蒙古自治区文学艺术界联合会\n📄 资料来源：中国非物质文化遗产网·中国非物质文化遗产数字博物馆'
};
const yananContent: Record<number, string> = {
    0: '🔮 门簪兼具辟邪、装饰与悬匾功能，含生殖崇拜寓意，祈愿繁衍\n🪨 门墩与抱鼓石雕刻鹿、蝙蝠、石榴图案，基座多为须弥座，彰显门第\n🦁 石狮象征权贵与辟邪，公狮踩绣球、母狮抚幼狮，寓意平安昌盛',
    1: '🏔️ 依托黄土崖体天然形成防护屏障，兼具隐蔽性与坚固性\n🏠 窑洞洞口隐蔽、内部封闭，有效隔绝外界，守护家宅安全',
    2: '🔥 以火炕为核心采暖方式，节能高效\n🍲 农家多采用锅灶连通火炕，利用烧饭余热采暖，俗称"一把火"',
    3: '🏔️ 选址远离沟谷积水区，依托干燥厚黄土层，避免地下水渗透\n🧱 窑脸砖石砌筑，窑壁反复夯实，覆麦秸泥与白灰泥，致密隔水',
    4: '🏘️ 按布局结构形式，主要分为明庄窑、土坑窑、独立式窑洞\n🏔️ 另有靠崖式窑洞、下沉式窑洞等，适配黄土高原多样地形',
    5: '🏅 国家级非物质文化遗产：窑洞营造技艺（陕北窑洞营造技艺），编号Ⅷ-180，申报地区：陕西省延安市宝塔区\n🏅 国家级非物质文化遗产：窑洞营造技艺（地坑院营造技艺），编号Ⅷ-180，申报地区：河南省陕县\n🏅 国家级非物质文化遗产：窑洞营造技艺，编号Ⅷ-180，申报地区：甘肃省庆阳市\n🏅 国家级非物质文化遗产：窑洞营造技艺，编号Ⅷ-180，申报地区：山西省平陆县\n📄 资料来源：中国非物质文化遗产网·中国非物质文化遗产数字博物馆'
};
const fenghuangContent: Record<number, string> = {
    0: '🍉 吊瓜柱采用瓜形造型，寓意家族人丁兴旺、世代延续\n🪑 美人靠造型别致，寄托迎客纳福、家族和睦的美好愿景\n🪨 柱础多为宝瓶样式，象征基业稳固、居家平安顺遂',
    1: '🧱 以院墙与院门为基础，形成局部防御体系\n🏔️ 依山而建的地形优势，进一步提升居住安全性',
    2: '🔥 以火塘为核心取暖设施，围坐火塘即可祛湿驱寒\n🌬️ 利用火塘散发的热量提升室温，适应山区阴冷潮湿气候',
    3: '🪜 采用底层架空结构，隔绝地面潮气与秽气上涌\n🏞️ 设退堂与凹廊形成半户外空间，增强通风，加速湿气排出\n🌾 粮仓单独建于斜坡并架空，减少潮气侵扰，保障粮食储存',
    4: '🏘️ 吊脚楼形式多样，主要有单边吊、双边吊、错层吊等形制\n🏡 同时包含四合院式吊脚楼，适应山地多样布局需求',
    5: '🏅 国家级非物质文化遗产：土家族吊脚楼营造技艺，编号Ⅷ-211，申报地区：湖北省咸丰县\n🏅 国家级非物质文化遗产：土家族吊脚楼营造技艺，编号Ⅷ-211，申报地区：湖南省永顺县\n🏅 国家级非物质文化遗产：土家族吊脚楼营造技艺，编号Ⅷ-211，申报地区：重庆市石柱土家族自治县\n📄 资料来源：中国非物质文化遗产网·中国非物质文化遗产数字博物馆'
};
const lasaContent: Record<number, string> = {
    0: '🏔️ 碉房多为多层结构，楼层越高、碉体越规整，象征家族地位越高\n📈 整体形制寓意家族基业稳固、步步高升',
    1: '🛡️ 石木主体搭配厚达1米的夯土墙，整体防御性极强\n🚪 仅设一个高1.7m、宽0.8m的门洞，无侧窗，仅屋顶开小型天窗\n🏹 碉楼内设箭眼与望孔，结构封闭，易守难攻，御敌防盗',
    2: '🧱 采用"崩康"式厚墙结构，保温效果优异\n🔥 室内设置火塘或藏式火炉，提升冬季取暖效果',
    3: '🪨 厚实石砌墙体阻隔潮气入侵\n🔥 室内火塘持续供热，有效降低空气湿度，实现除湿防潮',
    4: '🪨 按主要材料分为石块垒砌的石碉与黏土夯筑的土碉两大类\n🏯 按形式可分为碉楼式碉房、碉塔式碉房、独立式和院式碉房',
    5: '🏅 国家级非物质文化遗产：藏族碉楼营造技艺，编号Ⅷ-186，申报地区：四川省丹巴县\n🏅 国家级非物质文化遗产：碉楼营造技艺（藏族碉楼营造技艺），编号Ⅷ-186，申报地区：青海省班玛县\n📄 资料来源：中国非物质文化遗产网·中国非物质文化遗产数字博物馆'
};
const weihaiContent: Record<number, string> = {
    0: '🛡️ 影壁可遮挡视线、保障私密，兼具祈福辟邪、守护财寿的寓意\n🚪 宅门体现门第等级与主人地位，暗含长幼有序、家族传承的伦理追求',
    1: '🧱 以院墙和院门为基础，形成局部基础防御\n🏘️ 依托紧凑村落布局，提升整体居住安全性',
    2: '🌾 海草屋顶最厚达1米，花岗岩墙体厚40–50cm，隔热保温效果极佳\n🌬️ 村落房屋山墙紧靠、院院相连、街道狭窄，有效抵御冬季寒风',
    3: '💧 屋顶采用三角形高脊大陡坡结构，雨水快速排泄，防止海草受潮腐烂',
    4: '🏠 按院落形制分为单开间海草房、多开间海草房\n🏡 同时包含合院式海草房，适应胶东地区居住需求',
    5: '🏅 省级非物质文化遗产：海草房民居建筑技艺，编号Ⅷ-16，申报地区：山东省荣成市\n📄 资料来源：山东省人民政府关于公布第一批省级非物质文化遗产名录的通知'
};
const kashiContent: Record<number, string> = {
    0: '🧱 家族每增一代便在祖屋加盖一层，形成房连房、楼连楼的格局\n🏺 维吾尔语称"阔孜其亚贝希"，意为"高崖土陶人家"，承载地域文化印记',
    1: '🏔️ 建筑择高而建，外围墙体厚实，出入口少，封闭性强\n🛤️ 内部巷道多为丁字型、尽端式，狭窄深邃，易守难攻\n🪨 以不同地砖样式区分道路，兼具防御与生活导向功能',
    2: '🧱 采用厚实墙体与小窗设计，有效抵御严寒，保温效果突出\n🔥 室内设置火塘与土炕，满足冬季取暖需求，适应高原气候',
    3: '☀️ 当地气候干旱、降水稀少，从环境上减少潮湿来源\n💧 平顶微坡向院内倾斜，实现有序排水，避免积水\n🪨 生土墙分层夯筑并抹泥，隔水防沙，保持室内干燥',
    4: '🏠 按层数分为单层独栋式高台民居、多层叠压式高台民居\n🏘️ 另有连堡式高台民居，形成独特的垂直聚居形态',
    5: 'ℹ️ 喀什高台民居相关营造技艺目前尚未被列入非物质文化遗产项目'
};
const turpanContent: Record<number, string> = {
    0: '🕌 北向主壁龛朝向麦加，作为礼拜神龛，是伊斯兰教信仰的空间体现\n🏡 阿以旺中庭为生活社交核心，兼具采光通风功能，承载家族团聚与睦邻文化',
    1: '🧱 整体布局严密封闭，以四合院形式围合，以内廊相连\n🚪 外墙几乎无窗，门窗均开向内庭，仅设一个出入口，防盗防风沙\n🏜️ 庭院上部加盖封顶，有效堵截风沙侵袭，提升居住安全性',
    2: '🧱 墙体厚实、屋顶平坦，生土墙面保温性能优异，利于冬季保暖\n🪞 室内地面铺设地毯，以炕与壁炉为主要取暖设施\n🌡️ 依托墙体蓄热与昼夜温差，形成稳定温暖的室内环境',
    3: '🌾 密檩上铺设芦苇席、红柳枝，有效阻隔潮气\n🪨 高台基采用河卵石铺筑基层，防盐碱侵蚀且透气防潮',
    4: '🏛️ 阿以旺民居形式多样，主要分为阿以旺厅、辟希阿以旺、开攀斯阿以旺、阿克塞乃等类型',
    5: '🏅 国家级非物质文化遗产：维吾尔族民居建筑技艺（阿依旺赛来民居营造技艺），编号Ⅷ-212，申报地区：新疆维吾尔自治区和田地区\n📄 资料来源：中国非物质文化遗产网·中国非物质文化遗产数字博物馆'
};
const guangzhouContent: Record<number, string> = {
    0: '🎓 两侧镬耳式封火墙形似官帽，寓意"独占鳌头"、仕途顺遂\n📈 院内青石板路逐级向上，象征家族运势"青云直上"\n💰 天井可汇聚雨水，以水喻财，寄托聚财纳福的美好愿望',
    1: '🧱 墙体厚达半米以上，青砖内夹铁枝与麻石板，结构极为坚固\n🚪 门窗高置气窗、低窗嵌铁条，防盗设计严密\n🏠 双层屋檐结构，大幅增加破顶难度\n🔥 镬耳式封火墙可有效阻隔火势，兼具防火与防御功能',
    2: '🔥 堂屋与主卧摆放陶制或铜制炭盆，实现局部聚热取暖',
    3: '💨 镬耳山墙引导气流，加速屋顶与墙面潮气蒸发\n🌬️ 天井开敞通风，冷巷形成穿堂风，快速交换空气、散去湿气',
    4: '🏘️ 按建筑布局分为单座镬耳屋、三间两廊式、多进合院式\n🏛️ 三间两廊式为当地最主流典型的布局形式',
    5: 'ℹ️ 广州镬耳屋相关营造技艺目前暂未被列入非物质文化遗产项目'
};
const daliContent: Record<number, string> = {
    0: '🙏 彝族火塘为圣洁象征，禁止从火塘跨过、投放秽物，寄托和睦安康的美好寓意\n🏯 土掌房墙体、屋顶设计，既适配气候，又彰显彝族民俗文化',
    1: '🧱 土掌房墙体厚实，不开窗或仅开小窗，有效阻隔寒风与风沙\n🏡 屋顶厚实严密，兼具防风、防雨、防盗功能，适配高原气候',
    2: '🔥 以火塘（火塘取暖）为主，搭配厚实墙体与小窗设计，保暖性强\n🪨 利用夯土、土坯墙体的保温特性，减少热量流失',
    3: '🪨 地基采用致密结构，搭配石材铺设，阻断潮气渗透\n💧 部分区域采用石材铺垫，进一步提升隔水防潮效果',
    4: '🏘️ 土掌房分为楼房和平房两类，正房为楼房、耳房为平房\n🏠 单体式土掌房：3间正房（中为堂屋，两侧为卧室，二楼用于存放粮食）\n🏡 组合式土掌房：多间建筑组合而成，分有内院式和无内院式两种',
    5: '🏅 彝族土掌房营造技艺为市级非物质文化遗产\n📜 申报地区为云南玉溪市，资料来源于玉溪市文化馆非遗数据库'
};
const bannaContent: Record<number, string> = {
    0: '🏗️ 竹楼为上下两层高脚结构，高脚设计隔绝地面潮气，保持室内干爽',
    1: '🐍 采用干栏式高架结构，有效防范野兽、虫蛇侵扰与洪水侵袭\n🪜 底层架空设计，既通风防潮，又形成天然防御空间',
    2: '🔥 冬季使用陶制暖手壶，或设置远离木材的安全火塘取暖',
    3: '🦚 竹楼傣语称"很"，源自"晃很"，意为"凤凰展翅"，屋顶轻盈利于排水遮阳\n🪵 顶梁大柱被视为神圣支柱，象征保佑家宅平安、免除灾祸\n🌿 柱体分性别象征，并有"狗柱""龙梯"等生动命名，体现敬畏自然、人与自然和谐共生的智慧',
    4: '🏡 傣族竹楼主要分为版纳型、孟连型、瑞丽型、金平型四种典型类型',
    5: '🏅 省级非物质文化遗产：竹楼营造技艺，编号Ⅷ-7，申报地区：西双版纳州\n📄 资料来源：云南省第五批省级非物质文化遗产代表性项目名录'
};
export function Cube3D({ stationId, stationName }: Cube3DProps) {
    const faces: FaceContent[] = [
        {
            title: '建筑构件民俗含义',
            description: '此处展示该民居建筑构件的民俗寓意，后续填充专属内容。传统民居的每一个构件都蕴含着丰富的文化内涵和民俗寓意，如梁、柱、门、窗、脊饰等都有特定的象征意义。'
        },
        {
            title: '防御体系',
            description: '此处展示该民居的防御体系设计，后续填充专属内容。中国传统民居在长期发展中形成了独特的防御体系，包括围墙、瞭望台、暗道、防御性布局等，反映了古人的生存智慧。'
        },
        {
            title: '取暖方式',
            description: '此处展示该民居的取暖方式与智慧，后续填充专属内容。不同地区的民居根据气候条件和资源禀赋，发展出多样的取暖方式，如火炕、火墙、火塘、地龙等，体现了因地制宜的智慧。'
        },
        {
            title: '防潮方式',
            description: '此处展示该民居的防潮设计与工艺，后续填充专属内容。在潮湿地区，民居通过高台基、架空层、通风设计、防潮材料等巧妙手法解决防潮问题，保护建筑结构和居住者的健康。'
        },
        {
            title: '建筑分类',
            description: '此处展示该民居的建筑分类与形制，后续填充专属内容。中国传统民居按地域、民族、功能等可分为多种类型，如合院式、干栏式、窑洞式、碉房式等，每种类型都有其独特的建筑特色。'
        },
        {
            title: '非遗传承',
            description: '此处展示该民居相关的非遗技艺与传承，后续填充专属内容。许多传统民居建造技艺已被列为非物质文化遗产，如木作、砖雕、石雕、彩绘等工艺，这些技艺的传承对保护传统建筑文化至关重要。'
        }
    ];
    const [rotation, setRotation] = useState({ x: -15, y: 25 });
    const [isDragging, setIsDragging] = useState(false);
    const [autoRotate, setAutoRotate] = useState(true);
    const [userHasDragged, setUserHasDragged] = useState(false);
    const [activeFace, setActiveFace] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState<FaceContent | null>(null);
    const [hoveredFace, setHoveredFace] = useState<number | null>(null);
    const [clickScale, setClickScale] = useState(1);
    const cubeRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const isDraggingRef = useRef(false);
    const lastMousePosRef = useRef({ x: 0, y: 0 });
    const rotationRef = useRef({ x: -15, y: 25 });
    const autoRotateTimeRef = useRef(0);
    const faceElementsRef = useRef<(HTMLDivElement | null)[]>([]);
    const getFrontMostFaceIndex = (rot: {
        x: number;
        y: number;
    }): number => {
        const degToRad = (deg: number) => deg * Math.PI / 180;
        const rx = degToRad(rot.x);
        const ry = degToRad(rot.y);
        const faceNormals = [
            { x: 0, y: 0, z: 1 },
            { x: 1, y: 0, z: 0 },
            { x: -1, y: 0, z: 0 },
            { x: 0, y: 0, z: -1 },
            { x: 0, y: 1, z: 0 },
            { x: 0, y: -1, z: 0 },
        ];
        const cosX = Math.cos(rx);
        const sinX = Math.sin(rx);
        const cosY = Math.cos(ry);
        const sinY = Math.sin(ry);
        const cameraDir = { x: 0, y: 0, z: -1 };
        let maxDot = -Infinity;
        let frontMostIndex = 0;
        for (let i = 0; i < faceNormals.length; i++) {
            const normal = faceNormals[i];
            const nx = normal.x * cosY - normal.z * sinY;
            let nz = normal.x * sinY + normal.z * cosY;
            let ny = normal.y;
            const finalY = ny * cosX - nz * sinX;
            const finalZ = ny * sinX + nz * cosX;
            nz = finalZ;
            ny = finalY;
            const dot = nx * cameraDir.x + ny * cameraDir.y + nz * cameraDir.z;
            if (dot > maxDot) {
                maxDot = dot;
                frontMostIndex = i;
            }
        }
        return frontMostIndex;
    };
    useEffect(() => {
        rotationRef.current = rotation;
    }, [rotation]);
    useEffect(() => {
        if (!autoRotate || isDragging) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            return;
        }
        const animate = (timestamp: number) => {
            if (!autoRotateTimeRef.current) {
                autoRotateTimeRef.current = timestamp;
            }
            const elapsed = timestamp - autoRotateTimeRef.current;
            const speed = 0.00075;
            const xRotation = Math.sin(elapsed * speed) * 8;
            const yRotation = elapsed * speed * 8;
            setRotation({
                x: xRotation,
                y: yRotation
            });
            animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [autoRotate, isDragging, setRotation]);
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        isDraggingRef.current = true;
        setAutoRotate(false);
        setUserHasDragged(true);
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current)
                return;
            const deltaX = e.clientX - lastMousePosRef.current.x;
            const deltaY = e.clientY - lastMousePosRef.current.y;
            const sensitivity = 0.4;
            setRotation(prev => ({
                x: prev.x - deltaY * sensitivity,
                y: prev.y + deltaX * sensitivity
            }));
            lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        };
        const handleMouseUp = () => {
            setIsDragging(false);
            isDraggingRef.current = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            setAutoRotate(false);
            if (cubeRef.current) {
                cubeRef.current.style.transition = 'transform 0.2s cubic-bezier(0.2, 0, 0.1, 1)';
                setTimeout(() => {
                    if (cubeRef.current) {
                        cubeRef.current.style.transition = isDragging ? 'none' : 'transform 0.15s ease-out';
                    }
                }, 200);
            }
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };
    const handleMouseEnter = () => {
        setAutoRotate(false);
    };
    const handleMouseLeave = () => {
        if (!isDragging && !userHasDragged) {
            setAutoRotate(true);
        }
    };
    const handleFaceClick = (index: number) => {
        setActiveFace(index);
        let content = '';
        const title = faces[index].title;
        const contentIndex = index;
        if (stationId === 'beijing' && beijingContent[contentIndex] !== undefined) {
            content = beijingContent[contentIndex];
        }
        else if (stationId === 'huizhou' && huizhouContent[contentIndex] !== undefined) {
            content = huizhouContent[contentIndex];
        }
        else if (stationId === 'suzhou' && suzhouContent[contentIndex] !== undefined) {
            content = suzhouContent[contentIndex];
        }
        else if (stationId === 'fujian' && fujianContent[contentIndex] !== undefined) {
            content = fujianContent[contentIndex];
        }
        else if (stationId === 'xilingol' && xilingolContent[contentIndex] !== undefined) {
            content = xilingolContent[contentIndex];
        }
        else if (stationId === 'yanan' && yananContent[contentIndex] !== undefined) {
            content = yananContent[contentIndex];
        }
        else if (stationId === 'fenghuang' && fenghuangContent[contentIndex] !== undefined) {
            content = fenghuangContent[contentIndex];
        }
        else if (stationId === 'lhasa' && lasaContent[contentIndex] !== undefined) {
            content = lasaContent[contentIndex];
        }
        else if (stationId === 'weihai' && weihaiContent[contentIndex] !== undefined) {
            content = weihaiContent[contentIndex];
        }
        else if (stationId === 'kashgar' && kashiContent[contentIndex] !== undefined) {
            content = kashiContent[contentIndex];
        }
        else if (stationId === 'turpan' && turpanContent[contentIndex] !== undefined) {
            content = turpanContent[contentIndex];
        }
        else if (stationId === 'guangzhou' && guangzhouContent[contentIndex] !== undefined) {
            content = guangzhouContent[contentIndex];
        }
        else if (stationId === 'dali' && daliContent[contentIndex] !== undefined) {
            content = daliContent[contentIndex];
        }
        else if (stationId === 'xishuangbanna' && bannaContent[contentIndex] !== undefined) {
            content = bannaContent[contentIndex];
        }
        else if (index === 1 && stationId) {
            content = defenseSystemContent[stationId] || faces[1].description;
        }
        else {
            content = faces[index].description;
        }
        setModalContent({
            title,
            description: content
        });
        setAutoRotate(false);
        setClickScale(0.95);
        setTimeout(() => {
            setClickScale(1);
            setShowModal(true);
        }, 150);
    };
    const handleStatusClick = () => {
        if (userHasDragged) {
            setAutoRotate(prev => !prev);
        }
        else {
            setAutoRotate(prev => !prev);
        }
    };
    const handleResetRotation = () => {
        setRotation({ x: -15, y: 25 });
        setUserHasDragged(false);
        setAutoRotate(true);
    };
    const handleContainerClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('[data-face-index]')) {
            return;
        }
        const frontMostIndex = getFrontMostFaceIndex(rotation);
        handleFaceClick(frontMostIndex);
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setActiveFace(null);
        if (!userHasDragged) {
            setAutoRotate(true);
        }
    };
    const faceConfig = [
        { transform: 'translateZ(180px)', title: faces[3].title },
        { transform: 'rotateY(90deg) translateZ(180px)', title: faces[1].title },
        { transform: 'rotateY(-90deg) translateZ(180px)', title: faces[2].title },
        { transform: 'rotateY(180deg) translateZ(180px)', title: faces[0].title },
        { transform: 'rotateX(90deg) translateZ(180px)', title: faces[4].title },
        { transform: 'rotateX(-90deg) translateZ(180px)', title: faces[5].title },
    ];
    return (<div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            padding: '60px 20px 40px',
            background: 'transparent',
        }}>
      
      <div style={{
            marginBottom: 120,
            textAlign: 'center',
        }}>
        <h2 style={{
            fontSize: 32,
            fontWeight: 800,
            color: 'var(--paper-brown, #8b6846)',
            margin: 0,
            marginBottom: 12,
            fontFamily: '"KaiTi", "STKaiti", "Noto Serif SC", serif',
            letterSpacing: '0.12em',
            textShadow: '0 2px 4px rgba(91, 70, 44, 0.1)',
        }}>
          建筑知识立方体
        </h2>
        <p style={{
            fontSize: 15,
            color: 'var(--paper-muted, #8f7556)',
            margin: 0,
            letterSpacing: '0.25em',
            opacity: 0.9,
        }}>
          点击任意面查看详细内容
        </p>
        {stationName && (<div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 12,
                padding: '8px 16px',
                background: 'rgba(139, 104, 70, 0.08)',
                borderRadius: 999,
                border: '1px solid rgba(139, 104, 70, 0.16)',
            }}>
            <span style={{ fontSize: 12, color: 'var(--paper-brown)' }}>当前驿站：</span>
            <span style={{ fontWeight: 600, color: 'var(--paper-ink, #5b4631)' }}>{stationName}</span>
          </div>)}
      </div>

      
      <div ref={containerRef} style={{
            position: 'relative',
            width: '360px',
            height: '360px',
            perspective: '1000px',
            cursor: isDragging ? 'grabbing' : 'grab',
        }} onClick={handleContainerClick} onMouseDown={handleMouseDown} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        
        <div ref={cubeRef} style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        }}>
          
          {faceConfig.map((face, index) => (<div key={index} style={{
                position: 'absolute',
                width: '360px',
                height: '360px',
                background: 'url(/立方体装饰素材.png) center center / cover no-repeat',
                border: '2px solid var(--ui-border-strong, rgba(139, 104, 70, 0.5))',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: face.transform,
                backfaceVisibility: 'hidden',
                boxShadow: `
                  0 6px 24px rgba(91, 70, 44, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3),
                  inset 0 -1px 0 rgba(139, 104, 70, 0.15),
                  0 0 0 1px rgba(255, 248, 234, 0.2)
                `,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transformOrigin: 'center',
                overflow: 'hidden',
            }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = `${face.transform} scale(1.08)`;
                e.currentTarget.style.boxShadow = `
                  0 12px 40px rgba(184, 138, 59, 0.6),
                  inset 0 2px 0 rgba(255, 255, 255, 0.8),
                  inset 0 -2px 0 rgba(139, 104, 70, 0.4),
                  0 0 0 3px rgba(184, 138, 59, 0.6)
                `;
                e.currentTarget.style.border = '3px solid var(--paper-gold, #b88a3b)';
            }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = face.transform;
                e.currentTarget.style.boxShadow = `
                  0 6px 24px rgba(91, 70, 44, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3),
                  inset 0 -1px 0 rgba(139, 104, 70, 0.15),
                  0 0 0 1px rgba(255, 248, 234, 0.2)
                `;
                e.currentTarget.style.border = '2px solid var(--ui-border-strong, rgba(139, 104, 70, 0.5))';
            }} onClick={() => handleFaceClick(index)}>
              
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `
                  radial-gradient(circle at 20% 30%, rgba(184, 138, 59, 0.03) 2px, transparent 2px),
                  radial-gradient(circle at 80% 70%, rgba(91, 70, 44, 0.02) 1px, transparent 1px),
                  linear-gradient(45deg, transparent 49%, rgba(139, 104, 70, 0.03) 50%, transparent 51%)
                `,
                backgroundSize: '100px 100px, 150px 150px, 20px 20px',
                opacity: 0.6,
                pointerEvents: 'none',
            }}/>
              
              
              <div style={{
                textAlign: 'center',
                padding: '24px',
                transform: 'rotateX(0deg) rotateY(0deg)',
                transformStyle: 'preserve-3d',
                position: 'relative',
                zIndex: 1,
            }}>
                <div style={{
                fontSize: 28,
                fontWeight: 800,
                color: 'var(--paper-brown, #8b6846)',
                marginBottom: 8,
                fontFamily: '"KaiTi", "STKaiti", "Noto Serif SC", serif',
                lineHeight: 1.3,
                transform: 'translateZ(20px)',
                textShadow: '0 2px 4px rgba(91, 70, 44, 0.1)',
                letterSpacing: '0.05em',
            }}>
                  {face.title}
                </div>
                <div style={{
                fontSize: 13,
                color: 'var(--paper-muted, #8f7556)',
                opacity: 0.7,
                transform: 'translateZ(10px)',
                letterSpacing: '0.1em',
                fontWeight: 500,
                marginTop: 8,
            }}>
                  点击查看详情
                </div>
              </div>
              
              
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                opacity: 0.5,
                pointerEvents: 'none',
            }}/>
            </div>))}
        </div>

      </div>

      
      <div onClick={handleStatusClick} style={{
            marginTop: 100,
            fontSize: 13,
            color: 'var(--paper-muted, #8f7556)',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            letterSpacing: '0.1em',
            padding: '8px 16px',
            background: 'rgba(139, 104, 70, 0.04)',
            borderRadius: '20px',
            border: '1px solid rgba(139, 104, 70, 0.12)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
        }} onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(139, 104, 70, 0.08)';
            e.currentTarget.style.border = '1px solid rgba(139, 104, 70, 0.2)';
        }} onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(139, 104, 70, 0.04)';
            e.currentTarget.style.border = '1px solid rgba(139, 104, 70, 0.12)';
        }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 14 }}>🖱️</span>
          <span>拖拽旋转</span>
        </span>
        <span style={{ fontSize: 10, opacity: 0.5 }}>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 14 }}>{autoRotate ? '🔄' : '⏸️'}</span>
          <span>{autoRotate ? '自动旋转中' : '旋转暂停'}</span>
        </span>
      </div>

      
      {showModal && modalContent && (<div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                background: 'rgba(91, 70, 44, 0.4)',
                backdropFilter: 'blur(8px)',
                animation: 'fadeIn 0.3s ease',
            }}>
          <div style={{
                position: 'relative',
                width: '90%',
                maxWidth: '600px',
                background: 'var(--ui-bg-strong, rgba(255, 248, 234, 0.93))',
                border: '1px solid var(--ui-border-strong, rgba(139, 104, 70, 0.4))',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(91, 70, 44, 0.25)',
                padding: '32px',
                animation: 'slideUp 0.4s ease',
            }}>
            
            <button onClick={handleCloseModal} style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '1px solid var(--ui-border, rgba(139, 104, 70, 0.24))',
                background: 'var(--paper-base, #f7f1e3)',
                color: 'var(--paper-brown, #8b6846)',
                fontSize: 20,
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
            }} onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--paper-brown, #8b6846)';
                e.currentTarget.style.color = 'var(--paper-base, #f7f1e3)';
                e.currentTarget.style.transform = 'rotate(90deg)';
            }} onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--paper-base, #f7f1e3)';
                e.currentTarget.style.color = 'var(--paper-brown, #8b6846)';
                e.currentTarget.style.transform = 'rotate(0deg)';
            }}>
              ×
            </button>

            
            <div style={{
                marginBottom: 24,
                paddingBottom: 20,
                borderBottom: '1px solid var(--ui-border, rgba(139, 104, 70, 0.24))',
            }}>
              <h3 style={{
                fontSize: 24,
                fontWeight: 700,
                color: 'var(--paper-brown, #8b6846)',
                margin: 0,
                marginBottom: 8,
                fontFamily: '"KaiTi", "STKaiti", "Noto Serif SC", serif',
            }}>
                {modalContent.title}
              </h3>
              <div style={{
                fontSize: 12,
                color: 'var(--paper-muted, #8f7556)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
            }}>
                Architectural Feature Details
              </div>
            </div>

            <div style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: 'var(--paper-ink, #5b4631)',
                marginBottom: 32,
                whiteSpace: 'pre-line',
            }}>
              {modalContent.description}
            </div>


            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 24,
            }}>
              <button onClick={handleCloseModal} style={{
                padding: '10px 24px',
                background: 'var(--paper-base, #f7f1e3)',
                border: '1px solid var(--paper-brown, #8b6846)',
                borderRadius: '8px',
                color: 'var(--paper-brown, #8b6846)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.05em',
            }} onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--paper-brown, #8b6846)';
                e.currentTarget.style.color = 'var(--paper-base, #f7f1e3)';
            }} onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--paper-base, #f7f1e3)';
                e.currentTarget.style.color = 'var(--paper-brown, #8b6846)';
            }}>
                关闭窗口
              </button>
            </div>
          </div>
        </div>)}

      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .cube-container {
            width: 280px !important;
            height: 280px !important;
          }
          
          .cube-face {
            width: 280px !important;
            height: 280px !important;
          }
          
          .cube-title {
            font-size: 18px !important;
          }
        }
        
        @media (max-width: 480px) {
          .cube-container {
            width: 240px !important;
            height: 240px !important;
          }
          
          .cube-face {
            width: 240px !important;
            height: 240px !important;
          }
          
          .cube-title {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>);
}
