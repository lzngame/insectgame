Ext.require(['Ext.Carousel','Ext.Label']);
var dataclr = ['red','green','blue','yellow'];

var r1 = 35;
var r2 = r1*Math.sin(Math.PI/3);
var r3 = r1*Math.cos(Math.PI/3);

var searchBtnX = 290;
var searchBtnY = 397;



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
	context.strokeRect(5,5,270,370);
	context.fillStyle ="#454545";
	context.fillRect(7,7,264,364);
	context.drawImage(img_map,0,0,img_map.width,img_map.height,15,15,250,350);
	
	context.strokeStyle = 'red';'darkolivegreen';
	context.strokeRect(5,376,tabpanelW-10,tabpanelH -378);
	context.fillText('曼普多提大陆     当前地图：危险丛林',10,375+15);
	context.fillText('当前探索进度：★★★★☆☆',10,375+30);
	
	drawScaleImg(context,'slice18_18.png',276,5,1);
	drawScaleImg(context,'slice21_21.png',276,5+1*57,1);
	drawScaleImg(context,'slice25_25.png',276,5+2*57,1);
	drawScaleImg(context,'slice23_23.png',276,5+3*57,1);
	drawScaleImg(context,'slice07_07.png',276,5+4*57,1);
	drawScaleImg(context,'slice24_24.png',276,5+5*57,1);
	
	drawScaleImg(context,'slice10_10.png',86,86,1);
	drawScaleImg(context,'slice94_94.png',171,216,1);
	
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
			
			
	for(var i=0;i<19;i++){
		for(var j=0;j<19;j++){
			var xpos =  getHexPos(j,i)[0];
			var ypos =  getHexPos(j,i)[1];
			drawHexagon(context,xpos,ypos,r1,clr,clrborder,1);
			context.fillStyle = 'blue';
			context.fillText(j.toString()+','+i.toString(),xpos-8,ypos);
		}
	}
	
	
	for(var i=0;i<mapdata.length;i++){
		if(mapdata[i][3] != 0){
			var xpos = getHexPos(mapdata[i][0],mapdata[i][1])[0]; 
			var ypos = getHexPos(mapdata[i][0],mapdata[i][1])[1];
			if(mapdata[i][3]){
				drawHexagon(context,xpos,ypos,r1,mapdata[i][2],clrborder,1);
				context.fillStyle = 'red';
				context.fillText(mapdata[i][0].toString()+','+mapdata[i][1].toString(),xpos-1,ypos);
			}
 		}
	}
	
	context.fillText('点击探索地图',tabpanelW/2-40,10);
}

//获取焦点周围
function getFocusRound(x,y){
	var xc1 = x;
	var yc1 = y;
	
	var round1 = [
				[xc1,  yc1-1], //top
				[xc1+1,yc1],  //right top 
				[xc1+1,yc1+1],//right bottom
				[xc1,  yc1+1],  //bottom
				[xc1-1,yc1+1], //left bottom
				[xc1-1,yc1]    //right bottom
				];
				
	if(xc1 % 2 == 0){
			round1[1] =[xc1+1,yc1-1],
			round1[2] =[xc1+1,yc1],
			round1[4] =[xc1-1,yc1],
			round1[5] =[xc1-1,yc1-1];
		}
	return round1;
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

function drawFoucsRound(round,context){
	var clrar =['#ffccdd','#ccddff','#ededfc','#efefaa','#ccffee','#eaefea'];
	var btntxt =['兵巢','工巢','食物','采集','摧毁','返回'];
	for(var i=0;i<round.length;i++){
		var xpos =  getHexPos(round[i][0],round[i][1])[0];
		var ypos =  getHexPos(round[i][0],round[i][1])[1];

		drawHexagon(context,xpos,ypos,r1,clrar[i],'white',1);
		context.fillStyle ='black';
		context.fillText(btntxt[i],xpos-10,ypos);
	}
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
			//debugger;
			console.log('current panel:',this.config.activePanel);
			if(this.config.activePanel == 0){
				this.config.status = -1;
				this.config.currentActive[0]=-1;
				this.config.currentActive[1]=-1;
				drawLargemap();
				this.element.removeListener('tap',tapMapTwo);
				this.element.on('tap',tapMapOne);
			}else if(this.config.activePanel == 1){
				drawHexMap();
				this.element.removeListener('tap',tapMapOne);
				this.element.on('tap',tapMapTwo);
			}
			
		},
		deactivate:function(){
			var context = $('canvasid2').getContext('2d');
			context.clearRect(0,0,tabpanelW,tabpanelH);
			this.config.status = -1;
			this.config.currentActive[0]=-1;
			this.config.currentActive[1]=-1;
			this.removeAll();
		}
	}
});



