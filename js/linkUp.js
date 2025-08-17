var content = $('.content.0'),
  scoreSpan = content.$('.score.0 span.0'),
  surplus = content.$('.surplus.0'),
  surplusSpan = surplus.$('span.0'),
  pause = content.$('.pause.0'),
  mainViewBox = content.$('.box.0'),
  SVG = $('#lineRoute'),
  cellMask = content.$('.cellMask.0'),
  starButton = cellMask.$('.starButton.0'),
  final = cellMask.$('.final.0'),
  finalTime = final.$('span.0');
var TIME;

window.onload = function() {
  delayedLoadingPublicPictures('../');
  createFrame();
}

data = {
  row: 8,
  col: 14,
  type: 8,
  box: [],
  surplus: 0,
  time: 0,
  tempRoute: [],
  preChoose: null
}

//创建DIV、SPAN 框架元素
function createFrame() {
  for (var i = 0; i < data.row; i++) {
    var row = new Array(data.row);
    row[i] = document.createElement('div');
    row[i].setAttribute('row', i + 1);
    for (var j = 0; j < data.col; j++) {
      var col = new Array(data.col);
      col[j] = document.createElement('span');
      col[j].setAttribute('boxType', 0);
      col[j].setAttribute('col', j + 1);
      row[i].appendChild(col[j]);
    }
    mainViewBox.appendChild(row[i]);
  }
}

addEvent(starButton, 'click', start);

addEvent(pause, 'click', function(e) {
  clearInterval(TIME);
  TIME = null;
  pause.style.display = 'none';
  starButton.innerHTML = '继续游戏';
  cellMask.style.display = 'block';
  cellMask.style.backgroundColor = '#567';
});

addEvent(mainViewBox, 'click', function(e) {
  if (e.target.nodeName.toUpperCase() === 'SPAN') {
    if (e.target.getAttribute('boxType') != 0) {
      if (data.preChoose) {
        data.preChoose.removeClass('choose');
        elimination(data.preChoose, e.target);
        return;
      } else {
        e.target.addClass('choose');
        data.preChoose = e.target;
        return;
      }
    }
  }
  try {
    data.preChoose.removeClass('choose');
    data.preChoose = null;
  } catch (e) {
    return;
  }
});

function start() {
  TIME = null;
  data.time = 0;
  data.surplus = data.row * data.col;
  surplusSpan.innerHTML = data.surplus;
  surplus.style.display = 'block';
  cellMask.style.display = 'none';
  pause.style.display = 'block';
  final.style.display = 'none';
  initialization();
  timer();
  removeEvent(starButton, 'click', start);
  addEvent(starButton, 'click', restart);
}

function restart() {
  cellMask.style.display = 'none';
  pause.style.display = 'block';
  timer();
}

function initialization() {
  data.box = null;
  data.box = new Array(data.row + 2);
  for (var i = 0, len = data.row + 2; i < len; i++) {
    data.box[i] = new Array(data.col + 2);
    for (var j = 0; j < data.col + 2; j++) {
      data.box[i][j] = 0;
    }
  }
  var spanElements = mainViewBox.$('span');
  var spanArray = new Array();
  for (var i = 0, len = spanElements.length; i < len; i++) {
    spanArray[i] = spanElements[i];
  }

  //随机生成配对块
  while (spanArray.length > 0) {
    var type = parseInt(Math.random() * data.type + 1);
    for (var i = 0; i < 2; i++) {
      var index = parseInt(Math.random() * spanArray.length);
      spanArray[index].removeAttribute('class');
      spanArray[index].setAttribute('boxType', type);
      spanArray[index].addClass('type' + type);
      spanArray[index].innerHTML = type;
      spanArray.splice(index, 1);
    }
  }

  //将配对块模型化为data.box
  for (var i = 0, len = spanElements.length; i < len; i++) {
    data.box[parseInt(i / data.col + 1)][parseInt(i % data.col + 1)] = parseInt(spanElements[i].getAttribute('boxType'));
  }
}

