var tabpanelW =0;
var tabpanelH = 0;

var lab;
var labelfoodnums;
var playcontrolfinished = false;

function drawHomeInfoTxt(context){
	context.font = '16px Palatino';
	context.fillStyle = "black";
	var homeInfoObj = titleArray[keyinfos.homeinfokey].infoobj;
	
	var x =  initxPos+2*rHex+30;
	var y =  inityPos+rHex-5;
	var rsin = rHex*Math.sin(Math.PI/3) + 3;
	
	context.fillText(homeInfoObj['home_title'],tabpanelW - 100,36);
	
	context.fillText(homeInfoObj['home_lv'],x,y+1*rsin);
	context.fillText(homeInfoObj['insect_popularity'],x,y+2*rsin);
	context.fillText(homeInfoObj['insect_coid'],x,y+3*rsin);
	context.fillText(homeInfoObj['insect_power'],x,y+4*rsin);
	context.fillText(homeInfoObj['hatch_speed'],x,y+5*rsin);
	
	lab = Ext.fly('labelnums');
	lab.setLeft(x);
	lab.setTop(y-15);
	
	labelfoodnums = Ext.getCmp('labelfoodnums');
	labelfoodnums.setLeft(x);
	labelfoodnums.setTop(y+6*rsin-15);
}

var initxPos = 0;
var inityPos = 0;
var rHex = 0;

function createCanvas(){
			var canvas = document.getElementById('canvasid');
			var context = canvas.getContext("2d");
			context.font = '14px Palatino';
			context.fillStyle = "#5C5959";//mainview_Uiconfig.fontclr;
			var clr = '#B5D981';//mainview_Uiconfig.hexagonfillclr;//'
			var clrborder = "#E7FC34";
			initxPos = 10;
			inityPos =  (tabpanelH - 429)/10.0;
			rHex = tabpanelH/10;
			console.log('六边形半径：',rHex);
			var x =  initxPos+rHex;
			var y =  inityPos+rHex;
			if(tabpanelH <= 429)
				y = rHex*Math.sin(Math.PI/3)+3;
			var rsin = rHex*Math.sin(Math.PI/3) + 3;
			for(var i=0;i<4;i++){
				drawHexagon(context,x,y+2*i*rsin,rHex,clr,clrborder,1);
			}
			drawImgCenter(context,'slice79_79.png',x,y);
			for(var i=0;i<7;i++){
				drawImgCenter(context,titles[i]+'.png',x,y+i*rsin);
				context.fillRect(x+rHex,y+i*rsin,100,1);
			}
			context.font = '14px Palatino';
			context.fillStyle = "#5C5959";
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
			r1 = tabpanelW/12;
			r2 = r1*Math.sin(Math.PI/3);
			r3 = r1*Math.cos(Math.PI/3);
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
			depotdataview:'#depotdataviewid',
			depotlist:'#depotlistid'
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
            depotlist:{
            	itemsingletap:'depotitem_ontap', 
            }
		},
		routes:{
			'playmain':'showPlaymainview'
		},
	},
	onactivate:function(){
		console.log('playcontrol activate event');
		
		if(titleArray[keyinfos.homeinfokey].infoobj == null){
			//console.log(this);
			//gotoLogin(this);
			loadLogingLocalData();
			playcontrolfinished = true;
			initUpdate(0,updateFirst,300);
			initUpdate(3,updateSencond,1000);
		}else{
			playcontrolfinished = true;
			initUpdate(0,updateFirst,300);
			initUpdate(3,updateSencond,1000);
		}
	},
	
	showPlaymainview:function(){
		Ext.Viewport.setActiveItem(this.getPlaymainview());
	},
	uplv_onclick:function(){
		console.log(this);
		gotoLogin(this);
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
		currentActiveGameTabIndex = 1;
		if(bugstore.getData().length == 0)
			bugstore.setData(titleArray[keyinfos.bugskey].infoobj);																								
	},
	onBuglistDeactivate:function(){
		console.log('buglist deactivate');
	},
	onDepotlistActivate:function(newActiveItem, thisself, oldActiveItem, eOpts){
		console.log('depotlist activate');
			currentActiveGameTabIndex = 4;
		if(depotstore.getData().length == 0){
			//console.log('设置仓库数据');
			//depotstore.setData(depotdataObjArray);
		}
	},
	onDepotlistDeactivate:function(){
		console.log('depotlist deactivate');
	},
	onDepotItemsingletap:function(thisself,index,target,record,e,eopts){
		console.log(record);
		debugger;
	},
	item_ontap:function(thisself,index,item,record,e,eOpts){
        console.log('选择操作对象');
   },
   depotitem_ontap:function(thisself,index,item,record,e,eOpts){
        var selectid = record.id;
        var configitem = getGoodsConfigItem(record.data.id);
        if(configitem.isuse == 't'){
        	var msgobj = useGoodsDic[configitem.id];
        	if(msgobj.checkfunc())
        	{
        		Ext.Msg.alert(msgobj.title,msgobj.content,function(optional){
        			depotstore.removeAt(index);
        			removeDepotdata(configitem.id);
        			var newobjid = egg2imago[configitem.id];
        			if(newobjid != null){
        				excuteBugsdata(newobjid,record.data.count);
        			}
        		});
        	}else
        	{
        		Ext.Msg.alert(msgobj.title,msgobj.content+'<br\>'+msgobj.insufficient);
        	}
        }
   }
});

function gotoLogin(thisself){
	Ext.Viewport.animateActiveItem(thisself.getLoginview(),{type:'slide',direction:'right'});
	thisself.redirectTo('login');
}

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
	//console.log(systemTime);
}

function updateSencond(){
	//console.log('second:%d',systemTime);
}
