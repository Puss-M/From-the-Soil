# 🏛️ 北京四合院文化数据大屏

> 计算机设计大赛 - 数据可视化作品  
> 1:1 复刻中国风数据大屏，展示北京四合院文化遗产数据

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.0-green.svg)
![ECharts](https://img.shields.io/badge/ECharts-5.x-red.svg)

## 📸 效果预览

**设计尺寸**: 1920×1080px  
**布局方式**: 固定绝对定位  
**适配方式**: 等比缩放

### 布局结构
```
┌─────────────────────────────────────────────────────┐
│                   北京四合院 ⚙                      │
├──────────┬────────────────────┬─────────────────────┤
│ 温雨双折图 │    分布地数据(6格)   │  分类图 │ 防御雷达  │
├──────────┤                    ├─────────────────────┤
│ 建材环形图 │                    │    历史进程图        │
│          │     分布地图        ├─────────────────────┤
├──────────┤                    │                     │
│ 构造桑基图 │                    │                     │
│          ├────────────────────┤   分布词云图         │
│          │   保护状况 [3仪表]  │                     │
└──────────┴────────────────────┴─────────────────────┘
```

## ✨ 核心特性

### 🎨 视觉设计
- ✅ 中国水墨画风格背景
- ✅ 土黄/青蓝/赤红配色方案
- ✅ 玻璃拟态半透明面板
- ✅ 楷体标题 + 微软雅黑正文
- ✅ 数据发光特效

### 📊 图表类型
1. **温雨双折图** - 柱状图+折线图组合
2. **分类气泡图** - 散点图展示四合院类型
3. **防御雷达图** - 五维性能指标
4. **建材玫瑰图** - 环形玫瑰图
5. **分布地图** - 中国地图+特效标记
6. **历史时间轴** - 渐变色时间线
7. **构造桑基图** - 建筑结构流向
8. **保护仪表盘** - 半圆仪表盘×3
9. **分布词云图** - 彩色词云

### 🛠️ 技术栈
- **前端框架**: 原生 JavaScript + jQuery
- **图表引擎**: ECharts 5.x
- **词云插件**: ECharts WordCloud 2.x
- **地图数据**: China GeoJSON
- **样式**: CSS3 (Grid/Flexbox/Transform)

## 🚀 快速开始

### 方法一：直接打开
```bash
# Windows
双击 index.html

# macOS/Linux
open index.html
```

### 方法二：本地服务器（推荐）
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

然后访问 `http://localhost:8000`

### 方法三：VS Code Live Server
1. 安装 "Live Server" 插件
2. 右键 `index.html` → "Open with Live Server"

## 📁 项目结构

```
北京四合院/
│
├── index.html              # 主页面入口
│
├── css/
│   └── comon0.css         # 全局样式 (布局+面板+图表)
│
├── js/
│   ├── js.js              # 图表初始化主脚本
│   ├── china.js           # 中国地图GeoJSON数据
│   ├── jquery.js          # jQuery 3.x
│   ├── echarts.min.js     # ECharts 5.x (CDN备用)
│   └── echarts-wordcloud.min.js  # 词云插件
│
├── 风物志背景.jpeg         # 水墨画背景图
│
└── 文档/
    ├── 使用说明.md         # 详细使用文档
    ├── 修改对照表.md       # 版本改动记录
    └── README.md          # 本文档
```

## 🎯 数据配置

### 修改核心指标
编辑 `index.html` 第 31-36 行：
```html
<div class="metric-value">12.4868</div>  <!-- 年平均气温 -->
<div class="metric-value">574</div>      <!-- 年降水量 -->
<div class="metric-value">1.0141</div>   <!-- 年平均水蒸气压 -->
```

### 修改图表数据
编辑 `js/js.js`：
```javascript
// 温雨双折图 - 第 45 行
data: [3, 5, 8, 18, 35, 78, 173, 151, 58, 28, 8, 2]

// 词云数据 - 第 221 行
data: [
  { name: '东城区', value: 120 },
  { name: '西城区', value: 110 },
  // 添加更多词汇
]

// 仪表盘数值 - 第 237 行
const values = [92, 48, 23];
```

### 调整配色
编辑 `js/js.js` 第 2-7 行：
```javascript
const themeText = '#8b5b1f';   // 主文本颜色
const chartBlue = '#34c0d5';   // 蓝色系
const chartGold = '#d3a657';   // 金色系
const chartRed = '#db5477';    // 红色系
```

## 🔧 自定义布局

### 修改模块位置
编辑 `css/comon0.css` 第 153-161 行：
```css
.panel-line { 
  left: 20px; 
  top: 48px; 
  width: 390px; 
  height: 220px; 
}
/* 其他模块同理 */
```

### 调整面板样式
```css
.panel {
  border: 2px solid rgba(139, 91, 31, 0.35);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(5px);
}
```

## 🎨 主题色彩参考

| 颜色名称 | 十六进制 | RGB | 用途 |
|---------|---------|-----|------|
| 深棕色 | #6b4423 | 107,68,35 | 标题文字 |
| 文本棕 | #8b5b1f | 139,91,31 | 正文文字 |
| 青蓝色 | #34c0d5 | 52,192,213 | 柱状图/进度条 |
| 金黄色 | #d3a657 | 211,166,87 | 折线图/雷达图 |
| 赤红色 | #db5477 | 219,84,119 | 重点数据 |
| 发光蓝 | #2da9ff | 45,169,255 | 核心指标 |

## 📐 坐标速查表

| 模块 | left | top | width | height |
|------|------|-----|-------|--------|
| 温雨双折图 | 20 | 48 | 390 | 220 |
| 分布地数据 | 440 | 106 | 600 | 160 |
| 分类+防御 | 1070 | 48 | 720 | 220 |
| 建材环形图 | 20 | 298 | 390 | 240 |
| 分布地图 | 440 | 298 | 600 | 370 |
| 历史进程图 | 1070 | 298 | 720 | 170 |
| 构造桑基图 | 20 | 568 | 390 | 314 |
| 保护状况 | 440 | 698 | 600 | 184 |
| 分布词云图 | 1070 | 498 | 720 | 384 |

## ⚙️ 浏览器兼容性

| 浏览器 | 版本 | 状态 |
|--------|------|------|
| Chrome | 90+ | ✅ 完全支持 |
| Edge | 90+ | ✅ 完全支持 |
| Firefox | 88+ | ✅ 完全支持 |
| Safari | 14+ | ⚠️ 部分特效不同 |
| Opera | 76+ | ✅ 完全支持 |
| IE 11 | - | ❌ 不支持 |

## 🐛 常见问题

### Q1: 背景图片不显示？
**A**: 检查路径是否正确，确保 `风物志背景.jpeg` 在项目根目录。

### Q2: 地图不显示？
**A**: 确保 `js/china.js` 已加载，打开控制台查看是否有报错。

### Q3: 词云不显示？
**A**: 检查是否引入 `echarts-wordcloud.min.js`，建议使用CDN：
```html
<script src="https://cdn.jsdelivr.net/npm/echarts-wordcloud@2/dist/echarts-wordcloud.min.js"></script>
```

### Q4: 布局错乱？
**A**: 
1. 确保浏览器缩放为100%
2. 按 `Ctrl + F5` 强制刷新
3. 清除浏览器缓存

### Q5: 图表显示不完整？
**A**: 检查容器高度是否足够，建议不低于 150px。

## 📊 性能优化建议

### 数据量优化
- 词云词汇控制在 20-30 个
- 桑基图节点控制在 10 个以内
- 地图散点控制在 5 个以内

### 加载优化
```html
<!-- 使用CDN加速 -->
<script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>

<!-- 图片压缩 -->
背景图建议压缩至 500KB 以内
```

### 渲染优化
```javascript
// 图表按需加载
window.addEventListener('load', function() {
  initLineChart();
  setTimeout(initMapChart, 100);
  setTimeout(initWordCloud, 200);
});
```

## 🎓 学习资源

- [ECharts 官方文档](https://echarts.apache.org/zh/index.html)
- [ECharts 配置项手册](https://echarts.apache.org/zh/option.html)
- [ECharts 示例库](https://echarts.apache.org/examples/zh/index.html)
- [CSS Transform 参考](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)

## 📄 开源协议

本项目采用 MIT 协议开源。

```
MIT License

Copyright (c) 2026 计算机设计大赛作品

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

## 👥 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交规范
```bash
# 功能添加
feat: 添加新的图表类型

# Bug修复
fix: 修复地图不显示的问题

# 样式调整
style: 优化面板边框颜色

# 文档更新
docs: 更新使用说明
```

## 📞 联系方式

- **项目**: 北京四合院文化数据大屏
- **用途**: 计算机设计大赛 - 数据可视化
- **更新**: 2026-03-23

## ⭐ Star History

如果这个项目对你有帮助，欢迎 Star！

---

**Enjoy Coding! 🚀**
