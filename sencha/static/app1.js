Ext.require('Ext.Carousel');
Ext.application({
	name:'Myapp',
	launch:function(){
		var dataclr = ['red','green','blue','yellow']
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
		
		var panel = Ext.create('Ext.Panel',{
			id:'mypanel',
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
						listeners:{
							show:function(){
								console.loe('show event');
							}
						}
					},
					listeners:{
						activeitemchange:function(thisself,value,oldvalue,eOpts){
							var i = this.getActiveIndex();
							tabToTarget(i);
						}
					},
					items:[
						{
							id:'c1',
							html:'One',
							style:'background-color:#ffccdd'
						},
						{
							id:'c2',
							html:'Two',
							style:'background-color:#787863'
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
							text:'One',
							handler:function(){
								tabToTarget(0);
							}
						},
						{
							text:'Two',
							handler:function(){
								tabToTarget(1);
							}
						},
						{
							text:'Three',
							handler:function(){
								tabToTarget(2);
							}
						},
						{
							text:'Four',
							handler:function(){
								tabToTarget(3);
							}
						}
					]
				}
			]
		});
		Ext.Viewport.add(panel);
	}
});
