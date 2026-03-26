# 项目架构说明

## 1. 项目定位

该项目是一个基于 Next.js App Router 构建的单页式沉浸交互应用，主题为“从土而生”，核心目标是通过地图、建筑模型、气候参数和交互式漫游，展示中国传统民居与地域气候之间的适应性关系。

从技术结构上看，它不是一个传统的多页面网站，而是一个由全局状态驱动的“场景切换型应用”。用户进入系统后，会在同一个全屏容器中依次经历：

1. 首页引导
2. 全国地图选点
3. 驿站详情
4. 建筑形态过渡
5. 建筑漫游探索

也就是说，整个项目的核心不是 URL 路由，而是“场景状态机 + 全屏可视化渲染”。

---

## 2. 技术栈分层

项目当前的核心技术分工如下：

- `Next.js`：负责应用壳层、页面入口、全局布局与静态资源管理
- `Zustand`：负责全局状态管理，驱动场景切换与气候/路线/收集状态
- `Framer Motion`：负责 2D 页面转场、标题动画、首页入场和离场动画
- `React Three Fiber + Drei`：负责 3D 建筑、气候粒子、漫游与过渡场景
- `ECharts`：负责全国地图视图与驿站分布展示
- `TypeScript`：提供领域类型定义和组件类型约束

从架构角度看，这个项目实际上由两套渲染系统组成：

- 一套是 2D 场景系统：首页、地图、详情页、HUD 面板
- 一套是 3D 场景系统：建筑模型、气候特效、形态演化、漫游交互

两者之间通过 Zustand 中的全局状态进行衔接。

---

## 3. 应用壳层结构

### 3.1 根布局

根布局位于 [src/app/layout.tsx](/D:/新建文件夹/桌面/计算机设计大赛/From-the-Soil-main/src/app/layout.tsx)。

它的职责主要有三项：

1. 加载全局字体
2. 引入全局样式
3. 作为 App Router 的统一外壳

项目在这里通过 `next/font` 注入了：

- `Noto Serif SC`
- `Noto Sans SC`
- `JetBrains Mono`

这些字体变量会在后续所有场景中复用。全局 body 还设置了默认字体和抗锯齿效果。

### 3.2 全局样式

全局样式定义在 [src/app/globals.css](/D:/新建文件夹/桌面/计算机设计大赛/From-the-Soil-main/src/app/globals.css)。

这里主要承担：

- 全局背景色、前景色、主题色变量定义
- 全屏布局基础样式
- 滚动条与文字选中样式
- 若干全局动画
- 一些移动端辅助工具类

其中一个重要点是：`body` 设置了 `overflow: hidden`。这说明整个项目从一开始就是按“全屏展演应用”而不是“滚动文档网站”来设计的。

---

## 4. 页面入口与场景路由

页面入口位于 [src/app/page.tsx](/D:/新建文件夹/桌面/计算机设计大赛/From-the-Soil-main/src/app/page.tsx)。

这个文件在整个项目里承担的是“场景路由器”的角色。

它会从 Zustand 中读取 `phase`，然后根据当前阶段决定渲染哪个全屏组件：

- `landing` -> `LandingPage`
- `map` -> `MapScene`
- `detail` -> `StationDetail`
- `transition` -> `TransitionScene`
- `roaming` -> `RoamingScene`

同时，这里用 `AnimatePresence` 和统一的 `sceneVariants` 给所有场景增加了统一的进入/退出过渡。

因此可以把 `page.tsx` 理解为：

- 它不是业务场景本身
- 它是整个交互体验的“总调度器”

---

## 5. 全局状态架构

全局状态集中在 [src/store/useStore.ts](/D:/新建文件夹/桌面/计算机设计大赛/From-the-Soil-main/src/store/useStore.ts)。

这是项目的核心控制中枢。当前 store 主要管理五类状态。

### 5.1 场景状态

- `phase`
- `setPhase`

这组状态控制当前用户处于哪个主场景中，是整个应用最上层的流程开关。

### 5.2 驿站与路线状态

- `selectedStation`
- `setSelectedStation`
- `startStation`
- `endStation`
- `setRoute`

这部分状态支撑“单驿站查看”和“两地路线对比”两种核心交互模式。

### 5.3 过渡进度状态

- `transitionProgress`
- `setTransitionProgress`

这表示建筑形态演化的进度，取值范围为 `0 ~ 1`。在过渡场景中，用户拖动滑块时，本质上就是在更新这个值。

### 5.4 当前气候状态

- `currentClimate`
- `updateClimateFromProgress`
- `setClimateParam`
- `directControl`

这是项目里最有价值的一组状态，因为它把“气候”从静态说明文本变成了实时驱动视觉和建筑表现的输入参数。

