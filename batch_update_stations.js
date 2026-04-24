const fs = require('fs');
const path = require('path');

// 所有驿对应的坐标
const stations = {
  '凤凰驿': [109.59, 28.32],
  '北京驿': [116.46, 39.92],
  '吐鲁番驿': [89.19, 42.91],
  '喀什驿': [75.99, 39.47],
  '大理驿': [100.23, 25.60],
  '威海驿': [122.11, 37.51],
  '广州驿': [113.23, 23.16],
  '延安驿': [109.47, 36.59],
  '徽州驿': [118.32, 29.72],
  '拉萨驿': [91.11, 29.97],
  '永定驿': [116.78, 24.69],
  '版纳驿': [100.80, 22.01],
  '苏州驿': [120.62, 31.32],
  '草原驿': [116.05, 43.95]
};

const basePath = 'public/fengwuzhi';

Object.keys(stations).forEach(station => {
  
  const filePath = path.join(basePath, station, 'index.html');
  console.log(`正在处理: ${filePath}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. 删除beijing_map.js引用
    content = content.replace(/<script src="js\/beijing_map.js"><\/script>\r?\n?/g, '');
    
    // 2. 替换地图容器
    content = content.replace(/<div id="chart-map-beijing"[^>]*><\/div>/g, '<div id="china-map-container" style="width: 100%; height: 100%;"></div>');
    
    // 3. 找到地图初始化部分并替换
    const mapCode = `
  // 加载中国地图数据
   $.getJSON('/china.json', function (chinaJson) {
    echarts.registerMap('china', chinaJson);
    
    // 初始化中国地图
    var chinaMapChart = echarts.init(document.getElementById('china-map-container'));
    
    // 当前驿坐标
    const stationCoords = [${stations[station][0]}, ${stations[station][1]}];
    
    var mapOption = {
      backgroundColor: 'transparent',
      geo: {
        map: 'china',
        roam: false,
         zoom: 2.0,
         center: [103.8, 32.5],
         layoutCenter: ['50%', '50%'],
         layoutSize: '105%',
        label: {
          show: false,
          color: '#25180d',
          fontSize: 11,
          fontWeight: 600
        },
        itemStyle: {
          areaColor: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.8,
            colorStops: [
              { offset: 0, color: '#F0E2C5' },
              { offset: 0.5, color: '#E8D4A9' },
              { offset: 1, color: '#E6D0A7' }
            ]
          },
          borderColor: '#D4A017',
          borderWidth: 1.2,
          shadowColor: 'rgba(0, 0, 0, 0.06)',
          shadowBlur: 4
        },
        emphasis: {
          itemStyle: {
            areaColor: '#DBC496',
          },
          label: {
            show: true,
            color: '#1a0f06',
            fontSize: 12,
            fontWeight: 700
          }
        },
        regions: [{
          name: '南海诸岛',
          itemStyle: {
            opacity: 0
          },
          label: {
            show: false
          }
        }]
      },
      series: [{
        type: 'effectScatter',
        coordinateSystem: 'geo',
        symbolSize: 10,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke',
          scale: 3,
          period: 4
        },
        data: [
          {
            name: '${station.replace('驿', '')}',
            value: stationCoords.concat([100])
          }
        ],
        label: {
          show: true,
          formatter: '{b}',
          position: 'top',
          color: '#5a4d42',
          fontSize: 12,
          fontWeight: 'bold',
          distance: 5,
          backgroundColor: 'transparent',
          textBorderColor: 'transparent'
        },
        itemStyle: {
          color: '#8c221c',
          borderColor: '#ffffff',
          borderWidth: 1.5,
          shadowBlur: 4,
          shadowColor: 'rgba(0,0,0,0.2)'
        },
        emphasis: {
          itemStyle: {
            color: '#8c221c',
            shadowBlur: 8,
            shadowColor: 'rgba(140,34,28,0.28)'
          },
          scale: true
        },
        zlevel: 1
      }],
      tooltip: {
        show: false
      },
      // 审图号标注
      graphic: [
        {
          type: 'text',
          right: 10,
          bottom: 10,
          style: {
            text: '中国地图审图号：GS（2024）0650',
            fill: 'rgba(138,125,115,0.7)',
            fontSize: 10,
            fontFamily: 'Arial, sans-serif'
          }
        }
      ]
    };
    
    chinaMapChart.setOption(mapOption);
    
    // 窗口大小变化时重绘
    window.addEventListener('resize', function() {
      chinaMapChart.resize();
    });
  });
`;

    // 替换原有地图代码
    if (content.includes('initBeijingMap();')) {
      content = content.replace(/\s*if \(typeof initBeijingMap === 'function'\) {\s*initBeijingMap();\s*}/g, '');
    }
    
    // 在最后一个});前插入新地图代码
    const lastBracket = content.lastIndexOf('});');
    if (lastBracket > 0) {
      content = content.slice(0, lastBracket) + mapCode + '\n' + content.slice(lastBracket);
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ 完成: ${station}`);
  } catch (err) {
    console.log(`❌ 错误: ${station} - ${err.message}`);
  }
});

console.log('\n所有驿处理完成！');