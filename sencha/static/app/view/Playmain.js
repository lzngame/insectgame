Ext.require(['Ext.Carousel','Ext.Label']);
var dataclr = ['red','green','blue','yellow'];

var r1,r2,r3;

var searchBtnR = 30;
var searchBtnX = 0;
var searchBtnY = 0;

//获取坐标对应的像素坐标
function getHexPos(x,y){
	var xpos = (r1+r3)*x;
	var ypos = 2*r2*y;
	if(x%2==0)
		ypos =2*r2*y-r2;
	return [xpos,ypos];
}

function drawLargemap(){
	var canvas = $('canvasid2');
	canvas.width = tabpanelW;
	canvas.height = tabpanelH;
	var context = canvas.getContext("2d");
	context.clearRect(0,0,tabpanelW,tabpanelH);
	context.strokeStyle = 'black';
	context.strokeRect(5,5,tabpanelW-8,tabpanelH-8);
	context.fillStyle ="#454545";
	context.fillRect(7,7,tabpanelW-15,tabpanelH-15);
	context.drawImage(img_map,0,0,img_map.width,img_map.height,15,15,tabpanelW-15,tabpanelH-15);
	
	
	context.fillStyle='white';
	context.fillText('曼普多提大陆     当前地图：危险丛林',10,375+15);
	context.fillText('当前探索进度：★★★★☆☆',10,375+30);
	
	drawScaleImg(context,'slice10_10.png',86,86,1);
	drawScaleImg(context,'slice94_94.png',171,216,1);
	
	searchBtnX = tabpanelW - 1.5*searchBtnR;
	searchBtnY = 1.5*searchBtnR;
	drawHexagon(context,searchBtnX,searchBtnY,30,'black','white',0);
	context.fillStyle = 'white';
	context.font = '18px Palatino';
	context.fillText('探索',searchBtnX-20,searchBtnY+4);
}

function drawHexMap(){
	var canvas = $('canvasid2');
	canvas.width = tabpanelW;
	canvas.height = tabpanelH;
	var context = canvas.getContext("2d");
			
	var clrborder = "#333300";
	var clr='#99cc00';
			
	var wL = Math.ceil(tabpanelW/r2);
	var hL = Math.ceil(tabpanelH/r2);
	for(var i=0;i<wL;i++){
		for(var j=0;j<hL;j++){
			var xpos =  getHexPos(j,i)[0];
			var ypos =  getHexPos(j,i)[1];
			drawHexagon(context,xpos,ypos,r1,clr,clrborder,1);
			context.fillStyle = 'blue';
			context.fillText(j.toString()+','+i.toString(),xpos-8,ypos);
		}
	}
	
	var mapdataInfoObj = mapArray[keyinfos.mapkey].infoobj;
	for(var i=0;i<mapdataInfoObj.length;i++){
		var item = mapdataInfoObj[i];
		var x = parseInt(item.x);
		var y = parseInt(item.y);
		var configItem = getMapdataConfigItem(item.type,item.id);
		var isopen = (parseInt(item.isopen) != 0);
		var count = parseInt(item.count);
		if(isopen){
				var iconurl = configItem.iconurl;
				var xpos = getHexPos(x,y)[0];
				var ypos = getHexPos(x,y)[1];
				drawImgCenter(context,iconurl,xpos,ypos);
		}
	}
	
	context.fillText('点击探索地图',tabpanelW/2-40,10);
}