`updateClimateFromProgress()` 会根据起点驿站、终点驿站和当前进度，对以下参数做线性插值：

- 降雨量 `rainfall`
- 湿度 `humidity`
- 温度 `temperature`
- 海拔 `altitude`
- 日照 `sunlight`
- 防御性 `defense`

也就是说，建筑不是按固定脚本切换，而是由一个连续变化的气候中间态来驱动。

### 5.5 收集与视角状态

- `collectedItems`
- `collectItem`
- `viewMode`
- `toggleViewMode`

这部分支撑漫游模式下的“图谱收集”和观察视角切换。

---

## 6. 领域模型与数据层

项目的类型定义在 [src/types/index.ts](/D:/新建文件夹/桌面/计算机设计大赛/From-the-Soil-main/src/types/index.ts)。

其中最核心的类型是 `Station`。它同时包含：

- 驿站身份
- 中英文名称
- 地图坐标
- 3D 空间坐标
- 气候数据
- 建筑基因
- 描述文案
- 区域信息
- 模型路径

这说明项目中的“驿站”不是单一含义的数据对象，而是一个复合领域实体。它同时是：

- 地图上的节点
- 一组气候样本
- 一个建筑原型
- 一个三维模型入口
- 一个详情页信息索引键

### 6.1 主要数据文件

`src/data/` 目录存放静态内容数据，按主题拆分：

- [src/data/stations.ts](/D:/新建文件夹/桌面/计算机设计大赛/From-the-Soil-main/src/data/stations.ts)：驿站主数据、模型路径、气候参数
- `stationDetails.ts`：建筑档案详细数据
- `climateDetails.ts`：气候图表相关数据
- `heritageData.ts`：非遗内容
- `decorationData.ts`：装饰构件内容

这种拆分方式的优点是：

- 场景组件只负责展示与交互
- 内容本身独立维护
- 后续扩展新驿站时，修改路径比较清晰

### 6.2 数据层的派生逻辑

[src/data/stations.ts](/D:/新建文件夹/桌面/计算机设计大赛/From-the-Soil-main/src/data/stations.ts) 中除了静态数据，还定义了两个领域推导函数：

- `calculateMutationIndex()`
- `getCrossedClimateBoundaries()`

这两个函数不是简单显示字段，而是在“气候差异 -> 建筑变化提示”之间加入了一层领域解释逻辑。

这一点很重要，因为它意味着项目不只是展示数据，而是在尝试表达一种“建筑如何因气候而异化”的叙事机制。

---

## 7. 场景架构

项目当前由五个一级场景构成，每个场景都有非常明确的角色。

### 7.1 首页场景

文件： [src/components/LandingPage.tsx](/D:/新建文件夹/桌面/计算机设计大赛/From-the-Soil-main/src/components/LandingPage.tsx)

首页的职责比较单纯：

- 提供项目世界观与视觉开场
- 通过动画建立氛围
- 在用户点击 CTA 后进入地图场景

它本身基本不参与业务数据计算，只在最后调用 `setPhase('map')`。

因此首页在架构上是一个相对独立的“视觉引导壳层”。

### 7.2 地图场景

文件： [src/components/map/MapScene.tsx](/D:/新建文件夹/桌面/计算机设计大赛/From-the-Soil-main/src/components/map/MapScene.tsx)

地图场景使用 ECharts 渲染中国地图，承担以下职责：

- 加载并注册 `china.json`
- 显示所有驿站节点
- 提供悬停信息卡
- 提供路线规划面板
- 进入详情页或过渡场景

从交互定位来看，这是整个项目的“空间入口层”。

用户在这里完成两个动作之一：

1. 点击节点，查看某个驿站详情
2. 设定路线，进入建筑形态过渡

不过需要特别指出一个架构缺口：

虽然 store 中已经定义了 `setRoute(start, end)`，后续的过渡场景、漫游场景也都依赖 `startStation` 和 `endStation`，但当前代码里并没有看到真正调用 `setRoute()` 的位置。这意味着“路线规划”这条主链路在状态设计上已经存在，但输入端还没有完整接上。

这是当前项目最明显的结构性缺口之一。

### 7.3 驿站详情场景

文件： [src/components/detail/StationDetail.tsx](/D:/新建文件夹/桌面/计算机设计大赛/From-the-Soil-main/src/components/detail/StationDetail.tsx)

这个场景更像一个“专题档案页”，结构上采用了典型的三段式布局：

- 顶部导航栏
- 中部内容区
- 底部分页导航

中部内容区又分为三个 Tab：

- `model`：3D 模型查看
- `info`：建筑档案与非遗信息
- `charts`：数据可视化与装饰信息

详情页的特点是：

- 它不再强调空间探索
- 而是强调内容组织与知识展示

因此它是项目中最偏“信息架构页面”的部分。

