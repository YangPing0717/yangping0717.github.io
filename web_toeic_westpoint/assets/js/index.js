/**
 *  BUG: 如果动画涉及上下位置变化，快速来回滚动时，会出现item不显示的情况
 */

// config
var elemName = '.item',
    enterFromTop = 'slide-from-top',
    enterFromBottom = 'slide-from-bottom',
    delayTime = 50;


function getScrollTop() {
    if (document.documentElement.scrollTop) {
        getScrollTop = function() {
            return document.documentElement.scrollTop;
        };
    } else if (document.body.scrollTop) {
        getScrollTop = function() {
            return document.body.scrollTop;
        };
    } else {
        return 0;
    }

    return getScrollTop();
}

// 判断是不是在窗口下方
function isFuture(elem) {
    return elem.getBoundingClientRect().top >= viewportH? true : false;
}

// 判断是不是在窗口上方
function isPast(elem) {
    return elem.getBoundingClientRect().bottom <= 0? true : false;
}

function addClass(elems, classNames) {
    if (!elems.length) {
        return false;
    }
    for (var i = 0, len = elems.length; i < len; i++) {
        var classList = elems[i].classList;
        classList.add.apply(classList, classNames);
    }
}

function removeClass(elems, classNames) {
    if (!elems.length) {
        return false;
    }
    for (var i = 0, len = elems.length; i < len; i++) {
        var classList = elems[i].classList;

        for (var j = 0, lenj = classNames.length; j < lenj; j++) {
            var className = classNames[j];
            if (classList.contains(className)) {
                classList.remove(className);
            }
        }
    }
}

function addDelay(elems) {
    if (!elems.length) {
        return false;
    }
    var delay = delayTime;
    for (var i = 1, len = elems.length; i < len; i++) {
        elems[i].style.webkitAnimationDelay = delay + 'ms';
        elems[i].style.animationDelay = delay + 'ms';
        delay += delayTime;
    }
}

function removeDelay(elems) {
    if (!elems.length) {
        return false;
    }
    for (var i = 1, len = elems.length; i < len; i++) {
        elems[i].style.webkitAnimationDelay = '';
        elems[i].style.animationDelay = '';
    }
}

function update(dir) {
    var last = dir.leave[dir.leave.length - 1],
        index = dir.enter.indexOf(last),
        
        // 没有把enterClass 放在dir 对象里是为了更改enterClass 时方便 
        enterClass = dir == sd? enterFromBottom : enterFromTop;
        actualEnter = index == -1? dir.enter : dir.enter.slice(index + 1);

    addClass(actualEnter, [enterClass]);
    removeClass(dir.leave, [enterFromBottom, enterFromTop]);

    addDelay(actualEnter);
    removeDelay(dir.leave);

    // reset
    dir.animId = 0;
    dir.enter = [];
    dir.leave = [];
}

// 初始化，找出第一个在窗口下方的元素
var elems, eLen, viewportH;
var firstFuture = 0, // 指向在窗口下方的第一个元素
    firstPast = -1; // 指向在窗口上方的第一个元素

document.addEventListener('DOMContentLoaded', init, false);

var resizeId = 0;
window.addEventListener('resize', function() {
    if (resizeId) {
        clearTimeout(resizeId);
    }
    resizeId = setTimeout(function() { 
        init();
    }, 300);
}, false);

function init() {
    elems = document.querySelectorAll(elemName);
    eLen = elems.length;
    viewportH = document.documentElement.clientHeight;

    var visibileElems = [];
    for (var i = 0; i < eLen; i++) {
        var e = elems[i];
        if (isFuture(e)) { // 第一个出现在窗口下方的元素
            firstFuture = i;
            break;
        } else { // 在窗口内的元素
            visibileElems.push(e);
        }
    }

    requestAnimationFrame(function() {
        addClass(visibileElems, [enterFromBottom]);
        addDelay(visibileElems);
    });
}

// 用原生的滚动事件
var lastPos = 0;
window.addEventListener('scroll', onScroll, false);

function onScroll() {
    var curPos = getScrollTop();
    var change = curPos - lastPos;
    if (change > 0) {
        scrollDown();
    } else {
        scrollUp();
    }

    lastPos = curPos;
}

/**
 * 向下滚动的时候检查两部分:
 * 1.找到第一个是future的元素
 * 2.找到第一个不是past的元素
 */

var sd = {
    animId: 0,
    enter: [],
    leave: []
};

function scrollDown() {
    var i, e;

    // 检查future
    for (i = firstFuture; i < eLen; i++) {
        e = elems[i];
        if (isFuture(e)) { // 第一个出现在窗口下方的元素
            firstFuture = i;
            break;
        } else {
            if (i == eLen - 1) { // 如果所有元素都不在窗口下方，那么firstFuture指向elems[len]
                firstFuture = eLen;
            }
            sd.enter.push(e);
        }
    }

    // 检查past
    for (i = firstPast; i < eLen; i++) {
        if (i == -1) { // firstPast为-1时，直接跳过那次循环
            continue;
        }
        e = elems[i];
        if (!isPast(e)) {
            firstPast = i - 1;
            break;
        } else {
            if (i == eLen - 1) { // 如果所有元素都在窗口上方，那么firstPast指向elems[len]
                firstPast = eLen;
            }
            sd.leave.push(e);
        }
    }

    if (!sd.animId) {
        sd.animId = requestAnimationFrame(function() {
            update(sd);
        });
    }
}


/**
 * 向上滚动的时候检查两部分，断点分别是
 * 1.找到第一个是past的元素
 * 2.找到第一个不是future的元素
 */

var su = {
    animId: 0,
    enter: [],
    leave: []
};

function scrollUp() {
    var i, e;

    // 检查past
    for (i = firstPast; i >= 0; i--) {
        e = elems[i];

        if (isPast(e)) { // 找到第一个是past的元素
            firstPast = i;
            break;
        } else {
            if (i === 0) { // 如果所有元素都不在窗口上方，firstPast 指向elems[-1]
                firstPast = -1;
            }
            su.enter.push(e);
        }
    }

    // 检查future
    for (i = firstFuture; i >= 0; i--) {
        if (i == eLen) { // firstFuture为len时，直接跳过那次循环
            continue;
        }
        e = elems[i];

        if (!isFuture(e)) { // 找到第一个不是future的元素
            firstFuture = i + 1;
            break;
        } else {
            if (i === 0) { // 如果所有元素都不在窗口下方，firstPast 指向elems[0]
                firstFuture = 0;
            }
            su.leave.push(e);
        }
    }

    if (!su.animId) {
        su.animId = requestAnimationFrame(function() {
            update(su);
        });
    }
}