//获取焦点周围
function getFocusRound(x,y){
	var xc1 = x;
	var yc1 = y;
	var roundSix = null;
	if(xc1<=1){
		if(yc1<=5){
			roundSix = [
				[xc1+1,  yc1], 
				[xc1+1,  yc1+1],  
				[xc1+1,  yc1+2],
				[xc1+1,  yc1+3],  
				[xc1+1,  yc1+4], 
				[xc1+1,  yc1+5]    
				];
		}else{
			roundSix = [
				[xc1+1,  yc1], 
				[xc1+1,  yc1-1],  
				[xc1+1,  yc1-2],
				[xc1+1,  yc1-3],  
				[xc1+1,  yc1-4], 
				[xc1+1,  yc1-5]    
				];
		}
	}else if(xc1 >=7){
		if(yc1<=5){
			roundSix = [
				[xc1-1,  yc1], 
				[xc1-1,  yc1+1],  
				[xc1-1,  yc1+2],
				[xc1-1,  yc1+3],  
				[xc1-1,  yc1+4], 
				[xc1-1,  yc1+5]    
				];
		}else{
			roundSix = [
				[xc1-1,  yc1], 
				[xc1-1,  yc1-1],  
				[xc1-1,  yc1-2],
				[xc1-1,  yc1-3],  
				[xc1-1,  yc1-4], 
				[xc1-1,  yc1-5]    
				];
		}
	}else{
		roundSix = [
				[xc1,  yc1-1], //top
				[xc1+1,yc1],  //right top 
				[xc1+1,yc1+1],//right bottom
				[xc1,  yc1+1],  //bottom
				[xc1-1,yc1+1], //left bottom
				[xc1-1,yc1]    //right bottom
				];
				
		if(xc1 % 2 == 0){
			roundSix[1] =[xc1+1,yc1-1],
			roundSix[2] =[xc1+1,yc1],
			roundSix[4] =[xc1-1,yc1],
			roundSix[5] =[xc1-1,yc1-1];
		}
	}
	return roundSix;
}

//获取离点击最近的六边形坐标
function getTapFocus(xtap,ytap){
	var xt1 = xtap / (r1+r3);
	var yt1 = ytap / (2*r2)+1;
	
	var xc = Math.floor(xt1);
	var yc = Math.floor(yt1);
	
	var mindis = 100000000;
	var xcoodr = -1;
	var ycoodr = -1;
	
	var round = [
				[xc,yc],
				[xc,yc+1],[xc,yc-1],
				[xc-1,yc-1],[xc-1,yc],
				[xc+1,yc-1],[xc+1,yc]
				];
	for(var i=0;i<7;i++){
		var xpos =  getHexPos(round[i][0],round[i][1])[0];
		var ypos =  getHexPos(round[i][0],round[i][1])[1];
		
		var dis = Math.pow((xpos-xtap),2)+Math.pow((ypos-ytap),2);
		if(dis < mindis){
			mindis = dis;
			xcoodr = round[i][0];
			ycoodr = round[i][1];
		}
	}
	return [xcoodr,ycoodr];
}

function checkRound(ar,x,y){
	var re = -1;
	for(var i=0;i<ar.length;i++){
		if(x == ar[i][0] && y == ar[i][1]){
			re = i;
			break;
		}
	}
	return re;
}

function drawFoucsRound(xcoodr,ycoodr,handlerNames,note,context){
	var round = getFocusRound(xcoodr,ycoodr)
	if(handlerNames.length == 1 && handlerNames[0] == 'empty')
		return;
	for(var i=0;i<handlerNames.length;i++){
		var xpos =  getHexPos(round[i][0],round[i][1])[0];
		var ypos =  getHexPos(round[i][0],round[i][1])[1];

		drawHexagon(context,xpos,ypos,r1,clrar[i],'white',1);
		context.fillStyle ='black';
		context.fillText(handlerNames[i],xpos-10,ypos);
	}
	
	var x = tabpanelW/2 - titleTooltipWidth/2;
	var y = tabpanelH - titleTooltipHeight -5;
	if(ycoodr > 5)
		y = 5;
	context.roundRect(x-2,y-2,titleTooltipWidth+4,titleTooltipHeight+4,5).stroke();
	context.roundRect(x,y,titleTooltipWidth,titleTooltipHeight,5).fill();
	context.fillStyle = 'white';
	var notearray = note.split(';');
	for(var i in notearray){
		context.fillText(notearray[i],x+15,y+25+(i*20));
	}
	
}

function clearCanvas(){
	var canvas = $('canvasid2');
	var context = canvas.getContext("2d");
	context.clearRect(0,0,tabpanelW,tabpanelH);
}