### 7.4 过渡场景

文件： [src/components/transition/TransitionScene.tsx](/D:/新建文件夹/桌面/计算机设计大赛/From-the-Soil-main/src/components/transition/TransitionScene.tsx)

这个场景的核心作用是：把“起点民居”和“终点民居”之间的变化过程可视化。

它采用非常清晰的双层结构：

- Layer 0：全屏 3D Canvas
- Layer 1：固定 HUD 浮层

这种设计在文件内部也有明确注释，说明作者是按“舞台 + 仪表盘”的思路搭建的。

这个场景的主要组成有：

- `MorphingHouse`
- `DashboardHUD`
- `NarratorPanel`
- 底部进度滑块
- 返回地图和进入漫游按钮

它的核心机制是：

1. 用户调整 `transitionProgress`
2. store 根据进度插值出 `currentClimate`
3. `MorphingHouse` 根据状态切换模型透明度和地面表现
4. 旁白与仪表盘同步展示演化过程

因此，这里实际上是“路线对比”和“气候驱动形态变化”的主展示场景。

### 7.5 漫游场景

文件： [src/components/roaming/RoamingScene.tsx](/D:/新建文件夹/桌面/计算机设计大赛/From-the-Soil-main/src/components/roaming/RoamingScene.tsx)

漫游场景沿用了和过渡场景一致的结构：

- Layer 0：Three.js 舞台
- Layer 1：HUD 操控层

不同的是，它更强调“探索”和“互动”，而不是“对比与推演”。

它在 3D 场景中加入了：

- `ClimateEffects`
- `ControlPanel`
- `InteractiveElement`
- `CollectionDock`

这使得漫游模式具备三类体验：

1. 看建筑
2. 调参数
3. 收集知识构件

从系统定位上看，漫游场景是项目里最接近“交互展览”体验的部分。

---

## 8. 3D 渲染核心结构

### 8.1 MorphingHouse：建筑形态核心引擎

文件： [src/components/MorphingHouse.tsx](/D:/新建文件夹/桌面/计算机设计大赛/From-the-Soil-main/src/components/MorphingHouse.tsx)

这是项目最关键的 3D 组件之一。

它从 store 中读取：

- `startStation`
- `endStation`
- `transitionProgress`
- `phase`
- `currentClimate`

然后完成两件事：

1. 决定当前显示哪个模型
2. 决定当前地面环境是潮湿还是干燥

其模型策略如下：

- 在 `transition` 阶段，起点和终点模型交叉渐隐渐显
- 在其他阶段，只显示终点模型

其环境策略如下：

- 如果降雨量较高，渲染带反射感的湿润地面
- 如果降雨量较低，渲染干燥土地

因此 `MorphingHouse` 可以被理解为：

“把路线、气候和建筑模型绑定到一起的中枢可视化引擎”

### 8.2 ModelViewer：单模型展示器

文件： [src/components/detail/ModelViewer.tsx](/D:/新建文件夹/桌面/计算机设计大赛/From-the-Soil-main/src/components/detail/ModelViewer.tsx)

这个组件与 `MorphingHouse` 的功能不同。

它的定位是：

- 只展示单个驿站模型
- 提供旋转、缩放、观赏
- 更接近“展台式模型查看器”

所以这里的架构分工是合理的：

- `MorphingHouse` 负责“比较与演化”
- `ModelViewer` 负责“单体展示”

### 8.3 ClimateEffects：气候特效层

文件： [src/components/ClimateEffects.tsx](/D:/新建文件夹/桌面/计算机设计大赛/From-the-Soil-main/src/components/ClimateEffects.tsx)

这个组件根据当前气候状态生成环境粒子效果：

- 降雨高时，显示雨滴系统
- 降雨低时，显示尘埃系统

这里采用了 `Instances` 批量实例化几何体，并且在模块级预生成粒子数据，这在性能上是合理的。

其架构价值在于：它让“气候”变成了空间中的可感知现象，而不是一组数字说明。

### 8.4 InteractiveElement：收集构件交互体

文件： [src/components/roaming/InteractiveElement.tsx](/D:/新建文件夹/桌面/计算机设计大赛/From-the-Soil-main/src/components/roaming/InteractiveElement.tsx)

这个组件承担“3D 对象 + 2D 说明面板 + 收集操作”的桥接角色。

每个构件会：

- 以不同类别的程序化几何体呈现
- 提供悬停说明
- 点击展开详情
- 点击后收录进图谱

它是漫游场景“展项化”体验的重要组成部分。

---

## 9. HUD 与 Canvas 的分层模式

在 `TransitionScene` 和 `RoamingScene` 中，项目采用了非常统一的 HUD 分层策略：

- 底层是全屏 3D Canvas
- 上层是固定定位的 HUD Overlay
- Overlay 默认 `pointer-events: none`
- 各操作面板单独开启 `pointer-events: auto`

