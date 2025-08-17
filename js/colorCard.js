var content = $('.content.0');

window.onload = function() {
  delayedLoadingPublicPictures('../');
  var cul = new Array(7);
  for (var i = 0; i < 7; i++) {
    cul[i] = document.createElement('ul');
    for (var j = 0; j < 21; j++) {
      var cli = document.createElement('li');
      cul[i].appendChild(cli);
    }
    switch (i) {
      case 0:
        cul[i].className = "swatches red";
        break;
      case 1:
        cul[i].className = "swatches orange";
        break;
      case 2:
        cul[i].className = "swatches yellow";
        break;
      case 3:
        cul[i].className = "swatches green";
        break;
      case 4:
        cul[i].className = "swatches blue";
        break;
      case 5:
        cul[i].className = "swatches purple";
        break;
      case 6:
        cul[i].className = "swatches gray";
        break;
    };
    content.appendChild(cul[i]);
  }
}