var panelc3 = Ext.create('Ext.Panel',{
	id:'mappanelid',
	html:'<canvas id="canvasid2" style="margin:0px;padding:0px;"></canvas>',
	style:'background-color:#ccffdd',
	styleHtmlCls:'padding:0px',
	status:-1,
	currentActive:[-1,-1],
	activePanel:0,
	listeners:{
		activate:function(){
			console.log('current panel:',this.config.activePanel);
			if(this.config.activePanel == 0){
				this.config.status = -1;
				this.config.currentActive[0]=-1;
				this.config.currentActive[1]=-1;
				drawLargemap();
				this.element.removeListener('tap',tapMapTwo);
				this.element.on('tap',tapMapOne);
				console.log('当前活动场景---整体地图');
				currentActiveGameTabIndex = 2;
			}else if(this.config.activePanel == 1){
				drawHexMap();
				this.element.removeListener('tap',tapMapOne);
				this.element.on('tap',tapMapTwo);
				console.log('当前活动场景---探索地图');
				currentActiveGameTabIndex = 3;
			}
			
		},
		deactivate:function(){
			var context = $('canvasid2').getContext('2d');
			context.clearRect(0,0,tabpanelW,tabpanelH);
			this.config.status = -1;
			this.config.currentActive[0]=-1;
			this.config.currentActive[1]=-1;
			this.removeAll();
			console.log('planec3 deactive');
		}
	}
});

function tapMapOne(thisself,e,t,eopt){
	console.log('tapmapone');
	var canvas = $('canvasid2');
	var context = canvas.getContext("2d");
	var tapx = thisself.pageX;
	var tapy = thisself.pageY;
	var dis = getDis(tapx,tapy,searchBtnX,searchBtnY);
	console.log('Dis:%f',dis);
	
	
	if(dis < 30){
		panelc3.element.removeListener('tap',tapMapOne);
		panelc3.element.on('tap',tapMapTwo);
		context.clearRect(0,0,tabpanelW,tabpanelH);
		drawHexMap();
		panelc3.config.activePanel = 1;
		currentActiveGameTabIndex = 3;
	}
}

