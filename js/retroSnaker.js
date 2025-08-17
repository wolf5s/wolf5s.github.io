var content = right.$('.content.0'),
  scoreBox = content.$('.score.0'),
  pauseButton = content.$('.pause.0'),
  timeBox = content.$('.time.0'),
  mainViewBox = content.$('.box.0'),
  cellMask = content.$('.cellMask.0'),
  starButton = cellMask.$('.starButton.0'),
  final = cellMask.$('.final.0');
var TIME, GAMERUN;

window.onload = function() {
  delayedLoadingPublicPictures('../');
  createFrame();
  if (!judgeWidth()) {
    mobileControl();
  }
}

var data = {
  row: 20,
  col: 30,
  start: false,
  pause: false,
  box: [],
  pretreatmentDirection: 1, //1上2右3下4左
  direction: 1, //1上2右3下4左
  snake: [],
  eattingPoint: [],
  time: 0,
  score: 0
}

addEvent(starButton, 'click', starGame);
addEvent(document, 'keydown', keydownChange);
addEvent(pauseButton, 'click', pauseGame);

function mobileControl() {
  var mobileControl = $('#mobileControl'),
    controlCanvas = $('#controlCanvas'),
    mobileButton = $('#mobileButton');
  _drawControl(100);
  _mobileControlTouch(mobileControl);

  function _drawControl(length) {
    controlCanvas.width = length;
    controlCanvas.height = length;
    var context = controlCanvas.getContext('2d');
    context.beginPath();
    context.arc(length / 2, length / 2, length / 2, 0, 2 * Math.PI);
    context.clip();
    context.strokeStyle = "rgba(17, 34, 51, 0.5)";
    context.lineWidth = 5;
    _drawArc(context, 0, 0);
    _drawArc(context, 0, length);
    _drawArc(context, length, 0);
    _drawArc(context, length, length);

    function _drawArc(ctx, x, y) {
      ctx.beginPath();
      ctx.arc(x, y, length / 2.5, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }

  function _mobileControlTouch(element) {
    var buttonX, buttonY, length = 50;
    var elementPosition = element.getBoundingClientRect();

    addEvent(element, 'touchstart', function(e) {
      __buttonMove(e, true);
    });

    addEvent(element, 'touchmove', function(e) {
      __buttonMove(e, true);
    });

    addEvent(element, 'touchend', function(e) {
      var touch = e.changedTouches;
      __buttonMove(e, false);
    });

    function __buttonMove(e, flag) {
      if (flag) {
        e.preventDefault();
        var touch = e.changedTouches;
        buttonX = touch[0].clientX - elementPosition.left - length;
        buttonY = touch[0].clientY - elementPosition.top - length;
      } else {
        buttonX = 0;
        buttonY = 0;
      }
      if (buttonX * buttonX + buttonY * buttonY > length * length) {
        var angle = Math.atan(buttonY / buttonX);
        if (buttonX < 0) {
          buttonX = -Math.cos(angle) * length;
          buttonY = -Math.sin(angle) * length;
        } else if (buttonX > 0) {
          buttonX = Math.cos(angle) * length;
          buttonY = Math.sin(angle) * length;
        } else {
          buttonX = 0;
        }
      }
      if (flag) {
        __cons(buttonX, buttonY);
      }
      mobileButton.style.left = buttonX + length / 2 + 'px';
      mobileButton.style.top = buttonY + length / 2 + 'px';

      function __cons(buttonX, buttonY) {
        if (buttonX * buttonX + buttonY * buttonY > 50 * 50) {
          if (Math.abs(buttonX) > Math.abs(buttonY)) {
            changeDirection(buttonX > 0 ? 2 : 4);
          } else {
            changeDirection(buttonY > 0 ? 3 : 1);
          }
        }
      }
    }
  }
}

function createFrame() {
  mainViewBox.innerHTML = '';
  data.box = new Array(data.row);
  for (var i = 0; i < data.row; i++) {
    data.box[i] = new Array(data.col);
    var row = new Array(data.row);
    row[i] = document.createElement('div');
    row[i].setAttribute('row', i);
    for (var j = 0; j < data.col; j++) {
      var col = new Array(data.col);
      col[j] = document.createElement('span');
      col[j].setAttribute('col', j);
      row[i].appendChild(col[j]);
      data.box[i][j] = col[j];
    }
    mainViewBox.appendChild(row[i]);
  }
}

function starGame() {
  dataReset();
  data.pretreatmentDirection = parseInt(Math.random() * 100 % 4 + 1);
  data.direction = data.pretreatmentDirection;
  switch (data.direction) {
    case 1:
      data.snake.push([data.snake[0][0] + 1, data.snake[0][1]]);
      data.snake.push([data.snake[0][0] + 2, data.snake[0][1]]);
      break;
    case 2:
      data.snake.push([data.snake[0][0], data.snake[0][1] - 1]);
      data.snake.push([data.snake[0][0], data.snake[0][1] - 2]);
      break;
    case 3:
      data.snake.push([data.snake[0][0] - 1, data.snake[0][1]]);
      data.snake.push([data.snake[0][0] - 2, data.snake[0][1]]);
      break;
    case 4:
      data.snake.push([data.snake[0][0], data.snake[0][1] + 1]);
      data.snake.push([data.snake[0][0], data.snake[0][1] + 2]);
      break;
  }
  createEatPoing();
  draw();
  GAMERUN = setInterval(running, 200);
  TIME = setInterval(timeAdd, 100);

  function dataReset() {
    cellMask.style.display = 'none';
    pauseButton.style.display = 'inline-block';
    data.start = true;
    data.snake = [
      [10, 15]
    ];
    data.time = 0;
    data.score = 0;
    timeBox.innerHTML = PrefixInteger(data.time, 3);
    scoreBox.innerHTML = PrefixInteger(data.score, 3);
  }
}

function pauseGame() {
  if (data.pause === false) {
    data.pause = true;
    pauseButton.innerHTML = 'CONTINUE';
    clearInterval(TIME);
    clearInterval(GAMERUN);
  } else if (data.pause === true) {
    data.pause = false;
    pauseButton.innerHTML = 'PAUSE';
    GAMERUN = setInterval(running, 200);
    TIME = setInterval(timeAdd, 100);
  }
}

function timeAdd() {
  data.time += 1;
  timeBox.innerHTML = PrefixInteger(parseInt(data.time / 10), 3);
}

function keydownChange(e) {
  var keynum = window.event ? e.keyCode : e.which;
  switch (keynum) {
    //左
    case 37:
      changeDirection(4);
      break;
      //上
    case 38:
      changeDirection(1);
      break;
      //右
    case 39:
      changeDirection(2);
      break;
      //下
    case 40:
      changeDirection(3);
      break;
  }
}

function changeDirection(direction) {
  if ((direction === 2 || direction === 4) && (data.direction === 1 || data.direction === 3)) {
    data.pretreatmentDirection = direction;
  }
  if ((direction === 1 || direction === 3) && (data.direction === 2 || data.direction === 4)) {
    data.pretreatmentDirection = direction;
  }
}

function running() {
  if (data.pretreatmentDirection != data.direction) {
    data.direction = data.pretreatmentDirection;
  }
  var head = [data.snake[0][0], data.snake[0][1]];
  switch (data.direction) {
    case 1:
      data.snake.unshift([data.snake[0][0] - 1, data.snake[0][1]]);
      break;
    case 2:
      data.snake.unshift([data.snake[0][0], data.snake[0][1] + 1]);
      break;
    case 3:
      data.snake.unshift([data.snake[0][0] + 1, data.snake[0][1]]);
      break;
    case 4:
      data.snake.unshift([data.snake[0][0], data.snake[0][1] - 1]);
      break;
  }
  if (head[0] === data.eattingPoint[0] && head[1] === data.eattingPoint[1]) {
    createEatPoing();
    data.score += 1;
    scoreBox.innerHTML = PrefixInteger(data.score, 3);
  } else {
    data.snake.pop();
  }
  if (judgeFail()) {
    gameFail();
    return;
  }
  draw();
}

function createEatPoing() {
  do {
    var flag = false;
    var row = parseInt(Math.random() * 600 % data.row);
    var col = parseInt(Math.random() * 600 % data.col);
    for (var i = 0; i < data.snake.length; i++) {
      if (data.snake[i][0] === row && data.snake[i][1] === col) {
        flag = true;
        break;
      }
    }
  } while (flag)
  data.eattingPoint = [row, col];
}

function judgeFail() {
  //碰壁
  if (data.snake[0][0] < 0 || data.snake[0][0] > data.row - 1 || data.snake[0][1] < 0 || data.snake[0][1] > data.col - 1) {
    return true;
  }
  //碰自身
  for (var i = 1, len = data.snake.length; i < len; i++) {
    if (data.snake[0][0] === data.snake[i][0] && data.snake[0][1] === data.snake[i][1]) {
      return true;
    }
  }
}

function gameFail() {
  clearInterval(GAMERUN);
  clearInterval(TIME);
  cellMask.style.display = 'block';
  starButton.innerHTML = '重新开始';
  var finalSpan = final.$('span.0');
  final.style.display = 'inline-block';
  finalSpan.innerHTML = parseInt(data.time / 10);
  pauseButton.style.display = 'none';
}

function draw() {
  for (var i = 0; i < data.row; i++) {
    for (var j = 0; j < data.col; j++) {
      data.box[i][j].className = '';
    }
  }
  data.box[data.snake[0][0]][data.snake[0][1]].addClass('head');
  data.box[data.snake[0][0]][data.snake[0][1]].addClass('head' + data.direction);
  for (var i = 1, len = data.snake.length; i < len; i++) {
    data.box[data.snake[i][0]][data.snake[i][1]].addClass('body');
  }
  data.box[data.eattingPoint[0]][data.eattingPoint[1]].addClass('eatPoint');
}

function PrefixInteger(num, n) {
  return (Array(n).join(0) + num).slice(-n);
}