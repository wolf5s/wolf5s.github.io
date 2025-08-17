var canvas = $('#canvas');

var element = {
  ctx: null,
  ball: null,
  time: null,
  previousTime: 0,
  deltaTime: 0
};

var digit =
  [
    [
      [0, 0, 1, 1, 1, 0, 0],
      [0, 1, 1, 0, 1, 1, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 0, 1, 1, 0],
      [0, 0, 1, 1, 1, 0, 0]
    ], //0
    [
      [0, 0, 0, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [1, 1, 1, 1, 1, 1, 1]
    ], //1
    [
      [0, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1]
    ], //2
    [
      [1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 1, 0]
    ], //3
    [
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 0],
      [0, 1, 1, 0, 1, 1, 0],
      [1, 1, 0, 0, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 1, 1]
    ], //4
    [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 1, 0]
    ], //5
    [
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 1, 1, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 1, 0, 1, 1, 1, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 1, 0]
    ], //6
    [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0]
    ], //7
    [
      [0, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 1, 0]
    ], //8
    [
      [0, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [0, 1, 1, 1, 0, 1, 1],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 1, 1, 0, 0, 0, 0]
    ], //9
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ] //:
  ];

window.onload = function() {
  delayedLoadingPublicPictures('../');
  init();
  loop();
}

function init() {
  setCanvas();
  element.previousTime = Date.now();
  element.time = new Time();
  element.ball = new Ball();
  element.ball.init();
}

function loop() {
  requestAnimationFrame(loop);
  var now = Date.now();
  element.deltaTime = now - element.previousTime;
  element.previousTime = now;
  if (element.deltaTime > 30) {
    element.deltaTime = 30;
  }
  drawBackground();
  element.time.draw();
  element.ball.draw();
}

function setCanvas() {
  element.ctx = canvas.getContext('2d');
  _setCanvasProperty();

  function _setCanvasProperty() {
    canvas.width = 680;
    canvas.height = 200;
  }
}

function drawBackground() {
  var ctx = element.ctx;
  var gr = ctx.createRadialGradient(320, 0, 100, 320, 0, 640);
  gr.addColorStop(0, '#0071ca');
  gr.addColorStop(1, '#01062c');
  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, 680, 320);
}

function Time() {
  this.time;

  this.timeUpdate = function() {
    this.time = '';
    var time = new Date();
    this.time += prefixInteger(time.getHours(), 2);
    this.time += 'x';
    this.time += prefixInteger(time.getMinutes(), 2);
    this.time += 'x';
    this.time += prefixInteger(time.getSeconds(), 2);
    this.time = this.time.split('');
    this.time[2] = 10;
    this.time[5] = 10;
  }

  this.draw = function() {
    this.timeUpdate();
    var digitNum, posX, posY;
    var ctx = element.ctx;
    for (var i = 0, len = this.time.length; i < len; i++) {
      digitNum = digit[this.time[i]];
      for (var j = 0; j < digitNum.length * digitNum[0].length; j++) {
        posX = i * 80 + parseInt(j / 10) * 10 + 24;
        posY = j % 10 * 10 + 50;
        if (digitNum[parseInt(j % 10)][parseInt(j / 10)] == 1) {
          ctx.save();
          ctx.beginPath();
          var gr = ctx.createRadialGradient(posX - 3, posY - 3, 2, posX - 2, posY - 2, 6);
          gr.addColorStop(0, '#fff');
          gr.addColorStop(1, '#123');
          ctx.fillStyle = gr;
          ctx.arc(posX, posY, 4, 0, 2 * Math.PI);
          ctx.fill();
          ctx.restore();
        }
      }
    }
  }
}

function Ball() {
  this.num = 200;
  this.time = null;
  this.ball = [];
  this.color = [];

  this.init = function() {
    this.ball = [];
  }
  this.numChange = function() {
    if (this.time) {
      for (var i = 0, len = element.time.time.length; i < len; i++) {
        if (this.time[i] != element.time.time[i]) {
          this.born(i, element.time.time[i]);
        }
      }
    }
    this.time = element.time.time;
  }
  this.born = function(posX, num) {
    var digitNum = digit[num];
    var queue = [];
    num = parseInt(num);
    for (var i = 0; i < digitNum.length * digitNum[0].length; i++) {
      if (digitNum[parseInt(i % 10)][parseInt(i / 10)] == 1) {
        this.ball.push({
          x: posX * 80 + parseInt(i / 10) * 10 + 24,
          y: i % 10 * 10 + 50,
          vy: -Math.random() * 4,
          direction: parseInt(Math.random() * 100) % 2, //0左1右
          color: 'rgb(' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ')'
        });
      }
    }
  }
  this.move = function() {
    var gravity = 1;
    for (var i = 0; i < this.ball.length; i++) {
      if (this.ball[i].direction) {
        this.ball[i].x += element.deltaTime * 0.1;
      } else {
        this.ball[i].x -= element.deltaTime * 0.1;
      }
      this.ball[i].vy += gravity * element.deltaTime * 0.01;
      var nextY = this.ball[i].y + this.ball[i].vy;
      if (nextY > 196) {
        this.ball[i].vy = -this.ball[i].vy * 0.75;
      } else {
        this.ball[i].y = nextY;
      }
    }
  }
  this.remove = function() {
    for (var i = this.ball.length - 1; i >= 0; i--) {
      if (this.ball[i].x < -10 || this.ball[i].x > 690) {
        this.ball.splice(i, 1);
      }
    }
  }
  this.draw = function() {
    this.numChange();
    this.move();
    this.remove();
    var ctx = element.ctx;
    for (var i = 0; i < this.ball.length; i++) {
      ctx.save();
      ctx.beginPath();
      var gr = ctx.createRadialGradient(this.ball[i].x - 4, this.ball[i].y - 4, 1, this.ball[i].x - 4, this.ball[i].y - 4, 6);
      gr.addColorStop(0, '#fff');
      gr.addColorStop(1, this.ball[i].color);
      ctx.fillStyle = gr;
      ctx.arc(this.ball[i].x, this.ball[i].y, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    }
  }
}

Object.prototype.prefixInteger = function(num, n) {
  return (Array(n).join(0) + num).slice(-n);
}