function tapMapTwo(thisself,e,t,eopt){
	console.log('tapmaptwo');
	var canvas = $('canvasid2');
	var context = canvas.getContext("2d");
	
	var tapArray = getTapFocus(thisself.pageX,thisself.pageY);
	var xcoodr = tapArray[0];
	var ycoodr = tapArray[1];
	console.log('点击(%d,%d)',xcoodr,ycoodr);
	
	
	if(panelc3.config.status == 0){
		var roundtmp = getFocusRound(panelc3.config.currentActive[0],panelc3.config.currentActive[1]);
		var re = checkRound(roundtmp,xcoodr,ycoodr);
		var item = getMapdataItem(panelc3.config.currentActive[0],panelc3.config.currentActive[1]);
		var configItem = getMapdataConfigItem(item.type,item.id);
		var handlers = configItem.handler;
		var hary = handlers.split(';');
		var noteobj ={
			tooltiptxt:''
		};
		if(re != -1 && re < hary.length){
			console.log('执行事件：%d :%s 数量:%d',re,hary[re],item.count*100);
			
			setMapdata(panelc3.config.currentActive[0],panelc3.config.currentActive[1]);
			var id = item.id;
			if(item.type == 'pickup'){
					var num = parseInt(item.supply);
					noteobj.tooltiptxt = '采集'+item.note+'资源'+ num.toString();
					if(parseInt(item.count) == -1){
						console.log('不枯竭的资源');
					}else{
						item.count = parseInt(item.count) - num;
						if(parseInt(item.count) <= 0){
							item.count = 0;
							item.type = 'balk';
							item.id = 'landform003';
							item.note = '空地';
						}
					}
					excuteDepotdata(id,num);
			}
			else if(item.type == 'balk'){
					if(item.id == 'landform003'){
						if(re == 0){
							item.id = 'build001';
							item.note = '兵巢';
							noteobj.tooltiptxt = '建造兵巢成功';
						}else if(re == 1){
							item.id = 'build002';
							item.note ='工巢';
							noteobj.tooltiptxt  = '建造工巢成功';
						}else if(re == 5){
							item.id = 'build003';
							item.note ='菌蒲';
							noteobj.tooltiptxt  = '建造菌蒲成功';
						}
					}
					else {
						var obj = buildDic[item.id];
						obj[re](item,noteobj);
					}
			}else if(item.type =='exit'){
					panelc3.element.removeListener('tap',tapMapTwo);
					panelc3.element.on('tap',tapMapOne);
					context.clearRect(0,0,tabpanelW,tabpanelH);
					drawLargemap();
					panelc3.config.activePanel = 0;
					currentActiveGameTabIndex = 2;
					
					panelc3.config.status = -1;
					panelc3.config.currentActive[0]=-1;
					panelc3.config.currentActive[1]=-1;
					return;
			}else if(item.type == 'next'){
				Ext.Viewport.setMasked({xtype:'loadmask',message:'资源加载...'});
				var homeInfoObj = titleArray[keyinfos.homeinfokey].infoobj;
				var nextmap = parseInt(homeInfoObj['hatch_speed'])+1;
				var urltmp = '/getcurrentmap/'+ nextmap.toString();
				mapArray[keyinfos.mapkey].finishedid = false;
				loadNewMapdata(urltmp,nextmap);
				
				panelc3.config.status = -1;
				panelc3.config.currentActive[0]=-1;
				panelc3.config.currentActive[1]=-1;
				return;
			}
				
			Ext.toast(noteobj.tooltiptxt,1000);
			saveData('mapdata');
			
			panelc3.config.status = -1;
			panelc3.config.currentActive[0]=-1;
			panelc3.config.currentActive[1]=-1;
			
			context.clearRect(0,0,tabpanelW,tabpanelH);
			drawHexMap();
			return;
		}
	}
	
	if(panelc3.config.currentActive[0] == xcoodr && panelc3.config.currentActive[1] == ycoodr){
			console.log('点击原来的点');
			panelc3.config.status = -1;
			panelc3.config.currentActive[0]=-1;
			panelc3.config.currentActive[1]=-1;
			context.clearRect(0,0,tabpanelW,tabpanelH);
			drawHexMap();
	}else{
			panelc3.config.currentActive =[xcoodr,ycoodr];
			console.log('new focus:%d:%d',xcoodr,ycoodr);
			panelc3.config.status = 0;
			var xpos = (r1+r3)*xcoodr;
			var ypos = 2*r2*ycoodr;
			if(xcoodr%2==0)
				ypos =2*r2*ycoodr-r2;
			
			var obj1 = getFocusRound(xcoodr,ycoodr);
			var item = getMapdataItem(xcoodr,ycoodr);
			var configItem = getMapdataConfigItem(item.type,item.id);
			var handlers = configItem.handler;
			var note = configItem.description;
			var name = configItem.name;
			var hary = handlers.split(';');
			
			
			setMapdata(panelc3.config.currentActive[0],panelc3.config.currentActive[1]);
			saveData('mapdata');
			
			context.clearRect(0,0,tabpanelW,tabpanelH);
			drawHexMap();
			drawHexagonBorder(context,xpos,ypos,r1-3,'yellow',1);
			drawFoucsRound(xcoodr,ycoodr,hary,(name+":"+note),context);
		}
}

//切换游戏场景
function tabToTarget(targetIndex){
		tabToTargetColor(targetIndex);
		tabToPanel(targetIndex);
	}

//切换下方场景标识颜色
function tabToTargetColor(targetIndex){
			var carousel = Ext.getCmp('topcarousel');
			var currentIndex = carousel.getActiveIndex();
			var dis = targetIndex - currentIndex;
			var row = Ext.getCmp('signtoolbar');
			var signs = row.getItems().items;
			for(var i=0;i<signs.length;i++){
				if(i == targetIndex)
					signs[targetIndex].setStyle('background-color:'+dataclr[i]);
				else
					signs[i].setStyle("background-color:white");
			}
	}

//切换场景
function tabToPanel(targetIndex){
	var carousel = Ext.getCmp('topcarousel');
	var currentIndex = carousel.getActiveIndex();
	var dis = targetIndex - currentIndex;
	for(var i=0;i<Math.abs(dis);i++){
		if(dis > 0)
			carousel.next();
		else
			carousel.previous();
	}
}

Ext.define('User',{
			extend:'Ext.data.Model',
			config:{
				fields:['id','name','lv','power','class','classnote','count','description']
			}
		});
