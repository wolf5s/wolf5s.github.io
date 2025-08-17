var start = $('#start'),
  eGo = $('.go.0'),
  rightDiv = right.$('div'),
  demo = $('#demo'),
  demoUl = demo.$('ul.0'),
  demoLis = demoUl.$('li');
var TEMP;

useElementToAppropriate(start, document);

if (getCookie('main')) {
  start.style.display = 'none';
  main.style.display = judgeWidth() ? 'flex' : 'block';
  adjustmentWindow();
  main.addClass('rotate-show-once');
}

window.onload = function() {
  delayedLoadingPublicPictures('');
  start.$('.image.0').style.backgroundImage = 'url("image/TX.png")';
  var img = $('img');

  for (var i = 0, len = img.length; i < len; i++) {
    img[i].setAttribute('src', img[i].getAttribute('data-src'));
  }
  useDEMOUlMargin(demoUl, demoLis, 10);
}

window.onresize = function() {
  throttle(function() {
    adjustmentWindow();
    useDEMOUlMargin(demoUl, demoLis, 10);
    useElementToAppropriate(start, document);
  });
}

addEvent(own, 'click', function(e) {
  var target = e.target || e.srcElement;
  if (judgeWidth()) {
    e = myfn(e);
  }
  for (var i = 0, length = ownLi.length; i < length; i++) {
    try {
      while (target.tagName.toUpperCase() != 'LI') {
        target = target.parentNode;
      }
    } catch (e) {}
    if (target == ownLi[i]) {
      scrollAnimate(right, rightDiv[i], 150);
      break;
    }
  }
});

addEvent(eGo, 'click', function() {
  setCookie('main', 'flex', 10);
  useDEMOUlMargin(demoUl, demoLis, 10);
  start.addClass('rotate-none');
  main.addClass('rotate-show');
});

function scrollAnimate(ele, target, time) {
  clearTimeout(TEMP);
  TEMP = null;
  var end = target.offsetTop - 50,
    start = right.scrollTop,
    step = (end - start) / (time / 10),
    tempEnd;

  function animate() {
    TEMP = setTimeout(function() {
      if (Math.abs(end - right.scrollTop) > Math.abs(step)) {
        right.scrollTop = right.scrollTop + step;
        if (tempEnd == right.scrollTop) {
          clearTimeout(TEMP);
          return;
        }
        tempEnd = right.scrollTop;
        animate();
      } else {
        right.scrollTop = end;
        clearTimeout(TEMP);
      }
    }, 10);
  }
  animate();
}

function useDEMOUlMargin(parentElement, childElements, childElementMinMargin) {
  var UlWidth = demoUl.offsetWidth,
    LiWidth = childElements[0].offsetWidth,
    length = Math.floor(UlWidth / (LiWidth + 20)),
    marginRight = Math.floor((UlWidth - length * (LiWidth + 4)) / (length * 2));
  for (var i = 0; i < childElements.length; i++) {
    childElements[i].style.margin = '10px ' + marginRight + 'px 30px';
  }
}

function myfn(e) {
  return window.event ? window.event.returnValue = false : e.preventDefault();
}