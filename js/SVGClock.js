var clock = $('#clock'),
  content = $('.content.0'),
  dial = clock.$('.dial.0');

var hour = $('#hour'),
  min = $('#min'),
  sec = $('#sec'),
  msec = $('#msec');


window.onload = function() {
  delayedLoadingPublicPictures('../');
}

setTime();

setInterval(function() {
  setTime();
}, 1000);

createDialElement(dial);

function setTime() {
  var now = new Date();
  r(sec, 6 * now.getSeconds());
  r(min, 6 * now.getMinutes() + now.getSeconds() / 10);
  r(hour, 30 * (now.getHours() % 12) + now.getMinutes() / 2);

  function r(el, deg) {
    el.setAttribute('transform', 'rotate(' + deg + ' 50 50)');
  }
}

function createDialElement(dial) {
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var XLINK_NS = 'http://www.w3.org/1999/xlink';
  for (var i = 0; i < 12; i++) {
    var line = createHourLine(i % 3);
    line.setAttribute('transform', 'rotate(' + i * 30 + ' 50 50)');
    dial.appendChild(line);
    var text = createHourText(i + 1);
    var position = NumberPosition(50, 30, (i + 1) * 30, 2);
    text.setAttribute('transform', 'translate(' + position.x + ' ' + position.y + ')');
    dial.appendChild(text);
  }
  for (var i = 0; i < 60; i++) {
    if (i % 5 == 0) {
      continue;
    }
    var circle = createMinuteCircle();
    circle.setAttribute('transform', 'rotate(' + i * 6 + ' 50 50),translate(40 0)');
    dial.appendChild(circle);
  }

  function createHourLine(long) {
    var _line = document.createElementNS(SVG_NS, 'line');
    _line.setAttribute('x1', '50');
    _line.setAttribute('x2', '50');
    if (long) {
      _line.setAttribute('y1', '87');
      _line.setAttribute('y2', '91');
    } else {
      _line.setAttribute('y1', '83');
      _line.setAttribute('y2', '91');
    }
    return _line;
  }

  function createMinuteCircle() {
    var _circle = document.createElementNS(SVG_NS, 'circle');
    _circle.setAttribute('cx', '50');
    _circle.setAttribute('cy', '50');
    _circle.setAttribute('r', '0.5');
    return _circle;
  }

  function createHourText(content) {
    var _text = document.createElementNS(SVG_NS, 'text');
    _text.innerHTML = content;
    return _text;
  }

  function NumberPosition(basics, length, angle, fix) {
    var x = basics + length * Math.sin(angle * Math.PI / 180) - fix;
    var y = basics - length * Math.cos(angle * Math.PI / 180) + fix;
    return {
      x: x,
      y: y
    };
  }
}