Ext.define('Depot',{
	extend:'Ext.data.Model',
	config:{
		fields:['id','name','lv','count','unit','description']
	}
});
		
var bugTemplate=new Ext.XTemplate( 
			'<tpl>',
			  '<div class="totaldiv">',
				'<div class="inlinediv">',
				    '<div class="title_011">{name}</div>',
				    '<div class="title_044">Lv:{lv}</div>',
				'</div>',
				'<div class="inlinediv">',
				    '<div class="title_022">类别:{classnote}</div>',
				    '<div class="title_055">能力:{power}</div>',
				'</div>',
				 '<div class="title_023">数量：{count}</div>',
				 '<div class="title_034">{description}</div>',
			  '</div>',
			'</tpl>'
        ); 
		
var bugstore = Ext.create( 'Ext.data.Store',{
			model:'User',
			autoLoad:true,
			remoteSort:false,
			data:null//titleArray[keyinfos.bugskey].infoobj,
		});

var depotstore = Ext.create( 'Ext.data.Store',{
			model:'Depot',
			autoLoad:true,
			remoteSort:false,
			data:null//titleArray[keyinfos.depotkey].infoobj,
		});

var depotTemplate=new Ext.XTemplate( 
			'<tpl>',
			  '<div class="totaldiv">',
				'<div class="inlinediv">',
				    '<div class="title_011">{name}</div>',
				    '<div class="title_044">LV:{lv}</div>',
				'</div>',
				'<div class="inlinediv">',
				    '<div class="title_022">单位:{classnote}</div>',
				    '<div class="title_055">数量:{count}</div>',
				'</div>',
				 '<div class="title_023">描述：{description}</div>',
			  '</div>',
			'</tpl>'
        ); 
        
var dataviewuser = Ext.create('Ext.DataView',{
			id:'datatviewuserid',
			flex:4,
			store:bugstore,
			baseCls:'user',
			itemid:'bugsitemid',
			itemTpl:bugTemplate,
			height:'100%',
		});

var dataviewdepot = Ext.create('Ext.DataView',{
			id:'depotlistid',
			store:depotstore,
			baseCls:'depot',
			itemid:'depotitemid',
			itemTpl:depotTemplate,
			height:'100%'
		});
		
//根据选择条件进行排序
function sortStore(thisself,sortFact){
	Ext.getCmp('datatviewuserid').config.index = -1;
	var st = thisself.getText();
	var type = '';
	var prest='';
	var indexpos = st.indexOf('▲');
	if(indexpos == -1){
		indexpos = st.indexOf('▼');
		prest = st.substring(0,indexpos);
		thisself.setText((prest+'▲'));
		type = 'desc';
	}else{
		prest = st.substring(0,indexpos);
		thisself.setText((prest+'▼'));
		type = 'asc';
	}
								
	bugstore.setRemoteSort(false);
	bugstore.sort({
		property:sortFact,
		direction:type
	});
}

