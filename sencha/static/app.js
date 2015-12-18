Ext.require(['Ext.MessageBox']);
Ext.Loader.setConfig({
	paths:{
        'app':'static/app'   
    }
});


//游戏活动场景 
var currentActiveGameTabIndex = -1;
var activeUpdatePool = [];
var activeUpdatePoolTime = [];
var tickActiveSum = 0;

var updatePool = [];
var localupdate = {
	sumtick:0,
	
	update:function(){
		this.sumtick += tick;
		if(this.sumtick > 1000){
			//console.log(this.sumtick);
			this.sumtick = 0;
		}
	}
	
	
		
}

function animate(time){
			/*context.clearRect(0,0,canvas.width,canvas.height);
			if(loadmanager.isComplete){
				pause = false;

				if(sceneManager.isFadeIning)
					sceneManager.fadeIn();
				sceneManager.scenes[sceneManager.currentName].update();
				updateDraw();

			}
			fps = showFps();
			context.fillStyle = "yellow";
			context.font = "14px WC ROUGHTRAD Bta,santasy";
			context.fillText('FPS:'+fps+'  Time:'+systemTime+' \t\t\t Tick:'+tick+' Frame: '+frameCount,20,20);
			console.log('ok');
			*/
			localupdate.update();
			for(var func in updatePool){
				func();
			}
			
			if((activeUpdatePool[currentActiveGameTabIndex]) != null){
				tickActiveSum += tick;
				if(tickActiveSum > activeUpdatePoolTime[currentActiveGameTabIndex]){
					tickActiveSum = 0;
					activeUpdatePool[currentActiveGameTabIndex]();
				}
				
			}
			
			showFps();
			window.requestNextAnimationFrame(animate);
		}
		
		

Ext.application({
	name:'Insectgame',
    appFolder:'static/app',
	requires:[
		'Ext.MessageBox'
	],
	
	controllers:['Login','Main','Playmain','About'],
	views:['Login','Main', 'Playmain','About'],
	launch:function(){
		console.log('launch');
		Ext.fly('appLoadingIndicator').destroy();
		
		Ext.Viewport.setMasked({xtype:'loadmask',message:'资源加载...'});
		
		
		img_sencha.src = "/static/images/tmp_sencha.png";
		img_sencha.onload = function(){
				console.log('ok,img loaded');
				img_map.src = '/static/images/lmap32.png';
				img_map.onload = function(){
					Ext.Viewport.setMasked(false);
					Ext.Viewport.add(Ext.create('Insectgame.view.Login'));
				}
			}
		window.requestNextAnimationFrame(animate);
	}
});
