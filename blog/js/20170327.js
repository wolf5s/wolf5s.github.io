var time=0;
var timer;
var hum1info={
	len:0,
	speed:0,
	position:1,
	ptime:0,
	ptimelen:0,
	left:0,
	top:0
}
var hum2info={
	len:200,
	speed:0,
	position:5,
	ptime:0,
	ptimelen:0,
	left:100,
	top:100
}

window.onload=function(){
	changeContentHeight();
	var hum1=document.getElementById("hum1");
	var hum2=document.getElementById("hum2");
	var gob=document.getElementById("go-button");
	var reset=document.getElementById("reset");
	var hum1speed=document.getElementById("speed1");
	var hum2speed=document.getElementById("speed2");
	var hum1ptime=document.getElementById("ptime1");
	var hum2ptime=document.getElementById("ptime2");
	var mention=document.getElementById("mention");
	var Rate=document.getElementById("Rate");
	var radiopom=document.getElementById("radiopom");
	var radiosel=radiopom.getElementsByTagName("input");
	gob.onclick=function(){
		var radioval;
		if(radiosel[0].checked){
			radioval=1;
		}else{
			radioval=0;
		}
		go(hum1speed,hum2speed,hum1ptime,hum2ptime,hum1,hum2,Rate,mention,radioval);
	}
	reset.onclick=function(){
		hum1info={
			len:0,
			speed:0,
			position:1,
			ptime:0,
			ptimelen:0,
			left:0,
			top:0
		}
		hum2info={
			len:200,
			speed:0,
			position:5,
			ptime:0,
			ptimelen:0,
			left:100,
			top:100
		}
		clearInterval(timer);
		hum1.style.left=0;
		hum2.style.left="400px";
		hum1.style.top=0;
		hum2.style.top="400px";
		time=0;
		timer=0;
		mention.innerHTML="默认长度为100米，速度单位为m/s，自行换算单位";
	}
	
}

function go(hum1speed,hum2speed,hum1ptime,hum2ptime,hum1,hum2,Rate,mention,radioval){
	hum1info.speed=parseFloat(hum1speed.value);
	hum2info.speed=parseFloat(hum2speed.value);
	hum1info.ptime=parseInt(hum1ptime.value);
	hum2info.ptime=parseInt(hum2ptime.value);
	timer=null;
	clearInterval(timer);
	timer=setInterval(function(){
		time++;
		movement(hum1info);
		movement(hum2info);
		hum1.style.left=hum1info.left*4 + "px";
		hum2.style.left=hum2info.left*4 + "px";
		hum1.style.top=hum1info.top*4 + "px";
		hum2.style.top=hum2info.top*4 + "px";
		mention.innerHTML="已经过" + time + "单位时间";
		console.log(hum1info.len-hum2info.len);
		if(radioval==1){
			if(hum1info.len-hum2info.len>=0)
			{
				clearInterval(timer);
				mention.innerHTML="经过" + time + "时长能追上";
			}
		}
		else if(radioval==0)
		{
			if(Math.abs(hum1info.position-hum2info.position)<=1||Math.abs(hum1info.position-hum2info.position)<=2&&hum1info.position%2==0||Math.abs(hum1info.position-hum2info.position)>=6&&hum1info.position%2==0||Math.abs(hum1info.position-hum2info.position)>=7)
			{
				clearInterval(timer);
				mention.innerHTML="经过" + time + "时长能看见";
			}
		}
	},Rate.value)
}

function movement(hum){
	switch (hum.position){
		case 1:move1(hum);break;
		case 3:move2(hum);break;
		case 5:move3(hum);break;
		case 7:move4(hum);break;
		case 0:movepause(hum);break;
		case 2:movepause(hum);break;
		case 4:movepause(hum);break;
		case 6:movepause(hum);break;
	}
}

function movepause(hum){
	if(hum.ptimelen==0){
		hum.position++;
		switch(hum.position){
			case 1:move1(hum);break;
			case 3:move2(hum);break;
			case 5:move3(hum);break;
			case 7:move4(hum);break;
		};
	}else{
		hum.ptimelen--;
	}
}

function move1(hum){
	hum.len+=hum.speed;
	hum.left+=hum.speed;
	if(hum.left>=100){
		hum.left=100;
		hum.position++;
		hum.ptimelen=hum.ptime;
	}
}

function move2(hum){
	hum.len+=hum.speed;
	hum.top+=hum.speed;
	if(hum.top>=100){
		hum.top=100;
		hum.position++;
		hum.ptimelen=hum.ptime;
	}
}

function move3(hum){
	hum.len+=hum.speed;
	hum.left-=hum.speed;
	if(hum.left<=0){
		hum.left=0;
		hum.position++;
		hum.ptimelen=hum.ptime;
	}
}

function move4(hum){
	hum.len+=hum.speed;
	hum.top-=hum.speed;
	if(hum.top<=0){
		hum.top=0;
		hum.position=0;
		hum.ptimelen=hum.ptime;
	}
}
