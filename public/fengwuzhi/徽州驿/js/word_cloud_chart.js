 // 分布词云图 - 最终优化版本
// 要求：1.词云不要重叠 2.优化布局算法

function initWordCloudChart() {
    var container = document.getElementById('word-cloud-chart');
    if (!container) return;
    
    // 清空容器
    container.innerHTML = '';
    
    // 地名和权重数据 - 徽派民居分布
    var wordData = [
        { name: '安徽黄山', value: 42 },
        { name: '安徽宣城', value: 28 },
        { name: '江西婺源', value: 15 },
        { name: '安徽池州', value: 6 },
        { name: '浙江淳安', value: 4 },
        { name: '浙江衢州', value: 2.5 },
        { name: '安徽安庆', value: 1.2 },
        { name: '江西景德镇', value: 0.8 },
        { name: '江西上饶', value: 0.5 }
    ];
    
    // 颜色数组 - 使用不同颜色
    var colorArray = [
        'rgba(77, 171, 247, 0.9)',   // 蓝色
        'rgba(255, 107, 107, 0.9)',  // 红色
        'rgba(107, 207, 127, 0.9)',  // 绿色
        'rgba(255, 180, 0, 1)',      // 黄色（加深）
        'rgba(164, 99, 242, 0.9)',   // 紫色
        'rgba(6, 214, 160, 0.9)',    // 青色
        'rgba(239, 71, 111, 0.9)',   // 粉色
        'rgba(17, 138, 178, 0.9)',   // 深蓝
        'rgba(230, 100, 50, 1)',     // 橙色（加深）

        'rgba(157, 78, 221, 0.9)',   // 深紫
        'rgba(255, 89, 94, 0.9)',    // 亮红
        'rgba(25, 130, 196, 0.9)'    // 天蓝
    ];
    
    // 计算最大权重用于字体大小比例
    var maxValue = Math.max(...wordData.map(item => item.value));
    
    // 按权重排序（从大到小）
    wordData.sort(function(a, b) {
        return b.value - a.value;
    });
    
    // 容器尺寸
    var containerWidth = container.clientWidth;
    var containerHeight = container.clientHeight;
    
    // 创建词云元素数组
    var wordElements = [];
    
    // 创建词云元素
    wordData.forEach(function(item, index) {
        // 创建词云项
        var wordElement = document.createElement('div');
        wordElement.className = 'word-cloud-item';
        wordElement.textContent = item.name;
        
        // 计算字体大小（根据权重）
        var fontSize = 16 + (item.value / maxValue) * 28; // 16-44px范围
        var fontWeight = 500 + (item.value / maxValue) * 300; // 500-800范围
        
        // 设置样式
        wordElement.style.position = 'absolute';
        wordElement.style.color = colorArray[index % colorArray.length];
        wordElement.style.fontSize = fontSize + 'px';
        wordElement.style.fontWeight = fontWeight;
        wordElement.style.fontFamily = '微软雅黑, sans-serif';
        wordElement.style.cursor = 'pointer';
        wordElement.style.transition = 'all 0.3s ease';
        wordElement.style.textShadow = '0 2px 4px rgba(0,0,0,0.2)';
        wordElement.style.zIndex = '1';
        wordElement.style.opacity = '0.95';
        wordElement.style.textAlign = 'center';
        wordElement.style.lineHeight = '1';
        wordElement.style.whiteSpace = 'nowrap';
        
        // 计算文本宽度（更精确）
        var textWidth = estimateTextWidth(item.name, fontSize);
        var textHeight = fontSize * 1.2;
        
        // 存储元素信息
        var elementInfo = {
            element: wordElement,
            width: textWidth,
            height: textHeight,
            fontSize: fontSize,
            value: item.value,
            index: index,
            name: item.name
        };
        
        wordElements.push(elementInfo);
        
        // 添加到容器
        container.appendChild(wordElement);
    });
    
    // 优化布局 - 确保不重叠
    optimizeLayoutNoOverlap(wordElements, containerWidth, containerHeight);
    
    // 应用位置
    wordElements.forEach(function(info) {
        info.element.style.left = info.x + 'px';
        info.element.style.top = info.y + 'px';
    });
    
    // 手动调整特定地名位置（偏移量）
    applyManualOffsets(wordElements);
    
    // 鼠标悬停效果 - 只浮动一下（稍微放大）
    wordElements.forEach(function(info) {
        info.element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.zIndex = '10';
            this.style.opacity = '1';
            this.style.textShadow = '0 4px 8px rgba(0,0,0,0.3)';
        });
        
        info.element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.zIndex = '1';
            this.style.opacity = '0.95';
            this.style.textShadow = '0 2px 4px rgba(0,0,0,0.2)';
        });
    });
    
    // 窗口大小变化时重新布局
    var resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // 重新获取容器尺寸
            var newWidth = container.clientWidth;
            var newHeight = container.clientHeight;
            
            // 重新优化布局
            optimizeLayoutNoOverlap(wordElements, newWidth, newHeight);
            
            // 应用新位置
            wordElements.forEach(function(info) {
                info.element.style.left = info.x + 'px';
                info.element.style.top = info.y + 'px';
            });
            
            // 重新应用手动偏移
            applyManualOffsets(wordElements);
        }, 250);
    });
}