//选择两个框，进行判断
function elimination(preElement, nowElement) {
  var preOrdinate = {
    x: parseInt(preElement.parentNode.getAttribute('row')),
    y: parseInt(preElement.getAttribute('col'))
  };
  var nowOrdinate = {
    x: parseInt(nowElement.parentNode.getAttribute('row')),
    y: parseInt(nowElement.getAttribute('col'))
  };

  if (judgement(preOrdinate, nowOrdinate)) {
    showLineRoute();
    preElement.addClass('success');
    nowElement.addClass('success');
    setTimeout(function() {
      eliminateBox();
      data.tempRoute = [];
    }, 200);
  } else {
    if (nowElement.getAttribute('boxType') != 0) {
      nowElement.addClass('choose');
      data.preChoose = nowElement;
    }
  }

  function eliminateBox() {
    preElement.setAttribute('boxType', '0');
    preElement.removeAttribute('class');
    preElement.innerHTML = '';
    nowElement.setAttribute('boxType', '0');
    nowElement.removeAttribute('class');
    nowElement.innerHTML = '';
    data.box[preOrdinate.x][preOrdinate.y] = 0;
    data.box[nowOrdinate.x][nowOrdinate.y] = 0;
    data.preChoose = null;
    data.surplus -= 2;
    surplusSpan.innerHTML = data.surplus;
    if (data.surplus == 0) {
      over();
    }
  }

  function showLineRoute() {
    var SVG_NS = 'http://www.w3.org/2000/svg';
    var polyline = document.createElementNS(SVG_NS, 'polyline');
    pointsData();

    function pointsData() {
      var rote = '';
      var len = data.tempRoute.length;
      while (len--) {
        var point1 = String(Math.max(2, Math.min(718, parseInt(data.tempRoute[len][1]) * 50 - 15)));
        var point2 = String(Math.max(2, Math.min(538, parseInt(data.tempRoute[len][0]) * 65 - 22.5)));
        if (len > 0) {
          rote += point1 + ' ' + point2 + ', ';
        } else {
          rote += point1 + ' ' + point2;
        }
      }
      polyline.setAttribute('points', rote);
      SVG.appendChild(polyline);
      setTimeout(function() {
        SVG.removeChild(polyline);
      }, 200);
    }
  }
}

