var content = $('.content.0'),
  quit = $('.quit.0'),
  button_generate = $('#generate'),
  button_reset = $('#reset'),
  input_basic = $('#basic'),
  input_special = $('#special'),
  input_max = $('#max'),
  list = $('.list.0');

window.onload = function() {
  delayedLoadingPublicPictures('../');
}

button_generate.onclick = function() {
  var basic = Number(removeSpace(input_basic.value)),
    special = Number(removeSpace(input_special.value)),
    max = Number(removeSpace(input_max.value));
  if (judgedNumber(basic, special, max)) {
    input_basic.value = basic;
    input_special.value = special;
    input_max.value = max;
    var lottery = generate(basic, special, max);
    addNumber(lottery, special);
  } else {
    list.innerHTML += '输入了不符合条件的数据，请重新输入<br/>';
  }

  function removeSpace(num) {
    num.replace(/\s*(\d)\s*/, "$1");
    return num;
  }
}

button_reset.onclick = function() {
  list.innerHTML = '';
}

function judgedNumber(basic, special, max) {
  if (!_isInteger(basic) || !_isInteger(special) || !_isInteger(max)) {
    return false;
  } else if (max > 100) {
    return false;
  } else if (basic <= 0 || basic > 10) {
    return false;
  } else if (!(special == 0 || special == 1)) {
    return false;
  } else if (max < basic + special) {
    return false;
  } else {
    return true;
  }

  function _isInteger(obj) {
    return typeof obj === 'number' && obj % 1 === 0;
  }
}

function generate(basic, special, max) {
  var total = basic + special,
    lottery = new Array(total);
  for (var i = 0; i < total; i++) {
    lottery[i] = Math.floor(Math.random() * max + 1);
    if (i > 0) {
      for (var j = 0; j < i; j++) {
        if (lottery[i] == lottery[j]) {
          i--;
          break;
        }
      }
    }
  }

  if (!special) {
    lottery.sort(function(a, b) {
      return a - b;
    });
  } else {
    var temp = lottery[lottery.length - 1];
    lottery[lottery.length - 1] = undefined;
    lottery.sort(function(a, b) {
      return a - b;
    });
    lottery[lottery.length - 1] = temp;
  }
  return lottery;
}

//生成函数，生成球的HTML代码
function addNumber(lottery, special) {
  var div = document.createElement('div');
  div.setAttribute("class", "num");
  list.appendChild(div);
  var temp = [];
  if (!special) {
    for (var i = 0; i < lottery.length; i++) {
      create();
    }
  } else {
    for (var i = 0; i < lottery.length - 1; i++) {
      create();
    }
    create();
    temp[i].setAttribute("class", "special")
  }

  function create() {
    var spanText = document.createTextNode(lottery[i]);
    temp[i] = document.createElement('span');
    temp[i].appendChild(spanText);
    div.appendChild(temp[i]);
  }

  var numDivs = $('.num'),
    numSpans = numDivs[numDivs.length - 1].$('span');
  showNumber(numSpans);
}

//依次将球显示出来
function showNumber(numSpans) {
  var i = 0,
    len = numSpans.length;

  function shows() {
    setTimeout(function() {
      if (i < len) {
        numSpans[i].style.display = 'inline-block';
        i++;
        shows();
      }
    }, 100);
  }
  shows();
}