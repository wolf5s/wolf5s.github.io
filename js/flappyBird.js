var content = $('.content.0'),
  canvasBackground = $('#canvasBackground'),
  canvasObstacle = $('#canvasObstacle'),
  canvasBird = $('#canvasBird'),
  canvasButton = $('#canvasButton'),
  canvasMask = $('#canvasMask');
var TIME = {};

window.onload = function() {
  delayedLoadingPublicPictures('../');
  var image = new Image();
  image.src = '../image/flappyBirdDemo.png';
  image.onload = function() {
    data.image = image;
    resetCanvas();
    createFrame();
    createButton();
    drawMask(false);
    addEvent(canvasButton, 'mousemove', cursorMoveEvent);
    addEvent(canvasButton, 'click', cursorClickEvent);
  }
}

var data = {
  image: null,
  start: false,
  fail: false,
  zoom: 1.389,
  refreshRate: 20, //刷新频率
  background: 0, //0白天，1黑夜
  birdColor: 0, //0黄色，1蓝色，2红色
  birdAttitude: 0, //姿态，0～2
  lastTop: 315,
  rotateAngle: 0,
  speedY: 0,
  gravity: 0,
  birdLeft: 120,
  birdTop: 315,
  obstacle: [],
  obstacleAdopt: 56,
  score: 0
};

function resetData() {
  data.start = false;
  data.speedY = 0;
  data.gravity = 0;
  data.birdLeft = 120;
  data.birdTop = 315;
  data.obstacle = [];
  data.obstacleAdopt = 56;
  data.score = 0;
}

function cursorClickEvent(e) {
  resetData();
  if (data.fail === true) {
    createFrame();
  }
  var e = e || window.e;
  if (cursorInStart(e)) {
    removeEvent(canvasButton, 'mousemove', cursorMoveEvent);
    canvasButton.style.cursor = 'default';
    startGame();
  }
}

function cursorMoveEvent(e) {
  var e = e || window.e;
  if (cursorInStart(e)) {
    canvasButton.style.cursor = 'pointer';
  } else {
    canvasButton.style.cursor = 'default';
  }
}

function cursorInStart(e) {
  if (_getMousePos(e).x > 128 && _getMousePos(e).x < 272 &&
    _getMousePos(e).y > 400 && _getMousePos(e).y < 481) {
    return true;
  } else {
    return false;
  }

  function _getMousePos(e) {
    var x = e.clientX - canvasBackground.getBoundingClientRect().left;
    var y = e.clientY - canvasBackground.getBoundingClientRect().top;
    return {
      'x': x,
      'y': y
    };
  }
}

function startGame() {
  removeEvent(canvasButton, 'click', cursorClickEvent);
  var contextCanvasButton = canvasButton.getContext('2d');
  data.birdColor = parseInt(Math.random() * 300) % 3;
  TIME.birdAttitude = setInterval(function() {
    data.birdAttitude = (data.birdAttitude + 1) % 3;
  }, data.refreshRate * 10);
  drawMask(true);
  setTimeout(function() {
    addEvent(canvasButton, 'click', gamePlaying);
    addEvent(document, 'keydown', gamePlayingSpace);
    drawMask(false);
    createGetReady();
    TIME.dataUpdate = setInterval(function() {
      data.speedY = data.speedY + data.gravity;
      data.birdTop = data.birdTop + data.speedY;
      createBird();
    }, data.refreshRate);
  }, 400);
}

function createFrame() {
  var cxt = canvasBackground.getContext('2d');

  if (data.fail === true) {
    setTimeout(function() {
      var obstacle = canvasObstacle.getContext('2d');
      obstacle.clearRect(0, 0, canvasObstacle.width, canvasObstacle.height);
      data.background = parseInt(Math.random() * 1000) % 2;
      drawBackground(cxt);
      drawBottomStripe(0);
    }, data.refreshRate * 20);
  } else {
    data.background = parseInt(Math.random() * 1000) % 2;
    drawBackground(cxt);
    drawBottomStripe(0);
  }

  function drawBackground(cxt) {
    var _drawBackground;
    cxt.beginPath();
    if (data.background) {
      _drawBackground = function() {
        cxt.drawImage(data.image, 292, 0, 288, 512, 0, -55, 400, 711);
      }
    } else {
      _drawBackground = function() {
        cxt.drawImage(data.image, 0, 0, 288, 512, 0, -55, 400, 711);
      }
    }
    _drawBackground();
  }
}