function judgement(preOrdinate, nowOrdinate) {
  //判断是否点击同一个框
  if (preOrdinate.x == nowOrdinate.x && preOrdinate.y == nowOrdinate.y) {
    return false;
  }

  //判断两个框是否同一类型
  if (data.box[preOrdinate.x][preOrdinate.y] !== data.box[nowOrdinate.x][nowOrdinate.y]) {
    return false;
  }

  //两个框位于同一行
  if (preOrdinate.x === nowOrdinate.x) {
    //相邻
    if (Math.abs(preOrdinate.y - nowOrdinate.y) === 1) {
      lineRoute();
      return true;
    }

    var yMax = Math.max(preOrdinate.y, nowOrdinate.y);
    var yMin = Math.min(preOrdinate.y, nowOrdinate.y);

    //不相邻，直线连接
    var temp = 0;
    for (var y = yMin + 1, len = yMax; y < len; y++) {
      if (data.box[preOrdinate.x][y] !== 0) {
        temp++;
        break;
      }
    }
    if (temp === 0) {
      lineRoute();
      return true;
    }
  }

  //两个框位于同一列
  if (preOrdinate.y === nowOrdinate.y) {
    //相邻
    if (Math.abs(preOrdinate.x - nowOrdinate.x) === 1) {
      lineRoute();
      return true;
    }

    var xMax = Math.max(preOrdinate.x, nowOrdinate.x);
    var xMin = Math.min(preOrdinate.x, nowOrdinate.x);

    //不相邻，直线连接
    var temp = 0;
    for (var x = xMin + 1, len = xMax; x < len; x++) {
      if (data.box[x][preOrdinate.y] !== 0) {
        temp++;
        break;
      }
    }
    if (temp === 0) {
      lineRoute();
      return true;
    }
  }

  //两个框不同行且不同列
  var xMax = Math.max(preOrdinate.x, nowOrdinate.x);
  var xMin = Math.min(preOrdinate.x, nowOrdinate.x);
  var yMax = Math.max(preOrdinate.y, nowOrdinate.y);
  var yMin = Math.min(preOrdinate.y, nowOrdinate.y);

  if (preOrdinate.x > nowOrdinate.x) {
    var temp = preOrdinate;
    preOrdinate = nowOrdinate;
    nowOrdinate = temp;
  }

  //左右搜索
  for (var y = preOrdinate.y, incre = 0, plusMinus = 1; incre < data.col * 2; incre++) {
    y += incre * plusMinus;
    plusMinus = -plusMinus;

    if (y >= 0 && y < data.col + 2) {
      temp = 0;
      retrievalY(y, preOrdinate);
      retrievalY(y, nowOrdinate);

      if (temp > 0) {
        data.tempRoute = [];
        continue;
      }
      for (var x = xMin, len = xMax; x <= len; x++) {
        if (x == preOrdinate.x && y == preOrdinate.y || x == nowOrdinate.x && y == nowOrdinate.y) {
          continue;
        }
        if (data.box[x][y] !== 0) {
          temp++;
          break;
        }
      }
      if (temp > 0) {
        data.tempRoute = [];
        continue;
      }
      if (temp === 0) {
        lineRoute();
        return true;
      }
    }
  }

  function retrievalY(initialValue, ordinate) {
    if (initialValue < ordinate.y) {
      var tempRoute = 0;
      for (var value = initialValue; value < ordinate.y; value++) {
        if (data.box[ordinate.x][value] !== 0) {
          temp++;
          break;
        }
        if (tempRoute == 0) {
          data.tempRoute.push([ordinate.x, value]);
          tempRoute = 1;
        }
      }
    } else if (initialValue > ordinate.y) {
      var tempRoute = 0;
      for (var value = initialValue; value > ordinate.y; value--) {
        if (data.box[ordinate.x][value] !== 0) {
          temp++;
          break;
        }
        if (tempRoute == 0) {
          data.tempRoute.push([ordinate.x, value]);
          tempRoute = 1;
        }
      }
    }
  }

  //上下搜索
  for (var x = preOrdinate.x, incre = 0, plusMinus = 1; incre < data.row * 2; incre++) {
    x += incre * plusMinus;
    plusMinus = -plusMinus;

    if (x >= 0 && x < data.row + 2) {
      temp = 0;
      retrievalX(x, preOrdinate);
      retrievalX(x, nowOrdinate);

      if (temp > 0) {
        data.tempRoute = [];
        continue;
      }
      for (var y = yMin, len = yMax; y <= len; y++) {
        if (x == preOrdinate.x && y == preOrdinate.y || x == nowOrdinate.x && y == nowOrdinate.y) {
          continue;
        }
        if (data.box[x][y] !== 0) {
          temp++;
          break;
        }
      }
      if (temp > 0) {
        data.tempRoute = [];
        continue;
      }
      if (temp === 0) {
        lineRoute();
        return true;
      }
    }
  }

  function retrievalX(initialValue, ordinate) {
    if (initialValue < ordinate.x) {
      var tempRoute = 0;
      for (var value = initialValue; value < ordinate.x; value++) {
        if (data.box[value][ordinate.y] !== 0) {
          temp++;
          break;
        }
        if (tempRoute == 0) {
          data.tempRoute.push([value, ordinate.y]);
          tempRoute = 1;
        }
      }
    } else if (initialValue > ordinate.x) {
      var tempRoute = 0;
      for (var value = initialValue; value > ordinate.x; value--) {
        if (data.box[value][ordinate.y] !== 0) {
          temp++;
          break;
        }
        if (tempRoute == 0) {
          data.tempRoute.push([value, ordinate.y]);
          tempRoute = 1;
        }
      }
    }
  }

  function lineRoute() {
    data.tempRoute.unshift([preOrdinate.x, preOrdinate.y]);
    data.tempRoute.push([nowOrdinate.x, nowOrdinate.y]);
  }

  return false;
}

function timer() {
  TIME = setInterval(function() {
    data.time += 0.1;
    scoreSpan.innerHTML = data.time.toFixed(1);
  }, 100);
}

function over() {
  clearInterval(TIME);
  TIME = null;
  surplus.style.display = 'none';
  final.style.display = 'block';
  finalTime.innerHTML = data.time.toFixed(1);
  cellMask.style.display = 'block';
  cellMask.style.backgroundColor = 'rgba(17, 34, 63, 0.6)';
  pause.style.display = 'none';
  starButton.innerHTML = '再来一局';
  removeEvent(starButton, 'click', restart);
  addEvent(starButton, 'click', start);
}