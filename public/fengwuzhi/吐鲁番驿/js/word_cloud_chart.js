 // 分布词云图 - 最终优化版本
// 要求：1.词云不要重叠 2.优化布局算法

function initWordCloudChart() {
    var container = document.getElementById('word-cloud-chart');
    if (!container) return;
    
    // 清空容器
    container.innerHTML = '';
    
    // 地名和权重数据 - 新疆阿以旺分布
    var wordData = [
        { name: '新疆吐鲁番', value: 10 },
        { name: '哈密', value: 8.5 },
        { name: '库车', value: 7.2 },
        { name: '库尔勒', value: 6.8 },
        { name: '阿克苏', value: 5.5 }
    ];
    
    // 颜色数组 - 使用不同颜色
    var colorArray = [
        'rgba(77, 171, 247, 0.9)',   // 蓝色
        'rgba(255, 107, 107, 0.9)',  // 红色
        'rgba(107, 207, 127, 0.9)',  // 绿色
        'rgba(255, 209, 102, 0.9)',  // 黄色
        'rgba(164, 99, 242, 0.9)',   // 紫色
        'rgba(6, 214, 160, 0.9)',    // 青色
        'rgba(239, 71, 111, 0.9)',   // 粉色
        'rgba(17, 138, 178, 0.9)',   // 深蓝
        'rgba(255, 154, 118, 0.9)',  // 橙色
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
    // 偏移量配置：{ 地名: { left: 水平偏移(正数右移，负数左移), top: 垂直偏移(正数下移，负数上移) } }
    var offsets = {
        '库车': { left: -20, top: -10 },  // 左移20px、上移10px
        '阿克苏': { left: 0, top: 10 },   // 下移10px
        '哈密': { left: 40, top: 10 }     // 右移40px（原30+10）、下移10px
    };
    
    wordElements.forEach(function(info) {
        var offset = offsets[info.name];
        if (offset !== undefined) {
            var currentLeft = parseFloat(info.element.style.left) || 0;
            var currentTop = parseFloat(info.element.style.top) || 0;
            info.element.style.left = (currentLeft + offset.left) + 'px';
            info.element.style.top = (currentTop + offset.top) + 'px';
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
    
    // 放置其他元素 - 使用改进的螺旋搜索算法
    for (var i = 1; i < wordElements.length; i++) {
        var current = wordElements[i];
        
        // 根据权重计算搜索参数
        var weightRatio = current.value / wordElements[0].value;
        
        // 尝试多个位置（螺旋式搜索）
        var placed = false;
        var radius = 0;
        var angle = 0;
        var angleStep = Math.PI / 8; // 22.5度步长，更密集
        var radiusStep = current.fontSize * 0.3; // 更小的半径增量
        var maxRadius = Math.min(containerWidth, containerHeight) * 0.45; // 最大半径
        
        // 螺旋搜索
        while (!placed && radius < maxRadius) {
            // 在当前半径上尝试多个角度
            var angleCount = Math.max(8, Math.floor(2 * Math.PI * radius / (current.fontSize * 0.5)));
            var actualAngleStep = (2 * Math.PI) / angleCount;
            
            for (var j = 0; j < angleCount && !placed; j++) {
                angle = j * actualAngleStep;
                
                // 计算位置
                var x = centerX + Math.cos(angle) * radius - current.width / 2;
                var y = centerY + Math.sin(angle) * radius - current.height / 2;
                
                // 检查边界
                if (x < 5 || x + current.width > containerWidth - 5 ||
                    y < 5 || y + current.height > containerHeight - 5) {
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
            radius += radiusStep;
        }
        
        // 如果还是没找到位置，使用网格搜索
        if (!placed) {
            var gridSize = 15;
            var searchRadius = Math.min(containerWidth, containerHeight) * 0.4;
            
            for (var gridX = centerX - searchRadius; gridX < centerX + searchRadius && !placed; gridX += gridSize) {
                for (var gridY = centerY - searchRadius; gridY < centerY + searchRadius && !placed; gridY += gridSize) {
                    var x = gridX - current.width / 2;
                    var y = gridY - current.height / 2;
                    
                    // 检查边界
                    if (x < 5 || x + current.width > containerWidth - 5 ||
                        y < 5 || y + current.height > containerHeight - 5) {
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
        
        // 如果所有方法都失败，放在外围区域
        if (!placed) {
            // 在外围随机位置
            var randomAngle = Math.random() * Math.PI * 2;
            var randomRadius = Math.min(containerWidth, containerHeight) * 0.38;
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
    
    // 布局完成后，将整个词云居中
    centerWordCloud(wordElements, containerWidth, containerHeight);
}

// 将整个词云居中
function centerWordCloud(wordElements, containerWidth, containerHeight) {
    if (wordElements.length === 0) return;
    
    // 计算词云的边界框
    var minX = Infinity, minY = Infinity;
    var maxX = -Infinity, maxY = -Infinity;
    
    wordElements.forEach(function(info) {
        if (info.placed) {
            minX = Math.min(minX, info.x);
            minY = Math.min(minY, info.y);
            maxX = Math.max(maxX, info.x + info.width);
            maxY = Math.max(maxY, info.y + info.height);
        }
    });
    
    // 计算词云的中心
    var cloudCenterX = (minX + maxX) / 2;
    var cloudCenterY = (minY + maxY) / 2;
    
    // 计算容器的中心
    var containerCenterX = containerWidth / 2;
    var containerCenterY = containerHeight / 2;
    
    // 计算偏移量
    var offsetX = containerCenterX - cloudCenterX;
    var offsetY = containerCenterY - cloudCenterY;
    
    // 应用偏移量，将词云居中
    wordElements.forEach(function(info) {
        if (info.placed) {
            info.x += offsetX;
            info.y += offsetY;
            info.rect.x = info.x;
            info.rect.y = info.y;
        }
    });
}

// 检查两个矩形是否重叠（带安全边距）- 使用合适的边距防止重叠
function rectanglesOverlap(rect1, rect2) {
    // 安全边距 - 6px，防止文字重叠
    var margin = 6;
    
    return !(rect1.x + rect1.width + margin <= rect2.x || 
             rect1.x >= rect2.x + rect2.width + margin || 
             rect1.y + rect1.height + margin <= rect2.y || 
             rect1.y >= rect2.y + rect2.height + margin);
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
