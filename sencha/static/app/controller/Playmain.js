var tabpanelW =0;
var tabpanelH = 0;

var lab;

var playcontrolfinished = false;

function drawHomeInfoTxt(jsonst,context){
	var jsonobj = JSON.parse(jsonst)
	context.font = '16px Palatino';
	context.fillStyle = "black";
	context.fillText(jsonobj['home_title'],235,36);
	//context.fillText(jsonobj['larva_quantity'],119,47);
	//context.fillText(jsonobj['insect_food'],170,90);
	context.fillText(jsonobj['home_lv'],50,140);
	context.fillText(jsonobj['insect_popularity'],170,160);
	
	context.fillText(jsonobj['insect_coid'],235,226);
	context.fillText(jsonobj['insect_power'],235,286);
	context.fillText(jsonobj['hatch_speed'],235,336);
	
	lab = Ext.fly('labelnums');
	lab.setHtml(jsonobj['home_title']);
}

function createCanvas(){
			var canvas = document.getElementById('canvasid');
			var context = canvas.getContext("2d");
			
			context.font = '14px Palatino';
			context.fillStyle = "#5C5959";//mainview_Uiconfig.fontclr;
			drawText(context,20,220,22,tmpdata.introduction);
			
			var clr = '#B5D981';//mainview_Uiconfig.hexagonfillclr;//'
			var clrborder = "#E7FC34";
			drawHexagon(context,60,60,40,clr,clrborder,1);
			
			drawHexagon(context,120,100,35,clr,clrborder,1);
			drawHexagon(context,60,130,35,clr,clrborder,1);
			drawHexagon(context,120,165,35,clr,clrborder,1);
			context.fillRect(100,60,100,1);
			context.fillRect(155,100,100,1);
			context.fillRect(155,165,100,1);
			
			context.fillStyle = '#060606';
			context.fillText('幼虫',45,50);
			context.fillText('虫食',104,97);
			context.fillText('等级',45,122);
			context.fillText('效率 ',104,157);
			
			
			context.fillText('虫币',192,205);
			context.fillText('声望',192,260);
			context.fillText('战力',192,315);
			
			drawScaleImg(context,'slice61_61.png',190,20,0.5);
			drawScaleImg(context,'slice80_80.png',190,210,1);
			drawScaleImg(context,'slice66_66.png',190,265,1);
			drawScaleImg(context,'slice63_63.png',190,320,1);
			
			
			Ext.Ajax.request({
				url:'/gethomedata',
				success:function(response){
					var txt = response.responseText;
					console.log(txt);
					drawHomeInfoTxt(txt,context);
				}
			});
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
		}
var tpl = new Ext.XTemplate('<h1 style="color:black">{str_value}</h1>');
var datatpl = {str_value:'模板文字'};

Ext.define('Insectgame.controller.Playmain',{
	extend:'Ext.app.Controller',
	init:function(){
		console.log('playmain init');
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
			bugdataview:'#buglist'
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
            }
            
		},
		routes:{
			'playmain':'showPlaymainview'
		},
	},
	
	onactivate:function(){
		console.log('playcontrol activate event');
		playcontrolfinished = true;
		initUpdate(0,updateFirst,300);
		
		//初始化探索地图数据
		Ext.Ajax.request({
				url:'/getinsectinfo/mapa',
				success:function(response){
					var txt = response.responseText;
					mapdata = JSON.parse(txt);
				}
			});
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
	onDataviewActive:function(){
		console.log('Dataview activate event');
	},
	onDataviewDeactive:function(){
		console.log('Dataview deactive event');
	},
	onBuglistActivate:function(){
		console.log('buglist activate');
	},
	onBuglistDeactivate:function(){
		console.log('buglist deactivate');
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
