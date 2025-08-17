var content = $('.content.0'),
  canvas = $('#canvas');

window.onload = function() {
  delayedLoadingPublicPictures('../');
  createDial();
}

function createDial() {
  canvas.width = judgeWidth() ? 600 : content.clientWidth;
  canvas.height = canvas.width;
  radius = canvas.width / 2;
  var dialContext = canvas.getContext('2d');
  drawDial(dialContext, radius);
  var tempTime = nowTime();
  drawHand(dialContext, radius, tempTime);
  setInterval(function() {
    if (tempTime.seconds !== nowTime().seconds) {
      tempTime = nowTime();
      dialContext.clearRect(0, 0, radius, radius);
      drawDial(dialContext, radius);
      drawHand(dialContext, radius, tempTime);
    }
  }, 100);
}

function nowTime() {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  return {
    hours,
    minutes,
    seconds
  };
}

function drawHand(ctx, radius, time) {
  var secondHand = time.seconds;
  var minuteHand = time.minutes + time.seconds / 60;
  var hourHand = time.hours + time.minutes / 60;
  _drawDetailedHand(ctx, radius, '#bbb', 8, hourHand, radius + 35, 100, 6);
  _drawDetailedHand(ctx, radius, '#ccc', 5, minuteHand, radius + 35, 50, 30);
  _drawDetailedHand(ctx, radius, '#ddd', 2, secondHand, radius + 50, 30, 30);
  ctx.beginPath();
  ctx.fillStyle = '#123';
  ctx.arc(radius, radius, 4, 0, 2 * Math.PI);
  ctx.fill();

  function _drawDetailedHand(ctx, radius, color, lineWidth, point, correct1, correct2, scale) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.moveTo(position(point, correct1, scale).x, position(point, correct1, scale).y);
    ctx.lineTo(position(point, correct2, scale).x, position(point, correct2, scale).y);
    ctx.stroke();
  }
}

function drawDial(ctx, radius) {
  ctx.beginPath();
  var dialColor = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius - 30);
  dialColor.addColorStop(0, '#567');
  dialColor.addColorStop(1, '#345');
  ctx.fillStyle = dialColor;
  ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
  ctx.fill();
  drawSmallPoint(ctx, radius);
  drawBigPoint(ctx, radius);
}

function drawSmallPoint(ctx, radius) {
  for (var i = 0; i < 60; i++) {
    if (i % 5 === 0) {
      continue;
    }
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(position(i, 20, 30).x, position(i, 20, 30).y, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(radius, radius, 12, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function drawBigPoint(ctx, radius) {
  for (var i = 1; i < 13; i++) {
    ctx.beginPath();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.moveTo(position(i, 10, 6).x, position(i, 10, 6).y);
    ctx.lineTo(position(i, 30, 6).x, position(i, 30, 6).y);
    ctx.stroke();
    drawNumber(ctx, i, position(i, 60, 6).x, position(i, 60, 6).y);
  }
}

function drawNumber(ctx, i, positionX, positionY) {
  ctx.beginPath();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 30px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(i, positionX, positionY);
}

function position(i, correct, scale) {
  var positionX = radius + (radius - correct) * Math.sin(Math.PI / scale * i);
  var positionY = radius - (radius - correct) * Math.cos(Math.PI / scale * i);
  return {
    x: positionX,
    y: positionY
  };
}