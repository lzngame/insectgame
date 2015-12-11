Ext.require(['Ext.Carousel','Ext.Label']);
var dataclr = ['red','green','blue','yellow'];

function tabToTarget(targetIndex){
			var carousel = Ext.getCmp('topcarousel');
			var currentIndex = carousel.getActiveIndex();
			var dis = targetIndex - currentIndex;
			
			var row = Ext.getCmp('signtoolbar');
			var signs = row.getItems().items;
			
			for(var i=0;i<Math.abs(dis);i++){
				if(dis > 0)
					carousel.next();
				else
					carousel.previous();
				
			}
			for(var i=0;i<signs.length;i++){
				if(i == targetIndex)
					signs[targetIndex].setStyle('background-color:'+dataclr[i]);
				else
					signs[i].setStyle("background-color:white");
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
			data:data1
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
							var i = this.getActiveIndex();
							tabToTarget(i);
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
									top:5,
									left:36
								}
							]
						},
						{
							xtype:'panel',
							iconCls:'lightning',
							id:'listmain',
							layout:{
								type:'hbox',
								align:'stretch'
							},
							items:[
								{
									flex:1,
									style:'background-color:black',
									items:[
										{
											xtype:'button',
											text:'甲壳战虫',
											iconCls:'home',
											padding:'1em',
											iconAlign:'top',
										},
										{
											xtype:'button',
											text:'战力排序<br/>要换行',
											height:100,
									
										},
										{
											xtype:'button',
											text:'负重工虫',
											iconAlign:'top',
											iconCls:'maps ico roseRed',
											padding:'1em'
										}
									]
								},
								dataviewuser
							],
							title:'列表',
							style:'background-color:#191919'
						},
						{
							id:'c3',
							html:'Three',
							style:'background-color:#ffddaa'
						},
						{
							id:'c4',
							html:'Four',
							style:'background-color:#ccdd99'
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
