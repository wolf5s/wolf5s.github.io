var content = $('.content.0'),
  control = content.$('.control.0'),
  inside = control.$('.inside.0'),
  insideButtonSpan = inside.$('.button.0 span'),
  outside = control.$('.outside.0'),
  dataShow = control.$('.dataShow.0'),
  dataSpan = dataShow.$('span'),
  outsideFloor = outside.$('.floor.0'),
  outsideUpAndDown = outside.$('.upAndDown.0'),
  elevator = $('#elevator'),
  rect = elevator.$('rect.0');

var RUN = null;

var data = {
  current: 0, //当前位置
  v: 1,
  h: 0,
  height: 10, //总高度
  way: 0, //0静止，1下，2上
  open: false, //门是否关闭状态
  upTarget: [], //上升时目标
  downTarget: [], //下降时目标
  upAndDownTarget: [], //二维数组，存储外侧按钮
  upAndDownTEMP: 0, //目前外侧按钮的楼层
  DTED: [0, 10, 20, 30, 40, 50, 60, 70], //每层高度
}

window.onload = function() {
  delayedLoadingPublicPictures('../');
  for (var i = 0; i < 8; i++) {
    data.upTarget[i] = false;
    data.downTarget[i] = false;
    data.upAndDownTarget[i] = [false, false]; //[下降，上升]
  }
  data.height = data.DTED[data.DTED.length - 1] - data.DTED[0];
  outsideUpAndDown.$('.down.0').style.visibility = 'hidden';
}

addEvent(inside, 'click', function(e) {
  var e = e || window.event;
  if (e.target.nodeName.toUpperCase() === 'SPAN') {
    if (data.h != data.DTED[e.target.innerHTML - 1]) {
      e.target.addClass('inchoose');
    }
    var target = e.target.innerHTML - 1;
    if (data.current < target) {
      data.upTarget[target] = true;
    } else if (data.h > data.DTED[target]) {
      data.downTarget[target] = true;
    }
    addData(target);
  }
});

addEvent(outsideFloor, 'click', function(e) {
  var e = e || window.event;
  var target = e.target;
  var span = outsideFloor.$('span');
  if (target.nodeName.toUpperCase() === 'SPAN') {
    for (var i = 0; i < 8; i++) {
      span[i].removeClass('choose');
    }
    target.addClass('choose');
    data.upAndDownTEMP = parseInt(target.innerHTML) - 1;
  }
  outsideUpAndDown.$('.down.0').style.visibility = span[span.length - 1].hasClass('choose') ? 'hidden' : 'visible';
  outsideUpAndDown.$('.up.0').style.visibility = span[0].hasClass('choose') ? 'hidden' : 'visible';
});

addEvent(outsideUpAndDown, 'click', function(e) {
  var e = e || window.event;
  var target = e.target;
  if (target.nodeName.toUpperCase() === 'I') {
    target = target.parentNode;
  }
  if (target.nodeName.toUpperCase() === 'SPAN') {
    if (target.hasClass('down')) {
      data.upAndDownTarget[data.upAndDownTEMP][0] = true;
      data.downTarget[data.upAndDownTEMP] = true;
      addData(data.upAndDownTEMP);
    }
    if (target.hasClass('up')) {
      data.upAndDownTarget[data.upAndDownTEMP][1] = true;
      data.upTarget[data.upAndDownTEMP] = true;
      addData(data.upAndDownTEMP);
    }
    if (data.way === 0) {
      if (data.h != data.DTED[target]) {
        addData(data.upAndDownTEMP);
      }
    }
  }
});

function addData(target) {
  if (data.way === 0) {
    if (data.current < target) {
      data.way = 2;
    } else if (data.h > data.DTED[target]) {
      data.way = 1;
    }
  }
  voteTime(move);

  function voteTime(method) {
    if (data.open === false) {
      method();
    } else {
      setTimeout(function() {
        voteTime(method);
      }, 20);
    }
  }
}