function drawBottomStripe(deviation) {
  var cxt = canvasBackground.getContext('2d');
  cxt.drawImage(data.image, 584 + deviation, 0, 336, 22, 0, 569, 465, 31);
  TIME.bottomStripe = setTimeout(function() {
    deviation = (deviation + 1.5) % 24;
    drawBottomStripe(deviation);
  }, data.refreshRate);
}

function gamePlayingSpace(e) {
  var e = e || window.e;
  if (e && e.keyCode == 32) {
    gamePlaying();
  }
}

function gamePlaying() {
  if (data.start === false) {
    data.gravity = 0.4;
    createObstacle();
  }
  data.start = true;
  var contextCanvasButton = canvasButton.getContext('2d');
  createScore(data.score);
  data.speedY = -8;
}

function createObstacle() {
  var adopt = 140;
  var obstacleWidth = 72;
  var transverseSpacing = 225;
  var scoreFlag = true;

  TIME.showObstacle = setInterval(function() {
    data.obstacleAdopt = data.obstacleAdopt + 1;
    for (var i = 0, len = data.obstacle.length; i < len; i++) {
      data.obstacle[i][0] -= 2;
    }
    if (data.obstacleAdopt > 112) {
      data.obstacleAdopt = 0;
      var obstacleTop = parseInt(Math.random() * 260) + 100,
        obstacleBottom = obstacleTop + adopt;
      data.obstacle.push([400, obstacleTop, obstacleBottom]);
    }
    for (var i = 0; i < data.obstacle.length; i++) {
      if (data.obstacle[0][0] < -72) {
        data.obstacle.shift();
      }
      if (data.obstacle[0][0] < 0) {
        scoreFlag = true;
      }
      if (scoreFlag === true && data.obstacle[i][0] < 84 && data.obstacle[i][0] > 0) {
        scoreFlag = false;
        data.score++;
        createScore(data.score);
      }
    }
    _drawObstacle();
    if (!collisionJudge()) {
      gameover();
    }
  }, data.refreshRate);

  function _drawObstacle() {
    var cxt = canvasObstacle.getContext('2d');
    var obstacleData = [ //52, 320
      [112, 646],
      [168, 646]
    ]
    cxt.clearRect(0, 0, canvasObstacle.width, canvasObstacle.height);
    for (var i = 0, len = data.obstacle.length; i < len; i++) {
      cxt.drawImage(data.image, 112, 646, 52, 320, data.obstacle[i][0], data.obstacle[i][1] - 445, 72, 445); //上层柱子
      cxt.drawImage(data.image, 168, 646, 52, 320, data.obstacle[i][0], data.obstacle[i][2], 72, 445); //下层柱子
    }
    cxt.clearRect(0, canvasObstacle.height - 31, canvasObstacle.width, 31);
  }
}

function createButton() {
  var cxt = canvasButton.getContext('2d');
  cxt.drawImage(data.image, 702, 182, 178, 48, 76, 118, 247, 67);
  cxt.drawImage(data.image, 708, 236, 104, 58, 128, 400, 144, 81);
}

function createGetReady() {
  var cxt = canvasButton.getContext('2d');
  createScore(0);
  cxt.drawImage(data.image, 590, 118, 184, 50, 75, 190, 256, 69);
  cxt.drawImage(data.image, 584, 182, 114, 98, 120, 295, 158, 136);
}

function createBird() {
  var cxt = canvasBird.getContext('2d');
  var birdPosition = [ //34, 24
    [
      [6, 982],
      [62, 982],
      [118, 982]
    ],
    [
      [174, 982],
      [230, 658],
      [230, 710]
    ],
    [
      [230, 762],
      [230, 814],
      [230, 866]
    ]
  ];
  cxt.clearRect(0, 0, canvasBird.width, canvasBird.height);
  cxt.drawImage(data.image, birdPosition[data.birdColor][data.birdAttitude][0], birdPosition[data.birdColor][data.birdAttitude][1], 34, 24, data.birdLeft - 24, data.birdTop - 17, 48, 34);
  rotateBird(cxt, -data.rotateAngle, false);
  rotateBird(cxt, Math.atan(data.speedY / 10), true);
}

