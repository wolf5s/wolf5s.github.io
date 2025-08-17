var content = $('.content.0'),
  chessBoard = $('#chessBoard'),
  PVE = $('#PVE'),
  weUpperHand = $('#weUpperHand'),
  aiUpperHand = $('#aiUpperHand'),
  PVP = $('#PVP'),
  forbiddenMoves = $('#forbiddenMoves'),
  forbiddenMovesText = forbiddenMoves.parentNode.$('span.0'),
  startButton = $('#startButton'),
  historyDiv = $('#showHistory'),
  inGameDiv = $('#inGame'),
  currentColor = inGameDiv.$('span.0'),
  falseMove = inGameDiv.$('.falseMove.0'),
  surrender = inGameDiv.$('.surrender.0');

var data = {
  chessLength: 35,
  chess: [],
  chessStep: [],
  currentPlayer: 0, // 默认黑子先手，0为当前黑执子，1为当前白执子
  currentStep: 0,
  amai: false,
  weUpperHand: true,
  forbiddenMoves: false,
  mobile: false
}

window.onload = function() {
  delayedLoadingPublicPictures('../');
  if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) {
    data.chessLength = 17;
    data.mobile = true;
  }
  createFrame(data.chessLength);
}

addEvent(startButton, 'click', startGame);
addEvent(PVE, 'click', function() {
  weUpperHand.removeAttribute('disabled');
  aiUpperHand.removeAttribute('disabled');
});
addEvent(PVP, 'click', function() {
  weUpperHand.setAttribute('disabled', true);
  aiUpperHand.setAttribute('disabled', true);
});

function startGame() {
  createFrame(data.chessLength);
  resetData();
  addEvent(chessBoard, 'click', playing);
  addEvent(falseMove, 'click', revoke);
  addEvent(surrender, 'click', function() {
    playerWin(data.currentPlayer, false);
  });
  addEvent(historyDiv, 'click', showHistory);
  if (data.amai === true && data.weUpperHand === false) {
    var position = amai(data.chess, data.currentPlayer);
    playChess(position.x, position.y);
  }
}

function resetData() { //data.chess数据重置
  data.chess = [];
  data.chess = new Array(15);
  for (var i = 0; i < 15; i++) {
    data.chess[i] = new Array(15);
    for (var j = 0; j < 15; j++) {
      data.chess[i][j] = false; //false无子，0黑子，1白子
    }
  }
  data.chessStep = [];
  data.currentPlayer = 0;
  data.currentStep = 0;
  PVE.checked ? data.amai = true : data.amai = false;
  weUpperHand.checked ? data.weUpperHand = true : data.weUpperHand = false;
  forbiddenMoves.checked ? data.forbiddenMoves = true : data.forbiddenMoves = false;
  PVE.setAttribute('disabled', true);
  weUpperHand.setAttribute('disabled', true);
  aiUpperHand.setAttribute('disabled', true);
  PVP.setAttribute('disabled', true);
  forbiddenMoves.setAttribute('disabled', true);
  inGameDiv.style.display = 'block';
  startButton.style.display = 'none';
  historyDiv.style.display = 'none';
  currentColor.innerHTML = data.currentPlayer === 0 ? '黑' : '白';
  falseMove.addClass('disabled');
}

