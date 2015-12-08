Ext.define('MyApp.controller.Optionsview',{
	extend:'Ext.app.Controller',
	config:{
		refs:{
			mainview:'mainview',
			genre:'#genre'
		},
		control:{
			genre:{
				change:'genre_onchange'
			}
		},
		routes:{
			'setHtml/:view':'setHtmlByValue'
		}
	},
	genre_onchange:function(){
		var value = this.getGenre().getValue();
		if(value !='')
			this.redirectTo('setHtml/'+value);
	},
	setHtmlByValue:function(value){
		var valueArray = ['','喜剧','文艺','动作'];
		var idx = valueArray[value];
		var ff = this.getMainview();
		this.getMainview().setHtml(idx);
	}
});