function rotateBird(cxt, angle, reduction) {
  var top = data.lastTop;
  if (reduction) {
    data.rotateAngle = angle;
    data.lastTop = data.birdTop;
    top = data.birdTop;
  }
  cxt.translate(data.birdLeft, top);
  cxt.rotate(angle);
  cxt.translate(-data.birdLeft, -top);
}

function createScore(score) {
  var cxt = canvasButton.getContext('2d');
  cxt.clearRect(0, 0, canvasButton.width, canvasButton.height);
  var scoreData = [
    [992, 120], //0
    [268, 910], //1
    [584, 320], //2
    [612, 320], //3
    [640, 320], //4
    [668, 320], //5
    [584, 368], //6
    [612, 368], //7
    [640, 368], //8
    [668, 368] //9
  ];
  var single, ten, hundreds;
  if (score < 10) {
    cxt.drawImage(data.image, scoreData[score][0], scoreData[score][1], 24, 36, 182, 98, 33, 50);
  } else if (score < 100) {
    single = score % 10;
    ten = parseInt(score / 10);
    cxt.drawImage(data.image, scoreData[single][0], scoreData[single][1], 24, 36, 199, 98, 33, 50);
    cxt.drawImage(data.image, scoreData[ten][0], scoreData[ten][1], 24, 36, 165, 98, 33, 50);
  } else {
    single = score % 10;
    ten = parseInt((score / 10) % 10);
    hundreds = parseInt(score / 100);
    cxt.drawImage(data.image, scoreData[single][0], scoreData[single][1], 24, 36, 216, 98, 33, 50);
    cxt.drawImage(data.image, scoreData[ten][0], scoreData[ten][1], 24, 36, 182, 98, 33, 50);
    cxt.drawImage(data.image, scoreData[hundreds][0], scoreData[hundreds][1], 24, 36, 148, 98, 33, 50);
  }
}

function drawMask(behavior) {
  var cxt = canvasMask.getContext('2d');
  if (behavior === true) {
    _gradientMask(0, behavior);
  } else {
    _gradientMask(1, behavior);
  }

  function _gradientMask(alpha, behavior) {
    cxt.beginPath();
    cxt.fillStyle = 'rgba(0, 0, 0, ' + alpha + ')';
    cxt.clearRect(0, 0, canvasMask.width, canvasMask.height);
    cxt.fillRect(0, 0, canvasMask.width, canvasMask.height);
    if (behavior === true && alpha < 1 || behavior === false && alpha > 0) {
      alpha = behavior ? alpha + data.refreshRate / 400 : alpha - data.refreshRate / 400;
      setTimeout(function() {
        _gradientMask(alpha, behavior);
      }, data.refreshRate);
    }
  }
}

function resetCanvas() {
  canvasBackground.width = 400;
  canvasBackground.height = 600;
  canvasObstacle.width = 400;
  canvasObstacle.height = 600;
  canvasBird.width = 400;
  canvasBird.height = 600;
  canvasButton.width = 400;
  canvasButton.height = 600;
  canvasMask.width = 400;
  canvasMask.height = 600;
}

function collisionJudge() {
  var birdWidth = 40,
    birdHeight = 32;
  if (data.birdTop > 554) {
    return false;
  }
  for (var i = 0; i < data.obstacle.length; i++) {
    if (data.obstacle[i][0] < 120 + birdWidth / 2 && data.obstacle[i][0] > 48 - birdWidth / 2) {
      if (data.birdTop < data.obstacle[i][1] + birdHeight / 2 || data.birdTop > data.obstacle[i][1] + 140 - birdHeight / 2) {
        return false;
      }
    }
  }
  return true;
}

function gameover() {
  data.fail = true;
  data.speedY = 0;
  removeEvent(canvasButton, 'click', gamePlaying);
  removeEvent(document, 'keydown', gamePlayingSpace);
  clearInterval(TIME.showObstacle);
  clearInterval(TIME.dataUpdate);
  clearTimeout(TIME.bottomStripe);
  if (data.birdTop <= 554) {
    setTimeout(function() {
      TIME.dataUpdate = setInterval(function() {
        data.speedY = data.speedY + data.gravity;
        data.birdTop = data.birdTop + data.speedY;
        createBird();
        if (data.birdTop > 554) {
          clearInterval(TIME.dataUpdate);
          restart();
        }
      }, data.refreshRate);
    }, data.refreshRate * 10);
  } else {
    restart();
  }
}

