Ext.define('Insectgame.view.Main',{
	extend:'Ext.Panel',
	xtype:'mainview',
	
	config:{
		id:'mainview',
		layout:'fit',
		fullscreen:true,
		html:'This is MainView',
		items:[
			{
				id:'mytoolbar',
				docked:'top',
				xtype:'toolbar',
				items:[
					{
						xtype:'button',
						id:'AboutButton',
						text:'AboutButton'
					}
				]
			},
			
		]
	}
});
