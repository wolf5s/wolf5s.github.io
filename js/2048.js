var content = $('.content.0'),
  score = content.$('.score.0'),
  scoreSpan = score.$('span.0'),
  cell = content.$('.cell.0'),
  moblieControl = content.$('.moblieControl.0'),
  cellMask = content.$('.cellMask.0'),
  restartButton = cellMask.$('.restart.0'),
  changeButton = $('#change');


var data = {
  start: true,
  value: [],
  length: 4,
  step: 0,
  score: 0,
  moveEvent: false,
  sides: 60,
  correct: 1,
  isMobile: false,
  box: null
}

window.onload = function() {
  delayedLoadingPublicPictures('../');
  if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) {
    data.correct = 0.5;
    data.isMobile = true;
  }
  if (data.isMobile) {
    data.sides = 100;
    addEvent(moblieControl, 'touchstart', function(e) {
      e = e || window.event;
      if (e.target.hasClass('triangle')) {
        e.target.addClass('hover');
      }
      setTimeout(function() {
        e.target.removeClass('hover');
      }, 200);
    });
  }
  data.value[0] = '&nbsp;';
  for (var i = 1; i < 16; i++) {
    data.value[i] = Math.pow(2, i);
  }
  createCell(data.length);
  starGame(data.length);
}

addEvent(changeButton, 'click', function() {
  var changeLength = Number($('#length').value);
  if (changeLength >= 4 && changeLength <= 7 && _isInteger(changeLength)) {
    data.length = changeLength;
    if (data.isMobile) {
      data.sides = data.length >= 6 ? 75 : 100;
    }
    restart();
  }

  function _isInteger(obj) {
    return typeof obj === 'number' && obj % 1 === 0;
  }
});

addEvent(restartButton, 'click', restart);

function restart() {
  cellMask.style.display = 'none';
  data.score = 0;
  scoreSpan.innerHTML = data.score;
  createCell(data.length);
  starGame(data.length);
}

function createCell(length) {
  cell.innerHTML = '';
  if (data.isMobile) {
    if (data.length >= 6) {
      cell.addClass('long');
    } else {
      cell.removeClass('long');
    }
  }
  var row = new Array(length);
  for (var i = 0; i < length; i++) {
    row[i] = document.createElement('div');
    for (var j = 0; j < length; j++) {
      var col = new Array(length);
      col[j] = document.createElement('span');
      col[j].setAttribute('boxType', '0');
      col[j].innerHTML = '&nbsp;';
      row[i].appendChild(col[j]);
    }
    cell.appendChild(row[i]);
  }
  cell.style.width = length * data.sides * data.correct + 'px';
  if (data.isMobile) {
    moblieControl.style.width = length * data.sides * data.correct + 'px';
    moblieControl.style.height = length * data.sides * data.correct + 'px';
    moblieControl.style.marginLeft = -(length * data.sides) / 2 * data.correct - 5 + 'px';
    if(data.length>=6){
      moblieControl.style.top = '2px';
    }
  }
  cellMask.style.width = length * data.sides * data.correct + 'px';
  cellMask.style.height = length * data.sides * data.correct + 'px';
  cellMask.style.marginLeft = -(length * data.sides) / 2 * data.correct - 5 + 'px';
}

function starGame(length) {
  data.box = null;
  data.box = new Array(length);
  var row = cell.$('div');
  for (var i = 0; i < length; i++) {
    data.box[i] = row[i].$('span');
  }
  if (data.moveEvent === false) {
    if (!data.isMobile) {
      addEvent(document, 'keydown', function(e) {
        var keynum = window.event ? e.keyCode : e.which;
        switch (keynum) {
          //左
          case 37:
            moveBox(data.box, 'left');
            break;
            //上
          case 38:
            moveBox(data.box, 'top');
            break;
            //右
          case 39:
            moveBox(data.box, 'right');
            break;
            //下
          case 40:
            moveBox(data.box, 'bottom');
            break;
        }
      });
    } else if (data.isMobile) {
      addEvent(moblieControl, 'touchstart', function(e) {
        e = e || window.event;
        if (e.target.hasClass('controlLeft')) {
          moveBox(data.box, 'left');
        }
        if (e.target.hasClass('controlTop')) {
          moveBox(data.box, 'top');
        }
        if (e.target.hasClass('controlRight')) {
          moveBox(data.box, 'right');
        }
        if (e.target.hasClass('controlBottom')) {
          moveBox(data.box, 'bottom');
        }
      });
    }
    data.moveEvent = true;
  }

  //增加格子
  initializeBox(data.box, length);
}

function fail() {
  cellMask.$('p.0').style.marginTop = (data.length - 3) * data.sides / 2 + 'px';
  cellMask.$('p.1').innerHTML = data.score;
  data.step = 0;
  cellMask.style.display = 'block';
}

//初始化格子
function initializeBox(box, length) {
  var createBox = surplus(box, length);
  if (createBox === 0 && adjoinBox(box, length)) {
    fail();
    return 0;
  }
  while (createBox > 0) {
    var x = parseInt(Math.random() * length);
    var y = parseInt(Math.random() * length);
    if (box[x][y].getAttribute('boxType') === '0') {
      box[x][y].innerHTML = data.value[1];
      box[x][y].setAttribute('boxType', '1');
      box[x][y].setAttribute('class', 'type1');
      createBox--;
    }
  }

  function surplus(box, length) {
    var surplusBox = 0;
    for (var i = 0; i < length; i++) {
      for (var j = 0; j < length; j++) {
        if (box[i][j].getAttribute('boxType') === '0') {
          surplusBox++;
          if (surplusBox >= 2) {
            return surplusBox;
          }
        }
      }
    }
    return surplusBox;
  }
}

