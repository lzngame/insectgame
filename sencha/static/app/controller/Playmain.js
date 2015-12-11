var tabpanelW =0;
var tabpanelH = 0;

var lab;

function drawHomeInfoTxt(jsonst,context){
	var jsonobj = JSON.parse(jsonst)
	context.font = '16px Palatino';
	context.fillStyle = "black";
	context.fillText(jsonobj['home_title'],235,36);
	context.fillText(jsonobj['larva_quantity'],119,47);
	context.fillText(jsonobj['insect_food'],170,90);
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
				//url:'static/bookInfo.json',
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
		},
		control:{
			playmainview:{
				activate:'onactivate'
			},
			uplv:{
                tap:'uplv_onclick'
            },
            dataviewuser:{
            	itemsingletap:'item_ontap'
            }
		},
		routes:{
			'playmain':'showPlaymainview'
		},
		
	},
	onactivate:function(){
		console.log('playcontrol activate event');
		setCanvasSize();
		createCanvas();
	},
	showPlaymainview:function(){
		Ext.Viewport.setActiveItem(this.getPlaymainview());
	},
	uplv_onclick:function(){
		//Ext.Msg.alert(systemTime.toString());
		console.log(systemTime);
		console.log(tick);
		Ext.Viewport.animateActiveItem(this.getLoginview(),{type:'slide',direction:'right'});
		this.redirectTo('login');
	},
	item_ontap:function(thisself,index,item,record,e){
        console.log(item);
        console.log(record);
        var data={str_value:'模板文字'};
        var panel = Ext.create('Ext.Panel',{
										id:'tmppanel011',
										width:'100%',
										height:'100%',
										zIndex:999,
										top:'0px',
										left:'0px',
										showAnimation: {
            								type: 'popIn',
            								duration: 250,
            								easing: 'ease-out'
        								},
        								hideAnimation:{
        									type:'popOut',
        									duration:250,
        									easing:'ease-out'
        								},
        								modal:true,
        								listeners:{
        									hide:function(){
        										console.log('after hide');
        										Ext.Viewport.remove(panel,true);
        									}
        								},
        								layout:{
        									type:'vbox',
        									aligh:'stretch'
        								},
        								items:[
        									{
        										flex:8,
        										style:'background-color:#889933',
        										html:tpl.apply(datatpl)
        									},
        									{
        										flex:1,
        										html:'孵化幼虫为成虫',
        										style:'background-color:#889955',
        									},
        									{
        										flex:1,
        										xtype:'formpanel',
        										id:'formpanel',
        										layout:{
        											type:'hbox',
        											height:'45px',
        										},
        										items:[
        											
        											{
        												flex:4,
        												xtype:'textfield',
        												labelWidth:'30%',
        												styleHtmlCls:'font-size:0.7em',
        												width:'80%',
        												height:'45px',
        												id:'spn_age',
        												name:'age',
        												label:'购买数量',
        												minValue:1,
        												increment:1000,
        												listeners:{
        													change:function(thisself,newValue,oldValue,eOpts){
        														console.log(newValue);
        													}
        												},
        											},
        											{
        												flex:1,
        												xtype:'button',
        												text:'确定',
        												width:'150%',
        												height:'45px',
        												handler:function(){
        													console.log('sure');
        												}
        											}
        										]
        									},
        									{
        										flex:1,
        										html:'分配任务',
        										height:'30px',
        										style:'background-color:#889955',
        									},
        									{
        										flex:1,
        										style:'background-color:#339933',
        										xtype:'segmentedbutton',
        										height:'45px',
        										styleHtmlCls:'padding:14px 0 0 0',
        										items:[
        											{text:'觅食',width:'33%',pressed: true},{text:'建筑',width:'33%'},{text:'搜索',width:'33%'}
        										]
        									},
        									{
        										xtype:'button',
        										text:'返回',
        										width:'70px',
        										height:'48px',
        										top:'232px',
        										left:'1px',
        										handler:function(){
        											panel.hide({type: 'slideOut', direction: 'down',duration:100});
        											//this.getParent().hide({type: 'slideOut', direction: 'down',duration:100});
        										}
        									}
        								]
        								
									});
									panel.element.on("tap",function(target,e,eOpts){
										console.log('out');
										
			 							//panel.hide({type: 'slideOut', direction: 'down',duration:100});
			 							//panel.hide(panel.config.hideAnimation);
			 							
		 							});
									Ext.Viewport.add(panel);
									//panel.show({type: 'slide', direction: 'down'});
									panel.show(panel.config.showAnimation);
    }
});
