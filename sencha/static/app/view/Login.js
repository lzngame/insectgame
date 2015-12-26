Ext.define('Insectgame.view.Login',{
	extend:'Ext.Panel',
	xtype:'loginview',
	
	config:{
		id:'loginview',
		items:[
					{
						id:'loginpanel',
						xtype:'panel',
						style:'background:#000000 url("static/images/title.png") no-repeat center center fixed',
						height:'100%',
						width:'100%'
						
					},
					{
						id:'btn_play',
						xtype:'button',
						text:'进入游戏',
						width:'30%',
						height:50,
						top:'60%',
						left:'35%'
					},
					{
						id:'btn_clear',
						xtype:'button',
						text:'Clear',
						width:'30%',
						height:50,
						top:'80%',
						left:'35%'
					}
				]
			}
});