这种模式的好处是：

- 空白区域不会挡住 Three.js 交互
- HUD 布局可以继续按普通 DOM 方式组织
- 视觉上像在“舞台”上叠加一层操作界面

这是整个项目在交互结构上最成熟的一部分设计。

---

## 10. 详情页的信息架构

详情页在架构上是一层“视图聚合器”。

文件： [src/components/detail/StationDetail.tsx](/D:/新建文件夹/桌面/计算机设计大赛/From-the-Soil-main/src/components/detail/StationDetail.tsx)

它会以 `selectedStation.id` 为主键，从多个数据源拼接内容：

- `stationDetails[sid]`
- `climateDetails[sid]`
- `heritageData[sid]`
- `decorationData[sid]`

然后把这些内容分发给多个子组件：

- `StationHeader`
- `InfoCards`
- `ClimateCharts`
- `DecorationPanel`
- `ModelViewer`

因此详情页的本质是：

- 不是单一组件负责所有展示
- 而是一个基于驿站 ID 的内容装配层

这也意味着，如果未来增加新的驿站详情内容，最好继续遵守这种“数据独立、展示组合”的结构，而不是把内容写死在页面组件里。

---

## 11. 当前架构的优点

### 11.1 场景边界清晰

每个主场景都有明确职责，首页、地图、详情、过渡、漫游之间没有严重职责重叠。

### 11.2 数据与组件分离较好

静态数据集中在 `src/data/`，组件主要负责交互与渲染，这对后续维护是有利的。

### 11.3 全局状态结构直观

Zustand store 虽然不小，但逻辑清楚，用户行为和视觉状态之间的关系也比较容易理解。

### 11.4 3D 与 HUD 的协作模式成熟

Three.js 场景与 DOM HUD 的上下层组织方式一致，说明项目已经形成了一套稳定的交互搭建方法。

### 11.5 “气候驱动建筑”的概念落实到了代码层

`currentClimate` 不是只用于展示图表，而是真正参与了：

- 地面环境
- 气候粒子
- 建筑过渡逻辑
- 参数控制

这一点让项目的主题表达具有技术支撑，而不是只停留在文案层面。

---

## 12. 当前架构的主要问题

### 12.1 路线输入链路不完整

这是当前最明显的问题。

store 已经为路线切换、气候插值、建筑过渡准备好了完整结构，但地图场景没有看到真正设置 `startStation` 和 `endStation` 的入口逻辑。这会导致：

- 路线规划面板存在
- 过渡场景存在
- 漫游场景也依赖终点驿站
- 但前面的路线选择流程并没有完全打通

### 12.2 Store 承担职责偏多

当前 Zustand store 同时管理：

- 场景导航
- 路线状态
- 气候模拟
- 收集系统
- 视角模式

对于 Demo 项目这是可接受的，但如果后续继续扩展，建议拆分为多个 slice，以降低耦合度。

### 12.3 存在未完全接入的组件方向

例如 `StationNode.tsx`、`RouteVisualizer.tsx` 显示项目可能曾考虑过三维地图节点路线方案，但当前主地图场景使用的是 ECharts 方案。这说明代码中有部分方向仍处于“保留但未纳入主流程”的状态。

### 12.4 控制模式切换语义较强耦合

`directControl` 会影响气候是来自手动控制还是来自路线插值，这种设计本身没问题，但它把“数据来源”和“交互模式”耦合在一起，后续扩展容易出现状态不一致。

---

## 13. 对整个项目的结构性理解

如果从宏观层面总结，这个项目可以被理解为：

### 一条主叙事链

“从地理位置出发，进入气候差异，再映射到建筑形态，最后沉浸式观察建筑构件与文化信息。”

### 一套状态机驱动的场景系统

- `page.tsx` 负责选择当前场景
- `useStore.ts` 负责记录当前处于哪一阶段、选中了什么、气候如何变化

### 两套渲染系统并行协作

- 2D 系统负责地图、文本、图表、HUD、过渡动画
- 3D 系统负责建筑模型、气候效果、漫游交互

### 一个贯穿全局的核心主题变量

`currentClimate`

它是整个项目里最重要的中间层状态。因为它把：

- 驿站数据
- 路线进度
- 建筑表现
- 环境效果

连接成了一个连续系统。

---

## 14. 一句话总结

这个项目的本质，是一个以 Zustand 为状态核心、以 Next.js 为应用壳、以 Framer Motion 和 React Three Fiber 为双重渲染引擎的“场景式建筑气候叙事系统”。

它最有价值的地方，不是单独的地图或模型，而是试图把“气候如何塑造建筑”这件事，拆解成可切换、可比较、可演化、可漫游的交互体验。
