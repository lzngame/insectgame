Ext.define('Insectgame.controller.Login',{
	extend:'Ext.app.Controller',
	config:{
		refs: {  
			mainview:'mainview',
            loginview:'loginview',                        
            txt_name:'#txt_name',
            txt_password:'#txt_password',
            btn_register:'#btn_register',
            btn_login:'#btn_login'
        },
        control:{
            btn_register:{
                 tap:'btn_register_ontap'
            },
            btn_login:{
                tap:'btn_login_ontap'
            },
            loginview:{
            	initialize:function(){
        				var username = localStorage['username'];
        				if(username != null && username.length > 0){
        					//this.redirectTo('main');
        				}
        		}
            }
        },
        routes: {
            'login': 'showLogview'
        }
	},
	btn_login_ontap:function(){
		var username = this.getTxt_name().getValue();
		var pwd = this.getTxt_password().getValue();
		if(username !=null && username.length > 0 && pwd != null && pwd.length > 0){
			console.log('跳转到游戏界面');
			
			Ext.Viewport.animateActiveItem(this.getMainview(),{type:'slide',direction:'left'});
			this.redirectTo('playmain');
		}else{
			Ext.Msg.alert("用户名和密码不能为空！");
		}
		localStorage['username'] = '';
	},
	btn_register_ontap:function(){
		console.log('register tap');
		var username = this.getTxt_name().getValue();
		var pwd = this.getTxt_password().getValue();
		localStorage.username = username;
	},
	showLogview:function(){
		Ext.Viewport.setActiveItem(this.getLoginview());
	},
	checkUsername:function(name,pass){
		
	}
});
