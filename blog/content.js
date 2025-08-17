function changeContentHeight() {
  var head = document.getElementById("head"),
    content = document.getElementById("content"),
    footer = document.getElementsByTagName("footer")[0];
  var temp = document.documentElement.clientHeight - footer.offsetHeight - head.offsetHeight - 50;
  if (temp > content.offsetHeight) {
    content.style.height = temp + 'px';
  }
}

window.onresize = function() {
  setTimeout(function() {
    changeContentHeight();
  }, 100);
}