function move() {
  clearTimeout(RUN);
  RUN = null;
  if (data.way === 2) {
    if (nextTarget(2) !== false) {
      moveUp(nextTarget(2));
    } else if (nextTargetMax(2) !== false) {
      moveUp(nextTargetMax(2));
    }
  }

  if (data.way === 1) {
    if (nextTarget(1) !== false) {
      moveDown(nextTarget(1));
    } else if (nextTargetMax(1) !== false) {
      moveDown(nextTargetMax(1));
    }
  }

  if (data.way === 0) {
    if (data.current != 0) {
      RUN = setTimeout(function() {
        clearTimeout(RUN);
        RUN = null;
        moveDown(0);
      }, 5000);
    }
  }

  function moveUp(target) {
    RUN = setTimeout(function() {
      data.h += data.v;
      if (data.h < data.DTED[target]) {
        moveUp(target);
        dataShowChange();
      }
      if (data.h === data.DTED[target]) {
        insideButtonSpan[insideButtonSpan.length - 3 - target].removeClass('inchoose');
        data.open = true;
        setTimeout(function() {
          data.open = false;
        }, 2000);
        data.upTarget[target] = false;
        data.upAndDownTarget[target][1] = false;
        data.current = target;
        dataShowChange();
        if (!nextTargetMax(2)) {
          data.downTarget[target] = false;
        }
        if (nextTarget(2) !== false) {
          setTimeout(function() {
            moveUp(nextTarget(2));
          }, 2000);
        } else if (nextTargetMax(2) !== false) {
          setTimeout(function() {
            moveUp(nextTargetMax(2));
          }, 2000);
        } else if (nextTarget(1) !== false) {
          setTimeout(function() {
            data.way = 1;
            move();
          }, 2000);
        } else {
          data.way = 0;
          move();
        }
      }
    }, 100);
  }

  function moveDown(target) {
    RUN = setTimeout(function() {
      data.h -= data.v;
      dataShowChange();
      if (data.h > data.DTED[target]) {
        moveDown(target);
        dataShowChange();
      }
      if (data.h === data.DTED[target]) {
        insideButtonSpan[insideButtonSpan.length - 3 - target].removeClass('inchoose');
        data.open = true;
        setTimeout(function() {
          data.open = false;
        }, 2000);
        data.downTarget[target] = false;
        data.upAndDownTarget[target][0] = false;
        data.current = target;
        dataShowChange();
        if (!nextTargetMax(1)) {
          data.upTarget[target] = false;
        }
        if (nextTarget(1) !== false) {
          setTimeout(function() {
            moveDown(nextTarget(1));
          }, 2000);
        } else if (nextTargetMax(1) !== false) {
          setTimeout(function() {
            moveDown(nextTargetMax(1));
          }, 2000);
        } else if (nextTarget(2) !== false) {
          setTimeout(function() {
            data.way = 2;
            move();
          }, 2000);
        } else {
          data.way = 0;
          move();
        }
      }
    }, 100);
  }

  function dataShowChange() {
    dataSpan[0].innerHTML = parseInt(data.current) + 1;
    dataSpan[1].innerHTML = data.h;
    dataSpan[2].innerHTML = openOrClose();
    currentChangedByHeight();

    function openOrClose() {
      return data.open ? '开' : '关';
    };
  }

  function currentChangedByHeight() {
    for (var i = 7; i >= 0; i--) {
      if (data.h >= data.DTED[i]) {
        data.current = i;
        break;
      }
    }
    var h = 190 - data.h / data.height * 190;
    rect.setAttribute('y', h);
  }
}

function nextTarget(way) {
  if (way === 2) {
    for (var i = data.current; i < 8; i++) {
      if (data.upTarget[i] === true) {
        return i;
      }
    }
    return false;
  } else if (way === 1) {
    for (var i = data.current; i >= 0; i--) {
      if (data.downTarget[i] === true) {
        return i;
      };
    }
    return false;
  }
}

function nextTargetMax(way) {
  if (way === 2) {
    for (var i = 7; data.DTED[i] > data.DTED[data.current]; i--) {
      if (data.downTarget[i] === true) {
        return i;
      }
    }
    return false;
  } else if (way === 1) {
    for (var i = 0; i < data.current; i++) {
      if (data.upTarget[i] === true) {
        return i;
      };
    }
    return false;
  }
}

//样式事件
addEvent(inside, 'mouseover', function(e) {
  var e = e || window.event;
  var target = e.target;
  if (target.nodeName.toUpperCase() === 'SPAN') {
    target.addClass('hover');
  }
  if (target.nodeName.toUpperCase() === 'I') {
    target.parentNode.addClass('hover');
  }
});

//样式事件
addEvent(inside, 'mouseout', function(e) {
  var e = e || window.event;
  var target = e.target;
  if (target.nodeName.toUpperCase() === 'SPAN') {
    target.removeClass('hover');
  }
  if (target.nodeName.toUpperCase() === 'I') {
    target.parentNode.removeClass('hover');
  }
});

//样式事件
addEvent(outside, 'mouseover', function(e) {
  var e = e || window.event;
  var target = e.target;
  if (target.nodeName.toUpperCase() === 'SPAN') {
    target.addClass('hover');
  }
  if (target.nodeName.toUpperCase() === 'I') {
    target.parentNode.addClass('hover');
  }
});

//样式事件
addEvent(outside, 'mouseout', function(e) {
  var e = e || window.event;
  var target = e.target;
  if (target.nodeName.toUpperCase() === 'SPAN') {
    target.removeClass('hover');
  }
  if (target.nodeName.toUpperCase() === 'I') {
    target.parentNode.removeClass('hover');
  }
});