function createFrame(length) { //创建canvas chessBoard棋盘
  chessBoard.width = length * 16;
  chessBoard.height = length * 16;
  var context = chessBoard.getContext('2d');
  _drawBoard(context, length * 16, length * 16);
  _shadowReset(context);
  _drawLine(context);
  _drawPoint(context);

  function _drawBoard(cxt, width, height) {
    cxt.beginPath();
    var bgColor = cxt.createLinearGradient(0, 0, width, height);
    bgColor.addColorStop(0, '#ffbf5f');
    bgColor.addColorStop(1, '#9b5f2b');
    cxt.fillStyle = bgColor;
    cxt.shadowColor = '#000';
    cxt.shadowOffsetX = 5;
    cxt.shadowOffsetY = 5;
    cxt.shadowBlur = 5;
    cxt.fillRect(length - 20, length - 20, length * 14 + 20 * 2, length * 14 + 20 * 2);
  }

  function _drawLine(cxt) {
    cxt.fillStyle = "#000";
    cxt.lineCap = 'square';
    cxt.lineWidth = data.mobile ? 1 : 2;
    for (var i = 1; i <= 15; i++) {
      cxt.beginPath();
      cxt.moveTo(length, i * length);
      cxt.lineTo(length * 15, i * length);
      cxt.stroke();
    }
    for (var i = 1; i <= 15; i++) {
      cxt.beginPath();
      cxt.moveTo(i * length, length);
      cxt.lineTo(i * length, length * 15);
      cxt.stroke();
    }
  }

  function _drawPoint(cxt) {
    var pointPosition = [
      [4, 4],
      [4, 12],
      [8, 8],
      [12, 4],
      [12, 12]
    ];
    var radius = data.mobile ? 3 : 5;
    for (var i = 0, len = pointPosition.length; i < len; i++) {
      cxt.beginPath();
      cxt.arc(pointPosition[i][0] * length, pointPosition[i][1] * length, radius, 0, 2 * Math.PI);
      cxt.fill();
    }
  }

  function _shadowReset(cxt) {
    cxt.shadowOffsetX = 0;
    cxt.shadowOffsetY = 0;
    cxt.shadowBlur = 0;
  }
}

function playing(e) { //游戏开始后在棋盘落子
  var e = e || window.e;
  if (_clickPosition(e) !== false) {
    var clickX = _clickPosition(e).clickX;
    var clickY = _clickPosition(e).clickY;
    if (playChess(clickX, clickY) && data.amai === true) {
      var position = amai(data.chess, data.currentPlayer, data.forbiddenMoves);
      playChess(position.x, position.y);
    }
  }

  function _clickPosition(e) {
    var clickX = parseInt((_getMousePos(e).x + data.chessLength / 2) / data.chessLength - 1);
    var clickY = parseInt((_getMousePos(e).y + data.chessLength / 2) / data.chessLength - 1);
    var x = _getMousePos(e).x - (clickX + 1) * data.chessLength;
    var y = _getMousePos(e).y - (clickY + 1) * data.chessLength;
    var deviation = x * x + y * y;
    if (deviation < Math.pow((parseInt(data.chessLength / 2) - 3), 2)) {
      return {
        clickX,
        clickY
      };
    } else {
      return false;
    }

    function _getMousePos(e) {
      var x = e.clientX - chessBoard.getBoundingClientRect().left;
      var y = e.clientY - chessBoard.getBoundingClientRect().top;
      return {
        'x': x,
        'y': y
      };
    }
  }
}

function playChess(clickX, clickY) {
  if (data.chess[clickY][clickX] === false) {
    if (data.forbiddenMoves === true && data.currentPlayer === 0) {
      if (judgeForbiddenMoves(data.chess, clickY, clickX, 0)) {
        forbiddenMovesPrompt();
        return;
      }
    }
    createFrame(data.chessLength);
    var x, y;
    for (var i = 0, len = data.chessStep.length; i < len; i++) {
      x = data.chessStep[i][0];
      y = data.chessStep[i][1];
      drawChess(y, x, data.chess[x][y], false);
    }
    data.chess[clickY][clickX] = data.currentPlayer;
    data.chessStep[data.currentStep] = [clickY, clickX];
    drawChess(clickX, clickY, data.currentPlayer, true);
    if (judgeContinuity(data.currentPlayer, clickY, clickX, 5) !== false) {
      playerWin(data.currentPlayer, true);
      return false;
    }
    data.currentPlayer = (data.currentPlayer + 1) % 2;
    data.currentStep++;
    data.currentStep >= 2 ? falseMove.removeClass('disabled') : falseMove.addClass('disabled');
    if (data.currentStep === 225) {
      playerWin(data.currentPlayer, true);
      return false;
    }
    currentColor.innerHTML = data.currentPlayer === 0 ? '黑' : '白';
    return true;
  }
  return false;
}