Ext.define('Insectgame.view.Playmain',{
	extend:'Ext.Panel',
	xtype:'playmainview',
	
	config:{
		id:'playmainview',
		styleHtmlCls:'padding:230px',
		layout:{
				type:'vbox',
				align:'stretch'
			},
		items:[
				{
					id:'topcarousel',
					xtype:'carousel',
					flex:108,
					directions:'horizontal',
					defaults:{
						styleHtmlContent:true,
					},
					listeners:{
						activeitemchange:function(thisself,value,oldvalue,eOpts){
							console.log('activeitemchange');
							var i = this.getActiveIndex();
							tabToTargetColor(i);
						}
					},
					items:[
						{
							xtype:'panel',
							id:'homepanel',
							html:'<canvas id="canvasid" style="margin:0px;padding:0px;"></canvas>',
							style:'background-color:#D6F6DB',
							styleHtmlCls:'padding:0',
							items:[
								{
									xtype:'img',
									src:'static/images/uplevel.png',
									id:'uplv',
									height:41,
									width:150,
									top:325,
									left:146,
								},
								{
									xtype:'img',
									src:'static/images/help4.png',
									id:'help4',
									height:40,
									width:40,
									top:325,
									left:146,
								},
								{
									xtype:'img',
									src:'static/images/warning43.png',
									id:'warning',
									height:40,
									width:40,
									top:325,
									left:146,
								},
								{
									xtype:'img',
									src:'static/images/save.png',
									id:'save',
									height:30,
									width:30,
									top:325,
									left:146,
								},
								{
									xtype:'label',
									id:'labelnums',
									html:'label',
									top:45,
									left:125
								},
								{
									xtype:'label',
									id:'labelfoodnums',
									html:'label',
									top:97,
									left:180
								}
							]
						},
						{
							xtype:'panel',
							iconCls:'lightning',
							id:'buglist',
							layout:{
								type:'hbox',
								align:'stretch'
							},
							items:[
								{
									flex:1.1,
									style:'background-color:black',
									layout:{
										type:'vbox',
										align:'stretch',
									},
									defaults:{
										xtype:'button',
										flex:1
									},
									items:[
										{
											text:'转化幼虫<br/>10%/次',
											//iconCls:'home',
											iconAlign:'top',
											style:getBtnCls(),
											handler:function(thisself,e,eopts){
												var sobj = Ext.getCmp('datatviewuserid').getSelection()[0];
												if(sobj == null){
													Ext.Msg.alert('请先选择虫族');
													return;
												}
												
												bugstore.setRemoteSort(true);
												var num = Math.floor(Math.random()*100);
												sobj.set('count',num);
												//    
												var records = bugstore.getRange();
												var jsonSt = Ext.encode(Ext.pluck(records,'data'));
												localStorage[titleArray[keyinfos.bugskey].localkey] = jsonSt;
											}
										},
										{
											text:'进化基因',
											iconAlign:'top',
											style:getBtnCls(),
											handler:function(thisself,e,eopts){
												console.log('进化基因');
												    
												var tmp = depotstore;
												var obj = depotstore.getRange();
												
											}
										},
										{
											text:'级别排序▲',
											iconAlign:'top',
											style:getBtnCls(),
											handler:function(thisself,e,eopts){
												sortStore(thisself,'lv')
											}
										},
										{
											text:'数量排序▲ ',
											iconAlign:'top',
											style:getBtnCls(),
											handler:function(thisself,e,eopts){
												sortStore(thisself,'count')
											}
										},
										{
											text:'种类排序▲ ',
											iconAlign:'top',
											style:getBtnCls(),
											handler:function(thisself,e,eopts){
												sortStore(thisself,'class');
											}
										}
									]
								},
								dataviewuser
							],
							title:'列表',
							style:'background-color:#191919'
						},
							panelc3
						,
						{
							id:'depotdataviewid',
							html:'Four',
							style:'background-color:#ccdd99',
							items:[
								dataviewdepot,
							]
						}
					]
				},
				{
					id:'signtoolbar',
					xtype:'panel',
					flex:1,
					layout:{
						type:'hbox',
						align:'stretch',
						xtype:'panel'
					},
					defaults:{
						styleHtmlContent:true,
						flex:1
					},
					listeners:{
						initialize:function(thisself,eOpts){
							tabToTarget(0);
						}
					},
					items:[
						{
							id:'cc1',
							style:'border:1px solid red;border-bottom:none;',
						},
						{
							id:'cc2',
							style:'border:1px solid green;border-bottom:none;',
						},
						{
							id:'cc3',
							style:'border:1px solid blue;border-bottom:none;',
						},
						{
							id:'cc4',
							style:'border:1px solid yellow;border-bottom:none;',
						}
					]
				},
				{
					xtype:'toolbar',
					flex:56,
					docked:'bottom',
					defaults:{
						xtype:'button',
						flex:1,
						layout:{
							type:'hbox'
						}
					},
					items:[
						{
							text:'虫巢',
							handler:function(){
								tabToTarget(0);
							}
						},
						{
							text:'虫族',
							handler:function(){
								tabToTarget(1);
							}
						},
						{
							text:'地图',
							handler:function(){
								tabToTarget(2);
							}
						},
						{
							text:'资源',
							handler:function(){
								tabToTarget(3);
							}
						}
					]
				}
			]
	}
});


