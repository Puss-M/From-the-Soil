# From the Soil · 乡土建筑方言

[![CI](https://github.com/Puss-M/From-the-Soil/actions/workflows/ci.yml/badge.svg)](https://github.com/Puss-M/From-the-Soil/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg?logo=nextdotjs)](package.json)
[![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-R3F-000?logo=threedotjs)](package.json)

名字取自费孝通《乡土中国》（*From the Soil*）。用交互式 3D 探索中国乡土建筑的"方言"—— 四合院的空间秩序、民居之间的形态同源、气候对建筑形制的影响。

## 展示模块

- 🏛 **四合院（siheyun）**：热点（hotspot）导览式空间漫游
- 🧬 **形态同源（homology）**：不同民居间的形制类比与演化
- 🌦 **气候影响（ClimateEffects）**：环境因素如何塑造建筑形态
- 🏠 **形变演示（MorphingHouse）**：建筑形体的连续渐变
- 📜 **卷轴叙事（scroll-demo）**：滚动驱动的长卷式叙事
- 🖥 **大屏模式（bigscreen）**：展览用大屏布局

## 技术栈

Next.js 16 · TypeScript · React Three Fiber（`@react-three/drei`）· GSAP 式滚动动画 · 部署于 Netlify（见 `netlify.toml`）

## 快速开始

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 生产构建（CI 会自动执行）
```

## License

[MIT](LICENSE)
