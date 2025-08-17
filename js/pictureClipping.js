var content = right.$('.content.0'),
  boxDiv = content.$('.box.0'),
  mainDiv = boxDiv.$('.control.0'),
  img2 = boxDiv.$('.img2.0'),
  buttonDiv = mainDiv.$('div');

//阻止拖动时浏览器其他事件
document.onselectstart = new Function('event.returnValue=false;');

window.onload = function() {
  delayedLoadingPublicPictures('../');
  var show = $('#show'),
    showPic = document.createElement('img');
  showPic.src = img2.src;
  showPic.id = 'showPi';
  show.appendChild(showPic);
  for (var i = 0; i < buttonDiv.length; i++) {
    buttonDiv[i].index = i;
    buttonDiv[i].onmousedown = function(e) {
      e.stopPropagation();
      var mainRight = getPosition(mainDiv).left + mainDiv.offsetWidth,
        mainBottom = getPosition(mainDiv).top + mainDiv.offsetHeight;
      move(this.index, mainRight, mainBottom, 40, img2);
    }
  }
  mainDiv.onmousedown = function(e) {
    var disX = e.clientX - getPosition(mainDiv).left,
      disY = e.clientY - getPosition(mainDiv).top;
    move(8, disX, disY, 40, img2);
  }
  preview({
    "top": 0,
    "right": 200,
    "bottom": 200,
    "left": 0
  });
}

//拖动
function move(index, limitX, limitY, minLength, element) {
  document.onmousemove = function(e) {
    switch (index) {
      case 0:
        leftMove(e, limitX, minLength);
        upMove(e, limitY, minLength);
        break;
      case 1:
        upMove(e, limitY, minLength);
        break;
      case 2:
        rightMove(e, minLength);
        upMove(e, limitY, minLength);
        break;
      case 3:
        rightMove(e, minLength);
        break;
      case 4:
        downMove(e, minLength);
        rightMove(e, minLength);
        break;
      case 5:
        downMove(e, minLength);
        break;
      case 6:
        leftMove(e, limitX, minLength);
        downMove(e, minLength);
        break;
      case 7:
        leftMove(e, limitX, minLength);
        break;
      case 8:
        allMove(e, limitX, limitY, element);
        break;
    }
    setChoice(element);
  }
  document.onmouseup = function() {
    document.onmousemove = null;
    document.onmouseup = null;
  }
}

//左边拖动
function leftMove(e, limitX, minLength) {
  var x = moveLimit(e.clientX, getPosition(img2).left, limitX - minLength),
    width = mainDiv.offsetWidth - 2,
    mainX = getPosition(mainDiv).left,
    addWidth = mainX - x;
  mainDiv.style.width = (width + addWidth) + 'px';
  mainDiv.style.left = mainDiv.offsetLeft - mainX + x + 'px';
}

//右边拖动
function rightMove(e, minLength) {
  var x = moveLimit(e.clientX, getPosition(mainDiv).left + minLength, getPosition(img2).left + img2.offsetWidth),
    width = mainDiv.offsetWidth - 2,
    mainX = getPosition(mainDiv).left,
    addWidth = x - width - mainX;
  mainDiv.style.width = (width + addWidth) + 'px';
}

//上边拖动
function upMove(e, limitY, minLength) {
  var y = moveLimit(e.clientY, getPosition(img2).top, limitY - minLength),
    height = mainDiv.offsetHeight - 2,
    mainY = getPosition(mainDiv).top,
    addHeight = mainY - y;
  mainDiv.style.height = (height + addHeight) + 'px';
  mainDiv.style.top = mainDiv.offsetTop - mainY + y + 'px';
}

//下边拖动
function downMove(e, minLength) {
  var y = moveLimit(e.clientY, getPosition(mainDiv).top + minLength, getPosition(img2).top + img2.offsetHeight),
    height = mainDiv.offsetHeight - 2,
    mainY = getPosition(mainDiv).top,
    addHeight = y - height - mainY;
  mainDiv.style.height = (height + addHeight) + 'px';
}

//移动
function allMove(e, disX, disY, element) {
  var addX = e.clientX - disX - getPosition(boxDiv).left,
    addY = e.clientY - disY - getPosition(boxDiv).top;
  mainDiv.style.left = moveLimit(addX, element.offsetLeft, element.offsetWidth - mainDiv.offsetWidth + element.offsetLeft) + "px";
  mainDiv.style.top = moveLimit(addY, element.offsetTop, element.offsetHeight - mainDiv.offsetHeight + element.offsetTop) + "px";
}

//移动限制范围
function moveLimit(n, min, max) {
  return Math.max(Math.min(max, n), min);
}

//获取元素的绝对位置
function getPosition(node) {
  var left = node.offsetLeft,
    top = node.offsetTop,
    current = node.offsetParent;
  while (current) {
    left += current.offsetLeft;
    top += current.offsetTop;
    current = current.offsetParent;
  }
  return {
    "left": left,
    "top": top
  };
}

//设置选择区域可见
function setChoice(element) {
  var top = mainDiv.offsetTop - element.offsetTop,
   right = mainDiv.offsetLeft + mainDiv.offsetWidth - element.offsetLeft,
   bottom = mainDiv.offsetTop + mainDiv.offsetHeight - element.offsetTop,
   left = mainDiv.offsetLeft - element.offsetLeft;
  img2.style.clip = 'rect(' + top + 'px,' + right + 'px,' + bottom + 'px,' + left + 'px)';
  preview({
    "top": top,
    "right": right,
    "bottom": bottom,
    "left": left
  });
  show.style.right = mainDiv.offsetWidth + 'px';
}

//预览图
function preview(view) {
  var previewImg = $('#showPi');
  previewImg.style.top = -view.top + 'px';
  previewImg.style.left = -view.left + 'px';
  previewImg.style.clip = 'rect(' + view.top + 'px,' + view.right + 'px,' + view.bottom + 'px,' + view.left + 'px)';
}