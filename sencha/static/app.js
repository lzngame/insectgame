Ext.Loader.setConfig({
	paths:{
        'app':'static/app'   
    }
});

Ext.application({
	name:'Insectgame',
    appFolder:'static/app',
	requires:[
		'Ext.MessageBox'
	],
	
	controllers:['Login', 'Main','About'],
	views:['Login','Main','About'],
	launch:function(){
		Ext.Viewport.add(Ext.create('Insectgame.view.Login'));
	}
});