function moveBox(box, direction) {
  var length = data.length;
  data.step++;
  mergeBox(box, data.length, direction);

  var x, y;
  if (direction === 'left' || direction === 'top') {
    for (var i = 0; i < length; i++) {
      var empty = 0;
      for (var j = 0; j < length; j++) {
        if (direction === 'left') {
          x = i;
          y = j;
        } else if (direction === 'top') {
          x = j;
          y = i;
        }
        var boxType = box[x][y].getAttribute('boxType');
        if (boxType !== '0') {
          move(box, x, y, empty, boxType, direction);
          empty++;
        }
      }
    }
  }

  if (direction === 'right' || direction === 'bottom') {
    for (var i = length - 1; i >= 0; i--) {
      var empty = length - 1;
      for (var j = length - 1; j >= 0; j--) {
        if (direction === 'right') {
          x = i;
          y = j;
        } else if (direction === 'bottom') {
          x = j;
          y = i;
        }
        var boxType = box[x][y].getAttribute('boxType');
        if (boxType !== '0') {
          move(box, x, y, empty, boxType, direction);
          empty--;
        }
      }
    }
  }

  initializeBox(box, length);

  function move(box, x, y, empty, boxType, direction) {
    tempAttribute = boxType;
    tempInnerHTML = box[x][y].innerHTML;
    box[x][y].setAttribute('boxType', '0');
    box[x][y].setAttribute('class', '');
    box[x][y].innerHTML = '&nbsp;';
    if (direction === 'left' || direction === 'right') {
      box[x][empty].setAttribute('boxType', tempAttribute);
      box[x][empty].setAttribute('class', 'type' + tempAttribute);
      box[x][empty].innerHTML = tempInnerHTML;
    } else if (direction === 'top' || direction === 'bottom') {
      box[empty][y].setAttribute('boxType', tempAttribute);
      box[empty][y].setAttribute('class', 'type' + tempAttribute);
      box[empty][y].innerHTML = tempInnerHTML;
    }
  }

  function mergeBox(box, length, direction) {
    var x, y;

    if (direction === 'left' || direction === 'top') {
      for (var i = 0; i < length; i++) {
        var boxPre, boxTypeTemp;
        var mergeState = 0;
        for (var j = 0; j < length; j++) {
          if (direction === 'left') {
            x = i;
            y = j;
          } else if (direction === 'top') {
            x = j;
            y = i;
          }
          var boxType = box[x][y].getAttribute('boxType');
          if (boxType === '0') {
            continue;
          } else {
            if (mergeState === 0) {
              boxPre = box[x][y];
              boxPreType = boxPre.getAttribute('boxType');
              mergeState = 1;
              continue;
            }
            if (mergeState === 1) {
              if (boxPreType === boxType) {
                mergeSuccess(box, x, y, boxPre);
                mergeState = 0;
              } else {
                boxPre = box[x][y];
                boxPreType = boxPre.getAttribute('boxType');
              }
            }
          }
        }
      }
    }

    if (direction === 'right' || direction === 'bottom') {
      for (var i = length - 1; i >= 0; i--) {
        var boxPre, boxTypeTemp;
        var mergeState = 0;
        for (var j = length - 1; j >= 0; j--) {
          if (direction === 'right') {
            x = i;
            y = j;
          } else if (direction === 'bottom') {
            x = j;
            y = i;
          }
          var boxType = box[x][y].getAttribute('boxType');
          if (boxType === '0') {
            continue;
          } else {
            if (mergeState === 0) {
              boxPre = box[x][y];
              boxPreType = boxPre.getAttribute('boxType');
              mergeState = 1;
              continue;
            }
            if (mergeState === 1) {
              if (boxPreType === boxType) {
                mergeSuccess(box, x, y, boxPre);
                mergeState = 0;
              } else {
                boxPre = box[x][y];
                boxPreType = boxPre.getAttribute('boxType');
              }
            }
          }
        }
      }
    }

    function mergeSuccess(box, x, y, boxPre) {
      boxPre.setAttribute('boxType', parseInt(boxType) + 1);
      boxPre.setAttribute('class', 'type' + parseInt(boxType) + 1);
      boxPre.innerHTML = data.value[parseInt(boxType) + 1];
      box[x][y].setAttribute('boxType', '0');
      box[x][y].setAttribute('class', '');
      box[x][y].innerHTML = '&nbsp;';
      data.score += Math.pow(2, parseInt(boxType) + 1);
      scoreSpan.innerHTML = data.score;
    }
  }
}

function adjoinBox(box, length) {
  for (var i = 0; i < length; i++) {
    for (var j = 0; j < length - 1; j++) {
      if (box[i][j].getAttribute('boxType') === box[i][j + 1].getAttribute('boxType')) {
        return false;
      }
      if (box[j][i].getAttribute('boxType') === box[j + 1][i].getAttribute('boxType')) {
        return false;
      }
    }
  }
  return true;
}