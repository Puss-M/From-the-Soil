function initWordCloudChart() {
    var container = document.getElementById('word-cloud-chart');
    if (!container)
        return;
    container.innerHTML = '';
    var wordData = [
        { name: '东城区', value: 10 },
        { name: '西城区', value: 9.5 },
        { name: '崇文门周边', value: 5 },
        { name: '宣武门周边', value: 4.8 },
        { name: '海淀区', value: 3 },
        { name: '丰台区', value: 2.5 },
        { name: '昌平区', value: 1 },
        { name: '顺义区', value: 0.8 },
        { name: '密云区', value: 0.5 },
        { name: '天津老城厢', value: 2 },
        { name: '河北保定', value: 1.5 },
        { name: '河北正定', value: 1.2 }
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
        '河北正定': -10,
        '昌平区': 30,
        '海淀区': 30,
        '天津老城厢': -10,
        '密云区': -10,
        '顺义区': 30,
        '丰台区': -15
    };
    wordElements.forEach(function (info) {
        var offset = offsets[info.name];
        if (offset !== undefined) {
            var currentLeft = parseFloat(info.element.style.left) || 0;
            info.element.style.left = (currentLeft + offset) + 'px';
        }
    });
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
        var weightRatio = current.value / wordElements[0].value;
        var baseRadius = Math.max(current.fontSize * 0.8, 30);
        var radiusOffset = (1 - weightRatio) * 100;
        var placed = false;
        var radius = baseRadius + radiusOffset * 0.5;
        var angle = 0;
        var angleStep = Math.PI / 6;
        var maxRadius = Math.min(containerWidth, containerHeight) * 0.4;
        if (current.value <= 1.2) {
            radius = Math.max(radius, baseRadius * 2);
        }
        while (!placed && radius < maxRadius) {
            for (var j = 0; j < 12 && !placed; j++) {
                angle = j * angleStep;
                var x = centerX + Math.cos(angle) * radius - current.width / 2;
                var y = centerY + Math.sin(angle) * radius - current.height / 2;
                if (x < 10 || x + current.width > containerWidth - 10 ||
                    y < 10 || y + current.height > containerHeight - 10) {
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
            radius += current.fontSize * 0.4;
        }
        if (!placed) {
            var gridSize = 20;
            var startX = centerX - containerWidth * 0.35;
            var startY = centerY - containerHeight * 0.35;
            var endX = centerX + containerWidth * 0.35;
            var endY = centerY + containerHeight * 0.35;
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
                    if (x < 10 || x + current.width > containerWidth - 10 ||
                        y < 10 || y + current.height > containerHeight - 10) {
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
                { x: centerX - current.width / 2, y: centerY - current.height - 40 },
                { x: centerX - current.width / 2, y: centerY + 40 },
                { x: centerX - current.width - 40, y: centerY - current.height / 2 },
                { x: centerX + 40, y: centerY - current.height / 2 },
                { x: centerX - current.width - 30, y: centerY - current.height - 30 },
                { x: centerX + 30, y: centerY - current.height - 30 },
                { x: centerX - current.width - 30, y: centerY + 30 },
                { x: centerX + 30, y: centerY + 30 }
            ];
            for (var d = 0; d < directions.length && !placed; d++) {
                var dir = directions[d];
                var currentRect = {
                    x: dir.x,
                    y: dir.y,
                    width: current.width,
                    height: current.height
                };
                if (currentRect.x < 10 || currentRect.x + currentRect.width > containerWidth - 10 ||
                    currentRect.y < 10 || currentRect.y + currentRect.height > containerHeight - 10) {
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
function rectanglesOverlap(rect1, rect2) {
    var margin = 4;
    return !(rect1.x + rect1.width + margin < rect2.x - margin ||
        rect1.x - margin > rect2.x + rect2.width + margin ||
        rect1.y + rect1.height + margin < rect2.y - margin ||
        rect1.y - margin > rect2.y + rect2.height + margin);
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