// 手动调整特定地名的偏移量
function applyManualOffsets(wordElements) {
    // 偏移量配置：{ 地名: 水平偏移(正数右移，负数左移) }
    var offsets = {
        '安徽安庆': 40,       // 右移40px
        '江西景德镇': 40,     // 右移40px
        '江西上饶': -20       // 左移20px
    };
    
    wordElements.forEach(function(info) {
        var offset = offsets[info.name];
        if (offset !== undefined) {
            var currentLeft = parseFloat(info.element.style.left) || 0;
            info.element.style.left = (currentLeft + offset) + 'px';
        }
    });
}

// 估算文本宽度
function estimateTextWidth(text, fontSize) {
    // 中文字符宽度系数
    var chineseWidth = fontSize * 0.8;
    // 英文字符宽度系数
    var englishWidth = fontSize * 0.5;
    
    // 计算文本中中文字符和英文字符的数量
    var chineseCount = 0;
    var englishCount = 0;
    
    for (var i = 0; i < text.length; i++) {
        var charCode = text.charCodeAt(i);
        if (charCode >= 0x4E00 && charCode <= 0x9FFF) {
            chineseCount++;
        } else {
            englishCount++;
        }
    }
    
    return chineseCount * chineseWidth + englishCount * englishWidth;
}

