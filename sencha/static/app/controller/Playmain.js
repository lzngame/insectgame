var tabpanelW =0;
var tabpanelH = 0;

var lab;

var playcontrolfinished = false;

function drawHomeInfoTxt(context){
	context.font = '16px Palatino';
	context.fillStyle = "black";
	var homeInfoObj = titleArray['/gethomedata'].infoobj;
	context.fillText(homeInfoObj['home_title'],235,36);
	context.fillText(homeInfoObj['home_lv'],50,140);
	context.fillText(homeInfoObj['insect_popularity'],170,160);
	context.fillText(homeInfoObj['insect_coid'],235,226);
	context.fillText(homeInfoObj['insect_power'],235,286);
	context.fillText(homeInfoObj['hatch_speed'],235,336);
	
	lab = Ext.fly('labelnums');
	lab.setHtml(homeInfoObj['home_title']);
}

function createCanvas(){
			var canvas = document.getElementById('canvasid');
			var context = canvas.getContext("2d");
			
			//context.fillStyle = 'red';
			//context.fillRect(0,0,200,300);
			
			context.font = '14px Palatino';
			context.fillStyle = "#5C5959";//mainview_Uiconfig.fontclr;
			//drawText(context,20,220,22,tmpdata.introduction);
			
			
			var clr = '#B5D981';//mainview_Uiconfig.hexagonfillclr;//'
			var clrborder = "#E7FC34";
			var initxPos = 10;
			var inityPos =  (tabpanelH - 429)/10.0;
			var rHex = tabpanelH/10;
			console.log('六边形半径：',rHex);
			
			var x =  initxPos+rHex;
			var y =  inityPos+rHex;
			if(tabpanelH <= 429)
				y = rHex*Math.sin(Math.PI/3)+3;
			var rsin = rHex*Math.sin(Math.PI/3) + 3;
			for(var i=0;i<4;i++){
				drawHexagon(context,x,y+2*i*rsin,rHex,clr,clrborder,1);
				context.fillRect(x+rHex,y+2*i*rsin,100,1);
			}
			context.font = '14px Palatino';
			context.fillStyle = "#5C5959";
			//context.fillText('x',300,y+7*rsin+10);
			drawText(context,x - rHex,y+7*rsin+20,25,tmpdata.introduction);
			var imguplv = Ext.getCmp('uplv');
			imguplv.setTop(y+7*rsin+10);
			imguplv.setLeft(tabpanelW-imguplv.getWidth()-5);
			
			var imghelp = Ext.getCmp('help4');
			imghelp.setTop(y);
			imghelp.setLeft(tabpanelW-imghelp.getWidth()-25);
			
			var imgwarning = Ext.getCmp('warning');
			imgwarning.setTop(y+60);
			imgwarning.setLeft(tabpanelW-imghelp.getWidth()-25);
			
			var imgsave = Ext.getCmp('save');
			imgsave.setTop(y+160);
			imgsave.setLeft(tabpanelW-imgsave.getWidth()-25);
			
			drawHomeInfoTxt(context);
			
			r1 = tabpanelW/16;
			r2 = r1*Math.sin(Math.PI/3);
			r3 = r1*Math.cos(Math.PI/3);
			
		}

function setCanvasSize(){
			var canvas = document.getElementById('canvasid');
			var obj = Ext.get('homepanel');
			var w = obj.getWidth();
			var h = obj.getHeight();
			canvas.width = w;
			canvas.height = h;
			tabpanelW = w;
			tabpanelH = h;
			console.log('舞台宽高：',tabpanelW,tabpanelH);
		}

Ext.define('Insectgame.controller.Playmain',{
	extend:'Ext.app.Controller',
	init:function(){
		console.log('playmain view init');
	},
	config:{
		refs:{
			playmainview:{
				selector:'playmainview',
				xtype:'playmainview',
				autoCreate:true
			},
			loginview:'loginview',
			uplv:'#uplv',
			dataviewuser:'#datatviewuserid',
			labnum:'#labelnums',
			homepanel:'#homepanel',
			mappanel:'#mappanel',
			bugdataview:'#buglist',
			depotdataview:'#depotdataviewid'
		},
		control:{
			playmainview:{
				activate:'onactivate'
			},
			
			uplv:{
                tap:'uplv_onclick',
                activate:'imbbtn_act',
            },
            dataviewuser:{
            	itemsingletap:'item_ontap',
            },
            homepanel:{
            	activate:'onHomepanelactivate',
            	deactivate:'onHomepaneldeactivate'
            },
            bugdataview:{
            	activate:'onBuglistActivate',
            	deactivate:'onBuglistDeactivate'
            },
            depotdataview:{
            	activate:'onDepotlistActivate',
            	deactivate:'onDepotlistDeactivate'
            },
            
		},
		routes:{
			'playmain':'showPlaymainview'
		},
	},
	
	onactivate:function(){
		console.log('playcontrol activate event');
		playcontrolfinished = true;
		initUpdate(0,updateFirst,300);
		
	},
	
	showPlaymainview:function(){
		Ext.Viewport.setActiveItem(this.getPlaymainview());
	},
	uplv_onclick:function(){
		Ext.Viewport.animateActiveItem(this.getLoginview(),{type:'slide',direction:'right'});
		this.redirectTo('login');
	},
	onHomepanelactivate:function(){
		console.log('home panel onHomepanel activateevent on control');
		if(playcontrolfinished){
			setCanvasSize();
			createCanvas();
			currentActiveGameTabIndex = 0;
		}
	},
	onHomepaneldeactivate:function(){
		console.log('home panel onHomepaneldeactivate event on control');
		currentActiveGameTabIndex = 1;
	},
	onBuglistActivate:function(){
		console.log('buglist activate');
		if(bugstore.getData().length == 0)
			bugstore.setData(titleArray['/getinsectinfo/bugs'].infoobj);																								
	},
	onBuglistDeactivate:function(){
		console.log('buglist deactivate');
	},
	onDepotlistActivate:function(){
		console.log('depotlist activate');
		if(depotstore.getData().length == 0)
			depotstore.setData(titleArray['/getinsectinfo/depot'].infoobj);																								
	},
	onDepotlistDeactivate:function(){
		console.log('depotlist deactivate');
	},
	item_ontap:function(thisself,index,item,record,e,eOpts){
        console.log('选择操作对象');
    }
});

function initUpdate(id,func,t){
	activeUpdatePool[id] = func;
	if(t==null)
		t = 1000;
	activeUpdatePoolTime[id] = t;
}

function updateFirst(){
	var lab = Ext.get('labelnums');
	var labelfoodnums = Ext.get('labelfoodnums');
	lab.setHtml(systemTime);
	labelfoodnums.setHtml(tick);
}
