var content = right.$('.content.0'),
  year = $('#year'),
  month = $('#month'),
  table = $('#calendar-table'),
  tableBody = table.$('tbody.0'),
  tdDays = tableBody.$('td'),
  temp = '';
const DATA = {
  MINYEAR: 2000,
  MAXYEAR: 2049
}
var now = new Date();

year.onchange = function() {
  dayList();
}

month.onchange = function() {
  dayList();
}

window.onload = function() {
  delayedLoadingPublicPictures('../');
  init();
  dayList(now);
  var currentYear = getSelectOption(year, now.getFullYear()),
    currentMonth = getSelectOption(month, now.getMonth() + 1),
    currentDay = getSelectDays(tdDays);
  currentYear.setAttribute('selected', 'true');
  currentMonth.setAttribute('selected', 'true');
  if (!judgeWidth()) {
    touch(table);
  }
}

window.onresize = function() {
  adjustmentWindow();
}

addEvent(tableBody, 'mouseover', function(e) {
  if (e.target.innerHTML) {
    e.target.setAttribute('class', 'choose');
  }
});

addEvent(tableBody, 'mouseout', function(e) {
  e.target.removeAttribute('class');
  if (now.getFullYear() == year.options[year.selectedIndex].value &&
    now.getMonth() + 1 == month.options[month.selectedIndex].value) {
    getSelectDays(tdDays);
  }
});

function init() {
  for (var i = DATA.MINYEAR; i <= DATA.MAXYEAR; i++) {
    temp += '<option value="' + i + '">' + i + '</option>'
  }
  year.innerHTML = temp;
  temp = '';

  for (var i = 1; i <= 12; i++) {
    temp += '<option value="' + i + '">' + i + '</option>'
  }
  month.innerHTML = temp;
}

//移动端添加滑动事件
function touch(element) {
  var startx,
    endx;

  addEvent(element, 'touchstart', function(e) {
    e.preventDefault();
    var touch = e.changedTouches;
    startx = touch[0].clientX;
  });

  addEvent(element, 'touchend', function(e) {
    e.preventDefault();
    var touch = e.changedTouches;
    endx = touch[0].clientX;
    if (Math.abs(endx - startx) > 40) {
      changeTime(startx > endx ? 1 : 2);
    }
  });
}

function changeTime(change) {
  var yearValue = year.options[year.selectedIndex].value,
    monthValue = month.options[month.selectedIndex].value;
  if (change == 1) {
    monthValue--;
    if (monthValue < 1) {
      yearValue = Math.max((Number(yearValue) - 1), DATA.MINYEAR);
      monthValue = 12;
      if (yearValue == DATA.MINYEAR) {
        monthValue = 1;
      }
    }
  } else if (change == 2) {
    monthValue++;
    if (monthValue > 12) {
      yearValue = Math.min((Number(yearValue) + 1), DATA.MAXYEAR);
      monthValue = 1;
      if (yearValue == DATA.MAXYEAR) {
        monthValue = 12;
      }
    }
  }
  getSelectOption(year, yearValue).selected = true;
  getSelectOption(month, monthValue).selected = true;
  dayList();
}

function dayList(date) {
  var yearValue, monthValue;
  if (!date) {
    yearValue = year.options[year.selectedIndex].value;
    monthValue = month.options[month.selectedIndex].value;
    date = new Date(yearValue + '//' + monthValue + '//01');
  } else {
    yearValue = date.getFullYear();
    monthValue = date.getMonth() + 1;
    date.setDate('1');
  }

  var temp = '';
  tableBody.innerHTML = '';

  var listData = {
    Leap: dayAttr(yearValue, monthValue).Leap,
    days: dayAttr(yearValue, monthValue).days,
    starWeek: date.getDay()
  }
  tempStarWeek = listData.starWeek;

  //建立表格
  var tempWeek;
  for (var i = 1; i <= listData.days; i++) {
    while (tempStarWeek) {
      temp += '<td></td>';
      tempStarWeek--;
    }
    temp += '<td>' + i + '</td>';
    tempWeek--;
    if ((i + listData.starWeek) % 7 == 0 && i != listData.days) {
      temp += '</tr><tr>';
      tempWeek = 7;
    }
  }
  //表格补位
  while (tempWeek % 7) {
    temp += '<td></td>';
    tempWeek--;
  }
  temp += '</tr>';
  tableBody.innerHTML += temp;
  //content自适应高度
  useContentHeight();
  var now = new Date();
  if (yearValue == now.getFullYear() && monthValue == now.getMonth() + 1) {
    getSelectDays(tdDays);
  }
}

//判断平润年与每个月的天数
function dayAttr(year, month) {
  var Leap,
    days;
  if (year % 4 != 0) {
    Leap = 0;
  } else {
    if (year % 100 == 0 && year % 400 != 0) {
      Leap = 0;
    } else {
      Leap = 1;
    }
  }

  switch (parseInt(month)) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      days = 31;
      break;
    case 2:
      days = Leap === 1 ? 29 : 28;
      break;
    default:
      days = 30;
      break;
  }
  return {
    'Leap': Leap,
    'days': days
  };
}

//寻找对应值的元素
function getSelectOption(parent, value) {
  var options = parent.$('option');
  for (var i = 0; i < options.length; i++) {
    if (options[i].value == value) {
      return options[i];
    }
  }
}

function getSelectDays(parent, value) {
  var value = new Date().getDate();
  for (var i = 0; i < parent.length; i++) {
    if (parent[i].innerHTML == value) {
      parent[i].setAttribute('class', 'choose');
      return 0;
    }
  }
}

function useContentHeight() {
  var trs = content.$('tr');
  content.style.height = trs.length * 50 + 65 + 'px';
}