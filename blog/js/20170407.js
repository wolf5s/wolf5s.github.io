window.onload = function () {
 	changeContentHeight();
 	var objDemo = document.getElementById("demo");
 	var objSmallBox = document.getElementById("small-box");
 	var objMark = document.getElementById("mark");
 	var objFloatBox = document.getElementById("float-box");
 	var objBigBox = document.getElementById("big-box");
 	var objBigBoxImage = objBigBox.getElementsByTagName("img")[0];

 	objMark.onmouseover = function () {
 		objFloatBox.style.display = "block";
 		objBigBox.style.display = "block";
 	}

 	objMark.onmouseout = function () {
 		objFloatBox.style.display = "none";
 		objBigBox.style.display = "none";
 	}

 	objMark.onmousemove = function (e) {
 		var x = parseInt(cursorValue(e).left);
 		var y = parseInt(cursorValue(e).top);
 		objFloatBox.style.left = limitValue(x,80,320)-80 + 'px';
 		objFloatBox.style.top = limitValue(y,60,195)-60 + 'px';
 		objBigBoxImage.style.left = (-limitValue(x,80,320) + 80)*2.56 + 'px';
 		objBigBoxImage.style.top = (-limitValue(y,60,195) + 60)*2.56 + 'px';
 	}
 }

 function offsetValue(node){
 	var valueX=0;
 	var valueY=0;
 	while(node.parentNode.nodeName.toUpperCase()!='BODY'){
 		valueX += node.offsetLeft;
 		valueY += node.offsetTop;
 		node = node.parentNode;	
 	}
 	return {'left':valueX,'top':valueY};
 }

 function cursorValue(e){
 	var cursorX = e.clientX - offsetValue(e.target).left;
 	var scrollT = document.documentElement.scrollTop || window.pageYOfset ||document.body.scrollTop;
 	var cursorY = e.clientY + scrollT - offsetValue(e.target).top;
 	return {'left':cursorX,'top':cursorY};
 }

 function limitValue(x,min,max){
 	if(x<min){
 		return min;
 	}else if(x>max){
 		return max;
 	}else{
 		return x;
 	}
 }