// 优化布局算法 - 权重越大的越在中间，剩下的依次在周围围起来
function optimizeLayoutNoOverlap(wordElements, containerWidth, containerHeight) {
    // 清除之前的位置
    wordElements.forEach(function(info) {
        info.x = 0;
        info.y = 0;
        info.placed = false;
        info.rect = null;
    });
    
    // 中心点
    var centerX = containerWidth / 2;
    var centerY = containerHeight / 2;
    
    // 放置第一个元素（权重最大的）在中心
    if (wordElements.length > 0) {
        var first = wordElements[0];
        first.x = centerX - first.width / 2;
        first.y = centerY - first.height / 2;
        first.placed = true;
        first.rect = {
            x: first.x,
            y: first.y,
            width: first.width,
            height: first.height
        };
    }
    
    // 放置其他元素 - 根据权重决定起始半径
    for (var i = 1; i < wordElements.length; i++) {
        var current = wordElements[i];
        
        // 根据权重计算起始半径：权重越小，起始半径越大
        var weightRatio = current.value / wordElements[0].value; // 相对于最大权重的比例
        var baseRadius = Math.max(current.fontSize * 0.8, 30); // 基础半径
        var radiusOffset = (1 - weightRatio) * 100; // 权重越小，偏移越大
        
        // 尝试多个位置（螺旋式搜索）- 根据权重调整搜索策略
        var placed = false;
        var radius = baseRadius + radiusOffset * 0.5; // 权重小的从更大的半径开始
        var angle = 0;
        var angleStep = Math.PI / 6; // 30度步长
        var maxRadius = Math.min(containerWidth, containerHeight) * 0.4; // 最大半径增加到40%
        
        // 对于权重特别小的元素，强制从更大的半径开始
        if (current.value <= 1.2) {
            radius = Math.max(radius, baseRadius * 2);
        }
        
        while (!placed && radius < maxRadius) {
            // 在当前半径上尝试多个角度
            for (var j = 0; j < 12 && !placed; j++) { // 尝试12个角度
                angle = j * angleStep;
                
                // 计算位置
                var x = centerX + Math.cos(angle) * radius - current.width / 2;
                var y = centerY + Math.sin(angle) * radius - current.height / 2;
                
                // 检查边界
                if (x < 10 || x + current.width > containerWidth - 10 ||
                    y < 10 || y + current.height > containerHeight - 10) {
                    continue;
                }
                
                // 创建当前元素的矩形
                var currentRect = {
                    x: x,
                    y: y,
                    width: current.width,
                    height: current.height
                };
                
                // 检查是否与已放置元素重叠
                var overlap = false;
                for (var k = 0; k < i; k++) {
                    var other = wordElements[k];
                    if (other.placed && rectanglesOverlap(currentRect, other.rect)) {
                        overlap = true;
                        break;
                    }
                }
                
                // 如果不重叠，放置元素
                if (!overlap) {
                    current.x = x;
                    current.y = y;
                    current.placed = true;
                    current.rect = currentRect;
                    placed = true;
                }
            }
            
            // 增加半径继续搜索
            radius += current.fontSize * 0.4;
        }
        
        // 如果还是没找到位置，使用更密集的搜索
        if (!placed) {
            // 在外围区域网格搜索
            var gridSize = 20;
            var startX = centerX - containerWidth * 0.35;
            var startY = centerY - containerHeight * 0.35;
            var endX = centerX + containerWidth * 0.35;
            var endY = centerY + containerHeight * 0.35;
            
            // 对于权重小的元素，搜索更外围的区域
            if (current.value <= 1.5) {
                startX = centerX - containerWidth * 0.4;
                startY = centerY - containerHeight * 0.4;
                endX = centerX + containerWidth * 0.4;
                endY = centerY + containerHeight * 0.4;
            }
            
            for (var gridX = startX; gridX < endX && !placed; gridX += gridSize) {
                for (var gridY = startY; gridY < endY && !placed; gridY += gridSize) {
                    var x = gridX - current.width / 2;
                    var y = gridY - current.height / 2;
                    
                    // 检查边界
                    if (x < 10 || x + current.width > containerWidth - 10 ||
                        y < 10 || y + current.height > containerHeight - 10) {
                        continue;
                    }
                    
                    // 创建当前元素的矩形
                    var currentRect = {
                        x: x,
                        y: y,
                        width: current.width,
                        height: current.height
                    };
                    
                    // 检查是否与已放置元素重叠
                    var overlap = false;
                    for (var k = 0; k < i; k++) {
                        var other = wordElements[k];
                        if (other.placed && rectanglesOverlap(currentRect, other.rect)) {
                            overlap = true;
                            break;
                        }
                    }
                    
                    // 如果不重叠，放置元素
                    if (!overlap) {
                        current.x = x;
                        current.y = y;
                        current.placed = true;
                        current.rect = currentRect;
                        placed = true;
                    }
                }
            }
        }
        
        // 如果还是没找到位置，放在边缘（确保不重叠）
        if (!placed) {
            // 尝试八个方向（包括对角线）
            var directions = [
                {x: centerX - current.width / 2, y: centerY - current.height - 40}, // 上
                {x: centerX - current.width / 2, y: centerY + 40}, // 下
                {x: centerX - current.width - 40, y: centerY - current.height / 2}, // 左
                {x: centerX + 40, y: centerY - current.height / 2}, // 右
                {x: centerX - current.width - 30, y: centerY - current.height - 30}, // 左上
                {x: centerX + 30, y: centerY - current.height - 30}, // 右上
                {x: centerX - current.width - 30, y: centerY + 30}, // 左下
                {x: centerX + 30, y: centerY + 30} // 右下
            ];
            
            for (var d = 0; d < directions.length && !placed; d++) {
                var dir = directions[d];
                var currentRect = {
                    x: dir.x,
                    y: dir.y,
                    width: current.width,
                    height: current.height
                };
                
                // 检查边界
                if (currentRect.x < 10 || currentRect.x + currentRect.width > containerWidth - 10 ||
                    currentRect.y < 10 || currentRect.y + currentRect.height > containerHeight - 10) {
                    continue;
                }
                
                // 检查是否与已放置元素重叠
                var overlap = false;
                for (var k = 0; k < i; k++) {
                    var other = wordElements[k];
                    if (other.placed && rectanglesOverlap(currentRect, other.rect)) {
                        overlap = true;
                        break;
                    }
                }
                
                // 如果不重叠，放置元素
                if (!overlap) {
                    current.x = dir.x;
                    current.y = dir.y;
                    current.placed = true;
                    current.rect = currentRect;
                    placed = true;
                }
            }
        }
        
        // 如果所有方法都失败，放在外围区域
        if (!placed) {
            // 在外围随机位置
            var randomAngle = Math.random() * Math.PI * 2;
            var randomRadius = Math.min(containerWidth, containerHeight) * 0.35;
            current.x = centerX + Math.cos(randomAngle) * randomRadius - current.width / 2;
            current.y = centerY + Math.sin(randomAngle) * randomRadius - current.height / 2;
            current.placed = true;
            current.rect = {
                x: current.x,
                y: current.y,
                width: current.width,
                height: current.height
            };
        }
    }
}

// 检查两个矩形是否重叠（带安全边距）- 减小边距使词云更聚集
function rectanglesOverlap(rect1, rect2) {
    // 安全边距 - 减小到4px，使词云更聚集
    var margin = 4;
    
    return !(rect1.x + rect1.width + margin < rect2.x - margin || 
             rect1.x - margin > rect2.x + rect2.width + margin || 
             rect1.y + rect1.height + margin < rect2.y - margin || 
             rect1.y - margin > rect2.y + rect2.height + margin);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (document.getElementById('word-cloud-chart')) {
            initWordCloudChart();
        }
    });
} else {
    if (document.getElementById('word-cloud-chart')) {
        initWordCloudChart();
    }
}