function restart() {
  var score = data.score,
    bestScore = getCookie('bestScore');
  if (bestScore <= data.score) {
    setCookie('bestScore', data.score, 60 * 24 * 365);
    bestScore = data.score;
  }
  createRestart(data.score, bestScore);
}

function createRestart(score, bestScore) {
  setTimeout(function() {
    createGameover();
  }, data.refreshRate * 20);
  setTimeout(function() {
    createScoreboard(score, bestScore);
  }, data.refreshRate * 40);
}

function createGameover() {
  var cxt = canvasButton.getContext('2d');
  cxt.clearRect(0, 0, canvasButton.width, canvasButton.height);
  var gameoverTop = 100;
  setTimeout(function() {
    _drawGameover1();
  }, data.refreshRate);

  function _drawGameover1() {
    gameoverTop--;
    cxt.clearRect(0, 0, canvasButton.width, canvasButton.height);
    cxt.drawImage(data.image, 790, 118, 192, 42, 67, gameoverTop, 266, 58);
    setTimeout(function() {
      if (gameoverTop < 92) {
        _drawGameover2();
      } else {
        _drawGameover1();
      }
    }, data.refreshRate);
  }

  function _drawGameover2() {
    gameoverTop++;
    cxt.clearRect(0, 0, canvasButton.width, canvasButton.height);
    cxt.drawImage(data.image, 790, 118, 192, 42, 67, gameoverTop, 266, 58);
    setTimeout(function() {
      if (gameoverTop < 100) {
        _drawGameover2();
      }
    }, data.refreshRate);
  }
}

function createScoreboard(score, bestScore) {
  var cxt = canvasButton.getContext('2d');
  cxt.clearRect(0, 0, canvasButton.width, canvasButton.height);
  var scoreboardTop = 600;
  _drawScoreboard(score, bestScore);

  function _drawScoreboard(score, bestScore) {
    scoreboardTop -= 20;
    cxt.clearRect(0, 0, canvasButton.width, canvasButton.height);
    cxt.drawImage(data.image, 790, 118, 192, 42, 67, 100, 266, 58);
    cxt.drawImage(data.image, 6, 518, 226, 114, 43, scoreboardTop, 314, 158);
    setTimeout(function() {
      if (scoreboardTop > 206) {
        _drawScoreboard(score, bestScore);
        _drawScore(score, scoreboardTop, false);
        _drawScore(bestScore, scoreboardTop, true);
      } else {
        setTimeout(function() {
          cxt.drawImage(data.image, 708, 236, 104, 58, 128, 400, 144, 81);
          addEvent(canvasButton, 'mousemove', cursorMoveEvent);
          addEvent(canvasButton, 'click', cursorClickEvent);
        }, data.refreshRate * 10);
      }
    }, data.refreshRate);
  }

  function _drawScore(score, scoreboardTop, isBest) {
    var scoreData = [ //14, 20
      [274, 612], //0
      [274, 954], //1
      [274, 978], //2
      [262, 1002], //3
      [1004, 0], //4
      [1004, 24], //5
      [1010, 52], //6
      [1010, 84], //7
      [586, 484], //8
      [622, 412] //9
    ];

    var single, ten, hundreds, socreTop;

    if (isBest) {
      socreTop = 104 + scoreboardTop;
    } else {
      socreTop = 48 + scoreboardTop;
    }

    if (score < 10) {
      cxt.drawImage(data.image, scoreData[score][0], scoreData[score][1], 14, 20, 300, socreTop, 20, 28);
    } else if (score < 100) {
      single = score % 10;
      ten = parseInt(score / 10);
      cxt.drawImage(data.image, scoreData[single][0], scoreData[single][1], 14, 20, 300, socreTop, 20, 28);
      cxt.drawImage(data.image, scoreData[ten][0], scoreData[ten][1], 14, 20, 276, socreTop, 20, 28);
    } else {
      single = score % 10;
      ten = parseInt((score / 10) % 10);
      hundreds = parseInt(score / 100);
      cxt.drawImage(data.image, scoreData[single][0], scoreData[single][1], 14, 20, 300, socreTop, 20, 28);
      cxt.drawImage(data.image, scoreData[ten][0], scoreData[ten][1], 14, 20, 276, socreTop, 20, 28);
      cxt.drawImage(data.image, scoreData[hundreds][0], scoreData[hundreds][1], 14, 20, 252, socreTop, 20, 28);
    }
  }
}