function revoke() {
  var len = Math.min(2, data.currentStep);
  if (len < 2) {
    return false;
  } else
    while (len--) {
      _resetChess(data.chessStep[data.currentStep - 1][0], data.chessStep[data.currentStep - 1][1]);
    }
  createFrame(data.chessLength);
  for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 15; j++) {
      if (data.chess[i][j] !== false) {
        drawChess(j, i, data.chess[i][j]);
      }
    }
  }
  if (data.currentStep > 0) {
    drawSign(data.chessStep[data.currentStep - 1][1], data.chessStep[data.currentStep - 1][0]);
  }
  data.currentStep >= 2 ? falseMove.removeClass('disabled') : falseMove.addClass('disabled');

  function _resetChess(i, j) {
    data.chess[i][j] = false;
    data.currentStep--;
    data.chessStep.length = data.currentStep;
  }

  drawSign()
}

function showHistory() {
  removeEvent(historyDiv, 'click', showHistory);
  createFrame(data.chessLength);
  var x, y;
  for (var i = 0, len = data.chessStep.length; i < len; i++) {
    x = data.chessStep[i][0];
    y = data.chessStep[i][1];
    drawChess(y, x, data.chess[x][y], false);
    _drawNumber(y, x, data.chess[x][y], i);
  }

  function _drawNumber(clickX, clickY, type, number) {
    var x = (clickX + 1) * data.chessLength;
    var y = (clickY + 1) * data.chessLength;
    var cxt = chessBoard.getContext('2d');
    var fontSize = data.chessLength / 2.5;
    cxt.beginPath();
    type === 0 ? cxt.fillStyle = '#fff' : cxt.fillStyle = '#000';
    cxt.font = 'bold ' + fontSize + 'px Microsoft YaHei';
    cxt.textAlign = 'center';
    cxt.textBaseline = 'middle';
    cxt.fillText(number + 1, x, y);
  }
}

function drawChess(clickX, clickY, type, sign) {
  var x = (clickX + 1) * data.chessLength;
  var y = (clickY + 1) * data.chessLength;
  var chessRadius = data.chessLength / 2.5;
  var cxt = chessBoard.getContext('2d');
  cxt.beginPath();
  var chessColor = cxt.createRadialGradient(x - chessRadius / 2, y + chessRadius / 2, chessRadius, x + chessRadius / 2, y - chessRadius / 2, chessRadius);
  if (type === 0) {
    chessColor.addColorStop(0, '#444');
    chessColor.addColorStop(1, '#000');
  } else {
    chessColor.addColorStop(0, '#111');
    chessColor.addColorStop(1, '#fff');
  }
  cxt.fillStyle = chessColor;
  cxt.arc(x, y, chessRadius, 0, 2 * Math.PI);
  cxt.fill();
  if (type === 0) {
    cxt.beginPath();
    cxt.fillStyle = 'rgba(255, 255, 255, 0.8)';
    cxt.arc(x + data.chessLength / 5, y - data.chessLength / 8.75, chessRadius / 5, 0, 2 * Math.PI);
    cxt.fill();
  }
  if (sign) {
    drawSign(clickX, clickY);
  }
}

function drawSign(clickX, clickY) {
  var x = (clickX + 1) * data.chessLength;
  var y = (clickY + 1) * data.chessLength;
  var baseLength = data.chessLength / 8.75
  var cxt = chessBoard.getContext('2d');
  cxt.beginPath();
  cxt.strokeStyle = "red";
  cxt.lineCap = "square";
  cxt.lineWidth = data.mobile ? 2 : 4;
  cxt.moveTo(x - baseLength * 4, y - baseLength * 3);
  cxt.lineTo(x - baseLength * 4, y - baseLength * 4);
  cxt.lineTo(x - baseLength * 3, y - baseLength * 4);

  cxt.moveTo(x + baseLength * 3, y - baseLength * 4);
  cxt.lineTo(x + baseLength * 4, y - baseLength * 4);
  cxt.lineTo(x + baseLength * 4, y - baseLength * 3);

  cxt.moveTo(x - baseLength * 4, y + baseLength * 3);
  cxt.lineTo(x - baseLength * 4, y + baseLength * 4);
  cxt.lineTo(x - baseLength * 3, y + baseLength * 4);

  cxt.moveTo(x + baseLength * 4, y + baseLength * 3);
  cxt.lineTo(x + baseLength * 4, y + baseLength * 4);
  cxt.lineTo(x + baseLength * 3, y + baseLength * 4);
  cxt.stroke();
}

