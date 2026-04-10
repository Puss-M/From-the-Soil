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
    
    // 重庆坐标（作为中心点，用于固定地图位置）
    const chongqingCoords = [106.55, 29.57];
    // 当前驿坐标
    const stationCoords = [${stations[station][0]}, ${stations[station][1]}];
    
    var mapOption = {
      geo: {
        map: 'china',
        roam: false,
         zoom: 2.0,
         center: [103.8, 36.5],
         layoutCenter: ['50%', '50%'],
         layoutSize: '105%',
        itemStyle: {
          areaColor: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            colorStops: [
              {offset: 0, color: '#D2AB72'},
              {offset: 0.5, color: '#E0BC85'},
              {offset: 1, color: '#C49A5F'}
            ]
          },
          borderColor: 'rgba(255,255,255,0.8)',
          borderWidth: 1.2
        },
        emphasis: {
          itemStyle: {
            areaColor: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                {offset: 0, color: '#C49A5F'},
                {offset: 0.5, color: '#D2AB72'},
                {offset: 1, color: '#B6894D'}
              ]
            }
          }
        },
        label: {
          show: false
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
        type: 'scatter',
        coordinateSystem: 'geo',
        symbolSize: 20,
        data: [
          {
            name: '${station.replace('驿', '')}',
            value: stationCoords.concat([100])
          }
        ],
        itemStyle: {
          color: '#ff6b6b',
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          scale: true,
          scaleSize: 5,
          label: {
            show: true,
            formatter: '${station.replace('驿', '')}',
            position: 'right',
            color: '#ff6b6b',
            fontSize: 14,
            fontWeight: 'bold',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: [4, 8],
            borderRadius: 4,
            borderColor: '#d4a017',
            borderWidth: 1
          }
        }
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
            fill: 'rgba(255,255,255,0.7)',
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