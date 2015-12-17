var lastTime = 0;
var systemTime = 0;
var tick = 0;
var frameCount =0;
var tickSum = 0;
		
function showFps(){
		var now =+ new Date;
		var interval = now - lastTime;
		if(interval == 0)
			interval = 1;
		var fps = Math.floor(1000/interval);
		tick = now - lastTime;
		if(tick > 1000)
			tick = 0;
		systemTime += tick;
		lastTime = now;
		frameCount++;
		if(fps ==Infinity)
			console.log(lastTime);
		//console.log('tick:%d',tick);
		return fps;
	}

function getDis(x1,y1,x2,y2){
	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

function $(id){
	return document.getElementById(id);
}