function judgeContinuity(type, row, col, continuityChess) { //最长判断连续
  var length = 4;
  var limitLeft = Math.max(0, col - length),
    limitRight = Math.min(14, col + length);
  limitTop = Math.max(0, row - length),
    limitBottom = Math.min(14, row + length);

  // 横向判断
  var continuity = 0;
  for (var j = limitLeft; j <= limitRight; j++) {
    data.chess[row][j] === type ? continuity++ : continuity = 0;
    if (continuity == continuityChess) {
      return type;
    }
  }

  //纵向判断
  continuity = 0;
  for (var i = limitTop; i <= limitBottom; i++) {
    data.chess[i][col] === type ? continuity++ : continuity = 0;
    if (continuity == continuityChess) {
      return type;
    }
  }

  //正斜判断
  continuity = 0;
  for (var i = row - 4, j = col + 4, len = 0; len < 9; i++, j--, len++) {
    if (i < 0 || j < 0 || i > 14 || j > 14) {
      continue;
    }
    data.chess[i][j] === type ? continuity++ : continuity = 0;
    if (continuity == continuityChess) {
      return type;
    }
  }

  //反斜判断
  continuity = 0;
  for (var i = row - 4, j = col - 4, len = 0; len < 9; i++, j++, len++) {
    if (i < 0 || j < 0 || i > 14 || j > 14) {
      continue;
    }
    data.chess[i][j] === type ? continuity++ : continuity = 0;
    if (continuity == continuityChess) {
      return type;
    }
  }
  return false;
}

function playerWin(player, type) {
  removeEvent(chessBoard, 'click', playing);
  inGameDiv.style.display = 'none';
  startButton.innerHTML = '再来一局';
  startButton.style.display = 'block';
  historyDiv.style.display = 'block';
  startButton.addClass('mobileStyle');
  historyDiv.addClass('mobileStyle');
  PVE.removeAttribute('disabled');
  weUpperHand.removeAttribute('disabled');
  aiUpperHand.removeAttribute('disabled');
  PVP.removeAttribute('disabled');
  forbiddenMoves.removeAttribute('disabled');
  _drawWinText(player, type);

  function _drawWinText(player, type) {
    var text;
    if (data.currentStep === 225) {
      text = '和局';
    } else {
      if (type) {
        text = player ? '白方胜利' : '黑方胜利';
      } else {
        text = player ? '白方认输' : '黑方认输';
      }
    }
    var cxt = chessBoard.getContext('2d');
    var fontSize = data.chessLength * 2.5;
    cxt.beginPath();
    cxt.fillStyle = 'rgba(85, 102, 119, 0.75)';
    cxt.fillRect(data.chessLength - 20, data.chessLength - 20, data.chessLength * 14 + 20 * 2, data.chessLength * 14 + 20 * 2);
    cxt.fillStyle = '#fff';
    cxt.font = 'bold ' + fontSize + 'px Microsoft YaHei';
    cxt.textAlign = 'center';
    cxt.textBaseline = 'middle';
    cxt.fillText(text, data.chessLength * 8, data.chessLength * 8);
  }
}

function forbiddenMovesPrompt() {
  var flag = 3;
  _colorChange(flag);

  function _colorChange(flag) {
    if (flag % 2 === 1) {
      forbiddenMovesText.style.color = 'red';
    } else {
      forbiddenMovesText.style.color = 'black';
    }
    if (flag > 0) {
      flag--;
      setTimeout(function() {
        _colorChange(flag);
      }, 200);
    }
  }
}