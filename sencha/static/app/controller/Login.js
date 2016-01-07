Ext.define('Insectgame.controller.Login',{
	extend:'Ext.app.Controller',
	init:function(){
		console.log('login view init');
	},
	config:{
		refs: {  
			mainview:'mainview',
            loginview:'loginview',    
            btnplay:'#btn_play',
            btnclear:'#btn_clear'
        },
        control:{
        	loginview:{
				activate:'onloginActive'
			},
			btnplay:{
				tap:'btn_login_ontap'
			},
			btnclear:{
				tap:'btn_clear_ontap'
			},
        },
        routes: {
            'login': 'showLogview'
        } 
	},
	onloginActive:function(){
		console.log('login view activate');
		loadLogingLocalData();
	},
	btn_login_ontap:function(){
		Ext.Viewport.animateActiveItem(this.getMainview(),{type:'slide',direction:'left'});
		this.redirectTo('playmain');
	},
	btn_clear_ontap:function(){
		localStorage.clear();
	},
	showLogview:function(){
		Ext.Viewport.setActiveItem(this.getLoginview());
	},
});

function loadLogingLocalData(){
		var d = new Date();
		var nowst = d.toLocaleString();
		var name = localStorage['username'];
		if(name != null && name.length > 0){
			console.log('用户:%s  %s 登陆',name,nowst);
			initOldUserData();
		}else{
			console.log('首次登陆');
			var username ='user_'+ d.getTime().toString();
			console.log(nowst);
			localStorage['username'] = username;
			initNewUserData();
		}
}

function checkFinished(){
	var finished = true;
	for(var item in titleArray){
		if(!titleArray[item].finishedid){
			console.log('not finished:%s',item);
			finished = false;
			break;
		}
	}
	if(finished && mapArray[keyinfos.mapkey].finishedid){
		console.log('可以开始了');
		initDepotdata();
		initBugsdata();
		Ext.Viewport.setMasked(false);
	}
}


function initNewUserData(){
	Ext.Viewport.setMasked({xtype:'loadmask',message:'Insect资源加载...'});
	for(var item in titleArray){
		var jsonurl = item;
		Ext.Ajax.request({
				url:item,
				success:function(response){
					var txt = response.responseText;
					var urlst = response.request.options.url;
					titleArray[urlst].finishedid = true;
					titleArray[urlst].infoobj = JSON.parse(txt);
					localStorage[titleArray[urlst].localkey] = txt;
					console.log('%s:loaded',urlst);
					if(titleArray[keyinfos.homeinfokey].finishedid && ismapdataReady){
						console.log('开始载入地图数据');
						ismapdataReady = false;
						var urltmp = '/getcurrentmap/'+ titleArray[keyinfos.homeinfokey].infoobj['hatch_speed'];
						loadMapdata(urltmp);
						console.log(urltmp);
					}
					checkFinished();
				},
				 failure: function(response, opts) {
        			console.log('server-side failure with status /getinsectinfo/bugs' + response.status);
        			Ext.Msg.alert('服务器数据错误');
    			}
			});
	}
}

function loadMapdata(urltmp){
	Ext.Ajax.request({
			url:urltmp,
			success:function(response){
						console.log('载入地图数据成功');
						mapArray[keyinfos.mapkey].infoobj = JSON.parse(response.responseText);
						localStorage[mapArray[keyinfos.mapkey].localkey] = response.responseText;
						mapArray[keyinfos.mapkey].finishedid = true;
						checkFinished();
					},
			failure: function(response, opts) {
        				console.log('server-side failure with status /getinsectinfo/bugs' + response.status);
        				Ext.Msg.alert('服务器数据错误');
    				}
		});
}

function loadNewMapdata(urltmp,mapid){
	Ext.Ajax.request({
			url:urltmp,
			success:function(response){
						console.log('载入下一站地图数据成功');
						mapArray[keyinfos.mapkey].infoobj = JSON.parse(response.responseText);
						localStorage[mapArray[keyinfos.mapkey].localkey] = response.responseText;
						mapArray[keyinfos.mapkey].finishedid = true;
						Ext.Viewport.setMasked(false);
						titleArray[keyinfos.homeinfokey].infoobj['hatch_speed'] = mapid;
						saveData('homedata');
						clearCanvas();
						drawHexMap();
					},
			failure: function(response, opts) {
        				console.log('server-side failure with status /getinsectinfo/bugs' + response.status);
        				Ext.Msg.alert('服务器数据错误');
    				}
		});
}

function initOldUserData(){
	for(var item in titleArray){
		var obj = titleArray[item];
		var localkey = obj.localkey;
		var txt = localStorage[localkey];
		titleArray[item].infoobj = JSON.parse(txt);
	}
	var maptxt = localStorage[mapArray[keyinfos.mapkey].localkey];
	mapArray[keyinfos.mapkey].infoobj = JSON.parse(maptxt);
	initDepotdata();
	initBugsdata();
}