function tapMapOne(thisself,e,t,eopt){
	console.log('tapmapone');
	var canvas = $('canvasid2');
	var context = canvas.getContext("2d");
	var tapx = thisself.pageX;
	var tapy = thisself.pageY;
	console.log(getDis(tapx,tapy,283,397));
	
	if(getDis(tapx,tapy,283,397) < 30){
		panelc3.element.removeListener('tap',tapMapOne);
		panelc3.element.on('tap',tapMapTwo);
		context.clearRect(0,0,tabpanelW,tabpanelH);
		drawHexMap();
		panelc3.config.activePanel = 1;
	}
	
}

function tapMapTwo(thisself,e,t,eopt){
	console.log('tapmaptwo');
	var canvas = $('canvasid2');
	var context = canvas.getContext("2d");
	context.clearRect(0,0,tabpanelW,tabpanelH);
	drawHexMap();
	
	var tapArray = getTapFocus(thisself.pageX,thisself.pageY);
	var xcoodr = tapArray[0];
	var ycoodr = tapArray[1];
	
	if(panelc3.config.status == 0){
		var roundtmp = getFocusRound(panelc3.config.currentActive[0],panelc3.config.currentActive[1]);
		var re = checkRound(roundtmp,xcoodr,ycoodr);
		if(re != -1){
			console.log('执行事件：%d',re);
			if(re == 5){
				panelc3.element.removeListener('tap',tapMapTwo);
				panelc3.element.on('tap',tapMapOne);
				context.clearRect(0,0,tabpanelW,tabpanelH);
				drawLargemap();
				panelc3.config.activePanel = 0;
			}else{
				setMapdata(panelc3.config.currentActive[0],panelc3.config.currentActive[1]);
				context.clearRect(0,0,tabpanelW,tabpanelH);
				drawHexMap();
			}
			panelc3.config.status = -1;
			panelc3.config.currentActive[0]=-1;
			panelc3.config.currentActive[1]=-1;
			return;
		}
	}
	
	var round1 = getFocusRound(xcoodr,ycoodr);
	
	
	if(panelc3.config.currentActive[0] == xcoodr && panelc3.config.currentActive[1] == ycoodr){
			console.log('点击原来的点');
			panelc3.config.status = -1;
			panelc3.config.currentActive[0]=-1;
			panelc3.config.currentActive[1]=-1;
			//debugger;
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
			drawHexagon(context,xpos,ypos,r1/2,'blue','yellow',1);
			drawFoucsRound(round1,context);
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
				fields:['worker_type','worker_lv','worker_quantity']
			}
		});
		
var store = Ext.create('Ext.data.Store',{
			model:'User',
			data:data1,
		});

var dataviewuser = Ext.create('Ext.DataView',{
			id:'datatviewuserid',
			flex:4,
			store:store,
			baseCls:'user',
			itemid:'ttttttt',
			itemTpl:'<div class="leftdiv"><div class="title_01">{worker_type}</div><div class="title_02">{worker_lv}</div><div class="title_03">{worker_quantity}</div></div><div class="rightdiv">LV 10</div>"',
			height:'100%',
		});

var dataviewuser2 = Ext.create('Ext.DataView',{
			id:'datatviewuserid2',
			store:store,
			baseCls:'user',
			itemid:'ttttttt2i',
			itemTpl:'<div class="leftdiv"><div class="title_01">{worker_type}</div><div class="title_02">{worker_lv}</div><div class="title_03">{worker_quantity}</div></div><div class="rightdiv">LV 10</div>"',
			height:'100%',
		});

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
							items:[
								{
									xtype:'img',
									src:'static/images/uplevel.png',
									id:'uplv',
									height:41,
									width:150,
									top:345,
									left:36,
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
											handler:function(thisself,e,eopts){
												var boj = store.getAt(1);
												console.log(boj);
												//boj.set('worker_type','谢谢盟主');
												var records = store.getRange();
												var jsonSt = Ext.encode(Ext.pluck(records,'data'));
												
											}
										},
										{
											text:'进化基因',
											iconAlign:'top',
											handler:function(thisself,e,eopts){
												
											}
										},
										{
											text:'级别排序',
											iconAlign:'top',
											handler:function(thisself,e,eopts){
												
											}
										},
										{
											text:'数量排序 ',
											iconAlign:'top',
											handler:function(thisself,e,eopts){
											}
										},
										{
											text:'种类排序 ',
											iconAlign:'top',
											handler:function(thisself,e,eopts){
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
							id:'c4',
							html:'Four',
							style:'background-color:#ccdd99',
							items:[
								dataviewuser2,
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
							console.log('init signtoolbar');
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


