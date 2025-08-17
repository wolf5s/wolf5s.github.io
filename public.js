const classExtend = {
  hasClass: function(cls) {
    return this.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  },
  addClass: function(cls) {
    if (!this.hasClass(cls)) this.className = this.className.trim() + " " + cls;
  },
  removeClass: function(cls) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    this.className = this.className.replace(reg, ' ').replace(/\s+/, ' ');
  }
}

const eventExtend = {
  addEvent: function(type, handler) {
    return addEvent(this, type, handler);
  },
  removeEvent: function(type, handler) {
    return removeEvent(this, type, handler);
  }
}

const $Extend = {
  $: function(tag) {
    return $(tag, this);
  }
}

addAttributeToObject(classExtend, Object.prototype);
addAttributeToObject(eventExtend, Object.prototype);
addAttributeToObject($Extend, Element.prototype);

var main = $('#main'),
  own = main.$('.own.0'),
  ownLi = own.$('li'),
  left = main.$('.left.0'),
  right = main.$('.right.0');

addEvent(window, 'resize', function() {
  adjustmentWindow();
  if (judgeWidth()) {
    adjustmentLeft();
  }
});

addEvent(window, 'load', function() {
  adjustmentWindow();
  if (judgeWidth()) {
    adjustmentLeft();
    adjustmentWindow();
  }
});

function throttle(method, context) {
  clearTimeout(method.tId);
  method.tId = setTimeout(function() {
    method.call(context);
  }, 100);
}

function addAttributeToObject(source, origin) {
  var sourceType = (typeof source).toLowerCase();
  switch (sourceType) {
    case 'function':
      origin[source.name] = source;
      break;
    case 'object':
      for (var i in source) {
        origin[i] = source[i];
      }
      break;
  }
}

function delayedLoadingPublicPictures(prefix) {
  var isMobile = judgeWidth() ? '' : '-mobile';
  $('body.0').style.backgroundImage = 'url("' + prefix + 'image/background' + isMobile + '.jpg")';
  left.$('.image.0').style.backgroundImage = 'url("' + prefix + 'image/TX.png")';
}

function adjustmentWindow() {
  if (judgeWidth()) {
    main.style.display = 'flex';
    publicUseMainAppropriate(main);
  } else {
    main.style.display = 'block';
    useElementHeightSuit(right, left, main);
  }
}

function adjustmentLeft() {
  height = left.offsetHeight - 325;
  own.style.height = height + 'px';
}

function useElementHeightSuit(element, previous, parent) {
  var screenHeight = document.documentElement.clientHeight || document.body.clientHeight,
    previousHeight = previous.offsetHeight;
  // 120为right的paddingTop与paddingBottom值之和
  element.style.minHeight = screenHeight - previousHeight - 120 + 'px';
}

function useElementToAppropriate(element, parent) {
  var height = element.offsetHeight,
    screenHeight = parent.clientHeight,
    top = (screenHeight - height) / 2;
  element.style.marginTop = Math.max(top - screenHeight / 20, 0) + 'px';
}

function publicUseMainAppropriate(element) {
  var height = document.documentElement.clientHeight || document.body.clientHeight,
    width = document.documentElement.clientWidth || document.body.clientWidth;
  element.style.height = height - 62 + 'px';
  element.style.width = width - 40 + 'px';
  element.style.top = '20px';
  element.style.left = '20px';
}

function judgeWidth() {
  var screenWidth = document.documentElement.clientWidth || document.body.clientWidth;
  return (screenWidth >= 1000);
}

function addEvent(element, type, handler) {
  if (element.addEventListener) {
    element.addEventListener(type, handler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, handler);
  } else {
    element['on' + type] = handler;
  }
}

function removeEvent(element, type, handler) {
  if (element.removeEventListener) {
    element.removeEventListener(type, handler, false);
  } else if (element.detachEvent) {
    element.detachEvent('on' + type, handler);
  } else {
    element['on' + type] = null;
  }
}

function setCookie(name, value, time) {
  var Minutes = time,
    exp = new Date();
  exp.setTime(exp.getTime() + Minutes * 60 * 1000);
  document.cookie = name + "=" + decodeURI(value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  arr = document.cookie.match(reg);
  if (arr = document.cookie.match(reg)) {
    return decodeURIComponent(arr[2]);
  } else {
    return null;
  }
}

function $(tag, parent) {
  var tags = tag.split(' '),
    parent = parent || document,
    ele;
  for (var i = 0, len = tags.length; i < len; i++) {
    if (/^#[\w-_]+/.test(tags[i])) {
      ele = parent.getElementById(tags[i].slice(1));
    } else if (/^\.[\w-_]+/.test(tags[i])) {
      if (tags[i].match(/^\.([\w-_]+)\.(\d+)/)) {
        ele = parent.getElementsByClassName(RegExp.$1)[RegExp.$2];
      } else {
        ele = parent.getElementsByClassName(tags[i].slice(1));
      }
    } else {
      if (tags[i].match(/^([\w-_]+)\.(\d+)/)) {
        ele = parent.getElementsByTagName(RegExp.$1)[RegExp.$2];
      } else {
        ele = parent.getElementsByTagName(tags[i]);
      }
    }
    parent = ele;
  }
  return ele;
}