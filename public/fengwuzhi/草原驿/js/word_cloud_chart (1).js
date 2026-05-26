function initWordCloudChart() {
    var container = document.getElementById('word-cloud-chart');
    if (!container)
        return;
    container.innerHTML = '';
    var wordData = [
        { name: '锡林郭勒盟', value: 10 },
        { name: '呼伦贝尔', value: 9.5 },
        { name: '阿拉善盟', value: 5 },
        { name: '赤峰市', value: 4.8 },
        { name: '通辽市', value: 3 },
        { name: '兴安盟', value: 2.5 },
        { name: '蒙古国东方省', value: 2 },
        { name: '乌兰察布市', value: 1 },
        { name: '新疆巴音郭楞州', value: 1.5 },
        { name: '甘肃肃北县', value: 1.2 },
        { name: '巴彦淖尔市', value: 0.8 },
        { name: '鄂尔多斯市', value: 0.5 }
    ];
    var colorArray = [
        'rgba(77, 171, 247, 0.9)',
        'rgba(255, 107, 107, 0.9)',
        'rgba(107, 207, 127, 0.9)',
        'rgba(255, 209, 102, 0.9)',
        'rgba(164, 99, 242, 0.9)',
        'rgba(6, 214, 160, 0.9)',
        'rgba(239, 71, 111, 0.9)',
        'rgba(17, 138, 178, 0.9)',
        'rgba(255, 154, 118, 0.9)',
        'rgba(157, 78, 221, 0.9)',
        'rgba(255, 89, 94, 0.9)',
        'rgba(25, 130, 196, 0.9)'
    ];
    var maxValue = Math.max(...wordData.map(item => item.value));
    wordData.sort(function (a, b) {
        return b.value - a.value;
    });
    var containerWidth = container.clientWidth;
    var containerHeight = container.clientHeight;
    var wordElements = [];
    wordData.forEach(function (item, index) {
        var wordElement = document.createElement('div');
        wordElement.className = 'word-cloud-item';
        wordElement.textContent = item.name;
        var fontSize = 16 + (item.value / maxValue) * 28;
        var fontWeight = 500 + (item.value / maxValue) * 300;
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
        var textWidth = estimateTextWidth(item.name, fontSize);
        var textHeight = fontSize * 1.2;
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
        container.appendChild(wordElement);
    });
    optimizeLayoutNoOverlap(wordElements, containerWidth, containerHeight);
    wordElements.forEach(function (info) {
        info.element.style.left = info.x + 'px';
        info.element.style.top = info.y + 'px';
    });
    applyManualOffsets(wordElements);
    wordElements.forEach(function (info) {
        info.element.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.1)';
            this.style.zIndex = '10';
            this.style.opacity = '1';
            this.style.textShadow = '0 4px 8px rgba(0,0,0,0.3)';
        });
        info.element.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
            this.style.zIndex = '1';
            this.style.opacity = '0.95';
            this.style.textShadow = '0 2px 4px rgba(0,0,0,0.2)';
        });
    });
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            var newWidth = container.clientWidth;
            var newHeight = container.clientHeight;
            optimizeLayoutNoOverlap(wordElements, newWidth, newHeight);
            wordElements.forEach(function (info) {
                info.element.style.left = info.x + 'px';
                info.element.style.top = info.y + 'px';
            });
            applyManualOffsets(wordElements);
        }, 250);
    });
}
function applyManualOffsets(wordElements) {
    var offsets = {
        '甘肃肃北县': 20,
        '赤峰市': 20,
        '乌兰察布市': 20,
        '巴彦淖尔市': -20,
        '兴安盟': -20,
        '新疆巴音郭楞州': -20
    };
    wordElements.forEach(function (info) {
        var offset = offsets[info.name];
        if (offset !== undefined) {
            var currentLeft = parseFloat(info.element.style.left) || 0;
            info.element.style.left = (currentLeft + offset) + 'px';
        }
    });
    var xilinLeft = null, xilinTop = null;
    var ordosElement = null;
    wordElements.forEach(function (info) {
        if (info.name === '锡林郭勒盟') {
            xilinLeft = parseFloat(info.element.style.left) || 0;
            xilinTop = parseFloat(info.element.style.top) || 0;
        }
        if (info.name === '鄂尔多斯市') {
            ordosElement = info.element;
        }
    });
    if (xilinLeft !== null && xilinTop !== null && ordosElement) {
        var ordosWidth = parseFloat(ordosElement.style.width) || estimateTextWidth('鄂尔多斯市', parseFloat(ordosElement.style.fontSize) || 16);
        ordosElement.style.left = (xilinLeft - 85) + 'px';
        ordosElement.style.top = (xilinTop + 50) + 'px';
    }
}
function estimateTextWidth(text, fontSize) {
    var chineseWidth = fontSize * 0.8;
    var englishWidth = fontSize * 0.5;
    var chineseCount = 0;
    var englishCount = 0;
    for (var i = 0; i < text.length; i++) {
        var charCode = text.charCodeAt(i);
        if (charCode >= 0x4E00 && charCode <= 0x9FFF) {
            chineseCount++;
        }
        else {
            englishCount++;
        }
    }
    return chineseCount * chineseWidth + englishCount * englishWidth;
}
function optimizeLayoutNoOverlap(wordElements, containerWidth, containerHeight) {
    wordElements.forEach(function (info) {
        info.x = 0;
        info.y = 0;
        info.placed = false;
        info.rect = null;
    });
    var centerX = containerWidth / 2;
    var centerY = containerHeight / 2;
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
    for (var i = 1; i < wordElements.length; i++) {
        var current = wordElements[i];
        var placed = false;
        var radius = 20;
        var angle = 0;
        var angleStep = Math.PI / 8;
        var maxRadius = Math.min(containerWidth, containerHeight) * 0.35;
        while (!placed && radius < maxRadius) {
            for (var j = 0; j < 16 && !placed; j++) {
                angle = j * angleStep;
                var x = centerX + Math.cos(angle) * radius - current.width / 2;
                var y = centerY + Math.sin(angle) * radius - current.height / 2;
                if (x < 5 || x + current.width > containerWidth - 5 ||
                    y < 5 || y + current.height > containerHeight - 5) {
                    continue;
                }
                var currentRect = {
                    x: x,
                    y: y,
                    width: current.width,
                    height: current.height
                };
                var overlap = false;
                for (var k = 0; k < i; k++) {
                    var other = wordElements[k];
                    if (other.placed && rectanglesOverlap(currentRect, other.rect)) {
                        overlap = true;
                        break;
                    }
                }
                if (!overlap) {
                    current.x = x;
                    current.y = y;
                    current.placed = true;
                    current.rect = currentRect;
                    placed = true;
                }
            }
            radius += 15;
        }
        if (!placed) {
            var gridSize = 15;
            var searchRadius = Math.min(containerWidth, containerHeight) * 0.3;
            for (var gridX = centerX - searchRadius; gridX < centerX + searchRadius && !placed; gridX += gridSize) {
                for (var gridY = centerY - searchRadius; gridY < centerY + searchRadius && !placed; gridY += gridSize) {
                    var x = gridX - current.width / 2;
                    var y = gridY - current.height / 2;
                    if (x < 5 || x + current.width > containerWidth - 5 ||
                        y < 5 || y + current.height > containerHeight - 5) {
                        continue;
                    }
                    var currentRect = {
                        x: x,
                        y: y,
                        width: current.width,
                        height: current.height
                    };
                    var overlap = false;
                    for (var k = 0; k < i; k++) {
                        var other = wordElements[k];
                        if (other.placed && rectanglesOverlap(currentRect, other.rect)) {
                            overlap = true;
                            break;
                        }
                    }
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
        if (!placed) {
            var directions = [
                { x: centerX - current.width / 2, y: centerY - current.height - 25 },
                { x: centerX - current.width / 2, y: centerY + 25 },
                { x: centerX - current.width - 25, y: centerY - current.height / 2 },
                { x: centerX + 25, y: centerY - current.height / 2 },
                { x: centerX - current.width - 20, y: centerY - current.height - 20 },
                { x: centerX + 20, y: centerY - current.height - 20 },
                { x: centerX - current.width - 20, y: centerY + 20 },
                { x: centerX + 20, y: centerY + 20 }
            ];
            for (var d = 0; d < directions.length && !placed; d++) {
                var dir = directions[d];
                var currentRect = {
                    x: dir.x,
                    y: dir.y,
                    width: current.width,
                    height: current.height
                };
                if (currentRect.x < 5 || currentRect.x + currentRect.width > containerWidth - 5 ||
                    currentRect.y < 5 || currentRect.y + currentRect.height > containerHeight - 5) {
                    continue;
                }
                var overlap = false;
                for (var k = 0; k < i; k++) {
                    var other = wordElements[k];
                    if (other.placed && rectanglesOverlap(currentRect, other.rect)) {
                        overlap = true;
                        break;
                    }
                }
                if (!overlap) {
                    current.x = dir.x;
                    current.y = dir.y;
                    current.placed = true;
                    current.rect = currentRect;
                    placed = true;
                }
            }
        }
        if (!placed) {
            var randomAngle = Math.random() * Math.PI * 2;
            var randomRadius = Math.min(containerWidth, containerHeight) * 0.25;
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
    centerWordCloud(wordElements, containerWidth, containerHeight);
}
function centerWordCloud(wordElements, containerWidth, containerHeight) {
    if (wordElements.length === 0)
        return;
    var minX = Infinity, minY = Infinity;
    var maxX = -Infinity, maxY = -Infinity;
    wordElements.forEach(function (info) {
        if (info.placed) {
            minX = Math.min(minX, info.x);
            minY = Math.min(minY, info.y);
            maxX = Math.max(maxX, info.x + info.width);
            maxY = Math.max(maxY, info.y + info.height);
        }
    });
    var cloudCenterX = (minX + maxX) / 2;
    var cloudCenterY = (minY + maxY) / 2;
    var containerCenterX = containerWidth / 2;
    var containerCenterY = containerHeight / 2;
    var offsetX = containerCenterX - cloudCenterX;
    var offsetY = containerCenterY - cloudCenterY;
    wordElements.forEach(function (info) {
        if (info.placed) {
            info.x += offsetX;
            info.y += offsetY;
            info.rect.x = info.x;
            info.rect.y = info.y;
        }
    });
}
function rectanglesOverlap(rect1, rect2) {
    var margin = 6;
    return !(rect1.x + rect1.width + margin <= rect2.x ||
        rect1.x >= rect2.x + rect2.width + margin ||
        rect1.y + rect1.height + margin <= rect2.y ||
        rect1.y >= rect2.y + rect2.height + margin);
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        if (document.getElementById('word-cloud-chart')) {
            initWordCloudChart();
        }
    });
}
else {
    if (document.getElementById('word-cloud-chart')) {
        initWordCloudChart();
    }
}
